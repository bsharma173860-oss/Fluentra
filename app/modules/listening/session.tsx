import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, Animated, Easing, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { Colors } from '@/constants/colors';
import { ListeningSidebar } from '@/components/layout/ListeningSidebar';
import { Analytics } from '@/lib/analytics';
import {
  setListeningResult, estimateListeningBand, type ListeningQuestion,
} from '@/lib/listeningStore';
import {
  getExamContent, adaptQuestions, type AdaptedQuestion, type SectionContent,
} from '@/constants/examContent';

const GREEN     = '#0A8C5A';
const GREEN_BG  = '#EDFAF4';
const GREEN_BDR = '#C0E8D4';
const RED       = '#C04A06';

const AUDIO_URL = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const FALLBACK_SECTION: SectionContent = {
  title: 'Section 1 — Listening',
  instruction: 'Listen and answer all questions. Write NO MORE THAN TWO WORDS for each answer.',
  audioDescription: 'Listening audio',
  playsCount: 1,
  questions: [
    { id: 1,  type: 'form_completion', label: 'Customer name:',       prefix: 'Sarah', answer: 'Johnson'      },
    { id: 2,  type: 'form_completion', label: 'Booking date:',        suffix: 'March', answer: '15th'         },
    { id: 3,  type: 'form_completion', label: 'Number of guests:',                     answer: 'four'         },
    { id: 4,  type: 'form_completion', label: 'Special requirement:',  suffix: 'menu', answer: 'vegetarian'   },
    { id: 5,  type: 'form_completion', label: 'Contact number:',       prefix: '07',   answer: '700123456'    },
    { id: 6,  type: 'multiple_choice', question: 'What time does the restaurant open for dinner?',
      options: ['A) 6 pm', 'B) 7 pm', 'C) 8 pm'], answer: 'B' },
    { id: 7,  type: 'multiple_choice', question: 'Where is the restaurant located?',
      options: ['A) City centre', 'B) Suburbs', 'C) Airport'], answer: 'A' },
    { id: 8,  type: 'multiple_choice', question: 'What is included in the set-menu price?',
      options: ['A) Drinks only', 'B) Food only', 'C) Food and drinks'], answer: 'C' },
    { id: 9,  type: 'short_answer',    question: 'The restaurant was established in:', answer: '1985'         },
    { id: 10, type: 'short_answer',    question: 'The head chef trained in:',          answer: 'Paris'        },
  ],
};

const TOTAL_SECONDS = 40 * 60;
const BAR_COUNT = 20;

// ── Waveform ─────────────────────────────────────────────────────
function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const anims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.15))
  ).current;

  useEffect(() => {
    if (!isPlaying) {
      anims.forEach(a => Animated.timing(a, { toValue: 0.15, duration: 200, useNativeDriver: false }).start());
      return;
    }
    const loops = anims.map((a, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 45),
          Animated.timing(a, { toValue: 0.2 + Math.random() * 0.8, duration: 280 + Math.random() * 200, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
          Animated.timing(a, { toValue: 0.15 + Math.random() * 0.3, duration: 220 + Math.random() * 150, easing: Easing.inOut(Easing.sin), useNativeDriver: false }),
        ])
      )
    );
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [isPlaying]);

  return (
    <View style={wf.wrap}>
      {anims.map((a, i) => (
        <Animated.View
          key={i}
          style={[wf.bar, {
            height: a.interpolate({ inputRange: [0, 1], outputRange: [3, 32] }),
            backgroundColor: isPlaying ? GREEN : GREEN_BDR,
            opacity: isPlaying ? a.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }) : 0.5,
          }]}
        />
      ))}
    </View>
  );
}

const wf = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 36 },
  bar:  { width: 4, borderRadius: 2, minHeight: 3 },
});

