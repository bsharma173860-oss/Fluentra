import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

export default function SignupScreen() {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');

  async function handleSignup() {
    setError('');
    setSuccess('');

    // Client-side validation
    if (!name.trim())    { setError('Please enter your name.'); return; }
    if (!email.trim())   { setError('Please enter your email.'); return; }
    if (!password)       { setError('Please enter a password.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    console.log('[Signup] calling supabase.auth.signUp for:', email.trim());

    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    setLoading(false);
    console.log('[Signup] result:', JSON.stringify({ user: data?.user?.email, err: err?.message }));

    if (err) {
      setError(err.message);
      return;
    }

    // Supabase may require email confirmation depending on your project settings.
    // If confirmations are ON, data.user will be set but data.session will be null.
    if (data.session === null && data.user !== null) {
      setSuccess(
        '✅  Check your email to confirm your account, then come back to sign in.'
      );
      return;
    }

    // Confirmation OFF (default for new projects) — session is returned immediately
    console.log('[Signup] account created, navigating to onboarding');
    router.replace('/(auth)/onboarding');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={s.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={s.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={s.logoWrap}>
            <Text style={s.logo}>Fluent<Text style={s.ra}>ra</Text></Text>
            <Text style={s.tagline}>Start your language journey</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.title}>Create account</Text>

            <View style={s.field}>
              <Text style={s.label}>Full name</Text>
              <TextInput
                style={s.input}
                value={name}
                onChangeText={setName}
                placeholder="Ahmed Al-Rashid"
                placeholderTextColor={Colors.ink4}
                autoCapitalize="words"
                textContentType="name"
                editable={!loading}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Email</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={Colors.ink4}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="emailAddress"
                editable={!loading}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Min 8 characters"
                placeholderTextColor={Colors.ink4}
                secureTextEntry
                textContentType="newPassword"
                editable={!loading}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Confirm password</Text>
              <TextInput
                style={[s.input, confirm && confirm !== password && s.inputError]}
                value={confirm}
                onChangeText={setConfirm}
                placeholder="Re-enter password"
                placeholderTextColor={Colors.ink4}
                secureTextEntry
                textContentType="newPassword"
                editable={!loading}
              />
            </View>

            {error !== '' && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠️  {error}</Text>
              </View>
            )}

            {success !== '' && (
              <View style={s.successBox}>
                <Text style={s.successText}>{success}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.btnText}>Create account</Text>
              }
            </TouchableOpacity>

            <Text style={s.terms}>
              By signing up you agree to our{' '}
              <Text style={s.termsLink}>Terms</Text> and{' '}
              <Text style={s.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={s.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={s.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  kav: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 24, gap: 24 },

  logoWrap: { alignItems: 'center', paddingTop: 12, gap: 8 },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 44, color: Colors.ink },
  ra: { color: Colors.p },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontFamily: 'Inter_700Bold', fontSize: 22, color: Colors.ink, marginBottom: 2 },

  field: { gap: 6 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  input: {
    backgroundColor: Colors.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.ink,
  },
  inputError: {
    borderColor: Colors.danger,
  },

  errorBox: {
    backgroundColor: '#FFF0F0',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FFCCCC',
  },
  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.danger,
    lineHeight: 18,
  },
  successBox: {
    backgroundColor: Colors.green_bg,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.green,
  },
  successText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.green,
    lineHeight: 18,
  },

  btn: {
    backgroundColor: Colors.p,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white },

  terms: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.ink3,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: { color: Colors.p, fontFamily: 'Inter_500Medium' },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  footerLink: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },
});
