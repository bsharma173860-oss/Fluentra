// ── Tutor voice call + Conversation history ────────────────

var TUTOR_LOCALE = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-PT', nl:'nl-NL', ru:'ru-RU', pl:'pl-PL', uk:'uk-UA', sv:'sv-SE', no:'nb-NO', da:'da-DK', fi:'fi-FI', el:'el-GR', cs:'cs-CZ', ro:'ro-RO', hu:'hu-HU', tr:'tr-TR', ar:'ar-SA', hi:'hi-IN', zh:'zh-CN', ja:'ja-JP', ko:'ko-KR', id:'id-ID', vi:'vi-VN' };

function TutorCallPage() {
  const code = (typeof window !== 'undefined' && window.__langCode) ? window.__langCode : 'en';
  const langObj = (typeof langByCode === 'function') ? langByCode(code) : { english: 'English' };
  const locale = TUTOR_LOCALE[code] || 'en-US';

  const SR = (typeof window !== 'undefined') ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const canTTS = (typeof window !== 'undefined') && ('speechSynthesis' in window);
  const supported = !!SR;

  const [msgs, setMsgs] = React.useState([]);         // {role:'user'|'assistant', content}
  const [phase, setPhase] = React.useState('idle');   // idle | listening | thinking | speaking
  const [interim, setInterim] = React.useState('');
  const [typed, setTyped] = React.useState('');
  const [started, setStarted] = React.useState(false);
  const recRef = React.useRef(null);
  const msgsRef = React.useRef([]);
  const endRef = React.useRef(null);
  msgsRef.current = msgs;

  React.useEffect(function () { if (endRef.current) endRef.current.scrollIntoView({ behavior:'smooth' }); }, [msgs.length, interim]);
  React.useEffect(function () { return function () { try { if (recRef.current) recRef.current.abort(); } catch (e) {} try { if (canTTS) window.speechSynthesis.cancel(); } catch (e) {} }; }, []);

  function pickVoice() {
    if (!canTTS) return null;
    var vs = window.speechSynthesis.getVoices() || [];
    var exact = vs.filter(function (v) { return v.lang && v.lang.toLowerCase() === String(locale||'').toLowerCase(); })[0];
    if (exact) return exact;
    var pre = String(locale||'').split('-')[0].toLowerCase();
    return vs.filter(function (v) { return v.lang && v.lang.toLowerCase().indexOf(pre) === 0; })[0] || null;
  }
  function speak(text, done) {
    if (!canTTS || !text) { if (done) done(); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(text);
      u.lang = locale; var v = pickVoice(); if (v) u.voice = v;
      u.onend = function () { if (done) done(); };
      u.onerror = function () { if (done) done(); };
      setPhase('speaking');
      window.speechSynthesis.speak(u);
    } catch (e) { if (done) done(); }
  }

  function askTutor(history) {
    setPhase('thinking');
    return fetch('/api/tutor', {
      method:'POST', headers:Object.assign({ 'Content-Type':'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
      body: JSON.stringify({ messages: history, lang: code, context: 'Spoken voice call. Keep replies short and conversational (1-3 sentences), since they are read aloud. Gently correct major mistakes. Reply in ' + (langObj.english || code) + '.' }),
    }).then(function (r) { return r.json(); }).then(function (d) {
      if (d && d.limit) { setPhase('idle'); if (window.__upgrade) window.__upgrade('tutor'); return; }
      var reply = (d && d.reply) || '';
      if (!reply) { setPhase('idle'); return; }
      var next = history.concat([{ role:'assistant', content: reply }]);
      setMsgs(next);
      speak(reply, function () { setPhase('idle'); });
    }).catch(function () { setPhase('idle'); });
  }

  function sendUserTurn(text) {
    var t = (text || '').trim(); if (!t) return;
    var history = msgsRef.current.concat([{ role:'user', content: t }]);
    setMsgs(history); setInterim(''); setTyped('');
    askTutor(history);
  }

  function beginCall() {
    setStarted(true);
    var seed = [{ role:'user', content: 'Greet me briefly in ' + (langObj.english || code) + ' and start a simple practice conversation with one easy question.' }];
    askTutor(seed).then(function () {
      // Replace the seed user-turn so it doesn't show as my message
      setMsgs(function (prev) { return prev.filter(function (m, idx) { return !(idx === 0 && m.role === 'user'); }); });
    });
  }

  function listen() {
    if (!SR) return;
    try { if (canTTS) window.speechSynthesis.cancel(); } catch (e) {}
    var rec = new SR();
    recRef.current = rec;
    rec.lang = locale; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    var finalText = '';
    rec.onresult = function (e) {
      var iTxt = '';
      for (var k = 0; k < e.results.length; k++) {
        var res = e.results[k];
        var _tr = (res[0] && res[0].transcript) || ""; if (res.isFinal) finalText += _tr; else iTxt += _tr;
      }
      setInterim(iTxt);
    };
    rec.onerror = function () { setPhase('idle'); setInterim(''); };
    rec.onend = function () { recRef.current = null; if (finalText.trim()) sendUserTurn(finalText); else setPhase('idle'); };
    setPhase('listening'); setInterim('');
    try { rec.start(); } catch (e) { setPhase('idle'); }
  }
  function stopListening() { try { if (recRef.current) recRef.current.stop(); } catch (e) {} }

  const statusText = phase === 'listening' ? 'Listening…' : phase === 'thinking' ? 'Thinking…' : phase === 'speaking' ? 'Speaking…' : (started ? 'Tap the mic to talk' : '');
  const orbActive = phase === 'listening' || phase === 'speaking';

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:T.ink, color:'#fff' }}>
      <div style={{ padding:'18px 28px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <button onClick={function () { try { if (recRef.current) recRef.current.abort(); } catch (e) {} try { if (canTTS) window.speechSynthesis.cancel(); } catch (e) {} window.__nav && window.__nav('tutor'); }} style={{ width:36, height:36, borderRadius:18, background:'rgba(255,255,255,.1)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.arrowL ? Icon.arrowL() : '←'}</button>
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.5)', fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase' }}>Voice call · {langObj.english || code}</div>
          <div style={{ fontFamily:T.serif, fontSize:18, marginTop:2 }}>AI tutor</div>
        </div>
        <div style={{ width:36 }}/>
      </div>

      {!started ? (
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, gap:22, textAlign:'center' }}>
          <div style={{ width:120, height:120, borderRadius:60, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.mic ? Icon.mic({ width:42, height:42 }) : '🎙'}</div>
          <div style={{ maxWidth:360 }}>
            <div style={{ fontFamily:T.serif, fontSize:24, marginBottom:10 }}>Practice {langObj.english || code} by voice</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,.6)', lineHeight:1.6 }}>{supported ? 'Speak naturally — the tutor listens, replies out loud, and gently corrects you.' : 'Your browser does not support voice input, but you can still chat by typing — the tutor will reply out loud.'}</div>
          </div>
          <button onClick={beginCall} style={{ padding:'15px 34px', borderRadius:14, background:'#fff', color:T.ink, fontSize:15, fontWeight:700, border:'none', cursor:'pointer' }}>Start call</button>
        </div>
      ) : (
        <>
          <div style={{ flex:1, overflow:'auto', padding:'8px 24px 16px', display:'flex', flexDirection:'column', gap:10 }}>
            {msgs.map(function (m, idx) {
              var me = m.role === 'user';
              return (
                <div key={idx} style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth:'74%', padding:'11px 15px', borderRadius: me ? '15px 15px 5px 15px' : '15px 15px 15px 5px', background: me ? T.brand : 'rgba(255,255,255,.1)', color:'#fff', fontSize:14, lineHeight:1.55 }}>{m.content}</div>
                </div>
              );
            })}
            {interim && (
              <div style={{ display:'flex', justifyContent:'flex-end' }}>
                <div style={{ maxWidth:'74%', padding:'11px 15px', borderRadius:'15px 15px 5px 15px', background:'rgba(217,119,87,.45)', color:'#fff', fontSize:14, lineHeight:1.55, fontStyle:'italic' }}>{interim}</div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          <div style={{ flexShrink:0, padding:'16px 24px 26px', borderTop:'1px solid rgba(255,255,255,.1)', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:12.5, color:'rgba(255,255,255,.55)', fontWeight:600, height:16 }}>{statusText}</div>
            {supported ? (
              <button
                onClick={function () { if (phase === 'listening') stopListening(); else if (phase === 'idle') listen(); }}
                disabled={phase === 'thinking' || phase === 'speaking'}
                style={{ width:78, height:78, borderRadius:39, border:'none', cursor: (phase==='thinking'||phase==='speaking')?'default':'pointer', background: phase==='listening' ? '#E5484D' : T.brandGrad, opacity:(phase==='thinking'||phase==='speaking')?.5:1, display:'flex', alignItems:'center', justifyContent:'center', boxShadow: orbActive ? '0 0 0 8px rgba(217,119,87,.18)' : 'none', transition:'all .2s' }}>
                {Icon.mic ? Icon.mic({ width:30, height:30 }) : '🎙'}
              </button>
            ) : (
              <div style={{ display:'flex', gap:10, width:'100%', maxWidth:520 }}>
                <input value={typed} onChange={function (e) { setTyped(e.target.value); }} onKeyDown={function (e) { if (e.key === 'Enter' && phase === 'idle') sendUserTurn(typed); }} placeholder={'Type in ' + (langObj.english || code) + '…'} style={{ flex:1, padding:'12px 15px', borderRadius:12, border:'1px solid rgba(255,255,255,.2)', background:'rgba(255,255,255,.08)', color:'#fff', fontSize:14, outline:'none' }}/>
                <button onClick={function () { if (phase === 'idle') sendUserTurn(typed); }} disabled={phase !== 'idle'} style={{ padding:'12px 20px', borderRadius:12, background:T.brand, color:'#fff', fontSize:14, fontWeight:700, border:'none', cursor: phase==='idle'?'pointer':'default', opacity: phase==='idle'?1:.5 }}>Send</button>
              </div>
            )}
            <button onClick={function () { try { if (recRef.current) recRef.current.abort(); } catch (e) {} try { if (canTTS) window.speechSynthesis.cancel(); } catch (e) {} window.__nav && window.__nav('tutor'); }} style={{ fontSize:12.5, color:'rgba(255,255,255,.5)', background:'transparent', cursor:'pointer' }}>End call</button>
          </div>
        </>
      )}
    </div>
  );
}

