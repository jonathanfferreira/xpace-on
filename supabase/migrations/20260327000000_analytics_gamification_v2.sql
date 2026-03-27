-- Migration: Watch Time Analytics & Referral Waitlist
-- Dados de engajamento real e loop viral de indicação

-- 1. WATCH EVENTS (Analytics de Engajamento Real)
create table if not exists public.watch_events (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  started_at timestamp with time zone default now() not null,
  ended_at timestamp with time zone,
  percent_watched numeric(5,2) default 0,
  duration_seconds integer default 0,
  created_at timestamp with time zone default now() not null
);

create index idx_watch_events_user on public.watch_events(user_id);
create index idx_watch_events_lesson on public.watch_events(lesson_id);
create index idx_watch_events_created on public.watch_events(created_at);

alter table public.watch_events enable row level security;

create policy "Users can insert own watch events"
  on public.watch_events for insert
  with check (user_id = auth.uid());

create policy "Users can view own watch events"
  on public.watch_events for select
  using (user_id = auth.uid());

create policy "Tenant owners can view student watch events"
  on public.watch_events for select
  using (
    exists (
      select 1 from public.lessons l
      join public.courses c on c.id = l.course_id
      join public.tenants t on t.id = c.tenant_id
      where l.id = watch_events.lesson_id and t.owner_id = auth.uid()
    )
  );

-- 2. WAITLIST REFERRALS (Loop Viral)
alter table public.waitlist
  add column if not exists referral_code text unique,
  add column if not exists referred_by text,
  add column if not exists referral_count integer default 0;

create index if not exists idx_waitlist_referral on public.waitlist(referral_code);

-- 3. COURSE RATINGS (Reviews de Alunos)
create table if not exists public.course_ratings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  course_id uuid references public.courses(id) on delete cascade not null,
  rating integer not null check (rating >= 1 and rating <= 5),
  review text,
  created_at timestamp with time zone default now() not null,
  unique(user_id, course_id)
);

create index idx_ratings_course on public.course_ratings(course_id);

alter table public.course_ratings enable row level security;

create policy "Users can rate enrolled courses"
  on public.course_ratings for insert
  with check (
    user_id = auth.uid() and
    exists (
      select 1 from public.enrollments
      where user_id = auth.uid() and course_id = course_ratings.course_id and status = 'active'
    )
  );

create policy "Anyone can read ratings"
  on public.course_ratings for select
  using (true);

create policy "Users can update own ratings"
  on public.course_ratings for update
  using (user_id = auth.uid());

-- 4. BADGES/ACHIEVEMENTS (Gamification 2.0)
create table if not exists public.badges (
  id uuid default uuid_generate_v4() primary key,
  slug text unique not null,
  name text not null,
  description text,
  icon_url text,
  category text not null check (category in ('progress', 'streak', 'exploration', 'social', 'special')),
  xp_reward integer default 0,
  condition_type text not null,
  condition_value integer not null default 1,
  created_at timestamp with time zone default now() not null
);

create table if not exists public.user_badges (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  badge_id uuid references public.badges(id) not null,
  unlocked_at timestamp with time zone default now() not null,
  unique(user_id, badge_id)
);

alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

create policy "Anyone can view badges" on public.badges for select using (true);
create policy "Users can view own badges" on public.user_badges for select using (user_id = auth.uid());
create policy "System can insert badges" on public.user_badges for insert with check (user_id = auth.uid());

-- Seed: Badges iniciais do sistema
insert into public.badges (slug, name, description, category, xp_reward, condition_type, condition_value) values
  ('first_lesson', 'Primeira Aula', 'Completou sua primeira aula na plataforma', 'progress', 50, 'lessons_completed', 1),
  ('five_lessons', 'Dedicado', 'Completou 5 aulas', 'progress', 100, 'lessons_completed', 5),
  ('twenty_lessons', 'Veterano', 'Completou 20 aulas', 'progress', 250, 'lessons_completed', 20),
  ('fifty_lessons', 'Mestre', 'Completou 50 aulas', 'progress', 500, 'lessons_completed', 50),
  ('streak_3', 'Consistente', '3 dias seguidos de treino', 'streak', 75, 'streak_days', 3),
  ('streak_7', 'Imparável', '7 dias seguidos de treino', 'streak', 150, 'streak_days', 7),
  ('streak_30', 'Lendário', '30 dias seguidos de treino', 'streak', 500, 'streak_days', 30),
  ('explorer_3', 'Explorador', 'Assistiu aulas de 3 estilos diferentes', 'exploration', 100, 'unique_styles', 3),
  ('explorer_5', 'Poliglota', 'Assistiu aulas de 5 estilos diferentes', 'exploration', 200, 'unique_styles', 5),
  ('first_rating', 'Crítico', 'Avaliou seu primeiro curso', 'social', 25, 'ratings_given', 1)
on conflict (slug) do nothing;

-- 5. REFERRAL RPC (Incrementa contagem de indicações na waitlist)
create or replace function public.increment_referral_count(ref_code text)
returns void as $$
begin
  update public.waitlist
  set referral_count = coalesce(referral_count, 0) + 1
  where referral_code = ref_code;
end;
$$ language plpgsql security definer;
