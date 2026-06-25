// ── Fluentra · /api/stripe-webhook ──────────────────────────────────────────
// Receives Stripe subscription lifecycle events and keeps the user's plan in
// Supabase in sync. Signature is verified against STRIPE_WEBHOOK_SECRET using
// the RAW request body, so body parsing is disabled below.
//
// Env: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL,
//      SUPABASE_SERVICE_KEY, STRIPE_PRICE_PRO_*, STRIPE_PRICE_MAX_*
// Set this URL as a webhook endpoint in the Stripe dashboard and subscribe to:
//   checkout.session.completed, customer.subscription.updated,
//   customer.subscription.deleted
// ─────────────────────────────────────────────────────────────────────────────

const Stripe = require('stripe');

function readRawBody(req) {
  return new Promise(function (resolve, reject) {
    const chunks = [];
    req.on('data', function (c) { chunks.push(typeof c === 'string' ? Buffer.from(c) : c); });
    req.on('end', function () { resolve(Buffer.concat(chunks)); });
    req.on('error', reject);
  });
}

async function patchProfile(SB_URL, SB_KEY, filter, patch) {
  await fetch(SB_URL + '/rest/v1/profiles?' + filter, {
    method: 'PATCH',
    headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(patch),
  });
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const SB_URL = (process.env.SUPABASE_URL || '').replace(/\/$/, '');
  const SB_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const STRIPE_KEY = process.env.STRIPE_SECRET_KEY;
  const WH_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
  if (!SB_URL || !SB_KEY || !STRIPE_KEY || !WH_SECRET) {
    return res.status(500).json({ error: 'Missing Stripe/Supabase env vars' });
  }

  // Map price ids back to a plan tier so we can record 'pro' / 'max'.
  const PRICE_TO_PLAN = {};
  PRICE_TO_PLAN[process.env.STRIPE_PRICE_PRO_MONTHLY] = 'pro';
  PRICE_TO_PLAN[process.env.STRIPE_PRICE_PRO_YEARLY] = 'pro';
  PRICE_TO_PLAN[process.env.STRIPE_PRICE_MAX_MONTHLY] = 'max';
  PRICE_TO_PLAN[process.env.STRIPE_PRICE_MAX_YEARLY] = 'max';

  const stripe = Stripe(STRIPE_KEY);

  let event;
  try {
    const raw = await readRawBody(req);
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(raw, sig, WH_SECRET);
  } catch (e) {
    return res.status(400).json({ error: 'signature verification failed', detail: String((e && e.message) || e).slice(0, 200) });
  }

  try {
    const obj = event.data && event.data.object;

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
      const customer = obj.customer;
      const status = obj.status; // active, trialing, past_due, canceled, etc.
      const priceId = obj.items && obj.items.data && obj.items.data[0] && obj.items.data[0].price && obj.items.data[0].price.id;
      const active = status === 'active' || status === 'trialing';
      const plan = active ? (PRICE_TO_PLAN[priceId] || 'pro') : 'free';
      const periodEnd = obj.current_period_end ? new Date(obj.current_period_end * 1000).toISOString() : null;
      await patchProfile(SB_URL, SB_KEY, 'stripe_customer_id=eq.' + customer, {
        plan: plan, subscription_status: status, current_period_end: periodEnd,
      });
    } else if (event.type === 'customer.subscription.deleted') {
      await patchProfile(SB_URL, SB_KEY, 'stripe_customer_id=eq.' + obj.customer, {
        plan: 'free', subscription_status: 'canceled',
      });
    } else if (event.type === 'checkout.session.completed') {
      // Belt-and-suspenders: ensure the customer id is linked to the user.
      const userId = obj.client_reference_id;
      if (userId && obj.customer) {
        await patchProfile(SB_URL, SB_KEY, 'id=eq.' + userId, { stripe_customer_id: obj.customer });
      }
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    return res.status(500).json({ error: 'handler error', detail: String((e && e.message) || e).slice(0, 200) });
  }
};

// Stripe signature verification needs the raw body — disable Vercel body parsing.
module.exports.config = { api: { bodyParser: false }, maxDuration: 30 };
