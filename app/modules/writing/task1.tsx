import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView,
  Platform, Alert, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockScore, setWritingResult } from '@/lib/writingStore';
import { getTodaysTask1, type Task1Chart } from '@/constants/dailyContent';
import { ChevronLeftIcon } from '@/components/icons';

const EXAM        = 'IELTS';
const MIN_WORDS   = 150;
const TOTAL_SEC   = 20 * 60;
const WARN_SEC    = 5 * 60;

function secondsToMMSS(s: number) {
  const m   = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}
function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── SVG Bar Chart ─────────────────────────────────────────────────
const SVG_W    = 280;
const SVG_H    = 160;
const PAD_L    = 32;   // left  (y-axis labels)
const PAD_B    = 36;   // bottom (x-axis labels)
const PAD_T    = 12;
const PAD_R    = 8;
const PLOT_W   = SVG_W - PAD_L - PAD_R;
const PLOT_H   = SVG_H - PAD_T - PAD_B;
const Y_TICKS  = [0, 25, 50, 75, 100];

function BarChart({ chart }: { chart: Task1Chart }) {
  const xLabels  = chart.xLabels;
  const series   = chart.series;
  const nGroups  = xLabels.length;
  const nSeries  = series.length;

  const groupW   = PLOT_W / nGroups;
  const barW     = Math.min(14, (groupW * 0.7) / nSeries);
  const gap      = 2;
  const totalBarW = nSeries * barW + (nSeries - 1) * gap;

  // find max value across all series
  const maxVal = Math.max(...series.flatMap(s => s.values), 100);

  function yPos(val: number) {
    return PAD_T + PLOT_H - (val / maxVal) * PLOT_H;
  }

  return (
    <Svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
      {/* Y axis ticks + grid lines */}
      {Y_TICKS.filter(t => t <= maxVal + 10).map(tick => {
        const y = yPos(tick);
        return (
          <G key={tick}>
            <Line x1={PAD_L} y1={y} x2={PAD_L + PLOT_W} y2={y} stroke={Colors.border} strokeWidth="0.5" />
            <SvgText
              x={PAD_L - 4} y={y + 3}
              fontSize="8" fill={Colors.ink3}
              textAnchor="end"
            >{tick}%</SvgText>
          </G>
        );
      })}

      {/* X axis line */}
      <Line x1={PAD_L} y1={PAD_T + PLOT_H} x2={PAD_L + PLOT_W} y2={PAD_T + PLOT_H} stroke={Colors.borderStrong} strokeWidth="1" />

      {/* Bars */}
      {xLabels.map((label, gi) => {
        const groupX = PAD_L + gi * groupW + (groupW - totalBarW) / 2;
        return (
          <G key={gi}>
            {series.map((s, si) => {
              const x  = groupX + si * (barW + gap);
              const h  = (s.values[gi] / maxVal) * PLOT_H;
              const y  = PAD_T + PLOT_H - h;
              return (
                <Rect key={si} x={x} y={y} width={barW} height={Math.max(h, 0)} fill={s.color} rx="2" />
              );
            })}
            {/* X label */}
            <SvgText
              x={PAD_L + gi * groupW + groupW / 2}
              y={PAD_T + PLOT_H + 14}
              fontSize="8" fill={Colors.ink2}
              textAnchor="middle"
            >{label}</SvgText>
          </G>
        );
      })}

      {/* Legend */}
      {series.map((s, i) => (
        <G key={i}>
          <Rect
            x={PAD_L + i * 60} y={SVG_H - 12}
            width={8} height={8} fill={s.color} rx="2"
          />
          <SvgText
            x={PAD_L + i * 60 + 11} y={SVG_H - 5}
            fontSize="8" fill={Colors.ink2}
          >{s.name}</SvgText>
        </G>
      ))}
    </Svg>
  );
}

// ── Chart panel ───────────────────────────────────────────────────
function ChartPanel({ chart }: { chart: Task1Chart }) {
  return (
    <View style={ch.card}>
      <Text style={ch.hint}>Study the chart carefully</Text>
      <Text style={ch.chartTitle}>{chart.chartTitle}</Text>
      <BarChart chart={chart} />
      <Text style={ch.taskNote}>Summarise the information and make comparisons where relevant.</Text>
    </View>
  );
}
const ch = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1,
    borderColor: Colors.border,
    padding: 14, gap: 8,
  },
  hint:       { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  chartTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink2, lineHeight: 17 },
  taskNote:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 18 },
});

