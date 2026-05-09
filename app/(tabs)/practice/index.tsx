/**
 * Practice hub — matches design handoff prototype page_practice.jsx
 * 4 module hero tiles + sessions table + daily mix strip
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { MicIcon, PenIcon, HeadphoneIcon, BookIcon, ChevronRightIcon, ArrowRightIcon } from '@/components/icons';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06',
};
const MOD = {
  speaking:  { c: '#5B4EFF', bg: '#EEEDFF' },
  writing:   { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
  reading:   { c: '#C04A06', bg: '#FFE5DE' },
};

const MODULES = [
  { id: 'speaking',  Icon: MicIcon,       title: 'Speaking',  sub: 'Conversation drills + AI feedback',        route: '/modules/speaking/select' },
  { id: 'writing',   Icon: PenIcon,       title: 'Writing',   sub: 'Essays graded by your exam rubric',         route: '/modules/writing/select' },
  { id: 'listening', Icon: HeadphoneIcon, title: 'Listening', sub: 'Native audio across topics',                route: '/modules/listening/select' },
  { id: 'reading',   Icon: BookIcon,      title: 'Reading',   sub: 'Passages with comprehension questions',     route: '/modules/reading/select' },
] as const;

const FILTERS = ['All', 'Speaking', 'Writing', 'Listening', 'Reading'];

const RECENT = [
  { mod: 'speaking',  title: 'IELTS Speaking Part 2',        lang: 'English',   date: 'Today, 9:00 AM',  score: '7.5/9' },
  { mod: 'writing',   title: 'Task 1 — Graph description',   lang: 'English',   date: 'Yesterday',       score: '6.5/9' },
  { mod: 'listening', title: 'Section 3 — Academic',         lang: 'English',   date: '2 days ago',      score: '32/40' },
  { mod: 'reading',   title: 'Passage 2 — Science',          lang: 'English',   date: '3 days ago',      score: '11/13' },
];

// ── Module hero tile ──────────────────────────────────────────────────────
function ModuleHero({ id, Icon, title, sub, route, isWeb }: any) {
  const { c } = MOD[id as keyof typeof MOD];

  if (isWeb) {
    return (
      <div onClick={() => router.push(route)} style={{
        textAlign: 'left', cursor: 'pointer', borderRadius: 18,
        padding: '24px 26px',
        background: `linear-gradient(135deg, ${c} 0%, ${c}cc 100%)`,
        color: '#fff', border: 'none',
        display: 'flex', flexDirection: 'column', gap: 18, minHeight: 170,
        transition: 'transform .2s, box-shadow .2s',
      } as any}
        onMouseEnter={e => {
          (e.currentTarget as any).style.transform = 'translateY(-2px)';
          (e.currentTarget as any).style.boxShadow = `0 12px 32px ${c}44`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as any).style.transform = 'none';
          (e.currentTarget as any).style.boxShadow = 'none';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ width: 42, height: 42, borderRadius: 11,
            background: 'rgba(255,255,255,.2)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color="#fff" />
          </div>
        </div>
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
            fontSize: 26, lineHeight: 1.05, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 12.5, opacity: .85 }}>{sub}</div>
        </div>
      </div>
    );
  }

  return (
    <TouchableOpacity
      style={[mh.card, { backgroundColor: c }]}
      onPress={() => router.push(route as any)}
      activeOpacity={0.88}
    >
      <View style={mh.iconWrap}><Icon size={20} color="#fff" /></View>
      <Text style={mh.title}>{title}</Text>
      <Text style={mh.sub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const mh = StyleSheet.create({
  card: { borderRadius: 18, padding: 22, gap: 10, flex: 1, minWidth: '45%' },
  iconWrap: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: '#fff', lineHeight: 26 },
  sub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,.85)' },
});

// ── Recent session row ────────────────────────────────────────────────────
function SessionRow({ item }: { item: typeof RECENT[0] }) {
  const mod = MOD[item.mod as keyof typeof MOD];
  const Icon = MODULES.find(m => m.id === item.mod)?.Icon ?? BookIcon;
  return (
    <View style={sr.row}>
      <View style={[sr.icon, { backgroundColor: mod.bg }]}>
        <Icon size={14} color={mod.c} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <Text style={sr.title} numberOfLines={1}>{item.title}</Text>
        <Text style={sr.meta}>{item.lang} · {item.date}</Text>
      </View>
      <Text style={sr.score}>{item.score}</Text>
      <ChevronRightIcon size={13} color={C.ink5} />
    </View>
  );
}
const sr = StyleSheet.create({
  row:   { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14,
    backgroundColor: C.card, borderRadius: 12,
    borderWidth: 1, borderColor: C.border },
  icon:  { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink },
  meta:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4, marginTop: 1 },
  score: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 16, color: C.ink, flexShrink: 0 },
});

// ── Main screen ──────────────────────────────────────────────────────────
export default function PracticeScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const filtered = activeFilter === 'All'
    ? RECENT
    : RECENT.filter(r => r.mod === activeFilter.toLowerCase());

  return (
    <AppLayout>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: isDesktop ? '28px 36px 48px' as any : 20, paddingBottom: 48, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Page header ── */}
          <View style={{ gap: 4, marginBottom: 4 }}>
            <Text style={s.eyebrow}>PRACTICE</Text>
            <Text style={s.pageTitle}>Pick what you'll practice today.</Text>
          </View>

          {/* ── 4 module tiles ── */}
          {isDesktop ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 } as any}>
              {MODULES.map(m => <ModuleHero key={m.id} {...m} isWeb />)}
            </div>
          ) : (
            <View style={s.modGrid}>
              {MODULES.map(m => <ModuleHero key={m.id} {...m} isWeb={false} />)}
            </View>
          )}

          {/* ── Filter chips + recent sessions ── */}
          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={s.sectionTitle}>Recent sessions</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 6, flexDirection: 'row' }}>
                {FILTERS.map(f => (
                  <TouchableOpacity key={f}
                    style={[s.chip, activeFilter === f && s.chipActive]}
                    onPress={() => setActiveFilter(f)} activeOpacity={0.8}>
                    <Text style={[s.chipText, activeFilter === f && s.chipTextActive]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {filtered.length > 0 ? (
              <View style={{ gap: 8 }}>
                {filtered.map((item, i) => <SessionRow key={i} item={item} />)}
              </View>
            ) : (
              <View style={s.empty}>
                <Text style={s.emptyText}>No sessions yet</Text>
                <Text style={s.emptySub}>Start a practice to see your results here</Text>
              </View>
            )}
          </View>

          {/* ── Daily mix strip ── */}
          <TouchableOpacity
            style={s.mixCard}
            onPress={() => router.push('/modules/listening/select' as any)}
            activeOpacity={0.88}
          >
            <View style={s.mixIcon}>
              <Text style={{ fontSize: 20 }}>✨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.mixTitle}>Daily mix · 18 min</Text>
              <Text style={s.mixSub}>
                One Speaking + one Listening + one Reading drill, picked from your weakest topics.
              </Text>
            </View>
            <View style={s.mixCta}>
              <Text style={s.mixCtaText}>Start mix</Text>
              <ArrowRightIcon size={14} color={C.brand} />
            </View>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  eyebrow:   { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.ink4,
    letterSpacing: 1.2, textTransform: 'uppercase' },
  pageTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: C.ink, lineHeight: 36 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink },

  modGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  chip: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
  },
  chipActive:     { backgroundColor: C.ink, borderColor: C.ink },
  chipText:       { fontFamily: 'Inter_500Medium', fontSize: 12, color: C.ink3 },
  chipTextActive: { color: '#fff' },

  empty: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border,
    padding: 32, alignItems: 'center', gap: 6 },
  emptyText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.ink4 },
  emptySub:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink5, textAlign: 'center' },

  mixCard: {
    backgroundColor: C.ink, borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
  },
  mixIcon: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: C.brand,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  mixTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 20, color: '#fff', lineHeight: 22, marginBottom: 4 },
  mixSub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,.7)' },
  mixCta:   { flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, flexShrink: 0 },
  mixCtaText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: C.brand },
});
