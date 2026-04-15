import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { LightningIcon } from '@/components/icons';

type Props = {
  onUpgrade?: () => void;
  resetLabel?: string;
};

export function UsageLimitBanner({ onUpgrade, resetLabel = 'Resets tomorrow' }: Props) {
  return (
    <View style={s.card}>
      {/* Row 1 — title */}
      <View style={s.titleRow}>
        <LightningIcon size={16} color={Colors.p} strokeWidth={2} />
        <Text style={s.title}>You've reached your daily limit</Text>
      </View>

      {/* Row 2 — body */}
      <Text style={s.body}>
        Upgrade to Pro for 5 sessions per day, all exam types, and detailed AI feedback.
      </Text>

      {/* Row 3 — actions */}
      <View style={s.actions}>
        <TouchableOpacity style={s.upgradeBtn} onPress={onUpgrade} activeOpacity={0.85}>
          <Text style={s.upgradeBtnText}>Upgrade to Pro</Text>
        </TouchableOpacity>
        <Text style={s.resetText}>{resetLabel}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: '#FAF7F0',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
    marginHorizontal: 16,
    gap: 8,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  body:  {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.ink2,
    lineHeight: 20,
  },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  upgradeBtn: {
    backgroundColor: Colors.p,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  upgradeBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white },
  resetText:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
});
