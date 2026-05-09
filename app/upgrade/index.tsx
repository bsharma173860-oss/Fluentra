// @ts-nocheck
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Platform, useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';

const C = {
  brand:     '#C04A06',
  brandLight:'#FEF3EE',
  ink:       '#0A0A0A',
  ink2:      '#333',
  ink3:      '#666',
  ink4:      '#999',
  ink5:      '#BBB',
  bg:        '#F9F8F5',
  bg2:       '#F4F1EB',
  card:      '#FFFFFF',
  border:    '#E8E2D9',
  hairline:  '#EDE8E0',
  serif:     'DMSerifDisplay_400Regular',
};

const PLANS = [
  {
    id: 'free', name: 'Free', tagline: 'Forever. No card needed.',
    monthly: 0, yearly: 0,
    features: [
      { t: '1 session per day', on: true },
      { t: 'English only', on: true },
      { t: 'Basic streak & progress', on: true },
      { t: '5 AI Tutor messages / day', on: true },
      { t: 'Practice exams', on: false },
      { t: 'AI Writing feedback', on: false },
      { t: 'Offline mode', on: false },
      { t: 'Speaking with mic', on: false },
    ],
    cta: 'Continue with Free',
  },
  {
    id: 'pro', name: 'Pro', tagline: 'For serious learners.',
    monthly: 24, yearly: 19, yearlyTotal: 228,
    popular: true,
    features: [
      { t: 'All 80+ languages', on: true },
      { t: 'Unlimited daily sessions', on: true },
      { t: 'Detailed progress & analytics', on: true },
      { t: 'Unlimited AI Tutor', on: true },
      { t: 'Unlimited practice exams', on: true },
      { t: 'AI Writing feedback', on: true },
      { t: 'Offline mode', on: true },
      { t: 'Speaking with mic', on: true },
    ],
    cta: 'Start 7-day free trial',
  },
  {
    id: 'max', name: 'Max', tagline: 'Exam-prep grade.',
    monthly: 59, yearly: 49, yearlyTotal: 588,
    features: [
      { t: 'Everything in Pro', on: true },
      { t: 'Unlimited practice exams', on: true },
      { t: 'Live speaking partners (4 hr/mo)', on: true },
      { t: 'Personal study coach', on: true },
      { t: 'Score guarantee or refund', on: true },
      { t: 'Priority support · 4 hr SLA', on: true },
      { t: 'Early access to new features', on: true },
      { t: 'Family sharing · 4 seats', on: true },
    ],
    cta: 'Go Max',
  },
];

const TESTIMONIALS = [
  { q: 'I went from 6.0 to 7.5 IELTS in 11 weeks. The AI feedback on my essays is what made the difference.', who: 'Maria S.', loc: 'Madrid', score: 'IELTS 7.5' },
  { q: "I'd tried 4 apps before. Pro is the first one that actually held my attention past week 2.", who: 'David K.', loc: 'Berlin', score: '120 day streak' },
  { q: 'The practice exams felt eerily close to the real thing. Came in with no nerves.', who: 'Hiroko T.', loc: 'Osaka', score: 'TOEFL 108' },
];

const FAQ = [
  { q: 'Can I cancel any time?', a: 'Yes — cancel from Settings → Subscription. You keep Pro access until the end of your billing period, then drop to Free with no data loss.' },
  { q: 'How does the free trial work?', a: "7 days of full Pro access. We'll remind you 2 days before it ends. Cancel during the trial and you pay nothing." },
  { q: 'Can I switch plans later?', a: 'Yes, monthly ↔ yearly any time. Upgrades pro-rate immediately; downgrades apply at your next renewal.' },
  { q: "What's the score guarantee?", a: "Max includes a refund if you don't hit your target band/score after completing the recommended plan. Full T&Cs in our help centre." },
  { q: 'Do you offer student discounts?', a: 'Yes — 50% off Pro with a verified .edu email or student ID. Apply via Settings → Plan after upgrading.' },
  { q: 'Is there a family plan?', a: 'Max includes 4 seats. Each member gets their own profile, progress, and AI tutor history.' },
];

const TABLE_ROWS = [
  { cat: 'Learning' },
  ['Languages', '1', 'All 80+', 'All 80+'],
  ['Daily lesson length', '5 min', 'Unlimited', 'Unlimited'],
  ['Spaced repetition', '✓', '✓', '✓'],
  ['Adaptive difficulty', '—', '✓', '✓'],
  ['Offline mode', '—', '✓', '✓'],
  { cat: 'AI features' },
  ['AI Tutor messages', '5/day', 'Unlimited', 'Unlimited'],
  ['Speaking with mic', '—', '✓', '✓'],
  ['AI Writing feedback', '—', '✓', '✓'],
  ['Personal coach', '—', '—', '✓'],
  { cat: 'Exam prep' },
  ['Practice exams', '—', '1/month', 'Unlimited'],
  ['Score guarantee', '—', '—', '✓'],
  ['Live speaking', '—', '—', '4 hr/mo'],
  { cat: 'Account' },
  ['Family seats', '1', '1', '4'],
  ['Support SLA', 'Community', '24h', '4h priority'],
];

