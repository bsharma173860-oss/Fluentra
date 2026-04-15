import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Audio } from 'expo-av';
import { Colors } from '@/constants/colors';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  setListeningResult,
  estimateListeningBand,
  ListeningQuestion,
} from '@/lib/listeningStore';

// ─────────────────────────────────────────────────────────────────
// Audio source
// ─────────────────────────────────────────────────────────────────
const AUDIO_URL =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

// ─────────────────────────────────────────────────────────────────
// Questions
// ─────────────────────────────────────────────────────────────────
const QUESTIONS: ListeningQuestion[] = [
  // Form completion Q1-5
  {
    number: 1, type: 'form', shortLabel: 'Q1',
    text: 'Customer name:',
    prefix: 'Sarah', suffix: undefined,
    correctAnswer: 'Johnson',
    explanation: 'The caller gives her full name as "Sarah Johnson" when the receptionist asks.',
  },
  {
    number: 2, type: 'form', shortLabel: 'Q2',
    text: 'Booking date:',
    prefix: undefined, suffix: 'March',
    correctAnswer: '15th',
    explanation: 'The customer says "the fifteenth of March" when confirming the reservation date.',
  },
  {
    number: 3, type: 'form', shortLabel: 'Q3',
    text: 'Number of guests:',
    prefix: undefined, suffix: undefined,
    correctAnswer: 'four',
    explanation: 'The customer requests a table for four people.',
  },
  {
    number: 4, type: 'form', shortLabel: 'Q4',
    text: 'Special requirement:',
    prefix: undefined, suffix: 'menu',
    correctAnswer: 'vegetarian',
    explanation: 'One guest requires a vegetarian menu, as stated by the caller.',
  },
  {
    number: 5, type: 'form', shortLabel: 'Q5',
    text: 'Contact number:',
    prefix: '07', suffix: undefined,
    correctAnswer: '700123456',
    explanation: 'The customer reads out her mobile number beginning with 07.',
  },
  // MCQ Q6-8
  {
    number: 6, type: 'mcq', shortLabel: 'Q6',
    text: 'What time does the restaurant open for dinner?',
    options: [
      { key: 'A', label: '6 pm' },
      { key: 'B', label: '7 pm' },
      { key: 'C', label: '8 pm' },
    ],
    correctAnswer: 'B',
    explanation: 'The receptionist confirms that dinner service starts at 7 pm.',
  },
  {
    number: 7, type: 'mcq', shortLabel: 'Q7',
    text: 'Where is the restaurant located?',
    options: [
      { key: 'A', label: 'City centre' },
      { key: 'B', label: 'Suburbs' },
      { key: 'C', label: 'Airport' },
    ],
    correctAnswer: 'A',
    explanation: 'The address given places the restaurant in the city centre.',
  },
  {
    number: 8, type: 'mcq', shortLabel: 'Q8',
    text: 'What is included in the set-menu price?',
    options: [
      { key: 'A', label: 'Drinks only' },
      { key: 'B', label: 'Food only' },
      { key: 'C', label: 'Food and drinks' },
    ],
    correctAnswer: 'C',
    explanation: 'The receptionist explains the set price covers both food and a welcome drink.',
  },
  // Note completion Q9-10
  {
    number: 9, type: 'note', shortLabel: 'Q9',
    text: 'The restaurant was established in:',
    prefix: undefined, suffix: undefined,
    correctAnswer: '1985',
    explanation: 'The receptionist mentions the restaurant has been open since 1985.',
  },
  {
    number: 10, type: 'note', shortLabel: 'Q10',
    text: 'The head chef trained in:',
    prefix: undefined, suffix: undefined,
    correctAnswer: 'Paris',
    explanation: 'It is stated that the head chef completed his training in Paris.',
  },
];

