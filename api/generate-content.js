// ── Fluentra · /api/generate-content ────────────────────────────────────────
// Generates a piece of practice content (reading / writing / vocab) for ONE
// language with Claude, tags it with that language, and saves it to the pooled
// `content` table. Because every row carries `lang`, the library/practice pages
// fetch only their own language's content.
//
// POST { lang, type, difficulty?, exam? }
//   lang       e.g. 'es' (required)
//   type       'reading' | 'writing' | 'vocab' (required)
//   difficulty 'easy' | 'medium' | 'hard'  (default 'medium')
//   exam       e.g. 'DELE' (optional, steers format)
//
// Env: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
// ─────────────────────────────────────────────────────────────────────────────

var LANG_NAMES = {
  en:'English', es:'Spanish', fr:'French', de:'German', it:'Italian', pt:'Portuguese',
  nl:'Dutch', ru:'Russian', pl:'Polish', uk:'Ukrainian', sv:'Swedish', no:'Norwegian',
  da:'Danish', fi:'Finnish', el:'Greek', cs:'Czech', ro:'Romanian', hu:'Hungarian',
  tr:'Turkish', ar:'Arabic', hi:'Hindi', zh:'Chinese (Mandarin)', ja:'Japanese',
  ko:'Korean', id:'Indonesian', vi:'Vietnamese',
};

