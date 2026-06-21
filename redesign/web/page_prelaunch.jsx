// ── Pre-launch states & flows ──────────────────────────────
// Empty / error / permission / payment / legal / lifecycle screens
// All grouped on one canvas page (route: 'prelaunch')

const { useState: useStPL, useEffect: useEfPL } = React;

const PL_CATS = [
  { id:'empty',    label:'Empty states' },
  { id:'error',    label:'Errors & offline' },
  { id:'payment',  label:'Payment failures' },
  { id:'consent',  label:'Cookie / GDPR' },
  { id:'cancel',   label:'Cancel flow' },
  { id:'deletion', label:'Delete & export' },
  { id:'permission', label:'Push opt-in' },
  { id:'rating',   label:'Rate the app' },
  { id:'whatsnew', label:"What's new" },
];

// ─── shared frame ─────────────────────────────────────────
function PLFrame({ title, sub, w=460, h=520, bg=T.card, children }) {
  return (
    <div style={{ background:bg, border:`1px solid ${T.border}`, borderRadius:14, width:w, minHeight:h, overflow:'hidden', position:'relative', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div>
          <div style={{ fontSize:11, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{title}</div>
          {sub && <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{sub}</div>}
        </div>
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

const PLBtn = ({ label, accent=T.brand, ghost, sm, full, ic }) => (
  <button style={{ padding: sm ? '8px 14px' : '11px 16px', borderRadius:9, background: ghost ? 'transparent' : accent, color: ghost ? T.ink2 : '#fff', fontSize: sm ? 12 : 13, fontWeight:700, border: ghost ? `1px solid ${T.border}` : 'none', cursor:'pointer', width: full ? '100%' : 'auto', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6 }}>{ic}{label}</button>
);

// ─── EMPTY STATES ────────────────────────────────────────
function EmptyDashboard() {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', padding:'24px 22px' }}>
      <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Welcome to Fluentra</div>
      <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.1, marginBottom:6 }}>Your first week starts here.</div>
      <div style={{ fontSize:12.5, color:T.ink3, marginBottom:18, lineHeight:1.5 }}>No streaks yet. No history. Just a clean page and a 5-minute lesson waiting.</div>
      <div style={{ background:T.brandGrad, borderRadius:14, padding:'18px 16px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
        <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:'.16em', opacity:.85, textTransform:'uppercase', marginBottom:6 }}>Today · 5 min</div>
        <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.05 }}>Saluda con confianza</div>
        <div style={{ fontSize:11.5, opacity:.85, marginTop:4 }}>Lesson 1 of 240 · Spanish A1</div>
        <div style={{ marginTop:14 }}><PLBtn label="Start your first lesson" accent="#fff" sm/></div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
        {[{t:'Set a goal', s:'Pick why you\'re learning'},{t:'Place yourself', s:'2-min level test'}].map(c => (
          <div key={c.t} style={{ padding:'12px 14px', border:`1px dashed ${T.border}`, borderRadius:10, background:T.bg2 }}>
            <div style={{ fontSize:11.5, fontWeight:700, color:T.ink, marginBottom:3 }}>{c.t}</div>
            <div style={{ fontSize:10.5, color:T.ink4 }}>{c.s}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:11, color:T.ink5, textAlign:'center' }}>Streaks, badges and friends appear once you've completed your first lesson.</div>
    </div>
  );
}

function EmptyFriends() {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center' }}>
      <div style={{ width:104, height:104, borderRadius:52, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="8" r="3.5"/><path d="M3 20a6 6 0 0112 0"/><circle cx="17" cy="9" r="2.5" opacity=".6"/><path d="M14 19a4 4 0 018 0" opacity=".6"/></svg>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, marginBottom:6 }}>Better with company.</div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:20, maxWidth:320 }}>Add your first friend to compare streaks, share progress, and unlock the leaderboard.</div>
      <div style={{ display:'flex', gap:8, marginBottom:22 }}>
        <PLBtn label="Find people you know"/>
        <PLBtn label="Invite a friend" ghost/>
      </div>
      <div style={{ paddingTop:14, borderTop:`1px solid ${T.hairline}`, fontSize:11, color:T.ink5, width:'100%', maxWidth:280 }}>Built for serious language learners — be among the first.</div>
    </div>
  );
}

