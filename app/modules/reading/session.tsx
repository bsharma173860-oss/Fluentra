import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ReadingSidebar } from '@/components/layout/ReadingSidebar';
import { CheckIcon } from '@/components/icons';
import { Analytics } from '@/lib/analytics';
import {
  setReadingResult,
  estimateBand,
  ReadingQuestion,
} from '@/lib/readingStore';
import { useAuth } from '@/lib/authContext';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';

// ── AI content helpers ────────────────────────────────────────────

/** Split a prose passage into labeled paragraph objects (A, B, C…) */
function splitPassage(text: string): { label: string; text: string }[] {
  const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const chunks = text.split(/\n{2,}/).filter(c => c.trim().length > 40);
  return chunks.slice(0, 6).map((c, i) => ({ label: labels[i], text: c.trim() }));
}

/** Map AI question objects to the ReadingQuestion shape */
function mapAiQuestions(
  aiQuestions: any[]
): { questions: ReadingQuestion[]; headings: { key: string; label: string }[] } {
  const questions: ReadingQuestion[] = [];
  const headings: { key: string; label: string }[] = [];

  aiQuestions.forEach((q: any, i: number) => {
    const num = i + 1;
    if (q.type === 'mcq' && Array.isArray(q.options)) {
      const opts = q.options.map((o: string, oi: number) => ({
        key:   String.fromCharCode(65 + oi),  // A, B, C, D
        label: o,
      }));
      // Find the correct answer key
      const correctIdx = q.options.findIndex(
        (o: string) => o === q.answer || o.toLowerCase() === q.answer?.toLowerCase()
      );
      const correctKey = correctIdx >= 0 ? String.fromCharCode(65 + correctIdx) : 'A';
      questions.push({
        number: num, type: 'mcq', shortLabel: `Q${num}`,
        text: q.text, options: opts,
        correctAnswer: correctKey, explanation: q.explanation ?? '',
      });
    } else if (q.type === 'tfng' || q.type === 'tf') {
      questions.push({
        number: num, type: 'tfng', shortLabel: `Statement ${num}`,
        text: q.text,
        correctAnswer: (q.answer ?? 'TRUE').toUpperCase(),
        explanation: q.explanation ?? '',
      });
    }
    // Skip matching — AI doesn't generate labeled headings
  });

  return { questions, headings };
}

const ORANGE     = '#C04A06';
const ORANGE_BG  = '#FFF7ED';
const ORANGE_BDR = '#FED7AA';
const GREEN      = '#16A34A';
const GREEN_BG   = '#EDFAF4';

// ─────────────────────────────────────────────────────────────────
// Passage data
// ─────────────────────────────────────────────────────────────────
const PASSAGE_TITLE = 'The Rise of Vertical Farming';

const PARAGRAPHS = [
  {
    label: 'A',
    text: 'In an era defined by rapid urbanisation and mounting concerns over food security, vertical farming has emerged as one of the most compelling innovations in modern agriculture. Unlike traditional farming, which spreads horizontally across vast tracts of land, vertical farming stacks crops in layered systems within fully climate-controlled indoor environments. Proponents argue that these facilities can produce food year-round regardless of weather conditions, using significantly less water and no chemical pesticides.',
  },
  {
    label: 'B',
    text: 'The concept\'s most prominent advocate was Dickson Despommier, a professor at Columbia University, who first proposed commercial vertical farms in 1999. LED lighting advances and falling energy costs made the concept viable by the 2010s. His seminal work attracted a new wave of entrepreneurs and researchers, inspiring a generation of indoor agriculture start-ups across the United States, Japan and the Netherlands.',
  },
  {
    label: 'C',
    text: 'Beyond productivity, vertical farms offer a striking environmental proposition. By eliminating the need for large-scale land clearance and reducing transportation distances from farm to fork, they dramatically cut carbon emissions associated with conventional supply chains. Moreover, closed-loop water recycling systems mean these facilities consume up to 95% less water than open-field agriculture, a critical advantage in regions already facing severe water scarcity.',
  },
  {
    label: 'D',
    text: 'Despite the enthusiasm, vertical farming has not escaped financial scrutiny. Several high-profile companies, including AeroFarms, filed for bankruptcy in 2023 after struggling to achieve profitability at scale. The upfront capital costs of constructing and equipping a facility — combined with energy bills driven by round-the-clock artificial lighting — remain stubbornly high. Investors who poured significant capital into the sector are now demanding clearer paths to return.',
  },
  {
    label: 'E',
    text: 'A second generation of vertical farmers is responding to these challenges with radical technological innovation. Modular, prefabricated growing units that can be assembled in disused warehouses or shipping containers are lowering entry costs. Alongside advances in solar-integrated roofing and battery storage, these new approaches are reshaping what it means to farm in the 21st century, placing fresh produce within reach of communities far removed from traditional agricultural land.',
  },
];

