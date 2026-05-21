// ── Page: Friends / Social ───────────────────────────────────
// Three-column: feed (center), friends list (left), discover/clubs (right)

function FriendsPage() {
  const [tab, setTab] = useState('feed');

  const friends = [
    { name:'Aiko T.',     lang:'ja', streak:178, online:true,  status:'Just finished N3 Reading · 92%', initial:'A', accent:T.ja.accent },
    { name:'Lukas B.',    lang:'de', streak:142, online:true,  status:'Working on B2 essay structure',   initial:'L', accent:T.de.accent },
    { name:'Léa D.',      lang:'fr', streak:74,  online:false, status:'Last seen 2h ago',                 initial:'L', accent:T.fr.accent },
    { name:'Carlos M.',   lang:'es', streak:51,  online:true,  status:'On Café Master · level 4',         initial:'C', accent:T.es.accent },
    { name:'Olivia B.',   lang:'en', streak:99,  online:false, status:'IELTS in 18 days',                  initial:'O', accent:T.en.accent },
    { name:'Hiroshi S.',  lang:'ja', streak:115, online:false, status:'Last seen yesterday',                initial:'H', accent:T.ja.accent },
    { name:'Anna K.',     lang:'fr', streak:42,  online:true,  status:'Reading: French short stories',     initial:'A', accent:T.fr.accent },
  ];

  const feed = [
    {
      who:'Aiko T.', when:'12 min ago', lang:'ja', accent:T.ja.accent,
      kind:'achievement',
      headline:'earned the badge', emphasis:'Perfect Listener',
      body:'Aced 10 listening sessions in a row without missing a question. Currently a 178-day streak.',
      badge:{ ic:'head', label:'Perfect Listener', tier:'Epic', c:T.listening },
      reactions:{ '🔥':14, '👏':9, '🎌':3 }, comments:5,
    },
    {
      who:'Lukas B.', when:'34 min ago', lang:'de', accent:T.de.accent,
      kind:'milestone',
      headline:'hit a milestone', emphasis:'1,000 vocabulary words',
      body:'German B2 deck is now 1,012 cards. Going to slow down on new ones and focus on retention this week.',
      stats:[
        { label:'Words learned', v:'1,012' },
        { label:'Mastery',       v:'78%'   },
        { label:'Days to goal',  v:'24'    },
      ],
      reactions:{ '🚀':22, '💪':11 }, comments:3,
    },
    {
      who:'Léa D.', when:'2h ago', lang:'fr', accent:T.fr.accent,
      kind:'session',
      headline:'finished a Speaking session', emphasis:'Restaurant role-play · A2',
      body:'"Pretty proud of this one — barely used English crutches. Lía gave me feedback on three filler-word habits I didn\'t realize I had."',
      session:{ score:8.4, dur:'18 min', module:'Speaking', mod:T.speaking },
      reactions:{ '👏':8, '🥖':4 }, comments:2,
    },
    {
      who:'Carlos M.', when:'5h ago', lang:'es', accent:T.es.accent,
      kind:'streak',
      headline:'just hit', emphasis:'a 50-day streak',
      body:'Half a year of showing up. Thanks to everyone who kept nudging me back when I missed a day in February.',
      streakNum:50,
      reactions:{ '🔥':31, '🎉':18, '🇪🇸':6 }, comments:8,
    },
    {
      who:'Hiroshi S.', when:'Yesterday', lang:'ja', accent:T.ja.accent,
      kind:'note',
      headline:'shared a vocab card',
      body:'木漏れ日 (komorebi) — sunlight filtering through the leaves of trees. No clean English equivalent. This is the kind of word I keep this app around for.',
      vocab:{ word:'木漏れ日', romaji:'komorebi', def:'sunlight filtering through trees' },
      reactions:{ '🌿':19, '✨':12 }, comments:4,
    },
  ];

  const clubs = [
    { name:'IELTS · April cohort',    members:248, exam:'IELTS', accent:T.brand, c:T.brandLight },
    { name:'JLPT N3 study circle',    members:84,  exam:'JLPT',  accent:T.ja.accent, c:T.ja.accentLight },
    { name:'Spanish A2 → B1 ladder',  members:156, exam:'DELE',  accent:T.es.accent, c:T.es.accentLight },
    { name:'Daily 15-min French',     members:412, exam:'DELF',  accent:T.fr.accent, c:T.fr.accentLight },
  ];

  const discover = [
    { name:'Yuki N.',      lang:'ja', mutual:4, reason:'4 mutual friends · same streak goal', initial:'Y', accent:T.ja.accent },
    { name:'Marcus H.',    lang:'en', mutual:2, reason:'Studying for IELTS · April',           initial:'M', accent:T.en.accent },
    { name:'Priya S.',     lang:'en', mutual:6, reason:'In your Reading league',                initial:'P', accent:T.en.accent },
  ];

  const requests = [
    { name:'Diego H.',  lang:'es', mutual:3, initial:'D', accent:T.es.accent },
    { name:'Min-Jun P.',lang:'en', mutual:1, initial:'M', accent:T.en.accent },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow="Friends"
          title="Your study circle."
          right={
            <div style={{ display:'flex', gap:8 }}>
              <button data-nav="search" style={{ padding:'8px 14px', fontSize:13, fontWeight:600, color:T.ink3, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, display:'flex', alignItems:'center', gap:6 }}>
                {Icon.search()} Find people
              </button>
              <Btn nav="friends" label="Invite friends" icon={Icon.plus()} accent={T.brand}/>
            </div>
          }
        />

        {/* Tab strip */}
        <div style={{ display:'flex', gap:4, borderBottom:`1px solid ${T.border}`, marginBottom:24 }}>
          {[
            { id:'feed',     label:'Feed' },
            { id:'messages', label:'Messages · 4', nav:'dm_thread' },
            { id:'friends',  label:`Friends · ${friends.length}` },
            { id:'requests', label:`Requests · ${requests.length}` },
            { id:'clubs',    label:'Study clubs' },
          ].map(t => (
            <button key={t.id} onClick={()=> t.nav ? (window.__nav && window.__nav(t.nav)) : setTab(t.id)} data-nav={t.nav} style={{ padding:'10px 14px', fontSize:13, fontWeight: tab===t.id ? 700 : 500, color: tab===t.id ? T.ink : T.ink3, background:'transparent', borderBottom: tab===t.id ? `2px solid ${T.brand}` : '2px solid transparent', marginBottom:-1 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Three-column body — only on Feed tab */}
        {tab === 'feed' && (
        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr 300px', gap:20 }}>

          {/* LEFT — friends list */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <Card padding={0}>
              <div style={{ padding:'14px 16px 8px', borderBottom:`1px solid ${T.hairline}` }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Online · {friends.filter(f=>f.online).length}</div>
              </div>
              <div style={{ maxHeight:540, overflow:'auto' }}>
                {friends.map((f, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 14px', borderBottom: i < friends.length - 1 ? `1px solid ${T.hairline}` : 'none', background:'transparent' }}>
                    <button data-nav="public_profile" style={{ display:'flex', alignItems:'center', gap:10, flex:1, textAlign:'left', background:'transparent', cursor:'pointer', minWidth:0 }}>
                      <div style={{ position:'relative', flexShrink:0 }}>
                        <div style={{ width:32, height:32, borderRadius:16, background:f.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14 }}>
                          {f.initial}
                        </div>
                        {f.online && <div style={{ position:'absolute', bottom:-1, right:-1, width:10, height:10, borderRadius:5, background:'#1A8F4E', border:`2px solid ${T.card}` }}/>}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Flag code={f.lang} w={14} h={9} radius={2}/>
                          <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{f.name}</div>
                        </div>
                        <div style={{ fontSize:10.5, color:T.ink4, marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.status}</div>
                      </div>
                    </button>
                    <button data-nav="dm_thread" title="Message" style={{ width:26, height:26, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, cursor:'pointer' }}>
                      {Icon.message({ width:11, height:11 })}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Compare-progress widget */}
            <Card padding={16}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>This week</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[
                  { name:'You',       v:142, c:T.brand },
                  { name:'Aiko T.',   v:198, c:T.ja.accent },
                  { name:'Lukas B.',  v:165, c:T.de.accent },
                  { name:'Léa D.',    v:88,  c:T.fr.accent },
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:60, fontSize:11.5, fontWeight: r.name==='You' ? 700 : 500, color: r.name==='You' ? T.ink : T.ink3 }}>{r.name}</div>
                    <div style={{ flex:1, height:5, background:T.trackWarm, borderRadius:99, overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${(r.v/200)*100}%`, background:r.c, borderRadius:99 }}/>
                    </div>
                    <div style={{ width:30, textAlign:'right', fontSize:11, color:T.ink3, fontWeight:600 }}>{r.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize:10.5, color:T.ink4, marginTop:10, lineHeight:1.4 }}>Minutes studied this week. Aiko is 56 minutes ahead of you.</div>
            </Card>
          </div>

          {/* CENTER — feed */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {/* Composer */}
            <Card padding={14}>
              <div style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                <div style={{ width:36, height:36, borderRadius:18, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:15, flexShrink:0 }}>{USER.initial}</div>
                <input placeholder="Share a milestone, question, or word…" style={{ flex:1, padding:'9px 12px', fontSize:13, color:T.ink2, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, outline:'none' }}/>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:10, paddingLeft:48 }}>
                <div style={{ display:'flex', gap:6 }}>
                  {[
                    { ic:'trophy', label:'Achievement' },
                    { ic:'book',   label:'Vocab' },
                    { ic:'play',   label:'Session' },
                  ].map(b => (
                    <button key={b.label} style={{ padding:'6px 10px', fontSize:11.5, fontWeight:600, color:T.ink3, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, display:'flex', alignItems:'center', gap:5 }}>
                      {Icon[b.ic]({ width:12, height:12 })} {b.label}
                    </button>
                  ))}
                </div>
                <Btn label="Post" size="sm" accent={T.brand}/>
              </div>
            </Card>

            {feed.map((p, i) => (
              <Card key={i} padding={0}>
                {/* Header */}
                <div style={{ padding:'14px 16px 8px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:38, height:38, borderRadius:19, background:p.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:15 }}>{p.who[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Flag code={p.lang} w={14} h={9} radius={2}/>
                      <span style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{p.who}</span>
                      <span style={{ fontSize:12, color:T.ink3 }}>{p.headline}</span>
                      {p.emphasis && <span style={{ fontSize:13, fontWeight:700, color:T.ink, fontFamily:T.serif }}>{p.emphasis}</span>}
                    </div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{p.when}</div>
                  </div>
                  <button style={{ width:28, height:28, borderRadius:14, color:T.ink4 }}>{Icon.more()}</button>
                </div>

                {/* Body */}
                {p.body && (
                  <div style={{ padding:'4px 16px 12px', fontSize:13.5, color:T.ink2, lineHeight:1.55 }}>{p.body}</div>
                )}

                {/* Embed: badge */}
                {p.badge && (
                  <div style={{ margin:'4px 16px 14px', padding:'18px 18px', background:p.badge.c.bg, borderRadius:14, display:'flex', alignItems:'center', gap:14, border:`1px solid ${T.hairline}` }}>
                    <div style={{ width:64, height:64, borderRadius:32, background:p.badge.c.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 8px 24px ${p.badge.c.c}40` }}>
                      {Icon[p.badge.ic]({ width:24, height:24 })}
                    </div>
                    <div>
                      <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:p.badge.c.c, marginBottom:3 }}>{p.badge.tier} achievement</div>
                      <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1 }}>{p.badge.label}</div>
                    </div>
                  </div>
                )}

                {/* Embed: milestone stats */}
                {p.stats && (
                  <div style={{ margin:'4px 16px 14px', padding:'14px 18px', background:T.bg2, borderRadius:12, display:'grid', gridTemplateColumns:`repeat(${p.stats.length}, 1fr)`, gap:12 }}>
                    {p.stats.map((s, j) => (
                      <div key={j}>
                        <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>{s.label}</div>
                        <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1 }}>{s.v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Embed: session score */}
                {p.session && (
                  <div style={{ margin:'4px 16px 14px', padding:'14px 16px', border:`1px solid ${T.border}`, borderRadius:12, display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ width:48, height:48, borderRadius:10, background:p.session.mod.bg, color:p.session.mod.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {Icon.mic({ width:18, height:18 })}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{p.session.module} · {p.session.dur}</div>
                      <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>Band score</div>
                    </div>
                    <div style={{ fontFamily:T.serif, fontSize:32, color:p.session.mod.c, lineHeight:1 }}>{p.session.score}</div>
                  </div>
                )}

                {/* Embed: streak */}
                {p.streakNum && (
                  <div style={{ margin:'4px 16px 14px', padding:'24px 18px', background:`linear-gradient(135deg, ${T.brandLight} 0%, #FFF6F2 100%)`, borderRadius:14, display:'flex', alignItems:'center', gap:18, border:`1px solid ${T.brandLight}` }}>
                    <div style={{ width:72, height:72, borderRadius:36, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 24px ${T.brand}50` }}>
                      {Icon.flame({ width:32, height:32 })}
                    </div>
                    <div>
                      <div style={{ fontFamily:T.serif, fontSize:42, color:T.brand, lineHeight:1 }}>{p.streakNum} days</div>
                      <div style={{ fontSize:12, color:T.ink3, marginTop:4 }}>Showing up daily since Jan 18</div>
                    </div>
                  </div>
                )}

                {/* Embed: vocab card */}
                {p.vocab && (
                  <div style={{ margin:'4px 16px 14px', padding:'20px 22px', background:T.paper, borderRadius:14, border:`1px solid ${T.border}`, textAlign:'center' }}>
                    <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.1 }}>{p.vocab.word}</div>
                    <div style={{ fontSize:13, color:T.ink3, marginTop:6, fontStyle:'italic' }}>{p.vocab.romaji}</div>
                    <div style={{ height:1, background:T.hairline, margin:'14px 40px' }}/>
                    <div style={{ fontSize:13, color:T.ink2 }}>{p.vocab.def}</div>
                  </div>
                )}

                {/* Reactions + comments bar */}
                <div style={{ padding:'10px 16px 12px', borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    {Object.entries(p.reactions).map(([emoji, n]) => (
                      <button key={emoji} style={{ padding:'4px 10px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:99, fontSize:12, fontWeight:600, color:T.ink2, display:'inline-flex', alignItems:'center', gap:4 }}>
                        <span style={{ fontSize:13 }}>{emoji}</span> {n}
                      </button>
                    ))}
                    <button style={{ padding:'4px 9px', border:`1px dashed ${T.border}`, borderRadius:99, fontSize:12, color:T.ink4 }}>+</button>
                  </div>
                  <button style={{ fontSize:11.5, color:T.ink3, fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
                    {Icon.message({ width:12, height:12 })} {p.comments} comments
                  </button>
                </div>
              </Card>
            ))}

            <button style={{ padding:'12px', fontSize:12.5, fontWeight:700, color:T.ink3, background:T.card, border:`1px solid ${T.border}`, borderRadius:10 }}>Load older posts</button>
          </div>

          {/* RIGHT — discover + clubs */}
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {/* Pending requests */}
            {requests.length > 0 && (
              <Card padding={0}>
                <div style={{ padding:'12px 14px 10px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Requests · {requests.length}</div>
                </div>
                {requests.map((r, i) => (
                  <div key={i} style={{ padding:'12px 14px', borderBottom: i < requests.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                      <div style={{ width:34, height:34, borderRadius:17, background:r.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14 }}>{r.initial}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{r.name}</div>
                        <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{r.mutual} mutual · learning {r.lang === 'es' ? 'Spanish' : 'English'}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <Btn label="Accept" size="sm" accent={T.brand} fullWidth/>
                      <button style={{ padding:'6px 12px', fontSize:12, fontWeight:600, color:T.ink3, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8 }}>Decline</button>
                    </div>
                  </div>
                ))}
              </Card>
            )}

            {/* Discover people */}
            <Card padding={0}>
              <div style={{ padding:'12px 14px 10px', borderBottom:`1px solid ${T.hairline}` }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>People you may know</div>
              </div>
              {discover.map((d, i) => (
                <div key={i} style={{ padding:'12px 14px', borderBottom: i < discover.length - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                    <div style={{ width:34, height:34, borderRadius:17, background:d.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14 }}>{d.initial}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{d.name}</div>
                      <div style={{ fontSize:10.5, color:T.ink4, marginTop:1, lineHeight:1.3 }}>{d.reason}</div>
                    </div>
                  </div>
                  <Btn nav="friends" label="Add friend" size="sm" variant="outline" accent={T.brand} fullWidth/>
                </div>
              ))}
            </Card>

            {/* Clubs */}
            <Card padding={0}>
              <div style={{ padding:'12px 14px 10px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Study clubs</div>
                <button style={{ fontSize:11, color:T.brand, fontWeight:700 }}>Browse</button>
              </div>
              {clubs.map((c, i) => (
                <button key={i} style={{ padding:'12px 14px', borderBottom: i < clubs.length - 1 ? `1px solid ${T.hairline}` : 'none', width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:10, background:'transparent', cursor:'pointer' }}>
                  <div style={{ width:34, height:34, borderRadius:9, background:c.c, color:c.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11, fontWeight:700 }}>
                    {c.exam}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:12.5, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{c.name}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:2, display:'flex', alignItems:'center', gap:4 }}>
                      {Icon.users({ width:10, height:10 })} {c.members} members
                    </div>
                  </div>
                  {Icon.chev({ width:12, height:12, style:{ color:T.ink4 } })}
                </button>
              ))}
            </Card>
          </div>
        </div>
        )}

        {/* FRIENDS LIST TAB */}
        {tab === 'friends' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14 }}>
            {friends.map((f, i) => (
              <Card key={i} padding={18}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ position:'relative', flexShrink:0 }}>
                    <div style={{ width:48, height:48, borderRadius:24, background:f.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:18 }}>{f.initial}</div>
                    {f.online && <div style={{ position:'absolute', bottom:0, right:0, width:12, height:12, borderRadius:6, background:'#1A8F4E', border:`2px solid ${T.card}` }}/>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Flag code={f.lang} w={14} h={9} radius={2}/>
                      <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{f.name}</div>
                    </div>
                    <div style={{ fontSize:11.5, color:T.ink4, marginTop:3, lineHeight:1.4 }}>{f.status}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:6, display:'flex', alignItems:'center', gap:4 }}>{Icon.flame({ width:10, height:10 })} {f.streak}-day streak</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6, marginTop:12 }}>
                  <Btn label="Profile" nav="public_profile" variant="outline" size="sm" fullWidth/>
                  <Btn label="Message" nav="dm_thread" accent={T.brand} size="sm" fullWidth/>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* REQUESTS TAB */}
        {tab === 'requests' && (
          <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:640 }}>
            {requests.map((r, i) => (
              <Card key={i} padding={16} style={{ display:'flex', alignItems:'center', gap:14 }}>
                <div style={{ width:44, height:44, borderRadius:22, background:r.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:16 }}>{r.initial}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{r.name}</div>
                  <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>{r.mutual} mutual friends · learning {r.lang === 'es' ? 'Spanish' : 'English'}</div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <Btn label="View" nav="public_profile" variant="outline" size="sm"/>
                  <Btn label="Accept" accent={T.brand} size="sm"/>
                  <button style={{ padding:'7px 12px', fontSize:12, fontWeight:600, color:T.ink3, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8 }}>Decline</button>
                </div>
              </Card>
            ))}
            {requests.length === 0 && <div style={{ padding:40, textAlign:'center', fontSize:13, color:T.ink4 }}>No pending requests.</div>}
          </div>
        )}

        {/* CLUBS TAB */}
        {tab === 'clubs' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:14 }}>
            {clubs.map((c, i) => (
              <Card key={i} padding={20}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
                  <div style={{ width:48, height:48, borderRadius:11, background:c.c, color:c.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:13, fontWeight:700 }}>{c.exam}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.25 }}>{c.name}</div>
                    <div style={{ fontSize:11.5, color:T.ink4, marginTop:4, display:'flex', alignItems:'center', gap:4 }}>{Icon.users({ width:11, height:11 })} {c.members} members · public</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <Btn label="Open club" variant="outline" size="sm" fullWidth/>
                  <Btn label="Join" accent={c.accent} size="sm" fullWidth/>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Mobile ─────────────────────────────────────────────────────
function MFriendsPage({ onBack }) {
  const [tab, setTab] = useState('feed');

  const friends = [
    { name:'Aiko T.',   lang:'ja', streak:178, online:true,  initial:'A', accent:T.ja.accent },
    { name:'Lukas B.',  lang:'de', streak:142, online:true,  initial:'L', accent:T.de.accent },
    { name:'Léa D.',    lang:'fr', streak:74,  online:false, initial:'L', accent:T.fr.accent },
    { name:'Carlos M.', lang:'es', streak:51,  online:true,  initial:'C', accent:T.es.accent },
    { name:'Olivia B.', lang:'en', streak:99,  online:false, initial:'O', accent:T.en.accent },
    { name:'Anna K.',   lang:'fr', streak:42,  online:true,  initial:'A', accent:T.fr.accent },
  ];

  const feed = [
    { who:'Aiko T.', when:'12m', lang:'ja', accent:T.ja.accent, title:'earned Perfect Listener', body:'Aced 10 listening sessions in a row.', emoji:'🔥', n:14, kind:'badge', badgeC:T.listening, badgeIc:'head' },
    { who:'Carlos M.', when:'5h', lang:'es', accent:T.es.accent, title:'hit a 50-day streak', body:'Half a year of showing up.', emoji:'🎉', n:31, kind:'streak', streakNum:50 },
    { who:'Léa D.', when:'2h', lang:'fr', accent:T.fr.accent, title:'finished a Speaking session', body:'Restaurant role-play · 8.4 band', emoji:'👏', n:8, kind:'session' },
    { who:'Hiroshi S.', when:'1d', lang:'ja', accent:T.ja.accent, title:'shared a vocab card', body:'木漏れ日 — sunlight through trees', emoji:'🌿', n:19, kind:'vocab', word:'木漏れ日' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <PhoneHeader title="Friends" back onBack={onBack} right={
        <button style={{ width:36, height:36, borderRadius:18, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.search()}</button>
      }/>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, padding:'4px 16px 12px', borderBottom:`1px solid ${T.hairline}`, overflowX:'auto' }}>
        {[
          { id:'feed',    label:'Feed' },
          { id:'friends', label:`Friends · ${friends.length}` },
          { id:'discover',label:'Discover' },
        ].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'6px 12px', fontSize:12, fontWeight: tab===t.id ? 700 : 500, color: tab===t.id ? '#fff' : T.ink3, background: tab===t.id ? T.ink : T.bg2, border:`1px solid ${tab===t.id ? T.ink : T.border}`, borderRadius:99, whiteSpace:'nowrap' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'12px 16px 100px' }}>
        {tab === 'feed' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {/* Composer */}
            <button style={{ padding:'12px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:14, display:'flex', alignItems:'center', gap:10, textAlign:'left' }}>
              <div style={{ width:30, height:30, borderRadius:15, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>{USER.initial}</div>
              <div style={{ flex:1, fontSize:12.5, color:T.ink4 }}>Share a milestone…</div>
              {Icon.plus({ style:{ color:T.ink4 } })}
            </button>

            {feed.map((p, i) => (
              <Card key={i} padding={0}>
                <div style={{ padding:'12px 14px 8px', display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:32, height:32, borderRadius:16, background:p.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:13 }}>{p.who[0]}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                      <Flag code={p.lang} w={12} h={8} radius={2}/>
                      <span style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{p.who}</span>
                    </div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{p.title} · {p.when}</div>
                  </div>
                </div>

                {p.kind === 'badge' && (
                  <div style={{ margin:'2px 14px 10px', padding:'14px', background:p.badgeC.bg, borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:42, height:42, borderRadius:21, background:p.badgeC.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {Icon[p.badgeIc]({ width:18, height:18 })}
                    </div>
                    <div style={{ fontSize:12.5, color:T.ink2, lineHeight:1.4 }}>{p.body}</div>
                  </div>
                )}
                {p.kind === 'streak' && (
                  <div style={{ margin:'2px 14px 10px', padding:'18px 14px', background:`linear-gradient(135deg, ${T.brandLight} 0%, #FFF6F2 100%)`, borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:50, height:50, borderRadius:25, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {Icon.flame({ width:22, height:22 })}
                    </div>
                    <div>
                      <div style={{ fontFamily:T.serif, fontSize:28, color:T.brand, lineHeight:1 }}>{p.streakNum} days</div>
                      <div style={{ fontSize:11, color:T.ink3, marginTop:2 }}>{p.body}</div>
                    </div>
                  </div>
                )}
                {p.kind === 'session' && (
                  <div style={{ margin:'2px 14px 10px', padding:'10px 12px', border:`1px solid ${T.border}`, borderRadius:10, fontSize:12, color:T.ink2 }}>{p.body}</div>
                )}
                {p.kind === 'vocab' && (
                  <div style={{ margin:'2px 14px 10px', padding:'18px', background:T.paper, borderRadius:12, border:`1px solid ${T.border}`, textAlign:'center' }}>
                    <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1.1 }}>{p.word}</div>
                    <div style={{ fontSize:11.5, color:T.ink3, marginTop:6 }}>{p.body.split(' — ')[1]}</div>
                  </div>
                )}

                <div style={{ padding:'8px 14px 10px', borderTop:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <button style={{ padding:'4px 10px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:99, fontSize:11.5, fontWeight:600, color:T.ink2, display:'inline-flex', alignItems:'center', gap:4 }}>
                    <span style={{ fontSize:12 }}>{p.emoji}</span> {p.n}
                  </button>
                  <button style={{ fontSize:11, color:T.ink3, fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
                    {Icon.message({ width:11, height:11 })} Comment
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === 'friends' && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {friends.map((f, i) => (
              <Card key={i} padding={12} style={{ display:'flex', alignItems:'center', gap:10 }}>
                <button data-nav="public_profile" style={{ position:'relative', flexShrink:0, background:'transparent', cursor:'pointer' }}>
                  <div style={{ width:38, height:38, borderRadius:19, background:f.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:15 }}>{f.initial}</div>
                  {f.online && <div style={{ position:'absolute', bottom:-1, right:-1, width:11, height:11, borderRadius:6, background:'#1A8F4E', border:`2px solid ${T.card}` }}/>}
                </button>
                <button data-nav="public_profile" style={{ flex:1, minWidth:0, textAlign:'left', background:'transparent', cursor:'pointer' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Flag code={f.lang} w={13} h={9} radius={2}/>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{f.name}</div>
                  </div>
                  <div style={{ fontSize:11, color:T.ink4, marginTop:2, display:'flex', alignItems:'center', gap:4 }}>
                    {Icon.flame({ width:10, height:10 })} {f.streak}-day streak {f.online && '· online'}
                  </div>
                </button>
                <button data-nav="dm_thread" style={{ padding:'6px 10px', fontSize:11.5, fontWeight:600, color:T.ink3, background:T.bg2, border:`1px solid ${T.border}`, borderRadius:8, display:'flex', alignItems:'center', gap:4 }}>
                  {Icon.message({ width:11, height:11 })}
                </button>
              </Card>
            ))}
          </div>
        )}

        {tab === 'discover' && (
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>2 requests</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { name:'Diego H.', lang:'es', mutual:3, accent:T.es.accent, initial:'D' },
                  { name:'Min-Jun P.', lang:'en', mutual:1, accent:T.en.accent, initial:'M' },
                ].map((r, i) => (
                  <Card key={i} padding={12} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:18, background:r.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14 }}>{r.initial}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{r.name}</div>
                      <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{r.mutual} mutual</div>
                    </div>
                    <Btn label="Accept" size="sm" accent={T.brand}/>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8, marginTop:8 }}>Suggested for you</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { name:'Yuki N.', lang:'ja', mutual:'4 mutual', accent:T.ja.accent, initial:'Y' },
                  { name:'Marcus H.', lang:'en', mutual:'IELTS · April', accent:T.en.accent, initial:'M' },
                  { name:'Priya S.', lang:'en', mutual:'In your league', accent:T.en.accent, initial:'P' },
                ].map((d, i) => (
                  <Card key={i} padding={12} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:18, background:d.accent, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:14 }}>{d.initial}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{d.name}</div>
                      <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{d.mutual}</div>
                    </div>
                    <Btn label="Add" size="sm" variant="outline" accent={T.brand}/>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { FriendsPage, MFriendsPage });
