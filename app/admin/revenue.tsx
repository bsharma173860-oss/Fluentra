/**
 * app/admin/revenue.tsx
 * MRR, subscription breakdown, and exam purchases.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, Dimensions, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import Svg, { Line, Path, Circle, Text as SvgText } from 'react-native-svg';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const API = process.env.EXPO_PUBLIC_API_URL ?? '/api';
const KEY  = process.env.EXPO_PUBLIC_ADMIN_KEY ?? '';
const W    = Dimensions.get('window').width - 32;

// ── Types ──────────────────────────────────────────────────────────
type MrrMonth = { month: string; pro: number; elite: number; mrr: number };
type Subscriptions = {
  free: number; pro: number; elite: number; total: number;
  mrr: number; conversionRate: string;
};
type ExamPurchase = {
  id: string; userName: string; languageCode: string;
  examType: string; month: string; date: string;
};
type RevenueData = {
  subscriptions: Subscriptions;
  mrrHistory:    MrrMonth[];
  examPurchases: ExamPurchase[];
};

// ── MRR line chart ─────────────────────────────────────────────────
function MrrChart({ data }: { data: MrrMonth[] }) {
  if (data.length < 2) {
    return (
      <View style={ch.empty}>
        <Text style={ch.emptyText}>Not enough data yet</Text>
      </View>
    );
  }

  const CHART_H = 140;
  const PAD     = { top: 12, bottom: 28, left: 40, right: 12 };
  const innerW  = W - PAD.left - PAD.right - 32;
  const innerH  = CHART_H - PAD.top - PAD.bottom;
  const maxMrr  = Math.max(...data.map(d => d.mrr), 1);

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + (1 - d.mrr / maxMrr) * innerH,
    label: d.month.slice(5), // MM
    mrr: d.mrr,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const prev = pts[i - 1];
    const cx = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cx.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${PAD.top + innerH} L ${PAD.left} ${PAD.top + innerH} Z`;

  return (
    <Svg width={W - 32} height={CHART_H}>
      {/* Grid lines */}
      {[0, 0.5, 1].map(v => {
        const y = PAD.top + (1 - v) * innerH;
        const val = Math.round(maxMrr * v);
        return (
          <React.Fragment key={v}>
            <Line x1={PAD.left} y1={y} x2={PAD.left + innerW} y2={y} stroke={Colors.border} strokeWidth={1} />
            <SvgText x={0} y={y + 4} fontSize={9} fill={Colors.ink3}>${val}</SvgText>
          </React.Fragment>
        );
      })}

      <Path d={areaD} fill={Colors.p} fillOpacity={0.08} />
      <Path d={pathD} fill="none" stroke={Colors.p} strokeWidth={2.5} strokeLinecap="round" />

      {pts.map((p, i) => (
        <React.Fragment key={i}>
          <Circle cx={p.x} cy={p.y} r={4} fill={Colors.white} stroke={Colors.p} strokeWidth={2} />
          <SvgText x={p.x} y={CHART_H - 6} fontSize={9} fill={Colors.ink3} textAnchor="middle">{p.label}</SvgText>
        </React.Fragment>
      ))}
    </Svg>
  );
}

