import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ── Env var validation ────────────────────────────────────────
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

const PLACEHOLDER_URL = 'https://your-project.supabase.co';
const PLACEHOLDER_KEY = 'your-anon-key-here';

if (!supabaseUrl || supabaseUrl === PLACEHOLDER_URL) {
  console.error(
    '[Fluentra] ⚠️  EXPO_PUBLIC_SUPABASE_URL is not set.\n' +
    '  1. Go to https://supabase.com/dashboard → your project → Settings → API\n' +
    '  2. Copy "Project URL" into .env.local as EXPO_PUBLIC_SUPABASE_URL\n' +
    '  3. Restart the dev server (npx expo start)'
  );
}

if (!supabaseAnonKey || supabaseAnonKey === PLACEHOLDER_KEY) {
  console.error(
    '[Fluentra] ⚠️  EXPO_PUBLIC_SUPABASE_ANON_KEY is not set.\n' +
    '  1. Go to https://supabase.com/dashboard → your project → Settings → API\n' +
    '  2. Copy "anon public" key into .env.local as EXPO_PUBLIC_SUPABASE_ANON_KEY\n' +
    '  3. Restart the dev server (npx expo start)'
  );
}

console.log('[Fluentra] Supabase URL:', supabaseUrl || '(not set)');

// ── SecureStore adapter (native) / localStorage (web) ────────
const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ── Types ─────────────────────────────────────────────────────
export type Profile = {
  id: string;
  email: string | null;
  name: string | null;
  avatar_url: string | null;
  target_exam: string;
  target_score: number;
  native_language: string;
  subscription_tier: 'free' | 'pro';
  daily_usage: Record<string, unknown>;
  streak_count: number;
  streak_last_active: string | null;
  created_at: string;
};

export type UserLanguage = {
  id: string;
  user_id: string;
  language_code: string;
  language_name_en: string;
  language_name_native: string | null;
  fluency_percent: number;
  exams: string[] | null;
  sort_order: number | null;
  created_at: string;
};

export type AppSession = {
  id: string;
  user_id: string;
  mode: 'speaking' | 'writing' | 'listening' | 'reading';
  exam_type: string | null;
  language_code: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at: string | null;
  overall_band: number | null;
  module_scores: Record<string, unknown> | null;
};

export type ScoreHistory = {
  id: string;
  user_id: string;
  module: string;
  exam_type: string;
  score: number;
  recorded_at: string;
};
