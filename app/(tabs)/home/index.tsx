import React from 'react';
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

const { width: W } = Dimensions.get('window');
const H_PAD = 20;

// ── Types ─────────────────────────────────────────────────────
type ModuleCard = {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  hero: boolean;
  bg: string;
  textColor: string;
  route: string;
};

const MODULES: ModuleCard[] = [
  {
    key: 'speaking',
    icon: '🎙',
    title: 'Speaking',
    subtitle: 'AI conversation partner',
    hero: true,
    bg: Colors.p,
    textColor: Colors.white,
    route: '/(tabs)/practice',
  },
  {
    key: 'writing',
    icon: '✏️',
    title: 'Writing',
    subtitle: 'Essays & tasks',
    hero: false,
    bg: Colors.gold_bg,
    textColor: Colors.gold,
    route: '/(tabs)/practice',
  },
  {
    key: 'listening',
    icon: '🎧',
    title: 'Listening',
    subtitle: 'Audio comprehension',
    hero: false,
    bg: Colors.green_bg,
    textColor: Colors.green,
    route: '/(tabs)/practice',
  },
  {
    key: 'reading',
    icon: '📖',
    title: 'Reading',
    subtitle: 'Passages & questions',
    hero: false,
    bg: Colors.orange_bg,
    textColor: Colors.orange,
    route: '/(tabs)/practice',
  },
];

// ── Mock stats (replace with Supabase queries once schema is live) ─
const MOCK = {
  bandScore: 7.5,
  languages: 3,
  globalRank: 1284,
  streakCount: 22,
  streakTarget: 40,
};

// ── Sub-components ────────────────────────────────────────────
function Header({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <View style={s.header}>
      {/* Logo */}
      <Text style={s.logo}>
        Fluent<Text style={s.ra}>ra</Text>
      </Text>
      {/* Icons */}
      <View style={s.headerRight}>
        <TouchableOpacity style={s.iconBtn}>
          <Text style={s.iconEmoji}>🔔</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.avatarBtn} onPress={() => router.push('/(tabs)/profile')}>
          <Text style={s.avatarEmoji}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* Greeting row — placed below via absolute is messy; keep in flow */}
    </View>
  );
}

function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  return (
    <View style={s.greetingWrap}>
      <Text style={s.greetingText}>
        {greeting},{' '}
        <Text style={s.greetingName}>{name || 'there'}.</Text>
      </Text>
      <Text style={s.tagline}>Speak it. Score it. Own it.</Text>
    </View>
  );
}

function StatsRow() {
  return (
    <View style={s.statsRow}>
      {/* Band score — purple card */}
      <View style={[s.statCard, s.statCardPurple]}>
        <Text style={s.statNumWhite}>{MOCK.bandScore.toFixed(1)}</Text>
        <Text style={s.statLabelWhite}>Band Score</Text>
      </View>
      {/* Languages */}
      <View style={s.statCard}>
        <Text style={s.statNum}>{MOCK.languages}</Text>
        <Text style={s.statLabel}>Languages</Text>
      </View>
      {/* Global rank */}
      <View style={s.statCard}>
        <Text style={s.statNum}>#{MOCK.globalRank.toLocaleString()}</Text>
        <Text style={s.statLabel}>Global Rank</Text>
      </View>
    </View>
  );
}

function StreakBar() {
  const pct = MOCK.streakCount / MOCK.streakTarget;
  const remaining = MOCK.streakTarget - MOCK.streakCount;
  return (
    <View style={s.streakCard}>
      <View style={s.streakTop}>
        <Text style={s.streakTitle}>
          🔥 {MOCK.streakCount}-day streak
        </Text>
        <Text style={s.streakRight}>{MOCK.streakCount}/{MOCK.streakTarget}</Text>
      </View>
      <Text style={s.streakSub}>{remaining} days to unlock monthly exam</Text>
      <ProgressBar
        progress={pct}
        color={Colors.orange}
        trackColor={Colors.orange_bg}
        height={8}
        animated
      />
    </View>
  );
}

function ModuleCards() {
  const hero = MODULES[0];
  const grid = MODULES.slice(1);
  const gridCardW = (W - H_PAD * 2 - 12) / 2;

  return (
    <View style={s.modulesWrap}>
      <View style={s.sectionRow}>
        <Text style={s.sectionTitle}>Practice</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/practice')}>
          <Text style={s.sectionLink}>See all</Text>
        </TouchableOpacity>
      </View>

      {/* Hero — Speaking, full width, purple */}
      <TouchableOpacity
        style={[s.heroCard, { backgroundColor: hero.bg }]}
        onPress={() => router.push(hero.route as any)}
        activeOpacity={0.88}
      >
        <View style={s.heroInner}>
          <Text style={s.heroIcon}>{hero.icon}</Text>
          <View style={s.heroText}>
            <Text style={[s.heroTitle, { color: hero.textColor }]}>{hero.title}</Text>
            <Text style={[s.heroSub, { color: 'rgba(255,255,255,0.72)' }]}>{hero.subtitle}</Text>
          </View>
          <View style={s.heroCta}>
            <Text style={s.heroCtaText}>Start →</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 2×2 grid */}
      <View style={s.grid}>
        {grid.map(card => (
          <TouchableOpacity
            key={card.key}
            style={[s.gridCard, { backgroundColor: card.bg, width: gridCardW }]}
            onPress={() => router.push(card.route as any)}
            activeOpacity={0.85}
          >
            <Text style={s.gridIcon}>{card.icon}</Text>
            <Text style={[s.gridTitle, { color: card.textColor }]}>{card.title}</Text>
            <Text style={[s.gridSub, { color: card.textColor, opacity: 0.7 }]}>{card.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────
export default function HomeScreen() {
  const { profile } = useAuth();
  const displayName = profile?.name ?? '';

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <Header name={displayName} />
        <Greeting name={displayName} />
        <StatsRow />
        <StreakBar />
        <ModuleCards />
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1 },
  content: { paddingHorizontal: H_PAD, paddingTop: 8, gap: 20 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink },
  ra: { color: Colors.p },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  iconEmoji: { fontSize: 18 },
  avatarBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: Colors.p_soft,
    borderWidth: 2, borderColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 20 },

  // Greeting
  greetingWrap: { gap: 4 },
  greetingText: { fontFamily: 'Inter_400Regular', fontSize: 22, color: Colors.ink },
  greetingName: { fontFamily: 'Inter_700Bold' },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  // Stats
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
  statNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: Colors.ink },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, textAlign: 'center' },
  statNumWhite: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26, color: Colors.white },
  statLabelWhite: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.75)', textAlign: 'center' },

  // Streak
  streakCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  streakTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  streakTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  streakRight: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  streakSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: -2 },

  // Modules
  modulesWrap: { gap: 12 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  sectionLink: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },

  heroCard: { borderRadius: 20, padding: 20 },
  heroInner: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  heroIcon: { fontSize: 44 },
  heroText: { flex: 1 },
  heroTitle: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  heroSub: { fontFamily: 'Inter_400Regular', fontSize: 13, marginTop: 3 },
  heroCta: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 10,
  },
  heroCtaText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridCard: { borderRadius: 16, padding: 16, gap: 6 },
  gridIcon: { fontSize: 28 },
  gridTitle: { fontFamily: 'Inter_700Bold', fontSize: 15 },
  gridSub: { fontFamily: 'Inter_400Regular', fontSize: 12 },
});
