/**
 * app/admin/sessions.tsx
 * Live feed of all sessions across modules. Auto-refreshes every 30s.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { MicIcon, PenIcon, HeadphoneIcon, BookIcon } from '@/components/icons';

const API      = process.env.EXPO_PUBLIC_API_URL ?? '/api';
const KEY      = process.env.EXPO_PUBLIC_ADMIN_KEY ?? '';
const INTERVAL = 30_000; // 30 seconds

// ── Types ──────────────────────────────────────────────────────────
type AdminSession = {
  id:           string;
  userId:       string;
  userName:     string;
  userEmail:    string;
  module:       string;
  languageCode: string;
  score:        number | null;
  durationSec:  number | null;
  createdAt:    string;
};

// ── Helpers ────────────────────────────────────────────────────────
const MODULE_META: Record<string, { color: string; bg: string; Icon: React.ComponentType<any> }> = {
  writing:   { color: Colors.orange, bg: Colors.orange_bg, Icon: PenIcon        },
  speaking:  { color: Colors.p,      bg: Colors.p_soft,    Icon: MicIcon        },
  listening: { color: Colors.green,  bg: Colors.green_bg,  Icon: HeadphoneIcon  },
  reading:   { color: Colors.blue,   bg: Colors.blue_bg,   Icon: BookIcon       },
};

function relTime(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60)  return `${Math.floor(s)}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDur(sec: number | null) {
  if (!sec) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── Session row ────────────────────────────────────────────────────
function SessionRow({ session }: { session: AdminSession }) {
  const meta = MODULE_META[session.module] ?? MODULE_META.writing;
  return (
    <View style={r.row}>
      <View style={[r.iconWrap, { backgroundColor: meta.bg }]}>
        <meta.Icon size={18} color={meta.color} />
      </View>
      <View style={r.info}>
        <Text style={r.name} numberOfLines={1}>{session.userName}</Text>
        <Text style={r.detail}>
          {session.module.charAt(0).toUpperCase() + session.module.slice(1)}
          {' · '}
          {session.languageCode.toUpperCase()}
          {' · '}
          {formatDur(session.durationSec)}
        </Text>
      </View>
      <View style={r.right}>
        {session.score != null && session.score > 0 ? (
          <View style={[r.score, { backgroundColor: meta.bg }]}>
            <Text style={[r.scoreText, { color: meta.color }]}>{session.score.toFixed(1)}</Text>
          </View>
        ) : null}
        <Text style={r.time}>{relTime(session.createdAt)}</Text>
      </View>
    </View>
  );
}

// ── Screen ─────────────────────────────────────────────────────────
export default function AdminSessionsScreen() {
  const [sessions,   setSessions]   = useState<AdminSession[]>([]);
  const [sessToday,  setSessToday]  = useState(0);
  const [loading,    setLoading]    = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [moduleFilter, setModuleFilter] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const qs = new URLSearchParams({ limit: '100' });
      if (moduleFilter) qs.set('module', moduleFilter);
      const res = await fetch(`${API}/admin/sessions?${qs}`, {
        headers: { 'x-admin-key': KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setSessions(json.sessions ?? []);
      setSessToday(json.sessionsToday ?? 0);
    } catch (err: any) {
      console.error('[admin/sessions]', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [moduleFilter]);

  // Initial load + auto-refresh
  useEffect(() => {
    load();
    timerRef.current = setInterval(() => load(), INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [load]);

  const MODULES = ['', 'writing', 'speaking', 'listening', 'reading'];

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={s.title}>Sessions</Text>
          <Text style={s.sub}>auto-refreshes every 30s</Text>
        </View>
        <View style={s.todayBadge}>
          <Text style={s.todayNum}>{sessToday}</Text>
          <Text style={s.todayLabel}>today</Text>
        </View>
      </View>

      {/* Module filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
        {MODULES.map(m => {
          const active = moduleFilter === m;
          return (
            <TouchableOpacity
              key={m || 'all'}
              style={[s.pill, active && s.pillActive]}
              onPress={() => setModuleFilter(m)}
              activeOpacity={0.7}
            >
              <Text style={[s.pillText, active && s.pillTextActive]}>
                {m ? m.charAt(0).toUpperCase() + m.slice(1) : 'All'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color={Colors.p} /></View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        >
          {sessions.length === 0 ? (
            <Text style={s.empty}>No sessions found</Text>
          ) : (
            sessions.map(s => <SessionRow key={s.id} session={s} />)
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── Row styles ─────────────────────────────────────────────────────
const r = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  iconWrap:  { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  info:      { flex: 1, gap: 2 },
  name:      { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  detail:    { fontFamily: 'Inter_400Regular',  fontSize: 12, color: Colors.ink3 },
  right:     { alignItems: 'flex-end', gap: 4 },
  score:     { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  scoreText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  time:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4 },
});

// ── Screen styles ──────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  back:        { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  title:       { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  sub:         { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4 },
  todayBadge:  { alignItems: 'center', backgroundColor: Colors.p_soft, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 6 },
  todayNum:    { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.p },
  todayLabel:  { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.p, textTransform: 'uppercase' },
  filters:     { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 12 },
  pill:        { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.white },
  pillActive:  { backgroundColor: Colors.p, borderColor: Colors.p },
  pillText:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  pillTextActive: { color: Colors.white },
  empty:       { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, textAlign: 'center', marginTop: 60 },
});
