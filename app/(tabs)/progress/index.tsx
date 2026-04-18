import React, { useState } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TouchableOpacity, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Svg, { Path, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { getLangNames } from '@/constants/languages';
import { getTheme } from '@/constants/languageThemes';
import { useUserLanguages } from '@/hooks/useUserLanguages';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/ui/EmptyState';

// ─── Dimensions ───────────────────────────────────────────────────────────────
const { width: W } = Dimensions.get('window');
const H_PAD = 20;
const CARD_PAD = 16;
const CHART_W = W - H_PAD * 2 - CARD_PAD * 2;
const CHART_H = 160;
const PAD = { top: 16, bottom: 36, left: 28, right: 12 };

const LANG_STATS: Record<string, { avgBand: number; sessions: number; bestScore: number; streak: number }> = {
  en: { avgBand: 7.0, sessions: 24, bestScore: 8.0, streak: 23 },
  es: { avgBand: 5.5, sessions: 8,  bestScore: 6.5, streak: 23 },
  fr: { avgBand: 4.5, sessions: 5,  bestScore: 5.5, streak: 23 },
};

const CHART_DATA: Record<string, { label: string; score: number }[]> = {
  en: [
    { label: 'Mar 12', score: 6.0 }, { label: 'Mar 15', score: 6.0 },
    { label: 'Mar 19', score: 6.5 }, { label: 'Mar 22', score: 6.5 },
    { label: 'Mar 26', score: 7.0 }, { label: 'Apr 2',  score: 7.0 },
    { label: 'Apr 5',  score: 7.0 }, { label: 'Apr 12', score: 7.5 },
  ],
  es: [
    { label: 'Mar 12', score: 4.5 }, { label: 'Mar 19', score: 5.0 },
    { label: 'Mar 26', score: 5.0 }, { label: 'Apr 2',  score: 5.5 },
    { label: 'Apr 12', score: 5.5 },
  ],
  fr: [
    { label: 'Mar 20', score: 4.0 }, { label: 'Apr 1',  score: 4.5 },
    { label: 'Apr 10', score: 4.5 },
  ],
};

type ModuleRow = { icon: string; title: string; score: number; change: number; color: string; bg: string };
const MODULE_DATA: Record<string, ModuleRow[]> = {
  en: [
    { icon: '🎙', title: 'Speaking',  score: 7.0, change: +0.5, color: Colors.p,      bg: Colors.p_soft    },
    { icon: '✏️', title: 'Writing',   score: 6.5, change: -0.5, color: Colors.gold,   bg: Colors.gold_bg   },
    { icon: '🎧', title: 'Listening', score: 7.5, change: +1.0, color: Colors.green,  bg: Colors.green_bg  },
    { icon: '📖', title: 'Reading',   score: 7.0, change: +0.5, color: Colors.orange, bg: Colors.orange_bg },
  ],
  es: [
    { icon: '🎙', title: 'Speaking',  score: 5.5, change: +0.5, color: Colors.p,      bg: Colors.p_soft    },
    { icon: '✏️', title: 'Writing',   score: 5.0, change: +0.0, color: Colors.gold,   bg: Colors.gold_bg   },
    { icon: '🎧', title: 'Listening', score: 6.0, change: +0.5, color: Colors.green,  bg: Colors.green_bg  },
    { icon: '📖', title: 'Reading',   score: 5.5, change: -0.5, color: Colors.orange, bg: Colors.orange_bg },
  ],
  fr: [
    { icon: '🎙', title: 'Speaking',  score: 4.5, change: +0.5, color: Colors.p,      bg: Colors.p_soft    },
    { icon: '✏️', title: 'Writing',   score: 4.0, change: +0.5, color: Colors.gold,   bg: Colors.gold_bg   },
    { icon: '🎧', title: 'Listening', score: 5.0, change: +0.5, color: Colors.green,  bg: Colors.green_bg  },
    { icon: '📖', title: 'Reading',   score: 4.5, change: +0.0, color: Colors.orange, bg: Colors.orange_bg },
  ],
};

type ExamCard = { name: string; avg: number; sessions: number; lastDate: string; color: string; bg: string };
const EXAM_DATA: Record<string, ExamCard[]> = {
  en: [
    { name: 'IELTS Academic', avg: 7.0, sessions: 18, lastDate: 'Apr 12', color: Colors.p,      bg: Colors.p_soft  },
    { name: 'TOEFL iBT',      avg: 6.5, sessions: 6,  lastDate: 'Mar 20', color: '#1558B0',     bg: '#EEF6FF'      },
  ],
  es: [
    { name: 'DELE B2', avg: 5.5, sessions: 4, lastDate: 'Mar 15', color: Colors.orange, bg: Colors.orange_bg },
  ],
  fr: [
    { name: 'DELF B2', avg: 4.5, sessions: 2, lastDate: 'Feb 28', color: '#1558B0',     bg: '#EEF6FF'        },
  ],
};

type Session = {
  icon: string; module: string; exam: string; date: string;
  duration: string; score: number; color: string; lang: string;
};
const ALL_SESSIONS: Session[] = [
  { icon: '🎙', module: 'Speaking',  exam: 'IELTS', date: 'Today',     duration: '14 min', score: 7.0, color: Colors.p,      lang: 'en' },
  { icon: '✏️', module: 'Writing',   exam: 'IELTS', date: 'Yesterday', duration: '38 min', score: 6.5, color: Colors.gold,   lang: 'en' },
  { icon: '🎧', module: 'Listening', exam: 'IELTS', date: 'Apr 10',    duration: '40 min', score: 7.5, color: Colors.green,  lang: 'en' },
  { icon: '📖', module: 'Reading',   exam: 'IELTS', date: 'Apr 9',     duration: '58 min', score: 7.0, color: Colors.orange, lang: 'en' },
  { icon: '🎙', module: 'Speaking',  exam: 'DELE',  date: 'Apr 8',     duration: '12 min', score: 6.5, color: Colors.p,      lang: 'es' },
];

// ─── Line chart ───────────────────────────────────────────────────────────────
function LineChart({ data, lineColor }: { data: { label: string; score: number }[]; lineColor: string }) {
  const minY = 4.0;
  const maxY = 9.0;
  const range = maxY - minY;
  const innerW = CHART_W - PAD.left - PAD.right;
  const innerH = CHART_H - PAD.top - PAD.bottom;
  const gridLines = [5, 6, 7, 8, 9];

  const pts = data.map((d, i) => ({
    x: PAD.left + (i / Math.max(data.length - 1, 1)) * innerW,
    y: PAD.top + (1 - (d.score - minY) / range) * innerH,
    label: d.label, score: d.score,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    const prev = pts[i - 1];
    const cx = prev.x + (p.x - prev.x) / 2;
    return `${acc} C ${cx.toFixed(1)} ${prev.y.toFixed(1)} ${cx.toFixed(1)} ${p.y.toFixed(1)} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');
  const areaD = `${pathD} L ${pts[pts.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${PAD.left.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

  return (
    <Svg width={CHART_W} height={CHART_H}>
      {gridLines.map(v => {
        const y = PAD.top + (1 - (v - minY) / range) * innerH;
        return (
          <React.Fragment key={v}>
            <Line x1={PAD.left} y1={y.toFixed(1)} x2={CHART_W - PAD.right} y2={y.toFixed(1)} stroke={Colors.border} strokeWidth={1} />
            <SvgText x={0} y={(y + 4).toFixed(1)} fontSize={9} fill={Colors.ink3}>{v}</SvgText>
          </React.Fragment>
        );
      })}
      <Path d={areaD} fill={lineColor} fillOpacity={0.08} />
      <Path d={pathD} fill="none" stroke={lineColor} strokeWidth={2.5} strokeLinecap="round" />
      {pts.map((p, i) => (
        <React.Fragment key={i}>
          <Circle cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={5} fill={Colors.white} stroke={lineColor} strokeWidth={2.5} />
          {(i === 0 || i === pts.length - 1 || pts.length <= 5) && (
            <SvgText x={p.x.toFixed(1)} y={(CHART_H - 8).toFixed(1)} fontSize={9} fill={Colors.ink3} textAnchor="middle">
              {p.label.replace('Mar ', 'M').replace('Apr ', 'A').replace('Feb ', 'F')}
            </SvgText>
          )}
        </React.Fragment>
      ))}
    </Svg>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
const PERIOD_TABS = ['7d', '30d', '90d'];

export default function ProgressScreen() {
  const { lang: initialLang } = useLocalSearchParams<{ lang?: string }>();
  const { languages } = useUserLanguages();

  const availableCodes = languages.length > 0
    ? languages.map(l => l.language_code)
    : ['en', 'es', 'fr'];

  const [lang, setLang] = useState(initialLang ?? availableCodes[0] ?? 'en');
  const [period, setPeriod] = useState('30d');
  const [examFilter, setExamFilter] = useState('all');

  const theme   = getTheme(lang);
  const stats   = LANG_STATS[lang] ?? LANG_STATS.en;
  const modules = MODULE_DATA[lang] ?? MODULE_DATA.en;
  const allExams = EXAM_DATA[lang] ?? [];
  const exams   = examFilter === 'all' ? allExams : allExams.filter(e => e.name.toLowerCase().includes(examFilter.toLowerCase()));
  const sessions = ALL_SESSIONS.filter(s => s.lang === lang);
  const chartData = CHART_DATA[lang] ?? CHART_DATA.en;

  // Exam filter pills derived from available exams for current language
  const examPills = ['all', ...allExams.map(e => e.name.split(' ')[0])];

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <Text style={s.title}>Your Progress</Text>

        {/* ── Language selector ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.pillScroll} contentContainerStyle={s.pillRow}>
          {availableCodes.map(code => {
            const t = getTheme(code);
            const active = lang === code;
            return (
              <TouchableOpacity
                key={code}
                style={[s.pill, active && { backgroundColor: t.accent, borderColor: t.accent }]}
                onPress={() => { setLang(code); setExamFilter('all'); }}
                activeOpacity={0.75}
              >
                <Text style={s.pillFlag}>{t.flag}</Text>
                <View style={s.pillTextBlock}>
                  <Text style={[s.pillNative, active && s.pillNativeActive]}>{t.native}</Text>
                  {t.native !== t.name && (
                    <Text style={[s.pillEnglish, active && s.pillEnglishActive]}>{t.name}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Overall stats ── */}
        <View style={s.statsGrid}>
          <View style={[s.statCard, { backgroundColor: theme.accentLight }]}>
            <Text style={s.statLabel}>AVG BAND SCORE</Text>
            <Text style={[s.statNum, { color: theme.accent }]}>{stats.avgBand.toFixed(1)}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: Colors.bg2 }]}>
            <Text style={s.statLabel}>SESSIONS</Text>
            <Text style={[s.statNum, { color: Colors.ink }]}>{stats.sessions}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: Colors.gold_bg }]}>
            <Text style={s.statLabel}>BEST SCORE</Text>
            <Text style={[s.statNum, { color: Colors.gold }]}>{stats.bestScore.toFixed(1)}</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: Colors.orange_bg }]}>
            <Text style={s.statLabel}>STREAK</Text>
            <Text style={[s.statNum, { color: Colors.orange }]}>🔥 {stats.streak}d</Text>
          </View>
        </View>

        {/* ── By exam filter pills ── */}
        {allExams.length > 1 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', gap: 8 }}>
            {examPills.map(pill => {
              const active = examFilter === pill;
              return (
                <TouchableOpacity
                  key={pill}
                  style={[s.examPill, active && { backgroundColor: theme.accent, borderColor: theme.accent }]}
                  onPress={() => setExamFilter(pill)}
                  activeOpacity={0.75}
                >
                  <Text style={[s.examPillText, active && { color: Colors.white }]}>
                    {pill === 'all' ? 'All' : pill}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* ── Band score chart ── */}
        <View style={s.chartCard}>
          <View style={s.chartHeader}>
            <Text style={s.sectionTitle}>Band score</Text>
            <View style={s.periodTabs}>
              {PERIOD_TABS.map(p => (
                <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={[s.periodTab, period === p && s.periodTabActive]}>
                  <Text style={[s.periodTabText, period === p && s.periodTabTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <LineChart data={chartData} lineColor={theme.accent} />
        </View>

        {/* ── Module scores ── */}
        <Text style={s.sectionTitle}>Module scores</Text>
        <View style={s.moduleCard}>
          {modules.map((m, i) => {
            const up = m.change > 0;
            const flat = m.change === 0;
            const pct = (m.score / 9) * 100;
            return (
              <View key={m.title} style={[s.moduleRow, i < modules.length - 1 && s.moduleRowBorder]}>
                <View style={[s.moduleIconWrap, { backgroundColor: m.bg }]}>
                  <Text style={s.moduleIcon}>{m.icon}</Text>
                </View>
                <View style={s.moduleMeta}>
                  <View style={s.moduleTitleRow}>
                    <Text style={[s.moduleTitle, { color: m.color }]}>{m.title}</Text>
                    {!flat && (
                      <Text style={[s.moduleChange, { color: up ? Colors.green : Colors.danger }]}>
                        {up ? '↑' : '↓'}{Math.abs(m.change).toFixed(1)}
                      </Text>
                    )}
                  </View>
                  <View style={s.moduleBarTrack}>
                    <View style={[s.moduleBarFill, { width: `${pct}%` as any, backgroundColor: m.color }]} />
                  </View>
                </View>
                <Text style={[s.moduleScore, { color: m.color }]}>{m.score.toFixed(1)}</Text>
              </View>
            );
          })}
        </View>

        {/* ── By exam ── */}
        <Text style={s.sectionTitle}>By exam</Text>
        <View style={s.examList}>
          {exams.map(exam => (
            <View key={exam.name} style={s.examCard}>
              <View style={s.examCardTop}>
                <View style={[s.examBadge, { backgroundColor: exam.bg }]}>
                  <Text style={[s.examBadgeText, { color: exam.color }]}>{exam.name}</Text>
                </View>
                <Text style={[s.examAvg, { color: exam.color }]}>{exam.avg.toFixed(1)}</Text>
              </View>
              <View style={s.examMeta}>
                <Text style={s.examMetaText}>📅 {exam.sessions} sessions · Last {exam.lastDate}</Text>
              </View>
              <TouchableOpacity
                style={[s.practiceBtn, { borderColor: exam.color + '55' }]}
                onPress={() => router.push('/(tabs)/exams' as any)}
                activeOpacity={0.75}
              >
                <Text style={[s.practiceBtnText, { color: exam.color }]}>Practice →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* ── Recent sessions ── */}
        <Text style={s.sectionTitle}>Recent sessions</Text>
        {sessions.length === 0 ? (
          <EmptyState
            icon="📊"
            title="No sessions yet"
            subtitle="Complete your first practice session to see your progress"
          />
        ) : (
          <View style={s.sessionList}>
            {sessions.map((session, i) => (
              <View key={i} style={s.sessionRow}>
                <View style={[s.sessionIconWrap, { backgroundColor: session.color + '22' }]}>
                  <Text style={s.sessionIcon}>{session.icon}</Text>
                </View>
                <View style={s.sessionInfo}>
                  <Text style={s.sessionTitle}>{session.module} · {session.exam}</Text>
                  <Text style={s.sessionMeta}>{session.date} · {session.duration}</Text>
                </View>
                <View style={[s.scoreBadge, { backgroundColor: session.color + '18' }]}>
                  <Text style={[s.scoreBadgeText, { color: session.color }]}>{session.score.toFixed(1)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: H_PAD, gap: 16 },
  title: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30, color: Colors.ink },

  pillScroll: { marginHorizontal: -H_PAD },
  pillRow: { flexDirection: 'row', gap: 8, paddingHorizontal: H_PAD },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 99, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  pillFlag: { fontSize: 16 },
  pillTextBlock: { gap: 0 },
  pillNative: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.ink },
  pillNativeActive: { color: Colors.white },
  pillEnglish: { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  pillEnglishActive: { color: 'rgba(255,255,255,0.65)' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { flex: 1, minWidth: '45%', borderRadius: 16, padding: 14, gap: 6 },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3, letterSpacing: 0.5 },
  statNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 30 },

  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    padding: CARD_PAD, gap: 12,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  periodTabs: { flexDirection: 'row', backgroundColor: Colors.bg2, borderRadius: 8, padding: 2, gap: 2 },
  periodTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  periodTabActive: { backgroundColor: Colors.white },
  periodTabText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink3 },
  periodTabTextActive: { fontFamily: 'Inter_700Bold', color: Colors.ink },

  moduleCard: {
    backgroundColor: Colors.white,
    borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  moduleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  moduleRowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  moduleIconWrap: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  moduleIcon: { fontSize: 20 },
  moduleMeta: { flex: 1, gap: 5 },
  moduleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  moduleTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  moduleChange: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  moduleBarTrack: { height: 5, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  moduleBarFill: { height: '100%', borderRadius: 99 },
  moduleScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22 },

  examPill: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: Colors.white,
    borderWidth: 1, borderColor: Colors.border,
  },
  examPillText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },

  examList: { gap: 12 },
  examCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    borderWidth: 1, borderColor: Colors.border, padding: 16, gap: 10,
  },
  examCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  examBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  examBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  examAvg: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28 },
  examMeta: {},
  examMetaText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
  practiceBtn: {
    borderWidth: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center',
  },
  practiceBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14 },

  emptyCard: {
    backgroundColor: Colors.bg2, borderRadius: 14, padding: 20, alignItems: 'center',
  },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  sessionList: { gap: 10 },
  sessionRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white, borderRadius: 14,
    borderWidth: 1, borderColor: Colors.border, padding: 12,
  },
  sessionIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sessionIcon: { fontSize: 22 },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  sessionMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  scoreBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  scoreBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
});
