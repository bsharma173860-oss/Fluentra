import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const LESSONS = [
  { title: 'Present Perfect vs Simple Past', level: 'B1', mins: 8,  done: true  },
  { title: 'Modal Verbs of Deduction',        level: 'B2', mins: 10, done: true  },
  { title: 'Conditional Sentences (Mixed)',   level: 'B2', mins: 12, done: false },
  { title: 'Passive Voice in Academic Writing', level: 'C1', mins: 9, done: false },
  { title: 'Cleft Sentences for Emphasis',    level: 'C1', mins: 7,  done: false },
];

const EXERCISES = [
  { q: 'She ______ (live) in Paris for three years.', options: ['lives', 'has lived', 'lived', 'is living'], answer: 'has lived' },
  { q: 'If I ______ (know) earlier, I would have helped.', options: ['knew', 'had known', 'know', 'would know'], answer: 'had known' },
  { q: 'The report ______ (write) by the research team.', options: ['wrote', 'was written', 'has written', 'is writing'], answer: 'was written' },
];

export default function GrammarScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [activeLesson, setActiveLesson] = useState(2);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Grammar · {code?.toUpperCase()}</Text>
      </View>

      {isDesktop ? (
        <View style={s.desktopLayout}>
          {/* Sidebar lesson list */}
          <View style={s.lessonSidebar}>
            <Text style={s.sidebarTitle}>LESSONS</Text>
            {LESSONS.map((l, i) => (
              <TouchableOpacity key={i} style={[s.lessonItem, activeLesson === i && s.lessonItemActive]} onPress={() => setActiveLesson(i)}>
                <View style={[s.lessonCheck, l.done && s.lessonCheckDone]}><Text style={{ color: l.done ? '#fff' : T.ink5, fontSize: 11 }}>{l.done ? '✓' : i + 1}</Text></View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.lessonTitle, activeLesson === i && { color: T.writing }]} numberOfLines={2}>{l.title}</Text>
                  <Text style={s.lessonMeta}>{l.level} · {l.mins} min</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* Lesson content */}
          <View style={{ flex: 1 }}>
            {renderLesson()}
          </View>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, marginBottom: 12 }}>
            {LESSONS.map((l, i) => (
              <TouchableOpacity key={i} style={[s.lessonChip, activeLesson === i && s.lessonChipActive]} onPress={() => setActiveLesson(i)}>
                <Text style={[s.lessonChipText, activeLesson === i && { color: T.writing }]} numberOfLines={1}>{l.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {renderLesson()}
        </>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  function renderLesson() {
    const l = LESSONS[activeLesson];
    return (
      <View style={s.lessonContent}>
        <View style={s.lessonHero}>
          <Text style={s.lessonHeroEyebrow}>{l.level} · {l.mins} min</Text>
          <Text style={s.lessonHeroTitle}>{l.title}</Text>
        </View>

        <View style={s.explanationCard}>
          <Text style={s.explanationTitle}>Explanation</Text>
          <Text style={s.explanationBody}>
            In English, the present perfect connects past actions to the present moment. Use it when the exact time is not specified or not important. Example: "I have visited Paris." — the exact time doesn't matter; what matters is the current state.
          </Text>
          <View style={s.exampleBox}>
            <Text style={s.exampleLabel}>EXAMPLE</Text>
            <Text style={s.exampleText}>✓ She has worked here for three years. (still working)</Text>
            <Text style={s.exampleText}>✓ He worked here last year. (no longer working)</Text>
          </View>
        </View>

        <Text style={s.exercisesTitle}>Practice exercises</Text>
        {EXERCISES.map((e, i) => (
          <View key={i} style={s.exercise}>
            <Text style={s.exerciseQ}>{e.q}</Text>
            <View style={s.exerciseOptions}>
              {e.options.map(o => {
                const sel = answers[i] === o;
                const correct = sel && o === e.answer;
                const wrong = sel && o !== e.answer;
                return (
                  <TouchableOpacity key={o} style={[s.exerciseOpt, sel && (correct ? s.optCorrect : s.optWrong)]} onPress={() => setAnswers(a => ({ ...a, [i]: o }))}>
                    <Text style={[s.exerciseOptText, correct && { color: T.listening, fontWeight: '700' }, wrong && { color: '#B00020' }]}>{o}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {answers[i] && <Text style={[s.exerciseFeedback, { color: answers[i] === e.answer ? T.listening : '#B00020' }]}>{answers[i] === e.answer ? '✓ Correct!' : `✗ Correct: ${e.answer}`}</Text>}
          </View>
        ))}

        <TouchableOpacity style={s.nextLessonBtn} onPress={() => setActiveLesson(i => Math.min(i + 1, LESSONS.length - 1))}>
          <Text style={s.nextLessonBtnText}>Next lesson →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isDesktop) return <AppLayout languageCode={code}>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },
  scrollDesktop: {},
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: T.ink },

  desktopLayout: { flexDirection: 'row' },
  lessonSidebar: { width: 260, backgroundColor: T.paper, borderRightWidth: 1, borderRightColor: T.border, padding: 20, gap: 6 },
  sidebarTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  lessonItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 10, borderRadius: 10 },
  lessonItemActive: { backgroundColor: T.writingBg },
  lessonCheck: { width: 22, height: 22, borderRadius: 6, backgroundColor: T.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  lessonCheckDone: { backgroundColor: T.listening },
  lessonTitle: { fontSize: 12.5, fontWeight: '600', color: T.ink, lineHeight: 18 },
  lessonMeta: { fontSize: 11, color: T.ink4, marginTop: 2 },

  lessonChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: T.border, marginRight: 8, backgroundColor: T.card, maxWidth: 200 },
  lessonChipActive: { borderColor: T.writing, backgroundColor: T.writingBg },
  lessonChipText: { fontSize: 12, fontWeight: '600', color: T.ink3 },

  lessonContent: { padding: 20, gap: 16 },
  lessonHero: { gap: 6 },
  lessonHeroEyebrow: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  lessonHeroTitle: { fontFamily: T.serif, fontSize: 26, color: T.ink, lineHeight: 32 },

  explanationCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, gap: 12 },
  explanationTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  explanationBody: { fontSize: 14, color: T.ink2, lineHeight: 22 },
  exampleBox: { backgroundColor: T.writingBg, borderRadius: 10, padding: 12, gap: 6 },
  exampleLabel: { fontSize: 10, fontWeight: '700', color: T.writing, letterSpacing: 0.8, textTransform: 'uppercase' },
  exampleText: { fontSize: 13, color: T.ink, lineHeight: 18 },

  exercisesTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  exercise: { backgroundColor: T.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 10 },
  exerciseQ: { fontSize: 14, color: T.ink, lineHeight: 20 },
  exerciseOptions: { gap: 6 },
  exerciseOpt: { padding: 10, borderRadius: 9, borderWidth: 1, borderColor: T.border, backgroundColor: T.bg },
  optCorrect: { borderColor: T.listening, backgroundColor: T.listeningBg },
  optWrong: { borderColor: '#B00020', backgroundColor: '#FCE6E2' },
  exerciseOptText: { fontSize: 13, color: T.ink },
  exerciseFeedback: { fontSize: 12, fontWeight: '700' },

  nextLessonBtn: { backgroundColor: T.writing, borderRadius: 12, padding: 14, alignItems: 'center' },
  nextLessonBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
