// ── Mobile · v5 redesigns · Batch 6 (final) ──────────────────────
// Pre-Exam Ready · Post-Exam Upsell · Milestones Reel · AI Speaking

const useStV5B6 = React.useState;
const useEfV5B6 = React.useEffect;

const V5b6Pre = ({ eyebrow, title, lede, c }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:c||T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b6Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b6Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);

// PRE-EXAM READY
function MPreExamReadyPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [agreed, setAgreed] = useStV5B6(true);
  const sections = [
    { l:'Listening', v:'40m', s:'30 questions' },
    { l:'Reading',   v:'70m', s:'36 questions' },
    { l:'Writing',   v:'80m', s:'2 essays' },
    { l:'Speaking',  v:'15m', s:'AI proctor' },
  ];
  const checks = [
    { l:'Quiet space',     s:"You won't be interrupted" },
    { l:'Headphones in',   s:'For listening section' },
    { l:'90 minutes free', s:'No pausing once started' },
    { l:'Strong wifi',     s:'AI grading needs connection' },
  ];
  return (
    <>
      <MobileHeader back title=""/>
      <MobileBody padding={[0,0,0]} tabBarPad={false}>
        {/* Dark hero */}
        <div style={{ background:T.ink, color:'#fff', padding:'12px 22px 36px', position:'relative', overflow:'hidden' }}>
          <V5b6Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.22em', marginBottom:14 }}>DELE B2 · MOCK EXAM</div>
            <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:.96, letterSpacing:'-.035em', fontWeight:500, marginBottom:14 }}>You're<br/>ready.</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', lineHeight:1.55, maxWidth:280 }}>One attempt. 3h 25m total. No pausing, no restarts. AI-graded in under a minute.</div>
          </div>
        </div>

        {/* Sections */}
        <div style={{ padding:'24px 16px 8px' }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.16em', marginBottom:12 }}>FOUR SECTIONS · BACK-TO-BACK</div>
          <div style={{ background:T.card, borderRadius:14, border:`1px solid ${T.hairline}`, overflow:'hidden' }}>
            {sections.map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', padding:'14px 16px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, letterSpacing:'-.01em' }}>{s.l}</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{s.s}</div>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.brand, letterSpacing:'-.02em' }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Checks */}
        <div style={{ padding:'18px 16px 0' }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.16em', marginBottom:12 }}>BEFORE YOU START</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {checks.map((c, i) => (
              <div key={i} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:11, padding:'11px 12px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:4 }}>
                  <div style={{ width:14, height:14, borderRadius:7, background:T.ink, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:8, flexShrink:0 }}>✓</div>
                  <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{c.l}</div>
                </div>
                <div style={{ fontSize:10.5, color:T.ink4, lineHeight:1.4 }}>{c.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Agree + start */}
        <div style={{ padding:'22px 16px 28px' }}>
          <button onClick={()=>setAgreed(a=>!a)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 4px', background:'transparent', border:'none', textAlign:'left', marginBottom:12, cursor:'pointer' }}>
            <div style={{ width:20, height:20, borderRadius:5, background: agreed ? T.ink : 'transparent', border:`1.5px solid ${agreed ? T.ink : T.border}`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, flexShrink:0 }}>{agreed && '✓'}</div>
            <div style={{ flex:1, fontSize:11.5, color:T.ink3, lineHeight:1.4 }}>The exam can't be paused or restarted. My submission is final.</div>
          </button>

          <button onClick={()=> agreed && nav('exam_runner')} style={{ width:'100%', padding:'17px', borderRadius:14, background:T.ink, color:'#fff', fontSize:14.5, fontWeight:700, border:'none', boxShadow:'0 10px 26px rgba(0,0,0,.24)', cursor: agreed ? 'pointer' : 'not-allowed', opacity: agreed ? 1 : .35, letterSpacing:'.01em' }}>Begin exam →</button>
          <div style={{ textAlign:'center', fontSize:10.5, color:T.ink5, marginTop:11 }}>Reserved for 14 days · Take when you're ready</div>
        </div>
      </MobileBody>
    </>
  );
}

