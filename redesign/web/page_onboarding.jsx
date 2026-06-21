// ── Onboarding flow: goals → motivation → schedule → placement → plan ──
const { useState: useStateOB, useEffect: useEffectOB } = React;

// Step manifest
const OB_STEPS = [
  { id:'welcome',   label:'Welcome' },
  { id:'language',  label:'Language' },
  { id:'goal',      label:'Goal' },
  { id:'reason',    label:'Why' },
  { id:'level',     label:'Level' },
  { id:'placement', label:'Placement' },
  { id:'schedule',  label:'Schedule' },
  { id:'plan',      label:'Your plan' },
];

const OB_LANGS = [
  { code:'es', flag:'es', label:'Spanish',    sub:'+82M learners worldwide' },
  { code:'fr', flag:'fr', label:'French',     sub:'+58M learners' },
  { code:'de', flag:'de', label:'German',     sub:'+46M learners' },
  { code:'ja', flag:'jp', label:'Japanese',   sub:'+34M learners' },
  { code:'it', flag:'it', label:'Italian',    sub:'+22M learners' },
  { code:'pt', flag:'pt', label:'Portuguese', sub:'+18M learners' },
  { code:'ko', flag:'kr', label:'Korean',     sub:'+15M learners' },
  { code:'zh', flag:'cn', label:'Mandarin',   sub:'Most spoken language' },
];

const OB_GOALS = [
  { id:'travel',    label:'Travel & culture',     sub:'Order food, ask directions, make friends abroad', icon:'🗺' },
  { id:'work',      label:'Work & career',        sub:'Meetings, emails, professional fluency', icon:'💼' },
  { id:'exam',      label:'Exam preparation',     sub:'IELTS, TOEFL, DELF, JLPT and more', icon:'🎓' },
  { id:'family',    label:'Family & relationships', sub:'Talk to a partner, kids, or in-laws', icon:'❤️' },
  { id:'media',     label:'Movies, books, music', sub:'Watch and read in the original language', icon:'🎬' },
  { id:'brain',     label:'Brain training',       sub:'Just for fun and mental sharpness', icon:'🧠' },
];

const OB_REASONS = [
  'I want to think and dream in another language',
  'It feels like a personal achievement',
  'I want my kids to grow up bilingual',
  'I\'m moving to a new country',
  'It opens up career opportunities',
  'I love learning new skills',
];

const OB_LEVELS = [
  { id:'A0', label:'Total beginner',   sub:'I know a few words at most',           hours:'0–20 hr',    color:T.reading?.c || T.brand },
  { id:'A1', label:'Beginner',         sub:'Hello, thank you, simple sentences',   hours:'20–60 hr',   color:T.reading?.c || T.brand },
  { id:'A2', label:'Elementary',       sub:'I can survive a basic conversation',   hours:'60–150 hr',  color:T.listening?.c || '#1A8F4E' },
  { id:'B1', label:'Intermediate',     sub:'I can discuss familiar topics',        hours:'150–300 hr', color:T.listening?.c || '#1A8F4E' },
  { id:'B2', label:'Upper-intermediate', sub:'I follow most conversations',        hours:'300–500 hr', color:T.speaking?.c || '#5B4FE2' },
  { id:'C1', label:'Advanced',         sub:'I express myself fluently and precisely', hours:'500+ hr',  color:T.writing?.c || '#C4503E' },
];

// Placement test questions (5 quick)
const OB_PLACEMENT = [
  { q:'Choose the correct article: __ manzana es roja.', opts:['El','La','Los','Las'], a:1, level:'A1' },
  { q:'"Yo ___ a la tienda ayer."', opts:['voy','iba','fui','iré'], a:2, level:'A2' },
  { q:'Which means "I had eaten"?', opts:['Comí','Había comido','He comido','Comería'], a:1, level:'B1' },
  { q:'Best translation: "Should you need anything…"', opts:['Si necesitas algo','Si necesitaras algo','Si necesitarías algo','Necesites algo'], a:1, level:'B2' },
  { q:'Pick the most natural register for a formal email opening.', opts:['¡Hola!','Estimado/a','Qué tal','Saludos cordiales'], a:1, level:'C1' },
];

const OB_SCHEDULES = [
  { id:'casual',   label:'Casual',   minutes:5,  sub:'5 min/day · ~1 hr per week',   tag:'Most flexible' },
  { id:'regular',  label:'Regular',  minutes:15, sub:'15 min/day · ~2 hr per week',  tag:'Most popular' },
  { id:'serious',  label:'Serious',  minutes:30, sub:'30 min/day · ~4 hr per week',  tag:'Best results' },
  { id:'intense',  label:'Intense',  minutes:60, sub:'60 min/day · ~7 hr per week',  tag:'Exam-ready' },
];

// ─────────────────────────────────────────────────────────
// helpers
function ProgressBar({ step, total }) {
  return (
    <div style={{ display:'flex', gap:5, alignItems:'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ flex:1, height:4, borderRadius:2, background: i <= step ? T.brand : T.hairline, transition:'background .25s' }}/>
      ))}
    </div>
  );
}

