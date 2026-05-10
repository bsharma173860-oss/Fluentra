import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { T } from '@/constants/theme';

// ── Per-day config ─────────────────────────────────────────────────────────
type DayConfig = {
  label:       string;
  pill:        string;
  pillColor:   string;
  pillBg:      string;
  stripeColor: string;
  title:       string;
  titleColor:  string;
  lede:        string;
  showRecap:   boolean;
  showTimer:   boolean;
  timerBg:     string;
  offer:       string;
  offerBg:     string;
  offerBorder: string;
  offerColor:  string;
  primaryLabel:string;
  primaryBg:   string;
  ghostLabel:  string;
};

const DAY_CONFIG: Record<number, DayConfig> = {
  5: {
    label:       'Day 5 of 7',
    pill:        '3 days left',
    pillColor:   T.ink3,
    pillBg:      T.bg2,
    stripeColor: T.ink5,
    title:       "You're 5 days in. Look how far you've come.",
    titleColor:  T.ink,
    lede:        "Most people who finish trial keep going. Your trial ends Sunday — here's what you've already built.",
    showRecap:   true,
    showTimer:   false,
    timerBg:     T.ink,
    offer:       'Pick a plan early and lock in $8.99/mo ($14.99 crossed out) — your trial isn\'t shortened.',
    offerBg:     T.brandSoft,
    offerBorder: T.brandLight,
    offerColor:  T.ink2,
    primaryLabel:'See plans',
    primaryBg:   T.brand,
    ghostLabel:  'Remind me tomorrow',
  },
  6: {
    label:       'Day 6 of 7',
    pill:        '⚠ 1 day, 14h left',
    pillColor:   '#A65A00',
    pillBg:      '#FFEAC2',
    stripeColor: '#A65A00',
    title:       'Last full day to keep your streak.',
    titleColor:  T.ink,
    lede:        "Your 6-day streak resets if you don't pick a plan before Sunday 11:59pm. We'd love to keep going with you.",
    showRecap:   false,
    showTimer:   true,
    timerBg:     T.ink,
    offer:       'Annual is $89.99/yr — that\'s $7.50/mo. Cancel anytime in the first 30 days for a full refund.',
    offerBg:     T.brandSoft,
    offerBorder: T.brandLight,
    offerColor:  T.ink2,
    primaryLabel:'Continue with annual',
    primaryBg:   T.brand,
    ghostLabel:  'Or pay monthly',
  },
  7: {
    label:       'Day 7 — final',
    pill:        '● 6h 12m left',
    pillColor:   '#C0392B',
    pillBg:      '#FCE6E2',
    stripeColor: '#C0392B',
    title:       'Trial ends tonight at midnight.',
    titleColor:  '#7A2A1F',
    lede:        'After that your streak, vocab deck, and tutor history go on pause. Pick a plan to keep them.',
    showRecap:   false,
    showTimer:   true,
    timerBg:     '#7A2A1F',
    offer:       'Final offer: annual at $79.99 ($89.99 crossed out) — only valid for the next 6 hours.',
    offerBg:     '#FCE6E2',
    offerBorder: '#F4C9C0',
    offerColor:  '#7A2A1F',
    primaryLabel:'Claim $79.99 annual',
    primaryBg:   '#C0392B',
    ghostLabel:  'Continue free (lose Pro)',
  },
};

// Mock countdown — replace with real expiry timestamp in production
function useCountdown(day: number) {
  const [time, setTime] = useState({ d: day === 6 ? '01' : '00', h: day === 6 ? '14' : '06', m: '22' });
  return time;
}

