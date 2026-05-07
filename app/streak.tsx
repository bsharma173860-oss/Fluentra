import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import {
  CheckIcon, FlameIcon, LightningIcon, TrophyIcon, AwardIcon,
  GlobeIcon, StarIcon, ChartIcon, type IconProps,
} from '@/components/icons';

type IC = React.ComponentType<IconProps>;

// ─── Achievement data ──────────────────────────────────────────────────────────
type Achievement = {
  id: string;
  name: string;
  description: string;
  Icon: IC;
  iconColor: string;
  iconBg: string;
  unlocked: boolean;
  unlockedDate?: string;
};

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Complete your first practice session',
    Icon: CheckIcon,
    iconColor: Colors.green,
    iconBg: Colors.green_bg,
    unlocked: true,
    unlockedDate: 'Mar 12, 2026',
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    Icon: FlameIcon,
    iconColor: Colors.orange,
    iconBg: Colors.orange_bg,
    unlocked: true,
    unlockedDate: 'Mar 19, 2026',
  },
  {
    id: 'two_weeks',
    name: 'Two Weeks Strong',
    description: 'Maintain a 14-day streak',
    Icon: LightningIcon,
    iconColor: Colors.p,
    iconBg: Colors.p_soft,
    unlocked: true,
    unlockedDate: 'Mar 26, 2026',
  },
  {
    id: 'month_master',
    name: 'Month Master',
    description: 'Maintain a 30-day streak',
    Icon: TrophyIcon,
    iconColor: Colors.gold,
    iconBg: Colors.gold_bg,
    unlocked: false,
  },
  {
    id: 'exam_ready',
    name: 'Exam Ready',
    description: 'Complete a full practice exam',
    Icon: AwardIcon,
    iconColor: Colors.gold,
    iconBg: Colors.gold_bg,
    unlocked: false,
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Add 3 or more languages',
    Icon: GlobeIcon,
    iconColor: Colors.green,
    iconBg: Colors.green_bg,
    unlocked: false,
  },
  {
    id: 'perfect_score',
    name: 'Perfect Score',
    description: 'Score 9.0 in any module',
    Icon: StarIcon,
    iconColor: Colors.gold,
    iconBg: Colors.gold_bg,
    unlocked: false,
  },
  {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Practice every module at least once',
    Icon: ChartIcon,
    iconColor: Colors.p,
    iconBg: Colors.p_soft,
    unlocked: false,
  },
];

// ─── Achievement card ──────────────────────────────────────────────────────────
function AchievementCard({ achievement }: { achievement: Achievement }) {
  const { Icon, iconColor, iconBg, unlocked, name, description, unlockedDate } = achievement;

  if (!unlocked) {
    return (
      <View style={[s.card, s.cardLocked]}>
        <View style={s.cardLeft}>
          <View style={[s.iconCircle, s.iconCircleLocked]}>
            <Icon size={22} color="#CCC" />
          </View>
          <View style={s.cardText}>
            <Text style={[s.cardName, s.cardNameLocked]}>{name}</Text>
            <Text style={[s.cardDesc, s.cardDescLocked]}>{description}</Text>
          </View>
        </View>
        <Text style={s.lockedLabel}>Locked</Text>
      </View>
    );
  }

  return (
    <View style={s.card}>
      <View style={s.cardLeft}>
        <View style={[s.iconCircle, { backgroundColor: iconBg }]}>
          <Icon size={22} color={iconColor} />
        </View>
        <View style={s.cardText}>
          <Text style={s.cardName}>{name}</Text>
          {unlockedDate && <Text style={s.unlockedDate}>{unlockedDate}</Text>}
        </View>
      </View>
    </View>
  );
}

// ─── Streak bar ────────────────────────────────────────────────────────────────
const STREAK_DAYS = 23;
const STREAK_TARGET = 9;
const MILESTONES = [7, 9];

function StreakBar() {
  const pct = Math.min(STREAK_DAYS / STREAK_TARGET, 1) * 100;

  return (
    <View style={sb.wrap}>
      <View style={sb.header}>
        <View style={sb.labelRow}>
          <FlameIcon size={18} color="#C04A06" />
          <Text style={sb.streakNum}>{STREAK_DAYS} day streak</Text>
        </View>
        <Text style={sb.target}>{STREAK_TARGET - STREAK_DAYS} days to exam unlock</Text>
      </View>

      <View style={sb.track}>
        <View style={[sb.fill, { width: `${pct}%` as any }]} />
        {MILESTONES.map(m => {
          const mPct = (m / STREAK_TARGET) * 100;
          const reached = STREAK_DAYS >= m;
          return (
            <View key={m} style={[sb.milestone, { left: `${mPct}%` as any }]}>
              <View style={[sb.milestoneDot, reached && sb.milestoneDotReached]} />
              <Text style={[sb.milestoneLabel, reached && sb.milestoneLabelReached]}>{m}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const sb = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 18, gap: 14,
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  streakNum: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  target: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  track: {
    height: 8, backgroundColor: Colors.bg2,
    borderRadius: 4, overflow: 'visible',
    position: 'relative', marginBottom: 18,
  },
  fill: { height: '100%', backgroundColor: '#C04A06', borderRadius: 4 },
  milestone: { position: 'absolute', top: -3, alignItems: 'center', transform: [{ translateX: -6 }] },
  milestoneDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.bg2, borderWidth: 2, borderColor: Colors.border,
  },
  milestoneDotReached: { backgroundColor: '#C04A06', borderColor: '#C04A06' },
  milestoneLabel: {
    fontFamily: 'Inter_500Medium', fontSize: 10,
    color: Colors.ink4, marginTop: 4,
  },
  milestoneLabelReached: { color: '#C04A06', fontFamily: 'Inter_700Bold' },
});

// ─── Screen ────────────────────────────────────────────────────────────────────
export default function StreakScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Streak & Achievements</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <StreakBar />

        <Text style={s.sectionTitle}>Achievements</Text>
        <View style={s.achievementGrid}>
          {ACHIEVEMENTS.map(a => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 18, color: Colors.ink },
  headerTitle: {
    flex: 1, textAlign: 'center',
    fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink,
  },
  headerSpacer: { width: 36 },

  content: { padding: 20, gap: 16 },

  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },

  achievementGrid: { gap: 10 },

  card: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderWidth: 1, borderColor: '#EAEAEA',
    borderRadius: 12, padding: 16,
    minHeight: 120,
  },
  cardLocked: { backgroundColor: Colors.white, borderColor: '#EAEAEA' },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },

  iconCircle: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  iconCircleLocked: { backgroundColor: '#F4F4F4' },

  cardText: { flex: 1, gap: 4 },
  cardName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000' },
  cardNameLocked: { color: '#CCC' },
  cardDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, lineHeight: 17 },
  cardDescLocked: { color: '#DDD' },
  unlockedDate: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },
  lockedLabel: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#DDD' },
});
