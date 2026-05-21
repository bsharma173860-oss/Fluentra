// ── Email OTP + Forgot password ────────────────────────────

function OTPPage() {
  const [vals, setVals] = React.useState(['7', '2', '4', '', '', '']);
  const [verifying, setVerifying] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const refs = React.useRef([]);
  const setAt = (i, v) => {
    if (v && !/^\d$/.test(v)) return;
    const next = [...vals]; next[i] = v; setVals(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !vals[i] && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) refs.current[i + 1]?.focus();
  };
  const onPaste = (e) => {
    const txt = (e.clipboardData?.getData('text') || '').replace(/\D/g,'').slice(0,6);
    if (!txt) return;
    e.preventDefault();
    const next = ['','','','','',''];
    for (let i = 0; i < txt.length; i++) next[i] = txt[i];
    setVals(next);
    refs.current[Math.min(txt.length, 5)]?.focus();
  };
  const filled = vals.every(v => v !== '');
  const onVerify = () => {
    if (!filled) { refs.current[vals.findIndex(v => !v)]?.focus(); return; }
    setVerifying(true);
    setTimeout(() => { setVerifying(false); setVerified(true); }, 700);
    setTimeout(() => window.__nav && window.__nav('auth_onboarding'), 2400);
  };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'auto' }}>
      {/* Top bar — minimal */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'24px 36px', borderBottom:`1px solid ${T.hairline}` }}>
        <button data-nav="auth_signup" style={{ display:'inline-flex', alignItems:'center', gap:8, fontSize:12.5, color:T.ink3, background:'transparent', border:'none', cursor:'pointer', fontWeight:600 }}>
          {Icon.arrowL()} Back
        </button>
        <AuthLogo size="sm"/>
        <div style={{ fontSize:11.5, color:T.ink4 }}>Need help? <a style={{ color:T.ink2, fontWeight:600, cursor:'pointer' }}>support@fluentra.app</a></div>
      </div>

      {/* Body — single light column, very generous whitespace */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
        {verified ? (
          <div style={{ width:'100%', maxWidth:460, textAlign:'center' }}>
            <div style={{ width:72, height:72, borderRadius:36, background:T.brandGrad, color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:24, boxShadow:`0 12px 28px ${T.brand}40` }}>{Icon.check({ width:30, height:30, strokeWidth:3 })}</div>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.18em', color:T.ink4, marginBottom:14, textTransform:'uppercase' }}>Email verified</div>
            <h1 style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.05, color:T.ink, margin:0, marginBottom:14, letterSpacing:'-.02em' }}>You're in.</h1>
            <p style={{ fontSize:15, color:T.ink3, lineHeight:1.6, margin:0, marginBottom:18 }}>Setting up your account…</p>
            <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:14, color:T.brand, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
          </div>
        ) : (
        <div style={{ width:'100%', maxWidth:460, textAlign:'center' }}>
          {/* Step indicator */}
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.18em', color:T.ink4, marginBottom:24, textTransform:'uppercase' }}>Step 2 of 4 · Verify email</div>

          {/* Big serif headline */}
          <h1 style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.05, color:T.ink, margin:0, marginBottom:14, letterSpacing:'-.02em' }}>
            Check your inbox.
          </h1>
          <p style={{ fontSize:15, color:T.ink3, lineHeight:1.6, margin:0, marginBottom:36 }}>
            We sent a 6-digit code to<br/>
            <b style={{ color:T.ink }}>marc@lopez.dev</b>
            <span data-nav="auth_signup" style={{ color:T.brand, fontWeight:700, cursor:'pointer', marginLeft:8, fontSize:13 }}>Change</span>
          </p>

          {/* OTP boxes — clean, no card wrapper */}
          <div style={{ display:'flex', gap:10, marginBottom:18, justifyContent:'center' }} onPaste={onPaste}>
            {vals.map((v, i) => (
              <input key={i} ref={el => refs.current[i] = el} value={v} onChange={e => setAt(i, e.target.value)} onKeyDown={e => onKeyDown(i, e)} inputMode="numeric" autoComplete="one-time-code" maxLength={1} style={{ width:58, height:68, textAlign:'center', fontFamily:T.serif, fontSize:30, color:T.ink, border:`1.5px solid ${v ? T.ink : T.border}`, borderRadius:12, background:T.card, outline:'none', boxShadow: v ? `0 0 0 3px ${T.ink}10` : 'none', transition:'all .15s', padding:0 }}/>
            ))}
          </div>

          {/* Expiry meta — tiny, centered */}
          <div style={{ fontSize:12, color:T.ink4, marginBottom:30, display:'inline-flex', alignItems:'center', gap:6 }}>
            <span style={{ width:5, height:5, borderRadius:3, background:'#E08F4D' }}/>
            Code expires in <b style={{ color:T.ink2 }}>9:43</b>
          </div>

          {/* Verify button */}
          <button onClick={onVerify} disabled={verifying} style={{ width:'100%', padding:'16px', borderRadius:12, background: filled ? T.ink : T.bg3, color:'#fff', fontSize:14, fontWeight:700, border:'none', cursor: filled && !verifying ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', gap:8, transition:'all .15s', marginBottom:24 }}>
            {verifying ? <><span style={{ width:14, height:14, borderRadius:7, border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff', display:'inline-block', animation:'spin 0.7s linear infinite' }}/> Verifying…</> : <>Verify and continue {Icon.arrow()}</>}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

          {/* Resend row — text-link only */}
          <div style={{ fontSize:12.5, color:T.ink4 }}>
            Didn't receive it? <span style={{ color:T.ink2, fontWeight:700, cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3 }}>Resend in 0:42</span>
          </div>
        </div>
        )}
      </div>

      {/* Footer — minimal */}
      <div style={{ padding:'18px 36px', borderTop:`1px solid ${T.hairline}`, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:11, color:T.ink5 }}>
        <span>© 2025 Fluentra</span>
        <span style={{ display:'inline-flex', gap:14 }}>
          <span>Terms</span><span>Privacy</span><span>SOC 2 · GDPR</span>
        </span>
      </div>
    </div>
  );
}

function ForgotPwPage() {
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:420, background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'40px 36px', boxShadow:T.shadow }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <button data-nav="auth_login" style={{ width:32, height:32, borderRadius:8, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', cursor:'pointer' }}>{Icon.arrowL()}</button>
          <AuthLogo size="sm"/>
        </div>
        <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.15, color:T.ink, marginBottom:8 }}>Reset your password</div>
        <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:24 }}>Enter your account email and we'll send a reset link. Check spam if it doesn't arrive in two minutes.</div>
        <div style={{ marginBottom:14 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Email address</div>
          <input defaultValue="marc@lopez.dev" style={{ width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${T.border}`, borderRadius:11, background:T.bg, outline:'none' }}/>
        </div>
        <Btn label="Send reset link" nav="auth_login" accent={T.brand} fullWidth iconRight={Icon.arrow()}/>
        <div style={{ marginTop:18, paddingTop:18, borderTop:`1px solid ${T.hairline}`, fontSize:12.5, color:T.ink3, textAlign:'center' }}>
          Remember your password? <span data-nav="auth_login" style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Back to sign in</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { OTPPage, ForgotPwPage });
