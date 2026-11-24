-- Shafa Labarin Shuni: Supabase starter schema
-- Run in Supabase SQL Editor. Then create an Auth user and promote it to admin:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<auth-user-uuid>';

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'reader' check (role in ('reader','admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  category text not null default 'Labarai',
  cover_url text,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.episodes (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  title text not null,
  body text not null default '',
  episode_number integer not null default 1,
  audio_url text,
  is_locked boolean not null default false,
  unlock_at timestamptz,
  status text not null default 'draft' check (status in ('draft','published')),
  created_at timestamptz not null default now(),
  unique (story_id, episode_number)
);

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.episodes enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles" on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read published stories" on public.stories;
create policy "Public read published stories" on public.stories for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "Admins manage stories" on public.stories;
create policy "Admins manage stories" on public.stories for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Public read published episodes" on public.episodes;
create policy "Public read published episodes" on public.episodes for select to anon, authenticated using (status = 'published' or public.is_admin());
drop policy if exists "Admins manage episodes" on public.episodes;
create policy "Admins manage episodes" on public.episodes for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Create a Storage bucket named "story-covers" (public) and "story-audio" (private or public)
-- in Supabase Storage. Do not put service_role keys in browser code.
