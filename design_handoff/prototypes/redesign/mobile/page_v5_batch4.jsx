// ── Mobile · v5 redesigns · Batch 4 ───────────────────────────────
// Mock Test · AI Generating · AI Grading · Mic Check · Listening Pre · Reading Pre

const useStV5B4 = React.useState;
const useEfV5B4 = React.useEffect;

const V5b4Pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b4Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b4Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);

// ══════════════════════════════════════════════════════════════════
// MOCK TEST
// ══════════════════════════════════════════════════════════════════
function MMockTestPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const sections = [
    { ic:'head', l:'Listening',  c:T.listening.c, bg:T.listening.bg, n:30, t:'30 min' },
    { ic:'book', l:'Reading',    c:T.reading.c,   bg:T.reading.bg,   n:40, t:'60 min' },
    { ic:'pen',  l:'Writing',    c:T.writing.c,   bg:T.writing.bg,   n: 2, t:'60 min' },
    { ic:'mic',  l:'Speaking',   c:T.speaking.c,  bg:T.speaking.bg,  n: 3, t:'14 min' },
  ];
  return (
    <>
      <MobileHeader back title="Mock test"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b4Pre eyebrow="FREE · UNLIMITED · NO COST" title="Take a full mock exam" lede="Same format, same timing, same scoring as the real exam — without the £190 fee. AI grades it in 90 seconds."/>

        <div style={{ background:T.ink, borderRadius:18, padding:'22px 18px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14 }}>
          <V5b4Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:7, marginBottom:9 }}>
              <span style={{ fontFamily:T.serif, fontSize:28, lineHeight:1, letterSpacing:'-.02em' }}>2h 44m</span>
              <span style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.12em' }}>· FULL TEST</span>
            </div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.7)', lineHeight:1.5 }}>Take all 4 sections in one sitting — or split across days. Either way, your score's calibrated against the live exam.</div>
            <div style={{ display:'flex', gap:7, marginTop:14, flexWrap:'wrap' }}>
              {['Same band-scoring','Pacing tips','AI feedback','Resume anytime'].map((c,i)=> <span key={i} style={{ fontSize:9.5, fontWeight:700, color:'#fff', padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.16)' }}>{c}</span>)}
            </div>
          </div>
        </div>

        {V5b4Lbl('SECTIONS')}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          {sections.map((s, i) => (
            <button key={i} onClick={()=>nav(s.ic === 'head' ? 'listening' : s.ic === 'book' ? 'reading' : s.ic === 'pen' ? 'writing' : 'speaking')} style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 14px', borderRadius:13, background:T.card, border:`1px solid ${T.hairline}`, boxShadow:MT.shadowSm, textAlign:'left' }}>
              <div style={{ width:42, height:42, borderRadius:11, background:s.bg, color:s.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[s.ic] ? Icon[s.ic]({width:16,height:16}) : '★'}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:3 }}>SECTION {i+1}</div>
                <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.1 }}>{s.l}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{s.n} {s.l === 'Writing' || s.l === 'Speaking' ? 'tasks' : 'questions'} · {s.t}</div>
              </div>
              <span style={{ color:T.ink5, fontSize:18 }}>›</span>
            </button>
          ))}
        </div>

        <div style={{ padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:13, marginBottom:14 }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.14em', marginBottom:5 }}>BEFORE YOU START</div>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink, lineHeight:1.5 }}>"Find a quiet spot, headphones in, 2.5 hours blocked off. The mock works best when you treat it like the real thing."</div>
        </div>

        <button onClick={()=>nav('exam_entry')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Start full mock · 2h 44m</button>
        <button onClick={()=>nav('practice')} style={{ width:'100%', padding:'12px', marginTop:9, fontSize:12, fontWeight:700, color:T.ink3, background:'transparent', border:'none' }}>Take a single section instead</button>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// AI GENERATING
// ══════════════════════════════════════════════════════════════════
function MAIGeneratingPageV5() {
  const [step, setStep] = useStV5B4(0);
  const nav = (id) => window.__nav && window.__nav(id);
  const stages = [
    'Reading your skill profile',
    'Picking a passage at your level',
    'Generating questions',
    'Calibrating difficulty',
    'Loading your test',
  ];
  useEfV5B4(()=>{ if (step < stages.length - 1) { const t = setTimeout(()=>setStep(step+1), 750); return ()=>clearTimeout(t); } else { const t = setTimeout(()=>nav('reading'), 600); return ()=>clearTimeout(t); } }, [step]);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.ink, color:'#fff', padding:'30px 20px', position:'relative', overflow:'hidden' }}>
      <V5b4Dot/>
      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
        {/* Animated orb */}
        <div style={{ position:'relative', width:130, height:130, marginBottom:28 }}>
          <div style={{ position:'absolute', inset:0, borderRadius:65, border:`1.5px solid ${T.brand}`, opacity:.3, animation:'v5b4ring 2.4s ease-out infinite' }}/>
          <div style={{ position:'absolute', inset:14, borderRadius:51, border:`1.5px solid ${T.brand}`, opacity:.5, animation:'v5b4ring 2.4s ease-out 0.5s infinite' }}/>
          <div style={{ position:'absolute', inset:28, borderRadius:37, background:`radial-gradient(circle, ${T.brand} 0%, ${T.brand}55 50%, transparent 70%)`, animation:'v5b4pulse 1.6s ease-in-out infinite' }}/>
          <div style={{ position:'absolute', inset:'45%', width:14, height:14, borderRadius:7, background:'#fff', boxShadow:`0 0 16px #fff` }}/>
          <style>{`@keyframes v5b4ring{0%{transform:scale(.7);opacity:.6}100%{transform:scale(1.4);opacity:0}}@keyframes v5b4pulse{0%,100%{transform:scale(.92);opacity:.85}50%{transform:scale(1.05);opacity:1}}`}</style>
        </div>

        <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.18em', marginBottom:14 }}>BUILDING YOUR TEST</div>
        <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:34, maxWidth:280 }}>
          Crafting a passage just for you.
        </div>

        <div style={{ width:'100%', maxWidth:280 }}>
          {stages.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'8px 0', opacity: i > step ? .35 : 1, transition:'opacity .3s' }}>
                <div style={{ width:18, height:18, borderRadius:9, background: done ? T.brand : active ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)', border: active ? '1.5px solid rgba(255,255,255,.4)' : 'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{done && <span style={{ color:'#fff', fontSize:10 }}>✓</span>}{active && <div style={{ width:6, height:6, borderRadius:3, background:'#fff', animation:'v5b4pulse 1s ease-in-out infinite' }}/>}</div>
                <div style={{ fontSize:12.5, color: done ? 'rgba(255,255,255,.8)' : active ? '#fff' : 'rgba(255,255,255,.5)', fontWeight: active ? 600 : 400, textAlign:'left' }}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position:'relative', textAlign:'center', fontSize:11, color:'rgba(255,255,255,.4)', fontFamily:T.serif, fontStyle:'italic', lineHeight:1.5 }}>"Every test is generated fresh — no two are identical."</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// AI GRADING
