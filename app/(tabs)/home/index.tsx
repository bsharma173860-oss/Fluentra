import React, { useState, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Modal, Pressable, Alert,
  TextInput, Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
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

function todayLabel(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// ── Language card ─────────────────────────────────────────────────
function LanguageCard({ lang }: { lang: UserLanguage }) {
  const code       = lang.language_code;
  const theme      = getTheme(code);
  const exams      = LANGUAGE_EXAMS[code] ?? [];
  const streakDays = Math.round(lang.fluency_percent / 2.5);
  const level      = fluencyToLevel(lang.fluency_percent);

  const [hovered, setHovered] = useState(false);

  const cardStyle = [
    c.card,
    Platform.OS === 'web' && hovered && c.cardHovered,
  ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => router.push(`/language/${code}` as any)}
      activeOpacity={0.9}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } : {})}
    >
      {/* ── Card top: pastel bg + flag ── */}
      <View style={[c.cardTop, { backgroundColor: theme.bg }]}>
        <View style={c.flagWrap}>
          <Text style={c.flagText}>{theme.flag}</Text>
        </View>
      </View>

      {/* ── Card bottom ── */}
      <View style={c.cardBottom}>
        <Text style={c.cardNative}>{theme.native}</Text>
        {theme.native !== theme.name && (
          <Text style={c.cardEn}>{theme.name}</Text>
        )}

        {exams.length > 0 && (
          <View style={c.examRow}>
            {exams.slice(0, 2).map(e => (
              <View key={e.id} style={c.examBadge}>
                <Text style={c.examBadgeText}>{e.id.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={c.divider} />

        <View style={c.cardFooter}>
          <View style={c.streakRow}>
            <View style={[c.dot, { backgroundColor: theme.accent }]} />
            <Text style={[c.streakText, { color: theme.accent }]}>
              {streakDays > 0 ? `Day ${streakDays}` : 'Start'}
            </Text>
          </View>
          <View style={c.levelBadge}>
            <Text style={c.levelText}>{level}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ── Add language card ─────────────────────────────────────────────
function AddCard({ onPress }: { onPress: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <TouchableOpacity
      style={[c.addCard, Platform.OS === 'web' && hovered && c.addCardHovered]}
      onPress={onPress}
      activeOpacity={0.75}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } : {})}
    >
      <PlusIcon size={20} color={Colors.textMuted} />
      <Text style={c.addCardTitle}>Add a language</Text>
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
        <View style={am.list}>
          {codes.map(code => {
            const theme = LANGUAGE_THEMES[code]!;
            const done  = isAdded(code);
            const busy  = adding === code;
            return (
              <View key={code} style={am.langRow}>
                <Text style={am.langFlag}>{theme.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={am.langNative}>{theme.native}</Text>
                  <Text style={am.langEn}>{theme.name}</Text>
                </View>
                {done ? (
                  <View style={am.addedBadge}>
                    <CheckIcon size={10} color={Colors.green} strokeWidth={2.5} />
                    <Text style={am.addedText}>Added</Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={am.addBtn}
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
          {toast && (
            <View style={am.toast}>
              <Text style={am.toastText}>{toast}</Text>
            </View>
          )}

          <View style={am.header}>
            <View style={{ flex: 1 }}>
              <Text style={am.title}>Add a language</Text>
              <Text style={am.subtitle}>Choose a language to start learning</Text>
            </View>
            <TouchableOpacity style={am.closeBtn} onPress={handleClose}>
              <XIcon size={16} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={am.searchWrap}>
            <TextInput
              style={am.search}
              value={search}
              onChangeText={setSearch}
              placeholder="Search languages…"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={am.scrollContent}>
            {renderSection(europeanFiltered, 'EUROPEAN')}
            {renderSection(asianFiltered,    'ASIAN & MIDDLE EASTERN')}
            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={am.footer}>
            <TouchableOpacity style={am.doneBtn} onPress={handleClose} activeOpacity={0.85}>
              <Text style={am.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
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
      {/* ── Mobile top bar ── */}
      {!isDesktop && (
        <View style={c.topBar}>
          <FluentraLogo iconSize={28} textSize={18} />
          <TouchableOpacity style={c.avatar} onPress={() => router.push('/(tabs)/settings' as any)}>
            <Text style={c.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={c.scroll}>
        {/* Greeting */}
        <View style={c.greetingWrap}>
          <Text style={c.greeting}>{greeting}{displayName ? `, ${displayName}` : ''}.</Text>
          <Text style={c.greetingDate}>{todayLabel()}</Text>
        </View>

        {/* Section label */}
        <Text style={c.sectionLabel}>YOUR LANGUAGES</Text>

        {/* Language cards */}
        <View style={[c.grid, isDesktop && c.gridDesktop]}>
          {languages.map(lang => (
            <LanguageCard key={lang.id} lang={lang} />
          ))}
          <AddCard onPress={() => setModalOpen(true)} />
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
  safe:   { flex: 1, backgroundColor: Colors.surface },
  scroll: { paddingBottom: 48 },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  avatar:     { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.logoAccent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },

  greetingWrap: { paddingHorizontal: 40, paddingTop: 32, paddingBottom: 24 },
  greeting: {
    fontFamily: 'Inter_700Bold',
    fontSize:   28,
    color:      Colors.textPrimary,
    lineHeight: 34,
  },
  greetingDate: {
    fontFamily: 'Inter_400Regular',
    fontSize:   13,
    color:      Colors.textMuted,
    marginTop:  4,
  },

  sectionLabel: {
    fontFamily:        'Inter_600SemiBold',
    fontSize:          11,
    color:             Colors.textMuted,
    letterSpacing:     1,
    textTransform:     'uppercase' as const,
    paddingHorizontal: 40,
    marginBottom:      12,
  },

  grid:        { paddingHorizontal: 40, gap: 16 },
  gridDesktop: { flexDirection: 'row', flexWrap: 'wrap' },

  // Language card
  card: {
    backgroundColor: Colors.white,
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     Colors.cardBorder,
    overflow:        'hidden',
    minWidth:        200,
    flex:            1,
    ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'all 200ms ease' } as any : {}),
  },
  cardHovered: {
    borderColor: Colors.textPrimary,
    ...(Platform.OS === 'web' ? {
      transform: [{ translateY: -2 }],
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    } as any : {}),
  },

  cardTop: {
    height:         100,
    alignItems:     'center',
    justifyContent: 'center',
  },
  flagWrap: {
    width:           72,
    height:          50,
    borderRadius:    10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems:      'center',
    justifyContent:  'center',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    } as any : {
      shadowColor: '#000', shadowOpacity: 0.12,
      shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
    }),
  },
  flagText: { fontSize: 28 },

  cardBottom:    { padding: 20 },
  cardNative:    { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.textPrimary },
  cardEn:        { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary, marginTop: 3 },

  examRow:       { flexDirection: 'row', gap: 4, marginTop: 10, flexWrap: 'wrap' },
  examBadge:     { backgroundColor: Colors.bg2, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  examBadgeText: { fontFamily: 'Inter_500Medium', fontSize: 11, color: Colors.textSecondary },

  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 12 },

  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakRow:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:        { width: 6, height: 6, borderRadius: 3 },
  streakText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  levelBadge: { backgroundColor: Colors.bg2, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  levelText:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.textSecondary },

  // Add card
  addCard: {
    borderWidth:  1,
    borderStyle:  'dashed' as const,
    borderColor:  Colors.border,
    borderRadius: 16,
    minHeight:    220,
    minWidth:     200,
    flex:         1,
    alignItems:   'center',
    justifyContent: 'center',
    gap:          10,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { cursor: 'pointer', transition: 'border-color 200ms ease' } as any : {}),
  },
  addCardHovered: {
    borderColor: Colors.textPrimary,
  },
  addCardTitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textMuted },
});

// ── Modal styles ──────────────────────────────────────────────────
const am = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', padding: 20 },
  sheet: {
    backgroundColor: Colors.white,
    borderRadius:    16,
    width:           '100%',
    maxWidth:        480,
    maxHeight:       '85%' as any,
    overflow:        'hidden',
    borderWidth:     1,
    borderColor:     Colors.border,
  },

  toast: {
    position: 'absolute', top: 12, alignSelf: 'center',
    backgroundColor: Colors.textPrimary, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8, zIndex: 10,
  },
  toastText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.white },

  header:   { flexDirection: 'row', alignItems: 'flex-start', padding: 24, paddingBottom: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.textPrimary, marginBottom: 3 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary },
  closeBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },

  searchWrap: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  search: {
    height: 38, borderRadius: 8,
    borderWidth: 1, borderColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textPrimary,
  },

  scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10,
    color: Colors.textMuted, letterSpacing: 1,
    textTransform: 'uppercase' as const,
    marginBottom: 6, marginTop: 12,
  },
  list: { gap: 1 },

  langRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  langFlag:   { fontSize: 22, width: 30 },
  langNative: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.textPrimary },
  langEn:     { fontFamily: 'Inter_400Regular',  fontSize: 11, color: Colors.textSecondary, marginTop: 1 },

  addBtn: {
    height: 28, paddingHorizontal: 14, borderRadius: 6,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.white },

  addedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.green_bg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  addedText:  { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.green },

  footer: { borderTopWidth: 1, borderTopColor: Colors.border, padding: 16 },
  doneBtn: {
    height: 38, borderRadius: 8,
    backgroundColor: Colors.textPrimary, alignItems: 'center', justifyContent: 'center',
  },
  doneBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.white },
});
