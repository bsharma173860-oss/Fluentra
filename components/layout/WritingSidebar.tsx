import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getTheme } from '@/constants/languageThemes';
import { FlagSVG } from '@/components/flags';
import { ChevronLeftIcon, PenIcon } from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';

const GOLD     = '#B07A10';
const GOLD_BG  = '#FEF9EC';
const GOLD_BDR = '#F0E4C0';

type Attempt = {
  id: string;
  task: 'task1' | 'task2';
  band_score: number | null;
  prompt: string | null;
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

export function WritingSidebar() {
  const params = useLocalSearchParams();
  const code   = (params.languageCode ?? params.code ?? 'en') as string;
  const theme  = getTheme(code);

  const [attempts,  setAttempts]  = useState<Attempt[]>([]);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [bestTask,  setBestTask]  = useState('');
  const [userName,  setUserName]  = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPlan,  setUserPlan]  = useState<'free' | 'pro' | 'elite'>('free');

  useEffect(() => { loadData(); }, [code]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserEmail(user.email ?? '');

    const [attRes, profileRes] = await Promise.all([
      supabase.from('writing_attempts')
        .select('id, task, band_score, prompt, created_at')
        .eq('user_id', user.id)
        .eq('language_code', code)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase.from('profiles')
        .select('name, subscription_tier')
        .eq('id', user.id)
        .maybeSingle(),
    ]);

    if (attRes.data && attRes.data.length > 0) {
      const data = attRes.data as Attempt[];
      setAttempts(data);
      let best: number | null = null;
      let bestT = '';
      for (const a of data) {
        if (a.band_score !== null && (best === null || a.band_score > best)) {
          best  = a.band_score;
          bestT = a.task === 'task1' ? 'Task 1' : 'Task 2';
        }
      }
      setBestScore(best);
      setBestTask(bestT);
    }

    if (profileRes.data) {
      setUserName((profileRes.data as any).name ?? '');
      const tier = (profileRes.data as any).subscription_tier;
      if (tier === 'pro' || tier === 'elite') setUserPlan(tier);
    }
  }

  return (
    <View style={s.sidebar}>

      {/* ── Back button ── */}
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
        <Text style={s.title}>Writing</Text>
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
          {[
            { key: 'task1', label: 'Task 1 — Graph/Chart', route: '/modules/writing/task1' },
            { key: 'task2', label: 'Task 2 — Essay',       route: '/modules/writing/task2' },
          ].map(item => (
            <TouchableOpacity
              key={item.key}
              style={s.sessionBtn}
              onPress={() => router.push({ pathname: item.route as any, params: { languageCode: code, code } })}
              activeOpacity={0.8}
            >
              <PenIcon size={13} color={GOLD} />
              <Text style={s.sessionBtnText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HISTORY */}
        <Text style={[s.sectionLabel, { marginTop: 14 }]}>HISTORY</Text>
        <View style={s.group}>
          {attempts.length === 0 ? (
            <Text style={s.emptyText}>No writing sessions yet</Text>
          ) : (
            attempts.map(att => (
              <View key={att.id} style={s.histRow}>
                <View style={[s.histDot, { backgroundColor: att.task === 'task1' ? '#0A8C5A' : GOLD }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.histTask} numberOfLines={1}>
                    {att.task === 'task1' ? 'Task 1' : 'Task 2'}
                    {att.prompt ? ` · ${att.prompt.slice(0, 18)}…` : ''}
                  </Text>
                  <Text style={s.histDate}>{formatDate(att.created_at)}</Text>
                </View>
                {att.band_score != null && (
                  <Text style={s.histScore}>{att.band_score.toFixed(1)}</Text>
                )}
              </View>
            ))
          )}
        </View>

        {/* YOUR BEST */}
        {bestScore !== null && (
          <>
            <Text style={[s.sectionLabel, { marginTop: 14 }]}>YOUR BEST</Text>
            <View style={s.bestCard}>
              <Text style={s.bestLabel}>BEST SCORE</Text>
              <Text style={s.bestNum}>{bestScore.toFixed(1)}</Text>
              <Text style={s.bestSub}>{bestTask}</Text>
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

  scroll: { flex: 1 },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
    paddingHorizontal: 12, paddingTop: 14, paddingBottom: 6,
  },
  group: { paddingHorizontal: 8, gap: 6 },

  sessionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: GOLD_BG, borderWidth: 1, borderColor: GOLD_BDR,
    borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14,
  },
  sessionBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: GOLD },

  histRow:   { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 4, paddingVertical: 5 },
  histDot:   { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  histTask:  { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#666' },
  histDate:  { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#BBB', marginTop: 1 },
  histScore: { fontFamily: 'Inter_700Bold', fontSize: 12, color: GOLD },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#BBB', paddingHorizontal: 4, paddingVertical: 8 },

  bestCard: {
    marginHorizontal: 8, borderRadius: 10,
    backgroundColor: GOLD_BG, padding: 12, alignItems: 'center', gap: 2,
  },
  bestLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: GOLD, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  bestNum:   { fontFamily: 'Inter_700Bold', fontSize: 24, color: GOLD },
  bestSub:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: GOLD },

  userMenuWrap: { borderTopWidth: 1, borderTopColor: '#EAEAEA', padding: 8 },
});
