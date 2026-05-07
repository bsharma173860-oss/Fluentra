/**
 * streakStore.ts
 * All streak read/write operations against Supabase.
 * No UI — pure data layer.
 */
import { supabase } from './supabase';
import { milestoneForDay } from '@/constants/streakMilestones';
import { sendStreakMilestone } from './notifications';
import { Analytics } from './analytics';

// ── Types ──────────────────────────────────────────────────────────

export type StreakState = {
  streakCount:    number;
  lastActiveDate: string | null; // ISO date string YYYY-MM-DD
  examUnlocked:   boolean;
};

// ── Helpers ────────────────────────────────────────────────────────

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

// ── Core operations ────────────────────────────────────────────────

/**
 * Fetch current streak for a user+language from Supabase.
 */
export async function getStreak(
  userId: string,
  languageCode: string
): Promise<StreakState> {
  const { data, error } = await supabase
    .from('user_languages')
    .select('streak_count, streak_last_active, exam_unlocked')
    .eq('user_id', userId)
    .eq('language_code', languageCode)
    .single();

  if (error || !data) {
    return { streakCount: 0, lastActiveDate: null, examUnlocked: false };
  }

  return {
    streakCount:    data.streak_count ?? 0,
    lastActiveDate: data.streak_last_active ?? null,
    examUnlocked:   data.exam_unlocked ?? false,
  };
}

/**
 * Record a practice session and advance the streak.
 * - If last active was today: no-op (streak already counted).
 * - If last active was yesterday: increment streak.
 * - Otherwise: reset streak to 1.
 * Fires milestone notifications and analytics events as side-effects.
 */
export async function recordPractice(
  userId: string,
  languageCode: string
): Promise<StreakState> {
  const today     = todayISO();
  const yesterday = yesterdayISO();

  const current = await getStreak(userId, languageCode);
  const { streakCount, lastActiveDate } = current;

  // Already practiced today — return current state unchanged
  if (lastActiveDate === today) return current;

  const newStreak = lastActiveDate === yesterday ? streakCount + 1 : 1;
  const examUnlocked = newStreak >= 9;

  const { error } = await supabase
    .from('user_languages')
    .update({
      streak_count:       newStreak,
      streak_last_active: today,
      exam_unlocked:      examUnlocked,
    })
    .eq('user_id', userId)
    .eq('language_code', languageCode);

  if (error) {
    console.error('[streakStore] recordPractice error:', error.message);
    return current;
  }

  const next: StreakState = {
    streakCount:    newStreak,
    lastActiveDate: today,
    examUnlocked,
  };

  // Side-effects: milestone notification + analytics
  const milestone = milestoneForDay(newStreak);
  if (milestone) {
    sendStreakMilestone(newStreak).catch(console.warn);
    Analytics.streakMilestone({
      languageCode,
      streakDays: newStreak,
      milestone:  newStreak as 7 | 9,
    });
  }

  if (examUnlocked && !current.examUnlocked) {
    Analytics.examUnlocked({ languageCode, examType: 'monthly', streakDays: newStreak });
  }

  return next;
}

/**
 * Explicitly reset the streak for a user+language (e.g. after a break).
 */
export async function resetStreak(userId: string, languageCode: string): Promise<void> {
  await supabase
    .from('user_languages')
    .update({ streak_count: 0, streak_last_active: null, exam_unlocked: false })
    .eq('user_id', userId)
    .eq('language_code', languageCode);
}

/**
 * Insert a row into streak_milestones when a user earns one.
 * Safe to call multiple times — uses upsert to avoid duplicates.
 */
export async function saveStreakMilestone(
  userId: string,
  languageCode: string,
  days: number,
  badge: string
): Promise<void> {
  await supabase
    .from('streak_milestones')
    .upsert(
      { user_id: userId, language_code: languageCode, days, badge, earned_at: new Date().toISOString() },
      { onConflict: 'user_id,language_code,days' }
    );
}
