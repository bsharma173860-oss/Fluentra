import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
} from 'react-native';
import { router, usePathname } from 'expo-router';
import { supabase, type AppSession } from '@/lib/supabase';
import { getTheme } from '@/constants/languageThemes';
import { FlagSVG } from '@/components/flags';
import {
  HomeIcon, ChevronLeftIcon, MicIcon, PenIcon, HeadphoneIcon,
  BookIcon, TrophyIcon, MessageCircleIcon, FlameIcon, CheckIcon,
} from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';

const STREAK_TARGET = 40;

const PRACTICE_NAV = [
  { id: 'speaking',  label: 'Speaking',      Icon: MicIcon           },
  { id: 'writing',   label: 'Writing',       Icon: PenIcon           },
  { id: 'listening', label: 'Listening',     Icon: HeadphoneIcon     },
  { id: 'reading',   label: 'Reading',       Icon: BookIcon          },
  { id: 'exam',      label: 'Practice Exam', Icon: TrophyIcon        },
  { id: 'tutor',     label: 'AI Tutor',      Icon: MessageCircleIcon },
];

const MODULE_ROUTES: Record<string, string> = {
  speaking:  '/modules/speaking/select',
  writing:   '/modules/writing/select',
  listening: '/modules/listening/select',
  reading:   '/modules/reading/select',
};

const MODULE_COLOR: Record<string, string> = {
  speaking:  '#5B4EFF',
  writing:   '#B07A10',
  listening: '#0A8C5A',
  reading:   '#C04A06',
};

function formatSessionDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d    = new Date(dateStr);
  const days = Math.floor((Date.now() - d.getTime()) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7)  return `${days}d ago`;
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

