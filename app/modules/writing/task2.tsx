import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, KeyboardAvoidingView, Platform, Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { WritingSidebar } from '@/components/layout/WritingSidebar';
import { mockScore, setWritingResult } from '@/lib/writingStore';
import { getTodaysTask2 } from '@/constants/dailyContent';
import { Analytics } from '@/lib/analytics';
import { getExamDisplayName } from '@/constants/examDisplayNames';
import { getLabels } from '@/constants/examLabels';

const GOLD  = '#B07A10';
const RED   = '#C04A06';
const GREEN = '#16A34A';
const BLUE  = '#1558B0';
const BLUE_BG = '#EEF4FF';
const FR_BLUE = '#1558B0';

// ── Per-exam config ───────────────────────────────────────────────

type Task2Mode = 'essay' | 'discussion' | 'fr-essay';

type Task2Config = {
  taskName: string;
  minWords: number;
  totalSec: number;
  mode: Task2Mode;
  prompt?: string;
  instructions: string[];
  target: string;
};

const IELTS_PROMPT =
  'Some people think that the best way to improve public health is to increase the ' +
  'number of sports facilities. Others, however, think this would have little effect ' +
  'on public health and that other measures are required. ' +
  'Discuss both views and give your own opinion.';

const DALF_PROMPT =
  'En vous appuyant sur les documents et vos connaissances personnelles, défendez un ' +
  'point de vue argumenté sur la question suivante :\n\n' +
  '« La mondialisation culturelle représente-t-elle une chance ou une menace pour les ' +
  'cultures locales ? »';

const TASK2_CONFIG: Record<string, Task2Config> = {
  ielts: {
    taskName: 'Task 2',
    minWords: 250,
    totalSec: 40 * 60,
    mode: 'essay',
    instructions: [
      'Write at least 250 words',
      'Present a balanced argument',
      'Use formal academic style',
    ],
    target: 'Target: 250–300 words',
  },
  toefl: {
    taskName: 'Academic Discussion',
    minWords: 100,
    totalSec: 10 * 60,
    mode: 'discussion',
    instructions: [
      'Write at least 100 words',
      'Add new ideas — do not just agree',
      'Support your opinion with reasons',
    ],
    target: 'Target: 100–150 words',
  },
  dalf: {
    taskName: 'Prise de position',
    minWords: 250,
    totalSec: 60 * 60,
    mode: 'fr-essay',
    prompt: DALF_PROMPT,
    instructions: [
      'Écrivez au moins 250 mots',
      'Défendez clairement votre point de vue',
      'Appuyez-vous sur des exemples précis',
      'Utilisez un registre formel',
    ],
    target: 'Minimum 250 mots',
  },
};

function getConfig(examId: string): Task2Config {
  return TASK2_CONFIG[examId] ?? TASK2_CONFIG.ielts;
}

// ── TOEFL discussion content ──────────────────────────────────────

