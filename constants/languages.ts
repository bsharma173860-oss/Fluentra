export type LangMeta = {
  english: string;
  native: string;
  flag: string;
};

export const LANG_NAMES: Record<string, LangMeta> = {
  en: { english: 'English',    native: 'English',   flag: '🇬🇧' },
  es: { english: 'Spanish',    native: 'Español',   flag: '🇪🇸' },
  fr: { english: 'French',     native: 'Français',  flag: '🇫🇷' },
  de: { english: 'German',     native: 'Deutsch',   flag: '🇩🇪' },
  it: { english: 'Italian',    native: 'Italiano',  flag: '🇮🇹' },
  pt: { english: 'Portuguese', native: 'Português', flag: '🇵🇹' },
  ar: { english: 'Arabic',     native: 'العربية',   flag: '🇸🇦' },
  zh: { english: 'Chinese',    native: '中文',       flag: '🇨🇳' },
  ja: { english: 'Japanese',   native: '日本語',     flag: '🇯🇵' },
  ko: { english: 'Korean',     native: '한국어',     flag: '🇰🇷' },
};

/** Returns both names for a language code, with safe fallbacks. */
export function getLangNames(code: string): LangMeta {
  return LANG_NAMES[code] ?? { english: code.toUpperCase(), native: code.toUpperCase(), flag: '🌐' };
}
