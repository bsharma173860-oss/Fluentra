import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { ChevronLeftIcon } from '@/components/icons';

const SHORTCUTS = [
  { key: '⌘K',  desc: 'Quick search' },
  { key: '⌘/',  desc: 'Open shortcuts' },
  { key: '⌘H',  desc: 'Go home' },
  { key: '⌘E',  desc: 'Go to exams' },
  { key: '⌘P',  desc: 'Go to progress' },
  { key: '⌘,',  desc: 'Open settings' },
  { key: 'Esc', desc: 'Close / go back' },
];

export default function ShortcutsPage() {
  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.header}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
              <ChevronLeftIcon size={18} color="#666" />
            </TouchableOpacity>
            <Text style={s.title}>Keyboard shortcuts</Text>
          </View>

          <View style={s.section}>
            {SHORTCUTS.map(({ key, desc }) => (
              <View key={key} style={s.row}>
                <View style={s.badge}>
                  <Text style={s.badgeText}>{key}</Text>
                </View>
                <Text style={s.desc}>{desc}</Text>
              </View>
            ))}
          </View>
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
  title:   { fontFamily: 'Inter_700Bold', fontSize: 24, color: '#000' },

  section: {
    backgroundColor: '#FFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 18, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  badge: {
    backgroundColor: '#F4F1EB', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
    minWidth: 44, alignItems: 'center',
  },
  badgeText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#333' },
  desc:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#000' },
});
