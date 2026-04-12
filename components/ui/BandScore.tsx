import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type BandScoreProps = {
  score: number;
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function BandScore({ score, label, color = Colors.p, size = 'md' }: BandScoreProps) {
  const fontSize = size === 'sm' ? 28 : size === 'md' ? 42 : 56;
  const labelSize = size === 'sm' ? 11 : size === 'md' ? 13 : 15;

  return (
    <View style={styles.container}>
      <Text style={[styles.number, { color, fontSize }]}>{score.toFixed(1)}</Text>
      {label && (
        <Text style={[styles.label, { fontSize: labelSize }]}>{label}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  number: {
    fontFamily: 'DMSerifDisplay_400Regular',
    lineHeight: undefined,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    color: Colors.ink3,
    marginTop: 2,
  },
});
