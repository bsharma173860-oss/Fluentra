// V2 + V4 web hybrid — dashboard with gradient hero + side-by-side ring
const { useState } = React;

// The hybrid card — gradient hero top, white sheet below with ring + stats
function HybridCard({ lang }) {
  const t = lang.theme;
  const lvl = levelFor(lang.streak);
  const progressPct = Math.min((lang.streak / 40) * 100, 100);
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius:24,
        overflow:'hidden',
        display:'flex',
        flexDirection:'column',
        background:`linear-gradient(160deg, ${t.accent} 0%, ${t.accent}dd 55%, ${t.bg} 100%)`,
        boxShadow: hover ? `0 16px 48px ${t.accent}33, 0 0 0 1px ${t.accent}22` : `0 4px 16px ${t.accent}18`,
        transform: hover ? 'translateY(-2px)' : 'none',
        transition:'all .25s cubic-bezier(.2,.8,.2,1)',
        cursor:'pointer',
      }}>
      {/* Gradient hero */}
      <div style={{ padding:'24px 26px 28px', color:'#fff', position:'relative', overflow:'hidden' }}>
        {/* decorative pattern */}
        <div style={{ position:'absolute', top:-20, right:-20, width:180, height:180, display:'grid', gridTemplateColumns:'repeat(10,1fr)', gap:10, opacity:.1, pointerEvents:'none' }}>
          {Array.from({length:80}).map((_,i) => <div key={i} style={{ width:4, height:4, borderRadius:2, background:'#fff' }}/>)}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, position:'relative' }}>
          <div style={{ boxShadow:'0 2px 8px rgba(0,0,0,.25)', borderRadius:6, overflow:'hidden' }}>
            <Flag code={lang.code} w={52} h={34}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:5, background:'rgba(255,255,255,.22)', padding:'6px 12px', borderRadius:99, backdropFilter:'blur(10px)' }}>
            <Icon.flame/>
            <span style={{ fontSize:13, fontWeight:700 }}>{lang.streak}-day</span>
          </div>
        </div>
        <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:42, lineHeight:1, marginBottom:4 }}>{lang.native}</div>
        <div style={{ fontSize:13, opacity:.85, fontWeight:500 }}>{lang.english} · {lvl.long}</div>
      </div>

      {/* White sheet — ring on left, stats + CTA on right */}
      <div style={{ background:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24, marginTop:'auto', padding:'22px 26px', display:'flex', gap:20 }}>
        <Ring pct={progressPct} size={108} stroke={9} color={t.accent}>
          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:'#000', lineHeight:1 }}>{lang.streak}</div>
          <div style={{ fontSize:9, color:'#999', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, marginTop:2 }}>Day streak</div>
        </Ring>
        <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
          <div style={{ display:'flex', gap:6, marginBottom:10, flexWrap:'wrap' }}>
            {lang.badges.map(b => (
              <div key={b} style={{ padding:'4px 10px', borderRadius:99, background:t.accentLight, color:t.accent, fontSize:10.5, fontWeight:700, letterSpacing:'.04em' }}>{b}</div>
            ))}
            <div style={{ padding:'4px 10px', borderRadius:99, background:'#F4F4F0', color:'#666', fontSize:10.5, fontWeight:700 }}>{lvl.short}</div>
          </div>
          <div style={{ marginBottom:12 }}>
            <div style={{ fontSize:11, color:'#999', textTransform:'uppercase', letterSpacing:'.08em', fontWeight:600, marginBottom:2 }}>Next up</div>
            <div style={{ fontSize:13.5, fontWeight:600, color:'#000', lineHeight:1.25 }}>{lang.nextSession.title}</div>
            <div style={{ fontSize:11, color:'#999', marginTop:2 }}>{lang.nextSession.time} · {lang.nextSession.focus}</div>
          </div>
          <button style={{ marginTop:'auto', padding:'10px 14px', background: hover ? t.accent : '#fff', color: hover ? '#fff' : t.accent, border:`1.5px solid ${t.accent}`, borderRadius:10, fontSize:12.5, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:6, cursor:'pointer', transition:'all .2s' }}>
            Continue <Icon.arrow/>
          </button>
        </div>
      </div>
    </div>
  );
}

