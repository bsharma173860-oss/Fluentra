// ── Page: Friends / Social ───────────────────────────────────
// Three-column: feed (center), friends list (left), discover/clubs (right)

function FriendsPage() {
  const [tab, setTab] = React.useState('friends');
  const [data, setData] = React.useState(null);   // { friends, incoming, outgoing }
  const [busy, setBusy] = React.useState(false);
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [searching, setSearching] = React.useState(false);
  const [suggested, setSuggested] = React.useState([]);

  const S = (window.FL && window.FL.social) ? window.FL.social : null;

  function refresh() {
    if (!S) { setData({ friends:[], incoming:[], outgoing:[] }); return; }
    S.listFriends().then(function (d) { setData(d || { friends:[], incoming:[], outgoing:[] }); })
      .catch(function () { setData({ friends:[], incoming:[], outgoing:[] }); });
  }
  React.useEffect(function () { refresh(); }, []);
  React.useEffect(function () {
    if (!S) return;
    S.leaderboard('xp', 14).then(function (rows) {
      S._uid().then(function (me) {
        var known = {};
        ((data && data.friends) || []).forEach(function (x) { known[x.profile.id] = 1; });
        ((data && data.outgoing) || []).forEach(function (x) { known[x.profile.id] = 1; });
        ((data && data.incoming) || []).forEach(function (x) { known[x.profile.id] = 1; });
        setSuggested((rows || []).filter(function (u) { return u.id !== me && !known[u.id]; }).slice(0, 6));
      });
    }).catch(function () {});
  }, [data]);

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
          <div style={{ fontSize:13, color:T.ink4, marginBottom:14 }}>Connect with other learners, compare streaks, and message each other.</div>
          <button onClick={function(){ window.__nav && window.__nav('activity_feed'); }} style={{ marginBottom:18, padding:'8px 14px', borderRadius:10, border:`1px solid ${T.border}`, background:T.card, color:T.ink2, fontSize:12.5, fontWeight:700, cursor:'pointer' }}>📣 Open Circle →</button>

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
                    <MiniBtn label="Message" onClick={function () { window.__dmUser = fr.profile; window.__nav && window.__nav('activity_feed'); }}/>
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
