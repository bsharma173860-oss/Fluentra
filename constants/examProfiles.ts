export type ExamProfile = {
  id: string;
  name: string;
  fullName: string;
  color: string;
  bg: string;
  scoreLabel: string;
  scoreMin: number;
  scoreMax: number;
};

export const LANGUAGE_EXAMS: Record<string, ExamProfile[]> = {
  en: [
    {
      id: 'ielts',
      name: 'IELTS Academic',
      fullName: 'International English Language Testing System',
      color: '#5B4EFF',
      bg: '#EEEEFF',
      scoreLabel: 'Band score',
      scoreMin: 0,
      scoreMax: 9,
    },
    {
      id: 'toefl',
      name: 'TOEFL iBT',
      fullName: 'Test of English as a Foreign Language',
      color: '#1558B0',
      bg: '#EEF6FF',
      scoreLabel: 'Score',
      scoreMin: 0,
      scoreMax: 120,
    },
  ],
  es: [
    {
      id: 'dele',
      name: 'DELE B2',
      fullName: 'Diplomas de Español como Lengua Extranjera',
      color: '#C04A06',
      bg: '#FFF3ED',
      scoreLabel: 'Points',
      scoreMin: 0,
      scoreMax: 100,
    },
  ],
  fr: [
    {
      id: 'delf',
      name: 'DELF B2',
      fullName: "Diplôme d'Études en Langue Française",
      color: '#1558B0',
      bg: '#EEF6FF',
      scoreLabel: 'Points',
      scoreMin: 0,
      scoreMax: 100,
    },
  ],
};
