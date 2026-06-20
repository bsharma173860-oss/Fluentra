// ── Page 2: Language Detail ─────────────────────────────────
// Per-language hub with hero + tabs (Practice / Stats / Exams)

function LangHero({ lang }) {
  const t = langTheme(lang.code);
  const _rows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(function(r){ return r.lang === lang.code; }) : [];
  const _scored = _rows.filter(function(r){ return typeof r.score === 'number'; });
  const _bestPct = _scored.length ? Math.max.apply(null, _scored.map(function(r){ return r.score; })) : null;
  const _dates = _rows.map(function(r){ return r.updated_at; }).filter(Boolean).map(function(d){ return new Date(d).getTime(); }).filter(function(n){ return !isNaN(n); });
  const _daysActive = _dates.length ? Math.max(1, Math.round((Date.now() - Math.min.apply(null,_dates))/86400000)) : 0;
  return (
    <div style={{
      borderRadius:20, overflow:'hidden', position:'relative',
      background:`linear-gradient(135deg, ${t.accent} 0%, ${t.accent}dd 100%)`,
      color:'#fff', padding:'32px 36px',
    }}>
      {/* dot pattern */}
      <div style={{ position:'absolute', top:-30, right:-30, width:300, height:300, display:'grid', gridTemplateColumns:'repeat(15,1fr)', gap:14, opacity:.08, pointerEvents:'none' }}>
        {Array.from({ length:180 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
      </div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', position:'relative', zIndex:1, gap:32 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
            <div style={{ boxShadow:'0 4px 14px rgba(0,0,0,.25)', borderRadius:6, overflow:'hidden' }}>
              <Flag code={lang.code} w={56} h={38}/>
            </div>
            <Chip label={lang.exam} accent="#fff" bg="rgba(255,255,255,.18)"/>
            <Chip label={lang.level} accent="#fff" bg="rgba(255,255,255,.18)"/>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:56, lineHeight:1, marginBottom:6 }}>{lang.native}</div>
          <div style={{ fontSize:14, opacity:.85, fontWeight:500 }}>{lang.english}{_daysActive > 0 ? ' · Active for ' + _daysActive + ' day' + (_daysActive===1?'':'s') : ' · New'}</div>
        </div>
        <div style={{ display:'flex', gap:28, alignItems:'center' }}>
          <div style={{ textAlign:'center' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:4, justifyContent:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1 }}>{lang.streak}</div>
              <div style={{ fontSize:13, opacity:.75, fontWeight:600 }}>days</div>
            </div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', opacity:.85, marginTop:4 }}>Streak</div>
          </div>
          <div style={{ width:1, alignSelf:'stretch', background:'rgba(255,255,255,.25)' }}/>
          <div style={{ textAlign:'center' }}>
            <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1 }}>{_bestPct != null ? _bestPct + '%' : '—'}</div>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', opacity:.85, marginTop:4 }}>Best score</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleTile({ ic, title, sub, color, bg, score, nav }) {
  return (
    <button data-nav={nav} style={{ textAlign:'left', background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:20, cursor:'pointer', display:'flex', flexDirection:'column', gap:14, transition:'border-color .15s, transform .15s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ width:40, height:40, borderRadius:11, background:bg, color, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {Icon[ic]({ width:18, height:18 })}
        </div>
        <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>{score}</div>
      </div>
      <div>
        <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:2 }}>{title}</div>
        <div style={{ fontSize:11.5, color:T.ink3 }}>{sub}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto' }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:600 }}>Continue →</div>
      </div>
    </button>
  );
}

