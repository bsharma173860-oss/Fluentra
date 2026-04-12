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
type Section = '1' | '2' | '3' | '4';
type Mode = 'practice' | 'exam';

const EXAM_DESC: Record<Exam, string> = {
  IELTS: 'Four sections, 40 questions, 30 minutes + 10 min transfer. Recordings played once.',
  TOEFL: 'Conversations and lectures, 28–39 questions, ~41–57 minutes. No transcript provided.',
  DELF: 'Three documents with comprehension tasks. Range of accents and registers tested.',
};

const SECTION_INFO: Record<Section, { title: string; desc: string; icon: string }> = {
  '1': { icon: '💬', title: 'Section 1',  desc: 'Social conversation between two speakers in an everyday context.' },
  '2': { icon: '🎙', title: 'Section 2',  desc: 'Monologue on a general topic, e.g. a radio broadcast or announcement.' },
  '3': { icon: '🎓', title: 'Section 3',  desc: 'Conversation between up to four people in an educational setting.' },
  '4': { icon: '📚', title: 'Section 4',  desc: 'Academic lecture — the most challenging section with complex vocabulary.' },
};

export default function ListeningSelectScreen() {
  const [exam, setExam]       = useState<Exam>('IELTS');
  const [section, setSection] = useState<Section>('1');
  const [mode, setMode]       = useState<Mode>('practice');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Listening</Text>
          <View style={s.headerSpacer} />
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
          <Text style={s.descTitle}>{exam} Listening</Text>
          <Text style={s.descBody}>{EXAM_DESC[exam]}</Text>
        </View>

        {/* Section pills */}
        <Text style={s.sectionLabel}>Section</Text>
        <View style={s.pillRow}>
          {(['1', '2', '3', '4'] as Section[]).map(sec => (
            <TouchableOpacity
              key={sec}
              style={[s.pill, section === sec && s.pillActive]}
              onPress={() => setSection(sec)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, section === sec && s.pillTextActive]}>
                Section {sec}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section info card */}
        <View style={s.sectionCard}>
          <Text style={s.sectionCardIcon}>{SECTION_INFO[section].icon}</Text>
          <View style={s.sectionCardText}>
            <Text style={s.sectionCardTitle}>{SECTION_INFO[section].title}</Text>
            <Text style={s.sectionCardDesc}>{SECTION_INFO[section].desc}</Text>
          </View>
        </View>

        {/* Practice / Exam mode toggle */}
        <Text style={s.sectionLabel}>Mode</Text>
        <View style={s.modeRow}>
          <TouchableOpacity
            style={[s.modeCard, mode === 'practice' && s.modeCardActive]}
            onPress={() => setMode('practice')}
            activeOpacity={0.85}
          >
            <View style={s.modeTop}>
              <Text style={s.modeIcon}>🔁</Text>
              {mode === 'practice' && (
                <View style={s.modeCheck}>
                  <Text style={s.modeCheckText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[s.modeTitle, mode === 'practice' && s.modeTitleActive]}>Practice Mode</Text>
            <Text style={s.modeSub}>Replay audio as many times as you need</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.modeCard, mode === 'exam' && s.modeCardActive]}
            onPress={() => setMode('exam')}
            activeOpacity={0.85}
          >
            <View style={s.modeTop}>
              <Text style={s.modeIcon}>⏱</Text>
              {mode === 'exam' && (
                <View style={s.modeCheck}>
                  <Text style={s.modeCheckText}>✓</Text>
                </View>
              )}
            </View>
            <Text style={[s.modeTitle, mode === 'exam' && s.modeTitleActive]}>Exam Mode</Text>
            <Text style={s.modeSub}>Audio plays once — real exam conditions</Text>
          </TouchableOpacity>
        </View>

        {/* Tips */}
        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>🎧 Tips for higher scores</Text>
          {[
            'Read questions before the audio starts.',
            'Write answers as you listen — don\'t wait.',
            'Check spelling carefully; wrong spelling = wrong answer.',
            'Up to TWO WORDS only unless otherwise stated.',
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
              pathname: '/modules/listening/session' as any,
              params: { exam, section, mode },
            })
          }
        >
          <Text style={s.startBtnText}>Start Listening →</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  backBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink },
  headerTitle: {
    flex: 1, fontFamily: 'Inter_700Bold', fontSize: 20,
    color: Colors.ink, textAlign: 'center',
  },
  headerSpacer: { width: 38 },

  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },

  pillRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 18, paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink2 },
  pillTextActive: { color: Colors.white },

  descCard: {
    backgroundColor: Colors.green_bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A8DFC4',
    padding: 14,
    gap: 6,
    marginTop: -4,
  },
  descTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.green },
  descBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 20 },

  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: -4,
  },
  sectionCardIcon: { fontSize: 28 },
  sectionCardText: { flex: 1, gap: 3 },
  sectionCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  sectionCardDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, lineHeight: 19 },

  modeRow: { flexDirection: 'row', gap: 12 },
  modeCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 14,
    gap: 6,
  },
  modeCardActive: { borderColor: Colors.p, backgroundColor: Colors.p_soft },
  modeTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modeIcon: { fontSize: 22 },
  modeCheck: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
  },
  modeCheckText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.white },
  modeTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  modeTitleActive: { color: Colors.p },
  modeSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, lineHeight: 18 },

  tipsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  tipsTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink, marginBottom: 2 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipDot: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.green, marginTop: 1 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 19 },

  startBtn: {
    backgroundColor: Colors.p,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
});
