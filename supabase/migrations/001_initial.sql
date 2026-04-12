-- ============================================================
-- Fluentra — Initial Schema
-- Run via: supabase db push  OR  paste into Supabase SQL editor
-- ============================================================

-- Enable uuid_generate_v4()
create extension if not exists "uuid-ossp";

-- ── 1. profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  username         text unique,
  full_name        text,
  avatar_url       text,
  native_language  text default 'en',
  target_exam      text default 'IELTS',         -- IELTS | TOEFL | DELF | DELE | FREE
  target_band      numeric(3,1) default 7.0,      -- e.g. 7.5
  streak           integer not null default 0,
  longest_streak   integer not null default 0,
  band_score       numeric(3,1) not null default 0.0,
  global_rank      integer,
  total_sessions   integer not null default 0,
  total_minutes    integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
comment on table public.profiles is 'One row per auth.users account.';

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- ── 2. user_languages ────────────────────────────────────────
create table if not exists public.user_languages (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  language    text not null,              -- ISO 639-1 e.g. 'en', 'fr', 'es'
  fluency     integer not null default 0  check (fluency between 0 and 100),
  is_native   boolean not null default false,
  added_at    timestamptz not null default now(),
  unique (user_id, language)
);

-- ── 3. sessions (umbrella table for all practice) ────────────
create table if not exists public.sessions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  type           text not null check (type in ('speaking','writing','listening','reading')),
  exam_type      text,                     -- IELTS | TOEFL | DELF | DELE | FREE | null
  language       text not null default 'en',
  score          numeric(5,2),
  max_score      numeric(5,2),
  duration_secs  integer not null default 0,
  completed      boolean not null default false,
  metadata       jsonb,
  created_at     timestamptz not null default now()
);

