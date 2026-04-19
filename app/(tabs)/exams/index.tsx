import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { getLangNames } from '@/constants/languages';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';
import {
  TrophyIcon, CheckIcon, LockIcon, CalendarIcon,
} from '@/components/icons';

const { width: W } = Dimensions.get('window');
const H_PAD = 20;
const STREAK_COUNT = 32;
const STREAK_TARGET = 40;
const EXAMS_UNLOCKED = STREAK_COUNT >= STREAK_TARGET;

// ─── Language data ────────────────────────────────────────────────────────────
const LANGUAGES = ['en', 'es', 'fr'];

// ─── Monthly exam ─────────────────────────────────────────────────────────────
type MonthlyExamMeta = {
  title: string; registered: number; fee: string; date: string; examColor: string;
};
const MONTHLY_EXAM: Record<string, MonthlyExamMeta> = {
  en: { title: 'IELTS Academic — May 2026', registered: 847, fee: '$5', date: 'May 1, 2026',  examColor: Colors.p      },
  es: { title: 'DELE B2 — May 2026',        registered: 312, fee: '$5', date: 'May 3, 2026',  examColor: Colors.orange },
  fr: { title: 'DELF B2 — May 2026',        registered: 218, fee: '$5', date: 'May 5, 2026',  examColor: '#1558B0'     },
};

// ─── Leaderboard data ─────────────────────────────────────────────────────────
type LBEntry = { rank: number; name: string; score: number; flag: string; initial: string; change?: number };
type LBData = { top3: LBEntry[]; rest: LBEntry[]; myCountry: LBEntry[]; you: LBEntry };

const LEADERBOARD: Record<string, LBData> = {
  en: {
    top3: [
      { rank: 1, name: 'Sara A.',    score: 8.5, flag: '🇬🇧', initial: 'S' },
      { rank: 2, name: 'Mohamed K.', score: 8.0, flag: '🇸🇦', initial: 'M' },
      { rank: 3, name: 'Jana P.',    score: 7.5, flag: '🇨🇿', initial: 'J' },
    ],
    rest: [
      { rank: 4, name: 'Riya M.',  score: 7.0, flag: '🇮🇳', initial: 'R', change: +0.5 },
      { rank: 5, name: 'Karim H.', score: 7.0, flag: '🇪🇬', initial: 'K', change: +1.0 },
      { rank: 6, name: 'Priya S.', score: 7.0, flag: '🇮🇳', initial: 'P' },
      { rank: 7, name: 'Ahmed Z.', score: 6.5, flag: '🇦🇪', initial: 'A' },
      { rank: 8, name: 'Li Wei',   score: 6.5, flag: '🇨🇳', initial: 'L' },
    ],
    myCountry: [
      { rank: 2, name: 'Emma K.', score: 7.0, flag: '🇨🇦', initial: 'E', change: +0.5 },
      { rank: 3, name: 'Lucas B.', score: 6.5, flag: '🇨🇦', initial: 'L' },
    ],
    you: { rank: 12, name: 'You', score: 6.5, flag: '🇨🇦', initial: 'Y', change: +0.5 },
  },
  es: {
    top3: [
      { rank: 1, name: 'Isabella R.', score: 7.5, flag: '🇪🇸', initial: 'I' },
      { rank: 2, name: 'Miguel A.',   score: 7.0, flag: '🇲🇽', initial: 'M' },
      { rank: 3, name: 'Carlos M.',   score: 7.0, flag: '🇲🇽', initial: 'C' },
    ],
    rest: [
      { rank: 4, name: 'Ana L.',     score: 6.5, flag: '🇦🇷', initial: 'A', change: +0.5 },
      { rank: 5, name: 'Tomás V.',   score: 6.0, flag: '🇨🇴', initial: 'T' },
    ],
    myCountry: [
      { rank: 2, name: 'Sofia N.', score: 6.0, flag: '🇨🇦', initial: 'S' },
    ],
    you: { rank: 8, name: 'You', score: 5.5, flag: '🇨🇦', initial: 'Y', change: +0.5 },
  },
  fr: {
    top3: [
      { rank: 1, name: 'Sophie L.',   score: 8.0, flag: '🇫🇷', initial: 'S' },
      { rank: 2, name: 'Marie D.',    score: 7.5, flag: '🇫🇷', initial: 'M' },
      { rank: 3, name: 'Jean-P. B.', score: 7.0, flag: '🇧🇪', initial: 'J' },
    ],
    rest: [
      { rank: 4, name: 'Luca F.',  score: 6.5, flag: '🇮🇹', initial: 'L', change: +0.5 },
      { rank: 5, name: 'Emma V.',  score: 6.0, flag: '🇩🇪', initial: 'E' },
    ],
    myCountry: [
      { rank: 3, name: 'Marc T.', score: 6.5, flag: '🇨🇦', initial: 'M', change: +0.5 },
    ],
    you: { rank: 6, name: 'You', score: 4.5, flag: '🇨🇦', initial: 'Y', change: +0.5 },
  },
};

