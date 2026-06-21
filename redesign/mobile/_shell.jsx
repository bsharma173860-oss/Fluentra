// ── Mobile Shell v2 — Liquid Glass tab bar, depth tokens, native rhythm ─────
// Design language: Fluentra brand expressed for phone.
// Premium feel: layered surfaces, glass blur, big serif titles, strong hierarchy.

// Mobile-only token extensions — depth, blur, rhythm.
// Read these from MT.* anywhere in mobile.
const MT = {
  // Layered surfaces — cooler, slightly off the desktop bg for screen-native feel
  bg:        '#F6F4EE',     // canvas
  bg2:       '#FBF9F4',     // raised section
  card:      '#FFFFFF',     // cards
  cardWarm:  '#FFFCF6',     // warm card variant
  ink:       '#0E0D0B',     // pure-ink for big type
  ink2:      '#26221C',
  ink3:      '#5C5750',
  ink4:      '#8E887F',
  ink5:      '#B9B4AB',
  hairline:  '#ECE7DD',
  divider:   '#F1ECE2',
  // Glass tab bar
  glass:        'rgba(252,250,246,0.62)',
  glassBorder:  'rgba(0,0,0,0.06)',
  glassHighlight:'rgba(255,255,255,0.65)',
  // Shadows / depth
  shadowSm:  '0 1px 2px rgba(20,16,10,.04)',
  shadowMd:  '0 6px 16px rgba(20,16,10,.06), 0 2px 4px rgba(20,16,10,.04)',
  shadowLg:  '0 18px 40px rgba(20,16,10,.10), 0 4px 10px rgba(20,16,10,.05)',
  shadowXl:  '0 30px 60px rgba(20,16,10,.18), 0 8px 18px rgba(20,16,10,.08)',
  // Type rhythm — mobile-native, EDITORIAL: bigger headlines, stronger hierarchy
  fzHero:    44,    // page-defining hero (full-bleed lang detail, exam hero)
  fzDisplay: 38,    // page headline (dashboard "Hola, María.")
  fzNumber:  44,    // stat-as-art (band score, streak)
  fzTitle:   24,    // serif card titles
  fzH1:      20,    // sans subtitle / large body
  fzH2:      17,    // standard headline
  fzBody:    14.5,  // body
  fzMeta:    12,    // meta
  fzMicro:   10.5,  // micro/caps
};

if (typeof window !== 'undefined') window.MT = MT;

