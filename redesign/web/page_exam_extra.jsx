// ── Exam booking + Exam history ────────────────────────────

function ExamHistoryPage() {
  const rows = ((typeof window!=='undefined' && window.__results) ? window.__results : []).filter(function(r){ return r && r.detail && r.detail.module === 'mock_exam'; });
  rows.sort(function(a,b){ return new Date(b.updated_at) - new Date(a.updated_at); });
  const ABBR = { reading:'R', listening:'L', writing:'W', speaking:'S' };
  const attempts = rows.map(function(r, i){
    const langObj = (typeof langByCode==='function') ? langByCode(r.lang) : { english:r.lang, exam:'Mock' };
    const mods = {};
    (r.detail.sections||[]).forEach(function(sec){ mods[ABBR[sec.module]||sec.module] = Math.round(Number(sec.score)||0); });
    const prev = rows[i+1];
    const delta = (prev && typeof r.score==='number' && typeof prev.score==='number') ? (r.score - prev.score) : null;
    return {
      exam: ((langObj.exam||langObj.exam_type||'Mock')) + ' · ' + (langObj.english||langObj.english_name||(r.lang||'').toUpperCase()),
      date: r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : '',
      score: (typeof r.score==='number'? r.score+'%' : '—'),
      mods: mods,
      delta: delta,
      kind:'Mock',
    };
  });
  const scores = rows.map(function(r){ return Number(r.score)||0; }).filter(function(n){ return n>0; });
  const best = scores.length ? Math.max.apply(null, scores) : null;
  const avg = scores.length ? Math.round(scores.reduce(function(a,b){return a+b;},0)/scores.length) : null;
  const monthAgo = Date.now() - 30*86400000;
  const thisMonth = rows.filter(function(r){ return r.updated_at && new Date(r.updated_at).getTime() >= monthAgo; }).length;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Past attempts" title="Exam history" subtitle="Every mock exam you've taken, with module-level scores."
          right={<Btn label="Take a mock now" nav="exam_runner" accent={T.brand}/>}
        />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:24 }}>
          <StatTile label="Total mocks" value={String(rows.length)} big/>
          <StatTile label="Best score" value={best!=null?best+'%':'—'} big color={T.brand}/>
          <StatTile label="Average" value={avg!=null?avg+'%':'—'} big/>
          <StatTile label="This month" value={String(thisMonth)} big/>
        </div>
        {attempts.length === 0 ? (
          <Card padding={28}>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6 }}>No mock exams yet. Take a full mock — reading, listening, speaking, and writing back to back — and your scored attempts show up here. <span data-nav="exam_runner" style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Start a mock →</span></div>
          </Card>
        ) : (
        <Card padding={0}>
          <div style={{ padding:'14px 22px', borderBottom:`1px solid ${T.hairline}`, display:'grid', gridTemplateColumns:'1.4fr .9fr .7fr .6fr 1.4fr', gap:14, fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>
            <div>Exam</div><div>Date</div><div>Score</div><div>Δ</div><div>Modules (R · L · W · S)</div>
          </div>
          {attempts.map(function(a, i){ return (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1.4fr .9fr .7fr .6fr 1.4fr', gap:14, padding:'16px 22px', alignItems:'center', borderBottom: i < attempts.length-1 ? `1px solid ${T.hairline}` : 'none' }}>
              <div>
                <Chip label={a.kind} accent={T.ink3} bg={T.bg2} style={{ fontSize:9.5, padding:'2px 7px' }}/>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginTop:4 }}>{a.exam}</div>
              </div>
              <div style={{ fontSize:12.5, color:T.ink2 }}>{a.date}</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{a.score}</div>
              <div style={{ fontSize:12, fontWeight:700, color: a.delta==null ? T.ink4 : a.delta<0 ? '#B00020' : a.delta>0 ? '#1A8F4E' : T.ink4 }}>{a.delta==null?'—':(a.delta>0?'+':'')+a.delta}</div>
              <div style={{ display:'flex', gap:6 }}>
                {['R','L','W','S'].map(function(k){ return (
                  <div key={k} style={{ flex:1, padding:'4px 6px', background:T.bg2, borderRadius:6, textAlign:'center' }}>
                    <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700 }}>{k}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{a.mods[k]!=null?a.mods[k]:'—'}</div>
                  </div>
                ); })}
              </div>
            </div>
          ); })}
        </Card>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ExamHistoryPage });
