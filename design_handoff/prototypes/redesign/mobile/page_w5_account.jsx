// ── Mobile · Wave 5 · Account/Auth/Streak ──────────────────────────
// MOTP, MForgotPw, MReceipts, MRefer, MStreakCalendar
// All in v4 web vocabulary: MCard, hairlines, soft shadows, serif titles.

// ── Mobile OTP / 2FA ───────────────────────────────────────────────
function MOTPPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [code, setCode] = React.useState(['', '', '', '', '', '']);
  const refs = React.useRef([]);
  const setDigit = (i, v) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...code]; next[i] = d; setCode(next);
    if (d && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  return (
    <>
      <MobileHeader back onBack={()=>nav('dashboard')} title="Verify"/>
      <MobileBody padding={[0,22,32]} tabBarPad={false}>
        <div style={{ paddingTop:8, marginBottom:28 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Two-factor</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:10 }}>Enter the 6-digit code</div>
          <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.55 }}>We sent a code to <b style={{ color:T.ink }}>marc@…ail.com</b>. It expires in <span style={{ fontFamily:T.mono, color:T.ink }}>09:42</span>.</div>
        </div>

        {/* Code inputs */}
        <div style={{ display:'flex', gap:8, marginBottom:14 }}>
          {code.map((d, i) => (
            <input key={i} ref={el=>refs.current[i]=el} inputMode="numeric" maxLength={1} value={d} onChange={e=>setDigit(i, e.target.value)}
              onKeyDown={e=>{ if (e.key === 'Backspace' && !d && refs.current[i-1]) refs.current[i-1].focus(); }}
              style={{
                flex:1, height:62, textAlign:'center', fontFamily:T.serif, fontSize:30, color:T.ink,
                background:T.card, border:`1.5px solid ${d ? T.brand : T.border}`, borderRadius:14, outline:'none',
                boxShadow: d ? `0 0 0 3px ${T.brandLight}` : MT.shadowSm,
              }}/>
          ))}
        </div>

        {/* Resend strip */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', background:T.bg2, borderRadius:12, marginBottom:18 }}>
          <div style={{ fontSize:12, color:T.ink3 }}>Didn't get it?</div>
          <button style={{ fontSize:12, fontWeight:700, color:T.brand }}>Resend in 28s</button>
        </div>

        {/* Primary CTA */}
        <button onClick={()=>nav('dashboard')} disabled={code.some(d=>!d)} style={{
          width:'100%', padding:'15px', borderRadius:14, background: code.every(d=>d) ? T.brandGrad : T.bg2,
          color: code.every(d=>d) ? '#fff' : T.ink5, fontSize:14, fontWeight:700,
          boxShadow: code.every(d=>d) ? `0 8px 22px ${T.brand}40` : 'none', display:'flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>Verify and continue {Icon.arrow({ width:13, height:13 })}</button>

        {/* Alternative methods */}
        <div style={{ marginTop:24, paddingTop:18, borderTop:`1px solid ${T.hairline}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Other ways</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              { ic:'message', label:'Text it to me', sub:'+44 ··· ··· 8821' },
              { ic:'mic',     label:'Call my phone', sub:'Voice the code aloud' },
              { ic:'cog',     label:'Use authenticator app', sub:'Open Authy or 1Password' },
            ].map(m => (
              <button key={m.label} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:12, textAlign:'left' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic] && Icon[m.ic]({ width:14, height:14 })}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{m.label}</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{m.sub}</div>
                </div>
                <span style={{ color:T.ink5 }}>{Icon.chev({ width:13, height:13 })}</span>
              </button>
            ))}
          </div>
        </div>
      </MobileBody>
    </>
  );
}

// ── Mobile Forgot password ─────────────────────────────────────────
function MForgotPwPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [step, setStep] = React.useState(0); // 0 = enter email, 1 = sent
  const [email, setEmail] = React.useState('marc@example.com');
  return (
    <>
      <MobileHeader back onBack={()=>nav('dashboard')} title="Reset password"/>
      <MobileBody padding={[0,22,32]} tabBarPad={false}>
        <div style={{ paddingTop:8, marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Account recovery</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:10 }}>{step === 0 ? 'Forgot your password?' : 'Check your inbox'}</div>
          <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.55 }}>{step === 0 ? "We'll email you a link to set a new one. The link expires in 30 minutes." : <>We sent a reset link to <b style={{ color:T.ink }}>{email}</b>. Tap the link on this device to continue.</>}</div>
        </div>

        {step === 0 ? (
          <>
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Email</div>
              <input value={email} onChange={e=>setEmail(e.target.value)} style={{
                width:'100%', padding:'14px 16px', fontSize:15, color:T.ink,
                background:T.card, border:`1.5px solid ${T.border}`, borderRadius:12, outline:'none', boxShadow:MT.shadowSm,
              }}/>
            </div>
            <button onClick={()=>setStep(1)} style={{
              width:'100%', padding:'15px', borderRadius:14, background:T.brandGrad, color:'#fff',
              fontSize:14, fontWeight:700, boxShadow:`0 8px 22px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>Send reset link {Icon.arrow({ width:13, height:13 })}</button>

            <div style={{ marginTop:22, paddingTop:18, borderTop:`1px solid ${T.hairline}` }}>
              <div style={{ fontSize:12, color:T.ink4, lineHeight:1.55 }}>Don't have access to this email? <button style={{ color:T.brand, fontWeight:700 }}>Contact support</button></div>
            </div>
          </>
        ) : (
          <>
            <MCard raised style={{ padding:18, marginBottom:14, display:'flex', gap:12, alignItems:'center' }}>
              <div style={{ width:42, height:42, borderRadius:12, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.message({ width:18, height:18 })}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Reset email sent</div>
                <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>From hello@fluentra.app · just now</div>
              </div>
            </MCard>
            <button style={{ width:'100%', padding:'14px', borderRadius:14, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:14, fontWeight:700, marginBottom:8 }}>Open mail app</button>
            <button onClick={()=>setStep(0)} style={{ width:'100%', padding:'14px', borderRadius:14, background:'transparent', color:T.ink3, fontSize:13, fontWeight:600 }}>← Use a different email</button>

            <div style={{ marginTop:22, padding:14, background:T.bg2, borderRadius:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>Tip</div>
              <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55 }}>If you don't see it within a minute, check your <b style={{ color:T.ink2 }}>Spam</b> or <b style={{ color:T.ink2 }}>Promotions</b> folder.</div>
            </div>
          </>
        )}
      </MobileBody>
    </>
  );
}

// ── Mobile Receipts / billing ──────────────────────────────────────
function MReceiptsPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const rows = [
    { id:'INV-2025-0412', date:'Apr 12',  desc:'Pro · Monthly',    amt:'$14.00', status:'Paid' },
    { id:'INV-2025-0312', date:'Mar 12',  desc:'Pro · Monthly',    amt:'$14.00', status:'Paid' },
    { id:'INV-2025-0228', date:'Feb 28',  desc:'Mock exam credit', amt:'$2.00',  status:'Paid' },
    { id:'INV-2025-0212', date:'Feb 12',  desc:'Pro · Monthly',    amt:'$14.00', status:'Paid' },
    { id:'INV-2025-0114', date:'Jan 14',  desc:'Annual · upgrade', amt:'$84.00', status:'Refunded' },
    { id:'INV-2025-0112', date:'Jan 12',  desc:'Pro · Monthly',    amt:'$14.00', status:'Paid' },
  ];
  return (
    <>
      <MobileHeader back onBack={()=>nav('settings')} title="Receipts"/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 18px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>Billing</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Receipts &amp; invoices</div>
        </div>

        {/* Stat strip */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            { l:'Lifetime', v:'$182' },
            { l:'This year', v:'$58',  s:'3 invoices' },
            { l:'Next', v:'May 12', s:'$14.00', accent:true },
          ].map(s => (
            <MCard key={s.l} style={{ padding:12 }}>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>{s.l}</div>
              <div style={{ fontFamily:T.serif, fontSize:18, color: s.accent ? T.brand : T.ink, lineHeight:1, letterSpacing:'-.01em' }}>{s.v}</div>
              {s.s && <div style={{ fontSize:10, color:T.ink4, marginTop:4 }}>{s.s}</div>}
            </MCard>
          ))}
        </div>

        {/* Plan card */}
        <MCard raised style={{ padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Current plan</div>
              <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, letterSpacing:'-.01em' }}>Pro · Monthly</div>
            </div>
            <span style={{ fontSize:10, fontWeight:800, color:T.brand, background:T.brandLight, padding:'4px 9px', borderRadius:99, letterSpacing:'.08em' }}>ACTIVE</span>
          </div>
          <div style={{ fontSize:12, color:T.ink3, marginBottom:12 }}>Visa ending 4242 · renews May 12</div>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>nav('pricing')} style={{ flex:1, padding:'10px', borderRadius:10, background:T.bg2, color:T.ink, fontSize:12, fontWeight:700 }}>Manage plan</button>
            <button style={{ flex:1, padding:'10px', borderRadius:10, background:T.card, border:`1px solid ${T.border}`, color:T.ink2, fontSize:12, fontWeight:700 }}>Update card</button>
          </div>
        </MCard>

        {/* Invoice list */}
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>History</div>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {rows.map((r, i) => (
            <div key={r.id} style={{ padding:'14px 14px', display:'flex', alignItems:'center', gap:12, borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:40, textAlign:'center' }}>
                <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>{r.date.split(' ')[0]}</div>
                <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{r.date.split(' ')[1]}</div>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{r.desc}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:2, fontFamily:T.mono }}>{r.id}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1 }}>{r.amt}</div>
                <div style={{ fontSize:10, fontWeight:700, color: r.status === 'Paid' ? '#1A8F4E' : T.ink4, marginTop:3 }}>{r.status}</div>
              </div>
            </div>
          ))}
        </MCard>

        <button style={{ width:'100%', marginTop:14, padding:'13px', borderRadius:12, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          {Icon.download ? Icon.download({ width:13, height:13 }) : Icon.arrow({ width:13, height:13 })} Export all as PDF
        </button>
      </MobileBody>
    </>
  );
}

// ── Mobile Refer-a-friend ──────────────────────────────────────────
function MReferPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [copied, setCopied] = React.useState(false);
  const refs = [
    { who:'Sofia Chen',   init:'SC', bg:'#3F7CAC', date:'Apr 14', status:'Joined Pro', reward:'+30 days' },
    { who:'Marco Rivera', init:'MR', bg:'#A06940', date:'Apr 02', status:'Joined Pro', reward:'+30 days' },
    { who:'Yui Tanaka',   init:'YT', bg:'#8E6E95', date:'Mar 28', status:'Free trial', reward:'Pending' },
    { who:'Lior Adler',   init:'LA', bg:'#7A4FAB', date:'Mar 14', status:'Joined Pro', reward:'+30 days' },
    { who:'Diego Costa',  init:'DC', bg:'#C56B47', date:'Mar 20', status:'Free trial', reward:'Pending' },
  ];
  return (
    <>
      <MobileHeader back onBack={()=>nav('settings')} title="Refer a friend"/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        {/* Hero */}
        <div style={{ background:`linear-gradient(135deg, ${T.brand} 0%, #B85428 100%)`, borderRadius:20, padding:'24px 22px 22px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14 }}>
          <div style={{ position:'absolute', right:-30, top:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.10)' }}/>
          <div style={{ position:'absolute', right:40, bottom:-25, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
          <span style={{ display:'inline-block', fontSize:9.5, fontWeight:800, letterSpacing:'.14em', textTransform:'uppercase', background:'rgba(255,255,255,.18)', padding:'4px 10px', borderRadius:99, marginBottom:14 }}>REFER A FRIEND</span>
          <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:8 }}>Give 30 days.<br/>Get 30 days.</div>
          <div style={{ fontSize:13, lineHeight:1.55, opacity:.88 }}>Every friend who joins Pro earns you both a free month. No cap.</div>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, opacity:.85, marginTop:10, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>

          {/* Link card */}
          <div style={{ marginTop:18, background:'rgba(255,255,255,.16)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', border:'1px solid rgba(255,255,255,.22)', borderRadius:13, padding:'12px 14px', display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:9, fontWeight:800, opacity:.7, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:3 }}>YOUR LINK</div>
              <div style={{ fontFamily:T.mono, fontSize:12.5, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>fluentra.app/r/marc-7q2k</div>
            </div>
            <button onClick={()=>{ setCopied(true); setTimeout(()=>setCopied(false), 1500); }} style={{ padding:'8px 12px', background:'#fff', color:T.brand, fontSize:11, fontWeight:800, borderRadius:9, flexShrink:0 }}>{copied ? '✓ Copied' : 'Copy'}</button>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6, marginBottom:14 }}>
          {[
            { l:'Invited', v:'14' },
            { l:'Joined', v:'6', accent:true },
            { l:'Months', v:'6' },
            { l:'Pending', v:'2' },
          ].map(s => (
            <MCard key={s.l} style={{ padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:22, color: s.accent ? T.brand : T.ink, lineHeight:1, letterSpacing:'-.01em' }}>{s.v}</div>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginTop:5 }}>{s.l}</div>
            </MCard>
          ))}
        </div>

        {/* Channel buttons */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:6, marginBottom:18 }}>
          {[
            { ic:'message', l:'Message' },
            { ic:'mic',     l:'WhatsApp' },
            { ic:'users',   l:'Email' },
            { ic:'spark',   l:'X' },
          ].map(c => (
            <button key={c.l} style={{ padding:'12px 6px', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, display:'flex', flexDirection:'column', alignItems:'center', gap:6, color:T.ink2, boxShadow:MT.shadowSm }}>
              <div style={{ width:30, height:30, borderRadius:9, background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2 }}>{Icon[c.ic] && Icon[c.ic]({ width:13, height:13 })}</div>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink2 }}>{c.l}</div>
            </button>
          ))}
        </div>

        {/* Referral list */}
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>Your referrals</div>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {refs.map((r, i) => (
            <div key={r.who} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:36, height:36, borderRadius:18, background:r.bg, color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{r.init}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{r.who}</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{r.date} · {r.status}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:800, color: r.reward === 'Pending' ? T.ink4 : '#1A8F4E', textAlign:'right' }}>{r.reward}</div>
            </div>
          ))}
        </MCard>
      </MobileBody>
    </>
  );
}

