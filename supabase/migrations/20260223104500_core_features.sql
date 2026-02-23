-- Migration: 20260223104500_core_features.sql
-- Description: Implementação de Ranking, Promoted Courses e Anti-Pirataria Tracker

-- =========================================================
-- FEATURE 1: TOP 10 RANKING (Views Tracker)
-- =========================================================

-- Tabela para rastrear visualizações de aulas
create table public.lesson_views (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  lesson_id uuid references public.lessons(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Índices B-Tree para otimizar a contagem das visualizações da última semana
create index idx_lesson_views_lesson_id on public.lesson_views(lesson_id);
create index idx_lesson_views_created_at on public.lesson_views(created_at);

-- RPC: Obter Top 10 Aulas Assistidas nos últimos X dias
create or replace function public.get_top_10_lessons(days_ago int default 30)
returns table (
  lesson_id uuid,
  lesson_title text,
  module_name text,
  course_title text,
  view_count bigint
) as $$
begin
  return query
  select 
    l.id as lesson_id,
    l.title as lesson_title,
    l.module_name,
    c.title as course_title,
    count(v.id) as view_count
  from public.lesson_views v
  join public.lessons l on l.id = v.lesson_id
  join public.courses c on c.id = l.course_id
  where v.created_at >= now() - (days_ago || ' days')::interval
  group by l.id, l.title, l.module_name, c.title
  order by view_count desc
  limit 10;
end;
$$ language plpgsql security definer;

-- =========================================================
-- FEATURE 2: PROMOTED COURSES (Internal Ads)
-- =========================================================

alter table public.courses 
  add column is_promoted boolean default false,
  add column promotion_tier integer default 0;

create index idx_courses_is_promoted on public.courses(is_promoted) where is_promoted = true;

-- =========================================================
-- FEATURE 3: ANTI-PIRATARIA (Single Active Session Lock)
-- =========================================================

-- Tabela que gerencia as sessões permitidas
create table public.user_sessions (
  user_id uuid references public.users(id) primary key,
  jwt_id text not null, -- refers to auth.sessions
  ip_address text,
  user_agent text,
  last_active_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Trigger Function para capturar novos Logins do Auth Schema e registrar a sessão na Tabela Pública
-- Esta função Invalida (Sobrescreve) qualquer sessão antiga que estivesse na tabela
create or replace function public.track_auth_session()
returns trigger as $$
begin
  -- Se for um novo evento de sign_in / criação de sessão no Supabase Auth
  insert into public.user_sessions (user_id, jwt_id, ip_address, user_agent)
  values (
    new.user_id, 
    new.id::text, 
    new.ip, 
    new.user_agent
  )
  on conflict (user_id) 
  do update set 
    jwt_id = excluded.jwt_id,
    ip_address = excluded.ip_address,
    user_agent = excluded.user_agent,
    last_active_at = now();
    
  return new;
end;
$$ language plpgsql security definer;

-- Associando a Trigger aos inserts do auth.sessions (System Layer do Supabase)
create trigger on_auth_session_created
  after insert on auth.sessions
  for each row execute procedure public.track_auth_session();

-- Setup RLS for the new tables
alter table public.lesson_views enable row level security;
alter table public.user_sessions enable row level security;

-- Lesson Views Policy: Users only insert their own views, cannot read others
create policy "Users can insert own views" on public.lesson_views for insert
with check (user_id = auth.uid());

-- User Sessions Policy: Users can only see their own active session
create policy "Users can view own session tracking" on public.user_sessions for select
using (user_id = auth.uid());

-- RPC Helper: Validar com segurança se o JWT atual pertence a sessão válida na tabela
create or replace function public.is_valid_session()
returns boolean as $$
declare
  curr_sess text;
  db_sess text;
begin
  -- Extrair a Session ID assinada diretamente do Auth Header (Seguro na Cloud)
  curr_sess := auth.jwt() ->> 'session_id';
  
  -- Buscar a sessão mestre/oficial cravada dessa user_id
  select jwt_id into db_sess 
  from public.user_sessions 
  where user_id = auth.uid();

  if db_sess is not null and db_sess != curr_sess then
    return false; -- É outra sessão!
  end if;

  return true;
end;
$$ language plpgsql security definer;
