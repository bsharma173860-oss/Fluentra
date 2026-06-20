// ── Module Results — Reading / Listening / Speaking / Writing ─────
const { useState: useStateMR } = React;

// Polyfill icon aliases & extras
if (!Icon.headphones) Icon.headphones = Icon.head;
if (!Icon.share) Icon.share = (p={}) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);

// Inline breadcrumb (keeps file self-contained)
function Crumbs({ items, accent }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:T.ink5, fontWeight:600, letterSpacing:'.04em' }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          <span style={{ color: i===items.length-1 ? T.ink3 : T.ink5 }}>{it}</span>
          {i < items.length-1 && <span style={{ color:T.ink5 }}>›</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

// Module config — each module has its own accent, content shape, and band card
const MODULES = {
  reading: {
    name: 'Reading',
    accent: T.reading.c,
    accentBg: T.reading.bg,
    icon: 'book',
    headerLabel: 'Reading Results',
    meta: ['IELTS Academic', 'Hard', '54m 12s', 'The Decline of Bees'],
    score: { type:'count', val:11, total:13, sub:'correct' },
    bandEst: 7.5,
    breakdownTitle:'Performance by passage',
    breakdown: [
      { label:'Passage 1 — Skim & Scan',    correct:5, total:5,  type:'Matching headings' },
      { label:'Passage 2 — Detail',          correct:4, total:4,  type:'Multiple choice' },
      { label:'Passage 3 — Inference',       correct:2, total:4,  type:'True / False / NG' },
    ],
  },
  listening: {
    name: 'Listening',
    accent: T.listening.c,
    accentBg: T.listening.bg,
    icon: 'headphones',
    headerLabel: 'Listening Results',
    meta: ['IELTS Academic', 'Medium', '32m 04s', '4 sections'],
    score: { type:'count', val:34, total:40, sub:'correct' },
    bandEst: 7.5,
    breakdownTitle:'Performance by section',
    breakdown: [
      { label:'Section 1 — Conversation', correct:9, total:10, type:'Form filling' },
      { label:'Section 2 — Monologue',     correct:9, total:10, type:'Map labelling' },
      { label:'Section 3 — Discussion',    correct:8, total:10, type:'Multiple choice' },
      { label:'Section 4 — Lecture',       correct:8, total:10, type:'Sentence completion' },
    ],
  },
  speaking: {
    name: 'Speaking',
    accent: T.speaking.c,
    accentBg: T.speaking.bg,
    icon: 'mic',
    headerLabel: 'Speaking Results',
    meta: ['IELTS Academic', 'Part 2', '11m 43s'],
    score: { type:'band', val:7.0, sub:'/9.0' },
    criteria: [
      { key:'Fluency & Coherence', short:'Fluency', val:7.5 },
      { key:'Lexical Resource',    short:'Lexical', val:7.0 },
      { key:'Grammatical Range',   short:'Grammar', val:6.5 },
      { key:'Pronunciation',       short:'Pronunc.',val:7.0 },
    ],
  },
  writing: {
    name: 'Writing',
    accent: T.writing.c,
    accentBg: T.writing.bg,
    icon: 'pen',
    headerLabel: 'Writing Results',
    meta: ['IELTS Academic','Task 2','38m 40s','328 words'],
    score: { type:'band', val:7.0, sub:'/9.0' },
    criteria: [
      { key:'Task Achievement',    short:'Task Ach.', val:7.0 },
      { key:'Coherence & Cohesion',short:'Coherence', val:7.5 },
      { key:'Lexical Resource',    short:'Lexical',   val:6.5 },
      { key:'Grammatical Range',   short:'Grammar',   val:7.0 },
    ],
  },
};

const RESULT_FEEDBACK = {
  'Fluency & Coherence': {
    summary:'Generally natural pace with some hesitation at complex ideas. Discourse markers connected ideas effectively.',
    good:'"Furthermore, this shows that..." — strong cohesive device',
    fix:[{ orig:'"Um... I think... it\'s, um, important"', sug:'Replace fillers with a brief pause or "well, I believe..."' }],
  },
  'Lexical Resource': {
    summary:'A satisfactory range of vocabulary. Some topic-specific terms were used effectively, though repetition occurred.',
    good:'"prevalent", "substantial impact", "noteworthy trend" — strong word choices',
    fix:[{ orig:'"very good" × 3 times', sug:'Vary: "exceptional", "remarkable", "outstanding"' }],
  },
  'Grammatical Range': {
    summary:'A mix of simple and complex structures. Errors were rare and rarely impeded communication.',
    good:'"Although technology has advanced rapidly, many still prefer..." — complex clause used well',
    fix:[{ orig:'"I have went to many places"', sug:'"I have been to many places" — past participle' }],
  },
  'Pronunciation': {
    summary:'Clear delivery with natural stress patterns. Word stress errors occasional but did not impede intelligibility.',
    good:'Clear sentence stress and intonation on key ideas.',
    fix:[{ orig:'"de-VE-lop" → wrong stress', sug:'"de-vel-op" — stress the second syllable' }],
  },
  'Task Achievement': {
    summary:'You addressed the main task with a clear position. Ideas are relevant and developed with some detail.',
    good:'Clear position stated in introduction and reinforced in conclusion.',
    fix:[{ orig:'"Technology have become essential..."', sug:'"Technology has become essential..." — subject-verb agreement' }],
  },
  'Coherence & Cohesion': {
    summary:'Paragraphs sequenced logically with a clear progression. Linking devices used, though some over-repeated.',
    good:'Strong topic sentences open each body paragraph.',
    fix:[{ orig:'"Furthermore... Furthermore... Furthermore..."', sug:'Vary: "Moreover", "In addition", "Additionally"' }],
  },
};

const SAMPLE_TRANSCRIPT = [
  { who:'examiner', text:'Tell me about a place you visited recently that left an impression on you.' },
  { who:'user',     text:"Sure. So I, um, recently went to Barcelona — it was, you know, my first time there. The architecture was just incredible." },
  { who:'examiner', text:'What specifically did you find most striking?' },
  { who:'user',     text:"Definitely the Sagrada Família. The way light filters through the stained glass — it was unlike anything I'd seen before. Furthermore, this shows that Gaudí had a deep sense of natural form." },
  { who:'examiner', text:'How did the visit change your perspective on architecture?' },
  { who:'user',     text:"It made me appreciate how spaces can shape emotion. Although technology has advanced rapidly, many still prefer hand-made craftsmanship for that reason." },
];

const SAMPLE_ESSAY = `In recent decades, technology has become essential in modern life, fundamentally reshaping how we work, learn, and communicate. While some argue that this dependence is excessive, I believe that, on balance, the benefits substantially outweigh the drawbacks.

Firstly, technology has dramatically improved access to information. A student in a rural village can now follow lectures from the world's top universities. Furthermore, this democratisation extends to healthcare, where remote diagnostics save lives in regions with limited specialist coverage.

However, this prevalence is not without cost. Excessive screen time has been linked to attention difficulties and reduced face-to-face interaction. The issue is widespread and affects many people, particularly young learners who struggle to focus for long periods.

In conclusion, although technology brings noteworthy challenges, careful and intentional use makes it a powerful force for good. The solution is not to reject the tools, but to develop the habits that govern how we use them.`;

// Reusable score color helper
const scoreColor = v => v >= 7 ? T.listening.c : v >= 5.5 ? T.writing.c : T.brand;

// Reusable criterion bar (used for breakdown)
function CriterionBar({ label, type, correct, total, accent }) {
  const pct = total > 0 ? (correct/total)*100 : 0;
  const ok = correct === total;
  return (
    <div style={{ padding:'12px 0', borderBottom:`1px solid ${T.hairline}` }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{label}</div>
          {type && <div style={{ fontSize:11, color:T.ink4 }}>{type}</div>}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontFamily:T.serif, fontSize:18, color:ok?T.listening.c:accent }}>{correct}</span>
          <span style={{ fontSize:11, color:T.ink4 }}>/ {total}</span>
        </div>
      </div>
      <div style={{ height:5, background:T.bg2, borderRadius:3, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background:ok?T.listening.c:accent, borderRadius:3 }}/>
      </div>
    </div>
  );
}

