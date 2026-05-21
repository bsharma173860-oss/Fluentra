// ── Mobile · v5 redesigns · Batch 2 ───────────────────────────────
// Tutor Call · Tutor History · Public Profile · DM Thread · Activity Feed

const useStV5B2 = React.useState;
const useEfV5B2 = React.useEffect;

const V5b2Pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b2Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b2Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);

// ══════════════════════════════════════════════════════════════════
// TUTOR VOICE CALL
// ══════════════════════════════════════════════════════════════════
function MTutorCallPageV5() {
  const [secs, setSecs] = useStV5B2(0);
  const [muted, setMuted] = useStV5B2(false);
  const [speaker, setSpeaker] = useStV5B2(true);
  const [tab, setTab] = useStV5B2('live');
  const nav = (id) => window.__nav && window.__nav(id);
  useEfV5B2(()=>{ const t = setInterval(()=>setSecs(s=>s+1), 1000); return ()=>clearInterval(t); }, []);
  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const transcript = [
    { who:'tutor', t:'Hola Maria. ¿Cómo te ha ido la semana?',  tr:'Hi Maria. How has your week gone?' },
    { who:'you',   t:'Bien, gracias. He estado practicando mucho.', tr:'Good, thanks. I\'ve been practicing a lot.' },
    { who:'tutor', t:'Excelente. Hoy vamos a hablar del trabajo.',  tr:'Excellent. Today we\'ll talk about work.' },
    { who:'you',   t:'Vale, perfecto.',                              tr:'OK, great.' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.ink, color:'#fff', overflow:'hidden', position:'relative' }}>
      <V5b2Dot/>
      {/* Top */}
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px' }}>
        <button onClick={()=>nav('tutor')} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'#fff' }}>×</button>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:99, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)' }}>
          <div style={{ width:6, height:6, borderRadius:3, background:'#5BD17A', boxShadow:'0 0 6px #5BD17A' }}/>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.06em' }}>LIVE · {fmt(secs)}</span>
        </div>
        <button style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'#fff', fontSize:14 }}>⋯</button>
      </div>

      {/* Tutor card */}
      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', padding:'20px 18px 14px' }}>
        <div style={{ position:'absolute', top:30, left:'50%', transform:'translateX(-50%)', width:360, height:360, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}30 0%, transparent 70%)` }}/>
        <div style={{ position:'relative', textAlign:'center', marginBottom:20 }}>
          <div style={{ width:108, height:108, borderRadius:54, background:`linear-gradient(135deg, ${T.brand} 0%, #B85C2A 100%)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:42, margin:'0 auto 16px', boxShadow:`0 12px 32px ${T.brand}55, inset 0 0 0 1px rgba(255,255,255,.12)` }}>S</div>
          <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:5 }}>Sofía Martínez</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', letterSpacing:'.04em' }}>Madrid · Native · Lesson 3 of 8</div>
        </div>

        {/* Audio waveform */}
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:46, marginBottom:18 }}>
          {Array.from({length:36}).map((_,i)=>{
            const phase = (secs * 8 + i * 23) % 100;
            const h = 6 + Math.abs(Math.sin(phase * .1)) * 32;
            return <div key={i} style={{ width:3, height:h, borderRadius:2, background: i % 7 === 0 ? T.brand : `rgba(255,255,255,${0.25 + (h/40)*0.5})` }}/>;
          })}
        </div>

        {/* Tabs */}
        <div style={{ position:'relative', display:'flex', gap:2, background:'rgba(255,255,255,.06)', borderRadius:11, padding:3, marginBottom:11, border:'1px solid rgba(255,255,255,.08)' }}>
          {[{id:'live',l:'Transcript'},{id:'notes',l:'Lesson notes'}].map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11, fontWeight: a?700:500, color: a?T.ink:'rgba(255,255,255,.6)', background: a?'#fff':'transparent' }}>{t.l}</button>;
          })}
        </div>

        <div style={{ position:'relative', flex:1, overflow:'auto', background:'rgba(255,255,255,.04)', borderRadius:13, border:'1px solid rgba(255,255,255,.08)', padding:14 }}>
          {tab === 'live' ? transcript.map((m, i) => (
            <div key={i} style={{ marginBottom:11 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:3 }}>
                <span style={{ fontSize:9.5, fontWeight:800, color: m.who==='tutor'?T.brand:'rgba(255,255,255,.5)', letterSpacing:'.1em' }}>{m.who === 'tutor' ? 'SOFÍA' : 'YOU'}</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:14, color:'#fff', lineHeight:1.4, marginBottom:2 }}>{m.t}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', fontFamily:T.serif, fontStyle:'italic' }}>{m.tr}</div>
            </div>
          )) : (
            <div>
              <div style={{ fontSize:9.5, fontWeight:800, color:T.brand, letterSpacing:'.12em', marginBottom:8 }}>TODAY'S FOCUS</div>
              <ul style={{ fontSize:12, color:'rgba(255,255,255,.85)', lineHeight:1.7, paddingLeft:18, margin:'0 0 10px' }}>
                <li>Vocabulary for office &amp; work</li>
                <li>Past-tense conjugation review</li>
                <li>Polite-form practice</li>
              </ul>
              <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:'rgba(255,255,255,.6)' }}>"Sofía will send a written summary after the call."</div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:14, padding:'18px 16px 26px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
        <button onClick={()=>setMuted(m=>!m)} style={{ width:54, height:54, borderRadius:27, background: muted ? T.brand : 'rgba(255,255,255,.08)', border:`1px solid ${muted ? T.brand : 'rgba(255,255,255,.14)'}`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.mic ? Icon.mic({width:18,height:18}) : '🎙'}</button>
        <button onClick={()=>nav('tutor')} style={{ width:64, height:64, borderRadius:32, background:'#D63E3E', color:'#fff', boxShadow:'0 8px 24px rgba(214,62,62,.4)', border:'none', fontSize:20 }}>✕</button>
        <button onClick={()=>setSpeaker(s=>!s)} style={{ width:54, height:54, borderRadius:27, background: speaker ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.head ? Icon.head({width:18,height:18}) : '🔊'}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TUTOR HISTORY
// ══════════════════════════════════════════════════════════════════
function MTutorHistoryPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const sessions = [
    { date:'May 4',  d:'Today',     t:'18:00–18:30', tutor:'Sofía Martínez', topic:'Office vocabulary', xp:120, score:92, summary:'Strong pronunciation. Mixed up ser/estar twice.' },
    { date:'May 1',  d:'Wednesday', t:'18:00–18:30', tutor:'Sofía Martínez', topic:'Past-tense review', xp:115, score:88, summary:'Good control of preterite. Imperfect needs work.' },
    { date:'Apr 27', d:'Saturday',  t:'10:00–10:30', tutor:'Carlos Ruíz',    topic:'Travel & directions', xp:130, score:95, summary:'Excellent pace. Vocabulary very natural.' },
    { date:'Apr 24', d:'Wednesday', t:'18:00–18:30', tutor:'Sofía Martínez', topic:'Restaurants & food', xp:110, score:90, summary:'Confident roleplay. Watch gendered articles.' },
  ];
  return (
    <>
      <MobileHeader back title="Tutor history"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b2Pre eyebrow={`${sessions.length} SESSIONS · 7 H 30 M TOTAL`} title="Your tutor sessions" lede="Every conversation, with notes Sofía wrote afterwards. Tap any to replay or review."/>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[{l:'SESSIONS',v:sessions.length},{l:'AVG SCORE',v:'91'},{l:'STREAK',v:'4w'}].map(s => (
            <MCard key={s.l} style={{ padding:'12px 10px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div><div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginTop:5 }}>{s.l}</div></MCard>
          ))}
        </div>

        {V5b2Lbl('PAST SESSIONS')}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {sessions.map((s, i) => (
            <button key={i} onClick={()=>nav('tutor_call')} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, padding:14, textAlign:'left', boxShadow:MT.shadowSm }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:7, gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:4 }}>{s.d.toUpperCase()} · {s.t}</div>
                  <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.2, marginBottom:3 }}>{s.topic}</div>
                  <div style={{ fontSize:11.5, color:T.ink3 }}>with {s.tutor}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.score}</div>
                  <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:2 }}>SCORE</div>
                </div>
              </div>
              <div style={{ paddingTop:8, borderTop:`1px solid ${T.hairline}`, fontFamily:T.serif, fontStyle:'italic', fontSize:11.5, color:T.ink3, lineHeight:1.4 }}>"{s.summary}"</div>
              <div style={{ display:'flex', gap:5, marginTop:9 }}>
                <span style={{ fontSize:10, fontWeight:700, color:T.brand, padding:'3px 8px', borderRadius:99, background:T.brandLight }}>+{s.xp} XP</span>
                <span style={{ fontSize:10, fontWeight:700, color:T.ink3, padding:'3px 8px', borderRadius:99, background:T.bg2 }}>30 min</span>
              </div>
            </button>
          ))}
        </div>

        <button onClick={()=>nav('tutor')} style={{ width:'100%', marginTop:16, padding:'13px', borderRadius:12, background:T.ink, color:'#fff', fontSize:12.5, fontWeight:700 }}>Book another session</button>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// PUBLIC PROFILE
