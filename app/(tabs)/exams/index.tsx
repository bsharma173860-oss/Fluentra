import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { FlagSVG } from '@/components/flags';

const EXAMS = [
  { name: 'IELTS Academic', lang: 'en', color: T.speaking,  bg: T.speakingBg,  next: 'Apr 28', score: '7.0', sessions: 18 },
  { name: 'TOEFL iBT',      lang: 'en', color: '#1558B0',   bg: '#EEF6FF',      next: 'May 12', score: '92',  sessions: 6  },
  { name: 'DELE B2',        lang: 'es', color: T.brand,     bg: T.brandLight,   next: 'Jun 04', score: '72',  sessions: 4  },
  { name: 'DELF B2',        lang: 'fr', color: '#1558B0',   bg: '#EEF6FF',      next: 'May 30', score: '68',  sessions: 2  },
  { name: 'JLPT N4',        lang: 'ja', color: '#C84070',   bg: '#FFE0EC',      next: 'Jul 07', score: 'B',   sessions: 5  },
  { name: 'Goethe B1',      lang: 'de', color: T.writing,   bg: T.writingBg,    next: '—',       score: '—',   sessions: 0  },
];

export default function ExamsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      {/* Dark hero */}
      <View style={s.hero}>
        <Text style={s.heroEyebrow}>CERTIFICATION TRACK</Text>
        <Text style={s.heroTitle}>Your road to certified.</Text>
        <Text style={s.heroSub}>Track scheduled exams, monthly mocks, and your global percentile.</Text>
        <View style={s.heroStats}>
          <View style={s.heroStat}>
            <Text style={s.heroStatNum}>P82</Text>
            <Text style={s.heroStatLabel}>GLOBAL PERCENTILE</Text>
          </View>
          <View style={s.heroStatDivider} />
          <View style={s.heroStat}>
            <Text style={s.heroStatNum}>4</Text>
            <Text style={s.heroStatLabel}>ACTIVE EXAMS</Text>
          </View>
        </View>
      </View>

      {/* Next up + mock card */}
      <View style={[s.twoCol, isDesktop && s.twoColDesktop]}>
        <TouchableOpacity style={s.nextCard} onPress={() => router.push('/modules/reading/session' as any)} activeOpacity={0.9}>
          <View style={s.nextIcon}><Text style={{ fontSize: 20 }}>🏆</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.nextEyebrow}>NEXT UP</Text>
            <Text style={s.nextTitle}>IELTS Mock · Apr 28</Text>
            <Text style={s.nextMeta}>2h 45m · all 4 modules · graded vs real bands</Text>
          </View>
          <View style={s.startBtn}><Text style={s.startBtnText}>Start →</Text></View>
        </TouchableOpacity>

        <View style={s.mockCard}>
          <View style={s.mockBadges}>
            <View style={[s.badge, { backgroundColor: T.brandLight }]}><Text style={[s.badgeText, { color: T.brand }]}>Daily mock</Text></View>
            <View style={[s.badge, { backgroundColor: T.listeningBg }]}><Text style={[s.badgeText, { color: T.listening }]}>Free on Pro</Text></View>
          </View>
          <Text style={s.mockTitle}>Take a mock without a streak.</Text>
          <Text style={s.mockSub}>Pro: unlimited daily mocks. Free tier: $2 per session — same scoring rubric.</Text>
          <View style={s.mockBtns}>
            <TouchableOpacity style={s.mockBtn} onPress={() => router.push('/modules/reading/session' as any)}>
              <Text style={s.mockBtnText}>Free mock →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.officialBtn} onPress={() => router.push('/upgrade' as any)}>
              <Text style={s.officialBtnText}>$5 official</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Exams grid */}
      <Text style={s.sectionTitle}>All exams</Text>
      <View style={isDesktop ? s.examGridDesktop : s.examGrid}>
        {EXAMS.map(ex => (
          <TouchableOpacity key={ex.name} style={s.examCard} onPress={() => router.push(`/language/${ex.lang}` as any)} activeOpacity={0.8}>
            <View style={s.examCardTop}>
              <View style={s.examFlagWrap}>
                <FlagSVG code={ex.lang} width={32} height={22} />
              </View>
              <View>
                <Text style={s.examName}>{ex.name}</Text>
                <Text style={s.examNext}>Next: {ex.next}</Text>
              </View>
            </View>
            <View style={s.examCardBottom}>
              <View>
                <Text style={s.examScoreLabel}>BEST SCORE</Text>
                <Text style={[s.examScore, { color: ex.color }]}>{ex.score}</Text>
              </View>
              <View style={[s.sessionsChip, { backgroundColor: ex.bg }]}>
                <Text style={[s.sessionsText, { color: ex.color }]}>{ex.sessions} sessions</Text>
              </View>
            </View>
            <TouchableOpacity style={[s.practiceBtn, { borderColor: ex.color }]} onPress={() => router.push('/modules/reading/session' as any)}>
              <Text style={[s.practiceBtnText, { color: ex.color }]}>Practice →</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {content}
      <MobileTabBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },
  scrollDesktop: {},

  hero: { backgroundColor: T.ink, padding: 36, paddingBottom: 40, gap: 12 },
  heroEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.4, textTransform: 'uppercase' },
  heroTitle: { fontFamily: T.serif, fontSize: 44, color: '#fff', lineHeight: 50 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 20, maxWidth: 500 },
  heroStats: { flexDirection: 'row', alignItems: 'center', gap: 32, marginTop: 8 },
  heroStat: { gap: 6 },
  heroStatNum: { fontFamily: T.serif, fontSize: 44, color: '#fff', lineHeight: 48 },
  heroStatLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.55)', letterSpacing: 1.2, textTransform: 'uppercase' },
  heroStatDivider: { width: 1, height: 60, backgroundColor: 'rgba(255,255,255,0.18)' },

  twoCol: { padding: 18, gap: 14 },
  twoColDesktop: { flexDirection: 'row', padding: 28, paddingHorizontal: 36 },

  nextCard: { flex: 1, backgroundColor: T.brand, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  nextIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  nextEyebrow: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  nextTitle: { fontFamily: T.serif, fontSize: 20, color: '#fff', lineHeight: 24, marginBottom: 3 },
  nextMeta: { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  startBtn: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  startBtnText: { fontSize: 13, fontWeight: '700', color: T.brand },

  mockCard: { flex: 1, backgroundColor: T.card, borderRadius: 16, padding: 18, borderWidth: 1.5, borderColor: T.brand + '33', gap: 8 },
  mockBadges: { flexDirection: 'row', gap: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  mockTitle: { fontFamily: T.serif, fontSize: 18, color: T.ink, lineHeight: 22 },
  mockSub: { fontSize: 11.5, color: T.ink3, lineHeight: 16 },
  mockBtns: { flexDirection: 'row', gap: 8, marginTop: 4 },
  mockBtn: { backgroundColor: T.brand, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 8 },
  mockBtnText: { fontSize: 12.5, fontWeight: '700', color: '#fff' },
  officialBtn: { borderWidth: 1, borderColor: T.border, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 8 },
  officialBtnText: { fontSize: 12.5, fontWeight: '600', color: T.ink2 },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: T.ink, paddingHorizontal: 18, marginBottom: 12 },

  examGrid: { paddingHorizontal: 18, gap: 12 },
  examGridDesktop: { paddingHorizontal: 36, flexDirection: 'row', flexWrap: 'wrap', gap: 16 },

  examCard: {
    backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border,
    overflow: 'hidden', padding: 18, gap: 12,
  },
  examCardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  examFlagWrap: { borderRadius: 4, overflow: 'hidden' },
  examName: { fontSize: 14, fontWeight: '700', color: T.ink, lineHeight: 20 },
  examNext: { fontSize: 11.5, color: T.ink4 },
  examCardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  examScoreLabel: { fontSize: 9.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 2 },
  examScore: { fontFamily: T.serif, fontSize: 26, lineHeight: 30 },
  sessionsChip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  sessionsText: { fontSize: 11, fontWeight: '700' },
  practiceBtn: { borderWidth: 1, borderRadius: 9, paddingVertical: 8, paddingHorizontal: 14, alignItems: 'center' },
  practiceBtnText: { fontSize: 12.5, fontWeight: '700' },
});
