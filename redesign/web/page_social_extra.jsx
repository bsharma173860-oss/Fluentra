// ── Public profile + DM thread + Activity feed + Phrasebook + Receipts + Refer ──

function PublicProfilePage() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const id = (typeof window !== 'undefined') ? window.__profileId : null;
  const [p, setP] = React.useState(undefined);
  const [rel, setRel] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  function load() {
    if (!S || !id) { setP(null); return; }
    S.getProfile(id).then(function (prof) { setP(prof || null); });
    S._uid().then(function (me) {
      if (me === id) { setRel({ k:'me' }); return; }
      S.listFriends().then(function (d) {
        var fr = (d.friends || []).filter(function (x) { return x.profile.id === id; })[0];
        var out = (d.outgoing || []).filter(function (x) { return x.profile.id === id; })[0];
        var inc = (d.incoming || []).filter(function (x) { return x.profile.id === id; })[0];
        if (fr) setRel({ k:'friend', fid:fr.friendshipId });
        else if (out) setRel({ k:'pending_out', fid:out.friendshipId });
        else if (inc) setRel({ k:'pending_in', fid:inc.friendshipId });
        else setRel({ k:'none' });
      });
    });
  }
  React.useEffect(load, [id]);
  function act(promise) { if (!promise) return; setBusy(true); Promise.resolve(promise).then(function () { setBusy(false); load(); }).catch(function () { setBusy(false); load(); }); }
  const fileRef = React.useRef(null);
  const [uploading, setUploading] = React.useState(false);
  function onPickAvatar(e) { var file = e.target.files && e.target.files[0]; if (!file || !S) return; setUploading(true); S.uploadMedia(file, 'avatar').then(function (url) { if (url) return S.setAvatar(url); }).then(function () { setUploading(false); load(); }).catch(function () { setUploading(false); }); }

  if (p === undefined) return (<div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}><WebTopbar/><div style={{ padding:40, color:T.ink3 }}>Loading profile…</div></div>);
  if (!p) return (<div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}><WebTopbar/><div style={{ padding:40, color:T.ink3 }}>Profile not found.</div></div>);
  const name = p.full_name || p.username || 'Learner';
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 36px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap:20, marginBottom:24 }}>
            <div style={{ position:'relative' }}>
              {p.avatar_url
                ? <img src={p.avatar_url} style={{ width:84, height:84, borderRadius:42, objectFit:'cover' }}/>
                : <div style={{ width:84, height:84, borderRadius:42, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:36 }}>{name[0].toUpperCase()}</div>}
              {rel && rel.k === 'me' && (<>
                <input ref={fileRef} type="file" accept="image/*" onChange={onPickAvatar} style={{ display:'none' }}/>
                <button onClick={function () { if (fileRef.current) fileRef.current.click(); }} style={{ position:'absolute', bottom:-2, right:-2, width:28, height:28, borderRadius:14, background:T.brand, color:'#fff', border:`2px solid ${T.card}`, cursor:'pointer', fontSize:13 }}>{uploading ? '…' : '✎'}</button>
              </>)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink }}>{name}</div>
              {p.username && <div style={{ fontSize:13, color:T.ink4, marginTop:2 }}>@{p.username}</div>}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {rel && rel.k === 'me' ? <Chip label="This is you" accent={T.ink3} bg={T.bg2}/>
               : rel && rel.k === 'friend' ? (<><Btn label="Message" accent={T.brand} onClick={function () { window.__dmUser = p; window.__nav && window.__nav('activity_feed'); }}/><Btn label="Remove" variant="outline" accent={T.ink2} onClick={function () { act(S.removeFriend(rel.fid)); }}/></>)
               : rel && rel.k === 'pending_out' ? <Chip label="Request sent" accent={T.ink3} bg={T.bg2}/>
               : rel && rel.k === 'pending_in' ? <Btn label="Accept request" accent={T.brand} onClick={function () { act(S.respondFriendRequest(rel.fid, true)); }}/>
               : rel && rel.k === 'none' ? <Btn label="Add friend" accent={T.brand} onClick={function () { act(S.sendFriendRequest(id)); }}/>
               : null}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14 }}>
            {[{ v:p.xp||0, l:'Total XP' }, { v:p.streak||0, l:'Day streak' }, { v:(p.best_score||0)+'%', l:'Best score' }].map(function (st) { return (
              <Card key={st.l} padding={22}><div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1 }}>{st.v}</div><div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginTop:8 }}>{st.l}</div></Card>
            ); })}
          </div>
        </div>
      </div>
    </div>
  );
}

