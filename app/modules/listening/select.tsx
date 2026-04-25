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
import { getExamsForLanguage } from '@/constants/languageExams';
import { getExamFormat } from '@/constants/examFormats';

const GREEN    = '#0A8C5A';
const GREEN_BG = '#EDFAF4';

export default function ListeningSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const exams     = getExamsForLanguage(langCode);
  const [exam, setExam] = useState(exams[0].id);

  const format   = getExamFormat(exam, 'listening');
  const sections = format?.sections ?? [];

  // Collect unique question types from sections for the pills
  const questionTypes = Array.from(new Set(sections.map(s => s.type)));

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
          <View style={{ flex: 1 }}>
            <Text style={s.headerTitle}>Listening Practice</Text>
            <Text style={s.headerSub}>
              {format
                ? `${format.totalQuestions} questions · ${format.timeMinutes} min${format.scoreRange ? ` · ${format.scoreRange}` : ''}`
                : 'Choose an exam and section'}
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
                }]}>{e.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Note banner ── */}
        {format?.note ? (
          <View style={s.noteBanner}>
            <Text style={s.noteText}>{format.note}</Text>
          </View>
        ) : null}

        {/* ── No format available ── */}
        {!format ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>Format details coming soon for this exam.</Text>
          </View>
        ) : null}

        {/* ── Section cards ── */}
        {sections.length > 0 ? (
          <View style={s.grid}>
            {sections.map((sec, i) => (
              <View key={sec.id} style={s.sectionCard}>
                <View style={s.cardTop}>
                  <View style={s.headCircle}>
                    <HeadphoneIcon size={22} color={GREEN} />
                  </View>
                </View>
                <View style={s.cardBody}>
                  <Text style={s.secLabel}>{sec.name}</Text>
                  <Text style={s.secQuestions}>{sec.questions} questions</Text>
                  {sec.description ? (
                    <Text style={s.secDesc}>{sec.description}</Text>
                  ) : null}
                  <Text style={s.secType}>{sec.type}</Text>
                  {(sec.playsCount ?? 1) >= 2 ? (
                    <View style={s.playsTwiceBadge}>
                      <Text style={s.playsTwiceText}>Audio plays twice</Text>
                    </View>
                  ) : null}
                  <TouchableOpacity
                    style={s.startBtn}
                    onPress={() => startSection(String(i + 1))}
                    activeOpacity={0.85}
                  >
                    <Text style={s.startBtnText}>Start →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* ── Full test card ── */}
        {format ? (
          <TouchableOpacity
            style={s.fullCard}
            onPress={() => startSection('full')}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.fullLabel}>Full Listening Test</Text>
              <Text style={s.fullSub}>
                All {sections.length} sections · {format.totalQuestions} questions · {format.timeMinutes} min
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

  examRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  examPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#EAEAEA',
  },
  examPillText: { fontSize: 13 },

  noteBanner: {
    backgroundColor: GREEN_BG, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderLeftWidth: 3, borderLeftColor: GREEN,
  },
  noteText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: GREEN },

  emptyCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 24, alignItems: 'center',
  },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888', textAlign: 'center' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sectionCard: {
    width: '47.5%' as any,
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden', minHeight: 160,
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
  cardBody:     { padding: 14, gap: 3 },
  secLabel:     { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  secQuestions: { fontFamily: 'Inter_500Medium', fontSize: 12, color: GREEN },
  secDesc:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#888', lineHeight: 16, marginTop: 2 },
  secType:      { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#AAA' },
  playsTwiceBadge: {
    backgroundColor: '#EDFAF4', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4,
  },
  playsTwiceText: { fontFamily: 'Inter_600SemiBold', fontSize: 9, color: GREEN },
  startBtn: {
    backgroundColor: GREEN, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', marginTop: 10,
  },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.white },

  fullCard: {
    backgroundColor: GREEN, borderRadius: 20, padding: 24,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  fullLabel: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white },
  fullSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  fullBtn:   { backgroundColor: '#000', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 20 },
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
