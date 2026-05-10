import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, usePathname } from 'expo-router';
import { T } from '@/constants/theme';

const QUICK_LINKS = [
  { label: "Today's lesson",    route: '/(tabs)/home'     },
  { label: 'Speaking practice', route: '/modules/speaking/select' },
  { label: 'My vocab',          route: '/language'         },
  { label: 'Tutor',             route: '/language'         },
  { label: 'Help center',       route: '/help'             },
] as const;

export default function NotFoundScreen() {
  const pathname = usePathname();

  if (Platform.OS === 'web') {
    return (
      <div style={{ margin: 0, background: T.bg, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 160, lineHeight: .9, letterSpacing: '-.02em', marginBottom: 6 }}>
          <span style={{ color: T.brand }}>4</span>
          <span style={{ color: T.ink5, fontStyle: 'italic' }}>0</span>
          <span style={{ color: T.brand }}>4</span>
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: T.ink4, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 14 }}>Page not found</div>
        <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 32, lineHeight: 1.1, margin: '0 0 12px', maxWidth: 480, color: T.ink }}>Lost in translation.</h1>
        <p style={{ fontSize: 14, color: T.ink3, maxWidth: 420, margin: '0 0 26px', lineHeight: 1.55 }}>
          We couldn't find that page. It may have been moved, renamed, or it never existed in the first place.
        </p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 36 }}>
          <button onClick={() => window.location.href = '/'} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: '11px 20px', border: 0, cursor: 'pointer', background: T.brand, color: '#fff' }}>← Back to dashboard</button>
          <button onClick={() => window.location.href = '/search'} style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: '11px 20px', cursor: 'pointer', background: 'transparent', color: T.ink, border: `1.5px solid ${T.ink}` }}>Search the catalog</button>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 520, marginBottom: 30 }}>
          {QUICK_LINKS.map(l => (
            <a key={l.label} href={l.route} style={{ fontSize: 11, fontWeight: 600, background: '#fff', border: `1px solid ${T.border}`, padding: '6px 14px', borderRadius: 99, color: T.ink2, textDecoration: 'none' }}>{l.label}</a>
          ))}
        </div>
        <div style={{ fontSize: 11, color: T.ink4, fontFamily: 'ui-monospace, monospace' }}>{pathname}</div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        {/* Big 404 */}
        <View style={s.numRow}>
          <Text style={[s.numDigit, { color: T.brand }]}>4</Text>
          <Text style={[s.numDigit, { color: T.ink5 }]}>0</Text>
          <Text style={[s.numDigit, { color: T.brand }]}>4</Text>
        </View>

        <Text style={s.eyebrow}>Page not found</Text>
        <Text style={s.title}>Lost in translation.</Text>
        <Text style={s.body}>
          We couldn't find that page. It may have been moved, renamed, or it never existed in the first place.
        </Text>

        {/* Buttons */}
        <View style={s.btnRow}>
          <TouchableOpacity style={s.primaryBtn} onPress={() => router.replace('/(tabs)/home' as any)} activeOpacity={0.85}>
            <Text style={s.primaryBtnText}>← Back to dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.outlineBtn} onPress={() => router.push('/search' as any)} activeOpacity={0.7}>
            <Text style={s.outlineBtnText}>Search</Text>
          </TouchableOpacity>
        </View>

        {/* Quick links */}
        <View style={s.linksRow}>
          {QUICK_LINKS.map(l => (
            <TouchableOpacity key={l.label} style={s.linkChip} onPress={() => router.push(l.route as any)} activeOpacity={0.7}>
              <Text style={s.linkChipText}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Path */}
        <Text style={s.meta}>{pathname}</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: T.bg },
  scroll:        { alignItems: 'center', paddingHorizontal: 32, paddingTop: 60, paddingBottom: 20 },

  numRow:        { flexDirection: 'row', marginBottom: 12 },
  numDigit:      { fontFamily: T.serif, fontSize: 120, lineHeight: 108, letterSpacing: -2 },

  eyebrow:       { fontSize: 11, fontWeight: '700', color: T.ink4, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 },
  title:         { fontFamily: T.serif, fontSize: 30, color: T.ink, textAlign: 'center', marginBottom: 12 },
  body:          { fontSize: 14, color: T.ink3, textAlign: 'center', lineHeight: 22, marginBottom: 28, maxWidth: 340 },

  btnRow:        { flexDirection: 'row', gap: 10, marginBottom: 28 },
  primaryBtn:    { backgroundColor: T.brand, borderRadius: T.rPill, paddingVertical: 12, paddingHorizontal: 20 },
  primaryBtnText:{ fontSize: 13, fontWeight: '700', color: '#fff' },
  outlineBtn:    { borderRadius: T.rPill, paddingVertical: 12, paddingHorizontal: 20, borderWidth: 1.5, borderColor: T.ink },
  outlineBtnText:{ fontSize: 13, fontWeight: '700', color: T.ink },

  linksRow:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 360, marginBottom: 28 },
  linkChip:      { backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: T.rPill, paddingHorizontal: 14, paddingVertical: 7 },
  linkChipText:  { fontSize: 11, fontWeight: '600', color: T.ink2 },

  meta:          { fontSize: 11, color: T.ink4, fontFamily: 'monospace' },
});
