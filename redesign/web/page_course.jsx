// ── Page: Course Overview ────────────────────────────────────
// Editorial syllabus: hero with progress, unit cards in chapters,
// lesson list per unit with status (done / current / locked), milestones.

function CourseOverviewPage() {
  const lang = window.__langCode || 'en';
  const langObj = (typeof langByCode === 'function') ? langByCode(lang) : { english:'your language' };
  const syllabus = (typeof lessonSyllabus === 'function') ? lessonSyllabus() : [];

  function openLesson(title, unit, level) {
    window.__lessonTopic = { title: title, unit: unit, level: level };
    window.__nav && window.__nav('lesson_detail');
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <div style={{ fontSize:11.5, color:T.ink4, marginBottom:10 }}>{langObj.english} · Course</div>
        <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.1, marginBottom:8 }}>Structured lessons</div>
        <div style={{ fontSize:14, color:T.ink3, lineHeight:1.6, maxWidth:620, marginBottom:30 }}>
          A guided path from beginner to fluent. Each lesson is written for {langObj.english}: a clear explanation, real example sentences, key vocabulary, and a short practice check.
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:26 }}>
          {syllabus.map(function (unit, ui) { return (
            <div key={ui}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <Chip label={unit.level} bg={T.brandLight} accent={T.brand}/>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{unit.unit}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
                {unit.lessons.map(function (title, li) { return (
                  <button key={li} onClick={function(){ openLesson(title, unit.unit, unit.level); }}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:14, background:T.card, border:'1px solid '+T.border, textAlign:'left', cursor:'pointer' }}>
                    <div style={{ width:38, height:38, borderRadius:11, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.book({ width:16, height:16 })}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:3 }}>Lesson {li+1}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.25 }}>{title}</div>
                    </div>
                    <span style={{ color:T.brand, display:'inline-flex' }}>{Icon.arrow ? Icon.arrow({ width:13, height:13 }) : '\u2192'}</span>
                  </button>
                ); })}
              </div>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}

