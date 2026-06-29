// ── Page 1: Dashboard ───────────────────────────────────────
// Hero greeting + 4-up language card grid + Today panel

const EXAM_UNLOCK_DAYS = 9;

// CEFR level reflects ABILITY, not how many days in a row you showed up.
// `score` is the learner's average session score (0-100) for the language, or
// null when there's no completed session yet (a brand-new learner is A1, not B1).
function levelFor(score) {
  if (score == null) return { short:'A1', long:'A1 · Beginner' };
  if (score < 45) return { short:'A1', long:'A1 · Beginner' };
  if (score < 58) return { short:'A2', long:'A2 · Elementary' };
  if (score < 70) return { short:'B1', long:'B1 · Intermediate' };
  if (score < 82) return { short:'B2', long:'B2 · Upper-int.' };
  if (score < 92) return { short:'C1', long:'C1 · Advanced' };
  return { short:'C2', long:'C2 · Mastery' };
}
// Average session score (0-100) for one language, or null if no sessions yet.
function abilityScore(rows) {
  var s = (rows || []).map(function (r) { return Number(r.score); }).filter(function (n) { return !isNaN(n); });
  return s.length ? Math.round(s.reduce(function (a, b) { return a + b; }, 0) / s.length) : null;
}

function DashLangCard({ lang, freshlyAdded=false }) {
  const t = langTheme(lang.code);
  const _rows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(function(r){ return r.lang === lang.code; }) : [];
  const streak = (typeof computeStreak==='function') ? computeStreak(_rows) : (lang.streak||0);
  const lvl = levelFor(abilityScore(_rows));
  const pct = Math.min((streak / EXAM_UNLOCK_DAYS) * 100, 100);

  return (
    <div onClick={() => { window.__setLang(lang.code); window.__nav && window.__nav('lang'); }} style={{
      borderRadius:22, overflow:'hidden', cursor:'pointer',
      background:`linear-gradient(160deg, ${t.accent} 0%, ${t.accent}dd 55%, ${t.accentLight} 100%)`,
      boxShadow: freshlyAdded ? `0 0 0 3px ${t.accent}, 0 4px 20px ${t.accent}55` : `0 4px 20px ${t.accent}1f, 0 0 0 1px ${t.accent}22`,
      display:'flex', flexDirection:'column',
      position:'relative',
      animation: freshlyAdded ? 'freshpulse 2s ease-in-out 2' : 'none',
    }}>
      {freshlyAdded && <div style={{ position:'absolute', top:10, right:10, padding:'4px 9px', background:'#fff', color:t.accent, borderRadius:99, fontSize:10, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', zIndex:2, boxShadow:'0 4px 12px rgba(0,0,0,.15)' }}>Just added</div>}
      <style>{`@keyframes freshpulse{0%,100%{transform:scale(1)}50%{transform:scale(1.015)}}`}</style>
      {/* Hero */}
      <div style={{ padding:'22px 24px 26px', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-30, right:-20, width:200, height:200, display:'grid', gridTemplateColumns:'repeat(10,1fr)', gap:10, opacity:.1, pointerEvents:'none' }}>
          {Array.from({ length:80 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, position:'relative' }}>
          <div style={{ boxShadow:'0 2px 8px rgba(0,0,0,.2)', borderRadius:5, overflow:'hidden' }}>
            <Flag code={lang.code} w={48} h={32}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.22)', padding:'5px 11px', borderRadius:99, backdropFilter:'blur(10px)', fontSize:12, fontWeight:700 }}>
            {Icon.flame()} {streak}-day
          </div>
        </div>
        <div style={{ fontFamily:T.serif, fontSize:38, lineHeight:1, marginBottom:4 }}>{lang.native}</div>
        <div style={{ fontSize:12.5, opacity:.85, fontWeight:500 }}>{lang.english} · {lvl.long}</div>
      </div>
      {/* Sheet */}
      <div style={{ background:T.card, borderTopLeftRadius:22, borderTopRightRadius:22, padding:'20px 22px', display:'flex', gap:16 }}>
        <Ring pct={pct} size={92} stroke={8} color={t.accent}>
          <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1 }}>{streak}</div>
          <div style={{ fontSize:8.5, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, marginTop:2 }}>Day streak</div>
        </Ring>
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ display:'flex', gap:5, marginBottom:8, flexWrap:'wrap' }}>
            <Chip label={lang.exam} accent={t.accent} bg={t.accentLight}/>
            <Chip label={lang.level} accent={T.ink3} bg={T.bg2}/>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>Next up</div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.25 }}>Continue {lang.english}</div>
            <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>Daily practice · 15 min</div>
          </div>
          <Btn label="Continue" nav="lang" iconRight={Icon.arrow({ width:12, height:12 })} accent={t.accent} variant="outline" size="sm" fullWidth/>
        </div>
      </div>
    </div>
  );
}

