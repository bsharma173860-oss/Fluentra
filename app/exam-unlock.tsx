/**
 * exam-unlock.tsx
 * Shown when a user reaches the streak threshold and unlocks monthly exams.
 * UI TBD — shell ready for design handoff.
 */
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function ExamUnlock() {
  const { languageCode, examType } = useLocalSearchParams<{
    languageCode: string;
    examType: string;
  }>();

  return (
    <View style={s.container}>
      <Text style={s.placeholder}>exam-unlock — UI coming</Text>
      <Text style={s.meta}>{languageCode} · {examType}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F5' },
  placeholder: { fontSize: 16, color: '#999' },
  meta:        { fontSize: 12, color: '#BBB', marginTop: 8 },
});
