import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { getTheme } from '@/constants/languageThemes';
import { FlagSVG } from '@/components/flags';
import { ChevronLeftIcon, MicIcon } from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';

const PURPLE     = '#5B4EFF';
const PURPLE_BG  = '#F0EEFF';
const PURPLE_BDR = '#D8D0FF';

const PART_COLORS: Record<string, string> = {
  'Part 1': '#5B4EFF',
  'Part 2': '#0A8C5A',
  'Part 3': '#B07A10',
  'Full Test': '#C04A06',
};

type Session = {
  id: string;
  part: string;
  band_score: number | null;
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

function formatDuration(secs: number | null): string {
  if (!secs) return '';
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

export function SpeakingSidebar() {
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
      supabase.from('speaking_sessions')
        .select('id, part, band_score, topic, duration_seconds, created_at')
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
      const scores = data.map(s => s.band_score).filter((s): s is number => s !== null);
      if (scores.length > 0) setBestScore(Math.max(...scores));
    }

    if (profileRes.data) {
      setUserName((profileRes.data as any).name ?? '');
      const tier = (profileRes.data as any).subscription_tier;
      if (tier === 'pro' || tier === 'elite') setUserPlan(tier);
    }
  }

  const PARTS = [
    { key: 'Part 1',   label: 'Part 1 — Interview' },
    { key: 'Part 2',   label: 'Part 2 — Cue Card'  },
    { key: 'Part 3',   label: 'Part 3 — Discussion' },
    { key: 'Full Test',label: 'Full Test — All Parts'},
  ];

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
        <Text style={s.title}>Speaking</Text>
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
          {PARTS.map(p => (
            <TouchableOpacity
              key={p.key}
              style={s.sessionBtn}
              onPress={() => router.push({
                pathname: '/modules/speaking/session' as any,
                params: { part: p.key, languageCode: code, code },
              })}
              activeOpacity={0.8}
            >
              <MicIcon size={13} color={PURPLE} />
              <Text style={s.sessionBtnText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* HISTORY */}
        <Text style={[s.sectionLabel, { marginTop: 14 }]}>HISTORY</Text>
        <View style={s.group}>
          {sessions.length === 0 ? (
            <Text style={s.emptyText}>No speaking sessions yet</Text>
          ) : (
            sessions.map(sess => (
              <View key={sess.id} style={s.histRow}>
                <View style={[s.histDot, { backgroundColor: PART_COLORS[sess.part] ?? PURPLE }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.histPart} numberOfLines={1}>
                    {sess.part}{sess.topic ? ` · ${sess.topic.slice(0, 16)}…` : ''}
                  </Text>
                  <Text style={s.histDate}>{formatDate(sess.created_at)}</Text>
                </View>
                <View style={s.histRight}>
                  {sess.band_score != null && (
                    <Text style={s.histScore}>{sess.band_score.toFixed(1)}</Text>
                  )}
                  {sess.duration_seconds != null && (
                    <Text style={s.histDur}>{formatDuration(sess.duration_seconds)}</Text>
                  )}
                </View>
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
              <Text style={s.bestNum}>{bestScore.toFixed(1)}</Text>
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
  group: { paddingHorizontal: 8, gap: 5 },

  sessionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 9,
    backgroundColor: PURPLE_BG, borderWidth: 1, borderColor: PURPLE_BDR,
    borderRadius: 10, paddingVertical: 9, paddingHorizontal: 12,
  },
  sessionBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: PURPLE },

  histRow:  { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 4, paddingVertical: 5 },
  histDot:  { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  histPart: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#666' },
  histDate: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#BBB', marginTop: 1 },
  histRight:{ alignItems: 'flex-end' },
  histScore:{ fontFamily: 'Inter_700Bold', fontSize: 12, color: PURPLE },
  histDur:  { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#BBB', marginTop: 1 },
  emptyText:{ fontFamily: 'Inter_400Regular', fontSize: 12, color: '#BBB', paddingHorizontal: 4, paddingVertical: 8 },

  bestCard: {
    marginHorizontal: 8, borderRadius: 10,
    backgroundColor: PURPLE_BG, padding: 12, alignItems: 'center', gap: 2,
  },
  bestLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, color: PURPLE, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  bestNum:   { fontFamily: 'Inter_700Bold', fontSize: 24, color: PURPLE },

  userMenuWrap: { borderTopWidth: 1, borderTopColor: '#EAEAEA', padding: 8 },
});
