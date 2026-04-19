import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WritingSidebar } from '@/components/layout/WritingSidebar';
import { getWritingResult, clearWritingResult, type WritingResult } from '@/lib/writingStore';

const GOLD    = '#B07A10';
const GOLD_BG = '#FEF9EC';
const GREEN   = '#16A34A';
const PURPLE  = '#5B4EFF';

// ── Mock leaderboard data ─────────────────────────────────────────
// Replace with real Supabase query when leaderboard table is ready.
const MOCK_RANK  = 312;
const MOCK_TOTAL = 26000;
const MOCK_TOP   = 1.2;

function buildLeaderboard(userScore: number) {
  return [
    { rank: MOCK_RANK - 2, name: 'Priya S.',  score: userScore + 0.5, isUser: false },
    { rank: MOCK_RANK - 1, name: 'Ahmed K.',  score: userScore + 0.5, isUser: false },
    { rank: MOCK_RANK,     name: 'You',        score: userScore,       isUser: true  },
    { rank: MOCK_RANK + 1, name: 'Maria L.',  score: Math.max(userScore - 0.5, 4.0), isUser: false },
    { rank: MOCK_RANK + 2, name: 'James T.',  score: Math.max(userScore - 0.5, 4.0), isUser: false },
  ];
}

// ── Score helpers ─────────────────────────────────────────────────
function scoreColor(v: number) {
  if (v >= 7) return GREEN;
  if (v >= 5.5) return GOLD;
  return '#C04A06';
}

function bandDesc(score: number) {
  if (score >= 8) return 'Expert';
  if (score >= 7) return 'Good';
  if (score >= 6) return 'Competent';
  if (score >= 5) return 'Modest';
  return 'Limited';
}

// ── Criterion feedback (mock until backend is wired) ──────────────
const CRITERION_FEEDBACK: Record<string, { feedback: string; highlight: string; correction: string }> = {
  'Task Achievement': {
    feedback: 'You addressed the main task and presented a clear position throughout the response. The ideas are relevant and developed with some detail.',
    highlight: '"Technology have become essential in modern life..."',
    correction: 'Consider: "Technology has become essential in modern life..." — maintains subject-verb agreement throughout.',
  },
  'Coherence & Cohesion': {
    feedback: 'Paragraphs are logically sequenced with a clear progression of ideas. Linking devices are used, though some are over-repeated.',
    highlight: '"Furthermore... Furthermore... Furthermore..."',
    correction: 'Vary cohesive devices: use "Moreover", "In addition", "Additionally" to avoid repetition.',
  },
  'Lexical Resource': {
    feedback: 'A satisfactory range of vocabulary is used with some flexibility. There are occasional errors in word choice and collocation.',
    highlight: '"The problem is very big and affects many peoples."',
    correction: '"The issue is widespread and affects many people." — "people" is already plural.',
  },
  'Grammatical Range': {
    feedback: 'A mix of simple and complex structures is used. Errors occur but rarely impede communication.',
    highlight: '"In my opinion, I think that this is important."',
    correction: '"In my opinion, this is important." — "In my opinion" already signals a personal view.',
  },
};

