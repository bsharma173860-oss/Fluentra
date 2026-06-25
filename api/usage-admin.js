// ── Fluentra · /api/usage-admin ─────────────────────────────────────────────
// Owner-only usage dashboard data. Protected by ADMIN_KEY (sent as the
// x-admin-key header) — never expose this publicly, it returns every user's
// usage. Returns this-period credits, estimated cost, and a per-user breakdown.
//
// Env: ADMIN_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
// ─────────────────────────────────────────────────────────────────────────────

const CAP = { free: 10, pro: 800, max: 4000 };       // credits per period
const CREDIT_USD = 0.01;                              // 1 credit ≈ $0.01

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const ADMIN = process.env.ADMIN_KEY || process.env.ADMIN_SECRET;
  const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY;
  if (!ADMIN) return res.status(500).json({ error: 'ADMIN_KEY/ADMIN_SECRET not set on the server' });
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'SUPABASE_URL / SUPABASE_SERVICE_KEY missing' });

  const key = req.headers['x-admin-key'] || '';
  if (key !== ADMIN) return res.status(401).json({ error: 'unauthorized' });

  try {
    const iso = new Date().toISOString();
    const month = 'month:' + iso.slice(0, 7);
    const day = 'day:' + iso.slice(0, 10);
    const h = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY };

    const uResp = await fetch(SB_URL + '/rest/v1/usage_counters?or=(period.eq.' + encodeURIComponent(month) + ',period.eq.' + encodeURIComponent(day) + ')&select=user_id,credits,period', { headers: h });
    const usage = uResp.ok ? await uResp.json() : [];
    const pResp = await fetch(SB_URL + '/rest/v1/profiles?select=id,full_name,plan', { headers: h });
    const profs = pResp.ok ? await pResp.json() : [];

    const pmap = {};
    profs.forEach(function (p) { pmap[p.id] = p; });

    const users = usage.map(function (u) {
      const p = pmap[u.user_id] || {};
      const plan = p.plan || 'free';
      const credits = Number(u.credits) || 0;
      return {
        name: p.full_name || ('user ' + String(u.user_id || '').slice(0, 8)),
        plan: plan,
        credits: credits,
        cap: CAP[plan] || 10,
        pct: Math.min(100, Math.round((credits / (CAP[plan] || 10)) * 100)),
        cost: +(credits * CREDIT_USD).toFixed(2),
      };
    }).sort(function (a, b) { return b.credits - a.credits; });

    const totalCredits = users.reduce(function (s, u) { return s + u.credits; }, 0);
    const byPlan = { free: 0, pro: 0, max: 0 };
    profs.forEach(function (p) { const pl = p.plan || 'free'; if (byPlan[pl] != null) byPlan[pl]++; });

    return res.status(200).json({
      month: iso.slice(0, 7),
      totalUsers: profs.length,
      activeUsers: users.length,
      totalCredits: totalCredits,
      totalCost: +(totalCredits * CREDIT_USD).toFixed(2),
      byPlan: byPlan,
      users: users.slice(0, 100),
    });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String((e && e.message) || e).slice(0, 200) });
  }
};
