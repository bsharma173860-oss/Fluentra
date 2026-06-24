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
