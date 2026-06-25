// ──────────────────────────────────────────────────────────────
// Fluentra Redesign — Shared Tokens, Data, Icons, Flags, Primitives
// Visual language: warm off-white bg, DM Serif Display + Inter,
// per-language accent tints, generous whitespace.
// ──────────────────────────────────────────────────────────────

const T = /* tokens */ {
  // Surfaces
  bg:      'rgba(250,248,245,0.40)',
  bg2:     '#F4F1EB',
  bg3:     '#EDEAE3',
  card:    '#FFFFFF',
  paper:   '#FFFEFA',
  // Glass (frosted) — translucent surfaces blurred over the ambient backdrop
  glass:       'rgba(255,255,255,0.40)',
  glassStrong: 'rgba(255,255,255,0.54)',
  glassBorder: 'rgba(255,255,255,0.92)',
  glassBlur:   'blur(34px) saturate(195%)',
  glassShadow: '0 16px 44px rgba(40,30,25,0.17), inset 0 1px 0 rgba(255,255,255,0.8)',
  // Borders
  border:  '#EAEAEA',
  hairline:'#F4F4F4',
  // Text
  ink:     '#000000',
  ink2:    '#333333',
  ink3:    '#666666',
  ink4:    '#999999',
  ink5:    '#BBBBBB',
  // Track
  track:   '#F2F2F2',
  trackWarm:'#F4F4F0',
  // Brand
  brand:   '#C04A06',
  brandSoft:'#FFF0EE',
  brandLight:'#FFE5DE',
  brandGrad:'linear-gradient(135deg,#C04A06,#E8732F)',
  // Module accents (from constants/colors.ts)
  speaking:{ c:'#5B4EFF', bg:'#EEEDFF' },   // p / p_soft
  writing: { c:'#A65A00', bg:'#FFEAC2' },   // gold
  listening:{c:'#1A8F4E', bg:'#E2F5E9' },   // green
  reading: { c:'#C04A06', bg:'#FFE5DE' },   // orange (= brand)
  // Per-language themes
  es: { bg:'#FFF0EE', accent:'#C04A06', accentLight:'#FFE5DE' },
  ja: { bg:'#FFF0F5', accent:'#C84070', accentLight:'#FFE0EC' },
  fr: { bg:'#EEF4FF', accent:'#1558B0', accentLight:'#DDEEFF' },
  de: { bg:'#FFF7E8', accent:'#A65A00', accentLight:'#FFEAC2' },
  en: { bg:'#EEEDFF', accent:'#5B4EFF', accentLight:'#DDDBFF' },
  it: { bg:'#EEF7EE', accent:'#0F8A4D', accentLight:'#D9EFDF' },
  pt: { bg:'#E8F4EC', accent:'#0E6F3F', accentLight:'#D2EBD9' },
  ko: { bg:'#EEF2FB', accent:'#1F4F8C', accentLight:'#DCE5F4' },
  zh: { bg:'#FBE8EB', accent:'#B0142B', accentLight:'#F4D3D8' },
  ar: { bg:'#E8F2EE', accent:'#0D6E55', accentLight:'#D3E6DD' },
  ru: { bg:'#EFF1FA', accent:'#3D52A0', accentLight:'#DEE3F2' },
  hi: { bg:'#FFEFE0', accent:'#D6792C', accentLight:'#FCDFC0' },
  tr: { bg:'#FCE8EB', accent:'#C8242E', accentLight:'#F4D2D6' },
  // Type
  serif:   "'DM Serif Display', serif",
  sans:    "'Inter', sans-serif",
};

// ── Languages ─────────────────────────────────────────────────
// Default starter languages (4 stock). New users see these on first load;
// anyone who removes one or adds another via the Add Language flow ends up
// with a different list. The current list lives on window.__userLangCodes
// (an array of codes) so any page can read it.
const STARTER_CODES = ['en', 'es', 'ja', 'fr'];
const LANGUAGES = [
  { code:'en', native:'English',  english:'English',  streak:0, level:'A1', exam:'IELTS', flag:'en' },
  { code:'es', native:'Español',  english:'Spanish',  streak:0, level:'A1', exam:'DELE',  flag:'es' },
  { code:'ja', native:'日本語',     english:'Japanese', streak:0,  level:'A1', exam:'JLPT N4', flag:'ja' },
  { code:'fr', native:'Français', english:'French',   streak:0, level:'A1', exam:'DELF',  flag:'fr' },
];

// Languages the user adds at runtime via the Add Language flow.
// Stored on window so any page can read/append. Cleared on page reload —
// when the backend is wired, swap this for a Supabase-backed user.languages.
// Languages the user has on their account. First visit → 4 starters.
// Once user removes/adds we persist the code list in localStorage so refresh
// keeps the choice. Backend swap-in: replace with Supabase user.languages.
if (typeof window !== 'undefined' && !window.__userLangCodes) {
  try {
    const saved = localStorage.getItem('__fluentra_user_langs');
    window.__userLangCodes = saved ? JSON.parse(saved) : [...STARTER_CODES];
  } catch { window.__userLangCodes = [...STARTER_CODES]; }
}
if (typeof window !== 'undefined' && !window.__addedLangs) window.__addedLangs = [];

function saveUserLangs() {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('__fluentra_user_langs', JSON.stringify(window.__userLangCodes || [])); } catch {}
}

function addUserLang(code) {
  if (typeof window === 'undefined') return;
  if (!window.__userLangCodes.includes(code)) {
    window.__userLangCodes = [...window.__userLangCodes, code];
    saveUserLangs();
  }
}

function removeUserLang(code) {
  if (typeof window === 'undefined') return;
  window.__userLangCodes = window.__userLangCodes.filter(c => c !== code);
  saveUserLangs();
}

// Merged view: only languages the user has chosen + anything added at runtime.
function userLanguages() {
  if (typeof window === 'undefined') return LANGUAGES;
  // Real languages loaded from the backend (real streak/level/xp) always win.
  if (window.__userLanguages && window.__userLanguages.length) return window.__userLanguages;
  const codes = window.__userLangCodes || STARTER_CODES;
  const all = [...LANGUAGES, ...(window.__addedLangs || [])];
  // Preserve the order in __userLangCodes so newly-added langs land at the end.
  return codes.map(c => all.find(l => l.code === c)).filter(Boolean);
}

// Look up a language by code across stock + user-added.
function langByCode(code) {
  return userLanguages().find(l => l.code === code) || LANGUAGES[0];
}

// Consecutive-day streak derived from real session history (no stored counter).
function computeStreak(rows) {
  if (!rows || !rows.length) return 0;
  var days = {};
  rows.forEach(function (r) {
    var d = r && r.updated_at; if (!d) return;
    var t = new Date(d); if (isNaN(t.getTime())) return;
    days[t.getFullYear() + '-' + t.getMonth() + '-' + t.getDate()] = true;
  });
  var keyOf = function (date) { return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(); };
  var cursor = new Date(); cursor.setHours(0, 0, 0, 0);
  if (!days[keyOf(cursor)]) { cursor.setDate(cursor.getDate() - 1); if (!days[keyOf(cursor)]) return 0; }
  var streak = 0;
  while (days[keyOf(cursor)]) { streak++; cursor.setDate(cursor.getDate() - 1); }
  return streak;
}
if (typeof window !== 'undefined') window.computeStreak = computeStreak;

