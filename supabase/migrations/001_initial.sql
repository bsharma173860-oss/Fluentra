-- ============================================================
-- Fluentra — Initial Schema v2
-- Run via: supabase db push  OR  paste into Supabase SQL editor
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── 1. profiles ──────────────────────────────────────────────
create table if not exists public.profiles (
  id                 uuid primary key references auth.users(id) on delete cascade,
  email              text,
  name               text,
  avatar_url         text,
  target_exam        text default 'IELTS',
  target_score       decimal(4,2) default 7.0,
  native_language    text default 'en',
  subscription_tier  text not null default 'free',
  daily_usage        jsonb not null default '{}',
  streak_count       integer not null default 0,
  streak_last_active date,
  created_at         timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, name, avatar_url)
  values (
    new.id,
    new.email,
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

-- ── 2. user_languages ────────────────────────────────────────
create table if not exists public.user_languages (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid not null references public.profiles(id) on delete cascade,
  language_code         text not null,
  language_name_en      text not null,
  language_name_native  text,
  fluency_percent       integer not null default 0 check (fluency_percent between 0 and 100),
  exams                 text[],
  created_at            timestamptz not null default now(),
  unique (user_id, language_code)
);

-- ── 3. sessions ──────────────────────────────────────────────
create table if not exists public.sessions (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references public.profiles(id) on delete cascade,
  mode           text not null,                       -- speaking | writing | listening | reading
  exam_type      text,
  language_code  text not null default 'en',
  status         text not null default 'in_progress', -- in_progress | completed | abandoned
  started_at     timestamptz not null default now(),
  completed_at   timestamptz,
  overall_band   decimal(4,2),
  module_scores  jsonb
);

-- ── 4. writing_attempts ──────────────────────────────────────
create table if not exists public.writing_attempts (
  id                    uuid primary key default uuid_generate_v4(),
  session_id            uuid not null references public.sessions(id) on delete cascade,
  user_id               uuid not null references public.profiles(id) on delete cascade,
  exam_type             text,
  task_type             text,                          -- task1 | task2 | essay
  prompt                text,
  user_response         text not null default '',
  word_count            integer,
  time_taken_seconds    integer,
  band_score            decimal(4,2),
  task_achievement      decimal(4,2),
  coherence_cohesion    decimal(4,2),
  lexical_resource      decimal(4,2),
  grammatical_range     decimal(4,2),
  detailed_feedback     text,
  strengths             jsonb,
  improvements          jsonb,
  corrected_sentences   jsonb,
  created_at            timestamptz not null default now()
);

-- ── 5. reading_attempts ──────────────────────────────────────
create table if not exists public.reading_attempts (
  id                 uuid primary key default uuid_generate_v4(),
  session_id         uuid not null references public.sessions(id) on delete cascade,
  user_id            uuid not null references public.profiles(id) on delete cascade,
  exam_type          text,
  passage_number     integer,
  passage_title      text,
  passage_text       text,
  questions          jsonb,
  user_answers       jsonb,
  correct_answers    jsonb,
  score              integer,
  total_questions    integer,
  band_score         decimal(4,2),
  time_taken_seconds integer,
  created_at         timestamptz not null default now()
);

-- ── 6. listening_attempts ────────────────────────────────────
create table if not exists public.listening_attempts (
  id                 uuid primary key default uuid_generate_v4(),
  session_id         uuid not null references public.sessions(id) on delete cascade,
  user_id            uuid not null references public.profiles(id) on delete cascade,
  exam_type          text,
  section_number     integer,
  questions          jsonb,
  user_answers       jsonb,
  correct_answers    jsonb,
  score              integer,
  total_questions    integer,
  band_score         decimal(4,2),
  time_taken_seconds integer,
  created_at         timestamptz not null default now()
);

-- ── 7. speaking_sessions ─────────────────────────────────────
create table if not exists public.speaking_sessions (
  id                  uuid primary key default uuid_generate_v4(),
  session_id          uuid not null references public.sessions(id) on delete cascade,
  user_id             uuid not null references public.profiles(id) on delete cascade,
  exam_type           text,
  part                integer,                         -- 1 | 2 | 3
  transcript          jsonb,
  duration_seconds    integer,
  fluency_score       decimal(4,2),
  lexical_score       decimal(4,2),
  grammar_score       decimal(4,2),
  pronunciation_score decimal(4,2),
  overall_band        decimal(4,2),
  detailed_feedback   text,
  face_analysis       jsonb,
  created_at          timestamptz not null default now()
);

-- ── 8. audio_clips ───────────────────────────────────────────
-- Shared content table (no user_id — managed by backend/admin)
create table if not exists public.audio_clips (
  id              uuid primary key default uuid_generate_v4(),
  exam_type       text,
  section_number  integer,
  difficulty      text,
  accent          text,
  speaker_setup   text,
  topic           text,
  script          text,
  storage_url     text not null,
  duration_seconds integer,
  questions       jsonb,
  correct_answers jsonb,
  created_at      timestamptz not null default now()
);

-- ── 9. score_history ─────────────────────────────────────────
create table if not exists public.score_history (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  module      text not null,            -- speaking | writing | listening | reading | overall
  exam_type   text not null,
  score       decimal(5,2) not null,
  recorded_at timestamptz not null default now()
);

-- ── 10. leaderboard_entries ──────────────────────────────────
create table if not exists public.leaderboard_entries (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  display_name  text not null,
  exam_type     text not null,
  language_code text not null default 'en',
  week_start    date not null,
  score         decimal(5,2) not null,
  country_code  text,
  created_at    timestamptz not null default now(),
  unique (user_id, exam_type, week_start)
);

-- ── 11. monthly_exams ────────────────────────────────────────
create table if not exists public.monthly_exams (
  id               uuid primary key default uuid_generate_v4(),
  exam_type        text not null,
  language_code    text not null default 'en',
  exam_month       date not null,
  entry_fee_cents  integer not null default 500,
  status           text not null default 'upcoming',  -- upcoming | open | closed | completed
  registered_count integer not null default 0,
  created_at       timestamptz not null default now()
);

-- ── 12. monthly_exam_entries ─────────────────────────────────
create table if not exists public.monthly_exam_entries (
  id             uuid primary key default uuid_generate_v4(),
  exam_id        uuid not null references public.monthly_exams(id) on delete cascade,
  user_id        uuid not null references public.profiles(id) on delete cascade,
  payment_status text not null default 'pending',     -- pending | paid | refunded
  session_id     uuid references public.sessions(id),
  final_score    decimal(4,2),
  rank           integer,
  created_at     timestamptz not null default now(),
  unique (exam_id, user_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.profiles             enable row level security;
alter table public.user_languages       enable row level security;
alter table public.sessions             enable row level security;
alter table public.writing_attempts     enable row level security;
alter table public.reading_attempts     enable row level security;
alter table public.listening_attempts   enable row level security;
alter table public.speaking_sessions    enable row level security;
alter table public.audio_clips          enable row level security;
alter table public.score_history        enable row level security;
alter table public.leaderboard_entries  enable row level security;
alter table public.monthly_exams        enable row level security;
alter table public.monthly_exam_entries enable row level security;

-- profiles: own row only
create policy "profiles_select" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- user_languages
create policy "user_languages_all" on public.user_languages
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- sessions
create policy "sessions_all" on public.sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- writing_attempts
create policy "writing_attempts_all" on public.writing_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- reading_attempts
create policy "reading_attempts_all" on public.reading_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- listening_attempts
create policy "listening_attempts_all" on public.listening_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- speaking_sessions
create policy "speaking_sessions_all" on public.speaking_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- audio_clips: read-only for all authenticated users (shared content)
create policy "audio_clips_read" on public.audio_clips
  for select using (auth.role() = 'authenticated');

-- score_history
create policy "score_history_all" on public.score_history
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- leaderboard: read all, write own
create policy "leaderboard_read"  on public.leaderboard_entries for select using (auth.role() = 'authenticated');
create policy "leaderboard_write" on public.leaderboard_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- monthly_exams: read-only for authenticated users
create policy "monthly_exams_read" on public.monthly_exams for select using (auth.role() = 'authenticated');

-- monthly_exam_entries
create policy "monthly_exam_entries_read"  on public.monthly_exam_entries for select using (auth.role() = 'authenticated');
create policy "monthly_exam_entries_write" on public.monthly_exam_entries
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists idx_sessions_user        on public.sessions(user_id);
create index if not exists idx_sessions_status      on public.sessions(status);
create index if not exists idx_score_history_user   on public.score_history(user_id, exam_type);
create index if not exists idx_leaderboard_week     on public.leaderboard_entries(week_start, score desc);
create index if not exists idx_speaking_session     on public.speaking_sessions(session_id);
create index if not exists idx_writing_session      on public.writing_attempts(session_id);
create index if not exists idx_reading_session      on public.reading_attempts(session_id);
create index if not exists idx_listening_session    on public.listening_attempts(session_id);
create index if not exists idx_exam_entries_exam    on public.monthly_exam_entries(exam_id);
