import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WritingSidebar } from '@/components/layout/WritingSidebar';
import { getTodaysTask2 } from '@/constants/dailyContent';
import { getExamsForLanguage } from '@/constants/languageExams';
import { getExamFormat } from '@/constants/examFormats';
import { checkRateLimit, incrementUsage } from '@/lib/api';

const GOLD     = '#B07A10';
const GOLD_BG  = '#FEF9EC';
const GOLD_BDR = '#F0E4C0';

// Route mapping by task index position
const TASK_ROUTES = ['/modules/writing/task1', '/modules/writing/task2'];

export default function WritingSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;
  const exams     = getExamsForLanguage(langCode);
  const [exam, setExam] = useState(exams[0].id);

  const format   = getExamFormat(exam, 'writing');
  const tasks    = format?.tasks ?? [];
  const criteria = format?.scoringCriteria ?? [];

  const todaysTask2 = getTodaysTask2();
  const showTodaysPrompts = exam === 'ielts';
  const [checking, setChecking] = useState(false);

  async function startTask(route: string) {
    if (checking) return;
    setChecking(true);
    try {
      const check = await checkRateLimit('writing');
      if (!check.allowed) {
        Alert.alert(
          'Daily limit reached',
          `You have used all your writing sessions for today.\n${check.plan === 'free' ? 'Upgrade to Pro for 5 sessions/day.' : 'Resets at midnight.'}`,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Upgrade', onPress: () => router.push('/upgrade' as any) },
          ]
        );
        return;
      }
      await incrementUsage('writing');
      router.push({ pathname: route as any, params: { languageCode: langCode, code: langCode, exam, examId: exam } });
    } finally {
      setChecking(false);
    }
  }

  const content = (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          {!isDesktop && (
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
              <Text style={s.backArrow}>←</Text>
            </TouchableOpacity>
          )}
          <View>
            <Text style={s.headerTitle}>Writing Practice</Text>
            <Text style={s.headerSub}>
              {format?.scoreRange ? `Score range: ${format.scoreRange}` : 'Choose a task type to begin'}
            </Text>
          </View>
        </View>

        {/* ── Exam selector ── */}
        <View style={s.examRow}>
          {exams.map(e => {
            const active = exam === e.id;
            return (
              <TouchableOpacity
                key={e.id}
                style={[s.examPill, active && { backgroundColor: e.bg, borderColor: e.border }]}
                onPress={() => setExam(e.id)}
                activeOpacity={0.8}
              >
                <Text style={[s.examPillText, {
                  color: active ? e.color : '#888',
                  fontFamily: active ? 'Inter_600SemiBold' : 'Inter_400Regular',
                }]}>{e.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── No format available ── */}
        {!format ? (
          <View style={s.emptyCard}>
            <Text style={s.emptyText}>Format details coming soon for this exam.</Text>
          </View>
        ) : null}

        {/* ── Task cards ── */}
        {tasks.length > 0 ? (
          <View style={s.taskList}>
            {tasks.map((task, i) => {
              const route = TASK_ROUTES[i] ?? TASK_ROUTES[0];
              return (
                <View key={task.id} style={s.taskCard}>

                  {/* Colored top strip */}
                  <View style={s.taskTop}>
                    <View style={s.taskTopIcon}>
                      <Text style={s.taskTopIconText}>✍</Text>
                    </View>
                    <View style={s.taskTopDots}>
                      {[0, 1, 2, 3].map(j => (
                        <View key={j} style={[s.taskTopBar, { height: 14 + j * 6, opacity: 0.3 + j * 0.15 }]} />
                      ))}
                    </View>
                  </View>

                  {/* Card body */}
                  <View style={s.taskBody}>
                    <Text style={s.taskLabel}>{task.name}</Text>
                    <Text style={s.taskDesc}>{task.instruction}</Text>

                    {/* Stat pills */}
                    <View style={s.pillRow}>
                      {task.timeMinutes ? (
                        <View style={s.pill}>
                          <Text style={s.pillText}>{task.timeMinutes} min recommended</Text>
                        </View>
                      ) : null}
                      {task.minWords ? (
                        <View style={s.pill}>
                          <Text style={s.pillText}>{task.minWords}+ words</Text>
                        </View>
                      ) : null}
                      {format?.scoreRange ? (
                        <View style={s.pill}>
                          <Text style={s.pillText}>{format.scoreRange}</Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Tips chips */}
                    {task.tips && task.tips.length > 0 ? (
                      <View style={s.tipsRow}>
                        {task.tips.map(tip => (
                          <View key={tip} style={s.tipChip}>
                            <Text style={s.tipChipText}>· {tip}</Text>
                          </View>
                        ))}
                      </View>
                    ) : null}

                    <TouchableOpacity
                      style={s.startBtn}
                      onPress={() => startTask(route)}
                      activeOpacity={0.85}
                    >
                      <Text style={s.startBtnText}>Start {task.name} →</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* ── Scoring criteria ── */}
        {criteria.length > 0 ? (
          <>
            <Text style={s.sectionLabel}>SCORING CRITERIA</Text>
            <View style={s.criteriaWrap}>
              {criteria.map(c => (
                <View key={c} style={s.criteriaPill}>
                  <Text style={s.criteriaPillText}>{c}</Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        {/* ── Today's prompts (IELTS only) ── */}
        {showTodaysPrompts ? (
          <>
            <Text style={s.sectionLabel}>TODAY'S PROMPTS</Text>
            <View style={s.promptsList}>

              <TouchableOpacity
                style={s.promptCard}
                onPress={() => startTask('/modules/writing/task2')}
                activeOpacity={0.85}
              >
                <View style={[s.typeBadge, { backgroundColor: GOLD_BG }]}>
                  <Text style={[s.typeBadgeText, { color: GOLD }]}>T2</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.promptTopic}>{todaysTask2.topic}</Text>
                  <Text style={s.promptPreview} numberOfLines={2}>{todaysTask2.prompt}</Text>
                </View>
                <Text style={s.promptCta}>Use this prompt →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={s.promptCard}
                onPress={() => startTask('/modules/writing/task1')}
                activeOpacity={0.85}
              >
                <View style={[s.typeBadge, { backgroundColor: '#EDFAF4' }]}>
                  <Text style={[s.typeBadgeText, { color: '#0A8C5A' }]}>T1</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.promptTopic}>Data Interpretation</Text>
                  <Text style={s.promptPreview} numberOfLines={2}>
                    The chart below shows the percentage of households in owned and rented accommodation between 1918 and 2011. Summarise the main features.
                  </Text>
                </View>
                <Text style={[s.promptCta, { color: '#0A8C5A' }]}>Use this prompt →</Text>
              </TouchableOpacity>

            </View>
          </>
        ) : null}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <WritingSidebar />
        <View style={{ flex: 1 }}>{content}</View>
      </View>
    );
  }

  return content;
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 16, gap: 20 },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingBottom: 4,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow:   { fontFamily: 'Inter_500Medium', fontSize: 18, color: Colors.ink },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  headerSub:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#999', marginTop: 2 },

  examRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  examPill: {
    paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: '#EAEAEA',
  },
  examPillText: { fontSize: 13 },

  emptyCard: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 24, alignItems: 'center',
  },
  emptyText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888', textAlign: 'center' },

  taskList: { gap: 16 },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden', minHeight: 200,
  },

  taskTop: {
    height: 100, backgroundColor: GOLD_BG,
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center', paddingBottom: 16, gap: 6,
  },
  taskTopIcon: {
    position: 'absolute', top: 16, left: 20,
  },
  taskTopIconText: { fontSize: 28 },
  taskTopDots: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 4,
  },
  taskTopBar: {
    width: 8, backgroundColor: GOLD, borderRadius: 2,
  },

  taskBody: { padding: 20, gap: 0 },
  taskLabel: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#000' },
  taskDesc:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888', marginTop: 6, lineHeight: 20 },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 14 },
  pill: {
    backgroundColor: '#F4F4F0', borderRadius: 4,
    paddingHorizontal: 10, paddingVertical: 2,
  },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },

  tipsRow: { marginTop: 10, gap: 4 },
  tipChip: { paddingVertical: 1 },
  tipChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888' },

  startBtn: {
    backgroundColor: GOLD, borderRadius: 10,
    paddingVertical: 12, alignItems: 'center',
    marginTop: 16,
  },
  startBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
  },

  criteriaWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  criteriaPill: {
    backgroundColor: Colors.white, borderRadius: 20,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  criteriaPillText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#555' },

  promptsList: { gap: 10 },
  promptCard: {
    backgroundColor: Colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    padding: 14, gap: 8,
  },
  typeBadge: {
    width: 28, height: 28, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start',
  },
  typeBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  promptTopic:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000' },
  promptPreview: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', lineHeight: 18, marginTop: 2 },
  promptCta:     { fontFamily: 'Inter_500Medium', fontSize: 11, color: GOLD, marginTop: 4 },
});
