import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { T } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { FlagSVG } from '@/components/flags';
import { getTheme } from '@/constants/languageThemes';
import type { UserLanguage } from '@/lib/supabase';

function cefrFor(pct: number) {
  if (pct < 25)  return 'B1 · Intermediate';
  if (pct < 50) return 'B2 · Upper-int.';
  if (pct < 75) return 'C1 · Advanced';
  return 'C2 · Mastery';
}

// ── Gradient language card ────────────────────────────────────────
function LangCard({ lang }: { lang: UserLanguage }) {
  const theme = getTheme(lang.language_code);
  const pct = Math.min((lang.fluency_percent / 9) * 100, 100);
  const circumference = Math.PI * 2 * 30;

  return (
    <TouchableOpacity
      style={[s.langCard, { backgroundColor: theme.accent }]}
      onPress={() => router.push(`/language/${lang.language_code}` as any)}
      activeOpacity={0.9}
    >
      {/* Hero section */}
      <View style={[s.langHero, { backgroundColor: theme.accent }]}>
        <View style={s.langHeroRow}>
          <View style={s.flagWrap}>
            <FlagSVG code={lang.language_code} width={48} height={32} />
          </View>
          <View style={s.streakBadge}>
            <Text style={s.streakBadgeText}>🔥 {Math.round(lang.fluency_percent)}%</Text>
          </View>
        </View>
        <Text style={s.langNative}>{lang.language_name_en || lang.language_code.toUpperCase()}</Text>
        <Text style={s.langEnglish}>{lang.language_code.toUpperCase()} · {cefrFor(lang.fluency_percent)}</Text>
      </View>

      {/* Sheet */}
      <View style={s.langSheet}>
        {/* Ring */}
        <View style={{ width: 80, height: 80, position: 'relative' }}>
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[s.ringNum, { color: T.ink }]}>{Math.round(lang.fluency_percent)}%</Text>
            <Text style={s.ringLabel}>Fluency</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
            <View style={[s.chip, { backgroundColor: theme.accentLight }]}>
              <Text style={[s.chipText, { color: theme.accent }]}>IELTS</Text>
            </View>
          </View>
          <Text style={s.nextUpLabel}>Next up</Text>
          <Text style={s.nextUpTitle}>Practice session</Text>
          <Text style={s.nextUpMeta}>10 min</Text>
          <TouchableOpacity style={[s.continueBtn, { borderColor: theme.accent }]} onPress={() => router.push(`/language/${lang.language_code}` as any)}>
            <Text style={[s.continueBtnText, { color: theme.accent }]}>Continue →</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Today hero banner ──────────────────────────────────────────────
function TodayHero({ lang, streak }: { lang: UserLanguage | null; streak: number }) {
  if (!lang) return null;
  const theme = getTheme(lang.language_code);

  if (streak >= 9) {
    return (
      <TouchableOpacity style={s.unlockBanner} onPress={() => router.push('/modules/reading/session' as any)} activeOpacity={0.9}>
        <View style={s.unlockIcon}><Text style={{ fontSize: 22 }}>🎉</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.unlockEyebrow}>STREAK MILESTONE UNLOCKED</Text>
          <Text style={s.unlockTitle}>Your exam is ready.</Text>
          <Text style={s.unlockMeta}>{streak}-day streak · take it any time</Text>
        </View>
        <View style={s.unlockCta}><Text style={[s.unlockCtaText, { color: T.brand }]}>Open exam →</Text></View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[s.heroBanner, { shadowColor: theme.accent }]} onPress={() => router.push('/(tabs)/practice' as any)} activeOpacity={0.9}>
      <View style={[s.heroIcon, { backgroundColor: theme.accent }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>▶</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.heroEyebrow}>YOUR 15 MINUTES TODAY</Text>
        <Text style={s.heroTitle}>Practice session</Text>
        <Text style={s.heroMeta}>{lang.language_code.toUpperCase()} · Grammar · 15 min</Text>
      </View>
      <View style={[s.heroCta, { backgroundColor: theme.accent }]}>
        <Text style={s.heroCtaText}>Start →</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── Week strip ────────────────────────────────────────────────────
function WeekStrip() {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const dayOfWeek = new Date().getDay();
  const todayIdx = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  return (
    <View style={s.weekCard}>
      <View style={s.weekHeader}>
        <View style={s.weekFlame}><Text>🔥</Text></View>
        <Text style={s.weekTitle}>This week</Text>
      </View>
      <View style={s.weekGrid}>
        {days.map((d, i) => {
          const done = i < todayIdx;
          const today = i === todayIdx;
          return (
            <View key={i} style={s.weekCell}>
              <View style={[s.weekDot, done && s.weekDotDone, today && s.weekDotToday]}>
                <Text style={[s.weekDotText, done && { color: '#fff' }, today && { color: T.brand }]}>
                  {done ? '✓' : i + 1}
                </Text>
              </View>
              <Text style={[s.weekDay, today && { color: T.brand, fontWeight: '700' }]}>{d}</Text>
            </View>
          );
        })}
      </View>
      <Text style={s.weekFooter}>Keep your streak going!</Text>
    </View>
  );
}

// ── Quick links ───────────────────────────────────────────────────
const QUICK_LINKS = [
  { label: 'Progress',  route: '/(tabs)/progress' },
  { label: 'Library',   route: '/library' },
  { label: 'Exams',     route: '/(tabs)/exams' },
  { label: 'Settings',  route: '/(tabs)/settings' },
  { label: 'Upgrade',   route: '/upgrade' },
  { label: 'Help',      route: '/help' },
];

// ── Main screen ───────────────────────────────────────────────────
export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const { user, profile } = useAuth();
  const [languages, setLanguages] = useState<UserLanguage[]>([]);
  const [loading, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'there';
  const longestStreak = languages.length ? Math.max(...languages.map(l => l.fluency_percent)) : 0;

  const fetchLanguages = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_languages')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order', { ascending: true });
    setLanguages((data as UserLanguage[]) || []);
    setLoading(false);
  }, [user]);

  useFocusEffect(useCallback(() => { fetchLanguages(); }, [fetchLanguages]));

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={[s.scroll, isDesktop && s.scrollDesktop]} showsVerticalScrollIndicator={false}>
      {/* Page header */}
      <View style={s.pageHeader}>
        <View style={{ flex: 1 }}>
          <Text style={s.eyebrow}>{greet}, {firstName}</Text>
          <Text style={s.pageTitle}>Keep the streaks alive.</Text>
        </View>
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statLabel}>STREAK</Text>
            <Text style={s.statNum}>{longestStreak} <Text style={s.statUnit}>days</Text></Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.stat}>
            <Text style={s.statLabel}>LANGUAGES</Text>
            <Text style={s.statNum}>{languages.length}</Text>
          </View>
        </View>
      </View>

      {/* Today hero */}
      <TodayHero lang={languages[0] || null} streak={longestStreak} />

      {/* Languages grid */}
      <View style={s.sectionHeader}>
        <Text style={s.sectionTitle}>Your languages</Text>
        <TouchableOpacity onPress={() => router.push('/language/add' as any)} style={s.addBtn}>
          <Text style={s.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {isDesktop ? (
        <View style={s.langGrid}>
          {languages.map(l => <LangCard key={l.id} lang={l} />)}
        </View>
      ) : (
        <View style={s.langStack}>
          {languages.map(l => <LangCard key={l.id} lang={l} />)}
        </View>
      )}

      {loading && languages.length === 0 && (
        <View style={s.emptyState}>
          <Text style={s.emptyText}>Add a language to get started</Text>
          <TouchableOpacity style={s.emptyBtn} onPress={() => router.push('/language/add' as any)}>
            <Text style={s.emptyBtnText}>Add your first language</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Aside panel — desktop: right column; mobile: below */}
      <View style={[isDesktop && s.asideRow]}>
        <View style={[isDesktop && { flex: 1 }]}>
          <WeekStrip />
        </View>
        {isDesktop && <View style={{ flex: 1 }}>
          {/* Friends today panel */}
          <View style={s.friendsCard}>
            <Text style={s.friendsTitle}>FRIENDS TODAY</Text>
            {[
              { name: 'Liam', avatar: 'L', color: '#7B4BC4', mins: 22, action: 'practiced French' },
              { name: 'Yui',  avatar: 'Y', color: '#1F8A5B', mins: 18, action: 'finished a mock' },
              { name: 'Anna', avatar: 'A', color: '#D97757', mins: 14, action: '31-day streak!' },
            ].map((f, i, all) => (
              <View key={f.name} style={[s.friendRow, i < all.length - 1 && { borderBottomWidth: 1, borderBottomColor: T.hairline }]}>
                <View style={[s.friendAvatar, { backgroundColor: f.color }]}>
                  <Text style={s.friendAvatarText}>{f.avatar}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.friendName}><Text style={{ fontWeight: '700' }}>{f.name}</Text> {f.action}</Text>
                  <Text style={s.friendMeta}>{f.mins} min · today</Text>
                </View>
              </View>
            ))}
          </View>
        </View>}
      </View>

      {/* Tutor CTA */}
      <TouchableOpacity style={s.tutorCard} onPress={() => router.push('/language/en/tutor' as any)} activeOpacity={0.9}>
        <View style={s.tutorIcon}><Text style={{ fontSize: 18 }}>💬</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.tutorTitle}>Ask the AI tutor</Text>
          <Text style={s.tutorSub}>Grammar, vocab, conversation</Text>
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16 }}>→</Text>
      </TouchableOpacity>

      {/* Quick links */}
      <View style={s.quickLinksCard}>
        <Text style={s.quickLinksTitle}>QUICK LINKS</Text>
        <View style={s.quickLinksGrid}>
          {QUICK_LINKS.map(q => (
            <TouchableOpacity key={q.label} style={s.quickLink} onPress={() => router.push(q.route as any)}>
              <Text style={s.quickLinkText}>{q.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {!isDesktop && <View style={{ height: 20 }} />}
    </ScrollView>
  );

  if (isDesktop) {
    return (
      <AppLayout>
        {content}
      </AppLayout>
    );
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {content}
      <MobileTabBar />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { padding: 18, gap: 18, paddingBottom: 20 },
  scrollDesktop: { padding: 28, paddingHorizontal: 36, maxWidth: 1200, alignSelf: 'center', width: '100%' },

  pageHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, marginBottom: 4 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: T.ink4, letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 },
  pageTitle: { fontFamily: T.serif, fontSize: 34, color: T.ink, lineHeight: 38 },

  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stat: { alignItems: 'flex-end' },
  statLabel: { fontSize: 9, fontWeight: '700', color: T.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 2 },
  statNum: { fontFamily: T.serif, fontSize: 28, color: T.ink, lineHeight: 32 },
  statUnit: { fontSize: 16, color: T.ink4 },
  statDivider: { width: 1, height: 40, backgroundColor: T.border },

  // Hero banners
  heroBanner: {
    backgroundColor: T.ink,
    borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 40,
  },
  heroIcon: { width: 54, height: 54, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  heroEyebrow: { fontSize: 9.5, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 },
  heroTitle: { fontFamily: T.serif, fontSize: 20, color: '#fff', lineHeight: 24, marginBottom: 3 },
  heroMeta: { fontSize: 11.5, color: 'rgba(255,255,255,0.7)' },
  heroCta: { borderRadius: 11, paddingHorizontal: 16, paddingVertical: 12 },
  heroCtaText: { color: '#fff', fontSize: 13, fontWeight: '700' },

  unlockBanner: {
    borderRadius: 18, padding: 20,
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: T.brand,
    shadowColor: T.brand, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.4, shadowRadius: 30,
  },
  unlockIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  unlockEyebrow: { fontSize: 9.5, fontWeight: '700', color: 'rgba(255,255,255,0.85)', letterSpacing: 1.4, textTransform: 'uppercase', marginBottom: 4 },
  unlockTitle: { fontFamily: T.serif, fontSize: 20, color: '#fff', lineHeight: 24 },
  unlockMeta: { fontSize: 11.5, color: 'rgba(255,255,255,0.85)' },
  unlockCta: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
  unlockCtaText: { fontSize: 12.5, fontWeight: '700' },

  // Section
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  addBtn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: T.card, borderWidth: 1, borderColor: T.border, borderRadius: 9 },
  addBtnText: { fontSize: 12, fontWeight: '600', color: T.ink2 },

  // Lang cards
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 18 },
  langStack: { gap: 14 },
  langCard: { borderRadius: 18, overflow: 'hidden' },
  langHero: { padding: 18, paddingBottom: 22 },
  langHeroRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  flagWrap: { borderRadius: 4, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 8 },
  streakBadge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99 },
  streakBadgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  langNative: { fontFamily: T.serif, fontSize: 34, color: '#fff', lineHeight: 38, marginBottom: 2 },
  langEnglish: { fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },

  langSheet: { backgroundColor: T.card, borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' },
  ringNum: { fontFamily: T.serif, fontSize: 22, lineHeight: 26 },
  ringLabel: { fontSize: 8, color: T.ink4, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase' },
  chip: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 4 },
  chipText: { fontSize: 9.5, fontWeight: '800', letterSpacing: 0.6, textTransform: 'uppercase' },
  nextUpLabel: { fontSize: 9, color: T.ink4, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  nextUpTitle: { fontSize: 12, fontWeight: '600', color: T.ink, lineHeight: 16 },
  nextUpMeta: { fontSize: 10, color: T.ink4 },
  continueBtn: { marginTop: 6, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, borderWidth: 1 },
  continueBtnText: { fontSize: 11.5, fontWeight: '600' },

  // Empty state
  emptyState: { alignItems: 'center', padding: 40, gap: 16 },
  emptyText: { fontSize: 14, color: T.ink3, textAlign: 'center' },
  emptyBtn: { backgroundColor: T.brand, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // Week strip
  weekCard: { backgroundColor: T.bg2, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: T.border, gap: 12 },
  weekHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  weekFlame: { width: 28, height: 28, borderRadius: 14, backgroundColor: T.brandLight, alignItems: 'center', justifyContent: 'center' },
  weekTitle: { fontSize: 12.5, fontWeight: '700', color: T.ink },
  weekGrid: { flexDirection: 'row', gap: 6 },
  weekCell: { flex: 1, alignItems: 'center', gap: 5 },
  weekDot: { width: '100%', aspectRatio: 1, maxWidth: 38, borderRadius: 9, backgroundColor: T.card, borderWidth: 1.5, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  weekDotDone: { backgroundColor: T.brand, borderColor: T.brand },
  weekDotToday: { backgroundColor: T.brandLight, borderColor: T.brand },
  weekDotText: { fontSize: 11, fontWeight: '700', color: T.ink5 },
  weekDay: { fontSize: 9.5, color: T.ink4, fontWeight: '500' },
  weekFooter: { fontSize: 11.5, color: T.ink3, textAlign: 'center' },

  // Aside
  asideRow: { flexDirection: 'row', gap: 18 },

  // Friends
  friendsCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: T.border, gap: 4 },
  friendsTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  friendRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  friendAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  friendAvatarText: { color: '#fff', fontWeight: '700', fontSize: 12.5 },
  friendName: { fontSize: 12.5, color: T.ink, lineHeight: 18 },
  friendMeta: { fontSize: 10.5, color: T.ink4 },

  // Tutor
  tutorCard: { backgroundColor: T.ink, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  tutorIcon: { width: 38, height: 38, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  tutorTitle: { fontSize: 13, fontWeight: '700', color: '#fff' },
  tutorSub: { fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  // Quick links
  quickLinksCard: { backgroundColor: T.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: T.border },
  quickLinksTitle: { fontSize: 10.5, fontWeight: '700', color: T.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },
  quickLinksGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  quickLink: { paddingHorizontal: 10, paddingVertical: 8, backgroundColor: T.bg2, borderRadius: 9, borderWidth: 1, borderColor: T.hairline },
  quickLinkText: { fontSize: 11.5, fontWeight: '600', color: T.ink2 },
});
