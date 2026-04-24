import React, { useState, useEffect, useCallback } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, Modal, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { AppLayout } from '@/components/layout/AppLayout'
import { AddLanguageModal } from '@/components/ui/AddLanguageModal'
import { FlagSVG } from '@/components/flags'
import {
  SearchIcon, PlusIcon, FlameIcon, XIcon,
  MicIcon, HeadphoneIcon, BookIcon, CheckIcon, ChevronRightIcon,
} from '@/components/icons'

// ─────────────────────────────────────────────────────────────────
// Language themes (per-language accent palette)
// ─────────────────────────────────────────────────────────────────
const LANGUAGE_THEMES: Record<string, { bg: string; accent: string; accentLight: string }> = {
  en: { bg: '#F0EEFF', accent: '#5B4EFF', accentLight: '#EEEEFF' },
  es: { bg: '#FFF0EE', accent: '#C04A06', accentLight: '#FFE5DE' },
  fr: { bg: '#EEF4FF', accent: '#1558B0', accentLight: '#DDEEFF' },
  de: { bg: '#FFF7E8', accent: '#A65A00', accentLight: '#FFEAC2' },
  it: { bg: '#EEFAF0', accent: '#2D7A4F', accentLight: '#DDFAEB' },
  pt: { bg: '#EDFAF5', accent: '#0A7A5C', accentLight: '#DDFAF0' },
  zh: { bg: '#FFF3EE', accent: '#C84030', accentLight: '#FFE0DA' },
  ja: { bg: '#FFF0F5', accent: '#C84070', accentLight: '#FFE0EC' },
  ko: { bg: '#EDFAFA', accent: '#0A7A8C', accentLight: '#DDFAFA' },
  ar: { bg: '#EDFAF4', accent: '#0A8C5A', accentLight: '#DDFAEE' },
  hi: { bg: '#FFF8EE', accent: '#B07A10', accentLight: '#FFF0D6' },
  ru: { bg: '#EEF2F8', accent: '#2B5BA8', accentLight: '#DDEAF8' },
  tr: { bg: '#FFF0EE', accent: '#A82828', accentLight: '#FFE0DE' },
  nl: { bg: '#FFF5EE', accent: '#C05A06', accentLight: '#FFE8D6' },
  fa: { bg: '#F5EEFF', accent: '#6B4ECC', accentLight: '#EDE0FF' },
}

function getTheme(code: string) {
  return LANGUAGE_THEMES[code] || LANGUAGE_THEMES.en
}

function getNativeName(code: string): string {
  const n: Record<string, string> = {
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
    it: 'Italiano', pt: 'Português', zh: '中文', ja: '日本語',
    ko: '한국어', ar: 'العربية', hi: 'हिन्दी', ru: 'Русский',
    tr: 'Türkçe', nl: 'Nederlands', fa: 'فارسی',
  }
  return n[code] || code
}

function getEnglishName(code: string): string {
  const n: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese',
    ko: 'Korean', ar: 'Arabic', hi: 'Hindi', ru: 'Russian',
    tr: 'Turkish', nl: 'Dutch', fa: 'Persian',
  }
  return n[code] || code
}

function getExamBadges(code: string): string[] {
  const e: Record<string, string[]> = {
    en: ['IELTS', 'TOEFL'], es: ['DELE'], fr: ['DELF'],
    de: ['Goethe'], it: ['CILS'], pt: ['CELPE'], zh: ['HSK'],
    ja: ['JLPT'], ko: ['TOPIK'], ru: ['TORFL'],
  }
  return e[code] || []
}

function cefrFor(streak: number): string {
  if (streak < 8)  return 'B1'
  if (streak < 21) return 'B2'
  if (streak < 36) return 'C1'
  return 'C2'
}

// ─────────────────────────────────────────────────────────────────
// Mock session data (replace with real Supabase data when available)
// ─────────────────────────────────────────────────────────────────
type StepIc = 'mic' | 'head' | 'book'
type Step = { ic: StepIc; label: string; meta: string; done: boolean }
type SessionInfo = { title: string; time: string; focus: string; steps: Step[] }

