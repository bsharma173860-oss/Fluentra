// ── AI Tutor — full chat experience ─────────────────────
const { useState: useStateAT, useRef: useRefAT, useEffect: useEffectAT } = React;

// History conversations (sidebar)
const TUTOR_HISTORY = [
  { id:'h1', title:'IELTS Writing Task 2 — coherence',  lang:'English',  when:'Today',     active:true },
  { id:'h2', title:'Past conditional vs subjunctive',   lang:'English',  when:'Yesterday' },
  { id:'h3', title:'When to use the imperfect tense',   lang:'Spanish',  when:'2 days ago' },
  { id:'h4', title:'Polite forms in keigo',             lang:'Japanese', when:'3 days ago' },
  { id:'h5', title:'Phrasal verbs — get / take / put',  lang:'English',  when:'Last week' },
  { id:'h6', title:'Difference between por and para',   lang:'Spanish',  when:'Last week' },
  { id:'h7', title:'False friends with French',         lang:'French',   when:'2 weeks ago' },
];

const TUTOR_QUICK = [
  { ic:'✦', label:'Explain a grammar rule',     prompt:'Can you explain when to use the present perfect vs simple past?' },
  { ic:'❤︎', label:'Practice a conversation',   prompt:'Let\'s practice a conversation at a restaurant in Spanish.' },
  { ic:'✎', label:'Check my writing',            prompt:'I\'ll paste an essay below — please give me IELTS-style feedback.' },
  { ic:'⌕', label:'Translate something',         prompt:'How do I naturally say "I\'m running late, sorry!" in Japanese?' },
  { ic:'☆', label:'Build vocabulary',            prompt:'Give me 10 useful B2-level Spanish phrases for talking about feelings.' },
  { ic:'⚡', label:'Mock exam question',          prompt:'Give me a Speaking Part 2 cue card for IELTS, then critique my answer.' },
];

const TUTOR_INITIAL = [
  { role:'ai',   text:"Hi Maria — welcome back! Last time we worked on **IELTS Writing Task 2 coherence**. Want to pick up where we left off, or start something new?" , when:'2 min ago' },
  { role:'user', text:"Let's keep going on Task 2. Can you give me a sample question and watch me write a body paragraph?" , when:'2 min ago' },
  { role:'ai',   text:"Perfect. Here's a Band 7+ style prompt:\n\n> *Some people believe that university education should focus on academic subjects only. Others think practical skills like budgeting or cooking should also be taught. Discuss both views and give your opinion.*\n\nBefore you write, jot down **two reasons for each side**, plus your own position. Then start with a topic sentence — I'll read your paragraph and mark coherence issues line-by-line.", when:'just now', actions:['Show example outline', 'Make it harder', 'Switch to Task 1'] },
];

