import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ExamProfiles } from '@/constants/examProfiles';

const UPCOMING = [
  { exam: 'IELTS', date: 'May 15, 2026', registered: true, daysLeft: 33 },
  { exam: 'TOEFL', date: 'Jun 8, 2026', registered: false, daysLeft: 57 },
];

const PAST = [
  { exam: 'IELTS', date: 'Mar 1, 2026', bandScore: 7.0, passed: true },
  { exam: 'DELF', date: 'Jan 20, 2026', bandScore: 68, passed: true },
];

export default function ExamsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Exams</Text>

        <Text style={styles.sectionTitle}>Upcoming</Text>
        <View style={styles.section}>
          {UPCOMING.map((item) => {
            const profile = ExamProfiles[item.exam];
            return (
              <Card key={item.exam + item.date} padding={16} style={styles.examCard}>
                <View style={styles.examRow}>
                  <View style={[styles.examBadge, { backgroundColor: profile.bgColor }]}>
                    <Text style={[styles.examBadgeText, { color: profile.color }]}>
                      {profile.shortName}
                    </Text>
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={styles.examName}>{profile.name}</Text>
                    <Text style={styles.examDate}>📅 {item.date}</Text>
                  </View>
                  <View style={[styles.daysChip, { backgroundColor: item.registered ? Colors.green_bg : Colors.bg2 }]}>
                    <Text style={[styles.daysText, { color: item.registered ? Colors.green : Colors.ink3 }]}>
                      {item.daysLeft}d
                    </Text>
                  </View>
                </View>
                <View style={styles.examSections}>
                  {profile.sections.map((s) => (
                    <View key={s} style={styles.sectionChip}>
                      <Text style={styles.sectionChipText}>{s}</Text>
                    </View>
                  ))}
                </View>
                <Button
                  label={item.registered ? 'View details' : 'Register now'}
                  variant={item.registered ? 'secondary' : 'primary'}
                  onPress={() => {}}
                  fullWidth
                />
              </Card>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Past Exams</Text>
        <View style={styles.section}>
          {PAST.map((item) => {
            const profile = ExamProfiles[item.exam];
            return (
              <Card key={item.exam + item.date} padding={14}>
                <View style={styles.examRow}>
                  <View style={[styles.examBadge, { backgroundColor: profile.bgColor }]}>
                    <Text style={[styles.examBadgeText, { color: profile.color }]}>
                      {profile.shortName}
                    </Text>
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={styles.examName}>{profile.name}</Text>
                    <Text style={styles.examDate}>{item.date}</Text>
                  </View>
                  <View>
                    <Text style={[styles.pastScore, { color: item.passed ? Colors.green : Colors.danger }]}>
                      {item.bandScore}
                    </Text>
                    <Text style={[styles.passLabel, { color: item.passed ? Colors.green : Colors.danger }]}>
                      {item.passed ? 'Pass' : 'Fail'}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>All Exams</Text>
        <View style={styles.section}>
          {Object.values(ExamProfiles).map((profile) => (
            <TouchableOpacity key={profile.id} activeOpacity={0.85}>
              <Card padding={16}>
                <View style={styles.allExamRow}>
                  <View style={[styles.examBadge, { backgroundColor: profile.bgColor }]}>
                    <Text style={[styles.examBadgeText, { color: profile.color }]}>
                      {profile.shortName}
                    </Text>
                  </View>
                  <View style={styles.allExamInfo}>
                    <Text style={styles.examName}>{profile.name}</Text>
                    <Text style={styles.examDesc}>{profile.description}</Text>
                  </View>
                  <Text style={styles.arrow}>›</Text>
                </View>
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
  content: { padding: 20, gap: 12 },
  title: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 30,
    color: Colors.ink,
    marginBottom: 4,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.ink,
    marginTop: 4,
  },
  section: { gap: 12 },
  examCard: { gap: 12 },
  examRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  examBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  examBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 12 },
  examInfo: { flex: 1 },
  examName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  examDate: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  examDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  daysChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
  },
  daysText: { fontFamily: 'Inter_700Bold', fontSize: 13 },
  examSections: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  sectionChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionChipText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink2 },
  pastScore: {
    fontFamily: 'DMSerifDisplay_400Regular',
    fontSize: 22,
    textAlign: 'right',
  },
  passLabel: { fontFamily: 'Inter_500Medium', fontSize: 11, textAlign: 'right' },
  allExamRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  allExamInfo: { flex: 1 },
  arrow: { fontFamily: 'Inter_400Regular', fontSize: 20, color: Colors.ink4 },
});
