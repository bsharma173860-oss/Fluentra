// ── Mobile · v5 redesigns · Part 2 ────────────────────────────────
// Leaderboard · Course · Grammar · Help · Module Results · States · Onboarding · Marketing
// Same editorial vocabulary as part 1.

const useStateMV5b = React.useState;

// Local helpers (independent of part 1 — duplicated to avoid load-order coupling)
const V5b_pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b_dotgrid = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);
const V5b_label = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b_av = (initials, size=40, grad) => (
  <div style={{ width:size, height:size, borderRadius:size/2, background: grad || `linear-gradient(135deg, ${T.brand}, #7B4A2D)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:size*0.42, letterSpacing:'-.02em', flexShrink:0 }}>{initials}</div>
);

// ══════════════════════════════════════════════════════════════════
// LEADERBOARD · v5
// ══════════════════════════════════════════════════════════════════
function MLeaderboardPageV5() {
  const [scope, setScope] = useStateMV5b('global');
  const [time, setTime] = useStateMV5b('week');
  const board = [
    { rank:1, name:'Yuki Tanaka',     ini:'YT', xp:8420, dxp:'+420', grad:'linear-gradient(135deg,#D26890,#7C5BD6)', country:'JP' },
    { rank:2, name:'Marcus Chen',     ini:'MC', xp:8180, dxp:'+380', grad:'linear-gradient(135deg,#2A6FA0,#5A9C7A)', country:'US' },
    { rank:3, name:'Anaís Rodríguez', ini:'AR', xp:7960, dxp:'+360', grad:'linear-gradient(135deg,#D26890,#E08F4D)', country:'ES' },
    { rank:4, name:'Lin Wei',         ini:'LW', xp:7200, dxp:'+320', grad:'linear-gradient(135deg,#7C5BD6,#2A6FA0)', country:'CN' },
    { rank:5, name:'Sara Müller',     ini:'SM', xp:6890, dxp:'+295', grad:'linear-gradient(135deg,#E08F4D,#D26890)', country:'DE' },
    { rank:18, name:'María García',   ini:'MG', xp:4280, dxp:'+180', grad:T.brandGrad, country:'MX', me:true },
  ];
  const top3 = board.slice(0,3);
  const rest = board.slice(3);

  return (
    <>
      <MobileHeader title="Leaderboard"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b_pre eyebrow="THIS WEEK · UPDATES HOURLY" title="Leaderboard" lede="See where your XP this week ranks among friends, your country and the world."/>
        {/* Tabs */}
        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:10, border:`1px solid ${T.border}` }}>
          {[{id:'friends',l:'Friends'},{id:'country',l:'México'},{id:'global',l:'Global'}].map(t => {
            const a = scope === t.id;
            return <button key={t.id} onClick={()=>setScope(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>;
          })}
        </div>
        <div style={{ display:'flex', gap:6, marginBottom:14 }}>
          {[{id:'day',l:'Today'},{id:'week',l:'Week'},{id:'month',l:'Month'},{id:'all',l:'All-time'}].map(t => {
            const a = time === t.id;
            return <button key={t.id} onClick={()=>setTime(t.id)} style={{ flex:1, padding:'6px 8px', borderRadius:9, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink3, fontSize:11, fontWeight: a?700:600, border:`1px solid ${a ? T.ink : T.hairline}` }}>{t.l}</button>;
          })}
        </div>

        {/* Podium hero — dark */}
        <div style={{ background:T.ink, borderRadius:18, padding:'24px 14px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5b_dotgrid/>
          <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', alignItems:'end', gap:8 }}>
            {[1,0,2].map(idx => {
              const p = top3[idx]; const isWinner = idx === 0;
              return (
                <div key={p.name} style={{ textAlign:'center' }}>
                  <div style={{ position:'relative', display:'inline-block', marginBottom:8 }}>
                    {V5b_av(p.ini, isWinner ? 56 : 44, p.grad)}
                    <div style={{ position:'absolute', top:-7, right:-3, width:22, height:22, borderRadius:11, background: isWinner ? '#FFC859' : idx === 1 ? '#D5D8DC' : '#D8956C', color:'#1F1812', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:11, fontWeight:700 }}>{p.rank}</div>
                  </div>
                  <div style={{ fontSize:11, fontWeight:700, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name.split(' ')[0]}</div>
                  <div style={{ fontFamily:T.serif, fontSize: isWinner ? 18 : 14, color:'rgba(255,255,255,.8)', marginTop:2 }}>{(p.xp/1000).toFixed(1)}k</div>
                  <div style={{ fontSize:9.5, color:'#5A9C7A', fontWeight:700, marginTop:2 }}>{p.dxp}</div>
                </div>
              );
            })}
          </div>
        </div>

        {V5b_label('RANK 4–18')}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {rest.map((p, i) => (
            <div key={p.name} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background: p.me ? T.brandLight : 'transparent' }}>
              <div style={{ width:24, fontFamily:T.serif, fontSize:14, color: p.me ? T.brand : T.ink4, fontWeight:600, textAlign:'center' }}>{p.rank}</div>
              {V5b_av(p.ini, 32, p.grad)}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight: p.me ? 700 : 600, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{p.name}{p.me && <span style={{ fontSize:9.5, marginLeft:5, padding:'1px 6px', borderRadius:99, background:T.brand, color:'#fff', fontWeight:800, letterSpacing:'.05em' }}>YOU</span>}</div>
                <div style={{ fontSize:10, color:T.ink5, marginTop:1 }}>{p.country}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:T.serif, fontSize:14, color:T.ink }}>{p.xp.toLocaleString()}</div>
                <div style={{ fontSize:9.5, color:'#5A9C7A', fontWeight:700 }}>{p.dxp}</div>
              </div>
            </div>
          ))}
        </MCard>

        <div style={{ marginTop:14, padding:'14px 16px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:12 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.ink, lineHeight:1.5 }}>"You're 14 ranks from the top 5 — keep your daily streak going to climb fast."</div>
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// COURSE OVERVIEW · v5
// ══════════════════════════════════════════════════════════════════
function MCoursePageV5() {
  const [unit, setUnit] = useStateMV5b(2);
  const lang = (typeof window !== 'undefined' && window.__activeLang) || { name:'English', accent:T.brand, native:'English' };
  const units = [
    { i:1, title:'Foundations',     pct:100, status:'done',    lessons:8 },
    { i:2, title:'Daily life',      pct:62,  status:'active',  lessons:10 },
    { i:3, title:'Travel',          pct:0,   status:'locked',  lessons:9 },
    { i:4, title:'Work & study',    pct:0,   status:'locked',  lessons:11 },
    { i:5, title:'Culture & media', pct:0,   status:'locked',  lessons:8 },
    { i:6, title:'Advanced topics', pct:0,   status:'locked',  lessons:12 },
  ];
  const lessons = [
    { i:1, title:'Greetings & names',     min:'8 min',  state:'done' },
    { i:2, title:'At the café',           min:'12 min', state:'done' },
    { i:3, title:'Asking for directions', min:'14 min', state:'done' },
    { i:4, title:'Phone conversations',   min:'15 min', state:'done' },
    { i:5, title:'Weather & weekend',     min:'10 min', state:'done' },
    { i:6, title:'At the doctor',         min:'18 min', state:'active' },
    { i:7, title:'Shopping & money',      min:'14 min', state:'next' },
    { i:8, title:'Family & friends',      min:'12 min', state:'next' },
    { i:9, title:'Plans for tonight',     min:'16 min', state:'next' },
    { i:10,title:'Unit review',           min:'25 min', state:'next' },
  ];
  const totalDone = units.filter(u=>u.status==='done').length * 8 + 5;
  const totalAll = units.reduce((a,u)=>a+u.lessons,0);

  return (
    <>
      <MobileHeader title={`${lang.name} course`}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b_pre eyebrow={`${totalDone}/${totalAll} LESSONS · UNIT ${unit} OF 6`} title="Your course path" lede={`A structured path through ${lang.name} — six units, taught the way you'd learn from a great tutor.`}/>
        {/* Hero — current unit */}
        <div style={{ background:T.ink, borderRadius:18, padding:'18px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5b_dotgrid/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.16em', color:'rgba(255,255,255,.55)', marginBottom:8 }}>UNIT 2 · IN PROGRESS</div>
            <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:6 }}>Daily life</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', lineHeight:1.5, marginBottom:14 }}>Café orders, doctor visits, small talk and weekend plans — vocabulary and grammar you'll use every day.</div>
            <div style={{ height:5, background:'rgba(255,255,255,.16)', borderRadius:99, marginBottom:8 }}><div style={{ height:'100%', width:'62%', background:lang.accent, borderRadius:99 }}/></div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, color:'rgba(255,255,255,.65)', fontWeight:600 }}>
              <span>5 of 10 lessons</span><span>62% complete</span>
            </div>
          </div>
        </div>

        {V5b_label('UNITS')}
        <div style={{ display:'flex', gap:7, marginBottom:14, overflowX:'auto', WebkitOverflowScrolling:'touch', paddingBottom:4 }}>
          {units.map(u => {
            const a = u.i === unit; const locked = u.status === 'locked';
            return (
              <button key={u.i} onClick={()=>!locked && setUnit(u.i)} style={{ flexShrink:0, width:120, padding:'11px 12px', borderRadius:13, background: a ? T.card : T.bg2, border:`1.5px solid ${a ? lang.accent : T.hairline}`, opacity: locked ? .5 : 1, textAlign:'left' }}>
                <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:5 }}>UNIT {u.i}</div>
                <div style={{ fontSize:12, fontWeight:700, color:T.ink, lineHeight:1.2, marginBottom:8 }}>{u.title}</div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:9.5, color:T.ink4 }}>{u.lessons} lessons</span>
                  {u.status === 'done' && <span style={{ width:14, height:14, borderRadius:7, background:'#5A9C7A', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:8 }}>✓</span>}
                  {u.status === 'active' && <span style={{ fontSize:9, fontWeight:800, color:lang.accent, letterSpacing:'.05em' }}>{u.pct}%</span>}
                  {u.status === 'locked' && <span style={{ color:T.ink5, fontSize:10 }}>🔒</span>}
                </div>
              </button>
            );
          })}
        </div>

        {V5b_label(`LESSONS IN ${(units.find(u=>u.i===unit)||units[0]).title.toUpperCase()}`)}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {lessons.map((l, i) => {
            const done = l.state === 'done'; const active = l.state === 'active';
            return (
              <button key={l.i} onClick={()=>window.__nav && window.__nav('lesson_detail')} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent', position:'relative' }}>
                {active && <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:lang.accent }}/>}
                <div style={{ width:30, height:30, borderRadius:15, background: done ? '#E2EEDF' : active ? `${lang.accent}1a` : T.bg2, color: done ? '#5A9C7A' : active ? lang.accent : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13, fontWeight:600, flexShrink:0 }}>{done ? '✓' : l.i}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12.5, fontWeight: active ? 700 : 600, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{l.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{l.min}{active && ' · in progress'}</div>
                </div>
                <span style={{ color: active ? lang.accent : T.ink5, fontSize:18, fontWeight: active ? 700 : 400 }}>›</span>
              </button>
            );
          })}
        </MCard>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// GRAMMAR · v5
