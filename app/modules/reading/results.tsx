import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ReadingSidebar } from '@/components/layout/ReadingSidebar';
import { getReadingResult, clearReadingResult, type ReadingResult } from '@/lib/readingStore';

const ORANGE     = '#C04A06';
const ORANGE_BG  = '#FFF7ED';
const ORANGE_BDR = '#FED7AA';
const GREEN      = '#16A34A';
const GREEN_BG   = '#EDFAF4';
const RED_BG     = '#FFF0EE';
const PURPLE     = '#5B4EFF';

// ── Mock leaderboard ───────────────────────────────────────────────
const MOCK_RANK  = 491;
const MOCK_TOTAL = 26_000;
const MOCK_TOP   = 1.9;

function buildLeaderboard(userScore: number) {
  return [
    { rank: MOCK_RANK - 2, name: 'Priya S.',  score: userScore + 1, isUser: false },
    { rank: MOCK_RANK - 1, name: 'Ahmed K.',  score: userScore + 1, isUser: false },
    { rank: MOCK_RANK,     name: 'You',        score: userScore,     isUser: true  },
    { rank: MOCK_RANK + 1, name: 'Maria L.',  score: Math.max(userScore - 1, 0), isUser: false },
    { rank: MOCK_RANK + 2, name: 'James T.',  score: Math.max(userScore - 1, 0), isUser: false },
  ];
}

// ── Answer row ─────────────────────────────────────────────────────
function AnswerRow({ q, userAnswer }: {
  q: ReadingResult['questions'][0];
  userAnswer: string | undefined;
}) {
  const isCorrect = (userAnswer ?? '') === q.correctAnswer;
  const answered  = (userAnswer ?? '').length > 0;

  return (
    <View style={[ar.wrap, isCorrect ? ar.wrapOk : ar.wrapBad]}>
      <View style={ar.topRow}>
        <View style={[ar.badge, isCorrect ? ar.badgeOk : ar.badgeBad]}>
          <Text style={ar.badgeText}>{isCorrect ? '✓' : '✕'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ar.meta}>
            {q.shortLabel} · {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'tfng' ? 'True/False/NG' : 'Matching'}
          </Text>
          <Text style={ar.qText}>{q.text}</Text>
        </View>
      </View>

      <View style={ar.answerRow}>
        <View style={[ar.pill, !isCorrect && answered && ar.pillWrong]}>
          <Text style={ar.pillLabel}>Your answer</Text>
          <Text style={[ar.pillValue, !isCorrect && answered && { color: ORANGE }]}>
            {answered ? userAnswer : '(blank)'}
          </Text>
        </View>
        {!isCorrect && (
          <View style={ar.correctPill}>
            <Text style={ar.pillLabel}>Correct</Text>
            <Text style={[ar.pillValue, { color: GREEN }]}>{q.correctAnswer}</Text>
          </View>
        )}
      </View>

      {/* Explanation */}
      <View style={ar.explanation}>
        <Text style={ar.explanationText}>{q.explanation}</Text>
      </View>
    </View>
  );
}

const ar = StyleSheet.create({
  wrap:    { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 8 },
  wrapOk:  { backgroundColor: GREEN_BG, borderColor: '#A8DFC4' },
  wrapBad: { backgroundColor: RED_BG, borderColor: '#F0C8A0' },
  topRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, paddingBottom: 8 },
  badge: {
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  badgeOk:   { backgroundColor: GREEN },
  badgeBad:  { backgroundColor: ORANGE },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  meta:      { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888', textTransform: 'uppercase' as const, letterSpacing: 0.4, marginBottom: 2 },
  qText:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000', lineHeight: 18 },
  answerRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 8, flexWrap: 'wrap' },
  pill:       { flex: 1, minWidth: 80, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 8, gap: 2 },
  pillWrong:  { backgroundColor: 'rgba(255,255,255,0.8)' },
  correctPill:{ flex: 1, minWidth: 80, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: 8, gap: 2 },
  pillLabel:  { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#888', textTransform: 'uppercase' as const },
  pillValue:  { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000' },
  explanation:{ backgroundColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.06)' },
  explanationText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666', lineHeight: 18 },
});

// ── Question type performance bar ──────────────────────────────────
function TypePerf({ label, correct, total }: { label: string; correct: number; total: number }) {
  const ok  = correct === total;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <View style={tp.row}>
      <Text style={tp.label}>{label}</Text>
      <View style={tp.barTrack}>
        <View style={[tp.barFill, { width: `${pct}%` as any, backgroundColor: ok ? GREEN : ORANGE }]} />
      </View>
      <Text style={[tp.score, { color: ok ? GREEN : ORANGE }]}>{correct}/{total}</Text>
      <Text style={tp.mark}>{ok ? '✓' : '✗'}</Text>
    </View>
  );
}

const tp = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000', width: 150 },
  barTrack: { flex: 1, height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: 2 },
  score:    { fontFamily: 'Inter_700Bold', fontSize: 13, width: 32, textAlign: 'right' },
  mark:     { fontFamily: 'Inter_700Bold', fontSize: 13, width: 16, textAlign: 'center' },
});

