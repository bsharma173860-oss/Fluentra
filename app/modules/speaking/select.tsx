import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SpeakingSidebar } from '@/components/layout/SpeakingSidebar';
import { MicIcon } from '@/components/icons';
import { getExamsForLanguage } from '@/constants/languageExams';
import { getExamFormat } from '@/constants/examFormats';
import { checkRateLimit, incrementUsage } from '@/lib/api';

const PURPLE    = '#5B4EFF';
const PURPLE_BG = '#F0EEFF';

export default function SpeakingSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const exams     = getExamsForLanguage(langCode);
  const [exam, setExam] = useState(exams[0].id);

  const format   = getExamFormat(exam, 'speaking');
  const parts    = format?.parts ?? [];
  const criteria = format?.scoringCriteria ?? [];

  const [checking, setChecking] = useState(false);

  async function startPart(partId: string) {
    if (checking) return;
    setChecking(true);
    try {
      const check = await checkRateLimit('speaking');
      if (!check.allowed) {
        Alert.alert(
          'Daily limit reached',
          `You have used all your speaking sessions for today.\n${check.plan === 'free' ? 'Upgrade to Pro for 5 sessions/day.' : 'Resets at midnight.'}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade', onPress: () => router.push('/upgrade' as any) },
          ]
        );
        return;
      }
      await incrementUsage('speaking');
      router.push({
        pathname: '/modules/speaking/session' as any,
        params: { exam, part: partId, languageCode: langCode, code: langCode },
      });
    } finally {
      setChecking(false);
    }
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
            <Text style={s.headerTitle}>Speaking Practice</Text>
            <Text style={s.headerSub}>Choose which part to practice</Text>
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

        {/* ── No speaking test ── */}
        {format && parts.length === 0 ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>{format.note ?? 'No speaking test available for this exam.'}</Text>
          </View>
        ) : null}

        {/* ── Part cards grid ── */}
        {parts.length > 0 ? (
          <View style={s.grid}>
            {parts.map(p => (
              <View key={p.id} style={s.partCard}>
                <View style={s.cardTop}>
                  <View style={s.micCircle}>
                    <MicIcon size={22} color={PURPLE} />
                  </View>
                </View>
                <View style={s.cardBody}>
                  <Text style={s.partLabel}>{p.name}</Text>
                  {p.duration ? <Text style={s.partTime}>{p.duration}</Text> : null}
                  <Text style={s.partDesc}>{p.description}</Text>
                  {p.prepTime ? (
                    <Text style={s.partMeta}>Prep: {p.prepTime}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={s.startBtn}
                    onPress={() => startPart(p.id)}
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
        {parts.length > 0 ? (
          <TouchableOpacity
            style={s.fullCard}
            onPress={() => startPart('full')}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={s.fullLabel}>Full Speaking Test</Text>
              <Text style={s.fullSub}>
                All {parts.length} parts
                {format?.totalTime ? ` · ${format.totalTime}` : ''}
                {format?.scoreRange ? ` · ${format.scoreRange}` : ''}
              </Text>
            </View>
            <View style={s.fullBtn}>
              <Text style={s.fullBtnText}>Start Full Test →</Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {/* ── Scoring criteria ── */}
        {criteria.length > 0 ? (
          <>
            <Text style={s.sectionLabel}>SCORING CRITERIA</Text>
            <View style={s.criteriaWrap}>
              {criteria.map(c => (
                <View key={c} style={s.criteriaPill}>
                  <Text style={s.criteriaPillText}>{c}</Text>
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

  examRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  examPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#EAEAEA',
  },
  examPillText: { fontSize: 13 },

  noteBanner: {
    backgroundColor: PURPLE_BG, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 10,
    borderLeftWidth: 3, borderLeftColor: PURPLE,
  },
  noteText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: PURPLE },

  emptyCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 24, alignItems: 'center',
  },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888', textAlign: 'center' },

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
  cardBody:  { padding: 14, gap: 3 },
  partLabel: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
  partTime:  { fontFamily: 'Inter_500Medium', fontSize: 12, color: PURPLE },
  partDesc:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#888', lineHeight: 16, marginTop: 2 },
  partMeta:  { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#AAA' },
  startBtn: {
    backgroundColor: PURPLE, borderRadius: 8,
    paddingVertical: 8, alignItems: 'center', marginTop: 10,
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
  criteriaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  criteriaPill: {
    backgroundColor: Colors.white, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  criteriaPillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#555' },
});