// ── Web (desktop) implementation ─────────────────────────────────────
function UpgradePageWebCSS() {
  const [billing, setBilling] = useState<'monthly'|'yearly'>('yearly');
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const css = `
    .pricing-root { font-family: 'Inter', sans-serif; background: ${C.bg}; min-height: 100vh; }
    .pricing-topbar { padding: 16px 32px; display: flex; align-items: center; gap: 12; background: ${C.card}; border-bottom: 1px solid ${C.border}; position: sticky; top: 0; z-index: 10; }
    .pricing-scroll { padding: 48px 36px 80px; }
    .pricing-inner  { max-width: 1100px; margin: 0 auto; }
    .pricing-hero   { text-align: center; max-width: 680px; margin: 0 auto 36px; }
    .pricing-hero-eyebrow { display: inline-flex; align-items: center; gap: 6px; padding: 5px 14px; background: ${C.brandLight}; color: ${C.brand}; border-radius: 99px; font-size: 11.5px; font-weight: 700; letter-spacing: .04em; margin-bottom: 18px; }
    .pricing-hero-title { font-family: DMSerifDisplay_400Regular, Georgia, serif; font-size: 52px; color: ${C.ink}; line-height: 1.07; margin-bottom: 14px; }
    .pricing-hero-sub   { font-size: 15px; color: ${C.ink3}; line-height: 1.6; }
    .billing-toggle { display: flex; justify-content: center; margin-bottom: 32px; }
    .billing-toggle-inner { display: inline-flex; padding: 4px; background: ${C.bg2}; border-radius: 99px; border: 1px solid ${C.border}; gap: 2px; }
    .billing-btn { padding: 9px 22px; border-radius: 99px; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 500; color: ${C.ink3}; background: transparent; border: none; transition: all .15s; }
    .billing-btn.active { background: ${C.card}; font-weight: 700; color: ${C.ink}; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
    .billing-save { font-size: 10px; padding: 2px 7px; background: ${C.brand}; color: #fff; border-radius: 99px; font-weight: 700; letter-spacing: .04em; }
    .plans-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-bottom: 64px; align-items: stretch; }
    .plan-card { border-radius: 18px; padding: 28px 26px; display: flex; flex-direction: column; position: relative; }
    .plan-card.popular { background: ${C.ink}; color: #fff; box-shadow: 0 12px 40px rgba(192,74,6,.25); }
    .plan-card.default { background: ${C.card}; border: 1px solid ${C.border}; }
    .popular-badge { position: absolute; top: -12px; left: 50%; transform: translateX(-50%); padding: 5px 13px; background: ${C.brand}; color: #fff; border-radius: 99px; font-size: 10.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; white-space: nowrap; }
    .plan-name  { font-family: DMSerifDisplay_400Regular, Georgia, serif; font-size: 28px; line-height: 1; margin-bottom: 5px; }
    .plan-tag   { font-size: 13px; margin-bottom: 20px; }
    .plan-price { font-family: DMSerifDisplay_400Regular, Georgia, serif; font-size: 46px; line-height: 1; }
    .plan-period{ font-size: 14px; }
    .plan-divider { height: 1px; margin: 20px 0; }
    .plan-feature { display: flex; gap: 10px; align-items: flex-start; padding: 8px 0; }
    .feat-check { width: 18px; height: 18px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; flex-shrink: 0; margin-top: 1px; }
    .feat-text { font-size: 13px; line-height: 1.45; }
    .plan-cta { width: 100%; padding: 13px; border-radius: 11px; font-size: 13.5px; font-weight: 700; cursor: pointer; margin-top: auto; border: none; transition: opacity .15s; }
    .plan-cta:hover { opacity: .88; }
    .plan-note { text-align: center; font-size: 11px; margin-top: 8px; }
    .section-title { font-family: DMSerifDisplay_400Regular, Georgia, serif; font-size: 30px; color: ${C.ink}; line-height: 1.1; margin-bottom: 6px; }
    .section-sub   { font-size: 13px; color: ${C.ink4}; margin-bottom: 24px; }
    .comparison-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .table-card { background: ${C.card}; border-radius: 16px; border: 1px solid ${C.border}; overflow: hidden; margin-bottom: 64px; }
    .table-th { padding: 14px 20px; font-size: 11px; color: ${C.ink4}; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; text-align: left; background: ${C.bg2}; border-bottom: 1px solid ${C.border}; }
    .table-th.center { text-align: center; font-size: 13px; color: ${C.ink}; letter-spacing: 0; text-transform: none; }
    .table-cat { background: ${C.bg}; padding: 12px 20px 5px; font-size: 10.5px; color: ${C.ink4}; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; border-top: 1px solid ${C.hairline}; }
    .table-row td { padding: 11px 20px; border-bottom: 1px solid ${C.hairline}; color: ${C.ink2}; }
    .table-row td.center { text-align: center; }
    .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 64px; }
    .testimonial-card { background: ${C.card}; border-radius: 16px; border: 1px solid ${C.border}; padding: 24px; }
    .testimonial-quote { font-family: DMSerifDisplay_400Regular, Georgia, serif; font-size: 30px; color: ${C.brand}; line-height: 1; margin-bottom: 6px; }
    .testimonial-text { font-size: 14px; color: ${C.ink}; line-height: 1.6; margin-bottom: 18px; }
    .testimonial-footer { display: flex; align-items: center; gap: 10px; padding-top: 14px; border-top: 1px solid ${C.hairline}; }
    .testimonial-avatar { width: 36px; height: 36px; border-radius: 18px; background: ${C.brand}; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
    .trust-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 64px; }
    .trust-card { background: ${C.card}; border-radius: 16px; border: 1px solid ${C.border}; padding: 20px; text-align: center; }
    .trust-icon { font-size: 26px; margin-bottom: 8px; }
    .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 36px; }
    .faq-card { background: ${C.card}; border-radius: 14px; border: 1px solid ${C.border}; overflow: hidden; }
    .faq-btn { width: 100%; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 14px; background: transparent; text-align: left; cursor: pointer; border: none; }
    .faq-q { font-size: 13.5px; color: ${C.ink}; font-weight: 600; }
    .faq-icon { width: 24px; height: 24px; border-radius: 12px; background: ${C.bg2}; color: ${C.ink3}; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; transition: transform .2s; }
    .faq-a { padding: 0 20px 18px; font-size: 12.5px; color: ${C.ink3}; line-height: 1.6; }
    .cta-card { border-radius: 20px; padding: 44px; background: ${C.brand}; color: #fff; text-align: center; position: relative; overflow: hidden; }
    .cta-blob1 { position: absolute; top: -40px; right: -40px; width: 200px; height: 200px; border-radius: 100px; background: rgba(255,255,255,.08); pointer-events: none; }
    .cta-blob2 { position: absolute; bottom: -60px; left: -20px; width: 160px; height: 160px; border-radius: 80px; background: rgba(255,255,255,.05); pointer-events: none; }
    .cta-title { font-family: DMSerifDisplay_400Regular, Georgia, serif; font-size: 36px; line-height: 1.1; margin-bottom: 10px; position: relative; }
    .cta-sub { font-size: 14px; opacity: .85; margin-bottom: 24px; max-width: 480px; margin-left: auto; margin-right: auto; position: relative; }
    .cta-btn { padding: 14px 32px; border-radius: 11px; background: #fff; color: ${C.brand}; font-size: 14px; font-weight: 700; cursor: pointer; border: none; position: relative; transition: opacity .15s; }
    .cta-btn:hover { opacity: .9; }
  `;

  return (
      <>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="pricing-root">
          {/* Topbar */}
          <div className="pricing-topbar">
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 8 }}>
              <Text style={{ fontSize: 18, color: C.ink2 }}>←</Text>
            </TouchableOpacity>
            <span style={{ fontFamily: 'DMSerifDisplay_400Regular, Georgia, serif', fontSize: 20, color: C.ink }}>Fluentra</span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 12.5, color: C.ink4 }}>7-day free trial · Cancel any time</span>
          </div>

          <div className="pricing-scroll">
            <div className="pricing-inner">

              {/* Hero */}
              <div className="pricing-hero">
                <div className="pricing-hero-eyebrow">
                  <span>✦</span> Speak it. Score it. Own it.
                </div>
                <div className="pricing-hero-title">
                  Pick the plan that fits<br />how seriously you take it.
                </div>
                <div className="pricing-hero-sub">
                  7-day free trial on every paid plan. No card charged until day 7. Cancel any time, keep your progress.
                </div>
              </div>

              {/* Billing toggle */}
              <div className="billing-toggle">
                <div className="billing-toggle-inner">
                  {[
                    { id: 'monthly', label: 'Monthly' },
                    { id: 'yearly', label: 'Yearly', save: 'Save up to 21%' },
                  ].map(b => (
                    <button
                      key={b.id}
                      className={`billing-btn ${billing === b.id ? 'active' : ''}`}
                      onClick={() => setBilling(b.id as any)}
                    >
                      {b.label}
                      {b.save && <span className="billing-save">{b.save}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Plans */}
              <div className="plans-grid">
                {PLANS.map(plan => {
                  const price = billing === 'yearly' ? plan.yearly : plan.monthly;
                  return (
                    <div key={plan.id} className={`plan-card ${plan.popular ? 'popular' : 'default'}`}>
                      {plan.popular && <div className="popular-badge">Most popular</div>}
                      <div className="plan-name" style={{ color: plan.popular ? '#fff' : C.ink }}>{plan.name}</div>
                      <div className="plan-tag" style={{ color: plan.popular ? 'rgba(255,255,255,.7)' : C.ink4 }}>{plan.tagline}</div>

                      <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${plan.popular ? 'rgba(255,255,255,.12)' : C.border}` }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
                          <span className="plan-price" style={{ color: plan.popular ? '#fff' : C.ink }}>${price}</span>
                          <span className="plan-period" style={{ color: plan.popular ? 'rgba(255,255,255,.6)' : C.ink4 }}>/mo</span>
                        </div>
                        <div style={{ fontSize: 11.5, color: plan.popular ? 'rgba(255,255,255,.6)' : C.ink4, marginTop: 6 }}>
                          {plan.id === 'free' ? 'Free forever' : (billing === 'yearly' ? 'Billed annually' : 'Billed monthly')}
                        </div>
                      </div>

                      <div style={{ flex: 1, marginBottom: 22 }}>
                        {plan.features.map(f => (
                          <div key={f.t} className="plan-feature">
                            <div className="feat-check" style={{
                              background: f.on ? C.brand : (plan.popular ? 'rgba(255,255,255,.08)' : C.bg2),
                              color: f.on ? '#fff' : (plan.popular ? 'rgba(255,255,255,.3)' : C.ink5),
                            }}>
                              {f.on ? '✓' : '·'}
                            </div>
                            <div className="feat-text" style={{
                              color: f.on ? (plan.popular ? '#fff' : C.ink2) : (plan.popular ? 'rgba(255,255,255,.4)' : C.ink5),
                              textDecoration: f.on ? 'none' : 'line-through',
                            }}>
                              {f.t}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button
                        className="plan-cta"
                        onClick={() => {
                          if (plan.id === 'free') router.replace('/(tabs)/home' as any);
                          else router.push('/payment' as any);
                        }}
                        style={{
                          background: plan.popular ? C.brand : (plan.id === 'free' ? C.bg2 : C.ink),
                          color: plan.popular ? '#fff' : (plan.id === 'free' ? C.ink2 : '#fff'),
                          border: plan.id === 'free' ? `1px solid ${C.border}` : 'none',
                        }}
                      >
                        {plan.cta}
                      </button>
                      {plan.popular && (
                        <div className="plan-note" style={{ color: 'rgba(255,255,255,.55)' }}>
                          Then $24/mo or $19/mo annually. Cancel any time.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Comparison table */}
              <div>
                <div className="section-title">Full feature breakdown</div>
                <div className="section-sub">Everything you get, side-by-side.</div>
                <div className="table-card">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th className="table-th">Feature</th>
                        {PLANS.map(p => <th key={p.id} className="table-th center">{p.name}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {TABLE_ROWS.map((row, i) => {
                        if ('cat' in row) {
                          return (
                            <tr key={'cat-' + i}>
                              <td colSpan={4} className="table-cat">{row.cat}</td>
                            </tr>
                          );
                        }
                        const [feat, a, b, cc] = row as string[];
                        return (
                          <tr key={i} className="table-row">
                            <td>{feat}</td>
                            {[a, b, cc].map((v, j) => (
                              <td key={j} className="center" style={{
                                color: v === '✓' ? C.brand : v === '—' ? C.ink5 : C.ink,
                                fontWeight: v === '✓' ? 700 : 500,
                                background: j === 1 ? C.bg2 : 'transparent',
                              }}>
                                {v}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Testimonials */}
              <div style={{ marginBottom: 64 }}>
                <div className="section-title">Why people stay</div>
                <div className="section-sub">1.4 million learners, average 7-month subscription length.</div>
                <div className="testimonials-grid">
                  {TESTIMONIALS.map((t, i) => (
                    <div key={i} className="testimonial-card">
                      <div className="testimonial-quote">"</div>
                      <div className="testimonial-text">{t.q}</div>
                      <div className="testimonial-footer">
                        <div className="testimonial-avatar">{t.who[0]}</div>
                        <div>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{t.who}</div>
                          <div style={{ fontSize: 11, color: C.ink4 }}>{t.loc} · {t.score}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trust strip */}
              <div className="trust-grid">
                {[
                  { ic: '⏱', t: 'Cancel anytime', s: 'No long-term lock-in' },
                  { ic: '🔒', t: 'Secure payments', s: 'Stripe · 256-bit SSL' },
                  { ic: '↺', t: '30-day refund', s: 'No questions asked' },
                  { ic: '✦', t: 'Score guarantee', s: 'On Max plan' },
                ].map(c => (
                  <div key={c.t} className="trust-card">
                    <div className="trust-icon">{c.ic}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: C.ink, marginBottom: 3 }}>{c.t}</div>
                    <div style={{ fontSize: 11.5, color: C.ink4 }}>{c.s}</div>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <div style={{ marginBottom: 48 }}>
                <div className="section-title">Frequently asked</div>
                <div className="faq-grid" style={{ marginTop: 20 }}>
                  {FAQ.map((f, i) => (
                    <div key={i} className="faq-card">
                      <button className="faq-btn" onClick={() => setOpenFaq(s => ({ ...s, [i]: !s[i] }))}>
                        <span className="faq-q">{f.q}</span>
                        <span className="faq-icon" style={{ transform: openFaq[i] ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                      </button>
                      {openFaq[i] && <div className="faq-a">{f.a}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Final CTA */}
              <div className="cta-card">
                <div className="cta-blob1" />
                <div className="cta-blob2" />
                <div className="cta-title">Try Pro free for 7 days.</div>
                <div className="cta-sub">Full access. No card charge until day 7. Cancel any time during the trial and pay nothing.</div>
                <button className="cta-btn" onClick={() => router.push('/payment' as any)}>
                  Start free trial →
                </button>
              </div>

            </div>
          </div>
        </div>
      </>
    );
}

// ── Main export ──────────────────────────────────────────────────────
export default function UpgradePage() {
  const { width } = useWindowDimensions();
  if (Platform.OS === 'web' && width >= 768) {
    return <UpgradePageWebCSS />;
  }
  return <UpgradePageNative />;
}

function UpgradePageNative() {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');
  const [activePlan, setActivePlan] = useState<'free' | 'pro' | 'max'>('pro');
  const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({ 0: true });

  const plan = PLANS.find(p => p.id === activePlan)!;
  const price = billing === 'yearly' ? plan.yearly : plan.monthly;

  if (isDesktop) {
    return <UpgradePageDesktop billing={billing} setBilling={setBilling} openFaq={openFaq} setOpenFaq={setOpenFaq} />;
  }

  return (
    <SafeAreaView style={m.safe}>
      <ScrollView contentContainerStyle={m.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={m.header}>
          <TouchableOpacity onPress={() => router.back()} style={m.backBtn}>
            <Text style={m.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={m.eyebrow}>Upgrade</Text>
            <Text style={m.title}>Pick your plan</Text>
            <Text style={m.sub}>7-day free trial. No card charge until day 7.</Text>
          </View>
        </View>

        {/* Billing toggle */}
        <View style={m.toggleRow}>
          {[
            { id: 'monthly', label: 'Monthly' },
            { id: 'yearly', label: 'Yearly · -21%' },
          ].map(b => (
            <TouchableOpacity
              key={b.id}
              style={[m.toggleBtn, billing === b.id && m.toggleBtnActive]}
              onPress={() => setBilling(b.id as any)}
            >
              <Text style={[m.toggleBtnText, billing === b.id && m.toggleBtnTextActive]}>{b.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Plan tabs */}
        <View style={m.planTabs}>
          {PLANS.map(p => {
            const sel = activePlan === p.id;
            return (
              <TouchableOpacity
                key={p.id}
                style={[m.planTab, sel && m.planTabActive]}
                onPress={() => setActivePlan(p.id as any)}
              >
                {p.popular && <View style={m.popularDot}><Text style={m.popularDotText}>★</Text></View>}
                <Text style={[m.planTabName, sel && m.planTabNameActive]}>{p.name}</Text>
                <Text style={[m.planTabPrice, sel && m.planTabPriceActive]}>
                  ${billing === 'yearly' ? p.yearly : p.monthly}{p.id !== 'free' ? '/mo' : ''}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Plan card */}
        <View style={[m.planCard, plan.popular && m.planCardPopular]}>
          <View style={m.priceRow}>
            <Text style={[m.bigPrice, plan.popular && { color: '#fff' }]}>${price}</Text>
            <Text style={[m.pricePer, plan.popular && { color: 'rgba(255,255,255,.6)' }]}>{plan.id === 'free' ? '' : '/mo'}</Text>
          </View>
          <Text style={[m.planTagline, plan.popular && { color: 'rgba(255,255,255,.7)' }]}>{plan.tagline}</Text>

          <View style={m.divider} />

          {plan.features.map((f, i) => (
            <View key={i} style={m.featureRow}>
              <View style={[m.featureCheck, { background: f.on ? C.brand : (plan.popular ? 'rgba(255,255,255,.08)' : C.bg2) } as any]}>
                <Text style={[m.featureCheckText, { color: f.on ? '#fff' : (plan.popular ? 'rgba(255,255,255,.3)' : C.ink5) }]}>
                  {f.on ? '✓' : '·'}
                </Text>
              </View>
              <Text style={[
                m.featureText,
                { color: f.on ? (plan.popular ? '#fff' : C.ink2) : (plan.popular ? 'rgba(255,255,255,.4)' : C.ink5) },
                !f.on && m.strikethrough,
              ]}>
                {f.t}
              </Text>
            </View>
          ))}
        </View>

        {/* Testimonial */}
        <View style={m.section}>
          <Text style={m.sectionLabel}>WHAT LEARNERS SAY</Text>
          <View style={m.testimonialCard}>
            <Text style={m.testimonialText}>"{TESTIMONIALS[0].q}"</Text>
            <Text style={m.testimonialBy}>— {TESTIMONIALS[0].who}, {TESTIMONIALS[0].loc} · {TESTIMONIALS[0].score}</Text>
          </View>
        </View>

        {/* FAQ */}
        <View style={m.section}>
          <Text style={m.sectionLabel}>FAQ</Text>
          {FAQ.slice(0, 4).map((f, i) => (
            <TouchableOpacity
              key={i}
              style={m.faqCard}
              onPress={() => setOpenFaq(s => ({ ...s, [i]: !s[i] }))}
              activeOpacity={0.7}
            >
              <View style={m.faqRow}>
                <Text style={m.faqQ}>{f.q}</Text>
                <Text style={[m.faqIcon, openFaq[i] && m.faqIconOpen]}>+</Text>
              </View>
              {openFaq[i] && <Text style={m.faqA}>{f.a}</Text>}
            </TouchableOpacity>
          ))}
        </View>

        {/* Trust */}
        <View style={m.trustRow}>
          {[
            { ic: '⏱', t: 'Cancel anytime' },
            { ic: '🔒', t: 'Secure pay' },
            { ic: '↺', t: '30-day refund' },
          ].map(c => (
            <View key={c.t} style={m.trustChip}>
              <Text style={m.trustIcon}>{c.ic}</Text>
              <Text style={m.trustText}>{c.t}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky CTA */}
      <View style={m.stickyBar}>
        <TouchableOpacity
          style={m.ctaBtn}
          onPress={() => {
            if (plan.id === 'free') router.replace('/(tabs)/home' as any);
            else router.push('/payment' as any);
          }}
          activeOpacity={0.85}
        >
          <Text style={m.ctaBtnText}>{plan.cta}</Text>
        </TouchableOpacity>
        <Text style={m.ctaNote}>Cancel any time · 30-day refund</Text>
      </View>
    </SafeAreaView>
  );
}

// Desktop component (rendered via conditional above)
function UpgradePageDesktop({ billing, setBilling, openFaq, setOpenFaq }: any) {
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Hero */}
        <View style={d.hero}>
          <View style={d.eyebrowPill}>
            <Text style={d.eyebrowText}>✦ Speak it. Score it. Own it.</Text>
          </View>
          <Text style={d.heroTitle}>Pick the plan that fits{'\n'}how seriously you take it.</Text>
          <Text style={d.heroSub}>7-day free trial on every paid plan. No card charged until day 7. Cancel any time, keep your progress.</Text>
        </View>

        {/* Billing toggle */}
        <View style={d.toggleWrap}>
          <View style={d.toggleInner}>
            {[
              { id: 'monthly', label: 'Monthly' },
              { id: 'yearly', label: 'Yearly', save: 'Save up to 21%' },
            ].map(b => (
              <TouchableOpacity
                key={b.id}
                style={[d.toggleBtn, billing === b.id && d.toggleBtnActive]}
                onPress={() => setBilling(b.id as any)}
              >
                <Text style={[d.toggleBtnText, billing === b.id && d.toggleBtnTextActive]}>{b.label}</Text>
                {b.save && billing !== 'monthly' && (
                  <View style={d.saveBadge}><Text style={d.saveBadgeText}>{b.save}</Text></View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Plans — 3 col */}
        <View style={d.plansRow}>
          {PLANS.map(plan => {
            const price = billing === 'yearly' ? plan.yearly : plan.monthly;
            return (
              <View key={plan.id} style={[d.planCard, plan.popular && d.planCardPopular]}>
                {plan.popular && (
                  <View style={d.popularBadge}>
                    <Text style={d.popularBadgeText}>Most popular</Text>
                  </View>
                )}
                <Text style={[d.planName, plan.popular && { color: '#fff' }]}>{plan.name}</Text>
                <Text style={[d.planTagline, plan.popular && { color: 'rgba(255,255,255,.7)' }]}>{plan.tagline}</Text>
                <View style={d.priceRow}>
                  <Text style={[d.bigPrice, plan.popular && { color: '#fff' }]}>${price}</Text>
                  <Text style={[d.pricePer, plan.popular && { color: 'rgba(255,255,255,.6)' }]}>/mo</Text>
                </View>
                <Text style={[d.planBillingNote, plan.popular && { color: 'rgba(255,255,255,.6)' }]}>
                  {plan.id === 'free' ? 'Free forever' : billing === 'yearly' ? 'Billed annually' : 'Billed monthly'}
                </Text>
                <View style={[d.planDivider, plan.popular && { backgroundColor: 'rgba(255,255,255,.12)' }]} />
                {plan.features.map((f, i) => (
                  <View key={i} style={d.featRow}>
                    <View style={[d.featCheck, { backgroundColor: f.on ? C.brand : (plan.popular ? 'rgba(255,255,255,.1)' : C.bg2) }]}>
                      <Text style={[d.featCheckText, { color: f.on ? '#fff' : (plan.popular ? 'rgba(255,255,255,.3)' : C.ink5) }]}>
                        {f.on ? '✓' : '·'}
                      </Text>
                    </View>
                    <Text style={[
                      d.featText,
                      { color: f.on ? (plan.popular ? '#fff' : C.ink2) : (plan.popular ? 'rgba(255,255,255,.4)' : C.ink5) },
                      !f.on && { textDecorationLine: 'line-through' },
                    ]}>
                      {f.t}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  style={[d.planCta, {
                    backgroundColor: plan.popular ? C.brand : (plan.id === 'free' ? C.bg2 : C.ink),
                    borderWidth: plan.id === 'free' ? 1 : 0,
                    borderColor: C.border,
                    marginTop: 'auto' as any,
                  }]}
                  onPress={() => {
                    if (plan.id === 'free') router.replace('/(tabs)/home' as any);
                    else router.push('/payment' as any);
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={[d.planCtaText, { color: plan.popular ? '#fff' : (plan.id === 'free' ? C.ink2 : '#fff') }]}>
                    {plan.cta}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

// ── Mobile styles ─────────────────────────────────────────────────────
const m = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingHorizontal: 18, paddingTop: 16, gap: 0 },

  header: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginBottom: 20 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center', marginTop: 2 },
  backArrow: { fontSize: 18, color: C.ink2 },
  eyebrow: { fontFamily: 'Inter_700Bold', fontSize: 11, color: C.brand, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  title:   { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: C.ink, lineHeight: 34, marginBottom: 6 },
  sub:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink3, lineHeight: 20 },

  toggleRow: { flexDirection: 'row', backgroundColor: C.bg2, borderRadius: 99, borderWidth: 1, borderColor: C.border, padding: 3, marginBottom: 16 },
  toggleBtn: { flex: 1, paddingVertical: 9, borderRadius: 99, alignItems: 'center' },
  toggleBtnActive: { backgroundColor: C.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  toggleBtnText: { fontFamily: 'Inter_500Medium', fontSize: 12.5, color: C.ink3 },
  toggleBtnTextActive: { fontFamily: 'Inter_700Bold', color: C.ink },

  planTabs: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  planTab: { flex: 1, paddingVertical: 12, paddingHorizontal: 8, borderRadius: 12, borderWidth: 1.5, borderColor: C.border, backgroundColor: C.card, alignItems: 'center', position: 'relative' },
  planTabActive: { borderColor: C.brand, backgroundColor: C.brandLight },
  popularDot: { position: 'absolute', top: -7, right: 5, backgroundColor: C.brand, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  popularDotText: { fontSize: 8, color: '#fff', fontWeight: '700' },
  planTabName: { fontFamily: 'Inter_700Bold', fontSize: 12.5, color: C.ink, marginBottom: 3 },
  planTabNameActive: { color: C.brand },
  planTabPrice: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4 },
  planTabPriceActive: { color: C.brand },

  planCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 20, marginBottom: 16 },
  planCardPopular: { backgroundColor: C.ink, borderWidth: 0 },

  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 4 },
  bigPrice: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 40, color: C.ink, lineHeight: 48 },
  pricePer: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink4 },
  planTagline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink4, marginBottom: 16 },

  divider: { height: 1, backgroundColor: C.border, marginBottom: 16 },

  featureRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 7 },
  featureCheck: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  featureCheckText: { fontSize: 10, fontWeight: '700' },
  featureText: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1, lineHeight: 20 },
  strikethrough: { textDecorationLine: 'line-through' },

  section: { marginBottom: 20 },
  sectionLabel: { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: C.ink4, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 10 },

  testimonialCard: { backgroundColor: C.card, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 18 },
  testimonialText: { fontFamily: 'Inter_400Regular', fontSize: 13.5, color: C.ink, lineHeight: 22, marginBottom: 12, fontStyle: 'italic' },
  testimonialBy: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: C.ink4 },

  faqCard: { backgroundColor: C.card, borderRadius: 12, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 8 },
  faqRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQ: { fontFamily: 'Inter_600SemiBold', fontSize: 13.5, color: C.ink, flex: 1, marginRight: 10 },
  faqIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.bg2, textAlign: 'center', lineHeight: 24, color: C.ink3, fontSize: 16 },
  faqIconOpen: { transform: [{ rotate: '45deg' }] },
  faqA: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink3, lineHeight: 20, marginTop: 10 },

  trustRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  trustChip: { flex: 1, backgroundColor: C.card, borderRadius: 10, borderWidth: 1, borderColor: C.border, padding: 12, alignItems: 'center', gap: 4 },
  trustIcon: { fontSize: 18 },
  trustText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink3, textAlign: 'center' },

  stickyBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.bg, borderTopWidth: 1, borderTopColor: C.border, paddingHorizontal: 18, paddingTop: 14, paddingBottom: 24 },
  ctaBtn: { backgroundColor: C.brand, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 8 },
  ctaBtnText: { fontFamily: 'Inter_700Bold', fontSize: 14, color: '#fff' },
  ctaNote: { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.ink4, textAlign: 'center' },
});

// Desktop styles
const d = StyleSheet.create({
  hero: { alignItems: 'center', paddingHorizontal: 36, paddingTop: 48, paddingBottom: 32 },
  eyebrowPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 5, backgroundColor: C.brandLight, borderRadius: 99, marginBottom: 18 },
  eyebrowText: { fontFamily: 'Inter_700Bold', fontSize: 12, color: C.brand, letterSpacing: 0.5 },
  heroTitle: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 50, color: C.ink, textAlign: 'center', lineHeight: 58, marginBottom: 14 },
  heroSub: { fontFamily: 'Inter_400Regular', fontSize: 15, color: C.ink3, textAlign: 'center', lineHeight: 24, maxWidth: 600 },

  toggleWrap: { alignItems: 'center', marginBottom: 32 },
  toggleInner: { flexDirection: 'row', backgroundColor: C.bg2, borderRadius: 99, borderWidth: 1, borderColor: C.border, padding: 4, gap: 2 },
  toggleBtn: { paddingVertical: 9, paddingHorizontal: 22, borderRadius: 99, flexDirection: 'row', alignItems: 'center', gap: 8 },
  toggleBtnActive: { backgroundColor: C.card, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 3, elevation: 2 },
  toggleBtnText: { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.ink3 },
  toggleBtnTextActive: { fontFamily: 'Inter_700Bold', color: C.ink },
  saveBadge: { backgroundColor: C.brand, borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
  saveBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10, color: '#fff', letterSpacing: 0.5 },

  plansRow: { flexDirection: 'row', paddingHorizontal: 36, gap: 18, marginBottom: 64 },
  planCard: { flex: 1, backgroundColor: C.card, borderRadius: 18, padding: 28, borderWidth: 1, borderColor: C.border, position: 'relative' },
  planCardPopular: { backgroundColor: C.ink, borderWidth: 0, shadowColor: C.brand, shadowOpacity: 0.25, shadowRadius: 24, elevation: 8 },
  popularBadge: { position: 'absolute', top: -12, alignSelf: 'center', backgroundColor: C.brand, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 5 },
  popularBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10.5, color: '#fff', letterSpacing: 1, textTransform: 'uppercase' },

  planName: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 28, color: C.ink, marginBottom: 4 },
  planTagline: { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.ink4, marginBottom: 18 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 5 },
  bigPrice: { fontFamily: 'DMSerifDisplay_400Regular', fontSize: 46, color: C.ink, lineHeight: 52 },
  pricePer: { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.ink4 },
  planBillingNote: { fontFamily: 'Inter_400Regular', fontSize: 11.5, color: C.ink4, marginTop: 6, marginBottom: 18 },
  planDivider: { height: 1, backgroundColor: C.border, marginBottom: 18 },

  featRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 7 },
  featCheck: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 },
  featCheckText: { fontSize: 10, fontWeight: '700' },
  featText: { fontFamily: 'Inter_400Regular', fontSize: 13, flex: 1, lineHeight: 20 },

  planCta: { borderRadius: 11, paddingVertical: 13, alignItems: 'center', marginTop: 24 },
  planCtaText: { fontFamily: 'Inter_700Bold', fontSize: 13.5 },
});
