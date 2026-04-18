import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, useWindowDimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { ChevronLeftIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';
import { Analytics, track } from '@/lib/analytics';
import { useAuth } from '@/lib/authContext';

// ── Check icon ────────────────────────────────────────────────────
function Check({ color }: { color: string }) {
  return (
    <Svg width={15} height={15} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  );
}

// ── FAQ accordion ─────────────────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={fq.item}
      onPress={() => setOpen(o => !o)}
      activeOpacity={0.75}
    >
      <View style={fq.row}>
        <Text style={fq.question}>{q}</Text>
        <Text style={fq.chevron}>{open ? '−' : '+'}</Text>
      </View>
      {open && <Text style={fq.answer}>{a}</Text>}
    </TouchableOpacity>
  );
}

const fq = StyleSheet.create({
  item: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 8,
  },
  row:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  question: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink, flex: 1, paddingRight: 12 },
  chevron:  { fontFamily: 'Inter_400Regular', fontSize: 18, color: Colors.ink3, lineHeight: 22 },
  answer:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, lineHeight: 20, marginTop: 10 },
});

// ── Pricing data ──────────────────────────────────────────────────
type BillingPeriod = 'annual' | 'monthly';

const PRICES = {
  pro: {
    monthly: { amount: 28,  label: '$28',  period: '/month', note: ''                              },
    annual:  { amount: 24,  label: '$24',  period: '/month', note: 'billed $288/year · incl. tax'  },
  },
  elite: {
    monthly: { amount: 140, label: '$140', period: '/month', note: ''                              },
    annual:  { amount: 120, label: '$120', period: '/month', note: 'billed $1,440/year · incl. tax' },
  },
} as const;

// ── Plan card ─────────────────────────────────────────────────────
type PlanCardProps = {
  plan:        'free' | 'pro' | 'elite';
  name:        string;
  nameColor:   string;
  nameBg?:     string;
  priceLabel:  string;
  pricePeriod: string;
  priceNote?:  string;
  features:    string[];
  checkColor:  string;
  btnLabel:    string;
  btnStyle:    'current' | 'pro' | 'elite';
  highlight?:  boolean;
  onUpgrade:   () => void;
};

function PlanCard(p: PlanCardProps) {
  return (
    <View style={[pc.card, p.highlight && pc.cardHighlight]}>
      {p.highlight && (
        <View style={pc.popularWrap}>
          <Text style={[pc.popular, p.nameBg ? { backgroundColor: p.nameBg } : {}]}>
            MOST POPULAR
          </Text>
        </View>
      )}

      <Text style={[pc.name, { color: p.nameColor }]}>{p.name.toUpperCase()}</Text>

      {/* Price row */}
      <View style={pc.priceRow}>
        <Text style={pc.price}>{p.priceLabel}</Text>
        <Text style={pc.period}>{p.pricePeriod}</Text>
      </View>
      {!!p.priceNote && <Text style={pc.priceNote}>{p.priceNote}</Text>}

      <View style={pc.divider} />

      <View style={pc.features}>
        {p.features.map((f, i) => (
          <View key={i} style={pc.featureRow}>
            <Check color={p.checkColor} />
            <Text style={pc.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          pc.btn,
          p.btnStyle === 'current' && pc.btnCurrent,
          p.btnStyle === 'pro'     && pc.btnPro,
          p.btnStyle === 'elite'   && pc.btnElite,
        ]}
        onPress={p.onUpgrade}
        disabled={p.btnStyle === 'current'}
        activeOpacity={0.85}
      >
        <Text style={[pc.btnText, p.btnStyle === 'current' && pc.btnTextCurrent]}>
          {p.btnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const pc = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 24,
    flex: 1,
  },
  cardHighlight: {
    borderWidth: 2,
    borderColor: '#000',
  },
  popularWrap: {
    alignSelf: 'center',
    marginTop: -24,
    marginBottom: 16,
  },
  popular: {
    backgroundColor: '#FAF0EB',
    color: '#D97757',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    overflow: 'hidden',
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.7,
    marginBottom: 14,
  },
  priceRow:  { flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginBottom: 4 },
  price:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 40, color: '#000', lineHeight: 44 },
  period:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#999', paddingBottom: 6 },
  priceNote: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', marginBottom: 18 },

  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 20, marginTop: 4 },

  features:    { gap: 11, marginBottom: 24 },
  featureRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textPrimary, flex: 1, lineHeight: 20 },

  btn: {
    height: 40, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  btnCurrent:     { backgroundColor: Colors.bg2 },
  btnPro:         { backgroundColor: '#000' },
  btnElite:       { backgroundColor: '#000' },
  btnText:        { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  btnTextCurrent: { color: Colors.textSecondary },
});

// ── Screen ────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel anytime from your settings. Your plan stays active until the end of the billing period.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We accept all major credit cards via Stripe, plus Apple Pay and Google Pay on mobile.',
  },
  {
    q: 'What happens to my streak if I downgrade?',
    a: 'Your streak and exam unlock status are never affected by plan changes. They stay permanent.',
  },
];

