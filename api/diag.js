// ── Fluentra · /api/diag ─────────────────────────────────────────────────────
// Safe, read-only self-test. Open this URL in any browser to see WHY content
// generation might be failing. Exposes NO secret values — only booleans (is a
// key present?), HTTP status codes, and short error messages.
//
//   GET https://<your-domain>/api/diag
//
module.exports = async function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');

  var out = { ok: true, ts: new Date().toISOString() };

  var ANTHROPIC = process.env.ANTHROPIC_API_KEY;
  var SB_URL = process.env.SUPABASE_URL;
  var SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

  // 1. Which env vars are present (true/false ONLY — never the value)
  out.env = {
    ANTHROPIC_API_KEY: !!ANTHROPIC,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    SUPABASE_URL: !!SB_URL,
    SUPABASE_SERVICE_KEY_or_alias: !!SB_KEY,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
  };

  // 2. Can we actually call Anthropic? (this is what generates module content)
  try {
    if (ANTHROPIC) {
      var a = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
        body: JSON.stringify({ model: (process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'), max_tokens: 16, messages: [{ role: 'user', content: 'Reply with the single word OK.' }] }),
      });
      out.anthropic = { status: a.status, ok: a.ok };
      if (!a.ok) {
        out.anthropic.detail = (await a.text()).slice(0, 220);
      } else {
        var ad = await a.json();
        out.anthropic.reply = ((ad.content && ad.content[0] && ad.content[0].text) || '').slice(0, 40);
      }
    } else {
      out.anthropic = { skipped: 'ANTHROPIC_API_KEY not set' };
    }
  } catch (e) {
    out.anthropic = { error: String((e && e.message) || e).slice(0, 220) };
  }

  // 3. Can we reach the Supabase content table? (persistence only — not required)
  try {
    if (SB_URL && SB_KEY) {
      var s = await fetch(SB_URL + '/rest/v1/content?select=id&limit=1', {
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
      });
      out.supabase_content_table = { status: s.status, ok: s.ok };
      if (!s.ok) out.supabase_content_table.detail = (await s.text()).slice(0, 220);
    } else {
      out.supabase_content_table = { skipped: 'no url/key' };
    }
  } catch (e) {
    out.supabase_content_table = { error: String((e && e.message) || e).slice(0, 220) };
  }

  // 4. Verdict
  out.verdict = (out.anthropic && out.anthropic.ok)
    ? 'Anthropic OK — modules should generate real content (Supabase save is best-effort).'
    : 'Anthropic call NOT ok — this is why modules fall back to sample content. See anthropic.detail / anthropic.skipped.';

  return res.status(200).json(out);
};

module.exports.config = { maxDuration: 30 };
