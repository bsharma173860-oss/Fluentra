// ── Mobile · Library v4 — WEB VOCABULARY ────────────────────
function MLibrary() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [filter, setFilter] = React.useState('All');

  return (
    <>
      <MobileHeader title="Library" eyebrow="24 saved items" large right={
        <button onClick={()=>nav('search')} style={{ width:36, height:36, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, boxShadow:MT.shadowSm }}>{Icon.search({ width:14, height:14 })}</button>
      }/>
      <MobileBody padding={0}>
        {/* Filter chips */}
        <div className="fluentra-filters" style={{ display:'flex', gap:6, overflowX:'auto', padding:'4px 18px 14px' }}>
          <style>{`.fluentra-filters::-webkit-scrollbar{display:none}`}</style>
          {['All','Speaking','Writing','Listening','Reading','Vocab','Grammar'].map(f => {
            const a = f === filter;
            return (
              <button key={f} onClick={()=>setFilter(f)} style={{ flexShrink:0, padding:'7px 13px', borderRadius:99, fontSize:11.5, fontWeight: a ? 700 : 500, color: a ? '#fff' : T.ink2, background: a ? T.ink : T.card, border:`1px solid ${a ? T.ink : T.border}` }}>{f}</button>
            );
          })}
        </div>

        {/* FEATURED — gradient card */}
        <div style={{ padding:'0 18px 14px' }}>
          <button onClick={()=>nav('listening')} style={{
            width:'100%', textAlign:'left',
            borderRadius:16, padding:16, border:'none',
            background:`linear-gradient(135deg, ${T.es.accent} 0%, ${T.es.accent}dd 100%)`,
            color:'#fff', position:'relative', overflow:'hidden',
            boxShadow:`0 8px 22px ${T.es.accent}33`,
          }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:10, opacity:.1, pointerEvents:'none' }}>
              {Array.from({ length:48 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
            </div>
            <div style={{ position:'relative' }}>
              <span style={{ fontSize:9.5, fontWeight:700, color:'#fff', background:'rgba(255,255,255,.22)', padding:'4px 9px', borderRadius:99, letterSpacing:'.08em', textTransform:'uppercase' }}>Editor's pick</span>
              <div style={{ fontFamily:T.serif, fontSize:24, color:'#fff', lineHeight:1.1, marginTop:11, marginBottom:5, letterSpacing:'-.015em' }}>Café Madrid<br/>listening pack</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.85)', marginBottom:13 }}>8 audio clips · 24 min · B1</div>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff', color:T.es.accent, fontSize:12, fontWeight:700, padding:'8px 14px', borderRadius:10 }}>Open pack {Icon.arrow({ width:11, height:11 })}</span>
            </div>
          </button>
        </div>

        {/* SAVED LIST */}
        <div style={{ padding:'0 18px' }}>
          <MobileSectionHead title="All saved" action="Sort"/>
          <MCard style={{ padding:0 }}>
            {[
              { tag:'es', kind:'Vocab',     title:'Restaurant phrases',     meta:'24 cards',    ic:'bookmark', n:'vocab' },
              { tag:'en', kind:'Listening', title:'BBC Podcast — climate',  meta:'18 min · C1', ic:'head',     n:'listening' },
              { tag:'fr', kind:'Grammar',   title:'Subjonctif présent',     meta:'9 examples',  ic:'pen',      n:'grammar' },
              { tag:'ja', kind:'Reading',   title:'NHK Easy News (April)',  meta:'5 articles',  ic:'book',     n:'article' },
              { tag:'es', kind:'Speaking',  title:'Subway directions',      meta:'4 min',       ic:'mic',      n:'speaking' },
              { tag:'en', kind:'Writing',   title:'IELTS Task 2 — opinion', meta:'12 prompts',  ic:'edit',     n:'writing' },
            ].map((it, i, all) => {
              const lt = langTheme(it.tag);
              return (
                <button key={i} onClick={()=>nav(it.n)} style={{
                  width:'100%', textAlign:'left',
                  background:'transparent', border:'none',
                  borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none',
                  padding:'12px 14px',
                  display:'flex', alignItems:'center', gap:11,
                }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:lt.bg, color:lt.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, position:'relative' }}>
                    {Icon[it.ic]({ width:14, height:14 })}
                    <div style={{ position:'absolute', bottom:-2, right:-2, boxShadow:'0 0 0 2px '+T.card, borderRadius:2 }}>
                      <Flag code={it.tag} w={13} h={9} radius={2}/>
                    </div>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:9, color:lt.accent, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:2 }}>{it.kind}</div>
                    <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.title}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{it.meta}</div>
                  </div>
                  <span style={{ color:T.ink5 }}>{Icon.chev({ width:13, height:13 })}</span>
                </button>
              );
            })}
          </MCard>
        </div>

        {/* COLLECTIONS — 2-col compact */}
        <div style={{ padding:'18px 18px 0' }}>
          <MobileSectionHead title="Collections"/>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[
              { title:'Phrasebook',     meta:'42 phrases', n:'phrasebook',  ic:'bookmark', c:T.brand,        bg:T.brandLight },
              { title:'Long-form articles', meta:'8 reads', n:'article',     ic:'book',     c:T.reading.c,    bg:T.reading.bg },
              { title:'Lesson notes',   meta:'12 notes',   n:'lesson_detail', ic:'pen',     c:T.writing.c,    bg:T.writing.bg },
              { title:'Audio packs',    meta:'24 clips',   n:'listening',   ic:'head',     c:T.listening.c,  bg:T.listening.bg },
            ].map((c, i) => (
              <button key={i} onClick={()=>nav(c.n)} style={{
                textAlign:'left', background:T.card, border:`1px solid ${T.border}`,
                borderRadius:14, padding:14, boxShadow:MT.shadowSm,
              }}>
                <div style={{ width:34, height:34, borderRadius:10, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:11 }}>{Icon[c.ic]({ width:14, height:14 })}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{c.title}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{c.meta}</div>
              </button>
            ))}
          </div>
        </div>
      </MobileBody>
      <MobileTabBar active="library"/>
    </>
  );
}

Object.assign(window, { MLibrary });
