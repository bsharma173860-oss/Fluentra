// ── Notifications & inbox ─────────────────────────────────
const { useState: useStateN } = React;

const NOTIF_FILTERS = [
  { id:'all',      label:'All',          count:14 },
  { id:'unread',   label:'Unread',       count:5 },
  { id:'mentions', label:'Mentions',     count:2 },
  { id:'system',   label:'System',       count:3 },
  { id:'archive',  label:'Archive',      count:0 },
];

const NOTIFS = [
  { id:1, type:'streak',  unread:true,  when:'2h',  title:'You\'re 1 day from a 30-day streak 🔥', body:'Open Fluentra today to lock it in. Your evening reminder is at 21:00.', cta:'Continue today\'s lesson', accent:'brand', nav:'lesson_detail' },
  { id:2, type:'social',  unread:true,  when:'5h',  title:'Hiroko commented on your essay', body:'"This is much tighter than your last attempt — the topic sentences pop. Watch the third paragraph though, it drifts."', cta:'Open thread', accent:'speaking', nav:'friends' },
  { id:3, type:'exam',    unread:true,  when:'1d',  title:'Your IELTS practice exam was scored', body:'Overall band 7.0 — up from 6.5 last month. Reading climbed the most. Tap to see breakdown.', cta:'See results', accent:'reading', nav:'monthly_results' },
  { id:4, type:'system',  unread:true,  when:'1d',  title:'Pro trial ends in 2 days', body:'You\'ve used 142 AI tutor messages, 8 practice exams, and 4 essay reviews so far. Continue with Pro to keep them.', cta:'Manage plan', accent:'brand', pinned:true, nav:'pricing' },
  { id:5, type:'achv',    unread:true,  when:'2d',  title:'Achievement unlocked: Polyglot II', body:'Reach intermediate (B1) in 2 languages. Spanish and French both cleared.', cta:'View badges', accent:'listening', nav:'achievements' },
  { id:6, type:'social',  unread:false, when:'3d',  title:'David K. invited you to a study room', body:'"Tuesday Speaking · 18:00 CET" — 5 of 8 spots filled.', cta:'See room', accent:'speaking', nav:'friends' },
  { id:7, type:'tutor',   unread:false, when:'4d',  title:'Tutor saved 8 phrases for review', body:'From your Spanish chat about restaurant ordering. They\'ll appear in your next flashcard set.', cta:'Review phrases', accent:'brand', nav:'vocab' },
  { id:8, type:'system',  unread:false, when:'5d',  title:'New feature: Speaking with native partners', body:'Available on Max — 4 hours per month with verified C2-level speakers.', cta:'Learn more', accent:'ink', nav:'pricing' },
  { id:9, type:'streak',  unread:false, when:'6d',  title:'Streak saved automatically', body:'You missed yesterday — we used 1 of your 3 monthly streak savers.', cta:'See streak history', accent:'brand', nav:'progress' },
  { id:10,type:'system',  unread:false, when:'1w',  title:'Your weekly summary is ready', body:'You spent 2h 14m practicing across 4 languages. 67 new words. 1 missed day.', cta:'Open summary', accent:'ink', nav:'progress' },
];

const ACCENTS = {
  brand: { c:T.brand, bg:T.brandLight || T.bg2 },
  reading:   T.reading   || { c:'#C4503E', bg:'#FBE9E5' },
  listening: T.listening || { c:'#1A8F4E', bg:'#E3F2EA' },
  speaking:  T.speaking  || { c:'#5B4FE2', bg:'#E8E5FA' },
  writing:   T.writing   || { c:'#C4503E', bg:'#FBE9E5' },
  ink: { c:T.ink, bg:T.bg2 },
};

const TYPE_ICON = { streak:'🔥', social:'💬', exam:'✦', system:'⚙', achv:'🏆', tutor:'✦' };

