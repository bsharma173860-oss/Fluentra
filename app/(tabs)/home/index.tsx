import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import type { UserLanguage } from '@/lib/supabase';

const { width: W } = Dimensions.get('window');
const H_PAD = 20;

const SAMPLE_LANGUAGES: UserLanguage[] = [
  {
    id: 'sample-1', user_id: '',
    language_code: 'en', language_name_en: 'English', language_name_native: 'English',
    fluency_percent: 88, exams: ['IELTS', 'TOEFL'], created_at: '',
  },
  {
    id: 'sample-2', user_id: '',
    language_code: 'es', language_name_en: 'Spanish', language_name_native: 'Español',
    fluency_percent: 55, exams: ['DELE'], created_at: '',
  },
  {
    id: 'sample-3', user_id: '',
    language_code: 'fr', language_name_en: 'French', language_name_native: 'Français',
    fluency_percent: 30, exams: ['DELF'], created_at: '',
  },
];

const LANG_FLAG: Record<string, string> = {
  en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹',
  pt: '🇵🇹', zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷', ar: '🇸🇦',
};

const LANG_COLOR: Record<string, string> = {
  en: Colors.p, es: Colors.orange, fr: Colors.green, de: Colors.gold,
  it: Colors.orange, pt: Colors.green, zh: Colors.danger, ja: Colors.p,
  ko: Colors.orange, ar: Colors.gold,
};

const MOCK = {
  bandScore: 7.5,
  globalRank: 1284,
  streakCount: 22,
  streakTarget: 40,
};

const LB_TABS = ['All', 'Friends', 'Country'];

const TOP_3 = [
  { rank: 2, name: 'Mohamed K.', score: 8.0, initial: 'M' },
  { rank: 1, name: 'Sara A.', score: 8.5, initial: 'S' },
  { rank: 3, name: 'Jana P.', score: 7.5, initial: 'J' },
];

const LB_ROWS = [
  { rank: 4, name: 'Priya S.', score: 7.5 },
  { rank: 5, name: 'Lucas B.', score: 7.0 },
];

const GRID_CARDS = [
  { icon: '✏️', title: 'Writing', sub: 'Essays & tasks', bg: Colors.gold_bg, color: Colors.gold, route: '/modules/writing/select' },
  { icon: '🎧', title: 'Listening', sub: 'Audio comprehension', bg: Colors.green_bg, color: Colors.green, route: '/modules/listening/select' },
  { icon: '📖', title: 'Reading', sub: 'Passages & questions', bg: Colors.orange_bg, color: Colors.orange, route: '/modules/reading/select' },
  { icon: '💬', title: 'Free Chat', sub: 'Open conversation', bg: Colors.p_soft, color: Colors.p, route: '/modules/speaking/select' },
];