function DMThreadPage() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const other = (typeof window !== 'undefined') ? window.__dmUser : null;
  const [msgs, setMsgs] = React.useState([]);
  const [text, setText] = React.useState('');
  const [meId, setMeId] = React.useState(null);
  const endRef = React.useRef(null);
  React.useEffect(function () {
    if (!S || !other) return;
    var unsub = function () {};
    S._uid().then(function (id) { setMeId(id); });
    S.thread(other.id).then(function (rows) { setMsgs(rows || []); });
    unsub = S.subscribeMessages(function (m) {
      if (m.sender === other.id || m.recipient === other.id) {
        setMsgs(function (prev) { return prev.some(function (x) { return x.id === m.id; }) ? prev : prev.concat([m]); });
      }
    });
    return function () { unsub(); };
  }, [other && other.id]);
  React.useEffect(function () { if (endRef.current) endRef.current.scrollIntoView({ behavior:'smooth' }); }, [msgs.length]);
  function send() {
    var body = text.trim(); if (!body || !S || !other) return;
    setText('');
    S.sendMessage(other.id, body).then(function (m) { if (m) setMsgs(function (prev) { return prev.some(function (x) { return x.id === m.id; }) ? prev : prev.concat([m]); }); });
  }
  if (!other) return (<div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}><WebTopbar/><div style={{ padding:40, color:T.ink3 }}>Open a conversation from Friends or someone's profile.</div></div>);
  const name = other.full_name || other.username || 'Learner';
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ padding:'14px 24px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:12 }}>
        <button onClick={function () { window.__nav && window.__nav('friends'); }} style={{ background:'transparent', cursor:'pointer', color:T.ink3, fontSize:13 }}>← Friends</button>
        <div style={{ width:34, height:34, borderRadius:17, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:15 }}>{name[0].toUpperCase()}</div>
        <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{name}</div>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:10, background:T.bg }}>
        {msgs.length === 0 ? <div style={{ color:T.ink4, fontSize:13, textAlign:'center', marginTop:40 }}>No messages yet. Say hello!</div>
          : msgs.map(function (m) { return <DMBubble key={m.id} side={m.sender === meId ? 'me' : 'them'} name={name}>{m.body}</DMBubble>; })}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:'14px 24px', borderTop:`1px solid ${T.hairline}`, display:'flex', gap:10 }}>
        <input value={text} onChange={function (e) { setText(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') send(); }} placeholder="Message…" style={{ flex:1, padding:'11px 15px', borderRadius:11, border:`1px solid ${T.border}`, fontSize:13.5, color:T.ink, background:T.card, outline:'none' }}/>
        <Btn label="Send" accent={T.brand} onClick={send}/>
      </div>
    </div>
  );
}

function DMBubble({ side, name, children }) {
  const me = side === 'me';
  return (
    <div style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth:'68%', padding:'10px 14px', borderRadius: me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: me ? T.brand : T.card, color: me ? '#fff' : T.ink, fontSize:13.5, lineHeight:1.5, border: me ? 'none' : `1px solid ${T.border}` }}>
        {children}
      </div>
    </div>
  );
}

