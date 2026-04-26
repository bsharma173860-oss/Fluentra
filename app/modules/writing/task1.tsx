import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView,
  Platform, Alert, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockScore, setWritingResult } from '@/lib/writingStore';
import { getTodaysTask1, type Task1Chart } from '@/constants/dailyContent';
import { ChevronLeftIcon } from '@/components/icons';
import { getExamDisplayName } from '@/constants/examDisplayNames';
import { getLabels } from '@/constants/examLabels';

// ── Per-exam config ───────────────────────────────────────────────

type StimulusMode = 'chart' | 'passage' | 'fr-prompt' | 'fr-note' | 'none';

type Task1Config = {
  taskName: string;
  minWords: number;
  maxWords?: number;
  totalSec: number;
  mode: StimulusMode;
  instruction: string;
  note?: string;
};

const TASK1_CONFIG: Record<string, Task1Config> = {
  ielts: {
    taskName: 'Task 1',
    minWords: 150,
    totalSec: 20 * 60,
    mode: 'chart',
    instruction:
      'The chart below shows internet access by country between 2000 and 2020. ' +
      'Summarise the information by selecting and reporting the main features, ' +
      'and make comparisons where relevant.',
  },
  toefl: {
    taskName: 'Integrated Task',
    minWords: 150,
    maxWords: 225,
    totalSec: 20 * 60,
    mode: 'passage',
    instruction:
      'You have 3 minutes to read the passage. Then listen to a lecture that ' +
      'challenges the reading. Write a response summarizing the lecture points ' +
      'and how they relate to the reading.',
    note: 'Summarize lecture points — do NOT give your own opinion',
  },
  delf: {
    taskName: 'Production écrite',
    minWords: 250,
    totalSec: 60 * 60,
    mode: 'fr-prompt',
    instruction:
      'Vous allez écrire une lettre formelle ou un article pour un journal.\n' +
      'Lisez attentivement le sujet ci-dessous.',
  },
  dalf: {
    taskName: 'Synthèse de documents',
    minWords: 220,
    totalSec: 60 * 60,
    mode: 'fr-note',
    instruction:
      'À partir des documents proposés, rédigez une synthèse objective. ' +
      'Vous ne devez pas donner votre avis personnel.',
    note: 'Synthèse OBJECTIVE — pas d\'opinion personnelle',
  },
};

function getConfig(examId: string): Task1Config {
  return TASK1_CONFIG[examId] ?? {
    taskName: 'Task 1',
    minWords: 150,
    totalSec: 20 * 60,
    mode: 'none',
    instruction: 'Write a response to the following prompt.',
  };
}

// ── Helpers ───────────────────────────────────────────────────────

