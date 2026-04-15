import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Modal, Pressable, Alert,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import { getLangNames, LANG_NAMES } from '@/constants/languages';
import { FlameIcon, PlusIcon, XIcon } from '@/components/icons';
import { FluentraLogo } from '@/components/FluentraLogo';
import { AppLayout } from '@/components/layout/AppLayout';
import type { UserLanguage, AppSession } from '@/lib/supabase';

// ── Constants ─────────────────────────────────────────────────────
const LANG_FLAG_BG: Record<string, string> = {
  en: '#E8EDFF', es: '#FFF0E5', fr: '#E5F5EC',
  de: '#FFFBE5', pt: '#E5F5EC', zh: '#FFE5E5',
  ja: '#FFE5F5', ko: '#E5EEFF', ar: '#E5F5F0', it: '#FFF3E5',
};

const SAMPLE_LANGUAGES: UserLanguage[] = [
  { id: 's1', user_id: '', language_code: 'en', language_name_en: 'English',  language_name_native: 'English',  fluency_percent: 88, exams: [], created_at: '' },
  { id: 's2', user_id: '', language_code: 'es', language_name_en: 'Spanish',  language_name_native: 'Español',  fluency_percent: 55, exams: [], created_at: '' },
  { id: 's3', user_id: '', language_code: 'fr', language_name_en: 'French',   language_name_native: 'Français', fluency_percent: 30, exams: [], created_at: '' },
];

function fluencyToLevel(pct: number): string {
  if (pct >= 95) return 'C2';
  if (pct >= 80) return 'C1';
  if (pct >= 60) return 'B2';
  if (pct >= 40) return 'B1';
  if (pct >= 20) return 'A2';
  return 'A1';
}

const MODULE_COLORS: Record<string, string> = {
  writing:   Colors.p,
  reading:   Colors.blue,
  listening: Colors.gold,
  speaking:  Colors.green,
};

