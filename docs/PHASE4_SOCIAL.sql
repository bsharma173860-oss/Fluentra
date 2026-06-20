-- ============================================================
-- Fluentra · Phase 4 — Social backend
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- Safe to re-run (idempotent). Project: kbjqmhviuryakfzhhoaz
-- ============================================================

-- ---------- 1. PROFILES: public social fields ----------------
-- profiles already exists; add the fields social features need.
alter table public.profiles add column if not exists full_name   text;
alter table public.profiles add column if not exists avatar_url  text;
alter table public.profiles add column if not exists username    text;
alter table public.profiles add column if not exists is_public   boolean not null default true;
alter table public.profiles add column if not exists xp           integer not null default 0;
alter table public.profiles add column if not exists streak       integer not null default 0;
alter table public.profiles add column if not exists best_score   integer not null default 0;
alter table public.profiles add column if not exists created_at    timestamptz not null default now();

create unique index if not exists profiles_username_key
  on public.profiles (lower(username)) where username is not null;

-- Auto-create a profile row for every new auth user ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill any existing users that have no profile row --------
insert into public.profiles (id, full_name)
select u.id, coalesce(u.raw_user_meta_data->>'full_name', split_part(u.email,'@',1))
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;

-- RLS: anyone signed-in can READ public profiles; you edit only your own
alter table public.profiles enable row level security;
drop policy if exists "profiles_read_public" on public.profiles;
create policy "profiles_read_public" on public.profiles
  for select to authenticated using (is_public = true or id = auth.uid());
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check (id = auth.uid());

-- ---------- 2. FRIENDSHIPS ------------------------------------
create table if not exists public.friendships (
  id          uuid primary key default gen_random_uuid(),
  requester   uuid not null references auth.users(id) on delete cascade,
  addressee   uuid not null references auth.users(id) on delete cascade,
  status      text not null default 'pending',   -- pending | accepted
  created_at  timestamptz not null default now(),
  unique (requester, addressee)
);
create index if not exists friendships_addressee_idx on public.friendships (addressee);
create index if not exists friendships_requester_idx on public.friendships (requester);

alter table public.friendships enable row level security;
drop policy if exists "friend_read"   on public.friendships;
create policy "friend_read" on public.friendships
  for select to authenticated using (requester = auth.uid() or addressee = auth.uid());
drop policy if exists "friend_insert" on public.friendships;
create policy "friend_insert" on public.friendships
  for insert to authenticated with check (requester = auth.uid());
drop policy if exists "friend_update" on public.friendships;
create policy "friend_update" on public.friendships
  for update to authenticated using (addressee = auth.uid() or requester = auth.uid());
drop policy if exists "friend_delete" on public.friendships;
create policy "friend_delete" on public.friendships
  for delete to authenticated using (requester = auth.uid() or addressee = auth.uid());

-- ---------- 3. ACTIVITY (your feed + friends' feed) ----------
create table if not exists public.activity (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  kind        text not null,             -- lesson | mock | streak | achievement
  lang        text,
  detail      jsonb not null default '{}',
  created_at  timestamptz not null default now()
);
create index if not exists activity_user_idx on public.activity (user_id, created_at desc);

alter table public.activity enable row level security;
-- read your own activity OR an accepted friend's activity
drop policy if exists "activity_read" on public.activity;
create policy "activity_read" on public.activity
  for select to authenticated using (
    user_id = auth.uid()
    or exists (
      select 1 from public.friendships f
      where f.status = 'accepted'
        and ( (f.requester = auth.uid() and f.addressee = activity.user_id)
           or (f.addressee = auth.uid() and f.requester = activity.user_id) )
    )
  );
drop policy if exists "activity_insert" on public.activity;
create policy "activity_insert" on public.activity
  for insert to authenticated with check (user_id = auth.uid());

-- ---------- 4. MESSAGES (direct messages, realtime) ----------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  sender      uuid not null references auth.users(id) on delete cascade,
  recipient   uuid not null references auth.users(id) on delete cascade,
  body        text not null,
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);
create index if not exists messages_pair_idx on public.messages (sender, recipient, created_at);
create index if not exists messages_recipient_idx on public.messages (recipient, created_at);

alter table public.messages enable row level security;
drop policy if exists "messages_read" on public.messages;
create policy "messages_read" on public.messages
  for select to authenticated using (sender = auth.uid() or recipient = auth.uid());
drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert" on public.messages
  for insert to authenticated with check (sender = auth.uid());
drop policy if exists "messages_update" on public.messages;
create policy "messages_update" on public.messages
  for update to authenticated using (recipient = auth.uid());  -- mark read

-- turn on Realtime for messages (so DMs arrive live)
alter publication supabase_realtime add table public.messages;

-- ---------- 5. PHRASEBOOK ------------------------------------
create table if not exists public.phrases (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lang        text not null,
  front       text not null,
  back        text,
  created_at  timestamptz not null default now()
);
create index if not exists phrases_user_idx on public.phrases (user_id, lang, created_at desc);

alter table public.phrases enable row level security;
drop policy if exists "phrases_own" on public.phrases;
create policy "phrases_own" on public.phrases
  for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- Done. You should see "Success. No rows returned".
-- ============================================================
