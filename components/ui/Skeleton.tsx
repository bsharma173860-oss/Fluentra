import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

// ── Base shimmer ──────────────────────────────────────────────────
function Shimmer({ style }: { style: any }) {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.8, duration: 900, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return <Animated.View style={[s.base, style, { opacity }]} />;
}

// ── Text line skeleton ────────────────────────────────────────────
export function SkeletonText({ width = '80%', height = 14 }: { width?: number | string; height?: number }) {
  return <Shimmer style={{ width, height, borderRadius: 6 }} />;
}

// ── Generic card skeleton ─────────────────────────────────────────
export function SkeletonCard({ height = 80 }: { height?: number }) {
  return (
    <View style={[s.card, { height }]}>
      <Shimmer style={s.cardIcon} />
      <View style={s.cardLines}>
        <Shimmer style={{ width: '60%', height: 14, borderRadius: 6 }} />
        <Shimmer style={{ width: '40%', height: 11, borderRadius: 6, marginTop: 8 }} />
      </View>
    </View>
  );
}

// ── Language card skeleton (matches home page card shape) ─────────
export function SkeletonLanguageCard({ width = 160 }: { width?: number }) {
  return (
    <View style={[s.langCard, { width }]}>
      <View style={s.langCardTop}>
        <Shimmer style={s.langFlag} />
        <Shimmer style={{ width: 60, height: 12, borderRadius: 5 }} />
      </View>
      <Shimmer style={{ width: '70%', height: 18, borderRadius: 6, marginTop: 14 }} />
      <Shimmer style={{ width: '50%', height: 12, borderRadius: 5, marginTop: 8 }} />
      <Shimmer style={{ width: '100%', height: 6, borderRadius: 3, marginTop: 14 }} />
    </View>
  );
}

const s = StyleSheet.create({
  base: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
  },
  cardIcon:  { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E0E0E0' },
  cardLines: { flex: 1, gap: 0 },

  langCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 14,
  },
  langCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  langFlag:    { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E0E0E0' },
});
