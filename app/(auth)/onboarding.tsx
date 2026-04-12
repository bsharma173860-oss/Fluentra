import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';

const { width: W } = Dimensions.get('window');
const H_PAD = 24;

// ── Exam options ──────────────────────────────────────────────
type ExamOption = {
  key: string;
  label: string;
  subtitle: string;
  emoji: string;
  color: string;
  bgColor: string;
  minScore: number;
  maxScore: number;
  step: number;
};

const EXAMS: ExamOption[] = [
  { key: 'IELTS',   label: 'IELTS',    subtitle: 'Academic & General',        emoji: '🇬🇧', color: Colors.p,      bgColor: Colors.p_soft,   minScore: 4,  maxScore: 9,   step: 0.5 },
  { key: 'TOEFL',   label: 'TOEFL',    subtitle: 'iBT Internet-Based Test',   emoji: '🇺🇸', color: Colors.green,  bgColor: Colors.green_bg, minScore: 40, maxScore: 120, step: 5   },
  { key: 'DELF',    label: 'DELF B2',  subtitle: 'Diplôme Français',          emoji: '🇫🇷', color: Colors.gold,   bgColor: Colors.gold_bg,  minScore: 40, maxScore: 100, step: 5   },
  { key: 'DELE',    label: 'DELE B2',  subtitle: 'Diploma de Español',        emoji: '🇪🇸', color: Colors.orange, bgColor: Colors.orange_bg,minScore: 40, maxScore: 100, step: 5   },
  { key: 'FREE',    label: 'Free Chat','subtitle': 'No exam — just practice', emoji: '✨', color: Colors.p,      bgColor: Colors.p_soft,   minScore: 0,  maxScore: 100, step: 5   },
];

// ── Draggable score slider ────────────────────────────────────
function ScoreSlider({
  value,
  min,
  max,
  step,
  color,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  onChange: (v: number) => void;
}) {
  const trackW = W - H_PAD * 2 - 32;
  const pct = (value - min) / (max - min);
  const thumbX = pct * trackW;

  const pan = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gs) => {
      const newPct = Math.min(1, Math.max(0, (thumbX + gs.dx) / trackW));
      const raw = min + newPct * (max - min);
      const snapped = Math.round(raw / step) * step;
      onChange(parseFloat(Math.min(max, Math.max(min, snapped)).toFixed(1)));
    },
  });

  return (
    <View style={sl.wrap}>
      <Text style={[sl.bigVal, { color }]}>{value.toFixed(step < 1 ? 1 : 0)}</Text>
      <Text style={sl.bigLabel}>{max <= 9 ? 'Band Score' : 'Score'}</Text>
      <View style={[sl.track, { width: trackW }]}>
        <View style={[sl.fill, { width: thumbX, backgroundColor: color }]} />
        <View style={[sl.thumb, { left: thumbX - 16, borderColor: color }]} {...pan.panHandlers} />
      </View>
      <View style={[sl.ticks, { width: trackW }]}>
        <Text style={sl.tick}>{min}</Text>
        <Text style={sl.tick}>{((min + max) / 2).toFixed(0)}</Text>
        <Text style={sl.tick}>{max}</Text>
      </View>
    </View>
  );
}

const sl = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4, paddingHorizontal: 16 },
  bigVal: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 72 },
  bigLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginBottom: 16 },
  track: {
    height: 6,
    backgroundColor: Colors.bg2,
    borderRadius: 99,
    position: 'relative',
    marginBottom: 8,
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 6,
    borderRadius: 99,
  },
  thumb: {
    position: 'absolute',
    top: -13,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  ticks: { flexDirection: 'row', justifyContent: 'space-between' },
  tick: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
});

