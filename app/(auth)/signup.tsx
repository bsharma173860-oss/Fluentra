import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { supabase } from '@/lib/supabase';
import { FluentraLogo } from '@/components/FluentraLogo';

export default function SignupScreen() {
  const { width }  = useWindowDimensions();
  const isDesktop   = Platform.OS === 'web' && width >= 768;

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');

  const [focusedField, setFocusedField] = useState<string | null>(null);

  async function handleSignup() {
    setError('');
    setSuccess('');
    if (!name.trim())          { setError('Please enter your name.'); return; }
    if (!email.trim())         { setError('Please enter your email.'); return; }
    if (!password)             { setError('Please enter a password.'); return; }
    if (password.length < 8)   { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm)  { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { full_name: name.trim() } },
    });
    setLoading(false);

    if (err) { setError(err.message); return; }

    if (data.session === null && data.user !== null) {
      setSuccess('Check your email to confirm your account, then come back to sign in.');
      return;
    }

    router.replace('/(auth)/onboarding');
  }

  function inputStyle(field: string) {
    return [s.input, focusedField === field && s.inputFocused];
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
          <Text style={s.subtitle}>Start your language journey</Text>

          {/* ── Name ── */}
          <View style={s.field}>
            <Text style={s.label}>Full name</Text>
            <TextInput
              style={inputStyle('name')}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.ink3}
              autoCapitalize="words"
              textContentType="name"
              editable={!loading}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── Email ── */}
          <View style={s.field}>
            <Text style={s.label}>Email address</Text>
            <TextInput
              style={inputStyle('email')}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.ink3}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              editable={!loading}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── Password ── */}
          <View style={s.field}>
            <Text style={s.label}>Password</Text>
            <TextInput
              style={inputStyle('password')}
              value={password}
              onChangeText={setPassword}
              placeholder="Min 8 characters"
              placeholderTextColor={Colors.ink3}
              secureTextEntry
              textContentType="newPassword"
              editable={!loading}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── Confirm ── */}
          <View style={s.field}>
            <Text style={s.label}>Confirm password</Text>
            <TextInput
              style={[
                ...inputStyle('confirm'),
                confirm && confirm !== password ? s.inputError : null,
              ].filter(Boolean)}
              value={confirm}
              onChangeText={setConfirm}
              placeholder="Re-enter password"
              placeholderTextColor={Colors.ink3}
              secureTextEntry
              textContentType="newPassword"
              editable={!loading}
              onFocus={() => setFocusedField('confirm')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          {/* ── Error / Success ── */}
          {error !== '' && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>{error}</Text>
            </View>
          )}
          {success !== '' && (
            <View style={s.successBox}>
              <Text style={s.successText}>{success}</Text>
            </View>
          )}

          {/* ── Create account button ── */}
          <TouchableOpacity
            style={[s.createBtn, loading && s.btnDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.white} size="small" />
              : <Text style={s.createBtnText}>Create account</Text>
            }
          </TouchableOpacity>

          {/* ── Footer ── */}
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

  logoWrap: { alignItems: 'center', marginBottom: 16 },
  subtitle: {
    fontFamily:   'Inter_400Regular',
    fontSize:     14,
    color:        Colors.ink3,
    textAlign:    'center',
    marginBottom: 28,
  },

  field: { gap: 6, marginBottom: 14 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },

  input: {
    height:            44,
    backgroundColor:   Colors.white,
    borderRadius:      10,
    borderWidth:       1,
    borderColor:       Colors.borderStrong,
    paddingHorizontal: 14,
    fontFamily:        'Inter_400Regular',
    fontSize:          15,
    color:             Colors.ink,
  },
  inputFocused: { borderColor: Colors.p },
  inputError:   { borderColor: Colors.danger },

  errorBox: {
    backgroundColor: Colors.danger_bg,
    borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: '#F5CCCC',
    marginBottom: 14,
  },
  errorText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.danger, lineHeight: 18 },

  successBox: {
    backgroundColor: Colors.green_bg,
    borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: Colors.green,
    marginBottom: 14,
  },
  successText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.green, lineHeight: 18 },

  createBtn: {
    height:          44,
    backgroundColor: Colors.p,
    borderRadius:    10,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       4,
    marginBottom:    24,
  },
  btnDisabled:   { opacity: 0.5 },
  createBtnText: { fontFamily: 'Inter_500Medium', fontSize: 15, color: Colors.white },

  footer:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
  footerLink: { fontFamily: 'Inter_500Medium',  fontSize: 13, color: Colors.p },
});
