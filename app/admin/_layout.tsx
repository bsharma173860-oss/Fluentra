/**
 * app/admin/_layout.tsx
 * Auth guard — only admin emails can access /admin/* routes.
 */
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Slot } from 'expo-router';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAILS: string[] = [
  'bsharma173860@gmail.com',
  ...(process.env.EXPO_PUBLIC_ADMIN_EMAILS ?? '').split(',').filter(Boolean),
];

export default function AdminLayout() {
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
        router.replace('/(tabs)/home');
      }
    }
    checkAdmin();
  }, []);

  return <Slot />;
}
