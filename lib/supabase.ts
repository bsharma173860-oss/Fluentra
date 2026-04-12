import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// ── SecureStore adapter for Supabase session persistence ─────
// Uses expo-secure-store on native; falls back to localStorage on web.
const SecureStoreAdapter = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

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
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  native_language: string;
  target_exam: string;
  target_band: number;
  streak: number;
  longest_streak: number;
  band_score: number;
  global_rank: number | null;
  total_sessions: number;
  total_minutes: number;
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  type: 'speaking' | 'writing' | 'listening' | 'reading';
  exam_type: string | null;
  language: string;
  score: number | null;
  max_score: number | null;
  duration_secs: number;
  completed: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type ScoreHistory = {
  id: string;
  user_id: string;
  exam_type: string;
  skill: 'speaking' | 'writing' | 'listening' | 'reading' | 'overall';
  score: number;
  max_score: number;
  recorded_at: string;
};

export type MonthlyExam = {
  id: string;
  exam_type: string;
  title: string;
  scheduled_for: string;
  registration_end: string;
  streak_required: number;
  max_participants: number | null;
  is_active: boolean;
  created_at: string;
};