// ── Language card ─────────────────────────────────────────────────
function LanguageCard({
  lang, cardWidth,
}: {
  lang: UserLanguage; cardWidth: string | number;
}) {
  const code       = lang.language_code;
  const names      = getLangNames(code);
  const exams      = LANGUAGE_EXAMS[code] ?? [];
  const flagBg     = LANG_FLAG_BG[code]   ?? Colors.p_soft;
  const streakDays = Math.round(lang.fluency_percent / 2.5);
  const level      = fluencyToLevel(lang.fluency_percent);

  return (
    <TouchableOpacity
      style={[c.card, { width: cardWidth as any }]}
      onPress={() => router.push(`/language/${code}` as any)}
      activeOpacity={0.85}
    >
      {/* Flag */}
      <View style={[c.flagBadge, { backgroundColor: flagBg }]}>
        <Text style={c.flagEmoji}>{names.flag}</Text>
      </View>

      {/* Names */}
      <View style={{ flex: 1, marginTop: 12 }}>
        <Text style={c.cardNative}>{names.native}</Text>
        <Text style={c.cardEn}>{names.english}</Text>

        {/* Exam badges */}
        {exams.length > 0 && (
          <View style={c.examRow}>
            {exams.slice(0, 2).map(e => (
              <View key={e.id} style={[c.examBadge, { backgroundColor: e.bg }]}>
                <Text style={[c.examBadgeText, { color: e.color }]}>{e.id.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Bottom row */}
      <View style={c.cardBottom}>
        <View style={c.streakRow}>
          <FlameIcon size={12} color={streakDays > 0 ? Colors.p : Colors.ink3} />
          <Text style={[c.streakText, streakDays === 0 && c.streakTextGray]}>
            {streakDays > 0 ? `Day ${streakDays}` : 'Start streak'}
          </Text>
        </View>
        <View style={c.levelBadge}>
          <Text style={c.levelText}>{level}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Add language card ─────────────────────────────────────────────
function AddLanguageCard({ cardWidth, onPress }: { cardWidth: string | number; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[c.addCard, { width: cardWidth as any }]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <PlusIcon size={20} color={Colors.ink3} />
      <Text style={c.addCardTitle}>Add a language</Text>
      <Text style={c.addCardSub}>+1 new language per year</Text>
    </TouchableOpacity>
  );
}

// ── Add language modal ────────────────────────────────────────────
function AddLanguageModal({
  visible, existingCodes, userId, onClose, onAdded,
}: {
  visible: boolean;
  existingCodes: string[];
  userId: string | undefined;
  onClose: () => void;
  onAdded: (lang: UserLanguage) => void;
}) {
  const [adding, setAdding] = useState<string | null>(null);
  const available = Object.entries(LANG_NAMES).filter(([code]) => !existingCodes.includes(code));

  const handleAdd = useCallback(async (code: string) => {
    if (!userId) { Alert.alert('Sign in required'); return; }
    setAdding(code);
    const names = getLangNames(code);
    const { data, error } = await supabase
      .from('user_languages')
      .insert({ user_id: userId, language_code: code, language_name_en: names.english, language_name_native: names.native, fluency_percent: 0, exams: [] })
      .select().single();
    setAdding(null);
    if (error) { Alert.alert('Error', error.message); return; }
    onAdded(data as UserLanguage);
    onClose();
  }, [userId, onAdded, onClose]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={m.overlay} onPress={onClose}>
        <Pressable style={m.sheet} onPress={() => {}}>
          <View style={m.handle} />
          <View style={m.header}>
            <Text style={m.title}>Add a language</Text>
            <TouchableOpacity style={m.closeBtn} onPress={onClose}>
              <XIcon size={16} color={Colors.ink3} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 20 }}>
            {available.map(([code, meta]) => (
              <TouchableOpacity
                key={code}
                style={m.langItem}
                onPress={() => handleAdd(code)}
                disabled={adding === code}
                activeOpacity={0.75}
              >
                <View style={[m.langFlag, { backgroundColor: LANG_FLAG_BG[code] ?? Colors.bg2 }]}>
                  <Text style={m.langFlagText}>{meta.flag}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={m.langNative}>{meta.native}</Text>
                  <Text style={m.langEn}>{meta.english}</Text>
                </View>
                {adding === code && <Text style={m.addingText}>Adding…</Text>}
              </TouchableOpacity>
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Recent activity row ───────────────────────────────────────────
function ActivityRow({ session }: { session: AppSession }) {
  const color  = MODULE_COLORS[session.mode] ?? Colors.p;
  const label  = session.mode.charAt(0).toUpperCase() + session.mode.slice(1);
  const exam   = session.exam_type ?? 'IELTS';
  const score  = session.overall_band;

  const date = session.completed_at
    ? (() => {
        const d = new Date(session.completed_at);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
        return diffDays === 0 ? 'Today' : diffDays === 1 ? 'Yesterday' : `${diffDays}d ago`;
      })()
    : '';

  return (
    <View style={ar.row}>
      <View style={[ar.icon, { backgroundColor: color + '22' }]}>
        <Text style={[ar.iconText, { color }]}>{label[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={ar.rowTitle}>{label} · {exam}</Text>
        <Text style={ar.rowSub}>{date}{score ? ` · Band ${score.toFixed(1)}` : ''}</Text>
      </View>
      {score !== null && score !== undefined && (
        <Text style={[ar.score, { color }]}>{score.toFixed(1)}</Text>
      )}
    </View>
  );
}

const ar = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 16, paddingVertical: 12,
    marginBottom: 8,
  },
  icon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  iconText: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  rowTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.ink },
  rowSub:   { fontFamily: 'Inter_400Regular',  fontSize: 12, color: Colors.ink3, marginTop: 1 },
  score:    { fontFamily: 'Inter_700Bold',     fontSize: 14 },
});

// ── Screen ────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { width }    = useWindowDimensions();
  const { profile, user } = useAuth();
  const displayName  = profile?.name ?? '';
  const initial      = displayName ? displayName[0].toUpperCase() : '?';

  const isDesktop = Platform.OS === 'web' && width >= 1024;
  const isTablet  = Platform.OS === 'web' && width >= 640 && width < 1024;

  const [languages, setLanguages]       = useState<UserLanguage[]>(SAMPLE_LANGUAGES);
  const [recentSessions, setRecent]     = useState<AppSession[]>([]);
  const [modalOpen, setModalOpen]       = useState(false);

  const handleAdded = useCallback((lang: UserLanguage) => {
    setLanguages(prev => [...prev, lang]);
  }, []);

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from('user_languages').select('*').eq('user_id', profile.id)
      .then(({ data }) => { if (data && data.length > 0) setLanguages(data as UserLanguage[]); });
  }, [profile?.id]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('completed_at', { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setRecent(data as AppSession[]); });
  }, [user?.id]);

  const hour      = new Date().getHours();
  const greeting  = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Card width for grid
  const numCols   = isDesktop ? 3 : isTablet ? 2 : 1;
  const cardWidth = numCols === 3 ? '32%' : numCols === 2 ? '48.5%' : '100%';

  return (
    <AppLayout>
    <SafeAreaView style={c.safe} edges={['top']}>
      {/* ── Top bar (mobile only) ── */}
      <View style={[c.topBar, isDesktop && c.topBarHidden]}>
        <FluentraLogo iconSize={22} textSize={18} />
        <TouchableOpacity
          style={c.avatar}
          onPress={() => router.push('/(tabs)/settings' as any)}
        >
          <Text style={c.avatarText}>{initial}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={c.scroll}>
        {/* ── Greeting ── */}
        <View style={c.greetingWrap}>
          <Text style={c.greeting}>
            {greeting}, {displayName || 'there'}.
          </Text>
        </View>

        {/* ── Languages grid ── */}
        <View style={c.section}>
          <View style={[c.grid, numCols > 1 && c.gridWrap]}>
            {languages.map(lang => (
              <LanguageCard key={lang.id} lang={lang} cardWidth={cardWidth} />
            ))}
            <AddLanguageCard cardWidth={cardWidth} onPress={() => setModalOpen(true)} />
          </View>
        </View>

        {/* ── Recent activity ── */}
        {recentSessions.length > 0 && (
          <View style={c.section}>
            <Text style={c.sectionLabel}>RECENT ACTIVITY</Text>
            {recentSessions.map(s => (
              <ActivityRow key={s.id} session={s} />
            ))}
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>

      <AddLanguageModal
        visible={modalOpen}
        existingCodes={languages.map(l => l.language_code)}
        userId={user?.id}
        onClose={() => setModalOpen(false)}
        onAdded={handleAdded}
      />
    </SafeAreaView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const c = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingBottom: 48 },

  // Top bar
  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  topBarHidden: { display: 'none' },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },

  // Greeting
  greetingWrap: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 },
  greeting:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink },

  // Section
  section:      { paddingHorizontal: 20, marginBottom: 8 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11,
    color: Colors.ink3, letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 12,
  },

  // Grid
  grid:     { gap: 12 },
  gridWrap: { flexDirection: 'row', flexWrap: 'wrap' },

  // Language card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 20,
    minHeight: 160,
    flexDirection: 'column',
  },
  flagBadge: {
    width: 40, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  flagEmoji:    { fontSize: 20 },
  cardNative:   { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: Colors.ink },
  cardEn:       { fontFamily: 'Inter_400Regular',  fontSize: 13, color: Colors.ink3, marginTop: 2 },

  examRow:      { flexDirection: 'row', gap: 4, marginTop: 8, flexWrap: 'wrap' },
  examBadge:    { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  examBadgeText:{ fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  cardBottom:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  streakRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText:  { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.p },
  streakTextGray: { color: Colors.ink3, fontFamily: 'Inter_400Regular' },
  levelBadge:  {
    backgroundColor: Colors.bg2, borderRadius: 6,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  levelText:   { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink2 },

  // Add card
  addCard: {
    borderWidth: 1.5,
    borderStyle: 'dashed' as const,
    borderColor: Colors.borderStrong,
    borderRadius: 12,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  addCardTitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  addCardSub:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4 },
});

// ── Modal styles ──────────────────────────────────────────────────
const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingTop: 12, maxHeight: '70%',
  },
  handle: { width: 36, height: 4, borderRadius: 99, backgroundColor: Colors.border, alignSelf: 'center', marginBottom: 16 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 12,
  },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  closeBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  langItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  langFlag:     { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  langFlagText: { fontSize: 22 },
  langNative:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  langEn:       { fontFamily: 'Inter_400Regular',  fontSize: 11, color: Colors.ink3, marginTop: 1 },
  addingText:   { fontFamily: 'Inter_500Medium',   fontSize: 12, color: Colors.ink3 },
});
