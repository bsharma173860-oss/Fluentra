import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { FluentraLogo } from '@/components/FluentraLogo';
import {
  HomeIcon, TrophyIcon, BookIcon, ChartIcon, GearIcon,
  PlusIcon, type IconProps,
} from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';
import { useUserLanguages } from '@/hooks/useUserLanguages';
import { getTheme } from '@/constants/languageThemes';
import { AddLanguageModal } from '@/components/ui/AddLanguageModal';
import type { UserLanguage } from '@/lib/supabase';

// ── Nav items ─────────────────────────────────────────────────────
type NavItem = {
  label:       string;
  route:       string;
  pathSegment: string;
  Icon:        (p: IconProps) => JSX.Element;
};

const NAV_ITEMS: NavItem[] = [
  { label: 'Home',     route: '/(tabs)/home',     pathSegment: '/home',     Icon: HomeIcon   },
  { label: 'Exams',    route: '/(tabs)/exams',     pathSegment: '/exams',    Icon: TrophyIcon },
  { label: 'Library',  route: '/library',          pathSegment: '/library',  Icon: BookIcon   },
  { label: 'Progress', route: '/(tabs)/progress',  pathSegment: '/progress', Icon: ChartIcon  },
  { label: 'Settings', route: '/(tabs)/settings',  pathSegment: '/settings', Icon: GearIcon   },
];

// ── Drag handle icon (6 dots, 2×3 grid) ──────────────────────────
function DragHandle({ color = Colors.sidebarLabel }: { color?: string }) {
  return (
    <Svg width={12} height={14} viewBox="0 0 12 14">
      <Circle cx="3"  cy="2"  r="1.2" fill={color} />
      <Circle cx="9"  cy="2"  r="1.2" fill={color} />
      <Circle cx="3"  cy="7"  r="1.2" fill={color} />
      <Circle cx="9"  cy="7"  r="1.2" fill={color} />
      <Circle cx="3"  cy="12" r="1.2" fill={color} />
      <Circle cx="9"  cy="12" r="1.2" fill={color} />
    </Svg>
  );
}

