import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { setSpeakingResult, buildMockResult, TranscriptMsg } from '@/lib/speakingStore';

// ─────────────────────────────────────────────────────────────────
// Script / conversation data
// ─────────────────────────────────────────────────────────────────
const PART1_QS = [
  "Good morning. My name is Sarah and I'm your IELTS examiner today. Can you tell me your full name please?",
  "Thank you. Now I'd like to ask you about your hometown. Can you describe the place where you grew up?",
  "Interesting. Do you still live there now or have you moved somewhere else?",
  "Now let's talk about your work or studies. What do you do currently?",
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
  "How important is it for children to develop reading habits early in life?",
];

// Demo timers (real values: PREP=60, SPEAK=120)
const PREP_SECONDS   = 15;
const SPEAK_SECONDS  = 20;
const TYPING_DELAY   = 1400; // ms to show typing indicator

// ─────────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────────
function TypingIndicator() {
  const dots = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  useEffect(() => {
    const anims = dots.map((d, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 160),
          Animated.timing(d, { toValue: -6, duration: 280, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.timing(d, { toValue: 0,  duration: 280, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
          Animated.delay(200),
        ])
      )
    );
    anims.forEach(a => a.start());
    return () => anims.forEach(a => a.stop());
  }, []);

  return (
    <View style={ty.bubble}>
      {dots.map((d, i) => (
        <Animated.View key={i} style={[ty.dot, { transform: [{ translateY: d }] }]} />
      ))}
    </View>
  );
}

const ty = StyleSheet.create({
  bubble: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: Colors.bg2,
    borderRadius: 16, borderBottomLeftRadius: 4,
    paddingHorizontal: 16, paddingVertical: 14,
    alignSelf: 'flex-start',
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.ink4 },
});

// ─────────────────────────────────────────────────────────────────
// Mic pulse button
// ─────────────────────────────────────────────────────────────────
function MicPulse({ active }: { active: boolean }) {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      scale.setValue(1);
      opacity.setValue(0);
      return;
    }
    const pulse = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 1.55, duration: 900, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,    duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0.35, duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0,    duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [active]);

  return (
    <View style={mp.wrap}>
      <Animated.View style={[mp.ring, { transform: [{ scale }], opacity }]} />
      <View style={[mp.btn, active && mp.btnActive]}>
        <Text style={mp.icon}>🎙</Text>
      </View>
    </View>
  );
}

const mp = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center', width: 72, height: 72 },
  ring: {
    position: 'absolute',
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.p,
  },
  btn: {
    width: 58, height: 58, borderRadius: 29,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.border,
  },
  btnActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  icon: { fontSize: 24 },
});

// ─────────────────────────────────────────────────────────────────
// Countdown timer (Part 2 prep / speaking)
// ─────────────────────────────────────────────────────────────────
function CountdownDisplay({ seconds, label, color }: { seconds: number; label: string; color: string }) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return (
    <View style={cd.wrap}>
      <Text style={cd.label}>{label}</Text>
      <Text style={[cd.time, { color }]}>
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </Text>
    </View>
  );
}

const cd = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 16, paddingHorizontal: 24,
    alignItems: 'center', gap: 4,
    marginHorizontal: 16,
  },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  time:  { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52, lineHeight: 58 },
});

// ─────────────────────────────────────────────────────────────────
// Cue card
// ─────────────────────────────────────────────────────────────────
function CueCard() {
  return (
    <View style={cc.wrap}>
      <View style={cc.topBar}>
        <Text style={cc.topBarText}>📋  Topic Card — Part 2</Text>
      </View>
      <View style={cc.body}>
        {CUE_CARD.map((line, i) => (
          <Text key={i} style={[cc.line, i === 0 && cc.lineTitle]}>{line}</Text>
        ))}
      </View>
    </View>
  );
}

const cc = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.white,
    borderRadius: 14, borderWidth: 1.5, borderColor: Colors.p,
    overflow: 'hidden', marginHorizontal: 16,
  },
  topBar: { backgroundColor: Colors.p, paddingVertical: 8, paddingHorizontal: 14 },
  topBarText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white },
  body: { padding: 14, gap: 4 },
  line: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, lineHeight: 21 },
  lineTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, marginBottom: 4 },
});

// ─────────────────────────────────────────────────────────────────
// Phase badge
// ─────────────────────────────────────────────────────────────────
function PhaseBadge({ label }: { label: string }) {
  return (
    <View style={pb.row}>
      <View style={pb.badge}><Text style={pb.text}>{label}</Text></View>
    </View>
  );
}
const pb = StyleSheet.create({
  row: { alignItems: 'center', paddingVertical: 6 },
  badge: {
    backgroundColor: Colors.p_soft,
    borderRadius: 99, paddingHorizontal: 16, paddingVertical: 6,
    borderWidth: 1, borderColor: '#C4BEFF',
  },
  text: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.p },
});

// ─────────────────────────────────────────────────────────────────
// Sleep helper
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// Content item types shown in the scroll area
// ─────────────────────────────────────────────────────────────────
type ContentItem =
  | { kind: 'phase_badge'; label: string; id: string }
  | { kind: 'examiner_msg'; text: string; id: string }
  | { kind: 'user_turn'; text: string; id: string }
  | { kind: 'cue_card'; id: string }
  | { kind: 'countdown_prep'; id: string }
  | { kind: 'countdown_speak'; id: string };

