/**
 * language/[code]/vocab.tsx
 * Daily vocabulary flashcards with spaced-repetition progress tracking.
 * Route: /language/:code/vocab
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';

// ── Types ──────────────────────────────────────────────────────────

type VocabWord = {
  word:            string;
  translation:     string;
  definition:      string;
  exampleSentence: string;
  partOfSpeech:    string;
  pronunciation?:  string;
};

type CardStatus = 'pending' | 'known' | 'unknown';

// ── Helpers ────────────────────────────────────────────────────────

function nextReviewDate(known: boolean): string {
  const d = new Date();
  d.setDate(d.getDate() + (known ? 7 : 1));
  return d.toISOString();
}

async function fetchTodayVocab(
  userId: string,
  languageCode: string,
  examType?: string
): Promise<VocabWord[]> {
  // 1. Try cache
  try {
    const qs  = new URLSearchParams({ userId, languageCode, module: 'vocab' });
    const res = await fetch(`${API}/content/today?${qs}`);
    if (res.ok) {
      const json = await res.json();
      const words = json.content?.words ?? json.content?.vocab ?? [];
      if (words.length > 0) return words;
    }
  } catch {}

  // 2. Generate fresh
  const res = await fetch(`${API}/content/generate`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ userId, languageCode, module: 'vocab', examType }),
  });
  if (!res.ok) throw new Error(`generate failed: ${res.status}`);
  const json = await res.json();
  return json.content?.words ?? [];
}

async function saveProgress(
  userId: string,
  languageCode: string,
  word: string,
  translation: string,
  known: boolean
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  await supabase.from('vocab_progress').upsert(
    {
      user_id:       userId,
      language_code: languageCode,
      word,
      translation,
      seen_count:    1,
      correct_count: known ? 1 : 0,
      last_seen_at:  new Date().toISOString(),
      next_review:   nextReviewDate(known),
      mastery:       known ? 'reviewing' : 'learning',
    },
    { onConflict: 'user_id,language_code,word' }
  );
}

// ── Flashcard component ────────────────────────────────────────────

const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY  = 0.3;

function FlashCard({
  word,
  onKnow,
  onStudy,
}: {
  word:    VocabWord;
  onKnow:  () => void;
  onStudy: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const flipAnim  = useRef(new Animated.Value(0)).current;
  const swipeAnim = useRef(new Animated.Value(0)).current;
  const swipeDir  = useRef<'left' | 'right' | null>(null);

  // Reset when word changes
  useEffect(() => {
    setFlipped(false);
    flipAnim.setValue(0);
    swipeAnim.setValue(0);
    swipeDir.current = null;
  }, [word.word]);

  const flip = useCallback(() => {
    Animated.spring(flipAnim, {
      toValue:         flipped ? 0 : 1,
      useNativeDriver: true,
      friction:        8,
    }).start();
    setFlipped(f => !f);
  }, [flipped, flipAnim]);

  const flyOut = useCallback((dir: 'left' | 'right', cb: () => void) => {
    Animated.timing(swipeAnim, {
      toValue:         dir === 'right' ? 400 : -400,
      duration:        220,
      useNativeDriver: true,
    }).start(cb);
  }, [swipeAnim]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder:  (_, g) => Math.abs(g.dx) > 5,
      onPanResponderMove: (_, g) => {
        swipeAnim.setValue(g.dx);
        swipeDir.current = g.dx > 0 ? 'right' : 'left';
      },
      onPanResponderRelease: (_, g) => {
        const isSwipe = Math.abs(g.dx) > SWIPE_THRESHOLD || Math.abs(g.vx) > SWIPE_VELOCITY;
        if (isSwipe) {
          if (g.dx > 0) flyOut('right', onKnow);
          else          flyOut('left',  onStudy);
        } else {
          // Snap back — counts as a tap if minimal movement
          if (Math.abs(g.dx) < 10 && Math.abs(g.dy) < 10) flip();
          Animated.spring(swipeAnim, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  const frontInterpolate = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '180deg'] });
  const backInterpolate  = flipAnim.interpolate({ inputRange: [0, 1], outputRange: ['180deg', '360deg'] });
  const rotate           = swipeAnim.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-12deg', '0deg', '12deg'] });

  // Swipe indicator opacity
  const knowOpacity  = swipeAnim.interpolate({ inputRange: [0, 80], outputRange: [0, 1], extrapolate: 'clamp' });
  const studyOpacity = swipeAnim.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <View style={fc.wrapper}>
      {/* Swipe indicators */}
      <Animated.View style={[fc.indicator, fc.knowIndicator,  { opacity: knowOpacity  }]}>
        <Text style={fc.indicatorText}>KNOW IT</Text>
      </Animated.View>
      <Animated.View style={[fc.indicator, fc.studyIndicator, { opacity: studyOpacity }]}>
        <Text style={fc.indicatorText}>STUDY MORE</Text>
      </Animated.View>

      <Animated.View
        style={{ transform: [{ translateX: swipeAnim }, { rotate }] }}
        {...panResponder.panHandlers}
      >
        {/* Front face */}
        <Animated.View
          style={[fc.card, fc.cardFront, { transform: [{ rotateY: frontInterpolate }] }]}
          pointerEvents={flipped ? 'none' : 'auto'}
        >
          <Text style={fc.partOfSpeech}>{word.partOfSpeech}</Text>
          <Text style={fc.word}>{word.word}</Text>
          {word.pronunciation ? (
            <Text style={fc.pronunciation}>/{word.pronunciation}/</Text>
          ) : null}
          <Text style={fc.tapHint}>Tap to see meaning</Text>
        </Animated.View>

        {/* Back face */}
        <Animated.View
          style={[fc.card, fc.cardBack, { transform: [{ rotateY: backInterpolate }] }]}
          pointerEvents={flipped ? 'auto' : 'none'}
        >
          <Text style={fc.translation}>{word.translation}</Text>
          <Text style={fc.definition}>{word.definition}</Text>
          <View style={fc.exampleBox}>
            <Text style={fc.exampleLabel}>Example</Text>
            <Text style={fc.exampleText}>"{word.exampleSentence}"</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Action buttons (tap fallback / desktop) */}
      <View style={fc.buttons}>
        <TouchableOpacity style={[fc.btn, fc.studyBtn]} onPress={() => flyOut('left', onStudy)} activeOpacity={0.8}>
          <Text style={fc.studyBtnText}>Study More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[fc.btn, fc.knowBtn]}  onPress={() => flyOut('right', onKnow)}  activeOpacity={0.8}>
          <Text style={fc.knowBtnText}>Know It</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── Completion screen ──────────────────────────────────────────────

