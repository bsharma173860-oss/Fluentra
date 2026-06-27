-- =====================================================================
--  FLUENTRA — add "interests" to profiles  (Living Curriculum feature)
-- =====================================================================
--  Stores the learner's interests (comma-separated, e.g. "crypto, K-pop,
--  parenting"). Fed into AI-generated content so reading/listening/writing/
--  speaking scenarios are built around what the learner actually cares about.
--
--  HOW TO RUN: paste into Supabase -> SQL Editor -> Run. Idempotent.
-- =====================================================================

-- =====================================================================
--  TABLE:  profiles            (new column: interests)
-- =====================================================================
alter table public.profiles add column if not exists interests text;

-- =====================================================================
--  DONE. Learners can now set interests; generated content uses them.
-- =====================================================================
