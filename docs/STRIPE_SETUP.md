# Fluentra — Stripe setup checklist

The billing code is built and deployed. To make it actually charge cards, do the
steps below. **Stay in Stripe _Test mode_ until you've verified the full loop**,
then repeat the key creation in Live mode.

## 1. Stripe dashboard — create products & prices
1. Create a Stripe account at stripe.com (or sign in). Toggle **Test mode** (top right).
2. **Products → Add product** → "Fluentra Pro". Add **two recurring prices**:
   - Monthly: $24 / month
   - Yearly: $228 / year  (this is the "$19/mo billed annually")
3. Add another product "Fluentra Max" with two recurring prices:
   - Monthly: $59 / month
   - Yearly: $588 / year
4. Pick one currency (CAD or USD) and use it for all four.
5. Click each price and copy its **Price ID** (looks like `price_1A2b...`). You need all four.

## 2. Stripe dashboard — keys & webhook
6. **Developers → API keys** → copy the **Secret key** (`sk_test_...`).
7. **Developers → Webhooks → Add endpoint**:
   - Endpoint URL: `https://fluentra-kappa.vercel.app/api/stripe-webhook`
   - Events to send: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Save, then copy the **Signing secret** (`whsec_...`).
8. **Settings → Billing → Customer portal** → activate it (so "Manage billing" works).

## 3. Vercel — environment variables
In your Vercel project → **Settings → Environment Variables**, add (Production):

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` |
| `STRIPE_PRICE_PRO_MONTHLY` | `price_...` |
| `STRIPE_PRICE_PRO_YEARLY` | `price_...` |
| `STRIPE_PRICE_MAX_MONTHLY` | `price_...` |
| `STRIPE_PRICE_MAX_YEARLY` | `price_...` |

(`SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are already set.) Redeploy after adding them.

## 4. Supabase — add the billing columns
Run `db/schema.sql` in the Supabase SQL editor (or just the new `alter table profiles ...`
lines at the bottom). This adds `stripe_customer_id`, `subscription_status`, `current_period_end`.

## 5. Test the full loop (Test mode)
1. `git pull` → `vercel --prod`.
2. Go to Pricing → click a Pro plan → you should land on Stripe's hosted Checkout.
3. Pay with test card `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
4. You're redirected back to the app (`?billing=success`) → the webhook fires →
   the `profiles` row for your user should now show `plan = pro`.
5. Settings → Subscription → **Manage billing** → the Stripe customer portal opens.

## 6. Go live
When the test loop works: switch Stripe to **Live mode**, recreate the products/prices,
and replace the Vercel env values with the live `sk_live_...`, live `whsec_...`, and live
`price_...` IDs. Add a live webhook endpoint the same way.

## Notes
- One-time purchases (exam credits, bookings) still use the old in-app checkout screen;
  only the Pro/Max subscriptions go through Stripe so far.
- The Settings subscription card still shows placeholder plan text/date; wiring it to the
  real subscription status is a small follow-up.
