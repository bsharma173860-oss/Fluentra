// ──────────────────────────────────────────────────────────────
// Fluentra — Per-Language Rich Content Packs
// Each pack provides: recentSessions, currentLessons, libraryItems,
// examHistory, vocabSamples, weeklyGoal — everything that was previously
// hardcoded English-IELTS in pages. Read via langContent(code).
//
// Pages should NEVER hardcode language-specific content. Add new languages
// here, not in page components.
// ──────────────────────────────────────────────────────────────

const LANG_CONTENT = {
  // ── ENGLISH (IELTS) ──────────────────────────────────────────
  en: {
    startedDays: 148,
    weeklyGoal: { done: 4, target: 7 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'IELTS Speaking Part 2',          meta:'Today, 9:00 AM · 14 min',  score:'7.5' },
      { ic:'pen',  module:'writing',   title:'Task 1 — Graph description',     meta:'Yesterday · 38 min',       score:'6.5' },
      { ic:'head', module:'listening', title:'Section 3 — Academic discussion',meta:'2 days ago · 40 min',      score:'7.5' },
      { ic:'book', module:'reading',   title:'Passage 2 — Science',            meta:'3 days ago · 58 min',      score:'7.0' },
    ],
    currentLessons: [
      { unit:'Unit 8', title:'Conditional sentences — all four types',  progress:0.6, mins:18 },
      { unit:'Unit 8', title:'Academic vocabulary — environment',       progress:0.3, mins:22 },
      { unit:'Unit 9', title:'Discourse markers in spoken English',     progress:0,   mins:15 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'BBC Global News — Apr 12',           meta:'Listening · 22 min · C1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Giving opinions formally',           meta:'Speaking · 8 phrases' },
      { kind:'Article',   ic:'book', module:'reading',   title:'IELTS Reading — Renewable energy',   meta:'Academic · 13 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Conditionals — all types',           meta:'Grammar · 12 min' },
      { kind:'Audio',     ic:'head', module:'listening', title:'TED Talk — habit formation',         meta:'Listening · 18 min' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Comparing & contrasting',            meta:'Speaking · 12 phrases' },
    ],
    examHistory: [
      { month:'April 2026',    score:'7.5', rank:12, sessions:2 },
      { month:'March 2026',    score:'7.0', rank:18, sessions:3 },
      { month:'February 2026', score:'6.5', rank:24, sessions:2 },
    ],
    skillTargets: [
      { module:'speaking',  current:7.0, target:7.5 },
      { module:'writing',   current:6.5, target:7.0 },
      { module:'listening', current:7.5, target:8.0 },
      { module:'reading',   current:7.0, target:7.5 },
    ],
    primaryExam: { name:'IELTS Academic',     cycle:'May 2026', date:'May 1',  registered:847, fee:'$5' },
    otherExams:  [{ name:'TOEFL iBT',        score:'92', next:'May 12' },{ name:'Cambridge C1', score:'B', next:'Jun 8' }],
  },

  // ── SPANISH (DELE) ───────────────────────────────────────────
  es: {
    startedDays: 92,
    weeklyGoal: { done: 5, target: 7 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'DELE Oral — Café conversation',  meta:'Today, 9:00 AM · 12 min',  score:'72/100' },
      { ic:'pen',  module:'writing',   title:'Carta formal — Reclamación',     meta:'Yesterday · 45 min',       score:'68/100' },
      { ic:'head', module:'listening', title:'Audio 3 — Entrevista de trabajo',meta:'2 days ago · 30 min',      score:'80/100' },
      { ic:'book', module:'reading',   title:'Lectura — Cambio climático',     meta:'3 days ago · 50 min',      score:'74/100' },
    ],
    currentLessons: [
      { unit:'Unidad 6', title:'Subjuntivo presente vs imperfecto',    progress:0.7, mins:20 },
      { unit:'Unidad 6', title:'Vocabulario — el medio ambiente',      progress:0.4, mins:18 },
      { unit:'Unidad 7', title:'Conectores formales para DELE',        progress:0,   mins:15 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'Radio Nacional — Noticias culturales', meta:'Auditiva · 18 min · B2' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Expresar opiniones formalmente',       meta:'Oral · 10 frases' },
      { kind:'Article',   ic:'book', module:'reading',   title:'Lectura DELE — Cambio climático',      meta:'Académico · 12 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Carta formal — modelo y plantilla',    meta:'Gramática · 14 min' },
      { kind:'Audio',     ic:'head', module:'listening', title:'Podcast — Hoy en la historia',         meta:'Auditiva · 22 min' },
    ],
    examHistory: [
      { month:'Abril 2026',   score:'74', rank:31, sessions:2 },
      { month:'Marzo 2026',   score:'70', rank:42, sessions:3 },
      { month:'Febrero 2026', score:'66', rank:58, sessions:2 },
    ],
    skillTargets: [
      { module:'speaking',  current:72, target:80, scale:100 },
      { module:'writing',   current:68, target:75, scale:100 },
      { module:'listening', current:80, target:85, scale:100 },
      { module:'reading',   current:74, target:80, scale:100 },
    ],
    primaryExam: { name:'DELE B2',           cycle:'June 2026', date:'Jun 4', registered:518, fee:'$5' },
    otherExams:  [{ name:'SIELE',            score:'742', next:'May 18' },{ name:'DELE C1', score:'—', next:'Nov 12' }],
  },

  // ── JAPANESE (JLPT — no speaking) ───────────────────────────
  ja: {
    startedDays: 64,
    weeklyGoal: { done: 3, target: 5 },
    recentSessions: [
      { ic:'pen',  module:'writing',   title:'JLPT — 文字・語彙 練習',           meta:'Today, 9:00 AM · 25 min', score:'24/30' },
      { ic:'book', module:'reading',   title:'文法・読解 — 短文問題',             meta:'Yesterday · 40 min',      score:'28/35' },
      { ic:'head', module:'listening', title:'聴解 — 駅のアナウンス',             meta:'2 days ago · 35 min',     score:'22/28' },
      { ic:'pen',  module:'writing',   title:'漢字書き取り — N4',                  meta:'4 days ago · 18 min',     score:'26/30' },
    ],
    currentLessons: [
      { unit:'第8課', title:'は と が の使い分け',                      progress:0.55, mins:22 },
      { unit:'第8課', title:'N4 漢字 — 自然・天気',                       progress:0.4,  mins:25 },
      { unit:'第9課', title:'敬語の基本（丁寧語）',                      progress:0,    mins:20 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'NHK Easy News — 4月12日',           meta:'聴解 · 12 min · N4' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'自己紹介の決まり文句',                meta:'会話 · 8 phrases' },
      { kind:'Article',   ic:'book', module:'reading',   title:'JLPT Reading — 桜の季節',            meta:'読解 · 8 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'N4 文法 — まとめ',                   meta:'文法 · 16 min' },
      { kind:'Audio',     ic:'head', module:'listening', title:'駅のアナウンス集',                    meta:'聴解 · 8 min' },
    ],
    examHistory: [
      { month:'4月 2026',  score:'122', rank:88, sessions:2 },
      { month:'3月 2026',  score:'108', rank:142, sessions:2 },
      { month:'2月 2026',  score:'94',  rank:198, sessions:1 },
    ],
    skillTargets: [
      { module:'writing',   current:24, target:28, scale:30 },
      { module:'reading',   current:28, target:32, scale:35 },
      { module:'listening', current:22, target:26, scale:28 },
    ],
    hideSpeaking: true,
    primaryExam: { name:'JLPT N4',           cycle:'July 2026', date:'Jul 7', registered:412, fee:'$5' },
    otherExams:  [{ name:'JLPT N3',          score:'—', next:'Dec 1' },{ name:'BJT Business JP', score:'J3', next:'Jun 14' }],
  },

  // ── FRENCH (DELF) ────────────────────────────────────────────
  fr: {
    startedDays: 110,
    weeklyGoal: { done: 5, target: 7 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'DELF — Production orale (B1)',     meta:'Today, 9:00 AM · 15 min', score:'18/25' },
      { ic:'pen',  module:'writing',   title:'Essai argumentatif — Écologie',     meta:'Yesterday · 45 min',      score:'14/25' },
      { ic:'head', module:'listening', title:'Compréhension — Reportage radio',   meta:'2 days ago · 25 min',     score:'20/25' },
      { ic:'book', module:'reading',   title:'Article — La transition énergétique', meta:'3 days ago · 35 min',  score:'18/25' },
    ],
    currentLessons: [
      { unit:'Unité 7', title:'Subjonctif présent — formes & emplois',  progress:0.6, mins:22 },
      { unit:'Unité 7', title:'Connecteurs logiques pour DELF B2',      progress:0.3, mins:18 },
      { unit:'Unité 8', title:'Liaisons obligatoires et facultatives',  progress:0,   mins:15 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'France Inter — Le 7/9 (extrait)',   meta:'Compréhension · 18 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Donner son opinion poliment',       meta:'Production orale · 9 phrases' },
      { kind:'Article',   ic:'book', module:'reading',   title:'DELF Lecture — Transition écologique', meta:'Académique · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Essai argumentatif — structure',    meta:'Grammaire · 14 min' },
      { kind:'Audio',     ic:'head', module:'listening', title:'TV5MONDE — Reportage culture',      meta:'Compréhension · 14 min' },
    ],
    examHistory: [
      { month:'Avril 2026',   score:'76', rank:24, sessions:2 },
      { month:'Mars 2026',    score:'72', rank:38, sessions:3 },
      { month:'Février 2026', score:'68', rank:51, sessions:2 },
    ],
    skillTargets: [
      { module:'speaking',  current:18, target:22, scale:25 },
      { module:'writing',   current:14, target:18, scale:25 },
      { module:'listening', current:20, target:23, scale:25 },
      { module:'reading',   current:18, target:22, scale:25 },
    ],
    primaryExam: { name:'DELF B1',           cycle:'May 2026', date:'May 30', registered:296, fee:'$5' },
    otherExams:  [{ name:'DALF C1',          score:'—', next:'Jun 22' },{ name:'TCF', score:'B2', next:'May 5' }],
  },

  // ── GERMAN (Goethe-Zertifikat) ───────────────────────────────
  de: {
    startedDays: 38,
    weeklyGoal: { done: 4, target: 6 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'Goethe — Sprechen Teil 2',         meta:'Today, 9:00 AM · 12 min', score:'72/100' },
      { ic:'pen',  module:'writing',   title:'Schreiben — Forumsbeitrag',        meta:'Yesterday · 40 min',      score:'68/100' },
      { ic:'head', module:'listening', title:'Hören — Radio-Interview',          meta:'2 days ago · 30 min',     score:'80/100' },
      { ic:'book', module:'reading',   title:'Lesen — Zeitungsartikel',          meta:'3 days ago · 45 min',     score:'74/100' },
    ],
    currentLessons: [
      { unit:'Lektion 5', title:'Akkusativ vs Dativ — Übungen',        progress:0.5, mins:20 },
      { unit:'Lektion 5', title:'Trennbare Verben im Alltag',          progress:0.3, mins:18 },
      { unit:'Lektion 6', title:'Konjunktiv II — höfliche Bitten',      progress:0,   mins:22 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'Deutsche Welle — Top-Thema',          meta:'Hören · 6 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Im Restaurant bestellen',             meta:'Sprechen · 12 Phrasen' },
      { kind:'Article',   ic:'book', module:'reading',   title:'Goethe-Lesen — Stadtgeschichte',      meta:'Akademisch · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Forumsbeitrag — Aufbau & Beispiele',  meta:'Grammatik · 14 min' },
      { kind:'Audio',     ic:'head', module:'listening', title:'Tagesschau in 100 Sekunden',          meta:'Hören · 2 min' },
    ],
    examHistory: [
      { month:'April 2026',   score:'72', rank:18, sessions:2 },
      { month:'März 2026',    score:'66', rank:28, sessions:2 },
      { month:'Februar 2026', score:'58', rank:42, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:72, target:78, scale:100 },
      { module:'writing',   current:68, target:75, scale:100 },
      { module:'listening', current:80, target:85, scale:100 },
      { module:'reading',   current:74, target:80, scale:100 },
    ],
    primaryExam: { name:'Goethe-Zertifikat B1', cycle:'May 2026', date:'May 24', registered:188, fee:'$5' },
    otherExams:  [{ name:'TestDaF',          score:'—', next:'Jul 11' },{ name:'telc Deutsch B2', score:'—', next:'Jun 1' }],
  },

  // ── ITALIAN (CILS) ───────────────────────────────────────────
  it: {
    startedDays: 30,
    weeklyGoal: { done: 3, target: 5 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'CILS — Produzione orale',          meta:'Today, 9:00 AM · 12 min', score:'70/100' },
      { ic:'pen',  module:'writing',   title:'Scrittura — Lettera formale',       meta:'Yesterday · 40 min',      score:'66/100' },
      { ic:'head', module:'listening', title:'Comprensione — Notiziario',         meta:'2 days ago · 30 min',     score:'78/100' },
      { ic:'book', module:'reading',   title:'Lettura — Articolo culturale',      meta:'3 days ago · 40 min',     score:'72/100' },
    ],
    currentLessons: [
      { unit:'Unità 4', title:'Congiuntivo presente — formare e usare',progress:0.45, mins:22 },
      { unit:'Unità 4', title:'Pronomi combinati nel parlato',          progress:0.2,  mins:18 },
      { unit:'Unità 5', title:'Periodo ipotetico — primo e secondo tipo',progress:0,   mins:20 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'RAI Radio 3 — Cultura italiana',      meta:'Ascolto · 16 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Esprimere preferenze',                 meta:'Orale · 10 espressioni' },
      { kind:'Article',   ic:'book', module:'reading',   title:'CILS Lettura — Arte rinascimentale',   meta:'Accademico · 9 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Lettera formale — modello',            meta:'Grammatica · 12 min' },
    ],
    examHistory: [
      { month:'Aprile 2026',  score:'70', rank:14, sessions:2 },
      { month:'Marzo 2026',   score:'64', rank:22, sessions:2 },
      { month:'Febbraio 2026',score:'58', rank:32, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:70, target:78, scale:100 },
      { module:'writing',   current:66, target:74, scale:100 },
      { module:'listening', current:78, target:84, scale:100 },
      { module:'reading',   current:72, target:80, scale:100 },
    ],
    primaryExam: { name:'CILS B1',           cycle:'June 2026', date:'Jun 11', registered:142, fee:'$5' },
    otherExams:  [{ name:'CELI 3',           score:'—', next:'Jul 8' },{ name:'PLIDA B2', score:'—', next:'Jun 22' }],
  },

  // ── PORTUGUESE (CELPE-Bras) ──────────────────────────────────
  pt: {
    startedDays: 22,
    weeklyGoal: { done: 3, target: 5 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'CELPE-Bras — Parte oral',          meta:'Today, 9:00 AM · 20 min', score:'74/100' },
      { ic:'pen',  module:'writing',   title:'Redação — Texto opinativo',         meta:'Yesterday · 50 min',      score:'68/100' },
      { ic:'head', module:'listening', title:'Compreensão oral — Entrevista',     meta:'2 days ago · 30 min',     score:'80/100' },
      { ic:'book', module:'reading',   title:'Leitura — Tecnologia',              meta:'3 days ago · 40 min',     score:'76/100' },
    ],
    currentLessons: [
      { unit:'Unidade 3', title:'Pretérito perfeito vs imperfeito',     progress:0.55, mins:22 },
      { unit:'Unidade 3', title:'Pronomes oblíquos átonos',              progress:0.25, mins:18 },
      { unit:'Unidade 4', title:'Subjuntivo — usos no português',        progress:0,    mins:20 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'Globo News — Reportagem',             meta:'Compreensão · 14 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Expressar opiniões com cuidado',      meta:'Oral · 10 frases' },
      { kind:'Article',   ic:'book', module:'reading',   title:'CELPE Leitura — Mata Atlântica',      meta:'Acadêmico · 11 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Texto opinativo — estrutura',         meta:'Gramática · 14 min' },
    ],
    examHistory: [
      { month:'Abril 2026',   score:'74', rank:21, sessions:2 },
      { month:'Março 2026',   score:'70', rank:34, sessions:2 },
      { month:'Fevereiro 2026', score:'62', rank:48, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:74, target:82, scale:100 },
      { module:'writing',   current:68, target:76, scale:100 },
      { module:'listening', current:80, target:86, scale:100 },
      { module:'reading',   current:76, target:82, scale:100 },
    ],
    primaryExam: { name:'CELPE-Bras Intermediário', cycle:'May 2026', date:'May 18', registered:204, fee:'$5' },
    otherExams:  [{ name:'CAPLE B2',         score:'—', next:'Jun 14' },{ name:'CIPLE', score:'—', next:'Jul 2' }],
  },

  // ── KOREAN (TOPIK II) ────────────────────────────────────────
  ko: {
    startedDays: 18,
    weeklyGoal: { done: 4, target: 6 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'TOPIK — 말하기 연습',                meta:'Today, 9:00 AM · 12 min', score:'78/100' },
      { ic:'pen',  module:'writing',   title:'쓰기 — 짧은 글짓기',                  meta:'Yesterday · 40 min',      score:'70/100' },
      { ic:'head', module:'listening', title:'듣기 — 일상 대화',                    meta:'2 days ago · 30 min',     score:'82/100' },
      { ic:'book', module:'reading',   title:'읽기 — 신문 기사',                    meta:'3 days ago · 40 min',     score:'76/100' },
    ],
    currentLessons: [
      { unit:'제5과', title:'은/는 vs 이/가 — 차이점',                progress:0.5, mins:22 },
      { unit:'제5과', title:'TOPIK II 어휘 — 사회 분야',              progress:0.3, mins:25 },
      { unit:'제6과', title:'연결어미 -아서/어서 vs -니까',            progress:0,   mins:18 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'KBS 뉴스 광장 — 4월 12일',           meta:'듣기 · 14 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'정중하게 의견 표현하기',                meta:'말하기 · 10 표현' },
      { kind:'Article',   ic:'book', module:'reading',   title:'TOPIK 읽기 — 한국 문화',                meta:'학술 · 12 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'짧은 글짓기 — 구조',                    meta:'문법 · 12 min' },
    ],
    examHistory: [
      { month:'4월 2026',  score:'78', rank:36, sessions:2 },
      { month:'3월 2026',  score:'72', rank:54, sessions:2 },
      { month:'2월 2026',  score:'64', rank:78, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:78, target:85, scale:100 },
      { module:'writing',   current:70, target:78, scale:100 },
      { module:'listening', current:82, target:88, scale:100 },
      { module:'reading',   current:76, target:82, scale:100 },
    ],
    primaryExam: { name:'TOPIK II',          cycle:'May 2026', date:'May 11', registered:328, fee:'$5' },
    otherExams:  [{ name:'TOPIK I',          score:'3', next:'Jul 14' },{ name:'KLPT', score:'—', next:'Jun 28' }],
  },

  // ── MANDARIN (HSK 4) ─────────────────────────────────────────
  zh: {
    startedDays: 14,
    weeklyGoal: { done: 3, target: 5 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'HSKK — 口语练习',                    meta:'Today, 9:00 AM · 12 min', score:'78/100' },
      { ic:'pen',  module:'writing',   title:'写作 — 短文',                         meta:'Yesterday · 40 min',      score:'70/100' },
      { ic:'head', module:'listening', title:'听力 — 对话',                         meta:'2 days ago · 30 min',     score:'82/100' },
      { ic:'book', module:'reading',   title:'阅读 — 文化文章',                     meta:'3 days ago · 35 min',     score:'76/100' },
    ],
    currentLessons: [
      { unit:'第6课', title:'"了" 的两种用法',                    progress:0.45, mins:22 },
      { unit:'第6课', title:'HSK 4 词汇 — 工作篇',                  progress:0.3,  mins:25 },
      { unit:'第7课', title:'比较句 — "比" vs "更"',                progress:0,    mins:20 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'CCTV 新闻 — 4月12日',                 meta:'听力 · 12 min · HSK 4' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'礼貌地表达意见',                       meta:'口语 · 10 句' },
      { kind:'Article',   ic:'book', module:'reading',   title:'HSK 阅读 — 中国传统节日',              meta:'学术 · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'短文写作 — 结构和模板',                meta:'语法 · 14 min' },
    ],
    examHistory: [
      { month:'四月 2026',  score:'78', rank:62, sessions:2 },
      { month:'三月 2026',  score:'72', rank:96, sessions:2 },
      { month:'二月 2026',  score:'64', rank:148, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:78, target:85, scale:100 },
      { module:'writing',   current:70, target:78, scale:100 },
      { module:'listening', current:82, target:88, scale:100 },
      { module:'reading',   current:76, target:82, scale:100 },
    ],
    primaryExam: { name:'HSK 4',             cycle:'May 2026', date:'May 17', registered:611, fee:'$5' },
    otherExams:  [{ name:'HSK 5',            score:'—', next:'Jun 21' },{ name:'HSKK', score:'—', next:'Jul 5' }],
  },

  // ── ARABIC (ALPT) ────────────────────────────────────────────
  ar: {
    startedDays: 12,
    weeklyGoal: { done: 2, target: 4 },
    rtl: true,
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'ALPT — محادثة',                    meta:'Today, 9:00 AM · 12 min', score:'70/100' },
      { ic:'pen',  module:'writing',   title:'كتابة — رسالة رسمية',                meta:'Yesterday · 40 min',      score:'64/100' },
      { ic:'head', module:'listening', title:'استماع — نشرة الأخبار',              meta:'2 days ago · 30 min',     score:'76/100' },
      { ic:'book', module:'reading',   title:'قراءة — مقال ثقافي',                 meta:'3 days ago · 35 min',     score:'72/100' },
    ],
    currentLessons: [
      { unit:'الدرس ٤', title:'الإعراب الأساسي — مرفوع، منصوب، مجرور',  progress:0.4, mins:22 },
      { unit:'الدرس ٤', title:'مفردات ALPT — العمل والمهن',              progress:0.2, mins:18 },
      { unit:'الدرس ٥', title:'الجمل الشرطية',                            progress:0,   mins:20 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'الجزيرة — تقرير ثقافي',               meta:'استماع · 14 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'التعبير عن الرأي بأدب',                 meta:'محادثة · 10 عبارات' },
      { kind:'Article',   ic:'book', module:'reading',   title:'ALPT قراءة — التراث العربي',           meta:'أكاديمي · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'الرسالة الرسمية — البنية',              meta:'قواعد · 12 min' },
    ],
    examHistory: [
      { month:'أبريل ٢٠٢٦',  score:'70', rank:8, sessions:2 },
      { month:'مارس ٢٠٢٦',   score:'62', rank:14, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:70, target:78, scale:100 },
      { module:'writing',   current:64, target:72, scale:100 },
      { module:'listening', current:76, target:82, scale:100 },
      { module:'reading',   current:72, target:78, scale:100 },
    ],
    primaryExam: { name:'ALPT B1',           cycle:'June 2026', date:'Jun 7', registered:96, fee:'$5' },
    otherExams:  [{ name:'CIMA',             score:'—', next:'Jul 12' },{ name:'ACTFL OPI', score:'—', next:'May 30' }],
  },

  // ── RUSSIAN (TORFL) ──────────────────────────────────────────
  ru: {
    startedDays: 8,
    weeklyGoal: { done: 2, target: 4 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'TORFL — Говорение',                meta:'Today, 9:00 AM · 14 min', score:'72/100' },
      { ic:'pen',  module:'writing',   title:'Письмо — личное письмо',            meta:'Yesterday · 45 min',      score:'66/100' },
      { ic:'head', module:'listening', title:'Аудирование — диалог',              meta:'2 days ago · 28 min',     score:'78/100' },
      { ic:'book', module:'reading',   title:'Чтение — статья о городе',          meta:'3 days ago · 35 min',     score:'74/100' },
    ],
    currentLessons: [
      { unit:'Урок 4', title:'Винительный vs родительный падежи',     progress:0.45, mins:22 },
      { unit:'Урок 4', title:'Лексика TORFL B1 — работа',              progress:0.25, mins:20 },
      { unit:'Урок 5', title:'Виды глагола — совершенный/несовершенный',progress:0,    mins:25 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'Эхо Москвы — Культура',                meta:'Аудирование · 14 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Вежливо выразить мнение',               meta:'Говорение · 10 фраз' },
      { kind:'Article',   ic:'book', module:'reading',   title:'TORFL Чтение — Москва',                meta:'Академический · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Личное письмо — структура',             meta:'Грамматика · 14 min' },
    ],
    examHistory: [
      { month:'Апрель 2026',  score:'72', rank:11, sessions:2 },
      { month:'Март 2026',    score:'64', rank:18, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:72, target:80, scale:100 },
      { module:'writing',   current:66, target:74, scale:100 },
      { module:'listening', current:78, target:84, scale:100 },
      { module:'reading',   current:74, target:80, scale:100 },
    ],
    primaryExam: { name:'TORFL B1',          cycle:'May 2026', date:'May 22', registered:118, fee:'$5' },
    otherExams:  [{ name:'TORFL B2',         score:'—', next:'Jun 28' },{ name:'TRKI', score:'—', next:'Jul 14' }],
  },

  // ── HINDI (HPT) ──────────────────────────────────────────────
  hi: {
    startedDays: 6,
    weeklyGoal: { done: 1, target: 3 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'HPT — बोलना अभ्यास',                meta:'Today, 9:00 AM · 12 min', score:'68/100' },
      { ic:'pen',  module:'writing',   title:'लेखन — औपचारिक पत्र',                meta:'Yesterday · 40 min',      score:'62/100' },
      { ic:'head', module:'listening', title:'सुनना — समाचार बुलेटिन',              meta:'2 days ago · 25 min',     score:'74/100' },
      { ic:'book', module:'reading',   title:'पठन — सांस्कृतिक लेख',                meta:'3 days ago · 30 min',     score:'70/100' },
    ],
    currentLessons: [
      { unit:'पाठ ३', title:'ने का प्रयोग और कर्ता',                 progress:0.4,  mins:22 },
      { unit:'पाठ ३', title:'HPT शब्दावली — समाज',                    progress:0.2,  mins:18 },
      { unit:'पाठ ४', title:'भविष्य काल और संभावना',                  progress:0,    mins:20 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'AIR News — सांस्कृतिक रिपोर्ट',          meta:'सुनना · 12 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'विनम्रता से राय व्यक्त करें',              meta:'बोलना · 10 वाक्य' },
      { kind:'Article',   ic:'book', module:'reading',   title:'HPT पठन — भारतीय त्योहार',              meta:'शैक्षणिक · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'औपचारिक पत्र — संरचना',                  meta:'व्याकरण · 14 min' },
    ],
    examHistory: [
      { month:'अप्रैल २०२६', score:'68', rank:6, sessions:2 },
    ],
    skillTargets: [
      { module:'speaking',  current:68, target:76, scale:100 },
      { module:'writing',   current:62, target:70, scale:100 },
      { module:'listening', current:74, target:82, scale:100 },
      { module:'reading',   current:70, target:78, scale:100 },
    ],
    primaryExam: { name:'Hindi Proficiency B1', cycle:'June 2026', date:'Jun 4', registered:74, fee:'$5' },
    otherExams:  [{ name:'CIIL',             score:'—', next:'Jul 9' }],
  },

  // ── TURKISH (TYS) ────────────────────────────────────────────
  tr: {
    startedDays: 7,
    weeklyGoal: { done: 2, target: 4 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:'TYS — Konuşma',                    meta:'Today, 9:00 AM · 12 min', score:'72/100' },
      { ic:'pen',  module:'writing',   title:'Yazma — Resmi mektup',              meta:'Yesterday · 40 min',      score:'66/100' },
      { ic:'head', module:'listening', title:'Dinleme — Haberler',                meta:'2 days ago · 28 min',     score:'78/100' },
      { ic:'book', module:'reading',   title:'Okuma — Kültür makalesi',           meta:'3 days ago · 32 min',     score:'74/100' },
    ],
    currentLessons: [
      { unit:'Ders 3', title:'Geniş zaman vs şimdiki zaman',          progress:0.5, mins:20 },
      { unit:'Ders 3', title:'TYS B1 kelime — iş hayatı',              progress:0.3, mins:18 },
      { unit:'Ders 4', title:'Ünlü uyumu ve istisnalar',                progress:0,   mins:22 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:'TRT Haber — Kültür raporu',           meta:'Dinleme · 12 min · B1' },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:'Görüş kibarca ifade etme',             meta:'Konuşma · 10 ifade' },
      { kind:'Article',   ic:'book', module:'reading',   title:'TYS Okuma — Türk gelenekleri',         meta:'Akademik · 10 Q' },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:'Resmi mektup — yapı',                  meta:'Dil bilgisi · 14 min' },
    ],
    examHistory: [
      { month:'Nisan 2026',  score:'72', rank:9, sessions:2 },
      { month:'Mart 2026',   score:'64', rank:16, sessions:1 },
    ],
    skillTargets: [
      { module:'speaking',  current:72, target:80, scale:100 },
      { module:'writing',   current:66, target:74, scale:100 },
      { module:'listening', current:78, target:84, scale:100 },
      { module:'reading',   current:74, target:80, scale:100 },
    ],
    primaryExam: { name:'TYS B1',            cycle:'May 2026', date:'May 20', registered:88, fee:'$5' },
    otherExams:  [{ name:'TYS B2',           score:'—', next:'Jun 25' }],
  },
};

