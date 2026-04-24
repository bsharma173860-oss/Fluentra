/**
 * WebDashboard — desktop-only home screen (V2+V4 hybrid).
 * Rendered only when Platform.OS === 'web' && width >= 768.
 * Uses HTML elements directly (div/svg) so we can leverage CSS
 * gradients, grid, box-shadow, and backdrop-filter.
 */
import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { FlagSVG } from '@/components/flags'
import { FlameIcon, ArrowRightIcon, BellIcon } from '@/components/icons'
import { getTheme } from '@/constants/languageThemes'
import { LANGUAGE_EXAMS } from '@/constants/examProfiles'
import type { ExamProfile } from '@/constants/examProfiles'

// ── Helpers ───────────────────────────────────────────────────────

function cefrShort(streak: number): string {
  if (streak < 8)  return 'B1'
  if (streak < 21) return 'B2'
  if (streak < 36) return 'C1'
  return 'C2'
}

function cefrLong(streak: number): string {
  if (streak < 8)  return 'B1 — Intermediate'
  if (streak < 21) return 'B2 — Upper Intermediate'
  if (streak < 36) return 'C1 — Advanced'
  return 'C2 — Mastery'
}

function getBadges(code: string): string[] {
  const exams: ExamProfile[] | undefined = LANGUAGE_EXAMS[code]
  if (!exams || exams.length === 0) return []
  return exams.slice(0, 2).map(e => e.name.split(' ')[0])
}

const SESSION_TITLES: Record<string, { title: string; time: string; focus: string }> = {
  es: { title: 'Ordering at a café',          time: '12 min', focus: 'Speaking + Listening' },
  ja: { title: 'Train station announcements',  time: '15 min', focus: 'Listening'            },
  fr: { title: 'Passé composé',                time: '10 min', focus: 'Grammar'              },
  de: { title: 'At the bakery',                time: '8 min',  focus: 'Vocabulary'           },
}

