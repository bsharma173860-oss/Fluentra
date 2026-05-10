// V5 phone prototype — home with expandable language cards
const { useState } = React;

function PhoneFrame({ children, scale=1 }) {
  const W = 390, H = 780;
  return (
    <div style={{ width:W*scale, height:H*scale, background:'#000', borderRadius:54*scale, padding:8*scale, boxShadow:'0 30px 80px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.04)' }}>
      <div style={{ width:'100%', height:'100%', background:'#F9F8F5', borderRadius:46*scale, overflow:'hidden', position:'relative' }}>
        {/* Dynamic island */}
        <div style={{ position:'absolute', top:12*scale, left:'50%', transform:'translateX(-50%)', width:120*scale, height:34*scale, background:'#000', borderRadius:20*scale, zIndex:100 }}/>
        {/* Status bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:54*scale, display:'flex', alignItems:'center', justifyContent:'space-between', padding:`0 ${28*scale}px`, fontSize:14*scale, fontWeight:600, color:'#000', zIndex:50 }}>
          <span>9:41</span>
          <span style={{ width:120*scale }}/>
          <span style={{ display:'flex', alignItems:'center', gap:4*scale }}>
            <svg width={16*scale} height={10*scale} viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" y="0" width="3" height="10" rx="1"/></svg>
            <svg width={22*scale} height={10*scale} viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x=".5" y=".5" width="18" height="9" rx="2"/><rect x="2" y="2" width="15" height="6" fill="currentColor"/><rect x="19.5" y="3.5" width="1.5" height="3" fill="currentColor"/></svg>
          </span>
        </div>
        <div style={{ position:'absolute', inset:0, paddingTop:54*scale }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Collapsed language card — tap to expand
function LangCardCollapsed({ lang, onTap }) {
  const t = lang.theme;
  return (
    <button onClick={onTap} style={{ width:'100%', textAlign:'left', padding:18, background:'#fff', borderRadius:20, border:'1px solid #EAEAEA', display:'flex', alignItems:'center', gap:14, cursor:'pointer', transition:'transform .15s, box-shadow .15s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,.06)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}>
      <Flag code={lang.code} w={42} h={30} radius={5}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:16, fontWeight:700, color:'#000', lineHeight:1.2 }}>{lang.native}</div>
        <div style={{ fontSize:12, color:'#999', marginTop:1 }}>{lang.english} · {levelFor(lang.streak).short}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:4, color:t.accent, marginRight:6 }}>
        <Icon.flame/>
        <span style={{ fontSize:13, fontWeight:700 }}>{lang.streak}</span>
      </div>
      <div style={{ color:'#BBB' }}><Icon.chev/></div>
    </button>
  );
}

// Expanded — V5 today-forward in full
function LangCardExpanded({ lang, onClose }) {
  const t = lang.theme;
  const [steps, setSteps] = useState(lang.nextSession.steps);
  const [completed, setCompleted] = useState(false);
  const progressPct = Math.min((lang.streak / 40) * 100, 100);
  const doneCount = steps.filter(s => s.done).length;
  const stepPct = (doneCount / steps.length) * 100;

  const toggleStep = (i) => {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, done: !s.done } : s));
  };

  return (
    <div style={{ background:'#fff', borderRadius:24, border:`1px solid ${t.accentLight}`, overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:`0 12px 40px ${t.accent}1a` }}>
      {/* Header */}
      <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:10, borderBottom:'1px solid #F4F4F4' }}>
        <Flag code={lang.code} w={32} h={22} radius={3}/>
        <div style={{ fontSize:15, fontWeight:700, color:'#000' }}>{lang.native}</div>
        <div style={{ fontSize:12, color:'#999' }}>· {lang.english}</div>
        <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:4, color:t.accent }}>
          <Icon.flame/><span style={{ fontSize:14, fontWeight:700 }}>{lang.streak}</span>
        </div>
        <button onClick={onClose} aria-label="Collapse" style={{ marginLeft:8, padding:4, color:'#BBB', cursor:'pointer' }}>
          <Icon.chev style={{ transform:'rotate(-90deg)' }}/>
        </button>
      </div>

      {/* Today's session hero */}
      <div style={{ padding:'20px 22px', background:t.bg, position:'relative', overflow:'hidden' }}>
        {/* decorative dots */}
        <div style={{ position:'absolute', top:10, right:-10, width:80, height:80, display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6, opacity:.12, pointerEvents:'none' }}>
          {Array.from({length:25}).map((_,i) => <div key={i} style={{ width:3, height:3, borderRadius:1.5, background:t.accent }}/>)}
        </div>
        <div style={{ fontSize:10, color:t.accent, letterSpacing:'.16em', textTransform:'uppercase', fontWeight:700, marginBottom:6 }}>Today's session</div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:'#000', lineHeight:1.15, marginBottom:6 }}>{lang.nextSession.title}</div>
        <div style={{ fontSize:12, color:'#666' }}>{lang.nextSession.time} · {lang.nextSession.focus}</div>
      </div>

      {/* Checklist */}
      <div style={{ padding:'16px 22px', display:'flex', flexDirection:'column', gap:10 }}>
        {steps.map((r, i) => (
          <button key={i} onClick={() => toggleStep(i)} style={{ display:'flex', alignItems:'center', gap:12, padding:'6px 0', cursor:'pointer', textAlign:'left', width:'100%' }}>
            <div style={{ width:26, height:26, borderRadius:13, background: r.done ? t.accent : '#F4F4F0', color: r.done ? '#fff' : '#999', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background .2s' }}>
              {r.done ? <Icon.check/> : Icon[r.ic]()}
            </div>
            <div style={{ flex:1, fontSize:13.5, color: r.done ? '#BBB' : '#000', fontWeight:500, textDecoration: r.done ? 'line-through' : 'none', transition:'color .2s' }}>{r.label}</div>
            <div style={{ fontSize:11, color:'#BBB' }}>{r.meta}</div>
          </button>
        ))}
      </div>

      {/* Session progress + CTA */}
      <div style={{ padding:'4px 22px 20px' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6, fontSize:11 }}>
          <span style={{ color:'#999', fontWeight:600, letterSpacing:'.05em' }}>SESSION</span>
          <span style={{ color:'#666', fontWeight:600 }}>{doneCount}/{steps.length} steps</span>
        </div>
        <div style={{ height:4, background:'#F4F4F0', borderRadius:99, overflow:'hidden', marginBottom:14 }}>
          <div style={{ height:'100%', width:stepPct+'%', background:t.accent, borderRadius:99, transition:'width .3s' }}/>
        </div>
        <button
          onClick={() => setCompleted(c => !c)}
          style={{ width:'100%', padding:'14px', background: completed ? '#E8E6DF' : t.accent, color: completed ? '#888' : '#fff', borderRadius:14, fontSize:14.5, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', transition:'background .2s' }}>
          {completed ? 'Session started →' : <>Continue <Icon.arrow/></>}
        </button>

        {/* Meta row */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:14, paddingTop:14, borderTop:'1px solid #F4F4F4', fontSize:11, color:'#999' }}>
          <div>{lang.badges.join(' · ')} · {levelFor(lang.streak).short}</div>
          <div>{lang.streak}/40 to exam</div>
        </div>
      </div>
    </div>
  );
}

function PhoneSurface({ scale=1 }) {
  const [expandedCode, setExpandedCode] = useState('es'); // default-open Spanish
  const user = { name: 'María' };
  const hour = 14;
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <PhoneFrame scale={scale}>
      <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column' }}>
        {/* Scrollable content */}
        <div style={{ flex:1, overflow:'auto', padding:'28px 22px 100px' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'#999', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4 }}>{greet}</div>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:34, color:'#000', lineHeight:1, marginBottom:24 }}>{user.name}.</div>

          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#999', letterSpacing:'.1em', textTransform:'uppercase' }}>Your languages</div>
            <button style={{ display:'flex', alignItems:'center', gap:4, fontSize:12, color:'#666', fontWeight:600, cursor:'pointer' }}>
              <Icon.plus/> Add
            </button>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {LANGUAGES.map(lang => (
              expandedCode === lang.code
                ? <LangCardExpanded key={lang.code} lang={lang} onClose={() => setExpandedCode(null)}/>
                : <LangCardCollapsed key={lang.code} lang={lang} onTap={() => setExpandedCode(lang.code)}/>
            ))}
          </div>

          <div style={{ marginTop:28, padding:'16px 18px', background:'#fff', border:'1px solid #EAEAEA', borderRadius:16, display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:20, background:'#F4F4F0', display:'flex', alignItems:'center', justifyContent:'center', color:'#C04A06' }}>
              <Icon.sparkle/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#000' }}>Weekly review is ready</div>
              <div style={{ fontSize:11, color:'#999', marginTop:2 }}>8 min · covers 42 new words</div>
            </div>
            <Icon.chev style={{ color:'#BBB' }}/>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'rgba(249,248,245,.95)', backdropFilter:'blur(12px)', borderTop:'1px solid #EAEAEA', display:'flex', alignItems:'flex-start', justifyContent:'space-around', padding:'12px 30px 0' }}>
          {[
            { ic:'home',  label:'Home',     active:true },
            { ic:'bars',  label:'Progress', active:false },
            { ic:'search',label:'Explore',  active:false },
            { ic:'user',  label:'Profile',  active:false },
          ].map(t => (
            <div key={t.label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, color: t.active ? '#000' : '#BBB' }}>
              {Icon[t.ic]()}
              <span style={{ fontSize:10, fontWeight:600 }}>{t.label}</span>
            </div>
          ))}
        </div>

        {/* Home indicator */}
        <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', width:134, height:5, background:'#000', borderRadius:3, zIndex:60 }}/>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { PhoneSurface });
