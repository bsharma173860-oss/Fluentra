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
  en: { name: 'English',    native: 'English',    flag: '🇬🇧', bg: '#F0EEFF', accent: '#5B4EFF', accentLight: '#EEEEFF', accentDark: '#3C3489' },
  fr: { name: 'French',     native: 'Français',   flag: '🇫🇷', bg: '#EEF4FF', accent: '#1558B0', accentLight: '#DDEEFF', accentDark: '#0A3D7A' },
  es: { name: 'Spanish',    native: 'Español',    flag: '🇪🇸', bg: '#FFF0EE', accent: '#C04A06', accentLight: '#FFE5DE', accentDark: '#8A3200' },
  de: { name: 'German',     native: 'Deutsch',    flag: '🇩🇪', bg: '#F0F0F5', accent: '#4A5568', accentLight: '#E8E8F0', accentDark: '#2D3748' },
  it: { name: 'Italian',    native: 'Italiano',   flag: '🇮🇹', bg: '#EEFAF0', accent: '#2D7A4F', accentLight: '#DDFAEB', accentDark: '#1A5C38' },
  pt: { name: 'Portuguese', native: 'Português',  flag: '🇵🇹', bg: '#EDFAF5', accent: '#0A7A5C', accentLight: '#DDFAF0', accentDark: '#065C44' },
  nl: { name: 'Dutch',      native: 'Nederlands', flag: '🇳🇱', bg: '#FFF5EE', accent: '#C05A06', accentLight: '#FFE8D6', accentDark: '#8A3E00' },
  ru: { name: 'Russian',    native: 'Русский',    flag: '🇷🇺', bg: '#EEF2F8', accent: '#2B5BA8', accentLight: '#DDEAF8', accentDark: '#1A3D7A' },
  ja: { name: 'Japanese',   native: '日本語',      flag: '🇯🇵', bg: '#FFF0F5', accent: '#C84070', accentLight: '#FFE0EC', accentDark: '#8A1A44' },
  zh: { name: 'Chinese',    native: '中文',        flag: '🇨🇳', bg: '#FFF3EE', accent: '#C84030', accentLight: '#FFE0DA', accentDark: '#8A1A10' },
  ko: { name: 'Korean',     native: '한국어',      flag: '🇰🇷', bg: '#EDFAFA', accent: '#0A7A8C', accentLight: '#DDFAFA', accentDark: '#065C6A' },
  ar: { name: 'Arabic',     native: 'العربية',    flag: '🇸🇦', bg: '#EDFAF4', accent: '#0A8C5A', accentLight: '#DDFAEE', accentDark: '#065C3A' },
  hi: { name: 'Hindi',      native: 'हिन्दी',      flag: '🇮🇳', bg: '#FFF8EE', accent: '#B07A10', accentLight: '#FFF0D6', accentDark: '#7A5200' },
  tr: { name: 'Turkish',    native: 'Türkçe',     flag: '🇹🇷', bg: '#FFF0EE', accent: '#A82828', accentLight: '#FFE0DE', accentDark: '#6A0A0A' },
  fa: { name: 'Persian',    native: 'فارسی',      flag: '🇮🇷', bg: '#F5EEFF', accent: '#6B4ECC', accentLight: '#EDE0FF', accentDark: '#3C1A8A' },
};

export function getTheme(code: string): LanguageTheme {
  return LANGUAGE_THEMES[code] ?? LANGUAGE_THEMES.en;
}

export const DEFAULT_THEME = LANGUAGE_THEMES.en;
