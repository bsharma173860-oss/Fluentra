import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/authContext';

// Map ISO country codes to flag emoji
function countryFlag(code?: string): string {
  if (!code) return '';
  return code
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

// ─── Settings with value on the right ────────────────────────────────────────
const EXAM_SETTINGS = [
  { icon: '🎯', label: 'Target exam',        value: 'IELTS Academic' },
  { icon: '📈', label: 'Target band score',  value: '8.0' },
  { icon: '🌐', label: 'Native language',    value: 'Arabic' },
  { icon: '🔔', label: 'Streak reminders',   value: 'Daily 8 pm' },
];

const APP_SETTINGS = [
  { icon: '📄', label: 'Privacy policy',     value: '', danger: false },
  { icon: '📋', label: 'Terms of service',   value: '', danger: false },
  { icon: '🗑',  label: 'Delete account',    value: '', danger: true  },
];

// ─── Row component ────────────────────────────────────────────────────────────
function SettingRow({
  icon, label, value, danger = false, border = true, onPress,
}: {
  icon: string; label: string; value?: string;
  danger?: boolean; border?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[s.settingRow, border && s.settingBorder]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={s.settingIcon}>{icon}</Text>
      <Text style={[s.settingLabel, danger && { color: Colors.danger }]}>{label}</Text>
      <View style={s.settingRight}>
        {value ? <Text style={s.settingValue}>{value}</Text> : null}
        <Text style={s.settingArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const name = profile?.name ?? 'User';
  const email = profile?.email ?? '';
  const initial = name[0]?.toUpperCase() ?? '?';
  const isPro = profile?.subscription_tier === 'pro';
  const streakCount = profile?.streak_count ?? 0;
  const countryCode = (profile as any)?.country_code;
  const flag = countryFlag(countryCode);

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete account',
      'This will permanently delete your account and all data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {} },
      ],
    );
  }

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Profile header card */}
        <Card padding={20} style={s.profileCard}>
          <View style={s.profileTop}>
            <View style={s.avatarWrap}>
              <Text style={s.avatarText}>{initial}</Text>
            </View>
            <View style={s.profileInfo}>
              <View style={s.nameRow}>
                <Text style={s.profileName}>{name}</Text>
                {flag ? <Text style={s.flagText}>{flag}</Text> : null}
                {isPro
                  ? <View style={s.proBadge}><Text style={s.proBadgeText}>PRO</Text></View>
                  : <View style={s.freeBadge}><Text style={s.freeBadgeText}>FREE</Text></View>
                }
              </View>
              <Text style={s.profileEmail}>{email}</Text>
            </View>
          </View>

          {/* Stats row */}
          <View style={s.statsRow}>
            <View style={s.stat}>
              <Text style={s.statNum}>🔥 {streakCount}</Text>
              <Text style={s.statLabel}>Day streak</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>7.5</Text>
              <Text style={s.statLabel}>Band score</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>#12</Text>
              <Text style={s.statLabel}>Global rank</Text>
            </View>
          </View>
        </Card>

        {/* Subscription section */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {/* Upgrade to Pro — highlighted purple row */}
          <TouchableOpacity style={s.upgradeRow} activeOpacity={0.88}>
            <View style={s.upgradeLeft}>
              <Text style={s.upgradeIcon}>⚡</Text>
              <View>
                <Text style={s.upgradeLabel}>Upgrade to Pro</Text>
                <Text style={s.upgradeSub}>Unlock reading, full exams & analytics</Text>
              </View>
            </View>
            <Text style={s.upgradeArrow}>›</Text>
          </TouchableOpacity>
          <SettingRow icon="💳" label="Billing & receipts" value="" border={false} />
        </Card>

        {/* Exam & study settings */}
        <Text style={s.sectionHeading}>Settings</Text>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {EXAM_SETTINGS.map((item, i) => (
            <SettingRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              value={item.value}
              border={i < EXAM_SETTINGS.length - 1}
            />
          ))}
        </Card>

        {/* App / legal */}
        <Text style={s.sectionHeading}>App</Text>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {APP_SETTINGS.map((item, i) => (
            <SettingRow
              key={item.label}
              icon={item.icon}
              label={item.label}
              danger={item.danger}
              border={i < APP_SETTINGS.length - 1}
              onPress={item.danger ? handleDeleteAccount : undefined}
            />
          ))}
        </Card>

        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut} activeOpacity={0.88}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 16 },

  profileCard: { gap: 16 },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  avatarWrap: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 28, color: Colors.white },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  flagText: { fontSize: 20 },
  freeBadge: {
    backgroundColor: Colors.bg2, paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 6, borderWidth: 1, borderColor: Colors.border,
  },
  freeBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3 },
  proBadge: { backgroundColor: Colors.gold_bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  proBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.gold },
  profileEmail: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, marginTop: 4 },

  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  upgradeRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 15,
    backgroundColor: Colors.p_soft,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  upgradeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  upgradeIcon: { fontSize: 20 },
  upgradeLabel: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.p },
  upgradeSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.p, opacity: 0.75, marginTop: 2 },
  upgradeArrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: Colors.p },

  sectionHeading: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },

  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15, gap: 12 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon: { fontSize: 18, width: 24 },
  settingLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.ink, flex: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  settingValue: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  settingArrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: Colors.ink4 },

  signOutBtn: {
    backgroundColor: Colors.danger + '15', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.danger + '30',
  },
  signOutText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.danger },
});
