// ── Page: Grammar Reference ──────────────────────────────────
// Editorial reference book layout: TOC sidebar, article center, contextual rail right.

function GrammarPage() {
  const lang = window.__langCode || 'en';
  const langObj = (typeof langByCode === 'function') ? langByCode(lang) : { english:'your language', level:'B1' };
  const TOPICS = [
    'Present tense & basic word order',
    'Past tenses — and when to use each',
    'Future and conditional forms',
    'Articles, gender & number',
    'Pronouns: subject, object, reflexive',
    'Prepositions that trip people up',
    'Questions & negation',
    'Adjectives & agreement',
    'Common irregular verbs',
    'Connectors & complex sentences',
  ];
  function open(t) {
    window.__lessonTopic = { title: t, unit: 'Grammar', level: langObj.level || '' };
    window.__nav && window.__nav('lesson_detail');
  }
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <div style={{ fontSize:11.5, color:T.ink4, marginBottom:10 }}>{langObj.english} · Grammar</div>
        <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.1, marginBottom:8 }}>Grammar topics</div>
        <div style={{ fontSize:14, color:T.ink3, lineHeight:1.6, maxWidth:620, marginBottom:28 }}>
          Pick a topic and Fluentra writes a focused lesson for {langObj.english}: a clear explanation, real example sentences with glosses, key vocabulary, and a short practice check.
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
          {TOPICS.map(function (t, i) { return (
            <button key={i} onClick={function(){ open(t); }} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:14, background:T.card, border:'1px solid '+T.border, textAlign:'left', cursor:'pointer' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.pen({ width:16, height:16 })}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.25 }}>{t}</div>
                <div style={{ fontSize:11.5, color:T.ink4, marginTop:3 }}>Generate lesson →</div>
              </div>
            </button>
          ); })}
        </div>
      </div>
    </div>
  );
}

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
