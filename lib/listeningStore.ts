export type ListeningQuestionType = 'form' | 'mcq' | 'note';

export type ListeningQuestion = {
  number: number;
  type: ListeningQuestionType;
  shortLabel: string;
  /** Full prompt shown to the user */
  text: string;
  /** For MCQ: A/B/C options */
  options?: { key: string; label: string }[];
  /** Prefix shown before the blank, e.g. "Customer name: Sarah" */
  prefix?: string;
  /** Suffix shown after the blank, e.g. "March" */
  suffix?: string;
  correctAnswer: string;
  explanation: string;
};

export type ListeningResult = {
  exam: string;
  section: string;
  mode: 'practice' | 'exam';
  timeTakenSeconds: number;
  totalQuestions: number;
  correctCount: number;
  bandEstimate: number;
  answers: Record<number, string>;
  questions: ListeningQuestion[];
};

let _pendingResult: ListeningResult | null = null;

export function setListeningResult(r: ListeningResult): void {
  _pendingResult = r;
}

export function getListeningResult(): ListeningResult | null {
  return _pendingResult;
}

export function clearListeningResult(): void {
  _pendingResult = null;
}

/** Simple band estimate for IELTS Listening (40 q → scale; we use 10 q subset) */
export function estimateListeningBand(correct: number, total: number): number {
  const pct = total > 0 ? correct / total : 0;
  if (pct >= 1.00) return 9.0;
  if (pct >= 0.90) return 8.5;
  if (pct >= 0.80) return 8.0;
  if (pct >= 0.70) return 7.5;
  if (pct >= 0.60) return 7.0;
  if (pct >= 0.50) return 6.5;
  if (pct >= 0.40) return 6.0;
  if (pct >= 0.30) return 5.5;
  if (pct >= 0.20) return 5.0;
  return 4.5;
}
