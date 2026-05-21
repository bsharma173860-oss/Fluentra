// ── Leaderboard — full rankings ───────────────────────────
const { useState: useStateLB } = React;

const LB_REGIONS = ['Global','Europe','Asia','Americas','Africa','Oceania'];
const LB_TIME    = ['This week','This month','All time'];
const LB_MODULE  = ['Overall','Reading','Listening','Speaking','Writing'];

const LB_TOP3 = [
  { rank:1, name:'Aiko Tanaka',    country:'🇯🇵', score:'8.9', delta:'+0.2', streak:178 },
  { rank:2, name:'Lukas Bauer',    country:'🇩🇪', score:'8.8', delta:'+0.1', streak:142 },
  { rank:3, name:'Sofia Rossi',    country:'🇮🇹', score:'8.7', delta:'',     streak:96  },
];

const LB_ROWS = [
  { rank:4,   name:'Yuki Nakamura',     country:'🇯🇵', score:'8.6', delta:'+0.3', streak:120, ses:184 },
  { rank:5,   name:'Priya Sharma',      country:'🇮🇳', score:'8.6', delta:'+0.2', streak:88,  ses:155 },
  { rank:6,   name:'Marcus Holm',       country:'🇸🇪', score:'8.5', delta:'',     streak:62,  ses:142 },
  { rank:7,   name:'Léa Dubois',        country:'🇫🇷', score:'8.5', delta:'+0.1', streak:74,  ses:131 },
  { rank:8,   name:'Carlos Mendes',     country:'🇧🇷', score:'8.4', delta:'-0.1', streak:51,  ses:128 },
  { rank:9,   name:'Olivia Bennett',    country:'🇬🇧', score:'8.4', delta:'+0.2', streak:99,  ses:122 },
  { rank:10,  name:'Hiroshi Sato',      country:'🇯🇵', score:'8.4', delta:'',     streak:115, ses:118 },
  { rank:11,  name:'Anna Kowalski',     country:'🇵🇱', score:'8.3', delta:'+0.1', streak:42,  ses:111 },
  { rank:12,  name:'Diego Hernández',   country:'🇲🇽', score:'8.3', delta:'-0.2', streak:33,  ses:107 },
  { rank:13,  name:'Min-Jun Park',      country:'🇰🇷', score:'8.3', delta:'+0.4', streak:108, ses:104 },
  { rank:489, name:'Priya S.',          country:'🇮🇳', score:'7.6', delta:'+0.2', streak:39,  ses:62  },
  { rank:490, name:'Ahmed K.',          country:'🇪🇬', score:'7.6', delta:'',     streak:51,  ses:58  },
  { rank:491, name:'You',                country:'🇪🇸', score:'7.5', delta:'+0.3', streak:42,  ses:142, user:true },
  { rank:492, name:'María L.',          country:'🇲🇽', score:'7.5', delta:'-0.1', streak:18,  ses:54  },
  { rank:493, name:'James T.',          country:'🇬🇧', score:'7.4', delta:'+0.1', streak:24,  ses:50  },
  { rank:494, name:'Fatima Rahman',     country:'🇧🇩', score:'7.4', delta:'',     streak:45,  ses:48  },
];

