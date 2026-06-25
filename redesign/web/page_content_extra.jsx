// ── Lesson detail (video + transcript) + Article reader ──────────

function LessonDetailPage() {
  const topic = (typeof window !== 'undefined' && window.__lessonTopic) || { title:'Practice', level:'' };
  const lang  = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const langName = (typeof langByCode === 'function' && langByCode(lang) && langByCode(lang).english) || lang.toUpperCase();
  const [words, setWords] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [correctN, setCorrectN] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const [reload, setReload] = React.useState(0);

  React.useEffect(function () {
    var cancelled = false; setLoading(true); setErr(false);
    setIdx(0); setPicked(null); setCorrectN(0); setDone(false);
    fetch('/api/generate-content', { method:'POST', headers:Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
      body: JSON.stringify({ lang: lang, type:'vocab', difficulty:'medium', topic: topic.title }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (cancelled) return;
        var ws = (d && d.content && d.content.payload && d.content.payload.words) || [];
        var usable = ws.filter(function (w) { return w && w.term && w.example && w.example.toLowerCase().indexOf(String(w.term).toLowerCase()) >= 0; });
        if (!usable.length) { setErr(true); setLoading(false); return; }
        setWords(usable.slice(0, 8)); setLoading(false);
      })
      .catch(function () { if (!cancelled) { setErr(true); setLoading(false); } });
    return function () { cancelled = true; };
  }, [reload]);

  function saveResult(pct) {
    try {
      var raw = localStorage.getItem('sb-kbjqmhviuryakfzhhoaz-auth-token');
      var token = raw ? (JSON.parse(raw).access_token || null) : null;
      window.__saveResult({ lang: lang, score: pct, detail:{ module:'lesson', topic: topic.title, unit:'%' } });
    } catch (e) {}
  }

  const total = words.length;
  const w = words[idx] || null;
  const _ti = w ? w.example.toLowerCase().indexOf(String(w.term).toLowerCase()) : -1;
  const before = w && _ti >= 0 ? w.example.slice(0, _ti) : '';
  const after  = w && _ti >= 0 ? w.example.slice(_ti + w.term.length) : '';
  const options = w ? (function () {
    var opts = [w.term];
    for (var k = 1; k < words.length && opts.length < 4; k++) { var cand = words[(idx + k) % words.length].term; if (opts.indexOf(cand) < 0) opts.push(cand); }
    var shift = idx % opts.length; return opts.slice(shift).concat(opts.slice(0, shift));
  })() : [];
  const isCorrect = picked && picked === w.term;

  function pick(opt) { if (picked) return; setPicked(opt); if (opt === w.term) setCorrectN(function (n) { return n + 1; }); }
  function next() { if (idx + 1 >= total) { saveResult(Math.round((correctN / Math.max(total,1)) * 100)); setDone(true); } else { setIdx(function (i) { return i + 1; }); setPicked(null); } }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <style>{`
        @keyframes csPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
        @keyframes csShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
        @keyframes csFadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes csPulse{0%,100%{opacity:.45}50%{opacity:.9}}
        .cs-chip{transition:transform .12s ease, background .15s, border-color .15s, box-shadow .15s; cursor:pointer}
        .cs-chip:not(:disabled):hover{transform:translateY(-2px); box-shadow:0 8px 20px rgba(40,30,25,.10)}
        .cs-chip:not(:disabled):active{transform:scale(.96)}
        .cs-q{animation:csFadeUp .3s ease both}
        .cs-pop{animation:csPop .35s cubic-bezier(.34,1.56,.64,1) both}
        .cs-shake{animation:csShake .4s ease both}
        .cs-fb{animation:csFadeUp .3s ease both}
      `}</style>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'24px 40px 60px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:T.ink4, marginBottom:18 }}>
          <span data-nav="course" style={{ cursor:'pointer' }}>Course</span><span>›</span>
          <span style={{ color:T.ink, fontWeight:700 }}>{topic.title}</span>
        </div>

        <div style={{ maxWidth:600, margin:'0 auto' }}>
          <div style={{ fontSize:11, fontWeight:800, color:T.brand, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:6 }}>Complete the sentence · {langName}</div>
          <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.15, color:T.ink, marginBottom:22 }}>{topic.title}</div>

          {loading && <Card padding={44} style={{ textAlign:'center' }}><div style={{ fontSize:14, color:T.ink3 }}>Building your {langName} lesson…</div></Card>}

          {!loading && err && (<Card padding={36} style={{ textAlign:'center' }}>
            <div style={{ fontSize:15, color:T.ink, fontWeight:700, marginBottom:6 }}>Couldn't build this lesson</div>
            <div style={{ fontSize:13, color:T.ink4, marginBottom:16 }}>Something went wrong generating practice for {langName}.</div>
            <Btn label="Try again" accent={T.brand} onClick={function(){ setReload(function(x){return x+1;}); }}/>
          </Card>)}

          {!loading && !err && !done && w && (
            <div>
              <div style={{ display:'flex', gap:6, marginBottom:18 }}>
                {words.map(function (_, i) { return <div key={i} style={{ flex:1, height:5, borderRadius:99, background: i < idx ? T.brand : i === idx ? T.brandLight : T.bg2, transition:'background .3s' }}/>; })}
              </div>
              <div key={idx} className="cs-q">
                <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:10 }}>TAP THE MISSING WORD</div>
                <Card padding={30} style={{ marginBottom:18, background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur, border:`1px solid ${T.glassBorder}`, boxShadow:T.glassShadow }}>
                  <div style={{ fontFamily:T.serif, fontSize:23, color:T.ink, lineHeight:1.7 }}>
                    {before}
                    <span className={picked ? (isCorrect ? 'cs-pop' : 'cs-shake') : ''} style={{
                      display:'inline-flex', alignItems:'center', justifyContent:'center', minWidth:90, padding:'2px 14px', margin:'0 4px',
                      borderRadius:10, fontWeight:700,
                      border: picked ? `2px solid ${isCorrect ? T.listening.c : T.speaking.c}` : `2px dashed ${T.brand}`,
                      background: picked ? (isCorrect ? T.listening.bg : T.speaking.bg) : T.brandLight,
                      color: picked ? (isCorrect ? T.listening.c : T.speaking.c) : T.brand,
                      animation: !picked ? 'csPulse 1.6s ease-in-out infinite' : undefined,
                    }}>{picked ? picked : '?'}</span>
                    {after}
                  </div>
                  {picked && (<div className="cs-fb" style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${T.hairline}`, fontSize:13.5, color:T.ink3, lineHeight:1.5 }}>
                    <span style={{ fontWeight:800, color: isCorrect ? T.listening.c : T.speaking.c }}>{isCorrect ? 'Correct' : 'Answer: ' + w.term}</span> · {w.en}
                  </div>)}
                </Card>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:11 }}>
                  {options.map(function (opt) {
                    var ok = opt === w.term, answered = !!picked, isP = opt === picked;
                    var bg = !answered ? T.card : ok ? T.listening.bg : isP ? T.speaking.bg : T.bg2;
                    var bd = !answered ? T.border : ok ? T.listening.c : isP ? T.speaking.c : T.border;
                    var col = !answered ? T.ink : ok ? T.listening.c : isP ? T.speaking.c : T.ink5;
                    return (<button key={opt} className={'cs-chip' + (answered && isP && !ok ? ' cs-shake' : '')} onClick={function(){ pick(opt); }} disabled={answered}
                      style={{ padding:'16px 18px', borderRadius:14, background:bg, border:'2px solid '+bd, color:col, fontSize:16, fontWeight:700, textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, opacity: answered && !ok && !isP ? .55 : 1 }}>
                      <span>{opt}</span>
                      {answered && ok && <span style={{ color:T.listening.c }}>{Icon.check ? Icon.check({ width:16, height:16 }) : '✓'}</span>}
                    </button>);
                  })}
                </div>
                {picked && (<div className="cs-fb" style={{ marginTop:20, display:'flex', justifyContent:'flex-end' }}>
                  <Btn label={idx+1 >= total ? 'Finish' : 'Next sentence'} accent={T.brand} iconRight={Icon.arrow()} onClick={next}/>
                </div>)}
              </div>
            </div>
          )}

          {!loading && !err && done && (<Card padding={44} style={{ textAlign:'center', background:T.glass, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur, border:`1px solid ${T.glassBorder}`, boxShadow:T.glassShadow }}>
            <div className="cs-pop" style={{ width:84, height:84, borderRadius:42, background:T.brandGrad || T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontFamily:T.serif, fontSize:30 }}>{Math.round((correctN/Math.max(total,1))*100)}%</div>
            <div style={{ fontSize:16, color:T.ink, fontWeight:700, marginBottom:4 }}>{correctN} of {total} correct</div>
            <div style={{ fontSize:13, color:T.ink4, marginBottom:22 }}>Nice work on “{topic.title}”.</div>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <Btn label="Practice again" variant="outline" accent={T.ink} onClick={function(){ setReload(function(x){return x+1;}); }}/>
              <Btn label="Back to course" accent={T.brand} nav="course"/>
            </div>
          </Card>)}
        </div>
      </div>
    </div>
  );
}

function ArticleReaderPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:780, margin:'0 auto', padding:'40px 40px 80px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:T.ink4, marginBottom:18 }}>
            <span data-nav="library" style={{ cursor:'pointer' }}>Library</span>
            <span>›</span>
            <span style={{ color:T.ink, fontWeight:700 }}>Article</span>
          </div>

          <Chip label="B1 · 6 min · Spanish" accent={T.brand} bg={T.brandLight} style={{ fontSize:10.5, padding:'4px 10px', marginBottom:14 }}/>
          <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:1.1, color:T.ink, marginBottom:14 }}>El silencio de los pueblos abandonados</div>
          <div style={{ fontSize:15, color:T.ink3, lineHeight:1.6, marginBottom:24, fontStyle:'italic' }}>How three families are bringing a Pyrenean village back from the brink — one stone wall at a time.</div>

          <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:24, marginBottom:32, borderBottom:`1px solid ${T.hairline}` }}>
            <Avatar initials="EM" size={36} bg="#A06940"/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Elena Marín</div>
              <div style={{ fontSize:11, color:T.ink4 }}>Mar 18, 2025 · El País Semanal</div>
            </div>
            <button style={{ padding:'7px 12px', fontSize:11, fontWeight:700, color:T.ink2, border:`1px solid ${T.border}`, borderRadius:8, background:T.card, display:'flex', alignItems:'center', gap:6 }}>{Icon.play({ width:11, height:11 })}Listen</button>
            <button style={{ padding:'7px 12px', fontSize:11, fontWeight:700, color:T.ink2, border:`1px solid ${T.border}`, borderRadius:8, background:T.card }}>Aa</button>
          </div>

          <div style={{ fontFamily:T.serif, fontSize:19, lineHeight:1.7, color:T.ink, marginBottom:20 }}>
            En lo alto del valle de Hecho, donde los <span style={{ background:'#FFF1A8', padding:'1px 3px', borderRadius:3, cursor:'pointer' }}>caminos de herradura</span> se confunden con los pastos, un puñado de familias ha decidido <span style={{ background:'#FFF1A8', padding:'1px 3px', borderRadius:3, cursor:'pointer' }}>devolver la vida</span> a un pueblo que llevaba cuarenta años en silencio.
          </div>
          <div style={{ fontSize:16, lineHeight:1.7, color:T.ink, marginBottom:20 }}>
            "Cuando llegamos en 2019, no había <span style={{ background:'#FFF1A8', padding:'1px 3px', borderRadius:3, cursor:'pointer' }}>tejados enteros</span>", recuerda Marta Iguácel, una de las primeras en mudarse. "Las casas estaban abiertas al cielo, las ventanas habían cedido. Tuvimos que aprender a poner piedra sobre piedra como lo hacían nuestros abuelos."
          </div>

          {/* Annotation popover */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:18, margin:'24px 0', boxShadow:T.shadow }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>devolver la vida</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>verb phrase · "to bring back to life"</div>
              </div>
              <Btn label="Save to deck" accent={T.brand} icon={Icon.plus()} style={{ fontSize:11, padding:'6px 12px' }}/>
            </div>
            <div style={{ fontSize:13, color:T.ink2, lineHeight:1.5, paddingTop:10, borderTop:`1px solid ${T.hairline}` }}>Literally "to give back life." Common in articles about restoration, recovery, or revival of places, traditions, or relationships.</div>
          </div>

          <div style={{ fontSize:16, lineHeight:1.7, color:T.ink, marginBottom:20 }}>
            Hoy, cinco años después, el pueblo cuenta con once habitantes permanentes, un horno comunal y una pequeña escuela donde dos niños reciben clases de un maestro que viene del valle dos veces por semana.
          </div>

          {/* End-of-article actions */}
          <div style={{ marginTop:32, paddingTop:24, borderTop:`1px solid ${T.hairline}`, display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:12, color:T.ink4 }}>You saved <b style={{ color:T.ink }}>3 words</b> from this article.</div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn label="Practice these" nav="practice" variant="outline" accent={T.ink} icon={Icon.play()}/>
                <Btn label="Next article" nav="library" accent={T.brand} iconRight={Icon.arrow()}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LessonDetailPage, ArticleReaderPage });
