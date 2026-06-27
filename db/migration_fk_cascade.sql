-- =====================================================================
--  FLUENTRA — user-delete cascade migration  (idempotent, safe to re-run)
-- =====================================================================
--  WHAT THIS DOES:
--  When an auth user is deleted (Supabase dashboard, delete-account, GDPR
--  request, anything), every row they own should disappear automatically
--  instead of being orphaned. This (re)creates each table's foreign key to
--  auth.users with ON DELETE CASCADE.
--
--  HOW TO RUN: paste the whole file into Supabase -> SQL Editor -> Run.
--  Each block is labelled with its TABLE name so you can see exactly what
--  it touches. Order is child-first so cleanup never trips another FK.
-- =====================================================================


-- =====================================================================
--  TABLE:  post_likes            (user column: user_id)
-- =====================================================================
delete from public.post_likes
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.post_likes drop constraint if exists post_likes_user_id_fkey;
alter table public.post_likes
  add constraint post_likes_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  post_comments         (user column: user_id)
-- =====================================================================
delete from public.post_comments
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.post_comments drop constraint if exists post_comments_user_id_fkey;
alter table public.post_comments
  add constraint post_comments_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  posts                 (user column: author)
-- =====================================================================
delete from public.posts
  where author is not null and author not in (select id from auth.users);
alter table public.posts drop constraint if exists posts_author_fkey;
alter table public.posts
  add constraint posts_author_fkey
  foreign key (author) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  messages              (user columns: sender, recipient)
-- =====================================================================
delete from public.messages
  where (sender    is not null and sender    not in (select id from auth.users))
     or (recipient is not null and recipient not in (select id from auth.users));
alter table public.messages drop constraint if exists messages_sender_fkey;
alter table public.messages
  add constraint messages_sender_fkey
  foreign key (sender) references auth.users(id) on delete cascade;
alter table public.messages drop constraint if exists messages_recipient_fkey;
alter table public.messages
  add constraint messages_recipient_fkey
  foreign key (recipient) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  friendships           (user columns: requester, addressee)
-- =====================================================================
delete from public.friendships
  where (requester is not null and requester not in (select id from auth.users))
     or (addressee is not null and addressee not in (select id from auth.users));
alter table public.friendships drop constraint if exists friendships_requester_fkey;
alter table public.friendships
  add constraint friendships_requester_fkey
  foreign key (requester) references auth.users(id) on delete cascade;
alter table public.friendships drop constraint if exists friendships_addressee_fkey;
alter table public.friendships
  add constraint friendships_addressee_fkey
  foreign key (addressee) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  activity              (user column: user_id)
-- =====================================================================
delete from public.activity
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.activity drop constraint if exists activity_user_id_fkey;
alter table public.activity
  add constraint activity_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  phrases               (user column: user_id)
-- =====================================================================
delete from public.phrases
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.phrases drop constraint if exists phrases_user_id_fkey;
alter table public.phrases
  add constraint phrases_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  vocab_srs             (user column: user_id)
-- =====================================================================
delete from public.vocab_srs
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.vocab_srs drop constraint if exists vocab_srs_user_id_fkey;
alter table public.vocab_srs
  add constraint vocab_srs_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  user_languages        (user column: user_id)
-- =====================================================================
delete from public.user_languages
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.user_languages drop constraint if exists user_languages_user_id_fkey;
alter table public.user_languages
  add constraint user_languages_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  user_content          (user column: user_id)   <- results live here
-- =====================================================================
delete from public.user_content
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.user_content drop constraint if exists user_content_user_id_fkey;
alter table public.user_content
  add constraint user_content_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  usage_counters        (user column: user_id)
-- =====================================================================
delete from public.usage_counters
  where user_id is not null and user_id not in (select id from auth.users);
alter table public.usage_counters drop constraint if exists usage_counters_user_id_fkey;
alter table public.usage_counters
  add constraint usage_counters_user_id_fkey
  foreign key (user_id) references auth.users(id) on delete cascade;


-- =====================================================================
--  TABLE:  profiles              (user column: id  = auth.users.id)
--  Run last: every table above references the user; the profile row goes
--  with the user once everything else is cascaded.
-- =====================================================================
delete from public.profiles
  where id is not null and id not in (select id from auth.users);
alter table public.profiles drop constraint if exists profiles_id_fkey;
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

-- =====================================================================
--  DONE. Deleting a user now removes all of their rows automatically.
-- =====================================================================