// ─────────────────────────────────────────────────────────────────
// Waveform animation
// ─────────────────────────────────────────────────────────────────
const BAR_COUNT = 28;

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  const anims = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (!isPlaying) {
      anims.forEach(a => Animated.timing(a, { toValue: 0.2, duration: 200, useNativeDriver: false }).start());
      return;
    }
    const loops = anims.map((a, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 40),
          Animated.timing(a, {
            toValue: 0.2 + Math.random() * 0.8,
            duration: 250 + Math.random() * 200,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
          Animated.timing(a, {
            toValue: 0.2 + Math.random() * 0.4,
            duration: 200 + Math.random() * 150,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: false,
          }),
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
          style={[
            wf.bar,
            {
              height: a.interpolate({
                inputRange: [0, 1],
                outputRange: [4, 36],
              }),
              backgroundColor: isPlaying ? Colors.p : Colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
}

const wf = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 40 },
  bar: { width: 3, borderRadius: 2, minHeight: 4 },
});

// ─────────────────────────────────────────────────────────────────
// Audio player card
// ─────────────────────────────────────────────────────────────────
function AudioPlayer({
  isExamMode,
  section,
}: {
  isExamMode: boolean;
  section: string;
}) {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [positionMs, setPositionMs] = useState(0);
  const [durationMs, setDurationMs] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const canPlay = !isExamMode || playCount === 0;
  const hasPlayed = playCount > 0;

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true, staysActiveInBackground: false });
    return () => { soundRef.current?.unloadAsync(); };
  }, []);

  const progressPct = durationMs > 0 ? (positionMs / durationMs) * 100 : 0;
  const fmtTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  };

  async function togglePlay() {
    if (!canPlay && !isPlaying) return;
    setError(null);

    if (isPlaying) {
      await soundRef.current?.pauseAsync();
      setIsPlaying(false);
      return;
    }

    if (!soundRef.current) {
      setIsLoading(true);
      try {
        const { sound } = await Audio.Sound.createAsync(
          { uri: AUDIO_URL },
          { shouldPlay: true },
          (status) => {
            if (status.isLoaded) {
              setPositionMs(status.positionMillis ?? 0);
              setDurationMs(status.durationMillis ?? 0);
              if (status.didJustFinish) {
                setIsPlaying(false);
                setPositionMs(0);
              }
            }
          }
        );
        soundRef.current = sound;
        setPlayCount(c => c + 1);
        setIsPlaying(true);
      } catch (e) {
        setError('Could not load audio. Check your connection.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    await soundRef.current.playAsync();
    if (playCount === 0) setPlayCount(1);
    setIsPlaying(true);
  }

  async function replay() {
    if (!canPlay) return;
    await soundRef.current?.setPositionAsync(0);
    await soundRef.current?.playAsync();
    setIsPlaying(true);
  }

  return (
    <View style={ap.card}>
      {/* Section badge */}
      <View style={ap.topRow}>
        <View style={ap.sectionBadge}>
          <Text style={ap.sectionText}>Section {section} of 4</Text>
        </View>
        {isExamMode && (
          <View style={ap.examBadge}>
            <Text style={ap.examBadgeText}>⏱ Exam mode</Text>
          </View>
        )}
      </View>

      {/* Waveform */}
      <Waveform isPlaying={isPlaying} />

      {/* Progress bar */}
      <View style={ap.progressWrap}>
        <View style={ap.track}>
          <View style={[ap.fill, { width: `${progressPct}%` as any }]} />
        </View>
        <View style={ap.timeRow}>
          <Text style={ap.timeText}>{fmtTime(positionMs)}</Text>
          <Text style={ap.timeText}>{durationMs > 0 ? fmtTime(durationMs) : '--:--'}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={ap.controls}>
        {/* Replay */}
        <TouchableOpacity
          style={[ap.replayBtn, !canPlay && ap.btnDisabled]}
          onPress={hasPlayed ? replay : undefined}
          disabled={!canPlay || !hasPlayed}
          activeOpacity={0.75}
        >
          <Text style={[ap.replayIcon, !canPlay && ap.iconDisabled]}>↺</Text>
        </TouchableOpacity>

        {/* Play / Pause */}
        <TouchableOpacity
          style={[ap.playBtn, (!canPlay && !isPlaying) && ap.playBtnDisabled]}
          onPress={togglePlay}
          disabled={isLoading || (!canPlay && !isPlaying)}
          activeOpacity={0.85}
        >
          <Text style={ap.playIcon}>
            {isLoading ? '…' : isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        {/* Speed placeholder */}
        <View style={ap.speedBtn}>
          <Text style={ap.speedText}>1×</Text>
        </View>
      </View>

      {/* Exam-mode lockout notice */}
      {isExamMode && hasPlayed && !isPlaying && (
        <View style={ap.examNotice}>
          <Text style={ap.examNoticeText}>
            🔒 Audio has been played once — exam rules apply
          </Text>
        </View>
      )}

      {error && <Text style={ap.errorText}>{error}</Text>}
    </View>
  );
}

const ap = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 12,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionBadge: {
    backgroundColor: Colors.p_soft,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  sectionText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.p },
  examBadge: {
    backgroundColor: Colors.orange_bg,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: Colors.orange,
  },
  examBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.orange },
  progressWrap: { gap: 4 },
  track: { height: 4, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: Colors.p, borderRadius: 99 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  timeText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  controls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20 },
  replayBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  replayIcon: { fontSize: 22, color: Colors.ink },
  speedBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  speedText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink2 },
  playBtn: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.p,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  playBtnDisabled: { backgroundColor: Colors.ink4, shadowOpacity: 0 },
  playIcon: { fontSize: 22, color: Colors.white },
  btnDisabled: { opacity: 0.3 },
  iconDisabled: { color: Colors.ink4 },
  examNotice: {
    backgroundColor: Colors.orange_bg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.orange,
  },
  examNoticeText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.orange, textAlign: 'center' },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.danger, textAlign: 'center' },
});

