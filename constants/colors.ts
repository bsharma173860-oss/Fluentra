export const Colors = {
  // ── Legacy warm palette (keep for backward compat) ───────────────
  p:       '#D97757',
  pDark:   '#C96442',
  p_soft:  '#FAF0EB',

  ink:     '#09090B',
  ink2:    '#57574E',
  ink3:    '#71717A',
  ink4:    '#A1A1AA',

  border:       '#E4E4E7',
  borderStrong: '#D4D4D8',

  bg:        '#FAFAFA',
  bgSidebar: '#0F0F0F',
  bg2:       '#F4F4F5',
  bgHover:   '#F4F4F5',

  white: '#FFFFFF',

  orange:     '#D97706',
  orange_bg:  '#FEF3C7',
  gold:       '#8A6F3E',
  gold_bg:    '#FAF7F0',
  green:      '#16A34A',
  green_bg:   '#DCFCE7',
  blue:       '#5B6BA8',
  blue_bg:    '#EEF0FA',
  purple:     '#7B5EA7',
  purple_bg:  '#F3EEF9',

  ielts:    '#5B4EFF',
  ielts_bg: '#EEF2FF',

  danger:    '#DC2626',
  danger_bg: '#FEF2F2',

  // ── Linear design system tokens ──────────────────────────────────
  // Page & card surfaces
  surface:    '#FAFAFA',
  card:       '#FFFFFF',
  cardBorder: '#E4E4E7',

  // Text
  textPrimary:   '#09090B',
  textSecondary: '#71717A',
  textMuted:     '#A1A1AA',

  // Sidebar (dark)
  sidebarBg:          '#0F0F0F',
  sidebarBorder:      '#1F1F1F',
  sidebarHover:       '#1A1A1A',
  sidebarInput:       '#1A1A1A',
  sidebarInputBorder: '#2A2A2A',
  sidebarLabel:       '#3F3F46',
  sidebarText:        '#A1A1AA',
  sidebarTextActive:  '#FFFFFF',

  // Accent (purple)
  accent:      '#5B4EFF',
  accentBg:    '#EEF2FF',
  accentHover: '#4338CA',
} as const;

export type ColorKey = keyof typeof Colors;