function EmptyLibrary() {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', padding:'24px 22px' }}>
      <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
        <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1 }}>Your library</div>
        <div style={{ fontSize:11, color:T.ink5 }}>0 saved</div>
      </div>
      <div style={{ display:'flex', gap:6, marginBottom:18, opacity:.4 }}>
        {['All','Phrases','Articles','Audio','Notes'].map(f => <span key={f} style={{ padding:'5px 10px', fontSize:11, color:T.ink3, background:T.bg2, borderRadius:99 }}>{f}</span>)}
      </div>
      <div style={{ flex:1, border:`1.5px dashed ${T.border}`, borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 18px', textAlign:'center' }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Nothing saved yet</div>
        <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:8, maxWidth:280 }}>Tap any phrase mid-lesson to keep it.</div>
        <div style={{ fontSize:12, color:T.ink4, lineHeight:1.55, maxWidth:300, marginBottom:14 }}>Saved phrases appear here as flashcards. The more you save, the smarter your reviews get.</div>
        <PLBtn label="Browse phrasebook" sm/>
      </div>
    </div>
  );
}

function EmptyExamHistory() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 22px', display:'flex', flexDirection:'column' }}>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1, marginBottom:4 }}>Exam history</div>
      <div style={{ fontSize:12, color:T.ink4, marginBottom:18 }}>Your attempts and scores will live here.</div>
      <div style={{ flex:1, border:`1.5px dashed ${T.border}`, borderRadius:14, padding:'24px 18px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:60, height:60, borderRadius:30, background:T.bg2, color:T.ink4, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9l6-6 6 6"/><path d="M12 3v18"/><path d="M4 21h16"/></svg>
        </div>
        <div style={{ fontFamily:T.serif, fontSize:19, color:T.ink, marginBottom:6 }}>No attempts yet</div>
        <div style={{ fontSize:12, color:T.ink4, lineHeight:1.55, maxWidth:280, marginBottom:14 }}>Take a free 10-minute mock exam to see where you'd score on DELE A2 today.</div>
        <PLBtn label="Try a free mock" sm/>
      </div>
    </div>
  );
}

// ─── ERROR / OFFLINE / MAINTENANCE ───────────────────────
function OfflineState() {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center' }}>
      <div style={{ width:104, height:104, borderRadius:52, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M3 8a16 16 0 0118 0M6 12a10 10 0 0112 0M9 16a4 4 0 016 0"/><circle cx="12" cy="20" r="1.2" fill="currentColor"/><line x1="3" y1="3" x2="21" y2="21" stroke={T.brand} strokeWidth="1.6"/></svg>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, marginBottom:6 }}>You're offline.</div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:22, maxWidth:330 }}>Your progress is safe. We'll sync everything you do here as soon as you're reconnected.</div>
      <PLBtn label="Try again" sm/>
      <div style={{ marginTop:24, padding:'12px 14px', background:T.bg2, borderRadius:11, fontSize:11.5, color:T.ink3, maxWidth:320, lineHeight:1.5 }}>
        <b style={{ color:T.ink2 }}>3 lessons available offline:</b> Spanish · Daily life (1, 2, 3)
      </div>
    </div>
  );
}

function ServerErrorState() {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center' }}>
      <div style={{ fontFamily:T.serif, fontSize:64, color:T.ink2, marginBottom:6 }}>500</div>
      <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:6 }}>That's on us, not you.</div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:18, maxWidth:340 }}>Something broke on our end. Engineering has been pinged automatically. Your progress is saved.</div>
      <div style={{ display:'flex', gap:8, marginBottom:18 }}>
        <PLBtn label="Try again" sm/>
        <PLBtn label="Status page" ghost sm/>
      </div>
      <div style={{ fontSize:11, color:T.ink5 }}>Error ID · <span style={{ fontFamily:T.mono, color:T.ink3 }}>fl-ax93-7c2k</span></div>
    </div>
  );
}

function MaintenanceState() {
  return (
    <div style={{ position:'absolute', inset:0, background:T.ink, color:'#fff', padding:'40px 32px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div style={{ width:64, height:64, borderRadius:32, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.16)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14.7 6.3a4 4 0 015.0 5l-9.4 9.4-5-1 .9-4.5z"/><path d="M14 7l3 3"/></svg>
      </div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.18em', color:T.brand, marginBottom:14, textTransform:'uppercase' }}>Scheduled maintenance</div>
      <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1.05, marginBottom:10 }}>Back in about 20 minutes.</div>
      <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.6, maxWidth:360, marginBottom:24 }}>We're rolling out a smarter Lía. Your streak is paused — you won't lose it.</div>
      <div style={{ padding:'12px 18px', background:'rgba(255,255,255,.08)', borderRadius:11, fontSize:12, fontFamily:T.mono }}>Estimated complete · 14:20 UTC</div>
      <div style={{ marginTop:24, fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.brand }}>Speak it. Score it. Own it.</div>
    </div>
  );
}

