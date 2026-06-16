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
function Bubble({ role, text, when, actions }) {
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
              <button key={a} style={{ padding:'7px 12px', borderRadius:99, background:T.bg2, border:`1px solid ${T.border}`, fontSize:11.5, color:T.ink2, fontWeight:600, cursor:'pointer' }}>{a}</button>
            ))}
          </div>
        )}
        {isAI && (
          <div style={{ display:'flex', gap:10, marginTop:8 }}>
            {['👍','👎','📋','🔁'].map(e => (
              <button key={e} style={{ width:26, height:26, borderRadius:7, background:'transparent', fontSize:12, opacity:.5, cursor:'pointer' }}>{e}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Desktop tutor page
function TutorPage() {
  const [msgs, setMsgs] = useStateAT(TUTOR_INITIAL);
  const [input, setInput] = useStateAT('');
  const [thinking, setThinking] = useStateAT(false);
  const [activeId, setActiveId] = useStateAT('h1');
  const scrollRef = useRefAT(null);

  useEffectAT(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking]);

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

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden', background:T.bg }}>
      <style>{`@keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } } @keyframes typing { 0%,60%,100% { transform:translateY(0); } 30% { transform:translateY(-4px); } }`}</style>

      {/* Conversation history sidebar */}
      <aside style={{ width:280, borderRight:`1px solid ${T.border}`, background:T.bg2, display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'18px 16px 12px', borderBottom:`1px solid ${T.hairline}` }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
            <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>AI Tutor</div>
            <button style={{ width:30, height:30, borderRadius:8, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer' }}>+</button>
          </div>
          <div style={{ position:'relative' }}>
            <input placeholder="Search history…" style={{ width:'100%', padding:'8px 12px 8px 30px', borderRadius:9, border:`1px solid ${T.border}`, background:T.card, fontSize:12.5, fontFamily:'inherit', outline:'none' }}/>
            <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', fontSize:12, color:T.ink5 }}>⌕</span>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'8px 8px 16px' }}>
          {['Today','Yesterday','Earlier'].map(group => {
            const items = TUTOR_HISTORY.filter(h => group === 'Today' ? h.when === 'Today' : group === 'Yesterday' ? h.when === 'Yesterday' : !['Today','Yesterday'].includes(h.when));
            if (!items.length) return null;
            return (
              <div key={group} style={{ marginTop:10 }}>
                <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', padding:'4px 8px 6px' }}>{group}</div>
                {items.map(h => {
                  const sel = activeId === h.id;
                  return (
                    <button key={h.id} onClick={() => setActiveId(h.id)} style={{ width:'100%', padding:'10px 10px', borderRadius:9, background: sel ? T.card : 'transparent', border: sel ? `1px solid ${T.border}` : '1px solid transparent', display:'flex', flexDirection:'column', gap:3, alignItems:'flex-start', textAlign:'left', cursor:'pointer', marginBottom:2 }}>
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
            <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>IELTS Writing Task 2 — coherence</div>
            <div style={{ fontSize:11.5, color:T.listening?.c || '#1A8F4E', fontWeight:600, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ width:6, height:6, borderRadius:3, background:T.listening?.c || '#1A8F4E', animation:'pulse 1.6s infinite' }}/> Online · English · IELTS context
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${T.border}`, background:T.card, fontSize:12, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Save</button>
            <button style={{ padding:'7px 12px', borderRadius:8, border:`1px solid ${T.border}`, background:T.card, fontSize:12, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Share</button>
            <button style={{ width:32, height:32, borderRadius:8, border:`1px solid ${T.border}`, background:T.card, color:T.ink3, cursor:'pointer' }}>⋯</button>
          </div>
        </div>

        <div ref={scrollRef} style={{ flex:1, overflowY:'auto', padding:'24px 24px 8px' }}>
          <div style={{ maxWidth:840, margin:'0 auto' }}>
            {msgs.map((m, i) => <Bubble key={i} {...m}/>)}
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
                {[
                  { ic:'📎', t:'Attach' },
                  { ic:'🎙', t:'Voice' },
                  { ic:'✎',  t:'Long-form' },
                ].map(b => (
                  <button key={b.t} title={b.t} style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, fontSize:14, cursor:'pointer' }}>{b.ic}</button>
                ))}
                <div style={{ height:24, width:1, background:T.hairline, margin:'4px 4px' }}/>
                <button style={{ padding:'6px 10px', borderRadius:8, background:T.bg2, fontSize:11.5, color:T.ink2, fontWeight:600, display:'flex', alignItems:'center', gap:5, cursor:'pointer' }}>
                  <span style={{ width:14, height:10, borderRadius:1, background:'linear-gradient(180deg, #00247D 33%, #fff 33% 66%, #CF142B 66%)' }}/>
                  English ▾
                </button>
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
      <aside style={{ width:300, borderLeft:`1px solid ${T.border}`, background:T.bg2, display:'flex', flexDirection:'column', flexShrink:0, overflowY:'auto' }}>
        <div style={{ padding:'18px 18px 14px' }}>
          <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Context</div>
          <Card padding={14}>
            <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:8 }}>Active topic</div>
            <Chip label="IELTS · Writing Task 2" accent={T.writing?.c || '#C4503E'} bg={T.writing?.bg || T.brandLight}/>
            <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.5, marginTop:10 }}>The tutor will tailor explanations and examples to IELTS Writing Task 2 conventions and band descriptors.</div>
            <button style={{ marginTop:10, fontSize:11.5, color:T.brand, fontWeight:700, cursor:'pointer' }}>Change topic →</button>
          </Card>
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
            <button style={{ marginTop:10, fontSize:11.5, color:T.brand, fontWeight:700, cursor:'pointer' }}>Save as flashcards →</button>
          </Card>
        </div>

        <div style={{ padding:'4px 18px 14px' }}>
          <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Suggested next</div>
          {[
            { t:'Practice writing a body paragraph', sub:'Get live feedback as you write' },
            { t:'Take a Task 2 mini-exam',           sub:'40 min · graded out of 9' },
            { t:'Watch: 5 cohesion mistakes',        sub:'4 min video lesson' },
          ].map(s => (
            <button key={s.t} style={{ width:'100%', padding:'12px 14px', background:T.card, border:`1px solid ${T.border}`, borderRadius:11, marginBottom:8, textAlign:'left', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
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
  const scrollRef = useRefAT(null);

  useEffectAT(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, thinking]);

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
        <div style={{ background:T.card, border:`1.5px solid ${T.border}`, borderRadius:14, padding:'8px 10px', display:'flex', alignItems:'flex-end', gap:6 }}>
          <button style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, fontSize:14, flexShrink:0 }}>📎</button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything…"
            rows={1}
            style={{ flex:1, border:'none', outline:'none', resize:'none', fontSize:13.5, fontFamily:'inherit', padding:'7px 4px', minHeight:32, maxHeight:90 }}
          />
          {input.trim() ?
            <button onClick={() => send(input)} style={{ width:32, height:32, borderRadius:8, background:T.brand, color:'#fff', fontSize:14, flexShrink:0 }}>↑</button>
            : <button style={{ width:32, height:32, borderRadius:8, background:'transparent', color:T.ink3, fontSize:14, flexShrink:0 }}>🎙</button>
          }
        </div>
      </div>
    </MobileBody>
  );
}

Object.assign(window, { TutorPage, MTutorPage });
