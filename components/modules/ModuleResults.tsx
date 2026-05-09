/**
 * Shared Module Results — matches page_module_results.jsx
 * Used by reading, listening, speaking, writing results screens.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';

// ── Design tokens ──────────────────────────────────────────────────
const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06', brandLight: '#FFE5DE',
  speaking:  { c: '#5B4EFF', bg: '#EEEDFF' },
  writing:   { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
  reading:   { c: '#C04A06', bg: '#FFE5DE' },
};

// ── Types ──────────────────────────────────────────────────────────
export type ModuleKey = 'reading' | 'listening' | 'speaking' | 'writing';

type CountScore = { type: 'count'; val: number; total: number; sub: string; bandEst?: number };
type BandScore  = { type: 'band'; val: number; sub: string };
type Criterion  = { key: string; short: string; val: number };
type Breakdown  = { label: string; correct: number; total: number; type: string };

type ModuleConfig = {
  name: string;
  accent: string;
  accentBg: string;
  headerLabel: string;
  practiceRoute: string;
  meta: string[];
  score: CountScore | BandScore;
  breakdownTitle?: string;
  breakdown?: Breakdown[];
  criteria?: Criterion[];
};

// ── Static module config ───────────────────────────────────────────
export const MODULE_CONFIGS: Record<ModuleKey, ModuleConfig> = {
  reading: {
    name: 'Reading', accent: C.reading.c, accentBg: C.reading.bg,
    headerLabel: 'Reading Results',
    practiceRoute: '/modules/reading/select',
    meta: ['IELTS Academic', 'Hard', '54m 12s'],
    score: { type: 'count', val: 11, total: 13, sub: 'correct', bandEst: 7.5 },
    breakdownTitle: 'Performance by passage',
    breakdown: [
      { label: 'Passage 1 — Skim & Scan', correct: 5, total: 5, type: 'Matching headings' },
      { label: 'Passage 2 — Detail',      correct: 4, total: 4, type: 'Multiple choice' },
      { label: 'Passage 3 — Inference',   correct: 2, total: 4, type: 'True / False / NG' },
    ],
  },
  listening: {
    name: 'Listening', accent: C.listening.c, accentBg: C.listening.bg,
    headerLabel: 'Listening Results',
    practiceRoute: '/modules/listening/select',
    meta: ['IELTS Academic', 'Medium', '32m 04s'],
    score: { type: 'count', val: 34, total: 40, sub: 'correct', bandEst: 7.5 },
    breakdownTitle: 'Performance by section',
    breakdown: [
      { label: 'Section 1 — Conversation', correct: 9,  total: 10, type: 'Form filling' },
      { label: 'Section 2 — Monologue',    correct: 9,  total: 10, type: 'Map labelling' },
      { label: 'Section 3 — Discussion',   correct: 8,  total: 10, type: 'Multiple choice' },
      { label: 'Section 4 — Lecture',      correct: 8,  total: 10, type: 'Sentence completion' },
    ],
  },
  speaking: {
    name: 'Speaking', accent: C.speaking.c, accentBg: C.speaking.bg,
    headerLabel: 'Speaking Results',
    practiceRoute: '/modules/speaking/select',
    meta: ['IELTS Academic', 'Part 2', '11m 43s'],
    score: { type: 'band', val: 7.0, sub: '/9.0' },
    criteria: [
      { key: 'Fluency & Coherence', short: 'Fluency', val: 7.5 },
      { key: 'Lexical Resource',    short: 'Lexical', val: 7.0 },
      { key: 'Grammatical Range',   short: 'Grammar', val: 6.5 },
      { key: 'Pronunciation',       short: 'Pronunc.', val: 7.0 },
    ],
  },
  writing: {
    name: 'Writing', accent: C.writing.c, accentBg: C.writing.bg,
    headerLabel: 'Writing Results',
    practiceRoute: '/modules/writing/select',
    meta: ['IELTS Academic', 'Task 2', '38m 40s', '328 words'],
    score: { type: 'band', val: 7.0, sub: '/9.0' },
    criteria: [
      { key: 'Task Achievement',     short: 'Task Ach.',  val: 7.0 },
      { key: 'Coherence & Cohesion', short: 'Coherence',  val: 7.5 },
      { key: 'Lexical Resource',     short: 'Lexical',    val: 6.5 },
      { key: 'Grammatical Range',    short: 'Grammar',    val: 7.0 },
    ],
  },
};

const FEEDBACK: Record<string, { summary: string; good: string; fix: { orig: string; sug: string }[] }> = {
  'Fluency & Coherence': {
    summary: 'Generally natural pace with some hesitation at complex ideas. Discourse markers connected ideas effectively.',
    good: '"Furthermore, this shows that…" — strong cohesive device',
    fix: [{ orig: '"Um… I think… it\'s, um, important"', sug: 'Replace fillers with a brief pause or "well, I believe…"' }],
  },
  'Lexical Resource': {
    summary: 'A satisfactory range of vocabulary. Some topic-specific terms were used effectively, though repetition occurred.',
    good: '"prevalent", "substantial impact", "noteworthy trend" — strong word choices',
    fix: [{ orig: '"very good" × 3 times', sug: 'Vary: "exceptional", "remarkable", "outstanding"' }],
  },
  'Grammatical Range': {
    summary: 'A mix of simple and complex structures. Errors were rare and rarely impeded communication.',
    good: '"Although technology has advanced rapidly, many still prefer…" — complex clause used well',
    fix: [{ orig: '"I have went to many places"', sug: '"I have been to many places" — past participle' }],
  },
  'Pronunciation': {
    summary: 'Clear delivery with natural stress patterns. Word stress errors occasional but did not impede intelligibility.',
    good: 'Clear sentence stress and intonation on key ideas.',
    fix: [{ orig: '"de-VE-lop" → wrong stress', sug: '"de-vel-op" — stress the second syllable' }],
  },
  'Task Achievement': {
    summary: 'You addressed the main task with a clear position. Ideas are relevant and developed with some detail.',
    good: 'Clear position stated in introduction and reinforced in conclusion.',
    fix: [{ orig: '"Technology have become essential…"', sug: '"Technology has become essential…" — subject-verb agreement' }],
  },
  'Coherence & Cohesion': {
    summary: 'Paragraphs sequenced logically with a clear progression. Linking devices used, though some over-repeated.',
    good: 'Strong topic sentences open each body paragraph.',
    fix: [{ orig: '"Furthermore… Furthermore… Furthermore…"', sug: 'Vary: "Moreover", "In addition", "Additionally"' }],
  },
};

const SAMPLE_QS = [
  { n: 1, type: 'Matching headings', q: 'Paragraph A best matches which heading?', user: 'iv',  correct: 'iv',  ok: true },
  { n: 2, type: 'Matching headings', q: 'Paragraph B best matches which heading?', user: 'ii',  correct: 'ii',  ok: true },
  { n: 3, type: 'Multiple choice',   q: 'What is the writer\'s main concern in paragraph 4?', user: 'B', correct: 'B', ok: true },
  { n: 4, type: 'True / False / NG', q: 'Slow-wave sleep is important for procedural memory.', user: 'False', correct: 'True', ok: false },
  { n: 5, type: 'True / False / NG', q: 'The 2003 study found a 20.5% improvement.', user: 'True', correct: 'True', ok: true },
];

const SAMPLE_ESSAY = `In recent decades, technology has become essential in modern life, fundamentally reshaping how we work, learn, and communicate. While some argue that this dependence is excessive, I believe that, on balance, the benefits substantially outweigh the drawbacks.

Firstly, technology has dramatically improved access to information. A student in a rural village can now follow lectures from the world's top universities. Furthermore, this democratisation extends to healthcare, where remote diagnostics save lives in regions with limited specialist coverage.

However, this prevalence is not without cost. Excessive screen time has been linked to attention difficulties and reduced face-to-face interaction. The issue is widespread and affects many people, particularly young learners who struggle to focus for long periods.

In conclusion, although technology brings noteworthy challenges, careful and intentional use makes it a powerful force for good. The solution is not to reject the tools, but to develop the habits that govern how we use them.`;

// ── Helpers ────────────────────────────────────────────────────────
const scoreColor = (v: number) => v >= 7 ? C.listening.c : v >= 5.5 ? C.writing.c : C.brand;

// ── Sub-components ─────────────────────────────────────────────────
function BreakdownBar({ label, type, correct, total, accent }: Breakdown & { accent: string }) {
  const pct = total > 0 ? (correct / total) * 100 : 0;
  const ok = correct === total;

  if (Platform.OS === 'web') {
    return (
      <div style={{ padding: '12px 0', borderBottom: `1px solid ${C.hairline}` } as any}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 } as any}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.ink, marginBottom: 2 } as any}>{label}</div>
            <div style={{ fontSize: 11, color: C.ink4 } as any}>{type}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: ok ? C.listening.c : accent } as any}>{correct}</span>
            <span style={{ fontSize: 11, color: C.ink4 } as any}>/ {total}</span>
          </div>
        </div>
        <div style={{ height: 5, background: C.bg2, borderRadius: 3, overflow: 'hidden' } as any}>
          <div style={{ height: '100%', width: `${pct}%`, background: ok ? C.listening.c : accent, borderRadius: 3 } as any} />
        </div>
      </div>
    );
  }
  return (
    <View style={[bb.row, { borderBottomColor: C.hairline }]}>
      <View style={{ flex: 1 }}>
        <Text style={bb.label}>{label}</Text>
        <Text style={bb.type}>{type}</Text>
      </View>
      <Text style={[bb.score, { color: ok ? C.listening.c : accent }]}>{correct}/{total}</Text>
    </View>
  );
}

const bb = StyleSheet.create({
  row: { paddingVertical: 10, borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink, marginBottom: 2 },
  type: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4 },
  score: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, flexShrink: 0 },
});

function CriterionCard({ name, value, accent }: { name: string; value: number; accent: string }) {
  const fb = FEEDBACK[name];
  if (!fb) return null;
  const color = scoreColor(value);

  if (Platform.OS === 'web') {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 14 } as any}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 } as any}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink } as any}>{name}</div>
          <div style={{ background: color + '18', color, padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 700 } as any}>{value.toFixed(1)}</div>
        </div>
        <div style={{ fontSize: 13, color: C.ink3, lineHeight: 1.55, marginBottom: 12 } as any}>{fb.summary}</div>
        <div style={{ background: C.listening.bg, borderLeft: `3px solid ${C.listening.c}`, padding: '10px 12px', borderRadius: 4, marginBottom: 8 } as any}>
          <div style={{ fontSize: 10, color: C.listening.c, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 } as any}>What worked</div>
          <div style={{ fontSize: 12.5, color: C.ink2, lineHeight: 1.5 } as any}>{fb.good}</div>
        </div>
        {fb.fix.map((f, i) => (
          <div key={i} style={{ background: C.writing.bg, borderLeft: `3px solid ${C.writing.c}`, padding: '10px 12px', borderRadius: 4, marginBottom: i < fb.fix.length - 1 ? 8 : 0 } as any}>
            <div style={{ fontSize: 10, color: C.writing.c, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 } as any}>Fix this</div>
            <div style={{ fontSize: 12.5, color: C.writing.c, fontWeight: 600, marginBottom: 3 } as any}>{f.orig}</div>
            <div style={{ fontSize: 12, color: C.ink3 } as any}>→ {f.sug}</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <View style={cc.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={cc.name}>{name}</Text>
        <View style={[cc.badge, { backgroundColor: color + '18' }]}>
          <Text style={[cc.badgeText, { color }]}>{value.toFixed(1)}</Text>
        </View>
      </View>
      <Text style={cc.summary}>{fb.summary}</Text>
      <View style={[cc.callout, { backgroundColor: C.listening.bg, borderLeftColor: C.listening.c }]}>
        <Text style={[cc.calloutLabel, { color: C.listening.c }]}>WHAT WORKED</Text>
        <Text style={cc.calloutText}>{fb.good}</Text>
      </View>
    </View>
  );
}

const cc = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 12 },
  name: { fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  summary: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink3, lineHeight: 20, marginBottom: 10 },
  callout: { padding: 10, borderRadius: 4, borderLeftWidth: 3, marginBottom: 4 },
  calloutLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 },
  calloutText: { fontFamily: 'Inter_400Regular', fontSize: 12.5, color: C.ink2, lineHeight: 18 },
});

// ── Main component ─────────────────────────────────────────────────
export function ModuleResults({ mod }: { mod: ModuleKey }) {
  const M = MODULE_CONFIGS[mod];
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const score = M.score;
  const scoreIsCount = score.type === 'count';
  const heroColor = mod === 'writing' ? C.ink : M.accent;

  if (isDesktop) {
    return (
      <AppLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
          {/* Header */}
          <div style={{ height: 56, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, padding: '0 36px', background: C.card, flexShrink: 0 } as any}>
            <button onClick={() => router.back()} style={{ width: 32, height: 32, borderRadius: 8, background: C.bg2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' } as any}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div style={{ fontSize: 12, color: C.ink5, fontWeight: 600 } as any}>
              {M.name} <span style={{ color: C.ink5 }}>›</span> Session results
            </div>
          </div>

          <div style={{ flex: 1, overflow: 'auto' } as any}>
            <div style={{ maxWidth: 1080, margin: '0 auto', padding: '28px 36px 48px' } as any}>
              {/* Page heading */}
              <div style={{ marginBottom: 18 } as any}>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, color: C.ink, lineHeight: 1.05, marginBottom: 8 } as any}>{M.headerLabel}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 } as any}>
                  {M.meta.map(m => (
                    <span key={m} style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: C.bg2, fontSize: 11.5, fontWeight: 600, color: C.ink3 } as any}>{m}</span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 } as any}>
                  <button style={{ padding: '9px 18px', borderRadius: 10, border: `1.5px solid ${C.border}`, background: C.card, fontSize: 13, fontWeight: 600, color: C.ink2, cursor: 'pointer' } as any}>Share</button>
                  <button onClick={() => router.push(M.practiceRoute as any)} style={{ padding: '9px 18px', borderRadius: 10, border: 'none', background: M.accent, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as any}>
                    Practice again
                  </button>
                </div>
              </div>

              {/* Score + leaderboard grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginBottom: 14 } as any}>
                {/* Band hero */}
                <div style={{ background: heroColor, borderRadius: 18, padding: '30px 32px', color: '#fff', position: 'relative', overflow: 'hidden' } as any}>
                  <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: 'rgba(255,255,255,.15)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.85)', marginBottom: 14 } as any}>
                    {M.name} score
                  </div>
                  {scoreIsCount ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 8 } as any}>
                        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 64, lineHeight: 1 } as any}>{(score as CountScore).val}</span>
                        <span style={{ fontSize: 18, color: 'rgba(255,255,255,.55)', marginBottom: 10 } as any}>/ {(score as CountScore).total} {score.sub}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,.15)' } as any}>
                        <div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 } as any}>Est. band</div>
                          <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, lineHeight: 1 } as any}>{(score as CountScore).bandEst?.toFixed(1)}</div>
                        </div>
                        <div style={{ flex: 1 } as any} />
                        <div style={{ textAlign: 'right' } as any}>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 3 } as any}>Time</div>
                          <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, lineHeight: 1 } as any}>{M.meta.find(m => m.includes('m ')) || '—'}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 18 } as any}>
                        <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 64, lineHeight: 1 } as any}>{(score as BandScore).val.toFixed(1)}</span>
                        <span style={{ fontSize: 18, color: 'rgba(255,255,255,.55)', marginBottom: 10 } as any}>{score.sub}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.15)' } as any}>
                        {M.criteria?.map(c => (
                          <div key={c.key} style={{ flex: 1, textAlign: 'center' } as any}>
                            <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, lineHeight: 1, marginBottom: 4 } as any}>{c.val.toFixed(1)}</div>
                            <div style={{ fontSize: 10, color: 'rgba(255,255,255,.6)' } as any}>{c.short}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Leaderboard panel */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 } as any}>
                  <div style={{ fontSize: 11, color: C.ink5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6 } as any}>Your ranking</div>
                  <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: C.ink, lineHeight: 1.15, marginTop: 6 } as any}>#491 of 26,400</div>
                  <div style={{ fontSize: 12, color: C.listening.c, fontWeight: 600, marginTop: 3, marginBottom: 14 } as any}>Top 1.9% this week</div>
                  <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: M.accentBg, fontSize: 11, fontWeight: 700, color: M.accent } as any}>🏆 Top 2%</div>
                  <div style={{ height: 1, background: C.hairline, margin: '14px 0 8px' } as any} />
                  {[{ rank: 489, name: 'Sofía R.', score: scoreIsCount ? `${(score as CountScore).val + 2}` : '7.5', you: false },
                    { rank: 490, name: 'James T.', score: scoreIsCount ? `${(score as CountScore).val + 1}` : '7.0', you: false },
                    { rank: 491, name: 'You',      score: scoreIsCount ? `${(score as CountScore).val}` : (score as BandScore).val.toFixed(1), you: true },
                    { rank: 492, name: 'Li Wei',   score: scoreIsCount ? `${(score as CountScore).val - 1}` : '6.5', you: false },
                  ].map(row => (
                    <div key={row.rank} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${C.hairline}` } as any}>
                      <span style={{ fontSize: 11, color: C.ink4, width: 28 } as any}>{row.rank}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: row.you ? 700 : 400, color: row.you ? M.accent : C.ink } as any}>{row.name}</span>
                      <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 16, color: row.you ? M.accent : C.ink3 } as any}>{row.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reading/Listening breakdown */}
              {(mod === 'reading' || mod === 'listening') && M.breakdown && (
                <>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 14 } as any}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 } as any}>{M.breakdownTitle}</div>
                    <div style={{ fontSize: 12, color: C.ink4, marginBottom: 6 } as any}>How you did across each part of the test.</div>
                    {M.breakdown.map(b => <BreakdownBar key={b.label} {...b} accent={M.accent} />)}
                  </div>

                  <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: '24px 0 12px' } as any}>Answer review</div>
                  <div style={{ fontSize: 12, color: C.ink4, marginBottom: 12 } as any}>
                    Showing {SAMPLE_QS.length} questions · <span style={{ color: M.accent, fontWeight: 600, cursor: 'pointer' } as any}>Show only incorrect</span>
                  </div>
                  {SAMPLE_QS.map(q => (
                    <div key={q.n} style={{ background: C.card, border: `1px solid ${q.ok ? C.border : C.brand + '33'}`, borderRadius: 12, padding: 16, marginBottom: 10 } as any}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 } as any}>
                        <div style={{ width: 28, height: 28, borderRadius: 14, background: q.ok ? C.listening.bg : C.brandLight, color: q.ok ? C.listening.c : C.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 } as any}>{q.n}</div>
                        <div style={{ flex: 1 } as any}>
                          <div style={{ fontSize: 10, color: M.accent, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 } as any}>{q.type}</div>
                          <div style={{ fontSize: 13.5, color: C.ink, marginBottom: 8 } as any}>{q.q}</div>
                          <div style={{ display: 'flex', gap: 8 } as any}>
                            <span style={{ fontSize: 12, color: q.ok ? C.listening.c : C.brand, fontWeight: 700 } as any}>Your answer: {q.user}</span>
                            {!q.ok && <span style={{ fontSize: 12, color: C.listening.c, fontWeight: 700 } as any}>Correct: {q.correct}</span>}
                          </div>
                        </div>
                        <span style={{ fontSize: 18 } as any}>{q.ok ? '✓' : '✗'}</span>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {/* Speaking/Writing criteria */}
              {(mod === 'speaking' || mod === 'writing') && M.criteria && (
                <>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.ink, margin: '24px 0 12px' } as any}>Per-criterion feedback</div>
                  {M.criteria.map(c => <CriterionCard key={c.key} name={c.key} value={c.val} accent={M.accent} />)}

                  {mod === 'writing' && (
                    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 14 } as any}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 } as any}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink } as any}>Your essay</div>
                        <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 99, background: C.bg2, fontSize: 11, fontWeight: 600, color: C.ink3 } as any}>328 words</span>
                      </div>
                      <div style={{ fontSize: 13.5, color: C.ink2, lineHeight: 1.8, whiteSpace: 'pre-wrap', fontFamily: "'Inter',sans-serif" } as any}>{SAMPLE_ESSAY}</div>
                    </div>
                  )}
                </>
              )}

              {/* Next steps */}
              <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginTop: 14 } as any}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 12 } as any}>Next steps for you</div>
                {[
                  `Focus on ${mod === 'reading' || mod === 'listening' ? 'inference questions' : 'lexical resource'} — your weakest area.`,
                  `Try a ${mod === 'reading' ? 'harder passage' : mod === 'listening' ? 'lecture-style listening' : 'longer practice session'}.`,
                  'Aim for 30 minutes of practice today to keep your streak alive.',
                ].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '9px 0', borderBottom: i < 2 ? `1px solid ${C.hairline}` : 'none' } as any}>
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: M.accentBg, color: M.accent, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 } as any}>{i + 1}</div>
                    <div style={{ fontSize: 13, color: C.ink2, lineHeight: 1.55 } as any}>{tip}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Mobile ────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        {/* Header */}
        <View style={mo.header}>
          <TouchableOpacity style={mo.backBtn} onPress={() => router.back()}>
            <Text style={{ fontSize: 16, color: C.ink2 }}>‹</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={mo.headerTitle}>{M.headerLabel}</Text>
            <Text style={mo.headerMeta}>{M.meta.slice(0, 2).join(' · ')}</Text>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          {/* Score hero */}
          <View style={[mo.heroCard, { backgroundColor: heroColor, margin: 16, borderRadius: 18 }]}>
            <View style={mo.heroBadge}>
              <Text style={mo.heroBadgeText}>{M.name} score</Text>
            </View>
            {scoreIsCount ? (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 16 }}>
                  <Text style={[mo.heroScore, { color: '#fff' }]}>{(score as CountScore).val}</Text>
                  <Text style={mo.heroScoreSub}>/ {(score as CountScore).total}</Text>
                </View>
                <View style={mo.heroDivider} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                  <View>
                    <Text style={mo.heroStatLabel}>Est. band</Text>
                    <Text style={mo.heroStatVal}>{(score as CountScore).bandEst?.toFixed(1)}</Text>
                  </View>
                  <View>
                    <Text style={[mo.heroStatLabel, { textAlign: 'right' }]}>Rank</Text>
                    <Text style={mo.heroStatVal}>#491</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginBottom: 16 }}>
                  <Text style={[mo.heroScore, { color: '#fff' }]}>{(score as BandScore).val.toFixed(1)}</Text>
                  <Text style={mo.heroScoreSub}>{score.sub}</Text>
                </View>
                <View style={mo.heroDivider} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 12 }}>
                  {M.criteria?.map(c => (
                    <View key={c.key} style={{ minWidth: '40%' }}>
                      <Text style={mo.heroStatLabel}>{c.short}</Text>
                      <Text style={mo.heroStatVal}>{c.val.toFixed(1)}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={{ padding: 16, gap: 12 }}>
            {/* Breakdown for Reading/Listening */}
            {(mod === 'reading' || mod === 'listening') && M.breakdown && (
              <View style={mo.card}>
                <Text style={mo.sectionTitle}>{M.breakdownTitle}</Text>
                {M.breakdown.map(b => <BreakdownBar key={b.label} {...b} accent={M.accent} />)}
              </View>
            )}

            {/* Criteria for Speaking/Writing */}
            {(mod === 'speaking' || mod === 'writing') && M.criteria && (
              <>
                <Text style={mo.sectionTitle}>Per-criterion feedback</Text>
                {M.criteria.map(c => <CriterionCard key={c.key} name={c.key} value={c.val} accent={M.accent} />)}
              </>
            )}

            {/* Next steps */}
            <View style={[mo.card, { backgroundColor: C.bg2 }]}>
              <Text style={mo.sectionTitle}>Next steps</Text>
              {[
                `Focus on ${mod === 'reading' || mod === 'listening' ? 'inference questions' : 'lexical resource'}.`,
                'Aim for 30 min of practice today.',
              ].map((tip, i) => (
                <View key={i} style={mo.tipRow}>
                  <View style={[mo.tipNum, { backgroundColor: M.accentBg }]}>
                    <Text style={[mo.tipNumText, { color: M.accent }]}>{i + 1}</Text>
                  </View>
                  <Text style={mo.tipText}>{tip}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={[mo.btn, { flex: 1, backgroundColor: M.accent }]} onPress={() => router.push(M.practiceRoute as any)}>
                <Text style={mo.btnText}>Practice again</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[mo.btn, { flex: 1, backgroundColor: C.bg2, borderWidth: 1, borderColor: C.border }]} onPress={() => router.push('/(tabs)/home' as any)}>
                <Text style={[mo.btnText, { color: C.ink2 }]}>Home</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const mo = StyleSheet.create({
  header: { height: 52, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink },
  headerMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4, marginTop: 1 },
  heroCard: { padding: 24, overflow: 'hidden' },
  heroBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: 'rgba(255,255,255,.15)', alignSelf: 'flex-start', marginBottom: 12 },
  heroBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,.85)', letterSpacing: 0.8, textTransform: 'uppercase' },
  heroScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 54, lineHeight: 56 },
  heroScoreSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,.55)', marginBottom: 8 },
  heroDivider: { height: 1, backgroundColor: 'rgba(255,255,255,.15)', marginVertical: 4 },
  heroStatLabel: { fontFamily: 'Inter_700Bold', fontSize: 9.5, color: 'rgba(255,255,255,.55)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  heroStatVal: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: '#fff', lineHeight: 24 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink, marginBottom: 10 },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.hairline },
  tipNum: { width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  tipNumText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  tipText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink2, flex: 1, lineHeight: 20 },
  btn: { borderRadius: 12, padding: 14, alignItems: 'center' },
  btnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },
});
