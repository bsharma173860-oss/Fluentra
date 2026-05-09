import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions, TextInput, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

const EXAMS = [
  { key: 'IELTS',   label: 'IELTS',        sub: 'Academic & General', color: '#5B4EFF', bg: '#EEEEFF' },
  { key: 'TOEFL',   label: 'TOEFL',        sub: 'iBT Internet-Based', color: T.listening, bg: T.listeningBg },
  { key: 'DELF',    label: 'DELF B2',      sub: 'Diplôme Français',   color: '#1558B0',  bg: '#EEF4FF' },
  { key: 'DELE',    label: 'DELE B2',      sub: 'Diploma de Español', color: T.brand,    bg: T.brandLight },
  { key: 'JLPT',    label: 'JLPT N4',      sub: 'Japanese Language',  color: '#C84070',  bg: '#FFE0EC' },
  { key: 'CUSTOM',  label: 'Just practice', sub: 'No exam goal',      color: T.ink2,     bg: T.bg2 },
];

const STEPS = ['Your exam', 'Target score', 'Native language'];
const NATIVE_LANGS = ['Arabic', 'Hindi', 'Spanish', 'Chinese', 'Portuguese', 'French'];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const [step, setStep]   = useState(0);
  const [exam, setExam]   = useState('IELTS');
  const [score, setScore] = useState(7.0);
  const [native, setNative] = useState('');

  const selExam = EXAMS.find(e => e.key === exam) || EXAMS[0];
  const canNext = step === 0 ? !!exam : step === 1 ? true : native.trim().length > 0;

  async function finish() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').upsert({
          id: user.id,
          target_exam: exam,
          target_score: score,
          native_language: native,
        });
      }
    } catch (_) {}
    router.replace('/(tabs)/home');
  }

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} keyboardShouldPersistTaps="handled">
        <View style={[s.card, isDesktop && s.cardDesktop]}>
          {/* Header */}
          <View style={s.headerRow}>
            <Text style={s.logoText}>Fluent<Text style={{ color: T.brand }}>ra</Text></Text>
            <Text style={s.stepText}>Step {step + 1} / {STEPS.length}</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressBar, { width: `${progressPct}%` as any }]} />
          </View>

          {/* Step 0: Exam selection */}
          {step === 0 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>Which exam are you{'\n'}preparing for?</Text>
              <Text style={s.stepSub}>We'll personalise your practice and scoring.</Text>
              <View style={s.examGrid}>
                {EXAMS.map(ex => {
                  const sel = exam === ex.key;
                  return (
                    <TouchableOpacity
                      key={ex.key}
                      style={[s.examCard, { borderColor: sel ? ex.color : T.border, backgroundColor: sel ? ex.bg : T.card }]}
                      onPress={() => setExam(ex.key)}
                      activeOpacity={0.8}
                    >
                      <Text style={[s.examLabel, { color: sel ? ex.color : T.ink }]}>{ex.label}</Text>
                      <Text style={s.examSub}>{ex.sub}</Text>
                      {sel && <View style={[s.examCheck, { backgroundColor: ex.color }]} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Step 1: Target score */}
          {step === 1 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>What's your target score?</Text>
              <Text style={s.stepSub}>For <Text style={{ color: selExam.color, fontWeight: '700' }}>{selExam.label}</Text></Text>
              <View style={s.scoreWrap}>
                <Text style={[s.scoreNum, { color: selExam.color }]}>{score.toFixed(1)}</Text>
                <Text style={s.scoreLabel}>Target band score</Text>
                <View style={s.sliderRow}>
                  {[4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map(v => (
                    <TouchableOpacity key={v} style={[s.sliderPip, score === v && { backgroundColor: selExam.color }]} onPress={() => setScore(v)}>
                      <Text style={[s.sliderPipText, score === v && { color: '#fff' }]}>{v}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={[s.scoreDesc, { backgroundColor: selExam.bg }]}>
                <Text style={s.scoreDescLabel}>What this means</Text>
                <Text style={s.scoreDescText}>
                  {score >= 8 ? 'Expert user — near-native fluency. Needed for top universities.'
                    : score >= 7 ? 'Good user — handles complex language well. Required for most universities.'
                    : score >= 6 ? 'Competent user — mostly effective language use. Good for professional roles.'
                    : 'Modest user — basic communication in familiar situations.'}
                </Text>
              </View>
            </View>
          )}

          {/* Step 2: Native language */}
          {step === 2 && (
            <View style={s.stepContent}>
              <Text style={s.stepTitle}>What's your native language?</Text>
              <Text style={s.stepSub}>Helps us tailor pronunciation feedback.</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. Arabic, Hindi, Spanish…"
                placeholderTextColor={T.ink4}
                value={native}
                onChangeText={setNative}
              />
              <View style={s.chipRow}>
                {NATIVE_LANGS.map(l => (
                  <TouchableOpacity
                    key={l}
                    style={[s.chip, native === l && s.chipActive]}
                    onPress={() => setNative(l)}
                  >
                    <Text style={[s.chipText, native === l && s.chipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* CTA */}
          <View style={s.ctaRow}>
            {step > 0 && (
              <TouchableOpacity style={s.backBtn} onPress={() => setStep(p => p - 1)}>
                <Text style={s.backBtnText}>←</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[s.nextBtn, !canNext && { opacity: 0.45 }]}
              onPress={() => {
                if (!canNext) return;
                if (step < 2) setStep(p => p + 1);
                else finish();
              }}
              activeOpacity={0.85}
            >
              <Text style={s.nextBtnText}>{step < 2 ? 'Continue' : 'Start learning'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg2 },
  scroll: { flexGrow: 1, padding: 16, paddingBottom: 48 },
  scrollDesktop: { alignItems: 'center', justifyContent: 'center', padding: 40 },
  card: { backgroundColor: T.card, borderRadius: 20, padding: 24, borderWidth: 1, borderColor: T.border },
  cardDesktop: { width: '100%', maxWidth: 560 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  logoText: { fontFamily: T.serif, fontSize: 22, color: T.ink },
  stepText: { fontSize: 12, color: T.ink4, fontWeight: '600' },
  progressTrack: { height: 4, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden', marginBottom: 24 },
  progressBar: { height: '100%', backgroundColor: T.brand, borderRadius: 99 },

  stepContent: { gap: 16, marginBottom: 24 },
  stepTitle: { fontSize: 24, fontWeight: '700', color: T.ink, lineHeight: 32 },
  stepSub: { fontSize: 13.5, color: T.ink3 },

  examGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  examCard: {
    width: '47%', padding: 14, borderRadius: 13, borderWidth: 1.5,
    position: 'relative',
  },
  examLabel: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  examSub: { fontSize: 11, color: T.ink4 },
  examCheck: { position: 'absolute', top: 10, right: 10, width: 18, height: 18, borderRadius: 9 },

  scoreWrap: { alignItems: 'center', gap: 8, paddingVertical: 8 },
  scoreNum: { fontFamily: T.serif, fontSize: 72, lineHeight: 80 },
  scoreLabel: { fontSize: 13, color: T.ink4 },
  sliderRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, justifyContent: 'center' },
  sliderPip: { padding: 8, borderRadius: 8, backgroundColor: T.bg2, minWidth: 46, alignItems: 'center' },
  sliderPipText: { fontSize: 12, fontWeight: '600', color: T.ink3 },

  scoreDesc: { borderRadius: 14, padding: 14 },
  scoreDescLabel: { fontSize: 12, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  scoreDescText: { fontSize: 13.5, color: T.ink, lineHeight: 20 },

  input: { padding: 12, paddingHorizontal: 14, borderRadius: 11, borderWidth: 1.5, borderColor: T.border, fontSize: 14, color: T.ink, backgroundColor: T.card },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 99, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  chipActive: { backgroundColor: T.ink, borderColor: T.ink },
  chipText: { fontSize: 12, fontWeight: '600', color: T.ink2 },
  chipTextActive: { color: '#fff' },

  ctaRow: { flexDirection: 'row', gap: 10 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink2 },
  nextBtn: { flex: 1, backgroundColor: T.brand, borderRadius: 12, padding: 14, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontSize: 14.5, fontWeight: '700' },
});
