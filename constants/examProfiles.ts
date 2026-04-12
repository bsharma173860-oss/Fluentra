export type ExamProfile = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  sections: string[];
  scoreRange: { min: number; max: number };
  description: string;
  streakRequired: number;
};

export const ExamProfiles: Record<string, ExamProfile> = {
  IELTS: {
    id: 'IELTS',
    name: 'IELTS Academic',
    shortName: 'IELTS',
    color: '#5B4EFF',
    bgColor: '#EEEEFF',
    sections: ['Listening', 'Reading', 'Writing', 'Speaking'],
    scoreRange: { min: 0, max: 9 },
    description: 'International English Language Testing System',
    streakRequired: 30,
  },
  TOEFL: {
    id: 'TOEFL',
    name: 'TOEFL iBT',
    shortName: 'TOEFL',
    color: '#0A8C5A',
    bgColor: '#EDFAF4',
    sections: ['Reading', 'Listening', 'Speaking', 'Writing'],
    scoreRange: { min: 0, max: 120 },
    description: 'Test of English as a Foreign Language',
    streakRequired: 30,
  },
  DELF: {
    id: 'DELF',
    name: 'DELF B2',
    shortName: 'DELF',
    color: '#B07A10',
    bgColor: '#FEF9EC',
    sections: ['Compréhension orale', 'Compréhension écrite', 'Production écrite', 'Production orale'],
    scoreRange: { min: 0, max: 100 },
    description: 'Diplôme d\'Études en Langue Française',
    streakRequired: 40,
  },
  DELE: {
    id: 'DELE',
    name: 'DELE B2',
    shortName: 'DELE',
    color: '#C04A06',
    bgColor: '#FFF3ED',
    sections: ['Comprensión de lectura', 'Comprensión auditiva', 'Expresión e interacción escritas', 'Expresión e interacción orales'],
    scoreRange: { min: 0, max: 100 },
    description: 'Diplomas de Español como Lengua Extranjera',
    streakRequired: 40,
  },
  FREE: {
    id: 'FREE',
    name: 'Free Practice',
    shortName: 'Free',
    color: '#5B4EFF',
    bgColor: '#EEEEFF',
    sections: ['Speaking', 'Writing', 'Listening', 'Reading'],
    scoreRange: { min: 0, max: 100 },
    description: 'Practice without exam constraints',
    streakRequired: 0,
  },
};
