import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Colors } from '@/constants/colors';
import { getTheme } from '@/constants/languageThemes';
import {
  getFoundation,
  type CharItem, type VocabItem, type GrammarItem,
} from '@/constants/foundationContent';
import { ChevronLeftIcon, TrophyIcon } from '@/components/icons';

export default function LessonScreen() {
  const { code, sectionId } = useLocalSearchParams<{ code: string; sectionId: string }>();
  const langCode = code ?? 'en';
  const theme    = getTheme(langCode);
  const data     = getFoundation(langCode);
  const section  = data?.sections.find(s => s.id === sectionId) ?? data?.sections[0];

  // Flatten all items across all lessons in the section into a single card list
  const allLessons = section?.lessons ?? [];
  // For card-by-card vocab mode, collect all items from all lessons
  const vocabItems = allLessons
    .filter(l => l.type === 'vocab')
    .flatMap(l => l.items as VocabItem[]);
  const charItems = allLessons
    .filter(l => l.type === 'chars' || l.type === 'tones')
    .flatMap(l => l.items as CharItem[]);
  const grammarItems = allLessons
    .filter(l => l.type === 'grammar')
    .flatMap(l => l.items as GrammarItem[]);

  // Determine primary content type from first lesson
  const primaryType = allLessons[0]?.type ?? 'chars';

  const [cardIdx, setCardIdx] = useState(0);
  const [known,   setKnown]   = useState<boolean[]>([]);

  if (!data || !section) {
    return (
      <AppLayout languageCode={langCode}>
        <SafeAreaView style={s.safe} edges={['top']}>
          <View style={s.empty}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ChevronLeftIcon size={14} color={Colors.ink2} />
            </TouchableOpacity>
            <Text style={s.emptyText}>Lesson not found.</Text>
          </View>
        </SafeAreaView>
      </AppLayout>
    );
  }

  // ── Chars / Tones — grid layout ──────────────────────────────
  if (primaryType === 'chars' || primaryType === 'tones') {
    return (
      <AppLayout languageCode={langCode}>
        <SafeAreaView style={s.safe} edges={['top']}>
          <View style={s.headerRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ChevronLeftIcon size={14} color={Colors.ink2} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{section.title}</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.gridContent}
          >
            <View style={s.grid}>
              {charItems.map((item, i) => (
                <View key={i} style={s.charCard}>
                  <Text style={[s.charBig, { color: theme.accent }]}>{item.char}</Text>
                  <Text style={s.charRoman}>{item.roman}</Text>
                  <Text style={s.charMeaning}>{item.meaning}</Text>
                </View>
              ))}
            </View>
            <View style={{ height: 48 }} />
          </ScrollView>
        </SafeAreaView>
      </AppLayout>
    );
  }

  // ── Grammar — list layout ─────────────────────────────────────
  if (primaryType === 'grammar') {
    return (
      <AppLayout languageCode={langCode}>
        <SafeAreaView style={s.safe} edges={['top']}>
          <View style={s.headerRow}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ChevronLeftIcon size={14} color={Colors.ink2} />
            </TouchableOpacity>
            <Text style={s.headerTitle}>{section.title}</Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.listContent}
          >
            {grammarItems.map((item, i) => (
              <View key={i} style={s.grammarCard}>
                <View style={[s.ruleBadge, { backgroundColor: theme.accentLight }]}>
                  <Text style={[s.ruleText, { color: theme.accent }]}>{item.rule}</Text>
                </View>
                <Text style={s.detail}>{item.detail}</Text>
                {item.examples.map((ex, j) => (
                  <View key={j} style={s.exRow}>
                    <Text style={s.exNative}>{ex.native}</Text>
                    <Text style={s.exRoman}>{ex.roman}</Text>
                    <Text style={s.exEn}>{ex.en}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={{ height: 48 }} />
          </ScrollView>
        </SafeAreaView>
      </AppLayout>
    );
  }

  // ── Vocab — card-by-card with Got it / See again ──────────────
  const totalCards = vocabItems.length;
  const current    = vocabItems[cardIdx];
  const progress   = totalCards > 0 ? ((cardIdx) / totalCards) * 100 : 0;
  const isDone     = cardIdx >= totalCards;

  function handleGotIt() {
    setKnown(prev => { const n = [...prev]; n[cardIdx] = true; return n; });
    setCardIdx(i => i + 1);
  }

  function handleSeeAgain() {
    setKnown(prev => { const n = [...prev]; n[cardIdx] = false; return n; });
    setCardIdx(i => i + 1);
  }

  return (
    <AppLayout languageCode={langCode}>
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.headerRow}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeftIcon size={14} color={Colors.ink2} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>{section.title}</Text>
          {totalCards > 0 && (
            <Text style={s.cardCounter}>{Math.min(cardIdx + 1, totalCards)}/{totalCards}</Text>
          )}
        </View>

        {/* Progress bar */}
        <View style={s.progressTrack}>
          <View style={[s.progressFill, {
            width: `${progress}%` as any,
            backgroundColor: theme.accent,
          }]} />
        </View>

        {isDone ? (
          // ── Completion screen
          <View style={s.doneWrap}>
            <TrophyIcon size={52} color={Colors.gold} />
            <Text style={s.doneTitle}>Section complete!</Text>
            <Text style={s.doneSub}>
              {known.filter(Boolean).length} of {totalCards} marked as known
            </Text>
            <TouchableOpacity
              style={[s.doneBtn, { backgroundColor: theme.accent }]}
              onPress={() => router.back()}
              activeOpacity={0.85}
            >
              <Text style={s.doneBtnText}>Back to sections</Text>
            </TouchableOpacity>
          </View>
        ) : current ? (
          // ── Single vocab card
          <View style={s.vocabWrap}>
            <View style={s.vocabCard}>
              <Text style={[s.vocabNative, { color: theme.accent }]}>
                {current.word}
              </Text>
              {!!current.roman && (
                <Text style={s.vocabRoman}>{current.roman}</Text>
              )}
              <Text style={s.vocabEn}>{current.meaning}</Text>
            </View>

            <View style={s.vocabActions}>
              <TouchableOpacity
                style={[s.gotItBtn, { backgroundColor: theme.accent }]}
                onPress={handleGotIt}
                activeOpacity={0.85}
              >
                <Text style={s.gotItText}>Got it</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.seeAgainBtn}
                onPress={handleSeeAgain}
                activeOpacity={0.85}
              >
                <Text style={s.seeAgainText}>See again</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  backBtn: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink,
  },
  cardCounter: {
    fontFamily: 'Inter_400Regular', fontSize: 13, color: '#999',
  },

  progressTrack: {
    height: 3,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 0,
  },
  progressFill: {
    height: '100%', borderRadius: 2,
  },

  // ── Chars grid ──
  gridContent: { paddingHorizontal: 16, paddingTop: 20 },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 10, justifyContent: 'flex-start',
  },
  charCard: {
    width: '31%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  charBig:     { fontSize: 40, lineHeight: 48, fontFamily: 'Inter_700Bold' },
  charRoman:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#999', marginTop: 4, textAlign: 'center' },
  charMeaning: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#BBB', marginTop: 2, textAlign: 'center' },

  // ── Grammar list ──
  listContent: { paddingHorizontal: 20, paddingTop: 20 },
  grammarCard: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 18,
    marginBottom: 10,
    gap: 10,
  },
  ruleBadge:  { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  ruleText:   { fontFamily: 'Inter_700Bold', fontSize: 14 },
  detail:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  exRow:      { backgroundColor: '#F9F9F9', borderRadius: 10, padding: 14, gap: 3 },
  exNative:   { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  exRoman:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888' },
  exEn:       { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary },

  // ── Vocab card-by-card ──
  vocabWrap: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  vocabCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
    marginBottom: 24,
  },
  vocabNative:  { fontFamily: 'Inter_700Bold', fontSize: 32, textAlign: 'center' },
  vocabRoman:   { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#999', textAlign: 'center' },
  vocabEn:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', textAlign: 'center' },

  vocabActions: { flexDirection: 'row', gap: 12 },
  gotItBtn: {
    flex: 1, height: 50, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  gotItText:     { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#FFF' },
  seeAgainBtn: {
    flex: 1, height: 50, borderRadius: 10,
    backgroundColor: '#F4F4F0',
    alignItems: 'center', justifyContent: 'center',
  },
  seeAgainText:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#666' },

  // ── Done screen ──
  doneWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 40, gap: 12,
  },
  doneTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.ink, textAlign: 'center' },
  doneSub:   { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.textSecondary, textAlign: 'center' },
  doneBtn: {
    marginTop: 16, height: 48, borderRadius: 12,
    paddingHorizontal: 32,
    alignItems: 'center', justifyContent: 'center',
  },
  doneBtnText: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#FFF' },

  // ── Fallback ──
  empty: { flex: 1, padding: 20, gap: 16 },
  emptyText: {
    fontFamily: 'Inter_400Regular', fontSize: 15,
    color: Colors.textSecondary, textAlign: 'center',
  },
});
