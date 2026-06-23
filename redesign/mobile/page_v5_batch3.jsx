// ── Mobile · v5 redesigns · Batch 3 ───────────────────────────────
// Receipts · Refer-a-Friend · Add Language · Checkout · Rate Limit

const useStV5B3 = React.useState;

const V5b3Pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b3Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b3Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);

// ══════════════════════════════════════════════════════════════════
// RECEIPTS
// ══════════════════════════════════════════════════════════════════
function MReceiptsPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const u = (typeof window !== 'undefined' && window.__user) || {};
  const isPaid = (u.plan === 'pro' || u.plan === 'max');
  return (
    <>
      <MobileHeader back title="Receipts"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b3Pre eyebrow="BILLING" title="Receipts & invoices" lede="Your payment history is kept in the secure billing portal."/>
        <MCard style={{ padding:18 }}>
          {isPaid ? (
            <div>
              <div style={{ fontSize:13, color:T.ink2, lineHeight:1.6, marginBottom:16 }}>
                View and download every invoice and receipt, update your card, or change your billing address in the secure billing portal.
              </div>
              <button onClick={() => window.FL && window.FL.openBillingPortal && window.FL.openBillingPortal()} style={{ width:'100%', padding:'13px', borderRadius:11, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, border:'none' }}>Open billing portal</button>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:13, color:T.ink2, lineHeight:1.6, marginBottom:16 }}>
                You're on the Free plan, so there are no charges or invoices yet. Upgrade and your receipts will appear in the billing portal.
              </div>
              <button onClick={()=>nav('pricing')} style={{ width:'100%', padding:'13px', borderRadius:11, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, border:'none' }}>See plans</button>
            </div>
          )}
        </MCard>
      </MobileBody>
    </>
  );
}

function MReferPageV5() {
  const [copied, setCopied] = useStV5B3(false);
  const [code, setCode] = useStV5B3('');
  const nav = (id) => window.__nav && window.__nav(id);
  React.useEffect(function () {
    if (window.FL && window.FL.social && window.FL.social._uid) {
      window.FL.social._uid().then(function (id) { if (id) setCode('FL-' + String(id).slice(0, 8).toUpperCase()); }).catch(function () {});
    }
  }, []);
  const link = code ? ((typeof window !== 'undefined' ? window.location.origin : '') + '/?ref=' + code) : '';
  const copy = () => { if (!link) return; try { navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch (e) {} };
  const share = () => { if (!link) return; if (navigator.share) { navigator.share({ title: 'Join me on Fluentra', text: 'Learn a language with me on Fluentra', url: link }).catch(function () {}); } else { copy(); } };
  const whatsapp = () => { if (!link) return; window.open('https://wa.me/?text=' + encodeURIComponent('Learn a language with me on Fluentra \u2014 ' + link), '_blank'); };
  const steps = [
    { n:'1', t:'Share your link', d:'Send your personal invite link to a friend.' },
    { n:'2', t:'They join Fluentra', d:'Your friend signs up and starts learning.' },
    { n:'3', t:'You both win', d:'When they subscribe, you each get a month of Pro free.' },
  ];
  return (
    <>
      <MobileHeader back title="Refer a friend"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:T.brandGrad, borderRadius:18, padding:'24px 18px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14 }}>
          <V5b3Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:'.14em', marginBottom:9 }}>GIVE A MONTH · GET A MONTH</div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.02, letterSpacing:'-.02em', marginBottom:9 }}>Bring a friend along.</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.85)', lineHeight:1.5 }}>They get <b style={{ color:'#fff' }}>1 month of Pro free</b>. You get <b style={{ color:'#fff' }}>1 month free</b> when they subscribe.</div>
          </div>
        </div>

        {V5b3Lbl('YOUR INVITE LINK')}
        <div style={{ display:'flex', gap:8, alignItems:'stretch', marginBottom:12 }}>
          <div style={{ flex:1, minWidth:0, background:T.card, border:`1.5px dashed ${T.brand}`, borderRadius:13, padding:'14px 16px', boxShadow:MT.shadowSm, display:'flex', alignItems:'center' }}>
            <div style={{ fontSize:12.5, color:link ? T.ink : T.ink4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{link || 'Sign in to get your link'}</div>
          </div>
          <button onClick={copy} disabled={!link} style={{ padding:'0 16px', borderRadius:13, background: copied ? '#5A9C7A' : T.brand, color:'#fff', fontSize:12, fontWeight:700, boxShadow:`0 4px 12px ${T.brand}55`, border:'none', opacity: link ? 1 : .5 }}>{copied ? 'Copied' : 'Copy'}</button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:16 }}>
          <button onClick={share} disabled={!link} style={{ padding:'13px', borderRadius:12, background:T.ink, color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity: link ? 1 : .5 }}>{Icon.share ? Icon.share({width:13,height:13}) : '\u2197'} Share link</button>
          <button onClick={whatsapp} disabled={!link} style={{ padding:'13px', borderRadius:12, background:T.card, color:T.ink, fontSize:12, fontWeight:700, border:`1px solid ${T.hairline}`, opacity: link ? 1 : .5 }}>WhatsApp</button>
        </div>

        {V5b3Lbl('HOW IT WORKS')}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {steps.map((st, i) => (
            <div key={st.n} style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:30, height:30, borderRadius:15, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14, fontWeight:700, flexShrink:0 }}>{st.n}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.25 }}>{st.t}</div>
                <div style={{ fontSize:11.5, color:T.ink4, marginTop:2, lineHeight:1.5 }}>{st.d}</div>
              </div>
            </div>
          ))}
        </MCard>
      </MobileBody>
    </>
  );
}