// Curriculum scaffolding — a language-agnostic topic outline. The lesson CONTENT
// is generated in the target language on demand (/api/generate-content type=lesson).
var LESSON_SYLLABUS = [
  { unit:'Foundations',       level:'A1', lessons:['Greetings and introductions','Numbers, dates and time','Building basic sentences','Present tense of common verbs'] },
  { unit:'Everyday language', level:'A2', lessons:['Your daily routine','Talking about the past','Food, ordering and shopping','Asking questions and directions'] },
  { unit:'Connected speech',  level:'B1', lessons:['Describing past experiences','Future plans and intentions','Making comparisons','Linking ideas: because, although, so'] },
  { unit:'Fluency',           level:'B2', lessons:['Expressing hypotheticals','Reported speech','Opinions and argument','Formal vs. informal register'] },
];
function lessonSyllabus() { return LESSON_SYLLABUS; }
if (typeof window !== 'undefined') window.lessonSyllabus = lessonSyllabus;

// ── Per-language certified exam systems ─────────────────────────
// Each language has its own real-world exam regime: IELTS (en), DELE (es),
// JLPT (ja), DELF (fr). The Entry/Runner/Results screens render this data.
const EXAMS = {
  en: {
    name: 'IELTS Academic',
    short: 'IELTS',
    body: 'British Council · Cambridge · IDP',
    scoreLabel: 'Band',
    scoreUnit: '/9',
    bestScore: 7.5,
    nextLevel: '8.0',
    levels: ['4.0','5.0','5.5','6.0','6.5','7.0','7.5','8.0','8.5','9.0'],
    duration: '2h 45min',
    cost: '$5',
    modules: [
      { ic:'head', label:'Listening', time:'30 min',  q:40, color:'listening' },
      { ic:'book', label:'Reading',   time:'60 min',  q:40, color:'reading' },
      { ic:'pen',  label:'Writing',   time:'60 min',  q:2,  color:'writing' },
      { ic:'mic',  label:'Speaking',  time:'14 min',  q:3,  color:'speaking' },
    ],
    blurb: 'Full format exam — all 4 modules in sequence. Scored against real IELTS band descriptors.',
  },
  es: {
    name: 'DELE B2',
    short: 'DELE',
    body: 'Instituto Cervantes · official Spanish certification',
    scoreLabel: 'Apto',
    scoreUnit: '/100',
    bestScore: 72,
    nextLevel: 'C1',
    levels: ['A1','A2','B1','B2','C1','C2'],
    duration: '3h 15min',
    cost: '$5',
    modules: [
      { ic:'book', label:'Comprensión de lectura',   time:'70 min', q:36, color:'reading' },
      { ic:'head', label:'Comprensión auditiva',     time:'40 min', q:30, color:'listening' },
      { ic:'pen',  label:'Expresión escrita',        time:'80 min', q:2,  color:'writing' },
      { ic:'mic',  label:'Expresión oral',           time:'15 min', q:3,  color:'speaking' },
    ],
    blurb: 'Examen oficial DELE B2 del Instituto Cervantes — cuatro pruebas, dos sesiones, calificación apto/no apto.',
  },
  ja: {
    name: 'JLPT N4',
    short: 'JLPT',
    body: 'Japan Foundation · Japan Educational Exchanges',
    scoreLabel: 'Score',
    scoreUnit: '/180',
    bestScore: 122,
    nextLevel: 'N3',
    levels: ['N5','N4','N3','N2','N1'],
    duration: '1h 55min',
    cost: '$5',
    modules: [
      { ic:'pen',  label:'文字・語彙 (Vocab/Kanji)',   time:'25 min', q:30, color:'writing' },
      { ic:'book', label:'文法・読解 (Grammar/Reading)',time:'55 min', q:35, color:'reading' },
      { ic:'head', label:'聴解 (Listening)',           time:'35 min', q:28, color:'listening' },
    ],
    blurb: '日本語能力試験N4 — basic Japanese for everyday situations. No speaking module in JLPT.',
  },
  fr: {
    name: 'DELF B1',
    short: 'DELF',
    body: 'France Éducation international · Ministère de l\'Éducation',
    scoreLabel: 'Note',
    scoreUnit: '/100',
    bestScore: 76,
    nextLevel: 'B2',
    levels: ['A1','A2','B1','B2'],
    duration: '1h 45min + oral',
    cost: '$5',
    modules: [
      { ic:'head', label:'Compréhension de l\'oral',  time:'25 min', q:25, color:'listening' },
      { ic:'book', label:'Compréhension des écrits',  time:'35 min', q:20, color:'reading' },
      { ic:'pen',  label:'Production écrite',         time:'45 min', q:1,  color:'writing' },
      { ic:'mic',  label:'Production orale',          time:'15 min', q:3,  color:'speaking' },
    ],
    blurb: 'Diplôme d\'études en langue française B1 — délivré par le ministère français de l\'Éducation.',
  },
};
// ── langPack(code) — single source of truth for everything language-specific ──
// Pages should call langPack(code) instead of hardcoding strings/scores. New
// languages added at runtime get a sensible CEFR-style fallback automatically.
function langPack(code) {
  const ex = (typeof EXAMS !== 'undefined' && EXAMS[code]) ? EXAMS[code] : null;
  const meta = (typeof CATALOG_EXAMS !== 'undefined' && CATALOG_EXAMS[code]) ? CATALOG_EXAMS[code] : null;
  const exObj = ex || (typeof examFor === 'function' ? examFor(code) : null);

  // Per-language UI dictionary (subtitles, tutor greeting, vocab decks, etc).
  // Codes with a dedicated entry get rich content; everything else gets a
  // CEFR-styled fallback computed from exObj.
  const PACKS = {
    en: { sub:{ speaking:'Conversation, pronunciation', writing:'Essays, Task 1 + 2',  listening:'Section 1–4 practice',     reading:'Passages, T/F/NG' },        score:'7.0', scoreLabel:'Avg band', tutorGreeting:"Hello! I'm your Fluentra AI Tutor for English. What would you like to work on today?", quickPrompts:['Explain past perfect vs past simple','Idioms for IELTS Speaking','Review my Task 2 introduction','Help with -ed pronunciation'], decks:[{name:'IELTS Band 7+ Vocabulary',count:240,due:18},{name:'Academic Collocations',count:180,due:6},{name:'Phrasal Verbs',count:160,due:0}] },
    es: { sub:{ speaking:'Expresión oral',              writing:'Expresión escrita',     listening:'Comprensión auditiva',     reading:'Comprensión lectora' },     score:'72', scoreLabel:'Apto /100', tutorGreeting:"¡Hola! Soy tu tutor de IA para español. ¿En qué te ayudo hoy?", quickPrompts:['Subjuntivo presente vs imperfecto','Vocabulario para DELE B2','Revisa mi carta formal','Pronunciación de la R'], decks:[{name:'DELE B2 Vocabulario',count:220,due:14},{name:'Modismos esenciales',count:160,due:5},{name:'Conectores formales',count:120,due:0}] },
    ja: { sub:{ speaking:'会話・発音',                   writing:'文字・語彙、漢字',          listening:'聴解 (Section 1–5)',         reading:'文法・読解' },             score:'122', scoreLabel:'Score /180', tutorGreeting:"こんにちは！日本語のAIチューターです。今日は何を勉強しますか？", quickPrompts:['Difference between は and が','N4 vocabulary review','Check my self-introduction','Practice keigo'], decks:[{name:'JLPT N4 Vocabulary',count:300,due:22},{name:'Common Kanji (N4)',count:200,due:8},{name:'Daily Phrases',count:140,due:0}] },
    fr: { sub:{ speaking:'Production orale',             writing:'Production écrite',     listening:"Compréhension de l'oral",   reading:'Compréhension des écrits' }, score:'76', scoreLabel:'Note /100', tutorGreeting:"Bonjour ! Je suis votre tuteur IA pour le français. Que voulez-vous travailler aujourd'hui ?", quickPrompts:['Subjonctif vs indicatif','Connecteurs DELF B2','Corrige mon essai','Liaison et enchaînement'], decks:[{name:'DELF B2 Vocabulaire',count:220,due:16},{name:'Expressions idiomatiques',count:160,due:4},{name:'Connecteurs logiques',count:110,due:0}] },
    de: { sub:{ speaking:'Sprechen, Aussprache',         writing:'Schreiben, Aufsätze',    listening:'Hören, Übungen',           reading:'Lesen, Texte' },           score:'72', scoreLabel:'Punkte /100', tutorGreeting:"Hallo! Ich bin dein Deutsch-AI-Tutor. Woran möchtest du heute arbeiten?", quickPrompts:['Akkusativ vs Dativ','Goethe B1 Wortschatz','Korrigier meinen Forumsbeitrag','Aussprache von ch'], decks:[{name:'Goethe B1 Wortschatz',count:220,due:14},{name:'Trennbare Verben',count:180,due:6},{name:'Konnektoren',count:120,due:0}] },
    it: { sub:{ speaking:'Produzione orale',             writing:'Produzione scritta',    listening:'Comprensione orale',        reading:'Comprensione scritta' },   score:'70', scoreLabel:'Punti /100', tutorGreeting:"Ciao! Sono il tuo tutor di italiano. Su cosa vuoi lavorare oggi?", quickPrompts:['Congiuntivo vs indicativo','Vocabolario CILS B1','Correggi la mia lettera','Pronuncia delle doppie'], decks:[{name:'CILS B1 Vocabolario',count:200,due:12},{name:'Modi di dire',count:150,due:4},{name:'Connettivi',count:110,due:0}] },
    pt: { sub:{ speaking:'Expressão oral',               writing:'Produção escrita',      listening:'Compreensão oral',          reading:'Compreensão de leitura' }, score:'74', scoreLabel:'Pontos /100', tutorGreeting:"Olá! Sou seu tutor de IA para português. No que vamos trabalhar hoje?", quickPrompts:['Pretérito perfeito vs imperfeito','Vocabulário CELPE-Bras','Revise minha redação','Pronúncia do R'], decks:[{name:'CELPE-Bras Vocabulário',count:220,due:14},{name:'Expressões idiomáticas',count:160,due:5},{name:'Conectores',count:120,due:0}] },
    ko: { sub:{ speaking:'말하기 연습',                   writing:'쓰기 연습',              listening:'듣기 (Section 1–4)',         reading:'읽기 (TOPIK)' },           score:'78', scoreLabel:'점수 /100', tutorGreeting:"안녕하세요! 저는 한국어 AI 튜터입니다. 오늘 무엇을 공부하고 싶으세요?", quickPrompts:['은/는 vs 이/가','TOPIK II 어휘','짧은 글짓기 검토','받침 발음'], decks:[{name:'TOPIK II 어휘',count:240,due:18},{name:'한국어 관용구',count:160,due:6},{name:'연결어미',count:120,due:0}] },
    zh: { sub:{ speaking:'口语 / 发音',                   writing:'书写 / 汉字',            listening:'听力 (HSK)',                 reading:'阅读 (HSK)' },             score:'78', scoreLabel:'分数 /100', tutorGreeting:"你好！我是你的中文 AI 辅导员。今天想学什么？", quickPrompts:['了 的两种用法','HSK 4 词汇','修改我的短文','声调练习'], decks:[{name:'HSK 4 词汇',count:600,due:24},{name:'常用成语',count:180,due:6},{name:'连接词',count:120,due:0}] },
    ar: { sub:{ speaking:'محادثة، نطق',                  writing:'كتابة، إنشاء',          listening:'استماع',                     reading:'قراءة، فهم' },             score:'70', scoreLabel:'النتيجة /100', tutorGreeting:"مرحباً! أنا مدرسك الذكي للعربية. ماذا تريد أن تتعلم اليوم؟", quickPrompts:['الإعراب الأساسي','مفردات ALPT','صحح رسالتي','نطق الحروف'], decks:[{name:'مفردات ALPT',count:220,due:14},{name:'أمثال شائعة',count:160,due:4},{name:'أدوات الربط',count:120,due:0}] },
    ru: { sub:{ speaking:'Говорение',                    writing:'Письмо',                listening:'Аудирование',                reading:'Чтение' },                 score:'72', scoreLabel:'Баллы /100', tutorGreeting:"Привет! Я ваш AI-репетитор русского. Над чем будем работать?", quickPrompts:['Падежи: винительный vs родительный','Лексика TORFL B1','Проверь мой текст','Произношение Ы'], decks:[{name:'TORFL B1 Лексика',count:240,due:16},{name:'Идиомы',count:150,due:5},{name:'Связки',count:120,due:0}] },
    hi: { sub:{ speaking:'बोलना, उच्चारण',                writing:'लेखन',                   listening:'सुनना',                       reading:'पठन' },                    score:'70', scoreLabel:'अंक /100', tutorGreeting:"नमस्ते! मैं आपका हिंदी AI ट्यूटर हूं। आज क्या सीखना चाहेंगे?", quickPrompts:['ने का प्रयोग','HPT शब्दावली','मेरा निबंध जांचें','उच्चारण अभ्यास'], decks:[{name:'HPT B1 शब्दावली',count:200,due:12},{name:'मुहावरे',count:140,due:4},{name:'सम्बन्धबोधक',count:100,due:0}] },
    tr: { sub:{ speaking:'Konuşma',                      writing:'Yazma',                 listening:'Dinleme',                   reading:'Okuma' },                  score:'72', scoreLabel:'Puan /100', tutorGreeting:"Merhaba! Türkçe AI öğretmeniyim. Bugün ne çalışmak istersin?", quickPrompts:['Geniş zaman vs şimdiki','TYS B1 kelime','Yazımı düzelt','Ünlü uyumu'], decks:[{name:'TYS B1 Kelime',count:200,due:12},{name:'Deyimler',count:150,due:4},{name:'Bağlaçlar',count:110,due:0}] },
  };

  const pack = PACKS[code];
  const langName = (typeof langByCode === 'function') ? langByCode(code).english : code;
  if (pack) return { ...pack, exam: exObj, langName };

  // Generic fallback for any future language
  return {
    sub:{ speaking:`Speaking practice`, writing:`Writing practice`, listening:`Listening practice`, reading:`Reading practice` },
    score: exObj?.bestScore ? String(exObj.bestScore) : 'A2',
    scoreLabel: (exObj?.scoreLabel || 'Level') + (exObj?.scoreUnit ? ' ' + exObj.scoreUnit : ''),
    tutorGreeting: `Hi! I'm your ${langName} AI Tutor. What would you like to work on today?`,
    quickPrompts: [`${langName} grammar basics`, `Vocabulary for ${exObj?.short || 'CEFR'}`, 'Review my writing', 'Pronunciation drills'],
    decks: [{name:`${langName} Core Vocabulary`,count:200,due:12},{name:`${langName} Phrasebook`,count:140,due:4},{name:`${langName} Connectors`,count:100,due:0}],
    exam: exObj,
    langName,
  };
}

