-- Migration: 20260223000000_init_schema.sql
-- Description: First sprint database foundation (XPACE ON)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Global Account)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null check (role in ('admin', 'professor', 'escola', 'aluno')) default 'aluno',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TENANTS TABLE (Escola/Professor configs)
create table public.tenants (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.users(id) not null,
  name text not null,
  slug text unique,
  brand_color text default '#7000F0',
  logo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. COURSES TABLE
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  tenant_id uuid references public.tenants(id) not null,
  title text not null,
  description text,
  price numeric(10, 2) not null check (price >= 39.90), -- Business rule: Ticket Floor
  thumbnail_url text,
  is_published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. LESSONS TABLE (Modules and Videos)
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade not null,
  module_name text not null,
  title text not null,
  description text,
  video_id text, -- ID at bunny.net
  order_index integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ENROLLMENTS (Purchases Pivot)
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  course_id uuid references public.courses(id) not null,
  status text not null check (status in ('active', 'cancelled', 'expired')) default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, course_id)
);

-- 6. PROGRESS TABLE (Gamification & completion)
create table public.progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  lesson_id uuid references public.lessons(id) not null,
  completed boolean default false,
  completed_at timestamp with time zone,
  xp_awarded integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, lesson_id)
);

-- 7. TRANSACTIONS TABLE
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) not null,
  course_id uuid references public.courses(id) not null,
  amount numeric(10, 2) not null,
  asaas_payment_id text,
  status text not null check (status in ('pending', 'confirmed', 'failed', 'refunded')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================================
-- SECURITY MATTERS: ROW LEVEL SECURITY (RLS) & RBAC POLICIES
-- =========================================================================================

alter table public.users enable row level security;
alter table public.tenants enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress enable row level security;
alter table public.transactions enable row level security;

-- USERS POLICIES (Global)
-- Users can read their own data; Admin can read all
create policy "Users can read own data" on public.users for select
using (auth.uid() = id);

create policy "Admins can read all users" on public.users for select
using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- TENANTS POLICIES
-- Public can read tenants (for profiles and white-label login configs)
create policy "Tenants are viewable by everyone" on public.tenants for select
using (true);

-- Owners can manage their tenants
create policy "Owners can manage their tenants" on public.tenants for all
using (auth.uid() = owner_id);

-- COURSES POLICIES
-- Public can read published courses
create policy "Published courses are viewable by everyone" on public.courses for select
using (is_published = true);

-- Tenant owners can fully manage their courses
create policy "Tenant owners can manage their courses" on public.courses for all
using (
  exists (
    select 1 from public.tenants t 
    where t.id = courses.tenant_id and t.owner_id = auth.uid()
  )
);

-- LESSONS POLICIES
-- Enrolled students can read lessons
create policy "Enrolled students can read lessons" on public.lessons for select
using (
  exists (
    select 1 from public.enrollments e 
    where e.course_id = lessons.course_id 
    and e.user_id = auth.uid()
    and e.status = 'active'
  )
);

-- Course owners can fully manage lessons
create policy "Tenant owners can manage lessons" on public.lessons for all
using (
  exists (
    select 1 from public.courses c
    join public.tenants t on t.id = c.tenant_id
    where c.id = lessons.course_id and t.owner_id = auth.uid()
  )
);

-- ENROLLMENTS POLICIES
-- Users can see their own enrollments
create policy "Users can view own enrollments" on public.enrollments for select
using (user_id = auth.uid());

-- Tenant owners can see ALL enrollments for their own courses (Isolamento Multi-tenant)
create policy "Tenant owners can view student enrollments" on public.enrollments for select
using (
  exists (
    select 1 from public.courses c
    join public.tenants t on t.id = c.tenant_id
    where c.id = enrollments.course_id and t.owner_id = auth.uid()
  )
);

-- PROGRESS POLICIES
-- Users can view and update their own progress
create policy "Users can manage own progress" on public.progress for all
using (user_id = auth.uid());

-- Tenant owners can see progress of their students
create policy "Tenant owners can view student progress" on public.progress for select
using (
  exists (
    select 1 from public.lessons l
    join public.courses c on c.id = l.course_id
    join public.tenants t on t.id = c.tenant_id
    where l.id = progress.lesson_id and t.owner_id = auth.uid()
  )
);

-- TRANSACTIONS POLICIES
-- Users can view their own transactions
create policy "Users can view own transactions" on public.transactions for select
using (user_id = auth.uid());

-- Tenant owners can view transactions for their courses
create policy "Tenant owners can view course transactions" on public.transactions for select
using (
  exists (
    select 1 from public.courses c
    join public.tenants t on t.id = c.tenant_id
    where c.id = transactions.course_id and t.owner_id = auth.uid()
  )
);

-- =========================================================================================
-- AUTOMATION: TRIGGER FOR NEW USERS
-- =========================================================================================

-- Handle new user signup creation in public.users automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, avatar_url, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url', 
    coalesce(new.raw_user_meta_data->>'role', 'aluno') -- default role is aluno
  );
  return new;
end;
$$ language plpgsql security definer;

-- Bind trigger to auth.users (System level schema)
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