// ══════════════════════════════════════════════════════════════════
function MGrammarPageV5() {
  const [topic, setTopic] = useStateMV5b(null);
  const lang = (typeof window !== 'undefined' && window.__activeLang) || { name:'English', accent:T.brand };
  if (topic) {
    return (
      <>
        <MobileHeader back onBack={()=>setTopic(null)} title="Grammar"/>
        <MobileBody padding={[0,16,30]} tabBarPad={false}>
          <V5b_pre eyebrow="GRAMMAR · INTERMEDIATE" title={topic.title} lede={topic.lede}/>
          <MCard style={{ padding:'14px 16px', marginBottom:12 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', marginBottom:8 }}>RULE</div>
            <div style={{ fontSize:13, color:T.ink, lineHeight:1.55 }}>{topic.rule}</div>
          </MCard>
          {topic.examples.map((e, i) => (
            <MCard key={i} style={{ padding:'12px 14px', marginBottom:8 }}>
              <div style={{ fontSize:9, fontWeight:800, color:lang.accent, letterSpacing:'.14em', marginBottom:4 }}>EXAMPLE {i+1}</div>
              <div style={{ fontFamily:T.serif, fontSize:15, color:T.ink, lineHeight:1.4, marginBottom:5 }}>{e.s}</div>
              <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink3 }}>"{e.t}"</div>
            </MCard>
          ))}
          <button onClick={()=>window.__nav && window.__nav('mod_writing')} style={{ width:'100%', padding:'13px', borderRadius:12, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40`, marginTop:8 }}>Practice this rule</button>
        </MobileBody>
      </>
    );
  }
  const cats = [
    { title:'Verb tenses',    n:18, ic:'pen',  c:T.writing.c, bg:T.writing.bg, sub:'Past, present, future' },
    { title:'Conditionals',   n:6,  ic:'spark',c:'#7C5BD6',   bg:'#EFEBFB',     sub:'If/when/unless' },
    { title:'Prepositions',   n:14, ic:'pin',  c:'#2A6FA0',   bg:'#E1ECF6',     sub:'In, on, at, with' },
    { title:'Articles',       n:5,  ic:'book', c:'#5A9C7A',   bg:'#E2EEDF',     sub:'a / an / the / ∅' },
    { title:'Modal verbs',    n:9,  ic:'mic',  c:'#D26890',   bg:'#F9E6EE',     sub:'Can, must, should' },
    { title:'Sentence types', n:7,  ic:'pen',  c:'#E08F4D',   bg:'#FEF3E5',     sub:'Statements, questions' },
  ];
  const sample = [
    { title:'Present perfect vs simple past', lede:'When the action still affects now vs when it\'s closed.', rule:'Use present perfect when there\'s a connection to now (experience, recent past, ongoing); simple past for finished actions at a specific time.', examples:[{s:'I have lived here for 5 years', t:'still living here now'},{s:'I lived in Paris in 2018', t:'finished, specific time'},] },
  ];

  return (
    <>
      <MobileHeader title={`${lang.name} grammar`} right={<button style={{ width:34, height:34, borderRadius:17, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.search({width:13,height:13})}</button>}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b_pre eyebrow="59 RULES · 9 CATEGORIES" title="Grammar reference" lede={`Search rules, see real examples, then practice them in writing — all the ${lang.name} grammar you'll need.`}/>
        {/* Search box */}
        <div style={{ position:'relative', marginBottom:14 }}>
          <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search({width:14,height:14})}</div>
          <input placeholder="e.g. past perfect, conditionals…" style={{ width:'100%', padding:'12px 14px 12px 38px', borderRadius:12, background:T.card, border:`1px solid ${T.hairline}`, fontSize:13, color:T.ink, outline:'none', boxShadow:MT.shadowSm }}/>
        </div>

        {V5b_label('CATEGORIES')}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {cats.map(c => (
            <button key={c.title} onClick={()=>setTopic(sample[0])} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, padding:'13px 13px', textAlign:'left', boxShadow:MT.shadowSm }}>
              <div style={{ width:32, height:32, borderRadius:9, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:9 }}>{Icon[c.ic] ? Icon[c.ic]({width:13,height:13}) : Icon.book({width:13,height:13})}</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:3 }}>{c.title}</div>
              <div style={{ fontSize:10.5, color:T.ink4, lineHeight:1.35, marginBottom:6 }}>{c.sub}</div>
              <div style={{ fontSize:9.5, color:c.c, fontWeight:800, letterSpacing:'.05em' }}>{c.n} RULES</div>
            </button>
          ))}
        </div>

        {V5b_label('FREQUENTLY VIEWED')}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {['Present perfect vs simple past','Subjunctive mood','When to use "the"','Reported speech'].map((s, i) => (
            <button key={s} onClick={()=>setTopic(sample[0])} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent' }}>
              <div style={{ width:26, height:26, borderRadius:7, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:11, fontWeight:600 }}>{i+1}</div>
              <div style={{ flex:1, fontSize:12.5, fontWeight:600, color:T.ink }}>{s}</div>
              <span style={{ color:T.ink5, fontSize:18 }}>›</span>
            </button>
          ))}
        </MCard>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// HELP · v5
