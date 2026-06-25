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

function prompt(type, langName, difficulty, exam, topic) {
  var examLine = exam ? ` Match the style/level of the ${exam} exam.` : '';
  if (type === 'reading') {
    return `Create a ${difficulty} reading-comprehension item in ${langName}.${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"passage":string,"questions":[{"q":string,` +
      `"options":[string,string,string,string],"answer":number}]}. ` +
      `Passage length: easy ~120 words, medium ~250, hard ~450. 4–6 questions. ` +
      `Passage and questions in ${langName}; "answer" is the 0-based index of the correct option.`;
  }
  if (type === 'writing') {
    return `Create a ${difficulty} two-part writing test in ${langName}.${examLine} ` +
      `Task 1 asks the learner to describe a data visual; Task 2 is an opinion/discussion essay. ` +
      `Return ONLY minified JSON: {"title":string,` +
      `"task1":{"prompt":string,"chart":{"type":"bar"|"line","title":string,"unit":string,` +
      `"categories":[string],"series":[{"name":string,"values":[number]}]}},` +
      `"task2":{"prompt":string},"min_words":number,"time_minutes":number}. ` +
      `The chart has 4-7 categories and 1-3 series of realistic whole numbers. ` +
      `All prompts and chart labels in ${langName}; the Task 1 prompt asks the learner to summarise the visual.`;
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
    var aResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: (type === 'lesson' ? 3500 : 2000), messages: [{ role: 'user', content: p }] }),
    });
    if (!aResp.ok) return res.status(502).json({ error: 'generation failed', detail: (await aResp.text()).slice(0, 300) });
    var aData = await aResp.json();
    var raw = (aData.content || []).filter(function (b) { return b.type === 'text'; })
      .map(function (b) { return b.text; }).join('').trim().replace(/^```json\s*|\s*```$/g, '');
    var payload;
    try { payload = JSON.parse(raw); } catch (e) { return res.status(502).json({ error: 'bad JSON from model', raw: raw.slice(0, 400) }); }

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