// POST-EXAM UPSELL
function MPostExamUpsellPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const skills = [
    { l:'Listening', v:7.0 },
    { l:'Reading',   v:6.5 },
    { l:'Writing',   v:6.0 },
    { l:'Speaking',  v:6.5 },
  ];
  const features = [
    { l:'Unlimited mock exams',     s:'AI-graded weekly' },
    { l:'1-on-1 tutor sessions',    s:'Same-day booking' },
    { l:'Adaptive weakness drills', s:'15 min · daily' },
  ];
  return (
    <>
      <MobileHeader back title=""/>
      <MobileBody padding={[0,0,0]} tabBarPad={false}>
        {/* Score reveal — full bleed dark */}
        <div style={{ background:T.ink, color:'#fff', padding:'20px 24px 40px', position:'relative', overflow:'hidden', textAlign:'center' }}>
          <V5b6Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.22em', marginBottom:20 }}>DELE B2 · OVERALL</div>
            <div style={{ fontFamily:T.serif, fontSize:152, lineHeight:.84, letterSpacing:'-.06em', fontWeight:500, color:'#fff', marginBottom:8 }}>6.5</div>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.22em', marginBottom:22 }}>OUT OF 9.0</div>
            <div style={{ display:'inline-block', padding:'7px 14px', borderRadius:99, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', fontSize:11.5, color:'rgba(255,255,255,.85)' }}>Solid B2 · top 38% globally</div>
          </div>
        </div>

        {/* Skill breakdown */}
        <div style={{ padding:'24px 20px 8px' }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.16em', marginBottom:14 }}>BY SECTION</div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {skills.map((s, i) => (
              <div key={i}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
                  <span style={{ fontSize:13, color:T.ink, fontWeight:600 }}>{s.l}</span>
                  <span style={{ fontFamily:T.serif, fontSize:18, color:T.ink, letterSpacing:'-.02em' }}>{s.v}</span>
                </div>
                <div style={{ height:3, background:T.hairline, borderRadius:2, overflow:'hidden' }}>
                  <div style={{ width:`${(s.v/9)*100}%`, height:'100%', background:T.ink, borderRadius:2 }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The pitch — clean editorial */}
        <div style={{ padding:'34px 24px 28px' }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.22em', marginBottom:14 }}>WHAT'S NEXT</div>
          <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1, letterSpacing:'-.03em', marginBottom:14 }}>Close the<br/>0.5 gap.</div>
          <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.55, marginBottom:22 }}>Pro students hit <strong style={{ color:T.ink }}>7.0+ on average</strong> — unlimited tutor sessions, weekly mock exams, and AI drills targeting your weakest skill.</div>

          <div style={{ background:T.card, borderRadius:14, border:`1px solid ${T.hairline}`, padding:'4px 16px', marginBottom:22 }}>
            {features.map((row, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 0', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ width:6, height:6, borderRadius:3, background:T.brand, flexShrink:0 }}/>
                <div style={{ flex:1, fontSize:12.5, color:T.ink, fontWeight:600 }}>{row.l}</div>
                <div style={{ fontSize:10.5, color:T.ink4 }}>{row.s}</div>
              </div>
            ))}
          </div>

          <button onClick={()=>nav('checkout')} style={{ width:'100%', padding:'17px', borderRadius:14, background:T.ink, color:'#fff', fontSize:14.5, fontWeight:700, border:'none', boxShadow:'0 10px 26px rgba(0,0,0,.24)', cursor:'pointer', letterSpacing:'.01em' }}>Start Pro free for 7 days</button>
          <div style={{ textAlign:'center', fontSize:10.5, color:T.ink5, marginTop:11 }}>Then $19/mo · Cancel anytime</div>

          <button onClick={()=>nav('dashboard')} style={{ width:'100%', padding:'14px', fontSize:12, fontWeight:600, color:T.ink4, background:'transparent', border:'none', marginTop:14, cursor:'pointer' }}>Continue free →</button>
        </div>
      </MobileBody>
    </>
  );
}

