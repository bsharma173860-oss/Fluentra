import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/colors';
import { BreakScreen, type ModuleScore, type ModuleKey } from '@/components/exam/BreakScreen';
import { setExamResult } from '@/lib/examStore';
import {
  HeadphoneIcon, BookIcon, PenIcon, MicIcon, CheckIcon, type IconProps,
} from '@/components/icons';

// ─────────────────────────────────────────────────────────────────
// State machine types
// ─────────────────────────────────────────────────────────────────
type ExamPhase =
  | 'listening'           | 'break_after_listening'
  | 'reading'             | 'break_after_reading'
  | 'writing'             | 'break_after_writing'
  | 'speaking'            | 'results';

// ─────────────────────────────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────────────────────────────
const LISTEN_QUESTIONS = [
  { id: 1, pre: 'The conference will be held on', suf: 'at the Grand Hall.' },
  { id: 2, pre: 'Participants should register by', suf: 'to secure a spot.' },
  { id: 3, pre: 'The keynote speaker is', suf: ', a leading economist.' },
];

const READ_PASSAGE = `The concept of sustainable development has evolved significantly since its introduction in the 1987 Brundtland Report. Originally defined as "development that meets the needs of the present without compromising the ability of future generations to meet their own needs," the term has expanded to encompass economic, social, and environmental dimensions.

Modern interpretations emphasise the interdependence of these three pillars. Economic growth cannot be sustained without environmental protection, and social equity is impossible without economic stability. This tripartite model has influenced frameworks including the UN's Sustainable Development Goals, adopted in 2015.`;

const READ_MCQ = [
  {
    id: 1,
    q: 'In which year was the Brundtland Report published?',
    opts: ['1985', '1987', '1990', '2015'],
    correct: 1,
  },
  {
    id: 2,
    q: 'According to the passage, sustainable development was originally about:',
    opts: [
      'Economic growth only',
      'Environmental protection only',
      'Meeting present needs without harming future generations',
      'Social equity',
    ],
    correct: 2,
  },
  {
    id: 3,
    q: 'The "tripartite model" refers to:',
    opts: [
      'Three international treaties',
      'Three pillars: economic, social, environmental',
      'Three UN agencies',
      'Three development phases',
    ],
    correct: 1,
  },
];

const WRITE_PROMPT =
  'The graph below shows the percentage of households in different income brackets that own at least one car in the UK between 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.';

const SPEAK_CARD = `Describe a time when you helped someone.

• who you helped
• what the situation was
• how you helped them

Explain why you decided to help.`;

// ─────────────────────────────────────────────────────────────────
// Header strip shared by all modules
// ─────────────────────────────────────────────────────────────────
type IC = React.ComponentType<IconProps>;

