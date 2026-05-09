import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { useAuth } from '@/lib/authContext';

const STATS = [
  { label: 'Current Band', value: '7.0', delta: '+0.5', color: T.brand },
  { label: 'Sessions', value: '84', delta: '+12' },
  { label: 'Streak', value: '7', delta: '+3' },
  { label: 'Minutes', value: '1,240', delta: '+186' },
];

const MODULE_BREAKDOWN = [
  { label: 'Speaking',  score: 7.5, maxScore: 9, color: T.speaking,  bg: T.speakingBg  },
  { label: 'Writing',   score: 6.5, maxScore: 9, color: T.writing,   bg: T.writingBg   },
  { label: 'Listening', score: 7.5, maxScore: 9, color: T.listening, bg: T.listeningBg },
  { label: 'Reading',   score: 7.5, maxScore: 9, color: T.reading,   bg: T.readingBg   },
];

const CHART_DATA = [
  { label: 'Oct', score: 5.5 },
  { label: 'Nov', score: 6.0 },
  { label: 'Dec', score: 6.0 },
  { label: 'Jan', score: 6.5 },
  { label: 'Feb', score: 7.0 },
  { label: 'Mar', score: 7.0 },
  { label: 'Apr', score: 7.5 },
];

const STREAMS = [
  { label: 'Monthly · Official', key: 'monthly', color: T.brand },
  { label: 'Mock',               key: 'mock',    color: '#5B7CFF' },
  { label: 'Practice',           key: 'practice', color: T.listening },
];

export default function ProgressScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [activeStream, setActiveStream] = useState('monthly');
  const { user } = useAuth();

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.pageHeader}>
        <Text style={s.eyebrow}>Progress</Text>
        <Text style={s.pageTitle}>Your growth, clearly.</Text>
      </View>

      {/* Stats grid */}
      <View style={s.statsGrid}>
        {STATS.map(st => (
          <View key={st.label} style={s.statCard}>
            <Text style={s.statLabel}>{st.label.toUpperCase()}</Text>
            <View style={s.statRow}>
              <Text style={[s.statValue, st.color && { color: st.color }]}>{st.value}</Text>
              {st.delta && (
                <Text style={[s.statDelta, st.delta.startsWith('-') && { color: '#B00020' }]}>
                  {st.delta.startsWith('-') ? '↓' : '↑'} {st.delta.replace(/[+-]/, '')}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Score chart — simplified bar chart */}
      <View style={s.chartCard}>
        <Text style={s.cardTitle}>Band score over time</Text>
        <View style={s.chartArea}>
          {CHART_DATA.map((d, i) => {
            const h = ((d.score - 4) / 5) * 100;
            return (
              <View key={i} style={s.chartCol}>
                <View style={[s.chartBar, { height: `${h}%` as any, backgroundColor: T.brand }]} />
                <Text style={s.chartLabel}>{d.label}</Text>
                <Text style={s.chartScore}>{d.score}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Module breakdown */}
      <View style={s.breakdownCard}>
        <Text style={s.cardTitle}>Module breakdown</Text>
        <View style={s.breakdownList}>
          {MODULE_BREAKDOWN.map(m => (
            <View key={m.label} style={s.breakdownRow}>
              <View style={[s.breakdownIcon, { backgroundColor: m.bg }]}>
                <Text style={[s.breakdownIconText, { color: m.color }]}>
                  {m.label[0]}
                </Text>
              </View>
              <Text style={s.breakdownLabel}>{m.label}</Text>
              <View style={s.breakdownBar}>
                <View style={[s.breakdownFill, { width: `${(m.score / m.maxScore) * 100}%` as any, backgroundColor: m.color }]} />
              </View>
              <Text style={s.breakdownScore}>{m.score.toFixed(1)}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Exam streams */}
      <View style={s.streamsCard}>
        <Text style={s.cardTitle}>Exam attempt streams</Text>
        <View style={s.streamTabs}>
          {STREAMS.map(st => (
            <TouchableOpacity
              key={st.key}
              style={[s.streamTab, activeStream === st.key && { backgroundColor: st.color }]}
              onPress={() => setActiveStream(st.key)}
            >
              <Text style={[s.streamTabText, activeStream === st.key && { color: '#fff' }]}>{st.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sample rows */}
        {[1, 2, 3].map(i => (
          <View key={i} style={[s.attemptRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]}>
            <View style={s.attemptMeta}>
              <Text style={s.attemptDate}>Apr {12 - i * 14}</Text>
              <Text style={s.attemptDesc}>IELTS Academic · Full</Text>
            </View>
            <Text style={s.attemptScore}>{(8 - i * 0.5).toFixed(1)}</Text>
            <Text style={s.attemptDelta}>↑ +0.5</Text>
          </View>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {content}
      <MobileTabBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 18, gap: 18, paddingBottom: 20 },
  scrollDesktop: { padding: 28, paddingHorizontal: 36 },
  pageHeader: { gap: 4 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: T.ink4, letterSpacing: 1.4, textTransform: 'uppercase' },
  pageTitle: { fontFamily: T.serif, fontSize: 34, color: T.ink, lineHeight: 38 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flex: 1, minWidth: 140, backgroundColor: T.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 6 },
  statLabel: { fontSize: 9.5, fontWeight: '700', color: T.ink3, letterSpacing: 1, textTransform: 'uppercase' },
  statRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  statValue: { fontFamily: T.serif, fontSize: 28, color: T.ink, lineHeight: 32 },
  statDelta: { fontSize: 11.5, fontWeight: '700', color: T.listening },
  chartCard: { backgroundColor: T.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: T.border, gap: 14 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  chartArea: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 120 },
  chartCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4, height: '100%' },
  chartBar: { width: '60%', borderRadius: 4, minHeight: 4 },
  chartLabel: { fontSize: 10, color: T.ink4 },
  chartScore: { fontSize: 9, color: T.ink5, fontWeight: '600' },
  breakdownCard: { backgroundColor: T.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: T.border, gap: 14 },
  breakdownList: { gap: 12 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  breakdownIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  breakdownIconText: { fontWeight: '800', fontSize: 13 },
  breakdownLabel: { fontSize: 12, fontWeight: '600', color: T.ink, width: 72 },
  breakdownBar: { flex: 1, height: 6, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden' },
  breakdownFill: { height: '100%', borderRadius: 99 },
  breakdownScore: { fontFamily: T.serif, fontSize: 18, color: T.ink, width: 36, textAlign: 'right' },
  streamsCard: { backgroundColor: T.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: T.border, gap: 14 },
  streamTabs: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  streamTab: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: T.bg2 },
  streamTabText: { fontSize: 11.5, fontWeight: '700', color: T.ink3 },
  attemptRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  attemptMeta: { flex: 1 },
  attemptDate: { fontSize: 11, color: T.ink4 },
  attemptDesc: { fontSize: 13, fontWeight: '600', color: T.ink },
  attemptScore: { fontFamily: T.serif, fontSize: 20, color: T.ink },
  attemptDelta: { fontSize: 11, fontWeight: '700', color: T.listening },
});
