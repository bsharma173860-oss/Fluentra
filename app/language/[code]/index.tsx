import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { getTheme } from '@/constants/languageThemes';
import { getExamsForLanguage } from '@/constants/languageExams';
import {
  MicIcon, PenIcon, HeadphoneIcon, BookIcon, FileTextIcon,
  TrophyIcon, MessageCircleIcon, FlameIcon, ChevronRightIcon,
  LockIcon, CheckIcon,
} from '@/components/icons';
import { getExamFormat } from '@/constants/examFormats';

const MODULE_COLORS: Record<string, string> = {
  speaking: '#5B4EFF',
  writing:  '#B07A10',
  listening:'#0A8C5A',
  reading:  '#C04A06',
};

// Module routes: practice modules go to existing select pages
const MODULE_ROUTES: Record<string, string> = {
  speaking:  '/modules/speaking/select',
  writing:   '/modules/writing/select',
  listening: '/modules/listening/select',
  reading:   '/modules/reading/select',
};

type Tab = 'practice' | 'dashboard' | 'exams';

// ── Main screen ───────────────────────────────────────────────────
export default function LanguagePage() {
  const params   = useLocalSearchParams();
  const code     = ((params.code ?? params.languageCode ?? 'en') as string);
  const theme    = getTheme(code);
  const { profile } = useAuth();

  const [activeTab,    setActiveTab]    = useState<Tab>('practice');
  const [streak,       setStreak]       = useState(0);
  const [examUnlocked, setExamUnlocked] = useState(false);

  useEffect(() => { loadData(); }, [code]);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_languages')
      .select('streak_count, exam_unlocked')
      .eq('user_id', user.id)
      .eq('language_code', code)
      .maybeSingle();

    if (data) {
      setStreak((data as any).streak_count ?? 0);
      setExamUnlocked((data as any).exam_unlocked ?? false);
    }
  }

  const isPro       = profile?.subscription_tier === 'pro';
  const level       = streak < 8 ? 'B1' : streak < 21 ? 'B2' : streak < 36 ? 'C1' : 'C2';
  const name        = theme.native;
  const flag        = theme.flag;
  const primaryExam = getExamsForLanguage(code)[0];

  // Get formats for the primary exam to derive dynamic descriptions
  const listeningFmt = getExamFormat(primaryExam.id, 'listening');
  const readingFmt   = getExamFormat(primaryExam.id, 'reading');
  const writingFmt   = getExamFormat(primaryExam.id, 'writing');
  const speakingFmt  = getExamFormat(primaryExam.id, 'speaking');
  const hasSpeaking  = (speakingFmt?.parts?.length ?? 0) > 0;

  function navigate(module: string) {
    const route = MODULE_ROUTES[module] ?? `/language/${code}/${module}`;
    router.push({ pathname: route as any, params: { languageCode: code, code } });
  }

  const ALL_MODULES = [
    {
      id: 'speaking',
      title: 'Speaking',
      desc: speakingFmt
        ? `${speakingFmt.parts.length} parts · ${speakingFmt.totalTime ?? 'AI examiner'}`
        : 'AI examiner · Parts 1–3',
      Icon: MicIcon,
      color: MODULE_COLORS.speaking,
      time: speakingFmt?.totalTime ?? '11–14 min',
      free: true,
      hidden: !hasSpeaking,
    },
    {
      id: 'writing',
      title: 'Writing',
      desc: writingFmt
        ? `${writingFmt.tasks.length} task${writingFmt.tasks.length !== 1 ? 's' : ''} · AI graded`
        : 'Essay + Task 1 · AI graded',
      Icon: PenIcon,
      color: MODULE_COLORS.writing,
      time: writingFmt ? `${writingFmt.tasks.reduce((s, t) => s + t.timeMinutes, 0)} min` : '60 min',
      free: true,
      hidden: false,
    },
    {
      id: 'listening',
      title: 'Listening',
      desc: listeningFmt
        ? `${listeningFmt.sections.length} sections · ${listeningFmt.totalQuestions} questions`
        : '4 sections · Real audio',
      Icon: HeadphoneIcon,
      color: MODULE_COLORS.listening,
      time: listeningFmt ? `${listeningFmt.timeMinutes} min` : '40 min',
      free: true,
      hidden: false,
    },
    {
      id: 'reading',
      title: 'Reading',
      desc: readingFmt
        ? `${readingFmt.passages.length} passages · ${readingFmt.totalQuestions} questions`
        : '3 passages · 40 questions',
      Icon: FileTextIcon,
      color: MODULE_COLORS.reading,
      time: readingFmt ? `${readingFmt.timeMinutes} min` : '60 min',
      free: false,
      hidden: false,
    },
  ];

  const PRACTICE_MODULES = ALL_MODULES.filter(m => !m.hidden);

  const SKILLS = [
    { name: 'Speaking',  color: '#5B4EFF', score: 0 },
    { name: 'Writing',   color: '#B07A10', score: 0 },
    { name: 'Listening', color: '#0A8C5A', score: 0 },
    { name: 'Reading',   color: '#C04A06', score: 0 },
  ];

  return (
    <AppLayout languageCode={code}>
      <ScrollView style={s.container} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.breadcrumb}>Home / {name}</Text>
          <View style={s.headerRow}>
            <Text style={s.flag}>{flag}</Text>
            <Text style={s.langTitle}>{name}</Text>
            <View style={[s.streakPill, { backgroundColor: theme.bg }]}>
              <FlameIcon size={11} color={theme.accent} />
              <Text style={[s.streakPillText, { color: theme.accent }]}>
                {streak > 0 ? `Day ${streak}` : 'Start streak'}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Tab bar ── */}
        <View style={s.tabBar}>
          {(['practice', 'dashboard', 'exams'] as Tab[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && { borderBottomColor: theme.accent, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[s.tabText, activeTab === tab && { color: theme.accent, fontFamily: 'Inter_600SemiBold' }]}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ══════════════════════ PRACTICE TAB ══════════════════════ */}
        {activeTab === 'practice' && (
          <View style={s.tabContent}>

            {/* Foundation */}
            <TouchableOpacity
              style={[s.foundCard, { backgroundColor: theme.accentLight, borderColor: theme.accent + '30' }]}
              onPress={() => navigate('foundation')}
              activeOpacity={0.85}
            >
              <View style={s.foundIcon}>
                <BookIcon size={20} color={theme.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.foundTitle}>Foundation</Text>
                <Text style={s.foundDesc}>Scripts · Vocabulary · Grammar</Text>
              </View>
              <View style={s.optionalBadge}><Text style={s.optionalText}>Optional</Text></View>
              <ChevronRightIcon size={16} color="#CCC" />
            </TouchableOpacity>

            {/* 2×2 module grid */}
            <View style={s.moduleGrid}>
              {PRACTICE_MODULES.map(mod => (
                <TouchableOpacity
                  key={mod.id}
                  style={s.moduleCard}
                  activeOpacity={0.88}
                  onPress={() => {
                    if (!mod.free && !isPro) { router.push('/upgrade' as any); return; }
                    navigate(mod.id);
                  }}
                >
                  <View style={[s.modCardTop, { backgroundColor: mod.color + '18' }]}>
                    <View style={[s.modIconCircle, { backgroundColor: mod.color + '22' }]}>
                      <mod.Icon size={24} color={mod.color} />
                    </View>
                  </View>
                  <View style={s.modCardBody}>
                    <Text style={s.modTitle}>{mod.title}</Text>
                    <Text style={s.modDesc}>{mod.desc}</Text>
                    <View style={s.modTags}>
                      <View style={s.modTag}><Text style={s.modTagText}>{mod.time}</Text></View>
                      <View style={[s.modTag, { backgroundColor: primaryExam.bg }]}>
                        <Text style={[s.modTagText, { color: primaryExam.color }]}>{primaryExam.name}</Text>
                      </View>
                      {!mod.free && (
                        <View style={[s.modTag, { backgroundColor: '#FEF9EC' }]}>
                          <Text style={[s.modTagText, { color: '#B07A10' }]}>Pro</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  {!mod.free && !isPro && (
                    <View style={s.lockOverlay}><LockIcon size={14} color="#888" /></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Personal Practice Exam */}
            <View style={[s.examCard, { backgroundColor: theme.accentLight, borderColor: theme.accent + '30' }]}>
              <View style={{ flex: 1 }}>
                <Text style={s.examCardTitle}>Personal Practice Exam</Text>
                <Text style={s.examCardDesc}>Full exam · All 4 modules · Strict format</Text>
                <View style={s.examTags}>
                  {['Pro only', 'Counts in streak', 'Private results'].map(tag => (
                    <View key={tag} style={[s.examTag, { backgroundColor: theme.accent + '20' }]}>
                      <Text style={[s.examTagText, { color: theme.accent }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={s.examCardRight}>
                <TouchableOpacity
                  style={[s.startExamBtn, { backgroundColor: isPro ? theme.accent : '#CCC' }]}
                  onPress={() => isPro ? navigate('exam') : router.push('/upgrade' as any)}
                  activeOpacity={0.85}
                >
                  <Text style={s.startExamText}>{isPro ? 'Start Exam' : 'Upgrade'}</Text>
                </TouchableOpacity>
                <Text style={s.examNote}>Results stay private</Text>
                <Text style={s.examNote}>No 9-day wait</Text>
              </View>
            </View>

            {/* AI Tutor */}
            <TouchableOpacity style={s.tutorCard} onPress={() => navigate('tutor')} activeOpacity={0.85}>
              <View style={[s.tutorIcon, { backgroundColor: theme.accent }]}>
                <MessageCircleIcon size={20} color="#FFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.tutorTitle}>AI Tutor</Text>
                <Text style={s.tutorDesc}>Grammar · Vocabulary · Conversation</Text>
                <Text style={s.tutorTokens}>{isPro ? 'Unlimited messages' : '10 messages/day free'}</Text>
              </View>
              <ChevronRightIcon size={16} color="#CCC" />
            </TouchableOpacity>

          </View>
        )}

        {/* ══════════════════════ DASHBOARD TAB ══════════════════════ */}
        {activeTab === 'dashboard' && (
          <View style={s.tabContent}>

            {/* Stats row */}
            <View style={s.statsRow}>
              {[
                { label: 'Sessions',  value: '0',       color: '#000'        },
                { label: 'Avg Score', value: '—',       color: theme.accent  },
                { label: 'Best',      value: '—',       color: '#B07A10'     },
                { label: 'Streak',    value: `${streak}d`, color: theme.accent },
              ].map((stat, i) => (
                <View key={i} style={s.statCard}>
                  <Text style={[s.statValue, { color: stat.color }]}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            {/* Skill breakdown */}
            <View style={s.skillCard}>
              <Text style={s.skillTitle}>Skills</Text>
              {SKILLS.map(sk => (
                <View key={sk.name} style={s.skillRow}>
                  <Text style={s.skillName}>{sk.name}</Text>
                  <View style={s.skillBarBg}>
                    <View style={[s.skillBarFill, {
                      width: `${(sk.score / 9) * 100}%` as any,
                      backgroundColor: sk.color,
                    }]} />
                  </View>
                  <Text style={[s.skillScore, { color: sk.color }]}>{sk.score || '—'}</Text>
                </View>
              ))}
            </View>

            {/* Level card */}
            <View style={[s.levelCard, { backgroundColor: theme.bg }]}>
              <Text style={s.levelLabel}>CURRENT LEVEL</Text>
              <Text style={[s.levelValue, { color: theme.accent }]}>{level}</Text>
              <Text style={s.levelDesc}>Increases as you practice</Text>
            </View>

          </View>
        )}

        {/* ══════════════════════ EXAMS TAB ══════════════════════ */}
        {activeTab === 'exams' && (
          <View style={s.tabContent}>

            {/* Monthly exam dark card */}
            <View style={s.monthlyCard}>
              <Text style={s.monthlyTag}>MONTHLY EXAM</Text>
              <Text style={s.monthlyTitle}>Public Exam</Text>
              <Text style={s.monthlySub}>Compete with learners worldwide</Text>

              {examUnlocked ? (
                <TouchableOpacity style={s.registerBtn} onPress={() => router.push('/(tabs)/exams' as any)}>
                  <Text style={s.registerText}>Register — $5</Text>
                </TouchableOpacity>
              ) : (
                <View style={s.lockRow}>
                  <LockIcon size={14} color="rgba(255,255,255,0.5)" />
                  <Text style={s.lockText}>{streak}/9 streak days to unlock</Text>
                </View>
              )}

              <View style={s.monthlyBar}>
                <View style={[s.monthlyBarFill, { width: `${Math.min((streak / 9) * 100, 100)}%` as any }]} />
              </View>
            </View>

            {/* History empty state */}
            <Text style={s.historyLabel}>PRACTICE EXAM HISTORY</Text>
            <View style={s.emptyHistory}>
              <TrophyIcon size={32} color="#DDD" />
              <Text style={s.emptyText}>No practice exams yet</Text>
              <Text style={s.emptySub}>Complete a practice exam to see your results here</Text>
            </View>

          </View>
        )}

      </ScrollView>
    </AppLayout>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F8F5' },

  header:     { padding: 24, paddingBottom: 0, backgroundColor: '#FFFFFF' },
  breadcrumb: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', marginBottom: 8 },
  headerRow:  { flexDirection: 'row', alignItems: 'center', gap: 10, paddingBottom: 20 },
  flag:       { fontSize: 28 },
  langTitle:  { fontFamily: 'Inter_700Bold', fontSize: 28, color: '#000', flex: 1, letterSpacing: -0.5 },
  streakPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  streakPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },

  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  },
  tab:     { paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#888' },

  tabContent: { padding: 24, gap: 12 },

  // Foundation
  foundCard: { borderWidth: 1, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  foundIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  foundTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  foundDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888', marginTop: 2 },
  optionalBadge: { backgroundColor: '#F4F4F0', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  optionalText:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },

  // Module grid
  moduleGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  moduleCard: { width: '47%', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 20, overflow: 'hidden', minHeight: 180 },
  modCardTop: { height: 90, alignItems: 'center', justifyContent: 'center' },
  modIconCircle: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  modCardBody: { padding: 14 },
  modTitle:    { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#000' },
  modDesc:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888', marginTop: 3 },
  modTags:     { flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' },
  modTag:      { backgroundColor: '#F4F4F0', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  modTagText:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },
  lockOverlay: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 6, padding: 4 },

  // Exam card
  examCard:      { borderWidth: 1, borderRadius: 20, padding: 20, flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  examCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#000', marginBottom: 4 },
  examCardDesc:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888', marginBottom: 10 },
  examTags:      { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  examTag:       { borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  examTagText:   { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  examCardRight: { alignItems: 'center', gap: 6, flexShrink: 0 },
  startExamBtn:  { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  startExamText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FFF' },
  examNote:      { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#999', textAlign: 'center' },

  // Tutor card
  tutorCard:  { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 14 },
  tutorIcon:  { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  tutorTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#000' },
  tutorDesc:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#888', marginTop: 3 },
  tutorTokens:{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#BBB', marginTop: 6 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10 },
  statCard:  { flex: 1, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 14, padding: 14, alignItems: 'center' },
  statValue: { fontFamily: 'Inter_700Bold', fontSize: 22, letterSpacing: -0.5 },
  statLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#999', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },

  // Skills
  skillCard:   { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 16, padding: 20 },
  skillTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000', marginBottom: 16 },
  skillRow:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  skillName:   { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000', width: 72 },
  skillBarBg:  { flex: 1, height: 8, backgroundColor: '#F4F4F0', borderRadius: 4, overflow: 'hidden' },
  skillBarFill:{ height: '100%', borderRadius: 4 },
  skillScore:  { fontFamily: 'Inter_700Bold', fontSize: 13, width: 28, textAlign: 'right' },

  // Level
  levelCard:  { borderRadius: 14, padding: 20, alignItems: 'center' },
  levelLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#888', textTransform: 'uppercase', letterSpacing: 0.6 },
  levelValue: { fontFamily: 'Inter_700Bold', fontSize: 48, letterSpacing: -1, marginVertical: 4 },
  levelDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },

  // Monthly exam
  monthlyCard: { backgroundColor: '#1A1A1A', borderRadius: 20, padding: 24 },
  monthlyTag:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8 },
  monthlyTitle:{ fontFamily: 'Inter_700Bold', fontSize: 24, color: '#FFF', marginBottom: 4 },
  monthlySub:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 20 },
  registerBtn: { backgroundColor: '#FFF', borderRadius: 10, padding: 12, alignItems: 'center', marginBottom: 12 },
  registerText:{ fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
  lockRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  lockText:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  monthlyBar:  { height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  monthlyBarFill: { height: '100%', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 },

  // History
  historyLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#999', letterSpacing: 0.8, textTransform: 'uppercase', marginTop: 8 },
  emptyHistory: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EAEAEA', borderRadius: 16, padding: 40, alignItems: 'center', gap: 8 },
  emptyText:    { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#888' },
  emptySub:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#BBB', textAlign: 'center' },
});
