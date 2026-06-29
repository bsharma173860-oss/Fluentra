// ── Email OTP + Forgot password ────────────────────────────

function ForgotPwPage() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [sent, setSent] = React.useState(false);

  const submit = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading(true); setError('');
    try {
      const { error: err } = await window.FL.auth.resetPassword(email.trim());
      setLoading(false);
      if (err) setError(err.message || 'Could not send the reset email. Please try again.');
      else setSent(true);
    } catch (e) { setLoading(false); setError('Could not send the reset email. Please try again.'); }
  };

  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:420, background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'40px 36px', boxShadow:T.shadow }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
          <button aria-label="Back" data-nav="auth_login" style={{ width:32, height:32, borderRadius:8, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', cursor:'pointer' }}>{Icon.arrowL()}</button>
          <AuthLogo size="sm"/>
        </div>
        {sent ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📬</div>
            <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, marginBottom:8 }}>Check your inbox</div>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:22 }}>If an account exists for <strong>{email}</strong>, we've sent a password-reset link. Check spam if it doesn't arrive within a couple of minutes.</div>
            <Btn label="Back to sign in" nav="auth_login" accent={T.brand} fullWidth/>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.15, color:T.ink, marginBottom:8 }}>Reset your password</div>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:24 }}>Enter your account email and we'll send you a link to set a new password.</div>
            {error ? <div style={{ background:'#FEF2F2', color:'#B91C1C', fontSize:12.5, padding:'10px 12px', borderRadius:10, marginBottom:14 }}>{error}</div> : null}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Email address</div>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={{ width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${T.border}`, borderRadius:11, background:T.bg, outline:'none' }}/>
            </div>
            <Btn label={loading ? 'Sending…' : 'Send reset link'} onClick={submit} accent={T.brand} fullWidth iconRight={loading ? null : Icon.arrow()}/>
            <div style={{ marginTop:18, paddingTop:18, borderTop:`1px solid ${T.hairline}`, fontSize:12.5, color:T.ink3, textAlign:'center' }}>
              Remember your password? <span data-nav="auth_login" style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Back to sign in</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResetPasswordPage() {
  const [pw, setPw] = React.useState('');
  const [pw2, setPw2] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);

  const submit = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (pw !== pw2) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    try {
      const { error: err } = await window.FL.auth.updatePassword(pw);
      setLoading(false);
      if (err) setError(err.message || 'Could not update your password. The link may have expired — request a new one.');
      else setDone(true);
    } catch (e) { setLoading(false); setError('Could not update your password. Please request a new reset link.'); }
  };

  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:420, background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'40px 36px', boxShadow:T.shadow }}>
        <div style={{ marginBottom:24 }}><AuthLogo size="sm"/></div>
        {done ? (
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>✅</div>
            <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, marginBottom:8 }}>Password updated</div>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:22 }}>Your password has been changed and you're signed in.</div>
            <Btn label="Go to dashboard" accent={T.brand} fullWidth onClick={() => window.__nav && window.__nav('dashboard')}/>
          </div>
        ) : (
          <div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.15, color:T.ink, marginBottom:8 }}>Set a new password</div>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:24 }}>Choose a new password for your account.</div>
            {error ? <div style={{ background:'#FEF2F2', color:'#B91C1C', fontSize:12.5, padding:'10px 12px', borderRadius:10, marginBottom:14 }}>{error}</div> : null}
            <div style={{ marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>New password</div>
              <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="At least 6 characters" style={{ width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${T.border}`, borderRadius:11, background:T.bg, outline:'none' }}/>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Confirm password</div>
              <input type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Re-enter password" style={{ width:'100%', padding:'12px 14px', fontSize:14, border:`1px solid ${T.border}`, borderRadius:11, background:T.bg, outline:'none' }}/>
            </div>
            <Btn label={loading ? 'Updating…' : 'Update password'} onClick={submit} accent={T.brand} fullWidth/>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ForgotPwPage, ResetPasswordPage });