// Per-criterion feedback card (Speaking + Writing)
function CriterionCard({ name, value, accent }) {
  const fb = RESULT_FEEDBACK[name];
  if (!fb) return null;
  return (
    <Card padding={22} style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{name}</div>
        <div style={{ background:scoreColor(value)+'18', color:scoreColor(value), padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:700 }}>{value.toFixed(1)}</div>
      </div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:12 }}>{fb.summary}</div>
      {/* Good usage */}
      <div style={{ background:T.listening.bg, borderLeft:`3px solid ${T.listening.c}`, padding:'10px 12px', borderRadius:4, marginBottom:8 }}>
        <div style={{ fontSize:10, color:T.listening.c, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>What worked</div>
        <div style={{ fontSize:12.5, color:T.ink2, lineHeight:1.5 }}>{fb.good}</div>
      </div>
      {/* Fixes */}
      {fb.fix.map((f,i) => (
        <div key={i} style={{ background:T.writing.bg, borderLeft:`3px solid ${T.writing.c}`, padding:'10px 12px', borderRadius:4, marginBottom:i<fb.fix.length-1?8:0 }}>
          <div style={{ fontSize:10, color:T.writing.c, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>Fix this</div>
          <div style={{ fontSize:12.5, color:T.writing.c, fontWeight:600, marginBottom:3 }}>{f.orig}</div>
          <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5 }}>→ {f.sug}</div>
        </div>
      ))}
    </Card>
  );
}

