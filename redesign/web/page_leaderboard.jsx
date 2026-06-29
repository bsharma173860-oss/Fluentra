// ── Leaderboard — full rankings ───────────────────────────
const { useState: useStateLB } = React;

const LB_REGIONS = ['Global','Europe','Asia','Americas','Africa','Oceania'];
const LB_TIME    = ['This week','This month','All time'];
const LB_MODULE  = ['Overall','Reading','Listening','Speaking','Writing'];



function PodiumCard({ entry, place }) {
  const heights = { 1:120, 2:90, 3:70 };
  const colors  = { 1:'#FFD37A', 2:'#D4D6DA', 3:'#E0A571' };
  const rings   = { 1:'#F5B43E', 2:'#9CA0A8', 3:'#B27B3F' };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <div style={{ width:64, height:64, borderRadius:32, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:26, border:`3px solid ${rings[place]}`, position:'relative' }}>
        {(entry.name||'?')[0]}
        <div style={{ position:'absolute', bottom:-6, right:-6, width:24, height:24, borderRadius:12, background:rings[place], color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${T.bg}` }}>{place}</div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{entry.name}</div>
        <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{entry.country} · {entry.streak}-day streak</div>
      </div>
      <div style={{ width:'100%', height:heights[place], background:`linear-gradient(180deg, ${colors[place]} 0%, ${colors[place]}66 100%)`, borderRadius:'12px 12px 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', paddingTop:14, border:`1px solid ${rings[place]}40`, borderBottom:'none' }}>
        <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1 }}>{entry.score}</div>
        <div style={{ fontSize:10, color:T.ink4, fontWeight:600, marginTop:3 }}>{entry.unit||'XP'}</div>
      </div>
    </div>
  );
}

function DeltaPill({ d }) {
  if (!d) return <span style={{ color:T.ink5, fontSize:11 }}>—</span>;
  const up = d.startsWith('+');
  return <span style={{ fontSize:11, fontWeight:700, color:up?T.listening.c:T.brand }}>{up?'▲':'▼'} {d.replace(/[+-]/,'')}</span>;
}

function LBRow({ r }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'56px 1fr 80px 80px 90px 70px', alignItems:'center', padding:'12px 16px', borderRadius:r.user?10:0, background:r.user?T.brandLight:'transparent', border:r.user?`1px solid ${T.brand}40`:'none', borderBottom:r.user?`1px solid ${T.brand}40`:`1px solid ${T.hairline}`, gap:8 }}>
      <div style={{ fontSize:13, fontWeight:r.user?700:500, color:r.user?T.brand:T.ink4 }}>#{r.rank}</div>
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <div style={{ width:32, height:32, borderRadius:16, background:r.user?T.brandGrad:T.bg2, color:r.user?'#fff':T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14, flexShrink:0 }}>{(r.name||'?')[0]}</div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:r.user?700:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</div>
          <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{r.country} · {r.streak}d streak</div>
        </div>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:18, color:r.user?T.brand:T.ink, textAlign:'right' }}>{r.score}</div>
      <div style={{ textAlign:'center' }}><DeltaPill d={r.delta}/></div>
      <div style={{ fontSize:12, color:T.ink3, textAlign:'right' }}>{r.ses}% best</div>
      <div style={{ textAlign:'right' }}>
        <button onClick={() => { window.__profileId = r.id; window.__nav && window.__nav('public_profile'); }} style={{ fontSize:11, color:T.brand, fontWeight:600, background:'transparent', cursor:'pointer' }}>Profile</button>
      </div>
    </div>
  );
}

// ── Filter helpers ────────────────────────────────────────

// ═══ desktop ═══════════════════════════════════════════════
function LeaderboardPage() {
  const [by, setBy] = React.useState('xp');
  const [entries, setEntries] = React.useState(null);
  const [meId, setMeId] = React.useState(null);
  React.useEffect(function () {
    var cancelled = false;
    if (window.FL && window.FL.social) {
      window.FL.social._uid().then(function (id) { if (!cancelled) setMeId(id); });
      window.FL.social.leaderboard(by, 100)
        .then(function (rows) { if (!cancelled) setEntries(rows || []); })
        .catch(function () { if (!cancelled) setEntries([]); });
    } else { setEntries([]); }
    return function () { cancelled = true; };
  }, [by]);

  const unit = by === 'streak' ? 'days' : 'XP';
  const raw = entries || [];
  const adapted = raw.map(function (p, i) {
    return {
      id: p.id, rank: i + 1, user: p.id === meId,
      name: p.full_name || p.username || 'Learner',
      country: p.username ? '@' + p.username : '',
      streak: p.streak || 0,
      score: by === 'streak' ? (p.streak || 0) : (p.xp || 0),
      unit: unit, delta: null, ses: p.best_score || 0,
    };
  });
  const top3 = adapted.slice(0, 3);
  const me = adapted.filter(function (r) { return r.user; })[0];
  const total = adapted.length;

  function Toggle() {
    return (
      <Card padding={10} style={{ marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontSize:11.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginRight:4 }}>Rank by</span>
        {[['xp','Total XP'],['streak','Day streak']].map(function (o) {
          var active = by === o[0];
          return <button key={o[0]} onClick={function () { setBy(o[0]); }} style={{ padding:'7px 14px', borderRadius:9, fontSize:12.5, fontWeight:700, cursor:'pointer', border:`1px solid ${active?T.brand:T.border}`, background:active?T.brandLight:T.card, color:active?T.brand:T.ink2 }}>{o[1]}</button>;
        })}
      </Card>
    );
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <div style={{ marginBottom:20 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Rankings</div>
            <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.05 }}>Leaderboard</div>
            <div style={{ fontSize:13, color:T.ink4, marginTop:6 }}>{entries === null ? 'Loading…' : total + (total === 1 ? ' learner' : ' learners') + ' ranked by ' + (by === 'streak' ? 'day streak' : 'total XP')}</div>
          </div>

          <Toggle/>

          {entries === null ? (
            <Card padding={40}><div style={{ color:T.ink3, fontSize:13.5 }}>Loading leaderboard…</div></Card>
          ) : total === 0 ? (
            <Card padding={40}><div style={{ color:T.ink3, fontSize:13.5, lineHeight:1.6 }}>No public learners yet. As people practice, their XP and streaks appear here. Keep going and you'll be on the board.</div></Card>
          ) : (
          <>
            <div style={{ display:'grid', gridTemplateColumns: me ? '1.2fr 1fr' : '1fr', gap:14, marginBottom:18 }}>
              {top3.length >= 3 && (
                <Card padding={26}>
                  <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:18 }}>Top three</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:240 }}>
                    <PodiumCard entry={top3[1]} place={2}/>
                    <PodiumCard entry={top3[0]} place={1}/>
                    <PodiumCard entry={top3[2]} place={3}/>
                  </div>
                </Card>
              )}
              {me && (
                <div style={{ background:T.ink, borderRadius:18, padding:'24px 26px', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
                  <div>
                    <Chip label="Your position" accent="rgba(255,255,255,.85)" bg="rgba(255,255,255,.12)"/>
                    <div style={{ display:'flex', alignItems:'flex-end', gap:8, marginTop:14 }}>
                      <span style={{ fontFamily:T.serif, fontSize:54, lineHeight:1 }}>#{me.rank}</span>
                      <span style={{ fontSize:14, color:'rgba(255,255,255,.55)', marginBottom:8 }}>of {total}</span>
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, paddingTop:16, borderTop:'1px solid rgba(255,255,255,.15)', marginTop:14 }}>
                    <div><div style={{ fontFamily:T.serif, fontSize:22 }}>{me.score}</div><div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>{unit==='days'?'Day streak':'Total XP'}</div></div>
                    <div><div style={{ fontFamily:T.serif, fontSize:22 }}>{me.streak}</div><div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>Day streak</div></div>
                    <div><div style={{ fontFamily:T.serif, fontSize:22 }}>{me.ses}%</div><div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>Best score</div></div>
                  </div>
                </div>
              )}
            </div>

            <Card padding={0}>
              <div style={{ padding:'14px 20px', borderBottom:`1px solid ${T.hairline}`, fontSize:13.5, fontWeight:700, color:T.ink }}>Full rankings</div>
              <div style={{ padding:'8px 4px' }}>
                {adapted.map(function (r) { return <LBRow key={r.id} r={r}/>; })}
              </div>
            </Card>
          </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, opts, v, set }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
      <span style={{ fontSize:10.5, color:T.ink5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>{label}</span>
      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
        {opts.map(o => (
          <button key={o} onClick={() => set(o)} style={{ padding:'5px 10px', borderRadius:7, fontSize:11.5, fontWeight:v===o?700:500, color:v===o?T.brand:T.ink3, background:v===o?T.brandLight:'transparent', cursor:'pointer' }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

// ═══ mobile ═══════════════════════════════════════════════