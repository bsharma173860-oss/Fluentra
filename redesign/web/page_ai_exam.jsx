// ── AI Exam Screens ───────────────────────────────────────────
// Real-time AI-generated content: writing prompts, reading passages,
// listening scripts, speaking conversations. Fresh daily.

const { useState: useStateAI, useEffect: useEffectAI, useRef: useRefAI } = React;

// ── 1. AI GENERATING (initial load) ───────────────────────────
function AIGenerating({ skill, onReady }) {
  skill = skill || window.__aiSkill || 'reading';
  const defaultDest = { reading:'ai_reading_pre', listening:'ai_listening_pre', speaking:'mic_check', writing:'writing' }[skill] || 'practice';
  const _onReady = onReady || (() => window.__nav && window.__nav(defaultDest));
  const [step, setStep] = useStateAI(0);
  const lang = (LANGUAGES.find(l => l.code === (window.__langCode||'en')) || LANGUAGES[0]);
  const exam = (typeof langPack === 'function') ? (langPack(lang.code).exam?.short || 'CEFR') : (({en:'IELTS',es:'DELE',ja:'JLPT',fr:'DELF'})[lang.code]||'CEFR');
  const steps = {
    writing:   ['Connecting to Claude…', `Generating fresh ${exam} prompt…`, 'Personalizing for your level…', 'Ready'],
    reading:   ['Connecting to Claude…', `Generating ${lang.english} passage (600–900 words)…`, 'Building question set…', 'Ready'],
    listening: ['Connecting to Claude…', 'Writing dialogue script…', 'Synthesizing voice with ElevenLabs…', 'Ready'],
    speaking:  ['Preparing your AI examiner…', 'Loading exam rubric…', 'Ready'],
  }[skill] || ['Loading…','Ready'];

  useEffectAI(() => {
    if (step >= steps.length - 1) { const t = setTimeout(_onReady, 600); return () => clearTimeout(t); }
    const t = setTimeout(() => setStep(s => s + 1), [800, 1400, 1100, 600][step] || 900);
    return () => clearTimeout(t);
  }, [step]);

  const t = langTheme(lang.code);
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:520, background:T.card, border:`1px solid ${T.border}`, borderRadius:22, padding:'40px 36px', boxShadow:T.shadow }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:`linear-gradient(135deg, ${t.accent}, ${t.accent}cc)`, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 8px 18px ${t.accent}33` }}>
            {Icon.spark({ width:20, height:20 })}
          </div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>AI is preparing your session</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.1, marginTop:3 }}>Today's {exam} {skill}</div>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {steps.map((s, i) => {
            const done = i < step, active = i === step, pending = i > step;
            return (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 12px', borderRadius:10, background: active ? t.accentLight : 'transparent', opacity: pending ? .35 : 1, transition:'all .2s' }}>
                <div style={{ width:22, height:22, borderRadius:11, background: done ? t.accent : (active ? t.accent : T.bg3), color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {done ? Icon.check({ width:11, height:11 }) : (active ? <span style={{ width:8, height:8, borderRadius:4, background:'#fff', animation:'aipulse 1s ease-in-out infinite' }}/> : null)}
                </div>
                <div style={{ fontSize:13.5, color: active ? T.ink : T.ink2, fontWeight: active ? 600 : 400 }}>{s}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop:22, padding:'12px 14px', background:T.bg2, borderRadius:10, fontSize:11.5, color:T.ink4, lineHeight:1.55, display:'flex', gap:8 }}>
          {Icon.spark({ width:13, height:13, style:{ color:T.ink5, marginTop:1, flexShrink:0 } })}
          <div>Fresh content generated daily — no two sessions are the same. Your weak spots from past sessions inform today's question.</div>
        </div>
        <style>{`@keyframes aipulse{0%,100%{opacity:.4;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}`}</style>
      </div>
    </div>
  );
}

// ── 2. AI WRITING SESSION (already had session — add grading state) ─
function AIWritingGrading() {
  const [phase, setPhase] = useStateAI(0);
  const phases = ['Reading your essay…', 'Analyzing structure & cohesion…', 'Scoring grammar & vocabulary…', 'Generating personalized feedback…'];
  useEffectAI(() => {
    if (phase >= phases.length) { const t = setTimeout(() => window.__nav && window.__nav('mod_results'), 800); return () => clearTimeout(t); }
    const t = setTimeout(() => setPhase(p => p + 1), 900);
    return () => clearTimeout(t);
  }, [phase]);
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg }}>
      <div style={{ textAlign:'center', maxWidth:480 }}>
        <div style={{ width:84, height:84, borderRadius:42, margin:'0 auto 28px', background:`linear-gradient(135deg, ${T.writing.c}, ${T.brand})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 18px 40px ${T.writing.c}55`, animation:'aifloat 2.5s ease-in-out infinite' }}>
          {Icon.spark({ width:32, height:32 })}
        </div>
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>Claude is grading your essay</div>
        <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1.15, marginBottom:22 }}>Hold tight — usually 3–5 seconds</div>
        <div style={{ display:'flex', flexDirection:'column', gap:10, textAlign:'left' }}>
          {phases.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13.5, color: i < phase ? T.ink3 : (i === phase ? T.ink : T.ink5), fontWeight: i === phase ? 600 : 400 }}>
              <div style={{ width:18, height:18, borderRadius:9, background: i < phase ? T.writing.c : (i === phase ? T.writing.bg : 'transparent'), border: i === phase ? `2px solid ${T.writing.c}` : 'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {i < phase && Icon.check({ width:10, height:10, style:{ color:'#fff' } })}
              </div>
              {p}
            </div>
          ))}
        </div>
        <style>{`@keyframes aifloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}`}</style>
      </div>
    </div>
  );
}

// ── 3. SPEAKING — MIC CHECK ───────────────────────────────────
function MicCheckPage() {
  const [granted, setGranted] = useStateAI(false);
  const [level, setLevel] = useStateAI(0);
  useEffectAI(() => { if (!granted) return; const i = setInterval(() => setLevel(20 + Math.random()*70), 100); return () => clearInterval(i); }, [granted]);
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:520, background:T.card, border:`1px solid ${T.border}`, borderRadius:22, padding:'40px 36px', textAlign:'center' }}>
        <div style={{ width:88, height:88, borderRadius:44, margin:'0 auto 22px', background: granted ? T.speaking.bg : T.bg2, color: granted ? T.speaking.c : T.ink4, display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
          {Icon.mic({ width:34, height:34 })}
          {granted && <div style={{ position:'absolute', inset:-8, borderRadius:50, border:`3px solid ${T.speaking.c}`, opacity:level/100 }}/>}
        </div>
        <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.15, marginBottom:10 }}>{granted ? 'Mic is working!' : 'Mic check'}</div>
        <div style={{ fontSize:14, color:T.ink3, lineHeight:1.55, marginBottom:24 }}>{granted ? 'Say a few words to confirm input level. Looks good — ready when you are.' : 'The AI examiner needs to hear you. Click below to allow microphone access.'}</div>
        {granted && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:36, marginBottom:24 }}>
            {Array.from({length:24}).map((_,i) => {
              const h = 6 + Math.abs(Math.sin((i+Date.now()/200)*0.6))*level/100*28;
              return <div key={i} style={{ width:5, borderRadius:3, background:T.speaking.c, height:h, opacity:.6 + (level/100)*.4 }}/>;
            })}
          </div>
        )}
        <div style={{ display:'flex', gap:10, flexDirection:'column' }}>
          {!granted ? (
            <Btn label="Allow microphone" icon={Icon.mic({ width:14, height:14 })} accent={T.speaking.c} size="lg" fullWidth onClick={() => setGranted(true)}/>
          ) : (
            <Btn label="Start AI examiner" iconRight={Icon.arrow({ width:13, height:13 })} accent={T.speaking.c} size="lg" fullWidth onClick={() => window.__nav && window.__nav('ai_speaking')}/>
          )}
          <button data-nav="exams" style={{ fontSize:12.5, color:T.ink4, padding:8, background:'transparent', cursor:'pointer' }}>Cancel</button>
        </div>
        <div style={{ marginTop:24, padding:'12px 14px', background:T.bg2, borderRadius:10, fontSize:11.5, color:T.ink4, lineHeight:1.55, textAlign:'left' }}>
          <b style={{ color:T.ink2 }}>Quiet space recommended.</b> Background noise can affect pronunciation scoring. Headphones with a built-in mic work great.
        </div>
      </div>
    </div>
  );
}

// ── 4. AI SPEAKING SESSION (real-time conversation) ───────────
function AISpeakingSession() {
  // turn = 'ai' | 'user' | 'processing'  — REAL pipeline (Whisper + Claude + TTS via /api/speaking-eval)
  const [turn, setTurn] = useStateAI('ai');
  const [exchange, setExchange] = useStateAI(0);
  const [aiPrompt, setAiPrompt] = useStateAI("Hello, I'm your AI examiner today. Let's start with something familiar — tell me about your hometown. What do you like most about it?");
  const [topic, setTopic] = useStateAI('Part 1 · Familiar topics');
  const [transcript, setTranscript] = useStateAI('');
  const [err, setErr] = useStateAI('');
  const MAX_EXCHANGES = 4;

  const recRef = useRefAI(null), chunksRef = useRefAI([]), audioRef = useRefAI(null);
  const examName = (window.__examCtx && window.__examCtx.exam) || 'IELTS';

  async function startRecording() {
    setErr('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = function (e) { if (e.data && e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = function () { stream.getTracks().forEach(function (t) { t.stop(); }); evaluateAnswer(); };
      recRef.current = mr;
      mr.start();
      setTurn('user');
    } catch (e) {
      setErr('Microphone access is needed to answer. ' + (e.message || ''));
    }
  }

  function stopRecording() {
    setTurn('processing');
    try { if (recRef.current && recRef.current.state !== 'inactive') recRef.current.stop(); } catch (e) {}
  }

  async function evaluateAnswer() {
    try {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const audioBase64 = await new Promise(function (resolve) {
        const fr = new FileReader();
        fr.onloadend = function () { resolve(String(fr.result).split(',')[1]); };
        fr.readAsDataURL(blob);
      });
      const resp = await fetch('/api/speaking-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioBase64: audioBase64, mimeType: 'audio/webm', exam: examName, part: topic, question: aiPrompt, targetLevel: 'B2', speak: true }),
      });
      const data = await resp.json();
      if (!resp.ok || data.error) throw new Error(data.error || 'evaluation failed');
      if (!data.evaluation) { setErr(data.note || 'No speech detected — please try again.'); setTurn('ai'); return; }
      setTranscript(data.transcript || '');
      window.__fluentraSpeaking = window.__fluentraSpeaking || [];
      window.__fluentraSpeaking.push({ question: aiPrompt, transcript: data.transcript, evaluation: data.evaluation });
      if (data.replyAudioBase64 && audioRef.current) {
        audioRef.current.src = 'data:audio/mp3;base64,' + data.replyAudioBase64;
        audioRef.current.play().catch(function () {});
      }
      if (exchange < MAX_EXCHANGES - 1) {
        setAiPrompt(data.evaluation.examiner_reply || "Thank you. Let's move on to the next question.");
        setTopic('Follow-up · part ' + (exchange + 2));
        setExchange(function (e) { return e + 1; });
        setTurn('ai');
      } else {
        if (window.__exam && window.__exam.active) {
          var _arr = (window.__fluentraSpeaking || []).slice(-MAX_EXCHANGES);
          var _bands = _arr.map(function (x) { return (x.evaluation && Number(x.evaluation.overall_band)) || 0; }).filter(function (b) { return b > 0; });
          var _avg = _bands.length ? _bands.reduce(function (a, b) { return a + b; }, 0) / _bands.length : 0;
          window.dispatchEvent(new CustomEvent('fl-exam-section-done', { detail: { module:'speaking', score: Math.round(_avg / 9 * 100) } }));
        } else {
          window.__nav && window.__nav('mod_results');
        }
      }
    } catch (e) {
      setErr('Something went wrong: ' + (e.message || e) + '. Please try again.');
      setTurn('ai');
    }
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background: turn === 'ai' ? `linear-gradient(160deg, ${T.speaking.bg}, ${T.bg})` : T.bg }}>
      {/* Top bar */}
      <div style={{ padding:'18px 32px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'space-between', background:T.bg, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button data-nav="exams" style={{ width:32, height:32, borderRadius:8, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg2 }}>{Icon.x({ width:13, height:13 })}</button>
          <div>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>Live · Whisper + Claude</div>
            <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginTop:2 }}>{topic}</div>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          {turn === 'user' && (
            <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:T.card, border:`1px solid ${T.border}`, borderRadius:99 }}>
              <span style={{ width:6, height:6, borderRadius:3, background:'#EF4444', animation:'recpulse 1.2s ease-in-out infinite' }}/>
              <span style={{ fontSize:11, fontWeight:700, color:T.ink2 }}>REC</span>
            </div>
          )}
          <div style={{ fontSize:11.5, color:T.ink4 }}>Exchange {exchange+1} / {MAX_EXCHANGES}</div>
        </div>
      </div>

      {/* Main stage */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, gap:34 }}>
        <div style={{ position:'relative', width:200, height:200, display:'flex', alignItems:'center', justifyContent:'center' }}>
          {turn === 'ai' && (
            <>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:`radial-gradient(circle, ${T.speaking.c}55, ${T.speaking.c}00 70%)`, animation:'aiorb 3s ease-in-out infinite' }}/>
              <div style={{ position:'absolute', inset:30, borderRadius:'50%', background:`radial-gradient(circle, ${T.speaking.c}88, ${T.speaking.c}33 60%)`, animation:'aiorb 3s ease-in-out infinite .4s' }}/>
              <div style={{ width:108, height:108, borderRadius:54, background:`linear-gradient(135deg, ${T.speaking.c}, ${T.brand})`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', boxShadow:`0 16px 40px ${T.speaking.c}88`, position:'relative' }}>
                {Icon.spark({ width:38, height:38 })}
              </div>
            </>
          )}
          {turn === 'user' && (
            <>
              <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:`3px solid ${T.brand}33`, animation:'micring 1.4s ease-out infinite' }}/>
              <div style={{ position:'absolute', inset:24, borderRadius:'50%', border:`3px solid ${T.brand}66`, animation:'micring 1.4s ease-out .5s infinite' }}/>
              <div style={{ width:108, height:108, borderRadius:54, background:T.card, border:`3px solid ${T.brand}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.brand }}>
                {Icon.mic({ width:42, height:42 })}
              </div>
            </>
          )}
          {turn === 'processing' && (
            <div style={{ width:108, height:108, borderRadius:54, background:T.bg2, border:`3px dashed ${T.ink5}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink4 }}>
              <div style={{ display:'flex', gap:5 }}>
                {[0,1,2].map(function (i) { return <span key={i} style={{ width:8, height:8, borderRadius:4, background:T.ink4, animation:`procbounce 1s ${i*.15}s infinite` }}/>; })}
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign:'center', maxWidth:640 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:12 }}>
            {turn === 'ai' ? 'Examiner' : turn === 'user' ? 'Your turn — recording' : 'Evaluating your response'}
          </div>
          {turn === 'ai' && (
            <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.4, textWrap:'balance' }}>"{aiPrompt}"</div>
          )}
          {turn === 'user' && (
            <>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.4, marginBottom:18 }}>Recording your answer — tap Done speaking when finished.</div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:48 }}>
                {Array.from({length:36}).map(function (_, i) { return <div key={i} style={{ width:4, borderRadius:2, background:T.brand, height:8+Math.abs(Math.sin(i*0.6+Date.now()/200)*30), opacity:.7 }}/>; })}
              </div>
            </>
          )}
          {turn === 'processing' && (
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.4 }}>Transcribing with Whisper, grading with Claude…</div>
          )}
          {err && <div style={{ marginTop:14, color:'#FCA5A5', fontSize:13 }}>{err}</div>}
        </div>

        {/* Real transcript ribbon */}
        <div style={{ width:'100%', maxWidth:680, background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ width:24, height:24, borderRadius:12, background:T.speaking.bg, color:T.speaking.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11, fontWeight:700 }}>You</div>
          <div style={{ fontSize:13, color:T.ink2, lineHeight:1.5, flex:1, minHeight:38 }}>
            {transcript ? <span style={{ color:T.ink }}>"{transcript}"</span> : <span style={{ color:T.ink5 }}>Your transcribed answer will appear here after you speak.</span>}
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div style={{ padding:'18px 32px', borderTop:`1px solid ${T.border}`, background:T.card, display:'flex', alignItems:'center', justifyContent:'flex-end', flexShrink:0 }}>
        <div style={{ display:'flex', gap:10 }}>
          {turn === 'ai' && <Btn label="I'm ready to speak" icon={Icon.mic({ width:13, height:13 })} accent={T.brand} size="md" onClick={startRecording}/>}
          {turn === 'user' && <Btn label="Done speaking" iconRight={Icon.arrow({ width:13, height:13 })} accent={T.brand} size="md" onClick={stopRecording}/>}
          {turn === 'processing' && <Btn label="Evaluating…" accent={T.ink4} size="md" onClick={function () {}}/>}
        </div>
      </div>

      <audio ref={audioRef} style={{ display:'none' }}/>
      <style>{`
        @keyframes recpulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes aiorb{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.15);opacity:1}}
        @keyframes micring{0%{transform:scale(.7);opacity:1}100%{transform:scale(1.4);opacity:0}}
        @keyframes procbounce{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}
      `}</style>
    </div>
  );
}

// ── 5. AI LISTENING — pre-session warning + one-shot player ──
function AIListeningPre() {
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:560, background:T.card, border:`1px solid ${T.border}`, borderRadius:22, padding:'40px 36px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:T.listening.bg, color:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.head({ width:22, height:22 })}</div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Today's listening · Generated 02:14 AM</div>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.15, marginTop:3 }}>A conversation about renting an apartment</div>
          </div>
        </div>
        <div style={{ background:T.bg2, borderRadius:12, padding:18, marginBottom:18 }}>
          <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:10 }}>What you'll hear</div>
          <div style={{ fontSize:13, color:T.ink2, lineHeight:1.6 }}>Two speakers — a tenant inquiring about a flat in Manchester and a landlord. Topics include rent, deposit, utilities, and move-in date. ~6 minutes, mid-pace British accents.</div>
          <div style={{ display:'flex', gap:14, marginTop:12, fontSize:11.5, color:T.ink4 }}>
            <span style={{ display:'flex', gap:4, alignItems:'center' }}>{Icon.clock({ width:11, height:11 })} 6:18</span>
            <span style={{ display:'flex', gap:4, alignItems:'center' }}>{Icon.users({ width:11, height:11 })} 2 voices</span>
            <span style={{ display:'flex', gap:4, alignItems:'center' }}>{Icon.spark({ width:11, height:11 })} ElevenLabs · v3</span>
          </div>
        </div>
        <div style={{ background:'#FEF3C7', border:'1px solid #F59E0B', borderRadius:12, padding:'14px 16px', marginBottom:24, display:'flex', gap:10 }}>
          {Icon.warn ? Icon.warn({ width:16, height:16, style:{ color:'#B45309', flexShrink:0, marginTop:1 } }) : <span style={{ fontSize:16 }}>⚠️</span>}
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'#7A4E0B', marginBottom:3 }}>Audio plays once only</div>
            <div style={{ fontSize:12, color:'#7A4E0B', lineHeight:1.5 }}>You can't pause, rewind, or replay — just like the real exam. Take notes as you listen.</div>
          </div>
        </div>
        <Btn label="Start listening (6:18)" icon={Icon.play({ width:13, height:13 })} accent={T.listening.c} size="lg" fullWidth onClick={() => window.__nav && window.__nav('listening')}/>
        <button data-nav="exams" style={{ marginTop:10, width:'100%', padding:10, fontSize:12, color:T.ink4, background:'transparent' }}>Not ready — go back</button>
      </div>
    </div>
  );
}

// ── 6. AI READING — pre-session preview ───────────────────────
function AIReadingPre() {
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:T.bg, padding:40 }}>
      <div style={{ width:'100%', maxWidth:560, background:T.card, border:`1px solid ${T.border}`, borderRadius:22, padding:'40px 36px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:T.reading.bg, color:T.reading.c, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.book({ width:22, height:22 })}</div>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Today's passage · 847 words · Academic</div>
            <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.15, marginTop:3 }}>The architecture of memory</div>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8, marginBottom:18 }}>
          {[
            { l:'True / False / NG', n:5, c:T.reading.c },
            { l:'Multiple choice', n:4, c:T.brand },
            { l:'Gap fill', n:2, c:T.writing.c },
            { l:'Match heading', n:2, c:T.speaking.c },
          ].map(q => (
            <div key={q.l} style={{ padding:'12px 10px', background:T.bg2, borderRadius:10, textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:22, color:q.c, lineHeight:1 }}>{q.n}</div>
              <div style={{ fontSize:10, color:T.ink4, marginTop:4, fontWeight:600 }}>{q.l}</div>
            </div>
          ))}
        </div>
        <div style={{ background:T.bg2, borderRadius:12, padding:'14px 16px', marginBottom:24, display:'flex', justifyContent:'space-between', fontSize:12.5, color:T.ink2 }}>
          <span><b style={{ color:T.ink }}>13 questions</b> · 60 minutes</span>
          <span style={{ color:T.ink4 }}>Generated 02:14 AM by Claude</span>
        </div>
        <Btn label="Start reading test" icon={Icon.play({ width:13, height:13 })} accent={T.reading.c} size="lg" fullWidth onClick={() => window.__nav && window.__nav('reading')}/>
        <button data-nav="exams" style={{ marginTop:10, width:'100%', padding:10, fontSize:12, color:T.ink4, background:'transparent' }}>Not ready — go back</button>
      </div>
    </div>
  );
}

// ── 7. RATE LIMIT MODAL ───────────────────────────────────────
function RateLimitModal() {
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(20,20,20,.55)', backdropFilter:'blur(4px)', padding:40 }}>
      <div style={{ width:'100%', maxWidth:480, background:T.card, borderRadius:20, padding:'36px 32px', boxShadow:'0 30px 80px rgba(0,0,0,.3)', textAlign:'center' }}>
        <div style={{ width:72, height:72, borderRadius:36, margin:'0 auto 22px', background:`linear-gradient(135deg, ${T.brand}, #7C3AED)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.lock({ width:30, height:30 })}</div>
        <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.15, marginBottom:10 }}>Daily session used</div>
        <div style={{ fontSize:14, color:T.ink3, lineHeight:1.55, marginBottom:22 }}>Free plan includes 1 AI session per day. Resets in <b>4h 12m</b> (midnight UTC).</div>
        <div style={{ background:T.bg2, borderRadius:14, padding:18, marginBottom:22, textAlign:'left' }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Pro unlocks</div>
          {[
            { ic:'check', t:'5 AI sessions per day', s:'across all 4 modules' },
            { ic:'check', t:'Mock exams + scoring', s:'unlimited' },
            { ic:'check', t:'Detailed feedback', s:'sentence-level corrections' },
            { ic:'check', t:'Save sessions to library', s:'replay & review anytime' },
          ].map(r => (
            <div key={r.t} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0' }}>
              <div style={{ width:20, height:20, borderRadius:10, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.check({ width:11, height:11 })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.t}</div>
                <div style={{ fontSize:11.5, color:T.ink4 }}>{r.s}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <Btn label="Upgrade to Pro · $24/mo" onClick={() => window.payFor && window.payFor('pro_monthly')} iconRight={Icon.arrow({ width:13, height:13 })} accent={T.brand} size="lg" fullWidth/>
          <button data-nav="dashboard" style={{ padding:12, fontSize:13, color:T.ink3, background:'transparent', cursor:'pointer', fontWeight:600 }}>Come back tomorrow</button>
        </div>
      </div>
    </div>
  );
}

// ── 8. EXAM UNLOCK CELEBRATION (9-day streak) ────────────────
function ExamUnlockModal() {
  return (
    <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg, ${T.brand}, #C026D3)`, padding:40, position:'relative', overflow:'hidden' }}>
      {/* Confetti */}
      {Array.from({length:40}).map((_,i) => (
        <div key={i} style={{ position:'absolute', width:8, height:14, background:['#F59E0B','#10B981','#EC4899','#FBBF24','#fff'][i%5], top:`${Math.random()*100}%`, left:`${Math.random()*100}%`, transform:`rotate(${Math.random()*360}deg)`, opacity:.85, animation:`confetti ${2+Math.random()*2}s ${Math.random()*2}s ease-in infinite` }}/>
      ))}
      <div style={{ width:'100%', maxWidth:520, background:T.card, borderRadius:24, padding:'44px 36px', boxShadow:'0 40px 100px rgba(0,0,0,.4)', textAlign:'center', position:'relative', zIndex:2 }}>
        <div style={{ fontSize:64, marginBottom:14 }}>🔓</div>
        <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:12 }}>9-day streak unlocked</div>
        <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.05, letterSpacing:'-.01em', marginBottom:14 }}>You can take the<br/>real exam.</div>
        <div style={{ fontSize:15, color:T.ink3, lineHeight:1.55, marginBottom:28 }}>9 days of consistent practice. Your AI examiner thinks you're ready — book a real IELTS slot at a test center, or take an unlimited free mock first.</div>
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          <Btn label="Book real exam" nav="exam_book" iconRight={Icon.arrow({ width:13, height:13 })} accent={T.brand} size="lg" style={{ flex:1 }}/>
          <Btn label="Try free mock" nav="mock_test" variant="outline" accent={T.ink} size="lg" style={{ flex:1 }}/>
        </div>
        <button data-nav="dashboard" style={{ fontSize:12.5, color:T.ink4, padding:8, background:'transparent', cursor:'pointer' }}>Maybe later</button>
      </div>
      <style>{`@keyframes confetti{0%{transform:translateY(-100vh) rotate(0)}100%{transform:translateY(100vh) rotate(720deg)}}`}</style>
    </div>
  );
}

