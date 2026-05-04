// ── Types ─────────────────────────────────────────────────────────

export type RawQuestion = {
  id: number;
  type: 'form_completion' | 'multiple_choice' | 'true_false' | 'short_answer';
  // form_completion
  label?: string;
  prefix?: string;
  suffix?: string;
  // mcq / true_false / short_answer
  question?: string;
  options?: string[];
  answer: string;
  rtl?: boolean;
};

export type SectionContent = {
  title: string;
  instruction: string;
  audioDescription: string;
  playsCount?: number;
  rtl?: boolean;
  questions: RawQuestion[];
};

export type WritingTaskContent = {
  title: string;
  instruction: string;
  minWords: number;
  maxWords?: number;
  timeMinutes: number;
  showChart?: boolean;
  language?: string;
  note?: string;
  rtl?: boolean;
};

export type ExamListening = Record<string, SectionContent>;
export type ExamWriting   = Record<string, WritingTaskContent>;

// ── Data ─────────────────────────────────────────────────────────

export const EXAM_CONTENT: Record<string, { listening?: ExamListening; writing?: ExamWriting }> = {

  ielts: {
    listening: {
      section1: {
        title: 'Section 1 — Social Conversation',
        instruction: 'Questions 1–10. Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
        audioDescription: 'Two people discussing a restaurant booking',
        playsCount: 1,
        questions: [
          { id: 1,  type: 'form_completion', label: 'Restaurant name:',    answer: 'The Golden Fork'  },
          { id: 2,  type: 'form_completion', label: 'Booking date:',       answer: 'March 15'         },
          { id: 3,  type: 'form_completion', label: 'Number of guests:',   answer: '8'                },
          { id: 4,  type: 'form_completion', label: 'Special requirement:',answer: 'vegetarian menu'  },
          { id: 5,  type: 'form_completion', label: 'Contact number:',     prefix: '07', answer: '07891234567' },
          { id: 6,  type: 'multiple_choice', question: 'What time does the restaurant open for dinner?',
            options: ['A) 6 pm', 'B) 7 pm', 'C) 8 pm'], answer: 'A' },
          { id: 7,  type: 'multiple_choice', question: 'What is included in the set menu?',
            options: ['A) 2 courses', 'B) 3 courses', 'C) 4 courses'], answer: 'B' },
          { id: 8,  type: 'multiple_choice', question: 'How much is the deposit per person?',
            options: ['A) £10', 'B) £15', 'C) £20'], answer: 'C' },
          { id: 9,  type: 'form_completion', label: 'Parking available:',      answer: 'yes'  },
          { id: 10, type: 'form_completion', label: 'Nearest tube station:',   answer: 'Bank' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Writing Task 1',
        instruction: 'The chart below shows internet access by country between 2000 and 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
        minWords: 150, timeMinutes: 20, showChart: true,
      },
      task2: {
        title: 'Writing Task 2',
        instruction: 'Some people think the best way to improve public health is to increase sports facilities. Others think this would have little effect and other measures are required. Discuss both views and give your own opinion.',
        minWords: 250, timeMinutes: 40,
      },
    },
  },

  goethe: {
    listening: {
      section1: {
        title: 'Teil 1 — Kurze Gespräche',
        instruction: 'Fragen 1–5. Sie hören kurze Gespräche. Kreuzen Sie die richtige Antwort an.',
        audioDescription: 'Zwei Personen sprechen über einen Restaurantbesuch',
        playsCount: 1,
        questions: [
          { id: 1, type: 'multiple_choice', question: 'Wann öffnet das Restaurant?',
            options: ['A) Um 18 Uhr', 'B) Um 19 Uhr', 'C) Um 20 Uhr'], answer: 'A' },
          { id: 2, type: 'multiple_choice', question: 'Was kostet das Menü pro Person?',
            options: ['A) 25 Euro', 'B) 30 Euro', 'C) 35 Euro'], answer: 'B' },
          { id: 3, type: 'true_false', question: 'Das Restaurant hat einen Parkplatz.',
            options: ['Richtig', 'Falsch'], answer: 'Richtig' },
          { id: 4, type: 'true_false', question: 'Man kann online reservieren.',
            options: ['Richtig', 'Falsch'], answer: 'Richtig' },
          { id: 5, type: 'multiple_choice', question: 'Wie viele Personen kommen zum Essen?',
            options: ['A) 4 Personen', 'B) 6 Personen', 'C) 8 Personen'], answer: 'C' },
        ],
      },
      section2: {
        title: 'Teil 2 — Radio Interview',
        instruction: 'Fragen 6–10. Sie hören ein Radiointerview. Sind die Aussagen richtig oder falsch?',
        audioDescription: 'Interview mit einem deutschen Wissenschaftler',
        playsCount: 1,
        questions: [
          { id: 6, type: 'true_false', question: 'Der Wissenschaftler arbeitet seit zehn Jahren an diesem Projekt.',
            options: ['Richtig', 'Falsch'], answer: 'Falsch' },
          { id: 7, type: 'true_false', question: 'Die Forschung wird von der Regierung finanziert.',
            options: ['Richtig', 'Falsch'], answer: 'Richtig' },
          { id: 8, type: 'multiple_choice', question: 'Was ist das Hauptziel der Forschung?',
            options: ['A) Neue Energiequellen finden', 'B) Die Umwelt schützen', 'C) Kosten reduzieren'], answer: 'B' },
          { id: 9, type: 'multiple_choice', question: 'Wann sollen die Ergebnisse veröffentlicht werden?',
            options: ['A) Nächstes Jahr', 'B) In zwei Jahren', 'C) In fünf Jahren'], answer: 'A' },
          { id: 10, type: 'true_false', question: 'Andere Länder nehmen an dem Projekt teil.',
            options: ['Richtig', 'Falsch'], answer: 'Richtig' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Schreiben — Teil 1',
        instruction: 'Sie haben einen Brief von Ihrem deutschen Freund bekommen. Er fragt Sie nach Ihrer Meinung zu den sozialen Medien. Schreiben Sie ihm einen formellen Brief und antworten Sie auf seine Fragen.',
        minWords: 150, timeMinutes: 30, language: 'de',
      },
      task2: {
        title: 'Schreiben — Teil 2',
        instruction: 'Schreiben Sie einen Aufsatz zum folgenden Thema: „Soziale Medien haben mehr Nachteile als Vorteile für die Gesellschaft." Gehen Sie auf verschiedene Aspekte ein und begründen Sie Ihre Meinung.',
        minWords: 200, timeMinutes: 30, language: 'de',
      },
    },
  },

  testdaf: {
    listening: {
      section1: {
        title: 'Teil 1 — Kurze Ankündigungen',
        instruction: 'Hören Sie die folgenden kurzen Texte. Kreuzen Sie an, ob die Aussagen richtig oder falsch sind.',
        audioDescription: 'Kurze Ansagen und Mitteilungen',
        playsCount: 1,
        questions: [
          { id: 1, type: 'true_false', question: 'Die Bibliothek ist samstags geschlossen.',
            options: ['Richtig', 'Falsch'], answer: 'Falsch' },
          { id: 2, type: 'true_false', question: 'Das Konzert beginnt um 20 Uhr.',
            options: ['Richtig', 'Falsch'], answer: 'Richtig' },
          { id: 3, type: 'multiple_choice', question: 'Was ist der Hauptzweck der Veranstaltung?',
            options: ['A) Informationen verbreiten', 'B) Spenden sammeln', 'C) Studenten rekrutieren'], answer: 'A' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Schreiben — Stellungnahme',
        instruction: 'Schreiben Sie eine Stellungnahme zu folgendem Thema: „Sollte der öffentliche Nahverkehr in Städten kostenlos sein?" Gehen Sie auf Vor- und Nachteile ein und begründen Sie Ihre Meinung.',
        minWords: 250, timeMinutes: 60, language: 'de',
        note: 'Verwenden Sie einen formellen Stil. Mindestens 250 Wörter.',
      },
    },
  },

  delf: {
    listening: {
      section1: {
        title: 'Compréhension de l\'oral — Document 1',
        instruction: 'Vous allez entendre un document sonore. Répondez aux questions en cochant la bonne réponse. L\'enregistrement sera joué deux fois.',
        audioDescription: 'Une émission de radio sur l\'environnement',
        playsCount: 2,
        questions: [
          { id: 1, type: 'multiple_choice', question: 'De quoi parle principalement cette émission ?',
            options: ['A) Des énergies renouvelables', 'B) Du changement climatique', 'C) De la pollution urbaine'], answer: 'B' },
          { id: 2, type: 'multiple_choice', question: 'Selon l\'expert, quelle est la principale cause du problème ?',
            options: ['A) L\'industrie automobile', 'B) L\'agriculture intensive', 'C) La production d\'énergie'], answer: 'C' },
          { id: 3, type: 'true_false', question: 'Les gouvernements européens ont pris des mesures efficaces.',
            options: ['Vrai', 'Faux'], answer: 'Faux' },
          { id: 4, type: 'true_false', question: 'Les citoyens peuvent contribuer à résoudre ce problème.',
            options: ['Vrai', 'Faux'], answer: 'Vrai' },
          { id: 5, type: 'short_answer', question: 'Quelle solution l\'expert propose-t-il en priorité ?',
            answer: 'Réduire la consommation d\'énergie' },
          { id: 6, type: 'short_answer', question: 'Dans combien d\'années les effets seront-ils visibles ?',
            answer: 'Dans vingt ans' },
        ],
      },
      section2: {
        title: 'Compréhension de l\'oral — Document 2',
        instruction: 'Vous allez entendre un débat. Répondez aux questions. L\'enregistrement sera joué deux fois.',
        audioDescription: 'Un débat entre deux experts sur l\'éducation',
        playsCount: 2,
        questions: [
          { id: 7, type: 'multiple_choice', question: 'Quel est le sujet principal du débat ?',
            options: ['A) L\'éducation numérique', 'B) Les méthodes d\'enseignement', 'C) Le financement des écoles'], answer: 'A' },
          { id: 8, type: 'multiple_choice', question: 'Que pense la première experte des tablettes en classe ?',
            options: ['A) Elles sont indispensables', 'B) Elles sont inutiles', 'C) Elles peuvent être utiles si bien utilisées'], answer: 'C' },
          { id: 9, type: 'true_false', question: 'Le deuxième expert est totalement contre le numérique.',
            options: ['Vrai', 'Faux'], answer: 'Faux' },
          { id: 10, type: 'short_answer', question: 'Quelle compétence les deux experts jugent-ils essentielle ?',
            answer: 'L\'esprit critique' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Production écrite',
        instruction: 'Un magazine francophone lance un appel à contributions sur le thème des réseaux sociaux chez les jeunes. Rédigez un article dans lequel vous analysez les avantages et les inconvénients des réseaux sociaux pour les jeunes d\'aujourd\'hui. Donnez votre point de vue et illustrez-le d\'exemples.',
        minWords: 250, timeMinutes: 60, language: 'fr',
        note: 'Utilisez un registre formel. Minimum 250 mots.',
      },
    },
  },

  dalf: {
    writing: {
      task1: {
        title: 'Synthèse de documents',
        instruction: 'À partir des documents proposés, rédigez une synthèse objective. Vous ne devez pas donner votre avis personnel.',
        minWords: 220, timeMinutes: 60, language: 'fr',
        note: 'Synthèse OBJECTIVE — pas d\'opinion personnelle',
      },
      task2: {
        title: 'Prise de position',
        instruction: 'En vous appuyant sur les documents et vos connaissances personnelles, défendez un point de vue argumenté sur la question : « La mondialisation culturelle représente-t-elle une chance ou une menace pour les cultures locales ? »',
        minWords: 250, timeMinutes: 60, language: 'fr',
      },
    },
  },

  dele: {
    listening: {
      section1: {
        title: 'Comprensión auditiva — Tarea 1',
        instruction: 'Usted va a escuchar cinco conversaciones. Escuche y elija la opción correcta.',
        audioDescription: 'Cinco conversaciones cortas cotidianas',
        playsCount: 2,
        questions: [
          { id: 1, type: 'multiple_choice', question: '¿De qué hablan principalmente?',
            options: ['A) De trabajo', 'B) De vacaciones', 'C) De familia'], answer: 'B' },
          { id: 2, type: 'multiple_choice', question: '¿Cuándo van a reunirse?',
            options: ['A) El lunes', 'B) El miércoles', 'C) El viernes'], answer: 'C' },
          { id: 3, type: 'multiple_choice', question: '¿Qué problema tiene la señora?',
            options: ['A) Está enferma', 'B) Ha perdido sus llaves', 'C) Llega tarde al trabajo'], answer: 'B' },
          { id: 4, type: 'multiple_choice', question: '¿Qué decide hacer al final?',
            options: ['A) Llamar a un cerrajero', 'B) Ir a casa de un amigo', 'C) Esperar a su marido'], answer: 'A' },
          { id: 5, type: 'multiple_choice', question: '¿Cuánto cuesta el servicio?',
            options: ['A) 50 euros', 'B) 75 euros', 'C) 100 euros'], answer: 'B' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Expresión e interacción escritas — Tarea 1',
        instruction: 'Usted trabaja en una empresa internacional. Su jefe le pide que escriba un informe sobre las ventajas e inconvenientes del teletrabajo para los empleados. Redacte el informe con un mínimo de 150 palabras.',
        minWords: 150, timeMinutes: 40, language: 'es',
        note: 'Use un registro formal. Mínimo 150 palabras.',
      },
      task2: {
        title: 'Expresión e interacción escritas — Tarea 2',
        instruction: 'Lea el siguiente artículo y escriba un texto argumentativo expresando su opinión sobre el tema planteado. Mínimo 150 palabras.',
        minWords: 150, timeMinutes: 40, language: 'es',
      },
    },
  },

  cils: {
    listening: {
      section1: {
        title: 'Ascolto — Parte 1',
        instruction: 'Ascolterete dei brevi dialoghi. Scegliete la risposta corretta. L\'audio verrà riprodotto due volte.',
        audioDescription: 'Conversazioni quotidiane in italiano',
        playsCount: 2,
        questions: [
          { id: 1, type: 'multiple_choice', question: 'Di cosa parlano principalmente?',
            options: ['A) Di lavoro', 'B) Di vacanze', 'C) Di famiglia'], answer: 'A' },
          { id: 2, type: 'multiple_choice', question: 'Quando si incontreranno?',
            options: ['A) Lunedì', 'B) Mercoledì', 'C) Venerdì'], answer: 'C' },
          { id: 3, type: 'true_false', question: 'I due colleghi lavorano nello stesso ufficio.',
            options: ['Vero', 'Falso'], answer: 'Vero' },
          { id: 4, type: 'true_false', question: 'La riunione durerà più di due ore.',
            options: ['Vero', 'Falso'], answer: 'Falso' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Produzione scritta',
        instruction: 'Scrivete un testo formale in italiano su uno dei seguenti argomenti: "L\'importanza dello sport nella vita moderna" oppure "I social media: opportunità o pericolo?". Esprimete la vostra opinione con esempi concreti.',
        minWords: 200, timeMinutes: 60, language: 'it',
        note: 'Usate un registro formale. Minimo 200 parole.',
      },
    },
  },

  hsk: {
    listening: {
      section1: {
        title: '听力 — 第一部分',
        instruction: '第1–20题：判断对错。你将听到一些句子，判断是否正确。',
        audioDescription: '普通话短句和对话',
        playsCount: 1,
        questions: [
          { id: 1, type: 'true_false', question: '他每天早上六点起床。',   options: ['对', '错'], answer: '对' },
          { id: 2, type: 'true_false', question: '图书馆在学校的左边。',   options: ['对', '错'], answer: '错' },
          { id: 3, type: 'true_false', question: '她喜欢喝咖啡，不喜欢喝茶。', options: ['对', '错'], answer: '对' },
          { id: 4, type: 'true_false', question: '今天的天气很好，适合出去玩。', options: ['对', '错'], answer: '错' },
          { id: 5, type: 'true_false', question: '他们决定下周一起去旅游。', options: ['对', '错'], answer: '对' },
        ],
      },
      section2: {
        title: '听力 — 第二部分',
        instruction: '第21–45题：选择正确答案。',
        audioDescription: '普通话对话和短文',
        playsCount: 1,
        questions: [
          { id: 6, type: 'multiple_choice', question: '男的想做什么？',
            options: ['A) 去图书馆', 'B) 去超市买东西', 'C) 去公园散步'], answer: 'B' },
          { id: 7, type: 'multiple_choice', question: '他们最后决定去哪里？',
            options: ['A) 餐厅', 'B) 电影院', 'C) 公园'], answer: 'A' },
        ],
      },
    },
    writing: {
      task1: {
        title: '书写 — 写作',
        instruction: '请根据下面的题目写一篇短文。题目：《我最喜欢的城市》\n请介绍一个你喜欢的城市，包括它的特点、景点和你喜欢它的原因。',
        minWords: 80, timeMinutes: 25, language: 'zh',
        note: '请用汉字书写。至少80个字。',
      },
    },
  },

  jlpt: {
    listening: {
      section1: {
        title: '聴解 — 問題1',
        instruction: '問題1では、まず質問を聞いてください。それから話を聞いて、問題用紙の1から4の中から、最もよいものを一つ選んでください。',
        audioDescription: '日本語の会話',
        playsCount: 1,
        questions: [
          { id: 1, type: 'multiple_choice', question: '男の人はこの後まず何をしますか。',
            options: ['1. 資料を印刷する', '2. 会議室を予約する', '3. 上司に連絡する', '4. メールを送る'], answer: '2' },
          { id: 2, type: 'multiple_choice', question: '女の人はなぜ遅刻しましたか。',
            options: ['1. 電車が遅れた', '2. 寝坊した', '3. 道に迷った', '4. 忘れ物をした'], answer: '1' },
          { id: 3, type: 'multiple_choice', question: '二人はいつ会いますか。',
            options: ['1. 月曜日の午前', '2. 火曜日の午後', '3. 水曜日の午前', '4. 木曜日の午後'], answer: '3' },
        ],
      },
    },
  },

  topik: {
    listening: {
      section1: {
        title: '듣기 — 1번~20번',
        instruction: '다음을 듣고 알맞은 것을 고르십시오.',
        audioDescription: '한국어 대화와 담화',
        playsCount: 1,
        questions: [
          { id: 1, type: 'multiple_choice', question: '두 사람이 무엇에 대해 이야기하고 있습니까?',
            options: ['① 날씨', '② 여행 계획', '③ 음식', '④ 직장'], answer: '②' },
          { id: 2, type: 'multiple_choice', question: '여자는 왜 늦었습니까?',
            options: ['① 차가 막혔습니다', '② 버스를 잘못 탔습니다', '③ 약속을 잊었습니다', '④ 일이 늦게 끝났습니다'], answer: '①' },
          { id: 3, type: 'multiple_choice', question: '두 사람은 언제 만납니까?',
            options: ['① 오늘 오후', '② 내일 오전', '③ 이번 주말', '④ 다음 주'], answer: '③' },
        ],
      },
    },
    writing: {
      task1: {
        title: '쓰기 — 51번~52번',
        instruction: '다음을 읽고 ㉠과 ㉡에 들어갈 말을 각각 한 문장으로 쓰십시오.',
        minWords: 200, timeMinutes: 50, language: 'ko',
        note: '최소 200자 이상 쓰십시오.',
      },
      task2: {
        title: '쓰기 — 54번',
        instruction: '다음을 참고하여 600~700자로 글을 쓰십시오. 단, 글의 제목을 쓰지 마십시오.\n주제: "현대 사회에서 인터넷이 인간관계에 미치는 영향"',
        minWords: 600, maxWords: 700, timeMinutes: 50, language: 'ko',
      },
    },
  },

  torfl: {
    listening: {
      section1: {
        title: 'Аудирование — Часть 1',
        instruction: 'Прослушайте тексты и выберите правильный ответ. Каждый текст прозвучит один раз.',
        audioDescription: 'Русские диалоги и монологи',
        playsCount: 1,
        questions: [
          { id: 1, type: 'multiple_choice', question: 'О чём говорят в диалоге?',
            options: ['А) О работе', 'Б) Об учёбе', 'В) О путешествии'], answer: 'В' },
          { id: 2, type: 'multiple_choice', question: 'Когда они встретятся?',
            options: ['А) В понедельник', 'Б) В среду', 'В) В пятницу'], answer: 'Б' },
          { id: 3, type: 'true_false', question: 'Мужчина согласен с предложением женщины.',
            options: ['Верно', 'Неверно'], answer: 'Верно' },
        ],
      },
    },
    writing: {
      task1: {
        title: 'Письмо — Эссе',
        instruction: 'Напишите эссе на тему: «Влияние интернета на современное общество». Выразите своё мнение и приведите аргументы. Используйте примеры из жизни.',
        minWords: 200, timeMinutes: 60, language: 'ru',
        note: 'Минимум 200 слов. Используйте формальный стиль.',
      },
    },
  },

  alpt: {
    listening: {
      section1: {
        title: 'الاستماع — الجزء الأول',
        instruction: 'استمع إلى المحادثات التالية واختر الإجابة الصحيحة.',
        audioDescription: 'محادثات باللغة العربية',
        playsCount: 1,
        rtl: true,
        questions: [
          { id: 1, type: 'multiple_choice', question: 'عمَّ يتحدث الشخصان؟',
            options: ['أ) عن العمل', 'ب) عن السفر', 'ج) عن الدراسة'], answer: 'ب', rtl: true },
          { id: 2, type: 'multiple_choice', question: 'متى سيلتقيان؟',
            options: ['أ) يوم الاثنين', 'ب) يوم الأربعاء', 'ج) يوم الجمعة'], answer: 'ج', rtl: true },
          { id: 3, type: 'true_false', question: 'وافق الرجل على الاقتراح.',
            options: ['صحيح', 'خطأ'], answer: 'صحيح', rtl: true },
        ],
      },
    },
    writing: {
      task1: {
        title: 'الكتابة — المقال',
        instruction: 'اكتب مقالاً حول موضوع: "تأثير وسائل التواصل الاجتماعي على المجتمع". عبّر عن رأيك مع ذكر الأسباب والأمثلة.',
        minWords: 200, timeMinutes: 50, language: 'ar',
        rtl: true, note: '٢٠٠ كلمة على الأقل. استخدم أسلوباً رسمياً.',
      },
    },
  },

  persian_cefr: {
    writing: {
      task1: {
        title: 'نوشتار',
        instruction: 'یک متن رسمی به فارسی بنویسید. موضوع: "تأثیر فناوری بر زندگی روزمره"',
        minWords: 150, timeMinutes: 40, language: 'fa',
        rtl: true, note: 'حداقل ۱۵۰ کلمه. از سبک رسمی استفاده کنید.',
      },
    },
  },

};

// ── Accessor ─────────────────────────────────────────────────────

export function getExamContent(examId: string, module: string, section: string) {
  const exam = EXAM_CONTENT[examId];
  if (!exam) return null;
  const mod = exam[module as 'listening' | 'writing'];
  if (!mod) return null;
  return (mod as Record<string, any>)[section] ?? null;
}

// ── Question adapter: RawQuestion → ListeningQuestion format ──────

function parseOptionString(opt: string): { key: string; label: string } {
  // 'A) ...' or 'A. ...'
  let m = opt.match(/^([A-Za-z])[.)]\s*(.+)$/);
  if (m) return { key: m[1], label: m[2] };
  // 'А) ...' or 'Б) ...' Cyrillic
  m = opt.match(/^([А-Яа-яЁё])\)\s*(.+)$/u);
  if (m) return { key: m[1], label: m[2] };
  // 'أ) ...' Arabic
  m = opt.match(/^([\u0600-\u06FF])\)\s*(.+)$/u);
  if (m) return { key: m[1], label: m[2] };
  // '1. ...' or '1) ...'
  m = opt.match(/^(\d+)[.)]\s*(.+)$/);
  if (m) return { key: m[1], label: m[2] };
  // '① ...' circled numbers (Korean/Japanese)
  m = opt.match(/^([①②③④⑤⑥⑦⑧⑨⑩])\s*(.+)$/u);
  if (m) return { key: m[1], label: m[2] };
  return { key: opt, label: opt };
}

export type AdaptedQuestion = {
  number: number;
  type: 'form' | 'mcq' | 'note';
  shortLabel: string;
  text: string;
  prefix?: string;
  suffix?: string;
  options?: { key: string; label: string }[];
  correctAnswer: string;
  explanation: string;
  rtl?: boolean;
};

export function adaptQuestions(rawQuestions: RawQuestion[]): AdaptedQuestion[] {
  return rawQuestions.map(q => {
    const num = q.id;
    const shortLabel = `Q${num}`;

    if (q.type === 'form_completion') {
      return {
        number: num, type: 'form' as const, shortLabel,
        text: q.label ?? '', prefix: q.prefix || undefined, suffix: q.suffix || undefined,
        correctAnswer: q.answer, explanation: '', rtl: q.rtl,
      };
    }

    if (q.type === 'multiple_choice') {
      return {
        number: num, type: 'mcq' as const, shortLabel,
        text: q.question ?? '',
        options: (q.options ?? []).map(parseOptionString),
        correctAnswer: q.answer, explanation: '', rtl: q.rtl,
      };
    }

    if (q.type === 'true_false') {
      return {
        number: num, type: 'mcq' as const, shortLabel,
        text: q.question ?? '',
        options: (q.options ?? []).map(opt => ({ key: opt, label: opt })),
        correctAnswer: q.answer, explanation: '', rtl: q.rtl,
      };
    }

    // short_answer → note
    return {
      number: num, type: 'note' as const, shortLabel,
      text: q.question ?? '', correctAnswer: q.answer, explanation: '', rtl: q.rtl,
    };
  });
}