// ─────────────────────────────────────────────────────────────────
// Question components
// ─────────────────────────────────────────────────────────────────

function FormQuestion({
  q,
  value,
  onChange,
}: {
  q: ListeningQuestion;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={fq.wrap}>
      <View style={fq.header}>
        <View style={fq.num}><Text style={fq.numText}>{q.number}</Text></View>
        <Text style={fq.label}>{q.text}</Text>
      </View>
      <View style={fq.inputRow}>
        {q.prefix ? <Text style={fq.fix}>{q.prefix}</Text> : null}
        <TextInput
          style={fq.input}
          value={value}
          onChangeText={onChange}
          placeholder="answer…"
          placeholderTextColor={Colors.ink4}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {q.suffix ? <Text style={fq.fix}>{q.suffix}</Text> : null}
      </View>
    </View>
  );
}

const fq = StyleSheet.create({
  wrap: { gap: 8 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  num: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
  },
  numText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.white },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink, flex: 1 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 30 },
  fix: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2 },
  input: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.ink,
    minWidth: 80,
  },
});

function McqQuestion({
  q,
  value,
  onSelect,
}: {
  q: ListeningQuestion;
  value: string;
  onSelect: (k: string) => void;
}) {
  return (
    <View style={mq.wrap}>
      <View style={mq.header}>
        <View style={mq.num}><Text style={mq.numText}>{q.number}</Text></View>
        <Text style={mq.qText}>{q.text}</Text>
      </View>
      <View style={mq.options}>
        {q.options!.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[mq.option, value === opt.key && mq.optionSelected]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.8}
          >
            <View style={[mq.radio, value === opt.key && mq.radioSelected]}>
              {value === opt.key && <View style={mq.radioInner} />}
            </View>
            <Text style={[mq.optText, value === opt.key && mq.optTextSelected]}>
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
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  num: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 2,
  },
  numText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.white },
  qText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink, flex: 1, lineHeight: 20 },
  options: { gap: 7, paddingLeft: 30 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border,
    padding: 11,
  },
  optionSelected: { borderColor: Colors.p, backgroundColor: Colors.p_soft },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  radioSelected: { borderColor: Colors.p },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.p },
  optText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1 },
  optTextSelected: { color: Colors.p, fontFamily: 'Inter_500Medium' },
  optKey: { fontFamily: 'Inter_700Bold' },
});

