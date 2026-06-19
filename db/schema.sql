-- ─────────────────────────────────────────────────────────────────────────
-- Fluentra · full schema (run once in Supabase → SQL Editor)
-- Safe to re-run: every statement is idempotent (if not exists / drop policy).
-- ─────────────────────────────────────────────────────────────────────────

-- ── Shared, pooled, AI-generated content (the library every user draws from)
create table if not exists content (
  id          uuid primary key default gen_random_uuid(),
  lang        text not null,                       -- 'es','ja','de' … PARTITION KEY
  type        text not null,                       -- 'reading'|'writing'|'vocab'|'listening'
  difficulty  text not null default 'medium',      -- 'easy'|'medium'|'hard'
  exam        text,
  title       text,
  payload     jsonb not null,                      -- the generated material
  created_by  uuid,
  created_at  timestamptz not null default now()
);
create index if not exists content_lang_type_diff_idx on content (lang, type, difficulty, created_at desc);

-- ── Per-user library + results (private)
create table if not exists user_content (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  content_id  uuid not null references content(id) on delete cascade,
  lang        text not null,
  status      text not null default 'saved',       -- 'saved'|'in_progress'|'completed'
  score       numeric,
  detail      jsonb,
  updated_at  timestamptz not null default now()
);
create index if not exists user_content_user_lang_idx on user_content (user_id, lang, updated_at desc);

-- ── User profile (1 row per auth user) — name, streak, plan, exam targets
create table if not exists profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  avatar_url      text,
  streak          int     not null default 0,
  xp              int     not null default 0,
  plan            text    not null default 'free',
  native_language text,
  target_exam     text    default 'IELTS',
  target_score    numeric default 7.0,
  created_at      timestamptz not null default now()
);

-- ── Languages each user is studying (drives the sidebar)
create table if not exists user_languages (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  language_code text not null,
  native_name   text,
  english_name  text,
  level         text default 'A1',
  exam_type     text default 'IELTS',
  streak        int  not null default 0,
  created_at    timestamptz not null default now(),
  unique (user_id, language_code)
);
create index if not exists user_languages_user_idx on user_languages (user_id);

-- ── Row-level security
alter table content        enable row level security;
alter table user_content   enable row level security;
alter table profiles       enable row level security;
alter table user_languages enable row level security;

-- Pooled content: any signed-in user may read; inserts happen server-side (service key)
drop policy if exists "content_read" on content;
create policy "content_read" on content for select using (true);

-- user_content: each user sees and writes only their own rows
drop policy if exists "uc_select" on user_content;
create policy "uc_select" on user_content for select using (auth.uid() = user_id);
drop policy if exists "uc_insert" on user_content;
create policy "uc_insert" on user_content for insert with check (auth.uid() = user_id);
drop policy if exists "uc_update" on user_content;
create policy "uc_update" on user_content for update using (auth.uid() = user_id);

-- profiles: each user reads/writes their own
drop policy if exists "profiles_select" on profiles;
create policy "profiles_select" on profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert" on profiles;
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- user_languages: each user reads/writes their own
drop policy if exists "ul_select" on user_languages;
create policy "ul_select" on user_languages for select using (auth.uid() = user_id);
drop policy if exists "ul_insert" on user_languages;
create policy "ul_insert" on user_languages for insert with check (auth.uid() = user_id);
drop policy if exists "ul_update" on user_languages;
create policy "ul_update" on user_languages for update using (auth.uid() = user_id);
drop policy if exists "ul_delete" on user_languages;
create policy "ul_delete" on user_languages for delete using (auth.uid() = user_id);

-- ── Auto-create a profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Spaced repetition (SM-2) — one row per (user, vocab card) ──────────────
create table if not exists vocab_srs (
  user_id       uuid not null references auth.users(id) on delete cascade,
  card          text not null,            -- "lang::term"
  lang          text not null,
  ease          real not null default 2.5,
  interval_days int  not null default 0,
  reps          int  not null default 0,
  due           timestamptz,
  last_reviewed timestamptz,
  primary key (user_id, card)
);
alter table vocab_srs enable row level security;
do $$ begin
  create policy "vocab_srs_select" on vocab_srs for select using (auth.uid() = user_id);
  create policy "vocab_srs_insert" on vocab_srs for insert with check (auth.uid() = user_id);
  create policy "vocab_srs_update" on vocab_srs for update using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
notify pgrst, 'reload schema';

-- ── Stripe billing columns on profiles (idempotent) ──────────────────────────
alter table profiles add column if not exists stripe_customer_id  text;
alter table profiles add column if not exists subscription_status text;
alter table profiles add column if not exists current_period_end  timestamptz;
create index if not exists profiles_stripe_customer_idx on profiles (stripe_customer_id);
