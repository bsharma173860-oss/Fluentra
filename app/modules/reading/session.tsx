/**
 * Reading session — matches page_sessions.jsx ReadingSession
 * Split-pane: passage left, MCQ/fill-in right, progress header
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  reading: { c: '#C04A06', bg: '#FFE5DE' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
};

const PASSAGE = `Sleep and memory have a complex, bidirectional relationship that researchers have only begun to fully understand in recent decades. During sleep, the brain does not simply rest — it actively processes and consolidates the information gathered during waking hours, transferring memories from short-term storage in the hippocampus to long-term storage in the cortex.

A landmark 2003 study by Walker et al. demonstrated that students who learned a complex motor task and then slept showed a 20.5% improvement in performance the following day, compared to those who remained awake. This finding was replicated across verbal learning tasks, suggesting that sleep plays a domain-general role in memory consolidation rather than a task-specific one.

The precise mechanism appears to involve slow-wave sleep (SWS) and rapid eye movement (REM) sleep in different but complementary ways. SWS, characterised by large, slow brain oscillations, seems particularly important for declarative memory — facts and events. REM sleep, by contrast, appears critical for procedural and emotional memories.`;

const QUESTIONS = [
  { n: 1, type: 'Multiple choice', stem: 'What does the study by Walker et al. primarily demonstrate?', options: ['Sleep improves motor task performance only', 'Sleep plays a domain-general role in memory consolidation', 'REM sleep is more important than SWS', 'Memory consolidation only occurs during waking hours'] },
  { n: 2, type: 'True / False / NG', stem: 'SWS is particularly important for procedural memory.', options: ['True', 'False', 'Not Given'] },
  { n: 3, type: 'Multiple choice', stem: 'The 2003 Walker et al. study found what percentage improvement in performance?', options: ['15.0%', '20.5%', '25.0%', '18.5%'] },
  { n: 4, type: 'Fill in the blank', stem: 'According to the passage, memories are transferred from the _______ to the cortex during sleep.', options: null },
  { n: 5, type: 'Multiple choice', stem: 'Which type of sleep appears most critical for emotional memories?', options: ['Slow-wave sleep', 'REM sleep', 'Light sleep', 'Both equally'] },
];

function SessionHeader({ progress, timeLeft }: { progress: number; timeLeft: number }) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarning = timeLeft < 300;

  if (Platform.OS === 'web') {
    return (
      <div style={{
        height: 64, borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '0 28px', flexShrink: 0, background: C.card,
      } as any}>
        <button onClick={() => router.back()} style={{
          width: 36, height: 36, borderRadius: 10,
          background: C.bg2, border: `1px solid ${C.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: C.ink2, cursor: 'pointer',
        } as any}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 } as any}>
          <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 2 } as any}>IELTS Reading</div>
          <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } as any}>Sleep &amp; Memory — Academic Reading Passage 2</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 } as any}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 } as any}>
            <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' } as any}>Progress</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
              <div style={{ width: 160, height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                <div style={{ height: '100%', width: `${progress}%`, background: C.reading.c, borderRadius: 99, transition: 'width .4s' } as any} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.ink4 } as any}>{Math.round(progress)}%</span>
            </div>
          </div>
          <div style={{ padding: '7px 14px', borderRadius: 10, background: isWarning ? '#FEF2F2' : '#F4F4F0', border: `1px solid ${isWarning ? '#EF4444' : 'transparent'}` } as any}>
            <div style={{ fontSize: 11, color: isWarning ? '#EF4444' : C.ink4, fontWeight: 700, letterSpacing: '.05em', fontFamily: 'monospace' } as any}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <View style={h.bar}>
      <TouchableOpacity style={h.exitBtn} onPress={() => router.back()}>
        <Text style={{ fontSize: 16, color: C.ink2 }}>✕</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={h.module}>IELTS READING</Text>
        <Text style={h.title} numberOfLines={1}>Sleep &amp; Memory — Passage 2</Text>
      </View>
      <Text style={[h.timer, isWarning && { color: '#EF4444' }]}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </Text>
    </View>
  );
}

const h = StyleSheet.create({
  bar: { height: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  exitBtn: { width: 34, height: 34, borderRadius: 9, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' },
  module: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink },
  timer: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink4, fontVariant: ['tabular-nums'] as any },
});

export default function ReadingSession() {
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const answered_count = Object.keys(answered).length;
  const progress = 18 + (answered_count / QUESTIONS.length) * 82;

  function answer(n: number, opt: string) {
    setAnswered(a => ({ ...a, [n]: opt }));
  }

  if (isDesktop) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
        <SessionHeader progress={progress} timeLeft={2180} />
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' } as any}>
          {/* Passage */}
          <div style={{ overflow: 'auto', padding: '28px 32px', borderRight: `1px solid ${C.border}`, background: C.bg } as any}>
            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 } as any}>PASSAGE</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.85, color: C.ink2, fontFamily: "Georgia,'DM Serif Display',serif" } as any}>
              {PASSAGE.split('\n\n').map((para, i) => (
                <p key={i} style={{ marginBottom: 20 }}>{para}</p>
              ))}
            </div>
          </div>

          {/* Questions */}
          <div style={{ overflow: 'auto', padding: '28px 32px', background: C.card } as any}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 } as any}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' } as any}>QUESTIONS</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 99, background: C.reading.bg, fontSize: 11, fontWeight: 700, color: C.reading.c } as any}>
                {answered_count}/5
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 } as any}>
              {QUESTIONS.map(q => (
                <div key={q.n} style={{ padding: 18, borderRadius: 14, border: `1px solid ${answered[q.n] ? C.reading.c + '44' : C.border}`, background: answered[q.n] ? C.reading.bg : C.card, transition: 'all .2s' } as any}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 } as any}>
                    <div style={{ width: 24, height: 24, borderRadius: 12, background: answered[q.n] ? C.reading.c : C.bg3, color: answered[q.n] ? '#fff' : C.ink4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 } as any}>{q.n}</div>
                    <div>
                      <div style={{ fontSize: 10, color: C.reading.c, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 } as any}>{q.type}</div>
                      <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.5 } as any}>{q.stem}</div>
                    </div>
                  </div>
                  {q.options ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 7, paddingLeft: 34 } as any}>
                      {q.options.map(opt => (
                        <button key={opt} onClick={() => answer(q.n, opt)} style={{
                          padding: '9px 14px', borderRadius: 9,
                          border: `1.5px solid ${answered[q.n] === opt ? C.reading.c : C.border}`,
                          background: answered[q.n] === opt ? C.reading.bg : 'transparent',
                          fontSize: 13, fontWeight: answered[q.n] === opt ? 700 : 400,
                          color: answered[q.n] === opt ? C.reading.c : C.ink,
                          textAlign: 'left', cursor: 'pointer', transition: 'all .15s',
                        } as any}>{opt}</button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ paddingLeft: 34 } as any}>
                      <input
                        placeholder="Write your answer here…"
                        onChange={() => answer(q.n, 'filled')}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 9, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, fontFamily: "'Inter',sans-serif", outline: 'none', boxSizing: 'border-box' } as any}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 24 } as any}>
              <button onClick={() => router.push('/modules/reading/results' as any)} style={{
                width: '100%', padding: '14px 24px', borderRadius: 12,
                background: C.reading.c, color: '#fff', fontSize: 14, fontWeight: 700,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              } as any}>
                Submit answers
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <SessionHeader progress={progress} timeLeft={2180} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Passage card */}
        <View style={m.section}>
          <Text style={m.sectionLabel}>PASSAGE</Text>
          {PASSAGE.split('\n\n').map((para, i) => (
            <Text key={i} style={m.passage}>{para}</Text>
          ))}
        </View>

        {/* Questions */}
        <View style={m.section}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={m.sectionLabel}>QUESTIONS</Text>
            <View style={[m.chip, { backgroundColor: C.reading.bg }]}>
              <Text style={[m.chipText, { color: C.reading.c }]}>{answered_count}/5</Text>
            </View>
          </View>
          {QUESTIONS.map(q => (
            <View key={q.n} style={[m.qCard, answered[q.n] && { borderColor: C.reading.c + '44', backgroundColor: C.reading.bg }]}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                <View style={[m.qNum, answered[q.n] && { backgroundColor: C.reading.c }]}>
                  <Text style={[m.qNumText, answered[q.n] && { color: '#fff' }]}>{q.n}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[m.qType, { color: C.reading.c }]}>{q.type}</Text>
                  <Text style={m.qStem}>{q.stem}</Text>
                </View>
              </View>
              {q.options ? (
                <View style={{ gap: 6, paddingLeft: 32 }}>
                  {q.options.map(opt => (
                    <TouchableOpacity key={opt} onPress={() => answer(q.n, opt)}
                      style={[m.option, answered[q.n] === opt && { borderColor: C.reading.c, backgroundColor: C.reading.bg }]}>
                      <Text style={[m.optionText, answered[q.n] === opt && { color: C.reading.c, fontFamily: 'Inter_700Bold' }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ paddingLeft: 32 }}>
                  <TextInput
                    placeholder="Write your answer here…"
                    style={m.textInput}
                    onChangeText={() => answer(q.n, 'filled')}
                    placeholderTextColor={C.ink5}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={[m.submitBtn, { backgroundColor: C.reading.c }]} onPress={() => router.push('/modules/reading/results' as any)}>
          <Text style={m.submitText}>Submit answers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const m = StyleSheet.create({
  section: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 },
  passage: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 24, color: C.ink2, marginBottom: 14 },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  chipText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  qCard: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10 },
  qNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.bg3, alignItems: 'center', justifyContent: 'center' },
  qNumText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.ink4 },
  qType: { fontFamily: 'Inter_700Bold', fontSize: 10, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 3 },
  qStem: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink, lineHeight: 20 },
  option: { padding: 10, borderRadius: 9, borderWidth: 1.5, borderColor: C.border, backgroundColor: 'transparent' },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink },
  textInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 9, padding: 10, fontSize: 13, color: C.ink, fontFamily: 'Inter_400Regular' },
  submitBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 32 },
  submitText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
});
