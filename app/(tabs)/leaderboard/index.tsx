import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const LB_REGIONS = ['Global', 'Europe', 'Asia', 'Americas', 'Africa', 'Oceania'];
const LB_TIME    = ['This week', 'This month', 'All time'];
const LB_MODULE  = ['Overall', 'Reading', 'Listening', 'Speaking', 'Writing'];

const LB_TOP3 = [
  { rank: 1, name: 'Aiko Tanaka',  country: '🇯🇵', score: '8.9', delta: '+0.2', streak: 178 },
  { rank: 2, name: 'Lukas Bauer',  country: '🇩🇪', score: '8.8', delta: '+0.1', streak: 142 },
  { rank: 3, name: 'Sofia Rossi',  country: '🇮🇹', score: '8.7', delta: '',     streak: 96  },
];

const LB_ROWS = [
  { rank: 4,   name: 'Yuki Nakamura',   country: '🇯🇵', score: '8.6', delta: '+0.3', streak: 120, ses: 184, user: false },
  { rank: 5,   name: 'Priya Sharma',    country: '🇮🇳', score: '8.6', delta: '+0.2', streak: 88,  ses: 155, user: false },
  { rank: 6,   name: 'Marcus Holm',     country: '🇸🇪', score: '8.5', delta: '',     streak: 62,  ses: 142, user: false },
  { rank: 7,   name: 'Léa Dubois',      country: '🇫🇷', score: '8.5', delta: '+0.1', streak: 74,  ses: 131, user: false },
  { rank: 8,   name: 'Carlos Mendes',   country: '🇧🇷', score: '8.4', delta: '-0.1', streak: 51,  ses: 128, user: false },
  { rank: 9,   name: 'Olivia Bennett',  country: '🇬🇧', score: '8.4', delta: '+0.2', streak: 99,  ses: 122, user: false },
  { rank: 10,  name: 'Hiroshi Sato',    country: '🇯🇵', score: '8.4', delta: '',     streak: 115, ses: 118, user: false },
  { rank: 11,  name: 'Anna Kowalski',   country: '🇵🇱', score: '8.3', delta: '+0.1', streak: 42,  ses: 111, user: false },
  { rank: 12,  name: 'Diego Hernández', country: '🇲🇽', score: '8.3', delta: '-0.2', streak: 33,  ses: 107, user: false },
  { rank: 13,  name: 'Min-Jun Park',    country: '🇰🇷', score: '8.3', delta: '+0.4', streak: 108, ses: 104, user: false },
  { rank: 489, name: 'Priya S.',        country: '🇮🇳', score: '7.6', delta: '+0.2', streak: 39,  ses: 62,  user: false },
  { rank: 490, name: 'Ahmed K.',        country: '🇪🇬', score: '7.6', delta: '',     streak: 51,  ses: 58,  user: false },
  { rank: 491, name: 'You',             country: '🇪🇸', score: '7.5', delta: '+0.3', streak: 42,  ses: 142, user: true  },
  { rank: 492, name: 'María L.',        country: '🇲🇽', score: '7.5', delta: '-0.1', streak: 18,  ses: 54,  user: false },
  { rank: 493, name: 'James T.',        country: '🇬🇧', score: '7.4', delta: '+0.1', streak: 24,  ses: 50,  user: false },
  { rank: 494, name: 'Fatima Rahman',   country: '🇧🇩', score: '7.4', delta: '',     streak: 45,  ses: 48,  user: false },
];

const PODIUM_COLORS  = { 1: '#FFD37A', 2: '#D4D6DA', 3: '#E0A571' } as Record<number, string>;
const PODIUM_BORDERS = { 1: '#F5B43E', 2: '#9CA0A8', 3: '#B27B3F' } as Record<number, string>;

function PodiumCard({ entry, place }: { entry: typeof LB_TOP3[0]; place: number }) {
  const heights = { 1: 110, 2: 84, 3: 66 } as Record<number, number>;
  const color  = PODIUM_COLORS[place];
  const ring   = PODIUM_BORDERS[place];
  return (
    <View style={[p.wrap, { flex: 1 }]}>
      <View style={[p.avatar, { borderColor: ring }]}>
        <Text style={p.avatarLetter}>{entry.name[0]}</Text>
        <View style={[p.rankBadge, { backgroundColor: ring }]}>
          <Text style={p.rankBadgeText}>{place}</Text>
        </View>
      </View>
      <Text style={p.name} numberOfLines={1}>{entry.name}</Text>
      <Text style={p.country}>{entry.country} · {entry.streak}d</Text>
      <View style={[p.podiumBar, { height: heights[place], backgroundColor: color, borderColor: ring + '60' }]}>
        <Text style={p.podiumScore}>{entry.score}</Text>
        <Text style={p.podiumLabel}>band</Text>
      </View>
    </View>
  );
}

