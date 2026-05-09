import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const CRITERIA = [
  { key: 'Task Achievement',     short: 'Task Ach.', val: 7.0, summary: 'Position is clear and consistently addressed throughout.' },
  { key: 'Coherence & Cohesion', short: 'Coherence', val: 7.5, summary: 'Ideas are logically organized. Paragraphing is effective.' },
  { key: 'Lexical Resource',     short: 'Lexical',   val: 6.5, summary: 'Good range of vocabulary. Some repetition noticed.' },
  { key: 'Grammatical Range',    short: 'Grammar',   val: 7.0, summary: 'Mix of complex and simple structures. Minor errors.' },
];

export default function WritingResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const overallScore = CRITERIA.reduce((s, c) => s + c.val, 0) / CRITERIA.length;

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Writing Results</Text>
        <TouchableOpacity style={s.shareBtn}><Text style={s.shareBtnText}>Share</Text></TouchableOpacity>
      </View>

      <View style={[s.scoreHero, { backgroundColor: T.writingBg }]}>
        <Text style={s.scoreEyebrow}>IELTS ACADEMIC · TASK 2 · 38m 40s · 328 words</Text>
        <View style={s.scoreRow}>
          <View style={[s.scoreIcon, { backgroundColor: T.writing }]}><Text style={{ fontSize: 24 }}>✍️</Text></View>
          <View>
            <Text style={s.scoreName}>Writing</Text>
            <Text style={[s.scoreNum, { color: T.writing }]}>{overallScore.toFixed(1)}<Text style={s.scoreUnit}> /9.0</Text></Text>
          </View>
        </View>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Band breakdown</Text>
        {CRITERIA.map((c, i) => (
          <View key={c.key} style={[s.criteriaBlock, i < CRITERIA.length - 1 && s.criteriaBorder]}>
            <View style={s.criteriaHeader}>
              <Text style={s.criteriaKey}>{c.key}</Text>
              <Text style={[s.criteriaVal, { color: T.writing }]}>{c.val.toFixed(1)}</Text>
            </View>
            <View style={s.criteriaBar}><View style={[s.criteriaFill, { width: `${(c.val / 9) * 100}%` as any }]} /></View>
            <Text style={s.criteriaSummary}>{c.summary}</Text>
          </View>
        ))}
      </View>

      <View style={[s.tipsCard, { backgroundColor: T.writingBg }]}>
        <Text style={[s.tipsTitle, { color: T.writing }]}>AI Feedback</Text>
        <Text style={s.tipsBody}>Strong task achievement and coherence. Your introduction effectively frames the argument. To push from Band 7 to Band 8, vary your sentence openers and add more specific real-world examples in body paragraphs.</Text>
      </View>

      <View style={s.ctaRow}>
        <TouchableOpacity style={s.retryBtn} onPress={() => router.push('/modules/writing/session' as any)}><Text style={s.retryBtnText}>Try again</Text></TouchableOpacity>
        <TouchableOpacity style={[s.nextBtn, { backgroundColor: T.writing }]} onPress={() => router.push('/(tabs)/practice' as any)}><Text style={s.nextBtnText}>Back to practice →</Text></TouchableOpacity>
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
  criteriaFill: { height: '100%', backgroundColor: T.writing, borderRadius: 99 },
  criteriaSummary: { fontSize: 12, color: T.ink3, lineHeight: 18 },
  tipsCard: { margin: 16, marginTop: 0, borderRadius: 16, padding: 18, gap: 8 },
  tipsTitle: { fontSize: 13, fontWeight: '700' },
  tipsBody: { fontSize: 13, color: T.ink, lineHeight: 20 },
  ctaRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16 },
  retryBtn: { flex: 1, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  retryBtnText: { fontSize: 14, fontWeight: '700', color: T.ink },
  nextBtn: { flex: 2, borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});
