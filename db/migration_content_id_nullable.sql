-- ─────────────────────────────────────────────────────────────────────────────
-- Fluentra migration · make user_content.content_id nullable
-- ─────────────────────────────────────────────────────────────────────────────
-- WHY: content_id was `not null references content(id)`. But exam, speaking,
-- writing, lesson and vocab results are not tied to a single stored content row,
-- so save-result sent content_id = null → every such insert violated NOT NULL →
-- Supabase rejected the row (502) → the client swallowed it → scores vanished.
--
-- This makes content_id optional. The foreign key still applies WHEN a content_id
-- is present (reading/listening sessions keep referential integrity); rows without
-- one (exams etc.) are now allowed. Safe to run more than once.
-- ─────────────────────────────────────────────────────────────────────────────

alter table public.user_content alter column content_id drop not null;
