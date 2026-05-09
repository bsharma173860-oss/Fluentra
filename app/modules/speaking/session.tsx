/**
 * Speaking session — matches page_sessions.jsx SpeakingSession
 * Left: part selector + live scores. Right: prompt + recording UI.
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06',
  speaking: { c: '#5B4EFF', bg: '#EEEDFF' },
};

const PARTS = [
  { n: 1, label: 'Part 1', desc: 'Interview — personal topics', prompt: 'The examiner will ask you about yourself and familiar topics.\n\nTell me about your hometown. What do you like most about where you grew up, and has it changed much since your childhood?' },
  { n: 2, label: 'Part 2', desc: 'Long turn — 2-min monologue', prompt: 'Describe a place you visited recently that left a strong impression on you.\n\nYou should say:\n• where the place is\n• when you visited\n• what you did there\n• and explain why it left such an impression on you.' },
  { n: 3, label: 'Part 3', desc: 'Discussion — abstract ideas', prompt: 'We\'ve been talking about memorable places. Now I\'d like to discuss some wider issues related to this.\n\nHow does tourism affect the cultural identity of popular travel destinations? Do you think the economic benefits outweigh the cultural costs?' },
];

const SCORES = [
  { l: 'Fluency', v: '7.0' },
  { l: 'Lexical', v: '7.5' },
  { l: 'Grammar', v: '6.5' },
  { l: 'Pronunc.', v: '7.0' },
];

type Phase = 'prep' | 'recording' | 'done';

export default function SpeakingSession() {
  const [phase, setPhase] = useState<Phase>('prep');
  const [partIdx, setPartIdx] = useState(1);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const part = PARTS[partIdx - 1];

  const mins = Math.floor(820 / 60);
  const secs = 820 % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  function goNext() {
    if (partIdx < 3) { setPartIdx(p => p + 1); setPhase('prep'); }
    else router.push('/modules/speaking/results' as any);
  }

  if (isDesktop) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
        {/* Header */}
        <div style={{ height: 64, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 16, padding: '0 28px', flexShrink: 0, background: C.card } as any}>
          <button onClick={() => router.back()} style={{ width: 36, height: 36, borderRadius: 10, background: C.bg2, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink2, cursor: 'pointer' } as any}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 } as any}>
            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 2 } as any}>IELTS Speaking</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink } as any}>IELTS Speaking — AI Examiner</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 } as any}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 } as any}>
              <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' } as any}>Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
                <div style={{ width: 160, height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                  <div style={{ height: '100%', width: `${(partIdx - 1) * 33 + 20}%`, background: C.speaking.c, borderRadius: 99, transition: 'width .4s' } as any} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.ink4 } as any}>{(partIdx - 1) * 33 + 20}%</span>
              </div>
            </div>
            <div style={{ padding: '7px 14px', borderRadius: 10, background: '#F4F4F0' } as any}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, fontFamily: 'monospace' } as any}>{timeStr}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr', overflow: 'hidden' } as any}>
          {/* Part selector sidebar */}
          <div style={{ borderRight: `1px solid ${C.border}`, padding: '24px 20px', background: C.bg, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' } as any}>
            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 } as any}>SECTIONS</div>
            {PARTS.map(p => (
              <button key={p.n} onClick={() => { setPartIdx(p.n); setPhase('prep'); }}
                style={{
                  padding: '12px 14px', borderRadius: 12,
                  border: `1px solid ${partIdx === p.n ? C.speaking.c + '44' : C.border}`,
                  background: partIdx === p.n ? C.speaking.bg : C.card,
                  textAlign: 'left', cursor: 'pointer',
                } as any}>
                <div style={{ fontSize: 11, color: partIdx === p.n ? C.speaking.c : C.ink4, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 3 } as any}>{p.label}</div>
                <div style={{ fontSize: 11.5, color: partIdx === p.n ? C.speaking.c : C.ink3 } as any}>{p.desc}</div>
              </button>
            ))}

            <div style={{ height: 1, background: C.border, margin: '10px 0' } as any} />
            <div style={{ fontSize: 12, color: C.ink4, fontWeight: 600, marginBottom: 6 } as any}>Scores so far</div>
            {SCORES.map(r => (
              <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 } as any}>
                <span style={{ color: C.ink3 } as any}>{r.l}</span>
                <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 14, color: C.speaking.c } as any}>{r.v}</span>
              </div>
            ))}
          </div>

          {/* Main */}
          <div style={{ overflow: 'auto', padding: '32px 40px', background: C.card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } as any}>
            <div style={{ width: '100%', maxWidth: 560 } as any}>
              <div style={{ display: 'inline-flex', alignItems: 'center', padding: '4px 10px', borderRadius: 99, background: C.speaking.bg, fontSize: 11, fontWeight: 700, color: C.speaking.c, marginBottom: 20 } as any}>
                {part.label}
              </div>

              {/* Prompt card */}
              <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 18, padding: 28, marginBottom: 28 } as any}>
                <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 } as any}>QUESTION</div>
                <div style={{ fontSize: 16, color: C.ink, lineHeight: 1.65, whiteSpace: 'pre-line', fontFamily: "Georgia, serif" } as any}>{part.prompt}</div>
              </div>

              {phase === 'prep' && (
                <div style={{ textAlign: 'center' } as any}>
                  <div style={{ fontSize: 13, color: C.ink3, marginBottom: 20 } as any}>Take a moment to gather your thoughts, then begin recording.</div>
                  <button onClick={() => setPhase('recording')} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '13px 28px', borderRadius: 12, background: C.speaking.c,
                    color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer',
                  } as any}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
                    Start recording
                  </button>
                </div>
              )}

              {phase === 'recording' && (
                <div style={{ textAlign: 'center' } as any}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16, color: C.brand } as any}>
                    <span style={{ width: 8, height: 8, borderRadius: 4, background: C.brand, display: 'inline-block', animation: 'pulse 1s infinite' } as any} />
                    <span style={{ fontSize: 13, fontWeight: 700 } as any}>Recording…</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 48, marginBottom: 20 } as any}>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} style={{ width: 5, borderRadius: 3, background: C.speaking.c, height: 8 + Math.abs(Math.sin(i * 0.8) * 28), opacity: 0.7 + Math.sin(i * 0.5) * 0.3 } as any} />
                    ))}
                  </div>
                  <button onClick={() => setPhase('done')} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '11px 24px', borderRadius: 12, background: 'transparent',
                    color: C.speaking.c, fontSize: 14, fontWeight: 700,
                    border: `1.5px solid ${C.speaking.c}`, cursor: 'pointer',
                  } as any}>
                    Stop recording
                  </button>
                </div>
              )}

              {phase === 'done' && (
                <div style={{ background: C.speaking.bg, border: `1px solid ${C.speaking.c}33`, borderRadius: 16, padding: 24 } as any}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.speaking.c, marginBottom: 12 } as any}>AI Feedback</div>
                  <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.65, marginBottom: 18 } as any}>
                    Good response — clear structure and confident delivery. Your use of linking phrases was effective, though some hesitation was noted at complex points. Aim to expand your vocabulary range further.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 } as any}>
                    {SCORES.map(r => (
                      <div key={r.l} style={{ background: C.card, borderRadius: 10, padding: '10px 14px' } as any}>
                        <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 4 } as any}>{r.l}</div>
                        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: C.speaking.c } as any}>{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <button onClick={goNext} style={{
                    width: '100%', padding: '13px 24px', borderRadius: 12,
                    background: C.speaking.c, color: '#fff', fontSize: 14, fontWeight: 700,
                    border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  } as any}>
                    {partIdx < 3 ? `Continue to Part ${partIdx + 1}` : 'Finish & see results'}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>
              )}
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
          <Text style={h.module}>IELTS SPEAKING</Text>
          <Text style={h.title} numberOfLines={1}>{part.label} — {part.desc}</Text>
        </View>
        <Text style={h.timer}>{timeStr}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Part nav */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {PARTS.map(p => (
            <TouchableOpacity key={p.n} style={[m.partBtn, partIdx === p.n && { backgroundColor: C.speaking.bg, borderColor: C.speaking.c }]}
              onPress={() => { setPartIdx(p.n); setPhase('prep'); }}>
              <Text style={[m.partBtnText, partIdx === p.n && { color: C.speaking.c }]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Prompt */}
        <View style={m.card}>
          <Text style={m.sectionLabel}>QUESTION</Text>
          <Text style={m.prompt}>{part.prompt}</Text>
        </View>

        {/* Phase UI */}
        {phase === 'prep' && (
          <View style={m.centred}>
            <Text style={m.hint}>Take a moment to gather your thoughts.</Text>
            <TouchableOpacity style={[m.bigBtn, { backgroundColor: C.speaking.c }]} onPress={() => setPhase('recording')}>
              <Text style={m.bigBtnText}>🎙 Start recording</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'recording' && (
          <View style={m.centred}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <View style={[m.recDot, { backgroundColor: C.brand }]} />
              <Text style={[m.hint, { color: C.brand, fontFamily: 'Inter_700Bold' }]}>Recording…</Text>
            </View>
            <TouchableOpacity style={[m.bigBtn, { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: C.speaking.c }]} onPress={() => setPhase('done')}>
              <Text style={[m.bigBtnText, { color: C.speaking.c }]}>Stop recording</Text>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'done' && (
          <View style={[m.card, { backgroundColor: C.speaking.bg, borderColor: C.speaking.c + '33' }]}>
            <Text style={[m.sectionLabel, { color: C.speaking.c }]}>AI FEEDBACK</Text>
            <Text style={m.feedbackBody}>
              Good response — clear structure and confident delivery. Your use of linking phrases was effective, though some hesitation was noted at complex points.
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
              {SCORES.map(r => (
                <View key={r.l} style={[m.scoreCard, { backgroundColor: C.card }]}>
                  <Text style={m.scoreLabel}>{r.l}</Text>
                  <Text style={[m.scoreVal, { color: C.speaking.c }]}>{r.v}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={[m.bigBtn, { backgroundColor: C.speaking.c, marginTop: 16 }]} onPress={goNext}>
              <Text style={m.bigBtnText}>{partIdx < 3 ? `Continue to Part ${partIdx + 1}` : 'Finish & see results'}</Text>
            </TouchableOpacity>
          </View>
        )}
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
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  partBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', backgroundColor: C.card },
  partBtnText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: C.ink3 },
  prompt: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink, lineHeight: 24 },
  centred: { alignItems: 'center', gap: 12, padding: 20 },
  hint: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink3, textAlign: 'center' },
  recDot: { width: 8, height: 8, borderRadius: 4 },
  bigBtn: { borderRadius: 12, paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', minWidth: 180 },
  bigBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
  feedbackBody: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink, lineHeight: 20 },
  scoreCard: { borderRadius: 10, padding: 10, minWidth: 80 },
  scoreLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  scoreVal: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, lineHeight: 24 },
});
