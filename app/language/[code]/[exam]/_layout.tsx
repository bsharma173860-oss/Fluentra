import { Stack } from 'expo-router';
import { Colors } from '@/constants/colors';

export default function ExamLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.bg },
        animation: 'slide_from_right',
        // No swipe-back gesture during active exam flow
        gestureEnabled: false,
      }}
    />
  );
}