// ══════════════════════════════════════════════════════════════════
function MHelpPageV5() {
  const [openF, setOpenF] = useStateMV5b(0);
  const cats = [
    { t:'Getting started',  n:8,  ic:'spark', c:T.brand,    bg:T.brandLight },
    { t:'Account & billing',n:12, ic:'card',  c:'#7C5BD6',  bg:'#EFEBFB' },
    { t:'Lessons & practice', n:14, ic:'book',c:'#2A6FA0',  bg:'#E1ECF6' },
    { t:'Exams & scoring',  n:9,  ic:'trophy',c:'#5A9C7A',  bg:'#E2EEDF' },
  ];
  const faqs = [
    { q:'How is my IELTS band calculated?', a:'We score Reading and Listening from your correct answers, and use AI to score Writing and Speaking against the official IELTS rubric. The four are averaged for your overall band.' },
    { q:'Can I cancel any time?', a:'Yes. Cancel from Settings → Subscription any time. You keep Pro access until the end of the current billing cycle. Refunds available within 30 days, no questions asked.' },
    { q:'Why am I missing today\'s streak?', a:'Streaks count any day you complete at least 5 minutes of practice. If you missed yesterday, you have a freebie shield once per week — tap your streak ring on the dashboard to use it.' },
    { q:'How does AI tutor pricing work?', a:'On Pro, AI tutor sessions are unlimited. On Free, you get 10 messages per day across all your languages, then it pauses until midnight UTC.' },
  ];

  return (
    <>
      <MobileHeader title="Help"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b_pre eyebrow="DOCS · FAQ · CHAT · HUMAN SUPPORT" title="How can we help?" lede="Search the knowledge base or jump straight to a chat — most questions are answered in under 5 minutes."/>
        {/* Search */}
        <div style={{ position:'relative', marginBottom:14 }}>
          <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search({width:14,height:14})}</div>
          <input placeholder="Search articles…" style={{ width:'100%', padding:'12px 14px 12px 38px', borderRadius:12, background:T.card, border:`1px solid ${T.hairline}`, fontSize:13, color:T.ink, outline:'none', boxShadow:MT.shadowSm }}/>
        </div>

        {/* Contact options — dark hero */}
        <div style={{ background:T.ink, borderRadius:18, padding:'18px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5b_dotgrid/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:11, marginBottom:14 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({width:15,height:15})}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1.05, letterSpacing:'-.015em' }}>Talk to support</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', marginTop:2 }}>Avg reply: 3 min · 24/7</div>
            </div>
          </div>
          <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
            <button style={{ padding:'9px 6px', borderRadius:10, background:T.brand, color:'#fff', fontSize:12, fontWeight:700 }}>Start chat</button>
            <button style={{ padding:'9px 6px', borderRadius:10, background:'rgba(255,255,255,.12)', color:'#fff', fontSize:12, fontWeight:700, border:'1px solid rgba(255,255,255,.18)' }}>Email us</button>
          </div>
        </div>

        {V5b_label('BROWSE BY TOPIC')}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {cats.map(c => (
            <button key={c.t} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, padding:'12px 13px', textAlign:'left', boxShadow:MT.shadowSm }}>
              <div style={{ width:32, height:32, borderRadius:9, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:9 }}>{Icon[c.ic] ? Icon[c.ic]({width:13,height:13}) : Icon.book({width:13,height:13})}</div>
              <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, marginBottom:3 }}>{c.t}</div>
              <div style={{ fontSize:9.5, color:c.c, fontWeight:800, letterSpacing:'.05em' }}>{c.n} ARTICLES</div>
            </button>
          ))}
        </div>

        {V5b_label('FREQUENTLY ASKED')}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <button onClick={()=>setOpenF(openF === i ? -1 : i)} style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'13px 14px', textAlign:'left', background:'transparent' }}>
                <div style={{ flex:1, fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.35 }}>{f.q}</div>
                <span style={{ color:T.ink4, fontSize:14, transform: openF === i ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>▾</span>
              </button>
              {openF === i && <div style={{ padding:'0 14px 13px', fontSize:12, color:T.ink3, lineHeight:1.55 }}>{f.a}</div>}
            </div>
          ))}
        </MCard>

        <div style={{ marginTop:16, padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12.5, color:T.ink, lineHeight:1.5 }}>"Can't find what you need? Email <span style={{ color:T.brand, fontStyle:'normal' }}>help@fluentra.com</span> — we read every message."</div>
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// MODULE RESULTS · v5
// ══════════════════════════════════════════════════════════════════
function MModuleResultsPageV5() {
  const [mod, setMod] = useStateMV5b('reading');
  const M = {
    reading:   { name:'Reading',   c:T.reading.c,   bg:T.reading.bg,   ic:'book', score:'7.5', sub:'Band', delta:'+0.5' },
    writing:   { name:'Writing',   c:T.writing.c,   bg:T.writing.bg,   ic:'pen',  score:'6.5', sub:'Band', delta:'+0.5' },
    listening: { name:'Listening', c:T.listening.c, bg:T.listening.bg, ic:'head', score:'8.0', sub:'Band', delta:'+1.0' },
    speaking:  { name:'Speaking',  c:T.speaking.c,  bg:T.speaking.bg,  ic:'mic',  score:'7.0', sub:'Band', delta:'+0.5' },
  }[mod];
  const breakdown = mod === 'writing' ? [
    { k:'Task response',     v:6.5 },
    { k:'Coherence',         v:7.0 },
    { k:'Lexical resource',  v:6.5 },
    { k:'Grammar accuracy',  v:6.0 },
  ] : mod === 'reading' ? [
    { k:'Detail',     v:8.0 },
    { k:'Inference',  v:7.0 },
    { k:'Vocabulary', v:7.5 },
    { k:'Time mgmt',  v:7.5 },
  ] : mod === 'listening' ? [
    { k:'Conversation', v:8.5 },
    { k:'Lecture',      v:7.5 },
    { k:'Numbers',      v:8.0 },
    { k:'Notes',        v:8.0 },
  ] : [
    { k:'Fluency',      v:7.0 },
    { k:'Pronunciation',v:7.5 },
    { k:'Lexical range',v:6.5 },
    { k:'Grammar',      v:7.0 },
  ];

  return (
    <>
      <MobileHeader back title="Session results"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b_pre eyebrow={`${M.name.toUpperCase()} · 12 MIN · 18 ITEMS`} title="Nicely done." lede="Your AI tutor reviewed every answer — here's what worked, where you grew, and where to focus next."/>

        {/* Score hero — color-themed */}
        <div style={{ background:`linear-gradient(160deg, ${M.c}, ${M.c}cc)`, borderRadius:18, padding:'22px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5b_dotgrid/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
            <div>
              <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.16em', color:'rgba(255,255,255,.7)', marginBottom:7 }}>YOUR BAND</div>
              <div style={{ fontFamily:T.serif, fontSize:64, lineHeight:.95, letterSpacing:'-.04em' }}>{M.score}</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.85)', fontWeight:700, marginTop:6 }}>↑ {M.delta} vs last week</div>
            </div>
            <div style={{ width:72, height:72, borderRadius:36, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[M.ic] ? Icon[M.ic]({width:30,height:30}) : '★'}</div>
          </div>
        </div>

        {/* Module switcher */}
        <div style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          {Object.entries({reading:'Reading',writing:'Writing',listening:'Listening',speaking:'Speaking'}).map(([k,l]) => {
            const a = mod === k;
            return <button key={k} onClick={()=>setMod(k)} style={{ flexShrink:0, padding:'7px 13px', borderRadius:99, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink2, fontSize:11.5, fontWeight:700, border:`1px solid ${a ? T.ink : T.hairline}` }}>{l}</button>;
          })}
        </div>

        {V5b_label('BREAKDOWN')}
        <MCard style={{ padding:14, marginBottom:14 }}>
          {breakdown.map((b, i) => (
            <div key={b.k} style={{ marginBottom: i < breakdown.length-1 ? 12 : 0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                <span style={{ fontSize:12, color:T.ink, fontWeight:600 }}>{b.k}</span>
                <span style={{ fontFamily:T.serif, fontSize:14, color:M.c }}>{b.v.toFixed(1)}</span>
              </div>
              <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${(b.v/9)*100}%`, background:M.c, borderRadius:99 }}/></div>
            </div>
          ))}
        </MCard>

        {V5b_label('AI FEEDBACK')}
        <MCard style={{ padding:'14px 16px', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:9 }}>
            <div style={{ width:24, height:24, borderRadius:12, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({width:11,height:11})}</div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink2, letterSpacing:'.05em' }}>Fluentra AI</div>
          </div>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:T.ink, lineHeight:1.55 }}>"Strong pacing on the inference items — you're now consistently above band 7. Watch for confusion between 'imply' and 'infer' on detail questions; review unit 4."</div>
        </MCard>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <button onClick={()=>window.__nav && window.__nav('practice')} style={{ padding:'13px', borderRadius:12, background:T.card, color:T.ink, fontSize:12.5, fontWeight:700, border:`1px solid ${T.hairline}`, boxShadow:MT.shadowSm }}>Review answers</button>
          <button onClick={()=>window.__nav && window.__nav('practice')} style={{ padding:'13px', borderRadius:12, background:T.brandGrad, color:'#fff', fontSize:12.5, fontWeight:700, boxShadow:`0 6px 14px ${T.brand}40` }}>Next session</button>
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// STATES (empty / error / loading) · v5
// ══════════════════════════════════════════════════════════════════
function MStatesPageV5() {
  const [cat, setCat] = useStateMV5b('empty');
  const states = {
    empty: [
      { ic:'book',   c:T.reading.c, bg:T.reading.bg, title:'No saved articles yet', body:'When you save articles or vocab from a lesson, they\'ll show up here so you can come back to them.', cta:'Browse library' },
      { ic:'flame',  c:'#E08F4D',   bg:'#FEF3E5',     title:'Start your first streak', body:'Complete one 5-minute session today and your streak ring will start glowing.', cta:'Start a session' },
      { ic:'users',  c:'#5A9C7A',   bg:'#E2EEDF',     title:'No friends yet', body:'Invite a study buddy and you\'ll see their activity in your feed — accountability for free.', cta:'Invite a friend' },
    ],
    error: [
      { ic:'wifi',   c:'#D26890', bg:'#F9E6EE',  title:'You\'re offline', body:'Some features need a connection. Cached lessons still work — try those while we wait for the bars to come back.', cta:'Retry' },
      { ic:'shield', c:'#E08F4D', bg:'#FEF3E5',  title:'Something went wrong', body:'We couldn\'t load this page. Tap retry — if it keeps happening, support@fluentra.com knows what to do.', cta:'Retry' },
    ],
    loading: [
      { ic:'spark',  c:T.brand, bg:T.brandLight, title:'Generating your test', body:'Your AI tutor is creating an exam tailored to your level. Usually takes about 8 seconds.', cta:null },
    ],
  };
  return (
    <>
      <MobileHeader title="States preview"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b_pre eyebrow="DESIGN · EDGE CASES" title="Empty, error, loading" lede="The screens you see when something's missing, broken or in flight. Friendly, clear, never sterile."/>
        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {[{id:'empty',l:'Empty'},{id:'error',l:'Error'},{id:'loading',l:'Loading'}].map(t => {
            const a = cat === t.id;
            return <button key={t.id} onClick={()=>setCat(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>;
          })}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {states[cat].map((s, i) => (
            <MCard key={i} style={{ padding:'24px 22px', textAlign:'center' }}>
              <div style={{ width:64, height:64, borderRadius:32, background:s.bg, color:s.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>{Icon[s.ic] ? Icon[s.ic]({width:24,height:24}) : '?'}</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:7 }}>{s.title}</div>
              <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55, marginBottom: s.cta ? 14 : 0, maxWidth:280, margin:'0 auto 14px' }}>{s.body}</div>
              {s.cta && <button style={{ padding:'10px 16px', borderRadius:11, background:T.brandGrad, color:'#fff', fontSize:12, fontWeight:700, boxShadow:`0 4px 12px ${T.brand}40` }}>{s.cta}</button>}
              {!s.cta && <div style={{ display:'inline-flex', gap:5, marginTop:10 }}>{[0,1,2].map(k => <div key={k} style={{ width:7, height:7, borderRadius:4, background:T.brand, opacity: .4 + k*.2, animation:`pulse 1.4s ease-in-out ${k*.2}s infinite` }}/>)}</div>}
            </MCard>
          ))}
        </div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// ONBOARDING · v5
// ══════════════════════════════════════════════════════════════════
function MOnboardingPageV5() {
  const [step, setStep] = useStateMV5b(0);
  const [data, setData] = useStateMV5b({ language:'es', goal:'travel', reasons:[], level:'a2', schedule:'regular', reminder:'08:30' });
  const langs = [{id:'es',n:'Spanish',f:'🇪🇸'},{id:'fr',n:'French',f:'🇫🇷'},{id:'jp',n:'Japanese',f:'🇯🇵'},{id:'de',n:'German',f:'🇩🇪'},{id:'it',n:'Italian',f:'🇮🇹'},{id:'zh',n:'Mandarin',f:'🇨🇳'}];
  const goals = [{id:'travel',n:'Travel & culture',ic:'pin'},{id:'work',n:'Work & business',ic:'briefcase'},{id:'exam',n:'Pass an exam',ic:'trophy'},{id:'family',n:'Family & friends',ic:'users'},{id:'fun',n:'Just for fun',ic:'spark'}];
  const levels = [{id:'a1',n:'Just starting',d:'A1'},{id:'a2',n:'Some basics',d:'A2'},{id:'b1',n:'Conversational',d:'B1'},{id:'b2',n:'Intermediate',d:'B2'},{id:'c1',n:'Advanced',d:'C1'}];
  const total = 5;
  const titles = ['Pick a language','What\'s your goal?','Where are you now?','Daily commitment','Daily reminder'];
  const ledes = ['You can add more languages later — start with the one you\'re most excited about.','We tailor lessons, vocab and exam prep based on what brings you here.','Be honest — we\'ll calibrate from your first session and adjust as you grow.','Pick a pace that fits your week. Consistency beats intensity, every time.','We\'ll nudge you once a day. You can change this any time in settings.'];

  const next = () => step < total - 1 ? setStep(step + 1) : (window.__nav && window.__nav('dashboard'));

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'hidden' }}>
      <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:11, background:T.card, borderBottom:`1px solid ${T.hairline}` }}>
        {step > 0 && <button onClick={()=>setStep(step-1)} style={{ width:30, height:30, borderRadius:15, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>‹</button>}
        <div style={{ flex:1, display:'flex', gap:4 }}>
          {Array.from({length:total}).map((_,i) => (
            <div key={i} style={{ flex:1, height:4, borderRadius:99, background: i <= step ? T.brand : T.bg3 }}/>
          ))}
        </div>
        <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em' }}>{step+1}/{total}</div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'10px 16px 14px' }}>
        <V5b_pre eyebrow={`STEP ${step+1} OF ${total}`} title={titles[step]} lede={ledes[step]}/>

        {step === 0 && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {langs.map(l => {
              const a = data.language === l.id;
              return (
                <button key={l.id} onClick={()=>setData({...data, language:l.id})} style={{ padding:'18px 14px', borderRadius:13, background: a ? T.brandLight : T.card, border:`2px solid ${a ? T.brand : T.hairline}`, textAlign:'left' }}>
                  <div style={{ fontSize:32, marginBottom:8 }}>{l.f}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{l.n}</div>
                </button>
              );
            })}
          </div>
        )}
        {step === 1 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {goals.map(g => {
              const a = data.goal === g.id;
              return (
                <button key={g.id} onClick={()=>setData({...data, goal:g.id})} style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 14px', borderRadius:12, background: a ? T.brandLight : T.card, border:`2px solid ${a ? T.brand : T.hairline}`, textAlign:'left' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background: a ? T.brand : T.bg2, color: a ? '#fff' : T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[g.ic] ? Icon[g.ic]({width:14,height:14}) : '★'}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:700, color:T.ink }}>{g.n}</div>
                  {a && <div style={{ width:18, height:18, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>✓</div>}
                </button>
              );
            })}
          </div>
        )}
        {step === 2 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {levels.map(l => {
              const a = data.level === l.id;
              return (
                <button key={l.id} onClick={()=>setData({...data, level:l.id})} style={{ display:'flex', alignItems:'center', gap:14, padding:'15px 14px', borderRadius:12, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink, border:`2px solid ${a ? T.ink : T.hairline}`, textAlign:'left' }}>
                  <div style={{ fontFamily:T.serif, fontSize:18, color: a ? T.brand : T.ink3, width:30 }}>{l.d}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:700 }}>{l.n}</div>
                </button>
              );
            })}
          </div>
        )}
        {step === 3 && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[{id:'casual',n:'Casual',m:'5 min/day · ~2 lessons/week'},{id:'regular',n:'Regular',m:'15 min/day · most days'},{id:'serious',n:'Serious',m:'30 min/day · daily'},{id:'intense',n:'All-in',m:'60+ min/day · daily'}].map(s => {
              const a = data.schedule === s.id;
              return (
                <button key={s.id} onClick={()=>setData({...data, schedule:s.id})} style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 14px', borderRadius:12, background: a ? T.brandLight : T.card, border:`2px solid ${a ? T.brand : T.hairline}`, textAlign:'left' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{s.n}</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{s.m}</div>
                  </div>
                  {a && <div style={{ width:18, height:18, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>✓</div>}
                </button>
              );
            })}
          </div>
        )}
        {step === 4 && (
          <div>
            <MCard style={{ padding:'18px 16px', textAlign:'center', marginBottom:14 }}>
              <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.12em', marginBottom:8 }}>REMINDER TIME</div>
              <div style={{ fontFamily:T.serif, fontSize:48, letterSpacing:'-.03em', color:T.ink, lineHeight:1 }}>{data.reminder}</div>
              <div style={{ fontSize:11.5, color:T.ink4, marginTop:8 }}>Daily, weekdays</div>
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6 }}>
              {['07:00','08:30','12:30','18:00','19:30','20:30','21:00','22:00'].map(t => (
                <button key={t} onClick={()=>setData({...data, reminder:t})} style={{ padding:'9px 4px', borderRadius:9, background: data.reminder === t ? T.ink : T.card, color: data.reminder === t ? '#fff' : T.ink2, fontSize:11, fontWeight:700, border:`1px solid ${data.reminder === t ? T.ink : T.hairline}` }}>{t}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:'12px 16px 16px', background:T.card, borderTop:`1px solid ${T.hairline}`, flexShrink:0 }}>
        <button onClick={next} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40`, display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {step === total - 1 ? 'Start learning' : 'Continue'} {Icon.arrow ? Icon.arrow({width:12,height:12}) : '→'}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// MARKETING / LANDING · v5
// ══════════════════════════════════════════════════════════════════
function MMarketingPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <div style={{ flex:1, overflow:'auto', background:T.bg }}>
      {/* Top nav */}
      <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(255,255,255,.92)', backdropFilter:'blur(10px)', borderBottom:`1px solid ${T.hairline}`, position:'sticky', top:0, zIndex:10 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:24, height:24, borderRadius:6, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({width:11,height:11})}</div>
          <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, letterSpacing:'-.01em' }}>Fluentra</div>
        </div>
        <button onClick={()=>nav('auth_login')} style={{ padding:'7px 14px', borderRadius:99, background:'transparent', color:T.ink2, fontSize:11.5, fontWeight:600, border:`1px solid ${T.border}` }}>Sign in</button>
      </div>

      {/* Hero — dark editorial */}
      <div style={{ background:T.ink, padding:'52px 22px 44px', color:'#fff', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:240, height:240, borderRadius:120, background:`radial-gradient(circle, ${T.brand}40, transparent 70%)` }}/>
        <div style={{ position:'relative' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.22em', color:'rgba(255,255,255,.55)', marginBottom:18 }}>FLUENTRA · LANGUAGE, REIMAGINED</div>
          <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:.98, letterSpacing:'-.03em', marginBottom:18 }}>The fastest<br/>path to<br/><em style={{ color:T.brand, fontStyle:'italic' }}>fluent.</em></div>
          <div style={{ fontSize:14.5, color:'rgba(255,255,255,.7)', lineHeight:1.55, marginBottom:28, maxWidth:280 }}>AI tutor, exam prep and real conversation — across 80+ languages. Built for adults who don't have time for cartoon owls.</div>
          <button onClick={()=>nav('onboarding')} style={{ width:'100%', padding:'15px', borderRadius:14, background:'#fff', color:T.ink, fontSize:13.5, fontWeight:700, marginBottom:10, border:'none' }}>Start 7 days free →</button>
          <div style={{ textAlign:'center', fontSize:11.5, fontFamily:T.serif, fontStyle:'italic', color:'rgba(255,255,255,.6)', letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
        </div>
      </div>

      {/* Trust strip */}
      <div style={{ padding:'22px 22px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
          <div>
            <div style={{ display:'flex' }}>
              {['#D26890','#2A6FA0','#5A9C7A','#E08F4D','#7C5BD6'].map((c,i)=>(
                <div key={i} style={{ width:26, height:26, borderRadius:13, background:c, marginLeft: i ? -8 : 0, border:`2px solid ${T.card}`, color:'#fff', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{['M','D','H','A','S'][i]}</div>
              ))}
            </div>
          </div>
          <div style={{ flex:1, fontSize:11.5, color:T.ink3, lineHeight:1.4 }}><span style={{ fontWeight:700, color:T.ink }}>2.4M+</span> learners · <span style={{ fontWeight:700, color:T.ink }}>4.9 ★</span> on App Store</div>
        </div>
      </div>

      {/* Single proof — magazine quote */}
      <div style={{ padding:'48px 26px', background:T.bg, textAlign:'center', borderBottom:`1px solid ${T.hairline}` }}>
        <div style={{ fontFamily:T.serif, fontSize:80, lineHeight:.5, color:T.brand, marginBottom:22 }}>"</div>
        <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.25, color:T.ink, letterSpacing:'-.01em', marginBottom:20 }}>I went from B1 to C1 in 11 weeks. The AI feedback on my essays is what made the difference.</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:16, background:'#D26890', color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>M</div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>Maria S.</div>
              <div style={{ fontSize:10.5, color:T.ink4 }}>Madrid · IELTS 7.5</div>
            </div>
        </div>
      </div>

      {/* What you get — three premium cards */}
      <div style={{ padding:'40px 18px 14px' }}>
        <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.2em', color:T.ink4, marginBottom:8, textAlign:'center' }}>WHAT YOU GET</div>
        <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05, letterSpacing:'-.02em', textAlign:'center', marginBottom:26, padding:'0 12px' }}>Three things, done remarkably well.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { n:'01', t:'A tutor in your pocket', d:'Lía answers, corrects, and adapts in seconds. Speak to her like a person — she replies like one.', accent:T.brand },
            { n:'02', t:'Real exam preparation',  d:'IELTS, TOEFL, JLPT, DELF and more. Mock tests scored against the real rubric, with band-level feedback.', accent:'#7C5BD6' },
            { n:'03', t:'Native content, leveled', d:'Articles, podcasts, songs and shows — chosen for your level, captioned, instantly looked up.', accent:'#5A9C7A' },
          ].map(f => (
            <MCard key={f.n} style={{ padding:'22px 20px' }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:14, marginBottom:10 }}>
                <div style={{ fontFamily:T.serif, fontSize:28, color:f.accent, lineHeight:1, fontStyle:'italic' }}>{f.n}</div>
                <div style={{ flex:1, height:1, background:T.hairline }}/>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:21, color:T.ink, lineHeight:1.15, letterSpacing:'-.01em', marginBottom:7 }}>{f.t}</div>
              <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55 }}>{f.d}</div>
            </MCard>
          ))}
        </div>
      </div>

      {/* Method — minimal step list */}
      <div style={{ padding:'44px 22px', background:T.ink, color:'#fff', marginTop:34 }}>
        <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.2em', color:'rgba(255,255,255,.45)', marginBottom:8 }}>THE METHOD</div>
        <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:26 }}>Five minutes. Every day. Compounded.</div>
        {[
          { d:'5 min', t:'Daily input',  s:'A bite-size lesson chosen for what you almost know.' },
          { d:'AI',    t:'Live feedback', s:'Speak, write, get scored. Mistakes corrected before they stick.' },
          { d:'∞',     t:'Spaced recall', s:'You see hard words again. And again. Until they’re yours.' },
        ].map((s,i,arr) => (
          <div key={s.t} style={{ padding:'16px 0', borderBottom: i<arr.length-1 ? '1px solid rgba(255,255,255,.1)' : 'none', display:'flex', gap:14 }}>
            <div style={{ width:54, fontFamily:T.serif, fontSize:18, color:T.brand, fontStyle:'italic', lineHeight:1.3 }}>{s.d}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:700, color:'#fff', marginBottom:3 }}>{s.t}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', lineHeight:1.5 }}>{s.s}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Languages — restrained chip cluster */}
      <div style={{ padding:'40px 22px', textAlign:'center' }}>
        <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.2em', color:T.ink4, marginBottom:14 }}>80+ LANGUAGES</div>
        <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:22 }}>Pick one. Or two. Or all of them.</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6, justifyContent:'center' }}>
          {['Spanish','French','Japanese','German','Mandarin','Korean','Italian','Portuguese','Arabic','Russian','Hindi','Turkish'].map(l=>(
            <span key={l} style={{ padding:'7px 12px', background:T.bg2, borderRadius:99, fontSize:11.5, color:T.ink2, fontWeight:600, border:`1px solid ${T.hairline}` }}>{l}</span>
          ))}
          <span style={{ padding:'7px 12px', background:T.ink, color:'#fff', borderRadius:99, fontSize:11.5, fontWeight:700 }}>+ 68 more</span>
        </div>
      </div>

      {/* Pricing teaser — single premium card */}
      <div style={{ padding:'8px 18px 18px' }}>
        <MCard style={{ padding:'30px 24px', background:T.brandGrad, color:'#fff', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:70, background:'rgba(255,255,255,.08)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.2em', color:'rgba(255,255,255,.7)', marginBottom:14 }}>PRO · MOST POPULAR</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
              <span style={{ fontFamily:T.serif, fontSize:46, lineHeight:1, letterSpacing:'-.02em' }}>$19</span>
              <span style={{ fontSize:14, color:'rgba(255,255,255,.8)' }}>/mo</span>
            </div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginBottom:18 }}>Billed annually. $24/mo on monthly. 7-day free trial.</div>
            <div style={{ height:1, background:'rgba(255,255,255,.18)', marginBottom:16 }}/>
            <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:22 }}>
              {['All 80+ languages','Unlimited AI tutor','Unlimited practice exams','Speaking with mic + writing feedback'].map(p => (
                <div key={p} style={{ display:'flex', gap:10, alignItems:'center', fontSize:12.5 }}>
                  <span style={{ width:14, height:14, borderRadius:7, background:'rgba(255,255,255,.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800 }}>✓</span>
                  {p}
                </div>
              ))}
            </div>
            <button onClick={()=>nav('onboarding')} style={{ width:'100%', padding:'14px', borderRadius:12, background:'#fff', color:T.brand, fontSize:13, fontWeight:700, border:'none' }}>Start 7-day free trial</button>
          </div>
        </MCard>
        <button onClick={()=>nav('pricing')} style={{ width:'100%', marginTop:10, padding:'12px', borderRadius:12, background:'transparent', color:T.ink3, fontSize:12, fontWeight:600 }}>Compare all plans →</button>
      </div>

      {/* Final dark CTA */}
      <div style={{ padding:'44px 22px', background:T.ink, color:'#fff', textAlign:'center', marginTop:24 }}>
        <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:12 }}>Begin tonight.</div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', lineHeight:1.55, marginBottom:22, maxWidth:260, margin:'0 auto 22px' }}>One short session. That's all it takes to start a streak that holds.</div>
        <button onClick={()=>nav('onboarding')} style={{ width:'100%', padding:'15px', borderRadius:14, background:T.brand, color:'#fff', fontSize:13.5, fontWeight:700, border:'none', boxShadow:`0 8px 22px ${T.brand}50` }}>Start 7 days free</button>
      </div>

      {/* Footer — minimal */}
      <div style={{ padding:'30px 22px 36px', background:T.bg }}>
        <div style={{ display:'flex', justifyContent:'center', gap:18, marginBottom:14, flexWrap:'wrap' }}>
          {['About','Pricing','Help','Privacy','Terms'].map(l=>(
            <a key={l} style={{ fontSize:12, color:T.ink3, fontWeight:500 }}>{l}</a>
          ))}
        </div>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink5 }}>© Fluentra 2025 · Made in Madrid, Tokyo & Berlin</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  MLeaderboardPageV5, MCoursePageV5, MGrammarPageV5, MHelpPageV5,
  MModuleResultsPageV5, MStatesPageV5, MOnboardingPageV5, MMarketingPageV5,
});
