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
function getExamStreams() {
  var R = (typeof window !== 'undefined' && window.__results) ? window.__results : [];
  function toRun(r) {
    var unit = (r.detail && r.detail.unit) ? r.detail.unit : '/9';
    var sc = Number(r.score) || 0;
    var val = unit === '%' ? Math.round(sc) : Math.round(sc / 100 * 9 * 2) / 2;
    var mod = (r.detail && r.detail.module) || '';
    var labelMap = { reading:'Reading', listening:'Listening', writing:'Writing', speaking:'Speaking', mock_exam:'Full mock' };
    return { date: r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined, { month:'short', day:'numeric' }) : 'Recent', score: val, unit: unit, label: labelMap[mod] || 'Session', delta: null, dur: '' };
  }
  var exams = R.filter(function (r) { return r.detail && r.detail.module === 'mock_exam'; }).map(toRun);
  var practice = R.filter(function (r) { return r.detail && ['reading','listening','writing','speaking'].indexOf(r.detail.module) >= 0; }).map(toRun);
  return {
    monthly:  { key:'monthly',  label:'Monthly · Official', subtitle:'Official record · $5 each', accent:T.brand, bg:T.brandLight, ic:'trophy', runs: [] },
    mock:     { key:'mock',     label:'Mock · Practice run', subtitle:'Free · not on your record', accent:'#5B7CFF', bg:'#EEF2FF', ic:'play', runs: exams },
    practice: { key:'practice', label:'Practice · Single skill', subtitle:'Drills · logged for analytics', accent:T.listening.c, bg:T.listening.bg, ic:'bars', runs: practice },
  };
}

