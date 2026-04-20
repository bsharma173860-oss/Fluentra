import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ListeningSidebar } from '@/components/layout/ListeningSidebar';
import { HeadphoneIcon } from '@/components/icons';

const GREEN     = '#0A8C5A';
const GREEN_BG  = '#EDFAF4';
const GREEN_BDR = '#C0E8D4';

const EXAM_COLORS = {
  IELTS: { bg: '#EEF4FF', active: '#1558B0', border: '#BFDBFE' },
  TOEFL: { bg: '#F0FDF4', active: '#16A34A', border: '#BBF7D0' },
  DELF:  { bg: '#FFF7ED', active: '#C04A06', border: '#FED7AA' },
} as const;

type Exam = 'IELTS' | 'TOEFL' | 'DELF';
type Section = '1' | '2' | '3' | '4';

const SECTIONS: {
  key: Section; label: string; questions: string; desc: string; tags: string[];
}[] = [
  {
    key: '1', label: 'Section 1 — Social',
    questions: '10 questions',
    desc: 'Everyday social conversation between two speakers — booking, directions, queries.',
    tags: ['IELTS', 'Form completion'],
  },
  {
    key: '2', label: 'Section 2 — Monologue',
    questions: '10 questions',
    desc: 'General-topic monologue, e.g. a radio broadcast, tour guide, or announcement.',
    tags: ['IELTS', 'Note completion'],
  },
  {
    key: '3', label: 'Section 3 — Academic',
    questions: '10 questions',
    desc: 'Educational conversation between up to 4 people — tutorials, group projects.',
    tags: ['IELTS', 'Multiple choice'],
  },
  {
    key: '4', label: 'Section 4 — Lecture',
    questions: '10 questions',
    desc: 'Academic lecture — most challenging. Complex vocabulary and abstract concepts.',
    tags: ['IELTS', 'Sentence completion'],
  },
];

const Q_TYPES = [
  'Multiple choice', 'Form completion', 'Note completion',
  'Sentence completion', 'Matching', 'Map labelling',
];

export default function ListeningSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const [exam, setExam] = useState<Exam>('IELTS');

  function startSection(section: string) {
    router.push({
      pathname: '/modules/listening/session' as any,
      params: { exam, section, languageCode: langCode, code: langCode },
    });
  }

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
            <Text style={s.headerTitle}>Listening Practice</Text>
            <Text style={s.headerSub}>Choose a section to practice</Text>
          </View>
        </View>

        {/* ── Exam selector ── */}
        <View style={s.examRow}>
          {(['IELTS', 'TOEFL', 'DELF'] as Exam[]).map(e => {
            const active = exam === e;
            const ec = EXAM_COLORS[e];
            return (
              <TouchableOpacity
                key={e}
                style={[s.examPill, active && { backgroundColor: ec.bg, borderColor: ec.border }]}
                onPress={() => setExam(e)}
                activeOpacity={0.8}
              >
                <Text style={[s.examPillText, { color: active ? ec.active : '#888', fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>{e}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── 2×2 grid ── */}
        <View style={s.grid}>
          {SECTIONS.map(sec => (
            <View key={sec.key} style={s.sectionCard}>
              {/* Card top */}
              <View style={s.cardTop}>
                <View style={s.headCircle}>
                  <HeadphoneIcon size={22} color={GREEN} />
                </View>
              </View>
              {/* Card body */}
              <View style={s.cardBody}>
                <Text style={s.secLabel}>{sec.label}</Text>
                <Text style={s.secQuestions}>{sec.questions}</Text>
                <Text style={s.secDesc}>{sec.desc}</Text>
                <View style={s.tagRow}>
                  {sec.tags.map(t => (
                    <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                  ))}
                </View>
                <TouchableOpacity
                  style={s.startBtn}
                  onPress={() => startSection(sec.key)}
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
          onPress={() => startSection('full')}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.fullLabel}>Full Listening Test</Text>
            <Text style={s.fullSub}>All 4 sections · 40 questions · 30 min</Text>
          </View>
          <View style={s.fullBtn}>
            <Text style={s.fullBtnText}>Start Full Test →</Text>
          </View>
        </TouchableOpacity>

        {/* ── Question types ── */}
        <Text style={s.sectionLabel}>QUESTION TYPES YOU'LL PRACTICE</Text>
        <View style={s.qTypesWrap}>
          {Q_TYPES.map(qt => (
            <View key={qt} style={s.qTypePill}>
              <Text style={s.qTypePillText}>{qt}</Text>
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
        <ListeningSidebar />
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
    width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { fontFamily: 'Inter_500Medium', fontSize: 18, color: Colors.ink },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  headerSub:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#999', marginTop: 2 },

  examRow: { flexDirection: 'row', gap: 8 },
  examPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#EAEAEA',
  },
  examPillText: { fontSize: 13 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sectionCard: {
    width: '47.5%' as any,
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden', minHeight: 180,
  },
  cardTop: {
    height: 80, backgroundColor: GREEN_BG,
    alignItems: 'center', justifyContent: 'center',
  },
  headCircle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardBody:    { padding: 14, gap: 4 },
  secLabel:    { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  secQuestions:{ fontFamily: 'Inter_500Medium', fontSize: 12, color: GREEN },
  secDesc:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#888', lineHeight: 16, marginTop: 2 },
  tagRow:      { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  tag: { backgroundColor: GREEN_BG, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: GREEN },
  startBtn: {
    backgroundColor: GREEN, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', marginTop: 8,
  },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.white },

  fullCard: {
    backgroundColor: GREEN, borderRadius: 20, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  fullLabel: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white },
  fullSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  fullBtn: { backgroundColor: '#000', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 },
  fullBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
  },
  qTypesWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  qTypePill: {
    backgroundColor: Colors.white, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 6,
  },
  qTypePillText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666' },
});
