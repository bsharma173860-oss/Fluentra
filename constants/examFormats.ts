// ── Types ────────────────────────────────────────────────────────

export type ListeningSection = {
  id: string
  name: string
  description?: string
  questions: number
  type: string
  playsCount?: number
  notesTaking?: boolean
  language?: string
}

export type ListeningFormat = {
  sections: ListeningSection[]
  totalQuestions: number
  timeMinutes: number
  scoreRange?: string
  note?: string
}

export type ReadingPassage = {
  id: string
  name: string
  wordCount?: string
  questions: number
  difficulty?: string
  types: string[]
  language?: string
}

export type ReadingFormat = {
  passages: ReadingPassage[]
  totalQuestions: number
  timeMinutes: number
  scoreRange?: string
  note?: string
}

export type WritingTask = {
  id: string
  name: string
  instruction: string
  minWords?: number
  maxWords?: number
  timeMinutes: number
  language?: string
  tips?: string[]
}

export type WritingFormat = {
  tasks: WritingTask[]
  scoringCriteria?: string[]
  scoreRange?: string
}

export type SpeakingPart = {
  id: string
  name: string
  duration?: string
  description: string
  prepTime?: string
  responseTime?: string
  talkTime?: string
  topics?: string[]
  language?: string
}

export type SpeakingFormat = {
  parts: SpeakingPart[]
  scoringCriteria?: string[]
  scoreRange?: string
  totalTime?: string
  note?: string
}

// ── Data ─────────────────────────────────────────────────────────

