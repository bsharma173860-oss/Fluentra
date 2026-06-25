// ── Fluentra · /api/content-list ────────────────────────────────────────────
// Returns pooled practice content for ONE language only. This is what enforces
// "Spanish pages show only Spanish content": lang is required and every query
// filters on it. Optionally narrow by type/difficulty.
//
// GET /api/content-list?lang=es&type=reading&difficulty=medium&limit=20
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'GET only' });

  var SB_URL = process.env.SUPABASE_URL;
  var SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Missing SUPABASE_URL / SUPABASE_SERVICE_KEY' });

  try {
    var q = req.query || {};
    var lang = q.lang;
    if (!lang) return res.status(400).json({ error: 'lang is required (content is partitioned by language)' });

    // Build a PostgREST query, always pinned to the language
    var params = ['lang=eq.' + encodeURIComponent(lang), 'order=created_at.desc'];
    if (q.type) params.push('type=eq.' + encodeURIComponent(q.type));
    if (q.difficulty) params.push('difficulty=eq.' + encodeURIComponent(q.difficulty));
    var limit = Math.min(parseInt(q.limit, 10) || 20, 100);
    params.push('limit=' + limit);
    if (q.full) params.push('select=*');
    else params.push('select=id,lang,type,difficulty,exam,title,created_at');

    var url = SB_URL + '/rest/v1/content?' + params.join('&');
    var r = await fetch(url, { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
    if (!r.ok) return res.status(502).json({ error: 'query failed', detail: (await r.text()).slice(0, 300) });
    var items = await r.json();

    return res.status(200).json({ lang: lang, count: items.length, items: items });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String(e && e.message || e).slice(0, 300) });
  }
};
