import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';

const PLANS = [
  {
    key: 'monthly', label: 'Monthly', price: '$12', period: '/month', badge: null,
    features: ['Unlimited practice sessions', 'All 4 skill modules', 'AI speaking + writing feedback', '1 monthly official exam', 'Mock exams: $2 each'],
  },
  {
    key: 'annual', label: 'Annual', price: '$8', period: '/month', badge: 'Best value · Save 33%',
    features: ['Everything in Monthly', 'Unlimited mock exams free', 'Priority AI feedback', 'Downloadable progress reports', 'Offline access'],
  },
  {
    key: 'free', label: 'Free', price: '$0', period: '', badge: null,
    features: ['2 sessions per week', 'Speaking + Listening only', 'Basic feedback', 'Community leaderboard'],
  },
];

const FEATURE_COMPARE = [
  { feature: 'Practice sessions',         free: '2/week',    pro: 'Unlimited' },
  { feature: 'Skill modules',             free: '2 modules', pro: 'All 4' },
  { feature: 'AI writing feedback',       free: '—',         pro: '✓' },
  { feature: 'AI speaking feedback',      free: 'Basic',     pro: 'Full + tips' },
  { feature: 'Official exam (monthly)',   free: '$5 each',   pro: '1 included' },
  { feature: 'Mock exams',                free: '$2 each',   pro: 'Unlimited free' },
  { feature: 'Progress analytics',        free: 'Basic',     pro: 'Full + export' },
];

export default function UpgradeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [selected, setSelected] = useState('annual');

  const selPlan = PLANS.find(p => p.key === selected) || PLANS[1];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
        {/* Back */}
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>

        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.heroEyebrow}>UPGRADE TO PRO</Text>
          <Text style={s.heroTitle}>Learn without limits.</Text>
          <Text style={s.heroSub}>Unlimited sessions, all skill modules, and AI grading that matches your actual exam rubric.</Text>
        </View>

        {/* Plan cards */}
        <View style={isDesktop ? s.planGridDesktop : s.planGrid}>
          {PLANS.map(p => (
            <TouchableOpacity
              key={p.key}
              style={[s.planCard, selected === p.key && s.planCardActive]}
              onPress={() => setSelected(p.key)}
              activeOpacity={0.85}
            >
              {p.badge && <View style={s.planBadge}><Text style={s.planBadgeText}>{p.badge}</Text></View>}
              <Text style={s.planLabel}>{p.label}</Text>
              <View style={s.planPriceRow}>
                <Text style={[s.planPrice, selected === p.key && { color: T.brand }]}>{p.price}</Text>
                <Text style={s.planPeriod}>{p.period}</Text>
              </View>
              <View style={s.planDivider} />
              {p.features.map((f, i) => (
                <View key={i} style={s.planFeatureRow}>
                  <Text style={[s.planCheck, selected === p.key && { color: T.brand }]}>✓</Text>
                  <Text style={s.planFeatureText}>{f}</Text>
                </View>
              ))}
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <TouchableOpacity style={s.ctaBtn} activeOpacity={0.9}>
          <Text style={s.ctaBtnText}>
            {selected === 'free' ? 'Continue free' : `Start ${selPlan.label} · ${selPlan.price}${selPlan.period}`}
          </Text>
        </TouchableOpacity>
        <Text style={s.ctaNote}>Cancel anytime. No hidden fees.</Text>

        {/* Comparison table */}
        <View style={s.compareCard}>
          <Text style={s.compareTitle}>Feature comparison</Text>
          <View style={s.compareHeader}>
            <Text style={[s.compareCol, { flex: 2 }]}>Feature</Text>
            <Text style={s.compareCol}>Free</Text>
            <Text style={[s.compareCol, { color: T.brand }]}>Pro</Text>
          </View>
          {FEATURE_COMPARE.map((f, i) => (
            <View key={i} style={[s.compareRow, i < FEATURE_COMPARE.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]}>
              <Text style={[s.compareFeature, { flex: 2 }]}>{f.feature}</Text>
              <Text style={[s.compareVal, { color: f.free === '—' ? T.ink5 : T.ink3 }]}>{f.free}</Text>
              <Text style={[s.compareVal, { color: T.brand, fontWeight: '700' }]}>{f.pro}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 18, gap: 20, paddingBottom: 20 },
  scrollDesktop: { padding: 40, maxWidth: 1000, alignSelf: 'center', width: '100%' },

  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  backBtnText: { fontSize: 18, color: T.ink3 },

  hero: { gap: 8, paddingBottom: 8 },
  heroEyebrow: { fontSize: 11, fontWeight: '700', color: T.brand, letterSpacing: 1.4, textTransform: 'uppercase' },
  heroTitle: { fontFamily: T.serif, fontSize: 38, color: T.ink, lineHeight: 44 },
  heroSub: { fontSize: 14, color: T.ink3, lineHeight: 20, maxWidth: 560 },

  planGrid: { gap: 12 },
  planGridDesktop: { flexDirection: 'row', gap: 14 },

  planCard: { flex: 1, backgroundColor: T.card, borderRadius: 18, padding: 20, borderWidth: 1.5, borderColor: T.border, gap: 10 },
  planCardActive: { borderColor: T.brand, backgroundColor: T.brandSoft },
  planBadge: { backgroundColor: T.brand, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  planBadgeText: { fontSize: 10.5, fontWeight: '800', color: '#fff', letterSpacing: 0.4 },
  planLabel: { fontSize: 12, fontWeight: '700', color: T.ink4, letterSpacing: 0.6, textTransform: 'uppercase' },
  planPriceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  planPrice: { fontFamily: T.serif, fontSize: 38, color: T.ink, lineHeight: 44 },
  planPeriod: { fontSize: 13, color: T.ink4 },
  planDivider: { height: 1, backgroundColor: T.border },
  planFeatureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  planCheck: { fontSize: 13, fontWeight: '700', color: T.ink3, width: 14 },
  planFeatureText: { fontSize: 13, color: T.ink2, flex: 1, lineHeight: 18 },

  ctaBtn: { backgroundColor: T.brand, borderRadius: 14, padding: 16, alignItems: 'center' },
  ctaBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  ctaNote: { fontSize: 12, color: T.ink4, textAlign: 'center' },

  compareCard: { backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  compareTitle: { fontSize: 13, fontWeight: '700', color: T.ink, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  compareHeader: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: T.bg2 },
  compareCol: { flex: 1, fontSize: 11, fontWeight: '700', color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.6, textAlign: 'center' },
  compareRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  compareFeature: { fontSize: 12.5, color: T.ink, fontWeight: '500' },
  compareVal: { flex: 1, fontSize: 12, textAlign: 'center' },
});
