import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Alert, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import Svg, { Polyline, Defs, LinearGradient, Stop, Path, Line as SvgLine } from 'react-native-svg';
import { AppLayout } from '@/components/layout/AppLayout';
import { Colors } from '@/constants/colors';
import { LANGUAGE_EXAMS, type ExamProfile } from '@/constants/examProfiles';
import { getLangNames } from '@/constants/languages';
import { getTheme, type LanguageTheme } from '@/constants/languageThemes';
import { t, isRTL, type TranslationKey } from '@/constants/languageTranslations';
import { LanguageThemeProvider } from '@/context/LanguageThemeContext';
import { useAuth } from '@/lib/authContext';
import { supabase, type UserLanguage } from '@/lib/supabase';
import { hasPracticed, type PracticeModule } from '@/lib/practiceStore';
import { Analytics } from '@/lib/analytics';
import { Storage } from '@/lib/storage';
import {
  ChevronLeftIcon, ChevronRightIcon,
  MicIcon, PenIcon, HeadphoneIcon, BookIcon, SpeakIcon,
  LockIcon, CheckIcon, FlameIcon,
} from '@/components/icons';
import { getDifficulty, DIFFICULTY_COLOR, DIFFICULTY_BG } from '@/constants/dailyContent';
import { getFoundation } from '@/constants/foundationContent';

// ── Practice card config ──────────────────────────────────────────
type PracticeCard = {
  module:   PracticeModule;
  Icon:     typeof MicIcon;
  titleKey: TranslationKey;
  descKey:  TranslationKey;
  time:     string;
  color:    string;
  bgColor:  string;
  route:    string;
  pro:      boolean;
};

const PRACTICE_CARDS: PracticeCard[] = [
  {
    module: 'speaking', Icon: MicIcon,
    titleKey: 'speaking', descKey: 'speakingDesc', time: '5–15 min',
    color: Colors.orange, bgColor: Colors.orange_bg,
    route: '/modules/speaking/select', pro: false,
  },
  {
    module: 'writing', Icon: PenIcon,
    titleKey: 'writing', descKey: 'writingDesc', time: '20–40 min',
    color: Colors.gold, bgColor: Colors.gold_bg,
    route: '/modules/writing/select', pro: false,
  },
  {
    module: 'listening', Icon: HeadphoneIcon,
    titleKey: 'listening', descKey: 'listeningDesc', time: '10–20 min',
    color: Colors.green, bgColor: Colors.green_bg,
    route: '/modules/listening/select', pro: false,
  },
  {
    module: 'reading', Icon: BookIcon,
    titleKey: 'reading', descKey: 'readingDesc', time: '15–25 min',
    color: Colors.blue, bgColor: Colors.blue_bg,
    route: '/modules/reading/select', pro: false,
  },
];

// ── Mock data ─────────────────────────────────────────────────────
const MOCK_SCORES: Record<string, {
  band: number; speaking: number; writing: number; listening: number; reading: number;
}> = {
  en: { band: 6.5, speaking: 7.0, writing: 6.5, listening: 7.5, reading: 6.5 },
  es: { band: 5.5, speaking: 5.5, writing: 5.0, listening: 6.0, reading: 5.5 },
  fr: { band: 4.5, speaking: 4.5, writing: 4.0, listening: 5.0, reading: 4.5 },
};

const MOCK_HISTORY: Record<string, number[]> = {
  en: [5.0, 5.5, 5.5, 6.0, 5.5, 6.5, 6.0, 7.0, 6.5, 7.5, 7.0, 6.5],
  es: [4.5, 4.5, 5.0, 5.0, 5.5, 5.5, 5.0, 5.5, 6.0, 5.5, 6.0, 5.5],
  fr: [3.5, 4.0, 4.0, 4.5, 4.0, 4.5, 5.0, 4.5, 5.0, 4.5, 5.0, 4.5],
};

const STREAK_TARGET = 40;
type Tab = 'practice' | 'dashboard' | 'exams';
type Period = '7d' | '30d' | '90d';

function getCEFR(band: number): string {
  if (band < 4)   return 'A1';
  if (band < 5)   return 'A2';
  if (band < 5.5) return 'B1';
  if (band < 6.5) return 'B2';
  if (band < 8)   return 'C1';
  return 'C2';
}

// ── RTL-aware chevron ─────────────────────────────────────────────
function Chevron({ rtl, color = '#CCC', size = 16 }: { rtl: boolean; color?: string; size?: number }) {
  return (
    <View style={rtl ? { transform: [{ scaleX: -1 }] } : undefined}>
      <ChevronRightIcon size={size} color={color} />
    </View>
  );
}

