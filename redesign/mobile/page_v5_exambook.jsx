// Mobile · Exam Book + Exam History · v5

function MExamHistoryPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const _R = ((typeof window !== 'undefined' && window.__results) || []).filter(function (r) { return r && typeof r.score === 'number'; });
  const _band = function (pct) { return (pct / 100 * 9).toFixed(1); };
  const attempts = _R.slice().reverse().slice(0, 20).map(function (r, i) {
    var m = r.module || 'practice';
    var label = m.charAt(0).toUpperCase() + m.slice(1);
    return { d: '#' + (_R.length - i), n: label + ((r.detail && r.detail.unit) ? (' · ' + r.detail.unit) : ''), s: _band(r.score), t: 'Module attempt', mode: 'practice' };
  });
  const _scores = _R.map(function (r) { return r.score; });
  const stats = [
    { l:'BEST',  v: _scores.length ? _band(Math.max.apply(null, _scores)) : '\u2014' },
    { l:'AVG',   v: _scores.length ? _band(_scores.reduce(function (a, b) { return a + b; }, 0) / _scores.length) : '\u2014' },
    { l:'TREND', v: _scores.length >= 2 ? (_scores[_scores.length-1] >= _scores[0] ? '\u2197' : '\u2198') : '\u2014' },
  ];
  return (
    <>
      <MobileHeader back title="Exam history"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 14px' }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', marginBottom:8 }}>{attempts.length} ATTEMPTS</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>Past exams</div>
          <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>Every attempt and how you scored. Tap any to see the full breakdown.</div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {stats.map(s => (
            <MCard key={s.l} style={{ padding:'12px 10px', textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div>
              <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginTop:5 }}>{s.l}</div>
            </MCard>
          ))}
        </div>

        {attempts.length === 0 ? <MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13, lineHeight:1.55 }}>No attempts yet. Finish a module or exam and your scores will appear here.</div></MCard> : <><div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>ATTEMPTS</div>
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {attempts.map((a, i) => {
            const tagBg = a.mode === 'monthly' ? T.brandLight : a.mode === 'mock' ? '#5A9C7A1a' : '#7C5BD61a';
            const tagFg = a.mode === 'monthly' ? T.brand : a.mode === 'mock' ? '#5A9C7A' : '#7C5BD6';
            return <button key={i} onClick={()=>nav(`${a.mode}_results`)} style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background:'none', textAlign:'left' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:4 }}>{a.d.toUpperCase()}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{a.n}</div>
                <div style={{ display:'flex', gap:5, marginTop:5 }}>
                  <span style={{ fontSize:9.5, fontWeight:700, color:tagFg, padding:'2px 7px', borderRadius:99, background:tagBg, letterSpacing:'.04em' }}>{a.t}</span>
                </div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{a.s}</div>
                <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:3 }}>BAND</div>
              </div>
              <span style={{ color:T.ink5 }}>›</span>
            </button>;
          })}
        </MCard></>}

        <button onClick={()=>nav('exam_entry')} style={{ width:'100%', marginTop:14, padding:'13px', borderRadius:12, background:T.ink, color:'#fff', fontSize:12.5, fontWeight:700 }}>Book another exam</button>
      </MobileBody>
    </>
  );
}

Object.assign(window, { MExamHistoryPageV5 });
