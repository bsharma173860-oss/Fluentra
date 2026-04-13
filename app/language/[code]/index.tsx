import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { LANGUAGE_EXAMS, type ExamProfile } from '@/constants/examProfiles';
import { useAuth } from '@/lib/authContext';
import { supabase, type UserLanguage } from '@/lib/supabase';
import {
  hasPracticed,
  hasPracticedAnyToday,
  completedModulesToday,
  type PracticeModule,
} from '@/lib/practiceStore';

const { width: W } = Dimensions.get('window');

// ─────────────────────────────────────────────────────────────────
// Language metadata lookup
// ─────────────────────────────────────────────────────────────────
const LANG_META: Record<string, {
  flag: string; color: string; trackColor: string;
}> = {
  en: { flag: '🇬🇧', color: Colors.p,      trackColor: Colors.p_soft    },
  es: { flag: '🇪🇸', color: Colors.orange,  trackColor: Colors.orange_bg  },
  fr: { flag: '🇫🇷', color: Colors.green,   trackColor: Colors.green_bg   },
  de: { flag: '🇩🇪', color: Colors.gold,    trackColor: Colors.gold_bg    },
  pt: { flag: '🇵🇹', color: Colors.orange,  trackColor: Colors.orange_bg  },
  zh: { flag: '🇨🇳', color: '#D93025',      trackColor: '#FFF0F0'         },
  ja: { flag: '🇯🇵', color: '#D93025',      trackColor: '#FFF0F0'         },
  ar: { flag: '🇸🇦', color: Colors.green,   trackColor: Colors.green_bg   },
};
function langMeta(code: string) {
  return LANG_META[code] ?? { flag: '🌐', color: Colors.p, trackColor: Colors.p_soft };
}

// ─────────────────────────────────────────────────────────────────
// Practice module configs
// ─────────────────────────────────────────────────────────────────
type PracticeCard = {
  module: PracticeModule;
  icon: string;
  title: string;
  duration: string;
  freeLabel: string;
  color: string;
  bgColor: string;
  route: string;
  pro: boolean;
};

const PRACTICE_CARDS: PracticeCard[] = [
  {
    module: 'speaking',
    icon: '🎙',
    title: 'Speaking',
    duration: '5–15 min',
    freeLabel: '10 min/day',
    color: Colors.p,
    bgColor: Colors.p_soft,
    route: '/modules/speaking/select',
    pro: false,
  },
  {
    module: 'writing',
    icon: '✏️',
    title: 'Writing',
    duration: 'Essay or short response',
    freeLabel: '1/day',
    color: Colors.gold,
    bgColor: Colors.gold_bg,
    route: '/modules/writing/select',
    pro: false,
  },
  {
    module: 'listening',
    icon: '🎧',
    title: 'Listening',
    duration: 'Audio comprehension',
    freeLabel: '1/day',
    color: Colors.green,
    bgColor: Colors.green_bg,
    route: '/modules/listening/select',
    pro: false,
  },
  {
    module: 'reading',
    icon: '📖',
    title: 'Reading',
    duration: 'Passage + questions',
    freeLabel: 'Pro only',
    color: Colors.orange,
    bgColor: Colors.orange_bg,
    route: '/modules/reading/select',
    pro: true,
  },
];

// Mock per-language scores (replace with Supabase queries Day 10+)
const MOCK_SCORES: Record<string, { band: number; speaking: number; writing: number; listening: number; reading: number }> = {
  en: { band: 6.5, speaking: 7.0, writing: 6.5, listening: 7.5, reading: 6.5 },
  es: { band: 5.5, speaking: 5.5, writing: 5.0, listening: 6.0, reading: 5.5 },
  fr: { band: 4.5, speaking: 4.5, writing: 4.0, listening: 5.0, reading: 4.5 },
};

const STREAK_TARGET = 40;