function CompletionScreen({ total, known, onReset }: { total: number; known: number; onReset: () => void }) {
  return (
    <View style={cs.container}>
      <Text style={cs.emoji}>🎉</Text>
      <Text style={cs.title}>Great work!</Text>
      <Text style={cs.subtitle}>{known} of {total} words learned today</Text>
      <Text style={cs.body}>Come back tomorrow for a new set.{'\n'}Unknown words will appear again tomorrow.</Text>
      <TouchableOpacity style={cs.btn} onPress={onReset} activeOpacity={0.85}>
        <Text style={cs.btnText}>Practice Again</Text>
      </TouchableOpacity>
      <TouchableOpacity style={cs.secondary} onPress={() => router.back()} activeOpacity={0.7}>
        <Text style={cs.secondaryText}>Back to Language</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Main screen ────────────────────────────────────────────────────

export default function VocabScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { user }  = useAuth();

  const [words,   setWords]   = useState<VocabWord[]>([]);
  const [status,  setStatus]  = useState<CardStatus[]>([]);
  const [index,   setIndex]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [done,    setDone]    = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const ws = await fetchTodayVocab(user.id, code as string);
      setWords(ws.slice(0, 10));
      setStatus(new Array(Math.min(ws.length, 10)).fill('pending'));
      setIndex(0);
      setDone(false);
    } catch (err: any) {
      setError('Could not load vocabulary. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [user, code]);

  useEffect(() => { load(); }, [load]);

  const handleResult = useCallback(async (known: boolean) => {
    if (!user || index >= words.length) return;
    const word = words[index];

    // Update local status
    setStatus(prev => {
      const next = [...prev];
      next[index] = known ? 'known' : 'unknown';
      return next;
    });

    // Persist to Supabase (fire and forget)
    saveProgress(user.id, code as string, word.word, word.translation, known)
      .catch(err => console.warn('[vocab] saveProgress error:', err));

    const next = index + 1;
    if (next >= words.length) {
      setDone(true);
    } else {
      setIndex(next);
    }
  }, [user, code, index, words]);

  const knownCount = status.filter(s => s === 'known').length;

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.p} />
          <Text style={s.loadingText}>Preparing your vocabulary…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || words.length === 0) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <Text style={s.errorText}>{error ?? 'No vocabulary available today.'}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={load}>
            <Text style={s.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (done) {
    return (
      <SafeAreaView style={s.safe}>
        <CompletionScreen total={words.length} known={knownCount} onReset={load} />
      </SafeAreaView>
    );
  }

  const current = words[index];

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Vocabulary</Text>
        <Text style={s.counter}>{index + 1} / {words.length}</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressWrap}>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${(knownCount / words.length) * 100}%` as any }]} />
        </View>
        <Text style={s.progressLabel}>{knownCount} / {words.length} words learned today</Text>
      </View>

      {/* Dot row */}
      <View style={s.dots}>
        {words.map((_, i) => (
          <View
            key={i}
            style={[
              s.dot,
              i === index           && s.dotActive,
              status[i] === 'known' && s.dotKnown,
              status[i] === 'unknown' && s.dotUnknown,
            ]}
          />
        ))}
      </View>

      {/* Flashcard */}
      <FlashCard
        key={current.word}
        word={current}
        onKnow={() => handleResult(true)}
        onStudy={() => handleResult(false)}
      />
    </SafeAreaView>
  );
}

// ── Flashcard styles ──────────────────────────────────────────────
const fc = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  indicator: {
    position: 'absolute',
    top: 60,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
  },
  knowIndicator: {
    right: 30,
    borderColor: Colors.green,
    backgroundColor: Colors.green_bg,
  },
  studyIndicator: {
    left: 30,
    borderColor: Colors.danger,
    backgroundColor: Colors.danger_bg,
  },
  indicatorText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    letterSpacing: 0.8,
    color: Colors.ink,
  },
  card: {
    width: 320,
    height: 400,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    backfaceVisibility: 'hidden',
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardFront: { backgroundColor: Colors.white },
  cardBack: {
    position: 'absolute',
    top: 0, left: 0,
    backgroundColor: '#F8F6FF',
  },
  partOfSpeech: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.p,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  word: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: 8,
  },
  pronunciation: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.ink3,
    marginBottom: 20,
  },
  tapHint: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.ink4,
    marginTop: 24,
  },
  translation: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: 10,
  },
  definition: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.ink2,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 20,
  },
  exampleBox: {
    width: '100%',
    backgroundColor: Colors.p_soft,
    borderRadius: 10,
    padding: 14,
    gap: 4,
  },
  exampleLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.p,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  exampleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.ink,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  studyBtn: { backgroundColor: Colors.danger_bg, borderColor: Colors.danger },
  knowBtn:  { backgroundColor: Colors.green_bg,  borderColor: Colors.green  },
  studyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.danger },
  knowBtnText:  { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.green  },
});

// ── Completion styles ──────────────────────────────────────────────
const cs = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 12 },
  emoji:     { fontSize: 56 },
  title:     { fontFamily: 'Inter_700Bold', fontSize: 28, color: Colors.ink },
  subtitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: Colors.p },
  body:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center', lineHeight: 22, marginTop: 4 },
  btn: {
    marginTop: 20,
    width: '100%',
    height: 52,
    backgroundColor: Colors.p,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText:       { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white },
  secondary:     { paddingVertical: 12 },
  secondaryText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },
});

// ── Screen styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  back:    { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  title:   { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  counter: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },

  progressWrap: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, backgroundColor: Colors.white },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.bg2,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.green,
    borderRadius: 3,
  },
  progressLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.ink3,
    marginTop: 6,
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
  },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.bg2 },
  dotActive:  { backgroundColor: Colors.p },
  dotKnown:   { backgroundColor: Colors.green },
  dotUnknown: { backgroundColor: Colors.danger },

  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginTop: 12 },
  errorText:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center' },
  retryBtn:    { marginTop: 8, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.p, borderRadius: 10 },
  retryText:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
});
