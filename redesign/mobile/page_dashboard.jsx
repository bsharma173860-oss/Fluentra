// ── Mobile · Dashboard v4 — WEB VOCABULARY ──────────────────
// Mirrors the web dashboard 1:1: gradient language cards, dark Today hero,
// week streak strip, friends today list, tutor card, quick links.
// Translated to mobile width with proper spacing and rhythm.
function MDashboard() {
  const nav = (id) => window.__nav && window.__nav(id);
  const langs = userLanguages();
  const longestStreak = langs.length ? Math.max(...langs.map(l => l.streak)) : 0;
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const _firstName = (((typeof window !== 'undefined' && window.__user && window.__user.name) || '').trim().split(' ')[0]) || '';
  const showUnlock = longestStreak >= 9;
  const topLang = langs[0];
  const topT = topLang ? langTheme(topLang.code) : null;

  return (
    <>
      <MobileBody padding={0}>
        {/* HEADER — eyebrow + serif title + right-side stats (mirrors PageHeader) */}
        <div style={{ padding:'10px 22px 22px' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{greet}{_firstName ? ', ' + _firstName : ''}</div>
              <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Keep the streaks alive.</div>
            </div>
            <div style={{ display:'flex', gap:8, flexShrink:0 }}>
              <button onClick={()=>nav('notifications')} style={{ width:38, height:38, borderRadius:19, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, flexShrink:0, boxShadow:MT.shadowSm, position:'relative' }}>
                {Icon.bell ? Icon.bell({ width:15, height:15 }) : Icon.message({ width:15, height:15 })}
                <span style={{ position:'absolute', top:7, right:9, width:7, height:7, borderRadius:4, background:T.brand, boxShadow:`0 0 0 1.5px ${T.card}` }}/>
              </button>
              <button onClick={()=>nav('settings')} aria-label="Profile and settings" style={{ width:38, height:38, borderRadius:19, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, flexShrink:0, boxShadow:MT.shadowSm }}>
                {Icon.user ? Icon.user({ width:15, height:15 }) : (Icon.cog ? Icon.cog({ width:15, height:15 }) : '\u2699')}
              </button>
            </div>
          </div>
          <div style={{ display:'flex', gap:24, alignItems:'center', marginTop:16, paddingTop:14, borderTop:`1px solid ${T.hairline}` }}>
            <div>
              <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:3 }}>Longest streak</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{longestStreak} <span style={{ fontSize:13, color:T.ink4 }}>days</span></div>
            </div>
            <div style={{ width:1, alignSelf:'stretch', background:T.border }}/>
            <div>
              <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:3 }}>Languages</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{langs.length}</div>
            </div>
          </div>
        </div>

        {/* TODAY HERO — dark slate / orange unlock (mirrors web exactly) */}
        <div style={{ padding:'0 18px 14px' }}>
          <MEchoCard/>
        </div>
        <div style={{ padding:'0 18px', marginBottom:22 }}>
          {showUnlock ? (
            <button onClick={()=>nav('unlock_day9')} style={{
              width:'100%', textAlign:'left', cursor:'pointer',
              background:`linear-gradient(110deg, ${T.brand} 0%, #B85A3E 100%)`,
              borderRadius:18, padding:'18px 20px',
              border:'none', color:'#fff',
              boxShadow:`0 12px 30px ${T.brand}55`,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
              <div style={{ position:'relative' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>🎉</div>
                  <div style={{ fontSize:9.5, fontWeight:700, color:'rgba(255,255,255,.85)', letterSpacing:'.14em', textTransform:'uppercase' }}>Streak milestone unlocked</div>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:'#fff', lineHeight:1.1, marginBottom:4 }}>Your IELTS exam is ready.</div>
                <div style={{ fontSize:11.5, color:'rgba(255,255,255,.85)', marginBottom:14 }}>{longestStreak}-day streak · take it any time in the next 14 days</div>
                <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 16px', background:'#fff', color:T.brand, borderRadius:10, fontSize:12.5, fontWeight:700 }}>
                  Open exam {Icon.arrow({ width:12, height:12 })}
                </div>
              </div>
            </button>
          ) : topLang && (
            <button onClick={()=>nav('practice')} style={{
              width:'100%', textAlign:'left', cursor:'pointer',
              background:`linear-gradient(110deg, ${T.ink} 0%, #2a1f17 100%)`,
              borderRadius:18, padding:'18px 20px',
              border:'none', color:'#fff',
              boxShadow:`0 10px 30px ${topT.accent}33`,
              position:'relative', overflow:'hidden',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:topT.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.play({ width:16, height:16 })}</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:'rgba(255,255,255,.6)', letterSpacing:'.14em', textTransform:'uppercase' }}>Your 15 minutes today</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:21, color:'#fff', lineHeight:1.15, marginBottom:4 }}>Today's {topLang.english} practice</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.7)', marginBottom:14 }}>Pick up where you left off</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 16px', background:topT.accent, borderRadius:10, fontSize:12.5, fontWeight:700, color:'#fff' }}>
                Start now {Icon.arrow({ width:12, height:12 })}
              </div>
            </button>
          )}
        </div>

        {/* YOUR LANGUAGES — gradient cards, 1-col stack on mobile */}
        <div style={{ padding:'0 22px', marginBottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Your languages</div>
          <button onClick={()=>nav('add_language')} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 11px', fontSize:11.5, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, borderRadius:8, boxShadow:MT.shadowSm }}>
            {Icon.plus ? Icon.plus({ width:10, height:10 }) : '+'} Add
          </button>
        </div>
        <div style={{ padding:'0 18px', display:'flex', flexDirection:'column', gap:18, marginBottom:24 }}>
          {langs.map(l => <MDashLangCard key={l.code} lang={l}/>)}
        </div>

        {/* THIS WEEK STRIP — mirrors web sidebar streak card */}
        <div style={{ padding:'0 18px', marginBottom:14 }}>
          <MCard style={{ background:T.bg2, padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:11 }}>
              <div style={{ width:28, height:28, borderRadius:14, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.flame({ width:13, height:13 })}</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>This week</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:6 }}>
              {['M','T','W','T','F','S','S'].map((d,i) => {
                const done = i < Math.min(longestStreak, 7);
                const today = i === Math.min(longestStreak, 7) && longestStreak < 7;
                return (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                    <div style={{ width:'100%', aspectRatio:'1', maxWidth:38, borderRadius:9, background: done ? T.brand : today ? T.brandLight : T.card, border: `1.5px solid ${ today ? T.brand : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: done ? '#fff' : today ? T.brand : T.ink5, fontWeight:700, fontSize:12 }}>
                      {done ? Icon.check({ width:11, height:11 }) : i+1}
                    </div>
                    <div style={{ fontSize:9.5, color: today ? T.brand : T.ink4, fontWeight: today ? 700 : 500 }}>{d}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop:12, fontSize:11.5, color:T.ink3, textAlign:'center' }}>{longestStreak > 0 ? longestStreak + '-day streak · keep it going' : 'Start your streak today'}</div>
          </MCard>
        </div>

        {/* TUTOR CTA — dark card */}
        <div style={{ padding:'0 18px', marginBottom:14 }}>
          <button onClick={()=>nav('tutor')} style={{ width:'100%', background:T.ink, color:'#fff', borderRadius:16, padding:16, display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>{Icon.message({ width:15, height:15 })}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Ask the AI tutor</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginTop:2 }}>Grammar, vocab, conversation</div>
            </div>
            {Icon.arrow({ width:13, height:13, style:{ color:'rgba(255,255,255,.5)' } })}
          </button>
        </div>

        {/* QUICK LINKS — 2-col grid */}
        <div style={{ padding:'0 18px', marginBottom:8 }}>
          <MCard style={{ padding:14 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Quick links</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
              {[
                { id:'friends',      label:'Friends',  ic:'users' },
                { id:'leaderboard',  label:'Ranks',    ic:'bars' },
                { id:'notifications',label:'Inbox',    ic:'message' },
                { id:'progress',     label:'Progress', ic:'trophy' },
                { id:'pricing',      label:'Plan',     ic:'flame' },
                { id:'settings',     label:'Settings', ic:'pen' },
              ].map(q => (
                <button key={q.id} onClick={()=>nav(q.id)} style={{ display:'flex', alignItems:'center', gap:7, padding:'9px 11px', borderRadius:9, background:T.bg2, border:`1px solid ${T.hairline}`, fontSize:11.5, color:T.ink2, fontWeight:600, textAlign:'left' }}>
                  <span style={{ color:T.ink4 }}>{Icon[q.ic] ? Icon[q.ic]({ width:12, height:12 }) : null}</span>
                  {q.label}
                </button>
              ))}
            </div>
          </MCard>
        </div>
      </MobileBody>
      <MobileTabBar active="home"/>
    </>
  );
}

// Gradient language card — mirrors web DashLangCard 1:1, mobile width
function MDashLangCard({ lang }) {
  const t = langTheme(lang.code);
  const lvl = (typeof levelFor === 'function') ? levelFor(lang.streak) : { short: lang.level, long: lang.level };
  const pct = Math.min((lang.streak / 9) * 100, 100);
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <button onClick={() => { window.__setLang(lang.code); nav('lang'); }} style={{
      width:'100%', textAlign:'left',
      borderRadius:18, overflow:'hidden',
      background:`linear-gradient(160deg, ${t.accent} 0%, ${t.accent}dd 55%, ${t.accentLight} 100%)`,
      boxShadow:`0 4px 18px ${t.accent}26, 0 0 0 1px ${t.accent}22`,
      display:'flex', flexDirection:'column',
      padding:0, border:'none',
    }}>
      {/* Hero */}
      <div style={{ padding:'16px 18px 18px', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:160, height:160, display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:9, opacity:.1, pointerEvents:'none' }}>
          {Array.from({ length:48 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, position:'relative' }}>
          <div style={{ boxShadow:'0 2px 6px rgba(0,0,0,.2)', borderRadius:4, overflow:'hidden' }}>
            <Flag code={lang.code} w={40} h={28}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.22)', padding:'4px 10px', borderRadius:99, backdropFilter:'blur(10px)', fontSize:11.5, fontWeight:700 }}>
            {Icon.flame({ width:11, height:11 })} {lang.streak}-day
          </div>
        </div>
        <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1, marginBottom:3, letterSpacing:'-.015em' }}>{lang.native}</div>
        <div style={{ fontSize:11.5, opacity:.85, fontWeight:500 }}>{lang.english} · {lvl.long}</div>
      </div>
      {/* Sheet */}
      <div style={{ background:T.card, borderTopLeftRadius:18, borderTopRightRadius:18, padding:'14px 16px', display:'flex', gap:14, alignItems:'center' }}>
        <div style={{ position:'relative', width:72, height:72, flexShrink:0 }}>
          <svg width={72} height={72} viewBox="0 0 72 72" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="30" fill="none" stroke={T.bg2} strokeWidth="6"/>
            <circle cx="36" cy="36" r="30" fill="none" stroke={t.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${(pct/100)*Math.PI*60} ${Math.PI*60}`}/>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{lang.streak}</div>
            <div style={{ fontSize:7.5, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, marginTop:2 }}>Days</div>
          </div>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', gap:5, marginBottom:7, flexWrap:'wrap' }}>
            <span style={{ fontSize:9.5, fontWeight:800, color:t.accent, background:t.accentLight, padding:'2px 7px', borderRadius:4, letterSpacing:'.06em', textTransform:'uppercase' }}>{lang.exam}</span>
            <span style={{ fontSize:9.5, fontWeight:800, color:T.ink3, background:T.bg2, padding:'2px 7px', borderRadius:4, letterSpacing:'.06em', textTransform:'uppercase' }}>{lang.level}</span>
          </div>
          <div style={{ fontSize:9, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:1 }}>Next up</div>
          <div style={{ fontSize:12, fontWeight:600, color:T.ink, lineHeight:1.25, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>Continue {lang.english}</div>
          <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>Daily practice · 15 min</div>
        </div>
      </div>
    </button>
  );
}

Object.assign(window, { MDashboard, MDashLangCard });
