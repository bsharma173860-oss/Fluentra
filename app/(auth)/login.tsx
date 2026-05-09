import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
  Alert, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import Svg, { Path, Rect } from 'react-native-svg';

// ── Google icon ───────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <Path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <Path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <Path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </Svg>
  );
}

function AppleIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={T.ink}>
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.53 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
  );
}

export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleEmailLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (error) Alert.alert('Sign in failed', error.message);
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) Alert.alert('Google sign-in failed', error.message);
  }

  const form = (
    <View style={s.formWrap}>
      {/* Logo */}
      <View style={s.logoWrap}>
        <View style={s.logoBadge}>
          <Text style={s.logoBadgeText}>F</Text>
        </View>
        <Text style={s.logoText}>
          Fluent<Text style={{ color: T.brand }}>ra</Text>
        </Text>
      </View>

      {/* Heading */}
      <View style={s.headingWrap}>
        <Text style={s.heading}>Welcome back</Text>
        <Text style={s.subheading}>Sign in to continue learning</Text>
        <Text style={s.tagline}>Speak it. Score it. Own it.</Text>
      </View>

      {/* Social buttons */}
      <TouchableOpacity style={s.socialBtn} onPress={handleGoogleLogin} activeOpacity={0.8}>
        <GoogleIcon />
        <Text style={s.socialBtnText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* OR divider */}
      <View style={s.divider}>
        <View style={s.dividerLine} />
        <Text style={s.dividerText}>or</Text>
        <View style={s.dividerLine} />
      </View>

      {/* Email */}
      <View style={s.fieldWrap}>
        <Text style={s.fieldLabel}>Email</Text>
        <TextInput
          style={s.input}
          placeholder="you@example.com"
          placeholderTextColor={T.ink4}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* Password */}
      <View style={s.fieldWrap}>
        <View style={s.fieldRow}>
          <Text style={s.fieldLabel}>Password</Text>
          <TouchableOpacity onPress={() => setShowPw(p => !p)}>
            <Text style={s.fieldHint}>{showPw ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={s.input}
          placeholder="••••••••"
          placeholderTextColor={T.ink4}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
        />
      </View>

      {/* Sign in button */}
      <TouchableOpacity style={s.primaryBtn} onPress={handleEmailLogin} activeOpacity={0.85}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.primaryBtnText}>Sign in</Text>
        )}
      </TouchableOpacity>

      {/* Sign up link */}
      <View style={s.footer}>
        <Text style={s.footerText}>No account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={s.footerLink}>Sign up free</Text>
        </TouchableOpacity>
      </View>

      <Text style={s.legal}>
        By continuing you agree to Fluentra's Terms and Privacy Policy.
      </Text>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={s.desktopWrap}>
        {/* Left brand panel */}
        <View style={s.brandPanel}>
          <Text style={s.brandLogo}>Fluentra</Text>
          <Text style={s.brandHero}>Language fluency,{'\n'}on your terms.</Text>
          <Text style={s.brandSub}>
            AI-powered exam prep and multilingual practice — learn smarter, streak longer, score higher.
          </Text>
          {['143,000+ learners worldwide', '7.4 avg band score improvement', 'Top-ranked exam prep'].map(s2 => (
            <View key={s2} style={s.brandBullet}>
              <View style={s.bulletDot} />
              <Text style={s.bulletText}>{s2}</Text>
            </View>
          ))}
        </View>

        {/* Right form panel */}
        <View style={s.desktopFormPanel}>
          <View style={s.desktopFormCard}>
            {form}
          </View>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {form}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scrollContent: { flexGrow: 1, padding: 24, paddingBottom: 48 },

  // Desktop layout
  desktopWrap: { flex: 1, flexDirection: 'row', backgroundColor: T.bg2 },
  brandPanel: {
    flex: 1,
    backgroundColor: T.ink,
    padding: 64,
    justifyContent: 'center',
  },
  brandLogo: {
    fontFamily: T.serif,
    fontSize: 24,
    color: '#fff',
    marginBottom: 48,
  },
  brandHero: {
    fontFamily: T.serif,
    fontSize: 48,
    color: '#fff',
    lineHeight: 56,
    marginBottom: 20,
  },
  brandSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 380,
  },
  brandBullet: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  bulletDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: T.brand },
  bulletText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_500Medium' },
  desktopFormPanel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: T.bg,
  },
  desktopFormCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: T.card,
    borderRadius: 20,
    padding: 36,
    borderWidth: 1,
    borderColor: T.border,
  },

  // Form content
  formWrap: { gap: 16 },

  // Logo
  logoWrap: { alignItems: 'center', gap: 12, marginBottom: 8 },
  logoBadge: {
    width: 48, height: 48, borderRadius: 13,
    backgroundColor: T.brand,
    alignItems: 'center', justifyContent: 'center',
  },
  logoBadgeText: { color: '#fff', fontSize: 22, fontFamily: T.serif },
  logoText: { fontFamily: T.serif, fontSize: 28, color: T.ink },

  // Heading
  headingWrap: { alignItems: 'center', gap: 4 },
  heading: { fontSize: 22, fontWeight: '700', color: T.ink },
  subheading: { fontSize: 13.5, color: T.ink3 },
  tagline: { fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brand, marginTop: 4 },

  // Social button
  socialBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, padding: 13,
    backgroundColor: T.card,
    borderWidth: 1, borderColor: T.border,
    borderRadius: 12,
  },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: T.ink },

  // OR divider
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.border },
  dividerText: { fontSize: 12, color: T.ink4, fontWeight: '600' },

  // Fields
  fieldWrap: { gap: 6 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: T.ink2 },
  fieldHint: { fontSize: 11.5, color: T.brand, fontWeight: '700' },
  input: {
    padding: 12,
    paddingHorizontal: 14,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: T.border,
    fontSize: 14,
    color: T.ink,
    backgroundColor: T.card,
    fontFamily: 'Inter_400Regular',
  },

  // Primary button
  primaryBtn: {
    backgroundColor: T.brand,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 14.5, fontWeight: '700' },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 13, color: T.ink3 },
  footerLink: { fontSize: 13, color: T.brand, fontWeight: '700' },

  legal: { fontSize: 11, color: T.ink5, textAlign: 'center', lineHeight: 16 },
});
