-- ─────────────────────────────────────────────────────────────────────────
-- Fluentra · content schema (run once in Supabase → SQL Editor)
-- Language partitioning is built in: every row is tagged with `lang`, and
-- every read filters by it, so e.g. the Spanish library only ever returns
-- Spanish content. Content is POOLED (shared across users) to amortize
-- generation cost; per-user library/progress is private.
-- ─────────────────────────────────────────────────────────────────────────

-- Shared, pooled, AI-generated content (the library every user draws from)
create table if not exists content (
  id          uuid primary key default gen_random_uuid(),
  lang        text not null,                       -- 'es','ja','de' … PARTITION KEY
  type        text not null,                       -- 'reading'|'writing'|'vocab'|'listening'
  difficulty  text not null default 'medium',      -- 'easy'|'medium'|'hard'
  exam        text,                                -- 'IELTS','DELE','JLPT' …
  title       text,
  payload     jsonb not null,                      -- the generated material
  created_by  uuid,                                -- who triggered generation
  created_at  timestamptz not null default now()
);
-- the index that makes language-filtered reads fast
create index if not exists content_lang_type_diff_idx on content (lang, type, difficulty, created_at desc);

-- Per-user library + results (private)
create table if not exists user_content (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  content_id  uuid not null references content(id) on delete cascade,
  lang        text not null,                       -- denormalized for fast per-language filtering
  status      text not null default 'saved',       -- 'saved'|'in_progress'|'completed'
  score       numeric,
  detail      jsonb,                               -- e.g. band breakdown, corrections
  updated_at  timestamptz not null default now()
);
create index if not exists user_content_user_lang_idx on user_content (user_id, lang, updated_at desc);

-- Row-level security
alter table content      enable row level security;
alter table user_content enable row level security;

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