// ══════════════════════════════════════════════════════════════════
function MPublicProfilePageV5() {
  const [tab, setTab] = useStV5B2('overview');
  const [followed, setFollowed] = useStV5B2(false);
  const nav = (id) => window.__nav && window.__nav(id);
  const u = {
    name:'Yuki Tanaka', handle:'@yuki_t', from:'Tokyo · 🇯🇵',
    langs:[
      {f:'🇪🇸',l:'Spanish',lvl:'B2',pct:.72,xp:8420,since:'Mar 2024'},
      {f:'🇫🇷',l:'French',lvl:'A2',pct:.34,xp:1840,since:'Aug 2024'},
    ],
    streak:42, best:91, level:14, xp:10260, friends:128, badges:18, lessons:312, hours:124,
    joined:'Mar 2024',
    bio:'Studying for DELE B2 in October. Always up for a Spanish convo about tech, food or travel. Mornings only — that\'s when my brain works.',
    pace:'~25 min/day',
    interests:['Tech','Food','Travel','Cycling','Cinema'],
  };

  // 12-week heatmap
  const heat = Array.from({length:84}, (_,i)=> Math.max(0, Math.round(Math.sin(i*0.6+1)*2.4 + 2)));
  const heatColors = [T.bg2, '#E5DACB', T.brand+'66', T.brand+'aa', T.brand];

  return (
    <>
      <MobileHeader back title="" trailing={<button style={{ width:34, height:34, borderRadius:9, background:T.bg2, color:T.ink2, border:'none', fontSize:18 }}>⋯</button>}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {/* Hero — taller gradient + cover */}
        <div style={{ background:'linear-gradient(135deg,#3D5BA8 0%,#7C5BD6 100%)', borderRadius:18, padding:'22px 18px 20px', position:'relative', overflow:'hidden', marginBottom:12 }}>
          <V5b2Dot/>
          <div style={{ position:'relative', display:'flex', alignItems:'flex-start', gap:14 }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <div style={{ width:80, height:80, borderRadius:40, background:'rgba(255,255,255,.16)', backdropFilter:'blur(12px)', border:'2px solid rgba(255,255,255,.32)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:32 }}>YT</div>
              <div style={{ position:'absolute', bottom:-2, right:-2, width:22, height:22, borderRadius:11, background:'#5A9C7A', border:'2.5px solid #4263B0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10 }}>🔥</div>
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.serif, fontSize:23, color:'#fff', lineHeight:1.05, letterSpacing:'-.015em' }}>{u.name}</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.72)', marginTop:3 }}>{u.handle} · {u.from}</div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8, fontSize:10.5, color:'rgba(255,255,255,.85)' }}>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4 }}><span style={{ width:5, height:5, borderRadius:3, background:'#5DDB95' }}/>Online now</span>
                <span style={{ opacity:.5 }}>·</span>
                <span>Joined {u.joined}</span>
              </div>
            </div>
          </div>
          <div style={{ position:'relative', fontSize:12.5, color:'rgba(255,255,255,.88)', lineHeight:1.5, marginTop:14, fontFamily:T.serif, fontStyle:'italic' }}>"{u.bio}"</div>

          <div style={{ position:'relative', display:'flex', flexWrap:'wrap', gap:5, marginTop:13 }}>
            {u.langs.map((l, i) => (
              <span key={i} style={{ fontSize:10.5, fontWeight:700, color:'#fff', padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.18)' }}>{l.f} {l.l} · {l.lvl}</span>
            ))}
            <span style={{ fontSize:10.5, fontWeight:700, color:'rgba(255,255,255,.85)', padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.16)' }}>{u.pace}</span>
          </div>
        </div>

        {/* Action row */}
        <div style={{ display:'flex', gap:7, marginBottom:14 }}>
          <button onClick={()=>nav('dm_thread')} style={{ flex:1.4, padding:'12px', borderRadius:12, background:T.ink, color:'#fff', fontSize:12.5, fontWeight:700, border:'none', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>{Icon.chat ? Icon.chat({width:13,height:13}) : '✉'} Message</button>
          <button onClick={()=>setFollowed(!followed)} style={{ flex:1, padding:'12px', borderRadius:12, background: followed ? T.brandLight : T.brand, color: followed ? T.brand : '#fff', fontSize:12.5, fontWeight:700, border: followed ? `1px solid ${T.brand}55` : 'none', boxShadow: followed ? 'none' : `0 6px 16px ${T.brand}40` }}>{followed ? 'Following' : '+ Follow'}</button>
          <button style={{ width:46, padding:'12px 0', borderRadius:12, background:T.card, color:T.ink2, fontSize:14, border:`1px solid ${T.hairline}` }}>{Icon.share ? Icon.share({width:13,height:13}) : '↗'}</button>
        </div>

        {/* Stat row — 4 metrics */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:6, marginBottom:14 }}>
          {[{l:'DAY STREAK',v:u.streak,c:T.brand},{l:'LEVEL',v:u.level,c:'#7C5BD6'},{l:'XP TOTAL',v:`${(u.xp/1000).toFixed(1)}k`,c:'#3D8A5F'},{l:'BADGES',v:u.badges,c:'#E0A23A'}].map(s => (
            <MCard key={s.l} style={{ padding:'12px 6px', textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:19, color:s.c, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div>
              <div style={{ fontSize:8, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:6 }}>{s.l}</div>
            </MCard>
          ))}
        </div>

        {/* Languages — per-lang cards */}
        <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:9 }}>LEARNING</div>
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:16 }}>
          {u.langs.map((l, i) => (
            <MCard key={i} style={{ padding:'13px 14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ fontSize:24 }}>{l.f}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:5 }}>
                    <div style={{ fontFamily:T.serif, fontSize:15, color:T.ink, letterSpacing:'-.01em' }}>{l.l}</div>
                    <div style={{ fontSize:10.5, fontWeight:700, color:T.ink3 }}>{l.lvl} · {(l.xp/1000).toFixed(1)}k XP</div>
                  </div>
                  <div style={{ height:5, borderRadius:3, background:T.bg2, overflow:'hidden' }}>
                    <div style={{ width:`${l.pct*100}%`, height:'100%', background:T.brand, borderRadius:3 }}/>
                  </div>
                  <div style={{ fontSize:9.5, color:T.ink5, marginTop:5 }}>Since {l.since}</div>
                </div>
              </div>
            </MCard>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {[{id:'overview',l:'Activity'},{id:'streak',l:'Streak'},{id:'badges',l:'Badges'},{id:'shared',l:'Shared'}].map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none', border:'none' }}>{t.l}</button>;
          })}
        </div>

        {tab === 'overview' && (
          <>
            <MCard style={{ padding:0, overflow:'hidden', marginBottom:12 }}>
              {[
                { ic:'spark', t:'Hit a 42-day streak',                       sub:'Personal best is 91 days', tt:'2h ago',     c:T.brand },
                { ic:'check', t:'Completed Lesson 6 · Spanish',              sub:'Past tenses · 92% score',  tt:'5h ago',     c:'#5A9C7A' },
                { ic:'star',  t:'Earned the Vocabulary Builder badge',      sub:'500 words mastered',       tt:'Yesterday',  c:'#E0A23A' },
                { ic:'mic',   t:'30-min tutor session with Lía',             sub:'Topic: weekend plans',     tt:'2 days ago', c:'#7C5BD6' },
                { ic:'pen',   t:'Submitted 3 writing exercises',             sub:'Average score 84%',         tt:'3 days ago', c:'#A6486B' },
                { ic:'trophy',t:'Top 5% on the weekly leaderboard',          sub:'Week of Sep 9–15',          tt:'5 days ago', c:'#3D8A5F' },
              ].map((a, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                  <div style={{ width:32, height:32, borderRadius:10, background:`${a.c}1a`, color:a.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[a.ic] ? Icon[a.ic]({width:13,height:13}) : '★'}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.3, fontWeight:600 }}>{a.t}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{a.sub}</div>
                  </div>
                  <div style={{ fontSize:9.5, color:T.ink5, fontWeight:700, letterSpacing:'.04em', flexShrink:0 }}>{a.tt.toUpperCase()}</div>
                </div>
              ))}
            </MCard>
            <button style={{ width:'100%', padding:'10px', borderRadius:11, background:T.card, color:T.ink2, fontSize:11.5, fontWeight:700, border:`1px solid ${T.hairline}` }}>See full activity →</button>
          </>
        )}

        {tab === 'streak' && (
          <>
            <MCard style={{ padding:'14px 14px', marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                <div style={{ fontSize:11, fontWeight:800, color:T.ink4, letterSpacing:'.12em' }}>LAST 12 WEEKS</div>
                <div style={{ fontSize:10.5, color:T.ink5 }}>{heat.filter(h=>h>0).length} active days</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(12, 1fr)', gridAutoRows:'1fr', gap:3, aspectRatio:'12/7', marginTop:10 }}>
                {Array.from({length:84}).map((_,i)=>{
                  const col = i % 12, row = Math.floor(i/12);
                  const v = heat[row*12 + col] || 0;
                  return <div key={i} style={{ borderRadius:3, background:heatColors[Math.min(v,4)], aspectRatio:1 }}/>;
                })}
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:11, fontSize:9.5, color:T.ink5 }}>
                <span>Less</span>
                <div style={{ display:'flex', gap:3 }}>{heatColors.map((c,i)=><div key={i} style={{ width:9, height:9, borderRadius:2, background:c }}/>)}</div>
                <span>More</span>
              </div>
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
              <MCard style={{ padding:'14px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:24, color:T.brand, lineHeight:1 }}>{u.streak}</div><div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:5 }}>CURRENT</div></MCard>
              <MCard style={{ padding:'14px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>{u.best}</div><div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:5 }}>PERSONAL BEST</div></MCard>
            </div>
            <MCard style={{ padding:'13px 14px' }}>
              <div style={{ fontSize:11, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:8 }}>LIFETIME</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink }}>{u.lessons}</div><div style={{ fontSize:9.5, color:T.ink4, marginTop:3 }}>Lessons</div></div>
                <div><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink }}>{u.hours}h</div><div style={{ fontSize:9.5, color:T.ink4, marginTop:3 }}>Studied</div></div>
                <div><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink }}>{u.friends}</div><div style={{ fontSize:9.5, color:T.ink4, marginTop:3 }}>Friends</div></div>
              </div>
            </MCard>
          </>
        )}

        {tab === 'badges' && (
          <>
            <MCard style={{ padding:'14px 14px', marginBottom:10, display:'flex', alignItems:'center', gap:13 }}>
              <div style={{ width:48, height:48, borderRadius:24, background:'#E0A23A', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.trophy ? Icon.trophy({width:18,height:18}) : '🏆'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:T.serif, fontSize:15, color:T.ink, lineHeight:1.1 }}>Latest · Vocabulary Builder</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:3 }}>500 Spanish words mastered</div>
              </div>
            </MCard>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {[
                {n:'First Steps', e:true,  c:T.brand},        {n:'Week One', e:true,  c:'#5A9C7A'},      {n:'Vocab Builder', e:true, c:'#E0A23A'},
                {n:'Conversationalist', e:true, c:'#7C5BD6'}, {n:'Listener Pro', e:true, c:'#3D8A5F'},   {n:'Reading Whiz', e:true, c:'#A6486B'},
                {n:'Streak 30', e:false, c:T.ink5},           {n:'Streak 100', e:false, c:T.ink5},       {n:'Polyglot', e:false, c:T.ink5},
              ].map((b, i) => (
                <MCard key={i} style={{ padding:'14px 8px', textAlign:'center', opacity: b.e ? 1 : 0.5 }}>
                  <div style={{ width:42, height:42, borderRadius:21, background: b.e ? `${b.c}1a` : T.bg2, color: b.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 7px', border: b.e ? `1.5px solid ${b.c}33` : `1px dashed ${T.hairline}` }}>{Icon.star ? Icon.star({width:16,height:16}) : '★'}</div>
                  <div style={{ fontSize:9.5, fontWeight:700, color: b.e ? T.ink : T.ink5, lineHeight:1.2 }}>{b.n}</div>
                </MCard>
              ))}
            </div>
            <button style={{ width:'100%', padding:'10px', borderRadius:11, background:T.card, color:T.ink2, fontSize:11.5, fontWeight:700, border:`1px solid ${T.hairline}`, marginTop:10 }}>All 18 badges →</button>
          </>
        )}

        {tab === 'shared' && (
          <>
            <div style={{ padding:'16px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:13, marginBottom:12 }}>
              <div style={{ fontSize:10, fontWeight:800, color:T.brand, letterSpacing:'.12em', marginBottom:6 }}>YOU & YUKI</div>
              <div style={{ fontFamily:T.serif, fontSize:15, color:T.ink, lineHeight:1.35, marginBottom:7 }}>"Both studying Spanish · same B2 level · joined within 2 weeks of each other."</div>
              <div style={{ fontSize:11, color:T.ink3, lineHeight:1.5 }}>You're a great match for daily streak buddies and weekend tutor sessions.</div>
            </div>
            <MCard style={{ padding:0, overflow:'hidden', marginBottom:10 }}>
              {[
                { l:'Languages',     v:'🇪🇸 Spanish · both B2' },
                { l:'Pace',          v:'Yuki: 25 min/day · You: 18 min/day' },
                { l:'Best time',     v:'Both prefer mornings' },
                { l:'Mutual friends',v:'8 people · Marcus, Anaís +6' },
                { l:'Met',           v:'In Spanish discussion · Apr 2024' },
              ].map((r, i) => (
                <div key={r.l} style={{ display:'flex', justifyContent:'space-between', padding:'11px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', fontSize:12 }}>
                  <span style={{ color:T.ink4, fontWeight:600 }}>{r.l}</span>
                  <span style={{ color:T.ink, fontWeight:600, textAlign:'right' }}>{r.v}</span>
                </div>
              ))}
            </MCard>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={()=>nav('tutor')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.brand, color:'#fff', fontSize:12, fontWeight:700, border:'none', boxShadow:`0 4px 12px ${T.brand}40` }}>Practice together</button>
              <button onClick={()=>nav('leaderboard')} style={{ flex:1, padding:'12px', borderRadius:11, background:T.card, color:T.ink, fontSize:12, fontWeight:700, border:`1px solid ${T.hairline}` }}>Compare on board</button>
            </div>
          </>
        )}

        {/* Interests footer */}
        <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${T.hairline}` }}>
          <div style={{ fontSize:10, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:7 }}>INTERESTS</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {u.interests.map(t => <span key={t} style={{ padding:'5px 10px', background:T.card, border:`1px solid ${T.hairline}`, borderRadius:99, fontSize:10.5, color:T.ink2, fontWeight:600 }}>{t}</span>)}
          </div>
        </div>

        <div style={{ textAlign:'center', fontSize:10, color:T.ink5, marginTop:18 }}>Member since {u.joined} · 128 mutual followers</div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// DM THREAD
// ══════════════════════════════════════════════════════════════════
function MDMThreadPageV5() {
  const [draft, setDraft] = useStV5B2('');
  const nav = (id) => window.__nav && window.__nav(id);
  const messages = [
    { who:'them', t:'¡Hola! ¿Cómo va el estudio?',                 tr:'Hi! How\'s studying going?',                  time:'09:14' },
    { who:'me',   t:'Bien — empecé el módulo de gramática ayer',   tr:'Good — started the grammar module yesterday', time:'09:16' },
    { who:'them', t:'¿Quieres practicar conmigo el sábado?',        tr:'Want to practice with me on Saturday?',        time:'09:18' },
    { who:'me',   t:'¡Sí! ¿A qué hora?',                            tr:'Yes! What time?',                              time:'09:18' },
    { who:'them', t:'¿A las 10? Te paso el link de Zoom',            tr:'10am? I\'ll send you the Zoom link',           time:'09:19' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'hidden' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
        <button onClick={()=>nav('friends')} style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink2, fontSize:16, border:'none' }}>‹</button>
        <button onClick={()=>nav('public_profile')} style={{ display:'flex', alignItems:'center', gap:9, flex:1, background:'none', border:'none', textAlign:'left' }}>
          <div style={{ width:34, height:34, borderRadius:17, background:'linear-gradient(135deg,#3D5BA8,#7C5BD6)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>YT</div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.2 }}>Yuki Tanaka</div>
            <div style={{ fontSize:10.5, color:'#5A9C7A', marginTop:1, display:'flex', alignItems:'center', gap:4 }}><span style={{ width:5, height:5, borderRadius:3, background:'#5A9C7A' }}/>Online · Speaks Spanish</div>
          </div>
        </button>
        <button style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink3, border:`1px solid ${T.hairline}` }}>{Icon.mic ? Icon.mic({width:13,height:13}) : '🎙'}</button>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'16px 14px' }}>
        <div style={{ textAlign:'center', fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.14em', marginBottom:18 }}>TODAY</div>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.who === 'me' ? 'flex-end' : 'flex-start', marginBottom:9 }}>
            <div style={{ maxWidth:'78%' }}>
              <div style={{ background: m.who === 'me' ? T.ink : T.card, color: m.who === 'me' ? '#fff' : T.ink, padding:'9px 13px', borderRadius: m.who === 'me' ? '14px 14px 4px 14px' : '14px 14px 14px 4px', border: m.who === 'me' ? 'none' : `1px solid ${T.hairline}`, boxShadow: m.who === 'me' ? 'none' : MT.shadowSm }}>
                <div style={{ fontFamily:T.serif, fontSize:14, lineHeight:1.35 }}>{m.t}</div>
                <div style={{ fontSize:10.5, color: m.who === 'me' ? 'rgba(255,255,255,.55)' : T.ink5, marginTop:2, fontStyle:'italic', fontFamily:T.serif }}>{m.tr}</div>
              </div>
              <div style={{ fontSize:9.5, color:T.ink5, marginTop:3, textAlign: m.who === 'me' ? 'right' : 'left', padding:'0 4px', letterSpacing:'.04em' }}>{m.time}</div>
            </div>
          </div>
        ))}
        <div style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 11px', background:T.card, border:`1px solid ${T.hairline}`, borderRadius:'14px 14px 14px 4px', width:'fit-content', marginTop:8 }}>
          {[0,1,2].map(i=><div key={i} style={{ width:5, height:5, borderRadius:3, background:T.ink5, opacity: 0.3 + (i % 3) * 0.3 }}/>)}
        </div>
      </div>

      <div style={{ padding:'10px 12px 14px', borderTop:`1px solid ${T.hairline}`, background:T.card, display:'flex', gap:8, alignItems:'flex-end' }}>
        <button style={{ width:38, height:38, borderRadius:10, background:T.bg2, color:T.ink3, fontSize:15, border:`1px solid ${T.hairline}` }}>+</button>
        <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Escribe un mensaje…" style={{ flex:1, padding:'10px 13px', borderRadius:11, background:T.bg2, border:`1px solid ${T.border}`, fontSize:13, color:T.ink, outline:'none' }}/>
        <button style={{ width:38, height:38, borderRadius:10, background: draft ? T.brand : T.bg3, color:'#fff', boxShadow: draft ? `0 4px 12px ${T.brand}55` : 'none', border:'none' }}>{Icon.arrow ? Icon.arrow({width:14,height:14}) : '→'}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// ACTIVITY FEED
// ══════════════════════════════════════════════════════════════════
function MActivityFeedPageV5() {
  const [filter, setFilter] = useStV5B2('all');
  const nav = (id) => window.__nav && window.__nav(id);
  const items = [
    { who:'Yuki Tanaka',     init:'YT', g:'linear-gradient(135deg,#3D5BA8,#7C5BD6)', kind:'streak',  t:'hit a',          o:'42-day streak',                tt:'2h ago', em:'🔥' },
    { who:'Carlos Ruíz',     init:'CR', g:'linear-gradient(135deg,#E08F4D,#D26890)', kind:'lesson',  t:'completed',      o:'Spanish · Lesson 12',          tt:'4h ago', em:null },
    { who:'Anaís Rodríguez', init:'AR', g:'linear-gradient(135deg,#5A9C7A,#3D8A5F)', kind:'badge',   t:'earned',         o:'Vocabulary Builder badge',     tt:'6h ago', em:'⭐' },
    { who:'Marcus Lee',      init:'ML', g:'linear-gradient(135deg,#7C5BD6,#3D5BA8)', kind:'tutor',   t:'finished a',     o:'30-min tutor session',         tt:'Yesterday', em:null },
    { who:'Yuki Tanaka',     init:'YT', g:'linear-gradient(135deg,#3D5BA8,#7C5BD6)', kind:'level',   t:'reached',        o:'Level 14',                     tt:'Yesterday', em:'🎉' },
    { who:'Sofía Martínez',  init:'SM', g:'linear-gradient(135deg,#D26890,#E08F4D)', kind:'lesson',  t:'completed',      o:'Spanish Reading · Module 3',   tt:'2 days ago', em:null },
  ];
  const visible = filter === 'all' ? items : items.filter(i => i.kind === filter);
  return (
    <>
      <MobileHeader back title="Activity"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b2Pre eyebrow="FRIENDS · LAST 48 HOURS" title="What your circle's up to" lede="Updates from people you study with — streaks, lessons, badges and tutor sessions."/>

        <div style={{ display:'flex', gap:6, overflowX:'auto', padding:'2px 6px 2px', marginBottom:14 }}>
          {[{id:'all',l:'All'},{id:'streak',l:'Streaks'},{id:'lesson',l:'Lessons'},{id:'badge',l:'Badges'},{id:'tutor',l:'Tutor'}].map(f => {
            const a = filter === f.id;
            return <button key={f.id} onClick={()=>setFilter(f.id)} style={{ flexShrink:0, padding:'7px 12px', borderRadius:99, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink2, fontSize:11.5, fontWeight:600, border:`1px solid ${a ? T.ink : T.hairline}` }}>{f.l}</button>;
          })}
        </div>

        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {visible.map((it, i) => (
            <button key={i} onClick={()=>nav('public_profile')} style={{ width:'100%', display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background:'none', textAlign:'left' }}>
              <div style={{ width:38, height:38, borderRadius:19, background:it.g, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13, flexShrink:0, position:'relative' }}>
                {it.init}
                {it.em && <div style={{ position:'absolute', bottom:-3, right:-3, fontSize:13 }}>{it.em}</div>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.4 }}>
                  <span style={{ fontWeight:700 }}>{it.who}</span> <span style={{ color:T.ink3 }}>{it.t}</span> <span style={{ fontWeight:700, fontFamily:T.serif }}>{it.o}</span>
                </div>
                <div style={{ fontSize:10, color:T.ink5, marginTop:3, letterSpacing:'.04em' }}>{it.tt.toUpperCase()}</div>
              </div>
              <span style={{ color:T.ink5, fontSize:18 }}>›</span>
            </button>
          ))}
        </MCard>

        <div style={{ padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink, lineHeight:1.5 }}>"Add 5 more friends to see a richer activity feed and get accountability nudges."</div>
        </div>
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MTutorCallPageV5, MTutorHistoryPageV5, MPublicProfilePageV5, MDMThreadPageV5, MActivityFeedPageV5,
});
