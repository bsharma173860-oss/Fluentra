import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

type TimerChipProps = {
  seconds: number;
  color?: string;
  bgColor?: string;
};

function pad(n: number) {
  return String(n).padStart(2, '0');
}

export function TimerChip({ seconds, color = Colors.p, bgColor = Colors.p_soft }: TimerChipProps) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <View style={[styles.chip, { backgroundColor: bgColor }]}>
      <Text style={[styles.text, { color }]}>
        {pad(mins)}:{pad(secs)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});
