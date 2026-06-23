// ── Pricing / Paywall ─────────────────────────────────────
const { useState: useStateP } = React;

const PRICING_PLANS = [
  {
    id:'free', name:'Free', tagline:'Forever. No card needed.',
    monthly:0, yearly:0,
    features:[
      { t:'1 session per day', on:true },
      { t:'English only', on:true },
      { t:'Basic streak & progress', on:true },
      { t:'5 AI Tutor messages / day', on:true },
      { t:'Practice exams', on:false },
      { t:'AI Writing feedback', on:false },
      { t:'Offline mode', on:false },
      { t:'Speaking with mic', on:false },
    ],
    cta:'Continue with Free',
  },
  {
    id:'pro', name:'Pro', tagline:'For serious learners.',
    monthly:24, yearly:19, yearlyTotal:228,
    features:[
      { t:'All 10+ languages', on:true },
      { t:'Unlimited daily sessions', on:true },
      { t:'Detailed progress & analytics', on:true },
      { t:'Unlimited AI Tutor', on:true },
      { t:'Unlimited practice exams', on:true },
      { t:'AI Writing feedback', on:true },
      { t:'Offline mode', on:true },
      { t:'Speaking with mic', on:true },
    ],
    popular:true,
    cta:'Start 7-day free trial',
  },
  {
    id:'max', name:'Max', tagline:'Exam-prep grade.',
    monthly:59, yearly:49, yearlyTotal:588,
    features:[
      { t:'Everything in Pro', on:true },
      { t:'Unlimited practice exams', on:true },
      { t:'Live speaking partners (4 hr/mo)', on:true },
      { t:'Personal study coach', on:true },
      { t:'Score guarantee or refund', on:true },
      { t:'Priority support · 4 hr SLA', on:true },
      { t:'Early access to new features', on:true },
      { t:'Family sharing · 4 seats', on:true },
    ],
    cta:'Go Max',
  },
];

const TESTIMONIALS = [];

const FAQ = [
  { q:'Can I cancel any time?',         a:'Yes — cancel from Settings → Subscription. You keep Pro access until the end of your billing period, then drop to Free with no data loss.' },
  { q:'How does the free trial work?',  a:'7 days of full Pro access. We\'ll remind you 2 days before it ends. Cancel during the trial and you pay nothing.' },
  { q:'Can I switch plans later?',      a:'Yes, monthly ↔ yearly any time. Upgrades pro-rate immediately; downgrades apply at your next renewal.' },
  { q:'What\'s the score guarantee?',   a:'Max includes a refund if you don\'t hit your target band/score after completing the recommended plan. Full T&Cs in our help centre.' },
  { q:'Do you offer student discounts?',a:'Yes — 50% off Pro with a verified .edu email or student ID. Apply via Settings → Plan after upgrading.' },
  { q:'Is there a family plan?',        a:'Max includes 4 seats. Each member gets their own profile, progress, and AI tutor history.' },
];

// ── helpers
function CheckRow({ on, t }) {
  return (
    <div style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'9px 0' }}>
      <div style={{ width:18, height:18, borderRadius:9, background: on ? T.brand : T.bg2, color: on ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, marginTop:1 }}>{on ? '✓' : '·'}</div>
      <div style={{ fontSize:13, color: on ? T.ink2 : T.ink5, textDecoration: on ? 'none' : 'line-through', lineHeight:1.45 }}>{t}</div>
    </div>
  );
}

