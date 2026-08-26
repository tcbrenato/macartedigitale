-- Phase: connections between users. Run after 0001-0006.

create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references auth.users(id) on delete cascade,
  addressee_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint connections_no_self check (requester_id <> addressee_id),
  constraint connections_unique_pair unique (requester_id, addressee_id)
);

create index if not exists connections_requester_idx on public.connections (requester_id);
create index if not exists connections_addressee_idx on public.connections (addressee_id);

drop trigger if exists connections_set_updated_at on public.connections;
create trigger connections_set_updated_at
  before update on public.connections
  for each row
  execute function public.set_updated_at();

alter table public.connections enable row level security;

drop policy if exists "Users can view their own connections" on public.connections;
create policy "Users can view their own connections"
  on public.connections for select
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

drop policy if exists "Users can create connection requests" on public.connections;
create policy "Users can create connection requests"
  on public.connections for insert
  with check (auth.uid() = requester_id);

drop policy if exists "Participants can update their connection" on public.connections;
create policy "Participants can update their connection"
  on public.connections for update
  using (auth.uid() = requester_id or auth.uid() = addressee_id)
  with check (auth.uid() = requester_id or auth.uid() = addressee_id);

drop policy if exists "Participants can delete their connection" on public.connections;
create policy "Participants can delete their connection"
  on public.connections for delete
  using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Accepted connections can read each other's profile even when visibility is
-- 'connections_only' — this is what finally gives that setting real meaning.
drop policy if exists "Connections can read connections-only profiles" on public.profiles;
create policy "Connections can read connections-only profiles"
  on public.profiles for select
  using (
    status = 'published'
    and exists (
      select 1 from public.connections c
      where c.status = 'accepted'
        and ((c.requester_id = auth.uid() and c.addressee_id = profiles.user_id)
          or (c.addressee_id = auth.uid() and c.requester_id = profiles.user_id))
    )
  );
