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
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

// ─────────────────────────────────────────────────────────────
// GOOGLE OAUTH SETUP:
// 1. Go to Supabase Dashboard → Authentication → Providers → Google
// 2. Toggle "Enable" and add your Google Client ID + Secret
// 3. Add redirect URL shown in the dashboard to your Google OAuth app
// ─────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError]       = useState('');

  // ── Email / password ──────────────────────────────────────
  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);

    console.log('[Login] attempting signInWithPassword for:', email.trim());
    const { data, error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (err) {
      console.error('[Login] signInWithPassword error:', err.message, err.status);
      setError(err.message);
      return;
    }

    console.log('[Login] success, user:', data.user?.email);
    // RouteGuard in _layout.tsx handles the → /(tabs)/home redirect
    // once session + profile are loaded. We also push directly as a fallback.
    router.replace('/(tabs)/home');
  }

  // ── Google OAuth ──────────────────────────────────────────
  async function handleGoogle() {
    console.log(
      '[Login] ⚠️  Make sure Google is enabled in:\n' +
      '  Supabase Dashboard → Authentication → Providers → Google'
    );

    setError('');
    setOauthLoading('google');

    const redirectTo = makeRedirectUri({
      scheme: 'fluentra',
      path: 'auth/callback',
    });
    console.log('[Login] Google redirect URI:', redirectTo);

    const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo, skipBrowserRedirect: true },
    });

    if (oauthErr || !data.url) {
      setOauthLoading(null);
      console.error('[Login] signInWithOAuth error:', oauthErr?.message);
      setError(oauthErr?.message ?? 'Could not start Google sign-in.');
      return;
    }

    console.log('[Login] opening browser for Google OAuth:', data.url);
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    setOauthLoading(null);
    console.log('[Login] WebBrowser result type:', result.type);

    if (result.type === 'success' && 'url' in result) {
      await handleOAuthCallback(result.url);
    }
  }

  // ── Apple Sign In ─────────────────────────────────────────
  async function handleApple() {
    setError('');
    setOauthLoading('apple');
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('[Login] Apple credential received');
      if (!credential.identityToken) {
        throw new Error('Apple did not return an identity token.');
      }

      const { data, error: err } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (err) {
        console.error('[Login] Apple signInWithIdToken error:', err.message);
        setError(err.message);
      } else {
        console.log('[Login] Apple login success:', data.user?.email);
        router.replace('/(tabs)/home');
      }
    } catch (e: any) {
      if (e.code !== 'ERR_REQUEST_CANCELED') {
        console.error('[Login] Apple auth error:', e.message);
        setError(e.message ?? 'Apple sign-in failed.');
      }
    } finally {
      setOauthLoading(null);
    }
  }

  // ── Parse OAuth callback ──────────────────────────────────
  async function handleOAuthCallback(callbackUrl: string) {
    try {
      const url = new URL(callbackUrl);
      // Tokens can be in hash fragment (implicit) or query params (PKCE)
      const params = new URLSearchParams(
        url.hash ? url.hash.substring(1) : url.search.substring(1)
      );
      const accessToken  = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken && refreshToken) {
        console.log('[Login] setting session from OAuth callback');
        const { error: sessErr } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessErr) {
          console.error('[Login] setSession error:', sessErr.message);
          setError(sessErr.message);
        } else {
          router.replace('/(tabs)/home');
        }
      } else {
        console.warn('[Login] OAuth callback missing tokens. URL:', callbackUrl);
        setError('Sign-in completed but no token received. Please try again.');
      }
    } catch (e: any) {
      console.error('[Login] handleOAuthCallback error:', e.message);
      setError('Failed to complete sign-in.');
    }
  }

  const anyLoading = loading || oauthLoading !== null;

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
            <Text style={s.tagline}>Your AI language coach</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>
            <Text style={s.title}>Welcome back</Text>

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
                editable={!anyLoading}
              />
            </View>

            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.ink4}
                secureTextEntry
                textContentType="password"
                editable={!anyLoading}
              />
            </View>

            {error !== '' && (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠️  {error}</Text>
              </View>
            )}

            {/* Sign in button */}
            <TouchableOpacity
              style={[s.btn, anyLoading && s.btnDisabled]}
              onPress={handleLogin}
              disabled={anyLoading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.btnText}>Sign in</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={s.forgot} onPress={() => {}}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={s.dividerRow}>
              <View style={s.dividerLine} />
              <Text style={s.dividerText}>or continue with</Text>
              <View style={s.dividerLine} />
            </View>

            {/* Google */}
            <TouchableOpacity
              style={[s.socialBtn, anyLoading && s.btnDisabled]}
              onPress={handleGoogle}
              disabled={anyLoading}
              activeOpacity={0.85}
            >
              {oauthLoading === 'google'
                ? <ActivityIndicator color={Colors.ink} size="small" />
                : <>
                    <Text style={s.socialIcon}>G</Text>
                    <Text style={s.socialText}>Continue with Google</Text>
                  </>
              }
            </TouchableOpacity>

            {/* Apple — iOS only */}
            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={12}
                style={s.appleBtn}
                onPress={handleApple}
              />
            )}
          </View>

          {/* Footer */}
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

  btn: {
    backgroundColor: Colors.p,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.45 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: Colors.white },

  forgot: { alignItems: 'center', marginTop: -4 },
  forgotText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },

  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    minHeight: 50,
  },
  socialIcon: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#4285F4',
  },
  socialText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.ink },

  appleBtn: { width: '100%', height: 50 },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  footerLink: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },
});
