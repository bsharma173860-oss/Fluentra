/**
 * app/admin/index.tsx
 * Admin dashboard home — platform-wide stats.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Platform, RefreshControl,
  SafeAreaView, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import {
  UsersIcon, CreditCardIcon, ChartIcon, BookIcon,
  RefreshIcon, ArrowUpIcon,
} from '@/components/icons';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';
const KEY  = process.env.EXPO_PUBLIC_ADMIN_KEY ?? '';

// ── Types ──────────────────────────────────────────────────────────
type AdminStats = {
  users:    { total: number; newToday: number; newThisWeek: number; activeToday: number };
  revenue:  { proUsers: number; eliteUsers: number; mrr: number; conversionRate: string };
  sessions: { today: number; writing: number; speaking: number; listening: number; reading: number };
  content:  { libraryTotal: number; generatedToday: boolean; libraryToday: number };
};

// ── Stat card ──────────────────────────────────────────────────────
function StatCard({
  label, value, accent, sub, subColor,
}: {
  label: string; value: string | number; accent: string;
  sub?: string; subColor?: string;
}) {
  return (
    <View style={[c.card, { borderTopColor: accent, borderTopWidth: 3 }]}>
      <Text style={[c.value, { color: accent }]}>{value}</Text>
      <Text style={c.label}>{label}</Text>
      {sub ? <Text style={[c.sub, { color: subColor ?? Colors.ink3 }]}>{sub}</Text> : null}
    </View>
  );
}

// ── Section header ─────────────────────────────────────────────────
function Section({ icon: Icon, title, children }: {
  icon: React.ComponentType<any>; title: string; children: React.ReactNode;
}) {
  return (
    <View style={sc.wrap}>
      <View style={sc.header}>
        <Icon size={16} color={Colors.ink3} />
        <Text style={sc.title}>{title}</Text>
      </View>
      <View style={sc.grid}>{children}</View>
    </View>
  );
}

// ── Nav pill ───────────────────────────────────────────────────────
function NavPill({ label, route }: { label: string; route: string }) {
  return (
    <TouchableOpacity style={n.pill} onPress={() => router.push(route as any)} activeOpacity={0.8}>
      <Text style={n.label}>{label}</Text>
      <Text style={n.arrow}>→</Text>
    </TouchableOpacity>
  );
}

// ── Screen ─────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [stats,     setStats]     = useState<AdminStats | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/admin/stats`, {
        headers: { 'x-admin-key': KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStats(await res.json());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color={Colors.p} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Admin Dashboard</Text>
          <Text style={s.sub}>Fluentra Platform</Text>
        </View>
        <TouchableOpacity onPress={() => load(true)} style={s.refreshBtn} activeOpacity={0.7}>
          <RefreshIcon size={18} color={Colors.ink3} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
      >
        {error ? (
          <View style={s.errorBox}>
            <Text style={s.errorText}>Failed to load stats: {error}</Text>
            <TouchableOpacity onPress={() => load()} activeOpacity={0.8}>
              <Text style={s.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : stats ? (
          <>
            {/* Navigation */}
            <View style={n.row}>
              <NavPill label="Users"    route="/admin/users"    />
              <NavPill label="Sessions" route="/admin/sessions" />
              <NavPill label="Content"  route="/admin/content"  />
              <NavPill label="Revenue"  route="/admin/revenue"  />
            </View>

            {/* Users */}
            <Section icon={UsersIcon} title="USERS">
              <StatCard label="Total Users"    value={stats.users.total}       accent={Colors.p}     />
              <StatCard label="New Today"      value={stats.users.newToday}    accent={Colors.green} />
              <StatCard label="New This Week"  value={stats.users.newThisWeek} accent={Colors.blue}  />
              <StatCard label="Active Today"   value={stats.users.activeToday} accent={Colors.orange} />
            </Section>

            {/* Revenue */}
            <Section icon={CreditCardIcon} title="REVENUE">
              <StatCard label="Pro Users"        value={stats.revenue.proUsers}    accent={Colors.p}      />
              <StatCard label="Elite Users"      value={stats.revenue.eliteUsers}  accent="#8B5CF6"       />
              <StatCard label="MRR"              value={`$${stats.revenue.mrr.toLocaleString()}`} accent={Colors.green} />
              <StatCard label="Conversion Rate"  value={stats.revenue.conversionRate} accent={Colors.gold} />
            </Section>

            {/* Sessions */}
            <Section icon={ChartIcon} title="SESSIONS TODAY">
              <StatCard label="Total Today"  value={stats.sessions.today}     accent={Colors.p}      />
              <StatCard label="Writing"      value={stats.sessions.writing}   accent={Colors.orange} />
              <StatCard label="Speaking"     value={stats.sessions.speaking}  accent={Colors.blue}   />
              <StatCard label="Listening"    value={stats.sessions.listening} accent={Colors.green}  />
              <StatCard label="Reading"      value={stats.sessions.reading}   accent={Colors.gold}   />
            </Section>

            {/* Content */}
            <Section icon={BookIcon} title="CONTENT">
              <StatCard
                label="Library Total"
                value={stats.content.libraryTotal}
                accent={Colors.p}
              />
              <StatCard
                label="Generated Today"
                value={stats.content.libraryToday}
                accent={stats.content.generatedToday ? Colors.green : Colors.danger}
                sub={stats.content.generatedToday ? 'Done' : 'Not yet'}
                subColor={stats.content.generatedToday ? Colors.green : Colors.danger}
              />
            </Section>
          </>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const c = StyleSheet.create({
  card: {
    flex: 1, minWidth: 140,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 4,
  },
  value: { fontFamily: 'Inter_700Bold', fontSize: 26 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.4 },
  sub:   { fontFamily: 'Inter_500Medium', fontSize: 11 },
});

const sc = StyleSheet.create({
  wrap:   { gap: 10 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  title:  { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.8 },
  grid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});

const n = StyleSheet.create({
  row:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  arrow: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
});

const s = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 20, gap: 24 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title:      { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.ink },
  sub:        { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  refreshBtn: { padding: 8 },
  errorBox:   { alignItems: 'center', gap: 8, padding: 20 },
  errorText:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.danger, textAlign: 'center' },
  retryText:  { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },
});
