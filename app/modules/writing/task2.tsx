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
import { AppLayout } from '@/components/layout/AppLayout';
import { mockScore, setWritingResult } from '@/lib/writingStore';
import { getTodaysTask2 } from '@/constants/dailyContent';

const EXAM = 'IELTS';
const MIN_WORDS = 250;
const TOTAL_SECONDS = 40 * 60; // 40 minutes
const WARN_SECONDS = 5 * 60;   // last 5 minutes → orange

function secondsToMMSS(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export default function WritingTask2Screen() {
  const todaysTask2  = getTodaysTask2();
  const PROMPT       = todaysTask2.prompt;

  const [text, setText] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());

  const wordCount = countWords(text);
  const isWarning = secondsLeft <= WARN_SECONDS;
  const wordOk = wordCount >= MIN_WORDS;

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(id);
          handleSubmit(true);
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
        `You have ${wordCount} words. Task 2 requires at least ${MIN_WORDS} words. Submit anyway?`,
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
    const result = mockScore(text, 'task2', EXAM, PROMPT, timeTaken);
    setWritingResult(result);
    router.replace('/modules/writing/results' as any);
  }

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Task 2</Text>
            <Text style={s.headerSub}>Essay · 250+ words</Text>
          </View>
          {/* Timer */}
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
          {/* Prompt card */}
          <View style={s.promptCard}>
            <Text style={s.promptLabel}>TASK 2 PROMPT · {todaysTask2.topic.toUpperCase()}</Text>
            <Text style={s.promptText}>{PROMPT}</Text>
          </View>

          {/* Instructions */}
          <View style={s.instructionsRow}>
            <Text style={s.instruction}>Write at least <Text style={s.instructionBold}>{MIN_WORDS} words</Text></Text>
            <Text style={s.instruction}>You have <Text style={s.instructionBold}>40 minutes</Text></Text>
          </View>

          {/* Writing area */}
          <View style={s.editorWrap}>
            <TextInput
              style={s.editor}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="Start writing your essay here…"
              placeholderTextColor={Colors.ink4}
              textAlignVertical="top"
              autoCorrect={false}
              spellCheck={false}
            />

            {/* Word counter + submit row */}
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

          {/* Writing tips */}
          <View style={s.tipsRow}>
            {[
              { icon: '📝', tip: 'State your position clearly in the introduction.' },
              { icon: '🔀', tip: 'Discuss both views before giving your opinion.' },
              { icon: '✅', tip: 'Use linking words: however, furthermore, in contrast.' },
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
    </AppLayout>
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
    width: 32, height: 32,
    borderRadius: 10,
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
  timerText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
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
    minHeight: 320,
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