function LangDetailPage() {
  const code = window.__langCode || 'en';
  const lang = langByCode(code);
  const t = langTheme(lang.code);
  const [tab, setTab] = useState('practice');

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <div style={{ fontSize:11.5, color:T.ink4, marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ cursor:'pointer' }}>Languages</span>
          <span style={{ opacity:.4 }}>/</span>
          <span style={{ color:T.ink, fontWeight:600 }}>{lang.english}</span>
        </div>
        <LangHero lang={lang}/>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, borderBottom:`1px solid ${T.border}`, marginTop:28, marginBottom:28 }}>
          {[
            { id:'practice', label:'Practice' },
            { id:'study',    label:'Study' },
            { id:'stats',    label:'Stats' },
            { id:'exams',    label:'Exams' },
            { id:'library',  label:'Library' },
            { id:'tutor',    label:'AI Tutor' },
          ].map(tb => (
            <button key={tb.id} onClick={() => setTab(tb.id)} style={{ padding:'12px 20px', fontSize:13.5, fontWeight: tab === tb.id ? 700 : 500, color: tab === tb.id ? T.ink : T.ink3, borderBottom: `2px solid ${tab === tb.id ? t.accent : 'transparent'}`, marginBottom:-1, background:'transparent' }}>
              {tb.label}
            </button>
          ))}
        </div>

        {tab === 'practice' && (
          <>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>Modules</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:32 }}>
              {(() => {
                const pack = langPack(lang.code);
                const subs = pack.sub;
                const cnt = (typeof langContent === 'function') ? langContent(lang.code) : null;
                const hideSpeaking = !!cnt?.hideSpeaking;
                const rows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(r => r.lang === lang.code) : [];
                const bestMod = (m) => { const xs = rows.filter(r => r.detail && r.detail.module === m && typeof r.score === 'number'); return xs.length ? Math.max.apply(null, xs.map(r=>r.score)) + '%' : '—'; };
                return (
                  <>
                    {!hideSpeaking && <ModuleTile nav="speaking"  ic="mic"  title="Speaking"  sub={subs.speaking}  color={T.speaking.c}  bg={T.speaking.bg}  score={bestMod('speaking')}/>}
                    <ModuleTile nav="writing"   ic="pen"  title="Writing"   sub={subs.writing}    color={T.writing.c}   bg={T.writing.bg}   score={bestMod('writing')}/>
                    <ModuleTile nav="listening" ic="head" title="Listening" sub={subs.listening}  color={T.listening.c} bg={T.listening.bg} score={bestMod('listening')}/>
                    <ModuleTile nav="reading"   ic="book" title="Reading"   sub={subs.reading}    color={T.reading.c}   bg={T.reading.bg}   score={bestMod('reading')}/>
                  </>
                );
              })()}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>
              {/* Up next — lessons */}
              <Card padding={0}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Up next</div>
                  <button data-nav="course" style={{ fontSize:11.5, color:T.ink3, fontWeight:600, cursor:'pointer' }}>Course →</button>
                </div>
                {(() => {
                  const content = (typeof langContent === 'function') ? langContent(lang.code) : null;
                  const lessons = (content?.currentLessons || []).slice(0, 4);
                  return lessons.map((row, i, all) => (
                    <button key={i} data-nav="lesson_detail" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i < all.length-1 ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent' }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:t.bg, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {Icon.book({ width:15, height:15 })}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{row.unit || 'Lesson'}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.2 }}>{row.title}</div>
                        <div style={{ fontSize:11, color:T.ink4, marginTop:3 }}>{row.progress > 0 ? `${Math.round(row.progress*100)}% · ${row.mins||10} min` : `${row.mins||10} min · start`}</div>
                      </div>
                      <div style={{ fontSize:11.5, color:t.accent, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>{row.progress > 0 ? 'Resume' : 'Start'} {Icon.arrow({ width:11, height:11 })}</div>
                    </button>
                  ));
                })()}
              </Card>

              {/* Goals */}
              <Card padding={20}>
                {(() => {
                  const _wrows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(r => r.lang === lang.code) : [];
                  const _weekAgo = Date.now() - 7*86400000;
                  const _doneWk = _wrows.filter(r => r.updated_at && new Date(r.updated_at).getTime() >= _weekAgo).length;
                  const goal = { done: _doneWk, target: 7 };
                  const remaining = Math.max(0, goal.target - goal.done);
                  return (
                    <>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:14 }}>Weekly goal</div>
                      <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
                        <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1 }}>{goal.done}</div>
                        <div style={{ fontSize:13, color:T.ink4 }}>/ {goal.target} sessions</div>
                      </div>
                      <Bar pct={(goal.done/goal.target)*100} color={t.accent}/>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:8 }}>{remaining === 0 ? 'Goal reached for the week' : `${remaining} session${remaining===1?'':'s'} to go this week`}</div>
                    </>
                  );
                })()}

                <div style={{ height:1, background:T.hairline, margin:'18px 0' }}/>

                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:14 }}>Next exam</div>
                <div style={{ background:t.bg, borderRadius:12, padding:14, display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:t.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Icon.trophy({ width:16, height:16 })}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{lang.exam} mock</div>
                    <div style={{ fontSize:11, color:T.ink3, marginTop:2 }}>Apr 28 · 2h 45m</div>
                  </div>
                </div>
                <Btn label="Schedule mock" nav="mock_test" variant="outline" accent={t.accent} size="sm" fullWidth style={{ marginTop:12 }}/>
              </Card>
            </div>
          </>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            {/* Stat tiles */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {[
                { label: (langPack(lang.code).scoreLabel || 'Avg score'), value: (langPack(lang.code).score || '—'), delta:'+0.5', color:t.accent },
                { label:'Sessions',   value:'24',  delta:'+6 this week' },
                { label:'Study time', value:'18h', delta:'+2.4h vs last' },
                { label:'Streak',     value:'23d', meta:'Longest: 31d' },
              ].map(s => (
                <Card key={s.label} padding={20}>
                  <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{s.label}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
                    <div style={{ fontFamily:T.serif, fontSize:36, color:s.color||T.ink, lineHeight:1 }}>{s.value}</div>
                  </div>
                  {s.delta && <div style={{ fontSize:11, color:T.listening.c, fontWeight:600 }}>↑ {s.delta}</div>}
                  {s.meta  && <div style={{ fontSize:11, color:T.ink4 }}>{s.meta}</div>}
                </Card>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20 }}>
              {/* Band score mini-chart */}
              <Card padding={22}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
                  <div>
                    <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{(langPack(lang.code).exam?.scoreLabel) || 'Score'} over time</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{lang.english} · last 30 days</div>
                  </div>
                  <div style={{ display:'flex', gap:3, padding:3, background:T.bg2, borderRadius:8 }}>
                    {['7d','30d','90d'].map((p,i) => (
                      <button key={p} style={{ padding:'4px 10px', fontSize:11, fontWeight:i===1?700:500, color:i===1?T.ink:T.ink4, background:i===1?T.card:'transparent', border:`1px solid ${i===1?T.border:'transparent'}`, borderRadius:6 }}>{p}</button>
                    ))}
                  </div>
                </div>
                {/* SVG line chart */}
                {(() => {
                  const data = [{x:0,y:6.0},{x:1,y:6.0},{x:2,y:6.5},{x:3,y:6.5},{x:4,y:7.0},{x:5,y:7.0},{x:6,y:7.5}];
                  const W2=540,H2=140,pl=28,pr=10,pt=14,pb=28;
                  const iW=W2-pl-pr, iH=H2-pt-pb;
                  const pts=data.map(d=>({ x:pl+(d.x/6)*iW, y:pt+(1-(d.y-4)/5)*iH }));
                  const path=pts.reduce((a,p,i)=>{if(i===0)return`M${p.x} ${p.y}`;const prev=pts[i-1];const cx=prev.x+(p.x-prev.x)/2;return`${a} C${cx} ${prev.y} ${cx} ${p.y} ${p.x} ${p.y}`},'');
                  const area=`${path} L${pts[pts.length-1].x} ${pt+iH} L${pts[0].x} ${pt+iH} Z`;
                  const lbls=['Mar 12','Mar 19','Mar 26','Apr 2','Apr 5','Apr 9','Apr 12'];
                  return (
                    <svg width={W2} height={H2} style={{ overflow:'visible' }}>
                      <defs><linearGradient id={`g-${lang.code}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.accent} stopOpacity=".18"/><stop offset="100%" stopColor={t.accent} stopOpacity="0"/></linearGradient></defs>
                      {[5,6,7,8,9].map(g=>{const y=pt+(1-(g-4)/5)*iH;return<g key={g}><line x1={pl} y1={y} x2={W2-pr} y2={y} stroke={T.hairline}/><text x={pl-4} y={y+4} fontSize="9" fill={T.ink4} textAnchor="end">{g}</text></g>;})}
                      <path d={area} fill={`url(#g-${lang.code})`}/>
                      <path d={path} fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round"/>
                      {pts.map((p,i)=><g key={i}><circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke={t.accent} strokeWidth="2"/><text x={p.x} y={H2-4} fontSize="9" fill={T.ink4} textAnchor="middle">{lbls[i].replace('Mar ','M').replace('Apr ','A')}</text></g>)}
                    </svg>
                  );
                })()}
              </Card>

              {/* Module breakdown */}
              <Card padding={22}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:18 }}>By module</div>
                {[
                  { ic:'mic',  c:T.speaking,  title:'Speaking',  score:7.0, change:+0.5 },
                  { ic:'pen',  c:T.writing,   title:'Writing',   score:6.5, change:-0.5 },
                  { ic:'head', c:T.listening, title:'Listening', score:7.5, change:+1.0 },
                  { ic:'book', c:T.reading,   title:'Reading',   score:7.0, change:+0.5 },
                ].map(m=>(
                  <div key={m.title} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:13, height:13 })}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                        <span style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{m.title}</span>
                        <span style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                          <span style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1 }}>{m.score.toFixed(1)}</span>
                          <span style={{ fontSize:10.5, color:m.change>=0?T.listening.c:T.brand, fontWeight:700 }}>{m.change>=0?'+':''}{m.change.toFixed(1)}</span>
                        </span>
                      </div>
                      <Bar pct={(m.score/9)*100} color={m.c.c}/>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            {/* Activity heatmap */}
            <Card padding={22}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Activity · last 12 weeks</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10.5, color:T.ink4 }}>
                  Less {[T.bg3,'#F0D9CF','#E5A78C',t.accent+'cc',t.accent].map(c=><div key={c} style={{ width:11, height:11, borderRadius:3, background:c }}/>)} More
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(84,1fr)', gap:3 }}>
                {Array.from({length:84}).map((_,i)=>{
                  const v=(Math.sin(i*1.3)+Math.cos(i*0.7))/2;
                  const lvl=v>.5?4:v>.2?3:v>-.1?2:v>-.4?1:0;
                  const colors=[T.bg3,'#F0D9CF','#E5A78C',t.accent+'cc',t.accent];
                  return <div key={i} style={{ aspectRatio:'1', borderRadius:3, background:colors[lvl] }}/>;
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ── EXAMS TAB ── */}
        {tab === 'exams' && (() => {
          const cnt = (typeof langContent === 'function') ? langContent(lang.code) : null;
          const ex = { primary: cnt?.primaryExam || { name:`${lang.english} certification`, cycle:'May 2026', date:'May 15', registered:60, fee:'$5' }, others: cnt?.otherExams || [] };
          const examHistory = cnt?.examHistory || [];
          const skillTargets = cnt?.skillTargets || [];
          const colorFor = mod => mod==='speaking'?T.speaking : mod==='writing'?T.writing : mod==='listening'?T.listening : T.reading;
          const iconFor  = mod => mod==='speaking'?'mic'      : mod==='writing'?'pen'      : mod==='listening'?'head'      : 'book';
          const titleFor = mod => mod.charAt(0).toUpperCase() + mod.slice(1);
          return (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Monthly exam card */}
            <div style={{ background:T.ink, borderRadius:20, padding:'28px 32px', color:'#fff', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-30, right:-30, width:240, height:240, display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:12, opacity:.05, pointerEvents:'none' }}>
                {Array.from({length:100}).map((_,i)=><div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
              </div>
              <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr auto', gap:24, alignItems:'center' }}>
                <div>
                  <Chip label="Monthly Exam" accent="#fff" bg="rgba(255,255,255,.14)" style={{ marginBottom:14 }}/>
                  <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1.1, marginBottom:8 }}>{ex.primary.name} — {ex.primary.cycle}</div>
                  <div style={{ display:'flex', gap:28, marginTop:14 }}>
                    {[{v:String(ex.primary.registered),l:'Registered'},{v:ex.primary.fee,l:'Entry fee'},{v:ex.primary.date,l:'Exam date'}].map(s=>(
                      <div key={s.l}>
                        <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1 }}>{s.v}</div>
                        <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginTop:3 }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'flex-end' }}>
                  <Chip label="Exam unlocked ✓" accent={T.listening.c} bg={`${T.listening.c}22`}/>
                  <Btn label={`Register — ${ex.primary.fee}`} nav="exam_entry" accent={t.accent} iconRight={Icon.arrow({ width:12, height:12 })}/>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.45)' }}>Leaderboard goes live May 2</div>
                </div>
              </div>
              {/* Streak progress */}
              <div style={{ marginTop:20, paddingTop:20, borderTop:'1px solid rgba(255,255,255,.12)' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:12, color:'rgba(255,255,255,.65)' }}>
                  <span>Streak unlock progress</span><span>5/9 days</span>
                </div>
                <div style={{ height:5, background:'rgba(255,255,255,.12)', borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:'57%', height:'100%', background:'rgba(255,255,255,.6)', borderRadius:99 }}/>
                </div>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              {/* Exam history */}
              <Card padding={0}>
                <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Practice exam history</div>
                </div>
                {examHistory.length === 0 ? (
                  <div style={{ padding:'24px 22px', fontSize:12, color:T.ink4, textAlign:'center' }}>No practice exams yet — take a mock to see your history.</div>
                ) : examHistory.map((r,i,all)=>(
                  <div key={r.month} style={{ display:'flex', alignItems:'center', gap:16, padding:'16px 22px', borderBottom:i<all.length-1?`1px solid ${T.hairline}`:'none' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.month}</div>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{r.sessions} sessions · Rank #{r.rank}</div>
                    </div>
                    <div style={{ fontFamily:T.serif, fontSize:28, color:t.accent }}>{r.score}</div>
                  </div>
                ))}
              </Card>

              {/* Skill targets */}
              <Card padding={22}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:18 }}>Skill targets</div>
                {skillTargets.map(m=>{
                  const c = colorFor(m.module); const ic = iconFor(m.module); const title = titleFor(m.module);
                  const scale = m.scale || 9;
                  return (
                    <div key={m.module} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                      <div style={{ width:30, height:30, borderRadius:8, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[ic]({ width:13, height:13 })}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                          <span style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{title}</span>
                          <span style={{ fontSize:11.5, color:T.ink4, fontWeight:600 }}>{m.current} → <span style={{ color:c.c }}>{m.target}</span></span>
                        </div>
                        <div style={{ height:5, background:T.bg3, borderRadius:99, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:`${(m.current/scale)*100}%`, background:c.c, borderRadius:99 }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Card>
            </div>
            {/* Other exams for this language */}
            <Card padding={0}>
              <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.hairline}` }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Other {lang.english} exams</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Available certifications for this language</div>
              </div>
              {ex.others.map((o, i) => (
                <button key={o.name} data-nav="exam_entry" style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom:i<ex.others.length-1?`1px solid ${T.hairline}`:'none', width:'100%', textAlign:'left', background:'transparent', cursor:'pointer' }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:t.bg, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>{o.name.split(' ')[0].slice(0,4)}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{o.name}</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Next mock: {o.next}</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink2 }}>{o.score}</div>
                  {Icon.chev({ width:13, height:13, style:{ color:T.ink5 } })}
                </button>
              ))}
            </Card>
          </div>
          );
        })()}

        {/* ── LIBRARY TAB ── */}
        {tab === 'library' && (() => {
          const cnt = (typeof langContent === 'function') ? langContent(lang.code) : null;
          const items = (cnt?.libraryItems || []).map(it => ({ ...it, c: it.module==='speaking'?T.speaking : it.module==='writing'?T.writing : it.module==='listening'?T.listening : T.reading, nav: it.kind==='Lesson'?'lesson_detail' : it.kind==='Audio'?'listening' : it.kind==='Phrasebook'?'phrasebook' : 'article_reader' }));
          return (
            <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Saved for {lang.english}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {items.map((it,i)=>(
                  <button key={i} data-nav={it.nav} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'14px 16px', textAlign:'left', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:it.c.bg, color:it.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[it.ic]({ width:14, height:14 })}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:10, color:it.c.c, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>{it.kind}</div>
                      <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.25 }}>{it.title}</div>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:3 }}>{it.meta}</div>
                    </div>
                    <div style={{ color:T.ink5 }}>{Icon.bookmark({ width:13, height:13 })}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── STUDY TAB ── */}
        {tab === 'study' && <StudyTab lang={lang}/>}

        {/* ── TUTOR TAB ── */}
        {tab === 'tutor' && <TutorTab lang={lang}/>}
      </div>
    </div>
  );
}

function TutorTab({ lang }) {
  const t = langTheme(lang.code);
  const [msgs, setMsgs] = useState([
    { role:'ai',   text: langPack(lang.code).tutorGreeting },
  ]);
  const pk = langPack(lang.code);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { role:'user', text:input.trim() }, { role:'ai', text:'Great question! Let me think through that for you…' }]);
    setInput('');
  };

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:20, height:560 }}>
      {/* Chat */}
      <Card padding={0} style={{ display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'16px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:11, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({ width:16, height:16 })}</div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Fluentra AI Tutor</div>
            <div style={{ fontSize:11, color:T.listening.c, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:3, background:T.listening.c, display:'inline-block' }}/> Online · {lang.english}
            </div>
          </div>
          <div style={{ marginLeft:'auto' }}>
            <Chip label="Pro · Unlimited" accent={T.brand} bg={T.brandLight} style={{ fontSize:10 }}/>
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>
          {msgs.map((m,i) => (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection:m.role==='user'?'row-reverse':'row' }}>
              <div style={{ width:28, height:28, borderRadius:14, flexShrink:0, background:m.role==='user'?T.brandGrad:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {m.role==='user' ? <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>M</span> : Icon.spark({ width:13, height:13, color:'#fff' })}
              </div>
              <div style={{ maxWidth:'75%', background:m.role==='user'?T.brand:T.card, color:m.role==='user'?'#fff':T.ink, borderRadius:m.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'10px 14px', fontSize:13, lineHeight:1.55, border:m.role==='user'?'none':`1px solid ${T.border}` }}>
                {m.text.split('\n').map((line,j) => line.startsWith('**')
                  ? <div key={j} style={{ fontWeight:700, margin:'4px 0 2px' }}>{line.replace(/\*\*/g,'')}</div>
                  : <div key={j}>{line}</div>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding:'14px 22px', borderTop:`1px solid ${T.hairline}`, display:'flex', gap:10 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
            placeholder="Ask anything — grammar, vocab, phrases, exam tips…"
            style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none' }}/>
          <button onClick={send} style={{ width:40, height:40, borderRadius:10, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {Icon.send({ width:14, height:14 })}
          </button>
        </div>
      </Card>

      {/* Sidebar */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card padding={18}>
          <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:12 }}>Quick prompts</div>
          {pk.quickPrompts.map(p => (
            <button key={p} onClick={() => { setMsgs(m => [...m, { role:'user', text:p }, { role:'ai', text:'Great question! Let me think through that for you…' }]); }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:9, border:`1px solid ${T.border}`, fontSize:12, color:T.ink2, marginBottom:6, cursor:'pointer', background:T.card }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
              onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
              {p}
            </button>
          ))}
        </Card>
        <Card padding={18}>
          <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:10 }}>Study context</div>
          {[
            { l:'Target exam', v: (pk.exam?.short || lang.exam || 'CEFR') + (pk.exam?.bestScore ? ' ' + pk.exam.bestScore : '') },
            { l:'Weakest skill', v: lang.code==='ja' ? 'Reading' : 'Writing' },
            { l:'Recent focus', v:'Fluency' },
            { l:'Session count', v:'142' },
          ].map(r => (
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${T.hairline}`, fontSize:12 }}>
              <span style={{ color:T.ink4 }}>{r.l}</span>
              <span style={{ color:T.ink, fontWeight:600 }}>{r.v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Study tab: gives every language its own Course / Grammar / Vocab / Achievements / Results
function StudyTab({ lang }) {
  const t = langTheme(lang.code);
  // Per-language curriculum pulls — keeps Japanese stuff under JP, French under FR etc
  const curriculum = {
    en: {
      course:  { unit:'Unit 8 · Academic Writing', next:'Cohesive devices in essays', pct:62, lessons:14, done:9 },
      grammar: ['Conditionals — all 4 types','Reported speech','Passive voice nuances','Gerund vs infinitive'],
      vocab:   { decks:[{ name:'IELTS Band 7+ Vocabulary', count:240, due:18 },{ name:'Academic Collocations', count:180, due:6 },{ name:'Phrasal Verbs', count:160, due:0 }] },
    },
    ja: {
      course:  { unit:'Unit 5 · 中級表現', next:'敬語の基本 (keigo basics)', pct:34, lessons:18, done:6 },
      grammar: ['て-form combinations','〜ようになる / 〜ようにする','謙譲語 humble form','受身形 passive'],
      vocab:   { decks:[{ name:'JLPT N3 Kanji', count:367, due:42 },{ name:'Daily Conversation', count:120, due:8 },{ name:'Counters (助数詞)', count:48, due:0 }] },
    },
    fr: {
      course:  { unit:'Unité 6 · Le passé', next:'Passé composé vs imparfait', pct:48, lessons:12, done:6 },
      grammar: ['Passé composé','Imparfait usage','Subjonctif présent','Pronoms y et en'],
      vocab:   { decks:[{ name:'DELF B2 Essentials', count:300, due:24 },{ name:'Faux amis', count:80, due:4 },{ name:'Idioms & expressions', count:140, due:0 }] },
    },
    es: {
      course:  { unit:'Unidad 4 · Subjuntivo', next:'Presente de subjuntivo', pct:55, lessons:10, done:6 },
      grammar: ['Subjuntivo presente','Ser vs estar','Por vs para','Pretérito vs imperfecto'],
      vocab:   { decks:[{ name:'DELE B2 Vocabulary', count:280, due:16 },{ name:'Modismos', count:120, due:6 },{ name:'False cognates', count:60, due:0 }] },
    },
  };
  // For any language without a curated curriculum entry, derive a reasonable starter from langPack().
  const pkS = langPack(lang.code);
  const c = curriculum[lang.code] || {
    course:  { unit:`Unit 1 · ${lang.english} foundations`, next:'Greetings & introductions', pct:0, lessons:12, done:0 },
    grammar: ['Articles & gender','Present tense basics','Question forms','Negation'],
    vocab:   { decks: pkS.decks },
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      {/* Top section row: Course progress + Grammar topics */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:20 }}>
        {/* Course */}
        <Card padding={0}>
          <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:10, color:t.accent, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>{lang.english} Course</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:3 }}>{c.course.unit}</div>
            </div>
            <button data-nav="course" style={{ fontSize:11.5, color:T.ink3, fontWeight:600, cursor:'pointer' }}>Open course →</button>
          </div>
          <div style={{ padding:'20px 22px' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ fontSize:12, color:T.ink3 }}>{c.course.done} of {c.course.lessons} lessons complete</div>
              <div style={{ fontSize:12, fontWeight:700, color:t.accent }}>{c.course.pct}%</div>
            </div>
            <Bar pct={c.course.pct} color={t.accent}/>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginTop:18, padding:14, background:t.bg, borderRadius:12 }}>
              <div style={{ width:40, height:40, borderRadius:11, background:t.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.play({ width:14, height:14 })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>Up next</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{c.course.next}</div>
              </div>
              <Btn label="Start" nav="lesson_detail" accent={t.accent} size="sm"/>
            </div>
          </div>
        </Card>

        {/* Grammar — brand-orange themed feature card */}
        <Card padding={0} style={{ background:`linear-gradient(160deg, ${T.brandSoft} 0%, #fff 60%)`, border:`1px solid ${T.brandLight}`, overflow:'hidden' }}>
          <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.brandLight}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,.6)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${T.brand}44` }}>{Icon.pen({ width:14, height:14 })}</div>
              <div>
                <div style={{ fontSize:10, color:T.brand, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>{lang.english} Grammar</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:3 }}>Active topics</div>
              </div>
            </div>
            <button data-nav="grammar" style={{ fontSize:11.5, color:T.brand, fontWeight:700, cursor:'pointer' }}>All topics →</button>
          </div>
          <div style={{ padding:'14px 22px 18px' }}>
            {c.grammar.map((g,i) => (
              <button key={g} data-nav="grammar" style={{ display:'flex', alignItems:'center', gap:11, width:'100%', padding:'10px 0', borderBottom: i < c.grammar.length-1 ? `1px solid ${T.brandLight}80` : 'none', textAlign:'left', cursor:'pointer', background:'transparent' }}>
                <div style={{ width:26, height:26, borderRadius:7, background:'#fff', color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:`1px solid ${T.brandLight}` }}>{Icon.pen({ width:11, height:11 })}</div>
                <div style={{ flex:1, fontSize:12.5, fontWeight:600, color:T.ink }}>{g}</div>
                {Icon.chev({ width:12, height:12, style:{ color:T.brand } })}
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* Vocab decks — brand-orange themed feature card */}
      <Card padding={0} style={{ background:`linear-gradient(170deg, #fff 0%, ${T.brandSoft} 100%)`, border:`1px solid ${T.brandLight}`, overflow:'hidden' }}>
        <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.brandLight}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,.6)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 12px ${T.brand}44` }}>{Icon.book({ width:14, height:14 })}</div>
            <div>
              <div style={{ fontSize:10, color:T.brand, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>{lang.english} Vocabulary</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:3 }}>Your decks</div>
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            <Btn label="New deck" nav="vocab" variant="outline" size="sm"/>
            <Btn label="Practice all" nav="vocab" accent={T.brand} size="sm"/>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:0 }}>
          {c.vocab.decks.map((d, i) => (
            <button key={d.name} data-nav="vocab" style={{ padding:'18px 22px', textAlign:'left', cursor:'pointer', borderRight: i < c.vocab.decks.length - 1 ? `1px solid ${T.brandLight}80` : 'none', background:'transparent', display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:9, background:'#fff', color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${T.brandLight}` }}>{Icon.book({ width:13, height:13 })}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.25 }}>{d.name}</div>
              </div>
              <div style={{ display:'flex', gap:14, marginTop:4 }}>
                <div>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{d.count}</div>
                  <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginTop:3 }}>Cards</div>
                </div>
                <div>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:d.due > 0 ? T.brand : T.ink5, lineHeight:1 }}>{d.due}</div>
                  <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginTop:3 }}>Due</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Bottom row: Module results + Achievements */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <Card padding={0}>
          <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:10, color:T.listening.c, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>Module Results</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:3 }}>Recent in {lang.english}</div>
            </div>
            <button data-nav="mod_results" style={{ fontSize:11.5, color:T.ink3, fontWeight:600, cursor:'pointer' }}>All →</button>
          </div>
          {[
            { mod:'Speaking', ic:'mic',  c:T.speaking,  date:'Today',     band:7.5 },
            { mod:'Writing',  ic:'pen',  c:T.writing,   date:'Yesterday', band:6.5 },
            { mod:'Listening',ic:'head', c:T.listening, date:'2 days',    band:7.5 },
          ].map((r,i,all) => (
            <button key={i} data-nav="mod_results" style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 22px', borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none', textAlign:'left', width:'100%', background:'transparent', cursor:'pointer' }}>
              <div style={{ width:32, height:32, borderRadius:9, background:r.c.bg, color:r.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[r.ic]({ width:13, height:13 })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.mod}</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{r.date}</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:20, color:r.c.c }}>{r.band}</div>
            </button>
          ))}
        </Card>

        <Card padding={22}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ fontSize:10, color:T.brand, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>Achievements</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginTop:3 }}>{lang.english} badges</div>
            </div>
            <button data-nav="achievements" style={{ fontSize:11.5, color:T.ink3, fontWeight:600, cursor:'pointer' }}>All →</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
            {[
              { ic:'flame',  l:'30-day',   on:true },
              { ic:'trophy', l:'Band 7',   on:true },
              { ic:'check',  l:'100 sess', on:true },
              { ic:'mic',    l:'Speaker',  on:true },
              { ic:'book',   l:'Bookworm', on:false },
              { ic:'pen',    l:'Writer',   on:false },
              { ic:'head',   l:'Listener', on:true },
              { ic:'spark',  l:'Mock 8.0', on:false },
            ].map((b,i) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, padding:'10px 4px', borderRadius:10, background: b.on ? t.bg : T.bg2, border: `1px solid ${b.on ? t.accent + '33' : T.hairline}`, opacity: b.on ? 1 : .55 }}>
                <div style={{ width:30, height:30, borderRadius:15, background: b.on ? t.accent : T.bg3, color: b.on ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[b.ic]({ width:13, height:13 })}</div>
                <div style={{ fontSize:10, fontWeight:600, color:T.ink2, textAlign:'center' }}>{b.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { LangDetailPage });
