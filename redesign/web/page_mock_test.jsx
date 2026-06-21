// ── Mock Test — practice exam, separate from $5 official exam ─
function MockTestPage() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const t = langTheme(lang.code);
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };

  const [pickedModule, setPickedModule] = useState(null);
  const [scheduled, setScheduled] = useState(null); // { day, time }
  const [showSched, setShowSched] = useState(false);

  // History — synthesized practice attempts (NOT official records)
  const _modName = { reading:'Reading', listening:'Listening', writing:'Writing', speaking:'Speaking' };
  const _mh = (typeof window !== 'undefined' && window.__results)
    ? window.__results.filter(function (r) { return r.lang === lang.code && r.detail && (r.detail.module === 'mock_exam' || r.detail.module === 'exam' || r.detail.module === 'mock'); })
    : [];
  const history = _mh.slice(0, 5).map(function (r) {
    var when = r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined, { month:'short', day:'numeric' }) : 'Recent';
    return { date: when, mod: (r.detail && (_modName[r.detail.section] || r.detail.section)) || 'Full', score: (r.score != null ? Math.round(Number(r.score)) : null), time: '' };
  });

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      {showSched && (
        <div onClick={() => setShowSched(false)} style={{ position:'absolute', inset:0, background:'rgba(20,20,20,.55)', zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:380, background:'#fff', borderRadius:18, boxShadow:'0 30px 70px rgba(0,0,0,.3)', padding:'22px 24px', color:T.ink }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase' }}>Schedule mock</div>
                <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginTop:3, lineHeight:1.15 }}>Pick a day &amp; time</div>
              </div>
              <button onClick={() => setShowSched(false)} style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:T.ink3, fontSize:16, cursor:'pointer', border:'none' }}>×</button>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Day</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:18 }}>
              {['Today','Tomorrow','Sat','Sun','Mon','Tue','Wed','Thu'].map(d => (
                <button key={d} onClick={() => setScheduled(s => ({ day:d, time: (s&&s.time) || '7:00 PM' }))} style={{ padding:'10px 0', fontSize:12, fontWeight:600, borderRadius:9, border:`1px solid ${scheduled?.day===d?t.accent:T.border}`, background:scheduled?.day===d?(t.accentLight||t.bg):T.card, color:scheduled?.day===d?t.accent:T.ink2, cursor:'pointer' }}>{d}</button>
              ))}
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Time</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:20 }}>
              {['9:00 AM','12:00 PM','3:00 PM','5:00 PM','7:00 PM','9:00 PM'].map(tm => (
                <button key={tm} onClick={() => setScheduled(s => ({ day:(s&&s.day) || 'Today', time:tm }))} style={{ padding:'10px 0', fontSize:11.5, fontWeight:600, borderRadius:9, border:`1px solid ${scheduled?.time===tm?t.accent:T.border}`, background:scheduled?.time===tm?(t.accentLight||t.bg):T.card, color:scheduled?.time===tm?t.accent:T.ink2, cursor:'pointer' }}>{tm}</button>
              ))}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => { setScheduled(null); setShowSched(false); }} style={{ flex:1, padding:'11px 0', borderRadius:10, background:T.bg2, color:T.ink2, fontSize:12.5, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}` }}>Clear</button>
              <button disabled={!scheduled?.day || !scheduled?.time} onClick={() => setShowSched(false)} style={{ flex:2, padding:'11px 0', borderRadius:10, background: (scheduled?.day && scheduled?.time) ? t.accent : T.bg3, color:'#fff', fontSize:12.5, fontWeight:700, cursor:(scheduled?.day && scheduled?.time)?'pointer':'not-allowed', border:'none', opacity:(scheduled?.day && scheduled?.time)?1:.55 }}>Confirm reminder</button>
            </div>
          </div>
        </div>
      )}
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'36px 36px 60px' }}>
        <div style={{ maxWidth:920, margin:'0 auto' }}>

          {/* Hero — clearly distinguishes mock from official */}
          <div style={{ background:'#FFF7E6', border:'1.5px solid #F0C674', borderRadius:18, padding:'20px 24px', display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:'#F0C674', color:'#7A4E0B', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.spark({ width:16, height:16 })}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:14, fontWeight:700, color:'#7A4E0B' }}>Practice mode — not an official attempt</div>
              <div style={{ fontSize:12.5, color:'#7A4E0B', opacity:.85, lineHeight:1.5, marginTop:2 }}>Mock tests are <b>free, untimed-optional, and unlimited</b>. They don't post to the leaderboard or your official record. For a graded attempt with rank and certificate, take the <b>monthly $5 exam</b> instead.</div>
            </div>
            <Btn label={`Take ${ex.short} for $5`} onClick={() => window.payFor && window.payFor('exam_official')} variant="outline" accent="#7A4E0B" size="sm"/>
          </div>

          <PageHeader
            eyebrow={`${lang.english} · Mock test`}
            title={`Practice the full ${ex.name}`}
            subtitle={`Try the real exam format with no pressure. Pick a single module or run the full ${ex.duration} simulation.`}
          />

          {/* Pick a mode */}
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14, marginBottom:32 }}>
            <Card padding={0} style={{ overflow:'hidden', position:'relative' }}>
              <div style={{ background:T.ink, color:'#fff', padding:'22px 24px' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>Recommended</div>
                <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.1, marginBottom:6 }}>Full mock — all modules</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.5 }}>{ex.modules.length} modules in sequence · {ex.duration} · Get a band/score estimate at the end.</div>
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <Btn label="Start full mock" nav="mock_runner" accent={t.accent} size="md" iconRight={Icon.arrow({ width:12, height:12 })}/>
                  <button onClick={() => setShowSched(true)} style={{ padding:'9px 16px', borderRadius:10, background: scheduled ? 'rgba(255,255,255,.18)' : 'rgba(255,255,255,.1)', color:'#fff', fontSize:12.5, fontWeight:600, border:`1px solid ${scheduled?'rgba(255,255,255,.5)':'rgba(255,255,255,.2)'}`, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6 }}>
                    {Icon.cal({ width:12, height:12 })}
                    {scheduled ? `Scheduled · ${scheduled.day} ${scheduled.time}` : 'Schedule for later'}
                  </button>
                </div>
              </div>
              <div style={{ padding:'14px 24px', background:T.bg2, borderTop:`1px solid ${T.hairline}`, fontSize:11.5, color:T.ink3, display:'flex', alignItems:'center', gap:14 }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>{Icon.check({ width:11, height:11, style:{ color:T.listening.c } })} Free</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>{Icon.check({ width:11, height:11, style:{ color:T.listening.c } })} Unlimited attempts</span>
                <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>{Icon.check({ width:11, height:11, style:{ color:T.listening.c } })} AI-graded feedback</span>
              </div>
            </Card>

            <Card padding={22}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Quick warm-up</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.15, marginBottom:6 }}>10-question drill</div>
              <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5, marginBottom:14 }}>Random questions across all modules. ~12 minutes. Great as a daily warm-up.</div>
              <Btn label="Start warm-up" nav="mock_runner" variant="outline" accent={t.accent} fullWidth iconRight={Icon.arrow({ width:11, height:11 })}/>
              <div style={{ marginTop:12, padding:'10px 12px', background:T.bg2, borderRadius:9, fontSize:11.5, color:T.ink3, lineHeight:1.5 }}>
                <b style={{ color:T.ink }}>{lang.english} Pro:</b> get adaptive drills that focus on your weakest skills.
              </div>
            </Card>
          </div>

          {/* Single-module mocks */}
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>Or practice just one module</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12, marginBottom:32 }}>
            {ex.modules.map((m, i) => {
              const c = colorMap[m.color] || T.listening;
              const sel = pickedModule === i;
              return (
                <button key={i} onClick={() => { setPickedModule(i); window.__practiceModule = m.color; window.__nav('practice_runner'); }} style={{ display:'flex', alignItems:'center', gap:14, padding:18, borderRadius:14, border:`1.5px solid ${sel ? c.c : T.border}`, background: sel ? c.bg : T.card, cursor:'pointer', textAlign:'left', transition:'all .15s' }}>
                  <div style={{ width:42, height:42, borderRadius:11, background:c.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:17, height:17 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:2 }}>{m.label}</div>
                    <div style={{ fontSize:11.5, color:T.ink3 }}>{m.time} · {m.q} {m.q===1?'task':'items'}</div>
                  </div>
                  <div style={{ color:c.c, display:'flex', alignItems:'center', gap:6, fontSize:11.5, fontWeight:700 }}>
                    Practice {Icon.arrow({ width:11, height:11 })}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Past mock attempts */}
          <Card padding={0}>
            <div style={{ padding:'14px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Recent practice attempts</div>
              <button data-nav="exam_history" style={{ fontSize:11.5, fontWeight:700, color:t.accent, background:'transparent', cursor:'pointer' }}>See all →</button>
            </div>
            {history.length === 0 && (<div style={{ padding:'24px 22px', textAlign:'center', color:T.ink4, fontSize:12.5 }}>No mock attempts yet — start one above and it'll show up here.</div>)}
            {history.map((h, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i<history.length-1?`1px solid ${T.hairline}`:'none' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>M{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{h.mod} · mock practice</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{h.date} · {h.time}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{h.score ?? '—'}</div>
                  <div style={{ fontSize:10, color:T.ink4, marginTop:2 }}>{ex.scoreLabel}</div>
                </div>
                <button data-nav="mock_results" style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.arrow({ width:11, height:11 })}</button>
              </div>
            ))}
          </Card>

          {/* Footnote */}
          <div style={{ marginTop:24, padding:'14px 18px', background:T.bg2, borderRadius:11, fontSize:12, color:T.ink3, lineHeight:1.6 }}>
            <b style={{ color:T.ink }}>How is mock different from the official exam?</b><br/>
            Mock tests use the same format and AI scoring, but results are private and don't appear on the leaderboard or your certified history. The official monthly $5 exam is a single high-stakes attempt with a published rank, certificate, and a place on your transcript.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MockTestPage });
