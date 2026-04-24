import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChevronLeftIcon, HelpCircleIcon, ExternalLinkIcon } from '@/components/icons';

const LINKS = [
  { label: 'Getting started',        url: 'https://fluentra.app/help/getting-started'  },
  { label: 'Module guides',          url: 'https://fluentra.app/help/modules'           },
  { label: 'Exam unlock & streaks',  url: 'https://fluentra.app/help/streaks'           },
  { label: 'Subscription & billing', url: 'https://fluentra.app/help/billing'           },
  { label: 'Contact support',        url: 'https://fluentra.app/help/contact'           },
];

export default function HelpPage() {
  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView contentContainerStyle={s.scroll}>
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
              <ChevronLeftIcon size={18} color="#666" />
            </TouchableOpacity>
            <View style={s.titleRow}>
              <HelpCircleIcon size={22} color="#000" />
              <Text style={s.title}>Help & feedback</Text>
            </View>
          </View>

          {/* Links */}
          <View style={s.section}>
            {LINKS.map(({ label, url }) => (
              <TouchableOpacity
                key={label}
                style={s.row}
                onPress={() => Linking.openURL(url)}
                activeOpacity={0.7}
              >
                <Text style={s.rowLabel}>{label}</Text>
                <ExternalLinkIcon size={14} color="#BBB" />
              </TouchableOpacity>
            ))}
          </View>

          <Text style={s.note}>
            Questions? Email us at{' '}
            <Text style={s.link} onPress={() => Linking.openURL('mailto:support@fluentra.app')}>
              support@fluentra.app
            </Text>
          </Text>
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#F9F8F5' },
  scroll:  { padding: 24, paddingBottom: 48 },

  header:  { marginBottom: 28 },
  backBtn: { marginBottom: 16 },
  titleRow:{ flexDirection: 'row', alignItems: 'center', gap: 10 },
  title:   { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },

  section: {
    backgroundColor: '#FFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden', marginBottom: 24,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  rowLabel:{ fontFamily: 'Inter_400Regular', fontSize: 14, color: '#000' },

  note: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', textAlign: 'center' },
  link: { color: '#5B4EFF', textDecorationLine: 'underline' },
});
