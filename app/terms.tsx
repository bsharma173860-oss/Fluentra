import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { ChevronLeftIcon } from '@/components/icons';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <Text style={s.p}>{children}</Text>;
}

export default function TermsScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeftIcon size={14} color={Colors.ink2} />
          </TouchableOpacity>
          <Text style={s.title}>Terms of Service</Text>
        </View>
        <Text style={s.meta}>Effective date: April 2026</Text>

        <Section title="Acceptance">
          <P>By creating a Fluentra account, you agree to these terms. If you do not agree, please do not use the service.</P>
        </Section>

        <Section title="The service">
          <P>Fluentra provides AI-powered language learning and exam preparation tools. We offer free and paid (Pro, Elite) subscription tiers. Features are described on the pricing page and may change over time with reasonable notice.</P>
        </Section>

        <Section title="Your account">
          <P>You must be 13 or older to use Fluentra. You are responsible for keeping your password secure and for all activity under your account. Notify us immediately if you suspect unauthorised access.</P>
        </Section>

        <Section title="Acceptable use">
          <P>You agree not to: use the service for anything unlawful; attempt to reverse-engineer or scrape the platform; share your account; or misuse the AI features to generate harmful content.</P>
        </Section>

        <Section title="Payments and refunds">
          <P>Subscriptions are billed in advance and are non-refundable except where required by law. You may cancel at any time and retain access until the end of your billing period. Prices may change with 30 days' notice.</P>
        </Section>

        <Section title="AI-generated content">
          <P>Fluentra uses AI to generate feedback, practice questions, and study content. This content is for educational purposes only and may occasionally contain errors. Do not rely on it as a substitute for professional instruction.</P>
        </Section>

        <Section title="Intellectual property">
          <P>Fluentra and its content are owned by Fluentra Ltd. You retain ownership of any content you create. By using the service, you grant us a licence to process your input to deliver the service.</P>
        </Section>

        <Section title="Disclaimers and limitation of liability">
          <P>The service is provided "as is." We make no guarantees about exam outcomes or language improvement. Our liability is limited to the amount you paid us in the 12 months preceding any claim.</P>
        </Section>

        <Section title="Changes to these terms">
          <P>We may update these terms occasionally. We'll notify you by email or in-app at least 14 days before material changes take effect.</P>
        </Section>

        <Section title="Contact">
          <P>Questions? Email legal@fluentra.app</P>
        </Section>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 20 },

  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 6 },
  backBtn: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.textPrimary },
  meta:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#999', marginBottom: 28 },

  section:      { marginBottom: 28 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink, marginBottom: 10 },
  p:            { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 8 },
});