function StepShell({ step, total, eyebrow, title, sub, onBack, onNext, nextLabel='Continue', nextDisabled, children, wide=false, footer=null }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.bg2 }}>
      {/* Top bar */}
      <div style={{ padding:'18px 32px', display:'flex', alignItems:'center', gap:24, background:T.bg, borderBottom:`1px solid ${T.border}` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:8, background:T.brandGrad || T.brand, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontFamily:T.serif, fontWeight:700, fontSize:14 }}>F</div>
          <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>Fluentra</div>
        </div>
        <div style={{ flex:1 }}>
          <ProgressBar step={step} total={total}/>
        </div>
        <div style={{ fontSize:11.5, color:T.ink4, fontWeight:600 }}>Step {step+1} of {total}</div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflow:'auto', padding:'40px 32px' }}>
        <div style={{ maxWidth: wide ? 920 : 640, margin:'0 auto' }}>
          {eyebrow && <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>{eyebrow}</div>}
          <div style={{ fontFamily:T.serif, fontSize:38, color:T.ink, lineHeight:1.1, marginBottom:8 }}>{title}</div>
          {sub && <div style={{ fontSize:14.5, color:T.ink3, lineHeight:1.55, marginBottom:30, maxWidth:540 }}>{sub}</div>}
          {children}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:'16px 32px', borderTop:`1px solid ${T.border}`, background:T.bg, display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
        <button onClick={onBack} disabled={!onBack} style={{ padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:600, color: onBack ? T.ink2 : T.ink5, background:'transparent', cursor: onBack ? 'pointer' : 'default' }}>← Back</button>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {footer}
          <Btn label={nextLabel} accent={T.brand} onClick={onNext} style={{ opacity: nextDisabled ? .45 : 1, pointerEvents: nextDisabled ? 'none' : 'auto', minWidth:160 }}/>
        </div>
      </div>
    </div>
  );
}

// ────── individual steps ──────
function SWelcome({ onNext }) {
  return (
    <StepShell step={0} total={OB_STEPS.length} eyebrow="Welcome to Fluentra"
      title="Let's design a learning plan that actually fits your life."
      sub="Six quick questions and a 90-second placement check. We'll use your answers to build a personalised study plan and tune our AI tutor."
      onNext={onNext}
      nextLabel="Get started →">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginTop:14 }}>
        {[
          { k:'1', t:'Tell us your goal', d:'Travel, work, exam, family — different goals, different plans.' },
          { k:'2', t:'Take a quick check', d:'5 questions to find your level. Skip if you already know.' },
          { k:'3', t:'Get your plan', d:'Daily lessons calibrated to your time and target.' },
        ].map(s => (
          <Card key={s.k} padding={20}>
            <div style={{ fontFamily:T.serif, fontSize:32, color:T.brand, lineHeight:1, marginBottom:10 }}>0{s.k}</div>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:6 }}>{s.t}</div>
            <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5 }}>{s.d}</div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop:32, padding:'14px 18px', background:T.brandLight || T.bg2, borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
        <span style={{ width:36, height:36, borderRadius:18, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:17 }}>✦</span>
        <div style={{ flex:1, fontSize:13, color:T.ink2, lineHeight:1.5 }}>
          <strong style={{ color:T.ink }}>Average setup time:</strong> 4 minutes. You can adjust everything later in Settings.
        </div>
      </div>
    </StepShell>
  );
}

