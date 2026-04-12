/**
 * Ephemeral in-memory store for writing results.
 * Bridges the editor screens → results screen without stuffing JSON into URL params.
 * Replace the mock scorer with a real API call to your Node.js backend in production.
 */

export type CorrectedSentence = {
  original: string;
  corrected: string;
  reason: string;
};

export type WritingResult = {
  task: 'task1' | 'task2';
  exam: string;
  prompt: string;
  response: string;
  wordCount: number;
  timeTakenSeconds: number;
  // Scores (IELTS scale 0–9; adapt denominator for TOEFL)
  bandScore: number;
  taskAchievement: number;
  coherenceCohesion: number;
  lexicalResource: number;
  grammaticalRange: number;
  strengths: string[];
  improvements: string[];
  correctedSentences: CorrectedSentence[];
};

let _pendingResult: WritingResult | null = null;

export function setWritingResult(r: WritingResult): void {
  _pendingResult = r;
}

export function getWritingResult(): WritingResult | null {
  return _pendingResult;
}

export function clearWritingResult(): void {
  _pendingResult = null;
}

// ── Mock scorer ───────────────────────────────────────────────
// Called on submit until the real backend is wired up.
// Produces plausible scores based on word count + simple heuristics.
export function mockScore(
  response: string,
  task: 'task1' | 'task2',
  exam: string,
  prompt: string,
  timeTakenSeconds: number
): WritingResult {
  const words = response.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minWords = task === 'task1' ? 150 : 250;
  const lengthRatio = Math.min(wordCount / (minWords * 1.4), 1);

  // Very simple heuristic — replace with real AI scoring from backend
  const base = 5.0 + lengthRatio * 2.5;
  const jitter = () => parseFloat((Math.random() * 0.5 - 0.25).toFixed(1));
  const clamp = (v: number) => parseFloat(Math.min(9, Math.max(4, v)).toFixed(1));

  const ta  = clamp(base + jitter());
  const cc  = clamp(base - 0.5 + jitter());
  const lr  = clamp(base + 0.5 + jitter());
  const gra = clamp(base + jitter());
  const overall = clamp((ta + cc + lr + gra) / 4);

  return {
    task,
    exam,
    prompt,
    response,
    wordCount,
    timeTakenSeconds,
    bandScore: overall,
    taskAchievement: ta,
    coherenceCohesion: cc,
    lexicalResource: lr,
    grammaticalRange: gra,
    strengths: [
      'Clear position stated in the introduction.',
      'Good use of topic sentences to introduce paragraphs.',
      'Appropriate use of discourse markers (however, furthermore, in contrast).',
    ],
    improvements: [
      wordCount < minWords
        ? `Response is too short (${wordCount} words). Aim for at least ${minWords}.`
        : 'Vary sentence structures more — over-reliance on simple sentences detected.',
      'Some vocabulary is repeated across paragraphs. Try using synonyms.',
      'Conclusion could more clearly restate your overall opinion.',
    ],
    correctedSentences: [
      {
        original: words.slice(0, 8).join(' ') + '...',
        corrected: words.slice(0, 8).join(' ').replace(/\bi\b/g, 'I') + '...',
        reason: 'Pronoun "I" should always be capitalised in formal writing.',
      },
      {
        original: 'Technology have changed how we learn.',
        corrected: 'Technology has changed how we learn.',
        reason: '"Technology" is a singular uncountable noun — use "has", not "have".',
      },
      {
        original: 'In my opinion, I think that...',
        corrected: 'In my opinion, ...',
        reason: '"In my opinion" already implies a personal view — "I think" is redundant.',
      },
    ],
  };
}
