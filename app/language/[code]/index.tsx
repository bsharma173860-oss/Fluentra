import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Platform, useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { FlagSVG } from '@/components/flags';
import { getTheme } from '@/constants/languageThemes';
import { getExamsForLanguage } from '@/constants/languageExams';
import {
  MicIcon, PenIcon, HeadphoneIcon, BookIcon, FileTextIcon,
  TrophyIcon, MessageCircleIcon, FlameIcon, ChevronRightIcon,
  LockIcon, CheckIcon,
} from '@/components/icons';
import { getExamFormat } from '@/constants/examFormats';

// ── Design tokens ────────────────────────────────────────────────────────
const C = {
  bg:      '#F9F8F5',
  bg2:     '#F4F1EB',
  bg3:     '#EDEAE3',
  card:    '#FFFFFF',
  border:  '#EAEAEA',
  hairline:'#F4F4F4',
  ink:     '#000000',
  ink2:    '#333333',
  ink3:    '#666666',
  ink4:    '#999999',
  ink5:    '#BBBBBB',
  brand:   '#C04A06',
};

// Module accent colors (design tokens)
const MOD = {
  speaking:  { c: '#5B4EFF', bg: '#EEEDFF' },
  writing:   { c: '#A65A00', bg: '#FFEAC2' },
  listening: { c: '#1A8F4E', bg: '#E2F5E9' },
  reading:   { c: '#C04A06', bg: '#FFE5DE' },
} as const;

// Module routes
const MODULE_ROUTES: Record<string, string> = {
  speaking:  '/modules/speaking/select',
  writing:   '/modules/writing/select',
  listening: '/modules/listening/select',
  reading:   '/modules/reading/select',
};

type Tab = 'practice' | 'study' | 'stats' | 'exams';

