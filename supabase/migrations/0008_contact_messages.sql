-- Phase: Contact messages (support/RGPD requests). Run after 0007_connections.sql.

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

-- Public form, no login required: anyone (including anonymous visitors) can submit.
drop policy if exists "Anyone can send a contact message" on public.contact_messages;
create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

drop policy if exists "Admin can view contact messages" on public.contact_messages;
create policy "Admin can view contact messages"
  on public.contact_messages for select
  using (public.is_admin());

drop policy if exists "Admin can update contact messages" on public.contact_messages;
create policy "Admin can update contact messages"
  on public.contact_messages for update
  using (public.is_admin());
