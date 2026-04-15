import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { supabase } from '@/lib/supabase';
import { getLangNames } from '@/constants/languages';
import { FluentraLogo } from '@/components/FluentraLogo';
import {
  HomeIcon, TrophyIcon, BookIcon, ChartIcon, GearIcon,
  PlusIcon, ChevronRightIcon, type IconProps,
} from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';
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

const LANG_FLAG_BG: Record<string, string> = {
  en: '#E8EDFF', es: '#FFF0E5', fr: '#E5F5EC',
  de: '#FFFBE5', pt: '#E5F5EC', zh: '#FFE5E5',
  ja: '#FFE5F5', ko: '#E5EEFF', ar: '#E5F5F0', it: '#FFF3E5',
};

// ── Sidebar ───────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, user } = useAuth();

  const [languages, setLanguages] = useState<UserLanguage[]>([]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_languages').select('*').eq('user_id', user.id)
      .then(({ data }) => { if (data) setLanguages(data as UserLanguage[]); });
  }, [user?.id]);

  const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'You';
  const initial     = displayName[0]?.toUpperCase() ?? '?';

  function isActive(segment: string) {
    return pathname.startsWith(segment);
  }

  return (
    <View style={s.sidebar}>
      {/* ── Logo ── */}
      <View style={s.logoWrap}>
        <FluentraLogo iconSize={24} textSize={20} />
      </View>

      {/* ── Scrollable nav + languages ── */}
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
                <Icon size={16} color={active ? Colors.ink : Colors.ink3} />
                <Text style={[s.navLabel, active && s.navLabelActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LANGUAGES section */}
        <Text style={[s.sectionLabel, { marginTop: 16 }]}>LANGUAGES</Text>
        <View style={s.navGroup}>
          {languages.map(lang => {
            const names  = getLangNames(lang.language_code);
            const flagBg = LANG_FLAG_BG[lang.language_code] ?? Colors.bg2;
            const route  = `/language/${lang.language_code}`;
            const active = pathname.startsWith(route);
            return (
              <TouchableOpacity
                key={lang.id}
                style={[s.langItem, active && s.navItemActive]}
                onPress={() => router.push(route as any)}
                activeOpacity={0.7}
              >
                <View style={[s.langFlag, { backgroundColor: flagBg }]}>
                  <Text style={s.langFlagText}>{names.flag}</Text>
                </View>
                <Text style={[s.langLabel, active && s.navLabelActive]} numberOfLines={1}>
                  {names.native}
                </Text>
                <Text style={s.langStreak}>{lang.fluency_percent}%</Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={s.addLangItem}
            onPress={() => router.push('/(tabs)/home' as any)}
            activeOpacity={0.7}
          >
            <PlusIcon size={14} color={Colors.ink3} />
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
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const s = StyleSheet.create({
  sidebar: {
    width:            256,
    backgroundColor:  Colors.bgSidebar,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    flexShrink:       0,
  },
  logoWrap: {
    paddingHorizontal: 16,
    paddingTop:        16,
    paddingBottom:     8,
  },
  scroll: { flex: 1 },

  sectionLabel: {
    fontFamily:        'Inter_600SemiBold',
    fontSize:          10,
    color:             Colors.ink3,
    letterSpacing:     0.8,
    paddingHorizontal: 16,
    paddingTop:        16,
    paddingBottom:     6,
  },
  navGroup: { paddingHorizontal: 8, gap: 1 },

  navItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    height:            34,
    borderRadius:      6,
    paddingHorizontal: 10,
  },
  navItemActive: { backgroundColor: Colors.bgHover },
  navLabel:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink2, flex: 1 },
  navLabelActive:{ fontFamily: 'Inter_500Medium',  fontSize: 14, color: Colors.ink  },

  langItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    height:            34,
    borderRadius:      6,
    paddingHorizontal: 10,
  },
  langFlag:     { width: 20, height: 14, borderRadius: 3, alignItems: 'center', justifyContent: 'center' },
  langFlagText: { fontSize: 11 },
  langLabel:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink2, flex: 1 },
  langStreak:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: Colors.p },

  addLangItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               8,
    height:            34,
    borderRadius:      6,
    paddingHorizontal: 10,
  },
  addLangText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },

  footerWrap: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding:        8,
  },
});