export default function TrialWarningsScreen() {
  const { day = '5' } = useLocalSearchParams<{ day: string }>();
  const dayNum = Math.min(Math.max(parseInt(day, 10) || 5, 5), 7);
  const cfg = DAY_CONFIG[dayNum];
  const timer = useCountdown(dayNum);

  if (Platform.OS === 'web') {
    return (
      <div style={{ margin: 0, background: T.bg2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '36px 24px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 420, width: '100%', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 18, padding: 26, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
          {/* Top stripe */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: cfg.stripeColor }} />

          {/* Header row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22, marginTop: 8 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: T.ink4, textTransform: 'uppercase', letterSpacing: '.1em' }}>{cfg.label}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: cfg.pillBg, color: cfg.pillColor, fontVariantNumeric: 'tabular-nums' }}>{cfg.pill}</span>
          </div>

          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 24, lineHeight: 1.1, margin: '0 0 10px', color: cfg.titleColor }}>{cfg.title}</h1>
          <p style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 18 }}>{cfg.lede}</p>

          {/* Recap */}
          {cfg.showRecap && (
            <div style={{ background: T.bg, border: `1px solid ${T.hairline}`, borderRadius: 12, padding: 14, display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              {[{ v: '5', l: 'Streak' }, { v: '86', l: 'Words' }, { v: 'A2+', l: 'Speaking' }].map(it => (
                <div key={it.l} style={{ textAlign: 'center', flex: 1 }}>
                  <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 20, color: T.ink, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{it.v}</div>
                  <div style={{ fontSize: 9, fontWeight: 700, color: T.ink4, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 4 }}>{it.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Timer */}
          {cfg.showTimer && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, fontVariantNumeric: 'tabular-nums' }}>
              {[{ v: timer.d, l: 'Days' }, { v: timer.h, l: 'Hours' }, { v: timer.m, l: 'Min' }].map(t => (
                <div key={t.l} style={{ flex: 1, background: cfg.timerBg, color: '#fff', borderRadius: 8, padding: '10px 0', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, display: 'block', lineHeight: 1 }}>{t.v}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{t.l}</div>
                </div>
              ))}
            </div>
          )}

          {/* Offer */}
          <div style={{ border: `1.5px dashed ${cfg.offerBorder}`, background: cfg.offerBg, borderRadius: 12, padding: 14, marginBottom: 18, fontSize: 12.5, color: cfg.offerColor, lineHeight: 1.45 }}>
            {cfg.offer}
          </div>

          {/* CTAs */}
          <button onClick={() => window.location.href = '/upgrade'} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: '11px 0', border: 0, cursor: 'pointer', textAlign: 'center', background: cfg.primaryBg, color: '#fff', marginBottom: 8 }}>{cfg.primaryLabel}</button>
          <button onClick={() => window.history.back()} style={{ fontFamily: 'inherit', fontSize: 11, fontWeight: 600, background: 'transparent', border: 0, cursor: 'pointer', color: T.ink3, textAlign: 'center', padding: '6px 0' }}>{cfg.ghostLabel}</button>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Stripe accent at top of card */}
        <View style={[s.stripe, { backgroundColor: cfg.stripeColor }]} />

        <View style={s.cardBody}>
          {/* Row: label + pill */}
          <View style={s.topRow}>
            <Text style={s.dayLabel}>{cfg.label}</Text>
            <View style={[s.pill, { backgroundColor: cfg.pillBg }]}>
              <Text style={[s.pillText, { color: cfg.pillColor }]}>{cfg.pill}</Text>
            </View>
          </View>

          <Text style={[s.title, { color: cfg.titleColor }]}>{cfg.title}</Text>
          <Text style={s.lede}>{cfg.lede}</Text>

          {/* Recap stats */}
          {cfg.showRecap && (
            <View style={s.recapBox}>
              {[{ v: '5', l: 'Streak' }, { v: '86', l: 'Words' }, { v: 'A2+', l: 'Speaking' }].map((it, i, arr) => (
                <View key={it.l} style={[s.recapItem, i < arr.length - 1 && s.recapBorder]}>
                  <Text style={s.recapVal}>{it.v}</Text>
                  <Text style={s.recapLabel}>{it.l}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Timer */}
          {cfg.showTimer && (
            <View style={s.timerRow}>
              {[{ v: timer.d, l: 'Days' }, { v: timer.h, l: 'Hours' }, { v: timer.m, l: 'Min' }].map(t => (
                <View key={t.l} style={[s.timerBlock, { backgroundColor: cfg.timerBg }]}>
                  <Text style={s.timerNum}>{t.v}</Text>
                  <Text style={s.timerSub}>{t.l}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Offer */}
          <View style={[s.offerBox, { backgroundColor: cfg.offerBg, borderColor: cfg.offerBorder }]}>
            <Text style={[s.offerText, { color: cfg.offerColor }]}>{cfg.offer}</Text>
          </View>

          {/* CTAs */}
          <TouchableOpacity style={[s.primaryBtn, { backgroundColor: cfg.primaryBg }]} onPress={() => router.push('/upgrade' as any)} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>{cfg.primaryLabel}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.ghostText}>{cfg.ghostLabel}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: T.bg2 },
  scroll:      { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },
  stripe:      { height: 4, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  cardBody:    { backgroundColor: T.card, borderWidth: 1, borderTopWidth: 0, borderColor: T.border, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, padding: 24 },

  topRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  dayLabel:    { fontSize: 10, fontWeight: '700', color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.8 },
  pill:        { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 99 },
  pillText:    { fontSize: 10, fontWeight: '700' },

  title:       { fontFamily: T.serif, fontSize: 22, lineHeight: 27, marginBottom: 10 },
  lede:        { fontSize: 13, color: T.ink3, lineHeight: 20, marginBottom: 16 },

  recapBox:    { backgroundColor: T.bg, borderRadius: 12, borderWidth: 1, borderColor: T.hairline, padding: 14, flexDirection: 'row', marginBottom: 16 },
  recapItem:   { flex: 1, alignItems: 'center' },
  recapBorder: { borderRightWidth: 1, borderRightColor: T.hairline },
  recapVal:    { fontFamily: T.serif, fontSize: 20, color: T.ink, lineHeight: 24 },
  recapLabel:  { fontSize: 9, fontWeight: '700', color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },

  timerRow:    { flexDirection: 'row', gap: 6, marginBottom: 16 },
  timerBlock:  { flex: 1, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  timerNum:    { fontFamily: T.serif, fontSize: 22, color: '#fff', lineHeight: 26 },
  timerSub:    { fontSize: 9, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 0.6 },

  offerBox:    { borderWidth: 1.5, borderRadius: 12, padding: 14, marginBottom: 16, borderStyle: 'dashed' },
  offerText:   { fontSize: 12.5, lineHeight: 19 },

  primaryBtn:  { borderRadius: 99, paddingVertical: 12, alignItems: 'center', marginBottom: 8 },
  primaryBtnText:{ fontSize: 13, fontWeight: '700', color: '#fff' },
  ghostText:   { fontSize: 11, fontWeight: '600', color: T.ink3, textAlign: 'center', paddingVertical: 8 },
});
