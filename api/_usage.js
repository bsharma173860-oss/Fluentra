// ── Fluentra · shared usage metering ────────────────────────────────────────
// Enforces per-plan AI credit caps server-side. Called by the AI endpoints
// (tutor, generate-content, grade-writing, speaking-eval) before they spend
// tokens. 1 credit ≈ $0.01 of AI cost.
//
// FAIL-OPEN: if Supabase env isn't configured, the request has no auth token,
// or anything errors, we ALLOW the request (never block a paying user over a
// metering glitch). Metering only ever blocks when it positively knows the
// user is over their cap.
//
// Env: SUPABASE_URL, SUPABASE_SERVICE_KEY
// ─────────────────────────────────────────────────────────────────────────────

const PLAN_BUDGET = {
  free: { period: 'day',   credits: 10 },    // ~10 tutor msgs/day (lessons/grading are feature-gated off for free)
  pro:  { period: 'month', credits: 800 },   // ~$8 AI ceiling/month
  max:  { period: 'month', credits: 4000 },  // 5x Pro
};

function periodKey(kind) {
  const iso = new Date().toISOString();
  return kind === 'day' ? 'day:' + iso.slice(0, 10) : 'month:' + iso.slice(0, 7);
}

// Returns { ok, metered, plan, remaining, limit }
//  ok:false  -> caller should return 402 and prompt upgrade
//  metered:false -> not enforced (not configured / no token / error) -> allow
async function meter(req, cost) {
  const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!SB_URL || !SB_KEY) return { ok: true, metered: false };

  try {
    const auth = req.headers.authorization || '';
    const token = auth.replace(/^Bearer\s+/i, '').trim();
    if (!token) return { ok: true, metered: false };

    // Verify token -> real user id (never trust the client body)
    const uResp = await fetch(SB_URL + '/auth/v1/user', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token } });
    if (!uResp.ok) return { ok: true, metered: false };
    const user = await uResp.json();
    if (!user || !user.id) return { ok: true, metered: false };

    // Plan
    const pResp = await fetch(SB_URL + '/rest/v1/profiles?id=eq.' + user.id + '&select=plan', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
    const pRows = pResp.ok ? await pResp.json() : [];
    const plan = (pRows[0] && pRows[0].plan) || 'free';
    const budget = PLAN_BUDGET[plan] || PLAN_BUDGET.free;
    const period = periodKey(budget.period);

    // Current usage
    const uRows = await fetch(SB_URL + '/rest/v1/usage_counters?user_id=eq.' + user.id + '&period=eq.' + encodeURIComponent(period) + '&select=credits', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
    const rows = uRows.ok ? await uRows.json() : [];
    const used = rows[0] ? Number(rows[0].credits) || 0 : 0;

    if (used + cost > budget.credits) {
      return { ok: false, metered: true, plan, remaining: Math.max(0, budget.credits - used), limit: budget.credits };
    }

    // Consume (atomic increment via RPC)
    await fetch(SB_URL + '/rest/v1/rpc/increment_usage', {
      method: 'POST',
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_user: user.id, p_period: period, p_add: cost }),
    });
    return { ok: true, metered: true, plan, remaining: budget.credits - used - cost, limit: budget.credits };
  } catch (e) {
    return { ok: true, metered: false };  // fail-open
  }
}

module.exports = { meter, PLAN_BUDGET };
