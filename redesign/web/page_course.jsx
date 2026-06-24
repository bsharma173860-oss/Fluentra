// ── Page: Course Overview ────────────────────────────────────
// Editorial syllabus: hero with progress, unit cards in chapters,
// lesson list per unit with status (done / current / locked), milestones.

function CourseOverviewPage() {
  const lang = window.__langCode || 'en';
  const langObj = (typeof langByCode === 'function') ? langByCode(lang) : { english:'your language' };
  const syllabus = (typeof lessonSyllabus === 'function') ? lessonSyllabus() : [];

  function openLesson(title, unit, level) {
    window.__lessonTopic = { title: title, unit: unit, level: level };
    window.__nav && window.__nav('lesson_detail');
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'32px 40px 60px' }}>
        <div style={{ fontSize:11.5, color:T.ink4, marginBottom:10 }}>{langObj.english} · Course</div>
        <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.1, marginBottom:8 }}>Structured lessons</div>
        <div style={{ fontSize:14, color:T.ink3, lineHeight:1.6, maxWidth:620, marginBottom:30 }}>
          A guided path from beginner to fluent. Each lesson is written for {langObj.english}: a clear explanation, real example sentences, key vocabulary, and a short practice check.
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:26 }}>
          {syllabus.map(function (unit, ui) { return (
            <div key={ui}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                <Chip label={unit.level} bg={T.brandLight} accent={T.brand}/>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>{unit.unit}</div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
                {unit.lessons.map(function (title, li) { return (
                  <button key={li} onClick={function(){ openLesson(title, unit.unit, unit.level); }}
                    style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 18px', borderRadius:14, background:T.card, border:'1px solid '+T.border, textAlign:'left', cursor:'pointer' }}>
                    <div style={{ width:38, height:38, borderRadius:11, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.book({ width:16, height:16 })}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:10.5, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:3 }}>Lesson {li+1}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.25 }}>{title}</div>
                    </div>
                    <span style={{ color:T.brand, display:'inline-flex' }}>{Icon.arrow ? Icon.arrow({ width:13, height:13 }) : '\u2192'}</span>
                  </button>
                ); })}
              </div>
            </div>
          ); })}
        </div>
      </div>
    </div>
  );
}