function ExamStreamsPanel() {
  const [tab, setTab] = React.useState('monthly');
  const STREAMS = getExamStreams();
  const stream = STREAMS[tab];
  const hasRuns = stream.runs.length > 0;
  const _u = hasRuns ? stream.runs[0].unit : '';
  const avg = hasRuns ? (stream.runs.reduce((s,r)=>s+r.score,0) / stream.runs.length).toFixed(1) : '\u2014';
  const best = hasRuns ? Math.max(...stream.runs.map(r=>r.score)).toFixed(1) : '\u2014';
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
        {Object.values(STREAMS).map(s => {
          const on = s.key === tab;
          return (
            <button key={s.key} onClick={()=>setTab(s.key)}
              style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 13px', borderRadius:9, border:`1px solid ${on?s.accent:T.border}`, background:on?s.bg:T.card, cursor:'pointer' }}>
              <div style={{ width:18, height:18, borderRadius:5, background:s.bg, color:s.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[s.ic]({ width:10, height:10 })}</div>
              <div style={{ fontSize:11.5, fontWeight:on?700:600, color:on?s.accent:T.ink2 }}>{s.label}</div>
              <div style={{ fontSize:10, color:T.ink4, fontWeight:600 }}>{STREAMS[s.key].runs.length}</div>
            </button>
          );
        })}
      </div>
      {/* Summary strip */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0, padding:'18px 22px', borderBottom:`1px solid ${T.hairline}`, marginTop:14 }}>
        {[
          { l:'Attempts', v:stream.runs.length },
          { l:'Avg',      v:`${avg}${_u}` },
          { l:'Best',     v:`${best}${_u}` },
        ].map((s,i) => (
          <div key={s.l} style={{ borderLeft: i>0 ? `1px solid ${T.hairline}` : 'none', paddingLeft: i>0 ? 18 : 0 }}>
            <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:5 }}>{s.l}</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{s.v}</div>
          </div>
        ))}
      </div>
      {/* Run rows */}
      <div style={{ padding:'8px 12px 14px' }}>
        {!hasRuns && (<div style={{ padding:'24px', textAlign:'center', color:T.ink4, fontSize:12.5 }}>No attempts in this stream yet — take one to start your log.</div>)}
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
  const [results, setResults] = React.useState(null);
  React.useEffect(function () {
    var c = false;
    if (window.FL && window.FL.fetchResults) {
      window.FL.fetchResults(300).then(function (rows) { if (!c) setResults(rows || []); }).catch(function () { if (!c) setResults([]); });
    } else { setResults([]); }
    return function () { c = true; };
  }, []);
  const R = results || [];
  const loading = results === null;
  const MOD = {
    reading:   { ic:'book', c:T.reading,   title:'Reading'   },
    listening: { ic:'head', c:T.listening, title:'Listening' },
    speaking:  { ic:'mic',  c:T.speaking,  title:'Speaking'  },
    writing:   { ic:'pen',  c:T.writing,   title:'Writing'   },
  };
  const modOf = (r) => (r.detail && r.detail.module) || 'reading';
  const scoreOf = (r) => Number(r.score) || 0;
  const now = Date.now();
  const sessions = R.length;
  const last7 = R.filter(r => r.updated_at && (now - new Date(r.updated_at).getTime()) < 7 * 86400000).length;
  const langCount = (typeof window !== 'undefined' && window.__userLanguages ? window.__userLanguages.length : 0);

  const perMod = ['speaking','writing','listening','reading'].map(k => {
    const rows = R.filter(r => modOf(r) === k);
    return { ic:MOD[k].ic, c:MOD[k].c, title:MOD[k].title, n:rows.length };
  });
  const maxN = Math.max(1, ...perMod.map(m => m.n));

  const weeks = [];
  for (let w = 7; w >= 0; w--) {
    const start = now - (w + 1) * 7 * 86400000, end = now - w * 7 * 86400000;
    const n = R.filter(r => { const t = r.updated_at ? new Date(r.updated_at).getTime() : 0; return t >= start && t < end; }).length;
    weeks.push({ label:'', score:n });
  }

  const rel = (ts) => { if (!ts) return ''; const d = (now - new Date(ts).getTime()) / 86400000; if (d < 1) return 'today'; if (d < 2) return 'yesterday'; return Math.floor(d) + 'd ago'; };
  const recent = R.slice(0, 5).map(r => { const k = modOf(r); return { ic:MOD[k].ic, c:MOD[k].c, title:MOD[k].title, meta:rel(r.updated_at), score:scoreOf(r) }; });

  const dayCounts = {};
  R.forEach(r => { if (r.updated_at) { const key = new Date(r.updated_at).toISOString().slice(0, 10); dayCounts[key] = (dayCounts[key] || 0) + 1; } });
  const heat = [];
  for (let i = 83; i >= 0; i--) { const key = new Date(now - i * 86400000).toISOString().slice(0, 10); heat.push(dayCounts[key] || 0); }

  const stats = [
    { eyebrow:'Sessions',  value:String(sessions),     delta: sessions ? 'all time' : 'none yet', up:null },
    { eyebrow:'This week', value:String(last7),         delta: last7 ? 'keep going' : '0 so far',  up: last7 > 0 },
    { eyebrow:'Streak',    value:(USER.streak || 0) + 'd', delta:'current',                        up:null },
    { eyebrow:'Languages', value:String(langCount),     delta:'studying',                         up:null },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader eyebrow="Progress" title={sessions ? "Here's your activity." : "No sessions yet."} />

        {loading ? (
          <div style={{ padding:'60px', textAlign:'center', color:T.ink4, fontSize:13 }}>Loading your progress…</div>
        ) : sessions === 0 ? (
          <Card padding={40}>
            <div style={{ textAlign:'center', color:T.ink3, fontSize:14 }}>
              No practice sessions logged yet.<br/>
              <span style={{ fontSize:12.5, color:T.ink4 }}>Finish a Reading, Listening, Speaking or Writing session and it shows up here.</span>
            </div>
          </Card>
        ) : (
        <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 300px', gap:28, alignItems:'start' }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:24 }}>
            {stats.map(s => (
              <Card key={s.eyebrow} padding={20}>
                <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{s.eyebrow}</div>
                <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1, marginBottom:6 }}>{s.value}</div>
                <div style={{ fontSize:11, color: s.up === true ? T.listening.c : T.ink4, fontWeight:600 }}>{s.delta}</div>
              </Card>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20, marginBottom:24 }}>
            <Card padding={22}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Sessions per week</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>last 8 weeks</div>
                </div>
              </div>
              <MiniLineChart data={weeks} color={T.brand} w={560} h={180}/>
            </Card>

            <Card padding={22}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>By module</div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {perMod.map(m => (
                  <div key={m.title} style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:32, height:32, borderRadius:9, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {Icon[m.ic]({ width:13, height:13 })}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                        <div style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{m.title}</div>
                        <div style={{ fontSize:11.5, color:T.ink3, fontWeight:600 }}>{m.n} {m.n === 1 ? 'session' : 'sessions'}</div>
                      </div>
                      <Bar pct={(m.n / maxN) * 100} color={m.c.c}/>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* ── Learner-model insights: per-skill ability ± confidence + concept mastery ── */}
          {(function () {
            var _lang = (typeof window !== 'undefined' && window.__langCode) || 'en';
            var prof = null, cm = null;
            try { prof = window.FL && window.FL.learnerProfile ? window.FL.learnerProfile(_lang) : null; } catch (e) {}
            try { cm = window.FL && window.FL.conceptModel ? window.FL.conceptModel(_lang) : null; } catch (e) {}
            if (!prof || !prof.sessions) return null;
            var langName = (typeof langByCode === 'function' ? (langByCode(_lang) || {}).english : '') || '';
            var skills = prof.skills || {};
            var concepts = cm ? Object.keys(cm.components).map(function (k) { return cm.components[k]; }).filter(function (m) { return m.n >= 1; }).sort(function (a, b) { return a.mastery - b.mastery; }) : [];
            return (
              <Card padding={22} style={{ marginBottom:24 }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Skill mastery</div>
                  <div style={{ fontSize:10.5, color:T.ink4 }}>{langName ? langName + ' · ' : ''}ability ± confidence</div>
                </div>
                <div style={{ fontSize:11, color:T.ink4, marginBottom:16 }}>Estimated from your real scores — the lighter band shows how sure the estimate is.</div>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {['reading','listening','writing','speaking'].map(function (k) {
                    var s = skills[k]; var Mm = MOD[k];
                    var has = s && s.count >= 2 && s.ability != null;
                    var lo = has ? Math.max(0, s.ability - s.uncertainty) : 0;
                    var bandW = has ? Math.min(100 - lo, 2 * s.uncertainty) : 0;
                    return (
                      <div key={k} style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:32, height:32, borderRadius:9, background:Mm.c.bg, color:Mm.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[Mm.ic]({ width:13, height:13 })}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:5 }}>
                            <div style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{Mm.title}{has && s.trend ? <span style={{ fontSize:10.5, color: s.trend > 4 ? T.listening.c : (s.trend < -4 ? T.speaking.c : T.ink4), fontWeight:600, marginLeft:7 }}>{s.trend > 4 ? '↑ improving' : (s.trend < -4 ? '↓ slipping' : '· steady')}</span> : null}</div>
                            <div style={{ fontSize:11.5, color:T.ink3, fontWeight:600 }}>{has ? (s.ability + '% ±' + s.uncertainty) : 'need 2+ sessions'}</div>
                          </div>
                          {has ? (
                            <div style={{ position:'relative', height:6, background:T.bg3, borderRadius:99 }}>
                              <div style={{ position:'absolute', left:lo + '%', width:bandW + '%', top:0, bottom:0, background:Mm.c.c, opacity:.22, borderRadius:99 }}/>
                              <div style={{ position:'absolute', left:'calc(' + s.ability + '% - 2px)', top:-2, width:4, height:10, background:Mm.c.c, borderRadius:2 }}/>
                            </div>
                          ) : <div style={{ height:6, background:T.bg3, borderRadius:99 }}/>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {concepts.length ? (
                  <div style={{ marginTop:22, paddingTop:20, borderTop:`1px solid ${T.border}` }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:4 }}>Concept mastery</div>
                    <div style={{ fontSize:11, color:T.ink4, marginBottom:14 }}>Specific grammar & vocabulary points, weakest first.</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                      {concepts.slice(0, 14).map(function (m) {
                        var pct = Math.round(m.mastery * 100);
                        var col = pct < 50 ? T.speaking.c : (pct < 70 ? T.writing.c : T.listening.c);
                        return (
                          <div key={m.key}>
                            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4 }}>
                              <span style={{ fontSize:12, color:T.ink, fontWeight:600, textTransform:'capitalize' }}>{m.label}</span>
                              <span style={{ fontSize:11, color:T.ink3 }}>{pct}% <span style={{ color:T.ink4 }}>· {m.n} {m.n === 1 ? 'try' : 'tries'}</span></span>
                            </div>
                            <Bar pct={pct} color={col}/>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginTop:20, paddingTop:18, borderTop:`1px solid ${T.border}`, fontSize:12, color:T.ink4, lineHeight:1.5 }}>Concept-level mastery appears once you complete AI-generated reading or listening sets — each question is tagged with the grammar or vocabulary point it tests.</div>
                )}
                {(function () {
                  var mm = null; try { mm = window.FL && window.FL.masteryModel ? window.FL.masteryModel(_lang) : null; } catch (e) {}
                  var crits = mm ? Object.keys(mm.components).map(function (k) { return mm.components[k]; }).filter(function (m) { return m.n >= 1; }).sort(function (a, b) { return a.mastery - b.mastery; }) : [];
                  if (!crits.length) return null;
                  return (
                    <div style={{ marginTop:22, paddingTop:20, borderTop:`1px solid ${T.border}` }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:4 }}>Writing &amp; speaking criteria</div>
                      <div style={{ fontSize:11, color:T.ink4, marginBottom:14 }}>Production-quality dimensions from AI grading, weakest first.</div>
                      <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
                        {crits.map(function (m) {
                          var pct = Math.round(m.mastery * 100);
                          var col = pct < 50 ? T.speaking.c : (pct < 70 ? T.writing.c : T.listening.c);
                          return (
                            <div key={m.key}>
                              <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4 }}>
                                <span style={{ fontSize:12, color:T.ink, fontWeight:600, textTransform:'capitalize' }}>{m.label}</span>
                                <span style={{ fontSize:11, color:T.ink3 }}>{pct}% <span style={{ color:T.ink4 }}>· {m.n} {m.n === 1 ? 'session' : 'sessions'}</span></span>
                              </div>
                              <Bar pct={pct} color={col}/>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </Card>
            );
          })()}

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
              {heat.map((n, i) => {
                const lvl = n >= 4 ? 4 : n === 3 ? 3 : n === 2 ? 2 : n === 1 ? 1 : 0;
                const colors = [T.bg3, '#F0D9CF', '#E5A78C', '#C04A06', '#7A2E00'];
                return <div key={i} style={{ aspectRatio:'1', borderRadius:3, background:colors[lvl] }}/>;
              })}
            </div>
          </Card>

          <div style={{ marginTop:24 }}>
            <ExamStreamsPanel/>
          </div>
        </div>

        <aside style={{ position:'sticky', top:0, alignSelf:'start', display:'flex', flexDirection:'column', gap:14 }}>
          <Card padding={16} style={{ background:`linear-gradient(160deg, ${T.brandSoft} 0%, ${T.brandLight} 100%)`, border:`1px solid ${T.brand}26` }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Streak</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
              <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{USER.streak || 0}</div>
              <div style={{ fontSize:12, color:T.ink3 }}>days</div>
            </div>
            <div style={{ fontSize:11, color:T.ink3, marginBottom:10 }}>{last7} {last7 === 1 ? 'session' : 'sessions'} in the last 7 days.</div>
            <div style={{ display:'flex', gap:3 }}>
              {Array.from({ length:14 }).map((_, i) => {
                const dayN = dayCounts[new Date(now - (13 - i) * 86400000).toISOString().slice(0, 10)] || 0;
                return <div key={i} style={{ flex:1, height:18, borderRadius:3, background: dayN > 0 ? T.brand : T.bg3 }}/>;
              })}
            </div>
          </Card>

          <Card padding={16}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Recent sessions</div>
            <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
              {recent.length === 0 ? <div style={{ fontSize:12, color:T.ink4 }}>Nothing yet.</div> : recent.map((r, i) => (
                <button key={i} onClick={() => window.__nav && window.__nav(r.ic === 'mic' ? 'speaking' : r.ic === 'pen' ? 'writing' : r.ic === 'head' ? 'listening' : 'reading')} style={{ display:'flex', alignItems:'center', gap:9, textAlign:'left', background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
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
        </aside>
        </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { ProgressPage });
