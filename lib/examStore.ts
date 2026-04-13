/**
 * In-memory store for full exam results.
 * Bridges full-exam.tsx → exam-results.tsx without URL params.
 * Replace with Supabase persistence on Day 10+.
 */

export type ModuleKey = 'listening' | 'reading' | 'writing' | 'speaking';

export type FullExamResult = {
  languageCode: string;
  examId: string;
  scores: Record<ModuleKey, number>;
  maxScores: Record<ModuleKey, number>;
  completedAt: string;
};

let _latest: FullExamResult | null = null;

export function setExamResult(result: FullExamResult): void {
  _latest = result;
}

export function getExamResult(): FullExamResult | null {
  return _latest;
}

export function clearExamResult(): void {
  _latest = null;
}

export function overallBand(result: FullExamResult): number {
  const keys: ModuleKey[] = ['listening', 'reading', 'writing', 'speaking'];
  const avg =
    keys.reduce((sum, k) => sum + result.scores[k] / result.maxScores[k], 0) / keys.length;
  return Math.round(avg * 9 * 2) / 2; // round to nearest 0.5 on 0-9 scale
}