// ─── Past exam results ────────────────────────────────────────────────────────
type PastExam = { month: string; exam: string; band: number; rank: number };
const PAST_EXAMS: Record<string, PastExam[]> = {
  en: [
    { month: 'March 2026',   exam: 'IELTS', band: 7.0, rank: 15 },
    { month: 'February 2026', exam: 'IELTS', band: 6.5, rank: 22 },
  ],
  es: [
    { month: 'March 2026', exam: 'DELE', band: 5.5, rank: 8 },
  ],
  fr: [],
};

// ─── Podium component ─────────────────────────────────────────────────────────
const GOLD   = '#B07A10';
const SILVER = '#7A8A9A';
const BRONZE = '#9A5A2A';

function Podium({ top3 }: { top3: LBEntry[] }) {
  // Display order: 2nd (left), 1st (center), 3rd (right)
  const order = [top3[1], top3[0], top3[2]];
  const podiumHeights = [64, 88, 48]; // 2nd, 1st, 3rd
  const podiumColors = [SILVER, GOLD, BRONZE];
  const isFirst = [false, true, false];

  return (
    <View style={p.wrap}>
      {order.map((entry, idx) => {
        const height = podiumHeights[idx];
        const color = podiumColors[idx];
        const first = isFirst[idx];
        return (
          <View key={entry.rank} style={p.col}>
            {first && <TrophyIcon size={22} color={GOLD} />}
            <View style={[p.avatar, first && p.avatarFirst, { borderColor: color }]}>
              <Text style={[p.initial, first && p.initialFirst]}>{entry.initial}</Text>
            </View>
            <Text style={p.name}>{entry.name.split(' ')[0]}</Text>
            <Text style={[p.score, { color }]}>{entry.score.toFixed(1)}</Text>
            <View style={[p.podiumBlock, { height, backgroundColor: color + '22', borderTopColor: color }]}>
              <Text style={[p.rankNum, { color }]}>#{entry.rank}</Text>
              <Text style={p.flag}>{entry.flag}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const p = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8, paddingBottom: 4 },
  col: { alignItems: 'center', flex: 1, gap: 4 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.bg2, borderWidth: 2.5,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarFirst: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#FEF9EC' },
  initial: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  initialFirst: { fontSize: 22 },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink, textAlign: 'center' },
  score: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  podiumBlock: {
    width: '100%', borderTopWidth: 3, borderRadius: 6,
    alignItems: 'center', justifyContent: 'flex-start',
    paddingTop: 6, gap: 2,
  },
  rankNum: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  flag: { fontSize: 14 },
});

// ─── Leaderboard row ──────────────────────────────────────────────────────────
function LBRow({ entry, you = false }: { entry: LBEntry; you?: boolean }) {
  const up = (entry.change ?? 0) > 0;
  return (
    <View style={[lb.row, you && lb.youRow]}>
      <Text style={[lb.rank, you && lb.youText]}>#{entry.rank}</Text>
      <View style={[lb.avatar, you && lb.youAvatar]}>
        <Text style={lb.initial}>{entry.initial}</Text>
      </View>
      <Text style={[lb.name, you && lb.youText]}>{entry.name}</Text>
      <Text style={lb.flag}>{entry.flag}</Text>
      {entry.change !== undefined && entry.change !== 0 && (
        <Text style={[lb.change, { color: up ? Colors.green : Colors.danger }]}>
          {up ? '↑' : '↓'}{Math.abs(entry.change).toFixed(1)}
        </Text>
      )}
      <Text style={[lb.score, you && { color: Colors.p }]}>{entry.score.toFixed(1)}</Text>
    </View>
  );
}

const lb = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  youRow: {
    backgroundColor: Colors.p_soft,
    borderBottomWidth: 0, borderRadius: 10,
    marginHorizontal: 4, marginBottom: 4,
  },
  rank: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.ink3, width: 28 },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center',
  },
  youAvatar: { backgroundColor: Colors.p },
  initial: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  name: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink, flex: 1 },
  youText: { color: Colors.p, fontFamily: 'Inter_700Bold' },
  flag: { fontSize: 16 },
  change: { fontFamily: 'Inter_600SemiBold', fontSize: 11, width: 32, textAlign: 'right' },
  score: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink, width: 36, textAlign: 'right' },
});