// ── Main ───────────────────────────────────────────────────────────
export default function ReadingResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const [result, setResult] = useState<ReadingResult | null>(null);

  useEffect(() => {
    const r = getReadingResult();
    setResult(r);
    clearReadingResult();
  }, []);

  if (!result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 }}>No result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home' as any)} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: ORANGE }}>Go home</Text>
        </TouchableOpacity>
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

  const matchingQs = questions.filter(q => q.type === 'matching');
  const mcqQs      = questions.filter(q => q.type === 'mcq');
  const tfngQs     = questions.filter(q => q.type === 'tfng');

  function countCorrect(qs: typeof questions) {
    return qs.filter(q => (answers[q.number] ?? '') === q.correctAnswer).length;
  }

  const matchingCorrect = countCorrect(matchingQs);
  const mcqCorrect      = countCorrect(mcqQs);
  const tfngCorrect     = countCorrect(tfngQs);

  // Mock 3-passage breakdown (single passage session shows P1 only)
  const p1 = correctCount;
  const p2 = Math.max(0, correctCount - 1);
  const p3 = Math.max(0, correctCount - 2);

  const leaderboard = buildLeaderboard(correctCount);

  const mainContent = (
    <SafeAreaView style={st.safe} edges={['top']}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={st.header}>
          <Text style={st.headerTitle}>Reading Results</Text>
          <View style={st.metaRow}>
            <View style={st.metaChip}><Text style={st.metaChipText}>{exam}</Text></View>
            <View style={st.metaChip}><Text style={st.metaChipText}>{difficulty}</Text></View>
            <View style={st.metaChip}><Text style={st.metaChipText}>{mins}m {secs}s</Text></View>
            <View style={st.metaChip}><Text style={st.metaChipText} numberOfLines={1}>{passageTitle}</Text></View>
          </View>
        </View>

        {/* ── Score card ── */}
        <View style={st.scoreCard}>
          <Text style={st.scoreCardLabel}>READING SCORE</Text>
          <View style={st.scoreRow}>
            <Text style={st.scoreBig}>{correctCount}</Text>
            <Text style={st.scoreDenom}>/{totalQuestions} correct</Text>
          </View>

          <View style={st.scoreDivider} />

          {/* 3 passage scores */}
          <View style={st.passagesRow}>
            {[
              { label: 'P1', val: p1, total: 13 },
              { label: 'P2', val: p2, total: 14 },
              { label: 'P3', val: p3, total: 13 },
            ].map(ps => (
              <View key={ps.label} style={st.passageCell}>
                <Text style={st.passageVal}>{ps.val}/{ps.total}</Text>
                <Text style={st.passageLbl}>{ps.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Performance breakdown ── */}
        <View style={st.perfCard}>
          <Text style={st.perfTitle}>Performance Breakdown</Text>
          <TypePerf label="Matching Headings"  correct={matchingCorrect} total={matchingQs.length} />
          <TypePerf label="Multiple Choice"     correct={mcqCorrect}      total={mcqQs.length}      />
          <TypePerf label="True / False / NG"   correct={tfngCorrect}     total={tfngQs.length}     />

          <View style={st.perfSummary}>
            <View style={[st.perfBadge, { backgroundColor: GREEN_BG }]}>
              <Text style={[st.perfBadgeText, { color: GREEN }]}>
                Strong: {[
                  matchingCorrect === matchingQs.length && 'Matching',
                  mcqCorrect      === mcqQs.length      && 'Multiple Choice',
                  tfngCorrect     === tfngQs.length     && 'True/False/NG',
                ].filter(Boolean).join(', ') || '—'}
              </Text>
            </View>
            <View style={[st.perfBadge, { backgroundColor: RED_BG }]}>
              <Text style={[st.perfBadgeText, { color: ORANGE }]}>
                Needs work: {[
                  matchingCorrect < matchingQs.length && 'Matching',
                  mcqCorrect      < mcqQs.length      && 'Multiple Choice',
                  tfngCorrect     < tfngQs.length     && 'True/False/NG',
                ].filter(Boolean).join(', ') || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Leaderboard ── */}
        <View style={st.leaderCard}>
          <View style={st.leaderHeader}>
            <View>
              <Text style={st.leaderRank}>#{MOCK_RANK} out of {MOCK_TOTAL.toLocaleString()}</Text>
              <Text style={st.leaderSub}>Top {MOCK_TOP}% of all readers this week</Text>
            </View>
            <View style={st.leaderBadge}>
              <Text style={st.leaderBadgeText}>🏆 Top {MOCK_TOP}%</Text>
            </View>
          </View>

          <View style={st.leaderTable}>
            {leaderboard.map(row => (
              <View key={row.rank} style={[st.leaderRow, row.isUser && st.leaderRowUser]}>
                <Text style={[st.leaderRowRank, row.isUser && st.leaderRowRankUser]}>#{row.rank}</Text>
                <Text style={[st.leaderRowName, row.isUser && st.leaderRowNameUser]}>{row.name}</Text>
                <Text style={[st.leaderRowScore, row.isUser && st.leaderRowScoreUser]}>{row.score}/13</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={st.leaderCta} activeOpacity={0.8}>
            <Text style={st.leaderCtaText}>View full leaderboard →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Answer review ── */}
        <Text style={st.reviewTitle}>Answer Review</Text>

        <Text style={st.reviewGroup}>Matching Headings (Q1–5)</Text>
        {matchingQs.map(q => <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />)}

        <Text style={st.reviewGroup}>Multiple Choice (Q6–9)</Text>
        {mcqQs.map(q => <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />)}

        <Text style={st.reviewGroup}>True / False / Not Given (Q10–13)</Text>
        {tfngQs.map(q => <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />)}

        {/* ── Actions ── */}
        <View style={st.actions}>
          <TouchableOpacity
            style={st.primaryBtn}
            onPress={() => router.replace('/modules/reading/select' as any)}
            activeOpacity={0.85}
          >
            <Text style={st.primaryBtnText}>Practice again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={st.secondaryBtn}
            onPress={() => router.replace('/(tabs)/home' as any)}
            activeOpacity={0.85}
          >
            <Text style={st.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ReadingSidebar />
        <View style={{ flex: 1 }}>{mainContent}</View>
      </View>
    );
  }

  return mainContent;
}

const st = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },

  header:       { gap: 8, marginBottom: 2 },
  headerTitle:  { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  metaRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip:     { backgroundColor: Colors.bg2, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border, maxWidth: 200 },
  metaChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  // ── Score card ──────────────────────────────────────
  scoreCard:      { backgroundColor: ORANGE_BG, borderRadius: 20, borderWidth: 1, borderColor: ORANGE_BDR, padding: 28 },
  scoreCardLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: ORANGE,
    textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 12,
  },
  scoreRow:   { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  scoreBig:   { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52, color: ORANGE, lineHeight: 56 },
  scoreDenom: { fontFamily: 'Inter_400Regular', fontSize: 14, color: ORANGE, opacity: 0.5, marginBottom: 8 },
  scoreDivider: { height: 1, backgroundColor: 'rgba(192,74,6,0.15)', marginVertical: 20 },

  passagesRow:  { flexDirection: 'row' },
  passageCell:  { flex: 1, alignItems: 'center', gap: 4 },
  passageVal:   { fontFamily: 'Inter_700Bold', fontSize: 16, color: ORANGE },
  passageLbl:   { fontFamily: 'Inter_400Regular', fontSize: 10, color: ORANGE, opacity: 0.6 },

  // ── Performance card ────────────────────────────────
  perfCard:    { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 20, gap: 12 },
  perfTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000' },
  perfSummary: { gap: 6, marginTop: 4 },
  perfBadge:   { borderRadius: 8, padding: 10 },
  perfBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 18 },

  // ── Leaderboard ─────────────────────────────────────
  leaderCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, padding: 20, gap: 14,
  },
  leaderHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  leaderRank:   { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#000' },
  leaderSub:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888', marginTop: 3 },
  leaderBadge:  { backgroundColor: '#FFF7ED', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  leaderBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: ORANGE },

  leaderTable: { gap: 4 },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: 8, paddingHorizontal: 10, borderRadius: 8,
  },
  leaderRowUser:      { backgroundColor: '#F0EEFF' },
  leaderRowRank:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#888', width: 40 },
  leaderRowRankUser:  { fontFamily: 'Inter_700Bold', color: PURPLE },
  leaderRowName:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#666', flex: 1 },
  leaderRowNameUser:  { fontFamily: 'Inter_700Bold', color: '#000' },
  leaderRowScore:     { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#888' },
  leaderRowScoreUser: { color: ORANGE },

  leaderCta:     { alignItems: 'center', paddingTop: 4 },
  leaderCtaText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: PURPLE },

  // ── Answer review ────────────────────────────────────
  reviewTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#000', marginTop: 2 },
  reviewGroup: {
    fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#888',
    textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4,
  },

  // ── Actions ─────────────────────────────────────────
  actions:        { flexDirection: 'row', gap: 10 },
  primaryBtn:     { flex: 1, backgroundColor: ORANGE, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  secondaryBtn:   { flex: 1, backgroundColor: Colors.white, borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  secondaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
});