function getSession(code: string) {
  return SESSION_TITLES[code] ?? {
    title: 'Daily practice session', time: '10 min', focus: 'Listening + Speaking',
  }
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── SVG Ring ──────────────────────────────────────────────────────
// Uses native HTML <svg> so we get CSS transitions and no RN-SVG quirks.

function SvgRing({
  pct, size, stroke, color, trackColor, children,
}: {
  pct: number; size: number; stroke: number; color: string;
  trackColor: string; children: React.ReactNode;
}) {
  const r      = (size - stroke) / 2
  const C      = 2 * Math.PI * r
  const offset = C - (Math.min(pct, 100) / 100) * C

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}
      >
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${C} ${C}`} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        {children}
      </div>
    </div>
  )
}

// ── Hybrid Card ───────────────────────────────────────────────────

function HybridCard({ lang }: { lang: any }) {
  const [hovered, setHovered] = useState(false)

  const code    = lang.language_code
  const t       = getTheme(code)
  const streak  = lang.streak_count || 0
  const pct     = Math.min((streak / 40) * 100, 100)
  const session = getSession(code)
  const badges  = getBadges(code)
  const cefr    = cefrShort(streak)
  const cefrL   = cefrLong(streak)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => router.push(`/language/${code}` as any)}
      style={{
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        // Gradient background — CSS only, no LinearGradient needed
        background: `linear-gradient(160deg, ${t.accent} 0%, ${t.accent}DD 55%, ${t.bg} 100%)`,
        boxShadow: hovered
          ? `0 16px 48px ${t.accent}33, 0 0 0 1px ${t.accent}22`
          : `0 4px 16px ${t.accent}18`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'all .25s cubic-bezier(.2,.8,.2,1)',
        cursor: 'pointer',
      } as React.CSSProperties}
    >
      {/* ── Gradient hero top ── */}
      <div style={{ padding: '24px 26px 28px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative 10×8 white dot grid, opacity 0.1 */}
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 180, height: 180,
          display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10,
          opacity: 0.1, pointerEvents: 'none',
        }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' }} />
          ))}
        </div>

        {/* Flag (52×34, shadow) + streak pill */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginBottom: 18,
          position: 'relative',
        }}>
          <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,.25)', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <FlagSVG code={code} width={52} height={34} />
          </div>
          {/* Streak pill — glassmorphism */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,.22)',
            padding: '6px 12px', borderRadius: 99,
            backdropFilter: 'blur(10px)',
          }}>
            <FlameIcon size={13} color="#FFF" />
            <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter_700Bold, Inter, sans-serif' }}>
              {streak}-day
            </span>
          </div>
        </div>

        {/* Native name — DM Serif Display 42 */}
        <div style={{ fontFamily: "'DMSerifDisplay_400Regular', 'DM Serif Display', Georgia, serif", fontSize: 42, lineHeight: 1, marginBottom: 4 }}>
          {t.native}
        </div>
        {/* English name + CEFR long — 13/500, opacity .85 */}
        <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 500, fontFamily: 'Inter_500Medium, Inter, sans-serif' }}>
          {t.name} · {cefrL}
        </div>
      </div>

      {/* ── White sheet (ring + stats + CTA) ── */}
      <div style={{
        background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        marginTop: 'auto',
        padding: '22px 26px',
        display: 'flex', gap: 20,
      }}>
        {/* Progress ring — 108px, stroke 9 */}
        <SvgRing pct={pct} size={108} stroke={9} color={t.accent} trackColor="#F2F2F2">
          <div style={{ fontFamily: "'DMSerifDisplay_400Regular', 'DM Serif Display', Georgia, serif", fontSize: 32, color: '#000', lineHeight: 1 }}>
            {streak}
          </div>
          <div style={{ fontSize: 9, color: '#999', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginTop: 2, fontFamily: 'Inter_700Bold, Inter, sans-serif' }}>
            Day streak
          </div>
        </SvgRing>

        {/* Right column */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Badge chips row */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
            {badges.map(b => (
              <div key={b} style={{
                padding: '4px 10px', borderRadius: 99,
                background: t.accentLight, color: t.accent,
                fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em',
                fontFamily: 'Inter_700Bold, Inter, sans-serif',
              }}>
                {b}
              </div>
            ))}
            {/* CEFR chip */}
            <div style={{
              padding: '4px 10px', borderRadius: 99,
              background: '#F4F4F0', color: '#666',
              fontSize: 10.5, fontWeight: 700,
              fontFamily: 'Inter_700Bold, Inter, sans-serif',
            }}>
              {cefr}
            </div>
          </div>

          {/* "NEXT UP" section */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: '#999', textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 600, marginBottom: 2, fontFamily: 'Inter_600SemiBold, Inter, sans-serif' }}>
              Next up
            </div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: '#000', lineHeight: 1.25, fontFamily: 'Inter_600SemiBold, Inter, sans-serif' }}>
              {session.title}
            </div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 2, fontFamily: 'Inter_400Regular, Inter, sans-serif' }}>
              {session.time} · {session.focus}
            </div>
          </div>

          {/* Continue button — fills on card hover */}
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/language/${code}` as any) }}
            style={{
              marginTop: 'auto',
              padding: '10px 14px',
              background: hovered ? t.accent : '#fff',
              color: hovered ? '#fff' : t.accent,
              border: `1.5px solid ${t.accent}`,
              borderRadius: 10,
              fontSize: 12.5, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              cursor: 'pointer',
              transition: 'all .2s',
              fontFamily: 'Inter_700Bold, Inter, sans-serif',
            } as React.CSSProperties}
          >
            Continue
            <ArrowRightIcon size={13} color={hovered ? '#FFF' : t.accent} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Web top bar ───────────────────────────────────────────────────
// height 60, bottom border #EAEAEA, search input + bell + avatar

