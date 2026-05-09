// @ts-nocheck
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

const C = {
  brand:      '#C04A06',
  brandLight: '#FEF3EE',
  ink:        '#0A0A0A',
  ink2:       '#333',
  ink3:       '#666',
  ink4:       '#999',
  ink5:       '#BBB',
  bg:         '#F9F8F5',
  bg2:        '#F4F1EB',
  card:       '#FFFFFF',
  border:     '#E8E2D9',
  hairline:   '#EDE8E0',
  serif:      'DMSerifDisplay_400Regular',
  reading:    '#C04A06',
  listening:  '#1A8F4E',
  speaking:   '#5B4FE2',
  writing:    '#A65A00',
};

const STEPS = ['Welcome', 'Language', 'Goal', 'Why', 'Level', 'Placement', 'Schedule', 'Your plan'];

const LANGS = [
  { code: 'es', flag: '🇪🇸', label: 'Spanish',    sub: '+82M learners worldwide' },
  { code: 'fr', flag: '🇫🇷', label: 'French',     sub: '+58M learners' },
  { code: 'de', flag: '🇩🇪', label: 'German',     sub: '+46M learners' },
  { code: 'ja', flag: '🇯🇵', label: 'Japanese',   sub: '+34M learners' },
  { code: 'it', flag: '🇮🇹', label: 'Italian',    sub: '+22M learners' },
  { code: 'pt', flag: '🇵🇹', label: 'Portuguese', sub: '+18M learners' },
  { code: 'ko', flag: '🇰🇷', label: 'Korean',     sub: '+15M learners' },
  { code: 'zh', flag: '🇨🇳', label: 'Mandarin',   sub: 'Most spoken language' },
];

const GOALS = [
  { id: 'travel',  label: 'Travel & culture',       sub: 'Order food, ask directions, make friends abroad', icon: '🗺️' },
  { id: 'work',    label: 'Work & career',           sub: 'Meetings, emails, professional fluency', icon: '💼' },
  { id: 'exam',    label: 'Exam preparation',        sub: 'IELTS, TOEFL, DELF, JLPT and more', icon: '🎓' },
  { id: 'family',  label: 'Family & relationships',  sub: 'Talk to a partner, kids, or in-laws', icon: '❤️' },
  { id: 'media',   label: 'Movies, books, music',    sub: 'Watch and read in the original language', icon: '🎬' },
  { id: 'brain',   label: 'Brain training',          sub: 'Just for fun and mental sharpness', icon: '🧠' },
];

const REASONS = [
  'I want to think and dream in another language',
  'It feels like a personal achievement',
  'I want my kids to grow up bilingual',
  "I'm moving to a new country",
  'It opens up career opportunities',
  'I love learning new skills',
];

const LEVELS = [
  { id: 'A0', label: 'Total beginner',      sub: 'I know a few words at most',              hours: '0–20 hr',    color: C.reading },
  { id: 'A1', label: 'Beginner',            sub: 'Hello, thank you, simple sentences',      hours: '20–60 hr',   color: C.reading },
  { id: 'A2', label: 'Elementary',          sub: 'I can survive a basic conversation',      hours: '60–150 hr',  color: C.listening },
  { id: 'B1', label: 'Intermediate',        sub: 'I can discuss familiar topics',           hours: '150–300 hr', color: C.listening },
  { id: 'B2', label: 'Upper-intermediate',  sub: 'I follow most conversations',             hours: '300–500 hr', color: C.speaking },
  { id: 'C1', label: 'Advanced',            sub: 'I express myself fluently and precisely', hours: '500+ hr',    color: C.writing },
];

const PLACEMENT = [
  { q: 'Choose the correct article: __ manzana es roja.', opts: ['El', 'La', 'Los', 'Las'], a: 1 },
  { q: '"Yo ___ a la tienda ayer."', opts: ['voy', 'iba', 'fui', 'iré'], a: 2 },
  { q: 'Which means "I had eaten"?', opts: ['Comí', 'Había comido', 'He comido', 'Comería'], a: 1 },
  { q: 'Best translation: "Should you need anything…"', opts: ['Si necesitas algo', 'Si necesitaras algo', 'Si necesitaría algo', 'Necesites algo'], a: 1 },
  { q: 'Pick the most natural register for a formal email opening.', opts: ['¡Hola!', 'Estimado/a', 'Qué tal', 'Saludos cordiales'], a: 1 },
];

const SCHEDULES = [
  { id: 'casual',  label: 'Casual',  minutes: 5,  sub: '5 min/day · ~1 hr per week',   tag: 'Most flexible' },
  { id: 'regular', label: 'Regular', minutes: 15, sub: '15 min/day · ~2 hr per week',  tag: 'Most popular' },
  { id: 'serious', label: 'Serious', minutes: 30, sub: '30 min/day · ~4 hr per week',  tag: 'Best results' },
  { id: 'intense', label: 'Intense', minutes: 60, sub: '60 min/day · ~7 hr per week',  tag: 'Exam-ready' },
];

