import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { BandScore } from '@/components/ui/BandScore';
import { Button } from '@/components/ui/Button';

const USER = {
  name: 'Ahmed Al-Rashid',
  handle: '@ahmed_fluent',
  avatar: '🧑‍💼',
  streak: 22,
  bandScore: 7.5,
  globalRank: 1284,
  languages: 3,
  sessionsCompleted: 147,
  hoursStudied: 89,
  joinDate: 'January 2026',
};

const ACHIEVEMENTS = [
  { icon: '🔥', title: '20-Day Streak', desc: 'Practiced 20 days in a row', unlocked: true },
  { icon: '🎯', title: 'Band 7 Club', desc: 'Achieved Band 7+ overall', unlocked: true },
  { icon: '🌍', title: 'Polyglot', desc: 'Learning 3+ languages', unlocked: true },
  { icon: '🏆', title: 'Top 1500', desc: 'Ranked in global top 1500', unlocked: true },
  { icon: '⚡', title: 'Speed Talker', desc: 'Complete 5 sessions in a day', unlocked: false },
  { icon: '💎', title: 'Perfect Score', desc: 'Score 9.0 in any section', unlocked: false },
];

const SETTINGS = [
  { icon: '🔔', label: 'Notifications' },
  { icon: '🌐', label: 'Language preferences' },
  { icon: '🎯', label: 'Study goals' },
  { icon: '🔒', label: 'Privacy & Security' },
  { icon: '💬', label: 'Help & Support' },
  { icon: '⭐', label: 'Rate Fluentra' },
];

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <Card padding={20} style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarEmoji}>{USER.avatar}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{USER.name}</Text>
              <Text style={styles.profileHandle}>{USER.handle}</Text>
              <Text style={styles.profileJoin}>Member since {USER.joinDate}</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Text style={styles.editBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{USER.sessionsCompleted}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{USER.hoursStudied}h</Text>
              <Text style={styles.statLabel}>Studied</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>🔥 {USER.streak}</Text>
              <Text style={styles.statLabel}>Day streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>#{USER.globalRank.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Global rank</Text>
            </View>
          </View>
        </Card>

        {/* Band score */}
        <Card padding={20} style={styles.bandCard}>
          <Text style={styles.sectionTitle}>Overall Performance</Text>
          <BandScore score={USER.bandScore} label="Overall Band Score" color={Colors.p} size="lg" />
        </Card>

        {/* Achievements */}
        <View>
          <Text style={styles.sectionHeading}>Achievements</Text>
          <View style={styles.achievements}>
            {ACHIEVEMENTS.map((a) => (
              <View key={a.title} style={[styles.achievement, !a.unlocked && styles.achievementLocked]}>
                <Text style={[styles.achievementIcon, !a.unlocked && { opacity: 0.3 }]}>{a.icon}</Text>
                <Text style={[styles.achievementTitle, !a.unlocked && { color: Colors.ink4 }]}>{a.title}</Text>
                <Text style={styles.achievementDesc}>{a.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View>
          <Text style={styles.sectionHeading}>Settings</Text>
          <Card padding={0} style={{ overflow: 'hidden' }}>
            {SETTINGS.map((item, i) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.settingRow, i < SETTINGS.length - 1 && styles.settingBorder]}
                activeOpacity={0.7}
              >
                <Text style={styles.settingIcon}>{item.icon}</Text>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        <Button label="Sign out" variant="danger" onPress={() => {}} fullWidth />
        <View style={{ height: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 20 },
  profileCard: { gap: 16 },
  profileTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14 },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.p_soft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.p,
  },
  avatarEmoji: { fontSize: 32 },
  profileInfo: { flex: 1 },
  profileName: { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink },
  profileHandle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.p, marginTop: 2 },
  profileJoin: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, marginTop: 3 },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 3 },
  statNum: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  bandCard: { alignItems: 'center', gap: 12 },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  sectionHeading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 17,
    color: Colors.ink,
    marginBottom: 12,
  },
  achievements: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achievement: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    gap: 4,
  },
  achievementLocked: { backgroundColor: Colors.bg2 },
  achievementIcon: { fontSize: 26 },
  achievementTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  achievementDesc: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    gap: 12,
  },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  settingIcon: { fontSize: 18, width: 24 },
  settingLabel: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.ink, flex: 1 },
  settingArrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: Colors.ink4 },
});
