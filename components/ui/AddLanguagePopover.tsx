import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, Modal, Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { supabase } from '@/lib/supabase';
import { getTheme } from '@/constants/languageThemes';
import { FlagSVG } from '@/components/flags';
import type { UserLanguage } from '@/lib/supabase';

// ── Language data ─────────────────────────────────────────────────
export type LangEntry = {
  code:    string;
  native:  string;
  english: string;
  region:  'european' | 'asian' | 'middle_eastern';
};

export const ALL_LANGUAGES: LangEntry[] = [
  // European
  { code: 'en', native: 'English',    english: 'English',    region: 'european'      },
  { code: 'fr', native: 'Français',   english: 'French',     region: 'european'      },
  { code: 'es', native: 'Español',    english: 'Spanish',    region: 'european'      },
  { code: 'de', native: 'Deutsch',    english: 'German',     region: 'european'      },
  { code: 'it', native: 'Italiano',   english: 'Italian',    region: 'european'      },
  { code: 'pt', native: 'Português',  english: 'Portuguese', region: 'european'      },
  { code: 'nl', native: 'Nederlands', english: 'Dutch',      region: 'european'      },
  { code: 'ru', native: 'Русский',    english: 'Russian',    region: 'european'      },
  // Asian
  { code: 'zh', native: '中文',        english: 'Chinese',    region: 'asian'         },
  { code: 'ja', native: '日本語',      english: 'Japanese',   region: 'asian'         },
  { code: 'ko', native: '한국어',      english: 'Korean',     region: 'asian'         },
  { code: 'hi', native: 'हिन्दी',     english: 'Hindi',      region: 'asian'         },
  // Middle Eastern
  { code: 'ar', native: 'العربية',    english: 'Arabic',     region: 'middle_eastern' },
  { code: 'fa', native: 'فارسی',      english: 'Persian',    region: 'middle_eastern' },
  { code: 'tr', native: 'Türkçe',    english: 'Turkish',    region: 'middle_eastern' },
];

const REGION_LABELS: Record<LangEntry['region'], string> = {
  european:      'EUROPEAN',
  asian:         'ASIAN',
  middle_eastern:'MIDDLE EASTERN',
};

// ── Icons ─────────────────────────────────────────────────────────
function SearchIcon({ color = '#BBB' }: { color?: string }) {
  return (
    <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

function CheckIcon({ color = '#16A34A' }: { color?: string }) {
  return (
    <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <Path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Placement ─────────────────────────────────────────────────────
export type PopoverPlacement = 'sidebar' | 'center';

// ── Props ──────────────────────────────────────────────────────────
type Props = {
  visible:       boolean;
  onClose:       () => void;
  existingCodes: string[];
  onAdded:       (lang: UserLanguage) => void;
  placement:     PopoverPlacement;
  /** Total languages already added — used to set sort_order */
  totalCount:    number;
};

// ── Component ─────────────────────────────────────────────────────
export function AddLanguagePopover({
  visible, onClose, existingCodes, onAdded, placement, totalCount,
}: Props) {
  const [search,     setSearch]     = useState('');
  const [adding,     setAdding]     = useState('');
  const [addedCodes, setAddedCodes] = useState<string[]>([]);

  if (!visible) return null;

  // ── Filtered list ──
  const q = search.toLowerCase().trim();
  const filtered = ALL_LANGUAGES.filter(l => {
    if (existingCodes.includes(l.code) || addedCodes.includes(l.code)) return false;
    if (!q) return true;
    return l.native.toLowerCase().includes(q) || l.english.toLowerCase().includes(q);
  });

  const europeanList      = filtered.filter(l => l.region === 'european');
  const asianList         = filtered.filter(l => l.region === 'asian');
  const middleEasternList = filtered.filter(l => l.region === 'middle_eastern');

  // ── Add language ──
  async function addLanguage(lang: LangEntry) {
    if (adding) return;
    setAdding(lang.code);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setAdding(''); return; }

      // Guard: check if already exists (race condition safety)
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

      const { data, error } = await supabase
        .from('user_languages')
        .insert({
          user_id:              user.id,
          language_code:        lang.code,
          language_name_en:     lang.english,
          language_name_native: lang.native,
          fluency_percent:      0,
          exams:                [],
          sort_order:           totalCount + addedCodes.length,
        })
        .select()
        .single();

      if (error) throw error;

      setAddedCodes(prev => [...prev, lang.code]);
      onAdded(data as UserLanguage);
    } catch (err: any) {
      console.error('[AddLanguagePopover] insert error:', err?.message ?? err);
    } finally {
      setAdding('');
    }
  }

  function handleClose() {
    setSearch('');
    setAddedCodes([]);
    onClose();
  }

  // ── Content ──
  const content = (
    <View style={p.card}>
      {/* Header / search */}
      <View style={p.header}>
        <View style={p.searchRow}>
          <SearchIcon />
          <TextInput
            style={p.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search languages…"
            placeholderTextColor="#BBB"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
              <Text style={p.clearX}>×</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Language list */}
      <ScrollView
        style={p.list}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filtered.length === 0 && (
          <Text style={p.emptyText}>
            {q ? `No results for "${search}"` : 'All languages added!'}
          </Text>
        )}

        {([
          { label: REGION_LABELS.european,       items: europeanList      },
          { label: REGION_LABELS.asian,           items: asianList         },
          { label: REGION_LABELS.middle_eastern,  items: middleEasternList },
        ] as const).map(({ label, items }) =>
          items.length === 0 ? null : (
            <View key={label}>
              <Text style={p.regionLabel}>{label}</Text>
              {items.map(lang => {
                const busy    = adding === lang.code;
                const isDone  = addedCodes.includes(lang.code);
                const theme   = getTheme(lang.code);
                return (
                  <LangRow
                    key={lang.code}
                    lang={lang}
                    theme={theme}
                    busy={busy}
                    isDone={isDone}
                    onPress={() => addLanguage(lang)}
                  />
                );
              })}
            </View>
          )
        )}

        <View style={{ height: 4 }} />
      </ScrollView>

      {/* Footer hint */}
      <View style={p.footer}>
        <Text style={p.footerText}>Tap + to add · Changes save instantly</Text>
      </View>
    </View>
  );

  // ── Layout: sidebar floats right, center floats center ──
  const overlayStyle = placement === 'sidebar' ? p.overlaySidebar : p.overlayCenter;
  const cardWrapStyle = placement === 'sidebar' ? p.cardWrapSidebar : p.cardWrapCenter;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={[p.overlay, overlayStyle]}>
        {/* Backdrop tap-to-close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={handleClose}
        />

        {/* Floating card */}
        <View
          style={cardWrapStyle}
          {...(Platform.OS === 'web' ? {
            onKeyDown: (e: any) => { if (e.key === 'Escape') handleClose(); },
          } as any : {})}
        >
          {content}
        </View>
      </View>
    </Modal>
  );
}