// ── Public accessor ────────────────────────────────────────────
// Returns rich content for a language. For unknown codes, generates a
// generic CEFR-style fallback so the page still renders cleanly.
function langContent(code) {
  const c = LANG_CONTENT[code];
  if (c) return c;

  // Generic fallback for any newly-added long-tail language.
  const langName = (typeof langByCode === 'function') ? langByCode(code).english : code;
  const ex = (typeof examFor === 'function') ? examFor(code) : null;
  const examShort = ex?.short || 'CEFR';
  const score = String(ex?.bestScore || 'A2');
  return {
    startedDays: 5,
    weeklyGoal: { done: 1, target: 3 },
    recentSessions: [
      { ic:'mic',  module:'speaking',  title:`${langName} — Speaking practice`,  meta:'Today, 9:00 AM · 12 min', score },
      { ic:'pen',  module:'writing',   title:`${langName} — Writing exercise`,    meta:'Yesterday · 30 min',      score },
      { ic:'head', module:'listening', title:`${langName} — Listening session`,   meta:'2 days ago · 25 min',     score },
      { ic:'book', module:'reading',   title:`${langName} — Reading passage`,     meta:'3 days ago · 30 min',     score },
    ],
    currentLessons: [
      { unit:'Unit 1', title:`${langName} — Greetings & introductions`,    progress:0.6, mins:18 },
      { unit:'Unit 1', title:`${langName} — Numbers, days, common verbs`,  progress:0.3, mins:20 },
      { unit:'Unit 2', title:`${langName} — Asking for directions`,         progress:0,   mins:15 },
    ],
    libraryItems: [
      { kind:'Audio',     ic:'head', module:'listening', title:`${langName} news clip`,                meta:`Listening · 12 min · A2` },
      { kind:'Phrasebook',ic:'mic',  module:'speaking',  title:`${langName} — Polite conversation`,     meta:`Speaking · 10 phrases` },
      { kind:'Article',   ic:'book', module:'reading',   title:`${examShort} reading — Culture`,        meta:`Academic · 8 Q` },
      { kind:'Lesson',    ic:'pen',  module:'writing',   title:`${langName} — Basic sentences`,         meta:`Grammar · 12 min` },
    ],
    examHistory: [],
    skillTargets: [
      { module:'speaking',  current:60, target:70, scale:100 },
      { module:'writing',   current:55, target:65, scale:100 },
      { module:'listening', current:65, target:75, scale:100 },
      { module:'reading',   current:62, target:72, scale:100 },
    ],
    primaryExam: { name: ex?.name || `${langName} certification`, cycle:'June 2026', date:'Jun 10', registered:30, fee:'$5' },
    otherExams: [{ name: `${langName} placement`, score:'—', next:'Jul 5' }],
  };
}

if (typeof window !== 'undefined') window.langContent = langContent;
