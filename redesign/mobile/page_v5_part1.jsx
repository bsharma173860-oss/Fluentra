// ── Mobile · v5 redesigns · Part 1 ────────────────────────────────
// Settings · Notifications · Achievements · Friends · Vocab · Tutor · Pricing · Search
// Editorial vocabulary: eyebrow + serif title + lede, dark hero, MCard
// with hairlines, module color accents, italic feedback callouts.

const useStateMV5 = React.useState;
const useEffectMV5 = React.useEffect;
const useRefMV5 = React.useRef;

// Local helpers ─ gradient avatar, eyebrow, dark dot-textured hero
const V5_av = (initials, size=40, grad) => (
  <div style={{ width:size, height:size, borderRadius:size/2, background: grad || `linear-gradient(135deg, ${T.brand}, #7B4A2D)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:size*0.42, letterSpacing:'-.02em', flexShrink:0 }}>{initials}</div>
);
const V5_pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5_dotgrid = ({ children }) => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
    {children}
  </div>
);
const V5_label = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);

// ══════════════════════════════════════════════════════════════════
// SETTINGS · v5
// ══════════════════════════════════════════════════════════════════
function MSettingsPageV5() {
  const [view, setView] = useStateMV5('list');
  const nav = (id) => window.__nav && window.__nav(id);
  const subViews = { account:'AccountTab', subscription:'SubscriptionTab', billing:'BillingTab', preferences:'PreferencesTab', notifications:'NotificationsTab', data:'DataPrivacyTab' };
  if (view !== 'list') {
    const Comp = window[subViews[view]];
    return (<><MobileHeader back onBack={()=>setView('list')} title={view === 'data' ? 'Data & privacy' : view[0].toUpperCase()+view.slice(1)}/><MobileBody padding={[0,16,30]} tabBarPad={false}>{Comp ? <Comp/> : <div style={{ padding:30, textAlign:'center', color:T.ink4 }}>Coming soon</div>}</MobileBody></>);
  }
  const groups = [
    { title:'ACCOUNT', items: [
      { id:'account',      label:'Profile & login',   ic:'user',   meta:'maria@example.com', c:T.brand },
      { id:'subscription', label:'Subscription',      ic:'crown',  meta:'Pro · Renews May 28', c:'#7C5BD6' },
      { id:'billing',      label:'Billing & receipts',ic:'card',   meta:'Visa ··4242', c:'#2A6FA0' },
    ]},
    { title:'APP', items: [
      { id:'preferences',  label:'Preferences',       ic:'sliders', meta:'Light · 16h reminders', c:T.ink2 },
      { id:'notifications',label:'Notifications',     ic:'bell',    meta:'12 active', c:'#E08F4D' },
      { id:'data',         label:'Data & privacy',    ic:'shield',  meta:'Export, delete', c:'#5A9C7A' },
    ]},
  ];
  return (
    <>
      <MobileHeader title="Settings"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow="MARÍA GARCÍA · PRO" title="Settings" lede="Account, billing, preferences and your data — all in one place."/>
        {/* Dark hero */}
        <div style={{ background:T.ink, borderRadius:18, padding:'18px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5_dotgrid/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
            {V5_av('M', 56, `linear-gradient(135deg, ${T.brand}, #7B4A2D)`)}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1.05, letterSpacing:'-.015em' }}>María García</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.55)', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>maria@example.com</div>
              <div style={{ marginTop:6, display:'inline-flex', alignItems:'center', gap:5, padding:'3px 8px', borderRadius:99, background:'rgba(255,255,255,.12)', fontSize:9.5, fontWeight:800, letterSpacing:'.08em' }}>
                <span style={{ width:5, height:5, borderRadius:3, background:'#FFC859' }}/> PRO · MAY 28
              </div>
            </div>
          </div>
          <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, paddingTop:12, borderTop:'1px solid rgba(255,255,255,.10)' }}>
            {[{l:'STREAK',v:'42'},{l:'SESSIONS',v:'142'},{l:'AVG BAND',v:'7.5'}].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div>
                <div style={{ fontSize:9, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.1em', marginTop:4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          <button onClick={()=>nav('refer')} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, padding:'11px 13px', display:'flex', alignItems:'center', gap:9, textAlign:'left', boxShadow:MT.shadowSm }}>
            <div style={{ width:32, height:32, borderRadius:8, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({ width:14, height:14 })}</div>
            <div style={{ minWidth:0 }}><div style={{ fontSize:12, fontWeight:700, color:T.ink }}>Refer friends</div><div style={{ fontSize:10, color:T.ink4 }}>1 month free</div></div>
          </button>
          <button onClick={()=>nav('help')} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, padding:'11px 13px', display:'flex', alignItems:'center', gap:9, textAlign:'left', boxShadow:MT.shadowSm }}>
            <div style={{ width:32, height:32, borderRadius:8, background:'#E1ECF6', color:'#2A6FA0', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.help ? Icon.help({width:14,height:14}) : '?'}</div>
            <div style={{ minWidth:0 }}><div style={{ fontSize:12, fontWeight:700, color:T.ink }}>Help</div><div style={{ fontSize:10, color:T.ink4 }}>Docs & contact</div></div>
          </button>
        </div>

        {/* Settings groups */}
        {groups.map(g => (
          <div key={g.title} style={{ marginBottom:14 }}>
            {V5_label(g.title)}
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {g.items.map((it, i) => (
                <button key={it.id} onClick={()=>setView(it.id)} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent' }}>
                  <div style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:it.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[it.ic] ? Icon[it.ic]({ width:13, height:13 }) : Icon.user({ width:13, height:13 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{it.label}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{it.meta}</div>
                  </div>
                  <span style={{ color:T.ink5, fontSize:18 }}>›</span>
                </button>
              ))}
            </MCard>
          </div>
        ))}

        <button onClick={()=>nav('auth_login')} style={{ width:'100%', padding:'13px', borderRadius:12, background:T.card, border:`1px solid ${T.hairline}`, color:T.brand, fontSize:13, fontWeight:700, boxShadow:MT.shadowSm, marginBottom:12 }}>Sign out</button>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink5 }}>Fluentra v2.4.0 · Build 1240</div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// NOTIFICATIONS · v5
// ══════════════════════════════════════════════════════════════════
function MNotificationsPageV5() {
  const [filter, setFilter] = useStateMV5('all');
  const nav = (id) => window.__nav && window.__nav(id);
  const NOTIFS = [];  // wire to a real notifications/activity backend when available
  const filtered = NOTIFS.filter(n => filter === 'all' ? true : filter === 'unread' ? n.unread : n.type === filter);
  const unread = NOTIFS.filter(n => n.unread).length;
  const tabs = [{id:'all',l:'All',n:NOTIFS.length},{id:'unread',l:'Unread',n:unread},{id:'social',l:'Social',n:NOTIFS.filter(n=>n.type==='social').length},{id:'system',l:'System',n:NOTIFS.filter(n=>n.type==='system').length}];

  return (
    <>
      <MobileHeader title="Inbox" right={<button style={{ width:34, height:34, borderRadius:17, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.check ? Icon.check({width:13,height:13}) : '✓'}</button>}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow={`${unread} UNREAD · ${NOTIFS.length} TOTAL`} title="Your inbox" lede="Streaks, social pings and account events from the past week."/>
        {/* Pill tabs */}
        <div style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          {tabs.map(t => {
            const a = filter === t.id;
            return (
              <button key={t.id} onClick={()=>setFilter(t.id)} style={{ flexShrink:0, padding:'7px 13px', borderRadius:99, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink2, fontSize:11.5, fontWeight:700, border:`1px solid ${a ? T.ink : T.hairline}`, display:'inline-flex', alignItems:'center', gap:5 }}>
                {t.l}<span style={{ fontSize:9.5, padding:'1px 6px', borderRadius:8, background: a ? 'rgba(255,255,255,.18)' : T.bg2, color: a ? '#fff' : T.ink4, fontWeight:700 }}>{t.n}</span>
              </button>
            );
          })}
        </div>

        {filtered.length > 0 && V5_label('RECENT')}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(n => (
            <button key={n.id} onClick={()=>{ if (n.type==='social') nav('public_profile'); else if (n.type==='system') nav('exam_book'); }} style={{ display:'flex', alignItems:'flex-start', gap:11, padding:'12px 13px', borderRadius:13, background:T.card, border:`1px solid ${n.unread ? n.accent + '33' : T.hairline}`, boxShadow:MT.shadowSm, textAlign:'left', position:'relative' }}>
              {n.unread && <div style={{ position:'absolute', top:13, right:13, width:7, height:7, borderRadius:4, background:n.accent }}/>}
              <div style={{ width:36, height:36, borderRadius:10, background:`${n.accent}1a`, color:n.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[n.ic] ? Icon[n.ic]({width:14,height:14}) : Icon.bell({width:14,height:14})}</div>
              <div style={{ flex:1, minWidth:0, paddingRight: n.unread ? 12 : 0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{n.title}</div>
                <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.45, marginTop:3 }}>{n.body}</div>
                <div style={{ fontSize:10, color:T.ink5, fontWeight:600, marginTop:4 }}>{n.t}</div>
              </div>
            </button>
          ))}
        </div>
        {filtered.length === 0 && (
          <div style={{ padding:'50px 30px', textAlign:'center' }}>
            <div style={{ width:54, height:54, borderRadius:27, background:T.bg2, color:T.ink4, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>{Icon.bell({width:20,height:20})}</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:4 }}>You're all caught up</div>
            <div style={{ fontSize:11, color:T.ink4 }}>No {filter !== 'all' ? filter+' ' : ''}notifications.</div>
          </div>
        )}
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// ACHIEVEMENTS · v5
// ══════════════════════════════════════════════════════════════════
function MAchievementsPageV5() {
  const [tab, setTab] = useStateMV5('earned');
  const _streak = (window.__user && window.__user.streak) || 0;
  const _Rv = (typeof window!=='undefined' && window.__results) ? window.__results : [];
  const _sessions = _Rv.length;
  const _cnt = function (mod) { return _Rv.filter(function (r) { return (r.detail && r.detail.module) === mod; }).length; };
  const _defs = [
    { id:'streak3',  title:'3-day streak',  ic:'flame',  c:'#E08F4D', rarity:'common', cur:_streak,            thr:3 },
    { id:'streak7',  title:'7-day streak',  ic:'flame',  c:'#E08F4D', rarity:'common', cur:_streak,            thr:7 },
    { id:'streak30', title:'30-day streak', ic:'flame',  c:'#E08F4D', rarity:'rare',   cur:_streak,            thr:30 },
    { id:'first',    title:'First lesson',  ic:'book',   c:'#5A9C7A', rarity:'common', cur:_sessions,          thr:1 },
    { id:'ten',      title:'10 sessions',   ic:'spark',  c:'#7B4A2D', rarity:'common', cur:_sessions,          thr:10 },
    { id:'fifty',    title:'50 sessions',   ic:'trophy', c:'#7B4A2D', rarity:'epic',   cur:_sessions,          thr:50 },
    { id:'speak10',  title:'10 speaking',   ic:'mic',    c:'#D26890', rarity:'rare',   cur:_cnt('speaking'),   thr:10 },
    { id:'read10',   title:'10 reading',    ic:'book',   c:'#2A6FA0', rarity:'common', cur:_cnt('reading'),    thr:10 },
  ];
  const _earnedDefs = _defs.filter(function (d) { return d.cur >= d.thr; });
  const earned = _earnedDefs.map(function (d) { return { title:d.title, date:'earned', rarity:d.rarity, ic:d.ic, c:d.c }; });
  const inProgress = _defs.filter(function (d) { return d.cur < d.thr; }).map(function (d) { return { title:d.title, pct:Math.min(99, Math.round(d.cur/d.thr*100)), ic:d.ic, c:d.c, sub:(d.cur + '/' + d.thr) }; });
  const _earnedN = earned.length, _rareN = _earnedDefs.filter(function (d) { return d.rarity !== 'common'; }).length, _totalN = _defs.length;
  const _feat = earned[0] || null;
  const rarity = (r) => r==='epic'?{c:'#7C5BD6',bg:'#EFEBFB'}:r==='rare'?{c:'#2A6FA0',bg:'#E1ECF6'}:{c:T.ink3,bg:T.bg2};

  return (
    <>
      <MobileHeader title="Achievements"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow={_earnedN + " EARNED · " + _rareN + " RARE"} title="Your trophies" lede="Milestones for streaks, study volume and exam progress — collect them all."/>
        {/* Featured trophy hero — dark */}
        <div style={{ background:T.ink, borderRadius:18, padding:'20px 18px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5_dotgrid/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,255,255,.55)', marginBottom:10 }}>{_feat ? 'RECENTLY EARNED' : 'GET STARTED'}</div>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:12 }}>
              <div style={{ width:60, height:60, borderRadius:16, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.16)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.trophy ? Icon.trophy({width:26,height:26}) : '🏆'}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1.05, letterSpacing:'-.015em' }}>{_feat ? _feat.title : 'No trophies yet'}</div>
                <div style={{ fontSize:11.5, color:'rgba(255,255,255,.65)', marginTop:4, lineHeight:1.4 }}>{_feat ? ('One of ' + _earnedN + ' earned so far — keep going.') : 'Complete a lesson to earn your first trophy.'}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', background:'#7C5BD6', padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>{_feat ? _feat.rarity.toUpperCase() : 'TROPHY'}</span>
              <span style={{ fontSize:9.5, fontWeight:800, color:'#fff', background:'rgba(255,255,255,.15)', padding:'3px 8px', borderRadius:99, letterSpacing:'.08em' }}>{_feat ? '+50 XP' : 'Start now'}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {[{id:'earned',l:'Earned · '+_earnedN},{id:'progress',l:'In progress · '+inProgress.length},{id:'all',l:'All · '+_totalN}].map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>;
          })}
        </div>

        {tab === 'earned' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {earned.map(b => (
              <MCard key={b.title} style={{ padding:'14px 12px' }}>
                <div style={{ width:42, height:42, borderRadius:11, background:`${b.c}1a`, color:b.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:10 }}>{Icon[b.ic] ? Icon[b.ic]({width:17,height:17}) : Icon.trophy({width:17,height:17})}</div>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.2, marginBottom:5 }}>{b.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                  <span style={{ fontSize:9, padding:'2px 6px', borderRadius:99, background:rarity(b.rarity).bg, color:rarity(b.rarity).c, fontWeight:800, letterSpacing:'.05em' }}>{b.rarity.toUpperCase()}</span>
                  <span style={{ fontSize:10, color:T.ink5 }}>{b.date}</span>
                </div>
              </MCard>
            ))}
          </div>
        )}
        {tab === 'progress' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {inProgress.map(b => (
              <MCard key={b.title} style={{ padding:'13px 14px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:9 }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:`${b.c}1a`, color:b.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[b.ic] ? Icon[b.ic]({width:14,height:14}) : Icon.trophy({width:14,height:14})}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{b.title}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{b.sub}</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:b.c }}>{b.pct}%</div>
                </div>
                <div style={{ height:5, background:T.bg2, borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${b.pct}%`, background:b.c, borderRadius:99 }}/></div>
              </MCard>
            ))}
          </div>
        )}
        {tab === 'all' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
            {Array.from({length:9}).map((_,i) => {
              const b = earned[i % earned.length];
              const locked = i > 5;
              return (
                <div key={i} style={{ background: locked ? T.bg2 : T.card, border:`1px solid ${T.hairline}`, borderRadius:12, padding:'10px 8px', textAlign:'center', opacity: locked ? .45 : 1 }}>
                  <div style={{ width:38, height:38, borderRadius:10, background:`${b.c}1a`, color:b.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 6px' }}>{Icon[b.ic] ? Icon[b.ic]({width:13,height:13}) : Icon.trophy({width:13,height:13})}</div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink, lineHeight:1.15 }}>{b.title}</div>
                </div>
              );
            })}
          </div>
        )}
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// FRIENDS · v5
// ══════════════════════════════════════════════════════════════════
function MFriendsPageV5() {
  const [tab, setTab] = useStateMV5('friends');
  const [data, setData] = React.useState(null);
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const nav = function (id) { window.__nav && window.__nav(id); };
  function refresh() { if (!S) { setData({ friends:[], incoming:[], outgoing:[] }); return; } S.listFriends().then(function (d) { setData(d || { friends:[], incoming:[], outgoing:[] }); }).catch(function () { setData({ friends:[], incoming:[], outgoing:[] }); }); }
  React.useEffect(refresh, []);
  function ini(p) { var n = (p && (p.full_name || p.username)) || '?'; var parts = n.trim().split(/\s+/); return (((parts[0]||'')[0]||'') + ((parts[1]||'')[0]||'')).toUpperCase(); }
  function nm(p) { return (p && (p.full_name || p.username)) || 'Learner'; }
  function act(promise) { if (!promise) return; setBusy(true); Promise.resolve(promise).then(function () { setBusy(false); refresh(); }).catch(function () { setBusy(false); refresh(); }); }
  function doSearch() {
    if (!S || q.trim().length < 2) { setResults([]); return; }
    S.searchUsers(q.trim()).then(function (r) {
      S._uid().then(function (me) {
        var known = {};
        ((data && data.friends) || []).forEach(function (x) { known[x.profile.id] = 1; });
        ((data && data.outgoing) || []).forEach(function (x) { known[x.profile.id] = 1; });
        setResults((r || []).filter(function (u) { return u.id !== me; }).map(function (u) { return Object.assign({ _known: !!known[u.id] }, u); }));
      });
    }).catch(function () { setResults([]); });
  }
  const d = data || { friends:[], incoming:[], outgoing:[] };
  function Mini(props) { return <button disabled={busy} onClick={props.onClick} style={{ padding:'6px 11px', borderRadius:8, fontSize:11.5, fontWeight:700, border:props.solid?'none':`1px solid ${T.border}`, background:props.solid?T.brand:'transparent', color:props.solid?'#fff':T.ink2, opacity:busy?.6:1 }}>{props.label}</button>; }
  function Person(props) { var p = props.p; return (
    <div style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderTop:`1px solid ${T.hairline}` }}>
      <button onClick={function () { window.__profileId = p.id; nav('public_profile'); }} style={{ display:'flex', alignItems:'center', gap:11, flex:1, minWidth:0, textAlign:'left', background:'transparent' }}>
        {V5_av(ini(p), 38, T.brandGrad)}
        <div style={{ minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{nm(p)}</div>{p.username && <div style={{ fontSize:10, color:T.ink5 }}>@{p.username}{p.streak?(' · '+p.streak+'d'):''}</div>}</div>
      </button>
      <div style={{ display:'flex', gap:6 }}>{props.right}</div>
    </div>
  ); }
  return (
    <>
      <MobileHeader title="Friends"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow="COMMUNITY" title="Friends" lede="Connect with other learners and message each other."/>
        <button onClick={function(){ window.__nav && window.__nav('activity_feed'); }} style={{ width:'100%', marginBottom:14, padding:'11px', borderRadius:11, border:`1px solid ${T.border}`, background:T.card, color:T.ink2, fontSize:13, fontWeight:700 }}>📣 Open Circle →</button>
        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {[{id:'friends',l:'Friends · '+d.friends.length},{id:'requests',l:'Requests · '+d.incoming.length},{id:'find',l:'Find'}].map(function (t) { var a = tab===t.id; return <button key={t.id} onClick={function(){ setTab(t.id); }} style={{ flex:1, padding:'7px 4px', borderRadius:9, fontSize:11, fontWeight:a?700:500, color:a?T.ink:T.ink3, background:a?T.card:'transparent', boxShadow:a?MT.shadowSm:'none' }}>{t.l}</button>; })}
        </div>
        {data === null ? <MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13 }}>Loading…</div></MCard>
         : tab === 'friends' ? (
           d.friends.length === 0 ? <MCard style={{ padding:20 }}><div style={{ color:T.ink3, fontSize:12.5, lineHeight:1.5 }}>No friends yet. Tap <b>Find</b> to search for learners by name or username.</div></MCard>
           : <MCard style={{ padding:0, overflow:'hidden' }}>{d.friends.map(function (fr) { return <Person key={fr.friendshipId} p={fr.profile} right={<><Mini label="Message" solid onClick={function(){ window.__dmUser=fr.profile; nav('dm_thread'); }}/><Mini label="Remove" onClick={function(){ act(S.removeFriend(fr.friendshipId)); }}/></>}/>; })}</MCard>
         ) : tab === 'requests' ? (
           <>
             {d.incoming.length === 0 ? <MCard style={{ padding:20 }}><div style={{ color:T.ink4, fontSize:12.5 }}>No incoming requests.</div></MCard>
              : <MCard style={{ padding:0, overflow:'hidden' }}>{d.incoming.map(function (fr) { return <Person key={fr.friendshipId} p={fr.profile} right={<><Mini label="Accept" solid onClick={function(){ act(S.respondFriendRequest(fr.friendshipId,true)); }}/><Mini label="Decline" onClick={function(){ act(S.respondFriendRequest(fr.friendshipId,false)); }}/></>}/>; })}</MCard>}
             {d.outgoing.length > 0 && <>{V5_label('SENT')}<MCard style={{ padding:0, overflow:'hidden' }}>{d.outgoing.map(function (fr) { return <Person key={fr.friendshipId} p={fr.profile} right={<Mini label="Cancel" onClick={function(){ act(S.removeFriend(fr.friendshipId)); }}/>}/>; })}</MCard></>}
           </>
         ) : (
           <>
             <div style={{ display:'flex', gap:8, marginBottom:12 }}>
               <input value={q} onChange={function(e){ setQ(e.target.value); }} onKeyDown={function(e){ if(e.key==='Enter') doSearch(); }} placeholder="Name or username…" style={{ flex:1, padding:'10px 13px', borderRadius:10, border:`1px solid ${T.border}`, fontSize:13, outline:'none', background:T.card }}/>
               <button onClick={doSearch} style={{ padding:'10px 16px', borderRadius:10, background:T.brand, color:'#fff', fontSize:13, fontWeight:700 }}>Go</button>
             </div>
             {results === null ? <MCard style={{ padding:20 }}><div style={{ color:T.ink4, fontSize:12.5 }}>Search for other learners by name or username.</div></MCard>
              : results.length === 0 ? <MCard style={{ padding:20 }}><div style={{ color:T.ink4, fontSize:12.5 }}>No matches.</div></MCard>
              : <MCard style={{ padding:0, overflow:'hidden' }}>{results.map(function (u) { return <Person key={u.id} p={u} right={u._known ? <span style={{ fontSize:10.5, color:T.ink4, fontWeight:700, padding:'5px 9px' }}>Added</span> : <Mini label="Add" solid onClick={function(){ act(S.sendFriendRequest(u.id)); }}/>}/>; })}</MCard>}
           </>
         )}
      </MobileBody>
    </>
  );
}

function MVocabPageV5() {
  const [tab, setTab] = useStateMV5('decks');
  const [studying, setStudying] = useStateMV5(false);
  const [cardIdx, setCardIdx] = useStateMV5(0);
  const [flipped, setFlipped] = useStateMV5(false);
  const nav = (id) => window.__nav && window.__nav(id);
  const _vcode = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const [words, setWords] = React.useState([]);
  const [srs, setSrs] = React.useState({});
  const [vloading, setVloading] = React.useState(true);
  React.useEffect(function () {
    var cancelled = false;
    (async function () {
      var states = {};
      try { if (window.FL && window.FL.srsStates) states = (await window.FL.srsStates(_vcode).catch(function(){return {};})) || {}; } catch(e){}
      var items = [];
      try { var r = await fetch('/api/content-list?lang=' + encodeURIComponent(_vcode) + '&type=vocab&full=1&limit=10'); var d = await r.json(); items = (d && d.items) || []; } catch(e){}
      if (!items.length) { try { var gr = await fetch('/api/generate-content', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ lang:_vcode, type:'vocab', difficulty:'medium' }) }); var gen = await gr.json(); if (gen && gen.content) items = [gen.content]; } catch(e){} }
      if (cancelled) return;
      var out = [];
      items.forEach(function (it) { ((it.payload && it.payload.words) || []).forEach(function (w) { if (w && w.term) out.push({ term:w.term, en:w.en||'', reading:w.reading||'', example:w.example||'' }); }); });
      setSrs(states); setWords(out); setVloading(false);
    })();
    return function(){ cancelled = true; };
  }, []);
  const _vnow = Date.now();
  const _isDue = function (term) { var st = srs[_vcode + '::' + term]; return !st || !st.due || new Date(st.due).getTime() <= _vnow; };
  const _reps = function (term) { var st = srs[_vcode + '::' + term]; return (st && st.reps) || 0; };
  const dueWords = words.filter(function (w) { return _isDue(w.term); });
  const masteredWords = words.filter(function (w) { return _reps(w.term) >= 3; });
  const studyWords = dueWords.length ? dueWords : words;
  const cards = studyWords.map(function (w) { return { term:w.term, front:w.term, back:w.en, meta:(w.reading ? w.reading + ' · ' : '') + _vcode.toUpperCase(), ex:w.example }; });
  const _newN = words.filter(function (w) { return !srs[_vcode + '::' + w.term]; }).length;
  const _revN = words.filter(function (w) { return srs[_vcode + '::' + w.term] && _isDue(w.term); }).length;
  const _learnN = Math.max(0, dueWords.length - _revN);
  const _masteryPct = words.length ? Math.round(masteredWords.length / words.length * 100) : 0;
  const _langName = (typeof langByCode === 'function' && langByCode(_vcode) && langByCode(_vcode).english) || _vcode.toUpperCase();
  const decks = words.length ? [{ name:_langName + ' vocabulary', count:words.length, due:dueWords.length, lang:_vcode.toUpperCase(), mastery:_masteryPct, c:T.brand }] : [];
  const _allCards = words.map(function (w) { var has = srs[_vcode + '::' + w.term]; return { f:w.term, b:w.en, m:_vcode.toUpperCase() + (w.reading ? ' · ' + w.reading : ''), d: has ? (_isDue(w.term) ? 'Due' : 'Learning') : 'New' }; });
  function _grade(label) {
    var card = cards[cardIdx] || cards[0]; if (!card) return;
    var q = label === 'Again' ? 1 : label === 'Hard' ? 3 : label === 'Easy' ? 5 : 4;
    try { if (window.FL && window.FL.srsSchedule) { var cur = srs[_vcode + '::' + card.term] || null; var ns = window.FL.srsSchedule(cur, q); if (window.FL.srsSave) window.FL.srsSave(_vcode, card.term, ns); setSrs(function (m) { var cc = Object.assign({}, m || {}); cc[_vcode + '::' + card.term] = Object.assign({ card:_vcode + '::' + card.term }, ns); return cc; }); } } catch(e){}
    setFlipped(false); setCardIdx(function (i) { return (i + 1) % Math.max(cards.length, 1); });
  }
  if (studying) {
    const c = cards[cardIdx] || cards[0];
    if (!c) return (<><MobileHeader back onBack={()=>setStudying(false)} title="Studying"/><MobileBody padding={[10,16,30]} tabBarPad={false}><MCard style={{ padding:'34px 20px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:6 }}>All caught up</div><div style={{ fontSize:12.5, color:T.ink4 }}>No cards to review right now — finish a lesson to add more.</div></MCard></MobileBody></>);
    return (
      <>
        <MobileHeader back onBack={()=>setStudying(false)} title="Studying"/>
        <MobileBody padding={[10,16,30]} tabBarPad={false}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em' }}>CARD {cardIdx+1} / {cards.length}</div>
            <div style={{ fontSize:10.5, color:T.ink4 }}>{cards.length - cardIdx - 1} remaining</div>
          </div>
          <div style={{ height:4, background:T.bg2, borderRadius:99, overflow:'hidden', marginBottom:18 }}><div style={{ height:'100%', width:`${((cardIdx+1)/cards.length)*100}%`, background:T.brand, borderRadius:99 }}/></div>
          <div onClick={()=>setFlipped(f=>!f)} style={{ background: flipped ? T.ink : T.card, color: flipped ? '#fff' : T.ink, borderRadius:20, padding:'40px 24px', minHeight:280, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', boxShadow:MT.shadowLg, border:`1px solid ${flipped ? 'transparent' : T.hairline}`, cursor:'pointer', position:'relative', overflow:'hidden' }}>
            {flipped && <V5_dotgrid/>}
            <div style={{ position:'relative', fontSize:9.5, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', opacity:.6, marginBottom:18 }}>{flipped ? 'TRANSLATION' : c.meta.toUpperCase()}</div>
            <div style={{ position:'relative', fontFamily:T.serif, fontSize: flipped ? 32 : 38, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:14 }}>{flipped ? c.back : c.front}</div>
            {flipped && <div style={{ position:'relative', fontFamily:T.serif, fontStyle:'italic', fontSize:13, opacity:.8, lineHeight:1.5, maxWidth:260 }}>"{c.ex}"</div>}
            <div style={{ position:'absolute', bottom:14, fontSize:10, color: flipped ? 'rgba(255,255,255,.55)' : T.ink5, fontWeight:700, letterSpacing:'.08em' }}>TAP TO {flipped ? 'HIDE' : 'REVEAL'}</div>
          </div>
          {flipped && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:7, marginTop:14 }}>
              {[{l:'Again',sub:'<1m',c:'#D26890'},{l:'Hard',sub:'10m',c:'#E08F4D'},{l:'Good',sub:'1d',c:'#5A9C7A'},{l:'Easy',sub:'4d',c:'#2A6FA0'}].map(b => (
                <button key={b.l} onClick={()=>_grade(b.l)} style={{ padding:'11px 5px', borderRadius:11, background:T.card, border:`1.5px solid ${b.c}`, color:b.c, boxShadow:MT.shadowSm }}>
                  <div style={{ fontSize:12, fontWeight:700 }}>{b.l}</div>
                  <div style={{ fontSize:9.5, opacity:.75, fontWeight:600, marginTop:1 }}>{b.sub}</div>
                </button>
              ))}
            </div>
          )}
        </MobileBody>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Vocabulary" right={<button onClick={()=>nav('search')} style={{ width:34, height:34, borderRadius:17, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.search({width:13,height:13})}</button>}/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow={dueWords.length + ' CARDS DUE TODAY'} title="Vocabulary" lede="Spaced-repetition decks across all your languages — review now to keep them sticky."/>
        {/* Today's review hero — dark */}
        <button onClick={()=>setStudying(true)} style={{ width:'100%', textAlign:'left', background:T.ink, borderRadius:18, padding:'20px 18px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14, border:'none', cursor:'pointer' }}>
          <V5_dotgrid/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:9.5, fontWeight:800, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,255,255,.55)', marginBottom:7 }}>TODAY'S REVIEW</div>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:14 }}>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1, letterSpacing:'-.02em' }}>{dueWords.length} cards</div>
                <div style={{ fontSize:11.5, color:'rgba(255,255,255,.55)', marginTop:5 }}>{vloading ? 'Loading your words…' : (dueWords.length ? 'Tap to review' : 'All caught up')}</div>
              </div>
              <div style={{ width:40, height:40, borderRadius:20, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 14px ${T.brand}55`, flexShrink:0 }}>{Icon.play ? Icon.play({width:13,height:13}) : '▶'}</div>
            </div>
            <div style={{ display:'flex', gap:14, marginTop:14, paddingTop:12, borderTop:'1px solid rgba(255,255,255,.10)' }}>
              {[{l:'NEW',v:_newN},{l:'LEARN',v:_learnN},{l:'REVIEW',v:_revN}].map(s => (
                <div key={s.l}><div style={{ fontFamily:T.serif, fontSize:18, lineHeight:1 }}>{s.v}</div><div style={{ fontSize:9, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.1em', marginTop:3 }}>{s.l}</div></div>
              ))}
            </div>
          </div>
        </button>

        <div style={{ display:'flex', gap:0, background:T.bg2, borderRadius:11, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {[{id:'decks',l:'Decks'},{id:'all',l:'All cards'},{id:'mastered',l:'Mastered'}].map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11.5, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none' }}>{t.l}</button>;
          })}
        </div>

        {tab === 'decks' && <>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 4px', marginBottom:8 }}>
            {V5_label('YOUR DECKS')}
            <button style={{ fontSize:11, color:T.brand, fontWeight:700 }}>+ New</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {decks.map(d => (
              <button key={d.name} onClick={()=>setStudying(true)} style={{ width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:11, padding:'12px 14px', background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, boxShadow:MT.shadowSm }}>
                <div style={{ width:38, height:48, borderRadius:6, background:`linear-gradient(160deg, ${d.c}, ${d.c}cc)`, position:'relative', flexShrink:0, boxShadow:MT.shadowSm }}>
                  <div style={{ position:'absolute', inset:'2px 2px 32%', borderRadius:'4px 4px 0 0', background:'rgba(255,255,255,.18)' }}/>
                  <div style={{ position:'absolute', bottom:4, left:0, right:0, fontSize:9, fontWeight:800, color:'#fff', letterSpacing:'.05em', textAlign:'center' }}>{d.lang}</div>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:3 }}>{d.name}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                    <span style={{ fontSize:10.5, color:T.ink4 }}>{d.count} cards</span>
                    {d.due > 0 && <span style={{ fontSize:9.5, padding:'2px 6px', borderRadius:99, background:T.brandLight, color:T.brand, fontWeight:800 }}>{d.due} due</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ flex:1, height:4, background:T.bg2, borderRadius:99, overflow:'hidden' }}><div style={{ height:'100%', width:`${d.mastery}%`, background:'#5A9C7A', borderRadius:99 }}/></div>
                    <div style={{ fontSize:10, color:T.ink4, fontWeight:600 }}>{d.mastery}%</div>
                  </div>
                </div>
                <span style={{ color:T.ink5, fontSize:18 }}>›</span>
              </button>
            ))}
          </div>
        </>}
        {tab === 'all' && (
          <MCard style={{ padding:0, overflow:'hidden' }}>
            {_allCards.map((c, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                    <span style={{ fontFamily:T.serif, fontSize:15, color:T.ink, fontWeight:600 }}>{c.f}</span>
                    <span style={{ fontSize:11.5, color:T.ink3 }}>{c.b}</span>
                  </div>
                  <div style={{ fontSize:10, color:T.ink5, marginTop:2 }}>{c.m} · {c.d}</div>
                </div>
                <button style={{ width:26, height:26, borderRadius:7, background:T.bg2, color:T.ink4, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.play ? Icon.play({width:10,height:10}) : '▶'}</button>
              </div>
            ))}
          </MCard>
        )}
        {tab === 'mastered' && (
          <MCard style={{ padding:'24px 20px', textAlign:'center' }}>
            <div style={{ width:54, height:54, borderRadius:27, background:'#E2EEDF', color:'#5A9C7A', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>{Icon.check ? Icon.check({width:22,height:22}) : '✓'}</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:5, letterSpacing:'-.02em' }}>{masteredWords.length} mastered</div>
            <div style={{ fontSize:12, color:T.ink4, lineHeight:1.5, marginBottom:14 }}>Fully learned cards. They re-surface every 30+ days for retention.</div>
            <button style={{ padding:'9px 16px', borderRadius:10, background:T.bg2, color:T.ink2, fontSize:12, fontWeight:700, border:`1px solid ${T.hairline}` }}>Review mastered</button>
          </MCard>
        )}
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// AI TUTOR · v5
// ══════════════════════════════════════════════════════════════════
function MTutorPageV5() {
  const [input, setInput] = useStateMV5('');
  const [msgs, setMsgs] = useStateMV5([
    { role:'ai', text:"Hi! I'm your Fluentra tutor. Ask me anything — a word, a grammar point, or let's practice a conversation.", t:'now' },
  ]);
  async function send() {
    var text = (input || '').trim(); if (!text) return;
    var userMsg = { role:'user', text:text, t:'now' };
    var history = msgs.concat([userMsg]).map(function (m) { return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }; });
    setMsgs(function (m) { return m.concat([userMsg]); }); setInput('');
    try {
      var resp = await fetch('/api/tutor', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ messages: history, lang: (window.__langCode || 'en') }) });
      var data = await resp.json();
      if (!resp.ok || data.error) throw new Error(data.error || 'tutor error');
      setMsgs(function (m) { return m.concat([{ role:'ai', text: data.reply || '\u2026', t:'now' }]); });
    } catch (e) { setMsgs(function (m) { return m.concat([{ role:'ai', text:'Sorry \u2014 I had trouble responding. Please try again.', t:'now' }]); }); }
  }
  const sessions = [];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.bg }}>
      <MobileHeader title="Fluentra AI" right={<button style={{ width:34, height:34, borderRadius:17, background:T.card, border:`1px solid ${T.hairline}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.more ? Icon.more({width:13,height:13}) : '⋯'}</button>}/>
      <div style={{ flex:1, overflow:'auto', padding:'0 16px 14px' }}>
        <V5_pre eyebrow="CLAUDE-POWERED · ALWAYS-ON" title="Your AI tutor" lede="Conversational drills, on-the-fly feedback and personalised practice — any time."/>
        {/* Active session — dark */}
        <div style={{ background:T.ink, borderRadius:16, padding:'14px 16px', color:'#fff', marginBottom:14, position:'relative', overflow:'hidden' }}>
          <V5_dotgrid/>
          <div style={{ position:'relative', display:'flex', alignItems:'center', gap:11 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.spark({width:15,height:15})}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:9, fontWeight:800, letterSpacing:'.16em', color:'rgba(255,255,255,.55)', marginBottom:2 }}>YOUR TUTOR</div>
              <div style={{ fontSize:13, fontWeight:700 }}>Ask anything — grammar, words, conversation</div>
            </div>
            <button style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.12)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.x ? Icon.x({width:11,height:11}) : '×'}</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{ display:'flex', flexDirection:'column', gap:12, marginBottom:14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {m.role === 'ai' && <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.14em', marginBottom:5, paddingLeft:2 }}>FLUENTRA AI · {m.t.toUpperCase()}</div>}
              <div style={{ maxWidth:'86%', padding:'10px 13px', borderRadius:14, background: m.role === 'user' ? T.ink : T.card, color: m.role === 'user' ? '#fff' : T.ink, fontSize:13, lineHeight:1.55, border: m.role === 'user' ? 'none' : `1px solid ${T.hairline}`, boxShadow: m.role === 'user' ? 'none' : MT.shadowSm }}>{m.text}</div>
              {m.actions && (
                <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                  {m.actions.map(a => <button key={a} style={{ padding:'7px 11px', borderRadius:99, background:T.brandLight, color:T.brand, fontSize:11.5, fontWeight:700, border:`1px solid ${T.brand}33` }}>{a}</button>)}
                </div>
              )}
              {m.role === 'user' && <div style={{ fontSize:9, fontWeight:800, color:T.ink5, letterSpacing:'.14em', marginTop:5, paddingRight:2 }}>{m.t.toUpperCase()}</div>}
            </div>
          ))}
        </div>

        {V5_label('RECENT SESSIONS')}
        <MCard style={{ padding:0, overflow:'hidden' }}>
          {sessions.map((s, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:32, height:32, borderRadius:9, background:s.bg, color:s.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[s.ic] ? Icon[s.ic]({width:13,height:13}) : Icon.book({width:13,height:13})}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.topic}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{s.n} messages · {s.ago}</div>
              </div>
              <span style={{ color:T.ink5, fontSize:18 }}>›</span>
            </div>
          ))}
        </MCard>
      </div>

      {/* Input bar */}
      <div style={{ padding:'10px 14px 14px', background:T.card, borderTop:`1px solid ${T.hairline}`, flexShrink:0, display:'flex', gap:8, alignItems:'center' }}>
        <button style={{ width:36, height:36, borderRadius:10, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.mic ? Icon.mic({width:14,height:14}) : '🎙'}</button>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if (e.key==="Enter") send(); }} placeholder="Ask anything…" style={{ flex:1, padding:'10px 13px', borderRadius:11, background:T.bg2, border:`1px solid ${T.border}`, fontSize:13, color:T.ink, outline:'none', minWidth:0 }}/>
        <button onClick={()=>send()} style={{ width:36, height:36, borderRadius:10, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 4px 10px ${T.brand}55`, flexShrink:0 }}>{Icon.arrow ? Icon.arrow({width:13,height:13}) : '→'}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// PRICING / PAYWALL · v5
// ══════════════════════════════════════════════════════════════════
function MPricingPageV5() {
  const [billing, setBilling] = useStateMV5('yearly');
  const [plan, setPlan] = useStateMV5('pro');
  const nav = (id) => window.__nav && window.__nav(id);
  const plans = [
    { id:'free', name:'Free',      yearly:0,  monthly:0,  tag:'Forever free',  features:['1 language','3 lessons/day','AI tutor (limited)','Streak tracking'] },
    { id:'pro',  name:'Pro',       yearly:99, monthly:12, tag:'Most popular',  features:['Unlimited languages','Unlimited lessons','Unlimited AI tutor','All exam practice','Detailed analytics','Priority support'] },
    { id:'team', name:'Family',    yearly:149,monthly:18, tag:'Up to 5 seats', features:['Everything in Pro','5 family members','Group challenges','Shared progress','Family leaderboard'] },
  ];
  const cur = plans.find(p => p.id === plan);
  const price = billing === 'yearly' ? cur.yearly : cur.monthly;
  const sub = billing === 'yearly' && cur.yearly > 0 ? `$${(cur.yearly/12).toFixed(2)}/mo · billed annually` : cur.monthly > 0 ? 'billed monthly' : 'free forever';

  return (
    <>
      <MobileHeader back onBack={()=>nav('settings')} title="Plans"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5_pre eyebrow="UNLOCK EVERYTHING · CANCEL ANY TIME" title="Choose your plan" lede="Start free, upgrade when you're ready. All plans include the AI tutor and exam practice."/>
        {/* Billing toggle */}
        <div style={{ display:'flex', background:T.bg2, borderRadius:12, padding:3, marginBottom:14, border:`1px solid ${T.border}` }}>
          {['monthly','yearly'].map(b => {
            const a = billing === b;
            return (
              <button key={b} onClick={()=>setBilling(b)} style={{ flex:1, padding:'9px 6px', borderRadius:9, fontSize:12, fontWeight: a?700:500, color: a?T.ink:T.ink3, background: a?T.card:'transparent', boxShadow: a?MT.shadowSm:'none', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                {b[0].toUpperCase()+b.slice(1)}
                {b === 'yearly' && <span style={{ fontSize:9, padding:'2px 6px', borderRadius:99, background:'#5A9C7A', color:'#fff', fontWeight:800, letterSpacing:'.05em' }}>−25%</span>}
              </button>
            );
          })}
        </div>

        {/* Plan picker */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:14 }}>
          {plans.map(p => {
            const active = plan === p.id;
            const featured = p.id === 'pro';
            return (
              <button key={p.id} onClick={()=>setPlan(p.id)} style={{ width:'100%', textAlign:'left', padding:'14px 15px', borderRadius:14, background: active ? (featured ? T.ink : T.brandLight) : T.card, color: active && featured ? '#fff' : T.ink, border:`2px solid ${active ? (featured ? T.ink : T.brand) : T.hairline}`, position:'relative', boxShadow: active ? MT.shadowMd : MT.shadowSm }}>
                {featured && <div style={{ position:'absolute', top:-9, right:14, padding:'3px 9px', borderRadius:99, background:T.brandGrad, color:'#fff', fontSize:9.5, fontWeight:800, letterSpacing:'.08em', boxShadow:MT.shadowSm }}>POPULAR</div>}
                <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:4 }}>
                  <div style={{ fontFamily:T.serif, fontSize:20, lineHeight:1, letterSpacing:'-.015em' }}>{p.name}</div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{ fontFamily:T.serif, fontSize:22, lineHeight:1 }}>${billing === 'yearly' ? p.yearly : p.monthly}</span>
                    <span style={{ fontSize:11, color: active && featured ? 'rgba(255,255,255,.5)' : T.ink4, marginLeft:3 }}>/{billing === 'yearly' ? 'yr' : 'mo'}</span>
                  </div>
                </div>
                <div style={{ fontSize:10.5, color: active && featured ? 'rgba(255,255,255,.6)' : T.ink4, fontWeight:700, letterSpacing:'.05em', textTransform:'uppercase' }}>{p.tag}</div>
              </button>
            );
          })}
        </div>

        {/* Features of selected plan */}
        {V5_label(`WHAT'S IN ${cur.name.toUpperCase()}`)}
        <MCard style={{ padding:14, marginBottom:14 }}>
          {cur.features.map((f, i) => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:10, marginBottom: i < cur.features.length-1 ? 10 : 0 }}>
              <div style={{ width:18, height:18, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.check ? Icon.check({width:9,height:9}) : '✓'}</div>
              <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.4 }}>{f}</div>
            </div>
          ))}
        </MCard>

        {/* Italic guarantee */}
        <div style={{ padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11, marginBottom:14 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12.5, color:T.ink, lineHeight:1.5 }}>"Cancel any time within 30 days for a full refund. No questions asked."</div>
        </div>

        <button onClick={()=>nav('checkout')} style={{ width:'100%', padding:'14px', borderRadius:13, background:price>0 ? T.brandGrad : T.bg3, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow: price > 0 ? `0 8px 22px ${T.brand}40` : 'none', display:'flex', alignItems:'center', justifyContent:'center', gap:7 }}>
          {price > 0 ? `Upgrade to ${cur.name} — $${price}/${billing === 'yearly' ? 'yr' : 'mo'}` : 'Continue with Free'}{Icon.arrow ? Icon.arrow({width:12,height:12}) : '→'}
        </button>
        <div style={{ textAlign:'center', fontSize:10.5, color:T.ink4, marginTop:10, lineHeight:1.5 }}>{sub} · Tax may apply</div>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// SEARCH · v5
