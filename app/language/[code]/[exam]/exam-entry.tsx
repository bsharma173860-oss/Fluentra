import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import {
  HeadphoneIcon, BookIcon, PenIcon, MicIcon, CheckIcon, TimerIcon, type IconProps,
} from '@/components/icons';

type IC = React.ComponentType<IconProps>;

const MODULES: { Icon: IC; label: string; duration: string; color: string; bg: string }[] = [
  { Icon: HeadphoneIcon, label: 'Listening',  duration: '40 min', color: Colors.green,  bg: Colors.green_bg  },
  { Icon: BookIcon,      label: 'Reading',    duration: '60 min', color: Colors.orange, bg: Colors.orange_bg },
  { Icon: PenIcon,       label: 'Writing',    duration: '60 min', color: Colors.gold,   bg: Colors.gold_bg   },
  { Icon: MicIcon,       label: 'Speaking',   duration: '14 min', color: Colors.p,      bg: Colors.p_soft    },
];

const RULES = [
  'Audio plays once only in listening',
  'No going back to previous questions',
  'Results shown only after full completion',
  'Face detection active during speaking',
];

export default function ExamEntry() {
  const { code, exam } = useLocalSearchParams<{ code: string; exam: string }>();
  const profiles = LANGUAGE_EXAMS[code ?? 'en'] ?? [];
  const examProfile = profiles.find(e => e.id === exam) ?? profiles[0];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>Full Exam</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Exam identity card */}
        <View style={[s.examBadge, { backgroundColor: examProfile?.bg ?? Colors.p_soft }]}>
          <Text style={[s.examName, { color: examProfile?.color ?? Colors.p }]}>
            {examProfile?.name ?? exam?.toUpperCase()}
          </Text>
          <Text style={[s.examFullName, { color: examProfile?.color ?? Colors.p }]}>
            {examProfile?.fullName}
          </Text>
        </View>

        <View style={s.durationRow}>
          <Text style={s.durationNum}>~3h 14m</Text>
          <Text style={s.durationLabel}>total duration</Text>
        </View>

        {/* Module list */}
        <View style={s.moduleCard}>
          <Text style={s.moduleCardTitle}>Exam modules</Text>
          <View style={s.moduleList}>
            {MODULES.map((m, i) => (
              <React.Fragment key={m.label}>
                <View style={s.moduleRow}>
                  <View style={[s.moduleIconWrap, { backgroundColor: m.bg }]}>
                    <m.Icon size={18} color={m.color} />
                  </View>
                  <Text style={s.moduleName}>{m.label}</Text>
                  <Text style={[s.moduleDuration, { color: m.color }]}>{m.duration}</Text>
                </View>
                {i < MODULES.length - 1 && (
                  <View style={s.breakDivider}>
                    <View style={s.breakLine} />
                    <View style={s.breakChip}>
                      <TimerIcon size={11} color={Colors.ink3} />
                      <Text style={s.breakChipText}>5 min break</Text>
                    </View>
                    <View style={s.breakLine} />
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Rules */}
        <View style={s.rulesCard}>
          <Text style={s.rulesTitle}>Exam rules</Text>
          {RULES.map(rule => (
            <View key={rule} style={s.ruleRow}>
              <CheckIcon size={16} color={Colors.green} />
              <Text style={s.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Pinned bottom CTAs */}
      <View style={s.bottomBar}>
        <TouchableOpacity
          style={s.startBtn}
          onPress={() =>
            router.replace(`/language/${code}/${exam}/full-exam` as any)
          }
          activeOpacity={0.88}
        >
          <Text style={s.startBtnText}>Start Full Exam →</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.practiceLink}
          onPress={() => router.back()}
        >
          <Text style={s.practiceLinkText}>Practice instead</Text>
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

  content: { padding: 20, gap: 20 },

  examBadge: { borderRadius: 18, padding: 22, gap: 6 },
  examName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30 },
  examFullName: { fontFamily: 'Inter_400Regular', fontSize: 13, opacity: 0.75 },

  durationRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  durationNum: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.ink },
  durationLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  moduleCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 18, gap: 16,
  },
  moduleCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  moduleList: { gap: 0 },
  moduleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
  moduleIconWrap: {
    width: 38, height: 38, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  moduleIcon: { /* replaced by icon component */ },
  moduleName: { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink },
  moduleDuration: { fontFamily: 'Inter_700Bold', fontSize: 13 },

  breakDivider: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginVertical: 6, paddingLeft: 50,
  },
  breakLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  breakChip: {
    backgroundColor: Colors.gold_bg, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 3,
    flexDirection: 'row', alignItems: 'center', gap: 5,
  },
  breakChipText: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.gold },

  rulesCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 18, gap: 12,
  },
  rulesTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  ruleRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  ruleCheck: { /* replaced by CheckIcon */ },
  ruleText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2 },

  bottomBar: {
    padding: 20, paddingBottom: 32, gap: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  startBtn: {
    backgroundColor: Colors.p, borderRadius: 16, paddingVertical: 16, alignItems: 'center',
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.white },
  practiceLink: { alignItems: 'center', paddingVertical: 6 },
  practiceLinkText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },
});
