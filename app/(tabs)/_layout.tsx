import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

function TabIcon({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: string;
  label: string;
}) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icon}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🏠" label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="practice/index"
        options={{
          title: 'Practice',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="🎙" label="Practice" />
          ),
        }}
      />
      <Tabs.Screen
        name="exams/index"
        options={{
          title: 'Exams',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📋" label="Exams" />
          ),
        }}
      />
      <Tabs.Screen
        name="scores/index"
        options={{
          title: 'Scores',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="📊" label="Scores" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="👤" label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 52,
  },
  tabItemActive: {
    backgroundColor: Colors.p_soft,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabIconActive: {},
  tabLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    color: Colors.ink3,
  },
  tabLabelActive: {
    fontFamily: 'Inter_600SemiBold',
    color: Colors.p,
  },
});
