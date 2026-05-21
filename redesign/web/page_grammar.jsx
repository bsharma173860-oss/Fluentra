// ── Page: Grammar Reference ──────────────────────────────────
// Editorial reference book layout: TOC sidebar, article center, contextual rail right.

function GrammarPage() {
  const [topic, setTopic] = useState('preterite-vs-imperfect');

  const toc = [
    { section:'Verbs', items:[
      { id:'present-tense',           label:'Present tense',                 level:'A1' },
      { id:'present-irregulars',      label:'Present — irregulars',          level:'A1' },
      { id:'reflexive-verbs',         label:'Reflexive verbs',               level:'A2' },
      { id:'preterite',               label:'Preterite (pretérito indefinido)', level:'A2' },
      { id:'imperfect',               label:'Imperfect (pretérito imperfecto)', level:'A2' },
      { id:'preterite-vs-imperfect',  label:'Preterite vs imperfect',        level:'B1', current:true },
      { id:'subjunctive-intro',       label:'Subjunctive — first contact',   level:'B1' },
      { id:'conditional',             label:'Conditional mood',              level:'B1' },
    ] },
    { section:'Nouns & adjectives', items:[
      { id:'gender',           label:'Gender of nouns',           level:'A1' },
      { id:'plural',           label:'Plurals',                   level:'A1' },
      { id:'adj-agreement',    label:'Adjective agreement',       level:'A1' },
      { id:'ser-vs-estar',     label:'Ser vs estar',              level:'A2' },
    ] },
    { section:'Pronouns', items:[
      { id:'subject-pronouns', label:'Subject pronouns',          level:'A1' },
      { id:'object-pronouns',  label:'Direct & indirect objects', level:'B1' },
      { id:'reflexive-pron',   label:'Reflexive pronouns',        level:'A2' },
    ] },
    { section:'Sentence', items:[
      { id:'word-order',       label:'Word order',                level:'A1' },
      { id:'questions',        label:'Forming questions',         level:'A1' },
      { id:'negation',         label:'Negation',                  level:'A1' },
      { id:'connectors',       label:'Connectors & cohesion',     level:'B1' },
    ] },
  ];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        {/* Header band */}
        <div style={{ background:T.bg2, borderBottom:`1px solid ${T.border}`, padding:'24px 36px 28px' }}>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24 }}>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <Flag code="es" w={20} h={14} radius={3}/>
                <span style={{ fontSize:11, fontWeight:700, color:T.es.accent, letterSpacing:'.12em', textTransform:'uppercase' }}>Spanish · Reference</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:42, color:T.ink, lineHeight:1.05 }}>Grammar reference</div>
              <div style={{ fontSize:14, color:T.ink3, marginTop:8, maxWidth:540 }}>A field guide to Spanish structure — concise rules, real examples, and the corner cases that actually trip people up.</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ padding:'10px 14px', fontSize:13, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, display:'flex', alignItems:'center', gap:6 }}>
                {Icon.search()} Search grammar…
              </button>
              <button style={{ padding:'10px 14px', fontSize:13, fontWeight:600, color:T.ink2, background:T.card, border:`1px solid ${T.border}`, borderRadius:9, display:'flex', alignItems:'center', gap:6 }}>
                {Icon.download({ width:13, height:13 })} PDF
              </button>
            </div>
          </div>
        </div>

        {/* Body — 3 column */}
        <div style={{ display:'grid', gridTemplateColumns:'260px 1fr 280px', padding:'28px 36px 40px', gap:32 }}>

          {/* TOC */}
          <aside style={{ position:'sticky', top:24, alignSelf:'flex-start' }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Contents</div>
            {toc.map((sec, si) => (
              <div key={si} style={{ marginBottom:18 }}>
                <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:6, paddingLeft:8 }}>{sec.section}</div>
                <div style={{ display:'flex', flexDirection:'column' }}>
                  {sec.items.map(it => {
                    const active = it.id === topic;
                    return (
                      <button key={it.id} onClick={()=>setTopic(it.id)} style={{ padding:'7px 10px 7px 8px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:8, fontSize:12.5, fontWeight: active ? 700 : 500, color: active ? T.ink : T.ink3, borderLeft: active ? `2px solid ${T.brand}` : '2px solid transparent', background: active ? T.brandLight : 'transparent', textAlign:'left', cursor:'pointer', borderRadius: active ? '0 8px 8px 0' : 0 }}>
                        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{it.label}</span>
                        <span style={{ fontSize:9.5, fontWeight:700, color: active ? T.brand : T.ink5, background: active ? T.card : T.bg3, padding:'1px 6px', borderRadius:4, flexShrink:0 }}>{it.level}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>

          {/* Article */}
          <article style={{ maxWidth:680, fontSize:15, color:T.ink2, lineHeight:1.65 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <Chip label="B1 · Verbs" accent={T.brand} bg={T.brandLight}/>
              <Chip label="High-frequency error" accent={T.writing.c} bg={T.writing.bg}/>
              <span style={{ fontSize:11, color:T.ink4 }}>·  Updated Mar 2024  ·  6 min read</span>
            </div>
            <h1 style={{ fontFamily:T.serif, fontSize:40, color:T.ink, lineHeight:1.05, margin:'0 0 12px', fontWeight:400 }}>Preterite vs imperfect</h1>
            <p style={{ fontSize:17, color:T.ink2, lineHeight:1.55, margin:'0 0 28px', textWrap:'pretty' }}>
              Spanish has two simple past tenses where English has one. Most learners treat them as interchangeable for months. They aren't. The choice between them is the difference between <em style={{ color:T.brand, fontStyle:'normal', fontWeight:600 }}>"I worked at a café"</em> meaning <em>"I had a job there"</em> versus <em>"I did a single shift on Tuesday."</em>
            </p>

            {/* The rule */}
            <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:14, padding:'20px 22px', marginBottom:28 }}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Rule of thumb</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.3 }}>
                Preterite tells you <span style={{ color:T.brand }}>what happened.</span><br/>
                Imperfect tells you <span style={{ color:T.speaking.c }}>what was going on.</span>
              </div>
            </div>

            <h2 style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.2, margin:'32px 0 12px', fontWeight:400 }}>When to use the preterite</h2>
            <p style={{ margin:'0 0 12px' }}>Use the preterite for events with clear edges — a definite start, end, or both. The action is presented as a complete unit, no matter how long it actually took.</p>
            <ul style={{ paddingLeft:20, margin:'0 0 20px' }}>
              <li style={{ marginBottom:6 }}>Single events: <em style={{ color:T.ink }}>Llegué a las ocho.</em> (I arrived at 8.)</li>
              <li style={{ marginBottom:6 }}>Defined durations: <em style={{ color:T.ink }}>Viví en Madrid <strong>cinco años</strong>.</em> (I lived in Madrid for 5 years.)</li>
              <li style={{ marginBottom:6 }}>A sequence: <em style={{ color:T.ink }}>Entré, me senté y pedí un café.</em></li>
            </ul>

            {/* Example block */}
            <div style={{ border:`1px solid ${T.border}`, borderRadius:12, overflow:'hidden', marginBottom:28 }}>
              <div style={{ background:T.brandLight, padding:'10px 16px', fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.1em', textTransform:'uppercase' }}>Preterite — what happened</div>
              <div style={{ padding:'18px 20px', background:T.paper, fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.4, fontStyle:'italic' }}>
                "Ayer <span style={{ color:T.brand, fontStyle:'normal', fontWeight:600 }}>fui</span> al supermercado y <span style={{ color:T.brand, fontStyle:'normal', fontWeight:600 }}>compré</span> tres cosas."
              </div>
              <div style={{ padding:'10px 20px', background:T.paper, fontSize:13, color:T.ink3, borderTop:`1px solid ${T.hairline}` }}>
                Two completed events, in sequence. We don't care about the duration of the trip — just that it happened and it's done.
              </div>
            </div>

            <h2 style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.2, margin:'32px 0 12px', fontWeight:400 }}>When to use the imperfect</h2>
            <p style={{ margin:'0 0 12px' }}>The imperfect describes the <em>shape</em> of the past — habitual actions, ongoing states, descriptions, things that were in motion when something else happened.</p>
            <ul style={{ paddingLeft:20, margin:'0 0 20px' }}>
              <li style={{ marginBottom:6 }}>Habits: <em style={{ color:T.ink }}>De pequeño <strong>jugaba</strong> al fútbol todos los días.</em></li>
              <li style={{ marginBottom:6 }}>Background description: <em style={{ color:T.ink }}>El cielo <strong>estaba</strong> nublado y <strong>hacía</strong> frío.</em></li>
              <li style={{ marginBottom:6 }}>Action interrupted: <em style={{ color:T.ink }}><strong>Caminaba</strong> a casa cuando empezó a llover.</em></li>
            </ul>

            <div style={{ border:`1px solid ${T.border}`, borderRadius:12, overflow:'hidden', marginBottom:28 }}>
              <div style={{ background:T.speaking.bg, padding:'10px 16px', fontSize:11, fontWeight:700, color:T.speaking.c, letterSpacing:'.1em', textTransform:'uppercase' }}>Imperfect — what was going on</div>
              <div style={{ padding:'18px 20px', background:T.paper, fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.4, fontStyle:'italic' }}>
                "Cuando <span style={{ color:T.speaking.c, fontStyle:'normal', fontWeight:600 }}>era</span> niño, mi abuela <span style={{ color:T.speaking.c, fontStyle:'normal', fontWeight:600 }}>cocinaba</span> los domingos."
              </div>
              <div style={{ padding:'10px 20px', background:T.paper, fontSize:13, color:T.ink3, borderTop:`1px solid ${T.hairline}` }}>
                A state ("being a child") and a recurring habit ("cooking on Sundays"). Neither has a fixed start or end the speaker cares about.
              </div>
            </div>

            <h2 style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.2, margin:'32px 0 12px', fontWeight:400 }}>The two together</h2>
            <p style={{ margin:'0 0 16px' }}>Spoken Spanish constantly mixes them. The imperfect paints the scene; the preterite drops events into it.</p>

            <div style={{ background:T.paper, border:`1px solid ${T.border}`, borderRadius:14, padding:'22px 24px', marginBottom:24 }}>
              <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1.55, fontStyle:'italic' }}>
                "<span style={{ color:T.speaking.c, fontStyle:'normal', fontWeight:600 }}>Era</span> una noche tranquila. <span style={{ color:T.speaking.c, fontStyle:'normal', fontWeight:600 }}>Leía</span> en el sofá cuando, de pronto, alguien <span style={{ color:T.brand, fontStyle:'normal', fontWeight:600 }}>llamó</span> a la puerta."
              </div>
              <div style={{ display:'flex', gap:18, marginTop:14, paddingTop:14, borderTop:`1px solid ${T.hairline}`, fontSize:12, color:T.ink3 }}>
                <div><span style={{ display:'inline-block', width:8, height:8, borderRadius:4, background:T.speaking.c, marginRight:6 }}/>Imperfect — the setting</div>
                <div><span style={{ display:'inline-block', width:8, height:8, borderRadius:4, background:T.brand, marginRight:6 }}/>Preterite — the event</div>
              </div>
            </div>

            {/* Common mistakes */}
            <h2 style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.2, margin:'32px 0 12px', fontWeight:400 }}>Common mistakes</h2>
            {[
              { wrong:'De niño jugué al fútbol todos los días.', right:'De niño jugaba al fútbol todos los días.', why:'A repeated childhood habit takes the imperfect, not the preterite.' },
              { wrong:'Ayer iba al supermercado.',                right:'Ayer fui al supermercado.',                why:'A single completed trip, with a clear time anchor (ayer), takes the preterite.' },
              { wrong:'Cuando era niño, fui muy tímido.',         right:'Cuando era niño, era muy tímido.',         why:'Personality across childhood is a state — imperfect.' },
            ].map((m, i) => (
              <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:12, padding:'14px 18px', marginBottom:10, background:T.card }}>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                  <div style={{ width:18, height:18, borderRadius:9, background:'#FFD8D8', color:'#A82828', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0, marginTop:2 }}>×</div>
                  <div style={{ fontSize:14, color:T.ink3, fontStyle:'italic', textDecoration:'line-through', textDecorationColor:'#D67878', textDecorationThickness:1.5 }}>{m.wrong}</div>
                </div>
                <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:6 }}>
                  <div style={{ width:18, height:18, borderRadius:9, background:T.listening.bg, color:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:2 }}>{Icon.check({ width:11, height:11 })}</div>
                  <div style={{ fontSize:14, color:T.ink, fontStyle:'italic' }}>{m.right}</div>
                </div>
                <div style={{ fontSize:12.5, color:T.ink3, paddingLeft:28 }}>{m.why}</div>
              </div>
            ))}

            {/* Practice CTA */}
            <div style={{ marginTop:32, padding:'22px 24px', background:T.brandLight, borderRadius:14, display:'flex', alignItems:'center', gap:18 }}>
              <div style={{ width:48, height:48, borderRadius:24, background:T.brandGrad, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.spark({ width:18, height:18 })}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, lineHeight:1.2 }}>Try 8 quick questions on this topic</div>
                <div style={{ fontSize:12.5, color:T.ink3, marginTop:3 }}>Mixed preterite/imperfect — about 4 minutes.</div>
              </div>
              <Btn label="Start drill" iconRight={Icon.arrow()} accent={T.brand}/>
            </div>

            {/* Prev / next */}
            <div style={{ display:'flex', gap:12, marginTop:32, paddingTop:24, borderTop:`1px solid ${T.border}` }}>
              <button style={{ flex:1, textAlign:'left', padding:'14px 16px', background:T.card, border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4, display:'flex', alignItems:'center', gap:5 }}>{Icon.arrowL({ width:11, height:11 })} Previous</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Imperfect (pretérito imperfecto)</div>
              </button>
              <button style={{ flex:1, textAlign:'right', padding:'14px 16px', background:T.card, border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:4, display:'flex', alignItems:'center', gap:5, justifyContent:'flex-end' }}>Next {Icon.arrow({ width:11, height:11 })}</div>
                <div style={{ fontSize:13.5, fontWeight:700, color:T.ink }}>Subjunctive — first contact</div>
              </button>
            </div>
          </article>

          {/* Right rail */}
          <aside style={{ position:'sticky', top:24, alignSelf:'flex-start', display:'flex', flexDirection:'column', gap:16 }}>
            <Card padding={16}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>On this page</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[
                  { label:'When to use the preterite', active:false },
                  { label:'When to use the imperfect', active:true },
                  { label:'The two together',          active:false },
                  { label:'Common mistakes',           active:false },
                ].map((s, i) => (
                  <button key={i} style={{ textAlign:'left', fontSize:12.5, fontWeight: s.active ? 700 : 500, color: s.active ? T.brand : T.ink3, padding:'5px 8px', borderLeft: s.active ? `2px solid ${T.brand}` : '2px solid transparent', background: s.active ? T.brandLight : 'transparent', borderRadius: s.active ? '0 6px 6px 0' : 0 }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </Card>

            <Card padding={16}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Conjugation snapshot</div>
              <div style={{ fontSize:12, color:T.ink3, marginBottom:6 }}>hablar — to speak</div>
              <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr', gap:'4px 12px', fontSize:12.5 }}>
                <div/>
                <div style={{ fontWeight:700, color:T.brand, fontSize:10.5, letterSpacing:'.05em', textTransform:'uppercase' }}>Preterite</div>
                <div style={{ fontWeight:700, color:T.speaking.c, fontSize:10.5, letterSpacing:'.05em', textTransform:'uppercase' }}>Imperfect</div>
                {[
                  ['yo',           'hablé',    'hablaba'],
                  ['tú',           'hablaste', 'hablabas'],
                  ['él / ella',    'habló',    'hablaba'],
                  ['nosotros',     'hablamos', 'hablábamos'],
                  ['vosotros',     'hablasteis','hablabais'],
                  ['ellos / ellas','hablaron', 'hablaban'],
                ].map((row, ri) => (
                  <React.Fragment key={ri}>
                    <div style={{ color:T.ink4 }}>{row[0]}</div>
                    <div style={{ color:T.ink, fontFamily:T.serif, fontStyle:'italic' }}>{row[1]}</div>
                    <div style={{ color:T.ink, fontFamily:T.serif, fontStyle:'italic' }}>{row[2]}</div>
                  </React.Fragment>
                ))}
              </div>
            </Card>

            <Card padding={16}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:8 }}>Trigger words</div>
              <div style={{ fontSize:11, color:T.ink4, marginBottom:6 }}>Often signal preterite</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:14 }}>
                {['ayer','la semana pasada','en 2019','de repente','anoche','el lunes'].map(w => (
                  <span key={w} style={{ fontSize:11, padding:'3px 8px', background:T.brandLight, color:T.brand, borderRadius:99, fontWeight:600 }}>{w}</span>
                ))}
              </div>
              <div style={{ fontSize:11, color:T.ink4, marginBottom:6 }}>Often signal imperfect</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {['siempre','todos los días','de niño','mientras','a veces','normalmente'].map(w => (
                  <span key={w} style={{ fontSize:11, padding:'3px 8px', background:T.speaking.bg, color:T.speaking.c, borderRadius:99, fontWeight:600 }}>{w}</span>
                ))}
              </div>
            </Card>

            <Card padding={16}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Related lessons</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[
                  { t:'Marisol\'s Tuesday', sub:'Listening · A2', ic:'head', c:T.listening },
                  { t:'A weekday journal',  sub:'Writing · A2',   ic:'pen',  c:T.writing },
                  { t:'Tell me about your weekend', sub:'Speaking · B1', ic:'mic', c:T.speaking },
                ].map((l, i) => (
                  <button key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:10, textAlign:'left' }}>
                    <div style={{ width:30, height:30, borderRadius:8, background:l.c.bg, color:l.c.c, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[l.ic]({ width:13, height:13 })}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:T.ink, lineHeight:1.2 }}>{l.t}</div>
                      <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{l.sub}</div>
                    </div>
                    {Icon.chev({ width:11, height:11, style:{ color:T.ink5 } })}
                  </button>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ── Mobile ─────────────────────────────────────────────────────
