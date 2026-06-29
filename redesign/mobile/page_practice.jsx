// ── Mobile · Practice v4 — WEB VOCABULARY ───────────────────
// Mirrors web Practice page — module tile cards, daily challenges,
// quick-start hero. Card-based, restrained color, soft shadows.
function MPractice() {
  const nav = (id) => window.__nav && window.__nav(id);
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const lang = (typeof langByCode === 'function') ? langByCode(code) : LANGUAGES[0];
  const t = langTheme(lang.code);
  const pk = (typeof langPack === 'function') ? langPack(lang.code) : null;

  const modules = [
    { ic:'mic',  c:T.speaking,  title:'Speaking',  sub:'12 lessons', score:7.0, n:'speaking' },
    { ic:'pen',  c:T.writing,   title:'Writing',   sub:'9 prompts',  score:6.5, n:'writing' },
    { ic:'head', c:T.listening, title:'Listening', sub:'18 audios',  score:7.5, n:'listening' },
    { ic:'book', c:T.reading,   title:'Reading',   sub:'14 articles', score:7.0, n:'reading' },
  ];

  return (
    <>
      <MobileHeader title="Practice" eyebrow={`${lang.english} · ${pk?.exam?.short || lang.exam}`} large/>
      <MobileBody padding={0}>
        {/* QUICK-START HERO — dark slate card */}
        <div style={{ padding:'4px 18px 22px' }}>
          <button onClick={()=>nav('reading')} style={{
            width:'100%', textAlign:'left',
            background:`linear-gradient(110deg, ${T.ink} 0%, #2a1f17 100%)`,
            color:'#fff', borderRadius:18, padding:'18px 20px',
            border:'none',
            boxShadow:`0 10px 30px ${t.accent}33`,
            position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:`${t.accent}26` }}/>
            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.play({ width:16, height:16 })}</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:'rgba(255,255,255,.6)', letterSpacing:'.14em', textTransform:'uppercase' }}>Quick start · 10 min</div>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:'#fff', lineHeight:1.1, marginBottom:4 }}>Mixed drill, all 4 skills.</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.7)', marginBottom:14 }}>Spaced-repetition pulled from your weak spots.</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'10px 16px', background:t.accent, borderRadius:10, fontSize:12.5, fontWeight:700, color:'#fff' }}>
                Start now {Icon.arrow({ width:12, height:12 })}
              </div>
            </div>
          </button>
        </div>

        {/* FOUNDATIONS — start from zero */}
        <div style={{ padding:'0 18px 18px' }}>
          <button onClick={()=>nav('foundations')} style={{ width:'100%', textAlign:'left', background:(T.brandLight || '#FBF3E9'), border:'1.5px solid '+T.brand, borderRadius:16, padding:'16px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
            <div style={{ minWidth:0 }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>Foundations · Start from zero</div>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.15, marginBottom:3 }}>Alphabet, sounds & first words</div>
              <div style={{ fontSize:11.5, color:T.ink3, lineHeight:1.45 }}>Script, phonics, words & translation. Tap any letter to hear it.</div>
            </div>
            <div style={{ flexShrink:0, width:34, height:34, borderRadius:10, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.arrowRight ? Icon.arrowRight({width:15,height:15}) : '→'}</div>
          </button>
        </div>

        {/* THE ARGUMENT ARENA — dark flagship */}
        <div style={{ padding:'0 18px 18px' }}>
          <button onClick={()=>nav('argue')} style={{ width:'100%', textAlign:'left', background:T.ink, border:'none', borderRadius:16, padding:'16px 18px', color:'#fff', position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'space-between', gap:14 }}>
            <div style={{ position:'absolute', inset:0, opacity:.06, background:'radial-gradient(circle at 95% 10%, #fff 0%, transparent 55%)' }}/>
            <div style={{ position:'relative', minWidth:0 }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.brandLight || '#E8C9A0', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:5 }}>New · Argument Arena</div>
              <div style={{ fontFamily:T.serif, fontSize:18, color:'#fff', lineHeight:1.15, marginBottom:3 }}>Debate a real opponent</div>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.6)', lineHeight:1.45 }}>Pick a side, fire back with native comebacks, see how your point lands.</div>
            </div>
            <div style={{ position:'relative', flexShrink:0, width:34, height:34, borderRadius:10, background:'#fff', color:T.ink, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.arrowRight ? Icon.arrowRight({width:15,height:15}) : '→'}</div>
          </button>
        </div>

        {/* MODULES — 2x2 grid (same vocabulary as lang detail) */}
        <div style={{ padding:'0 18px 8px' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:12 }}>By module</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {modules.map(m => (
              <button key={m.title} onClick={()=>nav(m.n)} style={{
                textAlign:'left', background:T.card, border:`1px solid ${T.border}`,
                borderRadius:14, padding:14, display:'flex', flexDirection:'column', gap:11,
                boxShadow:MT.shadowSm,
              }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ width:34, height:34, borderRadius:10, background:m.c.bg, color:m.c.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {Icon[m.ic]({ width:15, height:15 })}
                  </div>
                  <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1 }}>{m.score.toFixed(1)}</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:2 }}>{m.title}</div>
                  <div style={{ fontSize:10.5, color:T.ink3 }}>{m.sub}</div>
                </div>
                <div style={{ fontSize:10.5, color:T.ink4, fontWeight:600, marginTop:'auto' }}>Continue →</div>
              </button>
            ))}
          </div>
        </div>

        {/* DAILY CHALLENGES — horizontal scroller */}
        <div style={{ padding:'18px 18px 6px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Daily challenges</div>
        </div>
        <div className="fluentra-challenges" style={{ display:'flex', gap:10, overflowX:'auto', padding:'10px 18px 12px' }}>
          <style>{`.fluentra-challenges::-webkit-scrollbar{display:none}`}</style>
          {[
            { title:'5-min flash quiz',   meta:'Vocab · 20 cards',  ic:'spark', c:T.brand,        bg:T.brandLight,        n:'vocab' },
            { title:'Pronunciation gym', meta:'10 phrases',         ic:'mic',   c:T.speaking.c,   bg:T.speaking.bg,       n:'speaking' },
            { title:'Listen & shadow',   meta:'1 min · podcast',    ic:'head',  c:T.listening.c,  bg:T.listening.bg,      n:'listening' },
            { title:'Read & summarise',  meta:'200 words',          ic:'book',  c:T.reading.c,    bg:T.reading.bg,        n:'reading' },
          ].map((c, i) => (
            <button key={i} onClick={()=>nav(c.n)} style={{
              flexShrink:0, width:170,
              background:T.card, border:`1px solid ${T.border}`,
              borderRadius:14, padding:14,
              display:'flex', flexDirection:'column', justifyContent:'space-between', minHeight:148,
              textAlign:'left', boxShadow:MT.shadowSm,
            }}>
              <div>
                <div style={{ width:34, height:34, borderRadius:10, background:c.bg, color:c.c, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:11 }}>{Icon[c.ic]({ width:14, height:14 })}</div>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{c.title}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:3 }}>{c.meta}</div>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:c.c, marginTop:11, display:'flex', alignItems:'center', gap:4 }}>Begin {Icon.arrow({ width:10, height:10 })}</div>
            </button>
          ))}
        </div>

        {/* TUTOR */}
        <div style={{ padding:'12px 18px 0' }}>
          <button onClick={()=>nav('tutor')} style={{ width:'100%', background:T.ink, color:'#fff', borderRadius:16, padding:16, display:'flex', alignItems:'center', gap:12, textAlign:'left' }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'rgba(255,255,255,.1)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', flexShrink:0 }}>{Icon.message({ width:15, height:15 })}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>Practice with AI tutor</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.65)', marginTop:2 }}>Real-time conversation</div>
            </div>
            {Icon.arrow({ width:13, height:13, style:{ color:'rgba(255,255,255,.5)' } })}
          </button>
        </div>
      </MobileBody>
      <MobileTabBar active="practice"/>
    </>
  );
}