// Question review row (Reading / Listening)
const SAMPLE_QS = [
  { n:1,  type:'Matching headings', q:"Paragraph A best matches with which heading?",         user:'iv',  correct:'iv',  ok:true },
  { n:2,  type:'Matching headings', q:"Paragraph B best matches with which heading?",         user:'ii',  correct:'ii',  ok:true },
  { n:3,  type:'Matching headings', q:"Paragraph C best matches with which heading?",         user:'vi',  correct:'vi',  ok:true },
  { n:6,  type:'Multiple choice',   q:"What is the writer's main concern in paragraph 4?",     user:'B',   correct:'B',   ok:true },
  { n:9,  type:'Multiple choice',   q:"Which two factors does the writer mention?",            user:'A,C', correct:'A,C', ok:true },
  { n:11, type:'True / False / NG', q:"The decline began in the 1990s, according to research.", user:'False',correct:'True', ok:false, why:'Para 6 line 3: "...first observed in 1989" — within the 1980s." So the statement is False but the corrected band is "Not Given" depending on interpretation.' },
  { n:12, type:'True / False / NG', q:"All bee species are equally affected by pesticide use.", user:'',     correct:'False', ok:false, why:'You left this blank. The passage states "honey bees are disproportionately affected" — so "All… equally" is False.' },
];

function QReview({ q, accent }) {
  return (
    <div style={{ background:q.ok?T.listening.bg:T.brandLight, border:`1px solid ${q.ok?'#A8DFC4':'#F0C8A0'}`, borderRadius:11, padding:14, marginBottom:8 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:10 }}>
        <div style={{ width:22, height:22, borderRadius:11, background:q.ok?T.listening.c:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:11, flexShrink:0, marginTop:1 }}>{q.ok?'✓':'✕'}</div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:3 }}>Q{q.n} · {q.type}</div>
          <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{q.q}</div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, paddingLeft:32 }}>
        <div style={{ flex:1, background:'rgba(255,255,255,.7)', borderRadius:7, padding:'7px 10px' }}>
          <div style={{ fontSize:9.5, color:T.ink5, fontWeight:600, textTransform:'uppercase', marginBottom:2 }}>Your answer</div>
          <div style={{ fontSize:13, fontWeight:700, color:q.ok?T.ink:T.brand }}>{q.user || '(blank)'}</div>
        </div>
        {!q.ok && (
          <div style={{ flex:1, background:'rgba(255,255,255,.85)', borderRadius:7, padding:'7px 10px' }}>
            <div style={{ fontSize:9.5, color:T.ink5, fontWeight:600, textTransform:'uppercase', marginBottom:2 }}>Correct</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.listening.c }}>{q.correct}</div>
          </div>
        )}
      </div>
      {!q.ok && q.why && (
        <div style={{ marginTop:10, marginLeft:32, padding:'8px 10px', background:'rgba(255,255,255,.55)', borderTop:`1px solid rgba(0,0,0,.06)`, fontSize:12, color:T.ink3, lineHeight:1.55, borderRadius:7 }}>
          {q.why}
        </div>
      )}
    </div>
  );
}