// ─────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────
export default function SpeakingSessionScreen() {
  const params  = useLocalSearchParams<{ exam?: string; part?: string }>();
  const exam    = params.exam ?? 'IELTS';
  const part    = params.part ?? 'Full Test';

  const [items,       setItems]       = useState<ContentItem[]>([]);
  const [showTyping,  setShowTyping]  = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [phaseBadge,  setPhaseBadge]  = useState('Part 1 of 3');
  const [prepSecs,    setPrepSecs]    = useState(PREP_SECONDS);
  const [speakSecs,   setSpeakSecs]   = useState(SPEAK_SECONDS);
  const [countMode,   setCountMode]   = useState<'none' | 'prep' | 'speak'>('none');
  const [ending,      setEnding]      = useState(false);

  const scrollRef    = useRef<ScrollView>(null);
  const transcriptRef = useRef<TranscriptMsg[]>([]);
  const startedAt    = useRef(Date.now());
  const { sleep, cancel, cancelRef } = useSleep();

  // Auto-scroll whenever items or typing changes
  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 80);
  }, [items, showTyping, countMode]);

  // ── Helpers ──────────────────────────────────────────────────
  function addItem(item: ContentItem) {
    setItems(prev => [...prev, item]);
  }

  function pushExaminer(text: string) {
    const id = Math.random().toString(36).slice(2);
    addItem({ kind: 'examiner_msg', text, id });
    transcriptRef.current.push({ role: 'examiner', text });
  }

  function pushUser(text: string) {
    const id = Math.random().toString(36).slice(2);
    addItem({ kind: 'user_turn', text, id });
    transcriptRef.current.push({ role: 'user', text });
  }

  async function showExaminer(text: string, preDelay = 600) {
    if (cancelRef.current) return;
    await sleep(preDelay);
    if (cancelRef.current) return;
    setShowTyping(true);
    await sleep(TYPING_DELAY);
    if (cancelRef.current) return;
    setShowTyping(false);
    pushExaminer(text);
  }

  // ── Main script ───────────────────────────────────────────────
  useEffect(() => {
    async function run() {
      // ── Part 1 ──
      addItem({ kind: 'phase_badge', label: 'Part 1 of 3 — Introduction', id: 'p1' });
      setPhaseBadge('Part 1 of 3');

      for (let i = 0; i < PART1_QS.length; i++) {
        if (cancelRef.current) return;
        await showExaminer(PART1_QS[i], i === 0 ? 400 : 800);
        if (cancelRef.current) return;
        setIsRecording(true);
        await sleep(i < 2 ? 3500 : 5000);
        if (cancelRef.current) return;
        setIsRecording(false);
        pushUser('Your response...');
        await sleep(600);
      }

      // ── Part 2 ──
      addItem({ kind: 'phase_badge', label: 'Part 2 of 3 — Individual Long Turn', id: 'p2' });
      setPhaseBadge('Part 2 of 3');

      await showExaminer(PART2_INTRO);
      if (cancelRef.current) return;
      await sleep(500);
      addItem({ kind: 'cue_card', id: 'cue' });

      // Prep countdown
      await sleep(600);
      addItem({ kind: 'countdown_prep', id: 'prep' });
      setCountMode('prep');
      let p = PREP_SECONDS;
      while (p > 0 && !cancelRef.current) {
        await sleep(1000);
        p--;
        setPrepSecs(p);
      }
      setCountMode('none');
      if (cancelRef.current) return;

      await showExaminer(PART2_BEGIN, 300);
      if (cancelRef.current) return;

      // Speaking countdown
      await sleep(400);
      addItem({ kind: 'countdown_speak', id: 'speak' });
      setCountMode('speak');
      setIsRecording(true);
      let sp = SPEAK_SECONDS;
      while (sp > 0 && !cancelRef.current) {
        await sleep(1000);
        sp--;
        setSpeakSecs(sp);
      }
      setIsRecording(false);
      setCountMode('none');
      if (cancelRef.current) return;
      pushUser('Your response...');

      // ── Part 3 ──
      addItem({ kind: 'phase_badge', label: 'Part 3 of 3 — Two-way Discussion', id: 'p3' });
      setPhaseBadge('Part 3 of 3');

      for (let i = 0; i < PART3_QS.length; i++) {
        if (cancelRef.current) return;
        await showExaminer(PART3_QS[i]);
        if (cancelRef.current) return;
        setIsRecording(true);
        await sleep(5000);
        if (cancelRef.current) return;
        setIsRecording(false);
        pushUser('Your response...');
        await sleep(600);
      }

      // Wrap up
      if (!cancelRef.current) {
        await showExaminer("That is the end of the speaking test. Thank you.");
      }
    }

    run();
    return () => { cancel(); };
  }, []);

  // ── End session ────────────────────────────────────────────────
  const handleEnd = useCallback(() => {
    cancel();
    setEnding(true);
    setIsRecording(false);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    setTimeout(() => {
      const result = buildMockResult(exam, part, timeTaken, transcriptRef.current);
      setSpeakingResult(result);
      router.replace('/modules/speaking/results' as any);
    }, 2000);
  }, [exam, part]);

  // ── Render ─────────────────────────────────────────────────────
  if (ending) {
    return (
      <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
        <View style={s.analysing}>
          <ActivityIndicator size="large" color={Colors.p} />
          <Text style={s.analysingTitle}>Analysing your response…</Text>
          <Text style={s.analysingText}>Generating detailed feedback</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Speaking · {exam}</Text>
          <View style={s.liveRow}>
            <View style={s.liveDot} />
            <Text style={s.liveText}>Live</Text>
          </View>
        </View>

        {/* Camera placeholder */}
        <View style={s.camWrap}>
          <Text style={s.camIcon}>📷</Text>
        </View>
      </View>

      {/* Phase badge strip */}
      <View style={s.phaseStrip}>
        <View style={s.phasePill}>
          <Text style={s.phaseText}>{phaseBadge}</Text>
        </View>
      </View>

      {/* ── Transcript scroll ── */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={s.transcript}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {items.map(item => {
          switch (item.kind) {
            case 'phase_badge':
              return (
                <View key={item.id} style={s.phaseDivider}>
                  <View style={s.phaseDivLine} />
                  <Text style={s.phaseDivText}>{item.label}</Text>
                  <View style={s.phaseDivLine} />
                </View>
              );

            case 'examiner_msg':
              return (
                <View key={item.id} style={s.examinerRow}>
                  <View style={s.examinerAvatar}><Text style={s.examinerAvatarText}>S</Text></View>
                  <View style={s.examinerBubble}>
                    <Text style={s.examinerText}>{item.text}</Text>
                  </View>
                </View>
              );

            case 'user_turn':
              return (
                <View key={item.id} style={s.userRow}>
                  <View style={s.userBubble}>
                    <Text style={s.userText}>{item.text}</Text>
                  </View>
                </View>
              );

            case 'cue_card':
              return <CueCard key={item.id} />;

            case 'countdown_prep':
              return (
                <CountdownDisplay
                  key={item.id}
                  seconds={prepSecs}
                  label="Preparation time"
                  color={Colors.gold}
                />
              );

            case 'countdown_speak':
              return (
                <CountdownDisplay
                  key={item.id}
                  seconds={speakSecs}
                  label="Speaking time"
                  color={Colors.p}
                />
              );

            default:
              return null;
          }
        })}

        {/* Typing indicator */}
        {showTyping && (
          <View style={s.examinerRow}>
            <View style={s.examinerAvatar}><Text style={s.examinerAvatarText}>S</Text></View>
            <TypingIndicator />
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* ── Bottom bar ── */}
      <View style={s.bottomBar}>
        <MicPulse active={isRecording} />
        <View style={s.bottomCenter}>
          <Text style={s.bottomStatus}>
            {isRecording ? 'Listening to you speak…' : 'Examiner is speaking…'}
          </Text>
          <Text style={s.bottomHint}>
            {isRecording ? 'Answer naturally and completely' : 'Please wait'}
          </Text>
        </View>
        <TouchableOpacity style={s.endBtn} onPress={handleEnd} activeOpacity={0.85}>
          <Text style={s.endBtnText}>End</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  analysing: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40,
  },
  analysingTitle: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.ink, textAlign: 'center' },
  analysingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10, gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 17, color: Colors.ink },
  headerCenter: { flex: 1, gap: 3 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.green,
    shadowColor: Colors.green, shadowOpacity: 0.8, shadowRadius: 4,
  },
  liveText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.green },
  camWrap: {
    width: 52, height: 52, borderRadius: 12,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  camIcon: { fontSize: 22 },

  phaseStrip: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: 8, paddingHorizontal: 14,
    flexDirection: 'row',
  },
  phasePill: {
    backgroundColor: Colors.p_soft,
    borderRadius: 99, paddingHorizontal: 14, paddingVertical: 5,
    borderWidth: 1, borderColor: '#C4BEFF',
  },
  phaseText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.p },

  transcript: { paddingTop: 12, paddingHorizontal: 14, gap: 10 },

  phaseDivider: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4,
  },
  phaseDivLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  phaseDivText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink3 },

  examinerRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, maxWidth: '85%' },
  examinerAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  examinerAvatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },
  examinerBubble: {
    backgroundColor: Colors.bg2,
    borderRadius: 16, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    flex: 1,
  },
  examinerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, lineHeight: 22 },

  userRow: { flexDirection: 'row', justifyContent: 'flex-end' },
  userBubble: {
    backgroundColor: Colors.p,
    borderRadius: 16, borderBottomRightRadius: 4,
    paddingHorizontal: 14, paddingVertical: 10,
    maxWidth: '80%',
  },
  userText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.white, lineHeight: 22 },

  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 14,
  },
  bottomCenter: { flex: 1, gap: 3 },
  bottomStatus: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  bottomHint: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  endBtn: {
    backgroundColor: Colors.danger,
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 11,
  },
  endBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.white },
});