function TutorHistoryPage() {
  const rows = ((typeof window !== 'undefined' && window.__results) ? window.__results : [])
    .filter(function (r) { return r && r.detail && (r.detail.module === 'speaking' || r.detail.module === 'writing'); });
  rows.sort(function (a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
  function label(r) {
    var langObj = (typeof langByCode === 'function') ? langByCode(r.lang) : { english: r.lang };
    var mod = r.detail.module === 'writing' ? 'Writing feedback' : 'Speaking practice';
    return mod + ' · ' + (langObj.english || (r.lang || '').toUpperCase());
  }
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 36px 56px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, marginBottom:6 }}>Tutor practice</div>
          <div style={{ fontSize:13, color:T.ink4, marginBottom:20 }}>Your AI-graded speaking and writing sessions. Start a live call or open the chat any time.</div>
          <div style={{ display:'flex', gap:10, marginBottom:22 }}>
            <Btn label="Start a voice call" accent={T.brand} onClick={function () { window.__nav && window.__nav('tutor_call'); }}/>
            <Btn label="Open chat" variant="outline" accent={T.ink2} onClick={function () { window.__nav && window.__nav('tutor'); }}/>
          </div>
          {rows.length === 0 ? (
            <Card padding={36}><div style={{ color:T.ink3, fontSize:13.5, lineHeight:1.6 }}>No graded tutor sessions yet. Finish a speaking or writing session, or start a voice call, and your practice will be listed here.</div></Card>
          ) : (
            <Card padding={0}>
              {rows.slice(0, 40).map(function (r, idx, all) {
                var isBand = r.detail && r.detail.module === 'speaking';
                var disp = isBand ? ((Number(r.score) || 0) / 100 * 9).toFixed(1) : ((Number(r.score) || 0) + '%');
                return (
                  <div key={idx} style={{ display:'flex', alignItems:'center', gap:14, padding:'15px 20px', borderBottom: idx < Math.min(all.length, 40) - 1 ? `1px solid ${T.hairline}` : 'none' }}>
                    <div style={{ width:40, height:40, borderRadius:12, background: isBand ? T.speaking.bg : T.writing.bg, color: isBand ? T.speaking.c : T.writing.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[isBand ? 'mic' : 'pen'] ? Icon[isBand ? 'mic' : 'pen']({ width:17, height:17 }) : ''}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>{label(r)}</div>
                      <div style={{ fontSize:11.5, color:T.ink4, marginTop:2 }}>{r.updated_at ? new Date(r.updated_at).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'numeric' }) : ''}</div>
                    </div>
                    <div style={{ fontFamily:T.serif, fontSize:22, color: isBand ? T.speaking.c : T.writing.c }}>{disp}</div>
                  </div>
                );
              })}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TutorCallPage, TutorHistoryPage });
