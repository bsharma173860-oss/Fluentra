import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const PASSAGE = `Sleep and memory have a complex, bidirectional relationship that researchers have only begun to fully understand in recent decades. During sleep, the brain does not simply rest — it actively processes and consolidates the information gathered during waking hours, transferring memories from short-term storage in the hippocampus to long-term storage in the cortex.

A landmark 2003 study by Walker et al. demonstrated that students who learned a complex motor task and then slept showed a 20.5% improvement in performance the following day, compared to those who remained awake. This finding was replicated across verbal learning tasks, suggesting that sleep plays a domain-general role in memory consolidation.

The precise mechanism appears to involve slow-wave sleep (SWS) and rapid eye movement (REM) sleep in different but complementary ways. SWS, characterised by large, slow brain oscillations, seems particularly important for declarative memory — facts and events. REM sleep, by contrast, appears critical for procedural and emotional memories.`;

const QUESTIONS = [
  { n: 1, type: 'True/False/NG', stem: 'The researcher claims that sleep deprivation directly causes memory loss.', options: ['True', 'False', 'Not Given'] },
  { n: 2, type: 'Multiple Choice', stem: 'According to the passage, which factor most significantly affects cognitive performance?', options: ['Duration of sleep', 'Quality of sleep', 'Time of sleep onset', 'Sleep environment'] },
  { n: 3, type: 'True/False/NG', stem: 'Students who studied before sleeping retained more information than those who studied in the morning.', options: ['True', 'False', 'Not Given'] },
  { n: 4, type: 'Gap Fill', stem: 'The study found that ________ hours of sleep was optimal for memory consolidation.', options: null },
  { n: 5, type: 'Multiple Choice', stem: 'The word "consolidation" in paragraph 3 is closest in meaning to:', options: ['strengthening', 'reduction', 'transfer', 'activation'] },
];