function NotifItem({ n, onClick, compact }) {
  const a = ACCENTS[n.accent] || ACCENTS.brand;
  return (
    <button onClick={onClick} style={{ width:'100%', display:'flex', gap:14, padding: compact ? '14px 16px' : '16px 20px', background: n.unread ? T.card : 'transparent', border: n.unread ? `1px solid ${T.border}` : `1px solid transparent`, borderLeft: n.unread ? `3px solid ${a.c}` : `3px solid transparent`, borderRadius:0, cursor:'pointer', textAlign:'left', position:'relative', borderBottom:`1px solid ${T.hairline}` }}>
      <div style={{ width:38, height:38, borderRadius:11, background:a.bg, color:a.c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{TYPE_ICON[n.type] || '•'}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:3 }}>
          <div style={{ fontSize:13, fontWeight: n.unread ? 700 : 500, color:T.ink, lineHeight:1.35, flex:1 }}>{n.title}</div>
          <div style={{ fontSize:11, color:T.ink4, flexShrink:0 }}>{n.when}</div>
        </div>
        <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5, marginBottom: n.cta ? 8 : 0, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{n.body}</div>
        {n.cta && <div style={{ fontSize:11.5, color:a.c, fontWeight:700 }}>{n.cta} →</div>}
      </div>
      {n.pinned && <div style={{ position:'absolute', top:14, right:14, fontSize:11, color:T.brand }}>📌</div>}
    </button>
  );
}

