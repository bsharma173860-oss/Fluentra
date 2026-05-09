/**
 * Progress page — matches page_progress.jsx ProgressPage
 * Stats grid + line chart + module breakdown + heatmap + exam streams
 */
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { MicIcon, PenIcon, HeadphoneIcon, BookIcon } from '@/components/icons';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06', brandLight: '#FFE5DE', brandSoft: '#FFF0EE',
  speaking:  { c: '#5B4EFF', bg: '#EEEDFF' },
  writing:   { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
  reading:   { c: '#C04A06', bg: '#FFE5DE' },
};

const CHART_DATA = [
  { label: 'Mar 12', score: 6.0 }, { label: 'Mar 19', score: 6.5 },
  { label: 'Mar 26', score: 7.0 }, { label: 'Apr 2',  score: 7.0 },
  { label: 'Apr 5',  score: 7.0 }, { label: 'Apr 12', score: 7.5 },
];

const MODULES = [
  { Icon: MicIcon,        c: C.speaking,  title: 'Speaking',  score: 7.0, change: +0.5 },
  { Icon: PenIcon,        c: C.writing,   title: 'Writing',   score: 6.5, change: -0.5 },
  { Icon: HeadphoneIcon,  c: C.listening, title: 'Listening', score: 7.5, change: +1.0 },
  { Icon: BookIcon,       c: C.reading,   title: 'Reading',   score: 7.0, change: +0.5 },
];

const EXAM_STREAMS: Record<string, {
  key: string; label: string; subtitle: string; accent: string; bg: string;
  runs: { date: string; score: number; unit: string; label: string; delta: number | null; dur: string; verified?: boolean }[];
}> = {
  monthly: {
    key: 'monthly', label: 'Monthly · Official', subtitle: 'Counts toward your record · $5 each',
    accent: C.brand, bg: C.brandLight,
    runs: [
      { date: 'Apr 12', score: 7.5, unit: '/9', label: 'IELTS Academic · Full', delta: +0.5, dur: '2h 45m', verified: true },
      { date: 'Mar 14', score: 7.0, unit: '/9', label: 'IELTS Academic · Full', delta: +0.5, dur: '2h 40m', verified: true },
      { date: 'Feb 10', score: 6.5, unit: '/9', label: 'IELTS Academic · Full', delta: null, dur: '2h 50m', verified: true },
    ],
  },
  mock: {
    key: 'mock', label: 'Mock · Practice run', subtitle: 'Free · Not on your record',
    accent: '#5B7CFF', bg: '#EEF2FF',
    runs: [
      { date: 'Apr 18', score: 7.5, unit: '/9', label: 'Full mock', delta: +0.5, dur: '2h 38m' },
      { date: 'Apr 6',  score: 7.0, unit: '/9', label: 'Full mock', delta: 0,    dur: '2h 42m' },
      { date: 'Mar 28', score: 7.0, unit: '/9', label: 'Full mock', delta: +0.5, dur: '2h 50m' },
    ],
  },
  practice: {
    key: 'practice', label: 'Practice · Single skill', subtitle: 'Drills · Logged for analytics',
    accent: C.listening.c, bg: C.listening.bg,
    runs: [
      { date: 'Today',     score: 7.5, unit: '/9', label: 'Reading · Passage 2', delta: +0.5, dur: '18 min' },
      { date: 'Yesterday', score: 6.5, unit: '/9', label: 'Writing · Task 2',    delta: -0.5, dur: '42 min' },
      { date: '2d ago',    score: 8.0, unit: '/9', label: 'Listening · Sec 3',   delta: +1.0, dur: '14 min' },
    ],
  },
};

