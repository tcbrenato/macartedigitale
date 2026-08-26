-- Phase: per-field visibility. Run after 0001, 0002, 0003.

alter table public.profiles add column if not exists phone_public boolean not null default true;
alter table public.profiles add column if not exists email_public boolean not null default true;
alter table public.profiles add column if not exists address_public boolean not null default true;
