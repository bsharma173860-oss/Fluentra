// ──────────────────────────────────────────────────────────────
// Echo — 60-second daily speaking warmup.
// Sits on the dashboard. One sentence, one recording, AI score in 2s.
// States: idle → recording → scoring → done. Plus "skipped" escape.
// Wired to per-language streak in localStorage.
// ──────────────────────────────────────────────────────────────

const { useState: useStateEcho, useEffect: useEffectEcho, useRef: useRefEcho } = React;

const ECHO_PROMPTS = {
  es: [
    { word:'cortado',    sentence:'Querría un cortado, por favor.',     why:'You said this twice yesterday with a soft "t". Make it crisp.' },
    { word:'cuenta',     sentence:'La cuenta, por favor.',              why:'Rolled "r" — the giveaway between B1 and B2.' },
    { word:'ahora',      sentence:'Lo necesito ahora.',                  why:'Silent "h". You added one yesterday.' },
    { word:'algo',       sentence:'¿Quieres algo de comer?',             why:'Soft "g" — Spanish, not English.' },
    { word:'aeropuerto', sentence:'Voy al aeropuerto a las ocho.',       why:'5 syllables, one breath. Try it.' },
    { word:'rojo',       sentence:'El coche es rojo.',                   why:'Double-trill "rr" on the first "r".' },
    { word:'tarde',      sentence:'Llego un poco tarde.',                why:'Crisp "t" → vowel. Common slip-up.' },
  ],
  fr: [
    { word:'croissant',  sentence:'Un croissant et un café, s\u2019il vous plaît.', why:'Nasal "an" — never an "ahn".' },
    { word:'bonjour',    sentence:'Bonjour, comment allez-vous ?',                  why:'Soft "j". Not "bone-jor".' },
    { word:'pardon',     sentence:'Pardon, je suis désolé.',                        why:'Final "n" goes nasal, not voiced.' },
  ],
  ja: [
    { word:'arigatou',   sentence:'\u3069\u3046\u3082\u3042\u308a\u304c\u3068\u3046\u3054\u3056\u3044\u307e\u3059\u3002', why:'Flat pitch on "ari-ga-to". Don\u2019t rise on the last syllable.' },
    { word:'sumimasen',  sentence:'\u3059\u307f\u307e\u305b\u3093\u3001\u3061\u3087\u3063\u3068\u3044\u3044\u3067\u3059\u304b\uff1f', why:'5 syllables, equal length. Practice the rhythm.' },
  ],
  de: [
    { word:'Brötchen',   sentence:'Ich nehme ein Brötchen, bitte.',     why:'The "ö" — round your lips like saying "ee" through "oh".' },
  ],
  en: [
    { word:'thought',    sentence:'I thought about it overnight.',      why:'The "th" — tongue between teeth, not "f".' },
    { word:'world',      sentence:'The world is smaller than you think.', why:'Two sounds in one: "wer-uld". Don\u2019t skip it.' },
  ],
};
ECHO_PROMPTS.it = ECHO_PROMPTS.es;
ECHO_PROMPTS.pt = ECHO_PROMPTS.es;

function getEchoPrompt(code) {
  const list = ECHO_PROMPTS[code] || ECHO_PROMPTS.es;
  const d = new Date();
  const doy = Math.floor((d - new Date(d.getFullYear(),0,0)) / 86400000);
  return list[doy % list.length];
}

function todayKey(code) {
  const d = new Date();
  const s = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
  return `__echo_done_${code}_${s}`;
}
function streakKey(code)   { return `__echo_streak_${code}`; }
function lastDoneKey(code) { return `__echo_last_${code}`; }

function bumpEchoStreak(code) {
  if (typeof window === 'undefined') return 0;
  try {
    const last = localStorage.getItem(lastDoneKey(code));
    const today = new Date(); today.setHours(0,0,0,0);
    let current = parseInt(localStorage.getItem(streakKey(code)) || '0', 10);
    if (last) {
      const lastDay = new Date(last); lastDay.setHours(0,0,0,0);
      const diff = Math.round((today - lastDay) / 86400000);
      if (diff === 0) return current;
      if (diff === 1) current += 1;
      else current = 1;
    } else { current = 1; }
    localStorage.setItem(streakKey(code), String(current));
    localStorage.setItem(lastDoneKey(code), today.toISOString());
    return current;
  } catch { return 0; }
}