function MCourseOverviewPage({ onBack }) {
  const [openUnit, setOpenUnit] = useState('u1');
  const _cdone = (typeof window!=='undefined' && window.__results) ? window.__results.filter(function(r){ return r.lang === lang; }).length : 0;
  const _cpct = Math.min(100, Math.round(_cdone / 96 * 100));
  const _cstreak = (window.__user && window.__user.streak) || 0;

  const chapters = [
    { id:'c1', label:'Foundations', range:'A1', state:'current',
      units:[{ id:'u1', title:'Hello, Spain', state:'current', lessons:8, done:0 }, { id:'u2', title:'At the café', state:'next', lessons:8, done:0 }] },
    { id:'c2', label:'Everyday life', range:'A2', state:'next',
      units:[
        { id:'u3', title:'A day in the life', state:'next',   lessons:10, done:0 },
        { id:'u4', title:'Asking the way',    state:'locked', lessons:8,  done:0 },
        { id:'u5', title:'Weekends & plans',  state:'locked', lessons:9,  done:0 },
      ] },
    { id:'c3', label:'Stories & opinions', range:'B1', state:'locked',
      units:[{ id:'u6', title:'Once upon a time', state:'locked', lessons:11, done:0 }, { id:'u7', title:'In the news', state:'locked', lessons:10, done:0 }] },
  ];

  const u3lessons = [
    { n:1, title:'Reflexive verbs', kind:'Lesson', state:'done' },
    { n:2, title:'Telling time',     kind:'Lesson', state:'done' },
    { n:3, title:'Routine vocab',    kind:'Vocab',  state:'done' },
    { n:4, title:'Marisol\'s Tuesday',kind:'Listening',state:'done' },
    { n:5, title:'Describe your morning',kind:'Speaking',state:'done' },
    { n:6, title:'Weekday journal',  kind:'Writing',state:'done' },
    { n:7, title:'Adverbs of frequency', kind:'Lesson', state:'current' },
    { n:8, title:'Una mañana en Madrid', kind:'Reading', state:'locked' },
    { n:9, title:'Quiz · Routines',  kind:'Quiz',   state:'locked' },
    { n:10,title:'Record your routine',kind:'Project',state:'locked' },
  ];

  const kindIc = (k) => ({ Lesson:'pen', Vocab:'book', Reading:'book', Listening:'head', Speaking:'mic', Writing:'pen', Quiz:'check', Project:'star' })[k] || 'pen';
  const kindC  = (k) => ({ Listening:T.listening, Speaking:T.speaking, Writing:T.writing, Reading:T.reading, Vocab:T.reading, Lesson:T.writing, Quiz:{ c:T.brand, bg:T.brandLight }, Project:T.writing })[k];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <PhoneHeader title="Spanish course" back onBack={onBack}/>
      <div style={{ flex:1, overflow:'auto', padding:'4px 16px 100px' }}>

        {/* Hero */}
        <div style={{ background:T.es.accentLight, borderRadius:16, padding:'18px', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
            <Flag code="es" w={18} h={12} radius={2}/>
            <span style={{ fontSize:10, fontWeight:700, color:T.es.accent, letterSpacing:'.1em', textTransform:'uppercase' }}>Course · A1 → B1</span>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1, marginBottom:12 }}>A 96-lesson path from greetings to opinions.</div>
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
            <Ring pct={_cpct} size={64} stroke={6} color={T.es.accent} trackColor="rgba(255,255,255,.6)">
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>{_cpct}%</div>
            </Ring>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:T.ink3, marginBottom:6 }}>
                <span>{_cdone} / 96 lessons</span>
                <span>{_cstreak}d streak</span>
              </div>
              <div style={{ fontSize:11, color:T.ink4 }}>~12 weeks at your pace</div>
            </div>
          </div>
          <Btn nav="reading" label={_cdone > 0 ? "Continue learning" : "Start lesson 1"} accent={T.es.accent} fullWidth iconRight={Icon.arrow()}/>
        </div>

        {/* Chapters */}
        {chapters.map((ch, ci) => (
          <div key={ch.id} style={{ marginBottom:12, opacity: ch.state === 'locked' ? .65 : 1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, padding:'0 4px' }}>
              <div style={{ width:28, height:28, borderRadius:14, background: ch.state === 'done' ? T.listening.bg : ch.state === 'current' ? T.es.accentLight : T.bg2, color: ch.state === 'done' ? T.listening.c : ch.state === 'current' ? T.es.accent : T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                {ch.state === 'done' ? Icon.check({ width:12, height:12 }) : ch.state === 'locked' ? Icon.lock({ width:11, height:11 }) : ci+1}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:9.5, fontWeight:700, color:T.es.accent, letterSpacing:'.1em', textTransform:'uppercase' }}>Ch {ci+1} · {ch.range}</div>
                <div style={{ fontFamily:T.serif, fontSize:17, color:T.ink, lineHeight:1.1 }}>{ch.label}</div>
              </div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {ch.units.map(u => {
                const isOpen = u.id === openUnit;
                const uLocked = u.state === 'locked';
                return (
                  <div key={u.id}>
                    <button onClick={() => !uLocked && setOpenUnit(isOpen ? null : u.id)}
                      style={{ width:'100%', padding:'12px 14px', background: isOpen ? T.es.accentLight : T.card, border:`1.5px solid ${isOpen ? T.es.accent : T.border}`, borderRadius:12, textAlign:'left', cursor: uLocked ? 'not-allowed' : 'pointer', opacity: uLocked ? .55 : 1 }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                        <div style={{ fontSize:10, fontWeight:700, color: isOpen ? T.es.accent : T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>Unit {u.id.replace('u','')}</div>
                        {u.state === 'done' && <div style={{ width:16, height:16, borderRadius:8, background:T.listening.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:9, height:9 })}</div>}
                        {u.state === 'current' && <Chip label="Now" accent={T.brand} bg={T.brandLight} style={{ fontSize:9, padding:'1px 6px' }}/>}
                        {u.state === 'locked' && Icon.lock({ width:11, height:11, style:{ color:T.ink5 } })}
                      </div>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, lineHeight:1.2, marginBottom:6 }}>{u.title}</div>
                      <div style={{ height:3, background:T.bg2, borderRadius:99, overflow:'hidden', marginBottom:5 }}>
                        <div style={{ height:'100%', width:`${(u.done/u.lessons)*100}%`, background:T.es.accent }}/>
                      </div>
                      <div style={{ fontSize:10.5, color:T.ink4 }}>{u.done} / {u.lessons} lessons</div>
                    </button>

                    {isOpen && (
                      <div style={{ marginTop:6, padding:'10px 12px', background:T.paper, borderRadius:10, border:`1px solid ${T.border}` }}>
                        {u3lessons.map((l, li) => {
                          const c = kindC(l.kind);
                          return (
                            <div key={li} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 0', borderBottom: li < u3lessons.length - 1 ? `1px solid ${T.hairline}` : 'none', opacity: l.state === 'locked' ? .5 : 1 }}>
                              <div style={{ width:18, fontSize:10, fontWeight:700, color:T.ink4, textAlign:'center' }}>{l.n}</div>
                              <div style={{ width:24, height:24, borderRadius:6, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                                {Icon[kindIc(l.kind)]({ width:11, height:11 })}
                              </div>
                              <div style={{ flex:1, fontSize:12, fontWeight: l.state === 'current' ? 700 : 500, color: l.state === 'current' ? T.ink : T.ink2 }}>{l.title}</div>
                              {l.state === 'done' && <div style={{ width:16, height:16, borderRadius:8, background:T.listening.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:9, height:9 })}</div>}
                              {l.state === 'current' && <span style={{ fontSize:10.5, fontWeight:700, color:T.brand }}>Now</span>}
                              {l.state === 'locked' && Icon.lock({ width:10, height:10, style:{ color:T.ink5 } })}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { CourseOverviewPage, MCourseOverviewPage });
