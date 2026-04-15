import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/lib/authContext';
import { FluentraLogo } from '@/components/FluentraLogo';
import {
  HomeIcon, TrophyIcon, BookIcon, ChartIcon, GearIcon,
  PlusIcon, type IconProps,
} from '@/components/icons';
import { UserMenu } from '@/components/layout/UserMenu';
import { useUserLanguages } from '@/hooks/useUserLanguages';
import { getTheme } from '@/constants/languageThemes';

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

// ── Sidebar ───────────────────────────────────────────────────────
export function Sidebar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { profile, user } = useAuth();
  const { languages } = useUserLanguages();

  const displayName = profile?.name ?? user?.email?.split('@')[0] ?? 'You';

  function isActive(segment: string) {
    return pathname.startsWith(segment);
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
          {languages.map(lang => {
            const theme  = getTheme(lang.language_code);
            const route  = `/language/${lang.language_code}`;
            const active = pathname.startsWith(route);
            return (
              <TouchableOpacity
                key={lang.id}
                style={[s.langItem, active && s.navItemActive]}
                onPress={() => router.push(route as any)}
                activeOpacity={0.7}
              >
                <View style={[s.langDot, { backgroundColor: theme.accent }]} />
                <Text style={[s.langLabel, active && s.navLabelActive]} numberOfLines={1}>
                  {theme.native}
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
    gap:               8,
    height:            32,
    borderRadius:      6,
    paddingHorizontal: 10,
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