// ══════════════════════════════════════════════════════════════════
function MSearchPageV5() {
  const [q, setQ] = useStateMV5('past tense');
  const [tab, setTab] = useStateMV5('all');
  const nav = (id) => window.__nav && window.__nav(id);
  const recent = ['Travel vocab','IELTS Writing Task 2','Past tense Spanish','Anaís Rodríguez'];
  const trending = ['Subjunctive','Phrasal verbs','C1 reading','日本語 N3'];
  const results = [
    { kind:'lesson',     title:'Past tense — Preterite (ES)',     meta:'15 min · A2 · Spanish',     ic:'book',  c:T.reading.c, bg:T.reading.bg },
    { kind:'grammar',    title:'Past simple vs past continuous',  meta:'Reading rule · English',    ic:'pen',   c:T.writing.c, bg:T.writing.bg },
    { kind:'vocab',      title:'Past tense conjugations · 24 cards', meta:'Spanish · 12 due',       ic:'book',  c:'#7C5BD6', bg:'#EFEBFB' },
    { kind:'article',    title:'How the past tense shapes memory', meta:'Reading · 6 min',          ic:'book',  c:'#2A6FA0', bg:'#E1ECF6' },
    { kind:'friend',     title:'Anaís Rodríguez',                  meta:'Spanish · 14-day streak',  ic:'user',  c:'#D26890', bg:'#F9E6EE' },
    { kind:'tutor',      title:'Ask AI: past tense in Italian',    meta:'Tutor session · ~5 min',   ic:'spark', c:T.brand,    bg:T.brandLight },
  ];
  const tabs = [{id:'all',l:'All'},{id:'lesson',l:'Lessons'},{id:'vocab',l:'Vocab'},{id:'grammar',l:'Grammar'},{id:'friend',l:'Friends'}];
  const filtered = tab === 'all' ? results : results.filter(r => r.kind === tab);

  return (
    <>
      <MobileHeader back onBack={()=>nav('dashboard')} title="Search"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {/* Search input */}
        <div style={{ position:'relative', marginBottom:14 }}>
          <div style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search({width:14,height:14})}</div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search lessons, vocab, friends…" style={{ width:'100%', padding:'12px 40px 12px 38px', borderRadius:12, background:T.card, border:`1px solid ${T.hairline}`, fontSize:13, color:T.ink, outline:'none', boxShadow:MT.shadowSm }}/>
          {q && <button onClick={()=>setQ('')} style={{ position:'absolute', right:8, top:'50%', transform:'translateY(-50%)', width:26, height:26, borderRadius:13, background:T.bg2, color:T.ink4, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.x ? Icon.x({width:11,height:11}) : '×'}</button>}
        </div>

        {!q ? (
          <>
            <V5_pre eyebrow="WHAT WOULD YOU LIKE TO STUDY?" title="Search anything" lede="Lessons, vocab decks, articles, grammar rules and friends — all in one place."/>
            {V5_label('RECENT')}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:18 }}>
              {recent.map(r => <button key={r} onClick={()=>setQ(r)} style={{ padding:'7px 12px', borderRadius:99, background:T.card, border:`1px solid ${T.hairline}`, fontSize:11.5, color:T.ink2, fontWeight:600, display:'inline-flex', alignItems:'center', gap:5 }}>{Icon.clock ? Icon.clock({width:11,height:11}) : '⏱'} {r}</button>)}
            </div>
            {V5_label('TRENDING')}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {trending.map(t => <button key={t} onClick={()=>setQ(t)} style={{ padding:'7px 12px', borderRadius:99, background:T.brandLight, color:T.brand, fontSize:11.5, fontWeight:700, border:`1px solid ${T.brand}33`, display:'inline-flex', alignItems:'center', gap:5 }}>{Icon.spark ? Icon.spark({width:11,height:11}) : '✦'} {t}</button>)}
            </div>
          </>
        ) : (
          <>
            <div style={{ display:'flex', gap:6, marginBottom:14, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
              {tabs.map(t => {
                const a = tab === t.id;
                return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flexShrink:0, padding:'7px 13px', borderRadius:99, background: a ? T.ink : T.card, color: a ? '#fff' : T.ink2, fontSize:11.5, fontWeight:700, border:`1px solid ${a ? T.ink : T.hairline}` }}>{t.l}</button>;
              })}
            </div>
            <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, padding:'0 4px', marginBottom:8 }}>{filtered.length} results for "{q}"</div>
            <MCard style={{ padding:0, overflow:'hidden' }}>
              {filtered.map((r, i) => (
                <button key={i} onClick={()=>r.kind === 'friend' ? nav('public_profile') : r.kind === 'tutor' ? nav('tutor') : nav('lesson_detail')} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', background:'transparent' }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:r.bg, color:r.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[r.ic] ? Icon[r.ic]({width:13,height:13}) : Icon.book({width:13,height:13})}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:9, color:r.c, fontWeight:800, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:2 }}>{r.kind}</div>
                    <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.3 }}>{r.title}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{r.meta}</div>
                  </div>
                  <span style={{ color:T.ink5, fontSize:18 }}>›</span>
                </button>
              ))}
            </MCard>
          </>
        )}
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MSettingsPageV5, MNotificationsPageV5, MAchievementsPageV5,
  MFriendsPageV5, MVocabPageV5, MTutorPageV5, MPricingPageV5, MSearchPageV5,
});
