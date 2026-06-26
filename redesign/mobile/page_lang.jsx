// ── Mobile · Language Detail v4 — WEB VOCABULARY ────────────
// Mirrors web LangDetailPage: gradient hero, tabs, 2x2 module tiles,
// Up-next lessons, weekly goal + next exam — translated to mobile width.
function MLangDetail() {
  const code = (typeof window !== 'undefined' && window.__langCode) || 'es';
  const lang = (typeof langByCode === 'function') ? langByCode(code) : LANGUAGES[1];
  const t = langTheme(lang.code);
  const cnt = (typeof langContent === 'function') ? langContent(lang.code) : null;
  const pk  = (typeof langPack === 'function') ? langPack(lang.code) : null;
  const ex  = (typeof examFor === 'function') ? examFor(lang.code) : null;
  const nav = (id) => window.__nav && window.__nav(id);
  const _rows = (typeof window !== 'undefined' && window.__results) ? window.__results.filter(r => r.lang === code) : [];
  const _weekAgo = Date.now() - 7 * 86400000;
  const goal = { done: _rows.filter(r => r.updated_at && new Date(r.updated_at).getTime() >= _weekAgo).length, target: 7 };
  const _bestScore = _rows.filter(r => typeof r.score === 'number').reduce((m, r) => Math.max(m, r.score), 0);
  const _realStreak = (typeof computeStreak === 'function') ? computeStreak(_rows) : ((typeof window !== 'undefined' && window.__user && window.__user.streak) || 0);

  const allMods = [
    { ic:'mic',  c:T.speaking,  title:'Speaking',  sub:'4-min monologue', n:'speaking', key:'speaking' },
    { ic:'pen',  c:T.writing,   title:'Writing',   sub:'Task 2 — opinion', n:'writing',  key:'writing' },
    { ic:'head', c:T.listening, title:'Listening', sub:'Lecture · 4 sections', n:'listening', key:'listening' },
    { ic:'book', c:T.reading,   title:'Reading',   sub:'Long passages',   n:'reading',  key:'reading' },
  ];
  const mods = cnt?.hideSpeaking ? allMods.filter(m => m.key !== 'speaking') : allMods;
  const score = pk?.score || '—';
  const _syl = (typeof lessonSyllabus === 'function') ? lessonSyllabus() : [];
  const _flat = []; _syl.forEach(function (u) { (u.lessons || []).forEach(function (title) { _flat.push({ title: title, unit: u.unit, level: u.level }); }); });
  const lessons = _flat.slice(0, 3);

  return (
    <>
      <MobileHeader back onBack={()=>nav('dashboard')} title={lang.english}
        right={<button onClick={()=>nav('settings')} style={{ width:36, height:36, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, boxShadow:MT.shadowSm }}>{Icon.cog ? Icon.cog({ width:14, height:14 }) : '⚙'}</button>}
      />
      <MobileBody padding={0}>
        {/* GRADIENT HERO — mirrors web LangHero */}
        <div style={{ padding:'4px 18px 14px' }}>
          <div style={{
            borderRadius:18, overflow:'hidden', position:'relative',
            background:`linear-gradient(135deg, ${t.accent} 0%, ${t.accent}dd 100%)`,
            color:'#fff', padding:'22px 22px 20px',
            boxShadow:`0 8px 24px ${t.accent}33`,
          }}>
            {/* dot pattern */}
            <div style={{ position:'absolute', top:-30, right:-30, width:240, height:240, display:'grid', gridTemplateColumns:'repeat(12,1fr)', gap:11, opacity:.08, pointerEvents:'none' }}>
              {Array.from({ length:96 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
            </div>

            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14, flexWrap:'wrap' }}>
                <div style={{ boxShadow:'0 3px 10px rgba(0,0,0,.25)', borderRadius:5, overflow:'hidden' }}>
                  <Flag code={lang.code} w={42} h={28}/>
                </div>
                <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:'rgba(255,255,255,.18)', padding:'4px 10px', borderRadius:99, letterSpacing:'.06em', textTransform:'uppercase' }}>{lang.exam}</span>
                <span style={{ fontSize:10, fontWeight:700, color:'#fff', background:'rgba(255,255,255,.18)', padding:'4px 10px', borderRadius:99, letterSpacing:'.06em', textTransform:'uppercase' }}>{lang.level}</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1, marginBottom:5, letterSpacing:'-.02em' }}>{lang.native}</div>
              <div style={{ fontSize:12.5, opacity:.85, fontWeight:500 }}>{lang.english} · {_rows.length} session{_rows.length === 1 ? '' : 's'}</div>

              {/* Stat row inside hero */}
              <div style={{ display:'flex', gap:18, alignItems:'center', marginTop:22, paddingTop:18, borderTop:'1px solid rgba(255,255,255,.22)' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                    <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1 }}>{_realStreak}</div>
                    <div style={{ fontSize:12, opacity:.75, fontWeight:600 }}>days</div>
                  </div>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', opacity:.85, marginTop:4 }}>Streak</div>
                </div>
                <div style={{ width:1, alignSelf:'stretch', background:'rgba(255,255,255,.25)' }}/>
                <div>
                  <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1 }}>{_bestScore > 0 ? _bestScore + '%' : '—'}</div>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', opacity:.85, marginTop:4 }}>Best {ex?.scoreLabel || 'score'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TABS — sticky horizontal scroll */}
        <div className="fluentra-tabs" style={{ display:'flex', gap:0, padding:'4px 18px 0', borderBottom:`1px solid ${T.border}`, position:'sticky', top:0, background:T.bg, zIndex:1, overflowX:'auto' }}>
          <style>{`.fluentra-tabs::-webkit-scrollbar{display:none}`}</style>
          {[
            { id:'practice', label:'Practice', active:true },
            { id:'course',   label:'Study' },
            { id:'progress', label:'Stats' },
            { id:'exams',    label:'Exams' },
            { id:'library',  label:'Library' },
            { id:'tutor',    label:'Tutor' },
          ].map(tb => (
            <button key={tb.id} onClick={()=>{ if (tb.id === 'practice') return; window.__setLang(lang.code); nav(tb.id === 'exams' ? 'exam_entry' : tb.id); }} style={{ padding:'12px 14px', fontSize:12.5, fontWeight: tb.active ? 700 : 500, color: tb.active ? T.ink : T.ink3, borderBottom: `2px solid ${tb.active ? t.accent : 'transparent'}`, marginBottom:-1, background:'transparent', whiteSpace:'nowrap', flexShrink:0 }}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* MODULES — 2x2 grid (web has 4-up, mobile is 2-up) */}
        <div style={{ padding:'18px 18px 8px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>Modules</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {mods.map(m => (
              <button key={m.key} onClick={()=>nav(m.n)} style={{
                textAlign:'left', background:T.card, border:`1px solid ${T.border}`,
                borderRadius:14, padding:14, display:'flex', flexDirection:'column', gap:11,
                boxShadow:MT.shadowSm,
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Icon[m.ic]({ width:15, height:15 })}
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1 }}>{score}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:2 }}>{m.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink3, lineHeight:1.3 }}>{m.sub}</div>
                </div>
                <div style={{ fontSize:10.5, color:T.ink4, fontWeight:600, marginTop:'auto' }}>Continue →</div>
              </button>
            ))}
          </div>
        </div>

        {/* UP NEXT — lessons list */}
        <div style={{ padding:'18px 18px 8px' }}>
          <MCard style={{ padding:0 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px', borderBottom:`1px solid ${T.hairline}` }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Up next</div>
              <button onClick={()=>nav('course')} style={{ fontSize:11, color:T.ink3, fontWeight:600 }}>Course →</button>
            </div>
            {lessons.length === 0 ? (
              <div style={{ padding:'18px 16px', fontSize:12, color:T.ink4, textAlign:'center' }}>No active lessons</div>
            ) : lessons.map((row, i, all) => (
              <button key={i} onClick={()=>{ window.__lessonTopic = { title:row.title, unit:row.unit, level:row.level }; nav('lesson_detail'); }} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 16px', borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent' }}>
                <div style={{ width:34, height:34, borderRadius:10, background:t.bg, color:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {Icon.book({ width:14, height:14 })}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:2 }}>{row.unit || 'Lesson'}</div>
                  <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{row.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{row.progress > 0 ? `${Math.round(row.progress*100)}% · ${row.mins||10} min` : `${row.mins||10} min · start`}</div>
                </div>
                <div style={{ fontSize:11, color:t.accent, fontWeight:700, display:'flex', alignItems:'center', gap:3, flexShrink:0 }}>{row.progress > 0 ? 'Resume' : 'Start'} {Icon.arrow({ width:10, height:10 })}</div>
              </button>
            ))}
          </MCard>
        </div>

        {/* WEEKLY GOAL */}
        <div style={{ padding:'10px 18px 8px' }}>
          <MCard style={{ padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:11 }}>Weekly goal</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:5, marginBottom:7 }}>
              <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1 }}>{goal.done}</div>
              <div style={{ fontSize:12, color:T.ink4 }}>/ {goal.target} sessions</div>
            </div>
            <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
              <div style={{ width:`${(goal.done/goal.target)*100}%`, height:'100%', background:t.accent }}/>
            </div>
            <div style={{ fontSize:10.5, color:T.ink4, marginTop:7 }}>{Math.max(0, goal.target - goal.done) === 0 ? 'Goal reached for the week' : `${goal.target - goal.done} session${goal.target - goal.done===1?'':'s'} to go this week`}</div>
          </MCard>
        </div>

        {/* NEXT EXAM */}
        <div style={{ padding:'10px 18px 0' }}>
          <MCard style={{ padding:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:11 }}>Next exam</div>
            <div style={{ background:t.bg, borderRadius:12, padding:12, display:'flex', alignItems:'center', gap:11 }}>
              <div style={{ width:34, height:34, borderRadius:10, background:t.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {Icon.trophy({ width:14, height:14 })}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{lang.exam} mock</div>
                <div style={{ fontSize:10.5, color:T.ink3, marginTop:2 }}>2h 45m · full exam</div>
              </div>
            </div>
            <button onClick={()=>nav('mock_test')} style={{ width:'100%', marginTop:11, padding:'10px', borderRadius:10, border:`1.5px solid ${t.accent}`, background:'transparent', color:t.accent, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
              Schedule mock {Icon.arrow({ width:11, height:11 })}
            </button>
          </MCard>
        </div>
      </MobileBody>
      <MobileTabBar active="home"/>
    </>
  );
}

Object.assign(window, { MLangDetail });
