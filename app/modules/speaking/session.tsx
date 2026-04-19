import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Animated, Easing, ActivityIndicator, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SpeakingSidebar } from '@/components/layout/SpeakingSidebar';
import { MicIcon } from '@/components/icons';
import { setSpeakingResult, buildMockResult, type TranscriptMsg } from '@/lib/speakingStore';
import { Analytics } from '@/lib/analytics';

const PURPLE    = '#5B4EFF';
const PURPLE_BG = '#F0EEFF';
const RED       = '#C04A06';
const GREEN     = '#16A34A';

// ── Script ────────────────────────────────────────────────────────
const PART1_QS = [
  "Good morning. My name is Sarah and I'm your IELTS examiner today. Can you tell me your full name please?",
  "Can you describe the place where you grew up?",
  "Do you still live there now or have you moved somewhere else?",
  "What do you do currently — are you working or studying?",
];

const PART2_INTRO = "Now I'd like you to talk about a topic for 1–2 minutes. Here is your topic card. You'll have one minute to prepare.";
const PART2_BEGIN = "All right, please begin talking. You have two minutes.";

const CUE_CARD = [
  'Describe a book you have read recently.',
  '',
  'You should say:',
  '  • what the book was about',
  '  • why you chose to read it',
  '  • what you liked or disliked about it',
  '  • and explain what you learned from it',
];

const PART3_QS = [
  "Do you think reading habits have changed in recent years? Why?",
  "How important is it for children to develop reading habits early?",
];

const PREP_SECONDS  = 15;
const SPEAK_SECONDS = 20;
const TYPING_DELAY  = 1200;

const TIPS: Record<string, string> = {
  'Part 1':   'Give extended answers with reasons and examples — don\'t just say "yes" or "no".',
  'Part 2':   'Use your 1-minute prep time to jot mental bullet points. Speak continuously.',
  'Part 3':   'Show critical thinking — explore multiple perspectives and give examples.',
  'Full Test':'Maintain consistent pace and vocabulary throughout all three parts.',
};

// ── Wave visualizer (recording animation) ─────────────────────────
function WaveVisualizer({ active }: { active: boolean }) {
  const bars = useRef([...Array(5)].map(() => new Animated.Value(0.25))).current;

  useEffect(() => {
    if (!active) {
      bars.forEach(b => Animated.timing(b, { toValue: 0.25, duration: 200, useNativeDriver: true }).start());
      return;
    }
    const heights = [0.6, 0.9, 1.0, 0.85, 0.55];
    const anims = bars.map((bar, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 90),
          Animated.timing(bar, { toValue: heights[i], duration: 380, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(bar, { toValue: 0.2, duration: 380, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, [active]);

  return (
    <View style={wv.row}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[wv.bar, { transform: [{ scaleY: bar }] }]}
        />
      ))}
    </View>
  );
}

const wv = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, height: 56, justifyContent: 'center' },
  bar: { width: 7, height: 44, borderRadius: 4, backgroundColor: PURPLE },
});

// ── Typing indicator ──────────────────────────────────────────────
function TypingDots() {
  const dots = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(d, { toValue: -5, duration: 260, useNativeDriver: true }),
          Animated.timing(d, { toValue: 0,  duration: 260, useNativeDriver: true }),
          Animated.delay(200),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={td.row}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={[td.dot, { transform: [{ translateY: d }] }]} />
      ))}
    </View>
  );
}

const td = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6 },
  dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: Colors.ink4 },
});

// ── Sleep helper ──────────────────────────────────────────────────
function useSleep() {
  const cancelRef = useRef(false);
  const timers    = useRef<ReturnType<typeof setTimeout>[]>([]);

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
      const t = setTimeout(resolve, ms);
      timers.current.push(t);
    });
  }

  function cancel() {
    cancelRef.current = true;
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  return { sleep, cancel, cancelRef };
}