// ── 9. STREAK CALENDAR (heatmap) ──────────────────────────────
function StreakCalendarPage() {
  // Generate 12 weeks of activity
  // 4 dense weeks instead of 12 — easier to read at a glance
  const _langs = (typeof userLanguages === 'function') ? userLanguages() : [];
  const streak = _langs.length ? Math.max.apply(null, _langs.map(function (l) { return l.streak || 0; })) : 0;
  const days = Array.from({length: 4 * 7}).map((_, i) => ({
    d: i,
    // index (4*7-1) is today; the most recent `streak` days are active
    intensity: ((4 * 7 - 1) - i) < streak ? 3 : 0,
  }));
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <PageHeader eyebrow="Streak" title={streak > 0 ? `${streak} ${streak === 1 ? 'day' : 'days'} strong` : 'Start your streak'} subtitle={streak >= 9 ? 'Your streak has unlocked the real exam — keep it going.' : `Reach a 9-day streak to unlock the real exam — ${Math.max(0, 9 - streak)} to go.`}
          right={<div style={{ display:'flex', gap:18 }}>
            <div><div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>Current</div><div style={{ fontFamily:T.serif, fontSize:28, color:T.brand, lineHeight:1 }}>7 🔥</div></div>
            <div><div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase' }}>Longest</div><div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1 }}>14</div></div>
          </div>}
        />
        {/* Heatmap */}
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'24px 28px', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:18, marginBottom:14 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>Last 4 weeks</div>
              <div style={{ fontSize:13, color:T.ink2, marginTop:4 }}>Each square is one day. Darker = more sessions.</div>
            </div>
            <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:6, fontSize:11, color:T.ink4 }}>
              Less {[0,1,2,3,4].map(i => <span key={i} style={{ width:11, height:11, borderRadius:3, background:i===0?T.bg2:`color-mix(in oklch, ${T.brand} ${i*22}%, ${T.bg2})` }}/>)} More
            </div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {Array.from({length:4}).map((_,wk) => (
              <div key={wk} style={{ display:'flex', flexDirection:'column', gap:8, flex:1 }}>
                {Array.from({length:7}).map((_,d) => {
                  const idx = wk*7+d;
                  const it = days[idx]?.intensity || 0;
                  return <div key={d} title={`${it} sessions`} style={{ width:'100%', height:36, borderRadius:7, background: it===0?T.bg2:`color-mix(in oklch, ${T.brand} ${it*22}%, ${T.bg2})`, border: it>0 ? 'none' : `1px solid ${T.border}`, cursor:'pointer' }}/>;
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Progress to unlock */}
        <div style={{ background:`linear-gradient(135deg, ${T.brand}, #7C3AED)`, borderRadius:18, padding:'24px 28px', color:'#fff', marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,.8)', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>Real exam unlock</div>
          <div style={{ fontFamily:T.serif, fontSize:28, lineHeight:1.1, marginBottom:14 }}>7 / 9 days</div>
          <div style={{ height:8, background:'rgba(255,255,255,.2)', borderRadius:99, overflow:'hidden', marginBottom:10 }}>
            <div style={{ height:'100%', width:'78%', background:'#fff', borderRadius:99 }}/>
          </div>
          <div style={{ fontSize:12.5, color:'rgba(255,255,255,.85)' }}>Keep your streak alive — practice today (any module) to push to {streak + 1}.</div>
        </div>

        {/* Module-specific score lines */}
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Score over time · per module</div>
        <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:'28px 32px' }}>
          {/* Multi-line chart */}
          <svg viewBox="0 0 800 240" style={{ width:'100%', height:240 }}>
            {/* Y axis labels */}
            {[3,5,7,9].map((v,i) => <g key={v}><text x="20" y={220-i*55} style={{ fontSize:10, fill:T.ink5 }}>{v}.0</text><line x1="40" y1={220-i*55} x2="780" y2={220-i*55} stroke={T.hairline}/></g>)}
            {/* Lines */}
            {[
              { c:T.reading.c,    label:'Reading',   pts:[6.0,6.5,6.5,7.0,7.0,7.5,7.5,7.5,8.0] },
              { c:T.listening.c,  label:'Listening', pts:[5.5,6.0,6.5,6.5,7.0,7.0,7.0,7.5,7.5] },
              { c:T.speaking.c,   label:'Speaking',  pts:[5.0,5.5,6.0,6.0,6.5,6.5,7.0,7.0,7.0] },
              { c:T.writing.c,    label:'Writing',   pts:[4.5,5.0,5.5,5.5,6.0,6.0,6.5,6.5,7.0] },
            ].map(line => {
              const path = line.pts.map((p, i) => {
                const x = 60 + (i / 8) * 700;
                const y = 220 - ((p - 3) / 6) * 165;
                return `${i===0?'M':'L'} ${x} ${y}`;
              }).join(' ');
              return (
                <g key={line.label}>
                  <path d={path} fill="none" stroke={line.c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {line.pts.map((p,i) => {
                    const x = 60 + (i / 8) * 700;
                    const y = 220 - ((p - 3) / 6) * 165;
                    return <circle key={i} cx={x} cy={y} r="3.5" fill={line.c}/>;
                  })}
                </g>
              );
            })}
          </svg>
          <div style={{ display:'flex', gap:18, justifyContent:'center', marginTop:14 }}>
            {[{c:T.reading.c,l:'Reading'},{c:T.listening.c,l:'Listening'},{c:T.speaking.c,l:'Speaking'},{c:T.writing.c,l:'Writing'}].map(it => (
              <div key={it.l} style={{ display:'flex', alignItems:'center', gap:6, fontSize:12 }}>
                <span style={{ width:10, height:10, borderRadius:5, background:it.c }}/><span style={{ color:T.ink2 }}>{it.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Save-to-library prompt after a session
function SessionSaveToast({ onClose=()=>{} }) {
  return (
    <div style={{ position:'fixed', bottom:24, right:24, width:340, background:T.card, border:`1px solid ${T.border}`, borderRadius:14, boxShadow:'0 16px 50px rgba(0,0,0,.16)', padding:'16px 18px', zIndex:100 }}>
      <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:36, height:36, borderRadius:10, background:T.brand+'22', color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.bookmark({ width:16, height:16 })}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:3 }}>Save to library?</div>
          <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.45, marginBottom:10 }}>This passage and your annotations will be saved so you can review them anytime.</div>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={onClose} style={{ padding:'6px 10px', borderRadius:7, background:T.brand, color:'#fff', fontSize:11.5, fontWeight:700, cursor:'pointer' }}>Save</button>
            <button onClick={onClose} style={{ padding:'6px 10px', borderRadius:7, background:'transparent', color:T.ink3, fontSize:11.5, fontWeight:600, cursor:'pointer' }}>Dismiss</button>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  AIGenerating, AIWritingGrading, MicCheckPage, AISpeakingSession,
  AIListeningPre, AIReadingPre, RateLimitModal, ExamUnlockModal,
  StreakCalendarPage, SessionSaveToast,
});
