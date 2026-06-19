// ── Fluentra · /api/tutor ────────────────────────────────────────────────────
// Conversational language tutor. Takes the chat history + the learner's language
// and current focus, returns the tutor's next reply (Claude Sonnet).
//
// POST { messages:[{role:'user'|'assistant'|'ai', content|text}], lang, context }
//   -> { reply }
//
// Env: ANTHROPIC_API_KEY
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  var ANTHROPIC = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });

  try {
    var body = req.body || {};
    var raw = Array.isArray(body.messages) ? body.messages : [];
    var lang = body.lang || 'the target language';
    var context = body.context || '';

    // Normalize to Claude's message format and keep the last ~16 turns
    var msgs = raw.slice(-16).map(function (m) {
      var role = (m.role === 'assistant' || m.role === 'ai') ? 'assistant' : 'user';
      return { role: role, content: String(m.content != null ? m.content : (m.text || '')) };
    }).filter(function (m) { return m.content.trim(); });

    // Claude requires the conversation to start with a user turn
    while (msgs.length && msgs[0].role !== 'user') msgs.shift();
    if (!msgs.length) return res.status(400).json({ error: 'messages required (need at least one user turn)' });

    var system =
      'You are Fluentra, a warm, encouraging, expert language tutor. The learner is studying ' + lang + '. ' +
      (context ? 'Current focus: ' + context + '. ' : '') +
      'Teach clearly and concisely. Gently correct mistakes with a one-line "why". ' +
      'Prefer short paragraphs and at most one concrete example per reply. Adapt difficulty to the learner. ' +
      'Keep replies under ~150 words unless the learner asks for more depth. You may use light markdown ' +
      '(bold, simple lists, > for example sentences). Stay on language learning.';

    var aResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 800, system: system, messages: msgs }),
    });
    if (!aResp.ok) return res.status(502).json({ error: 'tutor request failed', detail: (await aResp.text()).slice(0, 300) });
    var aData = await aResp.json();
    var reply = (aData.content && aData.content[0] && aData.content[0].text) || '';
    if (!reply) return res.status(502).json({ error: 'empty reply from model' });

    return res.status(200).json({ reply: reply });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String(e && e.message || e).slice(0, 300) });
  }
};
