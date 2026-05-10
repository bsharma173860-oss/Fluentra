import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { T } from '@/constants/theme';

function PulsingDot() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.3, duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(opacity, { toValue: 1,   duration: 700, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  }, [opacity]);
  return <Animated.View style={[ods.dot, { opacity }]} />;
}
const ods = StyleSheet.create({ dot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#C0392B' } });

// Wifi-slash SVG icon
function WifiSlashIcon({ size = 32, color = T.ink3 }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 12c5-5 15-5 20 0" />
      <Path d="M5 15c4-4 10-4 14 0" />
      <Path d="M8.5 18c2-2 5-2 7 0" />
      <Circle cx={12} cy={20.5} r={0.7} fill={color} />
    </Svg>
  );
}

const OFFLINE_ITEMS = [
  { ic: '📚', label: 'Saved vocab decks',  status: '✓ 142 cards', avail: true },
  { ic: '🎧', label: 'Downloaded audio',   status: '✓ 3 lessons',  avail: true },
  { ic: '📖', label: "Today's reading",    status: '✓ Cached',     avail: true },
  { ic: '🎓', label: 'AI tutor',           status: 'Online only',  avail: false },
] as const;

export default function OfflineScreen() {
  if (Platform.OS === 'web') {
    return (
      <div style={{ margin: 0, background: T.bg2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 440, width: '100%', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 20, padding: '36px 32px', textAlign: 'center' }}>
          {/* Wifi icon with slash */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: T.bg2, margin: '0 auto 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12c5-5 15-5 20 0"/><path d="M5 15c4-4 10-4 14 0"/><path d="M8.5 18c2-2 5-2 7 0"/><circle cx="12" cy="20.5" r=".7" fill={T.ink3}/>
            </svg>
            <div style={{ position: 'absolute', width: 46, height: 2.5, background: '#C0392B', borderRadius: 2, transform: 'rotate(-45deg)' }} />
          </div>

          {/* Eyebrow */}
          <div style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, background: '#C0392B', borderRadius: '50%', animation: 'p 1.4s infinite', display: 'inline-block' }} />
            You're offline
            <style>{`@keyframes p{50%{opacity:.3}}`}</style>
          </div>

          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 26, lineHeight: 1.1, margin: '0 0 8px', color: T.ink }}>No internet connection.</h1>
          <p style={{ fontSize: 13, color: T.ink3, lineHeight: 1.55, margin: '0 0 22px' }}>Check your Wi-Fi or cellular and we'll pick up where you left off — your streak is safe.</p>

          {/* Available offline */}
          <div style={{ background: T.bg, border: `1px solid ${T.hairline}`, borderRadius: 14, padding: '14px 16px', textAlign: 'left', marginBottom: 20 }}>
            <strong style={{ fontSize: 11, color: T.ink4, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700, display: 'block', marginBottom: 10 }}>Still available offline</strong>
            {OFFLINE_ITEMS.map((item, i) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: i === 0 ? 'none' : `1px solid ${T.hairline}`, fontSize: 13 }}>
                <span style={{ color: item.avail ? T.ink2 : T.ink5 }}>{item.ic} {item.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: item.avail ? '#1A8F4E' : T.ink5 }}>{item.status}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button onClick={() => window.location.reload()} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: 12, border: 0, cursor: 'pointer', background: T.brand, color: '#fff' }}>↻ Try again</button>
            <button style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: 12, border: 0, cursor: 'pointer', background: 'transparent', color: T.ink3 }}>Open offline library →</button>
          </div>

          <div style={{ fontSize: 11, color: T.ink4, marginTop: 14 }}>● Last synced 2 min ago</div>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        {/* Wifi icon with red slash */}
        <View style={s.iconWrap}>
          <WifiSlashIcon size={32} color={T.ink3} />
          <View style={s.slash} />
        </View>

        {/* Pulsing eyebrow */}
        <View style={s.eyebrowRow}>
          <PulsingDot />
          <Text style={s.eyebrow}>You're offline</Text>
        </View>

        <Text style={s.title}>No internet connection.</Text>
        <Text style={s.body}>
          Check your Wi-Fi or cellular and we'll pick up where you left off — your streak is safe.
        </Text>

        {/* Available items */}
        <View style={s.availBox}>
          <Text style={s.availTitle}>Still available offline</Text>
          {OFFLINE_ITEMS.map((item, i) => (
            <View key={item.label} style={[s.availRow, i > 0 && s.availBorder]}>
              <Text style={[s.availLabel, !item.avail && s.availLabelMuted]}>{item.ic}  {item.label}</Text>
              <Text style={[s.availStatus, !item.avail && s.availStatusMuted]}>{item.status}</Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={s.btns}>
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.replace('/(tabs)/home' as any)} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>↻ Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/library' as any)} activeOpacity={0.7}>
            <Text style={s.ghostText}>Open offline library →</Text>
          </TouchableOpacity>
        </View>

        <Text style={s.meta}>● Last synced 2 min ago</Text>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: T.bg2 },
  container:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28 },

  iconWrap:        { width: 72, height: 72, borderRadius: 36, backgroundColor: T.bg2, alignItems: 'center', justifyContent: 'center', marginBottom: 18, position: 'relative' },
  slash:           { position: 'absolute', width: 46, height: 2.5, backgroundColor: '#C0392B', borderRadius: 2, transform: [{ rotate: '-45deg' }] },

  eyebrowRow:      { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  eyebrow:         { fontSize: 11, fontWeight: '700', color: '#C0392B', textTransform: 'uppercase', letterSpacing: 1.2 },

  title:           { fontFamily: T.serif, fontSize: 24, color: T.ink, textAlign: 'center', marginBottom: 8, lineHeight: 30 },
  body:            { fontSize: 13, color: T.ink3, textAlign: 'center', lineHeight: 20, marginBottom: 22, maxWidth: 320 },

  availBox:        { width: '100%', backgroundColor: T.bg, borderRadius: 14, borderWidth: 1, borderColor: T.hairline, padding: 16, marginBottom: 20 },
  availTitle:      { fontSize: 11, fontWeight: '700', color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 },
  availRow:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  availBorder:     { borderTopWidth: 1, borderTopColor: T.hairline },
  availLabel:      { fontSize: 13, color: T.ink2 },
  availLabelMuted: { color: T.ink5 },
  availStatus:     { fontSize: 11, fontWeight: '700', color: '#1A8F4E' },
  availStatusMuted:{ color: T.ink5 },

  btns:            { width: '100%', gap: 8, marginBottom: 16 },
  primaryBtn:      { backgroundColor: T.brand, borderRadius: T.rPill, paddingVertical: 13, alignItems: 'center' },
  primaryBtnText:  { fontSize: 13, fontWeight: '700', color: '#fff' },
  ghostText:       { fontSize: 13, fontWeight: '700', color: T.ink3, textAlign: 'center', paddingVertical: 8 },

  meta:            { fontSize: 11, color: T.ink4 },
});
