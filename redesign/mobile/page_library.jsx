// ── Mobile · Library v4 — WEB VOCABULARY ────────────────────
function MLibrary() {
  const nav = (id) => window.__nav && window.__nav(id);
  const [filter, setFilter] = React.useState('All');
  const _libLang = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(function () {
    var cancelled = false;
    fetch('/api/content-list?lang=' + encodeURIComponent(_libLang) + '&full=1&limit=40')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (cancelled) return;
        var KIND = { reading:'Reading', writing:'Writing', vocab:'Vocab', listening:'Listening' };
        var IC = { reading:'book', writing:'pen', vocab:'bookmark', listening:'head' };
        var mapped = (d.items || []).map(function (it) {
          var ty = it.type || 'reading';
          return { kind: KIND[ty] || 'Lesson', title: (it.title || (it.payload && it.payload.title) || 'Untitled'), tag: _libLang, meta: (_libLang.toUpperCase() + ' \u00b7 ' + (it.difficulty || ty)), ic: IC[ty] || 'book', n: ty };
        });
        setItems(mapped); setLoading(false);
      })
      .catch(function () { if (!cancelled) { setItems([]); setLoading(false); } });
    return function () { cancelled = true; };
  }, []);
  const _filtered = items.filter(function (it) { return filter === 'All' || it.kind === filter; });
  var _mtheme = { Reading:T.reading, Writing:T.writing, Listening:T.listening, Vocab:{ c:T.brand, bg:T.brandLight }, Lesson:{ c:T.brand, bg:T.brandLight } };
  var _mnav = { Reading:'reading', Writing:'writing', Listening:'listening', Vocab:'vocab', Lesson:'lesson_detail' };
  var _micon = { Reading:'book', Writing:'pen', Listening:'head', Vocab:'bookmark', Lesson:'pen' };
  const _mcolls = Object.values(items.reduce(function (acc, it) { var k=it.kind; if(!acc[k]){ var th=_mtheme[k]||{c:T.brand,bg:T.brandLight}; acc[k]={ title:k, count:0, n:_mnav[k]||'reading', ic:_micon[k]||'book', c:(th.c||th), bg:(th.bg||T.brandLight) }; } acc[k].count++; return acc; }, {})).map(function(c){ return { title:c.title, meta:c.count + (c.count===1?' item':' items'), n:c.n, ic:c.ic, c:c.c, bg:c.bg }; });

  return (
    <>
      <MobileHeader title="Library" eyebrow={items.length + (items.length===1?" item":" items")} large right={
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
          <button onClick={()=>nav(items[0] ? items[0].n : 'reading')} style={{
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
              <span style={{ fontSize:9.5, fontWeight:700, color:'#fff', background:'rgba(255,255,255,.22)', padding:'4px 9px', borderRadius:99, letterSpacing:'.08em', textTransform:'uppercase' }}>{items[0] ? 'Recently added' : 'Get started'}</span>
              <div style={{ fontFamily:T.serif, fontSize:24, color:'#fff', lineHeight:1.1, marginTop:11, marginBottom:5, letterSpacing:'-.015em' }}>{items[0] ? items[0].title : 'Start learning'}</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.85)', marginBottom:13 }}>{items[0] ? items[0].meta : 'Your generated lessons are saved here'}</div>
              <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff', color:T.es.accent, fontSize:12, fontWeight:700, padding:'8px 14px', borderRadius:10 }}>Open pack {Icon.arrow({ width:11, height:11 })}</span>
            </div>
          </button>
        </div>

        {/* SAVED LIST */}
        <div style={{ padding:'0 18px' }}>
          <MobileSectionHead title="All saved" action="Sort"/>
          <MCard style={{ padding:0 }}>
            {!loading && _filtered.length === 0 && (<div style={{ padding:'24px 14px', textAlign:'center', color:T.ink4, fontSize:12.5 }}>Nothing here yet — lessons you do are saved automatically.</div>)}
            {_filtered.map((it, i, all) => {
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
            {_mcolls.map((c, i) => (
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
