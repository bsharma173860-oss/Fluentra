import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { supabase } from '@/lib/supabase';
import { ExamProfiles } from '@/constants/examProfiles';
import { useAuth } from '@/lib/authContext';

const { width: SCREEN_W } = Dimensions.get('window');

type ExamKey = 'IELTS' | 'TOEFL' | 'DELF' | 'DELE' | 'FREE';

const EXAM_OPTIONS: { key: ExamKey; emoji: string }[] = [
  { key: 'IELTS', emoji: '🇬🇧' },
  { key: 'TOEFL', emoji: '🇺🇸' },
  { key: 'DELF', emoji: '🇫🇷' },
  { key: 'DELE', emoji: '🇪🇸' },
  { key: 'FREE', emoji: '✨' },
];

const NATIVE_LANGUAGES = [
  { code: 'ar', label: 'Arabic', native: 'العربية' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'de', label: 'German', native: 'Deutsch' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
  { code: 'ko', label: 'Korean', native: '한국어' },
  { code: 'pt', label: 'Portuguese', native: 'Português' },
  { code: 'ru', label: 'Russian', native: 'Русский' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'tr', label: 'Turkish', native: 'Türkçe' },
  { code: 'other', label: 'Other', native: '…' },
];

// ── Slider component ──────────────────────────────────────────
function BandSlider({
  value,
  onChange,
  min,
  max,
  step,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
}) {
  const trackW = SCREEN_W - 28 * 2 - 32; // padding
  const steps = (max - min) / step;
  const pct = (value - min) / (max - min);
  const thumbX = pct * trackW;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {},
    onPanResponderMove: (_, gs) => {
      const newPct = Math.min(1, Math.max(0, (thumbX + gs.dx) / trackW));
      const rawVal = min + newPct * (max - min);
      const snapped = Math.round(rawVal / step) * step;
      onChange(Math.min(max, Math.max(min, parseFloat(snapped.toFixed(1)))));
    },
  });

  const labels = [];
  for (let v = min; v <= max; v += step * 2) {
    labels.push(v);
  }

  return (
    <View style={sliderStyles.wrap}>
      {/* Track */}
      <View style={[sliderStyles.track, { width: trackW }]}>
        <View style={[sliderStyles.fill, { width: thumbX }]} />
        {/* Thumb */}
        <View
          style={[sliderStyles.thumb, { left: thumbX - 14 }]}
          {...panResponder.panHandlers}
        >
          <Text style={sliderStyles.thumbVal}>{value.toFixed(1)}</Text>
        </View>
      </View>
      {/* Tick labels */}
      <View style={[sliderStyles.labels, { width: trackW }]}>
        {labels.map((l) => (
          <Text key={l} style={sliderStyles.tick}>{l}</Text>
        ))}
      </View>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  wrap: { gap: 10, paddingHorizontal: 16, alignItems: 'center' },
  track: {
    height: 6,
    backgroundColor: Colors.bg2,
    borderRadius: 99,
    position: 'relative',
    marginTop: 24,
  },
  fill: {
    height: 6,
    backgroundColor: Colors.p,
    borderRadius: 99,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  thumb: {
    position: 'absolute',
    top: -16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.p,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.p,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  thumbVal: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tick: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
});

// ── Main Onboarding Screen ────────────────────────────────────
export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(0); // 0, 1, 2
  const [selectedExam, setSelectedExam] = useState<ExamKey>('IELTS');
  const [targetBand, setTargetBand] = useState(7.0);
  const [nativeLang, setNativeLang] = useState('');
  const [customLang, setCustomLang] = useState('');
  const [saving, setSaving] = useState(false);

  const profile = ExamProfiles[selectedExam];

  // Band score range per exam
  const bandRange =
    selectedExam === 'IELTS'
      ? { min: 4, max: 9, step: 0.5 }
      : selectedExam === 'TOEFL'
      ? { min: 40, max: 120, step: 5 }
      : { min: 40, max: 100, step: 5 };

  function handleNext() {
    if (step === 0 && !selectedExam) return;
    if (step === 2) {
      handleSave();
    } else {
      setStep((s) => s + 1);
    }
  }

  async function handleSave() {
    if (!user) {
      router.replace('/(tabs)/home');
      return;
    }
    setSaving(true);
    const lang = nativeLang === 'other' ? customLang.trim() : nativeLang;
    const { error } = await supabase
      .from('profiles')
      .update({
        target_exam: selectedExam,
        target_band: targetBand,
        native_language: lang || 'en',
      })
      .eq('id', user.id);
    setSaving(false);
    if (error) {
      Alert.alert('Error', 'Could not save preferences. Continuing anyway.');
    } else {
      await refreshProfile();
    }
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.topBar}>
          <Text style={styles.logo}>
            Fluent<Text style={styles.logoAccent}>ra</Text>
          </Text>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={(step + 1) / 3}
            color={Colors.p}
            height={4}
            animated
          />
          <Text style={styles.stepLabel}>Step {step + 1} of 3</Text>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── STEP 0: Pick exam ─────────────────────────── */}
          {step === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Which exam are{'\n'}you preparing for?</Text>
              <Text style={styles.stepSub}>We'll personalise your practice sessions.</Text>
              <View style={styles.examGrid}>
                {EXAM_OPTIONS.map(({ key, emoji }) => {
                  const p = ExamProfiles[key];
                  const isSelected = selectedExam === key;
                  return (
                    <TouchableOpacity
                      key={key}
                      onPress={() => setSelectedExam(key)}
                      activeOpacity={0.8}
                      style={[
                        styles.examCard,
                        isSelected && { borderColor: p.color, borderWidth: 2, backgroundColor: p.bgColor },
                      ]}
                    >
                      <Text style={styles.examEmoji}>{emoji}</Text>
                      <Text style={[styles.examName, isSelected && { color: p.color }]}>
                        {p.shortName}
                      </Text>
                      <Text style={styles.examDesc} numberOfLines={2}>
                        {p.description}
                      </Text>
                      {isSelected && (
                        <View style={[styles.checkBadge, { backgroundColor: p.color }]}>
                          <Text style={styles.checkText}>✓</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── STEP 1: Target band score ─────────────────── */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>What's your{'\n'}target score?</Text>
              <Text style={styles.stepSub}>
                We'll calibrate your practice difficulty for{' '}
                <Text style={{ color: profile.color, fontFamily: 'Inter_600SemiBold' }}>
                  {profile.name}
                </Text>
                .
              </Text>

              <View style={styles.currentScoreWrap}>
                <Text style={[styles.currentScore, { color: profile.color }]}>
                  {targetBand.toFixed(1)}
                </Text>
                <Text style={styles.currentScoreLabel}>
                  {selectedExam === 'IELTS' ? 'Band Score' : selectedExam === 'TOEFL' ? 'Total Score' : 'Score'}
                </Text>
              </View>

              <BandSlider
                value={targetBand}
                onChange={setTargetBand}
                min={bandRange.min}
                max={bandRange.max}
                step={bandRange.step}
              />

              {/* Score context chips */}
              <View style={styles.scoreChips}>
                {selectedExam === 'IELTS' && [
                  { label: 'B2 (Good)', min: 5.5, max: 6.5 },
                  { label: 'C1 (Very Good)', min: 7, max: 8 },
                  { label: 'C2 (Expert)', min: 8.5, max: 9 },
                ].map((chip) => {
                  const inRange = targetBand >= chip.min && targetBand <= chip.max;
                  return (
                    <View key={chip.label} style={[styles.scoreChip, inRange && { backgroundColor: Colors.p_soft }]}>
                      <Text style={[styles.scoreChipText, inRange && { color: Colors.p }]}>
                        {chip.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── STEP 2: Native language ───────────────────── */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>What's your{'\n'}native language?</Text>
              <Text style={styles.stepSub}>
                Helps us tailor pronunciation and grammar feedback.
              </Text>
              <View style={styles.langGrid}>
                {NATIVE_LANGUAGES.map((lang) => {
                  const isSelected = nativeLang === lang.code;
                  return (
                    <TouchableOpacity
                      key={lang.code}
                      onPress={() => setNativeLang(lang.code)}
                      style={[
                        styles.langChip,
                        isSelected && styles.langChipActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.langLabel, isSelected && styles.langLabelActive]}>
                        {lang.label}
                      </Text>
                      <Text style={[styles.langNative, isSelected && { color: Colors.p }]}>
                        {lang.native}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {nativeLang === 'other' && (
                <TextInput
                  style={styles.customInput}
                  value={customLang}
                  onChangeText={setCustomLang}
                  placeholder="Type your language…"
                  placeholderTextColor={Colors.ink4}
                  autoFocus
                />
              )}
            </View>
          )}
        </ScrollView>

        {/* CTA */}
        <View style={styles.cta}>
          <Button
            label={step === 2 ? "Let's start →" : 'Continue'}
            onPress={handleNext}
            loading={saving}
            fullWidth
            size="lg"
            disabled={
              (step === 2 && !nativeLang) ||
              (step === 2 && nativeLang === 'other' && !customLang.trim())
            }
          />
          {step > 0 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep((s) => s - 1)}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 28 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 16,
  },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26, color: Colors.ink },
  logoAccent: { color: Colors.p },
  skipText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },
  progressWrap: { gap: 6, marginBottom: 8 },
  stepLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, textAlign: 'right' },

  content: { gap: 24, paddingBottom: 16 },
  stepContent: { gap: 16 },
  stepTitle: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 30,
    color: Colors.ink,
    lineHeight: 38,
  },
  stepSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  // Exam grid
  examGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  examCard: {
    width: (SCREEN_W - 28 * 2 - 12) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 16,
    gap: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  examEmoji: { fontSize: 30 },
  examName: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  examDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, lineHeight: 17 },
  checkBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white },

  // Band slider
  currentScoreWrap: { alignItems: 'center', gap: 4, paddingTop: 8 },
  currentScore: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 64,
  },
  currentScoreLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  scoreChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  scoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
  },
  scoreChipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },

  // Native language
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    minWidth: 90,
  },
  langChipActive: { backgroundColor: Colors.p_soft, borderColor: Colors.p },
  langLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  langLabelActive: { color: Colors.p },
  langNative: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, marginTop: 2 },
  customInput: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.p,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.ink,
  },

  // CTA
  cta: { gap: 12, paddingBottom: 20, paddingTop: 12 },
  backBtn: { alignItems: 'center' },
  backText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },
});
