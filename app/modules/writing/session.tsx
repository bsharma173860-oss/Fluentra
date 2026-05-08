/**
 * modules/writing/session.tsx
 * Timed writing session — fetches AI prompt, falls back to static content.
 * Route: /modules/writing/session?taskType=task1|task2&languageCode=&examId=
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { getTodaysTask2 } from '@/constants/dailyContent';
import { supabase } from '@/lib/supabase';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';

// ── Types ──────────────────────────────────────────────────────────

type WritingPrompt = {
  title:       string;
  taskType:    'task1' | 'task2';
  prompt:      string;
  wordLimit:   number;
  timeMinutes: number;
};

// ── Helpers ────────────────────────────────────────────────────────

async function fetchWritingPrompt(
  userId: string,
  languageCode: string,
  taskType: string,
  examType?: string
): Promise<WritingPrompt | null> {
  try {
    const qs  = new URLSearchParams({ userId, languageCode, module: 'writing' });
    const res = await fetch(`${API}/content/today?${qs}`);
    if (res.ok) {
      const json = await res.json();
      if (json.content?.prompt) return json.content as WritingPrompt;
    }
  } catch {}

  try {
    const res = await fetch(`${API}/content/generate`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ userId, languageCode, module: 'writing', examType, difficulty: 'intermediate' }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.content?.prompt) return json.content as WritingPrompt;
    }
  } catch {}

  return null;
}

function countWords(text: string): number {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Word count bar ─────────────────────────────────────────────────

function WordCountBar({ count, limit }: { count: number; limit: number }) {
  const pct    = Math.min((count / limit) * 100, 100);
  const over   = count > limit;
  const near   = pct >= 80;
  const color  = over ? Colors.danger : near ? Colors.orange : Colors.green;
  return (
    <View style={wb.wrap}>
      <View style={wb.track}>
        <View style={[wb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[wb.label, { color }]}>
        {count} / {limit} words {over ? '(over limit)' : ''}
      </Text>
    </View>
  );
}

const wb = StyleSheet.create({
  wrap:  { gap: 6 },
  track: { height: 4, backgroundColor: Colors.bg2, borderRadius: 2, overflow: 'hidden' },
  fill:  { height: '100%', borderRadius: 2 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12 },
});

// ── Main screen ────────────────────────────────────────────────────

export default function WritingSession() {
  const params = useLocalSearchParams<{
    examId?:      string;
    taskType?:    'task1' | 'task2';
    languageCode?: string;
  }>();

  const languageCode = params.languageCode ?? 'en';
  const taskType     = params.taskType ?? 'task2';

  const { user } = useAuth();

  const [prompt,    setPrompt]    = useState<WritingPrompt | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [essay,     setEssay]     = useState('');
  const [timeLeft,  setTimeLeft]  = useState(0);
  const [started,   setStarted]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef<number>(0);

  const load = useCallback(async () => {
    setLoading(true);
    let wp: WritingPrompt | null = null;

    if (user) {
      wp = await fetchWritingPrompt(user.id, languageCode, taskType);
    }

    // Fallback to static content
    if (!wp) {
      const fallback = getTodaysTask2();
      wp = {
        title:       fallback.topic,
        taskType:    'task2',
        prompt:      fallback.prompt,
        wordLimit:   250,
        timeMinutes: 40,
      };
    }

    setPrompt(wp);
    setTimeLeft((wp.timeMinutes ?? 40) * 60);
    setLoading(false);
  }, [user, languageCode, taskType]);

  useEffect(() => { load(); }, [load]);

  // Timer
  useEffect(() => {
    if (!started || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, submitted]);

  const handleSubmit = useCallback(async () => {
    if (!user || !prompt) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startTime.current) / 1000);
    const wc = countWords(essay);

    try {
      await supabase.from('writing_attempts').insert({
        user_id:       user.id,
        language_code: languageCode,
        task_type:     prompt.taskType,
        prompt:        prompt.prompt,
        response:      essay,
        word_count:    wc,
        time_taken_sec: timeTaken,
      });
    } catch (err) {
      console.warn('[writing/session] save error:', err);
    }

    setSubmitting(false);
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    // Navigate to results (grading happens server-side)
    router.replace('/modules/writing/results' as any);
  }, [user, prompt, essay, languageCode]);

  const handleStart = useCallback(() => {
    startTime.current = Date.now();
    setStarted(true);
  }, []);

  const wc = countWords(essay);

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.p} />
          <Text style={s.loadingText}>Preparing your writing prompt…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!prompt) return null;

  const timerColor = timeLeft < 300 ? Colors.danger : timeLeft < 600 ? Colors.orange : Colors.ink3;

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {prompt.taskType === 'task1' ? 'Writing Task 1' : 'Writing Task 2'}
        </Text>
        <Text style={[s.timer, { color: timerColor }]}>
          {started ? formatTime(timeLeft) : `${prompt.timeMinutes}:00`}
        </Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Prompt card */}
          <View style={s.promptCard}>
            <View style={s.taskBadge}>
              <Text style={s.taskBadgeText}>{prompt.taskType.toUpperCase()}</Text>
            </View>
            {prompt.title ? (
              <Text style={s.promptTitle}>{prompt.title}</Text>
            ) : null}
            <Text style={s.promptText}>{prompt.prompt}</Text>
            <Text style={s.wordLimitNote}>Write at least {prompt.wordLimit} words</Text>
          </View>

          {/* Writing area */}
          {!started ? (
            <TouchableOpacity style={s.startBtn} onPress={handleStart} activeOpacity={0.85}>
              <Text style={s.startBtnText}>Start Writing</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TextInput
                style={s.textInput}
                value={essay}
                onChangeText={setEssay}
                placeholder="Start writing your response here…"
                placeholderTextColor={Colors.ink4}
                multiline
                autoFocus
                textAlignVertical="top"
                autoCorrect
                spellCheck
              />

              <WordCountBar count={wc} limit={prompt.wordLimit} />

              <TouchableOpacity
                style={[s.submitBtn, (wc < 50 || submitting) && s.submitBtnDisabled]}
                onPress={handleSubmit}
                activeOpacity={0.85}
                disabled={wc < 50 || submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={s.submitBtnText}>Submit Essay</Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: 20, gap: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back:        { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  timer:       { fontFamily: 'Inter_600SemiBold', fontSize: 16, fontVariant: ['tabular-nums'] as any },

  promptCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    gap: 10,
  },
  taskBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.p_soft,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  taskBadgeText:  { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.p, letterSpacing: 0.5 },
  promptTitle:    { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  promptText:     { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.ink2, lineHeight: 24 },
  wordLimitNote:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 4 },

  startBtn: {
    height: 52,
    backgroundColor: Colors.p,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },

  textInput: {
    minHeight: 240,
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.ink,
    lineHeight: 24,
  },

  submitBtn: {
    height: 52,
    backgroundColor: Colors.p,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText:     { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },

  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginTop: 12 },
});
