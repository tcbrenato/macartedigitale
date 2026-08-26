-- Phase: QR codes. Run this once in the Supabase SQL Editor, after 0001_init.sql.

alter table public.profiles add column if not exists qr_code_url text;

insert into storage.buckets (id, name, public)
values ('qrcodes', 'qrcodes', true)
on conflict (id) do nothing;

drop policy if exists "QR codes are publicly readable" on storage.objects;
create policy "QR codes are publicly readable"
  on storage.objects for select
  using (bucket_id = 'qrcodes');

drop policy if exists "Owners can upload their own qr codes" on storage.objects;
create policy "Owners can upload their own qr codes"
  on storage.objects for insert
  with check (bucket_id = 'qrcodes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Owners can update their own qr codes" on storage.objects;
create policy "Owners can update their own qr codes"
  on storage.objects for update
  using (bucket_id = 'qrcodes' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "Owners can delete their own qr codes" on storage.objects;
create policy "Owners can delete their own qr codes"
  on storage.objects for delete
  using (bucket_id = 'qrcodes' and (storage.foldername(name))[1] = auth.uid()::text);