function secondsToMMSS(s: number) {
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ── IELTS: SVG Bar Chart ──────────────────────────────────────────

const SVG_W  = 280; const SVG_H  = 160;
const PAD_L  = 32;  const PAD_B  = 36;
const PAD_T  = 12;  const PAD_R  = 8;
const PLOT_W = SVG_W - PAD_L - PAD_R;
const PLOT_H = SVG_H - PAD_T - PAD_B;

function BarChart({ chart }: { chart: Task1Chart }) {
  const { xLabels, series } = chart;
  const nGroups = xLabels.length;
  const nSeries = series.length;
  const groupW  = PLOT_W / nGroups;
  const barW    = Math.min(14, (groupW * 0.7) / nSeries);
  const gap     = 2;
  const totalBarW = nSeries * barW + (nSeries - 1) * gap;
  const maxVal  = Math.max(...series.flatMap(s => s.values), 100);
  const Y_TICKS = [0, 25, 50, 75, 100];

  function yPos(val: number) {
    return PAD_T + PLOT_H - (val / maxVal) * PLOT_H;
  }
  return (
    <Svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`}>
      {Y_TICKS.filter(t => t <= maxVal + 10).map(tick => {
        const y = yPos(tick);
        return (
          <G key={tick}>
            <Line x1={PAD_L} y1={y} x2={PAD_L + PLOT_W} y2={y} stroke={Colors.border} strokeWidth="0.5" />
            <SvgText x={PAD_L - 4} y={y + 3} fontSize="8" fill={Colors.ink3} textAnchor="end">{tick}%</SvgText>
          </G>
        );
      })}
      <Line x1={PAD_L} y1={PAD_T + PLOT_H} x2={PAD_L + PLOT_W} y2={PAD_T + PLOT_H} stroke={Colors.borderStrong} strokeWidth="1" />
      {xLabels.map((label, gi) => {
        const groupX = PAD_L + gi * groupW + (groupW - totalBarW) / 2;
        return (
          <G key={gi}>
            {series.map((s, si) => {
              const x = groupX + si * (barW + gap);
              const h = (s.values[gi] / maxVal) * PLOT_H;
              const y = PAD_T + PLOT_H - h;
              return <Rect key={si} x={x} y={y} width={barW} height={Math.max(h, 0)} fill={s.color} rx="2" />;
            })}
            <SvgText x={PAD_L + gi * groupW + groupW / 2} y={PAD_T + PLOT_H + 14} fontSize="8" fill={Colors.ink2} textAnchor="middle">{label}</SvgText>
          </G>
        );
      })}
      {series.map((s, i) => (
        <G key={i}>
          <Rect x={PAD_L + i * 60} y={SVG_H - 12} width={8} height={8} fill={s.color} rx="2" />
          <SvgText x={PAD_L + i * 60 + 11} y={SVG_H - 5} fontSize="8" fill={Colors.ink2}>{s.name}</SvgText>
        </G>
      ))}
    </Svg>
  );
}

function IELTSChartPanel({ chart }: { chart: Task1Chart }) {
  return (
    <View style={stim.card}>
      <Text style={stim.hint}>Study the chart carefully</Text>
      <Text style={stim.chartTitle}>{chart.chartTitle}</Text>
      <BarChart chart={chart} />
      <Text style={stim.taskNote}>Summarise the information and make comparisons where relevant.</Text>
    </View>
  );
}

// ── TOEFL: Reading Passage ────────────────────────────────────────

const TOEFL_PASSAGE = {
  title: 'The Benefits of Urban Green Spaces',
  paragraphs: [
    'Urban parks and green spaces have long been considered a luxury in densely populated cities. However, recent studies reveal that access to nature in cities provides significant physical, mental, and environmental benefits that make them an essential part of modern urban planning.',
    'Research conducted across multiple major cities has shown that residents living within walking distance of a park exercise more regularly than those without nearby green spaces. Parks provide free, accessible venues for jogging, cycling, and team sports, reducing barriers to physical activity regardless of socioeconomic status.',
    'Beyond physical health, urban green spaces have a measurable impact on mental well-being. Studies indicate that even brief exposure to natural environments reduces cortisol levels — the primary stress hormone — and improves mood and cognitive function. City planners increasingly recognize that green spaces are not merely aesthetic additions but fundamental to public health infrastructure.',
  ],
};

function TOEFLPassagePanel() {
  return (
    <View style={stim.card}>
      <View style={stim.passageHeader}>
        <Text style={stim.readingBadge}>READING PASSAGE</Text>
        <Text style={stim.readingNote}>3 min to read</Text>
      </View>
      <Text style={stim.passageTitle}>{TOEFL_PASSAGE.title}</Text>
      {TOEFL_PASSAGE.paragraphs.map((p, i) => (
        <Text key={i} style={stim.passagePara}>{p}</Text>
      ))}
      <View style={stim.lectureBanner}>
        <Text style={stim.lectureBannerText}>Audio lecture will challenge this passage</Text>
      </View>
    </View>
  );
}

// ── DELF: French Prompt Panel ─────────────────────────────────────

const DELF_PROMPT = {
  title: 'Les réseaux sociaux et les jeunes',
  text:
    'Un magazine francophone lance un appel à contributions sur le thème des réseaux ' +
    'sociaux chez les jeunes. Rédigez un article dans lequel vous analysez les avantages ' +
    'et les inconvénients des réseaux sociaux pour les jeunes d\'aujourd\'hui. ' +
    'Donnez votre point de vue et illustrez-le d\'exemples.',
  criteria: [
    'Respect de la consigne',
    'Correction sociolinguistique',
    'Cohérence et cohésion',
    'Compétence lexicale/grammaticale',
  ],
  scoreRange: '0–25 points',
  tips: [
    'Utilisez un registre formel',
    'Structurez votre réponse : introduction, développement, conclusion',
    'Vérifiez l\'orthographe et la grammaire',
    'Minimum 250 mots requis',
  ],
};

function DELFPromptPanel() {
  return (
    <View style={stim.card}>
      <Text style={stim.frBadge}>SUJET</Text>
      <Text style={stim.frPromptTitle}>{DELF_PROMPT.title}</Text>
      <Text style={stim.frPromptText}>{DELF_PROMPT.text}</Text>

      <View style={stim.frDivider} />

      <Text style={stim.frSectionLabel}>CRITÈRES D'ÉVALUATION</Text>
      {DELF_PROMPT.criteria.map(c => (
        <View key={c} style={stim.frCriteriaRow}>
          <View style={stim.frCriteriaDot} />
          <Text style={stim.frCriteriaText}>{c}</Text>
        </View>
      ))}
      <Text style={stim.frScoreRange}>{DELF_PROMPT.scoreRange}</Text>

      <View style={stim.frDivider} />

      <Text style={stim.frSectionLabel}>CONSEILS</Text>
      {DELF_PROMPT.tips.map(t => (
        <View key={t} style={stim.frTipRow}>
          <Text style={stim.frTipBullet}>·</Text>
          <Text style={stim.frTipText}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

// ── DALF: Synthesis Note Panel ────────────────────────────────────

function DALFNotePanel() {
  return (
    <View style={stim.card}>
      <Text style={stim.frBadge}>NOTE IMPORTANTE</Text>
      <View style={stim.dalfBanner}>
        <Text style={stim.dalfBannerTitle}>Synthèse OBJECTIVE</Text>
        <Text style={stim.dalfBannerText}>
          La synthèse doit rester objective. Vous ne devez pas donner votre avis personnel ni exprimer vos opinions sur le sujet.
        </Text>
      </View>
      <Text style={stim.frSectionLabel}>STRUCTURE RECOMMANDÉE</Text>
      {[
        '1. Introduction : présentation du sujet',
        '2. Développement : synthèse des idées principales',
        '3. Conclusion : bilan objectif',
      ].map(item => (
        <Text key={item} style={stim.dalfStructureItem}>{item}</Text>
      ))}
      <View style={stim.frDivider} />
      <Text style={stim.frSectionLabel}>CRITÈRES D'ÉVALUATION</Text>
      {[
        'Capacité à synthétiser',
        'Cohérence et cohésion',
        'Compétence lexicale',
        'Compétence grammaticale',
      ].map(c => (
        <View key={c} style={stim.frCriteriaRow}>
          <View style={stim.frCriteriaDot} />
          <Text style={stim.frCriteriaText}>{c}</Text>
        </View>
      ))}
    </View>
  );
}

const stim = StyleSheet.create({
  card: {
    backgroundColor: Colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    padding: 14, gap: 8,
  },
  // IELTS chart
  hint:       { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  chartTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink2, lineHeight: 17 },
  taskNote:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 18 },
  // TOEFL passage
  passageHeader:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readingBadge:      { fontFamily: 'Inter_700Bold', fontSize: 10, color: '#1558B0', letterSpacing: 0.5 },
  readingNote:       { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  passageTitle:      { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink, lineHeight: 20 },
  passagePara:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 21 },
  lectureBanner:     { backgroundColor: '#EEF4FF', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 4 },
  lectureBannerText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#1558B0' },
  // French shared
  frBadge:        { fontFamily: 'Inter_700Bold', fontSize: 10, color: '#1558B0', letterSpacing: 0.6 },
  frDivider:      { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  frSectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#AAA', letterSpacing: 0.6, textTransform: 'uppercase' as const },
  frCriteriaRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 7 },
  frCriteriaDot:  { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#1558B0', marginTop: 6, flexShrink: 0 },
  frCriteriaText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, flex: 1 },
  frScoreRange:   { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#888' },
  frTipRow:       { flexDirection: 'row', gap: 6 },
  frTipBullet:    { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#B07A10' },
  frTipText:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, flex: 1, lineHeight: 18 },
  // DELF
  frPromptTitle:  { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink, lineHeight: 22 },
  frPromptText:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 21 },
  // DALF
  dalfBanner: {
    backgroundColor: '#FFF7ED', borderRadius: 10, padding: 12,
    borderLeftWidth: 3, borderLeftColor: '#B07A10',
  },
  dalfBannerTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#B07A10', marginBottom: 4 },
  dalfBannerText:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666', lineHeight: 18 },
  dalfStructureItem: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, lineHeight: 20 },
});

// ── Main screen ───────────────────────────────────────────────────

export default function WritingTask1Screen() {
  const { width }   = useWindowDimensions();
  const isDesktop   = Platform.OS === 'web' && width >= 768;
  const params      = useLocalSearchParams();
  const examId      = ((params.examId ?? params.exam ?? 'ielts') as string);
  const cfg         = getConfig(examId);
  const displayName = getExamDisplayName(examId);
  const labels      = getLabels(examId);
  const todaysChart = getTodaysTask1();

  const [text,        setText]        = useState('');
  const [secondsLeft, setSecondsLeft] = useState(cfg.totalSec);
  const [submitting,  setSubmitting]  = useState(false);
  const startedAt = useRef(Date.now());

  const wordCount = countWords(text);
  const isWarning = secondsLeft <= 5 * 60;
  const wordOk    = wordCount >= cfg.minWords;
  const overMax   = cfg.maxWords ? wordCount > cfg.maxWords : false;

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
    if (!forced && wordCount < cfg.minWords) {
      Alert.alert(
        'Too short',
        `${wordCount} ${labels.wordCount}. ${labels.writeAtLeast} ${cfg.minWords}. Submit anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit anyway', style: 'destructive', onPress: () => doSubmit() },
        ]
      );
      return;
    }
    doSubmit();
  }, [submitting, wordCount]);

  function doSubmit() {
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    const result = mockScore(text, 'task1', displayName, todaysChart.prompt, timeTaken);
    setWritingResult(result);
    router.replace('/modules/writing/results' as any);
  }

  // ── Stimulus panel ────────────────────────────────────────────
  function renderStimulus() {
    switch (cfg.mode) {
      case 'chart':     return <IELTSChartPanel chart={todaysChart} />;
      case 'passage':   return <TOEFLPassagePanel />;
      case 'fr-prompt': return <DELFPromptPanel />;
      case 'fr-note':   return <DALFNotePanel />;
      default:          return null;
    }
  }

  // ── Instruction card ──────────────────────────────────────────
  const instructionCard = (
    <View style={s.instructionCard}>
      <Text style={s.instructionText}>{cfg.instruction}</Text>
      {cfg.note ? (
        <View style={s.noteRow}>
          <Text style={s.noteText}>{cfg.note}</Text>
        </View>
      ) : null}
      <View style={s.metaRow}>
        <View style={s.metaPill}>
          <Text style={s.metaPillText}>{labels.writeAtLeast} {cfg.minWords} {labels.wordCount}</Text>
        </View>
        {cfg.maxWords ? (
          <View style={s.metaPill}>
            <Text style={s.metaPillText}>Max {cfg.maxWords} {labels.wordCount}</Text>
          </View>
        ) : null}
        <View style={s.metaPill}>
          <Text style={s.metaPillText}>{cfg.totalSec / 60} {labels.minutes}</Text>
        </View>
      </View>
    </View>
  );

  // ── Editor block ──────────────────────────────────────────────
  const editorBlock = (
    <View style={s.editorCard}>
      <TextInput
        style={s.editor}
        multiline
        value={text}
        onChangeText={setText}
        placeholder={labels.placeholder}
        placeholderTextColor={Colors.ink4}
        textAlignVertical="top"
        autoCorrect={false}
        spellCheck={false}
      />
      <View style={s.editorFooter}>
        <View style={[s.wordBadge, wordOk ? s.wordBadgeOk : s.wordBadgeWarn, overMax && s.wordBadgeOver]}>
          <Text style={[s.wordCount, wordOk ? s.wordCountOk : s.wordCountWarn, overMax && s.wordCountOver]}>
            {wordCount} / {cfg.maxWords ?? cfg.minWords} {labels.wordCount}
          </Text>
        </View>
        <TouchableOpacity
          style={[s.submitBtn, submitting && s.submitBtnDisabled]}
          onPress={() => handleSubmit(false)}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <Text style={s.submitBtnText}>{submitting ? '…' : labels.submit}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const stimulusEl = renderStimulus();

  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>

        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeftIcon size={13} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={s.breadcrumb}>
            <Text style={s.breadcrumbRoot}>{displayName} · Writing</Text>
            <Text style={s.breadcrumbSep}>/</Text>
            <Text style={s.breadcrumbCurrent}>{cfg.taskName}</Text>
          </View>
          <View style={[s.timerBadge, isWarning && s.timerBadgeWarn]}>
            <Text style={[s.timerText, isWarning && s.timerTextWarn]}>
              {secondsToMMSS(secondsLeft)}
            </Text>
          </View>
        </View>

        {/* ── Desktop: side-by-side ── */}
        {isDesktop ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
            <View style={s.desktopLayout}>
              <View style={[s.desktopEditor, !stimulusEl && { flex: 1 }]}>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ padding: 20, gap: 12 }}
                  keyboardShouldPersistTaps="handled"
                  showsVerticalScrollIndicator={false}
                >
                  {instructionCard}
                  {editorBlock}
                  <View style={{ height: 40 }} />
                </ScrollView>
              </View>
              {stimulusEl ? (
                <View style={s.desktopChart}>
                  <ScrollView contentContainerStyle={{ padding: 20 }} showsVerticalScrollIndicator={false}>
                    {stimulusEl}
                  </ScrollView>
                </View>
              ) : null}
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
              {stimulusEl}
              {instructionCard}
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
    backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center',
  },
  breadcrumb:        { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  breadcrumbRoot:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textSecondary },
  breadcrumbSep:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted },
  breadcrumbCurrent: { fontFamily: 'Inter_500Medium',  fontSize: 12, color: Colors.textPrimary },

  timerBadge:     { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.cardBorder },
  timerBadgeWarn: { backgroundColor: Colors.orange_bg, borderColor: Colors.orange },
  timerText:      { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.textPrimary },
  timerTextWarn:  { color: Colors.orange },

  desktopLayout: { flex: 1, flexDirection: 'row' },
  desktopEditor: { flex: 2, borderRightWidth: 1, borderRightColor: Colors.border },
  desktopChart:  { flex: 1, backgroundColor: Colors.bg },

  mobileContent: { paddingHorizontal: 16, paddingTop: 16, gap: 12 },

  instructionCard: {
    backgroundColor: Colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 10,
  },
  instructionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, lineHeight: 22 },
  noteRow:  { backgroundColor: '#FFF7ED', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, borderLeftWidth: 3, borderLeftColor: '#B07A10' },
  noteText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#B07A10' },
  metaRow:  { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  metaPill: { backgroundColor: '#F4F4F0', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  metaPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },

  editorCard: {
    backgroundColor: Colors.white, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  editor: {
    fontFamily: 'Inter_400Regular', fontSize: 15,
    color: Colors.ink, lineHeight: 24, minHeight: 280, padding: 16,
  },
  editorFooter: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 10,
  },

  wordBadge:     { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99, borderWidth: 1 },
  wordBadgeOk:   { backgroundColor: Colors.green_bg,  borderColor: Colors.green  },
  wordBadgeWarn: { backgroundColor: Colors.orange_bg, borderColor: Colors.orange },
  wordBadgeOver: { backgroundColor: '#FFF0EE', borderColor: '#C04A06' },
  wordCount:     { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  wordCountOk:   { color: Colors.green  },
  wordCountWarn: { color: Colors.orange },
  wordCountOver: { color: '#C04A06' },

  submitBtn:         { backgroundColor: Colors.p, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText:     { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
});
