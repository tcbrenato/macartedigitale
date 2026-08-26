-- Phase: Events (premium, event-scoped Annuaire/Connexions). Run after 0008_contact_messages.sql.
-- Annuaire and Connexions stop being open to every user and become scoped to
-- "events" (e.g. a conference like COPAF 2026) that the admin assigns people
-- to manually. The existing team becomes the first event ("CRF Perfection")
-- so nothing regresses for them.

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.event_members (
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

create index if not exists event_members_user_id_idx on public.event_members (user_id);

alter table public.events enable row level security;
alter table public.event_members enable row level security;

drop policy if exists "Admin manages events" on public.events;
create policy "Admin manages events"
  on public.events for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Members can read their own events" on public.events;
create policy "Members can read their own events"
  on public.events for select
  using (
    exists (select 1 from public.event_members em where em.event_id = events.id and em.user_id = auth.uid())
  );

drop policy if exists "Admin manages event members" on public.event_members;
create policy "Admin manages event members"
  on public.event_members for all
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "Members can read their own membership" on public.event_members;
create policy "Members can read their own membership"
  on public.event_members for select
  using (user_id = auth.uid());

-- Fellow event members can read each other's published profile, regardless
-- of the card's own visibility setting — being added to a private event is
-- itself the access grant. This is additive: the existing public/link-only/
-- connections-only policies from earlier phases are untouched.
drop policy if exists "Event members can read each other's profiles" on public.profiles;
create policy "Event members can read each other's profiles"
  on public.profiles for select
  using (
    status = 'published'
    and exists (
      select 1 from public.event_members mine
      join public.event_members theirs on theirs.event_id = mine.event_id
      where mine.user_id = auth.uid() and theirs.user_id = profiles.user_id
    )
  );

-- Connection requests now require the two people to share at least one event.
drop policy if exists "Users can create connection requests" on public.connections;
create policy "Users can create connection requests"
  on public.connections for insert
  with check (
    auth.uid() = requester_id
    and exists (
      select 1 from public.event_members mine
      join public.event_members theirs on theirs.event_id = mine.event_id
      where mine.user_id = requester_id and theirs.user_id = addressee_id
    )
  );

-- Seed: the existing team (previously free access to Annuaire/Connexions)
-- becomes the first event.
insert into public.events (name, slug)
values ('CRF Perfection', 'crf-perfection')
on conflict (slug) do nothing;

insert into public.event_members (event_id, user_id)
select e.id, p.user_id
from public.events e
join public.profiles p on p.slug in ('renato', 'yvette', 'taofic', 'hermionne', 'jerryda', 'kenethe')
where e.slug = 'crf-perfection' and p.user_id is not null
on conflict do nothing;

-- Extend auto-claim: a seed profile that gets claimed later also joins the
-- CRF Perfection event automatically, so signing up doesn't lose access.
create or replace function public.claim_profile_on_signup()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  crf_event_id uuid;
begin
  update public.profiles
  set user_id = new.id
  where email = new.email and user_id is null;

  select id into crf_event_id from public.events where slug = 'crf-perfection';
  if crf_event_id is not null then
    insert into public.event_members (event_id, user_id)
    select crf_event_id, new.id
    where exists (
      select 1 from public.profiles
      where user_id = new.id
        and slug in ('renato', 'yvette', 'taofic', 'hermionne', 'jerryda', 'kenethe')
    )
    on conflict do nothing;
  end if;

  return new;
end;
$$;
