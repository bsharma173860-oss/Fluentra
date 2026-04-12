import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProgressBar } from './ProgressBar';

type ScoreBarProps = {
  label: string;
  score: number;
  maxScore?: number;
  color?: string;
};

export function ScoreBar({ label, score, maxScore = 9, color = Colors.p }: ScoreBarProps) {
  const fraction = Math.min(score / maxScore, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.score, { color }]}>{score}</Text>
      </View>
      <ProgressBar progress={fraction} color={color} height={6} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.ink2,
  },
  score: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
  },
});
