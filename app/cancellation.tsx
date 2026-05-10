import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';

const LOSSES = [
  '23-day Spanish streak',
  '1,284 saved vocab words',
  '9 hours of tutor history',
  'Your B1+ speaking record',
];

const REASONS = [
  'Too expensive',
  'Not using it enough',
  'Found a better app',
  'Reached my goal',
  'Other',
];

// Progress dots — step 1 done, step 2 active, step 3 pending
function ProgressDots({ step }: { step: number }) {
  return (
    <View style={pd.row}>
      {[1, 2, 3].map(i => (
        <View key={i} style={[pd.dot, i < step && pd.done, i === step && pd.active]} />
      ))}
    </View>
  );
}
const pd = StyleSheet.create({
  row:    { flexDirection: 'row', gap: 6, marginBottom: 24 },
  dot:    { flex: 1, height: 3, borderRadius: 2, backgroundColor: T.bg2 },
  done:   { backgroundColor: T.ink5 },
  active: { backgroundColor: T.brand },
});

export default function CancellationScreen() {
  const [selected, setSelected] = useState('Not using it enough');

  if (Platform.OS === 'web') {
    return (
      <div style={{ margin: 0, background: T.bg2, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ maxWidth: 560, width: '100%', background: '#fff', border: `1px solid ${T.border}`, borderRadius: 20, padding: '38px 40px' }}>
          {/* Progress */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
            {[1, 2, 3].map(i => (
              <span key={i} style={{ flex: 1, height: 3, background: i < 2 ? T.ink5 : i === 2 ? T.brand : T.bg2, borderRadius: 2 }} />
            ))}
          </div>

          <h1 style={{ fontFamily: 'DM Serif Display, Georgia, serif', fontSize: 30, lineHeight: 1.05, margin: '0 0 8px', color: T.ink }}>Sorry to see you go, María.</h1>
          <p style={{ fontSize: 13, color: T.ink3, lineHeight: 1.55, marginBottom: 24 }}>Before you cancel — a quick question, and one offer if it helps.</p>

          {/* What you'd lose */}
          <div style={{ background: T.brandSoft, border: `1px solid ${T.brandLight}`, borderRadius: 14, padding: 18, marginBottom: 18 }}>
            <strong style={{ fontSize: 12, color: T.brand, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700, display: 'block', marginBottom: 10 }}>You'd lose</strong>
            {LOSSES.map(l => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.ink2, marginBottom: 8 }}>
                <span style={{ color: '#C0392B', fontWeight: 700, fontSize: 16 }}>×</span>{l}
              </div>
            ))}
          </div>

          {/* Reason picker */}
          <div style={{ fontSize: 11, fontWeight: 700, color: T.ink4, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>What's the main reason?</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
            {REASONS.map(r => {
              const sel = r === selected;
              return (
                <label key={r} onClick={() => setSelected(r)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', border: `1px solid ${sel ? T.brand : T.border}`, borderRadius: 11, fontSize: 13, color: sel ? T.ink : T.ink2, background: sel ? T.brandSoft : '#fff', cursor: 'pointer' }}>
                  <span style={{ width: 16, height: 16, border: `1.5px solid ${sel ? T.brand : T.ink5}`, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {sel && <span style={{ width: 8, height: 8, background: T.brand, borderRadius: '50%' }} />}
                  </span>
                  {r}
                </label>
              );
            })}
          </div>

          {/* Pause offer */}
          <div style={{ background: 'linear-gradient(135deg,#FFEAC2,#FFF7E8)', border: '1px solid #F4E3BC', borderRadius: 14, padding: 18, marginBottom: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: 30 }}>⏸️</span>
            <div>
              <strong style={{ fontSize: 14, color: T.ink, display: 'block', marginBottom: 3 }}>Pause for 2 months instead?</strong>
              <p style={{ fontSize: 12, color: T.ink3, lineHeight: 1.45, margin: 0 }}>Keep your streak frozen and your vocab. We'll skip your next 2 charges — no commitment to come back.</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between', alignItems: 'center' }}>
            <button style={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 700, borderRadius: 99, padding: '11px 22px', border: 0, cursor: 'pointer', background: T.brand, color: '#fff' }}>Pause for 2 months</button>
            <button style={{ fontFamily: 'inherit', fontSize: 12, fontWeight: 600, background: 'transparent', border: 0, cursor: 'pointer', color: '#C0392B', textDecoration: 'underline', textUnderlineOffset: 3 }}>Cancel anyway →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>

        <ProgressDots step={2} />

        <Text style={s.title}>Sorry to see you go, María.</Text>
        <Text style={s.lede}>Before you cancel — a quick question, and one offer if it helps.</Text>

        {/* What you'd lose */}
        <View style={s.loseBox}>
          <Text style={s.loseTitle}>You'd lose</Text>
          {LOSSES.map(l => (
            <View key={l} style={s.loseRow}>
              <Text style={s.loseCross}>×</Text>
              <Text style={s.loseText}>{l}</Text>
            </View>
          ))}
        </View>

        {/* Reason picker */}
        <Text style={s.reasonsLabel}>What's the main reason?</Text>
        <View style={s.reasonsList}>
          {REASONS.map(r => {
            const sel = r === selected;
            return (
              <TouchableOpacity key={r} style={[s.reasonRow, sel && s.reasonRowSel]} onPress={() => setSelected(r)} activeOpacity={0.7}>
                <View style={[s.radio, sel && s.radioSel]}>
                  {sel && <View style={s.radioDot} />}
                </View>
                <Text style={[s.reasonText, sel && s.reasonTextSel]}>{r}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Pause offer */}
        <View style={s.pauseBox}>
          <Text style={s.pauseIc}>⏸️</Text>
          <View style={{ flex: 1 }}>
            <Text style={s.pauseTitle}>Pause for 2 months instead?</Text>
            <Text style={s.pauseSub}>Keep your streak frozen and your vocab. We'll skip your next 2 charges — no commitment to come back.</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={s.actions}>
          <TouchableOpacity style={s.stayBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={s.stayBtnText}>Pause for 2 months</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.replace('/(tabs)/home' as any)} activeOpacity={0.7}>
            <Text style={s.cancelText}>Cancel anyway →</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: T.bg2 },
  scroll:        { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 20 },

  title:         { fontFamily: T.serif, fontSize: 28, lineHeight: 33, color: T.ink, marginBottom: 8 },
  lede:          { fontSize: 13, color: T.ink3, lineHeight: 20, marginBottom: 22 },

  loseBox:       { backgroundColor: T.brandSoft, borderWidth: 1, borderColor: T.brandLight, borderRadius: 14, padding: 18, marginBottom: 18, gap: 8 },
  loseTitle:     { fontSize: 12, fontWeight: '700', color: T.brand, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 4 },
  loseRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  loseCross:     { fontSize: 16, fontWeight: '700', color: '#C0392B', width: 18 },
  loseText:      { fontSize: 13, color: T.ink2, flex: 1 },

  reasonsLabel:  { fontSize: 11, fontWeight: '700', color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: 10 },
  reasonsList:   { gap: 8, marginBottom: 22 },
  reasonRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: T.border, borderRadius: 11, backgroundColor: T.card },
  reasonRowSel:  { borderColor: T.brand, backgroundColor: T.brandSoft },
  radio:         { width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: T.ink5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  radioSel:      { borderColor: T.brand },
  radioDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: T.brand },
  reasonText:    { fontSize: 13, color: T.ink2 },
  reasonTextSel: { color: T.ink, fontWeight: '600' },

  pauseBox:      { flexDirection: 'row', gap: 14, alignItems: 'flex-start', backgroundColor: '#FFF7E8', borderWidth: 1, borderColor: '#F4E3BC', borderRadius: 14, padding: 18, marginBottom: 22 },
  pauseIc:       { fontSize: 28 },
  pauseTitle:    { fontSize: 14, fontWeight: '700', color: T.ink, marginBottom: 4 },
  pauseSub:      { fontSize: 12, color: T.ink3, lineHeight: 18 },

  actions:       { gap: 12 },
  stayBtn:       { backgroundColor: T.brand, borderRadius: T.rPill, paddingVertical: 13, alignItems: 'center' },
  stayBtnText:   { fontSize: 13, fontWeight: '700', color: '#fff' },
  cancelText:    { fontSize: 13, fontWeight: '600', color: '#C0392B', textDecorationLine: 'underline', textAlign: 'center', paddingVertical: 8 },
});
