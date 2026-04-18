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
import { AddLanguagePopover } from '@/components/ui/AddLanguagePopover';
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

// ── Save reordered sort_order to Supabase ─────────────────────────
async function saveSortOrder(languages: UserLanguage[]) {
  const updates = languages.map((l, i) => ({
    id: l.id,
    user_id: l.user_id,
    sort_order: i,
  }));
  await supabase.from('user_languages').upsert(updates, { onConflict: 'id' });
}

// ── Language row with drag (web only) ────────────────────────────
function LangRow({
  lang,
  isActive,
  onPress,
  onDragStart,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget,
}: {
  lang:         UserLanguage;
  isActive:     boolean;
  onPress:      () => void;
  onDragStart:  () => void;
  onDragOver:   (e: any) => void;
  onDrop:       () => void;
  isDragging:   boolean;
  isDropTarget: boolean;
}) {
  const theme = getTheme(lang.language_code);

  const dragProps = Platform.OS === 'web' ? {
    draggable: true,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd: () => { /* handled by parent */ },
  } as any : {};

  return (
    <View>
      {/* Drop indicator line above */}
      {isDropTarget && <View style={s.dropLine} />}
      <TouchableOpacity
        style={[
          s.langItem,
          isActive && { backgroundColor: theme.accentLight },
          isDragging && s.langItemDragging,
        ]}
        onPress={onPress}
        activeOpacity={0.7}
        {...dragProps}
      >
        {Platform.OS === 'web' && (
          <View style={s.dragHandle} {...{ title: 'Drag to reorder' } as any}>
            <DragHandle color={isActive ? theme.accent : Colors.sidebarLabel} />
          </View>
        )}
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
    </View>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, user } = useAuth();
  const { languages, refetch } = useUserLanguages();

  const [orderedLangs, setOrderedLangs] = useState<UserLanguage[]>([]);
  const [dragIndex,    setDragIndex]    = useState<number | null>(null);
  const [dropIndex,    setDropIndex]    = useState<number | null>(null);
  const [popoverOpen,  setPopoverOpen]  = useState(false);

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

  // ── Drag handlers ──
  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: any, index: number) {
    e.preventDefault?.();
    if (index !== dragIndex) setDropIndex(index);
  }

  async function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    const reordered = [...orderedLangs];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    setOrderedLangs(reordered);
    setDragIndex(null);
    setDropIndex(null);
    await saveSortOrder(reordered);
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
          {orderedLangs.map((lang, index) => (
            <LangRow
              key={lang.id}
              lang={lang}
              isActive={activeCode === lang.language_code}
              onPress={() => navigateToLang(lang.language_code)}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              isDragging={dragIndex === index}
              isDropTarget={dropIndex === index && dragIndex !== index}
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

      {/* ── Add language popover ── */}
      <AddLanguagePopover
        visible={popoverOpen}
        onClose={() => setPopoverOpen(false)}
        existingCodes={orderedLangs.map(l => l.language_code)}
        onAdded={() => { refetch(); }}
        placement="sidebar"
        totalCount={orderedLangs.length}
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
  langItemDragging: { opacity: 0.4 },
  dragHandle: {
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab' as any,
  },
  dropLine: {
    height:          2,
    backgroundColor: Colors.p,
    borderRadius:    1,
    marginHorizontal: 8,
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
