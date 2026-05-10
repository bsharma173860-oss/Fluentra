// ── Exam booking + Exam history ────────────────────────────

function ExamBookPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Test centers" title="Book the real exam" subtitle="Schedule your IELTS, TOEFL, DELE or DELF at an official testing center near you."
          right={<Btn label="Past attempts" nav="exam_history" variant="outline" accent={T.ink} icon={Icon.clock()}/>}
        />

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:24 }}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Step 1 — Exam */}
            <Card padding={20}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:24, height:24, borderRadius:12, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>1</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Choose exam</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                {[
                  { name:'IELTS Academic', flag:'en', target:'7.5', selected:true },
                  { name:'TOEFL iBT',      flag:'en', target:'100' },
                  { name:'DELE B2',        flag:'es', target:'B2' },
                  { name:'DELF B2',        flag:'fr', target:'B2' },
                ].map(e => (
                  <button key={e.name} style={{ padding:'14px 16px', background: e.selected ? T.brandLight : T.bg, border:`1.5px solid ${e.selected ? T.brand : T.border}`, borderRadius:12, textAlign:'left', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                    <Flag code={e.flag} w={26} h={18} radius={3}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{e.name}</div>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Target: {e.target}</div>
                    </div>
                    {e.selected && <div style={{ color:T.brand }}>{Icon.check()}</div>}
                  </button>
                ))}
              </div>
            </Card>

            {/* Step 2 — Center */}
            <Card padding={20}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:24, height:24, borderRadius:12, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>2</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Pick a center</div>
              </div>
              <input defaultValue="Madrid, Spain" style={{ width:'100%', padding:'10px 14px', fontSize:13, border:`1px solid ${T.border}`, borderRadius:10, marginBottom:12 }}/>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { name:'British Council Madrid', addr:'Paseo del General Martínez Campos, 31', dist:'2.4 km', slots:'12 slots this month', selected:true },
                  { name:'IDP IELTS Madrid Centro',     addr:'Calle de Alcalá, 21',                  dist:'4.1 km', slots:'8 slots this month' },
                  { name:'British Council Toledo',      addr:'Plaza de la Magdalena, 9',             dist:'68 km',  slots:'4 slots this month' },
                ].map((c, i) => (
                  <button key={i} style={{ padding:'12px 14px', background: c.selected ? T.brandLight : 'transparent', border:`1.5px solid ${c.selected ? T.brand : T.border}`, borderRadius:11, textAlign:'left', display:'flex', alignItems:'center', gap:12, cursor:'pointer' }}>
                    <div style={{ width:32, height:32, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.book ? Icon.book({ width:14, height:14 }) : '📍'}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{c.name}</div>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{c.addr} · {c.dist}</div>
                    </div>
                    <div style={{ fontSize:11, color: c.selected ? T.brand : T.ink4, fontWeight:600, textAlign:'right' }}>{c.slots}</div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Step 3 — Date */}
            <Card padding={20}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
                <div style={{ width:24, height:24, borderRadius:12, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700 }}>3</div>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Pick a date</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <button style={{ width:30, height:30, borderRadius:8, color:T.ink2 }}>‹</button>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>May 2025</div>
                <button style={{ width:30, height:30, borderRadius:8, color:T.ink2 }}>›</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(7, 1fr)', gap:4 }}>
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <div key={i} style={{ padding:6, fontSize:10, color:T.ink4, fontWeight:700, textAlign:'center' }}>{d}</div>
                ))}
                {Array.from({ length:35 }).map((_, i) => {
                  const day = i - 2;
                  const valid = day >= 1 && day <= 31;
                  const available = valid && [3, 7, 10, 14, 17, 21, 24, 28].includes(day);
                  const selected = day === 17;
                  return (
                    <button key={i} disabled={!available} style={{ aspectRatio:'1', borderRadius:8, fontSize:13, fontWeight: selected ? 700 : 500, color: !valid ? 'transparent' : selected ? '#fff' : available ? T.ink : T.ink5, background: selected ? T.brand : available ? T.brandLight : 'transparent', cursor: available ? 'pointer' : 'default' }}>
                      {valid ? day : ''}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right — Summary */}
          <div style={{ position:'sticky', top:0, alignSelf:'flex-start' }}>
            <Card padding={22}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Booking summary</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:12.5, color:T.ink2, marginBottom:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Exam</span><span style={{ fontWeight:700, color:T.ink }}>IELTS Academic</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Center</span><span style={{ fontWeight:700, color:T.ink }}>British Council Madrid</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Date</span><span style={{ fontWeight:700, color:T.ink }}>Sat, May 17 · 9:00 AM</span></div>
                <div style={{ display:'flex', justifyContent:'space-between' }}><span>Duration</span><span style={{ fontWeight:700, color:T.ink }}>2h 45m</span></div>
              </div>
              <div style={{ borderTop:`1px solid ${T.hairline}`, paddingTop:14, marginBottom:18, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <div style={{ fontSize:12, color:T.ink3 }}>Total</div>
                <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink }}>$249.00</div>
              </div>
              <Btn label="Book and pay" accent={T.brand} fullWidth iconRight={Icon.arrow()} onClick={() => window.payFor && window.payFor('exam_book')}/>
              <div style={{ marginTop:12, fontSize:11, color:T.ink4, textAlign:'center', lineHeight:1.5 }}>Free reschedule up to 48h before. Cancellations refundable up to 7 days before.</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamHistoryPage() {
  const attempts = [
    { exam:'IELTS Practice Mock', date:'Apr 14, 2025', score:'7.0', delta:'+0.5', mods:{ R:7.5, L:7.5, W:6.5, S:6.5 }, kind:'Mock' },
    { exam:'IELTS Practice Mock', date:'Mar 22, 2025', score:'6.5', delta:'+0.5', mods:{ R:7.0, L:7.0, W:6.0, S:6.0 }, kind:'Mock' },
    { exam:'IELTS Real Exam',     date:'Feb 18, 2025', score:'7.5', delta:'',      mods:{ R:8.0, L:7.5, W:7.0, S:7.5 }, kind:'Real', cert:true },
    { exam:'DELE B2 Practice',    date:'Mar 04, 2025', score:'72',  delta:'+8',    mods:{ R:18, L:16, W:20, S:18 },     kind:'Mock' },
    { exam:'TOEFL iBT Mock',      date:'Mar 28, 2025', score:'92',  delta:'+4',    mods:{ R:24, L:22, W:24, S:22 },     kind:'Mock' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Past attempts" title="Exam history" subtitle="Every mock and real exam, with module-level scores and downloadable score reports."
          right={<Btn label="Schedule new" nav="exam_book" accent={T.brand} icon={Icon.plus()}/>}
        />

        {/* Summary strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:24 }}>
          <StatTile label="Total attempts" value="14" delta="+3" big/>
          <StatTile label="Best score" value="7.5" delta="+0.5" big color={T.brand}/>
          <StatTile label="Avg delta / mock" value="+0.4" big/>
          <StatTile label="Real exams" value="2" big/>
        </div>

        <Card padding={0}>
          <div style={{ padding:'14px 22px', borderBottom:`1px solid ${T.hairline}`, display:'grid', gridTemplateColumns:'1.4fr .8fr .6fr 1fr 1fr 80px', gap:14, fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>
            <div>Exam</div><div>Date</div><div>Score</div><div>Δ</div><div>Modules (R · L · W · S)</div><div></div>
          </div>
          {attempts.map((a, i) => (
            <button key={i} data-nav="exam_results" style={{ display:'grid', gridTemplateColumns:'1.4fr .8fr .6fr 1fr 1fr 80px', gap:14, padding:'16px 22px', alignItems:'center', borderBottom: i < attempts.length-1 ? `1px solid ${T.hairline}` : 'none', textAlign:'left', cursor:'pointer', width:'100%', background:'transparent' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <Chip label={a.kind} accent={a.kind === 'Real' ? T.brand : T.ink3} bg={a.kind === 'Real' ? T.brandLight : T.bg2} style={{ fontSize:9.5, padding:'2px 7px' }}/>
                  {a.cert && <Chip label="Certified" accent="#1A8F4E" bg="#E5F5EB" style={{ fontSize:9.5, padding:'2px 7px' }}/>}
                </div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginTop:4 }}>{a.exam}</div>
              </div>
              <div style={{ fontSize:12.5, color:T.ink2 }}>{a.date}</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{a.score}</div>
              <div style={{ fontSize:12, fontWeight:700, color: a.delta.startsWith('-') ? '#B00020' : a.delta ? '#1A8F4E' : T.ink4 }}>{a.delta || '—'}</div>
              <div style={{ display:'flex', gap:6 }}>
                {Object.entries(a.mods).map(([k, v]) => (
                  <div key={k} style={{ flex:1, padding:'4px 6px', background:T.bg2, borderRadius:6, textAlign:'center' }}>
                    <div style={{ fontSize:9.5, color:T.ink4, fontWeight:700 }}>{k}</div>
                    <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ color:T.ink5, textAlign:'right' }}>{Icon.chev()}</div>
            </button>
          ))}
        </Card>
      </div>
    </div>
  );
}

Object.assign(window, { ExamBookPage, ExamHistoryPage });
