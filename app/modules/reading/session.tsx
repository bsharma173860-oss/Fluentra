import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { AppLayout } from '@/components/layout/AppLayout';
import {
  setReadingResult,
  estimateBand,
  ReadingQuestion,
} from '@/lib/readingStore';

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
    explanation: 'Paragraph A introduces vertical farming as a solution to urbanisation and food security — matching "Feeding cities from within: an introduction".',
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
    explanation: 'Paragraph C discusses reduced land use, lower emissions, and water savings — the ecological case.',
  },
  {
    number: 4, type: 'matching', shortLabel: 'Paragraph D',
    text: 'Choose the correct heading for Paragraph D.',
    correctAnswer: 'i',
    explanation: 'Paragraph D covers company bankruptcies, high capital and energy costs, and investor demands — the financial risks.',
  },
  {
    number: 5, type: 'matching', shortLabel: 'Paragraph E',
    text: 'Choose the correct heading for Paragraph E.',
    correctAnswer: 'ii',
    explanation: 'Paragraph E describes second-generation innovations (modular units, solar roofing) — a new approach to vertical farming.',
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
    explanation: 'Paragraph B states his work "attracted a new wave of entrepreneurs and researchers, inspiring a generation of indoor agriculture start-ups".',
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
    explanation: 'Paragraph D cites both upfront capital costs and energy bills as challenges, not singling out energy as the greatest.',
  },
  {
    number: 13, type: 'tfng', shortLabel: 'Statement 13',
    text: 'Investment in vertical farming exceeded four billion dollars by 2021.',
    correctAnswer: 'NOT GIVEN',
    explanation: 'The passage does not mention any specific investment figures — it only refers to "significant capital" without a number.',
  },
];

const TOTAL_SECONDS = 60 * 60;
const WARN_SECONDS = 5 * 60;

function secondsToMMSS(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

type ViewMode = 'passage' | 'questions' | 'split';

// ─────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────

function PassageContent() {
  return (
    <View style={pc.wrap}>
      <Text style={pc.title}>{PASSAGE_TITLE}</Text>
      {PARAGRAPHS.map(p => (
        <View key={p.label} style={pc.paraWrap}>
          <Text style={pc.paraLabel}>Paragraph {p.label}</Text>
          <Text style={pc.paraText}>{p.text}</Text>
        </View>
      ))}
    </View>
  );
}

const pc = StyleSheet.create({
  wrap: { gap: 16, padding: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink, marginBottom: 4 },
  paraWrap: { gap: 6 },
  paraLabel: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.p, letterSpacing: 0.5, textTransform: 'uppercase' },
  paraText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, lineHeight: 23 },
});

// Heading Selector
function HeadingSelector({
  questionNumber,
  paragraphLabel,
  value,
  usedKeys,
  onSelect,
}: {
  questionNumber: number;
  paragraphLabel: string;
  value: string | undefined;
  usedKeys: string[];
  onSelect: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const selected = HEADINGS.find(h => h.key === value);

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
          {HEADINGS.map(h => {
            const alreadyUsed = usedKeys.includes(h.key) && h.key !== value;
            return (
              <TouchableOpacity
                key={h.key}
                style={[
                  hs.option,
                  h.key === value && hs.optionSelected,
                  alreadyUsed && hs.optionDisabled,
                ]}
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
                {h.key === value && <Text style={hs.checkMark}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const hs = StyleSheet.create({
  wrap: { gap: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
  },
  qNumText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  paraLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    padding: 12,
    backgroundColor: Colors.white,
    gap: 8,
  },
  triggerSelected: { borderColor: Colors.p, backgroundColor: Colors.p_soft },
  triggerOpen: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderColor: Colors.p },
  triggerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, flex: 1, lineHeight: 18 },
  triggerPlaceholder: { color: Colors.ink4 },
  chevron: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  dropdown: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: Colors.p,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  optionSelected: { backgroundColor: Colors.p_soft },
  optionDisabled: { opacity: 0.35 },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink, flex: 1 },
  optionTextSelected: { fontFamily: 'Inter_600SemiBold', color: Colors.p },
  optionTextDisabled: { color: Colors.ink4 },
  checkMark: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.p, marginLeft: 8 },
});

// MCQ question
function McqQuestion({
  q,
  value,
  onSelect,
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
  wrap: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  qNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  qNumText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  qText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1, lineHeight: 21 },
  options: { gap: 8, paddingLeft: 34 },
  option: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: 12,
  },
  optionSelected: { borderColor: Colors.p, backgroundColor: Colors.p_soft },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  radioSelected: { borderColor: Colors.p },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.p },
  optLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1, lineHeight: 20 },
  optLabelSelected: { color: Colors.p, fontFamily: 'Inter_500Medium' },
  optKey: { fontFamily: 'Inter_700Bold' },
});

