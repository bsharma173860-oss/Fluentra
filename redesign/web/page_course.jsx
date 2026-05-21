// ── Page: Course Overview ────────────────────────────────────
// Editorial syllabus: hero with progress, unit cards in chapters,
// lesson list per unit with status (done / current / locked), milestones.

function CourseOverviewPage() {
  const [openUnit, setOpenUnit] = useState('u3');

  const course = {
    name:'Spanish · A1 → B1',
    sub:'A 96-lesson path from greetings to opinions on current events.',
    accent:T.es.accent,
    accentLight:T.es.accentLight,
    lang:'es',
    progress:42,
    lessonsDone:40,
    lessonsTotal:96,
    streakHere:14,
    eta:'~12 weeks at your pace',
  };

  const chapters = [
    {
      id:'c1', label:'Foundations', range:'A1', state:'done',
      blurb:'Sounds, greetings, and present-tense survival vocabulary.',
      units:[
        { id:'u1', title:'Hello, Spain', state:'done', lessons:8, done:8, est:'2 weeks' },
        { id:'u2', title:'At the café',  state:'done', lessons:8, done:8, est:'2 weeks' },
      ],
    },
    {
      id:'c2', label:'Everyday life', range:'A2', state:'current',
      blurb:'Routines, asking for directions, talking about your week.',
      units:[
        { id:'u3', title:'A day in the life', state:'current', lessons:10, done:6, est:'2 weeks',
          lessons_:[
            { n:1,  title:'Reflexive verbs (despertarse, levantarse)', kind:'Lesson',  dur:'12 min', state:'done' },
            { n:2,  title:'Telling time — la hora',                    kind:'Lesson',  dur:'10 min', state:'done' },
            { n:3,  title:'Daily routine vocabulary',                  kind:'Vocab',   dur:'8 min',  state:'done' },
            { n:4,  title:'Listening · Marisol\'s Tuesday',            kind:'Listening',dur:'9 min', state:'done' },
            { n:5,  title:'Speaking · Describe your morning',          kind:'Speaking',dur:'12 min', state:'done' },
            { n:6,  title:'Writing · A weekday journal entry',         kind:'Writing', dur:'15 min', state:'done' },
            { n:7,  title:'Adverbs of frequency',                      kind:'Lesson',  dur:'10 min', state:'current' },
            { n:8,  title:'Reading · Una mañana en Madrid',            kind:'Reading', dur:'12 min', state:'locked' },
            { n:9,  title:'Quiz · Routines',                           kind:'Quiz',    dur:'8 min',  state:'locked' },
            { n:10, title:'Mini-project · Record your routine',        kind:'Project', dur:'20 min', state:'locked' },
          ],
        },
        { id:'u4', title:'Asking the way',   state:'next',    lessons:8,  done:0, est:'2 weeks' },
        { id:'u5', title:'Weekends & plans', state:'locked',  lessons:9,  done:0, est:'2 weeks' },
      ],
    },
    {
      id:'c3', label:'Stories & opinions', range:'B1', state:'locked',
      blurb:'Past tenses, narrating, and giving an opinion on something.',
      units:[
        { id:'u6', title:'Once upon a time', state:'locked', lessons:11, done:0, est:'3 weeks' },
        { id:'u7', title:'In the news',      state:'locked', lessons:10, done:0, est:'3 weeks' },
        { id:'u8', title:'What I think',     state:'locked', lessons:11, done:0, est:'3 weeks' },
      ],
    },
    {
      id:'c4', label:'DELE B1 prep', range:'Exam', state:'locked',
      blurb:'Mock exams, timed writing prompts, oral simulation.',
      units:[
        { id:'u9',  title:'Reading & listening drills', state:'locked', lessons:6, done:0, est:'2 weeks' },
        { id:'u10', title:'Writing — task 1 & 2',       state:'locked', lessons:6, done:0, est:'2 weeks' },
        { id:'u11', title:'Oral simulation',            state:'locked', lessons:5, done:0, est:'2 weeks' },
      ],
    },
  ];

  const milestones = [
    { at:8,  label:'Order food in a café',   done:true },
    { at:24, label:'Hold a 5-min conversation about your day', done:true },
    { at:48, label:'Write a 200-word journal entry',  done:false, current:true },
    { at:72, label:'Discuss a news article',          done:false },
    { at:96, label:'DELE B1 mock — passing band',     done:false },
  ];

  const lessonKindStyle = (k) => ({
    Lesson:    { ic:'pen',  c:T.writing },
    Vocab:     { ic:'book', c:T.reading },
    Reading:   { ic:'book', c:T.reading },
    Listening: { ic:'head', c:T.listening },
    Speaking:  { ic:'mic',  c:T.speaking },
    Writing:   { ic:'pen',  c:T.writing },
    Quiz:      { ic:'check',c:{ c:T.brand, bg:T.brandLight } },
    Project:   { ic:'star', c:{ c:T.writing.c, bg:T.writing.bg } },
  })[k];

  const stateChip = (s) => {
    if (s === 'done')     return <Chip label="Done"     accent={T.listening.c} bg={T.listening.bg}/>;
    if (s === 'current')  return <Chip label="In progress" accent={T.brand}    bg={T.brandLight}/>;
    if (s === 'next')     return <Chip label="Up next"  accent={T.ink2}        bg={T.bg2}/>;
    return <Chip label="Locked" accent={T.ink5} bg={T.bg2} icon={Icon.lock({ width:9, height:9 })}/>;
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>

        {/* HERO */}
        <div style={{ background:course.accentLight, borderRadius:18, padding:'32px 36px', marginBottom:28, position:'relative', overflow:'hidden', border:`1px solid ${T.border}` }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:240, height:240, borderRadius:120, background:`${course.accent}15` }}/>
          <div style={{ position:'absolute', top:60, right:80, width:140, height:140, borderRadius:70, background:`${course.accent}10` }}/>

          <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 320px', gap:36, alignItems:'center' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <Flag code={course.lang} w={22} h={15} radius={3}/>
                <span style={{ fontSize:11, fontWeight:700, color:course.accent, letterSpacing:'.12em', textTransform:'uppercase' }}>Course · {course.lang.toUpperCase()}</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1.05, marginBottom:14 }}>
                {course.name}
              </div>
              <div style={{ fontSize:15.5, color:T.ink2, lineHeight:1.5, marginBottom:24, maxWidth:560 }}>
                {course.sub}
              </div>
              <div style={{ display:'flex', gap:24, marginBottom:24 }}>
                <div>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Lessons</div>
                  <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1 }}>{course.lessonsDone}<span style={{ color:T.ink5 }}> / {course.lessonsTotal}</span></div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Streak here</div>
                  <div style={{ fontFamily:T.serif, fontSize:28, color:T.brand, lineHeight:1, display:'flex', alignItems:'baseline', gap:6 }}>{course.streakHere}<span style={{ fontFamily:T.sans, fontSize:13, color:T.ink4, fontWeight:600 }}>days</span></div>
                </div>
                <div>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>To finish</div>
                  <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1 }}>{course.eta}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <Btn nav="reading" label="Continue lesson 7 of 10" iconRight={Icon.arrow()} accent={course.accent}/>
                <Btn nav="practice" label="Practice mode"  variant="outline" accent={course.accent}/>
              </div>
            </div>

            {/* Progress ring + chapter pip */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
              <Ring pct={course.progress} size={180} stroke={12} color={course.accent} trackColor={T.card}>
                <div style={{ fontFamily:T.serif, fontSize:48, color:T.ink, lineHeight:1 }}>{course.progress}<span style={{ fontSize:22, color:T.ink4 }}>%</span></div>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', marginTop:4 }}>Course complete</div>
              </Ring>
              <div style={{ background:T.card, padding:'8px 14px', borderRadius:10, fontSize:11.5, color:T.ink3, border:`1px solid ${T.border}` }}>
                Currently in <strong style={{ color:T.ink }}>Chapter 2 · A day in the life</strong>
              </div>
            </div>
          </div>
        </div>

        {/* MILESTONES STRIP */}
        <Card style={{ marginBottom:28 }} padding={20}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Milestones</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1 }}>What you'll be able to do</div>
            </div>
            <Chip label="2 of 5 reached" accent={T.listening.c} bg={T.listening.bg}/>
          </div>

          <div style={{ position:'relative', padding:'8px 0 0' }}>
            <div style={{ position:'absolute', top:24, left:24, right:24, height:2, background:T.trackWarm }}/>
            <div style={{ position:'absolute', top:24, left:24, width:`${(40/96) * 100 * 0.92}%`, height:2, background:course.accent }}/>
            <div style={{ display:'flex', justifyContent:'space-between', position:'relative' }}>
              {milestones.map((m, i) => {
                const pct = Math.round((m.at / 96) * 100);
                return (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', maxWidth:140, textAlign:'center', flex:1 }}>
                    <div style={{ width:34, height:34, borderRadius:17, background: m.done ? course.accent : m.current ? T.brand : T.card, color: (m.done || m.current) ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', border: m.done ? 'none' : `2px solid ${m.current ? T.brand : T.border}`, fontSize:11, fontWeight:700, marginBottom:10, boxShadow: m.current ? `0 0 0 6px ${T.brandLight}` : 'none' }}>
                      {m.done ? Icon.check({ width:14, height:14 }) : m.at}
                    </div>
                    <div style={{ fontSize:11.5, fontWeight:600, color: m.done || m.current ? T.ink2 : T.ink4, lineHeight:1.35, textWrap:'pretty' }}>{m.label}</div>
                    <div style={{ fontSize:10, color:T.ink5, marginTop:4 }}>Lesson {m.at}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* CHAPTERS */}
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Syllabus</div>
            <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.1 }}>Four chapters, eleven units.</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{ padding:'8px 12px', fontSize:12, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, borderRadius:8, display:'flex', alignItems:'center', gap:5 }}>{Icon.cal({ width:12, height:12 })} View on calendar</button>
            <button style={{ padding:'8px 12px', fontSize:12, fontWeight:600, color:T.ink3, background:T.card, border:`1px solid ${T.border}`, borderRadius:8 }}>Print syllabus</button>
          </div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {chapters.map((ch, ci) => {
            const isLocked = ch.state === 'locked';
            return (
              <div key={ch.id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, overflow:'hidden', opacity: isLocked ? .65 : 1 }}>
                {/* Chapter header */}
                <div style={{ padding:'18px 22px', display:'flex', alignItems:'center', gap:18, borderBottom:`1px solid ${T.hairline}` }}>
                  <div style={{ width:48, height:48, borderRadius:24, background: ch.state === 'done' ? T.listening.bg : ch.state === 'current' ? course.accentLight : T.bg2, color: ch.state === 'done' ? T.listening.c : ch.state === 'current' ? course.accent : T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:18, flexShrink:0 }}>
                    {ch.state === 'done' ? Icon.check({ width:18, height:18 }) : ch.state === 'locked' ? Icon.lock({ width:14, height:14 }) : ci+1}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                      <div style={{ fontSize:10.5, fontWeight:700, color:course.accent, letterSpacing:'.1em', textTransform:'uppercase' }}>Chapter {ci+1} · {ch.range}</div>
                      {stateChip(ch.state)}
                    </div>
                    <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1 }}>{ch.label}</div>
                    <div style={{ fontSize:12.5, color:T.ink3, marginTop:4 }}>{ch.blurb}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:T.ink4, fontWeight:700 }}>{ch.units.length} units</div>
                    <div style={{ fontSize:11, color:T.ink5, marginTop:2 }}>{ch.units.reduce((s,u)=>s+u.lessons,0)} lessons</div>
                  </div>
                </div>

                {/* Units row */}
                <div style={{ padding:'14px 22px 18px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(ch.units.length, 3)}, 1fr)`, gap:10 }}>
                    {ch.units.map(u => {
                      const isOpen = u.id === openUnit && u.state !== 'locked';
                      const uLocked = u.state === 'locked';
                      return (
                        <button key={u.id}
                          onClick={() => !uLocked && setOpenUnit(isOpen ? null : u.id)}
                          style={{ padding:'14px 16px', background: isOpen ? course.accentLight : T.bg2, border:`1.5px solid ${isOpen ? course.accent : T.border}`, borderRadius:12, textAlign:'left', cursor: uLocked ? 'not-allowed' : 'pointer', opacity: uLocked ? .55 : 1 }}>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                            <div style={{ fontSize:11, fontWeight:700, color: isOpen ? course.accent : T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>Unit {u.id.replace('u','')}</div>
                            {u.state === 'done' && <div style={{ width:18, height:18, borderRadius:9, background:T.listening.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:10, height:10 })}</div>}
                            {u.state === 'current' && <Chip label="Now" accent={T.brand} bg={T.brandLight} style={{ fontSize:9.5, padding:'2px 7px' }}/>}
                            {u.state === 'locked' && Icon.lock({ width:12, height:12, style:{ color:T.ink5 } })}
                          </div>
                          <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.2, marginBottom:8 }}>{u.title}</div>
                          <div style={{ height:4, background:T.card, borderRadius:99, overflow:'hidden', marginBottom:8 }}>
                            <div style={{ height:'100%', width:`${(u.done/u.lessons)*100}%`, background:course.accent }}/>
                          </div>
                          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, color:T.ink4 }}>
                            <span>{u.done} / {u.lessons} lessons</span>
                            <span>{u.est}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Expanded unit lesson list */}
                  {ch.units.find(u => u.id === openUnit && u.lessons_) && (() => {
                    const u = ch.units.find(u => u.id === openUnit);
                    return (
                      <div style={{ marginTop:14, padding:'16px 18px', background:T.paper, borderRadius:12, border:`1px solid ${T.border}` }}>
                        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Inside {u.title}</div>
                          <button style={{ fontSize:11.5, color:T.ink3, fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>{Icon.x({ width:11, height:11 })} Collapse</button>
                        </div>
                        <div style={{ display:'flex', flexDirection:'column' }}>
                          {u.lessons_.map((l, li) => {
                            const k = lessonKindStyle(l.kind);
                            const locked = l.state === 'locked';
                            return (
                              <div key={li} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 4px', borderBottom: li < u.lessons_.length - 1 ? `1px solid ${T.hairline}` : 'none', opacity: locked ? .5 : 1 }}>
                                <div style={{ width:24, fontSize:11, fontWeight:700, color:T.ink4, textAlign:'center', flexShrink:0 }}>{l.n}</div>
                                <div style={{ width:30, height:30, borderRadius:8, background:k.c.bg, color:k.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                                  {Icon[k.ic]({ width:13, height:13 })}
                                </div>
                                <div style={{ flex:1, minWidth:0 }}>
                                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:1 }}>
                                    <Chip label={l.kind} accent={k.c.c} bg={k.c.bg} style={{ fontSize:9.5, padding:'2px 7px' }}/>
                                    <span style={{ fontSize:10.5, color:T.ink4, display:'flex', alignItems:'center', gap:3 }}>{Icon.clock({ width:10, height:10 })} {l.dur}</span>
                                  </div>
                                  <div style={{ fontSize:13, fontWeight: l.state === 'current' ? 700 : 500, color: l.state === 'current' ? T.ink : T.ink2 }}>{l.title}</div>
                                </div>
                                {l.state === 'done' && <div style={{ width:22, height:22, borderRadius:11, background:T.listening.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.check({ width:12, height:12 })}</div>}
                                {l.state === 'current' && <Btn label="Resume" nav="reading" size="sm" accent={T.brand} iconRight={Icon.arrow({ width:11, height:11 })}/>}
                                {l.state === 'locked' && Icon.lock({ width:12, height:12, style:{ color:T.ink5 } })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Mobile ─────────────────────────────────────────────────────
function MCourseOverviewPage({ onBack }) {
  const [openUnit, setOpenUnit] = useState('u3');

  const chapters = [
    { id:'c1', label:'Foundations', range:'A1', state:'done',
      units:[{ id:'u1', title:'Hello, Spain', state:'done', lessons:8, done:8 }, { id:'u2', title:'At the café', state:'done', lessons:8, done:8 }] },
    { id:'c2', label:'Everyday life', range:'A2', state:'current',
      units:[
        { id:'u3', title:'A day in the life', state:'current', lessons:10, done:6 },
        { id:'u4', title:'Asking the way',    state:'next',    lessons:8,  done:0 },
        { id:'u5', title:'Weekends & plans',  state:'locked',  lessons:9,  done:0 },
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
            <Ring pct={42} size={64} stroke={6} color={T.es.accent} trackColor="rgba(255,255,255,.6)">
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1 }}>42%</div>
            </Ring>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:T.ink3, marginBottom:6 }}>
                <span>40 / 96 lessons</span>
                <span>14d streak</span>
              </div>
              <div style={{ fontSize:11, color:T.ink4 }}>~12 weeks at your pace</div>
            </div>
          </div>
          <Btn nav="reading" label="Continue lesson 7" accent={T.es.accent} fullWidth iconRight={Icon.arrow()}/>
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
                const isOpen = u.id === openUnit && u.id === 'u3';
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
