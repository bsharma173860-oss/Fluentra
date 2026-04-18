import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Colors } from '@/constants/colors';
import { getLangNames } from '@/constants/languages';
import { getFoundation } from '@/constants/foundationContent';
import { ChevronLeftIcon } from '@/components/icons';

export default function FoundationScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const langCode  = code ?? 'en';
  const langName  = getLangNames(langCode).english;
  const foundation = getFoundation(langCode);

  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.content}
        >
          {/* Header */}
          <View style={s.header}>
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <ChevronLeftIcon size={14} color={Colors.ink2} />
            </TouchableOpacity>
            <View style={s.headerText}>
              <Text style={s.title}>Foundation</Text>
              <Text style={s.subtitle}>{langName}</Text>
            </View>
          </View>

          {!foundation ? (
            <View style={s.empty}>
              <Text style={s.emptyText}>
                Foundation coming soon for this language.
              </Text>
            </View>
          ) : (
            foundation.sections.map(section => (
              <TouchableOpacity
                key={section.id}
                onPress={() => router.push({
                  pathname: `/language/${langCode}/lesson` as any,
                  params: { sectionId: section.id, code: langCode },
                })}
                style={s.sectionCard}
                activeOpacity={0.85}
              >
                <View style={s.secIconBox}>
                  <Text style={s.secIcon}>{section.icon}</Text>
                </View>

                <View style={s.secBody}>
                  <Text style={s.secTitle}>{section.title}</Text>
                  <Text style={s.secDesc} numberOfLines={2}>
                    {section.description}
                  </Text>
                  <Text style={s.secCount}>
                    {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''}
                  </Text>
                </View>

                <Text style={s.secArrow}>›</Text>
              </TouchableOpacity>
            ))
          )}

          <View style={{ height: 48 }} />
        </ScrollView>
      </SafeAreaView>
    </AppLayout>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: Colors.bg },
  content: { paddingHorizontal: 20, paddingTop: 20 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  backBtn: {
    width: 28, height: 28, borderRadius: 6,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  headerText: { flex: 1 },
  title:    { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.textPrimary },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  sectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    padding: 18,
    marginBottom: 10,
  },
  secIconBox: {
    width: 48, height: 48,
    borderRadius: 12,
    backgroundColor: '#F4F4F4',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  secIcon:  { fontSize: 24 },
  secBody:  { flex: 1 },
  secTitle: { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#000' },
  secDesc:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888', marginTop: 2 },
  secCount: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#AAA', marginTop: 6 },
  secArrow: { fontSize: 22, color: '#CCC' },

  empty: { paddingTop: 60, alignItems: 'center' },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
