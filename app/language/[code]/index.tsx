import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { T } from '@/constants/theme';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { FlagSVG } from '@/components/flags';
import { getTheme } from '@/constants/languageThemes';

const MODULES = [
  { key: 'speaking',  title: 'Speaking',  color: T.speaking,  bg: T.speakingBg,  route: '/modules/speaking/session',  emoji: '🎤' },
  { key: 'writing',   title: 'Writing',   color: T.writing,   bg: T.writingBg,   route: '/modules/writing/session',   emoji: '✍️' },
  { key: 'listening', title: 'Listening', color: T.listening, bg: T.listeningBg, route: '/modules/listening/session', emoji: '🎧' },
  { key: 'reading',   title: 'Reading',   color: T.reading,   bg: T.readingBg,   route: '/modules/reading/session',   emoji: '📖' },
];

export default function LanguageDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const { user } = useAuth();
  const theme = getTheme(code || 'en');
  const [langData, setLangData] = useState<{ streak_days: number; target_exam: string } | null>(null);

  useEffect(() => {
    if (!user || !code) return;
    supabase.from('user_languages').select('*').eq('user_id', user.id).eq('language_code', code).single()
      .then(({ data }) => setLangData(data as any));
  }, [user, code]);

  const streak = langData?.streak_days ?? 0;
  const exam = langData?.target_exam ?? 'IELTS';

  const content = (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <View style={[s.hero, { backgroundColor: theme.accent }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backBtnText}>←</Text>
        </TouchableOpacity>
        <View style={s.heroContent}>
          <View style={s.flagWrap}>
            <FlagSVG code={code || 'en'} width={64} height={43} />
          </View>
          <Text style={s.heroLanguage}>{code?.toUpperCase()}</Text>
          <View style={s.heroBadges}>
            <View style={s.heroBadge}><Text style={s.heroBadgeText}>{exam}</Text></View>
            <View style={s.heroBadge}><Text style={s.heroBadgeText}>🔥 {streak}-day streak</Text></View>
          </View>
          <Text style={s.heroScore}>7.0</Text>
          <Text style={s.heroScoreLabel}>Current band</Text>
        </View>
      </View>

      {/* Quick actions */}
      <View style={s.quickActions}>
        <TouchableOpacity style={s.quickAction} onPress={() => router.push(`/language/${code}/vocab` as any)}>
          <Text style={s.quickActionEmoji}>📚</Text>
          <Text style={s.quickActionText}>Vocab</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickAction} onPress={() => router.push(`/language/${code}/grammar` as any)}>
          <Text style={s.quickActionEmoji}>📝</Text>
          <Text style={s.quickActionText}>Grammar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickAction} onPress={() => router.push(`/language/${code}/tutor` as any)}>
          <Text style={s.quickActionEmoji}>💬</Text>
          <Text style={s.quickActionText}>Tutor</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.quickAction} onPress={() => router.push('/(tabs)/exams' as any)}>
          <Text style={s.quickActionEmoji}>🏆</Text>
          <Text style={s.quickActionText}>Exams</Text>
        </TouchableOpacity>
      </View>

      {/* Modules */}
      <Text style={s.sectionTitle}>Practice modules</Text>
      <View style={isDesktop ? s.moduleGridDesktop : s.moduleGrid}>
        {MODULES.map(m => (
          <TouchableOpacity key={m.key} style={[s.moduleCard, { backgroundColor: m.bg, borderColor: m.color + '22' }]} onPress={() => router.push(m.route as any)} activeOpacity={0.85}>
            <View style={[s.moduleIcon, { backgroundColor: m.color }]}>
              <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
            </View>
            <Text style={[s.moduleTitle, { color: m.color }]}>{m.title}</Text>
            <Text style={s.moduleScore}>7.0 /9</Text>
            <Text style={[s.moduleCta, { color: m.color }]}>Practice →</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Progress strip */}
      <View style={s.progressCard}>
        <Text style={s.progressCardTitle}>This week</Text>
        <View style={s.weekRow}>
          {['M','T','W','T','F','S','S'].map((d, i) => {
            const done = i < 4;
            return (
              <View key={i} style={s.dayCell}>
                <View style={[s.dayDot, done && { backgroundColor: theme.accent }]}>
                  <Text style={[s.dayDotText, done && { color: '#fff' }]}>{done ? '✓' : d}</Text>
                </View>
                <Text style={s.dayLabel}>{d}</Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );

  if (isDesktop) return <AppLayout languageCode={code}>{content}</AppLayout>;
  return <SafeAreaView style={s.safe} edges={['top']}>{content}</SafeAreaView>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: { paddingBottom: 20 },

  hero: { padding: 28, paddingBottom: 40, gap: 12 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  backBtnText: { fontSize: 18, color: '#fff' },
  heroContent: { alignItems: 'center', gap: 10 },
  flagWrap: { borderRadius: 6, overflow: 'hidden' },
  heroLanguage: { fontFamily: T.serif, fontSize: 44, color: '#fff', lineHeight: 50 },
  heroBadges: { flexDirection: 'row', gap: 8 },
  heroBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 99 },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  heroScore: { fontFamily: T.serif, fontSize: 56, color: '#fff', lineHeight: 64 },
  heroScoreLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: '600' },

  quickActions: { flexDirection: 'row', padding: 16, gap: 10 },
  quickAction: { flex: 1, backgroundColor: T.card, borderRadius: 14, padding: 14, alignItems: 'center', gap: 6, borderWidth: 1, borderColor: T.border },
  quickActionEmoji: { fontSize: 22 },
  quickActionText: { fontSize: 11, fontWeight: '700', color: T.ink2 },

  sectionTitle: { fontSize: 13, fontWeight: '700', color: T.ink, paddingHorizontal: 16, marginBottom: 10 },

  moduleGrid: { paddingHorizontal: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  moduleGridDesktop: { paddingHorizontal: 16, flexDirection: 'row', gap: 14 },
  moduleCard: { width: '47%', borderRadius: 16, padding: 16, borderWidth: 1, gap: 10 },
  moduleIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  moduleTitle: { fontSize: 15, fontWeight: '700' },
  moduleScore: { fontFamily: T.serif, fontSize: 22, color: T.ink },
  moduleCta: { fontSize: 11.5, fontWeight: '700' },

  progressCard: { backgroundColor: T.card, margin: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: T.border, gap: 12 },
  progressCardTitle: { fontSize: 13, fontWeight: '700', color: T.ink },
  weekRow: { flexDirection: 'row', gap: 6 },
  dayCell: { flex: 1, alignItems: 'center', gap: 4 },
  dayDot: { width: '100%', aspectRatio: 1, maxWidth: 38, borderRadius: 9, backgroundColor: T.bg2, borderWidth: 1, borderColor: T.border, alignItems: 'center', justifyContent: 'center' },
  dayDotText: { fontSize: 11, fontWeight: '700', color: T.ink5 },
  dayLabel: { fontSize: 9, color: T.ink4 },
});