export default function UpgradeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const { profile } = useAuth();

  const [billing, setBilling] = useState<BillingPeriod>('annual');

  useEffect(() => {
    Analytics.upgradePrompted({
      trigger: 'upgrade_page',
      currentPlan: (profile as any)?.subscription_tier ?? 'free',
    });
  }, []);

  const proPrice   = PRICES.pro[billing];
  const elitePrice = PRICES.elite[billing];

  function handleToggle(period: BillingPeriod) {
    setBilling(period);
    track('billing_period_toggled', { period });
  }

  function handleUpgrade(plan: 'pro' | 'elite') {
    Analytics.upgradeCompleted({
      fromPlan: 'free',
      toPlan: plan,
      billingPeriod: billing,
      amount: billing === 'annual'
        ? PRICES[plan].annual.amount * 12
        : PRICES[plan].monthly.amount,
    });
    Alert.alert('Coming soon', 'Payments will be available shortly.');
  }

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.content, isDesktop && s.contentDesktop]}
      >
        {/* Back */}
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <ChevronLeftIcon size={14} color={Colors.ink2} />
        </TouchableOpacity>

        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Upgrade Fluentra</Text>
          <Text style={s.subtitle}>Get more from your language learning</Text>
        </View>

        {/* ── Billing toggle ── */}
        <View style={s.toggleWrap}>
          <TouchableOpacity
            style={[s.toggleBtn, billing === 'annual' && s.toggleBtnActive]}
            onPress={() => handleToggle('annual')}
            activeOpacity={0.85}
          >
            <Text style={[s.toggleText, billing === 'annual' && s.toggleTextActive]}>
              Annual
            </Text>
            <View style={s.saveBadge}>
              <Text style={s.saveBadgeText}>Save 17%</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.toggleBtn, billing === 'monthly' && s.toggleBtnActive]}
            onPress={() => handleToggle('monthly')}
            activeOpacity={0.85}
          >
            <Text style={[s.toggleText, billing === 'monthly' && s.toggleTextActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Plan cards ── */}
        <View style={[s.plans, isDesktop && s.plansDesktop]}>
          {/* Free */}
          <PlanCard
            plan="free"
            name="Free"
            nameColor={Colors.ink3}
            priceLabel="$0"
            pricePeriod="/month"
            priceNote="Free forever"
            features={[
              '1 session/day all modules',
              '10 min speaking/day',
              'IELTS only',
              'Basic score feedback',
              '3 languages',
            ]}
            checkColor={Colors.ink3}
            btnLabel="Current plan"
            btnStyle="current"
            onUpgrade={() => {}}
          />

          {/* Pro */}
          <PlanCard
            plan="pro"
            name="Pro"
            nameColor="#D97757"
            priceLabel={proPrice.label}
            pricePeriod={proPrice.period}
            priceNote={proPrice.note}
            features={[
              '5 sessions/day all modules',
              '60 min speaking/day',
              'All 5 exam types',
              'Detailed AI feedback + corrections',
              'Full score history',
              'Monthly exam access',
              'All 15 languages',
            ]}
            checkColor="#D97757"
            btnLabel="Upgrade to Pro"
            btnStyle="pro"
            highlight
            onUpgrade={() => handleUpgrade('pro')}
          />

          {/* Elite */}
          <PlanCard
            plan="elite"
            name="Elite"
            nameColor={Colors.ink2}
            priceLabel={elitePrice.label}
            pricePeriod={elitePrice.period}
            priceNote={elitePrice.note}
            features={[
              'Everything in Pro unlimited',
              'Unlimited speaking',
              'Weekly AI study plan',
              'Weekly progress email',
              '1-on-1 weak module coaching',
              'Early feature access',
            ]}
            checkColor={Colors.ink}
            btnLabel="Upgrade to Elite"
            btnStyle="elite"
            onUpgrade={() => handleUpgrade('elite')}
          />
        </View>

        {/* Billing note */}
        <Text style={s.billingNote}>
          {billing === 'annual'
            ? 'All prices include tax. Billed annually. Cancel anytime.'
            : 'All prices include tax. Billed monthly. Cancel anytime.'}
        </Text>

        {/* FAQ */}
        <View style={s.faqSection}>
          <Text style={s.faqTitle}>Frequently asked questions</Text>
          {FAQS.map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} />
          ))}
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 20 },
  contentDesktop: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 40,
    paddingTop: 40,
  },

  backBtn: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
  },

  header:   { alignItems: 'center', marginBottom: 28 },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 28, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },

  // ── Toggle ──
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F0',
    borderRadius: 10,
    padding: 3,
    alignSelf: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  toggleBtn: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    } as any : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 2,
      elevation: 1,
    }),
  },
  toggleText:       { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888' },
  toggleTextActive: { color: '#000' },
  saveBadge: {
    backgroundColor: '#EDFAF4',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saveBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#16A34A' },

  // ── Plans ──
  plans:        { gap: 16 },
  plansDesktop: { flexDirection: 'row', alignItems: 'flex-start' },

  billingNote: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },

  faqSection: { marginTop: 48 },
  faqTitle:   {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
