// Mobile · Exam Runner + Results (adapts for full / monthly / mock / practice)

function MExamRunnerV5({ mode = 'monthly' }) {
  const code = window.__langCode || 'en';
  const lang = (typeof LANGUAGES !== 'undefined') ? (LANGUAGES.find(l => l.code === code) || LANGUAGES[0]) : { code:'en', english:'English' };
  const ex = (typeof examFor === 'function') ? examFor(lang.code) : { name:'IELTS', short:'IELTS', modules:[], duration:'2h 45m' };
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };
  const modules = (ex.modules && ex.modules.length) ? ex.modules : [
    { ic:'head', label:'Listening', time:'30 min', q:30, color:'listening' },
    { ic:'book', label:'Reading',   time:'60 min', q:40, color:'reading' },
    { ic:'pen',  label:'Writing',   time:'60 min', q:2,  color:'writing' },
    { ic:'mic',  label:'Speaking',  time:'15 min', q:3,  color:'speaking' },
  ];
  const [step, setStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [secs, setSecs] = React.useState(0);
  const nav = (id) => window.__nav && window.__nav(id);
  React.useEffect(()=>{ const t = setInterval(()=>setSecs(s=>s+1), 1000); return ()=>clearInterval(t); }, []);
  const fmt = (s) => `${Math.floor(s/3600)}h ${String(Math.floor((s%3600)/60)).padStart(2,'0')}m`;
  const m = modules[step] || modules[0];
  const c = colorMap[m.color] || T.listening;
  const done = Object.keys(completed).length;
  const headerTag = mode === 'monthly' ? 'MONTHLY EXAM' : mode === 'mock' ? 'MOCK EXAM' : mode === 'practice' ? 'PRACTICE' : 'EXAM';
  const allDone = done === modules.length;
  const _gen = (typeof useGenContent === 'function') ? useGenContent(m.color) : 'err';
  const _c = (_gen && _gen !== 'err') ? _gen : null;
  const _firstQ = _c && _c.questions && _c.questions[0];
  const _opts = (_firstQ && _firstQ.options) ? _firstQ.options : ['Option A — concise statement', 'Option B — slightly different', 'Option C — common distractor', 'Option D — clearly wrong'];
  const _promptText = _c ? (
    (m.color === 'reading' || m.color === 'listening') ? (_firstQ ? _firstQ.stem : (_c.title || '')) :
    (m.color === 'writing') ? (_c.task2Topic || _c.task1Prompt || '') :
    (m.color === 'speaking') ? (_c.prompt || '') : ''
  ) : null;

  const goSubmit = () => {
    setCompleted(prev => ({ ...prev, [step]: true }));
    if (step < modules.length - 1) setStep(step + 1);
  };

  return (
    <>
      <MobileHeader back title={`${ex.short} · ${m.label}`}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {/* Hero · timer */}
        <div style={{ background:T.ink, borderRadius:16, padding:'16px 16px', color:'#fff', marginBottom:12, position:'relative', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:11 }}>
            <span style={{ fontSize:9.5, fontWeight:800, color:T.brand, letterSpacing:'.16em' }}>{headerTag}</span>
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:99, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)' }}>
              <div style={{ width:6, height:6, borderRadius:3, background:'#5BD17A', boxShadow:'0 0 6px #5BD17A' }}/>
              <span style={{ fontSize:10, fontWeight:700 }}>{fmt(secs)}</span>
            </div>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.1, letterSpacing:'-.02em' }}>{m.label} · {ex.short}</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', marginTop:5 }}>{m.time} · {m.q} {m.q === 1 ? 'task' : 'items'}</div>
          {/* Module dots */}
          <div style={{ display:'flex', gap:5, marginTop:13 }}>
            {modules.map((mm, i) => {
              const cc = colorMap[mm.color] || T.listening;
              const dn = completed[i];
              return <div key={i} style={{ flex:1, height:5, borderRadius:3, background: dn ? cc.c : (i === step ? 'rgba(255,255,255,.45)' : 'rgba(255,255,255,.12)') }}/>;
            })}
          </div>
        </div>

        {/* Module tab list */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{done}/{modules.length} MODULES COMPLETE</div>
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {modules.map((mm, i) => {
            const cc = colorMap[mm.color] || T.listening;
            const dn = completed[i];
            const cur = i === step;
            return (
              <button key={i} onClick={()=>!dn && setStep(i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background: cur ? T.bg2 : 'none', textAlign:'left' }}>
                <div style={{ width:30, height:30, borderRadius:8, background: dn ? cc.c : cc.bg, color: dn ? '#fff' : cc.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{dn ? '✓' : (Icon[mm.ic] ? Icon[mm.ic]({width:13,height:13}) : '★')}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{mm.label}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{dn ? 'Submitted' : `${mm.time} · ${mm.q} ${mm.q === 1 ? 'task' : 'items'}`}</div>
                </div>
                {cur && !dn && <span style={{ fontSize:9.5, fontWeight:800, color:cc.c, padding:'3px 8px', borderRadius:99, background:cc.bg, letterSpacing:'.1em' }}>NOW</span>}
              </button>
            );
          })}
        </MCard>

        {/* Module body · live generated content when available */}
        <MCard style={{ padding:18, marginBottom:14, minHeight:220 }}>
          <div style={{ fontSize:9.5, fontWeight:800, color:c.c, letterSpacing:'.14em', marginBottom:9 }}>{m.label.toUpperCase()} · {_gen === null ? 'LOADING…' : (_c ? (_firstQ ? 'QUESTION 1' : 'TASK 1') : 'TASK 1 OF ' + m.q)}</div>
          {(m.color === 'reading' || m.color === 'listening') && _c && _c.passage && (
            <div style={{ maxHeight:150, overflowY:'auto', fontSize:12.5, color:T.ink2, lineHeight:1.6, marginBottom:12, paddingRight:4, WebkitOverflowScrolling:'touch' }}>{_c.passage}</div>
          )}
          <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.4, marginBottom:14 }}>
            {_promptText ? _promptText : (<>
              {m.color === 'reading'   && 'Read the passage about urban planning, then answer the comprehension questions.'}
              {m.color === 'listening' && 'Listen to the audio clip — a conversation between two students — and answer multiple choice questions.'}
              {m.color === 'writing'   && 'Write a 250-word essay describing a memorable journey, including specific sensory details.'}
              {m.color === 'speaking'  && 'Speak for 2 minutes about a hobby you\'ve picked up recently. Be detailed and natural.'}
            </>)}
          </div>
          {m.color === 'listening' && _c && _c.passage && (
            <button onClick={()=>window.flSpeak && window.flSpeak(_c.passage, code)} style={{ marginBottom:12, padding:'9px 14px', borderRadius:10, background:c.bg, color:c.c, fontSize:12, fontWeight:700, border:`1px solid ${c.c}33`, display:'inline-flex', alignItems:'center', gap:6 }}>{Icon.play ? Icon.play({width:12,height:12}) : '▶'} Play audio</button>
          )}
          {m.color === 'writing' && (
            <textarea placeholder="Start writing…" style={{ width:'100%', minHeight:120, padding:'11px 12px', borderRadius:11, background:T.bg2, border:`1px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:T.serif, lineHeight:1.5, resize:'vertical', outline:'none' }}/>
          )}
          {m.color === 'speaking' && (
            <button style={{ width:'100%', padding:'14px', borderRadius:11, background:c.bg, color:c.c, fontSize:12.5, fontWeight:700, border:`1px solid ${c.c}33`, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>{Icon.mic ? Icon.mic({width:14,height:14}) : '🎙'} Tap to record</button>
          )}
          {(m.color === 'reading' || m.color === 'listening') && (
            <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
              {_opts.map((o, i) => (
                <button key={i} style={{ padding:'10px 12px', borderRadius:10, background:T.bg2, border:`1px solid ${T.hairline}`, fontSize:12, color:T.ink, textAlign:'left' }}>{o}</button>
              ))}
            </div>
          )}
        </MCard>

        {!allDone ? (
          <button onClick={goSubmit} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Submit · next module</button>
        ) : (
          <button onClick={()=>nav(mode === 'monthly' ? 'monthly_results' : mode === 'mock' ? 'mock_results' : mode === 'practice' ? 'practice_results' : 'exam_results')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Finish · see scores</button>
        )}
      </MobileBody>
    </>
  );
}

function MExamResultsV5({ mode = 'monthly' }) {
  const nav = (id) => window.__nav && window.__nav(id);
  const code = window.__langCode || 'en';
  const lang = (typeof LANGUAGES !== 'undefined') ? (LANGUAGES.find(l => l.code === code) || LANGUAGES[0]) : { code:'en', english:'English' };
  const ex = (typeof examFor === 'function') ? examFor(lang.code) : { name:'IELTS', short:'IELTS' };
  const overall = mode === 'practice' ? 'B2.1' : '6.5';
  const tag = mode === 'monthly' ? 'OFFICIAL · BAND SCORE' : mode === 'mock' ? 'MOCK · AI-GRADED' : mode === 'practice' ? 'PRACTICE · CEFR' : 'YOUR RESULT';
  const breakdown = [
    { l:'Listening', v:7.0, max:9, c:'#5A9C7A' },
    { l:'Reading',   v:6.5, max:9, c:T.brand },
    { l:'Writing',   v:6.0, max:9, c:'#E0A23A' },
    { l:'Speaking',  v:6.5, max:9, c:'#7C5BD6' },
  ];
  const upsell = mode === 'monthly' || mode === 'mock';
  return (
    <>
      <MobileHeader back title="Result"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:T.ink, borderRadius:18, padding:'30px 22px', color:'#fff', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:14, marginTop:6 }}>
          <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05 }}>
            {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:11, fontWeight:800, color:T.brand, letterSpacing:'.18em', marginBottom:9 }}>{tag}</div>
            <div style={{ fontFamily:T.serif, fontSize:84, lineHeight:.9, letterSpacing:'-.04em', fontWeight:600, color:T.brand }}>{overall}</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginTop:11, letterSpacing:'.04em' }}>{ex.short} · {lang.english}</div>
          </div>
        </div>

        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>BREAKDOWN</div>
        <MCard style={{ padding:14, marginBottom:14 }}>
          {breakdown.map((s, i) => (
            <div key={i} style={{ marginTop: i ? 11 : 0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                <span style={{ fontSize:12, fontWeight:600, color:T.ink }}>{s.l}</span>
                <span style={{ fontFamily:T.serif, fontSize:14, color:s.c, letterSpacing:'-.02em' }}>{s.v}</span>
              </div>
              <div style={{ height:6, borderRadius:3, background:T.bg2, overflow:'hidden' }}>
                <div style={{ width:`${(s.v/s.max)*100}%`, height:'100%', background:s.c, borderRadius:3 }}/>
              </div>
            </div>
          ))}
        </MCard>

        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>AI FEEDBACK</div>
        <MCard style={{ padding:14, marginBottom:14 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.ink, lineHeight:1.5, marginBottom:11 }}>"Strong fluency in speaking. Reading speed cost you 0.5 — practice scanning longer passages. Writing essays would benefit from more varied connectors."</div>
          <div style={{ display:'flex', gap:5 }}>
            <span style={{ fontSize:10, fontWeight:700, color:'#5A9C7A', padding:'3px 8px', borderRadius:99, background:'#5A9C7A1a' }}>+ Fluency</span>
            <span style={{ fontSize:10, fontWeight:700, color:T.brand, padding:'3px 8px', borderRadius:99, background:T.brandLight }}>− Speed</span>
            <span style={{ fontSize:10, fontWeight:700, color:'#E0A23A', padding:'3px 8px', borderRadius:99, background:'#E0A23A1a' }}>± Range</span>
          </div>
        </MCard>

        {upsell && (
          <div style={{ background:T.brandGrad, borderRadius:16, padding:'18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
            <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.75)', letterSpacing:'.16em', marginBottom:7 }}>PRO STUDENTS · 7.0 AVG</div>
            <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:9 }}>Close the 0.5 gap.</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.85)', lineHeight:1.5, marginBottom:12 }}>Pro unlocks unlimited tutor sessions, weakness-targeted drills and unlimited mocks.</div>
            <button onClick={()=>nav('checkout')} style={{ width:'100%', padding:'11px', borderRadius:11, background:'#fff', color:T.ink, fontSize:12.5, fontWeight:700, border:'none' }}>Try Pro · 7-day free trial</button>
          </div>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <button onClick={()=>nav('exams')} style={{ padding:'13px', borderRadius:12, background:T.card, color:T.ink, fontSize:12.5, fontWeight:700, border:`1px solid ${T.hairline}` }}>Back to exams</button>
          <button onClick={()=>nav('dashboard')} style={{ padding:'13px', borderRadius:12, background:T.ink, color:'#fff', fontSize:12.5, fontWeight:700 }}>Continue</button>
        </div>
      </MobileBody>
    </>
  );
}

const MMonthlyRunnerV5 = () => <MExamRunnerV5 mode="monthly"/>;
const MMockRunnerV5    = () => <MExamRunnerV5 mode="mock"/>;
const MPracticeRunnerV5= () => <MExamRunnerV5 mode="practice"/>;
const MFullRunnerV5    = () => <MExamRunnerV5 mode="monthly"/>;
const MMonthlyResultsV5 = () => <MExamResultsV5 mode="monthly"/>;
const MMockResultsV5    = () => <MExamResultsV5 mode="mock"/>;
const MPracticeResultsV5= () => <MExamResultsV5 mode="practice"/>;
const MFullResultsV5    = () => <MExamResultsV5 mode="monthly"/>;

Object.assign(window, {
  MExamRunnerV5, MExamResultsV5,
  MMonthlyRunnerV5, MMockRunnerV5, MPracticeRunnerV5, MFullRunnerV5,
  MMonthlyResultsV5, MMockResultsV5, MPracticeResultsV5, MFullResultsV5,
});
