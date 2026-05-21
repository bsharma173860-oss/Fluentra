// ── Page 5: Progress ────────────────────────────────────────
// Analytics-heavy: line chart, module breakdown, calendar heatmap

function MiniLineChart({ data, color, w=520, h=140 }) {
  const minY = 4, maxY = 9;
  const pad = { l:30, r:10, t:14, b:24 };
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
    <svg width={w} height={h}>
      {[5,6,7,8,9].map(g => {
        const y = pad.t + (1 - (g - minY) / (maxY - minY)) * innerH;
        return <g key={g}>
          <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={T.hairline}/>
          <text x={pad.l - 6} y={y + 3} fontSize="10" fill={T.ink4} textAnchor="end">{g}.0</text>
        </g>;
      })}
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity=".18"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path d={area} fill="url(#grad)"/>
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {pts.map((p, i) => <g key={i}>
        <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={color} strokeWidth="2"/>
        <text x={p.x} y={h - 6} fontSize="10" fill={T.ink4} textAnchor="middle">{p.label}</text>
      </g>)}
    </svg>
  );
}

// ── Exam-attempt streams (3 separate logs) ────────────────────
const EXAM_STREAMS = {
  monthly: {
    key:'monthly', label:'Monthly · Official', subtitle:'Counts toward your record · $5 each',
    accent:T.brand, bg:T.brandLight, ic:'trophy',
    runs:[
      { date:'Apr 12', score:7.5, unit:'/9', label:'IELTS Academic · Full', delta:+0.5, dur:'2h 45m', verified:true },
      { date:'Mar 14', score:7.0, unit:'/9', label:'IELTS Academic · Full', delta:+0.5, dur:'2h 40m', verified:true },
      { date:'Feb 10', score:6.5, unit:'/9', label:'IELTS Academic · Full', delta:null, dur:'2h 50m', verified:true },
    ],
  },
  mock: {
    key:'mock', label:'Mock · Practice run', subtitle:'Free · Not on your record',
    accent:'#5B7CFF', bg:'#EEF2FF', ic:'play',
    runs:[
      { date:'Apr 18', score:7.5, unit:'/9', label:'Full mock', delta:+0.5, dur:'2h 38m' },
      { date:'Apr 6',  score:7.0, unit:'/9', label:'Full mock', delta:0,    dur:'2h 42m' },
      { date:'Mar 28', score:7.0, unit:'/9', label:'Full mock', delta:+0.5, dur:'2h 50m' },
      { date:'Mar 18', score:6.5, unit:'/9', label:'Full mock', delta:null, dur:'2h 55m' },
    ],
  },
  practice: {
    key:'practice', label:'Practice · Single skill', subtitle:'Drills · Logged for analytics',
    accent:T.listening.c, bg:T.listening.bg, ic:'bars',
    runs:[
      { date:'Today',     score:7.5, unit:'/9',   label:'Reading · Passage 2', delta:+0.5, dur:'18 min' },
      { date:'Yesterday', score:6.5, unit:'/9',   label:'Writing · Task 2',    delta:-0.5, dur:'42 min' },
      { date:'2d ago',    score:8.0, unit:'/9',   label:'Listening · Sec 3',   delta:+1.0, dur:'14 min' },
      { date:'3d ago',    score:7.0, unit:'/9',   label:'Speaking · Part 2',   delta:0,    dur:'12 min' },
      { date:'5d ago',    score:7.0, unit:'/9',   label:'Reading · Passage 1', delta:+0.5, dur:'20 min' },
    ],
  },
};

