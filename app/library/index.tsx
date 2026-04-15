import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { getAllLibraryItems, type LibraryItem } from '@/constants/dailyContent';
import { BookIcon, HeadphoneIcon, PenIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';

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

// ── Icons ─────────────────────────────────────────────────────────
function SearchIcon({ size = 16, color = Colors.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.75" />
      <Path d="M16.5 16.5 L21 21" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

function ModuleIcon({ module: mod }: { module: LibraryItem['module'] }) {
  const meta = MODULE_META[mod];
  const Icon = mod === 'reading' ? BookIcon : mod === 'listening' ? HeadphoneIcon : PenIcon;
  return (
    <View style={[li.iconWrap, { backgroundColor: meta.bg }]}>
      <Icon size={18} color={meta.color} />
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────
function LibraryCard({ item }: { item: LibraryItem }) {
  const meta = MODULE_META[item.module];
  return (
    <TouchableOpacity
      style={[li.card, item.isToday && li.cardToday]}
      activeOpacity={0.75}
      onPress={() => router.push(meta.route as any)}
    >
      <ModuleIcon module={item.module} />
      <View style={li.cardBody}>
        <Text style={li.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={li.cardMeta}>
          <View style={[li.modulePill, { backgroundColor: meta.bg }]}>
            <Text style={[li.modulePillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
      </View>
      {item.isToday
        ? <View style={li.todayBadge}><Text style={li.todayBadgeText}>Today</Text></View>
        : <Text style={li.dayLabel}>Day {item.dayIndex}</Text>
      }
    </TouchableOpacity>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function LibraryScreen() {
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

  const todayCount = allItems.filter(i => i.isToday).length;

  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.header}>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle}>Content Library</Text>
            <Text style={s.headerSub}>{todayCount} item{todayCount !== 1 ? 's' : ''} available today</Text>
          </View>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
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
        </View>

        {/* Filter tabs */}
        <View style={s.tabsWrap}>
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

        {/* List */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {filtered.length === 0
            ? <View style={s.empty}><Text style={s.emptyText}>No results for "{query}"</Text></View>
            : filtered.map(item => <LibraryCard key={`${item.module}-${item.id}`} item={item} />)
          }
          <View style={{ height: 32 }} />
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const li = StyleSheet.create({
  card:          { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.white, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, padding: 14 },
  cardToday:     { borderColor: Colors.p, borderWidth: 1.5 },
  iconWrap:      { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardBody:      { flex: 1, gap: 5 },
  cardTitle:     { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, lineHeight: 20 },
  cardMeta:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  modulePill:    { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  modulePillText:{ fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  todayBadge:    { backgroundColor: Colors.p_soft, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, borderColor: Colors.p },
  todayBadgeText:{ fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.p },
  dayLabel:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, flexShrink: 0 },
});

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.white },
  headerCenter: { flex: 1 },
  headerTitle:  { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  headerSub:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  searchWrap:   { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  searchBox:    { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: Colors.bg, borderRadius: 8, borderWidth: 1, borderColor: Colors.borderStrong, paddingHorizontal: 12, height: 38 },
  searchInput:  { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink },
  clearBtn:     { fontFamily: 'Inter_400Regular', fontSize: 18, color: Colors.ink3, lineHeight: 20 },
  tabsWrap:     { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  tabsRow:      { paddingHorizontal: 16, paddingVertical: 10, gap: 8, flexDirection: 'row' },
  tab:          { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border },
  tabActive:    { backgroundColor: Colors.p, borderColor: Colors.p },
  tabText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  tabTextActive:{ color: Colors.white, fontFamily: 'Inter_600SemiBold' },
  listContent:  { padding: 16, gap: 8 },
  empty:        { paddingTop: 48, alignItems: 'center' },
  emptyText:    { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
});