function MGrammarPage({ onBack }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', overflow:'hidden' }}>
      <PhoneHeader title="Grammar" back onBack={onBack} right={
        <button style={{ width:36, height:36, borderRadius:18, background:T.bg2, color:T.ink2, display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon.search()}</button>
      }/>
      <div style={{ flex:1, overflow:'auto', padding:'4px 16px 100px' }}>

        {/* Hero */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
            <Flag code="es" w={16} h={11} radius={2}/>
            <span style={{ fontSize:10, fontWeight:700, color:T.es.accent, letterSpacing:'.1em', textTransform:'uppercase' }}>Spanish · Reference</span>
          </div>
          <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.05 }}>Preterite vs imperfect</div>
          <div style={{ display:'flex', gap:6, marginTop:10 }}>
            <Chip label="B1" accent={T.brand} bg={T.brandLight}/>
            <Chip label="High-frequency error" accent={T.writing.c} bg={T.writing.bg}/>
          </div>
        </div>

        {/* Rule */}
        <div style={{ background:T.bg2, border:`1px solid ${T.border}`, borderRadius:14, padding:'16px', marginBottom:14 }}>
          <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Rule of thumb</div>
          <div style={{ fontFamily:T.serif, fontSize:17, color:T.ink, lineHeight:1.3 }}>
            Preterite tells you <span style={{ color:T.brand }}>what happened.</span> Imperfect tells you <span style={{ color:T.speaking.c }}>what was going on.</span>
          </div>
        </div>

        {/* Examples */}
        {[
          { tag:'Preterite — what happened',     c:T.brand, bg:T.brandLight, text:'"Ayer fui al supermercado y compré tres cosas."', note:'Two completed events, in sequence.' },
          { tag:'Imperfect — what was going on', c:T.speaking.c, bg:T.speaking.bg, text:'"Cuando era niño, mi abuela cocinaba los domingos."', note:'A state and a recurring habit.' },
        ].map((b,i) => (
          <div key={i} style={{ border:`1px solid ${T.border}`, borderRadius:12, overflow:'hidden', marginBottom:12 }}>
            <div style={{ background:b.bg, padding:'8px 14px', fontSize:10, fontWeight:700, color:b.c, letterSpacing:'.1em', textTransform:'uppercase' }}>{b.tag}</div>
            <div style={{ padding:'14px 16px', background:T.paper, fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.4, fontStyle:'italic' }}>{b.text}</div>
            <div style={{ padding:'8px 16px', background:T.paper, fontSize:11.5, color:T.ink3, borderTop:`1px solid ${T.hairline}` }}>{b.note}</div>
          </div>
        ))}

        {/* Trigger word strips */}
        <div style={{ marginTop:8, marginBottom:14 }}>
          <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Triggers — preterite</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:10 }}>
            {['ayer','la semana pasada','en 2019','de repente'].map(w => (
              <span key={w} style={{ fontSize:11, padding:'3px 8px', background:T.brandLight, color:T.brand, borderRadius:99, fontWeight:600 }}>{w}</span>
            ))}
          </div>
          <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>Triggers — imperfect</div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
            {['siempre','todos los días','de niño','mientras'].map(w => (
              <span key={w} style={{ fontSize:11, padding:'3px 8px', background:T.speaking.bg, color:T.speaking.c, borderRadius:99, fontWeight:600 }}>{w}</span>
            ))}
          </div>
        </div>

        {/* Conjugation */}
        <Card padding={14} style={{ marginBottom:14 }}>
          <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:6 }}>hablar</div>
          <div style={{ display:'grid', gridTemplateColumns:'auto 1fr 1fr', gap:'3px 10px', fontSize:11.5 }}>
            <div/>
            <div style={{ fontWeight:700, color:T.brand, fontSize:9.5, letterSpacing:'.05em', textTransform:'uppercase' }}>Preterite</div>
            <div style={{ fontWeight:700, color:T.speaking.c, fontSize:9.5, letterSpacing:'.05em', textTransform:'uppercase' }}>Imperfect</div>
            {[['yo','hablé','hablaba'],['tú','hablaste','hablabas'],['él','habló','hablaba'],['nos.','hablamos','hablábamos'],['ellos','hablaron','hablaban']].map((r,ri)=>(
              <React.Fragment key={ri}>
                <div style={{ color:T.ink4 }}>{r[0]}</div>
                <div style={{ color:T.ink, fontFamily:T.serif, fontStyle:'italic' }}>{r[1]}</div>
                <div style={{ color:T.ink, fontFamily:T.serif, fontStyle:'italic' }}>{r[2]}</div>
              </React.Fragment>
            ))}
          </div>
        </Card>

        <div style={{ marginTop:8, padding:'16px', background:T.brandLight, borderRadius:14 }}>
          <div style={{ fontFamily:T.serif, fontSize:17, color:T.ink, lineHeight:1.2, marginBottom:4 }}>Try 8 quick questions</div>
          <div style={{ fontSize:11.5, color:T.ink3, marginBottom:12 }}>Mixed preterite/imperfect · ~4 min</div>
          <Btn label="Start drill" iconRight={Icon.arrow()} accent={T.brand} fullWidth/>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { GrammarPage, MGrammarPage });
