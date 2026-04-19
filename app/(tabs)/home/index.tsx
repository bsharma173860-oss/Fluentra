import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  View, Text, ScrollView,
  TouchableOpacity, Dimensions,
  StyleSheet, TextInput, Modal,
  Alert, Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useFocusEffect } from 'expo-router'
import { supabase } from '@/lib/supabase'
import { AppLayout } from '@/components/layout/AppLayout'
import { AddLanguageModal } from '@/components/ui/AddLanguageModal'
import { FlagSVG } from '@/components/flags'
import { SearchIcon, PlusIcon, FlameIcon, XIcon } from '@/components/icons'

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = Platform.OS === 'web'
  ? Math.min(420, SCREEN_WIDTH * 0.45)
  : SCREEN_WIDTH * 0.65

const LANGUAGE_THEMES: Record<string, { bg: string; accent: string; accentLight: string }> = {
  en: { bg: '#F0EEFF', accent: '#5B4EFF', accentLight: '#EEEEFF' },
  es: { bg: '#FFF0EE', accent: '#C04A06', accentLight: '#FFE5DE' },
  fr: { bg: '#EEF4FF', accent: '#1558B0', accentLight: '#DDEEFF' },
  de: { bg: '#F0F0F5', accent: '#4A5568', accentLight: '#E8E8F0' },
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

function getNativeName(code: string): string {
  const names: Record<string, string> = {
    en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
    it: 'Italiano', pt: 'Português', zh: '中文', ja: '日本語',
    ko: '한국어', ar: 'العربية', hi: 'हिन्दी', ru: 'Русский',
    tr: 'Türkçe', nl: 'Nederlands', fa: 'فارسی',
  }
  return names[code] || code
}

function getEnglishName(code: string): string {
  const names: Record<string, string> = {
    en: 'English', es: 'Spanish', fr: 'French', de: 'German',
    it: 'Italian', pt: 'Portuguese', zh: 'Chinese', ja: 'Japanese',
    ko: 'Korean', ar: 'Arabic', hi: 'Hindi', ru: 'Russian',
    tr: 'Turkish', nl: 'Dutch', fa: 'Persian',
  }
  return names[code] || code
}

function getExamBadges(code: string): string[] {
  const exams: Record<string, string[]> = {
    en: ['IELTS', 'TOEFL'], es: ['DELE'], fr: ['DELF'],
    de: ['Goethe'], it: ['CILS'], pt: ['CELPE'], zh: ['HSK'],
    ja: ['JLPT'], ko: ['TOPIK'], ru: ['TORFL'],
  }
  return exams[code] || []
}

function getTheme(code: string) {
  return LANGUAGE_THEMES[code] || LANGUAGE_THEMES.en
}

export default function HomeScreen() {
  const [languages, setLanguages]   = useState<any[]>([])
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [adding, setAdding]         = useState('')
  const [userName, setUserName]     = useState('there')
  const scrollRef = useRef<ScrollView>(null)

  async function fetchLanguages() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', user.id)
        .single()
      if (profile?.name) setUserName(profile.name.split(' ')[0])

      const { data, error } = await supabase
        .from('user_languages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (error) { console.error('[home] fetch:', error); setLoading(false); return }

      if (data) {
        const sorted = [...data].sort((a, b) => {
          if (a.language_code === 'en') return -1
          if (b.language_code === 'en') return 1
          return (b.streak_count || 0) - (a.streak_count || 0)
        })
        setLanguages(sorted)
      }
      setLoading(false)
    } catch (e) {
      console.error('[home] fetchLanguages:', e)
      setLoading(false)
    }
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
        setLanguages(prev => [...prev, {
          language_code:        lang.code,
          language_name_en:     lang.english,
          language_name_native: lang.native,
          fluency_percent:      0,
          streak_count:         0,
        }])
        setShowModal(false)
      }
      setAdding('')
      setTimeout(() => fetchLanguages(), 500)
    } catch (e) {
      setAdding('')
    }
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

  const filteredLanguages = searchText.trim() === ''
    ? languages
    : languages.filter(l =>
        getEnglishName(l.language_code).toLowerCase().includes(searchText.toLowerCase()) ||
        getNativeName(l.language_code).toLowerCase().includes(searchText.toLowerCase())
      )

  const totalDots = filteredLanguages.length + 1

  return (
    <AppLayout>
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Header ── */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.name}>{userName}.</Text>
            </View>
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={() => setShowSearch(true)}
            >
              <SearchIcon size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* ── Section label ── */}
          <Text style={styles.sectionLabel}>YOUR LANGUAGES</Text>

          {/* ── Language cards (horizontal scroll) ── */}
          {loading ? (
            <View style={styles.loadingRow}>
              {[0, 1].map(i => (
                <View key={i} style={[styles.skeletonCard, { width: CARD_WIDTH }]} />
              ))}
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              contentContainerStyle={styles.cardsContainer}
              onScroll={e => {
                const x = e.nativeEvent.contentOffset.x
                setActiveIndex(Math.round(x / (CARD_WIDTH + 16)))
              }}
              scrollEventThrottle={16}
            >
              {filteredLanguages.map(lang => {
                const t      = getTheme(lang.language_code)
                const streak = lang.streak_count || 0
                const badges = getExamBadges(lang.language_code)

                return (
                  <TouchableOpacity
                    key={lang.id || lang.language_code}
                    style={[styles.langCard, { width: CARD_WIDTH }]}
                    onPress={() => router.push(`/language/${lang.language_code}` as any)}
                    activeOpacity={0.95}
                  >
                    {/* Card top — themed bg + dot pattern + flag */}
                    <View style={[styles.cardTop, { backgroundColor: t.bg }]}>
                      <View style={styles.dotPattern}>
                        {Array.from({ length: 30 }).map((_, i) => (
                          <View key={i} style={[styles.dotPatternDot, { backgroundColor: t.accent }]} />
                        ))}
                      </View>
                      <View style={styles.flagWrap}>
                        <FlagSVG code={lang.language_code} width={100} height={67} />
                      </View>
                    </View>

                    {/* Card body */}
                    <View style={styles.cardBody}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.nativeName}>{getNativeName(lang.language_code)}</Text>
                        <Text style={styles.englishName}>{getEnglishName(lang.language_code)}</Text>

                        {/* Exam badges */}
                        {badges.length > 0 && (
                          <View style={styles.badgesRow}>
                            {badges.slice(0, 3).map(b => (
                              <View key={b} style={[styles.badge, { backgroundColor: t.accentLight }]}>
                                <Text style={[styles.badgeText, { color: t.accent }]}>{b}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        {/* Streak row */}
                        <View style={styles.streakRow}>
                          <FlameIcon size={14} color={streak > 0 ? t.accent : '#CCC'} />
                          <Text style={[styles.streakText, { color: streak > 0 ? t.accent : '#BBB' }]}>
                            {streak > 0 ? `Day ${streak}` : 'Start streak'}
                          </Text>
                        </View>

                        {/* Progress bar */}
                        <View style={styles.progressBg}>
                          <View style={[
                            styles.progressFill,
                            { width: `${Math.min((streak / 40) * 100, 100)}%` as any, backgroundColor: t.accent },
                          ]} />
                        </View>
                        <Text style={styles.progressText}>{streak}/40 days to unlock exam</Text>

                        {/* Level badge */}
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelText}>
                            {streak < 8 ? 'B1 — Intermediate'
                              : streak < 21 ? 'B2 — Upper Intermediate'
                              : streak < 36 ? 'C1 — Advanced'
                              : 'C2 — Mastery'}
                          </Text>
                        </View>
                      </View>

                      {/* Footer */}
                      <View style={styles.cardFooter}>
                        <Text style={styles.tapHint}>Tap to practice →</Text>
                        <TouchableOpacity
                          onPress={() => removeLanguage(lang)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Text style={styles.removeText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}

              {/* Add card */}
              <TouchableOpacity
                style={[styles.addCard, { width: CARD_WIDTH }]}
                onPress={() => setShowModal(true)}
                activeOpacity={0.8}
              >
                <View style={styles.addCircle}>
                  <PlusIcon size={20} color="#CCC" />
                </View>
                <Text style={styles.addText}>Add a language</Text>
                <Text style={styles.addSub}>+1 new per year</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {/* ── Dots indicator ── */}
          {!loading && totalDots > 1 && (
            <View style={styles.dotsRow}>
              {Array.from({ length: totalDots }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.dotBase,
                    i === activeIndex
                      ? [styles.dotActive, {
                          backgroundColor: i < filteredLanguages.length
                            ? getTheme(filteredLanguages[i].language_code).accent
                            : '#5B4EFF',
                        }]
                      : styles.dotInactive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* ── Recent activity ── */}
          <View style={styles.activitySection}>
            <Text style={styles.sectionLabel}>RECENT ACTIVITY</Text>
            <View style={styles.activityEmpty}>
              <Text style={styles.activityEmptyText}>
                Complete a session to see your activity here
              </Text>
            </View>
          </View>

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
        <View style={styles.searchOverlay}>
          <SafeAreaView edges={['top']}>
            <View style={styles.searchBar}>
              <SearchIcon size={16} color="#BBB" />
              <TextInput
                autoFocus
                style={styles.searchInput}
                placeholder="Search languages..."
                placeholderTextColor="#BBB"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity
                onPress={() => { setShowSearch(false); setSearchText('') }}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <XIcon size={18} color="#999" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <ScrollView style={styles.searchResults} keyboardShouldPersistTaps="handled">
            {filteredLanguages.map(lang => (
              <TouchableOpacity
                key={lang.language_code}
                style={styles.searchItem}
                onPress={() => {
                  setShowSearch(false)
                  setSearchText('')
                  router.push(`/language/${lang.language_code}` as any)
                }}
              >
                <View style={styles.searchItemFlag}>
                  <FlagSVG code={lang.language_code} width={32} height={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.searchItemNative}>{getNativeName(lang.language_code)}</Text>
                  <Text style={styles.searchItemEn}>{getEnglishName(lang.language_code)}</Text>
                </View>
                {(lang.streak_count || 0) > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <FlameIcon size={12} color={getTheme(lang.language_code).accent} />
                    <Text style={[styles.searchItemStreak, { color: getTheme(lang.language_code).accent }]}>
                      {lang.streak_count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            {filteredLanguages.length === 0 && searchText.length > 0 && (
              <Text style={styles.noResults}>No languages found</Text>
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

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#F9F8F5' },
  scroll: { paddingBottom: 32 },

  // ── Header ────────────────────────────────────────────────────
  header: {
    flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
    padding: 24, paddingBottom: 16,
  },
  greeting: {
    fontSize: 11, fontWeight: '600' as const, color: '#999',
    letterSpacing: 0.8, textTransform: 'uppercase' as const, marginBottom: 4,
  },
  name: { fontSize: 26, fontWeight: '700' as const, color: '#000', letterSpacing: -0.5 },
  searchBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#F4F4F0', alignItems: 'center', justifyContent: 'center',
  },

  // ── Section label ─────────────────────────────────────────────
  sectionLabel: {
    fontSize: 11, fontWeight: '600' as const, color: '#999',
    letterSpacing: 0.8, textTransform: 'uppercase' as const,
    paddingHorizontal: 24, marginBottom: 12,
  },

  // ── Loading skeletons ─────────────────────────────────────────
  loadingRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 24 },
  skeletonCard: { height: 420, borderRadius: 24, backgroundColor: '#EDECEA' },

  // ── Horizontal scroll ─────────────────────────────────────────
  cardsContainer: { paddingLeft: 24, paddingRight: 60, gap: 16, paddingBottom: 4 },

  // ── Language card ─────────────────────────────────────────────
  langCard: {
    height: 420,
    backgroundColor: '#FFF',
    borderRadius: 24, borderWidth: 1, borderColor: '#EAEAEA',
    overflow: 'hidden',
  },

  cardTop: {
    height: 180,
    alignItems: 'center', justifyContent: 'center',
    overflow: 'hidden', position: 'relative',
  },
  dotPattern: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    flexDirection: 'row', flexWrap: 'wrap',
    padding: 16, gap: 14, opacity: 0.15,
  },
  dotPatternDot: { width: 3, height: 3, borderRadius: 1.5 },
  flagWrap: {
    borderRadius: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 8,
    elevation: 5,
  },

  cardBody: { padding: 20, flex: 1, flexDirection: 'column' },

  nativeName:  { fontSize: 22, fontWeight: '700' as const, color: '#000', marginBottom: 2 },
  englishName: { fontSize: 13, color: '#999', marginBottom: 12 },

  badgesRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 14 },
  badge:     { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 5 },
  badgeText: { fontSize: 11, fontWeight: '600' as const },

  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  streakText: { fontSize: 13, fontWeight: '600' as const },

  progressBg:   { height: 4, backgroundColor: '#F4F4F0', borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%' as any, borderRadius: 2 },
  progressText: { fontSize: 11, color: '#BBB', marginBottom: 12 },

  levelBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#F4F4F0', borderRadius: 6,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  levelText: { fontSize: 11, fontWeight: '600' as const, color: '#666' },

  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F4F4F4',
    paddingTop: 12, marginTop: 'auto' as any,
  },
  tapHint:    { fontSize: 12, color: '#BBB' },
  removeText: { fontSize: 11, color: '#CCC' },

  // ── Add card ───────────────────────────────────────────────────
  addCard: {
    height: 420,
    borderWidth: 1.5, borderStyle: 'dashed' as const, borderColor: '#DCDCDC',
    borderRadius: 24, backgroundColor: 'transparent',
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  addCircle: {
    width: 48, height: 48, borderRadius: 24,
    borderWidth: 1.5, borderColor: '#DCDCDC',
    alignItems: 'center', justifyContent: 'center',
  },
  addText: { fontSize: 16, fontWeight: '500' as const, color: '#BBB' },
  addSub:  { fontSize: 12, color: '#DDD' },

  // ── Dots ───────────────────────────────────────────────────────
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    alignItems: 'center', gap: 6, marginTop: 12, marginBottom: 24,
  },
  dotBase:    { borderRadius: 4 },
  dotActive:  { width: 8, height: 8 },
  dotInactive: { width: 6, height: 6, backgroundColor: '#DDD' },

  // ── Activity section ───────────────────────────────────────────
  activitySection: { paddingHorizontal: 24 },
  activityEmpty: {
    backgroundColor: '#FFF', borderRadius: 12,
    borderWidth: 1, borderColor: '#EAEAEA',
    padding: 20, alignItems: 'center',
  },
  activityEmptyText: { fontSize: 13, color: '#BBB', textAlign: 'center' },

  // ── Search modal ───────────────────────────────────────────────
  searchOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  searchBar: {
    backgroundColor: '#FFF',
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, height: 52,
    borderBottomWidth: 1, borderBottomColor: '#EAEAEA',
  },
  searchInput: { flex: 1, fontSize: 15, color: '#000', padding: 0 },
  searchResults:   { backgroundColor: '#FFF', maxHeight: 380 },
  searchItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F4F4F4',
  },
  searchItemFlag:   { borderRadius: 4, overflow: 'hidden' },
  searchItemNative: { fontSize: 14, fontWeight: '600' as const, color: '#000' },
  searchItemEn:     { fontSize: 11, color: '#999', marginTop: 2 },
  searchItemStreak: { fontSize: 13, fontWeight: '600' as const },
  noResults: { padding: 24, textAlign: 'center', color: '#BBB', fontSize: 14 },
})
