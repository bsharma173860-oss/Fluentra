/**
 * Listening session — matches page_sessions.jsx ListeningSession
 * Left: audio player + notes. Right: questions panel.
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
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
};

const QUESTIONS = [
  { n: 1, stem: 'What is the main purpose of the academic discussion?', options: ['To analyse declining bee populations', 'To debate climate change effects', 'To review recent pollination studies', 'To compare different insect species'] },
  { n: 2, stem: 'According to the speaker, which factor has contributed most to bee decline?', options: ['Climate change', 'Pesticide use', 'Habitat loss', 'Parasites'] },
  { n: 3, stem: 'The term "colony collapse disorder" refers to:', options: ['Bees leaving the hive without returning', 'A viral infection affecting bee larvae', 'Reduced honey production in winter', 'Aggressive behaviour between colonies'] },
  { n: 4, stem: 'Complete the sentence: Neonicotinoids are a type of _______ that affect bee navigation.', options: null },
  { n: 5, stem: 'Which solution does the expert recommend as most immediately actionable?', options: ['Banning all pesticides', 'Planting wildflower corridors', 'Relocating bee colonies', 'Funding more research'] },
];

export default function ListeningSession() {
  const [playing, setPlaying] = useState(false);
  const [playedPct, setPlayedPct] = useState(34);
  const [answered, setAnswered] = useState<Record<number, string>>({});
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const answered_count = Object.keys(answered).length;

  function answer(n: number, opt: string) {
    setAnswered(a => ({ ...a, [n]: opt }));
  }

  const mins = Math.floor(1640 / 60);
  const secs = 1640 % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (isDesktop) {
    const waveHeights = Array.from({ length: 80 }, (_, i) => 20 + Math.abs(Math.sin(i * 0.7 + 1) * Math.cos(i * 0.4) * 28));

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
        {/* Header */}
        <div style={{ height: 64, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', flexShrink: 0, background: C.card } as any}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, background: C.bg2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, cursor: 'pointer' } as any}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 } as any}>
            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 2 } as any}>IELTS Listening</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink } as any}>Section 3 — Academic Discussion</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 } as any}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 } as any}>
              <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' } as any}>Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
                <div style={{ width: 160, height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                  <div style={{ height: '100%', width: `${Math.min(100, 40 + answered_count * 12)}%`, background: C.listening.c, borderRadius: 99, transition: 'width .4s' } as any} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.ink4 } as any}>{Math.min(100, 40 + answered_count * 12)}%</span>
              </div>
            </div>
            <div style={{ padding: '7px 14px', borderRadius: 10, background: '#F4F4F0' } as any}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, fontFamily: 'monospace' } as any}>{timeStr}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' } as any}>
          {/* Audio + notes */}
          <div style={{ overflow: 'auto', padding: '28px 32px', borderRight: `1px solid ${C.border}`, background: C.bg, display: 'flex', flexDirection: 'column', gap: 20 } as any}>
            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' } as any}>AUDIO TRACK</div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 18, padding: 24 } as any}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 } as any}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: C.listening.bg, color: C.listening.c, display: 'flex', alignItems: 'center', justifyContent: 'center' } as any}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: C.ink } as any}>Decline of the Bees</div>
                  <div style={{ fontSize: 12, color: C.ink4, marginTop: 2 } as any}>IELTS · 6:40 min</div>
                </div>
              </div>

              {/* Waveform */}
              <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 1.5, marginBottom: 14, overflow: 'hidden' } as any}>
                {waveHeights.map((ht, i) => {
                  const played = (i / 80) * 100 < playedPct;
                  return <div key={i} style={{ width: 4, borderRadius: 2, height: ht, background: played ? C.listening.c : C.bg3, flexShrink: 0 } as any} />;
                })}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 } as any}>
                <span style={{ fontSize: 11, color: C.ink4, fontFamily: 'monospace', width: 36 } as any}>2:16</span>
                <div
                  style={{ flex: 1, height: 4, background: C.bg3, borderRadius: 99, overflow: 'hidden', cursor: 'pointer' } as any}
                  onClick={(e: any) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setPlayedPct(Math.round(((e.clientX - rect.left) / rect.width) * 100));
                  }}
                >
                  <div style={{ height: '100%', width: playedPct + '%', background: C.listening.c, borderRadius: 99 } as any} />
                </div>
                <span style={{ fontSize: 11, color: C.ink4, fontFamily: 'monospace', width: 36, textAlign: 'right' } as any}>6:40</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 } as any}>
                <button style={{ width: 36, height: 36, borderRadius: 18, background: C.bg2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, cursor: 'pointer' } as any}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-5"/></svg>
                </button>
                <button
                  onClick={() => setPlaying(p => !p)}
                  style={{ width: 52, height: 52, borderRadius: 26, background: C.listening.c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 16px ${C.listening.c}44`, cursor: 'pointer', border: 'none' } as any}
                >
                  {playing
                    ? <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg>
                  }
                </button>
                <button style={{ width: 36, height: 36, borderRadius: 18, background: C.bg2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, cursor: 'pointer' } as any}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.49-5"/></svg>
                </button>
              </div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 18, flex: 1 } as any}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 10 } as any}>My notes</div>
              <textarea
                placeholder="Take notes as you listen…"
                style={{ width: '100%', minHeight: 120, border: 'none', outline: 'none', resize: 'none', fontSize: 13, color: C.ink2, fontFamily: "'Inter',sans-serif", lineHeight: 1.6, background: 'transparent', boxSizing: 'border-box' } as any}
              />
            </div>
          </div>

          {/* Questions */}
          <div style={{ overflow: 'auto', padding: '28px 32px', background: C.card } as any}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 } as any}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' } as any}>QUESTIONS</div>
              <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 99, background: C.listening.bg, fontSize: 11, fontWeight: 700, color: C.listening.c } as any}>
                {answered_count}/5
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 } as any}>
              {QUESTIONS.map(q => (
                <div key={q.n} style={{ padding: 16, borderRadius: 14, border: `1px solid ${answered[q.n] ? C.listening.c + '44' : C.border}`, background: answered[q.n] ? C.listening.bg : C.bg } as any}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 } as any}>
                    <div style={{ width: 22, height: 22, borderRadius: 11, background: answered[q.n] ? C.listening.c : C.bg3, color: answered[q.n] ? '#fff' : C.ink4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, flexShrink: 0 } as any}>{q.n}</div>
                    <div style={{ fontSize: 13, color: C.ink, lineHeight: 1.5 } as any}>{q.stem}</div>
                  </div>
                  {q.options ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, paddingLeft: 32 } as any}>
                      {q.options.map(opt => (
                        <button key={opt} onClick={() => answer(q.n, opt)} style={{
                          padding: '8px 12px', borderRadius: 8,
                          border: `1.5px solid ${answered[q.n] === opt ? C.listening.c : C.border}`,
                          background: answered[q.n] === opt ? C.listening.bg : 'transparent',
                          fontSize: 12.5, fontWeight: answered[q.n] === opt ? 700 : 400,
                          color: answered[q.n] === opt ? C.listening.c : C.ink,
                          textAlign: 'left', cursor: 'pointer', transition: 'all .15s',
                        } as any}>{opt}</button>
                      ))}
                    </div>
                  ) : (
                    <div style={{ paddingLeft: 32 } as any}>
                      <input
                        placeholder="Write your answer…"
                        onChange={() => answer(q.n, 'filled')}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.ink, fontFamily: "'Inter',sans-serif", outline: 'none', boxSizing: 'border-box' } as any}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 20 } as any}>
              <button onClick={() => router.push('/modules/listening/results' as any)} style={{
                width: '100%', padding: '14px 24px', borderRadius: 12,
                background: C.listening.c, color: '#fff', fontSize: 14, fontWeight: 700,
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

  // Mobile
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
      <View style={h.bar}>
        <TouchableOpacity style={h.exitBtn} onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: C.ink2 }}>✕</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={h.module}>IELTS LISTENING</Text>
          <Text style={h.title} numberOfLines={1}>Section 3 — Academic Discussion</Text>
        </View>
        <Text style={h.timer}>{timeStr}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={m.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <View style={[m.playerIcon, { backgroundColor: C.listening.bg }]}>
              <Text style={{ fontSize: 20 }}>🎧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={m.cardTitle}>Decline of the Bees</Text>
              <Text style={m.cardSub}>IELTS · 6:40 min</Text>
            </View>
          </View>
          <TouchableOpacity style={[m.playBtn, { backgroundColor: C.listening.c }]} onPress={() => setPlaying(p => !p)}>
            <Text style={m.playBtnText}>{playing ? '⏸ Pause' : '▶ Play audio'}</Text>
          </TouchableOpacity>
        </View>

        <View style={m.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={m.sectionLabel}>QUESTIONS</Text>
            <View style={[m.chip, { backgroundColor: C.listening.bg }]}>
              <Text style={[m.chipText, { color: C.listening.c }]}>{answered_count}/5</Text>
            </View>
          </View>
          {QUESTIONS.map(q => (
            <View key={q.n} style={[m.qCard, answered[q.n] && { borderColor: C.listening.c + '44', backgroundColor: C.listening.bg }]}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <View style={[m.qNum, answered[q.n] && { backgroundColor: C.listening.c }]}>
                  <Text style={[m.qNumText, answered[q.n] && { color: '#fff' }]}>{q.n}</Text>
                </View>
                <Text style={[m.qStem, { flex: 1 }]}>{q.stem}</Text>
              </View>
              {q.options ? (
                <View style={{ gap: 6, paddingLeft: 32 }}>
                  {q.options.map(opt => (
                    <TouchableOpacity key={opt} onPress={() => answer(q.n, opt)}
                      style={[m.option, answered[q.n] === opt && { borderColor: C.listening.c, backgroundColor: C.listening.bg }]}>
                      <Text style={[m.optionText, answered[q.n] === opt && { color: C.listening.c, fontFamily: 'Inter_700Bold' }]}>{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={{ paddingLeft: 32 }}>
                  <TextInput placeholder="Write your answer…" style={m.textInput} onChangeText={() => answer(q.n, 'filled')} placeholderTextColor={C.ink5} />
                </View>
              )}
            </View>
          ))}
        </View>

        <TouchableOpacity style={[m.submitBtn, { backgroundColor: C.listening.c }]} onPress={() => router.push('/modules/listening/results' as any)}>
          <Text style={m.submitText}>Submit answers</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const h = StyleSheet.create({
  bar: { height: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  exitBtn: { width: 34, height: 34, borderRadius: 9, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' },
  module: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1, textTransform: 'uppercase' },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink },
  timer: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink4 },
});

const m = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase' },
  playerIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.ink },
  cardSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink4 },
  playBtn: { borderRadius: 10, padding: 12, alignItems: 'center' },
  playBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },
  chip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  chipText: { fontFamily: 'Inter_700Bold', fontSize: 11 },
  qCard: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 12, marginBottom: 10 },
  qNum: { width: 22, height: 22, borderRadius: 11, backgroundColor: C.bg3, alignItems: 'center', justifyContent: 'center' },
  qNumText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4 },
  qStem: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink, lineHeight: 20 },
  option: { padding: 9, borderRadius: 8, borderWidth: 1.5, borderColor: C.border },
  optionText: { fontFamily: 'Inter_400Regular', fontSize: 12.5 as any, color: C.ink },
  textInput: { borderWidth: 1.5, borderColor: C.border, borderRadius: 8, padding: 9, fontSize: 13, color: C.ink, fontFamily: 'Inter_400Regular' },
  submitBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 32 },
  submitText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
});