// ── Main screen ───────────────────────────────────────────────────
export default function SpeakingSessionScreen() {
  const { width }  = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;
  const params     = useLocalSearchParams<{ exam?: string; part?: string }>();
  const exam       = params.exam ?? 'IELTS';
  const part       = params.part ?? 'Full Test';

  const [currentQuestion, setCurrentQuestion] = useState('Getting ready…');
  const [partLabel,       setPartLabel]        = useState('Part 1 — Question 1/4');
  const [currentTip,      setCurrentTip]       = useState(TIPS[part] ?? TIPS['Full Test']);
  const [isRecording,     setIsRecording]      = useState(false);
  const [showTyping,      setShowTyping]       = useState(false);
  const [prepSecs,        setPrepSecs]         = useState(PREP_SECONDS);
  const [speakSecs,       setSpeakSecs]        = useState(SPEAK_SECONDS);
  const [countMode,       setCountMode]        = useState<'none' | 'prep' | 'speak'>('none');
  const [, setTranscriptLines]  = useState<string[]>([]);
  const [ending,          setEnding]           = useState(false);
  const [userResponse,    setUserResponse]     = useState('');

  const transcriptRef = useRef<TranscriptMsg[]>([]);
  const startedAt     = useRef(Date.now());
  const { sleep, cancel, cancelRef } = useSleep();

  useEffect(() => {
    Analytics.practiceSessionStarted({ module: 'speaking', languageCode: 'en', examType: exam, mode: 'practice' });
  }, []);

  function pushExaminer(text: string) {
    transcriptRef.current.push({ role: 'examiner', text });
  }

  function pushUser(text: string) {
    transcriptRef.current.push({ role: 'user', text });
    setTranscriptLines(prev => [...prev, text]);
    setUserResponse(text);
  }

  async function showQuestion(text: string, label: string, tip?: string, preDelay = 600) {
    if (cancelRef.current) return;
    await sleep(preDelay);
    if (cancelRef.current) return;
    setShowTyping(true);
    await sleep(TYPING_DELAY);
    if (cancelRef.current) return;
    setShowTyping(false);
    setCurrentQuestion(text);
    setPartLabel(label);
    if (tip) setCurrentTip(tip);
    pushExaminer(text);
  }

  // ── Auto script ───────────────────────────────────────────────
  useEffect(() => {
    async function run() {
      // Part 1
      for (let i = 0; i < PART1_QS.length; i++) {
        if (cancelRef.current) return;
        await showQuestion(
          PART1_QS[i],
          `Part 1 — Question ${i + 1}/${PART1_QS.length}`,
          TIPS['Part 1'],
          i === 0 ? 600 : 800
        );
        if (cancelRef.current) return;
        setIsRecording(true);
        setUserResponse('');
        await sleep(i < 2 ? 3500 : 5000);
        if (cancelRef.current) return;
        setIsRecording(false);
        pushUser('Your response…');
        await sleep(500);
      }

      // Part 2
      await showQuestion(PART2_INTRO, 'Part 2 — Cue Card', TIPS['Part 2']);
      if (cancelRef.current) return;

      // Show cue card in question area
      setCurrentQuestion(CUE_CARD.join('\n'));
      setPartLabel('Part 2 — Preparation (1 min)');

      setCountMode('prep');
      let p = PREP_SECONDS;
      while (p > 0 && !cancelRef.current) { await sleep(1000); p--; setPrepSecs(p); }
      setCountMode('none');
      if (cancelRef.current) return;

      await showQuestion(PART2_BEGIN, 'Part 2 — Speaking (2 min)', TIPS['Part 2'], 300);
      if (cancelRef.current) return;
      setCountMode('speak');
      setIsRecording(true);
      setUserResponse('');
      let sp = SPEAK_SECONDS;
      while (sp > 0 && !cancelRef.current) { await sleep(1000); sp--; setSpeakSecs(sp); }
      setIsRecording(false);
      setCountMode('none');
      if (cancelRef.current) return;
      pushUser('Your response…');

      // Part 3
      for (let i = 0; i < PART3_QS.length; i++) {
        if (cancelRef.current) return;
        await showQuestion(
          PART3_QS[i],
          `Part 3 — Question ${i + 1}/${PART3_QS.length}`,
          TIPS['Part 3']
        );
        if (cancelRef.current) return;
        setIsRecording(true);
        setUserResponse('');
        await sleep(5000);
        if (cancelRef.current) return;
        setIsRecording(false);
        pushUser('Your response…');
        await sleep(500);
      }

      if (!cancelRef.current) {
        await showQuestion('That is the end of the speaking test. Thank you very much.', 'Complete ✓');
      }
    }
    run();
    return () => { cancel(); };
  }, []);

  const handleEnd = useCallback(() => {
    cancel();
    setEnding(true);
    setIsRecording(false);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    Analytics.practiceSessionCompleted({ module: 'speaking', languageCode: 'en', examType: exam, durationSeconds: timeTaken });
    setTimeout(() => {
      const result = buildMockResult(exam, part, timeTaken, transcriptRef.current);
      setSpeakingResult(result);
      router.replace('/modules/speaking/results' as any);
    }, 2000);
  }, [exam, part]);

  // ── Analysing overlay ─────────────────────────────────────────
  if (ending) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={PURPLE} />
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.ink, marginTop: 20 }}>
          Analysing your response…
        </Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginTop: 6 }}>
          Generating detailed feedback
        </Text>
      </SafeAreaView>
    );
  }

  const timerSecs  = countMode === 'prep' ? prepSecs : countMode === 'speak' ? speakSecs : null;
  const timerLabel = countMode === 'prep' ? 'Prep time' : 'Speaking time';
  const mm = timerSecs != null ? String(Math.floor(timerSecs / 60)).padStart(2, '0') : '';
  const ss = timerSecs != null ? String(timerSecs % 60).padStart(2, '0') : '';

  // ── Left panel ────────────────────────────────────────────────
  const leftPanel = (
    <View style={s.leftPanel}>

      {/* Examiner avatar */}
      <View style={s.examinerCard}>
        <View style={s.avatarCircle}>
          <Text style={s.avatarText}>AI</Text>
        </View>
        <Text style={s.examinerTitle}>IELTS Examiner</Text>
      </View>

      {/* Current question */}
      <View style={s.questionCard}>
        <Text style={s.questionLabel}>{partLabel.toUpperCase()}</Text>
        {showTyping ? (
          <TypingDots />
        ) : (
          <Text style={s.questionText}>{currentQuestion}</Text>
        )}
      </View>

      {/* Tip */}
      <View style={s.tipCard}>
        <Text style={s.tipLabel}>TIP</Text>
        <Text style={s.tipText}>{currentTip}</Text>
      </View>

      {/* Timer */}
      {timerSecs !== null && (
        <View style={s.timerBox}>
          <Text style={s.timerTime}>
            {mm}:{ss}
          </Text>
          <Text style={s.timerLabel}>{timerLabel}</Text>
        </View>
      )}
    </View>
  );

  // ── Right panel ───────────────────────────────────────────────
  const rightPanel = (
    <View style={s.rightPanel}>

      {/* Visualizer */}
      <View style={s.visualizerBox}>
        {isRecording ? (
          <>
            <WaveVisualizer active={isRecording} />
            <Text style={s.recordingText}>Recording…</Text>
          </>
        ) : (
          <>
            <MicIcon size={36} color="#CCC" />
            <Text style={s.idleText}>Examiner is speaking</Text>
          </>
        )}
      </View>

      {/* Transcript box */}
      <View style={s.transcriptBox}>
        <Text style={s.transcriptLabel}>YOUR RESPONSE</Text>
        {userResponse ? (
          <Text style={s.transcriptText}>{userResponse}</Text>
        ) : (
          <Text style={s.transcriptPlaceholder}>Your words will appear here…</Text>
        )}
      </View>

      {/* Control buttons */}
      <View style={s.controls}>
        <TouchableOpacity
          style={s.skipBtn}
          onPress={handleEnd}
          activeOpacity={0.8}
        >
          <Text style={s.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.micBtn, isRecording && s.micBtnRecording]}
          onPress={() => setIsRecording(r => !r)}
          activeOpacity={0.85}
        >
          <MicIcon size={16} color={Colors.white} />
          <Text style={s.micBtnText}>
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.nextBtn, !isRecording && s.nextBtnEnabled]}
          activeOpacity={0.85}
        >
          <Text style={[s.nextText, isRecording && s.nextTextDisabled]}>Next</Text>
        </TouchableOpacity>
      </View>

    </View>
  );

  // ── Desktop layout ─────────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <SpeakingSidebar />
        <View style={s.desktopLeft}>{leftPanel}</View>
        <View style={s.desktopRight}>{rightPanel}</View>
      </View>
    );
  }

  // ── Mobile layout ──────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
    flex: 0, width: '38%' as any,
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  desktopRight: { flex: 1, backgroundColor: Colors.bg },

  // ── Left panel ─────────────────────────────────────────────────
  leftPanel: { padding: 24, gap: 14, flex: 1 },

  examinerCard: {
    backgroundColor: PURPLE_BG, borderRadius: 16, padding: 20,
    alignItems: 'center', gap: 8,
  },
  avatarCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:    { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.white },
  examinerTitle: { fontFamily: 'Inter_500Medium', fontSize: 12, color: PURPLE },

  questionCard: {
    backgroundColor: '#F9F8F5', borderRadius: 12, padding: 16,
  },
  questionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888',
    letterSpacing: 0.6, textTransform: 'uppercase' as const, marginBottom: 8,
  },
  questionText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#000', lineHeight: 26 },

  tipCard: {
    backgroundColor: '#EDFAF4', borderRadius: 8, padding: 10, gap: 3,
  },
  tipLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 10, color: '#16A34A',
    textTransform: 'uppercase' as const, letterSpacing: 0.5,
  },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#16A34A', lineHeight: 18 },

  timerBox: { alignItems: 'center', marginTop: 4 },
  timerTime: { fontFamily: 'Inter_700Bold', fontSize: 36, color: RED },
  timerLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', marginTop: 2 },

  // ── Right panel ─────────────────────────────────────────────────
  rightPanel: { padding: 24, gap: 14, flex: 1 },

  visualizerBox: {
    backgroundColor: '#F9F8F5', borderRadius: 16, height: 160,
    alignItems: 'center', justifyContent: 'center', gap: 10,
  },
  recordingText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: PURPLE },
  idleText:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#BBB' },

  transcriptBox: {
    backgroundColor: Colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 16, minHeight: 120,
  },
  transcriptLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#999',
    textTransform: 'uppercase' as const, letterSpacing: 0.6, marginBottom: 8,
  },
  transcriptText:       { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#000', lineHeight: 24 },
  transcriptPlaceholder:{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#BBB', fontStyle: 'italic' },

  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  skipBtn: {
    backgroundColor: '#F4F4F0', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 18,
  },
  skipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888' },

  micBtn: {
    flex: 1, backgroundColor: PURPLE, borderRadius: 50,
    paddingVertical: 14, paddingHorizontal: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  micBtnRecording: { backgroundColor: RED },
  micBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },

  nextBtn: {
    backgroundColor: '#F4F4F0', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 18,
  },
  nextBtnEnabled: { backgroundColor: '#000' },
  nextText:         { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
  nextTextDisabled: { color: '#AAA' },
});
