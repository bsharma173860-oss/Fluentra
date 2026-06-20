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
const V5b1Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);

// ══════════════════════════════════════════════════════════════════
// OTP (email verification)
// ══════════════════════════════════════════════════════════════════
function MOTPPageV5() {
  const [code, setCode] = useStV5B1(['','','','','','']);
  const [secs, setSecs] = useStV5B1(28);
  const [verified, setVerified] = useStV5B1(false);
  const refs = useRfV5B1([]);
  const nav = (id) => window.__nav && window.__nav(id);
  useEfV5B1(()=>{ if (secs > 0) { const t = setTimeout(()=>setSecs(secs-1), 1000); return ()=>clearTimeout(t); } }, [secs]);
  const set = (i, v) => { if (!/^\d?$/.test(v)) return; const n=[...code]; n[i]=v; setCode(n); if (v && i<5) refs.current[i+1] && refs.current[i+1].focus(); };
  const filled = code.every(d => d);
  if (verified) return (
    <>
      <MobileHeader back onBack={()=>nav('auth_signup')} title="Verify"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'40px 12px 0' }}>
          <div style={{ width:72, height:72, borderRadius:36, background:T.brandGrad, color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', marginBottom:18, boxShadow:`0 12px 28px ${T.brand}40` }}>{Icon.check ? Icon.check({ width:30, height:30, strokeWidth:3 }) : '✓'}</div>
          <div style={{ fontSize:10.5, fontWeight:800, letterSpacing:'.16em', color:T.ink4, marginBottom:10, textTransform:'uppercase' }}>Email verified</div>
          <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.05, letterSpacing:'-.02em', color:T.ink, marginBottom:10 }}>You're in.</div>
          <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:14 }}>Setting up your account…</div>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.brand, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
        </div>
      </MobileBody>
    </>
  );
  return (
    <>
      <MobileHeader back onBack={()=>nav('auth_signup')} title="Verify"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b1Pre eyebrow="STEP 2 OF 3 · CHECK YOUR INBOX" title="Enter the code" lede="We sent a 6-digit code to maria@example.com — it expires in 10 minutes."/>
        <div style={{ background:T.ink, borderRadius:18, padding:'24px 18px', marginBottom:16, position:'relative', overflow:'hidden' }}>
          <V5b1Dot/>
          <div style={{ position:'relative', display:'flex', gap:8, justifyContent:'center' }}>
            {code.map((d, i) => (
              <input key={i} ref={el=>refs.current[i]=el} value={d} onChange={e=>set(i, e.target.value)} maxLength={1} inputMode="numeric" style={{ width:42, height:54, borderRadius:11, background:'rgba(255,255,255,.08)', border:`1.5px solid ${d ? T.brand : 'rgba(255,255,255,.18)'}`, color:'#fff', fontFamily:T.serif, fontSize:26, textAlign:'center', outline:'none' }}/>
            ))}
          </div>
        </div>
        <button onClick={()=>{ if (filled) { setVerified(true); setTimeout(()=>nav('auth_onboarding'), 1700); } }} disabled={!filled} style={{ width:'100%', padding:'14px', borderRadius:13, background: filled ? T.brandGrad : T.bg3, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow: filled ? `0 8px 22px ${T.brand}40` : 'none', marginBottom:14 }}>Verify & continue</button>
        <div style={{ textAlign:'center', fontSize:12, color:T.ink4 }}>Didn't get it? {secs > 0 ? <span>Resend in <b style={{ color:T.ink2 }}>{secs}s</b></span> : <button onClick={()=>setSecs(28)} style={{ color:T.brand, fontWeight:700 }}>Resend code</button>}</div>
        <div style={{ marginTop:24, padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink, lineHeight:1.5 }}>"Wrong email? <span style={{ color:T.brand, fontStyle:'normal' }}>Go back and edit it</span> — we won't send another code until you do."</div>
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// FORGOT PASSWORD
// ══════════════════════════════════════════════════════════════════
function MForgotPwPageV5() {
  const [step, setStep] = useStV5B1(0);
  const [email, setEmail] = useStV5B1('maria@example.com');
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
  const [tab, setTab] = useStV5B1('overview');
  const [playing, setPlaying] = useStV5B1(false);
  const nav = (id) => window.__nav && window.__nav(id);
  const lesson = { unit:'Unit 2 · Daily life', n:6, title:'At the doctor', sub:'Symptoms, appointments and medical vocabulary in everyday Spanish.', min:18, items:14, level:'A2', xp:120 };
  const objectives = ['Describe common symptoms in Spanish','Make and reschedule a doctor\'s appointment','Understand basic medical instructions','Use polite forms with healthcare staff'];
  const vocab = [
    { es:'la fiebre',     en:'fever',     ex:'Tengo fiebre desde anoche' },
    { es:'el dolor',      en:'pain',      ex:'Siento un dolor en la espalda' },
    { es:'la receta',     en:'prescription', ex:'¿Puede darme una receta?' },
    { es:'la cita',       en:'appointment', ex:'Quisiera una cita para mañana' },
    { es:'el resfriado',  en:'cold',      ex:'Creo que tengo un resfriado' },
  ];

  return (
    <>
      <MobileHeader back title={lesson.unit} right={<button style={{ width:34, height:34, borderRadius:17, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.bookmark ? Icon.bookmark({width:13,height:13}) : '☆'}</button>}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b1Pre eyebrow={`LESSON ${lesson.n} · ${lesson.level} · ${lesson.min} MIN`} title={lesson.title} lede={lesson.sub}/>
        {/* Hero · video card */}
        <div style={{ background:T.ink, borderRadius:18, padding:0, marginBottom:14, position:'relative', overflow:'hidden', aspectRatio:'16/9' }}>
          <V5b1Dot/>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#7B4A2D 0%,#1F1812 100%)', opacity:.5 }}/>
          <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'14px 16px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
              <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', letterSpacing:'.14em', padding:'3px 8px', borderRadius:99, background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)' }}>VIDEO · 4:32</span>
              <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', letterSpacing:'.14em', padding:'3px 8px', borderRadius:99, background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)' }}>HD</span>
            </div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:'.12em', marginBottom:4 }}>WATCH FIRST</div>
                <div style={{ fontFamily:T.serif, fontSize:18, color:'#fff', lineHeight:1.1 }}>Anita visits the clinic</div>
              </div>
              <button onClick={()=>setPlaying(true)} style={{ width:54, height:54, borderRadius:27, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 22px ${T.brand}55`, border:'none' }}>{Icon.play ? Icon.play({width:18,height:18}) : '▶'}</button>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {[{id:'overview',l:'Overview'},{id:'vocab',l:`Vocab · ${vocab.length}`},{id:'practice',l:'Practice'}].map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>;
          })}
        </div>

        {tab === 'overview' && <>
          {V5b1Lbl("WHAT YOU'LL LEARN")}
          <MCard style={{ padding:14, marginBottom:14 }}>
            {objectives.map((o, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom: i < objectives.length-1 ? 9 : 0 }}>
                <div style={{ width:18, height:18, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:10, fontWeight:700, marginTop:1 }}>{i+1}</div>
                <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.45 }}>{o}</div>
              </div>
            ))}
          </MCard>
          {V5b1Lbl('STATS')}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
            {[{l:'DURATION',v:`${lesson.min}m`},{l:'ITEMS',v:lesson.items},{l:'XP',v:`+${lesson.xp}`}].map(s => (
              <MCard key={s.l} style={{ padding:'12px 10px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div><div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginTop:5 }}>{s.l}</div></MCard>
            ))}
          </div>
        </>}
        {tab === 'vocab' && (
          <MCard style={{ padding:0, overflow:'hidden' }}>
            {vocab.map((v, i) => (
              <div key={i} style={{ padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontFamily:T.serif, fontSize:16, color:T.ink, fontWeight:600 }}>{v.es}</span>
                  <span style={{ fontSize:11.5, color:T.ink3 }}>{v.en}</span>
                </div>
                <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink4, lineHeight:1.4 }}>"{v.ex}"</div>
              </div>
            ))}
          </MCard>
        )}
        {tab === 'practice' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[{ic:'pen',  l:'Writing exercise', m:'Form 5 sentences with vocab', t:'8 min', c:T.writing.c, bg:T.writing.bg},
              {ic:'mic',  l:'Speaking drill',   m:'Roleplay: book an appointment', t:'10 min', c:T.speaking.c, bg:T.speaking.bg},
              {ic:'head', l:'Listen & answer',  m:'Audio comprehension · 6 Qs', t:'7 min', c:T.listening.c, bg:T.listening.bg}].map((r, i) => (
              <button key={i} onClick={()=>nav(r.ic === 'mic' ? 'speaking' : r.ic === 'head' ? 'listening' : 'writing')} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 13px', borderRadius:13, background:T.card, border:`1px solid ${T.hairline}`, boxShadow:MT.shadowSm, textAlign:'left' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:r.bg, color:r.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[r.ic] ? Icon[r.ic]({width:14,height:14}) : '★'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{r.l}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{r.m} · {r.t}</div>
                </div>
                <span style={{ color:T.ink5, fontSize:18 }}>›</span>
              </button>
            ))}
          </div>
        )}

        <button onClick={()=>nav('writing')} style={{ width:'100%', padding:'14px', marginTop:18, borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>Start lesson · ~{lesson.min} min {Icon.arrow ? Icon.arrow({width:12,height:12}) : '→'}</button>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// ARTICLE READER
// ══════════════════════════════════════════════════════════════════
function MArticleReaderPageV5() {
  const [scroll, setScroll] = useStV5B1(0);
  const [size, setSize] = useStV5B1(15);
  const article = {
    eyebrow:'CULTURE · 6 MIN READ',
    title:'How to order coffee like a Spaniard',
    lede:'A short guide to café culture in Madrid, Barcelona and beyond — the rituals, the vocab, and the unwritten rules.',
    author:'Anaís Rodríguez',
    date:'May 4',
    body:[
      ['p','In Spain, coffee is less a drink than a punctuation mark. It opens the morning, breaks up work, signals friendship and ends meals. Knowing what to order — and how — is half the battle.'],
      ['h','The morning lineup'],
      ['p','Most Spaniards start with a <b>café con leche</b>: half espresso, half steamed milk, served in a wide cup. Stronger? <b>Café solo</b> (a straight espresso). Lighter? <b>Café cortado</b> — espresso with a splash of milk in a small glass.'],
      ['quote','"Un café, por favor" gets you a basic espresso almost anywhere.'],
      ['h','When to order what'],
      ['p','Coffee with milk is a morning thing — order a milky drink after lunch and you\'ll get a polite raised eyebrow. Afternoon is the time for <b>cortado</b> or <b>solo</b>, often with a small piece of dark chocolate on the side.'],
      ['p','One last rule: never rush. Coffee here is meant to be sat with, not carried. Pull up a chair, watch the street, and let the morning unfold.'],
    ]
  };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'hidden' }}>
      <div style={{ height:3, background:T.bg2, position:'relative' }}><div style={{ height:'100%', width:`${scroll}%`, background:T.brand, transition:'width .15s' }}/></div>
      <MobileHeader back title="Article" right={<div style={{ display:'flex', gap:6 }}>
        <button onClick={()=>setSize(Math.max(13, size-1))} style={{ width:30, height:30, borderRadius:8, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink3, fontSize:11, fontWeight:700 }}>A−</button>
        <button onClick={()=>setSize(Math.min(20, size+1))} style={{ width:30, height:30, borderRadius:8, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, fontSize:13, fontWeight:700 }}>A+</button>
      </div>}/>
      <div onScroll={e=>{ const el=e.target; setScroll((el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight)) * 100); }} style={{ flex:1, overflow:'auto', padding:'14px 18px 30px' }}>
        <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.16em', marginBottom:10 }}>{article.eyebrow}</div>
        <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:12 }}>{article.title}</div>
        <div style={{ fontSize:14, color:T.ink3, lineHeight:1.55, marginBottom:18, fontFamily:T.serif }}>{article.lede}</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingBottom:18, marginBottom:18, borderBottom:`1px solid ${T.hairline}` }}>
          <div style={{ width:32, height:32, borderRadius:16, background:'linear-gradient(135deg,#D26890,#E08F4D)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>AR</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{article.author}</div>
            <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{article.date} · 4 min read · Spanish · A2</div>
          </div>
        </div>
        {article.body.map((b, i) => {
          if (b[0] === 'h') return <div key={i} style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginTop:24, marginBottom:10, letterSpacing:'-.015em' }}>{b[1]}</div>;
          if (b[0] === 'quote') return <div key={i} style={{ borderLeft:`3px solid ${T.brand}`, padding:'8px 0 8px 14px', margin:'18px 0', fontFamily:T.serif, fontStyle:'italic', fontSize:18, color:T.ink2, lineHeight:1.4 }}>{b[1]}</div>;
          return <div key={i} dangerouslySetInnerHTML={{ __html: b[1] }} style={{ fontSize:size, color:T.ink2, lineHeight:1.7, marginBottom:14, fontFamily:T.serif }}/>;
        })}
        <div style={{ marginTop:24, padding:'14px 16px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:13 }}>
          <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.14em', marginBottom:6 }}>SAVE TO LEARN</div>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.ink, lineHeight:1.5 }}>"Tap any word in the article to add it to your vocab deck — we'll surface it again tomorrow."</div>
        </div>
      </div>
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
  MOTPPageV5, MForgotPwPageV5, MLessonDetailV5, MArticleReaderPageV5, MPhrasebookPageV5,
});