function PodiumCard({ entry, place }) {
  const heights = { 1:120, 2:90, 3:70 };
  const colors  = { 1:'#FFD37A', 2:'#D4D6DA', 3:'#E0A571' };
  const rings   = { 1:'#F5B43E', 2:'#9CA0A8', 3:'#B27B3F' };
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
      <div style={{ width:64, height:64, borderRadius:32, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:26, border:`3px solid ${rings[place]}`, position:'relative' }}>
        {entry.name[0]}
        <div style={{ position:'absolute', bottom:-6, right:-6, width:24, height:24, borderRadius:12, background:rings[place], color:'#fff', fontSize:11, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${T.bg}` }}>{place}</div>
      </div>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{entry.name}</div>
        <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{entry.country} · {entry.streak}-day streak</div>
      </div>
      <div style={{ width:'100%', height:heights[place], background:`linear-gradient(180deg, ${colors[place]} 0%, ${colors[place]}66 100%)`, borderRadius:'12px 12px 0 0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start', paddingTop:14, border:`1px solid ${rings[place]}40`, borderBottom:'none' }}>
        <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1 }}>{entry.score}</div>
        <div style={{ fontSize:10, color:T.ink4, fontWeight:600, marginTop:3 }}>band</div>
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
        <div style={{ width:32, height:32, borderRadius:16, background:r.user?T.brandGrad:T.bg2, color:r.user?'#fff':T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14, flexShrink:0 }}>{r.name[0]}</div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:r.user?700:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</div>
          <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{r.country} · {r.streak}d streak</div>
        </div>
      </div>
      <div style={{ fontFamily:T.serif, fontSize:18, color:r.user?T.brand:T.ink, textAlign:'right' }}>{r.score}</div>
      <div style={{ textAlign:'center' }}><DeltaPill d={r.delta}/></div>
      <div style={{ fontSize:12, color:T.ink3, textAlign:'right' }}>{r.ses} sessions</div>
      <div style={{ textAlign:'right' }}>
        <button data-nav="public_profile" style={{ fontSize:11, color:T.brand, fontWeight:600, background:'transparent', cursor:'pointer' }}>Profile</button>
      </div>
    </div>
  );
}

// ── Filter helpers ────────────────────────────────────────
const REGION_FLAGS = {
  Global:    null,
  Europe:    ['🇩🇪','🇮🇹','🇸🇪','🇫🇷','🇬🇧','🇵🇱','🇪🇸'],
  Asia:      ['🇯🇵','🇮🇳','🇰🇷','🇧🇩'],
  Americas:  ['🇧🇷','🇲🇽'],
  Africa:    ['🇪🇬'],
  Oceania:   ['🇦🇺','🇳🇿'],
};
const MOD_OFFSET = { Overall:0, Reading:+0.2, Listening:+0.1, Speaking:-0.2, Writing:-0.3 };
const TIME_FACTOR = { 'This week':1, 'This month':1.04, 'All time':1.08 };

function applyFilters(rows, region, time, mod) {
  const flags = REGION_FLAGS[region];
  let filtered = flags ? rows.filter(r => flags.includes(r.country) || r.user) : rows;
  const off = MOD_OFFSET[mod] || 0;
  const tf  = TIME_FACTOR[time] || 1;
  filtered = filtered.map(r => {
    const s = Math.min(9, Math.max(4, parseFloat(r.score) * tf + off));
    return { ...r, score: s.toFixed(1) };
  });
  // Re-rank
  filtered = [...filtered].sort((a,b) => parseFloat(b.score) - parseFloat(a.score))
    .map((r,i) => ({ ...r, rank: r.user ? r.rank : i+4 }));
  return filtered;
}

// ═══ desktop ═══════════════════════════════════════════════
function LeaderboardPage() {
  const [region, setRegion] = useStateLB('Global');
  const [time, setTime]     = useStateLB('This week');
  const [mod, setMod]       = useStateLB('Overall');
  const rows = applyFilters(LB_ROWS, region, time, mod);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 48px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>

          {/* Header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20, gap:18 }}>
            <div>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Rankings</div>
              <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.05 }}>Leaderboard</div>
              <div style={{ fontSize:13, color:T.ink4, marginTop:6 }}>26,420 learners ranked across {LB_MODULE.length-1} modules · Updated 2 minutes ago</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Invite friends" variant="outline" accent={T.ink2}/>
              <Btn label="Share my rank" accent={T.brand}/>
            </div>
          </div>

          {/* Filters */}
          <Card padding={16} style={{ marginBottom:18, display:'flex', alignItems:'center', gap:18, flexWrap:'wrap' }}>
            <FilterGroup label="Region" opts={LB_REGIONS} v={region} set={setRegion}/>
            <div style={{ width:1, height:24, background:T.hairline }}/>
            <FilterGroup label="Time" opts={LB_TIME} v={time} set={setTime}/>
            <div style={{ width:1, height:24, background:T.hairline }}/>
            <FilterGroup label="Module" opts={LB_MODULE} v={mod} set={setMod}/>
          </Card>

          {/* You + podium */}
          <div style={{ display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:14, marginBottom:18 }}>
            {/* Podium */}
            <Card padding={26}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:18 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>This week's podium</div>
                <div style={{ fontSize:11, color:T.ink4 }}>{region} · {mod}</div>
              </div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:14, height:240 }}>
                <PodiumCard entry={LB_TOP3[1]} place={2}/>
                <PodiumCard entry={LB_TOP3[0]} place={1}/>
                <PodiumCard entry={LB_TOP3[2]} place={3}/>
              </div>
            </Card>

            {/* You card */}
            <div style={{ background:T.ink, borderRadius:18, padding:'24px 26px', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
              <div>
                <Chip label="Your position" accent="rgba(255,255,255,.85)" bg="rgba(255,255,255,.12)"/>
                <div style={{ display:'flex', alignItems:'flex-end', gap:8, marginTop:14 }}>
                  <span style={{ fontFamily:T.serif, fontSize:54, lineHeight:1 }}>#491</span>
                  <span style={{ fontSize:14, color:'rgba(255,255,255,.55)', marginBottom:8 }}>of 26,420</span>
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', marginTop:6 }}>Top 1.9% · ▲ 12 places this week</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, paddingTop:16, borderTop:'1px solid rgba(255,255,255,.15)', marginTop:14 }}>
                <div><div style={{ fontFamily:T.serif, fontSize:22 }}>7.5</div><div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>Avg band</div></div>
                <div><div style={{ fontFamily:T.serif, fontSize:22 }}>42</div><div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>Day streak</div></div>
                <div><div style={{ fontFamily:T.serif, fontSize:22 }}>142</div><div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>Sessions</div></div>
              </div>
            </div>
          </div>

          {/* Rankings table */}
          <Card padding={0}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 20px', borderBottom:`1px solid ${T.hairline}` }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Full rankings</div>
                <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>Showing top 10, plus your group · {time}</div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <button style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, color:T.ink2, fontWeight:500, background:T.card, cursor:'pointer' }}>Sort: Band ↓</button>
                <button style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${T.border}`, fontSize:12, color:T.ink2, fontWeight:500, background:T.card, cursor:'pointer' }}>Friends only</button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'56px 1fr 80px 80px 90px 70px', padding:'10px 16px', fontSize:10, color:T.ink5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', borderBottom:`1px solid ${T.hairline}`, gap:8 }}>
              <div>Rank</div><div>Learner</div><div style={{ textAlign:'right' }}>Band</div><div style={{ textAlign:'center' }}>Δ Week</div><div style={{ textAlign:'right' }}>Activity</div><div></div>
            </div>
            {/* Top 10 */}
            {rows.slice(0,10).map(r => <LBRow key={r.rank} r={r}/>)}
            {/* Gap */}
            <div style={{ padding:'10px 20px', display:'flex', alignItems:'center', gap:10, color:T.ink5, fontSize:11.5, background:T.bg2, borderTop:`1px solid ${T.hairline}`, borderBottom:`1px solid ${T.hairline}` }}>
              <span style={{ flex:1, height:1, background:T.border }}/>
              · · · 478 places · · ·
              <span style={{ flex:1, height:1, background:T.border }}/>
            </div>
            {/* Your group */}
            {rows.slice(10).map(r => <LBRow key={r.rank} r={r}/>)}
            <div style={{ padding:'14px 20px', textAlign:'center' }}>
              <button data-nav="leaderboard" style={{ fontSize:12.5, color:T.brand, fontWeight:600, background:'transparent', cursor:'pointer' }}>Show all 26,420 ranks →</button>
            </div>
          </Card>

          {/* Country leaderboard */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginTop:18 }}>
            <Card padding={22}>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:12 }}>Top countries this week</div>
              {[
                { c:'🇯🇵', n:'Japan',   v:'8.21', count:'2,408 learners' },
                { c:'🇩🇪', n:'Germany', v:'8.04', count:'1,892 learners' },
                { c:'🇰🇷', n:'South Korea', v:'7.98', count:'1,654 learners' },
                { c:'🇪🇸', n:'Spain',   v:'7.72', count:'984 learners', user:true },
                { c:'🇫🇷', n:'France',  v:'7.65', count:'1,201 learners' },
              ].map((r,i) => (
                <div key={r.n} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<4?`1px solid ${T.hairline}`:'none' }}>
                  <div style={{ width:24, fontSize:11, color:T.ink4, fontWeight:600 }}>#{i+1}</div>
                  <div style={{ fontSize:18 }}>{r.c}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:r.user?700:600, color:T.ink }}>{r.n}{r.user && <span style={{ marginLeft:6, fontSize:10, color:T.brand, fontWeight:700 }}>· YOU</span>}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>{r.count}</div>
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{r.v}</div>
                </div>
              ))}
            </Card>
            <Card padding={22}>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink, marginBottom:12 }}>Friends</div>
              {[
                { n:'Sara Vega',     score:'7.8', d:'+0.2', user:false },
                { n:'Tom Müller',    score:'7.7', d:'+0.1', user:false },
                { n:'You',           score:'7.5', d:'+0.3', user:true  },
                { n:'Hana Lee',      score:'7.4', d:'',     user:false },
                { n:'Pedro Ortiz',   score:'6.9', d:'-0.1', user:false },
              ].map((r,i) => (
                <div key={r.n} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:9, background:r.user?T.brandLight:'transparent', marginBottom:i<4?2:0 }}>
                  <div style={{ width:28, height:28, borderRadius:14, background:r.user?T.brandGrad:T.bg2, color:r.user?'#fff':T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>{r.n[0]}</div>
                  <div style={{ flex:1, fontSize:13, fontWeight:r.user?700:500, color:T.ink }}>{r.n}</div>
                  <DeltaPill d={r.d}/>
                  <div style={{ fontFamily:T.serif, fontSize:16, color:r.user?T.brand:T.ink, marginLeft:10 }}>{r.score}</div>
                </div>
              ))}
              <div style={{ marginTop:12, padding:'10px 0 0', borderTop:`1px solid ${T.hairline}` }}>
                <Btn label="Find friends" variant="outline" accent={T.ink2} fullWidth size="sm" icon={Icon.users({width:13,height:13})}/>
              </div>
            </Card>
          </div>

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
function MLeaderboardPage() {
  const [tab, setTab] = useStateLB('Global');
  const [time, setTime] = useStateLB('Week');
  return (
    <MobileBody noTabs>
      <div style={{ padding:'14px 16px 8px' }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Rankings</div>
        <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05 }}>Leaderboard</div>
      </div>

      {/* Filter chips */}
      <div style={{ display:'flex', gap:6, padding:'8px 16px 4px', overflowX:'auto' }}>
        {['Global','Europe','Asia','Americas'].map(r => (
          <button key={r} onClick={() => setTab(r)} style={{ padding:'7px 12px', borderRadius:99, background:tab===r?T.ink:T.bg2, color:tab===r?'#fff':T.ink2, fontSize:11.5, fontWeight:tab===r?700:500, flexShrink:0 }}>{r}</button>
        ))}
      </div>
      <div style={{ display:'flex', gap:6, padding:'4px 16px 12px', overflowX:'auto' }}>
        {['Week','Month','All time'].map(t => (
          <button key={t} onClick={() => setTime(t)} style={{ padding:'5px 10px', borderRadius:7, background:time===t?T.brandLight:'transparent', color:time===t?T.brand:T.ink4, fontSize:11, fontWeight:time===t?700:500, flexShrink:0 }}>{t}</button>
        ))}
      </div>

      {/* Your card */}
      <div style={{ margin:'4px 16px', background:T.ink, borderRadius:16, padding:'18px 20px', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>Your rank</div>
            <div style={{ fontFamily:T.serif, fontSize:34, lineHeight:1 }}>#491</div>
            <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginTop:4 }}>Top 1.9% · ▲12 this week</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1 }}>7.5</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,.55)', marginTop:2 }}>Avg band</div>
          </div>
        </div>
      </div>

      {/* Podium (compact) */}
      <div style={{ margin:'14px 16px', padding:'18px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:14 }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14, textAlign:'center' }}>Top 3 this week</div>
        <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:160 }}>
          <PodiumCard entry={LB_TOP3[1]} place={2}/>
          <PodiumCard entry={LB_TOP3[0]} place={1}/>
          <PodiumCard entry={LB_TOP3[2]} place={3}/>
        </div>
      </div>

      {/* Compact list */}
      <div style={{ padding:'4px 16px 14px' }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', margin:'8px 4px' }}>Top 10</div>
        <Card padding={0}>
          {LB_ROWS.slice(0,8).map((r,i,a) => (
            <div key={r.rank} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderBottom:i<a.length-1?`1px solid ${T.hairline}`:'none' }}>
              <div style={{ width:30, fontSize:12, fontWeight:700, color:r.rank<=3?T.brand:T.ink4 }}>#{r.rank}</div>
              <div style={{ width:32, height:32, borderRadius:16, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>{r.name[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</div>
                <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>{r.country} · {r.streak}d</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink }}>{r.score}</div>
            </div>
          ))}
        </Card>

        <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 4px', color:T.ink5, fontSize:11 }}>
          <span style={{ flex:1, height:1, background:T.border }}/>
          478 ranks below
          <span style={{ flex:1, height:1, background:T.border }}/>
        </div>

        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', margin:'4px 4px 8px' }}>Around you</div>
        <Card padding={0}>
          {LB_ROWS.slice(10).map((r,i,a) => (
            <div key={r.rank} style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderBottom:i<a.length-1?`1px solid ${T.hairline}`:'none', background:r.user?T.brandLight:'transparent' }}>
              <div style={{ width:38, fontSize:12, fontWeight:r.user?700:500, color:r.user?T.brand:T.ink4 }}>#{r.rank}</div>
              <div style={{ width:32, height:32, borderRadius:16, background:r.user?T.brandGrad:T.bg2, color:r.user?'#fff':T.ink2, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>{r.name[0]}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:r.user?700:600, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</div>
                <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>{r.country} · {r.streak}d</div>
              </div>
              <DeltaPill d={r.delta}/>
              <div style={{ fontFamily:T.serif, fontSize:16, color:r.user?T.brand:T.ink, marginLeft:6 }}>{r.score}</div>
            </div>
          ))}
        </Card>

        <div style={{ marginTop:18 }}>
          <Btn label="Invite friends" accent={T.brand} fullWidth icon={Icon.users({width:13,height:13})}/>
        </div>
      </div>
    </MobileBody>
  );
}

Object.assign(window, { LeaderboardPage, MLeaderboardPage });
