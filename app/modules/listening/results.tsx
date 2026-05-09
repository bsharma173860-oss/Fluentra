// @ts-nocheck
import { ModuleResults } from '@/components/modules/ModuleResults';
export default function ListeningResults() { return <ModuleResults mod="listening" />; }
// legacy imports below kept for reference only
import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ListeningSidebar } from '@/components/layout/ListeningSidebar';
import { getListeningResult, clearListeningResult, type ListeningResult } from '@/lib/listeningStore';

const GREEN     = '#0A8C5A';
const GREEN_BG  = '#EDFAF4';
const RED_BG    = '#FFF3ED';
const RED       = '#C04A06';

// ── Per-question answer row ────────────────────────────────────────
function AnswerRow({ q, userAnswer }: {
  q: ListeningResult['questions'][0];
  userAnswer: string | undefined;
}) {
  const trimmed   = (userAnswer ?? '').trim();
  const isCorrect = trimmed.toLowerCase() === q.correctAnswer.toLowerCase();
  const answered  = trimmed.length > 0;

  return (
    <View style={[ar.wrap, isCorrect ? ar.wrapOk : ar.wrapBad]}>
      <View style={ar.topRow}>
        <View style={[ar.badge, isCorrect ? ar.badgeOk : ar.badgeBad]}>
          <Text style={ar.badgeText}>{isCorrect ? '✓' : '✕'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={ar.meta}>{q.shortLabel} · {q.type === 'mcq' ? 'Multiple Choice' : q.type === 'form' ? 'Form Completion' : 'Note Completion'}</Text>
          <Text style={ar.qText}>{q.text}</Text>
        </View>
      </View>

      <View style={ar.answerRow}>
        <View style={[ar.answerPill, !isCorrect && answered && ar.answerPillWrong]}>
          <Text style={ar.answerPillLabel}>Your answer</Text>
          <Text style={[ar.answerPillValue, !isCorrect && answered && { color: RED }]}>
            {answered ? trimmed : '(blank)'}
          </Text>
        </View>
        {!isCorrect && (
          <View style={ar.correctPill}>
            <Text style={ar.answerPillLabel}>Correct</Text>
            <Text style={[ar.answerPillValue, { color: GREEN }]}>{q.correctAnswer}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const ar = StyleSheet.create({
  wrap:       { borderRadius: 12, borderWidth: 1, overflow: 'hidden', marginBottom: 8 },
  wrapOk:     { backgroundColor: GREEN_BG, borderColor: '#A8DFC4' },
  wrapBad:    { backgroundColor: RED_BG, borderColor: '#F0C8A0' },
  topRow:     { flexDirection: 'row', alignItems: 'flex-start', gap: 10, padding: 12, paddingBottom: 8 },
  badge:      { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  badgeOk:    { backgroundColor: GREEN },
  badgeBad:   { backgroundColor: RED },
  badgeText:  { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.white },
  meta:       { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888', textTransform: 'uppercase' as const, letterSpacing: 0.4, marginBottom: 2 },
  qText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000', lineHeight: 18 },
  answerRow:  { flexDirection: 'row', gap: 8, paddingHorizontal: 12, paddingBottom: 12, flexWrap: 'wrap' },
  answerPill: { flex: 1, minWidth: 80, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 8, padding: 8, gap: 2 },
  answerPillWrong: { backgroundColor: 'rgba(255,255,255,0.8)' },
  correctPill:{ flex: 1, minWidth: 80, backgroundColor: 'rgba(255,255,255,0.8)', borderRadius: 8, padding: 8, gap: 2 },
  answerPillLabel:{ fontFamily: 'Inter_400Regular', fontSize: 10, color: '#888', textTransform: 'uppercase' as const },
  answerPillValue:{ fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000' },
});

// ── Question type performance ─────────────────────────────────────
function TypePerf({ label, correct, total }: { label: string; correct: number; total: number }) {
  const ok  = correct === total;
  const pct = Math.round((correct / total) * 100);
  return (
    <View style={tp.row}>
      <Text style={tp.label}>{label}</Text>
      <View style={tp.barTrack}>
        <View style={[tp.barFill, { width: `${pct}%` as any, backgroundColor: ok ? GREEN : RED }]} />
      </View>
      <Text style={[tp.score, { color: ok ? GREEN : RED }]}>{correct}/{total}</Text>
      <Text style={tp.mark}>{ok ? '✓' : '✗'}</Text>
    </View>
  );
}

const tp = StyleSheet.create({
  row:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label:   { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000', width: 140 },
  barTrack:{ flex: 1, height: 4, backgroundColor: '#F0F0F0', borderRadius: 2, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  score:   { fontFamily: 'Inter_700Bold', fontSize: 13, width: 28, textAlign: 'right' },
  mark:    { fontFamily: 'Inter_700Bold', fontSize: 13, width: 16, textAlign: 'center' },
});

// ── Main ─────────────────────────────────────────────────────────
function ListeningResultsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const [result, setResult] = useState<ListeningResult | null>(null);

  useEffect(() => {
    const r = getListeningResult();
    setResult(r);
    clearListeningResult();
  }, []);

  if (!result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 16, color: Colors.ink3 }}>No result found.</Text>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/home' as any)} style={{ marginTop: 16 }}>
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: GREEN }}>Go home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const {
    exam, section, mode, timeTakenSeconds,
    totalQuestions, correctCount, bandEstimate, answers, questions,
  } = result;

  const mins = Math.floor(timeTakenSeconds / 60);
  const secs = timeTakenSeconds % 60;

  const formQs = questions.filter(q => q.type === 'form');
  const mcqQs  = questions.filter(q => q.type === 'mcq');
  const noteQs = questions.filter(q => q.type === 'note');

  const formCorrect = formQs.filter(q => (answers[q.number] ?? '').trim().toLowerCase() === q.correctAnswer.toLowerCase()).length;
  const mcqCorrect  = mcqQs.filter(q =>  (answers[q.number] ?? '').trim().toLowerCase() === q.correctAnswer.toLowerCase()).length;
  const noteCorrect = noteQs.filter(q => (answers[q.number] ?? '').trim().toLowerCase() === q.correctAnswer.toLowerCase()).length;

  // Mock section scores (real app would have 4 separate section results)
  const s1 = correctCount;
  const s2 = Math.max(0, s1 - 1);
  const s3 = Math.max(0, s1 - 2);
  const s4 = Math.max(0, s1 - 3);

  const mainContent = (
    <SafeAreaView style={st.safe} edges={['top']}>
      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={st.header}>
          <Text style={st.headerTitle}>Listening Results</Text>
          <View style={st.metaRow}>
            <View style={st.metaChip}><Text style={st.metaChipText}>{exam}</Text></View>
            <View style={st.metaChip}><Text style={st.metaChipText}>Section {section}</Text></View>
            <View style={st.metaChip}><Text style={st.metaChipText}>{mode === 'exam' ? 'Exam' : 'Practice'}</Text></View>
            <View style={st.metaChip}><Text style={st.metaChipText}>{mins}m {secs}s</Text></View>
          </View>
        </View>

        {/* ── Score card (green) ── */}
        <View style={st.scoreCard}>
          <Text style={st.scoreCardLabel}>LISTENING SCORE</Text>
          <View style={st.scoreRow}>
            <Text style={st.scoreBig}>{correctCount}</Text>
            <Text style={st.scoreDenom}>/{totalQuestions} correct</Text>
          </View>

          <View style={st.scoreDivider} />

          {/* 4 section scores */}
          <View style={st.sectionsRow}>
            {[
              { label: 'S1', val: s1 },
              { label: 'S2', val: s2 },
              { label: 'S3', val: s3 },
              { label: 'S4', val: s4 },
            ].map(sec => (
              <View key={sec.label} style={st.sectionCell}>
                <Text style={st.sectionVal}>{sec.val}</Text>
                <Text style={st.sectionLbl}>{sec.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Performance breakdown ── */}
        <View style={st.perfCard}>
          <Text style={st.perfTitle}>Performance Breakdown</Text>

          <TypePerf label="Form Completion"   correct={formCorrect} total={formQs.length} />
          <TypePerf label="Multiple Choice"   correct={mcqCorrect}  total={mcqQs.length}  />
          <TypePerf label="Note Completion"   correct={noteCorrect} total={noteQs.length}  />

          <View style={st.perfSummary}>
            <View style={[st.perfBadge, { backgroundColor: GREEN_BG }]}>
              <Text style={[st.perfBadgeText, { color: GREEN }]}>
                Strong: {[
                  formCorrect === formQs.length && 'Form completion',
                  mcqCorrect  === mcqQs.length  && 'Multiple choice',
                  noteCorrect === noteQs.length  && 'Note completion',
                ].filter(Boolean).join(', ') || '—'}
              </Text>
            </View>
            <View style={[st.perfBadge, { backgroundColor: RED_BG }]}>
              <Text style={[st.perfBadgeText, { color: RED }]}>
                Needs work: {[
                  formCorrect < formQs.length && 'Form completion',
                  mcqCorrect  < mcqQs.length  && 'Multiple choice',
                  noteCorrect < noteQs.length  && 'Note completion',
                ].filter(Boolean).join(', ') || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Answer review ── */}
        <Text style={st.reviewTitle}>Answer Review</Text>

        <Text style={st.reviewGroup}>Form Completion (Q1–5)</Text>
        {formQs.map(q => <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />)}

        <Text style={st.reviewGroup}>Multiple Choice (Q6–8)</Text>
        {mcqQs.map(q => <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />)}

        <Text style={st.reviewGroup}>Note Completion (Q9–10)</Text>
        {noteQs.map(q => <AnswerRow key={q.number} q={q} userAnswer={answers[q.number]} />)}

        {/* ── Actions ── */}
        <View style={st.actions}>
          <TouchableOpacity
            style={st.primaryBtn}
            onPress={() => router.replace('/modules/listening/select' as any)}
            activeOpacity={0.85}
          >
            <Text style={st.primaryBtnText}>Practice again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={st.secondaryBtn}
            onPress={() => router.replace('/(tabs)/home' as any)}
            activeOpacity={0.85}
          >
            <Text style={st.secondaryBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );

  if (isDesktop) {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <ListeningSidebar />
        <View style={{ flex: 1 }}>{mainContent}</View>
      </View>
    );
  }

  return mainContent;
}

const st = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: 20, paddingTop: 20, gap: 14 },

  header:       { gap: 8, marginBottom: 2 },
  headerTitle:  { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },
  metaRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  metaChip:     { backgroundColor: Colors.bg2, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: Colors.border },
  metaChipText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  // ── Green score card ────────────────────────
  scoreCard:    { backgroundColor: GREEN, borderRadius: 20, padding: 28 },
  scoreCardLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10,
    color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const,
    letterSpacing: 0.8, marginBottom: 12,
  },
  scoreRow:   { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  scoreBig:   { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52, color: '#FFFFFF', lineHeight: 56 },
  scoreDenom: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 8 },
  scoreDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginVertical: 20 },

  sectionsRow:  { flexDirection: 'row' },
  sectionCell:  { flex: 1, alignItems: 'center', gap: 4 },
  sectionVal:   { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFFFFF' },
  sectionLbl:   { fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.6)' },

  // ── Performance card ────────────────────────
  perfCard:  { backgroundColor: Colors.white, borderRadius: 16, borderWidth: 1, borderColor: Colors.border, padding: 20, gap: 12 },
  perfTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000' },
  perfSummary: { gap: 6, marginTop: 4 },
  perfBadge:   { borderRadius: 8, padding: 10 },
  perfBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 13, lineHeight: 18 },

  // ── Answer review ───────────────────────────
  reviewTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#000', marginTop: 2 },
  reviewGroup: {
    fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#888',
    textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 4,
  },

  // ── Actions ─────────────────────────────────
  actions:       { flexDirection: 'row', gap: 10 },
  primaryBtn:    { flex: 1, backgroundColor: GREEN, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  primaryBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  secondaryBtn:  { flex: 1, backgroundColor: Colors.white, borderRadius: 10, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  secondaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
});