// ── User menu popover ─────────────────────────────────────────
function UserMenu({ user, open, onClose }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const items = [
    { ic:'user',   label:'Profile',       meta:'View & edit' },
    { ic:'bars',   label:'Learning stats', meta:'All languages' },
    { ic:'bell',   label:'Notifications', meta:'On · 2 daily' },
    { ic:'book',   label:'Saved lessons', meta:'12' },
  ];

  return (
    <>
      {/* click-outside catcher */}
      <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:60 }}/>
      <div style={{
        position:'absolute', bottom:'calc(100% + 8px)', left:0, right:0,
        background:'#fff', borderRadius:14,
        boxShadow:'0 16px 48px rgba(0,0,0,.18), 0 0 0 1px rgba(0,0,0,.05)',
        padding:6, zIndex:70, animation:'fadeInUp .16s ease-out',
      }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 10px 12px', borderBottom:'1px solid #F4F4F4', marginBottom:4 }}>
          <div style={{ width:40, height:40, borderRadius:20, background:'linear-gradient(135deg,#C04A06,#E8732F)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, flexShrink:0 }}>
            {user.initial}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:'#000', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
            <div style={{ fontSize:11, color:'#999', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</div>
          </div>
        </div>

        {/* Plan row */}
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', margin:'0 2px 4px', background:'#F4F1EB', borderRadius:8 }}>
          <div style={{ width:20, height:20, borderRadius:5, background:'#C04A06', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><Icon.sparkle/></div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11.5, fontWeight:700, color:'#000', lineHeight:1.1 }}>Fluentra Pro</div>
            <div style={{ fontSize:10, color:'#888' }}>Renews Jun 12</div>
          </div>
          <button style={{ fontSize:10.5, fontWeight:700, color:'#C04A06' }}>Manage</button>
        </div>

        {/* Menu items */}
        <div style={{ display:'flex', flexDirection:'column', padding:'2px 0' }}>
          {items.map(it => (
            <button key={it.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, fontSize:12.5, color:'#333', textAlign:'left', width:'100%' }}
              onMouseEnter={e => e.currentTarget.style.background = '#F8F6F1'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ color:'#888' }}>{Icon[it.ic]()}</span>
              <span style={{ flex:1, fontWeight:500 }}>{it.label}</span>
              <span style={{ fontSize:10.5, color:'#BBB' }}>{it.meta}</span>
            </button>
          ))}
        </div>

        <div style={{ height:1, background:'#F4F4F4', margin:'4px 8px' }}/>

        <div style={{ display:'flex', flexDirection:'column', padding:'2px 0' }}>
          <button style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, fontSize:12.5, color:'#333', textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8F6F1'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#888'}}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            <span style={{ flex:1, fontWeight:500 }}>Settings</span>
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, fontSize:12.5, color:'#333', textAlign:'left' }}
            onMouseEnter={e => e.currentTarget.style.background = '#F8F6F1'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#888'}}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span style={{ flex:1, fontWeight:500 }}>Help & feedback</span>
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px', borderRadius:8, fontSize:12.5, color:'#C04A06', textAlign:'left', fontWeight:600 }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF0EE'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            <span style={{ flex:1 }}>Sign out</span>
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}

