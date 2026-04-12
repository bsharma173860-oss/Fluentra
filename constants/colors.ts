export const Colors = {
  p: '#5B4EFF',
  p_soft: '#EEEEFF',
  ink: '#1A1A2E',
  ink2: '#4A4A6A',
  ink3: '#8A8AA8',
  ink4: '#C8C8D8',
  border: '#E8E8E2',
  bg: '#FAFAF8',
  bg2: '#F4F4F0',
  gold: '#B07A10',
  gold_bg: '#FEF9EC',
  green: '#0A8C5A',
  green_bg: '#EDFAF4',
  orange: '#C04A06',
  orange_bg: '#FFF3ED',
  white: '#FFFFFF',
  danger: '#D93025',
} as const;

export type ColorKey = keyof typeof Colors;