function NotificationsPage() {
  const [filter, setFilter] = useStateN('all');
  const [selected, setSelected] = useStateN(NOTIFS[0]);

  const filtered = NOTIFS.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.unread;
    if (filter === 'system') return n.type === 'system';
    if (filter === 'mentions') return n.type === 'social';
    return false;
  });

  const a = ACCENTS[selected.accent] || ACCENTS.brand;

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden', background:T.bg2 }}>
      {/* List */}
      <div style={{ width:480, borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column', background:T.bg, flexShrink:0 }}>
        <div style={{ padding:'18px 20px 12px', borderBottom:`1px solid ${T.hairline}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink }}>Notifications</div>
            <div style={{ display:'flex', gap:6 }}>
              <button style={{ padding:'7px 11px', borderRadius:8, border:`1px solid ${T.border}`, background:T.card, fontSize:11.5, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Mark all read</button>
              <button style={{ width:32, height:32, borderRadius:8, border:`1px solid ${T.border}`, background:T.card, color:T.ink3 }}>⋯</button>
            </div>
          </div>
          <div style={{ display:'flex', gap:5, overflowX:'auto' }}>
            {NOTIF_FILTERS.map(f => {
              const sel = filter === f.id;
              return <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding:'7px 12px', borderRadius:99, fontSize:11.5, fontWeight: sel ? 700 : 500, color: sel ? '#fff' : T.ink3, background: sel ? T.ink : T.bg2, display:'flex', alignItems:'center', gap:6, flexShrink:0, cursor:'pointer' }}>{f.label}{f.count > 0 && <span style={{ padding:'1px 6px', borderRadius:99, background: sel ? 'rgba(255,255,255,.18)' : T.hairline, color: sel ? '#fff' : T.ink4, fontSize:10, fontWeight:700 }}>{f.count}</span>}</button>;
            })}
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto' }}>
          {filtered.map(n => <div key={n.id} onClick={() => setSelected(n)} style={{ background: selected.id === n.id ? T.bg2 : T.bg }}><NotifItem n={n} onClick={() => setSelected(n)} compact/></div>)}
          {filtered.length === 0 && <div style={{ padding:60, textAlign:'center', color:T.ink4, fontSize:13 }}>Nothing here. Try another filter.</div>}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto' }}>
        <div style={{ padding:'24px 32px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:14, background:T.bg }}>
          <div style={{ width:46, height:46, borderRadius:13, background:a.bg, color:a.c, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20 }}>{TYPE_ICON[selected.type]}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{selected.type} · {selected.when} ago</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.2 }}>{selected.title}</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{ width:34, height:34, borderRadius:9, background:T.card, border:`1px solid ${T.border}`, color:T.ink3 }}>📌</button>
            <button style={{ width:34, height:34, borderRadius:9, background:T.card, border:`1px solid ${T.border}`, color:T.ink3 }}>📁</button>
            <button style={{ width:34, height:34, borderRadius:9, background:T.card, border:`1px solid ${T.border}`, color:T.ink3 }}>🗑</button>
          </div>
        </div>
        <div style={{ flex:1, padding:'30px 32px' }}>
          <div style={{ maxWidth:640 }}>
            <div style={{ fontSize:14.5, color:T.ink2, lineHeight:1.7, marginBottom:24 }}>{selected.body}</div>

            {selected.type === 'streak' && (
              <Card padding={20} style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Last 14 days</div>
                <div style={{ display:'flex', gap:5 }}>
                  {Array.from({ length:14 }).map((_, i) => {
                    const done = i !== 8;
                    return <div key={i} style={{ flex:1, height:38, borderRadius:6, background: done ? T.brand : T.hairline, position:'relative' }}>{i === 13 && <div style={{ position:'absolute', bottom:-18, left:'50%', transform:'translateX(-50%)', fontSize:9, color:T.brand, fontWeight:700 }}>TODAY</div>}</div>;
                  })}
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', marginTop:24, fontSize:11, color:T.ink4 }}><span>2 weeks ago</span><span>Today</span></div>
              </Card>
            )}

            {selected.type === 'system' && selected.id === 4 && (
              <Card padding={20} style={{ marginBottom:20 }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Trial usage</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
                  {[{ l:'AI tutor msgs', v:'142' }, { l:'Practice exams', v:'8' }, { l:'Essay reviews', v:'4' }].map(x => (
                    <div key={x.l}>
                      <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{x.v}</div>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:4 }}>{x.l}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {selected.cta && (
              <div style={{ display:'flex', gap:10, marginTop:8 }}>
                <Btn label={selected.cta} accent={a.c} nav={selected.nav}/>
                <button style={{ padding:'10px 16px', borderRadius:10, background:T.card, border:`1px solid ${T.border}`, fontSize:13, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Snooze for a day</button>
              </div>
            )}
          </div>
        </div>

        {/* Settings nudge */}
        <div style={{ padding:'14px 32px', borderTop:`1px solid ${T.border}`, background:T.bg2, fontSize:12, color:T.ink4, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span>Getting too many? Adjust which notifications you receive.</span>
          <button style={{ fontSize:12, color:T.brand, fontWeight:700, cursor:'pointer' }}>Notification settings →</button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile notifications ────────────────────────────────
function MNotificationsPage() {
  const [filter, setFilter] = useStateN('all');
  const filtered = NOTIFS.filter(n => filter === 'all' ? true : filter === 'unread' ? n.unread : filter === 'system' ? n.type === 'system' : filter === 'mentions' ? n.type === 'social' : false);

  return (
    <MobileBody noTabs>
      <div style={{ padding:'12px 16px 10px', borderBottom:`1px solid ${T.hairline}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink }}>Inbox</div>
          <button style={{ fontSize:11.5, color:T.brand, fontWeight:700 }}>Mark all read</button>
        </div>
        <div style={{ display:'flex', gap:5, overflowX:'auto' }}>
          {NOTIF_FILTERS.slice(0, 4).map(f => {
            const sel = filter === f.id;
            return <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding:'6px 11px', borderRadius:99, fontSize:11, fontWeight: sel ? 700 : 500, color: sel ? '#fff' : T.ink3, background: sel ? T.ink : T.bg2, display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>{f.label}{f.count > 0 && <span style={{ padding:'1px 5px', borderRadius:99, background: sel ? 'rgba(255,255,255,.18)' : T.hairline, fontSize:9.5, fontWeight:700 }}>{f.count}</span>}</button>;
          })}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto' }}>
        {filtered.map(n => <NotifItem key={n.id} n={n} onClick={() => {}} compact/>)}
      </div>
    </MobileBody>
  );
}

Object.assign(window, { NotificationsPage, MNotificationsPage });
