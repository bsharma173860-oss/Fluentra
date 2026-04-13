import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { getExamResult, overallBand, type FullExamResult, type ModuleKey } from '@/lib/examStore';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';

// ─────────────────────────────────────────────────────────────────
// Config
// ─────────────────────────────────────────────────────────────────
const MODULE_META: Record<ModuleKey, {
  icon: string; label: string; color: string; bg: string;
}> = {
  listening: { icon: '🎧', label: 'Listening', color: Colors.green,  bg: Colors.green_bg  },
  reading:   { icon: '📖', label: 'Reading',   color: Colors.orange, bg: Colors.orange_bg },
  writing:   { icon: '✏️',  label: 'Writing',   color: Colors.gold,   bg: Colors.gold_bg   },
  speaking:  { icon: '🎙',  label: 'Speaking',  color: Colors.p,      bg: Colors.p_soft    },
};

const MODULE_ORDER: ModuleKey[] = ['listening', 'reading', 'writing', 'speaking'];

const MOCK_FEEDBACK: Record<ModuleKey, { strengths: string[]; improvements: string[] }> = {
  listening: {
    strengths: ['Strong section completion rate', 'Good note-taking strategy'],
    improvements: ['Listen more carefully to numbers and dates', 'Watch out for spelling in fill-in-blank'],
  },
  reading: {
    strengths: ['Good passage comprehension', 'Efficient skimming technique'],
    improvements: ['Re-read True/False/Not Given questions carefully', 'Manage time better on long passages'],
  },
  writing: {
    strengths: ['Clear paragraph structure', 'Good use of discourse markers'],
    improvements: ['Include more specific data from the graph', 'Vary sentence structure more'],
  },
  speaking: {
    strengths: ['Fluent delivery', 'Good use of examples'],
    improvements: ['Extend answers with more detail', 'Reduce filler words (um, uh)'],
  },
};

// ─────────────────────────────────────────────────────────────────
// Fallback result (when arriving directly, not via full-exam)
// ─────────────────────────────────────────────────────────────────
const FALLBACK_RESULT: FullExamResult = {
  languageCode: 'en',
  examId: 'ielts',
  scores: { listening: 32, reading: 11, writing: 7, speaking: 7 },
  maxScores: { listening: 40, reading: 13, writing: 9, speaking: 9 },
  completedAt: new Date().toISOString(),
};