function FeedIco_heart(filled, color) { return (<svg width="17" height="17" viewBox="0 0 24 24" fill={filled?color:'none'} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>); }
function FeedIco_chat(color) { return (<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6a8.4 8.4 0 0 1-.9-3.9A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>); }
function FeedIco_media(color) { return (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 15l-5-5L5 21"/></svg>); }

function feedAvatar(p, size) {
  var s = size || 40;
  var url = p && p.avatar_url;
  if (url) return <img src={url} style={{ width:s, height:s, borderRadius:s/2, objectFit:'cover', flexShrink:0 }}/>;
  var n = (p && (p.full_name || p.username)) || '?';
  var parts = n.trim().split(/\s+/);
  var initials = (((parts[0]||'')[0]||'') + ((parts[1]||'')[0]||'')).toUpperCase();
  return <div style={{ width:s, height:s, borderRadius:s/2, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:s*0.4, flexShrink:0 }}>{initials}</div>;
}
function feedAgo(ts) { if (!ts) return ''; var d = Date.now() - new Date(ts).getTime(); var m = Math.floor(d/60000); if (m < 1) return 'now'; if (m < 60) return m + 'm'; var h = Math.floor(m/60); if (h < 24) return h + 'h'; return Math.floor(h/24) + 'd'; }

function FeedPostCard(props) {
  const post = props.post;
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [liked, setLiked] = React.useState(post.liked);
  const [likeCount, setLikeCount] = React.useState(post.like_count);
  const [showComments, setShowComments] = React.useState(false);
  const [comments, setComments] = React.useState(null);
  const [ctext, setCtext] = React.useState('');
  const [cCount, setCCount] = React.useState(post.comment_count);
  const [deleted, setDeleted] = React.useState(false);
  const a = post.author_profile || {};
  const name = a.full_name || a.username || 'Learner';
  function toggleLike() { if (!S) return; if (liked) { setLiked(false); setLikeCount(function (c) { return Math.max(0, c-1); }); S.unlikePost(post.id); } else { setLiked(true); setLikeCount(function (c) { return c+1; }); S.likePost(post.id); } }
  function openComments() { var n = !showComments; setShowComments(n); if (n && comments === null && S) S.listComments(post.id).then(function (r) { setComments(r || []); }); }
  function addC() { var b = ctext.trim(); if (!b || !S) return; setCtext(''); S.addComment(post.id, b).then(function (c) { if (c) { setComments(function (prev) { return (prev || []).concat([Object.assign({ profile:{ full_name:'You' } }, c)]); }); setCCount(function (x) { return x+1; }); } }); }
  function removePost() { if (!S) return; setDeleted(true); S.deletePost(post.id); }
  if (deleted) return null;
  return (
    <Card padding={0} style={{ marginBottom:12 }}>
      <div style={{ padding:'14px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:11, marginBottom:10 }}>
          <button onClick={function () { window.__profileId = a.id; window.__nav && window.__nav('public_profile'); }} style={{ background:'transparent', cursor:'pointer' }}>{feedAvatar(a, 40)}</button>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{name}</div>
            <div style={{ fontSize:11, color:T.ink4 }}>{a.username ? '@'+a.username+' · ' : ''}{feedAgo(post.created_at)}{post.visibility === 'friends' ? ' · friends' : ''}</div>
          </div>
          {post.mine && <button onClick={removePost} style={{ fontSize:11, color:T.ink4, background:'transparent', cursor:'pointer' }}>Delete</button>}
        </div>
        <div style={{ fontSize:14, color:T.ink, lineHeight:1.55, whiteSpace:'pre-wrap' }}>{post.body}</div>
        {post.image_url && (/\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(post.image_url) ? <video src={post.image_url} controls playsInline style={{ width:'100%', maxHeight:540, borderRadius:12, marginTop:10, display:'block', background:'#000' }}/> : <img src={post.image_url} style={{ width:'100%', maxHeight:540, objectFit:'cover', borderRadius:12, marginTop:10, display:'block', border:`1px solid ${T.hairline}` }}/>)}
        <div style={{ display:'flex', gap:4, marginTop:12, paddingTop:8, borderTop:`1px solid ${T.hairline}` }}>
          <button onClick={toggleLike} onMouseEnter={function(e){ e.currentTarget.style.background=T.bg2; }} onMouseLeave={function(e){ e.currentTarget.style.background='transparent'; }} style={{ background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color: liked ? T.brand : T.ink3, padding:'7px 13px', borderRadius:9, transition:'background .15s' }}>{FeedIco_heart(liked, liked ? T.brand : T.ink3)}<span>{likeCount > 0 ? likeCount + ' ' : ''}Like</span></button>
          <button onClick={openComments} onMouseEnter={function(e){ e.currentTarget.style.background=T.bg2; }} onMouseLeave={function(e){ e.currentTarget.style.background='transparent'; }} style={{ background:'transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:7, fontSize:12.5, fontWeight:700, color: showComments ? T.ink : T.ink3, padding:'7px 13px', borderRadius:9, transition:'background .15s' }}>{FeedIco_chat(showComments ? T.ink : T.ink3)}<span>{cCount > 0 ? cCount + ' ' : ''}Comment</span></button>
        </div>
      </div>
      {showComments && (
        <div style={{ borderTop:`1px solid ${T.hairline}`, padding:'12px 16px', background:T.bg }}>
          {comments === null ? <div style={{ fontSize:12, color:T.ink4 }}>Loading…</div>
           : comments.length === 0 ? <div style={{ fontSize:12, color:T.ink4, marginBottom:10 }}>No comments yet.</div>
           : comments.map(function (c) { var cn = (c.profile && (c.profile.full_name || c.profile.username)) || 'Learner'; return (
               <div key={c.id} style={{ display:'flex', gap:9, marginBottom:9 }}>
                 {feedAvatar(c.profile, 28)}
                 <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, padding:'7px 11px', flex:1 }}>
                   <div style={{ fontSize:11.5, fontWeight:700, color:T.ink }}>{cn}</div>
                   <div style={{ fontSize:12.5, color:T.ink2, marginTop:1 }}>{c.body}</div>
                 </div>
               </div>
             ); })}
          <div style={{ display:'flex', gap:8, marginTop:6 }}>
            <input value={ctext} onChange={function (e) { setCtext(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') addC(); }} placeholder="Write a comment…" style={{ flex:1, padding:'8px 12px', borderRadius:9, border:`1px solid ${T.border}`, fontSize:12.5, outline:'none', background:T.card }}/>
            <button onClick={addC} style={{ padding:'8px 14px', borderRadius:9, background:T.brand, color:'#fff', fontSize:12.5, fontWeight:700 }}>Post</button>
          </div>
        </div>
      )}
    </Card>
  );
}

function CircleNav(props) {
  var tab = props.tab, setTab = props.setTab;
  var items = [
    { id:'home',     label:'Home',     ico: (Icon.home ? Icon.home({ width:18, height:18 }) : null) },
    { id:'messages', label:'Messages', ico: FeedIco_chat('currentColor') },
    { id:'profile',  label:'Profile',  ico: (Icon.profile ? Icon.profile({ width:18, height:18 }) : null) },
  ];
  return (
    <div style={{ borderBottom:`1px solid ${T.hairline}`, padding:'0 22px', display:'flex', alignItems:'center', justifyContent:'space-between', background:T.card, flexShrink:0 }}>
      <div style={{ display:'flex', gap:2 }}>
        {items.map(function (it) { var a = tab === it.id; return (
          <button key={it.id} onClick={function () { setTab(it.id); }} style={{ display:'flex', alignItems:'center', gap:8, padding:'15px 15px', background:'transparent', cursor:'pointer', fontSize:13.5, fontWeight:700, color: a ? T.ink : T.ink4, borderBottom: a ? `2px solid ${T.brand}` : '2px solid transparent', marginBottom:-1 }}>
            <span style={{ color: a ? T.brand : T.ink3, display:'flex' }}>{it.ico}</span>{it.label}
          </button>
        ); })}
      </div>
      <button onClick={function () { setTab('settings'); }} title="Settings" style={{ width:36, height:36, borderRadius:10, background: tab==='settings' ? T.brandLight : 'transparent', color: tab==='settings' ? T.brand : T.ink3, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.settings ? Icon.settings({ width:18, height:18 }) : '\u2699'}</button>
    </div>
  );
}

function CircleHome() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [posts, setPosts] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const [vis, setVis] = React.useState('public');
  const [posting, setPosting] = React.useState(false);
  const [img, setImg] = React.useState(null);
  const composerFileRef = React.useRef(null);
  function loadPosts() { if (!S) { setPosts([]); return; } S.listPosts(60).then(function (r) { setPosts(r || []); }).catch(function () { setPosts([]); }); }
  React.useEffect(loadPosts, []);
  function submit() { var b = draft.trim(); if ((!b && !img) || !S) return; setPosting(true); var up = img ? S.uploadMedia(img, 'post') : Promise.resolve(null); up.then(function (url) { return S.createPost(b, url, vis); }).then(function () { setDraft(''); setImg(null); setPosting(false); loadPosts(); }).catch(function () { setPosting(false); }); }
  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'24px 24px 48px' }}>
        <Card padding={0} style={{ marginBottom:18, overflow:'hidden' }}>
          <div style={{ display:'flex', gap:12, padding:'16px 16px 0' }}>
            {feedAvatar((typeof window!=='undefined' ? window.__user : null), 40)}
            <textarea value={draft} onChange={function (e) { setDraft(e.target.value); }} placeholder="Share something with your Circle\u2026" rows={2} style={{ flex:1, border:'none', resize:'none', fontSize:15, color:T.ink, outline:'none', background:'transparent', fontFamily:'inherit', lineHeight:1.55, minHeight:46, paddingTop:9 }}/>
          </div>
          {img && <div style={{ padding:'2px 16px 0 68px' }}><div style={{ position:'relative', display:'inline-block' }}>{(img.type && img.type.indexOf('video')===0) ? <video src={URL.createObjectURL(img)} controls style={{ maxHeight:200, borderRadius:12, display:'block' }}/> : <img src={URL.createObjectURL(img)} style={{ maxHeight:200, borderRadius:12, display:'block' }}/>}<button onClick={function () { setImg(null); }} style={{ position:'absolute', top:7, right:7, width:26, height:26, borderRadius:13, background:'rgba(0,0,0,.6)', color:'#fff', cursor:'pointer', fontSize:14, lineHeight:1 }}>\u00d7</button></div></div>}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', marginTop:12, borderTop:`1px solid ${T.hairline}` }}>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              <input ref={composerFileRef} type="file" accept="image/*,video/*" onChange={function (e) { var f = e.target.files && e.target.files[0]; if (f) setImg(f); }} style={{ display:'none' }}/>
              <button onClick={function () { if (composerFileRef.current) composerFileRef.current.click(); }} style={{ display:'flex', alignItems:'center', gap:7, padding:'8px 13px', borderRadius:9, background:T.bg2, cursor:'pointer', fontSize:12.5, color:T.ink2, fontWeight:700 }}>{FeedIco_media(T.ink3)} Media</button>
              <div style={{ display:'flex', background:T.bg2, borderRadius:9, padding:3 }}>
                {[['public','Public'],['friends','Friends']].map(function (o) { var a = vis===o[0]; return <button key={o[0]} onClick={function () { setVis(o[0]); }} style={{ padding:'6px 12px', borderRadius:7, fontSize:11.5, fontWeight:700, cursor:'pointer', border:'none', background:a?T.card:'transparent', color:a?T.ink:T.ink4, boxShadow:a?'0 1px 2px rgba(0,0,0,.08)':'none' }}>{o[1]}</button>; })}
              </div>
            </div>
            <Btn label={posting ? 'Posting\u2026' : 'Post'} accent={T.brand} onClick={submit}/>
          </div>
        </Card>
        {posts === null ? <Card padding={36}><div style={{ color:T.ink3 }}>Loading\u2026</div></Card>
         : posts.length === 0 ? <Card padding={40}><div style={{ textAlign:'center' }}><div style={{ width:52, height:52, borderRadius:26, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>{FeedIco_chat(T.brand)}</div><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:6 }}>Your Circle is quiet</div><div style={{ fontSize:13.5, color:T.ink4, lineHeight:1.6, maxWidth:320, margin:'0 auto' }}>Be the first to post \u2014 share a win, ask a question, or show what you're studying today.</div></div></Card>
         : posts.map(function (p) { return <FeedPostCard key={p.id} post={p}/>; })}
      </div>
    </div>
  );
}

function CircleThread(props) {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const other = props.other;
  const [msgs, setMsgs] = React.useState([]);
  const [text, setText] = React.useState('');
  const [meId, setMeId] = React.useState(null);
  const endRef = React.useRef(null);
  React.useEffect(function () {
    if (!S || !other) return;
    var unsub = function () {};
    S._uid().then(function (id) { setMeId(id); });
    S.thread(other.id).then(function (rows) { setMsgs(rows || []); });
    unsub = S.subscribeMessages(function (m) { if (m.sender === other.id || m.recipient === other.id) { setMsgs(function (prev) { return prev.some(function (x) { return x.id === m.id; }) ? prev : prev.concat([m]); }); } });
    return function () { unsub(); };
  }, [other && other.id]);
  React.useEffect(function () { if (endRef.current) endRef.current.scrollIntoView({ behavior:'smooth' }); }, [msgs.length]);
  function send() { var b = text.trim(); if (!b || !S || !other) return; setText(''); S.sendMessage(other.id, b).then(function (m) { if (m) setMsgs(function (prev) { return prev.some(function (x) { return x.id === m.id; }) ? prev : prev.concat([m]); }); }); }
  const name = other.full_name || other.username || 'Learner';
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 22px', borderBottom:`1px solid ${T.hairline}` }}>
        <button onClick={props.onBack} style={{ background:'transparent', cursor:'pointer', color:T.ink3, fontSize:13, fontWeight:700 }}>\u2190 Messages</button>
        {feedAvatar(other, 32)}
        <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{name}</div>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'22px', display:'flex', flexDirection:'column', gap:9, background:T.bg }}>
        {msgs.length === 0 ? <div style={{ color:T.ink4, fontSize:13, textAlign:'center', marginTop:36 }}>No messages yet. Say hello!</div>
         : msgs.map(function (m) { var me = m.sender === meId; return (
           <div key={m.id} style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
             <div style={{ maxWidth:'72%', padding:'9px 14px', borderRadius: me ? '16px 16px 5px 16px' : '16px 16px 16px 5px', background: me ? T.brand : T.card, color: me ? '#fff' : T.ink, fontSize:13.5, lineHeight:1.5, border: me ? 'none' : `1px solid ${T.border}` }}>{m.body}</div>
           </div>
         ); })}
        <div ref={endRef}/>
      </div>
      <div style={{ padding:'13px 22px', borderTop:`1px solid ${T.hairline}`, display:'flex', gap:10, background:T.card }}>
        <input value={text} onChange={function (e) { setText(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') send(); }} placeholder="Message\u2026" style={{ flex:1, padding:'11px 15px', borderRadius:11, border:`1px solid ${T.border}`, fontSize:13.5, color:T.ink, background:T.bg, outline:'none' }}/>
        <Btn label="Send" accent={T.brand} onClick={send}/>
      </div>
    </div>
  );
}

function CircleMessages() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [convos, setConvos] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  React.useEffect(function () {
    if (!S) { setConvos([]); return; }
    if (window.__dmUser) { setOpen(window.__dmUser); window.__dmUser = null; }
    S.conversations().then(function (r) { setConvos(r || []); }).catch(function () { setConvos([]); });
  }, []);
  if (open) return <CircleThread other={open} onBack={function () { setOpen(null); }}/>;
  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'22px 18px 48px' }}>
        {convos === null ? <Card padding={36}><div style={{ color:T.ink3 }}>Loading\u2026</div></Card>
         : convos.length === 0 ? <Card padding={40}><div style={{ textAlign:'center' }}><div style={{ width:52, height:52, borderRadius:26, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>{FeedIco_chat(T.brand)}</div><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:6 }}>No messages yet</div><div style={{ fontSize:13.5, color:T.ink4, lineHeight:1.6, maxWidth:320, margin:'0 auto 16px' }}>Find a learner and start a conversation \u2014 your chats will live here.</div><Btn label="Find people" accent={T.brand} onClick={function () { window.__nav && window.__nav('friends'); }}/></div></Card>
         : <Card padding={0}>{convos.map(function (c, i) { var nm = (c.profile && (c.profile.full_name || c.profile.username)) || 'Learner'; return (
             <button key={c.otherId} onClick={function () { setOpen(c.profile); }} style={{ display:'flex', alignItems:'center', gap:13, padding:'13px 16px', width:'100%', textAlign:'left', background:'transparent', cursor:'pointer', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
               {feedAvatar(c.profile, 46)}
               <div style={{ flex:1, minWidth:0 }}>
                 <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{nm}</div>
                 <div style={{ fontSize:12.5, color:T.ink4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{c.last ? c.last.body : ''}</div>
               </div>
               <div style={{ fontSize:11, color:T.ink5 }}>{c.last ? feedAgo(c.last.created_at) : ''}</div>
             </button>
           ); })}</Card>}
      </div>
    </div>
  );
}

function CircleProfile() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [me, setMe] = React.useState(undefined);
  const [myPosts, setMyPosts] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef(null);
  function load() { if (!S) { setMe(null); return; } S.myProfile().then(function (p) { setMe(p || null); }); S.listPosts(100).then(function (r) { setMyPosts((r || []).filter(function (p) { return p.mine; })); }).catch(function () { setMyPosts([]); }); }
  React.useEffect(load, []);
  function onPick(e) { var f = e.target.files && e.target.files[0]; if (!f || !S) return; setUploading(true); S.uploadMedia(f, 'avatar').then(function (url) { if (url) return S.setAvatar(url); }).then(function () { setUploading(false); load(); }).catch(function () { setUploading(false); }); }
  const name = me ? (me.full_name || me.username || 'You') : '';
  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <div style={{ maxWidth:600, margin:'0 auto', padding:'28px 24px 48px' }}>
        {me === undefined ? <Card padding={36}><div style={{ color:T.ink3 }}>Loading\u2026</div></Card> : <>
          <div style={{ display:'flex', alignItems:'center', gap:18, marginBottom:22 }}>
            <div style={{ position:'relative' }}>
              {feedAvatar(me, 88)}
              <input ref={fileRef} type="file" accept="image/*" onChange={onPick} style={{ display:'none' }}/>
              <button onClick={function () { if (fileRef.current) fileRef.current.click(); }} title="Change photo" style={{ position:'absolute', bottom:-2, right:-2, width:30, height:30, borderRadius:15, background:T.brand, color:'#fff', border:`2px solid ${T.card}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{FeedIco_media('#fff')}</button>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink }}>{name}</div>
              {me && me.username && <div style={{ fontSize:13, color:T.ink4, marginTop:2 }}>@{me.username}</div>}
              {uploading && <div style={{ fontSize:11.5, color:T.brand, marginTop:4 }}>Uploading photo\u2026</div>}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:24 }}>
            {[{ v: me ? (me.xp||0) : 0, l:'XP' }, { v: me ? (me.streak||0) : 0, l:'Day streak' }, { v: (me ? (me.best_score||0) : 0)+'%', l:'Best score' }].map(function (st) { return (
              <Card key={st.l} padding={18}><div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1 }}>{st.v}</div><div style={{ fontSize:10, fontWeight:800, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginTop:7 }}>{st.l}</div></Card>
            ); })}
          </div>
          <div style={{ fontSize:12, fontWeight:800, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Your posts</div>
          {myPosts === null ? <Card padding={28}><div style={{ color:T.ink3 }}>Loading\u2026</div></Card>
           : myPosts.length === 0 ? <Card padding={28}><div style={{ color:T.ink4, fontSize:13 }}>You haven't posted yet. Share something from Home.</div></Card>
           : myPosts.map(function (p) { return <FeedPostCard key={p.id} post={p}/>; })}
        </>}
      </div>
    </div>
  );
}

function CircleSettings() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [me, setMe] = React.useState(undefined);
  const [uname, setUname] = React.useState('');
  const [pub, setPub] = React.useState(true);
  const [saved, setSaved] = React.useState('');
  React.useEffect(function () { if (!S) { setMe(null); return; } S.myProfile().then(function (p) { setMe(p || null); if (p) { setUname(p.username || ''); setPub(p.is_public !== false); } }); }, []);
  function saveUsername() { if (!S) return; var v = uname.trim(); S.setUsername(v || null).then(function () { setSaved('Saved'); setTimeout(function () { setSaved(''); }, 1500); }); }
  function togglePublic(v) { setPub(v); if (S) S.setProfilePublic(v); }
  function signOut() { if (window.FL && window.FL.auth) { window.FL.auth.signOut().then(function () { window.__nav && window.__nav('auth_login'); }); } else { window.__nav && window.__nav('auth_login'); } }
  return (
    <div style={{ flex:1, overflow:'auto' }}>
      <div style={{ maxWidth:560, margin:'0 auto', padding:'28px 24px 48px' }}>
        <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, marginBottom:18 }}>Circle settings</div>
        <Card padding={20} style={{ marginBottom:14 }}>
          <div style={{ fontSize:12, fontWeight:800, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Username</div>
          <div style={{ display:'flex', gap:10 }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:4, padding:'10px 13px', borderRadius:10, border:`1px solid ${T.border}`, background:T.bg }}>
              <span style={{ color:T.ink4, fontSize:14 }}>@</span>
              <input value={uname} onChange={function (e) { setUname(e.target.value.replace(/[^a-zA-Z0-9_]/g,'')); }} placeholder="username" style={{ flex:1, border:'none', outline:'none', background:'transparent', fontSize:14, color:T.ink }}/>
            </div>
            <Btn label={saved || 'Save'} accent={T.brand} onClick={saveUsername}/>
          </div>
          <div style={{ fontSize:11.5, color:T.ink4, marginTop:8 }}>People find you in Friends by your name or @username.</div>
        </Card>
        <Card padding={20} style={{ marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Public profile</div>
              <div style={{ fontSize:12, color:T.ink4, marginTop:3, maxWidth:320 }}>{pub ? 'Anyone on Fluentra can find you and see your public posts.' : 'You\'re hidden from search and the leaderboard. Friends-only.'}</div>
            </div>
            <button onClick={function () { togglePublic(!pub); }} style={{ width:50, height:28, borderRadius:14, background: pub ? T.brand : T.border, position:'relative', cursor:'pointer', border:'none', flexShrink:0, transition:'background .2s' }}>
              <div style={{ position:'absolute', top:3, left: pub ? 25 : 3, width:22, height:22, borderRadius:11, background:'#fff', transition:'left .2s', boxShadow:'0 1px 3px rgba(0,0,0,.2)' }}/>
            </button>
          </div>
        </Card>
        <Card padding={8} style={{ marginBottom:14 }}>
          <button onClick={function () { window.__nav && window.__nav('settings'); }} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', padding:'12px 14px', background:'transparent', cursor:'pointer', borderRadius:10 }}>
            <span style={{ fontSize:13.5, fontWeight:600, color:T.ink }}>Account & app settings</span>
            <span style={{ color:T.ink4 }}>{Icon.chev ? Icon.chev({ width:16, height:16 }) : '\u203a'}</span>
          </button>
        </Card>
        <button onClick={signOut} style={{ width:'100%', padding:'13px', borderRadius:11, background:'transparent', border:`1px solid ${T.border}`, color:'#B00020', fontSize:13.5, fontWeight:700, cursor:'pointer' }}>Sign out</button>
      </div>
    </div>
  );
}

function ActivityFeedPage() {
  const [tab, setTab] = React.useState((typeof window !== 'undefined' && window.__dmUser) ? 'messages' : 'home');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <CircleNav tab={tab} setTab={setTab}/>
      {tab === 'home' ? <CircleHome/>
       : tab === 'messages' ? <CircleMessages/>
       : tab === 'profile' ? <CircleProfile/>
       : <CircleSettings/>}
    </div>
  );
}

function PhrasebookPage() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const lang = (typeof window !== 'undefined' && window.__langCode) ? window.__langCode : 'en';
  const [items, setItems] = React.useState(null);
  const [front, setFront] = React.useState('');
  const [back, setBack] = React.useState('');
  function load() { if (!S) { setItems([]); return; } S.listPhrases(lang).then(function (r) { setItems(r || []); }).catch(function () { setItems([]); }); }
  React.useEffect(load, [lang]);
  function add() { var fr = front.trim(); if (!fr || !S) return; setFront(''); setBack(''); S.addPhrase(lang, fr, back.trim()).then(function () { load(); }); }
  function del(id) { if (!S) return; S.deletePhrase(id).then(function () { load(); }); }
  const langName = (typeof langByCode === 'function') ? (langByCode(lang).english || lang) : lang;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 36px' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, marginBottom:6 }}>Phrasebook</div>
          <div style={{ fontSize:13, color:T.ink4, marginBottom:20 }}>Save {langName} words and phrases you want to remember.</div>
          <Card padding={16} style={{ marginBottom:18, display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:10, alignItems:'center' }}>
            <input value={front} onChange={function (e) { setFront(e.target.value); }} placeholder={langName + ' word or phrase'} style={{ padding:'10px 13px', borderRadius:10, border:`1px solid ${T.border}`, fontSize:13.5, outline:'none', background:T.bg }}/>
            <input value={back} onChange={function (e) { setBack(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') add(); }} placeholder="Meaning (optional)" style={{ padding:'10px 13px', borderRadius:10, border:`1px solid ${T.border}`, fontSize:13.5, outline:'none', background:T.bg }}/>
            <Btn label="Add" accent={T.brand} onClick={add}/>
          </Card>
          {items === null ? <Card padding={36}><div style={{ color:T.ink3 }}>Loading…</div></Card>
           : items.length === 0 ? <Card padding={36}><div style={{ color:T.ink3, fontSize:13.5 }}>No saved phrases yet. Add your first {langName} phrase above.</div></Card>
           : <Card padding={0}>{items.map(function (p) { return (
               <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px', borderBottom:`1px solid ${T.hairline}` }}>
                 <div style={{ flex:1 }}><div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{p.front}</div>{p.back && <div style={{ fontSize:12.5, color:T.ink4, marginTop:2 }}>{p.back}</div>}</div>
                 <button onClick={function () { del(p.id); }} style={{ fontSize:11.5, color:T.ink4, background:'transparent', cursor:'pointer' }}>Remove</button>
               </div>
             ); })}</Card>}
        </div>
      </div>
    </div>
  );
}

function PhrasebookPracticePage() {
  const nav = window.__nav || (() => {});
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const lang = (typeof window !== 'undefined' && window.__langCode) ? window.__langCode : 'en';
  const locale = (typeof TUTOR_LOCALE !== 'undefined' && TUTOR_LOCALE[lang]) ? TUTOR_LOCALE[lang] : 'en-US';
  const [phrases, setPhrases] = useState(null);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [mode, setMode] = useState('listen'); // listen | speak
  React.useEffect(function () { if (!S) { setPhrases([]); return; } S.listPhrases(lang).then(function (r) { setPhrases(r || []); }).catch(function () { setPhrases([]); }); }, [lang]);

  const all = phrases || [];
  const total = all.length;
  const phrase = all[idx];
  const progress = total ? ((idx + 1) / total) * 100 : 0;
  const catName = 'Saved phrases';

  function speak() { try { if ('speechSynthesis' in window && phrase) { window.speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(phrase.front); u.lang = locale; window.speechSynthesis.speak(u); } } catch (e) {} }
  const next = () => { setRevealed(false); if (idx < total - 1) setIdx(idx + 1); else nav('phrasebook'); };
  const prev = () => { setRevealed(false); if (idx > 0) setIdx(idx - 1); };

  if (phrases === null) return (<div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink3 }}>Loading…</div>);
  if (total === 0) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:40, background:T.bg }}>
      <div style={{ fontSize:14, color:T.ink3 }}>No saved phrases to practice yet.</div>
      <Btn label="Back to phrasebook" accent={T.brand} onClick={() => nav('phrasebook')}/>
    </div>
  );

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.bg, overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 32px', borderBottom:`1px solid ${T.hairline}`, background:T.card }}>
        <button onClick={() => nav('phrasebook')} style={{ width:34, height:34, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg2, color:T.ink2, cursor:'pointer' }}>
          {Icon.x ? Icon.x({ width:14, height:14 }) : <span style={{ fontSize:18, fontWeight:300 }}>×</span>}
        </button>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:3 }}>Phrasebook practice · {catName}</div>
          <div style={{ height:6, background:T.bg2, borderRadius:99, overflow:'hidden' }}>
            <div style={{ width:`${progress}%`, height:'100%', background:T.brand, borderRadius:99, transition:'width .3s' }}/>
          </div>
        </div>
        <div style={{ fontFamily:T.mono, fontSize:13, color:T.ink2 }}>{idx + 1} / {total}</div>
      </div>

      {/* Mode toggle */}
      <div style={{ display:'flex', justifyContent:'center', padding:'18px 0 8px' }}>
        <div style={{ display:'inline-flex', background:T.bg2, padding:4, borderRadius:99, gap:2 }}>
          {[
            { id:'listen', label:'Listen', ic:Icon.play },
            { id:'speak',  label:'Speak & repeat', ic:Icon.mic },
          ].map(m => (
            <button key={m.id} onClick={() => setMode(m.id)} style={{
              padding:'8px 18px', borderRadius:99, fontSize:12.5, fontWeight:700,
              background: mode === m.id ? T.card : 'transparent',
              color: mode === m.id ? T.ink : T.ink3,
              boxShadow: mode === m.id ? '0 1px 4px rgba(0,0,0,.06)' : 'none',
              display:'flex', alignItems:'center', gap:6, cursor:'pointer'
            }}>
              {m.ic && m.ic({ width:11, height:11 })} {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px 40px 40px' }}>
        <div style={{ width:'100%', maxWidth:680, background:T.card, border:`1px solid ${T.border}`, borderRadius:24, padding:'56px 48px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,.06)' }}>
          {/* Phrase */}
          <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.25, color:T.ink, marginBottom:20, fontStyle:'italic' }}>"{phrase?.front}"</div>

          {/* Listen button big */}
          {mode === 'listen' && (
            <button style={{
              width:72, height:72, borderRadius:'50%', background:T.brand, color:'#fff',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 12px 28px rgba(192,74,6,.35)', cursor:'pointer', marginBottom:24
            }} onClick={speak}>{Icon.play({ width:24, height:24 })}</button>
          )}
          {mode === 'speak' && (
            <button style={{
              width:72, height:72, borderRadius:'50%', background:T.speaking.c, color:'#fff',
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 12px 28px ${T.speaking.c}55`, cursor:'pointer', marginBottom:24
            }} onClick={speak}>{Icon.mic({ width:24, height:24 })}</button>
          )}

          {/* Reveal */}
          {revealed ? (
            <div style={{ borderTop:`1px solid ${T.hairline}`, paddingTop:20, marginTop:8 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>Translation</div>
              <div style={{ fontSize:18, color:T.ink2 }}>{phrase?.back || '—'}</div>
            </div>
          ) : (
            <button onClick={() => setRevealed(true)} style={{ fontSize:13, fontWeight:700, color:T.brand, padding:'8px 14px', borderRadius:8, background:T.bg2, cursor:'pointer' }}>
              Reveal translation
            </button>
          )}
        </div>
      </div>

      {/* Footer nav */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 40px', borderTop:`1px solid ${T.hairline}`, background:T.card }}>
        <button onClick={prev} disabled={idx === 0} style={{ padding:'10px 16px', borderRadius:10, fontSize:13, fontWeight:700, color: idx === 0 ? T.ink4 : T.ink2, background:T.bg2, cursor: idx === 0 ? 'default' : 'pointer', opacity: idx === 0 ? .5 : 1 }}>← Previous</button>
        <div style={{ display:'flex', gap:8 }}>
          <Btn label={idx === total - 1 ? 'Finish' : 'Next phrase →'} accent={T.brand} onClick={next}/>
        </div>
      </div>
    </div>
  );
}

function ReceiptsPage() {
  const u = (typeof window !== 'undefined' && window.__user) || {};
  const isPaid = (u.plan === 'pro' || u.plan === 'max');
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Billing" title="Receipts and invoices" subtitle="Your payment history is kept in the secure billing portal."/>
        <Card padding={24} style={{ maxWidth:560 }}>
          {isPaid ? (
            <div>
              <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.6, marginBottom:16 }}>
                View and download every invoice and receipt, update your card, or change your billing address in the secure billing portal.
              </div>
              <Btn label="Open billing portal" accent={T.brand} onClick={() => window.FL && window.FL.openBillingPortal && window.FL.openBillingPortal()}/>
            </div>
          ) : (
            <div>
              <div style={{ fontSize:13.5, color:T.ink2, lineHeight:1.6, marginBottom:16 }}>
                You're on the Free plan, so there are no charges or invoices yet. Upgrade to Pro or Max and your receipts will appear in the billing portal.
              </div>
              <Btn label="See plans" nav="pricing" accent={T.brand}/>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function ReferPage() {
  const [code, setCode] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  React.useEffect(function () { if (window.FL && window.FL.social) { window.FL.social._uid().then(function (id) { if (id) setCode('FL-' + id.slice(0, 8).toUpperCase()); }); } }, []);
  const link = code ? (window.location.origin + '/?ref=' + code) : '';
  function copy() { if (!link) return; try { navigator.clipboard.writeText(link); setCopied(true); setTimeout(function () { setCopied(false); }, 1500); } catch (e) {} }
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 36px' }}>
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, marginBottom:6 }}>Invite friends</div>
          <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6, marginBottom:22 }}>Share your personal link so friends can join you on Fluentra and you can practice together.</div>
          <Card padding={24}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Your invite link</div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ flex:1, padding:'12px 14px', borderRadius:10, background:T.bg2, fontSize:13, color:T.ink2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{link || 'Sign in to get your link'}</div>
              <Btn label={copied ? 'Copied' : 'Copy'} accent={T.brand} onClick={copy}/>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PublicProfilePage, DMThreadPage, ActivityFeedPage, PhrasebookPage, PhrasebookPracticePage, ReceiptsPage, ReferPage });
