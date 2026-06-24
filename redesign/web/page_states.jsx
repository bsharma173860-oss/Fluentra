// ── Empty / Error / Loading states ──────────────────────
const { useState: useStateES } = React;

const STATE_CATEGORIES = [
  { id:'loading',   label:'Loading' },
  { id:'empty',     label:'Empty' },
  { id:'error',     label:'Errors' },
  { id:'permission',label:'Permissions' },
  { id:'success',   label:'Success' },
];

// ── building blocks ──────────────────────────────────────
function StateFrame({ title, children, w=420, h=480, bg=T.card }) {
  return (
    <div style={{ background:bg, border:`1px solid ${T.border}`, borderRadius:14, width:w, height:h, overflow:'hidden', position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, fontSize:11, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', display:'flex', justifyContent:'space-between' }}>
        <span>{title}</span>
        <span style={{ display:'flex', gap:4 }}>
          <span style={{ width:8, height:8, borderRadius:4, background:'#FF5F57' }}/>
          <span style={{ width:8, height:8, borderRadius:4, background:'#FEBC2E' }}/>
          <span style={{ width:8, height:8, borderRadius:4, background:'#28C840' }}/>
        </span>
      </div>
      <div style={{ flex:1, overflow:'hidden', position:'relative' }}>{children}</div>
    </div>
  );
}

// Skeleton primitives
const Skel = ({ w='100%', h=12, r=6, style={} }) => (
  <div style={{ width:w, height:h, borderRadius:r, background:`linear-gradient(90deg, ${T.bg2} 0%, ${T.hairline} 50%, ${T.bg2} 100%)`, backgroundSize:'200% 100%', animation:'shimmer 1.6s infinite', ...style }}/>
);

// Empty/error illustration — minimal line art
function Illus({ kind, color=T.brand }) {
  const common = { width:96, height:96, viewBox:'0 0 96 96', fill:'none', stroke:color, strokeWidth:1.6, strokeLinecap:'round', strokeLinejoin:'round' };
  switch(kind) {
    case 'inbox':
      return (<svg {...common}><path d="M14 56l10-30h48l10 30v18a4 4 0 01-4 4H18a4 4 0 01-4-4V56z"/><path d="M14 56h22a4 4 0 014 4v2a4 4 0 004 4h12a4 4 0 004-4v-2a4 4 0 014-4h22" opacity=".5"/></svg>);
    case 'cloud':
      return (<svg {...common}><path d="M28 60a14 14 0 010-28 18 18 0 0134-4 12 12 0 010 24"/><line x1="48" y1="56" x2="48" y2="80" strokeDasharray="3 4"/><polyline points="40 72 48 80 56 72"/></svg>);
    case 'plug':
      return (<svg {...common}><path d="M40 18v14M56 18v14"/><path d="M30 32h36v8a18 18 0 11-36 0v-8z"/><path d="M48 58v18M40 76h16" opacity=".5"/><circle cx="48" cy="58" r="2" fill={color}/></svg>);
    case 'lock':
      return (<svg {...common}><rect x="22" y="44" width="52" height="34" rx="4"/><path d="M32 44V32a16 16 0 0132 0v12"/><circle cx="48" cy="60" r="4" fill={color}/></svg>);
    case 'check':
      return (<svg {...common}><circle cx="48" cy="48" r="34"/><polyline points="34 48 44 58 62 38" strokeWidth="2.4"/></svg>);
    case 'sparkle':
      return (<svg {...common}><path d="M48 14L52 38L76 42L52 46L48 70L44 46L20 42L44 38z" fill={color} fillOpacity=".15"/><circle cx="48" cy="42" r="3" fill={color}/><path d="M22 22l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" opacity=".5"/></svg>);
    case 'search':
      return (<svg {...common}><circle cx="42" cy="42" r="22"/><line x1="58" y1="58" x2="76" y2="76"/><line x1="36" y1="42" x2="48" y2="42" opacity=".5"/></svg>);
    default: return null;
  }
}

// Empty state component
function EmptyState({ illus, illusColor, title, body, primary, secondary, accent=T.brand }) {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center' }}>
      <div style={{ width:104, height:104, borderRadius:52, background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:20 }}>
        <Illus kind={illus} color={illusColor || accent}/>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.15, marginBottom:8, maxWidth:320 }}>{title}</div>
      <div style={{ fontSize:13, color:T.ink4, lineHeight:1.55, maxWidth:340, marginBottom:22 }}>{body}</div>
      <div style={{ display:'flex', gap:8 }}>
        {primary && <Btn label={primary} accent={accent} size="sm"/>}
        {secondary && <Btn label={secondary} variant="outline" accent={T.ink2} size="sm"/>}
      </div>
    </div>
  );
}

