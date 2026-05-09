import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileTabBar } from '@/components/layout/MobileTabBar';

type ModuleKey = 'speaking' | 'writing' | 'listening' | 'reading';

const MODULES: { key: ModuleKey; title: string; sub: string; color: string; bg: string; sessions: number; score: number; route: string }[] = [
  { key: 'speaking',  title: 'Speaking',  sub: 'Conversation drills + AI feedback', color: T.speaking,  bg: T.speakingBg,  sessions: 142, score: 7.0, route: '/modules/speaking/session' },
  { key: 'writing',   title: 'Writing',   sub: 'Essays graded by your exam rubric',   color: T.writing,   bg: T.writingBg,   sessions: 68,  score: 6.5, route: '/modules/writing/session'   },
  { key: 'listening', title: 'Listening', sub: 'Native audio across topics',          color: T.listening, bg: T.listeningBg, sessions: 94,  score: 7.5, route: '/modules/listening/session' },
  { key: 'reading',   title: 'Reading',   sub: 'Passages with comprehension Qs',      color: T.reading,   bg: T.readingBg,   sessions: 76,  score: 7.0, route: '/modules/reading/session'   },
];

const RECENT_SESSIONS = [
  { module: 'speaking',  title: 'IELTS Speaking Part 2',       lang: 'English',  date: 'Today',      score: '7.5/9',  color: T.speaking,  bg: T.speakingBg },
  { module: 'writing',   title: 'Task 1 — Graph description',  lang: 'English',  date: 'Yesterday',  score: '6.5/9',  color: T.writing,   bg: T.writingBg  },
  { module: 'listening', title: 'Section 3 — Academic',        lang: 'English',  date: '2 days ago', score: '32/40',  color: T.listening, bg: T.listeningBg},
  { module: 'reading',   title: 'Passage 2 — Science',         lang: 'English',  date: '3 days ago', score: '11/13',  color: T.reading,   bg: T.readingBg  },
];

// Module labels for filtering
const FILTERS = ['All', 'Speaking', 'Writing', 'Listening', 'Reading'];

