import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

// ── SVG icon: gradient square with 3 wave lines ───────────────────
export function FluentraIcon({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C04A06" />
          <Stop offset="1" stopColor="#E8732F" />
        </LinearGradient>
      </Defs>
      <Rect width="32" height="32" rx="9" fill="url(#logoGrad)" />
      <Path
        d="M8 10 Q16 7 24 10"
        stroke="white" strokeWidth="2.2" fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M8 16 Q16 13 24 16"
        stroke="white" strokeWidth="2.2" fill="none"
        strokeLinecap="round" opacity={0.7}
      />
      <Path
        d="M8 22 Q16 19 24 22"
        stroke="white" strokeWidth="2.2" fill="none"
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

export function FluentraLogo({ iconSize = 32, textSize = 22, showIcon = true }: LogoProps) {
  return (
    <View style={[l.row, { gap: Math.round(iconSize * 0.3) }]}>
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
    color: '#000000',
    includeFontPadding: false,
  },
  ra: { color: '#C04A06' },
});
