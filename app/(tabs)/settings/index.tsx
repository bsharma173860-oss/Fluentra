import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions, Switch, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';

type SettingsTab = 'account' | 'subscription' | 'preferences' | 'notifications' | 'data';

const TABS: { key: SettingsTab; label: string }[] = [
  { key: 'account',      label: 'Account'       },
  { key: 'subscription', label: 'Subscription'  },
  { key: 'preferences',  label: 'Preferences'   },
  { key: 'notifications',label: 'Notifications' },
  { key: 'data',         label: 'Data'          },
];

function SettingRow({ label, value, onPress, danger = false, right }: {
  label: string; value?: string; onPress?: () => void; danger?: boolean; right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity
      style={s.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={{ flex: 1 }}>
        <Text style={[s.settingLabel, danger && { color: '#B00020' }]}>{label}</Text>
        {value ? <Text style={s.settingValue}>{value}</Text> : null}
      </View>
      {right || (onPress ? <Text style={s.settingArrow}>›</Text> : null)}
    </TouchableOpacity>
  );
}

function SettingSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View style={s.section}>
      {title && <Text style={s.sectionTitle}>{title.toUpperCase()}</Text>}
      <View style={s.sectionBody}>{children}</View>
    </View>
  );
}

export default function SettingsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [dailyReminder, setDailyReminder] = useState(true);
  const [streakAlert, setStreakAlert] = useState(true);
  const [marketing, setMarketing] = useState(false);

  async function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  }

  function renderContent() {
    switch (activeTab) {
      case 'account':
        return (
          <>
            <SettingSection title="Profile">
              <SettingRow label="Full name" value={profile?.name || 'Not set'} onPress={() => {}} />
              <View style={s.rowDivider} />
              <SettingRow label="Email" value={user?.email || ''} />
              <View style={s.rowDivider} />
              <SettingRow label="Change password" onPress={() => router.push('/(auth)/reset-password' as any)} />
            </SettingSection>

            <SettingSection title="Account">
              <SettingRow label="Public profile" onPress={() => {}} />
              <View style={s.rowDivider} />
              <SettingRow label="Refer a friend" value="Earn $10" onPress={() => {}} />
            </SettingSection>

            <SettingSection>
              <SettingRow label="Sign out" danger onPress={handleSignOut} />
            </SettingSection>
          </>
        );

      case 'subscription':
        return (
          <>
            <View style={s.proBanner}>
              <Text style={s.proBannerTitle}>Fluentra Pro</Text>
              <Text style={s.proBannerSub}>Unlimited mocks, all modules, AI feedback</Text>
              <Text style={s.proBannerPrice}>$12 / month · renews May 15</Text>
            </View>
            <SettingSection title="Plan">
              <SettingRow label="Current plan" value="Pro" />
              <View style={s.rowDivider} />
              <SettingRow label="Upgrade / change plan" onPress={() => router.push('/upgrade' as any)} />
              <View style={s.rowDivider} />
              <SettingRow label="Billing history" onPress={() => {}} />
              <View style={s.rowDivider} />
              <SettingRow label="Cancel subscription" danger onPress={() => {}} />
            </SettingSection>
          </>
        );

      case 'preferences':
        return (
          <>
            <SettingSection title="Learning">
              <SettingRow label="Daily goal" value="15 minutes" onPress={() => {}} />
              <View style={s.rowDivider} />
              <SettingRow label="Native language" value="English" onPress={() => {}} />
              <View style={s.rowDivider} />
              <SettingRow label="UI language" value="English" onPress={() => {}} />
            </SettingSection>
            <SettingSection title="Display">
              <SettingRow label="Theme" value="System" onPress={() => {}} />
            </SettingSection>
          </>
        );

      case 'notifications':
        return (
          <>
            <SettingSection title="Reminders">
              <SettingRow
                label="Daily practice reminder"
                right={<Switch value={dailyReminder} onValueChange={setDailyReminder} thumbColor="#fff" trackColor={{ true: T.brand, false: T.border }} />}
              />
              <View style={s.rowDivider} />
              <SettingRow
                label="Streak alert"
                right={<Switch value={streakAlert} onValueChange={setStreakAlert} thumbColor="#fff" trackColor={{ true: T.brand, false: T.border }} />}
              />
            </SettingSection>
            <SettingSection title="Marketing">
              <SettingRow
                label="Product updates &amp; offers"
                right={<Switch value={marketing} onValueChange={setMarketing} thumbColor="#fff" trackColor={{ true: T.brand, false: T.border }} />}
              />
            </SettingSection>
          </>
        );

      case 'data':
        return (
          <>
            <SettingSection title="Your data">
              <SettingRow label="Export my data" onPress={() => {}} />
              <View style={s.rowDivider} />
              <SettingRow label="Delete account" danger onPress={() => Alert.alert('Delete account', 'This action cannot be undone. All your data will be permanently deleted.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive' }])} />
            </SettingSection>
          </>
        );
    }
  }

  const sidebar = (
    <View style={s.sidebarNav}>
      {TABS.map(t => (
        <TouchableOpacity
          key={t.key}
          style={[s.sidebarTab, activeTab === t.key && s.sidebarTabActive]}
          onPress={() => setActiveTab(t.key)}
        >
          <Text style={[s.sidebarTabText, activeTab === t.key && s.sidebarTabTextActive]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const settingsContent = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      <View style={s.pageHeader}>
        <Text style={s.eyebrow}>Settings</Text>
        <Text style={s.pageTitle}>Your account &amp; preferences.</Text>
      </View>

      {isDesktop ? (
        <View style={s.desktopLayout}>
          {sidebar}
          <View style={s.desktopContent}>{renderContent()}</View>
        </View>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll}>
            {TABS.map(t => (
              <TouchableOpacity key={t.key} style={[s.mobileTab, activeTab === t.key && s.mobileTabActive]} onPress={() => setActiveTab(t.key)}>
                <Text style={[s.mobileTabText, activeTab === t.key && s.mobileTabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {renderContent()}
        </>
      )}
      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{settingsContent}</AppLayout>;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {settingsContent}
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 18, gap: 20, paddingBottom: 20 },
  scrollDesktop: { padding: 28, paddingHorizontal: 36 },
  pageHeader: { gap: 4, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: T.ink4, letterSpacing: 1.4, textTransform: 'uppercase' },
  pageTitle: { fontFamily: T.serif, fontSize: 34, color: T.ink, lineHeight: 38 },

  desktopLayout: { flexDirection: 'row', gap: 32 },
  sidebarNav: { width: 180, gap: 2 },
  sidebarTab: { paddingVertical: 9, paddingHorizontal: 12, borderRadius: 9 },
  sidebarTabActive: { backgroundColor: T.bg2 },
  sidebarTabText: { fontSize: 13, fontWeight: '500', color: T.ink3 },
  sidebarTabTextActive: { fontWeight: '600', color: T.ink },
  desktopContent: { flex: 1, gap: 20 },

  tabScroll: { flexGrow: 0, marginBottom: 4 },
  mobileTab: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, marginRight: 4 },
  mobileTabActive: { backgroundColor: T.card, borderWidth: 1, borderColor: T.border },
  mobileTabText: { fontSize: 12.5, color: T.ink3, fontWeight: '500' },
  mobileTabTextActive: { color: T.ink, fontWeight: '700' },

  section: { gap: 6 },
  sectionTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  sectionBody: { backgroundColor: T.card, borderRadius: 14, borderWidth: 1, borderColor: T.border, overflow: 'hidden' },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  settingLabel: { fontSize: 14, color: T.ink2, fontWeight: '500' },
  settingValue: { fontSize: 12, color: T.ink4, marginTop: 2 },
  settingArrow: { fontSize: 18, color: T.ink5 },
  rowDivider: { height: 1, backgroundColor: T.hairline, marginLeft: 16 },

  proBanner: { backgroundColor: T.ink, borderRadius: 16, padding: 20, gap: 4 },
  proBannerTitle: { fontFamily: T.serif, fontSize: 22, color: '#fff' },
  proBannerSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
  proBannerPrice: { fontSize: 12, color: T.brand, fontWeight: '700', marginTop: 4 },
});
