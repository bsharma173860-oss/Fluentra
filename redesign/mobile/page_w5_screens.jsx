// ── Mobile · Wave 5b · Reader/Tutor/Exams/Social ───────────────────
// MArticleReader, MTutorCall, MTutorHistory, MExamBook, MExamHistory,
// MPublicProfile, MDMThread, MActivityFeed

// ── Article reader ─────────────────────────────────────────────────
function MArticleReaderPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [size, setSize] = React.useState(17);
  const [showToc, setShowToc] = React.useState(false);
  const [tappedWord, setTappedWord] = React.useState(null);

  const onTapWord = (w) => setTappedWord({ es: w, en: { 'café':'coffee', 'pueblo':'village','silencio':'silence','viejo':'old','calles':'streets','mañana':'morning' }[w.toLowerCase()] || '—' });

  const Word = ({ children }) => (
    <span onClick={()=>onTapWord(String(children))} style={{ cursor:'pointer', borderBottom:`1px dashed ${T.ink5}` }}>{children}</span>
  );

  return (
    <>
      {/* Custom header w/ progress */}
      <div style={{ padding:'4px 14px 10px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={()=>nav('library')} style={{ width:38, height:38, borderRadius:19, background:T.card, border:`1px solid ${MT.hairline}`, color:T.ink, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:MT.shadowSm }}>{Icon.arrowL()}</button>
          <div style={{ flex:1, padding:'8px 14px', background:T.card, borderRadius:99, border:`1px solid ${MT.hairline}`, boxShadow:MT.shadowSm }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:5 }}>
              <span>4 min read</span>
              <span>62%</span>
            </div>
            <div style={{ height:3, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
              <div style={{ width:'62%', height:'100%', background:T.brand, borderRadius:99 }}/>
            </div>
          </div>
          <button onClick={()=>setShowToc(!showToc)} style={{ width:38, height:38, borderRadius:19, background:T.card, border:`1px solid ${MT.hairline}`, color:T.ink2, fontSize:14, fontWeight:700, boxShadow:MT.shadowSm }}>Aa</button>
        </div>
      </div>

      <MobileBody padding={[0,22,40]} tabBarPad={false}>
        {/* Editorial masthead */}
        <div style={{ paddingTop:6, paddingBottom:18, borderBottom:`1px solid ${T.hairline}`, marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:14 }}>
            <Flag code="es" w={18} h={12} radius={2}/>
            <span style={{ fontSize:9.5, fontWeight:800, color:T.brand, letterSpacing:'.16em', textTransform:'uppercase' }}>FICCIÓN · B1</span>
            <span style={{ width:3, height:3, borderRadius:2, background:T.ink5 }}/>
            <span style={{ fontSize:11, color:T.ink4 }}>El País Semanal</span>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05, letterSpacing:'-.025em', marginBottom:10 }}>El silencio de los pueblos</div>
          <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.55, fontStyle:'italic', marginBottom:14 }}>Una mañana en un pueblo viejo, antes de que despierten las calles.</div>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:28, height:28, borderRadius:14, background:'#A06940', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>RM</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>Rocío Méndez</div>
              <div style={{ fontSize:10.5, color:T.ink4 }}>Apr 18 · 4 min read</div>
            </div>
            <button style={{ width:32, height:32, borderRadius:10, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.bookmark ? Icon.bookmark({ width:13, height:13 }) : '☆'}</button>
          </div>
        </div>

        {/* Drop-cap body */}
        <div style={{ fontFamily:T.serif, fontSize:size, color:T.ink, lineHeight:1.7, letterSpacing:'-.005em' }}>
          <p style={{ marginBottom:16, textIndent:0 }}>
            <span style={{ float:'left', fontFamily:T.serif, fontSize:size * 3.6, lineHeight:.85, color:T.brand, paddingRight:9, paddingTop:5 }}>E</span>
            l <Word>silencio</Word> de los <Word>pueblos</Word> al amanecer es distinto del de las ciudades. No es ausencia de ruido — es la tierra todavía respirando, las piedras enfriándose, los gallos ensayando antes del primer canto.
          </p>
          <p style={{ marginBottom:16 }}>Mi abuela decía que las <Word>calles</Word> conocen los pasos de quienes las recorren. Que cada pueblo <Word>viejo</Word> guarda el eco de sus difuntos en el barro y la cal. Yo no lo creía hasta una <Word>mañana</Word> de octubre, cuando bajé al horno por pan y oí, en el cruce de la fuente, una voz que no era de nadie.</p>

          {/* Pullquote */}
          <div style={{ margin:'24px -8px', padding:'18px 22px', borderLeft:`3px solid ${T.brand}`, background:T.bg2, borderRadius:'0 12px 12px 0' }}>
            <div style={{ fontFamily:T.serif, fontSize:18, fontStyle:'italic', color:T.ink2, lineHeight:1.45 }}>"Las calles conocen los pasos de quienes las recorren."</div>
          </div>

          <p style={{ marginBottom:16 }}>El <Word>café</Word> de Don Manuel todavía no había abierto, pero la luz del fluorescente parpadeaba detrás de la persiana. Pasé la mano por el muro encalado — frío, áspero, y por un instante creí que respondía.</p>
          <p style={{ marginBottom:16 }}>No conté esa historia a nadie durante años. Después comprendí: el pueblo no había hablado. Era yo, escuchando finalmente.</p>
        </div>

        {/* Reader actions */}
        <div style={{ marginTop:28, paddingTop:18, borderTop:`1px solid ${T.hairline}`, display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ fontSize:10, fontWeight:800, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase' }}>NEW WORDS · 6 SAVED</div>
          <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
            {['silencio','pueblos','calles','viejo','mañana','café'].map(w => (
              <span key={w} style={{ padding:'6px 10px', background:T.brandLight, color:T.brand, fontFamily:T.serif, fontSize:13, fontStyle:'italic', borderRadius:99, border:`1px solid ${T.brand}22` }}>{w}</span>
            ))}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:4 }}>
            <button style={{ padding:'12px', borderRadius:12, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:MT.shadowSm }}>{Icon.spark({ width:12, height:12 })} Quiz me</button>
            <button onClick={()=>nav('vocab')} style={{ padding:'12px', borderRadius:12, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 8px 22px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>Save to deck {Icon.arrow({ width:12, height:12 })}</button>
          </div>
        </div>
      </MobileBody>

      {/* Tap-word sheet */}
      {tappedWord && (
        <div onClick={()=>setTappedWord(null)} style={{ position:'absolute', inset:0, zIndex:90, background:'rgba(0,0,0,.32)', display:'flex', alignItems:'flex-end' }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:'100%', background:T.card, borderTopLeftRadius:24, borderTopRightRadius:24, padding:'18px 20px 28px', boxShadow:'0 -16px 40px rgba(0,0,0,.18)' }}>
            <div style={{ width:36, height:4, borderRadius:2, background:T.ink5, margin:'0 auto 14px' }}/>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:10 }}>
              <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, fontStyle:'italic', letterSpacing:'-.01em' }}>{tappedWord.es}</div>
              <button style={{ width:30, height:30, borderRadius:8, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.play({ width:11, height:11 })}</button>
            </div>
            <div style={{ fontSize:14, color:T.ink2, marginBottom:14 }}>{tappedWord.en}</div>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>setTappedWord(null)} style={{ flex:1, padding:'12px', borderRadius:11, background:T.bg2, color:T.ink, fontSize:13, fontWeight:700 }}>Dismiss</button>
              <button onClick={()=>setTappedWord(null)} style={{ flex:1.4, padding:'12px', borderRadius:11, background:T.brand, color:'#fff', fontSize:13, fontWeight:700 }}>+ Save to deck</button>
            </div>
          </div>
        </div>
      )}

      {/* Type sheet */}
      {showToc && (
        <div onClick={()=>setShowToc(false)} style={{ position:'absolute', inset:0, zIndex:80, background:'rgba(0,0,0,.32)', display:'flex', alignItems:'flex-end' }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:'100%', background:T.card, borderTopLeftRadius:24, borderTopRightRadius:24, padding:'18px 20px 28px' }}>
            <div style={{ width:36, height:4, borderRadius:2, background:T.ink5, margin:'0 auto 14px' }}/>
            <div style={{ fontSize:11, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', color:T.ink4, marginBottom:12 }}>Type size</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', background:T.bg2, borderRadius:12 }}>
              <button onClick={()=>setSize(Math.max(13, size-1))} style={{ width:34, height:34, borderRadius:10, background:T.card, color:T.ink, fontFamily:T.serif, fontSize:14, fontWeight:700 }}>A−</button>
              <div style={{ flex:1, height:4, background:T.ink5+'55', borderRadius:99, position:'relative' }}>
                <div style={{ position:'absolute', left:`${((size-13)/9)*100}%`, top:'50%', transform:'translate(-50%,-50%)', width:14, height:14, borderRadius:7, background:T.brand }}/>
              </div>
              <button onClick={()=>setSize(Math.min(22, size+1))} style={{ width:34, height:34, borderRadius:10, background:T.card, color:T.ink, fontFamily:T.serif, fontSize:18, fontWeight:700 }}>A+</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Tutor voice call ───────────────────────────────────────────────
function MTutorCallPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.ink, color:'#fff', overflow:'hidden' }}>
      <div style={{ padding:'8px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <button onClick={()=>nav('tutor')} style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.10)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.arrowL()}</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:9.5, color:'rgba(255,255,255,.5)', fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase' }}>Voice · Spanish</div>
          <div style={{ fontFamily:T.serif, fontSize:15, marginTop:2 }}>Tutor · Café roleplay</div>
        </div>
        <button style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.10)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.cog ? Icon.cog({ width:13, height:13 }) : '⚙'}</button>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'8px 28px', gap:24 }}>
        {/* Orb */}
        <div style={{ position:'relative', width:200, height:200, flexShrink:0 }}>
          <div style={{ position:'absolute', inset:-40, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}33, transparent 70%)`, animation:'mtpulse 2s infinite' }}/>
          <div style={{ position:'absolute', inset:-20, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}55, transparent 65%)` }}/>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:64, color:'#fff', boxShadow:`0 20px 60px ${T.brand}66` }}>L</div>
        </div>

        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:9.5, color:'rgba(255,255,255,.5)', fontWeight:800, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:8 }}>LÍA IS SPEAKING</div>
          <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.35, fontStyle:'italic' }}>"¿Y qué pediste finalmente? ¿El café con leche o el cortado?"</div>
          <div style={{ fontSize:11.5, color:'rgba(255,255,255,.5)', marginTop:8, lineHeight:1.5 }}>And what did you order in the end? The café con leche or the cortado?</div>
        </div>

        {/* Waveform */}
        <div style={{ display:'flex', alignItems:'center', gap:2.5, height:36 }}>
          {Array.from({ length:36 }).map((_, i) => {
            const h = 5 + Math.abs(Math.sin(i * 0.7)) * 26 + (i % 5) * 2;
            return <div key={i} style={{ width:2.5, height:h, borderRadius:2, background: i < 22 ? T.brand : 'rgba(255,255,255,.22)' }}/>;
          })}
        </div>

        <div style={{ fontSize:11.5, color:'rgba(255,255,255,.6)' }}>03:42 · B1 conversation</div>
      </div>

      {/* Controls */}
      <div style={{ padding:'18px 22px 30px', display:'flex', alignItems:'center', justifyContent:'center', gap:18, flexShrink:0 }}>
        <button style={{ width:52, height:52, borderRadius:26, background:'rgba(255,255,255,.10)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.message({ width:16, height:16 })}</button>
        <button style={{ width:68, height:68, borderRadius:34, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 12px 28px ${T.brand}66` }}>{Icon.mic({ width:22, height:22 })}</button>
        <button onClick={()=>nav('tutor')} style={{ width:52, height:52, borderRadius:26, background:'#B00020', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.x({ width:16, height:16 })}</button>
      </div>
      <style>{`@keyframes mtpulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:.9}}`}</style>
    </div>
  );
}

// ── Tutor history ──────────────────────────────────────────────────
function MTutorHistoryPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [filter, setFilter] = React.useState('All');
  const convos = [
    { title:'Why "me dijo" not "me decía"?',     lang:'es', when:'2 weeks ago',  msgs:14, kind:'Grammar Q' },
    { title:'Roleplay · ordering at a café',     lang:'es', when:'3 weeks ago',  msgs:32, kind:'Voice call' },
    { title:'Practice for IELTS speaking part 2',lang:'en', when:'Last month',   msgs:18, kind:'Roleplay' },
    { title:'Difference between "savoir" and "connaître"', lang:'fr', when:'Mar 14', msgs:6,  kind:'Grammar Q' },
    { title:'Roleplay · job interview',          lang:'en', when:'Mar 8',        msgs:24, kind:'Roleplay' },
    { title:'Subjunctive triggers explained',    lang:'es', when:'Mar 4',        msgs:11, kind:'Grammar Q' },
    { title:'Pronunciation drill · rolling R',   lang:'es', when:'Feb 28',       msgs:9,  kind:'Voice call' },
  ];
  const list = filter === 'All' ? convos : convos.filter(c => c.kind === filter);

  return (
    <>
      <MobileHeader back onBack={()=>nav('tutor')} title="History" right={<button onClick={()=>nav('tutor')} style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>+ New</button>}/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 14px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>AI TUTOR</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Conversations</div>
          <div style={{ fontSize:12.5, color:T.ink4, marginTop:6 }}>Every chat with your tutor. Searchable, anchored to lessons.</div>
        </div>

        {/* Search */}
        <div style={{ position:'relative', marginBottom:10 }}>
          <input placeholder="Search conversations…" style={{ width:'100%', padding:'12px 14px 12px 38px', fontSize:13, color:T.ink, background:T.card, border:`1px solid ${T.border}`, borderRadius:12, outline:'none', boxShadow:MT.shadowSm }}/>
          <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search ? Icon.search({ width:13, height:13 }) : '🔍'}</div>
        </div>

        {/* Filter chips */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', marginBottom:14, paddingBottom:4 }}>
          {['All','Voice call','Grammar Q','Roleplay'].map(f => (
            <button key={f} onClick={()=>setFilter(f)} style={{
              padding:'7px 13px', borderRadius:99, fontSize:11.5, fontWeight:700, whiteSpace:'nowrap',
              background: filter === f ? T.ink : T.card,
              color: filter === f ? '#fff' : T.ink2,
              border:`1px solid ${filter === f ? T.ink : T.border}`,
              boxShadow: filter === f ? 'none' : MT.shadowSm,
            }}>{f}</button>
          ))}
        </div>

        {/* Pinned / latest card */}
        <div onClick={()=>nav('tutor')} style={{ marginBottom:14, padding:18, borderRadius:18, background:`linear-gradient(135deg, ${T.brand}, #B85428)`, color:'#fff', boxShadow:`0 12px 28px ${T.brand}33`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', right:-30, top:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.10)' }}/>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <Flag code="es" w={18} h={12} radius={2}/>
            <span style={{ fontSize:9, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', background:'rgba(255,255,255,.22)', padding:'3px 8px', borderRadius:99 }}>RESUME · 2H AGO</span>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1.25, marginBottom:6 }}>"¿Cuándo se usa el subjuntivo después de…"</div>
          <div style={{ fontSize:11.5, opacity:.85 }}>14 messages · started in Lesson 14</div>
        </div>

        {/* List */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>EARLIER</div>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {list.map((c, i) => (
            <button key={i} onClick={()=>nav('tutor')} style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'14px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background:'transparent', textAlign:'left' }}>
              <div style={{ width:36, height:36, borderRadius:9, background:c.kind === 'Voice call' ? T.brandLight : T.bg2, display:'flex', alignItems:'center', justifyContent:'center', color: c.kind === 'Voice call' ? T.brand : T.ink2, flexShrink:0 }}>
                {c.kind === 'Voice call' ? Icon.mic({ width:14, height:14 }) : c.kind === 'Roleplay' ? Icon.message({ width:13, height:13 }) : Icon.spark({ width:13, height:13 })}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, lineHeight:1.3, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                  <Flag code={c.lang} w={13} h={9} radius={2}/>
                  <span style={{ fontSize:10.5, color:T.ink4 }}>{c.when} · {c.msgs} msgs</span>
                </div>
              </div>
              <span style={{ color:T.ink5 }}>{Icon.chev({ width:13, height:13 })}</span>
            </button>
          ))}
        </MCard>
      </MobileBody>
    </>
  );
}

// ── Exam booking (3-step) ──────────────────────────────────────────
function MExamBookPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [exam, setExam] = React.useState('IELTS Academic');
  const [day, setDay] = React.useState(17);
  return (
    <>
      <MobileHeader back onBack={()=>nav('exams')} title="Book exam" right={<button onClick={()=>nav('exam_history')} style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>History</button>}/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 16px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>TEST CENTERS</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Book the real exam</div>
        </div>

        {/* Step 1 */}
        <MCard style={{ padding:16, marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:11, background:T.brand, color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>1</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Choose exam</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { name:'IELTS Academic', flag:'en', target:'7.5' },
              { name:'TOEFL iBT',      flag:'en', target:'100' },
              { name:'DELE B2',        flag:'es', target:'B2' },
              { name:'DELF B2',        flag:'fr', target:'B2' },
            ].map(e => {
              const on = exam === e.name;
              return (
                <button key={e.name} onClick={()=>setExam(e.name)} style={{ padding:'12px 12px', background: on ? T.brandLight : T.bg, border:`1.5px solid ${on ? T.brand : T.border}`, borderRadius:11, textAlign:'left' }}>
                  <Flag code={e.flag} w={22} h={15} radius={2}/>
                  <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginTop:6 }}>{e.name}</div>
                  <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>Target: {e.target}</div>
                </button>
              );
            })}
          </div>
        </MCard>

        {/* Step 2 */}
        <MCard style={{ padding:16, marginBottom:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:11, background:T.brand, color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>2</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Pick a center</div>
          </div>
          <div style={{ position:'relative', marginBottom:10 }}>
            <input defaultValue="Madrid, Spain" style={{ width:'100%', padding:'10px 12px 10px 34px', fontSize:12.5, color:T.ink, background:T.bg, border:`1px solid ${T.border}`, borderRadius:9, outline:'none' }}/>
            <div style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search ? Icon.search({ width:12, height:12 }) : '📍'}</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              { name:'British Council Madrid', dist:'2.4 km', slots:'12 slots', selected:true },
              { name:'IDP IELTS Madrid Centro', dist:'4.1 km', slots:'8 slots' },
              { name:'British Council Toledo', dist:'68 km', slots:'4 slots' },
            ].map(c => (
              <button key={c.name} style={{ padding:'10px 12px', background: c.selected ? T.brandLight : 'transparent', border:`1.5px solid ${c.selected ? T.brand : T.border}`, borderRadius:10, textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11 }}>📍</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{c.name}</div>
                  <div style={{ fontSize:10, color:T.ink4 }}>{c.dist} · {c.slots}</div>
                </div>
                {c.selected && <span style={{ color:T.brand }}>{Icon.check({ width:12, height:12 })}</span>}
              </button>
            ))}
          </div>
        </MCard>

        {/* Step 3 — Date */}
        <MCard style={{ padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <div style={{ width:22, height:22, borderRadius:11, background:T.brand, color:'#fff', fontSize:11, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>3</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Pick a date</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <button style={{ width:28, height:28, borderRadius:7, color:T.ink2, fontSize:14, fontWeight:600 }}>‹</button>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>May 2025</div>
            <button style={{ width:28, height:28, borderRadius:7, color:T.ink2, fontSize:14, fontWeight:600 }}>›</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:3 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} style={{ padding:5, fontSize:9.5, color:T.ink4, fontWeight:800, textAlign:'center' }}>{d}</div>
            ))}
            {Array.from({ length:35 }).map((_, i) => {
              const dn = i - 2;
              const valid = dn >= 1 && dn <= 31;
              const available = valid && [3, 7, 10, 14, 17, 21, 24, 28].includes(dn);
              const sel = dn === day;
              return (
                <button key={i} onClick={()=>available && setDay(dn)} disabled={!available} style={{
                  aspectRatio:'1', borderRadius:8, fontSize:12, fontWeight: sel ? 800 : 600,
                  color: !valid ? 'transparent' : sel ? '#fff' : available ? T.ink : T.ink5,
                  background: sel ? T.brand : available ? T.brandLight : 'transparent',
                  cursor: available ? 'pointer' : 'default',
                }}>{valid ? dn : ''}</button>
              );
            })}
          </div>
        </MCard>

        {/* Sticky-feel summary */}
        <MCard raised style={{ padding:16 }}>
          <div style={{ fontSize:10, fontWeight:800, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>SUMMARY</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7, fontSize:12, color:T.ink2, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span>Exam</span><b style={{ color:T.ink }}>{exam}</b></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span>Center</span><b style={{ color:T.ink }}>BC Madrid</b></div>
            <div style={{ display:'flex', justifyContent:'space-between' }}><span>Date</span><b style={{ color:T.ink }}>Sat, May {day} · 9:00 AM</b></div>
          </div>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', paddingTop:12, borderTop:`1px solid ${T.hairline}`, marginBottom:12 }}>
            <span style={{ fontSize:11, color:T.ink3 }}>Total</span>
            <span style={{ fontFamily:T.serif, fontSize:24, color:T.ink }}>$249.00</span>
          </div>
          <button style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 8px 22px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            Book and pay {Icon.arrow({ width:12, height:12 })}
          </button>
          <div style={{ marginTop:9, fontSize:10.5, color:T.ink4, textAlign:'center', lineHeight:1.5 }}>Free reschedule up to 48h before. Refundable up to 7 days.</div>
        </MCard>
      </MobileBody>
    </>
  );
}

// ── Exam history ───────────────────────────────────────────────────
function MExamHistoryPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const attempts = [
    { exam:'IELTS Practice Mock', date:'Apr 14',  score:'7.0', delta:'+0.5', mods:{ R:7.5, L:7.5, W:6.5, S:6.5 }, kind:'Mock' },
    { exam:'IELTS Real Exam',     date:'Feb 18',  score:'7.5', delta:'',      mods:{ R:8.0, L:7.5, W:7.0, S:7.5 }, kind:'Real', cert:true },
    { exam:'TOEFL iBT Mock',      date:'Mar 28',  score:'92',  delta:'+4',    mods:{ R:24, L:22, W:24, S:22 },     kind:'Mock' },
    { exam:'IELTS Practice Mock', date:'Mar 22',  score:'6.5', delta:'+0.5', mods:{ R:7.0, L:7.0, W:6.0, S:6.0 }, kind:'Mock' },
    { exam:'DELE B2 Practice',    date:'Mar 04',  score:'72',  delta:'+8',    mods:{ R:18, L:16, W:20, S:18 },     kind:'Mock' },
  ];
  return (
    <>
      <MobileHeader back onBack={()=>nav('exams')} title="History" right={<button onClick={()=>nav('exam_book')} style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>+ Schedule</button>}/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 16px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>PAST ATTEMPTS</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Exam history</div>
        </div>

        {/* Stat grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:6, marginBottom:14 }}>
          {[
            { l:'Total', v:'14' },
            { l:'Best', v:'7.5', accent:true },
            { l:'Avg Δ', v:'+0.4' },
            { l:'Real', v:'2' },
          ].map(s => (
            <MCard key={s.l} style={{ padding:'10px 8px', textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:20, color: s.accent ? T.brand : T.ink, lineHeight:1, letterSpacing:'-.01em' }}>{s.v}</div>
              <div style={{ fontSize:9, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginTop:5 }}>{s.l}</div>
            </MCard>
          ))}
        </div>

        {/* Trend */}
        <MCard style={{ padding:14, marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink, letterSpacing:'-.005em' }}>Score trend</div>
            <div style={{ fontSize:10, fontWeight:800, color:'#1A8F4E', letterSpacing:'.08em' }}>+1.0 ↑</div>
          </div>
          <svg viewBox="0 0 320 80" style={{ width:'100%', height:80 }}>
            <line x1="0" y1="20" x2="320" y2="20" stroke={T.hairline}/>
            <line x1="0" y1="50" x2="320" y2="50" stroke={T.hairline}/>
            {(() => {
              const pts = [6.0,6.5,6.5,7.0,7.0,7.5,7.0,7.5];
              const path = pts.map((p, j) => {
                const x = (j / (pts.length-1)) * 318 + 1;
                const y = 70 - ((p - 5.5) / 2.5) * 56;
                return `${j === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
              }).join(' ');
              const area = path + ` L 319 78 L 1 78 Z`;
              return <>
                <path d={area} fill={T.brand} fillOpacity=".10"/>
                <path d={path} fill="none" stroke={T.brand} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                {pts.map((p, j) => {
                  const x = (j / (pts.length-1)) * 318 + 1;
                  const y = 70 - ((p - 5.5) / 2.5) * 56;
                  return <circle key={j} cx={x} cy={y} r={j === pts.length-1 ? 3.5 : 2.5} fill={T.brand}/>;
                })}
              </>;
            })()}
          </svg>
        </MCard>

        {/* Attempts list */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>ALL ATTEMPTS</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {attempts.map((a, i) => (
            <button key={i} onClick={()=>nav('mock_results')} style={{ display:'block', textAlign:'left', padding:'14px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:14, boxShadow:MT.shadowSm }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ fontSize:9, fontWeight:800, color: a.kind === 'Real' ? T.brand : T.ink3, background: a.kind === 'Real' ? T.brandLight : T.bg2, padding:'3px 8px', borderRadius:99, letterSpacing:'.1em' }}>{a.kind.toUpperCase()}</span>
                {a.cert && <span style={{ fontSize:9, fontWeight:800, color:'#1A8F4E', background:'#E5F5EB', padding:'3px 8px', borderRadius:99, letterSpacing:'.1em' }}>CERT</span>}
                <span style={{ fontSize:11, color:T.ink4, marginLeft:'auto' }}>{a.date}</span>
              </div>
              <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:8 }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{a.exam}</div>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1, letterSpacing:'-.01em' }}>{a.score}</div>
                {a.delta && <div style={{ fontSize:11, fontWeight:800, color:'#1A8F4E' }}>{a.delta}</div>}
              </div>
              <div style={{ display:'flex', gap:5 }}>
                {Object.entries(a.mods).map(([k, v]) => (
                  <div key={k} style={{ flex:1, padding:'5px 4px', background:T.bg2, borderRadius:6, textAlign:'center' }}>
                    <div style={{ fontSize:8.5, color:T.ink4, fontWeight:800, letterSpacing:'.08em' }}>{k}</div>
                    <div style={{ fontSize:11.5, fontWeight:700, color:T.ink, marginTop:1 }}>{v}</div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </MobileBody>
    </>
  );
}

// ── Public profile ─────────────────────────────────────────────────
function MPublicProfilePage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const heatmap = Array.from({ length: 49 }, (_, i) => Math.max(0, Math.round(Math.sin(i*0.7 + 1) * 2.4 + 2)));
  const shadeFor = (v) => v === 0 ? T.bg2 : `color-mix(in oklch, ${T.brand} ${v * 22}%, ${T.bg2})`;

  return (
    <>
      <MobileHeader back onBack={()=>nav('friends')} title="Profile" right={<button style={{ width:34, height:34, borderRadius:17, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, fontSize:14, fontWeight:700 }}>⋯</button>}/>
      <MobileBody padding={[0,0,32]} tabBarPad={false}>
        {/* Editorial masthead */}
        <div style={{ background:T.card, borderBottom:`1px solid ${T.hairline}`, position:'relative', overflow:'hidden', padding:'18px 20px 22px', marginBottom:14 }}>
          <div style={{ position:'absolute', top:-30, right:-40, fontFamily:T.serif, fontSize:200, color:T.bg2, lineHeight:.8, fontWeight:300, userSelect:'none', pointerEvents:'none' }}>SC</div>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:78, height:78, borderRadius:39, background:'#3F7CAC', color:'#fff', fontSize:28, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`3px solid ${T.bg}`, boxShadow:'0 12px 30px rgba(63,124,172,.28)' }}>SC</div>
              <div style={{ position:'absolute', bottom:-2, right:-2, width:24, height:24, borderRadius:12, background:'#1A8F4E', border:`3px solid ${T.card}`, color:'#fff', fontSize:9, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>47</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:4, flexWrap:'wrap' }}>
                <span style={{ fontSize:9, fontWeight:800, color:T.brand, background:T.brandLight, padding:'2px 7px', borderRadius:99, letterSpacing:'.1em' }}>PRO</span>
                <span style={{ fontSize:9, fontWeight:800, color:'#1A8F4E', background:'#E5F5EB', padding:'2px 7px', borderRadius:99, letterSpacing:'.04em' }}>TOP 5%</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.05, letterSpacing:'-.015em' }}>Sofia Chen</div>
              <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>@sofiachen · Tokyo · 東京</div>
            </div>
          </div>

          {/* Pull-quote bio */}
          <div style={{ paddingLeft:11, borderLeft:`3px solid ${T.brand}`, marginBottom:14 }}>
            <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13.5, color:T.ink2, lineHeight:1.5 }}>"Studying Spanish to read Bolaño in the original. Always up for a 20-minute conversation exchange."</div>
          </div>

          {/* CTAs */}
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={()=>nav('dm_thread')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.brandGrad, color:'#fff', fontSize:12.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}33`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>{Icon.message({ width:12, height:12 })} Message</button>
            <button style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>{Icon.check({ width:12, height:12 })} Following</button>
          </div>
        </div>

        {/* Numbers strip */}
        <div style={{ padding:'0 16px 14px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', borderTop:`1px solid ${T.hairline}`, borderBottom:`1px solid ${T.hairline}`, marginBottom:14 }}>
            {[
              { l:'Langs', v:'3' },
              { l:'XP·30d', v:'14.8k' },
              { l:'Friends', v:'42' },
              { l:'Badges', v:'31' },
            ].map((s, i) => (
              <div key={s.l} style={{ padding:'10px 6px', borderLeft: i ? `1px solid ${T.hairline}` : 'none', textAlign:'center' }}>
                <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1, letterSpacing:'-.01em' }}>{s.v}</div>
                <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginTop:5 }}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Languages */}
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'2px 6px', marginBottom:8 }}>LANGUAGES</div>
          <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
            {[
              { name:'Spanish',  flag:'es', level:'B1',     pct:.72, accent:'#C56B47', xp:'8.4k XP' },
              { name:'Japanese', flag:'jp', level:'Native', pct:1,   accent:'#8E6E95', xp:'Native' },
              { name:'English',  flag:'en', level:'C1',     pct:.91, accent:'#3F7CAC', xp:'1.2k XP' },
            ].map((l, i) => (
              <div key={l.name} style={{ display:'flex', alignItems:'center', gap:11, padding:'13px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <Flag code={l.flag} w={26} h={18} radius={2}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{l.name}</div>
                    <div style={{ fontFamily:T.serif, fontSize:14, color:l.accent, lineHeight:1 }}>{l.level}</div>
                  </div>
                  <div style={{ position:'relative', height:5, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
                    <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${l.pct * 100}%`, background:`linear-gradient(90deg, ${l.accent}, ${l.accent}dd)`, borderRadius:99 }}/>
                  </div>
                  <div style={{ fontSize:10, color:T.ink4, marginTop:4 }}>{l.xp}</div>
                </div>
              </div>
            ))}
          </MCard>

          {/* 49-day heatmap */}
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'2px 6px', marginBottom:8, display:'flex', justifyContent:'space-between' }}>
            <span>PRACTICE RHYTHM</span>
            <span>47-DAY STREAK 🔥</span>
          </div>
          <MCard style={{ padding:14, marginBottom:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:4 }}>
              {heatmap.map((v, i) => (
                <div key={i} style={{ aspectRatio:'1', borderRadius:4, background: shadeFor(v), border: v === 0 ? `1px solid ${T.border}` : 'none' }}/>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, fontSize:9.5, color:T.ink4 }}>
              <span>7 weeks ago</span>
              <div style={{ display:'flex', alignItems:'center', gap:3 }}>
                {[0,1,2,3,4].map(i => <div key={i} style={{ width:8, height:8, background:shadeFor(i), borderRadius:2 }}/>)}
              </div>
              <span>Today</span>
            </div>
          </MCard>

          {/* Featured badge */}
          <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
            <div style={{ background:`linear-gradient(135deg, #C8924E, #A06940)`, padding:'18px 18px 16px', color:'#fff', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-25, right:-25, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,.10)' }}/>
              <div style={{ fontSize:9, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.85, marginBottom:6 }}>FEATURED BADGE</div>
              <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.05, marginBottom:4 }}>Vocabulary virtuoso</div>
              <div style={{ fontSize:11, opacity:.85 }}>Mastered 1,000 cards</div>
            </div>
            <div style={{ padding:'10px 14px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ fontSize:10.5, color:T.ink4 }}>Earned today · Top 8%</div>
              <button style={{ fontSize:11, fontWeight:700, color:T.brand }}>See all 31 →</button>
            </div>
          </MCard>

          {/* Mutual friends */}
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'2px 6px', marginBottom:8 }}>MUTUAL FRIENDS · 8</div>
          <MCard style={{ padding:0, overflow:'hidden' }}>
            {[
              { n:'Marco Rivera', i:'MR', bg:'#A06940', sub:'Spanish · B2' },
              { n:'Yui Tanaka',   i:'YT', bg:'#8E6E95', sub:'Japanese · Native' },
              { n:'Ana Belkacem', i:'AB', bg:'#5B7553', sub:'French · C1' },
            ].map((f, i) => (
              <button key={f.n} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background:'transparent', textAlign:'left' }}>
                <div style={{ width:32, height:32, borderRadius:16, background:f.bg, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.i}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{f.n}</div>
                  <div style={{ fontSize:10.5, color:T.ink4 }}>{f.sub}</div>
                </div>
                <span style={{ color:T.ink5 }}>{Icon.chev({ width:13, height:13 })}</span>
              </button>
            ))}
          </MCard>
        </div>
      </MobileBody>
    </>
  );
}

// ── DM thread ──────────────────────────────────────────────────────
function MDMThreadPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      {/* Header */}
      <div style={{ padding:'4px 14px 10px', flexShrink:0, borderBottom:`1px solid ${T.hairline}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, paddingTop:4 }}>
          <button onClick={()=>nav('friends')} style={{ width:38, height:38, borderRadius:19, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:MT.shadowSm }}>{Icon.arrowL()}</button>
          <button onClick={()=>nav('public_profile')} style={{ flex:1, display:'flex', alignItems:'center', gap:10, padding:'4px 8px', textAlign:'left', background:'transparent' }}>
            <div style={{ width:36, height:36, borderRadius:18, background:'#3F7CAC', color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>SC</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Sofia Chen</div>
              <div style={{ fontSize:10.5, color:'#1A8F4E', display:'flex', alignItems:'center', gap:4 }}><span style={{ width:5, height:5, borderRadius:3, background:'#1A8F4E' }}/>Active now</div>
            </div>
          </button>
          <button onClick={()=>nav('tutor_call')} style={{ width:38, height:38, borderRadius:19, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:MT.shadowSm }}>{Icon.mic({ width:13, height:13 })}</button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflow:'auto', padding:'16px 14px 12px', display:'flex', flexDirection:'column', gap:8, background:T.bg }}>
        <div style={{ alignSelf:'center', fontSize:10, fontWeight:700, color:T.ink4, padding:'4px 10px', background:T.card, borderRadius:99, letterSpacing:'.06em' }}>YESTERDAY</div>

        <MBubble side="them">¡Hola Marc! Vi que estás estudiando español también. ¿Quieres hacer un intercambio? Yo te ayudo con español y tú me ayudas con inglés.</MBubble>
        <MBubble side="them">I just started studying Spanish three months ago, so I'm B1.</MBubble>
        <MBubble side="me">¡Claro! Sounds great. I'm B2 in English so I should be able to help.</MBubble>
        <MBubble side="me">When works for you? I'm free most evenings CET.</MBubble>

        <div style={{ alignSelf:'center', fontSize:10, fontWeight:700, color:T.ink4, padding:'4px 10px', background:T.card, borderRadius:99, letterSpacing:'.06em', marginTop:6 }}>TODAY</div>

        <MBubble side="them">Tomorrow at 7pm CET? We can do 30 min Spanish, 30 min English.</MBubble>
        <MBubble side="me">Perfecto. I'll send a meeting link.</MBubble>
        <MBubble side="them">Yes! Tomorrow at 7pm works. Looking forward to it 🎉</MBubble>

        {/* Quick suggestion */}
        <div style={{ marginTop:8, padding:'10px 12px', background:T.brandLight, border:`1px dashed ${T.brand}66`, borderRadius:11 }}>
          <div style={{ fontSize:9, fontWeight:800, color:T.brand, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:4 }}>{Icon.spark({ width:9, height:9 })} LÍA SUGGESTS</div>
          <div style={{ fontFamily:T.serif, fontSize:13.5, color:T.ink, fontStyle:'italic', lineHeight:1.4 }}>"¡Genial! Hasta mañana entonces. Voy a preparar algunas preguntas."</div>
        </div>
      </div>

      {/* Composer */}
      <div style={{ padding:'10px 14px 14px', borderTop:`1px solid ${T.hairline}`, background:T.card, display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <button style={{ width:36, height:36, borderRadius:18, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.plus()}</button>
        <input placeholder="Write a message…" style={{ flex:1, padding:'10px 14px', fontSize:13, border:`1px solid ${T.border}`, borderRadius:99, background:T.bg, outline:'none', minWidth:0 }}/>
        <button style={{ width:38, height:38, borderRadius:19, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 14px ${T.brand}40`, flexShrink:0 }}>{Icon.arrow({ width:13, height:13 })}</button>
      </div>
    </>
  );
}

function MBubble({ side, children }) {
  const me = side === 'me';
  return (
    <div style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth:'82%', padding:'9px 13px', borderRadius: me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: me ? T.brand : T.card, color: me ? '#fff' : T.ink, fontSize:13, lineHeight:1.5, border: me ? 'none' : `1px solid ${T.border}`, boxShadow: me ? 'none' : MT.shadowSm }}>
        {children}
      </div>
    </div>
  );
}

// ── Activity feed ──────────────────────────────────────────────────
function MActivityFeedPage() {
  const nav = (id) => window.__nav && window.__nav(id);
  const items = [
    { who:'Sofia Chen',    init:'SC', bg:'#3F7CAC', what:'completed', detail:'Lesson 14 · Subjunctive triggers',  lang:'es', when:'2m ago',  kind:'lesson' },
    { who:'Marco Rivera',  init:'MR', bg:'#A06940', what:'earned',    detail:'"Vocabulary virtuoso" achievement', lang:'en', when:'18m ago', kind:'badge' },
    { who:'Ana Belkacem',  init:'AB', bg:'#5B7553', what:'finished',  detail:'30-day streak in French',           lang:'fr', when:'1h ago',  kind:'streak', highlight:true },
    { who:'Yui Tanaka',    init:'YT', bg:'#8E6E95', what:'scored',    detail:'Band 7.5 on IELTS mock exam',       lang:'en', when:'2h ago',  kind:'exam' },
    { who:'Diego Costa',   init:'DC', bg:'#C56B47', what:'started',   detail:'a new 7-day challenge',             lang:'pt', when:'3h ago',  kind:'lesson' },
    { who:'Marco Rivera',  init:'MR', bg:'#A06940', what:'reviewed',  detail:'128 flashcards',                    lang:'en', when:'5h ago',  kind:'review' },
    { who:'Sofia Chen',    init:'SC', bg:'#3F7CAC', what:'shared',    detail:'a story · "El silencio de los pueblos"', lang:'es', when:'8h ago', kind:'lesson' },
  ];
  const dot = { lesson:T.brand, badge:'#C8924E', exam:'#3F7CAC', review:'#1A8F4E', streak:'#C0392B' };
  return (
    <>
      <MobileHeader back onBack={()=>nav('friends')} title="Activity"
        right={<button onClick={()=>nav('friends')} style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>+ Find</button>}/>
      <MobileBody padding={[0,16,32]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 14px' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>FRIENDS</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Activity feed</div>
          <div style={{ fontSize:12.5, color:T.ink4, marginTop:6 }}>Cheer them on, or jump into the same lesson.</div>
        </div>

        {/* Stats */}
        <MCard style={{ padding:14, marginBottom:14 }}>
          <div style={{ fontSize:10, fontWeight:800, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>THIS WEEK</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[
              { l:'Cheers given', v:'14' },
              { l:'Cheers got', v:'22', accent:true },
              { l:'Active', v:'9 / 12' },
            ].map(s => (
              <div key={s.l} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:T.serif, fontSize:20, color: s.accent ? T.brand : T.ink, lineHeight:1, letterSpacing:'-.01em' }}>{s.v}</div>
                <div style={{ fontSize:9, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', marginTop:5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </MCard>

        {/* Feed */}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {items.map((a, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:11, padding:'13px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background: a.highlight ? T.brandLight : 'transparent' }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <div style={{ width:36, height:36, borderRadius:18, background:a.bg, color:'#fff', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{a.init}</div>
                <div style={{ position:'absolute', bottom:-1, right:-1, width:13, height:13, borderRadius:7, background:dot[a.kind], border:`2px solid ${T.card}` }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.45 }}>
                  <b onClick={()=>nav('public_profile')} style={{ cursor:'pointer' }}>{a.who}</b> {a.what} <span style={{ fontWeight:700 }}>{a.detail}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginTop:6 }}>
                  <Flag code={a.lang} w={14} h={10} radius={1}/>
                  <div style={{ fontSize:10.5, color:T.ink4 }}>{a.when}</div>
                  <button style={{ fontSize:10.5, color:T.brand, fontWeight:700, marginLeft:'auto' }}>👏 Cheer</button>
                </div>
              </div>
            </div>
          ))}
        </MCard>

        {/* Suggested */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'18px 6px 8px' }}>SUGGESTED</div>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {[
            { n:'Lior Adler', i:'LA', bg:'#7A4FAB' },
            { n:'Priya Shah', i:'PS', bg:'#C56B47' },
          ].map((s, i) => (
            <div key={s.n} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:34, height:34, borderRadius:17, background:s.bg, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.i}</div>
              <div style={{ flex:1, fontSize:12.5, fontWeight:700, color:T.ink }}>{s.n}</div>
              <button style={{ fontSize:11, fontWeight:800, color:T.brand, padding:'7px 12px', background:T.brandLight, borderRadius:99 }}>+ Add</button>
            </div>
          ))}
        </MCard>
      </MobileBody>
    </>
  );
}

Object.assign(window, { MArticleReaderPage, MTutorCallPage, MTutorHistoryPage, MExamBookPage, MExamHistoryPage, MPublicProfilePage, MDMThreadPage, MActivityFeedPage });
