// ── Mobile · Exams v4 — WEB VOCABULARY ──────────────────────
function MExams() {
  const nav = (id) => window.__nav && window.__nav(id);
  const exams = [
    { name:'IELTS Academic',   flag:'en', color:T.speaking.c, bg:T.speaking.bg, next:'Apr 28', score:'7.0', unit:'/9' },
    { name:'TOEFL iBT',        flag:'en', color:'#1558B0',    bg:'#EEF6FF',     next:'May 12', score:'92',  unit:'/120' },
    { name:'DELE B2',          flag:'es', color:T.brand,      bg:T.brandLight,  next:'Jun 04', score:'72',  unit:'/100' },
    { name:'DELF B2',          flag:'fr', color:'#1558B0',    bg:'#EEF6FF',     next:'May 30', score:'68',  unit:'/100' },
    { name:'JLPT N4',          flag:'ja', color:'#C84070',    bg:'#FFE0EC',     next:'Jul 07', score:'B',   unit:'pass' },
  ];

  return (
    <>
      <MobileHeader title="Exams" eyebrow="Certification · 4 active" large
        right={<span style={{ fontSize:10, fontWeight:700, color:T.brand, background:T.brandLight, padding:'5px 10px', borderRadius:99, letterSpacing:'.08em' }}>P82 · TOP 2%</span>}
      />
      <MobileBody padding={0}>
        {/* NEXT MOCK — bold orange CTA card */}
        <div style={{ padding:'4px 18px 14px' }}>
          <button onClick={()=>nav('mock_test')} style={{
            width:'100%', textAlign:'left',
            background:`linear-gradient(110deg, ${T.brand} 0%, #B85A3E 100%)`,
            color:'#fff', borderRadius:18, padding:'18px 20px',
            border:'none', boxShadow:`0 12px 30px ${T.brand}55`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:'rgba(255,255,255,.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.trophy({ width:17, height:17 })}</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:'rgba(255,255,255,.85)', letterSpacing:'.14em', textTransform:'uppercase' }}>Next up · Apr 28</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:'#fff', lineHeight:1.1, marginBottom:4 }}>IELTS Mock Test.</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.85)', marginBottom:14 }}>2h 45m · all 4 modules · private practice</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 16px', background:'#fff', color:T.brand, borderRadius:10, fontSize:12.5, fontWeight:700 }}>
                Take mock {Icon.arrow({ width:12, height:12 })}
              </div>
            </div>
          </button>
        </div>

        {/* ALL EXAMS — list inside Card */}
        <div style={{ padding:'4px 18px 14px' }}>
          <MobileSectionHead title="All exams"/>
          <MCard style={{ padding:0 }}>
            {exams.map((e, i, all) => (
              <button key={e.name} onClick={()=>nav('exam_book')} style={{
                width:'100%', textAlign:'left',
                background:'transparent', border:'none',
                borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none',
                padding:'12px 14px',
                display:'flex', alignItems:'center', gap:11,
              }}>
                <div style={{ boxShadow:'inset 0 0 0 1px rgba(0,0,0,.08)', borderRadius:5, overflow:'hidden', flexShrink:0 }}>
                  <Flag code={e.flag} w={36} h={26} radius={4}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{e.name}</div>
                  <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>Mock · {e.next}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:e.color, lineHeight:1 }}>{e.score}</div>
                  <div style={{ fontSize:9, color:T.ink4, fontWeight:800, letterSpacing:'.08em', textTransform:'uppercase', marginTop:2 }}>Best</div>
                </div>
              </button>
            ))}
          </MCard>
        </div>

        {/* LEADERBOARD */}
        <div style={{ padding:'4px 18px 0' }}>
          <MobileSectionHead title="IELTS leaderboard" action="View" onAction={()=>nav('leaderboard')}/>
          <MCard style={{ padding:6 }}>
            {[
              { rank:1,  name:'Akira Tanaka',   country:'ja', score:'8.5' },
              { rank:2,  name:'Lena Nowak',     country:'de', score:'8.5' },
              { rank:3,  name:'Pierre Dubois',  country:'fr', score:'8.0' },
              { rank:18, name:'María García',   country:'es', score:'7.5', you:true },
            ].map((row, i, all) => (
              <div key={row.rank} style={{ display:'grid', gridTemplateColumns:'26px 1fr auto auto', padding:'9px 10px', alignItems:'center', gap:9, borderRadius:9, background: row.you ? T.brandLight : 'transparent', marginBottom: i < all.length - 1 ? 1 : 0 }}>
                <div style={{ fontFamily:T.serif, fontSize:14, color: row.rank <= 3 ? T.brand : T.ink3, lineHeight:1 }}>#{row.rank}</div>
                <div style={{ display:'flex', alignItems:'center', gap:7, minWidth:0 }}>
                  <div style={{ width:24, height:24, borderRadius:12, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>{row.name[0]}</div>
                  <div style={{ fontSize:11.5, fontWeight: row.you ? 700 : 600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.name}{row.you && <span style={{ color:T.brand }}> · you</span>}</div>
                </div>
                <Flag code={row.country} w={16} h={11} radius={2}/>
                <div style={{ fontFamily:T.serif, fontSize:13, color:T.ink, letterSpacing:'-.01em' }}>{row.score}</div>
              </div>
            ))}
          </MCard>
        </div>
      </MobileBody>
      <MobileTabBar active="exams"/>
    </>
  );
}

Object.assign(window, { MExams });
