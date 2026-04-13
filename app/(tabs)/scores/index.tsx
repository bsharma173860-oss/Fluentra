import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { ScoreBar } from '@/components/ui/ScoreBar';

const { width: W } = Dimensions.get('window');
const H_PAD = 20;
const CARD_PADDING = 16;
const CHART_W = W - H_PAD * 2 - CARD_PADDING * 2;
const CHART_H = 160;
const PAD = { top: 16, bottom: 36, left: 28, right: 12 };

const LINE_DATA = [
  { label: 'Mar 12', score: 6.0 },
  { label: 'Mar 19', score: 6.5 },
  { label: 'Mar 26', score: 6.5 },
  { label: 'Apr 2', score: 7.0 },
  { label: 'Apr 12', score: 7.5 },
];

const PERIOD_TABS = ['7d', '30d', '90d'];

const MODULE_CARDS = [
  { icon: '🎙', title: 'Speaking', score: 7.0, change: +0.5, color: Colors.p, bg: Colors.p_soft },
  { icon: '✏️', title: 'Writing', score: 6.5, change: -0.5, color: Colors.gold, bg: Colors.gold_bg },
  { icon: '🎧', title: 'Listening', score: 7.5, change: +1.0, color: Colors.green, bg: Colors.green_bg },
  { icon: '📖', title: 'Reading', score: 7.0, change: +0.5, color: Colors.orange, bg: Colors.orange_bg },
];

const RECENT_SESSIONS = [
  { icon: '🎙', title: 'Speaking', subtitle: 'Parts 1+2', date: 'Today', score: 7.0, color: Colors.p },
  { icon: '✏️', title: 'Writing', subtitle: 'Task 2', date: 'Yesterday', score: 6.5, color: Colors.gold },
  { icon: '🎧', title: 'Listening', subtitle: 'Sections 1-4', date: 'Apr 10', score: 7.5, color: Colors.green },
  { icon: '📖', title: 'Reading', subtitle: '3 Passages', date: 'Apr 9', score: 7.0, color: Colors.orange },
];

function LineChart({ data }: { data: { label: string; score: number }[] }) {
  const minY = 5.5;
  const maxY = 9.0;
  const range = maxY - minY;
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const gridLines = [6, 7, 8, 9];

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / (data.length - 1)) * innerW,
    y: PAD.top + (1 - (d.score - minY) / range) * innerH,
    label: d.label,
    score: d.score,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const prev = pts[i - 1];
    const cx = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cx.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  // Area fill path
  const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

  return (
    <Svg width={CHART_W} height={CHART_H}>
      {/* Grid lines */}
      {gridLines.map(v => {
        const y = PAD.top + (1 - (v - minY) / range) * innerH;
        return (
          <React.Fragment key={v}>
            <Line
              x1={PAD.left} y1={y.toFixed(1)}
              x2={CHART_W - PAD.right} y2={y.toFixed(1)}
              stroke={Colors.border} strokeWidth={1}
            />
            <SvgText
              x={0} y={(y + 4).toFixed(1)}
              fontSize={9} fill={Colors.ink3}
            >
              {v}
            </SvgText>
          </React.Fragment>
        );
      })}

      {/* Area fill */}
      <Path d={areaD} fill={Colors.p} fillOpacity={0.08} />

      {/* Line */}
      <Path d={pathD} fill="none" stroke={Colors.p} strokeWidth={2.5} strokeLinecap="round" />

      {/* Data points */}
      {pts.map((p, i) => (
        <React.Fragment key={i}>
          <Circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={5} fill={Colors.white} stroke={Colors.p} strokeWidth={2.5} />
          <SvgText
            x={p.x.toFixed(1)} y={(CHART_H - 8).toFixed(1)}
            fontSize={9} fill={Colors.ink3}
            textAnchor="middle"
          >
            {p.label}
          </SvgText>
        </React.Fragment>
      ))}
    </Svg>
  );
}

export default function ScoresScreen() {
  const [period, setPeriod] = useState('30d');
  const gridCardW = (W - H_PAD * 2 - 12) / 2;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Your Progress</Text>

        {/* Line chart */}
        <Card padding={CARD_PADDING}>
          <View style={s.chartHeader}>
            <Text style={s.cardTitle}>Score over time</Text>
            <View style={s.periodTabs}>
              {PERIOD_TABS.map(p => (
                <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[s.periodTab, period === p && s.periodTabActive]}>
                  <Text style={[s.periodTabText, period === p && s.periodTabTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <LineChart data={LINE_DATA} />
        </Card>

        {/* Module breakdown */}
        <Text style={s.sectionHeading}>Module Breakdown</Text>
        <View style={s.moduleGrid}>
          {MODULE_CARDS.map((m) => {
            const up = m.change >= 0;
            return (
              <View key={m.title} style={[s.moduleCard, { width: gridCardW, backgroundColor: m.bg }]}>
                <Text style={s.moduleIcon}>{m.icon}</Text>
                <Text style={[s.moduleTitle, { color: m.color }]}>{m.title}</Text>
                <Text style={[s.moduleScore, { color: m.color }]}>{m.score.toFixed(1)}</Text>
                <Text style={[s.moduleDelta, { color: up ? Colors.green : Colors.danger }]}>
                  {up ? '↑' : '↓'}{Math.abs(m.change).toFixed(1)} this month
                </Text>
              </View>
            );
          })}
        </View>

        {/* Section scores */}
        <Card padding={16} style={{ gap: 12 }}>
          <Text style={s.cardTitle}>Section Scores</Text>
          {MODULE_CARDS.map((m) => (
            <ScoreBar key={m.title} label={m.title} score={m.score} maxScore={9} color={m.color} />
          ))}
        </Card>

        {/* Recent sessions */}
        <Text style={s.sectionHeading}>Recent Sessions</Text>
        <View style={s.sessions}>
          {RECENT_SESSIONS.map((session, i) => (
            <View key={i} style={s.sessionRow}>
              <View style={[s.sessionIconWrap, { backgroundColor: session.color + '22' }]}>
                <Text style={s.sessionIcon}>{session.icon}</Text>
              </View>
              <View style={s.sessionInfo}>
                <Text style={s.sessionTitle}>{session.title} · {session.subtitle}</Text>
                <Text style={s.sessionDate}>{session.date}</Text>
              </View>
              <View style={[s.scoreBadge, { backgroundColor: session.color + '18' }]}>
                <Text style={[s.scoreBadgeText, { color: session.color }]}>
                  {session.score.toFixed(1)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: H_PAD, gap: 16 },
  title: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30, color: Colors.ink, marginBottom: 4 },
  cardTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  sectionHeading: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },

  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  periodTabs: { flexDirection: 'row', backgroundColor: Colors.bg2, borderRadius: 8, padding: 2, gap: 2 },
  periodTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  periodTabActive: { backgroundColor: Colors.white },
  periodTabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },
  periodTabTextActive: { fontFamily: 'Inter_700Bold', color: Colors.ink },

  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduleCard: { borderRadius: 16, padding: 16, gap: 4 },
  moduleIcon: { fontSize: 26 },
  moduleTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  moduleScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 36, lineHeight: 42 },
  moduleDelta: { fontFamily: 'Inter_500Medium', fontSize: 12 },

  sessions: { gap: 10 },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, padding: 12,
  },
  sessionIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sessionIcon: { fontSize: 22 },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  sessionDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  scoreBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  scoreBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});