// ─── Screen ───────────────────────────────────────────────────────────────────
const LB_TABS = ['All', 'My country'];

export default function ExamsScreen() {
  const { lang: initialLang } = useLocalSearchParams<{ lang?: string }>();
  const [lang, setLang] = useState(initialLang ?? 'en');
  const [lbTab, setLbTab] = useState('All');

  const monthlyExam = MONTHLY_EXAM[lang] ?? MONTHLY_EXAM.en;
  const lbData = LEADERBOARD[lang] ?? LEADERBOARD.en;
  const pastExams = PAST_EXAMS[lang] ?? [];
  const daysRemaining = Math.max(0, STREAK_TARGET - STREAK_COUNT);
  const listRows = lbTab === 'All' ? lbData.rest : lbData.myCountry;

  function handleRegister() {
    Alert.alert(
      'Payments coming soon',
      'Online payment will be required to register for monthly exams. Stay tuned!',
      [{ text: 'Got it' }],
    );
  }

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Exams & Rankings</Text>

        {/* ── Language selector ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillScroll} contentContainerStyle={s.pillRow}>
          {LANGUAGES.map(code => {
            const names = getLangNames(code);
            const active = lang === code;
            return (
              <TouchableOpacity
                key={code}
                style={[s.pill, active && s.pillActive]}
                onPress={() => setLang(code)}
                activeOpacity={0.75}
              >
                <Text style={s.pillFlag}>{names.flag}</Text>
                <View style={s.pillTextBlock}>
                  <Text style={[s.pillNative, active && s.pillNativeActive]}>{names.native}</Text>
                  {names.english !== names.native && (
                    <Text style={[s.pillEnglish, active && s.pillEnglishActive]}>{names.english}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Monthly exam card ── */}
        <View style={s.monthlyCard}>
          <View style={s.monthlyTop}>
            <View style={[s.monthlyBadge, { backgroundColor: monthlyExam.examColor + '33' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <TrophyIcon size={14} color={Colors.white} />
                <Text style={s.monthlyBadgeText}>Monthly Exam</Text>
              </View>
            </View>
          </View>
          <Text style={s.monthlyTitle}>{monthlyExam.title}</Text>

          <View style={s.monthlyStats}>
            <View style={s.monthlyStat}>
              <Text style={s.monthlyStatNum}>{monthlyExam.registered.toLocaleString()}</Text>
              <Text style={s.monthlyStatLabel}>Registered</Text>
            </View>
            <View style={s.monthlyStatDiv} />
            <View style={s.monthlyStat}>
              <Text style={s.monthlyStatNum}>{monthlyExam.fee}</Text>
              <Text style={s.monthlyStatLabel}>Entry fee</Text>
            </View>
            <View style={s.monthlyStatDiv} />
            <View style={s.monthlyStat}>
              <CalendarIcon size={18} color={Colors.white} />
              <Text style={s.monthlyStatLabel}>{monthlyExam.date}</Text>
            </View>
          </View>

          {EXAMS_UNLOCKED ? (
            <View style={s.monthlyUnlocked}>
              <View style={s.unlockedBadge}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CheckIcon size={14} color={Colors.green} />
                  <Text style={s.unlockedText}>Exam unlocked</Text>
                </View>
              </View>
              <TouchableOpacity style={s.registerBtn} onPress={handleRegister} activeOpacity={0.85}>
                <Text style={s.registerBtnText}>Register for {monthlyExam.fee}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={s.lockedRow}>
              <LockIcon size={18} color="rgba(255,255,255,0.65)" />
              <Text style={s.lockedText}>{daysRemaining} more streak days to unlock</Text>
            </View>
          )}
        </View>

        {/* ── Leaderboard ── */}
        <View style={s.lbCard}>
          <View style={s.lbHeader}>
            <View>
              <Text style={s.sectionTitle}>Weekly champions</Text>
              <Text style={s.lbSubtitle}>847 students · resets Monday</Text>
            </View>
            <View style={s.lbTabs}>
              {LB_TABS.map(t => (
                <TouchableOpacity
                  key={t}
                  style={[s.lbTab, lbTab === t && s.lbTabActive]}
                  onPress={() => setLbTab(t)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.lbTabText, lbTab === t && s.lbTabTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Podium — only show in All tab */}
          {lbTab === 'All' && <Podium top3={lbData.top3} />}

          {/* List rows */}
          <View style={s.lbList}>
            {listRows.map(entry => <LBRow key={entry.rank} entry={entry} />)}
          </View>

          {/* Your row — always pinned */}
          <LBRow entry={lbData.you} you />
        </View>

        {/* ── Past exam results ── */}
        {pastExams.length > 0 && (
          <>
            <Text style={s.sectionTitle}>Your exam history</Text>
            <View style={s.historyCard}>
              {pastExams.map((exam, i) => (
                <View key={i} style={[s.historyRow, i < pastExams.length - 1 && s.historyBorder]}>
                  <View style={s.historyLeft}>
                    <Text style={s.historyMonth}>{exam.month}</Text>
                    <Text style={s.historyExam}>{exam.exam}</Text>
                  </View>
                  <View style={s.historyRight}>
                    <Text style={s.historyBand}>{exam.band.toFixed(1)}</Text>
                    <Text style={s.historyRank}>Rank #{exam.rank}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {pastExams.length === 0 && (
          <EmptyState
            iconComponent={<CheckIcon size={28} color={Colors.ink3} />}
            title="No exams yet"
            subtitle="Build a 40-day streak to unlock monthly exams"
          />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: H_PAD, gap: 16 },
  title: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30, color: Colors.ink },

  pillScroll: { marginHorizontal: -H_PAD },
  pillRow: { flexDirection: 'row', gap: 8, paddingHorizontal: H_PAD },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 99, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  pillFlag: { fontSize: 16 },
  pillTextBlock: { gap: 0 },
  pillNative: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  pillNativeActive: { color: Colors.white },
  pillEnglish: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  pillEnglishActive: { color: 'rgba(255,255,255,0.65)' },

  monthlyCard: {
    backgroundColor: '#1A1A2E', borderRadius: 22,
    padding: 20, gap: 14,
  },
  monthlyTop: {},
  monthlyBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  monthlyBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white },
  monthlyTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: Colors.white, lineHeight: 28 },
  monthlyStats: { flexDirection: 'row', alignItems: 'center' },
  monthlyStat: { flex: 1, alignItems: 'center', gap: 2 },
  monthlyStatNum: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },
  monthlyStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.5)' },
  monthlyStatDiv: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },
  monthlyUnlocked: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  unlockedBadge: {
    flex: 1,
    backgroundColor: Colors.green + '33', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 12,
  },
  unlockedText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.green },
  registerBtn: {
    flex: 1, backgroundColor: Colors.p, borderRadius: 10,
    paddingVertical: 10, alignItems: 'center',
  },
  registerBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.white },
  lockedRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 14,
  },
  lockedText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,0.65)' },

  lbCard: {
    backgroundColor: Colors.white,
    borderRadius: 22, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden', paddingTop: 18,
  },
  lbHeader: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 16, marginBottom: 16,
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  lbSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  lbTabs: {
    flexDirection: 'row', backgroundColor: Colors.bg2,
    borderRadius: 8, padding: 2, gap: 2,
  },
  lbTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  lbTabActive: { backgroundColor: Colors.white },
  lbTabText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.ink3 },
  lbTabTextActive: { fontFamily: 'Inter_700Bold', color: Colors.ink, fontSize: 11 },
  lbList: {},

  historyCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  historyBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  historyLeft: { flex: 1 },
  historyMonth: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  historyExam: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  historyRight: { alignItems: 'flex-end' },
  historyBand: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: Colors.p },
  historyRank: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  emptyHistory: {
    backgroundColor: Colors.bg2, borderRadius: 14, padding: 20, alignItems: 'center',
  },
  emptyHistoryText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center' },
});