// ── Progress dots ─────────────────────────────────────────────────────
function ProgressDots({ step, total }: { step: number; total: number }) {
  return (
    <View style={s.dotsRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[s.dot, i <= step && s.dotActive, i === step && s.dotCurrent]}
        />
      ))}
    </View>
  );
}

// ── Shell wrapper ─────────────────────────────────────────────────────
function Shell({
  step, eyebrow, title, sub, onBack, onNext, nextLabel = 'Continue',
  nextDisabled = false, footer, children,
}: any) {
  const { width } = useWindowDimensions();
  const wide = width >= 768 && Platform.OS === 'web';

  return (
    <SafeAreaView style={s.safe}>
      {/* Top bar */}
      <View style={s.topBar}>
        <View style={s.logoRow}>
          <View style={s.logoBadge}><Text style={s.logoText}>F</Text></View>
          <Text style={s.logoName}>Fluentra</Text>
        </View>
        <View style={s.dotsWrap}>
          <ProgressDots step={step} total={STEPS.length} />
        </View>
        <Text style={s.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={[s.body, wide && s.bodyWide]}
        showsVerticalScrollIndicator={false}
      >
        {eyebrow ? <Text style={s.eyebrow}>{eyebrow}</Text> : null}
        <Text style={s.title}>{title}</Text>
        {sub ? <Text style={s.sub}>{sub}</Text> : null}
        {children}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Footer */}
      <View style={s.footer}>
        <TouchableOpacity
          onPress={onBack}
          disabled={!onBack}
          style={s.backBtn}
          activeOpacity={0.7}
        >
          <Text style={[s.backText, !onBack && s.backTextDisabled]}>← Back</Text>
        </TouchableOpacity>
        <View style={s.footerRight}>
          {footer}
          <TouchableOpacity
            onPress={onNext}
            disabled={nextDisabled}
            style={[s.nextBtn, nextDisabled && s.nextBtnDisabled]}
            activeOpacity={0.85}
          >
            <Text style={s.nextBtnText}>{nextLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ── Step 0: Welcome ───────────────────────────────────────────────────
function SWelcome({ onNext }: any) {
  return (
    <Shell step={0} eyebrow="Welcome to Fluentra"
      title="Let's design a learning plan that actually fits your life."
      sub="Six quick questions and a 90-second placement check. We'll use your answers to build a personalised study plan."
      onNext={onNext} nextLabel="Get started →">
      <View style={s.cardRow}>
        {[
          { k: '01', t: 'Tell us your goal',    d: 'Travel, work, exam, family — different goals, different plans.' },
          { k: '02', t: 'Take a quick check',   d: '5 questions to find your level. Skip if you already know.' },
          { k: '03', t: 'Get your plan',        d: 'Daily lessons calibrated to your time and target.' },
        ].map(item => (
          <View key={item.k} style={s.welcomeCard}>
            <Text style={s.welcomeNum}>{item.k}</Text>
            <Text style={s.welcomeCardTitle}>{item.t}</Text>
            <Text style={s.welcomeCardDesc}>{item.d}</Text>
          </View>
        ))}
      </View>
      <View style={s.infoBanner}>
        <View style={s.infoBannerIcon}><Text style={s.infoBannerIconText}>✦</Text></View>
        <Text style={s.infoBannerText}>
          <Text style={{ fontFamily: 'Inter_700Bold', color: C.ink }}>Average setup time:</Text> 4 minutes. You can adjust everything later in Settings.
        </Text>
      </View>
    </Shell>
  );
}

// ── Step 1: Language ──────────────────────────────────────────────────
function SLanguage({ value, onChange, onNext, onBack }: any) {
  return (
    <Shell step={1} eyebrow="Pick a language"
      title="What language do you want to learn?"
      sub="You can always add more later — many of our users learn 2 or 3 simultaneously."
      onBack={onBack} onNext={onNext} nextDisabled={!value}>
      <View style={s.langGrid}>
        {LANGS.map(l => {
          const sel = value === l.code;
          return (
            <TouchableOpacity
              key={l.code}
              style={[s.langCard, sel && s.langCardSel]}
              onPress={() => onChange(l.code)}
              activeOpacity={0.7}
            >
              <Text style={s.langFlag}>{l.flag}</Text>
              <Text style={[s.langName, sel && { color: C.brand }]}>{l.label}</Text>
              <Text style={s.langSub}>{l.sub}</Text>
              {sel && (
                <View style={s.selCheck}><Text style={s.selCheckText}>✓</Text></View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Shell>
  );
}

// ── Step 2: Goal ──────────────────────────────────────────────────────
function SGoal({ value, onChange, onNext, onBack }: any) {
  return (
    <Shell step={2} eyebrow="Your goal"
      title="Why are you learning?"
      sub="The more honest you are, the better we can tune your daily lessons."
      onBack={onBack} onNext={onNext} nextDisabled={!value}>
      <View style={s.goalGrid}>
        {GOALS.map(g => {
          const sel = value === g.id;
          return (
            <TouchableOpacity
              key={g.id}
              style={[s.goalCard, sel && s.goalCardSel]}
              onPress={() => onChange(g.id)}
              activeOpacity={0.7}
            >
              <View style={s.goalIcon}><Text style={s.goalIconText}>{g.icon}</Text></View>
              <View style={s.goalBody}>
                <Text style={[s.goalLabel, sel && { color: C.brand }]}>{g.label}</Text>
                <Text style={s.goalSub}>{g.sub}</Text>
              </View>
              <View style={[s.radioCircle, sel && s.radioCircleSel]}>
                {sel && <Text style={s.radioCheck}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Shell>
  );
}

// ── Step 3: Reasons ───────────────────────────────────────────────────
function SReason({ values, onToggle, onNext, onBack }: any) {
  return (
    <Shell step={3} eyebrow="Motivation"
      title="What keeps you going?"
      sub="Select up to 3. We'll surface these on hard days when you need a nudge."
      onBack={onBack} onNext={onNext} nextDisabled={values.length === 0}>
      <View style={s.reasonList}>
        {REASONS.map(r => {
          const sel = values.includes(r);
          const disabled = !sel && values.length >= 3;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => !disabled && onToggle(r)}
              style={[s.reasonCard, sel && s.reasonCardSel, disabled && s.reasonCardDisabled]}
              activeOpacity={disabled ? 1 : 0.7}
            >
              <View style={[s.reasonCheck, sel && s.reasonCheckSel]}>
                {sel && <Text style={s.reasonCheckText}>✓</Text>}
              </View>
              <Text style={[s.reasonText, sel && { fontFamily: 'Inter_600SemiBold', color: C.ink }]}>{r}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={s.selectedCount}>{values.length} of 3 selected</Text>
    </Shell>
  );
}

// ── Step 4: Level ─────────────────────────────────────────────────────
function SLevel({ value, onChange, onNext, onBack, onSkipPlacement }: any) {
  return (
    <Shell step={4} eyebrow="Current level"
      title="Where are you now?"
      sub="Pick honestly — this is the floor for your daily lessons, not a judgement."
      onBack={onBack} onNext={onNext} nextDisabled={!value}
      footer={
        value ? (
          <TouchableOpacity onPress={onSkipPlacement}>
            <Text style={s.skipLink}>Skip placement test</Text>
          </TouchableOpacity>
        ) : null
      }>
      <View style={s.levelGrid}>
        {LEVELS.map(l => {
          const sel = value === l.id;
          return (
            <TouchableOpacity
              key={l.id}
              style={[s.levelCard, sel && { borderColor: l.color, backgroundColor: l.color + '10' }]}
              onPress={() => onChange(l.id)}
              activeOpacity={0.7}
            >
              <View style={[s.levelBadge, { backgroundColor: sel ? l.color : C.bg2 }]}>
                <Text style={[s.levelBadgeText, { color: sel ? '#fff' : l.color }]}>{l.id}</Text>
              </View>
              <View style={s.levelBody}>
                <Text style={s.levelLabel}>{l.label}</Text>
                <Text style={s.levelSub}>{l.sub}</Text>
                <Text style={[s.levelHours, { color: l.color }]}>{l.hours}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Shell>
  );
}

// ── Step 5: Placement ─────────────────────────────────────────────────
function SPlacement({ qIdx, answers, onAnswer, onNext, onBack, onSkip }: any) {
  const q = PLACEMENT[qIdx];
  const ans = answers[qIdx];
  const allDone = answers.length === PLACEMENT.length && answers.every((a: any) => a !== undefined);

  return (
    <Shell step={5}
      eyebrow={`Placement check · ${qIdx + 1} of ${PLACEMENT.length}`}
      title="Quick level check"
      sub="No grades, no judgement. Just enough signal to calibrate your starting lessons."
      onBack={onBack} onNext={onNext} nextDisabled={!allDone}
      nextLabel={allDone ? 'See results →' : 'Continue'}
      footer={
        <TouchableOpacity onPress={onSkip}>
          <Text style={s.skipLink}>Skip the check</Text>
        </TouchableOpacity>
      }>
      {/* Progress dots */}
      <View style={s.placementDots}>
        {PLACEMENT.map((_, i) => {
          const done = answers[i] !== undefined;
          const active = i === qIdx;
          return (
            <View
              key={i}
              style={[
                s.placementDot,
                active && s.placementDotActive,
                done && s.placementDotDone,
              ]}
            />
          );
        })}
      </View>

      <View style={s.questionCard}>
        <Text style={s.questionNum}>Question {qIdx + 1}</Text>
        <Text style={s.questionText}>{q.q}</Text>
        <View style={s.optionsList}>
          {q.opts.map((opt: string, i: number) => {
            const sel = ans === i;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => onAnswer(qIdx, i)}
                style={[s.optionBtn, sel && s.optionBtnSel]}
                activeOpacity={0.7}
              >
                <View style={[s.optionLabel, sel && s.optionLabelSel]}>
                  <Text style={[s.optionLabelText, sel && { color: '#fff' }]}>
                    {String.fromCharCode(65 + i)}
                  </Text>
                </View>
                <Text style={[s.optionText, sel && { color: C.ink, fontFamily: 'Inter_600SemiBold' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            onPress={() => onAnswer(qIdx, -1)}
            style={[s.optionBtn, s.optionBtnSkip, ans === -1 && s.optionBtnSkipSel]}
            activeOpacity={0.7}
          >
            <Text style={s.optionSkipText}>Not sure — skip this one</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nav between questions */}
      <View style={s.qNavRow}>
        <TouchableOpacity
          onPress={() => onAnswer(qIdx - 1, undefined)}
          disabled={qIdx === 0}
        >
          <Text style={[s.qNavBtn, qIdx === 0 && s.qNavBtnDisabled]}>← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onAnswer(qIdx, ans, qIdx + 1)}
          disabled={ans === undefined || qIdx === PLACEMENT.length - 1}
        >
          <Text style={[s.qNavBtn, s.qNavBtnNext, (ans === undefined || qIdx === PLACEMENT.length - 1) && s.qNavBtnDisabled]}>
            Next question →
          </Text>
        </TouchableOpacity>
      </View>
    </Shell>
  );
}

// ── Step 6: Schedule ──────────────────────────────────────────────────
function SSchedule({ value, onChange, reminderTime, onReminderChange, onNext, onBack }: any) {
  return (
    <Shell step={6} eyebrow="Daily commitment"
      title="How much time can you give it?"
      sub="Be realistic — consistency beats intensity. Most users start at 15 minutes."
      onBack={onBack} onNext={onNext} nextDisabled={!value}>
      <View style={s.scheduleList}>
        {SCHEDULES.map(sc => {
          const sel = value === sc.id;
          return (
            <TouchableOpacity
              key={sc.id}
              style={[s.scheduleCard, sel && s.scheduleCardSel]}
              onPress={() => onChange(sc.id)}
              activeOpacity={0.7}
            >
              <View style={[s.scheduleMin, sel && s.scheduleMinActive]}>
                <Text style={[s.scheduleMinNum, sel && { color: '#fff' }]}>{sc.minutes}</Text>
                <Text style={[s.scheduleMinLabel, sel && { color: 'rgba(255,255,255,.8)' }]}>MIN/DAY</Text>
              </View>
              <View style={s.scheduleBody}>
                <View style={s.scheduleTitleRow}>
                  <Text style={s.scheduleLabel}>{sc.label}</Text>
                  <View style={[s.scheduleTag, sc.id === 'regular' && s.scheduleTagBrand]}>
                    <Text style={[s.scheduleTagText, sc.id === 'regular' && { color: C.brand }]}>{sc.tag}</Text>
                  </View>
                </View>
                <Text style={s.scheduleSub}>{sc.sub}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {value && (
        <View style={s.reminderCard}>
          <Text style={s.reminderLabel}>DAILY REMINDER</Text>
          <Text style={s.reminderDesc}>We'll send one notification a day at this time.</Text>
          <View style={s.timeRow}>
            {['07:00', '08:30', '12:30', '18:00', '21:00'].map(t => (
              <TouchableOpacity
                key={t}
                style={[s.timeBtn, reminderTime === t && s.timeBtnActive]}
                onPress={() => onReminderChange(t)}
                activeOpacity={0.7}
              >
                <Text style={[s.timeBtnText, reminderTime === t && { color: C.brand, fontFamily: 'Inter_700Bold' }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </Shell>
  );
}

// ── Step 7: Plan ──────────────────────────────────────────────────────
function SPlan({ data, onFinish, onBack }: any) {
  const lang = LANGS.find(l => l.code === data.language) || LANGS[0];
  const goal = GOALS.find(g => g.id === data.goal) || GOALS[0];
  const sched = SCHEDULES.find(sc => sc.id === data.schedule) || SCHEDULES[1];

  const levelOrder = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];
  const curLevel = data.placedLevel || data.level || 'A1';
  const curIdx = levelOrder.indexOf(curLevel);
  const targetMap: Record<string, string> = { exam: 'C1', work: 'B2', travel: 'A2' };
  const targetLevel = targetMap[data.goal] || 'B1';
  const targetIdx = levelOrder.indexOf(targetLevel);
  const targetFinal = targetIdx > curIdx ? targetLevel : levelOrder[Math.min(curIdx + 2, 5)];
  const weeksToTarget = sched.id === 'casual' ? 60 : sched.id === 'regular' ? 28 : sched.id === 'serious' ? 16 : 10;

  const WEEK_DAYS = [
    { d: 'Mon', t: 'Greetings & introductions', m: 'Reading', c: C.reading, today: true },
    { d: 'Tue', t: 'Numbers & telling time', m: 'Listening', c: C.listening, today: false },
    { d: 'Wed', t: 'Café conversations', m: 'Speaking', c: C.speaking, today: false },
    { d: 'Thu', t: 'Asking for directions', m: 'Listening', c: C.listening, today: false },
    { d: 'Fri', t: 'Daily routine vocabulary', m: 'Reading', c: C.reading, today: false },
    { d: 'Sat', t: 'Mini-checkpoint', m: 'Mixed', c: C.ink4, today: false },
    { d: 'Sun', t: 'Rest day · review', m: 'Light', c: C.ink5, today: false },
  ];

  return (
    <Shell step={7} eyebrow="Your personalised plan"
      title={`Here's your plan for ${lang.label}.`}
      sub="Based on your answers, your level, and how active learners with similar goals progress."
      onBack={onBack} onNext={onFinish} nextLabel="Start my first lesson →">

      {/* Hero card */}
      <View style={sp.heroCard}>
        <View style={sp.heroBlobTop} />
        <View style={sp.heroBlobBottom} />
        <Text style={sp.heroEyebrow}>You're starting at</Text>
        <Text style={sp.heroLevel}>{curLevel}</Text>
        <Text style={sp.heroLevelLabel}>{LEVELS.find(l => l.id === curLevel)?.label}</Text>
        <View style={sp.heroProgressRow}>
          <View style={sp.heroProgressBg}>
            <View style={[sp.heroProgressFill, { width: `${((curIdx + 1) / levelOrder.length) * 100}%` as any }]} />
          </View>
          <Text style={sp.heroTargetLabel}>→ {targetFinal}</Text>
        </View>
        <Text style={sp.heroTimeEst}>~{weeksToTarget} weeks at {sched.minutes} min/day</Text>
      </View>

      {/* Goal + schedule */}
      <View style={sp.statsRow}>
        <View style={sp.statCard}>
          <Text style={sp.statLabel}>DAILY GOAL</Text>
          <View style={sp.statValueRow}>
            <Text style={sp.statBig}>{sched.minutes}</Text>
            <Text style={sp.statUnit}>min</Text>
          </View>
          <Text style={sp.statNote}>{sched.label} · {data.reminderTime || '08:30'}</Text>
        </View>
        <View style={sp.statCard}>
          <Text style={sp.statLabel}>YOUR GOAL</Text>
          <View style={sp.statValueRow}>
            <Text style={sp.statEmoji}>{goal.icon}</Text>
            <Text style={sp.statGoalName}>{goal.label}</Text>
          </View>
          <Text style={sp.statNote}>Lessons biased toward this domain.</Text>
        </View>
      </View>

      {/* Week 1 preview */}
      <View style={sp.weekCard}>
        <Text style={sp.weekTitle}>Your first week</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={sp.dayScroll}>
          {WEEK_DAYS.map((d, i) => (
            <View key={i} style={[sp.dayCell, d.today && sp.dayCellToday]}>
              {d.today && <View style={sp.todayBadge}><Text style={sp.todayBadgeText}>TODAY</Text></View>}
              <Text style={sp.dayCellDay}>{d.d}</Text>
              <Text style={sp.dayCellLesson}>{d.t}</Text>
              <View style={sp.dayModuleRow}>
                <View style={[sp.dayModuleDot, { backgroundColor: d.c }]} />
                <Text style={[sp.dayModuleText, { color: d.c }]}>{d.m}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Features */}
      <View style={sp.featuresCard}>
        <Text style={sp.featuresTitle}>BUILT INTO YOUR PLAN</Text>
        {[
          { ic: '✦', t: 'Adaptive difficulty', s: 'Lessons get harder as you improve.' },
          { ic: '❤', t: 'Spaced repetition', s: 'We bring back words you forget.' },
          { ic: '☁', t: 'Offline-ready', s: 'Continue learning on the train.' },
          { ic: '⚡', t: 'AI tutor', s: 'Ask questions any time, in plain English.' },
        ].map(f => (
          <View key={f.t} style={sp.featureRow}>
            <View style={sp.featureIcon}><Text style={sp.featureIconText}>{f.ic}</Text></View>
            <View style={sp.featureBody}>
              <Text style={sp.featureLabel}>{f.t}</Text>
              <Text style={sp.featureDesc}>{f.s}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Reasons recall */}
      {data.reasons && data.reasons.length > 0 && (
        <View style={sp.reasonsCard}>
          <Text style={sp.featuresTitle}>YOUR REASONS</Text>
          {data.reasons.slice(0, 3).map((r: string) => (
            <View key={r} style={sp.reasonItem}>
              <Text style={sp.reasonItemText}>"{r}"</Text>
            </View>
          ))}
          <View style={sp.reasonBanner}>
            <Text style={sp.reasonBannerText}>
              <Text style={{ fontFamily: 'Inter_700Bold', color: C.brand }}>We'll show these when you need them.</Text>
              {' '}Especially around day 5 — that's when motivation typically dips.
            </Text>
          </View>
        </View>
      )}
    </Shell>
  );
}

// ── Main onboarding page ──────────────────────────────────────────────
export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    language: '', goal: '', reasons: [] as string[], level: '',
    placement: [] as (number | undefined)[], placedLevel: null as string | null,
    schedule: 'regular', reminderTime: '08:30',
  });
  const [pIdx, setPIdx] = useState(0);

  const upd = (k: string, v: any) => setData(d => ({ ...d, [k]: v }));
  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(0, s - 1));

  const handlePlacementNext = () => {
    const correct = data.placement.reduce((acc: number, a: any, i: number) =>
      acc + (a === PLACEMENT[i].a ? 1 : 0), 0);
    const placedLevel = correct >= 5 ? 'C1' : correct >= 4 ? 'B2' : correct >= 3 ? 'B1' : correct >= 2 ? 'A2' : correct >= 1 ? 'A1' : 'A0';
    upd('placedLevel', placedLevel);
    next();
  };

  const onPAnswer = (idx: number, val: number | undefined, jumpTo?: number) => {
    setData(d => {
      const np = [...(d.placement || [])];
      while (np.length <= idx) np.push(undefined);
      np[idx] = val;
      return { ...d, placement: np };
    });
    if (jumpTo !== undefined && jumpTo >= 0 && jumpTo < PLACEMENT.length) {
      setPIdx(jumpTo);
    } else if (idx < PLACEMENT.length - 1 && val !== undefined) {
      setPIdx(idx + 1);
    }
  };

  const handleFinish = async () => {
    // Save onboarding data to Supabase profile
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({
          language: data.language,
          goal: data.goal,
          level: data.placedLevel || data.level,
          daily_goal_minutes: SCHEDULES.find(s => s.id === data.schedule)?.minutes || 15,
          onboarded: true,
        }).eq('id', user.id);
      }
    } catch (e) {
      // non-critical
    }
    router.replace('/(tabs)/home' as any);
  };

  switch (step) {
    case 0:
      return <SWelcome onNext={next} />;
    case 1:
      return <SLanguage value={data.language} onChange={(v: string) => upd('language', v)} onNext={next} onBack={back} />;
    case 2:
      return <SGoal value={data.goal} onChange={(v: string) => upd('goal', v)} onNext={next} onBack={back} />;
    case 3:
      return (
        <SReason
          values={data.reasons}
          onToggle={(r: string) => upd('reasons', data.reasons.includes(r) ? data.reasons.filter(x => x !== r) : [...data.reasons, r])}
          onNext={next} onBack={back}
        />
      );
    case 4:
      return (
        <SLevel value={data.level} onChange={(v: string) => upd('level', v)} onNext={next} onBack={back}
          onSkipPlacement={() => { upd('placedLevel', data.level); setStep(6); }} />
      );
    case 5:
      return (
        <SPlacement
          qIdx={pIdx}
          answers={data.placement}
          onAnswer={onPAnswer}
          onNext={handlePlacementNext}
          onBack={back}
          onSkip={() => { upd('placedLevel', data.level); next(); }}
        />
      );
    case 6:
      return (
        <SSchedule
          value={data.schedule}
          onChange={(v: string) => upd('schedule', v)}
          reminderTime={data.reminderTime}
          onReminderChange={(v: string) => upd('reminderTime', v)}
          onNext={next} onBack={back}
        />
      );
    case 7:
      return <SPlan data={data} onFinish={handleFinish} onBack={back} />;
    default:
      return <SWelcome onNext={next} />;
  }
}

// ── Styles ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },

  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 24, paddingVertical: 14,
    backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  logoRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoBadge: { width: 26, height: 26, borderRadius: 8, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center' },
  logoText:  { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 14, color: '#fff', fontWeight: '700' },
  logoName:  { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: C.ink },
  dotsWrap:  { flex: 1 },
  dotsRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot:       { height: 4, flex: 1, borderRadius: 2, backgroundColor: C.hairline },
  dotActive: { backgroundColor: C.brand },
  dotCurrent:{ backgroundColor: C.brand },
  stepLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11.5, color: C.ink4 },

  body:     { paddingHorizontal: 24, paddingTop: 32, paddingBottom: 20 },
  bodyWide: { maxWidth: 720, alignSelf: 'center' as any, width: '100%' },

  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.ink4, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 8 },
  title:   { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30, color: C.ink, lineHeight: 38, marginBottom: 8 },
  sub:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink3, lineHeight: 22, marginBottom: 28 },

  footer:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 14, borderTopWidth: 1, borderTopColor: C.border, backgroundColor: C.card },
  backBtn:      { paddingHorizontal: 16, paddingVertical: 10 },
  backText:     { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink2 },
  backTextDisabled: { color: C.ink5 },
  footerRight:  { flexDirection: 'row', alignItems: 'center', gap: 12 },
  nextBtn:      { backgroundColor: C.brand, borderRadius: 11, paddingHorizontal: 28, paddingVertical: 12, minWidth: 140, alignItems: 'center' },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText:  { fontFamily: 'Inter_700Bold', fontSize: 13.5, color: '#fff' },
  skipLink:     { fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: C.ink4, textDecorationLine: 'underline' },

  // Welcome
  cardRow: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  welcomeCard: { flex: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16 },
  welcomeNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: C.brand, marginBottom: 8, lineHeight: 34 },
  welcomeCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink, marginBottom: 5 },
  welcomeCardDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink3, lineHeight: 18 },
  infoBanner: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.brandLight, borderRadius: 12, padding: 14 },
  infoBannerIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  infoBannerIconText: { fontSize: 16, color: '#fff' },
  infoBannerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink2, flex: 1, lineHeight: 20 },

  // Language
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  langCard: { width: '47%', backgroundColor: C.card, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, padding: 14, position: 'relative' },
  langCardSel: { borderColor: C.brand, backgroundColor: C.brandLight },
  langFlag: { fontSize: 32, marginBottom: 10 },
  langName: { fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink, marginBottom: 3 },
  langSub:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4 },
  selCheck: { position: 'absolute', top: 12, right: 12, width: 20, height: 20, borderRadius: 10, backgroundColor: C.brand, alignItems: 'center', justifyContent: 'center' },
  selCheckText: { fontSize: 11, color: '#fff', fontWeight: '700' },

  // Goal
  goalGrid: { gap: 10 },
  goalCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderRadius: 13, borderWidth: 1.5, borderColor: C.border, padding: 16 },
  goalCardSel: { borderColor: C.brand, backgroundColor: C.brandLight },
  goalIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  goalIconText: { fontSize: 24 },
  goalBody: { flex: 1 },
  goalLabel: { fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink, marginBottom: 3 },
  goalSub:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink4, lineHeight: 18 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioCircleSel: { borderColor: C.brand, backgroundColor: C.brand },
  radioCheck: { fontSize: 11, color: '#fff', fontWeight: '700' },

  // Reasons
  reasonList: { gap: 8 },
  reasonCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, padding: 14 },
  reasonCardSel: { borderColor: C.brand, backgroundColor: C.brandLight },
  reasonCardDisabled: { opacity: 0.4 },
  reasonCheck: { width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  reasonCheckSel: { borderColor: C.brand, backgroundColor: C.brand },
  reasonCheckText: { fontSize: 12, color: '#fff', fontWeight: '700' },
  reasonText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink, flex: 1 },
  selectedCount: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: C.ink4, marginTop: 10 },

  // Level
  levelGrid: { gap: 10 },
  levelCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.card, borderRadius: 13, borderWidth: 1.5, borderColor: C.border, padding: 16 },
  levelBadge: { width: 54, height: 54, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  levelBadgeText: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, fontWeight: '700' },
  levelBody: { flex: 1 },
  levelLabel: { fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink, marginBottom: 3 },
  levelSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink4, lineHeight: 18, marginBottom: 4 },
  levelHours: { fontFamily: 'Inter_700Bold', fontSize: 10.5, letterSpacing: 0.5 },

  // Placement
  placementDots: { flexDirection: 'row', gap: 7, marginBottom: 20 },
  placementDot: { height: 10, width: 10, borderRadius: 5, backgroundColor: C.hairline },
  placementDotActive: { width: 28, backgroundColor: C.ink2 },
  placementDotDone: { backgroundColor: C.brand, width: 10 },
  questionCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 24 },
  questionNum: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.brand, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  questionText: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: C.ink, lineHeight: 30, marginBottom: 20 },
  optionsList: { gap: 8 },
  optionBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.bg, borderRadius: 11, borderWidth: 1.5, borderColor: C.border, padding: 14 },
  optionBtnSel: { borderColor: C.brand, backgroundColor: C.brandLight },
  optionBtnSkip: { borderStyle: 'dashed' },
  optionBtnSkipSel: { backgroundColor: C.bg2 },
  optionLabel: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  optionLabelSel: { borderColor: C.brand, backgroundColor: C.brand },
  optionLabelText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.ink4 },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink, flex: 1 },
  optionSkipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink4, fontStyle: 'italic', flex: 1 },
  qNavRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  qNavBtn: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: C.ink3 },
  qNavBtnNext: { color: C.brand },
  qNavBtnDisabled: { color: C.ink5 },

  // Schedule
  scheduleList: { gap: 10, marginBottom: 20 },
  scheduleCard: { flexDirection: 'row', alignItems: 'center', gap: 18, backgroundColor: C.card, borderRadius: 13, borderWidth: 1.5, borderColor: C.border, padding: 16 },
  scheduleCardSel: { borderColor: C.brand, backgroundColor: C.brandLight },
  scheduleMin: { width: 62, height: 62, borderRadius: 14, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  scheduleMinActive: { backgroundColor: C.brand },
  scheduleMinNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: C.ink, lineHeight: 28 },
  scheduleMinLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, color: C.ink4, letterSpacing: 0.5 },
  scheduleBody: { flex: 1 },
  scheduleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  scheduleLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: C.ink },
  scheduleTag: { backgroundColor: C.bg2, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  scheduleTagBrand: { backgroundColor: C.brandLight },
  scheduleTagText: { fontFamily: 'Inter_600SemiBold', fontSize: 10.5, color: C.ink4 },
  scheduleSub: { fontFamily: 'Inter_400Regular', fontSize: 12.5, color: C.ink3 },

  reminderCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 18 },
  reminderLabel: { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: C.ink4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  reminderDesc: { fontFamily: 'Inter_400Regular', fontSize: 13.5, color: C.ink2, lineHeight: 21, marginBottom: 14 },
  timeRow: { flexDirection: 'row', gap: 6 },
  timeBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.bg, alignItems: 'center' },
  timeBtnActive: { borderColor: C.brand, backgroundColor: C.brandLight },
  timeBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12.5, color: C.ink2 },
});

// Plan step sub-styles
const sp = StyleSheet.create({
  heroCard: { backgroundColor: C.brand, borderRadius: 20, padding: 28, marginBottom: 14, position: 'relative', overflow: 'hidden' },
  heroBlobTop: { position: 'absolute', top: -30, right: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: 'rgba(255,255,255,.08)' },
  heroBlobBottom: { position: 'absolute', bottom: -40, left: -10, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,.05)' },
  heroEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, color: 'rgba(255,255,255,.75)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 12 },
  heroLevel: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 60, color: '#fff', lineHeight: 68 },
  heroLevelLabel: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,.9)', marginBottom: 20 },
  heroProgressRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  heroProgressBg: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,.2)', overflow: 'hidden' },
  heroProgressFill: { height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  heroTargetLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#fff', letterSpacing: 1 },
  heroTimeEst: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,.8)', marginTop: 8 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 14 },
  statCard: { flex: 1, backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 18 },
  statLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
  statBig: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: C.ink, lineHeight: 40 },
  statUnit: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink3 },
  statEmoji: { fontSize: 22 },
  statGoalName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: C.ink, flex: 1 },
  statNote: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: C.ink4 },

  weekCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 14 },
  weekTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 20, color: C.ink, marginBottom: 16 },
  dayScroll: { marginHorizontal: -4 },
  dayCell: { width: 100, marginHorizontal: 4, padding: 14, borderRadius: 11, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.hairline, position: 'relative' },
  dayCellToday: { borderColor: C.brand, backgroundColor: C.brandLight },
  todayBadge: { position: 'absolute', top: -7, right: -4, backgroundColor: C.brand, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 1 },
  todayBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 8.5, color: '#fff', letterSpacing: 0.5 },
  dayCellDay: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  dayCellLesson: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink, lineHeight: 17, marginBottom: 10 },
  dayModuleRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dayModuleDot: { width: 6, height: 6, borderRadius: 3 },
  dayModuleText: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.4 },

  featuresCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 14 },
  featuresTitle: { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 14 },
  featureRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 12 },
  featureIcon: { width: 28, height: 28, borderRadius: 9, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureIconText: { fontSize: 13, color: C.brand },
  featureBody: { flex: 1 },
  featureLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink, marginBottom: 2 },
  featureDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink4, lineHeight: 18 },

  reasonsCard: { backgroundColor: C.bg2, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 14 },
  reasonItem: { backgroundColor: C.card, borderRadius: 9, borderWidth: 1, borderColor: C.hairline, padding: 12, marginBottom: 8 },
  reasonItemText: { fontFamily: 'Inter_400Regular', fontSize: 12.5, color: C.ink2, fontStyle: 'italic', lineHeight: 20 },
  reasonBanner: { backgroundColor: C.brandLight, borderRadius: 9, padding: 12 },
  reasonBannerText: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: C.ink2, lineHeight: 18 },
});
