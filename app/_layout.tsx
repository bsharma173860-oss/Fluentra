if (typeof window !== 'undefined') {
  // web only — guards against SSR / static pre-render crashes
}

// Sentry — install: npx expo install @sentry/react-native
// Safe init: require() so the native module is never loaded on web.
if (Platform.OS !== 'web') {
  const Sentry = require('@sentry/react-native');
  Sentry.init({
    dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  });
}

import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

export { ErrorBoundary } from 'expo-router';
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import type { Session } from '@supabase/supabase-js';
import { Colors } from '@/constants/colors';
import { AuthProvider } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { initAnalytics, identifyUser } from '@/lib/analytics';

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

// ── Branded loading screen ────────────────────────────────────
function LoadingScreen() {
  return (
    <View style={ls.wrap}>
      <Text style={ls.logo}>
        Fluent<Text style={ls.ra}>ra</Text>
      </Text>
      <ActivityIndicator color={Colors.p} size="small" />
    </View>
  );
}

const ls = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  logo: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 48, color: Colors.ink },
  ra: { color: Colors.p },
});

// ── Root layout ───────────────────────────────────────────────
function RootLayoutInner() {
  // undefined = still checking | null = no session | Session = logged in
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const segments = useSegments();
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    DMSerifDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Initialize PostHog once on mount
  useEffect(() => {
    initAnalytics();
  }, []);

  // Hide splash once fonts are ready (native only)
  useEffect(() => {
    if ((fontsLoaded || fontError) && Platform.OS !== 'web') SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Session state — resolves from SecureStore (fast) or via onAuthStateChange.
  // Fallback timer guarantees we never stay on the loading screen past 1.5s,
  // even if a hung token-refresh request stalls getSession/onAuthStateChange.
  useEffect(() => {
    const timer = setTimeout(() => {
      // Only fires if nothing resolved first; functional update is a no-op
      // when session is already set (null or a real session).
      setSession(prev => (prev === undefined ? null : prev));
    }, 1500);

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      clearTimeout(timer);
      setSession(s ?? null);
      if (s?.user) {
        identifyUser(s.user.id, {
          email: s.user.email,
          createdAt: s.user.created_at,
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      clearTimeout(timer);
      setSession(s ?? null);
      if (s?.user) {
        identifyUser(s.user.id, {
          email: s.user.email,
          createdAt: s.user.created_at,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  // Route guard — redirect based on session state
  useEffect(() => {
    if (session === undefined) return; // still resolving, do nothing
    const inAuth = segments[0] === '(auth)';
    if (!session && !inAuth) {
      router.replace('/(auth)/login');
    } else if (session && inAuth) {
      router.replace('/(tabs)/home');
    }
  }, [session, segments]);

  // Keep native splash while fonts load
  if (!fontsLoaded && !fontError) return null;

  // Fonts ready but session not yet known — show branded splash
  if (session === undefined) return <LoadingScreen />;

  // Session resolved — render the navigator
  return (
    <>
      <StatusBar style="dark" backgroundColor={Colors.bg} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.bg },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(auth)"   options={{ animation: 'none' }} />
        <Stack.Screen name="(tabs)"   options={{ animation: 'none' }} />
        <Stack.Screen name="upgrade"  options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="library"  options={{ animation: 'none' }} />
        <Stack.Screen name="language/[code]/foundation" options={{ headerShown: false }} />
        <Stack.Screen name="language/[code]/lesson"     options={{ headerShown: false }} />
        <Stack.Screen name="privacy"                    options={{ headerShown: false }} />
        <Stack.Screen name="terms"                      options={{ headerShown: false }} />
        <Stack.Screen name="settings/account"           options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}

// When Sentry is installed, replace the line below with:
// export default Sentry.wrap(RootLayout);
export default RootLayout;
