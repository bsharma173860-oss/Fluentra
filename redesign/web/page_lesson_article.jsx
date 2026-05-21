// ── Single lesson detail + Article reader ───────────────────

function LessonDetailPage() {
  const lesson = {
    title:'Past tenses in Spanish — telling stories',
    eyebrow:'Spanish · B1 · Lesson 7 of 10',
    duration:'18 min',
    parts:[
      { kind:'video',     label:'Watch overview',          duration:'3:24', state:'done' },
      { kind:'reading',   label:'Pretérito vs imperfecto', duration:'4 min', state:'done' },
      { kind:'practice',  label:'Drill · 12 questions',    duration:'6 min', state:'current' },
      { kind:'speaking',  label:'Roleplay with Lía',       duration:'5 min', state:'locked' },
    ],
  };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:0, minHeight:'100%' }}>
          {/* Main */}
          <div style={{ padding:'30px 40px 60px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{lesson.eyebrow}</div>
            <div style={{ fontFamily:T.serif, fontSize:38, color:T.ink, lineHeight:1.1, marginBottom:10 }}>{lesson.title}</div>
            <div style={{ fontSize:13, color:T.ink3, marginBottom:24 }}>{lesson.duration} · 4 parts · graded by Lía</div>

            {/* Video player */}
            <div style={{ aspectRatio:'16/9', background:T.ink, borderRadius:16, position:'relative', overflow:'hidden', marginBottom:24, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 30% 40%, ${T.brand}66, transparent 60%)` }}/>
              <button style={{ width:72, height:72, borderRadius:36, background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', color:T.ink, position:'relative' }}>{Icon.play({ width:24, height:24 })}</button>
              <div style={{ position:'absolute', bottom:14, left:18, right:18, display:'flex', alignItems:'center', gap:12, color:'#fff', fontSize:11.5 }}>
                <span>0:00</span>
                <div style={{ flex:1, height:3, borderRadius:2, background:'rgba(255,255,255,.2)', overflow:'hidden' }}><div style={{ width:'18%', height:'100%', background:T.brand }}/></div>
                <span>3:24</span>
              </div>
            </div>

            {/* Transcript */}
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'22px 26px' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Transcript</div>
                <div style={{ display:'flex', gap:6 }}>
                  <button style={{ padding:'4px 10px', fontSize:11, fontWeight:600, color:T.ink3, background:T.bg2, borderRadius:6 }}>EN</button>
                  <button style={{ padding:'4px 10px', fontSize:11, fontWeight:700, color:T.brand, background:T.brandLight, borderRadius:6 }}>ES</button>
                </div>
              </div>
              <div style={{ fontSize:14, color:T.ink2, lineHeight:1.7 }}>
                <span style={{ color:T.ink4, fontSize:11, marginRight:10 }}>0:04</span>Cuando era pequeña, <mark style={{ background:T.brandLight, color:T.brand, padding:'1px 3px' }}>vivía</mark> en un pueblo cerca del mar. Todos los veranos <mark style={{ background:T.brandLight, color:T.brand, padding:'1px 3px' }}>íbamos</mark> a la playa con mi familia.<br/><br/>
                <span style={{ color:T.ink4, fontSize:11, marginRight:10 }}>0:18</span>Un día, <mark style={{ background:T.listening.bg, color:T.listening.c, padding:'1px 3px' }}>conocí</mark> a una chica que <mark style={{ background:T.listening.bg, color:T.listening.c, padding:'1px 3px' }}>estaba</mark> sola en la arena. <mark style={{ background:T.listening.bg, color:T.listening.c, padding:'1px 3px' }}>Hablamos</mark> durante horas.
              </div>
              <div style={{ marginTop:18, paddingTop:14, borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:14, fontSize:11.5, color:T.ink4 }}>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:8, height:8, borderRadius:2, background:T.brand }}/>Imperfecto</span>
                <span style={{ display:'flex', alignItems:'center', gap:5 }}><span style={{ width:8, height:8, borderRadius:2, background:T.listening.c }}/>Indefinido</span>
              </div>
            </div>
          </div>

          {/* Sidebar — parts */}
          <div style={{ borderLeft:`1px solid ${T.border}`, background:T.bg2, padding:'30px 24px' }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Lesson parts</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:22 }}>
              {lesson.parts.map((p, i) => (
                <div key={i} style={{ background: p.state === 'current' ? T.card : 'transparent', border:`1px solid ${p.state === 'current' ? T.border : 'transparent'}`, borderRadius:11, padding:'12px 14px', display:'flex', alignItems:'center', gap:12, opacity: p.state === 'locked' ? .5 : 1 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background: p.state === 'done' ? T.listening.c : p.state === 'current' ? T.brand : T.border, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>
                    {p.state === 'done' ? Icon.check({ width:12, height:12 }) : p.state === 'locked' ? Icon.lock({ width:11, height:11 }) : i+1}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, lineHeight:1.2 }}>{p.label}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{p.duration}</div>
                  </div>
                  {p.state === 'current' && <div style={{ color:T.brand }}>{Icon.chev({ width:14, height:14 })}</div>}
                </div>
              ))}
            </div>
            <Btn label="Continue · Drill" nav="reading" accent={T.brand} fullWidth iconRight={Icon.arrow()}/>
            <button data-nav="course" style={{ marginTop:10, width:'100%', padding:10, fontSize:11.5, color:T.ink3, fontWeight:600, background:'transparent' }}>Course overview →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticlePage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', display:'flex', justifyContent:'center' }}>
        <div style={{ maxWidth:680, width:'100%', padding:'40px 36px 80px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Library · English · Reading</div>
          <h1 style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.1, marginBottom:14, fontWeight:400 }}>How English speakers actually use the past perfect (and when they skip it)</h1>
          <div style={{ fontSize:13, color:T.ink3, marginBottom:28, display:'flex', alignItems:'center', gap:10 }}>
            <span>Maria Echevarría</span><span>·</span><span>14 min read</span><span>·</span><span>B2 · 2,100 words</span>
          </div>

          <div style={{ display:'flex', gap:8, alignItems:'center', padding:'10px 14px', background:T.brandLight, borderRadius:11, marginBottom:28, fontSize:12.5, color:T.brand, fontWeight:600 }}>
            {Icon.spark({ width:14, height:14 })} Tap any word for instant translation. Long-press to save to your deck.
          </div>

          <p style={{ fontSize:17, color:T.ink, lineHeight:1.7, marginBottom:18 }}>If you've ever opened a grammar book and watched your eyes glaze over at <em style={{ color:T.brand, fontStyle:'italic', borderBottom:`1px dotted ${T.brand}` }}>past perfect</em>, you're not alone. The good news: most native speakers use it less often than textbooks suggest, and there's a cleaner mental model.</p>

          <p style={{ fontSize:17, color:T.ink, lineHeight:1.7, marginBottom:18 }}>The rule of thumb is simple — past perfect (<span style={{ background:T.brandLight, padding:'1px 5px', borderRadius:3, color:T.brand, fontWeight:600 }}>had + past participle</span>) marks an action that finished <em>before</em> another past action. It's a way of layering time. "When I arrived, she <strong>had already left</strong>" tells you the leaving came first.</p>

          {/* Pull quote */}
          <div style={{ borderLeft:`3px solid ${T.brand}`, padding:'4px 0 4px 18px', margin:'30px 0', fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.3, fontStyle:'italic' }}>"Native speakers drop past perfect whenever the order is already obvious. Books rarely tell you this."</div>

          <p style={{ fontSize:17, color:T.ink, lineHeight:1.7, marginBottom:18 }}>What grammar books rarely tell you: when the time order is already clear from context — or when "before" or "after" is in the sentence — natives often skip past perfect entirely. "Before I left, I <strong>locked</strong> the door" is fine. "Before I left, I <strong>had locked</strong> the door" is also fine, but it sounds bookish.</p>

          {/* Inline drill */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'22px 24px', margin:'28px 0' }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:12 }}>Quick check</div>
            <div style={{ fontSize:15.5, color:T.ink, lineHeight:1.5, marginBottom:14 }}>By the time the movie started, we _____ the popcorn.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[
                { l:'finished',         right:false },
                { l:'had finished',     right:true  },
                { l:'have finished',    right:false },
              ].map(o => (
                <button key={o.l} style={{ padding:'12px 14px', textAlign:'left', border:`1.5px solid ${T.border}`, borderRadius:10, fontSize:14, color:T.ink, background:T.bg, cursor:'pointer' }}>{o.l}</button>
              ))}
            </div>
          </div>

          <p style={{ fontSize:17, color:T.ink, lineHeight:1.7, marginBottom:32 }}>Once you trust the layer-of-time idea, past perfect stops feeling like a trick the language plays on you. It's just a stamp that says: this happened first.</p>

          {/* End controls */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 0', borderTop:`1px solid ${T.hairline}`, borderBottom:`1px solid ${T.hairline}` }}>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Save to library" nav="library" variant="outline" accent={T.ink} icon={Icon.bookmark()}/>
              <Btn label="Discuss with Lía" nav="tutor" variant="soft" accent={T.brand} icon={Icon.message()}/>
            </div>
            <div style={{ fontSize:12, color:T.ink4 }}>3 saved words from this article</div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LessonDetailPage, ArticlePage });
