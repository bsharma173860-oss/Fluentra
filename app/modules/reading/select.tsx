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
import { getExamsForLanguage } from '@/constants/languageExams';
import { getExamFormat } from '@/constants/examFormats';

const ORANGE     = '#C04A06';
const ORANGE_BG  = '#FFF7ED';
const ORANGE_BDR = '#FED7AA';

const DIFFICULTY_STYLES: Record<string, { bg: string; color: string }> = {
  Easy:   { bg: '#EDFAF4', color: '#16A34A' },
  Medium: { bg: '#FEF9EC', color: '#B07A10' },
  Hard:   { bg: '#FFF0EE', color: '#C04A06' },
};

export default function ReadingSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const exams     = getExamsForLanguage(langCode);
  const [exam, setExam] = useState(exams[0].id);

  const format   = getExamFormat(exam, 'reading');
  const passages = format?.passages ?? [];

  // Collect unique question types across all passages
  const questionTypes = Array.from(new Set(passages.flatMap(p => p.types)));

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
            <Text style={s.headerSub}>
              {format
                ? `${format.totalQuestions} questions · ${format.timeMinutes} min${format.scoreRange ? ` · ${format.scoreRange}` : ''}`
                : 'Choose a passage to practice'}
            </Text>
          </View>
        </View>

        {/* ── Exam selector ── */}
        <View style={s.examRow}>
          {exams.map(e => {
            const active = exam === e.id;
            return (
              <TouchableOpacity
                key={e.id}
                style={[s.examPill, active && { backgroundColor: e.bg, borderColor: e.border }]}
                onPress={() => setExam(e.id)}
                activeOpacity={0.8}
              >
                <Text style={[s.examPillText, {
                  color: active ? e.color : '#888',
                  fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                }]}>
                  {e.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── No format available ── */}
        {!format ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>Format details coming soon for this exam.</Text>
          </View>
        ) : null}

        {/* ── Passage cards ── */}
        {passages.length > 0 ? (
          <View style={s.cardList}>
            {passages.map((p, i) => {
              const diff = p.difficulty ? (DIFFICULTY_STYLES[p.difficulty] ?? DIFFICULTY_STYLES.Medium) : null;
              return (
                <View key={p.id} style={s.passageCard}>

                  {/* Card top */}
                  <View style={s.cardTop}>
                    <View style={s.fileCircle}>
                      <FileTextIcon size={22} color={ORANGE} />
                    </View>
                  </View>

                  {/* Card body */}
                  <View style={s.cardBody}>
                    <View style={s.cardTitleRow}>
                      <Text style={s.cardLabel}>{p.name}</Text>
                      {diff ? (
                        <View style={[s.diffBadge, { backgroundColor: diff.bg }]}>
                          <Text style={[s.diffText, { color: diff.color }]}>{p.difficulty}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={s.cardQuestions}>
                      {p.questions} questions{p.wordCount ? ` · ${p.wordCount} words` : ''}
                    </Text>
                    <View style={s.tagRow}>
                      {p.types.map(t => (
                        <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={s.startBtn}
                      onPress={() => startPassage(String(i + 1))}
                      activeOpacity={0.85}
                    >
                      <Text style={s.startBtnText}>Start →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* ── Full Test card ── */}
        {format ? (
          <TouchableOpacity
            style={s.fullCard}
            onPress={() => startPassage('full')}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.fullLabel}>Full Reading Test</Text>
              <Text style={s.fullSub}>
                All {passages.length} passages · {format.totalQuestions} questions · {format.timeMinutes} min
              </Text>
            </View>
            <View style={s.fullBtn}>
              <Text style={s.fullBtnText}>Start Full Test →</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* ── Question types ── */}
        {questionTypes.length > 0 ? (
          <>
            <Text style={s.sectionLabel}>QUESTION TYPES YOU'LL PRACTICE</Text>
            <View style={s.qTypesWrap}>
              {questionTypes.map(qt => (
                <View key={qt} style={s.qTypePill}>
                  <Text style={s.qTypePillText}>{qt}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

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

  examRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  examPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#EAEAEA',
  },
  examPillText: { fontSize: 13 },

  emptyCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 24, alignItems: 'center',
  },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888', textAlign: 'center' },

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
