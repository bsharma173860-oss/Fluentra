/**
 * Exams page — matches page_exams.jsx ExamsPage
 * Dark hero + exam cards grid + leaderboard
 */
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { TrophyIcon } from '@/components/icons';

const C = {
  bg: '#F9F8F5', bg2: '#F4F1EB', bg3: '#EDEAE3', card: '#FFFFFF',
  border: '#EAEAEA', hairline: '#F4F4F4',
  ink: '#000000', ink2: '#333333', ink3: '#666666', ink4: '#999999', ink5: '#BBBBBB',
  brand: '#C04A06', brandLight: '#FFE5DE',
  speaking:  { c: '#5B4EFF', bg: '#EEEDFF' },
  writing:   { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
  reading:   { c: '#C04A06', bg: '#FFE5DE' },
};

const EXAMS = [
  { name: 'IELTS Academic', lang: 'en', color: C.speaking.c,  accentBg: C.speaking.bg,  next: 'Apr 28', score: '7.0', sessions: 18 },
  { name: 'TOEFL iBT',      lang: 'en', color: '#1558B0',     accentBg: '#EEF6FF',       next: 'May 12', score: '92',  sessions: 6  },
  { name: 'DELE B2',        lang: 'es', color: C.brand,       accentBg: C.brandLight,    next: 'Jun 04', score: '72',  sessions: 4  },
  { name: 'DELF B2',        lang: 'fr', color: '#1558B0',     accentBg: '#EEF6FF',       next: 'May 30', score: '68',  sessions: 2  },
  { name: 'JLPT N4',        lang: 'ja', color: '#C84070',     accentBg: '#FFE0EC',       next: 'Jul 07', score: 'B',   sessions: 5  },
  { name: 'Goethe B1',      lang: 'de', color: C.writing.c,   accentBg: C.writing.bg,    next: '—',      score: '—',   sessions: 0  },
];

const LEADERBOARD = [
  { rank: 1,  name: 'Akira Tanaka',  country: 'jp', score: '8.5', sessions: 54, you: false },
  { rank: 2,  name: 'Lena Nowak',    country: 'de', score: '8.5', sessions: 48, you: false },
  { rank: 3,  name: 'Pierre Dubois', country: 'fr', score: '8.0', sessions: 62, you: false },
  { rank: 18, name: 'María García',  country: 'es', score: '7.5', sessions: 24, you: true  },
  { rank: 19, name: 'Sam Patel',     country: 'in', score: '7.5', sessions: 21, you: false },
];

const FLAG_EMOJI: Record<string, string> = {
  en: '🇬🇧', jp: '🇯🇵', de: '🇩🇪', fr: '🇫🇷', es: '🇪🇸', in: '🇮🇳',
};

export default function ExamsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  if (isDesktop) {
    return (
      <AppLayout>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' } as any}>
          <div style={{ flex: 1, overflow: 'auto' } as any}>
            {/* Dark hero */}
            <div style={{ background: C.ink, color: '#fff', padding: '40px 36px', position: 'relative', overflow: 'hidden' } as any}>
              {/* Dot grid bg */}
              <div style={{ position: 'absolute', top: -50, right: -50, width: 400, height: 400, display: 'grid', gridTemplateColumns: 'repeat(20,1fr)', gap: 14, opacity: .06, pointerEvents: 'none' } as any}>
                {Array.from({ length: 300 }).map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' } as any} />)}
              </div>
              <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 32 } as any}>
                <div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.55)', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 10 } as any}>Certification track</div>
                  <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 48, lineHeight: 1.05, marginBottom: 10, maxWidth: 540 } as any}>Your road to certified.</div>
                  <div style={{ fontSize: 14, color: 'rgba(255,255,255,.7)', maxWidth: 540, lineHeight: 1.5 } as any}>Track scheduled exams, monthly mocks, and your global percentile. Practice runs are graded by the same rubrics as the real test.</div>
                </div>
                <div style={{ display: 'flex', gap: 32, alignItems: 'flex-end', flexShrink: 0 } as any}>
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 48, lineHeight: 1, color: '#fff' } as any}>P82</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 6 } as any}>Global percentile</div>
                  </div>
                  <div style={{ width: 1, height: 60, background: 'rgba(255,255,255,.18)' } as any} />
                  <div>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 48, lineHeight: 1, color: '#fff' } as any}>4</div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,.55)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginTop: 6 } as any}>Active exams</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: '28px 36px 40px' } as any}>
              {/* Next exam + mock tier */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14, marginBottom: 32 } as any}>
                <div style={{ background: C.brand, color: '#fff', borderRadius: 16, padding: '22px 26px', display: 'flex', alignItems: 'center', gap: 20 } as any}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 } as any}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                  <div style={{ flex: 1 } as any}>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,.7)', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 } as any}>Next up</div>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, lineHeight: 1.1 } as any}>IELTS Mock · Apr 28</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.75)', marginTop: 4 } as any}>2h 45m · all 4 modules · graded vs real bands</div>
                  </div>
                  <button style={{ padding: '10px 18px', borderRadius: 10, background: '#fff', color: C.brand, fontSize: 12.5, fontWeight: 700, border: 'none', cursor: 'pointer', flexShrink: 0 } as any}>
                    Start practice run →
                  </button>
                </div>

                <div style={{ background: C.card, border: `1.5px solid ${C.brand}33`, borderRadius: 16, padding: '18px 20px' } as any}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 8 } as any}>
                    <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 99, background: C.brandLight, fontSize: 10, fontWeight: 700, color: C.brand } as any}>Daily mock</span>
                    <span style={{ display: 'inline-flex', padding: '3px 9px', borderRadius: 99, background: C.listening.bg, fontSize: 10, fontWeight: 700, color: C.listening.c } as any}>Free on Pro</span>
                  </div>
                  <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: C.ink, lineHeight: 1.2, marginBottom: 6 } as any}>Take a mock without a streak.</div>
                  <div style={{ fontSize: 11.5, color: C.ink3, lineHeight: 1.45, marginBottom: 14 } as any}>Pro: unlimited daily mocks free. Free tier: $2 per session — same scoring rubric.</div>
                  <div style={{ display: 'flex', gap: 8 } as any}>
                    <button style={{ padding: '9px 16px', borderRadius: 9, background: C.brand, color: '#fff', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer' } as any}>Free mock →</button>
                    <button style={{ padding: '9px 16px', borderRadius: 9, background: 'transparent', color: C.ink2, fontSize: 12, fontWeight: 600, border: `1.5px solid ${C.border}`, cursor: 'pointer' } as any}>$5 official</button>
                  </div>
                </div>
              </div>

              {/* Exam cards */}
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 14 } as any}>All exams</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 } as any}>
                {EXAMS.map(e => (
                  <div key={e.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden', cursor: 'pointer' } as any}
                    onClick={() => router.push(`/(tabs)/exams` as any)}>
                    <div style={{ padding: '18px 20px', borderBottom: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center', gap: 12 } as any}>
                      <div style={{ width: 32, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 } as any}>
                        {FLAG_EMOJI[e.lang] ?? '🌐'}
                      </div>
                      <div style={{ flex: 1 } as any}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, lineHeight: 1.2 } as any}>{e.name}</div>
                        <div style={{ fontSize: 11, color: C.ink4, marginTop: 2 } as any}>{e.sessions} sessions logged</div>
                      </div>
                    </div>
                    <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
                      <div>
                        <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' } as any}>Best</div>
                        <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 24, color: C.ink, lineHeight: 1, marginTop: 3 } as any}>{e.score}</div>
                      </div>
                      <div style={{ textAlign: 'right' } as any}>
                        <div style={{ fontSize: 10, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' } as any}>Next mock</div>
                        <div style={{ fontSize: 13, color: C.ink, fontWeight: 600, marginTop: 3 } as any}>{e.next}</div>
                      </div>
                    </div>
                    <div style={{ padding: '12px 20px', background: C.bg2, borderTop: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
                      <div style={{ fontSize: 11.5, color: e.color, fontWeight: 700 } as any}>Open exam track</div>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={e.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </div>
                  </div>
                ))}
              </div>

              {/* Leaderboard */}
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, overflow: 'hidden' } as any}>
                <div style={{ padding: '18px 22px', borderBottom: `1px solid ${C.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as any}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink } as any}>IELTS · global leaderboard</div>
                    <div style={{ fontSize: 11, color: C.ink4, marginTop: 2 } as any}>Top 100 this month — your rank #18</div>
                  </div>
                  <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: 99, background: C.brandLight, fontSize: 11, fontWeight: 700, color: C.brand } as any}>You · #18</span>
                </div>
                {LEADERBOARD.map((row, i) => (
                  <div key={row.rank} style={{
                    display: 'grid', gridTemplateColumns: '40px 1fr 48px 100px 60px',
                    padding: '12px 22px', alignItems: 'center',
                    borderBottom: i < LEADERBOARD.length - 1 ? `1px solid ${C.hairline}` : 'none',
                    background: row.you ? C.brandLight : 'transparent',
                  } as any}>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: row.rank <= 3 ? C.brand : C.ink3 } as any}>#{row.rank}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 } as any}>
                      <div style={{ width: 30, height: 30, borderRadius: 15, background: C.brand, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 } as any}>{row.name[0]}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.ink } as any}>{row.name} {row.you && <span style={{ color: C.brand } as any}>· you</span>}</div>
                    </div>
                    <div style={{ fontSize: 18 } as any}>{FLAG_EMOJI[row.country] ?? '🌐'}</div>
                    <div style={{ fontSize: 12, color: C.ink3 } as any}>{row.sessions} sessions</div>
                    <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, color: C.ink, textAlign: 'right' } as any}>{row.score}</div>
                  </div>
                ))}
              </div>
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
          {/* Dark hero */}
          <View style={s.hero}>
            <Text style={s.heroEyebrow}>CERTIFICATION TRACK</Text>
            <Text style={s.heroTitle}>Your road to certified.</Text>
            <Text style={s.heroSub}>Track scheduled exams, monthly mocks, and your global percentile.</Text>
            <View style={{ flexDirection: 'row', gap: 24, marginTop: 20 }}>
              <View>
                <Text style={s.heroStat}>P82</Text>
                <Text style={s.heroStatLabel}>Global percentile</Text>
              </View>
              <View style={{ width: 1, backgroundColor: 'rgba(255,255,255,.18)' }} />
              <View>
                <Text style={s.heroStat}>4</Text>
                <Text style={s.heroStatLabel}>Active exams</Text>
              </View>
            </View>
          </View>

          <View style={{ padding: 16, gap: 14 }}>
            {/* Next exam */}
            <View style={[s.card, { backgroundColor: C.brand }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View style={s.trophyIcon}>
                  <TrophyIcon size={18} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.nextEyebrow}>NEXT UP</Text>
                  <Text style={s.nextTitle}>IELTS Mock · Apr 28</Text>
                  <Text style={s.nextSub}>2h 45m · all 4 modules</Text>
                </View>
              </View>
              <TouchableOpacity style={s.startBtn}>
                <Text style={s.startBtnText}>Start practice run →</Text>
              </TouchableOpacity>
            </View>

            {/* Exam cards */}
            <Text style={s.sectionTitle}>All exams</Text>
            {EXAMS.map(e => (
              <View key={e.name} style={s.examCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <Text style={{ fontSize: 24 }}>{FLAG_EMOJI[e.lang] ?? '🌐'}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={s.examName}>{e.name}</Text>
                    <Text style={s.examSessions}>{e.sessions} sessions logged</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View>
                    <Text style={s.examStatLabel}>BEST</Text>
                    <Text style={s.examScore}>{e.score}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={s.examStatLabel}>NEXT MOCK</Text>
                    <Text style={s.examNextDate}>{e.next}</Text>
                  </View>
                </View>
                <TouchableOpacity style={[s.examCta, { borderTopColor: C.hairline }]}>
                  <Text style={[s.examCtaText, { color: e.color }]}>Open exam track →</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Leaderboard */}
            <Text style={s.sectionTitle}>IELTS · global leaderboard</Text>
            <View style={s.card}>
              {LEADERBOARD.map((row, i) => (
                <View key={row.rank} style={[s.leaderRow, row.you && { backgroundColor: C.brandLight }, i < LEADERBOARD.length - 1 && { borderBottomWidth: 1, borderBottomColor: C.hairline }]}>
                  <Text style={[s.leaderRank, row.rank <= 3 && { color: C.brand }]}>#{row.rank}</Text>
                  <Text style={{ fontSize: 18 }}>{FLAG_EMOJI[row.country] ?? '🌐'}</Text>
                  <Text style={[s.leaderName, row.you && { color: C.brand }]}>{row.name}{row.you ? ' · you' : ''}</Text>
                  <Text style={s.leaderScore}>{row.score}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: C.ink, padding: 28, paddingBottom: 32 },
  heroEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,.55)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 10 },
  heroTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 36, color: '#fff', lineHeight: 40, marginBottom: 8 },
  heroSub: { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 20 },
  heroStat: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 40, color: '#fff', lineHeight: 42 },
  heroStatLabel: { fontFamily: 'Inter_700Bold', fontSize: 9.5, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 },
  card: { backgroundColor: C.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: C.border },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink },
  trophyIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,.2)', alignItems: 'center', justifyContent: 'center' },
  nextEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 9.5, color: 'rgba(255,255,255,.7)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  nextTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: '#fff', lineHeight: 22 },
  nextSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,.75)' },
  startBtn: { marginTop: 14, backgroundColor: '#fff', borderRadius: 10, padding: 12, alignItems: 'center' },
  startBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.brand },
  examCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  examName: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink },
  examSessions: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4, marginTop: 1 },
  examStatLabel: { fontFamily: 'Inter_700Bold', fontSize: 9, color: C.ink4, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 },
  examScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 24, color: C.ink, lineHeight: 26 },
  examNextDate: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: C.ink },
  examCta: { padding: 12, borderTopWidth: 1, backgroundColor: C.bg2 },
  examCtaText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8 },
  leaderRank: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 16, color: C.ink3, width: 36 },
  leaderName: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.ink, flex: 1 },
  leaderScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 16, color: C.ink },
});
