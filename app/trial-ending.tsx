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
};

// day = '5' | '6' | '7'
export default function TrialEndingScreen() {
  const { day = '5' } = useLocalSearchParams<any>();
  const dayNum = parseInt(day as string, 10) || 5;
  const daysLeft = 7 - dayNum;

  const headlines: Record<number, { title: string; sub: string }> = {
    5: {
      title: 'Your free trial ends in 2 days.',
      sub: "You've built a 5-day streak and practiced for over 3 hours. Don't let that momentum disappear.",
    },
    6: {
      title: 'Just 24 hours left on your trial.',
      sub: "Tomorrow your Pro features switch off. Keep your streak, your progress, and your AI tutor — upgrade now.",
    },
    7: {
      title: 'Your trial ends today.',
      sub: "This is your last day with full Pro access. Upgrade now and nothing changes — your streak, your lessons, everything stays.",
    },
  };

  const { title, sub } = headlines[dayNum] || headlines[5];

  const FEATURES = [
    { ic: '✍', t: 'AI Writing feedback', s: 'Band-level scoring on every essay.' },
    { ic: '🎤', t: 'Speaking with mic', s: 'Live pronunciation & fluency scoring.' },
    { ic: '📝', t: 'Practice exams', s: 'Full mock tests, timed and scored.' },
    { ic: '🌐', t: 'All 80+ languages', s: 'Switch languages anytime.' },
  ];

  if (Platform.OS === 'web') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, fontFamily: 'Inter, sans-serif', padding: '40px 24px' }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          {/* Countdown badge */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 18px', background: dayNum === 7 ? C.brand : C.brandLight, borderRadius: 99, fontSize: 13, fontWeight: 700, color: dayNum === 7 ? '#fff' : C.brand }}>
              {dayNum === 7 ? '⚠' : '⏱'} Day {dayNum} of 7 · {daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} left` : 'Trial ends today'}
            </div>
          </div>

          {/* Streak bar */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 20px', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ fontSize: 32 }}>🔥</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, marginBottom: 4 }}>{dayNum}-day streak</div>
              <div style={{ height: 6, background: C.bg2, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(dayNum / 9) * 100}%`, background: C.brand, borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: C.ink4, marginTop: 4 }}>{dayNum} of 9 days to unlock your first exam</div>
            </div>
          </div>

          <div style={{ fontFamily: 'DMSerifDisplay_400Regular, Georgia, serif', fontSize: 32, color: C.ink, lineHeight: 1.12, marginBottom: 10 }}>{title}</div>
          <div style={{ fontSize: 14, color: C.ink3, lineHeight: 1.6, marginBottom: 24 }}>{sub}</div>

          {/* Features losing */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '16px 20px', marginBottom: 22 }}>
            <div style={{ fontSize: 10.5, color: C.ink4, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>What you'll lose</div>
            {FEATURES.map(f => (
              <div key={f.t} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: C.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>{f.ic}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{f.t}</div>
                  <div style={{ fontSize: 12, color: C.ink4 }}>{f.s}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
            <button
              onClick={() => (window.location.href = '/upgrade')}
              style={{ flex: 1, padding: '14px', borderRadius: 11, background: C.brand, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', border: 'none' }}
            >
              Upgrade to Pro — $19/mo
            </button>
          </div>
          <div style={{ textAlign: 'center', fontSize: 12, color: C.ink4, marginBottom: 18 }}>Annual billing. Cancel any time. $228/yr.</div>

          <button
            onClick={() => window.history.back()}
            style={{ width: '100%', padding: '11px', background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 11, fontSize: 13, color: C.ink3, cursor: 'pointer', fontWeight: 600 }}
          >
            Continue with Free
          </button>
        </div>
      </div>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      {/* Countdown badge */}
      <View style={s.topCenter}>
        <View style={[s.countdownBadge, dayNum === 7 && s.countdownBadgeUrgent]}>
          <Text style={[s.countdownText, dayNum === 7 && s.countdownTextUrgent]}>
            {dayNum === 7 ? '⚠ ' : '⏱ '}Day {dayNum} of 7 · {daysLeft > 0 ? `${daysLeft} day${daysLeft > 1 ? 's' : ''} left` : 'Ends today'}
          </Text>
        </View>
      </View>

      <View style={s.container}>
        {/* Streak */}
        <View style={s.streakCard}>
          <Text style={s.streakEmoji}>🔥</Text>
          <View style={s.streakBody}>
            <Text style={s.streakTitle}>{dayNum}-day streak</Text>
            <View style={s.streakBarBg}>
              <View style={[s.streakBarFill, { width: `${(dayNum / 9) * 100}%` as any }]} />
            </View>
            <Text style={s.streakNote}>{dayNum} of 9 days to unlock your first exam</Text>
          </View>
        </View>

        <Text style={s.title}>{title}</Text>
        <Text style={s.sub}>{sub}</Text>

        {/* Features */}
        <View style={s.featuresCard}>
          <Text style={s.featuresLabel}>WHAT YOU'LL LOSE</Text>
          {FEATURES.map(f => (
            <View key={f.t} style={s.featureRow}>
              <View style={s.featureIcon}><Text style={s.featureIconText}>{f.ic}</Text></View>
              <View style={s.featureBody}>
                <Text style={s.featureName}>{f.t}</Text>
                <Text style={s.featureDesc}>{f.s}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={s.primaryBtn}
          onPress={() => router.push('/upgrade' as any)}
          activeOpacity={0.85}
        >
          <Text style={s.primaryBtnText}>Upgrade to Pro — $19/mo</Text>
        </TouchableOpacity>
        <Text style={s.billingNote}>Annual billing. Cancel any time. $228/yr.</Text>
        <TouchableOpacity
          style={s.secondaryBtn}
          onPress={() => router.replace('/(tabs)/home' as any)}
          activeOpacity={0.7}
        >
          <Text style={s.secondaryBtnText}>Continue with Free</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F9F8F5' },
  topCenter: { alignItems: 'center', paddingTop: 16 },
  countdownBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#FEF3EE', borderRadius: 99 },
  countdownBadgeUrgent: { backgroundColor: '#C04A06' },
  countdownText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#C04A06' },
  countdownTextUrgent: { color: '#fff' },

  container: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, gap: 0 },

  streakCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E8E2D9', padding: 16, marginBottom: 24 },
  streakEmoji: { fontSize: 30 },
  streakBody: { flex: 1 },
  streakTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#0A0A0A', marginBottom: 6 },
  streakBarBg: { height: 6, backgroundColor: '#F4F1EB', borderRadius: 3, overflow: 'hidden', marginBottom: 4 },
  streakBarFill: { height: '100%', backgroundColor: '#C04A06', borderRadius: 3 },
  streakNote: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },

  title: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: '#0A0A0A', lineHeight: 36, marginBottom: 8 },
  sub:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 20 },

  featuresCard: { backgroundColor: '#FFFFFF', borderRadius: 14, borderWidth: 1, borderColor: '#E8E2D9', padding: 18, marginBottom: 24, gap: 12 },
  featuresLabel: { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: '#999', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  featureIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F4F1EB', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureIconText: { fontSize: 15 },
  featureBody: { flex: 1 },
  featureName: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#0A0A0A', marginBottom: 2 },
  featureDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },

  primaryBtn: { backgroundColor: '#C04A06', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  primaryBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
  billingNote: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: '#999', textAlign: 'center', marginBottom: 12 },
  secondaryBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: '#E8E2D9', backgroundColor: '#FFFFFF' },
  secondaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#666' },
});