function examFor(code) {
  if (EXAMS[code]) return EXAMS[code];
  // Generic CEFR-style fallback for languages without a dedicated exam config
  const meta = CATALOG_EXAMS[code];
  return {
    name: meta?.name || 'Proficiency Test',
    short: meta?.short || 'CEFR',
    body: meta?.body || 'Standardised CEFR-aligned assessment',
    scoreLabel: 'Level',
    scoreUnit: '',
    bestScore: 'A2',
    nextLevel: 'B1',
    levels: ['A1','A2','B1','B2','C1','C2'],
    duration: '2h 30min',
    cost: '$5',
    modules: [
      { ic:'head', label:'Listening', time:'30 min', q:30, color:'listening' },
      { ic:'book', label:'Reading',   time:'45 min', q:25, color:'reading' },
      { ic:'pen',  label:'Writing',   time:'45 min', q:2,  color:'writing' },
      { ic:'mic',  label:'Speaking',  time:'12 min', q:3,  color:'speaking' },
    ],
    blurb: `Mock ${meta?.name || 'CEFR'} exam — same four-skill format used by official exam bodies. We're working with the certifying body to bring the real exam in-app soon.`,
  };
}

// Lightweight per-catalog metadata so examFor() and other lookups can name
// the right body and short code for the 8 add-on languages.
const CATALOG_EXAMS = {
  de: { name: 'Goethe-Zertifikat B1', short: 'Goethe',  body: 'Goethe-Institut · Munich' },
  it: { name: 'CILS B1',               short: 'CILS',    body: 'Università per Stranieri di Siena' },
  pt: { name: 'CELPE-Bras Intermediário', short: 'CELPE', body: 'Inep · Ministério da Educação do Brasil' },
  ko: { name: 'TOPIK II',              short: 'TOPIK',   body: 'National Institute for International Education' },
  zh: { name: 'HSK 4',                 short: 'HSK',     body: 'Chinese Testing International (Hanban)' },
  ar: { name: 'ALPT B1',               short: 'ALPT',    body: 'Arabic Language Proficiency Test · Arab League' },
  ru: { name: 'TORFL B1',              short: 'TORFL',   body: 'Pushkin State Russian Language Institute' },
  hi: { name: 'Hindi Proficiency B1',  short: 'HPT',     body: 'Central Hindi Directorate' },
  tr: { name: 'TYS B1',                short: 'TYS',     body: 'Yunus Emre Institute · Turkey' },
};