// ─────────────────────────────────────────────────────────────────
// Score bar
// ─────────────────────────────────────────────────────────────────
function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = (value / 9) * 100;
  return (
    <View style={sb.row}>
      <Text style={sb.label}>{label}</Text>
      <View style={sb.track}>
        <View style={[sb.fill, { width: `${pct}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[sb.val, { color }]}>{value.toFixed(1)}</Text>
    </View>
  );
}
const sb = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink2, width: 80 },
  track: { flex: 1, height: 6, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 99 },
  val: { fontFamily: 'Inter_700Bold', fontSize: 12, width: 30, textAlign: 'right' },
});

// ─────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────
export default function LanguageDashboard() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const langCode = code ?? 'en';
  const meta = langMeta(langCode);

  const { user, profile } = useAuth();
  const [langRecord, setLangRecord] = useState<UserLanguage | null>(null);
  const [practiced, setPracticed] = useState<Record<PracticeModule, boolean>>({
    speaking: false, writing: false, listening: false, reading: false,
  });
  const [translateEnabled, setTranslateEnabled] = useState(false);

  const streak = profile?.streak_count ?? 32;
  const scores = MOCK_SCORES[langCode] ?? MOCK_SCORES.en;
  const remaining = Math.max(0, STREAK_TARGET - streak);
  const examsUnlocked = streak >= STREAK_TARGET;
  const examProfiles: ExamProfile[] = LANGUAGE_EXAMS[langCode] ?? [];
  const showTranslateToggle = langCode !== 'en';

  // Fetch language record from DB
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from('user_languages')
      .select('*')
      .eq('user_id', user.id)
      .eq('language_code', langCode)
      .single()
      .then(({ data }) => { if (data) setLangRecord(data); });
  }, [user?.id, langCode]);

  // Refresh practice completion status every time screen focuses
  useFocusEffect(
    useCallback(() => {
      setPracticed({
        speaking:  hasPracticed(langCode, 'speaking'),
        writing:   hasPracticed(langCode, 'writing'),
        listening: hasPracticed(langCode, 'listening'),
        reading:   hasPracticed(langCode, 'reading'),
      });
    }, [langCode])
  );

  const practicedToday  = hasPracticedAnyToday(langCode);
  const completedToday  = completedModulesToday(langCode);
  const langName   = langRecord?.language_name_en ?? langCode.toUpperCase();
  const langNative = langRecord?.language_name_native ?? langName;
  const fluencyPct = langRecord?.fluency_percent ?? (MOCK_SCORES[langCode] ? scores.band / 9 * 100 : 50);

  // Build streak unlock text from the exam profiles for this language
  const streakUnlockText = (() => {
    if (examProfiles.length === 0) return `${remaining} more days to unlock the monthly exam`;
    const names = examProfiles.map(e => e.name);
    const joined = names.length > 1 ? names.slice(0, -1).join(', ') + ' + ' + names[names.length - 1] : names[0];
    return `${remaining} more days to unlock ${joined} exam${examProfiles.length > 1 ? 's' : ''}`;
  })();

  function onPracticeCardTap(card: PracticeCard) {
    if (card.pro) {
      Alert.alert(
        'Pro Feature',
        'Reading practice is available with a Fluentra Pro subscription.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Upgrade to Pro', style: 'default', onPress: () => {} },
        ]
      );
      return;
    }
    router.push(card.route as any);
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerFlag}>{meta.flag}</Text>
          <View>
            <Text style={s.headerTitle}>{langName}</Text>
            <Text style={s.headerSub}>{langNative}</Text>
          </View>
        </View>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Fluency + streak card ── */}
        <View style={s.fluencyCard}>
          {/* Progress bar */}
          <View style={s.fluencyRow}>
            <View style={s.fluencyLeft}>
              <Text style={s.fluencyLabel}>Overall proficiency</Text>
              <Text style={[s.fluencyPct, { color: meta.color }]}>{Math.round(fluencyPct)}%</Text>
            </View>
            <View style={s.fluencyBarWrap}>
              <View style={s.fluencyTrack}>
                <View style={[s.fluencyFill, {
                  width: `${Math.min(fluencyPct, 100)}%` as any,
                  backgroundColor: meta.color,
                }]} />
              </View>
              <View style={s.examChips}>
                {examProfiles.map(e => (
                  <View key={e.id} style={[s.examChip, { borderColor: e.color, backgroundColor: e.bg }]}>
                    <Text style={[s.examChipText, { color: e.color }]}>{e.name}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={s.divider} />

          {/* Streak */}
          <View style={s.streakRow}>
            <View style={s.streakLeft}>
              <Text style={s.streakIcon}>🔥</Text>
              <View>
                <Text style={s.streakCount}>{streak} day streak</Text>
                <Text style={s.streakTarget}>
                  {practicedToday ? '✅ Practiced today' : 'Practice today to continue'}
                </Text>
              </View>
            </View>
            <Text style={s.streakNum}>{streak}<Text style={s.streakDen}>/{STREAK_TARGET}</Text></Text>
          </View>
          <View style={s.streakTrack}>
            <View style={[s.streakFill, { width: `${Math.min((streak / STREAK_TARGET) * 100, 100)}%` as any, backgroundColor: Colors.orange }]} />
          </View>
          <Text style={s.streakNote}>
            {examsUnlocked ? '🎉 Monthly exam is unlocked!' : streakUnlockText}
          </Text>
        </View>

        {/* ── Daily Practice ── */}
        <View style={s.sectionHeader}>
          <View>
            <Text style={s.sectionTitle}>Daily Practice</Text>
            <Text style={s.sectionSub}>Builds your streak · Complete any one today</Text>
          </View>
          {practicedToday && (
            <View style={s.practicedBadge}>
              <Text style={s.practicedBadgeText}>Practiced today ✓</Text>
            </View>
          )}
        </View>

        {/* Translate toggle — only for non-English languages */}
        {showTranslateToggle && (
          <View style={s.translateRow}>
            <Text style={s.translateLabel}>Translate to English</Text>
            <Switch
              value={translateEnabled}
              onValueChange={setTranslateEnabled}
              trackColor={{ false: Colors.border, true: Colors.p }}
              thumbColor={Colors.white}
            />
          </View>
        )}

        <View style={s.practiceGrid}>
          {PRACTICE_CARDS.map(card => {
            const done = practiced[card.module];
            return (
              <TouchableOpacity
                key={card.module}
                style={[s.practiceCard, { backgroundColor: card.bgColor }]}
                onPress={() => onPracticeCardTap(card)}
                activeOpacity={0.82}
              >
                {/* Lock / check overlay */}
                {card.pro && (
                  <View style={s.lockBadge}>
                    <Text style={s.lockBadgeText}>🔒 Pro</Text>
                  </View>
                )}
                {done && !card.pro && (
                  <View style={[s.doneBadge, { backgroundColor: card.color }]}>
                    <Text style={s.doneBadgeText}>✓</Text>
                  </View>
                )}

                <Text style={s.practiceIcon}>{card.icon}</Text>
                <Text style={[s.practiceTitle, { color: card.color }]}>{card.title}</Text>
                <Text style={s.practiceDuration}>{card.duration}</Text>
                <View style={[s.freeChip, { borderColor: card.color + '55' }]}>
                  <Text style={[s.freeChipText, { color: card.color }]}>
                    {card.pro ? 'Pro only' : `Free: ${card.freeLabel}`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Today's progress ── */}
        {completedToday.length > 0 && (
          <View style={s.todayCard}>
            <Text style={s.todayTitle}>Today's practice ✅</Text>
            <View style={s.todayModules}>
              {completedToday.map(m => {
                const c = PRACTICE_CARDS.find(p => p.module === m)!;
                return (
                  <View key={m} style={[s.todayChip, { backgroundColor: c.bgColor, borderColor: c.color + '55' }]}>
                    <Text style={s.todayChipText}>{c.icon} {c.title}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Exam access ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Exams</Text>
          {!examsUnlocked && (
            <Text style={s.sectionLink}>🔒 Unlocks at {STREAK_TARGET} days</Text>
          )}
        </View>

        <View style={s.examList}>
          {examProfiles.length === 0 ? (
            <View style={s.examEmpty}>
              <Text style={s.examEmptyText}>No exams available for this language yet.</Text>
            </View>
          ) : examProfiles.map(exam => (
            <TouchableOpacity
              key={exam.id}
              style={[s.examCard, !examsUnlocked && s.examCardLocked]}
              onPress={() => {
                if (!examsUnlocked) {
                  Alert.alert(
                    'Exam locked',
                    `Complete ${remaining} more streak days to unlock the monthly ${exam.name} exam.`
                  );
                }
              }}
              activeOpacity={examsUnlocked ? 0.85 : 0.7}
            >
              <View style={s.examCardLeft}>
                <View style={[s.examIconWrap, { backgroundColor: examsUnlocked ? exam.bg : Colors.bg2 }]}>
                  <Text style={s.examIconText}>{examsUnlocked ? '📋' : '🔒'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[s.examCardTitle, !examsUnlocked && s.examCardTitleLocked]}>{exam.name}</Text>
                  <Text style={s.examCardSub} numberOfLines={1}>
                    {examsUnlocked ? exam.fullName : `${remaining} streak days to unlock`}
                  </Text>
                </View>
              </View>
              {examsUnlocked ? (
                <Text style={[s.examArrow, { color: exam.color }]}>›</Text>
              ) : (
                <View style={[s.examLockTag, { backgroundColor: exam.bg, borderColor: exam.color + '55' }]}>
                  <Text style={[s.examLockTagText, { color: exam.color }]}>{remaining}d</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Exam action buttons ── */}
        {examProfiles.length > 0 && (
          <View style={s.examActions}>
            <TouchableOpacity
              style={s.fullExamBtn}
              activeOpacity={0.88}
              onPress={() =>
                router.push(
                  `/language/${langCode}/${examProfiles[0].id}/exam-entry` as any
                )
              }
            >
              <View style={s.fullExamBtnLeft}>
                <Text style={s.fullExamBtnIcon}>📋</Text>
                <View>
                  <Text style={s.fullExamBtnTitle}>Practice Full Exam</Text>
                  <Text style={s.fullExamBtnSub}>~3 hours · All 4 modules · Instant results</Text>
                </View>
              </View>
              <Text style={s.fullExamBtnArrow}>›</Text>
            </TouchableOpacity>

            {examsUnlocked && (
              <TouchableOpacity
                style={s.monthlyExamBtn}
                activeOpacity={0.88}
                onPress={() =>
                  router.push(
                    `/language/${langCode}/${examProfiles[0].id}/monthly-exam` as any
                  )
                }
              >
                <View style={s.fullExamBtnLeft}>
                  <Text style={s.fullExamBtnIcon}>🏆</Text>
                  <View>
                    <Text style={s.monthlyExamBtnTitle}>Enter Monthly Exam</Text>
                    <Text style={s.monthlyExamBtnSub}>April 2026 · $5 · 847 registered</Text>
                  </View>
                </View>
                <Text style={[s.fullExamBtnArrow, { color: Colors.white }]}>›</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* ── Score breakdown ── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Your Scores</Text>
        </View>
        <View style={s.scoresCard}>
          <View style={s.bandRow}>
            <Text style={[s.bandNum, { color: meta.color }]}>{scores.band.toFixed(1)}</Text>
            <View style={s.bandMeta}>
              <Text style={s.bandLabel}>Overall band</Text>
              <Text style={s.bandDesc}>
                {scores.band >= 7 ? 'Good — effective command' :
                 scores.band >= 6 ? 'Competent' : 'Developing'}
              </Text>
            </View>
          </View>
          <View style={s.scoreBars}>
            <ScoreBar label="Speaking"  value={scores.speaking}  color={Colors.p} />
            <ScoreBar label="Writing"   value={scores.writing}   color={Colors.gold} />
            <ScoreBar label="Listening" value={scores.listening} color={Colors.green} />
            <ScoreBar label="Reading"   value={scores.reading}   color={Colors.orange} />
          </View>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const CARD_W = (W - 20 * 2 - 12) / 2;

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    backgroundColor: Colors.white, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 11,
    backgroundColor: Colors.bg2,
    alignItems: 'center', justifyContent: 'center',
  },
  backArrow: { fontFamily: 'Inter_500Medium', fontSize: 18, color: Colors.ink },
  headerCenter: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerFlag: { fontSize: 28 },
  headerTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  headerSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  headerSpacer: { width: 36 },

  content: { padding: 20, gap: 20 },

  // Fluency + streak card
  fluencyCard: {
    backgroundColor: Colors.white,
    borderRadius: 20, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 12,
  },
  fluencyRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  fluencyLeft: { gap: 4 },
  fluencyLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3 },
  fluencyPct: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 40, lineHeight: 46 },
  fluencyBarWrap: { flex: 1, paddingTop: 10, gap: 8 },
  fluencyTrack: { height: 8, backgroundColor: Colors.bg2, borderRadius: 99, overflow: 'hidden' },
  fluencyFill: { height: '100%', borderRadius: 99 },
  examChips: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  examChip: {
    borderWidth: 1, borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  examChipText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  divider: { height: 1, backgroundColor: Colors.border },

  streakRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  streakLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  streakIcon: { fontSize: 22 },
  streakCount: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: Colors.ink },
  streakTarget: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  streakNum: { fontFamily: 'Inter_700Bold', fontSize: 20, color: Colors.orange },
  streakDen: { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.ink4 },
  streakTrack: { height: 6, backgroundColor: Colors.orange_bg, borderRadius: 99, overflow: 'hidden' },
  streakFill: { height: '100%', borderRadius: 99 },
  streakNote: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, textAlign: 'center' },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: -8,
  },
  sectionTitle: { fontFamily: 'Inter_700Bold', fontSize: 17, color: Colors.ink },
  sectionSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  sectionLink: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.orange },
  practicedBadge: {
    backgroundColor: Colors.green_bg,
    borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: Colors.green,
  },
  practicedBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: Colors.green },

  // Translate toggle
  translateRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  translateLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: Colors.ink },

  // Practice 2x2 grid
  practiceGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  practiceCard: {
    width: CARD_W,
    borderRadius: 18,
    padding: 14,
    gap: 5,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 130,
  },
  lockBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: Colors.bg2,
    borderRadius: 99, paddingHorizontal: 7, paddingVertical: 3,
  },
  lockBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: Colors.ink3 },
  doneBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 22, height: 22, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  doneBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: Colors.white },
  practiceIcon: { fontSize: 26, marginBottom: 2 },
  practiceTitle: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  practiceDuration: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, lineHeight: 16 },
  freeChip: {
    borderWidth: 1, borderRadius: 99,
    paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start', marginTop: 4,
  },
  freeChipText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },

  // Today's progress
  todayCard: {
    backgroundColor: Colors.green_bg,
    borderRadius: 14,
    borderWidth: 1, borderColor: Colors.green,
    padding: 14, gap: 10,
  },
  todayTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: Colors.green },
  todayModules: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  todayChip: {
    borderWidth: 1, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  todayChipText: { fontFamily: 'Inter_500Medium', fontSize: 12, color: Colors.ink },

  // Exam list
  examList: { gap: 10 },
  examEmpty: { padding: 16, backgroundColor: Colors.bg2, borderRadius: 12, alignItems: 'center' },
  examEmptyText: { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3 },
  examCard: {
    backgroundColor: Colors.white,
    borderRadius: 16, borderWidth: 1, borderColor: Colors.border,
    padding: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  examCardLocked: { backgroundColor: Colors.bg2 },
  examCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  examIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  examIconText: { fontSize: 20 },
  examCardTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  examCardTitleLocked: { color: Colors.ink3 },
  examCardSub: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3, marginTop: 2 },
  examArrow: { fontFamily: 'Inter_400Regular', fontSize: 22 },
  examLockTag: {
    backgroundColor: Colors.orange_bg,
    borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4,
    borderWidth: 1, borderColor: Colors.orange,
  },
  examLockTagText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: Colors.orange },

  // Exam action buttons
  examActions: { gap: 10 },
  fullExamBtn: {
    backgroundColor: Colors.white, borderRadius: 16,
    borderWidth: 1, borderColor: Colors.border,
    padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  fullExamBtnLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  fullExamBtnIcon: { fontSize: 22 },
  fullExamBtnTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.ink },
  fullExamBtnSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: Colors.ink3, marginTop: 2 },
  fullExamBtnArrow: { fontFamily: 'Inter_400Regular', fontSize: 22, color: Colors.ink3 },
  monthlyExamBtn: {
    backgroundColor: '#1A1A2E', borderRadius: 16,
    padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  monthlyExamBtnTitle: { fontFamily: 'Inter_700Bold', fontSize: 14, color: Colors.white },
  monthlyExamBtnSub: { fontFamily: 'Inter_400Regular', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  // Scores
  scoresCard: {
    backgroundColor: Colors.white,
    borderRadius: 18, borderWidth: 1, borderColor: Colors.border,
    padding: 16, gap: 14,
  },
  bandRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  bandNum: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 48, lineHeight: 54 },
  bandMeta: { flex: 1, gap: 3 },
  bandLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: Colors.ink3 },
  bandDesc: { fontFamily: 'Inter_500Medium', fontSize: 13, color: Colors.ink2 },
  scoreBars: { gap: 10 },
});
