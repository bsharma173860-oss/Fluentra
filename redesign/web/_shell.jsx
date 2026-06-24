// ── Web Shell — sidebar, topbar, frame ───────────────────────
// Used by every web page. Page content slots into <main>.

const { useState: useStateW } = React;

function WebSidebar({ active='home', activeLang=null, onNav }) {
  const nav = onNav || window.__nav || (() => {});
  const [menuOpen, setMenuOpen] = useStateW(false);
  const items = [
    { id:'home',     ic:'home',   label:'Home' },
    { id:'practice', ic:'play',   label:'Practice' },
    { id:'library',  ic:'book',   label:'Library' },
    { id:'progress', ic:'bars',   label:'Progress' },
    { id:'exams',    ic:'trophy', label:'Exams' },
    { id:'activity_feed', ic:'users', label:'Circle' },
  ];

  return (
    <aside style={{ width:248, background:T.glassStrong, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur, borderRight:`1px solid ${T.glassBorder}`, padding:'22px 16px 16px', display:'flex', flexDirection:'column', flexShrink:0 }}>
      {/* Brand */}
      <button onClick={() => nav('dashboard')} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:30, padding:'0 8px', background:'none', cursor:'pointer' }}>
        <div style={{ width:30, height:30, borderRadius:9, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 4px 10px ${T.brand}33` }}>{Icon.brandmark({ width:18, height:18 })}</div>
        <div style={{ fontFamily:T.serif, fontSize:21, color:T.ink, lineHeight:1 }}>Fluentra</div>
      </button>

      {/* Nav */}
      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
        {items.map(it => (
          <NavItem key={it.id} active={active===it.id} {...it} onClick={() => nav(it.id === 'home' ? 'dashboard' : it.id)}/>
        ))}
      </div>

      {/* Languages — scrollable when many added so it never crowds menu/footer */}
      <div style={{ margin:'24px 8px 8px', fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span>Languages</span>
        <span style={{ fontSize:9.5, color:T.ink5, fontWeight:600, letterSpacing:'.04em', textTransform:'none' }}>{userLanguages().length}</span>
      </div>
      <div className="hide-scroll" style={{ display:'flex', flexDirection:'column', gap:1, maxHeight:200, overflowY:'auto', overflowX:'hidden', flexShrink:0 }}>
        {userLanguages().map(l => {
          const a = activeLang === l.code;
          const t = langTheme(l.code);
          return (
            <button key={l.code} onClick={() => { window.__langCode = l.code; nav('lang'); }} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', borderRadius:9, fontSize:13, color: a ? T.ink : T.ink2, background: a ? t.accentLight : 'transparent', cursor:'pointer', textAlign:'left', flexShrink:0 }}>
              <Flag code={l.code} w={20} h={14} radius={3}/>
              <span style={{ flex:1, fontWeight: a ? 700 : 500 }}>{l.english}</span>
              <span style={{ display:'flex', alignItems:'center', gap:3, color:t.accent, fontSize:11, fontWeight:700 }}>
                {Icon.flame()}{l.streak}
              </span>
            </button>
          );
        })}
      </div>
      <button onClick={() => nav('add_language')} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 12px', marginTop:4, borderRadius:9, fontSize:12, color:T.ink4, cursor:'pointer', textAlign:'left', flexShrink:0 }}>
        {Icon.addLang()} Add language
      </button>

      {/* Spacer + footer */}
      <div style={{ marginTop:'auto', display:'flex', flexDirection:'column', gap:10 }}>
        {/* Today's streak widget — replaces dead "Weekly review" card */}
        <button onClick={() => nav('streak')} style={{ padding:'14px 14px 12px', borderRadius:13, background:T.brandGrad, color:'#fff', border:'none', cursor:'pointer', textAlign:'left', boxShadow:`0 6px 16px ${T.brand}33` }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:6 }}>
            <div style={{ fontSize:10, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85 }}>Today</div>
            <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:13, fontWeight:700 }}>{Icon.flame({ width:13, height:13 })}{USER.streak}</div>
          </div>
          <div style={{ display:'flex', gap:3, marginBottom:8 }}>
            {['M','T','W','T','F','S','S'].map((d,i) => (
              <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                <div style={{ width:'100%', height:5, borderRadius:3, background: i < 5 ? '#fff' : 'rgba(255,255,255,.25)' }}/>
                <div style={{ fontSize:9, fontWeight:700, opacity: i < 5 ? .95 : .5 }}>{d}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize:11.5, opacity:.9, lineHeight:1.35 }}>15 min today → push to 8 days</div>
        </button>

        {/* Friends online — small, useful, not duplicated elsewhere */}
        <button onClick={() => nav('friends')} style={{ padding:'10px 12px', borderRadius:11, background:'transparent', border:`1px solid ${T.border}`, cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ display:'flex' }}>
            {['#D97757','#5B7B8A','#8E7AB5'].map((c,i) => (
              <div key={i} style={{ width:20, height:20, borderRadius:10, background:c, color:'#fff', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${T.paper}`, marginLeft: i?-7:0 }}>{['A','J','S'][i]}</div>
            ))}
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11.5, color:T.ink2, fontWeight:600 }}>3 friends online</div>
            <div style={{ fontSize:10, color:T.ink4 }}>Anya is on a 21-day streak</div>
          </div>
        </button>

        {/* User row + popover menu */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setMenuOpen(o => !o)} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:11, background: menuOpen ? T.bg2 : 'transparent', border:`1px solid ${menuOpen ? T.border : 'transparent'}`, textAlign:'left', cursor:'pointer', width:'100%' }}>
            <div style={{ width:32, height:32, borderRadius:16, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>{USER.initial}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, lineHeight:1.1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{USER.name}</div>
              <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{USER.plan}{USER.renewsOn ? ' · Renews ' + USER.renewsOn : ' plan'}</div>
            </div>
            {Icon.chevU({ width:13, height:13, style:{ color:T.ink4, transform: menuOpen ? 'rotate(180deg)' : 'none', transition:'transform .15s' } })}
          </button>
          {menuOpen && (
            <>
              <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:40 }}/>
              <div style={{ position:'absolute', bottom:'calc(100% + 8px)', left:0, right:0, background:T.card, border:`1px solid ${T.border}`, borderRadius:13, boxShadow:'0 12px 40px rgba(0,0,0,.14)', padding:6, zIndex:50, display:'flex', flexDirection:'column', gap:1 }}>
                <PopRow ic="profile" label="Public profile" onClick={() => { setMenuOpen(false); nav('public_profile'); }}/>
                <PopRow ic="check" label="Plan & billing" right="Pro" onClick={() => { setMenuOpen(false); nav('pricing'); }}/>
                <PopRow ic="bars" label="Receipts" onClick={() => { setMenuOpen(false); nav('receipts'); }}/>
                <div style={{ height:1, background:T.hairline, margin:'4px 6px' }}/>
                <PopRow ic="settings" label="Settings" onClick={() => { setMenuOpen(false); nav('settings'); }}/>
                <PopRow ic="bell" label="Notifications" onClick={() => { setMenuOpen(false); nav('notifications'); }}/>
                <PopRow ic="users" label="Refer a friend" right="$10" onClick={() => { setMenuOpen(false); nav('refer'); }}/>
                <PopRow ic="book" label="Help & support" onClick={() => { setMenuOpen(false); nav('help'); }}/>
                <div style={{ height:1, background:T.hairline, margin:'4px 6px' }}/>
                <PopRow ic="arrow" label="Sign out" danger onClick={() => { setMenuOpen(false); if (window.__signOut) window.__signOut(); else nav('auth_login'); }}/>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ active, ic, label, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:9, background: active ? T.bg2 : 'transparent', color: active ? T.ink : T.ink3, fontSize:13, fontWeight: active ? 600 : 500, cursor:'pointer', textAlign:'left', border:'none' }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.hairline; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <span style={{ color: active ? T.brand : T.ink4 }}>{Icon[ic]({ width:17, height:17 })}</span>
      <span style={{ flex:1 }}>{label}</span>
    </button>
  );
}