const ch = StyleSheet.create({
  empty:     { height: 80, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
});

// ── Funnel bar ─────────────────────────────────────────────────────
function FunnelBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <View style={fb.wrap}>
      <View style={fb.labelRow}>
        <Text style={fb.label}>{label}</Text>
        <Text style={[fb.value, { color }]}>{value.toLocaleString()}</Text>
      </View>
      <View style={fb.track}>
        <View style={[fb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const fb = StyleSheet.create({
  wrap:     { gap: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  label:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2 },
  value:    { fontFamily: 'Inter_700Bold', fontSize: 12 },
  track:    { height: 6, backgroundColor: Colors.bg2, borderRadius: 3, overflow: 'hidden' },
  fill:     { height: '100%', borderRadius: 3 },
});

// ── Screen ─────────────────────────────────────────────────────────
export default function AdminRevenueScreen() {
  const [data,      setData]      = useState<RevenueData | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    try {
      const res = await fetch(`${API}/admin/revenue`, {
        headers: { 'x-admin-key': KEY },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setData(await res.json());
    } catch (err: any) {
      console.error('[admin/revenue]', err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const sub = data?.subscriptions;
  const mrr = data?.mrrHistory ?? [];
  const exams = data?.examPurchases ?? [];

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Text style={s.back}>←</Text>
        </TouchableOpacity>
        <Text style={s.title}>Revenue</Text>
        {sub ? (
          <Text style={s.mrr}>${sub.mrr.toLocaleString()} MRR</Text>
        ) : <View />}
      </View>

      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color={Colors.p} /></View>
      ) : (
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} />}
        >
          {/* Subscription breakdown */}
          {sub && (
            <View style={s.card}>
              <Text style={s.cardTitle}>SUBSCRIPTION BREAKDOWN</Text>

              <View style={s.mrrRow}>
                <View style={s.mrrBig}>
                  <Text style={s.mrrNum}>${sub.mrr.toLocaleString()}</Text>
                  <Text style={s.mrrLabel}>Monthly Recurring Revenue</Text>
                </View>
                <View style={s.convBig}>
                  <Text style={s.convNum}>{sub.conversionRate}</Text>
                  <Text style={s.mrrLabel}>Conversion</Text>
                </View>
              </View>

              <View style={s.planGrid}>
                {[
                  { label: 'Free',  count: sub.free,  color: Colors.ink3,  bg: Colors.bg2,     rev: 0           },
                  { label: 'Pro',   count: sub.pro,   color: Colors.p,     bg: Colors.p_soft,  rev: sub.pro * 24 },
                  { label: 'Elite', count: sub.elite, color: '#8B5CF6',    bg: '#F5F3FF',      rev: sub.elite * 120 },
                ].map(p => (
                  <View key={p.label} style={[s.planCard, { backgroundColor: p.bg }]}>
                    <Text style={[s.planCount, { color: p.color }]}>{p.count}</Text>
                    <Text style={s.planLabel}>{p.label}</Text>
                    {p.rev > 0 && <Text style={[s.planRev, { color: p.color }]}>${p.rev.toLocaleString()}</Text>}
                  </View>
                ))}
              </View>

              {/* Funnel */}
              <View style={s.funnelWrap}>
                <Text style={s.sectionLabel}>CONVERSION FUNNEL</Text>
                <FunnelBar label="Total Users" value={sub.total} total={sub.total} color={Colors.ink3} />
                <FunnelBar label="Active (paid/free)" value={sub.pro + sub.elite} total={sub.total} color={Colors.blue} />
                <FunnelBar label="Pro" value={sub.pro} total={sub.total} color={Colors.p} />
                <FunnelBar label="Elite" value={sub.elite} total={sub.total} color="#8B5CF6" />
              </View>
            </View>
          )}

          {/* MRR chart */}
          <View style={s.card}>
            <Text style={s.cardTitle}>MRR OVER TIME</Text>
            <MrrChart data={mrr} />
          </View>

          {/* Exam purchases */}
          {exams.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>RECENT EXAM PURCHASES</Text>
              {exams.map(e => (
                <View key={e.id} style={s.examRow}>
                  <View style={s.examInfo}>
                    <Text style={s.examUser}>{e.userName}</Text>
                    <Text style={s.examMeta}>{e.languageCode.toUpperCase()} · {e.examType} · {e.month}</Text>
                  </View>
                  <Text style={s.examDate}>{new Date(e.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { padding: 16, gap: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  back:  { fontFamily: 'Inter_500Medium', fontSize: 20, color: Colors.ink2 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  mrr:   { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.green },
  card: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 14,
  },
  cardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.6 },
  mrrRow:    { flexDirection: 'row', gap: 16 },
  mrrBig:    { flex: 1, gap: 2 },
  convBig:   { gap: 2, alignItems: 'flex-end' },
  mrrNum:    { fontFamily: 'Inter_700Bold', fontSize: 32, color: Colors.green },
  convNum:   { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.p },
  mrrLabel:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  planGrid:  { flexDirection: 'row', gap: 10 },
  planCard:  { flex: 1, borderRadius: 12, padding: 12, gap: 2, alignItems: 'center' },
  planCount: { fontFamily: 'Inter_700Bold', fontSize: 22 },
  planLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.ink3 },
  planRev:   { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  funnelWrap: { gap: 8 },
  sectionLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3, textTransform: 'uppercase', letterSpacing: 0.5 },
  examRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderTopWidth: 1, borderTopColor: Colors.border },
  examInfo:  { gap: 2 },
  examUser:  { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  examMeta:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  examDate:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink4 },
});
