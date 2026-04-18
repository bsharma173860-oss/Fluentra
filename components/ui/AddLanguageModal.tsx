import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Modal, Platform,
} from 'react-native';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { supabase } from '@/lib/supabase';
import { FlagSVG } from '@/components/flags';

// ── Language data ─────────────────────────────────────────────────
type LangEntry = {
  code:    string;
  native:  string;
  english: string;
};

type RegionGroup = {
  region: string;
  emoji:  string;
  languages: LangEntry[];
};

const LANGUAGES_BY_REGION: RegionGroup[] = [
  {
    region: 'European',
    emoji:  '🌍',
    languages: [
      { code: 'en', native: 'English',    english: 'English'    },
      { code: 'fr', native: 'Français',   english: 'French'     },
      { code: 'es', native: 'Español',    english: 'Spanish'    },
      { code: 'de', native: 'Deutsch',    english: 'German'     },
      { code: 'it', native: 'Italiano',   english: 'Italian'    },
      { code: 'pt', native: 'Português',  english: 'Portuguese' },
      { code: 'nl', native: 'Nederlands', english: 'Dutch'      },
      { code: 'ru', native: 'Русский',    english: 'Russian'    },
    ],
  },
  {
    region: 'Asian',
    emoji:  '🌏',
    languages: [
      { code: 'zh', native: '中文',       english: 'Chinese'  },
      { code: 'ja', native: '日本語',     english: 'Japanese' },
      { code: 'ko', native: '한국어',     english: 'Korean'   },
      { code: 'hi', native: 'हिन्दी',    english: 'Hindi'    },
    ],
  },
  {
    region: 'Middle Eastern',
    emoji:  '🌍',
    languages: [
      { code: 'ar', native: 'العربية', english: 'Arabic'  },
      { code: 'tr', native: 'Türkçe', english: 'Turkish' },
      { code: 'fa', native: 'فارسی',  english: 'Persian' },
    ],
  },
];

