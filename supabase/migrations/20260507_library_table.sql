-- ============================================================
-- Library table — 2026-05-07
-- Run in: Supabase Dashboard → SQL Editor
-- Stores generated content pieces for browsing anytime.
-- Readable by all authenticated users; written only by service role.
-- ============================================================

CREATE TABLE IF NOT EXISTS library (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  language_code text NOT NULL,
  exam_type     text NOT NULL,
  content_type  text NOT NULL,   -- 'writing_prompt' | 'reading' | 'listening' | 'vocab' | 'grammar' | 'speaking'
  title         text NOT NULL,
  content       jsonb NOT NULL,
  difficulty    text DEFAULT 'B2',
  date          date NOT NULL,
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read library"
  ON library FOR SELECT
  USING (true);

CREATE INDEX IF NOT EXISTS library_language_type
  ON library (language_code, content_type);

CREATE INDEX IF NOT EXISTS library_date
  ON library (date DESC);