// Leaderboard row
const SAMPLE_LB = [
  { rank:489, name:'Priya S.',  score:'+1', user:false },
  { rank:490, name:'Ahmed K.',  score:'+1', user:false },
  { rank:491, name:'You',        score:'',   user:true  },
  { rank:492, name:'María L.',  score:'-1', user:false },
  { rank:493, name:'James T.',  score:'-1', user:false },
];

function MiniLeaderboard({ accent, base, total='13' }) {
  return (
    <div>
      {SAMPLE_LB.map((row,i) => (
        <div key={row.rank} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, background:row.user?T.brandLight:'transparent', marginBottom:i<SAMPLE_LB.length-1?2:0 }}>
          <div style={{ fontSize:12, fontWeight:row.user?700:500, color:row.user?accent:T.ink4, width:46 }}>#{row.rank}</div>
          <div style={{ flex:1, fontSize:13, fontWeight:row.user?700:400, color:row.user?T.ink:T.ink3 }}>{row.name}</div>
          <div style={{ fontSize:13, fontWeight:row.user?700:600, color:row.user?accent:T.ink3 }}>{row.user?base:base+(row.score?` ${row.score}`:'')}{row.user||row.score?` / ${total}`:''}</div>
        </div>
      ))}
    </div>
  );
}

// ═══ desktop ═══════════════════════════════════════════════
function _lastResult(){ return (typeof window!=='undefined' && window.__lastResult) || null; }
function _critEntries(R){ return (R && R.criteria) ? Object.keys(R.criteria).filter(function(k){return typeof R.criteria[k]==='number';}).map(function(k){return { key:k.replace(/_/g,' '), val:R.criteria[k] };}) : []; }

function ModuleResultsPage() {
  const R = _lastResult();
  const mod = (R && R.module) || 'reading';
  const M = MODULES[mod] || MODULES.reading;
  const isBand = R ? R.kind === 'band' : (mod==='speaking'||mod==='writing');
  const pct = R && R.pct != null ? R.pct : (R && R.total ? Math.round((R.correct/R.total)*100) : null);
  const band = R && R.band != null ? Number(R.band) : null;
  const crit = _critEntries(R);
  React.useEffect(function () {
    if (!R) return;
    var sc = isBand ? Math.round((Number(band) || 0) / 9 * 100) : (pct != null ? pct : null);
    try { if (window.FL && window.FL.social) window.FL.social.logActivity('lesson', R.lang || window.__langCode || 'en', { module: mod, score: sc }); } catch (e) {}
  }, []);
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:760, margin:'0 auto', padding:'32px 36px 56px' }}>
          <Crumbs items={[M.name, 'Session results']} accent={M.accent}/>
          <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.05, margin:'10px 0 20px' }}>{M.headerLabel}</div>

          {!R && (
            <Card padding={22} style={{ marginBottom:16 }}>
              <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6 }}>No recent session found. Finish a practice session and your results will appear here.</div>
            </Card>
          )}

          <div style={{ background: mod==='writing'?T.ink:M.accent, borderRadius:18, padding:'30px 32px', color:'#fff', marginBottom:16 }}>
            <Chip label={M.name + ' score'} accent="rgba(255,255,255,.85)" bg="rgba(255,255,255,.12)" style={{ marginBottom:14 }}/>
            {isBand ? (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
                <span style={{ fontFamily:T.serif, fontSize:64, lineHeight:1 }}>{band != null ? band.toFixed(1) : '—'}</span>
                <span style={{ fontSize:18, color:'rgba(255,255,255,.55)', marginBottom:10 }}>/ 9.0 band</span>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'flex-end', gap:8 }}>
                <span style={{ fontFamily:T.serif, fontSize:64, lineHeight:1 }}>{R && R.correct != null ? R.correct : '—'}</span>
                <span style={{ fontSize:18, color:'rgba(255,255,255,.55)', marginBottom:10 }}>/ {R && R.total != null ? R.total : '—'} correct{pct!=null?(' \u00b7 '+pct+'%'):''}</span>
              </div>
            )}
            {isBand && crit.length > 0 && (
              <div style={{ display:'flex', gap:8, paddingTop:16, marginTop:16, borderTop:'1px solid rgba(255,255,255,.15)' }}>
                {crit.map(function(c){ return (
                  <div key={c.key} style={{ flex:1, textAlign:'center' }}>
                    <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, marginBottom:4 }}>{Number(c.val).toFixed(1)}</div>
                    <div style={{ fontSize:9.5, color:'rgba(255,255,255,.6)', textTransform:'capitalize' }}>{c.key}</div>
                  </div>
                ); })}
              </div>
            )}
          </div>

          {isBand && crit.length > 0 && (
            <>
              <div style={{ fontSize:16, fontWeight:700, color:T.ink, margin:'8px 0 12px' }}>Per-criterion feedback</div>
              {crit.map(function(c){ return <CriterionCard key={c.key} name={c.key} value={c.val} accent={M.accent}/>; })}
            </>
          )}

          {mod==='writing' && R && Array.isArray(R.corrections) && R.corrections.length > 0 && (
            <Card padding={20} style={{ marginTop:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:10 }}>Corrections</div>
              {R.corrections.map(function(c,i){ return (
                <div key={i} style={{ padding:'8px 12px', borderRadius:9, background:T.bg2, marginBottom:6, fontSize:12.5, lineHeight:1.5 }}>
                  <span style={{ color:'#dc2626', textDecoration:'line-through' }}>{c.original}</span>{' \u2192 '}<span style={{ color:'#16a34a', fontWeight:600 }}>{c.better}</span>
                  {c.why && <div style={{ fontSize:11, color:T.ink3, marginTop:3 }}>{c.why}</div>}
                </div>
              ); })}
            </Card>
          )}

          <div style={{ display:'flex', gap:10, marginTop:22 }}>
            <Btn label="Practice again" accent={M.accent} onClick={function(){ window.__nav && window.__nav(mod); }}/>
            <Btn label="Back to dashboard" variant="outline" accent={T.ink2} onClick={function(){ window.__nav && window.__nav('dashboard'); }}/>
          </div>
        </div>
      </div>
    </div>
  );
}

