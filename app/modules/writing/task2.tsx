import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WritingSidebar } from '@/components/layout/WritingSidebar';
import { mockScore, setWritingResult } from '@/lib/writingStore';
import { getTodaysTask2 } from '@/constants/dailyContent';
import { Analytics } from '@/lib/analytics';

const GOLD          = '#B07A10';
const GOLD_BG       = '#FEF9EC';
const RED           = '#C04A06';
const GREEN         = '#16A34A';
const EXAM          = 'IELTS';
const MIN_WORDS     = 250;
const TOTAL_SECONDS = 40 * 60;
const WARN_SECONDS  = 5 * 60;

function toMMSS(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function wordColor(count: number) {
  if (count >= MIN_WORDS) return GREEN;
  if (count >= 150)       return GOLD;
  return RED;
}

export default function WritingTask2Screen() {
  const { width }   = useWindowDimensions();
  const isDesktop   = Platform.OS === 'web' && width >= 768;
  const todaysTask2 = getTodaysTask2();
  const PROMPT      = todaysTask2.prompt;

  const [text,        setText]       = useState('');
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [submitting,  setSubmitting]  = useState(false);
  const startedAt = useRef(Date.now());
  const textRef   = useRef('');

  useEffect(() => { textRef.current = text; }, [text]);

  const wordCount = countWords(text);
  const isWarning = secondsLeft <= WARN_SECONDS;
  const wordOk    = wordCount >= MIN_WORDS;
  const wc        = wordColor(wordCount);
  const barPct    = Math.min(wordCount / MIN_WORDS, 1);

  useEffect(() => {
    Analytics.practiceSessionStarted({
      module: 'writing', languageCode: 'en', examType: EXAM, mode: 'practice',
    });
  }, []);

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

  function doSubmit() {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    const currentText = textRef.current;
    const result = mockScore(currentText, 'task2', EXAM, PROMPT, timeTaken);
    Analytics.practiceSessionCompleted({
      module: 'writing', languageCode: 'en', examType: EXAM,
      durationSeconds: timeTaken, wordCount: countWords(currentText),
    });
    setWritingResult(result);
    router.replace('/modules/writing/results' as any);
  }

  const handleSubmit = useCallback(() => {
    if (submitting) return;
    if (wordCount < MIN_WORDS) {
      Alert.alert(
        'Too short',
        `You have ${wordCount} words. Task 2 requires at least ${MIN_WORDS} words. Submit anyway?`,
        [
          { text: 'Keep writing', style: 'cancel' },
          { text: 'Submit anyway', style: 'destructive', onPress: doSubmit },
        ]
      );
      return;
    }
    doSubmit();
  }, [submitting, wordCount]);

  // ── Prompt panel content ───────────────────────────────────────
  const promptPanel = (
    <View style={s.promptPanel}>
      {/* Top row: task badge + timer */}
      <View style={s.promptTopRow}>
        <View style={s.taskBadge}>
          <Text style={s.taskBadgeText}>TASK 2</Text>
        </View>
        <View style={[s.timerBadge, isWarning && s.timerBadgeWarn]}>
          <Text style={[s.timerText, isWarning && s.timerTextWarn]}>
            {toMMSS(secondsLeft)}
          </Text>
        </View>
      </View>
      <Text style={s.examType}>IELTS Academic</Text>

      {/* Prompt card */}
      <View style={s.promptCard}>
        <Text style={s.promptCardLabel}>WRITING TASK 2</Text>
        <Text style={s.promptText}>{PROMPT}</Text>
      </View>

      {/* Instructions */}
      <View style={s.instructionsBox}>
        {[
          'Write at least 250 words',
          'Present a balanced argument',
          'Use formal academic style',
        ].map((inst, i) => (
          <View key={i} style={s.instrRow}>
            <View style={s.instrDot} />
            <Text style={s.instrText}>{inst}</Text>
          </View>
        ))}
      </View>

      <Text style={s.targetText}>Target: 250–300 words</Text>
    </View>
  );

  // ── Editor panel content ───────────────────────────────────────
  const editorPanel = (
    <View style={s.editorPanel}>
      {/* Top row */}
      <View style={s.editorTopRow}>
        <Text style={s.editorTitle}>Your response</Text>
        <Text style={[s.wordCountText, { color: wc }]}>
          {wordCount} / {MIN_WORDS} words
        </Text>
      </View>

      {/* Editor */}
      <TextInput
        style={s.editor}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="Begin your essay here..."
        placeholderTextColor="#BBB"
        textAlignVertical="top"
        autoCorrect={false}
        spellCheck={false}
      />

      {/* Word count bar */}
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: `${barPct * 100}%` as any, backgroundColor: wc }]} />
      </View>

      {/* Submit */}
      <TouchableOpacity
        style={[s.submitBtn, wordOk ? s.submitBtnActive : s.submitBtnDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={[s.submitBtnText, !wordOk && s.submitBtnTextDisabled]}>
          {submitting ? 'Scoring…' : wordOk ? 'Submit for grading →' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Desktop layout ─────────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <WritingSidebar />
        <View style={s.desktopPrompt}>{promptPanel}</View>
        <View style={s.desktopEditor}>{editorPanel}</View>
      </View>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.mobileContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {promptPanel}
          <View style={s.mobileDivider} />
          {editorPanel}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  // ── Desktop panels ─────────────────────
  desktopPrompt: {
    flex: 0, width: '42%' as any,
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  desktopEditor: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  // ── Mobile ─────────────────────────────
  mobileContent: { paddingBottom: 24 },
  mobileDivider: { height: 1, backgroundColor: '#EAEAEA', marginVertical: 0 },

  // ── Prompt panel ───────────────────────
  promptPanel: {
    padding: 24, gap: 0,
    flex: 1,
  },

  promptTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 4,
  },
  taskBadge: {
    backgroundColor: '#FEF9EC', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  taskBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: GOLD },
  timerBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, backgroundColor: Colors.bg2,
    borderWidth: 1, borderColor: Colors.border,
  },
  timerBadgeWarn: { backgroundColor: '#FFF0EB', borderColor: RED },
  timerText:     { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  timerTextWarn: { color: RED },

  examType: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', marginBottom: 16 },

  promptCard: {
    backgroundColor: '#F9F8F5', borderRadius: 12, padding: 16,
    marginBottom: 14,
  },
  promptCardLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 11, color: GOLD,
    textTransform: 'uppercase' as const, letterSpacing: 0.6, marginBottom: 8,
  },
  promptText: {
    fontFamily: 'Inter_400Regular', fontSize: 15, color: '#000', lineHeight: 26,
  },

  instructionsBox: {
    backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, gap: 7,
  },
  instrRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  instrDot:  { width: 5, height: 5, borderRadius: 2.5, backgroundColor: GOLD, flexShrink: 0 },
  instrText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666' },

  targetText: {
    fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', marginTop: 10,
  },

  // ── Editor panel ───────────────────────
  editorPanel: {
    padding: 24, flex: 1, gap: 0,
  },

  editorTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  editorTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000' },
  wordCountText:{ fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  editor: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAEAEA',
    borderRadius: 12, padding: 16,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: '#000',
    lineHeight: 26, minHeight: 400,
    flex: 1,
  },

  barTrack: {
    height: 3, backgroundColor: '#F0F0F0',
    borderRadius: 2, overflow: 'hidden', marginTop: 8,
  },
  barFill: { height: '100%', borderRadius: 2 },

  submitBtn: {
    borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 16,
  },
  submitBtnActive:   { backgroundColor: GOLD },
  submitBtnDisabled: { backgroundColor: '#F4F4F0' },
  submitBtnText:     { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
  submitBtnTextDisabled: { color: '#BBB' },
});