// ── User ──────────────────────────────────────────────────────
const USER = {
  get name()    { return (window.__user && window.__user.name) || 'there'; },
  get email()   { return (window.__user && window.__user.email) || ''; },
  get initial() { var n = (window.__user && (window.__user.firstName || window.__user.name)) || ''; return n ? n.charAt(0).toUpperCase() : '·'; },
  get plan()    { var p = (window.__user && window.__user.plan) || 'free'; return p.charAt(0).toUpperCase() + p.slice(1); },
  get renewsOn(){ return (window.__user && window.__user.renewsOn) || ''; },
  get streak()  { return (window.__user && window.__user.streak) || 0; },
  get xp()      { return (window.__user && window.__user.xp) || 0; },
  get joinedDays()     { return (window.__user && window.__user.joinedDays) || 0; },
  get totalSessions()  { return (window.__user && window.__user.totalSessions) || 0; },
  get totalMinutes()   { return (window.__user && window.__user.totalMinutes) || 0; },
};

// ── Hand-rolled flags (placeholder — repo has FlagSVG) ────────
function Avatar({ initials='M', size=32, bg='#A06940', style={} }) {
  return (
    <div style={{ width:size, height:size, borderRadius:size/2, background:bg, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:size*0.4, flexShrink:0, ...style }}>
      {initials}
    </div>
  );
}
function Flag({ code, w=24, h=16, radius=3 }) {
  const wrap = (children) => (
    <div style={{ width:w, height:h, borderRadius:radius, overflow:'hidden', flexShrink:0, boxShadow:'inset 0 0 0 1px rgba(0,0,0,.05)' }}>
      <svg viewBox="0 0 3 2" width={w} height={h} preserveAspectRatio="none">{children}</svg>
    </div>
  );
  switch (code) {
    case 'es': return wrap(<><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></>);
    case 'ja': return wrap(<><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r=".6" fill="#BC002D"/></>);
    case 'fr': return wrap(<><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></>);
    case 'de': return wrap(<><rect width="3" height=".667" fill="#000"/><rect y=".667" width="3" height=".667" fill="#DD0000"/><rect y="1.334" width="3" height=".666" fill="#FFCE00"/></>);
    case 'it': return wrap(<><rect width="1" height="2" fill="#009246"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#CE2B37"/></>);
    case 'pt': return wrap(<><rect width="1.2" height="2" fill="#046A38"/><rect x="1.2" width="1.8" height="2" fill="#DA291C"/><circle cx="1.2" cy="1" r=".35" fill="#FFE15A"/></>);
    case 'ko': return wrap(<><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r=".4" fill="#0047A0"/><path d="M1.1 1 a.4.4 0 0 1 .8 0 a.2.2 0 0 1 -.4 0 a.2.2 0 0 0 -.4 0z" fill="#CD2E3A"/></>);
    case 'zh': return wrap(<><rect width="3" height="2" fill="#DE2910"/><polygon points=".4,.4 .5,.6 .7,.6 .55,.75 .6,.95 .4,.85 .2,.95 .25,.75 .1,.6 .3,.6" fill="#FFDE00"/></>);
    case 'ar': return wrap(<><rect width="3" height=".667" fill="#000"/><rect y=".667" width="3" height=".667" fill="#fff"/><rect y="1.334" width="3" height=".666" fill="#007A3D"/><polygon points="0,0 .8,1 0,2" fill="#CE1126"/></>);
    case 'ru': return wrap(<><rect width="3" height=".667" fill="#fff"/><rect y=".667" width="3" height=".667" fill="#0039A6"/><rect y="1.334" width="3" height=".666" fill="#D52B1E"/></>);
    case 'hi': return wrap(<><rect width="3" height=".667" fill="#FF9933"/><rect y=".667" width="3" height=".667" fill="#fff"/><rect y="1.334" width="3" height=".666" fill="#138808"/><circle cx="1.5" cy="1" r=".18" fill="none" stroke="#000080" strokeWidth=".04"/></>);
    case 'tr': return wrap(<><rect width="3" height="2" fill="#E30A17"/><circle cx="1.1" cy="1" r=".35" fill="#fff"/><circle cx="1.18" cy="1" r=".28" fill="#E30A17"/><polygon points="1.45,1 1.7,.92 1.55,1.05 1.7,1.18 1.5,1.1 1.42,1.25 1.4,1.07" fill="#fff"/></>);
    case 'en': return (
      <div style={{ width:w, height:h, borderRadius:radius, overflow:'hidden', flexShrink:0, boxShadow:'inset 0 0 0 1px rgba(0,0,0,.05)' }}>
        <svg viewBox="0 0 60 30" width={w} height={h} preserveAspectRatio="none">
          <clipPath id={`f-${Math.random()}`}><rect width="60" height="30"/></clipPath>
          <rect width="60" height="30" fill="#012169"/>
          <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6"/>
          <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
        </svg>
      </div>
    );
    // Tier 2 — CEFR languages
    case 'nl': return wrap(<><rect width="3" height=".667" fill="#AE1C28"/><rect y=".667" width="3" height=".667" fill="#fff"/><rect y="1.334" width="3" height=".666" fill="#21468B"/></>);
    case 'sv': return wrap(<><rect width="3" height="2" fill="#006AA7"/><rect x="0" y=".75" width="3" height=".5" fill="#FECC00"/><rect x="1" y="0" width=".5" height="2" fill="#FECC00"/></>);
    case 'no': return wrap(<><rect width="3" height="2" fill="#EF2B2D"/><rect x="0" y=".75" width="3" height=".5" fill="#fff"/><rect x="1" y="0" width=".5" height="2" fill="#fff"/><rect x="0" y=".83" width="3" height=".34" fill="#002868"/><rect x="1.08" y="0" width=".34" height="2" fill="#002868"/></>);
    case 'da': return wrap(<><rect width="3" height="2" fill="#C8102E"/><rect x="0" y=".83" width="3" height=".34" fill="#fff"/><rect x="1" y="0" width=".34" height="2" fill="#fff"/></>);
    case 'fi': return wrap(<><rect width="3" height="2" fill="#fff"/><rect x="0" y=".83" width="3" height=".34" fill="#003580"/><rect x="1" y="0" width=".34" height="2" fill="#003580"/></>);
    case 'pl': return wrap(<><rect width="3" height="1" fill="#fff"/><rect y="1" width="3" height="1" fill="#DC143C"/></>);
    case 'cs': return wrap(<><rect width="3" height="1" fill="#fff"/><rect y="1" width="3" height="1" fill="#D7141A"/><polygon points="0,0 1.2,1 0,2" fill="#11457E"/></>);
    case 'el': return wrap(<><rect width="3" height="2" fill="#fff"/><rect y=".25" width="3" height=".25" fill="#0D5EAF"/><rect y=".75" width="3" height=".25" fill="#0D5EAF"/><rect y="1.25" width="3" height=".25" fill="#0D5EAF"/><rect y="1.75" width="3" height=".25" fill="#0D5EAF"/><rect width="1" height="1" fill="#0D5EAF"/></>);
    case 'he': return wrap(<><rect width="3" height="2" fill="#fff"/><rect y=".15" width="3" height=".15" fill="#0E5BA8"/><rect y="1.7" width="3" height=".15" fill="#0E5BA8"/><polygon points="1.5,.6 1.7,.95 1.5,1.3 1.3,.95" fill="none" stroke="#0E5BA8" strokeWidth=".08"/></>);
    case 'th': return wrap(<><rect width="3" height="2" fill="#A51931"/><rect y=".33" width="3" height="1.34" fill="#F4F5F8"/><rect y=".67" width="3" height=".66" fill="#2D2A4A"/></>);
    case 'vi': return wrap(<><rect width="3" height="2" fill="#DA251D"/><polygon points="1.5,.6 1.65,1.05 2.1,1.05 1.7,1.3 1.85,1.75 1.5,1.45 1.15,1.75 1.3,1.3 .9,1.05 1.35,1.05" fill="#FFFF00"/></>);
    case 'id': return wrap(<><rect width="3" height="1" fill="#CE1126"/><rect y="1" width="3" height="1" fill="#fff"/></>);
    case 'uk': return wrap(<><rect width="3" height="1" fill="#005BBB"/><rect y="1" width="3" height="1" fill="#FFD500"/></>);
    case 'ro': return wrap(<><rect width="1" height="2" fill="#002B7F"/><rect x="1" width="1" height="2" fill="#FCD116"/><rect x="2" width="1" height="2" fill="#CE1126"/></>);
    case 'hu': return wrap(<><rect width="3" height=".667" fill="#CE2939"/><rect y=".667" width="3" height=".667" fill="#fff"/><rect y="1.334" width="3" height=".666" fill="#436F4D"/></>);
    // Tier 3 — colored stripe fallback using accent
    default: {
      // Hash code to two colors; render a 3-band stripe so every flag looks distinct
      const palettes = {
        sw:['#007A33','#000','#FFD100'], fa:['#239F40','#fff','#DA0000'], ur:['#01411C','#fff','#01411C'],
        bn:['#006A4E','#F42A41','#006A4E'], ta:['#C8102E','#fff','#000'], te:['#FF9933','#fff','#138808'],
        mr:['#FF6B35','#fff','#138808'], gu:['#138808','#fff','#FF9933'], ml:['#1F8A6C','#fff','#1F8A6C'],
        kn:['#D62828','#fff','#FFD000'], pa:['#FF6F00','#fff','#138808'], tl:['#0038A8','#fff','#CE1126'],
        ms:['#CC0001','#fff','#0033A0'], my:['#FECB00','#34B233','#EE2737'], km:['#032EA1','#E00025','#fff'],
        mn:['#C4272F','#0066B3','#C4272F'], ne:['#DC143C','#003893','#DC143C'], si:['#FFB000','#00534E','#8D153A'],
        is:['#02529C','#fff','#DC1E35'], ga:['#169B62','#fff','#FF883E'], cy:['#fff','#00AB39','#D30731'],
        gd:['#0065BD','#fff','#0065BD'], eu:['#CE0F26','#009639','#fff'], ca:['#FCDD09','#DA121A','#FCDD09'],
        gl:['#fff','#0072CE','#fff'], sq:['#E41E20','#000','#E41E20'], sr:['#C6363C','#0C4076','#fff'],
        hr:['#171796','#fff','#171796'], sk:['#fff','#0B4EA2','#EE1C25'], sl:['#fff','#005DA4','#ED1C24'],
        bg:['#fff','#00966E','#D62612'], lv:['#9E1C32','#fff','#9E1C32'], lt:['#FDB913','#006A44','#C1272D'],
        et:['#0072CE','#000','#fff'], mt:['#fff','#CF142B','#fff'], af:['#007749','#fff','#FFB81C'],
        zu:['#000','#fff','#007A4D'], xh:['#007A4D','#fff','#FFB81C'], yo:['#008751','#fff','#008751'],
        ig:['#008751','#fff','#008751'], ha:['#008751','#fff','#008751'], am:['#078930','#FCDD09','#DA121A'],
        ka:['#fff','#FF0000','#fff'], hy:['#D90012','#0033A0','#FF9C00'], az:['#00B5E2','#ED2939','#509E2F'],
        kk:['#00ABC9','#FEC50C','#00ABC9'], uz:['#1EB53A','#fff','#0099B5'], ky:['#E8112D','#FFEF00','#E8112D'],
        tg:['#CC0000','#fff','#006600'], eo:['#089100','#fff','#089100'], la:['#7C2D12','#FFD700','#7C2D12'],
        sa:['#FF9933','#fff','#FF9933'], qu:['#D90000','#FFD700','#D90000'], haw:['#CE1126','#fff','#0033A0'],
        mi:['#000','#CE1126','#fff'], sm:['#0033A0','#CE1126','#0033A0'], to:['#fff','#C10000','#fff'],
        jv:['#A91827','#fff','#A91827'], su:['#FFB81C','#fff','#FFB81C'], lo:['#CE1126','#0033A0','#CE1126'],
        ps:['#000','#D32011','#009A17'], so:['#418FDE','#fff','#418FDE'], rw:['#00A1DE','#FAD201','#20603D'],
      };
      const p = palettes[code] || ['#bbb','#fff','#bbb'];
      return wrap(<><rect width="3" height=".667" fill={p[0]}/><rect y=".667" width="3" height=".667" fill={p[1]}/><rect y="1.334" width="3" height=".666" fill={p[2]}/></>);
    }
  }
}

// ── Icons ─────────────────────────────────────────────────────
const sw = { fill:'none', stroke:'currentColor', strokeWidth:2, strokeLinecap:'round', strokeLinejoin:'round' };
const Icon = {
  flame: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M12 2c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z"/><path d="M12 10c0 0-2 2-2 4a2 2 0 004 0c0-2-2-4-2-4z"/></svg>,
  arrow: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  arrowL:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  mic:   (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>,
  pen:   (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>,
  book:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  head:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
  check: (p={}) => <svg width="12" height="12" viewBox="0 0 24 24" {...sw} strokeWidth="3" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  chev:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polyline points="9 18 15 12 9 6"/></svg>,
  chevD: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polyline points="6 9 12 15 18 9"/></svg>,
  chevU: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polyline points="18 15 12 9 6 15"/></svg>,
  plus:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  x:     (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  bell:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  search:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  home:  (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" {...sw} {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  bars:  (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" {...sw} {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  user:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  users: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  spark: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2L13.5 8.5 20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/></svg>,
  // Fluentra brand mark — overlapping arcs ("flowing tongue" / language curves)
  brandmark: (p={}) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 17c0-5 3-8 7-8s7 3 7 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/><path d="M5 12c0-5 3-8 7-8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity=".55"/><circle cx="12" cy="20" r="1.6" fill="currentColor"/></svg>,
  // Per-language "add" icon — globe with tiny arc (replaces generic +)
  addLang: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="7"/><path d="M4 11h14M11 4c2.5 2 2.5 12 0 14M11 4c-2.5 2-2.5 12 0 14"/><path d="M19 17l3 3M19 20l3-3" stroke="currentColor" strokeWidth="1.6"/></svg>,
  cog:   (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  help:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  signOut:(p={})=> <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  cal:   (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  clock: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  trophy:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M6 9V2h12v7M6 9a4 4 0 008 0M6 9H2v3a4 4 0 004 4M18 9h4v3a4 4 0 01-4 4M9 22h6M12 16v6"/></svg>,
  play:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  pause: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  filter:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  star:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  bookmark:(p={})=>  <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>,
  trending:(p={})=> <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
  download:(p={})=> <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  edit:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  globe: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  shield:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  card:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  refresh:(p={})=> <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  lock:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  eye:   (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  layers:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
  more:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  message:(p={})=> <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  send:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  bookOpen:(p={})=> <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2zM22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>,
  award: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" {...sw} {...p}><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
};

// ── Ring (circular progress) ──────────────────────────────────
function Ring({ pct, size=140, stroke=10, color='#C04A06', trackColor='#F2F2F2', children }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const offset = C - (Math.min(pct,100)/100) * C;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} style={{ transition:'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
    </div>
  );
}

// ── Common shells ─────────────────────────────────────────────
function PhoneFrame({ children, scale=1, dark=false, statusBarStyle='dark' }) {
  const W = 390, H = 780;
  return (
    <div style={{ width:W*scale, height:H*scale, background:'#000', borderRadius:54*scale, padding:8*scale, boxShadow:'0 30px 80px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.04)' }}>
      <div style={{ width:'100%', height:'100%', background: dark ? '#000' : T.bg, borderRadius:46*scale, overflow:'hidden', position:'relative' }}>
        <div style={{ position:'absolute', top:12*scale, left:'50%', transform:'translateX(-50%)', width:120*scale, height:34*scale, background:'#000', borderRadius:20*scale, zIndex:100 }}/>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:54*scale, display:'flex', alignItems:'center', justifyContent:'space-between', padding:`0 ${28*scale}px`, fontSize:14*scale, fontWeight:600, color: statusBarStyle==='light' ? '#fff' : '#000', zIndex:50 }}>
          <span>9:41</span>
          <span style={{ width:120*scale }}/>
          <span style={{ display:'flex', alignItems:'center', gap:4*scale }}>
            <svg width={16*scale} height={10*scale} viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" y="0" width="3" height="10" rx="1"/></svg>
            <svg width={22*scale} height={10*scale} viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x=".5" y=".5" width="18" height="9" rx="2"/><rect x="2" y="2" width="15" height="6" fill="currentColor"/><rect x="19.5" y="3.5" width="1.5" height="3" fill="currentColor"/></svg>
          </span>
        </div>
        <div style={{ position:'absolute', inset:0, paddingTop:54*scale }}>
          {children}
        </div>
        <div style={{ position:'absolute', bottom:8*scale, left:'50%', transform:'translateX(-50%)', width:134*scale, height:5*scale, background: statusBarStyle==='light' ? '#fff' : '#000', borderRadius:3*scale, zIndex:60 }}/>
      </div>
    </div>
  );
}

// Phone tab bar — used across all (tabs)/* screens
function PhoneTabBar({ active='home', onNav=()=>{} }) {
  const tabs = [
    { id:'home',     label:'Home',     ic:'home' },
    { id:'practice', label:'Practice', ic:'play' },
    { id:'progress', label:'Progress', ic:'bars' },
    { id:'profile',  label:'Profile',  ic:'user' },
  ];
  return (
    <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'rgba(249,248,245,.95)', backdropFilter:'blur(12px)', borderTop:`1px solid ${T.border}`, display:'flex', alignItems:'flex-start', justifyContent:'space-around', padding:'12px 30px 0', zIndex:40 }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onNav(t.id)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, color: active === t.id ? T.ink : T.ink5, background:'none' }}>
          {Icon[t.ic]({ width:22, height:22 })}
          <span style={{ fontSize:10, fontWeight:600 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// Phone header — title + optional back / right action
function PhoneHeader({ title, back=false, onBack, right=null, subtle=false }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px 12px', minHeight:44 }}>
      {back && (
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, background: subtle ? T.card : T.bg2, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2 }}>
          {Icon.arrowL()}
        </button>
      )}
      <div style={{ flex:1, fontSize:15, fontWeight:700, color:T.ink, textAlign: back ? 'left' : 'left', marginLeft: back ? 4 : 0 }}>{title}</div>
      {right}
    </div>
  );
}

// Section header with optional eyebrow + action
function SectionHead({ eyebrow, title, action, level=1 }) {
  const titleSize = level === 0 ? 34 : level === 1 ? 22 : 17;
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: level === 0 ? 20 : 12 }}>
      <div>
        {eyebrow && <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>{eyebrow}</div>}
        <div style={{ fontFamily: level <= 1 ? T.serif : T.sans, fontSize:titleSize, fontWeight: level <= 1 ? 400 : 700, color:T.ink, lineHeight:1.1 }}>{title}</div>
      </div>
      {action}
    </div>
  );
}

// Surface card
function Card({ children, style={}, padding=16, accent, ...rest }) {
  return (
    <div {...rest} style={{ background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur, border:`1px solid ${T.glassBorder}`, borderRadius:16, boxShadow:T.glassShadow, padding, ...(accent ? { borderTop:`3px solid ${accent}` } : {}), ...style }}>
      {children}
    </div>
  );
}

// Pill button
function Btn({ label, onClick, nav, variant='primary', accent=T.brand, size='md', icon, iconRight, fullWidth=false, style={} }) {
  const sizes = { sm:{p:'6px 12px',fs:12}, md:{p:'10px 16px',fs:13}, lg:{p:'14px 20px',fs:14.5} };
  const s = sizes[size];
  const bg  = variant === 'primary' ? accent : variant === 'soft' ? `${accent}1a` : 'transparent';
  const fg  = variant === 'primary' ? '#fff' : accent;
  const bd  = variant === 'outline' ? `1.5px solid ${accent}` : 'none';
  const handleClick = (e) => {
    if (onClick) {
      // Stop the App-level data-nav delegate from also firing
      if (e && e.stopPropagation) e.stopPropagation();
      return onClick(e);
    }
    if (nav && window.__nav) window.__nav(nav);
  };
  return (
    <button onClick={handleClick} {...(nav && !onClick ? { 'data-nav': nav } : {})} style={{ padding:s.p, background:bg, color:fg, border:bd, borderRadius:10, fontSize:s.fs, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', width: fullWidth ? '100%' : 'auto', transition:'opacity .15s', ...style }}
      onMouseDown={e => e.currentTarget.style.opacity = '.85'}
      onMouseUp={e => e.currentTarget.style.opacity = '1'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
      {icon}{label}{iconRight}
    </button>
  );
}

// Small chip
function Chip({ label, accent=T.ink3, bg=T.bg2, icon, style={} }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 10px', borderRadius:99, background:bg, color:accent, fontSize:11, fontWeight:700, letterSpacing:'.04em', ...style }}>
      {icon}{label}
    </div>
  );
}

// Progress bar
function Bar({ pct, color=T.brand, track=T.trackWarm, height=4 }) {
  return (
    <div style={{ height, background:track, borderRadius:99, overflow:'hidden' }}>
      <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:99, transition:'width .4s' }}/>
    </div>
  );
}

// Helpers
function langTheme(code) { return T[code] || { bg:T.bg2, accent:T.ink, accentLight:T.bg2 }; }

// Browser-native text-to-speech (no backend). flSpeak('hola','es') -> speaks it.
// Real microphone recording for "Tap to record" buttons (MediaRecorder).
// Returns { recording, time, done, toggle } — the button toggles record/stop
// and shows a live timer; the captured audio blob is kept on the ref.
// Keep recordings small (speech only) so the base64 body stays well under the 4.5MB
// request limit even at 45s: Opus @ 32kbps is ~4KB/s -> ~180KB for 45s.
function _recorderOpts() {
  try {
    var t = 'audio/webm;codecs=opus';
    if (typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) {
      return { mimeType: t, audioBitsPerSecond: 32000 };
    }
  } catch (e) {}
  return {};
}

function useMicRecorder() {
  const [recording, setRecording] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const ref = React.useRef({ rec: null, chunks: [], iv: null, blob: null });
  const stop = React.useCallback(function () {
    const st = ref.current;
    try { if (st.rec && st.rec.state !== 'inactive') st.rec.stop(); } catch (e) {}
    if (st.iv) { clearInterval(st.iv); st.iv = null; }
    setRecording(false);
  }, []);
  const toggle = React.useCallback(function () {
    const st = ref.current;
    if (st.rec && st.rec.state === 'recording') { stop(); setDone(true); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      alert('Recording is not supported on this browser.'); return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      const mr = new MediaRecorder(stream, _recorderOpts());
      st.rec = mr; st.chunks = [];
      mr.ondataavailable = function (e) { if (e.data && e.data.size) st.chunks.push(e.data); };
      mr.onstop = function () {
        try { st.blob = new Blob(st.chunks, { type: 'audio/webm' }); } catch (e) {}
        stream.getTracks().forEach(function (t) { t.stop(); });
      };
      mr.start();
      setSeconds(0); setDone(false); setRecording(true);
      st.iv = setInterval(function () { setSeconds(function (s) { return s + 1; }); }, 1000);
    }).catch(function () { alert('Microphone permission is needed to record your answer.'); });
  }, [stop]);
  React.useEffect(function () { return function () { stop(); }; }, [stop]);
  const m = Math.floor(seconds / 60), s = seconds % 60;
  const time = m + ':' + (s < 10 ? '0' + s : s);
  const getBase64 = function () { return new Promise(function (resolve) { var b = ref.current.blob; if (!b) return resolve(null); var fr = new FileReader(); fr.onloadend = function () { var d = String(fr.result || ''); resolve(d.indexOf(',') >= 0 ? d.split(',')[1] : null); }; fr.onerror = function () { resolve(null); }; fr.readAsDataURL(b); }); };
  return { recording: recording, seconds: seconds, time: time, done: done, toggle: toggle, getBase64: getBase64 };
}

function flSpeak(text, code) {
  if (typeof window === 'undefined' || !window.speechSynthesis || !text) return false;
  var map = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-PT', ja:'ja-JP', zh:'zh-CN', ko:'ko-KR', ru:'ru-RU', ar:'ar-SA', hi:'hi-IN', nl:'nl-NL', pl:'pl-PL', tr:'tr-TR', sv:'sv-SE' };
  try {
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text));
    u.lang = map[code] || (code ? code + '-' + String(code).toUpperCase() : 'en-US');
    u.rate = 0.92;
    var voices = window.speechSynthesis.getVoices() || [];
    var pref = u.lang.toLowerCase().slice(0, 2);
    var v = voices.filter(function (vo) { return vo.lang && vo.lang.toLowerCase().indexOf(pref) === 0; })[0];
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
    return true;
  } catch (e) { return false; }
}
if (typeof window !== 'undefined') window.flSpeak = flSpeak;

