import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Platform, useWindowDimensions, Linking, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import {
  PersonIcon, BellIcon, ChevronRightIcon,
  GlobeIcon, SunIcon, TypeIcon, StarIcon,
  LightningIcon, BookIcon, HelpCircleIcon, LogOutIcon,
  type IconProps,
} from '@/components/icons';
import { AppLayout } from '@/components/layout/AppLayout';

// ── Row type ──────────────────────────────────────────────────────
type Row = {
  Icon:        (p: IconProps) => JSX.Element;
  label:       string;
  labelColor?: string;
  value?:      string;
  badge?:      { text: string };
  onPress:     () => void;
  showChevron: boolean;
};

type Section = {
  title?: string;
  rows:   Row[];
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
      <Text style={[s.rowLabel, row.labelColor ? { color: row.labelColor } : null]}>
        {row.label}
      </Text>
      <View style={s.rowRight}>
        {row.badge && (
          <View style={s.badge}>
            <Text style={s.badgeText}>{row.badge.text}</Text>
          </View>
        )}
        {row.value && <Text style={s.rowValue}>{row.value}</Text>}
        {row.showChevron && <ChevronRightIcon size={14} color={Colors.borderStrong} />}
      </View>
    </TouchableOpacity>
  );
}

// ── Section group ─────────────────────────────────────────────────
function SettingsSection({ section }: { section: Section }) {
  return (
    <View style={s.sectionWrap}>
      {section.title && <Text style={s.sectionLabel}>{section.title}</Text>}
      <View style={s.group}>
        {section.rows.map((row, i) => (
          <SettingsRow key={row.label} row={row} isLast={i === section.rows.length - 1} />
        ))}
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { width }    = useWindowDimensions();
  const isDesktop    = Platform.OS === 'web' && width >= 768;
  const { profile, user, signOut } = useAuth();

  const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'You';
  const email       = user?.email ?? '';
  const initial     = displayName[0]?.toUpperCase() ?? '?';

  async function handleSignOut() {
    await signOut();
    router.replace('/(auth)/login');
  }

  const SECTIONS: Section[] = [
    {
      rows: [
        {
          Icon: PersonIcon, label: 'Account',
          onPress: () => router.push('/(tabs)/profile' as any),
          showChevron: true,
        },
        {
          Icon: BellIcon, label: 'Notifications',
          onPress: () => {},
          showChevron: true,
        },
        {
          Icon: GlobeIcon, label: 'Language & region',
          value: 'English',
          onPress: () => {},
          showChevron: true,
        },
      ],
    },
    {
      title: 'APPEARANCE',
      rows: [
        {
          Icon: SunIcon, label: 'Theme',
          value: 'Light',
          onPress: () => {},
          showChevron: true,
        },
        {
          Icon: TypeIcon, label: 'Font size',
          value: 'Default',
          onPress: () => {},
          showChevron: true,
        },
      ],
    },
    {
      rows: [
        {
          Icon: StarIcon, label: 'Get app',
          onPress: () => Linking.openURL('https://apps.apple.com'),
          showChevron: true,
        },
        {
          Icon: LightningIcon, label: 'Upgrade plan',
          badge: { text: 'Pro' },
          onPress: () => router.push('/upgrade' as any),
          showChevron: false,
        },
        {
          Icon: BookIcon, label: 'Learn more',
          onPress: () => Linking.openURL('https://fluentra.app/learn'),
          showChevron: true,
        },
        {
          Icon: HelpCircleIcon, label: 'Get help',
          onPress: () => Linking.openURL('https://fluentra.app/help'),
          showChevron: true,
        },
        {
          Icon: LogOutIcon, label: 'Log out',
          onPress: handleSignOut,
          showChevron: false,
        },
      ],
    },
  ];

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          s.content,
          isDesktop && s.contentDesktop,
        ]}
      >
        <Text style={s.pageTitle}>Settings</Text>

        {/* ── User card ── */}
        <View style={s.userCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{initial}</Text>
          </View>
          <View style={s.userInfo}>
            <Text style={s.userName}>{displayName}</Text>
            <Text style={s.userEmail}>{email}</Text>
          </View>
          <View style={s.planBadge}>
            <Text style={s.planBadgeText}>Free plan</Text>
          </View>
        </View>

        {/* ── Sections ── */}
        {SECTIONS.map((section, i) => (
          <SettingsSection key={i} section={section} />
        ))}

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
    paddingTop: 32,
    paddingBottom: 48,
    gap: 0,
  },
  contentDesktop: {
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
  },

  pageTitle: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 24,
    color: Colors.ink,
    marginBottom: 24,
  },

  // User card
  userCard: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: Colors.white,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    padding:         20,
    gap:             14,
    marginBottom:    28,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.p,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: Colors.white },
  userInfo:   { flex: 1, gap: 3 },
  userName:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: Colors.ink },
  userEmail:  { fontFamily: 'Inter_400Regular',  fontSize: 13, color: Colors.ink3 },
  planBadge:  {
    backgroundColor:  Colors.p_soft,
    borderRadius:     20,
    paddingHorizontal: 10,
    paddingVertical:   3,
  },
  planBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.p },

  // Sections
  sectionWrap:  { marginBottom: 20 },
  sectionLabel: {
    fontFamily:    'Inter_600SemiBold',
    fontSize:      11,
    color:         Colors.ink3,
    letterSpacing: 0.6,
    marginBottom:  8,
    paddingLeft:   4,
  },
  group: {
    backgroundColor: Colors.white,
    borderRadius:    12,
    borderWidth:     1,
    borderColor:     Colors.border,
    overflow:        'hidden',
  },

  // Row
  row: {
    flexDirection:    'row',
    alignItems:       'center',
    height:           48,
    paddingHorizontal: 16,
    gap:              12,
    backgroundColor:  Colors.white,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#F2F0EB' },
  rowLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize:   14,
    color:      Colors.ink,
    flex:       1,
  },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },

  badge: {
    backgroundColor:  Colors.p_soft,
    borderRadius:     20,
    paddingHorizontal: 8,
    paddingVertical:   3,
  },
  badgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.p },
});
