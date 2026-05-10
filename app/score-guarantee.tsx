import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';

const STEPS = [
  { n: '1', b: 'Take the placement test',     s: '~10 minutes. We record your starting CEFR (e.g. A2) and lock it in.' },
  { n: '2', b: 'Follow the plan for 90 days', s: '5 sessions / week, average 20 min. We track it automatically.' },
  { n: '3', b: 'Retest at day 90',            s: 'Same rubric, same examiner. Move up at least one band — or claim a full refund in one tap.' },
];

export default function ScoreGuaranteeScreen() {
  const { width } = useWindowDimensions();

  // ── Web ────────────────────────────────────────────────────────────────────
  if (Platform.OS === 'web') {
    const narrow = width < 760;
    return (
      <div style={{ margin: 0, background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 920, width: '100%', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 24, overflow: 'hidden', display: 'grid', gridTemplateColumns: narrow ? '1fr' : '1.05fr 1fr' }}>

          {/* Left */}
          <div style={{ padding: '48px 44px', background: `linear-gradient(160deg, #fff 0%, ${T.brandSoft} 100%)`, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 32, right: 32, width: 96, height: 96, borderRadius: '50%', background: T.ink, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', lineHeight: 1.2, textTransform: 'uppercase', transform: 'rotate(-8deg)', boxShadow: '0 8px 24px rgba(0,0,0,.18)' }}>
              Score
              <span style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, fontWeight: 400, display: 'block', lineHeight: 1, margin: '3px 0' }}>+1</span>
              level<br />or refund
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.brand, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14 }}>The Fluentra promise</div>
            <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 46, lineHeight: 1.02, margin: '0 0 18px', color: T.ink }}>
              Move up <em style={{ fontStyle: 'italic', color: T.brand }}>at least one CEFR level</em> in 90 days — or your money back.
            </h1>
            <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.55, marginBottom: 24, maxWidth: 420 }}>
              Stick with the plan we set in onboarding — 20 minutes a day, 5 days a week. If your speaking and writing scores don't move from where you started, we'll refund every cent.
            </p>
            <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 16, padding: 20, marginBottom: 18 }}>
              <strong style={{ fontSize: 13, color: T.ink, display: 'block', marginBottom: 4 }}>What we measure</strong>
              <p style={{ fontSize: 12.5, color: T.ink3, lineHeight: 1.5, margin: 0 }}>Speaking + Writing scored on the official CEFR rubric, before and after. Not vocab counted, not lessons completed — actual fluency.</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button onClick={() => window.location.href = '/upgrade'} style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700, borderRadius: 99, padding: '13px 24px', border: 0, cursor: 'pointer', background: T.brand, color: '#fff' }}>Start with the guarantee</button>
              <button style={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 700, borderRadius: 99, padding: '13px 24px', border: 0, cursor: 'pointer', background: 'transparent', color: T.ink3, textDecoration: 'underline' }}>Read the fine print</button>
            </div>
          </div>

          {/* Right */}
          <div style={{ padding: '48px 44px', background: T.bg2, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 22, margin: '0 0 4px', fontWeight: 400, color: T.ink }}>How it works</h2>
            {STEPS.map(st => (
              <div key={st.n} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: T.brand, color: '#fff', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{st.n}</div>
                <div>
                  <div style={{ fontSize: 13, color: T.ink, fontWeight: 600, marginBottom: 2 }}>{st.b}</div>
                  <div style={{ fontSize: 12, color: T.ink3, lineHeight: 1.5 }}>{st.s}</div>
                </div>
              </div>
            ))}
            <div style={{ background: '#fff', borderLeft: `3px solid ${T.brand}`, padding: '14px 16px', borderRadius: '0 12px 12px 0', fontSize: 12.5, color: T.ink2, fontStyle: 'italic', lineHeight: 1.5 }}>
              "I went from A2 to B1+ in 11 weeks. The guarantee made me actually show up."
              <span style={{ display: 'block', marginTop: 8, fontStyle: 'normal', fontSize: 11, color: T.ink4, fontWeight: 600 }}>— María G., Madrid</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Native ─────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <Text style={s.backBtnText}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>The Fluentra Promise</Text>
        </View>

        <View style={s.heroPanel}>
          <View style={s.seal}>
            <Text style={s.sealLine}>Score</Text>
            <Text style={s.sealBig}>+1</Text>
            <Text style={s.sealLine}>level</Text>
            <Text style={s.sealLine}>or refund</Text>
          </View>
          <Text style={s.eyebrow}>The Fluentra Promise</Text>
          <Text style={s.heroTitle}>
            Move up{' '}
            <Text style={{ color: T.brand, fontFamily: T.serif }}>at least one CEFR level</Text>
            {' '}in 90 days — or your money back.
          </Text>
          <Text style={s.lede}>
            Stick with the plan we set in onboarding — 20 minutes a day, 5 days a week. If your speaking and writing scores don't move from where you started, we'll refund every cent.
          </Text>
        </View>

        <View style={s.card}>
          <Text style={s.cardTitle}>What we measure</Text>
          <Text style={s.cardBody}>Speaking + Writing scored on the official CEFR rubric, before and after. Not vocab counted, not lessons completed — actual fluency.</Text>
        </View>

        <View style={s.section}>
          <Text style={s.sectionTitle}>How it works</Text>
          {STEPS.map(st => (
            <View key={st.n} style={s.stepRow}>
              <View style={s.stepNum}><Text style={s.stepNumText}>{st.n}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={s.stepBold}>{st.b}</Text>
                <Text style={s.stepSub}>{st.s}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={s.quoteBlock}>
          <Text style={s.quoteText}>"I went from A2 to B1+ in 11 weeks. The guarantee made me actually show up."</Text>
          <Text style={s.quoteWho}>— María G., Madrid</Text>
        </View>

        <View style={s.ctaSection}>
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.push('/upgrade' as any)} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>Start with the guarantee</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={s.ghostText}>Read the fine print</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: T.bg },
  scroll:        { paddingBottom: 20 },
  header:        { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn:       { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText:   { fontSize: 18, color: T.ink3 },
  headerTitle:   { fontSize: 15, fontWeight: '700', color: T.ink },
  heroPanel:     { backgroundColor: T.brandSoft, padding: 28, paddingTop: 36 },
  seal:          { alignSelf: 'flex-end', width: 82, height: 82, borderRadius: 41, backgroundColor: T.ink, alignItems: 'center', justifyContent: 'center', marginBottom: 16, transform: [{ rotate: '-8deg' }] },
  sealLine:      { fontSize: 8, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.6, lineHeight: 12 },
  sealBig:       { fontFamily: T.serif, fontSize: 20, color: '#fff', lineHeight: 24 },
  eyebrow:       { fontSize: 11, fontWeight: '700', color: T.brand, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10 },
  heroTitle:     { fontFamily: T.serif, fontSize: 28, lineHeight: 34, color: T.ink, marginBottom: 14 },
  lede:          { fontSize: 14, color: T.ink2, lineHeight: 22 },
  card:          { backgroundColor: T.card, margin: 16, borderRadius: T.rMd, borderWidth: 1, borderColor: T.border, padding: 18 },
  cardTitle:     { fontSize: 13, fontWeight: '700', color: T.ink, marginBottom: 4 },
  cardBody:      { fontSize: 12.5, color: T.ink3, lineHeight: 19 },
  section:       { margin: 16, marginTop: 0, gap: 16 },
  sectionTitle:  { fontFamily: T.serif, fontSize: 20, color: T.ink, marginBottom: 4 },
  stepRow:       { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  stepNum:       { width: 28, height: 28, borderRadius: 14, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  stepNumText:   { fontSize: 13, fontWeight: '700', color: '#fff' },
  stepBold:      { fontSize: 13, fontWeight: '600', color: T.ink, marginBottom: 2 },
  stepSub:       { fontSize: 12, color: T.ink3, lineHeight: 18 },
  quoteBlock:    { backgroundColor: T.card, marginHorizontal: 16, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: T.brand, borderTopRightRadius: 12, borderBottomRightRadius: 12, padding: 16 },
  quoteText:     { fontSize: 13, color: T.ink2, fontStyle: 'italic', lineHeight: 20, marginBottom: 8 },
  quoteWho:      { fontSize: 11, color: T.ink4, fontWeight: '600' },
  ctaSection:    { paddingHorizontal: 16, gap: 12 },
  primaryBtn:    { backgroundColor: T.brand, borderRadius: T.rPill, paddingVertical: 14, alignItems: 'center' },
  primaryBtnText:{ fontSize: 14, fontWeight: '700', color: '#fff' },
  ghostText:     { fontSize: 13, color: T.ink3, textDecorationLine: 'underline', textAlign: 'center', paddingVertical: 6 },
});
