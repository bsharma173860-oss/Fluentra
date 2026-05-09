/**
 * WebDashboard — desktop home screen matching the design handoff prototype.
 * Source: ~/Desktop/claude_code_handoff/prototypes/redesign/web/page_dashboard.jsx
 * Uses HTML elements directly for CSS gradients, grid, box-shadow, backdrop-filter.
 */
import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { FlagSVG } from '@/components/flags'
import { FlameIcon, ArrowRightIcon, BellIcon, PlusIcon } from '@/components/icons'
import { getTheme } from '@/constants/languageThemes'
import { LANGUAGE_EXAMS } from '@/constants/examProfiles'
import type { ExamProfile } from '@/constants/examProfiles'

const T = {
  bg:      '#F9F8F5',
  bg2:     '#F4F1EB',
  bg3:     '#EDEAE3',
  card:    '#FFFFFF',
  paper:   '#FFFEFA',
  border:  '#EAEAEA',
  hairline:'#F4F4F4',
  ink:     '#000000',
  ink2:    '#333333',
  ink3:    '#666666',
  ink4:    '#999999',
  ink5:    '#BBBBBB',
  brand:   '#C04A06',
  brandSoft:'#FFF0EE',
  brandLight:'#FFE5DE',
}

// ── Helpers ───────────────────────────────────────────────────────────────

function cefrShort(streak: number): string {
  if (streak < 8)  return 'B1'
  if (streak < 21) return 'B2'
  if (streak < 36) return 'C1'
  return 'C2'
}

