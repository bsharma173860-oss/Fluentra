export type QuestionType = 'matching' | 'mcq' | 'tfng';

export type HeadingOption = { key: string; label: string };

export type ReadingQuestion = {
  number: number;
  type: QuestionType;
  shortLabel: string;
  text: string;
  options?: { key: string; label: string }[];
  correctAnswer: string;
  explanation: string;
};

export type ReadingResult = {
  exam: string;
  difficulty: string;
  passageTitle: string;
  timeTakenSeconds: number;
  totalQuestions: number;
  correctCount: number;
  bandEstimate: number;
  answers: Record<number, string>;
  questions: ReadingQuestion[];
};

let _pendingResult: ReadingResult | null = null;

export function setReadingResult(r: ReadingResult): void {
  _pendingResult = r;
}

export function getReadingResult(): ReadingResult | null {
  return _pendingResult;
}

export function clearReadingResult(): void {
  _pendingResult = null;
}

// Simple band score lookup based on percentage correct (IELTS approximation)
export function estimateBand(correct: number, total: number): number {
  const pct = total > 0 ? correct / total : 0;
  if (pct >= 1.00) return 9.0;
  if (pct >= 0.92) return 8.5;
  if (pct >= 0.84) return 8.0;
  if (pct >= 0.76) return 7.5;
  if (pct >= 0.69) return 7.0;
  if (pct >= 0.61) return 6.5;
  if (pct >= 0.53) return 6.0;
  if (pct >= 0.46) return 5.5;
  if (pct >= 0.38) return 5.0;
  if (pct >= 0.30) return 4.5;
  return 4.0;
}
