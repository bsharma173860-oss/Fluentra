// ── AI Tutor — full chat experience ─────────────────────
const { useState: useStateAT, useRef: useRefAT, useEffect: useEffectAT } = React;

// History conversations (sidebar)
const TUTOR_HISTORY = [
  { id:'h1', title:'New conversation', lang:'\u2014', when:'Now', active:true },
];

function tutorQuick(L) {
  L = L || 'this language';
  return [
    { ic:'✦', label:'Explain a grammar rule',     prompt:'Can you explain when to use the present perfect vs simple past?' },
    { ic:'❤︎', label:'Practice a conversation',   prompt:'Let\'s practice a conversation at a restaurant in ' + L + '.' },
    { ic:'✎', label:'Check my writing',            prompt:'I\'ll paste an essay below — please give me IELTS-style feedback.' },
    { ic:'⌕', label:'Translate something',         prompt:'How do I naturally say "I\'m running late, sorry!" in ' + L + '?' },
    { ic:'☆', label:'Build vocabulary',            prompt:'Give me 10 useful B2-level ' + L + ' phrases for talking about feelings.' },
    { ic:'⚡', label:'Mock exam question',          prompt:'Give me a Speaking Part 2 cue card for IELTS, then critique my answer.' },
  ];
}

const TUTOR_INITIAL = [
  { role:'ai', text:"Hi! I'm your AI language tutor. Ask me anything \u2014 grammar, vocabulary, conversation practice, writing feedback, or exam prep. What would you like to work on?", when:'just now', actions:['Practice conversation','Explain a grammar point','Help with my writing','Exam prep'] },
];