function cefrLong(streak: number): string {
  if (streak < 8)  return 'B1 · Intermediate'
  if (streak < 21) return 'B2 · Upper-int.'
  if (streak < 36) return 'C1 · Advanced'
  return 'C2 · Mastery'
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
  return SESSION_TITLES[code] ?? { title: 'Daily practice', time: '10 min', focus: 'Listening + Speaking' }
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// ── SVG Ring (CSS-animated stroke-dashoffset) ─────────────────────────────

function SvgRing({
  pct, size, stroke, color, children,
}: {
  pct: number; size: number; stroke: number; color: string; children: React.ReactNode
}) {
  const r      = (size - stroke) / 2
  const C      = 2 * Math.PI * r
  const offset = C - (Math.min(pct, 100) / 100) * C

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)', display: 'block' }}>
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={T.bg3} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r}
          fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${C} ${C}`} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  )
}

// ── Language card — full hybrid design (gradient hero + white sheet) ──────

function LangCard({ lang, onEnter, isHovered }: { lang: any; onEnter: () => void; isHovered: boolean }) {
  const code    = lang.language_code
  const t       = getTheme(code)
  const streak  = lang.streak_count || 0
  const pct     = Math.min((streak / 9) * 100, 100)
  const session = getSession(code)
  const badges  = getBadges(code)
  const cefr    = cefrShort(streak)
  const cefrL   = cefrLong(streak)

  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onEnter}
      onClick={() => router.push(`/language/${code}` as any)}
      style={{
        borderRadius: 22, overflow: 'hidden', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        background: `linear-gradient(160deg, ${t.accent} 0%, ${t.accent}DD 55%, ${t.accentLight} 100%)`,
        boxShadow: isHovered
          ? `0 4px 20px ${t.accent}33, 0 0 0 1px ${t.accent}22`
          : `0 4px 20px ${t.accent}1f, 0 0 0 1px ${t.accent}22`,
        transform: isHovered ? 'translateY(-2px)' : 'none',
        transition: 'all .2s cubic-bezier(.2,.8,.2,1)',
      } as React.CSSProperties}
    >
      {/* Gradient hero */}
      <div style={{ padding: '22px 24px 26px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Dot pattern */}
        <div style={{ position: 'absolute', top: -30, right: -20, width: 200, height: 200,
          display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 10,
          opacity: 0.1, pointerEvents: 'none' }}>
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: 2, background: '#fff' }} />
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 18, position: 'relative' }}>
          <div style={{ boxShadow: '0 2px 8px rgba(0,0,0,.2)', borderRadius: 5, overflow: 'hidden' }}>
            <FlagSVG code={code} width={48} height={32} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5,
            background: 'rgba(255,255,255,.22)', padding: '5px 11px',
            borderRadius: 99, backdropFilter: 'blur(10px)', fontSize: 12, fontWeight: 700 }}>
            <FlameIcon size={13} color="#FFF" /> {streak}-day
          </div>
        </div>
        <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
          fontSize: 38, lineHeight: 1, marginBottom: 4 }}>{t.native}</div>
        <div style={{ fontSize: 12.5, opacity: 0.85, fontWeight: 500 }}>{t.name} · {cefrL}</div>
      </div>

      {/* White sheet */}
      <div style={{ background: T.card, borderTopLeftRadius: 22, borderTopRightRadius: 22,
        padding: '20px 22px', display: 'flex', gap: 16 }}>
        <SvgRing pct={pct} size={92} stroke={8} color={t.accent}>
          <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
            fontSize: 26, color: T.ink, lineHeight: 1 }}>{streak}</div>
          <div style={{ fontSize: 8.5, color: T.ink4, letterSpacing: '.12em',
            textTransform: 'uppercase', fontWeight: 700, marginTop: 2 }}>Day streak</div>
        </SvgRing>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Chips */}
          <div style={{ display: 'flex', gap: 5, marginBottom: 8, flexWrap: 'wrap' }}>
            {badges.slice(0, 1).map(b => (
              <div key={b} style={{ padding: '3px 9px', borderRadius: 99,
                background: t.accentLight, color: t.accent,
                fontSize: 10.5, fontWeight: 700, letterSpacing: '.04em' }}>{b}</div>
            ))}
            <div style={{ padding: '3px 9px', borderRadius: 99,
              background: T.bg2, color: T.ink3,
              fontSize: 10.5, fontWeight: 700 }}>{cefr}</div>
          </div>

          {/* Next up */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10, color: T.ink4, fontWeight: 700,
              letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 2 }}>Next up</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, lineHeight: 1.25 }}>
              {session.title}</div>
            <div style={{ fontSize: 11, color: T.ink4, marginTop: 1 }}>
              {session.time} · {session.focus}</div>
          </div>

          {/* Continue button */}
          <button
            onClick={e => { e.stopPropagation(); router.push(`/language/${code}` as any) }}
            style={{
              marginTop: 'auto', padding: '9px 14px',
              background: isHovered ? t.accent : T.card,
              color: isHovered ? '#fff' : t.accent,
              border: `1.5px solid ${t.accent}`, borderRadius: 10,
              fontSize: 12, fontWeight: 700,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              cursor: 'pointer', transition: 'all .2s',
            } as React.CSSProperties}
          >
            Continue <ArrowRightIcon size={12} color={isHovered ? '#fff' : t.accent} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton card ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div style={{
      height: 280, borderRadius: 22,
      background: 'linear-gradient(90deg,#EDECEA 0%,#F4F3F0 50%,#EDECEA 100%)',
      backgroundSize: '400% 100%',
      animation: 'shimmer 1.5s ease-in-out infinite',
    } as React.CSSProperties} />
  )
}

// ── Week calendar strip ───────────────────────────────────────────────────

function WeekCalendar({ streakDays }: { streakDays: number }) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const today = new Date().getDay() // 0=Sun
  const todayIdx = today === 0 ? 6 : today - 1

  return (
    <div style={{ padding: 18, background: T.bg2, borderRadius: 14,
      border: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 28, height: 28, borderRadius: 14,
          background: T.brandLight, color: T.brand,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FlameIcon size={13} color={T.brand} />
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 700, color: T.ink }}>This week</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5 }}>
        {days.map((d, i) => {
          const done  = i < todayIdx && i < streakDays
          const isToday = i === todayIdx
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4 }}>
              <div style={{
                width: '100%', aspectRatio: '1', maxWidth: 32, borderRadius: 8,
                background: done ? T.brand : isToday ? T.brandLight : T.card,
                border: `1.5px solid ${isToday ? T.brand : T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10.5, fontWeight: 700,
                color: done ? '#fff' : isToday ? T.brand : T.ink5,
              }}>
                {done ? '✓' : i + 1}
              </div>
              <div style={{ fontSize: 9.5, fontWeight: isToday ? 700 : 500,
                color: isToday ? T.brand : T.ink4 }}>{d}</div>
            </div>
          )
        })}
      </div>
      <div style={{ marginTop: 12, fontSize: 11.5, color: T.ink3, textAlign: 'center' }}>
        {streakDays}-day streak · keep it going
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────

