// ── Lesson detail (article + video) ────────────────────────

function LessonDetailPage() {
  const [tab, setTab] = React.useState('overview');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        {/* Hero */}
        <div style={{ padding:'32px 40px 24px', borderBottom:`1px solid ${T.hairline}` }}>
          <div onClick={() => window.dispatchEvent(new CustomEvent('app:nav', { detail:'course' }))} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:T.ink3, marginBottom:14, cursor:'pointer' }}>
            {Icon.arrowL()} <span>Module 4 · Past Tenses</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:32, alignItems:'flex-start' }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <Chip label="Lesson 7 of 12" bg={T.bg2} accent={T.ink2}/>
                <Chip label="B1 · Intermediate" bg={T.brandLight} accent={T.brand}/>
                <Chip label="18 min" bg={T.bg2} accent={T.ink2}/>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:1.05, color:T.ink, marginBottom:14 }}>Pretérito vs. imperfecto: when stories shift</div>
              <div style={{ fontSize:15, color:T.ink2, lineHeight:1.6, maxWidth:640, marginBottom:20 }}>
                The single biggest stumbling block for English speakers learning Spanish past tenses. We'll work through 12 example sentences, common test traps, and finish with a 3-minute speaking drill with Lía.
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <Btn label="Continue lesson" nav="reading" accent={T.brand} icon={Icon.arrow()}/>
                <Btn label="Practice drill" nav="practice" variant="outline" accent={T.ink} icon={Icon.target ? Icon.target() : null}/>
              </div>
            </div>
            <div>
              {/* Video player */}
              <div style={{ aspectRatio:'16/9', background:T.ink, borderRadius:14, position:'relative', overflow:'hidden', cursor:'pointer' }}>
                <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${T.brand}33, transparent 60%)` }}/>
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:64, height:64, borderRadius:32, background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', color:T.ink }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div style={{ position:'absolute', bottom:10, left:12, right:12, display:'flex', alignItems:'center', gap:10, color:'#fff', fontSize:11, fontWeight:600 }}>
                  <span>0:42</span>
                  <div style={{ flex:1, height:3, background:'rgba(255,255,255,.25)', borderRadius:2, overflow:'hidden' }}><div style={{ width:'18%', height:'100%', background:T.brand }}/></div>
                  <span style={{ color:'rgba(255,255,255,.6)' }}>4:38</span>
                </div>
              </div>
              <div style={{ marginTop:10, fontSize:11.5, color:T.ink4 }}>Intro video · taught by María González</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ padding:'0 40px', borderBottom:`1px solid ${T.hairline}`, display:'flex', gap:0 }}>
          {['overview','transcript','exercises','vocab'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:'14px 18px', fontSize:13, fontWeight: tab === t ? 700 : 500, color: tab === t ? T.ink : T.ink3, borderBottom: tab === t ? `2px solid ${T.brand}` : '2px solid transparent', textTransform:'capitalize', cursor:'pointer' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ padding:'30px 40px 60px', display:'grid', gridTemplateColumns:'1fr 320px', gap:36 }}>
          <div style={{ minWidth:0 }}>
            {tab === 'overview' && <>
              <h2 style={{ fontFamily:T.serif, fontSize:28, color:T.ink, marginBottom:14 }}>What you'll learn</h2>
              <ul style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:28, padding:0, listStyle:'none' }}>
                {[
                  'When to use pretérito for "completed" actions',
                  'When to use imperfecto for habit and atmosphere',
                  'How sentence-level time markers signal tense (de repente, todos los días, mientras…)',
                  'Five "trap" verbs: saber, conocer, querer, poder, tener',
                ].map((s, i) => (
                  <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:T.ink2, lineHeight:1.5 }}>
                    <div style={{ width:18, height:18, borderRadius:9, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{Icon.check({ width:10, height:10 })}</div>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>

              <h2 style={{ fontFamily:T.serif, fontSize:28, color:T.ink, marginBottom:14 }}>Lesson plan</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { n:1, t:'The two timelines', d:'4 min', done:true },
                  { n:2, t:'Hablé vs. hablaba — minimal pairs',  d:'5 min', done:true },
                  { n:3, t:'Time-marker triggers',  d:'3 min', done:true, current:false },
                  { n:4, t:'Trap verbs in past tenses', d:'4 min', current:true },
                  { n:5, t:'Speaking drill with Lía', d:'3 min' },
                ].map(s => (
                  <div key={s.n} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', background: s.current ? T.brandLight : T.card, border:`1px solid ${s.current ? T.brand : T.border}`, borderRadius:11 }}>
                    <div style={{ width:26, height:26, borderRadius:13, background: s.done ? '#1A8F4E' : s.current ? T.brand : T.bg2, color: s.done || s.current ? '#fff' : T.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>
                      {s.done ? Icon.check({ width:11, height:11 }) : s.n}
                    </div>
                    <div style={{ flex:1, fontSize:13, fontWeight:600, color:T.ink }}>{s.t}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>{s.d}</div>
                  </div>
                ))}
              </div>
            </>}

            {tab === 'transcript' && <div style={{ fontSize:14.5, lineHeight:1.75, color:T.ink2, maxWidth:640 }}>
              <p style={{ marginBottom:14 }}><b style={{ color:T.brand }}>0:00 ·</b> Hola, soy María. Hoy vamos a hablar del pretérito y el imperfecto — los dos tiempos del pasado más importantes en español.</p>
              <p style={{ marginBottom:14 }}><b style={{ color:T.brand }}>0:18 ·</b> The mistake almost every English speaker makes is treating these like "simple past" and "past continuous." They're not. They encode a deeper distinction: completion versus context.</p>
              <p style={{ marginBottom:14 }}><b style={{ color:T.brand }}>0:42 ·</b> When you say "comí pizza," you're saying it happened, it ended. When you say "comía pizza," you're describing the moment — what was going on…</p>
              <p style={{ marginBottom:14 }}><b style={{ color:T.brand }}>1:14 ·</b> Let's look at our first example. "Cuando yo era niño, vivía en Madrid." Both verbs in imperfecto, because we're painting a picture…</p>
            </div>}

            {tab === 'exercises' && <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {['Conjugate 12 regular verbs in pretérito','Identify tense from time markers','Translate 8 sentences (EN → ES)','Listen and fill in the blank'].map((e, i) => (
                <Card key={i} padding={16}>
                  <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:38, height:38, borderRadius:10, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.target ? Icon.target({ width:16, height:16 }) : '◎'}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Exercise {i+1} · {e}</div>
                      <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>{[8,12,15,10][i]} questions · ~{[5,7,9,6][i]} min</div>
                    </div>
                    <Btn label="Start" nav="practice" accent={T.brand} small/>
                  </div>
                </Card>
              ))}
            </div>}

            {tab === 'vocab' && <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {[
                ['de repente','suddenly'],['mientras','while'],['todos los días','every day'],['ayer','yesterday'],
                ['siempre','always'],['nunca','never'],['una vez','once'],['a menudo','often'],
              ].map(([es, en], i) => (
                <Card key={i} padding={14}>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{es}</div>
                  <div style={{ fontSize:12, color:T.ink3, marginTop:2 }}>{en}</div>
                </Card>
              ))}
            </div>}
          </div>

          <div>
            <Card padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Your progress</div>
              <CircularProgress value={62} size={120} stroke={10}/>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}><span style={{ color:T.ink3 }}>Steps done</span><span style={{ fontWeight:700, color:T.ink }}>3 of 5</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}><span style={{ color:T.ink3 }}>Time spent</span><span style={{ fontWeight:700, color:T.ink }}>11 min</span></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}><span style={{ color:T.ink3 }}>Mastery</span><span style={{ fontWeight:700, color:T.brand }}>72%</span></div>
              </div>
              <div style={{ marginTop:16 }}><Btn label="Continue lesson" nav="reading" accent={T.brand} fullWidth iconRight={Icon.arrow()}/></div>
            </Card>

            <div style={{ marginTop:14, padding:'14px 16px', background:T.brandLight, border:`1px solid ${T.brand}33`, borderRadius:12 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>Stuck?</div>
              <div style={{ fontSize:13, color:T.ink2, lineHeight:1.5, marginBottom:12 }}>Lía can explain anything in this lesson in your own language.</div>
              <Btn label="Ask Lía" nav="tutor" small accent={T.brand}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LessonDetailPage });
