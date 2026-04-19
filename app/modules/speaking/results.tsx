import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SpeakingSidebar } from '@/components/layout/SpeakingSidebar';
import { getSpeakingResult, clearSpeakingResult, type SpeakingResult } from '@/lib/speakingStore';

const PURPLE     = '#5B4EFF';
const PURPLE_BG  = '#F0EEFF';
const GREEN      = '#16A34A';
const ORANGE     = '#B07A10';
const RED_MARK   = '#C04A06';

// ── Mock per-criterion feedback ───────────────────────────────────
const CRITERION_DETAILS: Record<string, {
  feedback: string;
  goodPhrase: string;
  improvePhrases: { original: string; suggestion: string }[];
}> = {
  'Fluency & Coherence': {
    feedback: 'You maintained a generally natural pace with some hesitation at complex ideas. Discourse markers were used effectively to connect ideas.',
    goodPhrase: '"Furthermore, this shows that..." — excellent use of cohesive device',
    improvePhrases: [
      { original: '"Um… I think… it's, um, important"', suggestion: 'Replace "um" with a natural pause or "well, I believe…"' },
    ],
  },
  'Lexical Resource': {
    feedback: 'A satisfactory range of vocabulary was demonstrated. Some topic-specific terms were used effectively, though repetition occurred in places.',
    goodPhrase: '"prevalent", "substantial impact", "noteworthy trend" — strong word choices',
    improvePhrases: [
      { original: '"very good" × 3 times', suggestion: 'Vary: "exceptional", "remarkable", "outstanding"' },
    ],
  },
  'Grammatical Range': {
    feedback: 'A mix of simple and complex structures. Errors were rare and rarely impeded communication.',
    goodPhrase: '"Although technology has advanced rapidly, many still prefer…" — complex clause used well',
    improvePhrases: [
      { original: '"I have went to many places"', suggestion: '"I have been to many places" — use past participle' },
    ],
  },
  'Pronunciation': {
    feedback: 'Generally clear delivery with natural stress patterns. Word stress errors occurred occasionally but did not significantly affect intelligibility.',
    goodPhrase: 'Clear sentence stress and intonation on key ideas.',
    improvePhrases: [
      { original: '"de-VE-lop" → wrong stress', suggestion: '"de-vel-op" — stress the second syllable' },
    ],
  },
};

function scoreColor(v: number) {
  if (v >= 7) return GREEN;
  if (v >= 5.5) return ORANGE;
  return RED_MARK;
}

// ── Highlighted phrase component ──────────────────────────────────
function GreenPhrase({ text }: { text: string }) {
  return (
    <View style={hp.green}>
      <Text style={hp.greenText}>{text}</Text>
    </View>
  );
}

function OrangePhrase({ original, suggestion }: { original: string; suggestion: string }) {
  return (
    <View style={hp.orangeBlock}>
      <Text style={hp.orangeOriginal}>{original}</Text>
      <Text style={hp.orangeSuggestion}>→ {suggestion}</Text>
    </View>
  );
}

const hp = StyleSheet.create({
  green: {
    backgroundColor: '#EDFAF4',
    borderLeftWidth: 3, borderLeftColor: GREEN,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4,
  },
  greenText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: GREEN, lineHeight: 20 },
  orangeBlock: {
    backgroundColor: '#FEF9EC',
    borderLeftWidth: 3, borderLeftColor: ORANGE,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, gap: 3,
  },
  orangeOriginal:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#B07A10' },
  orangeSuggestion: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 18 },
});