export default function HomeScreen() {
  const { profile } = useAuth();
  const displayName = profile?.name ?? '';
  const initial = displayName ? displayName[0].toUpperCase() : '?';

  const [languages, setLanguages] = useState<UserLanguage[]>(SAMPLE_LANGUAGES);
  const [lbTab, setLbTab] = useState('All');

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('user_languages')
      .select('*')
      .eq('user_id', profile.id)
      .then(({ data }) => {
        if (data && data.length > 0) setLanguages(data as UserLanguage[]);
      });
  }, [profile?.id]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const remaining = MOCK.streakTarget - MOCK.streakCount;
  const gridCardW = (W - H_PAD * 2 - 12) / 2;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* TOP HEADER */}
        <View style={s.header}>
          <Text style={s.logo}>Fluent<Text style={s.ra}>ra</Text></Text>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.notifBtn}>
              <Text style={s.notifEmoji}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={s.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO WHITE CARD */}
        <View style={s.heroCard}>
          <Text style={s.greetingText}>{greeting},</Text>
          <Text style={s.heroName}>{displayName || 'there'}</Text>
          <Text style={s.tagline}>Speak it. Score it. Own it.</Text>
          <View style={s.statChips}>
            <View style={[s.chip, s.chipPurple]}>
              <Text style={s.chipNumWhite}>{MOCK.bandScore.toFixed(1)}</Text>
              <Text style={s.chipLabelWhite}>Band</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipNum}>{languages.length}</Text>
              <Text style={s.chipLabel}>Languages</Text>
            </View>
            <View style={s.chip}>
              <Text style={s.chipNum}>#{MOCK.globalRank.toLocaleString()}</Text>
              <Text style={s.chipLabel}>Global</Text>
            </View>
          </View>
        </View>

        {/* STREAK BAR */}
        <View style={s.streakCard}>
          <View style={s.streakTop}>
            <Text style={s.streakTitle}>🔥 {MOCK.streakCount}-day streak</Text>
            <Text style={s.streakRight}>{MOCK.streakCount}/{MOCK.streakTarget}</Text>
          </View>
          <Text style={s.streakSub}>{remaining} more days to unlock monthly exam</Text>
          <ProgressBar
            progress={MOCK.streakCount / MOCK.streakTarget}
            color={Colors.orange}
            trackColor={Colors.orange_bg}
            height={8}
            animated
          />
        </View>

        {/* LANGUAGES */}
        <View>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>My Languages</Text>
            <TouchableOpacity>
              <Text style={s.sectionLink}>+ Add</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.langScroll}>
            {languages.map((lang) => {
              const color = LANG_COLOR[lang.language_code] ?? Colors.p;
              const flag = LANG_FLAG[lang.language_code] ?? '🌐';
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={s.langCard}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/language/${lang.language_code}` as any)}
                >
                  <Text style={s.langFlag}>{flag}</Text>
                  <Text style={s.langName}>{lang.language_name_en}</Text>
                  <Text style={s.langNative}>{lang.language_name_native}</Text>
                  <View style={s.langBarTrack}>
                    <View style={[s.langBarFill, { width: `${lang.fluency_percent}%` as any, backgroundColor: color }]} />
                  </View>
                  <Text style={[s.langPct, { color }]}>{lang.fluency_percent}%</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* PRACTICE */}
        <View>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Practice</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/practice')}>
              <Text style={s.sectionLink}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Speaking hero */}
          <TouchableOpacity
            style={s.speakHero}
            onPress={() => router.push('/modules/speaking/select' as any)}
            activeOpacity={0.88}
          >
            <View style={s.speakHeroInner}>
              <Text style={s.speakIcon}>🎙</Text>
              <View style={s.speakText}>
                <Text style={s.speakTitle}>Speaking</Text>
                <Text style={s.speakSub}>AI conversation partner</Text>
                <View style={s.speakChips}>
                  <View style={s.speakChip}><Text style={s.speakChipText}>IELTS</Text></View>
                  <View style={s.speakChip}><Text style={s.speakChipText}>TOEFL</Text></View>
                </View>
              </View>
              <View style={s.speakCta}><Text style={s.speakCtaText}>Start →</Text></View>
            </View>
          </TouchableOpacity>

          {/* 2×2 grid */}
          <View style={s.practiceGrid}>
            {GRID_CARDS.map((card) => (
              <TouchableOpacity
                key={card.title}
                style={[s.gridCard, { backgroundColor: card.bg, width: gridCardW }]}
                onPress={() => router.push(card.route as any)}
                activeOpacity={0.85}
              >
                <Text style={s.gridIcon}>{card.icon}</Text>
                <Text style={[s.gridTitle, { color: card.color }]}>{card.title}</Text>
                <Text style={[s.gridSub, { color: card.color, opacity: 0.7 }]}>{card.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* LEADERBOARD */}
        <View style={s.lbCard}>
          <Text style={s.lbTitle}>Weekly Champions</Text>
          <View style={s.lbTabs}>
            {LB_TABS.map(t => (
              <TouchableOpacity key={t} onPress={() => setLbTab(t)} style={[s.lbTab, lbTab === t && s.lbTabActive]}>
                <Text style={[s.lbTabText, lbTab === t && s.lbTabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Podium */}
          <View style={s.podium}>
            {TOP_3.map((p) => {
              const isFirst = p.rank === 1;
              return (
                <View key={p.rank} style={[s.podiumItem, isFirst && s.podiumFirst]}>
                  {isFirst && <Text style={s.crown}>👑</Text>}
                  <View style={[s.podiumAvatar, isFirst && s.podiumAvatarFirst]}>
                    <Text style={[s.podiumInitial, isFirst && { fontSize: 20 }]}>{p.initial}</Text>
                  </View>
                  <Text style={s.podiumName}>{p.name.split(' ')[0]}</Text>
                  <Text style={s.podiumScore}>{p.score.toFixed(1)}</Text>
                  <View style={[s.podiumRankBadge, isFirst && s.podiumRankBadge1]}>
                    <Text style={[s.podiumRankText, isFirst && { color: Colors.white }]}>#{p.rank}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Rows 4-5 */}
          {LB_ROWS.map((row) => (
            <View key={row.rank} style={s.lbRow}>
              <Text style={s.lbRowRank}>#{row.rank}</Text>
              <View style={s.lbRowAvatar}>
                <Text style={s.lbRowInitial}>{row.name[0]}</Text>
              </View>
              <Text style={s.lbRowName}>{row.name}</Text>
              <Text style={s.lbRowScore}>{row.score.toFixed(1)}</Text>
            </View>
          ))}

          {/* Your row */}
          <View style={[s.lbRow, s.lbYouRow]}>
            <Text style={s.lbRowRank}>#12</Text>
            <View style={[s.lbRowAvatar, { backgroundColor: Colors.p }]}>
              <Text style={[s.lbRowInitial, { color: Colors.white }]}>{initial}</Text>
            </View>
            <Text style={[s.lbRowName, { fontFamily: 'Inter_700Bold' }]}>You</Text>
            <Text style={s.lbRowScore}>
              6.5{'  '}<Text style={{ color: Colors.green, fontSize: 11 }}>↑+0.5</Text>
            </Text>
          </View>
        </View>

        {/* MONTHLY EXAM DARK CARD */}
        <View style={s.examCard}>
          <View style={s.examTag}><Text style={s.examTagText}>IELTS ACADEMIC</Text></View>
          <Text style={s.examMonth}>April 2026</Text>
          <Text style={s.examSub}>Monthly Practice Exam</Text>
          <View style={s.examMeta}>
            <Text style={s.examMetaItem}>💰 $5 entry</Text>
            <Text style={s.examMetaDot}>·</Text>
            <Text style={s.examMetaItem}>🧑‍🤝‍🧑 847 registered</Text>
          </View>
          <View style={s.examStreakNote}>
            <Text style={s.examStreakNoteText}>🔥 Maintain your streak to unlock</Text>
          </View>
          <TouchableOpacity style={s.examBtn} activeOpacity={0.88}>
            <Text style={s.examBtnText}>Register →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: H_PAD, paddingTop: 8, gap: 20 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink },
  ra: { color: Colors.p },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  notifBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  notifEmoji: { fontSize: 18 },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },

  // Hero card
  heroCard: { backgroundColor: Colors.white, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 20, gap: 4 },
  greetingText: { fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 },
  heroName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink, marginBottom: 2 },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, marginBottom: 12 },
  statChips: { flexDirection: 'row', gap: 8 },
  chip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border, gap: 2 },
  chipPurple: { backgroundColor: Colors.p, borderColor: Colors.p },
  chipNum: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  chipLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  chipNumWhite: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
  chipLabelWhite: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.8)' },

  // Streak
  streakCard: { backgroundColor: Colors.white, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 8 },
  streakTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  streakRight: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  streakSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: -2 },

  // Section header
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  sectionLink: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },

  // Languages
  langScroll: { gap: 12, paddingBottom: 4 },
  langCard: { width: 130, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 4 },
  langFlag: { fontSize: 28 },
  langName: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink, marginTop: 4 },
  langNative: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  langBarTrack: { height: 4, backgroundColor: Colors.bg2, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  langBarFill: { height: 4, borderRadius: 2 },
  langPct: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 2 },

  // Speaking hero
  speakHero: { backgroundColor: Colors.p, borderRadius: 20, padding: 20, marginBottom: 12 },
  speakHeroInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  speakIcon: { fontSize: 44 },
  speakText: { flex: 1 },
  speakTitle: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.white },
  speakSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.72)', marginTop: 2 },
  speakChips: { flexDirection: 'row', gap: 6, marginTop: 8 },
  speakChip: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  speakChipText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.white },
  speakCta: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  speakCtaText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },

  // Practice grid
  practiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { borderRadius: 16, padding: 16, gap: 6 },
  gridIcon: { fontSize: 28 },
  gridTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  gridSub: { fontFamily: 'Inter_400Regular', fontSize: 12 },

  // Leaderboard
  lbCard: { backgroundColor: Colors.white, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, padding: 16 },
  lbTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink, marginBottom: 10 },
  lbTabs: { flexDirection: 'row', backgroundColor: Colors.bg2, borderRadius: 10, padding: 3, gap: 3, marginBottom: 16 },
  lbTab: { flex: 1, paddingVertical: 6, borderRadius: 8, alignItems: 'center' },
  lbTabActive: { backgroundColor: Colors.white },
  lbTabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },
  lbTabTextActive: { fontFamily: 'Inter_700Bold', color: Colors.ink },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 16, paddingTop: 8 },
  podiumItem: { alignItems: 'center', gap: 6, flex: 1 },
  podiumFirst: { marginBottom: 8 },
  crown: { fontSize: 20 },
  podiumAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border },
  podiumAvatarFirst: { width: 56, height: 56, borderRadius: 28, borderColor: Colors.gold, backgroundColor: Colors.gold_bg },
  podiumInitial: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  podiumName: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink, textAlign: 'center' },
  podiumScore: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.p },
  podiumRankBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: Colors.bg2 },
  podiumRankBadge1: { backgroundColor: Colors.gold },
  podiumRankText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  lbYouRow: { backgroundColor: Colors.p_soft, borderRadius: 10, paddingHorizontal: 10, borderTopWidth: 0, marginTop: 4 },
  lbRowRank: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink2, width: 28 },
  lbRowAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  lbRowInitial: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  lbRowName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1 },
  lbRowScore: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },

  // Monthly exam dark card
  examCard: { backgroundColor: '#1A1A2E', borderRadius: 20, padding: 20, gap: 8 },
  examTag: { backgroundColor: Colors.p, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  examTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.white, letterSpacing: 0.5 },
  examMonth: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.white, marginTop: 4 },
  examSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)' },
  examMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  examMetaItem: { fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.75)' },
  examMetaDot: { color: 'rgba(255,255,255,0.4)', fontSize: 16 },
  examStreakNote: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, marginTop: 4 },
  examStreakNoteText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  examBtn: { backgroundColor: Colors.p, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  examBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
});