// Per-exam OFFICIAL task-format guidance. Keyed by exam short code x section type.
// Refines the question STYLE to each real exam while keeping the same JSON shape the
// session components parse (so it never breaks the renderer). Writing keeps its own
// shape and is intentionally not specced here yet.
var EXAM_SPEC = {
  IELTS: {
    reading: 'Follow authentic IELTS Academic Reading style: an academic passage with 4-option multiple-choice items covering main idea, specific detail, inference, and vocabulary-in-context. Academic register.',
    listening: 'Follow IELTS Listening style: a natural everyday or lecture-style monologue/dialogue, with 4-option multiple-choice gist and detail questions.',
    speaking: 'Model the three IELTS Speaking parts exactly: Part 1 short familiar questions about the candidate; Part 2 a cue-card long turn (one topic to speak on for ~2 minutes); Part 3 abstract follow-up discussion linked to the Part 2 theme.',
  },
  DELE: {
    reading: 'Sigue el estilo de Comprensión de lectura del DELE: un texto auténtico (artículo, anuncio o correo) con preguntas de opción múltiple de 4 opciones.',
    listening: 'Sigue el estilo de Comprensión auditiva del DELE: un audio conversacional o informativo con preguntas de opción múltiple.',
    speaking: 'Modela la prueba de Expresión e interacción orales del DELE: tarea 1 monólogo a partir de opciones, tarea 2 descripción de una situación, tarea 3 conversación simulada.',
  },
  JLPT: {
    reading: 'Follow JLPT 言語知識・読解 style: 4-option multiple-choice items mixing 漢字読み (kanji reading), 語彙 (vocabulary in context), 文法 (grammar-form choice and sentence ordering) and 読解 (short-passage comprehension), all at the stated level.',
    listening: 'Follow JLPT 聴解 style: a natural spoken dialogue or announcement, with 4-option multiple-choice questions about the situation, key information and the speaker intent.',
  },
  DELF: {
    reading: "Suis le style de la Compréhension des écrits du DELF : un court texte authentique avec des questions à choix multiple (4 options).",
    listening: "Suis le style de la Compréhension de l'oral du DELF : un court document sonore (annonce, dialogue) avec questions à choix multiple.",
    speaking: 'Modèle la Production orale du DELF : entretien dirigé, monologue suivi, puis exercice en interaction.',
  },
  TOPIK: {
    reading: 'Follow TOPIK 읽기 style: authentic short texts (notices, articles, narratives) with 4-option multiple-choice questions on detail, purpose and ordering.',
    listening: 'Follow TOPIK 듣기 style: a natural dialogue or announcement with 4-option multiple-choice comprehension questions.',
  },
  HSK: {
    reading: 'Follow HSK 阅读 style at the level: include 选词填空 (choose the correct word for a blank) and 阅读理解 (passage comprehension), as 4-option multiple choice.',
    listening: 'Follow HSK 听力 style: short dialogues/statements with 4-option multiple-choice questions.',
  },
};
function examSpec(exam, type) {
  if (!exam) return '';
  var key = String(exam).toUpperCase();
  for (var k in EXAM_SPEC) { if (key.indexOf(k) !== -1) { return (EXAM_SPEC[k] && EXAM_SPEC[k][type]) || ''; } }
  return '';
}
// Official two-task writing format per exam (text tasks, no chart).
function WRITING_TASKS(examU) {
  if (examU.indexOf('DELE') !== -1 || examU.indexOf('SIELE') !== -1)
    return { t1: 'write an informal text (email or letter) responding to a real-life situation, as in DELE Tarea 1.', t2: 'write a formal or argumentative text giving and supporting an opinion, as in DELE Tarea 2.' };
  if (examU.indexOf('DELF') !== -1 || examU.indexOf('DALF') !== -1)
    return { t1: 'write a short personal or formal piece (message, letter or account) responding to a situation.', t2: 'write an argumentative essay (essai) expressing and justifying a clear point of view.' };
  if (examU.indexOf('GOETHE') !== -1 || examU.indexOf('TESTDAF') !== -1)
    return { t1: 'write a semi-formal email or forum post (Schreiben Teil 1) responding to a given situation.', t2: 'write a short opinion text arguing a position on the topic.' };
  if (examU.indexOf('TOPIK') !== -1)
    return { t1: 'short guided writing: complete the blanks in a given passage with appropriate sentences (쓰기 51/52 style).', t2: 'write a 200-300 character argumentative essay on the given topic (쓰기 54 style).' };
  if (examU.indexOf('HSK') !== -1)
    return { t1: 'arrange the given words/elements into grammatically correct sentences (书写 word-ordering).', t2: 'write a short passage using a given keyword on the topic (书写 short composition).' };
  if (examU.indexOf('CILS') !== -1 || examU.indexOf('CELI') !== -1)
    return { t1: 'write a short functional text (message, email or note) for a given situation.', t2: 'write a composition giving and supporting an opinion on the topic.' };
  // Generic CEFR-style two written tasks.
  return { t1: 'write a short text (message, email or note) responding to a given everyday situation.', t2: 'write an opinion essay giving and supporting your view on the topic.' };
}
function prompt(type, langName, difficulty, exam, topic) {
  var spec = examSpec(exam, type);
  var examLine = spec ? (' ' + spec) : (exam ? ` Match the style/level of the ${exam} exam.` : '');
  if (type === 'reading') {
    return `Create a ${difficulty} reading-comprehension item in ${langName}.${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"passage":string,"questions":[{"q":string,` +
      `"options":[string,string,string,string],"answer":number}]}. ` +
      `Passage length: easy ~120 words, medium ~250, hard ~450. 4–6 questions. ` +
      `Passage and questions in ${langName}; "answer" is the 0-based index of the correct option.`;
  }
  if (type === 'writing') {
    var examU = exam ? String(exam).toUpperCase() : '';
    // Only IELTS (and the generic default) uses a data-visual Task 1 with a chart.
    var isChartExam = !exam || examU.indexOf('IELTS') !== -1;
    if (isChartExam) {
      return `Create a ${difficulty} two-part IELTS-style writing test in ${langName}.${examLine} ` +
        `Task 1 asks the learner to describe a data visual; Task 2 is an opinion/discussion essay. ` +
        `Return ONLY minified JSON: {"title":string,` +
        `"task1":{"prompt":string,"chart":{"type":"bar"|"line","title":string,"unit":string,` +
        `"categories":[string],"series":[{"name":string,"values":[number]}]}},` +
        `"task2":{"prompt":string},"min_words":number,"time_minutes":number}. ` +
        `The chart has 4-7 categories and 1-3 series of realistic whole numbers. ` +
        `All prompts and chart labels in ${langName}; the Task 1 prompt asks the learner to summarise the visual.`;
    }
    var wt = WRITING_TASKS(examU);
    return `Create a ${difficulty} two-part writing test in ${langName} in the official format of the ${exam} exam.${examLine} ` +
      `Task 1: ${wt.t1} Task 2: ${wt.t2} ` +
      `Return ONLY minified JSON: {"title":string,"task1":{"prompt":string},"task2":{"prompt":string},"min_words":number,"time_minutes":number}. ` +
      `Both task prompts must be written in ${langName}. Do NOT include any chart or data visual — these are text writing tasks.`;
  }
  if (type === 'listening') {
    return `Create a ${difficulty} listening-comprehension item in ${langName}.${examLine} ` +
      `Write a natural spoken-style passage — a short monologue or a two-person dialogue that reads well aloud — then comprehension questions. ` +
      `Return ONLY minified JSON: {"title":string,"passage":string,"questions":[{"q":string,` +
      `"options":[string,string,string,string],"answer":number}]}. ` +
      `Passage ~120-220 words in a conversational register; 4-6 questions. ` +
      `Passage and questions in ${langName}; "answer" is the 0-based index of the correct option.`;
  }
  if (type === 'lesson') {
    var topicLine = topic ? ' The lesson topic is: "' + topic + '".' : '';
    return 'Create a structured ' + difficulty + ' language lesson for a learner of ' + langName + '.' + topicLine + examLine + ' ' +
      'Explanations must be in ENGLISH (the learner\'s language); all example sentences and vocabulary terms must be in ' + langName + ' with English glosses. ' +
      'Return ONLY minified JSON: {"title":string,"level":string,"objectives":[string],' +
      '"sections":[{"heading":string,"body":string}],' +
      '"examples":[{"target":string,"gloss":string}],' +
      '"vocab":[{"term":string,"gloss":string}],' +
      '"practice":[{"q":string,"options":[string,string,string,string],"answer":number}]}. ' +
      '3-4 objectives; 2-3 explanation sections (English, clear and concise); 5-8 examples (target sentence + English gloss); ' +
      '6-10 vocab items; 4-6 practice questions (question stems in English, target-language answer options). ' +
      '"answer" is the 0-based index of the correct option.';
  }
  if (type === 'speaking') {
    return `Create a ${difficulty} speaking test in ${langName}.${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"parts":[{"n":number,"label":string,"desc":string,"prompt":string}]}. ` +
      `Exactly 3 parts modelled on an oral exam: Part 1 short introductory questions, Part 2 a longer cue-card style turn, Part 3 an abstract discussion. ` +
      `All "label", "desc" and "prompt" text must be written in ${langName}; "n" is 1, 2 and 3.`;
  }
  if (type === 'vocab') {
    var vTopic = topic ? ` Focus the set on the topic: "${topic}".` : '';
    return `Create a ${difficulty} themed vocabulary set in ${langName}.${vTopic}${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"theme":string,"words":[{"term":string,` +
      `"reading":string,"en":string,"example":string}]}. 10–15 words. "term" in ${langName}, ` +
      `"reading" is romanization if non-Latin (else ""), "en" is the English meaning, ` +
      `"example" a short natural sentence in ${langName} that CONTAINS the term verbatim.`;
  }
  return null;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  var ANTHROPIC = process.env.ANTHROPIC_API_KEY;
  var SB_URL = process.env.SUPABASE_URL;
  var SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  // Only Anthropic is required to GENERATE content. Supabase is used to cache/persist
  // the result, but a DB problem must never block content from reaching the learner.
  if (!ANTHROPIC) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });
  }

  // Usage cap: 3 credits (fail-open if not configured)
  try {
    var allow = await require('./_usage').meter(req, 3);
    if (!allow.ok) return res.status(402).json({ error: 'limit', limit: true, plan: allow.plan, remaining: allow.remaining, cap: allow.limit });
  } catch (e) {}

  try {
    var body = req.body || {};
    var lang = body.lang, type = body.type;
    var difficulty = body.difficulty || 'medium';
    var exam = body.exam || null;
    var topic = body.topic || null;
    if (!lang || !LANG_NAMES[lang]) return res.status(400).json({ error: 'valid lang required' });
    if (['reading', 'writing', 'vocab', 'speaking', 'listening', 'lesson'].indexOf(type) === -1) return res.status(400).json({ error: 'type must be reading|writing|vocab|speaking|listening|lesson' });

    var p = prompt(type, LANG_NAMES[lang], difficulty, exam, topic);

    // Claude generates the content
    async function callModel() {
      var aResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: (process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'), max_tokens: (type === 'lesson' ? 3500 : 2000), messages: [{ role: 'user', content: p }] }),
      });
      if (!aResp.ok) return { httpError: (await aResp.text()).slice(0, 300) };
      var aData = await aResp.json();
      var raw = (aData.content || []).filter(function (b) { return b.type === 'text'; })
        .map(function (b) { return b.text; }).join('').trim().replace(/^```json\s*|\s*```$/g, '');
      return { raw: raw };
    }
    function tryParse(raw) {
      if (!raw) return null;
      try { return JSON.parse(raw); } catch (e) {}
      var a = raw.indexOf('{'), b = raw.lastIndexOf('}');           // stricter: extract first {...last}
      if (a !== -1 && b > a) { try { return JSON.parse(raw.slice(a, b + 1)); } catch (e2) {} }
      return null;
    }
    // Up to 2 attempts: retry once on a transient API error or unparseable JSON.
    var payload = null, lastRaw = '', httpErr = null;
    for (var attempt = 0; attempt < 2 && !payload; attempt++) {
      var rr = await callModel();
      if (rr.httpError) { httpErr = rr.httpError; continue; }
      lastRaw = rr.raw; payload = tryParse(rr.raw);
    }
    if (!payload) {
      if (httpErr) console.error('[generate-content] anthropic call failed:', httpErr);
      if (httpErr && !lastRaw) return res.status(502).json({ error: 'generation failed', detail: httpErr });
      return res.status(502).json({ error: 'bad JSON from model', raw: lastRaw.slice(0, 400) });
    }

    // Persist to the pooled content table (best-effort). A DB failure must NOT
    // discard freshly generated content — return it either way.
    var saved = null;
    if (SB_URL && SB_KEY) {
      try {
        var row = { lang: lang, type: type, difficulty: difficulty, exam: exam, title: payload.title || null, payload: payload };
        var sResp = await fetch(SB_URL + '/rest/v1/content', {
          method: 'POST',
          headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' },
          body: JSON.stringify(row),
        });
        if (sResp.ok) { var arr = await sResp.json(); saved = (arr && arr[0]) || null; }
      } catch (e) { /* persistence is optional */ }
    }
    if (!saved) saved = { lang: lang, type: type, difficulty: difficulty, exam: exam, title: payload.title || null, payload: payload };

    return res.status(200).json({ content: saved });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String(e && e.message || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 60 };
