/**
 * In-memory daily practice tracker.
 * Resets on app restart until Supabase sessions are wired (Day 10+).
 * Key format: "YYYY-MM-DD:langCode:module"
 */

export type PracticeModule = 'speaking' | 'writing' | 'listening' | 'reading';

const _completed = new Set<string>();

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function markPracticed(langCode: string, module: PracticeModule): void {
  _completed.add(`${todayStr()}:${langCode}:${module}`);
}

export function hasPracticed(langCode: string, module: PracticeModule): boolean {
  return _completed.has(`${todayStr()}:${langCode}:${module}`);
}

export function hasPracticedAnyToday(langCode: string): boolean {
  const today = todayStr();
  return (['speaking', 'writing', 'listening', 'reading'] as PracticeModule[]).some(
    m => _completed.has(`${today}:${langCode}:${m}`)
  );
}

export function completedModulesToday(langCode: string): PracticeModule[] {
  const today = todayStr();
  return (['speaking', 'writing', 'listening', 'reading'] as PracticeModule[]).filter(
    m => _completed.has(`${today}:${langCode}:${m}`)
  );
}