function ForceUpdateState() {
  return (
    <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 32px', textAlign:'center', background:T.bg }}>
      <div style={{ width:96, height:96, borderRadius:24, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 14px 32px ${T.brand}40` }}>
        {Icon.brandmark({ width:48, height:48 })}
      </div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.16em', color:T.ink4, marginBottom:12, textTransform:'uppercase' }}>Update required</div>
      <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.1, marginBottom:8 }}>A newer version is ready.</div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:22, maxWidth:340 }}>This version of Fluentra is out of date and won't connect. Update to keep your streak.</div>
      <PLBtn label="Update Fluentra · 32 MB" full/>
      <div style={{ marginTop:14, fontSize:11, color:T.ink5 }}>v3.1.0 → v3.4.2 · Released 2 days ago</div>
    </div>
  );
}

function LessonFailState() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'30px 26px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div style={{ width:60, height:60, borderRadius:30, background:'#FFF1ED', color:'#E07555', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="13"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:21, color:T.ink, marginBottom:6 }}>Lesson didn't load.</div>
      <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55, marginBottom:18, maxWidth:300 }}>The audio files for this lesson timed out. Other lessons are working fine — try retrying or pick a different one.</div>
      <div style={{ display:'flex', gap:8 }}>
        <PLBtn label="Retry" sm/>
        <PLBtn label="Pick another lesson" ghost sm/>
      </div>
    </div>
  );
}

// ─── PAYMENT FAILURES ────────────────────────────────────
function CardDeclined() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'30px 26px', display:'flex', flexDirection:'column' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:'#FFF4F1', border:'1px solid #F4D9CE', borderRadius:11, marginBottom:18 }}>
        <div style={{ width:28, height:28, borderRadius:14, background:'#E07555', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:700, color:'#9C4A2C' }}>Card declined</div>
          <div style={{ fontSize:11, color:'#A6634A' }}>Your bank rejected the payment · Code: <span style={{ fontFamily:T.mono }}>do_not_honor</span></div>
        </div>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:21, color:T.ink, marginBottom:6 }}>Let's try another way.</div>
      <div style={{ fontSize:12.5, color:T.ink3, marginBottom:18, lineHeight:1.55 }}>Your bank declined the charge — usually it's a fraud check. Most users just need to retry or call their bank.</div>
      <div style={{ marginBottom:14 }}>
        {[{t:'Retry the same card', d:'Quickest if you just got a fraud alert'},{t:'Use a different card', d:'Most people get past this with a 2nd card'},{t:'Pay with PayPal', d:'No card needed'},{t:'Call your bank', d:'They can approve the charge in 30 sec'}].map((o,i) => (
          <button key={o.t} style={{ width:'100%', textAlign:'left', padding:'10px 12px', background: i===1 ? T.brandLight : T.card, border:`1px solid ${i===1 ? T.brand+'55' : T.border}`, borderRadius:11, marginBottom:6, cursor:'pointer' }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{o.t}</div>
            <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{o.d}</div>
          </button>
        ))}
      </div>
      <div style={{ fontSize:11, color:T.ink5, textAlign:'center' }}>Your trial doesn't start until payment succeeds.</div>
    </div>
  );
}

function PaymentRetry() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'30px 26px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div style={{ width:64, height:64, borderRadius:32, background:'#FFF4E5', color:'#C97D1F', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      </div>
      <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.16em', color:'#C97D1F', marginBottom:10, textTransform:'uppercase' }}>Renewal failed · Day 2 of 7</div>
      <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:8 }}>We couldn't renew your Pro plan.</div>
      <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55, marginBottom:18, maxWidth:340 }}>We'll retry on Mar 18. To keep Pro features without interruption, update your card now.</div>
      <div style={{ width:'100%', maxWidth:300, padding:'12px 14px', background:T.bg2, borderRadius:11, marginBottom:16, display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12 }}>
        <span style={{ color:T.ink2 }}>Visa ending 4242</span>
        <span style={{ color:'#E07555', fontWeight:700 }}>Expired</span>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <PLBtn label="Update card" sm/>
        <PLBtn label="Switch plan" ghost sm/>
      </div>
    </div>
  );
}

// ─── COOKIE / GDPR ──────────────────────────────────────
function CookieBanner() {
  return (
    <div style={{ position:'absolute', inset:0, padding:24, background:'linear-gradient(180deg, #F5F2ED 0%, #EDEAE3 100%)' }}>
      <div style={{ position:'absolute', left:24, right:24, bottom:24, background:T.ink, color:'#fff', borderRadius:14, padding:'18px 20px', boxShadow:'0 16px 40px rgba(0,0,0,.25)' }}>
        <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
          <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.1)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="14" cy="13" r="1.5" fill="currentColor"/><circle cx="11" cy="16" r="1" fill="currentColor"/></svg>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:T.serif, fontSize:16, marginBottom:4 }}>We use cookies to make Fluentra work.</div>
            <div style={{ fontSize:11.5, color:'rgba(255,255,255,.7)', lineHeight:1.5, marginBottom:12 }}>Essential cookies keep you signed in. Optional ones help us understand which lessons land. You're in control — tweak anytime.</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              <button style={{ padding:'8px 14px', borderRadius:8, background:'#fff', color:T.ink, fontSize:11.5, fontWeight:700, cursor:'pointer', border:'none' }}>Accept all</button>
              <button style={{ padding:'8px 14px', borderRadius:8, background:'transparent', color:'#fff', fontSize:11.5, fontWeight:700, border:'1px solid rgba(255,255,255,.25)', cursor:'pointer' }}>Essential only</button>
              <button style={{ padding:'8px 14px', borderRadius:8, background:'transparent', color:'rgba(255,255,255,.7)', fontSize:11.5, fontWeight:600, border:'none', textDecoration:'underline', textUnderlineOffset:3, cursor:'pointer' }}>Customize</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookiePrefs() {
  const cats = [
    { id:'essential', t:'Strictly necessary', d:'Sign-in, security, fraud prevention. Always on.', on:true, locked:true },
    { id:'analytics', t:'Analytics', d:'Helps us see which lessons land and which fall flat.', on:true },
    { id:'personalize', t:'Personalization', d:'Recommends content based on your strengths and gaps.', on:true },
    { id:'marketing', t:'Marketing', d:'Used to show you Fluentra ads on other sites.', on:false },
  ];
  return (
    <div style={{ position:'absolute', inset:0, padding:'22px 22px 18px', overflow:'auto' }}>
      <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:4 }}>Cookie preferences</div>
      <div style={{ fontSize:12, color:T.ink4, marginBottom:18, lineHeight:1.5 }}>You can change these anytime in Settings → Privacy.</div>
      {cats.map(c => (
        <div key={c.id} style={{ padding:'12px 14px', border:`1px solid ${T.border}`, borderRadius:11, marginBottom:8, background:T.card, display:'flex', gap:12, alignItems:'flex-start' }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{c.t}</div>
            <div style={{ fontSize:11, color:T.ink4, lineHeight:1.5, marginTop:2 }}>{c.d}</div>
          </div>
          <div style={{ width:38, height:22, borderRadius:11, background: c.on ? T.brand : T.bg3, position:'relative', flexShrink:0, opacity: c.locked ? .5 : 1 }}>
            <div style={{ position:'absolute', top:2, left: c.on ? 18 : 2, width:18, height:18, borderRadius:9, background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
          </div>
        </div>
      ))}
      <div style={{ display:'flex', gap:8, marginTop:14 }}>
        <PLBtn label="Save preferences" sm/>
        <PLBtn label="Reject optional" ghost sm/>
      </div>
    </div>
  );
}

// ─── CANCEL FLOW ────────────────────────────────────────
function CancelStep1() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 24px 18px', overflow:'auto' }}>
      <div style={{ fontSize:11, color:T.ink5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Step 1 of 3 · Why are you leaving?</div>
      <div style={{ fontFamily:T.serif, fontSize:23, color:T.ink, lineHeight:1.1, marginBottom:14 }}>Help us do better.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14 }}>
        {['Too expensive','Not using it enough','Found a different app','Missing a feature I need','Tech issues / bugs','Just taking a break'].map((r, i) => (
          <button key={r} style={{ textAlign:'left', padding:'11px 14px', background: i===1 ? T.brandLight : T.card, border:`1px solid ${i===1 ? T.brand+'55' : T.border}`, borderRadius:10, fontSize:12.5, color:T.ink, cursor:'pointer' }}>{r}</button>
        ))}
      </div>
      <textarea placeholder="Optional: tell us more (read by a human, every time)" style={{ width:'100%', padding:'10px 12px', borderRadius:10, border:`1px solid ${T.border}`, fontSize:12, color:T.ink, background:T.bg2, resize:'none', height:60, fontFamily:'inherit' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:14 }}>
        <PLBtn label="Keep my plan" ghost sm/>
        <PLBtn label="Continue →" sm/>
      </div>
    </div>
  );
}

function CancelRetention() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 24px 18px', overflow:'auto' }}>
      <div style={{ fontSize:11, color:T.ink5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Step 2 of 3 · Before you go</div>
      <div style={{ fontFamily:T.serif, fontSize:23, color:T.ink, lineHeight:1.1, marginBottom:14 }}>Three options most people pick instead.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
        <div style={{ padding:'14px 16px', background:T.brandGrad, color:'#fff', borderRadius:13, position:'relative' }}>
          <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.85, marginBottom:5 }}>Most popular</div>
          <div style={{ fontFamily:T.serif, fontSize:18, marginBottom:3 }}>50% off for 3 months</div>
          <div style={{ fontSize:11.5, opacity:.85, marginBottom:10 }}>$12 / month · then back to $24</div>
          <PLBtn label="Take the discount" accent="#fff" sm/>
        </div>
        <div style={{ padding:'12px 14px', border:`1px solid ${T.border}`, borderRadius:11 }}>
          <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, marginBottom:3 }}>Pause for 3 months</div>
          <div style={{ fontSize:11.5, color:T.ink4, marginBottom:8 }}>Keep your streak frozen. Resume anytime, no charge.</div>
          <PLBtn label="Pause subscription" ghost sm/>
        </div>
        <div style={{ padding:'12px 14px', border:`1px solid ${T.border}`, borderRadius:11 }}>
          <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, marginBottom:3 }}>Switch to the lighter plan</div>
          <div style={{ fontSize:11.5, color:T.ink4, marginBottom:8 }}>$9/mo · 3 lessons a day, no exam practice.</div>
          <PLBtn label="Downgrade plan" ghost sm/>
        </div>
      </div>
      <button style={{ width:'100%', padding:'12px', background:'transparent', border:'none', fontSize:11.5, color:T.ink4, textDecoration:'underline', textUnderlineOffset:3, cursor:'pointer' }}>No thanks, cancel anyway</button>
    </div>
  );
}

function CancelConfirm() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 24px 18px', overflow:'auto' }}>
      <div style={{ fontSize:11, color:T.ink5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Step 3 of 3 · Final check</div>
      <div style={{ fontFamily:T.serif, fontSize:23, color:T.ink, lineHeight:1.1, marginBottom:14 }}>Here's what you'll lose.</div>
      <div style={{ padding:'14px 16px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:11, marginBottom:14 }}>
        {[{t:'14-day streak', s:'Resets to 0 if you cancel'},{t:'Unlimited Lía conversations', s:'Drops to 5 / day'},{t:'All exam practice', s:'Locked'},{t:'24 saved phrases', s:'Stay accessible'}].map((r,i) => (
          <div key={r.t} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i<3 ? `1px solid ${T.hairline}` : 'none' }}>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{r.t}</div>
              <div style={{ fontSize:10.5, color:T.ink4 }}>{r.s}</div>
            </div>
            <div style={{ fontSize:14, color: i===3 ? '#3D8F65' : '#C95D3D' }}>{i===3 ? '✓' : '✕'}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:11.5, color:T.ink4, lineHeight:1.55, marginBottom:14 }}>You'll keep Pro through Mar 24. You can resubscribe anytime — your data stays for 30 days.</div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <PLBtn label="Cancel my plan" accent="#9C3823" sm/>
        <PLBtn label="Keep Pro" sm/>
      </div>
    </div>
  );
}

// ─── DELETE / EXPORT ────────────────────────────────────
function ExportData() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 24px 18px', overflow:'auto' }}>
      <div style={{ fontFamily:T.serif, fontSize:23, color:T.ink, lineHeight:1.1, marginBottom:6 }}>Export your data</div>
      <div style={{ fontSize:12, color:T.ink4, marginBottom:18, lineHeight:1.55 }}>Everything we have on you, in machine-readable JSON. We'll email a download link.</div>
      <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
        {['Profile + settings','All lesson history (240 lessons)','24 saved phrases','Streak + badge log','Subscription invoices','Lía conversation transcripts'].map(t => (
          <label key={t} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:T.card, border:`1px solid ${T.border}`, borderRadius:10, cursor:'pointer', fontSize:12.5, color:T.ink2 }}>
            <div style={{ width:18, height:18, borderRadius:5, background:T.brand, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4"><polyline points="5 13 10 18 19 7"/></svg>
            </div>
            {t}
          </label>
        ))}
      </div>
      <div style={{ padding:'10px 12px', background:T.bg2, borderRadius:10, fontSize:11.5, color:T.ink3, marginBottom:14, lineHeight:1.5 }}>
        Format · <b style={{ color:T.ink2 }}>JSON + CSV</b> &nbsp;·&nbsp; Size · <b style={{ color:T.ink2 }}>~12 MB</b> &nbsp;·&nbsp; Ready in · <b style={{ color:T.ink2 }}>~5 min</b>
      </div>
      <PLBtn label="Email me the export" full/>
    </div>
  );
}

function DeleteAccount() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 24px 18px', overflow:'auto' }}>
      <div style={{ display:'inline-block', padding:'4px 10px', borderRadius:99, background:'#FCEEEA', color:'#9C3823', fontSize:10.5, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Permanent action</div>
      <div style={{ fontFamily:T.serif, fontSize:23, color:T.ink, lineHeight:1.1, marginBottom:6 }}>Delete your account?</div>
      <div style={{ fontSize:12, color:T.ink4, marginBottom:18, lineHeight:1.55 }}>This deletes everything — lessons, streak, saved phrases, friends, exam history. We can't recover it after 30 days.</div>
      <div style={{ padding:'14px 16px', background:'#FDF6F4', border:'1px solid #F0DAD2', borderRadius:11, marginBottom:14 }}>
        <div style={{ fontSize:11.5, fontWeight:700, color:'#9C3823', marginBottom:8 }}>To confirm, type <span style={{ fontFamily:T.mono, background:'#fff', padding:'1px 6px', borderRadius:4 }}>delete my account</span> below.</div>
        <input placeholder="" style={{ width:'100%', padding:'9px 11px', borderRadius:8, border:'1px solid #DCC0B8', background:'#fff', fontSize:12, color:T.ink, fontFamily:T.mono, outline:'none' }}/>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:14, fontSize:11.5, color:T.ink3 }}>
        <label style={{ display:'flex', gap:8, alignItems:'flex-start', cursor:'pointer' }}><input type="checkbox" defaultChecked style={{ marginTop:2 }}/> I've exported my data (recommended)</label>
        <label style={{ display:'flex', gap:8, alignItems:'flex-start', cursor:'pointer' }}><input type="checkbox" style={{ marginTop:2 }}/> I understand this is permanent after 30 days</label>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <PLBtn label="Keep my account" ghost sm/>
        <PLBtn label="Delete forever" accent="#9C3823" sm/>
      </div>
    </div>
  );
}

// ─── PUSH OPT-IN ────────────────────────────────────────
function PushOptIn() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'30px 26px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div style={{ width:96, height:96, borderRadius:48, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 14px 32px ${T.brand}40` }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 8a6 6 0 0112 0v5l1.5 3h-15L6 13z"/><path d="M9 19a3 3 0 006 0"/></svg>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1, marginBottom:8 }}>One nudge a day.</div>
      <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55, marginBottom:18, maxWidth:320 }}>Streaks die when you forget. We'll send <b>one</b> notification at your chosen time — never more, never spam.</div>
      <div style={{ width:'100%', maxWidth:300, padding:'12px 14px', background:T.bg2, borderRadius:11, marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span style={{ fontSize:12, color:T.ink2 }}>Reminder time</span>
        <span style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:T.mono }}>20:30</span>
      </div>
      <PLBtn label="Allow notifications" full/>
      <button style={{ marginTop:12, padding:'10px', background:'transparent', border:'none', fontSize:11.5, color:T.ink5, cursor:'pointer' }}>Maybe later</button>
    </div>
  );
}