// ── Main ──────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [exam, setExam] = useState<ExamOption>(EXAMS[0]);
  const [score, setScore] = useState(7.0);
  const [nativeLang, setNativeLang] = useState('');
  const [saving, setSaving] = useState(false);

  function goNext() {
    if (step < 2) {
      // Reset score when exam changes
      if (step === 0) setScore(exam.minScore + (exam.maxScore - exam.minScore) * 0.6);
      setStep(s => s + 1);
    } else {
      handleSave();
    }
  }

  async function handleSave() {
    setSaving(true);
    if (user) {
      await supabase
        .from('profiles')
        .update({
          target_exam: exam.key,
          target_score: score,
          native_language: nativeLang.trim() || 'en',
        })
        .eq('id', user.id);
      await refreshProfile();
    }
    setSaving(false);
    router.replace('/(tabs)/home');
  }

  const canContinue =
    step === 0 ? !!exam :
    step === 1 ? true :
    nativeLang.trim().length > 0;

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.container}>

        {/* Top bar */}
        <View style={s.topBar}>
          <Text style={s.logo}>Fluent<Text style={s.ra}>ra</Text></Text>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
            <Text style={s.skip}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={s.progressRow}>
          <ProgressBar progress={(step + 1) / 3} color={Colors.p} height={4} animated />
          <Text style={s.stepLabel}>{step + 1} / 3</Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={s.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

          {/* ── Step 0: Pick exam ─── */}
          {step === 0 && (
            <>
              <Text style={s.heading}>Which exam are{'\n'}you preparing for?</Text>
              <Text style={s.sub}>We'll personalise your practice.</Text>
              <View style={s.examGrid}>
                {EXAMS.map(opt => {
                  const selected = exam.key === opt.key;
                  return (
                    <TouchableOpacity
                      key={opt.key}
                      onPress={() => setExam(opt)}
                      activeOpacity={0.8}
                      style={[
                        s.examCard,
                        selected && { borderColor: opt.color, borderWidth: 2.5, backgroundColor: opt.bgColor },
                      ]}
                    >
                      <Text style={s.examEmoji}>{opt.emoji}</Text>
                      <Text style={[s.examLabel, selected && { color: opt.color }]}>{opt.label}</Text>
                      <Text style={s.examSub} numberOfLines={1}>{opt.subtitle}</Text>
                      {selected && (
                        <View style={[s.check, { backgroundColor: opt.color }]}>
                          <Text style={s.checkMark}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* ── Step 1: Target score ─── */}
          {step === 1 && (
            <>
              <Text style={s.heading}>What's your{'\n'}target score?</Text>
              <Text style={s.sub}>
                For <Text style={{ color: exam.color, fontFamily: 'Inter_600SemiBold' }}>{exam.label}</Text>{' '}
                ({exam.minScore}–{exam.maxScore})
              </Text>
              <ScoreSlider
                value={score}
                min={exam.minScore}
                max={exam.maxScore}
                step={exam.step}
                color={exam.color}
                onChange={setScore}
              />
            </>
          )}

          {/* ── Step 2: Native language ─── */}
          {step === 2 && (
            <>
              <Text style={s.heading}>What's your{'\n'}native language?</Text>
              <Text style={s.sub}>Helps us tailor pronunciation feedback.</Text>
              <TextInput
                style={s.langInput}
                value={nativeLang}
                onChangeText={setNativeLang}
                placeholder="e.g. Arabic, Hindi, Spanish…"
                placeholderTextColor={Colors.ink4}
                autoCapitalize="words"
                autoFocus
              />
              <View style={s.langSuggestions}>
                {['Arabic', 'Chinese', 'French', 'Hindi', 'Japanese', 'Korean', 'Portuguese', 'Russian', 'Spanish', 'Turkish'].map(lang => (
                  <TouchableOpacity
                    key={lang}
                    style={[s.langChip, nativeLang === lang && s.langChipActive]}
                    onPress={() => setNativeLang(lang)}
                  >
                    <Text style={[s.langChipText, nativeLang === lang && s.langChipTextActive]}>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

        </ScrollView>

        {/* CTA */}
        <View style={s.cta}>
          <TouchableOpacity
            style={[s.ctaBtn, (!canContinue || saving) && s.ctaBtnDisabled]}
            onPress={goNext}
            disabled={!canContinue || saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={s.ctaBtnText}>{step === 2 ? "Let's start →" : 'Continue'}</Text>
            }
          </TouchableOpacity>
          {step > 0 && (
            <TouchableOpacity style={s.back} onPress={() => setStep(s => s - 1)}>
              <Text style={s.backText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: H_PAD },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, paddingBottom: 16 },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26, color: Colors.ink },
  ra: { color: Colors.p },
  skip: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },

  progressRow: { gap: 6, marginBottom: 8 },
  stepLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, textAlign: 'right' },

  body: { gap: 20, paddingBottom: 16 },
  heading: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: Colors.ink, lineHeight: 40 },
  sub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginTop: -8 },

  // Exam grid
  examGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  examCard: {
    width: (W - H_PAD * 2 - 12) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    gap: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  examEmoji: { fontSize: 28 },
  examLabel: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  examSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  check: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white },

  // Lang input
  langInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.p,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: Colors.ink,
  },
  langSuggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langChipActive: { backgroundColor: Colors.p_soft, borderColor: Colors.p },
  langChipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  langChipTextActive: { color: Colors.p },

  // CTA
  cta: { gap: 10, paddingBottom: 20, paddingTop: 12 },
  ctaBtn: {
    backgroundColor: Colors.p,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaBtnDisabled: { opacity: 0.4 },
  ctaBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white },
  back: { alignItems: 'center' },
  backText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },
});
