/**
 * Writing session — matches page_sessions.jsx WritingSession
 * Left: prompt + task switcher + chart + AI tips. Right: textarea + word count.
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
  writing: { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
};

const TASK1_TIPS = [
  'Begin with an overview sentence describing the main trend.',
  'Avoid copying the question — paraphrase it in your introduction.',
  'Group data points logically — do not describe every value.',
];

const TASK2_TIPS = [
  'State your position clearly in the introduction.',
  'Each body paragraph should have one main idea with support.',
  'Write a conclusion that doesn\'t introduce new information.',
];

const CHART_DATA = [[2005, 120], [2008, 145], [2011, 185], [2014, 210], [2017, 240], [2020, 195]] as const;

export default function WritingSession() {
  const [task, setTask] = useState<'task1' | 'task2'>('task2');
  const [text, setText] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const TARGET = task === 'task1' ? 150 : 250;
  const pct = Math.min(100, (wordCount / TARGET) * 100);
  const timeLeft = task === 'task1' ? 1180 : 2380;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  function handleChange(val: string) {
    setText(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
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
            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 2 } as any}>IELTS Writing</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink } as any}>
              {task === 'task1' ? 'Task 1 — Graph description' : 'Task 2 — Essay'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 } as any}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 } as any}>
              <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase' } as any}>Progress</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 } as any}>
                <div style={{ width: 160, height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                  <div style={{ height: '100%', width: `${pct}%`, background: wordCount >= TARGET ? C.listening.c : C.writing.c, borderRadius: 99, transition: 'width .3s' } as any} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: C.ink4 } as any}>{Math.round(pct)}%</span>
              </div>
            </div>
            <div style={{ padding: '7px 14px', borderRadius: 10, background: '#F4F4F0' } as any}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, fontFamily: 'monospace' } as any}>{timeStr}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden' } as any}>
          {/* Prompt panel */}
          <div style={{ overflow: 'auto', padding: '28px 32px', borderRight: `1px solid ${C.border}`, background: C.bg, display: 'flex', flexDirection: 'column', gap: 20 } as any}>
            {/* Task switcher */}
            <div style={{ display: 'flex', gap: 8 } as any}>
              {(['task1', 'task2'] as const).map(t => (
                <button key={t} onClick={() => { setTask(t); setText(''); setWordCount(0); }} style={{
                  padding: '7px 16px', borderRadius: 9,
                  border: `1.5px solid ${task === t ? C.writing.c : C.border}`,
                  background: task === t ? C.writing.bg : C.card,
                  fontSize: 12.5, fontWeight: 700,
                  color: task === t ? C.writing.c : C.ink2,
                  cursor: 'pointer',
                } as any}>{t === 'task1' ? 'Task 1' : 'Task 2'}</button>
              ))}
            </div>

            <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' } as any}>
              {task === 'task1' ? 'TASK 1 · 20 MIN · 150 WORDS MIN' : 'TASK 2 · 40 MIN · 250 WORDS MIN'}
            </div>

            {task === 'task1' ? (
              <>
                <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, fontFamily: "Georgia,serif" } as any}>
                  The bar chart shows the number of international students enrolled in UK universities between 2005 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
                </div>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 } as any}>
                  <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 } as any}>CHART</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 } as any}>
                    {CHART_DATA.map(([yr, v]) => (
                      <div key={yr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 } as any}>
                        <div style={{ width: '100%', background: C.writing.c, borderRadius: '5px 5px 0 0', height: (v / 240) * 100 + '%', opacity: 0.8 } as any} />
                        <div style={{ fontSize: 10, color: C.ink4, fontWeight: 600 } as any}>{yr}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14, color: C.ink, lineHeight: 1.65, fontFamily: "Georgia,serif" } as any}>
                <strong>Write about the following topic:</strong><br /><br />
                <em>Some people believe that technology has made our lives overly complicated. Others argue that it has made life easier and more convenient.</em><br /><br />
                Discuss both views and give your own opinion. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.
              </div>
            )}

            {/* AI tips */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 } as any}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.writing.c, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 10 } as any}>AI TIPS</div>
              {(task === 'task1' ? TASK1_TIPS : TASK2_TIPS).map(t => (
                <div key={t} style={{ display: 'flex', gap: 8, marginBottom: 7, fontSize: 12.5, color: C.ink2 } as any}>
                  <span style={{ color: C.writing.c, flexShrink: 0 }}>→</span> {t}
                </div>
              ))}
            </div>
          </div>

          {/* Writing area */}
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', background: C.card } as any}>
            <div style={{ flex: 1, position: 'relative' } as any}>
              <textarea
                value={text}
                onChange={(e: any) => handleChange(e.target.value)}
                placeholder={task === 'task1'
                  ? 'The bar chart illustrates the trend in international students studying in the UK from 2005 to 2020…'
                  : 'In today\'s increasingly connected world, technology has transformed the way people communicate and maintain relationships…'
                }
                style={{
                  width: '100%', height: '100%',
                  border: 'none', outline: 'none', resize: 'none',
                  padding: '28px 32px',
                  fontSize: 14.5, lineHeight: 1.8, color: C.ink,
                  fontFamily: "Georgia,'DM Serif Display',serif",
                  background: 'transparent', boxSizing: 'border-box',
                } as any}
              />
            </div>

            {/* Bottom bar */}
            <div style={{ height: 56, borderTop: `1px solid ${C.border}`, padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexShrink: 0 } as any}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 } as any}>
                <div style={{ fontSize: 13, fontWeight: 600, color: wordCount >= TARGET ? C.listening.c : C.ink } as any}>
                  {wordCount} / {TARGET} words
                </div>
                <div style={{ width: 100, height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                  <div style={{ height: '100%', width: pct + '%', background: wordCount >= TARGET ? C.listening.c : C.writing.c, borderRadius: 99, transition: 'width .3s' } as any} />
                </div>
                {wordCount < TARGET
                  ? <div style={{ fontSize: 11, color: C.ink4 } as any}>{TARGET - wordCount} more to go</div>
                  : <div style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 99, background: C.listening.bg, fontSize: 10, fontWeight: 700, color: C.listening.c } as any}>Min. reached ✓</div>
                }
              </div>
              <div style={{ display: 'flex', gap: 8 } as any}>
                <button style={{ padding: '8px 14px', borderRadius: 9, border: `1.5px solid ${C.writing.c}`, background: 'transparent', color: C.writing.c, fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 } as any}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Get AI feedback
                </button>
                <button onClick={() => router.push('/modules/writing/results' as any)} style={{ padding: '8px 14px', borderRadius: 9, border: 'none', background: C.writing.c, color: '#fff', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 } as any}>
                  Submit essay
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
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
          <Text style={h.module}>IELTS WRITING</Text>
          <Text style={h.title} numberOfLines={1}>{task === 'task1' ? 'Task 1 — Graph' : 'Task 2 — Essay'}</Text>
        </View>
        <Text style={h.timer}>{timeStr}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Task switcher */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {(['task1', 'task2'] as const).map(t => (
            <TouchableOpacity key={t} style={[m.taskBtn, task === t && { backgroundColor: C.writing.bg, borderColor: C.writing.c }]}
              onPress={() => { setTask(t); setText(''); setWordCount(0); }}>
              <Text style={[m.taskBtnText, task === t && { color: C.writing.c }]}>{t === 'task1' ? 'Task 1' : 'Task 2'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Prompt */}
        <View style={m.card}>
          <Text style={m.sectionLabel}>{task === 'task1' ? 'TASK 1 · 150 WORDS MIN' : 'TASK 2 · 250 WORDS MIN'}</Text>
          <Text style={m.promptText}>
            {task === 'task1'
              ? 'The bar chart shows international students enrolled in UK universities 2005–2020. Summarise the information by selecting and reporting the main features.'
              : 'Some people believe technology has made our lives overly complicated. Others argue it has made life easier. Discuss both views and give your own opinion.'
            }
          </Text>
        </View>

        {/* Writing area */}
        <View style={m.card}>
          <Text style={m.sectionLabel}>YOUR RESPONSE</Text>
          <TextInput
            multiline
            value={text}
            onChangeText={handleChange}
            placeholder={task === 'task1' ? 'The bar chart illustrates…' : 'In today\'s increasingly connected world…'}
            style={m.textarea}
            placeholderTextColor={C.ink5}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <Text style={[m.wordCount, wordCount >= TARGET && { color: C.listening.c }]}>
              {wordCount}/{TARGET} words
            </Text>
            <View style={m.progressTrack}>
              <View style={[m.progressFill, { width: `${pct}%` as any, backgroundColor: wordCount >= TARGET ? C.listening.c : C.writing.c }]} />
            </View>
            {wordCount >= TARGET && (
              <View style={[m.chip, { backgroundColor: C.listening.bg }]}>
                <Text style={[m.chipText, { color: C.listening.c }]}>✓</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity style={[m.submitBtn, { backgroundColor: C.writing.c }]} onPress={() => router.push('/modules/writing/results' as any)}>
          <Text style={m.submitText}>Submit essay</Text>
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
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  taskBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', backgroundColor: C.card },
  taskBtnText: { fontFamily: 'Inter_700Bold', fontSize: 12.5, color: C.ink3 },
  promptText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink, lineHeight: 22 },
  textarea: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink, lineHeight: 24, minHeight: 200, textAlignVertical: 'top' },
  wordCount: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.ink },
  progressTrack: { flex: 1, height: 4, backgroundColor: C.bg3, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
  chip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  chipText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  submitBtn: { borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 32 },
  submitText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
});