// ─── RATE THE APP ───────────────────────────────────────
function RatingPrompt() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'30px 26px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
      <div style={{ fontSize:48, marginBottom:8, letterSpacing:6 }}>{['★','★','★','★','★'].map((s,i)=> <span key={i} style={{ color: i<5 ? '#E8A93D' : T.bg3 }}>{s}</span>)}</div>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1, marginBottom:8 }}>Enjoying Fluentra?</div>
      <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55, marginBottom:18, maxWidth:320 }}>You hit a 14-day streak — most people don't. A quick rating helps other learners find us.</div>
      <PLBtn label="Rate on App Store" full/>
      <button style={{ marginTop:8, padding:'10px', background:'transparent', border:'none', fontSize:11.5, color:T.ink5, cursor:'pointer' }}>Not now</button>
      <div style={{ marginTop:14, padding:'9px 12px', background:T.bg2, borderRadius:9, fontSize:11, color:T.ink4, lineHeight:1.5, maxWidth:320 }}>If you have feedback first, <span style={{ color:T.brand, fontWeight:700, textDecoration:'underline', textUnderlineOffset:3, cursor:'pointer' }}>tell us instead</span> — we read every note.</div>
    </div>
  );
}

// ─── WHAT'S NEW ─────────────────────────────────────────
function WhatsNew() {
  return (
    <div style={{ position:'absolute', inset:0, padding:'24px 24px 18px', overflow:'auto' }}>
      <div style={{ display:'inline-block', padding:'4px 10px', borderRadius:99, background:T.brandLight, color:T.brand, fontSize:10.5, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:12 }}>v3.4 · This week</div>
      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.05, marginBottom:14 }}>Three things, sharper.</div>
      {[
        { t:'Lía remembers your café order', d:'Tutor now keeps context across days. Pick up where you left off without re-explaining.', tag:'AI' },
        { t:'JLPT N5 pack', d:'Full kanji + listening prep, mock test included. Free for Pro.', tag:'Exams' },
        { t:'Pause your streak (legitimately)', d:'Travelling? Sick? Lock your streak for up to 7 days.', tag:'Streaks' },
      ].map((r, i) => (
        <div key={r.t} style={{ display:'flex', gap:12, padding:'12px 0', borderBottom: i<2 ? `1px solid ${T.hairline}` : 'none' }}>
          <div style={{ width:30, height:30, borderRadius:8, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:T.serif, fontSize:13 }}>{i+1}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{r.t}</div>
              <span style={{ fontSize:9.5, fontWeight:800, color:T.brand, background:T.brandLight, padding:'2px 6px', borderRadius:99, letterSpacing:'.08em', textTransform:'uppercase' }}>{r.tag}</span>
            </div>
            <div style={{ fontSize:11.5, color:T.ink4, lineHeight:1.55 }}>{r.d}</div>
          </div>
        </div>
      ))}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:18 }}>
        <button style={{ padding:0, background:'transparent', border:'none', fontSize:11, color:T.ink5, cursor:'pointer' }}>See full changelog</button>
        <PLBtn label="Got it" sm/>
      </div>
    </div>
  );
}

