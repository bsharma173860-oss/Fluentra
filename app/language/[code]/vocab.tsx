/**
 * language/[code]/vocab.tsx
 * Vocabulary bank and flashcard practice for a language.
 * Route: /language/:code/vocab
 * UI TBD — shell ready for design handoff.
 */
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function VocabScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();

  return (
    <View style={s.container}>
      <Text style={s.placeholder}>vocab — UI coming</Text>
      <Text style={s.meta}>{code}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9F8F5' },
  placeholder: { fontSize: 16, color: '#999' },
  meta:        { fontSize: 12, color: '#BBB', marginTop: 8 },
});
