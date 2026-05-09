import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const QUESTIONS = [
  { n: 1, stem: 'What is the name of the museum the speaker recommends?', options: ['Natural History Museum', 'Science Museum', 'Victoria & Albert Museum', 'British Museum'] },
  { n: 2, stem: 'What time does the special exhibition open on Sundays?', options: ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'] },
  { n: 3, stem: 'How much is the student discount?', options: ['£2', '£3', '£5', '£8'] },
  { n: 4, stem: 'The tour guide suggests visitors should book ________ in advance.', options: null },
  { n: 5, stem: 'What does the speaker say about the café?', options: ['It is expensive', 'It offers a student menu', 'It closes at 4 PM', 'It requires a reservation'] },
];

export default function ListeningSessionScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.35);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [notes, setNotes] = useState('');
  const answered = Object.keys(answers).length;

  const content = (
    <View style={{ flex: 1 }}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>Listening · IELTS Academic</Text>
          <Text style={s.headerMeta}>Section 2 — Museum Audio Guide</Text>
        </View>
        <View style={[s.progressBadge, { backgroundColor: T.listeningBg }]}><Text style={[s.progressText, { color: T.listening }]}>{answered}/5</Text></View>
      </View>
      <View style={s.progressBar}><View style={[s.progressFill, { width: `${(answered / 5) * 100}%` as any, backgroundColor: T.listening }]} /></View>

      {isDesktop ? (
        <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden' }}>
          {/* Audio + notes pane */}
          <View style={s.leftPane}>
            <View style={s.audioCard}>
              <Text style={s.audioLabel}>AUDIO</Text>
              <Text style={s.audioTitle}>Section 2 — Museum Guide</Text>
              <View style={s.audioTrack}><View style={[s.audioProgress, { width: `${progress * 100}%` as any }]} /></View>
              <View style={s.audioControls}>
                <TouchableOpacity style={s.rewindBtn}><Text style={s.rewindBtnText}>-10s</Text></TouchableOpacity>
                <TouchableOpacity style={s.playBtn} onPress={() => setPlaying(p => !p)}>
                  <Text style={s.playBtnText}>{playing ? '⏸' : '▶'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.rewindBtn}><Text style={s.rewindBtnText}>+10s</Text></TouchableOpacity>
              </View>
              <Text style={s.audioTime}>1:24 / 3:58</Text>
            </View>
            <Text style={s.notesLabel}>YOUR NOTES</Text>
            <TextInput
              style={s.notesInput}
              multiline
              placeholder="Take notes as you listen…"
              placeholderTextColor={T.ink4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>
          {/* Questions pane */}
          <ScrollView style={s.rightPane} contentContainerStyle={s.rightPaneContent}>
            <Text style={s.paneTitle}>QUESTIONS 1–5</Text>
            {QUESTIONS.map(q => (
              <View key={q.n} style={s.questionBlock}>
                <View style={s.questionHeader}>
                  <View style={[s.questionNum, { backgroundColor: T.listeningBg }]}><Text style={[s.questionNumText, { color: T.listening }]}>{q.n}</Text></View>
                  <Text style={s.questionStem}>{q.stem}</Text>
                </View>
                {q.options ? (
                  <View style={s.options}>
                    {q.options.map(o => (
                      <TouchableOpacity key={o} style={[s.option, answers[q.n] === o && [s.optionSelected, { borderColor: T.listening, backgroundColor: T.listeningBg }]]} onPress={() => setAnswers(a => ({ ...a, [q.n]: o }))}>
                        <View style={[s.optionDot, answers[q.n] === o && { backgroundColor: T.listening, borderColor: T.listening }]} />
                        <Text style={[s.optionText, answers[q.n] === o && { color: T.listening, fontWeight: '600' }]}>{o}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : (
                  <TextInput style={s.gapInput} placeholder="Write your answer…" placeholderTextColor={T.ink4} value={answers[q.n] || ''} onChangeText={v => setAnswers(a => ({ ...a, [q.n]: v }))} />
                )}
              </View>
            ))}
            <TouchableOpacity style={[s.submitBtn, { backgroundColor: T.listening }]} onPress={() => router.push('/modules/listening/results' as any)}>
              <Text style={s.submitBtnText}>Submit answers</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <ScrollView contentContainerStyle={s.mobileContent}>
          {/* Audio player */}
          <View style={s.audioCard}>
            <Text style={s.audioTitle}>Section 2 — Museum Guide</Text>
            <View style={s.audioTrack}><View style={[s.audioProgress, { width: `${progress * 100}%` as any }]} /></View>
            <View style={s.audioControls}>
              <TouchableOpacity style={s.playBtn} onPress={() => setPlaying(p => !p)}>
                <Text style={s.playBtnText}>{playing ? '⏸' : '▶'}</Text>
              </TouchableOpacity>
            </View>
          </View>
          {QUESTIONS.map(q => (
            <View key={q.n} style={s.questionBlock}>
              <View style={s.questionHeader}>
                <View style={[s.questionNum, { backgroundColor: T.listeningBg }]}><Text style={[s.questionNumText, { color: T.listening }]}>{q.n}</Text></View>
                <Text style={s.questionStem}>{q.stem}</Text>
              </View>
              {q.options ? (
                <View style={s.options}>
                  {q.options.map(o => (
                    <TouchableOpacity key={o} style={[s.option, answers[q.n] === o && s.optionSelected]} onPress={() => setAnswers(a => ({ ...a, [q.n]: o }))}>
                      <View style={[s.optionDot, answers[q.n] === o && { backgroundColor: T.listening, borderColor: T.listening }]} />
                      <Text style={s.optionText}>{o}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextInput style={s.gapInput} placeholder="Write your answer…" placeholderTextColor={T.ink4} value={answers[q.n] || ''} onChangeText={v => setAnswers(a => ({ ...a, [q.n]: v }))} />
              )}
            </View>
          ))}
          <TouchableOpacity style={[s.submitBtn, { backgroundColor: T.listening }]} onPress={() => router.push('/modules/listening/results' as any)}>
            <Text style={s.submitBtnText}>Submit answers</Text>
          </TouchableOpacity>
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  headerMeta: { fontSize: 11, color: T.ink4 },
  progressBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  progressText: { fontSize: 12, fontWeight: '700' },
  progressBar: { height: 3, backgroundColor: T.track },
  progressFill: { height: '100%' },
  leftPane: { width: 320, backgroundColor: T.paper, borderRightWidth: 1, borderRightColor: T.border, padding: 24, gap: 16 },
  rightPane: { flex: 1, backgroundColor: T.card },
  rightPaneContent: { padding: 24, gap: 16 },
  paneTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  audioCard: { backgroundColor: T.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: T.border, gap: 10 },
  audioLabel: { fontSize: 10, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  audioTitle: { fontSize: 14, fontWeight: '700', color: T.ink },
  audioTrack: { height: 6, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden' },
  audioProgress: { height: '100%', backgroundColor: T.listening, borderRadius: 99 },
  audioControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14 },
  rewindBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: T.border },
  rewindBtnText: { fontSize: 12, fontWeight: '600', color: T.ink3 },
  playBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: T.listening, alignItems: 'center', justifyContent: 'center' },
  playBtnText: { color: '#fff', fontSize: 18 },
  audioTime: { fontSize: 11, color: T.ink4, textAlign: 'center' },
  notesLabel: { fontSize: 10, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  notesInput: { flex: 1, backgroundColor: T.card, borderRadius: 11, padding: 12, borderWidth: 1, borderColor: T.border, fontSize: 13, color: T.ink, minHeight: 100 },
  questionBlock: { backgroundColor: T.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, gap: 10 },
  questionHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  questionNum: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 },
  questionNumText: { fontSize: 11, fontWeight: '700' },
  questionStem: { flex: 1, fontSize: 13.5, color: T.ink, lineHeight: 20 },
  options: { gap: 8 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 9, borderWidth: 1, borderColor: T.border, backgroundColor: T.bg },
  optionSelected: { borderColor: T.listening, backgroundColor: T.listeningBg },
  optionDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: T.border },
  optionText: { fontSize: 13, color: T.ink2 },
  gapInput: { borderWidth: 1.5, borderColor: T.border, borderRadius: 9, padding: 10, fontSize: 14, color: T.ink },
  submitBtn: { borderRadius: 12, padding: 14, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  mobileContent: { padding: 16, gap: 14 },
});