function WebTopbar({ search='Search lessons, phrases, grammar…', right=null }) {
  const nav = window.__nav || (() => {});
  const back = () => { if (window.__back) window.__back(); };
  return (
    <div style={{ height:64, borderBottom:`1px solid ${T.glassBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 32px', background:T.glassStrong, backdropFilter:T.glassBlur, WebkitBackdropFilter:T.glassBlur, flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
      <button onClick={back} title="Back" style={{ width:36, height:36, borderRadius:10, background:T.card, border:`1px solid ${T.border}`, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button onClick={() => nav('search')} style={{ display:'flex', alignItems:'center', gap:10, width:380, padding:'9px 14px', background:T.card, borderRadius:11, border:`1px solid ${T.border}`, color:T.ink4, cursor:'pointer', textAlign:'left' }}>
        {Icon.search()}
        <span style={{ fontSize:13 }}>{search}</span>
        <span style={{ marginLeft:'auto', fontSize:10, color:T.ink5, border:`1px solid ${T.border}`, borderRadius:5, padding:'2px 6px', fontWeight:600, letterSpacing:'.04em' }}>⌘K</span>
      </button>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        {right}
        <button onClick={() => nav('notifications')} style={{ width:36, height:36, borderRadius:10, background:T.card, border:`1px solid ${T.border}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:'pointer' }}>
          {Icon.bell()}
          <span style={{ position:'absolute', top:8, right:8, width:6, height:6, borderRadius:3, background:T.brand }}/>
        </button>
        <button onClick={() => nav('settings')} style={{ width:36, height:36, borderRadius:18, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:700, cursor:'pointer' }}>{USER.initial}</button>
      </div>
    </div>
  );
}