type Props = {
  languages:        any[]
  userName:         string
  loading:          boolean
  onAddLanguage:    () => void
  onRemoveLanguage: (lang: any) => void
}

export function WebDashboard({ languages, userName, loading, onAddLanguage }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const greeting      = getGreeting()
  const longestStreak = languages.length ? Math.max(...languages.map(l => l.streak_count || 0)) : 0
  const totalStreak   = languages.reduce((s, l) => s + (l.streak_count || 0), 0)
  const topLang       = languages[0]
  const topSession    = topLang ? getSession(topLang.language_code) : null
  const topTheme      = topLang ? getTheme(topLang.language_code) : null

  return (
    <View style={{ flex: 1 }}>
      {/* @ts-ignore */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* ── Topbar ── */}
      <div style={{
        height: 64, flexShrink: 0, borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 36px', background: T.bg,
      } as React.CSSProperties}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, width: 360,
            padding: '9px 14px', background: T.card, borderRadius: 11,
            border: `1px solid ${T.border}`, color: T.ink4, cursor: 'pointer',
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={T.ink5} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: 13, flex: 1 }}>Search lessons, phrases, grammar…</span>
            <span style={{ fontSize: 10, color: T.ink5, border: `1px solid ${T.border}`,
              borderRadius: 5, padding: '2px 6px', fontWeight: 600, letterSpacing: '.04em' }}>⌘K</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button style={{ width: 36, height: 36, borderRadius: 10, background: T.card,
            border: `1px solid ${T.border}`, color: T.ink2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', cursor: 'pointer' }}>
            <BellIcon size={17} color={T.ink3} />
            <span style={{ position: 'absolute', top: 8, right: 8, width: 6, height: 6,
              borderRadius: 3, background: T.brand }} />
          </button>
          <div style={{ width: 36, height: 36, borderRadius: 18,
            background: `linear-gradient(135deg,${T.brand},#E8732F)`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
            {(userName[0] ?? '?').toUpperCase()}
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <ScrollView style={{ flex: 1 }}
        contentContainerStyle={{ padding: '28px 36px 48px' }}
        showsVerticalScrollIndicator={false}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end',
          justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: T.ink4,
              letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>
              {greeting}, {userName}
            </div>
            <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
              fontSize: 38, color: T.ink, lineHeight: 1.1 }}>
              Keep the streaks alive.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: T.ink4, fontWeight: 700,
                letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                Longest streak
              </div>
              <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                fontSize: 32, color: T.ink, lineHeight: 1 }}>
                {longestStreak} <span style={{ fontSize: 18, color: T.ink4 }}>days</span>
              </div>
            </div>
            <div style={{ width: 1, alignSelf: 'stretch', background: T.border }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: T.ink4, fontWeight: 700,
                letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 4 }}>
                Languages
              </div>
              <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                fontSize: 32, color: T.ink, lineHeight: 1 }}>
                {languages.length}
              </div>
            </div>
          </div>
        </div>

        {/* ── Today hero ── */}
        {!loading && topLang && topSession && topTheme && (
          <button
            onClick={() => router.push(`/language/${topLang.language_code}` as any)}
            style={{
              width: '100%', textAlign: 'left', cursor: 'pointer',
              background: 'linear-gradient(110deg,#000 0%,#1a1a14 100%)',
              borderRadius: 18, padding: '20px 26px', marginBottom: 24,
              display: 'flex', alignItems: 'center', gap: 20,
              border: 'none', color: '#fff',
              boxShadow: `0 10px 40px ${topTheme.accent}33`,
            } as React.CSSProperties}
          >
            <div style={{ width: 54, height: 54, borderRadius: 14, background: topTheme.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, color: '#fff', fontSize: 22 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10.5, fontWeight: 700,
                color: 'rgba(255,255,255,.6)', letterSpacing: '.14em',
                textTransform: 'uppercase', marginBottom: 4 }}>
                Your {topSession.time} today
              </div>
              <div style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                fontSize: 22, color: '#fff', lineHeight: 1.15 }}>
                {topSession.title}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)', marginTop: 4 }}>
                {getTheme(topLang.language_code).name} · {topSession.focus}
              </div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 18px', background: topTheme.accent,
              borderRadius: 11, fontSize: 13, fontWeight: 700, color: '#fff',
              flexShrink: 0,
            }}>
              Start now <ArrowRightIcon size={14} color="#fff" />
            </div>
          </button>
        )}

        {/* ── 2-col grid: language cards (2/3) + right rail (1/3) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>

          {/* Language cards */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: T.ink }}>
                Your languages
              </div>
              <button onClick={onAddLanguage} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 12px', fontSize: 12, fontWeight: 600,
                color: T.ink2, background: T.card,
                border: `1px solid ${T.border}`, borderRadius: 9, cursor: 'pointer',
              } as React.CSSProperties}>
                <PlusIcon size={11} color={T.ink3} /> Add language
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 } as React.CSSProperties}>
                <SkeletonCard /><SkeletonCard />
              </div>
            ) : languages.length === 0 ? (
              <div style={{
                padding: '60px 40px', textAlign: 'center',
                background: T.card, borderRadius: 22,
                border: '1.5px dashed #DDD',
              } as React.CSSProperties}>
                <div style={{ fontSize: 15, color: T.ink4, marginBottom: 12 }}>No languages yet</div>
                <button onClick={onAddLanguage} style={{
                  padding: '10px 24px', background: T.ink, color: '#fff',
                  borderRadius: 10, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', border: 'none',
                } as React.CSSProperties}>
                  Add your first language
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 } as React.CSSProperties}>
                {languages.map(lang => (
                  <LangCard
                    key={lang.id || lang.language_code}
                    lang={lang}
                    isHovered={hoveredId === (lang.id || lang.language_code)}
                    onEnter={() => setHoveredId(prev =>
                      prev === (lang.id || lang.language_code) ? null : (lang.id || lang.language_code)
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Week streak calendar */}
            <WeekCalendar streakDays={longestStreak} />

            {/* AI Tutor shortcut */}
            <button
              onClick={() => router.push('/language/en/tutor' as any)}
              style={{
                background: T.ink, color: '#fff', borderRadius: 14,
                padding: '18px 18px', display: 'flex', alignItems: 'center',
                gap: 14, textAlign: 'left', cursor: 'pointer', border: 'none',
              } as React.CSSProperties}
            >
              <div style={{ width: 38, height: 38, borderRadius: 11,
                background: 'rgba(255,255,255,.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Ask the AI tutor</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)', marginTop: 2 }}>
                  Grammar, vocab, conversation
                </div>
              </div>
              <ArrowRightIcon size={14} color="rgba(255,255,255,.5)" />
            </button>

            {/* Quick links */}
            <div style={{ background: T.card, borderRadius: 14,
              border: `1px solid ${T.border}`, padding: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: T.ink4,
                letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>
                Quick links
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {[
                  { label: 'Library',  route: '/library'              },
                  { label: 'Progress', route: '/(tabs)/progress'      },
                  { label: 'Exams',    route: '/(tabs)/exams'         },
                  { label: 'Settings', route: '/(tabs)/settings'      },
                ].map(q => (
                  <button key={q.label}
                    onClick={() => router.push(q.route as any)}
                    style={{
                      padding: '8px 10px', borderRadius: 9, background: T.bg2,
                      border: `1px solid ${T.hairline}`, fontSize: 11.5,
                      color: T.ink2, fontWeight: 600, textAlign: 'left', cursor: 'pointer',
                    } as React.CSSProperties}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats summary */}
            {languages.length > 0 && (
              <div style={{ background: T.card, borderRadius: 14,
                border: `1px solid ${T.border}`, padding: '16px 18px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.ink4,
                  letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Your stats
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Total streak days</span>
                    <span style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                      fontSize: 16, color: T.ink, fontWeight: 400 }}>{totalStreak}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Languages</span>
                    <span style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                      fontSize: 16, color: T.ink }}>{languages.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 12, color: T.ink3 }}>Best streak</span>
                    <span style={{ fontFamily: "'DMSerifDisplay_400Regular','DM Serif Display',Georgia,serif",
                      fontSize: 16, color: T.ink }}>{longestStreak} days</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollView>
    </View>
  )
}
