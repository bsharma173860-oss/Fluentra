import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Card } from '@/components/ui/Card';
import { BandScore } from '@/components/ui/BandScore';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { ProgressBar } from '@/components/ui/ProgressBar';

const EXAMS = ['IELTS', 'TOEFL', 'DELF', 'DELE'];

const SCORE_DATA: Record<string, {
  overall: number;
  sections: { label: string; score: number; max: number; color: string }[];
  history: { date: string; score: number }[];
}> = {
  IELTS: {
    overall: 7.5,
    sections: [
      { label: 'Speaking', score: 7.5, max: 9, color: Colors.p },
      { label: 'Writing', score: 6.5, max: 9, color: Colors.gold },
      { label: 'Listening', score: 8.0, max: 9, color: Colors.green },
      { label: 'Reading', score: 7.5, max: 9, color: Colors.orange },
    ],
    history: [
      { date: 'Jan', score: 6.5 },
      { date: 'Feb', score: 7.0 },
      { date: 'Mar', score: 7.0 },
      { date: 'Apr', score: 7.5 },
    ],
  },
  TOEFL: {
    overall: 98,
    sections: [
      { label: 'Reading', score: 26, max: 30, color: Colors.orange },
      { label: 'Listening', score: 28, max: 30, color: Colors.green },
      { label: 'Speaking', score: 22, max: 30, color: Colors.p },
      { label: 'Writing', score: 22, max: 30, color: Colors.gold },
    ],
    history: [
      { date: 'Jan', score: 85 },
      { date: 'Feb', score: 92 },
      { date: 'Mar', score: 95 },
      { date: 'Apr', score: 98 },
    ],
  },
  DELF: {
    overall: 78,
    sections: [
      { label: 'Compréhension orale', score: 20, max: 25, color: Colors.p },
      { label: 'Compréhension écrite', score: 19, max: 25, color: Colors.gold },
      { label: 'Production écrite', score: 18, max: 25, color: Colors.green },
      { label: 'Production orale', score: 21, max: 25, color: Colors.orange },
    ],
    history: [
      { date: 'Jan', score: 60 },
      { date: 'Feb', score: 68 },
      { date: 'Mar', score: 72 },
      { date: 'Apr', score: 78 },
    ],
  },
  DELE: {
    overall: 72,
    sections: [
      { label: 'Comprensión de lectura', score: 19, max: 25, color: Colors.orange },
      { label: 'Comprensión auditiva', score: 18, max: 25, color: Colors.green },
      { label: 'Expresión escrita', score: 17, max: 25, color: Colors.gold },
      { label: 'Expresión oral', score: 18, max: 25, color: Colors.p },
    ],
    history: [
      { date: 'Jan', score: 55 },
      { date: 'Feb', score: 60 },
      { date: 'Mar', score: 68 },
      { date: 'Apr', score: 72 },
    ],
  },
};

export default function ScoresScreen() {
  const [activeExam, setActiveExam] = useState('IELTS');
  const data = SCORE_DATA[activeExam];
  const maxScore = activeExam === 'IELTS' ? 9 : 100;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Scores</Text>

        {/* Exam tabs */}
        <View style={styles.examTabs}>
          {EXAMS.map((exam) => (
            <TouchableOpacity
              key={exam}
              onPress={() => setActiveExam(exam)}
              style={[styles.examTab, activeExam === exam && styles.examTabActive]}
            >
              <Text style={[styles.examTabText, activeExam === exam && styles.examTabTextActive]}>
                {exam}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Overall score */}
        <Card padding={24} style={styles.overallCard}>
          <BandScore score={data.overall} label="Overall Band Score" color={Colors.p} size="lg" />
          <View style={styles.overallMeta}>
            <Text style={styles.overallTarget}>Target: {maxScore === 9 ? '8.0' : maxScore === 100 ? '85' : '80'}</Text>
            <ProgressBar
              progress={data.overall / maxScore}
              color={Colors.p}
              height={6}
            />
          </View>
        </Card>

        {/* Section scores */}
        <Card padding={16} style={styles.sectionsCard}>
          <Text style={styles.cardTitle}>Section Scores</Text>
          <View style={styles.scoreBars}>
            {data.sections.map((s) => (
              <ScoreBar
                key={s.label}
                label={s.label}
                score={s.score}
                maxScore={s.max}
                color={s.color}
              />
            ))}
          </View>
        </Card>

        {/* Score history */}
        <Card padding={16}>
          <Text style={styles.cardTitle}>Score History</Text>
          <View style={styles.historyBars}>
            {data.history.map((h, i) => {
              const frac = h.score / maxScore;
              return (
                <View key={i} style={styles.historyBar}>
                  <Text style={styles.historyScore}>{h.score}</Text>
                  <View style={styles.historyTrack}>
                    <View style={[styles.historyFill, { height: `${frac * 100}%`, backgroundColor: Colors.p }]} />
                  </View>
                  <Text style={styles.historyDate}>{h.date}</Text>
                </View>
              );
            })}
          </View>
        </Card>
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
  examTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.bg2,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  examTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 9,
    alignItems: 'center',
  },
  examTabActive: { backgroundColor: Colors.white },
  examTabText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.ink3,
  },
  examTabTextActive: {
    fontFamily: 'Inter_700Bold',
    color: Colors.ink,
  },
  overallCard: { alignItems: 'center', gap: 16 },
  overallMeta: { width: '100%', gap: 6 },
  overallTarget: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.ink3,
    textAlign: 'center',
  },
  sectionsCard: { gap: 12 },
  cardTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.ink,
    marginBottom: 4,
  },
  scoreBars: { gap: 12 },
  historyBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    height: 120,
    marginTop: 8,
  },
  historyBar: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    height: '100%',
    justifyContent: 'flex-end',
  },
  historyScore: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.p,
  },
  historyTrack: {
    width: '100%',
    height: 80,
    backgroundColor: Colors.bg2,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  historyFill: {
    width: '100%',
    borderRadius: 6,
    backgroundColor: Colors.p,
  },
  historyDate: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.ink3,
  },
});