// ─── desktop page ──────────────────────────────────────
function PrelaunchPage() {
  const [cat, setCat] = useStPL('empty');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 60px' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ marginBottom:18 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Pre-launch</div>
            <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.05 }}>Edge-case states & lifecycle flows</div>
            <div style={{ fontSize:13, color:T.ink4, marginTop:6, maxWidth:680 }}>Empty, error, payment-failure, GDPR, cancellation, deletion, opt-in, rating, and what's-new — designed cohesively before launch.</div>
          </div>
          <Card padding={6} style={{ marginBottom:22, display:'inline-flex', gap:2, flexWrap:'wrap' }}>
            {PL_CATS.map(c => (
              <button key={c.id} onClick={() => setCat(c.id)} style={{ padding:'8px 14px', borderRadius:7, fontSize:12.5, fontWeight:cat===c.id?700:500, color:cat===c.id?T.ink:T.ink3, background:cat===c.id?T.bg2:'transparent', cursor:'pointer' }}>{c.label}</button>
            ))}
          </Card>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(460px, 1fr))', gap:18 }}>
            {cat === 'empty' && <>
              <PLFrame title="Empty · First-time dashboard"><EmptyDashboard/></PLFrame>
              <PLFrame title="Empty · No friends"><EmptyFriends/></PLFrame>
              <PLFrame title="Empty · Library"><EmptyLibrary/></PLFrame>
              <PLFrame title="Empty · Exam history"><EmptyExamHistory/></PLFrame>
            </>}
            {cat === 'error' && <>
              <PLFrame title="Offline"><OfflineState/></PLFrame>
              <PLFrame title="Server error · 500"><ServerErrorState/></PLFrame>
              <PLFrame title="Maintenance" bg={T.ink}><MaintenanceState/></PLFrame>
              <PLFrame title="Force update"><ForceUpdateState/></PLFrame>
              <PLFrame title="Lesson failed to load"><LessonFailState/></PLFrame>
            </>}
            {cat === 'payment' && <>
              <PLFrame title="Card declined · Initial purchase"><CardDeclined/></PLFrame>
              <PLFrame title="Renewal failed · Dunning"><PaymentRetry/></PLFrame>
            </>}
            {cat === 'consent' && <>
              <PLFrame title="Cookie banner · First visit" h={520}><CookieBanner/></PLFrame>
              <PLFrame title="Cookie preferences"><CookiePrefs/></PLFrame>
            </>}
            {cat === 'cancel' && <>
              <PLFrame title="Cancel · Step 1 reason"><CancelStep1/></PLFrame>
              <PLFrame title="Cancel · Step 2 retention"><CancelRetention/></PLFrame>
              <PLFrame title="Cancel · Step 3 confirm"><CancelConfirm/></PLFrame>
            </>}
            {cat === 'deletion' && <>
              <PLFrame title="Export your data"><ExportData/></PLFrame>
              <PLFrame title="Delete account · Confirm"><DeleteAccount/></PLFrame>
            </>}
            {cat === 'permission' && <PLFrame title="Push notifications opt-in"><PushOptIn/></PLFrame>}
            {cat === 'rating' && <PLFrame title="App rating prompt"><RatingPrompt/></PLFrame>}
            {cat === 'whatsnew' && <PLFrame title="What's new modal"><WhatsNew/></PLFrame>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── mobile mirror page ────────────────────────────────
function MPrelaunchPage() {
  const [cat, setCat] = useStPL('empty');
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back onBack={()=>nav('settings')} title="Pre-launch states"/>
      <MobileBody padding={[12,14,30]} tabBarPad={false}>
        <div style={{ display:'flex', gap:6, overflow:'auto', marginBottom:14, paddingBottom:4 }}>
          {PL_CATS.map(c => (
            <button key={c.id} onClick={()=>setCat(c.id)} style={{ padding:'7px 12px', borderRadius:99, fontSize:11.5, fontWeight:cat===c.id?700:600, color:cat===c.id?'#fff':T.ink2, background:cat===c.id?T.ink:T.card, border:`1px solid ${cat===c.id?T.ink:T.border}`, cursor:'pointer', flexShrink:0 }}>{c.label}</button>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {cat === 'empty' && [['First-time dashboard',EmptyDashboard],['No friends',EmptyFriends],['Empty library',EmptyLibrary],['Exam history',EmptyExamHistory]].map(([t,C]) => (
            <div key={t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:480, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{t}</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><C/></div>
            </div>
          ))}
          {cat === 'error' && [['Offline',OfflineState],['500 error',ServerErrorState],['Maintenance',MaintenanceState],['Force update',ForceUpdateState],['Lesson failed',LessonFailState]].map(([t,C]) => (
            <div key={t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:480, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{t}</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><C/></div>
            </div>
          ))}
          {cat === 'payment' && [['Card declined',CardDeclined],['Renewal failed',PaymentRetry]].map(([t,C]) => (
            <div key={t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:520, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{t}</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><C/></div>
            </div>
          ))}
          {cat === 'consent' && [['Cookie banner',CookieBanner],['Cookie preferences',CookiePrefs]].map(([t,C]) => (
            <div key={t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:520, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{t}</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><C/></div>
            </div>
          ))}
          {cat === 'cancel' && [['Reason',CancelStep1],['Retention',CancelRetention],['Confirm',CancelConfirm]].map(([t,C]) => (
            <div key={t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:520, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{t}</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><C/></div>
            </div>
          ))}
          {cat === 'deletion' && [['Export',ExportData],['Delete account',DeleteAccount]].map(([t,C]) => (
            <div key={t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:540, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>{t}</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><C/></div>
            </div>
          ))}
          {cat === 'permission' && (
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:480, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>Push opt-in</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><PushOptIn/></div>
            </div>
          )}
          {cat === 'rating' && (
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:480, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>Rate the app</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><RatingPrompt/></div>
            </div>
          )}
          {cat === 'whatsnew' && (
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, height:480, position:'relative', overflow:'hidden' }}>
              <div style={{ padding:'9px 13px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink5, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase' }}>What's new</div>
              <div style={{ position:'absolute', inset:'34px 0 0 0' }}><WhatsNew/></div>
            </div>
          )}
        </div>
      </MobileBody>
    </>
  );
}

Object.assign(window, { PrelaunchPage, MPrelaunchPage });