// ── Audio player (green themed) ───────────────────────────────────
function AudioPlayer({
  isExamMode, section, sectionTitle, trackTitle, playsLimit,
}: {
  isExamMode: boolean;
  section: string;
  sectionTitle: string;
  trackTitle: string;
  playsLimit: number;
}) {
  const soundRef    = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [posMs,     setPosMs]     = useState(0);
  const [durMs,     setDurMs]     = useState(0);
  const [error,     setError]     = useState<string | null>(null);

  const canPlay  = !isExamMode || playCount < playsLimit;
  const hasPlayed = playCount > 0;

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const progressPct = durMs > 0 ? (posMs / durMs) * 100 : 0;
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  async function seek(delta: number) {
    if (!soundRef.current) return;
    await soundRef.current.setPositionAsync(Math.max(0, posMs + delta));
  }

  async function togglePlay() {
    if (!canPlay && !isPlaying) return;
    setError(null);
    if (isPlaying) { await soundRef.current?.pauseAsync(); setIsPlaying(false); return; }
    if (!soundRef.current) {
      setIsLoading(true);
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL }, { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setPosMs(status.positionMillis ?? 0);
              setDurMs(status.durationMillis ?? 0);
              if (status.didJustFinish) { setIsPlaying(false); setPosMs(0); }
            }
          }
        );
        soundRef.current = sound;
        setPlayCount(c => c + 1);
        setIsPlaying(true);
      } catch { setError('Could not load audio. Check your connection.'); }
      finally { setIsLoading(false); }
      return;
    }
    await soundRef.current.playAsync();
    if (playCount === 0) setPlayCount(1);
    setIsPlaying(true);
  }

  return (
    <View style={ap.card}>
      <Text style={ap.sectionLabel}>{sectionTitle.toUpperCase()}</Text>
      <Text style={ap.trackTitle}>{trackTitle}</Text>
      <Text style={ap.trackDur}>{fmt(posMs)} / {durMs > 0 ? fmt(durMs) : '3:45'}</Text>

      <Waveform isPlaying={isPlaying} />

      <View style={ap.progressTrack}>
        <View style={[ap.progressFill, { width: `${progressPct}%` as any }]} />
      </View>

      <View style={ap.controls}>
        <TouchableOpacity
          style={ap.sideBtn}
          onPress={() => seek(-10000)}
          disabled={!hasPlayed}
          activeOpacity={0.75}
        >
          <Text style={ap.sideBtnText}>↺</Text>
          <Text style={ap.sideBtnSub}>10s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[ap.playBtn, (!canPlay && !isPlaying) && ap.playBtnDisabled]}
          onPress={togglePlay}
          disabled={isLoading || (!canPlay && !isPlaying)}
          activeOpacity={0.85}
        >
          <Text style={ap.playIcon}>{isLoading ? '…' : isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={ap.sideBtn}
          onPress={() => seek(10000)}
          disabled={!hasPlayed || isExamMode}
          activeOpacity={0.75}
        >
          <Text style={ap.sideBtnText}>↻</Text>
          <Text style={ap.sideBtnSub}>10s</Text>
        </TouchableOpacity>
      </View>

      {isExamMode && hasPlayed && !isPlaying && playCount >= playsLimit && (
        <View style={ap.examNote}>
          <Text style={ap.examNoteText}>⚠ Audio plays {playsLimit === 1 ? 'once' : `${playsLimit} times`} in exam mode</Text>
        </View>
      )}
      {error && <Text style={ap.errorText}>{error}</Text>}
    </View>
  );
}

const ap = StyleSheet.create({
  card: {
    backgroundColor: GREEN_BG, borderRadius: 16, padding: 20, gap: 10,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 10, color: GREEN,
    textTransform: 'uppercase' as const, letterSpacing: 0.6,
  },
  trackTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000' },
  trackDur:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888' },
  progressTrack: { height: 3, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: GREEN, borderRadius: 2 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  sideBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
  },
  sideBtnText: { fontSize: 16, color: GREEN, lineHeight: 18 },
  sideBtnSub:  { fontFamily: 'Inter_400Regular', fontSize: 8, color: GREEN, marginTop: -2 },
  playBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: GREEN, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: { width: 0, height: 3 },
  },
  playBtnDisabled: { backgroundColor: Colors.ink4, shadowOpacity: 0 },
  playIcon: { fontSize: 18, color: Colors.white },
  examNote: {
    backgroundColor: '#FFF3ED', borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: '#F0C8A0',
  },
  examNoteText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: RED, textAlign: 'center' },
  errorText:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.danger, textAlign: 'center' },
});

