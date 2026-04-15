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

type Exam = 'IELTS' | 'TOEFL';
type Difficulty = 'B1' | 'B2' | 'C1' | 'C2';

// Free users get 1 session per day (same as writing/listening)
const IS_PRO = true; // gate removed — UsageLimitBanner shown after session instead

const EXAM_DESC: Record<Exam, string> = {
  IELTS: 'Three passages, 40 questions, 60 minutes. Matching headings, MCQ, True/False/Not Given.',
  TOEFL: 'Three to four passages, 10 questions each, 54–72 minutes. Multiple-choice and drag-drop tasks.',
};

const DIFFICULTY_DESC: Record<Difficulty, string> = {
  B1: 'Intermediate — straightforward vocabulary and clear main ideas.',
  B2: 'Upper-intermediate — some inference required, varied question types.',
  C1: 'Advanced — dense academic language, nuanced argument tracking.',
  C2: 'Mastery — authentic academic texts, complex reasoning required.',
};

export default function ReadingSelectScreen() {
  const [exam, setExam] = useState<Exam>('IELTS');
  const [difficulty, setDifficulty] = useState<Difficulty>('B2');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Reading</Text>
          <View style={s.headerSpacer} />
        </View>

        {/* Free tier info (replaces old pro gate) */}
        <View style={s.freeInfo}>
          <Text style={s.freeInfoText}>1 free session per day · Detailed explanations included</Text>
        </View>

        {/* Exam pills */}
        <Text style={s.sectionLabel}>Exam Format</Text>
        <View style={s.pillRow}>
          {(['IELTS', 'TOEFL'] as Exam[]).map(e => (
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
          <Text style={s.descTitle}>{exam} Academic Reading</Text>
          <Text style={s.descBody}>{EXAM_DESC[exam]}</Text>
        </View>

        {/* Difficulty pills */}
        <Text style={s.sectionLabel}>Difficulty Level</Text>
        <View style={s.pillRow}>
          {(['B1', 'B2', 'C1', 'C2'] as Difficulty[]).map(d => (
            <TouchableOpacity
              key={d}
              style={[s.pill, difficulty === d && s.pillActive]}
              onPress={() => setDifficulty(d)}
              activeOpacity={0.8}
            >
              <Text style={[s.pillText, difficulty === d && s.pillTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty description */}
        <View style={s.diffCard}>
          <View style={s.diffRow}>
            <View style={[s.diffBadge, { backgroundColor: Colors.p_soft }]}>
              <Text style={[s.diffBadgeText, { color: Colors.p }]}>{difficulty}</Text>
            </View>
            <Text style={s.diffDesc}>{DIFFICULTY_DESC[difficulty]}</Text>
          </View>
        </View>

        {/* What to expect */}
        <View style={s.expectCard}>
          <Text style={s.expectTitle}>📋 What to expect</Text>
          {[
            '1 academic passage (approx. 700–900 words)',
            '13 questions across 3 types',
            '60-minute global timer',
            'Detailed explanations on every answer',
          ].map((item, i) => (
            <View key={i} style={s.expectRow}>
              <View style={s.expectDot} />
              <Text style={s.expectText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={s.startBtn}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: '/modules/reading/session' as any,
              params: { exam, difficulty },
            })
          }
        >
          <Text style={s.startBtnText}>Start Reading Session →</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink },
  headerTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.ink,
    textAlign: 'center',
  },
  headerSpacer: { width: 38 },

  freeInfo: {
    backgroundColor: Colors.blue_bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  freeInfoText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.blue, textAlign: 'center' },

  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },

  pillRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink2 },
  pillTextActive: { color: Colors.white },

  descCard: {
    backgroundColor: Colors.orange_bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0C88C',
    padding: 14,
    gap: 6,
    marginTop: -4,
  },
  descTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.orange },
  descBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 20 },

  diffCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginTop: -4,
  },
  diffRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  diffBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    flexShrink: 0,
  },
  diffBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  diffDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },

  expectCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 10,
  },
  expectTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink, marginBottom: 2 },
  expectRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  expectDot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.orange,
    marginTop: 7, flexShrink: 0,
  },
  expectText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },

  startBtn: {
    backgroundColor: Colors.p,
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
});
