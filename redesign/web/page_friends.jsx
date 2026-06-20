// ── Page: Friends / Social ───────────────────────────────────
// Three-column: feed (center), friends list (left), discover/clubs (right)

function FriendsPage() {
  const [tab, setTab] = React.useState('friends');
  const [data, setData] = React.useState(null);   // { friends, incoming, outgoing }
  const [busy, setBusy] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [searching, setSearching] = React.useState(false);

  const S = (window.FL && window.FL.social) ? window.FL.social : null;

  function refresh() {
    if (!S) { setData({ friends:[], incoming:[], outgoing:[] }); return; }
    S.listFriends().then(function (d) { setData(d || { friends:[], incoming:[], outgoing:[] }); })
      .catch(function () { setData({ friends:[], incoming:[], outgoing:[] }); });
  }
  React.useEffect(function () { refresh(); }, []);

  function initial(p) { var n = (p && (p.full_name || p.username)) || '?'; return n[0].toUpperCase(); }
  function label(p) { return (p && (p.full_name || p.username)) || 'Learner'; }
  function handle(p) { return p && p.username ? '@' + p.username : ''; }

  function act(promise) {
    if (!promise) return;
    setBusy(true);
    Promise.resolve(promise).then(function () { setBusy(false); refresh(); }).catch(function () { setBusy(false); refresh(); });
  }
  function doSearch() {
    if (!S || q.trim().length < 2) { setResults([]); return; }
    setSearching(true);
    S.searchUsers(q.trim()).then(function (r) {
      var known = {};
      ((data && data.friends) || []).forEach(function (x) { known[x.profile.id] = 1; });
      ((data && data.outgoing) || []).forEach(function (x) { known[x.profile.id] = 1; });
      S._uid().then(function (me) {
        setResults((r || []).filter(function (u) { return u.id !== me; }).map(function (u) { return Object.assign({ _known: !!known[u.id] }, u); }));
        setSearching(false);
      });
    }).catch(function () { setSearching(false); setResults([]); });
  }

  function Avatar({ p, size }) {
    var sz = size || 40;
    return <div style={{ width:sz, height:sz, borderRadius:sz/2, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:sz*0.4, flexShrink:0 }}>{initial(p)}</div>;
  }
  function Row({ p, children }) {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:`1px solid ${T.hairline}` }}>
        <Avatar p={p}/>
        <button onClick={function () { window.__profileId = p.id; window.__nav && window.__nav('public_profile'); }} style={{ flex:1, minWidth:0, textAlign:'left', background:'transparent', cursor:'pointer' }}>
          <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{label(p)}</div>
          <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>{handle(p)}{(p.streak ? (handle(p) ? ' · ' : '') + p.streak + '-day streak' : '')}</div>
        </button>
        <div style={{ display:'flex', gap:8, flexShrink:0 }}>{children}</div>
      </div>
    );
  }
  function MiniBtn({ label, onClick, accent, outline }) {
    return <button disabled={busy} onClick={onClick} style={{ padding:'7px 13px', borderRadius:9, fontSize:12, fontWeight:700, cursor: busy?'default':'pointer', opacity: busy?.6:1, border: outline?`1px solid ${T.border}`:'none', background: outline?'transparent':(accent||T.brand), color: outline?T.ink2:'#fff' }}>{label}</button>;
  }

  const d = data || { friends:[], incoming:[], outgoing:[] };
  const tabs = [
    { id:'friends',  label:'Friends · ' + d.friends.length },
    { id:'requests', label:'Requests · ' + d.incoming.length },
    { id:'find',     label:'Find people' },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 48px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.05, marginBottom:6 }}>Friends</div>
          <div style={{ fontSize:13, color:T.ink4, marginBottom:20 }}>Connect with other learners, compare streaks, and message each other.</div>

          <div style={{ display:'flex', gap:8, marginBottom:18 }}>
            {tabs.map(function (t) {
              var active = tab === t.id;
              return <button key={t.id} onClick={function () { setTab(t.id); }} style={{ padding:'8px 15px', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', border:`1px solid ${active?T.brand:T.border}`, background:active?T.brandLight:T.card, color:active?T.brand:T.ink2 }}>{t.label}</button>;
            })}
          </div>

          {data === null ? (
            <Card padding={40}><div style={{ color:T.ink3, fontSize:13.5 }}>Loading…</div></Card>
          ) : tab === 'friends' ? (
            d.friends.length === 0 ? (
              <Card padding={36}><div style={{ color:T.ink3, fontSize:13.5, lineHeight:1.6 }}>No friends yet. Head to <button onClick={function(){ setTab('find'); }} style={{ color:T.brand, fontWeight:700, background:'transparent', cursor:'pointer' }}>Find people</button> to search by name or username and send a request.</div></Card>
            ) : (
              <Card padding={0}>
                {d.friends.map(function (fr) { return (
                  <Row key={fr.friendshipId} p={fr.profile}>
                    <MiniBtn label="Message" onClick={function () { window.__dmUser = fr.profile; window.__nav && window.__nav('dm_thread'); }}/>
                    <MiniBtn label="Remove" outline onClick={function () { act(S.removeFriend(fr.friendshipId)); }}/>
                  </Row>
                ); })}
              </Card>
            )
          ) : tab === 'requests' ? (
            <>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', margin:'4px 0 10px' }}>Incoming</div>
              {d.incoming.length === 0 ? (
                <Card padding={28}><div style={{ color:T.ink4, fontSize:13 }}>No incoming requests.</div></Card>
              ) : (
                <Card padding={0}>
                  {d.incoming.map(function (fr) { return (
                    <Row key={fr.friendshipId} p={fr.profile}>
                      <MiniBtn label="Accept" onClick={function () { act(S.respondFriendRequest(fr.friendshipId, true)); }}/>
                      <MiniBtn label="Decline" outline onClick={function () { act(S.respondFriendRequest(fr.friendshipId, false)); }}/>
                    </Row>
                  ); })}
                </Card>
              )}
              {d.outgoing.length > 0 && (
                <>
                  <div style={{ fontSize:12, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', margin:'20px 0 10px' }}>Sent</div>
                  <Card padding={0}>
                    {d.outgoing.map(function (fr) { return (
                      <Row key={fr.friendshipId} p={fr.profile}>
                        <Chip label="Pending" accent={T.ink3} bg={T.bg2}/>
                        <MiniBtn label="Cancel" outline onClick={function () { act(S.removeFriend(fr.friendshipId)); }}/>
                      </Row>
                    ); })}
                  </Card>
                </>
              )}
            </>
          ) : (
            <>
              <Card padding={14} style={{ marginBottom:16, display:'flex', gap:10 }}>
                <input value={q} onChange={function (e) { setQ(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') doSearch(); }} placeholder="Search by name or username…" style={{ flex:1, padding:'10px 14px', borderRadius:10, border:`1px solid ${T.border}`, fontSize:13.5, color:T.ink, background:T.bg, outline:'none' }}/>
                <Btn label="Search" accent={T.brand} onClick={doSearch}/>
              </Card>
              {searching ? (
                <Card padding={28}><div style={{ color:T.ink4, fontSize:13 }}>Searching…</div></Card>
              ) : results === null ? (
                <Card padding={28}><div style={{ color:T.ink4, fontSize:13 }}>Search for other learners by name or username.</div></Card>
              ) : results.length === 0 ? (
                <Card padding={28}><div style={{ color:T.ink4, fontSize:13 }}>No matches. People appear here once they've set a name or username.</div></Card>
              ) : (
                <Card padding={0}>
                  {results.map(function (u) { return (
                    <Row key={u.id} p={u}>
                      {u._known
                        ? <Chip label="Added" accent={T.ink3} bg={T.bg2}/>
                        : <MiniBtn label="Add friend" onClick={function () { act(S.sendFriendRequest(u.id)); }}/>}
                    </Row>
                  ); })}
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

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
