import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
  Alert, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
// expo-apple-authentication is iOS-only — never import at module level on web
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import Svg, { Path } from 'react-native-svg';
import { FluentraLogo } from '@/components/FluentraLogo';

// ── Inline OAuth icons ────────────────────────────────────────────
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
    <Svg width={18} height={18} viewBox="0 0 24 24" fill={Colors.ink}>
      <Path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.53 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </Svg>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { width } = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [loading,      setLoading]      = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error,        setError]        = useState('');
  const [focusedField, setFocusedField] = useState<'email' | 'password' | null>(null);

  const anyLoading = loading || oauthLoading !== null;

  // ── Sign in ───────────────────────────────────────────────────
  async function handleSignIn() {
    const trimmed = email.trim();
    if (!trimmed)    { setError('Please enter your email address.'); return; }
    if (!password)   { setError('Please enter your password.'); return; }
    setError('');
    setLoading(true);
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: trimmed, password,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data.user) router.replace('/(tabs)/home');
  }

  // ── Google OAuth ──────────────────────────────────────────────
  async function handleGoogle() {
    const redirectTo = typeof window !== 'undefined'
      ? window.location.origin + '/auth/callback'
      : 'https://fluentra-kappa.vercel.app/auth/callback';

    const { error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });
    if (oauthErr) Alert.alert('Error', oauthErr.message);
  }

  // ── Forgot password ───────────────────────────────────────────
  async function handleForgotPassword() {
    if (!email.trim()) {
      Alert.alert('Enter email', 'Please enter your email address first');
      return;
    }
    const redirectTo = typeof window !== 'undefined'
      ? window.location.origin + '/auth/reset-password'
      : 'https://fluentra-kappa.vercel.app/auth/reset-password';

    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo,
    });
    if (resetErr) {
      Alert.alert('Error', resetErr.message);
    } else {
      Alert.alert('Email sent!', 'Check your inbox for a password reset link');
    }
  }

  // ── Apple Sign In ─────────────────────────────────────────────
  async function handleApple() {
    setError('');
    setOauthLoading('apple');
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const AppleAuthentication = require('expo-apple-authentication');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!credential.identityToken) throw new Error('No identity token returned.');
      const { data, error: err } = await supabase.auth.signInWithIdToken({
        provider: 'apple', token: credential.identityToken,
      });
      if (err) { setError(err.message); }
      else if (data.user) router.replace('/(tabs)/home');
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') setError(e.message ?? 'Apple sign-in failed.');
    } finally {
      setOauthLoading(null);
    }
  }


  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={[s.content, isDesktop && s.contentDesktop]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Logo ── */}
          <View style={s.logoWrap}>
            <FluentraLogo iconSize={28} textSize={28} />
          </View>

          {/* ── Subtitle ── */}
          <Text style={s.subtitle}>AI language learning & exam prep</Text>

          {/* ── Social buttons ── */}
          <View style={s.socialGroup}>
            <TouchableOpacity
              style={[s.socialBtn, anyLoading && s.btnDisabled]}
              onPress={handleGoogle}
              disabled={anyLoading}
              activeOpacity={0.85}
            >
              {oauthLoading === 'google'
                ? <ActivityIndicator color={Colors.ink2} size="small" />
                : <>
                    <GoogleIcon />
                    <Text style={s.socialBtnText}>Continue with Google</Text>
                  </>
              }
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={[s.socialBtn, anyLoading && s.btnDisabled]}
                onPress={handleApple}
                disabled={anyLoading}
                activeOpacity={0.85}
              >
                {oauthLoading === 'apple'
                  ? <ActivityIndicator color={Colors.ink2} size="small" />
                  : <>
                      <AppleIcon />
                      <Text style={s.socialBtnText}>Continue with Apple</Text>
                    </>
                }
              </TouchableOpacity>
            )}
          </View>

          {/* ── Divider ── */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>or</Text>
            <View style={s.dividerLine} />
          </View>

          {/* ── Email ── */}
          <View style={s.field}>
            <Text style={s.label}>Email address</Text>
            <TextInput
              style={[s.input, focusedField === 'email' && s.inputFocused]}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.ink3}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              editable={!anyLoading}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── Password ── */}
          <View style={s.field}>
            <View style={s.labelRow}>
              <Text style={s.label}>Password</Text>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={s.forgotLink}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[s.input, focusedField === 'password' && s.inputFocused]}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor={Colors.ink3}
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
              returnKeyType="go"
              onSubmitEditing={handleSignIn}
              editable={!anyLoading}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── Error ── */}
          {error !== '' && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}

          {/* ── Sign in button ── */}
          <TouchableOpacity
            style={[s.signInBtn, anyLoading && s.btnDisabled]}
            onPress={handleSignIn}
            disabled={anyLoading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={s.signInBtnText}>Sign in</Text>
            }
          </TouchableOpacity>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={s.footerLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  kav:  { flex: 1 },

  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical:   40,
    justifyContent:    'center',
    gap:               0,
  },
  contentDesktop: {
    maxWidth: 420,
    width:    '100%',
    alignSelf: 'center',
    paddingHorizontal: 40,
  },

  // Logo
  logoWrap: { alignItems: 'center', marginBottom: 16 },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize:   14,
    color:      Colors.ink3,
    textAlign:  'center',
    marginBottom: 32,
  },

  // Social
  socialGroup: { gap: 10, marginBottom: 20 },
  socialBtn: {
    height:          44,
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'center',
    gap:             10,
    backgroundColor: Colors.white,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     Colors.borderStrong,
  },
  socialBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink },

  // Divider
  divider:     { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    fontFamily: 'Inter_400Regular', fontSize: 13,
    color: Colors.ink3, paddingHorizontal: 12,
  },

  // Fields
  field:     { gap: 6, marginBottom: 14 },
  labelRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  forgotLink:{ fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.p },

  input: {
    height:          44,
    backgroundColor: Colors.white,
    borderRadius:    10,
    borderWidth:     1,
    borderColor:     Colors.borderStrong,
    paddingHorizontal: 14,
    fontFamily:      'Inter_400Regular',
    fontSize:        15,
    color:           Colors.ink,
  },
  inputFocused: { borderColor: Colors.p },

  // Error
  errorBox: {
    backgroundColor: Colors.danger_bg,
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F5CCCC',
    marginBottom: 14,
  },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.danger, lineHeight: 18 },

  // Sign in
  signInBtn: {
    height:          44,
    backgroundColor: Colors.p,
    borderRadius:    10,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       4,
    marginBottom:    24,
  },
  btnDisabled:   { opacity: 0.5 },
  signInBtnText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },

  // Footer
  footer:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
  footerLink: { fontFamily: 'Inter_500Medium',  fontSize: 13, color: Colors.p },
});