function ModuleHeader({
  Icon, label, color, step, total,
}: {
  Icon: IC; label: string; color: string; step: number; total: number;
}) {
  return (
    <View style={mh.wrap}>
      <View style={[mh.iconWrap, { backgroundColor: color + '22' }]}>
        <Icon size={20} color={color} />
      </View>
      <View style={mh.text}>
        <Text style={[mh.label, { color }]}>{label}</Text>
        <Text style={mh.step}>Module {step} of {total}</Text>
      </View>
      <View style={mh.dots}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[mh.dot, i < step ? { backgroundColor: color } : { backgroundColor: Colors.bg2 }]}
          />
        ))}
      </View>
    </View>
  );
}
const mh = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  icon: { /* replaced by icon component */ },
  text: { flex: 1 },
  label: { fontFamily: 'Inter_700Bold', fontSize: 16 },
  step: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 1 },
  dots: { flexDirection: 'row', gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

// ─────────────────────────────────────────────────────────────────
// LISTENING MODULE
// ─────────────────────────────────────────────────────────────────
function ListeningModule({ onSubmit }: { onSubmit: (s: ModuleScore) => void }) {
  const [answers, setAnswers] = useState<string[]>(['', '', '']);
  const allAnswered = answers.every(a => a.trim().length > 0);
  const score = allAnswered ? 32 : 0; // mock

  return (
    <SafeAreaView style={mod.safe} edges={['bottom']}>
      <ModuleHeader Icon={HeadphoneIcon} label="Listening" color={Colors.green} step={1} total={4} />

      {/* Mock audio player */}
      <View style={mod.playerBar}>
        <View style={[mod.playBtn, { backgroundColor: Colors.green }]}>
          <Text style={mod.playBtnText}>▶</Text>
        </View>
        <View style={mod.waveWrap}>
          {Array.from({ length: 18 }).map((_, i) => (
            <View
              key={i}
              style={[mod.waveBar, {
                height: 8 + Math.abs(Math.sin(i * 0.7)) * 20,
                backgroundColor: i < 10 ? Colors.green : Colors.border,
              }]}
            />
          ))}
        </View>
        <Text style={mod.playerTime}>02:14</Text>
      </View>

      <ScrollView contentContainerStyle={mod.content}>
        <Text style={mod.sectionTitle}>Section 1 · Questions 1–3</Text>
        <Text style={mod.instruction}>
          Complete the sentences below. Write NO MORE THAN TWO WORDS for each answer.
        </Text>

        {LISTEN_QUESTIONS.map((q, i) => (
          <View key={q.id} style={mod.fillRow}>
            <Text style={mod.qNum}>{q.id}</Text>
            <View style={mod.fillInner}>
              <Text style={mod.fillPre}>{q.pre}</Text>
              <TextInput
                style={mod.fillInput}
                value={answers[i]}
                onChangeText={v => {
                  const next = [...answers];
                  next[i] = v;
                  setAnswers(next);
                }}
                placeholder="..."
                placeholderTextColor={Colors.ink4}
              />
              <Text style={mod.fillSuf}>{q.suf}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={mod.footer}>
        <TouchableOpacity
          style={[mod.submitBtn, !allAnswered && mod.submitBtnDisabled]}
          disabled={!allAnswered}
          onPress={() => onSubmit({ module: 'listening', score, maxScore: 40 })}
          activeOpacity={0.88}
        >
          <Text style={mod.submitBtnText}>
            {allAnswered ? 'Submit Listening →' : `Fill all blanks (${answers.filter(a => a.trim()).length}/3)`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// READING MODULE
// ─────────────────────────────────────────────────────────────────
function ReadingModule({ onSubmit }: { onSubmit: (s: ModuleScore) => void }) {
  const [selected, setSelected] = useState<(number | null)[]>([null, null, null]);
  const [view, setView] = useState<'passage' | 'questions'>('passage');
  const allAnswered = selected.every(s => s !== null);
  const score = selected.filter((s, i) => s === READ_MCQ[i].correct).length;

  return (
    <SafeAreaView style={mod.safe} edges={['bottom']}>
      <ModuleHeader Icon={BookIcon} label="Reading" color={Colors.orange} step={2} total={4} />

      {/* View toggle */}
      <View style={mod.viewToggle}>
        <TouchableOpacity
          style={[mod.toggleBtn, view === 'passage' && mod.toggleBtnActive]}
          onPress={() => setView('passage')}
        >
          <Text style={[mod.toggleBtnText, view === 'passage' && mod.toggleBtnTextActive]}>Passage</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[mod.toggleBtn, view === 'questions' && mod.toggleBtnActive]}
          onPress={() => setView('questions')}
        >
          <Text style={[mod.toggleBtnText, view === 'questions' && mod.toggleBtnTextActive]}>
            Questions ({selected.filter(s => s !== null).length}/3)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={mod.content} key={view}>
        {view === 'passage' ? (
          <>
            <Text style={mod.passageTitle}>Sustainable Development</Text>
            <Text style={mod.passageBody}>{READ_PASSAGE}</Text>
            <TouchableOpacity style={mod.switchBtn} onPress={() => setView('questions')}>
              <Text style={mod.switchBtnText}>Answer questions →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={mod.sectionTitle}>Questions 1–3 · Multiple choice</Text>
            {READ_MCQ.map((q, qi) => (
              <View key={q.id} style={mod.mcqBlock}>
                <Text style={mod.mcqQ}>{q.id}. {q.q}</Text>
                {q.opts.map((opt, oi) => (
                  <TouchableOpacity
                    key={oi}
                    style={[
                      mod.mcqOpt,
                      selected[qi] === oi && { backgroundColor: Colors.orange_bg, borderColor: Colors.orange },
                    ]}
                    onPress={() => {
                      const next = [...selected];
                      next[qi] = oi;
                      setSelected(next);
                    }}
                  >
                    <View style={[
                      mod.radio,
                      selected[qi] === oi && { backgroundColor: Colors.orange, borderColor: Colors.orange },
                    ]} />
                    <Text style={mod.mcqOptText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={mod.footer}>
        <TouchableOpacity
          style={[mod.submitBtn, { backgroundColor: Colors.orange }, !allAnswered && mod.submitBtnDisabled]}
          disabled={!allAnswered}
          onPress={() => onSubmit({ module: 'reading', score: score + 8, maxScore: 13 })}
          activeOpacity={0.88}
        >
          <Text style={mod.submitBtnText}>
            {allAnswered ? 'Submit Reading →' : `Answer all questions (${selected.filter(s => s !== null).length}/3)`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// WRITING MODULE
// ─────────────────────────────────────────────────────────────────
function WritingModule({ onSubmit }: { onSubmit: (s: ModuleScore) => void }) {
  const [text, setText] = useState('');
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const isReady = wordCount >= 150;
  const wcColor = isReady ? Colors.green : wordCount >= 100 ? Colors.gold : Colors.ink3;

  return (
    <SafeAreaView style={mod.safe} edges={['bottom']}>
      <ModuleHeader Icon={PenIcon} label="Writing" color={Colors.gold} step={3} total={4} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView contentContainerStyle={mod.content}>
          <View style={mod.promptCard}>
            <Text style={mod.promptLabel}>Task 1</Text>
            <Text style={mod.promptText}>{WRITE_PROMPT}</Text>
          </View>

          <View style={mod.writeArea}>
            <TextInput
              style={mod.writeInput}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="Start writing your response here…"
              placeholderTextColor={Colors.ink4}
              textAlignVertical="top"
            />
            <View style={mod.wcRow}>
              <Text style={[mod.wcNum, { color: wcColor }]}>{wordCount}</Text>
              <Text style={mod.wcLabel}> / 150+ words</Text>
              {isReady && <CheckIcon size={14} color={Colors.green} />}
            </View>
          </View>
        </ScrollView>

        <View style={mod.footer}>
          <TouchableOpacity
            style={[mod.submitBtn, { backgroundColor: Colors.gold }, !isReady && mod.submitBtnDisabled]}
            disabled={!isReady}
            onPress={() => onSubmit({ module: 'writing', score: 7, maxScore: 9 })}
            activeOpacity={0.88}
          >
            <Text style={mod.submitBtnText}>
              {isReady ? 'Submit Writing →' : `${wordCount}/150 words`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────
// SPEAKING MODULE
// ─────────────────────────────────────────────────────────────────
type SpeakPhase = 'prep' | 'recording' | 'done';

function SpeakingModule({ onSubmit }: { onSubmit: (s: ModuleScore) => void }) {
  const [phase, setPhase] = useState<SpeakPhase>('prep');
  const [prepLeft, setPrepLeft] = useState(60);
  const [recordSecs, setRecordSecs] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === 'prep') {
      intervalRef.current = setInterval(() => {
        setPrepLeft(p => {
          if (p <= 1) {
            clearInterval(intervalRef.current!);
            setPhase('recording');
            return 0;
          }
          return p - 1;
        });
      }, 1000);
    }
    if (phase === 'recording') {
      intervalRef.current = setInterval(() => {
        setRecordSecs(s => {
          if (s >= 120) {
            clearInterval(intervalRef.current!);
            setPhase('done');
            return 120;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  function fmt(sec: number) {
    return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;
  }

  return (
    <SafeAreaView style={mod.safe} edges={['bottom']}>
      <ModuleHeader Icon={MicIcon} label="Speaking" color={Colors.p} step={4} total={4} />
      <ScrollView contentContainerStyle={[mod.content, { alignItems: 'center' }]}>

        {/* Topic card */}
        <View style={sp.card}>
          <Text style={sp.cardLabel}>Part 2 · Long Turn</Text>
          <Text style={sp.cardBody}>{SPEAK_CARD}</Text>
        </View>

        {/* Phase display */}
        {phase === 'prep' && (
          <View style={sp.phaseWrap}>
            <Text style={sp.phaseLabel}>Preparation time</Text>
            <Text style={sp.phaseTimer}>{fmt(prepLeft)}</Text>
            <Text style={sp.phaseHint}>Notes are allowed · Speaking starts automatically</Text>
          </View>
        )}

        {phase === 'recording' && (
          <View style={sp.phaseWrap}>
            <View style={sp.micRing}>
              <View style={sp.micInner}>
                <MicIcon size={28} color={Colors.white} />
              </View>
            </View>
            <Text style={[sp.phaseTimer, { color: Colors.danger }]}>{fmt(recordSecs)}</Text>
            <Text style={sp.phaseHint}>Recording · Speak clearly</Text>
            <TouchableOpacity
              style={sp.stopBtn}
              onPress={() => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setPhase('done');
              }}
            >
              <Text style={sp.stopBtnText}>■ Stop Recording</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'done' && (
          <View style={sp.phaseWrap}>
            <CheckIcon size={40} color={Colors.green} />
            <Text style={sp.doneLabel}>Recording complete</Text>
            <Text style={sp.doneTime}>{fmt(recordSecs)} recorded</Text>
          </View>
        )}
      </ScrollView>

      <View style={mod.footer}>
        <TouchableOpacity
          style={[
            mod.submitBtn, { backgroundColor: Colors.p },
            phase !== 'done' && mod.submitBtnDisabled,
          ]}
          disabled={phase !== 'done'}
          onPress={() => onSubmit({ module: 'speaking', score: 7, maxScore: 9 })}
          activeOpacity={0.88}
        >
          <Text style={mod.submitBtnText}>
            {phase === 'done' ? 'Submit & See Results →' : 'Complete speaking to continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const sp = StyleSheet.create({
  card: {
    width: '100%', backgroundColor: Colors.p_soft,
    borderRadius: 18, padding: 20, gap: 10,
    borderWidth: 1, borderColor: Colors.p + '44',
  },
  cardLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.p, letterSpacing: 0.5 },
  cardBody: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.ink, lineHeight: 24 },
  phaseWrap: { alignItems: 'center', gap: 10, marginTop: 24 },
  phaseLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink2 },
  phaseTimer: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 56,
    color: Colors.ink, lineHeight: 64,
  },
  phaseHint: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, textAlign: 'center' },
  micRing: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.danger + '22',
    alignItems: 'center', justifyContent: 'center',
  },
  micInner: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: Colors.danger + '33',
    alignItems: 'center', justifyContent: 'center',
  },
  stopBtn: {
    marginTop: 8, paddingHorizontal: 24, paddingVertical: 10,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.danger,
  },
  stopBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.danger },
  doneLabel: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.green },
  doneTime: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
});

// ─────────────────────────────────────────────────────────────────
// SHARED MODULE STYLES
// ─────────────────────────────────────────────────────────────────
const mod = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 16 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  instruction: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, lineHeight: 20 },

  // Audio player
  playerBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: Colors.green_bg,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  playBtn: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  playBtnText: { fontSize: 14, color: Colors.white },
  waveWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 2, height: 32 },
  waveBar: { width: 3, borderRadius: 2 },
  playerTime: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.green },

  // Fill-in-blank
  fillRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  qNum: {
    fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.green,
    width: 20, marginTop: 10,
  },
  fillInner: { flex: 1, gap: 4 },
  fillPre: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2 },
  fillInput: {
    borderWidth: 1, borderColor: Colors.p,
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7,
    fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink,
    backgroundColor: Colors.white,
  },
  fillSuf: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2 },

  // View toggle
  viewToggle: {
    flexDirection: 'row', backgroundColor: Colors.bg2,
    borderRadius: 10, padding: 3, margin: 16, gap: 3,
  },
  toggleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: Colors.white },
  toggleBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink3 },
  toggleBtnTextActive: { fontFamily: 'Inter_700Bold', color: Colors.ink },

  // Passage
  passageTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  passageBody: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2, lineHeight: 22 },
  switchBtn: {
    backgroundColor: Colors.orange,
    borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 8,
  },
  switchBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },

  // MCQ
  mcqBlock: { gap: 8 },
  mcqQ: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  mcqOpt: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 12, borderRadius: 12,
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border,
  },
  radio: {
    width: 18, height: 18, borderRadius: 9,
    borderWidth: 2, borderColor: Colors.border,
  },
  mcqOptText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, flex: 1 },

  // Writing
  promptCard: {
    backgroundColor: Colors.gold_bg, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.gold + '44', padding: 16, gap: 6,
  },
  promptLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.gold, letterSpacing: 0.5 },
  promptText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink, lineHeight: 21 },
  writeArea: {
    backgroundColor: Colors.white, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden',
  },
  writeInput: {
    fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.ink,
    padding: 16, minHeight: 220,
  },
  wcRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  wcNum: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  wcLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },

  // Submit footer
  footer: {
    padding: 16, borderTopWidth: 1, borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  submitBtn: {
    backgroundColor: Colors.p, borderRadius: 14,
    paddingVertical: 15, alignItems: 'center',
  },
  submitBtnDisabled: { opacity: 0.45 },
  submitBtnText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
});

// ─────────────────────────────────────────────────────────────────
// MAIN FULL EXAM SCREEN
// ─────────────────────────────────────────────────────────────────
export default function FullExam() {
  const { code, exam } = useLocalSearchParams<{ code: string; exam: string }>();
  const [phase, setPhase] = useState<ExamPhase>('listening');
  const [scores, setScores] = useState<Partial<Record<ModuleKey, ModuleScore>>>({});

  function handleModuleSubmit(module: ModuleKey, score: ModuleScore) {
    const updated = { ...scores, [module]: score };
    setScores(updated);

    switch (module) {
      case 'listening': setPhase('break_after_listening'); break;
      case 'reading':   setPhase('break_after_reading');   break;
      case 'writing':   setPhase('break_after_writing');   break;
      case 'speaking': {
        // All modules done — persist result and navigate to results
        const finalScores = {
          listening: updated.listening?.score ?? 32,
          reading:   updated.reading?.score   ?? 11,
          writing:   updated.writing?.score   ?? 7,
          speaking:  score.score,
        };
        const finalMax = {
          listening: updated.listening?.maxScore ?? 40,
          reading:   updated.reading?.maxScore   ?? 13,
          writing:   updated.writing?.maxScore   ?? 9,
          speaking:  score.maxScore,
        };
        setExamResult({
          languageCode: code ?? 'en',
          examId: exam ?? 'ielts',
          scores: finalScores,
          maxScores: finalMax,
          completedAt: new Date().toISOString(),
        });
        router.replace(`/language/${code}/${exam}/exam-results` as any);
        break;
      }
    }
  }

  // ── Break screens ──
  if (phase === 'break_after_listening') {
    return (
      <BreakScreen
        justCompleted={scores.listening!}
        nextModule="reading"
        onComplete={() => setPhase('reading')}
      />
    );
  }
  if (phase === 'break_after_reading') {
    return (
      <BreakScreen
        justCompleted={scores.reading!}
        nextModule="writing"
        onComplete={() => setPhase('writing')}
      />
    );
  }
  if (phase === 'break_after_writing') {
    return (
      <BreakScreen
        justCompleted={scores.writing!}
        nextModule="speaking"
        onComplete={() => setPhase('speaking')}
      />
    );
  }

  // ── Module screens ──
  switch (phase) {
    case 'listening':
      return <ListeningModule onSubmit={s => handleModuleSubmit('listening', s)} />;
    case 'reading':
      return <ReadingModule onSubmit={s => handleModuleSubmit('reading', s)} />;
    case 'writing':
      return <WritingModule onSubmit={s => handleModuleSubmit('writing', s)} />;
    case 'speaking':
      return <SpeakingModule onSubmit={s => handleModuleSubmit('speaking', s)} />;
    default:
      return null;
  }
}
