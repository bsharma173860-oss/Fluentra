import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getTheme } from '@/constants/languageThemes';
import { FlagSVG } from '@/components/flags';
import { ChevronLeftIcon, FileTextIcon } from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';

const ORANGE     = '#C04A06';
const ORANGE_BG  = '#FFF7ED';
const ORANGE_BDR = '#FED7AA';

type Session = {
  id: string;
  passage: string | null;
  score: number | null;
  topic: string | null;
  duration_seconds: number | null;
  created_at: string;
};

function formatDate(str: string): string {
  const d    = new Date(str);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)   return `${days}d ago`;
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

export function ReadingSidebar() {
  const params = useLocalSearchParams();
  const code   = (params.languageCode ?? params.code ?? 'en') as string;
  const theme  = getTheme(code);

  const [sessions,  setSessions]  = useState<Session[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [userName,  setUserName]  = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPlan,  setUserPlan]  = useState<'free' | 'pro' | 'elite'>('free');

  useEffect(() => { loadData(); }, [code]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email ?? '');

    const [sessRes, profileRes] = await Promise.all([
      supabase.from('reading_sessions')
        .select('id, passage, score, topic, duration_seconds, created_at')
        .eq('user_id', user.id)
        .eq('language_code', code)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase.from('profiles')
        .select('name, subscription_tier')
        .eq('id', user.id)
        .maybeSingle(),
    ]);

    if (sessRes.data && sessRes.data.length > 0) {
      const data = sessRes.data as Session[];
      setSessions(data);
      const scores = data.map(s => s.score).filter((s): s is number => s !== null);
      if (scores.length > 0) setBestScore(Math.max(...scores));
    }

    if (profileRes.data) {
      setUserName((profileRes.data as any).name ?? '');
      const tier = (profileRes.data as any).subscription_tier;
      if (tier === 'pro' || tier === 'elite') setUserPlan(tier);
    }
  }

  const PASSAGES = [
    { key: '1',    label: 'Passage 1 — Easy'   },
    { key: '2',    label: 'Passage 2 — Medium'  },
    { key: '3',    label: 'Passage 3 — Hard'    },
    { key: 'full', label: 'Full Test — All 3'   },
  ];

  return (
    <View style={s.sidebar}>

      {/* ── Back ── */}
      <TouchableOpacity
        style={s.backRow}
        onPress={() => router.push(`/language/${code}` as any)}
        activeOpacity={0.7}
      >
        <ChevronLeftIcon size={12} color="#888" />
        <Text style={s.backText}>Back</Text>
      </TouchableOpacity>

      {/* ── Title + language ── */}
      <View style={s.titleRow}>
        <Text style={s.title}>Reading</Text>
        <View style={s.langPill}>
          <FlagSVG code={code} width={14} height={10} />
          <Text style={s.langName}>{theme.name}</Text>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* NEW SESSION */}
        <Text style={s.sectionLabel}>NEW SESSION</Text>
        <View style={s.group}>
          {PASSAGES.map(p => (
            <TouchableOpacity
              key={p.key}
              style={s.sessionBtn}
              onPress={() => router.push({
                pathname: '/modules/reading/session' as any,
                params: { passage: p.key, languageCode: code, code },
              })}
              activeOpacity={0.8}
            >
              <FileTextIcon size={13} color={ORANGE} />
              <Text style={s.sessionBtnText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HISTORY */}
        <Text style={[s.sectionLabel, { marginTop: 14 }]}>HISTORY</Text>
        <View style={s.group}>
          {sessions.length === 0 ? (
            <Text style={s.emptyText}>No reading sessions yet</Text>
          ) : (
            sessions.map(sess => (
              <View key={sess.id} style={s.histRow}>
                <View style={s.histDot} />
                <View style={{ flex: 1 }}>
                  <Text style={s.histSection} numberOfLines={1}>
                    {sess.passage === 'full' ? 'Full Test' : `Passage ${sess.passage}`}
                    {sess.topic ? ` · ${sess.topic.slice(0, 16)}…` : ''}
                  </Text>
                  <Text style={s.histDate}>{formatDate(sess.created_at)}</Text>
                </View>
                {sess.score != null && (
                  <Text style={s.histScore}>{sess.score}/13</Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* BEST SCORE */}
        {bestScore !== null && (
          <>
            <Text style={[s.sectionLabel, { marginTop: 14 }]}>BEST SCORE</Text>
            <View style={s.bestCard}>
              <Text style={s.bestLabel}>BEST SCORE</Text>
              <Text style={s.bestNum}>{bestScore}</Text>
            </View>
          </>
        )}

        <View style={{ height: 8 }} />
      </ScrollView>

      {/* ── User menu ── */}
      <View style={s.userMenuWrap}>
        <UserMenu
          name={userName || userEmail.split('@')[0] || 'You'}
          email={userEmail}
          plan={userPlan}
        />
      </View>

    </View>
  );
}

const s = StyleSheet.create({
  sidebar: {
    width: 220, backgroundColor: '#FFFFFF',
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
    flexDirection: 'column', flexShrink: 0,
  },
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  backText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#888' },
  titleRow: {
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA', gap: 4,
  },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  langPill: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  langName: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#666' },
  scroll:   { flex: 1 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
    paddingHorizontal: 12, paddingTop: 14, paddingBottom: 6,
  },
  group: { paddingHorizontal: 8, gap: 5 },
  sessionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: ORANGE_BG, borderWidth: 1, borderColor: ORANGE_BDR,
    borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12,
  },
  sessionBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: ORANGE },
  histRow:    { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 4, paddingVertical: 5 },
  histDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: ORANGE, flexShrink: 0 },
  histSection:{ fontFamily: 'Inter_500Medium', fontSize: 12, color: '#666' },
  histDate:   { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#BBB', marginTop: 1 },
  histScore:  { fontFamily: 'Inter_700Bold', fontSize: 12, color: ORANGE },
  emptyText:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#BBB', paddingHorizontal: 4, paddingVertical: 8 },
  bestCard: {
    marginHorizontal: 8, borderRadius: 10,
    backgroundColor: ORANGE_BG, padding: 12, alignItems: 'center', gap: 2,
  },
  bestLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: ORANGE, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  bestNum:   { fontFamily: 'Inter_700Bold', fontSize: 24, color: ORANGE },
  userMenuWrap: { borderTopWidth: 1, borderTopColor: '#EAEAEA', padding: 8 },
});