// ── Language row ──────────────────────────────────────────────────
function LangRow({
  lang, theme, busy, isDone, onPress,
}: {
  lang:    LangEntry;
  theme:   ReturnType<typeof getTheme>;
  busy:    boolean;
  isDone:  boolean;
  onPress: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <TouchableOpacity
      style={[p.row, hovered && p.rowHovered]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={busy || isDone}
      {...(Platform.OS === 'web' ? {
        onMouseEnter: () => setHovered(true),
        onMouseLeave: () => setHovered(false),
      } as any : {})}
    >
      {/* Flag */}
      <View style={p.flagWrap}>
        <FlagSVG code={lang.code} width={36} height={24} />
      </View>

      {/* Names */}
      <View style={{ flex: 1 }}>
        <Text style={p.nativeName}>{lang.native}</Text>
        <Text style={p.englishName}>{lang.english}</Text>
      </View>

      {/* Action */}
      {isDone ? (
        <CheckIcon color="#16A34A" />
      ) : busy ? (
        <ActivityIndicator size="small" color="#5B4EFF" />
      ) : (
        <View style={p.addBtn}>
          <Text style={p.addBtnText}>+</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const CARD_WIDTH = 280;

const p = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  overlaySidebar: {
    // transparent — card is absolutely positioned
  },
  overlayCenter: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardWrapSidebar: {
    position: 'absolute',
    left:     248,   // 240px sidebar + 8px gap
    bottom:   56,    // above user footer
    width:    CARD_WIDTH,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    } as any : {
      shadowColor: '#000', shadowOpacity: 0.14,
      shadowOffset: { width: 0, height: 8 }, shadowRadius: 16,
      elevation: 8,
    }),
  },
  cardWrapCenter: {
    width: CARD_WIDTH,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
    } as any : {
      shadowColor: '#000', shadowOpacity: 0.14,
      shadowOffset: { width: 0, height: 8 }, shadowRadius: 16,
      elevation: 8,
    }),
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius:    16,
    borderWidth:     1,
    borderColor:     '#EAEAEA',
    overflow:        'hidden',
  },

  header: {
    paddingHorizontal: 12,
    paddingTop:        12,
    paddingBottom:     10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    height:         34,
    backgroundColor:'#F7F7F5',
    borderRadius:   8,
    borderWidth:    1,
    borderColor:    '#EAEAEA',
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#000',
    padding: 0,
  },
  clearX: {
    fontSize: 16, color: '#BBB', lineHeight: 18,
  },

  list: { maxHeight: 280 },

  emptyText: {
    fontFamily: 'Inter_400Regular', fontSize: 12, color: '#BBB',
    textAlign: 'center', paddingVertical: 20, paddingHorizontal: 16,
  },

  regionLabel: {
    fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#BBB',
    textTransform: 'uppercase' as const, letterSpacing: 0.7,
    paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4,
  },

  row: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               10,
    height:            44,
    paddingHorizontal: 14,
    ...(Platform.OS === 'web' ? { cursor: 'pointer' } as any : {}),
  },
  rowHovered: { backgroundColor: '#F7F7F5' },

  flagWrap: { width: 36, height: 24, borderRadius: 4, overflow: 'hidden' },

  nativeName:  { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000' },
  englishName: { fontFamily: 'Inter_400Regular',  fontSize: 11, color: '#999', marginTop: 1 },

  addBtn: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#5B4EFF',
    alignItems: 'center', justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: 'Inter_700Bold', fontSize: 16,
    color: '#FFF', lineHeight: 22,
  },

  footer: {
    borderTopWidth: 1, borderTopColor: '#F0F0F0',
    paddingHorizontal: 14, paddingVertical: 8,
  },
  footerText: {
    fontFamily: 'Inter_400Regular', fontSize: 11,
    color: '#BBB', textAlign: 'center',
  },
});