// ── Inline SVG line chart (web only) ──────────────────────────────
function MiniLineChart() {
  const data = CHART_DATA;
  const minY = 4, maxY = 9, w = 520, h = 160;
  const pad = { l: 34, r: 10, t: 14, b: 28 };
  const innerW = w - pad.l - pad.r, innerH = h - pad.t - pad.b;
  const pts = data.map((d, i) => ({
    x: pad.l + (i / Math.max(data.length - 1, 1)) * innerW,
    y: pad.t + (1 - (d.score - minY) / (maxY - minY)) * innerH,
    label: d.label, score: d.score,
  }));
  const path = pts.reduce((a, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i - 1]; const cx = prev.x + (p.x - prev.x) / 2;
    return `${a} C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
  }, '');
  const area = `${path} L ${pts[pts.length - 1].x} ${pad.t + innerH} L ${pts[0].x} ${pad.t + innerH} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' } as any}>
      {[5, 6, 7, 8, 9].map(g => {
        const y = pad.t + (1 - (g - minY) / (maxY - minY)) * innerH;
        return (
          <g key={g}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={C.hairline} />
            <text x={pad.l - 6} y={y + 3} fontSize="10" fill={C.ink4} textAnchor="end">{g}.0</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.brand} stopOpacity=".18" />
          <stop offset="100%" stopColor={C.brand} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#lineGrad)" />
      <path d={path} fill="none" stroke={C.brand} strokeWidth="2.5" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={C.brand} strokeWidth="2" />
          <text x={p.x} y={h - 6} fontSize="10" fill={C.ink4} textAnchor="middle">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Exam streams panel ─────────────────────────────────────────────
function ExamStreamsPanel() {
  const [tab, setTab] = useState<string>('monthly');
  const stream = EXAM_STREAMS[tab];
  const avg = (stream.runs.reduce((s, r) => s + r.score, 0) / stream.runs.length).toFixed(1);
  const best = Math.max(...stream.runs.map(r => r.score)).toFixed(1);

  if (Platform.OS === 'web') {
    return (
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' } as any}>
        <div style={{ padding: '18px 22px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.ink } as any}>Exam attempts</div>
            <div style={{ fontSize: 11, color: C.ink4, marginTop: 2 } as any}>Three separate logs · pick a stream below</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, padding: '14px 22px 0' } as any}>
          {Object.values(EXAM_STREAMS).map(s => {
            const on = s.key === tab;
            return (
              <button key={s.key} onClick={() => setTab(s.key)} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 13px', borderRadius: 9,
                border: `1px solid ${on ? s.accent : C.border}`,
                background: on ? s.bg : C.card, cursor: 'pointer',
              } as any}>
                <div style={{ fontSize: 11.5, fontWeight: on ? 700 : 600, color: on ? s.accent : C.ink2 } as any}>{s.label}</div>
                <div style={{ fontSize: 10, color: C.ink4, fontWeight: 600 } as any}>{s.runs.length}</div>
              </button>
            );
          })}
        </div>
        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '18px 22px', borderBottom: `1px solid ${C.hairline}`, marginTop: 14 } as any}>
          {[{ l: 'Attempts', v: stream.runs.length }, { l: 'Avg', v: `${avg}${stream.runs[0].unit}` }, { l: 'Best', v: `${best}${stream.runs[0].unit}` }].map((s, i) => (
            <div key={s.l} style={{ borderLeft: i > 0 ? `1px solid ${C.hairline}` : 'none', paddingLeft: i > 0 ? 18 : 0 } as any}>
              <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 5 } as any}>{s.l}</div>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: C.ink, lineHeight: 1 } as any}>{s.v}</div>
            </div>
          ))}
        </div>
        {/* Rows */}
        <div style={{ padding: '8px 12px 14px' } as any}>
          {stream.runs.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '72px 1fr auto auto', gap: 12, alignItems: 'center', padding: '12px 10px', borderRadius: 9, cursor: 'pointer' } as any} onMouseEnter={(e: any) => e.currentTarget.style.background = C.bg2} onMouseLeave={(e: any) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 600 } as any}>{r.date}</div>
              <div style={{ minWidth: 0 } as any}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 } as any}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink } as any}>{r.label}</div>
                  {r.verified && <div style={{ fontSize: 9, fontWeight: 800, color: stream.accent, background: stream.bg, padding: '2px 6px', borderRadius: 4, letterSpacing: '.06em' } as any}>VERIFIED</div>}
                </div>
                <div style={{ fontSize: 10.5, color: C.ink4, marginTop: 2 } as any}>{r.dur}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 } as any}>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: C.ink, lineHeight: 1 } as any}>{r.score.toFixed(1)}</div>
                <div style={{ fontSize: 10, color: C.ink4 } as any}>{r.unit}</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: r.delta == null ? C.ink4 : r.delta >= 0 ? C.listening.c : C.brand, minWidth: 36, textAlign: 'right' } as any}>
                {r.delta == null ? '—' : `${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(1)}`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <View style={es.card}>
      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 14 }}>
        {Object.values(EXAM_STREAMS).map(s => {
          const on = s.key === tab;
          return (
            <TouchableOpacity key={s.key} style={[es.tab, on && { backgroundColor: s.bg, borderColor: s.accent }]} onPress={() => setTab(s.key)}>
              <Text style={[es.tabText, on && { color: s.accent }]}>{s.label.split(' · ')[0]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: C.hairline }}>
        {[{ l: 'Attempts', v: String(stream.runs.length) }, { l: 'Avg', v: `${avg}${stream.runs[0].unit}` }, { l: 'Best', v: `${best}${stream.runs[0].unit}` }].map((s, i) => (
          <View key={s.l} style={[es.statBlock, i > 0 && { borderLeftWidth: 1, borderLeftColor: C.hairline, paddingLeft: 12 }]}>
            <Text style={es.statLabel}>{s.l}</Text>
            <Text style={es.statVal}>{s.v}</Text>
          </View>
        ))}
      </View>
      {stream.runs.map((r, i) => (
        <View key={i} style={es.runRow}>
          <Text style={es.runDate}>{r.date}</Text>
          <View style={{ flex: 1 }}>
            <Text style={es.runLabel} numberOfLines={1}>{r.label}</Text>
            <Text style={es.runDur}>{r.dur}</Text>
          </View>
          <Text style={es.runScore}>{r.score.toFixed(1)}{r.unit}</Text>
          <Text style={[es.runDelta, { color: r.delta == null ? C.ink4 : r.delta >= 0 ? C.listening.c : C.brand }]}>
            {r.delta == null ? '—' : `${r.delta >= 0 ? '+' : ''}${r.delta.toFixed(1)}`}
          </Text>
        </View>
      ))}
    </View>
  );
}

const es = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  tab: { flex: 1, padding: 8, borderRadius: 8, borderWidth: 1, borderColor: C.border, alignItems: 'center' },
  tabText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: C.ink3 },
  statBlock: { flex: 1 },
  statLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, color: C.ink4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  statVal: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: C.ink, lineHeight: 24 },
  runRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, borderTopWidth: 1, borderTopColor: C.hairline },
  runDate: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: C.ink4, width: 64 },
  runLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.ink },
  runDur: { fontFamily: 'Inter_400Regular', fontSize: 10, color: C.ink4, marginTop: 1 },
  runScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: C.ink },
  runDelta: { fontFamily: 'Inter_700Bold', fontSize: 11, width: 36, textAlign: 'right' },
});

