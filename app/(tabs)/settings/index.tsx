import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, useWindowDimensions, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import {
  PersonIcon, PhoneIcon, LightningIcon, BookIcon,
  HelpCircleIcon, LogOutIcon, ChevronRightIcon, ExternalLinkIcon,
  type IconProps,
} from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';

// ── Row types ─────────────────────────────────────────────────────
type RowRight = 'chevron' | 'external' | 'none';
type Row = {
  Icon:     (p: IconProps) => JSX.Element;
  label:    string;
  badge?:   string;
  right:    RowRight;
  onPress:  () => void;
};

// ── Single row ────────────────────────────────────────────────────
function SettingsRow({ row, isLast }: { row: Row; isLast: boolean }) {
  return (
    <TouchableOpacity
      style={[s.row, !isLast && s.rowBorder]}
      onPress={row.onPress}
      activeOpacity={0.65}
    >
      <row.Icon size={16} color={Colors.ink3} />
      <Text style={s.rowLabel}>{row.label}</Text>
      <View style={s.rowRight}>
        {row.badge && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{row.badge}</Text>
          </View>
        )}
        {row.right === 'chevron'  && <ChevronRightIcon  size={14} color={Colors.borderStrong} />}
        {row.right === 'external' && <ExternalLinkIcon  size={14} color={Colors.ink3} />}
      </View>
    </TouchableOpacity>
  );
}

// ── Section card ──────────────────────────────────────────────────
function SettingsGroup({ rows }: { rows: Row[] }) {
  return (
    <View style={s.group}>
      {rows.map((row, i) => (
        <SettingsRow key={row.label} row={row} isLast={i === rows.length - 1} />
      ))}
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { width }  = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;
  const { signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  const SECTION1: Row[] = [
    {
      Icon: PersonIcon, label: 'Account', right: 'chevron',
      onPress: () => router.push('/settings/account' as any),
    },
  ];

  const SECTION2: Row[] = [
    {
      Icon: PhoneIcon, label: 'Get app', right: 'external',
      onPress: () => Linking.openURL('https://apps.apple.com'),
    },
    {
      Icon: LightningIcon, label: 'Upgrade plan', badge: 'Pro', right: 'chevron',
      onPress: () => router.push('/upgrade' as any),
    },
    {
      Icon: BookIcon, label: 'Learn more', right: 'external',
      onPress: () => Linking.openURL('https://fluentra.app/learn'),
    },
    {
      Icon: HelpCircleIcon, label: 'Get help', right: 'external',
      onPress: () => Linking.openURL('https://fluentra.app/help'),
    },
  ];

  const SECTION3: Row[] = [
    {
      Icon: LogOutIcon, label: 'Log out', right: 'none',
      onPress: handleSignOut,
    },
  ];

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.content, isDesktop && s.contentDesktop]}
      >
        <Text style={s.title}>Settings</Text>

        <SettingsGroup rows={SECTION1} />
        <View style={s.gap} />
        <SettingsGroup rows={SECTION2} />
        <View style={s.gap} />
        <SettingsGroup rows={SECTION3} />

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 32 },
  contentDesktop: {
    maxWidth:         680,
    width:            '100%',
    alignSelf:        'center',
    paddingHorizontal: 32,
    paddingTop:       40,
  },

  title: {
    fontFamily:   'Inter_600SemiBold',
    fontSize:     22,
    color:        Colors.textPrimary,
    marginBottom: 24,
  },

  gap: { height: 8 },

  group: {
    backgroundColor: Colors.card,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     Colors.cardBorder,
    overflow:        'hidden',
  },
  row: {
    flexDirection:    'row',
    alignItems:       'center',
    height:           44,
    paddingHorizontal: 16,
    gap:              12,
    backgroundColor:  Colors.card,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.cardBorder },
  rowLabel:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textPrimary, flex: 1 },
  rowRight:  { flexDirection: 'row', alignItems: 'center', gap: 6 },

  badge: {
    backgroundColor:   Colors.accentBg,
    borderRadius:      20,
    paddingHorizontal: 8,
    paddingVertical:   3,
  },
  badgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.accent },
});
