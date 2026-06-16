// ── Fluentra · /api/save-result ─────────────────────────────────────────────
// Persists a completed practice/exam attempt to the user's private library
// (user_content). The user_id is taken from the VERIFIED auth token, never from
// the client body — so a user can only ever save results for themselves.
//
// POST { lang, content_id?, score?, detail?, status? }  + Authorization: Bearer <user JWT>
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  var SB_URL = process.env.SUPABASE_URL;
  var SB_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Missing SUPABASE_URL / SUPABASE_SERVICE_KEY' });

  try {
    var auth = req.headers.authorization || '';
    var token = auth.replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'auth token required' });

    // Verify the token and resolve the real user id
    var uResp = await fetch(SB_URL.replace(/\/$/, '') + '/auth/v1/user', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token },
    });
    if (!uResp.ok) return res.status(401).json({ error: 'invalid session' });
    var user = await uResp.json();
    if (!user || !user.id) return res.status(401).json({ error: 'could not resolve user' });

    var b = req.body || {};
    if (!b.lang) return res.status(400).json({ error: 'lang required' });

    var row = {
      user_id: user.id,
      content_id: b.content_id || null,
      lang: b.lang,
      status: b.status || 'completed',
      score: (typeof b.score === 'number') ? b.score : null,
      detail: b.detail || null,
    };

    var ins = await fetch(SB_URL.replace(/\/$/, '') + '/rest/v1/user_content', {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify(row),
    });
    if (!ins.ok) return res.status(502).json({ error: 'save failed', detail: (await ins.text()).slice(0, 300) });

    return res.status(200).json({ ok: true, saved: (await ins.json())[0] });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String((e && e.message) || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 30 };