// ── Message bubble
function Bubble({ role, text, when, actions, onAction, onFeedback }) {
  const isAI = role === 'ai';
  const lines = text.split('\n');
  return (
    <div style={{ display:'flex', gap:12, marginBottom:18, flexDirection: isAI ? 'row' : 'row-reverse' }}>
      <div style={{ width:32, height:32, borderRadius:10, background: isAI ? T.brandGrad || T.brand : T.ink, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, flexShrink:0 }}>
        {isAI ? '✦' : 'M'}
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
  h1: { topic:'IELTS Writing Task 2 — coherence', context:'IELTS · Writing Task 2', msgs: TUTOR_INITIAL },
  h2: { topic:'Past conditional vs subjunctive', context:'English · Grammar', msgs:[{ role:'ai', text:'Earlier we compared **third conditional** with **mixed conditional**. Want a refresher quiz or jump into examples?', when:'yesterday', actions:['Quiz me','Show 5 examples','Move on'] }] },
  h3: { topic:'When to use the imperfect tense', context:'Spanish · Grammar', msgs:[{ role:'ai', text:'We were mapping **imperfecto** vs **pretérito**. Resume with the time-marker drill?', when:'2 days ago', actions:['Resume drill','Re-explain','New topic'] }] },
  h4: { topic:'Polite forms in keigo', context:'Japanese · Culture', msgs:[{ role:'ai', text:'You were stuck on 謙譲語. Want me to redo it as a flow-chart by social distance?', when:'3 days ago', actions:['Flow-chart it','Skip to examples','Cheat sheet'] }] },
  h5: { topic:'Phrasal verbs — get / take / put', context:'English · Vocabulary', msgs:[{ role:'ai', text:'Last time you mastered “get across”. Continue with the “take” family?', when:'last week', actions:['Yes, take family','Just give me a list','Quiz first'] }] },
  h6: { topic:'Difference between por and para', context:'Spanish · Grammar', msgs:[{ role:'ai', text:'You scored 7/10 on the **por vs para** quiz. Want a new set or to review your wrong answers?', when:'last week', actions:['Review wrong ones','New set','Show me rules'] }] },
  h7: { topic:'False friends with French', context:'French · Vocabulary', msgs:[{ role:'ai', text:'Last seen: 12 false friends covered. Want to add 10 more, or test what you remember?', when:'2 weeks ago', actions:['Add 10 more','Test me','Just review'] }] },
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
  const [chatLang, setChatLang] = useStateAT('English');
  const scrollRef = useRefAT(null);
  const fileRef = useRefAT(null);
  const recTimer = useRefAT(null);

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

  // Voice: start/stop a fake recording timer (real mic capture is backend-side).
  // Toggles, auto-stops at 30s, and on stop drops a "voice note" message.
  useEffectAT(() => {
    if (recording) {
      recTimer.current = setInterval(() => setRecSecs(s => s + 1), 1000);
      const auto = setTimeout(() => stopVoice(true), 30000);
      return () => { clearInterval(recTimer.current); clearTimeout(auto); };
    }
  }, [recording]);

  function startVoice() { setRecSecs(0); setRecording(true); }
  function stopVoice(autoSend = false) {
    clearInterval(recTimer.current);
    setRecording(false);
    const secs = recSecs;
    if (autoSend || secs >= 1) {
      const mm = String(Math.floor(secs/60)).padStart(2,'0');
      const ss = String(secs % 60).padStart(2,'0');
      setMsgs(m => [...m, { role:'user', text:`🎙 Voice note · ${mm}:${ss}`, when:'just now' }]);
      setThinking(true);
      setTimeout(() => { setMsgs(m => [...m, { role:'ai', text:"Got your voice note — I heard a couple of pronunciation slips on the long vowels. Want me to mark them up phoneme-by-phoneme?", when:'just now', actions:['Mark phonemes','Just summarize','Skip'] }]); setThinking(false); }, 1400);
    }
    setRecSecs(0);
  }

  function openAttach() { if (fileRef.current) fileRef.current.click(); }
  function onFile(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const kb = Math.max(1, Math.round(f.size / 1024));
    setMsgs(m => [...m, { role:'user', text:`Attached: ${f.name} · ${kb} KB`, when:'just now' }]);
    setThinking(true);
    setTimeout(() => { setMsgs(m => [...m, { role:'ai', text:`Got it — I'll read **${f.name}** and pull out the main coherence issues. Want a band-style critique or a paragraph-by-paragraph rewrite suggestion?`, when:'just now', actions:['Band critique','Rewrite suggestions','Quick summary'] }]); setThinking(false); }, 1500);
    e.target.value = '';
  }

  const send = (text) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { role:'user', text, when:'just now' }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setMsgs(m => [...m, { role:'ai', text:"Got it. Let me draft a quick response that walks through the structure step-by-step, then I'll watch your paragraph.", when:'just now' }]);
      setThinking(false);
    }, 1400);
  };

  // Wire action chips (Band critique / Rewrite suggestions / Mark phonemes / etc):
  // treat them as a user reply with the chosen string, then have AI respond meaningfully.
  function handleAction(action) {
    setMsgs(m => [...m, { role:'user', text:action, when:'just now' }]);
    setThinking(true);
    const replies = {
      'Band critique':       'Going band-by-band: Task Response **6.5**, Coherence **6.0**, Lexical **7.0**, Grammar **6.5**. Biggest gain: tighter topic sentences. Want a line-by-line markup?',
      'Rewrite suggestions': 'Two-pass rewrite incoming — first pass for coherence, second for register. Showing diff view above each paragraph.',
      'Quick summary':       'Three things to fix: (1) one idea per paragraph, (2) cohesive devices in clause-2 not clause-1, (3) avoid “In conclusion” — paraphrase the thesis.',
      'Mark phonemes':       'Marked — your /ɪ/ slips into /iː/ on three words. Drill?',
      'Just summarize':      'Short summary: rhythm is good, vowel length is your main marker.',
      'Skip':                'Skipping for now. Ping me whenever.',
      'Show example outline':'Outline: Hook → thesis → P1 view A + reason → P2 view B + reason → your stance + why → paraphrased close.',
      'Make it harder':      'Switching to a Band 8+ prompt: “To what extent should governments fund the arts?” Same structure, sharper claims.',
      'Switch to Task 1':    'Task 1 mode on. Pick: line graph, bar chart, pie, map, or process.',
    };
    setTimeout(() => {
      setMsgs(m => [...m, { role:'ai', text: replies[action] || `Working on “${action}” — one moment.`, when:'just now', actions: action.includes('Band') ? ['Show markup','Improve P1','Re-grade'] : null }]);
      setThinking(false);
    }, 1200);
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
              {TUTOR_QUICK.map(q => (
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
              <button onClick={() => { setRecording(false); setRecSecs(0); }} style={{ padding:'5px 10px', borderRadius:7, background:'transparent', color:'#7A2A1F', fontSize:11, fontWeight:700, cursor:'pointer', border:'1px solid #C0392B' }}>Cancel</button>
              <button onClick={() => stopVoice(true)} style={{ padding:'5px 12px', borderRadius:7, background:'#C0392B', color:'#fff', fontSize:11, fontWeight:700, cursor:'pointer', border:'none' }}>Send</button>
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
                <button onClick={recording ? () => stopVoice(true) : startVoice} title={recording ? 'Stop recording' : 'Record voice'} style={{ width:32, height:32, borderRadius:8, background: recording ? '#C0392B' : 'transparent', color: recording ? '#fff' : T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
                </button>
                <button onClick={() => flashToast('Long-form draft mode — paste text in the box below')} title="Long-form" style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/></svg>
                </button>
                <div style={{ height:24, width:1, background:T.hairline, margin:'4px 4px' }}/>
                <div style={{ position:'relative' }}>
                  <button onClick={() => setShowLangPicker(s => !s)} style={{ padding:'6px 10px', borderRadius:8, background:T.bg2, fontSize:11.5, color:T.ink2, fontWeight:600, display:'flex', alignItems:'center', gap:5, cursor:'pointer', border:'none' }}>
                    <span style={{ width:14, height:10, borderRadius:1, background:'linear-gradient(180deg, #00247D 33%, #fff 33% 66%, #CF142B 66%)' }}/>
                    {chatLang} ▾
                  </button>
                  {showLangPicker && (
                    <div style={{ position:'absolute', bottom:'calc(100% + 6px)', left:0, width:170, background:'#fff', border:`1px solid ${T.border}`, borderRadius:10, boxShadow:'0 12px 28px rgba(0,0,0,.14)', padding:6, zIndex:30 }}>
                      {['English','Spanish','French','Japanese','German'].map(L => (
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
function MTutorPage() {
  const [msgs, setMsgs] = useStateAT(TUTOR_INITIAL);
  const [input, setInput] = useStateAT('');
  const [showHistory, setShowHistory] = useStateAT(false);
  const [thinking, setThinking] = useStateAT(false);
  const [mRec, setMRec] = useStateAT(false);
  const [mRecSecs, setMRecSecs] = useStateAT(0);
  const scrollRef = useRefAT(null);
  const mFileRef = useRefAT(null);
  const mRecTimer = useRefAT(null);

  useEffectAT(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking]);
  useEffectAT(() => {
    if (mRec) {
      mRecTimer.current = setInterval(() => setMRecSecs(s => s + 1), 1000);
      const auto = setTimeout(() => mStopVoice(true), 30000);
      return () => { clearInterval(mRecTimer.current); clearTimeout(auto); };
    }
  }, [mRec]);

  function mStartVoice() { setMRecSecs(0); setMRec(true); }
  function mStopVoice(autoSend = false) {
    clearInterval(mRecTimer.current);
    setMRec(false);
    const secs = mRecSecs;
    if (autoSend || secs >= 1) {
      const mm = String(Math.floor(secs/60)).padStart(2,'0');
      const ss = String(secs % 60).padStart(2,'0');
      setMsgs(m => [...m, { role:'user', text:`Voice note · ${mm}:${ss}`, when:'just now' }]);
      setThinking(true);
      setTimeout(() => { setMsgs(m => [...m, { role:'ai', text:'Got your voice note — nice rhythm. Pronunciation feedback ready when you are.', when:'just now' }]); setThinking(false); }, 1300);
    }
    setMRecSecs(0);
  }
  function mOpenAttach() { if (mFileRef.current) mFileRef.current.click(); }
  function mOnFile(e) {
    const f = e.target.files && e.target.files[0]; if (!f) return;
    const kb = Math.max(1, Math.round(f.size / 1024));
    setMsgs(m => [...m, { role:'user', text:`Attached: ${f.name} · ${kb} KB`, when:'just now' }]);
    setThinking(true);
    setTimeout(() => { setMsgs(m => [...m, { role:'ai', text:`Got **${f.name}** — reading now…`, when:'just now' }]); setThinking(false); }, 1500);
    e.target.value = '';
  }

  const send = (t) => {
    if (!t.trim()) return;
    setMsgs(m => [...m, { role:'user', text:t, when:'just now' }]);
    setInput('');
    setThinking(true);
    setTimeout(() => { setMsgs(m => [...m, { role:'ai', text:'Got it — let me walk you through it step by step.', when:'just now' }]); setThinking(false); }, 1300);
  };

  if (showHistory) return (
    <MobileBody noTabs>
      <style>{`@keyframes typing { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }`}</style>
      <div style={{ padding:'12px 16px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => setShowHistory(false)} style={{ width:32, height:32, borderRadius:16, background:T.bg2, fontSize:16, color:T.ink2 }}>←</button>
        <div style={{ flex:1, fontFamily:T.serif, fontSize:20, color:T.ink }}>History</div>
        <button style={{ width:32, height:32, borderRadius:16, background:T.brand, color:'#fff', fontSize:16 }}>+</button>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'8px 12px 16px' }}>
        {TUTOR_HISTORY.map(h => (
          <button key={h.id} onClick={() => setShowHistory(false)} style={{ width:'100%', padding:'12px 12px', borderRadius:11, background:T.card, border:`1px solid ${T.border}`, marginBottom:7, textAlign:'left', display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ fontSize:13, fontWeight:600, color:T.ink, lineHeight:1.35 }}>{h.title}</div>
            <div style={{ fontSize:10.5, color:T.ink4 }}>{h.lang} · {h.when}</div>
          </button>
        ))}
      </div>
    </MobileBody>
  );

  return (
    <MobileBody noTabs>
      <style>{`@keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } } @keyframes typing { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }`}</style>
      <div style={{ padding:'10px 14px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={() => setShowHistory(true)} style={{ width:32, height:32, borderRadius:16, background:T.bg2, color:T.ink2, fontSize:14 }}>≡</button>
        <div style={{ width:34, height:34, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>✦</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>IELTS Task 2 — coherence</div>
          <div style={{ fontSize:10.5, color:T.listening?.c || '#1A8F4E', fontWeight:600, display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:5, height:5, borderRadius:2.5, background:T.listening?.c || '#1A8F4E', animation:'pulse 1.6s infinite' }}/> Online
          </div>
        </div>
        <button style={{ width:32, height:32, borderRadius:16, background:T.bg2, color:T.ink3, fontSize:14 }}>⋯</button>
      </div>

      <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'14px 14px 4px' }}>
        {msgs.map((m, i) => <Bubble key={i} {...m}/>)}
        {thinking && (
          <div style={{ display:'flex', gap:10, marginBottom:18 }}>
            <div style={{ width:30, height:30, borderRadius:9, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700 }}>✦</div>
            <div style={{ background:T.card, border:`1px solid ${T.border}`, padding:'12px 16px', borderRadius:14, borderTopLeftRadius:4, display:'flex', gap:5 }}>
              {[0,1,2].map(i => <span key={i} style={{ width:6, height:6, borderRadius:3, background:T.ink4, animation:'typing 1.2s infinite', animationDelay:`${i*.15}s` }}/>)}
            </div>
          </div>
        )}
      </div>

      {input === '' && (
        <div style={{ padding:'8px 12px 0', display:'flex', gap:6, overflowX:'auto', WebkitOverflowScrolling:'touch' }}>
          {TUTOR_QUICK.slice(0, 5).map(q => (
            <button key={q.label} onClick={() => setInput(q.prompt)} style={{ padding:'7px 11px', borderRadius:99, background:T.bg2, border:`1px solid ${T.border}`, fontSize:11, color:T.ink2, fontWeight:600, flexShrink:0, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ color:T.brand }}>{q.ic}</span>{q.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding:'10px 12px 14px' }}>
        <input ref={mFileRef} type="file" accept=".pdf,.doc,.docx,.txt,image/*,audio/*" onChange={mOnFile} style={{ display:'none' }}/>
        {mRec && (
          <div style={{ padding:'10px 12px', marginBottom:8, background:'#FCE6E2', border:'1px solid #F4C9C0', borderRadius:12, display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:'#C0392B', animation:'pulse 1s infinite' }}/>
            <span style={{ fontSize:11, color:'#7A2A1F', fontWeight:700, fontVariantNumeric:'tabular-nums' }}>0:{String(mRecSecs).padStart(2,'0')}</span>
            <div style={{ flex:1, display:'flex', gap:2, alignItems:'center', height:14 }}>
              {Array.from({ length:14 }).map((_,i) => <div key={i} style={{ flex:1, height:`${30 + Math.abs(Math.sin((Date.now()/120)+i*0.6))*70}%`, background:'#C0392B', borderRadius:1 }}/>)}
            </div>
            <button onClick={() => { setMRec(false); setMRecSecs(0); }} style={{ padding:'4px 8px', borderRadius:6, fontSize:10, fontWeight:700, color:'#7A2A1F', background:'transparent', border:'1px solid #C0392B', cursor:'pointer' }}>Cancel</button>
            <button onClick={() => mStopVoice(true)} style={{ padding:'4px 10px', borderRadius:6, fontSize:10, fontWeight:700, color:'#fff', background:'#C0392B', cursor:'pointer', border:'none' }}>Send</button>
          </div>
        )}
        <div style={{ background:T.card, border:`1.5px solid ${T.border}`, borderRadius:14, padding:'8px 10px', display:'flex', alignItems:'flex-end', gap:6 }}>
          <button onClick={mOpenAttach} style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, cursor:'pointer', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything…"
            rows={1}
            style={{ flex:1, border:'none', outline:'none', resize:'none', fontSize:13.5, fontFamily:'inherit', padding:'7px 4px', minHeight:32, maxHeight:90 }}
          />
          {input.trim() ?
            <button onClick={() => send(input)} style={{ width:32, height:32, borderRadius:8, background:T.brand, color:'#fff', fontSize:14, flexShrink:0, cursor:'pointer', border:'none' }}>↑</button>
            : <button onClick={mRec ? () => mStopVoice(true) : mStartVoice} style={{ width:32, height:32, borderRadius:8, background: mRec ? '#C0392B' : 'transparent', color: mRec ? '#fff' : T.ink3, flexShrink:0, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', border:'none' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
              </button>
          }
        </div>
      </div>
    </MobileBody>
  );
}

Object.assign(window, { TutorPage, MTutorPage });
