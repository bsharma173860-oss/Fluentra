import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Colors } from '@/constants/colors';
import { LANGUAGE_EXAMS, type ExamProfile } from '@/constants/examProfiles';
import { getLangNames } from '@/constants/languages';
import { getTheme } from '@/constants/languageThemes';
import { LanguageThemeProvider } from '@/context/LanguageThemeContext';
import { useAuth } from '@/lib/authContext';
import { supabase, type UserLanguage } from '@/lib/supabase';
import {
  hasPracticed, type PracticeModule,
} from '@/lib/practiceStore';
import {
  ChevronLeftIcon, ChevronRightIcon,
  MicIcon, PenIcon, HeadphoneIcon, BookIcon, SpeakIcon,
  LockIcon, CheckIcon, FlameIcon,
} from '@/components/icons';
import { getDifficulty, DIFFICULTY_COLOR, DIFFICULTY_BG } from '@/constants/dailyContent';

// ── Practice card config ──────────────────────────────────────────
type PracticeCard = {
  module:   PracticeModule;
  Icon:     typeof MicIcon;
  title:    string;
  desc:     string;
  color:    string;
  bgColor:  string;
  route:    string;
  pro:      boolean;
};

const PRACTICE_CARDS: PracticeCard[] = [
  {
    module: 'speaking', Icon: MicIcon,
    title: 'Speaking', desc: '5–15 min · AI examiner',
    color: Colors.orange, bgColor: Colors.orange_bg,
    route: '/modules/speaking/select', pro: false,
  },
  {
    module: 'writing', Icon: PenIcon,
    title: 'Writing', desc: 'Essay or short response',
    color: Colors.gold, bgColor: Colors.gold_bg,
    route: '/modules/writing/select', pro: false,
  },
  {
    module: 'listening', Icon: HeadphoneIcon,
    title: 'Listening', desc: 'Audio comprehension',
    color: Colors.green, bgColor: Colors.green_bg,
    route: '/modules/listening/select', pro: false,
  },
  {
    module: 'reading', Icon: BookIcon,
    title: 'Reading', desc: 'Passage analysis',
    color: Colors.blue, bgColor: Colors.blue_bg,
    route: '/modules/reading/select', pro: false,
  },
];

// Mock scores
const MOCK_SCORES: Record<string, { band: number; speaking: number; writing: number; listening: number; reading: number }> = {
  en: { band: 6.5, speaking: 7.0, writing: 6.5, listening: 7.5, reading: 6.5 },
  es: { band: 5.5, speaking: 5.5, writing: 5.0, listening: 6.0, reading: 5.5 },
  fr: { band: 4.5, speaking: 4.5, writing: 4.0, listening: 5.0, reading: 4.5 },
};

const STREAK_TARGET = 40;

type Tab = 'practice' | 'dashboard' | 'exams';

