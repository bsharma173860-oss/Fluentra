import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const RESULTS = [
  { type: 'article',  title: 'Present Perfect vs Simple Past',  tag: 'Grammar',  tagColor: T.writing,  tagBg: T.writingBg,  route: '/library' },
  { type: 'session',  title: 'IELTS Speaking Part 2 Practice',   tag: 'Speaking', tagColor: T.speaking, tagBg: T.speakingBg, route: '/modules/speaking/session' },
  { type: 'article',  title: 'Mastering Conditional Sentences',  tag: 'Grammar',  tagColor: T.writing,  tagBg: T.writingBg,  route: '/library' },
  { type: 'vocab',    title: '50 Essential IELTS Academic Words', tag: 'Vocab',   tagColor: T.brand,    tagBg: T.brandLight, route: '/language/en/vocab' },
  { type: 'session',  title: 'Reading Passage — Biodiversity',   tag: 'Reading',  tagColor: T.reading,  tagBg: T.readingBg,  route: '/modules/reading/session' },
];

const QUICK = [
  { label: 'IELTS Speaking',  route: '/modules/speaking/session' },
  { label: 'Grammar hub',     route: '/language/en/grammar' },
  { label: 'Vocab flashcards',route: '/language/en/vocab' },
  { label: 'Mock test',       route: '/modules/reading/session' },
  { label: 'Progress',        route: '/(tabs)/progress' },
];

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [query, setQuery] = useState('');

  const filtered = query.length > 0
    ? RESULTS.filter(r => r.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <View style={s.searchBox}>
          <Text style={s.searchIcon}>🔍</Text>
          <TextInput
            style={s.searchInput}
            placeholder="Search lessons, phrases, grammar…"
            placeholderTextColor={T.ink4}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}><Text style={s.clearBtn}>✕</Text></TouchableOpacity>
          )}
        </View>
        <View style={s.cmdBadge}><Text style={s.cmdBadgeText}>⌘K</Text></View>
      </View>

      {query.length === 0 ? (
        <View style={s.quickSection}>
          <Text style={s.quickTitle}>QUICK LINKS</Text>
          <View style={s.quickList}>
            {QUICK.map((q, i) => (
              <TouchableOpacity key={i} style={[s.quickItem, i < QUICK.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]} onPress={() => router.push(q.route as any)}>
                <Text style={s.quickItemText}>{q.label}</Text>
                <Text style={s.quickArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={s.resultsSection}>
          {filtered.length === 0 ? (
            <View style={s.emptyState}>
              <Text style={s.emptyEmoji}>🔍</Text>
              <Text style={s.emptyTitle}>No results for "{query}"</Text>
              <Text style={s.emptySub}>Try a different keyword like "speaking", "grammar", or "IELTS".</Text>
            </View>
          ) : (
            <>
              <Text style={s.resultsCount}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</Text>
              <View style={s.resultsList}>
                {filtered.map((r, i) => (
                  <TouchableOpacity key={i} style={[s.resultItem, i < filtered.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]} onPress={() => router.push(r.route as any)}>
                    <View style={[s.resultTag, { backgroundColor: r.tagBg }]}>
                      <Text style={[s.resultTagText, { color: r.tagColor }]}>{r.tag}</Text>
                    </View>
                    <Text style={s.resultTitle}>{r.title}</Text>
                    <Text style={s.resultArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: T.card, borderRadius: 11, borderWidth: 1, borderColor: T.border, paddingHorizontal: 12, gap: 8 },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, paddingVertical: 10, fontSize: 14, color: T.ink },
  clearBtn: { fontSize: 14, color: T.ink4 },
  cmdBadge: { backgroundColor: T.bg2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: T.border },
  cmdBadgeText: { fontSize: 10.5, fontWeight: '600', color: T.ink4 },

  quickSection: { padding: 16, gap: 10 },
  quickTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  quickList: { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  quickItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  quickItemText: { fontSize: 14, color: T.ink },
  quickArrow: { fontSize: 18, color: T.ink5 },

  resultsSection: { padding: 16, gap: 10 },
  resultsCount: { fontSize: 12, color: T.ink4 },
  resultsList: { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  resultItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  resultTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexShrink: 0 },
  resultTagText: { fontSize: 10.5, fontWeight: '700' },
  resultTitle: { flex: 1, fontSize: 14, color: T.ink, fontWeight: '500' },
  resultArrow: { fontSize: 18, color: T.ink5 },

  emptyState: { alignItems: 'center', padding: 40, gap: 10 },
  emptyEmoji: { fontSize: 36 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: T.ink, textAlign: 'center' },
  emptySub: { fontSize: 13, color: T.ink3, textAlign: 'center', lineHeight: 18 },
});
