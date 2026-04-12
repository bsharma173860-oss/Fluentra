import React from 'react';
import { View, Text, Image, StyleSheet, type ImageSourcePropType } from 'react-native';
import { Colors } from '@/constants/colors';
import { ProgressBar } from './ProgressBar';

type ExamBadge = {
  name: string;
  color: string;
  bgColor: string;
};

type LanguageCardProps = {
  flagSource: ImageSourcePropType;
  name: string;
  nativeName: string;
  fluency: number; // 0–100
  examBadges?: ExamBadge[];
};

export function LanguageCard({ flagSource, name, nativeName, fluency, examBadges = [] }: LanguageCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={flagSource} style={styles.flag} resizeMode="cover" />
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.nativeName}>{nativeName}</Text>
        </View>
        <Text style={styles.fluencyPct}>{fluency}%</Text>
      </View>
      <ProgressBar
        progress={fluency / 100}
        color={Colors.p}
        trackColor={Colors.bg2}
        height={5}
        animated
      />
      {examBadges.length > 0 && (
        <View style={styles.badges}>
          {examBadges.map((badge) => (
            <View key={badge.name} style={[styles.badge, { backgroundColor: badge.bgColor }]}>
              <Text style={[styles.badgeText, { color: badge.color }]}>{badge.name}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    width: 200,
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  flag: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.ink,
  },
  nativeName: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.ink3,
    marginTop: 1,
  },
  fluencyPct: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
    color: Colors.p,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
});