// TRUE/FALSE/NOT GIVEN question
function TfngQuestion({
  q,
  value,
  onSelect,
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
          const selStyle = sel
            ? opt === 'TRUE'      ? tfng.pillTrue
            : opt === 'FALSE'     ? tfng.pillFalse
            : tfng.pillNG
            : undefined;
          const textSelStyle = sel
            ? opt === 'TRUE'      ? tfng.pillTextTrue
            : opt === 'FALSE'     ? tfng.pillTextFalse
            : tfng.pillTextNG
            : undefined;
          return (
            <TouchableOpacity
              key={opt}
              style={[tfng.pill, selStyle]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.8}
            >
              <Text style={[tfng.pillText, textSelStyle]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const tfng = StyleSheet.create({
  wrap: { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  qNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  },
  qNumText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  qText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1, lineHeight: 21 },
  pills: { flexDirection: 'row', gap: 8, paddingLeft: 34, flexWrap: 'wrap' },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  pillTrue:      { backgroundColor: Colors.green_bg, borderColor: Colors.green },
  pillFalse:     { backgroundColor: '#FFF0F0', borderColor: '#C84040' },
  pillNG:        { backgroundColor: Colors.bg2, borderColor: Colors.ink3 },
  pillText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink2 },
  pillTextTrue:  { color: Colors.green },
  pillTextFalse: { color: '#C84040' },
  pillTextNG:    { color: Colors.ink3 },
});

// ─────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────
export default function ReadingSessionScreen() {
  const params = useLocalSearchParams<{ exam?: string; difficulty?: string }>();
  const exam = params.exam ?? 'IELTS';
  const difficulty = params.difficulty ?? 'B2';

  const [view, setView] = useState<ViewMode>('passage');
  const [activePassage, setActivePassage] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(Date.now());
  const answersRef = useRef(answers);

  useEffect(() => { answersRef.current = answers; }, [answers]);

  const answeredCount = Object.keys(answers).length;
  const isWarning = secondsLeft <= WARN_SECONDS;
  const allAnswered = answeredCount === QUESTIONS.length;

  // Matching headings: which keys are already used (for deduplication)
  const usedHeadingKeys = QUESTIONS
    .filter(q => q.type === 'matching')
    .map(q => answers[q.number])
    .filter(Boolean) as string[];

  useEffect(() => {
    const id = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(id);
          doSubmit(answersRef.current);
          return 0;
        }
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
    QUESTIONS.forEach(q => {
      if (currentAnswers[q.number] === q.correctAnswer) correct++;
    });
    const band = estimateBand(correct, QUESTIONS.length);
    setReadingResult({
      exam,
      difficulty,
      passageTitle: PASSAGE_TITLE,
      timeTakenSeconds: timeTaken,
      totalQuestions: QUESTIONS.length,
      correctCount: correct,
      bandEstimate: band,
      answers: currentAnswers,
      questions: QUESTIONS,
    });
    router.replace('/modules/reading/results' as any);
  }

  // ── Section groups for questions view
  const matchingQs = QUESTIONS.filter(q => q.type === 'matching');
  const mcqQs = QUESTIONS.filter(q => q.type === 'mcq');
  const tfngQs = QUESTIONS.filter(q => q.type === 'tfng');

  function QuestionsContent() {
    return (
      <View style={qs.wrap}>
        {/* Matching headings section */}
        <View style={qs.section}>
          <Text style={qs.sectionTitle}>Questions 1–5 · Matching Headings</Text>
          <Text style={qs.sectionInstr}>
            Choose the correct heading for each paragraph from the list of headings below. Each heading may be used only once.
          </Text>
          <View style={qs.headingList}>
            <Text style={qs.headingsLabel}>List of Headings</Text>
            {HEADINGS.map(h => (
              <Text key={h.key} style={qs.headingItem}>{h.label}</Text>
            ))}
          </View>
          <View style={qs.questions}>
            {matchingQs.map(q => (
              <HeadingSelector
                key={q.number}
                questionNumber={q.number}
                paragraphLabel={q.shortLabel}
                value={answers[q.number]}
                usedKeys={usedHeadingKeys}
                onSelect={key => setAnswer(q.number, key)}
              />
            ))}
          </View>
        </View>

        {/* MCQ section */}
        <View style={qs.section}>
          <Text style={qs.sectionTitle}>Questions 6–9 · Multiple Choice</Text>
          <Text style={qs.sectionInstr}>
            Choose the correct letter, A, B, C or D.
          </Text>
          <View style={qs.questions}>
            {mcqQs.map(q => (
              <McqQuestion
                key={q.number}
                q={q}
                value={answers[q.number]}
                onSelect={key => setAnswer(q.number, key)}
              />
            ))}
          </View>
        </View>

        {/* TRUE/FALSE/NOT GIVEN section */}
        <View style={qs.section}>
          <Text style={qs.sectionTitle}>Questions 10–13 · True / False / Not Given</Text>
          <Text style={qs.sectionInstr}>
            Do the following statements agree with the information given in the passage?
          </Text>
          <View style={qs.questions}>
            {tfngQs.map(q => (
              <TfngQuestion
                key={q.number}
                q={q}
                value={answers[q.number]}
                onSelect={key => setAnswer(q.number, key)}
              />
            ))}
          </View>
        </View>
      </View>
    );
  }

  const qs = StyleSheet.create({
    wrap: { gap: 20, padding: 16 },
    section: {
      backgroundColor: Colors.white,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: Colors.border,
      padding: 16,
      gap: 12,
    },
    sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
    sectionInstr: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, lineHeight: 18, marginTop: -4 },
    headingList: {
      backgroundColor: Colors.bg2,
      borderRadius: 10,
      padding: 12,
      gap: 6,
    },
    headingsLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.ink2, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
    headingItem: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink, lineHeight: 19 },
    questions: { gap: 14 },
  });

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Reading</Text>
          <Text style={s.headerSub}>{exam} · {difficulty} · {PASSAGE_TITLE}</Text>
        </View>
        <View style={[s.timerBadge, isWarning && s.timerBadgeWarn]}>
          <Text style={[s.timerText, isWarning && s.timerTextWarn]}>
            {secondsToMMSS(secondsLeft)}
          </Text>
        </View>
      </View>

      {/* ── Passage tabs ── */}
      <View style={s.tabRow}>
        {['Passage 1', 'Passage 2', 'Passage 3'].map((tab, i) => (
          <TouchableOpacity
            key={i}
            style={[s.tab, activePassage === i && s.tabActive]}
            onPress={() => setActivePassage(i)}
            activeOpacity={0.8}
          >
            <Text style={[s.tabText, activePassage === i && s.tabTextActive]}>{tab}</Text>
            {i > 0 && (
              <View style={s.lockBadge}>
                <Text style={s.lockIcon}>🔒</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── View toggle ── */}
      <View style={s.toggleRow}>
        {(['passage', 'questions', 'split'] as ViewMode[]).map(v => (
          <TouchableOpacity
            key={v}
            style={[s.toggleBtn, view === v && s.toggleBtnActive]}
            onPress={() => setView(v)}
            activeOpacity={0.8}
          >
            <Text style={[s.toggleText, view === v && s.toggleTextActive]}>
              {v === 'passage' ? '📄 Passage' : v === 'questions' ? '❓ Questions' : '⬜ Split'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Progress ── */}
      <View style={s.progressBar}>
        <Text style={s.progressText}>
          {answeredCount} / {QUESTIONS.length} questions answered
        </Text>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${(answeredCount / QUESTIONS.length) * 100}%` as any }]} />
        </View>
      </View>

      {/* ── Main content ── */}
      {activePassage > 0 ? (
        <View style={s.lockedPassage}>
          <Text style={s.lockedIcon}>🔒</Text>
          <Text style={s.lockedTitle}>Passage {activePassage + 1} is locked</Text>
          <Text style={s.lockedSub}>Upgrade to Pro to unlock all three passages.</Text>
        </View>
      ) : view === 'passage' ? (
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          <PassageContent />
          <View style={{ height: 32 }} />
        </ScrollView>
      ) : view === 'questions' ? (
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          <QuestionsContent />
          <View style={{ height: 100 }} />
        </ScrollView>
      ) : (
        /* Split view */
        <ScrollView style={s.scrollArea} showsVerticalScrollIndicator={false}>
          {/* Passage condensed */}
          <View style={s.splitPassageWrap}>
            <ScrollView
              style={s.splitPassageScroll}
              showsVerticalScrollIndicator
              nestedScrollEnabled
            >
              <PassageContent />
            </ScrollView>
          </View>
          <View style={s.splitDivider}>
            <Text style={s.splitDividerText}>▼  Questions</Text>
          </View>
          <QuestionsContent />
          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* ── Submit button ── */}
      <View style={s.submitWrap}>
        <TouchableOpacity
          style={[s.submitBtn, !allAnswered && s.submitBtnDisabled]}
          onPress={() => doSubmit(answers)}
          disabled={!allAnswered || submitting}
          activeOpacity={0.85}
        >
          <Text style={s.submitBtnText}>
            {submitting
              ? 'Submitting…'
              : allAnswered
                ? 'Submit Answers →'
                : `Answer all questions (${answeredCount}/${QUESTIONS.length})`}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backBtn: {
    width: 32, height: 32,
    borderRadius: 10,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 17, color: Colors.ink },
  headerCenter: { flex: 1 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  timerBadge: {
    paddingHorizontal: 10, paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1, borderColor: Colors.border,
  },
  timerBadgeWarn: { backgroundColor: '#FFF3ED', borderColor: Colors.orange },
  timerText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  timerTextWarn: { color: Colors.orange },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: 14,
    gap: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.p },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  tabTextActive: { color: Colors.p, fontFamily: 'Inter_600SemiBold' },
  lockBadge: { marginLeft: 2 },
  lockIcon: { fontSize: 10 },

  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.bg2,
    margin: 12,
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleBtnActive: { backgroundColor: Colors.white, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  toggleText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },
  toggleTextActive: { color: Colors.ink, fontFamily: 'Inter_600SemiBold' },

  progressBar: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    gap: 5,
  },
  progressText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.bg2,
    borderRadius: 99,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: Colors.p, borderRadius: 99 },

  scrollArea: { flex: 1 },

  lockedPassage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 40,
  },
  lockedIcon: { fontSize: 40 },
  lockedTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink, textAlign: 'center' },
  lockedSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center' },

  splitPassageWrap: {
    height: 300,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  splitPassageScroll: { flex: 1 },
  splitDivider: {
    backgroundColor: Colors.bg2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  splitDividerText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },

  submitWrap: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  submitBtn: {
    backgroundColor: Colors.p,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitBtnDisabled: { backgroundColor: Colors.ink4 },
  submitBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.white },
});
