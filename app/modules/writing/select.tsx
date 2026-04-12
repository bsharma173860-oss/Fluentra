import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

type Exam = 'IELTS' | 'TOEFL';

type TaskOption = {
  key: 'task1' | 'task2' | 'full';
  icon: string;
  title: string;
  subtitle: string;
  duration: string;
  minWords: number;
  route: string;
};

const TASKS: TaskOption[] = [
  {
    key: 'task1',
    icon: '📊',
    title: 'Task 1',
    subtitle: 'Describe a graph, chart or diagram',
    duration: '20 min',
    minWords: 150,
    route: '/modules/writing/task1',
  },
  {
    key: 'task2',
    icon: '✍️',
    title: 'Task 2',
    subtitle: 'Argumentative essay',
    duration: '40 min',
    minWords: 250,
    route: '/modules/writing/task2',
  },
  {
    key: 'full',
    icon: '📝',
    title: 'Full Exam',
    subtitle: 'Task 1 + Task 2 back to back',
    duration: '60 min',
    minWords: 400,
    route: '/modules/writing/task1',
  },
];

export default function WritingSelectScreen() {
  const [exam, setExam] = useState<Exam>('IELTS');

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Writing</Text>
          <View style={s.headerSpacer} />
        </View>

        {/* Exam pills */}
        <View style={s.examRow}>
          {(['IELTS', 'TOEFL'] as Exam[]).map(e => (
            <TouchableOpacity
              key={e}
              style={[s.examPill, exam === e && s.examPillActive]}
              onPress={() => setExam(e)}
              activeOpacity={0.8}
            >
              <Text style={[s.examPillText, exam === e && s.examPillTextActive]}>{e}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Description */}
        <View style={s.descBox}>
          <Text style={s.descTitle}>
            {exam === 'IELTS' ? 'IELTS Academic Writing' : 'TOEFL Integrated Writing'}
          </Text>
          <Text style={s.descBody}>
            {exam === 'IELTS'
              ? 'Two tasks: a graph description (150+ words, 20 min) followed by an argumentative essay (250+ words, 40 min). Scored on Task Achievement, Coherence & Cohesion, Lexical Resource, and Grammatical Range.'
              : 'Two tasks: an integrated task reading a passage and listening to a lecture (150–225 words, 20 min), followed by an academic discussion task (100+ words, 10 min).'}
          </Text>
        </View>

        {/* Task cards */}
        <Text style={s.sectionTitle}>Choose a task</Text>
        <View style={s.taskList}>
          {TASKS.map(task => (
            <TouchableOpacity
              key={task.key}
              style={s.taskCard}
              onPress={() => router.push(task.route as any)}
              activeOpacity={0.85}
            >
              <View style={s.taskIconWrap}>
                <Text style={s.taskIcon}>{task.icon}</Text>
              </View>

              <View style={s.taskBody}>
                <View style={s.taskTitleRow}>
                  <Text style={s.taskTitle}>{task.title}</Text>
                  {task.key === 'full' && (
                    <View style={s.popularBadge}>
                      <Text style={s.popularText}>POPULAR</Text>
                    </View>
                  )}
                </View>
                <Text style={s.taskSubtitle}>{task.subtitle}</Text>
                <View style={s.taskMeta}>
                  <View style={s.metaChip}>
                    <Text style={s.metaText}>⏱ {task.duration}</Text>
                  </View>
                  <View style={s.metaChip}>
                    <Text style={s.metaText}>📝 {task.minWords}+ words</Text>
                  </View>
                </View>
              </View>

              <Text style={s.taskArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View style={s.tipsCard}>
          <Text style={s.tipsTitle}>💡 Tips for high scores</Text>
          {[
            'Plan for 2–3 minutes before writing.',
            'Use a variety of sentence structures.',
            'Check grammar and spelling in the last 2 minutes.',
            task2Tips(exam),
          ].map((tip, i) => (
            <View key={i} style={s.tipRow}>
              <Text style={s.tipDot}>•</Text>
              <Text style={s.tipText}>{tip}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function task2Tips(exam: Exam) {
  return exam === 'IELTS'
    ? 'Task 2 carries twice the weight of Task 1.'
    : 'Reference specific points from the reading and lecture.';
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 8, gap: 16 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink },
  headerTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.ink,
    textAlign: 'center',
  },
  headerSpacer: { width: 38 },

  examRow: { flexDirection: 'row', gap: 10 },
  examPill: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  examPillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  examPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink2 },
  examPillTextActive: { color: Colors.white },

  descBox: {
    backgroundColor: Colors.gold_bg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0D080',
    padding: 16,
    gap: 6,
  },
  descTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.gold },
  descBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.ink2,
    lineHeight: 20,
  },

  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.ink,
  },

  taskList: { gap: 12 },
  taskCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  taskIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.gold_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskIcon: { fontSize: 26 },
  taskBody: { flex: 1, gap: 4 },
  taskTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  taskTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  taskSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, lineHeight: 18 },
  taskMeta: { flexDirection: 'row', gap: 6, marginTop: 2 },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.bg2,
  },
  metaText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink2 },
  popularBadge: {
    backgroundColor: Colors.p,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  popularText: { fontFamily: 'Inter_700Bold', fontSize: 9, color: Colors.white, letterSpacing: 0.5 },
  taskArrow: { fontFamily: 'Inter_400Regular', fontSize: 22, color: Colors.ink4 },

  tipsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 8,
  },
  tipsTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink, marginBottom: 2 },
  tipRow: { flexDirection: 'row', gap: 8 },
  tipDot: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.gold, marginTop: 1 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 19 },
});
