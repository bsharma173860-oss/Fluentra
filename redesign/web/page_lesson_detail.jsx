// ── Lesson detail · real AI-generated, in-language lesson ───────────────────
// Reads window.__lessonTopic = { title, unit, level } (set by the course page),
// generates a structured lesson in the target language, and renders it.

function LessonDetailPage() {
  const lang = window.__langCode || 'en';
  const topicObj = (typeof window !== 'undefined' && window.__lessonTopic) || null;
  const title = topicObj ? topicObj.title : 'Lesson';
  const unit  = topicObj ? topicObj.unit  : '';
  const level = topicObj ? topicObj.level : '';

  const [loading, setLoading] = React.useState(true);
  const [data, setData]       = React.useState(null);
  const [err, setErr]         = React.useState('');
  const [tab, setTab]         = React.useState('lesson');
  const [ans, setAns]         = React.useState({});
  const [checked, setChecked] = React.useState(false);

  React.useEffect(function () {
    var cancelled = false;
    (async function () {
      try {
        var r = await fetch('/api/generate-content', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lang: lang, type: 'lesson', difficulty: 'medium', topic: title }),
        });
        var j = await r.json();
        if (j.error) throw new Error(j.error);
        if (cancelled) return;
        setData((j.content && j.content.payload) || null);
        setLoading(false);
      } catch (e) {
        if (!cancelled) { setErr('Could not load this lesson: ' + (e.message || e)); setLoading(false); }
      }
    })();
    return function () { cancelled = true; };
  }, []);

  function back() { window.__nav && window.__nav('course'); }
  const practice = (data && data.practice) || [];
  let correct = 0;
  practice.forEach(function (q, i) { if (ans[i] === q.answer) correct++; });

  function shell(children) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <WebTopbar/>
        <div style={{ flex:1, overflow:'auto' }}>{children}</div>
      </div>
    );
  }

  if (loading) return shell(
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'70%', gap:14, color:T.ink3 }}>
      <div style={{ display:'flex', gap:6 }}>{[0,1,2].map(function(i){ return <span key={i} style={{ width:9, height:9, borderRadius:5, background:T.brand, animation:'rdb 1s '+(i*0.15)+'s infinite' }}/>; })}</div>
      <div style={{ fontSize:13 }}>Writing your lesson on “{title}”…</div>
      <style>{'@keyframes rdb{0%,100%{opacity:.3;transform:translateY(0)}50%{opacity:1;transform:translateY(-4px)}}'}</style>
    </div>
  );
  if (err || !data) return shell(
    <div style={{ padding:40, textAlign:'center', color:T.ink3 }}>
      <div style={{ fontSize:14, marginBottom:14 }}>{err || 'No lesson content.'}</div>
      <Btn label="Back to course" accent={T.brand} onClick={back}/>
    </div>
  );

  return shell(
    <>
      <div style={{ padding:'32px 40px 22px', borderBottom:`1px solid ${T.hairline}` }}>
        <div onClick={back} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, color:T.ink3, marginBottom:14, cursor:'pointer' }}>
          {Icon.arrowL ? Icon.arrowL() : '←'} <span>{unit || 'Course'}</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14, flexWrap:'wrap' }}>
          {level && <Chip label={level} bg={T.brandLight} accent={T.brand}/>}
          {unit && <Chip label={unit} bg={T.bg2} accent={T.ink2}/>}
        </div>
        <div style={{ fontFamily:T.serif, fontSize:42, lineHeight:1.06, color:T.ink, marginBottom:14 }}>{data.title || title}</div>
        {Array.isArray(data.objectives) && data.objectives.length > 0 && (
          <ul style={{ display:'flex', flexDirection:'column', gap:8, padding:0, listStyle:'none', maxWidth:680 }}>
            {data.objectives.map(function (o, i) { return (
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:14, color:T.ink2, lineHeight:1.5 }}>
                <div style={{ width:18, height:18, borderRadius:9, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>{Icon.check({ width:10, height:10 })}</div>
                <span>{o}</span>
              </li>
            ); })}
          </ul>
        )}
      </div>

      <div style={{ padding:'0 40px', borderBottom:`1px solid ${T.hairline}`, display:'flex', gap:0 }}>
        {[['lesson','Lesson'],['practice','Practice'],['vocab','Vocab']].map(function (t) { return (
          <button key={t[0]} onClick={function(){ setTab(t[0]); }} style={{ padding:'14px 18px', fontSize:13, fontWeight: tab===t[0]?700:500, color: tab===t[0]?T.ink:T.ink3, borderBottom: tab===t[0]?`2px solid ${T.brand}`:'2px solid transparent', cursor:'pointer', background:'transparent' }}>{t[1]}</button>
        ); })}
      </div>

      <div style={{ padding:'30px 40px 60px', display:'grid', gridTemplateColumns:'1fr 300px', gap:36 }}>
        <div style={{ minWidth:0 }}>
          {tab === 'lesson' && <>
            {(data.sections || []).map(function (sec, i) { return (
              <div key={i} style={{ marginBottom:26 }}>
                {sec.heading && <h2 style={{ fontFamily:T.serif, fontSize:24, color:T.ink, marginBottom:10 }}>{sec.heading}</h2>}
                <div style={{ fontSize:14.5, lineHeight:1.7, color:T.ink2, whiteSpace:'pre-wrap', maxWidth:660 }}>{sec.body}</div>
              </div>
            ); })}
            {Array.isArray(data.examples) && data.examples.length > 0 && <>
              <h2 style={{ fontFamily:T.serif, fontSize:24, color:T.ink, margin:'8px 0 14px' }}>Examples</h2>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {data.examples.map(function (ex, i) { return (
                  <Card key={i} padding={16}>
                    <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink, lineHeight:1.4 }}>{ex.target}</div>
                    <div style={{ fontSize:12.5, color:T.ink3, marginTop:4 }}>{ex.gloss}</div>
                  </Card>
                ); })}
              </div>
            </>}
          </>}

          {tab === 'practice' && <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {practice.length === 0 && <div style={{ fontSize:13, color:T.ink3 }}>No practice items for this lesson.</div>}
            {practice.map(function (q, qi) { return (
              <Card key={qi} padding={18}>
                <div style={{ fontSize:14, fontWeight:600, color:T.ink, marginBottom:12, lineHeight:1.4 }}>{qi+1}. {q.q}</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {(q.options || []).map(function (opt, oi) {
                    var picked = ans[qi] === oi;
                    var right = checked && oi === q.answer;
                    var wrong = checked && picked && oi !== q.answer;
                    return (
                      <button key={oi} onClick={function(){ if(!checked) setAns(function(a){ var n=Object.assign({},a); n[qi]=oi; return n; }); }}
                        style={{ textAlign:'left', padding:'10px 14px', borderRadius:10, fontSize:13.5, cursor: checked?'default':'pointer',
                          background: right ? '#dcfce7' : wrong ? '#fee2e2' : picked ? T.brandLight : T.bg2,
                          border:`1px solid ${ right ? '#16a34a' : wrong ? '#dc2626' : picked ? T.brand : T.border }`,
                          color: right ? '#166534' : wrong ? '#991b1b' : T.ink }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </Card>
            ); })}
            {practice.length > 0 && (
              checked
                ? <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                    <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{correct} / {practice.length} correct</div>
                    <Btn label="Reset" variant="outline" accent={T.ink2} onClick={function(){ setAns({}); setChecked(false); }}/>
                  </div>
                : <Btn label="Check answers" accent={T.brand} onClick={function(){ setChecked(true); }}/>
            )}
          </div>}

          {tab === 'vocab' && <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {(data.vocab || []).map(function (v, i) { return (
              <Card key={i} padding={14}>
                <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{v.term}</div>
                <div style={{ fontSize:12, color:T.ink3, marginTop:2 }}>{v.gloss}</div>
              </Card>
            ); })}
            {(!data.vocab || !data.vocab.length) && <div style={{ fontSize:13, color:T.ink3 }}>No vocabulary for this lesson.</div>}
          </div>}
        </div>

        <div>
          <div style={{ padding:'14px 16px', background:T.brandLight, border:`1px solid ${T.brand}33`, borderRadius:12 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>Stuck?</div>
            <div style={{ fontSize:13, color:T.ink2, lineHeight:1.5, marginBottom:12 }}>Ask the AI tutor to explain anything from this lesson in your own language.</div>
            <Btn label="Ask the tutor" nav="tutor" small accent={T.brand}/>
          </div>
          <div style={{ marginTop:14 }}>
            <Btn label="Practice this skill" nav="reading" variant="outline" accent={T.ink} fullWidth iconRight={Icon.arrow ? Icon.arrow() : null}/>
          </div>
        </div>
      </div>
    </>
  );
}

Object.assign(window, { LessonDetailPage });
