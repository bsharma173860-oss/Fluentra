/**
 * Streak milestone definitions.
 * Milestones drive notifications, unlock logic, and badge display.
 */

export type MilestoneReward = 'badge' | 'exam_unlock' | 'bonus_content';

export type StreakMilestone = {
  /** Day count that triggers this milestone */
  days: number;
  /** Short label shown in UI (e.g. "1 week") */
  label: string;
  /** Emoji badge awarded */
  badge: string;
  /** What the user gets */
  reward: MilestoneReward;
  /** Human-readable reward description */
  rewardLabel: string;
};

export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days:        7,
    label:       '1 week',
    badge:       '🔥',
    reward:      'badge',
    rewardLabel: 'Week warrior badge',
  },
  {
    days:        9,
    label:       '9 days',
    badge:       '🏆',
    reward:      'exam_unlock',
    rewardLabel: 'Monthly exam unlocked',
  },
];

/** The streak day count required to unlock monthly exams */
export const EXAM_UNLOCK_DAYS = 9;

/** Returns the milestone for a given day count, or null if no milestone on that day */
export function milestoneForDay(day: number): StreakMilestone | null {
  return STREAK_MILESTONES.find(m => m.days === day) ?? null;
}

/** Returns all milestones the user has passed given their current streak */
export function earnedMilestones(streakDays: number): StreakMilestone[] {
  return STREAK_MILESTONES.filter(m => streakDays >= m.days);
}

/** Whether the user has unlocked exams */
export function hasExamAccess(streakDays: number): boolean {
  return streakDays >= EXAM_UNLOCK_DAYS;
}
