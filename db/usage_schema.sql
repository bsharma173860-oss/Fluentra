-- ── Fluentra usage metering ──────────────────────────────────────────────
-- Run this once in the Supabase SQL editor.
-- Tracks AI "credits" consumed per user per period so plan caps can be enforced
-- server-side (Free = daily cap, Pro/Max = monthly budget, Max = 5x Pro).
-- 1 credit ≈ $0.01 of AI cost.  tutor msg = 1, lesson = 3, grading = 3.

create table if not exists public.usage_counters (
  user_id    uuid        not null,
  period     text        not null,          -- 'day:2026-06-25' (free) | 'month:2026-06' (pro/max)
  credits    integer     not null default 0,
  updated_at timestamptz not null default now(),
  primary key (user_id, period)
);

-- Atomic "add credits and return new total" (avoids read-modify-write races).
create or replace function public.increment_usage(p_user uuid, p_period text, p_add int)
returns integer
language plpgsql
security definer
as $$
declare new_val integer;
begin
  insert into public.usage_counters (user_id, period, credits)
  values (p_user, p_period, p_add)
  on conflict (user_id, period)
  do update set credits = public.usage_counters.credits + p_add, updated_at = now()
  returning credits into new_val;
  return new_val;
end;
$$;

-- RLS: only the service role (used by /api) writes. Users may read their own
-- counters so the app can show "usage left".
alter table public.usage_counters enable row level security;

drop policy if exists "own usage read" on public.usage_counters;
create policy "own usage read" on public.usage_counters
  for select using (auth.uid() = user_id);
