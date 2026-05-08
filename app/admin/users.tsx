/**
 * app/admin/users.tsx
 * Admin users table with search, plan filter, and detail view.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Platform, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { SearchIcon, ChevronRightIcon, ArrowUpIcon } from '@/components/icons';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';
const KEY  = process.env.EXPO_PUBLIC_ADMIN_KEY ?? '';

// ── Types ──────────────────────────────────────────────────────────
type AdminUser = {
  id:            string;
  name:          string;
  email:         string;
  plan:          'free' | 'pro' | 'elite';
  joinedAt:      string;
  lastActive:    string;
  sessions:      number;
  streak:        number;
  languageCount: number;
  languages:     string[];
};

type SortKey = 'joinedAt' | 'lastActive' | 'sessions' | 'streak' | 'name' | 'plan';

const PLAN_COLORS = {
  free:  Colors.ink3,
  pro:   Colors.p,
  elite: '#8B5CF6',
};
const PLAN_BG = {
  free:  Colors.bg2,
  pro:   Colors.p_soft,
  elite: '#F5F3FF',
};

function planLabel(p: string) {
  return p === 'elite' ? 'Elite' : p === 'pro' ? 'Pro' : 'Free';
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d    = Math.floor(diff / 86400000);
  const h    = Math.floor(diff / 3600000);
  const m    = Math.floor(diff / 60000);
  if (d >= 30) return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  if (d > 0)  return `${d}d ago`;
  if (h > 0)  return `${h}h ago`;
  if (m > 0)  return `${m}m ago`;
  return 'Just now';
}

// ── User row ───────────────────────────────────────────────────────
function UserRow({ user, onPress }: { user: AdminUser; onPress: () => void }) {
  const planColor = PLAN_COLORS[user.plan] ?? Colors.ink3;
  const planBg    = PLAN_BG[user.plan] ?? Colors.bg2;
  return (
    <TouchableOpacity style={r.row} onPress={onPress} activeOpacity={0.7}>
      {/* Avatar */}
      <View style={r.avatar}>
        <Text style={r.avatarText}>{(user.name[0] ?? '?').toUpperCase()}</Text>
      </View>

      {/* Info */}
      <View style={r.info}>
        <View style={r.infoTop}>
          <Text style={r.name} numberOfLines={1}>{user.name}</Text>
          <View style={[r.planBadge, { backgroundColor: planBg }]}>
            <Text style={[r.planText, { color: planColor }]}>{planLabel(user.plan)}</Text>
          </View>
        </View>
        <Text style={r.email} numberOfLines={1}>{user.email}</Text>
        <View style={r.meta}>
          <Text style={r.metaText}>{user.sessions} sessions</Text>
          <Text style={r.metaDot}>·</Text>
          <Text style={r.metaText}>{user.streak}d streak</Text>
          <Text style={r.metaDot}>·</Text>
          <Text style={r.metaText}>{user.languageCount} lang</Text>
          <Text style={r.metaDot}>·</Text>
          <Text style={r.metaText}>joined {relativeTime(user.joinedAt)}</Text>
        </View>
      </View>

      <ChevronRightIcon size={14} color={Colors.borderStrong} />
    </TouchableOpacity>
  );
}

// ── Sort header ────────────────────────────────────────────────────
function SortBtn({ label, field, current, asc, onPress }: {
  label: string; field: SortKey; current: SortKey; asc: boolean; onPress: () => void;
}) {
  const active = current === field;
  return (
    <TouchableOpacity style={[sh.btn, active && sh.btnActive]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[sh.text, active && sh.textActive]}>{label}</Text>
      {active && <Text style={sh.arrow}>{asc ? '↑' : '↓'}</Text>}
    </TouchableOpacity>
  );
}

const sh = StyleSheet.create({
  btn:        { flexDirection: 'row', gap: 3, alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: Colors.border },
  btnActive:  { backgroundColor: Colors.p_soft, borderColor: Colors.p },
  text:       { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink2 },
  textActive: { color: Colors.p },
  arrow:      { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.p },
});