// ── Mobile Streak calendar / heatmap ───────────────────────────────
function MStreakCalendarPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const days = Array.from({ length: 4 * 7 }).map((_, i) => i < 25 ? Math.max(0, Math.round(Math.sin(i * 0.7 + 1) * 2.4 + 2)) : 0);
  const shadeFor = (v) => v === 0 ? T.bg2 : `color-mix(in oklch, ${T.brand} ${v * 22}%, ${T.bg2})`;

  return (
    <>
      <MobileHeader back onBack={()=>nav('dashboard')} title="Streak"/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 18px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>STREAK</div>
          <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>7 days strong</div>
          <div style={{ fontSize:13, color:T.ink3, marginTop:6 }}>9-day streak unlocks the real exam. <b style={{ color:T.ink }}>You're 2 away.</b></div>
        </div>

        {/* Stat row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          <MCard style={{ padding:'12px 12px' }}>
            <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>Current</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
              <div style={{ fontFamily:T.serif, fontSize:24, color:T.brand, lineHeight:1 }}>7</div>
              <span style={{ fontSize:14 }}>🔥</span>
            </div>
          </MCard>
          <MCard style={{ padding:'12px 12px' }}>
            <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>Longest</div>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>14</div>
          </MCard>
          <MCard style={{ padding:'12px 12px' }}>
            <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>This month</div>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>22d</div>
          </MCard>
        </div>

        {/* Unlock progress card */}
        <div style={{ background:`linear-gradient(135deg, ${T.brand}, #B85428)`, borderRadius:18, padding:'18px 20px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-20, top:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
          <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85, marginBottom:6 }}>REAL EXAM UNLOCK</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:12 }}>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1, letterSpacing:'-.01em' }}>7</div>
            <div style={{ fontSize:14, opacity:.7 }}>/ 9 days</div>
          </div>
          <div style={{ height:7, background:'rgba(255,255,255,.22)', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
            <div style={{ height:'100%', width:'78%', background:'#fff', borderRadius:99 }}/>
          </div>
          <div style={{ fontSize:12, opacity:.85, lineHeight:1.5 }}>Practice today (any module) to push to 8.</div>
        </div>

        {/* Heatmap */}
        <MCard style={{ padding:18, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink, letterSpacing:'-.005em' }}>Last 4 weeks</div>
              <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Each square is a day.</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:9.5, color:T.ink4 }}>
              <span>Less</span>
              {[0,1,2,3,4].map(i => <span key={i} style={{ width:8, height:8, borderRadius:2, background: shadeFor(i) }}/>)}
              <span>More</span>
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {Array.from({ length:4 }).map((_, wk) => (
              <div key={wk} style={{ display:'flex', flexDirection:'column', gap:6, flex:1 }}>
                {Array.from({ length:7 }).map((_, d) => {
                  const v = days[wk * 7 + d] || 0;
                  return <div key={d} style={{ width:'100%', aspectRatio:'1', borderRadius:5, background: shadeFor(v), border: v === 0 ? `1px solid ${T.border}` : 'none' }}/>;
                })}
              </div>
            ))}
          </div>
        </MCard>

        {/* Module progress lines (compact) */}
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>Score over time</div>
        <MCard style={{ padding:14 }}>
          <svg viewBox="0 0 320 110" style={{ width:'100%', height:110 }}>
            {[3,5,7].map((v, i) => <line key={v} x1="0" y1={92 - i*36} x2="320" y2={92 - i*36} stroke={T.hairline}/>)}
            {[
              { c:T.reading.c,    pts:[6.0,6.5,6.5,7.0,7.0,7.5,7.5,7.5,8.0] },
              { c:T.listening.c,  pts:[5.5,6.0,6.5,6.5,7.0,7.0,7.0,7.5,7.5] },
              { c:T.speaking.c,   pts:[5.0,5.5,6.0,6.0,6.5,6.5,7.0,7.0,7.0] },
              { c:T.writing.c,    pts:[4.5,5.0,5.5,5.5,6.0,6.0,6.5,6.5,7.0] },
            ].map((line, i) => {
              const path = line.pts.map((p, j) => {
                const x = (j / 8) * 318 + 1;
                const y = 100 - ((p - 3) / 6) * 90;
                return `${j === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
              }).join(' ');
              return <path key={i} d={path} fill="none" stroke={line.c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>;
            })}
          </svg>
          <div style={{ display:'flex', flexWrap:'wrap', gap:10, marginTop:10, paddingTop:10, borderTop:`1px solid ${T.hairline}` }}>
            {[
              { c:T.reading.c, l:'Reading' },
              { c:T.listening.c, l:'Listening' },
              { c:T.speaking.c, l:'Speaking' },
              { c:T.writing.c, l:'Writing' },
            ].map(m => (
              <div key={m.l} style={{ display:'flex', alignItems:'center', gap:5, fontSize:10.5, color:T.ink3, fontWeight:600 }}>
                <span style={{ width:9, height:9, borderRadius:5, background:m.c }}/>{m.l}
              </div>
            ))}
          </div>
        </MCard>
      </MobileBody>
    </>
  );
}

Object.assign(window, { MOTPPage, MForgotPwPage, MReceiptsPage, MReferPage, MStreakCalendarPage });
