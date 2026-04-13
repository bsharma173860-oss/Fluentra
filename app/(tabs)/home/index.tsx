import React, { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Dimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import type { UserLanguage } from '@/lib/supabase';

const { width: W } = Dimensions.get('window');
const H_PAD = 20;

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const SAMPLE_LANGUAGES: UserLanguage[] = [
  { id: 's1', user_id: '', language_code: 'en', language_name_en: 'English',  language_name_native: 'English', fluency_percent: 88, exams: ['IELTS','TOEFL'], created_at: '' },
  { id: 's2', user_id: '', language_code: 'es', language_name_en: 'Spanish',  language_name_native: 'Español', fluency_percent: 55, exams: ['DELE'],         created_at: '' },
  { id: 's3', user_id: '', language_code: 'fr', language_name_en: 'French',   language_name_native: 'Français',fluency_percent: 30, exams: ['DELF'],         created_at: '' },
];

const LANG_FLAG: Record<string, string> = {
  en: '🇬🇧', es: '🇪🇸', fr: '🇫🇷', de: '🇩🇪', it: '🇮🇹',
  pt: '🇵🇹', zh: '🇨🇳', ja: '🇯🇵', ko: '🇰🇷', ar: '🇸🇦',
};

const LANG_COLOR: Record<string, string> = {
  en: Colors.p, es: Colors.orange, fr: Colors.green,
  de: Colors.gold, pt: Colors.green, zh: Colors.danger,
  ja: Colors.p, ko: Colors.orange, ar: Colors.gold,
};

const MOCK = { bandScore: 6.5, globalRank: 12, streakCount: 32, streakTarget: 40 };

const LB_TABS = ['All', 'Friends', 'My country'];

const TOP_3 = [
  { rank: 2, name: 'Mohamed K.', score: 8.0, initial: 'M' },
  { rank: 1, name: 'Sara A.',     score: 8.5, initial: 'S' },
  { rank: 3, name: 'Jana P.',     score: 7.5, initial: 'J' },
];

const LB_ROWS = [
  { rank: 4, name: 'Riya M.',  score: 7.0 },
  { rank: 5, name: 'Karim H.', score: 7.0 },
];

const GRID_CARDS = [
  { icon: '✏️', title: 'Writing',   chip: 'Essay', bg: Colors.gold_bg,   color: Colors.gold,   route: '/modules/writing/select',   pro: false },
  { icon: '🎧', title: 'Listening', chip: 'Audio', bg: Colors.green_bg,  color: Colors.green,  route: '/modules/listening/select', pro: false },
  { icon: '📖', title: 'Reading',   chip: 'Text',  bg: Colors.orange_bg, color: Colors.orange, route: '/modules/reading/select',   pro: true  },
  { icon: '💬', title: 'Free Chat', chip: 'Free',  bg: Colors.p_soft,    color: Colors.p,      route: '/modules/speaking/select',  pro: false },
];

// ─────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { profile } = useAuth();
  const displayName = profile?.name ?? '';
  const initial = displayName ? displayName[0].toUpperCase() : '?';

  const [languages, setLanguages] = useState<UserLanguage[]>(SAMPLE_LANGUAGES);
  const [lbTab, setLbTab]         = useState('All');

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('user_languages').select('*').eq('user_id', profile.id)
      .then(({ data }) => { if (data && data.length > 0) setLanguages(data as UserLanguage[]); });
  }, [profile?.id]);

  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const remaining = MOCK.streakTarget - MOCK.streakCount;
  const gridCardW = (W - H_PAD * 2 - 12) / 2;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── TOP HEADER ── */}
        <View style={s.header}>
          <Text style={s.logo}>Fluent<Text style={s.ra}>ra</Text></Text>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.notifBtn}>
              <Text style={s.notifIcon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={s.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── HERO WHITE CARD ── */}
        <View style={s.heroCard}>
          <Text style={s.greetingText}>{greeting}</Text>
          <Text style={s.heroName}>{displayName || 'there'}.</Text>
          <Text style={s.tagline}>"Speak it. Score it. Own it."</Text>
          <View style={s.statRow}>
            <View style={[s.statChip, { backgroundColor: Colors.p }]}>
              <Text style={s.statNumWhite}>{MOCK.bandScore.toFixed(1)}</Text>
              <Text style={s.statLabelWhite}>BAND SCORE</Text>
            </View>
            <View style={[s.statChip, s.statChipLight]}>
              <Text style={s.statNum}>{languages.length}</Text>
              <Text style={s.statLabel}>LANGUAGES</Text>
            </View>
            <View style={[s.statChip, s.statChipLight]}>
              <Text style={s.statNum}>#{MOCK.globalRank}</Text>
              <Text style={s.statLabel}>GLOBAL RANK</Text>
            </View>
          </View>
        </View>

        {/* ── STREAK BAR ── */}
        <View style={s.streakCard}>
          <View style={s.streakRow}>
            <View style={s.streakLeft}>
              <Text style={s.streakFire}>🔥</Text>
              <Text style={s.streakText}>
                {remaining} more days to unlock the April exam
              </Text>
            </View>
            <Text style={s.streakNum}>{MOCK.streakCount}</Text>
          </View>
          <ProgressBar
            progress={MOCK.streakCount / MOCK.streakTarget}
            color={Colors.orange}
            trackColor={Colors.orange_bg}
            height={7}
            animated
          />
          <Text style={s.streakSub}>{MOCK.streakCount} / {MOCK.streakTarget} days</Text>
        </View>

        {/* ── LANGUAGES ── */}
        <View>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Your languages</Text>
            <TouchableOpacity>
              <Text style={s.sectionLink}>+ Add language</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.langScroll}>
            {languages.map((lang) => {
              const color    = LANG_COLOR[lang.language_code] ?? Colors.p;
              const flag     = LANG_FLAG[lang.language_code]  ?? '🌐';
              const exams    = LANGUAGE_EXAMS[lang.language_code] ?? [];
              const examText = exams.map(e => e.name).join(' · ');
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
                  {examText.length > 0 && (
                    <View style={[s.examBadge, { backgroundColor: color + '15', borderColor: color + '33' }]}>
                      <Text style={[s.examBadgeText, { color }]} numberOfLines={1}>{examText}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── PRACTICE ── */}
        <View>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Practice</Text>
            <Text style={s.sectionSubLabel}>IELTS · English</Text>
          </View>

          {/* Speaking hero — full width, vertical layout */}
          <TouchableOpacity
            style={s.speakHero}
            onPress={() => router.push('/modules/speaking/select' as any)}
            activeOpacity={0.88}
          >
            <View style={s.speakAILabel}>
              <Text style={s.speakAIText}>AI Examiner</Text>
            </View>
            <Text style={s.speakTitle}>Speaking</Text>
            <Text style={s.speakDesc}>
              Live AI conversation. Graded on fluency, grammar, vocabulary and pronunciation.
            </Text>
            <View style={s.speakChipsRow}>
              {['Face detection', 'Live transcript', 'Body language'].map(c => (
                <View key={c} style={s.speakChip}>
                  <Text style={s.speakChipText}>{c}</Text>
                </View>
              ))}
            </View>
            <View style={s.speakArrowWrap}>
              <View style={s.speakArrowBtn}>
                <Text style={s.speakArrowText}>→</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* 2×2 grid */}
          <View style={s.practiceGrid}>
            {GRID_CARDS.map((card) => (
              <TouchableOpacity
                key={card.title}
                style={[s.gridCard, { backgroundColor: card.bg, width: gridCardW }]}
                onPress={() => {
                  if (card.pro) {
                    Alert.alert('Pro Feature', 'Reading is available with Fluentra Pro.', [
                      { text: 'Not now', style: 'cancel' },
                      { text: 'Upgrade', style: 'default', onPress: () => {} },
                    ]);
                    return;
                  }
                  router.push(card.route as any);
                }}
                activeOpacity={0.85}
              >
                {card.pro && (
                  <View style={s.proLockBadge}>
                    <Text style={s.proLockText}>🔒 Pro</Text>
                  </View>
                )}
                <Text style={s.gridIcon}>{card.icon}</Text>
                <Text style={[s.gridTitle, { color: card.color }]}>{card.title}</Text>
                <View style={[s.gridChip, { borderColor: card.color + '55' }]}>
                  <Text style={[s.gridChipText, { color: card.color }]}>{card.chip}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── LEADERBOARD ── */}
        <View style={s.lbCard}>
          <View style={s.lbCardHeader}>
            <Text style={s.lbTitle}>Weekly champions</Text>
            <Text style={s.lbSubtitle}>847 students · resets Mon</Text>
          </View>

          <View style={s.lbTabs}>
            {LB_TABS.map(t => (
              <TouchableOpacity
                key={t}
                onPress={() => setLbTab(t)}
                style={[s.lbTab, lbTab === t && s.lbTabActive]}
              >
                <Text style={[s.lbTabText, lbTab === t && s.lbTabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Podium: 2nd | 1st | 3rd */}
          <View style={s.podium}>
            {TOP_3.map((p) => {
              const isFirst = p.rank === 1;
              return (
                <View key={p.rank} style={[s.podiumItem, isFirst && s.podiumItemFirst]}>
                  {isFirst && <Text style={s.crown}>👑</Text>}
                  <View style={[s.podiumAvatar, isFirst && s.podiumAvatarFirst]}>
                    <Text style={[s.podiumInitial, isFirst && s.podiumInitialFirst]}>{p.initial}</Text>
                  </View>
                  <Text style={s.podiumName}>{p.name.split(' ')[0]}</Text>
                  <Text style={[s.podiumScore, isFirst && { color: Colors.gold }]}>{p.score.toFixed(1)}</Text>
                  <View style={[s.podiumRank, isFirst && s.podiumRankFirst]}>
                    <Text style={[s.podiumRankText, isFirst && { color: Colors.white }]}>#{p.rank}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Rows 4–5 */}
          {LB_ROWS.map((row) => (
            <View key={row.rank} style={s.lbRow}>
              <Text style={s.lbRank}>#{row.rank}</Text>
              <View style={s.lbAvatar}><Text style={s.lbAvatarText}>{row.name[0]}</Text></View>
              <Text style={s.lbName}>{row.name}</Text>
              <Text style={s.lbScore}>{row.score.toFixed(1)}</Text>
            </View>
          ))}

          {/* Your row */}
          <View style={[s.lbRow, s.lbYouRow]}>
            <Text style={s.lbRank}>#12</Text>
            <View style={[s.lbAvatar, { backgroundColor: Colors.p }]}>
              <Text style={[s.lbAvatarText, { color: Colors.white }]}>{initial}</Text>
            </View>
            <Text style={[s.lbName, { fontFamily: 'Inter_700Bold' }]}>You</Text>
            <Text style={s.lbScore}>
              6.5{'  '}<Text style={{ color: Colors.green, fontSize: 11 }}>↑+0.5</Text>
            </Text>
          </View>
        </View>

        {/* ── MONTHLY EXAM DARK CARD ── */}
        <View style={s.examCard}>
          <View style={s.examTagRow}>
            <Text style={s.examTag}>IELTS ACADEMIC · ENGLISH</Text>
          </View>
          <Text style={s.examTitle}>April 2026 Exam</Text>
          <Text style={s.examSub}>Entry closes Apr 25 · Public results in 48h</Text>

          {/* 3 stats */}
          <View style={s.examStats}>
            <View style={s.examStat}>
              <Text style={s.examStatNum}>$5</Text>
              <Text style={s.examStatLabel}>Entry</Text>
            </View>
            <View style={s.examStatDiv} />
            <View style={s.examStat}>
              <Text style={s.examStatNum}>847</Text>
              <Text style={s.examStatLabel}>Registered</Text>
            </View>
            <View style={s.examStatDiv} />
            <View style={s.examStat}>
              <Text style={s.examStatNum}>🌍</Text>
              <Text style={s.examStatLabel}>Public Results</Text>
            </View>
          </View>

          {/* Streak note */}
          <View style={s.examStreakNote}>
            <Text style={s.examStreakNoteText}>
              🔥 You need {remaining} more streak days to unlock
            </Text>
          </View>

          <TouchableOpacity style={s.examBtn} activeOpacity={0.88}>
            <Text style={s.examBtnText}>Learn how it works</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────
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
  notifIcon: { fontSize: 17 },
  avatarBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },

  // Hero card
  heroCard: { backgroundColor: Colors.white, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 20, gap: 4 },
  greetingText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.ink3 },
  heroName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, fontStyle: 'italic', marginBottom: 14 },
  statRow: { flexDirection: 'row', gap: 8 },
  statChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, gap: 2 },
  statChipLight: { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border },
  statNumWhite: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white },
  statLabelWhite: { fontFamily: 'Inter_500Medium', fontSize: 8, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.3 },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  statLabel: { fontFamily: 'Inter_500Medium', fontSize: 8, color: Colors.ink3, letterSpacing: 0.3 },

  // Streak
  streakCard: { backgroundColor: Colors.white, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 8 },
  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  streakFire: { fontSize: 18 },
  streakText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink, flex: 1 },
  streakNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: Colors.p },
  streakSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },

  // Section headers
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  sectionLink: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },
  sectionSubLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },

  // Language cards
  langScroll: { gap: 12, paddingBottom: 4 },
  langCard: { width: 140, backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 4 },
  langFlag: { fontSize: 28 },
  langName: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink, marginTop: 4 },
  langNative: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  langBarTrack: { height: 4, backgroundColor: Colors.bg2, borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  langBarFill: { height: 4, borderRadius: 2 },
  langPct: { fontFamily: 'Inter_600SemiBold', fontSize: 12, marginTop: 2 },
  examBadge: { borderRadius: 6, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 3, marginTop: 4 },
  examBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 10 },

  // Speaking hero (vertical layout)
  speakHero: { backgroundColor: Colors.p, borderRadius: 22, padding: 22, marginBottom: 12, gap: 10 },
  speakAILabel: { backgroundColor: 'rgba(255,255,255,0.18)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  speakAIText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.white, letterSpacing: 0.4 },
  speakTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30, color: Colors.white },
  speakDesc: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.72)', lineHeight: 20 },
  speakChipsRow: { flexDirection: 'row', gap: 7, flexWrap: 'wrap' },
  speakChip: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  speakChipText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.white },
  speakArrowWrap: { alignItems: 'flex-end', marginTop: 2 },
  speakArrowBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center' },
  speakArrowText: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white },

  // Practice 2×2 grid
  practiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { borderRadius: 18, padding: 16, gap: 6, position: 'relative', overflow: 'hidden' },
  gridIcon: { fontSize: 28 },
  gridTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  gridChip: { borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start', marginTop: 2 },
  gridChipText: { fontFamily: 'Inter_500Medium', fontSize: 10 },
  proLockBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: Colors.bg2, borderRadius: 20, paddingHorizontal: 7, paddingVertical: 3 },
  proLockText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3 },

  // Leaderboard
  lbCard: { backgroundColor: Colors.white, borderRadius: 22, borderWidth: 1, borderColor: Colors.border, padding: 18 },
  lbCardHeader: { marginBottom: 12 },
  lbTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  lbSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  lbTabs: { flexDirection: 'row', backgroundColor: Colors.bg2, borderRadius: 10, padding: 3, gap: 3, marginBottom: 18 },
  lbTab: { flex: 1, paddingVertical: 7, borderRadius: 8, alignItems: 'center' },
  lbTabActive: { backgroundColor: Colors.white },
  lbTabText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.ink3 },
  lbTabTextActive: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.ink },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 10, marginBottom: 16, paddingTop: 4 },
  podiumItem: { alignItems: 'center', gap: 5, flex: 1 },
  podiumItemFirst: { marginBottom: 10 },
  crown: { fontSize: 18 },
  podiumAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.border },
  podiumAvatarFirst: { width: 58, height: 58, borderRadius: 29, borderColor: Colors.gold, backgroundColor: Colors.gold_bg },
  podiumInitial: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  podiumInitialFirst: { fontSize: 22 },
  podiumName: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink, textAlign: 'center' },
  podiumScore: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.p },
  podiumRank: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7, backgroundColor: Colors.bg2 },
  podiumRankFirst: { backgroundColor: Colors.gold },
  podiumRankText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink },
  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: Colors.border },
  lbYouRow: { backgroundColor: Colors.p_soft, borderRadius: 10, paddingHorizontal: 10, borderTopWidth: 0, marginTop: 4 },
  lbRank: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink2, width: 30 },
  lbAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  lbAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  lbName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1 },
  lbScore: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },

  // Monthly exam dark card
  examCard: { backgroundColor: '#1A1A2E', borderRadius: 22, padding: 22, gap: 12 },
  examTagRow: { flexDirection: 'row' },
  examTag: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.p, letterSpacing: 1.2, textTransform: 'uppercase' },
  examTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.white },
  examSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: -6 },
  examStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 14, paddingVertical: 14 },
  examStat: { flex: 1, alignItems: 'center', gap: 4 },
  examStatNum: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white },
  examStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.45)', textAlign: 'center' },
  examStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 },
  examStreakNote: { backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  examStreakNoteText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.65)' },
  examBtn: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  examBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: 'rgba(255,255,255,0.8)' },
});
