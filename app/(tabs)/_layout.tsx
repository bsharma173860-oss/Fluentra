import React from 'react';
import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import {
  HomeIcon, TrophyIcon, ChartIcon, PersonIcon,
  type IconProps,
} from '@/components/icons';

// ── Tab definitions (mobile bar) ──────────────────────────────────
type TabItem = {
  name:  string;
  label: string;
  Icon:  (p: IconProps) => React.JSX.Element;
};

const TABS: TabItem[] = [
  { name: 'home/index',     label: 'Home',     Icon: HomeIcon   },
  { name: 'exams/index',    label: 'Exams',    Icon: TrophyIcon },
  { name: 'progress/index', label: 'Progress', Icon: ChartIcon  },
  { name: 'profile/index',  label: 'Profile',  Icon: PersonIcon },
];

// ── Mobile tab icon ───────────────────────────────────────────────
function TabIcon({ focused, Icon, label }: { focused: boolean; Icon: TabItem['Icon']; label: string }) {
  return (
    <View style={[tb.item, focused && tb.itemActive]}>
      <Icon size={20} color={focused ? Colors.p : Colors.ink3} />
      <Text style={[tb.label, focused && tb.labelActive]}>{label}</Text>
    </View>
  );
}

// ── Root tabs layout ──────────────────────────────────────────────
export default function TabLayout() {
  const { width } = useWindowDimensions();
  const isDesktop  = Platform.OS === 'web' && width >= 768;

  // Hide bottom tab bar on desktop — each page's AppLayout provides the sidebar
  const tabBarStyle = isDesktop ? ({ display: 'none' } as const) : tb.bar;

  return (
    <Tabs
      screenOptions={{
        headerShown:         false,
        tabBarShowLabel:     false,
        tabBarStyle,
        ...({ sceneContainerStyle: { backgroundColor: Colors.bg } } as object),
      }}
    >
      {TABS.map(({ name, label, Icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title: label,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} Icon={Icon} label={label} />
            ),
          }}
        />
      ))}
      {/* Pages accessible from sidebar / navigation but not shown in mobile tab bar */}
      <Tabs.Screen name="scores/index"      options={{ href: null }} />
      <Tabs.Screen name="practice/index"    options={{ href: null }} />
      <Tabs.Screen name="settings/index"    options={{ href: null }} />
      <Tabs.Screen name="settings/account"  options={{ href: null }} />
    </Tabs>
  );
}

// ── Mobile tab bar styles ─────────────────────────────────────────
const tb = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(249,248,245,0.97)',
    borderTopWidth:  1,
    borderTopColor:  Colors.border,
    height:          72,
    paddingBottom:   12,
    paddingTop:      6,
    elevation:       0,
    shadowOpacity:   0,
  },
  item: {
    alignItems:        'center',
    justifyContent:    'center',
    gap:               3,
    paddingHorizontal: 8,
  },
  itemActive: {},
  label:      { fontFamily: 'Inter_400Regular', fontSize: 10, color: Colors.ink3 },
  labelActive:{ fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.p   },
});