function TodayItem({ ic, label, meta, color, bg, done }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:`1px solid ${T.hairline}` }}>
      <div style={{ width:34, height:34, borderRadius:9, background: done ? T.bg2 : bg, color: done ? T.ink5 : color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {done ? Icon.check({ width:14, height:14 }) : Icon[ic]({ width:15, height:15 })}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color: done ? T.ink4 : T.ink, textDecoration: done ? 'line-through' : 'none' }}>{label}</div>
        <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{meta}</div>
      </div>
      {!done && Icon.chev({ width:13, height:13, style:{ color:T.ink5 } })}
    </div>
  );
}

function DashboardPage() {
  const langs = userLanguages();
  const longestStreak = langs.length ? Math.max.apply(null, langs.map(function(l){ var rows=((typeof window!=='undefined'&&window.__results)||[]).filter(function(r){return r.lang===l.code;}); return (typeof computeStreak==='function')?computeStreak(rows):(l.streak||0); })) : 0;
  const _allres = (typeof window !== 'undefined' && window.__results) || [];
  const _now = new Date();
  const _todayIdx = (_now.getDay() + 6) % 7;
  const _monday = new Date(_now); _monday.setHours(0,0,0,0); _monday.setDate(_now.getDate() - _todayIdx);
  const _weekFlags = [false,false,false,false,false,false,false];
  _allres.forEach(function(r){ if(!r.updated_at) return; var t=new Date(r.updated_at); if(isNaN(t.getTime())) return; t.setHours(0,0,0,0); var diff=Math.round((t.getTime()-_monday.getTime())/86400000); if(diff>=0&&diff<7) _weekFlags[diff]=true; });
  const _streakAll = (typeof computeStreak==='function') ? computeStreak(_allres) : 0;
  const _totalSessions = _allres.length;
  const _scoredAll = _allres.filter(function(r){ return typeof r.score==='number'; });
  const _bestOverall = _scoredAll.length ? Math.max.apply(null, _scoredAll.map(function(r){ return r.score; })) : -1;
  const justAdded = (typeof window !== 'undefined') ? window.__justAddedLang : null;
  const [toastVisible, setToastVisible] = useState(!!justAdded);
  React.useEffect(() => {
    if (!justAdded) return;
    const t = setTimeout(() => { setToastVisible(false); window.__justAddedLang = null; }, 5000);
    return () => clearTimeout(t);
  }, [justAdded]);

  // Greeting: keep neutral English (UI language), no hardcoded foreign greeting on multilingual app.
  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Today's #1 task — single-task hero
  const __today = (typeof window !== 'undefined' && window.__todayContent) || [];
  const __minsByDiff = { easy: 10, medium: 15, hard: 25 };
  const topTask = langs[0] ? {
    lang: langs[0],
    title: (__today[0] && __today[0].title) || 'Start your first lesson',
    mins: (__today[0] && __minsByDiff[__today[0].difficulty]) || 15,
    skill: (__today[0] && __today[0].type) ? (__today[0].type.charAt(0).toUpperCase() + __today[0].type.slice(1)) : 'Practice',
  } : null;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      {toastVisible && justAdded && (() => {
        const lang = userLanguages().find(l => l.code === justAdded);
        const t = langTheme(justAdded);
        if (!lang) return null;
        return (
          <div style={{ position:'absolute', top:18, right:18, zIndex:50, background:T.card, border:`1px solid ${T.border}`, borderRadius:14, boxShadow:'0 12px 40px rgba(0,0,0,.18)', padding:'12px 16px 12px 14px', display:'flex', alignItems:'center', gap:12, minWidth:280, animation:'slideIn .3s ease' }}>
            <div style={{ width:36, height:36, borderRadius:9, background:t.accentLight, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.check({ width:16, height:16 })}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{lang.english} added</div>
              <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>Find it in your sidebar</div>
            </div>
            <button onClick={() => { setToastVisible(false); window.__justAddedLang = null; }} style={{ width:24, height:24, borderRadius:6, color:T.ink5, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.x({ width:11, height:11 })}</button>
            <style>{`@keyframes slideIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
          </div>
        );
      })()}
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow={`${greet}${(typeof window!=='undefined' && window.__user && window.__user.firstName) ? ', ' + window.__user.firstName : ''}`}
          title="Keep the streaks alive."
          right={
            <div style={{ display:'flex', gap:24, alignItems:'center' }}>
              <div>
                <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Longest streak</div>
                <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{longestStreak} <span style={{ fontSize:18, color:T.ink4 }}>days</span></div>
              </div>
              <div style={{ width:1, alignSelf:'stretch', background:T.border }}/>
              <div>
                <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Languages</div>
                <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{langs.length}</div>
              </div>
            </div>
          }
        />

        {/* ECHO — 60-second daily speaking warmup. Sits ABOVE today's hero
            because production-based practice is the highest-leverage daily ritual. */}
        <EchoCard/>

        {/* TODAY HERO — the single most important CTA on the page */}
        {/* If user is at day 9, surface the unlock moment instead of practice */}
        {longestStreak >= 9 ? (
          <button onClick={() => window.__nav?.('unlock_day9')} style={{
            width:'100%', textAlign:'left', cursor:'pointer',
            background:`linear-gradient(110deg, ${T.brand} 0%, #B85A3E 100%)`,
            borderRadius:18, padding:'22px 28px', marginBottom:24,
            display:'flex', alignItems:'center', gap:22,
            border:'none', color:'#fff',
            boxShadow:`0 12px 40px ${T.brand}55`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-20, top:-20, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
            <div style={{ position:'absolute', right:30, bottom:-30, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
            <div style={{ width:54, height:54, borderRadius:14, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff', fontSize:24, position:'relative' }}>🎉</div>
            <div style={{ flex:1, minWidth:0, position:'relative' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.85)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:4 }}>Streak milestone unlocked</div>
              <div style={{ fontFamily:T.serif, fontSize:24, color:'#fff', lineHeight:1.1 }}>Your IELTS exam is ready.</div>
              <div style={{ fontSize:12.5, color:'rgba(255,255,255,.85)', marginTop:4 }}>{longestStreak}-day streak · take it any time in the next 14 days</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 20px', background:'#fff', color:T.brand, borderRadius:11, fontSize:13, fontWeight:700, position:'relative' }}>
              Open exam {Icon.arrow({ width:14, height:14 })}
            </div>
          </button>
        ) : topTask && (() => {
          const t = langTheme(topTask.lang.code);
          return (
            <button data-nav="practice" style={{
              width:'100%', textAlign:'left', cursor:'pointer',
              background:`linear-gradient(110deg, ${T.ink} 0%, #2a1f17 100%)`,
              borderRadius:18, padding:'20px 26px', marginBottom:24,
              display:'flex', alignItems:'center', gap:20,
              border:'none', color:'#fff',
              boxShadow:`0 10px 40px ${t.accent}33`,
            }}>
              <div style={{ width:54, height:54, borderRadius:14, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff' }}>
                {Icon.play({ width:20, height:20 })}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.6)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:4 }}>Your {topTask.mins} minutes today</div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:'#fff', lineHeight:1.15 }}>{topTask.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginTop:4 }}>{topTask.lang.english} · {topTask.skill} · {topTask.mins} min</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 18px', background:t.accent, borderRadius:11, fontSize:13, fontWeight:700, color:'#fff' }}>
                Start now {Icon.arrow({ width:14, height:14 })}
              </div>
            </button>
          );
        })()}

        {/* Adaptive layout: when user has 1–2 languages the right rail stays;
            with 3+ we go single-column so the language grid fills the canvas. */}
        {(() => {
          const wide = langs.length >= 3;
          const cols = langs.length <= 1 ? '1fr' : langs.length === 2 ? '1fr 1fr' : 'repeat(3, 1fr)';
          return (
        <div style={{ display:'grid', gridTemplateColumns: wide ? '1fr' : '1fr 320px', gap:24 }}>
          {/* Languages */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Your languages</div>
              <button data-nav="add_language" style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', fontSize:12, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, cursor:'pointer' }}>
                {Icon.plus ? Icon.plus({ width:11, height:11 }) : '+'} Add language
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: cols, gap:18 }}>
              {langs.map(l => <DashLangCard key={l.code} lang={l} freshlyAdded={l.code === justAdded}/>)}
            </div>

            {/* Wide-mode utility row — keeps streak/friends/tutor/quick-links accessible
                even when the right rail collapses (3+ languages). */}
            {wide && (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginTop:22 }}>
                {/* Streak */}
                <Card padding={16} style={{ background:T.bg2, border:`1px solid ${T.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10 }}>
                    <div style={{ width:26, height:26, borderRadius:13, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.flame({ width:12, height:12 })}</div>
                    <div style={{ fontSize:11.5, fontWeight:700, color:T.ink }}>This week</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3 }}>
                    {['M','T','W','T','F','S','S'].map((d,i) => {
                      const done = _weekFlags[i], today = i === _todayIdx;
                      return (
                        <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                          <div style={{ width:'100%', aspectRatio:'1', maxWidth:24, borderRadius:6, background: done ? T.brand : today ? T.brandLight : T.card, border:`1.5px solid ${today ? T.brand : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: done ? '#fff' : today ? T.brand : T.ink5, fontWeight:700, fontSize:9 }}>
                            {done ? Icon.check({ width:8, height:8 }) : i+1}
                          </div>
                          <div style={{ fontSize:8.5, color: today ? T.brand : T.ink4, fontWeight: today ? 700 : 500 }}>{d}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop:10, fontSize:10.5, color:T.ink3, textAlign:'center' }}>{_streakAll}-day streak</div>
                </Card>

                {/* Overall progress (real) */}
                <Card padding={16}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Overall</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
                    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1 }}>{_totalSessions}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>session{_totalSessions===1?'':'s'}</div>
                  </div>
                  <div style={{ fontSize:11, color:T.ink3 }}>{_bestOverall>=0 ? ('Best score ' + _bestOverall + '%') : 'Finish a session to see your stats'}</div>
                  <button data-nav="progress" style={{ marginTop:12, fontSize:11, color:T.brand, fontWeight:700, cursor:'pointer', background:'transparent', padding:0 }}>View progress →</button>
                </Card>

                {/* Tutor shortcut */}
                <button data-nav="tutor" style={{ background:T.ink, color:'#fff', borderRadius:14, padding:'16px', display:'flex', flexDirection:'column', justifyContent:'space-between', textAlign:'left', cursor:'pointer', minHeight:140 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.message({ width:14, height:14 })}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Ask the AI tutor</div>
                    <div style={{ fontSize:10.5, color:'rgba(255,255,255,.65)', marginTop:2 }}>Grammar, vocab, conversation</div>
                  </div>
                </button>

                {/* Quick links */}
                <Card padding={14}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Quick links</div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
                    {[
                      { id:'vocab',        label:'Vocab',      ic:'book' },
                      { id:'achievements', label:'Badges',     ic:'trophy' },
                      { id:'notifications',label:'Inbox',      ic:'message' },
                      { id:'progress',     label:'Progress',   ic:'trophy' },
                      { id:'pricing',      label:'Plan',       ic:'flame' },
                      { id:'settings',     label:'Settings',   ic:'pen' },
                    ].map(q => (
                      <button key={q.id} data-nav={q.id} style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 8px', borderRadius:7, background:T.bg2, border:`1px solid ${T.hairline}`, fontSize:10.5, color:T.ink2, fontWeight:600, textAlign:'left', cursor:'pointer' }}>
                        <span style={{ color:T.ink4 }}>{Icon[q.ic] ? Icon[q.ic]({ width:10, height:10 }) : null}</span>
                        {q.label}
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* Recent attempts — split by exam mode so backend stream is obvious */}
            <RecentAttemptsPanel/>
          </div>

          {/* Today panel — only when there's room (1–2 languages) */}
          {!wide && (
          <aside style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Streak preview — moved up since hero now handles "what to do next" */}
            <Card padding={18} style={{ background: T.bg2, border:`1px solid ${T.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:30, height:30, borderRadius:15, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.flame()}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>This week</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:5 }}>
                {['M','T','W','T','F','S','S'].map((d,i) => {
                  const done = _weekFlags[i];
                  const today = i === _todayIdx;
                  return (
                    <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                      <div style={{ width:'100%', aspectRatio:'1', maxWidth:34, borderRadius:9, background: done ? T.brand : today ? T.brandLight : T.card, border: `1.5px solid ${ today ? T.brand : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: done ? '#fff' : today ? T.brand : T.ink5, fontWeight:700, fontSize:11 }}>
                        {done ? Icon.check({ width:11, height:11 }) : i+1}
                      </div>
                      <div style={{ fontSize:9.5, color: today ? T.brand : T.ink4, fontWeight: today ? 700 : 500 }}>{d}</div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop:14, fontSize:11.5, color:T.ink3, textAlign:'center' }}>{_streakAll}-day streak · keep it going</div>
            </Card>

            {/* Overall progress (real) */}
            <Card padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:12 }}>Overall</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
                <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1 }}>{_totalSessions}</div>
                <div style={{ fontSize:12, color:T.ink4 }}>session{_totalSessions===1?'':'s'} total</div>
              </div>
              <div style={{ fontSize:12, color:T.ink3, marginBottom:12 }}>{_bestOverall>=0 ? ('Best score ' + _bestOverall + '%') : 'Finish a session to see your stats'}</div>
              <button data-nav="progress" style={{ width:'100%', textAlign:'center', fontSize:12, color:T.brand, fontWeight:700, cursor:'pointer', background:T.brandLight, borderRadius:9, padding:'9px 0' }}>View full progress →</button>
            </Card>

            {/* Learner focus — real profile + single next-best-action */}
            <LearnerFocusCard
              profile={(typeof window!=='undefined' && window.FL && window.FL.learnerProfile) ? window.FL.learnerProfile(window.__langCode) : null}
              pal={{ card:T.card, line:T.border, ink:T.ink, ink2:T.ink2, muted:T.ink4, accent:T.brand, serif:T.serif }}
              onPractice={(skill)=>{ window.__nav && window.__nav(skill); }}
            />

            {/* Tutor shortcut */}
            <button data-nav="tutor" style={{ background:T.ink, color:'#fff', borderRadius:14, padding:'18px 18px', display:'flex', alignItems:'center', gap:14, textAlign:'left', cursor:'pointer' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>{Icon.message()}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Ask the AI tutor</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginTop:2 }}>Grammar, vocab, conversation</div>
              </div>
              {Icon.arrow({ width:14, height:14, style:{ color:'rgba(255,255,255,.5)' } })}
            </button>

            {/* Quick links — cross-cutting (per-language tools live inside each language page) */}
            <Card padding={16}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Quick links</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                {[
                  { id:'vocab',        label:'Vocab',      ic:'book' },
                  { id:'achievements', label:'Badges',     ic:'trophy' },
                  { id:'notifications',label:'Inbox',      ic:'message' },
                  { id:'progress',     label:'Progress',   ic:'trophy' },
                  { id:'pricing',      label:'Plan',       ic:'flame' },
                  { id:'settings',     label:'Settings',   ic:'pen' },
                ].map(q => (
                  <button key={q.id} data-nav={q.id} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 10px', borderRadius:9, background:T.bg2, border:`1px solid ${T.hairline}`, fontSize:11.5, color:T.ink2, fontWeight:600, textAlign:'left', cursor:'pointer' }}>
                    <span style={{ color:T.ink4 }}>{Icon[q.ic] ? Icon[q.ic]({ width:12, height:12 }) : null}</span>
                    {q.label}
                  </button>
                ))}
              </div>
            </Card>
          </aside>
          )}
        </div>
          );
        })()}
      </div>
    </div>
  );
}