// ── Main screen ────────────────────────────────────────────────────
export default function ProgressScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const STATS = [
    { eyebrow: 'Avg band', value: '7.0', delta: '+0.5', up: true },
    { eyebrow: 'Sessions', value: '24',  delta: '+6 this week', up: true },
    { eyebrow: 'Streak',   value: '23d', delta: 'Longest: 31d', up: null },
    { eyebrow: 'Time',     value: '18h', delta: '+2.4h vs last', up: true },
  ];

  if (isDesktop) {
    return (
      <AppLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
          <div style={{ flex: 1, overflow: 'auto', padding: '28px 36px 40px' } as any}>
            {/* Header */}
            <div style={{ marginBottom: 24 } as any}>
              <div style={{ fontSize: 11, color: C.ink4, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 } as any}>PROGRESS · ENGLISH</div>
              <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 40, color: C.ink, lineHeight: 1.05, marginBottom: 16 } as any}>You're trending up.</div>
              <div style={{ display: 'flex', gap: 4, padding: 3, background: C.bg2, borderRadius: 9, alignSelf: 'flex-start' } as any}>
                {['Week', 'Month', '3M', 'Year'].map((p, i) => (
                  <button key={p} style={{ padding: '5px 14px', fontSize: 12, fontWeight: i === 1 ? 700 : 500, color: i === 1 ? C.ink : C.ink3, background: i === 1 ? C.card : 'transparent', border: `1px solid ${i === 1 ? C.border : 'transparent'}`, borderRadius: 7, cursor: 'pointer' } as any}>{p}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 28, alignItems: 'start' } as any}>
              <div style={{ minWidth: 0 } as any}>
                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 } as any}>
                  {STATS.map(s => (
                    <div key={s.eyebrow} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 20 } as any}>
                      <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 } as any}>{s.eyebrow}</div>
                      <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 36, color: C.ink, lineHeight: 1, marginBottom: 6 } as any}>{s.value}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.up === true ? C.listening.c : s.up === false ? C.brand : C.ink4 } as any}>{s.delta}</div>
                    </div>
                  ))}
                </div>

                {/* Chart + module breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20, marginBottom: 24 } as any}>
                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 } as any}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 } as any}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.ink } as any}>Band score over time</div>
                        <div style={{ fontSize: 11, color: C.ink4, marginTop: 2 } as any}>English · last 30 days</div>
                      </div>
                      <div style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: C.listening.bg, fontSize: 11, fontWeight: 700, color: C.listening.c } as any}>Trending up</div>
                    </div>
                    <MiniLineChart />
                  </div>

                  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 } as any}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 14 } as any}>By module</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 } as any}>
                      {MODULES.map(m => (
                        <div key={m.title} style={{ display: 'flex', alignItems: 'center', gap: 12 } as any}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: m.c.bg, color: m.c.c, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                            <m.Icon size={13} color={m.c.c} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 } as any}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 } as any}>
                              <div style={{ fontSize: 12.5, fontWeight: 600, color: C.ink } as any}>{m.title}</div>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 } as any}>
                                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 16, color: C.ink, lineHeight: 1 } as any}>{m.score.toFixed(1)}</div>
                                <div style={{ fontSize: 10.5, color: m.change >= 0 ? C.listening.c : C.brand, fontWeight: 700 } as any}>{m.change >= 0 ? '+' : ''}{m.change.toFixed(1)}</div>
                              </div>
                            </div>
                            <div style={{ height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                              <div style={{ height: '100%', width: `${(m.score / 9) * 100}%`, background: m.c.c, borderRadius: 99 } as any} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Heatmap */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22, marginBottom: 24 } as any}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 } as any}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink } as any}>Activity · last 12 weeks</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: C.ink4 } as any}>
                      <span>Less</span>
                      {[C.bg3, '#F0D9CF', '#E5A78C', C.brand, '#7A2E00'].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: 3, background: c } as any} />)}
                      <span>More</span>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(84, 1fr)', gap: 3 } as any}>
                    {Array.from({ length: 84 }).map((_, i) => {
                      const v = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) / 2;
                      const lvl = v > .5 ? 4 : v > .2 ? 3 : v > -.1 ? 2 : v > -.4 ? 1 : 0;
                      const colors = [C.bg3, '#F0D9CF', '#E5A78C', C.brand, '#7A2E00'];
                      return <div key={i} style={{ aspectRatio: '1', borderRadius: 3, background: colors[lvl] } as any} />;
                    })}
                  </div>
                </div>

                <ExamStreamsPanel />
              </div>

              {/* Right rail */}
              <aside style={{ position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', gap: 14 } as any}>
                {/* Streak */}
                <div style={{ background: `linear-gradient(160deg, ${C.brandSoft} 0%, ${C.brandLight} 100%)`, border: `1px solid ${C.brand}26`, borderRadius: 14, padding: 16 } as any}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.brand, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 } as any}>Streak</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 } as any}>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, color: C.ink, lineHeight: 1 } as any}>23</div>
                    <div style={{ fontSize: 12, color: C.ink3 } as any}>days</div>
                  </div>
                  <div style={{ fontSize: 11, color: C.ink3, marginBottom: 10 } as any}>2 days from your longest run.</div>
                  <div style={{ display: 'flex', gap: 3 } as any}>
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} style={{ flex: 1, height: 18, borderRadius: 3, background: i < 12 ? C.brand : C.bg3 } as any} />
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 } as any}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.ink4, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 } as any}>Goals</div>
                  {[{ l: 'Reach band 7.5', pct: 78, meta: 'Avg 7.0 → 7.5' }, { l: '5 sessions / week', pct: 80, meta: '4 of 5 done' }, { l: 'Master 500 words', pct: 82, meta: '412 / 500' }].map(g => (
                    <div key={g.l} style={{ marginBottom: 14 } as any}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 } as any}>
                        <div style={{ fontSize: 11.5, fontWeight: 600, color: C.ink } as any}>{g.l}</div>
                        <div style={{ fontSize: 11, color: C.ink4 } as any}>{g.pct}%</div>
                      </div>
                      <div style={{ height: 5, background: C.bg3, borderRadius: 99, overflow: 'hidden' } as any}>
                        <div style={{ height: '100%', width: `${g.pct}%`, background: C.brand, borderRadius: 99 } as any} />
                      </div>
                      <div style={{ fontSize: 10, color: C.ink4, marginTop: 4 } as any}>{g.meta}</div>
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 } as any}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.ink4, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 } as any}>Insights</div>
                  <div style={{ fontSize: 12, color: C.ink2, lineHeight: 1.45, marginBottom: 10 } as any}>
                    Your <span style={{ color: C.writing.c, fontWeight: 700 } as any}>writing</span> dipped 0.5 this week. Try one Task 2 essay to recover momentum.
                  </div>
                  <button onClick={() => router.push('/modules/writing/select' as any)} style={{ fontSize: 11.5, fontWeight: 700, color: C.brand, background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 } as any}>
                    Open writing →
                  </button>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Mobile
  return (
    <AppLayout>
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }} edges={['top']}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
          <View style={{ gap: 4, marginBottom: 8 }}>
            <Text style={s.eyebrow}>PROGRESS · ENGLISH</Text>
            <Text style={s.pageTitle}>You're trending up.</Text>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {STATS.map(stat => (
              <View key={stat.eyebrow} style={s.statCard}>
                <Text style={s.statEyebrow}>{stat.eyebrow}</Text>
                <Text style={s.statValue}>{stat.value}</Text>
                <Text style={[s.statDelta, { color: stat.up === true ? C.listening.c : stat.up === false ? C.brand : C.ink4 }]}>{stat.delta}</Text>
              </View>
            ))}
          </View>

          {/* Module breakdown */}
          <View style={s.card}>
            <Text style={s.sectionTitle}>By module</Text>
            {MODULES.map(m => (
              <View key={m.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <View style={[s.modIcon, { backgroundColor: m.c.bg }]}>
                  <m.Icon size={13} color={m.c.c} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={s.modTitle}>{m.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                      <Text style={s.modScore}>{m.score.toFixed(1)}</Text>
                      <Text style={[s.modChange, { color: m.change >= 0 ? C.listening.c : C.brand }]}>{m.change >= 0 ? '+' : ''}{m.change.toFixed(1)}</Text>
                    </View>
                  </View>
                  <View style={s.progressTrack}>
                    <View style={[s.progressFill, { width: `${(m.score / 9) * 100}%` as any, backgroundColor: m.c.c }]} />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Streak card */}
          <View style={[s.card, { backgroundColor: C.brandSoft }]}>
            <Text style={[s.sectionTitle, { color: C.brand }]}>23-day streak</Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink3, marginBottom: 10 }}>2 days from your longest run of 31.</Text>
            <View style={{ flexDirection: 'row', gap: 3 }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <View key={i} style={{ flex: 1, height: 16, borderRadius: 3, backgroundColor: i < 12 ? C.brand : C.bg3 }} />
              ))}
            </View>
          </View>

          <ExamStreamsPanel />
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase' },
  pageTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: C.ink, lineHeight: 36 },
  statCard: { flex: 1, minWidth: '44%', backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  statEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9.5, color: C.ink4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 },
  statValue: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: C.ink, lineHeight: 34, marginBottom: 4 },
  statDelta: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink, marginBottom: 12 },
  modIcon: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  modTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12.5, color: C.ink },
  modScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 16, color: C.ink, lineHeight: 18 },
  modChange: { fontFamily: 'Inter_700Bold', fontSize: 10.5 },
  progressTrack: { height: 5, backgroundColor: C.bg3, borderRadius: 99, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 99 },
});