Object.assign(window, { MPractice });

// ── Mobile Foundations (reuses the curated data + shared stage components) ──
function MFoundationsPage() {
  const R = React;
  const nav = (id) => window.__nav && window.__nav(id);
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const LABELS = { en:'English', es:'Spanish', fr:'French', ja:'Japanese', ko:'Korean', ru:'Russian', de:'German', it:'Italian', pt:'Portuguese', zh:'Chinese', ar:'Arabic', hi:'Hindi', nl:'Dutch', pl:'Polish', tr:'Turkish', sv:'Swedish' };
  const langName = LABELS[code] || ((typeof langByCode === 'function' && langByCode(code) && (langByCode(code).english || langByCode(code).native)) || 'your language');
  const alpha = (typeof FOUND_ALPHABETS !== 'undefined' && FOUND_ALPHABETS[code]) ? FOUND_ALPHABETS[code] : { script:'the alphabet', note:'Tap a letter to hear it.', letters: (typeof FOUND_LATIN_FALLBACK !== 'undefined' ? FOUND_LATIN_FALLBACK : []) };
  const words = (typeof FOUND_WORDS !== 'undefined') ? (FOUND_WORDS[code] || null) : null;
  const phon = (typeof buildPhonics === 'function') ? buildPhonics(code) : null;
  const [stage, setStage] = R.useState('alphabet');
  const [sel, setSel] = R.useState(0);
  const speak = (t) => { if (window.flSpeak) window.flSpeak(t, code); };

  const STAGES = [
    { id:'alphabet', n:'01', label:'Alphabet', live:true },
    { id:'phonics', n:'02', label:'Phonics', live:!!phon },
    { id:'words', n:'03', label:'Words', live:!!words },
    { id:'sentences', n:'04', label:'Sentences', live:false },
    { id:'translation', n:'05', label:'Translation', live:!!words },
  ];

  function MAlphabet() {
    var letter = alpha.letters[sel] || alpha.letters[0];
    return (
      <div>
        <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5, marginBottom:16 }}>You're learning <strong style={{ color:T.ink }}>{alpha.script}</strong>. {alpha.note}</div>
        <div style={{ display:'flex', gap:14, alignItems:'center', background:T.ink, color:'#fff', borderRadius:16, padding:'18px 18px', marginBottom:18 }}>
          <button onClick={function () { speak(letter.ch); }} style={{ flexShrink:0, width:76, height:76, borderRadius:16, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', cursor:'pointer' }}>
            <span dir={alpha.rtl ? 'rtl' : undefined} style={{ fontFamily:T.serif, fontSize:40, color:'#fff' }}>{letter.ch}</span>
          </button>
          <div style={{ minWidth:0 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.brandLight || '#E8C9A0', letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>Reads as “{letter.name}”</div>
            <button onClick={function () { speak(letter.ch); }} style={{ padding:'8px 13px', borderRadius:9, background:'#fff', color:T.ink, border:'none', fontSize:12.5, fontWeight:700, cursor:'pointer' }}>Hear the sound</button>
            {letter.ex ? <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginTop:8 }}>e.g. {letter.ex}{letter.gloss ? ' — ' + letter.gloss : ''}</div> : null}
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(50px, 1fr))', gap:7 }}>
          {alpha.letters.map(function (l, i) {
            var on = i === sel;
            return (
              <button key={l.ch + i} onClick={function () { setSel(i); speak(l.ch); }} style={{ aspectRatio:'1', borderRadius:10, border:'1.5px solid ' + (on ? T.brand : T.border), background: on ? (T.brandLight || '#FBF3E9') : T.card, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:1 }}>
                <span style={{ fontFamily:T.serif, fontSize:19, color: on ? T.brand : T.ink }}>{l.ch}</span>
                <span style={{ fontSize:8, color: on ? T.brand : T.ink4 }}>{l.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function MWords() {
    if (!words) return <MAiStage label="First words" />;
    return (
      <div>
        <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.5, marginBottom:16 }}>Ten words for your first day. Tap to hear them in {langName}.</div>
        <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
          {words.map(function (it, i) {
            return (
              <button key={i} onClick={function () { speak(it.w); }} style={{ textAlign:'left', padding:'14px 16px', borderRadius:13, border:'1px solid ' + T.border, background:T.card, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div style={{ minWidth:0 }}>
                  <div dir={code === 'ar' ? 'rtl' : undefined} style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.2 }}>{it.w}</div>
                  {it.r ? <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{it.r}</div> : null}
                  <div style={{ fontSize:11.5, color:T.ink3, marginTop:2, textTransform:'capitalize' }}>{it.g}</div>
                </div>
                <span style={{ flexShrink:0, color:T.brand }}>{Icon.head ? Icon.head({ width:17, height:17 }) : '►'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function MAiStage(props) {
    return (
      <div style={{ textAlign:'center', padding:'40px 20px' }}>
        <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:8 }}>{props.label} is AI-powered</div>
        <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.55 }}>This stage builds live around your progress and interests. It switches on when AI generation is active for your account.</div>
      </div>
    );
  }

  return (
    <>
      <MobileHeader title="Foundations" eyebrow={'Start ' + langName + ' from zero'} back onBack={function () { nav('practice'); }}/>
      <MobileBody padding={[6, 16, 30]}>
        <div style={{ display:'flex', gap:8, overflowX:'auto', paddingBottom:6, marginBottom:18 }}>
          {STAGES.map(function (s) {
            var on = stage === s.id;
            return (
              <button key={s.id} onClick={function () { setStage(s.id); }} style={{ flex:'0 0 auto', padding:'9px 15px', borderRadius:99, border: on ? '1px solid transparent' : '1px solid ' + T.border, background: on ? 'linear-gradient(135deg,#C04A06,#E8732F)' : T.card, boxShadow: on ? '0 4px 12px rgba(192,74,6,0.28)' : 'none', cursor:'pointer', position:'relative' }}>
                <span style={{ fontSize:12.5, fontWeight:700, color: on ? '#fff' : T.ink }}>{s.label}</span>
                {!s.live ? <span style={{ marginLeft:6, fontSize:8, fontWeight:800, color: on ? 'rgba(255,255,255,0.85)' : (T.ink5 || '#aaa') }}>AI</span> : null}
              </button>
            );
          })}
        </div>
        {stage === 'alphabet' && (code === 'zh' ? <FoundationsPinyin/> : <MAlphabet/>)}
        {stage === 'phonics' && (phon ? <FoundationsPhonics code={code} langName={langName}/> : <MAiStage label="Phonics" />)}
        {stage === 'words' && <MWords/>}
        {stage === 'sentences' && <MAiStage label="Sentences" />}
        {stage === 'translation' && (words ? <FoundationsTranslationDrill words={words} code={code} langName={langName}/> : <MAiStage label="Translation" />)}
      </MobileBody>
    </>
  );
}
if (typeof window !== 'undefined') { window.MFoundationsPage = MFoundationsPage; }

// ── Mobile Argument Arena (same debate engine as web, phone chrome) ──
function MArgumentGamePage() {
  const R = React;
  const nav = (id) => window.__nav && window.__nav(id);
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const langName = (typeof langByCode === 'function' && langByCode(code) && (langByCode(code).english || langByCode(code).native)) || 'your language';
  const [phase, setPhase] = R.useState('setup');
  const [topic, setTopic] = R.useState('');
  const [side, setSide] = R.useState('');
  const [oppSide, setOppSide] = R.useState('');
  const [diff, setDiff] = R.useState('medium');
  const [msgs, setMsgs] = R.useState([]);
  const [draft, setDraft] = R.useState('');
  const [busy, setBusy] = R.useState(false);
  const [openT, setOpenT] = R.useState({});

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
      const apiMsgs = opening ? [{ role:'user', content:'Begin the debate — state your opening position.' }]
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
        var msg = (r.status === 402) ? '(You\u2019ve hit today\u2019s usage limit \u2014 upgrade to keep debating.)' : '(The Arena\u2019s AI is offline right now \u2014 it lights up the moment AI credits are active. The rest of the app still works.)';
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

  if (phase === 'setup') {
    return (
      <>
        <MobileHeader title="Argument Arena" eyebrow={'Debate in ' + langName} back onBack={function () { nav('practice'); }}/>
        <MobileBody padding={[6, 16, 30]}>
          <div style={{ background:T.ink, borderRadius:16, padding:'20px', color:'#fff', marginBottom:20, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, opacity:.05, background:'radial-gradient(circle at 92% 0%, #fff 0%, transparent 55%)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.brandLight || '#E8C9A0', letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>The Argument Arena</div>
              <div style={{ fontFamily:T.serif, fontSize:26, lineHeight:1.06 }}>Win the argument. In {langName}.</div>
              <div style={{ fontSize:12.5, color:'rgba(255,255,255,.62)', marginTop:10, lineHeight:1.5 }}>Pick a side. Get native comebacks and an honest read on how each point lands.</div>
            </div>
          </div>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Intensity</div>
          <div style={{ display:'flex', gap:8, marginBottom:24 }}>
            {DIFFS.map(function (d) { var on = diff === d.k; return (
              <button key={d.k} onClick={function () { setDiff(d.k); }} style={{ flex:1, padding:'11px 0', borderRadius:11, border:'1.5px solid ' + (on ? T.brand : T.border), background: on ? (T.brandLight || '#FBF3E9') : T.card, cursor:'pointer' }}>
                <div style={{ fontSize:13, fontWeight:700, color: on ? T.brand : T.ink }}>{d.l}</div>
              </button>
            ); })}
          </div>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Pick a motion & side</div>
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {TOPICS.map(function (tp, i) { return (
              <div key={i} style={{ background:T.card, border:'1px solid ' + T.border, borderRadius:14, padding:'15px 16px' }}>
                <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.3, marginBottom:11 }}>{tp.t}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={function () { pickTopic(tp.t, tp.a, tp.b); }} style={{ flex:1, padding:'9px 12px', borderRadius:9, border:'1.5px solid ' + T.border, background:T.bg2, fontSize:11.5, fontWeight:600, color:T.ink2, cursor:'pointer', textAlign:'left' }}>{tp.a}</button>
                  <button onClick={function () { pickTopic(tp.t, tp.b, tp.a); }} style={{ flex:1, padding:'9px 12px', borderRadius:9, border:'1.5px solid ' + T.border, background:T.bg2, fontSize:11.5, fontWeight:600, color:T.ink2, cursor:'pointer', textAlign:'left' }}>{tp.b}</button>
                </div>
              </div>
            ); })}
          </div>
        </MobileBody>
      </>
    );
  }

  return (
    <>
      <MobileHeader title="Debate" eyebrow={side} back onBack={reset} right={<button onClick={reset} style={{ padding:'6px 11px', borderRadius:8, border:'1.5px solid ' + T.border, background:T.card, fontSize:11.5, fontWeight:600, color:T.ink2 }}>New</button>}/>
      <MobileBody padding={[10, 14, 30]}>
        <div style={{ background:T.bg2, borderRadius:12, padding:'10px 14px', marginBottom:16 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Motion</div>
          <div style={{ fontSize:12.5, color:T.ink, lineHeight:1.3 }}>{topic}</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:15 }}>
          {msgs.map(function (m, i) {
            if (m.role === 'user') return (
              <div key={i} style={{ alignSelf:'flex-end', maxWidth:'85%' }}>
                <div style={{ background:T.brand, color:'#fff', borderRadius:'14px 14px 4px 14px', padding:'10px 13px', fontSize:13.5, lineHeight:1.45 }}>{m.content}</div>
                {m.feedback ? <div style={{ marginTop:5, fontSize:11, color:T.ink3, fontStyle:'italic', textAlign:'right' }}>{m.feedback}</div> : null}
              </div>
            );
            var showT = !!openT[i];
            return (
              <div key={i} style={{ alignSelf:'flex-start', maxWidth:'88%' }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:5 }}>Opponent</div>
                <div style={{ background:T.card, border:'1px solid ' + T.border, borderLeft:'3px solid ' + T.brand, borderRadius:'4px 14px 14px 14px', padding:'11px 14px' }}>
                  <div style={{ fontSize:14, color:T.ink, lineHeight:1.5, fontFamily:T.serif }}>{m.content}</div>
                  {m.translation ? (
                    <div style={{ marginTop:8, paddingTop:8, borderTop:'1px dashed ' + (T.hairline || '#eee') }}>
                      {showT ? <div style={{ fontSize:12, color:T.ink3, lineHeight:1.45 }}>{m.translation}</div>
                             : <button onClick={function () { setOpenT(function (o) { var n = Object.assign({}, o); n[i] = true; return n; }); }} style={{ fontSize:11, fontWeight:600, color:T.brand, background:'none', border:'none', padding:0 }}>Show translation</button>}
                    </div>
                  ) : null}
                </div>
                {m.clapbacks && m.clapbacks.length ? (
                  <div style={{ marginTop:8 }}>
                    <div style={{ fontSize:9.5, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Comebacks — tap to use</div>
                    <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
                      {m.clapbacks.map(function (c, ci) { return (
                        <button key={ci} onClick={function () { setDraft(function (d) { return (d ? d + ' ' : '') + c.phrase; }); }} style={{ textAlign:'left', padding:'7px 11px', borderRadius:9, border:'1px solid ' + T.border, background:T.bg2 }}>
                          <div style={{ fontSize:12.5, color:T.ink, fontWeight:600 }}>{c.phrase}</div>
                          {c.gloss ? <div style={{ fontSize:10, color:T.ink4, marginTop:1 }}>{c.gloss}</div> : null}
                        </button>
                      ); })}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
          {busy ? <div style={{ alignSelf:'flex-start', fontSize:12, color:T.ink4, fontStyle:'italic' }}>Opponent is thinking…</div> : null}
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'flex-end', marginTop:18 }}>
          <textarea value={draft} onChange={function (e) { setDraft(e.target.value); }} placeholder={'Make your case in ' + langName + '…'} rows={2}
            style={{ flex:1, resize:'none', padding:'11px 13px', borderRadius:11, border:'1.5px solid ' + T.border, fontSize:13.5, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none', lineHeight:1.4, background:T.card }}/>
          <button onClick={send} disabled={busy || !draft.trim()} style={{ padding:'11px 16px', borderRadius:11, border:'none', background: (busy || !draft.trim()) ? T.border : T.brand, color:'#fff', fontSize:13, fontWeight:700, whiteSpace:'nowrap' }}>Send</button>
        </div>
      </MobileBody>
    </>
  );
}
if (typeof window !== 'undefined') { window.MArgumentGamePage = MArgumentGamePage; }