// ── Sparkline chart ───────────────────────────────────────────────
function SparklineChart({
  data, color, width = 260, height = 120,
}: {
  data: number[]; color: string; width?: number; height?: number;
}) {
  if (data.length < 2) return null;
  const padX = 10;
  const padY = 8;
  const w = width - padX * 2;
  const h = height - padY * 2;

  const toX = (i: number) => padX + (i / (data.length - 1)) * w;
  const toY = (v: number) => padY + h - ((v / 9)) * h;

  const pts  = data.map((v, i) => `${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
  const area = `M${toX(0).toFixed(1)},${toY(data[0]).toFixed(1)} ` +
    data.slice(1).map((v, i) => `L${toX(i + 1).toFixed(1)},${toY(v).toFixed(1)}`).join(' ') +
    ` L${toX(data.length - 1).toFixed(1)},${height} L${toX(0).toFixed(1)},${height} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.15" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </LinearGradient>
      </Defs>
      {[3, 6, 9].map(v => (
        <SvgLine
          key={v}
          x1={padX} y1={toY(v)} x2={width - padX} y2={toY(v)}
          stroke="#F0F0F0" strokeWidth="1" strokeDasharray="4,4"
        />
      ))}
      <Path d={area} fill="url(#areaGrad)" />
      <Polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

// ── Practice module card ──────────────────────────────────────────
function PracticeCardItem({
  card, theme, practiced, examType, langCode, onTap,
}: {
  card:      PracticeCard;
  theme:     LanguageTheme;
  practiced: boolean;
  examType:  string;
  langCode:  string;
  onTap:     () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const rtl = isRTL(langCode);
  const { Icon } = card;

  const hoverProps = Platform.OS === 'web' ? ({
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  } as any) : {};

  return (
    <TouchableOpacity
      style={[
        pc.card,
        hovered && { borderColor: theme.accent, borderLeftWidth: 3, backgroundColor: theme.accentLight },
      ]}
      onPress={onTap}
      activeOpacity={0.88}
      {...hoverProps}
    >
      <View style={[pc.iconBox, { backgroundColor: theme.accentLight }]}>
        <Icon size={24} color={theme.accent} strokeWidth={1.5} />
      </View>
      <View style={pc.mid}>
        <Text style={pc.name}>{t(langCode, card.titleKey)}</Text>
        <Text style={pc.desc}>{t(langCode, card.descKey)}</Text>
        <View style={pc.tags}>
          <View style={pc.tag}><Text style={pc.tagText}>{examType}</Text></View>
          <View style={pc.tag}><Text style={pc.tagText}>{card.time}</Text></View>
          {!card.pro && (
            <View style={pc.tagFree}><Text style={pc.tagFreeText}>{t(langCode, 'free')}</Text></View>
          )}
        </View>
      </View>
      <View style={pc.right}>
        {practiced ? (
          <View style={pc.donePill}>
            <CheckIcon size={10} color={Colors.green} strokeWidth={2.5} />
            <Text style={pc.donePillText}>{t(langCode, 'free')}</Text>
          </View>
        ) : card.pro ? (
          <>
            <LockIcon size={14} color="#CCC" />
            <Text style={pc.proText}>{t(langCode, 'proOnly')}</Text>
          </>
        ) : (
          <View style={pc.leftPill}>
            <Text style={pc.leftPillText}>1 {t(langCode, 'leftToday')}</Text>
          </View>
        )}
        <Chevron rtl={rtl} color="#CCC" size={16} />
      </View>
    </TouchableOpacity>
  );
}

// Extra cards (tutor, library)
function ExtraCardItem({
  icon, title, desc, tag, tagStyle = 'free', theme, langCode, route,
}: {
  icon:      React.ReactNode;
  title:     string;
  desc:      string;
  tag?:      string;
  tagStyle?: 'free' | 'optional';
  theme:     LanguageTheme;
  langCode:  string;
  route:     string;
}) {
  const [hovered, setHovered] = useState(false);
  const rtl = isRTL(langCode);
  const hoverProps = Platform.OS === 'web' ? ({
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  } as any) : {};

  return (
    <TouchableOpacity
      style={[
        pc.card,
        hovered && { borderColor: theme.accent, borderLeftWidth: 3, backgroundColor: theme.accentLight },
      ]}
      onPress={() => router.push(route as any)}
      activeOpacity={0.88}
      {...hoverProps}
    >
      <View style={[pc.iconBox, { backgroundColor: theme.accentLight }]}>{icon}</View>
      <View style={pc.mid}>
        <Text style={pc.name}>{title}</Text>
        <Text style={pc.desc}>{desc}</Text>
        {tag && (
          <View style={pc.tags}>
            {tagStyle === 'optional'
              ? <View style={pc.tagOptional}><Text style={pc.tagOptionalText}>{tag}</Text></View>
              : <View style={pc.tagFree}><Text style={pc.tagFreeText}>{tag}</Text></View>
            }
          </View>
        )}
      </View>
      <View style={pc.right}>
        <Chevron rtl={rtl} color="#CCC" size={16} />
      </View>
    </TouchableOpacity>
  );
}

const pc = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    backgroundColor: '#FFF',
    borderRadius: 16, borderWidth: 1, borderColor: '#EAEAEA',
    paddingHorizontal: 22, paddingVertical: 20,
    marginBottom: 10,
  },
  iconBox:  { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  mid:      { flex: 1 },
  name:     { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#000' },
  desc:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#777', marginTop: 3 },
  tags:     { flexDirection: 'row', gap: 6, marginTop: 10, flexWrap: 'wrap' },
  tag:      { backgroundColor: '#F4F4F4', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  tagText:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },
  tagFree:  { backgroundColor: '#F0FFF4', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  tagFreeText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#16A34A' },
  tagOptional: { backgroundColor: '#F4F4F0', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 2 },
  tagOptionalText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },
  right:    { flexDirection: 'column', alignItems: 'flex-end', gap: 6 },
  donePill: { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: '#F0FFF4', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 },
  donePillText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#16A34A' },
  leftPill:     { backgroundColor: '#F0FFF4', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 },
  leftPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#16A34A' },
  proText:      { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#CCC' },
});

// ── Practice tab ──────────────────────────────────────────────────
function PracticeTab({
  langCode, practiced, streak, remaining, examsUnlocked,
  theme, examProfiles, onCardTap,
}: {
  langCode:      string;
  practiced:     Record<PracticeModule, boolean>;
  streak:        number;
  remaining:     number;
  examsUnlocked: boolean;
  theme:         LanguageTheme;
  examProfiles:  ExamProfile[];
  onCardTap:     (card: PracticeCard) => void;
}) {
  const scores    = MOCK_SCORES[langCode] ?? MOCK_SCORES.en;
  const examType  = examProfiles[0]?.id?.toUpperCase() ?? 'IELTS';
  const cefrLevel = getCEFR(scores.band);
  const progress  = Math.min((streak / STREAK_TARGET) * 100, 100);
  const rtl       = isRTL(langCode);

  return (
    <View style={pt.wrap}>
      <Text style={[pt.sectionTitle, rtl && pt.textRTL]}>{t(langCode, 'dailyPractice')}</Text>
      <Text style={[pt.sectionSub,   rtl && pt.textRTL]}>{t(langCode, 'oneSession')}</Text>

      {(() => {
        const foundation = getFoundation(langCode);
        if (!foundation) return null;
        return (
          <TouchableOpacity
            onPress={() => router.push(`/language/${langCode}/foundation` as any)}
            style={[pt.foundationCard, {
              backgroundColor: theme.accentLight,
              borderColor: theme.accent + '30',
            }]}
            activeOpacity={0.85}
          >
            <View style={pt.foundIconBox}>
              <Text style={pt.foundIconText}>
                {foundation.sections[0]?.icon || '📖'}
              </Text>
            </View>

            <View style={pt.foundBody}>
              <Text style={pt.foundTitle}>Foundation</Text>
              <Text style={pt.foundSub}>Scripts · Vocabulary · Grammar</Text>
              <View style={pt.foundSections}>
                {foundation.sections.slice(0, 3).map(s => (
                  <View key={s.id} style={pt.foundTag}>
                    <Text style={pt.foundTagText}>
                      {s.title.split('·')[0].trim()}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={pt.foundRight}>
              <View style={pt.optionalBadge}>
                <Text style={pt.optionalText}>Optional</Text>
              </View>
              <Text style={pt.foundArrow}>›</Text>
            </View>
          </TouchableOpacity>
        );
      })()}

      {PRACTICE_CARDS.map(card => (
        <PracticeCardItem
          key={card.module}
          card={card}
          theme={theme}
          practiced={practiced[card.module]}
          examType={examType}
          langCode={langCode}
          onTap={() => onCardTap(card)}
        />
      ))}

      <ExtraCardItem
        icon={<SpeakIcon size={24} color={theme.accent} strokeWidth={1.5} />}
        title={t(langCode, 'aiTutor')}
        desc={t(langCode, 'aiTutorDesc')}
        tag={t(langCode, 'free')}
        theme={theme}
        langCode={langCode}
        route={`/language/${langCode}/tutor`}
      />
      <ExtraCardItem
        icon={<BookIcon size={24} color={theme.accent} strokeWidth={1.5} />}
        title={t(langCode, 'contentLibrary')}
        desc={t(langCode, 'libraryDesc')}
        theme={theme}
        langCode={langCode}
        route={`/language/${langCode}/library`}
      />

      {/* Streak card */}
      <View style={pt.streakCard}>
        <View style={[pt.streakRow, rtl && { flexDirection: 'row-reverse' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[pt.streakLabel, rtl && pt.textRTL]}>
              {t(langCode, 'yourStreak').toUpperCase()}
            </Text>
            <View style={[pt.streakNumRow, rtl && { flexDirection: 'row-reverse' }]}>
              <Text style={[pt.streakNum, { color: theme.accent }]}>{streak}</Text>
              <Text style={pt.streakDen}>/{STREAK_TARGET}</Text>
              <Text style={pt.streakUnit}> {t(langCode, 'streak').toLowerCase()}</Text>
            </View>
            <View style={pt.streakTrack}>
              <View style={[pt.streakFill, { width: `${progress}%` as any, backgroundColor: theme.accent }]} />
            </View>
            <View style={[pt.statusLine, rtl && { flexDirection: 'row-reverse' }]}>
              {examsUnlocked ? (
                <>
                  <CheckIcon size={14} color="#16A34A" strokeWidth={2.5} />
                  <Text style={[pt.statusUnlocked, rtl && pt.textRTL]}>{t(langCode, 'examUnlocked')}</Text>
                </>
              ) : (
                <Text style={[pt.statusLocked, rtl && pt.textRTL]}>
                  {t(langCode, 'keepGoing')} {remaining} {t(langCode, 'daysToUnlock')} {examType}
                </Text>
              )}
            </View>
          </View>

          <View style={[pt.levelBadge, { backgroundColor: theme.accentLight }]}>
            <Text style={[pt.levelValue, { color: theme.accentDark }]}>{cefrLevel}</Text>
            <Text style={pt.levelLabel}>{t(langCode, 'currentLevel')}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const pt = StyleSheet.create({
  wrap:        { padding: 20 },
  sectionTitle:{ fontFamily: 'Inter_700Bold', fontSize: 18, color: Colors.ink, marginBottom: 4 },
  sectionSub:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.ink3, marginBottom: 16 },
  textRTL:     { textAlign: 'right' },

  streakCard: {
    backgroundColor: '#FFF',
    borderRadius: 16, borderWidth: 1, borderColor: '#EAEAEA',
    paddingHorizontal: 24, paddingVertical: 22,
    marginTop: 4,
  },
  streakRow:    { flexDirection: 'row', alignItems: 'center', gap: 20 },
  streakLabel:  { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#999', letterSpacing: 0.6, marginBottom: 8 },
  streakNumRow: { flexDirection: 'row', alignItems: 'baseline' },
  streakNum:    { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 52, lineHeight: 56, letterSpacing: -2 },
  streakDen:    { fontFamily: 'Inter_400Regular', fontSize: 20, color: '#CCC' },
  streakUnit:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#CCC', paddingBottom: 2 },
  streakTrack:  { height: 6, backgroundColor: '#F4F4F4', borderRadius: 3, overflow: 'hidden', marginTop: 14 },
  streakFill:   { height: '100%', borderRadius: 3 },
  statusLine:   { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  statusUnlocked:{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#16A34A' },
  statusLocked:  { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#999' },

  levelBadge: { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', gap: 4 },
  levelValue: { fontFamily: 'Inter_700Bold', fontSize: 24 },
  levelLabel: { fontFamily: 'Inter_400Regular', fontSize: 10, color: '#999' },

  // Foundation card
  foundationCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  foundIconBox: {
    width: 44, height: 44,
    borderRadius: 12,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  foundIconText:  { fontSize: 22 },
  foundBody:      { flex: 1 },
  foundTitle:     { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000', marginBottom: 2 },
  foundSub:       { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#888', marginBottom: 8 },
  foundSections:  { flexDirection: 'row', gap: 4, flexWrap: 'wrap' },
  foundTag:       { backgroundColor: 'white', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  foundTagText:   { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#666' },
  foundRight:     { alignItems: 'flex-end', gap: 6 },
  optionalBadge:  { backgroundColor: '#F4F4F0', borderRadius: 4, paddingHorizontal: 7, paddingVertical: 2 },
  optionalText:   { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },
  foundArrow:     { fontSize: 18, color: '#CCC' },
});

// ── Dashboard tab ─────────────────────────────────────────────────
function DashboardTab({
  langCode, streak, accentColor,
}: {
  langCode: string; streak: number; accentColor: string;
}) {
  const scores  = MOCK_SCORES[langCode]  ?? MOCK_SCORES.en;
  const history = MOCK_HISTORY[langCode] ?? MOCK_HISTORY.en;
  const [period, setPeriod] = useState<Period>('30d');
  const rtl = isRTL(langCode);

  const stats = [
    { labelKey: 'sessions'  as TranslationKey, value: '24',                   change: '+3',   up: true, color: '#000' },
    { labelKey: 'bandScore' as TranslationKey, value: scores.band.toFixed(1), change: '+0.5', up: true, color: accentColor },
    { labelKey: 'bestScore' as TranslationKey, value: '8.0',                  change: null,   up: null, color: Colors.gold },
    { labelKey: 'streak'    as TranslationKey, value: `${streak}`,            change: `+${streak}`, up: true, color: Colors.orange },
  ];

  const moduleKeys:  TranslationKey[] = ['speaking', 'writing', 'listening', 'reading'];
  const moduleColors = [Colors.orange, Colors.gold, Colors.green, Colors.blue];
  const moduleVals   = [scores.speaking, scores.writing, scores.listening, scores.reading];

  return (
    <View style={db.wrap}>
      <View style={db.statRow}>
        {stats.map(m => (
          <View key={m.labelKey} style={db.statCard}>
            <Text style={[db.statLabel, rtl && { textAlign: 'center' }]}>
              {t(langCode, m.labelKey).toUpperCase()}
            </Text>
            <Text style={[db.statVal, { color: m.color }]}>{m.value}</Text>
            {m.change !== null && (
              <Text style={[db.statChange, { color: m.up ? '#16A34A' : '#DC2626' }]}>{m.change}</Text>
            )}
          </View>
        ))}
      </View>

      <View style={db.chartCard}>
        <View style={[db.chartHeader, rtl && { flexDirection: 'row-reverse' }]}>
          <Text style={db.chartTitle}>{t(langCode, 'scoreHistory')}</Text>
          <View style={db.periods}>
            {(['7d', '30d', '90d'] as Period[]).map(p => (
              <TouchableOpacity
                key={p}
                style={[db.periodBtn, period === p && db.periodBtnActive]}
                onPress={() => setPeriod(p)}
                activeOpacity={0.7}
              >
                <Text style={[db.periodText, period === p && db.periodTextActive]}>{p}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={db.chartWrap}>
          <SparklineChart data={history} color={accentColor} height={120} />
        </View>
      </View>

      <View style={db.skillCard}>
        <Text style={[db.skillTitle, rtl && pt.textRTL]}>{t(langCode, 'skillBreakdown')}</Text>
        {moduleKeys.map((key, i) => (
          <View key={key} style={[db.skillRow, rtl && { flexDirection: 'row-reverse' }]}>
            <Text style={[db.skillName, rtl && { textAlign: 'right' }]}>{t(langCode, key)}</Text>
            <View style={db.skillTrack}>
              <View style={[db.skillFill, {
                width: `${(moduleVals[i] / 9) * 100}%` as any,
                backgroundColor: moduleColors[i],
              }]} />
            </View>
            <Text style={[db.skillScore, { color: moduleColors[i] }]}>{moduleVals[i].toFixed(1)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const db = StyleSheet.create({
  wrap: { padding: 20, gap: 10 },
  statRow: { flexDirection: 'row', gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#EAEAEA',
    paddingHorizontal: 12, paddingVertical: 16, gap: 4,
  },
  statLabel:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#999', letterSpacing: 0.4 },
  statVal:    { fontFamily: 'Inter_700Bold', fontSize: 22 },
  statChange: { fontFamily: 'Inter_500Medium', fontSize: 11 },
  chartCard: {
    backgroundColor: '#FFF',
    borderRadius: 14, borderWidth: 1, borderColor: '#EAEAEA',
    padding: 20,
  },
  chartHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  chartTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000' },
  chartWrap:   { alignItems: 'stretch' },
  periods:        { flexDirection: 'row', gap: 4 },
  periodBtn:      { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: '#F4F4F4' },
  periodBtnActive:{ backgroundColor: '#000' },
  periodText:     { fontFamily: 'Inter_500Medium', fontSize: 10, color: '#666' },
  periodTextActive:{ color: '#FFF', fontFamily: 'Inter_600SemiBold' },
  skillCard: {
    backgroundColor: '#FFF',
    borderRadius: 14, borderWidth: 1, borderColor: '#EAEAEA',
    padding: 20,
  },
  skillTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#000', marginBottom: 16 },
  skillRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  skillName:  { fontFamily: 'Inter_500Medium', fontSize: 13, color: '#000', width: 80 },
  skillTrack: { flex: 1, height: 8, backgroundColor: '#F4F4F4', borderRadius: 4, overflow: 'hidden' },
  skillFill:  { height: '100%', borderRadius: 4 },
  skillScore: { fontFamily: 'Inter_700Bold', fontSize: 13, width: 32, textAlign: 'right' },
});

// ── Monthly exam dark card ────────────────────────────────────────
function MonthlyExamCard({ exam, langCode }: { exam: ExamProfile; langCode: string }) {
  const rtl = isRTL(langCode);
  const stats = [
    { label: t(langCode, 'sessions'), value: '5' },
    { label: t(langCode, 'avgScore'), value: '7.0' },
    { label: 'Ranking', value: 'Top 20%' },
  ];
  return (
    <View style={me.card}>
      <Text style={[me.eyebrow, rtl && pt.textRTL]}>{t(langCode, 'monthlyExamLabel')}</Text>
      <Text style={[me.examName, rtl && pt.textRTL]}>{exam.name}</Text>
      <Text style={[me.month, rtl && pt.textRTL]}>May 2026</Text>
      <View style={[me.pillRow, rtl && { flexDirection: 'row-reverse' }]}>
        {stats.map(s => (
          <View key={s.label} style={me.pill}>
            <Text style={me.pillVal}>{s.value}</Text>
            <Text style={me.pillLabel}>{s.label.toUpperCase()}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={me.registerBtn}
        onPress={() => router.push(`/language/${langCode}/${exam.id}/monthly-exam` as any)}
        activeOpacity={0.85}
      >
        <Text style={me.registerText}>{t(langCode, 'register')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const me = StyleSheet.create({
  card: { backgroundColor: '#000', borderRadius: 14, padding: 22, marginBottom: 12 },
  eyebrow:  { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: 0.8, marginBottom: 8 },
  examName: { fontFamily: 'Inter_700Bold', fontSize: 22, color: '#FFF' },
  month:    { fontFamily: 'Inter_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 16 },
  pillRow:  { flexDirection: 'row', gap: 8, marginBottom: 16 },
  pill:     { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 10, gap: 2 },
  pillVal:  { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#FFF' },
  pillLabel:{ fontFamily: 'Inter_400Regular', fontSize: 10, color: 'rgba(255,255,255,0.5)' },
  registerBtn: { backgroundColor: '#FFF', borderRadius: 8, padding: 11, alignItems: 'center' },
  registerText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#000' },
});

// ── Exams tab ─────────────────────────────────────────────────────
function ExamsTab({
  langCode, examProfiles, examsUnlocked, remaining, streak, accentColor,
}: {
  langCode:      string;
  examProfiles:  ExamProfile[];
  examsUnlocked: boolean;
  remaining:     number;
  streak:        number;
  accentColor:   string;
}) {
  const rtl      = isRTL(langCode);
  const progress = Math.min((streak / STREAK_TARGET) * 100, 100);

  if (examProfiles.length === 0) {
    return (
      <View style={ex.empty}>
        <Text style={ex.emptyTitle}>No exams available</Text>
        <Text style={ex.emptySub}>Exam support for this language is coming soon.</Text>
      </View>
    );
  }

  return (
    <View style={ex.wrap}>
      {examsUnlocked && examProfiles.length > 0 && (
        <MonthlyExamCard exam={examProfiles[0]} langCode={langCode} />
      )}

      {examProfiles.map(exam => (
        <View key={exam.id} style={[ex.card, { borderLeftColor: examsUnlocked ? exam.color : '#EAEAEA' }]}>
          <View style={[ex.topRow, rtl && { flexDirection: 'row-reverse' }]}>
            <View style={{ flex: 1 }}>
              <Text style={[ex.examName, !examsUnlocked && ex.examNameLocked, rtl && pt.textRTL]}>
                {exam.name}
              </Text>
              <Text style={[ex.examFull, rtl && pt.textRTL]}>{exam.fullName}</Text>
            </View>
            {examsUnlocked ? (
              <View style={ex.unlockedBadge}>
                <CheckIcon size={10} color="#16A34A" strokeWidth={2.5} />
                <Text style={ex.unlockedText}>{t(langCode, 'unlocked')}</Text>
              </View>
            ) : (
              <View style={ex.lockedBadge}>
                <Text style={ex.lockedText}>{remaining} {t(langCode, 'daysLeft')}</Text>
              </View>
            )}
          </View>

          {examsUnlocked && (
            <View style={[ex.statsRow, rtl && { flexDirection: 'row-reverse' }]}>
              <Text style={ex.statItem}>{t(langCode, 'avgScore')}: <Text style={ex.statVal}>7.0</Text></Text>
              <Text style={ex.statItem}>{t(langCode, 'sessions')}: <Text style={ex.statVal}>5</Text></Text>
              <Text style={ex.statItem}>{t(langCode, 'lastAttempt')}: <Text style={ex.statVal}>Apr 10</Text></Text>
            </View>
          )}

          {!examsUnlocked && (
            <View style={ex.progressSection}>
              <Text style={[ex.progressLabel, rtl && pt.textRTL]}>{t(langCode, 'streakProgress')}</Text>
              <View style={ex.progressTrack}>
                <View style={[ex.progressFill, { width: `${progress}%` as any, backgroundColor: accentColor }]} />
              </View>
            </View>
          )}

          <View style={[ex.actions, rtl && { flexDirection: 'row-reverse' }]}>
            <TouchableOpacity
              style={[ex.primaryBtn, { backgroundColor: examsUnlocked ? accentColor : '#EAEAEA' }]}
              onPress={() => router.push(`/language/${langCode}/${exam.id}/exam-entry` as any)}
              activeOpacity={0.85}
              disabled={!examsUnlocked}
            >
              <Text style={[ex.primaryBtnText, !examsUnlocked && ex.disabledText]}>
                {t(langCode, 'practiceNow')}
              </Text>
            </TouchableOpacity>
            {examsUnlocked && (
              <TouchableOpacity
                style={[ex.secondaryBtn, { borderColor: accentColor }]}
                onPress={() => router.push(`/language/${langCode}/${exam.id}/monthly-exam` as any)}
                activeOpacity={0.85}
              >
                <Text style={[ex.secondaryBtnText, { color: accentColor }]}>
                  {t(langCode, 'monthlyExam')}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const ex = StyleSheet.create({
  wrap:  { padding: 20 },
  empty: { padding: 32, alignItems: 'center', gap: 8 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: Colors.ink },
  emptySub:   { fontFamily: 'Inter_400Regular',  fontSize: 13, color: Colors.ink3, textAlign: 'center' },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14, borderWidth: 1, borderColor: '#EAEAEA',
    borderLeftWidth: 4, padding: 20, marginBottom: 12, gap: 14,
  },
  topRow:         { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  examName:       { fontFamily: 'Inter_700Bold', fontSize: 17, color: '#000' },
  examNameLocked: { color: '#999' },
  examFull:       { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', marginTop: 2 },
  unlockedBadge:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#EDFAF4', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 },
  unlockedText:   { fontFamily: 'Inter_700Bold', fontSize: 10, color: '#16A34A' },
  lockedBadge:    { backgroundColor: '#F4F4F4', borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 },
  lockedText:     { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#888' },
  statsRow:       { flexDirection: 'row', gap: 20 },
  statItem:       { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },
  statVal:        { fontFamily: 'Inter_600SemiBold', color: '#333' },
  progressSection:{ gap: 6 },
  progressLabel:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },
  progressTrack:  { height: 4, backgroundColor: '#F4F4F4', borderRadius: 2, overflow: 'hidden' },
  progressFill:   { height: '100%', borderRadius: 2 },
  actions:        { flexDirection: 'row', gap: 8 },
  primaryBtn:     { flex: 1, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  primaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#FFF' },
  disabledText:   { color: '#999' },
  secondaryBtn:   { flex: 1, backgroundColor: '#FFF', borderWidth: 1.5, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  secondaryBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 13 },
});

// ── Non-Latin script languages that support romanization toggle ────
const NON_LATIN_LANGS = new Set(['ja', 'zh', 'ar', 'ko', 'hi', 'ru', 'fa']);

// ── Main screen ───────────────────────────────────────────────────
export default function LanguageDashboard() {
  const { code }   = useLocalSearchParams<{ code: string }>();
  const langCode    = code ?? 'en';
  const theme       = getTheme(langCode);
  const accentColor = theme.accent;
  const rtl         = isRTL(langCode);

  const { user, profile } = useAuth();
  const [langRecord,  setLangRecord]  = useState<UserLanguage | null>(null);
  const [practiced,   setPracticed]   = useState<Record<PracticeModule, boolean>>({
    speaking: false, writing: false, listening: false, reading: false,
  });
  const [activeTab,  setActiveTab]  = useState<Tab>('practice');
  const [showRoman,  setShowRoman]  = useState(true);

  // Load romanization preference for this language
  useEffect(() => {
    if (!NON_LATIN_LANGS.has(langCode)) return;
    Storage.get(`romanization_${langCode}`).then(val => {
      if (val !== null) setShowRoman(val === 'true');
    });
  }, [langCode]);

  function toggleRoman() {
    const next = !showRoman;
    setShowRoman(next);
    Storage.set(`romanization_${langCode}`, String(next));
  }

  const streak        = profile?.streak_count ?? 32;
  const remaining     = Math.max(0, STREAK_TARGET - streak);
  const examsUnlocked = streak >= STREAK_TARGET;
  const examProfiles  = (LANGUAGE_EXAMS[langCode] ?? []) as ExamProfile[];

  // Track streak milestones when the page loads with a milestone streak value
  useEffect(() => {
    const milestones = [7, 14, 30, 40] as const;
    if (milestones.includes(streak as any)) {
      Analytics.streakMilestone({
        languageCode: langCode,
        streakDays:   streak,
        milestone:    streak as 7 | 14 | 30 | 40,
      });
    }
    if (examsUnlocked) {
      const primaryExam = examProfiles[0]?.id ?? 'ielts';
      Analytics.examUnlocked({
        languageCode: langCode,
        examType:     primaryExam,
        streakDays:   streak,
      });
    }
  }, [streak, langCode]);

  const names      = getLangNames(langCode);
  const langNative = langRecord?.language_name_native ?? names.native;

  useEffect(() => {
    if (!user?.id) return;
    supabase.from('user_languages').select('*')
      .eq('user_id', user.id).eq('language_code', langCode).single()
      .then(({ data }) => { if (data) setLangRecord(data); });
  }, [user?.id, langCode]);

  // Save last active language so home screen can redirect back here
  useEffect(() => {
    Storage.set('lastActiveLanguage', langCode);
  }, [langCode]);

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

  function onCardTap(card: PracticeCard) {
    if (card.pro) {
      Alert.alert('Pro Feature', 'This module is available with Fluentra Pro.', [
        { text: 'Not now', style: 'cancel' },
        { text: 'Upgrade', onPress: () => router.push('/upgrade' as any) },
      ]);
      return;
    }
    const primaryExam = examProfiles[0]?.id ?? 'ielts';
    router.push({
      pathname: card.route as any,
      params: { languageCode: langCode, examType: primaryExam },
    });
  }

  const tabs: { key: Tab; labelKey: TranslationKey }[] = [
    { key: 'practice',  labelKey: 'practice'  },
    { key: 'dashboard', labelKey: 'dashboard' },
    { key: 'exams',     labelKey: 'exams'     },
  ];

  return (
    <LanguageThemeProvider code={langCode}>
    <AppLayout>
    <SafeAreaView style={[s.safe, rtl && { direction: 'rtl' } as any]} edges={['top']}>

      {/* ── Header band ── */}
      <View style={[s.headerBand, { backgroundColor: theme.bg }]}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
          <View style={rtl ? { transform: [{ scaleX: -1 }] } : undefined}>
            <ChevronLeftIcon size={14} color={Colors.textSecondary} />
          </View>
        </TouchableOpacity>
        <View style={[s.headerContent, rtl && { flexDirection: 'row-reverse' }]}>
          <View style={[s.headerLeft, rtl && { flexDirection: 'row-reverse' }]}>
            <Text style={s.headerFlag}>{theme.flag}</Text>
            <View>
              <Text style={[s.headerNative, rtl && pt.textRTL]}>{langNative}</Text>
              {theme.native !== theme.name && (
                <Text style={[s.headerEn, rtl && pt.textRTL]}>{theme.name}</Text>
              )}
            </View>
          </View>
          <View style={s.headerRight}>
            {NON_LATIN_LANGS.has(langCode) && (
              <TouchableOpacity
                style={[s.romanToggle, showRoman && { backgroundColor: theme.accentLight, borderColor: theme.accent }]}
                onPress={toggleRoman}
                activeOpacity={0.8}
              >
                <Text style={[s.romanToggleText, showRoman && { color: theme.accent }]}>
                  {showRoman ? 'ABC on' : 'ABC off'}
                </Text>
              </TouchableOpacity>
            )}
            <View style={[s.streakPill, { backgroundColor: theme.accentLight }]}>
              <FlameIcon size={12} color={theme.accent} strokeWidth={1.5} />
              <Text style={[s.streakPillText, { color: theme.accent }]}>Day {streak}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* ── Tab bar ── */}
      <View style={[s.tabBar, rtl && { flexDirection: 'row-reverse' }]}>
        {tabs.map(({ key, labelKey }) => (
          <TouchableOpacity
            key={key}
            style={s.tab}
            onPress={() => setActiveTab(key)}
            activeOpacity={0.75}
          >
            <Text style={[
              s.tabText,
              activeTab === key && s.tabTextActive,
              activeTab === key && { color: theme.accent },
            ]}>
              {t(langCode, labelKey)}
            </Text>
            {activeTab === key && <View style={[s.tabIndicator, { backgroundColor: theme.accent }]} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Content ── */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {activeTab === 'practice' && (
          <PracticeTab
            langCode={langCode}
            practiced={practiced}
            streak={streak}
            remaining={remaining}
            examsUnlocked={examsUnlocked}
            theme={theme}
            examProfiles={examProfiles}
            onCardTap={onCardTap}
          />
        )}
        {activeTab === 'dashboard' && (
          <DashboardTab
            langCode={langCode}
            streak={streak}
            accentColor={accentColor}
          />
        )}
        {activeTab === 'exams' && (
          <ExamsTab
            langCode={langCode}
            examProfiles={examProfiles}
            examsUnlocked={examsUnlocked}
            remaining={remaining}
            streak={streak}
            accentColor={accentColor}
          />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>

    </SafeAreaView>
    </AppLayout>
    </LanguageThemeProvider>
  );
}

// ── Screen styles ─────────────────────────────────────────────────
const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.surface },

  headerBand: {
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20,
  },
  backBtn: {
    width: 26, height: 26, borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, alignSelf: 'flex-start' as const,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerFlag:    { fontSize: 32 },
  headerNative:  { fontFamily: 'Inter_700Bold', fontSize: 24, color: Colors.textPrimary },
  headerEn:      { fontFamily: 'Inter_400Regular', fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  romanToggle: {
    paddingHorizontal: 9, paddingVertical: 4,
    borderRadius: 6, borderWidth: 1,
    borderColor: '#E0E0E0', backgroundColor: '#F4F4F4',
  },
  romanToggleText: { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#999' },

  streakPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  streakPillText: { fontFamily: 'Inter_600SemiBold', fontSize: 11 },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingHorizontal: 20,
  },
  tab:          { paddingVertical: 12, marginRight: 24, position: 'relative', alignItems: 'center' },
  tabText:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: Colors.textSecondary },
  tabTextActive:{ fontFamily: 'Inter_600SemiBold' },
  tabIndicator: {
    position: 'absolute', bottom: 0,
    left: 0, right: 0, height: 2,
    borderTopLeftRadius: 1, borderTopRightRadius: 1,
  },
});