function WebSurface({ scale=1 }) {
  const W = 1280, H = 800;
  const totalStreak = LANGUAGES.reduce((a,l) => a + l.streak, 0);
  const avgFluency = Math.round(LANGUAGES.reduce((a,l) => a + Math.min((l.streak/40)*100,100), 0) / LANGUAGES.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const user = { name:'María García', email:'maria@fluentra.app', initial:'M' };

  return (
    <div style={{ width:W*scale, height:H*scale, background:'#F9F8F5', borderRadius:12*scale, boxShadow:'0 20px 60px rgba(0,0,0,.15), 0 0 0 1px rgba(0,0,0,.04)', overflow:'hidden', transform:`scale(${1})`, transformOrigin:'top left' }}>
        <div style={{ width:W, height:H, transform:`scale(${scale})`, transformOrigin:'top left' }}>
          <div style={{ display:'flex', height:'100%' }}>
            {/* Sidebar */}
            <div style={{ width:240, background:'#FFFEFA', borderRight:'1px solid #EAEAEA', padding:'24px 18px', display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:32, padding:'0 6px' }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#C04A06,#E8732F)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}><Icon.sparkle/></div>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:'#000' }}>Fluentra</div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {[
                  { ic:'home',   label:'Home',       active:true },
                  { ic:'bars',   label:'Progress' },
                  { ic:'book',   label:'Library' },
                  { ic:'search', label:'Explore' },
                ].map(item => (
                  <div key={item.label} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, background: item.active ? '#F4F1EB' : 'transparent', color: item.active ? '#000' : '#666', fontSize:13, fontWeight: item.active ? 600 : 500, cursor:'pointer' }}>
                    {Icon[item.ic]()} {item.label}
                  </div>
                ))}
              </div>

              <div style={{ margin:'24px 6px 10px', fontSize:10, color:'#999', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>Languages</div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {LANGUAGES.map(l => (
                  <div key={l.code} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:10, fontSize:13, color:'#333', cursor:'pointer' }}>
                    <Flag code={l.code} w={18} h={12} radius={2}/>
                    <span style={{ flex:1 }}>{l.english}</span>
                    <span style={{ display:'flex', alignItems:'center', gap:2, color:l.theme.accent, fontSize:11, fontWeight:700 }}>
                      <Icon.flame/>{l.streak}
                    </span>
                  </div>
                ))}
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', borderRadius:10, fontSize:12, color:'#999', cursor:'pointer' }}>
                  <Icon.plus/> Add language
                </div>
              </div>

              <div style={{ marginTop:'auto', padding:'12px', borderRadius:12, background:'#F4F1EB', fontSize:11, color:'#666', lineHeight:1.4, marginBottom:10 }}>
                <div style={{ fontWeight:700, color:'#000', marginBottom:2 }}>Weekly review</div>
                Ready Sunday · 8 min
              </div>

              {/* User row with popover */}
              <div style={{ position:'relative' }}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  style={{
                    width:'100%', display:'flex', alignItems:'center', gap:10,
                    padding:'8px 10px', borderRadius:12,
                    background: menuOpen ? '#F4F1EB' : 'transparent',
                    border: '1px solid', borderColor: menuOpen ? '#E4DFD3' : 'transparent',
                    transition:'background .15s, border-color .15s',
                    textAlign:'left',
                  }}
                  onMouseEnter={e => { if (!menuOpen) e.currentTarget.style.background = '#F8F6F1'; }}
                  onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ width:32, height:32, borderRadius:16, background:'linear-gradient(135deg,#C04A06,#E8732F)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>
                    {user.initial}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:600, color:'#000', lineHeight:1.1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.name}</div>
                    <div style={{ fontSize:10.5, color:'#999', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Pro plan</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color:'#999', transform: menuOpen ? 'rotate(180deg)' : 'none', transition:'transform .2s' }}>
                    <polyline points="18 15 12 9 6 15"/>
                  </svg>
                </button>

                <UserMenu user={user} open={menuOpen} onClose={() => setMenuOpen(false)}/>
              </div>
            </div>

            {/* Main */}
            <div style={{ flex:1, overflow:'auto' }}>
              {/* Top bar */}
              <div style={{ height:60, borderBottom:'1px solid #EAEAEA', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', background:'#F9F8F5' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, width:320, padding:'8px 14px', background:'#fff', borderRadius:10, border:'1px solid #EAEAEA', color:'#999' }}>
                  <Icon.search/><span style={{ fontSize:13 }}>Search lessons, phrases, grammar…</span>
                  <span style={{ marginLeft:'auto', fontSize:10, color:'#BBB', border:'1px solid #EAEAEA', borderRadius:4, padding:'2px 6px' }}>⌘K</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                  <Icon.bell style={{ color:'#666' }}/>
                  <div style={{ width:32, height:32, borderRadius:16, background:'#C04A06', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>M</div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding:'32px 40px 40px' }}>
                <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28 }}>
                  <div>
                    <div style={{ fontSize:12, fontWeight:700, color:'#999', letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Good afternoon, María</div>
                    <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:40, color:'#000', lineHeight:1.1 }}>Keep the streaks alive.</div>
                  </div>
                  <div style={{ display:'flex', gap:24 }}>
                    <div>
                      <div style={{ fontSize:10, color:'#999', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Total streak days</div>
                      <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:'#000', lineHeight:1 }}>{totalStreak}</div>
                    </div>
                    <div style={{ width:1, background:'#EAEAEA' }}/>
                    <div>
                      <div style={{ fontSize:10, color:'#999', letterSpacing:'.12em', textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>Avg. exam progress</div>
                      <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:'#000', lineHeight:1 }}>{avgFluency}%</div>
                    </div>
                  </div>
                </div>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:'#000' }}>Your languages</div>
                  <div style={{ display:'flex', gap:6 }}>
                    <button style={{ padding:'6px 12px', fontSize:12, fontWeight:600, color:'#000', background:'#fff', border:'1px solid #EAEAEA', borderRadius:8 }}>All 4</button>
                    <button style={{ padding:'6px 12px', fontSize:12, fontWeight:500, color:'#999', background:'transparent', borderRadius:8 }}>Active</button>
                    <button style={{ padding:'6px 12px', fontSize:12, fontWeight:500, color:'#999', background:'transparent', borderRadius:8 }}>Archived</button>
                  </div>
                </div>

                {/* 2x2 grid of hybrid cards */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
                  {LANGUAGES.map(lang => <HybridCard key={lang.code} lang={lang}/>)}
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

Object.assign(window, { WebSurface });
