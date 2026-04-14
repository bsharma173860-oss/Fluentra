import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

function TabIcon({ focused, icon, label }: { focused: boolean; icon: string; label: string }) {
  return (
    <View style={[t.item, focused && t.itemActive]}>
      <Text style={t.icon}>{icon}</Text>
      <Text style={[t.label, focused && t.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: t.bar,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" label="Home" /> }}
      />
      <Tabs.Screen
        name="exams/index"
        options={{ title: 'Exams', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏆" label="Exams" /> }}
      />
      <Tabs.Screen
        name="progress/index"
        options={{ title: 'Progress', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="📊" label="Progress" /> }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" label="Profile" /> }}
      />
      {/* Legacy screens — hidden from tab bar */}
      <Tabs.Screen name="scores/index"   options={{ href: null }} />
      <Tabs.Screen name="practice/index" options={{ href: null }} />
    </Tabs>
  );
}

const t = StyleSheet.create({
  bar: {
    backgroundColor: 'rgba(250,250,248,0.97)',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 72,
    paddingBottom: 12,
    paddingTop: 6,
    elevation: 0,
    shadowOpacity: 0,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    minWidth: 52,
  },
  itemActive: { backgroundColor: Colors.p_soft },
  icon: { fontSize: 20 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 10, color: Colors.ink3 },
  labelActive: { fontFamily: 'Inter_600SemiBold', color: Colors.p },
});
