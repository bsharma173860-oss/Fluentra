// ── Page 6: Exams ───────────────────────────────────────────
// Dark hero + leaderboard, premium gravitas

function ExamsPage() {
  const [results, setResults] = React.useState(null);
  React.useEffect(function () {
    var c = false;
    if (window.FL && window.FL.fetchResults) window.FL.fetchResults(300).then(function (r) { if (!c) setResults(r || []); }).catch(function () { if (!c) setResults([]); });
    else setResults([]);
    return function () { c = true; };
  }, []);
  const R = results || [];
  const langs = (typeof window !== 'undefined' && window.__userLanguages) ? window.__userLanguages : [];
  const palette = [
    { color:T.speaking.c, bg:T.speaking.bg },
    { color:T.brand,      bg:T.brandLight },
    { color:'#1558B0',    bg:'#EEF6FF' },
    { color:T.writing.c,  bg:T.writing.bg },
    { color:'#C84070',    bg:'#FFE0EC' },
    { color:T.listening.c, bg:T.listening.bg },
  ];
  const exams = langs.map(function (l, i) {
    var rows = R.filter(function (r) { return r.lang === l.code; });
    var best = rows.length ? Math.max.apply(null, rows.map(function (r) { return Number(r.score) || 0; })) : null;
    var p = palette[i % palette.length];
    var examName = l.exam || l.exam_type || 'Practice';
    var eng = l.english || l.english_name || (l.code || '').toUpperCase();
    return { name: examName + ' · ' + eng, lang: l.code, flag: l.code, color: p.color, bg: p.bg, next: '—', score: best != null ? String(best) : '—', sessions: rows.length };
  });
  const totalSessions = R.length;
  const nextLabel = exams.length ? exams[0].name : 'Practice run';

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        {/* Dark hero */}
        <div style={{ background:T.ink, color:'#fff', padding:'40px 36px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:400, height:400, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:14, opacity:.06, pointerEvents:'none' }}>
            {Array.from({ length:300 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
          </div>
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:32 }}>
            <div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Certification track</div>
              <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1.05, marginBottom:10, maxWidth:540 }}>Your road to certified.</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,.7)', maxWidth:540, lineHeight:1.5 }}>Practice runs are graded by the same rubrics as the real test. Pick a track below and start a mock.</div>
            </div>
            <div style={{ display:'flex', gap:32, alignItems:'flex-end' }}>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1, color:'#fff' }}>{totalSessions}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginTop:6 }}>Sessions logged</div>
              </div>
              <div style={{ width:1, height:60, background:'rgba(255,255,255,.18)' }}/>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1, color:'#fff' }}>{exams.length}</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginTop:6 }}>Exam tracks</div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'28px 36px 40px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14, marginBottom:32 }}>
            <div style={{ background:T.brand, color:'#fff', borderRadius:16, padding:'22px 26px', display:'flex', alignItems:'center', gap:20 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.trophy({ width:20, height:20 })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Next up</div>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.1 }}>{nextLabel}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.75)', marginTop:4 }}>All 4 modules · graded against real rubrics</div>
              </div>
              <Btn label="Start practice run" nav="mock_test" iconRight={Icon.arrow()} accent="#fff" style={{ color:T.brand }}/>
            </div>

            <div style={{ background:T.card, border:`1.5px solid ${T.brand}33`, borderRadius:16, padding:'18px 20px', display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <Chip label="Daily mock" accent={T.brand} bg={T.brandLight} style={{ fontSize:10 }}/>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.2, marginBottom:4 }}>Take a mock anytime.</div>
              <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.45, marginBottom:12 }}>Same scoring rubric as a real exam section.</div>
              <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
                <Btn label="Start a mock" nav="mock_test" accent={T.brand} size="sm" iconRight={Icon.arrow()}/>
              </div>
            </div>
          </div>

          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>Your exam tracks</div>
          {exams.length === 0 ? (
            <Card padding={32}>
              <div style={{ textAlign:'center', color:T.ink3, fontSize:13.5 }}>
                No exam tracks yet.<br/>
                <span style={{ fontSize:12, color:T.ink4 }}>Add a language and its target exam appears here as a track.</span>
                <div style={{ marginTop:14 }}><Btn label="Add a language" nav="add_language" accent={T.brand} size="sm"/></div>
              </div>
            </Card>
          ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:32 }}>
            {exams.map(e => (
                <Card key={e.lang} padding={0} onClick={() => { window.__setLang(e.lang); window.__nav && window.__nav('exam_entry'); }} style={{ overflow:'hidden', cursor:'pointer' }}>
                <div style={{ padding:'18px 20px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)', borderRadius:4, overflow:'hidden' }}>
                    <Flag code={e.flag} w={32} h={22} radius={4}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{e.name}</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{e.sessions} sessions logged</div>
                  </div>
                </div>
                <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Best</div>
                    <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1, marginTop:3 }}>{e.score}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Sessions</div>
                    <div style={{ fontSize:13, color:T.ink, fontWeight:600, marginTop:3 }}>{e.sessions}</div>
                  </div>
                </div>
                <div style={{ padding:'12px 20px', background:T.bg2, borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ fontSize:11.5, color:e.color, fontWeight:700 }}>Open exam track</div>
                  <div style={{ color:e.color }}>{Icon.arrow({ width:13, height:13 })}</div>
                </div>
              </Card>
            ))}
          </div>
          )}

          {/* Leaderboard — not live yet (needs a shared backend) */}
          <Card padding={28}>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:6 }}>Global leaderboard</div>
              <div style={{ fontSize:12.5, color:T.ink4, lineHeight:1.5, maxWidth:440, margin:'0 auto' }}>Leaderboards aren't live yet — they need a shared ranking backend. Your own scores and streak are tracked on the Progress page.</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ExamsPage });