function PlanCard({ plan, billing, recommended }) {
  const price = billing === 'yearly' ? plan.yearly : plan.monthly;
  const period = '/mo';
  const yearlyNote = billing === 'yearly' && plan.yearlyTotal ? `$${plan.yearlyTotal}/yr · billed annually` : null;
  const isPopular = plan.popular;
  return (
    <div style={{ background: isPopular ? T.ink : T.card, color: isPopular ? '#fff' : T.ink, borderRadius:18, padding:'28px 26px', border: isPopular ? 'none' : `1px solid ${T.border}`, boxShadow: isPopular ? `0 10px 30px ${T.brand}33` : `0 1px 0 rgba(0,0,0,.02)`, position:'relative', display:'flex', flexDirection:'column' }}>
      {isPopular && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', padding:'5px 12px', background:T.brand, color:'#fff', borderRadius:99, fontSize:10.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Most popular</div>}
      <div style={{ marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
          <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1, color: isPopular ? '#fff' : T.ink }}>{plan.name}</div>
          {recommended && <Chip label="For you" accent={T.brand} bg={isPopular ? 'rgba(255,255,255,.12)' : T.brandLight}/>}
        </div>
        <div style={{ fontSize:13, color: isPopular ? 'rgba(255,255,255,.7)' : T.ink4 }}>{plan.tagline}</div>
      </div>

      <div style={{ marginBottom:22, paddingBottom:22, borderBottom:`1px solid ${isPopular ? 'rgba(255,255,255,.12)' : T.hairline}` }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          <span style={{ fontFamily:T.serif, fontSize:46, lineHeight:1, color: isPopular ? '#fff' : T.ink }}>${price}</span>
          <span style={{ fontSize:14, color: isPopular ? 'rgba(255,255,255,.6)' : T.ink4 }}>{period}</span>
        </div>
        <div style={{ fontSize:11.5, color: isPopular ? 'rgba(255,255,255,.6)' : T.ink4, marginTop:6 }}>{plan.id === 'free' ? 'Free forever' : (billing === 'yearly' ? 'Billed annually' : 'Billed monthly')}</div>
      </div>

      <div style={{ flex:1, marginBottom:22 }}>
        {plan.features.map(f => (
          <div key={f.t} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'8px 0' }}>
            <div style={{ width:18, height:18, borderRadius:9, background: f.on ? (isPopular ? T.brand : T.brand) : (isPopular ? 'rgba(255,255,255,.08)' : T.bg2), color: f.on ? '#fff' : (isPopular ? 'rgba(255,255,255,.3)' : T.ink5), display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, marginTop:1 }}>{f.on ? '✓' : '·'}</div>
            <div style={{ fontSize:13, color: f.on ? (isPopular ? '#fff' : T.ink2) : (isPopular ? 'rgba(255,255,255,.4)' : T.ink5), textDecoration: f.on ? 'none' : 'line-through', lineHeight:1.45 }}>{f.t}</div>
          </div>
        ))}
      </div>

      <button onClick={() => { if (plan.id === 'free') (window.__nav||(()=>{}))(window.__user ? 'dashboard' : 'auth_signup'); else { const key = plan.id + '_' + (billing === 'yearly' ? 'yearly' : 'monthly'); window.payFor && window.payFor(key); } }} style={{ width:'100%', padding:'13px 16px', borderRadius:11, background: isPopular ? T.brand : (plan.id === 'free' ? T.bg2 : T.ink), color: isPopular ? '#fff' : (plan.id === 'free' ? T.ink2 : '#fff'), fontSize:13.5, fontWeight:700, cursor:'pointer', border: plan.id === 'free' ? `1px solid ${T.border}` : 'none' }}>{plan.cta}</button>
      {plan.id === 'pro' && <div style={{ textAlign:'center', fontSize:11, color: 'rgba(255,255,255,.55)', marginTop:8 }}>Then $24/mo or $19/mo annually. Cancel any time.</div>}
    </div>
  );
}

