import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/colors';

type ProgressBarProps = {
  progress: number; // 0–1
  color?: string;
  trackColor?: string;
  height?: number;
  borderRadius?: number;
  animated?: boolean;
};

export function ProgressBar({
  progress,
  color = Colors.p,
  trackColor = Colors.bg2,
  height = 8,
  borderRadius = 99,
  animated = true,
}: ProgressBarProps) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(anim, {
        toValue: Math.min(Math.max(progress, 0), 1),
        duration: 600,
        useNativeDriver: false,
      }).start();
    } else {
      anim.setValue(Math.min(Math.max(progress, 0), 1));
    }
  }, [progress, animated]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.track, { height, borderRadius, backgroundColor: trackColor }]}>
      <Animated.View
        style={[styles.fill, { height, borderRadius, backgroundColor: color, width }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {},
});