// ── Main screen ───────────────────────────────────────────────────
export default function WritingTask1Screen() {
  const { width }       = useWindowDimensions();
  const isDesktop       = Platform.OS === 'web' && width >= 768;
  const todaysChart     = getTodaysTask1();

  const [text,        setText]       = useState('');
  const [secondsLeft, setSecondsLeft]= useState(TOTAL_SEC);
  const [submitting,  setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());

  const wordCount  = countWords(text);
  const isWarning  = secondsLeft <= WARN_SEC;
  const wordOk     = wordCount >= MIN_WORDS;

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(id); doSubmit(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = useCallback((forced = false) => {
    if (submitting) return;
    if (!forced && wordCount < MIN_WORDS) {
      Alert.alert('Too short', `You have ${wordCount} words. Task 1 requires at least ${MIN_WORDS}. Submit anyway?`, [
        { text: 'Keep writing', style: 'cancel' },
        { text: 'Submit anyway', style: 'destructive', onPress: () => doSubmit() },
      ]);
      return;
    }
    doSubmit();
  }, [submitting, wordCount]);

  function doSubmit() {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    const result = mockScore(text, 'task1', EXAM, todaysChart.prompt, timeTaken);
    setWritingResult(result);
    router.replace('/modules/writing/results' as any);
  }

  // ── Editor component (shared) ─────────────────────────────────
  const editorBlock = (
    <View style={s.editorCard}>
      <TextInput
        style={s.editor}
        multiline
        value={text}
        onChangeText={setText}
        placeholder="Describe the key trends shown in the chart…"
        placeholderTextColor={Colors.ink4}
        textAlignVertical="top"
        autoCorrect={false}
        spellCheck={false}
      />
      <View style={s.editorFooter}>
        <View style={[s.wordBadge, wordOk ? s.wordBadgeOk : s.wordBadgeWarn]}>
          <Text style={[s.wordCount, wordOk ? s.wordCountOk : s.wordCountWarn]}>
            {wordCount} / {MIN_WORDS} words
          </Text>
        </View>
        <TouchableOpacity
          style={[s.submitBtn, submitting && s.submitBtnDisabled]}
          onPress={() => handleSubmit(false)}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Text style={s.submitBtnText}>{submitting ? 'Scoring…' : 'Submit →'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={13} color={Colors.textSecondary} />
        </TouchableOpacity>
        <View style={s.breadcrumb}>
          <Text style={s.breadcrumbRoot}>{EXAM} · Writing</Text>
          <Text style={s.breadcrumbSep}>/</Text>
          <Text style={s.breadcrumbCurrent}>Task 1</Text>
        </View>
        <View style={[s.timerBadge, isWarning && s.timerBadgeWarn]}>
          <Text style={[s.timerText, isWarning && s.timerTextWarn]}>
            {secondsToMMSS(secondsLeft)}
          </Text>
        </View>
      </View>

      {/* Topic label */}
      <View style={s.topicBar}>
        <Text style={s.topicLabel}>TODAY: </Text>
        <Text style={s.topicText}>{todaysChart.topic}</Text>
      </View>

      {/* ── Desktop: side-by-side ── */}
      {isDesktop ? (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={s.desktopLayout}>
            {/* Editor — left 2/3 */}
            <View style={s.desktopEditor}>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 20, gap: 12 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {editorBlock}
                <View style={s.instructionsRow}>
                  <Text style={s.instruction}>Write at least <Text style={s.instructionBold}>{MIN_WORDS} words</Text></Text>
                  <Text style={s.instruction}><Text style={s.instructionBold}>20 minutes</Text></Text>
                </View>
                <View style={{ height: 40 }} />
              </ScrollView>
            </View>
            {/* Chart panel — right 1/3 */}
            <View style={s.desktopChart}>
              <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                <ChartPanel chart={todaysChart} />
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      ) : (
        /* ── Mobile: stacked ── */
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={s.mobileContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Chart first on mobile */}
            <ChartPanel chart={todaysChart} />

            <View style={s.instructionsRow}>
              <Text style={s.instruction}>Write at least <Text style={s.instructionBold}>{MIN_WORDS} words</Text></Text>
              <Text style={s.instruction}><Text style={s.instructionBold}>20 min</Text></Text>
            </View>

            {editorBlock}

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, height: 48, gap: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.cardBorder,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 26, height: 26, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  breadcrumb:        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  breadcrumbRoot:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textSecondary },
  breadcrumbSep:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  breadcrumbCurrent: { fontFamily: 'Inter_500Medium',  fontSize: 12, color: Colors.textPrimary },

  timerBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, backgroundColor: Colors.bg2,
    borderWidth: 1, borderColor: Colors.cardBorder,
  },
  timerBadgeWarn: { backgroundColor: Colors.orange_bg, borderColor: Colors.orange },
  timerText:      { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.textPrimary },
  timerTextWarn:  { color: Colors.orange },

  topicBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: Colors.bg2,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  topicLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink3, letterSpacing: 0.5 },
  topicText:  { fontFamily: 'Inter_500Medium',   fontSize: 11, color: Colors.ink2, flex: 1 },

  // Desktop layout
  desktopLayout: { flex: 1, flexDirection: 'row' },
  desktopEditor: { flex: 2, borderRightWidth: 1, borderRightColor: Colors.border },
  desktopChart:  { flex: 1, backgroundColor: Colors.bg },

  // Mobile layout
  mobileContent: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },

  // Editor card
  editorCard: {
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1,
    borderColor: Colors.border, overflow: 'hidden',
  },
  editor: {
    fontFamily: 'Inter_400Regular', fontSize: 15,
    color: Colors.ink, lineHeight: 24,
    minHeight: 280, padding: 16,
  },
  editorFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 10,
  },

  instructionsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  instruction:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  instructionBold: { fontFamily: 'Inter_600SemiBold', color: Colors.ink2 },

  wordBadge:    { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, borderWidth: 1 },
  wordBadgeOk:  { backgroundColor: Colors.green_bg,  borderColor: Colors.green  },
  wordBadgeWarn:{ backgroundColor: Colors.orange_bg, borderColor: Colors.orange },
  wordCount:    { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  wordCountOk:  { color: Colors.green  },
  wordCountWarn:{ color: Colors.orange },

  submitBtn:        { backgroundColor: Colors.p, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  submitBtnDisabled:{ opacity: 0.5 },
  submitBtnText:    { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
});
