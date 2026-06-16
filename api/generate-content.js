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

function prompt(type, langName, difficulty, exam) {
  var examLine = exam ? ` Match the style/level of the ${exam} exam.` : '';
  if (type === 'reading') {
    return `Create a ${difficulty} reading-comprehension item in ${langName}.${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"passage":string,"questions":[{"q":string,` +
      `"options":[string,string,string,string],"answer":number}]}. ` +
      `Passage length: easy ~120 words, medium ~250, hard ~450. 4–6 questions. ` +
      `Passage and questions in ${langName}; "answer" is the 0-based index of the correct option.`;
  }
  if (type === 'writing') {
    return `Create a ${difficulty} writing task in ${langName}.${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"prompt":string,"guidance":string,` +
      `"min_words":number,"time_minutes":number}. Prompt and guidance in ${langName}.`;
  }
  if (type === 'vocab') {
    return `Create a ${difficulty} themed vocabulary set in ${langName}.${examLine} ` +
      `Return ONLY minified JSON: {"title":string,"theme":string,"words":[{"term":string,` +
      `"reading":string,"en":string,"example":string}]}. 10–15 words. "term" in ${langName}, ` +
      `"reading" is romanization if non-Latin (else ""), "en" is the English meaning, ` +
      `"example" a short sentence in ${langName}.`;
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
  var SB_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!ANTHROPIC || !SB_URL || !SB_KEY) {
    return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY / SUPABASE_URL / SUPABASE_SERVICE_KEY' });
  }

  try {
    var body = req.body || {};
    var lang = body.lang, type = body.type;
    var difficulty = body.difficulty || 'medium';
    var exam = body.exam || null;
    if (!lang || !LANG_NAMES[lang]) return res.status(400).json({ error: 'valid lang required' });
    if (['reading', 'writing', 'vocab'].indexOf(type) === -1) return res.status(400).json({ error: 'type must be reading|writing|vocab' });

    var p = prompt(type, LANG_NAMES[lang], difficulty, exam);

    // Claude generates the content
    var aResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 2000, messages: [{ role: 'user', content: p }] }),
    });
    if (!aResp.ok) return res.status(502).json({ error: 'generation failed', detail: (await aResp.text()).slice(0, 300) });
    var aData = await aResp.json();
    var raw = (aData.content || []).filter(function (b) { return b.type === 'text'; })
      .map(function (b) { return b.text; }).join('').trim().replace(/^```json\s*|\s*```$/g, '');
    var payload;
    try { payload = JSON.parse(raw); } catch (e) { return res.status(502).json({ error: 'bad JSON from model', raw: raw.slice(0, 400) }); }

    // Save to the pooled content table, tagged with lang
    var row = { lang: lang, type: type, difficulty: difficulty, exam: exam, title: payload.title || null, payload: payload };
    var sResp = await fetch(SB_URL + '/rest/v1/content', {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(row),
    });
    if (!sResp.ok) return res.status(502).json({ error: 'save failed', detail: (await sResp.text()).slice(0, 300) });
    var saved = (await sResp.json())[0];

    return res.status(200).json({ content: saved });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String(e && e.message || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 60 };
