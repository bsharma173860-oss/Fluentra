// ── Auth screens: Login · Signup · Onboarding ──────────────
// Both desktop (560px card) + mobile (full-screen) versions.
// Mobile uses MobileFrame + native-feeling layout.

// ── Shared: Google + Apple icon SVGs ───────────────────────
function GoogleIcon({ size=18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
function AppleIcon({ size=18, color='#000' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.32 2.99-2.53 4zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

// ── Shared: social button ──────────────────────────────────
function SocialBtn({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10, width:'100%', padding:'13px 16px', background:T.card, border:`1px solid ${T.border}`, borderRadius:12, fontSize:14, fontWeight:600, color:T.ink, cursor:'pointer', transition:'background .12s' }}
      onMouseEnter={e => e.currentTarget.style.background = T.bg2}
      onMouseLeave={e => e.currentTarget.style.background = T.card}>
      {icon}<span>{label}</span>
    </button>
  );
}

// ── Shared: form field ─────────────────────────────────────
function Field({ label, type='text', placeholder, hint, value, onChange, right }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <label style={{ fontSize:13, fontWeight:600, color:T.ink2 }}>{label}</label>
        {hint && <span style={{ fontSize:11.5, color:T.ink4 }}>{hint}</span>}
        {right}
      </div>
      <div style={{ position:'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ width:'100%', padding:'12px 14px', borderRadius:11, border:`1.5px solid ${focused ? T.brand : T.border}`, fontSize:14, color:T.ink, background:T.card, outline:'none', fontFamily:"'Inter',sans-serif", transition:'border-color .15s' }}
        />
      </div>
    </div>
  );
}

// ── Shared: OR divider ─────────────────────────────────────
function OrDivider() {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <div style={{ flex:1, height:1, background:T.border }}/>
      <span style={{ fontSize:12, color:T.ink4, fontWeight:600 }}>or</span>
      <div style={{ flex:1, height:1, background:T.border }}/>
    </div>
  );
}

// ── Shared: Fluentra logo mark ─────────────────────────────
function AuthLogo({ size='md' }) {
  const iconSize = size === 'sm' ? 28 : 36;
  const textSize = size === 'sm' ? 22 : 28;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12, marginBottom:8 }}>
      <div style={{ width:iconSize+12, height:iconSize+12, borderRadius:(iconSize+12)*0.28, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${T.brand}44` }}>
        {Icon.brandmark({ width:iconSize, height:iconSize, color:'#fff' })}
      </div>
      <div style={{ fontFamily:T.serif, fontSize:textSize, color:T.ink, lineHeight:1 }}>
        Fluent<span style={{ color:T.brand }}>ra</span>
      </div>
    </div>
  );
}

// ── Shared: error / success banner ────────────────────────────
function AuthAlert({ msg, type='error' }) {
  if (!msg) return null;
  const bg = type === 'success' ? '#E8F8EE' : '#FFF0EE';
  const color = type === 'success' ? '#0D6E55' : '#C0392B';
  return (
    <div style={{ fontSize:12.5, color, background:bg, borderRadius:10, padding:'10px 14px', lineHeight:1.5 }}>{msg}</div>
  );
}

function friendlyError(err) {
  if (!err) return 'Something went wrong — please try again.';
  var m = err.message || String(err);
  if (m.includes('Invalid login credentials') || m.includes('invalid_credentials'))
    return 'Wrong email or password. Please check and try again.';
  if (m.includes('Email not confirmed'))
    return 'Please confirm your email — check your inbox for a verification link.';
  if (m.includes('User already registered'))
    return 'An account with this email already exists. Try signing in instead.';
  if (m.includes('Password should be'))
    return 'Password must be at least 6 characters.';
  return m;
}

// ══════════════════════════════════════════════════════════════
// LOGIN — desktop card + mobile screen
// ══════════════════════════════════════════════════════════════
function LoginCard() {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignIn = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    if (!email || !pw) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { error: err } = await window.FL.auth.signIn(email, pw);
    setLoading(false);
    if (err) setError(friendlyError(err));
    // On success onAuthStateChange in backend.js navigates to dashboard
  };

  const handleGoogle = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    const { error: err } = await window.FL.auth.signInWithGoogle();
    if (err) setError(friendlyError(err));
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <AuthLogo/>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:22, fontWeight:700, color:T.ink, marginBottom:4 }}>Welcome back</div>
        <div style={{ fontSize:13.5, color:T.ink3 }}>Sign in to continue learning</div>
        <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.brand, marginTop:8, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <SocialBtn icon={<GoogleIcon/>} label="Continue with Google" onClick={handleGoogle}/>
        <SocialBtn icon={<AppleIcon/>}  label="Continue with Apple"/>
      </div>

      <OrDivider/>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail}/>
        <Field label="Password" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={pw} onChange={setPw}
          right={
            <button onClick={() => setShowPw(s => !s)} style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>
              {showPw ? 'Hide' : 'Show'}
            </button>
          }
          hint={<a href="#" onClick={e => { e.preventDefault(); window.__nav && window.__nav('forgot_pw'); }} style={{ fontSize:11.5, color:T.brand, fontWeight:600, textDecoration:'none' }}>Forgot?</a>}
        />
      </div>

      <AuthAlert msg={error}/>

      <Btn label={loading ? 'Signing in…' : 'Sign in →'} fullWidth accent={T.brand} size="lg" onClick={handleSignIn}/>

      <div style={{ textAlign:'center', fontSize:13, color:T.ink3 }}>
        No account? <span onClick={() => window.__nav && window.__nav('auth_signup')} style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Sign up free</span>
      </div>

      <div style={{ fontSize:11, color:T.ink5, textAlign:'center', lineHeight:1.5 }}>
        By continuing you agree to Fluentra's <span onClick={() => window.__nav('terms')} style={{ color:T.ink2, fontWeight:600, cursor:'pointer', textDecoration:'underline' }}>Terms</span> and <span onClick={() => window.__nav('privacy')} style={{ color:T.ink2, fontWeight:600, cursor:'pointer', textDecoration:'underline' }}>Privacy Policy</span>.
      </div>
    </div>
  );
}

function LoginMobile() {
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSignIn = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    if (!email || !pw) { setError('Please enter your email and password.'); return; }
    setLoading(true); setError('');
    const { error: err } = await window.FL.auth.signIn(email, pw);
    setLoading(false);
    if (err) setError(friendlyError(err));
  };

  return (
    <>
      <MobileBody>
        <div style={{ display:'flex', flexDirection:'column', gap:28, paddingBottom:40 }}>
          <AuthLogo size="sm"/>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontSize:20, fontWeight:700, color:T.ink, marginBottom:3 }}>Welcome back</div>
            <div style={{ fontSize:13, color:T.ink3 }}>Sign in to continue learning</div>
            <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:11.5, color:T.brand, marginTop:6, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            <SocialBtn icon={<GoogleIcon/>} label="Continue with Google" onClick={() => window.FL && window.FL.auth.signInWithGoogle()}/>
            <SocialBtn icon={<AppleIcon color="#000"/>} label="Continue with Apple"/>
          </div>
          <OrDivider/>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail}/>
            <Field label="Password" type="password" placeholder="••••••••" value={pw} onChange={setPw}
              right={<a href="#" onClick={e => { e.preventDefault(); window.__nav && window.__nav('forgot_pw'); }} style={{ fontSize:11.5, color:T.brand, fontWeight:600, textDecoration:'none' }}>Forgot?</a>}
            />
          </div>
          <AuthAlert msg={error}/>
          <Btn label={loading ? 'Signing in…' : 'Sign in →'} fullWidth accent={T.brand} size="lg" onClick={handleSignIn}/>
          <div style={{ textAlign:'center', fontSize:13, color:T.ink3 }}>
            No account? <span onClick={() => window.__nav && window.__nav('auth_signup')} style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Sign up free</span>
          </div>
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════
// SIGNUP — desktop + mobile
// ══════════════════════════════════════════════════════════════
function SignupCard() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);
  const [resent, setResent] = React.useState(false);

  const handleSignUp = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    if (!name || !email || !pw) { setError('Please fill in all fields.'); return; }
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await window.FL.auth.signUp(email, pw, name);
    setLoading(false);
    if (err) setError(friendlyError(err));
    else setDone(true);
  };

  if (done) return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, alignItems:'center', textAlign:'center', paddingTop:32 }}>
      <AuthLogo/>
      <div style={{ fontSize:40 }}>📬</div>
      <div style={{ fontSize:20, fontWeight:700, color:T.ink }}>Check your inbox</div>
      <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, maxWidth:320 }}>
        We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then sign in.
      </div>
      <Btn label="Go to sign in" fullWidth accent={T.brand} size="lg" onClick={() => window.__nav && window.__nav('auth_login')}/>
      <div style={{ fontSize:12.5, color:T.ink4 }}>
        Didn't get it? {resent ? <span style={{ color:T.listening.c, fontWeight:600 }}>Sent again ✓</span> : <span onClick={async () => { if (window.FL) { try { await window.FL.auth.resendVerification(email); } catch (e) {} setResent(true); } }} style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Resend email</span>}
      </div>
    </div>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:22 }}>
      <AuthLogo/>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:22, fontWeight:700, color:T.ink, marginBottom:4 }}>Create your account</div>
        <div style={{ fontSize:13.5, color:T.ink3 }}>Start your language journey for free</div>
        <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.brand, marginTop:8, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        <SocialBtn icon={<GoogleIcon/>} label="Sign up with Google" onClick={() => window.FL && window.FL.auth.signInWithGoogle()}/>
        <SocialBtn icon={<AppleIcon/>}  label="Sign up with Apple"/>
      </div>

      <OrDivider/>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Field label="Full name" placeholder="María García" value={name} onChange={setName}/>
        <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail}/>
        <Field label="Password" type="password" placeholder="8+ characters" value={pw} onChange={setPw}/>
      </div>

      {/* Password strength */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ display:'flex', gap:5 }}>
          {[1,2,3,4].map(i => (
            <div key={i} style={{ flex:1, height:4, borderRadius:99, background: pw.length >= i*2 ? (i < 3 ? T.writing.c : i < 4 ? T.listening.c : T.brand) : T.bg3 }}/>
          ))}
        </div>
        <div style={{ fontSize:11, color:T.ink4 }}>
          {pw.length === 0 ? 'Use 8+ characters for a strong password' : pw.length < 6 ? 'Too short' : pw.length < 10 ? 'Getting stronger' : 'Strong password ✓'}
        </div>
      </div>

      <AuthAlert msg={error}/>
      <Btn label={loading ? 'Creating account…' : 'Create account'} fullWidth accent={T.brand} size="lg" onClick={handleSignUp}/>

      <div style={{ textAlign:'center', fontSize:13, color:T.ink3 }}>
        Already have an account? <span onClick={() => window.__nav && window.__nav('auth_login')} style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Sign in</span>
      </div>
    </div>
  );
}

function SignupMobile() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [pw, setPw] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [done, setDone] = React.useState(false);
  const [resent, setResent] = React.useState(false);

  const handleSignUp = async () => {
    if (!window.FL) { setError('Backend not initialised — please refresh.'); return; }
    if (!name || !email || !pw) { setError('Please fill in all fields.'); return; }
    if (pw.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    const { error: err } = await window.FL.auth.signUp(email, pw, name);
    setLoading(false);
    if (err) setError(friendlyError(err));
    else setDone(true);
  };

  if (done) return (
    <MobileBody>
      <div style={{ display:'flex', flexDirection:'column', gap:18, alignItems:'center', textAlign:'center', paddingTop:32, paddingBottom:40 }}>
        <AuthLogo size="sm"/>
        <div style={{ fontSize:36 }}>📬</div>
        <div style={{ fontSize:18, fontWeight:700, color:T.ink }}>Check your inbox</div>
        <div style={{ fontSize:13, color:T.ink3, lineHeight:1.6 }}>Confirmation link sent to <strong>{email}</strong></div>
        <Btn label="Go to sign in" fullWidth accent={T.brand} size="lg" onClick={() => window.__nav && window.__nav('auth_login')}/>
        <div style={{ fontSize:12, color:T.ink4 }}>
          Didn't get it? {resent ? <span style={{ color:T.listening.c, fontWeight:600 }}>Sent ✓</span> : <span onClick={async () => { if (window.FL) { try { await window.FL.auth.resendVerification(email); } catch (e) {} setResent(true); } }} style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Resend</span>}
        </div>
      </div>
    </MobileBody>
  );

  return (
    <MobileBody>
      <div style={{ display:'flex', flexDirection:'column', gap:22, paddingBottom:40 }}>
        <AuthLogo size="sm"/>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:20, fontWeight:700, color:T.ink, marginBottom:3 }}>Create account</div>
          <div style={{ fontSize:13, color:T.ink3 }}>Free forever on your first language</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <SocialBtn icon={<GoogleIcon/>} label="Sign up with Google" onClick={() => window.FL && window.FL.auth.signInWithGoogle()}/>
          <SocialBtn icon={<AppleIcon/>}  label="Sign up with Apple"/>
        </div>
        <OrDivider/>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <Field label="Full name" placeholder="María García" value={name} onChange={setName}/>
          <Field label="Email" type="email" placeholder="you@example.com" value={email} onChange={setEmail}/>
          <Field label="Password" type="password" placeholder="8+ characters" value={pw} onChange={setPw}/>
        </div>
        <AuthAlert msg={error}/>
        <Btn label={loading ? 'Creating account…' : 'Create account'} fullWidth accent={T.brand} size="lg" onClick={handleSignUp}/>
        <div style={{ textAlign:'center', fontSize:13, color:T.ink3 }}>
          Already have one? <span onClick={() => window.__nav && window.__nav('auth_login')} style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Sign in</span>
        </div>
        <div style={{ fontSize:10.5, color:T.ink5, textAlign:'center', lineHeight:1.5 }}>
          By signing up you agree to our <span onClick={() => window.__nav('terms')} style={{ color:T.ink2, fontWeight:600, cursor:'pointer', textDecoration:'underline' }}>Terms</span> &amp; <span onClick={() => window.__nav('privacy')} style={{ color:T.ink2, fontWeight:600, cursor:'pointer', textDecoration:'underline' }}>Privacy</span>.
        </div>
      </div>
    </MobileBody>
  );
}

// ══════════════════════════════════════════════════════════════
// ONBOARDING — 3 steps, desktop + mobile
// ══════════════════════════════════════════════════════════════
const AUTH_EXAMS = [
  { key:'IELTS',   label:'IELTS',     sub:'Academic & General', color:'#5B4EFF', bg:'#EEEEFF', flag:'en' },
  { key:'TOEFL',   label:'TOEFL',     sub:'iBT Internet-Based', color:T.listening.c,  bg:T.listening.bg,  flag:'en' },
  { key:'DELF',    label:'DELF B2',   sub:'Diplôme Français',   color:'#1558B0',  bg:'#EEF4FF', flag:'fr' },
  { key:'DELE',    label:'DELE B2',   sub:'Diploma de Español', color:T.brand,    bg:T.brandLight, flag:'es' },
  { key:'JLPT',    label:'JLPT N4',   sub:'Japanese Language',  color:'#C84070',  bg:'#FFE0EC', flag:'ja' },
  { key:'CUSTOM',  label:'Just practice', sub:'No exam goal',  color:T.ink2,     bg:T.bg2,      flag:null },
];

function ScoreSlider({ min=4, max=9, step=0.5, value, onChange, color }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16, padding:'8px 0' }}>
      <div style={{ fontFamily:T.serif, fontSize:72, color, lineHeight:1 }}>{value.toFixed(step < 1 ? 1 : 0)}</div>
      <div style={{ fontSize:13, color:T.ink4 }}>Target band score</div>
      <div style={{ width:'100%', position:'relative', padding:'16px 0' }}>
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(parseFloat(e.target.value))}
          style={{ width:'100%', accentColor:color }}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontSize:11, color:T.ink4 }}>
          <span>{min}</span><span>{((min+max)/2).toFixed(0)}</span><span>{max}</span>
        </div>
      </div>
    </div>
  );
}

function OnboardingCard() {
  const [step, setStep] = React.useState(0);
  const [exam, setExam] = React.useState('IELTS');
  const [score, setScore] = React.useState(7.0);
  const [native, setNative] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const selExam = AUTH_EXAMS.find(e => e.key === exam) || AUTH_EXAMS[0];
  const STEPS = ['Your exam', 'Target score', 'Native language'];
  const canNext = step === 0 ? !!exam : step === 1 ? true : native.trim().length > 0;

  const handleFinish = async () => {
    if (!canNext) return;
    if (step < 2) { setStep(s => s + 1); return; }
    // Save to Supabase profiles table
    if (!window.FL || !window.FL.client) { window.__nav && window.__nav('dashboard'); return; }
    setLoading(true); setError('');
    try {
      const { data: { user } } = await window.FL.client.auth.getUser();
      if (user) {
        await window.FL.client.from('profiles').upsert({
          id: user.id,
          target_exam: exam,
          target_score: score,
          native_language: native,
          updated_at: new Date().toISOString(),
        });
        // Also add to user_languages
        await window.FL.client.from('user_languages').upsert({
          user_id: user.id,
          language_code: exam === 'DELF' ? 'fr' : exam === 'DELE' ? 'es' : exam === 'JLPT' ? 'ja' : 'en',
          exam_type: exam,
          level: 'A2',
        }, { onConflict: 'user_id,language_code' });
      }
    } catch(e) { /* non-blocking */ }
    setLoading(false);
    window.__nav && window.__nav('dashboard');
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0, height:'100%' }}>
      {/* Progress bar */}
      <div style={{ marginBottom:28 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>
            Fluent<span style={{ color:T.brand }}>ra</span>
          </div>
          <div style={{ fontSize:12, color:T.ink4, fontWeight:600 }}>Step {step+1} / {STEPS.length}</div>
        </div>
        <div style={{ height:4, background:T.bg3, borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${((step+1)/3)*100}%`, background:T.brand, borderRadius:99, transition:'width .3s' }}/>
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex:1 }}>
        {step === 0 && (
          <>
            <div style={{ fontSize:26, fontWeight:700, color:T.ink, marginBottom:6, lineHeight:1.15 }}>Which exam are you preparing for?</div>
            <div style={{ fontSize:13.5, color:T.ink3, marginBottom:22 }}>We'll personalise your practice and scoring.</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {AUTH_EXAMS.map(ex => {
                const sel = exam === ex.key;
                return (
                  <button key={ex.key} onClick={() => setExam(ex.key)} style={{ padding:16, borderRadius:14, border:`1.5px solid ${sel ? ex.color : T.border}`, background: sel ? ex.bg : T.card, textAlign:'left', cursor:'pointer', position:'relative' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                      {ex.flag ? <Flag code={ex.flag} w={28} h={19} radius={3}/> : Icon.spark({ width:20, height:20, color:ex.color })}
                      {sel && <div style={{ marginLeft:'auto', width:18, height:18, borderRadius:9, background:ex.color, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:10, height:10, color:'#fff' })}</div>}
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color: sel ? ex.color : T.ink, marginBottom:2 }}>{ex.label}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>{ex.sub}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div style={{ fontSize:26, fontWeight:700, color:T.ink, marginBottom:6, lineHeight:1.15 }}>What's your target score?</div>
            <div style={{ fontSize:13.5, color:T.ink3, marginBottom:22 }}>For <span style={{ color:selExam.color, fontWeight:700 }}>{selExam.label}</span></div>
            <ScoreSlider min={4} max={9} step={0.5} value={score} onChange={setScore} color={selExam.color}/>
            <div style={{ marginTop:20, padding:16, background:selExam.bg, borderRadius:14 }}>
              <div style={{ fontSize:12, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>What this means</div>
              <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5 }}>
                {score >= 8 ? 'Expert user — near-native fluency. Needed for top universities.' : score >= 7 ? 'Good user — handles complex language well. Required for most universities.' : score >= 6 ? 'Competent user — mostly effective language use. Good for professional roles.' : 'Modest user — basic communication in familiar situations.'}
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontSize:26, fontWeight:700, color:T.ink, marginBottom:6, lineHeight:1.15 }}>What's your native language?</div>
            <div style={{ fontSize:13.5, color:T.ink3, marginBottom:22 }}>Helps us tailor pronunciation feedback and translations.</div>
            <Field label="Native language" placeholder="e.g. Arabic, Hindi, Spanish…" value={native} onChange={setNative}/>
            <div style={{ marginTop:16, display:'flex', flexWrap:'wrap', gap:8 }}>
              {['Arabic', 'Hindi', 'Spanish', 'Chinese', 'Portuguese', 'French'].map(l => (
                <button key={l} onClick={() => setNative(l)} style={{ padding:'7px 14px', borderRadius:99, background: native===l ? T.ink : T.card, color: native===l ? '#fff' : T.ink2, border:`1px solid ${native===l ? T.ink : T.border}`, fontSize:12, fontWeight:600 }}>{l}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* CTA */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:24 }}>
        <AuthAlert msg={error}/>
        <div style={{ display:'flex', gap:10, alignItems:'center' }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ width:44, height:44, borderRadius:12, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2 }}>
              {Icon.arrowL({ width:16, height:16 })}
            </button>
          )}
          <Btn label={loading ? 'Saving…' : step < 2 ? 'Continue' : 'Start learning'} iconRight={Icon.arrow({ width:13, height:13 })} fullWidth accent={T.brand} size="lg"
            style={{ opacity: canNext ? 1 : .45 }}
            onClick={handleFinish}/>
        </div>
      </div>
    </div>
  );
}

