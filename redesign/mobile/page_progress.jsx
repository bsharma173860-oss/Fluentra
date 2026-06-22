// ── Mobile · Progress v5 — full mobile-native analytics ─────
// Mirrors web Progress 1:1 (line chart, stats, modules, heatmap,
// exam streams, streak rail, goals, sessions, insights) — sized
// for 390px width with strong mobile rhythm.

function MProgressLineChart({ data, color, w=350, h=150 }) {
  const _vals = (data && data.length) ? data.map(function (d) { return d.score; }) : [0, 100];
  let minY = Math.min.apply(null, _vals), maxY = Math.max.apply(null, _vals);
  if (minY === maxY) { minY = Math.max(0, minY - 10); maxY = maxY + 10; }
  const pad = { l:28, r:8, t:12, b:22 };
  const innerW = w - pad.l - pad.r, innerH = h - pad.t - pad.b;
  const pts = data.map((d, i) => ({
    x: pad.l + (i / Math.max(data.length - 1, 1)) * innerW,
    y: pad.t + (1 - (d.score - minY) / (maxY - minY)) * innerH,
    label:d.label, score:d.score,
  }));
  const path = pts.reduce((a, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = pts[i-1]; const cx = prev.x + (p.x - prev.x) / 2;
    return `${a} C ${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`;
  }, '');
  const area = `${path} L ${pts[pts.length-1].x} ${pad.t+innerH} L ${pts[0].x} ${pad.t+innerH} Z`;
  return (
    <svg width={w} height={h} style={{ display:'block', maxWidth:'100%' }}>
      {[0,1,2,3,4].map(k => {
        const g = Math.round(minY + (maxY - minY) * k / 4);
        const y = pad.t + (1 - (g - minY) / (maxY - minY)) * innerH;
        return <g key={k}>
          <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={T.hairline}/>
          <text x={pad.l - 4} y={y + 3} fontSize="9" fill={T.ink4} textAnchor="end">{g}</text>
        </g>;
      })}
      <defs>
        <linearGradient id="mpgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".22"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#mpgGrad)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"/>
      {pts.map((p, i) => <g key={i}>
        <circle cx={p.x} cy={p.y} r="3.5" fill="#fff" stroke={color} strokeWidth="2"/>
        <text x={p.x} y={h - 5} fontSize="9" fill={T.ink4} textAnchor="middle">{p.label}</text>
      </g>)}
    </svg>
  );
}