const SESSION_DATA: Record<string, SessionInfo> = {
  es: {
    title: 'Ordering at a café',
    time: '12 min', focus: 'Speaking + Listening',
    steps: [
      { ic: 'mic',  label: 'Pronunciation warm-up', meta: '3 min', done: true  },
      { ic: 'head', label: 'Listen & repeat',        meta: '5 min', done: false },
      { ic: 'book', label: 'New vocabulary',         meta: '4 min', done: false },
    ],
  },
  ja: {
    title: 'Train station announcements',
    time: '15 min', focus: 'Listening',
    steps: [
      { ic: 'head', label: 'Listen & repeat',   meta: '6 min', done: false },
      { ic: 'book', label: 'Kanji review · 12', meta: '5 min', done: false },
      { ic: 'mic',  label: 'Shadowing',         meta: '4 min', done: false },
    ],
  },
  fr: {
    title: 'Passé composé',
    time: '10 min', focus: 'Grammar',
    steps: [
      { ic: 'book', label: 'Review rules',        meta: '3 min', done: true  },
      { ic: 'book', label: 'Fill-in-the-blanks',  meta: '4 min', done: false },
      { ic: 'mic',  label: 'Speak in past tense', meta: '3 min', done: false },
    ],
  },
  de: {
    title: 'At the bakery',
    time: '8 min', focus: 'Vocabulary',
    steps: [
      { ic: 'book', label: 'New words · 8',     meta: '3 min', done: false },
      { ic: 'mic',  label: 'Pronounce 5 words', meta: '3 min', done: false },
      { ic: 'head', label: 'Mini dialogue',     meta: '2 min', done: false },
    ],
  },
}

function getSession(code: string): SessionInfo {
  return SESSION_DATA[code] ?? {
    title: 'Daily practice session',
    time: '10 min', focus: 'Listening + Speaking',
    steps: [
      { ic: 'head', label: 'Listen & repeat',   meta: '4 min', done: false },
      { ic: 'mic',  label: 'Speaking practice', meta: '3 min', done: false },
      { ic: 'book', label: 'Vocabulary review', meta: '3 min', done: false },
    ],
  }
}

function StepIcon({ ic, done }: { ic: StepIc; done: boolean }) {
  const color = done ? '#FFF' : '#999'
  if (ic === 'mic')  return <MicIcon  size={13} color={color} />
  if (ic === 'head') return <HeadphoneIcon size={13} color={color} />
  return <BookIcon size={13} color={color} />
}

// ─────────────────────────────────────────────────────────────────
// Collapsed card
// ─────────────────────────────────────────────────────────────────
function LangCardCollapsed({ lang, onTap }: { lang: any; onTap: () => void }) {
  const code   = lang.language_code
  const t      = getTheme(code)
  const streak = lang.streak_count || 0

  return (
    <TouchableOpacity style={cc.card} onPress={onTap} activeOpacity={0.85}>
      <View style={cc.flag}>
        <FlagSVG code={code} width={42} height={30} />
      </View>
      <View style={cc.info}>
        <Text style={cc.native} numberOfLines={1}>{getNativeName(code)}</Text>
        <Text style={cc.sub}>{getEnglishName(code)} · {cefrFor(streak)}</Text>
      </View>
      <View style={cc.streakRow}>
        <FlameIcon size={13} color={streak > 0 ? t.accent : '#CCC'} />
        <Text style={[cc.streakNum, { color: streak > 0 ? t.accent : '#BBB' }]}>{streak}</Text>
      </View>
      <ChevronRightIcon size={14} color="#BBB" />
    </TouchableOpacity>
  )
}

const cc = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 20, borderWidth: 1, borderColor: '#EAEAEA',
    padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14,
  },
  flag:      { borderRadius: 5, overflow: 'hidden', flexShrink: 0 },
  info:      { flex: 1, minWidth: 0 },
  native:    { fontFamily: 'Inter_700Bold', fontSize: 16, color: '#000', lineHeight: 20 },
  sub:       { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999', marginTop: 1 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 6 },
  streakNum: { fontFamily: 'Inter_700Bold', fontSize: 13 },
})

