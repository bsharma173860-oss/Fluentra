// ── Mobile · Lesson Detail / Phrasebook / Phrasebook Practice / Add Lang / Mock Test ──

function MPhrasebookPractice() {
  const nav = window.__nav || (() => {});
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const lang = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const [phrases, setPhrases] = useState(null);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState('listen');
  React.useEffect(function () {
    if (!S) { setPhrases([]); return; }
    S.listPhrases(lang).then(function (r) { setPhrases(r || []); }).catch(function () { setPhrases([]); });
  }, [lang]);

  const all = phrases || [];
  const total = all.length;
  const phrase = all[idx];
  const progress = total ? ((idx + 1) / total) * 100 : 0;

  const next = () => { setRevealed(false); if (idx < total - 1) setIdx(idx + 1); else nav('phrasebook'); };
  const prev = () => { setRevealed(false); if (idx > 0) setIdx(idx - 1); };

  if (phrases === null) return (
    <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:T.ink3, background:T.bg }}>Loading…</div>
  );
  if (total === 0) return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, padding:32, background:T.bg }}>
      <div style={{ fontSize:14, color:T.ink3, textAlign:'center' }}>No saved phrases to practice yet.</div>
      <button onClick={() => nav('phrasebook')} style={{ padding:'11px 18px', borderRadius:11, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, border:'none', cursor:'pointer' }}>Back to phrasebook</button>
    </div>
  );

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:T.card, borderBottom:`1px solid ${T.hairline}` }}>
            <button onClick={() => nav('phrasebook')} style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer' }}>×</button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Saved phrases</div>
              <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden', marginTop:3 }}>
                <div style={{ width:`${progress}%`, height:'100%', background:T.brand, borderRadius:99, transition:'width .3s' }}/>
              </div>
            </div>
            <div style={{ fontFamily:T.mono, fontSize:11.5, color:T.ink2 }}>{idx + 1}/{total}</div>
          </div>

          {/* Mode toggle */}
          <div style={{ display:'flex', justifyContent:'center', padding:'14px 0 6px' }}>
            <div style={{ display:'inline-flex', background:T.bg2, padding:3, borderRadius:99, gap:2 }}>
              {[
                { id:'listen', label:'Listen', ic:Icon.play },
                { id:'speak',  label:'Speak', ic:Icon.mic },
              ].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{ padding:'7px 14px', borderRadius:99, fontSize:11.5, fontWeight:700, background: mode===m.id ? T.card : 'transparent', color: mode===m.id ? T.ink : T.ink3, boxShadow: mode===m.id ? '0 1px 3px rgba(0,0,0,.06)' : 'none', display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>{m.ic && m.ic({ width:10, height:10 })} {m.label}</button>
              ))}
            </div>
          </div>

          {/* Card */}
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'12px 16px' }}>
            <div style={{ width:'100%', background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'30px 22px', textAlign:'center', boxShadow:'0 6px 18px rgba(0,0,0,.04)' }}>
              <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.3, color:T.ink, marginBottom:16, fontStyle:'italic' }}>"{phrase?.front || ''}"</div>
              <button onClick={()=>{ if (window.flSpeak && phrase) window.flSpeak(phrase.front, lang); }} style={{ width:60, height:60, borderRadius:'50%', background: mode==='speak'?T.speaking.c:T.brand, color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow: mode==='speak' ? `0 8px 18px ${T.speaking.c}55` : `0 8px 18px ${T.brand}55`, cursor:'pointer', marginBottom:18, border:'none' }}>{mode==='speak' ? Icon.mic({ width:20, height:20 }) : Icon.play({ width:20, height:20 })}</button>
              {revealed ? (
                <div style={{ borderTop:`1px solid ${T.hairline}`, paddingTop:14 }}>
                  <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:5 }}>Translation</div>
                  <div style={{ fontSize:15, color:T.ink2, lineHeight:1.45 }}>{phrase?.back || '—'}</div>
                </div>
              ) : (
                <button onClick={() => setRevealed(true)} style={{ fontSize:12, fontWeight:700, color:T.brand, padding:'7px 12px', borderRadius:7, background:T.bg2, cursor:'pointer' }}>Reveal translation</button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', background:T.card, borderTop:`1px solid ${T.hairline}` }}>
            <button onClick={prev} disabled={idx===0} style={{ width:44, height:44, borderRadius:11, background:T.bg2, color:idx===0?T.ink5:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', cursor:idx===0?'default':'pointer', opacity:idx===0?.5:1 }}>←</button>
              <button onClick={next} style={{ flex:1, padding:'12px 0', borderRadius:11, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', border:'none' }}>{idx === total - 1 ? 'Finish' : 'Next phrase →'}</button>
          </div>
    </div>
  );
}

// ── Add Language (mobile) ─────────────────────────────────────