// ── Main component ────────────────────────────────────────────────
export default function WritingResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const [result, setResult] = useState<WritingResult | null>(null);

  useEffect(() => {
    const r = getWritingResult();
    setResult(r);
    clearWritingResult();
  }, []);

  if (!result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 }}>No result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home' as any)} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p }}>Go home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const {
    bandScore, taskAchievement, coherenceCohesion,
    lexicalResource, grammaticalRange,
    correctedSentences, wordCount, timeTakenSeconds, task, exam, response,
  } = result;

  const mins      = Math.floor(timeTakenSeconds / 60);
  const secs      = timeTakenSeconds % 60;
  const timeLabel = `${mins}m ${secs}s`;
  const leaderboard = buildLeaderboard(bandScore);

  const CRITERIA = [
    { label: 'Task Achievement', value: taskAchievement,   short: 'Task Ach.' },
    { label: 'Coherence & Cohesion', value: coherenceCohesion, short: 'Coherence' },
    { label: 'Lexical Resource', value: lexicalResource,   short: 'Lexical'   },
    { label: 'Grammatical Range', value: grammaticalRange, short: 'Grammar'   },
  ];

  const mainContent = (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Writing Results</Text>
          <View style={s.headerMeta}>
            <View style={s.metaChip}><Text style={s.metaChipText}>{exam}</Text></View>
            <View style={s.metaChip}><Text style={s.metaChipText}>{task === 'task1' ? 'Task 1' : 'Task 2'}</Text></View>
            <View style={s.metaChip}><Text style={s.metaChipText}>{timeLabel}</Text></View>
            <View style={s.metaChip}><Text style={s.metaChipText}>{wordCount} words</Text></View>
          </View>
        </View>

        {/* ── Overall score card (dark) ── */}
        <View style={s.bandCard}>
          <Text style={s.bandLabel}>OVERALL BAND SCORE</Text>

          <View style={s.bandScoreRow}>
            <Text style={s.bandScore}>{bandScore.toFixed(1)}</Text>
            <Text style={s.bandDenom}>/9.0</Text>
          </View>

          <View style={s.bandDivider} />

          {/* 4 criteria in a row */}
          <View style={s.criteriaRow}>
            {CRITERIA.map(c => (
              <View key={c.label} style={s.criteriaCell}>
                <Text style={s.criteriaScore}>{c.value.toFixed(1)}</Text>
                <Text style={s.criteriaLabel}>{c.short}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Per-criterion feedback ── */}
        {CRITERIA.map(c => {
          const fb = CRITERION_FEEDBACK[c.label];
          if (!fb) return null;
          return (
            <View key={c.label} style={s.feedbackCard}>
              <View style={s.feedbackHeader}>
                <Text style={s.feedbackCriterion}>{c.label}</Text>
                <View style={[s.scoreBadge, { backgroundColor: scoreColor(c.value) + '18' }]}>
                  <Text style={[s.scoreBadgeText, { color: scoreColor(c.value) }]}>{c.value.toFixed(1)}</Text>
                </View>
              </View>
              <Text style={s.feedbackText}>{fb.feedback}</Text>

              {/* Highlighted example */}
              <View style={s.highlight}>
                <Text style={s.highlightText}>{fb.highlight}</Text>
              </View>
              <Text style={[s.correctionText, { color: GREEN }]}>{fb.correction}</Text>
            </View>
          );
        })}

        {/* ── Corrected sentences ── */}
        {correctedSentences.length > 0 && (
          <View style={s.feedbackCard}>
            <Text style={s.feedbackCriterion}>Corrected Sentences</Text>
            {correctedSentences.map((cs, i) => (
              <View key={i} style={s.csBlock}>
                <View style={s.csOriginal}>
                  <Text style={s.csLabel}>ORIGINAL</Text>
                  <Text style={s.csOriginalText}>{cs.original}</Text>
                </View>
                <View style={s.csCorrected}>
                  <Text style={[s.csLabel, { color: GREEN }]}>CORRECTED</Text>
                  <Text style={s.csCorrectedText}>{cs.corrected}</Text>
                </View>
                <View style={s.csReason}>
                  <Text style={s.csReasonText}>{cs.reason}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Your essay ── */}
        <View style={s.feedbackCard}>
          <Text style={s.feedbackCriterion}>Your Essay</Text>
          <Text style={s.essayText}>{response}</Text>
        </View>

        {/* ── Leaderboard ── */}
        <View style={s.leaderCard}>
          <Text style={s.leaderLabel}>YOUR RANKING</Text>
          <Text style={s.leaderRank}>#{MOCK_RANK} out of {MOCK_TOTAL.toLocaleString()}</Text>
          <Text style={s.leaderTopText}>You're in the top {MOCK_TOP}%</Text>

          <View style={s.leaderTable}>
            {leaderboard.map(row => (
              <View key={row.rank} style={[s.leaderRow, row.isUser && s.leaderRowUser]}>
                <Text style={[s.leaderRowRank, row.isUser && s.leaderRowTextUser]}>#{row.rank}</Text>
                <Text style={[s.leaderRowName, row.isUser && s.leaderRowTextUser]}>{row.name}</Text>
                <Text style={[s.leaderRowScore, row.isUser && s.leaderRowTextUser]}>{row.score.toFixed(1)}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity activeOpacity={0.8} style={s.leaderCta}>
            <Text style={s.leaderCtaText}>View full leaderboard →</Text>
          </TouchableOpacity>
        </View>

        {/* ── Actions ── */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.replace('/modules/writing/select' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnText}>Practice again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={() => router.replace('/(tabs)/home' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <WritingSidebar />
        <View style={{ flex: 1 }}>{mainContent}</View>
      </View>
    );
  }

  return mainContent;
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },

  // ── Header ──────────────────────────────
  header: { gap: 8, marginBottom: 2 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  headerMeta:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip: {
    backgroundColor: Colors.bg2, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  metaChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  // ── Dark band card ───────────────────────
  bandCard: {
    backgroundColor: '#1A1A1A', borderRadius: 20,
    padding: 28, gap: 0,
  },
  bandLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10,
    color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const,
    letterSpacing: 0.8, marginBottom: 12,
  },
  bandScoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bandScore: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52,
    color: '#FFFFFF', lineHeight: 56,
  },
  bandDenom: {
    fontFamily: 'Inter_400Regular', fontSize: 20,
    color: 'rgba(255,255,255,0.4)', marginBottom: 6,
  },
  bandDivider: {
    height: 1, backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 20,
  },
  criteriaRow: { flexDirection: 'row' },
  criteriaCell: { flex: 1, alignItems: 'center', gap: 4 },
  criteriaScore: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' },
  criteriaLabel: {
    fontFamily: 'Inter_400Regular', fontSize: 10,
    color: 'rgba(255,255,255,0.5)', textAlign: 'center',
  },

  // ── Feedback cards ───────────────────────
  feedbackCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 20, gap: 10,
  },
  feedbackHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedbackCriterion: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000' },
  scoreBadge: {
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  scoreBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  feedbackText: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', lineHeight: 24,
  },
  highlight: {
    backgroundColor: GOLD_BG,
    borderLeftWidth: 3, borderLeftColor: GOLD,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4,
  },
  highlightText: {
    fontFamily: 'Inter_400Regular', fontSize: 13, color: GOLD, lineHeight: 20,
  },
  correctionText: {
    fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 20,
  },

  // ── Corrected sentences ──────────────────
  csBlock: {
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  csOriginal:      { backgroundColor: '#FFF3F3', padding: 10 },
  csCorrected:     { backgroundColor: '#ECFDF5', padding: 10 },
  csReason:        { backgroundColor: Colors.bg2, padding: 10 },
  csLabel:         { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#C04A06', letterSpacing: 0.5, marginBottom: 3 },
  csOriginalText:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, lineHeight: 19 },
  csCorrectedText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink, lineHeight: 19 },
  csReasonText:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 18 },

  // ── Essay ───────────────────────────────
  essayText: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', lineHeight: 26,
  },

  // ── Leaderboard ─────────────────────────
  leaderCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 20, gap: 4,
  },
  leaderLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#999',
    textTransform: 'uppercase' as const, letterSpacing: 0.6,
  },
  leaderRank:    { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#000', marginTop: 4 },
  leaderTopText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: GREEN, marginBottom: 14 },

  leaderTable: { gap: 2 },
  leaderRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8, gap: 0,
  },
  leaderRowUser: { backgroundColor: '#F0EEFF' },
  leaderRowRank: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3, width: 46 },
  leaderRowName: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1 },
  leaderRowScore:{ fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  leaderRowTextUser: { color: PURPLE },

  leaderCta: { marginTop: 8 },
  leaderCtaText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: PURPLE },

  // ── Actions ─────────────────────────────
  actions: { flexDirection: 'row', gap: 10 },
  primaryBtn: {
    flex: 1, backgroundColor: GOLD, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
  },
  primaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  secondaryBtn: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: 10, paddingVertical: 12,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  secondaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
});
