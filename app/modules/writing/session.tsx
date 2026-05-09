import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const TASKS = [
  {
    n: 1, label: 'Task 1 — Graph Description', meta: 'Task 1 · Minimum 150 words · 20 min',
    prompt: 'The graph below shows the number of international students studying in the UK between 2005 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    tips: ['Identify the overall trend first.', 'Include specific data points with numbers.', 'Compare and contrast different periods.', 'Avoid giving opinions — only describe.'],
  },
  {
    n: 2, label: 'Task 2 — Opinion Essay', meta: 'Task 2 · Minimum 250 words · 40 min',
    prompt: 'Some people believe that technology has made it harder for people to maintain meaningful relationships. To what extent do you agree or disagree?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    tips: ['State your position clearly in the intro.', 'Use one main idea per body paragraph.', 'Include specific examples to support claims.', 'Write a clear conclusion restating your view.'],
  },
];

export default function WritingSessionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [activeTask, setActiveTask] = useState(0);
  const [texts, setTexts] = useState<Record<number, string>>({ 0: '', 1: '' });

  const task = TASKS[activeTask];
  const wordCount = (texts[activeTask] || '').split(/\s+/).filter(Boolean).length;
  const minWords = activeTask === 0 ? 150 : 250;

  const content = (
    <View style={{ flex: 1 }}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Writing · IELTS Academic</Text>
          <Text style={s.headerMeta}>{task.meta}</Text>
        </View>
        <View style={s.timerBadge}><Text style={s.timerText}>38:40</Text></View>
      </View>
      <View style={s.progressBar}><View style={[s.progressFill, { width: `${Math.min((wordCount / minWords) * 100, 100)}%` as any }]} /></View>

      {/* Task switcher */}
      <View style={s.taskSwitcher}>
        {TASKS.map((t, i) => (
          <TouchableOpacity key={i} style={[s.taskTab, activeTask === i && s.taskTabActive]} onPress={() => setActiveTask(i)}>
            <Text style={[s.taskTabText, activeTask === i && s.taskTabTextActive]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isDesktop ? (
        <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
          <ScrollView style={s.leftPane} contentContainerStyle={s.leftPaneContent}>
            <Text style={s.promptTitle}>{task.label}</Text>
            <Text style={s.promptText}>{task.prompt}</Text>
            {/* Bar chart placeholder for Task 1 */}
            {activeTask === 0 && (
              <View style={s.chartPlaceholder}>
                <Text style={s.chartLabel}>IELTS Chart: UK International Students</Text>
                <View style={s.chartBars}>
                  {[55, 62, 71, 88, 102, 118, 125].map((v, i) => (
                    <View key={i} style={s.chartBarCol}>
                      <View style={[s.chartBar, { height: (v / 130) * 80, backgroundColor: T.writing }]} />
                      <Text style={s.chartBarLabel}>{['05','07','09','11','13','15','20'][i]}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <View style={s.tipsCard}>
              <Text style={s.tipsLabel}>BAND 7+ TIPS</Text>
              {task.tips.map((tip, i) => (
                <View key={i} style={s.tipRow}><View style={s.tipDot} /><Text style={s.tipText}>{tip}</Text></View>
              ))}
            </View>
          </ScrollView>
          <View style={s.rightPane}>
            <TextInput
              style={s.editor}
              multiline
              placeholder="Start writing your answer here…"
              placeholderTextColor={T.ink4}
              value={texts[activeTask]}
              onChangeText={v => setTexts(t => ({ ...t, [activeTask]: v }))}
              textAlignVertical="top"
            />
            <View style={s.editorFooter}>
              <Text style={[s.wordCount, wordCount >= minWords && { color: T.listening }]}>
                {wordCount} words {wordCount < minWords ? `(min ${minWords})` : '✓'}
              </Text>
              <TouchableOpacity style={s.submitBtn} onPress={() => router.push('/modules/writing/results' as any)}>
                <Text style={s.submitBtnText}>Submit for grading →</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.mobileContent}>
          <View style={s.mobilePromptCard}>
            <Text style={s.promptText}>{task.prompt}</Text>
          </View>
          <TextInput
            style={s.mobileEditor}
            multiline
            placeholder="Start writing here…"
            placeholderTextColor={T.ink4}
            value={texts[activeTask]}
            onChangeText={v => setTexts(t => ({ ...t, [activeTask]: v }))}
            textAlignVertical="top"
          />
          <View style={s.editorFooter}>
            <Text style={[s.wordCount, wordCount >= minWords && { color: T.listening }]}>{wordCount} words</Text>
            <TouchableOpacity style={s.submitBtn} onPress={() => router.push('/modules/writing/results' as any)}>
              <Text style={s.submitBtnText}>Submit →</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  headerMeta: { fontSize: 11, color: T.ink4 },
  timerBadge: { backgroundColor: T.bg2, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  timerText: { fontSize: 12, fontWeight: '700', color: T.ink },
  progressBar: { height: 3, backgroundColor: T.track },
  progressFill: { height: '100%', backgroundColor: T.writing },
  taskSwitcher: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: T.border, backgroundColor: T.card },
  taskTab: { flex: 1, paddingVertical: 10, paddingHorizontal: 16 },
  taskTabActive: { borderBottomWidth: 2, borderBottomColor: T.writing },
  taskTabText: { fontSize: 12.5, fontWeight: '500', color: T.ink3, textAlign: 'center' },
  taskTabTextActive: { color: T.writing, fontWeight: '700' },
  leftPane: { flex: 1, backgroundColor: T.paper, borderRightWidth: 1, borderRightColor: T.border },
  leftPaneContent: { padding: 28, gap: 16 },
  rightPane: { flex: 1, backgroundColor: T.card, padding: 24, gap: 0 },
  promptTitle: { fontFamily: T.serif, fontSize: 22, color: T.ink, lineHeight: 28 },
  promptText: { fontSize: 14, color: T.ink2, lineHeight: 22 },
  chartPlaceholder: { backgroundColor: T.writingBg, borderRadius: 12, padding: 14, gap: 10 },
  chartLabel: { fontSize: 10.5, fontWeight: '700', color: T.writing, letterSpacing: 0.6, textTransform: 'uppercase' },
  chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 90 },
  chartBarCol: { flex: 1, alignItems: 'center', gap: 4 },
  chartBar: { width: '100%', borderRadius: 3 },
  chartBarLabel: { fontSize: 9, color: T.ink4 },
  tipsCard: { backgroundColor: T.bg2, borderRadius: 12, padding: 14, gap: 8 },
  tipsLabel: { fontSize: 10, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  tipDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: T.writing, marginTop: 8, flexShrink: 0 },
  tipText: { fontSize: 12.5, color: T.ink2, lineHeight: 18, flex: 1 },
  editor: { flex: 1, fontSize: 14, color: T.ink, lineHeight: 22, fontFamily: 'Inter_400Regular', textAlignVertical: 'top' },
  editorFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, borderTopWidth: 1, borderTopColor: T.border },
  wordCount: { fontSize: 12, color: T.ink4, fontWeight: '600' },
  submitBtn: { backgroundColor: T.writing, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  submitBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  mobileContent: { padding: 16, gap: 14 },
  mobilePromptCard: { backgroundColor: T.paper, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border },
  mobileEditor: { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, padding: 14, fontSize: 14, color: T.ink, minHeight: 200 },
});
