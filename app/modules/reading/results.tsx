import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const BREAKDOWN = [
  { label: 'Passage 1 — Skim & Scan', correct: 5, total: 5, type: 'Matching headings' },
  { label: 'Passage 2 — Detail',       correct: 4, total: 4, type: 'Multiple choice'   },
  { label: 'Passage 3 — Inference',    correct: 2, total: 4, type: 'True / False / NG' },
];

export default function ReadingResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Reading Results</Text>
        <TouchableOpacity style={s.shareBtn}><Text style={s.shareBtnText}>Share</Text></TouchableOpacity>
      </View>

      {/* Score hero */}
      <View style={[s.scoreHero, { backgroundColor: T.readingBg }]}>
        <Text style={s.scoreEyebrow}>IELTS ACADEMIC · HARD · 54m 12s</Text>
        <View style={s.scoreMainRow}>
          <View style={[s.scoreIcon, { backgroundColor: T.reading }]}>
            <Text style={{ fontSize: 24 }}>📖</Text>
          </View>
          <View>
            <Text style={s.scoreName}>Reading</Text>
            <Text style={[s.scoreNum, { color: T.reading }]}>11 <Text style={s.scoreTotal}>/13</Text></Text>
            <Text style={s.scoreSub}>correct</Text>
          </View>
          <View style={s.bandBox}>
            <Text style={s.bandLabel}>BAND EST.</Text>
            <Text style={[s.bandNum, { color: T.reading }]}>7.5</Text>
          </View>
        </View>
      </View>

      {/* Breakdown */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Performance by passage</Text>
        {BREAKDOWN.map((b, i) => (
          <View key={i} style={[s.breakdownRow, i < BREAKDOWN.length - 1 && s.breakdownBorder]}>
            <View style={{ flex: 1 }}>
              <Text style={s.breakdownLabel}>{b.label}</Text>
              <Text style={s.breakdownType}>{b.type}</Text>
              <View style={s.breakdownBar}>
                <View style={[s.breakdownFill, { width: `${(b.correct / b.total) * 100}%` as any, backgroundColor: b.correct === b.total ? T.listening : T.reading }]} />
              </View>
            </View>
            <Text style={[s.breakdownScoreNum, { color: b.correct === b.total ? T.listening : T.reading }]}>{b.correct}/{b.total}</Text>
          </View>
        ))}
      </View>

      {/* Tips */}
      <View style={s.tipsCard}>
        <Text style={s.tipsTitle}>Band 7+ tips</Text>
        {[
          'Skim for general meaning first, then scan for details.',
          'Never leave a question blank — rule out impossibles.',
          'Not Given ≠ False. Only choose False if the passage contradicts.',
          'Match question keywords with synonyms in the text.',
        ].map((tip, i) => (
          <View key={i} style={s.tipRow}>
            <View style={s.tipDot} />
            <Text style={s.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* CTAs */}
      <View style={s.ctaRow}>
        <TouchableOpacity style={s.retryBtn} onPress={() => router.push('/modules/reading/session' as any)}>
          <Text style={s.retryBtnText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.nextBtn} onPress={() => router.push('/(tabs)/practice' as any)}>
          <Text style={s.nextBtnText}>Back to practice →</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;

  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: T.ink },
  shareBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 9, borderWidth: 1, borderColor: T.border },
  shareBtnText: { fontSize: 12.5, fontWeight: '600', color: T.ink2 },

  scoreHero: { padding: 28, gap: 12 },
  scoreEyebrow: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  scoreMainRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scoreName: { fontSize: 13, fontWeight: '700', color: T.ink4, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  scoreNum: { fontFamily: T.serif, fontSize: 44, lineHeight: 48 },
  scoreTotal: { fontSize: 24, color: T.ink4 },
  scoreSub: { fontSize: 12, color: T.ink4 },
  bandBox: { marginLeft: 'auto', alignItems: 'flex-end' },
  bandLabel: { fontSize: 9.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
  bandNum: { fontFamily: T.serif, fontSize: 36 },

  card: { backgroundColor: T.card, margin: 16, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, gap: 12 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  breakdownRow: { paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 14 },
  breakdownBorder: { borderBottomWidth: 1, borderBottomColor: T.hairline },
  breakdownLabel: { fontSize: 13, fontWeight: '600', color: T.ink, marginBottom: 2 },
  breakdownType: { fontSize: 11, color: T.ink4, marginBottom: 6 },
  breakdownBar: { height: 5, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden' },
  breakdownFill: { height: '100%', borderRadius: 99 },
  breakdownScoreNum: { fontFamily: T.serif, fontSize: 18, width: 40, textAlign: 'right' },

  tipsCard: { backgroundColor: T.bg2, margin: 16, marginTop: 0, borderRadius: 16, padding: 18, gap: 12 },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.reading, marginTop: 7, flexShrink: 0 },
  tipText: { fontSize: 13, color: T.ink2, lineHeight: 20, flex: 1 },

  ctaRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16 },
  retryBtn: { flex: 1, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  retryBtnText: { fontSize: 14, fontWeight: '700', color: T.ink },
  nextBtn: { flex: 2, backgroundColor: T.reading, borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
