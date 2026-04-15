export const Colors = {
  // ── Legacy warm palette (keep for backward compat) ─────────────
  p:       '#5B4EFF',
  pDark:   '#4338CA',
  p_soft:  '#EEF2FF',

  ink:     '#000000',
  ink2:    '#333333',
  ink3:    '#666666',
  ink4:    '#999999',

  border:       '#EAEAEA',
  borderStrong: '#CCCCCC',

  bg:        '#FAFAFA',
  bgSidebar: '#FFFFFF',
  bg2:       '#F2F2F2',
  bgHover:   '#FAFAFA',

  white: '#FFFFFF',

  orange:     '#F59E0B',
  orange_bg:  '#FFFBEB',
  gold:       '#8A6F3E',
  gold_bg:    '#FEF9EC',
  green:      '#10B981',
  green_bg:   '#ECFDF5',
  blue:       '#3B82F6',
  blue_bg:    '#EFF6FF',
  purple:     '#8B5CF6',
  purple_bg:  '#F5F3FF',

  ielts:    '#5B4EFF',
  ielts_bg: '#EEF2FF',

  danger:    '#EF4444',
  danger_bg: '#FEF2F2',

  // ── Vercel/Stripe design tokens ─────────────────────────────────
  // Surfaces
  surface:    '#FAFAFA',
  card:       '#FFFFFF',
  cardBorder: '#EAEAEA',

  // Text
  textPrimary:   '#000000',
  textSecondary: '#666666',
  textMuted:     '#999999',

  // Sidebar (light)
  sidebarBg:          '#FFFFFF',
  sidebarBorder:      '#EAEAEA',
  sidebarHover:       '#FAFAFA',
  sidebarActive:      '#F2F2F2',
  sidebarInput:       '#FAFAFA',
  sidebarInputBorder: '#EAEAEA',
  sidebarLabel:       '#999999',
  sidebarText:        '#666666',
  sidebarTextActive:  '#000000',

  // Accent (Vercel blue)
  accent:      '#0070F3',
  accentBg:    '#EBF4FF',
  accentHover: '#0060D1',

  // Logo accent (purple for "ra")
  logoAccent: '#5B4EFF',
} as const;

export type ColorKey = keyof typeof Colors;
