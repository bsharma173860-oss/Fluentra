// ── Mobile · Vocabulary deck ────────────────────────────────
// Mobile flashcard study + deck browser

function MVocabPage() {
  const [mode, setMode] = useState('browse');
  const [activeDeck, setActiveDeck] = useState(0);

  const decks = [
    { title:'Café & restaurants', lang:'es', count:42, due:8,  mastered:21, accent:T.es,  tag:'A2' },
    { title:'Travel & directions', lang:'es', count:38, due:5,  mastered:30, accent:T.es,  tag:'A2' },
    { title:'Body & health',       lang:'fr', count:54, due:12, mastered:18, accent:T.fr,  tag:'B1' },
    { title:'JLPT N4 Verbs',       lang:'ja', count:120,due:22, mastered:64, accent:T.ja,  tag:'N4' },
    { title:'Business & meetings', lang:'en', count:60, due:15, mastered:42, accent:T.en,  tag:'B2' },
  ];
  const deck = decks[activeDeck];

  const words = [
    { word:'la cuenta',    pos:'noun · f.', trans:'the bill / check', ex:'¿Me trae la cuenta, por favor?',     strength:4, due:'today',  starred:true  },
    { word:'pedir',        pos:'verb',      trans:'to order / ask',   ex:'Voy a pedir el plato del día.',       strength:5, due:'in 12d', starred:false },
    { word:'la propina',   pos:'noun · f.', trans:'the tip',          ex:'Es costumbre dejar propina aquí.',     strength:2, due:'today',  starred:true  },
    { word:'recomendar',   pos:'verb',      trans:'to recommend',     ex:'¿Qué nos recomienda usted?',           strength:1, due:'today',  starred:true  },
    { word:'la sobremesa', pos:'noun · f.', trans:'after-meal chat',  ex:'La sobremesa se alargó.',              strength:2, due:'today',  starred:true  },
  ];

  if (mode === 'study') return <MVocabStudy deck={deck} words={words} onExit={() => setMode('browse')}/>;

  return (
    <>
      <MobileHeader title="Vocabulary" eyebrow="22 cards due today" large right={
        <button style={{ width:36, height:36, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2 }}>{Icon.search()}</button>
      }/>
      <MobileBody padding={0}>
        {/* Stat strip */}
        <div style={{ padding:'4px 20px 16px', display:'flex', gap:10 }}>
          {[
            { v:'199', l:'mastered' },
            { v:'22',  l:'due today' },
            { v:'87%', l:'retention' },
          ].map(s => (
            <div key={s.l} style={{ flex:1, background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:'10px 12px' }}>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{s.v}</div>
              <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Big start CTA */}
        <div style={{ padding:'0 20px 18px' }}>
          <button onClick={() => setMode('study')} style={{ width:'100%', background:T.brandGrad, color:'#fff', borderRadius:16, padding:'18px 20px', display:'flex', alignItems:'center', gap:14, textAlign:'left', boxShadow:`0 10px 24px ${T.brand}33`, border:'none' }}>
            <div style={{ width:46, height:46, borderRadius:14, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {Icon.spark({ width:20, height:20 })}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:700 }}>Start daily review</div>
              <div style={{ fontSize:11.5, opacity:.85, marginTop:2 }}>22 cards across 4 decks · ~7 min</div>
            </div>
            {Icon.arrow({ width:16, height:16 })}
          </button>
        </div>

        {/* Decks */}
        <div style={{ padding:'0 20px 100px' }}>
          <MobileSectionHead title="Your decks" action="New"/>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {decks.map((d, i) => {
              const pct = Math.round((d.mastered / d.count) * 100);
              return (
                <button key={i} onClick={() => setActiveDeck(i)} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:14, display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:d.accent.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <Flag code={d.lang} w={22} h={15}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.title}</div>
                      {d.due > 0 && <div style={{ fontSize:9.5, fontWeight:700, color:T.brand, background:T.brandLight, padding:'2px 5px', borderRadius:4, flexShrink:0 }}>{d.due}</div>}
                    </div>
                    <div style={{ fontSize:11, color:T.ink4, marginBottom:5 }}>{d.tag} · {d.count} cards · {d.mastered} mastered</div>
                    <Bar pct={pct} color={d.accent.accent} track={T.trackWarm} height={3}/>
                  </div>
                  <div style={{ color:T.ink5 }}>{Icon.chev({ width:14, height:14 })}</div>
                </button>
              );
            })}
          </div>

          <MobileSectionHead title={`In this deck · ${deck.title}`} style={{ marginTop:20 }}/>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {words.slice(0, 4).map((w, i) => (
              <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{w.word}</div>
                    {w.starred && <div style={{ color:T.brand }}>{Icon.star({ width:10, height:10, fill:'currentColor' })}</div>}
                  </div>
                  <div style={{ fontSize:11.5, color:T.ink3, marginTop:2 }}>{w.trans} · {w.pos}</div>
                </div>
                <div style={{ display:'flex', gap:1.5 }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ width:4, height:11, borderRadius:1, background: n <= w.strength ? deck.accent.accent : T.track }}/>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileBody>
      <MobileTabBar active="library"/>
    </>
  );
}

// ── Mobile flashcard study ──────────────────────────────────
function MVocabStudy({ deck, words, onExit }) {
  const queue = words.filter(w => w.due === 'today').slice(0, 4);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = queue[idx] || queue[0];
  const accent = deck.accent.accent;
  const pct = (idx / queue.length) * 100;

  function rate() {
    setFlipped(false);
    if (idx < queue.length - 1) setIdx(idx + 1);
    else setIdx(0);
  }

  return (
    <>
      <div style={{ background:`linear-gradient(180deg, ${deck.accent.bg} 0%, ${T.bg} 70%)`, flex:1, display:'flex', flexDirection:'column' }}>
        {/* Top bar */}
        <div style={{ padding:'8px 16px 4px', display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={onExit} style={{ width:36, height:36, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2 }}>{Icon.x()}</button>
          <div style={{ flex:1, height:6, background:T.trackWarm, borderRadius:3, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background:accent, borderRadius:3, transition:'width .3s' }}/>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink2, minWidth:44, textAlign:'right' }}>{idx + 1}/{queue.length}</div>
        </div>

        {/* Card stack */}
        <div style={{ flex:1, padding:'20px 20px 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start' }}>
          <div style={{ position:'relative', width:'100%', height:380 }}>
            <div style={{ position:'absolute', inset:0, transform:'translate(6px, 6px) rotate(1deg)', background:T.card, borderRadius:20, border:`1px solid ${T.border}`, opacity:.5 }}/>
            <div style={{ position:'absolute', inset:0, transform:'translate(3px, 3px) rotate(.5deg)', background:T.card, borderRadius:20, border:`1px solid ${T.border}`, opacity:.8 }}/>

            <button onClick={() => setFlipped(!flipped)} style={{
              position:'absolute', inset:0, background:T.card, borderRadius:20, border:`1px solid ${T.border}`, padding:'22px 22px',
              boxShadow:'0 14px 30px rgba(0,0,0,.10)',
              display:'flex', flexDirection:'column', textAlign:'left', cursor:'pointer'
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <Flag code={deck.lang} w={20} h={13}/>
                  <Chip label={card.pos} accent={accent} bg={`${accent}1f`} style={{ fontSize:9, padding:'2px 7px' }}/>
                </div>
                <div style={{ color: card.starred ? T.brand : T.ink5 }}>{Icon.star({ width:14, height:14, fill: card.starred ? 'currentColor' : 'none' })}</div>
              </div>

              <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center', padding:'10px 0' }}>
                {!flipped ? (
                  <>
                    <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.05, marginBottom:10 }}>{card.word}</div>
                    <div style={{ fontSize:11.5, color:T.ink4 }}>Tap to reveal</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.1, marginBottom:14 }}>{card.trans}</div>
                    <div style={{ width:40, height:1, background:T.border, marginBottom:14 }}/>
                    <div style={{ fontSize:13.5, color:T.ink2, fontStyle:'italic', lineHeight:1.5, padding:'0 6px' }}>"{card.ex}"</div>
                  </>
                )}
              </div>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:10.5, color:T.ink4 }}>
                <div style={{ display:'flex', gap:1.5 }}>
                  {[1,2,3,4,5].map(n => (
                    <div key={n} style={{ width:5, height:10, borderRadius:1, background: n <= card.strength ? accent : T.track }}/>
                  ))}
                </div>
                <div>+5 XP</div>
              </div>
            </button>
          </div>

          {/* Action area */}
          <div style={{ marginTop:24, width:'100%' }}>
            {!flipped ? (
              <Btn label="Show answer" size="lg" accent={accent} fullWidth onClick={() => setFlipped(true)}/>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { label:'Again', sub:'<1 min',  c:'#C0392B' },
                  { label:'Hard',  sub:'6 min',   c:'#C04A06' },
                  { label:'Good',  sub:'1 day',   c:'#1A8F4E' },
                  { label:'Easy',  sub:'4 days',  c:'#5B4EFF' },
                ].map(g => (
                  <button key={g.label} onClick={rate} style={{ background:T.card, border:`1.5px solid ${g.c}33`, borderRadius:12, padding:'12px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:g.c }}>{g.label}</div>
                    <div style={{ fontSize:10, color:T.ink4 }}>{g.sub}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { MVocabPage });