// MILESTONES REEL — full-screen story-style
function MMilestonesReelPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [idx, setIdx] = useStV5B6(0);
  const slides = [
    { kind:'streak', big:'90',  unit:'DAYS', tag:'YOU SHOWED UP', cap:'Ninety days. Three months of you choosing Spanish over scrolling.', g:'linear-gradient(135deg,#D26890 0%,#7C5BD6 100%)' },
    { kind:'xp',     big:'24,400', unit:'XP', tag:'TOTAL EARNED', cap:"That's roughly 488 lessons. You wouldn't have believed it on day one.", g:'linear-gradient(135deg,#3D5BA8 0%,#5A9C7A 100%)' },
    { kind:'words',  big:'1,247', unit:'WORDS', tag:'KNOWN', cap:'You can read 92% of any Spanish news article. Top 4% of learners.', g:'linear-gradient(135deg,#E08F4D 0%,#D63E3E 100%)' },
    { kind:'level',  big:'B2',    unit:'LEVEL', tag:'YOU REACHED', cap:'Independent user. Holding conversations native speakers respect.', g:'linear-gradient(135deg,#7C5BD6 0%,#3D5BA8 100%)' },
  ];
  useEfV5B6(()=>{
    const t = setTimeout(()=> setIdx(i => i < slides.length - 1 ? i + 1 : i), 4500);
    return ()=> clearTimeout(t);
  }, [idx]);
  const s = slides[idx];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:'#000', overflow:'hidden', position:'relative' }}>
      {/* Progress dots */}
      <div style={{ position:'absolute', top:14, left:14, right:14, zIndex:10, display:'flex', gap:4 }}>
        {slides.map((_, i) => (
          <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i < idx ? '#fff' : 'rgba(255,255,255,.3)', overflow:'hidden' }}>
            {i === idx && <div style={{ width:'100%', height:'100%', background:'#fff', animation:'v5b6fill 4.5s linear' }}/>}
          </div>
        ))}
      </div>
      <style>{`@keyframes v5b6fill{from{transform:translateX(-100%)}to{transform:translateX(0)}}`}</style>

      <button onClick={()=>nav('dashboard')} style={{ position:'absolute', top:32, right:14, zIndex:10, width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.12)', backdropFilter:'blur(8px)', color:'#fff', border:'none', fontSize:14 }}>×</button>

      <div style={{ flex:1, background:s.g, position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'40px 24px', color:'#fff', textAlign:'center' }}>
        <V5b6Dot/>
        <div style={{ position:'relative', maxWidth:340 }}>
          <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.85)', letterSpacing:'.22em', marginBottom:18 }}>{s.tag}</div>
          <div style={{ fontFamily:T.serif, fontSize:140, lineHeight:.85, letterSpacing:'-.05em', fontWeight:600, marginBottom:14 }}>{s.big}</div>
          <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.22em', color:'rgba(255,255,255,.85)', marginBottom:34 }}>{s.unit}</div>
          <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1.4, color:'rgba(255,255,255,.95)', fontStyle:'italic' }}>{s.cap}</div>
        </div>
      </div>

      {/* Tap zones */}
      <button onClick={()=>setIdx(i => Math.max(0, i - 1))} style={{ position:'absolute', left:0, top:50, bottom:80, width:'33%', background:'transparent', border:'none' }}/>
      <button onClick={()=>setIdx(i => Math.min(slides.length - 1, i + 1))} style={{ position:'absolute', right:0, top:50, bottom:80, width:'33%', background:'transparent', border:'none' }}/>

      <div style={{ padding:'14px 16px 22px', display:'flex', gap:10, background:'rgba(0,0,0,.4)' }}>
        <button onClick={()=>nav('dashboard')} style={{ flex:1, padding:'13px', borderRadius:12, background:'rgba(255,255,255,.12)', color:'#fff', fontSize:12.5, fontWeight:700, border:'1px solid rgba(255,255,255,.2)' }}>Done</button>
        <button style={{ flex:1, padding:'13px', borderRadius:12, background:'#fff', color:T.ink, fontSize:12.5, fontWeight:700, border:'none' }}>Share story</button>
      </div>
    </div>
  );
}

