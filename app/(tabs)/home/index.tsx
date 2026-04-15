import React, { useState, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Modal, Pressable, Alert,
  TextInput, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Svg, { Defs, Pattern, Circle, Rect } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import { LANG_NAMES } from '@/constants/languages';
import { getTheme, LANGUAGE_THEMES } from '@/constants/languageThemes';
import { useUserLanguages } from '@/hooks/useUserLanguages';
import { FlameIcon, PlusIcon, XIcon, CheckIcon } from '@/components/icons';
import { FluentraLogo } from '@/components/FluentraLogo';
import { AppLayout } from '@/components/layout/AppLayout';
import type { UserLanguage } from '@/lib/supabase';

// ── Helpers ───────────────────────────────────────────────────────
function fluencyToLevel(pct: number): string {
  if (pct >= 95) return 'C2';
  if (pct >= 80) return 'C1';
  if (pct >= 60) return 'B2';
  if (pct >= 40) return 'B1';
  if (pct >= 20) return 'A2';
  return 'A1';
}

// ── Card header with dot pattern ─────────────────────────────────
function CardHeader({ bg, accent }: { bg: string; accent: string }) {
  return (
    <View style={{ height: 72, overflow: 'hidden' }}>
      <Svg width="100%" height="72" style={{ position: 'absolute', top: 0, left: 0 }}>
        <Defs>
          <Pattern id={`dots-${accent}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <Circle cx="10" cy="10" r="1.5" fill={accent} opacity={0.12} />
          </Pattern>
        </Defs>
        <Rect width="100%" height="72" fill={bg} />
        <Rect width="100%" height="72" fill={`url(#dots-${accent})`} />
      </Svg>
    </View>
  );
}

// ── Language card ─────────────────────────────────────────────────
function LanguageCard({ lang }: { lang: UserLanguage }) {
  const code       = lang.language_code;
  const theme      = getTheme(code);
  const exams      = LANGUAGE_EXAMS[code] ?? [];
  const streakDays = Math.round(lang.fluency_percent / 2.5);
  const level      = fluencyToLevel(lang.fluency_percent);

  return (
    <TouchableOpacity
      style={c.card}
      onPress={() => router.push(`/language/${code}` as any)}
      activeOpacity={0.85}
    >
      <CardHeader bg={theme.bg} accent={theme.accent} />

      <View style={c.cardFlag}>
        <Text style={c.cardFlagText}>{theme.flag}</Text>
      </View>

      <View style={c.cardBody}>
        <Text style={c.cardNative}>{theme.native}</Text>
        {theme.native !== theme.name && (
          <Text style={c.cardEn}>{theme.name}</Text>
        )}

        {exams.length > 0 && (
          <View style={c.examRow}>
            {exams.slice(0, 2).map(e => (
              <View key={e.id} style={[c.examBadge, { backgroundColor: theme.accentLight }]}>
                <Text style={[c.examBadgeText, { color: theme.accentDark }]}>{e.id.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={c.cardBottom}>
          <View style={c.streakRow}>
            <FlameIcon size={12} color={streakDays > 0 ? theme.accent : Colors.ink3} />
            <Text style={[c.streakText, { color: streakDays > 0 ? theme.accent : Colors.ink3 }]}>
              {streakDays > 0 ? `Day ${streakDays}` : 'Start streak'}
            </Text>
            {streakDays > 0 && (
              <View style={c.streakBarTrack}>
                <View style={[c.streakBarFill, { width: `${Math.min(lang.fluency_percent, 100)}%` as any, backgroundColor: theme.accent }]} />
              </View>
            )}
          </View>
          <View style={[c.levelBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[c.levelText, { color: theme.accentDark }]}>{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Add language card ─────────────────────────────────────────────
function AddCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={c.addCard} onPress={onPress} activeOpacity={0.75}>
      <PlusIcon size={20} color={Colors.ink3} />
      <Text style={c.addCardTitle}>Add a language</Text>
      <Text style={c.addCardSub}>+1 new language per year</Text>
    </TouchableOpacity>
  );
}

// ── Add language modal ────────────────────────────────────────────
const EUROPEAN_CODES = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'ru', 'tr', 'fa'];
const ASIAN_CODES    = ['zh', 'ja', 'ko', 'ar', 'hi'];

function AddLanguageModal({
  visible, existingCodes, userId, onClose, onAdded,
}: {
  visible: boolean;
  existingCodes: string[];
  userId: string | undefined;
  onClose: () => void;
  onAdded: (lang: UserLanguage) => void;
}) {
  const [search,  setSearch]  = useState('');
  const [adding,  setAdding]  = useState<string | null>(null);
  const [added,   setAdded]   = useState<string[]>([]);
  const [toast,   setToast]   = useState<string | null>(null);

  const allCodes = [...EUROPEAN_CODES, ...ASIAN_CODES];

  const filtered = allCodes.filter(code => {
    const theme = LANGUAGE_THEMES[code];
    if (!theme) return false;
    const q = search.toLowerCase();
    return !q || theme.name.toLowerCase().includes(q) || theme.native.toLowerCase().includes(q);
  });

  const europeanFiltered = filtered.filter(c => EUROPEAN_CODES.includes(c));
  const asianFiltered    = filtered.filter(c => ASIAN_CODES.includes(c));

  const isAdded = (code: string) => existingCodes.includes(code) || added.includes(code);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }

  const handleAdd = useCallback(async (code: string) => {
    if (!userId) { Alert.alert('Sign in required'); return; }
    if (isAdded(code)) return;
    setAdding(code);
    const theme = LANGUAGE_THEMES[code]!;
    const { data, error } = await supabase
      .from('user_languages')
      .insert({
        user_id: userId, language_code: code,
        language_name_en: theme.name, language_name_native: theme.native,
        fluency_percent: 0, exams: [],
      })
      .select().single();
    setAdding(null);
    if (error) { Alert.alert('Error', error.message); return; }
    setAdded(prev => [...prev, code]);
    onAdded(data as UserLanguage);
    showToast(`${theme.native} added!`);
  }, [userId, existingCodes, added]);

  function handleClose() {
    setSearch('');
    setAdded([]);
    onClose();
  }

  function renderSection(codes: string[], title: string) {
    if (codes.length === 0) return null;
    return (
      <>
        <Text style={am.sectionLabel}>{title}</Text>
        <View style={am.grid}>
          {codes.map(code => {
            const theme = LANGUAGE_THEMES[code]!;
            const done  = isAdded(code);
            const busy  = adding === code;
            return (
              <View key={code} style={[am.langCard, { backgroundColor: theme.bg }]}>
                <Text style={am.langFlag}>{theme.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={am.langNative}>{theme.native}</Text>
                  <Text style={am.langEn}>{theme.name}</Text>
                </View>
                {done ? (
                  <View style={am.addedBadge}>
                    <CheckIcon size={10} color="#0A8C5A" strokeWidth={2.5} />
                    <Text style={am.addedText}>Added</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[am.addBtn, { backgroundColor: theme.accent }]}
                    onPress={() => handleAdd(code)}
                    disabled={busy}
                    activeOpacity={0.8}
                  >
                    <Text style={am.addBtnText}>{busy ? '…' : 'Add'}</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={am.overlay} onPress={handleClose}>
        <Pressable style={am.sheet} onPress={() => {}}>
          {/* Toast */}
          {toast && (
            <View style={am.toast}>
              <Text style={am.toastText}>{toast}</Text>
            </View>
          )}

          {/* Header */}
          <View style={am.header}>
            <View style={{ flex: 1 }}>
              <Text style={am.title}>Add a language</Text>
              <Text style={am.subtitle}>Choose a language to start your learning journey</Text>
            </View>
            <TouchableOpacity style={am.closeBtn} onPress={handleClose}>
              <XIcon size={16} color={Colors.ink3} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View style={am.searchWrap}>
            <TextInput
              style={am.search}
              value={search}
              onChangeText={setSearch}
              placeholder="Search languages…"
              placeholderTextColor={Colors.ink4}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={am.scrollContent}>
            {renderSection(europeanFiltered, 'EUROPEAN')}
            {renderSection(asianFiltered,    'ASIAN & MIDDLE EASTERN')}
            <View style={{ height: 24 }} />
          </ScrollView>

          <TouchableOpacity style={am.doneBtn} onPress={handleClose} activeOpacity={0.85}>
            <Text style={am.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { width }       = useWindowDimensions();
  const { profile, user } = useAuth();
  const displayName     = profile?.name ?? '';
  const initial         = displayName ? displayName[0].toUpperCase() : '?';
  const isDesktop       = Platform.OS === 'web' && width >= 1024;

  const { languages, refetch } = useUserLanguages();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdded = useCallback((_lang: UserLanguage) => {
    refetch();
  }, [refetch]);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <AppLayout>
    <SafeAreaView style={c.safe} edges={['top']}>
      {/* ── Top bar (mobile) ── */}
      {!isDesktop && (
        <View style={c.topBar}>
          <FluentraLogo iconSize={22} textSize={18} />
          <TouchableOpacity style={c.avatar} onPress={() => router.push('/(tabs)/settings' as any)}>
            <Text style={c.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={c.scroll}>
        {/* Greeting */}
        <View style={c.greetingWrap}>
          <Text style={c.greeting}>{greeting}, {displayName || 'there'}.</Text>
        </View>

        {/* Language cards */}
        <View style={c.section}>
          <View style={[c.grid, isDesktop && c.gridDesktop]}>
            {languages.map(lang => (
              <LanguageCard key={lang.id} lang={lang} />
            ))}
            <AddCard onPress={() => setModalOpen(true)} />
          </View>
        </View>

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

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },

  greetingWrap: { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 24 },
  greeting:     { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: Colors.ink },

  section:      { paddingHorizontal: 20 },
  grid:         { gap: 12 },
  gridDesktop:  { flexDirection: 'row', flexWrap: 'wrap' },

  // Language card
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
    minHeight: 180,
  },
  cardFlag: {
    position: 'absolute', top: 16, left: '50%' as any,
    marginLeft: -20,
    width: 40, height: 28, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
  cardFlagText: { fontSize: 24 },
  cardBody: { padding: 14, paddingTop: 12 },
  cardNative: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  cardEn:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },

  examRow:       { flexDirection: 'row', gap: 4, marginTop: 8, flexWrap: 'wrap' },
  examBadge:     { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  examBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  cardBottom:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  streakRow:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText:    { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  streakBarTrack:{ width: 40, height: 3, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  streakBarFill: { height: '100%', borderRadius: 99 },
  levelBadge:    { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  levelText:     { fontFamily: 'Inter_700Bold', fontSize: 10 },

  // Add card
  addCard: {
    borderWidth: 1.5, borderStyle: 'dashed' as const,
    borderColor: Colors.borderStrong, borderRadius: 16,
    minHeight: 180, alignItems: 'center', justifyContent: 'center',
    gap: 8, backgroundColor: 'transparent',
  },
  addCardTitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink3 },
  addCardSub:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink4 },
});

// ── Modal styles ──────────────────────────────────────────────────
const am = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: {
    backgroundColor: Colors.white, borderRadius: 20,
    width: '100%', maxWidth: 500,
    maxHeight: '85%' as any, overflow: 'hidden',
  },

  toast: {
    position: 'absolute', top: 12, alignSelf: 'center',
    backgroundColor: Colors.ink, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, zIndex: 10,
  },
  toastText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white },

  header:   { flexDirection: 'row', alignItems: 'flex-start', padding: 24, paddingBottom: 16, gap: 12 },
  title:    { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 18, color: Colors.ink, marginBottom: 4 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
  closeBtn: { width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },

  searchWrap: { paddingHorizontal: 20, paddingBottom: 12 },
  search: {
    height: 40, borderRadius: 10,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.bg,
    paddingHorizontal: 14,
    fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink,
  },

  scrollContent: { paddingHorizontal: 20 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10,
    color: Colors.ink3, letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 8, marginTop: 8,
  },
  grid: { gap: 8, marginBottom: 4 },

  langCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    height: 64, borderRadius: 12,
    borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14,
  },
  langFlag:   { fontSize: 22, width: 32 },
  langNative: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  langEn:     { fontFamily: 'Inter_400Regular',  fontSize: 11, color: Colors.ink3, marginTop: 1 },

  addBtn:     { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  addBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.white },

  addedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EDFAF4', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  addedText:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#0A8C5A' },

  doneBtn: {
    margin: 20, marginTop: 8, height: 44, borderRadius: 10,
    backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center',
  },
  doneBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.white },
});
