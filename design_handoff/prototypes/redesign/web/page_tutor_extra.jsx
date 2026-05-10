// ── Tutor voice call + Conversation history ────────────────

function TutorCallPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.ink, color:'#fff' }}>
      <div style={{ padding:'18px 28px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <button data-nav="tutor" style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.1)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.arrowL()}</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase' }}>Voice call · Spanish</div>
          <div style={{ fontFamily:T.serif, fontSize:18, marginTop:2 }}>Lía · Roleplay café</div>
        </div>
        <button style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.1)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.cog ? Icon.cog({ width:14, height:14 }) : '⚙'}</button>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, gap:30 }}>
        {/* Speaking orb */}
        <div style={{ position:'relative', width:240, height:240 }}>
          <div style={{ position:'absolute', inset:-40, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}33, transparent 70%)`, animation:'pulse 2s infinite' }}/>
          <div style={{ position:'absolute', inset:-20, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}55, transparent 65%)` }}/>
          <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:72, color:'#fff', boxShadow:`0 20px 60px ${T.brand}66` }}>L</div>
        </div>

        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:8 }}>Lía is speaking</div>
          <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.3, maxWidth:520, fontStyle:'italic' }}>"¿Y qué pediste finalmente? ¿El café con leche o el cortado?"</div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,.5)', marginTop:8 }}>And what did you order in the end? The café con leche or the cortado?</div>
        </div>

        {/* Waveform */}
        <div style={{ display:'flex', alignItems:'center', gap:3, height:44 }}>
          {Array.from({ length:48 }).map((_, i) => {
            const h = 6 + Math.abs(Math.sin(i * 0.7)) * 32 + (i % 5) * 3;
            return <div key={i} style={{ width:3, height:h, borderRadius:2, background: i < 30 ? T.brand : 'rgba(255,255,255,.25)' }}/>;
          })}
        </div>

        <div style={{ fontSize:13, color:'rgba(255,255,255,.6)' }}>03:42 · Spanish · B1 conversation</div>
      </div>

      {/* Controls */}
      <div style={{ padding:'24px 28px 36px', display:'flex', alignItems:'center', justifyContent:'center', gap:18 }}>
        <button style={{ width:56, height:56, borderRadius:28, background:'rgba(255,255,255,.1)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.message({ width:18, height:18 })}</button>
        <button style={{ width:72, height:72, borderRadius:36, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 30px ${T.brand}66` }}>{Icon.mic({ width:24, height:24 })}</button>
        <button data-nav="mod_results" style={{ width:56, height:56, borderRadius:28, background:'#B00020', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.x({ width:18, height:18 })}</button>
      </div>

      <style>{`@keyframes pulse{0%,100%{transform:scale(1);opacity:.6}50%{transform:scale(1.08);opacity:.9}}`}</style>
    </div>
  );
}

function TutorHistoryPage() {
  const convos = [
    { title:'Why "me dijo" not "me decía"?',     lang:'es', when:'2 weeks ago',     msgs:14, kind:'Grammar Q' },
    { title:'Roleplay · ordering at a café',     lang:'es', when:'3 weeks ago',     msgs:32, kind:'Voice call' },
    { title:'Practice for IELTS speaking part 2',lang:'en', when:'Last month',      msgs:18, kind:'Roleplay' },
    { title:'Difference between "savoir" and "connaître"', lang:'fr', when:'Mar 14', msgs:6,  kind:'Grammar Q' },
    { title:'Roleplay · job interview',          lang:'en', when:'Mar 8',           msgs:24, kind:'Roleplay' },
    { title:'Subjunctive triggers explained',    lang:'es', when:'Mar 4',           msgs:11, kind:'Grammar Q' },
    { title:'Pronunciation drill · rolling R',   lang:'es', when:'Feb 28',          msgs:9,  kind:'Voice call' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="AI tutor" title="Conversation history" subtitle="Every chat with Lía — searchable, exportable, anchored to the lessons you were studying."
          right={<div style={{ display:'flex', gap:8 }}><Btn label="New chat" nav="tutor" accent={T.brand} icon={Icon.plus()}/><Btn label="Voice call" nav="tutor_call" variant="outline" accent={T.ink} icon={Icon.mic()}/></div>}
        />

        {/* Filter row */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18, paddingBottom:14, borderBottom:`1px solid ${T.hairline}` }}>
          <input placeholder="Search your conversations..." style={{ flex:1, padding:'10px 14px', fontSize:13, border:`1px solid ${T.border}`, borderRadius:10, background:T.card, outline:'none' }}/>
          <button style={{ padding:'8px 12px', fontSize:12, fontWeight:600, color:T.ink2, border:`1px solid ${T.border}`, background:T.card, borderRadius:9 }}>All languages</button>
          <button style={{ padding:'8px 12px', fontSize:12, fontWeight:600, color:T.ink2, border:`1px solid ${T.border}`, background:T.card, borderRadius:9 }}>All kinds</button>
        </div>

        {/* List */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {convos.map((c, i) => (
            <button key={i} data-nav="tutor" style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 18px', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, textAlign:'left', cursor:'pointer' }}>
              <Flag code={c.lang} w={28} h={20} radius={3}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <Chip label={c.kind} accent={c.kind === 'Voice call' ? T.brand : T.ink2} bg={c.kind === 'Voice call' ? T.brandLight : T.bg2} style={{ fontSize:9.5, padding:'2px 7px' }}/>
                  <div style={{ fontSize:11, color:T.ink4 }}>{c.when} · {c.msgs} messages</div>
                </div>
                <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.3 }}>{c.title}</div>
              </div>
              <div style={{ color:T.ink5 }}>{Icon.chev()}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TutorCallPage, TutorHistoryPage });
