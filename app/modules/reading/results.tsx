import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { getReadingResult, clearReadingResult, ReadingResult } from '@/lib/readingStore';

// ── Band color helper ───────────────────────────────────────────
function bandColor(b: number) {
  if (b >= 7.0) return Colors.green;
  if (b >= 5.5) return Colors.p;
  return Colors.orange;
}

// ── Answer row ──────────────────────────────────────────────────
function AnswerRow({ q, userAnswer }: { q: ReadingResult['questions'][0]; userAnswer: string | undefined }) {
  const isCorrect = userAnswer === q.correctAnswer;
  const answered = userAnswer !== undefined;

  return (
    <View style={ar.wrap}>
      {/* Question header */}
      <View style={ar.header}>
        <View style={[ar.statusDot, isCorrect ? ar.dotCorrect : ar.dotWrong]}>
          <Text style={ar.statusIcon}>{isCorrect ? '✓' : '✗'}</Text>
        </View>
        <View style={ar.qInfo}>
          <Text style={ar.qLabel}>{q.shortLabel}</Text>
          <Text style={ar.qText} numberOfLines={3}>{q.text}</Text>
        </View>
      </View>

      {/* Answer comparison */}
      <View style={ar.answers}>
        <View style={[ar.pill, answered && !isCorrect ? ar.pillWrong : ar.pillNeutral]}>
          <Text style={ar.pillLabel}>Your answer</Text>
          <Text style={[ar.pillValue, !answered && ar.pillValueEmpty]}>
            {answered ? userAnswer : 'Not answered'}
          </Text>
        </View>
        {!isCorrect && (
          <View style={[ar.pill, ar.pillCorrect]}>
            <Text style={ar.pillLabel}>Correct answer</Text>
            <Text style={ar.pillValue}>{q.correctAnswer}</Text>
          </View>
        )}
      </View>

      {/* Explanation */}
      <View style={ar.explanation}>
        <Text style={ar.explanationText}>💡 {q.explanation}</Text>
      </View>
    </View>
  );
}

const ar = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    gap: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
  },
  statusDot: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  dotCorrect: { backgroundColor: Colors.green },
  dotWrong: { backgroundColor: Colors.danger },
  statusIcon: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white },
  qInfo: { flex: 1, gap: 3 },
  qLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  qText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink, lineHeight: 19 },
  answers: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 12,
    flexWrap: 'wrap',
  },
  pill: {
    flex: 1,
    minWidth: 100,
    borderRadius: 10,
    padding: 10,
    gap: 3,
  },
  pillNeutral: { backgroundColor: Colors.green_bg },
  pillWrong: { backgroundColor: '#FFF0F0' },
  pillCorrect: { backgroundColor: Colors.green_bg },
  pillLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.4 },
  pillValue: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  pillValueEmpty: { color: Colors.ink4, fontFamily: 'Inter_400Regular' },
  explanation: {
    backgroundColor: Colors.bg2,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  explanationText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 18 },
});

// ── Section divider ─────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <View style={sd.wrap}>
      <View style={sd.line} />
      <Text style={sd.label}>{label}</Text>
      <View style={sd.line} />
    </View>
  );
}
const sd = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink3 },
});

// ── Main screen ─────────────────────────────────────────────────
export default function ReadingResultsScreen() {
  const [result, setResult] = useState<ReadingResult | null>(null);

  useEffect(() => {
    const r = getReadingResult();
    setResult(r);
    clearReadingResult();
  }, []);

  if (!result) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.empty}>
          <Text style={s.emptyText}>No result found.</Text>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home' as any)}>
            <Text style={s.emptyLink}>Go home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const {
    exam, difficulty, passageTitle,
    timeTakenSeconds, totalQuestions, correctCount,
    bandEstimate, answers, questions,
  } = result;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const bc = bandColor(bandEstimate);

  const matchingQs = questions.filter(q => q.type === 'matching');
  const mcqQs = questions.filter(q => q.type === 'mcq');
  const tfngQs = questions.filter(q => q.type === 'tfng');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Reading Results</Text>
          <View style={s.metaRow}>
            <Text style={s.metaChip}>{exam} · {difficulty}</Text>
            <Text style={s.metaChip}>⏱ {mins}m {secs}s</Text>
            <Text style={s.metaChip}>📖 {passageTitle}</Text>
          </View>
        </View>

        {/* Score card */}
        <View style={s.scoreCard}>
          <View style={s.scoreLeft}>
            <Text style={[s.scoreNumber, { color: bc }]}>
              {correctCount}<Text style={s.scoreTotal}>/{totalQuestions}</Text>
            </Text>
            <Text style={s.scoreLabel}>Questions correct</Text>
            <View style={[s.pctBadge, { backgroundColor: bc + '22', borderColor: bc }]}>
              <Text style={[s.pctText, { color: bc }]}>{pct}%</Text>
            </View>
          </View>
          <View style={s.scoreDivider} />
          <View style={s.scoreRight}>
            <Text style={[s.bandNumber, { color: bc }]}>{bandEstimate.toFixed(1)}</Text>
            <Text style={s.bandLabel}>Band estimate</Text>
            <Text style={s.bandDesc}>
              {bandEstimate >= 7.5 ? 'Excellent' :
               bandEstimate >= 6.5 ? 'Good' :
               bandEstimate >= 5.5 ? 'Competent' : 'Developing'}
            </Text>
          </View>
        </View>

        {/* Quick stats */}
        <View style={s.statsRow}>
          {[
            { label: 'Correct', value: String(correctCount), color: Colors.green },
            { label: 'Incorrect', value: String(totalQuestions - correctCount), color: Colors.danger },
            { label: 'Time', value: `${mins}m`, color: Colors.p },
          ].map(stat => (
            <View key={stat.label} style={s.statCard}>
              <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
              <Text style={s.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Answer review */}
        <Text style={s.reviewTitle}>Answer Review</Text>

        <SectionDivider label="Matching Headings  (Q1–5)" />
        {matchingQs.map(q => (
          <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />
        ))}

        <SectionDivider label="Multiple Choice  (Q6–9)" />
        {mcqQs.map(q => (
          <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />
        ))}

        <SectionDivider label="True / False / Not Given  (Q10–13)" />
        {tfngQs.map(q => (
          <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />
        ))}

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.tryAgainBtn}
            onPress={() => router.replace('/modules/reading/select' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.tryAgainText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.homeBtn}
            onPress={() => router.replace('/(tabs)/home' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.homeBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 },
  emptyLink: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },

  header: { gap: 8 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.ink },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.ink3,
    backgroundColor: Colors.bg2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },

  scoreCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreLeft: { flex: 1, alignItems: 'center', gap: 4 },
  scoreNumber: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 64, lineHeight: 70 },
  scoreTotal: { fontSize: 32, color: Colors.ink3 },
  scoreLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  pctBadge: {
    borderWidth: 1,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  pctText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  scoreDivider: {
    width: 1, height: 80,
    backgroundColor: Colors.border,
    marginHorizontal: 16,
  },
  scoreRight: { flex: 1, alignItems: 'center', gap: 4 },
  bandNumber: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 64, lineHeight: 70 },
  bandLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  bandDesc: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2, marginTop: 4 },

  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 4,
  },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },

  reviewTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink, marginTop: 4 },

  actions: { flexDirection: 'row', gap: 12, marginTop: 6 },
  tryAgainBtn: {
    flex: 1,
    backgroundColor: Colors.bg2,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tryAgainText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  homeBtn: {
    flex: 1,
    backgroundColor: Colors.p,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  homeBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
});
