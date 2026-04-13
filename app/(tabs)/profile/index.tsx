import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/authContext';

const ACHIEVEMENTS = [
  { icon: '🔥', title: '20-Day Streak', desc: 'Practiced 20 days in a row', unlocked: true },
  { icon: '🎯', title: 'Band 7 Club', desc: 'Achieved Band 7+ overall', unlocked: true },
  { icon: '🌍', title: 'Polyglot', desc: 'Learning 3+ languages', unlocked: true },
  { icon: '🏆', title: 'Top 1500', desc: 'Ranked in global top 1500', unlocked: true },
  { icon: '⚡', title: 'Speed Talker', desc: 'Complete 5 sessions in a day', unlocked: false },
  { icon: '💎', title: 'Perfect Score', desc: 'Score 9.0 in any section', unlocked: false },
];

const GENERAL_SETTINGS = [
  { icon: '🔔', label: 'Notifications' },
  { icon: '🌐', label: 'Language preferences' },
  { icon: '🎯', label: 'Study goals' },
  { icon: '🔒', label: 'Privacy & Security' },
  { icon: '💬', label: 'Help & Support' },
  { icon: '⭐', label: 'Rate Fluentra' },
];

export default function ProfileScreen() {
  const { profile, signOut } = useAuth();

  const name = profile?.name ?? 'User';
  const email = profile?.email ?? '';
  const initial = name[0]?.toUpperCase() ?? '?';
  const isPro = profile?.subscription_tier === 'pro';
  const targetExam = profile?.target_exam ?? 'IELTS';
  const targetScore = profile?.target_score ?? 7.0;
  const nativeLang = profile?.native_language ?? 'English';
  const streakCount = profile?.streak_count ?? 0;

  function handleSignOut() {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
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
                {isPro
                  ? <View style={s.proBadge}><Text style={s.proBadgeText}>PRO</Text></View>
                  : <View style={s.freeBadge}><Text style={s.freeBadgeText}>FREE PLAN</Text></View>
                }
              </View>
              <Text style={s.profileEmail}>{email}</Text>
              <Text style={s.profileMeta}>Target: {targetExam} · {targetScore.toFixed(1)}</Text>
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
              <Text style={s.statNum}>{nativeLang.slice(0, 3).toUpperCase()}</Text>
              <Text style={s.statLabel}>Native</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.stat}>
              <Text style={s.statNum}>#1284</Text>
              <Text style={s.statLabel}>Global rank</Text>
            </View>
          </View>
        </Card>

        {/* Pro upgrade (free users only) */}
        {!isPro && (
          <TouchableOpacity style={s.proCard} activeOpacity={0.88}>
            <View style={s.proLeft}>
              <Text style={s.proTitle}>Upgrade to Pro</Text>
              <Text style={s.proSub}>Unlock reading, full exams & analytics</Text>
            </View>
            <View style={s.proBtn}>
              <Text style={s.proBtnText}>Upgrade →</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Achievements */}
        <Text style={s.sectionHeading}>Achievements</Text>
        <View style={s.achievements}>
          {ACHIEVEMENTS.map((a) => (
            <View key={a.title} style={[s.achievement, !a.unlocked && s.achievementLocked]}>
              <Text style={[s.achievementIcon, !a.unlocked && { opacity: 0.3 }]}>{a.icon}</Text>
              <Text style={[s.achievementTitle, !a.unlocked && { color: Colors.ink4 }]}>{a.title}</Text>
              <Text style={s.achievementDesc}>{a.desc}</Text>
            </View>
          ))}
        </View>

        {/* General settings */}
        <Text style={s.sectionHeading}>Settings</Text>
        <Card padding={0} style={{ overflow: 'hidden' }}>
          {GENERAL_SETTINGS.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[s.settingRow, i < GENERAL_SETTINGS.length - 1 && s.settingBorder]}
              activeOpacity={0.7}
            >
              <Text style={s.settingIcon}>{item.icon}</Text>
              <Text style={s.settingLabel}>{item.label}</Text>
              <Text style={s.settingArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Account / legal */}
        <Card padding={0} style={{ overflow: 'hidden' }}>
          <TouchableOpacity style={[s.settingRow, s.settingBorder]} activeOpacity={0.7}>
            <Text style={s.settingIcon}>💳</Text>
            <Text style={s.settingLabel}>Billing</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.settingRow, s.settingBorder]} activeOpacity={0.7}>
            <Text style={s.settingIcon}>📄</Text>
            <Text style={s.settingLabel}>Privacy Policy</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.settingRow, s.settingBorder]} activeOpacity={0.7}>
            <Text style={s.settingIcon}>📋</Text>
            <Text style={s.settingLabel}>Terms of Service</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.settingRow} activeOpacity={0.7}>
            <Text style={s.settingIcon}>🗑</Text>
            <Text style={[s.settingLabel, { color: Colors.danger }]}>Delete Account</Text>
            <Text style={s.settingArrow}>›</Text>
          </TouchableOpacity>
        </Card>

        <TouchableOpacity style={s.signOutBtn} onPress={handleSignOut} activeOpacity={0.88}>
          <Text style={s.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 20 },

  profileCard: { gap: 16 },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  avatarWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 28, color: Colors.white },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  freeBadge: { backgroundColor: Colors.bg2, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: Colors.border },
  freeBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3 },
  proBadge: { backgroundColor: Colors.gold_bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  proBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: Colors.gold },
  profileEmail: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, marginTop: 3 },
  profileMeta: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, marginTop: 3 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

  proCard: { backgroundColor: Colors.p, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 12 },
  proLeft: { flex: 1 },
  proTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.white },
  proSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  proBtn: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  proBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.white },

  sectionHeading: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  achievements: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievement: { width: '47%', backgroundColor: Colors.white, borderRadius: 14, borderWidth: 1, borderColor: Colors.border, padding: 14, gap: 4 },
  achievementLocked: { backgroundColor: Colors.bg2 },
  achievementIcon: { fontSize: 26 },
  achievementTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  achievementDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },

  settingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15, gap: 12 },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon: { fontSize: 18, width: 24 },
  settingLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.ink, flex: 1 },
  settingArrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: Colors.ink4 },

  signOutBtn: { backgroundColor: Colors.danger + '15', borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.danger + '30' },
  signOutText: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.danger },
});