Object.assign(window, { DashboardPage, levelFor, abilityScore, EXAM_UNLOCK_DAYS });

// ═══════════════════════════════════════════════════════════
// RECENT ATTEMPTS — three streams the backend records separately:
//   • monthly  → official $5 attempts (counts toward leaderboard)
//   • mock     → free full-format mock exams (private practice)
//   • practice → single-skill drill sessions
// ═══════════════════════════════════════════════════════════
function RecentAttemptsPanel() {
  const [tab, setTab] = useState('monthly');
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const unit = ex.scoreUnit;
  const fmtScore = (n) => unit === '/9' ? n.toFixed(1) : Math.round(n);

  function _realRows(kinds) {
    var R = ((typeof window !== 'undefined' && window.__results) ? window.__results : []).filter(function (r) { return r.detail && kinds.indexOf(r.detail.module) >= 0; });
    var MOD = { reading:'Reading drill', listening:'Listening drill', writing:'Writing drill', speaking:'Speaking drill', vocab:'Vocab review', lesson:'Lesson', mock_exam:'Full mock' };
    return R.slice(0, 6).map(function (r) {
      var u = (r.detail && r.detail.unit) || '%'; var sc = Number(r.score) || 0;
      var val = u === '%' ? String(Math.round(sc)) : (Math.round(sc / 100 * 9 * 2) / 2).toFixed(1);
      return { date: r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined, { month:'short', day:'numeric' }) : 'Recent', mod: MOD[r.detail.module] || 'Session', scoreText: val, scoreUnit: u, time:'', meta:'' };
    });
  }
  var _mockRows = _realRows(['mock_exam']);
  var _practiceRows = _realRows(['reading','listening','writing','speaking','vocab','lesson']);

  const STREAMS = {
    monthly: {
      label:'Monthly · Official',
      accent:'#B05A38',
      empty:`No official attempts yet. Take the ${ex.short} when you're ready — results post to the leaderboard.`,
      cta:{ label:'Schedule official exam', nav:'exam_entry' },
      resultsRoute:'monthly_results',
      rows: [],
    },
    mock: {
      label:'Mock · Practice',
      accent:'#C58A2E',
      empty:'No mock attempts yet. Take a free full-format mock to see where you stand.',
      cta:{ label:'Take a mock', nav:'mock_test' },
      resultsRoute:'mock_results',
      rows: _mockRows,
    },
    practice: {
      label:'Practice · Drills',
      accent:'#1F8A5B',
      empty:'No drills yet. Pick a skill from Practice to start a focused session.',
      cta:{ label:'Open practice', nav:'practice' },
      resultsRoute:'practice_results',
      rows: _practiceRows,
    },
  };

  const stream = STREAMS[tab];

  return (
    <Card padding={0} style={{ marginTop:18 }}>
      <div style={{ padding:'14px 18px 0', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Recent attempts</div>
        <div style={{ display:'flex', gap:4, padding:3, background:T.bg2, borderRadius:9 }}>
          {Object.entries(STREAMS).map(([k, s]) => (
            <button key={k} onClick={() => setTab(k)} style={{ padding:'6px 12px', borderRadius:7, fontSize:11.5, fontWeight:700, color: tab===k ? '#fff' : T.ink3, background: tab===k ? s.accent : 'transparent', border:'none', cursor:'pointer', transition:'all .15s' }}>{s.label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:'4px 18px 14px' }}>
        {stream.rows.length === 0 ? (
          <div style={{ padding:'24px 4px', fontSize:12.5, color:T.ink3, lineHeight:1.55 }}>{stream.empty}</div>
        ) : stream.rows.map((r, i) => (
          <button key={i} data-nav={stream.resultsRoute} style={{ width:'100%', display:'flex', alignItems:'center', gap:14, padding:'12px 4px', borderBottom: i < stream.rows.length-1 ? `1px solid ${T.hairline}` : 'none', background:'transparent', textAlign:'left', cursor:'pointer' }}>
            <div style={{ width:32, height:32, borderRadius:9, background:stream.accent+'1f', color:stream.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10.5, fontWeight:800, flexShrink:0, letterSpacing:'.04em' }}>{(tab || String.fromCharCode(63))[0].toUpperCase()}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.mod}</div>
              <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{[r.date, r.time, r.meta].filter(Boolean).join(' · ')}</div>
            </div>
            <div style={{ textAlign:'right', minWidth:54 }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{r.scoreText}</div>
              <div style={{ fontSize:10, color:T.ink4, marginTop:2 }}>{r.scoreUnit === '%' ? '%' : 'band'}</div>
            </div>
            <div style={{ color:T.ink4 }}>{Icon.arrow({ width:11, height:11 })}</div>
          </button>
        ))}
      </div>
      <div style={{ padding:'10px 18px', borderTop:`1px solid ${T.hairline}`, background:T.bg2, fontSize:11.5, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontWeight:600 }}>{stream.label}</span>
        <button data-nav={stream.cta.nav} style={{ fontSize:11.5, fontWeight:700, color:stream.accent, background:'transparent', cursor:'pointer' }}>{stream.cta.label} →</button>
      </div>
    </Card>
  );
}

Object.assign(window, { RecentAttemptsPanel });
