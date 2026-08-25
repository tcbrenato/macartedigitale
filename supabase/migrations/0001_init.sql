-- Phase 1: profiles table, RLS, auto-claim trigger, photos storage bucket.
-- Run this once in the Supabase SQL Editor (Dashboard > SQL Editor > New query).

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users (id) on delete set null,
  slug text unique not null,

  first_name text not null,
  last_name text not null,
  organization text not null default '',
  title text not null default '',
  tagline text not null default '',

  photo_url text not null default '',

  phone text not null default '',
  phone_raw text not null default '',
  whatsapp text not null default '',
  email text not null default '',
  url text,

  address text not null default '',
  city text not null default '',
  country_line text not null default '',

  status text not null default 'draft' check (status in ('draft', 'published')),
  template_id text not null default 'classic',
  theme_primary text not null default '#0100AD',
  theme_secondary text not null default '#3a39d0',

  services jsonb not null default '[]'::jsonb,
  social jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_slug_idx on public.profiles (slug);
create index if not exists profiles_email_idx on public.profiles (email);

-- Keep updated_at current on every write.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Row Level Security.
alter table public.profiles enable row level security;

drop policy if exists "Published profiles are publicly readable" on public.profiles;
create policy "Published profiles are publicly readable"
  on public.profiles for select
  using (status = 'published');

drop policy if exists "Owners can read their own profile" on public.profiles;
create policy "Owners can read their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Owners can update their own profile" on public.profiles;
create policy "Owners can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Owners can insert their own profile" on public.profiles;
create policy "Owners can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owners can delete their own profile" on public.profiles;
create policy "Owners can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

-- Auto-claim: link a newly-created auth user to a matching unclaimed profile by email.
create or replace function public.claim_profile_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set user_id = new.id
  where email = new.email and user_id is null;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.claim_profile_on_signup();

-- Storage bucket for profile photos.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

drop policy if exists "Photos are publicly readable" on storage.objects;
create policy "Photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'photos');

drop policy if exists "Owners can upload their own photos" on storage.objects;
create policy "Owners can upload their own photos"
  on storage.objects for insert
  with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Owners can update their own photos" on storage.objects;
create policy "Owners can update their own photos"
  on storage.objects for update
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Owners can delete their own photos" on storage.objects;
create policy "Owners can delete their own photos"
  on storage.objects for delete
  using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
