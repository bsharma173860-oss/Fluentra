export type TranscriptMsg = { role: 'examiner' | 'user'; text: string };

export type SpeakingResult = {
  exam: string;
  part: string;
  timeTakenSeconds: number;
  bandScore: number;
  fluency: number;
  lexical: number;
  grammar: number;
  pronunciation: number;
  strengths: string[];
  improvements: string[];
  eyeContactPct: number;
  confidenceLevel: string;
  transcript: TranscriptMsg[];
};

let _pendingResult: SpeakingResult | null = null;

export function setSpeakingResult(r: SpeakingResult): void {
  _pendingResult = r;
}

export function getSpeakingResult(): SpeakingResult | null {
  return _pendingResult;
}

export function clearSpeakingResult(): void {
  _pendingResult = null;
}

/** Build a mock result from the live transcript collected during the session */
export function buildMockResult(
  exam: string,
  part: string,
  timeTakenSeconds: number,
  transcript: TranscriptMsg[]
): SpeakingResult {
  return {
    exam,
    part,
    timeTakenSeconds,
    bandScore: 7.0,
    fluency: 7.0,
    lexical: 6.5,
    grammar: 7.0,
    pronunciation: 6.5,
    strengths: [
      'Good use of discourse markers (however, furthermore, actually).',
      'Varied vocabulary throughout the session.',
      'Clear and confident delivery on familiar topics.',
    ],
    improvements: [
      'Work on more complex sentence structures for higher band scores.',
      'Reduce hesitation sounds (um, uh) — aim for natural pausing instead.',
    ],
    eyeContactPct: 68,
    confidenceLevel: 'Good',
    transcript,
  };
}
