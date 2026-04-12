import { useEffect } from 'react';
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
import { Colors } from '@/constants/colors';
import { AuthProvider, useAuth } from '@/lib/authContext';

SplashScreen.preventAutoHideAsync();

// ── Route guard ───────────────────────────────────────────────
function RouteGuard({ children }: { children: React.ReactNode }) {
  const { session, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Wait for initial session + profile resolution before redirecting
    if (loading) return;

    const inAuth = segments[0] === '(auth)';
    const onOnboarding = (segments as string[])[1] === 'onboarding';

    if (!session) {
      // Not signed in — force to login
      if (!inAuth) {
        console.log('[Guard] no session → login');
        router.replace('/(auth)/login');
      }
      return;
    }

    // Signed in but profile not yet fetched — wait, let auth screen navigate
    if (!profile) return;

    // New user (name not set) → onboarding
    if (profile.name === null && !onOnboarding) {
      console.log('[Guard] new user → onboarding');
      router.replace('/(auth)/onboarding');
      return;
    }

    // Returning user stuck on auth screen → home
    if (inAuth && !onOnboarding) {
      console.log('[Guard] returning user in auth → home');
      router.replace('/(tabs)/home');
    }
  }, [session, profile, loading, segments]);

  return <>{children}</>;
}

// ── Root layout ───────────────────────────────────────────────
function RootLayoutInner() {
  const [fontsLoaded, fontError] = useFonts({
    DMSerifDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <RouteGuard>
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
    </RouteGuard>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