export default function ReadingSessionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const answered = Object.keys(answers).length;

  function setAnswer(n: number, v: string) {
    setAnswers(prev => ({ ...prev, [n]: v }));
  }

  const content = (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Reading · IELTS Academic</Text>
          <Text style={s.headerMeta}>Passage 2 · Hard</Text>
        </View>
        <View style={s.timerBadge}><Text style={s.timerText}>28:14</Text></View>
        <View style={s.progressBadge}>
          <Text style={s.progressText}>{answered}/5</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${(answered / 5) * 100}%` as any }]} />
      </View>

      {isDesktop ? (
        // Desktop: side-by-side
        <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
          <ScrollView style={s.passagePane} contentContainerStyle={s.passagePaneContent}>
            <Text style={s.passageEyebrow}>PASSAGE</Text>
            <Text style={s.passageTitle}>Sleep &amp; Memory — Academic Reading Passage 2</Text>
            <Text style={s.passageBody}>{PASSAGE}</Text>
          </ScrollView>
          <ScrollView style={s.questionsPane} contentContainerStyle={s.questionsPaneContent}>
            <Text style={s.questionsEyebrow}>QUESTIONS 1–5</Text>
            {QUESTIONS.map(q => <QuestionBlock key={q.n} q={q} answer={answers[q.n]} onAnswer={v => setAnswer(q.n, v)} />)}
            <TouchableOpacity style={s.submitBtn} onPress={() => router.push('/modules/reading/results' as any)}>
              <Text style={s.submitBtnText}>Submit &amp; get feedback</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        // Mobile: single scroll
        <ScrollView contentContainerStyle={s.mobileContent}>
          <View style={s.passageCardMobile}>
            <Text style={s.passageEyebrow}>PASSAGE</Text>
            <Text style={s.passageTitle}>Sleep &amp; Memory</Text>
            <Text style={s.passageBody} numberOfLines={6}>{PASSAGE}</Text>
            <TouchableOpacity><Text style={[s.passageEyebrow, { color: T.reading }]}>Read full passage →</Text></TouchableOpacity>
          </View>
          {QUESTIONS.map(q => <QuestionBlock key={q.n} q={q} answer={answers[q.n]} onAnswer={v => setAnswer(q.n, v)} />)}
          <TouchableOpacity style={s.submitBtn} onPress={() => router.push('/modules/reading/results' as any)}>
            <Text style={s.submitBtnText}>Submit &amp; get feedback</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );

  if (isDesktop) {
    return (
      <AppLayout>
        {content}
      </AppLayout>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {content}
    </SafeAreaView>
  );
}

function QuestionBlock({ q, answer, onAnswer }: {
  q: typeof QUESTIONS[0];
  answer: string | undefined;
  onAnswer: (v: string) => void;
}) {
  return (
    <View style={s.questionBlock}>
      <View style={s.questionHeader}>
        <View style={s.questionNum}><Text style={s.questionNumText}>{q.n}</Text></View>
        <Text style={s.questionType}>{q.type}</Text>
      </View>
      <Text style={s.questionStem}>{q.stem}</Text>
      {q.options ? (
        <View style={s.options}>
          {q.options.map(o => (
            <TouchableOpacity
              key={o}
              style={[s.option, answer === o && s.optionSelected]}
              onPress={() => onAnswer(o)}
            >
              <View style={[s.optionDot, answer === o && s.optionDotSelected]} />
              <Text style={[s.optionText, answer === o && s.optionTextSelected]}>{o}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <TextInput
          style={s.gapInput}
          placeholder="Type your answer…"
          placeholderTextColor={T.ink4}
          value={answer || ''}
          onChangeText={onAnswer}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.bg },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  headerMeta: { fontSize: 11, color: T.ink4 },
  timerBadge: { backgroundColor: T.bg2, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  timerText: { fontSize: 12, fontWeight: '700', color: T.ink, fontVariant: ['tabular-nums'] },
  progressBadge: { backgroundColor: T.readingBg, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  progressText: { fontSize: 12, fontWeight: '700', color: T.reading },
  progressBar: { height: 3, backgroundColor: T.track, flexShrink: 0 },
  progressFill: { height: '100%', backgroundColor: T.reading },

  // Desktop split
  passagePane: { flex: 1, backgroundColor: T.paper, borderRightWidth: 1, borderRightColor: T.border },
  passagePaneContent: { padding: 28, gap: 12 },
  questionsPane: { width: 380, backgroundColor: T.card },
  questionsPaneContent: { padding: 24, gap: 16 },

  // Mobile
  mobileContent: { padding: 16, gap: 16 },
  passageCardMobile: { backgroundColor: T.paper, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 8 },

  passageEyebrow: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  passageTitle: { fontFamily: T.serif, fontSize: 20, color: T.ink, lineHeight: 26 },
  passageBody: { fontSize: 14, color: T.ink2, lineHeight: 22 },

  questionsEyebrow: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },

  // Question block
  questionBlock: { backgroundColor: T.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 10 },
  questionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questionNum: { width: 24, height: 24, borderRadius: 6, backgroundColor: T.readingBg, alignItems: 'center', justifyContent: 'center' },
  questionNumText: { fontSize: 12, fontWeight: '700', color: T.reading },
  questionType: { fontSize: 11, color: T.ink4, fontWeight: '600' },
  questionStem: { fontSize: 14, color: T.ink, lineHeight: 20 },
  options: { gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 9, borderWidth: 1, borderColor: T.border, backgroundColor: T.bg },
  optionSelected: { borderColor: T.reading, backgroundColor: T.readingBg },
  optionDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: T.border },
  optionDotSelected: { backgroundColor: T.reading, borderColor: T.reading },
  optionText: { fontSize: 13, color: T.ink2 },
  optionTextSelected: { color: T.reading, fontWeight: '600' },
  gapInput: { borderWidth: 1.5, borderColor: T.border, borderRadius: 9, padding: 10, fontSize: 14, color: T.ink },

  submitBtn: { backgroundColor: T.reading, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 8 },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
});
