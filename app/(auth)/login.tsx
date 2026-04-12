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

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (err) {
      setError(err.message);
      return;
    }
    router.replace('/(tabs)/home');
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={s.kav} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={s.logoWrap}>
            <Text style={s.logo}>Fluent<Text style={s.ra}>ra</Text></Text>
            <Text style={s.tagline}>Your AI language coach</Text>
          </View>

          {/* Form */}
          <View style={s.form}>
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
              />
            </View>

            {error !== '' && <Text style={s.errorText}>{error}</Text>}

            <TouchableOpacity
              style={[s.btn, loading && s.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={Colors.white} />
                : <Text style={s.btnText}>Sign in</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={s.forgot}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
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
  content: { flexGrow: 1, paddingHorizontal: 28, paddingVertical: 24, gap: 32 },

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

  forgot: { alignItems: 'center', marginTop: -4 },
  forgotText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.p },

  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  footerLink: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.p },
});
