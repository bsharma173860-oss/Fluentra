// ── Mobile WAVE 4 · Auxiliary screens redesign ──────────────
// Settings, Notifications, Achievements, Friends, Vocab — phone-native, layered,
// gradient hero cards, glass tab strips, polished spacing.
// Replaces older flat MSettings / MNotifications / MAchievements / MFriends / MVocab.

const w4Hide = `
.w4-hide-scroll::-webkit-scrollbar{display:none}
.w4-hide-scroll{scrollbar-width:none;-ms-overflow-style:none}
`;
if (typeof document !== 'undefined' && !document.getElementById('w4-hide-style')) {
  const s = document.createElement('style'); s.id='w4-hide-style'; s.textContent=w4Hide; document.head.appendChild(s);
}

const w4Avatar = (initials, size=44, grad) => (
  <div style={{ width:size, height:size, borderRadius:size/2, background: grad || `linear-gradient(135deg, ${T.brand} 0%, ${T.brandHover || T.brand} 100%)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize: size*0.42, letterSpacing:'-.02em', flexShrink:0 }}>{initials}</div>
);

// ═══════════════════════════════════════════════════════════
// SETTINGS · WAVE 4
// ═══════════════════════════════════════════════════════════
function MSettingsPageW4() {
  const [view, setView] = React.useState('list');
  const nav = (id) => window.__nav && window.__nav(id);

  // sub-views fall back to original Tab components if defined
  const subViews = {
    account:'AccountTab', subscription:'SubscriptionTab', billing:'BillingTab',
    preferences:'PreferencesTab', notifications:'NotificationsTab', data:'DataPrivacyTab',
  };
  if (view !== 'list') {
    const Comp = window[subViews[view]];
    return (
      <MobileFrame>
        <MobileHeader title={view === 'data' ? 'Data & privacy' : view.charAt(0).toUpperCase()+view.slice(1)} back onBack={()=>setView('list')} large={false}/>
        <MobileBody padding={[0,18,32]}>
          {Comp ? <Comp/> : <div style={{ padding:30, textAlign:'center', color:MT.ink4 }}>Coming soon</div>}
        </MobileBody>
      </MobileFrame>
    );
  }

  const groups = [
    { title:'Account', items: [
      { id:'account',      label:'Profile & login',     ic:'user',  meta:'maria@example.com' },
      { id:'subscription', label:'Subscription',         ic:'crown', meta:'Pro · Renews May 28', accent:'#7C5BD6' },
      { id:'billing',      label:'Billing & receipts',   ic:'card',  meta:'Visa ··4242' },
    ]},
    { title:'App', items: [
      { id:'preferences',  label:'Preferences',          ic:'sliders', meta:'Light · 16h reminders' },
      { id:'notifications',label:'Notifications',        ic:'bell',    meta:'12 active' },
      { id:'data',         label:'Data & privacy',       ic:'shield',  meta:'Export, delete' },
    ]},
  ];

  return (
    <MobileFrame>
      <MobileHeader eyebrow="PROFILE" title="Settings" large/>
      <MobileBody padding={[0,16,32]}>
        {/* User hero card — gradient with avatar + Pro chip */}
        <div style={{ background:`linear-gradient(160deg, #1F1B16 0%, #3A2E26 70%, ${T.brand}30 100%)`, borderRadius:22, padding:'18px 18px 16px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:14 }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}55 0%, transparent 70%)` }}/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:14 }}>
            {w4Avatar('M', 60)}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.05, letterSpacing:'-.015em' }}>María García</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,.65)', marginTop:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>maria@example.com</div>
              <div style={{ marginTop:8, display:'inline-flex', alignItems:'center', gap:5, padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.16)', backdropFilter:'blur(8px)', fontSize:10.5, fontWeight:700, letterSpacing:'.03em' }}>
                <span style={{ width:5, height:5, borderRadius:3, background:'#FFC859' }}/> PRO · Renews May 28
              </div>
            </div>
          </div>
          <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginTop:16, paddingTop:14, borderTop:'1px solid rgba(255,255,255,.12)' }}>
            {[
              { l:'Streak',  v:'42',  s:'days' },
              { l:'Sessions',v:'142', s:'this mo' },
              { l:'Avg band',v:'7.5', s:'IELTS' },
            ].map(s => (
              <div key={s.l} style={{ textAlign:'left' }}>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div>
                <div style={{ fontSize:9.5, color:'rgba(255,255,255,.6)', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginTop:4 }}>{s.l}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.4)', marginTop:1 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions row */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:18 }}>
          <button onClick={()=>nav('refer')} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'12px 14px', boxShadow:MT.shadowSm, display:'flex', alignItems:'center', gap:10, textAlign:'left' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:`${T.brand}1c`, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.gift ? Icon.gift({width:16,height:16}) : Icon.spark({width:16,height:16})}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:MT.ink }}>Refer friends</div>
              <div style={{ fontSize:10, color:MT.ink4 }}>Get 1 month free</div>
            </div>
          </button>
          <button onClick={()=>nav('help')} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'12px 14px', boxShadow:MT.shadowSm, display:'flex', alignItems:'center', gap:10, textAlign:'left' }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'#2A6FA01c', color:'#2A6FA0', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.help ? Icon.help({width:16,height:16}) : '?'}</div>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:MT.ink }}>Help center</div>
              <div style={{ fontSize:10, color:MT.ink4 }}>Docs & contact</div>
            </div>
          </button>
        </div>

        {/* Settings groups */}
        {groups.map((g) => (
          <div key={g.title} style={{ marginBottom:18 }}>
            <MobileSectionHead title={g.title}/>
            <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, overflow:'hidden', boxShadow:MT.shadowSm }}>
              {g.items.map((it,i) => (
                <button key={it.id} onClick={()=>setView(it.id)} style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 14px', borderBottom: i < g.items.length-1 ? `1px solid ${MT.divider}` : 'none', width:'100%', textAlign:'left', background:'transparent' }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:`${it.accent || T.brand}14`, color: it.accent || T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {Icon[it.ic] ? Icon[it.ic]({width:15,height:15}) : Icon.user({width:15,height:15})}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:600, color:MT.ink, marginBottom:2 }}>{it.label}</div>
                    <div style={{ fontSize:11, color:MT.ink4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.meta}</div>
                  </div>
                  <span style={{ color:MT.ink5, fontSize:18, lineHeight:1 }}>›</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button onClick={async () => { if (window.__signOut) await window.__signOut(); else nav('auth_login'); }} style={{ width:'100%', padding:'14px', borderRadius:14, background:MT.card, border:`1px solid ${MT.hairline}`, color:T.brand, fontSize:13.5, fontWeight:700, boxShadow:MT.shadowSm, marginBottom:16 }}>Sign out</button>
        <div style={{ textAlign:'center', fontSize:10.5, color:MT.ink5 }}>Fluentra v2.4.0 · Build 1240</div>
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS · WAVE 4
// ═══════════════════════════════════════════════════════════
function MNotificationsPageW4() {
  const [filter, setFilter] = React.useState('all');
  const nav = (id) => window.__nav && window.__nav(id);
  const NOTIFS = (typeof window !== 'undefined' && window.NOTIFS) || [
    { id:1, type:'streak', unread:true, t:'2 min ago', title:'42-day streak unlocked', body:'You earned the Persistent badge.', ic:'flame', accent:'#E08F4D' },
    { id:2, type:'social', unread:true, t:'1h ago', title:'Anaís left feedback', body:'"Loved your speaking sample on travel — great pacing."', ic:'heart', accent:'#D26890' },
    { id:3, type:'system', unread:false, t:'3h ago', title:'New JLPT mock available', body:'8 fresh listening clips added to Library.', ic:'book', accent:'#2A6FA0' },
    { id:4, type:'social', unread:false, t:'Yesterday', title:'Marcus added you', body:'Tap to view profile and send a hello.', ic:'users', accent:'#5A9C7A' },
    { id:5, type:'system', unread:false, t:'2 days ago', title:'Receipt available', body:'May invoice for your Pro plan.', ic:'card', accent:'#7C5BD6' },
  ];
  const filtered = NOTIFS.filter(n => filter === 'all' ? true : filter === 'unread' ? n.unread : n.type === filter);
  const unread = NOTIFS.filter(n => n.unread).length;

  const tabs = [
    { id:'all',     l:'All',     n: NOTIFS.length },
    { id:'unread',  l:'Unread',  n: unread },
    { id:'social',  l:'Social',  n: NOTIFS.filter(n=>n.type==='social').length },
    { id:'system',  l:'System',  n: NOTIFS.filter(n=>n.type==='system').length },
  ];

  return (
    <MobileFrame>
      <MobileHeader eyebrow={`${unread} UNREAD`} title="Inbox" large right={
        <button style={{ width:38, height:38, borderRadius:19, background:MT.card, border:`1px solid ${MT.hairline}`, color:MT.ink2, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:MT.shadowSm }}>{Icon.check ? Icon.check({width:14,height:14}) : '✓'}</button>
      }/>
      <MobileBody padding={[0,16,32]}>
        {/* Glass tab strip */}
        <div className="w4-hide-scroll" style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          {tabs.map(t => {
            const a = filter === t.id;
            return (
              <button key={t.id} onClick={()=>setFilter(t.id)} style={{
                flexShrink:0, padding:'7px 13px', borderRadius:99,
                background: a ? MT.ink : MT.card, color: a ? '#fff' : MT.ink2,
                fontSize:11.5, fontWeight:700, border:`1px solid ${a ? MT.ink : MT.hairline}`,
                boxShadow: a ? MT.shadowMd : MT.shadowSm,
                display:'inline-flex', alignItems:'center', gap:5,
              }}>
                {t.l}
                <span style={{ fontSize:9.5, padding:'1px 6px', borderRadius:8, background: a ? 'rgba(255,255,255,.18)' : MT.bg2, color: a ? '#fff' : MT.ink4, fontWeight:700 }}>{t.n}</span>
              </button>
            );
          })}
        </div>

        {/* Today divider */}
        {filtered.length > 0 && (
          <div style={{ fontSize:10, color:MT.ink4, fontWeight:800, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10, padding:'0 4px' }}>Recent</div>
        )}

        {/* Notification list */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(n => (
            <button key={n.id} onClick={()=>{
              if (n.type === 'social') nav('public_profile');
              else if (n.type === 'system') nav('exam_book');
            }} style={{ display:'flex', alignItems:'flex-start', gap:11, padding:'13px 13px', borderRadius:15, background:MT.card, border:`1px solid ${n.unread ? n.accent + '33' : MT.hairline}`, boxShadow: n.unread ? MT.shadowMd : MT.shadowSm, textAlign:'left', position:'relative' }}>
              {n.unread && <div style={{ position:'absolute', top:14, right:14, width:7, height:7, borderRadius:4, background:n.accent }}/>}
              <div style={{ width:38, height:38, borderRadius:11, background:`${n.accent}1a`, color:n.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {Icon[n.ic] ? Icon[n.ic]({width:15,height:15}) : Icon.bell({width:15,height:15})}
              </div>
              <div style={{ flex:1, minWidth:0, paddingRight: n.unread ? 12 : 0 }}>
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:8, marginBottom:3 }}>
                  <div style={{ fontSize:12.5, fontWeight:700, color:MT.ink, letterSpacing:'-.005em' }}>{n.title}</div>
                </div>
                <div style={{ fontSize:11.5, color:MT.ink3, lineHeight:1.45, marginBottom:4 }}>{n.body}</div>
                <div style={{ fontSize:10, color:MT.ink5, fontWeight:600 }}>{n.t}</div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ padding:'60px 30px', textAlign:'center' }}>
            <div style={{ width:60, height:60, borderRadius:30, background:MT.bg2, color:MT.ink4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>{Icon.bell({width:22,height:22})}</div>
            <div style={{ fontSize:13.5, fontWeight:700, color:MT.ink, marginBottom:5 }}>You're all caught up</div>
            <div style={{ fontSize:11.5, color:MT.ink4 }}>No {filter !== 'all' ? filter+' ' : ''}notifications.</div>
          </div>
        )}
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// ACHIEVEMENTS · WAVE 4
// ═══════════════════════════════════════════════════════════
function MAchievementsPageW4() {
  const [tab, setTab] = React.useState('earned');
  const earned = [
    { title:'Café Master', date:'Mar 14', rarity:'epic', ic:'trophy', c:T.es?.accent || '#7B4A2D', bg:T.es?.bg || '#F5EFE6' },
    { title:'Dawn Streak',  date:'Mar 11', rarity:'rare', ic:'flame',  c:'#E08F4D', bg:'#FCEFDA' },
    { title:'Listening 100', date:'Mar 5', rarity:'epic', ic:'headphones', c:'#2A6FA0', bg:'#E1ECF6' },
    { title:'First exam',     date:'Feb 28', rarity:'common', ic:'book', c:'#5A9C7A', bg:'#E2EEDF' },
  ];
  const inProgress = [
    { title:'500 words',     pct:72, ic:'book',   c:'#5A9C7A', sub:'362/500 vocab' },
    { title:'90-day streak', pct:46, ic:'flame',  c:'#E08F4D', sub:'42/90 days' },
    { title:'Speak 1000m',   pct:28, ic:'mic',    c:'#D26890', sub:'285/1000 min' },
  ];
  const rarityChip = (r) => r === 'epic' ? { c:'#7C5BD6', bg:'#EFEBFB' } : r === 'rare' ? { c:'#2A6FA0', bg:'#E1ECF6' } : { c:MT.ink3, bg:MT.bg2 };

  return (
    <MobileFrame>
      <MobileHeader eyebrow="42 EARNED · 8 RARE" title="Achievements" large/>
      <MobileBody padding={[0,16,32]}>
        {/* Featured trophy hero */}
        <div style={{ background:`linear-gradient(160deg, #7C5BD6 0%, #4A2D8C 100%)`, borderRadius:22, padding:'18px 18px 20px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:MT.shadowLg, marginBottom:18 }}>
          <div style={{ position:'absolute', top:-40, right:-40, width:180, height:180, borderRadius:'50%', background:'radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 70%)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.75, marginBottom:8 }}>Newly unlocked</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
              <div style={{ width:64, height:64, borderRadius:18, background:'rgba(255,255,255,.16)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {Icon.trophy ? Icon.trophy({width:30,height:30}) : <span style={{ fontSize:30 }}>🏆</span>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.05, letterSpacing:'-.015em', marginBottom:4 }}>Café Master</div>
                <div style={{ fontSize:11.5, opacity:.78, lineHeight:1.4 }}>Held 30 conversations in the food & drink topic.</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <div style={{ padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.16)', fontSize:10, fontWeight:700, letterSpacing:'.05em' }}>EPIC</div>
              <div style={{ padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.16)', fontSize:10, fontWeight:700, letterSpacing:'.05em' }}>+50 XP</div>
              <div style={{ padding:'4px 9px', borderRadius:99, background:'rgba(255,255,255,.16)', fontSize:10, fontWeight:700, letterSpacing:'.05em' }}>2 days ago</div>
            </div>
          </div>
        </div>

        {/* Tab strip */}
        <div style={{ display:'flex', gap:0, background:MT.bg2, borderRadius:11, padding:3, marginBottom:14 }}>
          {[{id:'earned', l:'Earned · 42'}, {id:'progress', l:'In progress · 6'}, {id:'all', l:'All · 80'}].map(t => {
            const a = tab === t.id;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?MT.ink:MT.ink3, background: a?MT.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>
            );
          })}
        </div>

        {tab === 'earned' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {earned.map(b => (
              <div key={b.title} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:16, padding:'14px 12px', boxShadow:MT.shadowSm, position:'relative' }}>
                <div style={{ width:46, height:46, borderRadius:13, background:b.bg, color:b.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
                  {Icon[b.ic] ? Icon[b.ic]({width:18,height:18}) : Icon.trophy({width:18,height:18})}
                </div>
                <div style={{ fontSize:12.5, fontWeight:700, color:MT.ink, marginBottom:4, lineHeight:1.2 }}>{b.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ fontSize:9.5, padding:'2px 6px', borderRadius:99, background: rarityChip(b.rarity).bg, color: rarityChip(b.rarity).c, fontWeight:800, letterSpacing:'.05em' }}>{b.rarity.toUpperCase()}</span>
                  <span style={{ fontSize:10, color:MT.ink5 }}>{b.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'progress' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {inProgress.map(b => (
              <div key={b.title} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'13px 14px', boxShadow:MT.shadowSm }}>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                  <div style={{ width:40, height:40, borderRadius:11, background:`${b.c}1a`, color:b.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[b.ic] ? Icon[b.ic]({width:16,height:16}) : Icon.trophy({width:16,height:16})}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:MT.ink, marginBottom:2 }}>{b.title}</div>
                    <div style={{ fontSize:11, color:MT.ink4 }}>{b.sub}</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:b.c }}>{b.pct}%</div>
                </div>
                <div style={{ height:6, background:MT.bg2, borderRadius:99, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${b.pct}%`, background:b.c, borderRadius:99 }}/>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'all' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {[...earned, ...earned, ...earned].slice(0,9).map((b,i) => (
              <div key={i} style={{ background: i > 5 ? MT.bg2 : MT.card, border:`1px solid ${MT.hairline}`, borderRadius:13, padding:'10px 8px', textAlign:'center', boxShadow: i > 5 ? 'none' : MT.shadowSm, opacity: i > 5 ? .5 : 1 }}>
                <div style={{ width:40, height:40, borderRadius:11, background:b.bg, color:b.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 7px' }}>
                  {Icon[b.ic] ? Icon[b.ic]({width:14,height:14}) : Icon.trophy({width:14,height:14})}
                </div>
                <div style={{ fontSize:10.5, fontWeight:700, color:MT.ink, lineHeight:1.15 }}>{b.title}</div>
              </div>
            ))}
          </div>
        )}
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// FRIENDS · WAVE 4
// ═══════════════════════════════════════════════════════════
function MFriendsPageW4() {
  const [tab, setTab] = React.useState('feed');
  const nav = (id) => window.__nav && window.__nav(id);

  const friends = [
    { name:'Anaís Rodríguez', initials:'AR', meta:'Spanish · 14-day streak', online:true, grad:'linear-gradient(135deg,#D26890,#E08F4D)' },
    { name:'Marcus Chen',     initials:'MC', meta:'Japanese · Band 6.5',     online:true, grad:'linear-gradient(135deg,#2A6FA0,#5A9C7A)' },
    { name:'Lin Wei',         initials:'LW', meta:'Mandarin · 92 days',      online:false, grad:'linear-gradient(135deg,#7C5BD6,#2A6FA0)' },
    { name:'Sara Müller',     initials:'SM', meta:'German · A2',             online:true, grad:'linear-gradient(135deg,#E08F4D,#D26890)' },
    { name:'Ravi Patel',      initials:'RP', meta:'Italian · B1',            online:false, grad:'linear-gradient(135deg,#5A9C7A,#7C5BD6)' },
  ];
  const feed = [
    { who:'Anaís Rodríguez', ini:'AR', grad:friends[0].grad, t:'12 min ago', verb:'unlocked', what:'Café Master', ic:'trophy', c:'#7C5BD6' },
    { who:'Marcus Chen',     ini:'MC', grad:friends[1].grad, t:'1h ago',     verb:'finished a',  what:'Speaking session', ic:'mic', c:'#D26890', body:'"Felt much smoother on Part 2 — pacing held."' },
    { who:'Lin Wei',         ini:'LW', grad:friends[2].grad, t:'3h ago',     verb:'reached',  what:'92-day streak', ic:'flame', c:'#E08F4D' },
    { who:'Sara Müller',     ini:'SM', grad:friends[3].grad, t:'Yesterday',  verb:'added',    what:'Marcus as a friend', ic:'users', c:'#5A9C7A' },
  ];
  const requests = [
    { name:'Yuki Tanaka',  ini:'YT', meta:'2 mutual friends · Japanese', grad:'linear-gradient(135deg,#D26890,#7C5BD6)' },
    { name:'Pierre Dubois',ini:'PD', meta:'1 mutual · French · 30d',     grad:'linear-gradient(135deg,#2A6FA0,#E08F4D)' },
  ];

  return (
    <MobileFrame>
      <MobileHeader eyebrow={`${friends.length} FRIENDS · ${requests.length} REQUESTS`} title="Friends" large right={
        <button onClick={()=>nav('refer')} style={{ width:38, height:38, borderRadius:19, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 10px ${T.brand}55` }}>{Icon.plus ? Icon.plus({width:14,height:14}) : '+'}</button>
      }/>
      <MobileBody padding={[0,16,32]}>
        {/* Tab strip */}
        <div style={{ display:'flex', gap:0, background:MT.bg2, borderRadius:11, padding:3, marginBottom:14 }}>
          {[{id:'feed',l:'Feed'},{id:'friends',l:`Friends · ${friends.length}`},{id:'requests',l:`Requests · ${requests.length}`}].map(t => {
            const a = tab === t.id;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?MT.ink:MT.ink3, background: a?MT.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>
            );
          })}
        </div>

        {tab === 'feed' && (
          <>
            {/* Online row */}
            <div className="w4-hide-scroll" style={{ display:'flex', gap:14, overflowX:'auto', padding:'2px 0 14px', WebkitOverflowScrolling:'touch' }}>
              <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:6, width:60 }}>
                <button onClick={()=>nav('refer')} style={{ width:54, height:54, borderRadius:27, border:`2px dashed ${MT.hairline}`, background:MT.bg2, color:MT.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:300 }}>+</button>
                <div style={{ fontSize:10.5, color:MT.ink4, fontWeight:600 }}>Invite</div>
              </div>
              {friends.filter(f=>f.online).map(f => (
                <div key={f.name} style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:6, width:60 }}>
                  <div style={{ position:'relative' }}>
                    {w4Avatar(f.initials, 54, f.grad)}
                    <div style={{ position:'absolute', right:0, bottom:0, width:13, height:13, borderRadius:7, background:'#5A9C7A', border:`2.5px solid ${MT.bg}` }}/>
                  </div>
                  <div style={{ fontSize:10.5, color:MT.ink2, fontWeight:600, textOverflow:'ellipsis', overflow:'hidden', whiteSpace:'nowrap', maxWidth:60 }}>{f.name.split(' ')[0]}</div>
                </div>
              ))}
            </div>

            {/* Activity feed */}
            <MobileSectionHead title="Activity"/>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {feed.map((f,i) => (
                <div key={i} style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'12px 14px', boxShadow:MT.shadowSm, display:'flex', gap:11, alignItems:'flex-start' }}>
                  {w4Avatar(f.ini, 38, f.grad)}
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, color:MT.ink, lineHeight:1.4 }}>
                      <span style={{ fontWeight:700 }}>{f.who}</span> <span style={{ color:MT.ink3 }}>{f.verb}</span> <span style={{ fontWeight:700, color:f.c }}>{f.what}</span>
                    </div>
                    {f.body && <div style={{ fontSize:11.5, color:MT.ink3, fontStyle:'italic', marginTop:5, padding:'7px 10px', background:MT.bg2, borderRadius:9, lineHeight:1.4 }}>{f.body}</div>}
                    <div style={{ fontSize:10, color:MT.ink5, fontWeight:600, marginTop:5 }}>{f.t}</div>
                  </div>
                  <div style={{ width:30, height:30, borderRadius:9, background:`${f.c}14`, color:f.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[f.ic] ? Icon[f.ic]({width:13,height:13}) : Icon.trophy({width:13,height:13})}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'friends' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {friends.map(f => (
              <button key={f.name} onClick={()=>nav('public_profile')} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:13, background:MT.card, border:`1px solid ${MT.hairline}`, boxShadow:MT.shadowSm, textAlign:'left' }}>
                <div style={{ position:'relative' }}>
                  {w4Avatar(f.initials, 42, f.grad)}
                  {f.online && <div style={{ position:'absolute', right:0, bottom:0, width:11, height:11, borderRadius:6, background:'#5A9C7A', border:`2px solid ${MT.card}` }}/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:MT.ink }}>{f.name}</div>
                  <div style={{ fontSize:11, color:MT.ink4, marginTop:2 }}>{f.meta}</div>
                </div>
                <button onClick={(e)=>{ e.stopPropagation(); nav('dm_thread'); }} style={{ padding:'6px 10px', borderRadius:9, background:MT.bg2, color:MT.ink2, fontSize:11, fontWeight:700, border:`1px solid ${MT.hairline}` }}>Message</button>
              </button>
            ))}
          </div>
        )}

        {tab === 'requests' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {requests.map(r => (
              <div key={r.name} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:13, background:MT.card, border:`1px solid ${MT.hairline}`, boxShadow:MT.shadowSm }}>
                {w4Avatar(r.ini, 42, r.grad)}
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:MT.ink }}>{r.name}</div>
                  <div style={{ fontSize:11, color:MT.ink4, marginTop:2 }}>{r.meta}</div>
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  <button style={{ width:34, height:34, borderRadius:10, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 3px 8px ${T.brand}55` }}>{Icon.check ? Icon.check({width:13,height:13}) : '✓'}</button>
                  <button style={{ width:34, height:34, borderRadius:10, background:MT.bg2, color:MT.ink3, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${MT.hairline}` }}>{Icon.x ? Icon.x({width:13,height:13}) : '×'}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </MobileBody>
    </MobileFrame>
  );
}

// ═══════════════════════════════════════════════════════════
// VOCAB · WAVE 4
// ═══════════════════════════════════════════════════════════
function MVocabPageW4() {
  const [tab, setTab] = React.useState('decks');
  const [studying, setStudying] = React.useState(false);
  const [cardIdx, setCardIdx] = React.useState(0);
  const [flipped, setFlipped] = React.useState(false);
  const nav = (id) => window.__nav && window.__nav(id);

  const decks = [
    { name:'Travel & food',     count:48,  due:12, lang:'EN', mastery:78, grad:'linear-gradient(160deg,#E08F4D,#D26890)' },
    { name:'Verbi irregolari',  count:120, due:34, lang:'IT', mastery:42, grad:'linear-gradient(160deg,#5A9C7A,#2A6FA0)' },
    { name:'Business JP',       count:85,  due:8,  lang:'JP', mastery:65, grad:'linear-gradient(160deg,#7C5BD6,#D26890)' },
    { name:'Academic vocab',    count:200, due:0,  lang:'EN', mastery:91, grad:'linear-gradient(160deg,#2A6FA0,#7C5BD6)' },
  ];
  const cards = [
    { front:'partir',     back:'to leave', meta:'verb · French',   ex:'Je pars demain matin.' },
    { front:'umbrella',   back:'paraguas', meta:'noun · Spanish',  ex:'Brought an umbrella just in case.' },
    { front:'頑張って',     back:'good luck / do your best', meta:'expression · Japanese', ex:'試験頑張って!' },
  ];

  if (studying) {
    const c = cards[cardIdx];
    return (
      <MobileFrame>
        <MobileHeader title="Studying" eyebrow={`CARD ${cardIdx+1} OF ${cards.length}`} back onBack={()=>setStudying(false)}/>
        <MobileBody padding={[10,16,32]}>
          <div style={{ height:5, background:MT.bg2, borderRadius:99, overflow:'hidden', marginBottom:18 }}>
            <div style={{ height:'100%', width:`${((cardIdx+1)/cards.length)*100}%`, background:T.brand, borderRadius:99 }}/>
          </div>

          {/* Card */}
          <div onClick={()=>setFlipped(f=>!f)} style={{ background: flipped ? `linear-gradient(160deg, ${T.brand}, #7B4A2D)` : MT.card, color: flipped ? '#fff' : MT.ink, borderRadius:24, padding:'40px 24px', minHeight:300, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', boxShadow:MT.shadowLg, border:`1px solid ${flipped ? 'transparent' : MT.hairline}`, cursor:'pointer', position:'relative' }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity: flipped ? .7 : .55, marginBottom:18, color: flipped ? '#fff' : MT.ink4 }}>{flipped ? 'Translation' : c.meta}</div>
            <div style={{ fontFamily:T.serif, fontSize: flipped ? 36 : 42, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:14 }}>{flipped ? c.back : c.front}</div>
            {flipped && <div style={{ fontSize:13, opacity:.85, lineHeight:1.5, fontStyle:'italic', maxWidth:260 }}>"{c.ex}"</div>}
            <div style={{ position:'absolute', bottom:14, fontSize:10.5, color: flipped ? 'rgba(255,255,255,.6)' : MT.ink5, fontWeight:600, letterSpacing:'.05em' }}>TAP TO {flipped ? 'HIDE' : 'REVEAL'}</div>
          </div>

          {/* Rating buttons */}
          {flipped && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:7, marginTop:16 }}>
              {[
                { l:'Again', sub:'<1m', c:'#D26890' },
                { l:'Hard',  sub:'10m', c:'#E08F4D' },
                { l:'Good',  sub:'1d',  c:'#5A9C7A' },
                { l:'Easy',  sub:'4d',  c:'#2A6FA0' },
              ].map(b => (
                <button key={b.l} onClick={()=>{ setFlipped(false); setCardIdx(i => (i+1) % cards.length); }} style={{ padding:'12px 6px', borderRadius:12, background:MT.card, border:`1.5px solid ${b.c}`, color:b.c, boxShadow:MT.shadowSm }}>
                  <div style={{ fontSize:12, fontWeight:700, marginBottom:2 }}>{b.l}</div>
                  <div style={{ fontSize:9.5, opacity:.75, fontWeight:600 }}>{b.sub}</div>
                </button>
              ))}
            </div>
          )}
        </MobileBody>
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <MobileHeader eyebrow={`${decks.reduce((a,d)=>a+d.due,0)} CARDS DUE`} title="Vocabulary" large right={
        <button onClick={()=>nav('search')} style={{ width:38, height:38, borderRadius:19, background:MT.card, border:`1px solid ${MT.hairline}`, color:MT.ink2, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:MT.shadowSm }}>{Icon.search({width:14,height:14})}</button>
      }/>
      <MobileBody padding={[0,16,32]}>
        {/* Today's review hero */}
        <button onClick={()=>setStudying(true)} style={{ width:'100%', textAlign:'left', background:`linear-gradient(160deg, ${T.brand} 0%, #7B4A2D 100%)`, borderRadius:20, padding:'16px 18px 18px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:`0 14px 28px ${T.brand}44`, marginBottom:18, border:'none', cursor:'pointer' }}>
          <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.12)' }}/>
          <div style={{ position:'absolute', bottom:-20, right:30, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.78, marginBottom:7 }}>Today's review</div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1, letterSpacing:'-.02em', marginBottom:5 }}>54 cards</div>
            <div style={{ fontSize:12, opacity:.78 }}>Across 3 decks · ~12 minutes</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:14, paddingTop:13, borderTop:'1px solid rgba(255,255,255,.16)' }}>
              <div style={{ display:'flex', gap:14 }}>
                {[
                  { l:'NEW', v:18 }, { l:'LEARN', v:12 }, { l:'REVIEW', v:24 },
                ].map(s => (
                  <div key={s.l}>
                    <div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:9, opacity:.65, fontWeight:700, letterSpacing:'.1em', marginTop:3 }}>{s.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ width:40, height:40, borderRadius:20, background:'#fff', color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.play ? Icon.play({width:14,height:14}) : '▶'}</div>
            </div>
          </div>
        </button>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, background:MT.bg2, borderRadius:11, padding:3, marginBottom:14 }}>
          {[{id:'decks',l:'Decks'},{id:'all',l:'All cards'},{id:'mastered',l:'Mastered'}].map(t => {
            const a = tab === t.id;
            return (
              <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?MT.ink:MT.ink3, background: a?MT.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>
            );
          })}
        </div>

        {tab === 'decks' && (
          <>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, padding:'0 4px' }}>
              <div style={{ fontSize:10.5, color:MT.ink4, fontWeight:800, letterSpacing:'.12em', textTransform:'uppercase' }}>Your decks</div>
              <button style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>+ New deck</button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {decks.map(d => (
                <button key={d.name} onClick={()=>setStudying(true)} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:13, padding:'13px 14px', background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, boxShadow:MT.shadowSm }}>
                  <div style={{ width:44, height:54, borderRadius:8, background:d.grad, position:'relative', flexShrink:0, boxShadow:MT.shadowSm }}>
                    <div style={{ position:'absolute', inset:'2px 2px 32%', borderRadius:'6px 6px 0 0', background:'rgba(255,255,255,.18)' }}/>
                    <div style={{ position:'absolute', bottom:5, left:5, right:5, fontSize:9, fontWeight:800, color:'#fff', letterSpacing:'.05em', textAlign:'center' }}>{d.lang}</div>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13.5, fontWeight:700, color:MT.ink, marginBottom:3 }}>{d.name}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
                      <span style={{ fontSize:10.5, color:MT.ink4 }}>{d.count} cards</span>
                      {d.due > 0 && <span style={{ fontSize:10, padding:'2px 7px', borderRadius:99, background:`${T.brand}1a`, color:T.brand, fontWeight:800 }}>{d.due} due</span>}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ flex:1, height:4, background:MT.bg2, borderRadius:99, overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${d.mastery}%`, background:'#5A9C7A', borderRadius:99 }}/>
                      </div>
                      <div style={{ fontSize:10, color:MT.ink4, fontWeight:600 }}>{d.mastery}%</div>
                    </div>
                  </div>
                  <span style={{ color:MT.ink5, fontSize:18, lineHeight:1, marginLeft:4 }}>›</span>
                </button>
              ))}
            </div>
          </>
        )}

        {tab === 'all' && (
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {[
              { f:'partir',     b:'to leave',    m:'FR · verb', d:'Reviewed 2d ago' },
              { f:'umbrella',   b:'paraguas',    m:'ES · noun', d:'New' },
              { f:'頑張って',     b:'good luck',   m:'JP · expr', d:'Reviewed 1d ago' },
              { f:'irrespective',b:'sin importar',m:'EN · adv',  d:'Mastered' },
              { f:'amaneció',   b:'dawned',      m:'ES · verb', d:'Due today' },
            ].map((c,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:11, boxShadow:MT.shadowSm }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                    <span style={{ fontFamily:T.serif, fontSize:15, color:MT.ink, fontWeight:600 }}>{c.f}</span>
                    <span style={{ fontSize:11, color:MT.ink5 }}>·</span>
                    <span style={{ fontSize:11.5, color:MT.ink3 }}>{c.b}</span>
                  </div>
                  <div style={{ fontSize:10, color:MT.ink5, marginTop:2 }}>{c.m} · {c.d}</div>
                </div>
                <button style={{ width:28, height:28, borderRadius:8, background:MT.bg2, color:MT.ink4, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.play ? Icon.play({width:11,height:11}) : '▶'}</button>
              </div>
            ))}
          </div>
        )}

        {tab === 'mastered' && (
          <div style={{ background:MT.card, border:`1px solid ${MT.hairline}`, borderRadius:14, padding:'24px 20px', textAlign:'center', boxShadow:MT.shadowSm }}>
            <div style={{ width:60, height:60, borderRadius:30, background:'#E2EEDF', color:'#5A9C7A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>{Icon.check ? Icon.check({width:24,height:24}) : '✓'}</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:MT.ink, marginBottom:5, letterSpacing:'-.02em' }}>362 mastered</div>
            <div style={{ fontSize:12, color:MT.ink4, lineHeight:1.5, marginBottom:14 }}>You've fully learned 362 cards. They'll appear here for periodic review every 30+ days.</div>
            <button style={{ padding:'9px 16px', borderRadius:10, background:MT.bg2, color:MT.ink2, fontSize:12, fontWeight:700, border:`1px solid ${MT.hairline}` }}>Review mastered cards</button>
          </div>
        )}
      </MobileBody>
    </MobileFrame>
  );
}

Object.assign(window, {
  MSettingsPageW4, MNotificationsPageW4, MAchievementsPageW4, MFriendsPageW4, MVocabPageW4
});
