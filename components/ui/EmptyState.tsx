import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/colors';

type Props = {
  iconComponent?: React.ReactNode;
  title:          string;
  subtitle:       string;
  actionLabel?:   string;
  onAction?:      () => void;
};

export function EmptyState({ iconComponent, title, subtitle, actionLabel, onAction }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.iconCircle}>
        {iconComponent ?? null}
      </View>
      <Text style={s.title}>{title}</Text>
      <Text style={s.subtitle}>{subtitle}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity style={s.btn} onPress={onAction} activeOpacity={0.85}>
          <Text style={s.btnText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 64, height: 64,
    borderRadius: 32,
    backgroundColor: '#EAEAEA',
    alignItems: 'center', justifyContent: 'center',
  },
  title:     { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: '#000', marginTop: 16, textAlign: 'center' },
  subtitle:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#999', marginTop: 8, textAlign: 'center', maxWidth: 260 },
  btn: {
    marginTop: 20,
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  btnText:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFF' },
});
