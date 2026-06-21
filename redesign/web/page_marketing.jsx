// ── Page: Marketing landing page (logged-out) ───────────────
// Editorial hero → social proof → product peek → method → CTA
// Style: warm off-white, big serif headlines, generous whitespace.
// Renders OUTSIDE the WebSidebar — full-width frame.

function MarketingPage() {
 return (
  <div style={{ flex:1, height:'100%', overflow:'auto', background:T.bg }}>
   {/* Top nav */}
   <div style={{ position:'sticky', top:0, zIndex:20, background:'rgba(249,248,245,.85)', backdropFilter:'blur(14px)', borderBottom:`1px solid ${T.border}` }}>
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'18px 32px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
     <div style={{ display:'flex', alignItems:'center', gap:9 }}>
      <div style={{ width:30, height:30, borderRadius:8, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.brandmark({ width:18, height:18 })}</div>
      <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>Fluentra</div>
     </div>
     <div style={{ display:'flex', alignItems:'center', gap:28 }}>
      {['How it works','Languages','Reviews','Pricing','For teachers'].map(l => (
       <a key={l} style={{ fontSize:13, fontWeight:500, color:T.ink2, cursor:'pointer' }}>{l}</a>
      ))}
     </div>
     <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <Btn label="Sign in" nav="auth_login" variant="ghost" accent={T.ink2}/>
      <Btn label="Start free" nav="auth_signup" accent={T.brand} iconRight={Icon.arrow()}/>
     </div>
    </div>
   </div>

   {/* HERO */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'80px 32px 60px', display:'grid', gridTemplateColumns:'1.1fr.9fr', gap:60, alignItems:'center' }}>
    <div>
     <Chip label="New · IELTS prep mode" accent={T.brand} bg={T.brandLight} icon={Icon.spark({ width:11, height:11 })} style={{ marginBottom:24 }}/>
     <h1 style={{ fontFamily:T.serif, fontSize:76, lineHeight:1.02, color:T.ink, margin:0, marginBottom:14, letterSpacing:'-.01em', textWrap:'balance' }}>
      Speak it. <em style={{ fontStyle:'italic', color:T.brand }}>Score it.</em> Own it.
     </h1>
     <div style={{ fontFamily:T.serif, fontSize:22, fontStyle:'italic', color:T.ink3, lineHeight:1.4, marginBottom:22, letterSpacing:'-.005em' }}>The fastest path to fluent — across 26 languages.</div>
     <p style={{ fontSize:19, color:T.ink2, lineHeight:1.5, marginBottom:32, maxWidth:520, textWrap:'pretty' }}>
      Fluentra is a calmer way to learn — daily 15-minute lessons that move with your real life. Speaking, writing, listening, reading — and the AI tutor that follows up on whatever you got wrong.
     </p>
     <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:36 }}>
      <Btn label="Start free — 7 days" nav="auth_signup" accent={T.brand} size="lg" iconRight={Icon.arrow()}/>
      <Btn label="Watch the 90-second tour" nav="dashboard" variant="ghost" accent={T.ink2} size="lg" icon={Icon.play({ width:12, height:12 })}/>
     </div>
     <div style={{ display:'flex', alignItems:'center', gap:20, fontSize:12, color:T.ink3 }}>
      <div style={{ display:'flex', alignItems:'center' }}>
       {['#FFE5DE','#FFEAC2','#E2F5E9','#EEEDFF','#FFE0EC'].map((c,i)=>(
        <div key={i} style={{ width:30, height:30, borderRadius:15, background:c, border:'2px solid #fff', marginLeft: i?-10:0, fontSize:12, fontWeight:700, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif }}>{['M','J','S','A','L'][i]}</div>
       ))}
      </div>
      <div>
       <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:2 }}>26 languages, four skills</div>
       <div style={{ fontSize:11.5, color:T.ink3 }}>Reading · listening · speaking · writing</div>
      </div>
     </div>
    </div>

    {/* Product peek — angled phone + floating bits */}
    <div style={{ position:'relative', height:560 }}>
     {/* Floating accent shapes */}
     <div style={{ position:'absolute', top:30, left:-30, width:160, height:160, borderRadius:80, background:`linear-gradient(135deg, ${T.es.accentLight}, ${T.es.bg})`, filter:'blur(8px)', opacity:.6 }}/>
     <div style={{ position:'absolute', bottom:60, right:-20, width:120, height:120, borderRadius:60, background:`linear-gradient(135deg, ${T.fr.accentLight}, ${T.fr.bg})`, filter:'blur(6px)', opacity:.55 }}/>

     {/* Phone mock — stylized */}
     <div style={{ position:'absolute', top:0, left:60, width:300, height:540, background:'#0E0D0B', borderRadius:42, padding:6, boxShadow:'0 30px 80px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.05)', transform:'rotate(-3deg)' }}>
      <div style={{ width:'100%', height:'100%', background:T.bg, borderRadius:36, overflow:'hidden', position:'relative', padding:'46px 18px 16px' }}>
       <div style={{ position:'absolute', top:8, left:'50%', transform:'translateX(-50%)', width:90, height:24, background:'#000', borderRadius:14 }}/>

       <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <Flag code="es" w={20} h={13}/>
        <div style={{ flex:1, fontSize:12, fontWeight:700, color:T.ink }}>Buenas tardes, María</div>
        <div style={{ display:'flex', alignItems:'center', gap:3, color:T.brand, fontSize:11, fontWeight:700 }}>
         {Icon.flame({ width:11, height:11 })} 14
        </div>
       </div>

       {/* Today's lesson card */}
       <div style={{ background:T.brandGrad, color:'#fff', borderRadius:16, padding:14, marginBottom:10 }}>
        <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', opacity:.8, marginBottom:6 }}>Today · 15 min</div>
        <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.1, marginBottom:10 }}>Ordering at a café</div>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
         <div style={{ height:3, background:'rgba(255,255,255,.3)', borderRadius:99, flex:1 }}>
          <div style={{ width:'45%', height:'100%', background:'#fff', borderRadius:99 }}/>
         </div>
         <div style={{ fontSize:10, fontWeight:700 }}>3/7</div>
        </div>
       </div>

       {[
        { ic:'mic', t:'Speak with the tutor', s:'Roleplay · 8 min', c:T.speaking },
        { ic:'head', t:'Listening drill', s:'Café audio · 6 min', c:T.listening },
        { ic:'pen', t:'Writing prompt', s:'Restaurant review', c:T.writing },
       ].map((r,i) => (
        <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:'10px 12px', marginBottom:6, display:'flex', alignItems:'center', gap:10 }}>
         <div style={{ width:30, height:30, borderRadius:8, background:r.c.bg, color:r.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[r.ic]({ width:13, height:13 })}</div>
         <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:11.5, fontWeight:700, color:T.ink }}>{r.t}</div>
          <div style={{ fontSize:9.5, color:T.ink4, marginTop:1 }}>{r.s}</div>
         </div>
         {Icon.chev({ width:12, height:12, stroke:T.ink5 })}
        </div>
       ))}
      </div>
     </div>

     {/* Streak chip */}
     <div style={{ position:'absolute', top:90, right:0, background:T.card, borderRadius:14, padding:'12px 14px', boxShadow:'0 14px 36px rgba(0,0,0,.10)', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:10, transform:'rotate(4deg)' }}>
      <div style={{ width:32, height:32, borderRadius:10, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.flame({ width:16, height:16 })}</div>
      <div>
       <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase' }}>Streak</div>
       <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>14 days</div>
      </div>
     </div>

     {/* Tutor reply chip */}
     <div style={{ position:'absolute', bottom:80, right:-10, background:T.card, borderRadius:14, padding:'11px 13px', boxShadow:'0 14px 36px rgba(0,0,0,.10)', border:`1px solid ${T.border}`, maxWidth:240, transform:'rotate(-2deg)' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
       <div style={{ width:22, height:22, borderRadius:11, background:T.speaking.bg, color:T.speaking.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({ width:11, height:11 })}</div>
       <div style={{ fontSize:11, fontWeight:700, color:T.ink }}>AI tutor</div>
      </div>
      <div style={{ fontSize:11.5, color:T.ink2, lineHeight:1.4 }}>Try <span style={{ background:T.brandLight, color:T.brand, padding:'1px 5px', borderRadius:4, fontWeight:700 }}>"me trae"</span> instead — sounds more natural.</div>
     </div>
    </div>
   </div>

   {/* Logos / press */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'24px 32px 60px' }}>
    <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase', textAlign:'center', marginBottom:24 }}>Trusted by learners preparing for</div>
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-around', gap:36, opacity:.7, fontFamily:T.serif, fontSize:24, color:T.ink3 }}>
     {['IELTS','TOEFL','DELE','DELF','JLPT','Goethe-Zertifikat'].map(l => <div key={l} style={{ letterSpacing:'-.01em' }}>{l}</div>)}
    </div>
   </div>

   {/* HOW IT WORKS — 3 column */}
   <div style={{ background:T.card, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:'80px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:56 }}>
      <Chip label="The method" accent={T.ink2} bg={T.bg2} style={{ marginBottom:16 }}/>
      <h2 style={{ fontFamily:T.serif, fontSize:48, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>Four skills, one daily rhythm.</h2>
      <p style={{ fontSize:16, color:T.ink3, maxWidth:600, margin:'0 auto', lineHeight:1.5 }}>Built around the four skills real exams test — but used together, the way you'd actually use a language at a café in Madrid or a hostel in Tokyo.</p>
     </div>

     <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
      {[
       { ic:'mic', c:T.speaking, t:'Speak with the tutor', d:'Real-time roleplays. She prompts, corrects, and teaches you to repair your own mistakes.' },
       { ic:'pen', c:T.writing,  t:'Write & get notes', d:'Submit a paragraph, get back rewritten lines with the why behind each change.' },
       { ic:'head', c:T.listening, t:'Listen in the wild', d:'Real podcasts and announcements with adaptive playback speed.' },
       { ic:'book', c:T.reading,  t:'Read what natives read', d:'News, recipes, short fiction — with tap-to-translate that doesn\'t kill flow.' },
      ].map(s => (
       <div key={s.t} style={{ padding:24, background:T.bg, borderRadius:16, border:`1px solid ${T.border}` }}>
        <div style={{ width:44, height:44, borderRadius:12, background:s.c.bg, color:s.c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18 }}>{Icon[s.ic]({ width:18, height:18 })}</div>
        <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1, marginBottom:8 }}>{s.t}</div>
        <div style={{ fontSize:13, color:T.ink3, lineHeight:1.5 }}>{s.d}</div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* FEATURE STRIP — alternating */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'90px 32px' }}>
    {[
     {
      eyebrow:'AI tutor',
      title:'A tutor who remembers everything you got wrong.',
      body:'The tutor notices you keep mixing up <em>ser</em> and <em>estar</em>, then weaves it into tomorrow\'s café roleplay. Spaced, contextual, never a flashcard avalanche.',
      accent:T.speaking, mock:'tutor'
     },
     {
      eyebrow:'Exam prep',
      title:'Pass IELTS, DELE, JLPT — the same way you live the language.',
      body:'Full-length mock exams scored band-by-band, with personalized weak-spot drills built from your last attempt.',
      accent:T.reading, mock:'exam'
     },
     {
      eyebrow:'Spaced vocab',
      title:'Fewer cards. Better recall.',
      body:'A modern spacing engine that flexes to your sleep, your pace, and which words you actually use in conversation.',
      accent:T.writing, mock:'vocab'
     },
    ].map((f,i) => (
     <div key={i} style={{ display:'grid', gridTemplateColumns: i%2 ? '.9fr 1.1fr' : '1.1fr.9fr', gap:60, alignItems:'center', padding:'40px 0', borderBottom: i<2 ? `1px solid ${T.border}` : 'none' }}>
      <div style={{ order: i%2 ? 2 : 1 }}>
       <div style={{ fontSize:11, fontWeight:700, color:f.accent.c, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:12 }}>{f.eyebrow}</div>
       <h3 style={{ fontFamily:T.serif, fontSize:40, color:T.ink, lineHeight:1.05, margin:0, marginBottom:18, letterSpacing:'-.01em', textWrap:'balance' }}>{f.title}</h3>
       <p style={{ fontSize:15.5, color:T.ink3, lineHeight:1.55, marginBottom:20 }} dangerouslySetInnerHTML={{ __html: f.body }}/>
       <Btn label="See it in action" nav="dashboard" variant="outline" accent={T.ink} iconRight={Icon.arrow()}/>
      </div>
      <div style={{ order: i%2 ? 1 : 2, height:340, background:`linear-gradient(135deg, ${f.accent.bg}, ${T.bg})`, borderRadius:18, border:`1px solid ${T.border}`, padding:30, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
       {/* Decorative dot grid */}
       <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:14, opacity:.08, padding:20 }}>
        {Array.from({ length:140 }).map((_,j) => <div key={j} style={{ width:3, height:3, borderRadius:2, background:f.accent.c }}/>)}
       </div>
       {/* Mock content per feature */}
       {f.mock === 'tutor' && (
        <div style={{ width:'90%', maxWidth:380, position:'relative' }}>
         <div style={{ background:T.card, borderRadius:14, padding:14, boxShadow:'0 10px 30px rgba(0,0,0,.06)', border:`1px solid ${T.border}`, marginBottom:10 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>You said</div>
          <div style={{ fontSize:14, color:T.ink2, fontStyle:'italic' }}>"Yo <span style={{ textDecoration:'line-through', color:T.ink5 }}>soy</span> cansado hoy."</div>
         </div>
         <div style={{ background:f.accent.bg, borderRadius:14, padding:14, border:`1px solid ${f.accent.c}33` }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
           <div style={{ width:22, height:22, borderRadius:11, background:f.accent.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({ width:11, height:11 })}</div>
           <div style={{ fontSize:11.5, fontWeight:700, color:T.ink }}></div>
          </div>
          <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.45 }}>Use <strong style={{ color:f.accent.c }}>estoy</strong> for temporary states. <em>Ser</em> is for permanent traits.</div>
         </div>
        </div>
       )}
       {f.mock === 'exam' && (
        <div style={{ width:'90%', maxWidth:380 }}>
         <div style={{ background:T.card, borderRadius:14, padding:18, boxShadow:'0 10px 30px rgba(0,0,0,.06)', border:`1px solid ${T.border}` }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>IELTS · Mock 03</div>
          <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1, marginBottom:14 }}>Band <span style={{ color:f.accent.c }}>7.5</span></div>
          {[
           { l:'Reading',  v:8.0 },
           { l:'Listening', v:7.5 },
           { l:'Writing',  v:7.0 },
           { l:'Speaking', v:7.5 },
          ].map(b => (
           <div key={b.l} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
            <div style={{ fontSize:11.5, color:T.ink3, width:70 }}>{b.l}</div>
            <div style={{ flex:1, height:5, background:T.trackWarm, borderRadius:3, overflow:'hidden' }}>
             <div style={{ width:`${(b.v/9)*100}%`, height:'100%', background:f.accent.c, borderRadius:3 }}/>
            </div>
            <div style={{ fontSize:11.5, fontWeight:700, color:T.ink, width:24, textAlign:'right' }}>{b.v}</div>
           </div>
          ))}
         </div>
        </div>
       )}
       {f.mock === 'vocab' && (
        <div style={{ width:'88%', maxWidth:340, position:'relative', height:220 }}>
         <div style={{ position:'absolute', inset:0, transform:'translate(8px,8px) rotate(2deg)', background:T.card, borderRadius:16, border:`1px solid ${T.border}`, opacity:.5 }}/>
         <div style={{ position:'absolute', inset:0, transform:'translate(4px,4px) rotate(1deg)', background:T.card, borderRadius:16, border:`1px solid ${T.border}`, opacity:.8 }}/>
         <div style={{ position:'absolute', inset:0, background:T.card, borderRadius:16, border:`1px solid ${T.border}`, padding:20, boxShadow:'0 14px 36px rgba(0,0,0,.08)', display:'flex', flexDirection:'column' }}>
          <Chip label="noun · f." accent={f.accent.c} bg={`${f.accent.c}1f`} style={{ alignSelf:'flex-start', fontSize:10 }}/>
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
           <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, textAlign:'center' }}>la sobremesa</div>
          </div>
          <div style={{ display:'flex', gap:2 }}>
           {[1,2,3,4,5].map(n => <div key={n} style={{ flex:1, height:5, borderRadius:2, background: n<=3 ? f.accent.c : T.track }}/>)}
          </div>
         </div>
        </div>
       )}
      </div>
     </div>
    ))}
   </div>

   {/* TESTIMONIALS */}
   <div style={{ background:T.bg2, padding:'80px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:48 }}>
      <h2 style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.05, margin:0, marginBottom:10, letterSpacing:'-.01em' }}>Stories from learners.</h2>
      <p style={{ fontSize:15, color:T.ink3 }}>Real timelines, real exam scores.</p>
     </div>
     <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20 }}>
      {[
       { name:'Sara K.', loc:'Berlin → Madrid', flag:'es', stars:5, body:'I\'d been "learning Spanish" for three years before this. Six months in I held a 40-minute conversation with my landlord. it never made me feel slow.', stat:'A2 → B2', time:'in 6 months' },
       { name:'Aki T.', loc:'Tokyo',      flag:'en', stars:5, body:'Got my IELTS band 8 on the first try. The mock exams felt eerily close to the real thing — and the speaking practice took the nerves out.', stat:'IELTS 8.0', time:'first attempt' },
       { name:'Luca M.', loc:'Milan → Lyon',   flag:'fr', stars:5, body:'I tried Duolingo, Babbel, italki. Fluentra was the first one that respected my time. 15 minutes a day, no streak guilt-tripping, real results.', stat:'A1 → B1', time:'in 4 months' },
      ].map(t => (
       <div key={t.name} style={{ background:T.card, borderRadius:18, padding:28, border:`1px solid ${T.border}` }}>
        <div style={{ display:'flex', gap:1, color:T.brand, marginBottom:14 }}>
         {Array.from({ length:t.stars }).map((_,i) => Icon.star({ key:i, width:13, height:13, fill:'currentColor' }))}
        </div>
        <div style={{ fontSize:15, color:T.ink2, lineHeight:1.55, marginBottom:20, textWrap:'pretty' }}>"{t.body}"</div>
        <div style={{ display:'flex', alignItems:'center', gap:12, paddingTop:18, borderTop:`1px solid ${T.hairline}` }}>
         <div style={{ width:38, height:38, borderRadius:19, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:16 }}>{t.name[0]}</div>
         <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{t.name}</div>
          <div style={{ fontSize:11, color:T.ink4, display:'flex', alignItems:'center', gap:6 }}>{t.loc} <Flag code={t.flag} w={14} h={9}/></div>
         </div>
         <div style={{ textAlign:'right' }}>
          <div style={{ fontFamily:T.serif, fontSize:18, color:T.brand, lineHeight:1 }}>{t.stat}</div>
          <div style={{ fontSize:10, color:T.ink4, marginTop:2 }}>{t.time}</div>
         </div>
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* STAT BAND — big numbers */}
   <div style={{ background:T.ink, color:'#fff', padding:'70px 32px', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 15% 100%, rgba(217,119,87,.20) 0%, transparent 50%), radial-gradient(circle at 85% 0%, rgba(124,91,214,.16) 0%, transparent 50%)' }}/>
    <div style={{ position:'absolute', inset:0, opacity:.05, backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'22px 22px' }}/>
    <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24 }}>
     {[
      { v:'26',  l:'languages',          s:'and growing' },
      { v:'4',   l:'core skills',        s:'reading · listening · speaking · writing' },
      { v:'6+',  l:'exam formats',       s:'IELTS · DELE · JLPT · DELF · TOEFL · TOPIK' },
      { v:'AI',  l:'tutor & feedback',   s:'instant and personalised' },
     ].map(s => (
      <div key={s.l} style={{ paddingRight:24, borderRight:'1px solid rgba(255,255,255,.1)' }}>
       <div style={{ fontFamily:T.serif, fontSize:64, lineHeight:1, color:'#fff', letterSpacing:'-.02em', marginBottom:10 }}>{s.v}</div>
       <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:4 }}>{s.l}</div>
       <div style={{ fontSize:12, color:'rgba(255,255,255,.55)' }}>{s.s}</div>
      </div>
     ))}
    </div>
   </div>

   {/* SCIENCE / RESEARCH */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'90px 32px' }}>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:60, alignItems:'center' }}>
     <div>
      <Chip label="The science" accent={T.ink2} bg={T.bg2} style={{ marginBottom:18 }}/>
      <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:18, letterSpacing:'-.01em' }}>Built with linguists, not just engineers.</h2>
      <p style={{ fontSize:15.5, color:T.ink3, lineHeight:1.6, marginBottom:26 }}>Our methodology is peer-reviewed and tested across four universities. We publish what works — and what doesn't.</p>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
       {[
        { v:'42 papers', l:'cited in our model',      d:'From CEFR research to spaced-repetition trials' },
        { v:'4 unis',  l:'co-developing with us',     d:'Cambridge · Stanford · Imperial · Tokyo U' },
        { v:'18 mos',  l:'avg. dev cycle per language',  d:'Native review + cultural calibration' },
       ].map(p => (
        <div key={p.v} style={{ display:'flex', gap:18, padding:'14px 0', borderTop:`1px solid ${T.hairline}` }}>
         <div style={{ fontFamily:T.serif, fontSize:24, color:T.brand, width:110, flexShrink:0, letterSpacing:'-.01em' }}>{p.v}</div>
         <div>
          <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:3 }}>{p.l}</div>
          <div style={{ fontSize:12.5, color:T.ink4, lineHeight:1.5 }}>{p.d}</div>
         </div>
        </div>
       ))}
      </div>
     </div>
     <div style={{ background:'linear-gradient(135deg,#A6486B 0%,#D26890 100%)', borderRadius:20, padding:'40px 36px', color:'#fff', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, opacity:.07, backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'18px 18px' }}/>
      <div style={{ position:'relative' }}>
       <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.16em', color:'rgba(255,255,255,.7)', marginBottom:14 }}>PRONUNCIATION TRAINER</div>
       <div style={{ fontFamily:T.serif, fontSize:34, lineHeight:1.05, letterSpacing:'-.015em', marginBottom:14 }}>Real-time accent feedback, syllable by syllable.</div>
       <div style={{ fontSize:14, color:'rgba(255,255,255,.85)', lineHeight:1.55, marginBottom:24 }}>Speak a word. We score every phoneme, highlight the ones to fix, and show you the mouth shape.</div>
       <div style={{ display:'flex', gap:5, padding:'18px 18px', background:'rgba(255,255,255,.12)', backdropFilter:'blur(10px)', borderRadius:14, alignItems:'flex-end', height:90, marginBottom:14 }}>
        {[40,60,90,55,75,30,80,45,65,85,35,70,90,50,42,72,38,80,60,55,90,48,72,38,60].map((h,i)=>(
         <div key={i} style={{ flex:1, background:'#fff', borderRadius:2, height:`${h}%`, opacity: 0.4 + (h/200) }}/>
        ))}
       </div>
       <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'rgba(255,255,255,.85)' }}>
        <span>"par-don, ¿pue-de re-pe-tir?"</span>
        <span style={{ fontWeight:700, fontSize:14 }}>92%</span>
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* 90-DAY JOURNEY */}
   <div style={{ background:T.bg2, padding:'90px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:54 }}>
      <Chip label="Your first 90 days" accent={T.ink2} bg={T.card} style={{ marginBottom:16 }}/>
      <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>From "hola" to a real conversation.</h2>
      <p style={{ fontSize:15, color:T.ink3, maxWidth:560, margin:'0 auto', lineHeight:1.5 }}>The same arc, language after language. Here's what most learners hit, and when.</p>
     </div>
     <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:14 }}>
      {[
       { d:'Day 1', t:'Place yourself', s:'A1–C1 quiz, 5 min',             c:T.brand },
       { d:'Day 7', t:'First tutor call',  s:'A 3-minute voice chat',           c:'#7C5BD6' },
       { d:'Day 14', t:'Streak shielded', s:'14-day streak locked',           c:'#5A9C7A' },
       { d:'Day 30', t:'Native podcast',  s:'Understand it end-to-end',         c:'#E08F4D' },
       { d:'Day 60', t:'First essay',   s:'200 words, AI feedback in 30s',       c:'#A6486B' },
       { d:'Day 90', t:'Mock exam',    s:'See where you\'d land',           c:'#2A6FA0' },
      ].map(m => (
       <div key={m.d} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'20px 16px' }}>
        <div style={{ width:46, height:46, borderRadius:23, background:m.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13, fontWeight:700, marginBottom:14 }}>{m.d.replace('Day ','')}</div>
        <div style={{ fontSize:10, fontWeight:800, color:m.c, letterSpacing:'.1em', marginBottom:5 }}>{m.d.toUpperCase()}</div>
        <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.15, letterSpacing:'-.01em', marginBottom:6 }}>{m.t}</div>
        <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.5 }}>{m.s}</div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* DIALECT MAP */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'90px 32px' }}>
    <div style={{ textAlign:'center', marginBottom:48 }}>
     <Chip label="Regional · dialect coverage" accent={T.ink2} bg={T.bg2} style={{ marginBottom:16 }}/>
     <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>The version that matches where you're going.</h2>
     <p style={{ fontSize:15, color:T.ink3, maxWidth:560, margin:'0 auto', lineHeight:1.5 }}>We don't lump every Spanish-speaker together. Pick your dialect — pronunciation, idioms, and tutor accent follow.</p>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
     {[
      {l:'Spanish',  ds:['Castilian','Mexican','Rioplatense','Caribbean','Andean']},
      {l:'English',  ds:['American','British','Australian','Indian','Canadian']},
      {l:'Arabic',  ds:['MSA','Egyptian','Levantine','Gulf','Maghrebi']},
      {l:'Mandarin', ds:['Mainland','Taiwanese','Cantonese cross-train']},
      {l:'Portuguese',ds:['European','Brazilian']},
      {l:'French',  ds:['Metropolitan','Québécois','West African']},
     ].map(g => (
      <div key={g.l} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:22 }}>
       <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:12, letterSpacing:'-.01em' }}>{g.l}</div>
       <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
        {g.ds.map(d => <span key={d} style={{ padding:'5px 10px', background:T.bg2, borderRadius:99, fontSize:11.5, color:T.ink2, fontWeight:600, border:`1px solid ${T.hairline}` }}>{d}</span>)}
       </div>
      </div>
     ))}
    </div>
   </div>

   {/* EXAM TRACKS */}
   <div style={{ background:T.card, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:'90px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:48 }}>
      <Chip label="Exam tracks" accent={T.brand} bg={T.brandLight} style={{ marginBottom:16 }}/>
      <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>Pass the test. Then pass for native.</h2>
     </div>
     <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
      {[
       {ex:'IELTS',   l:'English',  band:'7.5 avg', c:'#3D5BA8'},
       {ex:'TOEFL iBT', l:'English',  band:'105 avg', c:'#2A6FA0'},
       {ex:'JLPT N3–N1',l:'Japanese',  band:'92% pass', c:'#A6486B'},
       {ex:'DELE B2/C1',l:'Spanish',  band:'95% pass', c:'#D97757'},
       {ex:'DELF/DALF', l:'French',   band:'89% pass', c:'#7C5BD6'},
       {ex:'HSK 4–6',  l:'Mandarin',  band:'93% pass', c:'#5A9C7A'},
       {ex:'Goethe B1+',l:'German',   band:'91% pass', c:'#1F8A5B'},
       {ex:'TOPIK II', l:'Korean',   band:'88% pass', c:'#E08F4D'},
      ].map(x=>(
       <div key={x.ex} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 16px', background:T.bg, border:`1px solid ${T.border}`, borderRadius:12 }}>
        <div style={{ width:6, height:42, borderRadius:3, background:x.c, flexShrink:0 }}/>
        <div style={{ flex:1, minWidth:0 }}>
         <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{x.ex}</div>
         <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>{x.l}</div>
        </div>
        <div style={{ fontFamily:T.serif, fontSize:16, color:x.c, letterSpacing:'-.01em' }}>{x.band}</div>
       </div>
      ))}
     </div>
     <div style={{ textAlign:'center', marginTop:24, fontSize:13, color:T.ink4 }}>+ 12 more — TOPIK I, CELPIP, OPIc, BULATS and more.</div>
    </div>
   </div>

   {/* CONTENT LIBRARY */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'90px 32px' }}>
    <div style={{ textAlign:'center', marginBottom:48 }}>
     <Chip label="A library that grows with you" accent={T.ink2} bg={T.bg2} style={{ marginBottom:16 }}/>
     <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>Real native content. Updated weekly.</h2>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:14, marginBottom:30 }}>
     {[
      {v:'AI',l:'generated lessons & articles'},
      {v:'1,800+',l:'native podcasts'},
      {v:'900+', l:'short films'},
      {v:'6,400+',l:'songs with lyrics'},
      {v:'2,700+',l:'short stories'},
      {v:'30+',  l:'live classes/wk'},
     ].map(s=>(
      <div key={s.l} style={{ padding:'22px 18px', background:T.card, border:`1px solid ${T.border}`, borderRadius:14, textAlign:'center' }}>
       <div style={{ fontFamily:T.serif, fontSize:30, color:T.brand, lineHeight:1, letterSpacing:'-.01em' }}>{s.v}</div>
       <div style={{ fontSize:12, color:T.ink3, marginTop:8 }}>{s.l}</div>
      </div>
     ))}
    </div>
   </div>

   {/* GAMIFICATION */}
   <div style={{ background:T.bg2, padding:'90px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto' }}>
     <div style={{ textAlign:'center', marginBottom:48 }}>
      <Chip label="The fun part" accent={T.brand} bg={T.brandLight} style={{ marginBottom:16 }}/>
      <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>Streaks, shields, and a community that shows up.</h2>
     </div>
     <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16 }}>
      {[
       {em:'🔥', t:'Streaks',     d:'Lose nothing on weekly rest days. The streak respects your life.'},
       {em:'🛡️', t:'Streak shields',  d:'Sick? Travelling? Up to 5 shields per month, no questions asked.'},
       {em:'⭐', t:'XP & levels',    d:'Level up by doing what you love — speaking, reading, listening.'},
       {em:'🏅', t:'48 unique badges', d:'For consistency, range, and depth. Some are very hard.'},
       {em:'👥', t:'Streak buddies',  d:'Match in 30s. Hold each other accountable, in any timezone.'},
       {em:'🏆', t:'Leaderboards',   d:'Friends · region · global. Filter by language and level.'},
      ].map(g=>(
       <div key={g.t} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:26 }}>
        <div style={{ fontSize:32, marginBottom:14 }}>{g.em}</div>
        <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1, marginBottom:8, letterSpacing:'-.01em' }}>{g.t}</div>
        <div style={{ fontSize:13, color:T.ink3, lineHeight:1.5 }}>{g.d}</div>
       </div>
      ))}
     </div>
     <div style={{ marginTop:30, padding:'18px 24px', background:'#FFF8EE', border:'1px dashed #F4D58A', borderRadius:14, textAlign:'center', fontSize:14, color:T.ink2 }}>
      <b style={{ color:T.ink }}>The longest streak on Fluentra is 3,420 days</b> — held by Ines from Lisbon, learning Mandarin since launch.
     </div>
    </div>
   </div>

   {/* MORE TESTIMONIALS */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'90px 32px' }}>
    <div style={{ textAlign:'center', marginBottom:48 }}>
     <Chip label="More learners" accent={T.ink2} bg={T.bg2} style={{ marginBottom:16 }}/>
     <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>Different starting points. Same arrival.</h2>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:18 }}>
     {[
      {q:'I quit Babbel and Duolingo for this. The AI tutor closes the gap.',           n:'Henrik J.', m:'Researcher · Stockholm',   g:'linear-gradient(135deg,#1F8A5B,#3D8A5F)'},
      {q:'Reading novels in French at 4 months in. Fluentra unlocked the part everyone says is hardest.', n:'Naomi T.', m:'Author · Oakland',      g:'linear-gradient(135deg,#7C5BD6,#A6486B)'},
      {q:'Started learning Mandarin at 56. The tutor never gets impatient. That\'s rare in any teacher.',   n:'Alan G.',  m:'Retired · Brighton',     g:'linear-gradient(135deg,#E08F4D,#D26890)'},
      {q:'My JLPT N2 went from a dream to "next December" thanks to the structured exam track.',    n:'Riko O.',  m:'Translator · Osaka',     g:'linear-gradient(135deg,#3D5BA8,#7C5BD6)'},
      {q:'Free tier is genuinely useful. I\'ve been on it 4 months before upgrading.',         n:'Mike K.',  m:'Student · Toronto',      g:'linear-gradient(135deg,#2A6FA0,#5A9C7A)'},
      {q:'I run Spanish stand-up shows now. Six months ago I couldn\'t order coffee.',         n:'Priya R.', m:'Comedian · London',      g:'linear-gradient(135deg,#A6486B,#D97757)'},
     ].map((t,i)=>(
      <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:26 }}>
       <div style={{ display:'flex', gap:1, marginBottom:12 }}>{[1,2,3,4,5].map(s => <span key={s} style={{ color:'#E0A23A', fontSize:13 }}>★</span>)}</div>
       <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:16, color:T.ink, lineHeight:1.45, marginBottom:18 }}>"{t.q}"</div>
       <div style={{ display:'flex', alignItems:'center', gap:11, paddingTop:14, borderTop:`1px solid ${T.hairline}` }}>
        <div style={{ width:34, height:34, borderRadius:17, background:t.g, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14 }}>{t.n[0]}</div>
        <div>
         <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{t.n}</div>
         <div style={{ fontSize:11.5, color:T.ink4 }}>{t.m}</div>
        </div>
       </div>
      </div>
     ))}
    </div>
   </div>

   {/* FOR TEAMS */}
   <div style={{ background:T.bg2, padding:'90px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:60, alignItems:'center' }}>
     <div>
      <Chip label="For teams · classrooms · enterprise" accent={T.ink2} bg={T.card} style={{ marginBottom:18 }}/>
      <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:18, letterSpacing:'-.01em' }}>Bring Fluentra to your team or classroom.</h2>
      <p style={{ fontSize:15.5, color:T.ink3, lineHeight:1.6, marginBottom:26 }}>Plans for schools and teams — roster management, shared progress, and custom curricula. Get in touch to set up your organisation.</p>
      <Btn label="Talk to our team" nav="dashboard" accent={T.ink} size="lg" iconRight={Icon.arrow()}/>
     </div>
     <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
      {[
       {n:'Languages',  m:'26'},
       {n:'Modules',   m:'4'},
       {n:'AI tutor',  m:'24/7'},
       {n:'Exam prep',  m:'Yes'},
      ].map(o=>(
       <div key={o.n} style={{ padding:'28px 24px', background:T.card, border:`1px solid ${T.border}`, borderRadius:16 }}>
        <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{o.m}</div>
        <div style={{ fontSize:11, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:10, textTransform:'uppercase' }}>{o.n}</div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* PRESS QUOTES */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'90px 32px' }}>
    <div style={{ textAlign:'center', marginBottom:48 }}>
     <Chip label="The press" accent={T.ink2} bg={T.bg2} style={{ marginBottom:16 }}/>
     <h2 style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>What the press is saying.</h2>
    </div>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:18 }}>
     {[
      {q:'Closes the gap between flashcards and a real conversation.', s:'WIRED'},
      {q:'A linguist and an engineer walk into an app — out comes Fluentra.', s:'TIME'},
      {q:'It feels less like homework and more like meeting a friend.', s:'BBC FUTURE'},
      {q:'The bar for AI-led education has been raised, and the bar is here.', s:'TECHCRUNCH'},
     ].map((p,i)=>(
      <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'32px 36px' }}>
       <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:22, color:T.ink, lineHeight:1.35, marginBottom:18, letterSpacing:'-.005em' }}>"{p.q}"</div>
       <div style={{ fontSize:11, fontWeight:800, color:T.ink4, letterSpacing:'.16em' }}>— {p.s}</div>
      </div>
     ))}
    </div>
   </div>

   {/* PRICING SUMMARY */}
   <div style={{ maxWidth:1200, margin:'0 auto', padding:'30px 32px 90px' }}>
    <div style={{ background:T.brandGrad, borderRadius:24, padding:'56px', color:'#fff', position:'relative', overflow:'hidden', textAlign:'center' }}>
     <div style={{ position:'absolute', inset:0, opacity:.07, backgroundImage:'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize:'22px 22px' }}/>
     <div style={{ position:'relative', maxWidth:640, margin:'0 auto' }}>
      <div style={{ fontSize:11.5, fontWeight:800, letterSpacing:'.18em', color:'rgba(255,255,255,.7)', marginBottom:14 }}>LESS THAN A COFFEE</div>
      <h2 style={{ fontFamily:T.serif, fontSize:54, lineHeight:1.05, letterSpacing:'-.015em', margin:0, marginBottom:16 }}>$19/mo for 26 languages.</h2>
      <p style={{ fontSize:15.5, color:'rgba(255,255,255,.85)', lineHeight:1.6, marginBottom:28 }}>$19/mo billed yearly, or $24/mo on monthly. 7-day free trial. Cancel any time.</p>
      <Btn label="See all plans" nav="pricing" accent="#fff" size="lg" iconRight={Icon.arrow()} style={{ color:T.brand }}/>
     </div>
    </div>
   </div>

   {/* FAQ teaser + CTA */}
   <div style={{ maxWidth:1100, margin:'0 auto', padding:'90px 32px 70px' }}>
    <div style={{ background:T.brandGrad, borderRadius:24, padding:'56px 56px', display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:40, alignItems:'center', position:'relative', overflow:'hidden' }}>
     <div style={{ position:'absolute', top:-50, right:-50, width:280, height:280, borderRadius:140, border:'14px solid rgba(255,255,255,.08)' }}/>
     <div style={{ position:'absolute', bottom:-80, right:60, width:200, height:200, borderRadius:100, border:'10px solid rgba(255,255,255,.06)' }}/>
     <div style={{ color:'#fff', position:'relative' }}>
      <h2 style={{ fontFamily:T.serif, fontSize:46, lineHeight:1.05, margin:0, marginBottom:14, letterSpacing:'-.01em' }}>Speak it. Score it. <em style={{ fontStyle:'italic', color:'rgba(255,255,255,.7)' }}>Own it.</em></h2>
      <p style={{ fontSize:15.5, opacity:.92, lineHeight:1.5, marginBottom:24 }}>7 days free, full access to all 26 languages and the AI tutor. Cancel any time — no card needed for trial.</p>
      <div style={{ display:'flex', gap:10 }}>
       <Btn label="Start free" nav="auth_signup" accent="#fff" size="lg" iconRight={Icon.arrow()} style={{ color:T.brand }}/>
       <Btn label="Compare plans" nav="pricing" variant="ghost" accent="#fff" size="lg"/>
      </div>
     </div>
     <div style={{ position:'relative', display:'flex', flexDirection:'column', gap:12 }}>
      {[
       { ic:'check', t:'26 languages',    s:'major + heritage + niche' },
       { ic:'check', t:'AI tutor',    s:'unlimited conversations' },
       { ic:'check', t:'Mock exams + scoring', s:'IELTS · DELE · JLPT · DELF' },
       { ic:'check', t:'Cancel anytime',    s:'no questions asked' },
      ].map(r => (
       <div key={r.t} style={{ background:'rgba(255,255,255,.12)', backdropFilter:'blur(8px)', borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, border:'1px solid rgba(255,255,255,.18)' }}>
        <div style={{ width:26, height:26, borderRadius:13, background:'rgba(255,255,255,.2)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:13, height:13 })}</div>
        <div style={{ color:'#fff' }}>
         <div style={{ fontSize:13, fontWeight:700 }}>{r.t}</div>
         <div style={{ fontSize:11, opacity:.85, marginTop:1 }}>{r.s}</div>
        </div>
       </div>
      ))}
     </div>
    </div>
   </div>

   {/* Footer */}
   <div style={{ borderTop:`1px solid ${T.border}`, padding:'40px 32px 32px' }}>
    <div style={{ maxWidth:1200, margin:'0 auto', display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr', gap:32 }}>
     <div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
       <div style={{ width:26, height:26, borderRadius:7, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.brandmark({ width:15, height:15 })}</div>
       <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>Fluentra</div>
      </div>
      <div style={{ fontSize:12, color:T.ink4, lineHeight:1.5, maxWidth:240 }}>The calmer way to learn a language. Built in Lisbon.</div>
      <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.brand, marginTop:10, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
     </div>
     {[
      { t:'Product', items:['Languages','Pricing','For teachers','Gift','Mobile app'] },
      { t:'Method', items:['How it works','Research','Effectiveness','Tutor','Roadmap'] },
      { t:'Company', items:['About','Press','Careers','Contact','Manifesto'] },
      { t:'Legal',  items:['Privacy','Terms','Cookies','Refunds','Status'] },
     ].map(col => (
      <div key={col.t}>
       <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>{col.t}</div>
       <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {col.items.map(i => <a key={i} style={{ fontSize:12.5, color:T.ink2, cursor:'pointer' }}>{i}</a>)}
       </div>
      </div>
     ))}
    </div>
    <div style={{ maxWidth:1200, margin:'40px auto 0', paddingTop:20, borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11.5, color:T.ink4 }}>
     <div>© 2025 Fluentra. All rights reserved.</div>
     <div style={{ display:'flex', gap:16 }}>
      <span>EN</span><span>·</span><span>ES</span><span>·</span><span>FR</span><span>·</span><span>DE</span><span>·</span><span>JA</span>
     </div>
    </div>
   </div>
  </div>
 );
}

Object.assign(window, { MarketingPage });
