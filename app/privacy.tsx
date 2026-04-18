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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.liRow}>
      <Text style={s.liBullet}>·</Text>
      <Text style={s.liText}>{children}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
        <View style={s.header}>
          <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
            <ChevronLeftIcon size={14} color={Colors.ink2} />
          </TouchableOpacity>
          <Text style={s.title}>Privacy Policy</Text>
        </View>
        <Text style={s.meta}>Effective date: April 2026</Text>

        <Section title="What data we collect">
          <P>We collect only what's necessary to run Fluentra and improve your experience:</P>
          <Li>Email address and account name (for authentication)</Li>
          <Li>Language preferences and exam type selections</Li>
          <Li>Practice session scores and performance history</Li>
          <Li>Streak data and daily activity counts</Li>
          <Li>Speaking session audio (processed in real time, not stored)</Li>
          <Li>Device type and anonymised usage events</Li>
        </Section>

        <Section title="How we use it">
          <Li>Running the app and saving your progress across devices</Li>
          <Li>Improving the product and AI feedback quality</Li>
          <Li>Sending weekly progress emails (if opted in)</Li>
          <Li>Detecting and preventing abuse</Li>
          <P>We never sell your data or use it for advertising.</P>
        </Section>

        <Section title="Third parties">
          <P>We use the following services to operate Fluentra:</P>
          <Li>Supabase — database and authentication (EU region)</Li>
          <Li>Anthropic API — AI writing and speaking feedback</Li>
          <Li>ElevenLabs — text-to-speech for listening exercises</Li>
          <Li>OpenAI — additional AI model support</Li>
          <Li>PostHog — anonymised analytics (self-hosted option available)</Li>
          <P>Each provider processes data only as needed to deliver their service.</P>
        </Section>

        <Section title="Data retention">
          <P>We keep your data for as long as your account is active. You can delete your account at any time from Settings → Account → Delete account. This permanently removes all your data within 30 days.</P>
        </Section>

        <Section title="Your rights">
          <Li>Access — request a copy of your data at any time</Li>
          <Li>Correction — update incorrect information in your profile</Li>
          <Li>Deletion — delete your account and all associated data</Li>
          <Li>Portability — export your session history as CSV</Li>
        </Section>

        <Section title="Cookies">
          <P>On web, we use a single session cookie required for login. No advertising or tracking cookies are used.</P>
        </Section>

        <Section title="Contact">
          <P>For privacy questions or data requests, contact us at privacy@fluentra.app</P>
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

  liRow:   { flexDirection: 'row', gap: 8, marginBottom: 6 },
  liBullet:{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#CCC', lineHeight: 22 },
  liText:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary, lineHeight: 22, flex: 1 },
});
