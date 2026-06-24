// ── Page: Vocabulary deck (Browse + Flashcard study) ────────
// Editorial vocabulary library with two modes:
//   • Browse — list of decks (e.g. Restaurant phrases, A1 Greetings) and a word table
//   • Study — single flashcard, flip to reveal, rate recall (Again/Hard/Good/Easy)

function VocabPage() {
  const [mode, setMode] = useState('browse'); // 'browse' | 'study'
  const [studyKind, setStudyKind] = useState('due'); // 'due' | 'all' | 'review'
  const [activeDeck, setActiveDeck] = useState(0);
  const [filter, setFilter] = useState('All');
  const [sortDir, setSortDir] = useState('alpha'); // 'alpha' | 'strength' | 'due'
  const [showNewDeck, setShowNewDeck] = useState(false);
  const [showAddCards, setShowAddCards] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [shareToast, setShareToast] = useState(false);

  const decks = [
    { title:'Café & restaurants', lang:'es', count:42, due:8,  mastered:21, accent:T.es,  tag:'A2 · everyday' },
    { title:'Travel & directions', lang:'es', count:38, due:5,  mastered:30, accent:T.es,  tag:'A2 · everyday' },
    { title:'Body & health',       lang:'fr', count:54, due:12, mastered:18, accent:T.fr,  tag:'B1 · core' },
    { title:'Business & meetings', lang:'en', count:60, due:15, mastered:42, accent:T.en,  tag:'B2 · pro' },
    { title:'JLPT N4 Verbs',       lang:'ja', count:120,due:22, mastered:64, accent:T.ja,  tag:'N4 · core' },
    { title:'False friends EN↔ES', lang:'es', count:24, due:0,  mastered:24, accent:T.es,  tag:'B1 · advanced' },
  ];

  const deck = decks[activeDeck];

  const _vLang = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const [words, setWords] = useState([]);
  const [srsCache, setSrsCache] = useState({});
  const [genning, setGenning] = useState(false);

  function buildWord(w, states) {
    var st = states[_vLang + '::' + (w.term || '')];
    var isDue = !st || !st.due || new Date(st.due).getTime() <= Date.now();
    return {
      word: w.term || '', pos: w.reading || '', trans: w.en || '', ex: w.example || '',
      strength: st ? Math.min(5, Math.max(1, st.reps || 1)) : 0,
      due: (st && st.due && !isDue) ? new Date(st.due).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : (st ? 'due' : 'new'),
      starred: false, _srs: st || null
    };
  }

  React.useEffect(function () {
    var cancelled = false;
    (async function () {
      var states = {};
      try { if (window.FL && window.FL.srsStates) states = (await window.FL.srsStates(_vLang).catch(function () { return {}; })) || {}; } catch (e) {}
      var items = [];
      try {
        var r = await fetch('/api/content-list?lang=' + encodeURIComponent(_vLang) + '&type=vocab&full=1&limit=10');
        var d = await r.json(); items = (d && d.items) || [];
      } catch (e) {}
      if (!items.length) {
        // pool empty for this language → generate one set on the spot
        try {
          var gr = await fetch('/api/generate-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: _vLang, type: 'vocab', difficulty: 'medium' }) });
          var gen = await gr.json(); if (gen && gen.content) items = [gen.content];
        } catch (e) {}
      }
      if (cancelled) return;
      var out = [];
      items.forEach(function (it) { ((it.payload && it.payload.words) || []).forEach(function (w) { out.push(buildWord(w, states)); }); });
      setSrsCache(states); setWords(out);
    })();
    return function () { cancelled = true; };
  }, []);

  async function generateMore() {
    if (genning) return;
    setGenning(true);
    try {
      var gr = await fetch('/api/generate-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lang: _vLang, type: 'vocab', difficulty: 'medium' }) });
      var gen = await gr.json();
      var ws = gen && gen.content && gen.content.payload && gen.content.payload.words;
      if (ws && ws.length) {
        var add = ws.map(function (w) { return buildWord(w, srsCache); });
        setWords(function (prev) {
          var seen = {}; prev.forEach(function (w) { seen[w.word] = 1; });
          return prev.concat(add.filter(function (w) { return w.word && !seen[w.word]; }));
        });
      }
    } catch (e) {}
    setGenning(false);
  }

  var _now = Date.now();
  const dueCount = words.filter(function (w) { var st = w._srs; return !st || !st.due || new Date(st.due).getTime() <= _now; }).length;
  const masteredCount = words.filter(function (w) { return w._srs && (w._srs.reps || 0) >= 3; }).length;
  const _streak = (window.__user && window.__user.streak) || 0;

  if (mode === 'study') return <VocabStudy deck={deck} words={words} kind={studyKind} onExit={() => setMode('browse')}/>;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', position:'relative' }}>
      <WebTopbar/>
      {showNewDeck && <NewDeckModal onClose={() => setShowNewDeck(false)}/>}
      {showAddCards && <AddCardsModal deck={deck} onClose={() => setShowAddCards(false)}/>}
      {showSearch && <SearchWordsModal q={searchQ} setQ={setSearchQ} words={words} decks={decks} onClose={() => setShowSearch(false)}/>}
      {shareToast && (
        <div style={{ position:'absolute', top:20, right:20, zIndex:80, background:T.ink, color:'#fff', padding:'12px 16px', borderRadius:10, boxShadow:'0 12px 30px rgba(0,0,0,.2)', display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5fc77e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Deck link copied to clipboard
        </div>
      )}
      <div style={{ flex:1, overflow:'auto', padding:'28px 36px 40px' }}>
        <PageHeader
          eyebrow="Vocabulary"
          title="Build word recall, one card at a time."
          right={
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setShowSearch(true)} style={{ padding:'8px 14px', fontSize:13, fontWeight:600, color:T.ink3, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, display:'flex', alignItems:'center', gap:6, cursor:'pointer' }}>
                {Icon.search()} Search words
              </button>
              <Btn label={genning ? 'Generating…' : 'Generate words'} icon={Icon.spark()} variant="outline" accent={T.brand} onClick={generateMore}/>
              <Btn label="New deck" icon={Icon.plus()} variant="outline" accent={T.ink} onClick={() => setShowNewDeck(true)} />
              <Btn label={"Start review · " + dueCount + " due"} icon={Icon.spark()} accent={T.brand} onClick={() => { setStudyKind('review'); setMode('study'); }}/>
            </div>
          }
        />

        {/* Stat strip */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:32 }}>
          {[
            { label:'Cards mastered',  value:String(masteredCount), sub:'reviewed 3+ times', c:T.listening },
            { label:'Due for review',  value:String(dueCount),      sub:'ready now',         c:T.reading   },
            { label:'Day streak',      value:String(_streak),       sub:_streak===1?'day':'days', c:T.writing },
            { label:'Cards tracked',   value:String(words.length),  sub:'in this language',  c:T.speaking  },
          ].map(s => (
            <Card key={s.label} padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>{s.label}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
                <div style={{ fontFamily:T.serif, fontSize:32, color:T.ink, lineHeight:1 }}>{s.value}</div>
                <div style={{ width:6, height:6, borderRadius:3, background:s.c.c }}/>
              </div>
              <div style={{ fontSize:11.5, color:T.ink3 }}>{s.sub}</div>
            </Card>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1.05fr 1.5fr', gap:24, alignItems:'start' }}>
          {/* LEFT — deck list */}
          <div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Your decks</div>
              <button style={{ fontSize:11.5, fontWeight:600, color:T.ink3, display:'flex', alignItems:'center', gap:4 }}>
                {Icon.filter({ width:11, height:11 })} Sort
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {decks.map((d, i) => {
                const active = i === activeDeck;
                const pct = Math.round((d.mastered / d.count) * 100);
                return (
                  <button key={i} onClick={() => setActiveDeck(i)} style={{ background: active ? T.card : 'transparent', border:`1px solid ${active ? T.border : 'transparent'}`, borderRadius:14, padding:'14px 16px', textAlign:'left', cursor:'pointer', display:'flex', alignItems:'center', gap:14, transition:'all .15s' }}>
                    <div style={{ width:42, height:42, borderRadius:11, background:d.accent.bg, color:d.accent.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontWeight:700, fontFamily:T.serif, fontSize:16, position:'relative' }}>
                      <Flag code={d.lang} w={22} h={15}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, lineHeight:1.2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{d.title}</div>
                        {d.due > 0 && <div style={{ fontSize:10, fontWeight:700, color:T.brand, background:T.brandLight, padding:'2px 6px', borderRadius:4, flexShrink:0 }}>{d.due} due</div>}
                      </div>
                      <div style={{ fontSize:11, color:T.ink4, marginBottom:6 }}>{d.tag} · {d.count} cards · {d.mastered} mastered</div>
                      <Bar pct={pct} color={d.accent.accent} track={T.trackWarm} height={3}/>
                    </div>
                    {active && <div style={{ color:T.ink3, flexShrink:0 }}>{Icon.chev()}</div>}
                  </button>
                );
              })}

              <button onClick={() => setShowNewDeck(true)} style={{ marginTop:6, padding:'14px 16px', border:`1.5px dashed ${T.border}`, borderRadius:14, color:T.ink3, fontSize:12.5, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'transparent', cursor:'pointer' }}>
                {Icon.plus()} Create new deck
              </button>
            </div>
          </div>

          {/* RIGHT — deck detail */}
          <Card padding={0}>
            {/* Hero */}
            <div style={{ background:`linear-gradient(135deg, ${deck.accent.bg}, ${deck.accent.accentLight})`, padding:'28px 28px 22px', borderRadius:'16px 16px 0 0', borderBottom:`1px solid ${T.border}`, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:80, border:`12px solid ${deck.accent.accent}33` }}/>
              <div style={{ position:'absolute', top:30, right:30, width:60, height:60, borderRadius:30, background:`${deck.accent.accent}1f` }}/>

              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <Flag code={deck.lang}/>
                <Chip label={deck.tag} accent={deck.accent.accent} bg={`${deck.accent.accent}1f`}/>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.1, marginBottom:8 }}>{deck.title}</div>
              <div style={{ fontSize:13, color:T.ink3, marginBottom:18 }}>{deck.count} cards · {deck.mastered} mastered · {deck.due} due now</div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn label={`Study ${deck.due} due`} icon={Icon.spark()} accent={deck.accent.accent} onClick={() => { setStudyKind('due'); setMode('study'); }}/>
                <Btn label="Practice all" variant="outline" accent={T.ink2} onClick={() => { setStudyKind('all'); setMode('study'); }}/>
                <Btn label="Add cards" variant="soft" accent={T.ink} icon={Icon.plus()} onClick={() => setShowAddCards(true)}/>
                <button onClick={() => {
                  const url = `${location.origin}${location.pathname}#deck/${encodeURIComponent(deck.title)}`;
                  try { navigator.clipboard.writeText(url); } catch {}
                  setShareToast(true);
                  setTimeout(() => setShareToast(false), 2200);
                }} title="Share deck" style={{ width:38, height:38, borderRadius:9, background:T.card, border:`1px solid ${T.border}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>
                </button>
              </div>
            </div>

            {/* Filter row */}
            <div style={{ padding:'16px 24px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${T.hairline}` }}>
              <div style={{ display:'flex', gap:4 }}>
                {['All','Due','Learning','Mastered','Starred'].map(f => {
                  const active = filter === f;
                  return (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding:'6px 11px', fontSize:11.5, fontWeight: active ? 700 : 500, color: active ? T.ink : T.ink3, background: active ? T.bg2 : 'transparent', borderRadius:7, border:'none', cursor:'pointer' }}>{f}</button>
                  );
                })}
              </div>
              <button onClick={() => setSortDir(s => s==='alpha' ? 'strength' : s==='strength' ? 'due' : 'alpha')} style={{ fontSize:11, color:T.ink4, background:'transparent', border:'none', cursor:'pointer', fontWeight:600 }}>
                Sort: {sortDir === 'alpha' ? 'alphabetical' : sortDir === 'strength' ? 'by strength' : 'by due date'}
              </button>
            </div>

            {/* Word table */}
            <div style={{ padding:'4px 8px 16px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1.6fr 80px 90px 28px', gap:10, padding:'10px 16px', fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.08em', textTransform:'uppercase', borderBottom:`1px solid ${T.hairline}` }}>
                <div>Word</div>
                <div>Translation · example</div>
                <div>Strength</div>
                <div style={{ textAlign:'right' }}>Next review</div>
                <div></div>
              </div>
              {(() => {
                let list = words.slice();
                if (filter === 'Due') list = list.filter(w => w.due === 'today');
                else if (filter === 'Learning') list = list.filter(w => w.strength <= 3);
                else if (filter === 'Mastered') list = list.filter(w => w.strength >= 4);
                else if (filter === 'Starred') list = list.filter(w => w.starred);
                if (sortDir === 'alpha') list.sort((a,b) => a.word.localeCompare(b.word));
                else if (sortDir === 'strength') list.sort((a,b) => b.strength - a.strength);
                else if (sortDir === 'due') list.sort((a,b) => (a.due==='today'?-1:1) - (b.due==='today'?-1:1));
                if (list.length === 0) {
                  return <div style={{ padding:'40px 16px', textAlign:'center', fontSize:12.5, color:T.ink4 }}>No words match this filter.</div>;
                }
                return list.map((w, i) => (
                <div key={i} title="Tap to hear pronunciation" onClick={() => { try { (typeof flSpeak==='function') && flSpeak(w.word, (typeof window!=='undefined' && window.__langCode) || 'en'); } catch(e){} }} style={{ display:'grid', gridTemplateColumns:'1.4fr 1.6fr 80px 90px 28px', gap:10, padding:'12px 16px', fontSize:13, alignItems:'center', borderRadius:10, cursor:'pointer', transition:'background .12s' }}
                  onMouseEnter={e => e.currentTarget.style.background = T.bg2}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div>
                    <div style={{ fontWeight:700, color:T.ink, fontSize:14 }}>{w.word}</div>
                    <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>{w.pos}</div>
                  </div>
                  <div>
                    <div style={{ color:T.ink2, fontSize:13 }}>{w.trans}</div>
                    <div style={{ fontSize:11, color:T.ink4, fontStyle:'italic', marginTop:2, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>"{w.ex}"</div>
                  </div>
                  <div style={{ display:'flex', gap:2 }}>
                    {[1,2,3,4,5].map(n => (
                      <div key={n} style={{ width:6, height:14, borderRadius:1.5, background: n <= w.strength ? deck.accent.accent : T.track }}/>
                    ))}
                  </div>
                  <div style={{ fontSize:11.5, color: w.due === 'today' ? T.brand : T.ink3, textAlign:'right', fontWeight: w.due === 'today' ? 700 : 500 }}>{w.due}</div>
                  <div style={{ color: w.starred ? T.brand : T.ink5, display:'flex', justifyContent:'center' }}>
                    {Icon.star({ width:13, height:13, fill: w.starred ? 'currentColor' : 'none' })}
                  </div>
                </div>
                ));
              })()}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Flashcard study mode ────────────────────────────────────
function VocabStudy({ deck, words, kind = 'due', onExit }) {
  const lang = deck.lang || (typeof window !== 'undefined' && window.__langCode) || 'en';
  const [states, setStates] = useState(null); // "lang::term" -> SRS row (null while loading)
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ showHint: true, autoPlay: false, langCode: deck.lang });
  const [shuffleKey, setShuffleKey] = useState(0); // bumping this re-randomizes the queue
  React.useEffect(function () {
    if (window.FL && window.FL.srsStates) window.FL.srsStates(lang).then(function (m) { setStates(m || {}); }).catch(function () { setStates({}); });
    else setStates({});
  }, []);
  const _now = Date.now();
  const _key = function (w) { return lang + '::' + (w.word || ''); };
  const _isDue = function (w) { const st = states && states[_key(w)]; if (!st) return true; return !st.due || new Date(st.due).getTime() <= _now; };
  let queue;
  if (kind === 'all') queue = words.slice();
  else if (states) queue = words.filter(_isDue);   // due/review: real due cards once loaded
  else queue = words.slice();                        // while loading, show all
  if (!queue.length) queue = words.slice(0, 6);
  queue = queue.slice(0, kind === 'all' ? words.length : 20);
  const [queueOrder, setQueueOrder] = useState(() => queue.map((_, i) => i));
  React.useEffect(function () { setQueueOrder(queue.map(function (_, i) { return i; })); setIdx(0); }, [queue.length]);
  const card = queue[queueOrder[idx]] || queue[idx] || queue[0];
  const accent = deck.accent.accent;
  const pct = ((idx) / queue.length) * 100;

  // Speak the foreign word using browser TTS. Voice picked by deck.lang.
  function speak(text, code = deck.lang) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const langMap = { es:'es-ES', fr:'fr-FR', ja:'ja-JP', de:'de-DE', en:'en-US', it:'it-IT', pt:'pt-PT', ko:'ko-KR', zh:'zh-CN' };
      u.lang = langMap[code] || 'en-US';
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch {}
  }

  function rate(grade) {
    const q = grade === 'Again' ? 1 : grade === 'Hard' ? 3 : grade === 'Easy' ? 5 : 4;
    const term = card && card.word;
    if (term && window.FL && window.FL.srsSchedule) {
      const cur = (states && states[_key(card)]) || null;
      const ns = window.FL.srsSchedule(cur, q);
      if (window.FL.srsSave) window.FL.srsSave(lang, term, ns);
      setStates(function (m) { const c = Object.assign({}, m || {}); c[lang + '::' + term] = Object.assign({ card: lang + '::' + term }, ns); return c; });
    }
    setFlipped(false);
    if (idx < queue.length - 1) setIdx(idx + 1);
    else setIdx(0);
  }

  function reshuffle() {
    const order = queue.map((_, i) => i).sort(() => Math.random() - 0.5);
    setQueueOrder(order);
    setIdx(0);
    setFlipped(false);
    setShuffleKey(k => k + 1);
  }

  // Auto-play TTS on card change when setting is on
  React.useEffect(() => {
    if (settings.autoPlay && card && !flipped) speak(card.word);
  }, [idx, settings.autoPlay, shuffleKey]);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', background:`linear-gradient(180deg, ${deck.accent.bg} 0%, ${T.bg} 60%)` }}>
      {/* Slim topbar */}
      <div style={{ height:64, padding:'0 32px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:`1px solid ${T.border}`, background:'rgba(255,255,255,.6)', backdropFilter:'blur(8px)', flexShrink:0 }}>
        <button onClick={onExit} style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, fontWeight:600, color:T.ink2 }}>
          {Icon.arrowL()} Exit study
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Flag code={deck.lang}/>
          <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{deck.title}</div>
          <div style={{ width:4, height:4, borderRadius:2, background:T.ink5 }}/>
          <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:accent, padding:'3px 8px', borderRadius:5, background:`${accent}1a` }}>{kind === 'all' ? 'Practice all' : kind === 'review' ? 'Daily review' : 'Due today'}</div>
          <div style={{ width:4, height:4, borderRadius:2, background:T.ink5 }}/>
          <div style={{ fontSize:12, color:T.ink3 }}>Card {idx + 1} of {queue.length}</div>
        </div>
        <button onClick={() => setShowSettings(s => !s)} style={{ width:36, height:36, borderRadius:10, background:T.card, border:`1px solid ${T.border}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', position:'relative', cursor:'pointer' }}>
          {Icon.cog()}
          {showSettings && (
            <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:240, background:'#fff', border:`1px solid ${T.border}`, borderRadius:12, boxShadow:'0 12px 32px rgba(0,0,0,.14)', padding:12, zIndex:50, textAlign:'left' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Study settings</div>
              <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', fontSize:12.5, color:T.ink2, cursor:'pointer' }}>
                Auto-play audio
                <span onClick={() => setSettings(s => ({ ...s, autoPlay: !s.autoPlay }))} style={{ width:34, height:20, borderRadius:99, background: settings.autoPlay ? accent : T.bg2, position:'relative', transition:'background .15s' }}>
                  <span style={{ position:'absolute', top:2, left: settings.autoPlay ? 16 : 2, width:16, height:16, borderRadius:8, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' }}/>
                </span>
              </label>
              <label style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0', fontSize:12.5, color:T.ink2, cursor:'pointer', borderTop:`1px solid ${T.hairline}` }}>
                Show hints
                <span onClick={() => setSettings(s => ({ ...s, showHint: !s.showHint }))} style={{ width:34, height:20, borderRadius:99, background: settings.showHint ? accent : T.bg2, position:'relative', transition:'background .15s' }}>
                  <span style={{ position:'absolute', top:2, left: settings.showHint ? 16 : 2, width:16, height:16, borderRadius:8, background:'#fff', boxShadow:'0 1px 2px rgba(0,0,0,.2)', transition:'left .15s' }}/>
                </span>
              </label>
              <button onClick={() => { reshuffle(); setShowSettings(false); }} style={{ width:'100%', marginTop:4, padding:'9px 10px', borderRadius:8, background:T.bg2, color:T.ink2, fontSize:12, fontWeight:600, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
                {Icon.refresh({ width:12, height:12 })} Reshuffle deck
              </button>
              <button onClick={() => { onExit(); }} style={{ width:'100%', marginTop:6, padding:'9px 10px', borderRadius:8, background:'transparent', color:'#C0392B', fontSize:12, fontWeight:600, border:`1px solid ${T.border}`, cursor:'pointer' }}>End session</button>
            </div>
          )}
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height:3, background:T.trackWarm, position:'relative', flexShrink:0 }}>
        <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${pct}%`, background:accent, transition:'width .35s' }}/>
      </div>

      {/* Card stage */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px 40px' }}>
        {/* Stack ghost cards behind */}
        <div style={{ position:'relative', width:560, height:380 }}>
          <div style={{ position:'absolute', inset:0, transform:'translate(8px, 8px) rotate(1.2deg)', background:T.card, borderRadius:20, border:`1px solid ${T.border}`, opacity:.5 }}/>
          <div style={{ position:'absolute', inset:0, transform:'translate(4px, 4px) rotate(.6deg)', background:T.card, borderRadius:20, border:`1px solid ${T.border}`, opacity:.8 }}/>

          {/* Active card */}
          <button onClick={() => setFlipped(!flipped)} style={{
            position:'absolute', inset:0, background:T.card, borderRadius:20, border:`1px solid ${T.border}`, padding:'40px 44px',
            boxShadow:'0 14px 40px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.02)',
            display:'flex', flexDirection:'column', textAlign:'left', cursor:'pointer', transition:'transform .25s'
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Flag code={deck.lang}/>
                <Chip label={card.pos} accent={accent} bg={`${accent}1f`} style={{ fontSize:10 }}/>
                <Chip label={`Strength ${card.strength}/5`} accent={T.ink3} bg={T.bg2} style={{ fontSize:10 }}/>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={e => { e.stopPropagation(); /* star toggle local-only */ card.starred = !card.starred; }} title="Star" style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' }}>{Icon.star({ width:13, height:13, fill: card.starred ? 'currentColor' : 'none' })}</button>
                <button onClick={e => { e.stopPropagation(); speak(card.word); }} title="Hear it" style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', border:'none', cursor:'pointer' }}>{Icon.head({ width:14, height:14 })}</button>
              </div>
            </div>

            <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', textAlign:'center' }}>
              {!flipped ? (
                <>
                  <div style={{ fontFamily:T.serif, fontSize:64, color:T.ink, lineHeight:1.05, marginBottom:8 }}>{card.word}</div>
                  {/* Always-visible English translation — small, ink3, italic. Helps people learn. */}
                  <div style={{ fontSize:16, color:T.ink3, marginBottom:14 }}>{card.trans}</div>
                  <div style={{ fontSize:14, color:T.ink4 }}>{settings.showHint ? 'Tap card or press Space to reveal example' : ''}</div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily:T.serif, fontSize:38, color:T.ink, lineHeight:1.1, marginBottom:6 }}>{card.trans}</div>
                  <div style={{ fontSize:13, color:T.ink4, marginBottom:14, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>English translation</div>
                  <div style={{ width:60, height:1, background:T.border, marginBottom:20 }}/>
                  <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:6 }}>{card.word}</div>
                  <div style={{ fontSize:16, color:T.ink2, fontStyle:'italic', maxWidth:420, lineHeight:1.5, marginBottom:8 }}>"{card.ex}"</div>
                  <div style={{ fontSize:13, color:T.ink4, maxWidth:360 }}>Tap the headphone above to hear it spoken.</div>
                </>
              )}
            </div>

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', fontSize:11.5, color:T.ink4 }}>
              <div>Last seen 2 days ago</div>
              <div style={{ display:'flex', alignItems:'center', gap:4 }}>{Icon.spark({ width:11, height:11 })} +5 XP per correct</div>
            </div>
          </button>
        </div>

        {/* Action row */}
        {!flipped ? (
          <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:14 }}>
            <button onClick={reshuffle} title="Reshuffle remaining cards" style={{ width:44, height:44, borderRadius:22, background:T.card, border:`1px solid ${T.border}`, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.refresh({ width:16, height:16 })}</button>
            <Btn label="Show answer" size="lg" accent={accent} onClick={() => setFlipped(true)} iconRight={<span style={{ fontSize:10, fontWeight:600, padding:'2px 6px', background:'rgba(255,255,255,.22)', borderRadius:4, marginLeft:4 }}>SPACE</span>}/>
            <button onClick={() => speak(card.word)} title="Hear pronunciation" style={{ width:44, height:44, borderRadius:22, background:T.card, border:`1px solid ${T.border}`, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>{Icon.head({ width:16, height:16 })}</button>
          </div>
        ) : (
          <div style={{ marginTop:32, display:'flex', alignItems:'center', gap:10 }}>
            {[
              { label:'Again', sub:'<1 min',  c:'#C0392B', shortcut:'1' },
              { label:'Hard',  sub:'6 min',   c:'#C04A06', shortcut:'2' },
              { label:'Good',  sub:'1 day',   c:'#1A8F4E', shortcut:'3' },
              { label:'Easy',  sub:'4 days',  c:'#5B4EFF', shortcut:'4' },
            ].map(g => (
              <button key={g.label} onClick={() => rate(g.label)} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'14px 22px', display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer', minWidth:120 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = g.c; e.currentTarget.style.background = `${g.c}0a`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.card; }}>
                <div style={{ fontSize:14, fontWeight:700, color:g.c }}>{g.label}</div>
                <div style={{ fontSize:11, color:T.ink4 }}>{g.sub}</div>
                <div style={{ marginTop:4, fontSize:9.5, fontWeight:700, color:T.ink5, padding:'1px 5px', border:`1px solid ${T.border}`, borderRadius:4, letterSpacing:'.04em' }}>KEY {g.shortcut}</div>
              </button>
            ))}
          </div>
        )}

        {/* Mini queue preview */}
        <div style={{ marginTop:36, display:'flex', alignItems:'center', gap:8, fontSize:11, color:T.ink4 }}>
          <span style={{ fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>Up next</span>
          <div style={{ width:18, height:1, background:T.border }}/>
          {queue.slice(idx + 1, idx + 4).map((w, i) => (
            <div key={i} style={{ padding:'4px 10px', background:T.card, border:`1px solid ${T.border}`, borderRadius:99, fontSize:11.5, color:T.ink2 }}>{w.word}</div>
          ))}
          {queue.length - idx - 1 > 3 && <span style={{ color:T.ink5 }}>+{queue.length - idx - 4} more</span>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { VocabPage });

// Search words modal — lookup across decks. Used by the topbar “Search words” button.
function SearchWordsModal({ q, setQ, words, decks, onClose }) {
  const ql = (q || '').trim().toLowerCase();
  const matches = ql ? words.filter(w => w.word.toLowerCase().includes(ql) || w.trans.toLowerCase().includes(ql) || w.ex.toLowerCase().includes(ql)) : [];
  return (
    <ModalShell onClose={onClose} eyebrow="Search" title="Find a word across your decks" width={520}>
      <div style={{ position:'relative', marginBottom:14 }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Type a word in any language or its English meaning…" autoFocus style={{ width:'100%', padding:'12px 14px 12px 40px', fontSize:14, border:`1px solid ${T.border}`, borderRadius:10, background:T.card, color:T.ink, outline:'none', boxSizing:'border-box' }}/>
        <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:T.ink4 }}>{Icon.search({ width:14, height:14 })}</span>
      </div>
      {!ql ? (
        <div style={{ fontSize:12.5, color:T.ink4, padding:'18px 4px' }}>Start typing to search · {words.length} words in {decks.length} decks.</div>
      ) : matches.length === 0 ? (
        <div style={{ fontSize:13, color:T.ink3, padding:'18px 4px' }}>No matches for <b>“{q}”</b>. Try the English meaning, or check spelling.</div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:340, overflowY:'auto' }}>
          {matches.map((w, i) => (
            <div key={i} style={{ padding:'10px 12px', background:T.bg2, border:`1px solid ${T.hairline}`, borderRadius:10, display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                  <span style={{ fontWeight:700, color:T.ink, fontSize:14 }}>{w.word}</span>
                  <span style={{ fontSize:11, color:T.ink4 }}>{w.pos}</span>
                </div>
                <div style={{ fontSize:12.5, color:T.ink2, marginTop:2 }}>{w.trans}</div>
                <div style={{ fontSize:11, color:T.ink4, fontStyle:'italic', marginTop:2 }}>"{w.ex}"</div>
              </div>
              <span style={{ fontSize:10, fontWeight:700, color: w.due === 'today' ? T.brand : T.ink4, padding:'3px 8px', borderRadius:99, background: w.due === 'today' ? T.brandLight : T.card, border:`1px solid ${T.border}`, flexShrink:0 }}>{w.due}</span>
            </div>
          ))}
        </div>
      )}
    </ModalShell>
  );
}

// ── Modals ───────────────────────────────────────────────────
function ModalShell({ onClose, title, eyebrow, children, footer, width = 460 }) {
  return (
    <div onClick={onClose} style={{ position:'absolute', inset:0, background:'rgba(20,20,20,.55)', zIndex:60, display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
      <div onClick={e=>e.stopPropagation()} style={{ width, maxHeight:'82%', overflow:'auto', background:'#fff', borderRadius:18, boxShadow:'0 30px 70px rgba(0,0,0,.3)', color:T.ink }}>
        <div style={{ padding:'22px 26px 18px', borderBottom:`1px solid ${T.hairline}`, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:14 }}>
          <div>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase' }}>{eyebrow}</div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginTop:3, lineHeight:1.15 }}>{title}</div>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, background:T.bg2, color:T.ink3, fontSize:16, cursor:'pointer', border:'none', flexShrink:0 }}>×</button>
        </div>
        <div style={{ padding:'18px 26px 22px' }}>{children}</div>
        {footer && <div style={{ padding:'14px 26px 22px', borderTop:`1px solid ${T.hairline}`, display:'flex', gap:8, justifyContent:'flex-end' }}>{footer}</div>}
      </div>
    </div>
  );
}

function NewDeckModal({ onClose }) {
  const [name, setName] = useState('');
  const [lang, setLang] = useState('es');
  const [level, setLevel] = useState('A2');
  const langs = [{c:'es', l:'Spanish'},{c:'fr', l:'French'},{c:'en', l:'English'},{c:'ja', l:'Japanese'},{c:'de', l:'German'},{c:'it', l:'Italian'}];
  const levels = ['A1','A2','B1','B2','C1'];
  return (
    <ModalShell onClose={onClose} eyebrow="Create deck" title="Start a new vocabulary deck"
      footer={<>
        <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:10, background:T.bg2, color:T.ink2, fontSize:12.5, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}` }}>Cancel</button>
        <button disabled={!name.trim()} onClick={onClose} style={{ padding:'10px 22px', borderRadius:10, background: name.trim() ? T.brand : T.bg3, color:'#fff', fontSize:12.5, fontWeight:700, cursor:name.trim()?'pointer':'not-allowed', border:'none', opacity:name.trim()?1:.55 }}>Create deck</button>
      </>}>
      <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Deck name</div>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Hotel & travel" autoFocus style={{ width:'100%', padding:'11px 14px', fontSize:14, border:`1px solid ${T.border}`, borderRadius:10, background:T.card, color:T.ink, marginBottom:18, outline:'none', boxSizing:'border-box' }}/>
      <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Language</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:18 }}>
        {langs.map(L => (
          <button key={L.c} onClick={()=>setLang(L.c)} style={{ padding:'10px 10px', fontSize:12, fontWeight:600, borderRadius:9, border:`1px solid ${lang===L.c?T.brand:T.border}`, background:lang===L.c?T.brandLight:T.card, color:lang===L.c?T.brand:T.ink2, cursor:'pointer', display:'flex', alignItems:'center', gap:8 }}>
            <Flag code={L.c} w={18} h={12}/> {L.l}
          </button>
        ))}
      </div>
      <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>CEFR level</div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:6 }}>
        {levels.map(L => (
          <button key={L} onClick={()=>setLevel(L)} style={{ padding:'10px 0', fontSize:12, fontWeight:700, borderRadius:9, border:`1px solid ${level===L?T.brand:T.border}`, background:level===L?T.brandLight:T.card, color:level===L?T.brand:T.ink2, cursor:'pointer' }}>{L}</button>
        ))}
      </div>
    </ModalShell>
  );
}

function AddCardsModal({ deck, onClose }) {
  const [pairs, setPairs] = useState([{w:'', t:''}, {w:'', t:''}, {w:'', t:''}]);
  const update = (i, k, v) => setPairs(p => p.map((row, j) => j===i ? {...row, [k]:v} : row));
  const filled = pairs.filter(p => p.w.trim() && p.t.trim()).length;
  return (
    <ModalShell onClose={onClose} eyebrow={deck.title} title="Add cards to this deck" width={560}
      footer={<>
        <button onClick={() => setPairs(p => [...p, {w:'',t:''}])} style={{ padding:'10px 14px', borderRadius:10, background:T.bg2, color:T.ink2, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}`, marginRight:'auto' }}>+ Add row</button>
        <button onClick={onClose} style={{ padding:'10px 18px', borderRadius:10, background:T.bg2, color:T.ink2, fontSize:12.5, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}` }}>Cancel</button>
        <button disabled={!filled} onClick={onClose} style={{ padding:'10px 22px', borderRadius:10, background: filled ? deck.accent.accent : T.bg3, color:'#fff', fontSize:12.5, fontWeight:700, cursor:filled?'pointer':'not-allowed', border:'none', opacity:filled?1:.55 }}>Save {filled || ''} card{filled===1?'':'s'}</button>
      </>}>
      <div style={{ fontSize:12, color:T.ink3, marginBottom:14 }}>Type a word and its translation. Examples come automatically when you save — you can edit them later.</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 26px', gap:8, fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>
        <div>Word ({deck.lang.toUpperCase()})</div><div>Translation (EN)</div><div></div>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {pairs.map((row, i) => (
          <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 1fr 26px', gap:8, alignItems:'center' }}>
            <input value={row.w} onChange={e=>update(i, 'w', e.target.value)} placeholder="…" style={{ padding:'9px 12px', fontSize:13, border:`1px solid ${T.border}`, borderRadius:8, background:T.card, color:T.ink, outline:'none', boxSizing:'border-box' }}/>
            <input value={row.t} onChange={e=>update(i, 't', e.target.value)} placeholder="…" style={{ padding:'9px 12px', fontSize:13, border:`1px solid ${T.border}`, borderRadius:8, background:T.card, color:T.ink, outline:'none', boxSizing:'border-box' }}/>
            <button onClick={() => setPairs(p => p.filter((_,j)=>j!==i))} disabled={pairs.length<=1} style={{ width:26, height:26, borderRadius:6, background:'transparent', color:T.ink4, fontSize:14, cursor:pairs.length>1?'pointer':'not-allowed', border:'none' }}>×</button>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

Object.assign(window, { NewDeckModal, AddCardsModal });