// ─────────────────────────────────────────────────────────────────
// Heading options (i–vi)
// ─────────────────────────────────────────────────────────────────
const HEADINGS = [
  { key: 'i',   label: 'i.  The financial risks of a growing industry' },
  { key: 'ii',  label: 'ii.  A new approach to an old idea' },
  { key: 'iii', label: 'iii. The ecological case for indoor agriculture' },
  { key: 'iv',  label: 'iv.  Government subsidies for sustainable food production' },
  { key: 'v',   label: 'v.  Feeding cities from within: an introduction' },
  { key: 'vi',  label: 'vi.  Origins of the vertical farming movement' },
];

// ─────────────────────────────────────────────────────────────────
// Questions
// ─────────────────────────────────────────────────────────────────
const QUESTIONS: ReadingQuestion[] = [
  {
    number: 1, type: 'matching', shortLabel: 'Paragraph A',
    text: 'Choose the correct heading for Paragraph A.',
    correctAnswer: 'v',
    explanation: 'Paragraph A introduces vertical farming as a solution to urbanisation and food security.',
  },
  {
    number: 2, type: 'matching', shortLabel: 'Paragraph B',
    text: 'Choose the correct heading for Paragraph B.',
    correctAnswer: 'vi',
    explanation: 'Paragraph B is focused on Despommier and the origins of the vertical farming concept.',
  },
  {
    number: 3, type: 'matching', shortLabel: 'Paragraph C',
    text: 'Choose the correct heading for Paragraph C.',
    correctAnswer: 'iii',
    explanation: 'Paragraph C discusses reduced land use, lower emissions and water savings — the ecological case.',
  },
  {
    number: 4, type: 'matching', shortLabel: 'Paragraph D',
    text: 'Choose the correct heading for Paragraph D.',
    correctAnswer: 'i',
    explanation: 'Paragraph D covers company bankruptcies, high capital costs and investor demands.',
  },
  {
    number: 5, type: 'matching', shortLabel: 'Paragraph E',
    text: 'Choose the correct heading for Paragraph E.',
    correctAnswer: 'ii',
    explanation: 'Paragraph E describes second-generation innovations — a new approach to vertical farming.',
  },
  {
    number: 6, type: 'mcq', shortLabel: 'Q6',
    text: "What was significant about Despommier's work?",
    options: [
      { key: 'A', label: 'He opened the first commercial vertical farm in 2004' },
      { key: 'B', label: 'His proposals inspired a wave of entrepreneurs and researchers' },
      { key: 'C', label: 'He personally developed new LED lighting technology' },
      { key: 'D', label: 'He proved that vertical farming was financially viable' },
    ],
    correctAnswer: 'B',
    explanation: 'Paragraph B states his work "attracted a new wave of entrepreneurs and researchers".',
  },
  {
    number: 7, type: 'mcq', shortLabel: 'Q7',
    text: 'According to Paragraph C, how much less water do vertical farms use compared to open-field agriculture?',
    options: [
      { key: 'A', label: '50% less' },
      { key: 'B', label: '75% less' },
      { key: 'C', label: 'Up to 95% less' },
      { key: 'D', label: 'Twice as much' },
    ],
    correctAnswer: 'C',
    explanation: 'Paragraph C explicitly states "closed-loop water recycling systems mean these facilities consume up to 95% less water".',
  },
  {
    number: 8, type: 'mcq', shortLabel: 'Q8',
    text: 'Which of the following helped make vertical farming commercially viable in the 2010s?',
    options: [
      { key: 'A', label: 'Increased government subsidies' },
      { key: 'B', label: 'LED lighting advances and falling energy costs' },
      { key: 'C', label: 'A reduction in urban land prices' },
      { key: 'D', label: 'New international pesticide regulations' },
    ],
    correctAnswer: 'B',
    explanation: 'Paragraph B states "LED lighting advances and falling energy costs made the concept viable by the 2010s".',
  },
  {
    number: 9, type: 'mcq', shortLabel: 'Q9',
    text: 'What happened to AeroFarms in 2023?',
    options: [
      { key: 'A', label: 'It was acquired by a major technology company' },
      { key: 'B', label: 'It expanded into European markets' },
      { key: 'C', label: 'It filed for bankruptcy' },
      { key: 'D', label: 'It achieved its first profitable quarter' },
    ],
    correctAnswer: 'C',
    explanation: 'Paragraph D states "Several high-profile companies, including AeroFarms, filed for bankruptcy in 2023".',
  },
  {
    number: 10, type: 'tfng', shortLabel: 'Statement 10',
    text: 'Vertical farms can produce food throughout the year regardless of weather conditions.',
    correctAnswer: 'TRUE',
    explanation: 'Paragraph A states these facilities "can produce food year-round regardless of weather conditions".',
  },
  {
    number: 11, type: 'tfng', shortLabel: 'Statement 11',
    text: 'Despommier built the first commercial vertical farm in New York City.',
    correctAnswer: 'NOT GIVEN',
    explanation: 'The passage mentions Despommier proposed the concept but does not state he built a farm in New York.',
  },
  {
    number: 12, type: 'tfng', shortLabel: 'Statement 12',
    text: 'Energy costs are the single biggest obstacle to vertical farming profitability.',
    correctAnswer: 'FALSE',
    explanation: 'Paragraph D cites both upfront capital costs and energy bills as challenges — not singling out energy.',
  },
  {
    number: 13, type: 'tfng', shortLabel: 'Statement 13',
    text: 'Investment in vertical farming exceeded four billion dollars by 2021.',
    correctAnswer: 'NOT GIVEN',
    explanation: 'The passage refers to "significant capital" without providing a specific figure.',
  },
];

