import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { T } from '@/constants/theme';

type Confetti = { color: string; top: string; left?: string; right?: string; rotate: string; w?: number; h?: number; round?: boolean };
const CONFETTI: Confetti[] = [
  { color: '#C04A06', top: '10%', left: '8%',  rotate: '20deg' },
  { color: '#1A8F4E', top: '18%', right: '12%', rotate: '-15deg', w: 6, h: 14 },
  { color: '#5B4EFF', top: '60%', left: '4%',  rotate: '45deg' },
  { color: '#A65A00', top: '72%', right: '6%', rotate: '10deg', round: true },
  { color: '#C84070', top: '30%', right: '4%', rotate: '0deg', round: true, w: 10, h: 10 },
  { color: '#E8732F', top: '84%', left: '30%', rotate: '-30deg' },
];

const NEXT_ACTIONS = [
  { ic: '🎓', title: 'Pick up Lesson 4', sub: 'Ordering coffee · 12 min' },
  { ic: '🎁', title: 'Refer a friend',   sub: 'Both get 30 days free' },
] as const;

export default function PaymentSuccessScreen() {
  const { plan = 'Pro', amount = '89.99', email = 'your email' } = useLocalSearchParams<any>();

  if (Platform.OS === 'web') {
    return (
      <div style={{ margin: 0, background: 'linear-gradient(180deg,#FFF0EE 0%,#F9F8F5 60%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 540, width: '100%', textAlign: 'center', position: 'relative' }}>
          {/* Confetti */}
          <div style={{ position: 'absolute', inset: '-40px -60px', pointerEvents: 'none' }}>
            {CONFETTI.map((c, i) => (
              <span key={i} style={{
                position: 'absolute', width: c.w ?? 8, height: c.h ?? 8,
                background: c.color, borderRadius: c.round ? '50%' : 1,
                top: c.top, left: (c as any).left, right: (c as any).right,
                transform: `rotate(${c.rotate})`,
              }} />
            ))}
          </div>

          {/* Check */}
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#1A8F4E', color: '#fff', margin: '0 auto 22px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 40px rgba(26,143,78,.3)' }}>
            <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={3}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, color: '#1A8F4E', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>Payment confirmed</div>
          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 42, lineHeight: 1.05, margin: '0 0 14px', color: T.ink }}>
            Welcome to <em style={{ fontStyle: 'italic', color: T.brand }}>Fluentra {plan}</em>, María.
          </h1>
          <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.5, margin: '0 auto 28px', maxWidth: 380 }}>
            Your annual plan is active. We've sent a receipt to {email}.
          </p>

          {/* Receipt */}
          <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, textAlign: 'left', overflow: 'hidden', marginBottom: 24 }}>
            <div style={{ padding: '16px 22px', borderBottom: `1px solid ${T.hairline}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: 13, color: T.ink }}>Receipt</strong>
              <span style={{ fontSize: 11, color: T.ink4, fontFamily: 'ui-monospace, monospace' }}>#FLU-2025-08412</span>
            </div>
            {[
              { l: 'Plan',    v: `${plan} · Annual` },
              { l: 'Payment', v: 'Visa ··· 4242' },
              { l: 'Renews',  v: 'Mar 11, 2026' },
            ].map(r => (
              <div key={r.l} style={{ padding: '11px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, color: T.ink2, borderBottom: `1px solid ${T.hairline}` }}>
                <span>{r.l}</span><strong style={{ color: T.ink, fontWeight: 600 }}>{r.v}</strong>
              </div>
            ))}
            <div style={{ padding: '14px 22px', background: T.bg2, fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 18, color: T.ink, display: 'flex', justifyContent: 'space-between' }}>
              <span>Total charged</span><span>${amount}</span>
            </div>
          </div>

          {/* Next actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
            {NEXT_ACTIONS.map(a => (
              <div key={a.title} style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 12, padding: 14, textAlign: 'left', cursor: 'pointer' }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: T.brandSoft, color: T.brand, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8, fontSize: 14 }}>{a.ic}</div>
                <strong style={{ fontSize: 12.5, color: T.ink, display: 'block' }}>{a.title}</strong>
                <p style={{ fontSize: 11, color: T.ink4, marginTop: 2, lineHeight: 1.4 }}>{a.sub}</p>
              </div>
            ))}
          </div>

          <button onClick={() => window.location.href = '/'} style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700, borderRadius: 99, padding: '13px 28px', border: 0, cursor: 'pointer', background: T.brand, color: '#fff' }}>
            Back to my dashboard →
          </button>
          <div style={{ fontSize: 11, color: T.ink4, marginTop: 14 }}>
            Need help? <a style={{ color: T.ink3, textDecoration: 'underline' }} href="/help">Contact support</a> · <a style={{ color: T.ink3, textDecoration: 'underline' }} href="/settings">Manage billing</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Check circle */}
        <View style={s.checkCircle}>
          <Text style={s.checkMark}>✓</Text>
        </View>

        <Text style={s.eyebrow}>Payment confirmed</Text>
        <Text style={s.title}>Welcome to{'\n'}
          <Text style={{ color: T.brand }}>Fluentra {plan}</Text>
        </Text>
        <Text style={s.lede}>
          Your annual plan is active.{email ? `\nWe've sent a receipt to ${email}.` : ''}
        </Text>

        {/* Receipt */}
        <View style={s.receipt}>
          <View style={s.receiptHeader}>
            <Text style={s.receiptTitle}>Receipt</Text>
            <Text style={s.receiptId}>#FLU-2025-08412</Text>
          </View>
          {[
            { l: 'Plan',    v: `${plan} · Annual` },
            { l: 'Payment', v: 'Visa ··· 4242' },
            { l: 'Renews',  v: 'Mar 11, 2026' },
          ].map((r, i, arr) => (
            <View key={r.l} style={[s.receiptRow, i < arr.length - 1 && s.receiptBorder]}>
              <Text style={s.receiptLabel}>{r.l}</Text>
              <Text style={s.receiptValue}>{r.v}</Text>
            </View>
          ))}
          <View style={s.receiptTotal}>
            <Text style={s.receiptTotalLabel}>Total charged</Text>
            <Text style={s.receiptTotalValue}>${amount}</Text>
          </View>
        </View>

        {/* Next actions */}
        <View style={s.nextRow}>
          {NEXT_ACTIONS.map(a => (
            <View key={a.title} style={s.nextCard}>
              <Text style={s.nextIc}>{a.ic}</Text>
              <Text style={s.nextTitle}>{a.title}</Text>
              <Text style={s.nextSub}>{a.sub}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={s.primaryBtn} onPress={() => router.replace('/(tabs)/home' as any)} activeOpacity={0.85}>
          <Text style={s.primaryBtnText}>Back to my dashboard →</Text>
        </TouchableOpacity>

        <Text style={s.meta}>
          Need help?{' '}
          <Text style={s.metaLink} onPress={() => router.push('/help' as any)}>Contact support</Text>
          {' · '}
          <Text style={s.metaLink} onPress={() => router.push('/settings' as any)}>Manage billing</Text>
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: T.brandSoft },
  scroll:         { alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 20 },

  checkCircle:    { width: 80, height: 80, borderRadius: 40, backgroundColor: '#1A8F4E', alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  checkMark:      { fontSize: 32, color: '#fff', fontWeight: '700' },

  eyebrow:        { fontSize: 11, fontWeight: '700', color: '#1A8F4E', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
  title:          { fontFamily: T.serif, fontSize: 34, color: T.ink, textAlign: 'center', lineHeight: 40, marginBottom: 12 },
  lede:           { fontSize: 14, color: T.ink3, textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 340 },

  receipt:        { width: '100%', backgroundColor: T.card, borderRadius: T.rMd, borderWidth: 1, borderColor: T.border, overflow: 'hidden', marginBottom: 20 },
  receiptHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: T.hairline },
  receiptTitle:   { fontSize: 13, fontWeight: '700', color: T.ink },
  receiptId:      { fontSize: 11, color: T.ink4, fontFamily: 'monospace' },
  receiptRow:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 11 },
  receiptBorder:  { borderBottomWidth: 1, borderBottomColor: T.hairline },
  receiptLabel:   { fontSize: 13, color: T.ink2 },
  receiptValue:   { fontSize: 13, fontWeight: '600', color: T.ink },
  receiptTotal:   { flexDirection: 'row', justifyContent: 'space-between', padding: 14, backgroundColor: T.bg2 },
  receiptTotalLabel: { fontFamily: T.serif, fontSize: 16, color: T.ink },
  receiptTotalValue: { fontFamily: T.serif, fontSize: 16, color: T.ink },

  nextRow:        { flexDirection: 'row', gap: 10, width: '100%', marginBottom: 20 },
  nextCard:       { flex: 1, backgroundColor: T.card, borderRadius: 12, borderWidth: 1, borderColor: T.border, padding: 14 },
  nextIc:         { fontSize: 22, marginBottom: 8 },
  nextTitle:      { fontSize: 12.5, fontWeight: '700', color: T.ink, marginBottom: 2 },
  nextSub:        { fontSize: 11, color: T.ink4, lineHeight: 16 },

  primaryBtn:     { backgroundColor: T.brand, borderRadius: T.rPill, paddingVertical: 14, paddingHorizontal: 28, alignItems: 'center', marginBottom: 14, width: '100%' },
  primaryBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  meta:           { fontSize: 11, color: T.ink4, textAlign: 'center' },
  metaLink:       { color: T.ink3, textDecorationLine: 'underline' },
});