// Phone canvas — chromeless inner content area used by every page.
function MobileFrame({ children, statusBarStyle='dark', dark=false }) {
  const W = 390, H = 844;
  return (
    <div style={{ width:W, height:H, background:'#000', borderRadius:54, padding:8, boxShadow:'0 30px 80px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.04)', flexShrink:0 }}>
      <div style={{ width:'100%', height:'100%', background: dark ? '#0E0D0B' : 'radial-gradient(500px 360px at 10% -8%, rgba(255,176,142,0.28), transparent 60%), radial-gradient(440px 360px at 100% 0%, rgba(150,160,255,0.20), transparent 55%), radial-gradient(420px 420px at 50% 115%, rgba(150,220,180,0.16), transparent 60%), linear-gradient(160deg,#FAF7F2,#EFEBE4)', borderRadius:46, overflow:'hidden', position:'relative', display:'flex', flexDirection:'column' }}>
        <div style={{ position:'absolute', top:12, left:'50%', transform:'translateX(-50%)', width:120, height:34, background:'#000', borderRadius:20, zIndex:100 }}/>
        <div style={{ height:54, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', fontSize:14, fontWeight:600, color: statusBarStyle==='light' ? '#fff' : '#000', flexShrink:0, position:'relative', zIndex:1 }}>
          <span>9:41</span>
          <span style={{ width:120 }}/>
          <span style={{ display:'flex', alignItems:'center', gap:5 }}>
            <svg width={16} height={10} viewBox="0 0 16 10" fill="currentColor"><rect x="0" y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" y="0" width="3" height="10" rx="1"/></svg>
            <svg width={22} height={10} viewBox="0 0 22 10" fill="none" stroke="currentColor" strokeWidth="1"><rect x=".5" y=".5" width="18" height="9" rx="2"/><rect x="2" y="2" width="15" height="6" fill="currentColor"/><rect x="19.5" y="3.5" width="1.5" height="3" fill="currentColor"/></svg>
          </span>
        </div>
        <div style={{ flex:1, position:'relative', overflow:'hidden', display:'flex', flexDirection:'column' }}>
          {children}
        </div>
        <div style={{ position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)', width:134, height:5, background: statusBarStyle==='light' ? '#fff' : '#000', borderRadius:3, zIndex:120 }}/>
      </div>
    </div>
  );
}

// Liquid glass tab bar — translucent, blurred, floating pill style.
// Active tab gets a glassy "lens" highlight. Center action is the brand-grad FAB.
function MobileTabBar({ active='home', onNav }) {
  const nav = onNav || ((id) => { if (window.__nav) window.__nav(id); });
  const tabs = [
    { id:'dashboard', tabId:'home',     label:'Home',     ic:'home' },
    { id:'library',   tabId:'library',  label:'Library',  ic:'book' },
    { id:'practice',  tabId:'practice', label:'',         ic:'play',  fab:true },
    { id:'progress',  tabId:'progress', label:'Progress', ic:'bars' },
    { id:'exams',     tabId:'exams',    label:'Exams',    ic:'trophy' },
  ];
  return (
    <div style={{ position:'relative', flexShrink:0, padding:'10px 14px 18px' }}>
      {/* Outer glass plate */}
      <div style={{
        position:'relative',
        height:64,
        background:MT.glass,
        backdropFilter:'blur(28px) saturate(160%)',
        WebkitBackdropFilter:'blur(28px) saturate(160%)',
        border:`1px solid ${MT.glassBorder}`,
        borderRadius:32,
        boxShadow:`${MT.shadowLg}, inset 0 1px 0 ${MT.glassHighlight}`,
        display:'flex',
        alignItems:'center',
        justifyContent:'space-around',
        padding:'0 8px',
      }}>
        {tabs.map(t => {
          const isActive = active === t.tabId;
          if (t.fab) {
            return (
              <button key={t.id} onClick={() => nav(t.id)} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', height:'100%', position:'relative' }}>
                <div style={{
                  position:'absolute', top:-22,
                  width:60, height:60, borderRadius:30,
                  background: T.brandGrad, color:'#fff',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 12px 28px ${T.brand}66, 0 2px 4px ${T.brand}33, inset 0 1px 0 rgba(255,255,255,.32)`,
                  border:'3px solid rgba(255,255,255,.95)',
                }}>
                  {Icon.play({ width:22, height:22 })}
                </div>
              </button>
            );
          }
          return (
            <button key={t.id} onClick={() => nav(t.id)} style={{
              flex:1, height:'100%',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:3,
              color: isActive ? T.brand : MT.ink4,
              background:'none', border:'none',
              position:'relative',
            }}>
              {isActive && (
                <div style={{
                  position:'absolute', top:6, left:'50%', transform:'translateX(-50%)',
                  width:48, height:32, borderRadius:16,
                  background:T.brand+'14',
                  zIndex:0,
                }}/>
              )}
              <span style={{ position:'relative', zIndex:1 }}>{Icon[t.ic]({ width:22, height:22, strokeWidth: isActive ? 2.4 : 1.9 })}</span>
              <span style={{ position:'relative', zIndex:1, fontSize:10, fontWeight: isActive ? 700 : 500, letterSpacing:'.01em' }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Mobile header — large-title iOS style with optional eyebrow + collapse.
function MobileHeader({ title, eyebrow, back, onBack, right, large=false, dark=false }) {
  const fg  = dark ? '#fff' : MT.ink;
  const sub = dark ? 'rgba(255,255,255,.62)' : MT.ink4;
  const btnBg = dark ? 'rgba(255,255,255,.10)' : MT.card;
  return (
    <div style={{ padding: large ? '8px 22px 14px' : '4px 14px 10px', flexShrink:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, minHeight:40 }}>
        {back && (
          <button onClick={onBack} style={{
            width:38, height:38, borderRadius:19,
            background:btnBg,
            border: dark ? 'none' : `1px solid ${MT.hairline}`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:fg, boxShadow: dark ? 'none' : MT.shadowSm,
          }}>
            {Icon.arrowL()}
          </button>
        )}
        {!large && <div style={{ flex:1, fontSize:16, fontWeight:700, color:fg, textAlign:'center', letterSpacing:'-.01em' }}>{title}</div>}
        {!large && right && <div style={{ marginLeft:'auto' }}>{right}</div>}
        {!large && back && <div style={{ width:38 }}/>}
        {large && <div style={{ marginLeft:'auto' }}>{right}</div>}
      </div>
      {large && (
        <div style={{ marginTop:10 }}>
          {eyebrow && <div style={{ fontSize:11, fontWeight:700, color:sub, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
          <div style={{ fontFamily:T.serif, fontSize:MT.fzDisplay, color:fg, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
        </div>
      )}
    </div>
  );
}

// Mobile section header — tighter, more typographic
function MobileSectionHead({ title, action, onAction, sub }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 4px', marginBottom:12 }}>
      <div>
        <div style={{ fontSize:13, fontWeight:700, color:MT.ink, letterSpacing:'-.005em', textTransform:'none' }}>{title}</div>
        {sub && <div style={{ fontSize:11.5, color:MT.ink4, marginTop:2 }}>{sub}</div>}
      </div>
      {action && (
        <button onClick={onAction} style={{ fontSize:12, color:MT.ink3, fontWeight:600, display:'flex', alignItems:'center', gap:3 }}>
          {action} {Icon.chev({ width:12, height:12 })}
        </button>
      )}
    </div>
  );
}

// Scroll body — adds bottom inset so content clears the floating glass tab bar.
function MobileBody({ children, padding=20, style={}, tabBarPad=true }) {
  const padBottom = tabBarPad ? 110 : padding;
  const pad = typeof padding === 'number'
    ? `0 ${padding}px ${padBottom}px ${padding}px`
    : padding;
  return (
    <div style={{
      flex:1, overflow:'auto',
      padding: pad,
      paddingTop: typeof padding === 'number' ? padding : undefined,
      ...style,
    }}>
      {children}
    </div>
  );
}

// Card primitive — premium depth, used everywhere
function MCard({ children, style={}, raised=false, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:T.glass,
      backdropFilter:T.glassBlur,
      WebkitBackdropFilter:T.glassBlur,
      border:`1px solid ${T.glassBorder}`,
      borderRadius:20,
      boxShadow: raised ? MT.shadowMd : T.glassShadow,
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, {
  MT,
  MobileFrame, MobileTabBar, MobileHeader, MobileSectionHead, MobileBody, MCard,
});
