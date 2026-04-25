export type ExamDef = {
  id: string
  name: string
  fullName: string
  color: string
  bg: string
  border: string
}

export const LANGUAGE_EXAMS: Record<string, ExamDef[]> = {
  en: [
    {
      id: 'ielts', name: 'IELTS',
      fullName: 'International English Language Testing System',
      color: '#1558B0', bg: '#EEF4FF', border: '#BFDBFE',
    },
    {
      id: 'toefl', name: 'TOEFL',
      fullName: 'Test of English as a Foreign Language',
      color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0',
    },
  ],
  fr: [
    {
      id: 'delf', name: 'DELF B2',
      fullName: "Diplôme d'Études en Langue Française",
      color: '#1558B0', bg: '#EEF4FF', border: '#BFDBFE',
    },
    {
      id: 'dalf', name: 'DALF C1',
      fullName: 'Diplôme Approfondi de Langue Française',
      color: '#C04A06', bg: '#FFF7ED', border: '#FED7AA',
    },
  ],
  es: [
    {
      id: 'dele', name: 'DELE B2',
      fullName: 'Diplomas de Español como Lengua Extranjera',
      color: '#C04A06', bg: '#FFF7ED', border: '#FED7AA',
    },
    {
      id: 'siele', name: 'SIELE',
      fullName: 'Servicio Internacional de Evaluación de la Lengua Española',
      color: '#B07A10', bg: '#FEF9EC', border: '#FDE68A',
    },
  ],
  de: [
    {
      id: 'goethe', name: 'Goethe B2',
      fullName: 'Goethe-Zertifikat B2',
      color: '#4A5568', bg: '#F0F0F5', border: '#CBD5E0',
    },
    {
      id: 'testdaf', name: 'TestDaF',
      fullName: 'Test Deutsch als Fremdsprache',
      color: '#2B5BA8', bg: '#EEF2F8', border: '#BFD0F0',
    },
  ],
  it: [
    {
      id: 'cils', name: 'CILS B2',
      fullName: 'Certificazione di Italiano come Lingua Straniera',
      color: '#2D7A4F', bg: '#EEFAF0', border: '#BBF7D0',
    },
    {
      id: 'celi', name: 'CELI 3',
      fullName: 'Certificato di Conoscenza della Lingua Italiana',
      color: '#16A34A', bg: '#F0FDF4', border: '#BBF7D0',
    },
  ],
  pt: [
    {
      id: 'celpe', name: 'CELPE-Bras',
      fullName: 'Certificado de Proficiência em Língua Portuguesa',
      color: '#0A7A5C', bg: '#EDFAF5', border: '#99F6E4',
    },
    {
      id: 'caple', name: 'CAPLE',
      fullName: 'Centro de Avaliação de Português Língua Estrangeira',
      color: '#0A8C5A', bg: '#EDFAF4', border: '#BBF7D0',
    },
  ],
  zh: [
    {
      id: 'hsk', name: 'HSK 5',
      fullName: 'Hànyǔ Shuǐpíng Kǎoshì',
      color: '#C84030', bg: '#FFF3EE', border: '#FECACA',
    },
    {
      id: 'hskk', name: 'HSKK',
      fullName: 'HSK Speaking Test',
      color: '#B07A10', bg: '#FEF9EC', border: '#FDE68A',
    },
  ],
  ja: [
    {
      id: 'jlpt', name: 'JLPT N2',
      fullName: 'Japanese Language Proficiency Test',
      color: '#C84070', bg: '#FFF0F5', border: '#FBCFE8',
    },
    {
      id: 'jft', name: 'JFT-Basic',
      fullName: 'Japanese Foundation Test',
      color: '#B07A10', bg: '#FEF9EC', border: '#FDE68A',
    },
  ],
  ko: [
    {
      id: 'topik', name: 'TOPIK II',
      fullName: 'Test of Proficiency in Korean',
      color: '#0A7A8C', bg: '#EDFAFA', border: '#99F6E4',
    },
  ],
  ar: [
    {
      id: 'alpt', name: 'ALPT',
      fullName: 'Arabic Language Proficiency Test',
      color: '#0A8C5A', bg: '#EDFAF4', border: '#BBF7D0',
    },
    {
      id: 'actfl', name: 'ACTFL',
      fullName: 'American Council on Teaching of Foreign Languages',
      color: '#2B5BA8', bg: '#EEF2F8', border: '#BFD0F0',
    },
  ],
  hi: [
    {
      id: 'praveen', name: 'Praveen',
      fullName: 'Hindi Proficiency Test',
      color: '#B07A10', bg: '#FFF8EE', border: '#FDE68A',
    },
    {
      id: 'hindi_cefr', name: 'CEFR B2',
      fullName: 'Common European Framework Hindi',
      color: '#C04A06', bg: '#FFF7ED', border: '#FED7AA',
    },
  ],
  ru: [
    {
      id: 'torfl', name: 'TORFL B2',
      fullName: 'Test of Russian as a Foreign Language',
      color: '#2B5BA8', bg: '#EEF2F8', border: '#BFD0F0',
    },
  ],
  tr: [
    {
      id: 'tys', name: 'TYS',
      fullName: 'Türkçe Yeterlik Sınavı',
      color: '#A82828', bg: '#FFF0EE', border: '#FECACA',
    },
  ],
  nl: [
    {
      id: 'cnavt', name: 'CNaVT',
      fullName: 'Certificaat Nederlands als Vreemde Taal',
      color: '#C05A06', bg: '#FFF5EE', border: '#FED7AA',
    },
    {
      id: 'nt2', name: 'NT2',
      fullName: 'Nederlands als Tweede Taal',
      color: '#B07A10', bg: '#FEF9EC', border: '#FDE68A',
    },
  ],
  fa: [
    {
      id: 'persian_cefr', name: 'CEFR B2',
      fullName: 'Persian Language Proficiency',
      color: '#6B4ECC', bg: '#F5EEFF', border: '#DDD6FE',
    },
  ],
}

export function getExamsForLanguage(code: string): ExamDef[] {
  return LANGUAGE_EXAMS[code] || LANGUAGE_EXAMS.en
}