const TOEFL_DISCUSSION = {
  professor:
    'Many universities are now offering online degrees. Do you think online ' +
    'education is as effective as traditional classroom learning?',
  students: [
    {
      name: 'Maya',
      avatar: 'M',
      color: '#5B4EFF',
      bg: '#F0EEFF',
      text:
        'I think online education offers more flexibility and allows students to learn at ' +
        'their own pace. Many students, especially working adults, benefit greatly from being ' +
        'able to access course material anytime.',
    },
    {
      name: 'Carlos',
      avatar: 'C',
      color: '#0A8C5A',
      bg: '#EDFAF4',
      text:
        'I disagree. Face-to-face interaction is crucial for learning. In a traditional ' +
        'classroom, students can ask questions immediately and engage in real-time discussions ' +
        'with peers, which deepens understanding.',
    },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────

function toMMSS(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
function wordColor(count: number, min: number) {
  if (count >= min)       return GREEN;
  if (count >= min * 0.6) return GOLD;
  return RED;
}

// ── Main screen ───────────────────────────────────────────────────

export default function WritingTask2Screen() {
  const { width }   = useWindowDimensions();
  const isDesktop   = Platform.OS === 'web' && width >= 768;
  const params      = useLocalSearchParams();
  const examId      = ((params.examId ?? params.exam ?? 'ielts') as string);
  const cfg         = getConfig(examId);
  const displayName = getExamDisplayName(examId);
  const labels      = getLabels(examId);
  const todaysTask2 = getTodaysTask2();

  // Dynamic prompt: IELTS uses today's rotating prompt, others use config
  const PROMPT = examId === 'ielts' ? todaysTask2.prompt : (cfg.prompt ?? '');

  const [text,        setText]        = useState('');
  const [secondsLeft, setSecondsLeft] = useState(cfg.totalSec);
  const [submitting,  setSubmitting]  = useState(false);
  const startedAt = useRef(Date.now());
  const textRef   = useRef('');

  useEffect(() => { textRef.current = text; }, [text]);

  const wordCount = countWords(text);
  const isWarning = secondsLeft <= 5 * 60;
  const wordOk    = wordCount >= cfg.minWords;
  const wc        = wordColor(wordCount, cfg.minWords);
  const barPct    = Math.min(wordCount / cfg.minWords, 1);

  useEffect(() => {
    Analytics.practiceSessionStarted({
      module: 'writing', languageCode: 'en', examType: displayName, mode: 'practice',
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(id); doSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function doSubmit() {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    const currentText = textRef.current;
    const result = mockScore(currentText, 'task2', displayName, PROMPT, timeTaken);
    Analytics.practiceSessionCompleted({
      module: 'writing', languageCode: 'en', examType: displayName,
      durationSeconds: timeTaken, wordCount: countWords(currentText),
    });
    setWritingResult(result);
    router.replace('/modules/writing/results' as any);
  }

  const handleSubmit = useCallback(() => {
    if (submitting) return;
    if (wordCount < cfg.minWords) {
      Alert.alert(
        'Too short',
        `${wordCount} ${labels.wordCount}. ${labels.writeAtLeast} ${cfg.minWords}. Submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit anyway', style: 'destructive', onPress: doSubmit },
        ]
      );
      return;
    }
    doSubmit();
  }, [submitting, wordCount]);

  // ── Timer badge (shared) ──────────────────────────────────────
  const timerBadge = (
    <View style={[s.timerBadge, isWarning && s.timerBadgeWarn]}>
      <Text style={[s.timerText, isWarning && s.timerTextWarn]}>{toMMSS(secondsLeft)}</Text>
    </View>
  );

  // ── Prompt panel: IELTS essay ─────────────────────────────────
  const ieltsPromptPanel = (
    <View style={s.promptPanel}>
      <View style={s.promptTopRow}>
        <View style={s.taskBadge}><Text style={s.taskBadgeText}>TASK 2</Text></View>
        {timerBadge}
      </View>
      <Text style={s.examTypeLine}>{displayName} · Writing Task 2</Text>
      <View style={s.promptCard}>
        <Text style={s.promptCardLabel}>WRITING TASK 2</Text>
        <Text style={s.promptText}>{PROMPT}</Text>
      </View>
      <View style={s.instructionsBox}>
        {cfg.instructions.map((inst, i) => (
          <View key={i} style={s.instrRow}>
            <View style={s.instrDot} />
            <Text style={s.instrText}>{inst}</Text>
          </View>
        ))}
      </View>
      <Text style={s.targetText}>{cfg.target}</Text>
    </View>
  );

  // ── Prompt panel: TOEFL discussion ────────────────────────────
  const toeflPromptPanel = (
    <View style={s.promptPanel}>
      <View style={s.promptTopRow}>
        <View style={[s.taskBadge, { backgroundColor: BLUE_BG }]}>
          <Text style={[s.taskBadgeText, { color: BLUE }]}>DISCUSSION</Text>
        </View>
        {timerBadge}
      </View>
      <Text style={s.examTypeLine}>{displayName} · Academic Discussion</Text>
      <View style={s.professorCard}>
        <View style={s.professorHeader}>
          <View style={[s.avatarCircle, { backgroundColor: '#1A1A1A' }]}>
            <Text style={s.avatarText}>P</Text>
          </View>
          <Text style={s.professorLabel}>Professor</Text>
        </View>
        <Text style={s.professorText}>{TOEFL_DISCUSSION.professor}</Text>
      </View>
      {TOEFL_DISCUSSION.students.map(st => (
        <View key={st.name} style={[s.studentCard, { borderLeftColor: st.color, borderLeftWidth: 3 }]}>
          <View style={s.studentHeader}>
            <View style={[s.avatarCircle, { backgroundColor: st.bg }]}>
              <Text style={[s.avatarText, { color: st.color }]}>{st.avatar}</Text>
            </View>
            <Text style={[s.studentName, { color: st.color }]}>{st.name}</Text>
          </View>
          <Text style={s.studentText}>{st.text}</Text>
        </View>
      ))}
      <View style={s.instructionsBox}>
        {cfg.instructions.map((inst, i) => (
          <View key={i} style={s.instrRow}>
            <View style={[s.instrDot, { backgroundColor: BLUE }]} />
            <Text style={s.instrText}>{inst}</Text>
          </View>
        ))}
      </View>
      <Text style={s.targetText}>{cfg.target}</Text>
    </View>
  );

  // ── Prompt panel: DALF prise de position ─────────────────────
  const dalfPromptPanel = (
    <View style={s.promptPanel}>
      <View style={s.promptTopRow}>
        <View style={[s.taskBadge, { backgroundColor: '#EEF4FF' }]}>
          <Text style={[s.taskBadgeText, { color: FR_BLUE }]}>PRISE DE POSITION</Text>
        </View>
        {timerBadge}
      </View>
      <Text style={s.examTypeLine}>{displayName} · {cfg.taskName}</Text>
      <View style={[s.promptCard, { backgroundColor: '#F8F7FF' }]}>
        <Text style={[s.promptCardLabel, { color: FR_BLUE }]}>SUJET</Text>
        <Text style={s.promptText}>{PROMPT}</Text>
      </View>
      <View style={s.instructionsBox}>
        {cfg.instructions.map((inst, i) => (
          <View key={i} style={s.instrRow}>
            <View style={[s.instrDot, { backgroundColor: FR_BLUE }]} />
            <Text style={s.instrText}>{inst}</Text>
          </View>
        ))}
      </View>
      <Text style={s.targetText}>{cfg.target}</Text>
    </View>
  );

  function renderPromptPanel() {
    switch (cfg.mode) {
      case 'discussion': return toeflPromptPanel;
      case 'fr-essay':   return dalfPromptPanel;
      default:           return ieltsPromptPanel;
    }
  }

  // ── Editor panel ──────────────────────────────────────────────
  const editorPanel = (
    <View style={s.editorPanel}>
      <View style={s.editorTopRow}>
        <Text style={s.editorTitle}>
          {cfg.mode === 'fr-essay' || cfg.mode === 'discussion'
            ? (cfg.mode === 'fr-essay' ? 'Votre réponse' : 'Your response')
            : 'Your response'}
        </Text>
        <Text style={[s.wordCountText, { color: wc }]}>
          {wordCount} / {cfg.minWords} {labels.wordCount}
        </Text>
      </View>
      <TextInput
        style={s.editor}
        multiline
        value={text}
        onChangeText={setText}
        placeholder={labels.placeholder}
        placeholderTextColor="#BBB"
        textAlignVertical="top"
        autoCorrect={false}
        spellCheck={false}
      />
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: `${barPct * 100}%` as any, backgroundColor: wc }]} />
      </View>
      <TouchableOpacity
        style={[s.submitBtn, wordOk ? s.submitBtnActive : s.submitBtnInactive]}
        onPress={handleSubmit}
        disabled={submitting}
        activeOpacity={0.85}
      >
        <Text style={[s.submitBtnText, !wordOk && s.submitBtnTextInactive]}>
          {submitting ? '…' : wordOk ? labels.submit : labels.submit.replace(' →', '')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ── Desktop ───────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <WritingSidebar />
        <View style={s.desktopPrompt}>{renderPromptPanel()}</View>
        <View style={s.desktopEditor}>{editorPanel}</View>
      </View>
    );
  }

  // ── Mobile ────────────────────────────────────────────────────
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
          {renderPromptPanel()}
          <View style={s.mobileDivider} />
          {editorPanel}
          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────

const s = StyleSheet.create({
  desktopPrompt: {
    flex: 0, width: '42%' as any,
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  desktopEditor: { flex: 1, backgroundColor: Colors.bg },

  mobileContent: { paddingBottom: 24 },
  mobileDivider: { height: 1, backgroundColor: '#EAEAEA' },

  promptPanel: { padding: 24, gap: 12, flex: 1 },

  promptTopRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  taskBadge: {
    backgroundColor: '#FEF9EC', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4,
  },
  taskBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: GOLD },
  timerBadge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border,
  },
  timerBadgeWarn: { backgroundColor: '#FFF0EB', borderColor: RED },
  timerText:     { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  timerTextWarn: { color: RED },

  examTypeLine: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },

  promptCard: {
    backgroundColor: '#F9F8F5', borderRadius: 12, padding: 16,
  },
  promptCardLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 11, color: GOLD,
    textTransform: 'uppercase' as const, letterSpacing: 0.6, marginBottom: 8,
  },
  promptText: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#000', lineHeight: 26 },

  professorCard: { backgroundColor: '#F9F8F5', borderRadius: 12, padding: 14, gap: 8 },
  professorHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  professorLabel:  { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#000' },
  professorText:   { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#000', lineHeight: 22 },

  studentCard: {
    backgroundColor: Colors.white, borderRadius: 12, padding: 14, gap: 8,
    borderWidth: 1, borderColor: '#EAEAEA',
  },
  studentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  studentName:   { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  studentText:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#555', lineHeight: 20 },

  avatarCircle: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#FFF' },

  instructionsBox: {
    backgroundColor: '#FFFFFF', borderRadius: 8, padding: 12, gap: 7,
    borderWidth: 1, borderColor: '#EAEAEA',
  },
  instrRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  instrDot:  { width: 5, height: 5, borderRadius: 2.5, backgroundColor: GOLD, flexShrink: 0 },
  instrText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666' },
  targetText:{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },

  editorPanel: { padding: 24, flex: 1, gap: 0 },

  editorTopRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  editorTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000' },
  wordCountText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },

  editor: {
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#EAEAEA',
    borderRadius: 12, padding: 16,
    fontFamily: 'Inter_400Regular', fontSize: 15, color: '#000',
    lineHeight: 26, minHeight: 400, flex: 1,
  },

  barTrack: {
    height: 3, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden', marginTop: 8,
  },
  barFill: { height: '100%', borderRadius: 2 },

  submitBtn: {
    borderRadius: 10, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 16,
  },
  submitBtnActive:       { backgroundColor: GOLD },
  submitBtnInactive:     { backgroundColor: '#F4F4F0' },
  submitBtnText:         { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
  submitBtnTextInactive: { color: '#BBB' },
});
