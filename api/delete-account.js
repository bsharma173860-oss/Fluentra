// ── Fluentra · /api/delete-account ──────────────────────────────────────────
// Permanently deletes the signed-in user. The user id comes from the VERIFIED
// auth token, never the body — a user can only ever delete themselves.
//
// Order matters: first delete rows that DON'T cascade from auth.users
// (user_content, usage_counters have a bare user_id with no FK), then delete the
// auth user — which cascades profiles, user_languages, vocab_srs, friendships,
// activity, messages and phrases (all FK -> auth.users on delete cascade).
//
// POST {}  + Authorization: Bearer <user JWT>
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY (or _ROLE_KEY / SUPABASE_KEY)
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  var SB_URL = process.env.SUPABASE_URL;
  var SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Missing SUPABASE_URL / SUPABASE_SERVICE_KEY' });
  var base = SB_URL.replace(/\/$/, '');

  try {
    var auth = req.headers.authorization || '';
    var token = auth.replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'auth token required' });

    // Verify the token and resolve the real user id.
    var uResp = await fetch(base + '/auth/v1/user', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token } });
    if (!uResp.ok) return res.status(401).json({ error: 'invalid session' });
    var user = await uResp.json();
    if (!user || !user.id) return res.status(401).json({ error: 'could not resolve user' });
    var uid = user.id;

    var svc = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY };

    // 1) Non-cascading tables (bare user_id, no FK to auth.users).
    var nonCascading = ['user_content', 'usage_counters'];
    for (var i = 0; i < nonCascading.length; i++) {
      var d = await fetch(base + '/rest/v1/' + nonCascading[i] + '?user_id=eq.' + uid, { method: 'DELETE', headers: svc });
      if (!d.ok && d.status !== 404) {
        return res.status(502).json({ error: 'cleanup failed for ' + nonCascading[i], detail: (await d.text()).slice(0, 200) });
      }
    }

    // 2) Delete the auth user — cascades everything FK-bound.
    var del = await fetch(base + '/auth/v1/admin/users/' + uid, { method: 'DELETE', headers: svc });
    if (!del.ok) return res.status(502).json({ error: 'account deletion failed', detail: (await del.text()).slice(0, 200) });

    return res.status(200).json({ ok: true, deleted: uid });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String((e && e.message) || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 30 };
