/**
 * contentStore.ts
 * Fetches and caches daily practice content.
 * No UI — pure data layer.
 *
 * Flow:
 *   1. GET /api/content/today — returns cached content if already generated
 *   2. If 404, POST /api/content/generate — create fresh content
 *   3. Persist result in module stores (examStore etc.) as needed
 */
import { supabase } from './supabase';

const API_BASE = (process.env.EXPO_PUBLIC_API_URL ?? '/api');

// ── Types ──────────────────────────────────────────────────────────

export type ContentModule = 'writing' | 'listening' | 'reading' | 'speaking';

export type DailyContent = {
  contentId:   string | null;
  content:     Record<string, unknown>;
  generatedAt: string;
  cached:      boolean;
  module:      ContentModule;
  languageCode: string;
};

export type ContentDifficulty = 'beginner' | 'intermediate' | 'advanced';

// ── API helpers ────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs  = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}${path}?${qs}`);
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Core operations ────────────────────────────────────────────────

/**
 * Get today's content for a module. Generates fresh if not yet available.
 * Fails open: returns null on any network error so callers can fall back to
 * static/offline content.
 */
export async function getTodayContent(
  userId: string,
  languageCode: string,
  module: ContentModule,
  examType?: string,
  difficulty: ContentDifficulty = 'intermediate'
): Promise<DailyContent | null> {
  try {
    // 1. Try cached
    const cached = await get<DailyContent>('/content/today', {
      userId, languageCode, module,
    });
    return { ...cached, module, languageCode };
  } catch {
    // 404 or network error → generate fresh
  }

  try {
    const fresh = await post<DailyContent>('/content/generate', {
      userId, languageCode, module, examType, difficulty,
    });
    return { ...fresh, module, languageCode };
  } catch (err) {
    console.error('[contentStore] getTodayContent failed:', err);
    return null;
  }
}

/**
 * Fetch all daily_content rows for a user from Supabase directly
 * (used for history / analytics views).
 */
export async function getContentHistory(
  userId: string,
  languageCode?: string,
  limit = 20
): Promise<DailyContent[]> {
  let query = supabase
    .from('daily_content')
    .select('*')
    .eq('user_id', userId)
    .order('generated_at', { ascending: false })
    .limit(limit);

  if (languageCode) query = query.eq('language_code', languageCode);

  const { data, error } = await query;
  if (error) {
    console.error('[contentStore] getContentHistory error:', error.message);
    return [];
  }

  return (data ?? []).map(row => ({
    contentId:   row.id,
    content:     row.content,
    generatedAt: row.generated_at,
    cached:      true,
    module:      row.module,
    languageCode: row.language_code,
  }));
}

/**
 * Purchase/register for a monthly exam.
 * Returns the entry ID and scheduled exam date.
 */
export async function purchaseExamEntry(
  userId: string,
  languageCode: string,
  examType: string,
  month: string // YYYY-MM
): Promise<{ entryId: string; examDate: string } | null> {
  try {
    return await post('/exam/purchase', { userId, languageCode, examType, month });
  } catch (err) {
    console.error('[contentStore] purchaseExamEntry failed:', err);
    return null;
  }
}