-- ── 4. speaking_sessions ────────────────────────────────────
create table if not exists public.speaking_sessions (
  id                  uuid primary key default uuid_generate_v4(),
  session_id          uuid not null references public.sessions(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  prompt              text,
  transcript          text,
  fluency_score       numeric(4,2),
  pronunciation_score numeric(4,2),
  vocabulary_score    numeric(4,2),
  grammar_score       numeric(4,2),
  coherence_score     numeric(4,2),
  ai_feedback         text,
  duration_secs       integer not null default 0,
  created_at          timestamptz not null default now()
);

-- ── 5. audio_clips ──────────────────────────────────────────
create table if not exists public.audio_clips (
  id                  uuid primary key default uuid_generate_v4(),
  speaking_session_id uuid not null references public.speaking_sessions(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  storage_path        text not null,       -- path in Supabase Storage bucket
  duration_secs       integer,
  mime_type           text default 'audio/m4a',
  transcript          text,
  created_at          timestamptz not null default now()
);

-- ── 6. writing_attempts ──────────────────────────────────────
create table if not exists public.writing_attempts (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  task_type       text,                    -- 'task1' | 'task2' | 'essay' etc.
  prompt          text,
  response_text   text not null default '',
  word_count      integer,
  ta_score        numeric(4,2),            -- Task Achievement
  cc_score        numeric(4,2),            -- Coherence & Cohesion
  lr_score        numeric(4,2),            -- Lexical Resource
  gra_score       numeric(4,2),            -- Grammatical Range & Accuracy
  overall_score   numeric(4,2),
  ai_feedback     text,
  created_at      timestamptz not null default now()
);

-- ── 7. reading_attempts ──────────────────────────────────────
create table if not exists public.reading_attempts (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  passage_id      text,
  passage_title   text,
  questions_total integer not null default 0,
  correct         integer not null default 0,
  score           numeric(5,2),
  time_taken_secs integer,
  answers         jsonb,                   -- {questionId: selectedAnswer}
  created_at      timestamptz not null default now()
);

-- ── 8. listening_attempts ────────────────────────────────────
create table if not exists public.listening_attempts (
  id              uuid primary key default uuid_generate_v4(),
  session_id      uuid not null references public.sessions(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  audio_url       text,
  section         integer,                 -- 1–4 for IELTS sections
  questions_total integer not null default 0,
  correct         integer not null default 0,
  score           numeric(5,2),
  time_taken_secs integer,
  answers         jsonb,
  created_at      timestamptz not null default now()
);

-- ── 9. score_history ─────────────────────────────────────────
create table if not exists public.score_history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  exam_type   text not null,
  skill       text not null check (skill in ('speaking','writing','listening','reading','overall')),
  score       numeric(5,2) not null,
  max_score   numeric(5,2) not null,
  recorded_at timestamptz not null default now()
);

-- ── 10. leaderboard_entries ──────────────────────────────────
create table if not exists public.leaderboard_entries (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  exam_type   text not null,
  period      text not null default 'global',  -- 'global' | 'monthly' | 'weekly'
  band_score  numeric(3,1) not null,
  rank        integer,
  updated_at  timestamptz not null default now(),
  unique (user_id, exam_type, period)
);

-- ── 11. monthly_exams ────────────────────────────────────────
create table if not exists public.monthly_exams (
  id               uuid primary key default uuid_generate_v4(),
  exam_type        text not null,
  title            text not null,
  scheduled_for    date not null,
  registration_end date not null,
  streak_required  integer not null default 30,
  max_participants integer,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

-- ── 12. monthly_exam_entries ─────────────────────────────────
create table if not exists public.monthly_exam_entries (
  id              uuid primary key default uuid_generate_v4(),
  exam_id         uuid not null references public.monthly_exams(id) on delete cascade,
  user_id         uuid not null references public.profiles(id) on delete cascade,
  registered_at   timestamptz not null default now(),
  started_at      timestamptz,
  completed_at    timestamptz,
  overall_score   numeric(3,1),
  speaking_score  numeric(3,1),
  writing_score   numeric(3,1),
  listening_score numeric(3,1),
  reading_score   numeric(3,1),
  status          text not null default 'registered'  -- registered | in_progress | completed | abandoned
    check (status in ('registered','in_progress','completed','abandoned')),
  unique (exam_id, user_id)
);


-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.user_languages       enable row level security;
alter table public.sessions             enable row level security;
alter table public.speaking_sessions    enable row level security;
alter table public.audio_clips          enable row level security;
alter table public.writing_attempts     enable row level security;
alter table public.reading_attempts     enable row level security;
alter table public.listening_attempts   enable row level security;
alter table public.score_history        enable row level security;
alter table public.leaderboard_entries  enable row level security;
alter table public.monthly_exams        enable row level security;
alter table public.monthly_exam_entries enable row level security;


-- ── profiles ─────────────────────────────────────────────────
create policy "profiles_select_own"   on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own"   on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"   on public.profiles for update using (auth.uid() = id);

-- Leaderboard: anyone authenticated can read others' band scores (for ranking)
create policy "profiles_select_public_band" on public.profiles
  for select using (auth.role() = 'authenticated');

-- ── user_languages ───────────────────────────────────────────
create policy "user_languages_own" on public.user_languages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── sessions ─────────────────────────────────────────────────
create policy "sessions_own" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── speaking_sessions ────────────────────────────────────────
create policy "speaking_sessions_own" on public.speaking_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── audio_clips ──────────────────────────────────────────────
create policy "audio_clips_own" on public.audio_clips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── writing_attempts ─────────────────────────────────────────
create policy "writing_attempts_own" on public.writing_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── reading_attempts ─────────────────────────────────────────
create policy "reading_attempts_own" on public.reading_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── listening_attempts ───────────────────────────────────────
create policy "listening_attempts_own" on public.listening_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── score_history ────────────────────────────────────────────
create policy "score_history_own" on public.score_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── leaderboard_entries ──────────────────────────────────────
-- Anyone authenticated can read; only owner can write
create policy "leaderboard_read"  on public.leaderboard_entries for select using (auth.role() = 'authenticated');
create policy "leaderboard_write" on public.leaderboard_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── monthly_exams ────────────────────────────────────────────
-- Public read; only service role inserts (managed from backend)
create policy "monthly_exams_read" on public.monthly_exams for select using (true);

-- ── monthly_exam_entries ─────────────────────────────────────
create policy "monthly_exam_entries_own" on public.monthly_exam_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
-- Allow reading others' entries for leaderboard purposes (score only, via view in future)
create policy "monthly_exam_entries_read_all" on public.monthly_exam_entries
  for select using (auth.role() = 'authenticated');


-- ============================================================
-- Indexes for common query patterns
-- ============================================================

create index if not exists idx_sessions_user_id     on public.sessions(user_id);
create index if not exists idx_sessions_type        on public.sessions(type);
create index if not exists idx_score_history_user   on public.score_history(user_id, exam_type);
create index if not exists idx_leaderboard_period   on public.leaderboard_entries(period, band_score desc);
create index if not exists idx_speaking_session     on public.speaking_sessions(session_id);
create index if not exists idx_audio_speaking       on public.audio_clips(speaking_session_id);
create index if not exists idx_exam_entries_exam    on public.monthly_exam_entries(exam_id);
