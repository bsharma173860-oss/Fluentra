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
import { getLangNames } from '@/constants/languages';
import type { UserLanguage } from '@/lib/supabase';

const { width: W } = Dimensions.get('window');

// ─── Mock data ────────────────────────────────────────────────────
const SAMPLE_LANGUAGES: UserLanguage[] = [
  { id: 's1', user_id: '', language_code: 'en', language_name_en: 'English',  language_name_native: 'English',  fluency_percent: 88, exams: ['IELTS','TOEFL'], created_at: '' },
  { id: 's2', user_id: '', language_code: 'es', language_name_en: 'Spanish',  language_name_native: 'Español',  fluency_percent: 55, exams: ['DELE'],          created_at: '' },
  { id: 's3', user_id: '', language_code: 'fr', language_name_en: 'French',   language_name_native: 'Français', fluency_percent: 30, exams: ['DELF'],          created_at: '' },
];

const LANG_COLOR: Record<string, string> = {
  en: Colors.p, es: Colors.orange, fr: Colors.green,
  de: Colors.gold, pt: Colors.green, zh: Colors.danger,
  ja: Colors.p, ko: Colors.orange, ar: Colors.gold,
};

const LANG_FLAG_BG: Record<string, string> = {
  en: '#E8EDFF', es: '#FFF0E5', fr: '#E5F5EC',
  de: '#FFFBE5', pt: '#E5F5EC', zh: '#FFE5E5',
  ja: '#FFE5F5', ko: '#E5EEFF', ar: '#E5F5F0',
};

const MOCK = { bandScore: 6.5, globalRank: 12, streakCount: 32, streakTarget: 40 };

const LB_TABS = ['All', 'Friends', 'My country'];

// Podium order: 2nd (left) · 1st (center) · 3rd (right)
const PODIUM = [
  { rank: 2, name: 'Mohamed K.', score: 8.0, initial: 'M', podiumH: 50, color: '#9BA3B0', bg: '#F0F2F5' },
  { rank: 1, name: 'Sara A.',    score: 8.5, initial: 'S', podiumH: 68, color: Colors.gold, bg: Colors.gold_bg },
  { rank: 3, name: 'Jana P.',    score: 7.5, initial: 'J', podiumH: 40, color: '#9BA3B0', bg: '#F0F2F5' },
];

const LB_ROWS = [
  { rank: 4, name: 'Riya M.',  score: 7.0 },
  { rank: 5, name: 'Karim H.', score: 7.0 },
];

type GridCard = { icon: string; type: string; title: string; desc: string; color: string; bg: string; route: string; pro: boolean };
const GRID_CARDS: GridCard[] = [
  { icon: '✏️', type: 'Essay',  title: 'Writing',   desc: 'Essay & report writing',   color: Colors.gold,   bg: Colors.gold_bg,   route: '/modules/writing/select',   pro: false },
  { icon: '🎧', type: 'Audio',  title: 'Listening',  desc: 'Audio comprehension',       color: Colors.green,  bg: Colors.green_bg,  route: '/modules/listening/select', pro: false },
  { icon: '📖', type: 'Text',   title: 'Reading',    desc: 'Passage analysis',          color: Colors.orange, bg: Colors.orange_bg, route: '/modules/reading/select',   pro: true  },
  { icon: '💬', type: 'Free',   title: 'Free Chat',  desc: 'Open AI conversation',      color: Colors.p,      bg: Colors.p_soft,    route: '/modules/speaking/select',  pro: false },
];