export default function PracticeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [filter, setFilter] = useState('All');

  const filteredSessions = RECENT_SESSIONS.filter(s => filter === 'All' || s.module === filter.toLowerCase());

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={s.pageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.eyebrow}>Practice</Text>
          <Text style={s.pageTitle}>Pick what you'll practice today.</Text>
        </View>
        <TouchableOpacity style={s.customBtn} onPress={() => router.push('/modules/speaking/session' as any)}>
          <Text style={s.customBtnText}>+ Custom session</Text>
        </TouchableOpacity>
      </View>

      {/* Module hero cards — 2x2 on mobile, 4-col on desktop */}
      <View style={isDesktop ? s.moduleGridDesktop : s.moduleGrid}>
        {MODULES.map(m => (
          <TouchableOpacity
            key={m.key}
            style={[s.moduleCard, { backgroundColor: m.color }]}
            onPress={() => router.push(m.route as any)}
            activeOpacity={0.9}
          >
            <View style={s.moduleCardTop}>
              <View style={s.moduleIconWrap}>
                <Text style={s.moduleIconText}>
                  {m.key === 'speaking' ? '🎤' : m.key === 'writing' ? '✍️' : m.key === 'listening' ? '🎧' : '📖'}
                </Text>
              </View>
              <View style={s.sessionsBadge}>
                <Text style={s.sessionsBadgeText}>{m.sessions} sessions</Text>
              </View>
            </View>
            <View style={{ marginTop: 'auto' }}>
              <Text style={s.moduleTitle}>{m.title}</Text>
              <Text style={s.moduleSub}>{m.sub}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filter row */}
      <View style={s.filterRow}>
        <Text style={s.filterLabel}>Module sessions</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.filterChip, filter === f && s.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Sessions table */}
      <View style={s.table}>
        {filteredSessions.map((row, i) => (
          <TouchableOpacity
            key={i}
            style={[s.tableRow, i < filteredSessions.length - 1 && s.tableRowBorder]}
            onPress={() => router.push(`/modules/${row.module}/results` as any)}
            activeOpacity={0.7}
          >
            <View style={[s.tableIcon, { backgroundColor: row.bg }]}>
              <Text style={[s.tableIconText, { color: row.color }]}>
                {row.module[0].toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.tableTitle} numberOfLines={1}>{row.title}</Text>
              <Text style={s.tableMeta}>{row.lang} · {row.date}</Text>
            </View>
            <Text style={s.tableScore}>{row.score}</Text>
            <Text style={s.tableArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Daily mix CTA */}
      <View style={s.mixCard}>
        <View style={s.mixIcon}>
          <Text style={{ fontSize: 20 }}>⚡</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={s.mixTitle}>Daily mix · 18 min</Text>
          <Text style={s.mixSub}>One Speaking + Listening + Reading drill, picked from your weakest topics.</Text>
        </View>
        <TouchableOpacity style={s.mixBtn} onPress={() => router.push('/modules/speaking/session' as any)}>
          <Text style={s.mixBtnText}>Start mix →</Text>
        </TouchableOpacity>
      </View>

      {/* Module cards mobile — detail cards */}
      {!isDesktop && (
        <>
          <Text style={s.sectionTitle}>By module</Text>
          <View style={s.mobileModuleGrid}>
            {MODULES.map(m => (
              <TouchableOpacity key={m.key} style={s.mobileModuleCard} onPress={() => router.push(m.route as any)} activeOpacity={0.8}>
                <View style={s.mobileModuleTop}>
                  <View style={[s.mobileModuleIcon, { backgroundColor: m.bg }]}>
                    <Text style={{ fontSize: 14 }}>
                      {m.key === 'speaking' ? '🎤' : m.key === 'writing' ? '✍️' : m.key === 'listening' ? '🎧' : '📖'}
                    </Text>
                  </View>
                  <Text style={s.mobileModuleScore}>{m.score.toFixed(1)}</Text>
                </View>
                <Text style={s.mobileModuleTitle}>{m.title}</Text>
                <Text style={s.mobileModuleSub}>{m.sub.split(' ').slice(0, 3).join(' ')}…</Text>
                <Text style={[s.mobileModuleCta, { color: m.color }]}>Continue →</Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={{ height: 20 }} />
    </ScrollView>
  );

  if (isDesktop) {
    return <AppLayout>{content}</AppLayout>;
  }

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

  pageHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: T.ink4, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 },
  pageTitle: { fontFamily: T.serif, fontSize: 30, color: T.ink, lineHeight: 36 },
  customBtn: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 10 },
  customBtnText: { fontSize: 13, fontWeight: '600', color: T.ink2 },

  // Module grid
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduleGridDesktop: { flexDirection: 'row', gap: 14 },
  moduleCard: { borderRadius: 18, padding: 22, minHeight: 160, flexDirection: 'column', gap: 14, width: '47%' },
  moduleCardTop: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  moduleIconWrap: { width: 42, height: 42, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  moduleIconText: { fontSize: 20 },
  sessionsBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 99 },
  sessionsBadgeText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  moduleTitle: { fontFamily: T.serif, fontSize: 24, color: '#fff', lineHeight: 28, marginBottom: 4 },
  moduleSub: { fontSize: 12, color: 'rgba(255,255,255,0.85)' },

  // Filters
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  filterLabel: { fontSize: 13, fontWeight: '700', color: T.ink },
  filterScroll: { flex: 1 },
  filterChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 4 },
  filterChipActive: { backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  filterChipText: { fontSize: 12, color: T.ink3 },
  filterChipTextActive: { color: T.ink, fontWeight: '700' },

  // Table
  table: { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  tableRowBorder: { borderBottomWidth: 1, borderBottomColor: T.hairline },
  tableIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tableIconText: { fontSize: 13, fontWeight: '800' },
  tableTitle: { fontSize: 13, fontWeight: '600', color: T.ink },
  tableMeta: { fontSize: 11, color: T.ink4, marginTop: 2 },
  tableScore: { fontFamily: T.serif, fontSize: 16, color: T.ink },
  tableArrow: { fontSize: 18, color: T.ink5 },

  // Daily mix
  mixCard: { backgroundColor: T.ink, borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 },
  mixIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center' },
  mixTitle: { fontFamily: T.serif, fontSize: 20, color: '#fff', lineHeight: 24, marginBottom: 4 },
  mixSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  mixBtn: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  mixBtnText: { fontSize: 13, fontWeight: '700', color: T.ink },

  // Mobile module grid
  sectionTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  mobileModuleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  mobileModuleCard: { width: '47%', backgroundColor: T.card, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: T.border, gap: 8 },
  mobileModuleTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mobileModuleIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mobileModuleScore: { fontFamily: T.serif, fontSize: 20, color: T.ink },
  mobileModuleTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  mobileModuleSub: { fontSize: 10.5, color: T.ink3 },
  mobileModuleCta: { fontSize: 10.5, fontWeight: '700' },
});