function EchoCard() {
  const code = (typeof window !== 'undefined' && window.__langCode) || 'es';
  const lang = (typeof langByCode === 'function') ? langByCode(code) : { code, english:'Spanish' };
  const t = (typeof langTheme === 'function') ? langTheme(code) : { accent:'#C04A06', accentLight:'#FFE5DE', bg:'#FFF0EE' };
  const prompt = getEchoPrompt(code);

  const storedDone = typeof window !== 'undefined' && localStorage.getItem(todayKey(code));
  const initialDone = storedDone ? JSON.parse(storedDone) : null;
  const [state, setState] = useStateEcho(initialDone ? 'done' : 'idle');
  const [score, setScore] = useStateEcho(initialDone?.score || 0);
  const [duration, setDuration] = useStateEcho(0);
  const timerRef = useRefEcho(null);
  const recStartRef = useRefEcho(null);
  const streamRef = useRefEcho(null);
  const recRef = useRefEcho(null);
  const chunksRef = useRefEcho([]);
  const [err, setErr] = useStateEcho('');
  function _stopTracks() { if (streamRef.current) { streamRef.current.getTracks().forEach(function (tr) { tr.stop(); }); streamRef.current = null; } }
  useEffectEcho(function () { return function () { try { if (recRef.current && recRef.current.state === 'recording') recRef.current.stop(); } catch (e) {} _stopTracks(); }; }, []);

  useEffectEcho(() => {
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
      const newStreak = bumpEchoStreak(code);
      const result = { score: sc, date: new Date().toISOString(), streak: newStreak };
      setScore(sc); setState('done');
      try { localStorage.setItem(todayKey(code), JSON.stringify(result)); } catch (e) {}
    } catch (e) { setErr('Scoring failed — check your connection and try again.'); setState('idle'); }
  }
  function skipToday() { setState('skipped'); }
  function tryAgain() {
    try { localStorage.removeItem(todayKey(code)); } catch {}
    setState('idle'); setScore(0); setDuration(0);
  }

  const Header = (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
      <div style={{ display:'flex', alignItems:'center', gap:6, padding:'4px 10px', borderRadius:99, background:t.accentLight, color:t.accent, fontSize:10, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:t.accent }}/>
        Echo · today
      </div>
      <div style={{ fontSize:11, color:T.ink4, fontWeight:500 }}>60 seconds · {lang.english}</div>
    </div>
  );

  if (state === 'idle') {
    return (
      <div style={{ width:'100%', borderRadius:18, padding:'24px 28px', marginBottom:24, background:'#fff', border:`1px solid ${T.border}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-30, top:-30, width:160, height:160, borderRadius:'50%', background:t.accentLight, opacity:.45 }}/>
        <div style={{ position:'relative' }}>
          {Header}
          <div style={{ display:'flex', alignItems:'center', gap:24 }}>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.15, marginBottom:8 }}>
                Say <em style={{ fontStyle:'italic', color:t.accent }}>"{prompt.word}"</em> out loud — once.
              </div>
              <div style={{ fontSize:13, color:T.ink2, lineHeight:1.5, marginBottom:6 }}>
                Try the whole sentence: <span style={{ fontFamily:T.serif, color:T.ink, fontStyle:'italic' }}>"{prompt.sentence}"</span>
              </div>
              <div style={{ fontSize:11.5, color:T.ink4, lineHeight:1.5, marginBottom:10 }}>{prompt.why}</div>
              {err && <div style={{ fontSize:11.5, color:'#C0392B', lineHeight:1.5, marginBottom:8 }}>{err}</div>}
              <button onClick={skipToday} style={{ fontSize:11, color:T.ink4, background:'transparent', border:'none', cursor:'pointer', textDecoration:'underline', textUnderlineOffset:3, padding:0 }}>
                Can't speak right now? Save for tonight.
              </button>
            </div>
            <button onClick={startRecording} style={{ flexShrink:0, width:84, height:84, borderRadius:'50%', background:t.accent, color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 10px 24px ${t.accent}55`, position:'relative', transition:'transform .15s', border:'none' }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === 'skipped') {
    return (
      <div style={{ width:'100%', borderRadius:18, padding:'20px 28px', marginBottom:24, background:T.bg2, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.2 }}>Saved for tonight.</div>
          <div style={{ fontSize:12, color:T.ink4, marginTop:3 }}>Saved for tonight \u2014 come back to keep your streak.</div>
        </div>
        <button onClick={() => setState('idle')} style={{ padding:'8px 14px', borderRadius:99, fontSize:12, fontWeight:600, color:T.ink2, background:'#fff', border:`1.5px solid ${T.border}`, cursor:'pointer' }}>Do it now</button>
      </div>
    );
  }

  if (state === 'recording') {
    return (
      <div style={{ width:'100%', borderRadius:18, padding:'24px 28px', marginBottom:24, background:t.bg || '#FFF0EE', border:`1px solid ${t.accentLight}`, position:'relative' }}>
        {Header}
        <div style={{ display:'flex', alignItems:'center', gap:24 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.2, marginBottom:10 }}>{prompt.sentence}</div>
            <div style={{ display:'flex', alignItems:'center', gap:3, height:34, marginBottom:6 }}>
              {Array.from({ length: 32 }).map((_, i) => (
                <div key={i} style={{ flex:1, height:`${20 + Math.abs(Math.sin((Date.now()/120)+i*0.5))*80}%`, background:t.accent, borderRadius:2, opacity: 0.65 + Math.random() * 0.35, animation:`echoBar .4s ease-in-out ${i*30}ms infinite alternate` }}/>
              ))}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10, fontSize:11.5, color:T.ink3, fontVariantNumeric:'tabular-nums' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#C0392B', animation:'echoPulse 1s infinite' }}/>
              <span>Listening… 0:{String(duration).padStart(2,'0')} / 0:08</span>
            </div>
          </div>
          <button onClick={stopRecording} style={{ flexShrink:0, width:84, height:84, borderRadius:'50%', background:'#C0392B', color:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 10px 24px rgba(192,57,43,.4)', animation:'echoLive 1.4s infinite', border:'none' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
          </button>
        </div>
        <style>{`@keyframes echoBar{from{transform:scaleY(.4)}to{transform:scaleY(1)}}@keyframes echoPulse{50%{opacity:.3}}@keyframes echoLive{50%{box-shadow:0 0 0 14px rgba(192,57,43,0)}}`}</style>
      </div>
    );
  }

  if (state === 'scoring') {
    return (
      <div style={{ width:'100%', borderRadius:18, padding:'24px 28px', marginBottom:24, background:'#fff', border:`1px solid ${T.border}` }}>
        {Header}
        <div style={{ display:'flex', alignItems:'center', gap:20, padding:'14px 0' }}>
          <div style={{ width:48, height:48, borderRadius:'50%', border:`3px solid ${T.bg2}`, borderTopColor:t.accent, animation:'echoSpin .9s linear infinite' }}/>
          <div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.2 }}>Scoring your pronunciation…</div>
            <div style={{ fontSize:12, color:T.ink4, marginTop:4 }}>Comparing against native speakers in real time</div>
          </div>
        </div>
        <style>{`@keyframes echoSpin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  const echoStreak = parseInt((typeof window !== 'undefined' && localStorage.getItem(streakKey(code))) || '0', 10);
  const verdict =
    score >= 92 ? { label:'Crisp.',       hint:`Sounded native. Echo streak +1 → ${echoStreak} days.`, color:'#1A8F4E' } :
    score >= 86 ? { label:'Solid.',       hint:`Just a touch more crisp on the consonant. Echo streak → ${echoStreak} days.`, color:t.accent } :
                  { label:'Almost there.',hint:`Soften the vowel — streak still counts (${echoStreak} days).`, color:'#A65A00' };

  return (
    <div style={{ width:'100%', borderRadius:18, padding:'24px 28px', marginBottom:24, background:'#fff', border:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:24 }}>
      <div style={{ flex:1 }}>
        {Header}
        <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.15 }}>
          <em style={{ fontStyle:'italic', color:verdict.color }}>{verdict.label}</em> Score {score}/100.
        </div>
        <div style={{ fontSize:13, color:T.ink3, marginTop:6, lineHeight:1.5 }}>{verdict.hint}</div>
        <div style={{ display:'flex', gap:8, marginTop:14 }}>
          <button onClick={tryAgain} style={{ padding:'8px 14px', borderRadius:99, fontSize:12, fontWeight:600, color:T.ink2, background:'transparent', border:`1.5px solid ${T.border}`, cursor:'pointer' }}>Try again</button>
          <button data-nav="speaking" style={{ padding:'8px 14px', borderRadius:99, fontSize:12, fontWeight:700, color:'#fff', background:T.ink, border:'none', cursor:'pointer' }}>Open full speaking session →</button>
        </div>
      </div>
      <div style={{ flexShrink:0, width:112, height:112, borderRadius:'50%', background:`conic-gradient(${verdict.color} ${score * 3.6}deg, ${T.bg2} 0)`, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ width:88, height:88, borderRadius:'50%', background:'#fff', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1 }}>{score}</div>
          <div style={{ fontSize:9, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginTop:2 }}>/ 100</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EchoCard, getEchoPrompt, bumpEchoStreak });
