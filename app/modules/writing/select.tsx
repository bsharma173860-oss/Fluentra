import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WritingSidebar } from '@/components/layout/WritingSidebar';
import { getTodaysTask2 } from '@/constants/dailyContent';

const GOLD     = '#B07A10';
const GOLD_BG  = '#FEF9EC';
const GOLD_BDR = '#F0E4C0';

const TASKS = [
  {
    key: 'task1' as const,
    label: 'Task 1 — Academic Writing',
    desc: 'Describe a graph, chart, diagram or map. Min 150 words.',
    pills: ['20 min recommended', '150+ words', 'Band 1-9'],
    btnLabel: 'Start Task 1 →',
    route: '/modules/writing/task1',
  },
  {
    key: 'task2' as const,
    label: 'Task 2 — Academic Essay',
    desc: 'Write an argumentative essay. Present both views or your opinion. Min 250 words.',
    pills: ['40 min recommended', '250+ words', 'Band 1-9'],
    btnLabel: 'Start Task 2 →',
    route: '/modules/writing/task2',
  },
];

export default function WritingSelectScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams();
  const langCode  = (params.languageCode ?? params.code ?? 'en') as string;

  const todaysTask2 = getTodaysTask2();

  function startTask(route: string) {
    router.push({ pathname: route as any, params: { languageCode: langCode, code: langCode } });
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
            <Text style={s.headerSub}>Choose a task type to begin</Text>
          </View>
        </View>

        {/* ── Task cards ── */}
        <View style={s.taskList}>
          {TASKS.map(task => (
            <View key={task.key} style={s.taskCard}>

              {/* Colored top strip */}
              <View style={s.taskTop}>
                <View style={s.taskTopIcon}>
                  <Text style={s.taskTopIconText}>✍</Text>
                </View>
                <View style={s.taskTopDots}>
                  {[0, 1, 2, 3].map(i => (
                    <View key={i} style={[s.taskTopBar, { height: 14 + i * 6, opacity: 0.3 + i * 0.15 }]} />
                  ))}
                </View>
              </View>

              {/* Card body */}
              <View style={s.taskBody}>
                <Text style={s.taskLabel}>{task.label}</Text>
                <Text style={s.taskDesc}>{task.desc}</Text>

                <View style={s.pillRow}>
                  {task.pills.map(p => (
                    <View key={p} style={s.pill}>
                      <Text style={s.pillText}>{p}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={s.startBtn}
                  onPress={() => startTask(task.route)}
                  activeOpacity={0.85}
                >
                  <Text style={s.startBtnText}>{task.btnLabel}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* ── Today's prompts ── */}
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
