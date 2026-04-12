import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { BandScore } from '@/components/ui/BandScore';
import { LanguageCard } from '@/components/ui/LanguageCard';
import { ScoreBar } from '@/components/ui/ScoreBar';

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_H_PAD = 20;

// ── Mock data ────────────────────────────────────────────────────────────────
const USER = { name: 'Ahmed', avatar: '🧑‍💼' };
const STATS = { bandScore: 7.5, languages: 3, globalRank: 1284 };
const STREAK = { current: 22, target: 40 };

const LANGUAGES = [
  {
    name: 'English',
    nativeName: 'English',
    flag: 'https://flagcdn.com/w80/gb.png',
    fluency: 88,
    badges: [
      { name: 'IELTS', color: Colors.p, bgColor: Colors.p_soft },
      { name: 'TOEFL', color: Colors.green, bgColor: Colors.green_bg },
    ],
  },
  {
    name: 'Spanish',
    nativeName: 'Español',
    flag: 'https://flagcdn.com/w80/es.png',
    fluency: 55,
    badges: [{ name: 'DELE', color: Colors.orange, bgColor: Colors.orange_bg }],
  },
  {
    name: 'French',
    nativeName: 'Français',
    flag: 'https://flagcdn.com/w80/fr.png',
    fluency: 30,
    badges: [{ name: 'DELF', color: Colors.gold, bgColor: Colors.gold_bg }],
  },
];

const PRACTICE_CARDS = [
  {
    key: 'speaking',
    icon: '🎙',
    title: 'Speaking',
    subtitle: 'AI conversation partner',
    hero: true,
    bg: Colors.p,
    textColor: Colors.white,
  },
  {
    key: 'writing',
    icon: '✏️',
    title: 'Writing',
    subtitle: 'Essays & tasks',
    bg: Colors.gold_bg,
    textColor: Colors.gold,
  },
  {
    key: 'listening',
    icon: '🎧',
    title: 'Listening',
    subtitle: 'Audio comprehension',
    bg: Colors.green_bg,
    textColor: Colors.green,
  },
  {
    key: 'reading',
    icon: '📖',
    title: 'Reading',
    subtitle: 'Passages & questions',
    bg: Colors.orange_bg,
    textColor: Colors.orange,
  },
  {
    key: 'free',
    icon: '✨',
    title: 'Free Mode',
    subtitle: 'No time limit',
    bg: Colors.p_soft,
    textColor: Colors.p,
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Sara L.', score: 8.5, avatar: '👩', isYou: false },
  { rank: 2, name: 'Carlos M.', score: 8.2, avatar: '🧑', isYou: false },
  { rank: 3, name: 'Yuki T.', score: 8.0, avatar: '👨', isYou: false },
  { rank: 4, name: 'Priya K.', score: 7.8, avatar: '👩', isYou: false },
  { rank: 5, name: 'Ahmed', score: 7.5, avatar: '🧑‍💼', isYou: true },
];

const MONTHLY_EXAM = {
  name: 'IELTS Academic',
  date: 'May 15, 2026',
  registeredCount: 2841,
  streakRequired: 30,
  daysLeft: 33,
  sections: [
    { label: 'Speaking', score: 7.5, max: 9, color: Colors.p },
    { label: 'Writing', score: 6.5, max: 9, color: Colors.gold },
    { label: 'Listening', score: 8.0, max: 9, color: Colors.green },
    { label: 'Reading', score: 7.5, max: 9, color: Colors.orange },
  ],
};

// ── Sub-components ────────────────────────────────────────────────────────────
function Header() {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.logo}>
          Fluent<Text style={styles.logoAccent}>ra</Text>
        </Text>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.iconBtnText}>🔔</Text>
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{USER.avatar}</Text>
        </View>
      </View>
    </View>
  );
}

function Greeting() {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <View style={styles.greeting}>
      <Text style={styles.greetingText}>
        {greeting},{' '}
        <Text style={styles.greetingName}>{USER.name}.</Text>
      </Text>
      <Text style={styles.tagline}>Speak it. Score it. Own it.</Text>
    </View>
  );
}

function StatsRow() {
  return (
    <View style={styles.statsRow}>
      <View style={[styles.statCard, styles.statCardPurple]}>
        <Text style={[styles.statValue, styles.statValueWhite]}>
          <Text style={styles.statDMSerif}>{STATS.bandScore.toFixed(1)}</Text>
        </Text>
        <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.75)' }]}>Band Score</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>
          <Text style={styles.statDMSerifInk}>{STATS.languages}</Text>
        </Text>
        <Text style={styles.statLabel}>Languages</Text>
      </View>
      <View style={styles.statCard}>
        <Text style={styles.statValue}>
          <Text style={styles.statDMSerifInk}>#{STATS.globalRank.toLocaleString()}</Text>
        </Text>
        <Text style={styles.statLabel}>Global Rank</Text>
      </View>
    </View>
  );
}

