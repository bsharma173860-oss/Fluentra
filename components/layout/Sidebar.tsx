import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput,
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

// ── Search icon ───────────────────────────────────────────────────
function SearchIcon({ size = 12, color = Colors.sidebarLabel }: IconProps) {
  const { Svg, Circle, Line } = require('react-native-svg');
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
      <Line x1="21" y1="21" x2="16.65" y2="16.65" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

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
        <FluentraLogo iconSize={22} textSize={18} />
      </View>

      {/* ── Search bar ── */}
      <View style={s.searchWrap}>
        <View style={s.searchBar}>
          <SearchIcon size={12} color={Colors.sidebarLabel} />
          <TextInput
            style={s.searchInput}
            placeholder="Search..."
            placeholderTextColor={Colors.sidebarLabel}
            editable={false}
          />
        </View>
      </View>

      {/* ── Scrollable nav ── */}
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 8 }}
      >
        {/* LEARN section */}
        <Text style={s.sectionLabel}>LEARN</Text>
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
                <Icon size={14} color={active ? Colors.sidebarTextActive : Colors.sidebarText} />
                <Text style={[s.navLabel, active && s.navLabelActive]}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* LANGUAGES section */}
        <Text style={[s.sectionLabel, { marginTop: 16 }]}>LANGUAGES</Text>
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

      {/* ── User row ── */}
      <View style={s.userWrap}>
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
    width:            220,
    backgroundColor:  Colors.sidebarBg,
    borderRightWidth: 1,
    borderRightColor: Colors.sidebarBorder,
    flexShrink:       0,
  },
  logoWrap: {
    paddingHorizontal: 12,
    paddingTop:        14,
    paddingBottom:     8,
  },

  searchWrap: { paddingHorizontal: 8, paddingBottom: 4 },
  searchBar: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    height:         30,
    backgroundColor: Colors.sidebarInput,
    borderWidth:    1,
    borderColor:    Colors.sidebarInputBorder,
    borderRadius:   6,
    paddingHorizontal: 8,
  },
  searchInput: {
    flex:       1,
    fontFamily: 'Inter_400Regular',
    fontSize:   12,
    color:      Colors.sidebarLabel,
    padding:    0,
  },

  scroll: { flex: 1 },

  sectionLabel: {
    fontFamily:        'Inter_500Medium',
    fontSize:          10,
    color:             Colors.sidebarLabel,
    letterSpacing:     0.6,
    paddingHorizontal: 12,
    paddingTop:        14,
    paddingBottom:     4,
  },
  navGroup: { paddingHorizontal: 6, gap: 1 },

  navItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               7,
    height:            30,
    borderRadius:      6,
    paddingHorizontal: 8,
  },
  navItemActive: { backgroundColor: Colors.sidebarHover },
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
    height:            28,
    borderRadius:      6,
    paddingHorizontal: 8,
  },
  langDot:  { width: 6, height: 6, borderRadius: 3 },
  langLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize:   13,
    color:      Colors.sidebarText,
    flex:       1,
  },

  addLangItem: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               7,
    height:            28,
    borderRadius:      6,
    paddingHorizontal: 8,
  },
  addLangText: {
    fontFamily: 'Inter_400Regular',
    fontSize:   13,
    color:      Colors.sidebarLabel,
  },

  userWrap: {
    paddingHorizontal: 6,
    paddingVertical:   8,
  },
});