// ══════════════════════════════════════════════════════════════════
// ADD LANGUAGE
// ══════════════════════════════════════════════════════════════════
function MAddLanguageV5() {
  const [picked, setPicked] = useStV5B3(null);
  const [level, setLevel] = useStV5B3(null);
  const [search, setSearch] = useStV5B3('');
  const nav = (id) => window.__nav && window.__nav(id);
  const langs = [
    { code:'es', f:'🇪🇸', l:'Spanish',     spk:'500M speakers' },
    { code:'fr', f:'🇫🇷', l:'French',      spk:'280M speakers' },
    { code:'de', f:'🇩🇪', l:'German',      spk:'130M speakers' },
    { code:'it', f:'🇮🇹', l:'Italian',     spk:'85M speakers' },
    { code:'pt', f:'🇵🇹', l:'Portuguese',  spk:'260M speakers' },
    { code:'jp', f:'🇯🇵', l:'Japanese',    spk:'128M speakers' },
    { code:'ko', f:'🇰🇷', l:'Korean',      spk:'82M speakers' },
    { code:'zh', f:'🇨🇳', l:'Mandarin',    spk:'1.1B speakers' },
    { code:'ar', f:'🇸🇦', l:'Arabic',      spk:'370M speakers' },
    { code:'hi', f:'🇮🇳', l:'Hindi',       spk:'600M speakers' },
  ];
  const filtered = search ? langs.filter(l => l.l.toLowerCase().includes(search.toLowerCase())) : langs;
  const levels = [
    { id:'A1', l:"I'm a beginner",       d:'Just getting started — no prior knowledge.' },
    { id:'A2', l:'I know some basics',   d:'I can handle simple, predictable conversations.' },
    { id:'B1', l:'I can hold a chat',    d:'Comfortable with day-to-day interactions.' },
    { id:'B2', l:"I'm conversational",   d:'Confident across most everyday topics.' },
    { id:'C1', l:"I'm advanced",         d:'Reading and speaking with nuance and ease.' },
  ];
  return (
    <>
      <MobileHeader back title={picked ? 'Choose your level' : 'Add a language'}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {!picked ? <>
          <V5b3Pre eyebrow="STEP 1 OF 2 · YOUR NEXT LANGUAGE" title="Pick a language" lede="Add another and we'll spin up a curriculum, vocab deck and weekly goals — usually in under a minute."/>
          <div style={{ display:'flex', alignItems:'center', gap:9, padding:'10px 13px', background:T.card, border:`1px solid ${T.hairline}`, borderRadius:11, marginBottom:11 }}>
            <span style={{ color:T.ink4, fontSize:14 }}>{Icon.search ? Icon.search({width:13,height:13}) : '⌕'}</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search languages…" style={{ flex:1, fontSize:13, color:T.ink, outline:'none', border:'none', background:'transparent' }}/>
          </div>
          <MCard style={{ padding:0, overflow:'hidden' }}>
            {filtered.map((l, i) => (
              <button key={l.code} onClick={()=>setPicked(l)} style={{ width:'100%', display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background:'none', textAlign:'left' }}>
                <span style={{ fontSize:24, lineHeight:1 }}>{l.f}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:T.serif, fontSize:16, fontWeight:600, color:T.ink, lineHeight:1.1 }}>{l.l}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{l.spk}</div>
                </div>
                <span style={{ color:T.ink5, fontSize:18 }}>›</span>
              </button>
            ))}
          </MCard>
        </> : <>
          <div style={{ display:'flex', alignItems:'center', gap:12, padding:14, background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, marginBottom:14, boxShadow:MT.shadowSm }}>
            <span style={{ fontSize:32 }}>{picked.f}</span>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.1 }}>{picked.l}</div>
              <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{picked.spk}</div>
            </div>
            <button onClick={()=>setPicked(null)} style={{ fontSize:11, fontWeight:700, color:T.brand, background:'none', border:'none' }}>Change</button>
          </div>
          <V5b3Pre eyebrow="STEP 2 OF 2 · YOUR LEVEL" title="Where are you starting?" lede="Be honest — we'll calibrate the curriculum to where you actually are, then move from there."/>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {levels.map(lv => {
              const a = level === lv.id;
              return (
                <button key={lv.id} onClick={()=>setLevel(lv.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:13, background: a ? T.ink : T.card, border:`1px solid ${a ? T.ink : T.hairline}`, textAlign:'left', boxShadow: a ? MT.shadowMd : MT.shadowSm, color: a ? '#fff' : T.ink }}>
                  <div style={{ width:42, height:42, borderRadius:21, background: a ? 'rgba(255,255,255,.16)' : T.bg2, color: a ? '#fff' : T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13, fontWeight:700, flexShrink:0 }}>{lv.id}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, lineHeight:1.2 }}>{lv.l}</div>
                    <div style={{ fontSize:10.5, color: a ? 'rgba(255,255,255,.65)' : T.ink4, marginTop:3, lineHeight:1.4 }}>{lv.d}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button onClick={()=>{ if (level) { if (window.FL && window.FL.addLanguage && picked) { try { Promise.resolve(window.FL.addLanguage({ code: picked.code, english: picked.l, native: picked.native || picked.l, level: level })).catch(function(){}); } catch(e){} } nav('lang'); } }} disabled={!level} style={{ width:'100%', marginTop:18, padding:'14px', borderRadius:13, background: level ? T.brandGrad : T.bg3, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow: level ? `0 6px 16px ${T.brand}40` : 'none' }}>Add {picked.l} to my plan</button>
        </>}
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// CHECKOUT
// ══════════════════════════════════════════════════════════════════
function MCheckoutPageV5() {
  const [billing, setBilling] = useStV5B3('annual');
  const [busy, setBusy] = useStV5B3(false);
  const nav = (id) => window.__nav && window.__nav(id);
  const total = billing === 'annual' ? 228 : 24;
  const planKey = 'pro_' + (billing === 'annual' ? 'annual' : 'monthly');
  const startPay = () => {
    if (busy) return;
    if (window.FL && window.FL.startCheckout) { setBusy(true); window.FL.startCheckout(planKey); setTimeout(()=>setBusy(false), 6000); }
    else { window.__nav && window.__nav('auth_login'); }
  };
  return (
    <>
      <MobileHeader back title="Checkout"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b3Pre eyebrow="STEP 3 OF 3 · ALMOST THERE" title="Confirm and unlock Pro" lede="Cancel anytime — first month is fully refundable, no questions."/>

        {V5b3Lbl('PLAN')}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          {[
            { id:'annual',  l:'Annual',   p:'$228/yr',    sub:'$19/mo · save 21%', badge:'BEST VALUE' },
            { id:'monthly', l:'Monthly',  p:'$24/mo',     sub:'Flexible · cancel anytime', badge:null },
          ].map(p => {
            const a = billing === p.id;
            return (
              <button key={p.id} onClick={()=>setBilling(p.id)} style={{ display:'flex', alignItems:'center', gap:11, padding:14, borderRadius:13, background: a ? T.ink : T.card, border:`1.5px solid ${a ? T.ink : T.hairline}`, color: a ? '#fff' : T.ink, textAlign:'left', boxShadow: a ? MT.shadowMd : MT.shadowSm, position:'relative' }}>
                <div style={{ width:20, height:20, borderRadius:10, border:`1.5px solid ${a ? '#fff' : T.border}`, background: a ? T.brand : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{a && <span style={{ width:7, height:7, borderRadius:4, background:'#fff' }}/>}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                    <span style={{ fontFamily:T.serif, fontSize:16, fontWeight:600 }}>{p.l}</span>
                    {p.badge && <span style={{ fontSize:8.5, fontWeight:800, color:'#fff', background:T.brand, padding:'2px 7px', borderRadius:99, letterSpacing:'.1em' }}>{p.badge}</span>}
                  </div>
                  <div style={{ fontSize:11, color: a ? 'rgba(255,255,255,.6)' : T.ink4, marginTop:3 }}>{p.sub}</div>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:18, fontWeight:600 }}>{p.p}</div>
              </button>
            );
          })}
        </div>

        {V5b3Lbl('PAYMENT METHOD')}
        <MCard style={{ padding:14, marginBottom:14, display:'flex', alignItems:'center', gap:11 }}>
          <div style={{ width:44, height:30, borderRadius:6, background:'linear-gradient(135deg,#635BFF,#8E7BFF)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8.5, fontWeight:800, letterSpacing:'.02em' }}>stripe</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>Secure card entry</div>
            <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>You'll enter your card on Stripe's secure page</div>
          </div>
          {Icon.lock ? Icon.lock({ width:14, height:14, color:T.ink4 }) : (Icon.shield ? Icon.shield({ width:14, height:14 }) : null)}
        </MCard>

        {V5b3Lbl('ORDER SUMMARY')}
        <MCard style={{ padding:14, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, color:T.ink2, marginBottom:7 }}><span>Pro · {billing}</span><span>${total.toFixed(2)}</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, color:T.ink2, marginBottom:7 }}><span>Tax</span><span>$0.00</span></div>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5, color:'#5A9C7A', marginBottom:9 }}><span>Referral credit</span><span>−$1 month</span></div>
          <div style={{ paddingTop:11, borderTop:`1px solid ${T.hairline}`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <span style={{ fontSize:11, fontWeight:800, color:T.ink4, letterSpacing:'.12em' }}>TOTAL TODAY</span>
            <span style={{ fontFamily:T.serif, fontSize:24, fontWeight:600, color:T.ink, letterSpacing:'-.02em' }}>${total.toFixed(2)}</span>
          </div>
        </MCard>

        <button onClick={startPay} disabled={busy} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40`, opacity: busy ? .65 : 1 }}>{busy ? 'Redirecting to Stripe…' : 'Confirm payment · $' + total.toFixed(2)}</button>
        <div style={{ marginTop:11, textAlign:'center', fontSize:10.5, color:T.ink5, lineHeight:1.5 }}>By confirming, you agree to our <span style={{ color:T.brand, fontWeight:700 }}>Terms</span> and <span style={{ color:T.brand, fontWeight:700 }}>Privacy</span>. {Icon.shield ? Icon.shield({width:10,height:10}) : '🔒'} Secured by Stripe.</div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// RATE LIMIT
// ══════════════════════════════════════════════════════════════════
function MRateLimitPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const used = 5, cap = 5;
  return (
    <>
      <MobileHeader back title="Daily limit"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:T.ink, borderRadius:18, padding:'30px 20px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14, marginTop:6 }}>
          <V5b3Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ width:74, height:74, borderRadius:37, background:'rgba(255,255,255,.08)', border:'1.5px solid rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', fontSize:30, color:'rgba(255,255,255,.65)' }}>{Icon.timer ? Icon.timer({width:28,height:28}) : '⏱'}</div>
            <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.16em', textAlign:'center', marginBottom:8 }}>FREE-TIER LIMIT</div>
            <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.05, letterSpacing:'-.02em', textAlign:'center', marginBottom:9 }}>That's 5 sessions today.</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', textAlign:'center', lineHeight:1.5 }}>Free accounts get <b style={{ color:'#fff' }}>5 AI sessions/day</b>. Resets at midnight in your timezone — or upgrade for unlimited.</div>

            <div style={{ marginTop:18, padding:'12px 14px', background:'rgba(255,255,255,.06)', borderRadius:11, border:'1px solid rgba(255,255,255,.1)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'.1em', marginBottom:7 }}>
                <span>TODAY · USED</span><span>{used}/{cap}</span>
              </div>
              <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,.1)', overflow:'hidden' }}>
                <div style={{ width:'100%', height:'100%', background:T.brand }}/>
              </div>
              <div style={{ fontSize:10.5, color:'rgba(255,255,255,.55)', marginTop:6 }}>Resets in 7h 32m</div>
            </div>
          </div>
        </div>

        {V5b3Lbl('UNLIMITED WITH PRO')}
        <MCard style={{ padding:14, marginBottom:14 }}>
          {['Unlimited AI sessions, daily','Tutor sessions included (4/mo)','Mock exams + AI grading','Priority response · larger context'].map((b,i,all) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:9, marginBottom: i < all.length-1 ? 9 : 0 }}>
              <div style={{ width:18, height:18, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0 }}>✓</div>
              <span style={{ fontSize:12.5, color:T.ink, lineHeight:1.4 }}>{b}</span>
            </div>
          ))}
        </MCard>

        <button onClick={()=>nav('checkout')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40`, marginBottom:9 }}>Upgrade · {billing==='annual'?'$228/yr':'$24/mo'}</button>
        <button onClick={()=>nav('dashboard')} style={{ width:'100%', padding:'12px', fontSize:12, color:T.ink3, fontWeight:600, background:'transparent' }}>Wait for reset</button>
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MReceiptsPageV5, MReferPageV5, MAddLanguageV5, MCheckoutPageV5, MRateLimitPageV5,
});
