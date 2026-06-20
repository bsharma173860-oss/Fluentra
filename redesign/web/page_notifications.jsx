// ── Notifications — real activity feed derived from your sessions ──
const { useState: useStateN } = React;

function _relTime(iso) {
  if (!iso) return '';
  var t = new Date(iso).getTime(); if (isNaN(t)) return '';
  var s = Math.floor((Date.now() - t) / 1000);
  if (s < 60) return 'just now';
  var m = Math.floor(s / 60); if (m < 60) return m + 'm';
  var h = Math.floor(m / 60); if (h < 24) return h + 'h';
  var d = Math.floor(h / 24); if (d < 7) return d + 'd';
  var w = Math.floor(d / 7); if (w < 5) return w + 'w';
  return new Date(iso).toLocaleDateString(undefined, { month:'short', day:'numeric' });
}

function _activityFeed() {
  var rows = (typeof window !== 'undefined' && window.__results) ? window.__results.slice() : [];
  rows = rows.filter(function (r) { return r && r.updated_at; });
  rows.sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
  var MOD = {
    reading:   { ic:'book', c:T.reading },
    listening: { ic:'head', c:T.listening },
    writing:   { ic:'pen',  c:T.writing },
    speaking:  { ic:'mic',  c:T.speaking },
  };
  return rows.slice(0, 30).map(function (r, i) {
    var mod = (r.detail && r.detail.module) || 'reading';
    var meta = MOD[mod] || MOD.reading;
    var langObj = (typeof langByCode === 'function') ? langByCode(r.lang) : { english:'' };
    var langName = (langObj && langObj.english) || (r.lang || '').toUpperCase();
    var modName = mod.charAt(0).toUpperCase() + mod.slice(1);
    var score = (typeof r.score === 'number') ? (r.score + '%') : '';
    return {
      id: i, ic: meta.ic, accent: meta.c, nav: mod, when: _relTime(r.updated_at),
      title: modName + ' practice · ' + langName,
      body: score ? ('You scored ' + score + '.') : 'Session completed.',
    };
  });
}

function NotifRow({ n }) {
  var a = n.accent || { c:T.brand, bg:(T.brandLight || T.bg2) };
  return (
    <button onClick={function(){ window.__nav && window.__nav(n.nav); }} style={{ width:'100%', display:'flex', gap:14, padding:'15px 18px', background:'transparent', border:'none', borderBottom:'1px solid '+T.hairline, cursor:'pointer', textAlign:'left' }}>
      <div style={{ width:38, height:38, borderRadius:11, background:a.bg, color:a.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[n.ic] ? Icon[n.ic]({ width:15, height:15 }) : null}</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:3 }}>
          <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.35, flex:1 }}>{n.title}</div>
          <div style={{ fontSize:11, color:T.ink4, flexShrink:0 }}>{n.when}</div>
        </div>
        <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.45 }}>{n.body}</div>
      </div>
    </button>
  );
}

function NotificationsPage() {
  const feed = _activityFeed();
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:680, margin:'0 auto', padding:'36px 32px 56px' }}>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, marginBottom:6 }}>Activity</div>
          <div style={{ fontSize:13.5, color:T.ink3, marginBottom:20 }}>Your recent practice sessions.</div>
          {feed.length === 0 ? (
            <Card padding={24}><div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6 }}>No activity yet. Finish a practice session and it'll show up here.</div></Card>
          ) : (
            <Card padding={0}>{feed.map(function (n) { return <NotifRow key={n.id} n={n}/>; })}</Card>
          )}
        </div>
      </div>
    </div>
  );
}

function MNotificationsPage() {
  const feed = _activityFeed();
  return (
    <MobileBody>
      <div style={{ padding:'14px 0' }}>
        <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, padding:'4px 16px 12px' }}>Activity</div>
        {feed.length === 0 ? (
          <div style={{ fontSize:13, color:T.ink3, padding:'16px' }}>No activity yet. Finish a session and it'll show up here.</div>
        ) : feed.map(function (n) { return <NotifRow key={n.id} n={n}/>; })}
      </div>
    </MobileBody>
  );
}

Object.assign(window, { NotificationsPage, MNotificationsPage });
