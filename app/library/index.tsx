import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, Platform, useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { BookIcon, HeadphoneIcon, PenIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';

// ── Types ──────────────────────────────────────────────────────────

type ContentType = 'writing_prompt' | 'reading' | 'listening' | 'vocab' | 'grammar' | 'speaking';

type LibraryItem = {
  id:            string;
  language_code: string;
  exam_type:     string;
  content_type:  ContentType;
  title:         string;
  difficulty:    string;
  date:          string;   // YYYY-MM-DD
  created_at:    string;
};

// ── Filter tabs ────────────────────────────────────────────────────

type FilterTab = 'all' | ContentType;

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: 'all',            label: 'All'       },
  { id: 'reading',        label: 'Reading'   },
  { id: 'listening',      label: 'Listening' },
  { id: 'writing_prompt', label: 'Writing'   },
  { id: 'vocab',          label: 'Vocab'     },
  { id: 'grammar',        label: 'Grammar'   },
  { id: 'speaking',       label: 'Speaking'  },
];

// ── Content-type meta (color, icon, route) ─────────────────────────

const TYPE_META: Record<ContentType, { label: string; color: string; bg: string; route: string }> = {
  reading:        { label: 'Reading',        color: Colors.blue,   bg: Colors.blue_bg,   route: '/modules/reading/select'   },
  listening:      { label: 'Listening',      color: Colors.green,  bg: Colors.green_bg,  route: '/modules/listening/select' },
  writing_prompt: { label: 'Writing',        color: Colors.orange, bg: Colors.orange_bg, route: '/modules/writing/session'  },
  vocab:          { label: 'Vocabulary',     color: Colors.p,      bg: Colors.p_soft,    route: '/language'                 },
  grammar:        { label: 'Grammar',        color: '#E67E22',     bg: '#FEF3E2',        route: '/language'                 },
  speaking:       { label: 'Speaking',       color: '#9B59B6',     bg: '#F5EEF8',        route: '/modules/speaking/session' },
};

// ── Helpers ────────────────────────────────────────────────────────

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split('T')[0];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// ── Icons ──────────────────────────────────────────────────────────

function SearchIcon({ size = 16, color = Colors.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.75" />
      <Path d="M16.5 16.5 L21 21" stroke={color} strokeWidth="1.75" strokeLinecap="round" />
    </Svg>
  );
}

function TypeIcon({ type }: { type: ContentType }) {
  const meta = TYPE_META[type];
  const Icon =
    type === 'reading'   ? BookIcon :
    type === 'listening' ? HeadphoneIcon :
    PenIcon;
  return (
    <View style={[g.iconCircle, { backgroundColor: meta.color }]}>
      <Icon size={20} color="#FFFFFF" strokeWidth={1.8} />
    </View>
  );
}

// ── Card ──────────────────────────────────────────────────────────

function LibraryCard({ item, cardWidth }: { item: LibraryItem; cardWidth: number }) {
  const meta  = TYPE_META[item.content_type];
  const today = isToday(item.date);

  return (
    <TouchableOpacity
      style={[g.card, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={() => router.push(meta.route as any)}
    >
      <View style={[g.cardTop, { backgroundColor: meta.bg }]}>
        {today && (
          <View style={g.todayBadge}>
            <Text style={g.todayBadgeText}>TODAY</Text>
          </View>
        )}
        <TypeIcon type={item.content_type} />
      </View>

      <View style={g.cardBody}>
        <View style={[g.modPill, { backgroundColor: meta.bg }]}>
          <Text style={[g.modPillText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <Text style={g.cardTitle} numberOfLines={3}>{item.title}</Text>
        <Text style={g.dayLabel}>{today ? 'Today' : formatDate(item.date)}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Section header ─────────────────────────────────────────────────

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
            <LibraryCard key={item.id} item={item} cardWidth={cardWidth} />
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

  const params = useLocalSearchParams<{ code?: string }>();

  const [items,     setItems]     = useState<LibraryItem[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [query,     setQuery]     = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams({ limit: '50' });
      if (params.code) qs.set('code', params.code as string);
      if (activeTab !== 'all') qs.set('type', activeTab);

      const res = await fetch(`${API}/library?${qs}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setItems(json.items ?? []);
    } catch (err: any) {
      console.error('[library] fetch error:', err);
      setError('Could not load library. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [params.code, activeTab]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(i => i.title.toLowerCase().includes(q));
  }, [items, query]);

  const todayItems = filtered.filter(i => isToday(i.date));
  const restItems  = filtered.filter(i => !isToday(i.date));
  const todayCount = items.filter(i => isToday(i.date)).length;

  // Card width
  const hPad        = isDesktop ? 32 : 20;
  const maxContent  = isDesktop ? 680 : screenWidth;
  const contentWidth = Math.min(screenWidth, maxContent) - hPad * 2;
  const cardGap     = 10;
  const cardWidth   = (contentWidth - cardGap) / 2;

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
              placeholder="Search titles…"
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
          {loading ? (
            <View style={s.center}>
              <ActivityIndicator size="large" color={Colors.p} />
            </View>
          ) : error ? (
            <EmptyState
              iconComponent={<SearchIcon size={28} color={Colors.ink3} />}
              title="Could not load library"
              subtitle={error}
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              iconComponent={<SearchIcon size={28} color={Colors.ink3} />}
              title="Nothing found"
              subtitle={query ? `Nothing matched "${query}"` : 'Content will appear here as it is generated'}
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

  center: { flex: 1, paddingTop: 80, alignItems: 'center' },
});
