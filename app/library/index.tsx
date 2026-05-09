import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

const ARTICLES = [
  { title: 'The Psychology of Language Learning', tag: 'Reading', tagColor: T.reading, tagBg: T.readingBg, mins: 8, level: 'B2', flag: '🇬🇧' },
  { title: 'Mastering Spanish Subjunctive',        tag: 'Grammar',  tagColor: T.writing,  tagBg: T.writingBg,  mins: 6, level: 'B2', flag: '🇪🇸' },
  { title: 'IELTS Listening: Section 4 Strategies',tag: 'Listening',tagColor: T.listening,tagBg: T.listeningBg,mins: 5, level: 'C1', flag: '🇬🇧' },
  { title: '50 Essential Japanese N4 Kanji',        tag: 'Vocab',    tagColor: T.speaking, tagBg: T.speakingBg, mins: 10,level: 'N4', flag: '🇯🇵' },
  { title: 'French Conditional Tense Deep Dive',    tag: 'Grammar',  tagColor: T.writing,  tagBg: T.writingBg,  mins: 7, level: 'B1', flag: '🇫🇷' },
  { title: 'Academic Vocabulary for IELTS',         tag: 'Vocab',    tagColor: T.brand,    tagBg: T.brandLight, mins: 9, level: 'B2', flag: '🇬🇧' },
];

const FILTERS = ['All', 'Reading', 'Listening', 'Grammar', 'Vocab', 'Speaking'];

export default function LibraryScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [filter, setFilter] = useState('All');
  const filtered = ARTICLES.filter(a => filter === 'All' || a.tag === filter);

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.pageHeader}>
        <Text style={s.eyebrow}>Library</Text>
        <Text style={s.pageTitle}>Learn between sessions.</Text>
        <Text style={s.pageSub}>Curated articles, grammar guides, and vocab packs.</Text>
      </View>

      {/* Continue reading */}
      <View style={s.continueCard}>
        <Text style={s.continueEyebrow}>CONTINUE READING</Text>
        <Text style={s.continueTitle}>The Psychology of Language Learning</Text>
        <View style={s.continueProgress}><View style={[s.continueFill, { width: '60%' }]} /></View>
        <Text style={s.continueMeta}>60% · 3 min left</Text>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll} contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Articles */}
      <View style={isDesktop ? s.articleGridDesktop : s.articleGrid}>
        {filtered.map((a, i) => (
          <TouchableOpacity key={i} style={s.articleCard} onPress={() => {}} activeOpacity={0.8}>
            <View style={s.articleTop}>
              <View style={[s.articleTagBadge, { backgroundColor: a.tagBg }]}>
                <Text style={[s.articleTagText, { color: a.tagColor }]}>{a.tag}</Text>
              </View>
              <Text style={s.articleFlag}>{a.flag}</Text>
            </View>
            <Text style={s.articleTitle}>{a.title}</Text>
            <View style={s.articleMeta}>
              <Text style={s.articleMetaText}>{a.mins} min · {a.level}</Text>
              <Text style={[s.articleCta, { color: a.tagColor }]}>Read →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {content}
      <MobileTabBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 18, gap: 18, paddingBottom: 20 },
  scrollDesktop: { padding: 28, paddingHorizontal: 36 },

  pageHeader: { gap: 6 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: T.ink4, letterSpacing: 1.4, textTransform: 'uppercase' },
  pageTitle: { fontFamily: T.serif, fontSize: 34, color: T.ink, lineHeight: 38 },
  pageSub: { fontSize: 14, color: T.ink3, lineHeight: 20 },

  continueCard: { backgroundColor: T.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: T.border, gap: 10 },
  continueEyebrow: { fontSize: 10, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  continueTitle: { fontFamily: T.serif, fontSize: 20, color: T.ink, lineHeight: 26 },
  continueProgress: { height: 5, backgroundColor: T.bg3, borderRadius: 99, overflow: 'hidden' },
  continueFill: { height: '100%', backgroundColor: T.brand, borderRadius: 99 },
  continueMeta: { fontSize: 12, color: T.ink4 },

  filterScroll: { flexGrow: 0 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  filterChipActive: { backgroundColor: T.ink, borderColor: T.ink },
  filterChipText: { fontSize: 12, fontWeight: '600', color: T.ink3 },
  filterChipTextActive: { color: '#fff' },

  articleGrid: { gap: 12 },
  articleGridDesktop: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },

  articleCard: { backgroundColor: T.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: T.border, gap: 10 },
  articleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  articleTagBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 6 },
  articleTagText: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.4 },
  articleFlag: { fontSize: 20 },
  articleTitle: { fontFamily: T.serif, fontSize: 18, color: T.ink, lineHeight: 24 },
  articleMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  articleMetaText: { fontSize: 12, color: T.ink4 },
  articleCta: { fontSize: 12.5, fontWeight: '700' },
});