const EXAM_FORMATS = {

  ielts: {
    writing: {
      tasks: [
        {
          id: 'task1',
          name: 'Task 1',
          instruction: 'Describe the graph, chart, diagram or map below.',
          minWords: 150,
          timeMinutes: 20,
          tips: [
            'Describe main trends only',
            'Use formal academic style',
            'Do not give opinions',
          ],
        },
        {
          id: 'task2',
          name: 'Task 2',
          instruction: 'Write an essay in response to the question below.',
          minWords: 250,
          timeMinutes: 40,
          tips: [
            'Present both sides',
            'Give your opinion clearly',
            'Use linking words',
          ],
        },
      ],
      scoringCriteria: [
        'Task Achievement',
        'Coherence & Cohesion',
        'Lexical Resource',
        'Grammatical Range & Accuracy',
      ],
      scoreRange: 'Band 1–9',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'part1',
          name: 'Part 1',
          duration: '4–5 min',
          description: 'Introduction and interview on familiar topics',
          topics: ['Home', 'Family', 'Work', 'Hobbies', 'Daily routine'],
        },
        {
          id: 'part2',
          name: 'Part 2',
          duration: '3–4 min',
          description: 'Individual long turn with cue card',
          prepTime: '1 min',
          talkTime: '2 min',
        },
        {
          id: 'part3',
          name: 'Part 3',
          duration: '4–5 min',
          description: 'Two-way discussion linked to Part 2 topic',
        },
      ],
      scoringCriteria: [
        'Fluency & Coherence',
        'Lexical Resource',
        'Grammatical Range',
        'Pronunciation',
      ],
      scoreRange: 'Band 1–9',
      totalTime: '11–14 min',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'section1',
          name: 'Section 1',
          description: 'Social conversation between two speakers',
          questions: 10,
          type: 'Form completion',
          playsCount: 1,
        },
        {
          id: 'section2',
          name: 'Section 2',
          description: 'Monologue on a social topic',
          questions: 10,
          type: 'Note completion',
          playsCount: 1,
        },
        {
          id: 'section3',
          name: 'Section 3',
          description: 'Academic discussion, up to 4 speakers',
          questions: 10,
          type: 'Multiple choice',
          playsCount: 1,
        },
        {
          id: 'section4',
          name: 'Section 4',
          description: 'Academic lecture — most challenging',
          questions: 10,
          type: 'Sentence completion',
          playsCount: 1,
        },
      ],
      totalQuestions: 40,
      timeMinutes: 30,
      scoreRange: 'Band 1–9',
      note: 'Audio plays ONCE only',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'passage1',
          name: 'Passage 1',
          wordCount: '700–900',
          questions: 13,
          difficulty: 'Easy',
          types: ['True/False/NG', 'Matching headings'],
        },
        {
          id: 'passage2',
          name: 'Passage 2',
          wordCount: '800–1000',
          questions: 14,
          difficulty: 'Medium',
          types: ['MCQ', 'Summary completion'],
        },
        {
          id: 'passage3',
          name: 'Passage 3',
          wordCount: '900–1100',
          questions: 13,
          difficulty: 'Hard',
          types: ['Matching information', 'Short answer'],
        },
      ],
      totalQuestions: 40,
      timeMinutes: 60,
      scoreRange: 'Band 1–9',
    } satisfies ReadingFormat,
  },

  toefl: {
    writing: {
      tasks: [
        {
          id: 'integrated',
          name: 'Integrated Task',
          instruction: 'Read a passage, listen to a lecture, then write a response.',
          minWords: 150,
          maxWords: 225,
          timeMinutes: 20,
          tips: [
            'Summarize lecture points',
            'Relate to reading passage',
            'Do not give your opinion',
          ],
        },
        {
          id: 'academic',
          name: 'Academic Discussion',
          instruction: "Read a professor's question and two student responses, then add your contribution.",
          minWords: 100,
          timeMinutes: 10,
          tips: [
            'Add new ideas',
            'Build on student responses',
            'Be direct and clear',
          ],
        },
      ],
      scoringCriteria: [
        'Development',
        'Organization',
        'Language Use',
      ],
      scoreRange: '0–30',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'task1',
          name: 'Task 1',
          duration: '45–90 sec',
          description: 'Express and defend a personal opinion',
          prepTime: '15 sec',
          responseTime: '45 sec',
        },
        {
          id: 'task2',
          name: 'Task 2',
          duration: '60 sec',
          description: 'Read + Listen + Speak integrated (campus topic)',
          prepTime: '30 sec',
          responseTime: '60 sec',
        },
        {
          id: 'task3',
          name: 'Task 3',
          duration: '60 sec',
          description: 'Read campus announcement + Listen + Speak',
          prepTime: '30 sec',
          responseTime: '60 sec',
        },
        {
          id: 'task4',
          name: 'Task 4',
          duration: '60 sec',
          description: 'Listen to academic lecture + Speak about concept',
          prepTime: '20 sec',
          responseTime: '60 sec',
        },
      ],
      scoringCriteria: [
        'Delivery',
        'Language Use',
        'Topic Development',
      ],
      scoreRange: '0–30',
      totalTime: '~16 min',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'conv1',
          name: 'Conversation 1',
          description: 'Campus conversation, 2–3 min',
          questions: 5,
          type: 'Multiple choice',
          playsCount: 1,
          notesTaking: true,
        },
        {
          id: 'lect1',
          name: 'Lecture 1',
          description: 'Academic lecture, 3–5 min',
          questions: 6,
          type: 'Multiple choice + Drag',
          playsCount: 1,
          notesTaking: true,
        },
        {
          id: 'lect2',
          name: 'Lecture 2',
          description: 'Academic lecture, 3–5 min',
          questions: 6,
          type: 'Check all that apply',
          playsCount: 1,
          notesTaking: true,
        },
      ],
      totalQuestions: 28,
      timeMinutes: 41,
      scoreRange: '0–30',
      note: 'Note-taking is allowed',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'passage1',
          name: 'Passage 1',
          wordCount: '~700',
          questions: 10,
          difficulty: 'Medium',
          types: ['MCQ', 'Insert sentence', 'Prose summary'],
        },
        {
          id: 'passage2',
          name: 'Passage 2',
          wordCount: '~700',
          questions: 10,
          difficulty: 'Medium',
          types: ['Fill a table', 'MCQ'],
        },
      ],
      totalQuestions: 20,
      timeMinutes: 35,
      scoreRange: '0–30',
    } satisfies ReadingFormat,
  },

  delf: {
    writing: {
      tasks: [
        {
          id: 'production_ecrite',
          name: 'Production écrite',
          instruction: 'Rédigez une lettre formelle ou un article.',
          minWords: 250,
          timeMinutes: 60,
          language: 'fr',
          tips: [
            "Utilisez un registre formel",
            "Structurez votre texte",
            "Vérifiez l'orthographe",
          ],
        },
      ],
      scoringCriteria: [
        'Respect de la consigne',
        'Correction sociolinguistique',
        'Cohérence et cohésion',
        'Compétence lexicale',
        'Compétence grammaticale',
      ],
      scoreRange: '0–25 points',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'monologue',
          name: 'Monologue suivi',
          duration: '3–4 min',
          description: "Présentation d'un document déclencheur",
          prepTime: '30 min',
        },
        {
          id: 'discussion',
          name: 'Exercice en interaction',
          duration: '5–7 min',
          description: "Échange avec l'examinateur",
        },
      ],
      scoringCriteria: [
        'Capacité à interagir',
        'Compétence lexicale',
        'Compétence grammaticale',
        'Maîtrise phonologique',
      ],
      scoreRange: '0–25 points',
      totalTime: '20 min + 30 min prep',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'doc1',
          name: 'Document 1',
          description: 'Document audio — questions en français',
          questions: 12,
          type: 'MCQ + Vrai/Faux',
          playsCount: 2,
        },
        {
          id: 'doc2',
          name: 'Document 2',
          description: 'Document audio plus long',
          questions: 13,
          type: 'Réponse courte',
          playsCount: 2,
        },
      ],
      totalQuestions: 25,
      timeMinutes: 30,
      scoreRange: '0–25 points',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'doc1',
          name: 'Document 1',
          wordCount: '500–700',
          questions: 12,
          difficulty: 'Medium',
          types: ['MCQ', 'Vrai/Faux', 'Réponse courte'],
          language: 'fr',
        },
        {
          id: 'doc2',
          name: 'Document 2',
          wordCount: '600–800',
          questions: 13,
          difficulty: 'Medium',
          types: ['Texte à trous', 'Questions ouvertes'],
          language: 'fr',
        },
      ],
      totalQuestions: 25,
      timeMinutes: 60,
      scoreRange: '0–25 points',
    } satisfies ReadingFormat,
  },

  dalf: {
    writing: {
      tasks: [
        {
          id: 'synthese',
          name: 'Synthèse de documents',
          instruction: 'Rédigez une synthèse de plusieurs documents.',
          minWords: 220,
          timeMinutes: 60,
          language: 'fr',
          tips: [
            'Restez objectif',
            'Citez les sources',
            'Ne donnez pas votre avis',
          ],
        },
        {
          id: 'argumentatif',
          name: 'Texte argumentatif',
          instruction: 'Rédigez un texte qui défend une position.',
          minWords: 250,
          timeMinutes: 60,
          language: 'fr',
        },
      ],
      scoringCriteria: [
        'Capacité à synthétiser',
        'Cohérence et cohésion',
        'Compétence lexicale',
        'Compétence grammaticale',
      ],
      scoreRange: '0–25 points',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'expose',
          name: 'Exposé',
          duration: '~15 min',
          description: 'Présenter et défendre une position sur un document complexe.',
          prepTime: '30 min',
        },
        {
          id: 'debate',
          name: 'Débat',
          duration: '~10 min',
          description: "Discussion structurée avec l'examinateur.",
        },
      ],
      scoringCriteria: [
        'Maîtrise de la langue',
        'Capacité à argumenter',
        'Richesse lexicale',
        'Cohérence',
      ],
      scoreRange: '0–25 points',
      totalTime: '~25 min',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'doc1',
          name: 'Document 1',
          description: 'Long audio document on a complex topic',
          questions: 10,
          type: 'Short answer + Summary',
          playsCount: 2,
        },
        {
          id: 'doc2',
          name: 'Document 2',
          description: 'Long audio document requiring analysis',
          questions: 10,
          type: 'MCQ + Opinion analysis',
          playsCount: 2,
        },
      ],
      totalQuestions: 20,
      timeMinutes: 40,
      scoreRange: '0–25 points',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'doc1',
          name: 'Document 1',
          wordCount: '600–900',
          questions: 10,
          difficulty: 'Hard',
          types: ['Short answer', 'Summary completion'],
          language: 'fr',
        },
        {
          id: 'doc2',
          name: 'Document 2',
          wordCount: '600–900',
          questions: 10,
          difficulty: 'Hard',
          types: ['Opinion analysis', 'MCQ'],
          language: 'fr',
        },
      ],
      totalQuestions: 20,
      timeMinutes: 60,
      scoreRange: '0–25 points',
    } satisfies ReadingFormat,
  },

  dele: {
    writing: {
      tasks: [
        {
          id: 'tarea1',
          name: 'Tarea 1',
          instruction: 'Redacte un texto formal.',
          minWords: 150,
          maxWords: 180,
          timeMinutes: 40,
          language: 'es',
          tips: [
            'Use formal register',
            'Follow the task instructions closely',
            'Check grammar carefully',
          ],
        },
        {
          id: 'tarea2',
          name: 'Tarea 2',
          instruction: 'Redacte un texto de opinión.',
          minWords: 150,
          maxWords: 180,
          timeMinutes: 40,
          language: 'es',
        },
      ],
      scoringCriteria: [
        'Adecuación',
        'Coherencia',
        'Cohesión',
        'Corrección',
      ],
      scoreRange: '0–25 points',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'tarea1',
          name: 'Tarea 1',
          duration: '6–7 min',
          description: 'Valoración de documentos',
          prepTime: '6–7 min',
        },
        {
          id: 'tarea2',
          name: 'Tarea 2',
          duration: '5–6 min',
          description: 'Descripción de imagen y conversación',
        },
        {
          id: 'tarea3',
          name: 'Tarea 3',
          duration: '4–5 min',
          description: 'Conversación con el entrevistador',
        },
      ],
      scoringCriteria: [
        'Coherencia del discurso',
        'Corrección gramatical',
        'Riqueza léxica',
        'Pronunciación',
      ],
      scoreRange: '0–25 points',
      totalTime: '~15 min',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'tarea1',
          name: 'Tarea 1',
          description: 'Selección múltiple — conversaciones cortas',
          questions: 6,
          type: 'Selección múltiple',
          playsCount: 2,
        },
        {
          id: 'tarea2',
          name: 'Tarea 2',
          description: 'Asociar enunciados con hablantes',
          questions: 6,
          type: 'Emparejamiento',
          playsCount: 2,
        },
        {
          id: 'tarea3',
          name: 'Tarea 3',
          description: 'Selección múltiple — texto largo',
          questions: 6,
          type: 'Selección múltiple',
          playsCount: 2,
        },
        {
          id: 'tarea4',
          name: 'Tarea 4',
          description: 'Completar información — entrevista',
          questions: 6,
          type: 'Completar texto',
          playsCount: 2,
        },
        {
          id: 'tarea5',
          name: 'Tarea 5',
          description: 'Selección múltiple — monólogo extenso',
          questions: 6,
          type: 'Selección múltiple',
          playsCount: 2,
        },
      ],
      totalQuestions: 30,
      timeMinutes: 40,
      scoreRange: '0–30 points',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'tarea1',
          name: 'Tarea 1',
          questions: 8,
          difficulty: 'Medium',
          types: ['Selección múltiple'],
          language: 'es',
        },
        {
          id: 'tarea2',
          name: 'Tarea 2',
          questions: 8,
          difficulty: 'Medium',
          types: ['Emparejamiento'],
          language: 'es',
        },
        {
          id: 'tarea3',
          name: 'Tarea 3',
          questions: 8,
          difficulty: 'Medium',
          types: ['Selección múltiple'],
          language: 'es',
        },
        {
          id: 'tarea4',
          name: 'Tarea 4',
          questions: 8,
          difficulty: 'Hard',
          types: ['Completar texto'],
          language: 'es',
        },
        {
          id: 'tarea5',
          name: 'Tarea 5',
          questions: 8,
          difficulty: 'Hard',
          types: ['Selección múltiple'],
          language: 'es',
        },
      ],
      totalQuestions: 40,
      timeMinutes: 70,
      scoreRange: '0–40 points',
    } satisfies ReadingFormat,
  },

  hsk: {
    writing: {
      tasks: [
        {
          id: 'writing',
          name: '书写 — Writing',
          instruction: '写一篇短文 (Write a short essay)',
          minWords: 80,
          timeMinutes: 25,
          language: 'zh',
          tips: [
            'Use characters, not pinyin',
            'Stick to HSK 5 vocabulary',
            'Structure your answer clearly',
          ],
        },
      ],
      scoringCriteria: [
        'Content',
        'Vocabulary',
        'Grammar',
        'Characters',
      ],
      scoreRange: '0–100',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'repeat',
          name: '重复 — Repeat',
          duration: '~4 min',
          description: 'Listen and repeat sentences accurately.',
        },
        {
          id: 'read',
          name: '朗读 — Read aloud',
          duration: '~2 min',
          description: 'Read a short passage aloud clearly.',
        },
        {
          id: 'answer',
          name: '回答 — Answer',
          duration: '~4 min',
          description: 'Answer questions about a short passage.',
        },
      ],
      scoringCriteria: [
        'Pronunciation',
        'Tones',
        'Fluency',
        'Accuracy',
      ],
      scoreRange: '0–100',
      totalTime: '~17 min',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'part1',
          name: 'Part 1',
          description: 'Short dialogues — True/False',
          questions: 20,
          type: 'True/False',
          playsCount: 1,
          language: 'zh',
        },
        {
          id: 'part2',
          name: 'Part 2',
          description: 'Longer dialogues — multiple choice',
          questions: 25,
          type: 'Multiple choice',
          playsCount: 1,
          language: 'zh',
        },
      ],
      totalQuestions: 45,
      timeMinutes: 30,
      scoreRange: '0–100',
      note: 'Audio plays ONCE only',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'part1',
          name: '阅读 Part 1',
          questions: 15,
          difficulty: 'Easy',
          types: ['Select correct sentence'],
          language: 'zh',
        },
        {
          id: 'part2',
          name: '阅读 Part 2',
          questions: 15,
          difficulty: 'Medium',
          types: ['Fill in the blank'],
          language: 'zh',
        },
        {
          id: 'part3',
          name: '阅读 Part 3',
          questions: 20,
          difficulty: 'Hard',
          types: ['Multiple choice'],
          language: 'zh',
        },
      ],
      totalQuestions: 45,
      timeMinutes: 45,
      scoreRange: '0–100',
    } satisfies ReadingFormat,
  },

  jlpt: {
    writing: {
      tasks: [
        {
          id: 'grammar',
          name: '文法 — Grammar',
          instruction: 'Fill in blanks with correct grammatical forms.',
          timeMinutes: 30,
          language: 'ja',
          tips: [
            'Focus on N2 grammar patterns',
            'Eliminate obvious wrong answers first',
          ],
        },
      ],
      scoringCriteria: [
        'Grammar accuracy',
        'Vocabulary knowledge',
        'Reading comprehension',
      ],
      scoreRange: '0–60',
    } satisfies WritingFormat,

    speaking: {
      parts: [],
      note: 'JLPT N2 does not include a speaking test',
      scoreRange: 'N/A',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'mondai1',
          name: '問題1',
          description: 'Task-based comprehension',
          questions: 5,
          type: 'Multiple choice',
          playsCount: 1,
          language: 'ja',
        },
        {
          id: 'mondai2',
          name: '問題2',
          description: 'Point comprehension',
          questions: 6,
          type: 'Multiple choice',
          playsCount: 1,
          language: 'ja',
        },
        {
          id: 'mondai3',
          name: '問題3',
          description: 'Overview comprehension',
          questions: 5,
          type: 'Multiple choice',
          playsCount: 1,
          language: 'ja',
        },
        {
          id: 'mondai4',
          name: '問題4',
          description: 'Verbal expression',
          questions: 11,
          type: 'Verbal expression',
          playsCount: 1,
          language: 'ja',
        },
        {
          id: 'mondai5',
          name: '問題5',
          description: 'Quick response',
          questions: 8,
          type: 'Quick response',
          playsCount: 1,
          language: 'ja',
        },
      ],
      totalQuestions: 35,
      timeMinutes: 50,
      scoreRange: '0–60',
      note: 'No speaking test for JLPT',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'short',
          name: 'Short texts',
          questions: 10,
          difficulty: 'Medium',
          types: ['Comprehension MCQ'],
          language: 'ja',
        },
        {
          id: 'medium',
          name: 'Medium texts',
          questions: 9,
          difficulty: 'Medium',
          types: ['Comprehension MCQ'],
          language: 'ja',
        },
        {
          id: 'long',
          name: 'Long texts',
          questions: 4,
          difficulty: 'Hard',
          types: ['Comprehension MCQ'],
          language: 'ja',
        },
        {
          id: 'info',
          name: 'Information retrieval',
          questions: 4,
          difficulty: 'Medium',
          types: ['Information retrieval'],
          language: 'ja',
        },
      ],
      totalQuestions: 35,
      timeMinutes: 105,
      scoreRange: '0–60',
    } satisfies ReadingFormat,
  },

  topik: {
    writing: {
      tasks: [
        {
          id: 'task1',
          name: '쓰기 Task 1',
          instruction: '문장을 완성하세요 (Complete the sentences)',
          timeMinutes: 10,
          language: 'ko',
          tips: [
            'Use correct formal endings',
            'Match the provided context',
          ],
        },
        {
          id: 'task2',
          name: '쓰기 Task 2',
          instruction: '200–300자 설명문 쓰기 (Write a 200–300 character explanation)',
          minWords: 200,
          maxWords: 300,
          timeMinutes: 30,
          language: 'ko',
        },
        {
          id: 'task3',
          name: '쓰기 Task 3',
          instruction: '600–700자 논설문 쓰기 (Write a 600–700 character argumentative essay)',
          minWords: 600,
          maxWords: 700,
          timeMinutes: 50,
          language: 'ko',
          tips: [
            'State your position clearly',
            'Support with specific examples',
            'Use formal Korean style',
          ],
        },
      ],
      scoringCriteria: [
        'Content',
        'Organization',
        'Language use',
      ],
      scoreRange: '0–100',
    } satisfies WritingFormat,

    speaking: {
      parts: [
        {
          id: 'part1',
          name: '말하기 Part 1',
          duration: '~2 min',
          description: 'Read sentences aloud clearly and naturally.',
        },
        {
          id: 'part2',
          name: '말하기 Part 2',
          duration: '~3 min',
          description: 'Answer everyday questions about familiar topics.',
        },
        {
          id: 'part3',
          name: '말하기 Part 3',
          duration: '~4 min',
          description: 'Describe situations shown in pictures.',
        },
        {
          id: 'part4',
          name: '말하기 Part 4',
          duration: '~4 min',
          description: 'Give your opinion on a social topic.',
        },
      ],
      scoringCriteria: [
        'Content',
        'Fluency',
        'Accuracy',
        'Pronunciation',
      ],
      scoreRange: '0–100',
      totalTime: '~30 min',
    } satisfies SpeakingFormat,

    listening: {
      sections: [
        {
          id: 'part1',
          name: 'Part 1',
          description: 'Short dialogues — multiple choice',
          questions: 20,
          type: 'Multiple choice',
          playsCount: 1,
          language: 'ko',
        },
        {
          id: 'part2',
          name: 'Part 2',
          description: 'Longer monologues and dialogues',
          questions: 30,
          type: 'Multiple choice',
          playsCount: 1,
          language: 'ko',
        },
      ],
      totalQuestions: 50,
      timeMinutes: 60,
      scoreRange: '0–100',
      note: 'Audio plays ONCE only',
    } satisfies ListeningFormat,

    reading: {
      passages: [
        {
          id: 'part1',
          name: 'Part 1',
          questions: 15,
          difficulty: 'Easy',
          types: ['Fill blank', 'MCQ'],
          language: 'ko',
        },
        {
          id: 'part2',
          name: 'Part 2',
          questions: 15,
          difficulty: 'Medium',
          types: ['Ordering', 'Comprehension MCQ'],
          language: 'ko',
        },
        {
          id: 'part3',
          name: 'Part 3',
          questions: 20,
          difficulty: 'Hard',
          types: ['Comprehension MCQ', 'Long passage'],
          language: 'ko',
        },
      ],
      totalQuestions: 50,
      timeMinutes: 70,
      scoreRange: '0–100',
    } satisfies ReadingFormat,
  },

  celpe: {
    listening: {
      sections: [
        { id: 'part1', name: 'Part 1', description: 'Oral interaction task', questions: 10, type: 'Multiple choice', playsCount: 2 },
        { id: 'part2', name: 'Part 2', description: 'Extended listening', questions: 15, type: 'Short answer', playsCount: 2 },
      ],
      totalQuestions: 25, timeMinutes: 35, scoreRange: 'Pass/Fail',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Text 1', wordCount: '400–600', questions: 10, difficulty: 'Medium', types: ['MCQ', 'Short answer'] },
        { id: 'p2', name: 'Text 2', wordCount: '500–700', questions: 15, difficulty: 'Hard',   types: ['MCQ', 'Gap fill'] },
      ],
      totalQuestions: 25, timeMinutes: 60, scoreRange: 'Pass/Fail',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Writing Task', instruction: 'Write a formal text in Portuguese', minWords: 200, timeMinutes: 60, language: 'pt' },
      ],
      scoringCriteria: ['Content', 'Organization', 'Language Use'],
      scoreRange: 'Pass/Fail',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Oral Task', duration: '8–10 min', description: 'Interactive speaking task' }],
      scoreRange: 'Pass/Fail', totalTime: '8–10 min',
    } satisfies SpeakingFormat,
  },

  caple: {
    listening: {
      sections: [
        { id: 'part1', name: 'Part 1', description: 'Short dialogues', questions: 10, type: 'MCQ', playsCount: 2 },
      ],
      totalQuestions: 10, timeMinutes: 25, scoreRange: 'A–F',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'Text 1', questions: 10, difficulty: 'Medium', types: ['MCQ'] }],
      totalQuestions: 10, timeMinutes: 40, scoreRange: 'A–F',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Writing', instruction: 'Write a formal letter or essay in Portuguese', minWords: 150, timeMinutes: 45, language: 'pt' },
      ],
      scoreRange: 'A–F',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Oral Exam', duration: '10–15 min', description: 'Conversation with examiner' }],
      scoreRange: 'A–F',
    } satisfies SpeakingFormat,
  },

  torfl: {
    listening: {
      sections: [
        { id: 'part1', name: 'Part 1', description: 'Short texts comprehension', questions: 15, type: 'MCQ', playsCount: 1 },
        { id: 'part2', name: 'Part 2', description: 'Long text comprehension',   questions: 10, type: 'MCQ', playsCount: 1 },
      ],
      totalQuestions: 25, timeMinutes: 30, scoreRange: 'Pass/Fail',
      note: 'Audio plays ONCE only',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Text 1', questions: 15, difficulty: 'Medium', types: ['MCQ', 'True/False'], language: 'ru' },
        { id: 'p2', name: 'Text 2', questions: 15, difficulty: 'Hard',   types: ['MCQ'],               language: 'ru' },
      ],
      totalQuestions: 30, timeMinutes: 50, scoreRange: 'Pass/Fail',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Essay', instruction: 'Напишите эссе на заданную тему', minWords: 200, timeMinutes: 60, language: 'ru' },
      ],
      scoreRange: 'Pass/Fail',
    } satisfies WritingFormat,
    speaking: {
      parts: [
        { id: 'part1', name: 'Part 1', duration: '5 min',  description: 'Questions about familiar topics' },
        { id: 'part2', name: 'Part 2', duration: '10 min', description: 'Discussion of a topic' },
      ],
      scoreRange: 'Pass/Fail',
    } satisfies SpeakingFormat,
  },

  goethe: {
    listening: {
      sections: [
        { id: 'part1', name: 'Teil 1', description: 'Short conversations', questions: 10, type: 'MCQ',        playsCount: 1, language: 'de' },
        { id: 'part2', name: 'Teil 2', description: 'Radio interview',     questions: 10, type: 'True/False', playsCount: 1, language: 'de' },
        { id: 'part3', name: 'Teil 3', description: 'Discussion',          questions: 10, type: 'MCQ',        playsCount: 1, language: 'de' },
      ],
      totalQuestions: 30, timeMinutes: 40, scoreRange: '0–100',
      note: 'Audio plays ONCE only',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Teil 1', questions: 10, difficulty: 'Medium', types: ['MCQ'],     language: 'de' },
        { id: 'p2', name: 'Teil 2', questions: 10, difficulty: 'Medium', types: ['Matching'],language: 'de' },
        { id: 'p3', name: 'Teil 3', questions: 10, difficulty: 'Hard',   types: ['Gap fill'],language: 'de' },
      ],
      totalQuestions: 30, timeMinutes: 65, scoreRange: '0–100',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Teil 1', instruction: 'Schreiben Sie einen formellen Brief', minWords: 150, timeMinutes: 30, language: 'de' },
        { id: 'task2', name: 'Teil 2', instruction: 'Schreiben Sie einen Aufsatz',         minWords: 200, timeMinutes: 30, language: 'de' },
      ],
      scoreRange: '0–100',
    } satisfies WritingFormat,
    speaking: {
      parts: [
        { id: 'part1', name: 'Teil 1', duration: '2–3 min', description: 'Präsentation eines Themas' },
        { id: 'part2', name: 'Teil 2', duration: '5–8 min', description: 'Diskussion mit Partner' },
      ],
      scoreRange: '0–100',
    } satisfies SpeakingFormat,
  },

  testdaf: {
    listening: {
      sections: [
        { id: 'part1', name: 'Teil 1', description: 'Short announcements', questions: 10, type: 'True/False',  playsCount: 1, language: 'de' },
        { id: 'part2', name: 'Teil 2', description: 'Radio interview',     questions: 10, type: 'MCQ',         playsCount: 1, language: 'de' },
        { id: 'part3', name: 'Teil 3', description: 'Academic lecture',    questions: 10, type: 'Note taking',  playsCount: 1, language: 'de' },
      ],
      totalQuestions: 30, timeMinutes: 40, scoreRange: 'TDN 3–5',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Teil 1', questions: 10, difficulty: 'Medium', types: ['MCQ'],     language: 'de' },
        { id: 'p2', name: 'Teil 2', questions: 10, difficulty: 'Hard',   types: ['Matching'],language: 'de' },
        { id: 'p3', name: 'Teil 3', questions: 10, difficulty: 'Hard',   types: ['Gap fill'],language: 'de' },
      ],
      totalQuestions: 30, timeMinutes: 60, scoreRange: 'TDN 3–5',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Writing', instruction: 'Schreiben Sie eine Stellungnahme', minWords: 250, timeMinutes: 60, language: 'de' },
      ],
      scoreRange: 'TDN 3–5',
    } satisfies WritingFormat,
    speaking: {
      parts: [
        { id: 'part1', name: 'Teil 1', duration: '3 min', description: 'Short presentation' },
        { id: 'part2', name: 'Teil 2', duration: '4 min', description: 'Discuss graph' },
        { id: 'part3', name: 'Teil 3', duration: '5 min', description: 'Discuss controversial topic' },
      ],
      scoreRange: 'TDN 3–5',
    } satisfies SpeakingFormat,
  },

  cils: {
    listening: {
      sections: [
        { id: 'part1', name: 'Parte 1', description: 'Short dialogues', questions: 10, type: 'MCQ',        playsCount: 2, language: 'it' },
        { id: 'part2', name: 'Parte 2', description: 'Long monologue',  questions: 10, type: 'True/False', playsCount: 2, language: 'it' },
      ],
      totalQuestions: 20, timeMinutes: 30, scoreRange: '0–30',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Testo 1', questions: 10, difficulty: 'Medium', types: ['MCQ'],     language: 'it' },
        { id: 'p2', name: 'Testo 2', questions: 10, difficulty: 'Hard',   types: ['Gap fill'],language: 'it' },
      ],
      totalQuestions: 20, timeMinutes: 50, scoreRange: '0–30',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Produzione scritta', instruction: 'Scrivi un testo formale in italiano', minWords: 200, timeMinutes: 60, language: 'it' },
      ],
      scoreRange: '0–30',
    } satisfies WritingFormat,
    speaking: {
      parts: [
        { id: 'part1', name: 'Parte 1', duration: '5 min',  description: 'Presentazione di sé' },
        { id: 'part2', name: 'Parte 2', duration: '10 min', description: 'Discussione su un tema' },
      ],
      scoreRange: '0–30',
    } satisfies SpeakingFormat,
  },

  celi: {
    listening: {
      sections: [
        { id: 'part1', name: 'Part 1', description: 'Short texts', questions: 10, type: 'MCQ', playsCount: 2, language: 'it' },
      ],
      totalQuestions: 10, timeMinutes: 20, scoreRange: 'Pass/Fail',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'Text 1', questions: 12, difficulty: 'Medium', types: ['MCQ', 'Gap fill'], language: 'it' }],
      totalQuestions: 12, timeMinutes: 40, scoreRange: 'Pass/Fail',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'Writing', instruction: 'Scrivi un testo in italiano', minWords: 150, timeMinutes: 45, language: 'it' }],
      scoreRange: 'Pass/Fail',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Oral', duration: '10 min', description: 'Conversation in Italian' }],
      scoreRange: 'Pass/Fail',
    } satisfies SpeakingFormat,
  },

  siele: {
    listening: {
      sections: [
        { id: 'part1', name: 'Tarea 1', description: 'Conversaciones cortas', questions: 15, type: 'MCQ', playsCount: 1, language: 'es' },
        { id: 'part2', name: 'Tarea 2', description: 'Texto largo',           questions: 15, type: 'MCQ', playsCount: 1, language: 'es' },
      ],
      totalQuestions: 30, timeMinutes: 40, scoreRange: '0–250',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Texto 1', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'es' },
        { id: 'p2', name: 'Texto 2', questions: 15, difficulty: 'Hard',   types: ['MCQ'], language: 'es' },
      ],
      totalQuestions: 30, timeMinutes: 50, scoreRange: '0–250',
    } satisfies ReadingFormat,
    writing: {
      tasks: [
        { id: 'task1', name: 'Tarea 1', instruction: 'Escribe un texto formal en español',  minWords: 150, timeMinutes: 40, language: 'es' },
        { id: 'task2', name: 'Tarea 2', instruction: 'Escribe un ensayo de opinión',         minWords: 200, timeMinutes: 40, language: 'es' },
      ],
      scoreRange: '0–250',
    } satisfies WritingFormat,
    speaking: {
      parts: [
        { id: 'part1', name: 'Tarea 1', duration: '5 min', description: 'Descripción de imagen' },
        { id: 'part2', name: 'Tarea 2', duration: '5 min', description: 'Conversación con evaluador' },
      ],
      scoreRange: '0–250',
    } satisfies SpeakingFormat,
  },

  hskk: {
    speaking: {
      parts: [
        { id: 'part1', name: '重复句子', duration: '3 min', description: 'Repeat sentences',   language: 'zh' },
        { id: 'part2', name: '朗读句子', duration: '4 min', description: 'Read sentences aloud',language: 'zh' },
        { id: 'part3', name: '回答问题', duration: '5 min', description: 'Answer questions',    language: 'zh' },
      ],
      scoreRange: '0–100', totalTime: '17 min',
    } satisfies SpeakingFormat,
  } as any,

  jft: {
    listening: {
      sections: [{ id: 'part1', name: '課題1', description: 'Task based comprehension', questions: 10, type: 'MCQ', playsCount: 1, language: 'ja' }],
      totalQuestions: 10, timeMinutes: 20, scoreRange: 'A1–A2',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: '課題1', questions: 10, difficulty: 'Easy', types: ['MCQ'], language: 'ja' }],
      totalQuestions: 10, timeMinutes: 20, scoreRange: 'A1–A2',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: '作文', instruction: '簡単な文を書いてください', minWords: 50, timeMinutes: 20, language: 'ja' }],
      scoreRange: 'A1–A2',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: '話す', duration: '5 min', description: 'Simple Japanese conversation', language: 'ja' }],
      scoreRange: 'A1–A2',
    } satisfies SpeakingFormat,
  },

  tys: {
    listening: {
      sections: [
        { id: 'part1', name: 'Bölüm 1', description: 'Short conversations', questions: 15, type: 'MCQ', playsCount: 1, language: 'tr' },
        { id: 'part2', name: 'Bölüm 2', description: 'Longer monologue',    questions: 15, type: 'MCQ', playsCount: 1, language: 'tr' },
      ],
      totalQuestions: 30, timeMinutes: 35, scoreRange: '0–100',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Metin 1', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'tr' },
        { id: 'p2', name: 'Metin 2', questions: 15, difficulty: 'Hard',   types: ['MCQ'], language: 'tr' },
      ],
      totalQuestions: 30, timeMinutes: 45, scoreRange: '0–100',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'Yazma', instruction: 'Türkçe olarak bir metin yazın', minWords: 200, timeMinutes: 50, language: 'tr' }],
      scoreRange: '0–100',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Sözlü', duration: '10 min', description: 'Türkçe konuşma' }],
      scoreRange: '0–100',
    } satisfies SpeakingFormat,
  },

  cnavt: {
    listening: {
      sections: [
        { id: 'part1', name: 'Deel 1', description: 'Short conversations', questions: 10, type: 'MCQ',        playsCount: 2, language: 'nl' },
        { id: 'part2', name: 'Deel 2', description: 'Long monologue',      questions: 10, type: 'True/False', playsCount: 2, language: 'nl' },
      ],
      totalQuestions: 20, timeMinutes: 30, scoreRange: 'Pass/Fail',
      note: 'Audio plays TWICE in this exam',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'Tekst 1', questions: 10, difficulty: 'Medium', types: ['MCQ'],     language: 'nl' },
        { id: 'p2', name: 'Tekst 2', questions: 10, difficulty: 'Hard',   types: ['Gap fill'],language: 'nl' },
      ],
      totalQuestions: 20, timeMinutes: 45, scoreRange: 'Pass/Fail',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'Schrijven', instruction: 'Schrijf een formele tekst in het Nederlands', minWords: 200, timeMinutes: 50, language: 'nl' }],
      scoreRange: 'Pass/Fail',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Spreken', duration: '10 min', description: 'Gesprek in het Nederlands' }],
      scoreRange: 'Pass/Fail',
    } satisfies SpeakingFormat,
  },

  nt2: {
    listening: {
      sections: [{ id: 'part1', name: 'Deel 1', description: 'Conversations', questions: 15, type: 'MCQ', playsCount: 1, language: 'nl' }],
      totalQuestions: 15, timeMinutes: 25, scoreRange: 'Pass/Fail',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'Tekst 1', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'nl' }],
      totalQuestions: 15, timeMinutes: 40, scoreRange: 'Pass/Fail',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'Schrijven', instruction: 'Schrijf een tekst in het Nederlands', minWords: 150, timeMinutes: 45, language: 'nl' }],
      scoreRange: 'Pass/Fail',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Mondeling', duration: '10 min', description: 'Nederlands spreken' }],
      scoreRange: 'Pass/Fail',
    } satisfies SpeakingFormat,
  },

  alpt: {
    listening: {
      sections: [
        { id: 'part1', name: 'القسم 1', description: 'محادثات قصيرة', questions: 15, type: 'MCQ', playsCount: 1, language: 'ar' },
        { id: 'part2', name: 'القسم 2', description: 'نص طويل',        questions: 15, type: 'MCQ', playsCount: 1, language: 'ar' },
      ],
      totalQuestions: 30, timeMinutes: 35, scoreRange: '0–100',
    } satisfies ListeningFormat,
    reading: {
      passages: [
        { id: 'p1', name: 'النص 1', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'ar' },
        { id: 'p2', name: 'النص 2', questions: 15, difficulty: 'Hard',   types: ['MCQ'], language: 'ar' },
      ],
      totalQuestions: 30, timeMinutes: 50, scoreRange: '0–100',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'الكتابة', instruction: 'اكتب نصاً رسمياً باللغة العربية', minWords: 200, timeMinutes: 50, language: 'ar' }],
      scoreRange: '0–100',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'المحادثة', duration: '10 min', description: 'محادثة باللغة العربية' }],
      scoreRange: '0–100',
    } satisfies SpeakingFormat,
  },

  actfl: {
    listening: {
      sections: [{ id: 'part1', name: 'Part 1', description: 'Short recordings', questions: 15, type: 'MCQ', playsCount: 1 }],
      totalQuestions: 15, timeMinutes: 30, scoreRange: 'Novice–Distinguished',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'Text 1', questions: 15, difficulty: 'Medium', types: ['MCQ'] }],
      totalQuestions: 15, timeMinutes: 35, scoreRange: 'Novice–Distinguished',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'Writing', instruction: 'Write a formal text', minWords: 150, timeMinutes: 40 }],
      scoreRange: 'Novice–Distinguished',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'OPI', duration: '20–30 min', description: 'Oral Proficiency Interview' }],
      scoreRange: 'Novice–Distinguished',
    } satisfies SpeakingFormat,
  },

  praveen: {
    listening: {
      sections: [{ id: 'part1', name: 'भाग 1', description: 'छोटी बातचीत', questions: 15, type: 'MCQ', playsCount: 1, language: 'hi' }],
      totalQuestions: 15, timeMinutes: 25, scoreRange: '0–100',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'पाठ 1', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'hi' }],
      totalQuestions: 15, timeMinutes: 35, scoreRange: '0–100',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'लेखन', instruction: 'हिंदी में एक औपचारिक पत्र लिखें', minWords: 150, timeMinutes: 40, language: 'hi' }],
      scoreRange: '0–100',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'बोलना', duration: '10 min', description: 'हिंदी में बातचीत' }],
      scoreRange: '0–100',
    } satisfies SpeakingFormat,
  },

  hindi_cefr: {
    listening: {
      sections: [{ id: 'part1', name: 'Part 1', description: 'Short Hindi texts', questions: 15, type: 'MCQ', playsCount: 1, language: 'hi' }],
      totalQuestions: 15, timeMinutes: 25, scoreRange: 'B2',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'Text 1', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'hi' }],
      totalQuestions: 15, timeMinutes: 35, scoreRange: 'B2',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'Writing', instruction: 'हिंदी में लिखें', minWords: 150, timeMinutes: 40, language: 'hi' }],
      scoreRange: 'B2',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'Speaking', duration: '10 min', description: 'Hindi conversation' }],
      scoreRange: 'B2',
    } satisfies SpeakingFormat,
  },

  persian_cefr: {
    listening: {
      sections: [{ id: 'part1', name: 'بخش ۱', description: 'مکالمات کوتاه', questions: 15, type: 'MCQ', playsCount: 1, language: 'fa' }],
      totalQuestions: 15, timeMinutes: 25, scoreRange: 'B2',
    } satisfies ListeningFormat,
    reading: {
      passages: [{ id: 'p1', name: 'متن ۱', questions: 15, difficulty: 'Medium', types: ['MCQ'], language: 'fa' }],
      totalQuestions: 15, timeMinutes: 35, scoreRange: 'B2',
    } satisfies ReadingFormat,
    writing: {
      tasks: [{ id: 'task1', name: 'نوشتار', instruction: 'یک متن رسمی به فارسی بنویسید', minWords: 150, timeMinutes: 40, language: 'fa' }],
      scoreRange: 'B2',
    } satisfies WritingFormat,
    speaking: {
      parts: [{ id: 'part1', name: 'گفتار', duration: '10 min', description: 'مکالمه به فارسی' }],
      scoreRange: 'B2',
    } satisfies SpeakingFormat,
  },

} // end EXAM_FORMATS

// ── Accessor with overloads for type safety ──────────────────────

export function getExamFormat(examId: string, module: 'listening'): ListeningFormat | null
export function getExamFormat(examId: string, module: 'reading'): ReadingFormat | null
export function getExamFormat(examId: string, module: 'writing'): WritingFormat | null
export function getExamFormat(examId: string, module: 'speaking'): SpeakingFormat | null
export function getExamFormat(examId: string, module: string): ListeningFormat | ReadingFormat | WritingFormat | SpeakingFormat | null {
  const exam = (EXAM_FORMATS as Record<string, any>)[examId]
  if (!exam) return null
  return exam[module] ?? null
}