// ══════════════════════════════════════════════════════════════════
function MAIGradingPageV5() {
  const [step, setStep] = useStV5B4(0);
  const nav = (id) => window.__nav && window.__nav(id);
  const stages = [
    { l:'Checking grammar',     d:'Verb forms · agreement · tense' },
    { l:'Scoring vocabulary',   d:'Range · register · accuracy' },
    { l:'Reading coherence',    d:'Flow · transitions · structure' },
    { l:'Calculating band',     d:'Mapped to live exam scoring' },
  ];
  useEfV5B4(()=>{ if (step < stages.length) { const t = setTimeout(()=>setStep(step+1), 900); return ()=>clearTimeout(t); } else { const t = setTimeout(()=>nav('mod_results'), 700); return ()=>clearTimeout(t); } }, [step]);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, padding:'30px 20px' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', maxWidth:340, margin:'0 auto', width:'100%' }}>
        {/* Score gauge */}
        <div style={{ position:'relative', width:160, height:160, marginBottom:24 }}>
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="80" cy="80" r="68" fill="none" stroke={T.bg2} strokeWidth="10"/>
            <circle cx="80" cy="80" r="68" fill="none" stroke={T.brand} strokeWidth="10" strokeLinecap="round" strokeDasharray={`${427 * (step / stages.length)} 427`} style={{ transition:'stroke-dasharray .6s ease' }}/>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
            <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.16em' }}>GRADING</div>
            <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1, letterSpacing:'-.03em', marginTop:3 }}>{Math.round((step / stages.length) * 100)}<span style={{ fontSize:18, color:T.ink3 }}>%</span></div>
          </div>
        </div>

        <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.18em', marginBottom:11 }}>AI GRADER · 90-SECOND TURNAROUND</div>
        <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:28 }}>Reading your essay carefully.</div>

        <div style={{ width:'100%' }}>
          {stages.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'9px 12px', borderRadius:10, background: active ? T.card : 'transparent', border: active ? `1px solid ${T.hairline}` : '1px solid transparent', boxShadow: active ? MT.shadowSm : 'none', marginBottom:5, opacity: i > step ? .4 : 1, transition:'all .3s' }}>
                <div style={{ width:20, height:20, borderRadius:10, background: done ? '#5A9C7A' : active ? T.brand : T.bg2, color: done || active ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:10 }}>{done ? '✓' : active ? <div style={{ width:6, height:6, borderRadius:3, background:'#fff' }}/> : i+1}</div>
                <div style={{ flex:1, textAlign:'left' }}>
                  <div style={{ fontSize:12.5, fontWeight: active ? 700 : 500, color: done || active ? T.ink : T.ink3 }}>{s.l}</div>
                  <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>{s.d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MIC CHECK
// ══════════════════════════════════════════════════════════════════
function MMicCheckPageV5() {
  const [vol, setVol] = useStV5B4(0);
  const [stage, setStage] = useStV5B4('idle');
  const nav = (id) => window.__nav && window.__nav(id);
  useEfV5B4(()=>{ if (stage !== 'recording') return; const t = setInterval(()=>setVol(40 + Math.random()*55), 100); return ()=>clearInterval(t); }, [stage]);
  return (
    <>
      <MobileHeader back title="Mic check"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b4Pre eyebrow="STEP 1 OF 2 · BEFORE YOU SPEAK" title="Test your microphone" lede="Read the sentence below out loud — we'll make sure your audio's coming through clearly."/>

        <div style={{ background:T.ink, borderRadius:18, padding:'30px 22px', color:'#fff', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:14 }}>
          <V5b4Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ position:'relative', width:120, height:120, margin:'0 auto 22px' }}>
              {[3,2,1].map(r => <div key={r} style={{ position:'absolute', inset:`-${r * 10}px`, borderRadius:'50%', border:`1px solid rgba(248,154,90,${0.18 - r*0.04})`, opacity: stage === 'recording' ? Math.min(1, vol/60) : 0, transition:'opacity .3s' }}/>)}
              <div style={{ position:'absolute', inset:0, borderRadius:60, background: stage === 'recording' ? `radial-gradient(circle, ${T.brand}80 0%, ${T.brand}30 50%, transparent 70%)` : 'rgba(255,255,255,.06)', border:`1.5px solid ${stage === 'recording' ? T.brand : 'rgba(255,255,255,.18)'}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all .3s' }}>
                <div style={{ color:'#fff', fontSize:32 }}>{Icon.mic ? Icon.mic({width:32,height:32}) : '🎙'}</div>
              </div>
            </div>

            <div style={{ height:42, display:'flex', alignItems:'center', justifyContent:'center', gap:3, marginBottom:14 }}>
              {Array.from({length:32}).map((_, i) => {
                const phase = stage === 'recording' ? Math.abs(Math.sin((Date.now()/180 + i*0.4))) : 0;
                const h = stage === 'recording' ? 6 + phase * (vol/100) * 28 : 4;
                return <div key={i} style={{ width:3, height:h, borderRadius:2, background: i % 5 === 0 ? T.brand : 'rgba(255,255,255,.4)', transition:'height .1s' }}/>;
              })}
            </div>

            <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:14, color:'rgba(255,255,255,.85)', lineHeight:1.5, padding:'0 18px' }}>"En un lugar de la Mancha, de cuyo nombre no quiero acordarme."</div>
          </div>
        </div>

        {stage === 'idle' && <button onClick={()=>setStage('recording')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Start recording</button>}
        {stage === 'recording' && <button onClick={()=>setStage('done')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.ink, color:'#fff', fontSize:13.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:9 }}><span style={{ width:9, height:9, borderRadius:2, background:'#D63E3E' }}/>Stop · {Math.floor(vol)}%</button>}
        {stage === 'done' && <>
          <div style={{ padding:'12px 14px', background:'#E2EEDF', border:`1px solid #B5D2A6`, borderRadius:11, marginBottom:9, display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:24, height:24, borderRadius:12, background:'#5A9C7A', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>✓</div>
            <div><div style={{ fontSize:12, fontWeight:700, color:'#3D8A5F' }}>Audio looks great</div><div style={{ fontSize:10.5, color:'#3D8A5F', opacity:.8, marginTop:1 }}>Clear pronunciation, no background noise</div></div>
          </div>
          <button onClick={()=>nav('speaking')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Continue to speaking test</button>
        </>}

        <div style={{ marginTop:14, padding:'10px 12px', background:T.bg2, borderRadius:11, fontSize:10.5, color:T.ink3, lineHeight:1.55 }}>
          <b>Tips:</b> Use earphones to avoid echo. Find a quiet room. Hold the phone 6–8 inches from your mouth.
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// LISTENING / READING PRE
// ══════════════════════════════════════════════════════════════════
function MAIListeningPrePageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return <MAIPrePageShared kind="listening" nav={nav} ic="head" c={T.listening.c} bg={T.listening.bg}
    eyebrow="LISTENING SECTION · 4 PARTS · 30 MIN"
    title="Eyes off, ears in."
    lede="Four short audio clips — conversations, lectures, announcements. You'll hear each clip twice."
    bullets={[
      'Headphones recommended · audio quality matters',
      'You can take notes — we don\'t grade your notes',
      'You can\'t pause or rewind once it starts',
      'Read the questions before each clip plays',
    ]}
    cta="Start listening test · 30 min"
    next="listening"
  />;
}
function MAIReadingPrePageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return <MAIPrePageShared kind="reading" nav={nav} ic="book" c={T.reading.c} bg={T.reading.bg}
    eyebrow="READING SECTION · 3 PASSAGES · 60 MIN"
    title="Three passages, 40 questions."
    lede="Each passage is around 700 words. The questions get harder as you go — manage your time across passages."
    bullets={[
      'You can flag questions to come back to',
      'Highlight or underline the passage as you read',
      'No external dictionary — use context to infer',
      'Your timer pauses if you switch sections',
    ]}
    cta="Start reading test · 60 min"
    next="reading"
  />;
}
function MAIPrePageShared({ kind, nav, ic, c, bg, eyebrow, title, lede, bullets, cta, next }) {
  return (
    <>
      <MobileHeader back title={kind === 'listening' ? 'Listening test' : 'Reading test'}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 14px' }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:c, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>
          <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
          <div style={{ fontSize:13.5, color:T.ink3, marginTop:9, lineHeight:1.55 }}>{lede}</div>
        </div>

        <div style={{ background:bg, borderRadius:16, padding:'18px 16px', display:'flex', alignItems:'center', gap:14, marginBottom:14, border:`1px solid ${c}1a` }}>
          <div style={{ width:54, height:54, borderRadius:27, background:c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 16px ${c}55`, flexShrink:0 }}>{Icon[ic] ? Icon[ic]({width:22,height:22}) : '★'}</div>
          <div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{kind === 'listening' ? '30 min' : '60 min'}</div>
            <div style={{ fontSize:11, color:T.ink4, marginTop:4 }}>{kind === 'listening' ? '4 parts · 40 questions' : '3 passages · 40 questions'}</div>
          </div>
        </div>

        {V5b4Lbl('BEFORE YOU START')}
        <MCard style={{ padding:14, marginBottom:14 }}>
          {bullets.map((b, i, all) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom: i < all.length-1 ? 9 : 0 }}>
              <div style={{ width:18, height:18, borderRadius:9, background:c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:10, fontWeight:700, marginTop:1 }}>{i+1}</div>
              <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.45 }}>{b}</div>
            </div>
          ))}
        </MCard>

        <div style={{ padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11, marginBottom:14 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink, lineHeight:1.5 }}>"Once you tap start, the timer begins and won't stop. Make sure you're ready."</div>
        </div>

        <button onClick={()=>nav(next)} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>{cta}</button>
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MMockTestPageV5, MAIGeneratingPageV5, MAIGradingPageV5, MMicCheckPageV5, MAIListeningPrePageV5, MAIReadingPrePageV5,
});
