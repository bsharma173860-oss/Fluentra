// ── Page 1: Dashboard ───────────────────────────────────────
// Hero greeting + 4-up language card grid + Today panel

const EXAM_UNLOCK_DAYS = 9;

function levelFor(streak) {
  if (streak < 8)  return { short:'B1', long:'B1 · Intermediate' };
  if (streak < 21) return { short:'B2', long:'B2 · Upper-int.' };
  if (streak < 36) return { short:'C1', long:'C1 · Advanced' };
  return { short:'C2', long:'C2 · Mastery' };
}

function DashLangCard({ lang, freshlyAdded=false }) {
  const t = langTheme(lang.code);
  const lvl = levelFor(lang.streak);
  const pct = Math.min((lang.streak / EXAM_UNLOCK_DAYS) * 100, 100);

  return (
    <div onClick={() => { window.__langCode = lang.code; window.__nav && window.__nav('lang'); }} style={{
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
            {Icon.flame()} {lang.streak}-day
          </div>
        </div>
        <div style={{ fontFamily:T.serif, fontSize:38, lineHeight:1, marginBottom:4 }}>{lang.native}</div>
        <div style={{ fontSize:12.5, opacity:.85, fontWeight:500 }}>{lang.english} · {lvl.long}</div>
      </div>
      {/* Sheet */}
      <div style={{ background:T.card, borderTopLeftRadius:22, borderTopRightRadius:22, padding:'20px 22px', display:'flex', gap:16 }}>
        <Ring pct={pct} size={92} stroke={8} color={t.accent}>
          <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1 }}>{lang.streak}</div>
          <div style={{ fontSize:8.5, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, marginTop:2 }}>Day streak</div>
        </Ring>
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ display:'flex', gap:5, marginBottom:8, flexWrap:'wrap' }}>
            <Chip label={lang.exam} accent={t.accent} bg={t.accentLight}/>
            <Chip label={lang.level} accent={T.ink3} bg={T.bg2}/>
          </div>
          <div style={{ marginBottom:10 }}>
            <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>Next up</div>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.25 }}>Past tense — passé composé</div>
            <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>10 min · Grammar</div>
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
  const longestStreak = langs.length ? Math.max(...langs.map(l => l.streak)) : 0;
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
  const topTask = langs[0] ? {
    lang: langs[0],
    title: 'Past tense — passé composé',
    mins: 15,
    skill: 'Grammar',
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
          eyebrow={`${greet}, María`}
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

        {/* Two-col layout: cards + today panel */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:24 }}>
          {/* Languages */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Your languages</div>
              <button data-nav="add_language" style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', fontSize:12, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, cursor:'pointer' }}>
                {Icon.plus ? Icon.plus({ width:11, height:11 }) : '+'} Add language
              </button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
              {langs.map(l => <DashLangCard key={l.code} lang={l} freshlyAdded={l.code === justAdded}/>)}
            </div>

            {/* Recent attempts — split by exam mode so backend stream is obvious */}
            <RecentAttemptsPanel/>
          </div>

          {/* Today panel */}
          <aside style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Streak preview — moved up since hero now handles "what to do next" */}
            <Card padding={18} style={{ background: T.bg2, border:`1px solid ${T.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:30, height:30, borderRadius:15, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.flame()}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>This week</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:5 }}>
                {['M','T','W','T','F','S','S'].map((d,i) => {
                  const done = i < 4;
                  const today = i === 4;
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
              <div style={{ marginTop:14, fontSize:11.5, color:T.ink3, textAlign:'center' }}>4-day streak · keep it going</div>
            </Card>

            {/* Friends activity — replaces the old Today checklist (which was duplicated by the hero) */}
            <Card padding={18}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Friends today</div>
                <button data-nav="friends" style={{ fontSize:11, color:T.ink4, fontWeight:600, cursor:'pointer' }}>See all →</button>
              </div>
              {[
                { name:'Liam', avatar:'L', color:'#7B4BC4', mins:22, action:'practiced French' },
                { name:'Yui',  avatar:'Y', color:'#1F8A5B', mins:18, action:'finished a JLPT mock' },
                { name:'Anna', avatar:'A', color:'#D97757', mins:14, action:'extended to 31-day streak' },
              ].map((f,i,all) => (
                <button key={f.name} data-nav="profile_user" style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none', textAlign:'left', background:'transparent', cursor:'pointer' }}>
                  <div style={{ width:32, height:32, borderRadius:16, background:f.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, flexShrink:0 }}>{f.avatar}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.3 }}><b>{f.name}</b> {f.action}</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{f.mins} min · today</div>
                  </div>
                </button>
              ))}
            </Card>

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
                  { id:'friends',      label:'Friends',    ic:'users' },
                  { id:'leaderboard',  label:'Ranks',      ic:'bars' },
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
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { DashboardPage, levelFor, EXAM_UNLOCK_DAYS });

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

  const STREAMS = {
    monthly: {
      label:'Monthly · Official',
      accent:'#B05A38',
      empty:`No official attempts yet. Take the ${ex.short} when you're ready — results post to the leaderboard.`,
      cta:{ label:'Schedule official exam', nav:'exam_entry' },
      resultsRoute:'monthly_results',
      rows:[
        { date:'Apr 28',  mod:'Full exam',     score:unit==='/9'?7.5:unit==='/180'?38:74, time:'2h 45m', meta:'Rank #12 · Top 2%' },
        { date:'Mar 24',  mod:'Full exam',     score:unit==='/9'?7.0:unit==='/180'?34:70, time:'2h 41m', meta:'Rank #28 · Top 6%' },
      ],
    },
    mock: {
      label:'Mock · Practice',
      accent:'#C58A2E',
      empty:'No mock attempts yet. Take a free full-format mock to see where you stand.',
      cta:{ label:'Take a mock', nav:'mock_test' },
      resultsRoute:'mock_results',
      rows:[
        { date:'Yesterday', mod:'Full mock',   score:unit==='/9'?7.0:unit==='/180'?32:74, time:'2h 38m', meta:'Private · not on record' },
        { date:'4 days ago',mod:'Full mock',   score:unit==='/9'?6.5:unit==='/180'?28:68, time:'2h 12m', meta:'Private · not on record' },
        { date:'Last week', mod:'Full mock',   score:unit==='/9'?6.5:unit==='/180'?null:65, time:'1h 56m', meta:'Private · not on record' },
      ],
    },
    practice: {
      label:'Practice · Drills',
      accent:'#1F8A5B',
      empty:'No drills yet. Pick a skill from Practice to start a focused session.',
      cta:{ label:'Open practice', nav:'practice' },
      resultsRoute:'practice_results',
      rows:[
        { date:'Today',     mod:'Reading drill',   score:unit==='/9'?7.5:unit==='/180'?40:78, time:'18 min', meta:'10 questions' },
        { date:'Today',     mod:'Listening drill', score:unit==='/9'?8.0:unit==='/180'?42:82, time:'14 min', meta:'8 questions' },
        { date:'Yesterday', mod:'Writing drill',   score:unit==='/9'?6.5:unit==='/180'?null:68, time:'22 min', meta:'1 task · AI graded' },
      ],
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
            <div style={{ width:32, height:32, borderRadius:9, background:stream.accent+'1f', color:stream.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10.5, fontWeight:800, flexShrink:0, letterSpacing:'.04em' }}>{tab[0].toUpperCase()}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.mod}</div>
              <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{r.date} · {r.time} · {r.meta}</div>
            </div>
            <div style={{ textAlign:'right', minWidth:54 }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{r.score == null ? '—' : fmtScore(r.score)}</div>
              <div style={{ fontSize:10, color:T.ink4, marginTop:2 }}>{ex.scoreLabel}</div>
            </div>
            <div style={{ color:T.ink4 }}>{Icon.arrow({ width:11, height:11 })}</div>
          </button>
        ))}
      </div>
      <div style={{ padding:'10px 18px', borderTop:`1px solid ${T.hairline}`, background:T.bg2, fontSize:11.5, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span>Backend stream: <code style={{ background:T.card, padding:'2px 6px', borderRadius:5, color:stream.accent, fontWeight:700 }}>{tab}</code></span>
        <button data-nav={stream.cta.nav} style={{ fontSize:11.5, fontWeight:700, color:stream.accent, background:'transparent', cursor:'pointer' }}>{stream.cta.label} →</button>
      </div>
    </Card>
  );
}

Object.assign(window, { RecentAttemptsPanel });
