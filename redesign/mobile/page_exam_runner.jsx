// ── Mobile · Exam screens · Entry / Runner / Results ──────────────
// MExamEntry, MFullExamRunner, MExamResults + 6 mode wrappers.
// Adapts the web exam vocab (dark hero, module color accents, AI
// feedback) for 390px width. Single-column stacked layouts.

const { useState: useStateMEx } = React;

// ── Entry ──────────────────────────────────────────────────────────
function MExamEntry() {
  const [confirmed, setConfirmed] = useStateMEx(false);
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };
  const nav = (id) => window.__nav && window.__nav(id);

  return (
    <>
      <MobileHeader back onBack={()=>nav('exams')} title="Exam entry"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {/* Editorial preface */}
        <div style={{ padding:'4px 6px 14px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
            <Flag code={lang.code} w={16} h={11} radius={2}/>
            <span style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase' }}>{lang.english} · {ex.short}</span>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{ex.name}</div>
          <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{ex.blurb}</div>
        </div>

        {/* Dark hero with cost */}
        <div style={{ background:T.ink, borderRadius:18, padding:'22px 22px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
            {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
          </div>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:9.5, color:'rgba(255,255,255,.55)', fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:8 }}>OFFICIAL · MAY 2026</div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:14 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginBottom:3 }}>Entry fee</div>
                <div style={{ fontFamily:T.serif, fontSize:36, lineHeight:1, letterSpacing:'-.01em' }}>{ex.cost}</div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,.5)', marginTop:5 }}>One-time · refundable until start</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', marginBottom:3 }}>Duration</div>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1 }}>{ex.duration}</div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,.5)', marginTop:5 }}>{ex.modules.length} modules</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>EXAM DETAILS</div>
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {[
            { l:'Format',         v:ex.name,           ic:'layers' },
            { l:'Awarding body',  v:ex.body,           ic:'users' },
            { l:'Results',        v:'Within 24h · AI scored', ic:'bars' },
            { l:'Leaderboard',    v:'Published monthly', ic:'trophy' },
          ].map((d, i) => (
            <div key={d.l} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[d.ic]({ width:13, height:13 })}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>{d.l}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.v}</div>
              </div>
            </div>
          ))}
        </MCard>

        {/* Modules */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>MODULES IN THIS EXAM</div>
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {ex.modules.map((m, i) => {
            const c = colorMap[m.color] || T.listening;
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:13, height:13 })}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.3 }}>{m.label.replace(/\s*\(.*\)/, '')}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{m.time} · {m.q} {m.q === 1 ? 'task' : 'items'}</div>
                </div>
              </div>
            );
          })}
        </MCard>

        {/* Confirmation checklist */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>BEFORE YOU BEGIN</div>
        <MCard style={{ padding:16, marginBottom:14 }}>
          {[
            `${ex.duration} of uninterrupted time`,
            `Quiet environment with working mic`,
            `Officially scored & published`,
            `Reviewed the ${ex.short} format`,
          ].map((item, i) => (
            <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
              <div style={{ width:18, height:18, borderRadius:9, background: confirmed ? T.brand : T.bg2, color: confirmed ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1, border: confirmed ? 'none' : `1px solid ${T.border}` }}>
                {Icon.check({ width:9, height:9 })}
              </div>
              <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.5 }}>{item}</div>
            </div>
          ))}
          <button onClick={() => setConfirmed(c => !c)} style={{ marginTop:6, width:'100%', padding:'10px 14px', borderRadius:10, border:`1.5px solid ${confirmed ? T.brand : T.border}`, background:confirmed ? T.brandLight : T.card, fontSize:12, fontWeight:700, color:confirmed ? T.brand : T.ink2, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
            {confirmed ? Icon.check({ width:11, height:11 }) : <span style={{ width:11, height:11, borderRadius:2, border:`1.5px solid ${T.ink4}`, display:'inline-block' }}/>}
            {confirmed ? 'All confirmed' : 'I confirm all of the above'}
          </button>
        </MCard>

        <button onClick={() => confirmed && nav('monthly_runner')} disabled={!confirmed} style={{ width:'100%', padding:'14px', borderRadius:13, background:confirmed ? T.brandGrad : T.bg3, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:confirmed ? `0 8px 22px ${T.brand}40` : 'none', display:'flex', alignItems:'center', justifyContent:'center', gap:7, opacity:confirmed ? 1 : .55 }}>
          {confirmed ? `Enter ${ex.short} exam — ${ex.cost}` : 'Confirm checklist to continue'} {Icon.arrow({ width:12, height:12 })}
        </button>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink4, marginTop:10, lineHeight:1.5 }}>Payment processed securely · Refunds not available after exam starts</div>
      </MobileBody>
    </>
  );
}

