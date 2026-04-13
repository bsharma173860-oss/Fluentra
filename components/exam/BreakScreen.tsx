import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

const BREAK_SECONDS = __DEV__ ? 5 : 300; // 5 s in dev, 5 min in prod

export type ModuleKey = 'listening' | 'reading' | 'writing' | 'speaking';

const MODULE_META: Record<ModuleKey, { icon: string; color: string; label: string }> = {
  listening: { icon: '🎧', color: Colors.green,  label: 'Listening' },
  reading:   { icon: '📖', color: Colors.orange, label: 'Reading'   },
  writing:   { icon: '✏️',  color: Colors.gold,   label: 'Writing'   },
  speaking:  { icon: '🎙',  color: Colors.p,      label: 'Speaking'  },
};

export type ModuleScore = {
  module: ModuleKey;
  score: number;
  maxScore: number;
};

type Props = {
  justCompleted: ModuleScore;
  nextModule: ModuleKey;
  onComplete: () => void;
};

export function BreakScreen({ justCompleted, nextModule, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState(BREAK_SECONDS);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const calledRef = useRef(false);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: BREAK_SECONDS * 1000,
      useNativeDriver: false,
    }).start();

    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(id);
          if (!calledRef.current) {
            calledRef.current = true;
            onComplete();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
  const cm = MODULE_META[justCompleted.module];
  const nm = MODULE_META[nextModule];
  const scorePct = Math.min(justCompleted.score / justCompleted.maxScore, 1);

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      {/* ── Timer ── */}
      <View style={s.timerSection}>
        <Text style={s.breakLabel}>BREAK TIME</Text>
        <Text style={s.timer}>{timeStr}</Text>

        <View style={s.progressTrack}>
          <Animated.View
            style={[
              s.progressFill,
              {
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <View style={s.nextUpRow}>
          <Text style={s.nextUpGray}>Next up:</Text>
          <View style={[s.nextUpChip, { backgroundColor: nm.color + '28' }]}>
            <Text style={s.nextUpIcon}>{nm.icon}</Text>
            <Text style={[s.nextUpLabel, { color: nm.color }]}>{nm.label}</Text>
          </View>
        </View>
      </View>

      {/* ── Score card ── */}
      <View style={s.scoreCard}>
        <View style={s.scoreCardHeader}>
          <View style={[s.moduleIconWrap, { backgroundColor: cm.color + '28' }]}>
            <Text style={s.moduleIcon}>{cm.icon}</Text>
          </View>
          <View>
            <Text style={s.completedLabel}>{cm.label} completed</Text>
            <Text style={s.encouragement}>Great work! Keep it up.</Text>
          </View>
        </View>

        <View style={s.scoreRow}>
          <Text style={[s.scoreNum, { color: cm.color }]}>
            {justCompleted.score}
            <Text style={s.scoreSlash}>/{justCompleted.maxScore}</Text>
          </Text>
          <View style={s.scoreBarWrap}>
            <View style={s.scoreBarTrack}>
              <View
                style={[
                  s.scoreBarFill,
                  { width: `${scorePct * 100}%` as any, backgroundColor: cm.color },
                ]}
              />
            </View>
            <Text style={[s.scorePctText, { color: cm.color }]}>
              {Math.round(scorePct * 100)}%
            </Text>
          </View>
        </View>
      </View>

      <Text style={s.hint}>Rest up · Break cannot be skipped</Text>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1, backgroundColor: '#1A1A2E',
    alignItems: 'center', justifyContent: 'center',
    padding: 28, gap: 28,
  },

  timerSection: { alignItems: 'center', gap: 16, width: '100%' },
  breakLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11,
    color: 'rgba(255,255,255,0.45)', letterSpacing: 2.5,
  },
  timer: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 72,
    color: Colors.white, lineHeight: 80,
  },
  progressTrack: {
    width: '100%', height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: {
    height: '100%', backgroundColor: '#F59E0B', borderRadius: 3,
  },
  nextUpRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  nextUpGray: { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.45)' },
  nextUpChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20,
  },
  nextUpIcon: { fontSize: 15 },
  nextUpLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },

  scoreCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 20, borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 20, gap: 14,
  },
  scoreCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  moduleIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  moduleIcon: { fontSize: 22 },
  completedLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
  encouragement: { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  scoreNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 48, lineHeight: 54 },
  scoreSlash: { fontFamily: 'Inter_400Regular', fontSize: 22, color: 'rgba(255,255,255,0.35)' },
  scoreBarWrap: { flex: 1, gap: 5 },
  scoreBarTrack: {
    height: 8, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4, overflow: 'hidden',
  },
  scoreBarFill: { height: '100%', borderRadius: 4 },
  scorePctText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  hint: {
    fontFamily: 'Inter_400Regular', fontSize: 12,
    color: 'rgba(255,255,255,0.28)', textAlign: 'center',
  },
});
