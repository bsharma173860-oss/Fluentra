-- Migration: drop legacy/unused tables.
-- These 10 tables are left over from an earlier (per-attempt) schema design. The current
-- app consolidates all results into public.user_content and reads the leaderboard from
-- public.profiles, so NOTHING in the code (backend.js + api/) reads or writes any of these
-- tables (verified: 0 references). They sit empty as clutter.
--
-- Safe: none are created by the app's schema files and no live table has a foreign key into
-- them. public. prefix ensures auth.* internal tables are never touched. IF EXISTS makes it
-- idempotent; CASCADE removes each table's own RLS policies and any inter-dependencies
-- (e.g. monthly_exam_entries -> monthly_exams).
--
-- NOTE: this is destructive. If you have data in any of these from a tool OUTSIDE this app,
-- back it up first. For the app itself they are unused.

drop table if exists public.reading_attempts      cascade;
drop table if exists public.listening_attempts     cascade;
drop table if exists public.writing_attempts        cascade;
drop table if exists public.speaking_sessions        cascade;
drop table if exists public.monthly_exam_entries     cascade;
drop table if exists public.monthly_exams             cascade;
drop table if exists public.leaderboard_entries       cascade;
drop table if exists public.score_history              cascade;
drop table if exists public.sessions                    cascade;
drop table if exists public.audio_clips                  cascade;
