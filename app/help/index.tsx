import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const FAQS = [
  { q: 'How is my band score calculated?', a: 'Your band score is calculated using the same rubrics as the real exam. AI compares your response against official descriptors for each criterion.' },
  { q: 'How often can I take mock exams?', a: 'Pro subscribers can take unlimited daily mocks for free. Free tier users can take mock exams at $2 per session.' },
  { q: 'Can I cancel my subscription anytime?', a: 'Yes. You can cancel anytime from Settings → Subscription. Your access continues until the end of the billing period.' },
  { q: 'How does the streak system work?', a: 'Complete at least one practice session per day to maintain your streak. After 9 consecutive days, you unlock your first official exam credit.' },
  { q: 'Which exams are supported?', a: 'IELTS Academic, IELTS General, TOEFL iBT, DELE B2, DELF B2, JLPT N4, and Goethe B1. More exams are added regularly.' },
];

const CONTACT_OPTIONS = [
  { label: 'Email support', sub: 'support@fluentra.io', emoji: '✉️', action: () => Linking.openURL('mailto:support@fluentra.io') },
  { label: 'Live chat', sub: 'Available Mon–Fri, 9am–6pm UTC', emoji: '💬', action: () => {} },
  { label: 'Community forum', sub: 'Ask the Fluentra community', emoji: '👥', action: () => Linking.openURL('https://fluentra.io/community') },
];

export default function HelpScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Help &amp; Support</Text>
      </View>

      <View style={s.heroCard}>
        <Text style={s.heroEmoji}>🙋</Text>
        <Text style={s.heroTitle}>How can we help?</Text>
        <Text style={s.heroSub}>Find answers to common questions or reach out to our team.</Text>
      </View>

      {/* Contact options */}
      <Text style={s.sectionTitle}>GET IN TOUCH</Text>
      <View style={s.contactCards}>
        {CONTACT_OPTIONS.map((o, i) => (
          <TouchableOpacity key={i} style={s.contactCard} onPress={o.action} activeOpacity={0.8}>
            <Text style={s.contactEmoji}>{o.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={s.contactLabel}>{o.label}</Text>
              <Text style={s.contactSub}>{o.sub}</Text>
            </View>
            <Text style={s.contactArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FAQs */}
      <Text style={s.sectionTitle}>FREQUENTLY ASKED</Text>
      <View style={s.faqList}>
        {FAQS.map((faq, i) => (
          <TouchableOpacity key={i} style={[s.faqItem, i < FAQS.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]} onPress={() => setOpenFaq(openFaq === i ? null : i)}>
            <View style={s.faqHeader}>
              <Text style={s.faqQ}>{faq.q}</Text>
              <Text style={s.faqToggle}>{openFaq === i ? '−' : '+'}</Text>
            </View>
            {openFaq === i && <Text style={s.faqA}>{faq.a}</Text>}
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer links */}
      <View style={s.footerLinks}>
        <TouchableOpacity onPress={() => router.push('/privacy' as any)}>
          <Text style={s.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={s.footerDot}>·</Text>
        <TouchableOpacity onPress={() => router.push('/terms' as any)}>
          <Text style={s.footerLink}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },
  scrollDesktop: { padding: 28, paddingHorizontal: 36, maxWidth: 800, alignSelf: 'center', width: '100%' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: T.ink },
  heroCard: { backgroundColor: T.brandSoft, margin: 16, borderRadius: 16, padding: 24, alignItems: 'center', gap: 8 },
  heroEmoji: { fontSize: 40 },
  heroTitle: { fontFamily: T.serif, fontSize: 26, color: T.ink, textAlign: 'center' },
  heroSub: { fontSize: 14, color: T.ink3, textAlign: 'center', lineHeight: 20 },
  sectionTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 0.8, textTransform: 'uppercase', marginHorizontal: 16, marginBottom: 8, marginTop: 4 },
  contactCards: { marginHorizontal: 16, backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  contactCard: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: T.hairline },
  contactEmoji: { fontSize: 22, width: 32, textAlign: 'center' },
  contactLabel: { fontSize: 14, fontWeight: '600', color: T.ink },
  contactSub: { fontSize: 12, color: T.ink4, marginTop: 2 },
  contactArrow: { fontSize: 20, color: T.ink5 },
  faqList: { marginHorizontal: 16, backgroundColor: T.card, borderRadius: 16, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  faqItem: { padding: 16 },
  faqHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  faqQ: { flex: 1, fontSize: 14, fontWeight: '600', color: T.ink, lineHeight: 20 },
  faqToggle: { fontSize: 20, color: T.brand, fontWeight: '400', lineHeight: 24 },
  faqA: { fontSize: 13.5, color: T.ink3, lineHeight: 20, marginTop: 10 },
  footerLinks: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
  footerLink: { fontSize: 13, color: T.brand },
  footerDot: { fontSize: 13, color: T.ink5 },
});
