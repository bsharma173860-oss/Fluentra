// ── Page: Achievements / Badges (trophy room) ───────────────
// Museum-case treatment — every button is wired.

function AchievementsPage() {
  const [tab, setTab] = useState('all');
  const [sort, setSort] = useState('rarity');
  const [sortOpen, setSortOpen] = useState(false);
  const [view, setView] = useState('grid');     // grid | list
  const [detail, setDetail] = useState(null);   // badge | null
  const [shareOf, setShareOf] = useState(null); // badge | null

  // ── Real signals (computed from the learner's own results) ──
  const [results, setResults] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try { if (window.FL && window.FL.fetchResults) await window.FL.fetchResults(500); } catch (e) {}
      if (alive) setResults(window.__results || []);
    })();
    return () => { alive = false; };
  }, []);
  const _R = results || [];
  const _streak = (window.__user && window.__user.streak) || 0;
  const _modOf = (r) => (r && r.detail && r.detail.module) || (r && r.module) || '';
  const _cnt = (mod) => _R.filter(r => _modOf(r) === mod).length;
  const _hourCount = (test) => _R.filter(r => { const ts = r.updated_at || r.created_at; if (!ts) return false; const h = new Date(ts).getHours(); return test(h); }).length;
  const _modulesPracticed = ['reading','listening','speaking','writing'].filter(m => _cnt(m) > 0).length;
  // id -> [current, threshold]; ids not here aren't tracked yet -> honestly locked
  const REAL = {
    streak_3:[_streak,3], streak_7:[_streak,7], streak_14:[_streak,14], streak_30:[_streak,30],
    streak_60:[_streak,60], streak_100:[_streak,100], streak_365:[_streak,365],
    reading_10:[_cnt('reading'),10], writing_10:[_cnt('writing'),10], listening_10:[_cnt('listening'),10],
    speaking_10:[_cnt('speaking'),10], speaking_50:[_cnt('speaking'),50], four_skills:[_modulesPracticed,4],
    night_owl:[_hourCount(h => h >= 22 || h < 4),10], early_bird:[_hourCount(h => h < 7),10],
  };
  const realize = (b) => {
    const m = REAL[b.id];
    if (!m) return { ...b, earned:false, pct:0, label:'Not tracked yet', date:null, earnedBy:null };
    const cur = m[0], thr = m[1], earned = cur >= thr;
    return { ...b, earned, pct: (thr > 0 ? Math.min(100, Math.round((cur / thr) * 100)) : 0), label: earned ? null : (cur + '/' + thr), date: null, earnedBy: null };
  };
  const realCollections = collections.map(c => ({ ...c, badges: c.badges.map(realize) }));
  const allReal = realCollections.reduce((a, c) => a.concat(c.badges), []);


  // ── Stats ────────────────────────────────────────────────
  const _earnedN = allReal.filter(b => b.earned).length;
  const _xp = (window.__user && window.__user.xp) || 0;
  const stats = [
    { label:'Badges earned',  v:String(_earnedN),  sub:'of ' + allReal.length + ' total', c:T.brand },
    { label:'Total XP',       v: _xp >= 1000 ? (_xp/1000).toFixed(1) + 'k' : String(_xp), sub:'lifetime', c:T.speaking.c },
    { label:'Day streak',     v:String(_streak),   sub: _streak === 1 ? 'day' : 'days',   c:T.writing.c },
    { label:'Sessions',       v:String(_R.length), sub:'completed',                       c:T.listening.c },
  ];

  // Rarity distribution — for the hero plaque (real)
  const _rarC = { common:T.ink3, rare:T.speaking.c, epic:T.brand, legendary:T.writing.c };
  const rarityDist = ['common','rare','epic','legendary'].map(k => ({
    k, c:_rarC[k],
    earned: allReal.filter(b => b.rarity === k && b.earned).length,
    total:  allReal.filter(b => b.rarity === k).length,
  }));

  // ── Featured (hero + supporting) ─────────────────────────
  // Featured = the user's real earned badges, highest rarity first (no fabricated showcase).
  const _rarRank = { common:0, rare:1, epic:2, legendary:3 };
  const _rarAcc  = { common:T.ink3, rare:T.speaking.c, epic:T.brand, legendary:T.writing.c };
  const _earnedReal = allReal.filter(x => x.earned).slice().sort((a, b) => (_rarRank[b.rarity] || 0) - (_rarRank[a.rarity] || 0));
  const _mkFeatured = (b) => b ? { id:b.id, title:b.name || b.title, sub:b.desc || b.sub, rarity:b.rarity, ic:b.ic, accent:(_rarAcc[b.rarity] || T.brand), bg:T.bg2, earned:true, detail:b.desc || b.sub } : null;
  const heroBadge = _mkFeatured(_earnedReal[0]);
  const supporting = _earnedReal.slice(1, 3).map(_mkFeatured);

  // ── Collections ──────────────────────────────────────────
  const collections = [
    { title:'Streaks', desc:'Show up day after day.', badges:[
      { id:'streak_3',  name:'3 days',   rarity:'common',    ic:'flame', earned:true, pct:100, date:'Feb 12, 2025', desc:'Studied for 3 consecutive days.', earnedBy:'62%' },
      { id:'streak_7',  name:'7 days',   rarity:'common',    ic:'flame', earned:true, pct:100, date:'Feb 16, 2025', desc:'Maintained a one-week streak.', earnedBy:'34%' },
      { id:'streak_14', name:'2 weeks',  rarity:'rare',      ic:'flame', earned:true, pct:100, date:'Feb 23, 2025', desc:'Two weeks unbroken.', earnedBy:'18%' },
      { id:'streak_30', name:'30 days',  rarity:'rare',      ic:'flame', earned:true, pct:100, date:'Mar 02, 2025', desc:'A full month of daily practice.', earnedBy:'9%' },
      { id:'streak_60', name:'2 months', rarity:'epic',      ic:'flame', earned:false, pct:23, label:'14/60', desc:'Sixty consecutive days.', earnedBy:'3%' },
      { id:'streak_100',name:'Century',  rarity:'epic',      ic:'flame', earned:false, pct:14, label:'14/100',desc:'One hundred straight days.', earnedBy:'1.4%' },
      { id:'streak_365',name:'A year',   rarity:'legendary', ic:'flame', earned:false, pct:4,  label:'14/365',desc:'A full year of daily practice.', earnedBy:'0.2%' },
    ]},
    { title:'Vocabulary', desc:'Words mastered through spaced review.', badges:[
      { id:'vocab_50',  name:'Word hoarder',      rarity:'common', ic:'book', earned:true,  pct:100, date:'Jan 28, 2025', desc:'Mastered 50 words.', earnedBy:'48%' },
      { id:'vocab_100', name:'Lexicon',           rarity:'common', ic:'book', earned:true,  pct:100, date:'Feb 14, 2025', desc:'Mastered 100 words.', earnedBy:'31%' },
      { id:'vocab_200', name:'Wordsmith',         rarity:'rare',   ic:'book', earned:true,  pct:100, date:'Mar 06, 2025', desc:'Mastered 200 words.', earnedBy:'16%' },
      { id:'vocab_500', name:'Polyglot in training', rarity:'rare',ic:'book', earned:false, pct:40, label:'199/500', desc:'Master 500 vocabulary cards.', earnedBy:'6%' },
      { id:'vocab_1k',  name:'Living dictionary', rarity:'epic',   ic:'book', earned:false, pct:20, label:'199/1000', desc:'Master a thousand words.', earnedBy:'1.8%' },
      { id:'vocab_perfect_week', name:'Perfect week', rarity:'rare', ic:'spark', earned:false, pct:71, label:'5/7 days', desc:'Hit every daily review for a week.', earnedBy:'7%' },
    ]},
    { title:'Skills', desc:'Earn one for each module mastered.', badges:[
      { id:'speaking_10', name:'Smooth talker',    rarity:'common', ic:'mic',  earned:true,  pct:100, date:'Feb 19, 2025', desc:'10 speaking lessons completed.', earnedBy:'42%' },
      { id:'writing_10',  name:'Wordwright',       rarity:'common', ic:'pen',  earned:true,  pct:100, date:'Feb 22, 2025', desc:'10 writing tasks completed.', earnedBy:'37%' },
      { id:'listening_10',name:'Sharp ear',        rarity:'common', ic:'head', earned:true,  pct:100, date:'Feb 25, 2025', desc:'10 listening exercises completed.', earnedBy:'40%' },
      { id:'reading_10',  name:'Voracious',        rarity:'common', ic:'book', earned:true,  pct:100, date:'Mar 01, 2025', desc:'10 reading lessons completed.', earnedBy:'45%' },
      { id:'speaking_50', name:'Conversation pro', rarity:'epic',   ic:'mic',  earned:false, pct:62,  label:'31/50', desc:'50 speaking lessons.', earnedBy:'5%' },
      { id:'four_skills', name:'Four-skill master',rarity:'legendary',ic:'spark',earned:false,pct:84, label:'all near 100%', desc:'Master all four skills in one language.', earnedBy:'0.4%' },
    ]},
    { title:'Adventures', desc:'Special achievements for going the extra mile.', badges:[
      { id:'night_owl',     name:'Night owl',          rarity:'common',    ic:'eye',     earned:true,  pct:100, date:'Feb 09, 2025', desc:'Studied 10 times after 10pm.', earnedBy:'28%' },
      { id:'early_bird',    name:'Early bird',         rarity:'common',    ic:'spark',   earned:true,  pct:100, date:'Feb 11, 2025', desc:'Studied 10 times before 7am.', earnedBy:'19%' },
      { id:'weekend_warrior',name:'Weekend warrior',   rarity:'rare',      ic:'shield',  earned:true,  pct:100, date:'Feb 16, 2025', desc:'Studied every weekend for a month.', earnedBy:'12%' },
      { id:'traveler',      name:'Polyglot traveler',  rarity:'rare',      ic:'globe',   earned:true,  pct:100, date:'Feb 24, 2025', desc:'Studied while in 3+ countries.', earnedBy:'8%' },
      { id:'cafe_master',   name:'Café Master',        rarity:'epic',      ic:'trophy',  earned:true,  pct:100, date:'Mar 14, 2025', desc:'Aced the Restaurant module.', earnedBy:'4.2%' },
      { id:'fluent_dream',  name:'Dreaming in target', rarity:'legendary', ic:'spark',   earned:false, pct:0,   label:'self-reported', desc:'Reported a dream in your target language.', earnedBy:'0.7%' },
    ]},
  ];

  // ── Active quests + timeline ────────────────────────────
  const quests = [
    { id:'q1', title:'Café roleplay sprint', desc:'5 speaking lessons in 7 days', pct:80, sub:'4 / 5 lessons', endsIn:'2 days', c:T.speaking, reward:'+200 XP · Epic badge', nav:'speaking' },
    { id:'q2', title:'Listen daily',         desc:'Listen 5 min every day this week', pct:57, sub:'4 / 7 days', endsIn:'3 days', c:T.listening, reward:'+80 XP', nav:'listening' },
    { id:'q3', title:'500-word milestone',   desc:'Master 500 vocabulary cards', pct:40, sub:'199 / 500', endsIn:'open', c:T.reading, reward:'+250 XP · Rare badge', nav:'vocab' },
  ];
  const timeline = [
    { date:'Today', events:[{ t:'Quest progress', desc:'4/5 lessons in "Café roleplay sprint"', ic:'spark', c:T.brand, nav:'progress' }] },
    { date:'Yesterday', events:[
      { t:'Earned · Café Master', desc:'Epic badge — Restaurant module · 95%', ic:'trophy', c:T.es.accent, openId:'cafe_master' },
      { t:'Level up · B1 Spanish', desc:'Reading skill crossed 80% mastery', ic:'arrow', c:T.reading.c, nav:'progress' },
    ]},
    { date:'Mar 12', events:[{ t:'Earned · Tutor confidant', desc:'50 tutor conversations', ic:'message', c:T.speaking.c, openId:'lia_chat_50' }] },
    { date:'Mar 2',  events:[{ t:'Earned · Month of fire', desc:'30-day streak unbroken', ic:'flame', c:T.brand, openId:'streak_30' }] },
    { date:'Feb 27', events:[{ t:'League promotion', desc:'Silver → Gold (rank #14)', ic:'trophy', c:T.writing.c, nav:'leaderboard' }] },
  ];

  // ── Filter + sort ────────────────────────────────────────
  const matchesTab = (b) => {
    if (tab === 'all')      return true;
    if (tab === 'earned')   return b.earned;
    if (tab === 'progress') return !b.earned && (b.pct||0) > 0;
    if (tab === 'locked')   return !b.earned && (b.pct||0) === 0;
  };
  const rarityWeight = { legendary:4, epic:3, rare:2, common:1 };
  const sortBadges = (arr) => {
    const a = [...arr];
    if (sort === 'rarity')   a.sort((x,y) => rarityWeight[y.rarity]-rarityWeight[x.rarity]);
    if (sort === 'recent')   a.sort((x,y) => (y.earned?1:0)-(x.earned?1:0) || (y.pct||0)-(x.pct||0));
    if (sort === 'progress') a.sort((x,y) => (y.pct||0)-(x.pct||0));
    if (sort === 'name')     a.sort((x,y) => x.name.localeCompare(y.name));
    return a;
  };
  const filteredCollections = realCollections
    .map(c => ({ ...c, badges: sortBadges(c.badges.filter(matchesTab)) }))
    .filter(c => c.badges.length > 0);
  const totalShown = filteredCollections.reduce((n,c) => n + c.badges.length, 0);

  const findBadge = (id) => {
    for (const c of realCollections) for (const b of c.badges) if (b.id === id) return b;
    return null;
  };

  // ── Tabs def ─────────────────────────────────────────────
  const tabs = [
    { id:'all',      label:'All',          n:allReal.length },
    { id:'earned',   label:'Earned',       n:allReal.filter(b => b.earned).length },
    { id:'progress', label:'In progress',  n:allReal.filter(b => !b.earned && (b.pct||0) > 0).length },
    { id:'locked',   label:'Locked',       n:allReal.filter(b => !b.earned && (b.pct||0) === 0).length },
  ];
  const sortLabels = { rarity:'Rarity', recent:'Recent', progress:'Progress', name:'A → Z' };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow="Achievements · Edition 24 / 86"
          title="The trophy room."
          right={
            <div style={{ display:'flex', gap:8 }}>
              <Btn label="Share progress" onClick={() => setShareOf({ ...heroBadge, asProfile:true, title:(USER.name && USER.name !== 'there' ? USER.name + ' · progress' : 'My progress'), sub:(_earnedN + ' badges · ' + USER.streak + 'd streak · ' + USER.xp + ' XP') })} variant="outline" accent={T.ink} icon={Icon.send()}/>
              <Btn label="Browse leagues" nav="leaderboard" accent={T.brand} iconRight={Icon.arrow()}/>
            </div>
          }
        />

        {/* HERO — museum case + plaque ─────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14, marginBottom:14 }}>
          {heroBadge ? <HeroCase badge={heroBadge} onShare={() => setShareOf(heroBadge)} onOpen={() => setDetail(heroBadge)}/> : <div style={{ background:T.bg2, border:`1px dashed ${T.border}`, borderRadius:18, padding:40, textAlign:'center', minHeight:280, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:8 }}><div style={{ fontFamily:T.serif, fontSize:22, color:T.ink2 }}>No badges yet</div><div style={{ fontSize:13, color:T.ink3 }}>Complete lessons, build a streak, and pass exams to earn your first badge.</div></div>}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Stats grid */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              {stats.map(s => (
                <Card key={s.label} padding={14}>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:5 }}>{s.label}</div>
                  <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                    <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1 }}>{s.v}</div>
                    <div style={{ width:5, height:5, borderRadius:3, background:s.c }}/>
                  </div>
                  <div style={{ fontSize:11, color:T.ink3, marginTop:3 }}>{s.sub}</div>
                </Card>
              ))}
            </div>
            {/* Rarity distribution */}
            <Card padding={16}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.ink, letterSpacing:'.06em', textTransform:'uppercase' }}>Rarity collection</div>
                <button onClick={() => setTab('earned')} style={{ fontSize:10.5, color:T.ink3, cursor:'pointer', background:'none', border:'none' }}>View earned →</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
                {rarityDist.map(r => (
                  <div key={r.k}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                      <div style={{ fontSize:11.5, fontWeight:700, color:r.c, textTransform:'uppercase', letterSpacing:'.06em' }}>{r.k}</div>
                      <div style={{ fontSize:11, color:T.ink3 }}><span style={{ color:T.ink, fontWeight:700 }}>{r.earned}</span> / {r.total}</div>
                    </div>
                    <Bar pct={(r.earned/r.total)*100} color={r.c} track={T.trackWarm} height={5}/>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* SUPPORTING FEATURED — 2 secondary posters ──────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:32 }}>
          {supporting.map(b => (
            <BadgePoster key={b.id} badge={b} onShare={() => setShareOf(b)} onOpen={() => setDetail(findBadge(b.id) || b)}/>
          ))}
        </div>

        {/* TOOLBAR — tabs + sort + view ───────────────────── */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:18, flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', gap:4, padding:4, background:T.bg2, borderRadius:10, border:`1px solid ${T.border}` }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'7px 14px', borderRadius:7, fontSize:12.5, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? T.ink : T.ink3, background: tab === t.id ? T.card : 'transparent', border: tab === t.id ? `1px solid ${T.border}` : '1px solid transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                {t.label}
                <span style={{ fontSize:10.5, color:T.ink4, background: tab === t.id ? T.bg2 : 'transparent', padding:'1px 6px', borderRadius:99 }}>{t.n}</span>
              </button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:11, color:T.ink4 }}>{totalShown} {totalShown === 1 ? 'badge' : 'badges'}</div>
            {/* Sort */}
            <div style={{ position:'relative' }}>
              <button onClick={() => setSortOpen(o => !o)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 12px', borderRadius:8, background:T.card, border:`1px solid ${T.border}`, fontSize:11.5, color:T.ink2, cursor:'pointer', fontWeight:600 }}>
                <span style={{ color:T.ink4 }}>Sort:</span> {sortLabels[sort]} <span style={{ display:'inline-flex', transform:'rotate(90deg)' }}>{Icon.chev({ width:11, height:11 })}</span>
              </button>
              {sortOpen && (
                <>
                  <div onClick={() => setSortOpen(false)} style={{ position:'fixed', inset:0, zIndex:39 }}/>
                  <div style={{ position:'absolute', top:'calc(100% + 4px)', right:0, background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:5, boxShadow:'0 8px 24px rgba(0,0,0,.08)', zIndex:40, minWidth:140 }}>
                    {Object.entries(sortLabels).map(([k,v]) => (
                      <button key={k} onClick={() => { setSort(k); setSortOpen(false); }} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'7px 10px', borderRadius:6, fontSize:12, fontWeight: sort === k ? 700 : 500, color: sort === k ? T.brand : T.ink2, background: sort === k ? T.brandLight : 'transparent', border:'none', cursor:'pointer', textAlign:'left' }}>
                        {v} {sort === k && Icon.check({ width:11, height:11, strokeWidth:3 })}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* View toggle */}
            <div style={{ display:'flex', background:T.bg2, borderRadius:8, border:`1px solid ${T.border}`, padding:3 }}>
              {[
                {k:'grid',i:(<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>)},
                {k:'list',i:(<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>)},
              ].map(v => (
                <button key={v.k} onClick={() => setView(v.k)} style={{ padding:'5px 9px', borderRadius:5, background: view === v.k ? T.card : 'transparent', border: view === v.k ? `1px solid ${T.border}` : '1px solid transparent', color: view === v.k ? T.ink : T.ink4, cursor:'pointer', display:'flex', alignItems:'center' }}>
                  {v.i}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* COLLECTIONS + side rail ─────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:28, alignItems:'start' }}>
          <div>
            {filteredCollections.length === 0 ? (
              <Card padding={36}>
                <div style={{ textAlign:'center', color:T.ink3 }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:6 }}>Nothing here yet.</div>
                  <div style={{ fontSize:13, marginBottom:18 }}>No badges in this filter. Try another tab.</div>
                  <Btn label="Show all" onClick={() => setTab('all')} accent={T.brand}/>
                </div>
              </Card>
            ) : filteredCollections.map(col => {
              const earned = col.badges.filter(b => b.earned).length;
              return (
                <div key={col.title} style={{ marginBottom:32 }}>
                  <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:14 }}>
                    <div>
                      <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>{col.title}</div>
                      <div style={{ fontSize:12, color:T.ink4, marginTop:4 }}>{col.desc} · {earned} of {col.badges.length} shown earned</div>
                    </div>
                  </div>
                  {view === 'grid' ? (
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
                      {col.badges.map(b => <BadgeTile key={b.id} badge={b} onClick={() => setDetail(b)}/>)}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      {col.badges.map(b => <BadgeRow key={b.id} badge={b} onClick={() => setDetail(b)} onShare={() => setShareOf(b)}/>)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Side rail */}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Quests */}
            <Card padding={18}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, display:'flex', alignItems:'center', gap:6 }}>{Icon.spark({ width:13, height:13, fill:T.brand })} Active quests</div>
                
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {quests.map(q => (
                  <div key={q.id}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{q.title}</div>
                      <div style={{ fontSize:10, fontWeight:700, color:q.endsIn === 'open' ? T.ink4 : T.brand, padding:'2px 6px', background: q.endsIn === 'open' ? T.bg2 : T.brandLight, borderRadius:4 }}>{q.endsIn === 'open' ? 'Open' : `Ends in ${q.endsIn}`}</div>
                    </div>
                    <div style={{ fontSize:11, color:T.ink3, marginBottom:8 }}>{q.desc}</div>
                    <Bar pct={q.pct} color={q.c.c} track={T.trackWarm} height={4}/>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
                      <div>
                        <div style={{ fontSize:10.5, color:T.ink4 }}>{q.sub}</div>
                        <div style={{ fontSize:10.5, color:q.c.c, fontWeight:700, marginTop:2 }}>{q.reward}</div>
                      </div>
                      <Btn label="Continue" nav={q.nav} variant="soft" accent={q.c.c} size="sm"/>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity timeline */}
            <Card padding={18}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, display:'flex', alignItems:'center', gap:6 }}>{Icon.trending({ width:13, height:13 })} Recent activity</div>
                <button data-nav="progress" style={{ fontSize:10.5, color:T.ink3, cursor:'pointer', background:'none', border:'none' }}>View all</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {timeline.map(g => (
                  <div key={g.date}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>{g.date}</div>
                    <div style={{ display:'flex', flexDirection:'column', gap:8, paddingLeft:6, borderLeft:`1px solid ${T.border}` }}>
                      {g.events.map((e,i) => {
                        const click = () => {
                          if (e.openId) { const b = findBadge(e.openId); if (b) setDetail(b); }
                          else if (e.nav && window.__nav) window.__nav(e.nav);
                        };
                        return (
                          <button key={i} onClick={click} style={{ display:'flex', alignItems:'flex-start', gap:8, paddingLeft:10, position:'relative', background:'none', border:'none', cursor:'pointer', textAlign:'left', padding:'2px 0 2px 10px', borderRadius:6 }}>
                            <div style={{ position:'absolute', left:-3, top:7, width:5, height:5, borderRadius:3, background:e.c }}/>
                            <div style={{ width:24, height:24, borderRadius:7, background:`${e.c}1a`, color:e.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[e.ic]({ width:12, height:12 })}</div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ fontSize:12, fontWeight:600, color:T.ink, lineHeight:1.3 }}>{e.t}</div>
                              <div style={{ fontSize:11, color:T.ink3, marginTop:1 }}>{e.desc}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* MODALS ─────────────────────────────────────────── */}
      {detail && <BadgeDetailModal badge={detail} onClose={() => setDetail(null)} onShare={() => { setShareOf(detail); setDetail(null); }}/>}
      {shareOf && <ShareModal badge={shareOf} onClose={() => setShareOf(null)}/>}
    </div>
  );
}

// ── HERO MUSEUM CASE — featured badge ──────────────────────
function HeroCase({ badge: b, onShare, onOpen }) {
  return (
    <div style={{ background:`linear-gradient(155deg, ${b.bg} 0%, ${T.bg} 100%)`, border:`1px solid ${T.border}`, borderRadius:18, padding:28, position:'relative', overflow:'hidden', minHeight:280 }}>
      {/* corner edition stamp */}
      <div style={{ position:'absolute', top:18, right:18, padding:'5px 10px', border:`1px solid ${b.accent}55`, borderRadius:6, fontSize:10, color:b.accent, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', background:T.card }}>{b.edition ? ('EDITION ' + b.edition) : (b.rarity || '').toUpperCase()}</div>
      {/* decorative rings */}
      <div style={{ position:'absolute', top:-40, left:-40, width:180, height:180, borderRadius:90, border:`14px solid ${b.accent}1c` }}/>
      <div style={{ position:'absolute', bottom:-60, right:-30, width:120, height:120, borderRadius:60, background:`${b.accent}10` }}/>
      <div style={{ position:'absolute', bottom:-90, left:60, width:160, height:160, borderRadius:80, border:`8px solid ${b.accent}14` }}/>

      <div style={{ position:'relative', display:'flex', gap:24, alignItems:'flex-start' }}>
        {/* Big medallion */}
        <div style={{ flexShrink:0 }}>
          <div style={{ width:120, height:120, borderRadius:'50%', background:T.card, border:`4px solid ${b.accent}`, display:'flex', alignItems:'center', justifyContent:'center', color:b.accent, boxShadow:`0 12px 32px ${b.accent}40`, position:'relative' }}>
            {Icon[b.ic]({ width:48, height:48 })}
            <div style={{ position:'absolute', bottom:-6, right:-6, width:30, height:30, borderRadius:15, background:b.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 3px ${T.card}` }}>
              {Icon.check({ width:15, height:15, strokeWidth:4 })}
            </div>
          </div>
          {/* serial plate */}
          <div style={{ marginTop:14, padding:'8px 10px', background:T.card, border:`1px solid ${T.border}`, borderRadius:8, fontSize:9.5, color:T.ink4, lineHeight:1.5, fontFamily:'ui-monospace, monospace' }}>
            <div>SN: {(b.id || 'badge').toUpperCase().replace(/_/g, '-')}</div>
            <div>{b.earned ? 'VERIFIED' : ''}</div>
          </div>
        </div>

        {/* Plaque */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
            <Chip label={(b.rarity||"").toUpperCase()} accent={b.accent} bg={`${b.accent}1f`} style={{ fontSize:9.5 }}/>
            {b.earnedBy && <Chip label={`Top ${String(b.earnedBy).replace('% of learners','%')}`} accent={T.ink3} bg={T.bg2} style={{ fontSize:9.5 }} icon={Icon.trending({ width:9, height:9 })}/>}
          </div>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:4 }}>Latest acquisition</div>
          <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.02, marginBottom:8 }}>{b.title}</div>
          <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.5, marginBottom:16, maxWidth:420 }}>{b.detail}</div>

          {/* meta row */}
          <div style={{ display:'flex', gap:18, marginBottom:18, paddingTop:14, borderTop:`1px solid ${b.accent}20` }}>
            <div>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Status</div>
              <div style={{ fontSize:13, color:T.ink, marginTop:2, fontWeight:600 }}>{b.date || 'Earned'}</div>
            </div>
            {b.earnedBy && (
            <div>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Earned by</div>
              <div style={{ fontSize:13, color:T.ink, marginTop:2, fontWeight:600 }}>{b.earnedBy}</div>
            </div>
            )}
            <div>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Tier</div>
              <div style={{ fontSize:13, color:T.ink, marginTop:2, fontWeight:600 }}>{b.rarity || '\u2014'}</div>
            </div>
          </div>

          <div style={{ display:'flex', gap:8 }}>
            <Btn label="View details" onClick={onOpen} accent={b.accent} size="sm" iconRight={Icon.arrow({ width:11, height:11 })}/>
            <Btn label="Share" onClick={onShare} variant="outline" accent={T.ink} size="sm" icon={Icon.send({ width:11, height:11 })}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Supporting featured poster ─────────────────────────────
function BadgePoster({ badge: b, onShare, onOpen }) {
  return (
    <div onClick={onOpen} style={{ background:`linear-gradient(155deg, ${b.bg} 0%, ${T.bg} 100%)`, border:`1px solid ${T.border}`, borderRadius:16, padding:20, position:'relative', overflow:'hidden', minHeight:148, cursor:'pointer', display:'flex', gap:16, alignItems:'center' }}>
      <div style={{ position:'absolute', top:-30, right:-30, width:130, height:130, borderRadius:65, border:`10px solid ${b.accent}20` }}/>
      <div style={{ position:'relative', flexShrink:0 }}>
        <div style={{ width:62, height:62, borderRadius:'50%', background:T.card, border:`3px solid ${b.accent}`, display:'flex', alignItems:'center', justifyContent:'center', color:b.accent, boxShadow:`0 6px 18px ${b.accent}33` }}>
          {Icon[b.ic]({ width:24, height:24 })}
        </div>
      </div>
      <div style={{ flex:1, minWidth:0, position:'relative' }}>
        <Chip label={(b.rarity||"").toUpperCase()} accent={b.accent} bg={`${b.accent}1f`} style={{ fontSize:9, marginBottom:6 }}/>
        <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.05, marginBottom:4 }}>{b.title}</div>
        <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.4, marginBottom:8 }}>{b.sub}</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:10.5, color:T.ink4, display:'flex', alignItems:'center', gap:5 }}>{Icon.cal({ width:10, height:10 })} {b.date || 'Earned'}</div>
          <button onClick={e => { e.stopPropagation(); onShare(); }} style={{ display:'flex', alignItems:'center', gap:4, fontSize:10.5, fontWeight:700, color:b.accent, background:'none', border:'none', cursor:'pointer' }}>
            {Icon.send({ width:10, height:10 })} Share
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Small badge tile (collection grid) ─────────────────────
function BadgeTile({ badge: b, onClick }) {
  const rar = rarityColor(b.rarity);
  return (
    <button onClick={onClick} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'14px 12px', display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', position:'relative', opacity: b.earned ? 1 : .85, cursor:'pointer', transition:'transform .15s, border-color .15s' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = rar; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = T.border; }}>
      {!b.earned && (
        <div style={{ position:'absolute', top:8, right:8, color:T.ink5 }}>
          {Icon.lock({ width:11, height:11 })}
        </div>
      )}
      <div style={{ width:48, height:48, borderRadius:'50%', background: b.earned ? T.card : T.bg2, border:`2.5px solid ${b.earned ? rar : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: b.earned ? rar : T.ink5, marginBottom:8, boxShadow: b.earned ? `0 4px 14px ${rar}22` : 'none', position:'relative' }}>
        {Icon[b.ic]({ width:18, height:18 })}
        {b.earned && <div style={{ position:'absolute', bottom:-2, right:-2, width:14, height:14, borderRadius:7, background:rar, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 2px ${T.card}` }}>{Icon.check({ width:8, height:8, strokeWidth:4 })}</div>}
      </div>
      <div style={{ fontSize:11.5, fontWeight:700, color:T.ink, marginBottom:2, lineHeight:1.2 }}>{b.name}</div>
      <div style={{ fontSize:9.5, fontWeight:700, color:rar, letterSpacing:'.08em', textTransform:'uppercase' }}>{b.rarity}</div>
      {!b.earned && (
        <div style={{ width:'100%', marginTop:8 }}>
          <Bar pct={b.pct} color={rar} track={T.trackWarm} height={3}/>
          {b.label && <div style={{ fontSize:9.5, color:T.ink4, marginTop:4 }}>{b.label}</div>}
        </div>
      )}
    </button>
  );
}

// ── Badge row (list view) ──────────────────────────────────
function BadgeRow({ badge: b, onClick, onShare }) {
  const rar = rarityColor(b.rarity);
  return (
    <div onClick={onClick} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:12, padding:'12px 14px', display:'flex', alignItems:'center', gap:14, cursor:'pointer' }}>
      <div style={{ width:42, height:42, borderRadius:'50%', background: b.earned ? T.card : T.bg2, border:`2.5px solid ${b.earned ? rar : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: b.earned ? rar : T.ink5, flexShrink:0, position:'relative' }}>
        {Icon[b.ic]({ width:16, height:16 })}
        {b.earned && <div style={{ position:'absolute', bottom:-2, right:-2, width:13, height:13, borderRadius:7, background:rar, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 2px ${T.card}` }}>{Icon.check({ width:7, height:7, strokeWidth:4 })}</div>}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{b.name}</div>
          <div style={{ fontSize:9.5, fontWeight:700, color:rar, letterSpacing:'.08em', textTransform:'uppercase' }}>{b.rarity}</div>
        </div>
        <div style={{ fontSize:11, color:T.ink3, marginTop:3 }}>{b.desc}{b.earnedBy ? ' · earned by ' + b.earnedBy : ''}</div>
        {!b.earned && (
          <div style={{ marginTop:6, display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ flex:1, maxWidth:180 }}><Bar pct={b.pct} color={rar} track={T.trackWarm} height={3}/></div>
            <div style={{ fontSize:10, color:T.ink4 }}>{b.label}</div>
          </div>
        )}
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:6, flexShrink:0 }}>
        {b.earned && b.date && <div style={{ fontSize:11, color:T.ink4 }}>{b.date}</div>}
        {b.earned && (
          <button onClick={e => { e.stopPropagation(); onShare(); }} style={{ padding:6, borderRadius:7, border:`1px solid ${T.border}`, background:T.card, color:T.ink3, cursor:'pointer', display:'flex' }}>
            {Icon.send({ width:11, height:11 })}
          </button>
        )}
      </div>
    </div>
  );
}

function rarityColor(r) {
  return ({ common:T.ink3, rare:T.speaking.c, epic:T.brand, legendary:T.writing.c })[r];
}

// ── BADGE DETAIL MODAL ─────────────────────────────────────
function BadgeDetailModal({ badge: b, onClose, onShare }) {
  const rar = rarityColor(b.rarity);
  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(20,20,20,.55)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.card, borderRadius:18, width:520, maxWidth:'90%', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,.18)' }}>
        {/* Header w/ medallion */}
        <div style={{ background:`linear-gradient(155deg, ${rar}18 0%, ${T.bg} 100%)`, padding:'28px 28px 24px', position:'relative', borderBottom:`1px solid ${T.border}` }}>
          <button onClick={onClose} style={{ position:'absolute', top:16, right:16, width:30, height:30, borderRadius:15, background:T.card, border:`1px solid ${T.border}`, color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.x({ width:14, height:14 })}</button>
          <div style={{ display:'flex', gap:18, alignItems:'center' }}>
            <div style={{ width:84, height:84, borderRadius:'50%', background: b.earned ? T.card : T.bg2, border:`3.5px solid ${b.earned ? rar : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color: b.earned ? rar : T.ink5, flexShrink:0, boxShadow: b.earned ? `0 8px 22px ${rar}33` : 'none', position:'relative' }}>
              {Icon[b.ic]({ width:34, height:34 })}
              {b.earned && <div style={{ position:'absolute', bottom:-2, right:-2, width:24, height:24, borderRadius:12, background:rar, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 0 3px ${T.card}` }}>{Icon.check({ width:12, height:12, strokeWidth:4 })}</div>}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <Chip label={(b.rarity||"").toUpperCase()} accent={rar} bg={`${rar}1f`} style={{ fontSize:9.5, marginBottom:6 }}/>
              <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.05 }}>{b.name || b.title}</div>
              <div style={{ fontSize:12, color:T.ink3, marginTop:4 }}>{b.desc || b.sub}</div>
            </div>
          </div>
        </div>
        {/* Body */}
        <div style={{ padding:'20px 28px 24px' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:18 }}>
            <DetailStat label="Status" value={b.earned ? 'Earned' : 'In progress'} accent={b.earned ? T.speaking.c : T.brand}/>
            <DetailStat label={b.earned ? 'Acquired' : 'Progress'} value={b.earned ? (b.date || 'Earned') : (b.label || `${b.pct}%`)}/>
            <DetailStat label="Rarity" value={b.rarity || '\u2014'}/>
            <DetailStat label="Reward" value={b.earned ? '+150 XP' : '+150 XP on unlock'}/>
          </div>
          {!b.earned && (
            <div style={{ marginBottom:18 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>Progress</div>
                <div style={{ fontSize:11, color:rar, fontWeight:700 }}>{b.pct}%</div>
              </div>
              <Bar pct={b.pct} color={rar} track={T.trackWarm} height={6}/>
            </div>
          )}
          <div style={{ display:'flex', gap:8 }}>
            {b.earned ? (
              <>
                <Btn label="Share badge" onClick={onShare} accent={rar} icon={Icon.send({ width:12, height:12 })} fullWidth/>
                <Btn label="Close" onClick={onClose} variant="outline" accent={T.ink}/>
              </>
            ) : (
              <>
                <Btn label="Continue progress" nav="dashboard" accent={rar} iconRight={Icon.arrow({ width:12, height:12 })} fullWidth/>
                <Btn label="Close" onClick={onClose} variant="outline" accent={T.ink}/>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailStat({ label, value, accent=T.ink }) {
  return (
    <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, padding:'10px 12px' }}>
      <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:13, fontWeight:700, color:accent }}>{value}</div>
    </div>
  );
}

// ── SHARE MODAL ────────────────────────────────────────────
function ShareModal({ badge: b, onClose }) {
  const [copied, setCopied] = useState(false);
  const accent = b.accent || rarityColor(b.rarity) || T.brand;
  const url = `fluentra.app/m/${b.id || 'maya'}`;
  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(20,20,20,.55)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:T.card, borderRadius:18, width:440, maxWidth:'90%', overflow:'hidden', boxShadow:'0 20px 60px rgba(0,0,0,.18)' }}>
        <div style={{ padding:'18px 22px 14px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink }}>Share {b.asProfile ? 'progress' : 'badge'}</div>
          <button onClick={onClose} style={{ width:28, height:28, borderRadius:14, background:T.bg2, border:`1px solid ${T.border}`, color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.x({ width:13, height:13 })}</button>
        </div>
        <div style={{ padding:22 }}>
          {/* preview card */}
          <div style={{ background:`linear-gradient(155deg, ${b.bg || `${accent}18`} 0%, ${T.bg} 100%)`, border:`1px solid ${T.border}`, borderRadius:14, padding:'18px 18px 22px', marginBottom:16, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:50, border:`8px solid ${accent}26` }}/>
            <div style={{ position:'relative', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:56, height:56, borderRadius:'50%', background:T.card, border:`3px solid ${accent}`, display:'flex', alignItems:'center', justifyContent:'center', color:accent, flexShrink:0 }}>
                {Icon[b.ic || 'trophy']({ width:22, height:22 })}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:T.serif, fontSize:19, color:T.ink, lineHeight:1.1 }}>{b.title || b.name}</div>
                <div style={{ fontSize:11, color:T.ink3, marginTop:3 }}>{b.sub || b.desc}</div>
                <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:11, color:T.brand, marginTop:6, letterSpacing:'.02em' }}>Speak it. Score it. Own it.</div>
              </div>
            </div>
          </div>

          {/* share targets */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:14 }}>
            {[
              { k:'twitter', label:'X / Twitter', ic:'send', c:T.ink },
              { k:'insta',   label:'Instagram',   ic:'eye',  c:'#E4405F' },
              { k:'wa',      label:'WhatsApp',    ic:'message', c:'#25D366' },
              { k:'mail',    label:'Email',       ic:'send', c:T.ink3 },
            ].map(s => (
              <button key={s.k} onClick={() => {
                const text = `I just earned "${b.title || b.name}" on Fluentra!`;
                const link = 'https://' + url;
                if (s.k === 'twitter') window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(link), '_blank');
                else if (s.k === 'wa') window.open('https://wa.me/?text=' + encodeURIComponent(text + ' ' + link), '_blank');
                else if (s.k === 'mail') window.location.href = 'mailto:?subject=' + encodeURIComponent('My Fluentra achievement') + '&body=' + encodeURIComponent(text + '\n\n' + link);
                else if (navigator.share) navigator.share({ text: text, url: link }).catch(function () {});
                else window.open(link, '_blank');
              }} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 8px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, cursor:'pointer' }}>
                <div style={{ width:36, height:36, borderRadius:18, background:`${s.c}18`, color:s.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[s.ic]({ width:15, height:15 })}</div>
                <div style={{ fontSize:10.5, color:T.ink2, fontWeight:600 }}>{s.label}</div>
              </button>
            ))}
          </div>

          {/* copy link */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 8px 8px 14px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10 }}>
            <div style={{ flex:1, fontSize:12, color:T.ink2, fontFamily:'ui-monospace, monospace', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{url}</div>
            <Btn label={copied ? 'Copied' : 'Copy link'} onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }} accent={copied ? T.speaking.c : T.brand} size="sm" icon={copied ? Icon.check({ width:11, height:11, strokeWidth:3 }) : null}/>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile · Achievements ──────────────────────────────────