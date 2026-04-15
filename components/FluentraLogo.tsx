import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';

// ── SVG icon (coral rounded square with 3 wave lines) ─────────────
export function FluentraIcon({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 28 28">
      <Rect width="28" height="28" rx="8" fill="#D97757" />
      <Path
        d="M7 9 Q14 6 21 9"
        stroke="white" strokeWidth="2" fill="none"
        strokeLinecap="round" opacity={1}
      />
      <Path
        d="M7 14 Q14 11 21 14"
        stroke="white" strokeWidth="2" fill="none"
        strokeLinecap="round" opacity={0.7}
      />
      <Path
        d="M7 19 Q14 16 21 19"
        stroke="white" strokeWidth="2" fill="none"
        strokeLinecap="round" opacity={0.4}
      />
    </Svg>
  );
}

// ── Logo: icon + wordmark ─────────────────────────────────────────
type LogoProps = {
  iconSize?: number;
  textSize?: number;
  showIcon?: boolean;
};

export function FluentraLogo({ iconSize = 28, textSize = 22, showIcon = true }: LogoProps) {
  return (
    <View style={[l.row, { gap: Math.round(iconSize * 0.35) }]}>
      {showIcon && <FluentraIcon size={iconSize} />}
      <Text style={[l.text, { fontSize: textSize }]}>
        Fluent<Text style={l.ra}>ra</Text>
      </Text>
    </View>
  );
}

const l = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  text: {
    fontFamily: 'DMSerifDisplay_400Regular',
    color: Colors.ink,
    includeFontPadding: false,
  },
  ra: { color: Colors.p },
});
