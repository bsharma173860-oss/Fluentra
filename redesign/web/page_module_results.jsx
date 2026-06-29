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

function CriterionCard({ name, value, accent }) {
  const fb = RESULT_FEEDBACK[name];
  if (!fb) return null;
  return (
    <Card padding={22} style={{ marginBottom:14 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
        <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{name}</div>
        <div style={{ background:scoreColor(value)+'18', color:scoreColor(value), padding:'4px 10px', borderRadius:6, fontSize:12, fontWeight:700 }}>{(Number(value)||0).toFixed(1)}</div>
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
                    <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, marginBottom:4 }}>{(Number(c.val)||0).toFixed(1)}</div>
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
