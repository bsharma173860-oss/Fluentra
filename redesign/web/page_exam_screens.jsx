// ── Exam Screens: Entry · Full Exam Runner · Results ────────

// ═══════════════════════════════════════════════════════════
// EXAM ENTRY — register + confirm before starting
// ═══════════════════════════════════════════════════════════
function ExamEntry() {
  const [confirmed, setConfirmed] = useState(false);
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const t = langTheme(lang.code);
  const ex = examFor(lang.code);
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'40px 36px' }}>
        <div style={{ maxWidth:720, margin:'0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ fontSize:11.5, color:T.ink4, marginBottom:20, display:'flex', gap:6, alignItems:'center' }}>
            <span>Languages</span><span style={{ opacity:.4 }}>/</span><span>{lang.english}</span><span style={{ opacity:.4 }}>/</span><span style={{ color:T.ink, fontWeight:600 }}>{ex.short} Exam Entry</span>
          </div>

          {/* Hero */}
          <div style={{ background:T.ink, borderRadius:22, padding:'36px 40px', color:'#fff', marginBottom:28, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:14, opacity:.05, pointerEvents:'none' }}>
              {Array.from({length:200}).map((_,i)=><div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
            </div>
            <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr auto', gap:24, alignItems:'center' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                  <Flag code={lang.code} w={28} h={19} radius={3}/>
                  <Chip label={`Monthly · ${lang.english}`} accent="rgba(255,255,255,.8)" bg="rgba(255,255,255,.12)"/>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:44, lineHeight:1.05, marginBottom:10 }}>{ex.name}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.6 }}>{ex.blurb}</div>
                <div style={{ fontSize:11.5, color:'rgba(255,255,255,.5)', marginTop:12 }}>{ex.body}</div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, alignItems:'center', flexShrink:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1 }}>{ex.cost}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', textAlign:'center' }}>Entry fee<br/>One-time</div>
              </div>
            </div>
          </div>

          {/* Exam details */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
            {[
              { label:'Format', value:ex.name, ic:'layers' },
              { label:'Duration', value:ex.duration, ic:'clock' },
              { label:'Modules', value:ex.modules.map(m=>m.label.replace(/\s*\(.*\)/,'')).join(' · '), ic:'check' },
              { label:'Results', value:'Within 24 hours · AI scored', ic:'bars' },
              { label:'Leaderboard', value:`${lang.english} ranking · published monthly`, ic:'trophy' },
              { label:'Awarding body', value:ex.body, ic:'users' },
            ].map(d => (
              <div key={d.label} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {Icon[d.ic]({ width:15, height:15 })}
                </div>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:2 }}>{d.label}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis' }}>{d.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Modules breakdown */}
          <Card padding={20} style={{ marginBottom:24 }}>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>Modules in this exam</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {ex.modules.map((m,i) => {
                const c = colorMap[m.color] || T.listening;
                return (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background:T.bg2 }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:14, height:14 })}</div>
                    <div style={{ flex:1, fontSize:13, fontWeight:600, color:T.ink }}>{m.label}</div>
                    <div style={{ fontSize:11.5, color:T.ink4 }}>{m.time}</div>
                    <div style={{ fontSize:11.5, color:T.ink4, width:50, textAlign:'right' }}>{m.q} {m.q===1?'task':'items'}</div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Confirmation checklist */}
          <Card padding={24} style={{ marginBottom:24 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:16 }}>Before you begin</div>
            {[
              `I have ${ex.duration} of uninterrupted time`,
              'I\'m in a quiet environment with a working microphone',
              'I understand that this exam is officially scored and published',
              `I\'ve reviewed the ${ex.short} format and band descriptors`,
            ].map((item, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:12 }}>
                <div style={{ width:20, height:20, borderRadius:10, background: confirmed ? T.listening.c : T.bg3, color: confirmed ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  {Icon.check({ width:10, height:10 })}
                </div>
                <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5 }}>{item}</div>
              </div>
            ))}
            <button onClick={() => setConfirmed(c => !c)} style={{ marginTop:8, padding:'9px 18px', borderRadius:10, border:`1.5px solid ${confirmed ? T.listening.c : T.border}`, background:confirmed ? T.listening.bg : T.card, fontSize:12.5, fontWeight:700, color:confirmed ? T.listening.c : T.ink2, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
              {confirmed ? Icon.check({ width:13, height:13 }) : <span style={{ width:13, height:13, borderRadius:2, border:`1.5px solid ${T.ink4}`, display:'inline-block' }}/>}
              {confirmed ? 'All confirmed' : 'I confirm all of the above'}
            </button>
          </Card>

          <Btn label={confirmed ? `Enter ${ex.short} exam — ${ex.cost}` : 'Confirm checklist to continue'} nav={confirmed ? 'monthly_runner' : null} fullWidth accent={confirmed ? T.brand : T.ink4} size="lg" iconRight={Icon.arrow({ width:14, height:14 })} style={{ opacity: confirmed ? 1 : .55 }}/>
          <div style={{ textAlign:'center', fontSize:12, color:T.ink4, marginTop:12 }}>Payment processed securely · Refunds not available after exam starts</div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXAM MODE — three modes share the runner/results UI but
// differ in copy, color, and where they post (backend-readable
// via window.__examMode)
// ═══════════════════════════════════════════════════════════
const EXAM_MODES = {
  monthly:  { label:'Official monthly exam', short:'Monthly · Official', accent:'#B05A38', subtitle:'Graded · counts toward leaderboard', resultsRoute:'monthly_results', kind:'official' },
  mock:     { label:'Mock exam',             short:'Mock · Practice',    accent:'#C58A2E', subtitle:'Free practice · not on record',     resultsRoute:'mock_results',    kind:'practice' },
  practice: { label:'Skill practice',        short:'Practice · Drill',   accent:'#1F8A5B', subtitle:'Single-skill drill · save to log',  resultsRoute:'practice_results',kind:'drill' },
};
function getExamMode() {
  return EXAM_MODES[window.__examMode] || EXAM_MODES.monthly;
}

// ═══════════════════════════════════════════════════════════
// FULL EXAM RUNNER — in-progress exam with section nav
// ═══════════════════════════════════════════════════════════
function FullExamRunner() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const mode = getExamMode();
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };
  const [section, setSection] = useState(0);
  const [writingTask, setWritingTask] = useState(1);
  // Build sections from per-language exam config
  const sections = ex.modules.map((m, i) => {
    const c = colorMap[m.color] || T.listening;
    return {
      label: m.label.replace(/\s*\(.*\)/, ''),
      ic: m.ic, color: c.c, bg: c.bg,
      time: 3600, q: m.q,
      done: i === 0, active: i === 1,
    };
  });
  const cur = sections[section];
  const [answered, setAnswered] = useState({});
  const questions = [
    { n:1, type:'T/F/NG', stem:'The passage suggests that urban migration began in the 20th century.' },
    { n:2, type:'MCQ',    stem:'According to the text, the primary driver of urbanisation is:', opts:['Economic opportunity','Political stability','Climate change','Cultural attraction'] },
    { n:3, type:'T/F/NG', stem:'The author implies that rural communities will disappear by 2050.' },
    { n:4, type:'MCQ',    stem:'The word "proliferation" in paragraph 4 is closest in meaning to:', opts:['decline','rapid growth','migration','stagnation'] },
    { n:5, type:'Gap',    stem:'The report identifies ________ as the fastest-growing megacity in 2023.' },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.bg }}>
      {/* Exam topbar */}
      <div style={{ height:64, background:T.ink, color:'#fff', display:'flex', alignItems:'center', padding:'0 28px', gap:16, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:26, height:26, borderRadius:7, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.brandmark({ width:16, height:16, color:'#fff' })}</div>
          <div style={{ fontFamily:T.serif, fontSize:18, color:'#fff' }}>Fluentra</div>
        </div>
        <div style={{ width:1, height:24, background:'rgba(255,255,255,.15)' }}/>
        <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,.9)', display:'flex', alignItems:'center', gap:8 }}>
          <Flag code={lang.code} w={20} h={14} radius={2}/>
          {ex.name} — {mode.kind === 'official' ? 'May 2026' : mode.kind === 'practice' ? 'Mock attempt' : 'Practice drill'}
        </div>
        <Chip label={mode.short} accent="#fff" bg={mode.accent} style={{ fontSize:10 }}/>
        <div style={{ flex:1 }}/>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:10, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)' }}>
          <span style={{ fontSize:11, color:'rgba(255,255,255,.6)', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>Section time</span>
          <span style={{ fontSize:14, fontWeight:700, color:'#fff', fontFamily:'monospace' }}>58:14</span>
        </div>
        <button style={{ width:36, height:36, borderRadius:9, background:'rgba(255,255,255,.1)', color:'rgba(255,255,255,.7)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {Icon.more()}
        </button>
      </div>

      {/* Section tabs */}
      <div style={{ display:'flex', background:'#1A1A1A', padding:'0 28px', gap:2, flexShrink:0 }}>
        {sections.map((s, i) => (
          <button key={s.label} onClick={() => setSection(i)} style={{ padding:'12px 20px', fontSize:12.5, fontWeight:600, color:i===section?'#fff':'rgba(255,255,255,.4)', borderBottom:`2px solid ${i===section?s.color:'transparent'}`, background:'transparent', display:'flex', alignItems:'center', gap:7, marginBottom:-1 }}>
            {i < section && <span style={{ width:14, height:14, borderRadius:7, background:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check({ width:8, height:8, color:'#fff' })}</span>}
            {Icon[s.ic]({ width:13, height:13, color:i===section?s.color:'rgba(255,255,255,.4)' })}
            {s.label}
          </button>
        ))}
      </div>

      {/* Content — section-aware */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden' }}>
        <div style={{ overflow:'auto', padding:'24px 28px', borderRight:`1px solid ${T.border}`, background:T.bg }}>
          {cur.color === T.reading.c && <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Reading Passage 2</div>
              <Chip label="Passage 2 of 3" accent={T.ink3} bg={T.bg3} style={{ fontSize:10 }}/>
            </div>
            <div style={{ fontFamily:"Georgia,serif", fontSize:14.5, lineHeight:1.85, color:T.ink2, textWrap:'pretty' }}>
              <p style={{ marginBottom:18 }}>Urbanisation — the process by which populations shift from rural to urban areas — is one of the most transformative demographic trends of the modern era. Since the industrial revolution, cities have grown from modest market towns into sprawling megacities housing millions of people. By 2007, for the first time in human history, more people lived in cities than in rural areas, a milestone that demographers had predicted but few truly grasped the implications of.</p>
              <p style={{ marginBottom:18 }}>The drivers of this mass migration are complex. Economic opportunity is the most frequently cited factor — cities offer a density of employers, services, and infrastructure that rural areas simply cannot match. But scholars have increasingly argued that the relationship is bidirectional: cities attract investment <em>because</em> they already have people, creating a self-reinforcing cycle of growth that, once established, is difficult to reverse.</p>
              <p>The social consequences of rapid urbanisation are equally complex. On one hand, cities have historically been engines of innovation, cultural exchange, and social mobility. On the other hand, the pace of growth often outstrips the capacity of urban infrastructure, leading to the proliferation of informal settlements, strained public services, and widening inequality.</p>
            </div>
          </>}
          {cur.color === T.listening.c && <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Listening · Section 2</div>
              <Chip label="Audio plays once" accent={cur.color} bg={cur.bg} style={{ fontSize:10 }}/>
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'28px 22px', marginBottom:18, display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
              <div style={{ width:74, height:74, borderRadius:37, background:cur.bg, color:cur.color, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.head({ width:28, height:28 })}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, width:'100%' }}>
                {Array.from({length:48}).map((_,i)=> <div key={i} style={{ flex:1, height:i%3===0?22:i%2===0?16:8, borderRadius:2, background: i<14?cur.color:T.bg3 }}/>)}
              </div>
              <div style={{ fontSize:12, color:T.ink4, display:'flex', justifyContent:'space-between', width:'100%' }}><span>00:42</span><span>02:18</span></div>
              <div style={{ fontSize:12.5, color:T.ink3, textAlign:'center' }}>Two students discussing course selection. Take notes — questions appear after the audio.</div>
            </div>
            <div style={{ fontSize:12, color:T.ink4, lineHeight:1.6 }}>Transcript locked until audio finishes. Headphones recommended.</div>
          </>}
          {cur.color === T.writing.c && <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Writing</div>
              <Chip label={writingTask===1?'20 min · 150+ words':'40 min · 250+ words'} accent={cur.color} bg={cur.bg} style={{ fontSize:10 }}/>
            </div>
            {/* Task switcher */}
            <div style={{ display:'flex', gap:6, marginBottom:18, padding:4, background:T.bg2, borderRadius:10, border:`1px solid ${T.border}` }}>
              {[1,2].map(t => (
                <button key={t} onClick={()=>setWritingTask(t)} style={{ flex:1, padding:'8px 10px', borderRadius:7, border:'none', background:writingTask===t?T.card:'transparent', boxShadow:writingTask===t?'0 1px 3px rgba(0,0,0,.06)':'none', fontSize:12, fontWeight:writingTask===t?700:500, color:writingTask===t?cur.color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                  <span style={{ width:18, height:18, borderRadius:9, background:writingTask===t?cur.color:T.bg3, color:writingTask===t?'#fff':T.ink4, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{t}</span>
                  Task {t} {t===1?'· Report':'· Essay'}
                </button>
              ))}
            </div>
            {writingTask === 1 ? <>
              <div style={{ fontFamily:"Georgia,serif", fontSize:14.5, lineHeight:1.85, color:T.ink2, textWrap:'pretty' }}>
                <p style={{ marginBottom:14 }}>The chart below shows the percentage of households in different income brackets that own a primary residence in five European countries in 2022.</p>
                <p style={{ marginBottom:14, fontWeight:600, color:T.ink }}>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</p>
                <p style={{ fontSize:13, color:T.ink3, fontStyle:'italic' }}>Write at least 150 words.</p>
              </div>
              {/* Chart placeholder */}
              <div style={{ marginTop:16, padding:'18px 18px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>Figure 1 · Home ownership by income bracket (%)</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:140, padding:'0 4px' }}>
                  {[
                    { c:'DE', low:32, mid:54, high:78 },
                    { c:'FR', low:38, mid:61, high:82 },
                    { c:'IT', low:48, mid:68, high:85 },
                    { c:'ES', low:52, mid:71, high:84 },
                    { c:'UK', low:28, mid:58, high:74 },
                  ].map(d => (
                    <div key={d.c} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <div style={{ display:'flex', alignItems:'flex-end', gap:2, height:120, width:'100%', justifyContent:'center' }}>
                        <div style={{ width:10, height:`${d.low}%`, background:cur.color+'55', borderRadius:'2px 2px 0 0' }}/>
                        <div style={{ width:10, height:`${d.mid}%`, background:cur.color+'aa', borderRadius:'2px 2px 0 0' }}/>
                        <div style={{ width:10, height:`${d.high}%`, background:cur.color, borderRadius:'2px 2px 0 0' }}/>
                      </div>
                      <div style={{ fontSize:10, fontWeight:700, color:T.ink3 }}>{d.c}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display:'flex', gap:14, marginTop:10, justifyContent:'center', fontSize:10.5, color:T.ink4 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, background:cur.color+'55', borderRadius:2 }}/>Low</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, background:cur.color+'aa', borderRadius:2 }}/>Middle</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:10, height:10, background:cur.color, borderRadius:2 }}/>High</span>
                </div>
              </div>
              <div style={{ marginTop:16, padding:'12px 14px', background:T.bg2, borderRadius:10, fontSize:12, color:T.ink3, lineHeight:1.55 }}>
                <b style={{ color:T.ink }}>Tip:</b> Spend ~20 minutes. Cover overview + 2-3 key comparisons. Don't list every value.
              </div>
            </> : <>
              <div style={{ fontFamily:"Georgia,serif", fontSize:14.5, lineHeight:1.85, color:T.ink2, textWrap:'pretty' }}>
                <p style={{ marginBottom:14 }}>Some people believe that universities should focus on providing academic knowledge, while others argue they should prepare students for their future careers.</p>
                <p style={{ marginBottom:14, fontWeight:600, color:T.ink }}>Discuss both views and give your own opinion.</p>
                <p style={{ fontSize:13, color:T.ink3, fontStyle:'italic' }}>Write at least 250 words. Give reasons and relevant examples.</p>
              </div>
              <div style={{ marginTop:18, padding:'12px 14px', background:T.bg2, borderRadius:10, fontSize:12, color:T.ink3, lineHeight:1.55 }}>
                <b style={{ color:T.ink }}>Tip:</b> Plan for 5 minutes, write for 30, review for 5. Aim for 4 paragraphs.
              </div>
            </>}
          </>}
          {cur.color === T.speaking.c && <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Speaking · Part 2 — Long turn</div>
              <Chip label="1 min prep · 2 min speak" accent={cur.color} bg={cur.bg} style={{ fontSize:10 }}/>
            </div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'22px 22px' }}>
              <div style={{ fontSize:12, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>Cue card</div>
              <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1.3, marginBottom:14 }}>Describe a place you have visited that left a strong impression on you.</div>
              <div style={{ fontSize:13, color:T.ink2, lineHeight:1.7 }}>You should say:
                <ul style={{ margin:'8px 0 0 18px', paddingLeft:0 }}>
                  <li>where this place is</li>
                  <li>when and why you visited</li>
                  <li>what you did there</li>
                  <li>and explain why it left such a strong impression on you.</li>
                </ul>
              </div>
            </div>
            <div style={{ marginTop:14, display:'flex', alignItems:'center', gap:10 }}>
              <button style={{ width:48, height:48, borderRadius:24, background:cur.color, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer', boxShadow:`0 6px 18px ${cur.color}55` }}>{Icon.mic({ width:18, height:18 })}</button>
              <div style={{ fontSize:12.5, color:T.ink3 }}>Tap to record · 0:00 / 2:00</div>
            </div>
          </>}
        </div>
        <div style={{ overflow:'auto', padding:'24px 28px', background:T.card }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>{cur.color===T.writing.c?'Your essay':cur.color===T.speaking.c?'Examiner follow-ups':`Questions ${cur.color===T.listening.c?'11–15':'14–18'}`}</div>
            <Chip label={cur.color===T.writing.c?`${Object.keys(answered).length>0?'250':'0'} words`:cur.color===T.speaking.c?'3 follow-ups':`${Object.keys(answered).length}/5 done`} accent={cur.color} bg={cur.bg} style={{ fontSize:10 }}/>
          </div>
          {cur.color === T.writing.c ? (
            <textarea placeholder="Begin your essay…" onChange={() => setAnswered({1:'filled'})} style={{ width:'100%', minHeight:380, padding:'14px 16px', borderRadius:12, border:`1.5px solid ${T.border}`, fontSize:14, color:T.ink, fontFamily:"'Inter',sans-serif", lineHeight:1.7, outline:'none', resize:'vertical' }}/>
          ) : cur.color === T.speaking.c ? (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {['What kind of places do you usually visit on holiday?', 'How has tourism changed in your country?', 'Do you think people will travel more or less in the future?'].map((q,i) => (
                <div key={i} style={{ padding:14, borderRadius:12, border:`1px solid ${T.border}`, background: i===0?cur.bg:T.bg }}>
                  <div style={{ fontSize:10, color:cur.color, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:4 }}>Follow-up {i+1}</div>
                  <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5 }}>{q}</div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {questions.map(q => (
                <div key={q.n} style={{ padding:16, borderRadius:13, border:`1px solid ${answered[q.n]?cur.color+'44':T.border}`, background:answered[q.n]?cur.bg:T.bg, transition:'all .2s' }}>
                  <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                    <div style={{ width:22, height:22, borderRadius:11, background:answered[q.n]?cur.color:T.bg3, color:answered[q.n]?'#fff':T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>{q.n+(cur.color===T.listening.c?10:13)}</div>
                    <div>
                      <div style={{ fontSize:10, color:cur.color, fontWeight:700, letterSpacing:'.07em', textTransform:'uppercase', marginBottom:3 }}>{q.type}</div>
                      <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{q.stem}</div>
                    </div>
                  </div>
                  {q.opts ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:5, paddingLeft:30 }}>
                      {q.opts.map(opt => (
                        <button key={opt} onClick={() => setAnswered(a => ({...a,[q.n]:opt}))} style={{ padding:'7px 12px', borderRadius:8, border:`1.5px solid ${answered[q.n]===opt?cur.color:T.border}`, background:answered[q.n]===opt?cur.bg:'transparent', fontSize:12.5, fontWeight:answered[q.n]===opt?700:400, color:answered[q.n]===opt?cur.color:T.ink, textAlign:'left', cursor:'pointer', transition:'all .15s' }}>{opt}</button>
                      ))}
                    </div>
                  ) : q.type==='Gap' ? (
                    <div style={{ paddingLeft:30 }}>
                      <input placeholder="Your answer…" onChange={() => setAnswered(a=>({...a,[q.n]:'filled'}))} style={{ padding:'8px 12px', borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none', width:'100%' }}/>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap:6, paddingLeft:30 }}>
                      {['True','False','Not Given'].map(opt=>(
                        <button key={opt} onClick={() => setAnswered(a=>({...a,[q.n]:opt}))} style={{ padding:'7px 12px', borderRadius:8, border:`1.5px solid ${answered[q.n]===opt?cur.color:T.border}`, background:answered[q.n]===opt?cur.bg:'transparent', fontSize:12, fontWeight:answered[q.n]===opt?700:400, color:answered[q.n]===opt?cur.color:T.ink, cursor:'pointer', transition:'all .15s' }}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div style={{ marginTop:20, display:'flex', gap:10 }}>
            <Btn label="Flag for review" variant="outline" accent={T.ink3} size="sm" icon={Icon.bookmark({ width:12, height:12 })} style={{ flex:1 }}/>
            <Btn label={section < sections.length - 1 ? 'Next section →' : 'Submit exam →'} accent={cur.color} size="sm" style={{ flex:2 }} onClick={() => { if (section < sections.length - 1) { setSection(section+1); setAnswered({}); } else window.__nav && window.__nav(mode.resultsRoute); }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXAM RESULTS
// ═══════════════════════════════════════════════════════════
function ExamResults() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const t = langTheme(lang.code);
  const mode = getExamMode();
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };

  // Per-language module results (synthesized from the exam config + theme colors)
  const modules = ex.modules.map((m, i) => {
    const c = colorMap[m.color] || T.listening;
    const score = ex.scoreUnit === '/9' ? [8.0, 7.5, 6.5, 7.0][i] || 7.0
                : ex.scoreUnit === '/180' ? [42, 38, 42, 0][i] || 36
                : [78, 74, 70, 76][i] || 70;
    const change = [+0.5, +0.5, -0.5, +0.0][i] || +0.0;
    return {
      ic: m.ic, c, label: m.label.replace(/\s*\(.*\)/,''),
      score, change,
      correct: m.q > 5 ? Math.round(m.q * 0.85) : null,
      total: m.q > 5 ? m.q : null,
      tasks: m.q <= 2 ? Array.from({length:m.q},(_,k)=>`Task ${k+1}: ${score}`) : null,
      criteria: m.color === 'speaking' ? ['Fluency','Vocab','Grammar','Pronunciation'].map(k=>`${k} ${score}`) : null,
    };
  });

  const overall = ex.bestScore;
  const overallPct = ex.scoreUnit === '/9' ? (overall/9)*100
                   : ex.scoreUnit === '/180' ? (overall/180)*100
                   : overall;
  const passNote = ex.scoreUnit === '/9' ? 'Band 7.5 is a strong score for university admission at most UK institutions.'
                 : ex.scoreUnit === '/180' ? 'Above the JLPT N4 pass threshold. To progress to N3, focus on grammar and 800 new kanji.'
                 : ex.scoreUnit === '/100' && lang.code === 'es' ? 'Apto en B2. Para C1, refuerza la expresión escrita argumentativa y el subjuntivo.'
                 : 'Réussite au DELF B1. Pour le B2, travaillez l\'argumentation écrite et la nuance lexicale.';
  const greetingName = lang.code === 'es' ? 'Felicidades, María.' : lang.code === 'fr' ? 'Félicitations, María.' : lang.code === 'ja' ? 'おめでとう、María。' : 'Congratulations, María.';

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'40px 36px' }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>

          {/* Overall hero */}
          <div style={{ background:T.ink, borderRadius:24, padding:'40px 44px', color:'#fff', marginBottom:28, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:14, opacity:.04, pointerEvents:'none' }}>
              {Array.from({length:200}).map((_,i)=><div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
            </div>
            <div style={{ position:'relative', zIndex:1, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'center' }}>
              <div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>{ex.name} · {mode.kind === 'official' ? 'May 2026 · Official result' : mode.kind === 'practice' ? 'Mock result · Not on record' : 'Practice drill · Saved to log'}</div>
                <div style={{ fontFamily:T.serif, fontSize:44, lineHeight:1.05, marginBottom:10 }}>{greetingName}</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.55 }}>You've improved your overall {ex.scoreLabel.toLowerCase()} since your last exam. Your {modules[0].label} was your strongest section.</div>
                <div style={{ display:'flex', gap:10, marginTop:20, flexWrap:'wrap' }}>
                  <Chip label={mode.short} accent="#fff" bg={mode.accent}/>
                  {mode.kind === 'official' && <Chip label={`${lang.english} Rank #12`} accent="rgba(255,255,255,.9)" bg="rgba(255,255,255,.12)"/>}
                  {mode.kind === 'official' && <Chip label="Top 2% this month" accent="rgba(255,255,255,.9)" bg="rgba(255,255,255,.12)"/>}
                  {mode.kind !== 'official' && <Chip label={mode.subtitle} accent="rgba(255,255,255,.85)" bg="rgba(255,255,255,.1)"/>}
                </div>
              </div>
              <div style={{ textAlign:'center' }}>
                <Ring pct={overallPct} size={150} stroke={12} color={T.brand} trackColor="rgba(255,255,255,.1)">
                  <div style={{ fontFamily:T.serif, fontSize:52, color:'#fff', lineHeight:1 }}>{overall}{ex.scoreUnit && ex.scoreUnit.startsWith('/') ? <span style={{ fontSize:20, opacity:.5 }}>{ex.scoreUnit}</span> : ''}</div>
                  <div style={{ fontSize:9, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginTop:4 }}>{ex.scoreLabel}</div>
                </Ring>
              </div>
            </div>
          </div>

          {/* Module breakdown */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
            {modules.map(m => (
              <Card key={m.label} padding={22}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                  <div style={{ width:38, height:38, borderRadius:11, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Icon[m.ic]({ width:16, height:16 })}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{m.label}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:T.serif, fontSize:32, color:m.c.c, lineHeight:1 }}>{ex.scoreUnit === '/9' ? m.score.toFixed(1) : m.score}</div>
                    <div style={{ fontSize:11, color:m.change>=0?T.listening.c:T.brand, fontWeight:700 }}>{m.change>=0?'+':''}{ex.scoreUnit === '/9' ? m.change.toFixed(1) : Math.round(m.change)}</div>
                  </div>
                </div>
                <Bar pct={ex.scoreUnit === '/9' ? (m.score/9)*100 : ex.scoreUnit === '/180' ? (m.score/45)*100 : m.score} color={m.c.c}/>
                <div style={{ marginTop:12, display:'flex', flexWrap:'wrap', gap:6 }}>
                  {m.correct !== undefined && <Chip label={`${m.correct}/${m.total} correct`} accent={m.c.c} bg={m.c.bg} style={{ fontSize:10 }}/>}
                  {m.tasks && m.tasks.map(ta => <Chip key={ta} label={ta} accent={m.c.c} bg={m.c.bg} style={{ fontSize:10 }}/>)}
                  {m.criteria && m.criteria.map(cr => <Chip key={cr} label={cr} accent={m.c.c} bg={m.c.bg} style={{ fontSize:10 }}/>)}
                </div>
              </Card>
            ))}
          </div>

          {/* AI feedback */}
          <Card padding={26} style={{ marginBottom:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:18 }}>
              <div style={{ width:38, height:38, borderRadius:11, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark()}</div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>AI Examiner Feedback</div>
            </div>
            {[
              { label:'Listening', text:'Excellent performance. You correctly identified all 4 speakers in Section 3 and completed the form-fill in Section 1 with 100% accuracy. Minor slips in Section 4 academic vocabulary — review "demographic," "hypothesis," and "proliferation."' },
              { label:'Writing',   text:'Your Task 2 argument was well-structured with a clear thesis. Cohesion would benefit from more varied linkers (you used "however" 4 times). Task 1 over-described minor data — focus on the overall trend first.' },
            ].map(fb => (
              <div key={fb.label} style={{ display:'flex', gap:14, marginBottom:16, paddingBottom:16, borderBottom:`1px solid ${T.hairline}` }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink2, width:80, flexShrink:0, paddingTop:2 }}>{fb.label}</div>
                <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.65, flex:1 }}>{fb.text}</div>
              </div>
            ))}
            <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.65, fontStyle:'italic' }}>
              "{passNote} To reach {ex.nextLevel}, focus on weaker modules and review the official {ex.short} descriptors."
            </div>
          </Card>

          {/* Actions */}
          <div style={{ display:'flex', gap:12 }}>
            {mode.kind === 'official' ? (
              <>
                <Btn nav="dashboard" label="Download certificate" icon={Icon.download({ width:13, height:13 })} variant="outline" accent={T.ink} size="lg" style={{ flex:1 }}/>
                <Btn label="View leaderboard" nav="exams" icon={Icon.trophy({ width:13, height:13 })} variant="outline" accent={T.brand} size="lg" style={{ flex:1 }}/>
                <Btn label="Start next exam prep" nav="exam_entry" accent={T.brand} size="lg" iconRight={Icon.arrow({ width:13, height:13 })} style={{ flex:1 }}/>
              </>
            ) : mode.kind === 'practice' ? (
              <>
                <Btn nav="dashboard" label="Back to dashboard" variant="outline" accent={T.ink} size="lg" style={{ flex:1 }}/>
                <Btn nav="mock_test" label="Take another mock" variant="outline" accent={mode.accent} size="lg" style={{ flex:1 }}/>
                <Btn nav="exam_entry" label={`Try the official ${ex.short}`} accent={T.brand} size="lg" iconRight={Icon.arrow({ width:13, height:13 })} style={{ flex:1 }}/>
              </>
            ) : (
              <>
                <Btn nav="dashboard" label="Back to dashboard" variant="outline" accent={T.ink} size="lg" style={{ flex:1 }}/>
                <Btn nav="lang" label="More practice" variant="outline" accent={mode.accent} size="lg" style={{ flex:1 }}/>
                <Btn nav="practice_runner" label="Drill again" accent={mode.accent} size="lg" iconRight={Icon.arrow({ width:13, height:13 })} style={{ flex:1 }}/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// Mode wrappers — set window.__examMode then render shared UI.
// Backend can read this to know which exam stream a result
// belongs to. Three pairs: monthly (official, $5, leaderboard),
// mock (free practice exam, full format), practice (single-skill drill).
// ═══════════════════════════════════════════════════════════
function MonthlyExamRunner()  { window.__examMode = 'monthly';  return <FullExamRunner/>; }
function MockExamRunner()     { window.__examMode = 'mock';     return <FullExamRunner/>; }
function PracticeExamRunner() { window.__examMode = 'practice'; return <FullExamRunner/>; }
function MonthlyExamResults() { window.__examMode = 'monthly';  return <ExamResults/>; }
function MockExamResults()    { window.__examMode = 'mock';     return <ExamResults/>; }
function PracticeExamResults(){ window.__examMode = 'practice'; return <ExamResults/>; }

// ═══════════════════════════════════════════════════════════
// REAL EXAM RUNNER — chains the actual module sessions in sequence,
// collects each real score, then aggregates. Sections are added one
// by one as each module session is hooked for exam mode.
// ═══════════════════════════════════════════════════════════
const EXAM_SECTION_COMP  = { reading:'ReadingSession', listening:'ListeningSession', speaking:'AISpeakingSession', writing:'WritingSession' };
const EXAM_SECTION_LABEL = { reading:'Reading', listening:'Listening', speaking:'Speaking', writing:'Writing' };
// Sections wired into the runner so far (grows one by one):
const EXAM_SECTIONS = ['reading'];

function ExamRunner() {
  const code = window.__langCode || 'en';
  const [idx, setIdx] = React.useState(0);
  const [results, setResults] = React.useState([]);
  const [done, setDone] = React.useState(false);

  React.useEffect(function () {
    window.__exam = { active: true, lang: code, sections: EXAM_SECTIONS, idx: 0, results: [] };
    function onSectionDone(e) {
      var d = (e && e.detail) || {};
      setResults(function (prev) {
        var next = prev.concat([{ module: d.module, score: Number(d.score) || 0 }]);
        if (next.length >= EXAM_SECTIONS.length) { window.__exam.active = false; setDone(true); }
        else { setIdx(next.length); }
        return next;
      });
    }
    window.addEventListener('fl-exam-section-done', onSectionDone);
    return function () { window.removeEventListener('fl-exam-section-done', onSectionDone); window.__exam = { active: false }; };
  }, []);

  if (done) return <ExamRunnerResults results={results} lang={code} />;

  const mod = EXAM_SECTIONS[idx] || 'reading';
  const Comp = window[EXAM_SECTION_COMP[mod]];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'9px 18px', background:T.ink, color:'#fff', display:'flex', alignItems:'center', gap:12, fontSize:12.5, flexShrink:0 }}>
        <span style={{ fontWeight:700 }}>Mock exam</span>
        <span style={{ opacity:.6 }}>Section {idx + 1} of {EXAM_SECTIONS.length} · {EXAM_SECTION_LABEL[mod]}</span>
        <div style={{ flex:1 }}/>
        <button onClick={() => window.__nav && window.__nav('exams')} style={{ fontSize:11.5, color:'rgba(255,255,255,.6)', background:'transparent', border:'none', cursor:'pointer' }}>Exit</button>
      </div>
      <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column' }}>
        {Comp ? <Comp/> : <div style={{ padding:40, color:T.ink3 }}>Section unavailable.</div>}
      </div>
    </div>
  );
}

function ExamRunnerResults({ results, lang }) {
  const MOD = { reading:{ c:T.reading, title:'Reading' }, listening:{ c:T.listening, title:'Listening' }, speaking:{ c:T.speaking, title:'Speaking' }, writing:{ c:T.writing, title:'Writing' } };
  const overall = results.length ? Math.round(results.reduce((a, r) => a + (Number(r.score) || 0), 0) / results.length) : 0;
  React.useEffect(function () {
    try {
      var raw = localStorage.getItem('sb-kbjqmhviuryakfzhhoaz-auth-token');
      var token = raw ? (JSON.parse(raw).access_token || null) : null;
      if (token) {
        fetch('/api/save-result', { method:'POST', headers:{ 'Content-Type':'application/json', Authorization:'Bearer ' + token },
          body: JSON.stringify({ lang: lang, score: overall, detail: { module:'mock_exam', sections: results } }) }).catch(function(){});
      }
    } catch (e) {}
  }, []);
  return (
    <div style={{ flex:1, overflow:'auto', background:T.bg }}>
      <div style={{ maxWidth:640, margin:'0 auto', padding:'48px 28px' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Mock exam complete</div>
          <div style={{ fontFamily:T.serif, fontSize:64, color:T.brand, lineHeight:1 }}>{overall}%</div>
          <div style={{ fontSize:13, color:T.ink3, marginTop:8 }}>Overall across {results.length} {results.length === 1 ? 'section' : 'sections'}</div>
        </div>
        <Card padding={0}>
          {results.map(function (r, i) {
            var m = MOD[r.module] || { c:T.reading, title:r.module };
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom: i < results.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700 }}>{m.title[0]}</div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:T.ink }}>{m.title}</div>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{r.score}%</div>
              </div>
            );
          })}
        </Card>
        <div style={{ display:'flex', gap:10, marginTop:24 }}>
          <Btn label="Back to exams" accent={T.brand} size="lg" style={{ flex:1 }} onClick={() => window.__nav && window.__nav('exams')}/>
          <Btn label="View progress" variant="outline" accent={T.ink2} size="lg" style={{ flex:1 }} onClick={() => window.__nav && window.__nav('progress')}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  ExamEntry, FullExamRunner, ExamResults,
  MonthlyExamRunner, MockExamRunner, PracticeExamRunner,
  MonthlyExamResults, MockExamResults, PracticeExamResults,
  EXAM_MODES, getExamMode,
  ExamRunner, ExamRunnerResults,
});
