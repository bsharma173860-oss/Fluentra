import React, { useEffect, useState, useCallback } from 'react';
import {
  ScrollView, View, Text, StyleSheet,
  TouchableOpacity, Modal, Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { LANGUAGE_EXAMS } from '@/constants/examProfiles';
import { getLangNames, LANG_NAMES } from '@/constants/languages';
import { ChevronRightIcon, PlusIcon, XIcon, BellIcon } from '@/components/icons';
import { FluentraLogo } from '@/components/FluentraLogo';
import { AppLayout } from '@/components/layout/AppLayout';
import type { UserLanguage } from '@/lib/supabase';

// ── Language accent colors ────────────────────────────────────────
const LANG_COLOR: Record<string, string> = {
  en: Colors.p,     es: Colors.orange,  fr: Colors.green,
  de: Colors.gold,  pt: Colors.green,   zh: Colors.danger,
  ja: Colors.p,     ko: Colors.orange,  ar: Colors.gold,   it: Colors.orange,
};
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

// ── Language row card ─────────────────────────────────────────────
function LanguageRow({ lang }: { lang: UserLanguage }) {
  const code   = lang.language_code;
  const color  = LANG_COLOR[code]   ?? Colors.p;
  const flagBg = LANG_FLAG_BG[code] ?? Colors.p_soft;
  const names  = getLangNames(code);
  const exams  = LANGUAGE_EXAMS[code] ?? [];

  return (
    <TouchableOpacity
      style={c.langRow}
      onPress={() => router.push(`/language/${code}` as any)}
      activeOpacity={0.8}
    >
      {/* Flag */}
      <View style={[c.flagBadge, { backgroundColor: flagBg }]}>
        <Text style={c.flagEmoji}>{names.flag}</Text>
      </View>

      {/* Names + badges + mini streak */}
      <View style={c.langMeta}>
        <View style={c.langNameRow}>
          <Text style={c.langNative}>{names.native}</Text>
          <Text style={c.langEn}>{names.english}</Text>
        </View>
        <View style={c.langBottomRow}>
          {exams.slice(0, 2).map(e => (
            <View key={e.id} style={[c.examBadge, { backgroundColor: e.bg }]}>
              <Text style={[c.examBadgeText, { color: e.color }]}>{e.id.toUpperCase()}</Text>
            </View>
          ))}
          <View style={c.streakMini}>
            <View style={c.streakTrack}>
              <View style={[c.streakFill, { width: `${lang.fluency_percent}%` as any, backgroundColor: color }]} />
            </View>
            <Text style={c.streakDay}>Day {Math.round(lang.fluency_percent / 2.5)}</Text>
          </View>
        </View>
      </View>

      {/* Chevron */}
      <ChevronRightIcon size={16} color={Colors.borderStrong} />
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

// ── Screen ────────────────────────────────────────────────────────
export default function HomeScreen() {
  const { profile, user } = useAuth();
  const displayName = profile?.name ?? '';
  const initial     = displayName ? displayName[0].toUpperCase() : '?';

  const [languages, setLanguages] = useState<UserLanguage[]>(SAMPLE_LANGUAGES);
  const [modalOpen, setModalOpen] = useState(false);

  const handleAdded = useCallback((lang: UserLanguage) => {
    setLanguages(prev => [...prev, lang]);
  }, []);

  useEffect(() => {
    if (!profile?.id) return;
    supabase.from('user_languages').select('*').eq('user_id', profile.id)
      .then(({ data }) => { if (data && data.length > 0) setLanguages(data as UserLanguage[]); });
  }, [profile?.id]);

  const hour     = new Date().getHours();
  const timeOfDay = hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'GOOD AFTERNOON' : 'GOOD EVENING';

  return (
    <AppLayout>
    <SafeAreaView style={c.safe} edges={['top']}>
      {/* ── Top bar ── */}
      <View style={c.topBar}>
        <FluentraLogo iconSize={22} textSize={18} />
        <View style={c.topRight}>
          <TouchableOpacity style={c.iconBtn}>
            <BellIcon size={18} color={Colors.ink2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={c.avatar}
            onPress={() => router.push('/(tabs)/profile' as any)}
          >
            <Text style={c.avatarText}>{initial}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={c.scroll}>
        {/* ── Greeting ── */}
        <View style={c.greeting}>
          <Text style={c.greetingLabel}>{timeOfDay}</Text>
          <Text style={c.greetingName}>{displayName || 'there'}.</Text>
        </View>

        {/* ── Languages section ── */}
        <View style={c.section}>
          <Text style={c.sectionLabel}>YOUR LANGUAGES</Text>
          <View style={c.langList}>
            {languages.map(lang => (
              <LanguageRow key={lang.id} lang={lang} />
            ))}
            <TouchableOpacity
              style={c.addBtn}
              onPress={() => setModalOpen(true)}
              activeOpacity={0.75}
            >
              <PlusIcon size={14} color={Colors.ink3} />
              <Text style={c.addBtnText}>Add a language</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  logo:       { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 20, color: Colors.ink },
  logoAccent: { color: Colors.p },
  topRight:   { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBtn:    {
    width: 32, height: 32, borderRadius: 8,
    backgroundColor: Colors.bg2, borderWidth: 1, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.p, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'Inter_700Bold', fontSize: 13, color: Colors.white },

  // Greeting
  greeting:      { paddingHorizontal: 20, paddingTop: 28, paddingBottom: 8 },
  greetingLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11,
    color: Colors.ink3, letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 6,
  },
  greetingName: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 32, color: Colors.ink,
  },

  // Section
  section:      { paddingHorizontal: 20, paddingTop: 20 },
  sectionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11,
    color: Colors.ink3, letterSpacing: 0.8,
    textTransform: 'uppercase', marginBottom: 12,
  },
  langList: { gap: 8 },

  // Language row
  langRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingVertical: 14, paddingHorizontal: 16,
    minHeight: 80,
  },
  flagBadge: {
    width: 48, height: 32, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  flagEmoji: { fontSize: 22 },

  langMeta:     { flex: 1, gap: 5 },
  langNameRow:  { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  langNative:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: Colors.ink },
  langEn:       { fontFamily: 'Inter_400Regular',  fontSize: 13, color: Colors.ink3 },

  langBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  examBadge:     { borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 },
  examBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  streakMini:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginLeft: 2 },
  streakTrack: { width: 60, height: 3, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  streakFill:  { height: '100%', borderRadius: 99 },
  streakDay:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },

  // Add button
  addBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    height: 52, borderRadius: 12,
    borderWidth: 1, borderStyle: 'dashed' as const, borderColor: Colors.borderStrong,
    backgroundColor: 'transparent',
  },
  addBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink3 },
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
  title:   { fontFamily: 'Inter_700Bold', fontSize: 16, color: Colors.ink },
  closeBtn:{ width: 28, height: 28, borderRadius: 8, backgroundColor: Colors.bg2, alignItems: 'center', justifyContent: 'center' },
  langItem:{
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  langFlag:     { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  langFlagText: { fontSize: 22 },
  langNative:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  langEn:       { fontFamily: 'Inter_400Regular',  fontSize: 11, color: Colors.ink3, marginTop: 1 },
  addingText:   { fontFamily: 'Inter_500Medium',   fontSize: 12, color: Colors.ink3 },
});
