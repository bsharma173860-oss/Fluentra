import { Platform } from 'react-native';

// posthog-js is web-only — guard every call behind Platform.OS === 'web'
let posthog: any = null;

const POSTHOG_KEY =
  (process.env.EXPO_PUBLIC_POSTHOG_KEY as string) || 'phc_placeholder';

export function initAnalytics() {
  if (Platform.OS !== 'web') return;
  import('posthog-js').then(({ default: ph }) => {
    posthog = ph;
    ph.init(POSTHOG_KEY, {
      api_host: 'https://app.posthog.com',
      capture_pageview: false,
      loaded: (client) => {
        if (process.env.NODE_ENV === 'development') {
          client.opt_out_capturing();
        }
      },
    });
  });
}

export function identifyUser(
  userId: string,
  properties?: {
    email?: string;
    name?: string;
    plan?: string;
    createdAt?: string;
  }
) {
  if (Platform.OS !== 'web' || !posthog) return;
  posthog.identify(userId, properties);
}

export function resetAnalytics() {
  if (Platform.OS !== 'web' || !posthog) return;
  posthog.reset();
}

export function track(event: string, properties?: Record<string, any>) {
  if (Platform.OS === 'web' && posthog) {
    posthog.capture(event, properties);
  }
  if (__DEV__) {
    console.log('[Analytics]', event, properties);
  }
}

// ── Typed event helpers ───────────────────────────────────────────
export const Analytics = {
  // Auth
  userSignedUp: (props: { method: 'email' | 'google' | 'apple' }) =>
    track('user_signed_up', props),

  userLoggedIn: (props: { method: 'email' | 'google' | 'apple' }) =>
    track('user_logged_in', props),

  // Languages
  languageAdded: (props: {
    languageCode: string;
    languageName: string;
    totalLanguages: number;
  }) => track('language_added', props),

  // Practice
  practiceSessionStarted: (props: {
    module: 'speaking' | 'writing' | 'listening' | 'reading';
    languageCode: string;
    examType: string;
    mode: 'practice' | 'full_exam';
  }) => track('practice_session_started', props),

  practiceSessionCompleted: (props: {
    module: string;
    languageCode: string;
    examType: string;
    score?: number;
    durationSeconds?: number;
    wordCount?: number;
  }) => track('practice_session_completed', props),

  // Streak
  streakMilestone: (props: {
    languageCode: string;
    streakDays: number;
    milestone: 7 | 14 | 30 | 40;
  }) => track('streak_milestone', props),

  // Exams
  examUnlocked: (props: {
    languageCode: string;
    examType: string;
    streakDays: number;
  }) => track('exam_unlocked', props),

  examEntered: (props: {
    languageCode: string;
    examType: string;
    entryFee: number;
  }) => track('exam_entered', props),

  // Upgrade
  upgradePrompted: (props: {
    trigger: 'daily_limit' | 'locked_feature' | 'upgrade_page';
    module?: string;
    currentPlan: string;
  }) => track('upgrade_prompted', props),

  upgradeCompleted: (props: {
    fromPlan: string;
    toPlan: string;
    billingPeriod: 'monthly' | 'annual';
    amount: number;
  }) => track('upgrade_completed', props),

  // Page views
  pageViewed: (props: { page: string; languageCode?: string }) =>
    track('page_viewed', props),
};
