// ── Mobile · Lesson Detail / Phrasebook / Phrasebook Practice / Add Lang / Mock Test ──

function MLessonDetail() {
  const nav = window.__nav || (() => {});
  const [tab, setTab] = useState('overview');
  const code = window.__langCode || 'es';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const t = langTheme(lang.code);

  return (
    <MobileFrame statusBg={T.card}>
      <MobileBody>
        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
          <button onClick={() => nav('course')} style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.arrowL({ width:14, height:14 })}</button>
          <div style={{ flex:1, fontSize:11.5, color:T.ink3, fontWeight:600 }}>Module 4 · Past Tenses</div>
          <button style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.bookmark ? Icon.bookmark({ width:13, height:13 }) : '⋯'}</button>
        </div>

        <div style={{ flex:1, overflow:'auto' }}>
          {/* Hero */}
          <div style={{ padding:'18px 18px 14px' }}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
              <Chip label="Lesson 7 of 12" bg={T.bg2} accent={T.ink2} style={{ fontSize:10 }}/>
              <Chip label="B1" bg={t.accentLight || T.brandLight} accent={t.accent || T.brand} style={{ fontSize:10 }}/>
              <Chip label="18 min" bg={T.bg2} accent={T.ink2} style={{ fontSize:10 }}/>
            </div>
            <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.15, color:T.ink, marginBottom:8 }}>Pretérito vs. imperfecto: when stories shift</div>
            <div style={{ fontSize:13, color:T.ink2, lineHeight:1.55, marginBottom:14 }}>The single biggest stumbling block for English speakers learning Spanish past tenses. 12 examples, common traps, finishing with a 3-min speaking drill.</div>

            {/* Video */}
            <div style={{ aspectRatio:'16/9', background:T.ink, borderRadius:12, position:'relative', overflow:'hidden', marginBottom:12 }}>
              <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${(t.accent||T.brand)}33, transparent 60%)` }}/>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <div style={{ width:54, height:54, borderRadius:27, background:'rgba(255,255,255,.95)', display:'flex', alignItems:'center', justifyContent:'center', color:T.ink }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </div>
              </div>
              <div style={{ position:'absolute', bottom:8, left:10, right:10, display:'flex', alignItems:'center', gap:8, color:'#fff', fontSize:10, fontWeight:600 }}>
                <span>0:42</span>
                <div style={{ flex:1, height:3, background:'rgba(255,255,255,.25)', borderRadius:2 }}><div style={{ width:'18%', height:'100%', background:t.accent || T.brand, borderRadius:2 }}/></div>
                <span style={{ color:'rgba(255,255,255,.6)' }}>4:38</span>
              </div>
            </div>

            <Btn label="Continue lesson" onClick={() => nav('reading')} accent={t.accent || T.brand} fullWidth iconRight={Icon.arrow({ width:12, height:12 })}/>
          </div>

          {/* Tabs */}
          <div style={{ display:'flex', gap:0, padding:'0 18px', borderBottom:`1px solid ${T.hairline}`, position:'sticky', top:0, background:T.card, zIndex:1, overflowX:'auto' }}>
            {['overview','transcript','exercises','vocab'].map(tb => (
              <button key={tb} onClick={() => setTab(tb)} style={{ padding:'10px 12px', fontSize:12, fontWeight: tab===tb?700:500, color: tab===tb?T.ink:T.ink3, borderBottom: tab===tb?`2px solid ${t.accent||T.brand}`:'2px solid transparent', textTransform:'capitalize', cursor:'pointer', whiteSpace:'nowrap' }}>{tb}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding:'18px' }}>
            {tab === 'overview' && (
              <>
                <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>What you'll learn</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:22 }}>
                  {[
                    'Pretérito for completed actions',
                    'Imperfecto for habit & atmosphere',
                    'Time-marker triggers',
                    'Trap verbs: saber, conocer, querer…',
                  ].map((s, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:9, fontSize:13, color:T.ink2, lineHeight:1.5 }}>
                      <div style={{ width:16, height:16, borderRadius:8, background:t.accentLight || T.brandLight, color:t.accent || T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>{Icon.check({ width:9, height:9 })}</div>
                      <span>{s}</span>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Lesson plan</div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {[
                    { n:1, t:'The two timelines', d:'4m', done:true },
                    { n:2, t:'Hablé vs. hablaba', d:'5m', done:true },
                    { n:3, t:'Time-marker triggers', d:'3m', done:true },
                    { n:4, t:'Trap verbs', d:'4m', current:true },
                    { n:5, t:'Speaking drill', d:'3m' },
                  ].map(s => (
                    <div key={s.n} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', background: s.current ? (t.accentLight || T.brandLight) : T.card, border:`1px solid ${s.current ? (t.accent || T.brand) : T.border}`, borderRadius:10 }}>
                      <div style={{ width:22, height:22, borderRadius:11, background: s.done ? '#1A8F4E' : s.current ? (t.accent || T.brand) : T.bg2, color: s.done || s.current ? '#fff' : T.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700 }}>{s.done ? Icon.check({ width:9, height:9 }) : s.n}</div>
                      <div style={{ flex:1, fontSize:12.5, fontWeight:600, color:T.ink }}>{s.t}</div>
                      <div style={{ fontSize:10.5, color:T.ink4 }}>{s.d}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === 'transcript' && (
              <div style={{ fontSize:13.5, lineHeight:1.7, color:T.ink2 }}>
                <p style={{ marginBottom:12 }}><b style={{ color:t.accent || T.brand }}>0:00 ·</b> Hola, soy María. Hoy vamos a hablar del pretérito y el imperfecto.</p>
                <p style={{ marginBottom:12 }}><b style={{ color:t.accent || T.brand }}>0:18 ·</b> The mistake every English speaker makes is treating these like simple past and past continuous.</p>
                <p style={{ marginBottom:12 }}><b style={{ color:t.accent || T.brand }}>0:42 ·</b> "Comí pizza" — it happened, ended. "Comía pizza" — describes the moment.</p>
              </div>
            )}

            {tab === 'exercises' && (
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {['Conjugate 12 regular verbs','Identify tense from time markers','Translate 8 sentences','Listen and fill blank'].map((e, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 13px', background:T.card, border:`1px solid ${T.border}`, borderRadius:11 }}>
                    <div style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.target ? Icon.target({ width:14, height:14 }) : '◎'}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.25 }}>{e}</div>
                      <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{[8,12,15,10][i]} qs · ~{[5,7,9,6][i]} min</div>
                    </div>
                    <button onClick={() => nav('practice')} style={{ padding:'7px 12px', borderRadius:8, background:t.accent || T.brand, color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer' }}>Start</button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'vocab' && (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[['de repente','suddenly'],['mientras','while'],['todos los días','every day'],['ayer','yesterday'],['siempre','always'],['nunca','never'],['una vez','once'],['a menudo','often']].map(([es,en],i) => (
                  <div key={i} style={{ padding:'10px 12px', background:T.card, border:`1px solid ${T.border}`, borderRadius:10 }}>
                    <div style={{ fontFamily:T.serif, fontSize:15, color:T.ink }}>{es}</div>
                    <div style={{ fontSize:11, color:T.ink3, marginTop:1 }}>{en}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stuck card */}
          <div style={{ margin:'4px 18px 24px', padding:'14px 14px', background:t.accentLight || T.brandLight, border:`1px solid ${(t.accent || T.brand)}33`, borderRadius:12 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:t.accent || T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>Stuck?</div>
            <div style={{ fontSize:12.5, color:T.ink2, lineHeight:1.5, marginBottom:10 }}>Your tutor can explain anything in this lesson in your own language.</div>
            <button onClick={() => nav('tutor')} style={{ padding:'8px 14px', borderRadius:8, background:t.accent || T.brand, color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer' }}>Ask the tutor</button>
          </div>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ── Phrasebook (mobile) ───────────────────────────────────────
function MPhrasebook() {
  const nav = window.__nav || (() => {});
  const cats = (typeof window !== 'undefined' && window.PHRASEBOOK_CATS) ? window.PHRASEBOOK_CATS : [];

  return (
    <MobileFrame statusBg={T.card}>
      <MobileBody>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
          <button onClick={() => nav('lang')} style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.arrowL({ width:14, height:14 })}</button>
          <div style={{ flex:1, fontFamily:T.serif, fontSize:18, color:T.ink }}>Phrasebook</div>
          <button onClick={() => { window.__phraseCat = 'all'; nav('phrasebook_practice'); }} style={{ padding:'7px 11px', borderRadius:8, background:T.brand, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>{Icon.play({ width:9, height:9 })} All</button>
        </div>

        <div style={{ flex:1, overflow:'auto', padding:'14px 14px 24px' }}>
          <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5, marginBottom:14 }}>Real-world phrases by situation. Tap any phrase to hear it. Tap Practice to drill the category.</div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {cats.map(c => (
              <div key={c.id} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:'14px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div>
                    <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.15 }}>{c.name}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{c.count} phrases</div>
                  </div>
                  <button onClick={() => { window.__phraseCat = c.id; nav('phrasebook_practice'); }} style={{ padding:'6px 11px', borderRadius:99, background:T.brand, color:'#fff', fontSize:10.5, fontWeight:700, display:'flex', alignItems:'center', gap:4, cursor:'pointer' }}>{Icon.play({ width:8, height:8 })} Practice</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  {(c.phrases || []).slice(0,2).map(p => (
                    <div key={p.es} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:T.bg2, borderRadius:8 }}>
                      <button style={{ width:22, height:22, borderRadius:5, background:T.card, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.play({ width:8, height:8 })}</button>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontFamily:T.serif, fontSize:13, color:T.ink, fontStyle:'italic', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>"{p.es}"</div>
                        <div style={{ fontSize:10.5, color:T.ink3, marginTop:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.en}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ── Phrasebook Practice (mobile) ──────────────────────────────
function MPhrasebookPractice() {
  const nav = window.__nav || (() => {});
  const cats = (typeof window !== 'undefined' && window.PHRASEBOOK_CATS) ? window.PHRASEBOOK_CATS : [];
  const catId = (typeof window !== 'undefined' && window.__phraseCat) || 'all';
  const cat = cats.find(c => c.id === catId);
  const phrases = cat ? cat.phrases : cats.flatMap(c => c.phrases || []);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState('listen');
  const total = phrases.length;
  const phrase = phrases[idx];
  const progress = total ? ((idx + 1) / total) * 100 : 0;

  const next = () => { setRevealed(false); if (idx < total - 1) setIdx(idx + 1); else nav('phrasebook'); };
  const prev = () => { setRevealed(false); if (idx > 0) setIdx(idx - 1); };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
          {/* Top bar */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:T.card, borderBottom:`1px solid ${T.hairline}` }}>
            <button onClick={() => nav('phrasebook')} style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer' }}>×</button>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>{cat ? cat.name : 'All phrases'}</div>
              <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden', marginTop:3 }}>
                <div style={{ width:`${progress}%`, height:'100%', background:T.brand, borderRadius:99, transition:'width .3s' }}/>
              </div>
            </div>
            <div style={{ fontFamily:T.mono, fontSize:11.5, color:T.ink2 }}>{idx + 1}/{total}</div>
          </div>

          {/* Mode toggle */}
          <div style={{ display:'flex', justifyContent:'center', padding:'14px 0 6px' }}>
            <div style={{ display:'inline-flex', background:T.bg2, padding:3, borderRadius:99, gap:2 }}>
              {[
                { id:'listen', label:'Listen', ic:Icon.play },
                { id:'speak',  label:'Speak', ic:Icon.mic },
              ].map(m => (
                <button key={m.id} onClick={() => setMode(m.id)} style={{ padding:'7px 14px', borderRadius:99, fontSize:11.5, fontWeight:700, background: mode===m.id ? T.card : 'transparent', color: mode===m.id ? T.ink : T.ink3, boxShadow: mode===m.id ? '0 1px 3px rgba(0,0,0,.06)' : 'none', display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>{m.ic && m.ic({ width:10, height:10 })} {m.label}</button>
              ))}
            </div>
          </div>

          {/* Card */}
          <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'12px 16px' }}>
            <div style={{ width:'100%', background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'30px 22px', textAlign:'center', boxShadow:'0 6px 18px rgba(0,0,0,.04)' }}>
              <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.3, color:T.ink, marginBottom:16, fontStyle:'italic' }}>"{phrase?.es || ''}"</div>
              <button style={{ width:60, height:60, borderRadius:'50%', background: mode==='speak'?T.speaking.c:T.brand, color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', boxShadow: mode==='speak' ? `0 8px 18px ${T.speaking.c}55` : `0 8px 18px ${T.brand}55`, cursor:'pointer', marginBottom:18, border:'none' }}>{mode==='speak' ? Icon.mic({ width:20, height:20 }) : Icon.play({ width:20, height:20 })}</button>
              {revealed ? (
                <div style={{ borderTop:`1px solid ${T.hairline}`, paddingTop:14 }}>
                  <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:5 }}>Translation</div>
                  <div style={{ fontSize:15, color:T.ink2, lineHeight:1.45 }}>{phrase?.en || ''}</div>
                </div>
              ) : (
                <button onClick={() => setRevealed(true)} style={{ fontSize:12, fontWeight:700, color:T.brand, padding:'7px 12px', borderRadius:7, background:T.bg2, cursor:'pointer' }}>Reveal translation</button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'12px 14px', background:T.card, borderTop:`1px solid ${T.hairline}` }}>
            <button onClick={prev} disabled={idx===0} style={{ width:44, height:44, borderRadius:11, background:T.bg2, color:idx===0?T.ink5:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', cursor:idx===0?'default':'pointer', opacity:idx===0?.5:1 }}>←</button>
              <button onClick={next} style={{ flex:1, padding:'12px 0', borderRadius:11, background:T.brand, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', border:'none' }}>{idx === total - 1 ? 'Finish' : 'Next phrase →'}</button>
          </div>
    </div>
  );
}

// ── Add Language (mobile) ─────────────────────────────────────
function MAddLanguage() {
  const nav = window.__nav || (() => {});
  const owned = (window.userLanguages ? window.userLanguages() : []).map(l => l.code);
  const [picked, setPicked] = useState(null);
  const [step, setStep] = useState(0);
  const [region, setRegion] = useState('All');
  const [query, setQuery] = useState('');
  const [goal, setGoal] = useState('travel');
  const [minutes, setMinutes] = useState(15);
  const [level, setLevel] = useState(0);

  const all = [
    { code:'de', native:'Deutsch', english:'German', exam:'Goethe', accent:'#111', light:'#F4F4F4', region:'Europe', tier:'full' },
    { code:'it', native:'Italiano', english:'Italian', exam:'CILS', accent:'#0F8A4D', light:'#E9F6EE', region:'Europe', tier:'full' },
    { code:'pt', native:'Português', english:'Portuguese', exam:'CELPE', accent:'#0E6F3F', light:'#E7F4EC', region:'Europe', tier:'full' },
    { code:'ko', native:'한국어', english:'Korean', exam:'TOPIK', accent:'#1F4F8C', light:'#E9F0FB', region:'Asia', tier:'full' },
    { code:'zh', native:'中文', english:'Mandarin', exam:'HSK', accent:'#B0142B', light:'#FBE8EB', region:'Asia', tier:'full' },
    { code:'ar', native:'العربية', english:'Arabic', exam:'ALPT', accent:'#0D6E55', light:'#E5F1ED', region:'Middle East', tier:'full' },
    { code:'ru', native:'Русский', english:'Russian', exam:'TORFL', accent:'#3D52A0', light:'#ECEFF8', region:'Europe', tier:'full' },
    { code:'hi', native:'हिन्दी', english:'Hindi', exam:'HPT', accent:'#C9501C', light:'#FBEDE2', region:'Asia', tier:'full' },
    { code:'tr', native:'Türkçe', english:'Turkish', exam:'TYS', accent:'#B61C2A', light:'#FBE7E9', region:'Europe', tier:'full' },
    { code:'nl', native:'Nederlands', english:'Dutch', exam:'NT2', accent:'#1B4FA3', light:'#E5ECF7', region:'Europe', tier:'cefr' },
    { code:'sv', native:'Svenska', english:'Swedish', exam:'Swedex', accent:'#3A6FA5', light:'#EAF0F7', region:'Europe', tier:'cefr' },
    { code:'pl', native:'Polski', english:'Polish', exam:'Państwowy', accent:'#A6262E', light:'#FBE9EB', region:'Europe', tier:'cefr' },
    { code:'th', native:'ภาษาไทย', english:'Thai', exam:'CU-TFL', accent:'#B71C30', light:'#FBE6EA', region:'Asia', tier:'cefr' },
    { code:'vi', native:'Tiếng Việt', english:'Vietnamese', exam:'VLPT', accent:'#DA251D', light:'#FBE5E7', region:'Asia', tier:'cefr' },
    { code:'id', native:'Indonesia', english:'Indonesian', exam:'UKBI', accent:'#CE1126', light:'#FBE5E8', region:'Asia', tier:'cefr' },
    { code:'sw', native:'Kiswahili', english:'Swahili', exam:'KCSE', accent:'#007A33', light:'#E5F2EC', region:'Africa', tier:'soon' },
    { code:'fa', native:'فارسی', english:'Persian', exam:'AMFA', accent:'#239F40', light:'#E5F2E9', region:'Middle East', tier:'soon' },
    { code:'bn', native:'বাংলা', english:'Bengali', exam:'BPT', accent:'#006A4E', light:'#E5EFEB', region:'Asia', tier:'soon' },
    { code:'eo', native:'Esperanto', english:'Esperanto', exam:'KER', accent:'#089100', light:'#E5F2DF', region:'Constructed', tier:'soon' },
    { code:'la', native:'Latina', english:'Latin', exam:'PCL', accent:'#7C2D12', light:'#F5E5DD', region:'Classical', tier:'soon' },
  ].filter(l => !owned.includes(l.code));

  const regions = ['All','Europe','Asia','Africa','Middle East','Classical'];
  const visible = all.filter(l => (region==='All' || l.region===region) && (!query || l.english.toLowerCase().includes(query.toLowerCase()) || l.native.toLowerCase().includes(query.toLowerCase())));

  const goals = [
    { id:'travel', ic:'world', label:'Travel & culture' },
    { id:'work', ic:'check', label:'Work & business' },
    { id:'exam', ic:'trophy', label:'Pass an exam' },
    { id:'family', ic:'users', label:'Family & heritage' },
    { id:'study', ic:'book', label:'Academic study' },
    { id:'fun', ic:'spark', label:'Just for fun' },
  ];
  const minList = [5,10,15,30,60];
  const levList = ['A0','A1','A2','B1','B2','C1'];

  if (!picked || step === 0) {
    return (
      <MobileFrame statusBg={T.card}>
        <MobileBody>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
            <button onClick={() => nav('dashboard')} style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer' }}>×</button>
            <div style={{ flex:1, fontFamily:T.serif, fontSize:17, color:T.ink }}>Add a language</div>
          </div>

          <div style={{ flex:1, overflow:'auto', padding:'14px 14px 24px' }}>
            <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5, marginBottom:14 }}>Pick from {all.length}+ languages. Top tier ships full curriculum + dedicated exam prep.</div>

            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', background:T.bg2, borderRadius:10, marginBottom:10 }}>
              {Icon.search({ width:13, height:13, style:{ color:T.ink4 } })}
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search languages…" style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:13, color:T.ink }}/>
            </div>

            <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, marginBottom:14 }}>
              {regions.map(r => (
                <button key={r} onClick={() => setRegion(r)} style={{ padding:'6px 11px', borderRadius:99, fontSize:11, fontWeight:600, border:`1px solid ${region===r?T.ink:T.border}`, background:region===r?T.ink:T.card, color:region===r?'#fff':T.ink2, whiteSpace:'nowrap', cursor:'pointer', flexShrink:0 }}>{r}</button>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {visible.map(l => (
                <button key={l.code} onClick={() => { setPicked(l); setStep(1); }} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:'12px 11px', textAlign:'left', cursor:'pointer', display:'flex', flexDirection:'column', gap:8 }}>
                  <Flag code={l.code} w={28} h={20} radius={3}/>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.15 }}>{l.english}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{l.native}</div>
                  </div>
                  <div style={{ fontSize:10, color:T.ink5, marginTop:'auto' }}>{l.exam}</div>
                </button>
              ))}
            </div>
          </div>
        </MobileBody>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame statusBg={picked.accent}>
      <MobileBody>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', background:picked.accent, color:'#fff' }}>
          <button onClick={() => { setPicked(null); setStep(0); }} style={{ width:34, height:34, borderRadius:9, background:'rgba(255,255,255,.18)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.arrowL({ width:13, height:13 })}</button>
          <div style={{ flex:1, fontSize:11.5, opacity:.9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>You picked</div>
        </div>

        <div style={{ flex:1, overflow:'auto' }}>
          <div style={{ background:picked.accent, color:'#fff', padding:'8px 18px 22px', display:'flex', alignItems:'center', gap:12 }}>
            <Flag code={picked.code} w={48} h={32} radius={5}/>
            <div>
              <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.05 }}>{picked.native}</div>
              <div style={{ fontSize:12, opacity:.85, marginTop:2 }}>{picked.english} · Targets {picked.exam}</div>
            </div>
          </div>

          <div style={{ padding:'18px 14px 24px' }}>
            {/* Goal */}
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>What's your goal?</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7, marginBottom:18 }}>
              {goals.map(g => (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 11px', borderRadius:10, border:`1.5px solid ${goal===g.id?picked.accent:T.border}`, background:goal===g.id?picked.light:T.card, textAlign:'left', cursor:'pointer' }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:goal===g.id?picked.accent:T.bg2, color:goal===g.id?'#fff':T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[g.ic] && Icon[g.ic]({ width:12, height:12 })}</div>
                  <div style={{ fontSize:11.5, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{g.label}</div>
                </button>
              ))}
            </div>

            {/* Minutes */}
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Daily target</div>
            <div style={{ display:'flex', gap:5, marginBottom:18 }}>
              {minList.map(m => (
                <button key={m} onClick={() => setMinutes(m)} style={{ flex:1, padding:'9px 0', borderRadius:9, border:`1.5px solid ${minutes===m?picked.accent:T.border}`, background:minutes===m?picked.light:T.card, fontSize:12, fontWeight:700, color:minutes===m?picked.accent:T.ink2, cursor:'pointer' }}>{m}m</button>
              ))}
            </div>

            {/* Level */}
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Current level</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:20 }}>
              {levList.map((lv, i) => (
                <button key={i} onClick={() => setLevel(i)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, border:`1.5px solid ${level===i?picked.accent:T.border}`, background:level===i?picked.light:T.card, textAlign:'left', cursor:'pointer' }}>
                  <div style={{ width:16, height:16, borderRadius:8, border:`2px solid ${level===i?picked.accent:T.ink5}`, background:level===i?picked.accent:'transparent', flexShrink:0, position:'relative' }}>{level===i && <div style={{ position:'absolute', inset:3, borderRadius:5, background:'#fff' }}/>}</div>
                  <span style={{ fontSize:12.5, color:T.ink, fontWeight:level===i?700:500 }}>{lv}</span>
                </button>
              ))}
            </div>

            <button onClick={() => { window.__langCode = picked.code; nav('lang'); }} style={{ width:'100%', padding:'13px 0', borderRadius:12, background:picked.accent, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', border:'none' }}>Add {picked.english} →</button>
          </div>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ── Mock Test (mobile) ────────────────────────────────────────
function MMockTest() {
  const nav = window.__nav || (() => {});
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const t = langTheme(lang.code);
  const colorMap = { listening:T.listening, reading:T.reading, writing:T.writing, speaking:T.speaking };

  return (
    <MobileFrame statusBg={T.bg}>
      <MobileBody>
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
          <button onClick={() => nav('exams')} style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.arrowL({ width:13, height:13 })}</button>
          <div style={{ flex:1, fontFamily:T.serif, fontSize:17, color:T.ink }}>Mock test</div>
        </div>

        <div style={{ flex:1, overflow:'auto', padding:'14px 14px 24px' }}>
          {/* Practice mode banner */}
          <div style={{ background:'#FFF7E6', border:'1.5px solid #F0C674', borderRadius:13, padding:'12px 14px', marginBottom:16 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:'#7A4E0B', marginBottom:3 }}>Practice mode — not an official attempt</div>
            <div style={{ fontSize:11.5, color:'#7A4E0B', opacity:.9, lineHeight:1.5, marginBottom:9 }}>Free, unlimited, no leaderboard. For ranked attempt, take the $5 monthly exam.</div>
            <button onClick={() => window.payFor && window.payFor('exam_official')} style={{ padding:'7px 12px', borderRadius:8, background:'#7A4E0B', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', border:'none' }}>Take {ex.short} for $5</button>
          </div>

          <div style={{ fontSize:10.5, fontWeight:700, color:t.accent, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>{lang.english} · Mock test</div>
          <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.15, marginBottom:6 }}>Practice the full {ex.name}</div>
          <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5, marginBottom:18 }}>Try the real format with no pressure. Pick a single module or run the full simulation.</div>

          {/* Full mock card */}
          <div style={{ background:T.ink, color:'#fff', borderRadius:14, overflow:'hidden', marginBottom:10 }}>
            <div style={{ padding:'18px 16px' }}>
              <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>Recommended</div>
              <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.15, marginBottom:5 }}>Full mock — all modules</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', lineHeight:1.5, marginBottom:12 }}>{ex.modules.length} modules · {ex.duration}</div>
              <button onClick={() => nav('mock_runner')} style={{ width:'100%', padding:'11px 0', borderRadius:10, background:t.accent, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer', border:'none' }}>Start full mock →</button>
            </div>
            <div style={{ padding:'10px 16px', background:'rgba(255,255,255,.06)', fontSize:10.5, color:'rgba(255,255,255,.7)', display:'flex', gap:11, flexWrap:'wrap' }}>
              <span>✓ Free</span><span>✓ Unlimited</span><span>✓ AI-graded</span>
            </div>
          </div>

          {/* Quick warm-up */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:'14px 14px', marginBottom:18 }}>
            <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>Warm-up</div>
            <div style={{ fontFamily:T.serif, fontSize:17, color:T.ink, lineHeight:1.15, marginBottom:5 }}>10-question drill</div>
            <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.5, marginBottom:11 }}>Random questions across all modules. ~12 min.</div>
            <button onClick={() => nav('mock_runner')} style={{ width:'100%', padding:'10px 0', borderRadius:9, background:'transparent', color:t.accent, fontSize:12, fontWeight:700, cursor:'pointer', border:`1.5px solid ${t.accent}` }}>Start warm-up</button>
          </div>

          {/* Single modules */}
          <div style={{ fontSize:11, fontWeight:700, color:T.ink, marginBottom:10 }}>Or practice just one module</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {ex.modules.map((m, i) => {
              const c = colorMap[m.color] || T.listening;
              return (
                <button key={i} onClick={() => nav('practice_runner')} style={{ display:'flex', alignItems:'center', gap:11, padding:'13px 13px', borderRadius:11, border:`1px solid ${T.border}`, background:T.card, cursor:'pointer', textAlign:'left' }}>
                  <div style={{ width:36, height:36, borderRadius:9, background:c.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[m.ic]({ width:14, height:14 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{m.label}</div>
                    <div style={{ fontSize:10.5, color:T.ink3, marginTop:1 }}>{m.time} · {m.q} {m.q===1?'task':'items'}</div>
                  </div>
                  <div style={{ color:c.c }}>{Icon.arrow({ width:12, height:12 })}</div>
                </button>
              );
            })}
          </div>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

Object.assign(window, { MLessonDetail, MPhrasebook, MPhrasebookPractice, MAddLanguage, MMockTest });
