import { useColorScheme } from 'react-native';

export type AppTheme = {
  dark:        boolean;
  bg:          string;
  bg2:         string;
  white:       string;
  border:      string;
  ink:         string;
  ink2:        string;
  ink3:        string;
  ink4:        string;
  accent:      string;
  accentLight: string;
};

export function useTheme(): AppTheme {
  const scheme = useColorScheme();
  const dark   = scheme === 'dark';

  return {
    dark,
    bg:          dark ? '#0A0A0A' : '#F9F8F5',
    bg2:         dark ? '#141414' : '#F4F4F0',
    white:       dark ? '#1A1A1A' : '#FFFFFF',
    border:      dark ? '#2A2A2A' : '#EAEAEA',
    ink:         dark ? '#FFFFFF' : '#000000',
    ink2:        dark ? '#BBBBBB' : '#444440',
    ink3:        dark ? '#777777' : '#888884',
    ink4:        dark ? '#444444' : '#BCBCB8',
    accent:      '#5B4EFF',
    accentLight: dark ? '#1A1833' : '#EEEEFF',
  };
}
