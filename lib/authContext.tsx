import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { type Session as SupabaseSession, type User } from '@supabase/supabase-js';
import { supabase, type Profile } from './supabase';

type AuthContextValue = {
  session: SupabaseSession | null;
  user: User | null;
  profile: Profile | null;
  /** true until the initial session check + profile fetch both complete */
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // loading stays true until the very first session+profile resolution
  const [loading, setLoading] = useState(true);
  const initialised = useRef(false);

  async function fetchProfile(userId: string): Promise<void> {
    console.log('[Auth] fetchProfile for', userId);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.warn('[Auth] fetchProfile error:', error.message);
    }
    setProfile(data ? (data as Profile) : null);
  }

  useEffect(() => {
    // 1. Get the current session on mount
    supabase.auth.getSession().then(async ({ data: { session: s }, error }) => {
      if (error) console.warn('[Auth] getSession error:', error.message);
      console.log('[Auth] initial session:', s?.user?.email ?? 'none');
      setSession(s);
      if (s?.user) {
        await fetchProfile(s.user.id);
      }
      setLoading(false);
      initialised.current = true;
    });

    // 2. Listen for subsequent auth changes (sign-in, sign-out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        console.log('[Auth] onAuthStateChange:', event, s?.user?.email ?? 'none');
        setSession(s);
        if (s?.user) {
          await fetchProfile(s.user.id);
        } else {
          setProfile(null);
        }
        // After the first initialisation, keep loading false
        if (!initialised.current) {
          setLoading(false);
          initialised.current = true;
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    console.log('[Auth] signing out');
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session?.user) {
      await fetchProfile(session.user.id);
    }
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, profile, loading, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
