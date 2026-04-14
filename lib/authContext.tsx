import React, { createContext, useContext, useEffect, useState } from 'react';
import { type Session as SupabaseSession, type User } from '@supabase/supabase-js';
import { supabase, type Profile } from './supabase';

type AuthContextValue = {
  session: SupabaseSession | null;
  user: User | null;
  profile: Profile | null;
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
  const [loading, setLoading] = useState(true);

  async function fetchProfile(userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) console.warn('[Auth] fetchProfile error:', error.message);
    setProfile(data ? (data as Profile) : null);
  }

  useEffect(() => {
    // getSession reads from SecureStore — nearly instant, never hangs
    supabase.auth.getSession().then(({ data: { session: s }, error }) => {
      if (error) console.warn('[Auth] getSession error:', error.message);
      setSession(s);
      setLoading(false); // resolve immediately — don't await profile
      if (s?.user) fetchProfile(s.user.id); // background, fire-and-forget
    });

    // onAuthStateChange handles sign-in, sign-out, token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setLoading(false); // always resolve on any auth event
      if (s?.user) {
        fetchProfile(s.user.id); // background, fire-and-forget
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function refreshProfile() {
    if (session?.user) await fetchProfile(session.user.id);
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
