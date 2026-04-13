import React, { useState } from 'react';
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

type Exam = 'IELTS' | 'TOEFL' | 'DELF';
type Part = 'Part 1' | 'Part 2' | 'Part 3' | 'Full Test';

const EXAM_DESC: Record<Exam, string> = {
  IELTS: '3 parts, 11–14 min. Conversation, long turn (cue card), and abstract discussion. Scored on Fluency, Lexical Resource, Grammar, Pronunciation.',
  TOEFL: 'Integrated and independent speaking tasks. 6 tasks total, ~17 min. Machine scored on delivery, language use, and topic development.',
  DELF: 'Interactive oral exercise and expression of a point of view. B2: 20 min (prep) + 20 min (exam). Juried by two examiners.',
};

const PART_INFO: Record<Part, { icon: string; desc: string; duration: string }> = {
  'Part 1':    { icon: '💬', desc: 'Introduction and interview on familiar topics: home, family, work, hobbies.', duration: '4–5 min' },
  'Part 2':    { icon: '🗣', desc: 'Individual long turn. You speak for 1–2 min on a cue card topic after 1 min prep.', duration: '3–4 min' },
  'Part 3':    { icon: '🎓', desc: 'Two-way discussion of abstract and complex topics linked to Part 2.', duration: '4–5 min' },
  'Full Test': { icon: '📋', desc: 'Complete exam simulation — all three parts back to back with realistic timing.', duration: '11–14 min' },
};

export default function SpeakingSelectScreen() {
  const [exam, setExam] = useState<Exam>('IELTS');
  const [part, setPart] = useState<Part>('Full Test');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Speaking</Text>
          <View style={s.freeBadge}>
            <Text style={s.freeBadgeText}>10 min/day free</Text>
          </View>
        </View>

        {/* Exam pills */}
        <Text style={s.sectionLabel}>Exam Format</Text>
        <View style={s.pillRow}>
          {(['IELTS', 'TOEFL', 'DELF'] as Exam[]).map(e => (
            <TouchableOpacity
              key={e}
              style={[s.pill, exam === e && s.pillActive]}
              onPress={() => setExam(e)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, exam === e && s.pillTextActive]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Exam description */}
        <View style={s.descCard}>
          <Text style={s.descTitle}>{exam} Speaking</Text>
          <Text style={s.descBody}>{EXAM_DESC[exam]}</Text>
        </View>

        {/* Part selector */}
        <Text style={s.sectionLabel}>Session</Text>
        <View style={s.partGrid}>
          {(Object.keys(PART_INFO) as Part[]).map(p => {
            const info = PART_INFO[p];
            const selected = part === p;
            return (
              <TouchableOpacity
                key={p}
                style={[s.partCard, selected && s.partCardActive]}
                onPress={() => setPart(p)}
                activeOpacity={0.85}
              >
                <View style={s.partTop}>
                  <Text style={s.partIcon}>{info.icon}</Text>
                  {selected && (
                    <View style={s.partCheck}>
                      <Text style={s.partCheckText}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={[s.partTitle, selected && s.partTitleActive]}>{p}</Text>
                <Text style={s.partDuration}>{info.duration}</Text>
                <Text style={s.partDesc}>{info.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scoring criteria */}
        <View style={s.criteriaCard}>
          <Text style={s.criteriaTitle}>📊 Scoring Criteria</Text>
          <View style={s.criteriaGrid}>
            {[
              { label: 'Fluency & Coherence', color: Colors.p },
              { label: 'Lexical Resource',    color: Colors.green },
              { label: 'Grammatical Range',   color: Colors.gold },
              { label: 'Pronunciation',       color: Colors.orange },
            ].map(c => (
              <View key={c.label} style={[s.criteriaChip, { borderLeftColor: c.color }]}>
                <Text style={s.criteriaChipText}>{c.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips */}
        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>🎙 Tips for higher scores</Text>
          {[
            'Speak at natural pace — don\'t rush or speak too slowly.',
            'Extend your answers with reasons and examples.',
            'Use a range of vocabulary — avoid repeating the same words.',
            'It\'s OK to self-correct — native speakers do it too.',
          ].map((tip, i) => (
            <View key={i} style={s.tipRow}>
              <Text style={s.tipDot}>•</Text>
              <Text style={s.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={s.startBtn}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: '/modules/speaking/session' as any,
              params: { exam, part },
            })
          }
        >
          <Text style={s.startBtnText}>Start Speaking Session →</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 10 },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink },
  headerTitle: {
    flex: 1, fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.ink,
  },
  freeBadge: {
    backgroundColor: Colors.gold_bg,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#F0D080',
  },
  freeBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.gold },

  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },

  pillRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 20, paddingVertical: 9,
    borderRadius: 99, backgroundColor: Colors.bg2,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink2 },
  pillTextActive: { color: Colors.white },

  descCard: {
    backgroundColor: Colors.p_soft,
    borderRadius: 16, borderWidth: 1, borderColor: '#C4BEFF',
    padding: 14, gap: 6, marginTop: -4,
  },
  descTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.p },
  descBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 20 },

  partGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  partCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    gap: 4,
  },
  partCardActive: { borderColor: Colors.p, backgroundColor: Colors.p_soft },
  partTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  partIcon: { fontSize: 22 },
  partCheck: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
  },
  partCheckText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.white },
  partTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  partTitleActive: { color: Colors.p },
  partDuration: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.p, marginTop: 1 },
  partDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, lineHeight: 16, marginTop: 4 },

  criteriaCard: {
    backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 10,
  },
  criteriaTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  criteriaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  criteriaChip: {
    backgroundColor: Colors.bg2,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    paddingLeft: 6,
    borderLeftWidth: 3,
  },
  criteriaChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2 },

  tipsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 8,
  },
  tipsTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink, marginBottom: 2 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipDot: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.p, marginTop: 1 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 19 },

  startBtn: {
    backgroundColor: Colors.p,
    borderRadius: 16, paddingVertical: 17,
    alignItems: 'center',
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
});
