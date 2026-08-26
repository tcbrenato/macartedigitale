-- Phase: admin can edit any user's profile. Run after 0001-0004.

drop policy if exists "Admin can update any profile" on public.profiles;
create policy "Admin can update any profile"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admin uploads (photo replacement, QR regeneration) land under the target
-- user's folder, not the admin's — these policies drop the folder-name check
-- for admins so that still works.
drop policy if exists "Admin can upload any photo" on storage.objects;
create policy "Admin can upload any photo"
  on storage.objects for insert
  with check (bucket_id = 'photos' and public.is_admin());

drop policy if exists "Admin can update any photo" on storage.objects;
create policy "Admin can update any photo"
  on storage.objects for update
  using (bucket_id = 'photos' and public.is_admin());

drop policy if exists "Admin can upload any qr code" on storage.objects;
create policy "Admin can upload any qr code"
  on storage.objects for insert
  with check (bucket_id = 'qrcodes' and public.is_admin());

drop policy if exists "Admin can update any qr code" on storage.objects;
create policy "Admin can update any qr code"
  on storage.objects for update
  using (bucket_id = 'qrcodes' and public.is_admin());