// ─────────────────────────────────────────────────────────────────
// Expanded card
// ─────────────────────────────────────────────────────────────────
function LangCardExpanded({ lang, onClose, onRemove }: { lang: any; onClose: () => void; onRemove: () => void }) {
  const code    = lang.language_code
  const t       = getTheme(code)
  const streak  = lang.streak_count || 0
  const session = getSession(code)
  const badges  = getExamBadges(code)
  const cefr    = cefrFor(streak)

  const [steps,     setSteps]     = useState<Step[]>(() => session.steps.map(s => ({ ...s })))
  const [completed, setCompleted] = useState(false)

  const doneCount = steps.filter(s => s.done).length
  const stepPct   = steps.length > 0 ? (doneCount / steps.length) * 100 : 0

  function toggleStep(i: number) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, done: !s.done } : s))
  }

  return (
    <View style={[ex.card, {
      borderColor: t.accentLight,
      shadowColor: t.accent,
    }]}>

      {/* ── Header ── */}
      <View style={ex.header}>
        <View style={ex.flagSmall}>
          <FlagSVG code={code} width={32} height={22} />
        </View>
        <Text style={ex.headerNative}>{getNativeName(code)}</Text>
        <Text style={ex.headerEn}> · {getEnglishName(code)}</Text>
        <View style={ex.headerStreak}>
          <FlameIcon size={14} color={t.accent} />
          <Text style={[ex.headerStreakNum, { color: t.accent }]}>{streak}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={ex.closeBtn} activeOpacity={0.7}>
          <View style={{ transform: [{ rotate: '-90deg' }] }}>
            <ChevronRightIcon size={14} color="#BBB" />
          </View>
        </TouchableOpacity>
      </View>

      {/* ── Today's session hero ── */}
      <View style={[ex.hero, { backgroundColor: t.bg }]}>
        {/* Decorative dot grid */}
        <View style={ex.dotGrid} pointerEvents="none">
          {Array.from({ length: 25 }).map((_, i) => (
            <View key={i} style={[ex.dotItem, { backgroundColor: t.accent }]} />
          ))}
        </View>
        <Text style={[ex.heroEyebrow, { color: t.accent }]}>TODAY'S SESSION</Text>
        <Text style={ex.heroTitle}>{session.title}</Text>
        <Text style={ex.heroMeta}>{session.time} · {session.focus}</Text>
      </View>

      {/* ── Checklist ── */}
      <View style={ex.checklist}>
        {steps.map((step, i) => (
          <TouchableOpacity
            key={i}
            style={ex.checkRow}
            onPress={() => toggleStep(i)}
            activeOpacity={0.7}
          >
            <View style={[ex.checkCircle, { backgroundColor: step.done ? t.accent : '#F4F4F0' }]}>
              {step.done
                ? <CheckIcon size={12} color="#FFF" />
                : <StepIcon ic={step.ic} done={false} />}
            </View>
            <Text style={[ex.checkLabel, step.done && ex.checkLabelDone]}>{step.label}</Text>
            <Text style={ex.checkMeta}>{step.meta}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── Progress + CTA ── */}
      <View style={ex.ctaSection}>
        <View style={ex.progressRow}>
          <Text style={ex.progressLabel}>SESSION</Text>
          <Text style={ex.progressCount}>{doneCount}/{steps.length} steps</Text>
        </View>
        <View style={ex.progressTrack}>
          <View style={[ex.progressFill, {
            width: `${stepPct}%` as any,
            backgroundColor: t.accent,
          }]} />
        </View>

        <TouchableOpacity
          style={[ex.continueBtn, { backgroundColor: completed ? '#E8E6DF' : t.accent }]}
          onPress={() => setCompleted(c => !c)}
          activeOpacity={0.85}
        >
          <Text style={[ex.continueBtnText, completed && { color: '#888' }]}>
            {completed ? 'Session started →' : 'Continue →'}
          </Text>
        </TouchableOpacity>

        {/* Footer meta */}
        <View style={ex.footerRow}>
          <Text style={ex.footerLeft}>
            {badges.length > 0 ? `${badges[0]} · ` : ''}{cefr}
          </Text>
          <View style={ex.footerRight}>
            <Text style={ex.footerRightText}>{streak}/40 to exam</Text>
            <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={ex.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

    </View>
  )
}

const ex = StyleSheet.create({
  card: {
    backgroundColor: '#FFF', borderRadius: 24, borderWidth: 1,
    overflow: 'hidden',
    shadowOpacity: 0.1, shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  flagSmall:       { borderRadius: 3, overflow: 'hidden', flexShrink: 0 },
  headerNative:    { fontFamily: 'Inter_700Bold', fontSize: 15, color: '#000' },
  headerEn:        { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#999' },
  headerStreak:    { marginLeft: 'auto' as any, flexDirection: 'row', alignItems: 'center', gap: 4 },
  headerStreakNum: { fontFamily: 'Inter_700Bold', fontSize: 14 },
  closeBtn:        { marginLeft: 8, padding: 4 },

  // Hero
  hero: {
    paddingHorizontal: 22, paddingVertical: 20,
    position: 'relative', overflow: 'hidden',
  },
  dotGrid: {
    position: 'absolute', top: 8, right: -8,
    flexDirection: 'row', flexWrap: 'wrap',
    width: 80, gap: 6, opacity: 0.12,
  },
  dotItem:     { width: 3, height: 3, borderRadius: 1.5 },
  heroEyebrow: {
    fontFamily: 'Inter_700Bold', fontSize: 10,
    textTransform: 'uppercase' as const, letterSpacing: 2.5, marginBottom: 6,
  },
  heroTitle: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 26,
    color: '#000', lineHeight: 30, marginBottom: 6,
  },
  heroMeta: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#666' },

  // Checklist
  checklist:     { paddingHorizontal: 22, paddingVertical: 16, gap: 10 },
  checkRow:      { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkCircle: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  checkLabel:     { fontFamily: 'Inter_500Medium', fontSize: 13.5, color: '#000', flex: 1 },
  checkLabelDone: { color: '#BBB', textDecorationLine: 'line-through' as const },
  checkMeta:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#BBB' },

  // CTA section
  ctaSection:    { paddingHorizontal: 22, paddingBottom: 20, paddingTop: 4 },
  progressRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  progressLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#999', letterSpacing: 0.5 },
  progressCount: { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#666' },
  progressTrack: { height: 4, backgroundColor: '#F4F4F0', borderRadius: 99, overflow: 'hidden', marginBottom: 14 },
  progressFill:  { height: '100%' as any, borderRadius: 99 },

  continueBtn: {
    borderRadius: 14, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  continueBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14.5, color: '#FFF' },

  footerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 14, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: '#F4F4F4',
  },
  footerLeft:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },
  footerRight:     { flexDirection: 'row', alignItems: 'center', gap: 10 },
  footerRightText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999' },
  removeText:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#DDD' },
})

// ─────────────────────────────────────────────────────────────────
// Main home screen
// ─────────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [languages,    setLanguages]    = useState<any[]>([])
  const [loading,      setLoading]      = useState(true)
  const [showModal,    setShowModal]    = useState(false)
  const [showSearch,   setShowSearch]   = useState(false)
  const [searchText,   setSearchText]   = useState('')
  const [adding,       setAdding]       = useState('')
  const [userName,     setUserName]     = useState('there')
  const [expandedCode, setExpandedCode] = useState<string | null>(null)

  async function fetchLanguages() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase
        .from('profiles').select('name').eq('id', user.id).single()
      if (profile?.name) setUserName(profile.name.split(' ')[0])

      const { data, error } = await supabase
        .from('user_languages').select('*')
        .eq('user_id', user.id).order('created_at', { ascending: true })

      if (!error && data) {
        const sorted = [...data].sort((a, b) => {
          if (a.language_code === 'en') return -1
          if (b.language_code === 'en') return  1
          return (b.streak_count || 0) - (a.streak_count || 0)
        })
        setLanguages(sorted)
        // Auto-expand the first language on first load
        if (sorted.length > 0 && expandedCode === null) {
          setExpandedCode(sorted[0].language_code)
        }
      }
      setLoading(false)
    } catch { setLoading(false) }
  }

  useFocusEffect(useCallback(() => { fetchLanguages() }, []))

  useEffect(() => {
    fetchLanguages()
    const channel = supabase
      .channel('home-' + Date.now())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_languages' },
        () => fetchLanguages())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  async function addLanguage(lang: { code: string; native: string; english: string }) {
    setAdding(lang.code)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setAdding(''); return }
      const { error } = await supabase.from('user_languages').insert({
        user_id:              user.id,
        language_code:        lang.code,
        language_name_en:     lang.english,
        language_name_native: lang.native,
        fluency_percent:      0,
        streak_count:         0,
        exam_unlocked:        false,
      })
      if (!error) {
        setShowModal(false)
        setTimeout(() => fetchLanguages(), 400)
      }
      setAdding('')
    } catch { setAdding('') }
  }

  function removeLanguage(lang: any) {
    Alert.alert(
      `Remove ${getEnglishName(lang.language_code)}?`,
      'This will delete your streak and progress for this language.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            await supabase.from('user_languages').delete().eq('id', lang.id)
            setLanguages(prev => prev.filter(l => l.id !== lang.id))
            if (expandedCode === lang.language_code) setExpandedCode(null)
          },
        },
      ]
    )
  }

  function getGreeting(): string {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const filtered = searchText.trim() === ''
    ? languages
    : languages.filter(l =>
        getEnglishName(l.language_code).toLowerCase().includes(searchText.toLowerCase()) ||
        getNativeName(l.language_code).toLowerCase().includes(searchText.toLowerCase())
      )

  return (
    <AppLayout>
      <SafeAreaView style={s.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

          {/* ── Greeting ── */}
          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={s.greeting}>{getGreeting()}</Text>
              <Text style={s.name}>{userName}.</Text>
            </View>
            <TouchableOpacity style={s.searchBtn} onPress={() => setShowSearch(true)}>
              <SearchIcon size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* ── YOUR LANGUAGES row ── */}
          <View style={s.sectionRow}>
            <Text style={s.sectionLabel}>YOUR LANGUAGES</Text>
            <TouchableOpacity
              style={s.addBtn}
              onPress={() => setShowModal(true)}
              activeOpacity={0.8}
            >
              <PlusIcon size={14} color="#666" />
              <Text style={s.addBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* ── Language card list ── */}
          <View style={s.cardList}>
            {loading ? (
              <>
                {[0, 1].map(i => <View key={i} style={s.skeleton} />)}
              </>
            ) : filtered.length === 0 ? (
              <TouchableOpacity style={s.emptyCard} onPress={() => setShowModal(true)} activeOpacity={0.8}>
                <PlusIcon size={20} color="#CCC" />
                <Text style={s.emptyText}>Add your first language</Text>
              </TouchableOpacity>
            ) : (
              filtered.map(lang => {
                const code = lang.language_code
                if (expandedCode === code) {
                  return (
                    <LangCardExpanded
                      key={lang.id || code}
                      lang={lang}
                      onClose={() => setExpandedCode(null)}
                      onRemove={() => removeLanguage(lang)}
                    />
                  )
                }
                return (
                  <LangCardCollapsed
                    key={lang.id || code}
                    lang={lang}
                    onTap={() => setExpandedCode(code)}
                  />
                )
              })
            )}
          </View>

          {/* ── Weekly review promo ── */}
          {!loading && (
            <TouchableOpacity
              style={s.promoCard}
              activeOpacity={0.85}
              onPress={() => router.push('/(tabs)/progress' as any)}
            >
              <View style={s.promoIcon}>
                <Text style={{ fontSize: 18 }}>✨</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.promoTitle}>Weekly review is ready</Text>
                <Text style={s.promoSub}>8 min · covers 42 new words</Text>
              </View>
              <ChevronRightIcon size={14} color="#BBB" />
            </TouchableOpacity>
          )}

          <View style={{ height: 48 }} />
        </ScrollView>
      </SafeAreaView>

      {/* ── Search modal ── */}
      <Modal
        visible={showSearch}
        transparent
        animationType="fade"
        onRequestClose={() => { setShowSearch(false); setSearchText('') }}
      >
        <View style={s.searchOverlay}>
          <SafeAreaView edges={['top']}>
            <View style={s.searchBar}>
              <SearchIcon size={16} color="#BBB" />
              <TextInput
                autoFocus
                style={s.searchInput}
                placeholder="Search languages..."
                placeholderTextColor="#BBB"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity onPress={() => { setShowSearch(false); setSearchText('') }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <XIcon size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
          <ScrollView style={s.searchResults} keyboardShouldPersistTaps="handled">
            {filtered.map(lang => (
              <TouchableOpacity
                key={lang.language_code}
                style={s.searchItem}
                onPress={() => { setShowSearch(false); setSearchText(''); router.push(`/language/${lang.language_code}` as any) }}
              >
                <View style={{ borderRadius: 4, overflow: 'hidden' }}>
                  <FlagSVG code={lang.language_code} width={32} height={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.searchItemNative}>{getNativeName(lang.language_code)}</Text>
                  <Text style={s.searchItemEn}>{getEnglishName(lang.language_code)}</Text>
                </View>
                {(lang.streak_count || 0) > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <FlameIcon size={12} color={getTheme(lang.language_code).accent} />
                    <Text style={[s.searchItemStreak, { color: getTheme(lang.language_code).accent }]}>
                      {lang.streak_count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {filtered.length === 0 && searchText.length > 0 && (
              <Text style={s.noResults}>No languages found</Text>
            )}
            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </Modal>

      {/* ── Add language modal ── */}
      <AddLanguageModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        addedCodes={languages.map(l => l.language_code)}
        addingCode={adding}
        onAdd={addLanguage}
      />
    </AppLayout>
  )
}

// ─────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F9F8F5' },
  scroll: { paddingBottom: 32 },

  // Greeting
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    paddingHorizontal: 22, paddingTop: 28, paddingBottom: 20,
  },
  greeting: {
    fontFamily: 'Inter_600SemiBold', fontSize: 11, color: '#999',
    letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 4,
  },
  name: {
    fontFamily: 'DMSerifDisplay_400Regular', fontSize: 34, color: '#000', lineHeight: 38,
  },
  searchBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F4F4F0', alignItems: 'center', justifyContent: 'center',
  },

  // Section row
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 22, marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: 'Inter_700Bold', fontSize: 11, color: '#999',
    letterSpacing: 1, textTransform: 'uppercase' as const,
  },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  addBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: '#666' },

  // Card list
  cardList: { paddingHorizontal: 22, gap: 10 },

  skeleton: {
    height: 72, borderRadius: 20, backgroundColor: '#EDECEA',
  },

  emptyCard: {
    borderWidth: 1.5, borderStyle: 'dashed' as const, borderColor: '#DCDCDC',
    borderRadius: 20, paddingVertical: 32,
    alignItems: 'center', gap: 8,
  },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#CCC' },

  // Promo card
  promoCard: {
    marginHorizontal: 22, marginTop: 24,
    backgroundColor: '#FFF', borderRadius: 16,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  promoIcon: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#F4F4F0', alignItems: 'center', justifyContent: 'center',
  },
  promoTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#000' },
  promoSub:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', marginTop: 2 },

  // Search modal
  searchOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  searchBar: {
    backgroundColor: '#FFF', flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, height: 52,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
  },
  searchInput:     { flex: 1, fontSize: 15, color: '#000', padding: 0 },
  searchResults:   { backgroundColor: '#FFF', maxHeight: 380 },
  searchItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  searchItemNative: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#000' },
  searchItemEn:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#999', marginTop: 2 },
  searchItemStreak: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  noResults: { padding: 24, textAlign: 'center' as const, color: '#BBB', fontSize: 14 },
})
