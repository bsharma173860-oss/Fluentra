-- ============================================================
-- Fluentra foundation tables — 2026-05-07
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================

-- ── writing_attempts ──────────────────────────────────────────
create table if not exists public.writing_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  language_code   text not null,
  exam_type       text,
  task_type       text,                    -- 'task1' | 'task2'
  prompt          text,
  response        text,
  word_count      integer,
  time_taken_sec  integer,
  overall_band    numeric(3,1),
  task_score      numeric(3,1),
  coherence_score numeric(3,1),
  lexical_score   numeric(3,1),
  grammar_score   numeric(3,1),
  feedback        jsonb,
  content_id      uuid,                   -- ref to daily_content
  created_at      timestamptz default now()
);

alter table public.writing_attempts enable row level security;

create policy "users_own_writing"
  on public.writing_attempts
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── speaking_sessions ─────────────────────────────────────────
create table if not exists public.speaking_sessions (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  language_code   text not null,
  exam_type       text,
  part            integer,                -- 1 | 2 | 3
  prompt          text,
  duration_sec    integer,
  transcript      text,
  overall_band    numeric(3,1),
  fluency_score   numeric(3,1),
  lexical_score   numeric(3,1),
  grammar_score   numeric(3,1),
  pronunciation   numeric(3,1),
  feedback        jsonb,
  audio_url       text,
  content_id      uuid,
  created_at      timestamptz default now()
);

alter table public.speaking_sessions enable row level security;

create policy "users_own_speaking"
  on public.speaking_sessions
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── listening_attempts ────────────────────────────────────────
create table if not exists public.listening_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  language_code   text not null,
  exam_type       text,
  section         integer,               -- 1 | 2 | 3 | 4
  answers         jsonb,                 -- { questionId: userAnswer }
  correct_answers jsonb,
  score           integer,
  max_score       integer,
  band            numeric(3,1),
  time_taken_sec  integer,
  content_id      uuid,
  created_at      timestamptz default now()
);

alter table public.listening_attempts enable row level security;

create policy "users_own_listening"
  on public.listening_attempts
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── reading_attempts ──────────────────────────────────────────
create table if not exists public.reading_attempts (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  language_code   text not null,
  exam_type       text,
  passage_title   text,
  answers         jsonb,
  correct_answers jsonb,
  score           integer,
  max_score       integer,
  band            numeric(3,1),
  time_taken_sec  integer,
  content_id      uuid,
  created_at      timestamptz default now()
);

alter table public.reading_attempts enable row level security;

create policy "users_own_reading"
  on public.reading_attempts
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── daily_content ─────────────────────────────────────────────
create table if not exists public.daily_content (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  language_code text not null,
  module        text not null,           -- 'writing'|'listening'|'reading'|'speaking'
  exam_type     text,
  difficulty    text default 'intermediate',
  content       jsonb not null,          -- generated payload from Claude
  generated_at  timestamptz default now()
);

alter table public.daily_content enable row level security;

create policy "users_own_daily_content"
  on public.daily_content
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Index for the common "today's content" query
create index if not exists daily_content_user_lang_module_date
  on public.daily_content (user_id, language_code, module, generated_at desc);

-- ── vocab_progress ────────────────────────────────────────────
create table if not exists public.vocab_progress (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  language_code text not null,
  word          text not null,
  translation   text,
  seen_count    integer default 0,
  correct_count integer default 0,
  last_seen_at  timestamptz,
  next_review   timestamptz,             -- spaced repetition next review date
  mastery       text default 'new',      -- 'new'|'learning'|'reviewing'|'mastered'
  created_at    timestamptz default now(),
  unique (user_id, language_code, word)
);

alter table public.vocab_progress enable row level security;

create policy "users_own_vocab"
  on public.vocab_progress
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── streak_milestones ─────────────────────────────────────────
create table if not exists public.streak_milestones (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  language_code text not null,
  days          integer not null,        -- milestone day count (7, 9, …)
  badge         text,
  earned_at     timestamptz default now(),
  unique (user_id, language_code, days)  -- prevent duplicate milestone rows
);

alter table public.streak_milestones enable row level security;

create policy "users_own_milestones"
  on public.streak_milestones
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);