function ExamStreamsPanel() {
  const [tab, setTab] = React.useState('monthly');
  const stream = EXAM_STREAMS[tab];
  const avg = (stream.runs.reduce((s,r)=>s+r.score,0) / stream.runs.length).toFixed(1);
  const best = Math.max(...stream.runs.map(r=>r.score)).toFixed(1);
  return (
    <Card padding={0} style={{ overflow:'hidden' }}>
      {/* Tabs */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px 0' }}>
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Exam attempts</div>
          <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Three separate logs · pick a stream below</div>
        </div>
        <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Stream · <span style={{ color:T.ink2, fontFamily:'ui-monospace,monospace', textTransform:'none', letterSpacing:0 }}>attempts.{stream.key}</span></div>
      </div>
      <div style={{ display:'flex', gap:6, padding:'14px 22px 0' }}>
        {Object.values(EXAM_STREAMS).map(s => {
          const on = s.key === tab;
          return (
            <button key={s.key} onClick={()=>setTab(s.key)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 13px', borderRadius:9, border:`1px solid ${on?s.accent:T.border}`, background:on?s.bg:T.card, cursor:'pointer' }}>
              <div style={{ width:18, height:18, borderRadius:5, background:s.bg, color:s.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[s.ic]({ width:10, height:10 })}</div>
              <div style={{ fontSize:11.5, fontWeight:on?700:600, color:on?s.accent:T.ink2 }}>{s.label}</div>
              <div style={{ fontSize:10, color:T.ink4, fontWeight:600 }}>{EXAM_STREAMS[s.key].runs.length}</div>
            </button>
          );
        })}
      </div>
      {/* Summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0, padding:'18px 22px', borderBottom:`1px solid ${T.hairline}`, marginTop:14 }}>
        {[
          { l:'Attempts', v:stream.runs.length },
          { l:'Avg',      v:`${avg}${stream.runs[0].unit}` },
          { l:'Best',     v:`${best}${stream.runs[0].unit}` },
        ].map((s,i) => (
          <div key={s.l} style={{ borderLeft: i>0 ? `1px solid ${T.hairline}` : 'none', paddingLeft: i>0 ? 18 : 0 }}>
            <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:5 }}>{s.l}</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{s.v}</div>
          </div>
        ))}
      </div>
      {/* Run rows */}
      <div style={{ padding:'8px 12px 14px' }}>
        {stream.runs.map((r,i) => (
          <button key={i} data-nav={tab==='monthly'?'monthly_results':tab==='mock'?'mock_results':'practice_results'}
            style={{ width:'100%', display:'grid', gridTemplateColumns:'72px 1fr auto auto', gap:12, alignItems:'center', padding:'12px 10px', borderRadius:9, background:'transparent', border:'none', textAlign:'left', cursor:'pointer' }}
            onMouseOver={e=>e.currentTarget.style.background=T.bg2} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:600 }}>{r.date}</div>
            <div style={{ minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{r.label}</div>
                {r.verified && <div style={{ fontSize:9, fontWeight:800, color:stream.accent, background:stream.bg, padding:'2px 6px', borderRadius:4, letterSpacing:'.06em' }}>VERIFIED</div>}
              </div>
              <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{r.dur}{tab==='mock'?' · not recorded':tab==='practice'?' · drill log':' · official record'}</div>
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{r.score.toFixed(1)}</div>
              <div style={{ fontSize:10, color:T.ink4 }}>{r.unit}</div>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color: r.delta == null ? T.ink4 : r.delta>=0 ? T.listening.c : T.brand, minWidth:36, textAlign:'right' }}>
              {r.delta == null ? '—' : `${r.delta>=0?'+':''}${r.delta.toFixed(1)}`}
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}

function ProgressPage() {
  const data = [
    { label:'Mar 12', score:6.0 }, { label:'Mar 19', score:6.5 },
    { label:'Mar 26', score:7.0 }, { label:'Apr 2', score:7.0 },
    { label:'Apr 5', score:7.0 }, { label:'Apr 12', score:7.5 },
  ];
  const modules = [
    { ic:'mic',  c:T.speaking,  title:'Speaking',  score:7.0, change:+0.5 },
    { ic:'pen',  c:T.writing,   title:'Writing',   score:6.5, change:-0.5 },
    { ic:'head', c:T.listening, title:'Listening', score:7.5, change:+1.0 },
    { ic:'book', c:T.reading,   title:'Reading',   score:7.0, change:+0.5 },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow="Progress · English"
          title="You're trending up."
          right={
            <div style={{ display:'flex', gap:4, padding:3, background:T.bg2, borderRadius:9 }}>
              {['Week','Month','3M','Year'].map((p, i) => (
                <button key={p} style={{ padding:'5px 14px', fontSize:12, fontWeight: i === 1 ? 700 : 500, color: i === 1 ? T.ink : T.ink3, background: i === 1 ? T.card : 'transparent', border:`1px solid ${i === 1 ? T.border : 'transparent'}`, borderRadius:7 }}>{p}</button>
              ))}
            </div>
          }
        />

        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 300px', gap:28, alignItems:'start' }}>
        <div style={{ minWidth:0 }}>
        {/* Top stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:24 }}>
          {[
            { eyebrow:'Avg band', value:'7.0', delta:'+0.5', up:true },
            { eyebrow:'Sessions',  value:'24',  delta:'+6 this week', up:true },
            { eyebrow:'Streak',    value:'23d', delta:'Longest: 31d',  up:null },
            { eyebrow:'Time',      value:'18h', delta:'+2.4h vs last', up:true },
          ].map(s => (
            <Card key={s.eyebrow} padding={20}>
              <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{s.eyebrow}</div>
              <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1, marginBottom:6 }}>{s.value}</div>
              <div style={{ fontSize:11, color: s.up === true ? T.listening.c : s.up === false ? T.brand : T.ink4, fontWeight:600 }}>{s.delta}</div>
            </Card>
          ))}
        </div>

        {/* Chart + module breakdown */}
        <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20, marginBottom:24 }}>
          <Card padding={22}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Band score over time</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>English · last 30 days</div>
              </div>
              <Chip label="Trending up" icon={Icon.trending({ width:11, height:11 })} accent={T.listening.c} bg={T.listening.bg}/>
            </div>
            <MiniLineChart data={data} color={T.brand} w={560} h={180}/>
          </Card>

          <Card padding={22}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>By module</div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {modules.map(m => (
                <div key={m.title} style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:32, height:32, borderRadius:9, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {Icon[m.ic]({ width:13, height:13 })}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                      <div style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{m.title}</div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                        <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1 }}>{m.score.toFixed(1)}</div>
                        <div style={{ fontSize:10.5, color: m.change >= 0 ? T.listening.c : T.brand, fontWeight:700 }}>{m.change >= 0 ? '+' : ''}{m.change.toFixed(1)}</div>
                      </div>
                    </div>
                    <Bar pct={(m.score / 9) * 100} color={m.c.c}/>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Calendar heatmap */}
        <Card padding={22}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Activity · last 12 weeks</div>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10.5, color:T.ink4 }}>
              <span>Less</span>
              {[T.bg3, '#F0D9CF', '#E5A78C', '#C04A06', '#7A2E00'].map(c => <div key={c} style={{ width:11, height:11, borderRadius:3, background:c }}/>)}
              <span>More</span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(84, 1fr)', gap:3 }}>
            {Array.from({ length:84 }).map((_,i) => {
              const v = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) / 2;
              const lvl = v > .5 ? 4 : v > .2 ? 3 : v > -.1 ? 2 : v > -.4 ? 1 : 0;
              const colors = [T.bg3, '#F0D9CF', '#E5A78C', '#C04A06', '#7A2E00'];
              return <div key={i} style={{ aspectRatio:'1', borderRadius:3, background:colors[lvl] }}/>;
            })}
          </div>
        </Card>

        {/* Exam attempt streams (3 separate logs) */}
        <div style={{ marginTop:24 }}>
          <ExamStreamsPanel/>
        </div>
        </div>

        {/* Right rail */}
        <aside style={{ position:'sticky', top:0, alignSelf:'start', display:'flex', flexDirection:'column', gap:14 }}>
          <Card padding={16} style={{ background:`linear-gradient(160deg, ${T.brandSoft} 0%, ${T.brandLight} 100%)`, border:`1px solid ${T.brand}26` }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Streak</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
              <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>23</div>
              <div style={{ fontSize:12, color:T.ink3 }}>days</div>
            </div>
            <div style={{ fontSize:11, color:T.ink3, marginBottom:10 }}>2 days from your longest run.</div>
            <div style={{ display:'flex', gap:3 }}>
              {Array.from({ length:14 }).map((_,i) => (
                <div key={i} style={{ flex:1, height:18, borderRadius:3, background: i < 12 ? T.brand : T.bg3 }}/>
              ))}
            </div>
          </Card>

          <Card padding={16}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Goals</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {[
                { l:'Reach band 7.5', pct:78, meta:'Avg 7.0 → 7.5' },
                { l:'5 sessions / week', pct:80, meta:'4 of 5 done' },
                { l:'Master 500 words', pct:82, meta:'412 / 500' },
              ].map(g => (
                <div key={g.l}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ fontSize:11.5, fontWeight:600, color:T.ink }}>{g.l}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>{g.pct}%</div>
                  </div>
                  <Bar pct={g.pct} color={T.brand}/>
                  <div style={{ fontSize:10, color:T.ink4, marginTop:4 }}>{g.meta}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card padding={16}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Recent sessions</div>
              <button data-nav="practice" style={{ fontSize:11, color:T.ink3, fontWeight:600 }}>All</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {[
                { ic:'mic',  c:T.speaking,  title:'Speaking · Part 2',  meta:'2h ago · 12 min', score:'7.5' },
                { ic:'pen',  c:T.writing,   title:'Task 2 essay',       meta:'Yesterday',       score:'6.5' },
                { ic:'head', c:T.listening, title:'Section 3',          meta:'2d ago',          score:'7.5' },
              ].map((r, i) => (
                <button key={i} data-nav={r.ic === 'mic' ? 'speaking' : r.ic === 'pen' ? 'writing' : 'listening'} style={{ display:'flex', alignItems:'center', gap:9, textAlign:'left', background:'transparent' }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:r.c.bg, color:r.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[r.ic]({ width:11, height:11 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:11.5, fontWeight:600, color:T.ink, lineHeight:1.2 }}>{r.title}</div>
                    <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>{r.meta}</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:13, color:T.ink }}>{r.score}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card padding={16}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Insights</div>
            <div style={{ fontSize:12, color:T.ink2, lineHeight:1.45, marginBottom:10 }}>
              Your <span style={{ color:T.writing.c, fontWeight:700 }}>writing</span> dipped 0.5 this week. Try one Task 2 essay to recover momentum.
            </div>
            <button data-nav="writing" style={{ fontSize:11.5, fontWeight:700, color:T.brand, display:'inline-flex', alignItems:'center', gap:4 }}>Open writing →</button>
          </Card>
        </aside>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProgressPage });
