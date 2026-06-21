-- ============================================================
-- Fluentra · Phase 7b — Media uploads (avatars + post images)
-- Run ONCE in Supabase → SQL Editor → Run. Safe to re-run.
-- ============================================================

-- Public bucket for profile photos + post images
insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true)
on conflict (id) do update set public = true;

-- Anyone can read; you can only write inside your own <uid>/ folder
drop policy if exists "media_read" on storage.objects;
create policy "media_read" on storage.objects
  for select to public using (bucket_id = 'public-media');

drop policy if exists "media_insert_own" on storage.objects;
create policy "media_insert_own" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'public-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "media_update_own" on storage.objects;
create policy "media_update_own" on storage.objects
  for update to authenticated
  using (bucket_id = 'public-media' and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "media_delete_own" on storage.objects;
create policy "media_delete_own" on storage.objects
  for delete to authenticated
  using (bucket_id = 'public-media' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- Done.
-- ============================================================