// ── Screen ─────────────────────────────────────────────────────────
export default function AdminUsersScreen() {
  const [users,     setUsers]     = useState<AdminUser[]>([]);
  const [total,     setTotal]     = useState(0);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search,    setSearch]    = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [sortKey,   setSortKey]   = useState<SortKey>('joinedAt');
  const [sortAsc,   setSortAsc]   = useState(false);
  const [page,      setPage]      = useState(0);

  const load = useCallback(async (pg = 0, refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(pg === 0);
    try {
      const qs = new URLSearchParams({
        page:  String(pg),
        limit: '50',
        sort:  sortKey === 'joinedAt' ? 'joined' : sortKey === 'lastActive' ? 'active' : 'sessions',
        order: sortAsc ? 'asc' : 'desc',
      });
      if (search)     qs.set('search', search);
      if (planFilter) qs.set('plan',   planFilter);

      const res = await fetch(`${API}/admin/users?${qs}`, {
        headers: { 'x-admin-key': KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      setUsers(pg === 0 ? (json.users ?? []) : prev => [...prev, ...(json.users ?? [])]);
      setTotal(json.total ?? 0);
      setPage(pg);
    } catch (err: any) {
      console.error('[admin/users]', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [search, planFilter, sortKey, sortAsc]);

  useEffect(() => { load(0); }, [load]);

  const toggleSort = (field: SortKey) => {
    if (sortKey === field) setSortAsc(a => !a);
    else { setSortKey(field); setSortAsc(false); }
  };

  const PLAN_FILTERS = ['', 'free', 'pro', 'elite'];

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Users</Text>
        <Text style={s.count}>{total.toLocaleString()}</Text>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <SearchIcon size={15} color={Colors.ink3} />
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={v => { setSearch(v); }}
          onSubmitEditing={() => load(0)}
          placeholder="Search name or email…"
          placeholderTextColor={Colors.ink4}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
      </View>

      {/* Plan filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
        {PLAN_FILTERS.map(p => (
          <TouchableOpacity
            key={p || 'all'}
            style={[s.filterPill, planFilter === p && s.filterPillActive]}
            onPress={() => setPlanFilter(p)}
            activeOpacity={0.7}
          >
            <Text style={[s.filterText, planFilter === p && s.filterTextActive]}>
              {p ? planLabel(p) : 'All'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.sortRow}>
        {([['Joined', 'joinedAt'], ['Active', 'lastActive'], ['Sessions', 'sessions'], ['Streak', 'streak']] as [string, SortKey][]).map(([l, f]) => (
          <SortBtn key={f} label={l} field={f} current={sortKey} asc={sortAsc} onPress={() => toggleSort(f)} />
        ))}
      </ScrollView>

      {/* Users list */}
      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color={Colors.p} /></View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.list}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(0, true)} />}
          onScroll={({ nativeEvent: { layoutMeasurement, contentOffset, contentSize } }) => {
            const close = layoutMeasurement.height + contentOffset.y >= contentSize.height - 80;
            if (close && !loading && users.length < total) load(page + 1);
          }}
          scrollEventThrottle={400}
        >
          {users.length === 0 ? (
            <Text style={s.empty}>No users found</Text>
          ) : (
            users.map(u => (
              <UserRow
                key={u.id}
                user={u}
                onPress={() => router.push({ pathname: '/admin/user-detail', params: { userId: u.id } } as any)}
              />
            ))
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── User row styles ────────────────────────────────────────────────
const r = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatar: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.p_soft,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText:  { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.p },
  info:        { flex: 1, gap: 3 },
  infoTop:     { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name:        { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink, flex: 1 },
  planBadge:   { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  planText:    { fontFamily: 'Inter_700Bold', fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 },
  email:       { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  meta:        { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  metaText:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4 },
  metaDot:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.border },
});

// ── Screen styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  back:  { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  count: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink3 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: Colors.white,
    marginHorizontal: 16, marginTop: 12, marginBottom: 4,
    borderRadius: 8, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, height: 40,
  },
  searchInput: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink },
  filters: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  filterPillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  filterText:       { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink2 },
  filterTextActive: { color: Colors.white },
  sortRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 10 },
  list:  { paddingBottom: 20 },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center', marginTop: 60 },
});
