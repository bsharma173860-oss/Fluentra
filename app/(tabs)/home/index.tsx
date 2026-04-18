import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import Svg, { Defs, Pattern, Circle, Rect, Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { Storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import { getTheme } from '@/constants/languageThemes';
import { FlagSVG } from '@/components/flags';
import { FluentraLogo } from '@/components/FluentraLogo';
import { AppLayout } from '@/components/layout/AppLayout';
import { AddLanguageModal } from '@/components/ui/AddLanguageModal';
import type { UserLanguage, AppSession } from '@/lib/supabase';

// ── SVG icons (no emoji) ──────────────────────────────────────────
function MicSVG({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Rect x="9" y="2" width="6" height="12" rx="3" stroke={color} strokeWidth="1.8" />
      <Path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M12 19v3M9 22h6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
function PenSVG({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
function HeadphoneSVG({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path d="M3 18v-6a9 9 0 0 1 18 0v6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3v5zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3v5z" stroke={color} strokeWidth="1.8" />
    </Svg>
  );
}
function BookSVG({ color }: { color: string }) {
  return (
    <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}
function PlusSVG({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────
function fluencyToLevel(pct: number): string {
  if (pct >= 95) return 'C2';
  if (pct >= 80) return 'C1';
  if (pct >= 60) return 'B2';
  if (pct >= 40) return 'B1';
  if (pct >= 20) return 'A2';
  return 'A1';
}

function dayOfWeekStr(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  }).toUpperCase();
}

function greetingText(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatActivityDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(start: string, end: string | null): string {
  if (!end) return '';
  const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  if (mins < 1) return '';
  return `${mins} min`;
}

// ── Exam badge color map ──────────────────────────────────────────
const EXAM_BADGE: Record<string, { bg: string; color: string }> = {
  ielts: { bg: '#EEEEFF', color: '#3C3489' },
  toefl: { bg: '#EEF4FF', color: '#0A3D7A' },
  dele:  { bg: '#FFF0EE', color: '#8A3200' },
  delf:  { bg: '#EEF4FF', color: '#0A3D7A' },
  dsh:   { bg: '#F0F0F5', color: '#2D3748' },
  jlpt:  { bg: '#FFF0F5', color: '#8A1A44' },
  topik: { bg: '#EDFAFA', color: '#065C6A' },
};

// ── Activity icon map ─────────────────────────────────────────────
const ACTIVITY_STYLE: Record<string, { iconBg: string; iconColor: string; Icon: typeof MicSVG }> = {
  speaking:  { iconBg: '#F0EEFF', iconColor: '#5B4EFF', Icon: MicSVG },
  writing:   { iconBg: '#FEF9EC', iconColor: '#B07A10', Icon: PenSVG },
  listening: { iconBg: '#EDFAF4', iconColor: '#0A8C5A', Icon: HeadphoneSVG },
  reading:   { iconBg: '#FFF3ED', iconColor: '#C04A06', Icon: BookSVG },
};

// ── useRecentSessions ─────────────────────────────────────────────
function useRecentSessions() {
  const [sessions, setSessions] = useState<AppSession[]>([]);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(3);
      if (data && data.length > 0) setSessions(data as AppSession[]);
    })();
  }, []);

  return sessions;
}

// ── Dot pattern overlay ───────────────────────────────────────────
function DotPattern({ accent }: { accent: string }) {
  const id = `dp-${accent.replace('#', '')}`;
  return (
    <Svg
      width="100%"
      height="96"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <Defs>
        <Pattern id={id} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <Circle cx="10" cy="10" r="1.5" fill={accent} opacity="0.14" />
        </Pattern>
      </Defs>
      <Rect width="100%" height="96" fill={`url(#${id})`} />
    </Svg>
  );
}

// ── Language card ─────────────────────────────────────────────────
function LanguageCard({
  lang, cardWidth,
}: { lang: UserLanguage; cardWidth: number }) {
  const code    = lang.language_code;
  const theme   = getTheme(code);
  const exams   = LANGUAGE_EXAMS[code] ?? [];
  const streak  = Math.round(lang.fluency_percent / 2.5);
  const level   = fluencyToLevel(lang.fluency_percent);

  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[s.card, { width: cardWidth }, hovered && s.cardHover] as any}
      onPress={() => router.push(`/language/${code}` as any)}
      activeOpacity={0.88}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } : {})}
    >
      {/* ── Card top ── */}
      <View style={[s.cardTop, { backgroundColor: theme.bg }]}>
        <DotPattern accent={theme.accent} />
        <View style={s.flagWrap}>
          <FlagSVG code={code} width={60} height={40} />
        </View>
      </View>

      {/* ── Card body ── */}
      <View style={s.cardBody}>
        <Text style={s.cardNative}>{theme.native}</Text>
        {theme.native !== theme.name && (
          <Text style={s.cardEn}>{theme.name}</Text>
        )}

        {exams.length > 0 && (
          <View style={s.examRow}>
            {exams.slice(0, 3).map(e => {
              const badge = EXAM_BADGE[e.id.toLowerCase()] ?? { bg: '#F2F2F2', color: '#666' };
              return (
                <View key={e.id} style={[s.examBadge, { backgroundColor: badge.bg }]}>
                  <Text style={[s.examBadgeText, { color: badge.color }]}>
                    {e.id.toUpperCase()}
                  </Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={s.cardFooter}>
          <View style={s.streakRow}>
            <View style={[s.dot, { backgroundColor: streak > 0 ? theme.accent : '#CCC' }]} />
            <Text
              style={[s.streakText, { color: streak > 0 ? theme.accent : '#BBB' }]}
            >
              {streak > 0 ? `Day ${streak}` : 'Start'}
            </Text>
          </View>
          <View style={s.levelBadge}>
            <Text style={s.levelText}>{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Add language card ─────────────────────────────────────────────
function AddCard({ onPress, cardWidth }: { onPress: () => void; cardWidth: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[s.addCard, { width: cardWidth }, hovered && s.addCardHover]}
      onPress={onPress}
      activeOpacity={0.75}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } : {})}
    >
      <View style={[s.addCircle, hovered && s.addCircleHover]}>
        <PlusSVG color={hovered ? '#888' : '#CCC'} size={14} />
      </View>
      <Text style={[s.addTitle, hovered && s.addTitleHover]}>Add a language</Text>
      <Text style={[s.addSub, hovered && s.addSubHover]}>+1 new per year</Text>
    </TouchableOpacity>
  );
}

// ── Activity card ─────────────────────────────────────────────────
function ActivityCard({ session }: { session: AppSession }) {
  const style = ACTIVITY_STYLE[session.mode] ?? ACTIVITY_STYLE.speaking;
  const theme = getTheme(session.language_code);
  const { Icon } = style;
  const [hovered, setHovered] = useState(false);

  const title = `${session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}${session.exam_type ? ` · ${session.exam_type.toUpperCase()}` : ''}`;
  const dateStr = formatActivityDate(session.completed_at ?? session.started_at);
  const dur     = formatDuration(session.started_at, session.completed_at);
  const sub     = [theme.name, dateStr, dur].filter(Boolean).join(' · ');

  return (
    <TouchableOpacity
      style={[ac.card, hovered && ac.cardHover]}
      activeOpacity={0.85}
      onPress={() => router.push('/(tabs)/progress' as any)}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } : {})}
    >
      <View style={[ac.iconBox, { backgroundColor: style.iconBg }]}>
        <Icon color={style.iconColor} />
      </View>
      <View style={ac.meta}>
        <Text style={ac.title}>{title}</Text>
        <Text style={ac.sub}>{sub}</Text>
      </View>
      {session.overall_band != null && (
        <Text style={[ac.score, { color: style.iconColor }]}>
          {session.overall_band.toFixed(1)}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const ac = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA',
    padding: 14,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  cardHover: { borderColor: '#999999' },
  iconBox:   { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  meta:      { flex: 1 },
  title:     { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000000' },
  sub:       { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999999', marginTop: 2 },
  score:     { fontFamily: 'Inter_700Bold', fontSize: 15 },
});


// ── HomeScreen ────────────────────────────────────────────────────
// Module-level flag — redirect only once per JS session, not on every home visit
let _didRedirectToLastLang = false;

export default function HomeScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const { profile, user }      = useAuth();
  const displayName            = profile?.name ?? '';
  const initial                = displayName ? displayName[0].toUpperCase() : '?';
  const isDesktop              = Platform.OS === 'web' && screenWidth >= 1024;

  const [languages,  setLanguages]  = useState<UserLanguage[]>([]);
  const [showModal,  setShowModal]  = useState(false);
  const recentSessions = useRecentSessions();

  // ── Fetch languages ──
  const fetchLanguages = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    const { data, error } = await supabase
      .from('user_languages')
      .select('*')
      .eq('user_id', u.id)
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: true });
    console.log('[HomeScreen] fetchLanguages:', data?.length ?? 0, error?.message);
    if (data) setLanguages(data as UserLanguage[]);
  }, []);

  // Refetch on every screen focus (handles returning from language page)
  useFocusEffect(
    useCallback(() => { fetchLanguages(); }, [fetchLanguages])
  );

  // Realtime subscription for instant updates
  useEffect(() => {
    const channel = supabase
      .channel('home-user-languages')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'user_languages',
      }, () => fetchLanguages())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchLanguages]);

  // On first load, jump to the last language the user was in
  useEffect(() => {
    if (_didRedirectToLastLang) return;
    _didRedirectToLastLang = true;
    Storage.get('lastActiveLanguage').then(code => {
      if (code) router.replace(`/language/${code}` as any);
    });
  }, []);

  // Card sizing
  const horizPad  = isDesktop ? 36 * 2 : 20 * 2;
  const sidebarW  = isDesktop ? 240 : 0;
  const available = screenWidth - sidebarW - horizPad;
  const numCols   = available >= 900 ? 4 : available >= 580 ? 2 : 1;
  const cardWidth = Math.floor((available - 14 * (numCols - 1)) / numCols);
  const pad       = isDesktop ? 36 : 20;

  return (
    <AppLayout>
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Mobile top bar */}
      {!isDesktop && (
        <View style={s.topBar}>
          <FluentraLogo iconSize={28} textSize={17} />
          <TouchableOpacity style={s.avatar} onPress={() => router.push('/(tabs)/settings' as any)}>
            <Text style={s.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingHorizontal: pad }]}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.dateLabel}>{dayOfWeekStr()}</Text>
          <Text style={s.greeting}>
            {greetingText()}{displayName ? `, ${displayName}` : ''}.
          </Text>
        </View>

        {/* ── Languages ── */}
        <Text style={s.sectionLabel}>YOUR LANGUAGES</Text>
        <View style={s.grid}>
          {languages.map(lang => (
            <LanguageCard key={lang.id} lang={lang} cardWidth={cardWidth} />
          ))}
          <AddCard onPress={() => setShowModal(true)} cardWidth={cardWidth} />
        </View>

        {/* ── Recent activity ── */}
        {recentSessions.length > 0 && (
          <View style={{ marginTop: 32 }}>
            <Text style={s.sectionLabel}>RECENT ACTIVITY</Text>
            <View style={s.activityGrid}>
              {recentSessions.map(sess => (
                <ActivityCard key={sess.id} session={sess} />
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>

      <AddLanguageModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        existingCodes={languages.map(l => l.language_code)}
        totalCount={languages.length}
        onLanguageAdded={fetchLanguages}
      />
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F7F7F5' },
  scroll: { paddingTop: 32, paddingBottom: 48 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
  },
  avatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: '#5B4EFF', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: '#FFF' },

  header: { marginBottom: 28 },
  dateLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize:   11,
    color:      '#BBBBBB',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  greeting: {
    fontFamily:    'Inter_700Bold',
    fontSize:      28,
    color:         '#000000',
    letterSpacing: -0.5,
  },

  sectionLabel: {
    fontFamily:    'Inter_600SemiBold',
    fontSize:      11,
    color:         '#999999',
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
    marginBottom:  14,
  },

  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           14,
  },

  activityGrid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
  },

  // Language card
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     '#EAEAEA',
    overflow:        'hidden',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 150ms ease',
    } as any : {}),
  },
  cardHover: {
    borderColor: '#666666',
    ...(Platform.OS === 'web' ? {
      transform: [{ translateY: -2 }],
      boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
    } as any : {}),
  },

  cardTop: {
    height:         96,
    alignItems:     'center',
    justifyContent: 'center',
    overflow:       'hidden',
  },
  flagWrap: {
    borderRadius: 8,
    overflow:     'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
    } as any : {
      shadowColor: '#000', shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 3 }, shadowRadius: 6,
    }),
  },

  cardBody: { padding: 14, paddingTop: 14, paddingBottom: 16 },
  cardNative: {
    fontFamily: 'Inter_700Bold',
    fontSize:   16,
    color:      '#000000',
  },
  cardEn: {
    fontFamily: 'Inter_400Regular',
    fontSize:   11,
    color:      '#999999',
    marginTop:  1,
  },

  examRow:       { flexDirection: 'row', gap: 4, marginTop: 8, marginBottom: 12, flexWrap: 'wrap' },
  examBadge:     { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  examBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 9 },

  cardFooter: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1, borderTopColor: '#F4F4F4',
    paddingTop: 10,
  },
  streakRow:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:        { width: 7, height: 7, borderRadius: 3.5 },
  streakText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  levelBadge: { backgroundColor: '#F4F4F4', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  levelText:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888888' },

  // Add card
  addCard: {
    borderWidth:  1.5,
    borderStyle:  'dashed' as const,
    borderColor:  '#DCDCDC',
    borderRadius: 16,
    minHeight:    208,
    alignItems:   'center',
    justifyContent: 'center',
    gap:          7,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? {
      cursor: 'pointer',
      transition: 'all 150ms ease',
    } as any : {}),
  },
  addCardHover: { borderColor: '#999999', backgroundColor: '#FAFAFA' },
  addCircle: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: '#DCDCDC',
    alignItems: 'center', justifyContent: 'center',
  },
  addCircleHover: { borderColor: '#999' },
  addTitle:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#BBBBBB' },
  addTitleHover:  { color: '#555' },
  addSub:         { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#DDDDDD' },
  addSubHover:    { color: '#AAA' },
});