// ── SVG Ring (for web) ───────────────────────────────────────────────────
function SvgRing({ pct, size, stroke, color, children }: {
  pct: number; size: number; stroke: number; color: string; children: React.ReactNode
}) {
  const r = (size - stroke) / 2;
  const C2 = 2 * Math.PI * r;
  const offset = C2 - (Math.min(pct, 100) / 100) * C2;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#EDEAE3" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeLinecap="round" strokeDasharray={`${C2} ${C2}`} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// ── Language Hero — gradient header card ─────────────────────────────────
function LangHero({ code, streak, theme }: { code: string; streak: number; theme: any }) {
  const pct  = Math.min((streak / 9) * 100, 100);
  const t    = theme;
  const cefr = streak < 8 ? 'B1 · Intermediate' : streak < 21 ? 'B2 · Upper-int.' :
               streak < 36 ? 'C1 · Advanced' : 'C2 · Mastery';
  const native = t.native;
  const name   = t.name;

  if (Platform.OS === 'web') {
    return (
      <div style={{
        borderRadius: 20, overflow: 'hidden', position: 'relative',
        background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accent}dd 100%)`,
        color: '#fff', padding: '32px 36px',
      }}>
        {/* dot pattern */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 300, height: 300,
          display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 14,
          opacity: .08, pointerEvents: 'none' }}>
          {Array.from({ length: 180 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          position: 'relative', zIndex: 1, gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
              <div style={{ boxShadow: '0 4px 14px rgba(0,0,0,.25)', borderRadius: 6, overflow: 'hidden' }}>
                <FlagSVG code={code} width={56} height={38} />
              </div>
              <div style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(255,255,255,.18)',
                fontSize: 11.5, fontWeight: 700, color: '#fff' }}>
                {t.name.toUpperCase()}
              </div>
            </div>
            <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
              fontSize: 56, lineHeight: 1, marginBottom: 6 }}>{native}</div>
            <div style={{ fontSize: 14, opacity: .85, fontWeight: 500 }}>{name} · {cefr}</div>
          </div>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <SvgRing pct={pct} size={110} stroke={9} color="#fff">
                <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                  fontSize: 36, color: '#fff', lineHeight: 1 }}>{streak}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.1em',
                  textTransform: 'uppercase', opacity: .75 }}>days</div>
              </SvgRing>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.12em',
                textTransform: 'uppercase', opacity: .85, marginTop: 6 }}>Streak</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile hero
  return (
    <View style={[hs.hero, { backgroundColor: t.accent }]}>
      <View style={hs.dotGrid} pointerEvents="none">
        {Array.from({ length: 25 }).map((_, i) => (
          <View key={i} style={[hs.dot, { backgroundColor: '#fff' }]} />
        ))}
      </View>
      <View style={hs.heroContent}>
        <View style={hs.flagRow}>
          <View style={hs.flagWrap}><FlagSVG code={code} width={48} height={32} /></View>
          <View style={hs.streakPill}>
            <FlameIcon size={12} color="#fff" />
            <Text style={hs.streakText}>{streak}-day streak</Text>
          </View>
        </View>
        <Text style={hs.nativeName}>{native}</Text>
        <Text style={hs.subName}>{name} · {cefr}</Text>
      </View>
    </View>
  );
}

const hs = StyleSheet.create({
  hero: {
    padding: 28, paddingBottom: 32, position: 'relative', overflow: 'hidden',
  },
  dotGrid: {
    position: 'absolute', top: -10, right: -10,
    flexDirection: 'row', flexWrap: 'wrap', width: 100, gap: 8, opacity: 0.1,
  },
  dot:        { width: 3, height: 3, borderRadius: 1.5 },
  heroContent:{ position: 'relative', zIndex: 1 },
  flagRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  flagWrap:   { borderRadius: 5, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 6 },
  streakPill: { flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,.22)', paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 99 },
  streakText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: '#fff' },
  nativeName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 42, color: '#fff', lineHeight: 46, marginBottom: 4 },
  subName:    { fontFamily: 'Inter_500Medium', fontSize: 13, color: 'rgba(255,255,255,.85)' },
});

// ── Module tile ──────────────────────────────────────────────────────────
function ModuleTile({ id, title, sub, score, Icon: IconComp, onPress, isLocked }: {
  id: keyof typeof MOD;
  title: string; sub: string; score: string;
  Icon: (p: any) => React.JSX.Element;
  onPress: () => void; isLocked: boolean;
}) {
  const { c, bg } = MOD[id];

  if (Platform.OS === 'web') {
    return (
      <div onClick={isLocked ? undefined : onPress} style={{
        textAlign: 'left', background: C.card, border: `1px solid ${C.border}`,
        borderRadius: 16, padding: 20, cursor: isLocked ? 'not-allowed' : 'pointer',
        display: 'flex', flexDirection: 'column', gap: 14,
        opacity: isLocked ? 0.6 : 1,
        transition: 'border-color .15s, transform .15s',
      }}
        onMouseEnter={e => { if (!isLocked) (e.currentTarget as any).style.borderColor = c; }}
        onMouseLeave={e => { (e.currentTarget as any).style.borderColor = C.border; }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: bg,
            color: c, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconComp size={18} color={c} />
          </div>
          <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
            fontSize: 24, color: C.ink, lineHeight: 1 }}>{score}</div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: C.ink3 }}>{sub}</div>
        </div>
        {isLocked ? (
          <div style={{ fontSize: 11, color: C.ink4 }}>Upgrade to unlock</div>
        ) : (
          <div style={{ fontSize: 11, color: C.ink4, fontWeight: 600 }}>Continue →</div>
        )}
      </div>
    );
  }

  return (
    <TouchableOpacity
      style={[ts.modCard, isLocked && { opacity: 0.6 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={ts.modCardTop}>
        <View style={[ts.modIcon, { backgroundColor: bg }]}>
          <IconComp size={20} color={c} />
        </View>
        <Text style={ts.modScore}>{score}</Text>
      </View>
      <View style={ts.modBody}>
        <Text style={ts.modTitle}>{title}</Text>
        <Text style={ts.modSub}>{sub}</Text>
      </View>
    </TouchableOpacity>
  );
}

const ts = StyleSheet.create({
  modCard: {
    flex: 1, minWidth: '45%', backgroundColor: C.card,
    borderWidth: 1, borderColor: C.border, borderRadius: 16,
    overflow: 'hidden',
  },
  modCardTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, paddingBottom: 8,
  },
  modIcon:  { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  modScore: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 22, color: C.ink },
  modBody:  { padding: 14, paddingTop: 6 },
  modTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink, marginBottom: 2 },
  modSub:   { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: C.ink3 },
});

// ── Stat card ────────────────────────────────────────────────────────────
function StatCard({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <View style={sc.card}>
      <Text style={[sc.value, { color: color ?? C.ink }]}>{value}</Text>
      <Text style={sc.label}>{label}</Text>
    </View>
  );
}
const sc = StyleSheet.create({
  card:  { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border,
    borderRadius: 14, padding: 16, alignItems: 'center' },
  value: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, lineHeight: 32 },
  label: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: C.ink4,
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4, textAlign: 'center' },
});

// ── Main screen ──────────────────────────────────────────────────────────
export default function LanguagePage() {
  const params         = useLocalSearchParams();
  const code           = ((params.code ?? params.languageCode ?? 'en') as string);
  const theme          = getTheme(code);
  const { profile }    = useAuth();
  const { width }      = useWindowDimensions();
  const isDesktop      = Platform.OS === 'web' && width >= 768;

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
      .eq('user_id', user.id).eq('language_code', code).maybeSingle();
    if (data) {
      setStreak((data as any).streak_count ?? 0);
      setExamUnlocked((data as any).exam_unlocked ?? false);
    }
  }

  const isPro       = profile?.subscription_tier === 'pro';
  const level       = streak < 8 ? 'B1' : streak < 21 ? 'B2' : streak < 36 ? 'C1' : 'C2';
  const primaryExam = getExamsForLanguage(code)[0];

  const listeningFmt = getExamFormat(primaryExam.id, 'listening');
  const readingFmt   = getExamFormat(primaryExam.id, 'reading');
  const writingFmt   = getExamFormat(primaryExam.id, 'writing');
  const speakingFmt  = getExamFormat(primaryExam.id, 'speaking');
  const hasSpeaking  = (speakingFmt?.parts?.length ?? 0) > 0;
  const scoreStr     = streak < 8 ? '—' : streak < 21 ? '6.5' : streak < 36 ? '7.0' : '7.5';

  const MODULES = [
    hasSpeaking && {
      id: 'speaking' as const, title: 'Speaking', Icon: MicIcon,
      sub: speakingFmt ? `${speakingFmt.parts.length} parts · AI examiner` : 'AI examiner · Parts 1–3',
    },
    { id: 'writing' as const, title: 'Writing', Icon: PenIcon,
      sub: writingFmt ? `${writingFmt.tasks.length} task${writingFmt.tasks.length !== 1 ? 's' : ''} · AI graded` : 'Essay + Task 1 · AI graded',
    },
    { id: 'listening' as const, title: 'Listening', Icon: HeadphoneIcon,
      sub: listeningFmt ? `${listeningFmt.sections.length} sections · ${listeningFmt.totalQuestions} Qs` : '4 sections · Real audio',
    },
    { id: 'reading' as const, title: 'Reading', Icon: FileTextIcon,
      sub: readingFmt ? `${readingFmt.passages.length} passages · ${readingFmt.totalQuestions} Qs` : '3 passages · 40 questions',
    },
  ].filter(Boolean) as Array<{ id: keyof typeof MOD; title: string; Icon: any; sub: string }>;

  function navigate(module: string) {
    const route = MODULE_ROUTES[module] ?? `/language/${code}/${module}`;
    router.push({ pathname: route as any, params: { languageCode: code, code } });
  }

  const TABS: Array<{ id: Tab; label: string }> = [
    { id: 'practice', label: 'Practice' },
    { id: 'study',    label: 'Study' },
    { id: 'stats',    label: 'Stats' },
    { id: 'exams',    label: 'Exams' },
  ];

  return (
    <AppLayout languageCode={code}>
      <ScrollView
        style={{ flex: 1, backgroundColor: C.bg }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={{ padding: isDesktop ? 28 : 0 }}>
          {isDesktop ? (
            // On web: render gradient with SVG elements
            <LangHero code={code} streak={streak} theme={theme} />
          ) : (
            // On native: React Native View with gradient approx
            <LangHero code={code} streak={streak} theme={theme} />
          )}
        </View>

        {/* ── Tabs ── */}
        <View style={[s.tabRow, { borderBottomColor: C.border }]}>
          {TABS.map(tb => (
            <TouchableOpacity
              key={tb.id}
              style={[s.tab, activeTab === tb.id && { borderBottomColor: theme.accent, borderBottomWidth: 2 }]}
              onPress={() => setActiveTab(tb.id)}
            >
              <Text style={[s.tabText, activeTab === tb.id && { color: theme.accent, fontFamily: 'Inter_700Bold' }]}>
                {tb.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ══════════ PRACTICE ══════════ */}
        {activeTab === 'practice' && (
          <View style={s.content}>

            {/* Module tiles */}
            <Text style={s.sectionLabel}>Modules</Text>
            {isDesktop ? (
              // Web: 4-col grid via div
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 } as any}>
                {MODULES.map(m => (
                  <ModuleTile key={m.id} {...m} score={scoreStr}
                    onPress={() => navigate(m.id)}
                    isLocked={false} />
                ))}
              </div>
            ) : (
              // Mobile: 2-col flex wrap
              <View style={s.modGrid}>
                {MODULES.map(m => (
                  <ModuleTile key={m.id} {...m} score={scoreStr}
                    onPress={() => navigate(m.id)}
                    isLocked={false} />
                ))}
              </View>
            )}

            {/* Vocab + Grammar shortcuts */}
            <View style={s.shortcutRow}>
              <TouchableOpacity
                style={[s.shortcutCard, { borderColor: MOD.reading.c + '30', backgroundColor: MOD.reading.bg }]}
                onPress={() => navigate('vocab')} activeOpacity={0.85}
              >
                <View style={[s.shortcutIcon, { backgroundColor: MOD.reading.c }]}>
                  <BookIcon size={16} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.shortcutTitle}>Vocabulary</Text>
                  <Text style={s.shortcutSub}>Flashcards · SRS</Text>
                </View>
                <ChevronRightIcon size={14} color={C.ink5} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.shortcutCard, { borderColor: MOD.speaking.c + '30', backgroundColor: MOD.speaking.bg }]}
                onPress={() => navigate('grammar')} activeOpacity={0.85}
              >
                <View style={[s.shortcutIcon, { backgroundColor: MOD.speaking.c }]}>
                  <FileTextIcon size={16} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.shortcutTitle}>Grammar</Text>
                  <Text style={s.shortcutSub}>Rules · Exercises</Text>
                </View>
                <ChevronRightIcon size={14} color={C.ink5} />
              </TouchableOpacity>
            </View>

            {/* AI Tutor */}
            <TouchableOpacity
              style={[s.tutorCard, { backgroundColor: theme.accent }]}
              onPress={() => navigate('tutor')} activeOpacity={0.88}
            >
              <View style={s.tutorIconWrap}>
                <MessageCircleIcon size={20} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.tutorTitle}>AI Tutor</Text>
                <Text style={s.tutorSub}>
                  {isPro ? 'Unlimited messages' : '10 messages/day free'}
                </Text>
              </View>
              <ChevronRightIcon size={16} color="rgba(255,255,255,.7)" />
            </TouchableOpacity>
          </View>
        )}

        {/* ══════════ STUDY ══════════ */}
        {activeTab === 'study' && (
          <View style={s.content}>
            <View style={s.shortcutRow}>
              {[
                { title: 'Vocabulary', sub: 'SRS flashcards', route: 'vocab', Icon: BookIcon, color: MOD.reading.c, bg: MOD.reading.bg },
                { title: 'Grammar', sub: 'Rules + exercises', route: 'grammar', Icon: FileTextIcon, color: MOD.speaking.c, bg: MOD.speaking.bg },
                { title: 'Library', sub: 'Saved materials', route: 'library', Icon: BookIcon, color: MOD.writing.c, bg: MOD.writing.bg },
              ].map(item => (
                <TouchableOpacity key={item.title}
                  style={[s.shortcutCard, { backgroundColor: item.bg, borderColor: item.color + '30' }]}
                  onPress={() => navigate(item.route)} activeOpacity={0.85}>
                  <View style={[s.shortcutIcon, { backgroundColor: item.color }]}>
                    <item.Icon size={16} color="#fff" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.shortcutTitle}>{item.title}</Text>
                    <Text style={s.shortcutSub}>{item.sub}</Text>
                  </View>
                  <ChevronRightIcon size={14} color={C.ink5} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* ══════════ STATS ══════════ */}
        {activeTab === 'stats' && (
          <View style={s.content}>
            <View style={s.statsRow}>
              <StatCard label="Best Score" value="—" color={theme.accent} />
              <StatCard label="Sessions"   value="0" />
              <StatCard label="Study Time" value="0h" />
              <StatCard label="Streak"     value={`${streak}d`} color={theme.accent} />
            </View>

            <View style={s.skillsCard}>
              <Text style={s.sectionLabel}>By module</Text>
              {([
                { id: 'speaking',  label: 'Speaking'  },
                { id: 'writing',   label: 'Writing'   },
                { id: 'listening', label: 'Listening' },
                { id: 'reading',   label: 'Reading'   },
              ] as Array<{ id: keyof typeof MOD; label: string }>).map(sk => (
                <View key={sk.id} style={s.skillRow}>
                  <View style={[s.skillDot, { backgroundColor: MOD[sk.id].c }]} />
                  <Text style={s.skillName}>{sk.label}</Text>
                  <View style={s.skillBar}>
                    <View style={[s.skillFill, { width: '0%', backgroundColor: MOD[sk.id].c }]} />
                  </View>
                  <Text style={[s.skillScore, { color: MOD[sk.id].c }]}>—</Text>
                </View>
              ))}
            </View>

            <View style={[s.levelBadge, { backgroundColor: theme.accentLight }]}>
              <Text style={[s.levelLabel, { color: theme.accent }]}>CURRENT LEVEL</Text>
              <Text style={[s.levelValue, { color: theme.accent }]}>{level}</Text>
              <Text style={s.levelDesc}>Increases as you practice</Text>
            </View>
          </View>
        )}

        {/* ══════════ EXAMS ══════════ */}
        {activeTab === 'exams' && (
          <View style={s.content}>
            <View style={s.examHeroCard}>
              <Text style={s.examHeroEyebrow}>MONTHLY EXAM</Text>
              <Text style={s.examHeroTitle}>{primaryExam.name}</Text>
              <Text style={s.examHeroSub}>Compete with learners worldwide</Text>
              {examUnlocked ? (
                <TouchableOpacity style={s.registerBtn}
                  onPress={() => router.push('/(tabs)/exams' as any)}>
                  <Text style={s.registerBtnText}>Register — $5</Text>
                </TouchableOpacity>
              ) : (
                <View>
                  <View style={s.lockRow}>
                    <LockIcon size={13} color="rgba(255,255,255,.5)" />
                    <Text style={s.lockText}>{streak}/9 streak days to unlock</Text>
                  </View>
                  <View style={s.streakBar}>
                    <View style={[s.streakBarFill, { width: `${Math.min((streak / 9) * 100, 100)}%` as any }]} />
                  </View>
                </View>
              )}
            </View>

            <Text style={[s.sectionLabel, { marginTop: 24 }]}>Practice exam history</Text>
            <View style={s.emptyState}>
              <TrophyIcon size={32} color={C.ink5} />
              <Text style={s.emptyTitle}>No practice exams yet</Text>
              <Text style={s.emptySub}>Complete a practice session to see results here</Text>
            </View>
          </View>
        )}

        <View style={{ height: 48 }} />
      </ScrollView>
    </AppLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  // Tabs
  tabRow: {
    flexDirection: 'row', borderBottomWidth: 1,
    backgroundColor: C.card, paddingHorizontal: 24,
  },
  tab:     { paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.ink4 },

  // Content
  content:      { padding: 24, gap: 16 },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 13, color: C.ink, marginBottom: 4 },

  // Module grid (mobile)
  modGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  // Shortcut cards
  shortcutRow: { gap: 10 },
  shortcutCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: 14, borderWidth: 1, borderColor: C.border,
  },
  shortcutIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  shortcutTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: C.ink },
  shortcutSub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink3, marginTop: 1 },

  // Tutor
  tutorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    padding: 18, borderRadius: 16,
  },
  tutorIconWrap: {
    width: 40, height: 40, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,.2)',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  tutorTitle: { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#fff' },
  tutorSub:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: 'rgba(255,255,255,.8)', marginTop: 2 },

  // Stats
  statsRow:   { flexDirection: 'row', gap: 10 },
  skillsCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 18 },
  skillRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  skillDot:   { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  skillName:  { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.ink, width: 72 },
  skillBar:   { flex: 1, height: 6, backgroundColor: C.bg3, borderRadius: 3, overflow: 'hidden' },
  skillFill:  { height: '100%' as any, borderRadius: 3 },
  skillScore: { fontFamily: 'Inter_700Bold', fontSize: 13, width: 28, textAlign: 'right' },

  // Level badge
  levelBadge: { borderRadius: 14, padding: 24, alignItems: 'center' },
  levelLabel: { fontFamily: 'Inter_700Bold', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  levelValue: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52, lineHeight: 56, marginVertical: 4 },
  levelDesc:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.ink4 },

  // Exam hero
  examHeroCard: { backgroundColor: C.ink, borderRadius: 20, padding: 24 },
  examHeroEyebrow: { fontFamily: 'Inter_700Bold', fontSize: 10, color: 'rgba(255,255,255,.4)',
    letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  examHeroTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: '#fff', marginBottom: 4 },
  examHeroSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 20 },
  registerBtn:   { backgroundColor: '#fff', borderRadius: 10, padding: 13, alignItems: 'center' },
  registerBtnText:{ fontFamily: 'Inter_700Bold', fontSize: 14, color: C.ink },
  lockRow:       { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  lockText:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,.6)' },
  streakBar:     { height: 4, backgroundColor: 'rgba(255,255,255,.1)', borderRadius: 2, overflow: 'hidden' },
  streakBarFill: { height: 4, backgroundColor: 'rgba(255,255,255,.4)', borderRadius: 2 },

  // Empty state
  emptyState: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border,
    padding: 40, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.ink3 },
  emptySub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink5, textAlign: 'center' },
});