function WebTopBar({ userName, onSearch }: { userName: string; onSearch?: () => void }) {
  const initial = (userName[0] ?? '?').toUpperCase()

  return (
    <div style={{
      height: 60, flexShrink: 0,
      borderBottom: '1px solid #EAEAEA',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 32px',
      background: '#F9F8F5',
    } as React.CSSProperties}>
      {/* Search — 320px wide, ⌘K chip */}
      <div
        onClick={onSearch}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: 320, padding: '8px 14px',
          background: '#fff', borderRadius: 10,
          border: '1px solid #EAEAEA', color: '#999', cursor: 'pointer',
        }}
      >
        {/* Inline search SVG to avoid react-native-svg layout issues inside a plain div */}
        <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#BBB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <span style={{ fontSize: 13, flex: 1, fontFamily: 'Inter_400Regular, Inter, sans-serif' }}>
          Search lessons, phrases, grammar…
        </span>
        <span style={{
          fontSize: 10, color: '#BBB',
          border: '1px solid #EAEAEA', borderRadius: 4, padding: '2px 6px',
          fontFamily: 'Inter_400Regular, Inter, sans-serif',
        }}>
          ⌘K
        </span>
      </div>

      {/* Bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <BellIcon size={18} color="#666" />
        <div style={{
          width: 32, height: 32, borderRadius: 16,
          background: '#C04A06', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
          fontFamily: 'Inter_700Bold, Inter, sans-serif',
        }}>
          {initial}
        </div>
      </div>
    </div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      height: 280, borderRadius: 24,
      background: 'linear-gradient(90deg, #EDECEA 0%, #F4F3F0 50%, #EDECEA 100%)',
      backgroundSize: '400% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
    } as React.CSSProperties}/>
  )
}

// ── Main WebDashboard ─────────────────────────────────────────────

type Props = {
  languages:       any[];
  userName:        string;
  loading:         boolean;
  onAddLanguage:   () => void;
  onRemoveLanguage: (lang: any) => void;
}

export function WebDashboard({ languages, userName, loading, onAddLanguage }: Props) {
  type Filter = 'all' | 'active' | 'archived'
  const [filter, setFilter] = useState<Filter>('all')

  const totalStreak = languages.reduce((s, l) => s + (l.streak_count || 0), 0)
  const avgProgress = languages.length > 0
    ? Math.round(
        languages.reduce((s, l) => s + Math.min(((l.streak_count || 0) / 40) * 100, 100), 0)
        / languages.length
      )
    : 0

  const greeting     = getGreeting()
  const greetingLine = `${greeting.toUpperCase()}, ${userName.toUpperCase()}`

  const filtered =
    filter === 'active'   ? languages.filter(l => (l.streak_count || 0) > 0) :
    filter === 'archived' ? []   // no archived concept yet — show empty
    : languages

  const filterOptions: [Filter, string][] = [
    ['all',      `All ${languages.length}`],
    ['active',   'Active'],
    ['archived', 'Archived'],
  ]

  return (
    <View style={{ flex: 1 }}>
      {/* Shimmer keyframes injected once */}
      {/* @ts-ignore — style tag is valid on web */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* Top bar */}
      <WebTopBar userName={userName} />

      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 40, paddingTop: 32, paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Greeting + stats ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
          {/* Left: greeting text */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#999', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Inter_700Bold, Inter, sans-serif' }}>
              {greetingLine}
            </div>
            <div style={{ fontFamily: "'DMSerifDisplay_400Regular', 'DM Serif Display', Georgia, serif", fontSize: 40, color: '#000', lineHeight: 1.1 }}>
              Keep the streaks alive.
            </div>
          </div>

          {/* Right: stats pair */}
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#999', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3, fontFamily: 'Inter_700Bold, Inter, sans-serif' }}>
                Total streak days
              </div>
              <div style={{ fontFamily: "'DMSerifDisplay_400Regular', 'DM Serif Display', Georgia, serif", fontSize: 32, color: '#000', lineHeight: 1 }}>
                {totalStreak}
              </div>
            </div>
            {/* Divider */}
            <div style={{ width: 1, background: '#EAEAEA', alignSelf: 'stretch' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: '#999', letterSpacing: '.12em', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3, fontFamily: 'Inter_700Bold, Inter, sans-serif' }}>
                Avg. exam progress
              </div>
              <div style={{ fontFamily: "'DMSerifDisplay_400Regular', 'DM Serif Display', Georgia, serif", fontSize: 32, color: '#000', lineHeight: 1 }}>
                {avgProgress}%
              </div>
            </div>
          </div>
        </div>

        {/* ── Section header + filter tabs ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#000', fontFamily: 'Inter_700Bold, Inter, sans-serif' }}>
            Your languages
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {filterOptions.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                style={{
                  padding: '6px 12px', fontSize: 12, cursor: 'pointer',
                  fontWeight: filter === key ? 600 : 500,
                  color: filter === key ? '#000' : '#999',
                  background: filter === key ? '#fff' : 'transparent',
                  border: filter === key ? '1px solid #EAEAEA' : '1px solid transparent',
                  borderRadius: 8,
                  fontFamily: 'Inter_600SemiBold, Inter, sans-serif',
                  transition: 'all .15s',
                } as React.CSSProperties}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 2-column card grid ── */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 } as React.CSSProperties}>
            <SkeletonCard /><SkeletonCard />
            <SkeletonCard /><SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{
            padding: '60px 40px', textAlign: 'center',
            background: '#fff', borderRadius: 24,
            border: '1.5px dashed #DDD',
          } as React.CSSProperties}>
            <div style={{ fontSize: 15, color: '#888', marginBottom: 12, fontFamily: 'Inter_400Regular, Inter, sans-serif' }}>
              {filter === 'archived' ? 'No archived languages' : 'No languages yet'}
            </div>
            {filter === 'all' && (
              <button
                onClick={onAddLanguage}
                style={{
                  padding: '10px 24px', background: '#000', color: '#fff',
                  borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: 'none',
                  fontFamily: 'Inter_600SemiBold, Inter, sans-serif',
                } as React.CSSProperties}
              >
                Add your first language
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 } as React.CSSProperties}>
            {filtered.map(lang => (
              <HybridCard key={lang.id || lang.language_code} lang={lang} />
            ))}
          </div>
        )}
      </ScrollView>
    </View>
  )
}