// ── Runner ─────────────────────────────────────────────────────────
function MFullExamRunner() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const mode = (window.EXAM_MODES && window.EXAM_MODES[window.__examMode]) || (window.EXAM_MODES && window.EXAM_MODES.monthly) || { label:'Official monthly', short:'Monthly', accent:'#B05A38', resultsRoute:'monthly_results', kind:'official' };
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };
  const [section, setSection] = useStateMEx(0);
  const [pane, setPane] = useStateMEx('q'); // 'm' material, 'q' questions
  const [writingTask, setWritingTask] = useStateMEx(1);
  const [answered, setAnswered] = useStateMEx({});
  const sections = ex.modules.map((m, i) => {
    const c = colorMap[m.color] || T.listening;
    return { label:m.label.replace(/\s*\(.*\)/,''), ic:m.ic, color:c.c, bg:c.bg, q:m.q };
  });
  const cur = sections[section];
  const isWriting = cur.color === T.writing.c;
  const isSpeaking = cur.color === T.speaking.c;
  const isListening = cur.color === T.listening.c;
  const isReading = cur.color === T.reading.c;

  const questions = [
    { n:1, type:'T/F/NG', stem:'The passage suggests urban migration began in the 20th century.' },
    { n:2, type:'MCQ',    stem:'According to the text, the primary driver of urbanisation is:', opts:['Economic opportunity','Political stability','Climate change','Cultural attraction'] },
    { n:3, type:'T/F/NG', stem:'The author implies rural communities will disappear by 2050.' },
    { n:4, type:'MCQ',    stem:'"Proliferation" in paragraph 4 is closest in meaning to:', opts:['decline','rapid growth','migration','stagnation'] },
    { n:5, type:'Gap',    stem:'The report identifies _____ as the fastest-growing megacity in 2023.' },
  ];

  const handleSubmit = () => {
    if (section < sections.length - 1) { setSection(section + 1); setAnswered({}); setPane('q'); }
    else window.__nav && window.__nav(mode.resultsRoute);
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.bg }}>
      {/* Top bar */}
      <div style={{ background:T.ink, color:'#fff', padding:'10px 14px 8px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.brandmark({ width:13, height:13, color:'#fff' })}</div>
          <Flag code={lang.code} w={18} h={12} radius={2}/>
          <div style={{ fontSize:12, fontWeight:700, flex:1, minWidth:0, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{ex.name}</div>
          <span style={{ fontSize:9, fontWeight:800, color:'#fff', background:mode.accent, padding:'3px 7px', borderRadius:99, letterSpacing:'.08em' }}>{mode.short.toUpperCase()}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ flex:1, padding:'6px 11px', borderRadius:8, background:'rgba(255,255,255,.10)', border:'1px solid rgba(255,255,255,.14)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:9.5, color:'rgba(255,255,255,.6)', fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase' }}>SECTION TIME</span>
            <span style={{ fontSize:13, fontWeight:700, color:'#fff', fontFamily:'monospace' }}>58:14</span>
          </div>
          <button style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.10)', color:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.more({ width:13, height:13 })}</button>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{ display:'flex', background:'#1A1A1A', flexShrink:0, overflowX:'auto', padding:'0 6px' }}>
        {sections.map((s, i) => (
          <button key={s.label} onClick={() => { setSection(i); setAnswered({}); setPane('q'); }} style={{ padding:'10px 12px', fontSize:11.5, fontWeight:700, color: i === section ? '#fff' : 'rgba(255,255,255,.4)', borderBottom:`2px solid ${i === section ? s.color : 'transparent'}`, background:'transparent', display:'flex', alignItems:'center', gap:5, whiteSpace:'nowrap', flexShrink:0 }}>
            {i < section && <span style={{ width:11, height:11, borderRadius:6, background:T.listening.c, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:6, height:6, color:'#fff' })}</span>}
            {Icon[s.ic]({ width:11, height:11, color: i === section ? s.color : 'rgba(255,255,255,.4)' })}
            {s.label}
          </button>
        ))}
      </div>

      {/* Material/Question switcher (only for sections with 2 panes) */}
      {!isSpeaking && (
        <div style={{ display:'flex', gap:4, padding:'8px 14px 0', flexShrink:0, background:T.bg }}>
          <button onClick={()=>setPane('m')} style={{ flex:1, padding:'7px 10px', borderRadius:8, fontSize:11.5, fontWeight:700, background: pane === 'm' ? cur.bg : T.card, color: pane === 'm' ? cur.color : T.ink3, border:`1px solid ${pane === 'm' ? cur.color + '44' : T.border}` }}>
            {isReading ? 'Passage' : isListening ? 'Audio' : 'Prompt'}
          </button>
          <button onClick={()=>setPane('q')} style={{ flex:1, padding:'7px 10px', borderRadius:8, fontSize:11.5, fontWeight:700, background: pane === 'q' ? cur.bg : T.card, color: pane === 'q' ? cur.color : T.ink3, border:`1px solid ${pane === 'q' ? cur.color + '44' : T.border}` }}>
            {isWriting ? 'Your essay' : `Questions (${Object.keys(answered).length}/${cur.q > 5 ? 5 : cur.q})`}
          </button>
        </div>
      )}

      {/* Body */}
      <div style={{ flex:1, overflow:'auto', padding:'12px 14px 16px' }}>
        {/* MATERIAL pane */}
        {(pane === 'm' || isSpeaking) && (
          <>
            {isReading && <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>Reading Passage 2</div>
                <span style={{ fontSize:9.5, fontWeight:800, color:cur.color, background:cur.bg, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>2 OF 3</span>
              </div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:14, lineHeight:1.75, color:T.ink2, textWrap:'pretty' }}>
                <p style={{ marginBottom:14 }}>Urbanisation — the process by which populations shift from rural to urban areas — is one of the most transformative demographic trends of the modern era. Since the industrial revolution, cities have grown from modest market towns into sprawling megacities housing millions of people.</p>
                <p style={{ marginBottom:14 }}>The drivers of this mass migration are complex. Economic opportunity is the most frequently cited factor — cities offer a density of employers, services, and infrastructure that rural areas simply cannot match. But scholars have argued that the relationship is bidirectional: cities attract investment <em>because</em> they already have people.</p>
                <p>The social consequences of rapid urbanisation are equally complex. Cities have historically been engines of innovation, but the pace of growth often outstrips the capacity of urban infrastructure, leading to the proliferation of informal settlements and widening inequality.</p>
              </div>
            </>}

            {isListening && <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>LISTENING · SECTION 2</div>
                <span style={{ fontSize:9.5, fontWeight:800, color:cur.color, background:cur.bg, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>PLAYS ONCE</span>
              </div>
              <MCard style={{ padding:'22px 18px', display:'flex', flexDirection:'column', alignItems:'center', gap:13 }}>
                <div style={{ width:62, height:62, borderRadius:31, background:cur.bg, color:cur.color, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.head({ width:24, height:24 })}</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:2, width:'100%', height:32 }}>
                  {Array.from({ length:36 }).map((_, i) => (
                    <div key={i} style={{ flex:1, height: i % 3 === 0 ? 24 : i % 2 === 0 ? 16 : 8, borderRadius:1.5, background: i < 11 ? cur.color : T.bg3 }}/>
                  ))}
                </div>
                <div style={{ fontSize:11, color:T.ink4, display:'flex', justifyContent:'space-between', width:'100%' }}><span>00:42</span><span>02:18</span></div>
                <div style={{ fontSize:11.5, color:T.ink3, textAlign:'center', lineHeight:1.5 }}>Two students discussing course selection. Take notes — questions appear after the audio.</div>
              </MCard>
              <div style={{ fontSize:11, color:T.ink4, lineHeight:1.6, marginTop:10, padding:'0 6px' }}>Transcript locked until audio finishes. Headphones recommended.</div>
            </>}

            {isWriting && <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>WRITING</div>
                <span style={{ fontSize:9.5, fontWeight:800, color:cur.color, background:cur.bg, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>{writingTask === 1 ? '20MIN · 150+ W' : '40MIN · 250+ W'}</span>
              </div>
              <div style={{ display:'flex', gap:5, marginBottom:14, padding:3, background:T.bg2, borderRadius:9, border:`1px solid ${T.border}` }}>
                {[1,2].map(t => (
                  <button key={t} onClick={()=>setWritingTask(t)} style={{ flex:1, padding:'7px 10px', borderRadius:6, background: writingTask === t ? T.card : 'transparent', boxShadow: writingTask === t ? '0 1px 3px rgba(0,0,0,.06)' : 'none', fontSize:11.5, fontWeight: writingTask === t ? 700 : 500, color: writingTask === t ? cur.color : T.ink3, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>
                    <span style={{ width:16, height:16, borderRadius:8, background: writingTask === t ? cur.color : T.bg3, color: writingTask === t ? '#fff' : T.ink4, fontSize:9.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{t}</span>
                    Task {t}
                  </button>
                ))}
              </div>
              {writingTask === 1 ? <>
                <div style={{ fontFamily:'Georgia,serif', fontSize:14, lineHeight:1.75, color:T.ink2 }}>
                  <p style={{ marginBottom:12 }}>The chart below shows the percentage of households in different income brackets that own a primary residence in five European countries in 2022.</p>
                  <p style={{ marginBottom:12, fontWeight:600, color:T.ink }}>Summarise the information by selecting and reporting the main features.</p>
                  <p style={{ fontSize:12.5, color:T.ink3, fontStyle:'italic' }}>Write at least 150 words.</p>
                </div>
                <MCard style={{ padding:'14px 14px 12px', marginTop:12 }}>
                  <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>FIG 1 · HOME OWNERSHIP BY INCOME (%)</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:11, height:96, padding:'0 4px' }}>
                    {[
                      { c:'DE', low:32, mid:54, high:78 },
                      { c:'FR', low:38, mid:61, high:82 },
                      { c:'IT', low:48, mid:68, high:85 },
                      { c:'ES', low:52, mid:71, high:84 },
                      { c:'UK', low:28, mid:58, high:74 },
                    ].map(d => (
                      <div key={d.c} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div style={{ display:'flex', alignItems:'flex-end', gap:1.5, height:78, width:'100%', justifyContent:'center' }}>
                          <div style={{ width:7, height:`${d.low}%`, background:cur.color + '55', borderRadius:'2px 2px 0 0' }}/>
                          <div style={{ width:7, height:`${d.mid}%`, background:cur.color + 'aa', borderRadius:'2px 2px 0 0' }}/>
                          <div style={{ width:7, height:`${d.high}%`, background:cur.color, borderRadius:'2px 2px 0 0' }}/>
                        </div>
                        <div style={{ fontSize:9.5, fontWeight:700, color:T.ink3 }}>{d.c}</div>
                      </div>
                    ))}
                  </div>
                </MCard>
              </> : <>
                <div style={{ fontFamily:'Georgia,serif', fontSize:14, lineHeight:1.75, color:T.ink2 }}>
                  <p style={{ marginBottom:12 }}>Some people believe universities should focus on academic knowledge, while others argue they should prepare students for careers.</p>
                  <p style={{ marginBottom:12, fontWeight:600, color:T.ink }}>Discuss both views and give your own opinion.</p>
                  <p style={{ fontSize:12.5, color:T.ink3, fontStyle:'italic' }}>At least 250 words. Reasons & examples.</p>
                </div>
              </>}
            </>}

            {isSpeaking && <>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>SPEAKING · PART 2 · LONG TURN</div>
                <span style={{ fontSize:9.5, fontWeight:800, color:cur.color, background:cur.bg, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>1MIN · 2MIN</span>
              </div>
              <MCard style={{ padding:'18px 18px', marginBottom:14 }}>
                <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>CUE CARD</div>
                <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.3, marginBottom:12, letterSpacing:'-.005em' }}>Describe a place you have visited that left a strong impression on you.</div>
                <div style={{ fontSize:12.5, color:T.ink2, lineHeight:1.65 }}>You should say:
                  <ul style={{ margin:'6px 0 0 16px', padding:0 }}>
                    <li>where this place is</li>
                    <li>when and why you visited</li>
                    <li>what you did there</li>
                    <li>and why it left such an impression.</li>
                  </ul>
                </div>
              </MCard>
              <div style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:13, marginBottom:14, boxShadow:MT.shadowSm }}>
                <button style={{ width:42, height:42, borderRadius:21, background:cur.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 16px ${cur.color}55`, flexShrink:0 }}>{Icon.mic({ width:15, height:15 })}</button>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>Tap to record</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>0:00 / 2:00</div>
                </div>
              </div>
              <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:8, padding:'0 4px' }}>EXAMINER FOLLOW-UPS</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {['What kind of places do you usually visit on holiday?','How has tourism changed in your country?','Will people travel more in the future?'].map((q, i) => (
                  <div key={i} style={{ padding:'11px 13px', borderRadius:11, border:`1px solid ${T.border}`, background: i === 0 ? cur.bg : T.card }}>
                    <div style={{ fontSize:9, color:cur.color, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>FOLLOW-UP {i+1}</div>
                    <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.45 }}>{q}</div>
                  </div>
                ))}
              </div>
            </>}
          </>
        )}

        {/* QUESTION pane */}
        {(pane === 'q' && !isSpeaking) && (
          <>
            {isWriting ? (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>YOUR ESSAY</div>
                  <span style={{ fontSize:9.5, fontWeight:800, color:cur.color, background:cur.bg, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>{Object.keys(answered).length > 0 ? '247 WORDS' : '0 WORDS'}</span>
                </div>
                <textarea placeholder="Begin your essay…" onChange={() => setAnswered({1:'filled'})} style={{ width:'100%', minHeight:280, padding:'12px 14px', borderRadius:11, border:`1.5px solid ${T.border}`, fontSize:13.5, color:T.ink, fontFamily:"'Inter',sans-serif", lineHeight:1.65, outline:'none', resize:'vertical', background:T.card, boxShadow:MT.shadowSm }}/>
              </>
            ) : (
              <>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{ fontSize:9.5, color:T.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>QUESTIONS {isListening ? '11–15' : '14–18'}</div>
                  <span style={{ fontSize:9.5, fontWeight:800, color:cur.color, background:cur.bg, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>{Object.keys(answered).length}/5 DONE</span>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {questions.map(q => (
                    <div key={q.n} style={{ padding:13, borderRadius:12, border:`1px solid ${answered[q.n] ? cur.color + '44' : T.border}`, background: answered[q.n] ? cur.bg : T.card, transition:'all .2s' }}>
                      <div style={{ display:'flex', gap:8, marginBottom:9 }}>
                        <div style={{ width:20, height:20, borderRadius:10, background: answered[q.n] ? cur.color : T.bg3, color: answered[q.n] ? '#fff' : T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9.5, fontWeight:700, flexShrink:0, marginTop:1 }}>{q.n + (isListening ? 10 : 13)}</div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:9, color:cur.color, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{q.type}</div>
                          <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.45 }}>{q.stem}</div>
                        </div>
                      </div>
                      {q.opts ? (
                        <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                          {q.opts.map(opt => (
                            <button key={opt} onClick={() => setAnswered(a => ({...a, [q.n]:opt}))} style={{ padding:'8px 11px', borderRadius:8, border:`1.5px solid ${answered[q.n] === opt ? cur.color : T.border}`, background: answered[q.n] === opt ? cur.bg : 'transparent', fontSize:12, fontWeight: answered[q.n] === opt ? 700 : 400, color: answered[q.n] === opt ? cur.color : T.ink, textAlign:'left' }}>{opt}</button>
                          ))}
                        </div>
                      ) : q.type === 'Gap' ? (
                        <input placeholder="Your answer…" onChange={() => setAnswered(a=>({...a, [q.n]:'filled'}))} style={{ padding:'8px 11px', borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:12.5, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none', width:'100%', background:T.card }}/>
                      ) : (
                        <div style={{ display:'flex', gap:5 }}>
                          {['True','False','Not Given'].map(opt => (
                            <button key={opt} onClick={() => setAnswered(a=>({...a, [q.n]:opt}))} style={{ flex:1, padding:'8px 8px', borderRadius:8, border:`1.5px solid ${answered[q.n] === opt ? cur.color : T.border}`, background: answered[q.n] === opt ? cur.bg : 'transparent', fontSize:11, fontWeight: answered[q.n] === opt ? 700 : 400, color: answered[q.n] === opt ? cur.color : T.ink }}>{opt}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Bottom actions */}
      <div style={{ padding:'10px 14px 14px', borderTop:`1px solid ${T.hairline}`, background:T.card, display:'flex', gap:8, flexShrink:0 }}>
        <button style={{ padding:'11px 14px', borderRadius:11, background:T.bg2, color:T.ink2, fontSize:11.5, fontWeight:700, display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>{Icon.bookmark({ width:11, height:11 })} Flag</button>
        <button onClick={handleSubmit} style={{ flex:1, padding:'12px', borderRadius:11, background:cur.color, color:'#fff', fontSize:12.5, fontWeight:700, boxShadow:`0 6px 16px ${cur.color}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          {section < sections.length - 1 ? 'Next section' : 'Submit exam'} {Icon.arrow({ width:11, height:11 })}
        </button>
      </div>
    </div>
  );
}

// ── Results ────────────────────────────────────────────────────────
function MExamResults() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const mode = (window.EXAM_MODES && window.EXAM_MODES[window.__examMode]) || (window.EXAM_MODES && window.EXAM_MODES.monthly) || { label:'Official', short:'Monthly', accent:'#B05A38', kind:'official' };
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };
  const nav = (id) => window.__nav && window.__nav(id);

  const modules = ex.modules.map((m, i) => {
    const c = colorMap[m.color] || T.listening;
    const score = ex.scoreUnit === '/9' ? [8.0, 7.5, 6.5, 7.0][i] || 7.0
                : ex.scoreUnit === '/180' ? [42, 38, 42, 0][i] || 36
                : [78, 74, 70, 76][i] || 70;
    const change = [+0.5, +0.5, -0.5, +0.0][i] || +0.0;
    return { ic:m.ic, c, label:m.label.replace(/\s*\(.*\)/,''), score, change, q:m.q };
  });

  const overall = ex.bestScore;
  const overallPct = ex.scoreUnit === '/9' ? (overall / 9) * 100
                   : ex.scoreUnit === '/180' ? (overall / 180) * 100
                   : overall;
  const passNote = ex.scoreUnit === '/9' ? 'Band 7.5 is strong for university admission at most UK institutions.'
                 : ex.scoreUnit === '/180' ? 'Above the JLPT N4 pass threshold. To reach N3, focus on grammar.'
                 : ex.scoreUnit === '/100' && lang.code === 'es' ? 'Apto en B2. Para C1, refuerza la expresión escrita.'
                 : 'Réussite au DELF B1. Pour le B2, travaillez l\'argumentation.';
  const greetingName = lang.code === 'es' ? 'Felicidades, María.' : lang.code === 'fr' ? 'Félicitations, María.' : lang.code === 'ja' ? 'おめでとう、María。' : 'Congratulations, María.';

  return (
    <>
      <MobileHeader back onBack={()=>nav('exams')} title="Result"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ padding:'4px 6px 14px' }}>
          <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{ex.name} · {mode.kind === 'official' ? 'MAY 2026 · OFFICIAL' : mode.kind === 'practice' ? 'MOCK · NOT ON RECORD' : 'PRACTICE · SAVED'}</div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{greetingName}</div>
          <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>You've improved your overall {ex.scoreLabel.toLowerCase()} since your last exam. Your {modules[0].label} was your strongest section.</div>
        </div>

        {/* Dark hero */}
        <div style={{ background:T.ink, borderRadius:18, padding:'22px 20px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
            {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
          </div>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:18 }}>
            <div style={{ flexShrink:0 }}>
              {window.Ring ? (
                <Ring pct={overallPct} size={104} stroke={9} color={T.brand} trackColor="rgba(255,255,255,.12)">
                  <div style={{ fontFamily:T.serif, fontSize:32, color:'#fff', lineHeight:1, letterSpacing:'-.01em' }}>{overall}{ex.scoreUnit && ex.scoreUnit.startsWith('/') ? <span style={{ fontSize:13, opacity:.5 }}>{ex.scoreUnit}</span> : ''}</div>
                </Ring>
              ) : (
                <div style={{ width:104, height:104, borderRadius:52, background:T.brand, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:32, color:'#fff' }}>{overall}</div>
              )}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,.55)', letterSpacing:'.16em', textTransform:'uppercase', marginBottom:4 }}>{ex.scoreLabel}</div>
              <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.05, marginBottom:6 }}>You scored {overall}</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', background:mode.accent, padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>{mode.short.toUpperCase()}</span>
                {mode.kind === 'official' && <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(255,255,255,.15)', padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>RANK #12</span>}
                {mode.kind === 'official' && <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(255,255,255,.15)', padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>TOP 2%</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>BY MODULE</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          {modules.map(m => {
            const pct = ex.scoreUnit === '/9' ? (m.score / 9) * 100
                      : ex.scoreUnit === '/180' ? (m.score / 45) * 100
                      : m.score;
            return (
              <MCard key={m.label} style={{ padding:'13px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:10 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:13, height:13 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{m.label}</div>
                    <div style={{ fontSize:10.5, color: m.change >= 0 ? '#1A8F4E' : T.brand, fontWeight:800, marginTop:1 }}>{m.change >= 0 ? '+' : ''}{ex.scoreUnit === '/9' ? m.change.toFixed(1) : Math.round(m.change)}</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:24, color:m.c.c, lineHeight:1, letterSpacing:'-.01em' }}>{ex.scoreUnit === '/9' ? m.score.toFixed(1) : m.score}</div>
                </div>
                <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
                  <div style={{ width:`${pct}%`, height:'100%', background:`linear-gradient(90deg, ${m.c.c}, ${m.c.c}cc)`, borderRadius:99 }}/>
                </div>
              </MCard>
            );
          })}
        </div>

        {/* AI feedback */}
        <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>AI EXAMINER FEEDBACK</div>
        <MCard style={{ padding:16, marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({ width:13, height:13 })}</div>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>Read like an examiner</div>
          </div>
          {[
            { l:'Listening', t:'Excellent. Identified all 4 speakers in Section 3 and completed the form-fill in Section 1 with 100% accuracy. Minor slips in academic vocabulary — review "demographic," "hypothesis," "proliferation."' },
            { l:'Writing',   t:'Task 2 well-structured with a clear thesis. Cohesion would benefit from more varied linkers (you used "however" 4 times). Task 1 over-described minor data — focus on overall trend.' },
          ].map((fb, i, arr) => (
            <div key={fb.l} style={{ paddingBottom: i < arr.length - 1 ? 12 : 0, marginBottom: i < arr.length - 1 ? 12 : 0, borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ fontSize:10.5, fontWeight:800, color:T.ink2, letterSpacing:'.06em', marginBottom:5 }}>{fb.l}</div>
              <div style={{ fontSize:12.5, color:T.ink2, lineHeight:1.55 }}>{fb.t}</div>
            </div>
          ))}
        </MCard>

        {/* Closing italic note */}
        <div style={{ padding:'14px 16px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:12, marginBottom:14 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13.5, color:T.ink, lineHeight:1.5 }}>"{passNote} To reach {ex.nextLevel}, focus on weaker modules and review the official {ex.short} descriptors."</div>
        </div>

        {/* Actions */}
        {mode.kind === 'official' ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={()=>nav('exam_entry')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 8px 22px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>Start next exam prep {Icon.arrow({ width:12, height:12 })}</button>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>nav('exams')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>{Icon.trophy({ width:11, height:11 })} Leaderboard</button>
              <button onClick={()=>nav('dashboard')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:5 }}>{Icon.download ? Icon.download({ width:11, height:11 }) : '⤓'} Certificate</button>
            </div>
          </div>
        ) : mode.kind === 'practice' ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={()=>nav('exam_entry')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 8px 22px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>Try the official {ex.short} {Icon.arrow({ width:12, height:12 })}</button>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>nav('mock_test')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${mode.accent}55`, color:mode.accent, fontSize:12, fontWeight:700 }}>Another mock</button>
              <button onClick={()=>nav('dashboard')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:12, fontWeight:700 }}>Dashboard</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <button onClick={()=>nav('practice_runner')} style={{ width:'100%', padding:'14px', borderRadius:13, background:mode.accent, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 8px 22px ${mode.accent}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>Drill again {Icon.arrow({ width:12, height:12 })}</button>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>nav('lang')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:12, fontWeight:700 }}>More practice</button>
              <button onClick={()=>nav('dashboard')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, color:T.ink, fontSize:12, fontWeight:700 }}>Dashboard</button>
            </div>
          </div>
        )}
      </MobileBody>
    </>
  );
}

// ── Mode wrappers ──────────────────────────────────────────────────
function MMonthlyExamRunner()  { window.__examMode = 'monthly';  return <MFullExamRunner/>; }
function MMockExamRunner()     { window.__examMode = 'mock';     return <MFullExamRunner/>; }
function MPracticeExamRunner() { window.__examMode = 'practice'; return <MFullExamRunner/>; }
function MMonthlyExamResults() { window.__examMode = 'monthly';  return <MExamResults/>; }
function MMockExamResults()    { window.__examMode = 'mock';     return <MExamResults/>; }
function MPracticeExamResults(){ window.__examMode = 'practice'; return <MExamResults/>; }

Object.assign(window, {
  MExamEntry, MFullExamRunner, MExamResults,
  MMonthlyExamRunner, MMockExamRunner, MPracticeExamRunner,
  MMonthlyExamResults, MMockExamResults, MPracticeExamResults,
});
