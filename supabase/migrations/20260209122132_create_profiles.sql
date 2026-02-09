--------------------------------------------------------
-- EXTENSIONS
--------------------------------------------------------

create extension if not exists "pgcrypto";

--------------------------------------------------------
-- 1. PROFILES TABLE
--------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,

  mobile_number text,
  primary_profession text[],
  secondary_skills text[],
  experience_level text,
  years_of_experience text,
  industry_types text[],
  languages text[],
  portfolio_links jsonb,
  showreel_url text,
  current_city text,
  travel_willingness text,

  onboarding_completed boolean default false,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

--------------------------------------------------------
-- 2. ENABLE RLS
--------------------------------------------------------

alter table public.profiles enable row level security;

--------------------------------------------------------
-- 3. RLS POLICIES
--------------------------------------------------------

-- Users can read their own profile
create policy "Users can read own profile"
on public.profiles
for select
using (auth.uid() = id);

-- Drop old update policy if exists
drop policy if exists "Users can update own profile before completion"
on public.profiles;

-- Secure update policy
-- Blocks:
-- 1. Email changes
-- 2. onboarding_completed changes
create policy "Users can update own profile (restricted)"
on public.profiles
for update
using (auth.uid() = id)
with check (
  auth.uid() = id
  AND email = old.email
  AND onboarding_completed = old.onboarding_completed
);

--------------------------------------------------------
-- 4. AUTO CREATE PROFILE WHEN AUTH USER IS CREATED
--------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email)
  values (
    new.id,
    new.email
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

--------------------------------------------------------
-- 5. AUTO UPDATE updated_at COLUMN
--------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at on public.profiles;

create trigger set_updated_at
before update on public.profiles
for each row execute procedure public.handle_updated_at();

--------------------------------------------------------
-- 6. SECURE RPC TO COMPLETE ONBOARDING
--------------------------------------------------------

create or replace function public.complete_onboarding(
  p_mobile_number text,
  p_primary_profession text[],
  p_secondary_skills text[],
  p_experience_level text,
  p_years_of_experience text,
  p_industry_types text[],
  p_languages text[],
  p_portfolio_links jsonb,
  p_showreel_url text,
  p_current_city text,
  p_travel_willingness text
)
returns void
language plpgsql
security definer
as $$
begin
  update public.profiles
  set
    mobile_number = p_mobile_number,
    primary_profession = p_primary_profession,
    secondary_skills = p_secondary_skills,
    experience_level = p_experience_level,
    years_of_experience = p_years_of_experience,
    industry_types = p_industry_types,
    languages = p_languages,
    portfolio_links = p_portfolio_links,
    showreel_url = p_showreel_url,
    current_city = p_current_city,
    travel_willingness = p_travel_willingness,
    onboarding_completed = true
  where id = auth.uid()
  AND onboarding_completed = false; -- prevents second execution
end;
$$;

grant execute on function public.complete_onboarding to authenticated;