function SLanguage({ value, onChange, onNext, onBack }) {
  return (
    <StepShell step={1} total={OB_STEPS.length} wide eyebrow="Pick a language"
      title="What language do you want to learn?"
      sub="You can always add more later — many of our users learn 2 or 3 simultaneously."
      onBack={onBack} onNext={onNext} nextDisabled={!value}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
        {OB_LANGS.map(l => {
          const sel = value === l.code;
          return (
            <button key={l.code} onClick={() => onChange(l.code)}
              style={{ padding:18, borderRadius:14, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', cursor:'pointer', position:'relative' }}>
              <div style={{ width:42, height:30, borderRadius:5, overflow:'hidden', marginBottom:12, boxShadow:`0 0 0 1px ${T.hairline}` }}>
                {Flag ? <Flag code={l.flag} w={42} h={30} radius={5}/> : <div style={{ width:42, height:30, background:T.bg2 }}/>}
              </div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:3 }}>{l.label}</div>
              <div style={{ fontSize:11, color:T.ink4 }}>{l.sub}</div>
              {sel && <div style={{ position:'absolute', top:14, right:14, width:20, height:20, borderRadius:10, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11 }}>✓</div>}
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function SGoal({ value, onChange, onNext, onBack }) {
  return (
    <StepShell step={2} total={OB_STEPS.length} eyebrow="Your goal"
      title="Why are you learning?"
      sub="The more honest you are, the better we can tune your daily lessons. Pick the one that fits best — you can change it later."
      onBack={onBack} onNext={onNext} nextDisabled={!value}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {OB_GOALS.map(g => {
          const sel = value === g.id;
          return (
            <button key={g.id} onClick={() => onChange(g.id)}
              style={{ padding:'16px 18px', borderRadius:13, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, flexShrink:0 }}>{g.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:3 }}>{g.label}</div>
                <div style={{ fontSize:12, color:T.ink4, lineHeight:1.45 }}>{g.sub}</div>
              </div>
              <div style={{ width:20, height:20, borderRadius:10, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brand : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, flexShrink:0 }}>{sel && '✓'}</div>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function SReason({ values, onToggle, onNext, onBack }) {
  return (
    <StepShell step={3} total={OB_STEPS.length} eyebrow="Motivation"
      title="What keeps you going?"
      sub="Select up to 3. We'll surface these on hard days when you need a nudge — research shows learners who name their why are 4× more likely to stick with it."
      onBack={onBack} onNext={onNext} nextDisabled={values.length === 0}>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {OB_REASONS.map(r => {
          const sel = values.includes(r);
          const disabled = !sel && values.length >= 3;
          return (
            <button key={r} onClick={() => !disabled && onToggle(r)}
              style={{ padding:'14px 16px', borderRadius:12, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? .4 : 1, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:22, height:22, borderRadius:6, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brand : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:12 }}>{sel && '✓'}</div>
              <div style={{ fontSize:14, color:T.ink, fontWeight: sel ? 600 : 500 }}>{r}</div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop:16, fontSize:11.5, color:T.ink4 }}>{values.length} of 3 selected</div>
    </StepShell>
  );
}

function SLevel({ value, onChange, onNext, onBack, onSkipPlacement }) {
  return (
    <StepShell step={4} total={OB_STEPS.length} wide eyebrow="Current level"
      title="Where are you now?"
      sub="Pick honestly — this is the floor for your daily lessons, not a judgement. We'll fine-tune with a placement check next."
      onBack={onBack} onNext={onNext} nextDisabled={!value}
      footer={value ? <button onClick={onSkipPlacement} style={{ fontSize:12.5, color:T.ink3, fontWeight:600, textDecoration:'underline', cursor:'pointer' }}>Skip placement test</button> : null}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {OB_LEVELS.map(l => {
          const sel = value === l.id;
          return (
            <button key={l.id} onClick={() => onChange(l.id)}
              style={{ padding:'16px 18px', borderRadius:13, border:`1.5px solid ${sel ? l.color : T.border}`, background: sel ? `${l.color}10` : T.card, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:54, height:54, borderRadius:13, background: sel ? l.color : T.bg2, color: sel ? '#fff' : l.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:22, fontWeight:700, flexShrink:0, transition:'all .2s' }}>{l.id}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:3 }}>{l.label}</div>
                <div style={{ fontSize:12, color:T.ink4, lineHeight:1.45, marginBottom:4 }}>{l.sub}</div>
                <div style={{ fontSize:10.5, color:l.color, fontWeight:700, letterSpacing:'.05em' }}>{l.hours}</div>
              </div>
            </button>
          );
        })}
      </div>
    </StepShell>
  );
}

function SPlacement({ qIdx, answers, onAnswer, onNext, onBack, onSkip }) {
  const total = OB_PLACEMENT.length;
  const q = OB_PLACEMENT[qIdx];
  const ans = answers[qIdx];
  const allDone = answers.length === total && answers.every(a => a !== undefined);

  return (
    <StepShell step={5} total={OB_STEPS.length} eyebrow={`Placement check · ${qIdx+1} of ${total}`}
      title="Quick level check"
      sub="No grades, no judgement. Just enough signal to calibrate your starting lessons. Don't guess if you don't know — pick 'Not sure'."
      onBack={onBack} onNext={onNext} nextDisabled={!allDone}
      nextLabel={allDone ? 'See results →' : 'Continue'}
      footer={<button onClick={onSkip} style={{ fontSize:12.5, color:T.ink3, fontWeight:600, textDecoration:'underline', cursor:'pointer' }}>Skip the check</button>}>

      {/* Mini progress dots */}
      <div style={{ display:'flex', gap:7, marginBottom:24 }}>
        {OB_PLACEMENT.map((_, i) => {
          const done = answers[i] !== undefined;
          const active = i === qIdx;
          return <div key={i} style={{ width:active ? 28 : 10, height:10, borderRadius:5, background: done ? T.brand : (active ? T.ink2 : T.hairline), transition:'all .2s' }}/>;
        })}
      </div>

      <Card padding={28}>
        <div style={{ fontSize:11, color:T.brand, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Question {qIdx+1}</div>
        <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.3, marginBottom:24 }}>{q.q}</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {q.opts.map((opt, i) => {
            const sel = ans === i;
            return (
              <button key={i} onClick={() => onAnswer(qIdx, i)}
                style={{ padding:'14px 18px', borderRadius:11, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:24, height:24, borderRadius:12, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brand : 'transparent', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{String.fromCharCode(65+i)}</div>
                <div style={{ fontSize:14, color:T.ink, fontFamily: q.q.match(/[áéíóñü]/i) ? T.serif : 'inherit' }}>{opt}</div>
              </button>
            );
          })}
          <button onClick={() => onAnswer(qIdx, -1)} style={{ padding:'12px 18px', borderRadius:11, border:`1.5px dashed ${ans === -1 ? T.ink3 : T.border}`, background: ans === -1 ? T.bg2 : 'transparent', textAlign:'left', fontSize:13, color:T.ink4, fontStyle:'italic', cursor:'pointer' }}>Not sure — skip this one</button>
        </div>
      </Card>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14 }}>
        <button onClick={() => onAnswer(qIdx-1, undefined, qIdx-1)} disabled={qIdx===0} style={{ fontSize:12.5, color: qIdx===0 ? T.ink5 : T.ink3, fontWeight:600, cursor: qIdx===0 ? 'default' : 'pointer' }}>← Previous</button>
        <button onClick={() => onAnswer(qIdx, ans, qIdx+1)} disabled={ans === undefined || qIdx === total-1} style={{ fontSize:12.5, color: (ans === undefined || qIdx === total-1) ? T.ink5 : T.brand, fontWeight:700, cursor: (ans === undefined || qIdx === total-1) ? 'default' : 'pointer' }}>Next question →</button>
      </div>
    </StepShell>
  );
}

function SSchedule({ value, onChange, reminderTime, onReminderChange, onNext, onBack }) {
  return (
    <StepShell step={6} total={OB_STEPS.length} eyebrow="Daily commitment"
      title="How much time can you give it?"
      sub="Be realistic — consistency beats intensity. Most users start at 15 minutes and adjust later."
      onBack={onBack} onNext={onNext} nextDisabled={!value}>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:30 }}>
        {OB_SCHEDULES.map(s => {
          const sel = value === s.id;
          return (
            <button key={s.id} onClick={() => onChange(s.id)}
              style={{ padding:'16px 20px', borderRadius:13, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:18 }}>
              <div style={{ width:62, height:62, borderRadius:14, background: sel ? T.brand : T.bg2, color: sel ? '#fff' : T.ink, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, fontWeight:700 }}>{s.minutes}</div>
                <div style={{ fontSize:9, opacity:.8, marginTop:2, fontWeight:600 }}>MIN/DAY</div>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                  <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>{s.label}</div>
                  {s.tag && <Chip label={s.tag} accent={s.id === 'regular' ? T.brand : T.ink3} bg={s.id === 'regular' ? T.brandLight : T.bg2}/>}
                </div>
                <div style={{ fontSize:12.5, color:T.ink3 }}>{s.sub}</div>
              </div>
            </button>
          );
        })}
      </div>

      {value && (
        <Card padding={20}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Daily reminder</div>
          <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.5, marginBottom:14 }}>We'll send one notification a day at this time. Streak savers happen automatically.</div>
          <div style={{ display:'flex', gap:8 }}>
            {['07:00','08:30','12:30','18:00','21:00'].map(t => (
              <button key={t} onClick={() => onReminderChange(t)} style={{ flex:1, padding:'10px 8px', borderRadius:9, border:`1.5px solid ${reminderTime === t ? T.brand : T.border}`, background: reminderTime === t ? T.brandLight || T.bg2 : T.card, fontSize:13, fontWeight: reminderTime === t ? 700 : 500, color: reminderTime === t ? T.brand : T.ink2, cursor:'pointer' }}>{t}</button>
            ))}
          </div>
        </Card>
      )}
    </StepShell>
  );
}

function SPlan({ data, onFinish, onBack }) {
  const lang = OB_LANGS.find(l => l.code === data.language) || OB_LANGS[0];
  const goal = OB_GOALS.find(g => g.id === data.goal) || OB_GOALS[0];
  const sched = OB_SCHEDULES.find(s => s.id === data.schedule) || OB_SCHEDULES[1];
  const lvl = OB_LEVELS.find(l => l.id === data.placedLevel) || OB_LEVELS.find(l => l.id === data.level) || OB_LEVELS[0];

  // Compute target & duration
  const targetLevel = (() => {
    const order = ['A0','A1','A2','B1','B2','C1','C2'];
    const cur = order.indexOf(lvl.id);
    const goalLevel = data.goal === 'exam' ? 'C1' : data.goal === 'work' ? 'B2' : data.goal === 'travel' ? 'A2' : 'B1';
    return order.indexOf(goalLevel) > cur ? goalLevel : order[Math.min(cur+2, 6)];
  })();
  const weeksToTarget = Math.ceil((sched.id === 'casual' ? 60 : sched.id === 'regular' ? 28 : sched.id === 'serious' ? 16 : 10));

  return (
    <StepShell step={7} total={OB_STEPS.length} wide eyebrow="Your personalised plan"
      title={`Here's your plan for ${lang.label}.`}
      sub="Based on your answers, your level, and how active learners with similar goals progress. You can adjust any of this later."
      onBack={onBack} onNext={onFinish} nextLabel="Start my first lesson →">

      {/* Hero plan card */}
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14, marginBottom:14 }}>
        <Card padding={26} style={{ background:T.brandGrad ? T.brandGrad : T.brand, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:80, background:'rgba(255,255,255,.08)' }}/>
          <div style={{ position:'absolute', bottom:-50, right:30, width:120, height:120, borderRadius:60, background:'rgba(255,255,255,.05)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85, marginBottom:14 }}>You're starting at</div>
            <div style={{ fontFamily:T.serif, fontSize:64, lineHeight:1, marginBottom:6 }}>{lvl.id}</div>
            <div style={{ fontSize:14, opacity:.9, marginBottom:24 }}>{lvl.label}</div>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ flex:1, height:6, borderRadius:3, background:'rgba(255,255,255,.2)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:'30%', background:'#fff', borderRadius:3 }}/>
              </div>
              <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em' }}>→ {targetLevel}</span>
            </div>
            <div style={{ fontSize:12, opacity:.85, marginTop:8 }}>~{weeksToTarget} weeks at {sched.minutes} min/day</div>
          </div>
        </Card>

        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <Card padding={18}>
            <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Daily goal</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:4 }}>
              <span style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{sched.minutes}</span>
              <span style={{ fontSize:13, color:T.ink3 }}>min</span>
            </div>
            <div style={{ fontSize:11.5, color:T.ink4 }}>{sched.label} pace · reminder at {data.reminderTime || '08:30'}</div>
          </Card>
          <Card padding={18}>
            <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Your goal</div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
              <span style={{ fontSize:22 }}>{goal.icon}</span>
              <span style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{goal.label}</span>
            </div>
            <div style={{ fontSize:11.5, color:T.ink4, lineHeight:1.45 }}>Lessons biased toward this domain.</div>
          </Card>
        </div>
      </div>

      {/* Week 1 preview */}
      <Card padding={24} style={{ marginBottom:14 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:18 }}>
          <div>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>Your first week</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>What we'll cover, day by day</div>
          </div>
          <button style={{ fontSize:12, color:T.brand, fontWeight:700, cursor:'pointer' }}>Customise →</button>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:8 }}>
          {[
            { d:'Mon', t:'Greetings & introductions', m:'Reading' },
            { d:'Tue', t:'Numbers & telling time',     m:'Listening' },
            { d:'Wed', t:'Café conversations',         m:'Speaking' },
            { d:'Thu', t:'Asking for directions',      m:'Listening' },
            { d:'Fri', t:'Daily routine vocabulary',   m:'Reading' },
            { d:'Sat', t:'Mini-checkpoint',            m:'Mixed' },
            { d:'Sun', t:'Rest day · review',          m:'Light' },
          ].map((d, i) => {
            const moduleColors = { Reading: T.reading?.c || T.brand, Listening: T.listening?.c || '#1A8F4E', Speaking: T.speaking?.c || '#5B4FE2', Writing: T.writing?.c || '#C4503E', Mixed: T.ink3, Light: T.ink5 };
            const c = moduleColors[d.m];
            return (
              <div key={i} style={{ padding:14, borderRadius:11, background:T.bg2, border:`1px solid ${T.hairline}`, position:'relative' }}>
                <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>{d.d}</div>
                <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.35, marginBottom:10, minHeight:32 }}>{d.t}</div>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ width:6, height:6, borderRadius:3, background:c }}/>
                  <span style={{ fontSize:10, color:c, fontWeight:700, letterSpacing:'.04em' }}>{d.m}</span>
                </div>
                {i === 0 && <div style={{ position:'absolute', top:-6, right:-6, padding:'2px 6px', borderRadius:5, background:T.brand, color:'#fff', fontSize:9, fontWeight:700, letterSpacing:'.06em' }}>TODAY</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* What you'll get / motivations */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        <Card padding={20}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Built into your plan</div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { ic:'✦', t:'Adaptive difficulty',    s:'Lessons get harder as you improve.' },
              { ic:'❤︎', t:'Spaced repetition',     s:'We bring back words you forget.' },
              { ic:'☁︎', t:'Offline-ready',          s:'Continue learning on the train.' },
              { ic:'⚡', t:'AI tutor',                s:'Ask questions any time, in plain English.' },
            ].map(f => (
              <div key={f.t} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:28, height:28, borderRadius:9, background:T.bg2, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, flexShrink:0 }}>{f.ic}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:2 }}>{f.t}</div>
                  <div style={{ fontSize:12, color:T.ink4, lineHeight:1.45 }}>{f.s}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={20} style={{ background:T.bg2 }}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Your reasons</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {(data.reasons || []).slice(0,3).map(r => (
              <div key={r} style={{ padding:'10px 12px', borderRadius:9, background:T.card, border:`1px solid ${T.hairline}`, fontSize:12.5, color:T.ink2, fontStyle:'italic' }}>"{r}"</div>
            ))}
            {(!data.reasons || data.reasons.length === 0) && <div style={{ fontSize:12.5, color:T.ink4, fontStyle:'italic' }}>No reasons selected — that's okay.</div>}
          </div>
          <div style={{ marginTop:14, padding:'10px 12px', background:T.brandLight || T.card, borderRadius:9, fontSize:11.5, color:T.ink2, lineHeight:1.5 }}>
            <strong style={{ color:T.brand }}>We'll show these when you need them.</strong> Especially around day 5 — that's when motivation typically dips.
          </div>
        </Card>
      </div>
    </StepShell>
  );
}

// ─────────────────────────────────────────────────────────
// Main desktop page
function OnboardingPage() {
  const [step, setStep] = useStateOB(0);
  const [data, setData] = useStateOB({
    language: '', goal: '', reasons: [], level: '',
    placement: [], placedLevel: null,
    schedule: 'regular', reminderTime: '08:30',
  });
  const [pIdx, setPIdx] = useStateOB(0);

  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));
  const next = () => setStep(s => Math.min(s+1, OB_STEPS.length-1));
  const back = () => setStep(s => Math.max(0, s-1));

  // After placement, compute level
  const handlePlacementNext = () => {
    const correct = data.placement.reduce((acc, a, i) => acc + (a === OB_PLACEMENT[i].a ? 1 : 0), 0);
    const placedLevel = correct >= 5 ? 'C1' : correct >= 4 ? 'B2' : correct >= 3 ? 'B1' : correct >= 2 ? 'A2' : correct >= 1 ? 'A1' : 'A0';
    upd('placedLevel', placedLevel);
    next();
  };

  const onPAnswer = (idx, val, jumpTo) => {
    setData(d => {
      const np = [...(d.placement || [])];
      while (np.length <= idx) np.push(undefined);
      np[idx] = val;
      return { ...d, placement: np };
    });
    if (jumpTo !== undefined && jumpTo >= 0 && jumpTo < OB_PLACEMENT.length) setPIdx(jumpTo);
    else if (idx < OB_PLACEMENT.length - 1) setPIdx(idx + 1);
  };

  const finishOnboarding = function () {
    var go = function () { window.__nav && window.__nav('dashboard'); };
    try {
      var code = data.language;
      if (code && window.FL && window.FL.addLanguage && typeof LANGUAGES !== 'undefined' && LANGUAGES.find) {
        var meta = LANGUAGES.find(function (x) { return x.code === code; }) || { code: code };
        var lvl = data.placedLevel || data.level || 'A1';
        window.FL.addLanguage({ code: code, native: meta.native, english: meta.english, level: lvl, exam: meta.exam || 'IELTS' }).then(go).catch(go);
      } else { go(); }
    } catch (e) { go(); }
  };

  switch (step) {
    case 0: return <SWelcome onNext={next}/>;
    case 1: return <SLanguage value={data.language} onChange={v => upd('language', v)} onNext={next} onBack={back}/>;
    case 2: return <SGoal value={data.goal} onChange={v => upd('goal', v)} onNext={next} onBack={back}/>;
    case 3: return <SReason values={data.reasons} onToggle={r => upd('reasons', data.reasons.includes(r) ? data.reasons.filter(x => x !== r) : [...data.reasons, r])} onNext={next} onBack={back}/>;
    case 4: return <SLevel value={data.level} onChange={v => upd('level', v)} onNext={() => { if (data.language === 'es') { next(); } else { upd('placedLevel', data.level || 'A1'); setStep(6); } }} onBack={back} onSkipPlacement={() => { upd('placedLevel', data.level); setStep(6); }}/>;
    case 5: return <SPlacement qIdx={pIdx} answers={data.placement || []} onAnswer={onPAnswer} onNext={handlePlacementNext} onBack={back} onSkip={() => { upd('placedLevel', data.level); next(); }}/>;
    case 6: return <SSchedule value={data.schedule} onChange={v => upd('schedule', v)} reminderTime={data.reminderTime} onReminderChange={v => upd('reminderTime', v)} onNext={next} onBack={back}/>;
    case 7: return <SPlan data={data} onFinish={finishOnboarding} onBack={back}/>;
    default: return <SWelcome onNext={next}/>;
  }
}

