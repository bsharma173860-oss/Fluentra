// ── Page 3: Practice / Modules ──────────────────────────────
// Linear-style dense module browser

function ModuleHeroCard({ title, subtitle, sessions, color, bg, ic, nav }) {
  return (
    <button data-nav={nav} style={{
      textAlign:'left', cursor:'pointer',
      borderRadius:18, padding:'24px 26px',
      background:`linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
      color:'#fff',
      border:'none',
      display:'flex', flexDirection:'column', gap:18,
      minHeight:170,
    }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div style={{ width:42, height:42, borderRadius:11, background:'rgba(255,255,255,.2)', backdropFilter:'blur(6px)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {Icon[ic]({ width:18, height:18 })}
        </div>
        <Chip label={`${sessions} sessions`} accent="#fff" bg="rgba(255,255,255,.2)"/>
      </div>
      <div style={{ marginTop:'auto' }}>
        <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.05, marginBottom:6 }}>{title}</div>
        <div style={{ fontSize:12.5, opacity:.85 }}>{subtitle}</div>
      </div>
    </button>
  );
}

function PracticePage() {
  const [pfilter, setPfilter] = React.useState('All');
  const _recentRows = (function () {
    var R = ((typeof window !== 'undefined' && window.__results) || []).filter(function (r) { return r && typeof r.score === 'number'; }).slice().reverse();
    var MOD = { reading:{ ic:'book', c:T.reading, label:'Reading' }, listening:{ ic:'head', c:T.listening, label:'Listening' }, writing:{ ic:'pen', c:T.writing, label:'Writing' }, speaking:{ ic:'mic', c:T.speaking, label:'Speaking' } };
    var lc = (typeof window !== 'undefined' && window.__langCode) || 'en';
    var lang = (typeof langByCode === 'function' && langByCode(lc) && langByCode(lc).name) || 'English';
    var rel = function (ts) { if (!ts) return ''; var d = (Date.now() - new Date(ts).getTime()) / 86400000; return d < 1 ? 'Today' : d < 2 ? 'Yesterday' : Math.floor(d) + ' days ago'; };
    return R.slice(0, 8).map(function (r) { var mod = (r.detail && r.detail.module) || ''; var m = MOD[mod] || { ic:'book', c:T.reading, label: mod ? mod.replace(/_/g, ' ').replace(/^./, function (ch) { return ch.toUpperCase(); }) : 'Session' }; return { ic:m.ic, c:m.c, module: mod, title: m.label + ((r.detail && r.detail.unit) ? (' · ' + r.detail.unit) : ''), lang: lang, langCode: lc, date: rel(r.updated_at), score: (r.score / 100 * 9).toFixed(1) + '/9' }; });
  })();
  const _shownRows = pfilter === 'All' ? _recentRows : _recentRows.filter(function (r) { return (r.module || '').toLowerCase() === pfilter.toLowerCase(); });
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow="Practice"
          title="Pick what you'll practice today."
          right={
            <Btn label="Custom session" nav="practice_runner" icon={Icon.plus()} accent={T.brand}/>
          }
        />

        {/* Module heroes */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:32 }}>
          <ModuleHeroCard nav="speaking"  ic="mic"  title="Speaking"  subtitle="Conversation drills + AI feedback" sessions={142} color={T.speaking.c}/>
          <ModuleHeroCard nav="writing"   ic="pen"  title="Writing"   subtitle="Essays graded by your exam rubric"           sessions={68}  color={T.writing.c}/>
          <ModuleHeroCard nav="listening" ic="head" title="Listening" subtitle="Native audio across topics"     sessions={94}  color={T.listening.c}/>
          <ModuleHeroCard nav="reading"   ic="book" title="Reading"   subtitle="Passages with comprehension Qs"        sessions={76}  color={T.reading.c}/>
        </div>

        {/* Filters */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:18 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginRight:8 }}>Module sessions</div>
          <div style={{ flex:1 }}/>
          {['All', 'Speaking', 'Writing', 'Listening', 'Reading'].map((f) => {
            const on = pfilter === f;
            return <button key={f} onClick={() => setPfilter(f)} style={{ padding:'6px 12px', fontSize:12, fontWeight: on ? 700 : 500, color: on ? T.ink : T.ink3, background: on ? T.card : 'transparent', border:`1px solid ${on ? T.border : 'transparent'}`, borderRadius:8, cursor:'pointer' }}>{f}</button>;
          })}
        </div>

        {/* Linear-style table */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'40px 1fr 120px 120px 90px 60px', padding:'12px 18px', borderBottom:`1px solid ${T.hairline}`, fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', alignItems:'center' }}>
            <span/>
            <span>Session</span>
            <span>Language</span>
            <span>Date</span>
            <span style={{ textAlign:'right' }}>Score</span>
            <span/>
          </div>
          {_shownRows.length === 0 ? (
            <div style={{ padding:'28px 18px', fontSize:13, color:T.ink3 }}>No practice yet — finish a module and your recent sessions will appear here.</div>
          ) : _shownRows.map((row, i, all) => (
            <div key={i} data-nav="progress" style={{ display:'grid', gridTemplateColumns:'40px 1fr 120px 120px 90px 60px', padding:'14px 18px', borderBottom: i < all.length - 1 ? `1px solid ${T.hairline}` : 'none', alignItems:'center', cursor:'pointer', transition:'background .12s' }}
              onMouseEnter={e => e.currentTarget.style.background = T.bg2}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width:28, height:28, borderRadius:8, background:row.c.bg, color:row.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {Icon[row.ic]({ width:13, height:13 })}
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{row.title}</div>
              <div style={{ fontSize:12, color:T.ink3, display:'flex', alignItems:'center', gap:6 }}>
                <Flag code={row.langCode || 'en'} w={16} h={11} radius={2}/>
                {row.lang}
              </div>
              <div style={{ fontSize:12, color:T.ink3 }}>{row.date}</div>
              <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, textAlign:'right' }}>{row.score}</div>
              <div style={{ textAlign:'right', color:T.ink5 }}>{Icon.chev({ width:13, height:13 })}</div>
            </div>
          ))}
        </div>

        {/* Quick start strip */}
        <div style={{ marginTop:32, padding:24, background:T.ink, borderRadius:16, color:'#fff', display:'flex', alignItems:'center', gap:24 }}>
          <div style={{ width:48, height:48, borderRadius:12, background:T.brand, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.spark({ width:20, height:20 })}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.1, marginBottom:4 }}>Daily mix · 18 min</div>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.7)' }}>One Speaking + one Listening + one Reading drill, picked from your weakest topics.</div>
          </div>
          <Btn label="Start mix" nav="practice_runner" iconRight={Icon.arrow()} accent="#fff" style={{ color:T.ink }}/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PracticePage });