// ─────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────
export default function ListeningSessionScreen() {
  const params = useLocalSearchParams<{ exam?: string; section?: string; mode?: string }>();
  const exam    = params.exam    ?? 'IELTS';
  const section = params.section ?? '1';
  const mode    = (params.mode ?? 'practice') as 'practice' | 'exam';
  const isExamMode = mode === 'exam';

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());

  const setAnswer = useCallback((qNum: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: val }));
  }, []);

  const answeredCount = Object.keys(answers).filter(k => answers[+k]?.trim().length > 0).length;
  const allAnswered = answeredCount === QUESTIONS.length;

  function doSubmit() {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    let correct = 0;
    QUESTIONS.forEach(q => {
      const userAns = (answers[q.number] ?? '').trim().toLowerCase();
      if (userAns === q.correctAnswer.toLowerCase()) correct++;
    });
    const band = estimateListeningBand(correct, QUESTIONS.length);
    setListeningResult({
      exam, section, mode,
      timeTakenSeconds: timeTaken,
      totalQuestions: QUESTIONS.length,
      correctCount: correct,
      bandEstimate: band,
      answers,
      questions: QUESTIONS,
    });
    router.replace('/modules/listening/results' as any);
  }

  const formQs = QUESTIONS.filter(q => q.type === 'form');
  const mcqQs  = QUESTIONS.filter(q => q.type === 'mcq');
  const noteQs = QUESTIONS.filter(q => q.type === 'note');

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Listening</Text>
          <Text style={s.headerSub}>{exam} · Section {section} · {mode === 'exam' ? 'Exam mode' : 'Practice mode'}</Text>
        </View>
        <View style={s.progressBadge}>
          <Text style={s.progressText}>{answeredCount}/{QUESTIONS.length}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Audio player */}
        <AudioPlayer isExamMode={isExamMode} section={section} />

        {/* Instructions box */}
        <View style={s.instrBox}>
          <Text style={s.instrTitle}>📋 Instructions</Text>
          <Text style={s.instrText}>
            Listen to the recording and answer all 10 questions.{'\n'}
            Write <Text style={s.instrBold}>NO MORE THAN TWO WORDS</Text> for each answer unless stated otherwise.
          </Text>
        </View>

        {/* Form completion */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Questions 1–5 · Form Completion</Text>
          <Text style={s.sectionInstr}>Complete the booking form. Write NO MORE THAN TWO WORDS for each answer.</Text>
          <View style={s.formCard}>
            <Text style={s.formCardTitle}>📞 Restaurant Booking Form</Text>
            {formQs.map(q => (
              <FormQuestion
                key={q.number}
                q={q}
                value={answers[q.number] ?? ''}
                onChange={v => setAnswer(q.number, v)}
              />
            ))}
          </View>
        </View>

        {/* MCQ */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Questions 6–8 · Multiple Choice</Text>
          <Text style={s.sectionInstr}>Choose the correct letter, A, B, or C.</Text>
          <View style={s.card}>
            {mcqQs.map(q => (
              <McqQuestion
                key={q.number}
                q={q}
                value={answers[q.number] ?? ''}
                onSelect={k => setAnswer(q.number, k)}
              />
            ))}
          </View>
        </View>

        {/* Note completion */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Questions 9–10 · Note Completion</Text>
          <Text style={s.sectionInstr}>Complete the notes. Write NO MORE THAN TWO WORDS.</Text>
          <View style={s.noteCard}>
            <Text style={s.noteCardTitle}>🗒 Restaurant Notes</Text>
            {noteQs.map(q => (
              <FormQuestion
                key={q.number}
                q={q}
                value={answers[q.number] ?? ''}
                onChange={v => setAnswer(q.number, v)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submit */}
      <View style={s.submitWrap}>
        <View style={s.submitProgress}>
          <View style={s.submitProgressTrack}>
            <View style={[s.submitProgressFill, { width: `${(answeredCount / QUESTIONS.length) * 100}%` as any }]} />
          </View>
          <Text style={s.submitProgressText}>{answeredCount} of {QUESTIONS.length} answered</Text>
        </View>
        <TouchableOpacity
          style={[s.submitBtn, !allAnswered && s.submitBtnDisabled]}
          onPress={doSubmit}
          disabled={!allAnswered || submitting}
          activeOpacity={0.85}
        >
          <Text style={s.submitBtnText}>
            {submitting ? 'Submitting…' : allAnswered ? 'Submit Answers →' : `Complete all answers (${answeredCount}/${QUESTIONS.length})`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 17, color: Colors.ink },
  headerCenter: { flex: 1 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  progressBadge: {
    backgroundColor: Colors.p_soft,
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  progressText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.p },

  content: { padding: 16, gap: 16 },

  instrBox: {
    backgroundColor: Colors.green_bg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A8DFC4',
    gap: 6,
  },
  instrTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.green },
  instrText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 20 },
  instrBold: { fontFamily: 'Inter_700Bold', color: Colors.ink },

  section: { gap: 10 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  sectionInstr: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, lineHeight: 18 },

  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 14,
  },
  formCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink2, marginBottom: 2 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 14,
  },

  noteCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    gap: 14,
  },
  noteCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink2, marginBottom: 2 },

  submitWrap: {
    padding: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  submitProgress: { gap: 4 },
  submitProgressTrack: { height: 3, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  submitProgressFill: { height: '100%', backgroundColor: Colors.p, borderRadius: 99 },
  submitProgressText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  submitBtn: {
    backgroundColor: Colors.p,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: Colors.ink4 },
  submitBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },
});
