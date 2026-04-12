import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function ListeningLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
        animation: 'slide_from_right',
      }}
    />
  );
}