// ─────────────────────────────────────────────────────────
// Mobile version — single column, focused
function MOBStep({ step, total, eyebrow, title, sub, onBack, onNext, nextLabel='Continue', nextDisabled, children, footer }) {
  return (
    <MobileBody noTabs>
      <div style={{ padding:'10px 16px 14px', borderBottom:`1px solid ${T.hairline}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <button onClick={onBack} disabled={!onBack} style={{ width:32, height:32, borderRadius:16, background: onBack ? T.bg2 : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', color: onBack ? T.ink2 : T.ink5, fontSize:16 }}>{onBack ? '←' : ''}</button>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:600 }}>{step+1} of {total}</div>
          <div style={{ width:32 }}/>
        </div>
        <ProgressBar step={step} total={total}/>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'24px 18px' }}>
        {eyebrow && <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
        <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.15, marginBottom:6 }}>{title}</div>
        {sub && <div style={{ fontSize:13, color:T.ink3, lineHeight:1.5, marginBottom:22 }}>{sub}</div>}
        {children}
      </div>
      <div style={{ padding:'12px 16px 14px', borderTop:`1px solid ${T.hairline}`, background:T.bg }}>
        {footer && <div style={{ marginBottom:8, textAlign:'center' }}>{footer}</div>}
        <Btn label={nextLabel} accent={T.brand} fullWidth onClick={onNext} style={{ opacity: nextDisabled ? .45 : 1, pointerEvents: nextDisabled ? 'none' : 'auto' }}/>
      </div>
    </MobileBody>
  );
}

function MOnboardingPage() {
  const [step, setStep] = useStateOB(0);
  const [data, setData] = useStateOB({ language:'', goal:'', reasons:[], level:'', placement:[], placedLevel:null, schedule:'regular', reminderTime:'08:30' });
  const [pIdx, setPIdx] = useStateOB(0);
  const upd = (k,v) => setData(d => ({...d, [k]:v}));
  const next = () => setStep(s => Math.min(s+1, 7));
  const back = () => setStep(s => Math.max(0, s-1));

  if (step === 0) return (
    <MOBStep step={0} total={8} eyebrow="Welcome" title="Let's design your plan" sub="Six quick questions and a 90-second placement check." onNext={next} nextLabel="Get started →">
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {[
          { k:'1', t:'Tell us your goal', d:'Travel, work, exam, family.' },
          { k:'2', t:'Quick level check',  d:'5 questions. Skip if you know.' },
          { k:'3', t:'Get your plan',      d:'Daily lessons calibrated to you.' },
        ].map(s => (
          <Card key={s.k} padding={14}>
            <div style={{ display:'flex', gap:14, alignItems:'center' }}>
              <div style={{ width:38, height:38, borderRadius:10, background:T.brandLight || T.bg2, color:T.brand, fontFamily:T.serif, fontSize:18, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>0{s.k}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginBottom:2 }}>{s.t}</div>
                <div style={{ fontSize:12, color:T.ink4 }}>{s.d}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </MOBStep>
  );

  if (step === 1) return (
    <MOBStep step={1} total={8} eyebrow="Pick a language" title="What do you want to learn?" sub="You can add more later." onBack={back} onNext={next} nextDisabled={!data.language}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {OB_LANGS.map(l => {
          const sel = data.language === l.code;
          return (
            <button key={l.code} onClick={() => upd('language', l.code)} style={{ padding:14, borderRadius:12, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left' }}>
              <div style={{ width:36, height:26, borderRadius:4, overflow:'hidden', marginBottom:8, boxShadow:`0 0 0 1px ${T.hairline}` }}>{Flag ? <Flag code={l.flag} w={36} h={26} radius={4}/> : null}</div>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{l.label}</div>
              <div style={{ fontSize:10.5, color:T.ink4 }}>{l.sub}</div>
            </button>
          );
        })}
      </div>
    </MOBStep>
  );

  if (step === 2) return (
    <MOBStep step={2} total={8} eyebrow="Your goal" title="Why are you learning?" sub="Pick the one that fits best." onBack={back} onNext={next} nextDisabled={!data.goal}>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {OB_GOALS.map(g => {
          const sel = data.goal === g.id;
          return (
            <button key={g.id} onClick={() => upd('goal', g.id)} style={{ padding:'12px 14px', borderRadius:12, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:40, height:40, borderRadius:10, background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{g.icon}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:2 }}>{g.label}</div>
                <div style={{ fontSize:11, color:T.ink4, lineHeight:1.4 }}>{g.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </MOBStep>
  );

  if (step === 3) return (
    <MOBStep step={3} total={8} eyebrow="Motivation" title="What keeps you going?" sub="Pick up to 3." onBack={back} onNext={next} nextDisabled={data.reasons.length===0}>
      <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
        {OB_REASONS.map(r => {
          const sel = data.reasons.includes(r);
          const dis = !sel && data.reasons.length >= 3;
          return (
            <button key={r} onClick={() => !dis && upd('reasons', sel ? data.reasons.filter(x => x!==r) : [...data.reasons, r])} style={{ padding:'12px 14px', borderRadius:11, border:`1.5px solid ${sel ? T.brand : T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', opacity: dis ? .4 : 1, display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${sel?T.brand:T.border}`, background: sel?T.brand:'transparent', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, flexShrink:0 }}>{sel && '✓'}</div>
              <div style={{ fontSize:12.5, color:T.ink }}>{r}</div>
            </button>
          );
        })}
      </div>
    </MOBStep>
  );

  if (step === 4) return (
    <MOBStep step={4} total={8} eyebrow="Current level" title="Where are you now?" sub="Pick honestly. We'll check next." onBack={back} onNext={() => { if (data.language === 'es') { next(); } else { upd('placedLevel', data.level || 'A1'); setStep(6); } }} nextDisabled={!data.level}
      footer={data.level ? <button onClick={() => { upd('placedLevel', data.level); setStep(6); }} style={{ fontSize:12, color:T.ink3, fontWeight:600, textDecoration:'underline' }}>Skip placement test</button> : null}>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {OB_LEVELS.map(l => {
          const sel = data.level === l.id;
          return (
            <button key={l.id} onClick={() => upd('level', l.id)} style={{ padding:'12px 14px', borderRadius:12, border:`1.5px solid ${sel ? l.color : T.border}`, background: sel ? `${l.color}10` : T.card, textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:44, height:44, borderRadius:11, background: sel ? l.color : T.bg2, color: sel ? '#fff' : l.color, fontFamily:T.serif, fontSize:18, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{l.id}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:1 }}>{l.label}</div>
                <div style={{ fontSize:11, color:T.ink4, lineHeight:1.4 }}>{l.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </MOBStep>
  );

  if (step === 5) {
    const q = OB_PLACEMENT[pIdx];
    const ans = data.placement[pIdx];
    const allDone = data.placement.length === OB_PLACEMENT.length && data.placement.every(a => a !== undefined);
    const handleNext = () => {
      if (allDone) {
        const correct = data.placement.reduce((acc, a, i) => acc + (a === OB_PLACEMENT[i].a ? 1 : 0), 0);
        upd('placedLevel', correct >= 5 ? 'C1' : correct >= 4 ? 'B2' : correct >= 3 ? 'B1' : correct >= 2 ? 'A2' : correct >= 1 ? 'A1' : 'A0');
        next();
      }
    };
    const onAns = (idx, v) => {
      setData(d => { const np = [...(d.placement||[])]; while(np.length <= idx) np.push(undefined); np[idx]=v; return {...d, placement:np}; });
      if (idx < OB_PLACEMENT.length-1) setPIdx(idx+1);
    };
    return (
      <MOBStep step={5} total={8} eyebrow={`Question ${pIdx+1} of ${OB_PLACEMENT.length}`} title="Quick level check" onBack={back} onNext={handleNext} nextDisabled={!allDone} nextLabel={allDone ? 'See results →' : 'Continue'}
        footer={<button onClick={() => { upd('placedLevel', data.level); next(); }} style={{ fontSize:12, color:T.ink3, fontWeight:600, textDecoration:'underline' }}>Skip the check</button>}>
        <div style={{ display:'flex', gap:5, marginBottom:18 }}>
          {OB_PLACEMENT.map((_, i) => {
            const done = data.placement[i] !== undefined;
            const active = i === pIdx;
            return <div key={i} style={{ flex: active ? 2 : 1, height:6, borderRadius:3, background: done ? T.brand : (active ? T.ink2 : T.hairline) }}/>;
          })}
        </div>
        <Card padding={18}>
          <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.35, marginBottom:18 }}>{q.q}</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {q.opts.map((opt, i) => {
              const sel = ans === i;
              return (
                <button key={i} onClick={() => onAns(pIdx, i)} style={{ padding:'12px 14px', borderRadius:10, border:`1.5px solid ${sel?T.brand:T.border}`, background: sel ? T.brandLight || T.bg2 : T.card, textAlign:'left', display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:22, height:22, borderRadius:11, border:`1.5px solid ${sel?T.brand:T.border}`, background: sel ? T.brand : 'transparent', color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{String.fromCharCode(65+i)}</div>
                  <div style={{ fontSize:13, color:T.ink }}>{opt}</div>
                </button>
              );
            })}
            <button onClick={() => onAns(pIdx, -1)} style={{ padding:'10px 14px', borderRadius:10, border:`1.5px dashed ${T.border}`, fontSize:12, color:T.ink4, fontStyle:'italic', textAlign:'left', background:'transparent' }}>Not sure — skip this one</button>
          </div>
        </Card>
      </MOBStep>
    );
  }

  if (step === 6) return (
    <MOBStep step={6} total={8} eyebrow="Daily commitment" title="How much time per day?" sub="Consistency beats intensity." onBack={back} onNext={next} nextDisabled={!data.schedule}>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {OB_SCHEDULES.map(s => {
          const sel = data.schedule === s.id;
          return (
            <button key={s.id} onClick={() => upd('schedule', s.id)} style={{ padding:'12px 14px', borderRadius:12, border:`1.5px solid ${sel?T.brand:T.border}`, background: sel?T.brandLight || T.bg2:T.card, textAlign:'left', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:50, height:50, borderRadius:12, background: sel?T.brand:T.bg2, color: sel?'#fff':T.ink, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1, fontWeight:700 }}>{s.minutes}</div>
                <div style={{ fontSize:8, opacity:.85, marginTop:2 }}>MIN</div>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{s.label}</div>
                <div style={{ fontSize:11, color:T.ink4 }}>{s.sub}</div>
              </div>
            </button>
          );
        })}
      </div>
    </MOBStep>
  );

  if (step === 7) {
    const lang = OB_LANGS.find(l => l.code === data.language) || OB_LANGS[0];
    const lvl = OB_LEVELS.find(l => l.id === data.placedLevel) || OB_LEVELS.find(l => l.id === data.level) || OB_LEVELS[0];
    const sched = OB_SCHEDULES.find(s => s.id === data.schedule);
    return (
      <MOBStep step={7} total={8} eyebrow="Your plan" title={`Plan for ${lang.label}`} onBack={back} onNext={function(){ var go=function(){ window.__nav && window.__nav('dashboard'); }; try { var code=data.language; if (code && window.FL && window.FL.addLanguage && typeof LANGUAGES!=='undefined' && LANGUAGES.find) { var meta=LANGUAGES.find(function(x){return x.code===code;})||{code:code}; var lvl=data.placedLevel||data.level||'A1'; window.FL.addLanguage({ code:code, native:meta.native, english:meta.english, level:lvl, exam:meta.exam||'IELTS' }).then(go).catch(go); } else { go(); } } catch(e){ go(); } }} nextLabel="Start my first lesson →">
        <Card padding={20} style={{ background:T.brand, color:'#fff', marginBottom:12, position:'relative', overflow:'hidden' }}>
          <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85, marginBottom:10 }}>You're starting at</div>
          <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1, marginBottom:4 }}>{lvl.id}</div>
          <div style={{ fontSize:13, opacity:.9, marginBottom:14 }}>{lvl.label}</div>
          <div style={{ height:5, borderRadius:3, background:'rgba(255,255,255,.2)', overflow:'hidden' }}>
            <div style={{ height:'100%', width:'30%', background:'#fff' }}/>
          </div>
        </Card>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:12 }}>
          <Card padding={14}>
            <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>Daily</div>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>{sched?.minutes}min</div>
            <div style={{ fontSize:11, color:T.ink4, marginTop:3 }}>at {data.reminderTime}</div>
          </Card>
          <Card padding={14}>
            <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>Goal</div>
            <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.1 }}>{(OB_GOALS.find(g => g.id===data.goal) || OB_GOALS[0]).label}</div>
          </Card>
        </div>
        <Card padding={16}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Your first week</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {[
              { d:'Mon', t:'Greetings & introductions',  m:'Reading',   today:true },
              { d:'Tue', t:'Numbers & telling time',     m:'Listening' },
              { d:'Wed', t:'Café conversations',         m:'Speaking' },
              { d:'Thu', t:'Asking for directions',      m:'Listening' },
              { d:'Fri', t:'Daily routine vocabulary',   m:'Reading' },
              { d:'Sat', t:'Mini-checkpoint',            m:'Mixed' },
              { d:'Sun', t:'Rest day · review',          m:'Light' },
            ].map(d => (
              <div key={d.d} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderTop:`1px solid ${T.hairline}` }}>
                <div style={{ width:36, fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.06em' }}>{d.d}</div>
                <div style={{ flex:1, fontSize:12, color:T.ink }}>{d.t}</div>
                {d.today && <Chip label="TODAY" accent={T.brand} bg={T.brandLight}/>}
              </div>
            ))}
          </div>
        </Card>
      </MOBStep>
    );
  }
}

Object.assign(window, { OnboardingPage, MOnboardingPage });