// Mobile exam-stream tabs — the web ExamStreamsPanel ported
function MExamStreamsPanel() {
  const STREAMS = (typeof getExamStreams === 'function') ? getExamStreams() : null;
  const fallback = {
    monthly: { key:'monthly', label:'Monthly', subtitle:'Official · counts', accent:T.brand, bg:T.brandLight, ic:'trophy', runs:[
      { date:'Apr 12', score:7.5, unit:'/9', label:'IELTS · Full', delta:+0.5, dur:'2h 45m', verified:true },
      { date:'Mar 14', score:7.0, unit:'/9', label:'IELTS · Full', delta:+0.5, dur:'2h 40m', verified:true },
      { date:'Feb 10', score:6.5, unit:'/9', label:'IELTS · Full', delta:null, dur:'2h 50m', verified:true },
    ]},
    mock: { key:'mock', label:'Mock', subtitle:'Free · not on record', accent:'#5B7CFF', bg:'#EEF2FF', ic:'play', runs:[
      { date:'Apr 18', score:7.5, unit:'/9', label:'Full mock', delta:+0.5, dur:'2h 38m' },
      { date:'Apr 6',  score:7.0, unit:'/9', label:'Full mock', delta:0,    dur:'2h 42m' },
      { date:'Mar 28', score:7.0, unit:'/9', label:'Full mock', delta:+0.5, dur:'2h 50m' },
    ]},
    practice: { key:'practice', label:'Practice', subtitle:'Drills · logged', accent:T.listening.c, bg:T.listening.bg, ic:'bars', runs:[
      { date:'Today',     score:7.5, unit:'/9', label:'Reading · P2',  delta:+0.5, dur:'18 min' },
      { date:'Yesterday', score:6.5, unit:'/9', label:'Writing · T2',  delta:-0.5, dur:'42 min' },
      { date:'2d ago',    score:8.0, unit:'/9', label:'Listening · S3',delta:+1.0, dur:'14 min' },
      { date:'3d ago',    score:7.0, unit:'/9', label:'Speaking · P2', delta:0,    dur:'12 min' },
    ]},
  };
  const src = STREAMS || fallback;
  const [tab, setTab] = React.useState('monthly');
  const stream = src[tab];
  const hasRuns = stream.runs.length > 0;
  const _u = hasRuns ? stream.runs[0].unit : '';
  const avg = hasRuns ? (stream.runs.reduce((s,r)=>s+r.score,0) / stream.runs.length).toFixed(1) : '\u2014';
  const best = hasRuns ? Math.max(...stream.runs.map(r=>r.score)).toFixed(1) : '\u2014';
  const tabKeys = ['monthly','mock','practice'];

  return (
    <MCard style={{ padding:0, overflow:'hidden' }}>
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Exam attempts</div>
        <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>Three separate streams</div>
      </div>
      {/* Tabs — horizontal scroll */}
      <div style={{ display:'flex', gap:6, padding:'12px 14px 12px', overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
        {tabKeys.map(k => {
          const s = src[k]; const on = k === tab;
          return (
            <button key={k} onClick={()=>setTab(k)} style={{
              display:'flex', alignItems:'center', gap:7, padding:'7px 11px', borderRadius:9,
              border:`1px solid ${on?s.accent:T.border}`, background:on?s.bg:T.card, flexShrink:0, cursor:'pointer',
            }}>
              <div style={{ width:18, height:18, borderRadius:5, background:on?'#fff':s.bg, color:s.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[s.ic]({ width:10, height:10 })}</div>
              <div style={{ fontSize:11.5, fontWeight:on?700:600, color:on?s.accent:T.ink2 }}>{s.label}</div>
              <div style={{ fontSize:10, color:T.ink4, fontWeight:600 }}>{s.runs.length}</div>
            </button>
          );
        })}
      </div>
      {/* Summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', padding:'14px 16px', borderTop:`1px solid ${T.hairline}`, borderBottom:`1px solid ${T.hairline}` }}>
        {[
          { l:'Attempts', v:stream.runs.length },
          { l:'Avg',      v:`${avg}${_u}` },
          { l:'Best',     v:`${best}${_u}` },
        ].map((s,i) => (
          <div key={s.l} style={{ borderLeft: i>0 ? `1px solid ${T.hairline}` : 'none', paddingLeft: i>0 ? 14 : 0 }}>
            <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>{s.l}</div>
            <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1 }}>{s.v}</div>
          </div>
        ))}
      </div>
      {/* Run rows */}
      <div style={{ padding:'4px 8px 8px' }}>
        {!hasRuns && (<div style={{ padding:'20px', textAlign:'center', color:T.ink4, fontSize:12 }}>No attempts yet.</div>)}
        {stream.runs.map((r,i) => (
          <button key={i} onClick={()=>window.__nav && window.__nav(tab==='monthly'?'monthly_results':tab==='mock'?'mock_results':'practice_results')}
            style={{ width:'100%', display:'grid', gridTemplateColumns:'56px 1fr auto auto', gap:8, alignItems:'center', padding:'10px 8px', borderRadius:9, background:'transparent', border:'none', textAlign:'left', cursor:'pointer' }}>
            <div style={{ fontSize:10.5, color:T.ink4, fontWeight:600 }}>{r.date}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.label}</div>
                {r.verified && <div style={{ fontSize:8.5, fontWeight:800, color:stream.accent, background:stream.bg, padding:'2px 5px', borderRadius:4, letterSpacing:'.06em', flexShrink:0 }}>VERIFIED</div>}
              </div>
              <div style={{ fontSize:10, color:T.ink4, marginTop:2 }}>{r.dur}</div>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
              <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1 }}>{r.score.toFixed(1)}</div>
              <div style={{ fontSize:9, color:T.ink4 }}>{r.unit}</div>
            </div>
            <div style={{ fontSize:10.5, fontWeight:700, color: r.delta == null ? T.ink4 : r.delta>=0 ? T.listening.c : T.brand, minWidth:30, textAlign:'right' }}>
              {r.delta == null ? '—' : `${r.delta>=0?'+':''}${r.delta.toFixed(1)}`}
            </div>
          </button>
        ))}
      </div>
    </MCard>
  );
}

