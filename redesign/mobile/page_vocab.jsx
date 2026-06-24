// ── Mobile · Vocabulary deck ────────────────────────────────
// Mobile flashcard study + deck browser

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
