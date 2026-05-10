import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
  Animated, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';

// Pulsing dot animation (1.4s, fades to 30%)
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
  return <Animated.View style={[s.dot, { opacity }]} />;
}

const REQUEST_ID = '7c4f-a91b-3e02';
const TIMESTAMP  = '2025-03-11 14:24:18 UTC';

export default function Error500Screen() {
  const [retrying, setRetrying] = useState(false);

  function handleRetry() {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      router.replace('/(tabs)/home' as any);
    }, 1500);
  }

  if (Platform.OS === 'web') {
    return (
      <div style={{ margin: 0, background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 160, lineHeight: .9, color: '#7A2A1F', marginBottom: 6, letterSpacing: '-.02em' }}>500</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#C0392B', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <span style={{ width: 8, height: 8, background: '#C0392B', borderRadius: '50%', animation: 'p 1.4s infinite', display: 'inline-block' }} />
          Server error
          <style>{`@keyframes p{50%{opacity:.3}}`}</style>
        </div>
        <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 32, lineHeight: 1.1, margin: '0 0 12px', maxWidth: 520, color: T.ink }}>Something broke on our end.</h1>
        <p style={{ fontSize: 14, color: T.ink3, maxWidth: 440, margin: '0 0 26px', lineHeight: 1.55 }}>
          Our team has been notified automatically. Try again in a moment — your progress is safe.
        </p>
        <div style={{ background: '#fff', border: `1px solid ${T.border}`, borderRadius: 14, padding: '14px 18px', display: 'flex', gap: 14, alignItems: 'center', marginBottom: 26, textAlign: 'left', maxWidth: 400, width: '100%' }}>
          <span style={{ width: 8, height: 8, background: '#C0392B', borderRadius: '50%', flexShrink: 0, animation: 'p 1.4s infinite' }} />
          <div>
            <strong style={{ fontSize: 12.5, color: T.ink, display: 'block' }}>Investigating · started 2 min ago</strong>
            <span style={{ fontSize: 11, color: T.ink4 }}>Tutor service · partial outage</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          <button onClick={() => window.location.reload()} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: '11px 20px', border: 0, cursor: 'pointer', background: T.brand, color: '#fff' }}>↻ Retry</button>
          <button style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: '11px 20px', cursor: 'pointer', background: 'transparent', color: T.ink, border: `1.5px solid ${T.ink}` }}>View status page</button>
        </div>
        <div style={{ fontSize: 11, color: T.ink4, fontFamily: 'ui-monospace, monospace', background: T.bg2, padding: '8px 14px', borderRadius: 8 }}>
          request_id: {REQUEST_ID} · {TIMESTAMP}
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        <Text style={s.numDisplay}>500</Text>

        <View style={s.eyebrowRow}>
          <PulsingDot />
          <Text style={s.eyebrow}>Server error</Text>
        </View>

        <Text style={s.title}>Something broke on our end.</Text>
        <Text style={s.body}>
          Our team has been notified automatically. Try again in a moment — your progress is safe.
        </Text>

        {/* Status card */}
        <View style={s.statusCard}>
          <PulsingDot />
          <View style={{ flex: 1 }}>
            <Text style={s.statusBold}>Investigating · started 2 min ago</Text>
            <Text style={s.statusSub}>Tutor service · partial outage</Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={s.btnRow}>
          <TouchableOpacity style={s.primaryBtn} onPress={handleRetry} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>{retrying ? 'Retrying…' : '↻ Retry'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.outlineBtn} activeOpacity={0.7}>
            <Text style={s.outlineBtnText}>Status page</Text>
          </TouchableOpacity>
        </View>

        {/* Request ID */}
        <View style={s.metaBox}>
          <Text style={s.meta}>request_id: {REQUEST_ID} · {TIMESTAMP}</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: T.bg },
  container:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },

  numDisplay:    { fontFamily: T.serif, fontSize: 120, color: '#7A2A1F', lineHeight: 108, letterSpacing: -2, marginBottom: 8 },

  eyebrowRow:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  dot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C0392B' },
  eyebrow:       { fontSize: 11, fontWeight: '700', color: '#C0392B', textTransform: 'uppercase', letterSpacing: 1.2 },

  title:         { fontFamily: T.serif, fontSize: 28, color: T.ink, textAlign: 'center', marginBottom: 12, lineHeight: 34 },
  body:          { fontSize: 14, color: T.ink3, textAlign: 'center', lineHeight: 22, marginBottom: 22, maxWidth: 340 },

  statusCard:    { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 14, padding: 16, marginBottom: 24, width: '100%', maxWidth: 380 },
  statusBold:    { fontSize: 12.5, fontWeight: '700', color: T.ink, marginBottom: 2 },
  statusSub:     { fontSize: 11, color: T.ink4 },

  btnRow:        { flexDirection: 'row', gap: 10, marginBottom: 24 },
  primaryBtn:    { backgroundColor: T.brand, borderRadius: T.rPill, paddingVertical: 12, paddingHorizontal: 20 },
  primaryBtnText:{ fontSize: 13, fontWeight: '700', color: '#fff' },
  outlineBtn:    { borderRadius: T.rPill, paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1.5, borderColor: T.ink },
  outlineBtnText:{ fontSize: 13, fontWeight: '700', color: T.ink },

  metaBox:       { backgroundColor: T.bg2, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  meta:          { fontSize: 11, color: T.ink4, fontFamily: 'monospace' },
});
