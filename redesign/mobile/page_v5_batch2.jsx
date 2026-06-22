// ── Mobile · v5 redesigns · Batch 2 ───────────────────────────────
// Tutor Call · Tutor History · Public Profile · DM Thread · Activity Feed

const useStV5B2 = React.useState;
const useEfV5B2 = React.useEffect;

const V5b2Pre = ({ eyebrow, title, lede }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b2Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b2Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);

// ══════════════════════════════════════════════════════════════════
// TUTOR VOICE CALL
// ══════════════════════════════════════════════════════════════════
function MTutorCallPageV5() {
  const [secs, setSecs] = useStV5B2(0);
  const [muted, setMuted] = useStV5B2(false);
  const [speaker, setSpeaker] = useStV5B2(true);
  const [tab, setTab] = useStV5B2('live');
  const nav = (id) => window.__nav && window.__nav(id);
  useEfV5B2(()=>{ const t = setInterval(()=>setSecs(s=>s+1), 1000); return ()=>clearInterval(t); }, []);
  const fmt = (s) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const transcript = [
    { who:'tutor', t:'Hola Maria. ¿Cómo te ha ido la semana?',  tr:'Hi Maria. How has your week gone?' },
    { who:'you',   t:'Bien, gracias. He estado practicando mucho.', tr:'Good, thanks. I\'ve been practicing a lot.' },
    { who:'tutor', t:'Excelente. Hoy vamos a hablar del trabajo.',  tr:'Excellent. Today we\'ll talk about work.' },
    { who:'you',   t:'Vale, perfecto.',                              tr:'OK, great.' },
  ];
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background:T.ink, color:'#fff', overflow:'hidden', position:'relative' }}>
      <V5b2Dot/>
      {/* Top */}
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 16px' }}>
        <button onClick={()=>nav('tutor')} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'#fff' }}>×</button>
        <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', borderRadius:99, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)' }}>
          <div style={{ width:6, height:6, borderRadius:3, background:'#5BD17A', boxShadow:'0 0 6px #5BD17A' }}/>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:'.06em' }}>LIVE · {fmt(secs)}</span>
        </div>
      </div>

      {/* Tutor card */}
      <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', padding:'20px 18px 14px' }}>
        <div style={{ position:'absolute', top:30, left:'50%', transform:'translateX(-50%)', width:360, height:360, borderRadius:'50%', background:`radial-gradient(circle, ${T.brand}30 0%, transparent 70%)` }}/>
        <div style={{ position:'relative', textAlign:'center', marginBottom:20 }}>
          <div style={{ width:108, height:108, borderRadius:54, background:`linear-gradient(135deg, ${T.brand} 0%, #B85C2A 100%)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:42, margin:'0 auto 16px', boxShadow:`0 12px 32px ${T.brand}55, inset 0 0 0 1px rgba(255,255,255,.12)` }}>S</div>
          <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:5 }}>Sofía Martínez</div>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.55)', letterSpacing:'.04em' }}>Madrid · Native · Lesson 3 of 8</div>
        </div>

        {/* Audio waveform */}
        <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:46, marginBottom:18 }}>
          {Array.from({length:36}).map((_,i)=>{
            const phase = (secs * 8 + i * 23) % 100;
            const h = 6 + Math.abs(Math.sin(phase * .1)) * 32;
            return <div key={i} style={{ width:3, height:h, borderRadius:2, background: i % 7 === 0 ? T.brand : `rgba(255,255,255,${0.25 + (h/40)*0.5})` }}/>;
          })}
        </div>

        {/* Tabs */}
        <div style={{ position:'relative', display:'flex', gap:2, background:'rgba(255,255,255,.06)', borderRadius:11, padding:3, marginBottom:11, border:'1px solid rgba(255,255,255,.08)' }}>
          {[{id:'live',l:'Transcript'},{id:'notes',l:'Lesson notes'}].map(t => {
            const a = tab === t.id;
            return <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:'7px 6px', borderRadius:9, fontSize:11, fontWeight: a?700:500, color: a?T.ink:'rgba(255,255,255,.6)', background: a?'#fff':'transparent' }}>{t.l}</button>;
          })}
        </div>

        <div style={{ position:'relative', flex:1, overflow:'auto', background:'rgba(255,255,255,.04)', borderRadius:13, border:'1px solid rgba(255,255,255,.08)', padding:14 }}>
          {tab === 'live' ? transcript.map((m, i) => (
            <div key={i} style={{ marginBottom:11 }}>
              <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:3 }}>
                <span style={{ fontSize:9.5, fontWeight:800, color: m.who==='tutor'?T.brand:'rgba(255,255,255,.5)', letterSpacing:'.1em' }}>{m.who === 'tutor' ? 'SOFÍA' : 'YOU'}</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:14, color:'#fff', lineHeight:1.4, marginBottom:2 }}>{m.t}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.45)', fontFamily:T.serif, fontStyle:'italic' }}>{m.tr}</div>
            </div>
          )) : (
            <div>
              <div style={{ fontSize:9.5, fontWeight:800, color:T.brand, letterSpacing:'.12em', marginBottom:8 }}>TODAY'S FOCUS</div>
              <ul style={{ fontSize:12, color:'rgba(255,255,255,.85)', lineHeight:1.7, paddingLeft:18, margin:'0 0 10px' }}>
                <li>Vocabulary for office &amp; work</li>
                <li>Past-tense conjugation review</li>
                <li>Polite-form practice</li>
              </ul>
              <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:'rgba(255,255,255,.6)' }}>"Sofía will send a written summary after the call."</div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', gap:14, padding:'18px 16px 26px', borderTop:'1px solid rgba(255,255,255,.08)' }}>
        <button onClick={()=>setMuted(m=>!m)} style={{ width:54, height:54, borderRadius:27, background: muted ? T.brand : 'rgba(255,255,255,.08)', border:`1px solid ${muted ? T.brand : 'rgba(255,255,255,.14)'}`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.mic ? Icon.mic({width:18,height:18}) : '🎙'}</button>
        <button onClick={()=>nav('tutor')} style={{ width:64, height:64, borderRadius:32, background:'#D63E3E', color:'#fff', boxShadow:'0 8px 24px rgba(214,62,62,.4)', border:'none', fontSize:20 }}>✕</button>
        <button onClick={()=>setSpeaker(s=>!s)} style={{ width:54, height:54, borderRadius:27, background: speaker ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.14)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.head ? Icon.head({width:18,height:18}) : '🔊'}</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// TUTOR HISTORY
// ══════════════════════════════════════════════════════════════════
function MTutorHistoryPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const sessions = [];  // AI-tutor session history will populate here once persisted
  return (
    <>
      <MobileHeader back title="Tutor history"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b2Pre eyebrow={`${sessions.length} SESSIONS`} title="Your tutor sessions" lede="Your conversations with the AI tutor are saved here."/>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[{l:'SESSIONS',v:sessions.length},{l:'AVG SCORE',v:'\u2014'},{l:'STREAK',v:'\u2014'}].map(s => (
            <MCard key={s.l} style={{ padding:'12px 10px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div><div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginTop:5 }}>{s.l}</div></MCard>
          ))}
        </div>

        {V5b2Lbl('PAST SESSIONS')}
        {sessions.length === 0 && <MCard style={{ padding:24, textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:6 }}>No sessions yet</div><div style={{ fontSize:12.5, color:T.ink4, lineHeight:1.55, marginBottom:16 }}>Talk to your AI tutor and your sessions will appear here.</div><button onClick={()=>nav('tutor')} style={{ padding:'11px 18px', borderRadius:11, background:T.brand, color:'#fff', fontSize:12.5, fontWeight:700, border:'none' }}>Talk to your tutor</button></MCard>}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {sessions.map((s, i) => (
            <button key={i} onClick={()=>nav('tutor_call')} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:13, padding:14, textAlign:'left', boxShadow:MT.shadowSm }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:7, gap:8 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:4 }}>{s.d.toUpperCase()} · {s.t}</div>
                  <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.2, marginBottom:3 }}>{s.topic}</div>
                  <div style={{ fontSize:11.5, color:T.ink3 }}>with {s.tutor}</div>
                </div>
                <div style={{ textAlign:'right', flexShrink:0 }}>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.score}</div>
                  <div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.1em', marginTop:2 }}>SCORE</div>
                </div>
              </div>
              <div style={{ paddingTop:8, borderTop:`1px solid ${T.hairline}`, fontFamily:T.serif, fontStyle:'italic', fontSize:11.5, color:T.ink3, lineHeight:1.4 }}>"{s.summary}"</div>
              <div style={{ display:'flex', gap:5, marginTop:9 }}>
                <span style={{ fontSize:10, fontWeight:700, color:T.brand, padding:'3px 8px', borderRadius:99, background:T.brandLight }}>+{s.xp} XP</span>
                <span style={{ fontSize:10, fontWeight:700, color:T.ink3, padding:'3px 8px', borderRadius:99, background:T.bg2 }}>30 min</span>
              </div>
            </button>
          ))}
        </div>

        <button onClick={()=>nav('tutor')} style={{ width:'100%', marginTop:16, padding:'13px', borderRadius:12, background:T.ink, color:'#fff', fontSize:12.5, fontWeight:700 }}>Book another session</button>
      </MobileBody>
    </>
  );
}

// ══════════════════════════════════════════════════════════════════
// PUBLIC PROFILE
// ══════════════════════════════════════════════════════════════════
function MPublicProfilePageV5() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const id = (typeof window !== 'undefined') ? window.__profileId : null;
  const [p, setP] = React.useState(undefined);
  const [rel, setRel] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  function load() {
    if (!S || !id) { setP(null); return; }
    S.getProfile(id).then(function (pr) { setP(pr || null); });
    S._uid().then(function (me) {
      if (me === id) { setRel({ k:'me' }); return; }
      S.listFriends().then(function (d) {
        var fr = (d.friends || []).filter(function (x) { return x.profile.id === id; })[0];
        var out = (d.outgoing || []).filter(function (x) { return x.profile.id === id; })[0];
        var inc = (d.incoming || []).filter(function (x) { return x.profile.id === id; })[0];
        if (fr) setRel({ k:'friend', fid:fr.friendshipId });
        else if (out) setRel({ k:'pending_out' });
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
  function ini(n) { n = n || '?'; var parts = n.trim().split(/\s+/); return (((parts[0]||'')[0]||'') + ((parts[1]||'')[0]||'')).toUpperCase(); }
  const name = p ? (p.full_name || p.username || 'Learner') : '';
  return (
    <>
      <MobileHeader back title="Profile"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        {p === undefined ? <MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13 }}>Loading…</div></MCard>
         : !p ? <MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13 }}>Profile not found.</div></MCard>
         : <>
           <div style={{ textAlign:'center', padding:'16px 0 20px' }}>
             <div style={{ position:'relative', display:'inline-block' }}>
               {p.avatar_url ? <img src={p.avatar_url} style={{ width:84, height:84, borderRadius:42, objectFit:'cover' }}/> : V5_av(ini(name), 84, T.brandGrad)}
               {rel && rel.k === 'me' && (<>
                 <input ref={fileRef} type="file" accept="image/*" onChange={onPickAvatar} style={{ display:'none' }}/>
                 <button onClick={function () { if (fileRef.current) fileRef.current.click(); }} style={{ position:'absolute', bottom:0, right:0, width:28, height:28, borderRadius:14, background:T.brand, color:'#fff', border:`2px solid ${T.card}`, fontSize:13 }}>{uploading ? '…' : '✎'}</button>
               </>)}
             </div>
             <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, marginTop:12 }}>{name}</div>
             {p.username && <div style={{ fontSize:12.5, color:T.ink4, marginTop:2 }}>@{p.username}</div>}
           </div>
           <div style={{ marginBottom:16 }}>
             {rel && rel.k === 'me' ? <div style={{ textAlign:'center', fontSize:12.5, color:T.ink4 }}>This is you</div>
              : rel && rel.k === 'friend' ? <div style={{ display:'flex', gap:8 }}><button onClick={function(){ window.__dmUser=p; window.__nav&&window.__nav('dm_thread'); }} style={{ flex:1, padding:'12px', borderRadius:11, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700 }}>Message</button><button disabled={busy} onClick={function(){ act(S.removeFriend(rel.fid)); }} style={{ padding:'12px 16px', borderRadius:11, background:'transparent', border:`1px solid ${T.border}`, color:T.ink2, fontSize:13, fontWeight:700 }}>Remove</button></div>
              : rel && rel.k === 'pending_out' ? <div style={{ textAlign:'center', fontSize:12.5, color:T.ink4 }}>Request sent</div>
              : rel && rel.k === 'pending_in' ? <button disabled={busy} onClick={function(){ act(S.respondFriendRequest(rel.fid,true)); }} style={{ width:'100%', padding:'12px', borderRadius:11, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700 }}>Accept request</button>
              : rel && rel.k === 'none' ? <button disabled={busy} onClick={function(){ act(S.sendFriendRequest(id)); }} style={{ width:'100%', padding:'12px', borderRadius:11, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700 }}>Add friend</button> : null}
           </div>
           <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
             {[{v:p.xp||0,l:'XP'},{v:p.streak||0,l:'STREAK'},{v:(p.best_score||0)+'%',l:'BEST'}].map(function (st) { return <MCard key={st.l} style={{ padding:'14px 8px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1 }}>{st.v}</div><div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginTop:5 }}>{st.l}</div></MCard>; })}
           </div>
         </>}
      </MobileBody>
    </>
  );
}

function MDMThreadPageV5() {
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
    unsub = S.subscribeMessages(function (m) { if (m.sender === other.id || m.recipient === other.id) { setMsgs(function (prev) { return prev.some(function (x) { return x.id === m.id; }) ? prev : prev.concat([m]); }); } });
    return function () { unsub(); };
  }, [other && other.id]);
  React.useEffect(function () { if (endRef.current) endRef.current.scrollIntoView({ behavior:'smooth' }); }, [msgs.length]);
  function send() { var b = text.trim(); if (!b || !S || !other) return; setText(''); S.sendMessage(other.id, b).then(function (m) { if (m) setMsgs(function (prev) { return prev.some(function (x) { return x.id === m.id; }) ? prev : prev.concat([m]); }); }); }
  const name = other ? (other.full_name || other.username || 'Learner') : '';
  if (!other) return (<><MobileHeader back title="Messages"/><MobileBody padding={[0,16,30]} tabBarPad={false}><MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13 }}>Open a chat from Friends or a profile.</div></MCard></MobileBody></>);
  return (
    <>
      <MobileHeader back title={name}/>
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0 }}>
        <div style={{ flex:1, overflow:'auto', padding:'16px', display:'flex', flexDirection:'column', gap:8 }}>
          {msgs.length === 0 ? <div style={{ color:T.ink4, fontSize:12.5, textAlign:'center', marginTop:30 }}>No messages yet. Say hello!</div>
           : msgs.map(function (m) { var me = m.sender === meId; return (
             <div key={m.id} style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
               <div style={{ maxWidth:'76%', padding:'9px 13px', borderRadius: me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: me ? T.brand : T.card, color: me ? '#fff' : T.ink, fontSize:13.5, lineHeight:1.5, border: me ? 'none' : `1px solid ${T.border}` }}>{m.body}</div>
             </div>
           ); })}
          <div ref={endRef}/>
        </div>
        <div style={{ padding:'12px 16px', borderTop:`1px solid ${T.hairline}`, display:'flex', gap:8, background:T.card }}>
          <input value={text} onChange={function (e) { setText(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') send(); }} placeholder="Message…" style={{ flex:1, padding:'11px 14px', borderRadius:11, border:`1px solid ${T.border}`, fontSize:13.5, outline:'none', background:T.bg }}/>
          <button onClick={send} style={{ padding:'11px 18px', borderRadius:11, background:T.brand, color:'#fff', fontSize:13.5, fontWeight:700 }}>Send</button>
        </div>
      </div>
    </>
  );
}

function MFeedPostCard(props) {
  const post = props.post; const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [liked, setLiked] = React.useState(post.liked);
  const [lc, setLc] = React.useState(post.like_count);
  const [open, setOpen] = React.useState(false);
  const [comments, setComments] = React.useState(null);
  const [ct, setCt] = React.useState('');
  const [cc, setCc] = React.useState(post.comment_count);
  const [del, setDel] = React.useState(false);
  const a = post.author_profile || {}; const name = a.full_name || a.username || 'Learner';
  function ini(n) { n = n || '?'; var p = n.trim().split(/\s+/); return (((p[0]||'')[0]||'') + ((p[1]||'')[0]||'')).toUpperCase(); }
  function ago(ts) { if (!ts) return ''; var d = Date.now()-new Date(ts).getTime(); var m = Math.floor(d/60000); if (m<1) return 'now'; if (m<60) return m+'m'; var h = Math.floor(m/60); if (h<24) return h+'h'; return Math.floor(h/24)+'d'; }
  function tl() { if (!S) return; if (liked) { setLiked(false); setLc(function (c) { return Math.max(0,c-1); }); S.unlikePost(post.id); } else { setLiked(true); setLc(function (c) { return c+1; }); S.likePost(post.id); } }
  function oc() { var n = !open; setOpen(n); if (n && comments === null && S) S.listComments(post.id).then(function (r) { setComments(r || []); }); }
  function addc() { var b = ct.trim(); if (!b || !S) return; setCt(''); S.addComment(post.id, b).then(function (c) { if (c) { setComments(function (p) { return (p||[]).concat([Object.assign({ profile:{ full_name:'You' } }, c)]); }); setCc(function (x) { return x+1; }); } }); }
  function rm() { if (!S) return; setDel(true); S.deletePost(post.id); }
  if (del) return null;
  return (
    <MCard style={{ padding:0, marginBottom:10, overflow:'hidden' }}>
      <div style={{ padding:'12px 14px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
          {a.avatar_url ? <img src={a.avatar_url} style={{ width:36, height:36, borderRadius:18, objectFit:'cover' }}/> : V5_av(ini(name), 36, T.brandGrad)}
          <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{name}</div><div style={{ fontSize:10.5, color:T.ink5 }}>{a.username?'@'+a.username+' · ':''}{ago(post.created_at)}{post.visibility==='friends'?' · friends':''}</div></div>
          {post.mine && <button onClick={rm} style={{ fontSize:10.5, color:T.ink4, background:'transparent' }}>Delete</button>}
        </div>
        <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5, whiteSpace:'pre-wrap' }}>{post.body}</div>
        {post.image_url && (/\.(mp4|mov|webm|m4v|ogg)(\?|$)/i.test(post.image_url) ? <video src={post.image_url} controls playsInline style={{ width:'100%', borderRadius:10, marginTop:8, display:'block', background:'#000' }}/> : <img src={post.image_url} style={{ width:'100%', borderRadius:10, marginTop:8, display:'block' }}/>)}
        <div style={{ display:'flex', gap:16, marginTop:10 }}>
          <button onClick={tl} style={{ background:'transparent', fontSize:12, fontWeight:700, color: liked?T.brand:T.ink3 }}>{liked?'♥':'♡'} {lc>0?lc:''} Like</button>
          <button onClick={oc} style={{ background:'transparent', fontSize:12, fontWeight:700, color:T.ink3 }}>💬 {cc>0?cc:''} Comment</button>
        </div>
      </div>
      {open && (
        <div style={{ borderTop:`1px solid ${T.hairline}`, padding:'10px 14px', background:T.bg }}>
          {comments === null ? <div style={{ fontSize:11.5, color:T.ink4 }}>Loading…</div>
           : comments.length === 0 ? <div style={{ fontSize:11.5, color:T.ink4, marginBottom:8 }}>No comments yet.</div>
           : comments.map(function (c) { var cn = (c.profile && (c.profile.full_name || c.profile.username)) || 'Learner'; return <div key={c.id} style={{ marginBottom:7 }}><span style={{ fontSize:11.5, fontWeight:700, color:T.ink }}>{cn}</span> <span style={{ fontSize:12, color:T.ink2 }}>{c.body}</span></div>; })}
          <div style={{ display:'flex', gap:7, marginTop:4 }}>
            <input value={ct} onChange={function (e) { setCt(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter') addc(); }} placeholder="Comment…" style={{ flex:1, padding:'8px 11px', borderRadius:9, border:`1px solid ${T.border}`, fontSize:12.5, outline:'none', background:T.card }}/>
            <button onClick={addc} style={{ padding:'8px 13px', borderRadius:9, background:T.brand, color:'#fff', fontSize:12, fontWeight:700 }}>Send</button>
          </div>
        </div>
      )}
    </MCard>
  );
}

function MActivityFeedPageV5() {
  const S = (window.FL && window.FL.social) ? window.FL.social : null;
  const [tab, setTab] = React.useState('posts');
  const [posts, setPosts] = React.useState(null);
  const [activity, setActivity] = React.useState(null);
  const [draft, setDraft] = React.useState('');
  const [vis, setVis] = React.useState('public');
  const [posting, setPosting] = React.useState(false);
  const [img, setImg] = React.useState(null);
  const composerFileRef = React.useRef(null);
  function loadPosts() { if (!S) { setPosts([]); return; } S.listPosts(60).then(function (r) { setPosts(r || []); }).catch(function () { setPosts([]); }); }
  function loadAct() { if (!S) { setActivity([]); return; } S.feed(60).then(function (r) { setActivity(r || []); }).catch(function () { setActivity([]); }); }
  React.useEffect(function () { loadPosts(); }, []);
  React.useEffect(function () { if (tab === 'activity' && activity === null) loadAct(); }, [tab]);
  function submit() { var b = draft.trim(); if ((!b && !img) || !S) return; setPosting(true); var up = img ? S.uploadMedia(img, 'post') : Promise.resolve(null); up.then(function (url) { return S.createPost(b, url, vis); }).then(function () { setDraft(''); setImg(null); setPosting(false); loadPosts(); }).catch(function () { setPosting(false); }); }
  function ini(n) { n = n || 'A'; var p = n.trim().split(/\s+/); return (((p[0]||'')[0]||'') + ((p[1]||'')[0]||'')).toUpperCase(); }
  function ago(ts) { if (!ts) return ''; var d = Date.now()-new Date(ts).getTime(); var m = Math.floor(d/60000); if (m<1) return 'now'; if (m<60) return m+'m'; var h = Math.floor(m/60); if (h<24) return h+'h'; return Math.floor(h/24)+'d'; }
  function al(a) { var who = (a.profile && (a.profile.full_name || a.profile.username)) || 'A learner'; var lang = a.lang ? (' · '+a.lang.toUpperCase()) : ''; if (a.kind === 'mock') return who+' finished a mock'+(a.detail && a.detail.score!=null?(' ('+Math.round(a.detail.score)+'%)'):'')+lang; if (a.kind === 'lesson') return who+' did a '+((a.detail && a.detail.module)||'practice')+' session'+(a.detail && a.detail.score!=null?(' · '+Math.round(a.detail.score)+'%'):'')+lang; return who+' practiced'+lang; }
  return (
    <>
      <MobileHeader title="Feed"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ display:'flex', gap:6, marginBottom:14, marginTop:4 }}>
          {[['posts','Posts'],['activity','Activity']].map(function (t) { var a = tab===t[0]; return <button key={t[0]} onClick={function () { setTab(t[0]); }} style={{ flex:1, padding:'8px', borderRadius:9, background:a?T.ink:T.card, color:a?'#fff':T.ink3, fontSize:12.5, fontWeight:a?700:600, border:`1px solid ${a?T.ink:T.hairline}` }}>{t[1]}</button>; })}
        </div>
        {tab === 'posts' ? (
          <>
            <MCard style={{ padding:12, marginBottom:14 }}>
              <textarea value={draft} onChange={function (e) { setDraft(e.target.value); }} placeholder="What did you learn today?" rows={3} style={{ width:'100%', border:'none', resize:'vertical', fontSize:13.5, color:T.ink, outline:'none', background:'transparent', fontFamily:'inherit' }}/>
              {img && <div style={{ marginTop:8, position:'relative', display:'inline-block' }}>{(img.type && img.type.indexOf('video')===0) ? <video src={URL.createObjectURL(img)} controls style={{ maxHeight:120, borderRadius:10, display:'block' }}/> : <img src={URL.createObjectURL(img)} style={{ maxHeight:120, borderRadius:10, display:'block' }}/>}<button onClick={function () { setImg(null); }} style={{ position:'absolute', top:5, right:5, width:22, height:22, borderRadius:11, background:'rgba(0,0,0,.6)', color:'#fff', fontSize:12 }}>×</button></div>}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8, paddingTop:8, borderTop:`1px solid ${T.hairline}` }}>
                <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                  <input ref={composerFileRef} type="file" accept="image/*,video/*" onChange={function (e) { var fl = e.target.files && e.target.files[0]; if (fl) setImg(fl); }} style={{ display:'none' }}/>
                  <button onClick={function () { if (composerFileRef.current) composerFileRef.current.click(); }} style={{ background:'transparent', fontSize:13, color:T.ink3, fontWeight:700 }}>📷</button>
                  <select value={vis} onChange={function (e) { setVis(e.target.value); }} style={{ fontSize:12, fontWeight:600, color:T.ink2, border:`1px solid ${T.border}`, borderRadius:8, padding:'6px 9px', background:T.card }}><option value="public">🌍 Public</option><option value="friends">👥 Friends</option></select>
                </div>
                <button onClick={submit} style={{ padding:'9px 18px', borderRadius:10, background:T.brandGrad, color:'#fff', fontSize:13, fontWeight:700 }}>{posting?'…':'Post'}</button>
              </div>
            </MCard>
            {posts === null ? <MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13 }}>Loading…</div></MCard>
             : posts.length === 0 ? <MCard style={{ padding:20 }}><div style={{ color:T.ink3, fontSize:12.5, lineHeight:1.5 }}>No posts yet. Share a win or a question.</div></MCard>
             : posts.map(function (p) { return <MFeedPostCard key={p.id} post={p}/>; })}
          </>
        ) : (
          activity === null ? <MCard style={{ padding:24 }}><div style={{ color:T.ink3, fontSize:13 }}>Loading…</div></MCard>
          : activity.length === 0 ? <MCard style={{ padding:20 }}><div style={{ color:T.ink3, fontSize:12.5 }}>No activity yet.</div></MCard>
          : <MCard style={{ padding:0, overflow:'hidden' }}>{activity.map(function (a, i) { return (
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                {V5_av(ini((a.profile && (a.profile.full_name || a.profile.username)) || 'A'), 34, T.brandGrad)}
                <div style={{ flex:1, fontSize:12.5, color:T.ink, lineHeight:1.4 }}>{al(a)}</div>
                <div style={{ fontSize:10.5, color:T.ink5 }}>{ago(a.created_at)}</div>
              </div>
            ); })}</MCard>
        )}
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MTutorCallPageV5, MTutorHistoryPageV5, MPublicProfilePageV5, MDMThreadPageV5, MActivityFeedPageV5,
});