function StreakBar() {
  const progress = STREAK.current / STREAK.target;
  const remaining = STREAK.target - STREAK.current;
  return (
    <Card style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <Text style={styles.streakTitle}>🔥 {STREAK.current}-day streak</Text>
        <Text style={styles.streakSubtitle}>{remaining} days to unlock monthly exam</Text>
      </View>
      <ProgressBar progress={progress} color={Colors.orange} trackColor={Colors.orange_bg} height={8} />
      <Text style={styles.streakHint}>{STREAK.current}/{STREAK.target} days</Text>
    </Card>
  );
}

function LanguageScroll() {
  return (
    <View>
      <SectionHeader title="My Languages" action="Manage" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.langScrollContent}
      >
        {LANGUAGES.map((lang) => (
          <LanguageCard
            key={lang.name}
            flagSource={{ uri: lang.flag }}
            name={lang.name}
            nativeName={lang.nativeName}
            fluency={lang.fluency}
            examBadges={lang.badges}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function PracticeSection() {
  const hero = PRACTICE_CARDS[0];
  const grid = PRACTICE_CARDS.slice(1);
  return (
    <View>
      <SectionHeader title="Practice" action="See all" />
      {/* Hero card */}
      <TouchableOpacity
        activeOpacity={0.88}
        style={[styles.practiceHero, { backgroundColor: hero.bg }]}
      >
        <View style={styles.practiceHeroInner}>
          <Text style={styles.practiceHeroIcon}>{hero.icon}</Text>
          <View style={styles.practiceHeroText}>
            <Text style={[styles.practiceHeroTitle, { color: hero.textColor }]}>{hero.title}</Text>
            <Text style={[styles.practiceHeroSub, { color: 'rgba(255,255,255,0.75)' }]}>{hero.subtitle}</Text>
          </View>
          <View style={styles.practiceHeroCta}>
            <Text style={styles.practiceHeroCtaText}>Start →</Text>
          </View>
        </View>
      </TouchableOpacity>
      {/* 2×2 grid */}
      <View style={styles.practiceGrid}>
        {grid.map((card) => (
          <TouchableOpacity
            key={card.key}
            activeOpacity={0.85}
            style={[styles.practiceGridCard, { backgroundColor: card.bg }]}
          >
            <Text style={styles.practiceGridIcon}>{card.icon}</Text>
            <Text style={[styles.practiceGridTitle, { color: card.textColor }]}>{card.title}</Text>
            <Text style={[styles.practiceGridSub, { color: card.textColor, opacity: 0.7 }]}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function LeaderboardCard() {
  const top3 = LEADERBOARD.slice(0, 3);
  const rest = LEADERBOARD.slice(3);
  const podiumColors = [Colors.gold, Colors.ink4, Colors.orange];
  const podiumLabels = ['1st', '2nd', '3rd'];

  return (
    <View>
      <SectionHeader title="Leaderboard" action="Full board" />
      <Card padding={16}>
        {/* Podium */}
        <View style={styles.podium}>
          {[top3[1], top3[0], top3[2]].map((entry, i) => {
            const realRank = i === 0 ? 2 : i === 1 ? 1 : 3;
            const color = podiumColors[realRank - 1];
            const heights = [64, 84, 52];
            return (
              <View key={entry.name} style={styles.podiumSlot}>
                <Text style={styles.podiumAvatar}>{entry.avatar}</Text>
                <Text style={styles.podiumName}>{entry.name.split(' ')[0]}</Text>
                <Text style={[styles.podiumScore, { color }]}>{entry.score}</Text>
                <View style={[styles.podiumBlock, { height: heights[i], backgroundColor: color + '22' }]}>
                  <Text style={[styles.podiumRank, { color }]}>{podiumLabels[realRank - 1]}</Text>
                </View>
              </View>
            );
          })}
        </View>
        {/* Ranked rows */}
        {rest.map((entry) => (
          <View
            key={entry.name}
            style={[styles.lbRow, entry.isYou && styles.lbRowYou]}
          >
            <Text style={styles.lbRank}>#{entry.rank}</Text>
            <Text style={styles.lbAvatar}>{entry.avatar}</Text>
            <Text style={[styles.lbName, entry.isYou && { color: Colors.p, fontFamily: 'Inter_700Bold' }]}>
              {entry.name} {entry.isYou && '(You)'}
            </Text>
            <Text style={[styles.lbScore, entry.isYou && { color: Colors.p }]}>{entry.score}</Text>
          </View>
        ))}
      </Card>
    </View>
  );
}

function MonthlyExamCard() {
  return (
    <View>
      <SectionHeader title="Monthly Exam" action="Details" />
      <View style={styles.examCard}>
        <View style={styles.examCardTop}>
          <View>
            <Text style={styles.examName}>{MONTHLY_EXAM.name}</Text>
            <Text style={styles.examDate}>📅 {MONTHLY_EXAM.date}</Text>
          </View>
          <View style={styles.examBadge}>
            <Text style={styles.examBadgeText}>{MONTHLY_EXAM.daysLeft}d left</Text>
          </View>
        </View>
        <View style={styles.examStats}>
          <View style={styles.examStat}>
            <Text style={styles.examStatNum}>{MONTHLY_EXAM.registeredCount.toLocaleString()}</Text>
            <Text style={styles.examStatLabel}>Registered</Text>
          </View>
          <View style={styles.examStatDivider} />
          <View style={styles.examStat}>
            <Text style={styles.examStatNum}>🔥 {MONTHLY_EXAM.streakRequired}</Text>
            <Text style={styles.examStatLabel}>Streak req.</Text>
          </View>
        </View>
        <View style={styles.examScores}>
          {MONTHLY_EXAM.sections.map((s) => (
            <ScoreBar key={s.label} label={s.label} score={s.score} maxScore={s.max} color={s.color} />
          ))}
        </View>
        <TouchableOpacity style={styles.examCta} activeOpacity={0.85}>
          <Text style={styles.examCtaText}>Register for exam →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && (
        <TouchableOpacity>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <Greeting />
        <StatsRow />
        <StreakBar />
        <LanguageScroll />
        <PracticeSection />
        <LeaderboardCard />
        <MonthlyExamCard />
        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: CARD_H_PAD, gap: 20, paddingTop: 8 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  logo: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 26,
    color: Colors.ink,
  },
  logoAccent: { color: Colors.p },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: { fontSize: 18 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.p_soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.p,
  },
  avatarEmoji: { fontSize: 20 },

  // Greeting
  greeting: { gap: 4 },
  greetingText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 22,
    color: Colors.ink,
  },
  greetingName: { fontFamily: 'Inter_700Bold' },
  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.ink3,
  },

  // Stats row
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    gap: 4,
  },
  statCardPurple: { backgroundColor: Colors.p, borderColor: Colors.p },
  statValue: { alignItems: 'center' },
  statValueWhite: {},
  statDMSerif: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 30,
    color: Colors.white,
  },
  statDMSerifInk: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 26,
    color: Colors.ink,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.ink3,
    textAlign: 'center',
  },

  // Streak
  streakCard: { gap: 10 },
  streakHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  streakSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  streakHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.ink3,
    textAlign: 'right',
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.ink,
  },
  sectionAction: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.p,
  },

  // Language scroll
  langScrollContent: {
    gap: 12,
    paddingHorizontal: 2,
    paddingBottom: 4,
  },

  // Practice hero
  practiceHero: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
  },
  practiceHeroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  practiceHeroIcon: { fontSize: 40 },
  practiceHeroText: { flex: 1 },
  practiceHeroTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.white,
  },
  practiceHeroSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  practiceHeroCta: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  practiceHeroCtaText: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
    fontSize: 14,
  },

  // Practice grid
  practiceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  practiceGridCard: {
    width: (SCREEN_W - CARD_H_PAD * 2 - 12) / 2,
    borderRadius: 16,
    padding: 16,
    gap: 6,
  },
  practiceGridIcon: { fontSize: 28 },
  practiceGridTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  practiceGridSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
  },

  // Leaderboard
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
    paddingTop: 8,
  },
  podiumSlot: { alignItems: 'center', flex: 1 },
  podiumAvatar: { fontSize: 26, marginBottom: 4 },
  podiumName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.ink2,
    marginBottom: 2,
  },
  podiumScore: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 18,
    marginBottom: 4,
  },
  podiumBlock: {
    width: '100%',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 6,
  },
  podiumRank: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  lbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 10,
  },
  lbRowYou: {
    backgroundColor: Colors.p_soft,
    marginHorizontal: -16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderTopWidth: 0,
    marginVertical: 2,
  },
  lbRank: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.ink3,
    width: 28,
  },
  lbAvatar: { fontSize: 22 },
  lbName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.ink,
    flex: 1,
  },
  lbScore: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 18,
    color: Colors.ink2,
  },

  // Monthly exam card
  examCard: {
    backgroundColor: Colors.ink,
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  examCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  examName: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 22,
    color: Colors.white,
  },
  examDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  examBadge: {
    backgroundColor: Colors.p,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
  },
  examBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.white,
  },
  examStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  examStat: { alignItems: 'center', gap: 2 },
  examStatNum: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.white,
  },
  examStatLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
  examStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  examScores: { gap: 10 },
  examCta: {
    backgroundColor: Colors.p,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  examCtaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.white,
  },
});
