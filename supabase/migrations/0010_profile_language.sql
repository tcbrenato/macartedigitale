-- Phase: per-card UI language (fr/en). Run after 0009_events.sql.
-- The card's own chrome (Appeler/Call, Site web/Website, the services modal
-- title, etc.) is now translated per profile — the dashboard itself stays
-- French regardless.

alter table public.profiles
  add column if not exists language text not null default 'fr' check (language in ('fr', 'en'));