// ═══ desktop ═══════════════════════════════════════════════
function StatesPage() {
  const [cat, setCat] = useStateES('loading');

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <style>{`@keyframes shimmer { 0% {background-position:200% 0;} 100% {background-position:-200% 0;} }
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes pulse-soft { 0%,100% { opacity:.4; } 50% { opacity:1; } }`}</style>
      <WebTopbar search=""/>

      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 60px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>UX states</div>
            <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.05 }}>Empty, loading & error states</div>
            <div style={{ fontSize:13, color:T.ink4, marginTop:6 }}>The states users hit between actions. Each frame here is a real screen ready to be reused across the app.</div>
          </div>

          {/* Category tabs */}
          <Card padding={6} style={{ marginBottom:22, display:'inline-flex', gap:2 }}>
            {STATE_CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{ padding:'8px 14px', borderRadius:7, fontSize:12.5, fontWeight:cat===c.id?700:500, color:cat===c.id?T.ink:T.ink3, background:cat===c.id?T.bg2:'transparent', cursor:'pointer' }}>{c.label}</button>
            ))}
          </Card>

          {/* Grid of state frames */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(420px, 1fr))', gap:18 }}>
            {cat === 'loading' && <>
              {/* Dashboard skeleton */}
              <StateFrame title="Loading · Dashboard">
                <div style={{ padding:24 }}>
                  <Skel w={120} h={11} style={{ marginBottom:10 }}/>
                  <Skel w={260} h={26} r={8} style={{ marginBottom:20 }}/>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                    <Skel h={88} r={12}/><Skel h={88} r={12}/>
                  </div>
                  <Skel h={140} r={12} style={{ marginBottom:14 }}/>
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    {[0,1,2].map(i => <div key={i} style={{ display:'flex', gap:10, alignItems:'center' }}><Skel w={36} h={36} r={18}/><Skel w="60%" h={11}/><Skel w={50} h={11} style={{ marginLeft:'auto' }}/></div>)}
                  </div>
                </div>
              </StateFrame>

              {/* Spinner — full screen */}
              <StateFrame title="Loading · Boot screen" bg={T.ink}>
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#fff' }}>
                  <div style={{ width:56, height:56, borderRadius:28, border:'2.5px solid rgba(255,255,255,.2)', borderTopColor:T.brand, animation:'spin 1s linear infinite', marginBottom:16 }}/>
                  <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.2 }}>Setting things up</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,.55)', marginTop:6 }}>Loading your courses & streaks…</div>
                </div>
              </StateFrame>

              {/* Inline progress */}
              <StateFrame title="Loading · Submitting essay">
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32 }}>
                  <div style={{ position:'relative', width:96, height:96, marginBottom:18 }}>
                    <svg width="96" height="96" viewBox="0 0 96 96" style={{ transform:'rotate(-90deg)' }}>
                      <circle cx="48" cy="48" r="42" fill="none" stroke={T.bg2} strokeWidth="6"/>
                      <circle cx="48" cy="48" r="42" fill="none" stroke={T.brand} strokeWidth="6" strokeLinecap="round" strokeDasharray="263.9" strokeDashoffset="100"/>
                    </svg>
                    <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:24, color:T.ink }}>62%</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:6 }}>Grading your response</div>
                  <div style={{ fontSize:12.5, color:T.ink4, textAlign:'center', maxWidth:280, lineHeight:1.55 }}>Our examiner-trained model is checking task achievement, lexical resource, and grammar. About 12 seconds.</div>
                  <Chip label="Step 2 of 3" accent={T.brand} bg={T.brandLight} style={{ marginTop:14 }}/>
                </div>
              </StateFrame>

              {/* List shimmer */}
              <StateFrame title="Loading · Library list">
                <div style={{ padding:'18px 20px' }}>
                  {[0,1,2,3,4].map(i => (
                    <div key={i} style={{ display:'flex', gap:12, padding:'14px 0', borderBottom:`1px solid ${T.hairline}` }}>
                      <Skel w={48} h={48} r={9}/>
                      <div style={{ flex:1 }}>
                        <Skel w={`${60+i*5}%`} h={13} style={{ marginBottom:8 }}/>
                        <Skel w={`${30+i*5}%`} h={10}/>
                      </div>
                      <Skel w={50} h={20} r={10}/>
                    </div>
                  ))}
                </div>
              </StateFrame>
            </>}

            {cat === 'empty' && <>
              <StateFrame title="Empty · No saved words">
                <EmptyState illus="inbox" title="Your saved words live here" body="Tap the bookmark on any word during practice and it'll show up here for review. Aim for 5–10 a day to build vocabulary." primary="Try a flashcard set" secondary="Browse library"/>
              </StateFrame>

              <StateFrame title="Empty · No exam history yet">
                <EmptyState illus="sparkle" accent={T.writing.c} title="Take your first practice exam" body="Get a band score, see your weak areas, and unlock your monthly leaderboard ranking." primary="Start a practice exam" secondary="Learn how scoring works"/>
              </StateFrame>

              <StateFrame title="Empty · Search no results">
                <EmptyState illus="search" title="No matches for 'subjunctive'" body="Try a broader term like 'verb tense', or browse our grammar guides for common topics learners ask about." primary="Open grammar library" secondary="Clear search"/>
              </StateFrame>

              <StateFrame title="Empty · No friends yet">
                <EmptyState illus="sparkle" accent={T.listening.c} title="Learning is better together" body="Invite friends with your code FLU-7842 — when they finish their first session you both get 7 days of Pro." primary="Copy invite code" secondary="Share link"/>
              </StateFrame>
            </>}

            {cat === 'error' && <>
              <StateFrame title="Error · Network">
                <EmptyState illus="cloud" accent={T.brand} title="You're offline" body="We can't reach our servers right now. Your progress is saved locally and will sync when you're back online." primary="Retry" secondary="Continue offline"/>
              </StateFrame>

              <StateFrame title="Error · Session expired">
                <EmptyState illus="lock" accent={T.brand} title="You've been signed out" body="For security, we sign you out after 30 days of inactivity. Your progress is safe — just sign in again to pick up where you left off." primary="Sign in" secondary="Why?"/>
              </StateFrame>

              <StateFrame title="Error · Server (5xx)">
                <EmptyState illus="plug" accent={T.brand} title="Something went wrong on our end" body="We've been notified and are looking into it. You can retry, or check our status page for ongoing incidents." primary="Try again" secondary="View status"/>
              </StateFrame>

              <StateFrame title="Error · 404">
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center' }}>
                  <div style={{ fontFamily:T.serif, fontSize:96, color:T.brand, lineHeight:1, marginBottom:6, letterSpacing:'-.04em' }}>404</div>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:8 }}>Page not found</div>
                  <div style={{ fontSize:13, color:T.ink4, maxWidth:320, lineHeight:1.55, marginBottom:20 }}>The page you're looking for doesn't exist or has moved. Try heading back to your dashboard.</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn nav="dashboard" label="Back to dashboard" accent={T.brand} size="sm"/>
                    <Btn nav="search" label="Search" variant="outline" accent={T.ink2} size="sm"/>
                  </div>
                </div>
              </StateFrame>

              <StateFrame title="Error · Inline form">
                <div style={{ padding:'24px 28px' }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:6 }}>Sign in to Fluentra</div>
                  <div style={{ fontSize:12, color:T.ink4, marginBottom:18 }}>Welcome back — let's keep your streak alive.</div>
                  <div style={{ marginBottom:14 }}>
                    <div style={{ fontSize:11, color:T.ink3, fontWeight:600, marginBottom:6 }}>Email</div>
                    <input defaultValue="maria@example.com" style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, fontFamily:"'Inter',sans-serif" }}/>
                  </div>
                  <div style={{ marginBottom:6 }}>
                    <div style={{ fontSize:11, color:T.brand, fontWeight:600, marginBottom:6 }}>Password</div>
                    <input type="password" defaultValue="••••" style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`1.5px solid ${T.brand}`, fontSize:13, fontFamily:"'Inter',sans-serif", outline:'none' }}/>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, color:T.brand, fontSize:11.5, fontWeight:600, padding:'8px 10px', background:T.brandLight, borderRadius:7, marginBottom:14 }}>
                    <span style={{ width:14, height:14, borderRadius:7, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700 }}>!</span>
                    That password doesn't match. <span style={{ textDecoration:'underline', cursor:'pointer' }}>Reset password</span>
                  </div>
                  <Btn nav="auth_login" label="Sign in" accent={T.brand} fullWidth/>
                </div>
              </StateFrame>

              <StateFrame title="Error · Toast (rate limit)">
                <div style={{ position:'absolute', inset:0, padding:24, background:T.bg2 }}>
                  <Skel h={140} r={12} style={{ marginBottom:14 }}/>
                  <Skel h={80} r={12}/>
                </div>
                <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', background:T.ink, color:'#fff', borderRadius:11, padding:'12px 16px', display:'flex', alignItems:'center', gap:10, boxShadow:'0 8px 24px rgba(0,0,0,.18)', minWidth:300 }}>
                  <span style={{ width:8, height:8, borderRadius:4, background:T.brand, flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600 }}>Slow down — too many requests</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', marginTop:2 }}>You can try again in 14 seconds.</div>
                  </div>
                  <button style={{ fontSize:11, color:'rgba(255,255,255,.6)', background:'transparent', cursor:'pointer' }}>×</button>
                </div>
              </StateFrame>
            </>}

            {cat === 'permission' && <>
              <StateFrame title="Permission · Microphone">
                <EmptyState illus="lock" accent={T.speaking.c} title="Mic access required for Speaking" body="We never record without you knowing — your audio is sent to our examiner model, scored, and discarded after the session." primary="Allow microphone" secondary="Skip for now"/>
              </StateFrame>
              <StateFrame title="Permission · Notifications">
                <EmptyState illus="sparkle" accent={T.listening.c} title="Don't break your streak" body="Allow notifications and we'll send a gentle reminder if your streak is at risk. You can change this any time in Settings." primary="Turn on reminders" secondary="Maybe later"/>
              </StateFrame>
              <StateFrame title="Permission · Pro feature">
                <EmptyState illus="sparkle" accent={T.brand} title="AI Writing feedback is a Pro feature" body="Get band-level scoring on every essay, with examiner-style suggestions across all 4 IELTS criteria. €9.99/month, cancel any time." primary="Upgrade to Pro" secondary="See what's included"/>
              </StateFrame>
            </>}

            {cat === 'success' && <>
              <StateFrame title="Success · Streak milestone">
                <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:32, textAlign:'center', background:`radial-gradient(circle at 50% 30%, ${T.brandLight} 0%, ${T.bg} 70%)` }}>
                  <div style={{ fontSize:80, marginBottom:8 }}>🔥</div>
                  <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1, marginBottom:8 }}>30-day streak!</div>
                  <div style={{ fontSize:13, color:T.ink4, maxWidth:280, lineHeight:1.55, marginBottom:18 }}>You've shown up for a whole month. That's 30 sessions, 412 new words, and roughly 18 hours of practice.</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn label="Share milestone" accent={T.brand} size="sm"/>
                    <Btn label="Continue" variant="outline" accent={T.ink2} size="sm"/>
                  </div>
                </div>
              </StateFrame>
              <StateFrame title="Success · Saved">
                <EmptyState illus="check" accent={T.listening.c} title="Settings saved" body="Your changes have been applied across all your devices. They'll show up the next time you open the app." primary="Back to settings" secondary="Continue learning"/>
              </StateFrame>
              <StateFrame title="Success · Subscription confirmed">
                <div style={{ position:'absolute', inset:0, padding:'32px 30px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
                  <div style={{ width:64, height:64, borderRadius:32, background:T.listening.bg, color:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
                    {Icon.check({ width:28, height:28 })}
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.15, marginBottom:6 }}>Welcome to Fluentra Pro</div>
                  <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.brand, marginBottom:8, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
                  <div style={{ fontSize:13, color:T.ink4, maxWidth:300, lineHeight:1.55, marginBottom:18 }}>Your card was charged $24.00. A receipt is on the way to maria@example.com.</div>
                  <div style={{ width:'100%', maxWidth:300, padding:'12px 14px', background:T.bg2, borderRadius:10, marginBottom:18, display:'flex', justifyContent:'space-between', fontSize:12.5 }}>
                    <span style={{ color:T.ink3 }}>Next billing date</span>
                    <span style={{ color:T.ink, fontWeight:600 }}>June 7, 2026</span>
                  </div>
                  <Btn nav="practice" label="Start practising" accent={T.brand}/>
                </div>
              </StateFrame>
            </>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══ mobile ═══════════════════════════════════════════════