// ─────────────────────────────────────────────────────────────────
// Expandable feedback card
// ─────────────────────────────────────────────────────────────────
function FeedbackCard({
  module, result,
}: {
  module: ModuleKey;
  result: FullExamResult;
}) {
  const [expanded, setExpanded] = useState(false);
  const meta = MODULE_META[module];
  const fb = MOCK_FEEDBACK[module];
  const score = result.scores[module];
  const maxScore = result.maxScores[module];
  const pct = score / maxScore;

  return (
    <TouchableOpacity
      style={s.feedCard}
      onPress={() => setExpanded(e => !e)}
      activeOpacity={0.8}
    >
      <View style={s.feedCardTop}>
        <View style={[s.feedIconWrap, { backgroundColor: meta.bg }]}>
          <Text style={s.feedIcon}>{meta.icon}</Text>
        </View>
        <View style={s.feedCardMeta}>
          <Text style={[s.feedLabel, { color: meta.color }]}>{meta.label}</Text>
          <View style={s.feedBarWrap}>
            <View style={s.feedBarTrack}>
              <View style={[s.feedBarFill, { width: `${pct * 100}%` as any, backgroundColor: meta.color }]} />
            </View>
          </View>
        </View>
        <Text style={[s.feedScore, { color: meta.color }]}>
          {score}<Text style={s.feedScoreMax}>/{maxScore}</Text>
        </Text>
        <Text style={s.expandArrow}>{expanded ? '▲' : '▼'}</Text>
      </View>

      {expanded && (
        <View style={s.feedBody}>
          <View style={s.feedSection}>
            <Text style={s.feedSectionLabel}>✓ Strengths</Text>
            {fb.strengths.map(t => (
              <Text key={t} style={[s.feedItem, { color: Colors.green }]}>• {t}</Text>
            ))}
          </View>
          <View style={s.feedSection}>
            <Text style={[s.feedSectionLabel, { color: Colors.orange }]}>⚑ Improvements</Text>
            {fb.improvements.map(t => (
              <Text key={t} style={[s.feedItem, { color: Colors.ink2 }]}>• {t}</Text>
            ))}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────
export default function ExamResults() {
  const { code, exam } = useLocalSearchParams<{ code: string; exam: string }>();
  const result = getExamResult() ?? FALLBACK_RESULT;
  const band = overallBand(result);

  const profiles = LANGUAGE_EXAMS[code ?? 'en'] ?? [];
  const examProfile = profiles.find(e => e.id === exam) ?? profiles[0];

  // Weakest module
  const weakest = MODULE_ORDER.reduce((w, k) => {
    const pctW = result.scores[w] / result.maxScores[w];
    const pctK = result.scores[k] / result.maxScores[k];
    return pctK < pctW ? k : w;
  });

  const examDate = new Date(result.completedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Overall band score hero */}
        <View style={s.heroCard}>
          <View style={[s.examTag, { backgroundColor: examProfile?.bg ?? Colors.p_soft }]}>
            <Text style={[s.examTagText, { color: examProfile?.color ?? Colors.p }]}>
              {examProfile?.name ?? exam?.toUpperCase()}
            </Text>
          </View>
          <Text style={s.heroLabel}>Overall Band Score</Text>
          <Text style={s.heroBand}>{band.toFixed(1)}</Text>
          <Text style={s.heroDate}>{examDate}</Text>
        </View>

        {/* 4 module scores in a row */}
        <View style={s.moduleRow}>
          {MODULE_ORDER.map(key => {
            const m = MODULE_META[key];
            const score = result.scores[key];
            const max = result.maxScores[key];
            return (
              <View key={key} style={[s.moduleCell, { backgroundColor: m.bg }]}>
                <Text style={s.moduleCellIcon}>{m.icon}</Text>
                <Text style={[s.moduleCellScore, { color: m.color }]}>{score}</Text>
                <Text style={s.moduleCellMax}>/{max}</Text>
                <Text style={[s.moduleCellLabel, { color: m.color }]}>{m.label}</Text>
              </View>
            );
          })}
        </View>

        {/* Detailed feedback */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Detailed Feedback</Text>
          <Text style={s.sectionHint}>Tap each module to expand</Text>
        </View>

        <View style={s.feedList}>
          {MODULE_ORDER.map(key => (
            <FeedbackCard key={key} module={key} result={result} />
          ))}
        </View>

        {/* What's next */}
        <View style={s.whatsNextCard}>
          <Text style={s.whatsNextTitle}>What's next?</Text>
          <View style={s.whatsNextItem}>
            <Text style={s.whatsNextIcon}>🎯</Text>
            <Text style={s.whatsNextText}>
              Practice your weakest module:{' '}
              <Text style={{ color: MODULE_META[weakest].color, fontFamily: 'Inter_700Bold' }}>
                {MODULE_META[weakest].label}
              </Text>
            </Text>
          </View>
          <View style={s.whatsNextItem}>
            <Text style={s.whatsNextIcon}>📅</Text>
            <Text style={s.whatsNextText}>Next monthly exam: May 1, 2026</Text>
          </View>
          <View style={s.whatsNextItem}>
            <Text style={s.whatsNextIcon}>🏆</Text>
            <Text style={s.whatsNextText}>Your rank this week: #12</Text>
          </View>
        </View>

        {/* Action buttons */}
        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.replace(`/language/${code}` as any)}
          activeOpacity={0.88}
        >
          <Text style={s.primaryBtnText}>Practice weak modules →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => router.replace('/(tabs)/home' as any)}
          activeOpacity={0.88}
        >
          <Text style={s.secondaryBtnText}>Back to home</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 16 },

  heroCard: {
    backgroundColor: '#1A1A2E', borderRadius: 22, padding: 28,
    alignItems: 'center', gap: 6,
  },
  examTag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginBottom: 4 },
  examTagText: { fontFamily: 'Inter_700Bold', fontSize: 12, letterSpacing: 0.5 },
  heroLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.55)' },
  heroBand: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 86,
    color: Colors.white, lineHeight: 92,
  },
  heroDate: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 2 },

  moduleRow: { flexDirection: 'row', gap: 8 },
  moduleCell: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 2 },
  moduleCellIcon: { fontSize: 20 },
  moduleCellScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24 },
  moduleCellMax: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3, marginTop: -4 },
  moduleCellLabel: { fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 2 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  sectionHint: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  feedList: { gap: 10 },
  feedCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border, padding: 14,
  },
  feedCardTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  feedIconWrap: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  feedIcon: { fontSize: 20 },
  feedCardMeta: { flex: 1, gap: 5 },
  feedLabel: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  feedBarWrap: {},
  feedBarTrack: { height: 4, backgroundColor: Colors.bg2, borderRadius: 2, overflow: 'hidden' },
  feedBarFill: { height: '100%', borderRadius: 2 },
  feedScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22 },
  feedScoreMax: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  expandArrow: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, width: 16, textAlign: 'center' },
  feedBody: { marginTop: 14, gap: 12, borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 14 },
  feedSection: { gap: 5 },
  feedSectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.green, marginBottom: 2 },
  feedItem: { fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19 },

  whatsNextCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 18, gap: 12,
  },
  whatsNextTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  whatsNextItem: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  whatsNextIcon: { fontSize: 18, width: 26 },
  whatsNextText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2, flex: 1 },

  primaryBtn: {
    backgroundColor: Colors.p, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  primaryBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white },
  secondaryBtn: {
    borderRadius: 16, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  secondaryBtnText: { fontFamily: 'Inter_500Medium', fontSize: 16, color: Colors.ink2 },
});