function MModuleResultsPage() {
  const R = _lastResult();
  const mod = (R && R.module) || 'reading';
  const M = MODULES[mod] || MODULES.reading;
  const isBand = R ? R.kind === 'band' : (mod==='speaking'||mod==='writing');
  const pct = R && R.pct != null ? R.pct : (R && R.total ? Math.round((R.correct/R.total)*100) : null);
  const band = R && R.band != null ? Number(R.band) : null;
  const crit = _critEntries(R);
  return (
    <MobileBody>
      <div style={{ padding:'20px 18px 40px' }}>
        <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, marginBottom:16 }}>{M.headerLabel}</div>
        <div style={{ background: mod==='writing'?T.ink:M.accent, borderRadius:16, padding:'24px 22px', color:'#fff', marginBottom:16 }}>
          {isBand ? (
            <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
              <span style={{ fontFamily:T.serif, fontSize:48, lineHeight:1 }}>{band!=null?band.toFixed(1):'—'}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,.6)', marginBottom:8 }}>/ 9.0</span>
            </div>
          ) : (
            <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
              <span style={{ fontFamily:T.serif, fontSize:48, lineHeight:1 }}>{R&&R.correct!=null?R.correct:'—'}</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,.6)', marginBottom:8 }}>/ {R&&R.total!=null?R.total:'—'}{pct!=null?(' \u00b7 '+pct+'%'):''}</span>
            </div>
          )}
          {isBand && crit.length>0 && (
            <div style={{ display:'flex', gap:6, paddingTop:12, marginTop:12, borderTop:'1px solid rgba(255,255,255,.15)' }}>
              {crit.map(function(c){ return <div key={c.key} style={{ flex:1, textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:17 }}>{Number(c.val).toFixed(1)}</div><div style={{ fontSize:8.5, color:'rgba(255,255,255,.6)', textTransform:'capitalize' }}>{c.key}</div></div>; })}
            </div>
          )}
        </div>
        <Btn label="Practice again" accent={M.accent} fullWidth onClick={function(){ window.__nav && window.__nav(mod); }}/>
        <div style={{ height:8 }}/>
        <Btn label="Back to dashboard" variant="outline" accent={T.ink2} fullWidth onClick={function(){ window.__nav && window.__nav('dashboard'); }}/>
      </div>
    </MobileBody>
  );
}

Object.assign(window, { ModuleResultsPage, MModuleResultsPage });
