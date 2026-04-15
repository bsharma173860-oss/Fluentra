export const Colors = {
  // Primary accent — Claude warm coral
  p:       '#D97757',
  pDark:   '#C96442',
  p_soft:  '#FAF0EB',

  // Text hierarchy
  ink:     '#1A1A18',
  ink2:    '#57574E',
  ink3:    '#9B9B8E',
  ink4:    '#C5C3BB',

  // Borders
  border:       '#E5E3DC',
  borderStrong: '#D0CEC5',

  // Backgrounds
  bg:        '#F9F8F5',
  bgSidebar: '#F2F0EB',
  bg2:       '#EDEBE4',
  bgHover:   '#E8E5DC',

  // White
  white: '#FFFFFF',

  // Module accent colors (warm tones)
  orange:     '#C96442',
  orange_bg:  '#FAF0EB',
  gold:       '#8A6F3E',
  gold_bg:    '#FAF7F0',
  green:      '#3D7A5E',
  green_bg:   '#EEF7F3',
  blue:       '#5B6BA8',
  blue_bg:    '#EEF0FA',
  purple:     '#7B5EA7',
  purple_bg:  '#F3EEF9',

  // Exam purple — keep IELTS/TOEFL brand purple
  ielts:      '#5B4EFF',
  ielts_bg:   '#EEEEFF',

  // Semantic
  danger:     '#C84040',
  danger_bg:  '#FFF0F0',
} as const;

export type ColorKey = keyof typeof Colors;