// ── Real module content: fetch from /api/generate-content, normalise to the
// shape the session screens expect, cache per skill+lang. _normSession merges
// over the static template so all labels/format stay intact. ──────────────
function _normSession(skill, raw) {
  if (!raw || typeof raw !== 'object') return null;
  if (skill === 'reading' || skill === 'listening') {
    var qs = raw.questions;
    if (!raw.passage || !Array.isArray(qs) || !qs.length) return null;
    return {
      title: raw.title || (skill === 'reading' ? 'Reading' : 'Listening'),
      cardTitle: raw.title || null,
      passage: raw.passage,
      passageLabel: skill === 'listening' ? 'Transcript' : 'Passage',
      qLabel: 'Questions 1\u2013' + qs.length,
      questions: qs.map(function (q, i) { return { n: i + 1, type: 'Multiple Choice', stem: q.q || q.stem || '', options: q.options || null, answer: (typeof q.answer === 'number' ? q.answer : undefined) }; }),
      placeholder: 'Type your answer\u2026',
      submit: 'Submit & get feedback',
      __real: true,
    };
  }
  if (skill === 'speaking') {
    var parts = raw.parts;
    if (!Array.isArray(parts) || !parts.length) return null;
    var p2 = null, i;
    for (i = 0; i < parts.length; i++) { if (parts[i].n === 2) { p2 = parts[i]; break; } }
    if (!p2) p2 = parts[1] || parts[0];
    var fu = [];
    parts.forEach(function (x) { if (x !== p2) { var t = x.prompt || x.desc || x.label; if (t) fu.push(t); } });
    return { title: raw.title || 'Speaking', partLabel: p2.label || 'Part 2', prompt: p2.prompt || p2.desc || '', followups: fu, submit: 'Submit', __real: true };
  }
  if (skill === 'writing') {
    if (!raw.task1 && !raw.task2) return null;
    return {
      task1Title: 'Task 1', task2Title: 'Task 2',
      task1Meta: (raw.min_words ? ('~' + raw.min_words + ' words') : '150 words'),
      task2Meta: (raw.time_minutes ? (raw.time_minutes + ' min') : '250 words'),
      task1Prompt: (raw.task1 && raw.task1.prompt) || '',
      task2Intro: '', task2Topic: (raw.task2 && raw.task2.prompt) || (raw.task1 && raw.task1.prompt) || '', task2Outro: '',
      task1Tips: [], task2Tips: [], submit: 'Submit & get feedback', tipsLabel: 'Tips', __real: true,
    };
  }
  return null;
}

