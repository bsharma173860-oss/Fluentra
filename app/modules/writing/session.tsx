/**
 * modules/writing/session.tsx
 * Timed writing session (single-task generic entry point).
 * Routes: /modules/writing/session?examId=&taskType=task1|task2&languageCode=
 * UI TBD — shell ready for design handoff.
 */
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function WritingSession() {
  const { examId, taskType, languageCode } = useLocalSearchParams<{
    examId: string;
    taskType: 'task1' | 'task2';
    languageCode: string;
  }>();

  return (
    <View style={s.container}>
      <Text style={s.placeholder}>writing/session — UI coming</Text>
      <Text style={s.meta}>{examId} · {taskType} · {languageCode}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F5' },
  placeholder: { fontSize: 16, color: '#999' },
  meta:        { fontSize: 12, color: '#BBB', marginTop: 8 },
});
