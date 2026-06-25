// ── Page: Help / Support Center ──────────────────────────────
// Editorial knowledge base: hero search, popular articles, category grid,
// guided troubleshooting, contact strip.

function HelpPage() {
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(0);

  const popular = [
    { t:'Why didn\'t my streak count today?',  cat:'Streaks',  read:'2 min', views:'14.2k' },
    { t:'Reset my placement test',              cat:'Account',  read:'3 min', views:'8.4k'  },
    { t:'Switch from monthly to annual billing',cat:'Billing',  read:'2 min', views:'6.1k'  },
    { t:'Microphone isn\'t picking up my voice',cat:'Speaking', read:'4 min', views:'11.8k' },
  ];

  const categories = [
    { id:'getting-started', label:'Getting started', ic:'spark', n:14, c:T.brand,         cBg:T.brandLight,   blurb:'Sign up, pick a language, set goals.' },
    { id:'streaks',         label:'Streaks & XP',    ic:'flame', n:9,  c:T.brand,         cBg:T.brandLight,   blurb:'How streaks work, freezes, leagues.' },
    { id:'speaking',        label:'Speaking module', ic:'mic',   n:11, c:T.speaking.c,    cBg:T.speaking.bg,  blurb:'Mic permissions, scoring, accents.' },
    { id:'writing',         label:'Writing module',  ic:'pen',   n:8,  c:T.writing.c,     cBg:T.writing.bg,   blurb:'Rubric, AI feedback, edit history.' },
    { id:'listening',       label:'Listening',       ic:'head',  n:7,  c:T.listening.c,   cBg:T.listening.bg, blurb:'Playback speed, captions, replays.' },
    { id:'reading',         label:'Reading',         ic:'book',  n:6,  c:T.reading.c,     cBg:T.reading.bg,   blurb:'Texts, look-up, marking words.' },
    { id:'tutor',           label:'AI Tutor',  ic:'message',n:12, c:T.speaking.c,   cBg:T.speaking.bg,  blurb:'Memory, languages, daily limits.' },
    { id:'exams',           label:'Exam mode',       ic:'trophy',n:10, c:T.writing.c,     cBg:T.writing.bg,   blurb:'IELTS, JLPT, DELE, DELF prep.' },
    { id:'billing',         label:'Billing & plans', ic:'card',  n:13, c:T.ink2,          cBg:T.bg2,          blurb:'Free, Pro, billing, refunds.' },
    { id:'account',         label:'Account & data',  ic:'shield',n:9,  c:T.ink2,          cBg:T.bg2,          blurb:'Password, export, delete account.' },
  ];

  const faq = [
    { q:'Why didn\'t my streak count today?', a:'A day counts when you finish at least one lesson, drill, or 5-minute session before midnight in your local timezone. If you completed something but the streak didn\'t move, double-check your timezone in Settings → Account, and try a manual sync from the streak card.' },
    { q:'Can I learn more than one language at once?', a:'Yes. Free covers English; Pro unlocks all 26 supported languages. Add a language from the dashboard\'s "Add another language" tile. Each language keeps its own streak, level, and saved library.' },
    { q:'How does the AI tutor decide what to teach me next?', a:'the AI tutor reads from three signals: your level on each module (Reading / Listening / Speaking / Writing), the words and grammar you\'ve marked as "tricky", and any exam target you\'ve set. Recommendations refresh every Sunday and after any major score change.' },
    { q:'I missed a day — can I save my streak?', a:'Your streak counts the days you actually practice — finish at least one session before midnight in your local timezone to keep it going.' },
    { q:'Are exam scores I see real predictions?', a:'They\'re estimates based on your practice performance, meant as a guide to track progress — not a guaranteed exam result.' },
    { q:'How do I cancel or pause my subscription?', a:'Settings → Subscription → Manage billing. You can cancel any time and keep Pro until the end of the current billing period.' },
  ];

  const filtered = cat === 'all' ? categories : categories.filter(c => c.id === cat);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>

        {/* HERO */}
        <div style={{ background:`linear-gradient(180deg, ${T.bg2} 0%, ${T.bg} 100%)`, padding:'48px 36px 36px', borderBottom:`1px solid ${T.border}`, textAlign:'center' }}>
          <Chip label="Help center" accent={T.brand} bg={T.brandLight} style={{ marginBottom:14 }}/>
          <div style={{ fontFamily:T.serif, fontSize:48, color:T.ink, lineHeight:1.05, marginBottom:12 }}>How can we help?</div>
          <div style={{ fontSize:14.5, color:T.ink3, marginBottom:24, maxWidth:540, margin:'0 auto 24px' }}>
            Find an answer, walk through a guided fix, or message a real human on the team.
          </div>
          {/* Search */}
          <div style={{ maxWidth:560, margin:'0 auto', position:'relative' }}>
            <input placeholder="Search 95 articles…" style={{ width:'100%', padding:'14px 18px 14px 46px', fontSize:14, color:T.ink2, background:T.card, border:`1.5px solid ${T.border}`, borderRadius:12, outline:'none', boxShadow:'0 4px 16px rgba(0,0,0,.04)' }}/>
            <div style={{ position:'absolute', left:18, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search()}</div>
            <div style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontSize:11, color:T.ink5, fontFamily:T.sans }}>or</span>
              <button onClick={() => window.__nav && window.__nav('tutor')} style={{ padding:'7px 12px', fontSize:12, fontWeight:700, color:T.brand, background:T.brandLight, border:`1px solid ${T.brandLight}`, borderRadius:8, display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>{Icon.spark({ width:11, height:11 })} Ask the tutor</button>
            </div>
          </div>
          {/* Quick suggested */}
          <div style={{ marginTop:18, display:'flex', flexWrap:'wrap', justifyContent:'center', gap:6 }}>
            <span style={{ fontSize:11, color:T.ink4 }}>Try:</span>
            {['streak freeze','cancel subscription','switch language','export data','exam mode score'].map(q => (
              <button key={q} onClick={() => window.__nav && window.__nav('tutor')} style={{ fontSize:11.5, padding:'4px 10px', background:T.card, border:`1px solid ${T.border}`, borderRadius:99, color:T.ink2, fontWeight:500, cursor:'pointer' }}>{q}</button>
            ))}
          </div>
        </div>

        <div style={{ padding:'32px 36px 40px' }}>

          {/* POPULAR */}
          <div style={{ marginBottom:36 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Most asked this week</div>
                <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1 }}>What others are reading</div>
              </div>
              <button onClick={() => window.__nav && window.__nav('tutor')} style={{ fontSize:12, color:T.brand, fontWeight:700, display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>All popular {Icon.arrow({ width:11, height:11 })}</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
              {popular.map((p, i) => (
                <button key={i} onClick={() => window.__nav && window.__nav('tutor')} style={{ padding:'18px 18px 16px', background:T.card, border:`1px solid ${T.border}`, borderRadius:14, textAlign:'left', cursor:'pointer', display:'flex', flexDirection:'column', gap:10, minHeight:140 }}>
                  <Chip label={p.cat} accent={T.ink3} bg={T.bg2} style={{ alignSelf:'flex-start' }}/>
                  <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.3, flex:1, textWrap:'pretty' }}>{p.t}</div>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11, color:T.ink4 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}>{Icon.clock({ width:10, height:10 })} {p.read}</span>
                    <span>{p.views} reads</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CATEGORIES */}
          <div style={{ marginBottom:36 }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Browse</div>
                <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1 }}>By topic</div>
              </div>
              <div style={{ display:'flex', gap:4 }}>
                {[{ id:'all', label:'All' }, { id:'getting-started', label:'Getting started' }, { id:'speaking', label:'Speaking' }, { id:'billing', label:'Billing' }].map(f => (
                  <button key={f.id} onClick={()=>setCat(f.id)} style={{ padding:'6px 12px', fontSize:12, fontWeight: cat===f.id ? 700 : 500, color: cat===f.id ? T.ink : T.ink3, background: cat===f.id ? T.card : 'transparent', border:`1px solid ${cat===f.id ? T.border : 'transparent'}`, borderRadius:8 }}>{f.label}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:12 }}>
              {filtered.map(c => (
                <button key={c.id} style={{ padding:'18px 16px', background:T.card, border:`1px solid ${T.border}`, borderRadius:14, textAlign:'left', cursor:'pointer', display:'flex', flexDirection:'column', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:c.cBg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Icon[c.ic]({ width:16, height:16 })}
                  </div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.2, marginBottom:3 }}>{c.label}</div>
                    <div style={{ fontSize:11, color:T.ink4, lineHeight:1.4, marginBottom:6 }}>{c.blurb}</div>
                    <div style={{ fontSize:11, color:T.ink5, fontWeight:600 }}>{c.n} articles</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* TWO-COLUMN: FAQ + Guided / Status */}
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:24, marginBottom:36 }}>

            {/* FAQ */}
            <div>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>FAQ</div>
              <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.1, marginBottom:16 }}>Quick answers</div>
              <Card padding={0}>
                {faq.map((f, i) => {
                  const isOpen = open === i;
                  return (
                    <div key={i} style={{ borderBottom: i < faq.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                      <button onClick={()=>setOpen(isOpen ? -1 : i)} style={{ width:'100%', padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, textAlign:'left', background:'transparent', cursor:'pointer' }}>
                        <span style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.3 }}>{f.q}</span>
                        <div style={{ width:26, height:26, borderRadius:13, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>{Icon.chevD({ width:13, height:13 })}</div>
                      </button>
                      {isOpen && (
                        <div style={{ padding:'0 20px 20px', fontSize:13.5, color:T.ink2, lineHeight:1.6 }}>
                          {f.a}
                          <div style={{ marginTop:14, paddingTop:14, borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                            <div style={{ fontSize:11.5, color:T.ink4 }}>Was this helpful?</div>
                            <div style={{ display:'flex', gap:6 }}>
                              <button style={{ padding:'4px 12px', fontSize:11.5, fontWeight:600, color:T.ink2, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8 }}>Yes</button>
                              <button style={{ padding:'4px 12px', fontSize:11.5, fontWeight:600, color:T.ink2, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8 }}>No</button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Card>
            </div>

            {/* Guided + Status */}
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {/* Guided troubleshooter */}
              <Card padding={20} style={{ background:`linear-gradient(135deg, ${T.brandLight} 0%, ${T.bg2} 100%)`, borderColor:T.brandLight }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.spark({ width:16, height:16 })}</div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Guided fix</div>
                    <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1.2 }}>Something not working?</div>
                  </div>
                </div>
                <div style={{ fontSize:12.5, color:T.ink2, lineHeight:1.5, marginBottom:14 }}>Pick what's wrong and we'll walk through it step by step. Most issues take less than 2 minutes.</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {[
                    { ic:'mic',  label:'Microphone not picking up' },
                    { ic:'flame',label:'My streak didn\'t count' },
                    { ic:'card', label:'Charged the wrong amount' },
                    { ic:'globe',label:'App stuck on loading' },
                  ].map((t, i) => (
                    <button key={i} style={{ padding:'10px 12px', background:T.card, border:`1px solid ${T.border}`, borderRadius:9, display:'flex', alignItems:'center', gap:10, fontSize:13, color:T.ink2, fontWeight:600, textAlign:'left', cursor:'pointer' }}>
                      <div style={{ width:24, height:24, borderRadius:6, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[t.ic]({ width:11, height:11 })}</div>
                      <span style={{ flex:1 }}>{t.label}</span>
                      {Icon.chev({ width:12, height:12, style:{ color:T.ink4 } })}
                    </button>
                  ))}
                </div>
              </Card>

              {/* System status */}
              <Card padding={16}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>System status</div>
                  <Chip label="All systems normal" accent={T.listening.c} bg={T.listening.bg} icon={<span style={{ width:6, height:6, borderRadius:3, background:T.listening.c }}/>}/>
                </div>
                {[
                  { name:'Web app',     pct:99.99 },
                  { name:'Mobile API',  pct:99.97 },
                  { name:'AI Tutor',    pct:99.94 },
                  { name:'Speech grading', pct:99.91 },
                ].map((s, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 0', borderTop: i ? `1px solid ${T.hairline}` : 'none', fontSize:12.5 }}>
                    <span style={{ color:T.ink2, fontWeight:500 }}>{s.name}</span>
                    <span style={{ color:T.ink3, fontFamily:T.serif }}>{s.pct}% <span style={{ fontFamily:T.sans, color:T.ink5, fontSize:11 }}>30d</span></span>
                  </div>
                ))}
                <button style={{ marginTop:10, width:'100%', padding:'8px', fontSize:11.5, fontWeight:600, color:T.ink3, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8 }}>Full status page →</button>
              </Card>
            </div>
          </div>

          {/* CONTACT STRIP */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'28px 32px' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Still stuck?</div>
                <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.1 }}>Talk to a real human.</div>
              </div>
              <div style={{ fontSize:11.5, color:T.ink3, display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:3, background:T.listening.c, display:'inline-block' }}/>
                Avg reply: 14 min · Mon–Fri
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
              {[
                { ic:'message', label:'Live chat',     sub:'Fastest — usually replies in minutes', cta:'Start chat',        c:T.brand },
                { ic:'send',    label:'Email support', sub:'help@fluentra.app · 24-hour SLA',     cta:'Send email',         c:T.speaking.c },
                { ic:'users',   label:'Community',     sub:'Ask in the forum — 12k members',       cta:'Open forum',         c:T.listening.c },
              ].map((c, i) => (
                <div key={i} style={{ padding:'18px 18px 16px', border:`1px solid ${T.border}`, borderRadius:14, display:'flex', flexDirection:'column' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${c.c}15`, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>{Icon[c.ic]({ width:15, height:15 })}</div>
                  <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:3 }}>{c.label}</div>
                  <div style={{ fontSize:12, color:T.ink3, lineHeight:1.45, marginBottom:14, flex:1 }}>{c.sub}</div>
                  <Btn label={c.cta} size="sm" accent={c.c} variant="soft" iconRight={Icon.arrow({ width:11, height:11 })} style={{ alignSelf:'flex-start' }}/>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div style={{ textAlign:'center', marginTop:28, fontSize:11.5, color:T.ink4 }}>
            Looking for legal? <span style={{ color:T.ink2, fontWeight:600 }}>Privacy</span> · <span style={{ color:T.ink2, fontWeight:600 }}>Terms</span> · <span style={{ color:T.ink2, fontWeight:600 }}>Cookies</span> · <span style={{ color:T.ink2, fontWeight:600 }}>Data export</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile ─────────────────────────────────────────────────────