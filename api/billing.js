// ── Fluentra · /api/billing ─────────────────────────────────────────────────
// Stripe billing. Two actions, both authenticated with the user's JWT:
//   POST { action:'checkout', planKey } -> { url }  (Stripe hosted Checkout)
//   POST { action:'portal' }            -> { url }  (Stripe customer portal)
// We never handle card data ourselves; Stripe's hosted pages do that.
//
// Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY,
//      STRIPE_PRICE_PRO_MONTHLY, STRIPE_PRICE_PRO_YEARLY,
//      STRIPE_PRICE_MAX_MONTHLY, STRIPE_PRICE_MAX_YEARLY
// ─────────────────────────────────────────────────────────────────────────────

const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: 'Missing SUPABASE_URL / SUPABASE_SERVICE_KEY' });
  if (!STRIPE_KEY) return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY' });

  const PRICES = {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    pro_yearly:  process.env.STRIPE_PRICE_PRO_YEARLY,
    max_monthly: process.env.STRIPE_PRICE_MAX_MONTHLY,
    max_yearly:  process.env.STRIPE_PRICE_MAX_YEARLY,
  };

  const stripe = Stripe(STRIPE_KEY);
  const base = req.headers.origin || ('https://' + (req.headers.host || ''));

  try {
    // Resolve the real user from the verified token.
    const token = (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim();
    if (!token) return res.status(401).json({ error: 'auth token required' });
    const uResp = await fetch(SB_URL + '/auth/v1/user', { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + token } });
    if (!uResp.ok) return res.status(401).json({ error: 'invalid session' });
    const user = await uResp.json();
    if (!user || !user.id) return res.status(401).json({ error: 'could not resolve user' });

    // Look up (or create) this user's Stripe customer id, stored on their profile.
    const pResp = await fetch(SB_URL + '/rest/v1/profiles?id=eq.' + user.id + '&select=stripe_customer_id', {
      headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY },
    });
    const pRows = pResp.ok ? await pResp.json() : [];
    let customerId = pRows && pRows[0] && pRows[0].stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: user.id } });
      customerId = customer.id;
      await fetch(SB_URL + '/rest/v1/profiles?id=eq.' + user.id, {
        method: 'PATCH',
        headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ stripe_customer_id: customerId }),
      });
    }

    const body = req.body || {};
    const action = body.action || 'checkout';

    if (action === 'portal') {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: base + '/?billing=portal_return',
      });
      return res.status(200).json({ url: session.url });
    }

    // Default: checkout
    const price = PRICES[body.planKey];
    if (!price) return res.status(400).json({ error: 'Unknown or unconfigured plan: ' + body.planKey });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      client_reference_id: user.id,
      line_items: [{ price: price, quantity: 1 }],
      subscription_data: { trial_period_days: 7, metadata: { user_id: user.id, plan_key: body.planKey } },
      allow_promotion_codes: true,
      success_url: base + '/?billing=success',
      cancel_url: base + '/?billing=cancel',
    });
    return res.status(200).json({ url: session.url });
  } catch (e) {
    return res.status(500).json({ error: 'billing error', detail: String((e && e.message) || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 30 };
