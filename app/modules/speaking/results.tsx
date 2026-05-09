import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const CRITERIA = [
  { key: 'Fluency & Coherence', short: 'Fluency',  val: 7.5, summary: 'Generally natural pace with some hesitation at complex ideas.' },
  { key: 'Lexical Resource',    short: 'Lexical',   val: 7.0, summary: 'A satisfactory range of vocabulary with some repetition.' },
  { key: 'Grammatical Range',   short: 'Grammar',   val: 6.5, summary: 'Mix of complex and simple structures. Some minor errors.' },
  { key: 'Pronunciation',       short: 'Pronunc.',  val: 7.0, summary: 'Clear and intelligible. Accent does not impede understanding.' },
];

export default function SpeakingResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const overallScore = CRITERIA.reduce((s, c) => s + c.val, 0) / CRITERIA.length;

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Speaking Results</Text>
        <TouchableOpacity style={s.shareBtn}><Text style={s.shareBtnText}>Share</Text></TouchableOpacity>
      </View>

      <View style={[s.scoreHero, { backgroundColor: T.speakingBg }]}>
        <Text style={s.scoreEyebrow}>IELTS ACADEMIC · PART 2 · 11m 43s</Text>
        <View style={s.scoreRow}>
          <View style={[s.scoreIcon, { backgroundColor: T.speaking }]}><Text style={{ fontSize: 24 }}>🎤</Text></View>
          <View>
            <Text style={s.scoreName}>Speaking</Text>
            <Text style={[s.scoreNum, { color: T.speaking }]}>{overallScore.toFixed(1)}<Text style={s.scoreUnit}> /9.0</Text></Text>
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Band breakdown</Text>
        {CRITERIA.map((c, i) => (
          <View key={c.key} style={[s.criteriaBlock, i < CRITERIA.length - 1 && s.criteriaBorder]}>
            <View style={s.criteriaHeader}>
              <Text style={s.criteriaKey}>{c.key}</Text>
              <Text style={[s.criteriaVal, { color: T.speaking }]}>{c.val.toFixed(1)}</Text>
            </View>
            <View style={s.criteriaBar}><View style={[s.criteriaFill, { width: `${(c.val / 9) * 100}%` as any }]} /></View>
            <Text style={s.criteriaSummary}>{c.summary}</Text>
          </View>
        ))}
      </View>

      <View style={s.tipsCard}>
        <Text style={s.tipsTitle}>AI Feedback</Text>
        <Text style={s.tipsBody}>Good fluency and natural pacing. You used a good range of vocabulary ("invaluable," "mutual"). Consider adding a personal example to make Part 3 answers more vivid — examiners respond well to specific stories.</Text>
      </View>

      <View style={s.ctaRow}>
        <TouchableOpacity style={s.retryBtn} onPress={() => router.push('/modules/speaking/session' as any)}><Text style={s.retryBtnText}>Try again</Text></TouchableOpacity>
        <TouchableOpacity style={s.nextBtn} onPress={() => router.push('/(tabs)/practice' as any)}><Text style={s.nextBtnText}>Back to practice →</Text></TouchableOpacity>
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
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  scoreIcon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  scoreName: { fontSize: 13, fontWeight: '700', color: T.ink4, textTransform: 'uppercase', marginBottom: 2 },
  scoreNum: { fontFamily: T.serif, fontSize: 44, lineHeight: 48 },
  scoreUnit: { fontSize: 20, color: T.ink4 },
  card: { backgroundColor: T.card, margin: 16, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, gap: 4 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: T.ink, marginBottom: 8 },
  criteriaBlock: { paddingVertical: 12, gap: 6 },
  criteriaBorder: { borderBottomWidth: 1, borderBottomColor: T.hairline },
  criteriaHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  criteriaKey: { fontSize: 13, fontWeight: '600', color: T.ink },
  criteriaVal: { fontFamily: T.serif, fontSize: 20 },
  criteriaBar: { height: 5, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden' },
  criteriaFill: { height: '100%', backgroundColor: T.speaking, borderRadius: 99 },
  criteriaSummary: { fontSize: 12, color: T.ink3, lineHeight: 18 },
  tipsCard: { backgroundColor: T.speakingBg, margin: 16, marginTop: 0, borderRadius: 16, padding: 18, gap: 8 },
  tipsTitle: { fontSize: 13, fontWeight: '700', color: T.speaking },
  tipsBody: { fontSize: 13, color: T.ink, lineHeight: 20 },
  ctaRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16 },
  retryBtn: { flex: 1, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  retryBtnText: { fontSize: 14, fontWeight: '700', color: T.ink },
  nextBtn: { flex: 2, backgroundColor: T.speaking, borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
