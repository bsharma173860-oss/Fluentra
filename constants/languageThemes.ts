// ── Language Themes ───────────────────────────────────────────────────────
// Exact values from ~/Desktop/claude_code_handoff/tokens.css
// Each language: bg (page tint), accent, accentLight, accentDark

export type LanguageTheme = {
  name:        string;
  native:      string;
  flag:        string;
  bg:          string;
  accent:      string;
  accentLight: string;
  accentDark:  string;
};

export const LANGUAGE_THEMES: Record<string, LanguageTheme> = {
  // Core 5 from design tokens (exact)
  es: { name: 'Spanish',    native: 'Español',    flag: '🇪🇸', bg: '#FFF0EE', accent: '#C04A06', accentLight: '#FFE5DE', accentDark: '#8A3200' },
  ja: { name: 'Japanese',   native: '日本語',      flag: '🇯🇵', bg: '#FFF0F5', accent: '#C84070', accentLight: '#FFE0EC', accentDark: '#8A1A44' },
  fr: { name: 'French',     native: 'Français',   flag: '🇫🇷', bg: '#EEF4FF', accent: '#1558B0', accentLight: '#DDEEFF', accentDark: '#0A3D7A' },
  de: { name: 'German',     native: 'Deutsch',    flag: '🇩🇪', bg: '#FFF7E8', accent: '#A65A00', accentLight: '#FFEAC2', accentDark: '#7A3F00' },
  en: { name: 'English',    native: 'English',    flag: '🇬🇧', bg: '#EEEDFF', accent: '#5B4EFF', accentLight: '#DDDBFF', accentDark: '#3C3489' },

  // Extended languages (from _kit.jsx)
  it: { name: 'Italian',    native: 'Italiano',   flag: '🇮🇹', bg: '#EEF7EE', accent: '#0F8A4D', accentLight: '#D9EFDF', accentDark: '#0A5C30' },
  pt: { name: 'Portuguese', native: 'Português',  flag: '🇵🇹', bg: '#E8F4EC', accent: '#0E6F3F', accentLight: '#D2EBD9', accentDark: '#065C2E' },
  ko: { name: 'Korean',     native: '한국어',      flag: '🇰🇷', bg: '#EEF2FB', accent: '#1F4F8C', accentLight: '#DCE5F4', accentDark: '#0E2D54' },
  zh: { name: 'Chinese',    native: '中文',        flag: '🇨🇳', bg: '#FBE8EB', accent: '#B0142B', accentLight: '#F4D3D8', accentDark: '#6A0010' },
  ar: { name: 'Arabic',     native: 'العربية',    flag: '🇸🇦', bg: '#E8F2EE', accent: '#0D6E55', accentLight: '#D3E6DD', accentDark: '#065040' },
  ru: { name: 'Russian',    native: 'Русский',    flag: '🇷🇺', bg: '#EFF1FA', accent: '#3D52A0', accentLight: '#DEE3F2', accentDark: '#1A2A60' },
  hi: { name: 'Hindi',      native: 'हिन्दी',      flag: '🇮🇳', bg: '#FFEFE0', accent: '#D6792C', accentLight: '#FCDFC0', accentDark: '#8A4200' },
  tr: { name: 'Turkish',    native: 'Türkçe',     flag: '🇹🇷', bg: '#FCE8EB', accent: '#C8242E', accentLight: '#F4D2D6', accentDark: '#6A0008' },
  nl: { name: 'Dutch',      native: 'Nederlands', flag: '🇳🇱', bg: '#FFF5EE', accent: '#C05A06', accentLight: '#FFE8D6', accentDark: '#8A3E00' },
  fa: { name: 'Persian',    native: 'فارسی',      flag: '🇮🇷', bg: '#F5EEFF', accent: '#6B4ECC', accentLight: '#EDE0FF', accentDark: '#3C1A8A' },
};

export function getTheme(code: string): LanguageTheme {
  return LANGUAGE_THEMES[code] ?? LANGUAGE_THEMES.en;
}

export const DEFAULT_THEME = LANGUAGE_THEMES.en;
