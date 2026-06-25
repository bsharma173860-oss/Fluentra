// Mobile · Exam Entry · v5

function MExamEntryPageV5() {
  const [confirmed, setConfirmed] = React.useState(false);
  const code = window.__langCode || 'en';
  const lang = (typeof LANGUAGES !== 'undefined') ? (LANGUAGES.find(l => l.code === code) || LANGUAGES[0]) : { code:'en', english:'English' };
  const ex = (typeof examFor === 'function') ? examFor(lang.code) : { name:'IELTS', short:'IELTS', cost:'£5', duration:'2h 45m', body:'British Council', blurb:'AI-graded exam in official format.', modules:[] };
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back title={`${ex.short} entry`}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', marginBottom:9, padding:'4px 6px 0' }}>MONTHLY EXAM · {(lang.english || '').toUpperCase()}</div>

        {/* Hero */}
        <div style={{ background:T.ink, borderRadius:18, padding:'22px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
            {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:11 }}>
              {typeof Flag !== 'undefined' && <Flag code={lang.code} w={22} h={15} radius={2}/>}
              <span style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.8)', padding:'3px 9px', borderRadius:99, background:'rgba(255,255,255,.12)', letterSpacing:'.04em' }}>{lang.english}</span>
            </div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:9 }}>{ex.name}</div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.75)', lineHeight:1.5, marginBottom:14 }}>{ex.blurb}</div>
            <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:10, paddingTop:14, borderTop:'1px solid rgba(255,255,255,.1)' }}>
              <div>
                <div style={{ fontSize:10, fontWeight:800, color:'rgba(255,255,255,.55)', letterSpacing:'.16em' }}>ENTRY FEE · ONE-TIME</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginTop:5 }}>{ex.body}</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:38, lineHeight:1, letterSpacing:'-.02em' }}>{ex.cost}</div>
            </div>
          </div>
        </div>

        {/* Quick details · 2-col stat tiles */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {[
            { l:'DURATION', v:ex.duration },
            { l:'MODULES',  v:`${(ex.modules||[]).length}` },
            { l:'RESULTS',  v:'<24 h' },
            { l:'SCORING',  v:'AI · band' },
          ].map((d, i) => (
            <MCard key={i} style={{ padding:'12px 12px' }}>
              <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em' }}>{d.l}</div>
              <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1.05, letterSpacing:'-.02em', marginTop:6 }}>{d.v}</div>
            </MCard>
          ))}
        </div>

        {/* Modules list */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>MODULES IN THIS EXAM</div>
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {(ex.modules || []).map((m, i) => {
            const c = colorMap[m.color] || T.listening;
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ width:30, height:30, borderRadius:8, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic] ? Icon[m.ic]({ width:13, height:13 }) : '★'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{m.label}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{m.time} · {m.q} {m.q === 1 ? 'task' : 'items'}</div>
                </div>
              </div>
            );
          })}
        </MCard>

        {/* Checklist */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>BEFORE YOU BEGIN</div>
        <MCard style={{ padding:'14px 14px', marginBottom:14 }}>
          {[
            `I have ${ex.duration} of uninterrupted time`,
            "I'm in a quiet environment with a working microphone",
            'I understand this exam is officially scored',
            `I've reviewed the ${ex.short} format`,
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginTop: i ? 11 : 0 }}>
              <div style={{ width:20, height:20, borderRadius:10, background: confirmed ? T.listening.c : T.bg3, color: confirmed ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, fontSize:11 }}>{confirmed ? '✓' : ''}</div>
              <div style={{ fontSize:12, color:T.ink, lineHeight:1.5, flex:1 }}>{item}</div>
            </div>
          ))}
          <button onClick={()=>setConfirmed(c => !c)} style={{ marginTop:14, width:'100%', padding:'10px', borderRadius:10, border:`1.5px solid ${confirmed ? T.listening.c : T.border}`, background:confirmed ? T.listening.bg : T.card, fontSize:11.5, fontWeight:700, color:confirmed ? T.listening.c : T.ink2 }}>{confirmed ? '✓  All confirmed' : 'I confirm all of the above'}</button>
        </MCard>

        <button onClick={()=> { if (!confirmed) return; window.__examMode='monthly'; if (window.__can && window.__can('examsIncluded')) { nav('monthly_runner'); } else if (window.payFor) { window.payFor('exam_official'); } else { nav('monthly_runner'); } }} disabled={!confirmed} style={{ width:'100%', padding:'14px', borderRadius:13, background: confirmed ? T.brandGrad : T.bg3, color: confirmed ? '#fff' : T.ink5, fontSize:13.5, fontWeight:700, boxShadow: confirmed ? `0 6px 16px ${T.brand}40` : 'none', opacity: confirmed ? 1 : .65 }}>{!confirmed ? 'Confirm to continue' : (window.__can && window.__can('examsIncluded')) ? 'Enter exam →' : `Pay ${ex.cost} & enter`}</button>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink4, marginTop:9, padding:'0 14px' }}>Secure payment · Refunds unavailable after start</div>
      </MobileBody>
    </>
  );
}

Object.assign(window, { MExamEntryPageV5 });