const p = StyleSheet.create({
  wrap:         { alignItems: 'center', gap: 6 },
  avatar:       { width: 60, height: 60, borderRadius: 30, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center', borderWidth: 3, position: 'relative' },
  avatarLetter: { fontFamily: T.serif, fontSize: 24, color: '#fff' },
  rankBadge:    { position: 'absolute', bottom: -4, right: -4, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: T.bg },
  rankBadgeText:{ fontSize: 10, fontWeight: '700', color: '#fff' },
  name:         { fontSize: 12, fontWeight: '700', color: T.ink, textAlign: 'center' },
  country:      { fontSize: 10, color: T.ink4, textAlign: 'center' },
  podiumBar:    { width: '100%', borderRadius: 10, borderWidth: 1, borderBottomWidth: 0, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 12 },
  podiumScore:  { fontFamily: T.serif, fontSize: 26, color: T.ink },
  podiumLabel:  { fontSize: 10, color: T.ink4, fontWeight: '600', marginTop: 2 },
});

function DeltaPill({ delta }: { delta: string }) {
  if (!delta) return <Text style={{ color: T.ink5, fontSize: 11 }}>—</Text>;
  const up = delta.startsWith('+');
  return <Text style={{ fontSize: 11, fontWeight: '700', color: up ? T.listening : '#B00020' }}>{up ? '▲' : '▼'} {delta.replace(/[+-]/, '')}</Text>;
}

function LBRow({ r, last }: { r: typeof LB_ROWS[0]; last: boolean }) {
  return (
    <View style={[row.wrap, r.user && row.userWrap, !last && { borderBottomWidth: 1, borderBottomColor: T.hairline }]}>
      <Text style={[row.rank, r.user && { color: T.brand, fontWeight: '700' }]}>#{r.rank}</Text>
      <View style={row.nameCol}>
        <View style={[row.avatar, r.user && { backgroundColor: T.brand }]}>
          <Text style={[row.avatarText, r.user && { color: '#fff' }]}>{r.name[0]}</Text>
        </View>
        <View>
          <Text style={[row.nameText, r.user && { fontWeight: '700', color: T.brand }]}>{r.name}</Text>
          <Text style={row.nameSub}>{r.country} · {r.streak}d streak</Text>
        </View>
      </View>
      <Text style={[row.score, r.user && { color: T.brand }]}>{r.score}</Text>
      <View style={{ width: 44, alignItems: 'center' }}><DeltaPill delta={r.delta} /></View>
      <Text style={row.sessions}>{r.ses} ses</Text>
    </View>
  );
}

const row = StyleSheet.create({
  wrap:      { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  userWrap:  { backgroundColor: T.brandSoft },
  rank:      { width: 40, fontSize: 12, fontWeight: '500', color: T.ink4 },
  nameCol:   { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar:    { width: 30, height: 30, borderRadius: 15, backgroundColor: T.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText:{ fontFamily: T.serif, fontSize: 13, color: T.ink3 },
  nameText:  { fontSize: 13, fontWeight: '600', color: T.ink },
  nameSub:   { fontSize: 10.5, color: T.ink4, marginTop: 1 },
  score:     { fontFamily: T.serif, fontSize: 17, color: T.ink, width: 42, textAlign: 'right' },
  sessions:  { width: 52, fontSize: 11, color: T.ink4, textAlign: 'right' },
});

export default function LeaderboardScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [region, setRegion] = useState('Global');
  const [time,   setTime]   = useState('This week');
  const [mod,    setMod]    = useState('Overall');

  const myRow = LB_ROWS.find(r => r.user);

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.eyebrow}>Rankings</Text>
        <Text style={s.heroTitle}>Leaderboard</Text>
        <Text style={s.heroSub}>26,420 learners · Updated 2 minutes ago</Text>
      </View>

      {/* Your position card */}
      {myRow && (
        <View style={s.myCard}>
          <View style={s.myLeft}>
            <Text style={s.myLabel}>Your rank</Text>
            <Text style={s.myRank}>#{myRow.rank}</Text>
            <Text style={s.myMeta}>{myRow.streak}-day streak · {myRow.ses} sessions</Text>
          </View>
          <View style={s.myRight}>
            <Text style={s.myScoreLabel}>Band score</Text>
            <Text style={s.myScore}>{myRow.score}</Text>
            <DeltaPill delta={myRow.delta} />
          </View>
        </View>
      )}

      {/* Filters */}
      <View style={s.filtersSection}>
        <Text style={s.filterLabel}>REGION</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={s.filterRow}>
            {LB_REGIONS.map(r => (
              <TouchableOpacity key={r} style={[s.chip, region === r && s.chipActive]} onPress={() => setRegion(r)}>
                <Text style={[s.chipText, region === r && s.chipTextActive]}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={[s.filterLabel, { marginTop: 10 }]}>TIME</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={s.filterRow}>
            {LB_TIME.map(t => (
              <TouchableOpacity key={t} style={[s.chip, time === t && s.chipActive]} onPress={() => setTime(t)}>
                <Text style={[s.chipText, time === t && s.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={[s.filterLabel, { marginTop: 10 }]}>MODULE</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
          <View style={s.filterRow}>
            {LB_MODULE.map(m => (
              <TouchableOpacity key={m} style={[s.chip, mod === m && s.chipActive]} onPress={() => setMod(m)}>
                <Text style={[s.chipText, mod === m && s.chipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Podium */}
      <View style={s.podiumSection}>
        <Text style={s.sectionTitle}>THIS WEEK'S PODIUM</Text>
        <View style={s.podiumCard}>
          <View style={s.podiumRow}>
            <PodiumCard entry={LB_TOP3[1]} place={2} />
            <PodiumCard entry={LB_TOP3[0]} place={1} />
            <PodiumCard entry={LB_TOP3[2]} place={3} />
          </View>
        </View>
      </View>

      {/* Rankings table */}
      <View style={s.tableSection}>
        <View style={s.tableHeader}>
          <Text style={s.tableHeaderText}>RANKINGS</Text>
          <Text style={s.tableHeaderSub}>{region} · {mod}</Text>
        </View>
        <View style={s.tableCard}>
          <View style={s.tableColHeaders}>
            <Text style={[s.colHead, { width: 40 }]}>#</Text>
            <Text style={[s.colHead, { flex: 1 }]}>Learner</Text>
            <Text style={[s.colHead, { width: 42, textAlign: 'right' }]}>Band</Text>
            <Text style={[s.colHead, { width: 44, textAlign: 'center' }]}>Δ</Text>
            <Text style={[s.colHead, { width: 52, textAlign: 'right' }]}>Sessions</Text>
          </View>
          {LB_ROWS.map((r, i) => (
            <LBRow key={r.rank} r={r} last={i === LB_ROWS.length - 1} />
          ))}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: T.bg },
  scroll:       { paddingBottom: 20 },
  scrollDesktop:{ padding: 28, paddingHorizontal: 36, maxWidth: 900, alignSelf: 'center', width: '100%' },

  header:    { padding: 20, paddingBottom: 16 },
  eyebrow:   { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  heroTitle: { fontFamily: T.serif, fontSize: 32, color: T.ink, lineHeight: 36 },
  heroSub:   { fontSize: 13, color: T.ink4, marginTop: 4 },

  myCard:    { marginHorizontal: 16, marginBottom: 16, backgroundColor: T.brand, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  myLeft:    { gap: 4 },
  myLabel:   { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.7, textTransform: 'uppercase' },
  myRank:    { fontFamily: T.serif, fontSize: 36, color: '#fff', lineHeight: 40 },
  myMeta:    { fontSize: 12, color: 'rgba(255,255,255,0.75)' },
  myRight:   { alignItems: 'flex-end', gap: 4 },
  myScoreLabel: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.7)', letterSpacing: 0.7, textTransform: 'uppercase' },
  myScore:   { fontFamily: T.serif, fontSize: 48, color: '#fff', lineHeight: 52 },

  filtersSection: { paddingHorizontal: 16, paddingBottom: 8 },
  filterLabel:    { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 },
  filterRow:      { flexDirection: 'row', gap: 6, paddingBottom: 2 },
  chip:           { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: T.border, backgroundColor: T.card },
  chipActive:     { borderColor: T.brand, backgroundColor: T.brandSoft },
  chipText:       { fontSize: 12, fontWeight: '600', color: T.ink4 },
  chipTextActive: { color: T.brand },

  podiumSection:  { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle:   { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 },
  podiumCard:     { backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, padding: 20 },
  podiumRow:      { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },

  tableSection:   { paddingHorizontal: 16 },
  tableHeader:    { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 },
  tableHeaderText:{ fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase' },
  tableHeaderSub: { fontSize: 11, color: T.ink5 },
  tableCard:      { backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  tableColHeaders:{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: T.hairline, gap: 10 },
  colHead:        { fontSize: 10, fontWeight: '700', color: T.ink5, textTransform: 'uppercase', letterSpacing: 0.5 },
});
