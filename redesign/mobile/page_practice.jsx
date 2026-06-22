// ── Mobile · Practice v4 — WEB VOCABULARY ───────────────────
// Mirrors web Practice page — module tile cards, daily challenges,
// quick-start hero. Card-based, restrained color, soft shadows.
function MPractice() {
  const nav = (id) => window.__nav && window.__nav(id);
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const lang = (typeof langByCode === 'function') ? langByCode(code) : LANGUAGES[0];
  const t = langTheme(lang.code);
  const pk = (typeof langPack === 'function') ? langPack(lang.code) : null;

  const modules = [
    { ic:'mic',  c:T.speaking,  title:'Speaking',  sub:'12 lessons', score:7.0, n:'speaking' },
    { ic:'pen',  c:T.writing,   title:'Writing',   sub:'9 prompts',  score:6.5, n:'writing' },
    { ic:'head', c:T.listening, title:'Listening', sub:'18 audios',  score:7.5, n:'listening' },
    { ic:'book', c:T.reading,   title:'Reading',   sub:'14 articles', score:7.0, n:'reading' },
  ];

  return (
    <>
      <MobileHeader title="Practice" eyebrow={`${lang.english} · ${pk?.exam?.short || lang.exam}`} large/>
      <MobileBody padding={0}>
        {/* QUICK-START HERO — dark slate card */}
        <div style={{ padding:'4px 18px 22px' }}>
          <button onClick={()=>nav('reading')} style={{
            width:'100%', textAlign:'left',
            background:`linear-gradient(110deg, ${T.ink} 0%, #2a1f17 100%)`,
            color:'#fff', borderRadius:18, padding:'18px 20px',
            border:'none',
            boxShadow:`0 10px 30px ${t.accent}33`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:`${t.accent}26` }}/>
            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.play({ width:16, height:16 })}</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:'rgba(255,255,255,.6)', letterSpacing:'.14em', textTransform:'uppercase' }}>Quick start · 10 min</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:'#fff', lineHeight:1.1, marginBottom:4 }}>Mixed drill, all 4 skills.</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.7)', marginBottom:14 }}>Spaced-repetition pulled from your weak spots.</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 16px', background:t.accent, borderRadius:10, fontSize:12.5, fontWeight:700, color:'#fff' }}>
                Start now {Icon.arrow({ width:12, height:12 })}
              </div>
            </div>
          </button>
        </div>

        {/* MODULES — 2x2 grid (same vocabulary as lang detail) */}
        <div style={{ padding:'0 18px 8px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>By module</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {modules.map(m => (
              <button key={m.title} onClick={()=>nav(m.n)} style={{
                textAlign:'left', background:T.card, border:`1px solid ${T.border}`,
                borderRadius:14, padding:14, display:'flex', flexDirection:'column', gap:11,
                boxShadow:MT.shadowSm,
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Icon[m.ic]({ width:15, height:15 })}
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1 }}>{m.score.toFixed(1)}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:2 }}>{m.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink3 }}>{m.sub}</div>
                </div>
                <div style={{ fontSize:10.5, color:T.ink4, fontWeight:600, marginTop:'auto' }}>Continue →</div>
              </button>
            ))}
          </div>
        </div>

        {/* DAILY CHALLENGES — horizontal scroller */}
        <div style={{ padding:'18px 18px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Daily challenges</div>
        </div>
        <div className="fluentra-challenges" style={{ display:'flex', gap:10, overflowX:'auto', padding:'10px 18px 12px' }}>
          <style>{`.fluentra-challenges::-webkit-scrollbar{display:none}`}</style>
          {[
            { title:'5-min flash quiz',   meta:'Vocab · 20 cards',  ic:'spark', c:T.brand,        bg:T.brandLight,        n:'vocab' },
            { title:'Pronunciation gym', meta:'10 phrases',         ic:'mic',   c:T.speaking.c,   bg:T.speaking.bg,       n:'speaking' },
            { title:'Listen & shadow',   meta:'1 min · podcast',    ic:'head',  c:T.listening.c,  bg:T.listening.bg,      n:'listening' },
            { title:'Read & summarise',  meta:'200 words',          ic:'book',  c:T.reading.c,    bg:T.reading.bg,        n:'reading' },
          ].map((c, i) => (
            <button key={i} onClick={()=>nav(c.n)} style={{
              flexShrink:0, width:170,
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:14, padding:14,
              display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:148,
              textAlign:'left', boxShadow:MT.shadowSm,
            }}>
              <div>
                <div style={{ width:34, height:34, borderRadius:10, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:11 }}>{Icon[c.ic]({ width:14, height:14 })}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{c.title}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{c.meta}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:c.c, marginTop:11, display:'flex', alignItems:'center', gap:4 }}>Begin {Icon.arrow({ width:10, height:10 })}</div>
            </button>
          ))}
        </div>

        {/* TUTOR */}
        <div style={{ padding:'12px 18px 0' }}>
          <button onClick={()=>nav('tutor')} style={{ width:'100%', background:T.ink, color:'#fff', borderRadius:16, padding:16, display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>{Icon.message({ width:15, height:15 })}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Practice with AI tutor</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginTop:2 }}>Real-time conversation</div>
            </div>
            {Icon.arrow({ width:13, height:13, style:{ color:'rgba(255,255,255,.5)' } })}
          </button>
        </div>
      </MobileBody>
      <MobileTabBar active="practice"/>
    </>
  );
}

Object.assign(window, { MPractice });