// ── Language row with drag ────────────────────────────────────────
function LangRow({
  lang, isActive, onPress,
  draggedCode, dragOverCode,
  onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd,
}: {
  lang:        UserLanguage;
  isActive:    boolean;
  onPress:     () => void;
  draggedCode: string | null;
  dragOverCode: string | null;
  onDragStart: (code: string) => void;
  onDragOver:  (e: any, code: string) => void;
  onDragLeave: () => void;
  onDrop:      (code: string) => void;
  onDragEnd:   () => void;
}) {
  const theme      = getTheme(lang.language_code);
  const code       = lang.language_code;
  const isDragging = draggedCode === code;
  const isDragOver = dragOverCode === code && draggedCode !== code;

  if (Platform.OS === 'web') {
    return (
      <div
        draggable
        onClick={onPress}
        onDragStart={(e: any) => {
          onDragStart(code);
          e.dataTransfer.effectAllowed = 'move';
        }}
        onDragOver={(e: any) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          onDragOver(e, code);
        }}
        onDragLeave={onDragLeave}
        onDrop={(e: any) => {
          e.preventDefault();
          onDrop(code);
        }}
        onDragEnd={onDragEnd}
        style={{
          opacity:     isDragging ? 0.4 : 1,
          borderLeft:  isDragOver ? '2px solid #5B4EFF' : '2px solid transparent',
          cursor:      'grab',
          borderRadius: 6,
          transition:  'opacity 0.15s, border-left 0.1s',
        } as any}
      >
        <View
          style={[
            s.langItem,
            isActive && { backgroundColor: theme.accentLight },
          ]}
        >
          <View style={s.dragHandle} {...{ title: 'Drag to reorder' } as any}>
            <DragHandle color={isActive ? theme.accent : Colors.sidebarLabel} />
          </View>
          <View style={[s.langDot, { backgroundColor: theme.accent }]} />
          <Text
            style={[s.langLabel, isActive && { color: theme.accent, fontFamily: 'Inter_500Medium' }]}
            numberOfLines={1}
          >
            {theme.native}
          </Text>
          <Text style={[s.langStreak, isActive && { color: theme.accent }]}>
            {lang.fluency_percent}%
          </Text>
        </View>
      </div>
    );
  }

  // Mobile — plain TouchableOpacity (no drag)
  return (
    <TouchableOpacity
      style={[s.langItem, isActive && { backgroundColor: theme.accentLight }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[s.langDot, { backgroundColor: theme.accent }]} />
      <Text
        style={[s.langLabel, isActive && { color: theme.accent, fontFamily: 'Inter_500Medium' }]}
        numberOfLines={1}
      >
        {theme.native}
      </Text>
      <Text style={[s.langStreak, isActive && { color: theme.accent }]}>
        {lang.fluency_percent}%
      </Text>
    </TouchableOpacity>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, user } = useAuth();
  const { languages, refetch } = useUserLanguages();

  const [orderedLangs,  setOrderedLangs]  = useState<UserLanguage[]>([]);
  const [draggedCode,   setDraggedCode]   = useState<string | null>(null);
  const [dragOverCode,  setDragOverCode]  = useState<string | null>(null);
  const [popoverOpen,   setPopoverOpen]   = useState(false);
  const [adding,        setAdding]        = useState('');

  // Keep orderedLangs in sync with hook data (unless user is mid-drag)
  const prevLangsRef = useRef<string>('');
  const langsKey = languages.map(l => l.id).join(',');
  if (langsKey !== prevLangsRef.current) {
    prevLangsRef.current = langsKey;
    setOrderedLangs(languages);
  }

  const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'You';

  // Detect active language from pathname
  const langMatch = pathname.match(/\/language\/([^\/\?]+)/);
  const activeCode = langMatch ? langMatch[1] : null;

  function isActive(segment: string) {
    return pathname.startsWith(segment);
  }

  function navigateToLang(code: string) {
    const target = `/language/${code}`;
    if (activeCode) {
      router.replace(target as any);
    } else {
      router.push(target as any);
    }
  }

  // ── Drag handlers (code-based) ──
  function handleDragStart(code: string) { setDraggedCode(code); }

  function handleDragOver(_e: any, code: string) {
    if (code !== draggedCode) setDragOverCode(code);
  }

  function handleDragLeave() { setDragOverCode(null); }

  async function handleDrop(code: string) {
    if (draggedCode && draggedCode !== code) {
      const from = orderedLangs.findIndex(l => l.language_code === draggedCode);
      const to   = orderedLangs.findIndex(l => l.language_code === code);
      if (from !== -1 && to !== -1) {
        const reordered = [...orderedLangs];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(to, 0, moved);
        setOrderedLangs(reordered);
        try {
          await Promise.all(
            reordered.map((l, i) =>
              supabase.from('user_languages').update({ sort_order: i }).eq('id', l.id)
            )
          );
        } catch (e) {
          console.error('[Sidebar reorder]', e);
          refetch();
        }
      }
    }
    setDraggedCode(null);
    setDragOverCode(null);
  }

  function handleDragEnd() {
    setDraggedCode(null);
    setDragOverCode(null);
  }

  async function addLanguage(lang: { code: string; native: string; english: string }) {
    if (adding) return;
    setAdding(lang.code);
    try {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { setAdding(''); return; }
      const { data: existing } = await supabase
        .from('user_languages').select('id')
        .eq('user_id', u.id).eq('language_code', lang.code).maybeSingle();
      if (existing) { setAdding(''); return; }
      const { error } = await supabase.from('user_languages').insert({
        user_id: u.id, language_code: lang.code,
        language_name_en: lang.english, language_name_native: lang.native,
        fluency_percent: 0, exams: [], sort_order: orderedLangs.length,
      });
      if (!error) refetch();
      else console.error('[Sidebar addLanguage]', error.message);
    } finally {
      setAdding('');
    }
  }

  return (
    <View style={s.sidebar}>
      {/* ── Logo ── */}
      <View style={s.logoWrap}>
        <FluentraLogo iconSize={32} textSize={22} />
      </View>

      {/* ── Scrollable nav ── */}
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {/* NAVIGATE section */}
        <Text style={s.sectionLabel}>NAVIGATE</Text>
        <View style={s.navGroup}>
          {NAV_ITEMS.map(({ label, route, pathSegment, Icon }) => {
            const active = isActive(pathSegment);
            return (
              <TouchableOpacity
                key={route}
                style={[s.navItem, active && s.navItemActive]}
                onPress={() => router.push(route as any)}
                activeOpacity={0.7}
              >
                <Icon
                  size={15}
                  color={active ? Colors.sidebarTextActive : Colors.sidebarLabel}
                />
                <Text style={[s.navLabel, active && s.navLabelActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LANGUAGES section */}
        <Text style={[s.sectionLabel, { marginTop: 20 }]}>LANGUAGES</Text>
        <View style={s.navGroup}>
          {orderedLangs.map((lang) => (
            <LangRow
              key={lang.id}
              lang={lang}
              isActive={activeCode === lang.language_code}
              onPress={() => navigateToLang(lang.language_code)}
              draggedCode={draggedCode}
              dragOverCode={dragOverCode}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))}

          <TouchableOpacity
            style={s.addLangItem}
            onPress={() => setPopoverOpen(true)}
            activeOpacity={0.7}
          >
            <PlusIcon size={12} color={Colors.sidebarLabel} />
            <Text style={s.addLangText}>Add language</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── User footer ── */}
      <View style={s.footerWrap}>
        <UserMenu
          name={displayName}
          email={user?.email ?? ''}
          plan={(profile as any)?.subscription_tier ?? 'free'}
        />
      </View>

      {/* ── Add language modal ── */}
      <AddLanguageModal
        visible={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        addedCodes={orderedLangs?.map(l => l.language_code) ?? []}
        addingCode={adding}
        onAdd={addLanguage}
      />
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  sidebar: {
    width:            240,
    backgroundColor:  Colors.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: Colors.sidebarBorder,
    flexShrink:       0,
  },

  logoWrap: {
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.sidebarBorder,
  },

  scroll: { flex: 1 },

  sectionLabel: {
    fontFamily:        'Inter_600SemiBold',
    fontSize:          11,
    color:             Colors.sidebarLabel,
    letterSpacing:     1,
    textTransform:     'uppercase' as const,
    paddingHorizontal: 16,
    paddingTop:        20,
    paddingBottom:     6,
  },
  navGroup: { paddingHorizontal: 8, gap: 1 },

  navItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    height:            32,
    borderRadius:      6,
    paddingHorizontal: 10,
  },
  navItemActive: { backgroundColor: Colors.sidebarActive },
  navLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize:   13,
    color:      Colors.sidebarText,
    flex:       1,
  },
  navLabelActive: {
    fontFamily: 'Inter_500Medium',
    color:      Colors.sidebarTextActive,
  },

  langItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               7,
    height:            32,
    borderRadius:      6,
    paddingHorizontal: 8,
  },
  dragHandle: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab' as any,
  },
  langDot:  { width: 6, height: 6, borderRadius: 3 },
  langLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize:   13,
    color:      Colors.sidebarText,
    flex:       1,
  },
  langStreak: {
    fontFamily: 'Inter_400Regular',
    fontSize:   11,
    color:      Colors.sidebarLabel,
  },

  addLangItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    height:            32,
    borderRadius:      6,
    paddingHorizontal: 10,
    marginTop:         2,
  },
  addLangText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   13,
    color:      Colors.sidebarLabel,
  },

  footerWrap: {
    borderTopWidth: 1,
    borderTopColor: Colors.sidebarBorder,
    padding:        8,
  },
});
