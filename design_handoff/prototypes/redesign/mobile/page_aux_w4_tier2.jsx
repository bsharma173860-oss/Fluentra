// ── Mobile WAVE 4 Tier 2 · Tutor, Pricing, Search, Leaderboard, Course,
//    Grammar, Help, Module Results, States, Onboarding
// Phone-native redesigns: gradient hero cards, layered surfaces, glass tabs.

const w4t2Hide = `
.w4t2-hide-scroll::-webkit-scrollbar{display:none}
.w4t2-hide-scroll{scrollbar-width:none;-ms-overflow-style:none}
`;
if (typeof document !== 'undefined' && !document.getElementById('w4t2-hide-style')) {
  const s = document.createElement('style'); s.id='w4t2-hide-style'; s.textContent=w4t2Hide; document.head.appendChild(s);
}

const w4t2Avatar = (initials, size=40, grad) => (
  <div style={{ width:size, height:size, borderRadius:size/2, background: grad || `linear-gradient(135deg, ${T.brand} 0%, ${T.brandHover || T.brand} 100%)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize: size*0.42, letterSpacing:'-.02em', flexShrink:0 }}>{initials}</div>
);

// Tab strip (segmented, glass-style) used by several pages
const W4Tabs = ({ tabs, value, onChange }) => (
  <div style={{ display:'flex', gap:6, padding:4, background:MT.bg2, border:`1px solid ${MT.hairline}`, borderRadius:99, marginBottom:14 }}>
    {tabs.map(t => {
      const sel = value === t.id;
      return (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex:1, padding:'8px 10px', borderRadius:99,
          background: sel ? MT.card : 'transparent',
          color: sel ? MT.ink : MT.ink4,
          fontSize:11.5, fontWeight: sel ? 700 : 600,
          boxShadow: sel ? MT.shadowSm : 'none',
          letterSpacing:'-.005em',
        }}>{t.label}</button>
      );
    })}
  </div>
);

// ═══════════════════════════════════════════════════════════
// TUTOR · WAVE 4
// ═══════════════════════════════════════════════════════════
function MTutorPageW4() {
  const initial = (typeof TUTOR_INITIAL !== 'undefined') ? TUTOR_INITIAL : [
    { role:'ai',   text:"Hi Maria — welcome back! Want to keep working on Writing Task 2, or start something new?", when:'2 min ago' },
    { role:'user', text:"Let's keep going on Task 2. Give me a sample question.", when:'2 min ago' },
    { role:'ai',   text:"Great. Some people argue that schools should focus only on academic subjects. Others think creative subjects matter too. Discuss both views and give your opinion.\n\nWrite a body paragraph — I'll watch.", when:'just now' },
  ];
  const quick = (typeof TUTOR_QUICK !== 'undefined') ? TUTOR_QUICK : [
    { ic:'✦', label:'Explain a grammar rule' },
    { ic:'❤︎', label:'Practice a conversation' },
    { ic:'⚑', label:'Check my writing' },
    { ic:'◐', label:'Translate a phrase' },
  ];
  const history = (typeof TUTOR_HISTORY !== 'undefined') ? TUTOR_HISTORY : [
    { id:'h1', title:'IELTS Writing Task 2 — coherence', when:'Today', active:true },
    { id:'h2', title:'Past conditional vs subjunctive', when:'Yesterday' },
    { id:'h3', title:'Academic phrasing for essays', when:'2d ago' },
  ];
  const [msgs, setMsgs] = React.useState(initial);
  const [input, setInput] = React.useState('');
  const [sheet, setSheet] = React.useState(false);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { role:'user', text:input, when:'just now' }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { role:'ai', text:"Solid sentence. Let's tighten the topic — try opening with a claim, not a fact.", when:'just now' }]), 700);
  };

  return (
    <MobileFrame>
      {/* Compact header w/ Lía gradient avatar */}
      <div style={{ padding:'4px 16px 10px', flexShrink:0, display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => window.__nav && window.__nav('dashboard')} style={{ width:36, height:36, borderRadius:18, background:MT.card, border:`1px solid ${MT.hairline}`, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:MT.shadowSm }}>{Icon.arrowL && Icon.arrowL()}</button>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:9 }}>
          {w4t2Avatar('L', 36, `linear-gradient(135deg, ${T.brand} 0%, #C97A4F 100%)`)}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:14, fontWeight:700, color:MT.ink, letterSpacing:'-.01em', display:'flex', alignItems:'center', gap:5 }}>Lía <span style={{ width:6, height:6, borderRadius:3, background:'#5A9C7A' }}/></div>
            <div style={{ fontSize:10.5, color:MT.ink4 }}>AI tutor · IELTS English</div>
          </div>
        </div>
        <button onClick={() => setSheet(true)} style={{ width:36, height:36, borderRadius:18, background:MT.card, border:`1px solid ${MT.hairline}`, color:MT.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, boxShadow:MT.shadowSm }}>≡</button>
      </div>

      {/* Messages */}
      <div className="w4t2-hide-scroll" style={{ flex:1, overflowY:'auto', padding:'8px 14px 10px' }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom:10 }}>
            {m.role === 'ai' && <div style={{ width:24, marginRight:8, marginTop:5 }}>{w4t2Avatar('L', 24, `linear-gradient(135deg, ${T.brand} 0%, #C97A4F 100%)`)}</div>}
            <div style={{
              maxWidth:'78%',
              padding:'10px 13px',
              borderRadius: m.role === 'user' ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
              background: m.role === 'user' ? T.brand : MT.card,
              color: m.role === 'user' ? '#fff' : MT.ink,
              fontSize:13.5, lineHeight:1.5, letterSpacing:'-.005em',
              border: m.role === 'user' ? 'none' : `1px solid ${MT.hairline}`,
              boxShadow: m.role === 'user' ? `0 6px 14px ${T.brand}40` : MT.shadowSm,
              whiteSpace:'pre-wrap',
            }}>{m.text}</div>
          </div>
        ))}
      </div>

      {/* Quick prompts (when input empty) */}
      {!input && (
        <div style={{ padding:'4px 14px 6px', display:'flex', gap:6, overflowX:'auto', flexShrink:0 }} className="w4t2-hide-scroll">
          {quick.slice(0,5).map(q => (
            <button key={q.label} onClick={() => setInput(q.label.replace(/^[A-Za-z]+ /, ''))} style={{ padding:'7px 12px', borderRadius:99, background:MT.card, border:`1px solid ${MT.hairline}`, fontSize:11, color:MT.ink2, fontWeight:600, display:'flex', alignItems:'center', gap:5, flexShrink:0, boxShadow:MT.shadowSm }}>
              <span style={{ color:T.brand }}>{q.ic}</span>{q.label}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div style={{ padding:'8px 14px 14px', flexShrink:0, background:`linear-gradient(to top, ${MT.bg} 60%, transparent)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 6px 6px 16px', background:MT.card, borderRadius:26, border:`1px solid ${MT.hairline}`, boxShadow:MT.shadowMd }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask Lía anything…" style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, color:MT.ink, padding:'8px 0', minWidth:0 }}/>
          <button style={{ width:34, height:34, borderRadius:17, background:MT.bg2, color:MT.ink3, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.mic ? Icon.mic({ width:14, height:14 }) : '🎙'}</button>
          <button onClick={send} style={{ width:38, height:38, borderRadius:19, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 10px ${T.brand}55` }}>↑</button>
        </div>
      </div>

      {/* History sheet */}
      {sheet && (
        <div onClick={()=>setSheet(false)} style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.4)', zIndex:50, display:'flex', alignItems:'flex-end' }}>
          <div onClick={e=>e.stopPropagation()} style={{ width:'100%', background:MT.card, borderRadius:'24px 24px 0 0', padding:'12px 14px 24px', maxHeight:'68%', display:'flex', flexDirection:'column', boxShadow:MT.shadowXl }}>
            <div style={{ width:36, height:4, borderRadius:2, background:MT.hairline, margin:'4px auto 14px' }}/>
            <div style={{ fontFamily:T.serif, fontSize:20, color:MT.ink, marginBottom:12, padding:'0 4px' }}>Conversations</div>
            <div className="w4t2-hide-scroll" style={{ flex:1, overflowY:'auto' }}>
              {history.map(h => (
                <button key={h.id} onClick={()=>setSheet(false)} style={{ width:'100%', padding:'12px 12px', borderRadius:14, background: h.active ? T.brandLight : 'transparent', border: h.active ? `1px solid ${T.brand}30` : `1px solid transparent`, marginBottom:6, textAlign:'left', display:'flex', flexDirection:'column', gap:3 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:MT.ink, lineHeight:1.35 }}>{h.title}</div>
                  <div style={{ fontSize:10.5, color:MT.ink4 }}>{h.when}</div>
                </button>
              ))}
            </div>
            <button onClick={()=>{ setSheet(false); window.__nav && window.__nav('tutor_history'); }} style={{ marginTop:8, padding:'12px', borderRadius:12, background:MT.bg2, color:MT.ink2, fontSize:13, fontWeight:700, border:`1px solid ${MT.hairline}` }}>View all history</button>
          </div>
        </div>
      )}
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// PRICING · WAVE 4
// ═══════════════════════════════════════════════════════════
function MPricingPageW4() {
  const plans = (typeof PRICING_PLANS !== 'undefined') ? PRICING_PLANS : [];
  const [billing, setBilling] = React.useState('yearly');
  const [active, setActive] = React.useState('pro');
  const cur = plans.find(p => p.id === active) || plans[1] || plans[0];

  return (
    <MobileFrame>
      <MobileHeader title="Plans" back onBack={()=>window.__nav && window.__nav('settings')} large={false} right={
        <button style={{ fontSize:11.5, color:MT.ink3, fontWeight:600 }}>Restore</button>
      }/>
      <MobileBody padding={[0,16,32]}>
        {/* Hero — Pro upsell with glow */}
        <div style={{ background:`linear-gradient(160deg, #1F1B16 0%, #2D241D 60%, ${T.brand}40 100%)`, borderRadius:24, padding:'22px 20px 20px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:14 }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}66 0%, transparent 70%)` }}/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.16)', backdropFilter:'blur(8px)', fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>
              <span style={{ width:5, height:5, borderRadius:3, background:'#FFC859' }}/> 7-day free trial
            </div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.04, letterSpacing:'-.025em', marginBottom:6 }}>Unlock every<br/>language.</div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.72)', lineHeight:1.5, marginBottom:14 }}>Pro learners pass exams 3.4× faster. Cancel anytime.</div>
            {/* Billing toggle */}
            <div style={{ display:'flex', gap:4, padding:4, background:'rgba(255,255,255,.10)', borderRadius:99, marginBottom:14, width:'fit-content' }}>
              {[{id:'monthly',l:'Monthly'},{id:'yearly',l:'Yearly · save 33%'}].map(o => {
                const sel = billing === o.id;
                return <button key={o.id} onClick={()=>setBilling(o.id)} style={{ padding:'7px 13px', borderRadius:99, background: sel ? '#fff' : 'transparent', color: sel ? '#1F1B16' : 'rgba(255,255,255,.7)', fontSize:11, fontWeight:700 }}>{o.l}</button>;
              })}
            </div>
          </div>
        </div>

        {/* Plan cards */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
          {plans.map(p => {
            const sel = active === p.id;
            const price = billing === 'yearly' ? p.yearly : p.monthly;
            const isPop = p.popular;
            return (
              <button key={p.id} onClick={()=>setActive(p.id)} style={{
                textAlign:'left',
                background: isPop ? `linear-gradient(135deg, ${T.brand} 0%, #C46B3D 100%)` : MT.card,
                color: isPop ? '#fff' : MT.ink,
                border: sel ? (isPop ? '2px solid rgba(255,255,255,.6)' : `2px solid ${T.brand}`) : (isPop ? '2px solid transparent' : `1px solid ${MT.hairline}`),
                borderRadius:18, padding:'14px 16px',
                boxShadow: sel ? MT.shadowMd : MT.shadowSm,
                position:'relative',
              }}>
                {isPop && <div style={{ position:'absolute', top:-8, right:14, padding:'3px 9px', borderRadius:99, background:'#FFC859', color:'#1F1B16', fontSize:9.5, fontWeight:800, letterSpacing:'.08em' }}>POPULAR</div>}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:4 }}>
                  <div>
                    <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1, letterSpacing:'-.015em' }}>{p.name}</div>
                    <div style={{ fontSize:11, color: isPop ? 'rgba(255,255,255,.72)' : MT.ink4, marginTop:3 }}>{p.tagline}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, letterSpacing:'-.02em' }}>${price === 0 ? '0' : (billing === 'yearly' ? (price/12).toFixed(2) : price)}</div>
                    <div style={{ fontSize:9.5, color: isPop ? 'rgba(255,255,255,.6)' : MT.ink4, marginTop:3 }}>/ month</div>
                  </div>
                </div>
                {sel && (
                  <div style={{ marginTop:10, paddingTop:10, borderTop: isPop ? '1px solid rgba(255,255,255,.18)' : `1px solid ${MT.hairline}` }}>
                    {p.features.slice(0,5).map(f => (
                      <div key={f.t} style={{ display:'flex', gap:8, alignItems:'center', padding:'4px 0', fontSize:12, color: isPop ? 'rgba(255,255,255,.86)' : MT.ink2 }}>
                        <span style={{ width:14, height:14, borderRadius:7, background: f.on ? (isPop ? 'rgba(255,255,255,.22)' : T.brand) : (isPop ? 'rgba(255,255,255,.08)' : MT.bg2), color: f.on ? '#fff' : (isPop ? 'rgba(255,255,255,.4)' : MT.ink4), display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, flexShrink:0 }}>{f.on ? '✓' : '–'}</span>
                        {f.t}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <button style={{ width:'100%', padding:'14px', borderRadius:14, background: cur && cur.popular ? T.brandGrad : MT.ink, color:'#fff', fontSize:14, fontWeight:700, boxShadow: cur && cur.popular ? `0 8px 18px ${T.brand}55` : MT.shadowMd, marginBottom:14 }}>
          {cur ? cur.cta : 'Continue'}
        </button>

        {/* Trust strip */}
        <div style={{ display:'flex', justifyContent:'space-around', padding:'14px 4px', background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, boxShadow:MT.shadowSm, marginBottom:18 }}>
          {[{l:'Cancel\nanytime'},{l:'7-day\nrefund'},{l:'Score\nguarantee'}].map(b => (
            <div key={b.l} style={{ textAlign:'center', flex:1, fontSize:10.5, color:MT.ink3, fontWeight:600, lineHeight:1.4, whiteSpace:'pre-line' }}>{b.l}</div>
          ))}
        </div>

        {/* Testimonial */}
        <div style={{ background:MT.cardWarm, border:`1px solid ${MT.hairline}`, borderRadius:18, padding:'14px 16px', marginBottom:14, boxShadow:MT.shadowSm }}>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.brand, lineHeight:.6, marginBottom:6 }}>“</div>
          <div style={{ fontSize:13, color:MT.ink2, lineHeight:1.55, fontStyle:'italic', marginBottom:10 }}>I went from 6.0 to 7.5 IELTS in 11 weeks. The AI feedback on my essays is what made the difference.</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            {w4t2Avatar('M', 28)}
            <div>
              <div style={{ fontSize:11.5, fontWeight:700, color:MT.ink }}>Maria S.</div>
              <div style={{ fontSize:10, color:MT.ink4 }}>Madrid · IELTS 7.5</div>
            </div>
          </div>
        </div>

        <div style={{ fontSize:10.5, color:MT.ink4, textAlign:'center', lineHeight:1.6, padding:'0 18px' }}>
          By continuing you agree to our <span style={{ color:MT.ink3, fontWeight:600 }}>Terms</span> and <span style={{ color:MT.ink3, fontWeight:600 }}>Privacy Policy</span>.
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// SEARCH · WAVE 4
// ═══════════════════════════════════════════════════════════
function MSearchPageW4() {
  const [q, setQ] = React.useState('past tense');
  const [tab, setTab] = React.useState('all');

  const results = [
    { kind:'Grammar',  title:'Past tense — passé composé',         sub:'French · B1',  ic:'pen', c:T.writing,   lang:'fr' },
    { kind:'Grammar',  title:'Pretérito indefinido vs imperfecto', sub:'Spanish · B1', ic:'pen', c:T.writing,   lang:'es' },
    { kind:'Lesson',   title:'Past simple — irregular verbs',      sub:'English · A2', ic:'book', c:T.reading,  lang:'en' },
    { kind:'Vocab',    title:'Time expressions: ago, since, for',  sub:'12 cards',     ic:'star', c:T.listening,lang:'en' },
    { kind:'Library',  title:'How to remember past tenses',        sub:'Article · 6 min', ic:'book', c:T.reading, lang:'en' },
    { kind:'Exam Q',   title:'IELTS — Narrate a memory',           sub:'Speaking · Part 2', ic:'mic', c:T.speaking, lang:'en' },
    { kind:'Tutor',    title:"Ask Lía: explain past tenses",       sub:'AI tutor',     ic:'spark',c:{ c:T.brand, bg:T.brandLight }, lang:'en' },
  ];
  const tabs = [
    { id:'all', label:'All' },
    { id:'Lesson', label:'Lessons' },
    { id:'Vocab', label:'Vocab' },
    { id:'Grammar', label:'Grammar' },
    { id:'Library', label:'Library' },
  ];
  const filtered = tab === 'all' ? results : results.filter(r => r.kind === tab);

  const recents = ['IELTS speaking part 2', 'subjunctive', 'numbers in Japanese', 'food vocabulary'];
  const trending = ['conditional sentences', 'kanji radicals', 'phrasal verbs', 'CILS B2'];

  return (
    <MobileFrame>
      <div style={{ padding:'4px 16px 6px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <button onClick={()=>window.__nav && window.__nav('dashboard')} style={{ fontSize:13, color:MT.ink3, fontWeight:600 }}>Cancel</button>
          <div style={{ flex:1, position:'relative' }}>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search lessons, words, grammar…" autoFocus style={{ width:'100%', padding:'11px 14px 11px 38px', borderRadius:14, background:MT.card, border:`1px solid ${MT.hairline}`, fontSize:14, color:MT.ink, outline:'none', boxShadow:MT.shadowSm }}/>
            <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:MT.ink4 }}>{Icon.search ? Icon.search({ width:16, height:16 }) : '🔍'}</div>
            {q && <button onClick={()=>setQ('')} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:22, height:22, borderRadius:11, background:MT.bg2, color:MT.ink4, fontSize:11 }}>×</button>}
          </div>
        </div>
      </div>

      {!q ? (
        <MobileBody padding={[14,16,32]}>
          {/* Recents */}
          <div style={{ fontSize:11.5, color:MT.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10, padding:'0 4px' }}>Recent</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:18 }}>
            {recents.map(r => (
              <button key={r} onClick={()=>setQ(r)} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:12, textAlign:'left', boxShadow:MT.shadowSm }}>
                <span style={{ color:MT.ink4 }}>↩</span>
                <span style={{ flex:1, fontSize:13, color:MT.ink2 }}>{r}</span>
                <span style={{ color:MT.ink5, fontSize:11 }}>↗</span>
              </button>
            ))}
          </div>
          {/* Trending */}
          <div style={{ fontSize:11.5, color:MT.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10, padding:'0 4px' }}>Trending</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
            {trending.map(t => (
              <button key={t} onClick={()=>setQ(t)} style={{ padding:'8px 12px', borderRadius:99, background:MT.card, border:`1px solid ${MT.hairline}`, fontSize:12, color:MT.ink2, fontWeight:600, boxShadow:MT.shadowSm }}>{t}</button>
            ))}
          </div>
        </MobileBody>
      ) : (
        <MobileBody padding={[10,14,32]}>
          <W4Tabs tabs={tabs} value={tab} onChange={setTab}/>
          <div style={{ fontSize:11.5, color:MT.ink4, marginBottom:8, padding:'0 4px' }}>{filtered.length} results for <span style={{ color:MT.ink2, fontWeight:600 }}>"{q}"</span></div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {filtered.map((r, i) => (
              <button key={i} style={{ display:'flex', gap:11, padding:'12px 14px', background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, textAlign:'left', boxShadow:MT.shadowSm, alignItems:'flex-start' }}>
                <div style={{ width:36, height:36, borderRadius:10, background: r.c.bg, color: r.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {Icon[r.ic] ? Icon[r.ic]({ width:16, height:16 }) : '◇'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
                    <span style={{ fontSize:9.5, color:r.c.c, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>{r.kind}</span>
                  </div>
                  <div style={{ fontSize:13.5, fontWeight:600, color:MT.ink, lineHeight:1.35, letterSpacing:'-.005em' }}>{r.title}</div>
                  <div style={{ fontSize:11, color:MT.ink4, marginTop:3 }}>{r.sub}</div>
                </div>
              </button>
            ))}
          </div>
        </MobileBody>
      )}
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// LEADERBOARD · WAVE 4
// ═══════════════════════════════════════════════════════════
function MLeaderboardPageW4() {
  const [tab, setTab] = React.useState('global');
  const [time, setTime] = React.useState('week');

  const podium = (typeof LB_TOP3 !== 'undefined') ? LB_TOP3 : [
    { rank:1, name:'Aiko Tanaka', country:'🇯🇵', score:'8.9', streak:178 },
    { rank:2, name:'Lukas Bauer', country:'🇩🇪', score:'8.8', streak:142 },
    { rank:3, name:'Sofia Rossi', country:'🇮🇹', score:'8.7', streak:96  },
  ];
  const rows = (typeof LB_ROWS !== 'undefined') ? LB_ROWS.slice(0, 7) : [
    { rank:4, name:'Yuki N.',  country:'🇯🇵', score:'8.6', streak:120 },
    { rank:5, name:'Priya S.', country:'🇮🇳', score:'8.6', streak:88  },
    { rank:6, name:'Diego M.', country:'🇲🇽', score:'8.5', streak:67  },
    { rank:7, name:'Hannah W.',country:'🇬🇧', score:'8.4', streak:54  },
    { rank:8, name:'Mei L.',   country:'🇨🇳', score:'8.4', streak:73  },
  ];

  return (
    <MobileFrame>
      <MobileHeader eyebrow="LEADERBOARD" title="Top of the world" large/>
      <MobileBody padding={[0,16,32]}>
        {/* Tabs */}
        <W4Tabs tabs={[{id:'global',label:'Global'},{id:'friends',label:'Friends'},{id:'country',label:'Country'}]} value={tab} onChange={setTab}/>
        {/* Time chips */}
        <div style={{ display:'flex', gap:6, marginBottom:14 }}>
          {[{id:'week',l:'This week'},{id:'month',l:'Month'},{id:'all',l:'All time'}].map(t => {
            const sel = time === t.id;
            return <button key={t.id} onClick={()=>setTime(t.id)} style={{ padding:'6px 12px', borderRadius:99, background: sel ? MT.ink : MT.card, color: sel ? '#fff' : MT.ink3, fontSize:11, fontWeight:600, border:`1px solid ${sel ? MT.ink : MT.hairline}` }}>{t.l}</button>;
          })}
        </div>

        {/* Podium hero */}
        <div style={{ background:`linear-gradient(160deg, #1F1B16 0%, #2D241D 50%, #5A4A3A 100%)`, borderRadius:24, padding:'18px 16px 22px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:14 }}>
          <div style={{ position:'absolute', top:-30, left:'50%', transform:'translateX(-50%)', width:240, height:120, background:`radial-gradient(circle, #FFC85944 0%, transparent 70%)` }}/>
          <div style={{ position:'relative', display:'flex', alignItems:'flex-end', justifyContent:'space-around', gap:8 }}>
            {/* 2nd */}
            <div style={{ textAlign:'center', width:'30%' }}>
              {w4t2Avatar(podium[1].name.split(' ').map(n=>n[0]).join(''), 44, 'linear-gradient(135deg, #B8B0A6, #8E867C)')}
              <div style={{ fontSize:11, fontWeight:700, marginTop:6, lineHeight:1.2 }}>{podium[1].name.split(' ')[0]}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.6)', marginBottom:8 }}>{podium[1].country}</div>
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.16)', borderRadius:10, padding:'10px 4px', height:60, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1 }}>{podium[1].score}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.5)', marginTop:2, fontWeight:700 }}>2nd</div>
              </div>
            </div>
            {/* 1st */}
            <div style={{ textAlign:'center', width:'34%' }}>
              <div style={{ fontSize:18, marginBottom:2 }}>👑</div>
              {w4t2Avatar(podium[0].name.split(' ').map(n=>n[0]).join(''), 56, `linear-gradient(135deg, #FFC859, #E59B22)`)}
              <div style={{ fontSize:12, fontWeight:700, marginTop:6, lineHeight:1.2 }}>{podium[0].name.split(' ')[0]}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.6)', marginBottom:8 }}>{podium[0].country}</div>
              <div style={{ background:`linear-gradient(135deg, #FFC85933, #E59B2233)`, border:'1px solid #FFC85966', borderRadius:12, padding:'12px 4px', height:80, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1, color:'#FFD980' }}>{podium[0].score}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.7)', marginTop:3, fontWeight:700, letterSpacing:'.1em' }}>1ST</div>
              </div>
            </div>
            {/* 3rd */}
            <div style={{ textAlign:'center', width:'30%' }}>
              {w4t2Avatar(podium[2].name.split(' ').map(n=>n[0]).join(''), 40, 'linear-gradient(135deg, #C99066, #8B5E3F)')}
              <div style={{ fontSize:11, fontWeight:700, marginTop:6, lineHeight:1.2 }}>{podium[2].name.split(' ')[0]}</div>
              <div style={{ fontSize:9, color:'rgba(255,255,255,.6)', marginBottom:8 }}>{podium[2].country}</div>
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.16)', borderRadius:10, padding:'10px 4px', height:48, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column' }}>
                <div style={{ fontFamily:T.serif, fontSize:16, lineHeight:1 }}>{podium[2].score}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.5)', marginTop:2, fontWeight:700 }}>3rd</div>
              </div>
            </div>
          </div>
        </div>

        {/* Your rank card */}
        <div style={{ background:`linear-gradient(135deg, ${T.brandLight} 0%, ${MT.cardWarm} 100%)`, border:`1px solid ${T.brand}30`, borderRadius:18, padding:'14px 16px', marginBottom:18, display:'flex', alignItems:'center', gap:12, boxShadow:MT.shadowSm }}>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.brand, lineHeight:1, letterSpacing:'-.02em', minWidth:48 }}>#42</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:MT.ink }}>You · María García</div>
            <div style={{ fontSize:11, color:MT.ink4, marginTop:3 }}>Band 7.5 · 42-day streak · ↑ 6 this week</div>
          </div>
          <button style={{ width:34, height:34, borderRadius:17, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, boxShadow:`0 4px 8px ${T.brand}55` }}>↑</button>
        </div>

        {/* Rest of leaderboard */}
        <MobileSectionHead title="Top 100" sub={`Rank 4 to 8 of ${rows.length + 95}`}/>
        <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:18, overflow:'hidden', boxShadow:MT.shadowSm }}>
          {rows.map((r, i) => (
            <div key={r.rank} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderBottom: i < rows.length - 1 ? `1px solid ${MT.divider}` : 'none' }}>
              <div style={{ fontFamily:T.serif, fontSize:15, color:MT.ink3, minWidth:24, textAlign:'center' }}>{r.rank}</div>
              {w4t2Avatar(r.name.split(' ').map(n=>n[0]).join('').slice(0,2), 32)}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:600, color:MT.ink, letterSpacing:'-.005em' }}>{r.name} <span style={{ fontSize:11, marginLeft:3 }}>{r.country}</span></div>
                <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>🔥 {r.streak}d</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:16, color:MT.ink, letterSpacing:'-.01em' }}>{r.score}</div>
            </div>
          ))}
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// COURSE · WAVE 4
// ═══════════════════════════════════════════════════════════
function MCourseOverviewPageW4() {
  const [openUnit, setOpenUnit] = React.useState('u3');

  const lang = (typeof window !== 'undefined' && window.__activeLang) || { code:'es', name:'Spanish', accent:T.es?.accent || T.brand };
  const courseName = `${lang.name} · A1 → B1`;
  const progress = 42, lessonsDone = 40, lessonsTotal = 96;
  const accent = lang.accent || T.brand;

  const chapters = [
    { id:'c1', label:'Foundations',     range:'A1',   state:'done',    units:[
      { id:'u1', title:'Hello',           state:'done',    lessons:8,  done:8 },
      { id:'u2', title:'At the café',     state:'done',    lessons:8,  done:8 },
    ]},
    { id:'c2', label:'Everyday life',    range:'A2',   state:'current', units:[
      { id:'u3', title:'A day in the life', state:'current', lessons:10, done:6,
        lessonList:[
          { n:1, title:'Reflexive verbs',           kind:'Lesson',  state:'done' },
          { n:2, title:'Telling time',              kind:'Lesson',  state:'done' },
          { n:3, title:'Routine vocab',             kind:'Vocab',   state:'done' },
          { n:4, title:'Listening · Marisol',       kind:'Listen',  state:'done' },
          { n:5, title:'Speaking · Your morning',   kind:'Speak',   state:'done' },
          { n:6, title:'Writing · Journal entry',   kind:'Write',   state:'done' },
          { n:7, title:'Adverbs of frequency',      kind:'Lesson',  state:'current' },
          { n:8, title:'Reading · Una mañana',      kind:'Read',    state:'locked' },
          { n:9, title:'Quiz — routines',           kind:'Quiz',    state:'locked' },
          { n:10,title:'Mini-project',              kind:'Project', state:'locked' },
        ],
      },
      { id:'u4', title:'Asking the way',  state:'next',    lessons:8,  done:0 },
      { id:'u5', title:'Weekends',        state:'locked',  lessons:9,  done:0 },
    ]},
    { id:'c3', label:'Stories & opinions',range:'B1',   state:'locked',  units:[
      { id:'u6', title:'Once upon a time',state:'locked',  lessons:11, done:0 },
      { id:'u7', title:'In the news',     state:'locked',  lessons:10, done:0 },
    ]},
  ];

  const stateDot = (s) => ({
    done:    { c:'#5A9C7A', bg:'#E2EEDF', l:'Done' },
    current: { c:T.brand,   bg:T.brandLight, l:'Now' },
    next:    { c:MT.ink2,   bg:MT.bg2, l:'Next' },
    locked:  { c:MT.ink5,   bg:MT.bg2, l:'Locked' },
  })[s];

  return (
    <MobileFrame>
      <MobileHeader title={courseName} back onBack={()=>window.__nav && window.__nav('lang')} large={false}/>
      <MobileBody padding={[0,16,32]}>
        {/* Hero card with accent gradient */}
        <div style={{ background:`linear-gradient(160deg, ${accent} 0%, ${accent}DD 60%, ${MT.ink} 130%)`, borderRadius:22, padding:'18px 18px 16px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:14 }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.12)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>YOUR PATH</div>
            <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:6 }}>From greetings<br/>to opinions on the news.</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', lineHeight:1.5, marginBottom:14 }}>{lessonsDone} / {lessonsTotal} lessons · ~12 weeks ahead</div>
            <div style={{ height:6, borderRadius:3, background:'rgba(255,255,255,.15)', overflow:'hidden', marginBottom:6 }}>
              <div style={{ height:'100%', width:`${progress}%`, background:'#fff', borderRadius:3 }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, color:'rgba(255,255,255,.65)', fontWeight:600 }}>
              <span>{progress}% complete</span>
              <span>14d streak here · CEFR A2</span>
            </div>
          </div>
        </div>

        {/* Resume CTA */}
        <button onClick={()=>window.__nav && window.__nav('reading')} style={{ width:'100%', padding:'14px 16px', borderRadius:16, background:MT.card, border:`1px solid ${MT.hairline}`, boxShadow:MT.shadowMd, marginBottom:18, display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
          <div style={{ width:42, height:42, borderRadius:21, background:`linear-gradient(135deg, ${T.brand}, ${T.brand}AA)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 10px ${T.brand}66` }}>{Icon.play ? Icon.play({ width:14, height:14 }) : '▶'}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, color:T.brand, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase' }}>RESUME</div>
            <div style={{ fontSize:14, fontWeight:700, color:MT.ink, marginTop:1 }}>Adverbs of frequency</div>
            <div style={{ fontSize:11, color:MT.ink4, marginTop:1 }}>Lesson 7 of 10 · ~10 min</div>
          </div>
          <span style={{ color:MT.ink4 }}>›</span>
        </button>

        {/* Chapters */}
        <MobileSectionHead title="Chapters" sub="4 chapters · 96 lessons total"/>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {chapters.map(ch => (
            <div key={ch.id}>
              {/* Chapter header */}
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8, padding:'0 4px' }}>
                <div style={{ width:24, height:24, borderRadius:12, background: ch.state === 'done' ? '#5A9C7A' : ch.state === 'current' ? T.brand : MT.ink5, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{ch.state === 'done' ? '✓' : ch.range}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:MT.ink, letterSpacing:'-.005em' }}>{ch.label}</div>
                </div>
                <div style={{ fontSize:10.5, color:MT.ink4, fontWeight:600 }}>{ch.range}</div>
              </div>
              {/* Units */}
              <div style={{ display:'flex', flexDirection:'column', gap:6, marginLeft:34, position:'relative' }}>
                <div style={{ position:'absolute', left:-22, top:0, bottom:0, width:2, background: ch.state === 'locked' ? MT.divider : MT.hairline }}/>
                {ch.units.map(u => {
                  const isOpen = openUnit === u.id;
                  const sd = stateDot(u.state);
                  return (
                    <div key={u.id}>
                      <button onClick={()=>setOpenUnit(isOpen ? null : u.id)} style={{ width:'100%', padding:'12px 14px', background:MT.card, border:`1px solid ${u.state === 'current' ? T.brand+'40' : MT.hairline}`, borderRadius:14, display:'flex', alignItems:'center', gap:10, textAlign:'left', boxShadow:MT.shadowSm }}>
                        <div style={{ width:8, height:8, borderRadius:4, background: sd.c, marginLeft:-4, marginRight:2, boxShadow: u.state === 'current' ? `0 0 0 3px ${T.brand}26` : 'none' }}/>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ fontSize:13.5, fontWeight:600, color: u.state === 'locked' ? MT.ink4 : MT.ink, letterSpacing:'-.005em' }}>{u.title}</div>
                          <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>{u.done}/{u.lessons} lessons · {sd.l}</div>
                        </div>
                        {u.state !== 'locked' && <span style={{ color:MT.ink4, fontSize:14, transform: isOpen ? 'rotate(90deg)' : 'none', transition:'transform .15s' }}>›</span>}
                      </button>
                      {isOpen && u.lessonList && (
                        <div style={{ marginLeft:14, marginTop:6, marginBottom:4, padding:'8px 0', background:MT.bg2, borderRadius:12, border:`1px solid ${MT.hairline}` }}>
                          {u.lessonList.map(l => {
                            const lsd = stateDot(l.state);
                            return (
                              <div key={l.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 14px' }}>
                                <div style={{ width:22, height:22, borderRadius:11, background: lsd.bg, color: lsd.c, fontSize:9.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{l.state === 'done' ? '✓' : l.n}</div>
                                <div style={{ flex:1, fontSize:12.5, color: l.state === 'locked' ? MT.ink4 : MT.ink2, lineHeight:1.4 }}>{l.title}</div>
                                <div style={{ fontSize:9.5, color:MT.ink5, fontWeight:600, letterSpacing:'.05em', textTransform:'uppercase' }}>{l.kind}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// GRAMMAR · WAVE 4
// ═══════════════════════════════════════════════════════════
function MGrammarPageW4() {
  const [topic, setTopic] = React.useState(null);
  const lang = (typeof window !== 'undefined' && window.__activeLang) || { name:'English', accent:T.brand };

  const sections = [
    { name:'Verbs', count:18, c:T.writing, items:[
      { id:'v1', title:'Present simple', sub:'A1 · 8 examples', mastery:0.9 },
      { id:'v2', title:'Present continuous', sub:'A1 · 12 examples', mastery:0.7 },
      { id:'v3', title:'Past simple', sub:'A2 · 14 examples', mastery:0.6, hot:true },
      { id:'v4', title:'Past continuous', sub:'A2 · 9 examples', mastery:0.4 },
      { id:'v5', title:'Present perfect', sub:'B1 · 18 examples', mastery:0.3 },
      { id:'v6', title:'Conditionals · zero, 1st, 2nd, 3rd', sub:'B1 · 22 examples', mastery:0.2, hot:true },
    ]},
    { name:'Nouns & articles', count:9, c:T.reading, items:[
      { id:'n1', title:'Definite vs indefinite articles', sub:'A1', mastery:0.9 },
      { id:'n2', title:'Plural forms — irregular', sub:'A2', mastery:0.5 },
      { id:'n3', title:'Countable / uncountable', sub:'A2', mastery:0.5 },
    ]},
    { name:'Prepositions', count:7, c:T.listening, items:[
      { id:'p1', title:'Time prepositions: at, on, in', sub:'A1', mastery:0.8 },
      { id:'p2', title:'Place prepositions', sub:'A1', mastery:0.7 },
    ]},
  ];

  if (topic) {
    return (
      <MobileFrame>
        <MobileHeader title={topic.title} back onBack={()=>setTopic(null)} large={false}/>
        <MobileBody padding={[0,16,32]}>
          <div style={{ background:`linear-gradient(135deg, ${topic.c.bg} 0%, ${MT.card} 100%)`, border:`1px solid ${topic.c.c}30`, borderRadius:20, padding:'16px 18px', marginBottom:14 }}>
            <div style={{ fontSize:11, fontWeight:700, color:topic.c.c, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>RULE</div>
            <div style={{ fontSize:13.5, color:MT.ink, lineHeight:1.55, fontStyle:'italic' }}>"{topic.title === 'Past simple' ? 'Use past simple to describe completed actions in the past with a clear time reference. Form: subject + verb + -ed (regular) or 2nd form (irregular).' : 'Use this structure to build a precise, idiomatic sentence in the target language.'}"</div>
          </div>

          <MobileSectionHead title="Examples" sub="Tap to hear pronunciation"/>
          <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, overflow:'hidden', marginBottom:14, boxShadow:MT.shadowSm }}>
            {[
              { en:'I worked from home yesterday.',     trans:'(past simple — regular)' },
              { en:"She didn't go to the meeting.",     trans:'(negative form, irregular: go → went)' },
              { en:'Did you call your mother?',          trans:'(question form)' },
              { en:'They lived in Berlin for two years.',trans:'(duration in the past)' },
            ].map((e, i, arr) => (
              <div key={i} style={{ padding:'12px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${MT.divider}` : 'none', display:'flex', gap:10, alignItems:'flex-start' }}>
                <button style={{ width:30, height:30, borderRadius:15, background:topic.c.bg, color:topic.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>▶</button>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, color:MT.ink, lineHeight:1.45 }}>{e.en}</div>
                  <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>{e.trans}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={()=>window.__nav && window.__nav('reading')} style={{ width:'100%', padding:'14px', borderRadius:14, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 8px 18px ${T.brand}55` }}>Practice this rule →</button>
        </MobileBody>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <MobileHeader eyebrow={lang.name?.toUpperCase()} title="Grammar" large/>
      <MobileBody padding={[0,16,32]}>
        {/* Search */}
        <div style={{ position:'relative', marginBottom:14 }}>
          <input placeholder="Search grammar topics…" style={{ width:'100%', padding:'11px 14px 11px 38px', borderRadius:14, background:MT.card, border:`1px solid ${MT.hairline}`, fontSize:13.5, color:MT.ink, outline:'none', boxShadow:MT.shadowSm }}/>
          <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:MT.ink4 }}>{Icon.search ? Icon.search({ width:15, height:15 }) : '🔍'}</div>
        </div>

        {/* Sections with grouped items */}
        {sections.map(s => (
          <div key={s.name} style={{ marginBottom:18 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, padding:'0 4px' }}>
              <div style={{ width:6, height:6, borderRadius:3, background:s.c.c }}/>
              <div style={{ fontSize:13, fontWeight:700, color:MT.ink, letterSpacing:'-.005em' }}>{s.name}</div>
              <div style={{ fontSize:10.5, color:MT.ink4 }}>· {s.count} topics</div>
            </div>
            <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, overflow:'hidden', boxShadow:MT.shadowSm }}>
              {s.items.map((it, i, arr) => (
                <button key={it.id} onClick={()=>setTopic({ ...it, c:s.c })} style={{ width:'100%', padding:'12px 14px', borderBottom: i < arr.length - 1 ? `1px solid ${MT.divider}` : 'none', display:'flex', alignItems:'center', gap:10, textAlign:'left', background:MT.card }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:13.5, fontWeight:600, color:MT.ink, letterSpacing:'-.005em' }}>{it.title}</span>
                      {it.hot && <span style={{ padding:'1px 5px', borderRadius:3, background:'#FFC85933', color:'#A56C12', fontSize:8.5, fontWeight:800, letterSpacing:'.06em' }}>FOCUS</span>}
                    </div>
                    <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>{it.sub}</div>
                  </div>
                  <div style={{ width:38, height:6, background:MT.divider, borderRadius:3, overflow:'hidden', flexShrink:0 }}>
                    <div style={{ height:'100%', width:`${it.mastery * 100}%`, background: it.mastery > .7 ? '#5A9C7A' : it.mastery > .4 ? T.brand : '#E5A04A' }}/>
                  </div>
                  <span style={{ color:MT.ink4 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// HELP · WAVE 4
// ═══════════════════════════════════════════════════════════
function MHelpPageW4() {
  const [openF, setOpenF] = React.useState(0);
  const cats = [
    { id:'start', label:'Getting started', n:14, c:T.brand,    bg:T.brandLight,    ic:'spark' },
    { id:'streak',label:'Streaks & XP',     n:9,  c:'#E59B22',  bg:'#FCEFD8',      ic:'flame' },
    { id:'pay',   label:'Billing & plans',  n:11, c:'#7C5BD6',  bg:'#EFE9FB',      ic:'card' },
    { id:'exam',  label:'Practice exams',   n:8,  c:T.speaking.c, bg:T.speaking.bg,ic:'mic' },
    { id:'acct',  label:'Account & data',   n:6,  c:'#3D7B7E',  bg:'#DDEEEE',      ic:'shield' },
    { id:'bug',   label:'Trouble & bugs',   n:4,  c:'#C04E4E',  bg:'#F9E0E0',      ic:'warn' },
  ];
  const faq = [
    { q:"Why didn't my streak count today?", a:'A day counts when you finish at least one lesson before midnight in your local timezone. Check your timezone in Settings → Preferences.' },
    { q:'Can I learn more than one language?', a:'Yes — up to 4 active languages on Pro and 1 on Free. Add from the dashboard.' },
    { q:'How do I cancel my subscription?', a:'Settings → Subscription → Cancel. You keep Pro until the end of the billing cycle.' },
    { q:'Does the score guarantee really refund?', a:'Yes. If you complete the recommended path and miss your goal, we refund your last 3 months on Max. See terms.' },
    { q:'Can I use Fluentra offline?', a:'Pro and Max plans support offline lessons. Download a unit from any lesson card.' },
  ];

  return (
    <MobileFrame>
      <MobileHeader title="Help" back onBack={()=>window.__nav && window.__nav('settings')} large={false} right={
        <button style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>Contact</button>
      }/>
      <MobileBody padding={[0,16,32]}>
        {/* Hero with search + Lía CTA */}
        <div style={{ background:`linear-gradient(160deg, #1F1B16 0%, #2D241D 60%, ${T.brand}40 100%)`, borderRadius:22, padding:'18px 18px 16px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:14 }}>
          <div style={{ position:'absolute', bottom:-30, right:-30, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}55 0%, transparent 70%)` }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:10 }}>How can we help?</div>
            <div style={{ position:'relative', marginBottom:12 }}>
              <input placeholder="Search articles…" style={{ width:'100%', padding:'10px 14px 10px 38px', borderRadius:12, background:'rgba(255,255,255,.10)', border:'1px solid rgba(255,255,255,.18)', fontSize:13, color:'#fff', outline:'none', boxSizing:'border-box' }}/>
              <div style={{ position:'absolute', left:13, top:'50%', transform:'translateY(-50%)', color:'rgba(255,255,255,.5)' }}>{Icon.search ? Icon.search({ width:15, height:15 }) : '🔍'}</div>
            </div>
            <button onClick={()=>window.__nav && window.__nav('tutor')} style={{ width:'100%', padding:'10px', borderRadius:12, background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.22)', color:'#fff', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:8, backdropFilter:'blur(8px)' }}>
              <span style={{ fontSize:14 }}>✦</span> Ask Lía about your account
            </button>
          </div>
        </div>

        {/* Category grid */}
        <MobileSectionHead title="Browse"/>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:18 }}>
          {cats.map(c => (
            <button key={c.id} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, padding:'14px 12px', textAlign:'left', boxShadow:MT.shadowSm, display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ width:36, height:36, borderRadius:10, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {Icon[c.ic] ? Icon[c.ic]({ width:16, height:16 }) : '◇'}
              </div>
              <div>
                <div style={{ fontSize:12.5, fontWeight:700, color:MT.ink, letterSpacing:'-.005em' }}>{c.label}</div>
                <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>{c.n} articles</div>
              </div>
            </button>
          ))}
        </div>

        {/* FAQ */}
        <MobileSectionHead title="Common questions"/>
        <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, overflow:'hidden', boxShadow:MT.shadowSm, marginBottom:18 }}>
          {faq.map((f, i) => {
            const open = openF === i;
            return (
              <div key={i} style={{ borderBottom: i < faq.length - 1 ? `1px solid ${MT.divider}` : 'none' }}>
                <button onClick={()=>setOpenF(open ? -1 : i)} style={{ width:'100%', padding:'14px 14px', textAlign:'left', display:'flex', alignItems:'center', gap:10, background:MT.card }}>
                  <div style={{ flex:1, fontSize:13, fontWeight:600, color:MT.ink, lineHeight:1.4, letterSpacing:'-.005em' }}>{f.q}</div>
                  <span style={{ color:MT.ink4, fontSize:14, transform: open ? 'rotate(45deg)' : 'none', transition:'transform .15s' }}>+</span>
                </button>
                {open && <div style={{ padding:'0 14px 14px', fontSize:12, color:MT.ink3, lineHeight:1.6 }}>{f.a}</div>}
              </div>
            );
          })}
        </div>

        {/* Status pill */}
        <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'12px 14px', display:'flex', alignItems:'center', gap:10, boxShadow:MT.shadowSm }}>
          <div style={{ width:10, height:10, borderRadius:5, background:'#5A9C7A', boxShadow:'0 0 0 4px rgba(90,156,122,.18)' }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:MT.ink }}>All systems operational</div>
            <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>Last incident · 18 days ago</div>
          </div>
          <span style={{ fontSize:11, color:T.brand, fontWeight:700 }}>Status →</span>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// MODULE RESULTS · WAVE 4
// ═══════════════════════════════════════════════════════════
function MModuleResultsPageW4() {
  const [mod, setMod] = React.useState('reading');
  const M = {
    reading:   { name:'Reading',   c:T.reading,   ic:'book', score:'8.5', delta:'+0.4', timeMin:24, qsTotal:13, qsRight:11, prevScore:'8.1' },
    listening: { name:'Listening', c:T.listening, ic:'head', score:'8.2', delta:'+0.2', timeMin:18, qsTotal:10, qsRight:8,  prevScore:'8.0' },
    speaking:  { name:'Speaking',  c:T.speaking,  ic:'mic',  score:'7.5', delta:'+0.3', timeMin:11, qsTotal:5,  qsRight:4,  prevScore:'7.2' },
    writing:   { name:'Writing',   c:T.writing,   ic:'pen',  score:'7.0', delta:'+0.5', timeMin:38, qsTotal:1,  qsRight:1,  prevScore:'6.5' },
  }[mod];

  return (
    <MobileFrame>
      <MobileHeader title="Session result" back onBack={()=>window.__nav && window.__nav('practice')} large={false} right={
        <button style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>Share</button>
      }/>
      <MobileBody padding={[0,16,32]}>
        {/* Module switcher */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', marginBottom:14 }} className="w4t2-hide-scroll">
          {Object.entries({ reading:'Reading', listening:'Listening', speaking:'Speaking', writing:'Writing' }).map(([k, l]) => {
            const sel = mod === k;
            return <button key={k} onClick={()=>setMod(k)} style={{ padding:'7px 14px', borderRadius:99, background: sel ? MT.ink : MT.card, color: sel ? '#fff' : MT.ink3, fontSize:11.5, fontWeight:600, border:`1px solid ${sel ? MT.ink : MT.hairline}`, flexShrink:0, boxShadow: sel ? MT.shadowSm : 'none' }}>{l}</button>;
          })}
        </div>

        {/* Score hero */}
        <div style={{ background:`linear-gradient(160deg, ${M.c.c} 0%, ${M.c.c}DD 60%, ${MT.ink} 130%)`, borderRadius:22, padding:'22px 20px 18px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:14 }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', background:'rgba(255,255,255,.10)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
              {Icon[M.ic] && Icon[M.ic]({ width:13, height:13 })} {M.name.toUpperCase()} BAND
            </div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:6 }}>
              <div style={{ fontFamily:T.serif, fontSize:64, lineHeight:.9, letterSpacing:'-.04em' }}>{M.score}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)', fontSize:11.5, fontWeight:700 }}>
                ↑ {M.delta} <span style={{ opacity:.7, fontWeight:500 }}>vs {M.prevScore}</span>
              </div>
            </div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.78)', lineHeight:1.5 }}>Your highest {M.name.toLowerCase()} band yet. Three more sessions and you'll hit 9.0 in this skill.</div>
          </div>
        </div>

        {/* Stat strip */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:18 }}>
          {[
            { l:'Time',      v:M.timeMin, s:'min' },
            { l:'Correct',   v:`${M.qsRight}/${M.qsTotal}`, s:`${Math.round(M.qsRight / M.qsTotal * 100)}%` },
            { l:'Streak',    v:'42', s:'days' },
          ].map(x => (
            <div key={x.l} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'12px 12px', textAlign:'left', boxShadow:MT.shadowSm }}>
              <div style={{ fontSize:9.5, color:MT.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>{x.l}</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:MT.ink, lineHeight:1.05, letterSpacing:'-.02em', marginTop:4 }}>{x.v}</div>
              <div style={{ fontSize:10.5, color:MT.ink4, marginTop:2 }}>{x.s}</div>
            </div>
          ))}
        </div>

        {/* What you got right / wrong */}
        <MobileSectionHead title="Breakdown"/>
        <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, padding:'14px 16px', boxShadow:MT.shadowSm, marginBottom:14 }}>
          <div style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div style={{ fontSize:12, color:MT.ink2, fontWeight:600 }}>✓ What you nailed</div>
              <div style={{ fontSize:11, color:'#5A9C7A', fontWeight:700 }}>{M.qsRight}/{M.qsTotal}</div>
            </div>
            <ul style={{ margin:0, padding:'0 0 0 16px', fontSize:12, color:MT.ink3, lineHeight:1.6 }}>
              <li>Main idea identification</li>
              <li>Inference questions on tone</li>
              <li>Vocabulary in context</li>
            </ul>
          </div>
          <div style={{ borderTop:`1px solid ${MT.divider}`, paddingTop:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
              <div style={{ fontSize:12, color:MT.ink2, fontWeight:600 }}>↻ To work on</div>
              <div style={{ fontSize:11, color:'#C56F3E', fontWeight:700 }}>{M.qsTotal - M.qsRight} qs</div>
            </div>
            <ul style={{ margin:0, padding:'0 0 0 16px', fontSize:12, color:MT.ink3, lineHeight:1.6 }}>
              <li>Time-pressure on multi-paragraph passages</li>
              <li>Distractor traps in T/F/NG questions</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          <button onClick={()=>window.__nav && window.__nav('practice')} style={{ padding:'14px', borderRadius:14, background:MT.card, border:`1px solid ${MT.hairline}`, color:MT.ink, fontSize:13, fontWeight:700, boxShadow:MT.shadowSm }}>Practice again</button>
          <button onClick={()=>window.__nav && window.__nav('dashboard')} style={{ padding:'14px', borderRadius:14, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 8px 18px ${T.brand}55` }}>Home →</button>
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// STATES (empty / error / loading) · WAVE 4
// ═══════════════════════════════════════════════════════════
function MStatesPageW4() {
  const [cat, setCat] = React.useState('empty');
  const states = {
    loading: {
      title:'Loading…',
      subtitle:'Preparing your session',
      visual: <div style={{ width:80, height:80, borderRadius:40, border:`4px solid ${MT.hairline}`, borderTopColor:T.brand, animation:'mw4spin 1s linear infinite' }}/>,
      cta:null,
    },
    empty: {
      title:'No saved items yet',
      subtitle:"Tap the bookmark on any lesson, article, or word and it'll show up here.",
      visual: <div style={{ width:88, height:88, borderRadius:44, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>✦</div>,
      cta: { label:'Browse the library', go:'library' },
    },
    error: {
      title:"That didn't work",
      subtitle:"We couldn't load your session. Check your connection and try again.",
      visual: <div style={{ width:88, height:88, borderRadius:44, background:'#F9E0E0', color:'#C04E4E', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36 }}>!</div>,
      cta: { label:'Try again', go:'dashboard' },
    },
    offline: {
      title:'You\'re offline',
      subtitle:'Showing your downloaded lessons. New content will sync when you reconnect.',
      visual: <div style={{ width:88, height:88, borderRadius:44, background:'#FCEFD8', color:'#A56C12', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>⚡</div>,
      cta: { label:'Open downloads', go:'library' },
    },
    streak: {
      title:'You broke your streak',
      subtitle:'42 days, gone. Streak freezes refill once a week — restore yours now.',
      visual: <div style={{ width:88, height:88, borderRadius:44, background:'#3A2E26', color:'#FFC859', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, boxShadow:MT.shadowMd }}>🔥</div>,
      cta: { label:'Restore for 200 gems', go:'dashboard' },
    },
    notFound: {
      title:'Page not found',
      subtitle:"The page you're looking for moved or doesn't exist.",
      visual: <div style={{ fontFamily:T.serif, fontSize:80, color:MT.ink5, lineHeight:1 }}>404</div>,
      cta: { label:'Back to home', go:'dashboard' },
    },
  };
  const s = states[cat];

  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('mw4-spin')) {
      const sty = document.createElement('style'); sty.id='mw4-spin'; sty.textContent='@keyframes mw4spin{to{transform:rotate(360deg)}}'; document.head.appendChild(sty);
    }
  }, []);

  return (
    <MobileFrame>
      <MobileHeader title="States · gallery" back onBack={()=>window.__nav && window.__nav('dashboard')} large={false}/>
      <div style={{ padding:'2px 14px 8px', flexShrink:0 }}>
        <div style={{ display:'flex', gap:6, overflowX:'auto' }} className="w4t2-hide-scroll">
          {Object.keys(states).map(k => {
            const sel = cat === k;
            return <button key={k} onClick={()=>setCat(k)} style={{ padding:'7px 12px', borderRadius:99, background: sel ? MT.ink : MT.card, color: sel ? '#fff' : MT.ink3, fontSize:11, fontWeight:600, border:`1px solid ${sel ? MT.ink : MT.hairline}`, flexShrink:0, textTransform:'capitalize' }}>{k.replace(/([A-Z])/g, ' $1')}</button>;
          })}
        </div>
      </div>
      <MobileBody padding={[16,16,32]}>
        <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:24, padding:'48px 24px', textAlign:'center', boxShadow:MT.shadowMd }}>
          <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>{s.visual}</div>
          <div style={{ fontFamily:T.serif, fontSize:24, color:MT.ink, lineHeight:1.1, letterSpacing:'-.02em', marginBottom:8 }}>{s.title}</div>
          <div style={{ fontSize:13, color:MT.ink4, lineHeight:1.55, marginBottom:24, padding:'0 12px' }}>{s.subtitle}</div>
          {s.cta && (
            <button onClick={()=>window.__nav && window.__nav(s.cta.go)} style={{ padding:'12px 22px', borderRadius:99, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700, boxShadow:`0 6px 14px ${T.brand}55` }}>{s.cta.label} →</button>
          )}
        </div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// ONBOARDING · WAVE 4
// ═══════════════════════════════════════════════════════════
function MOnboardingPageW4() {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({ language:'', goal:'', reasons:[], level:'', schedule:'regular', reminder:'08:30' });
  const total = 5;

  const langs = [
    { code:'es', name:'Spanish',   flag:'🇪🇸' },
    { code:'fr', name:'French',    flag:'🇫🇷' },
    { code:'ja', name:'Japanese',  flag:'🇯🇵' },
    { code:'de', name:'German',    flag:'🇩🇪' },
    { code:'it', name:'Italian',   flag:'🇮🇹' },
    { code:'ko', name:'Korean',    flag:'🇰🇷' },
    { code:'zh', name:'Mandarin',  flag:'🇨🇳' },
    { code:'pt', name:'Portuguese',flag:'🇵🇹' },
  ];
  const goals = [
    { id:'travel', l:'Travel', s:'Order food, ask directions', ic:'✈' },
    { id:'work',   l:'Career', s:'Job interviews, meetings',    ic:'💼' },
    { id:'fluent', l:'Fluency',s:'Hold real conversations',     ic:'💬' },
    { id:'exam',   l:'Pass an exam', s:'IELTS, DELE, JLPT', ic:'🎓' },
    { id:'family', l:'Family', s:'Talk with relatives',          ic:'❤︎' },
    { id:'fun',    l:'For fun', s:'Books, music, films',         ic:'✦' },
  ];
  const levels = [
    { id:'a0', l:'New to it',         s:'Just starting' },
    { id:'a1', l:'A few words',       s:'Basics: hello, numbers' },
    { id:'a2', l:'Survive a trip',    s:'Order, ask basic things' },
    { id:'b1', l:'Can chat slowly',   s:'Past tense, opinions' },
    { id:'b2', l:'Comfortable',       s:'News, articles, debate' },
  ];

  const next = () => step < total - 1 ? setStep(step + 1) : window.__nav && window.__nav('dashboard');
  const back = () => step > 0 ? setStep(step - 1) : null;

  const Step = ({ children, eyebrow, title, sub }) => (
    <MobileBody padding={[10,20,18]}>
      <div style={{ fontSize:11, color:MT.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>{eyebrow}</div>
      <div style={{ fontFamily:T.serif, fontSize:30, color:MT.ink, lineHeight:1.05, letterSpacing:'-.025em', marginBottom:8 }}>{title}</div>
      {sub && <div style={{ fontSize:13.5, color:MT.ink4, lineHeight:1.55, marginBottom:22 }}>{sub}</div>}
      {children}
    </MobileBody>
  );

  const stepView = () => {
    if (step === 0) {
      return (
        <Step eyebrow="STEP 1 OF 5" title="Which language?" sub="Pick the first one — you can add more later.">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {langs.map(l => {
              const sel = data.language === l.code;
              return (
                <button key={l.code} onClick={()=>setData(d=>({ ...d, language:l.code }))} style={{ background: sel ? T.brandLight : MT.card, border: sel ? `2px solid ${T.brand}` : `1px solid ${MT.hairline}`, borderRadius:14, padding:'14px 12px', textAlign:'left', boxShadow:MT.shadowSm, display:'flex', flexDirection:'column', gap:6 }}>
                  <div style={{ fontSize:32, lineHeight:1 }}>{l.flag}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:MT.ink }}>{l.name}</div>
                </button>
              );
            })}
          </div>
        </Step>
      );
    }
    if (step === 1) {
      return (
        <Step eyebrow="STEP 2 OF 5" title="What are you here for?" sub="We'll tune your daily lesson around this.">
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {goals.map(g => {
              const sel = data.goal === g.id;
              return (
                <button key={g.id} onClick={()=>setData(d=>({ ...d, goal:g.id }))} style={{ background: sel ? T.brandLight : MT.card, border: sel ? `2px solid ${T.brand}` : `1px solid ${MT.hairline}`, borderRadius:14, padding:'14px 14px', textAlign:'left', display:'flex', alignItems:'center', gap:12, boxShadow:MT.shadowSm }}>
                  <div style={{ width:38, height:38, borderRadius:12, background: sel ? T.brand : MT.bg2, color: sel ? '#fff' : MT.ink3, fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>{g.ic}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:MT.ink }}>{g.l}</div>
                    <div style={{ fontSize:11.5, color:MT.ink4, marginTop:2 }}>{g.s}</div>
                  </div>
                  {sel && <div style={{ width:22, height:22, borderRadius:11, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12 }}>✓</div>}
                </button>
              );
            })}
          </div>
        </Step>
      );
    }
    if (step === 2) {
      return (
        <Step eyebrow="STEP 3 OF 5" title="What's your level?" sub="Be honest — we'll adjust as you go.">
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {levels.map(lv => {
              const sel = data.level === lv.id;
              return (
                <button key={lv.id} onClick={()=>setData(d=>({ ...d, level:lv.id }))} style={{ background: sel ? T.brandLight : MT.card, border: sel ? `2px solid ${T.brand}` : `1px solid ${MT.hairline}`, borderRadius:14, padding:'14px 14px', textAlign:'left', display:'flex', alignItems:'center', gap:12, boxShadow:MT.shadowSm }}>
                  <div style={{ width:42, height:42, borderRadius:21, background: sel ? T.brand : MT.bg2, color: sel ? '#fff' : MT.ink3, fontFamily:T.serif, fontSize:14, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', textTransform:'uppercase' }}>{lv.id.toUpperCase()}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:MT.ink }}>{lv.l}</div>
                    <div style={{ fontSize:11.5, color:MT.ink4, marginTop:2 }}>{lv.s}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Step>
      );
    }
    if (step === 3) {
      return (
        <Step eyebrow="STEP 4 OF 5" title="When do you study?" sub="We'll send a gentle reminder.">
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {[
              { id:'casual', l:'Casual',  m:'5 min / day', icon:'☕' },
              { id:'regular',l:'Regular', m:'15 min / day', icon:'⚡' },
              { id:'serious',l:'Serious', m:'30 min / day', icon:'🚀' },
              { id:'intense',l:'Intense', m:'60 min / day', icon:'💎' },
            ].map(o => {
              const sel = data.schedule === o.id;
              return (
                <button key={o.id} onClick={()=>setData(d=>({ ...d, schedule:o.id }))} style={{ background: sel ? T.brandLight : MT.card, border: sel ? `2px solid ${T.brand}` : `1px solid ${MT.hairline}`, borderRadius:14, padding:'14px 14px', textAlign:'left', display:'flex', alignItems:'center', gap:12, boxShadow:MT.shadowSm }}>
                  <div style={{ fontSize:24 }}>{o.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:MT.ink }}>{o.l}</div>
                    <div style={{ fontSize:11.5, color:MT.ink4, marginTop:2 }}>{o.m}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Step>
      );
    }
    // step 4 — complete
    return (
      <Step eyebrow="ALL SET" title="You're ready." sub="We've built a 12-week plan tailored to you.">
        <div style={{ background:`linear-gradient(160deg, ${T.brand} 0%, #C46B3D 100%)`, borderRadius:22, padding:'24px 22px', color:'#fff', boxShadow:MT.shadowLg, marginBottom:14, textAlign:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,.15)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:56, marginBottom:10 }}>🎉</div>
            <div style={{ fontFamily:T.serif, fontSize:28, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:8 }}>Welcome, María.</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.85)', lineHeight:1.5 }}>Your first lesson is ready. 5 minutes to start a streak.</div>
            <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12.5, color:T.brand, marginTop:10, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
          </div>
        </div>
        <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'12px 14px', marginBottom:14, display:'flex', alignItems:'center', gap:10, boxShadow:MT.shadowSm }}>
          <div style={{ width:36, height:36, borderRadius:18, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>1</div>
          <div style={{ flex:1, fontSize:12.5, color:MT.ink2, lineHeight:1.45 }}>Daily 15-min lesson · 16:00 reminder</div>
        </div>
      </Step>
    );
  };

  return (
    <MobileFrame>
      {/* Top bar with skip + progress */}
      <div style={{ padding:'4px 14px 6px', flexShrink:0, display:'flex', alignItems:'center', gap:10 }}>
        {step > 0 ? (
          <button onClick={back} style={{ width:36, height:36, borderRadius:18, background:MT.card, border:`1px solid ${MT.hairline}`, color:MT.ink2 }}>‹</button>
        ) : <div style={{ width:36 }}/>}
        <div style={{ flex:1, height:5, background:MT.hairline, borderRadius:3, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${(step + 1) / total * 100}%`, background:T.brandGrad, borderRadius:3, transition:'width .25s' }}/>
        </div>
        <button onClick={()=>window.__nav && window.__nav('dashboard')} style={{ fontSize:12, color:MT.ink4, fontWeight:600 }}>Skip</button>
      </div>

      {stepView()}

      {/* CTA */}
      <div style={{ padding:'6px 20px 22px', flexShrink:0 }}>
        <button onClick={next} style={{ width:'100%', padding:'14px', borderRadius:14, background:T.brandGrad, color:'#fff', fontSize:14, fontWeight:700, boxShadow:`0 8px 18px ${T.brand}55` }}>{step === total - 1 ? 'Start learning →' : 'Continue →'}</button>
      </div>
    </MobileFrame>
  );
}

Object.assign(window, {
  MTutorPageW4, MPricingPageW4, MSearchPageW4, MLeaderboardPageW4,
  MCourseOverviewPageW4, MGrammarPageW4, MHelpPageW4, MModuleResultsPageW4,
  MStatesPageW4, MOnboardingPageW4,
});
