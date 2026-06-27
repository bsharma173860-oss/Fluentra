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
              <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1 }}>{(typeof computeStreak==='function'?computeStreak(_rows):(lang.streak||0))}</div>
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

            {/* The Argument Arena — scoped to this language */}
            <button onClick={() => { if (window.__setLang) window.__setLang(lang.code); if (window.__nav) window.__nav('argue'); }} style={{ width:'100%', textAlign:'left', cursor:'pointer', border:'none', background:T.ink, borderRadius:16, padding:'20px 24px', marginBottom:32, color:'#fff', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'space-between', gap:18 }}>
              <div style={{ position:'absolute', inset:0, opacity:.06, background:'radial-gradient(circle at 96% 10%, #fff 0%, transparent 55%)' }}/>
              <div style={{ position:'relative', minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.brandLight, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:7 }}>New · Argument Arena</div>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.1, marginBottom:5 }}>Debate in {(typeof langByCode === 'function' && langByCode(lang.code) && (langByCode(lang.code).english || langByCode(lang.code).native)) || lang.name || 'your language'}.</div>
                <div style={{ fontSize:12.5, color:'rgba(255,255,255,.6)', lineHeight:1.5, maxWidth:420 }}>Argue a side against an AI opponent — with native comebacks and a read on how each point lands.</div>
              </div>
              <div style={{ position:'relative', flexShrink:0, padding:'10px 16px', borderRadius:10, background:'#fff', color:T.ink, fontSize:12.5, fontWeight:700 }}>Enter →</div>
            </button>

            {/* Foundations — start-from-zero journey for this language */}
            <button onClick={() => { if (window.__setLang) window.__setLang(lang.code); if (window.__nav) window.__nav('foundations'); }} style={{ width:'100%', textAlign:'left', cursor:'pointer', background:T.brandLight, border:'1.5px solid ' + T.brand, borderRadius:16, padding:'18px 22px', marginBottom:32, display:'flex', alignItems:'center', justifyContent:'space-between', gap:18 }}>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.brand, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>Foundations · Start from zero</div>
                <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1.12, marginBottom:4 }}>Alphabet, sounds & first words.</div>
                <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5, maxWidth:420 }}>The beginner path — script, phonics, words, sentences, translation. Tap any letter to hear it.</div>
              </div>
              <div style={{ flexShrink:0, padding:'10px 16px', borderRadius:10, background:T.brand, color:'#fff', fontSize:12.5, fontWeight:700 }}>Begin →</div>
            </button>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:24 }}>
              {/* Up next — lessons */}
              <Card padding={0}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Up next</div>
                  <button data-nav="course" style={{ fontSize:11.5, color:T.ink3, fontWeight:600, cursor:'pointer' }}>Course →</button>
                </div>
                {(() => {
                  const syl = (typeof lessonSyllabus === 'function') ? lessonSyllabus() : [];
                  const flat = [];
                  syl.forEach(function(u){ u.lessons.forEach(function(title){ flat.push({ title:title, unit:u.unit, level:u.level }); }); });
                  const lessons = flat.slice(0, 4);
                  return lessons.map((row, i, all) => (
                    <button key={i} onClick={function(){ window.__lessonTopic = { title:row.title, unit:row.unit, level:row.level }; window.__nav && window.__nav('lesson_detail'); }} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i < all.length-1 ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent', cursor:'pointer' }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:t.bg, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        {Icon.book({ width:15, height:15 })}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{row.level + ' · ' + row.unit}</div>
                        <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.2 }}>{row.title}</div>
                      </div>
                      <div style={{ fontSize:11.5, color:t.accent, fontWeight:700, display:'flex', alignItems:'center', gap:4 }}>Start {Icon.arrow({ width:11, height:11 })}</div>
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
                    <div style={{ fontSize:11, color:T.ink3, marginTop:2 }}>Full mock · all 4 modules</div>
                  </div>
                </div>
                <Btn label="Schedule mock" nav="mock_test" variant="outline" accent={t.accent} size="sm" fullWidth style={{ marginTop:12 }}/>
              </Card>
            </div>
          </>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (() => {
          const rows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(r => r.lang === lang.code) : [];
          const scored = rows.filter(r => typeof r.score === 'number');
          const bestPct = scored.length ? Math.max.apply(null, scored.map(r=>r.score)) : null;
          const sessions = rows.length;
          const weekAgo = Date.now() - 7*86400000;
          const thisWeek = rows.filter(r => r.updated_at && new Date(r.updated_at).getTime() >= weekAgo).length;
          const streak = (typeof computeStreak==='function') ? computeStreak(rows) : 0;
          const series = scored.slice().sort((a,b)=> new Date(a.updated_at) - new Date(b.updated_at)).slice(-10);
          const MODS = [
            { key:'speaking',  ic:'mic',  c:T.speaking,  title:'Speaking'  },
            { key:'writing',   ic:'pen',  c:T.writing,   title:'Writing'   },
            { key:'listening', ic:'head', c:T.listening, title:'Listening' },
            { key:'reading',   ic:'book', c:T.reading,   title:'Reading'   },
          ];
          const modStats = (key) => {
            const xs = scored.filter(r => (r.detail&&r.detail.module)===key).sort((a,b)=> new Date(a.updated_at) - new Date(b.updated_at));
            if (!xs.length) return null;
            const best = Math.max.apply(null, xs.map(r=>r.score));
            const change = xs.length>=2 ? (xs[xs.length-1].score - xs[xs.length-2].score) : 0;
            return { best:best, change:change, count:xs.length };
          };
          // activity: last 84 days
          const today0 = new Date(); today0.setHours(0,0,0,0);
          const dayCount = {};
          rows.forEach(r => { if(!r.updated_at) return; var t=new Date(r.updated_at); if(isNaN(t.getTime())) return; t.setHours(0,0,0,0); dayCount[t.getTime()] = (dayCount[t.getTime()]||0)+1; });
          const tiles = [
            { label:'Best score', value: bestPct!=null ? bestPct+'%' : '—', color:t.accent },
            { label:'Sessions',   value: String(sessions) },
            { label:'This week',  value: String(thisWeek), meta: thisWeek? 'keep going' : 'no sessions yet' },
            { label:'Streak',     value: streak+'d' },
          ];
          return (
          <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14 }}>
              {tiles.map(s => (
                <Card key={s.label} padding={20}>
                  <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontFamily:T.serif, fontSize:36, color:s.color||T.ink, lineHeight:1, marginBottom:4 }}>{s.value}</div>
                  {s.meta && <div style={{ fontSize:11, color:T.ink4 }}>{s.meta}</div>}
                </Card>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:20 }}>
              {/* Real score-over-time */}
              <Card padding={22}>
                <div style={{ marginBottom:18 }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Score over time</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{lang.english} · your last {series.length} session{series.length===1?'':'s'}</div>
                </div>
                {series.length < 2 ? (
                  <div style={{ fontSize:12.5, color:T.ink4, padding:'30px 0', textAlign:'center' }}>Finish a few sessions to see your trend.</div>
                ) : (() => {
                  const W2=540,H2=150,pl=30,pr=12,pt=14,pb=26; const iW=W2-pl-pr, iH=H2-pt-pb;
                  const n=series.length;
                  const pts=series.map((d,i)=>({ x:pl+(n===1?0.5:i/(n-1))*iW, y:pt+(1-(d.score)/100)*iH }));
                  const path=pts.reduce((a,p,i)=>{ if(i===0) return 'M'+p.x+' '+p.y; const prev=pts[i-1]; const cx=prev.x+(p.x-prev.x)/2; return a+' C'+cx+' '+prev.y+' '+cx+' '+p.y+' '+p.x+' '+p.y; },'');
                  const area=path+' L'+pts[n-1].x+' '+(pt+iH)+' L'+pts[0].x+' '+(pt+iH)+' Z';
                  return (
                    <svg width={W2} height={H2} style={{ overflow:'visible', maxWidth:'100%' }}>
                      <defs><linearGradient id={'g-'+lang.code} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={t.accent} stopOpacity=".18"/><stop offset="100%" stopColor={t.accent} stopOpacity="0"/></linearGradient></defs>
                      {[0,25,50,75,100].map(g=>{const y=pt+(1-g/100)*iH;return <g key={g}><line x1={pl} y1={y} x2={W2-pr} y2={y} stroke={T.hairline}/><text x={pl-4} y={y+4} fontSize="9" fill={T.ink4} textAnchor="end">{g}</text></g>;})}
                      <path d={area} fill={'url(#g-'+lang.code+')'}/>
                      <path d={path} fill="none" stroke={t.accent} strokeWidth="2.5" strokeLinecap="round"/>
                      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="4" fill="#fff" stroke={t.accent} strokeWidth="2"/>)}
                    </svg>
                  );
                })()}
              </Card>

              {/* Real by-module */}
              <Card padding={22}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:18 }}>By module</div>
                {MODS.map(m => {
                  const st = modStats(m.key);
                  return (
                  <div key={m.title} style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:13, height:13 })}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                        <span style={{ fontSize:12.5, fontWeight:600, color:T.ink }}>{m.title}</span>
                        <span style={{ display:'flex', alignItems:'baseline', gap:5 }}>
                          <span style={{ fontFamily:T.serif, fontSize:16, color: st?T.ink:T.ink4, lineHeight:1 }}>{st ? st.best+'%' : '—'}</span>
                          {st && st.change!==0 && <span style={{ fontSize:10.5, color:st.change>0?T.listening.c:T.brand, fontWeight:700 }}>{st.change>0?'+':''}{st.change}</span>}
                        </span>
                      </div>
                      <Bar pct={st ? st.best : 0} color={m.c.c}/>
                    </div>
                  </div>
                  );
                })}
              </Card>
            </div>

            {/* Real activity heatmap */}
            <Card padding={22}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Activity · last 12 weeks</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:10.5, color:T.ink4 }}>
                  Less {[T.bg3,'#F0D9CF','#E5A78C',t.accent+'cc',t.accent].map(c=><div key={c} style={{ width:11, height:11, borderRadius:3, background:c }}/>)} More
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(84,1fr)', gap:3 }}>
                {Array.from({length:84}).map((_,i)=>{
                  const dayMs = today0.getTime() - (83-i)*86400000;
                  const cnt = dayCount[dayMs] || 0;
                  const lvl = cnt>=4?4:cnt===3?3:cnt===2?2:cnt===1?1:0;
                  const colors=[T.bg3,'#F0D9CF','#E5A78C',t.accent+'cc',t.accent];
                  return <div key={i} title={cnt+' session'+(cnt===1?'':'s')} style={{ aspectRatio:'1', borderRadius:3, background:colors[lvl] }}/>;
                })}
              </div>
            </Card>
          </div>
          );
        })()}

        {/* ── EXAMS TAB ── */}
        {tab === 'exams' && (() => {
          const rows = ((typeof window!=='undefined' && window.__results) ? window.__results : []).filter(r => r.lang === lang.code && r.detail && r.detail.module === 'mock_exam');
          rows.sort((a,b)=> new Date(b.updated_at) - new Date(a.updated_at));
          const best = rows.length ? Math.max.apply(null, rows.map(r=>Number(r.score)||0)) : null;
          const ABBR = { reading:'R', listening:'L', writing:'W', speaking:'S' };
          return (
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {/* Take a mock */}
            <div style={{ background:T.ink, borderRadius:18, padding:'28px 30px', color:'#fff', display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'center' }}>
              <div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{lang.english} mock exam</div>
                <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.1, marginBottom:8 }}>Full mock — all four sections</div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', lineHeight:1.5 }}>Reading, listening, speaking, and writing back to back, scored like the real thing.{best!=null ? ' Your best so far: ' + best + '%.' : ''}</div>
              </div>
              <button onClick={()=>{ window.__setLang(lang.code); window.__examMode='mock'; window.__nav && window.__nav('exam_runner'); }} style={{ padding:'14px 22px', background:'#fff', color:T.ink, borderRadius:12, fontSize:14, fontWeight:700, border:'none', cursor:'pointer', whiteSpace:'nowrap' }}>Take a mock →</button>
            </div>

            {/* Official exam — $5 scored attempt (free on Max) */}
            <div style={{ background:T.brandLight, borderRadius:18, padding:'24px 30px', display:'grid', gridTemplateColumns:'1fr auto', gap:20, alignItems:'center', border:`1px solid ${t.accent}33` }}>
              <div>
                <div style={{ fontSize:10.5, color:t.accent, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>Official {lang.english} exam</div>
                <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.1, marginBottom:8, color:T.ink }}>Sit the scored exam{(typeof window!=='undefined' && window.__can && window.__can('examsIncluded')) ? '' : ' — $5'}</div>
                <div style={{ fontSize:13, color:T.ink3, lineHeight:1.5 }}>A single official attempt — all four sections — that counts toward the leaderboard. Included free on Max.</div>
              </div>
              <button onClick={()=>{ window.__setLang(lang.code); window.__examMode='monthly'; if (typeof window!=='undefined' && window.__can && window.__can('examsIncluded')) { window.__nav && window.__nav('monthly_runner'); } else if (window.payFor) { window.payFor('exam_official'); } }} style={{ padding:'14px 22px', background:t.accent, color:'#fff', borderRadius:12, fontSize:14, fontWeight:700, border:'none', cursor:'pointer', whiteSpace:'nowrap' }}>{(typeof window!=='undefined' && window.__can && window.__can('examsIncluded')) ? 'Take official →' : 'Take official · $5'}</button>
            </div>

            {/* Real exam history for this language */}
            <Card padding={0}>
              <div style={{ padding:'16px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Your {lang.english} mocks</div>
                <button data-nav="exam_history" style={{ fontSize:11.5, color:T.ink3, fontWeight:600, cursor:'pointer', background:'transparent' }}>All history →</button>
              </div>
              {rows.length === 0 ? (
                <div style={{ padding:'18px 22px', fontSize:12.5, color:T.ink4 }}>No mock exams yet for {lang.english}. Take one above and your scored attempts appear here.</div>
              ) : rows.slice(0,6).map((r,i,all) => {
                const secs = (r.detail.sections||[]).reduce((acc,sec)=>{ acc[ABBR[sec.module]||sec.module]=Math.round(Number(sec.score)||0); return acc; },{});
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 22px', borderBottom: i<Math.min(all.length,6)-1?`1px solid ${T.hairline}`:'none' }}>
                    <div style={{ fontFamily:T.serif, fontSize:24, color:t.accent, minWidth:54 }}>{Number(r.score)||0}%</div>
                    <div style={{ flex:1, fontSize:12, color:T.ink4 }}>{r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) : ''}</div>
                    <div style={{ display:'flex', gap:6 }}>
                      {['R','L','W','S'].map(k => (
                        <div key={k} style={{ padding:'3px 7px', background:T.bg2, borderRadius:6, textAlign:'center', minWidth:30 }}>
                          <div style={{ fontSize:9, color:T.ink4, fontWeight:700 }}>{k}</div>
                          <div style={{ fontSize:11.5, fontWeight:700, color:T.ink }}>{secs[k]!=null?secs[k]:'—'}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
          );
        })()}

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
  const pk = langPack(lang.code);
  const [msgs, setMsgs] = useState([{ role:'ai', text: pk.tutorGreeting }]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const rows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(function(r){ return r.lang === lang.code; }) : [];
  const sessionCount = rows.length;
  const avgByMod = {};
  rows.forEach(function(r){ var m=(r.detail&&r.detail.module)||'reading'; if(typeof r.score==='number'){ (avgByMod[m]=avgByMod[m]||[]).push(r.score); } });
  let weakest = '—', lowest = 101;
  Object.keys(avgByMod).forEach(function(m){ var a=avgByMod[m]; var avg=a.reduce(function(x,y){return x+y;},0)/a.length; if(avg<lowest){ lowest=avg; weakest=m.charAt(0).toUpperCase()+m.slice(1); } });

  const ask = function (text) {
    if (!text || !text.trim() || thinking) return;
    var userMsg = { role:'user', text: text.trim() };
    var history = msgs.concat(userMsg);
    setMsgs(function (m) { return m.concat(userMsg); });
    setInput('');
    setThinking(true);
    fetch('/api/tutor', {
      method:'POST', headers:Object.assign({ 'Content-Type':'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
      body: JSON.stringify({
        messages: history.map(function (m) { return { role: m.role === 'ai' ? 'assistant' : m.role, content: m.text }; }),
        lang: lang.english,
        context: 'The learner is in the ' + lang.english + ' language hub. Reply in ' + lang.english + ' where natural, with English glosses for new words.'
      }),
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (data && data.limit) { setThinking(false); if (window.__upgrade) window.__upgrade('tutor'); return; }
      if (data && data.error) throw new Error(data.error);
      setMsgs(function (m) { return m.concat({ role:'ai', text: (data && data.reply) || '…' }); });
      setThinking(false);
    }).catch(function () {
      setMsgs(function (m) { return m.concat({ role:'ai', text: 'Sorry — I had trouble responding. Please try again.' }); });
      setThinking(false);
    });
  };
  const send = function () { ask(input); };

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
        </div>
        <div style={{ flex:1, overflow:'auto', padding:'20px 22px', display:'flex', flexDirection:'column', gap:14 }}>
          {msgs.map(function (m, i) { return (
            <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start', flexDirection:m.role==='user'?'row-reverse':'row' }}>
              <div style={{ width:28, height:28, borderRadius:14, flexShrink:0, background:m.role==='user'?T.brandGrad:'#1A1A1A', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {m.role==='user' ? <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{(typeof USER!=='undefined'&&USER.initial)||'·'}</span> : Icon.spark({ width:13, height:13, color:'#fff' })}
              </div>
              <div style={{ maxWidth:'75%', background:m.role==='user'?T.brand:T.card, color:m.role==='user'?'#fff':T.ink, borderRadius:m.role==='user'?'14px 4px 14px 14px':'4px 14px 14px 14px', padding:'10px 14px', fontSize:13, lineHeight:1.55, border:m.role==='user'?'none':`1px solid ${T.border}` }}>
                {m.text.split('\n').map(function (line, j) { return line.indexOf('**') === 0
                  ? <div key={j} style={{ fontWeight:700, margin:'4px 0 2px' }}>{line.replace(/\*\*/g,'')}</div>
                  : <div key={j}>{line}</div>; })}
              </div>
            </div>
          ); })}
          {thinking && <div style={{ fontSize:12, color:T.ink4, paddingLeft:38 }}>Tutor is typing…</div>}
        </div>
        <div style={{ padding:'14px 22px', borderTop:`1px solid ${T.hairline}`, display:'flex', gap:10 }}>
          <input value={input} onChange={function(e){ setInput(e.target.value); }} onKeyDown={function(e){ if(e.key==='Enter') send(); }}
            placeholder="Ask anything — grammar, vocab, phrases, exam tips…"
            style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none' }}/>
          <button onClick={send} disabled={thinking} style={{ width:40, height:40, borderRadius:10, background:thinking?T.ink4:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:thinking?'default':'pointer' }}>
            {Icon.send({ width:14, height:14 })}
          </button>
        </div>
      </Card>

      {/* Sidebar */}
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card padding={18}>
          <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:12 }}>Quick prompts</div>
          {pk.quickPrompts.map(function (p) { return (
            <button key={p} onClick={function(){ ask(p); }}
              style={{ display:'block', width:'100%', textAlign:'left', padding:'9px 12px', borderRadius:9, border:`1px solid ${T.border}`, fontSize:12, color:T.ink2, marginBottom:6, cursor:'pointer', background:T.card }}>
              {p}
            </button>
          ); })}
        </Card>
        <Card padding={18}>
          <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:10 }}>Study context</div>
          {[
            { l:'Language', v: lang.english },
            { l:'Target exam', v: (pk.exam && pk.exam.short) || lang.exam || 'CEFR' },
            { l:'Weakest skill', v: weakest },
            { l:'Sessions', v: String(sessionCount) },
          ].map(function (r) { return (
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${T.hairline}`, fontSize:12 }}>
              <span style={{ color:T.ink4 }}>{r.l}</span>
              <span style={{ color:T.ink, fontWeight:600 }}>{r.v}</span>
            </div>
          ); })}
        </Card>
      </div>
    </div>
  );
}

// ── Study tab: gives every language its own Course / Grammar / Vocab / Achievements / Results
function StudyTab({ lang }) {
  const t = langTheme(lang.code);
  const rows = (typeof window!=='undefined' && window.__results) ? window.__results.filter(r => r.lang === lang.code) : [];
  const recent = rows.slice().sort((a,b)=> new Date(b.updated_at) - new Date(a.updated_at)).slice(0,6);
  const GRAMMAR = ['Past tenses — and when to use each','Articles, gender & number','Pronouns: subject, object, reflexive','Prepositions that trip people up','Questions & negation','Common irregular verbs'];
  const openLesson = (title) => { window.__lessonTopic = { title:title, unit:'Grammar', level: lang.level || '' }; window.__nav && window.__nav('lesson_detail'); };
  const _rel = (iso) => { if(!iso) return ''; var ms=Date.now()-new Date(iso).getTime(); if(isNaN(ms))return''; var d=Math.floor(ms/86400000); return d<=0?'today':d===1?'1d':d<7?d+'d':new Date(iso).toLocaleDateString(undefined,{month:'short',day:'numeric'}); };
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
        {[
          { title:'Course',     sub:'Structured lessons for ' + lang.english, ic:'book', nav:'course',  cta:'Open course'  },
          { title:'Grammar',    sub:'Generate a lesson on any topic',          ic:'pen',  nav:'grammar', cta:'Browse topics' },
          { title:'Vocabulary', sub:'Your saved words & flashcards',            ic:'book', nav:'vocab',   cta:'Review vocab'  },
        ].map(card => (
          <Card key={card.title} padding={20}>
            <div style={{ width:38, height:38, borderRadius:11, background:t.bg, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>{Icon[card.ic]({ width:16, height:16 })}</div>
            <div style={{ fontSize:15, fontWeight:700, color:T.ink, marginBottom:4 }}>{card.title}</div>
            <div style={{ fontSize:12, color:T.ink4, lineHeight:1.45, marginBottom:14, minHeight:34 }}>{card.sub}</div>
            <Btn label={card.cta} nav={card.nav} accent={t.accent} size="sm"/>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid '+T.hairline, fontSize:13.5, fontWeight:700, color:T.ink }}>Grammar topics</div>
        <div style={{ padding:'8px 22px 16px' }}>
          {GRAMMAR.map((g,i,all) => (
            <button key={g} onClick={()=>openLesson(g)} style={{ display:'flex', alignItems:'center', gap:11, width:'100%', padding:'11px 0', borderBottom: i<all.length-1?'1px solid '+T.hairline:'none', textAlign:'left', cursor:'pointer', background:'transparent' }}>
              <div style={{ width:26, height:26, borderRadius:7, background:t.bg, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.pen({ width:11, height:11 })}</div>
              <div style={{ flex:1, fontSize:12.5, fontWeight:600, color:T.ink }}>{g}</div>
              <span style={{ fontSize:11, color:t.accent, fontWeight:700 }}>Generate →</span>
            </button>
          ))}
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding:'16px 22px', borderBottom:'1px solid '+T.hairline, fontSize:13.5, fontWeight:700, color:T.ink }}>Recent activity</div>
        {recent.length === 0 ? (
          <div style={{ padding:'18px 22px', fontSize:12.5, color:T.ink4 }}>No sessions yet. Practice a module and your history shows up here.</div>
        ) : recent.map((r,i) => {
          const mod = (r.detail&&r.detail.module)||'reading';
          return (
            <div key={i} style={{ padding:'13px 22px', borderBottom: i<recent.length-1?'1px solid '+T.hairline:'none', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, fontSize:13, color:T.ink, fontWeight:600, textTransform:'capitalize' }}>{mod}</div>
              <div style={{ fontSize:12, color:T.ink4 }}>{_rel(r.updated_at)}</div>
              <div style={{ fontSize:12.5, color:T.ink3, fontWeight:600, minWidth:42, textAlign:'right' }}>{typeof r.score==='number'?r.score+'%':'—'}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

Object.assign(window, { LangDetailPage });