// ── Sub-components ────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={sl.label}>{children}</Text>;
}
const sl = StyleSheet.create({
  label: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11,
    color: Colors.ink3, letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 10,
  },
});

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={sb.row}>
      <Text style={sb.label}>{label}</Text>
      <View style={sb.track}>
        <View style={[sb.fill, { width: `${(value / 9) * 100}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[sb.val, { color }]}>{value.toFixed(1)}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, width: 72 },
  track: { flex: 1, height: 5, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 99 },
  val:   { fontFamily: 'Inter_700Bold', fontSize: 12, width: 30, textAlign: 'right' },
});

// ── Practice tab ──────────────────────────────────────────────────
function PracticeTab({
  langCode, practiced, streak, remaining, examsUnlocked,
  accentColor, onCardTap,
}: {
  langCode:      string;
  practiced:     Record<PracticeModule, boolean>;
  streak:        number;
  remaining:     number;
  examsUnlocked: boolean;
  accentColor:   string;
  onCardTap:     (card: PracticeCard) => void;
}) {
  return (
    <View style={pt.wrap}>
      <Text style={pt.title}>Daily Practice</Text>
      <Text style={pt.sub}>One session counts as your streak for today</Text>

      <View style={pt.cardList}>
        {PRACTICE_CARDS.map(card => {
          const done = practiced[card.module];
          const { Icon } = card;
          return (
            <TouchableOpacity
              key={card.module}
              style={pt.card}
              onPress={() => onCardTap(card)}
              activeOpacity={0.8}
            >
              {/* Left icon */}
              <View style={[pt.iconBox, { backgroundColor: card.bgColor }]}>
                <Icon size={18} color={card.color} strokeWidth={1.5} />
              </View>

              {/* Middle */}
              <View style={pt.cardMeta}>
                <Text style={pt.cardName}>{card.title}</Text>
                <Text style={pt.cardDesc}>{card.desc}</Text>
              </View>

              {/* Right */}
              <View style={pt.cardRight}>
                {done ? (
                  <View style={[pt.statusPill, { backgroundColor: card.bgColor }]}>
                    <CheckIcon size={12} color={card.color} strokeWidth={2.5} />
                  </View>
                ) : card.pro ? (
                  <LockIcon size={14} color={Colors.ink3} />
                ) : (
                  <View style={[pt.statusPill, { backgroundColor: card.bgColor }]}>
                    <Text style={[pt.statusText, { color: card.color }]}>1 left</Text>
                  </View>
                )}
                <ChevronRightIcon size={14} color={Colors.borderStrong} />
              </View>
            </TouchableOpacity>
          );
        })}

        {/* AI Tutor card */}
        <TouchableOpacity
          style={pt.card}
          onPress={() => router.push(`/language/${langCode}/tutor` as any)}
          activeOpacity={0.8}
        >
          <View style={[pt.iconBox, { backgroundColor: Colors.purple_bg }]}>
            <SpeakIcon size={18} color={Colors.purple} strokeWidth={1.5} />
          </View>
          <View style={pt.cardMeta}>
            <Text style={pt.cardName}>AI Tutor</Text>
            <Text style={pt.cardDesc}>Free conversation</Text>
          </View>
          <View style={pt.cardRight}>
            <View style={[pt.statusPill, { backgroundColor: Colors.purple_bg }]}>
              <Text style={[pt.statusText, { color: Colors.purple }]}>Free</Text>
            </View>
            <ChevronRightIcon size={14} color={Colors.borderStrong} />
          </View>
        </TouchableOpacity>

        {/* Content Library card */}
        <TouchableOpacity
          style={pt.card}
          onPress={() => router.push(`/language/${langCode}/library` as any)}
          activeOpacity={0.8}
        >
          <View style={[pt.iconBox, { backgroundColor: Colors.blue_bg }]}>
            <BookIcon size={18} color={Colors.blue} strokeWidth={1.5} />
          </View>
          <View style={pt.cardMeta}>
            <Text style={pt.cardName}>Content Library</Text>
            <Text style={pt.cardDesc}>Browse all passages & prompts</Text>
          </View>
          <View style={pt.cardRight}>
            <ChevronRightIcon size={14} color={Colors.borderStrong} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Streak card */}
      <View style={pt.streakCard}>
        <View style={pt.streakCardTop}>
          <Text style={pt.streakLabel}>Your streak</Text>
          {/* Difficulty badge */}
          {(() => {
            const diff = getDifficulty(streak);
            return (
              <View style={[pt.diffBadge, { backgroundColor: DIFFICULTY_BG[diff] }]}>
                <Text style={[pt.diffBadgeText, { color: DIFFICULTY_COLOR[diff] }]}>
                  {diff}
                </Text>
              </View>
            );
          })()}
        </View>
        <View style={pt.streakRow}>
          <Text style={[pt.streakNum, { color: accentColor }]}>{streak}</Text>
          <Text style={pt.streakDen}> /{STREAK_TARGET} days</Text>
        </View>
        <View style={pt.streakTrack}>
          <View style={[pt.streakFill, { width: `${Math.min((streak / STREAK_TARGET) * 100, 100)}%` as any, backgroundColor: accentColor }]} />
        </View>
        <Text style={pt.streakNote}>
          {examsUnlocked
            ? 'Monthly exam is unlocked!'
            : `Keep going — ${remaining} more day${remaining === 1 ? '' : 's'} to unlock exams`
          }
        </Text>
        <Text style={pt.levelNote}>Current level: {getDifficulty(streak)} · Increases as you practice</Text>
      </View>
    </View>
  );
}
const pt = StyleSheet.create({
  wrap:      { padding: 20, gap: 0 },
  title:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: Colors.ink, marginBottom: 4 },
  sub:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, marginBottom: 16 },
  cardList:  { gap: 8 },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 14, paddingHorizontal: 14, height: 68,
  },
  iconBox:   { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cardMeta:  { flex: 1 },
  cardName:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  cardDesc:  { fontFamily: 'Inter_400Regular',  fontSize: 12, color: Colors.ink3, marginTop: 2 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusPill:{ borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, alignItems: 'center', justifyContent: 'center' },
  statusText:{ fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  streakCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  diffBadge:     { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  diffBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  levelNote:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, marginTop: 2 },
  streakCard: {
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    padding: 20, marginTop: 16, gap: 8,
  },
  streakLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  streakRow:   { flexDirection: 'row', alignItems: 'baseline', gap: 0 },
  streakNum:   { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 48, lineHeight: 52 },
  streakDen:   { fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 },
  streakTrack: { height: 6, backgroundColor: Colors.bg2, borderRadius: 3, overflow: 'hidden' },
  streakFill:  { height: '100%', borderRadius: 3 },
  streakNote:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, lineHeight: 18 },
});

// ── Dashboard tab ─────────────────────────────────────────────────
function DashboardTab({ langCode, streak, accentColor }: { langCode: string; streak: number; accentColor: string }) {
  const scores = MOCK_SCORES[langCode] ?? MOCK_SCORES.en;
  const metrics = [
    { label: 'SESSIONS', value: '24',              color: Colors.ink },
    { label: 'BAND SCORE', value: scores.band.toFixed(1), color: accentColor },
    { label: 'BEST SCORE', value: '8.0',           color: Colors.gold },
    { label: 'STREAK',     value: `${streak}d`,    color: Colors.orange },
  ];
  return (
    <View style={db.wrap}>
      <SectionLabel>OVERVIEW</SectionLabel>
      <View style={db.grid}>
        {metrics.map(m => (
          <View key={m.label} style={db.metricCard}>
            <Text style={[db.metricVal, { color: m.color }]}>{m.value}</Text>
            <Text style={db.metricLbl}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={db.scoresCard}>
        <SectionLabel>SKILL BREAKDOWN</SectionLabel>
        <View style={db.scoreBars}>
          <ScoreBar label="Speaking"  value={scores.speaking}  color={Colors.orange} />
          <ScoreBar label="Writing"   value={scores.writing}   color={Colors.gold}   />
          <ScoreBar label="Listening" value={scores.listening} color={Colors.green}  />
          <ScoreBar label="Reading"   value={scores.reading}   color={Colors.blue}   />
        </View>
      </View>
    </View>
  );
}
const db = StyleSheet.create({
  wrap: { padding: 20, gap: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metricCard: {
    flex: 1, minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    padding: 16, alignItems: 'center', gap: 4,
  },
  metricVal: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26 },
  metricLbl: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  scoresCard: { backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 12 },
  scoreBars:  { gap: 12 },
});

// ── Exams tab ─────────────────────────────────────────────────────
function ExamsTab({
  langCode, examProfiles, examsUnlocked, remaining,
}: {
  langCode:      string;
  examProfiles:  ExamProfile[];
  examsUnlocked: boolean;
  remaining:     number;
}) {
  if (examProfiles.length === 0) {
    return (
      <View style={ex.empty}>
        <Text style={ex.emptyTitle}>No exams available</Text>
        <Text style={ex.emptySub}>Exam support for this language is coming soon.</Text>
      </View>
    );
  }

  return (
    <View style={ex.wrap}>
      {!examsUnlocked && (
        <View style={ex.lockBanner}>
          <LockIcon size={14} color={Colors.ink3} />
          <Text style={ex.lockBannerText}>{remaining} more streak days to unlock exams</Text>
        </View>
      )}

      {examProfiles.map(exam => (
        <View key={exam.id} style={[ex.card, { borderLeftColor: examsUnlocked ? exam.color : Colors.borderStrong }]}>
          <View style={ex.cardTop}>
            <View style={[ex.examBadge, { backgroundColor: exam.bg }]}>
              <Text style={[ex.examBadgeText, { color: exam.color }]}>{exam.id.toUpperCase()}</Text>
            </View>
            <Text style={[ex.cardTitle, !examsUnlocked && ex.cardTitleLocked]}>{exam.name}</Text>
          </View>
          <Text style={ex.cardSub}>
            {examsUnlocked ? `Avg score: 7.0 · Last attempt: Apr 10` : exam.fullName}
          </Text>

          {examsUnlocked ? (
            <View style={ex.actions}>
              <TouchableOpacity
                style={[ex.practiceBtn, { borderColor: exam.color }]}
                onPress={() => router.push(`/language/${langCode}/${exam.id}/exam-entry` as any)}
                activeOpacity={0.8}
              >
                <Text style={[ex.practiceBtnText, { color: exam.color }]}>Practice</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={ex.monthlyBtn}
                onPress={() => router.push(`/language/${langCode}/${exam.id}/monthly-exam` as any)}
                activeOpacity={0.8}
              >
                <Text style={ex.monthlyBtnText}>Monthly Exam</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={ex.lockRow}>
              <LockIcon size={12} color={Colors.ink3} />
              <Text style={ex.lockMsg}>Unlock at {STREAK_TARGET} day streak</Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}
const ex = StyleSheet.create({
  wrap:  { padding: 20, gap: 10 },
  empty: { padding: 32, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  emptySub:   { fontFamily: 'Inter_400Regular',  fontSize: 13, color: Colors.ink3, textAlign: 'center' },

  lockBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.bg2,
    borderRadius: 10, padding: 12, marginBottom: 4,
    borderWidth: 1, borderColor: Colors.border,
  },
  lockBannerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    borderLeftWidth: 4, padding: 16, gap: 8,
    overflow: 'hidden',
  },
  cardTop:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  examBadge: { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 3 },
  examBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  cardTitle:       { fontFamily: 'Inter_700Bold',    fontSize: 15, color: Colors.ink, flex: 1 },
  cardTitleLocked: { color: Colors.ink3 },
  cardSub:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },

  actions:     { flexDirection: 'row', gap: 8, marginTop: 4 },
  practiceBtn: { borderWidth: 1.5, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  practiceBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  monthlyBtn:  { backgroundColor: Colors.gold_bg, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 7 },
  monthlyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.gold },

  lockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  lockMsg: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
});

// ── Main screen ───────────────────────────────────────────────────
export default function LanguageDashboard() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const langCode  = code ?? 'en';
  const theme     = getTheme(langCode);
  const accentColor = theme.accent;

  const { user, profile } = useAuth();
  const [langRecord,  setLangRecord]  = useState<UserLanguage | null>(null);
  const [practiced,   setPracticed]   = useState<Record<PracticeModule, boolean>>({
    speaking: false, writing: false, listening: false, reading: false,
  });
  const [activeTab, setActiveTab] = useState<Tab>('practice');

  const streak       = profile?.streak_count ?? 32;
  const scores       = MOCK_SCORES[langCode] ?? MOCK_SCORES.en;
  const remaining    = Math.max(0, STREAK_TARGET - streak);
  const examsUnlocked= streak >= STREAK_TARGET;
  const examProfiles : ExamProfile[] = LANGUAGE_EXAMS[langCode] ?? [];
  const fluencyPct   = langRecord?.fluency_percent ?? (scores.band / 9 * 100);

  const names    = getLangNames(langCode);
  const langNative = langRecord?.language_name_native ?? names.native;

  // Fetch language record
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('user_languages').select('*')
      .eq('user_id', user.id).eq('language_code', langCode).single()
      .then(({ data }) => { if (data) setLangRecord(data); });
  }, [user?.id, langCode]);

  // Refresh practice status on focus
  useFocusEffect(
    useCallback(() => {
      setPracticed({
        speaking:  hasPracticed(langCode, 'speaking'),
        writing:   hasPracticed(langCode, 'writing'),
        listening: hasPracticed(langCode, 'listening'),
        reading:   hasPracticed(langCode, 'reading'),
      });
    }, [langCode])
  );

  function onCardTap(card: PracticeCard) {
    if (card.pro) {
      Alert.alert('Pro Feature', 'Reading is available with Fluentra Pro.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/upgrade' as any) },
      ]);
      return;
    }
    const primaryExam = examProfiles[0]?.id ?? 'ielts';
    router.push({
      pathname: card.route as any,
      params: { languageCode: langCode, examType: primaryExam },
    });
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'practice',  label: 'Practice'  },
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'exams',     label: 'Exams'     },
  ];

  return (
    <LanguageThemeProvider code={langCode}>
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={14} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={s.breadcrumb}>
          <Text style={s.breadcrumbRoot}>Home</Text>
          <Text style={s.breadcrumbSep}>/</Text>
          <Text style={s.breadcrumbCurrent}>{langNative}</Text>
        </View>
        <View style={[s.streakPill, { backgroundColor: theme.accentLight }]}>
          <FlameIcon size={12} color={theme.accent} strokeWidth={1.5} />
          <Text style={[s.streakPillText, { color: theme.accent }]}>Day {streak}</Text>
        </View>
      </View>

      {/* ── Tab bar ── */}
      <View style={s.tabBar}>
        {tabs.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            style={s.tab}
            onPress={() => setActiveTab(key)}
            activeOpacity={0.75}
          >
            <Text style={[s.tabText, activeTab === key && { color: theme.accent, fontFamily: 'Inter_600SemiBold' }]}>{label}</Text>
            {activeTab === key && <View style={[s.tabIndicator, { backgroundColor: theme.accent }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ── */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'practice' && (
          <PracticeTab
            langCode={langCode}
            practiced={practiced}
            streak={streak}
            remaining={remaining}
            examsUnlocked={examsUnlocked}
            accentColor={accentColor}
            onCardTap={onCardTap}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardTab
            langCode={langCode}
            streak={streak}
            accentColor={accentColor}
          />
        )}
        {activeTab === 'exams' && (
          <ExamsTab
            langCode={langCode}
            examProfiles={examProfiles}
            examsUnlocked={examsUnlocked}
            remaining={remaining}
          />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
    </AppLayout>
    </LanguageThemeProvider>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, height: 48,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
    gap: 10,
  },
  backBtn: {
    width: 26, height: 26, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  breadcrumb: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  breadcrumbRoot:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary },
  breadcrumbSep:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textMuted },
  breadcrumbCurrent: { fontFamily: 'Inter_500Medium',  fontSize: 13, color: Colors.textPrimary },

  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 20,
  },
  streakPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 11, marginRight: 24,
    position: 'relative', alignItems: 'center',
  },
  tabText:       { fontFamily: 'Inter_400Regular',  fontSize: 14, color: Colors.textSecondary },
  tabTextActive: { fontFamily: 'Inter_500Medium',   fontSize: 14, color: Colors.textPrimary   },
  tabIndicator: {
    position: 'absolute', bottom: 0,
    left: 0, right: 0, height: 2,
    borderTopLeftRadius: 1, borderTopRightRadius: 1,
  },
});
