-- Migration: cascade-delete user_content + usage_counters when a user is deleted.
-- These two tables had a bare user_id (no FK), so deleting a user via the Supabase
-- dashboard or any path other than delete-account.js would orphan their rows
-- (privacy/GDPR + storage bloat). delete-account.js cleans them manually today; this
-- makes it automatic. Idempotent — safe to run more than once.

-- 1) Drop any orphaned rows first so the foreign key can attach.
delete from public.user_content
  where user_id is not null and user_id not in (select id from auth.users);
delete from public.usage_counters
  where user_id is not null and user_id not in (select id from auth.users);

-- 2) (Re)create the cascading foreign keys.
alter table public.user_content  drop constraint if exists user_content_user_id_fkey;
alter table public.user_content
  add constraint user_content_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;

alter table public.usage_counters drop constraint if exists usage_counters_user_id_fkey;
alter table public.usage_counters
  add constraint usage_counters_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;