function WebFrame({ children, w=1440, h=900, label, scrollable=true }) {
  return (
    <div style={{ width:w, height:h, background:T.bg, borderRadius:14, boxShadow:'0 30px 80px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.04)', overflow:'hidden', display:'flex' }}>
      {children}
    </div>
  );
}

// Page eyebrow + greeting block
function PageHeader({ eyebrow, title, subtitle, right }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:28, gap:24 }}>
      <div>
        {eyebrow && <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>{eyebrow}</div>}
        <div style={{ fontFamily:T.serif, fontSize:38, color:T.ink, lineHeight:1.1, marginBottom: subtitle ? 6 : 0 }}>{title}</div>
        {subtitle && <div style={{ fontSize:14, color:T.ink3, lineHeight:1.5, maxWidth:580 }}>{subtitle}</div>}
      </div>
      {right}
    </div>
  );
}

// Stat tile (small, compact)
function StatTile({ label, value, delta, color, bg, big=false }) {
  return (
    <div style={{ background: bg || T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'16px 18px', display:'flex', flexDirection:'column', gap:6, minWidth:0 }}>
      <div style={{ fontSize:10.5, color:T.ink3, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <div style={{ fontFamily:T.serif, fontSize: big ? 36 : 28, color: color || T.ink, lineHeight:1 }}>{value}</div>
        {delta && (
          <div style={{ fontSize:11.5, fontWeight:700, color: delta.startsWith('-') ? '#B00020' : '#1A8F4E' }}>
            {delta.startsWith('-') ? '↓' : '↑'} {delta.replace('-','').replace('+','')}
          </div>
        )}
      </div>
    </div>
  );
}

function PopRow({ ic, label, right, danger, onClick }) {
  return (
    <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', borderRadius:8, background:'transparent', border:'none', cursor:'pointer', textAlign:'left', color: danger ? '#B00020' : T.ink2, fontSize:12.5, fontWeight:500 }}
      onMouseEnter={e => e.currentTarget.style.background = T.bg2}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <span style={{ color: danger ? '#B00020' : T.ink4, display:'flex' }}>{Icon[ic] ? Icon[ic]({ width:14, height:14 }) : null}</span>
      <span style={{ flex:1 }}>{label}</span>
      {right && <span style={{ fontSize:10.5, color:T.ink4, fontWeight:700 }}>{right}</span>}
    </button>
  );
}

Object.assign(window, {
  WebSidebar, WebTopbar, WebFrame, PageHeader, StatTile, NavItem, PopRow,
});
