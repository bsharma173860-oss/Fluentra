-- ============================================================
-- vocab_progress table — updated schema (2026-05-07)
-- Run in: Supabase Dashboard → SQL Editor
--
-- Creates the table if it doesn't exist yet (idempotent).
-- If the foundation migration already ran, this adds the
-- missing `known` column only.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.vocab_progress (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  language_code text NOT NULL,
  word          text NOT NULL,
  translation   text,
  known         boolean DEFAULT false,
  seen_count    integer DEFAULT 0,
  correct_count integer DEFAULT 0,
  review_count  integer DEFAULT 0,
  last_seen_at  timestamptz,
  next_review   date DEFAULT CURRENT_DATE,
  mastery       text DEFAULT 'new',   -- 'new'|'learning'|'reviewing'|'mastered'
  created_at    timestamptz DEFAULT now(),
  UNIQUE (user_id, language_code, word)
);

-- Add `known` column if foundation migration ran without it
ALTER TABLE public.vocab_progress
  ADD COLUMN IF NOT EXISTS known boolean DEFAULT false;

-- Add `review_count` if missing
ALTER TABLE public.vocab_progress
  ADD COLUMN IF NOT EXISTS review_count integer DEFAULT 0;

-- Add `next_review` as date type if missing
ALTER TABLE public.vocab_progress
  ADD COLUMN IF NOT EXISTS next_review date DEFAULT CURRENT_DATE;

ALTER TABLE public.vocab_progress ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policy to ensure it covers all operations
DROP POLICY IF EXISTS "users_own_vocab" ON public.vocab_progress;
DROP POLICY IF EXISTS "Users manage own vocab" ON public.vocab_progress;

CREATE POLICY "users_own_vocab"
  ON public.vocab_progress
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
