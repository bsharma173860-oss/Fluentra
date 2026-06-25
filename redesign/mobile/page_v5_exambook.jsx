// Mobile · Exam Book + Exam History · v5

function MExamBookPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const code = window.__langCode || 'en';
  const lang = (typeof LANGUAGES !== 'undefined') ? (LANGUAGES.find(l => l.code === code) || LANGUAGES[0]) : { code:'en', english:'English' };
  const ex = (typeof examFor === 'function') ? examFor(lang.code) : { name:'IELTS', short:'IELTS', cost:'£190', duration:'2h 45m' };
  const [date, setDate] = React.useState(11);
  const [slot, setSlot] = React.useState('09:00');
  const [center, setCenter] = React.useState(0);
  const days = [9,10,11,12,15,16,17,18];
  const slots = ['09:00','11:30','14:00','16:30'];
  const centers = [
    { n:'British Council · London', a:'5 Spring Gardens, Westminster', d:'2.4 km' },
    { n:'IDP · King\'s Cross',        a:'1 Caledonia St, N1 9DX',          d:'4.1 km' },
    { n:'British Council · Camden',   a:'10 Spring Pl, NW5 3BH',           d:'5.8 km' },
  ];
  return (
    <>
      <MobileHeader back title="Book exam"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', padding:'4px 6px', marginBottom:9 }}>OFFICIAL · {(lang.english || '').toUpperCase()}</div>
        <div style={{ background:T.ink, borderRadius:18, padding:'22px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:9 }}>
            <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.05, letterSpacing:'-.02em' }}>{ex.name}</div>
            <div style={{ fontFamily:T.serif, fontSize:30, letterSpacing:'-.02em' }}>{ex.cost}</div>
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', lineHeight:1.5 }}>Schedule a real proctored sitting at an authorized centre. Results in 13 days.</div>
        </div>

        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>PICK A DATE · MAY</div>
        <div style={{ display:'flex', gap:7, overflowX:'auto', padding:'2px 6px 6px', marginBottom:14 }}>
          {days.map(d => {
            const a = d === date;
            return <button key={d} onClick={()=>setDate(d)} style={{ flexShrink:0, width:54, padding:'10px 0', borderRadius:13, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink, border:`1px solid ${a ? T.ink : T.hairline}`, textAlign:'center' }}>
              <div style={{ fontSize:9.5, fontWeight:800, color: a ? 'rgba(255,255,255,.6)' : T.ink4, letterSpacing:'.1em' }}>MON</div>
              <div style={{ fontFamily:T.serif, fontSize:22, marginTop:3, letterSpacing:'-.02em' }}>{d}</div>
            </button>;
          })}
        </div>

        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>TIME SLOT</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:14 }}>
          {slots.map(s => {
            const a = s === slot;
            return <button key={s} onClick={()=>setSlot(s)} style={{ padding:'12px', borderRadius:11, background: a ? T.brandLight : T.card, color: a ? T.brand : T.ink, border:`1px solid ${a ? T.brand+'55' : T.hairline}`, fontSize:13, fontWeight:700 }}>{s}</button>;
          })}
        </div>

        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>CENTRE</div>
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {centers.map((c, i) => {
            const a = i === center;
            return <button key={i} onClick={()=>setCenter(i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background: a ? T.bg2 : 'none', textAlign:'left' }}>
              <div style={{ width:18, height:18, borderRadius:9, background: a ? T.brand : T.card, border:`1.5px solid ${a ? T.brand : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{a && <div style={{ width:7, height:7, borderRadius:4, background:'#fff' }}/>}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{c.n}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{c.a} · {c.d}</div>
              </div>
            </button>;
          })}
        </MCard>

        <button onClick={()=>{ window.__checkoutItem='exam_official'; nav('checkout'); }} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Confirm · {ex.cost}</button>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink4, marginTop:9 }}>May {date} · {slot} · {centers[center].n.split('·')[0].trim()}</div>
      </MobileBody>
    </>
  );
}

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

Object.assign(window, { MExamBookPageV5, MExamHistoryPageV5 });
