import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { AppLayout } from '@/components/layout/AppLayout';

const NOTIFICATIONS = [
  { id: 1, type: 'streak', emoji: '🔥', title: 'Keep your streak alive!', body: 'You have 2 hours left to practice today.', time: '2h ago', unread: true },
  { id: 2, type: 'result', emoji: '📊', title: 'Speaking results ready', body: 'Your AI feedback for Part 2 is available.', time: '4h ago', unread: true },
  { id: 3, type: 'friend', emoji: '👥', title: 'Liam extended his streak!', body: 'Liam is now on a 21-day streak. Send a cheer!', time: '6h ago', unread: false },
  { id: 4, type: 'exam',   emoji: '🏆', title: 'Exam unlock in 2 days', body: 'Keep up the streak to unlock your IELTS mock.', time: 'Yesterday', unread: false },
  { id: 5, type: 'tip',    emoji: '💡', title: 'Band 7+ tip for Reading', body: 'Use the T-F-NG strategy to save 30% more time.', time: '2 days ago', unread: false },
  { id: 6, type: 'update', emoji: '✨', title: 'New feature: Grammar Hub', body: 'Interactive grammar lessons are now available.', time: '3 days ago', unread: false },
];

export default function NotificationsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}><Text style={s.backBtnText}>←</Text></TouchableOpacity>
        <Text style={s.headerTitle}>Notifications</Text>
        <TouchableOpacity><Text style={s.markAllText}>Mark all read</Text></TouchableOpacity>
      </View>

      <View style={s.notifList}>
        {NOTIFICATIONS.map((n, i) => (
          <TouchableOpacity
            key={n.id}
            style={[s.notifRow, n.unread && s.notifRowUnread, i < NOTIFICATIONS.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]}
            activeOpacity={0.7}
          >
            {n.unread && <View style={s.unreadDot} />}
            <View style={s.notifIcon}>
              <Text style={{ fontSize: 20 }}>{n.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.notifTitle}>{n.title}</Text>
              <Text style={s.notifBody} numberOfLines={2}>{n.body}</Text>
              <Text style={s.notifTime}>{n.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: T.border },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  backBtnText: { fontSize: 18, color: T.ink3 },
  headerTitle: { flex: 1, fontSize: 16, fontWeight: '700', color: T.ink },
  markAllText: { fontSize: 12.5, color: T.brand, fontWeight: '700' },
  notifList: { backgroundColor: T.card, marginHorizontal: 0, borderTopWidth: 0 },
  notifRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12, position: 'relative' },
  notifRowUnread: { backgroundColor: T.brandSoft },
  unreadDot: { position: 'absolute', top: 20, left: 6, width: 7, height: 7, borderRadius: 4, backgroundColor: T.brand },
  notifIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: T.bg2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  notifTitle: { fontSize: 14, fontWeight: '700', color: T.ink, lineHeight: 20 },
  notifBody: { fontSize: 13, color: T.ink3, lineHeight: 18, marginTop: 2 },
  notifTime: { fontSize: 11, color: T.ink5, marginTop: 4 },
});
