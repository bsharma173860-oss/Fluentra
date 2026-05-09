import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const C = {
  brand:     '#C04A06',
  brandLight:'#FEF3EE',
  ink:       '#0A0A0A',
  ink2:      '#333',
  ink3:      '#666',
  ink4:      '#999',
  bg:        '#F9F8F5',
  bg2:       '#F4F1EB',
  card:      '#FFFFFF',
  border:    '#E8E2D9',
  hairline:  '#EDE8E0',
  green:     '#1A8F4E',
  greenBg:   '#EDFAF4',
};

export default function PaymentSuccessScreen() {
  const { plan = 'Pro', amount = '24.00', email = '' } = useLocalSearchParams<any>();
  const { width } = useWindowDimensions();

  const nextBillingDate = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  })();

  if (Platform.OS === 'web') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: C.bg, fontFamily: 'Inter, sans-serif', padding: '40px 24px',
      }}>
        <div style={{ background: C.card, borderRadius: 24, border: `1px solid ${C.border}`, padding: '44px 40px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          {/* Check icon */}
          <div style={{ width: 72, height: 72, borderRadius: 36, background: C.greenBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', fontSize: 32 }}>
            ✓
          </div>

          <div style={{ fontFamily: 'DMSerifDisplay_400Regular, Georgia, serif', fontSize: 28, color: C.ink, lineHeight: 1.15, marginBottom: 6 }}>
            Welcome to Fluentra {plan}
          </div>
          <div style={{ fontFamily: 'DMSerifDisplay_400Regular, Georgia, serif', fontStyle: 'italic', fontSize: 13, color: C.brand, marginBottom: 10, letterSpacing: '.02em' }}>
            Speak it. Score it. Own it.
          </div>
          {email ? (
            <div style={{ fontSize: 13, color: C.ink4, lineHeight: 1.6, marginBottom: 22, maxWidth: 340, margin: '0 auto 22px' }}>
              Your card was charged ${amount}. A receipt is on the way to <strong style={{ color: C.ink }}>{email}</strong>.
            </div>
          ) : (
            <div style={{ fontSize: 13, color: C.ink4, marginBottom: 22 }}>Your card was charged ${amount}.</div>
          )}

          {/* Billing info */}
          <div style={{ background: C.bg2, borderRadius: 12, padding: '14px 18px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: C.ink3 }}>Next billing date</span>
            <span style={{ color: C.ink, fontWeight: 600 }}>{nextBillingDate}</span>
          </div>

          {/* Features unlocked */}
          <div style={{ background: C.greenBg, borderRadius: 12, padding: '14px 18px', marginBottom: 28, textAlign: 'left' }}>
            <div style={{ fontSize: 10.5, color: C.green, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Now unlocked</div>
            {[
              'Unlimited AI Writing feedback',
              'Speaking practice with mic scoring',
              'Unlimited practice exams',
              'All 80+ languages',
            ].map(f => (
              <div key={f} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 7, fontSize: 13, color: C.ink2 }}>
                <span style={{ color: C.green, fontWeight: 700 }}>✓</span> {f}
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.href = '/'}
            style={{ width: '100%', padding: '14px', borderRadius: 11, background: C.brand, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none', marginBottom: 10 }}
          >
            Start practising →
          </button>
          <button
            onClick={() => window.history.back()}
            style={{ fontSize: 12, color: C.ink4, background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Back to subscription settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        {/* Check circle */}
        <View style={s.checkCircle}>
          <Text style={s.checkMark}>✓</Text>
        </View>

        <Text style={s.title}>Welcome to{'\n'}Fluentra {plan}</Text>
        <Text style={s.tagline}>Speak it. Score it. Own it.</Text>
        {email ? (
          <Text style={s.chargedText}>
            Your card was charged ${amount}.{'\n'}A receipt is on the way to {email}.
          </Text>
        ) : (
          <Text style={s.chargedText}>Your card was charged ${amount}.</Text>
        )}

        {/* Next billing */}
        <View style={s.billingCard}>
          <Text style={s.billingLabel}>Next billing date</Text>
          <Text style={s.billingValue}>{nextBillingDate}</Text>
        </View>

        {/* Features unlocked */}
        <View style={s.featuresCard}>
          <Text style={s.featuresLabel}>NOW UNLOCKED</Text>
          {[
            'Unlimited AI Writing feedback',
            'Speaking practice with mic scoring',
            'Unlimited practice exams',
            'All 80+ languages',
          ].map(f => (
            <View key={f} style={s.featureRow}>
              <Text style={s.featureCheck}>✓</Text>
              <Text style={s.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.replace('/(tabs)/home' as any)}
          activeOpacity={0.85}
        >
          <Text style={s.primaryBtnText}>Start practising →</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={s.linkText}>Back to subscription settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9F8F5' },
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, gap: 0 },

  checkCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#EDFAF4', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  checkMark: { fontSize: 30, color: '#1A8F4E', fontWeight: '700' },

  title:   { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: '#0A0A0A', textAlign: 'center', lineHeight: 36, marginBottom: 6 },
  tagline: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 13, color: '#C04A06', fontStyle: 'italic', marginBottom: 12, letterSpacing: 0.4 },
  chargedText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 20, marginBottom: 20 },

  billingCard: { width: '100%', backgroundColor: '#F4F1EB', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  billingLabel: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#666' },
  billingValue: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#0A0A0A' },

  featuresCard: { width: '100%', backgroundColor: '#EDFAF4', borderRadius: 12, padding: 18, marginBottom: 24 },
  featuresLabel: { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: '#1A8F4E', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  featureCheck: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#1A8F4E' },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#333', flex: 1 },

  primaryBtn: { width: '100%', backgroundColor: '#C04A06', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 14 },
  primaryBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
  linkText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },
});
