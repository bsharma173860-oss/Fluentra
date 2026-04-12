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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

WebBrowser.maybeCompleteAuthSession();

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Weak password', 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
    }
    // On success, onAuthStateChange fires → RouteGuard sends to /(auth)/onboarding
    // because profile.target_exam will be null until onboarding completes.
    // For now RouteGuard sends to /(tabs)/home; onboarding is manually linked.
  }

  async function handleOAuth(provider: 'google' | 'apple') {
    setOauthLoading(provider);
    const redirectTo = makeRedirectUri({ scheme: 'fluentra', path: 'auth/callback' });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo, skipBrowserRedirect: true },
    });
    if (error || !data.url) {
      setOauthLoading(null);
      Alert.alert('OAuth error', error?.message ?? 'Could not start sign-in.');
      return;
    }
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    setOauthLoading(null);
    if (result.type === 'success' && result.url) {
      const url = new URL(result.url);
      const accessToken = url.searchParams.get('access_token') ?? url.hash.split('access_token=')[1]?.split('&')[0];
      const refreshToken = url.searchParams.get('refresh_token') ?? url.hash.split('refresh_token=')[1]?.split('&')[0];
      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Text style={styles.logo}>
              Fluent<Text style={styles.logoAccent}>ra</Text>
            </Text>
            <Text style={styles.tagline}>Start your language journey</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Create your account</Text>
            <Text style={styles.formSub}>It's free. No credit card needed.</Text>

            <View style={styles.fields}>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Full name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Ahmed Al-Rashid"
                  placeholderTextColor={Colors.ink4}
                  autoCapitalize="words"
                  textContentType="name"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.ink4}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min 8 characters"
                  placeholderTextColor={Colors.ink4}
                  secureTextEntry
                  textContentType="newPassword"
                />
              </View>
            </View>

            <Button
              label="Create account"
              onPress={handleSignup}
              loading={loading}
              fullWidth
              size="lg"
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialBtn}
                onPress={() => handleOAuth('google')}
                disabled={oauthLoading !== null}
                activeOpacity={0.8}
              >
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>
                  {oauthLoading === 'google' ? 'Opening…' : 'Google'}
                </Text>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => handleOAuth('apple')}
                  disabled={oauthLoading !== null}
                  activeOpacity={0.8}
                >
                  <Text style={styles.socialIcon}></Text>
                  <Text style={styles.socialText}>
                    {oauthLoading === 'apple' ? 'Opening…' : 'Apple'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.terms}>
              By creating an account you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>.
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  kav: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 20, gap: 28 },

  logoWrap: { alignItems: 'center', paddingTop: 12, gap: 6 },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 40, color: Colors.ink },
  logoAccent: { color: Colors.p },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  form: { gap: 16 },
  formTitle: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.ink },
  formSub: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3, marginTop: -8 },

  fields: { gap: 12 },
  field: { gap: 6 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.ink,
  },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },

  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  socialIcon: { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  socialText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink },

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