// Wrapper components exported to window
function AuthLoginDesktop() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg2 }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', overflowY:'auto' }}>
        {/* Split: brand left, form right */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', width:'100%', minHeight:'100%', maxWidth:1200, margin:'0 auto' }}>
          {/* Left brand panel */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-start', justifyContent:'center', padding:'60px 64px', background:T.ink, color:'#fff', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:14, opacity:.05, pointerEvents:'none', padding:20 }}>
              {Array.from({ length:200 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
            </div>
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:48 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.brandmark({ width:22, height:22, color:'#fff' })}</div>
                <div style={{ fontFamily:T.serif, fontSize:24, color:'#fff' }}>Fluentra</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1.1, marginBottom:20, color:'#fff' }}>Language fluency,<br/>on your terms.</div>
              <div style={{ fontSize:15, color:'rgba(255,255,255,.65)', lineHeight:1.6, marginBottom:40, maxWidth:380 }}>AI-powered IELTS prep and multilingual practice — learn smarter, streak longer, score higher.</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {['143,000+ learners worldwide', '7.4 avg band score improvement', 'Top-ranked exam prep'].map(s => (
                  <div key={s} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13, color:'rgba(255,255,255,.75)', fontWeight:500 }}>
                    <div style={{ width:18, height:18, borderRadius:9, background:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.check({ width:10, height:10, color:'#fff' })}</div>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right form panel */}
          <div style={{ display:'flex', flexDirection:'column', overflowY:'auto', padding:40, background:T.bg }}>
            <div style={{ width:'100%', maxWidth:400, margin:'auto', background:T.card, borderRadius:20, padding:36, border:`1px solid ${T.border}` }}>
              <LoginCard/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthSignupDesktop() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg2 }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', overflowY:'auto', padding:40 }}>
        <div style={{ width:'100%', maxWidth:480, margin:'auto', background:T.card, borderRadius:20, padding:40, border:`1px solid ${T.border}` }}>
          <SignupCard/>
        </div>
      </div>
    </div>
  );
}

