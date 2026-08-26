-- Phase: RFID physical card orders. Run after 0001_init.sql and 0002_qr_codes.sql.

create table if not exists public.rfid_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  notes text not null default '',
  status text not null default 'pending' check (status in ('pending', 'contacted', 'completed', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rfid_orders_user_id_idx on public.rfid_orders (user_id);

drop trigger if exists rfid_orders_set_updated_at on public.rfid_orders;
create trigger rfid_orders_set_updated_at
  before update on public.rfid_orders
  for each row
  execute function public.set_updated_at();

alter table public.rfid_orders enable row level security;

-- Single-admin check (Rénato manages RFID orders manually). Update the email here if that changes.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid() and email = 'renatotchobo0@gmail.com'
  );
$$;

drop policy if exists "Users can view their own rfid orders" on public.rfid_orders;
create policy "Users can view their own rfid orders"
  on public.rfid_orders for select
  using (auth.uid() = user_id or public.is_admin());

drop policy if exists "Users can create their own rfid orders" on public.rfid_orders;
create policy "Users can create their own rfid orders"
  on public.rfid_orders for insert
  with check (auth.uid() = user_id);

drop policy if exists "Admin can update rfid orders" on public.rfid_orders;
create policy "Admin can update rfid orders"
  on public.rfid_orders for update
  using (public.is_admin());

-- The admin view joins profiles (for name/phone/email), so it needs read access
-- to every profile, not just published ones or their own.
drop policy if exists "Admin can read all profiles" on public.profiles;
create policy "Admin can read all profiles"
  on public.profiles for select
  using (public.is_admin());
