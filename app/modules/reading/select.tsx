import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ReadingSidebar } from '@/components/layout/ReadingSidebar';
import { FileTextIcon } from '@/components/icons';

const ORANGE     = '#C04A06';
const ORANGE_BG  = '#FFF7ED';
const ORANGE_BDR = '#FED7AA';

const EXAM_COLORS = {
  IELTS: { bg: '#EEF4FF', active: '#1558B0', border: '#BFDBFE' },
  TOEFL: { bg: '#F0FDF4', active: '#16A34A', border: '#BBF7D0' },
} as const;

type Exam = 'IELTS' | 'TOEFL';

const DIFFICULTY_STYLES = {
  Easy:   { bg: '#EDFAF4', color: '#16A34A' },
  Medium: { bg: '#FEF9EC', color: '#B07A10' },
  Hard:   { bg: '#FFF0EE', color: '#C04A06' },
} as const;

const PASSAGES: {
  key: string; label: string; difficulty: keyof typeof DIFFICULTY_STYLES;
  questions: string; desc: string; tags: string[];
}[] = [
  {
    key: '1', label: 'Passage 1',
    difficulty: 'Easy',
    questions: '13 questions',
    desc: 'Straightforward academic text. Clear main ideas and direct comprehension questions.',
    tags: ['IELTS', 'Matching Headings'],
  },
  {
    key: '2', label: 'Passage 2',
    difficulty: 'Medium',
    questions: '14 questions',
    desc: 'Complex vocabulary and inference required. Mixed question types throughout.',
    tags: ['IELTS', 'True / False / NG'],
  },
  {
    key: '3', label: 'Passage 3',
    difficulty: 'Hard',
    questions: '13 questions',
    desc: 'Dense academic language with abstract concepts. Most challenging question set.',
    tags: ['IELTS', 'Summary Completion'],
  },
];

const Q_TYPES = [
  'True / False / Not Given', 'Matching Headings', 'Multiple Choice',
  'Summary Completion', 'Short Answer', 'Sentence Completion',
];

export default function ReadingSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const [exam, setExam] = useState<Exam>('IELTS');

  function startPassage(passage: string) {
    router.push({
      pathname: '/modules/reading/session' as any,
      params: { exam, passage, languageCode: langCode, code: langCode },
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
            <Text style={s.headerTitle}>Reading Practice</Text>
            <Text style={s.headerSub}>Choose a passage to practice</Text>
          </View>
        </View>

        {/* ── Exam selector ── */}
        <View style={s.examRow}>
          {(['IELTS', 'TOEFL'] as Exam[]).map(e => {
            const active = exam === e;
            const ec = EXAM_COLORS[e];
            return (
              <TouchableOpacity
                key={e}
                style={[s.examPill, active && { backgroundColor: ec.bg, borderColor: ec.border }]}
                onPress={() => setExam(e)}
                activeOpacity={0.8}
              >
                <Text style={[s.examPillText, { color: active ? ec.active : '#888', fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular' }]}>
                  {e}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Passage cards ── */}
        <View style={s.cardList}>
          {PASSAGES.map(p => {
            const diff = DIFFICULTY_STYLES[p.difficulty];
            return (
              <View key={p.key} style={s.passageCard}>

                {/* Card top */}
                <View style={s.cardTop}>
                  <View style={s.fileCircle}>
                    <FileTextIcon size={22} color={ORANGE} />
                  </View>
                </View>

                {/* Card body */}
                <View style={s.cardBody}>
                  <View style={s.cardTitleRow}>
                    <Text style={s.cardLabel}>{p.label}</Text>
                    <View style={[s.diffBadge, { backgroundColor: diff.bg }]}>
                      <Text style={[s.diffText, { color: diff.color }]}>{p.difficulty}</Text>
                    </View>
                  </View>
                  <Text style={s.cardQuestions}>{p.questions}</Text>
                  <Text style={s.cardDesc}>{p.desc}</Text>
                  <View style={s.tagRow}>
                    {p.tags.map(t => (
                      <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={s.startBtn}
                    onPress={() => startPassage(p.key)}
                    activeOpacity={0.85}
                  >
                    <Text style={s.startBtnText}>Start →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Full Test card ── */}
        <TouchableOpacity
          style={s.fullCard}
          onPress={() => startPassage('full')}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={s.fullLabel}>Full Reading Test</Text>
            <Text style={s.fullSub}>All 3 passages · 40 questions · 60 min</Text>
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
        <ReadingSidebar />
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
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#EAEAEA',
  },
  examPillText: { fontSize: 13 },

  cardList: { gap: 12 },
  passageCard: {
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  cardTop: {
    height: 80, backgroundColor: ORANGE_BG,
    alignItems: 'center', justifyContent: 'center',
  },
  fileCircle: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  cardBody:     { padding: 16, gap: 4 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 },
  cardLabel:    { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#000' },
  diffBadge:    { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  diffText:     { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  cardQuestions:{ fontFamily: 'Inter_500Medium', fontSize: 13, color: ORANGE },
  cardDesc:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888', lineHeight: 18, marginTop: 2 },
  tagRow:  { flexDirection: 'row', gap: 4, marginTop: 6, flexWrap: 'wrap' },
  tag:     { backgroundColor: ORANGE_BG, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: ORANGE },
  startBtn: {
    backgroundColor: ORANGE, borderRadius: 8,
    paddingVertical: 10, alignItems: 'center', marginTop: 10,
  },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white },

  fullCard: {
    backgroundColor: ORANGE_BG, borderRadius: 20, padding: 24,
    borderWidth: 1, borderColor: ORANGE_BDR,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  fullLabel: { fontFamily: 'Inter_700Bold', fontSize: 20, color: ORANGE },
  fullSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888', marginTop: 4 },
  fullBtn:   { backgroundColor: ORANGE, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16 },
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
