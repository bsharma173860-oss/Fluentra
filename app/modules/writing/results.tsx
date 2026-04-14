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
import { getWritingResult, clearWritingResult, WritingResult } from '@/lib/writingStore';

// ── Score bar ────────────────────────────────────────────────────
function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 9) * 100;
  const color = value >= 7 ? Colors.green : value >= 5.5 ? Colors.p : Colors.orange;
  return (
    <View style={bar.row}>
      <Text style={bar.label}>{label}</Text>
      <View style={bar.trackWrap}>
        <View style={bar.track}>
          <View style={[bar.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
        </View>
        <Text style={[bar.val, { color }]}>{value.toFixed(1)}</Text>
      </View>
    </View>
  );
}

const bar = StyleSheet.create({
  row: { gap: 6 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  trackWrap: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: Colors.bg2,
    borderRadius: 99,
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: 99 },
  val: { fontFamily: 'Inter_700Bold', fontSize: 13, width: 30, textAlign: 'right' },
});

// ── Section card ─────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sec.card}>
      <Text style={sec.title}>{title}</Text>
      {children}
    </View>
  );
}

const sec = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
});

// ── Main ─────────────────────────────────────────────────────────
export default function WritingResultsScreen() {
  const [result, setResult] = useState<WritingResult | null>(null);

  useEffect(() => {
    const r = getWritingResult();
    setResult(r);
    clearWritingResult();
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

  const { bandScore, taskAchievement, coherenceCohesion, lexicalResource, grammaticalRange,
    strengths, improvements, correctedSentences, wordCount, timeTakenSeconds, task, exam } = result;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;
  const timeLabel = `${mins}m ${secs}s`;

  const bandColor = bandScore >= 7 ? Colors.green : bandScore >= 5.5 ? Colors.p : Colors.orange;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Writing Results</Text>
          <View style={s.headerMeta}>
            <Text style={s.metaChip}>{exam} · {task === 'task1' ? 'Task 1' : 'Task 2'}</Text>
            <Text style={s.metaChip}>⏱ {timeLabel}</Text>
            <Text style={s.metaChip}>📝 {wordCount} words</Text>
          </View>
        </View>

        {/* Overall band score */}
        <View style={s.bandCard}>
          <Text style={s.bandLabel}>Overall Band Score</Text>
          <Text style={[s.bandScore, { color: bandColor }]}>{bandScore.toFixed(1)}</Text>
          <Text style={s.bandSub}>
            {bandScore >= 7 ? 'Good — University level English' :
              bandScore >= 6 ? 'Competent — some complex language' :
                bandScore >= 5 ? 'Modest — partial command of English' :
                  'Limited — frequent errors'}
          </Text>
        </View>

        {/* Subscores */}
        <SectionCard title="Score Breakdown">
          <ScoreBar label="Task Achievement" value={taskAchievement} />
          <ScoreBar label="Coherence & Cohesion" value={coherenceCohesion} />
          <ScoreBar label="Lexical Resource" value={lexicalResource} />
          <ScoreBar label="Grammatical Range" value={grammaticalRange} />
        </SectionCard>

        {/* Strengths */}
        <SectionCard title="✅ Strengths">
          {strengths.map((s, i) => (
            <View key={i} style={list.row}>
              <View style={list.dot} />
              <Text style={list.text}>{s}</Text>
            </View>
          ))}
        </SectionCard>

        {/* Improvements */}
        <SectionCard title="🔶 Areas to Improve">
          {improvements.map((imp, i) => (
            <View key={i} style={list.row}>
              <Text style={list.arrow}>›</Text>
              <Text style={[list.text, { color: Colors.orange }]}>{imp}</Text>
            </View>
          ))}
        </SectionCard>

        {/* Corrected sentences */}
        <SectionCard title="✏️ Corrected Sentences">
          {correctedSentences.map((cs, i) => (
            <View key={i} style={cs_s.block}>
              <View style={cs_s.original}>
                <Text style={cs_s.originalLabel}>Original</Text>
                <Text style={cs_s.originalText}>{cs.original}</Text>
              </View>
              <View style={cs_s.corrected}>
                <Text style={cs_s.correctedLabel}>Corrected</Text>
                <Text style={cs_s.correctedText}>{cs.corrected}</Text>
              </View>
              <View style={cs_s.reason}>
                <Text style={cs_s.reasonText}>💡 {cs.reason}</Text>
              </View>
            </View>
          ))}
        </SectionCard>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.tryAgainBtn}
            onPress={() => router.replace('/modules/writing/select' as any)}
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

const list = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.green,
    marginTop: 7,
    flexShrink: 0,
  },
  arrow: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.orange, marginTop: -1 },
  text: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },
});

const cs_s = StyleSheet.create({
  block: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    gap: 0,
  },
  original: { backgroundColor: '#FFF3F3', padding: 10, gap: 2 },
  originalLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.danger, letterSpacing: 0.5 },
  originalText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, lineHeight: 19 },
  corrected: { backgroundColor: Colors.green_bg, padding: 10, gap: 2 },
  correctedLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.green, letterSpacing: 0.5 },
  correctedText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink, lineHeight: 19 },
  reason: { backgroundColor: Colors.bg2, padding: 10 },
  reasonText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 18 },
});

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 },
  emptyLink: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },

  header: { gap: 8 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.ink },
  headerMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
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

  bandCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },
  bandLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  bandScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52, lineHeight: 60 },
  bandSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, textAlign: 'center' },

  actions: { flexDirection: 'row', gap: 12 },
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
