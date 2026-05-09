import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';

const C = {
  brand:     '#C04A06',
  brandLight:'#FEF3EE',
  ink:       '#0A0A0A',
  ink3:      '#666',
  ink4:      '#999',
  bg:        '#F9F8F5',
  card:      '#FFFFFF',
  border:    '#E8E2D9',
};

export default function NotFoundScreen() {
  if (Platform.OS === 'web') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center', background: C.bg,
        padding: '40px 24px', textAlign: 'center', fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ fontFamily: 'DMSerifDisplay_400Regular, Georgia, serif', fontSize: 112, color: C.brand, lineHeight: 1, letterSpacing: '-0.04em', marginBottom: 8 }}>404</div>
        <div style={{ fontFamily: 'DMSerifDisplay_400Regular, Georgia, serif', fontSize: 26, color: C.ink, marginBottom: 10 }}>Page not found</div>
        <div style={{ fontSize: 14, color: C.ink3, maxWidth: 360, lineHeight: 1.6, marginBottom: 28 }}>
          The page you're looking for doesn't exist or has moved. Try heading back to your dashboard.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => window.history.back()}
            style={{ padding: '11px 20px', borderRadius: 10, background: 'transparent', border: `1.5px solid ${C.border}`, fontSize: 13, fontWeight: 600, color: C.ink3, cursor: 'pointer' }}
          >
            ← Go back
          </button>
          <button
            onClick={() => (window.location.href = '/')}
            style={{ padding: '11px 24px', borderRadius: 10, background: C.brand, border: 'none', fontSize: 13, fontWeight: 700, color: '#fff', cursor: 'pointer' }}
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Text style={s.code}>404</Text>
        <Text style={s.title}>Page not found</Text>
        <Text style={s.body}>
          The page you're looking for doesn't exist or has moved.
        </Text>
        <View style={s.btnRow}>
          <TouchableOpacity style={s.outlineBtn} onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={s.outlineBtnText}>← Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.replace('/(tabs)/home' as any)}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnText}>Back to dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: '#F9F8F5' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  code:      { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 96, color: '#C04A06', lineHeight: 104, letterSpacing: -2 },
  title:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26, color: '#0A0A0A', marginBottom: 10 },
  body:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 320 },
  btnRow:    { flexDirection: 'row', gap: 10 },
  outlineBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, borderWidth: 1.5, borderColor: '#E8E2D9' },
  outlineBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#666' },
  primaryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 10, backgroundColor: '#C04A06' },
  primaryBtnText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#fff' },
});
