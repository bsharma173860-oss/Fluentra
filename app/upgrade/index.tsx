import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, useWindowDimensions, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Polyline } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { ChevronLeftIcon, CheckIcon } from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';
import { Analytics } from '@/lib/analytics';
import { useAuth } from '@/lib/authContext';

// ── Check icon with custom color ──────────────────────────────────
function Check({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
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
  answer:   {
    fontFamily: 'Inter_400Regular', fontSize: 13,
    color: Colors.ink2, lineHeight: 20,
    marginTop: 10,
  },
});

// ── Plan card ─────────────────────────────────────────────────────
type PlanCardProps = {
  name:        string;
  nameColor:   string;
  price:       string;
  annual?:     string;
  description: string;
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
          <Text style={pc.popular}>MOST POPULAR</Text>
        </View>
      )}
      <Text style={[pc.name, { color: p.nameColor }]}>{p.name.toUpperCase()}</Text>
      <View style={pc.priceRow}>
        <Text style={pc.price}>{p.price}</Text>
        <Text style={pc.period}>/month</Text>
      </View>
      {p.annual && <Text style={pc.annual}>{p.annual}</Text>}
      <Text style={pc.description}>{p.description}</Text>

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
        <Text style={[
          pc.btnText,
          p.btnStyle === 'current' && pc.btnTextCurrent,
        ]}>
          {p.btnLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const pc = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    padding: 24,
    flex: 1,
  },
  cardHighlight: {
    borderWidth: 2,
    borderColor: Colors.textPrimary,
  },
  popularWrap: {
    alignSelf: 'center',
    marginTop: -24,
    marginBottom: 14,
  },
  popular: {
    backgroundColor: Colors.textPrimary,
    color: Colors.white,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    letterSpacing: 0.5,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  priceRow:   { flexDirection: 'row', alignItems: 'flex-end', gap: 4, marginBottom: 4 },
  price:      { fontFamily: 'Inter_700Bold', fontSize: 32, color: Colors.textPrimary, lineHeight: 36 },
  period:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary, paddingBottom: 4 },
  annual:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
  description:{ fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary, marginBottom: 20, lineHeight: 18 },

  divider: { height: 1, backgroundColor: Colors.cardBorder, marginBottom: 20 },

  features:   { gap: 10, marginBottom: 24 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  featureText:{ fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textPrimary, flex: 1, lineHeight: 20 },

  btn: {
    height: 38, borderRadius: 7,
    alignItems: 'center', justifyContent: 'center',
  },
  btnCurrent: { backgroundColor: Colors.bg2 },
  btnPro:     { backgroundColor: Colors.textPrimary },
  btnElite:   { backgroundColor: Colors.textPrimary, opacity: 0.85 },
  btnText:    { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.white },
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

function comingSoon() {
  Alert.alert('Coming soon', 'Payments will be available on Day 13.');
}

export default function UpgradeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const { profile } = useAuth();

  useEffect(() => {
    Analytics.upgradePrompted({
      trigger: 'upgrade_page',
      currentPlan: (profile as any)?.subscription_tier ?? 'free',
    });
  }, []);

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

        {/* Plans */}
        <View style={[s.plans, isDesktop && s.plansDesktop]}>
          <PlanCard
            name="Free"
            nameColor={Colors.ink3}
            price="$0"
            description="Get started with language learning"
            features={[
              '1 writing session per day',
              '1 listening session per day',
              '1 reading session per day',
              '10 min speaking per day',
              'IELTS only',
              'Basic score feedback',
            ]}
            checkColor={Colors.ink3}
            btnLabel="Current plan"
            btnStyle="current"
            onUpgrade={() => {}}
          />
          <PlanCard
            name="Pro"
            nameColor={Colors.textPrimary}
            price="$24"
            annual="or $20/mo billed annually"
            description="For serious exam preparation"
            features={[
              '5 writing sessions per day',
              '5 listening sessions per day',
              '5 reading sessions per day',
              '60 min speaking per day',
              'All 5 exam types',
              'Detailed AI feedback + corrections',
              'Full score history',
              'All languages',
            ]}
            checkColor={Colors.green}
            btnLabel="Upgrade to Pro"
            btnStyle="pro"
            highlight
            onUpgrade={comingSoon}
          />
          <PlanCard
            name="Elite"
            nameColor={Colors.ink3}
            price="$120"
            annual="or $99/mo billed annually"
            description="For the obsessive learner"
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
            onUpgrade={comingSoon}
          />
        </View>

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
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentDesktop: {
    maxWidth: 900,
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

  header:   { alignItems: 'center', marginBottom: 36 },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 28, color: Colors.textPrimary, textAlign: 'center' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' },


  plans:        { gap: 16 },
  plansDesktop: { flexDirection: 'row', alignItems: 'flex-start' },

  faqSection: { marginTop: 48 },
  faqTitle:   {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
});
