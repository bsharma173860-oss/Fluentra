// ── Fluentra Theme ────────────────────────────────────────────────────────
// Exact tokens from ~/Desktop/claude_code_handoff/tokens.css
// No dark mode token set yet — useColorScheme() hook exists but is not wired.

import { useColorScheme } from 'react-native';

export type AppTheme = {
  dark:         boolean;
  // Surfaces
  bg:           string;
  bg2:          string;
  bg3:          string;
  card:         string;
  paper:        string;
  white:        string;
  // Borders
  border:       string;
  hairline:     string;
  track:        string;
  trackWarm:    string;
  // Ink
  ink:          string;
  ink2:         string;
  ink3:         string;
  ink4:         string;
  ink5:         string;
  // Brand
  brand:        string;
  brandSoft:    string;
  brandLight:   string;
  // Module accents
  speaking:     string;
  speakingBg:   string;
  writing:      string;
  writingBg:    string;
  listening:    string;
  listeningBg:  string;
  reading:      string;
  readingBg:    string;
  // Legacy / compat
  accent:       string;
  accentLight:  string;
};

export function useTheme(): AppTheme {
  // No dark token set defined — using light tokens only.
  return {
    dark: false,
    // Surfaces
    bg:         '#F9F8F5',
    bg2:        '#F4F1EB',
    bg3:        '#EDEAE3',
    card:       '#FFFFFF',
    paper:      '#FFFEFA',
    white:      '#FFFFFF',
    // Borders
    border:     '#EAEAEA',
    hairline:   '#F4F4F4',
    track:      '#F2F2F2',
    trackWarm:  '#F4F4F0',
    // Ink (pure neutral — NOT gray-blue)
    ink:        '#000000',
    ink2:       '#333333',
    ink3:       '#666666',
    ink4:       '#999999',
    ink5:       '#BBBBBB',
    // Brand — deep orange
    brand:      '#C04A06',
    brandSoft:  '#FFF0EE',
    brandLight: '#FFE5DE',
    // Module accents
    speaking:   '#5B4EFF',
    speakingBg: '#EEEDFF',
    writing:    '#A65A00',
    writingBg:  '#FFEAC2',
    listening:  '#1A8F4E',
    listeningBg:'#E2F5E9',
    reading:    '#C04A06',
    readingBg:  '#FFE5DE',
    // Legacy compat
    accent:      '#C04A06',
    accentLight: '#FFE5DE',
  };
}

// ── Static token object (for non-hook contexts) ────────────────────────────
export const T = {
  // Surfaces
  bg:      '#F9F8F5',
  bg2:     '#F4F1EB',
  bg3:     '#EDEAE3',
  card:    '#FFFFFF',
  paper:   '#FFFEFA',
  // Borders
  border:  '#EAEAEA',
  hairline:'#F4F4F4',
  track:   '#F2F2F2',
  trackWarm:'#F4F4F0',
  // Ink
  ink:     '#000000',
  ink2:    '#333333',
  ink3:    '#666666',
  ink4:    '#999999',
  ink5:    '#BBBBBB',
  // Brand
  brand:      '#C04A06',
  brandSoft:  '#FFF0EE',
  brandLight: '#FFE5DE',
  // Module accents (flat strings — use speakingBg etc. for backgrounds)
  speaking:   '#5B4EFF',
  speakingBg: '#EEEDFF',
  writing:    '#A65A00',
  writingBg:  '#FFEAC2',
  listening:  '#1A8F4E',
  listeningBg:'#E2F5E9',
  reading:    '#C04A06',
  readingBg:  '#FFE5DE',
  // Semantic state
  danger:     '#C0392B',
  dangerBg:   '#FCE6E2',
  dangerDark: '#7A2A1F',
  success:    '#1A8F4E',
  successBg:  '#E2F5E9',
  warning:    '#A65A00',
  warningBg:  '#FFEAC2',
  // Typography
  serif: 'DMSerifDisplay_400Regular' as const,
  sans:  'Inter_400Regular' as const,
  // Radii
  rPill: 99,
  rLg:   18,
  rMd:   16,
  rSm:   14,
  rXs:   10,
  rTile: 9,
  // Spacing (4px grid)
  s1: 4,   s2: 8,   s3: 12,  s4: 16,
  s5: 20,  s6: 24,  s7: 28,  s8: 32,
  s9: 36,  s10: 40, s12: 48,
} as const;

export type T = typeof T;