function useGenContent(skill) {
  var c = (typeof window !== 'undefined' && window.__langCode) || 'en';
  var key = skill + '_' + c;
  if (typeof window !== 'undefined') window.__sessionGen = window.__sessionGen || {};
  var st = React.useState((typeof window !== 'undefined' && window.__sessionGen[key]) || null);
  var v = st[0], setV = st[1];
  React.useEffect(function () {
    if (typeof window === 'undefined') return;
    if (window.__sessionGen[key]) { setV(window.__sessionGen[key]); return; }
    var cancelled = false;
    fetch('/api/generate-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: c, type: skill, difficulty: 'medium' }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (cancelled) return;
        var raw = d && d.content && d.content.payload;
        var over = _normSession(skill, raw);
        if (over) {
          if (typeof window !== 'undefined') window.__genErr = null;
          var base = (typeof _sc === 'function') ? _sc(skill) : {};
          var merged = Object.assign({}, base, over);
          window.__sessionGen[key] = merged; setV(merged);
        } else {
          if (typeof window !== 'undefined') window.__genErr = (d && d.error) ? (d.error + (d.detail ? (': ' + d.detail) : '')) : 'unexpected response';
          setV('err');
        }
      })
      .catch(function (e) { if (!cancelled) { if (typeof window !== 'undefined') window.__genErr = 'network: ' + String(e && e.message || e); setV('err'); } });
    return function () { cancelled = true; };
  }, [key]);
  return v; // null = loading, 'err' = use static fallback, object = real content
}
if (typeof window !== 'undefined') { window.useGenContent = useGenContent; window._normSession = _normSession; }