// ─── Screen ───────────────────────────────────────────────────────
export default function HomeScreen() {
  const { profile } = useAuth();
  const displayName = profile?.name ?? '';
  const initial = displayName ? displayName[0].toUpperCase() : '?';

  const [languages, setLanguages] = useState<UserLanguage[]>(SAMPLE_LANGUAGES);
  const [lbTab, setLbTab] = useState('All');

  useEffect(() => {
    if (!profile?.id) return;
    supabase
      .from('user_languages').select('*').eq('user_id', profile.id)
      .then(({ data }) => { if (data && data.length > 0) setLanguages(data as UserLanguage[]); });
  }, [profile?.id]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const remaining = MOCK.streakTarget - MOCK.streakCount;
  const cardW = (W - 20 * 2 - 10) / 2;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HEADER ── */}
        <View style={s.headerWrap}>
          <Text style={s.logo}>Fluent<Text style={s.logoAccent}>ra</Text></Text>
          <View style={s.headerRight}>
            <TouchableOpacity style={s.bellBtn}>
              <Text style={s.bellIcon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
              <Text style={s.avatarText}>{initial}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── HERO ── */}
        <View style={s.heroWrap}>
          <Text style={s.greeting}>{greeting}</Text>
          <Text style={s.heroName}>{displayName || 'there'}.</Text>
          <Text style={s.tagline}>"Speak it. Score it. Own it."</Text>
          <View style={s.statRow}>
            <View style={[s.statChip, { backgroundColor: Colors.p }]}>
              <Text style={s.statValWhite}>{MOCK.bandScore.toFixed(1)}</Text>
              <Text style={s.statLblWhite}>BAND SCORE</Text>
            </View>
            <View style={[s.statChip, s.statChipGray]}>
              <Text style={s.statVal}>{languages.length}</Text>
              <Text style={s.statLbl}>LANGUAGES</Text>
            </View>
            <View style={[s.statChip, s.statChipGray]}>
              <Text style={s.statVal}>#{MOCK.globalRank}</Text>
              <Text style={s.statLbl}>RANK</Text>
            </View>
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={s.divider} />

        {/* ── STREAK ── */}
        <View style={s.streakWrap}>
          <View style={s.streakRow}>
            <Text style={s.streakFire}>🔥</Text>
            <Text style={s.streakMsg} numberOfLines={1}>
              {remaining} days to unlock the April exam
            </Text>
            <Text style={s.streakNum}>{MOCK.streakCount}</Text>
          </View>
          <ProgressBar
            progress={MOCK.streakCount / MOCK.streakTarget}
            color={Colors.orange}
            trackColor={Colors.bg2}
            height={6}
            animated
          />
          <Text style={s.streakSub}>{MOCK.streakCount} of {MOCK.streakTarget} days complete</Text>
        </View>

        {/* ── DIVIDER ── */}
        <View style={s.divider} />

        {/* ── LANGUAGES ── */}
        <View style={s.langSection}>
          <View style={s.sectionRow}>
            <Text style={s.sectionTitle}>Your languages</Text>
            <TouchableOpacity><Text style={s.sectionLink}>+ Add language</Text></TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.langScroll}
          >
            {languages.map((lang, idx) => {
              const code  = lang.language_code;
              const color = LANG_COLOR[code] ?? Colors.p;
              const flagBg = LANG_FLAG_BG[code] ?? Colors.p_soft;
              const names = getLangNames(code);
              const exams = LANGUAGE_EXAMS[code] ?? [];
              const active = idx === 0;
              return (
                <TouchableOpacity
                  key={lang.id}
                  style={[s.langCard, active && s.langCardActive]}
                  onPress={() => router.push(`/language/${code}` as any)}
                  activeOpacity={0.85}
                >
                  {/* Flag header */}
                  <View style={[s.langFlagArea, { backgroundColor: flagBg }]}>
                    <Text style={s.langFlagEmoji}>{names.flag}</Text>
                  </View>
                  {/* Body */}
                  <View style={s.langBody}>
                    <Text style={s.langEn}>{names.english}</Text>
                    <Text style={s.langNative}>{names.native}</Text>
                    {/* Progress bar */}
                    <View style={s.langBarTrack}>
                      <View style={[s.langBarFill, { width: `${lang.fluency_percent}%` as any, backgroundColor: color }]} />
                    </View>
                    <Text style={s.langPct}>{lang.fluency_percent}%</Text>
                    {/* Exam badges */}
                    {exams.length > 0 && (
                      <View style={s.langBadges}>
                        {exams.slice(0, 2).map(e => (
                          <View key={e.id} style={s.examBadge}>
                            <Text style={s.examBadgeText}>{e.id.toUpperCase()}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── DIVIDER ── */}
        <View style={s.divider} />

        {/* ── PRACTICE ── */}
        <View style={s.practiceWrap}>
          <Text style={s.sectionTitle}>Practice</Text>

          {/* Speaking hero */}
          <TouchableOpacity
            style={s.speakHero}
            onPress={() => router.push('/modules/speaking/select' as any)}
            activeOpacity={0.88}
          >
            <Text style={s.speakTag}>AI EXAMINER</Text>
            <Text style={s.speakTitle}>Speaking</Text>
            <Text style={s.speakDesc}>
              Live AI conversation — graded on fluency, grammar, vocabulary and pronunciation.
            </Text>
            <View style={s.speakChipsRow}>
              {['Face detection', 'Live transcript', 'Body language'].map(c => (
                <View key={c} style={s.speakChip}><Text style={s.speakChipText}>{c}</Text></View>
              ))}
            </View>
            <View style={s.speakArrowWrap}>
              <View style={s.speakArrowBtn}><Text style={s.speakArrowText}>→</Text></View>
            </View>
          </TouchableOpacity>

          {/* 2×2 grid */}
          <View style={s.practiceGrid}>
            {GRID_CARDS.map((card) => (
              <TouchableOpacity
                key={card.title}
                style={[s.gridCard, { width: cardW }]}
                onPress={() => {
                  if (card.pro) {
                    Alert.alert('Pro Feature', 'Reading is available with Fluentra Pro.', [
                      { text: 'Not now', style: 'cancel' },
                      { text: 'Upgrade', onPress: () => {} },
                    ]);
                    return;
                  }
                  router.push(card.route as any);
                }}
                activeOpacity={0.85}
              >
                <View style={[s.gridIconWrap, { backgroundColor: card.bg }]}>
                  <Text style={s.gridIcon}>{card.icon}</Text>
                </View>
                <Text style={[s.gridType, { color: card.color }]}>{card.type}{card.pro ? ' · 🔒 Pro' : ''}</Text>
                <Text style={s.gridTitle}>{card.title}</Text>
                <Text style={s.gridDesc}>{card.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── DIVIDER ── */}
        <View style={s.divider} />

        {/* ── LEADERBOARD ── */}
        <View style={s.lbWrap}>
          <View style={s.lbHeader}>
            <Text style={s.lbTitle}>Weekly champions</Text>
            <Text style={s.lbSub}>847 students · resets Mon</Text>
          </View>

          <View style={s.lbTabRow}>
            {LB_TABS.map(t => (
              <TouchableOpacity
                key={t}
                style={[s.lbTab, lbTab === t && s.lbTabActive]}
                onPress={() => setLbTab(t)}
              >
                <Text style={[s.lbTabText, lbTab === t && s.lbTabTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Podium */}
          <View style={s.podiumRow}>
            {PODIUM.map(p => (
              <View key={p.rank} style={s.podiumCol}>
                {p.rank === 1 && <Text style={s.crown}>👑</Text>}
                <View style={[s.podiumAvatar, p.rank === 1 && s.podiumAvatarFirst, { borderColor: p.color }]}>
                  <Text style={s.podiumInitial}>{p.initial}</Text>
                </View>
                <Text style={s.podiumName}>{p.name.split(' ')[0]}</Text>
                <Text style={[s.podiumScore, { color: p.color }]}>{p.score.toFixed(1)}</Text>
                <View style={[s.podiumBase, { height: p.podiumH, backgroundColor: p.bg, borderTopColor: p.color }]}>
                  <Text style={[s.podiumRank, { color: p.color }]}>#{p.rank}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Rows 4–5 */}
          {LB_ROWS.map(row => (
            <View key={row.rank} style={s.lbRow}>
              <Text style={s.lbRank}>#{row.rank}</Text>
              <View style={s.lbAvatar}><Text style={s.lbAvatarTxt}>{row.name[0]}</Text></View>
              <Text style={s.lbName}>{row.name}</Text>
              <Text style={s.lbScore}>{row.score.toFixed(1)}</Text>
            </View>
          ))}

          {/* Your row */}
          <View style={[s.lbRow, s.lbYouRow]}>
            <Text style={[s.lbRank, { color: Colors.p }]}>#12</Text>
            <View style={[s.lbAvatar, { backgroundColor: Colors.p }]}>
              <Text style={[s.lbAvatarTxt, { color: Colors.white }]}>{initial}</Text>
            </View>
            <Text style={[s.lbName, { fontFamily: 'Inter_700Bold', color: Colors.p }]}>You</Text>
            <Text style={s.lbScore}>
              6.5{'  '}<Text style={{ color: Colors.green, fontSize: 11 }}>↑+0.5</Text>
            </Text>
          </View>
        </View>

        {/* ── MONTHLY EXAM ── */}
        <View style={s.examWrap}>
          <View style={s.examCard}>
            <View style={s.examTagRow}>
              <Text style={s.examTag}>IELTS ACADEMIC · ENGLISH</Text>
            </View>
            <Text style={s.examTitle}>April 2026 Exam</Text>
            <Text style={s.examSub}>Entry closes Apr 25 · Public results in 48h</Text>

            <View style={s.examStats}>
              <View style={s.examStat}>
                <Text style={s.examStatNum}>$5</Text>
                <Text style={s.examStatLbl}>Entry</Text>
              </View>
              <View style={s.examStatDiv} />
              <View style={s.examStat}>
                <Text style={s.examStatNum}>847</Text>
                <Text style={s.examStatLbl}>Registered</Text>
              </View>
              <View style={s.examStatDiv} />
              <View style={s.examStat}>
                <Text style={s.examStatNum}>🌍</Text>
                <Text style={s.examStatLbl}>Public</Text>
              </View>
            </View>

            <View style={s.examBottom}>
              <Text style={s.examFlame}>🔥 {remaining} more days to unlock</Text>
              <TouchableOpacity style={s.examBtn} activeOpacity={0.88}>
                <Text style={s.examBtnText}>Learn more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  divider: { height: 8, backgroundColor: Colors.bg2 },

  // Header
  headerWrap: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 12,
  },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: Colors.ink },
  logoAccent: { color: Colors.p },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  bellIcon: { fontSize: 16 },
  avatarBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },

  // Hero
  heroWrap: { backgroundColor: Colors.white, paddingHorizontal: 20, paddingBottom: 20, paddingTop: 4 },
  greeting: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
  heroName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink, marginTop: 2 },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, fontStyle: 'italic', marginBottom: 16, marginTop: 2 },
  statRow: { flexDirection: 'row', gap: 10 },
  statChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 14, gap: 3 },
  statChipGray: { backgroundColor: Colors.bg2 },
  statValWhite: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: Colors.white },
  statLblWhite: { fontFamily: 'Inter_500Medium', fontSize: 9, color: 'rgba(255,255,255,0.75)', letterSpacing: 0.4 },
  statVal: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: Colors.ink },
  statLbl: { fontFamily: 'Inter_500Medium', fontSize: 9, color: Colors.ink3, letterSpacing: 0.4 },

  // Streak
  streakWrap: { backgroundColor: Colors.white, paddingHorizontal: 20, paddingVertical: 16, gap: 8 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakFire: { fontSize: 18 },
  streakMsg: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink, flex: 1 },
  streakNum: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.p },
  streakSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },

  // Language section
  langSection: { backgroundColor: Colors.white, paddingTop: 20, paddingBottom: 20 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  sectionLink: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },
  langScroll: { gap: 12, paddingHorizontal: 20 },

  // Language card
  langCard: {
    width: 130, backgroundColor: Colors.white,
    borderRadius: 18, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  langCardActive: { borderWidth: 2, borderColor: Colors.p },
  langFlagArea: { height: 72, alignItems: 'center', justifyContent: 'center' },
  langFlagEmoji: { fontSize: 38 },
  langBody: { padding: 10, gap: 3 },
  langEn: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  langNative: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  langBarTrack: { height: 3, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden', marginTop: 4 },
  langBarFill: { height: '100%', borderRadius: 99 },
  langPct: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  langBadges: { flexDirection: 'row', gap: 4, marginTop: 2, flexWrap: 'wrap' },
  examBadge: { backgroundColor: Colors.p_soft, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  examBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 9, color: Colors.p },

  // Practice section
  practiceWrap: { backgroundColor: Colors.white, padding: 20, gap: 12 },

  // Speaking hero
  speakHero: { backgroundColor: Colors.p, borderRadius: 20, padding: 20, gap: 8 },
  speakTag: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.7)', letterSpacing: 0.8 },
  speakTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: Colors.white },
  speakDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },
  speakChipsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  speakChip: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 9, paddingVertical: 3, borderRadius: 10 },
  speakChipText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.white },
  speakArrowWrap: { alignItems: 'flex-end' },
  speakArrowBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  speakArrowText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },

  // Practice grid
  practiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  gridCard: { backgroundColor: Colors.white, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 4 },
  gridIconWrap: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  gridIcon: { fontSize: 16 },
  gridType: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  gridTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  gridDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, lineHeight: 16 },

  // Leaderboard
  lbWrap: { backgroundColor: Colors.white, marginHorizontal: 20, marginTop: 0, borderRadius: 18, borderWidth: 1, borderColor: Colors.border, marginVertical: 20, overflow: 'hidden' },
  lbHeader: { padding: 16, paddingBottom: 0 },
  lbTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  lbSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, marginTop: 2 },
  lbTabRow: { flexDirection: 'row', backgroundColor: Colors.bg2, borderRadius: 8, margin: 14, padding: 3, gap: 2 },
  lbTab: { flex: 1, paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  lbTabActive: { backgroundColor: Colors.white },
  lbTabText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.ink3 },
  lbTabTextActive: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.ink },

  // Podium
  podiumRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 16, gap: 10, marginBottom: 4 },
  podiumCol: { flex: 1, alignItems: 'center', gap: 3 },
  crown: { fontSize: 18, marginBottom: 2 },
  podiumAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.bg2, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  podiumAvatarFirst: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.gold_bg },
  podiumInitial: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  podiumName: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.ink, textAlign: 'center' },
  podiumScore: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  podiumBase: { width: '100%', borderTopWidth: 3, borderRadius: 4, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 5 },
  podiumRank: { fontFamily: 'Inter_700Bold', fontSize: 11 },

  lbRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14, borderTopWidth: 1, borderTopColor: Colors.border },
  lbYouRow: { backgroundColor: '#F5F5FF', borderTopWidth: 0, marginTop: 2 },
  lbRank: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink3, width: 28 },
  lbAvatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  lbAvatarTxt: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.ink },
  lbName: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1 },
  lbScore: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },

  // Monthly exam
  examWrap: { paddingHorizontal: 20, paddingBottom: 32 },
  examCard: { backgroundColor: '#1A1A2E', borderRadius: 18, padding: 20, gap: 12 },
  examTagRow: {},
  examTag: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },
  examTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 20, color: Colors.white },
  examSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: -6 },
  examStats: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, paddingVertical: 12 },
  examStat: { flex: 1, alignItems: 'center', gap: 3 },
  examStatNum: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.white },
  examStatLbl: { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.45)' },
  examStatDiv: { width: 1, backgroundColor: 'rgba(255,255,255,0.12)', marginVertical: 4 },
  examBottom: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  examFlame: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1 },
  examBtn: { backgroundColor: Colors.p_soft, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10 },
  examBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.p },
});
