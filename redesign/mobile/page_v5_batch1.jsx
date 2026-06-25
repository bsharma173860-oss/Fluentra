// ── Mobile · v5 redesigns · Batch 1 ───────────────────────────────
// OTP · Forgot Password · Lesson Detail · Article Reader · Phrasebook

const useStV5B1 = React.useState;
const useEfV5B1 = React.useEffect;
const useRfV5B1 = React.useRef;

const V5b1Pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b1Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);
function MForgotPwPageV5() {
  const [step, setStep] = useStV5B1(0);
  const [email, setEmail] = useStV5B1('');
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back onBack={()=>step ? setStep(0) : nav('auth_login')} title="Reset password"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {step === 0 ? <>
          <V5b1Pre eyebrow="FORGOT YOUR PASSWORD?" title="Let's get you back in" lede="Enter the email on your account and we'll send a secure reset link — usually arrives in under a minute."/>
          <MCard style={{ padding:14, marginBottom:14 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', marginBottom:7 }}>EMAIL</div>
            <input value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', padding:'10px 12px', borderRadius:10, background:T.bg2, border:`1px solid ${T.border}`, fontSize:14, color:T.ink, outline:'none' }}/>
          </MCard>
          <button onClick={()=>setStep(1)} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Send reset link</button>
          <button onClick={()=>nav('auth_login')} style={{ width:'100%', padding:'12px', marginTop:9, fontSize:12, color:T.ink3, fontWeight:600, background:'transparent' }}>Back to sign in</button>
        </> : <>
          <div style={{ background:T.ink, borderRadius:18, padding:'30px 22px', color:'#fff', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:14, marginTop:10 }}>
            <V5b1Dot/>
            <div style={{ position:'relative' }}>
              <div style={{ width:64, height:64, borderRadius:32, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>{Icon.check ? Icon.check({width:24,height:24}) : '✓'}</div>
              <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:8 }}>Check your inbox</div>
              <div style={{ fontSize:12.5, color:'rgba(255,255,255,.7)', lineHeight:1.55 }}>We sent a reset link to <span style={{ color:'#fff', fontWeight:700 }}>{email}</span>. Tap the link in the email — it expires in 30 minutes.</div>
            </div>
          </div>
          <MCard style={{ padding:'12px 14px', marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink2, marginBottom:4 }}>Didn't get the email?</div>
            <ul style={{ fontSize:11.5, color:T.ink3, lineHeight:1.7, paddingLeft:18, margin:0 }}>
              <li>Check your spam folder</li>
              <li>Make sure you typed the email correctly</li>
              <li>Wait 60 seconds, then resend</li>
            </ul>
          </MCard>
          <button onClick={()=>setStep(0)} style={{ width:'100%', padding:'12px', borderRadius:11, background:T.card, color:T.ink2, fontSize:12, fontWeight:700, border:`1px solid ${T.hairline}` }}>Try a different email</button>
        </>}
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// LESSON DETAIL
// ══════════════════════════════════════════════════════════════════
function MLessonDetailV5() {
  const topic = (typeof window !== 'undefined' && window.__lessonTopic) || { title:'Practice' };
  const lang  = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const langName = (typeof langByCode === 'function' && langByCode(lang) && langByCode(lang).english) || lang.toUpperCase();
  const [words, setWords] = useStV5B1([]);
  const [loading, setLoading] = useStV5B1(true);
  const [err, setErr] = useStV5B1(false);
  const [idx, setIdx] = useStV5B1(0);
  const [picked, setPicked] = useStV5B1(null);
  const [correctN, setCorrectN] = useStV5B1(0);
  const [done, setDone] = useStV5B1(false);
  const [reload, setReload] = useStV5B1(0);
  const nav = (id) => window.__nav && window.__nav(id);

  React.useEffect(function () {
    var cancelled = false; setLoading(true); setErr(false); setIdx(0); setPicked(null); setCorrectN(0); setDone(false);
    fetch('/api/generate-content', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ lang:lang, type:'vocab', difficulty:'medium', topic:topic.title }) })
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

  function saveResult(pct) { try { var raw = localStorage.getItem('sb-kbjqmhviuryakfzhhoaz-auth-token'); var token = raw ? (JSON.parse(raw).access_token || null) : null; window.__saveResult({ lang:lang, score:pct, detail:{ module:'lesson', topic:topic.title, unit:'%' } }); } catch (e) {} }

  const total = words.length;
  const w = words[idx] || null;
  const _ti = w ? w.example.toLowerCase().indexOf(String(w.term).toLowerCase()) : -1;
  const before = w && _ti >= 0 ? w.example.slice(0, _ti) : '';
  const after  = w && _ti >= 0 ? w.example.slice(_ti + w.term.length) : '';
  const options = w ? (function () { var opts=[w.term]; for (var k=1;k<words.length&&opts.length<4;k++){ var c=words[(idx+k)%words.length].term; if(opts.indexOf(c)<0)opts.push(c);} var sh=idx%opts.length; return opts.slice(sh).concat(opts.slice(0,sh)); })() : [];
  const isCorrect = picked && picked === w.term;
  function pick(o){ if(picked)return; setPicked(o); if(o===w.term) setCorrectN(function(n){return n+1;}); }
  function next(){ if(idx+1>=total){ saveResult(Math.round(correctN/Math.max(total,1)*100)); setDone(true);} else { setIdx(function(i){return i+1;}); setPicked(null);} }

  return (
    <>
      <style>{`
        @keyframes csmPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
        @keyframes csmShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-3px)}80%{transform:translateX(3px)}}
        @keyframes csmFadeUp{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
        @keyframes csmPulse{0%,100%{opacity:.45}50%{opacity:.9}}
        .csm-chip{transition:transform .12s ease, background .15s, border-color .15s}
        .csm-chip:not(:disabled):active{transform:scale(.95)}
        .csm-q{animation:csmFadeUp .3s ease both}
        .csm-pop{animation:csmPop .35s cubic-bezier(.34,1.56,.64,1) both}
        .csm-shake{animation:csmShake .4s ease both}
        .csm-fb{animation:csmFadeUp .3s ease both}
      `}</style>
      <MobileHeader back onBack={()=>nav('lang')} title="Complete the sentence" eyebrow={topic.title}/>
      <MobileBody padding={[6,16,30]} tabBarPad={false}>
        {loading && <MCard style={{ padding:'40px 20px', textAlign:'center' }}><div style={{ fontSize:13, color:T.ink3 }}>Building your {langName} lesson…</div></MCard>}
        {!loading && err && (<MCard style={{ padding:'34px 20px', textAlign:'center' }}>
          <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:6 }}>Couldn't build this lesson</div>
          <div style={{ fontSize:12.5, color:T.ink4, marginBottom:16 }}>Something went wrong for {langName}.</div>
          <button onClick={()=>setReload(function(x){return x+1;})} style={{ padding:'10px 18px', borderRadius:10, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, border:'none' }}>Try again</button>
        </MCard>)}
        {!loading && !err && !done && w && (<>
          <div style={{ display:'flex', gap:5, marginBottom:16 }}>
            {words.map(function (_, i) { return <div key={i} style={{ flex:1, height:5, borderRadius:99, background: i < idx ? T.brand : i === idx ? T.brandLight : T.bg2, transition:'background .3s' }}/>; })}
          </div>
          <div key={idx} className="csm-q">
            <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:9 }}>TAP THE MISSING WORD</div>
            <MCard style={{ padding:22, marginBottom:14 }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.7 }}>
                {before}
                <span className={picked ? (isCorrect ? 'csm-pop' : 'csm-shake') : ''} style={{
                  display:'inline-flex', alignItems:'center', justifyContent:'center', minWidth:64, padding:'1px 11px', margin:'0 3px',
                  borderRadius:9, fontWeight:700,
                  border: picked ? ('2px solid ' + (isCorrect ? T.listening.c : T.speaking.c)) : ('2px dashed ' + T.brand),
                  background: picked ? (isCorrect ? T.listening.bg : T.speaking.bg) : T.brandLight,
                  color: picked ? (isCorrect ? T.listening.c : T.speaking.c) : T.brand,
                  animation: !picked ? 'csmPulse 1.6s ease-in-out infinite' : undefined,
                }}>{picked ? picked : '?'}</span>
                {after}
              </div>
              {picked && (<div className="csm-fb" style={{ marginTop:13, paddingTop:11, borderTop:'1px solid '+T.hairline, fontSize:12.5, color:T.ink3, lineHeight:1.5 }}>
                <span style={{ fontWeight:800, color: isCorrect ? T.listening.c : T.speaking.c }}>{isCorrect ? 'Correct' : 'Answer: ' + w.term}</span> · {w.en}
              </div>)}
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:9 }}>
              {options.map(function (opt) {
                var ok = opt === w.term, answered = !!picked, isP = opt === picked;
                var bg = !answered ? T.card : ok ? T.listening.bg : isP ? T.speaking.bg : T.bg2;
                var bd = !answered ? T.border : ok ? T.listening.c : isP ? T.speaking.c : T.border;
                var col = !answered ? T.ink : ok ? T.listening.c : isP ? T.speaking.c : T.ink5;
                return (<button key={opt} className={'csm-chip' + (answered && isP && !ok ? ' csm-shake' : '')} onClick={function(){ pick(opt); }} disabled={answered}
                  style={{ padding:'15px 14px', borderRadius:13, background:bg, border:'2px solid '+bd, color:col, fontSize:15, fontWeight:700, textAlign:'left', display:'flex', alignItems:'center', justifyContent:'space-between', gap:6, opacity: answered && !ok && !isP ? .55 : 1 }}>
                  <span>{opt}</span>
                  {answered && ok && <span style={{ color:T.listening.c }}>{Icon.check ? Icon.check({ width:15, height:15 }) : '✓'}</span>}
                </button>);
              })}
            </div>
            {picked && (<div className="csm-fb" style={{ marginTop:16, display:'flex', justifyContent:'flex-end' }}>
              <button onClick={next} style={{ padding:'12px 22px', borderRadius:12, background:T.brand, color:'#fff', fontSize:13.5, fontWeight:700, border:'none' }}>{idx+1>=total?'Finish':'Next'} →</button>
            </div>)}
          </div>
        </>)}
        {!loading && !err && done && (<MCard style={{ padding:'38px 20px', textAlign:'center' }}>
          <div className="csm-pop" style={{ width:76, height:76, borderRadius:38, background:T.brandGrad || T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px', fontFamily:T.serif, fontSize:26 }}>{Math.round(correctN/Math.max(total,1)*100)}%</div>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:4 }}>{correctN} of {total} correct</div>
          <div style={{ fontSize:12.5, color:T.ink4, marginBottom:18 }}>Nice work on “{topic.title}”.</div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button onClick={()=>setReload(function(x){return x+1;})} style={{ padding:'10px 16px', borderRadius:10, background:T.bg2, color:T.ink2, fontSize:12.5, fontWeight:700, border:'1px solid '+T.hairline }}>Again</button>
            <button onClick={()=>nav('course')} style={{ padding:'10px 16px', borderRadius:10, background:T.brand, color:'#fff', fontSize:12.5, fontWeight:700, border:'none' }}>Course</button>
          </div>
        </MCard>)}
      </MobileBody>
    </>
  );
}