function MGenLoading(props) {
  var color = (props && props.color) || T.brand;
  var skill = (props && props.skill) || 'content';
  var nice = skill.charAt(0).toUpperCase() + skill.slice(1);
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:T.ink, color:'#fff', padding:'30px 24px', textAlign:'center' }}>
      <div style={{ position:'relative', width:110, height:110, marginBottom:26 }}>
        <div style={{ position:'absolute', inset:0, borderRadius:55, border:`1.5px solid ${color}`, opacity:.3, animation:'flGenRing 2.4s ease-out infinite' }}/>
        <div style={{ position:'absolute', inset:14, borderRadius:41, border:`1.5px solid ${color}`, opacity:.5, animation:'flGenRing 2.4s ease-out 0.5s infinite' }}/>
        <div style={{ position:'absolute', inset:26, borderRadius:29, background:`radial-gradient(circle, ${color} 0%, ${color}55 50%, transparent 70%)`, animation:'flGenPulse 1.6s ease-in-out infinite' }}/>
        <style>{`@keyframes flGenRing{0%{transform:scale(.7);opacity:.6}100%{transform:scale(1.4);opacity:0}}@keyframes flGenPulse{0%,100%{transform:scale(.92);opacity:.85}50%{transform:scale(1.05);opacity:1}}`}</style>
      </div>
      <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.18em', marginBottom:12 }}>BUILDING YOUR {nice.toUpperCase()}</div>
      <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.12, letterSpacing:'-.02em', maxWidth:260 }}>Crafting a {skill} task at your level…</div>
      <div style={{ fontSize:12, color:'rgba(255,255,255,.55)', marginTop:14, lineHeight:1.5, maxWidth:240 }}>Generating fresh content with AI. This takes a few seconds.</div>
    </div>
  );
}
if (typeof window !== 'undefined') window.MGenLoading = MGenLoading;

// Honest, non-blocking note shown ONLY when live generation failed and the
// session is falling back to a sample. window.__genErr carries the reason.
function MGenNote() {
  var err = (typeof window !== 'undefined') ? window.__genErr : null;
  if (!err) return null;
  return <div style={{ margin:'0 14px 8px', padding:'8px 11px', borderRadius:9, background:'#FBEED9', border:'1px solid #E6C58E', fontSize:11, color:'#8A5A1E', lineHeight:1.4 }}>Showing a sample for now — live AI content couldn’t be generated. Tap to retry, or check that the API key is set.</div>;
}
if (typeof window !== 'undefined') window.MGenNote = MGenNote;

Object.assign(window, {
  T, LANGUAGES, USER, Flag, Icon, Ring, EXAMS, examFor, CATALOG_EXAMS, langPack,
  userLanguages, langByCode, addUserLang, removeUserLang, STARTER_CODES,
  PhoneFrame, PhoneTabBar, PhoneHeader, SectionHead, Card, Btn, Chip, Bar, langTheme,
});
