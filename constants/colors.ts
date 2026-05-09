// ── Fluentra Design Tokens ────────────────────────────────────────────────
// Source of truth: ~/Desktop/claude_code_handoff/tokens.css
// Brand: deep orange #C04A06 (NOT purple — purple is speaking module only)
// Surfaces: warm off-white system, never pure white as page bg

export const Colors = {
  // ── Brand ──────────────────────────────────────────────────────────────
  brand:      '#C04A06',   // Primary brand orange — CTAs, focus rings, links
  brandSoft:  '#FFF0EE',   // Soft-fill button bg
  brandLight: '#FFE5DE',   // Badge / chip bg
  // brandGrad is a gradient — defined in styles as needed

  // ── Legacy alias kept for backward compat ──────────────────────────────
  // Old purple primary is now ONLY used for Speaking module accent
  p:       '#C04A06',   // remapped: was #5B4EFF, now brand orange
  pDark:   '#A03A00',   // remapped: was #4338CA
  p_soft:  '#FFF0EE',   // remapped: was #EEF2FF

  // ── Surfaces (warm off-white — never use pure white as page bg) ────────
  bg:    '#F9F8F5',   // Default page background
  bg2:   '#F4F1EB',   // Secondary surface — chips, subtle panels
  bg3:   '#EDEAE3',   // Tertiary surface — canvas / containing layout
  card:  '#FFFFFF',   // Card / panel background
  paper: '#FFFEFA',   // Editorial / reading-mode surface
  white: '#FFFFFF',

  // ── Borders & Hairlines ────────────────────────────────────────────────
  border:       '#EAEAEA',   // Default card / divider border
  borderStrong: '#CCCCCC',   // Stronger border (kept for compat)
  hairline:     '#F4F4F4',   // Subtle internal dividers
  track:        '#F2F2F2',   // Progress bar track (cool)
  trackWarm:    '#F4F4F0',   // Progress bar track (warm)

  // ── Ink scale (pure neutral — NOT gray-blue) ───────────────────────────
  ink:  '#000000',   // Primary text, headlines
  ink2: '#333333',   // Body text
  ink3: '#666666',   // Secondary / supporting
  ink4: '#999999',   // Muted / metadata
  ink5: '#BBBBBB',   // Disabled / very muted

  // ── Text aliases (kept for compat) ────────────────────────────────────
  textPrimary:   '#000000',
  textSecondary: '#666666',
  textMuted:     '#999999',

  // ── Module accents (one per skill) ────────────────────────────────────
  speaking:    '#5B4EFF',   // purple — Speaking module foreground
  speakingBg:  '#EEEDFF',   // Speaking module background
  writing:     '#A65A00',   // gold — Writing module foreground
  writingBg:   '#FFEAC2',   // Writing module background
  listening:   '#1A8F4E',   // green — Listening module foreground
  listeningBg: '#E2F5E9',   // Listening module background
  reading:     '#C04A06',   // orange = brand — Reading module foreground
  readingBg:   '#FFE5DE',   // Reading module background

  // ── Semantic state colors ──────────────────────────────────────────────
  danger:    '#C0392B',   // Error red
  danger_bg: '#FCE6E2',   // Error bg
  warning:   '#A65A00',   // Warning amber (= writing module)
  warning_bg:'#FFEAC2',   // Warning bg
  success:   '#1A8F4E',   // Success green (= listening module)
  success_bg:'#E2F5E9',   // Success bg

  // ── Legacy color aliases ───────────────────────────────────────────────
  green:    '#1A8F4E',
  green_bg: '#E2F5E9',
  orange:   '#C04A06',
  orange_bg:'#FFE5DE',
  gold:     '#A65A00',
  gold_bg:  '#FFEAC2',
  blue:     '#1558B0',
  blue_bg:  '#DDEEFF',
  purple:   '#5B4EFF',
  purple_bg:'#EEEDFF',

  // ── Exam-specific (kept for compat) ───────────────────────────────────
  ielts:    '#5B4EFF',
  ielts_bg: '#EEEDFF',

  // ── UI surfaces ───────────────────────────────────────────────────────
  surface:    '#F9F8F5',
  cardBorder: '#EAEAEA',

  // ── Sidebar tokens ────────────────────────────────────────────────────
  bgSidebar:          '#FFFEFA',   // paper — sidebar uses paper bg
  bgHover:            '#F4F1EB',
  sidebarBg:          '#FFFEFA',
  sidebarBorder:      '#EAEAEA',
  sidebarHover:       '#F4F1EB',
  sidebarActive:      '#F4F1EB',
  sidebarInput:       '#F9F8F5',
  sidebarInputBorder: '#EAEAEA',
  sidebarLabel:       '#999999',
  sidebarText:        '#666666',
  sidebarTextActive:  '#000000',

  // ── Accent (legacy alias → brand) ─────────────────────────────────────
  accent:      '#C04A06',
  accentBg:    '#FFE5DE',
  accentHover: '#A03A00',

  // ── Logo ──────────────────────────────────────────────────────────────
  logoAccent: '#C04A06',   // was #5B4EFF, now brand orange
} as const;

// ── Module accent helper ───────────────────────────────────────────────────
export const MODULE_COLORS = {
  speaking:  { c: Colors.speaking,  bg: Colors.speakingBg  },
  writing:   { c: Colors.writing,   bg: Colors.writingBg   },
  listening: { c: Colors.listening, bg: Colors.listeningBg },
  reading:   { c: Colors.reading,   bg: Colors.readingBg   },
} as const;

export type ModuleKey = keyof typeof MODULE_COLORS;
export type ColorKey = keyof typeof Colors;