// ── Desktop pricing
function PricingPage() {
  const [billing, setBilling] = useStateP('yearly');

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'40px 36px 80px' }}>
        <div style={{ maxWidth:1180, margin:'0 auto' }}>
          {/* Hero */}
          <div style={{ textAlign:'center', marginBottom:32, maxWidth:680, margin:'0 auto 32px' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 12px', background:T.brandLight || T.bg2, color:T.brand, borderRadius:99, fontSize:11.5, fontWeight:700, marginBottom:18, letterSpacing:'.04em' }}>
              <span>✦</span> Speak it. Score it. Own it.
            </div>
            <div style={{ fontFamily:T.serif, fontSize:54, color:T.ink, lineHeight:1.05, marginBottom:14, letterSpacing:'-.01em' }}>Pick the plan that fits<br/>how seriously you take it.</div>
            <div style={{ fontSize:15, color:T.ink3, lineHeight:1.6 }}>7-day free trial on every paid plan. No card charged until day 7. Cancel any time, keep your progress.</div>
          </div>

          {/* Billing toggle */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:32 }}>
            <div style={{ display:'inline-flex', padding:4, background:T.bg2, borderRadius:99, border:`1px solid ${T.border}` }}>
              {[
                { id:'monthly', label:'Monthly' },
                { id:'yearly',  label:'Yearly', save:'Save up to 21%' },
              ].map(b => {
                const sel = billing === b.id;
                return (
                  <button key={b.id} onClick={() => setBilling(b.id)} style={{ padding:'9px 20px', borderRadius:99, background: sel ? T.card : 'transparent', boxShadow: sel ? `0 1px 3px rgba(0,0,0,.06)` : 'none', fontSize:13, fontWeight:sel ? 700 : 500, color: sel ? T.ink : T.ink3, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                    {b.label}
                    {b.save && <span style={{ fontSize:10, padding:'2px 7px', background:T.brand, color:'#fff', borderRadius:99, fontWeight:700, letterSpacing:'.04em' }}>{b.save}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plans */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18, marginBottom:60, alignItems:'stretch' }}>
            {PRICING_PLANS.map(p => <PlanCard key={p.id} plan={p} billing={billing} recommended={p.id === 'pro'}/>)}
          </div>

          {/* Comparison table */}
          <div style={{ marginBottom:60 }}>
            <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.1, marginBottom:6 }}>Full feature breakdown</div>
            <div style={{ fontSize:13, color:T.ink4, marginBottom:24 }}>Everything you get, side-by-side. Hover any row for details.</div>
            <Card padding={0} style={{ overflow:'hidden' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr style={{ background:T.bg2, borderBottom:`1px solid ${T.border}` }}>
                    <th style={{ textAlign:'left', padding:'14px 24px', fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Feature</th>
                    {PRICING_PLANS.map(p => (
                      <th key={p.id} style={{ textAlign:'center', padding:'14px 16px', fontSize:13, color:T.ink, fontWeight:700, minWidth:120 }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { cat:'Learning' },
                    ['Languages',           '1',          'All 26',    'All 26'],
                    ['Daily lesson length', '5 min',      'Unlimited',  'Unlimited'],
                    ['Spaced repetition',   '✓',          '✓',          '✓'],
                    ['Adaptive difficulty', '—',          '✓',          '✓'],
                    ['Offline mode',        '—',          '✓',          '✓'],
                    { cat:'AI features' },
                    ['AI Tutor messages',   '5/day',      'Unlimited',  'Unlimited'],
                    ['Speaking with mic',   '—',          '✓',          '✓'],
                    ['AI Writing feedback', '—',          '✓',          '✓'],
                    ['Personal coach',      '—',          '—',          '✓'],
                    { cat:'Exam prep' },
                    ['Practice exams',      '—',          '1/month',    'Unlimited'],
                    ['Score guarantee',     '—',          '—',          '✓'],
                    ['Live speaking',       '—',          '—',          '4 hr/mo'],
                    { cat:'Account' },
                    ['Family seats',        '1',          '1',          '4'],
                    ['Support SLA',         'Community',  '24h',        '4h priority'],
                  ].map((row, i) => {
                    if (row.cat) return (
                      <tr key={'cat-'+i} style={{ background:T.bg }}>
                        <td colSpan={4} style={{ padding:'14px 24px 6px', fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', borderTop:`1px solid ${T.hairline}` }}>{row.cat}</td>
                      </tr>
                    );
                    const [feat, a, b, c] = row;
                    return (
                      <tr key={i} style={{ borderBottom:`1px solid ${T.hairline}` }}>
                        <td style={{ padding:'12px 24px', color:T.ink2 }}>{feat}</td>
                        {[a, b, c].map((v, j) => (
                          <td key={j} style={{ padding:'12px 16px', textAlign:'center', color: v === '✓' ? T.brand : v === '—' ? T.ink5 : T.ink, fontWeight: v === '✓' ? 700 : 500, background: j === 1 ? T.bg2 : 'transparent' }}>{v}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Trust strip */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:60 }}>
            {[
              { ic:'⏱', t:'Cancel anytime',   s:'No long-term lock-in' },
              { ic:'🔒', t:'Secure payments',  s:'Stripe · 256-bit SSL' },
              { ic:'↺', t:'30-day refund',    s:'No questions asked' },
              { ic:'✦', t:'Score guarantee',  s:'On Max plan' },
            ].map(c => (
              <Card key={c.t} padding={18} style={{ textAlign:'center' }}>
                <div style={{ fontSize:24, marginBottom:8 }}>{c.ic}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:3 }}>{c.t}</div>
                <div style={{ fontSize:11.5, color:T.ink4 }}>{c.s}</div>
              </Card>
            ))}
          </div>

          {/* FAQ */}
          <div style={{ marginBottom:30 }}>
            <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.1, marginBottom:24 }}>Frequently asked</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {FAQ.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i < 2}/>)}
            </div>
          </div>

          {/* Final CTA */}
          <Card padding={36} style={{ background:T.brandGrad || T.brand, color:'#fff', textAlign:'center', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:100, background:'rgba(255,255,255,.08)' }}/>
            <div style={{ position:'absolute', bottom:-60, left:-20, width:160, height:160, borderRadius:80, background:'rgba(255,255,255,.05)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ fontFamily:T.serif, fontSize:34, lineHeight:1.1, marginBottom:10 }}>Try Pro free for 7 days.</div>
              <div style={{ fontSize:14, opacity:.85, marginBottom:22, maxWidth:480, margin:'0 auto 22px' }}>Full access. No card charge until day 7. Cancel any time during the trial and pay nothing.</div>
              <button onClick={() => { window.payFor ? window.payFor('pro_monthly') : (window.__nav && window.__nav(window.__user ? 'pricing' : 'auth_signup')); }} style={{ padding:'14px 28px', borderRadius:11, background:'#fff', color:T.brand, fontSize:14, fontWeight:700, cursor:'pointer', border:'none' }}>Start free trial →</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen }) {
  const [open, setOpen] = useStateP(!!defaultOpen);
  return (
    <Card padding={0} style={{ overflow:'hidden' }}>
      <button onClick={() => setOpen(!open)} style={{ width:'100%', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, background:'transparent', textAlign:'left', cursor:'pointer' }}>
        <div style={{ fontSize:13.5, color:T.ink, fontWeight:600 }}>{q}</div>
        <div style={{ width:24, height:24, borderRadius:12, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, transition:'transform .2s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</div>
      </button>
      {open && <div style={{ padding:'0 20px 18px', fontSize:12.5, color:T.ink3, lineHeight:1.6 }}>{a}</div>}
    </Card>
  );
}

// ── Mobile pricing ──────────────────────────────────────
function MPricingPage() {
  const [billing, setBilling] = useStateP('yearly');
  const [activePlan, setActivePlan] = useStateP('pro');
  const plan = PRICING_PLANS.find(p => p.id === activePlan);
  const price = billing === 'yearly' ? plan.yearly : plan.monthly;

  return (
    <MobileBody noTabs>
      <div style={{ padding:'14px 16px 8px' }}>
        <div style={{ fontSize:11, color:T.brand, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Upgrade</div>
        <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.1, marginBottom:6 }}>Pick your plan</div>
        <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5 }}>7-day free trial. No card charge until day 7.</div>
      </div>

      <div style={{ padding:'12px 16px' }}>
        <div style={{ display:'inline-flex', padding:3, background:T.bg2, borderRadius:99, border:`1px solid ${T.border}`, width:'100%' }}>
          {[{ id:'monthly', label:'Monthly' }, { id:'yearly', label:'Yearly · -33%' }].map(b => {
            const sel = billing === b.id;
            return <button key={b.id} onClick={() => setBilling(b.id)} style={{ flex:1, padding:'8px 12px', borderRadius:99, background: sel ? T.card : 'transparent', boxShadow: sel ? `0 1px 3px rgba(0,0,0,.06)` : 'none', fontSize:12, fontWeight: sel ? 700 : 500, color: sel ? T.ink : T.ink3 }}>{b.label}</button>;
          })}
        </div>
      </div>

      {/* Plan tabs */}
      <div style={{ padding:'4px 16px 12px', display:'flex', gap:6 }}>
        {PRICING_PLANS.map(p => {
          const sel = activePlan === p.id;
          return (
            <button key={p.id} onClick={() => setActivePlan(p.id)} style={{ flex:1, padding:'12px 8px', borderRadius:11, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, position:'relative' }}>
              <div style={{ fontSize:12, fontWeight:700, color: sel ? T.brand : T.ink, marginBottom:3 }}>{p.name}</div>
              <div style={{ fontSize:10, color: sel ? T.brand : T.ink4 }}>${billing === 'yearly' ? p.yearly : p.monthly}{p.id !== 'free' ? '/mo' : ''}</div>
              {p.popular && <div style={{ position:'absolute', top:-7, right:6, padding:'2px 6px', borderRadius:5, background:T.brand, color:'#fff', fontSize:8.5, fontWeight:700, letterSpacing:'.06em' }}>POPULAR</div>}
            </button>
          );
        })}
      </div>

      <div style={{ padding:'8px 16px 18px' }}>
        <Card padding={20} style={{ background: plan.popular ? T.ink : T.card, color: plan.popular ? '#fff' : T.ink, position:'relative' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:6 }}>
            <span style={{ fontFamily:T.serif, fontSize:38, lineHeight:1, color: plan.popular ? '#fff' : T.ink }}>${price}</span>
            <span style={{ fontSize:13, color: plan.popular ? 'rgba(255,255,255,.6)' : T.ink4 }}>{plan.id === 'free' ? '' : '/mo'}</span>
          </div>
          <div style={{ fontSize:12, color: plan.popular ? 'rgba(255,255,255,.7)' : T.ink4, marginBottom:18 }}>{plan.tagline}</div>
          {plan.features.map(f => (
            <div key={f.t} style={{ display:'flex', gap:10, alignItems:'flex-start', padding:'7px 0' }}>
              <div style={{ width:18, height:18, borderRadius:9, background: f.on ? T.brand : (plan.popular ? 'rgba(255,255,255,.08)' : T.bg2), color: f.on ? '#fff' : (plan.popular ? 'rgba(255,255,255,.3)' : T.ink5), display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0, marginTop:1 }}>{f.on ? '✓' : '·'}</div>
              <div style={{ fontSize:12.5, color: f.on ? (plan.popular ? '#fff' : T.ink2) : (plan.popular ? 'rgba(255,255,255,.4)' : T.ink5), textDecoration: f.on ? 'none' : 'line-through' }}>{f.t}</div>
            </div>
          ))}
        </Card>
      </div>


      <div style={{ padding:'4px 16px 14px' }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>FAQ</div>
        {FAQ.slice(0, 4).map((f, i) => <FaqItem key={i} q={f.q} a={f.a}/>)}
      </div>

      <div style={{ padding:'14px 16px 18px', borderTop:`1px solid ${T.hairline}`, background:T.bg, position:'sticky', bottom:0 }}>
        <Btn label={plan.cta} accent={T.brand} fullWidth/>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink4, marginTop:8 }}>Cancel any time · 30-day refund</div>
      </div>
    </MobileBody>
  );
}

Object.assign(window, { PricingPage, MPricingPage });
