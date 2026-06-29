// ──────────────────────────────────────────────────────────────
// Echo (mobile) — 60-second daily speaking warmup, phone width.
// Same 4 states as web; tighter layout, mic centered, single-column.
// ──────────────────────────────────────────────────────────────

const { useState: useStateMEcho, useEffect: useEffectMEcho, useRef: useRefMEcho } = React;

function MEchoCard() {
  const code = (typeof window !== 'undefined' && window.__langCode) || 'es';
  const lang = (typeof langByCode === 'function') ? langByCode(code) : { code, english:'Spanish' };
  const t = (typeof langTheme === 'function') ? langTheme(code) : { accent:'#C04A06', accentLight:'#FFE5DE', bg:'#FFF0EE' };
  const prompt = (typeof getEchoPrompt === 'function') ? getEchoPrompt(code) : { word:'cortado', sentence:'Querría un cortado, por favor.', why:'Make the "t" crisp.' };

  const storeKey = (() => {
    const d = new Date();
    return `__echo_done_${code}_${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  })();
  const stored = typeof window !== 'undefined' && localStorage.getItem(storeKey);
  const initialDone = (function () { try { return stored ? JSON.parse(stored) : null; } catch (e) { return null; } })();

  const [state, setState] = useStateMEcho(initialDone ? 'done' : 'idle');
  const [score, setScore] = useStateMEcho(initialDone?.score || 0);
  const [duration, setDuration] = useStateMEcho(0);
  const timerRef = useRefMEcho(null);
  const recStartRef = useRefMEcho(null);
  const streamRef = useRefMEcho(null);
  const recRef = useRefMEcho(null);
  const chunksRef = useRefMEcho([]);
  const [err, setErr] = useStateMEcho('');
  function _stopTracks() { if (streamRef.current) { streamRef.current.getTracks().forEach(function (tr) { tr.stop(); }); streamRef.current = null; } }
  useEffectMEcho(function () { return function () { try { if (recRef.current && recRef.current.state === 'recording') recRef.current.stop(); } catch (e) {} _stopTracks(); }; }, []);

  useEffectMEcho(() => {
    if (state === 'recording') {
      recStartRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - recStartRef.current) / 1000));
      }, 100);
      const auto = setTimeout(() => stopRecording(), 8000);
      return () => { clearInterval(timerRef.current); clearTimeout(auto); };
    }
  }, [state]);

  async function startRecording() {
    setErr(''); setDuration(0);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') { setErr('Recording is not supported in this browser.'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mr = new MediaRecorder(stream, (typeof _recorderOpts === 'function' ? _recorderOpts() : {}));
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = () => { evaluate(new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })); };
      recRef.current = mr; mr.start(); setState('recording');
    } catch (e) { setErr('Microphone was blocked. Allow mic access and try again.'); setState('idle'); }
  }
  function stopRecording() {
    clearInterval(timerRef.current);
    setState('scoring');
    try { if (recRef.current && recRef.current.state === 'recording') recRef.current.stop(); else evaluate(null); } catch (e) { evaluate(null); }
  }
  async function evaluate(blob) {
    _stopTracks();
    try {
      if (!blob) { setErr("Didn't catch any audio — try again."); setState('idle'); return; }
      const b64 = await new Promise((resolve, reject) => { const fr = new FileReader(); fr.onload = () => resolve(String(fr.result).split(',')[1]); fr.onerror = reject; fr.readAsDataURL(blob); });
      if (!b64) { setErr("Didn't catch any audio — try again."); setState('idle'); return; }
      if (b64.length > 5000000) { setErr('That was a bit long — keep it to one sentence.'); setState('idle'); return; }
      const r = await fetch('/api/speaking-eval', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {}), body: JSON.stringify({ audioBase64: b64, mimeType: blob.type || 'audio/webm', prompt: prompt.sentence, lang: code, speak: false }) });
      const j = await r.json();
      if (j && j.limit) { setState('idle'); if (window.__upgrade) window.__upgrade('speaking'); return; }
      const band = (j && j.evaluation && typeof j.evaluation.overall_band === 'number') ? j.evaluation.overall_band : null;
      const sc = band != null ? Math.max(1, Math.min(100, Math.round(band / 9 * 100))) : null;
      if (sc == null) { setErr("Couldn't score that one — give it another go."); setState('idle'); return; }
      const newStreak = (typeof bumpEchoStreak === 'function') ? bumpEchoStreak(code) : 0;
      const result = { score: sc, date: new Date().toISOString(), streak: newStreak };
      setScore(sc); setState('done');
      try { localStorage.setItem(storeKey, JSON.stringify(result)); } catch (e) {}
    } catch (e) { setErr('Scoring failed — check your connection and try again.'); setState('idle'); }
  }
  function skipToday() { setState('skipped'); }
  function tryAgain() { try { localStorage.removeItem(storeKey); } catch {} setState('idle'); setScore(0); setDuration(0); }

  const Eyebrow = (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
      <div style={{ display:'flex', alignItems:'center', gap:5, padding:'3px 9px', borderRadius:99, background:t.accentLight, color:t.accent, fontSize:9.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>
        <span style={{ width:5, height:5, borderRadius:'50%', background:t.accent }}/>
        Echo · today
      </div>
      <div style={{ fontSize:10, color:T.ink4, fontWeight:500 }}>60 sec · {lang.english}</div>
    </div>
  );

  if (state === 'idle') {
    return (
      <div style={{ borderRadius:16, padding:'18px 18px 16px', background:'#fff', border:`1px solid ${T.border}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:120, height:120, borderRadius:'50%', background:t.accentLight, opacity:.45 }}/>
        <div style={{ position:'relative' }}>
          {Eyebrow}
          <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.15, marginBottom:6 }}>
            Say <em style={{ fontStyle:'italic', color:t.accent }}>"{prompt.word}"</em> — once.
          </div>
          <div style={{ fontSize:12, color:T.ink2, lineHeight:1.45, marginBottom:4, fontFamily:T.serif, fontStyle:'italic' }}>
            "{prompt.sentence}"
          </div>
          <div style={{ fontSize:10.5, color:T.ink4, lineHeight:1.45, marginBottom:14 }}>{prompt.why}</div>
          {err && <div style={{ fontSize:10.5, color:'#C0392B', lineHeight:1.45, marginBottom:10 }}>{err}</div>}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8 }}>
            <button onClick={startRecording} style={{ width:72, height:72, borderRadius:'50%', background:t.accent, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 20px ${t.accent}55`, border:'none' }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
            </button>
            <button onClick={skipToday} style={{ fontSize:10.5, color:T.ink4, background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3, padding:0 }}>
              Save for tonight
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'skipped') {
    return (
      <div style={{ borderRadius:16, padding:'16px 18px', background:T.bg2, border:`1px solid ${T.border}` }}>
        {Eyebrow}
        <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.2, marginBottom:4 }}>Saved for tonight.</div>
        <div style={{ fontSize:11, color:T.ink4, marginBottom:10 }}>Saved for tonight \u2014 come back to keep your streak.</div>
        <button onClick={() => setState('idle')} style={{ padding:'7px 12px', borderRadius:99, fontSize:11, fontWeight:600, color:T.ink2, background:'#fff', border:`1.5px solid ${T.border}`, cursor:'pointer' }}>Do it now</button>
      </div>
    );
  }

  if (state === 'recording') {
    return (
      <div style={{ borderRadius:16, padding:'18px 18px', background:t.bg || '#FFF0EE', border:`1px solid ${t.accentLight}` }}>
        {Eyebrow}
        <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.2, marginBottom:12 }}>{prompt.sentence}</div>
        <div style={{ display:'flex', alignItems:'center', gap:2, height:28, marginBottom:8 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} style={{ flex:1, height:`${20 + Math.abs(Math.sin((Date.now()/120)+i*0.5))*80}%`, background:t.accent, borderRadius:2, animation:`mEchoBar .4s ease-in-out ${i*30}ms infinite alternate` }}/>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:7, fontSize:10.5, color:T.ink3, fontVariantNumeric:'tabular-nums' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#C0392B', animation:'mEchoPulse 1s infinite' }}/>
            <span>Listening… 0:{String(duration).padStart(2,'0')} / 0:08</span>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'center' }}>
          <button onClick={stopRecording} style={{ width:72, height:72, borderRadius:'50%', background:'#C0392B', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 8px 20px rgba(192,57,43,.4)', animation:'mEchoLive 1.4s infinite', border:'none' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          </button>
        </div>
        <style>{`@keyframes mEchoBar{from{transform:scaleY(.4)}to{transform:scaleY(1)}}@keyframes mEchoPulse{50%{opacity:.3}}@keyframes mEchoLive{50%{box-shadow:0 0 0 12px rgba(192,57,43,0)}}`}</style>
      </div>
    );
  }

  if (state === 'scoring') {
    return (
      <div style={{ borderRadius:16, padding:'24px 18px', background:'#fff', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:14 }}>
        <div style={{ width:36, height:36, borderRadius:'50%', border:`3px solid ${T.bg2}`, borderTopColor:t.accent, animation:'mEchoSpin .9s linear infinite' }}/>
        <div>
          <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.15 }}>Scoring…</div>
          <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>Comparing pronunciation in real time</div>
        </div>
        <style>{`@keyframes mEchoSpin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const echoStreak = parseInt((typeof window !== 'undefined' && localStorage.getItem(`__echo_streak_${code}`)) || '0', 10);
  const verdict =
    score >= 92 ? { label:'Crisp.',       hint:`Native-level. Echo streak +1 → ${echoStreak} days.`, color:'#1A8F4E' } :
    score >= 86 ? { label:'Solid.',       hint:`Almost there. Echo streak → ${echoStreak} days.`,    color:t.accent } :
                  { label:'Almost there.',hint:`Soften the vowel. Streak counts (${echoStreak}d).`,  color:'#A65A00' };

  return (
    <div style={{ borderRadius:16, padding:'16px 18px', background:'#fff', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ flex:1, minWidth:0 }}>
        {Eyebrow}
        <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.15 }}>
          <em style={{ fontStyle:'italic', color:verdict.color }}>{verdict.label}</em> {score}/100.
        </div>
        <div style={{ fontSize:10.5, color:T.ink3, marginTop:4, lineHeight:1.45 }}>{verdict.hint}</div>
        <div style={{ display:'flex', gap:6, marginTop:10 }}>
          <button onClick={tryAgain} style={{ padding:'6px 11px', borderRadius:99, fontSize:10.5, fontWeight:600, color:T.ink2, background:'transparent', border:`1.5px solid ${T.border}`, cursor:'pointer' }}>Again</button>
          <button data-nav="speaking" style={{ padding:'6px 11px', borderRadius:99, fontSize:10.5, fontWeight:700, color:'#fff', background:T.ink, border:'none', cursor:'pointer' }}>Full session →</button>
        </div>
      </div>
      <div style={{ flexShrink:0, width:74, height:74, borderRadius:'50%', background:`conic-gradient(${verdict.color} ${score * 3.6}deg, ${T.bg2} 0)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1 }}>{score}</div>
          <div style={{ fontSize:8, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase' }}>/ 100</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MEchoCard });