// ── Main ─────────────────────────────────────────────────────────
export default function SpeakingResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const [result, setResult] = useState<SpeakingResult | null>(null);

  useEffect(() => {
    const r = getSpeakingResult();
    setResult(r);
    clearSpeakingResult();
  }, []);

  if (!result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 }}>No result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home' as any)} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: PURPLE }}>Go home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const { exam, part, timeTakenSeconds, bandScore, fluency, lexical, grammar, pronunciation, transcript } = result;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;

  const CRITERIA = [
    { key: 'Fluency & Coherence', label: 'Fluency',     short: 'Fluency',     value: fluency       },
    { key: 'Lexical Resource',    label: 'Lexical',     short: 'Lexical',     value: lexical       },
    { key: 'Grammatical Range',   label: 'Grammar',     short: 'Grammar',     value: grammar       },
    { key: 'Pronunciation',       label: 'Pronunc.',    short: 'Pronunc.',    value: pronunciation },
  ];

  const mainContent = (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.headerTitle}>Speaking Results</Text>
          <View style={s.metaRow}>
            <View style={s.metaChip}><Text style={s.metaChipText}>{exam}</Text></View>
            <View style={s.metaChip}><Text style={s.metaChipText}>{part}</Text></View>
            <View style={s.metaChip}><Text style={s.metaChipText}>{mins}m {secs}s</Text></View>
          </View>
        </View>

        {/* ── Overall score card (purple) ── */}
        <View style={s.bandCard}>
          <Text style={s.bandLabel}>SPEAKING SCORE</Text>
          <View style={s.bandScoreRow}>
            <Text style={s.bandScore}>{bandScore.toFixed(1)}</Text>
            <Text style={s.bandDenom}>/9.0</Text>
          </View>

          <View style={s.bandDivider} />

          <View style={s.criteriaRow}>
            {CRITERIA.map(c => (
              <View key={c.key} style={s.criteriaCell}>
                <Text style={s.criteriaScore}>{c.value.toFixed(1)}</Text>
                <Text style={s.criteriaLabel}>{c.short}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Per-criterion feedback ── */}
        {CRITERIA.map(c => {
          const detail = CRITERION_DETAILS[c.key];
          if (!detail) return null;
          return (
            <View key={c.key} style={s.feedbackCard}>
              <View style={s.feedbackHeader}>
                <Text style={s.feedbackCriterion}>{c.key}</Text>
                <View style={[s.scoreBadge, { backgroundColor: scoreColor(c.value) + '18' }]}>
                  <Text style={[s.scoreBadgeText, { color: scoreColor(c.value) }]}>{c.value.toFixed(1)}</Text>
                </View>
              </View>

              <Text style={s.feedbackText}>{detail.feedback}</Text>

              <GreenPhrase text={detail.goodPhrase} />

              {detail.improvePhrases.map((imp, i) => (
                <OrangePhrase key={i} original={imp.original} suggestion={imp.suggestion} />
              ))}
            </View>
          );
        })}

        {/* ── Transcript ── */}
        {transcript.length > 0 && (
          <View style={s.feedbackCard}>
            <Text style={s.feedbackCriterion}>Session Transcript</Text>
            <View style={s.transcriptList}>
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
            </View>
          </View>
        )}

        {/* ── Next steps card ── */}
        <View style={s.nextCard}>
          <Text style={s.nextTitle}>Next Steps</Text>
          <View style={s.nextRow}>
            <View style={s.nextDot} />
            <Text style={s.nextText}>Practice Part 2 for longer, structured responses</Text>
          </View>
          <View style={s.nextRow}>
            <View style={s.nextDot} />
            <Text style={s.nextText}>
              Focus on: {
                CRITERIA.slice().sort((a, b) => a.value - b.value)[0].key
              } — your lowest scoring area
            </Text>
          </View>
          <View style={s.nextRow}>
            <View style={s.nextDot} />
            <Text style={s.nextText}>Record yourself answering Part 1 questions for 5 minutes daily</Text>
          </View>
        </View>

        {/* ── Actions ── */}
        <View style={s.actions}>
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.replace('/modules/speaking/select' as any)}
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
        <SpeakingSidebar />
        <View style={{ flex: 1 }}>{mainContent}</View>
      </View>
    );
  }

  return mainContent;
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },

  header: { gap: 8, marginBottom: 2 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  metaRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip: {
    backgroundColor: Colors.bg2, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  metaChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  // ── Purple band card ──────────────────────────────
  bandCard: {
    backgroundColor: PURPLE, borderRadius: 20, padding: 28,
  },
  bandLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10,
    color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const,
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
  bandDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 20 },

  criteriaRow:  { flexDirection: 'row' },
  criteriaCell: { flex: 1, alignItems: 'center', gap: 4 },
  criteriaScore:{ fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' },
  criteriaLabel:{
    fontFamily: 'Inter_400Regular', fontSize: 10,
    color: 'rgba(255,255,255,0.6)', textAlign: 'center',
  },

  // ── Feedback cards ────────────────────────────────
  feedbackCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 20, gap: 10,
  },
  feedbackHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  feedbackCriterion: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000' },
  scoreBadge:     { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  scoreBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  feedbackText:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', lineHeight: 24 },

  // ── Transcript ────────────────────────────────────
  transcriptList: { gap: 8 },
  txRow:       { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  txRowUser:   { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  txAvatar:    { width: 24, height: 24, borderRadius: 12, backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  txAvatarUser:{ backgroundColor: Colors.ink4 },
  txAvatarText:{ fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.white },
  txBubble:    { backgroundColor: Colors.bg2, borderRadius: 12, borderBottomLeftRadius: 4, paddingHorizontal: 12, paddingVertical: 8, flex: 1 },
  txBubbleUser:{ backgroundColor: PURPLE_BG, borderBottomLeftRadius: 12, borderBottomRightRadius: 4 },
  txText:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink, lineHeight: 19 },
  txTextUser:  { color: PURPLE },

  // ── Next steps ────────────────────────────────────
  nextCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 20, gap: 10,
  },
  nextTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  nextRow:   { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  nextDot:   { width: 6, height: 6, borderRadius: 3, backgroundColor: PURPLE, marginTop: 7, flexShrink: 0 },
  nextText:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },

  // ── Actions ───────────────────────────────────────
  actions:      { flexDirection: 'row', gap: 10 },
  primaryBtn:   { flex: 1, backgroundColor: PURPLE, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  secondaryBtn: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  secondaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
});
