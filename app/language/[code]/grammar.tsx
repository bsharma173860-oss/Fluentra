/**
 * language/[code]/grammar.tsx
 * Daily grammar lesson with examples and interactive exercises.
 * Route: /language/:code/grammar
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';

// ── Types ──────────────────────────────────────────────────────────

type Example = {
  sentence:    string;
  note:        string;
  translation?: string;
};

type Exercise = {
  question: string;
  answer:   string;
  options?: string[];   // if present → multiple choice; else → fill-in-the-blank
};

type GrammarContent = {
  title:       string;
  topic:       string;
  explanation: string;
  examples:    Example[];
  exercises:   Exercise[];
};

type AnswerState = 'unanswered' | 'correct' | 'wrong';

// ── Helpers ────────────────────────────────────────────────────────

async function fetchGrammar(userId: string, languageCode: string, examType?: string): Promise<GrammarContent> {
  // 1. Try cache
  try {
    const qs  = new URLSearchParams({ userId, languageCode, module: 'grammar' });
    const res = await fetch(`${API}/content/today?${qs}`);
    if (res.ok) {
      const json = await res.json();
      if (json.content?.topic) return json.content as GrammarContent;
    }
  } catch {}

  // 2. Generate fresh
  const res = await fetch(`${API}/content/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId, languageCode, module: 'grammar', examType }),
  });
  if (!res.ok) throw new Error(`generate failed: ${res.status}`);
  const json = await res.json();
  return json.content as GrammarContent;
}

// ── Section title ──────────────────────────────────────────────────

function SectionTitle({ number, label }: { number: number; label: string }) {
  return (
    <View style={st.row}>
      <View style={st.badge}>
        <Text style={st.num}>{number}</Text>
      </View>
      <Text style={st.label}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  badge: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  num:   { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },
  label: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
});

// ── Exercise item ──────────────────────────────────────────────────

function ExerciseItem({
  exercise,
  index,
  answered,
  chosenAnswer,
  onAnswer,
}: {
  exercise:     Exercise;
  index:        number;
  answered:     boolean;
  chosenAnswer: string | null;
  onAnswer:     (answer: string) => void;
}) {
  const isCorrect = chosenAnswer === exercise.answer;
  const hasOptions = exercise.options && exercise.options.length > 0;

  return (
    <View style={ex.wrap}>
      <Text style={ex.qnum}>Q{index + 1}</Text>
      <Text style={ex.question}>{exercise.question}</Text>

      {hasOptions ? (
        // Multiple choice
        <View style={ex.opts}>
          {exercise.options!.map(opt => {
            let bg = Colors.bg2;
            let border = Colors.border;
            let textColor = Colors.ink;
            if (answered) {
              if (opt === exercise.answer) {
                bg = Colors.green_bg; border = Colors.green; textColor = Colors.green;
              } else if (opt === chosenAnswer) {
                bg = Colors.danger_bg; border = Colors.danger; textColor = Colors.danger;
              }
            } else if (opt === chosenAnswer) {
              bg = Colors.p_soft; border = Colors.p; textColor = Colors.p;
            }
            return (
              <TouchableOpacity
                key={opt}
                style={[ex.opt, { backgroundColor: bg, borderColor: border }]}
                onPress={() => !answered && onAnswer(opt)}
                activeOpacity={answered ? 1 : 0.7}
                disabled={answered}
              >
                <Text style={[ex.optText, { color: textColor }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        // Fill-in-the-blank: tap to reveal
        <TouchableOpacity
          style={[
            ex.revealBtn,
            answered && isCorrect  && ex.revealCorrect,
            answered && !isCorrect && ex.revealWrong,
          ]}
          onPress={() => !answered && onAnswer(exercise.answer)}
          activeOpacity={answered ? 1 : 0.8}
          disabled={answered}
        >
          <Text style={[ex.revealText, answered && { color: isCorrect ? Colors.green : Colors.danger }]}>
            {answered ? exercise.answer : 'Tap to reveal answer'}
          </Text>
        </TouchableOpacity>
      )}

      {answered && (
        <View style={ex.feedbackRow}>
          <Text style={[ex.feedbackIcon, isCorrect ? ex.correct : ex.wrong]}>
            {isCorrect ? '✓ Correct!' : '✗ The answer is: ' + exercise.answer}
          </Text>
        </View>
      )}
    </View>
  );
}

const ex = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
    marginBottom: 12,
  },
  qnum:     { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.p, textTransform: 'uppercase', letterSpacing: 0.5 },
  question: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.ink, lineHeight: 22 },
  opts:     { gap: 8 },
  opt: {
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  optText:      { fontFamily: 'Inter_500Medium', fontSize: 14 },
  revealBtn: {
    backgroundColor: Colors.p_soft,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.p,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  revealCorrect: { backgroundColor: Colors.green_bg, borderColor: Colors.green },
  revealWrong:   { backgroundColor: Colors.danger_bg, borderColor: Colors.danger },
  revealText:    { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },
  feedbackRow:   { flexDirection: 'row', alignItems: 'center' },
  feedbackIcon:  { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  correct:       { color: Colors.green },
  wrong:         { color: Colors.danger },
});

// ── Score banner ───────────────────────────────────────────────────

function ScoreBanner({ correct, total }: { correct: number; total: number }) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  const emoji = pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '📚';
  return (
    <View style={sb.wrap}>
      <Text style={sb.emoji}>{emoji}</Text>
      <Text style={sb.score}>You got {correct}/{total} correct!</Text>
      <Text style={sb.note}>Review tomorrow to reinforce this topic.</Text>
    </View>
  );
}

const sb = StyleSheet.create({
  wrap:  { backgroundColor: Colors.p_soft, borderRadius: 16, padding: 20, alignItems: 'center', gap: 6, marginBottom: 20 },
  emoji: { fontSize: 32 },
  score: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.p },
  note:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, textAlign: 'center' },
});

// ── Main screen ────────────────────────────────────────────────────

export default function GrammarScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { user }  = useAuth();

  const [content,  setContent]  = useState<GrammarContent | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  // Per-exercise: selected option and whether submitted
  const [choices,   setChoices]   = useState<(string | null)[]>([]);
  const [answered,  setAnswered]  = useState<boolean[]>([]);
  const [allDone,   setAllDone]   = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const g = await fetchGrammar(user.id, code as string);
      setContent(g);
      const n = g.exercises?.length ?? 0;
      setChoices(new Array(n).fill(null));
      setAnswered(new Array(n).fill(false));
      setAllDone(false);
    } catch (err: any) {
      setError('Could not load grammar lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, code]);

  useEffect(() => { load(); }, [load]);

  const handleAnswer = useCallback((exerciseIndex: number, answer: string) => {
    setChoices(prev => { const n = [...prev]; n[exerciseIndex] = answer; return n; });
    setAnswered(prev => {
      const n = [...prev]; n[exerciseIndex] = true;
      if (n.every(Boolean)) setAllDone(true);
      return n;
    });
  }, []);

  const correctCount = answered.reduce((acc, done, i) => {
    if (!done || !content) return acc;
    return acc + (choices[i] === content.exercises[i].answer ? 1 : 0);
  }, 0);

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.p} />
          <Text style={s.loadingText}>Loading grammar lesson…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !content) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <Text style={s.errorText}>{error ?? 'No grammar lesson available today.'}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={load}>
            <Text style={s.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Grammar</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Section 1: Explanation ── */}
        <View style={s.section}>
          <SectionTitle number={1} label="Explanation" />

          <Text style={s.topic}>{content.title ?? content.topic}</Text>

          <View style={s.explanationBox}>
            <Text style={s.explanationText}>{content.explanation}</Text>
          </View>
        </View>

        {/* ── Section 2: Examples ── */}
        {content.examples?.length > 0 && (
          <View style={s.section}>
            <SectionTitle number={2} label="Examples" />
            <View style={s.examplesWrap}>
              {content.examples.map((ex, i) => (
                <View key={i} style={s.exampleCard}>
                  <Text style={s.exampleSentence}>{ex.sentence}</Text>
                  {ex.translation ? (
                    <Text style={s.exampleTranslation}>{ex.translation}</Text>
                  ) : null}
                  {ex.note ? (
                    <View style={s.noteRow}>
                      <Text style={s.noteDot}>•</Text>
                      <Text style={s.noteText}>{ex.note}</Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* ── Section 3: Exercises ── */}
        {content.exercises?.length > 0 && (
          <View style={s.section}>
            <SectionTitle number={3} label="Exercises" />

            {allDone && (
              <ScoreBanner correct={correctCount} total={content.exercises.length} />
            )}

            {content.exercises.map((exercise, i) => (
              <ExerciseItem
                key={i}
                exercise={exercise}
                index={i}
                answered={answered[i]}
                chosenAnswer={choices[i]}
                onAnswer={answer => handleAnswer(i, answer)}
              />
            ))}
          </View>
        )}

        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.8}>
          <Text style={s.backBtnText}>← Back to Language</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back:        { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },

  section:   { marginBottom: 28 },
  topic:     { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.ink, marginBottom: 12 },

  explanationBox: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
  },
  explanationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.ink2,
    lineHeight: 24,
  },

  examplesWrap: { gap: 10 },
  exampleCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: Colors.p,
    gap: 6,
  },
  exampleSentence:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink, lineHeight: 22 },
  exampleTranslation: { fontFamily: 'Inter_400Regular',  fontSize: 13, color: Colors.ink3, fontStyle: 'italic' },
  noteRow:   { flexDirection: 'row', gap: 6, alignItems: 'flex-start' },
  noteDot:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.p, marginTop: 1 },
  noteText:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, flex: 1, lineHeight: 19 },

  backBtn: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },

  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginTop: 12 },
  errorText:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center' },
  retryBtn:    { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.p, borderRadius: 10 },
  retryText:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
});
