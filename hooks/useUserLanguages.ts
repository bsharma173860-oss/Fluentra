import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { UserLanguage } from '@/lib/supabase';

export function useUserLanguages() {
  const [languages, setLanguages] = useState<UserLanguage[]>([]);
  const [loading,   setLoading]   = useState(true);

  const fetchLanguages = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data } = await supabase
      .from('user_languages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at');

    setLanguages(data as UserLanguage[] ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchLanguages();

    const sub = supabase
      .channel('user_languages_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_languages',
      }, () => fetchLanguages())
      .subscribe();

    return () => { sub.unsubscribe(); };
  }, [fetchLanguages]);

  return { languages, loading, refetch: fetchLanguages };
}
