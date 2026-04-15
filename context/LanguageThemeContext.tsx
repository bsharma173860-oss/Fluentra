import React, { createContext, useContext } from 'react';
import { LANGUAGE_THEMES, DEFAULT_THEME, type LanguageTheme } from '@/constants/languageThemes';

export const LanguageThemeContext = createContext<LanguageTheme>(DEFAULT_THEME);

export function LanguageThemeProvider({
  code,
  children,
}: {
  code: string;
  children: React.ReactNode;
}) {
  const theme = LANGUAGE_THEMES[code] ?? DEFAULT_THEME;
  return (
    <LanguageThemeContext.Provider value={theme}>
      {children}
    </LanguageThemeContext.Provider>
  );
}

export function useLanguageTheme(): LanguageTheme {
  return useContext(LanguageThemeContext);
}
