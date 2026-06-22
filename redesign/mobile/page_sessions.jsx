// ── Mobile · Session screens (focus mode) ───────────────────
// Reading / Listening / Speaking / Writing — phone-native, single-column,
// fixed bottom action bar, top progress chrome.

function MSessionHeader({ title, eyebrow, progress, timeLeft, color, onExit }) {
  const mins = Math.floor((timeLeft||0) / 60);
  const secs = (timeLeft||0) % 60;
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <div style={{ flexShrink:0, background:MT.card, borderBottom:`1px solid ${MT.divider}`, padding:'4px 14px 10px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', minHeight:36, marginBottom:8 }}>
        <button onClick={()=> onExit ? onExit() : nav('practice')} style={{ width:32, height:32, borderRadius:9, display:'flex', alignItems:'center', justifyContent:'center', color:MT.ink2, background:MT.bg2 }}>{Icon.x ? Icon.x() : Icon.arrowL()}</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:9.5, color:MT.ink4, fontWeight:800, letterSpacing:'.14em', textTransform:'uppercase' }}>{eyebrow}</div>
          <div style={{ fontSize:13, color:MT.ink, fontWeight:700, marginTop:1, lineHeight:1.1 }}>{title}</div>
        </div>
        <div style={{ minWidth:32, height:32, padding:'0 8px', borderRadius:9, background:`${color}1a`, color, fontFamily:T.serif, fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', letterSpacing:'-.01em' }}>
          {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
        </div>
      </div>
      <div style={{ height:3, background:MT.bg2, borderRadius:99, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${progress||0}%`, background:color, borderRadius:99, transition:'width .3s' }}/>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE READING
// ═══════════════════════════════════════════════════════════
function MReadingSession() {
  const _gen = (typeof useGenContent === 'function') ? useGenContent('reading') : 'err';
  const [tab, setTab] = React.useState('passage'); // passage | questions
  const [answered, setAnswered] = React.useState({});
  const _r = (_gen && _gen !== 'err') ? _gen : ((typeof _sc === 'function') ? _sc('reading') : { title:'Reading', passage:'', questions:[], passageLabel:'PASSAGE', qLabel:'QUESTIONS', placeholder:'Type answer…', submit:'Submit' });
  if (_gen === null) return <MGenLoading skill="reading" color={T.reading.c}/>;
  const total = (_r.questions || []).length || 5;
  const done = Object.keys(answered).length;
  const progress = (done / total) * 100;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:MT.bg }}>
      <MSessionHeader title={_r.title} eyebrow="READING · IELTS" progress={progress} timeLeft={2180} color={T.reading.c}/>
      {/* Tab toggle */}
      <div style={{ flexShrink:0, padding:'10px 14px 0', background:MT.bg }}>
        <div style={{ display:'flex', gap:0, background:MT.bg2, borderRadius:10, padding:3 }}>
          {[{ id:'passage', l:_r.passageLabel || 'Passage' }, { id:'questions', l:`Questions · ${done}/${total}` }].map(p => (
            <button key={p.id} onClick={()=>setTab(p.id)} style={{ flex:1, padding:'8px 8px', borderRadius:8, fontSize:11.5, fontWeight: tab===p.id ? 700 : 500, color: tab===p.id ? MT.ink : MT.ink3, background: tab===p.id ? MT.card : 'transparent', boxShadow: tab===p.id ? MT.shadowSm : 'none' }}>{p.l}</button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflow:'auto', padding:'14px 16px 110px' }}>
        {tab === 'passage' && (
          <article style={{ fontSize:14, lineHeight:1.75, color:MT.ink2, fontFamily:"Georgia,serif" }}>
            {(_r.passage || '').split('\n\n').map((p,i) => <p key={i} style={{ marginBottom:14, textWrap:'pretty' }}>{p}</p>)}
          </article>
        )}
        {tab === 'questions' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {(_r.questions || []).map(q => {
              const a = answered[q.n];
              return (
                <div key={q.n} style={{ background: a ? T.reading.bg : MT.card, border:`1px solid ${a ? T.reading.c+'44' : MT.hairline}`, borderRadius:14, padding:'13px 14px' }}>
                  <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                    <div style={{ width:22, height:22, borderRadius:11, background: a ? T.reading.c : MT.bg2, color: a ? '#fff' : MT.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10.5, fontWeight:800, flexShrink:0 }}>{q.n}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:9.5, color:T.reading.c, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{q.type}</div>
                      <div style={{ fontSize:12.5, color:MT.ink, lineHeight:1.4 }}>{q.stem}</div>
                    </div>
                  </div>
                  {q.options ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:6, paddingLeft:32 }}>
                      {q.options.map(opt => {
                        const sel = a === opt;
                        return (
                          <button key={opt} onClick={()=>setAnswered(s => ({...s, [q.n]: opt}))} style={{
                            padding:'9px 12px', borderRadius:9, fontSize:12.5,
                            border:`1.5px solid ${sel ? T.reading.c : MT.hairline}`,
                            background: sel ? T.reading.bg : 'transparent',
                            color: sel ? T.reading.c : MT.ink,
                            fontWeight: sel ? 700 : 500,
                            textAlign:'left',
                          }}>{opt}</button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ paddingLeft:32 }}>
                      <input placeholder={_r.placeholder} onChange={e => setAnswered(s => ({...s, [q.n]: e.target.value || ' '}))} style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid ${MT.hairline}`, fontSize:12.5, color:MT.ink, outline:'none', background:MT.card }}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom action bar */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'10px 14px 14px', background:`${MT.card}f0`, backdropFilter:'blur(10px)', borderTop:`1px solid ${MT.divider}` }}>
        <div style={{ display:'flex', gap:8 }}>
          {tab === 'passage' ? (
            <button onClick={()=>setTab('questions')} style={{ flex:1, padding:'13px', borderRadius:11, background:T.reading.c, color:'#fff', fontSize:14, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:`0 6px 14px ${T.reading.c}55` }}>
              Answer questions {Icon.arrow({ width:13, height:13 })}
            </button>
          ) : (
            <button onClick={()=>window.__nav && window.__nav('mod_results')} style={{ flex:1, padding:'13px', borderRadius:11, background:T.reading.c, color:'#fff', fontSize:14, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:`0 6px 14px ${T.reading.c}55` }}>
              {_r.submit || 'Submit'} {Icon.arrow({ width:13, height:13 })}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE LISTENING
// ═══════════════════════════════════════════════════════════
function MListeningSession() {
  const _gen = (typeof useGenContent === 'function') ? useGenContent('listening') : 'err';
  const [playing, setPlaying] = React.useState(false);
  const [pct, setPct] = React.useState(34);
  const [answered, setAnswered] = React.useState({});
  const _l = (_gen && _gen !== 'err') ? _gen : ((typeof _sc === 'function') ? _sc('listening') : { title:'Listening', sectionLabel:'Section 3', taskLabel:'Multiple choice', questions:[], speakers:[], submit:'Submit' });
  if (_gen === null) return <MGenLoading skill="listening" color={T.listening.c}/>;
  const total = (_l.questions || []).length || 4;
  const done = Object.keys(answered).length;
  const progress = (done / total) * 100;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:MT.bg, position:'relative' }}>
      <MSessionHeader title={_l.title} eyebrow={`LISTENING · ${_l.sectionLabel || 'Section 3'}`} progress={progress} timeLeft={1820} color={T.listening.c}/>

      {/* Player card */}
      <div style={{ flexShrink:0, padding:'14px 14px 0' }}>
        <div style={{ background:`linear-gradient(160deg, ${T.listening.c} 0%, #2A6FA0 100%)`, borderRadius:18, padding:'18px 16px', color:'#fff', boxShadow:`0 12px 24px ${T.listening.c}44`, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-25, right:-25, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.75, marginBottom:6 }}>{_l.taskLabel || 'Now playing'}</div>
            <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1.15, marginBottom:14, letterSpacing:'-.01em' }}>{_l.title}</div>

            {/* Waveform */}
            <div style={{ display:'flex', alignItems:'center', gap:2, height:34, marginBottom:6 }}>
              {Array.from({ length:42 }).map((_,i) => {
                const h = 12 + Math.abs(Math.sin(i * 0.7 + 1.2)) * 22;
                const past = (i / 42) * 100 < pct;
                return <div key={i} style={{ flex:1, height:h, borderRadius:1.5, background: past ? '#fff' : 'rgba(255,255,255,.28)' }}/>;
              })}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, opacity:.78, marginBottom:14 }}>
              <span>1:42</span><span>5:08</span>
            </div>

            {/* Controls */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:18 }}>
              <button onClick={()=>setPct(Math.max(0, pct-10))} style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.14)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>‹‹</button>
              <button onClick={()=>setPlaying(p=>!p)} style={{ width:54, height:54, borderRadius:27, background:'#fff', color:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 6px 14px rgba(0,0,0,.18)' }}>
                {playing ? <span style={{ fontSize:20, fontWeight:800 }}>‖</span> : Icon.play({ width:18, height:18 })}
              </button>
              <button onClick={()=>setPct(Math.min(100, pct+10))} style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.14)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>››</button>
            </div>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ flex:1, overflow:'auto', padding:'14px 16px 110px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontSize:10, color:MT.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>Questions</div>
          <div style={{ fontSize:10.5, color:T.listening.c, fontWeight:700, background:T.listening.bg, padding:'3px 8px', borderRadius:99 }}>{done}/{total}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {(_l.questions || []).map(q => {
            const a = answered[q.n];
            return (
              <div key={q.n} style={{ background: a ? T.listening.bg : MT.card, border:`1px solid ${a ? T.listening.c+'44' : MT.hairline}`, borderRadius:13, padding:'12px 13px' }}>
                <div style={{ display:'flex', gap:9, marginBottom:9 }}>
                  <div style={{ width:20, height:20, borderRadius:10, background: a ? T.listening.c : MT.bg2, color: a ? '#fff' : MT.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, flexShrink:0 }}>{q.n}</div>
                  <div style={{ flex:1, fontSize:12.5, color:MT.ink, lineHeight:1.4 }}>{q.stem}</div>
                </div>
                {q.options && (
                  <div style={{ display:'flex', flexDirection:'column', gap:5, paddingLeft:30 }}>
                    {q.options.map(opt => {
                      const sel = a === opt;
                      return (
                        <button key={opt} onClick={()=>setAnswered(s => ({...s, [q.n]: opt}))} style={{ padding:'8px 11px', borderRadius:9, fontSize:12, border:`1.5px solid ${sel ? T.listening.c : MT.hairline}`, background: sel ? T.listening.bg : 'transparent', color: sel ? T.listening.c : MT.ink, fontWeight: sel ? 700 : 500, textAlign:'left' }}>{opt}</button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'10px 14px 14px', background:`${MT.card}f0`, backdropFilter:'blur(10px)', borderTop:`1px solid ${MT.divider}` }}>
        <button onClick={()=>window.__nav && window.__nav('mod_results')} style={{ width:'100%', padding:'13px', borderRadius:11, background:T.listening.c, color:'#fff', fontSize:14, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:`0 6px 14px ${T.listening.c}55` }}>
          {_l.submit || 'Submit'} {Icon.arrow({ width:13, height:13 })}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE SPEAKING
// ═══════════════════════════════════════════════════════════
function MSpeakingSession() {
  const _gen = (typeof useGenContent === 'function') ? useGenContent('speaking') : 'err';
  const [phase, setPhase] = React.useState('prep'); // prep | recording | done
  const [secs, setSecs] = React.useState(60);

  React.useEffect(() => {
    if (phase !== 'recording') return;
    const id = setInterval(() => setSecs(s => Math.max(0, s-1)), 1000);
    return () => clearInterval(id);
  }, [phase]);

  const _s = (_gen && _gen !== 'err') ? _gen : ((typeof _sc === 'function') ? _sc('speaking') : { title:'Speaking', partLabel:'Part 2', prompt:'Describe a place you would like to visit.', followups:[], submit:'Submit' });
  if (_gen === null) return <MGenLoading skill="speaking" color={T.speaking.c}/>;
  const ringPct = phase === 'recording' ? ((60 - secs) / 60) * 100 : 0;

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:`linear-gradient(180deg, ${T.speaking.bg} 0%, ${MT.bg} 60%)`, position:'relative' }}>
      <MSessionHeader title={_s.title} eyebrow={`SPEAKING · ${_s.partLabel || 'Part 2'}`} progress={phase === 'done' ? 100 : phase === 'recording' ? ringPct : 20} timeLeft={120} color={T.speaking.c}/>

      <div style={{ flex:1, overflow:'auto', padding:'18px 18px 130px', display:'flex', flexDirection:'column' }}>
        {/* Cue card */}
        <div style={{ background:MT.card, border:`1px solid ${T.speaking.c}26`, borderRadius:18, padding:18, boxShadow:MT.shadowMd, marginBottom:18 }}>
          <div style={{ fontSize:9.5, color:T.speaking.c, fontWeight:800, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>Cue card</div>
          <div style={{ fontFamily:T.serif, fontSize:18, color:MT.ink, lineHeight:1.3, marginBottom:14, letterSpacing:'-.01em' }}>{_s.prompt}</div>
          {(_s.followups || []).length > 0 && (
            <div style={{ borderTop:`1px solid ${MT.divider}`, paddingTop:11, marginTop:6 }}>
              <div style={{ fontSize:9.5, color:MT.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:7 }}>You should say</div>
              {_s.followups.map((f,i) => (
                <div key={i} style={{ fontSize:12, color:MT.ink2, marginBottom:5, display:'flex', gap:7 }}>
                  <span style={{ color:T.speaking.c, flexShrink:0 }}>•</span>{f}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recorder */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, marginTop:'auto', marginBottom:'auto' }}>
          {/* Mic button with progress ring */}
          <div style={{ position:'relative', width:130, height:130 }}>
            <svg width="130" height="130" style={{ position:'absolute', top:0, left:0, transform:'rotate(-90deg)' }}>
              <circle cx="65" cy="65" r="58" fill="none" stroke={MT.bg2} strokeWidth="6"/>
              <circle cx="65" cy="65" r="58" fill="none" stroke={T.speaking.c} strokeWidth="6" strokeDasharray={`${(ringPct/100) * 364} 364`} strokeLinecap="round" style={{ transition:'stroke-dasharray 1s linear' }}/>
            </svg>
            <button onClick={() => {
              if (phase === 'prep') setPhase('recording');
              else if (phase === 'recording') setPhase('done');
              else setPhase('prep');
            }} style={{
              position:'absolute', inset:14,
              borderRadius:'50%',
              background: phase === 'recording' ? T.speaking.c : phase === 'done' ? T.listening.c : T.speaking.c,
              color:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow: `0 10px 22px ${T.speaking.c}66`,
              border:'4px solid #fff',
            }}>
              {phase === 'recording' ? <span style={{ width:22, height:22, background:'#fff', borderRadius:4 }}/> :
               phase === 'done' ? Icon.check({ width:30, height:30 }) :
               Icon.mic({ width:34, height:34 })}
            </button>
          </div>
          <div style={{ fontSize:11, color:MT.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>
            {phase === 'prep' && '1 min prep · tap to record'}
            {phase === 'recording' && `Recording · ${secs}s left`}
            {phase === 'done' && 'Recording complete'}
          </div>
          {phase === 'recording' && (
            <div style={{ display:'flex', alignItems:'center', gap:3, marginTop:4 }}>
              {Array.from({ length:24 }).map((_,i) => {
                const h = 8 + Math.abs(Math.sin(i + Date.now()/300)) * 14;
                return <div key={i} style={{ width:3, height:h, background:T.speaking.c, borderRadius:2, opacity:.6 + (i % 3) * 0.13 }}/>;
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'10px 14px 14px', background:`${MT.card}f0`, backdropFilter:'blur(10px)', borderTop:`1px solid ${MT.divider}` }}>
        {phase === 'done' ? (
          <button onClick={()=>window.__nav && window.__nav('mod_results')} style={{ width:'100%', padding:'13px', borderRadius:11, background:T.speaking.c, color:'#fff', fontSize:14, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, boxShadow:`0 6px 14px ${T.speaking.c}55` }}>
            {_s.submit || 'Submit recording'} {Icon.arrow({ width:13, height:13 })}
          </button>
        ) : (
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={() => setPhase('recording')} style={{ flex:1, padding:'12px', borderRadius:11, background:MT.bg2, color:MT.ink, fontSize:13, fontWeight:600, border:`1px solid ${MT.hairline}` }}>Skip prep</button>
            <button onClick={() => setPhase(phase === 'prep' ? 'recording' : 'done')} style={{ flex:2, padding:'12px', borderRadius:11, background:T.speaking.c, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 14px ${T.speaking.c}55` }}>
              {phase === 'prep' ? 'Start recording' : 'Stop recording'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MOBILE WRITING
// ═══════════════════════════════════════════════════════════
function MWritingSession() {
  const _gen = (typeof useGenContent === 'function') ? useGenContent('writing') : 'err';
  const [task, setTask] = React.useState('task2');
  const [tab, setTab] = React.useState('prompt'); // prompt | write
  const [text, setText] = React.useState('');
  const _w = (_gen && _gen !== 'err') ? _gen : ((typeof _sc === 'function') ? _sc('writing') : { task1Title:'Task 1', task2Title:'Task 2', task1Meta:'150 words', task2Meta:'250 words', task1Prompt:'', task2Intro:'', task2Topic:'', task2Outro:'', task1Tips:[], task2Tips:[], submit:'Submit', tipsLabel:'Tips' });
  if (_gen === null) return <MGenLoading skill="writing" color={T.writing.c}/>;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const TARGET = task === 'task1' ? 150 : 250;
  const pct = Math.min(100, (wordCount / TARGET) * 100);

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background:MT.bg, position:'relative' }}>
      <MSessionHeader title={task === 'task1' ? _w.task1Title : _w.task2Title} eyebrow={`WRITING · ${task.toUpperCase()}`} progress={pct} timeLeft={task === 'task1' ? 1180 : 2380} color={T.writing.c}/>

      {/* Task switch + tabs */}
      <div style={{ flexShrink:0, padding:'10px 14px 0', background:MT.bg, display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', gap:6 }}>
          {[{id:'task1',l:'Task 1'},{id:'task2',l:'Task 2'}].map(t => {
            const a = task === t.id;
            return (
              <button key={t.id} onClick={()=>{ setTask(t.id); setText(''); }} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:11.5, fontWeight: a?700:500, color: a?T.writing.c:MT.ink3, background: a?T.writing.bg:MT.card, border:`1px solid ${a?T.writing.c+'44':MT.hairline}` }}>{t.l}</button>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:0, background:MT.bg2, borderRadius:10, padding:3 }}>
          {[{ id:'prompt', l:'Prompt' }, { id:'write', l:`Write · ${wordCount}/${TARGET}` }].map(p => (
            <button key={p.id} onClick={()=>setTab(p.id)} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:11.5, fontWeight: tab===p.id ? 700 : 500, color: tab===p.id ? MT.ink : MT.ink3, background: tab===p.id ? MT.card : 'transparent', boxShadow: tab===p.id ? MT.shadowSm : 'none' }}>{p.l}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'12px 14px 110px', display:'flex', flexDirection:'column' }}>
        {tab === 'prompt' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:14, boxShadow:MT.shadowSm }}>
              <div style={{ fontSize:9.5, color:MT.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8 }}>{task === 'task1' ? _w.task1Meta : _w.task2Meta}</div>
              {task === 'task1' ? (
                <>
                  <div style={{ fontSize:13.5, color:MT.ink, lineHeight:1.5, fontFamily:'Georgia,serif', marginBottom:12, whiteSpace:'pre-line' }}>{_w.task1Prompt}</div>
                  <div style={{ background:MT.bg2, borderRadius:10, padding:12 }}>
                    <div style={{ fontSize:9.5, color:MT.ink4, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>{_w.chartLabel || 'Chart'}</div>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:80 }}>
                      {[[2005,120],[2008,145],[2011,185],[2014,210],[2017,240],[2020,195]].map(([yr,v]) => (
                        <div key={yr} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                          <div style={{ width:'100%', background:T.writing.c, borderRadius:'4px 4px 0 0', height:(v/240)*100+'%', opacity:.85 }}/>
                          <div style={{ fontSize:9, color:MT.ink4, fontWeight:600 }}>{yr}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ fontSize:13.5, color:MT.ink, lineHeight:1.5, fontFamily:'Georgia,serif' }}>
                  <strong>{_w.task2Intro}</strong><br/><br/>
                  <em>{_w.task2Topic}</em><br/><br/>
                  {_w.task2Outro}
                </div>
              )}
            </div>

            <div style={{ background:`linear-gradient(160deg, ${T.writing.bg} 0%, ${MT.card} 100%)`, border:`1px solid ${T.writing.c}26`, borderRadius:14, padding:14 }}>
              <div style={{ fontSize:10, fontWeight:800, color:T.writing.c, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:9, display:'flex', alignItems:'center', gap:5 }}>
                {Icon.spark({ width:11, height:11 })} {_w.tipsLabel || 'AI tips'}
              </div>
              {(task === 'task1' ? _w.task1Tips : _w.task2Tips).map((t,i) => (
                <div key={i} style={{ fontSize:12, color:MT.ink2, marginBottom:6, display:'flex', gap:7, lineHeight:1.4 }}>
                  <span style={{ color:T.writing.c, flexShrink:0 }}>→</span>{t}
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'write' && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:340 }}>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start writing your essay…" style={{ flex:1, width:'100%', minHeight:340, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:14, fontSize:14, lineHeight:1.7, color:MT.ink, fontFamily:'Georgia,serif', background:MT.card, outline:'none', resize:'none', boxShadow:MT.shadowSm }}/>
          </div>
        )}
      </div>

      <div style={{ position:'absolute', left:0, right:0, bottom:0, padding:'10px 14px 14px', background:`${MT.card}f0`, backdropFilter:'blur(10px)', borderTop:`1px solid ${MT.divider}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          <div style={{ flex:1, height:5, background:MT.bg2, borderRadius:99, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${pct}%`, background: wordCount >= TARGET ? T.listening.c : T.writing.c, borderRadius:99, transition:'width .3s' }}/>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color: wordCount >= TARGET ? T.listening.c : MT.ink3 }}>{wordCount}/{TARGET}</div>
        </div>
        <div style={{ display:'flex', gap:7 }}>
          <button onClick={()=>window.__nav && window.__nav('ai_grading')} style={{ flex:1, padding:'12px', borderRadius:11, background:MT.bg2, color:T.writing.c, fontSize:12.5, fontWeight:700, border:`1px solid ${T.writing.c}33`, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:5 }}>
            {Icon.spark({ width:11, height:11 })} AI feedback
          </button>
          <button onClick={()=>window.__nav && window.__nav('mod_results')} style={{ flex:1.4, padding:'12px', borderRadius:11, background:T.writing.c, color:'#fff', fontSize:12.5, fontWeight:700, display:'inline-flex', alignItems:'center', justifyContent:'center', gap:5, boxShadow:`0 6px 14px ${T.writing.c}55` }}>
            {_w.submit || 'Submit'} {Icon.arrow({ width:11, height:11 })}
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MReadingSession, MListeningSession, MSpeakingSession, MWritingSession });