// ── Message bubble
function Bubble({ role, text, when, actions, onAction, onFeedback }) {
  const isAI = role === 'ai';
  const lines = text.split('\n');
  return (
    <div style={{ display:'flex', gap:12, marginBottom:18, flexDirection: isAI ? 'row' : 'row-reverse' }}>
      <div style={{ width:32, height:32, borderRadius:10, background: isAI ? T.brandGrad || T.brand : T.ink, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>
        {isAI ? '✦' : (((window.__user && (window.__user.name || window.__user.full_name)) || 'You').charAt(0).toUpperCase())}
      </div>
      <div style={{ flex:1, minWidth:0, maxWidth:680 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6, justifyContent: isAI ? 'flex-start' : 'flex-end' }}>
          <span style={{ fontSize:12, fontWeight:700, color:T.ink }}>{isAI ? 'Fluentra Tutor' : 'You'}</span>
          <span style={{ fontSize:11, color:T.ink4 }}>· {when}</span>
        </div>
        <div style={{ background: isAI ? T.card : T.ink, color: isAI ? T.ink : '#fff', padding:'14px 18px', borderRadius:14, borderTopLeftRadius: isAI ? 4 : 14, borderTopRightRadius: isAI ? 14 : 4, fontSize:14, lineHeight:1.6, border: isAI ? `1px solid ${T.border}` : 'none', boxShadow: isAI ? `0 2px 6px rgba(0,0,0,.03)` : 'none' }}>
          {lines.map((line, i) => {
            if (line.startsWith('> ')) return <div key={i} style={{ borderLeft:`3px solid ${T.brand}`, padding:'4px 0 4px 12px', margin:'8px 0', fontStyle:'italic', color: isAI ? T.ink2 : 'rgba(255,255,255,.85)', fontFamily:T.serif, fontSize:14.5 }}>{line.slice(2)}</div>;
            const parts = line.split(/\*\*(.+?)\*\*/g);
            return <div key={i} style={{ marginBottom: line ? 4 : 8 }}>{parts.map((p, j) => j % 2 ? <strong key={j} style={{ color: isAI ? T.brand : '#fff' }}>{p}</strong> : <span key={j}>{p}</span>)}</div>;
          })}
        </div>
        {actions && (
          <div style={{ display:'flex', gap:7, marginTop:10, flexWrap:'wrap' }}>
            {actions.map(a => (
              <button key={a} onClick={() => onAction && onAction(a)} style={{ padding:'7px 12px', borderRadius:99, background:T.bg2, border:`1px solid ${T.border}`, fontSize:11.5, color:T.ink2, fontWeight:600, cursor:'pointer' }}>{a}</button>
            ))}
          </div>
        )}
        {isAI && (
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            {[
              { k:'up',   svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 11V21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3zm0 0l5-9 1 1a2 2 0 0 1 .5 1.7l-.5 4.3h6a2 2 0 0 1 2 2.3l-1.5 8A2 2 0 0 1 17.5 21H7"/></svg> },
              { k:'dn',   svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ transform:'rotate(180deg)' }}><path d="M7 11V21H4a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h3zm0 0l5-9 1 1a2 2 0 0 1 .5 1.7l-.5 4.3h6a2 2 0 0 1 2 2.3l-1.5 8A2 2 0 0 1 17.5 21H7"/></svg> },
              { k:'copy', svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> },
              { k:'redo', svg:<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10"/></svg> },
            ].map(b => (
              <button key={b.k} onClick={() => onFeedback && onFeedback(b.k, text)} style={{ width:26, height:26, borderRadius:7, background:'transparent', color:T.ink4, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>{b.svg}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Topic threads — each history item starts a distinct conversation when clicked.
const TUTOR_THREADS = {
  h1: { topic:'New conversation', context:'Ask me anything', msgs: TUTOR_INITIAL },
};

// ── Desktop tutor page
function TutorPage() {
  const [activeId, setActiveId] = useStateAT('h1');
  const [msgs, setMsgs] = useStateAT(TUTOR_THREADS.h1.msgs);
  const [topic, setTopic] = useStateAT(TUTOR_THREADS.h1.topic);
  const [context, setContext] = useStateAT(TUTOR_THREADS.h1.context);
  const [input, setInput] = useStateAT('');
  const [thinking, setThinking] = useStateAT(false);
  const [recording, setRecording] = useStateAT(false);
  const [recSecs, setRecSecs] = useStateAT(0);
  const [searchQ, setSearchQ] = useStateAT('');
  const [showTopicPicker, setShowTopicPicker] = useStateAT(false);
  const [showLangPicker, setShowLangPicker] = useStateAT(false);
  const [showMore, setShowMore] = useStateAT(false);
  const [toast, setToast] = useStateAT('');
  const [savedFlash, setSavedFlash] = useStateAT(false);
  const [feedback, setFeedback] = useStateAT({}); // text → 'up'/'dn'
  const [chatLang, setChatLang] = useStateAT((function(){ try { var c = (typeof window !== 'undefined') && window.__langCode; var L = (c && typeof langByCode === 'function') ? langByCode(c).english : null; return L || 'English'; } catch (e) { return 'English'; } })());
  const scrollRef = useRefAT(null);
  const fileRef = useRefAT(null);
  const recTimer = useRefAT(null);
  const mic = (typeof useMicRecorder === 'function') ? useMicRecorder() : null;

  function flashToast(msg) { setToast(msg); setTimeout(() => setToast(''), 2400); }

  function loadThread(id) {
    const t = TUTOR_THREADS[id]; if (!t) return;
    setActiveId(id);
    setMsgs(t.msgs);
    setTopic(t.topic);
    setContext(t.context);
    setSavedFlash(false);
    setFeedback({});
  }

  function newThread() {
    const id = 'n' + Date.now();
    TUTOR_THREADS[id] = { topic:'New conversation', context:'Pick a topic', msgs:[{ role:'ai', text:"Fresh start. What would you like to work on?", when:'just now', actions:['Grammar','Conversation','Vocabulary','Exam practice'] }] };
    loadThread(id);
  }

  function changeTopicTo(label) {
    setTopic(label);
    setContext(label);
    setShowTopicPicker(false);
    setMsgs(m => [...m, { role:'ai', text:`Switching context to **${label}**. What's on your mind?`, when:'just now' }]);
  }

  useEffectAT(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking]);

  // Voice: real mic capture (useMicRecorder) + on stop, transcribe via Whisper
  // (speaking-eval) and feed the transcript to the tutor as a real user turn.
  useEffectAT(() => {
    if (recording) {
      recTimer.current = setInterval(() => setRecSecs(s => s + 1), 1000);
      const auto = setTimeout(() => stopVoice(), 30000);
      return () => { clearInterval(recTimer.current); clearTimeout(auto); };
    }
  }, [recording]);

  function startVoice() { setRecSecs(0); setRecording(true); try { if (mic && !mic.recording) mic.toggle(); } catch (e) {} }
  function cancelVoice() { setRecording(false); setRecSecs(0); clearInterval(recTimer.current); try { if (mic && mic.recording) mic.toggle(); } catch (e) {} }
  async function stopVoice() {
    setRecording(false);
    clearInterval(recTimer.current);
    setRecSecs(0);
    try { if (mic && mic.recording) mic.toggle(); } catch (e) {}
    if (!mic) return;
    setThinking(true);
    let b64 = null;
    for (let i = 0; i < 25 && !b64; i++) { await new Promise(r => setTimeout(r, 100)); try { b64 = await mic.getBase64(); } catch (e) {} }
    if (!b64) { setThinking(false); setMsgs(m => [...m, { role:'ai', text:"I couldn't access that recording — check your mic permission and try again.", when:'just now' }]); return; }
    try {
      const r = await fetch('/api/speaking-eval', { method:'POST', headers:Object.assign({ 'Content-Type':'application/json' }, window.__authHeaders ? window.__authHeaders() : {}), body: JSON.stringify({ audioBase64: b64, mimeType:'audio/webm', prompt:'Casual spoken message to a language tutor', lang: chatLang }) });
      const j = await r.json();
      if (j && j.limit) { setThinking(false); if (window.__upgrade) window.__upgrade('tutor'); return; }
      const transcript = (j && j.transcript) ? String(j.transcript).trim() : '';
      setThinking(false);
      if (transcript) send(transcript);
      else setMsgs(m => [...m, { role:'ai', text:"I couldn't make out any speech there — try again, a bit closer to the mic?", when:'just now' }]);
    } catch (e) { setThinking(false); setMsgs(m => [...m, { role:'ai', text:"I had trouble processing that recording — try again?", when:'just now' }]); }
  }

  function openAttach() { if (fileRef.current) fileRef.current.click(); }
  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    e.target.value = '';
    const kb = Math.max(1, Math.round(f.size / 1024));
    const isText = (f.type && f.type.indexOf('text/') === 0) || /\.(txt|md|markdown|csv|tsv|json|rtf|tex|log|srt|vtt)$/i.test(f.name);
    if (isText) {
      const reader = new FileReader();
      reader.onload = () => {
        const content = String(reader.result || '').slice(0, 12000);
        send('📎 ' + f.name + ' · ' + kb + ' KB', { apiText: 'I\'ve attached my file "' + f.name + '". Please read it and help me with it:\n\n' + content });
      };
      reader.onerror = () => setMsgs(m => [...m, { role:'ai', text:"I couldn't read that file — try pasting the text instead?", when:'just now' }]);
      reader.readAsText(f);
    } else {
      const ext = (f.name.split('.').pop() || '').toUpperCase();
      setMsgs(m => [...m, { role:'user', text:'📎 ' + f.name + ' · ' + kb + ' KB', when:'just now' }]);
      setMsgs(m => [...m, { role:'ai', text:"I can read text files (.txt, .md, .csv, code) directly. For " + ext + " files I can't open the binary here \u2014 paste the text and I'll dig right in.", when:'just now' }]);
    }
  }

  const send = async (text, opts) => {
    opts = opts || {};
    if (!text || !text.trim()) return;
    const apiText = opts.apiText || text;   // what the tutor model receives (may differ from the chat bubble)
    const userMsg = { role:'user', text, when:'just now' };
    const history = msgs.map(mm => ({ role: mm.role === 'ai' ? 'assistant' : 'user', content: mm.text })).concat([{ role:'user', content: apiText }]);
    setMsgs(m => [...m, userMsg]);
    setInput('');
    setThinking(true);
    try {
      const resp = await fetch('/api/tutor', {
        method:'POST', headers:Object.assign({ 'Content-Type':'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
        body: JSON.stringify({ messages: history, lang: chatLang, context: context }),
      });
      const data = await resp.json();
      if (data && data.limit) { setThinking(false); if (window.__upgrade) window.__upgrade('tutor'); return; }
      if (!resp.ok || data.error) throw new Error(data.error || 'tutor error');
      setMsgs(m => [...m, { role:'ai', text: data.reply || '…', when:'just now' }]);
    } catch (e) {
      setMsgs(m => [...m, { role:'ai', text: 'Sorry — I had trouble responding (' + (e.message || e) + '). Please try again.', when:'just now' }]);
    }
    setThinking(false);
  };

  // Wire action chips (Band critique / Rewrite suggestions / Mark phonemes / etc):
  // treat them as a user reply with the chosen string, then have AI respond meaningfully.
  // Action chips now go to the real tutor as a user turn.
  function handleAction(action) {
    send(action);
  }

  function handleFeedback(kind, text) {
    setFeedback(f => ({ ...f, [text]: kind }));
    if (kind === 'copy') { try { navigator.clipboard.writeText(text); } catch {} flashToast('Copied to clipboard'); }
    else if (kind === 'redo') { setMsgs(m => [...m, { role:'ai', text:'Rewriting that response with more depth…', when:'just now' }]); }
    else flashToast(kind === 'up' ? 'Thanks — noted' : 'Got it — I’ll adjust');
  }

  function saveAsFlashcards() {
    setSavedFlash(true);
    flashToast('5 flashcards saved to your deck');
  }

  function saveConvo() {
    try { localStorage.setItem(`__tutor_saved_${activeId}`, JSON.stringify({ topic, msgs })); } catch {}
    flashToast('Conversation saved');
  }

  function shareConvo() {
    const url = `${location.origin}${location.pathname}#tutor/${encodeURIComponent(topic)}`;
    try { navigator.clipboard.writeText(url); } catch {}
    flashToast('Share link copied');
  }

  // Suggested-next: each suggestion routes to a real page in the app.
  const SUGGEST_ROUTES = {
    'Practice writing a body paragraph': 'writing',
    'Take a Task 2 mini-exam':           'mock_test',
    'Watch: 5 cohesion mistakes':        'lesson_detail',
  };

  const filteredHistory = TUTOR_HISTORY.concat(
    Object.keys(TUTOR_THREADS).filter(k => k.startsWith('n')).map(k => ({ id:k, title:TUTOR_THREADS[k].topic, lang:'—', when:'Today' }))
  ).filter(h => !searchQ.trim() || h.title.toLowerCase().includes(searchQ.toLowerCase()));

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden', background:T.bg }}>
      <style>{`@keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } } @keyframes typing { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }`}</style>

      {/* Conversation history sidebar */}
      <aside style={{ width:280, borderRight:`1px solid ${T.border}`, background:T.bg2, display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'18px 16px 12px', borderBottom:`1px solid ${T.hairline}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>AI Tutor</div>
            <button onClick={newThread} title="Start new conversation" style={{ width:30, height:30, borderRadius:8, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer', border:'none' }}>+</button>
          </div>
          <div style={{ position:'relative' }}>
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search history…" style={{ width:'100%', padding:'8px 12px 8px 30px', borderRadius:9, border:`1px solid ${T.border}`, background:T.card, fontSize:12.5, fontFamily:'inherit', outline:'none', boxSizing:'border-box' }}/>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:12, color:T.ink5 }}>⌕</span>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'8px 8px 16px' }}>
          {['Today','Yesterday','Earlier'].map(group => {
            const items = filteredHistory.filter(h => group === 'Today' ? h.when === 'Today' : group === 'Yesterday' ? h.when === 'Yesterday' : !['Today','Yesterday'].includes(h.when));
            if (!items.length) return null;
            return (
              <div key={group} style={{ marginTop:10 }}>
                <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', padding:'4px 8px 6px' }}>{group}</div>
                {items.map(h => {
                  const sel = activeId === h.id;
                  return (
                    <button key={h.id} onClick={() => loadThread(h.id)} style={{ width:'100%', padding:'10px 10px', borderRadius:9, background: sel ? T.card : 'transparent', border: sel ? `1px solid ${T.border}` : '1px solid transparent', display:'flex', flexDirection:'column', gap:3, alignItems:'flex-start', textAlign:'left', cursor:'pointer', marginBottom:2 }}>
                      <div style={{ fontSize:12.5, color:T.ink, fontWeight: sel ? 600 : 500, lineHeight:1.35, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%' }}>{h.title}</div>
                      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                        <span style={{ fontSize:10, color:T.ink4 }}>{h.lang}</span>
                        <span style={{ width:3, height:3, borderRadius:1.5, background:T.ink5 }}/>
                        <span style={{ fontSize:10, color:T.ink4 }}>{h.when}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
        <div style={{ padding:'12px 14px', borderTop:`1px solid ${T.hairline}`, fontSize:11, color:T.ink4, lineHeight:1.5 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span>This month</span>
            <span style={{ color:T.ink2, fontWeight:600 }}>142 of ∞</span>
          </div>
          <div style={{ height:3, background:T.hairline, borderRadius:99 }}>
            <div style={{ height:'100%', width:'34%', background:T.brand, borderRadius:99 }}/>
          </div>
        </div>
      </aside>

      {/* Chat column */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ padding:'14px 24px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:14, background:T.bg, flexShrink:0 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:T.brandGrad || T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>✦</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>{topic}</div>
            <div style={{ fontSize:11.5, color:T.listening?.c || '#1A8F4E', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:3, background:T.listening?.c || '#1A8F4E', animation:'pulse 1.6s infinite' }}/> Online · {context}
            </div>
          </div>
          <div style={{ display:'flex', gap:6, position:'relative' }}>
            <button onClick={saveConvo} style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${T.border}`, background:T.card, fontSize:12, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Save</button>
            <button onClick={shareConvo} style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${T.border}`, background:T.card, fontSize:12, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Share</button>
            <button onClick={() => setShowMore(s => !s)} style={{ width:32, height:32, borderRadius:8, border:`1px solid ${T.border}`, background:T.card, color:T.ink3, cursor:'pointer' }}>⋯</button>
            {showMore && (
              <div onMouseLeave={() => setShowMore(false)} style={{ position:'absolute', top:'calc(100% + 6px)', right:0, width:180, background:'#fff', border:`1px solid ${T.border}`, borderRadius:10, boxShadow:'0 12px 28px rgba(0,0,0,.12)', padding:6, zIndex:30 }}>
                {['Rename topic','Export as PDF','Delete conversation'].map(o => (
                  <button key={o} onClick={() => { setShowMore(false); if (o.startsWith('Delete')) { newThread(); } else flashToast(`${o} · coming with backend`); }} style={{ width:'100%', padding:'8px 10px', borderRadius:7, background:'transparent', fontSize:12, color: o.startsWith('Delete') ? '#C0392B' : T.ink2, fontWeight:500, textAlign:'left', border:'none', cursor:'pointer' }}>{o}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'24px 24px 8px' }}>
          <div style={{ maxWidth:840, margin:'0 auto' }}>
            {msgs.map((m, i) => <Bubble key={i} {...m} onAction={handleAction} onFeedback={handleFeedback}/>)}
            {thinking && (
              <div style={{ display:'flex', gap:12, marginBottom:18 }}>
                <div style={{ width:32, height:32, borderRadius:10, background:T.brandGrad || T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>✦</div>
                <div style={{ background:T.card, border:`1px solid ${T.border}`, padding:'14px 18px', borderRadius:14, borderTopLeftRadius:4, display:'flex', gap:5 }}>
                  {[0,1,2].map(i => <span key={i} style={{ width:7, height:7, borderRadius:4, background:T.ink4, animation:'typing 1.2s infinite', animationDelay:`${i*.15}s` }}/>)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick prompts (appear above input when input is empty) */}
        {input === '' && (
          <div style={{ padding:'10px 24px 4px', borderTop:`1px solid ${T.hairline}` }}>
            <div style={{ maxWidth:840, margin:'0 auto', display:'flex', gap:7, flexWrap:'wrap' }}>
              {tutorQuick(chatLang).map(q => (
                <button key={q.label} onClick={() => setInput(q.prompt)} style={{ padding:'7px 12px', borderRadius:99, background:T.bg2, border:`1px solid ${T.border}`, fontSize:11.5, color:T.ink2, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ color:T.brand }}>{q.ic}</span> {q.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Composer */}
        <div style={{ padding:'12px 24px 18px', background:T.bg, flexShrink:0 }}>
          <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.txt,image/*,audio/*" onChange={onFile} style={{ display:'none' }}/>
          {recording && (
            <div style={{ maxWidth:840, margin:'0 auto 8px', padding:'10px 14px', background:'#FCE6E2', border:'1px solid #F4C9C0', borderRadius:12, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ width:9, height:9, borderRadius:'50%', background:'#C0392B', animation:'pulse 1s infinite' }}/>
              <span style={{ fontSize:12, color:'#7A2A1F', fontWeight:600 }}>Recording … 0:{String(recSecs).padStart(2,'0')}</span>
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:2, height:20 }}>
                {Array.from({ length:28 }).map((_,i) => (
                  <div key={i} style={{ flex:1, height:`${25 + Math.abs(Math.sin((Date.now()/120)+i*0.6))*70}%`, background:'#C0392B', borderRadius:1.5, opacity: .65 + (i % 3 ? .2 : 0) }}/>
                ))}
              </div>
              <button onClick={cancelVoice} style={{ padding:'5px 10px', borderRadius:7, background:'transparent', color:'#7A2A1F', fontSize:11, fontWeight:700, cursor:'pointer', border:'1px solid #C0392B' }}>Cancel</button>
              <button onClick={() => stopVoice()} style={{ padding:'5px 12px', borderRadius:7, background:'#C0392B', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', border:'none' }}>Send</button>
            </div>
          )}
          <div style={{ maxWidth:840, margin:'0 auto', background:T.card, border:`1.5px solid ${T.border}`, borderRadius:14, padding:'10px 12px 8px', boxShadow:`0 2px 8px rgba(0,0,0,.04)` }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder="Ask your tutor anything — grammar, conversation practice, exam tips…"
              rows={2}
              style={{ width:'100%', border:'none', outline:'none', resize:'none', fontSize:14, fontFamily:'inherit', color:T.ink, background:'transparent', padding:'6px 4px' }}
            />
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:6 }}>
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={openAttach} title="Attach a file" style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                </button>
                <button onClick={recording ? () => stopVoice() : startVoice} title={recording ? 'Stop recording' : 'Record voice'} style={{ width:32, height:32, borderRadius:8, background: recording ? '#C0392B' : 'transparent', color: recording ? '#fff' : T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
                </button>
                <button onClick={() => flashToast('Long-form draft mode — paste text in the box below')} title="Long-form" style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>
                </button>
                <div style={{ height:24, width:1, background:T.hairline, margin:'4px 4px' }}/>
                <div style={{ position:'relative' }}>
                  <button onClick={() => setShowLangPicker(s => !s)} style={{ padding:'6px 10px', borderRadius:8, background:T.bg2, fontSize:11.5, color:T.ink2, fontWeight:600, display:'flex', alignItems:'center', gap:5, cursor:'pointer', border:'none' }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:T.ink4 }}/>
                    {chatLang} ▾
                  </button>
                  {showLangPicker && (
                    <div style={{ position:'absolute', bottom:'calc(100% + 6px)', left:0, width:170, background:'#fff', border:`1px solid ${T.border}`, borderRadius:10, boxShadow:'0 12px 28px rgba(0,0,0,.14)', padding:6, zIndex:30 }}>
                      {(function(){ try { var ls = (typeof userLanguages === 'function') ? userLanguages().map(function (l) { return l.english; }) : []; ls = ls.filter(function (v, i, a) { return v && a.indexOf(v) === i; }); return ls.length ? ls : ['English']; } catch (e) { return ['English']; } })().map(L => (
                        <button key={L} onClick={() => { setChatLang(L); setShowLangPicker(false); flashToast(`Tutor now responds in ${L}`); }} style={{ width:'100%', padding:'8px 10px', borderRadius:7, background:'transparent', fontSize:12, color:T.ink2, fontWeight: chatLang === L ? 700 : 500, textAlign:'left', border:'none', cursor:'pointer' }}>{L}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontSize:10.5, color:T.ink4 }}>⏎ to send · ⇧⏎ for newline</span>
                <button onClick={() => send(input)} disabled={!input.trim()} style={{ width:36, height:36, borderRadius:10, background: input.trim() ? T.brand : T.bg2, color: input.trim() ? '#fff' : T.ink5, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, cursor: input.trim() ? 'pointer' : 'default' }}>↑</button>
              </div>
            </div>
          </div>
          <div style={{ maxWidth:840, margin:'8px auto 0', textAlign:'center', fontSize:10.5, color:T.ink5 }}>The tutor can make mistakes. Always verify critical info, especially exam-specific advice.</div>
        </div>
      </div>

      {/* Right panel — context */}
      <aside style={{ width:300, borderLeft:`1px solid ${T.border}`, background:T.bg2, display:'flex', flexDirection:'column', flexShrink:0, overflowY:'auto', position:'relative' }}>
        {toast && (
          <div style={{ position:'absolute', top:14, left:14, right:14, padding:'10px 12px', background:T.ink, color:'#fff', borderRadius:9, fontSize:12, fontWeight:600, zIndex:20, boxShadow:'0 8px 20px rgba(0,0,0,.2)', animation:'pulse .25s' }}>{toast}</div>
        )}
        <div style={{ padding:'18px 18px 14px' }}>
          <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Context</div>
          <Card padding={14}>
            <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:8 }}>Active topic</div>
            <Chip label={context} accent={T.writing?.c || '#C4503E'} bg={T.writing?.bg || T.brandLight}/>
            <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.5, marginTop:10 }}>The tutor will tailor explanations and examples to this topic’s conventions and rubrics.</div>
            <button onClick={() => setShowTopicPicker(true)} style={{ marginTop:10, fontSize:11.5, color:T.brand, fontWeight:700, cursor:'pointer', background:'transparent', border:'none', padding:0 }}>Change topic →</button>
          </Card>
          {showTopicPicker && (
            <div onClick={() => setShowTopicPicker(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
              <div onClick={e => e.stopPropagation()} style={{ width:420, background:'#fff', borderRadius:14, padding:'22px 22px 18px', boxShadow:'0 30px 60px rgba(0,0,0,.3)' }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase' }}>Switch context</div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginTop:4, marginBottom:14 }}>What should the tutor focus on?</div>
                <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                  {['IELTS · Writing Task 2','IELTS · Speaking Part 2','DELE B2 · Comprensión','JLPT N3 · Grammar','General conversation','Resume coaching'].map(opt => (
                    <button key={opt} onClick={() => changeTopicTo(opt)} style={{ padding:'11px 14px', borderRadius:10, background: context === opt ? T.brandLight : T.bg2, color: context === opt ? T.brand : T.ink2, fontSize:13, fontWeight:600, textAlign:'left', border:`1px solid ${context === opt ? T.brand : 'transparent'}`, cursor:'pointer' }}>{opt}</button>
                  ))}
                </div>
                <button onClick={() => setShowTopicPicker(false)} style={{ marginTop:14, fontSize:12, color:T.ink4, background:'transparent', border:'none', cursor:'pointer' }}>Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div style={{ padding:'4px 18px 14px' }}>
          <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>From this chat</div>
          <Card padding={14}>
            <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:10 }}>5 things to remember</div>
            {[
              'Topic sentence opens every body paragraph',
              'Use contrasting linkers: however, whereas',
              'Reference back with "this", "such"',
              'Pronoun chains improve cohesion',
              'Avoid overusing "Firstly, Secondly…"',
            ].map(t => (
              <div key={t} style={{ display:'flex', gap:8, alignItems:'flex-start', padding:'7px 0', borderTop:`1px solid ${T.hairline}` }}>
                <span style={{ width:5, height:5, borderRadius:2.5, background:T.brand, marginTop:7, flexShrink:0 }}/>
                <span style={{ fontSize:11.5, color:T.ink2, lineHeight:1.5 }}>{t}</span>
              </div>
            ))}
            <button onClick={saveAsFlashcards} disabled={savedFlash} style={{ marginTop:10, fontSize:11.5, color: savedFlash ? '#1A8F4E' : T.brand, fontWeight:700, cursor: savedFlash ? 'default' : 'pointer', background:'transparent', border:'none', padding:0 }}>{savedFlash ? '✓ Saved to flashcards' : 'Save as flashcards →'}</button>
          </Card>
        </div>

        <div style={{ padding:'4px 18px 14px' }}>
          <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Suggested next</div>
          {[
            { t:'Practice writing a body paragraph', sub:'Get live feedback as you write' },
            { t:'Take a Task 2 mini-exam',           sub:'40 min · graded out of 9' },
            { t:'Watch: 5 cohesion mistakes',        sub:'4 min video lesson' },
          ].map(s => (
            <button key={s.t} onClick={() => { const r = SUGGEST_ROUTES[s.t]; if (r && window.__nav) window.__nav(r); else flashToast(`Opening: ${s.t}`); }} style={{ width:'100%', padding:'12px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:11, marginBottom:8, textAlign:'left', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:600, color:T.ink, marginBottom:2 }}>{s.t}</div>
                <div style={{ fontSize:11, color:T.ink4 }}>{s.sub}</div>
              </div>
              <span style={{ color:T.ink4, fontSize:14 }}>→</span>
            </button>
          ))}
        </div>
      </aside>
    </div>
  );
}

// ── Mobile tutor ─────────────────────────────────────────
// ── The Argument Arena (Feature #3) ──────────────────────────
// Turn-by-turn debate against an AI opponent. Signature elements: opponent
// arguments in the target language with tap-to-reveal translation, a "comeback"
// tray of native rebuttal phrases the learner can deploy, and a per-turn note on
// how their argument LANDS (tone/persuasiveness) — street fluency, not grammar.
function ArgumentGamePage() {
  const R = React;
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const langName = (typeof langByCode === 'function' && langByCode(code)) ? (langByCode(code).english || langByCode(code).name || 'your language') : 'your language';
  const [phase, setPhase] = R.useState('setup');
  const [topic, setTopic] = R.useState('');
  const [side, setSide] = R.useState('');
  const [oppSide, setOppSide] = R.useState('');
  const [diff, setDiff] = R.useState('medium');
  const [msgs, setMsgs] = R.useState([]);
  const [draft, setDraft] = R.useState('');
  const [busy, setBusy] = R.useState(false);
  const [openT, setOpenT] = R.useState({});
  const scrollRef = R.useRef(null);
  R.useEffect(function () { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, busy]);

  const TOPICS = [
    { t:'Social media does more harm than good', a:'It does more harm than good', b:'It does more good than harm' },
    { t:'Remote work beats working in an office',  a:'Remote work is better',         b:'The office is better' },
    { t:'AI will create more jobs than it destroys',a:'AI will create more jobs',      b:'AI will destroy more jobs' },
    { t:'Cities should ban private cars downtown',  a:'Cities should ban them',        b:'Cities should keep them' },
    { t:'Money can buy happiness',                  a:'Money can buy happiness',       b:'Money cannot buy happiness' },
    { t:'Homework should be abolished in schools',  a:'Abolish homework',              b:'Keep homework' },
  ];
  const DIFFS = [{ k:'easy', l:'Warm-up' }, { k:'medium', l:'Sparring' }, { k:'hard', l:'No mercy' }];

  function pickTopic(tp, mySide, opp) { setTopic(tp); setSide(mySide); setOppSide(opp); setMsgs([]); setOpenT({}); setPhase('debate'); turn([], tp, mySide, true); }
  function reset() { setPhase('setup'); setMsgs([]); setDraft(''); setOpenT({}); }

  async function turn(history, tp, mySide, opening) {
    setBusy(true);
    try {
      const apiMsgs = opening
        ? [{ role:'user', content:'Begin the debate — state your opening position.' }]
        : history.map(function (m) { return { role: m.role === 'ai' ? 'assistant' : 'user', content: m.content }; });
      const r = await fetch('/api/tutor', {
        method:'POST',
        headers: Object.assign({ 'Content-Type':'application/json' }, (typeof window !== 'undefined' && window.__authHeaders) ? window.__authHeaders() : {}),
        body: JSON.stringify({ mode:'debate', lang: langName, topic: tp, side: mySide, difficulty: diff, messages: apiMsgs }),
      });
      const j = r.ok ? await r.json() : null;
      if (j && j.reply) {
        setMsgs(function (prev) {
          var withFb = prev.map(function (m) { return m.pendingFeedback ? Object.assign({}, m, { feedback: j.feedback || null, pendingFeedback:false }) : m; });
          return withFb.concat([{ role:'ai', content:j.reply, translation:j.translation || '', clapbacks:j.clapbacks || [] }]);
        });
      } else {
        var msg = (r.status === 402) ? '(You\u2019ve hit today\u2019s usage limit \u2014 upgrade to keep debating.)' : '(The opponent paused \u2014 send again to continue.)';
        setMsgs(function (prev) { return prev.concat([{ role:'ai', content: msg, translation:'', clapbacks:[] }]); });
      }
    } catch (e) {
      setMsgs(function (prev) { return prev.concat([{ role:'ai', content:'(Connection issue \u2014 send again.)', translation:'', clapbacks:[] }]); });
    }
    setBusy(false);
  }

  function send() {
    var v = draft.trim(); if (!v || busy) return;
    var next = msgs.concat([{ role:'user', content:v, pendingFeedback:true }]);
    setMsgs(next); setDraft('');
    turn(next, topic, side, false);
  }

  // ── Setup screen ──
  if (phase === 'setup') {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <WebTopbar search=""/>
        <div style={{ flex:1, overflow:'auto', padding:'32px 36px' }}>
          <div style={{ maxWidth:760, margin:'0 auto' }}>
            <div style={{ background:T.ink, borderRadius:20, padding:'34px 36px', color:'#fff', marginBottom:28, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, opacity:.05, background:'radial-gradient(circle at 92% 0%, #fff 0%, transparent 55%)' }}/>
              <div style={{ position:'relative' }}>
                <div style={{ fontSize:11, fontWeight:700, color:T.brandLight, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:12 }}>The Argument Arena</div>
                <div style={{ fontFamily:T.serif, fontSize:40, lineHeight:1.04, letterSpacing:'-.02em', maxWidth:520 }}>Win the argument. In {langName}.</div>
                <div style={{ fontSize:14, color:'rgba(255,255,255,.62)', marginTop:14, lineHeight:1.6, maxWidth:460 }}>Pick a side. The opponent takes the other. You\u2019ll get native comebacks to fire back with \u2014 and an honest read on how each point lands.</div>
              </div>
            </div>

            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:14 }}>Choose your intensity</div>
            <div style={{ display:'flex', gap:10, marginBottom:30 }}>
              {DIFFS.map(function (d) { var on = diff === d.k; return (
                <button key={d.k} onClick={function () { setDiff(d.k); }} style={{ flex:1, padding:'14px 0', borderRadius:13, border:'1.5px solid ' + (on ? T.brand : T.border), background: on ? T.brandLight : T.card, cursor:'pointer' }}>
                  <div style={{ fontSize:14, fontWeight:700, color: on ? T.brand : T.ink }}>{d.l}</div>
                  <div style={{ fontSize:10.5, color: on ? T.brand : T.ink4, marginTop:3, textTransform:'capitalize' }}>{d.k}</div>
                </button>
              ); })}
            </div>

            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:14 }}>Pick a motion \u2014 then your side</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {TOPICS.map(function (tp, i) { return (
                <div key={i} style={{ background:T.card, border:'1px solid ' + T.border, borderRadius:15, padding:'18px 20px' }}>
                  <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:13 }}>
                    <span style={{ fontFamily:T.serif, fontSize:14, color:T.brand, fontStyle:'italic' }}>{String(i + 1).padStart(2,'0')}</span>
                    <div style={{ fontSize:15, fontWeight:600, color:T.ink, lineHeight:1.35 }}>{tp.t}</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={function () { pickTopic(tp.t, tp.a, tp.b); }} style={{ flex:1, padding:'10px 14px', borderRadius:10, border:'1.5px solid ' + T.border, background:T.bg2, fontSize:12.5, fontWeight:600, color:T.ink2, cursor:'pointer', textAlign:'left' }}>
                      <span style={{ color:T.ink4, fontSize:10.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', display:'block', marginBottom:3 }}>Argue</span>{tp.a}
                    </button>
                    <button onClick={function () { pickTopic(tp.t, tp.b, tp.a); }} style={{ flex:1, padding:'10px 14px', borderRadius:10, border:'1.5px solid ' + T.border, background:T.bg2, fontSize:12.5, fontWeight:600, color:T.ink2, cursor:'pointer', textAlign:'left' }}>
                      <span style={{ color:T.ink4, fontSize:10.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', display:'block', marginBottom:3 }}>Argue</span>{tp.b}
                    </button>
                  </div>
                </div>
              ); })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Debate screen ──
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ padding:'16px 36px 0', borderBottom:'1px solid ' + T.hairline }}>
        <div style={{ maxWidth:760, margin:'0 auto', paddingBottom:14, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>Motion</div>
            <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.35 }}>{topic}</div>
            <div style={{ fontSize:12, color:T.ink3, marginTop:6 }}>You: <strong style={{ color:T.brand }}>{side}</strong> <span style={{ color:T.ink5 }}>\u00b7 opponent: {oppSide}</span></div>
          </div>
          <button onClick={reset} style={{ flexShrink:0, padding:'8px 14px', borderRadius:9, border:'1.5px solid ' + T.border, background:T.card, fontSize:12, fontWeight:600, color:T.ink2, cursor:'pointer' }}>New debate</button>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex:1, overflow:'auto', padding:'24px 36px' }}>
        <div style={{ maxWidth:760, margin:'0 auto', display:'flex', flexDirection:'column', gap:18 }}>
          {msgs.map(function (m, i) {
            if (m.role === 'user') return (
              <div key={i} style={{ alignSelf:'flex-end', maxWidth:'78%' }}>
                <div style={{ background:T.brand, color:'#fff', borderRadius:'16px 16px 4px 16px', padding:'12px 16px', fontSize:14, lineHeight:1.5 }}>{m.content}</div>
                {m.feedback ? (
                  <div style={{ marginTop:7, display:'flex', alignItems:'flex-start', gap:7, justifyContent:'flex-end' }}>
                    <div style={{ fontSize:11.5, color:T.ink3, fontStyle:'italic', textAlign:'right', lineHeight:1.5, maxWidth:'92%' }}>{Icon.spark ? Icon.spark({ width:10, height:10 }) : null} {m.feedback}</div>
                  </div>
                ) : null}
              </div>
            );
            var showT = !!openT[i];
            return (
              <div key={i} style={{ alignSelf:'flex-start', maxWidth:'82%' }}>
                <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:6 }}>
                  <div style={{ width:22, height:22, borderRadius:11, background:T.ink, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800 }}>OP</div>
                  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase' }}>Opponent</div>
                </div>
                <div style={{ background:T.card, border:'1px solid ' + T.border, borderLeft:'3px solid ' + T.brand, borderRadius:'4px 16px 16px 16px', padding:'13px 16px' }}>
                  <div style={{ fontSize:14.5, color:T.ink, lineHeight:1.55, fontFamily:T.serif }}>{m.content}</div>
                  {m.translation ? (
                    <div style={{ marginTop:9, paddingTop:9, borderTop:'1px dashed ' + T.hairline }}>
                      {showT ? <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5 }}>{m.translation}</div>
                             : <button onClick={function () { setOpenT(function (o) { var n = Object.assign({}, o); n[i] = true; return n; }); }} style={{ fontSize:11, fontWeight:600, color:T.brand, background:'none', border:'none', cursor:'pointer', padding:0 }}>Show translation</button>}
                    </div>
                  ) : null}
                </div>
                {m.clapbacks && m.clapbacks.length ? (
                  <div style={{ marginTop:10 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:7 }}>Comebacks \u2014 tap to use</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                      {m.clapbacks.map(function (c, ci) { return (
                        <button key={ci} title={c.gloss} onClick={function () { setDraft(function (d) { return (d ? d + ' ' : '') + c.phrase; }); }} style={{ textAlign:'left', padding:'8px 12px', borderRadius:10, border:'1px solid ' + T.border, background:T.bg2, cursor:'pointer', maxWidth:'100%' }}>
                          <div style={{ fontSize:13, color:T.ink, fontWeight:600 }}>{c.phrase}</div>
                          {c.gloss ? <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{c.gloss}</div> : null}
                        </button>
                      ); })}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          {busy ? <div style={{ alignSelf:'flex-start', fontSize:12.5, color:T.ink4, fontStyle:'italic', padding:'4px 2px' }}>Opponent is thinking\u2026</div> : null}
        </div>
      </div>

      <div style={{ borderTop:'1px solid ' + T.hairline, padding:'14px 36px 18px' }}>
        <div style={{ maxWidth:760, margin:'0 auto', display:'flex', gap:10, alignItems:'flex-end' }}>
          <textarea value={draft} onChange={function (e) { setDraft(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); send(); } }}
            placeholder={'Make your case in ' + langName + '\u2026  (\u2318/Ctrl + Enter to send)'} rows={2}
            style={{ flex:1, resize:'none', padding:'12px 14px', borderRadius:12, border:'1.5px solid ' + T.border, fontSize:14, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none', lineHeight:1.5, background:T.card }}/>
          <button onClick={send} disabled={busy || !draft.trim()} style={{ padding:'12px 22px', borderRadius:12, border:'none', background: (busy || !draft.trim()) ? T.border : T.brand, color:'#fff', fontSize:14, fontWeight:700, cursor:(busy || !draft.trim()) ? 'default' : 'pointer', whiteSpace:'nowrap' }}>Fire back</button>
        </div>
      </div>
    </div>
  );
}
if (typeof window !== 'undefined') { window.ArgumentGamePage = ArgumentGamePage; }
