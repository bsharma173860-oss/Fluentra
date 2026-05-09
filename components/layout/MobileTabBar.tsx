import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { T } from '@/constants/theme';
import {
  HomeIcon, BookIcon, TrophyIcon, ChartIcon,
  type IconProps,
} from '@/components/icons';

// Play/Practice icon inline
function PlayIcon({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: 0, height: 0,
        borderTopWidth: size * 0.4,
        borderBottomWidth: size * 0.4,
        borderLeftWidth: size * 0.6,
        borderTopColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: color,
        marginLeft: size * 0.1,
      }} />
    </View>
  );
}

type TabDef = {
  id: string;
  route: string;
  pathSegment: string;
  label: string;
  fab?: boolean;
  Icon?: (p: IconProps) => React.JSX.Element;
};

const TABS: TabDef[] = [
  { id: 'home',     route: '/(tabs)/home',     pathSegment: '/home',     label: 'Home',     Icon: HomeIcon   },
  { id: 'library',  route: '/library',          pathSegment: '/library',  label: 'Library',  Icon: BookIcon   },
  { id: 'practice', route: '/(tabs)/practice',  pathSegment: '/practice', label: '',         fab: true        },
  { id: 'progress', route: '/(tabs)/progress',  pathSegment: '/progress', label: 'Progress', Icon: ChartIcon  },
  { id: 'exams',    route: '/(tabs)/exams',     pathSegment: '/exams',    label: 'Exams',    Icon: TrophyIcon },
];

export function MobileTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={s.wrap}>
      <View style={s.bar}>
        {TABS.map((tab) => {
          const isActive = pathname.includes(tab.pathSegment);

          if (tab.fab) {
            return (
              <TouchableOpacity
                key={tab.id}
                style={s.fabWrap}
                onPress={() => router.push(tab.route as any)}
                activeOpacity={0.85}
              >
                <View style={s.fab}>
                  <PlayIcon size={22} color="#fff" />
                </View>
              </TouchableOpacity>
            );
          }

          const IconComp = tab.Icon!;
          return (
            <TouchableOpacity
              key={tab.id}
              style={s.tabBtn}
              onPress={() => router.push(tab.route as any)}
              activeOpacity={0.7}
            >
              {isActive && <View style={s.activeHighlight} />}
              <View style={s.iconWrap}>
                <IconComp
                  size={22}
                  color={isActive ? T.brand : T.ink4}
                />
              </View>
              {tab.label ? (
                <Text style={[s.label, isActive && s.labelActive]}>
                  {tab.label}
                </Text>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    paddingHorizontal: 14,
    paddingBottom: 18,
    paddingTop: 10,
    flexShrink: 0,
  },
  bar: {
    height: 64,
    backgroundColor: 'rgba(252,250,246,0.92)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    // Shadow
    shadowColor: '#14100A',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.10,
    shadowRadius: 40,
    elevation: 12,
  },
  tabBtn: {
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    position: 'relative',
  },
  activeHighlight: {
    position: 'absolute',
    top: 6,
    width: 48,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.brand + '14',
    zIndex: 0,
  },
  iconWrap: {
    zIndex: 1,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_400Regular',
    color: T.ink4,
    zIndex: 1,
  },
  labelActive: {
    fontFamily: 'Inter_700Bold',
    color: T.brand,
  },
  fabWrap: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fab: {
    position: 'absolute',
    top: -22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: T.brand,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.95)',
    shadowColor: T.brand,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 28,
    elevation: 16,
  },
});
