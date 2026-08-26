-- Phase: card-level visibility (public / link-only / connections-only). Run after 0001-0005.

alter table public.profiles
  add column if not exists visibility text not null default 'public'
  check (visibility in ('public', 'link_only', 'connections_only'));

-- 'connections_only' takes the card off public reach entirely until a connections
-- system exists to grant exceptions; 'public' and 'link_only' behave identically for
-- now (both readable via direct link) since there is no directory yet to distinguish
-- them by. The owner (and the admin) can still read their own row via the other
-- existing policies regardless of this value.
drop policy if exists "Published profiles are publicly readable" on public.profiles;
create policy "Published profiles are publicly readable"
  on public.profiles for select
  using (status = 'published' and visibility <> 'connections_only');