// ── Component ─────────────────────────────────────────────────────
export function LanguageSidebar({ code }: { code: string }) {
  const pathname = usePathname();
  const theme    = getTheme(code);

  const [streak,   setStreak]   = useState(0);
  const [sessions, setSessions] = useState<AppSession[]>([]);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPlan, setUserPlan] = useState<'free' | 'pro' | 'elite'>('free');

  useEffect(() => { loadData(); }, [code]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUserEmail(user.email ?? '');

    const [langRes, sessRes, profileRes] = await Promise.all([
      supabase.from('user_languages')
        .select('streak_count')
        .eq('user_id', user.id)
        .eq('language_code', code)
        .maybeSingle(),
      supabase.from('app_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('language_code', code)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5),
      supabase.from('profiles')
        .select('name, subscription_tier')
        .eq('id', user.id)
        .maybeSingle(),
    ]);

    if (langRes.data)    setStreak((langRes.data as any).streak_count ?? 0);
    if (sessRes.data)    setSessions(sessRes.data as AppSession[]);
    if (profileRes.data) {
      setUserName((profileRes.data as any).name ?? '');
      const tier = (profileRes.data as any).subscription_tier;
      if (tier === 'pro' || tier === 'elite') setUserPlan(tier);
    }
  }

  const streakPct    = Math.min(streak / STREAK_TARGET, 1);
  const examUnlocked = streak >= STREAK_TARGET;

  function isActive(moduleId: string) {
    return pathname.includes(`/language/${code}/${moduleId}`) ||
           pathname.includes(`/modules/${moduleId}`);
  }

  function navigate(moduleId: string) {
    const route = MODULE_ROUTES[moduleId] ?? `/language/${code}/${moduleId}`;
    router.push({ pathname: route as any, params: { languageCode: code, code } });
  }

  return (
    <View style={s.sidebar}>

      {/* ── Home button ── */}
      <TouchableOpacity
        style={s.homeBtn}
        onPress={() => router.push('/(tabs)/home')}
        activeOpacity={0.7}
      >
        <HomeIcon size={14} color="#888" />
        <Text style={s.homeBtnText}>Home</Text>
      </TouchableOpacity>

      {/* ── Language row: flag + name + streak pill ── */}
      <View style={s.top}>
        <View style={s.langRow}>
          <FlagSVG code={code} width={22} height={15} />
          <Text style={s.langName} numberOfLines={1}>{theme.name}</Text>
        </View>
        <View style={[s.streakPill, { backgroundColor: theme.accentLight }]}>
          <FlameIcon size={10} color={theme.accent} />
          <Text style={[s.streakPillText, { color: theme.accent }]}>
            {streak > 0 ? `Day ${streak}` : 'Start'}
          </Text>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

        {/* PRACTICE */}
        <Text style={s.sectionLabel}>PRACTICE</Text>
        <View style={s.group}>
          {PRACTICE_NAV.map(({ id, label, Icon }) => {
            const active   = isActive(id);
            const dotColor = MODULE_COLOR[id] ?? theme.accent;
            return (
              <TouchableOpacity
                key={id}
                style={[s.navItem, active && s.navItemActive]}
                onPress={() => navigate(id)}
                activeOpacity={0.7}
              >
                <View style={[s.navIconBox, { backgroundColor: active ? dotColor + '22' : '#F4F4F0' }]}>
                  <Icon size={13} color={active ? dotColor : '#888'} />
                </View>
                <Text style={[s.navLabel, active && { color: dotColor, fontFamily: 'Inter_600SemiBold' }]}>
                  {label}
                </Text>
                {active && <View style={[s.activeDot, { backgroundColor: dotColor }]} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RECENT */}
        {sessions.length > 0 && (
          <>
            <Text style={[s.sectionLabel, { marginTop: 14 }]}>RECENT</Text>
            <View style={s.group}>
              {sessions.map(sess => (
                <View key={sess.id} style={s.recentRow}>
                  <View style={[s.recentDot, { backgroundColor: MODULE_COLOR[sess.mode] ?? theme.accent }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.recentTitle} numberOfLines={1}>
                      {sess.mode.charAt(0).toUpperCase() + sess.mode.slice(1)}
                    </Text>
                    <Text style={s.recentDate}>{formatSessionDate(sess.completed_at)}</Text>
                  </View>
                  {sess.overall_band != null && (
                    <Text style={[s.recentScore, { color: theme.accent }]}>{sess.overall_band}</Text>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* EXAM */}
        <Text style={[s.sectionLabel, { marginTop: 14 }]}>EXAM</Text>
        <View style={s.group}>
          <View style={[s.examCard, { backgroundColor: theme.accentLight }]}>
            <View style={s.examRow}>
              <Text style={s.examLabel}>Monthly Exam</Text>
              <View style={[s.examBadge, { backgroundColor: examUnlocked ? '#EDFAF4' : '#F4F4F4' }]}>
                {examUnlocked && <CheckIcon size={10} color="#16A34A" strokeWidth={2.5} />}
                <Text style={[s.examBadgeText, { color: examUnlocked ? '#16A34A' : '#888' }]}>
                  {examUnlocked ? 'Unlocked' : 'Locked'}
                </Text>
              </View>
            </View>
            <View style={s.examTrack}>
              <View style={[s.examFill, { width: `${streakPct * 100}%` as any, backgroundColor: theme.accent }]} />
            </View>
            <Text style={[s.examHint, { color: theme.accent }]}>{streak}/{STREAK_TARGET} streak days</Text>
          </View>
        </View>

        {/* Streak mini-card */}
        <View style={s.streakCard}>
          <FlameIcon size={15} color={theme.accent} />
          <View style={{ flex: 1 }}>
            <Text style={[s.streakNum, { color: theme.accent }]}>{streak} days</Text>
            <View style={s.miniTrack}>
              <View style={[s.miniFill, { width: `${streakPct * 100}%` as any, backgroundColor: theme.accent }]} />
            </View>
          </View>
          <Text style={s.streakDen}>/{STREAK_TARGET}</Text>
        </View>

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

// ── Styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  sidebar: {
    width: 220, backgroundColor: '#FFFFFF',
    borderRightWidth: 1, borderRightColor: '#EAEAEA',
    flexDirection: 'column', flexShrink: 0,
  },

  homeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  homeBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#888' },

  top: {
    paddingHorizontal: 12, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  langRow:      { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 },
  langName:     { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#000', flex: 1 },
  streakPill:   { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 10 },
  streakPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  scroll: { flex: 1 },

  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
    paddingHorizontal: 12, paddingTop: 14, paddingBottom: 5,
  },
  group: { paddingHorizontal: 8, gap: 1 },

  navItem:     { flexDirection: 'row', alignItems: 'center', height: 32, borderRadius: 6, paddingHorizontal: 8, gap: 8 },
  navItemActive: { backgroundColor: '#F9F8F5' },
  navIconBox:  { width: 22, height: 22, borderRadius: 5, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  navLabel:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666', flex: 1 },
  activeDot:   { width: 5, height: 5, borderRadius: 2.5 },

  recentRow:   { flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12, paddingVertical: 6 },
  recentDot:   { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  recentTitle: { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#444' },
  recentDate:  { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#BBB', marginTop: 1 },
  recentScore: { fontFamily: 'Inter_700Bold', fontSize: 11 },

  examCard:      { marginHorizontal: 8, borderRadius: 8, padding: 10, gap: 6 },
  examRow:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  examLabel:     { fontFamily: 'Inter_500Medium', fontSize: 12, color: '#444' },
  examBadge:     { flexDirection: 'row', alignItems: 'center', gap: 3, borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  examBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  examTrack:     { height: 3, backgroundColor: 'rgba(0,0,0,0.08)', borderRadius: 2, overflow: 'hidden' },
  examFill:      { height: '100%', borderRadius: 2 },
  examHint:      { fontFamily: 'Inter_400Regular', fontSize: 10 },

  streakCard: {
    marginHorizontal: 8, marginTop: 10,
    borderWidth: 1, borderColor: '#F0F0F0', borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },
  streakNum:  { fontFamily: 'Inter_700Bold', fontSize: 12 },
  miniTrack:  { height: 3, backgroundColor: '#F4F4F0', borderRadius: 2, overflow: 'hidden', marginTop: 4 },
  miniFill:   { height: '100%', borderRadius: 2 },
  streakDen:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#BBB' },

  userMenuWrap: {
    borderTopWidth: 1, borderTopColor: '#EAEAEA', padding: 8,
  },
});