function AuthOnboardingDesktop() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg2 }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40 }}>
        <div style={{ width:'100%', maxWidth:560, background:T.card, borderRadius:20, padding:40, border:`1px solid ${T.border}`, minHeight:560 }}>
          <OnboardingCard/>
        </div>
      </div>
    </div>
  );
}

// Mobile auth screens
function AuthLoginMobile() {
  return <MobileFrame><LoginMobile/></MobileFrame>;
}
function AuthSignupMobile() {
  return <MobileFrame><SignupMobile/></MobileFrame>;
}
function AuthOnboardingMobile() {
  const [step, setStep] = React.useState(0);
  const [exam, setExam] = React.useState('IELTS');
  const [score, setScore] = React.useState(7.0);
  const [native, setNative] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const selExam = AUTH_EXAMS.find(e => e.key === exam) || AUTH_EXAMS[0];
  const canNext = step === 0 ? !!exam : step === 1 ? true : native.trim().length > 0;

  const handleFinish = async () => {
    if (!canNext) return;
    if (step < 2) { setStep(s => s + 1); return; }
    if (!window.FL || !window.FL.client) { window.__nav && window.__nav('dashboard'); return; }
    setLoading(true);
    try {
      const { data: { user } } = await window.FL.client.auth.getUser();
      if (user) {
        await window.FL.client.from('profiles').upsert({
          id: user.id,
          target_exam: exam,
          target_score: score,
          native_language: native,
          updated_at: new Date().toISOString(),
        });
        await window.FL.client.from('user_languages').upsert({
          user_id: user.id,
          language_code: exam === 'DELF' ? 'fr' : exam === 'DELE' ? 'es' : exam === 'JLPT' ? 'ja' : 'en',
          exam_type: exam,
          level: 'A2',
        }, { onConflict: 'user_id,language_code' });
      }
    } catch(e) { /* non-blocking */ }
    setLoading(false);
    window.__nav && window.__nav('dashboard');
  };

  return (
    <MobileFrame>
      {/* Progress */}
      <div style={{ padding:'0 20px 12px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>Fluent<span style={{ color:T.brand }}>ra</span></div>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700 }}>{step+1} / 3</div>
        </div>
        <div style={{ height:4, background:T.bg3, borderRadius:99, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${((step+1)/3)*100}%`, background:T.brand, borderRadius:99, transition:'width .3s' }}/>
        </div>
      </div>
      <MobileBody>
        {step === 0 && (
          <>
            <div style={{ fontSize:22, fontWeight:700, color:T.ink, marginBottom:4, lineHeight:1.2 }}>Which exam are<br/>you preparing for?</div>
            <div style={{ fontSize:13, color:T.ink3, marginBottom:18 }}>We'll personalise your practice.</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {AUTH_EXAMS.map(ex => {
                const sel = exam === ex.key;
                return (
                  <button key={ex.key} onClick={() => setExam(ex.key)} style={{ padding:14, borderRadius:13, border:`1.5px solid ${sel ? ex.color : T.border}`, background: sel ? ex.bg : T.card, textAlign:'left', cursor:'pointer' }}>
                    <div style={{ marginBottom:8 }}>{ex.flag ? <Flag code={ex.flag} w={26} h={18} radius={3}/> : Icon.spark({ width:18, height:18, color:ex.color })}</div>
                    <div style={{ fontSize:13.5, fontWeight:700, color: sel ? ex.color : T.ink }}>{ex.label}</div>
                    <div style={{ fontSize:10.5, color:T.ink4 }}>{ex.sub}</div>
                  </button>
                );
              })}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div style={{ fontSize:22, fontWeight:700, color:T.ink, marginBottom:4, lineHeight:1.2 }}>What's your<br/>target score?</div>
            <div style={{ fontSize:13, color:T.ink3, marginBottom:18 }}>For <span style={{ color:selExam.color, fontWeight:700 }}>{selExam.label}</span></div>
            <ScoreSlider min={4} max={9} step={0.5} value={score} onChange={setScore} color={selExam.color}/>
          </>
        )}
        {step === 2 && (
          <>
            <div style={{ fontSize:22, fontWeight:700, color:T.ink, marginBottom:4, lineHeight:1.2 }}>Your native<br/>language?</div>
            <div style={{ fontSize:13, color:T.ink3, marginBottom:18 }}>Helps us tailor feedback.</div>
            <Field label="Native language" placeholder="e.g. Arabic, Hindi, Spanish…" value={native} onChange={setNative}/>
            <div style={{ marginTop:14, display:'flex', flexWrap:'wrap', gap:7 }}>
              {['Arabic', 'Hindi', 'Spanish', 'Chinese', 'Portuguese', 'French'].map(l => (
                <button key={l} onClick={() => setNative(l)} style={{ padding:'6px 12px', borderRadius:99, background: native===l ? T.ink : T.card, color: native===l ? '#fff' : T.ink2, border:`1px solid ${native===l ? T.ink : T.border}`, fontSize:12, fontWeight:600 }}>{l}</button>
              ))}
            </div>
          </>
        )}
        <div style={{ display:'flex', gap:10, marginTop:28 }}>
          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} style={{ width:48, height:48, borderRadius:13, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, flexShrink:0 }}>
              {Icon.arrowL({ width:16, height:16 })}
            </button>
          )}
          <Btn label={loading ? 'Saving…' : step < 2 ? 'Continue' : 'Start learning'} iconRight={Icon.arrow({ width:13, height:13 })} fullWidth accent={T.brand} size="lg"
            style={{ opacity: canNext ? 1 : .45 }}
            onClick={handleFinish}/>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

Object.assign(window, {
  AuthLoginDesktop, AuthSignupDesktop, AuthOnboardingDesktop,
  AuthLoginMobile, AuthSignupMobile, AuthOnboardingMobile,
  LoginCard, SignupCard, OnboardingCard,
});
