// ── Page: Universal search results ──────────────────────────
// Three-column: filters / results list / preview pane
// Searches across lessons, words, exam questions, library, tutor history.

function SearchPage() {
  const [query, setQuery] = useState('past tense');
  const [scope, setScope] = useState('all');
  const [selected, setSelected] = useState(0);

  const groups = [
    { id:'all',       label:'All',          n:38 },
    { id:'lessons',   label:'Lessons',      n:12 },
    { id:'words',     label:'Vocabulary',   n:14 },
    { id:'grammar',   label:'Grammar',      n:6  },
    { id:'library',   label:'Library',      n:4  },
    { id:'exam',      label:'Exam Qs',      n:1  },
    { id:'tutor',     label:'Tutor chats',  n:1  },
  ];

  const langs = [
    { code:'all', label:'All languages', n:38 },
    { code:'es',  label:'Spanish',       n:18 },
    { code:'fr',  label:'French',        n:9  },
    { code:'en',  label:'English',       n:7  },
    { code:'ja',  label:'Japanese',      n:4  },
  ];

  const results = [
    { kind:'Grammar', title:'Past tense — passé composé',          sub:'French · B1 · 14 examples',     ic:'pen', c:T.writing,   lang:'fr', snippet:'Forms with avoir or être + participe passé. "J\'ai mangé" → "I ate / have eaten."', meta:'Lesson · 12 min', match:'past' },
    { kind:'Grammar', title:'Pretérito indefinido vs imperfecto',  sub:'Spanish · B1',                  ic:'pen', c:T.writing,   lang:'es', snippet:'The two Spanish past tenses for completed vs ongoing actions. Use indefinido for "ayer comí" and imperfecto for "comía cuando..."', meta:'Lesson · 18 min', match:'past tense' },
    { kind:'Word',    title:'había',                               sub:'Spanish · verb · pluscuamperfecto', ic:'book', c:T.reading, lang:'es', snippet:'Auxiliary used to form the past perfect. "Ya había salido cuando llegaste."', meta:'Vocab · A2', match:'past' },
    { kind:'Lesson',  title:'Telling stories in the past',         sub:'Spanish · A2/B1',               ic:'mic', c:T.speaking,   lang:'es', snippet:'Roleplay practice for narrating events that happened. Tutor catches tense slips in real time.', meta:'Speaking · 15 min', match:'past tense' },
    { kind:'Library', title:'How to use English past perfect (article)', sub:'English · Grammar guide', ic:'book', c:T.reading,   lang:'en', snippet:'A 14-minute deep dive on when natives actually use "had + past participle" — and when they skip it.', meta:'Article · 14 min', match:'past' },
    { kind:'Exam Q',  title:'IELTS Writing Task 2 · Past tense errors', sub:'Mock 03 · Section 2',     ic:'trophy', c:T.reading,  lang:'en', snippet:'You marked: "When I was younger I have lived in Berlin" → corrected to "I lived in Berlin."', meta:'Reviewed Mar 14', match:'past' },
    { kind:'Tutor',   title:`Lía · "Why is it 'me dijo' and not 'me decía'?"`, sub:'Spanish · 2 weeks ago', ic:'message', c:T.speaking, lang:'es', snippet:'Indefinido vs imperfecto explained with three examples and a short drill.', meta:'Chat · 14 messages', match:'past tense' },
    { kind:'Word',    title:'comer (conjugated past)',             sub:'Spanish · verb',                ic:'book', c:T.reading,   lang:'es', snippet:'comí · comiste · comió · comimos · comisteis · comieron', meta:'Vocab · A1', match:'past' },
  ];

  // Filter by scope
  const scopeMap = { lessons:'Lesson', words:'Word', grammar:'Grammar', library:'Library', exam:'Exam Q', tutor:'Tutor' };
  const filtered = scope === 'all' ? results : results.filter(r => r.kind === scopeMap[scope]);
  const safeIdx = Math.min(selected, Math.max(0, filtered.length - 1));
  const sel = filtered[safeIdx] || results[0];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Search topbar — replaces standard topbar */}
      <div style={{ height:64, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', padding:'0 32px', background:T.bg, gap:18, flexShrink:0 }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:12, padding:'10px 16px', background:T.card, border:`1.5px solid ${T.brand}`, borderRadius:12, boxShadow:`0 0 0 4px ${T.brandLight}aa` }}>
          <div style={{ color:T.brand }}>{Icon.search()}</div>
          <input value={query} onChange={e => setQuery(e.target.value)} style={{ flex:1, border:'none', background:'transparent', fontSize:14, fontWeight:500, color:T.ink, outline:'none', fontFamily:T.sans }}/>
          <button style={{ padding:'2px 6px', border:`1px solid ${T.border}`, borderRadius:5, fontSize:10, fontWeight:600, color:T.ink4 }}>ESC</button>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <button style={{ width:36, height:36, borderRadius:10, background:T.card, border:`1px solid ${T.border}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.bell()}</button>
          <div style={{ width:36, height:36, borderRadius:18, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:14 }}>M</div>
        </div>
      </div>

      <div style={{ flex:1, display:'grid', gridTemplateColumns:'220px 1fr 380px', gap:0, overflow:'hidden' }}>
        {/* LEFT — Filters */}
        <div style={{ borderRight:`1px solid ${T.border}`, padding:'24px 18px', overflow:'auto' }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Type</div>
          <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:24 }}>
            {groups.map(g => {
              const active = scope === g.id;
              return (
                <button key={g.id} onClick={() => setScope(g.id)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'7px 10px', borderRadius:8, fontSize:12.5, fontWeight: active ? 700 : 500, color: active ? T.ink : T.ink2, background: active ? T.bg2 : 'transparent', textAlign:'left' }}>
                  <span>{g.label}</span>
                  <span style={{ fontSize:10.5, color:T.ink4 }}>{g.n}</span>
                </button>
              );
            })}
          </div>

          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Language</div>
          <div style={{ display:'flex', flexDirection:'column', gap:2, marginBottom:24 }}>
            {langs.map(l => (
              <button key={l.code} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 10px', borderRadius:8, fontSize:12.5, color:T.ink2, textAlign:'left' }}>
                {l.code !== 'all' ? <Flag code={l.code} w={16} h={11}/> : <div style={{ width:16, height:11, borderRadius:2, background:T.bg2, border:`1px solid ${T.border}` }}/>}
                <span style={{ flex:1 }}>{l.label}</span>
                <span style={{ fontSize:10.5, color:T.ink4 }}>{l.n}</span>
              </button>
            ))}
          </div>

          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Level</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:24 }}>
            {['A1','A2','B1','B2','C1','C2'].map((l,i) => (
              <button key={l} style={{ padding:'4px 9px', borderRadius:6, fontSize:11.5, fontWeight: i===2 ? 700 : 500, color: i===2 ? T.brand : T.ink3, background: i===2 ? T.brandLight : T.card, border:`1px solid ${i===2 ? `${T.brand}33` : T.border}` }}>{l}</button>
            ))}
          </div>

          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Skill</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {[
              { l:'Speaking',  c:T.speaking },
              { l:'Writing',   c:T.writing },
              { l:'Listening', c:T.listening },
              { l:'Reading',   c:T.reading },
            ].map(s => (
              <label key={s.l} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12.5, color:T.ink2, cursor:'pointer' }}>
                <input type="checkbox" defaultChecked={s.l==='Writing'||s.l==='Speaking'} style={{ accentColor:s.c.c }}/>
                <span style={{ width:7, height:7, borderRadius:3.5, background:s.c.c }}/>
                {s.l}
              </label>
            ))}
          </div>
        </div>

        {/* MIDDLE — Results list */}
        <div style={{ overflow:'auto', padding:'24px 28px' }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:6 }}>
            <h1 style={{ fontFamily:T.serif, fontSize:30, color:T.ink, margin:0, lineHeight:1.05 }}>
              <span style={{ color:T.ink3 }}>Results for</span> "<span>{query}</span>"
            </h1>
            <div style={{ fontSize:11.5, color:T.ink4 }}>{results.length} matches · 0.04s</div>
          </div>
          <div style={{ fontSize:13, color:T.ink3, marginBottom:24 }}>Across your lessons, vocab, exam history, and library.</div>

          {/* Top hit */}
          <div style={{ background:`linear-gradient(135deg, ${T.brandLight}, ${T.bg2})`, border:`1px solid ${T.brand}33`, borderRadius:16, padding:'18px 20px', marginBottom:22, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.spark({ width:18, height:18 })}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.brand, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:3 }}>Top hit · suggested lesson</div>
              <div style={{ fontFamily:T.serif, fontSize:21, color:T.ink, lineHeight:1.1 }}>Master Spanish past tenses in 4 lessons</div>
              <div style={{ fontSize:11.5, color:T.ink3, marginTop:3 }}>Personalized for your weak spots · ~50 min total</div>
            </div>
            <Btn label="Start path" accent={T.brand} iconRight={Icon.arrow()}/>
          </div>

          {/* Result groupings */}
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {filtered.map((r, i) => {
              const active = i === safeIdx;
              const beforeMatch = r.title.toLowerCase().indexOf(r.match.toLowerCase());
              const titleEl = beforeMatch >= 0
                ? <>{r.title.slice(0, beforeMatch)}<mark style={{ background:T.brandLight, color:T.brand, padding:'0 2px', borderRadius:3 }}>{r.title.slice(beforeMatch, beforeMatch + r.match.length)}</mark>{r.title.slice(beforeMatch + r.match.length)}</>
                : r.title;
              return (
                <button key={i} onClick={() => setSelected(i)} style={{ background: active ? T.card : 'transparent', border:`1px solid ${active ? T.border : 'transparent'}`, borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'flex-start', gap:14, textAlign:'left', cursor:'pointer' }}>
                  <div style={{ width:40, height:40, borderRadius:11, background:r.c.bg, color:r.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[r.ic]({ width:15, height:15 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <Chip label={r.kind} accent={r.c.c} bg={r.c.bg} style={{ fontSize:9.5, padding:'2px 7px' }}/>
                      <Flag code={r.lang} w={14} h={9}/>
                      <div style={{ fontSize:10.5, color:T.ink4 }}>{r.sub}</div>
                    </div>
                    <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.25, marginBottom:4 }}>{titleEl}</div>
                    <div style={{ fontSize:12, color:T.ink3, lineHeight:1.45 }}>{r.snippet}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:6, display:'flex', alignItems:'center', gap:5 }}>{Icon.clock({ width:10, height:10 })} {r.meta}</div>
                  </div>
                  {active && <div style={{ color:T.brand, flexShrink:0, alignSelf:'center' }}>{Icon.chev()}</div>}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding:'40px 20px', textAlign:'center', color:T.ink4, fontSize:13 }}>No matches in this category.</div>
            )}
          </div>

          <div style={{ marginTop:28, padding:'18px 20px', background:T.bg2, borderRadius:14, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:38, height:38, borderRadius:10, background:T.card, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${T.border}` }}>{Icon.message({ width:15, height:15 })}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink, marginBottom:2 }}>Ask Lía about "{query}"</div>
              <div style={{ fontSize:11.5, color:T.ink3 }}>Get a tailored explanation with examples from what you've already studied.</div>
            </div>
            <Btn label="Ask tutor" nav="tutor" variant="outline" accent={T.brand} iconRight={Icon.arrow()}/>
          </div>
        </div>

        {/* RIGHT — Preview pane */}
        <div style={{ borderLeft:`1px solid ${T.border}`, background:T.bg2, padding:'24px 22px', overflow:'auto' }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Preview</div>

          <Card padding={20}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <Chip label={sel.kind} accent={sel.c.c} bg={sel.c.bg} style={{ fontSize:10 }}/>
              <Flag code={sel.lang} w={16} h={11}/>
            </div>
            <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.15, marginBottom:8 }}>{sel.title}</div>
            <div style={{ fontSize:12, color:T.ink3, marginBottom:18 }}>{sel.sub}</div>

            <div style={{ fontSize:13, color:T.ink2, lineHeight:1.55, marginBottom:18 }}>{sel.snippet}</div>

            {/* Inline mini-example */}
            <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:12, padding:'14px 16px', marginBottom:18 }}>
              <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Example</div>
              <div style={{ fontSize:14, color:T.ink, fontStyle:'italic', marginBottom:6 }}>"Ayer <span style={{ background:T.brandLight, color:T.brand, padding:'1px 4px', borderRadius:3, fontWeight:700, fontStyle:'normal' }}>comí</span> en un restaurante mexicano."</div>
              <div style={{ fontSize:11.5, color:T.ink3 }}>Yesterday I ate at a Mexican restaurant.</div>
            </div>

            <div style={{ display:'flex', gap:8, marginBottom:18 }}>
              <Btn label="Open" nav={sel.kind === 'Grammar' ? 'grammar' : sel.kind === 'Word' ? 'vocab' : sel.kind === 'Lesson' ? 'reading' : sel.kind === 'Library' ? 'library' : sel.kind === 'Exam Q' ? 'exams' : sel.kind === 'Tutor' ? 'tutor' : 'reading'} accent={sel.c.c} fullWidth iconRight={Icon.arrow()}/>
              <Btn label="Save" variant="outline" accent={T.ink2} icon={Icon.bookmark()}/>
            </div>

            <div style={{ borderTop:`1px solid ${T.hairline}`, paddingTop:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Connected to</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { ic:'pen',  l:'Pretérito indefinido vs imperfecto' },
                  { ic:'book', l:'Verb conjugation drill · 12 cards' },
                  { ic:'mic',  l:'Roleplay: Tell a story about your weekend' },
                ].map((r,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:T.ink2 }}>
                    <div style={{ width:22, height:22, borderRadius:6, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[r.ic]({ width:11, height:11 })}</div>
                    {r.l}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Recent searches */}
          <div style={{ marginTop:22 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Recent searches</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {['subjunctive','reflexive verbs','que vs qui','sobremesa','IELTS task 2 structure','pronombres'].map(s => (
                <button key={s} style={{ padding:'5px 10px', background:T.card, border:`1px solid ${T.border}`, borderRadius:99, fontSize:11.5, color:T.ink2, display:'flex', alignItems:'center', gap:5 }}>
                  {Icon.clock({ width:10, height:10, stroke:T.ink5 })} {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Mobile · Search ─────────────────────────────────────────
function MSearchPage() {
  const [query, setQuery] = useState('past tense');

  const tabs = ['All','Lessons','Vocab','Grammar','Library'];
  const [tab, setTab] = useState(0);

  const results = [
    { kind:'Grammar',  title:'Past tense — passé composé',         sub:'French · B1',  ic:'pen', c:T.writing,   lang:'fr', match:'past' },
    { kind:'Grammar',  title:'Pretérito indefinido vs imperfecto', sub:'Spanish · B1', ic:'pen', c:T.writing,   lang:'es', match:'past tense' },
    { kind:'Word',     title:'había',                              sub:'Spanish verb', ic:'book',c:T.reading,   lang:'es', match:'past' },
    { kind:'Lesson',   title:'Telling stories in the past',        sub:'Spanish A2/B1',ic:'mic', c:T.speaking,  lang:'es', match:'past tense' },
    { kind:'Library',  title:'How to use English past perfect',    sub:'Article · 14m',ic:'book',c:T.reading,   lang:'en', match:'past' },
    { kind:'Tutor',    title:'Why "me dijo" not "me decía"?',      sub:'2 weeks ago',  ic:'message',c:T.speaking,lang:'es',match:'past tense' },
  ];

  return (
    <>
      {/* Search header */}
      <div style={{ padding:'8px 16px 12px', display:'flex', alignItems:'center', gap:8 }}>
        <button style={{ width:36, height:36, borderRadius:18, background:T.card, border:`1px solid ${T.border}`, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.arrowL()}</button>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, padding:'9px 12px', background:T.card, border:`1.5px solid ${T.brand}`, borderRadius:11 }}>
          <div style={{ color:T.brand }}>{Icon.search({ width:14, height:14 })}</div>
          <input value={query} onChange={e=>setQuery(e.target.value)} style={{ flex:1, border:'none', background:'transparent', fontSize:14, outline:'none', color:T.ink }}/>
          <button style={{ color:T.ink5 }}>{Icon.x({ width:14, height:14 })}</button>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding:'0 16px 12px', display:'flex', gap:5, overflowX:'auto' }}>
        {tabs.map((t,i) => {
          const active = i === tab;
          return (
            <button key={t} onClick={()=>setTab(i)} style={{ flexShrink:0, padding:'7px 14px', borderRadius:99, fontSize:12, fontWeight: active ? 700 : 500, color: active ? '#fff' : T.ink2, background: active ? T.ink : T.card, border:`1px solid ${active ? T.ink : T.border}` }}>{t}</button>
          );
        })}
      </div>

      <MobileBody padding={0}>
        <div style={{ padding:'0 20px 16px' }}>
          <div style={{ fontSize:11.5, color:T.ink4, marginBottom:6 }}>{results.length} matches · 0.04s</div>
        </div>

        {/* Top hit */}
        <div style={{ padding:'0 20px 14px' }}>
          <div style={{ background:`linear-gradient(135deg, ${T.brandLight}, ${T.bg2})`, border:`1px solid ${T.brand}33`, borderRadius:14, padding:14, display:'flex', alignItems:'center', gap:11 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.spark({ width:15, height:15 })}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.brand, letterSpacing:'.1em', textTransform:'uppercase' }}>Top hit</div>
              <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, marginTop:1 }}>Master past tenses in 4 lessons</div>
              <div style={{ fontSize:10.5, color:T.ink3, marginTop:1 }}>Personalized · ~50 min</div>
            </div>
            <div style={{ color:T.brand, flexShrink:0 }}>{Icon.arrow({ width:14, height:14 })}</div>
          </div>
        </div>

        {/* Results */}
        <div style={{ padding:'0 20px 100px', display:'flex', flexDirection:'column', gap:6 }}>
          {results.map((r,i) => {
            const beforeMatch = r.title.toLowerCase().indexOf(r.match.toLowerCase());
            const titleEl = beforeMatch >= 0
              ? <>{r.title.slice(0, beforeMatch)}<mark style={{ background:T.brandLight, color:T.brand, padding:'0 2px', borderRadius:3 }}>{r.title.slice(beforeMatch, beforeMatch + r.match.length)}</mark>{r.title.slice(beforeMatch + r.match.length)}</>
              : r.title;
            return (
              <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:13, display:'flex', alignItems:'center', gap:11 }}>
                <div style={{ width:38, height:38, borderRadius:11, background:r.c.bg, color:r.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[r.ic]({ width:14, height:14 })}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:3 }}>
                    <Chip label={r.kind} accent={r.c.c} bg={r.c.bg} style={{ fontSize:9, padding:'1px 6px' }}/>
                    <Flag code={r.lang} w={12} h={8}/>
                    <div style={{ fontSize:10, color:T.ink4 }}>{r.sub}</div>
                  </div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink, lineHeight:1.25 }}>{titleEl}</div>
                </div>
                <div style={{ color:T.ink5 }}>{Icon.chev({ width:13, height:13 })}</div>
              </div>
            );
          })}

          <div style={{ marginTop:16, padding:14, background:T.bg2, borderRadius:13, display:'flex', alignItems:'center', gap:11 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:T.card, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${T.border}`, flexShrink:0 }}>{Icon.message({ width:14, height:14 })}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>Ask Lía about "{query}"</div>
              <div style={{ fontSize:10.5, color:T.ink3, marginTop:1 }}>Tailored to what you've studied.</div>
            </div>
            <div style={{ color:T.brand }}>{Icon.arrow({ width:14, height:14 })}</div>
          </div>
        </div>
      </MobileBody>
    </>
  );
}

Object.assign(window, { SearchPage, MSearchPage });
