import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { TimerChip } from '@/components/ui/TimerChip';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { Button } from '@/components/ui/Button';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'speaking', label: 'Speaking' },
  { key: 'writing', label: 'Writing' },
  { key: 'listening', label: 'Listening' },
  { key: 'reading', label: 'Reading' },
];

const SESSIONS = [
  {
    key: '1',
    type: 'speaking',
    icon: '🎙',
    title: 'IELTS Speaking Part 2',
    duration: 120,
    score: 7.5,
    maxScore: 9,
    color: Colors.p,
    bg: Colors.p_soft,
    date: 'Today, 9:00 AM',
  },
  {
    key: '2',
    type: 'writing',
    icon: '✏️',
    title: 'Task 1 – Graph Description',
    duration: 1200,
    score: 6.5,
    maxScore: 9,
    color: Colors.gold,
    bg: Colors.gold_bg,
    date: 'Yesterday',
  },
  {
    key: '3',
    type: 'listening',
    icon: '🎧',
    title: 'Section 3 – Academic Discussion',
    duration: 600,
    score: 32,
    maxScore: 40,
    color: Colors.green,
    bg: Colors.green_bg,
    date: '2 days ago',
  },
  {
    key: '4',
    type: 'reading',
    icon: '📖',
    title: 'Passage 2 – Science',
    duration: 900,
    score: 11,
    maxScore: 13,
    color: Colors.orange,
    bg: Colors.orange_bg,
    date: '3 days ago',
  },
];

export default function PracticeScreen() {
  const [active, setActive] = useState('all');
  const filtered = active === 'all' ? SESSIONS : SESSIONS.filter((s) => s.type === active);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Practice</Text>

        {/* Quick Start */}
        <Card style={styles.quickStart}>
          <Text style={styles.qs_label}>Ready to practice?</Text>
          <Text style={styles.qs_sub}>Your AI tutor is waiting.</Text>
          <Button label="Start speaking session" onPress={() => router.push('/modules/speaking/select' as any)} fullWidth style={{ marginTop: 12 }} />
        </Card>

        {/* Listening module card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/modules/listening/select' as any)}
        >
          <Card style={styles.writingCard}>
            <View style={styles.writingLeft}>
              <View style={[styles.writingIconWrap, { backgroundColor: Colors.green_bg }]}>
                <Text style={styles.writingIcon}>🎧</Text>
              </View>
              <View style={styles.writingInfo}>
                <Text style={styles.writingTitle}>Listening Practice</Text>
                <Text style={styles.writingSub}>Section 1 · 2 · 3 · 4</Text>
              </View>
            </View>
            <View style={[styles.writingBadge, { backgroundColor: Colors.green }]}>
              <Text style={styles.writingBadgeText}>Start →</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Writing module card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push('/modules/writing/select' as any)}
        >
          <Card style={styles.writingCard}>
            <View style={styles.writingLeft}>
              <View style={styles.writingIconWrap}>
                <Text style={styles.writingIcon}>✍️</Text>
              </View>
              <View style={styles.writingInfo}>
                <Text style={styles.writingTitle}>Writing Practice</Text>
                <Text style={styles.writingSub}>Task 1 · Task 2 · Full Exam</Text>
              </View>
            </View>
            <View style={styles.writingBadge}>
              <Text style={styles.writingBadgeText}>Start →</Text>
            </View>
          </Card>
        </TouchableOpacity>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              onPress={() => setActive(cat.key)}
              style={[styles.chip, active === cat.key && styles.chipActive]}
            >
              <Text style={[styles.chipText, active === cat.key && styles.chipTextActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Session cards */}
        <View style={styles.sessions}>
          {filtered.map((session) => (
            <TouchableOpacity
            key={session.key}
            activeOpacity={0.85}
            onPress={
              session.type === 'writing'   ? () => router.push('/modules/writing/select' as any) :
              session.type === 'listening' ? () => router.push('/modules/listening/select' as any) :
              session.type === 'reading'   ? () => router.push('/modules/reading/select' as any) :
              undefined
            }
          >
              <Card padding={14} style={styles.sessionCard}>
                <View style={styles.sessionTop}>
                  <View style={[styles.sessionIconWrap, { backgroundColor: session.bg }]}>
                    <Text style={styles.sessionIcon}>{session.icon}</Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionTitle}>{session.title}</Text>
                    <Text style={styles.sessionDate}>{session.date}</Text>
                  </View>
                  <TimerChip
                    seconds={session.duration}
                    color={session.color}
                    bgColor={session.bg}
                  />
                </View>
                <ScoreBar
                  label="Score"
                  score={session.score}
                  maxScore={session.maxScore}
                  color={session.color}
                />
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  content: { padding: 20, gap: 16 },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 30,
    color: Colors.ink,
    marginBottom: 4,
  },
  quickStart: { gap: 4 },
  qs_label: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  qs_sub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  chips: { gap: 8, paddingBottom: 4 },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.p, borderColor: Colors.p },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  chipTextActive: { color: Colors.white },
  writingCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  writingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  writingIconWrap: {
    width: 46, height: 46, borderRadius: 13,
    backgroundColor: Colors.gold_bg,
    alignItems: 'center', justifyContent: 'center',
  },
  writingIcon: { fontSize: 22 },
  writingInfo: { gap: 2 },
  writingTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: Colors.ink },
  writingSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  writingBadge: {
    backgroundColor: Colors.p,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  writingBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.white },
  sessions: { gap: 12 },
  sessionCard: { gap: 12 },
  sessionTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  sessionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sessionIcon: { fontSize: 22 },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  sessionDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
});
