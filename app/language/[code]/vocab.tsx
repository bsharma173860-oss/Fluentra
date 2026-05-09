import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const VOCAB = [
  { word: 'Laconic',       def: 'Using very few words; brief and concise.', ex: 'His laconic reply conveyed disinterest.', level: 'C1' },
  { word: 'Ephemeral',     def: 'Lasting for a very short time.',           ex: 'The ephemeral beauty of cherry blossoms.', level: 'C1' },
  { word: 'Ubiquitous',    def: 'Present, appearing, or found everywhere.', ex: 'Smartphones are ubiquitous in modern life.', level: 'B2' },
  { word: 'Ameliorate',    def: 'To make something bad or unsatisfactory better.', ex: 'Measures to ameliorate the effects of drought.', level: 'C1' },
  { word: 'Pragmatic',     def: 'Dealing with things sensibly and realistically.', ex: 'A pragmatic approach to problem-solving.', level: 'B2' },
];

export default function VocabScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<number>>(new Set());

  const card = VOCAB[cardIdx];

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Vocabulary · {code?.toUpperCase()}</Text>
        <Text style={s.headerMeta}>{cardIdx + 1}/{VOCAB.length}</Text>
      </View>

      <View style={s.progressBar}><View style={[s.progressFill, { width: `${((cardIdx + 1) / VOCAB.length) * 100}%` as any }]} /></View>

      {/* Flashcard */}
      <TouchableOpacity style={s.card} onPress={() => setFlipped(f => !f)} activeOpacity={0.9}>
        <View style={s.levelBadge}><Text style={s.levelBadgeText}>{card.level}</Text></View>
        {!flipped ? (
          <View style={s.cardFront}>
            <Text style={s.cardWord}>{card.word}</Text>
            <Text style={s.cardHint}>Tap to see definition</Text>
          </View>
        ) : (
          <View style={s.cardBack}>
            <Text style={s.cardDef}>{card.def}</Text>
            <View style={s.cardDivider} />
            <Text style={s.cardEx}>"{card.ex}"</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Actions */}
      <View style={s.actionRow}>
        <TouchableOpacity style={s.skipBtn} onPress={() => { setCardIdx(i => Math.min(i + 1, VOCAB.length - 1)); setFlipped(false); }}>
          <Text style={s.skipBtnText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.knownBtn} onPress={() => { setKnown(k => { const n = new Set(k); n.add(cardIdx); return n; }); setCardIdx(i => Math.min(i + 1, VOCAB.length - 1)); setFlipped(false); }}>
          <Text style={s.knownBtnText}>I know this ✓</Text>
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={s.statsRow}>
        <View style={s.statCard}><Text style={s.statNum}>{known.size}</Text><Text style={s.statLabel}>Known</Text></View>
        <View style={s.statCard}><Text style={s.statNum}>{VOCAB.length - known.size}</Text><Text style={s.statLabel}>To learn</Text></View>
        <View style={s.statCard}><Text style={s.statNum}>{Math.round((known.size / VOCAB.length) * 100)}%</Text><Text style={s.statLabel}>Complete</Text></View>
      </View>

      {/* Full word list */}
      <View style={s.wordList}>
        <Text style={s.wordListTitle}>All words</Text>
        {VOCAB.map((v, i) => (
          <TouchableOpacity key={i} style={[s.wordRow, i < VOCAB.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]} onPress={() => { setCardIdx(i); setFlipped(false); }}>
            <View style={{ flex: 1 }}>
              <Text style={[s.wordRowWord, cardIdx === i && { color: T.brand }]}>{v.word}</Text>
              <Text style={s.wordRowDef} numberOfLines={1}>{v.def}</Text>
            </View>
            <View style={[s.levelBadge, { marginLeft: 8 }]}><Text style={s.levelBadgeText}>{v.level}</Text></View>
            {known.has(i) && <Text style={{ color: T.listening, marginLeft: 6, fontWeight: '700' }}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout languageCode={code}>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },
  scrollDesktop: {},
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { flex: 1, fontSize: 15, fontWeight: '700', color: T.ink },
  headerMeta: { fontSize: 12, color: T.ink4, fontWeight: '600' },
  progressBar: { height: 3, backgroundColor: T.track },
  progressFill: { height: '100%', backgroundColor: T.brand },
  card: { margin: 16, backgroundColor: T.card, borderRadius: 20, padding: 32, borderWidth: 1, borderColor: T.border, minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: 12 },
  levelBadge: { position: 'absolute', top: 14, right: 14, backgroundColor: T.bg2, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  levelBadgeText: { fontSize: 10.5, fontWeight: '700', color: T.ink4 },
  cardFront: { alignItems: 'center', gap: 12 },
  cardWord: { fontFamily: T.serif, fontSize: 38, color: T.ink, lineHeight: 44, textAlign: 'center' },
  cardHint: { fontSize: 12, color: T.ink4 },
  cardBack: { gap: 12, width: '100%' },
  cardDef: { fontSize: 16, color: T.ink, lineHeight: 24, textAlign: 'center' },
  cardDivider: { height: 1, backgroundColor: T.border },
  cardEx: { fontSize: 14, color: T.ink3, fontStyle: 'italic', textAlign: 'center', lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginBottom: 16 },
  skipBtn: { flex: 1, borderWidth: 1, borderColor: T.border, borderRadius: 12, padding: 14, alignItems: 'center', backgroundColor: T.card },
  skipBtnText: { fontSize: 14, fontWeight: '700', color: T.ink3 },
  knownBtn: { flex: 2, backgroundColor: T.listening, borderRadius: 12, padding: 14, alignItems: 'center' },
  knownBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: T.card, borderRadius: 12, padding: 14, alignItems: 'center', gap: 4, borderWidth: 1, borderColor: T.border },
  statNum: { fontFamily: T.serif, fontSize: 24, color: T.ink },
  statLabel: { fontSize: 11, color: T.ink4 },
  wordList: { backgroundColor: T.card, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: T.border },
  wordListTitle: { fontSize: 12, fontWeight: '700', color: T.ink4, padding: 14, paddingBottom: 10, letterSpacing: 0.6, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: T.border },
  wordRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 },
  wordRowWord: { fontSize: 14, fontWeight: '700', color: T.ink },
  wordRowDef: { fontSize: 12, color: T.ink4, marginTop: 2 },
});
