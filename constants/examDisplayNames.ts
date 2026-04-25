export const EXAM_DISPLAY_NAMES: Record<string, string> = {
  ielts:        'IELTS Academic',
  toefl:        'TOEFL iBT',
  delf:         'DELF B2',
  dalf:         'DALF C1',
  dele:         'DELE B2',
  siele:        'SIELE',
  goethe:       'Goethe-Zertifikat B2',
  testdaf:      'TestDaF',
  cils:         'CILS B2',
  celi:         'CELI 3',
  celpe:        'CELPE-Bras',
  caple:        'CAPLE',
  torfl:        'TORFL B2',
  hsk:          'HSK 5',
  hskk:         'HSKK',
  jlpt:         'JLPT N2',
  jft:          'JFT-Basic',
  topik:        'TOPIK II',
  alpt:         'ALPT',
  actfl:        'ACTFL',
  praveen:      'Praveen',
  hindi_cefr:   'CEFR B2',
  persian_cefr: 'CEFR B2',
  tys:          'TYS',
  cnavt:        'CNaVT',
  nt2:          'NT2',
};

export function getExamDisplayName(examId: string): string {
  return EXAM_DISPLAY_NAMES[examId] ?? examId.toUpperCase().replace('_', ' ');
}
