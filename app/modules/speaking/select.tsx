import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SpeakingSidebar } from '@/components/layout/SpeakingSidebar';
import { MicIcon } from '@/components/icons';

const PURPLE     = '#5B4EFF';
const PURPLE_BG  = '#F0EEFF';
const PURPLE_BDR = '#D8D0FF';

type Part = 'Part 1' | 'Part 2' | 'Part 3' | 'Full Test';
type Exam = 'IELTS' | 'TOEFL' | 'DELF';

const PARTS: {
  key: Part; label: string; time: string; desc: string; tags: string[];
}[] = [
  {
    key:   'Part 1',
    label: 'Part 1 — Interview',
    time:  '4–5 min',
    desc:  'Introduction and Q&A on familiar topics: home, family, work, hobbies.',
    tags:  ['IELTS', 'Conversation'],
  },
  {
    key:   'Part 2',
    label: 'Part 2 — Cue Card',
    time:  '3–4 min',
    desc:  'Long turn. Speak 1–2 min on a cue card topic after 1 min of preparation.',
    tags:  ['IELTS', 'Monologue'],
  },
  {
    key:   'Part 3',
    label: 'Part 3 — Discussion',
    time:  '4–5 min',
    desc:  'Two-way discussion of abstract topics linked to Part 2.',
    tags:  ['IELTS', 'Analysis'],
  },
  {
    key:   'Full Test',
    label: 'Full Speaking Test',
    time:  '11–14 min',
    desc:  'Complete IELTS simulation — all three parts back-to-back.',
    tags:  ['All parts', 'Simulation'],
  },
];

const CRITERIA = [
  { label: 'Fluency &\nCoherence', desc: 'Smooth, connected speech with logical flow' },
  { label: 'Lexical\nResource', desc: 'Range and accuracy of vocabulary used' },
  { label: 'Grammatical\nRange', desc: 'Variety and accuracy of sentence structures' },
  { label: 'Pronuncia-\ntion', desc: 'Clear, intelligible speech with natural stress' },
];

export default function SpeakingSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const [exam, setExam] = useState<Exam>('IELTS');

  function startPart(part: Part) {
    router.push({
      pathname: '/modules/speaking/session' as any,
      params: { exam, part, languageCode: langCode, code: langCode },
    });
  }

  // Separate Full Test from the 3 parts
  const gridParts = PARTS.slice(0, 3);
  const fullTest  = PARTS[3];

  const content = (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          {!isDesktop && (
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={s.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={s.headerTitle}>Speaking Practice</Text>
            <Text style={s.headerSub}>Choose which part to practice</Text>
          </View>
        </View>

        {/* ── Exam selector ── */}
        <View style={s.examRow}>
          {(['IELTS', 'TOEFL', 'DELF'] as Exam[]).map(e => (
            <TouchableOpacity
              key={e}
              style={[s.examPill, exam === e && s.examPillActive]}
              onPress={() => setExam(e)}
              activeOpacity={0.8}
            >
              <Text style={[s.examPillText, exam === e && s.examPillTextActive]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── 2×2 part grid ── */}
        <View style={s.grid}>
          {gridParts.map(p => (
            <View key={p.key} style={s.partCard}>
              {/* Card top */}
              <View style={s.cardTop}>
                <View style={s.micCircle}>
                  <MicIcon size={22} color={PURPLE} />
                </View>
              </View>

              {/* Card body */}
              <View style={s.cardBody}>
                <Text style={s.partLabel}>{p.key}</Text>
                <Text style={s.partTime}>{p.time}</Text>
                <Text style={s.partDesc}>{p.desc}</Text>
                <View style={s.tagRow}>
                  {p.tags.map(t => (
                    <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                  ))}
                </View>
                <TouchableOpacity
                  style={s.startBtn}
                  onPress={() => startPart(p.key)}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>Start →</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* ── Full test card ── */}
        <TouchableOpacity
          style={s.fullCard}
          onPress={() => startPart('Full Test')}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.fullLabel}>Full Speaking Test</Text>
            <Text style={s.fullSub}>All 3 parts · 11–14 min</Text>
          </View>
          <View style={s.fullBtn}>
            <Text style={s.fullBtnText}>Start Full Test →</Text>
          </View>
        </TouchableOpacity>

        {/* ── Scoring criteria ── */}
        <Text style={s.sectionLabel}>SCORING CRITERIA</Text>
        <View style={s.criteriaRow}>
          {CRITERIA.map(c => (
            <View key={c.label} style={s.criteriaCard}>
              <Text style={s.criteriaName}>{c.label}</Text>
              <Text style={s.criteriaDesc}>{c.desc}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <SpeakingSidebar />
        <View style={{ flex: 1 }}>{content}</View>
      </View>
    );
  }

  return content;
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 18 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingBottom: 2 },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { fontFamily: 'Inter_500Medium', fontSize: 18, color: Colors.ink },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  headerSub:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#999', marginTop: 2 },

  examRow: { flexDirection: 'row', gap: 8 },
  examPill: {
    paddingHorizontal: 18, paddingVertical: 8,
    borderRadius: 99, backgroundColor: Colors.bg2,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  examPillActive:     { backgroundColor: PURPLE, borderColor: PURPLE },
  examPillText:       { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink2 },
  examPillTextActive: { color: Colors.white },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  partCard: {
    width: '47.5%' as any,
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden', minHeight: 180,
  },

  cardTop: {
    height: 80, backgroundColor: PURPLE_BG,
    alignItems: 'center', justifyContent: 'center',
  },
  micCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },

  cardBody: { padding: 14, gap: 4 },
  partLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  partTime:  { fontFamily: 'Inter_500Medium', fontSize: 12, color: PURPLE },
  partDesc:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#888', lineHeight: 16, marginTop: 2 },
  tagRow:    { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  tag: {
    backgroundColor: PURPLE_BG, borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  tagText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: PURPLE },
  startBtn: {
    backgroundColor: PURPLE, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', marginTop: 8,
  },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.white },

  fullCard: {
    backgroundColor: PURPLE, borderRadius: 20, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  fullLabel: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white },
  fullSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  fullBtn: {
    backgroundColor: '#000', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 20,
  },
  fullBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
  },

  criteriaRow: { flexDirection: 'row', gap: 8 },
  criteriaCard: {
    flex: 1, backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    padding: 12, alignItems: 'center' as const, gap: 4,
  },
  criteriaName: {
    fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#000',
    textAlign: 'center' as const,
  },
  criteriaDesc: {
    fontFamily: 'Inter_400Regular', fontSize: 11, color: '#888',
    textAlign: 'center' as const, lineHeight: 15,
  },
});