// ── FormQuestion ──────────────────────────────────────────────────
function FormQuestion({ q, value, onChange, isRtl }: { q: AdaptedQuestion; value: string; onChange: (v: string) => void; isRtl?: boolean }) {
  return (
    <View style={fq.wrap}>
      <Text style={[fq.label, isRtl && fq.rtl]}>{q.text}</Text>
      <View style={[fq.inputRow, isRtl && { flexDirection: 'row-reverse' as any }]}>
        {q.prefix ? <Text style={fq.fix}>{q.prefix}</Text> : null}
        <TextInput
          style={[fq.input, isRtl && fq.inputRtl]}
          value={value}
          onChangeText={onChange}
          placeholder="Type answer..."
          placeholderTextColor={Colors.ink4}
          autoCorrect={false}
          autoCapitalize="none"
          textAlign={isRtl ? 'right' : 'left'}
        />
        {q.suffix ? <Text style={fq.fix}>{q.suffix}</Text> : null}
      </View>
    </View>
  );
}

const fq = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000' },
  rtl:   { textAlign: 'right' as const, writingDirection: 'rtl' as const },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fix: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2 },
  input: {
    flex: 1, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9,
    fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, minWidth: 80,
  },
  inputRtl: { textAlign: 'right' as const },
});

// ── McqQuestion ───────────────────────────────────────────────────
function McqQuestion({ q, value, onSelect, isRtl }: { q: AdaptedQuestion; value: string; onSelect: (k: string) => void; isRtl?: boolean }) {
  return (
    <View style={mq.wrap}>
      <Text style={[mq.qText, isRtl && mq.rtl]}>{q.text}</Text>
      <View style={mq.options}>
        {q.options!.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[mq.option, value === opt.key && mq.optionSelected, isRtl && { flexDirection: 'row-reverse' as any }]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.8}
          >
            <View style={[mq.radio, value === opt.key && mq.radioSelected]}>
              {value === opt.key && <View style={mq.radioInner} />}
            </View>
            <Text style={[mq.optText, value === opt.key && mq.optTextSelected, isRtl && mq.rtl]}>
              <Text style={mq.optKey}>{opt.key})</Text> {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const mq = StyleSheet.create({
  wrap: { gap: 8 },
  qText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000', lineHeight: 20 },
  rtl:   { textAlign: 'right' as const, writingDirection: 'rtl' as const },
  options: { gap: 6 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 10, borderWidth: 1, borderColor: Colors.border, padding: 10,
  },
  optionSelected: { borderColor: GREEN, backgroundColor: GREEN_BG },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioSelected: { borderColor: GREEN },
  radioInner:    { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN },
  optText:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1 },
  optTextSelected: { color: GREEN, fontFamily: 'Inter_500Medium' },
  optKey:        { fontFamily: 'Inter_700Bold' },
});

// ── Question card wrapper ─────────────────────────────────────────
function QCard({ num, type, children }: { num: number; type: string; children: React.ReactNode }) {
  return (
    <View style={qc.wrap}>
      <Text style={qc.meta}>Q{num} · {type}</Text>
      {children}
    </View>
  );
}

const qc = StyleSheet.create({
  wrap: { backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14, marginBottom: 8 },
  meta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
});

// ── Main ─────────────────────────────────────────────────────────
export default function ListeningSessionScreen() {
  const { width }  = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;
  const params     = useLocalSearchParams<{ examId?: string; exam?: string; section?: string; mode?: string }>();
  const examId     = (params.examId ?? params.exam ?? 'ielts').toLowerCase();
  const section    = params.section ?? '1';
  const mode       = (params.mode ?? 'practice') as 'practice' | 'exam';
  const isExamMode = mode === 'exam';

  // ── Load section content ────────────────────────────────────────
  const sectionKey     = `section${section}`;
  const rawContent     = getExamContent(examId, 'listening', sectionKey) as SectionContent | null;
  const sectionContent = rawContent ?? FALLBACK_SECTION;
  const QUESTIONS      = adaptQuestions(sectionContent.questions);
  const isRtl          = sectionContent.rtl === true;
  const playsLimit     = sectionContent.playsCount ?? 1;

  const [answers,     setAnswers]    = useState<Record<number, string>>({});
  const [submitting,  setSubmitting] = useState(false);
  const [secondsLeft, setSecsLeft]   = useState(TOTAL_SECONDS);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    Analytics.practiceSessionStarted({ module: 'listening', languageCode: 'en', examType: examId, mode: 'practice' });
  }, []);

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => {
      setSecsLeft(s => {
        if (s <= 1) { clearInterval(id); doSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const setAnswer = useCallback((qNum: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: val }));
  }, []);

  const answeredCount = Object.keys(answers).filter(k => answers[+k]?.trim().length > 0).length;
  const allAnswered   = answeredCount === QUESTIONS.length;

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const isTimerWarn = secondsLeft <= 5 * 60;

  function doSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    let correct = 0;
    QUESTIONS.forEach(q => {
      if ((answers[q.number] ?? '').trim().toLowerCase() === q.correctAnswer.toLowerCase()) correct++;
    });
    const band = estimateListeningBand(correct, QUESTIONS.length);
    Analytics.practiceSessionCompleted({ module: 'listening', languageCode: 'en', examType: examId, score: band, durationSeconds: timeTaken });
    setListeningResult({
      exam: examId, section, mode,
      timeTakenSeconds: timeTaken,
      totalQuestions: QUESTIONS.length, correctCount: correct, bandEstimate: band,
      answers,
      questions: QUESTIONS as unknown as ListeningQuestion[],
    });
    router.replace('/modules/listening/results' as any);
  }

  const formQs = QUESTIONS.filter(q => q.type === 'form');
  const mcqQs  = QUESTIONS.filter(q => q.type === 'mcq');
  const noteQs = QUESTIONS.filter(q => q.type === 'note');

  // ── Left panel ─────────────────────────────────────────────────
  const leftPanel = (
    <View style={s.leftPanel}>
      <AudioPlayer
        isExamMode={isExamMode}
        section={section}
        sectionTitle={sectionContent.title}
        trackTitle={sectionContent.audioDescription}
        playsLimit={playsLimit}
      />

      <View style={s.sectionInfo}>
        <Text style={s.sectionInfoLabel}>{sectionContent.title.toUpperCase()}</Text>
        <Text style={s.sectionInfoProg}>
          Question {Math.min(answeredCount + 1, QUESTIONS.length)} of {QUESTIONS.length}
        </Text>
      </View>

      <View style={s.instrBox}>
        <Text style={s.instrTitle}>Instructions</Text>
        <Text style={[s.instrText, isRtl && s.instrTextRtl]}>{sectionContent.instruction}</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressWrap}>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${(answeredCount / QUESTIONS.length) * 100}%` as any }]} />
        </View>
        <Text style={s.progressText}>{answeredCount}/{QUESTIONS.length} answered</Text>
      </View>
    </View>
  );

  // ── Right panel ─────────────────────────────────────────────────
  const rightPanel = (
    <View style={s.rightPanel}>
      {/* Timer */}
      <View style={s.timerRow}>
        <Text style={s.timerLabel}>Time remaining</Text>
        <Text style={[s.timerTime, isTimerWarn && s.timerTimeWarn]}>{mm}:{ss}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Form completion group */}
        {formQs.length > 0 && (
          <>
            <Text style={s.groupLabel}>
              {formQs.length === 1
                ? `Q${formQs[0].number} · Form Completion`
                : `Q${formQs[0].number}–${formQs[formQs.length - 1].number} · Form Completion`}
            </Text>
            {formQs.map(q => (
              <QCard key={q.number} num={q.number} type="Form Completion">
                <FormQuestion q={q} value={answers[q.number] ?? ''} onChange={v => setAnswer(q.number, v)} isRtl={isRtl || q.rtl} />
              </QCard>
            ))}
          </>
        )}

        {/* Multiple choice group */}
        {mcqQs.length > 0 && (
          <>
            <Text style={[s.groupLabel, formQs.length > 0 && { marginTop: 8 }]}>
              {mcqQs.length === 1
                ? `Q${mcqQs[0].number} · Multiple Choice`
                : `Q${mcqQs[0].number}–${mcqQs[mcqQs.length - 1].number} · Multiple Choice`}
            </Text>
            {mcqQs.map(q => (
              <QCard key={q.number} num={q.number} type="Multiple Choice">
                <McqQuestion q={q} value={answers[q.number] ?? ''} onSelect={k => setAnswer(q.number, k)} isRtl={isRtl || q.rtl} />
              </QCard>
            ))}
          </>
        )}

        {/* Note completion group */}
        {noteQs.length > 0 && (
          <>
            <Text style={[s.groupLabel, (formQs.length > 0 || mcqQs.length > 0) && { marginTop: 8 }]}>
              {noteQs.length === 1
                ? `Q${noteQs[0].number} · Short Answer`
                : `Q${noteQs[0].number}–${noteQs[noteQs.length - 1].number} · Short Answer`}
            </Text>
            {noteQs.map(q => (
              <QCard key={q.number} num={q.number} type="Short Answer">
                <FormQuestion q={q} value={answers[q.number] ?? ''} onChange={v => setAnswer(q.number, v)} isRtl={isRtl || q.rtl} />
              </QCard>
            ))}
          </>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[s.submitBtn, !allAnswered && s.submitBtnDisabled]}
          onPress={doSubmit}
          disabled={!allAnswered || submitting}
          activeOpacity={0.85}
        >
          <Text style={[s.submitBtnText, !allAnswered && s.submitBtnTextDisabled]}>
            {submitting ? 'Submitting…' : allAnswered ? 'Submit Answers →' : `Answer all questions (${answeredCount}/${QUESTIONS.length})`}
          </Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );

  // ── Desktop layout ─────────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ListeningSidebar />
        <View style={s.desktopLeft}>{leftPanel}</View>
        <View style={s.desktopRight}>{rightPanel}</View>
      </View>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {leftPanel}
        <View style={{ height: 1, backgroundColor: '#EAEAEA' }} />
        {rightPanel}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  desktopLeft: {
    width: '38%' as any, flex: 0,
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  desktopRight: { flex: 1, backgroundColor: Colors.bg },

  // ── Left panel ────────────────────────────────
  leftPanel: { padding: 20, gap: 14 },

  sectionInfo: { gap: 2 },
  sectionInfoLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888',
    textTransform: 'uppercase' as const, letterSpacing: 0.6,
  },
  sectionInfoProg: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },

  instrBox:     { backgroundColor: GREEN_BG, borderRadius: 10, padding: 12, gap: 4 },
  instrTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: GREEN },
  instrText:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#444', lineHeight: 18 },
  instrTextRtl: { textAlign: 'right' as const, writingDirection: 'rtl' as const },

  progressWrap:  { gap: 4 },
  progressTrack: { height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' },
  progressFill:  { height: '100%', backgroundColor: GREEN, borderRadius: 2 },
  progressText:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#888' },

  // ── Right panel ───────────────────────────────
  rightPanel: { padding: 20, flex: 1 },

  timerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14,
  },
  timerLabel:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },
  timerTime:     { fontFamily: 'Inter_700Bold', fontSize: 14, color: RED },
  timerTimeWarn: { color: RED },

  groupLabel: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000', marginBottom: 2 },
  groupInstr: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888', lineHeight: 17, marginBottom: 8 },

  submitBtn: {
    backgroundColor: GREEN, borderRadius: 12,
    paddingVertical: 15, alignItems: 'center', marginTop: 8,
  },
  submitBtnDisabled:    { backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border },
  submitBtnText:        { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },
  submitBtnTextDisabled:{ color: Colors.ink3 },
});
