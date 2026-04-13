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
import { getSpeakingResult, clearSpeakingResult, SpeakingResult } from '@/lib/speakingStore';

// ── Score bar ────────────────────────────────────────────────────
function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 9) * 100;
  const color = value >= 7 ? Colors.green : value >= 5.5 ? Colors.p : Colors.orange;
  return (
    <View style={sb.row}>
      <View style={sb.meta}>
        <Text style={sb.label}>{label}</Text>
        <Text style={[sb.val, { color }]}>{value.toFixed(1)}</Text>
      </View>
      <View style={sb.track}>
        <View style={[sb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const sb = StyleSheet.create({
  row: { gap: 6 },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  val: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  track: { height: 8, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
});

// ── Progress bar (for eye contact) ──────────────────────────────
function EyeContactBar({ pct }: { pct: number }) {
  const color = pct >= 70 ? Colors.green : pct >= 50 ? Colors.p : Colors.orange;
  return (
    <View style={ec.wrap}>
      <View style={ec.meta}>
        <Text style={ec.label}>Eye Contact</Text>
        <Text style={[ec.val, { color }]}>{pct}%</Text>
      </View>
      <View style={ec.track}>
        <View style={[ec.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const ec = StyleSheet.create({
  wrap: { gap: 6 },
  meta: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  val: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  track: { height: 8, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
});

// ── Card ─────────────────────────────────────────────────────────
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={card.wrap}>
      <Text style={card.title}>{title}</Text>
      {children}
    </View>
  );
}
const card = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 12,
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
});

// ── Main ─────────────────────────────────────────────────────────
export default function SpeakingResultsScreen() {
  const [result, setResult] = useState<SpeakingResult | null>(null);

  useEffect(() => {
    const r = getSpeakingResult();
    setResult(r);
    clearSpeakingResult();
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
    exam, part, timeTakenSeconds,
    bandScore, fluency, lexical, grammar, pronunciation,
    strengths, improvements,
    eyeContactPct, confidenceLevel,
    transcript,
  } = result;

  const bandColor = bandScore >= 7 ? Colors.green : bandScore >= 5.5 ? Colors.p : Colors.orange;
  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Speaking Results</Text>
          <View style={s.metaRow}>
            <Text style={s.chip}>{exam} · {part}</Text>
            <Text style={s.chip}>⏱ {mins}m {secs}s</Text>
          </View>
        </View>

        {/* Band score card */}
        <View style={s.bandCard}>
          <Text style={s.bandLabel}>Overall Band Score</Text>
          <Text style={[s.bandScore, { color: bandColor }]}>{bandScore.toFixed(1)}</Text>
          <Text style={s.bandDesc}>
            {bandScore >= 8   ? 'Expert — near-native fluency' :
             bandScore >= 7   ? 'Good — effective command of English' :
             bandScore >= 6   ? 'Competent — generally effective' :
                                'Modest — partial command'}
          </Text>
        </View>

        {/* Score breakdown */}
        <Card title="Score Breakdown">
          <ScoreBar label="Fluency & Coherence"   value={fluency} />
          <ScoreBar label="Lexical Resource"       value={lexical} />
          <ScoreBar label="Grammatical Range"      value={grammar} />
          <ScoreBar label="Pronunciation"          value={pronunciation} />
        </Card>

        {/* Strengths */}
        <Card title="✅ Strengths">
          {strengths.map((str, i) => (
            <View key={i} style={s.listRow}>
              <View style={s.listDot} />
              <Text style={s.listText}>{str}</Text>
            </View>
          ))}
        </Card>

        {/* Improvements */}
        <Card title="🔶 Areas to Improve">
          {improvements.map((imp, i) => (
            <View key={i} style={s.listRow}>
              <Text style={s.listArrow}>›</Text>
              <Text style={[s.listText, { color: Colors.orange }]}>{imp}</Text>
            </View>
          ))}
        </Card>

        {/* Body language */}
        <Card title="👁 Body Language">
          <EyeContactBar pct={eyeContactPct} />
          <View style={s.confRow}>
            <Text style={s.confLabel}>Confidence</Text>
            <View style={[
              s.confBadge,
              confidenceLevel === 'Excellent' ? s.badgeGreen :
              confidenceLevel === 'Good'      ? s.badgeBlue  : s.badgeOrange
            ]}>
              <Text style={[
                s.confBadgeText,
                confidenceLevel === 'Excellent' ? s.badgeTextGreen :
                confidenceLevel === 'Good'      ? s.badgeTextBlue  : s.badgeTextOrange
              ]}>{confidenceLevel}</Text>
            </View>
          </View>
          <Text style={s.bodyNote}>
            * Body language analysis requires camera access. Enable camera permission for accurate feedback.
          </Text>
        </Card>

        {/* Transcript */}
        <Card title="📝 Session Transcript">
          {transcript.map((msg, i) => (
            <View key={i} style={[s.txRow, msg.role === 'user' && s.txRowUser]}>
              <View style={[s.txAvatar, msg.role === 'user' && s.txAvatarUser]}>
                <Text style={s.txAvatarText}>{msg.role === 'examiner' ? 'E' : 'Y'}</Text>
              </View>
              <View style={[s.txBubble, msg.role === 'user' && s.txBubbleUser]}>
                <Text style={[s.txText, msg.role === 'user' && s.txTextUser]}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.tryBtn}
            onPress={() => router.replace('/modules/speaking/select' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.tryText}>Try Again</Text>
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
  chip: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3,
    backgroundColor: Colors.bg2, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },

  bandCard: {
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    padding: 24, alignItems: 'center', gap: 6,
  },
  bandLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  bandScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 80, lineHeight: 88 },
  bandDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, textAlign: 'center' },

  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  listDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.green,
    marginTop: 7, flexShrink: 0,
  },
  listArrow: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.orange, marginTop: -2 },
  listText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },

  confRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  confLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  confBadge: { borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  badgeGreen: { backgroundColor: Colors.green_bg },
  badgeBlue:  { backgroundColor: Colors.p_soft },
  badgeOrange:{ backgroundColor: Colors.orange_bg },
  confBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  badgeTextGreen: { color: Colors.green },
  badgeTextBlue:  { color: Colors.p },
  badgeTextOrange:{ color: Colors.orange },
  bodyNote: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4, lineHeight: 16, marginTop: -4 },

  txRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  txRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  txAvatar: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  txAvatarUser: { backgroundColor: Colors.ink4 },
  txAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.white },
  txBubble: {
    backgroundColor: Colors.bg2,
    borderRadius: 14, borderBottomLeftRadius: 4,
    paddingHorizontal: 12, paddingVertical: 8, flex: 1,
  },
  txBubbleUser: {
    backgroundColor: Colors.p_soft,
    borderBottomLeftRadius: 14, borderBottomRightRadius: 4,
  },
  txText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink, lineHeight: 19 },
  txTextUser: { color: Colors.p },

  actions: { flexDirection: 'row', gap: 12, marginTop: 6 },
  tryBtn: {
    flex: 1, backgroundColor: Colors.bg2, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  tryText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  homeBtn: { flex: 1, backgroundColor: Colors.p, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  homeBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
});
