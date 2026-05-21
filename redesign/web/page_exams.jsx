// ── Page 6: Exams ───────────────────────────────────────────
// Dark hero + leaderboard, premium gravitas

function ExamsPage() {
  const exams = [
    { name:'IELTS Academic',   lang:'en', flag:'en', color:T.speaking.c,  bg:T.speaking.bg,  next:'Apr 28', score:'7.0', sessions:18 },
    { name:'TOEFL iBT',        lang:'en', flag:'en', color:'#1558B0',     bg:'#EEF6FF',      next:'May 12', score:'92',  sessions:6  },
    { name:'DELE B2',          lang:'es', flag:'es', color:T.brand,       bg:T.brandLight,   next:'Jun 04', score:'72',  sessions:4  },
    { name:'DELF B2',          lang:'fr', flag:'fr', color:'#1558B0',     bg:'#EEF6FF',      next:'May 30', score:'68',  sessions:2  },
    { name:'JLPT N4',          lang:'ja', flag:'ja', color:'#C84070',     bg:'#FFE0EC',      next:'Jul 07', score:'B',   sessions:5  },
    { name:'Goethe B1',        lang:'de', flag:'de', color:T.writing.c,   bg:T.writing.bg,   next:'—',       score:'—',   sessions:0  },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        {/* Dark hero */}
        <div style={{ background:T.ink, color:'#fff', padding:'40px 36px', position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', top:-50, right:-50, width:400, height:400, display:'grid', gridTemplateColumns:'repeat(20,1fr)', gap:14, opacity:.06, pointerEvents:'none' }}>
            {Array.from({ length:300 }).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
          </div>
          <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:32 }}>
            <div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Certification track</div>
              <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1.05, marginBottom:10, maxWidth:540 }}>Your road to certified.</div>
              <div style={{ fontSize:14, color:'rgba(255,255,255,.7)', maxWidth:540, lineHeight:1.5 }}>Track scheduled exams, monthly mocks, and your global percentile. Practice runs are graded by the same rubrics as the real test.</div>
            </div>
            <div style={{ display:'flex', gap:32, alignItems:'flex-end' }}>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1, color:'#fff' }}>P82</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginTop:6 }}>Global percentile</div>
              </div>
              <div style={{ width:1, height:60, background:'rgba(255,255,255,.18)' }}/>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:1, color:'#fff' }}>4</div>
                <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginTop:6 }}>Active exams</div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding:'28px 36px 40px' }}>
          {/* Next exam strip + Mock Exam tier card */}
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:14, marginBottom:32 }}>
            <div style={{ background:T.brand, color:'#fff', borderRadius:16, padding:'22px 26px', display:'flex', alignItems:'center', gap:20 }}>
              <div style={{ width:48, height:48, borderRadius:12, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.trophy({ width:20, height:20 })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.7)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>Next up</div>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.1 }}>IELTS Mock · Apr 28</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.75)', marginTop:4 }}>2h 45m · all 4 modules · graded vs real bands</div>
              </div>
              <Btn label="Start practice run" nav="mock_test" iconRight={Icon.arrow()} accent="#fff" style={{ color:T.brand }}/>
            </div>

            <div style={{ background:T.card, border:`1.5px solid ${T.brand}33`, borderRadius:16, padding:'18px 20px', display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                <Chip label="Daily mock" accent={T.brand} bg={T.brandLight} style={{ fontSize:10 }}/>
                <Chip label="Free on Pro" accent="#1A8F4E" bg="#E5F5EB" style={{ fontSize:10 }}/>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.2, marginBottom:4 }}>Take a mock without a streak.</div>
              <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.45, marginBottom:12 }}>Pro: unlimited daily mocks free. Free tier: $2 per session — same scoring rubric.</div>
              <div style={{ display:'flex', gap:8, marginTop:'auto' }}>
                <Btn label="Free mock" nav="mock_test" accent={T.brand} size="sm" iconRight={Icon.arrow()}/>
                <Btn label="$5 official" onClick={() => window.payFor && window.payFor('exam_official')} variant="outline" accent={T.ink2} size="sm"/>
              </div>
            </div>
          </div>

          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:14 }}>All exams</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:32 }}>
            {exams.map(e => (
                <Card key={e.name} padding={0} data-nav="exam_entry" data-lang={e.lang} style={{ overflow:'hidden', cursor:'pointer' }}>
                <div style={{ padding:'18px 20px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)', borderRadius:4, overflow:'hidden' }}>
                    <Flag code={e.flag} w={32} h={22} radius={4}/>
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{e.name}</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{e.sessions} sessions logged</div>
                  </div>
                </div>
                <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Best</div>
                    <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1, marginTop:3 }}>{e.score}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Next mock</div>
                    <div style={{ fontSize:13, color:T.ink, fontWeight:600, marginTop:3 }}>{e.next}</div>
                  </div>
                </div>
                <div data-nav="exam_entry" style={{ padding:'12px 20px', background:T.bg2, borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer' }}>
                  <div style={{ fontSize:11.5, color:e.color, fontWeight:700 }}>Open exam track</div>
                  <div style={{ color:e.color }}>{Icon.arrow({ width:13, height:13 })}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Leaderboard */}
          <Card padding={0} data-nav="leaderboard" style={{ cursor:'pointer' }}>
            <div style={{ padding:'18px 22px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>IELTS · global leaderboard</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Top 100 this month — your rank #18</div>
              </div>
              <Chip label="You · #18" accent={T.brand} bg={T.brandLight}/>
            </div>
            {[
              { rank:1,  name:'Akira Tanaka',   country:'ja', score:'8.5', sessions:54 },
              { rank:2,  name:'Lena Nowak',     country:'de', score:'8.5', sessions:48 },
              { rank:3,  name:'Pierre Dubois',  country:'fr', score:'8.0', sessions:62 },
              { rank:18, name:'María García',   country:'es', score:'7.5', sessions:24, you:true },
              { rank:19, name:'Sam Patel',      country:'en', score:'7.5', sessions:21 },
            ].map((row, i, all) => (
              <div key={row.rank} style={{ display:'grid', gridTemplateColumns:'40px 1fr 80px 100px 60px', padding:'12px 22px', alignItems:'center', borderBottom: i < all.length-1 ? `1px solid ${T.hairline}` : 'none', background: row.you ? T.brandLight : 'transparent' }}>
                <div style={{ fontFamily:T.serif, fontSize:18, color: row.rank <= 3 ? T.brand : T.ink3 }}>#{row.rank}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:30, height:30, borderRadius:15, background: T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>{row.name[0]}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{row.name} {row.you && <span style={{ color:T.brand, fontWeight:700 }}>· you</span>}</div>
                </div>
                <div><Flag code={row.country} w={20} h={14} radius={2}/></div>
                <div style={{ fontSize:12, color:T.ink3 }}>{row.sessions} sessions</div>
                <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, textAlign:'right' }}>{row.score}</div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ExamsPage });
