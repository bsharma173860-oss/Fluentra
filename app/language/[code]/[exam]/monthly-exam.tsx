import React from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import {
  CameraIcon, GlobeIcon, TimerIcon, CheckIcon, FlameIcon, TrophyIcon, type IconProps,
} from '@/components/icons';

type IC = React.ComponentType<IconProps>;

const MOCK_TOP_3 = [
  { rank: 1, name: 'Sara A.',     score: 8.5, band: '8.5', initial: 'S' },
  { rank: 2, name: 'Mohamed K.', score: 8.0, band: '8.0', initial: 'M' },
  { rank: 3, name: 'Jana P.',     score: 7.5, band: '7.5', initial: 'J' },
];

function OneIcon() {
  return (
    <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.ink3, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 10, color: '#FFF' }}>1</Text>
    </View>
  );
}

const EXAM_RULES: { Icon: IC | (() => React.ReactElement); text: string }[] = [
  { Icon: CameraIcon, text: 'Face detection required throughout — no leaving the camera' },
  { Icon: OneIcon,    text: 'One attempt only — results are final and cannot be retaken' },
  { Icon: GlobeIcon,  text: 'Public results — your score appears on the leaderboard' },
  { Icon: TimerIcon,  text: 'Strictly timed — each module starts automatically' },
];

export default function MonthlyExam() {
  const { code, exam } = useLocalSearchParams<{ code: string; exam: string }>();
  const profiles = LANGUAGE_EXAMS[code ?? 'en'] ?? [];
  const examProfile = profiles.find(e => e.id === exam) ?? profiles[0];

  function handleRegister() {
    Alert.alert(
      'Payments coming soon',
      'Online payment (Day 13) will be required to register for monthly exams. Stay tuned!',
      [{ text: 'Got it', style: 'default' }]
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Monthly Exam</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero dark card */}
        <View style={s.heroCard}>
          <View style={[s.examTag, { backgroundColor: examProfile?.bg ?? Colors.p_soft }]}>
            <Text style={[s.examTagText, { color: examProfile?.color ?? Colors.p }]}>
              {examProfile?.name ?? exam?.toUpperCase()}
            </Text>
          </View>
          <Text style={s.heroMonth}>April 2026</Text>
          <Text style={s.heroSub}>Monthly Practice Exam</Text>

          <View style={s.heroMeta}>
            <View style={s.metaChip}>
              <Text style={s.metaChipText}>$5 entry</Text>
            </View>
            <View style={s.metaChip}>
              <Text style={s.metaChipText}>847 registered</Text>
            </View>
            <View style={s.metaChip}>
              <TimerIcon size={11} color="rgba(255,255,255,0.75)" />
              <Text style={s.metaChipText}>Apr 26, 2026</Text>
            </View>
          </View>
        </View>

        {/* Streak unlock status */}
        <View style={s.streakCard}>
          <View style={s.streakLeft}>
            <View style={s.streakCheck}><CheckIcon size={14} color={Colors.white} /></View>
            <View>
              <Text style={s.streakTitle}>Streak requirement met</Text>
              <Text style={s.streakSub}>You have a 9+ day streak — exam is unlocked</Text>
            </View>
          </View>
          <View style={s.streakBadge}><FlameIcon size={16} color={Colors.orange} /><Text style={s.streakBadgeText}> 9+</Text></View>
        </View>

        {/* Leaderboard preview */}
        <View style={s.lbCard}>
          <Text style={s.lbTitle}>Last month's top 3</Text>
          <View style={s.podium}>
            {[MOCK_TOP_3[1], MOCK_TOP_3[0], MOCK_TOP_3[2]].map(p => {
              const isFirst = p.rank === 1;
              return (
                <View key={p.rank} style={[s.podiumItem, isFirst && s.podiumItemFirst]}>
                  {isFirst && <TrophyIcon size={20} color={Colors.gold} />}
                  <View style={[s.podiumAvatar, isFirst && s.podiumAvatarFirst]}>
                    <Text style={[s.podiumInitial, isFirst && { fontSize: 20 }]}>{p.initial}</Text>
                  </View>
                  <Text style={s.podiumName}>{p.name.split(' ')[0]}</Text>
                  <Text style={[s.podiumScore, isFirst && { color: Colors.gold }]}>{p.band}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Exam rules */}
        <View style={s.rulesCard}>
          <Text style={s.rulesTitle}>Exam conditions</Text>
          {EXAM_RULES.map(rule => (
            <View key={rule.text} style={s.ruleRow}>
              <View style={s.ruleIconWrap}><rule.Icon size={18} color={Colors.ink2} /></View>
              <Text style={s.ruleText}>{rule.text}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Pinned bottom CTA */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={s.registerBtn}
          onPress={handleRegister}
          activeOpacity={0.88}
        >
          <Text style={s.registerBtnText}>Register for $5 →</Text>
          <Text style={s.registerBtnSub}>Payments enabled Day 13</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.practiceLink}
          onPress={() =>
            router.replace(`/language/${code}/${exam}/exam-entry` as any)
          }
        >
          <Text style={s.practiceLinkText}>Practice the full exam first →</Text>
        </TouchableOpacity>
      </View>
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

  heroCard: { backgroundColor: '#1A1A2E', borderRadius: 22, padding: 22, gap: 8 },
  examTag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  examTagText: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 0.5 },
  heroMonth: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: Colors.white, marginTop: 4 },
  heroSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.55)' },
  heroMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  metaChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  metaChipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.75)' },

  streakCard: {
    backgroundColor: Colors.green_bg, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.green + '55',
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  streakCheck: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: Colors.green, alignItems: 'center', justifyContent: 'center',
  },
  streakTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.green },
  streakSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.green, opacity: 0.8, marginTop: 2 },
  streakBadge: { flexDirection: 'row', alignItems: 'center' },
  streakBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.orange },

  lbCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 18,
  },
  lbTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink, marginBottom: 16 },
  podium: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 16 },
  podiumItem: { alignItems: 'center', gap: 6, flex: 1 },
  podiumItemFirst: { marginBottom: 8 },
  crown: { fontSize: 20 },
  podiumAvatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.bg2, borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  podiumAvatarFirst: {
    width: 62, height: 62, borderRadius: 31,
    backgroundColor: Colors.gold_bg, borderColor: Colors.gold,
  },
  podiumInitial: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  podiumName: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink, textAlign: 'center' },
  podiumScore: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.p },

  rulesCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 18, gap: 12,
  },
  rulesTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  ruleRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  ruleIconWrap: { width: 26, alignItems: 'center', paddingTop: 2 },
  ruleText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2, flex: 1 },

  bottomBar: {
    padding: 20, paddingBottom: 32, gap: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  registerBtn: {
    backgroundColor: Colors.p, borderRadius: 16,
    paddingVertical: 14, alignItems: 'center', gap: 3,
    opacity: 0.7,
  },
  registerBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white },
  registerBtnSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  practiceLink: { alignItems: 'center', paddingVertical: 6 },
  practiceLinkText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.p },
});