function MArticleReaderPageV5() {
  const [scroll, setScroll] = useStV5B1(0);
  const [size, setSize] = useStV5B1(16);
  const _r = (typeof _sc === 'function') ? _sc('reading') : null;
  const passage = (_r && _r.passage) ? String(_r.passage) : '';
  const title = (_r && _r.title) ? _r.title : 'Reading';
  const paras = passage ? passage.split(/\n+/).filter(function (p) { return p.trim(); }) : [];
  const sizeBtns = (
    <div style={{ display:'flex', gap:6 }}>
      <button onClick={()=>setSize(Math.max(13, size-1))} style={{ width:30, height:30, borderRadius:8, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink3, fontSize:11, fontWeight:700 }}>A\u2212</button>
      <button onClick={()=>setSize(Math.min(22, size+1))} style={{ width:30, height:30, borderRadius:8, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, fontSize:13, fontWeight:700 }}>A+</button>
    </div>
  );
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'hidden' }}>
      <div style={{ height:3, background:T.bg2, position:'relative' }}><div style={{ height:'100%', width:`${scroll}%`, background:T.brand, transition:'width .15s' }}/></div>
      <MobileHeader back title="Article" right={paras.length ? sizeBtns : null}/>
      {paras.length === 0 ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'30px 28px', textAlign:'center' }}>
          <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:8 }}>No article loaded</div>
          <div style={{ fontSize:13, color:T.ink4, lineHeight:1.6, marginBottom:18 }}>Start a reading session and we'll generate a passage tailored to your level.</div>
          <button onClick={()=>window.__nav && window.__nav('reading')} style={{ padding:'12px 20px', borderRadius:12, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, border:'none' }}>Start reading</button>
        </div>
      ) : (
        <div onScroll={e=>{ const el=e.target; setScroll((el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100); }} style={{ flex:1, overflow:'auto', padding:'16px 18px 30px' }}>
          <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.08, letterSpacing:'-.02em', marginBottom:16 }}>{title}</div>
          {paras.map((p, i) => (
            <div key={i} style={{ fontSize:size, color:T.ink2, lineHeight:1.7, marginBottom:14, fontFamily:T.serif }}>{p}</div>
          ))}
        </div>
      )}
    </div>
  );
}


