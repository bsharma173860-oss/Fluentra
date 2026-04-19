import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { getAllLibraryItems, type LibraryItem } from '@/constants/dailyContent';
import { BookIcon, HeadphoneIcon, PenIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';

// ── Filter types ──────────────────────────────────────────────────
type FilterTab = 'all' | 'reading' | 'listening' | 'writing';

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',       label: 'All'       },
  { id: 'reading',   label: 'Reading'   },
  { id: 'listening', label: 'Listening' },
  { id: 'writing',   label: 'Writing'   },
];

const MODULE_META: Record<
  LibraryItem['module'],
  { label: string; color: string; bg: string; filterTab: FilterTab; route: string }
> = {
  reading:       { label: 'Reading',        color: Colors.blue,   bg: Colors.blue_bg,   filterTab: 'reading',   route: '/modules/reading/select'   },
  listening:     { label: 'Listening',      color: Colors.green,  bg: Colors.green_bg,  filterTab: 'listening', route: '/modules/listening/select' },
  writing_task1: { label: 'Writing Task 1', color: Colors.orange, bg: Colors.orange_bg, filterTab: 'writing',   route: '/modules/writing/task1'    },
  writing_task2: { label: 'Writing Task 2', color: Colors.p,      bg: Colors.p_soft,    filterTab: 'writing',   route: '/modules/writing/task2'    },
};

