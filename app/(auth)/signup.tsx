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
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup() {
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    // Profile auto-created by DB trigger; go to onboarding to personalise
    router.replace('/(auth)/onboarding');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={s.logoWrap}>
            <Text style={s.logo}>Fluent<Text style={s.ra}>ra</Text></Text>
            <Text style={s.tagline}>Start your language journey</Text>
          </View>

          {/* Form */}
          <View style={s.form}>
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
              />
            </View>

            {error !== '' && <Text style={s.errorText}>{error}</Text>}

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
  content: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 24, gap: 28 },

  logoWrap: { alignItems: 'center', paddingTop: 16, gap: 8 },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 42, color: Colors.ink },
  ra: { color: Colors.p },
  tagline: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },

  form: { gap: 14 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.ink, marginBottom: 4 },

  field: { gap: 6 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
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

  errorText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.danger,
    backgroundColor: '#FFF0F0',
    borderRadius: 8,
    padding: 10,
  },

  btn: {
    backgroundColor: Colors.p,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  btnDisabled: { opacity: 0.5 },
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
