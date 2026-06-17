// ── Page 4: Library ─────────────────────────────────────────
// Editorial / Notion-inspired content browser

function LibraryPage() {
  const [filter, setFilter] = useState('all');

  // Featured guide ad removed per CEO review — replaced with "Continue reading" surfacing user's own saved item.

  const collections = [
    { title:'IELTS Speaking', count:24, color:T.speaking.c, bg:T.speaking.bg, ic:'mic' },
    { title:'IELTS Writing Task 1', count:18, color:T.writing.c, bg:T.writing.bg, ic:'pen' },
    { title:'IELTS Listening', count:32, color:T.listening.c, bg:T.listening.bg, ic:'head' },
    { title:'IELTS Reading', count:21, color:T.reading.c, bg:T.reading.bg, ic:'book' },
    { title:'DELE B2 Vocab', count:42, color:'#C04A06', bg:'#FFE5DE', ic:'globe' },
    { title:'JLPT N4 Kanji', count:300, color:'#C84070', bg:'#FFE0EC', ic:'layers' },
  ];

  const _libLang = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const [items, setItems] = useState([]);
  const [libLoading, setLibLoading] = useState(true);
  React.useEffect(function () {
    var cancelled = false;
    fetch('/api/content-list?lang=' + encodeURIComponent(_libLang) + '&full=1&limit=40')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (cancelled) return;
        var KIND = { reading:'Article', writing:'Article', vocab:'Phrasebook', listening:'Audio' };
        var NAVB = { reading:'reading', writing:'writing', vocab:'vocab', listening:'listening' };
        var CB   = { reading:T.reading, writing:T.writing, vocab:T.speaking, listening:T.listening };
        var mapped = (d.items || []).map(function (it) {
          var ty = it.type || 'reading';
          return { kind: KIND[ty] || 'Lesson',
                   title: it.title || (it.payload && it.payload.title) || 'Untitled',
                   tag: _libLang.toUpperCase() + ' · ' + (it.difficulty || ty),
                   time: '—', saved: false, c: CB[ty] || T.reading, nav: NAVB[ty] || 'reading' };
        });
        setItems(mapped); setLibLoading(false);
      })
      .catch(function () { if (!cancelled) { setItems([]); setLibLoading(false); } });
    return function () { cancelled = true; };
  }, []);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow="Library"
          title="Saved lessons, audio, phrasebooks."
          right={
            <div style={{ display:'flex', gap:8 }}>
              <button data-nav="search" style={{ padding:'8px 14px', fontSize:13, fontWeight:600, color:T.ink3, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, display:'flex', alignItems:'center', gap:6 }}>
                {Icon.search()} Search library
              </button>
              <Btn label="Add lesson" nav="vocab" icon={Icon.plus()} accent={T.brand}/>
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 300px', gap:28, alignItems:'start' }}>
        <div style={{ minWidth:0 }}>
        {/* Continue reading — user's last opened item */}
        <div style={{
          background:T.bg2, borderRadius:18, padding:'28px 32px',
          display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:36, alignItems:'center',
          marginBottom:32, border:`1px solid ${T.border}`,
        }}>
          <div>
            <Chip label="Continue reading" accent={T.brand} bg={T.brandLight} style={{ marginBottom:14 }}/>
            <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1.1, marginBottom:12, textWrap:'pretty' }}>
              Past tense — passé composé
            </div>
            <div style={{ fontSize:14, color:T.ink3, lineHeight:1.5, marginBottom:18, maxWidth:520 }}>
              You stopped halfway through this lesson 2 days ago. Pick up where you left off.
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <Btn label="Resume" nav="lesson_detail" iconRight={Icon.arrow()} accent={T.brand}/>
              <div style={{ fontSize:12, color:T.ink4, display:'flex', alignItems:'center', gap:5 }}>
                {Icon.clock({ width:12, height:12 })} 4 min left
              </div>
            </div>
          </div>
          <div style={{ aspectRatio:'4/3', borderRadius:14, background:`linear-gradient(135deg, ${T.brand} 0%, #E8732F 100%)`, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:10, opacity:.1, padding:18 }}>
              {Array.from({ length:160 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
            </div>
            <div style={{ position:'absolute', bottom:24, left:24, right:24, color:'#fff' }}>
              <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', opacity:.85, marginBottom:6 }}>Audio preview</div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:38, height:38, borderRadius:19, background:'rgba(255,255,255,.2)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.play()}</div>
                <div style={{ flex:1 }}>
                  <div style={{ height:3, background:'rgba(255,255,255,.3)', borderRadius:99, overflow:'hidden' }}>
                    <div style={{ width:'40%', height:'100%', background:'#fff' }}/>
                  </div>
                  <div style={{ fontSize:11, opacity:.8, marginTop:5 }}>0:48 / 2:14</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collections row */}
        <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>Collections</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:12, marginBottom:32 }}>
          {collections.map(c => (
            <button key={c.title} data-nav="lang" style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:16, textAlign:'left', cursor:'pointer' }}>
              <div style={{ width:32, height:32, borderRadius:9, background:c.bg, color:c.color, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                {Icon[c.ic]({ width:14, height:14 })}
              </div>
              <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:2, lineHeight:1.2 }}>{c.title}</div>
              <div style={{ fontSize:11, color:T.ink4 }}>{c.count} items</div>
            </button>
          ))}
        </div>

        {/* List + filter */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Recently saved</div>
          <div style={{ display:'flex', gap:4 }}>
            {['all','Lessons','Audio','Phrasebooks','Articles'].map((f, i) => {
              const active = (i === 0 && filter === 'all') || filter === f;
              return (
                <button key={f} onClick={() => setFilter(i === 0 ? 'all' : f)} style={{ padding:'6px 12px', fontSize:12, fontWeight: active ? 700 : 500, color: active ? T.ink : T.ink3, background: active ? T.card : 'transparent', border:`1px solid ${active ? T.border : 'transparent'}`, borderRadius:8 }}>
                  {f === 'all' ? 'All' : f}
                </button>
              );
            })}
          </div>
        </div>

        {libLoading && <div style={{ padding:'40px', textAlign:'center', color:T.ink4, fontSize:13 }}>Loading your library…</div>}
        {!libLoading && items.length === 0 && (
          <div style={{ padding:'40px', textAlign:'center', color:T.ink4, fontSize:13, border:`1px dashed ${T.border}`, borderRadius:14 }}>
            Nothing here yet. Practice a module or generate content and your items appear here.
          </div>
        )}
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:12 }}>
          {items.filter(it => filter==='all' || it.kind === filter.replace(/s$/, '')).map((item, i) => (
            <button key={i} data-nav={item.nav} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'16px 18px', textAlign:'left', display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:item.c.bg, color:item.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {Icon[item.kind === 'Audio' ? 'head' : item.kind === 'Lesson' ? 'pen' : item.kind === 'Phrasebook' ? 'message' : 'book']({ width:15, height:15 })}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                  <Chip label={item.kind} accent={T.ink3} bg={T.bg2} style={{ fontSize:9.5, padding:'2px 7px' }}/>
                  <div style={{ fontSize:10.5, color:T.ink4 }}>{item.tag}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.25 }}>{item.title}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:3, display:'flex', alignItems:'center', gap:4 }}>
                  {Icon.clock({ width:11, height:11 })} {item.time}
                </div>
              </div>
              <div style={{ color: item.saved ? T.brand : T.ink5 }}>
                {Icon.bookmark({ width:14, height:14, fill: item.saved ? 'currentColor' : 'none' })}
              </div>
            </button>
          ))}
        </div>
        </div>

        {/* Right rail */}
        <aside style={{ position:'sticky', top:0, alignSelf:'start', display:'flex', flexDirection:'column', gap:14 }}>
          <Card padding={16}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Reading goal</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:10 }}>
              <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>3.4h</div>
              <div style={{ fontSize:11.5, color:T.ink4 }}>/ 5h this week</div>
            </div>
            <Bar pct={68} color={T.brand}/>
            <div style={{ fontSize:10.5, color:T.ink4, marginTop:8 }}>1h 36m to go · resets Monday</div>
          </Card>

          <Card padding={16}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Tags</div>
              <button data-nav="search" style={{ fontSize:11, color:T.ink3, fontWeight:600 }}>Manage</button>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {[
                { l:'IELTS', n:42 },{ l:'Grammar', n:28 },{ l:'Vocab', n:31 },
                { l:'Audio', n:18 },{ l:'B2', n:14 },{ l:'Travel', n:9 },{ l:'Business', n:7 },
              ].map(t => (
                <button key={t.l} data-nav="search" style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:7, padding:'5px 9px', fontSize:11, color:T.ink2, fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                  {t.l} <span style={{ color:T.ink4, fontWeight:500 }}>{t.n}</span>
                </button>
              ))}
            </div>
          </Card>

          <Card padding={16}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Recently read</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { title:'Cohesive devices in essays', meta:'Read 2d ago · 14 min', n:'lesson_article' },
                { title:'Café Madrid pack',           meta:'Read 5d ago · audio', n:'listening' },
                { title:'NHK Easy News — April',      meta:'Read 1w ago · 5 art.', n:'reading' },
              ].map((it, i) => (
                <button key={i} data-nav={it.n} style={{ display:'block', textAlign:'left', background:'transparent' }}>
                  <div style={{ fontSize:12, fontWeight:600, color:T.ink, lineHeight:1.25, marginBottom:2 }}>{it.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink4 }}>{it.meta}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card padding={16} style={{ background:`linear-gradient(160deg, ${T.brandSoft} 0%, ${T.brandLight} 100%)`, border:`1px solid ${T.brand}26` }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Tip</div>
            <div style={{ fontSize:13, color:T.ink, fontWeight:600, lineHeight:1.3, marginBottom:10 }}>Highlight as you read — your saved phrases sync to Vocab.</div>
            <button data-nav="vocab" style={{ fontSize:11.5, fontWeight:700, color:T.brand, display:'inline-flex', alignItems:'center', gap:4 }}>Open vocab →</button>
          </Card>
        </aside>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LibraryPage });
