// ── Public profile + DM thread + Activity feed + Phrasebook + Receipts + Refer ──

function PublicProfilePage() {
  const langs = [
    { name:'Spanish',  flag:'es', level:'B1', xp:8420,  pct:.72, since:'Aug 2024', accent:'#C56B47' },
    { name:'Japanese', flag:'jp', level:'Native', xp:0, pct:1,   since:'—',         accent:'#8E6E95', native:true },
    { name:'English',  flag:'en', level:'C1', xp:1210,  pct:.91, since:'2019',      accent:'#3F7CAC' },
  ];
  const heatmap = Array.from({length: 91}, (_, i) => Math.max(0, Math.round(Math.sin(i*0.6 + 1.2) * 2.4 + 2)));
  const grade = (l) => l === 'Native' ? 1 : ['A1','A2','B1','B2','C1','C2'].indexOf(l) / 5;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.bg }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        {/* Editorial masthead */}
        <div style={{ borderBottom:`1px solid ${T.border}`, background:T.card, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:0, right:-80, fontFamily:T.serif, fontSize:280, color:T.bg2, lineHeight:.8, fontWeight:300, userSelect:'none', pointerEvents:'none' }}>SC</div>
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 40px 32px', position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
              <button data-nav="friends" style={{ fontSize:11.5, color:T.ink4, background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:6, padding:0 }}>
                {Icon.arrowL({ width:11, height:11 })} Back to friends
              </button>
              <span style={{ color:T.ink5 }}>·</span>
              <span style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase' }}>Public profile · Issue Nº 047</span>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:28, alignItems:'center' }}>
              <div style={{ position:'relative' }}>
                <Avatar initials="SC" size={120} bg="#3F7CAC" style={{ border:`3px solid ${T.bg}`, fontSize:40, boxShadow:'0 12px 30px rgba(63,124,172,.28)' }}/>
                <div style={{ position:'absolute', bottom:-4, right:-4, width:32, height:32, borderRadius:16, background:'#1A8F4E', border:`3px solid ${T.card}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:800 }}>47</div>
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:6 }}>
                  <Chip label="Pro" accent={T.brand} bg={T.brandLight} style={{ fontSize:10, padding:'3px 8px', fontWeight:800, letterSpacing:'.1em' }}/>
                  <Chip label="Top 5% · Spanish" accent="#1A8F4E" bg="#E5F5EB" style={{ fontSize:10, padding:'3px 8px', fontWeight:700 }}/>
                  <Chip label="Conversation partner" accent={T.ink2} bg={T.bg2} style={{ fontSize:10, padding:'3px 8px' }}/>
                </div>
                <div style={{ fontFamily:T.serif, fontSize:46, color:T.ink, lineHeight:1, letterSpacing:'-0.015em', marginBottom:8 }}>Sofia Chen</div>
                <div style={{ display:'flex', alignItems:'center', gap:14, fontSize:12.5, color:T.ink3 }}>
                  <span>@sofiachen</span>
                  <span style={{ width:3, height:3, borderRadius:2, background:T.ink5 }}/>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:5 }}>{Icon.cal({ width:11, height:11 })} Joined Aug 2024</span>
                  <span style={{ width:3, height:3, borderRadius:2, background:T.ink5 }}/>
                  <span>Tokyo, Japan · 東京</span>
                </div>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end' }}>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn label="Message" nav="dm_thread" accent={T.brand} icon={Icon.message()}/>
                  <Btn label="Following" variant="outline" accent={T.ink} icon={Icon.check()}/>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <button style={{ width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`, background:T.card, color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.share ? Icon.share({ width:13, height:13 }) : '↗'}</button>
                  <button style={{ width:34, height:34, borderRadius:9, border:`1px solid ${T.border}`, background:T.card, color:T.ink3, cursor:'pointer', fontSize:16 }}>⋯</button>
                </div>
              </div>
            </div>

            {/* Pull quote bio */}
            <div style={{ marginTop:28, paddingLeft:16, borderLeft:`3px solid ${T.brand}`, maxWidth:760 }}>
              <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:18, color:T.ink2, lineHeight:1.5 }}>"Studying Spanish to read Bolaño in the original. Always up for a 20-minute conversation exchange — Japanese ↔ Spanish."</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 40px 60px' }}>

          {/* Numbers, magazine-style */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, marginBottom:32 }}>
            {[
              { l:'Languages', v:'3', s:'2 learning, 1 native' },
              { l:'XP · 30d',   v:'14,820', s:'+18% vs prev' },
              { l:'Lessons',   v:'228', s:'lifetime' },
              { l:'Friends',   v:'42',  s:'8 mutual' },
              { l:'Badges',    v:'31',  s:'of 84 total' },
            ].map((s, i) => (
              <div key={s.l} style={{ padding:'18px 20px', borderLeft: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ fontSize:10, fontWeight:800, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>{s.l}</div>
                <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1, letterSpacing:'-0.015em' }}>{s.v}</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:5 }}>{s.s}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:28 }}>
            {/* LEFT column */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {/* Languages — proficiency bars w/ CEFR scale */}
              <section>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, letterSpacing:'-0.01em' }}>Languages</div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>CEFR · last 30 days</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
                  {langs.map(l => (
                    <div key={l.name} style={{ display:'grid', gridTemplateColumns:'auto 1fr auto', gap:16, alignItems:'center' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:140 }}>
                        <Flag code={l.flag} w={30} h={20} radius={2}/>
                        <div>
                          <div style={{ fontSize:14.5, fontWeight:700, color:T.ink }}>{l.name}</div>
                          <div style={{ fontSize:10.5, color:T.ink4 }}>since {l.since}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ display:'flex', justifyContent:'space-between', fontSize:9.5, fontWeight:700, color:T.ink5, letterSpacing:'.1em', marginBottom:5, paddingRight:2 }}>
                          {['A1','A2','B1','B2','C1','C2'].map(g => <span key={g} style={{ color: ['A1','A2','B1','B2','C1','C2'].indexOf(l.level) >= ['A1','A2','B1','B2','C1','C2'].indexOf(g) ? T.ink3 : T.ink5 }}>{g}</span>)}
                        </div>
                        <div style={{ position:'relative', height:8, background:T.bg2, borderRadius:4, overflow:'hidden' }}>
                          <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${l.pct * 100}%`, background:`linear-gradient(90deg, ${l.accent}, ${l.accent}dd)`, borderRadius:4 }}/>
                          {!l.native && [1,2,3,4,5].map(i => <div key={i} style={{ position:'absolute', left:`${i * (100/6)}%`, top:0, width:1, height:'100%', background:T.card, opacity:.5 }}/>)}
                        </div>
                      </div>
                      <div style={{ minWidth:90, textAlign:'right' }}>
                        <div style={{ fontFamily:T.serif, fontSize:18, color:l.accent, lineHeight:1 }}>{l.level}</div>
                        <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{l.native ? 'Native speaker' : l.xp.toLocaleString() + ' XP'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 91-day heatmap */}
              <section>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, letterSpacing:'-0.01em' }}>Practice rhythm</div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>91 days · 47-day streak</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(13, 1fr)', gap:4 }}>
                  {heatmap.map((v, i) => {
                    const shade = ['#F2EFE9', '#E8D9C5', '#D9B68C', '#C8924E', '#A06940'][Math.min(4, v)];
                    return <div key={i} style={{ aspectRatio:'1', background:shade, borderRadius:3, border:`1px solid ${T.bg2}` }}/>;
                  })}
                </div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, fontSize:10.5, color:T.ink4 }}>
                  <span>Mar 1</span>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span>Less</span>
                    {['#F2EFE9', '#E8D9C5', '#D9B68C', '#C8924E', '#A06940'].map((c,i) => <div key={i} style={{ width:10, height:10, background:c, borderRadius:2 }}/>)}
                    <span>More</span>
                  </div>
                  <span>Today</span>
                </div>
              </section>

              {/* Recent activity — feed */}
              <section>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, letterSpacing:'-0.01em' }}>Recent activity</div>
                  <button style={{ fontSize:11.5, color:T.brand, fontWeight:600, background:'transparent', border:'none', cursor:'pointer' }}>View all →</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  {[
                    { d:'2h ago',     t:'Completed Lesson 14',   sub:'Subjunctive triggers', lang:'es', kind:'lesson' },
                    { d:'Today',      t:'Earned a new badge',    sub:'"Vocabulary virtuoso"', lang:'es', kind:'badge' },
                    { d:'Yesterday',  t:'Finished a mock exam',  sub:'IELTS Reading · 7.5',   lang:'en', kind:'exam' },
                    { d:'2d ago',     t:'Reviewed 84 flashcards', sub:'Café & restaurants deck', lang:'es', kind:'review' },
                    { d:'4d ago',     t:'Hit a 45-day streak',   sub:'Personal best',         lang:'es', kind:'streak' },
                  ].map((a, i, arr) => (
                    <div key={i} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                      <div style={{ width:36, paddingTop:2, fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.04em', textTransform:'uppercase', flexShrink:0 }}>{a.d.replace(' ago','').replace('Yesterday','Yest.').replace('Today','Now')}</div>
                      <div style={{ width:1, background:T.hairline, position:'relative', flexShrink:0 }}>
                        <div style={{ position:'absolute', top:6, left:-3, width:7, height:7, borderRadius:4, background:{lesson:T.brand, badge:'#C8924E', exam:'#3F7CAC', review:'#1A8F4E', streak:'#C0392B'}[a.kind] }}/>
                      </div>
                      <div style={{ flex:1, paddingLeft:8 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:3 }}>
                          <Flag code={a.lang} w={16} h={11} radius={2}/>
                          <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{a.t}</div>
                        </div>
                        <div style={{ fontSize:12.5, color:T.ink3 }}>{a.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* RIGHT column */}
            <aside style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {/* Featured badge */}
              <Card padding={0} style={{ overflow:'hidden' }}>
                <div style={{ background:`linear-gradient(135deg, #C8924E, #A06940)`, padding:'22px 22px 18px', color:'#fff', position:'relative' }}>
                  <div style={{ position:'absolute', top:-30, right:-30, width:120, height:120, borderRadius:60, background:'rgba(255,255,255,.08)' }}/>
                  <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.85, marginBottom:6 }}>Featured badge</div>
                  <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.05, marginBottom:6 }}>Vocabulary virtuoso</div>
                  <div style={{ fontSize:12, opacity:.85 }}>Mastered 1,000 cards across 4 decks</div>
                </div>
                <div style={{ padding:'14px 18px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ fontSize:11, color:T.ink4 }}>Earned today · Top 8% of learners</div>
                  <button data-nav="achievements" style={{ fontSize:11.5, fontWeight:700, color:T.brand, background:'transparent', border:'none', cursor:'pointer' }}>See all 31 →</button>
                </div>
              </Card>

              {/* Badge wall */}
              <section>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>Badge wall</div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>31 / 84</div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8 }}>
                  {[
                    { n:'Streak 47', c:'#C0392B', earned:true },
                    { n:'Top 5%',    c:'#C8924E', earned:true },
                    { n:'Reader',    c:'#3F7CAC', earned:true },
                    { n:'Mock 7.5',  c:'#1A8F4E', earned:true },
                    { n:'Vocab 1k',  c:'#7A4FAB', earned:true },
                    { n:'Polyglot',  c:'#A06940', earned:true },
                    { n:'Speaker',   c:'#5B7553', earned:true },
                    { n:'?',         c:T.ink5,    earned:false },
                  ].map((b, i) => (
                    <div key={i} style={{ aspectRatio:'1', background: b.earned ? T.card : T.bg2, border:`1px solid ${b.earned ? b.c+'55' : T.border}`, borderRadius:10, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, opacity: b.earned ? 1 : .55 }}>
                      <div style={{ width:22, height:22, borderRadius:11, background: b.earned ? b.c+'22' : 'transparent', border:`1.5px solid ${b.earned ? b.c : T.ink5}`, display:'flex', alignItems:'center', justifyContent:'center', color: b.earned ? b.c : T.ink5, fontSize:10, fontWeight:800, fontFamily:T.serif }}>★</div>
                      <div style={{ fontSize:8.5, fontWeight:700, color: b.earned ? T.ink2 : T.ink5, textAlign:'center', lineHeight:1.1, letterSpacing:'.02em' }}>{b.n}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Mutual friends */}
              <section>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:12, paddingBottom:8, borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>Mutual friends</div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>8</div>
                </div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  {[
                    { n:'Marco Rivera', i:'MR', bg:'#A06940', sub:'Spanish · B2' },
                    { n:'Yui Tanaka',   i:'YT', bg:'#8E6E95', sub:'Japanese · Native' },
                    { n:'Ana Belkacem', i:'AB', bg:'#5B7553', sub:'French · C1' },
                  ].map((f, i, arr) => (
                    <button key={i} data-nav="public_profile" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: i < arr.length - 1 ? `1px solid ${T.hairline}` : 'none', background:'transparent', border:'none', cursor:'pointer', textAlign:'left', width:'100%' }}>
                      <Avatar initials={f.i} size={32} bg={f.bg}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{f.n}</div>
                        <div style={{ fontSize:11, color:T.ink4 }}>{f.sub}</div>
                      </div>
                      <span style={{ color:T.ink4, fontSize:14 }}>›</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Open to */}
              <Card padding={18} style={{ background:T.bg2 }}>
                <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', color:T.ink4, marginBottom:8 }}>Open to</div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {['Conversation exchange','Study buddy','Book club','Voice notes'].map(t => (
                    <span key={t} style={{ fontSize:11.5, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, padding:'5px 10px', borderRadius:99 }}>{t}</span>
                  ))}
                </div>
              </Card>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

function DMThreadPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
        {/* Conversation list */}
        <div style={{ width:280, borderRight:`1px solid ${T.hairline}`, display:'flex', flexDirection:'column', background:T.card }}>
          <div style={{ padding:'18px 18px 12px', borderBottom:`1px solid ${T.hairline}` }}>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:10 }}>Messages</div>
            <input placeholder="Search..." style={{ width:'100%', padding:'8px 12px', fontSize:12.5, border:`1px solid ${T.border}`, borderRadius:9, background:T.bg, outline:'none' }}/>
          </div>
          <div style={{ flex:1, overflow:'auto' }}>
            {[
              { name:'Sofia Chen',    init:'SC', bg:'#3F7CAC', preview:'Yes! Tomorrow at 7pm works…', when:'2m', unread:1, active:true },
              { name:'Marco Rivera',  init:'MR', bg:'#A06940', preview:'Thanks for the recommendation!', when:'1h', unread:0 },
              { name:'Ana Belkacem',  init:'AB', bg:'#5B7553', preview:'You: I sent you the deck',     when:'Yesterday', unread:0 },
              { name:'Yui Tanaka',    init:'YT', bg:'#8E6E95', preview:'はい、ぜひ!',                    when:'2d', unread:0 },
              { name:'Diego Costa',   init:'DC', bg:'#C56B47', preview:'¿Cómo se dice…?',                when:'3d', unread:0 },
            ].map((c, i) => (
              <button key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background: c.active ? T.brandLight : 'transparent', borderLeft:`3px solid ${c.active ? T.brand : 'transparent'}`, textAlign:'left', width:'100%', cursor:'pointer' }}>
                <Avatar initials={c.init} size={36} bg={c.bg}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:6 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.name}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, flexShrink:0 }}>{c.when}</div>
                  </div>
                  <div style={{ fontSize:12, color: c.unread ? T.ink2 : T.ink4, fontWeight: c.unread ? 600 : 400, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.preview}</div>
                </div>
                {c.unread > 0 && <div style={{ width:18, height:18, borderRadius:9, background:T.brand, color:'#fff', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{c.unread}</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
          {/* Header */}
          <div style={{ padding:'14px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:12, background:T.card }}>
            <Avatar initials="SC" size={36} bg="#3F7CAC"/>
            <button data-nav="public_profile" style={{ flex:1, textAlign:'left', cursor:'pointer' }}>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Sofia Chen</div>
              <div style={{ fontSize:11, color:'#1A8F4E', display:'flex', alignItems:'center', gap:4 }}><span style={{ width:6, height:6, borderRadius:3, background:'#1A8F4E' }}/>Active now</div>
            </button>
            <button style={{ width:34, height:34, borderRadius:8, color:T.ink2 }}>{Icon.mic({ width:14, height:14 })}</button>
            <button style={{ width:34, height:34, borderRadius:8, color:T.ink2 }}>{Icon.cog ? Icon.cog({ width:14, height:14 }) : '⋯'}</button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflow:'auto', padding:'24px 22px', display:'flex', flexDirection:'column', gap:10, background:T.bg }}>
            <div style={{ alignSelf:'center', fontSize:11, color:T.ink4, padding:'4px 10px', background:T.card, borderRadius:10, fontWeight:600 }}>Yesterday</div>

            <DMBubble side="them" name="Sofia">¡Hola Marc! Vi que estás estudiando español también. ¿Quieres hacer un intercambio? Yo te ayudo con español y tú me ayudas con inglés.</DMBubble>
            <DMBubble side="them" name="Sofia">I just started studying Spanish three months ago, so I'm B1.</DMBubble>
            <DMBubble side="me">¡Claro! Sounds great. I'm B2 in English so I should be able to help.</DMBubble>
            <DMBubble side="me">When works for you? I'm free most evenings CET.</DMBubble>

            <div style={{ alignSelf:'center', fontSize:11, color:T.ink4, padding:'4px 10px', background:T.card, borderRadius:10, fontWeight:600, marginTop:8 }}>Today</div>

            <DMBubble side="them" name="Sofia">Tomorrow at 7pm CET? We can do 30 min Spanish, 30 min English.</DMBubble>
            <DMBubble side="me">Perfecto. I'll send a meeting link.</DMBubble>
            <DMBubble side="them" name="Sofia">Yes! Tomorrow at 7pm works. Looking forward to it 🎉</DMBubble>
          </div>

          {/* Composer */}
          <div style={{ padding:'14px 22px', borderTop:`1px solid ${T.hairline}`, background:T.card, display:'flex', alignItems:'center', gap:10 }}>
            <button style={{ width:36, height:36, borderRadius:10, color:T.ink3 }}>{Icon.plus()}</button>
            <input placeholder="Write a message..." style={{ flex:1, padding:'10px 14px', fontSize:13.5, border:`1px solid ${T.border}`, borderRadius:11, background:T.bg, outline:'none' }}/>
            <button style={{ width:36, height:36, borderRadius:10, color:T.ink3 }}>{Icon.mic({ width:14, height:14 })}</button>
            <button style={{ padding:'10px 16px', borderRadius:10, background:T.brand, color:'#fff', fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', gap:6 }}>Send {Icon.arrow({ width:12, height:12 })}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DMBubble({ side, name, children }) {
  const me = side === 'me';
  return (
    <div style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth:'68%', padding:'10px 14px', borderRadius: me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: me ? T.brand : T.card, color: me ? '#fff' : T.ink, fontSize:13.5, lineHeight:1.5, border: me ? 'none' : `1px solid ${T.border}` }}>
        {children}
      </div>
    </div>
  );
}

function ActivityFeedPage() {
  const items = [
    { who:'Sofia Chen',    init:'SC', bg:'#3F7CAC', what:'completed', detail:'Lesson 14 · Subjunctive triggers',  lang:'es', when:'2m ago' },
    { who:'Marco Rivera',  init:'MR', bg:'#A06940', what:'earned',    detail:'"Vocabulary virtuoso" achievement', lang:'en', when:'18m ago' },
    { who:'Ana Belkacem',  init:'AB', bg:'#5B7553', what:'finished',  detail:'30-day streak in French',           lang:'fr', when:'1h ago', highlight:true },
    { who:'Yui Tanaka',    init:'YT', bg:'#8E6E95', what:'scored',    detail:'Band 7.5 on IELTS mock exam',       lang:'en', when:'2h ago' },
    { who:'Diego Costa',   init:'DC', bg:'#C56B47', what:'started',   detail:'a new 7-day challenge',             lang:'pt', when:'3h ago' },
    { who:'Marco Rivera',  init:'MR', bg:'#A06940', what:'reviewed',  detail:'128 flashcards',                    lang:'en', when:'5h ago' },
    { who:'Sofia Chen',    init:'SC', bg:'#3F7CAC', what:'shared',    detail:'a story · "El silencio de los pueblos"', lang:'es', when:'8h ago' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Friends" title="Activity feed" subtitle="What your friends have been up to. Cheer them on, or jump into the same lesson."
          right={<div style={{ display:'flex', gap:8 }}><Btn label="Find friends" nav="friends" variant="outline" accent={T.ink} icon={Icon.users()}/><Btn label="Invite" accent={T.brand} icon={Icon.plus()}/></div>}
        />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24 }}>
          <Card padding={0}>
            {items.map((a, i) => (
              <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'18px 22px', borderTop: i ? `1px solid ${T.hairline}` : 'none', background: a.highlight ? T.brandLight : 'transparent' }}>
                <Avatar initials={a.init} size={40} bg={a.bg}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5 }}>
                    <b data-nav="public_profile" style={{ cursor:'pointer' }}>{a.who}</b> {a.what} <span style={{ fontWeight:700 }}>{a.detail}</span>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                    <Flag code={a.lang} w={18} h={12} radius={2}/>
                    <div style={{ fontSize:11, color:T.ink4 }}>{a.when}</div>
                    <div style={{ width:3, height:3, borderRadius:2, background:T.ink5 }}/>
                    <button style={{ fontSize:11, color:T.brand, fontWeight:700 }}>👏 Cheer</button>
                    <button style={{ fontSize:11, color:T.ink3, fontWeight:600 }}>Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Card padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>This week</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}><span style={{ color:T.ink3 }}>Cheers given</span><b style={{ color:T.ink }}>14</b></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}><span style={{ color:T.ink3 }}>Cheers received</span><b style={{ color:T.ink }}>22</b></div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12.5 }}><span style={{ color:T.ink3 }}>Friends active</span><b style={{ color:T.ink }}>9 / 12</b></div>
              </div>
            </Card>
            <Card padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Suggested</div>
              {[
                { n:'Lior Adler', i:'LA', bg:'#7A4FAB' },
                { n:'Priya Shah', i:'PS', bg:'#C56B47' },
              ].map(s => (
                <div key={s.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderTop:`1px solid ${T.hairline}` }}>
                  <Avatar initials={s.i} size={32} bg={s.bg}/>
                  <div style={{ flex:1, fontSize:12.5, fontWeight:700, color:T.ink }}>{s.n}</div>
                  <button style={{ fontSize:11, fontWeight:700, color:T.brand }}>+ Add</button>
                </div>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

const PHRASEBOOK_CATS = [
  { id:'cafe',     name:'Café & ordering',      count:34, phrases:[
    { es:'¿Me pone un café con leche?', en:'Could I have a coffee with milk?' },
    { es:'La cuenta, por favor',         en:'The bill, please' },
    { es:'Para llevar',                  en:'To go / takeaway' },
    { es:'¿Tienen leche de avena?',      en:'Do you have oat milk?' },
    { es:'Sin azúcar',                   en:'No sugar' },
  ]},
  { id:'travel',   name:'Travel & directions',  count:42, phrases:[
    { es:'¿Cómo llego a…?',              en:'How do I get to…?' },
    { es:'Está cerca de aquí',           en:'It\'s near here' },
    { es:'Perdón, ¿hay un baño?',        en:'Excuse me, is there a bathroom?' },
    { es:'¿A qué hora sale el tren?',    en:'What time does the train leave?' },
    { es:'¿Me puede llevar a…?',         en:'Can you take me to…?' },
  ]},
  { id:'smalltalk', name:'Small talk',          count:28, phrases:[
    { es:'¿De dónde eres?',              en:'Where are you from?' },
    { es:'¿A qué te dedicas?',           en:'What do you do?' },
    { es:'Encantado/a',                  en:'Pleased to meet you' },
    { es:'¿Cuánto tiempo llevas aquí?',  en:'How long have you been here?' },
    { es:'Hace mucho calor hoy',         en:'It\'s very hot today' },
  ]},
  { id:'emergency', name:'Emergencies',         count:18, phrases:[
    { es:'Necesito ayuda',               en:'I need help' },
    { es:'¿Dónde está la farmacia?',     en:'Where\'s the pharmacy?' },
    { es:'Llame a una ambulancia',       en:'Call an ambulance' },
    { es:'Me he perdido',                en:'I\'m lost' },
    { es:'No hablo español muy bien',    en:'I don\'t speak Spanish very well' },
  ]},
  { id:'doctor',   name:'At the doctor',        count:22, phrases:[
    { es:'Me duele aquí',                en:'It hurts here' },
    { es:'Soy alérgico/a a…',            en:'I\'m allergic to…' },
    { es:'¿Tengo que volver?',           en:'Do I need to come back?' },
    { es:'Tomo este medicamento',        en:'I take this medication' },
    { es:'Me siento mareado/a',          en:'I feel dizzy' },
  ]},
  { id:'idioms',   name:'Idioms & expressions', count:64, phrases:[
    { es:'Estar en las nubes',           en:'To have your head in the clouds' },
    { es:'Ser pan comido',               en:'Easy as pie' },
    { es:'Tirar la toalla',              en:'To throw in the towel' },
    { es:'No hay mal que por bien no venga', en:'Every cloud has a silver lining' },
    { es:'Costar un ojo de la cara',     en:'To cost an arm and a leg' },
  ]},
];

function PhrasebookPage() {
  const nav = window.__nav || (() => {});
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Saved phrases" title="Phrasebook" subtitle="Real-world phrases organized by situation. Tap any phrase to hear it, save it, or add it to a deck."
          right={<div style={{ display:'flex', gap:8 }}>
            <Btn label="Practice all" onClick={() => { window.__phraseCat = 'all'; nav('phrasebook_practice'); }} variant="outline" accent={T.ink} icon={Icon.play()}/>
            <Btn label="New collection" accent={T.brand} icon={Icon.plus()}/>
          </div>}
        />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
          {PHRASEBOOK_CATS.map(c => (
            <Card key={c.id} padding={20}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{c.name}</div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{c.count} phrases</div>
                </div>
                <button onClick={() => { window.__phraseCat = c.id; nav('phrasebook_practice'); }} style={{ padding:'7px 12px', borderRadius:99, background:T.brand, color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                  {Icon.play({ width:9, height:9 })} Practice
                </button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {c.phrases.slice(0,3).map(p => (
                  <div key={p.es} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', background:T.bg2, borderRadius:10 }}>
                    <button style={{ width:26, height:26, borderRadius:7, background:T.card, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.play({ width:9, height:9 })}</button>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontFamily:T.serif, fontSize:14, color:T.ink, fontStyle:'italic', lineHeight:1.3 }}>"{p.es}"</div>
                      <div style={{ fontSize:11.5, color:T.ink4, marginTop:2, lineHeight:1.3 }}>{p.en}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Phrasebook Practice — speak/listen drill mode ─────────────
function PhrasebookPracticePage() {
  const nav = window.__nav || (() => {});
  const catId = (typeof window !== 'undefined' && window.__phraseCat) || 'all';
  const cat = PHRASEBOOK_CATS.find(c => c.id === catId);
  const allPhrases = cat ? cat.phrases : PHRASEBOOK_CATS.flatMap(c => c.phrases);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState('listen'); // listen | speak
  const [done, setDone] = useState([]);
  const total = allPhrases.length;
  const phrase = allPhrases[idx];

  const next = () => {
    setDone(d => [...d, idx]);
    setRevealed(false);
    if (idx < total - 1) setIdx(idx + 1);
    else nav('phrasebook');
  };
  const prev = () => { setRevealed(false); if (idx > 0) setIdx(idx - 1); };

  const progress = ((idx + 1) / total) * 100;
  const catName = cat ? cat.name : 'All phrases';

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 32px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
        <button onClick={() => nav('phrasebook')} style={{ width:34, height:34, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg2, color:T.ink2, cursor:'pointer' }}>
          {Icon.x ? Icon.x({ width:14, height:14 }) : <span style={{ fontSize:18, fontWeight:300 }}>×</span>}
        </button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:3 }}>Phrasebook practice · {catName}</div>
          <div style={{ height:6, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
            <div style={{ width:`${progress}%`, height:'100%', background:T.brand, borderRadius:99, transition:'width .3s' }}/>
          </div>
        </div>
        <div style={{ fontFamily:T.mono, fontSize:13, color:T.ink2 }}>{idx + 1} / {total}</div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:'flex', justifyContent:'center', padding:'18px 0 8px' }}>
        <div style={{ display:'inline-flex', background:T.bg2, padding:4, borderRadius:99, gap:2 }}>
          {[
            { id:'listen', label:'Listen', ic:Icon.play },
            { id:'speak',  label:'Speak & repeat', ic:Icon.mic },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding:'8px 18px', borderRadius:99, fontSize:12.5, fontWeight:700,
              background: mode === m.id ? T.card : 'transparent',
              color: mode === m.id ? T.ink : T.ink3,
              boxShadow: mode === m.id ? '0 1px 4px rgba(0,0,0,.06)' : 'none',
              display:'flex', alignItems:'center', gap:6, cursor:'pointer'
            }}>
              {m.ic && m.ic({ width:11, height:11 })} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px 40px 40px' }}>
        <div style={{ width:'100%', maxWidth:680, background:T.card, border:`1px solid ${T.border}`, borderRadius:24, padding:'56px 48px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,.06)' }}>
          {/* Phrase */}
          <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.25, color:T.ink, marginBottom:20, fontStyle:'italic' }}>"{phrase?.es}"</div>

          {/* Listen button big */}
          {mode === 'listen' && (
            <button style={{
              width:72, height:72, borderRadius:'50%', background:T.brand, color:'#fff',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 12px 28px rgba(192,74,6,.35)', cursor:'pointer', marginBottom:24
            }}>{Icon.play({ width:24, height:24 })}</button>
          )}
          {mode === 'speak' && (
            <button style={{
              width:72, height:72, borderRadius:'50%', background:T.speaking.c, color:'#fff',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 12px 28px ${T.speaking.c}55`, cursor:'pointer', marginBottom:24
            }}>{Icon.mic({ width:24, height:24 })}</button>
          )}

          {/* Reveal */}
          {revealed ? (
            <div style={{ borderTop:`1px solid ${T.hairline}`, paddingTop:20, marginTop:8 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>Translation</div>
              <div style={{ fontSize:18, color:T.ink2 }}>{phrase?.en}</div>
            </div>
          ) : (
            <button onClick={() => setRevealed(true)} style={{ fontSize:13, fontWeight:700, color:T.brand, padding:'8px 14px', borderRadius:8, background:T.bg2, cursor:'pointer' }}>
              Reveal translation
            </button>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderTop:`1px solid ${T.hairline}`, background:T.card }}>
        <button onClick={prev} disabled={idx === 0} style={{ padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:700, color: idx === 0 ? T.ink4 : T.ink2, background:T.bg2, cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? .5 : 1 }}>← Previous</button>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label="Save phrase" variant="outline" accent={T.ink} icon={Icon.bookmark ? Icon.bookmark() : null}/>
          <Btn label={idx === total - 1 ? 'Finish' : 'Next phrase →'} accent={T.brand} onClick={next}/>
        </div>
      </div>
    </div>
  );
}

function ReceiptsPage() {
  const rows = [
    { id:'INV-2025-0412', date:'Apr 12, 2025', desc:'Pro · Monthly',    amt:'$14.00', status:'Paid',     method:'•••• 4242' },
    { id:'INV-2025-0312', date:'Mar 12, 2025', desc:'Pro · Monthly',    amt:'$14.00', status:'Paid',     method:'•••• 4242' },
    { id:'INV-2025-0228', date:'Feb 28, 2025', desc:'Mock exam credit', amt:'$2.00',  status:'Paid',     method:'•••• 4242' },
    { id:'INV-2025-0212', date:'Feb 12, 2025', desc:'Pro · Monthly',    amt:'$14.00', status:'Paid',     method:'•••• 4242' },
    { id:'INV-2025-0114', date:'Jan 14, 2025', desc:'Annual · upgrade', amt:'$84.00', status:'Refunded', method:'•••• 4242' },
    { id:'INV-2025-0112', date:'Jan 12, 2025', desc:'Pro · Monthly',    amt:'$14.00', status:'Paid',     method:'•••• 4242' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Billing" title="Receipts and invoices" subtitle="Every payment, refund, and credit. Download as PDF for your records."
          right={<div style={{ display:'flex', gap:8 }}><Btn label="Manage plan" nav="pricing" variant="outline" accent={T.ink}/><Btn label="Export all" accent={T.brand} icon={Icon.download ? Icon.download() : Icon.arrow()}/></div>}
        />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:24 }}>
          <StatTile label="Lifetime spend" value="$182" big/>
          <StatTile label="This year" value="$58" delta="3 invoices" big/>
          <StatTile label="Next charge" value="May 12" delta="$14.00" big color={T.brand}/>
        </div>

        <Card padding={0}>
          <div style={{ padding:'14px 22px', borderBottom:`1px solid ${T.hairline}`, display:'grid', gridTemplateColumns:'1.2fr 1fr 2fr 1fr 1fr 80px', gap:14, fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>
            <div>Invoice</div><div>Date</div><div>Description</div><div>Amount</div><div>Status</div><div></div>
          </div>
          {rows.map((r, i) => (
            <div key={r.id} style={{ padding:'14px 22px', display:'grid', gridTemplateColumns:'1.2fr 1fr 2fr 1fr 1fr 80px', gap:14, alignItems:'center', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ fontFamily:T.mono, fontSize:12, color:T.ink2 }}>{r.id}</div>
              <div style={{ fontSize:12.5, color:T.ink2 }}>{r.date}</div>
              <div>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.desc}</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{r.method}</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{r.amt}</div>
              <div><Chip label={r.status} accent={r.status === 'Paid' ? '#1A8F4E' : T.ink3} bg={r.status === 'Paid' ? '#E5F5EB' : T.bg2} style={{ fontSize:10.5, padding:'3px 9px' }}/></div>
              <button style={{ fontSize:11, fontWeight:700, color:T.brand, textAlign:'right' }}>Download</button>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function ReferPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          {/* Hero */}
          <div style={{ background:`linear-gradient(135deg, ${T.brand} 0%, #B85428 100%)`, borderRadius:20, padding:'40px 44px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:24 }}>
            <div style={{ position:'absolute', right:-40, top:-40, width:240, height:240, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
            <div style={{ position:'absolute', right:60, bottom:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
            <Chip label="Refer a friend" accent="#fff" bg="rgba(255,255,255,.18)" style={{ fontSize:10.5, padding:'4px 11px', marginBottom:16 }}/>
            <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:13, color:'rgba(255,255,255,.8)', marginBottom:8, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
            <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.1, marginBottom:10, maxWidth:520 }}>Give 30 days. Get 30 days.</div>
            <div style={{ fontSize:14.5, lineHeight:1.6, opacity:.85, maxWidth:540, marginBottom:24 }}>For every friend who joins Pro, you both get a free month. No cap. Refer 12 friends and get a year on us.</div>

            {/* Referral link card */}
            <div style={{ background:'rgba(255,255,255,.14)', backdropFilter:'blur(10px)', border:'1px solid rgba(255,255,255,.2)', borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'center', gap:14, maxWidth:540 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10.5, fontWeight:700, opacity:.7, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:4 }}>Your link</div>
                <div style={{ fontFamily:T.mono, fontSize:13.5 }}>fluentra.app/r/marc-7q2k</div>
              </div>
              <button style={{ padding:'8px 14px', background:'#fff', color:T.brand, fontSize:12, fontWeight:700, borderRadius:9 }}>Copy</button>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:24 }}>
            <StatTile label="Friends invited" value="14" big/>
            <StatTile label="Joined Pro" value="6" big color={T.brand}/>
            <StatTile label="Months earned" value="6" delta="180 days" big/>
            <StatTile label="Pending" value="2" big/>
          </div>

          {/* Channels */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10, marginBottom:24 }}>
            {['Email','Messages','WhatsApp','X / Twitter'].map(ch => (
              <button key={ch} style={{ padding:'14px 16px', background:T.card, border:`1px solid ${T.border}`, borderRadius:12, display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700 }}>{ch[0]}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, textAlign:'left' }}>{ch}</div>
              </button>
            ))}
          </div>

          {/* Referral table */}
          <Card padding={0}>
            <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Your referrals</div>
              <button style={{ fontSize:11, fontWeight:700, color:T.brand }}>Invite more</button>
            </div>
            {[
              { who:'Sofia Chen',   init:'SC', bg:'#3F7CAC', date:'Apr 14', status:'Joined Pro', reward:'+30 days' },
              { who:'Marco Rivera', init:'MR', bg:'#A06940', date:'Apr 02', status:'Joined Pro', reward:'+30 days' },
              { who:'Yui Tanaka',   init:'YT', bg:'#8E6E95', date:'Mar 28', status:'Free trial', reward:'Pending' },
              { who:'Diego Costa',  init:'DC', bg:'#C56B47', date:'Mar 20', status:'Free trial', reward:'Pending' },
              { who:'Lior Adler',   init:'LA', bg:'#7A4FAB', date:'Mar 14', status:'Joined Pro', reward:'+30 days' },
              { who:'Ana Belkacem', init:'AB', bg:'#5B7553', date:'Feb 28', status:'Invite sent', reward:'—' },
            ].map((r, i) => (
              <div key={i} style={{ padding:'14px 22px', display:'flex', alignItems:'center', gap:14, borderTop:`1px solid ${T.hairline}` }}>
                <Avatar initials={r.init} size={36} bg={r.bg}/>
                <div style={{ flex:1, fontSize:13, fontWeight:700, color:T.ink }}>{r.who}</div>
                <div style={{ fontSize:12, color:T.ink3, width:80 }}>{r.date}</div>
                <Chip label={r.status} accent={r.status === 'Joined Pro' ? '#1A8F4E' : T.ink3} bg={r.status === 'Joined Pro' ? '#E5F5EB' : T.bg2} style={{ fontSize:10.5, padding:'3px 9px' }}/>
                <div style={{ fontSize:12, fontWeight:700, color: r.reward.startsWith('+') ? T.brand : T.ink4, width:80, textAlign:'right' }}>{r.reward}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PublicProfilePage, DMThreadPage, ActivityFeedPage, PhrasebookPage, PhrasebookPracticePage, ReceiptsPage, ReferPage, PHRASEBOOK_CATS });
