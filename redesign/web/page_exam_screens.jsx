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
function ExamResults() {
  const rows = ((typeof window!=='undefined' && window.__results) ? window.__results : []).filter(function(r){ return r && r.detail && r.detail.module === 'mock_exam'; });
  rows.sort(function(a,b){ return new Date(b.updated_at) - new Date(a.updated_at); });
  const latest = rows[0] || null;
  const code = (latest && latest.lang) || window.__langCode || 'en';
  const langObj = (typeof langByCode==='function') ? langByCode(code) : { english: code };
  const MOD = {
    reading:   { c:T.reading,   ic:'book', title:'Reading'   },
    listening: { c:T.listening, ic:'head', title:'Listening' },
    speaking:  { c:T.speaking,  ic:'mic',  title:'Speaking'  },
    writing:   { c:T.writing,   ic:'pen',  title:'Writing'   },
  };
  const overall = latest ? (Number(latest.score)||0) : null;
  const sections = (latest && latest.detail && latest.detail.sections) || [];
  const dateStr = latest && latest.updated_at ? new Date(latest.updated_at).toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'}) : '';
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'40px 36px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          {!latest ? (
            <Card padding={28}>
              <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6 }}>No mock exam results yet. Take a full mock and your scored result will appear here. <span data-nav="exam_runner" style={{ color:T.brand, fontWeight:700, cursor:'pointer' }}>Take a mock →</span></div>
            </Card>
          ) : (
            <>
              <div style={{ background:T.ink, borderRadius:24, padding:'40px 44px', color:'#fff', marginBottom:28, display:'grid', gridTemplateColumns:'1fr auto', gap:32, alignItems:'center' }}>
                <div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>{langObj.english} mock exam{dateStr ? ' · ' + dateStr : ''}</div>
                  <div style={{ fontFamily:T.serif, fontSize:44, lineHeight:1.05, marginBottom:10 }}>Your results</div>
                  <div style={{ fontSize:14, color:'rgba(255,255,255,.7)', lineHeight:1.55 }}>Overall across {sections.length} {sections.length===1?'section':'sections'}.</div>
                </div>
                <div style={{ textAlign:'center' }}>
                  <Ring pct={overall} size={150} stroke={12} color={T.brand} trackColor="rgba(255,255,255,.1)">
                    <div style={{ fontFamily:T.serif, fontSize:52, color:'#fff', lineHeight:1 }}>{overall}<span style={{ fontSize:20, opacity:.5 }}>%</span></div>
                    <div style={{ fontSize:9, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginTop:4 }}>Overall</div>
                  </Ring>
                </div>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:28 }}>
                {sections.map(function(sec, i){
                  var m = MOD[sec.module] || { c:T.reading, ic:'book', title:sec.module };
                  var sc = Math.round(Number(sec.score)||0);
                  return (
                    <Card key={i} padding={22}>
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                        <div style={{ width:38, height:38, borderRadius:11, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[m.ic]({ width:16, height:16 })}</div>
                        <div style={{ flex:1, fontSize:13.5, fontWeight:700, color:T.ink }}>{m.title}</div>
                        <div style={{ fontFamily:T.serif, fontSize:32, color:m.c.c, lineHeight:1 }}>{sc}%</div>
                      </div>
                      <Bar pct={sc} color={m.c.c}/>
                    </Card>
                  );
                })}
              </div>

              <div style={{ display:'flex', gap:10 }}>
                <Btn label="Take another mock" accent={T.brand} onClick={function(){ window.__nav && window.__nav('exam_runner'); }}/>
                <Btn label="Back to exams" variant="outline" accent={T.ink2} onClick={function(){ window.__nav && window.__nav('exams'); }}/>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
const EXAM_SECTIONS = ['reading', 'listening', 'speaking', 'writing'];

function ExamRunner() {
  const code = window.__langCode || 'en';
  const _mode = window.__examMode || 'mock';
  const _modeLabel = _mode === 'monthly' ? 'Official exam' : _mode === 'practice' ? 'Practice' : 'Mock exam';
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
        <span style={{ fontWeight:700 }}>{_modeLabel}</span>
        <span style={{ opacity:.6 }}>Section {idx + 1} of {EXAM_SECTIONS.length} · {EXAM_SECTION_LABEL[mod]}{_mode === 'monthly' ? ' · scored' : ''}</span>
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
      var token = window.__authToken ? window.__authToken() : null;
      if (token) {
        window.__saveResult({ lang: lang, score: overall, detail: { module:'mock_exam', mode: (window.__examMode || 'mock'), official: (window.__examMode === 'monthly'), sections: results, unit: '/9' } });
        try { if (window.FL && window.FL.social) window.FL.social.logActivity('mock', lang, { score: overall }); } catch (e) {}
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

// Single-module practice drill — runs just the picked module's real session.
function PracticeRunner() {
  React.useEffect(function () { window.__exam = { active: false }; }, []);
  const mod = window.__practiceModule || 'reading';
  const Comp = window[EXAM_SECTION_COMP[mod]] || window.ReadingSession;
  return Comp ? <Comp/> : <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40, color:T.ink3 }}>Pick a module to practice.</div>;
}

Object.assign(window, {
  ExamEntry, ExamResults,
  MonthlyExamResults, MockExamResults, PracticeExamResults,
  ExamRunner, ExamRunnerResults, PracticeRunner,
});
