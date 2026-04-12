import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  DMSerifDisplay_400Regular,
} from '@expo-google-fonts/dm-serif-display';
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
    if (loading) return;

    const inAuth = segments[0] === '(auth)';
    const onOnboarding = (segments as string[])[1] === 'onboarding';

    if (!session) {
      // Not signed in → force to login
      if (!inAuth) router.replace('/(auth)/login');
      return;
    }

    // Signed in but profile not yet personalised → onboarding
    // (native_language is 'en' default, target_exam is 'IELTS' default;
    //  we detect a brand-new user by checking if full_name is still null
    //  AND they are not already on onboarding)
    const isNewUser = profile !== null && profile.full_name === null;
    if (isNewUser && !onOnboarding) {
      router.replace('/(auth)/onboarding');
      return;
    }

    // Signed in and in auth → push to home
    if (inAuth && !onOnboarding) {
      router.replace('/(tabs)/home');
    }
  }, [session, profile, loading, segments]);

  return <>{children}</>;
}

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
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
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