// ══════════════════════════════════════════════════════════════════
// PHRASEBOOK
// ══════════════════════════════════════════════════════════════════
function MPhrasebookPageV5() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const lang = (typeof window !== 'undefined' && window.__langCode) ? window.__langCode : 'en';
  const [items, setItems] = React.useState(null);
  const [front, setFront] = useStV5B1('');
  const [back, setBack] = useStV5B1('');
  function load() { if (!S) { setItems([]); return; } S.listPhrases(lang).then(function (r) { setItems(r || []); }).catch(function () { setItems([]); }); }
  React.useEffect(load, [lang]);
  function add() { var fr = front.trim(); if (!fr || !S) return; setFront(''); setBack(''); S.addPhrase(lang, fr, back.trim()).then(function () { load(); }); }
  function del(id) { if (!S) return; S.deletePhrase(id).then(function () { load(); }); }
  const langName = (typeof langByCode === 'function') ? (langByCode(lang).english || lang) : lang;
  return (
    <>
      <MobileHeader title="Phrasebook"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow="SAVED" title="Phrasebook" lede={'Save ' + langName + ' words and phrases you want to remember.'}/>
        <MCard style={{ padding:12, marginBottom:14 }}>
          <input value={front} onChange={function (e) { setFront(e.target.value); }} placeholder={langName + ' word or phrase'} style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:`1px solid ${T.border}`, fontSize:13, outline:'none', background:T.bg, marginBottom:8 }}/>
          <input value={back} onChange={function (e) { setBack(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') add(); }} placeholder="Meaning (optional)" style={{ width:'100%', padding:'10px 12px', borderRadius:9, border:`1px solid ${T.border}`, fontSize:13, outline:'none', background:T.bg, marginBottom:8 }}/>
          <button onClick={add} style={{ width:'100%', padding:'11px', borderRadius:10, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700 }}>Add phrase</button>
        </MCard>
        {items === null ? <MCard style={{ padding:20 }}><div style={{ color:T.ink3, fontSize:13 }}>Loading…</div></MCard>
         : items.length === 0 ? <MCard style={{ padding:20 }}><div style={{ color:T.ink3, fontSize:12.5 }}>No saved phrases yet. Add your first {langName} phrase above.</div></MCard>
         : <MCard style={{ padding:0, overflow:'hidden' }}>{items.map(function (p, i) { return (
             <div key={p.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
               <div style={{ flex:1 }}><div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{p.front}</div>{p.back && <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>{p.back}</div>}</div>
               <button onClick={function () { del(p.id); }} style={{ fontSize:11, color:T.ink4, background:'transparent' }}>Remove</button>
             </div>
           ); })}</MCard>}
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MForgotPwPageV5, MLessonDetailV5, MArticleReaderPageV5, MPhrasebookPageV5,
});