const TOTAL_SECONDS = 60 * 60;
const WARN_SECONDS  = 5 * 60;
const WORD_COUNT    = '~850 words';

function secondsToMMSS(s: number) {
  const m   = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

// ─────────────────────────────────────────────────────────────────
// HeadingSelector
// ─────────────────────────────────────────────────────────────────
function HeadingSelector({
  questionNumber, paragraphLabel, value, usedKeys, onSelect, headingList,
}: {
  questionNumber: number;
  paragraphLabel: string;
  value: string | undefined;
  usedKeys: string[];
  onSelect: (key: string) => void;
  headingList: { key: string; label: string }[];
}) {
  const [expanded, setExpanded] = useState(false);
  const selected = headingList.find(h => h.key === value);

  return (
    <View style={hs.wrap}>
      <View style={hs.labelRow}>
        <View style={hs.qNum}>
          <Text style={hs.qNumText}>{questionNumber}</Text>
        </View>
        <Text style={hs.paraLabel}>{paragraphLabel}</Text>
      </View>
      <TouchableOpacity
        style={[hs.trigger, selected && hs.triggerSelected, expanded && hs.triggerOpen]}
        onPress={() => setExpanded(e => !e)}
        activeOpacity={0.85}
      >
        <Text style={[hs.triggerText, !selected && hs.triggerPlaceholder]} numberOfLines={2}>
          {selected ? selected.label : 'Tap to select a heading…'}
        </Text>
        <Text style={hs.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={hs.dropdown}>
          {headingList.map(h => {
            const alreadyUsed = usedKeys.includes(h.key) && h.key !== value;
            return (
              <TouchableOpacity
                key={h.key}
                style={[hs.option, h.key === value && hs.optionSelected, alreadyUsed && hs.optionDisabled]}
                onPress={() => {
                  if (alreadyUsed) return;
                  onSelect(h.key);
                  setExpanded(false);
                }}
                activeOpacity={alreadyUsed ? 1 : 0.75}
              >
                <Text style={[
                  hs.optionText,
                  h.key === value && hs.optionTextSelected,
                  alreadyUsed && hs.optionTextDisabled,
                ]}>
                  {h.label}
                </Text>
                {h.key === value && <CheckIcon size={13} color={ORANGE} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const hs = StyleSheet.create({
  wrap:     { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center',
  },
  qNumText:  { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  paraLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  trigger: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 8,
    padding: 10, backgroundColor: Colors.white, gap: 8,
  },
  triggerSelected: { borderColor: ORANGE, backgroundColor: ORANGE_BG },
  triggerOpen:     { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderColor: ORANGE },
  triggerText:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, flex: 1, lineHeight: 18 },
  triggerPlaceholder: { color: '#BBB' },
  chevron: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#888' },
  dropdown: {
    borderWidth: 1, borderTopWidth: 0, borderColor: ORANGE,
    borderBottomLeftRadius: 8, borderBottomRightRadius: 8,
    backgroundColor: Colors.white, overflow: 'hidden',
  },
  option: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 10, paddingHorizontal: 12,
    borderTopWidth: 1, borderTopColor: '#EAEAEA',
  },
  optionSelected:     { backgroundColor: ORANGE_BG },
  optionDisabled:     { opacity: 0.35 },
  optionText:         { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, flex: 1 },
  optionTextSelected: { fontFamily: 'Inter_600SemiBold', color: ORANGE },
  optionTextDisabled: { color: '#BBB' },
});

// ─────────────────────────────────────────────────────────────────
// McqQuestion
// ─────────────────────────────────────────────────────────────────
function McqQuestion({
  q, value, onSelect,
}: {
  q: ReadingQuestion;
  value: string | undefined;
  onSelect: (key: string) => void;
}) {
  return (
    <View style={mcq.wrap}>
      <View style={mcq.header}>
        <View style={mcq.qNum}>
          <Text style={mcq.qNumText}>{q.number}</Text>
        </View>
        <Text style={mcq.qText}>{q.text}</Text>
      </View>
      <View style={mcq.options}>
        {q.options!.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[mcq.option, value === opt.key && mcq.optionSelected]}
            onPress={() => onSelect(opt.key)}
            activeOpacity={0.8}
          >
            <View style={[mcq.radio, value === opt.key && mcq.radioSelected]}>
              {value === opt.key && <View style={mcq.radioInner} />}
            </View>
            <Text style={[mcq.optLabel, value === opt.key && mcq.optLabelSelected]}>
              <Text style={mcq.optKey}>{opt.key})</Text> {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const mcq = StyleSheet.create({
  wrap:   { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  qNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  qNumText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  qText:    { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1, lineHeight: 21 },
  options:  { gap: 8, paddingLeft: 34 },
  option: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: Colors.white, borderRadius: 8, borderWidth: 1, borderColor: '#EAEAEA', padding: 10,
  },
  optionSelected: { borderColor: ORANGE, backgroundColor: ORANGE_BG },
  radio: {
    width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: '#EAEAEA',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  radioSelected: { borderColor: ORANGE },
  radioInner:    { width: 8, height: 8, borderRadius: 4, backgroundColor: ORANGE },
  optLabel:        { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },
  optLabelSelected:{ fontFamily: 'Inter_500Medium', color: ORANGE },
  optKey:          { fontFamily: 'Inter_700Bold' },
});

// ─────────────────────────────────────────────────────────────────
// TfngQuestion
// ─────────────────────────────────────────────────────────────────
function TfngQuestion({
  q, value, onSelect,
}: {
  q: ReadingQuestion;
  value: string | undefined;
  onSelect: (key: string) => void;
}) {
  const OPTIONS = ['TRUE', 'FALSE', 'NOT GIVEN'];
  return (
    <View style={tfng.wrap}>
      <View style={tfng.header}>
        <View style={tfng.qNum}>
          <Text style={tfng.qNumText}>{q.number}</Text>
        </View>
        <Text style={tfng.qText}>{q.text}</Text>
      </View>
      <View style={tfng.pills}>
        {OPTIONS.map(opt => {
          const sel = value === opt;
          const containerStyle = sel
            ? opt === 'TRUE'
              ? tfng.pillTrue
              : opt === 'FALSE'
                ? tfng.pillFalse
                : tfng.pillNG
            : undefined;
          const textStyle = sel
            ? opt === 'TRUE'
              ? tfng.pillTextTrue
              : opt === 'FALSE'
                ? tfng.pillTextFalse
                : tfng.pillTextNG
            : undefined;
          return (
            <TouchableOpacity
              key={opt}
              style={[tfng.pill, containerStyle]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.8}
            >
              <Text style={[tfng.pillText, textStyle]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tfng = StyleSheet.create({
  wrap:   { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  qNum: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
  },
  qNumText:  { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  qText:     { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1, lineHeight: 21 },
  pills:     { flexDirection: 'row', gap: 8, paddingLeft: 34, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1, borderColor: '#EAEAEA', backgroundColor: Colors.white,
  },
  pillTrue:  { backgroundColor: GREEN_BG, borderColor: GREEN },
  pillFalse: { backgroundColor: '#FFF0EE', borderColor: ORANGE },
  pillNG:    { backgroundColor: Colors.bg2, borderColor: '#888' },
  pillText:      { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#888' },
  pillTextTrue:  { color: GREEN },
  pillTextFalse: { color: ORANGE },
  pillTextNG:    { color: '#666' },
});

// ─────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────
export default function ReadingSessionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const params    = useLocalSearchParams<{ exam?: string; passage?: string; languageCode?: string }>();
  const exam      = params.exam ?? 'IELTS';
  const passage   = params.passage ?? '1';
  const langCode  = params.languageCode ?? 'en';

  const { user } = useAuth();

  // AI content overrides (replace static passage/questions when loaded)
  const [aiTitle,     setAiTitle]     = useState<string>(PASSAGE_TITLE);
  const [paragraphs,  setParagraphs]  = useState(PARAGRAPHS);
  const [questions,   setQuestions]   = useState<ReadingQuestion[]>(QUESTIONS);
  const [headings,    setHeadings]    = useState(HEADINGS);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const qs  = new URLSearchParams({ userId: user.id, languageCode: langCode, module: 'reading' });
        const res = await fetch(`${API}/content/today?${qs}`);
        const json = res.ok ? await res.json() : null;
        const c = json?.content;
        if (c?.passage && Array.isArray(c.questions) && c.questions.length > 0) {
          const paras = splitPassage(c.passage);
          if (paras.length > 0) {
            const { questions: aiQs, headings: aiH } = mapAiQuestions(c.questions);
            if (aiQs.length > 0) {
              setAiTitle(c.title ?? PASSAGE_TITLE);
              setParagraphs(paras);
              setQuestions(aiQs);
              if (aiH.length > 0) setHeadings(aiH);
            }
          }
        }
      } catch {}
    })();
  }, [user, langCode]);

  const [answers,     setAnswers]     = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [submitting,  setSubmitting]  = useState(false);
  // mobile view toggle
  const [mobileView, setMobileView]  = useState<'passage' | 'questions'>('passage');

  const startedAt  = useRef(Date.now());
  const answersRef = useRef(answers);
  useEffect(() => { answersRef.current = answers; }, [answers]);

  useEffect(() => {
    Analytics.practiceSessionStarted({
      module: 'reading',
      languageCode: 'en',
      examType: exam,
      mode: 'practice',
    });
  }, []);

  const answeredCount = Object.keys(answers).length;
  const isWarning     = secondsLeft <= WARN_SECONDS;
  const allAnswered   = answeredCount === questions.length;

  const usedHeadingKeys = questions
    .filter(q => q.type === 'matching')
    .map(q => answers[q.number])
    .filter(Boolean) as string[];

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) { clearInterval(id); doSubmit(answersRef.current); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const setAnswer = useCallback((qNum: number, val: string) => {
    setAnswers(prev => ({ ...prev, [qNum]: val }));
  }, []);

  function doSubmit(currentAnswers: Record<number, string>) {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = Math.round((Date.now() - startedAt.current) / 1000);
    let correct = 0;
    questions.forEach(q => { if (currentAnswers[q.number] === q.correctAnswer) correct++; });
    const band = estimateBand(correct, questions.length);
    Analytics.practiceSessionCompleted({
      module: 'reading',
      languageCode: langCode,
      examType: exam,
      score: band,
      durationSeconds: timeTaken,
    });
    setReadingResult({
      exam,
      difficulty: passage === '1' ? 'Easy' : passage === '2' ? 'Medium' : passage === '3' ? 'Hard' : 'Full',
      passageTitle: aiTitle,
      timeTakenSeconds: timeTaken,
      totalQuestions: questions.length,
      correctCount: correct,
      bandEstimate: band,
      answers: currentAnswers,
      questions,
    });
    router.replace('/modules/reading/results' as any);
  }

  const matchingQs = questions.filter(q => q.type === 'matching');
  const mcqQs      = questions.filter(q => q.type === 'mcq');
  const tfngQs     = questions.filter(q => q.type === 'tfng');

  const passageLabel = passage === 'full' ? 'Full Test' : `Passage ${passage}`;
  const progressPct  = (answeredCount / QUESTIONS.length) * 100;

  // ── Passage panel content ────────────────────────────────────────
  const PassagePanel = (
    <>
      {/* Top bar */}
      <View style={p.topBar}>
        <View style={p.topLeft}>
          <View style={p.passageBadge}>
            <Text style={p.passageBadgeText}>{passageLabel}</Text>
          </View>
          <Text style={p.passageTitle} numberOfLines={1}>{aiTitle}</Text>
        </View>
        <Text style={[p.timer, isWarning && p.timerWarn]}>{secondsToMMSS(secondsLeft)}</Text>
      </View>

      {/* Passage text */}
      <ScrollView style={p.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={p.scrollContent}>
        <Text style={p.passageHeading}>{aiTitle}</Text>
        {paragraphs.map(para => (
          <View key={para.label} style={p.paraBlock}>
            <Text style={p.paraText}>
              <Text style={p.paraLabel}>Paragraph {para.label}{'  '}</Text>
              {para.text}
            </Text>
          </View>
        ))}
        <Text style={p.wordCount}>{WORD_COUNT}</Text>
        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );

  // ── Questions panel content ──────────────────────────────────────
  const QuestionsPanel = (
    <>
      {/* Top bar */}
      <View style={q.topBar}>
        <View style={{ flex: 1 }}>
          <View style={q.topRow}>
            <Text style={q.topTitle}>Questions</Text>
            <Text style={q.topCount}>{answeredCount}/{questions.length} answered</Text>
          </View>
          <View style={q.progressTrack}>
            <View style={[q.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
        </View>
      </View>

      {/* Questions list */}
      <ScrollView style={q.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={q.scrollContent}>

        {/* Matching headings */}
        <View style={q.section}>
          <Text style={q.sectionTitle}>Q1–5 · Matching Headings</Text>
          <Text style={q.sectionInstr}>Choose the correct heading for each paragraph.</Text>
          <View style={q.headingListBox}>
            <Text style={q.headingListLabel}>LIST OF HEADINGS</Text>
            {headings.map(h => (
              <Text key={h.key} style={q.headingItem}>{h.label}</Text>
            ))}
          </View>
          <View style={q.qGroup}>
            {matchingQs.map(mq => (
              <HeadingSelector
                key={mq.number}
                questionNumber={mq.number}
                paragraphLabel={mq.shortLabel}
                value={answers[mq.number]}
                usedKeys={usedHeadingKeys}
                onSelect={key => setAnswer(mq.number, key)}
                headingList={headings}
              />
            ))}
          </View>
        </View>

        {/* Multiple choice */}
        <View style={q.section}>
          <Text style={q.sectionTitle}>Q6–9 · Multiple Choice</Text>
          <Text style={q.sectionInstr}>Choose the correct letter A, B, C or D.</Text>
          <View style={q.qGroup}>
            {mcqQs.map(mq => (
              <McqQuestion
                key={mq.number}
                q={mq}
                value={answers[mq.number]}
                onSelect={key => setAnswer(mq.number, key)}
              />
            ))}
          </View>
        </View>

        {/* True / False / Not Given */}
        <View style={q.section}>
          <Text style={q.sectionTitle}>Q10–13 · True / False / Not Given</Text>
          <Text style={q.sectionInstr}>Do the following statements agree with the passage?</Text>
          <View style={q.qGroup}>
            {tfngQs.map(mq => (
              <TfngQuestion
                key={mq.number}
                q={mq}
                value={answers[mq.number]}
                onSelect={key => setAnswer(mq.number, key)}
              />
            ))}
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Submit button */}
      <View style={q.submitWrap}>
        <TouchableOpacity
          style={[q.submitBtn, !allAnswered && q.submitBtnDisabled]}
          onPress={() => doSubmit(answers)}
          disabled={!allAnswered || submitting}
          activeOpacity={0.85}
        >
          <Text style={[q.submitText, !allAnswered && q.submitTextDisabled]}>
            {submitting ? 'Submitting…' : allAnswered ? 'Submit Answers →' : `Answer all questions (${answeredCount}/${questions.length})`}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  // ── Desktop split layout ─────────────────────────────────────────
  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ReadingSidebar />

        {/* Left: Passage */}
        <View style={st.leftPanel}>
          {PassagePanel}
        </View>

        {/* Right: Questions */}
        <View style={st.rightPanel}>
          {QuestionsPanel}
        </View>
      </View>
    );
  }

  // ── Mobile layout ────────────────────────────────────────────────
  return (
    <SafeAreaView style={st.safe} edges={['top']}>
      {/* Mobile header */}
      <View style={st.mobileHeader}>
        <View style={p.passageBadge}>
          <Text style={p.passageBadgeText}>{passageLabel}</Text>
        </View>
        <Text style={[st.mobileTimer, isWarning && p.timerWarn]}>{secondsToMMSS(secondsLeft)}</Text>
      </View>

      {/* View toggle */}
      <View style={st.toggleRow}>
        {(['passage', 'questions'] as const).map(v => (
          <TouchableOpacity
            key={v}
            style={[st.toggleBtn, mobileView === v && st.toggleBtnActive]}
            onPress={() => setMobileView(v)}
            activeOpacity={0.8}
          >
            <Text style={[st.toggleText, mobileView === v && st.toggleTextActive]}>
              {v === 'passage' ? 'Passage' : `Questions (${answeredCount}/${questions.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {mobileView === 'passage' ? (
        <View style={{ flex: 1 }}>
          {/* Mobile passage text (no top bar — already in header) */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={p.scrollContent}>
            <Text style={p.passageHeading}>{aiTitle}</Text>
            {paragraphs.map(para => (
              <View key={para.label} style={p.paraBlock}>
                <Text style={p.paraText}>
                  <Text style={p.paraLabel}>Paragraph {para.label}{'  '}</Text>
                  {para.text}
                </Text>
              </View>
            ))}
            <Text style={p.wordCount}>{WORD_COUNT}</Text>
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {QuestionsPanel}
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Passage panel styles ───────────────────────────────────────────
const p = StyleSheet.create({
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
    backgroundColor: Colors.white,
  },
  topLeft:      { flex: 1, gap: 4, marginRight: 12 },
  passageBadge: { backgroundColor: ORANGE_BG, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  passageBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: ORANGE, textTransform: 'uppercase' as const },
  passageTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000' },
  timer:        { fontFamily: 'Inter_700Bold', fontSize: 14, color: ORANGE },
  timerWarn:    { color: '#C84040' },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 20 },
  passageHeading:{ fontFamily: 'Inter_700Bold', fontSize: 18, color: '#000', marginBottom: 16 },
  paraBlock:     { marginBottom: 14 },
  paraLabel:     { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  paraText:      { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#333', lineHeight: 27 },
  wordCount:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#BBB', marginTop: 8 },
});

// ── Questions panel styles ─────────────────────────────────────────
const q = StyleSheet.create({
  topBar: {
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
    backgroundColor: Colors.white, gap: 8,
  },
  topRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  topTitle:     { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000' },
  topCount:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },
  progressTrack:{ height: 3, backgroundColor: '#EAEAEA', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: ORANGE, borderRadius: 2 },

  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingVertical: 16, gap: 16 },

  section: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA', padding: 16, gap: 12,
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000' },
  sectionInstr: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', lineHeight: 18, marginTop: -4 },
  headingListBox: { backgroundColor: '#F9F8F5', borderRadius: 8, padding: 12, gap: 5 },
  headingListLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 10, color: '#888',
    textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4,
  },
  headingItem: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#333', lineHeight: 19 },
  qGroup: { gap: 14 },

  submitWrap: { padding: 16, borderTopWidth: 1, borderTopColor: '#EAEAEA', backgroundColor: Colors.white },
  submitBtn:  { backgroundColor: ORANGE, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: '#F4F4F0' },
  submitText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  submitTextDisabled: { color: '#BBB' },
});

// ── Outer layout styles ────────────────────────────────────────────
const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  leftPanel: {
    flex: 1, backgroundColor: Colors.white,
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
  },
  rightPanel: { flex: 1, backgroundColor: Colors.bg },

  mobileHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
    backgroundColor: Colors.white,
  },
  mobileTimer: { fontFamily: 'Inter_700Bold', fontSize: 14, color: ORANGE },

  toggleRow: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
  },
  toggleBtn: {
    flex: 1, paddingVertical: 10, alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  toggleBtnActive: { borderBottomColor: ORANGE },
  toggleText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#888' },
  toggleTextActive:{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: ORANGE },
});
