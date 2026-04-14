import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
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

SplashScreen.preventAutoHideAsync();

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

  // Hide splash once fonts are ready
  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
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
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      clearTimeout(timer);
      setSession(s ?? null);
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
        <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
