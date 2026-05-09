import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const PARTS = [
  { n: 1, label: 'Part 1 — Introduction',  desc: 'Answer questions about familiar topics.', prompt: 'Tell me about your hometown. What do you like most about it?' },
  { n: 2, label: 'Part 2 — Long Turn',      desc: 'Speak for 1–2 minutes on the cue card.', prompt: 'Describe a time when you helped someone. You should say:\n• who you helped\n• what the situation was\n• how you helped them\nAnd explain how you felt afterwards.' },
  { n: 3, label: 'Part 3 — Discussion',     desc: 'Discuss abstract topics with the AI examiner.', prompt: 'Do you think people today are less willing to help strangers than in the past? Why or why not?' },
];

const CRITERIA = [
  { key: 'Fluency',       val: 7.5 },
  { key: 'Vocabulary',    val: 7.0 },
  { key: 'Grammar',       val: 6.5 },
  { key: 'Pronunciation', val: 7.0 },
];

export default function SpeakingSessionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [activePart, setActivePart] = useState(0);
  const [recording, setRecording] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const part = PARTS[activePart];
  const overallScore = CRITERIA.reduce((sum, c) => sum + c.val, 0) / CRITERIA.length;

  const content = (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Speaking · IELTS Academic</Text>
          <Text style={s.headerMeta}>AI Examiner · {PARTS.length} parts</Text>
        </View>
        <View style={s.timerBadge}><Text style={s.timerText}>11:43</Text></View>
      </View>
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${((activePart + 1) / PARTS.length) * 100}%` as any }]} />
      </View>

      {isDesktop ? (
        <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
          {/* Left: part selector + live scores */}
          <View style={s.leftPane}>
            <Text style={s.paneTitle}>SECTIONS</Text>
            {PARTS.map((p, i) => (
              <TouchableOpacity key={i} style={[s.partBtn, activePart === i && s.partBtnActive]} onPress={() => setActivePart(i)}>
                <View style={[s.partNum, activePart === i && { backgroundColor: T.speaking }]}>
                  <Text style={[s.partNumText, activePart === i && { color: '#fff' }]}>{p.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.partLabel}>{p.label}</Text>
                  <Text style={s.partDesc}>{p.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <View style={s.liveScores}>
              <Text style={[s.paneTitle, { marginBottom: 10 }]}>YOUR SCORE SO FAR</Text>
              <Text style={[s.overallScore, { color: T.speaking }]}>{overallScore.toFixed(1)}</Text>
              {CRITERIA.map(c => (
                <View key={c.key} style={s.criteriaRow}>
                  <Text style={s.criteriaLabel}>{c.key}</Text>
                  <View style={s.criteriaBar}>
                    <View style={[s.criteriaFill, { width: `${(c.val / 9) * 100}%` as any }]} />
                  </View>
                  <Text style={s.criteriaScore}>{c.val.toFixed(1)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Right: prompt + recording */}
          <View style={s.rightPane}>
            <Text style={s.questionLabel}>QUESTION {activePart + 1}</Text>
            <Text style={s.promptText}>{part.prompt}</Text>
            <Text style={s.prepHint}>Take a moment to prepare your answer, then press Record.</Text>
            {!showFeedback ? (
              <TouchableOpacity
                style={[s.recordBtn, recording && s.recordBtnActive]}
                onPress={() => {
                  if (!recording) {
                    setRecording(true);
                    setTimeout(() => { setRecording(false); setShowFeedback(true); }, 3000);
                  }
                }}
              >
                <Text style={s.recordBtnText}>{recording ? '⏹ Stop & submit' : '🎤 Start recording'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={s.feedbackCard}>
                <Text style={s.feedbackTitle}>AI Feedback</Text>
                <Text style={s.feedbackBody}>Good fluency and natural pacing. You used a good range of vocabulary. Consider adding a personal example to make Part 3 answers more vivid.</Text>
                <TouchableOpacity
                  style={s.nextBtn}
                  onPress={() => {
                    if (activePart < PARTS.length - 1) { setActivePart(p => p + 1); setShowFeedback(false); }
                    else router.push('/modules/speaking/results' as any);
                  }}
                >
                  <Text style={s.nextBtnText}>{activePart < PARTS.length - 1 ? 'Next part →' : 'Finish session →'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.mobileContent}>
          {/* Part selector */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PARTS.map((p, i) => (
              <TouchableOpacity key={i} style={[s.mobilePartChip, activePart === i && s.mobilePartChipActive]} onPress={() => setActivePart(i)}>
                <Text style={[s.mobilePartChipText, activePart === i && { color: T.speaking }]}>{p.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={s.promptCard}>
            <Text style={s.promptText}>{part.prompt}</Text>
          </View>

          {/* Live scores */}
          <View style={s.mobileScoresCard}>
            <Text style={s.paneTitle}>SCORE SO FAR</Text>
            <Text style={[s.overallScore, { color: T.speaking, fontSize: 36 }]}>{overallScore.toFixed(1)}</Text>
            {CRITERIA.map(c => (
              <View key={c.key} style={s.criteriaRow}>
                <Text style={s.criteriaLabel}>{c.key}</Text>
                <View style={s.criteriaBar}><View style={[s.criteriaFill, { width: `${(c.val / 9) * 100}%` as any }]} /></View>
                <Text style={s.criteriaScore}>{c.val.toFixed(1)}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={[s.recordBtn, recording && s.recordBtnActive]} onPress={() => {
            if (!recording) { setRecording(true); setTimeout(() => { setRecording(false); router.push('/modules/speaking/results' as any); }, 3000); }
          }}>
            <Text style={s.recordBtnText}>{recording ? '⏹ Stop & submit' : '🎤 Start recording'}</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  headerMeta: { fontSize: 11, color: T.ink4 },
  timerBadge: { backgroundColor: T.bg2, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  timerText: { fontSize: 12, fontWeight: '700', color: T.ink },
  progressBar: { height: 3, backgroundColor: T.track },
  progressFill: { height: '100%', backgroundColor: T.speaking },

  leftPane: { width: 280, backgroundColor: T.paper, borderRightWidth: 1, borderRightColor: T.border, padding: 24, gap: 8 },
  rightPane: { flex: 1, padding: 32, gap: 20 },
  paneTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },

  partBtn: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderRadius: 10 },
  partBtnActive: { backgroundColor: T.speakingBg },
  partNum: { width: 24, height: 24, borderRadius: 6, backgroundColor: T.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  partNumText: { fontSize: 11, fontWeight: '700', color: T.ink4 },
  partLabel: { fontSize: 12.5, fontWeight: '600', color: T.ink },
  partDesc: { fontSize: 11, color: T.ink4, marginTop: 2 },

  liveScores: { marginTop: 16, gap: 8 },
  overallScore: { fontFamily: T.serif, fontSize: 44, lineHeight: 50, textAlign: 'center' },
  criteriaRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  criteriaLabel: { fontSize: 11, color: T.ink3, width: 88 },
  criteriaBar: { flex: 1, height: 5, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden' },
  criteriaFill: { height: '100%', backgroundColor: T.speaking, borderRadius: 99 },
  criteriaScore: { fontSize: 11, fontWeight: '700', color: T.ink, width: 28, textAlign: 'right' },

  questionLabel: { fontSize: 10.5, fontWeight: '700', color: T.speaking, letterSpacing: 0.8, textTransform: 'uppercase' },
  promptText: { fontFamily: T.serif, fontSize: 20, color: T.ink, lineHeight: 28 },
  prepHint: { fontSize: 13, color: T.ink3, lineHeight: 20 },

  recordBtn: { backgroundColor: T.speaking, borderRadius: 12, padding: 16, alignItems: 'center' },
  recordBtnActive: { backgroundColor: '#B00020' },
  recordBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  feedbackCard: { backgroundColor: T.speakingBg, borderRadius: 14, padding: 18, gap: 12 },
  feedbackTitle: { fontSize: 13, fontWeight: '700', color: T.speaking },
  feedbackBody: { fontSize: 13.5, color: T.ink, lineHeight: 20 },
  nextBtn: { backgroundColor: T.speaking, borderRadius: 10, padding: 13, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  mobileContent: { padding: 16, gap: 16 },
  mobilePartChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: T.border, marginRight: 8, backgroundColor: T.card },
  mobilePartChipActive: { borderColor: T.speaking, backgroundColor: T.speakingBg },
  mobilePartChipText: { fontSize: 12, fontWeight: '600', color: T.ink3 },
  promptCard: { backgroundColor: T.card, borderRadius: 14, padding: 18, borderWidth: 1, borderColor: T.border },
  mobileScoresCard: { backgroundColor: T.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 10 },
});