function MProgress() {
  const nav = (id) => window.__nav && window.__nav(id);
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const lang = (typeof langByCode === 'function') ? langByCode(code) : LANGUAGES[0];
  const t = langTheme(lang.code);
  const [period, setPeriod] = React.useState('Month');
  const _R = (typeof window !== 'undefined' && window.__results) ? window.__results.slice() : [];
  const _scoreOf = function (r) { return Number(r.score) || 0; };
  const _modOf = function (r) { return (r.detail && r.detail.module) || 'reading'; };
  const _sessions = _R.length;
  const _scores = _R.map(_scoreOf);
  const _avg = _sessions ? Math.round(_scores.reduce(function (a,b){return a+b;},0)/_sessions) : 0;
  const _best = _sessions ? Math.round(Math.max.apply(null,_scores)) : 0;
  const _streak = (window.__user && window.__user.streak) || 0;
  const _fmtD = function (r) { return r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined,{month:'short',day:'numeric'}) : 'Recent'; };
  const _modMeta = { speaking:{ic:'mic',c:T.speaking,title:'Speaking',nav:'speaking'}, writing:{ic:'pen',c:T.writing,title:'Writing',nav:'writing'}, listening:{ic:'head',c:T.listening,title:'Listening',nav:'listening'}, reading:{ic:'book',c:T.reading,title:'Reading',nav:'reading'} };
  const _week = _R.filter(function (r) { return r.updated_at && new Date(r.updated_at).getTime() >= (Date.now()-7*864e5); }).length;

  const trend = _R.slice(0,8).reverse().map(function (r) { return { label:_fmtD(r), score:_scoreOf(r) }; });
  const stats = [
    { label:'Avg score', value:(_sessions ? _avg + '%' : '—'), color:t.accent },
    { label:'Sessions',  value:String(_sessions) },
    { label:'Streak',    value:(_streak + 'd') },
    { label:'Best',      value:(_sessions ? _best + '%' : '—') },
  ];
  const modules = ['speaking','writing','listening','reading'].map(function (k) {
    var rs = _R.filter(function (r) { return _modOf(r) === k; });
    var avg = rs.length ? Math.round(rs.reduce(function (a,r){return a+_scoreOf(r);},0)/rs.length) : null;
    return Object.assign({}, _modMeta[k], { score:avg, count:rs.length });
  });
  const heatColors = [T.bg3, '#F0D9CF', '#E5A78C', '#C04A06', '#7A2E00'];
  const _dayCount = {};
  _R.forEach(function (r) { if (r.updated_at) { var d=new Date(r.updated_at); var k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); _dayCount[k]=(_dayCount[k]||0)+1; } });
  const heatCells = Array.from({ length:84 }).map(function (_, i) { var d=new Date(); d.setDate(d.getDate()-(83-i)); var k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate(); var c=_dayCount[k]||0; return c>=4?4:c===3?3:c===2?2:c===1?1:0; });
  const recent = _R.slice(0,3).map(function (r) { var mm=_modMeta[_modOf(r)]||_modMeta.reading; return { ic:mm.ic, c:mm.c, title:mm.title, meta:_fmtD(r), score:String(Math.round(_scoreOf(r))), nav:mm.nav }; });
  const goals = [
    { l:'5 sessions / week', pct:Math.min(100, Math.round(_week/5*100)), meta:(_week + ' of 5 done') },
    { l:'Lift your average', pct:_avg, meta:(_sessions ? ('Avg ' + _avg + '%') : 'Complete a lesson to start') },
  ];

  return (
    <>
      <MobileHeader
        title="You're trending up."
        eyebrow={`Progress · ${lang.english}`}
        large
      />
      <MobileBody padding={0}>
        {/* Period selector */}
        <div style={{ padding:'2px 18px 14px' }}>
          <div style={{ display:'flex', gap:3, padding:3, background:T.bg2, borderRadius:9, border:`1px solid ${T.border}` }}>
            {['Week','Month','3M','Year'].map(p => {
              const on = p === period;
              return (
                <button key={p} onClick={()=>setPeriod(p)} style={{
                  flex:1, padding:'7px 10px', fontSize:11.5, fontWeight: on ? 700 : 500,
                  color: on ? T.ink : T.ink3, background: on ? T.card : 'transparent',
                  border:`1px solid ${on ? T.border : 'transparent'}`, borderRadius:7, cursor:'pointer',
                }}>{p}</button>
              );
            })}
          </div>
        </div>

        {/* Stats — 2x2 */}
        <div style={{ padding:'0 18px 14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {stats.map(s => (
            <MCard key={s.label} style={{ padding:14 }}>
              <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:7 }}>{s.label}</div>
              <div style={{ fontFamily:T.serif, fontSize:30, color:s.color || T.ink, lineHeight:1, marginBottom:4 }}>{s.value}</div>
              <div style={{ fontSize:10.5, color: s.up === true ? T.listening.c : s.up === false ? T.brand : T.ink4, fontWeight:600 }}>{s.delta || s.meta}</div>
            </MCard>
          ))}
        </div>

        {/* Streak rail card — gradient hero */}
        <div style={{ padding:'0 18px 14px' }}>
          <MCard style={{ padding:16, background:`linear-gradient(160deg, ${T.brandSoft} 0%, ${T.brandLight} 100%)`, border:`1px solid ${T.brand}26` }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase' }}>Streak</div>
              <button onClick={()=>nav('streak')} style={{ fontSize:11, color:T.ink3, fontWeight:600, background:'transparent', border:'none', cursor:'pointer' }}>Calendar →</button>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
              <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{_streak}</div>
              <div style={{ fontSize:12, color:T.ink3 }}>{_streak === 1 ? 'day' : 'days'}</div>
            </div>
            <div style={{ display:'flex', gap:3, marginTop:10 }}>
              {Array.from({ length:14 }).map((_,i) => (
                <div key={i} style={{ flex:1, height:18, borderRadius:3, background: i < Math.min(_streak,14) ? T.brand : T.bg3 }}/>
              ))}
            </div>
          </MCard>
        </div>

        {/* Band over time */}
        <div style={{ padding:'0 18px 14px' }}>
          <MCard style={{ padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Score over time</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>Last 30 days</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:5, padding:'5px 9px', borderRadius:99, background:T.listening.bg, color:T.listening.c }}>
                {Icon.trending({ width:11, height:11 })}
                <span style={{ fontSize:10.5, fontWeight:700 }}>Trending</span>
              </div>
            </div>
            {trend.length >= 2 ? <MProgressLineChart data={trend} color={T.brand} w={322} h={150}/> : <div style={{ padding:'30px 0', textAlign:'center', color:T.ink4, fontSize:12 }}>Complete a few lessons to see your trend.</div>}
          </MCard>
        </div>

        {/* By module */}
        <div style={{ padding:'0 18px 14px' }}>
          <MCard style={{ padding:0 }}>
            <div style={{ padding:'14px 16px', borderBottom:`1px solid ${T.hairline}`, fontSize:13, fontWeight:700, color:T.ink }}>By module</div>
            {modules.map((m, i, all) => (
              <button key={m.title} onClick={()=>nav(m.nav)} style={{
                width:'100%', textAlign:'left', cursor:'pointer', background:'transparent', border:'none',
                display:'flex', alignItems:'center', gap:11, padding:'12px 16px',
                borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none',
              }}>
                <div style={{ width:34, height:34, borderRadius:10, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {Icon[m.ic]({ width:14, height:14 })}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{m.title}</div>
                    <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                      <span style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{m.score == null ? '—' : m.score + '%'}</span>
                      <span style={{ fontSize:10, color:T.ink4, fontWeight:700 }}>{m.count} {m.count === 1 ? 'session' : 'sessions'}</span>
                    </div>
                  </div>
                  <div style={{ height:4, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
                    <div style={{ width:`${m.score == null ? 0 : m.score}%`, height:'100%', background:m.c.c }}/>
                  </div>
                </div>
              </button>
            ))}
          </MCard>
        </div>

        {/* Activity heatmap */}
        <div style={{ padding:'0 18px 14px' }}>
          <MCard style={{ padding:16 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Activity · 12 weeks</div>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:9.5, color:T.ink4 }}>
                <span>Less</span>
                {heatColors.map(c => <div key={c} style={{ width:9, height:9, borderRadius:2, background:c }}/>)}
                <span>More</span>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gap:3 }}>
              {heatCells.map((lvl, i) => (
                <div key={i} style={{ aspectRatio:'1', borderRadius:3, background:heatColors[lvl] }}/>
              ))}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:9.5, color:T.ink4, marginTop:8 }}>
              <span>12 wks ago</span><span>Today</span>
            </div>
          </MCard>
        </div>

        {/* Exam streams */}
        <div style={{ padding:'0 18px 14px' }}>
          <MExamStreamsPanel/>
        </div>

        {/* Goals */}
        <div style={{ padding:'0 18px 14px' }}>
          <MCard style={{ padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>Goals</div>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              {goals.map(g => (
                <div key={g.l}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:T.ink }}>{g.l}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>{g.pct}%</div>
                  </div>
                  <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
                    <div style={{ width:`${g.pct}%`, height:'100%', background:T.brand }}/>
                  </div>
                  <div style={{ fontSize:10, color:T.ink4, marginTop:4 }}>{g.meta}</div>
                </div>
              ))}
            </div>
          </MCard>
        </div>

        {/* Recent sessions */}
        <div style={{ padding:'0 18px 14px' }}>
          <MCard style={{ padding:0 }}>
            <div style={{ padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:`1px solid ${T.hairline}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Recent sessions</div>
              <button onClick={()=>nav('practice')} style={{ fontSize:11, color:T.ink3, fontWeight:600, background:'transparent', border:'none', cursor:'pointer' }}>All →</button>
            </div>
            {recent.length === 0 && (<div style={{ padding:'22px 16px', textAlign:'center', color:T.ink4, fontSize:12 }}>No sessions yet — your recent practice appears here.</div>)}
            {recent.map((r, i, all) => (
              <button key={i} onClick={()=>nav(r.nav)} style={{
                width:'100%', textAlign:'left', cursor:'pointer', background:'transparent', border:'none',
                display:'flex', alignItems:'center', gap:10, padding:'11px 16px',
                borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none',
              }}>
                <div style={{ width:30, height:30, borderRadius:8, background:r.c.bg, color:r.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[r.ic]({ width:12, height:12 })}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, lineHeight:1.2 }}>{r.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{r.meta}</div>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink }}>{r.score}</div>
              </button>
            ))}
          </MCard>
        </div>

        {/* Insight */}
        <div style={{ padding:'0 18px 0' }}>
          <MCard style={{ padding:16, background:t.bg, border:`1px solid ${t.accent}22` }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:11 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:t.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.spark({ width:14, height:14 })}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9.5, fontWeight:800, color:t.accent, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Insight</div>
                <div style={{ fontSize:13, color:T.ink, lineHeight:1.4, fontWeight:600 }}>Listening jumped +1.0 — keep the daily podcast going.</div>
                <div style={{ fontSize:11, color:T.ink3, marginTop:4, lineHeight:1.4 }}>Writing slipped 0.5. Try one Task 2 essay this week to recover.</div>
                <button onClick={()=>nav('writing')} style={{ marginTop:10, fontSize:11.5, fontWeight:700, color:T.brand, background:'transparent', border:'none', cursor:'pointer', padding:0 }}>Open writing →</button>
              </div>
            </div>
          </MCard>
        </div>
      </MobileBody>
      <MobileTabBar active="progress"/>
    </>
  );
}

Object.assign(window, { MProgress });