// ── Search icon ───────────────────────────────────────────────────
function SearchIcon({ size = 16, color = Colors.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.75" />
      <Path d="M16.5 16.5 L21 21" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

// ── Module icon circle ────────────────────────────────────────────
function ModuleIconCircle({ module: mod }: { module: LibraryItem['module'] }) {
  const meta = MODULE_META[mod];
  const Icon = mod === 'reading' ? BookIcon : mod === 'listening' ? HeadphoneIcon : PenIcon;
  return (
    <View style={[g.iconCircle, { backgroundColor: meta.color }]}>
      <Icon size={20} color="#FFFFFF" strokeWidth={1.8} />
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────
function LibraryCard({ item, cardWidth }: { item: LibraryItem; cardWidth: number }) {
  const meta = MODULE_META[item.module];
  return (
    <TouchableOpacity
      style={[g.card, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={() => router.push(meta.route as any)}
    >
      {/* Colored top */}
      <View style={[g.cardTop, { backgroundColor: meta.bg }]}>
        {item.isToday && (
          <View style={g.todayBadge}>
            <Text style={g.todayBadgeText}>TODAY</Text>
          </View>
        )}
        <ModuleIconCircle module={item.module} />
      </View>

      {/* Body */}
      <View style={g.cardBody}>
        <View style={[g.modPill, { backgroundColor: meta.bg }]}>
          <Text style={[g.modPillText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <Text style={g.cardTitle} numberOfLines={3}>{item.title}</Text>
        {!item.isToday && (
          <Text style={g.dayLabel}>Day {item.dayIndex}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ── Section header ────────────────────────────────────────────────
function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <View style={g.sectionRow}>
      <Text style={g.sectionLabel}>{label}</Text>
      <View style={g.countBadge}>
        <Text style={g.countText}>{count}</Text>
      </View>
    </View>
  );
}

// ── Grid renderer ──────────────────────────────────────────────────
function CardGrid({ items, cardWidth, gap }: { items: LibraryItem[]; cardWidth: number; gap: number }) {
  const rows: LibraryItem[][] = [];
  for (let i = 0; i < items.length; i += 2) rows.push(items.slice(i, i + 2));
  return (
    <View style={{ gap }}>
      {rows.map((row, ri) => (
        <View key={ri} style={[g.gridRow, { gap }]}>
          {row.map(item => (
            <LibraryCard key={`${item.module}-${item.id}`} item={item} cardWidth={cardWidth} />
          ))}
          {row.length === 1 && <View style={{ width: cardWidth }} />}
        </View>
      ))}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function LibraryScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && screenWidth >= 768;

  const [query,     setQuery]     = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const allItems = useMemo(() => getAllLibraryItems(), []);

  const filtered = useMemo(() => {
    let items = allItems;
    if (activeTab !== 'all') items = items.filter(i => MODULE_META[i.module].filterTab === activeTab);
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(i => i.title.toLowerCase().includes(q) || i.topic.toLowerCase().includes(q));
    }
    return [...items].sort((a, b) => {
      if (a.isToday && !b.isToday) return -1;
      if (!a.isToday && b.isToday) return 1;
      return a.title.localeCompare(b.title);
    });
  }, [allItems, activeTab, query]);

  const todayItems = filtered.filter(i => i.isToday);
  const restItems  = filtered.filter(i => !i.isToday);
  const todayCount = allItems.filter(i => i.isToday).length;

  // Card width
  const hPad = isDesktop ? 32 : 20;
  const maxContent = isDesktop ? 680 : screenWidth;
  const contentWidth = Math.min(screenWidth, maxContent) - hPad * 2;
  const cardGap = 10;
  const cardWidth = (contentWidth - cardGap) / 2;

  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>

        {/* ── Page header ── */}
        <View style={[s.header, isDesktop && s.headerDesktop]}>
          <Text style={s.title}>Content Library</Text>
          <Text style={s.subtitle}>{todayCount} item{todayCount !== 1 ? 's' : ''} available today</Text>
        </View>

        {/* ── Search + filter ── */}
        <View style={[s.controls, isDesktop && s.controlsDesktop]}>
          <View style={s.searchBox}>
            <SearchIcon size={16} color={Colors.ink3} />
            <TextInput
              style={s.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search passages, topics…"
              placeholderTextColor={Colors.ink4}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Text style={s.clearBtn}>×</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabsRow}>
            {FILTER_TABS.map(tab => {
              const active = activeTab === tab.id;
              return (
                <TouchableOpacity
                  key={tab.id}
                  style={[s.tab, active && s.tabActive]}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.tabText, active && s.tabTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Content ── */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[s.content, isDesktop && s.contentDesktop]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filtered.length === 0 ? (
            <EmptyState
              iconComponent={<SearchIcon size={28} color={Colors.ink3} />}
              title="Nothing found"
              subtitle={query ? `Nothing matched "${query}"` : 'Try a different search term'}
            />
          ) : (
            <>
              {todayItems.length > 0 && (
                <View style={s.section}>
                  <SectionHeader label="TODAY" count={todayItems.length} />
                  <CardGrid items={todayItems} cardWidth={cardWidth} gap={cardGap} />
                </View>
              )}
              {restItems.length > 0 && (
                <View style={s.section}>
                  <SectionHeader label="ALL CONTENT" count={restItems.length} />
                  <CardGrid items={restItems} cardWidth={cardWidth} gap={cardGap} />
                </View>
              )}
            </>
          )}
          <View style={{ height: 48 }} />
        </ScrollView>

      </SafeAreaView>
    </AppLayout>
  );
}

// ── Card styles ───────────────────────────────────────────────────
const g = StyleSheet.create({
  gridRow: { flexDirection: 'row' },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  cardTop: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayBadge: {
    position: 'absolute',
    top: 8, left: 8,
    backgroundColor: Colors.p,
    borderRadius: 4,
    paddingHorizontal: 7, paddingVertical: 3,
  },
  todayBadgeText: {
    fontFamily: 'Inter_700Bold', fontSize: 9,
    color: Colors.white, letterSpacing: 0.6,
  },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  cardBody:    { paddingHorizontal: 14, paddingVertical: 12, gap: 4 },
  modPill:     { alignSelf: 'flex-start', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  modPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  cardTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000', lineHeight: 19 },
  dayLabel:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#BBB' },

  sectionRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11,
    color: Colors.ink3, letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  countBadge:   { backgroundColor: Colors.bg2, borderRadius: 10, paddingHorizontal: 7, paddingVertical: 2 },
  countText:    { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3 },
});

// ── Screen styles ─────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    paddingHorizontal: 20, paddingTop: 28, paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerDesktop: { paddingHorizontal: 32, paddingTop: 36 },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.textPrimary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  controls: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 10,
    gap: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  controlsDesktop: { paddingHorizontal: 32 },

  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.bg,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, height: 44,
  },
  searchInput:  { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink },
  clearBtn:     { fontFamily: 'Inter_400Regular', fontSize: 18, color: Colors.ink3, lineHeight: 20 },

  tabsRow:      { flexDirection: 'row', gap: 8, paddingBottom: 4 },
  tab:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border },
  tabActive:    { backgroundColor: Colors.p, borderColor: Colors.p },
  tabText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  tabTextActive:{ color: Colors.white, fontFamily: 'Inter_600SemiBold' },

  content:        { padding: 20 },
  contentDesktop: { paddingHorizontal: 32, maxWidth: 744, alignSelf: 'center', width: '100%' },

  section: { marginBottom: 28 },

  empty:      { paddingTop: 64, alignItems: 'center', gap: 10 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.ink },
  emptyText:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
});