// AI SPEAKING — full-screen voice session
function MAISpeakingPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [recording, setRecording] = useStV5B6(false);
  const [secs, setSecs] = useStV5B6(0);
  useEfV5B6(()=>{
    if (!recording) return;
    const t = setInterval(()=>setSecs(s=>s+1), 1000);
    return ()=>clearInterval(t);
  }, [recording]);
  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.ink, color:'#fff', overflow:'hidden', position:'relative' }}>
      <V5b6Dot/>
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px' }}>
        <button onClick={()=>nav('practice')} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'#fff' }}>×</button>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:99, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)' }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.06em' }}>SPEAKING · 3 / 5</span>
        </div>
        <div style={{ width:32 }}/>
      </div>

      {/* Prompt */}
      <div style={{ position:'relative', padding:'8px 22px 16px' }}>
        <div style={{ fontSize:10, fontWeight:800, color:T.brand, letterSpacing:'.18em', marginBottom:9, textAlign:'center' }}>YOUR PROMPT</div>
        <div style={{ fontFamily:T.serif, fontSize:24, color:'#fff', lineHeight:1.2, letterSpacing:'-.015em', textAlign:'center', padding:'0 4px' }}>
          Describe a memorable trip you took — where you went, who with, and one specific moment that stayed with you.
        </div>
        <div style={{ fontSize:11.5, color:'rgba(255,255,255,.5)', textAlign:'center', marginTop:9 }}>2 minutes · in Spanish · be detailed</div>
      </div>

      {/* Mic visual */}
      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px 16px' }}>
        <div style={{ position:'relative', width:200, height:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {recording && [0,1,2].map(i => (
            <div key={i} style={{ position:'absolute', inset:0, borderRadius:'50%', border:`1.5px solid ${T.brand}`, animation:`v5b6ring 1.6s ease-out ${i*0.5}s infinite`, opacity:0 }}/>
          ))}
          <style>{`@keyframes v5b6ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.5);opacity:0}}`}</style>
          <button onClick={()=>setRecording(r=>!r)} style={{ width:140, height:140, borderRadius:70, background: recording ? T.brandGrad : 'rgba(255,255,255,.06)', color:'#fff', border:`2px solid ${recording ? T.brand : 'rgba(255,255,255,.2)'}`, fontSize:48, boxShadow: recording ? `0 12px 36px ${T.brand}55` : 'none', cursor:'pointer' }}>
            {Icon.mic ? Icon.mic({width:42,height:42}) : '🎙'}
          </button>
        </div>

        <div style={{ fontFamily:T.serif, fontSize:36, color:'#fff', lineHeight:1, letterSpacing:'-.02em', marginTop:24 }}>{fmt(secs)}</div>
        <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.5)', letterSpacing:'.18em', marginTop:7 }}>{recording ? 'RECORDING · TAP TO STOP' : 'TAP MIC TO START'}</div>

        {recording && <div style={{ display:'flex', alignItems:'center', gap:3, height:32, marginTop:18 }}>
          {Array.from({length:24}).map((_,i)=>{
            const phase = (secs * 8 + i * 23) % 100;
            const h = 4 + Math.abs(Math.sin(phase * .1)) * 24;
            return <div key={i} style={{ width:3, height:h, borderRadius:2, background: i % 6 === 0 ? T.brand : `rgba(255,255,255,${0.3 + (h/30)*0.5})` }}/>;
          })}
        </div>}
      </div>

      {/* Bottom controls */}
      <div style={{ position:'relative', padding:'14px 16px 22px', borderTop:'1px solid rgba(255,255,255,.08)', display:'flex', gap:10 }}>
        <button style={{ flex:1, padding:'13px', borderRadius:12, background:'rgba(255,255,255,.08)', color:'#fff', fontSize:12.5, fontWeight:700, border:'1px solid rgba(255,255,255,.14)' }}>Skip prompt</button>
        <button onClick={()=>nav('ai_grading')} disabled={secs < 5} style={{ flex:1, padding:'13px', borderRadius:12, background: secs >= 5 ? '#fff' : 'rgba(255,255,255,.16)', color: secs >= 5 ? T.ink : 'rgba(255,255,255,.5)', fontSize:12.5, fontWeight:700, border:'none', opacity: secs >= 5 ? 1 : .7 }}>Submit · grade me</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  MPreExamReadyPageV5, MPostExamUpsellPageV5, MMilestonesReelPageV5, MAISpeakingPageV5,
});