// ── Icons ─────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke="#BBB" strokeWidth="2" />
      <Path d="M21 21l-4.35-4.35" stroke="#BBB" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CloseIcon() {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke="#666" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Props ─────────────────────────────────────────────────────────
type Props = {
  visible:        boolean;
  onClose:        () => void;
  existingCodes:  string[];
  totalCount:     number;
  onLanguageAdded: () => void;
};

// ── Component ─────────────────────────────────────────────────────
export function AddLanguageModal({
  visible, onClose, existingCodes, totalCount, onLanguageAdded,
}: Props) {
  const [search,     setSearch]     = useState('');
  const [adding,     setAdding]     = useState('');
  const [addedCodes, setAddedCodes] = useState<string[]>([]);

  const q = search.toLowerCase().trim();

  // Filter regions — hide empty ones when searching
  const filteredRegions = LANGUAGES_BY_REGION.map(group => ({
    ...group,
    languages: group.languages.filter(l => {
      if (!q) return true;
      return (
        l.native.toLowerCase().includes(q) ||
        l.english.toLowerCase().includes(q) ||
        group.region.toLowerCase().includes(q)
      );
    }),
  })).filter(g => g.languages.length > 0);

  const isAdded  = useCallback((code: string) =>
    existingCodes.includes(code) || addedCodes.includes(code), [existingCodes, addedCodes]);

  async function addLanguage(lang: LangEntry) {
    if (adding || isAdded(lang.code)) return;
    setAdding(lang.code);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAdding(''); return; }

      // Duplicate guard
      const { data: existing } = await supabase
        .from('user_languages')
        .select('id')
        .eq('user_id', user.id)
        .eq('language_code', lang.code)
        .maybeSingle();

      if (existing) {
        setAddedCodes(prev => [...prev, lang.code]);
        setAdding('');
        return;
      }

      const { error } = await supabase
        .from('user_languages')
        .insert({
          user_id:              user.id,
          language_code:        lang.code,
          language_name_en:     lang.english,
          language_name_native: lang.native,
          fluency_percent:      0,
          exams:                [],
          sort_order:           totalCount + addedCodes.length,
        });

      if (error) {
        console.error('[AddLanguageModal] insert error:', error.message);
        setAdding('');
        return;
      }

      setAddedCodes(prev => [...prev, lang.code]);
      onLanguageAdded();
    } catch (err: any) {
      console.error('[AddLanguageModal] error:', err?.message ?? err);
    } finally {
      setAdding('');
    }
  }

  function handleClose() {
    setSearch('');
    setAddedCodes([]);
    onClose();
  }

  const sessionAddedCount = addedCodes.length;
  const totalAdded = existingCodes.length + sessionAddedCount;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      {/* Overlay */}
      <TouchableOpacity
        style={m.overlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        {/* Card — stops tap propagation */}
        <TouchableOpacity
          style={m.card}
          activeOpacity={1}
          onPress={() => {}}
        >
          {/* ── Header ── */}
          <View style={m.header}>
            <View style={{ flex: 1 }}>
              <Text style={m.title}>Add a language</Text>
              <Text style={m.subtitle}>Choose languages to start learning</Text>
            </View>
            <TouchableOpacity
              style={m.closeBtn}
              onPress={handleClose}
              activeOpacity={0.7}
              {...(Platform.OS === 'web' ? { title: 'Close' } as any : {})}
            >
              <CloseIcon />
            </TouchableOpacity>
          </View>

          {/* ── Search ── */}
          <View style={m.searchWrap}>
            <View style={m.searchBar}>
              <SearchIcon />
              <TextInput
                style={m.searchInput}
                value={search}
                onChangeText={setSearch}
                placeholder="Search languages…"
                placeholderTextColor="#BBB"
                autoCorrect={false}
                autoCapitalize="none"
              />
              {search.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearch('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={m.clearX}>×</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ── Language list ── */}
          <ScrollView
            style={m.list}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {filteredRegions.length === 0 && (
              <Text style={m.emptyText}>No languages match "{search}"</Text>
            )}
            {filteredRegions.map(group => (
              <View key={group.region}>
                <View style={m.regionHeader}>
                  <Text style={m.regionLabel}>
                    {group.emoji} {group.region.toUpperCase()}
                  </Text>
                </View>
                {group.languages.map(lang => (
                  <LangRow
                    key={lang.code}
                    lang={lang}
                    added={isAdded(lang.code)}
                    loading={adding === lang.code}
                    onAdd={() => addLanguage(lang)}
                  />
                ))}
              </View>
            ))}
            <View style={{ height: 8 }} />
          </ScrollView>

          {/* ── Footer ── */}
          <View style={m.footer}>
            <Text style={m.footerCount}>
              {totalAdded} language{totalAdded !== 1 ? 's' : ''} added
            </Text>
            <TouchableOpacity
              style={m.doneBtn}
              onPress={handleClose}
              activeOpacity={0.85}
            >
              <Text style={m.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// ── Language row ──────────────────────────────────────────────────
function LangRow({
  lang, added, loading, onAdd,
}: {
  lang:    LangEntry;
  added:   boolean;
  loading: boolean;
  onAdd:   () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[m.row, hovered && m.rowHovered]}
      onPress={added ? undefined : onAdd}
      activeOpacity={0.75}
      disabled={added || loading}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
        cursor: added ? 'default' : 'pointer',
      } as any : {})}
    >
      {/* Flag */}
      <View style={m.flagWrap}>
        <FlagSVG code={lang.code} width={48} height={32} />
      </View>

      {/* Names */}
      <View style={{ flex: 1 }}>
        <Text style={m.nativeName}>{lang.native}</Text>
        <Text style={m.englishName}>{lang.english}</Text>
      </View>

      {/* Action */}
      {loading ? (
        <ActivityIndicator size="small" color="#5B4EFF" />
      ) : added ? (
        <View style={m.addedPill}>
          <CheckIcon />
          <Text style={m.addedPillText}>Added</Text>
        </View>
      ) : (
        <TouchableOpacity
          style={[m.addBtn, hovered && m.addBtnHovered]}
          onPress={onAdd}
          activeOpacity={0.8}
        >
          <Text style={m.addBtnText}>Add</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius:    20,
    borderWidth:     1,
    borderColor:     '#EAEAEA',
    width:           '100%' as any,
    maxWidth:        580,
    maxHeight:       '85%' as any,
    overflow:        'hidden',
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
    } as any : {
      shadowColor: '#000', shadowOpacity: 0.18,
      shadowOffset: { width: 0, height: 12 }, shadowRadius: 32,
      elevation: 16,
    }),
  },

  // ── Header ──
  header: {
    flexDirection:     'row',
    alignItems:        'flex-start',
    paddingHorizontal: 28,
    paddingTop:        24,
    paddingBottom:     16,
    gap:               12,
  },
  title:    { fontFamily: 'Inter_700Bold',    fontSize: 22, color: '#000' },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#999', marginTop: 4 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F4F4F4',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },

  // ── Search ──
  searchWrap: {
    paddingHorizontal: 28,
    paddingBottom:     16,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  searchBar: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    height:            44,
    backgroundColor:   '#F7F7F5',
    borderRadius:      10,
    borderWidth:       1,
    borderColor:       '#EAEAEA',
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize:   14,
    color:      '#000',
    padding:    0,
  },
  clearX: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18, color: '#BBB', lineHeight: 20,
  },

  // ── List ──
  list: { maxHeight: 420 },

  emptyText: {
    fontFamily: 'Inter_400Regular', fontSize: 14, color: '#BBB',
    textAlign: 'center', paddingVertical: 32, paddingHorizontal: 28,
  },

  regionHeader: {
    paddingHorizontal: 28,
    paddingTop:        16,
    paddingBottom:     6,
  },
  regionLabel: {
    fontFamily:    'Inter_700Bold',
    fontSize:      10,
    color:         '#BBB',
    textTransform: 'uppercase' as const,
    letterSpacing: 0.8,
  },

  row: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               14,
    paddingVertical:   10,
    paddingHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#F9F9F9',
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  rowHovered: { backgroundColor: '#F7F7F5' },

  flagWrap: { width: 48, height: 32, borderRadius: 6, overflow: 'hidden' },

  nativeName:  { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#000' },
  englishName: { fontFamily: 'Inter_400Regular',  fontSize: 13, color: '#999', marginTop: 2 },

  addBtn: {
    backgroundColor:   '#5B4EFF',
    borderRadius:      8,
    paddingVertical:   7,
    paddingHorizontal: 18,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  addBtnHovered: { backgroundColor: '#4B3EEF' },
  addBtnText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FFF',
  },

  addedPill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               5,
    backgroundColor:   '#EDFAF4',
    borderRadius:      8,
    borderWidth:       1,
    borderColor:       '#C0E8D4',
    paddingVertical:   7,
    paddingHorizontal: 14,
  },
  addedPillText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#16A34A',
  },

  // ── Footer ──
  footer: {
    flexDirection:     'row',
    alignItems:        'center',
    justifyContent:    'space-between',
    paddingHorizontal: 28,
    paddingVertical:   16,
    borderTopWidth:    1,
    borderTopColor:    '#EAEAEA',
  },
  footerCount: {
    fontFamily: 'Inter_400Regular', fontSize: 13, color: '#999',
  },
  doneBtn: {
    backgroundColor:   '#000',
    borderRadius:      10,
    paddingVertical:   10,
    paddingHorizontal: 24,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  doneBtnText: {
    fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#FFF',
  },
});
