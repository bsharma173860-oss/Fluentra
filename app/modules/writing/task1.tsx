import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { mockScore, setWritingResult } from '@/lib/writingStore';

const PROMPT =
  'The chart below shows the percentage of households in owned and rented accommodation in England and Wales between 1918 and 2011. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.';

const EXAM = 'IELTS';
const MIN_WORDS = 150;
const TOTAL_SECONDS = 20 * 60; // 20 minutes
const WARN_SECONDS = 5 * 60;

function secondsToMMSS(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── Simple placeholder bar chart ─────────────────────────────────
const CHART_DATA = [
  { year: '1918', owned: 23, rented: 77 },
  { year: '1939', owned: 32, rented: 68 },
  { year: '1953', owned: 38, rented: 62 },
  { year: '1971', owned: 52, rented: 48 },
  { year: '1991', owned: 68, rented: 32 },
  { year: '2001', owned: 70, rented: 30 },
  { year: '2011', owned: 65, rented: 35 },
];

function MiniChart() {
  const BAR_MAX_H = 60;
  return (
    <View style={chart.wrap}>
      <Text style={chart.chartTitle}>Owned vs Rented Accommodation (%)</Text>
      <View style={chart.barsRow}>
        {CHART_DATA.map(d => (
          <View key={d.year} style={chart.col}>
            <View style={chart.stackWrap}>
              <View style={[chart.bar, { height: (d.owned / 100) * BAR_MAX_H, backgroundColor: Colors.p }]} />
              <View style={[chart.bar, { height: (d.rented / 100) * BAR_MAX_H, backgroundColor: Colors.gold }]} />
            </View>
            <Text style={chart.year}>{d.year}</Text>
          </View>
        ))}
      </View>
      <View style={chart.legend}>
        <View style={chart.legendItem}>
          <View style={[chart.legendDot, { backgroundColor: Colors.p }]} />
          <Text style={chart.legendLabel}>Owned</Text>
        </View>
        <View style={chart.legendItem}>
          <View style={[chart.legendDot, { backgroundColor: Colors.gold }]} />
          <Text style={chart.legendLabel}>Rented</Text>
        </View>
      </View>
    </View>
  );
}

const chart = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chartTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink2, textAlign: 'center' },
  barsRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: 4 },
  col: { alignItems: 'center', gap: 4, flex: 1 },
  stackWrap: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 8, borderRadius: 3 },
  year: { fontFamily: 'Inter_400Regular', fontSize: 8, color: Colors.ink3 },
  legend: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink2 },
});

// ── Main Screen ───────────────────────────────────────────────────
export default function WritingTask1Screen() {
  const [text, setText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());

  const wordCount = countWords(text);
  const isWarning = secondsLeft <= WARN_SECONDS;
  const wordOk = wordCount >= MIN_WORDS;

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(id);
          doSubmit();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = useCallback((forced = false) => {
    if (submitting) return;
    if (!forced && wordCount < MIN_WORDS) {
      Alert.alert(
        'Too short',
        `You have ${wordCount} words. Task 1 requires at least ${MIN_WORDS} words. Submit anyway?`,
        [
          { text: 'Keep writing', style: 'cancel' },
          { text: 'Submit anyway', style: 'destructive', onPress: () => doSubmit() },
        ]
      );
      return;
    }
    doSubmit();
  }, [submitting, wordCount, text]);

  function doSubmit() {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    const result = mockScore(text, 'task1', EXAM, PROMPT, timeTaken);
    setWritingResult(result);
    router.replace('/modules/writing/results' as any);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Task 1</Text>
            <Text style={s.headerSub}>Graph description · 150+ words</Text>
          </View>
          <View style={[s.timerBadge, isWarning && s.timerBadgeWarn]}>
            <Text style={[s.timerText, isWarning && s.timerTextWarn]}>
              {secondsToMMSS(secondsLeft)}
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Prompt */}
          <View style={s.promptCard}>
            <Text style={s.promptLabel}>TASK 1 PROMPT</Text>
            <Text style={s.promptText}>{PROMPT}</Text>
          </View>

          {/* Chart */}
          <MiniChart />

          {/* Instructions */}
          <View style={s.instructionsRow}>
            <Text style={s.instruction}>Write at least <Text style={s.instructionBold}>{MIN_WORDS} words</Text></Text>
            <Text style={s.instruction}>You have <Text style={s.instructionBold}>20 minutes</Text></Text>
          </View>

          {/* Editor */}
          <View style={s.editorWrap}>
            <TextInput
              style={s.editor}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="Describe the key trends shown in the chart…"
              placeholderTextColor={Colors.ink4}
              textAlignVertical="top"
              autoCorrect={false}
              spellCheck={false}
            />
            <View style={s.editorFooter}>
              <View style={[s.wordBadge, wordOk ? s.wordBadgeOk : s.wordBadgeWarn]}>
                <Text style={[s.wordCount, wordOk ? s.wordCountOk : s.wordCountWarn]}>
                  {wordCount} / {MIN_WORDS} words
                </Text>
              </View>
              <TouchableOpacity
                style={[s.submitBtn, submitting && s.submitBtnDisabled]}
                onPress={() => handleSubmit(false)}
                disabled={submitting}
                activeOpacity={0.85}
              >
                <Text style={s.submitBtnText}>
                  {submitting ? 'Scoring…' : 'Submit →'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Tips */}
          <View style={s.tipsRow}>
            {[
              { icon: '📊', tip: 'Describe the overall trend before specific details.' },
              { icon: '🔢', tip: 'Include key data points and figures from the chart.' },
              { icon: '↔️', tip: 'Compare and contrast different categories or time periods.' },
            ].map((t, i) => (
              <View key={i} style={s.tipChip}>
                <Text style={s.tipIcon}>{t.icon}</Text>
                <Text style={s.tipText}>{t.tip}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36, height: 36,
    borderRadius: 11,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 18, color: Colors.ink },
  headerCenter: { flex: 1 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  timerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  timerBadgeWarn: { backgroundColor: '#FFF3ED', borderColor: Colors.orange },
  timerText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  timerTextWarn: { color: Colors.orange },

  content: { paddingHorizontal: 16, paddingTop: 16, gap: 14 },

  promptCard: {
    backgroundColor: Colors.bg2,
    borderRadius: 16,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  promptLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    letterSpacing: 1,
    color: Colors.p,
    textTransform: 'uppercase',
  },
  promptText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.ink,
    lineHeight: 22,
  },

  instructionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  instruction: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  instructionBold: { fontFamily: 'Inter_600SemiBold', color: Colors.ink2 },

  editorWrap: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  editor: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 24,
    minHeight: 260,
    padding: 16,
  },
  editorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  wordBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    borderWidth: 1,
  },
  wordBadgeOk: { backgroundColor: Colors.green_bg, borderColor: Colors.green },
  wordBadgeWarn: { backgroundColor: '#FFF3ED', borderColor: Colors.orange },
  wordCount: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  wordCountOk: { color: Colors.green },
  wordCountWarn: { color: Colors.orange },

  submitBtn: {
    backgroundColor: Colors.p,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },

  tipsRow: { gap: 8 },
  tipChip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 12,
  },
  tipIcon: { fontSize: 16, marginTop: 1 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 19 },
});
