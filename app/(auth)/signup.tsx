import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { T } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import Svg, { Path } from 'react-native-svg';

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

export default function SignupScreen() {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const pwStrength = password.length === 0 ? 0
    : password.length < 4 ? 1
    : password.length < 8 ? 2
    : password.length < 12 ? 3 : 4;
  const pwColors = [T.bg3, T.writing, T.listening, T.brand];
  const pwLabel = password.length === 0 ? 'Use 8+ characters'
    : password.length < 6 ? 'Too short'
    : password.length < 10 ? 'Getting stronger'
    : 'Strong password ✓';

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Missing fields', 'Please fill all fields.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (error) Alert.alert('Sign up failed', error.message);
    else router.push('/(auth)/onboarding');
  }

  async function handleGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) Alert.alert('Google sign-up failed', error.message);
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={s.logoWrap}>
            <View style={s.logoBadge}><Text style={s.logoBadgeText}>F</Text></View>
            <Text style={s.logoText}>Fluent<Text style={{ color: T.brand }}>ra</Text></Text>
          </View>

          <View style={s.headingWrap}>
            <Text style={s.heading}>Create your account</Text>
            <Text style={s.subheading}>Start your language journey for free</Text>
            <Text style={s.tagline}>Speak it. Score it. Own it.</Text>
          </View>

          <TouchableOpacity style={s.socialBtn} onPress={handleGoogle} activeOpacity={0.8}>
            <GoogleIcon />
            <Text style={s.socialBtnText}>Sign up with Google</Text>
          </TouchableOpacity>

          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>Full name</Text>
            <TextInput style={s.input} placeholder="María García" placeholderTextColor={T.ink4} value={name} onChangeText={setName} />
          </View>
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>Email</Text>
            <TextInput style={s.input} placeholder="you@example.com" placeholderTextColor={T.ink4} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          </View>
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>Password</Text>
            <TextInput style={s.input} placeholder="8+ characters" placeholderTextColor={T.ink4} value={password} onChangeText={setPassword} secureTextEntry />
          </View>

          {/* Password strength bar */}
          <View style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={{ flex: 1, height: 4, borderRadius: 99, backgroundColor: i <= pwStrength ? pwColors[Math.min(i - 1, 3)] : T.bg3 }} />
              ))}
            </View>
            <Text style={{ fontSize: 11, color: T.ink4 }}>{pwLabel}</Text>
          </View>

          <TouchableOpacity style={s.primaryBtn} onPress={handleSignup} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Create account</Text>}
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text style={s.footerLink}>Sign in</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.legal}>By signing up you agree to our Terms &amp; Privacy.</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { flexGrow: 1, padding: 24, paddingBottom: 48, gap: 16 },
  logoWrap: { alignItems: 'center', gap: 12 },
  logoBadge: { width: 48, height: 48, borderRadius: 13, backgroundColor: T.brand, alignItems: 'center', justifyContent: 'center' },
  logoBadgeText: { color: '#fff', fontSize: 22, fontFamily: T.serif },
  logoText: { fontFamily: T.serif, fontSize: 28, color: T.ink },
  headingWrap: { alignItems: 'center', gap: 4 },
  heading: { fontSize: 22, fontWeight: '700', color: T.ink },
  subheading: { fontSize: 13.5, color: T.ink3 },
  tagline: { fontFamily: T.serif, fontStyle: 'italic', fontSize: 12, color: T.brand, marginTop: 4 },
  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 13, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 12 },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: T.ink },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: T.border },
  dividerText: { fontSize: 12, color: T.ink4, fontWeight: '600' },
  fieldWrap: { gap: 6 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: T.ink2 },
  input: { padding: 12, paddingHorizontal: 14, borderRadius: 11, borderWidth: 1.5, borderColor: T.border, fontSize: 14, color: T.ink, backgroundColor: T.card, fontFamily: 'Inter_400Regular' },
  primaryBtn: { backgroundColor: T.brand, borderRadius: 12, padding: 14, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 14.5, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { fontSize: 13, color: T.ink3 },
  footerLink: { fontSize: 13, color: T.brand, fontWeight: '700' },
  legal: { fontSize: 10.5, color: T.ink5, textAlign: 'center', lineHeight: 15 },
});
