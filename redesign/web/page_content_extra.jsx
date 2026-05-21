// ── Lesson detail (video + transcript) + Article reader ──────────

function LessonDetailPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'24px 40px 60px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:T.ink4, marginBottom:14 }}>
          <span data-nav="course" style={{ cursor:'pointer' }}>Course</span>
          <span>›</span>
          <span data-nav="course" style={{ cursor:'pointer' }}>Unit 4 · Past tenses</span>
          <span>›</span>
          <span style={{ color:T.ink, fontWeight:700 }}>Lesson 12 · Pretérito vs Imperfecto</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24 }}>
          <div>
            {/* Video player */}
            <div style={{ position:'relative', aspectRatio:'16/9', borderRadius:16, overflow:'hidden', background:T.ink, marginBottom:18 }}>
              <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${T.brand}33, ${T.ink} 70%)` }}/>
              <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <button style={{ width:84, height:84, borderRadius:42, background:'rgba(255,255,255,.95)', color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 20px 60px rgba(0,0,0,.4)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                </button>
              </div>
              <div style={{ position:'absolute', top:14, left:14, padding:'4px 10px', background:'rgba(0,0,0,.55)', color:'#fff', fontSize:11, fontWeight:700, borderRadius:6, display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:6, height:6, borderRadius:3, background:'#FF3B30' }}/>HD · Native speaker
              </div>
              <div style={{ position:'absolute', bottom:14, right:14, padding:'4px 10px', background:'rgba(0,0,0,.55)', color:'#fff', fontSize:11, fontWeight:700, borderRadius:6 }}>06:42</div>
              {/* Scrub bar */}
              <div style={{ position:'absolute', bottom:0, left:0, right:0, height:40, background:'linear-gradient(to top, rgba(0,0,0,.6), transparent)', display:'flex', alignItems:'flex-end', padding:'0 14px 10px', gap:10 }}>
                <div style={{ flex:1, height:3, background:'rgba(255,255,255,.3)', borderRadius:2, position:'relative' }}>
                  <div style={{ width:'34%', height:'100%', background:T.brand, borderRadius:2 }}/>
                  <div style={{ position:'absolute', left:'34%', top:'50%', transform:'translate(-50%, -50%)', width:11, height:11, borderRadius:6, background:'#fff' }}/>
                </div>
                <div style={{ fontSize:11, color:'#fff', fontWeight:600 }}>2:18 / 6:42</div>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16, marginBottom:14 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:700, color:T.brand, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>Lesson 12 · 12 min</div>
                <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.15, color:T.ink }}>Pretérito vs Imperfecto</div>
                <div style={{ fontSize:13, color:T.ink3, marginTop:6 }}>Two past tenses, one big distinction. By the end you'll know exactly when to reach for each.</div>
              </div>
              <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                <Btn label="Practice this" nav="practice" variant="outline" accent={T.ink} icon={Icon.play()}/>
                <Btn label="Continue" nav="reading" accent={T.brand} iconRight={Icon.arrow()}/>
              </div>
            </div>

            {/* Transcript */}
            <Card padding={20}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                <div style={{ fontSize:13, fontWeight:700, color:T.ink, letterSpacing:'.04em' }}>Transcript</div>
                <div style={{ display:'flex', gap:6 }}>
                  <Chip label="Show ENG" accent={T.brand} bg={T.brandLight} style={{ fontSize:10.5, padding:'4px 10px', cursor:'pointer' }}/>
                  <Chip label="Slow" accent={T.ink3} bg={T.bg2} style={{ fontSize:10.5, padding:'4px 10px', cursor:'pointer' }}/>
                </div>
              </div>
              {[
                { t:'00:04', es:'Vamos a hablar de dos tiempos verbales que confunden a todos los estudiantes.', en:'We\'re going to talk about two verb tenses that confuse every student.', active:false },
                { t:'00:11', es:'El pretérito describe acciones completadas, con principio y fin claros.',           en:'The preterite describes completed actions with a clear beginning and end.',         active:true },
                { t:'00:18', es:'El imperfecto, en cambio, describe situaciones, hábitos y descripciones.',        en:'The imperfect, on the other hand, describes situations, habits, and descriptions.', active:false },
                { t:'00:26', es:'Por ejemplo: "ayer comí paella" frente a "siempre comía paella los domingos".',   en:'For example: "yesterday I ate paella" vs "I always used to eat paella on Sundays."', active:false },
              ].map((row, i) => (
                <div key={i} style={{ display:'flex', gap:14, padding:'12px 0', borderTop: i ? `1px solid ${T.hairline}` : 'none', background: row.active ? T.brandLight : 'transparent', margin: row.active ? '0 -12px' : 0, paddingLeft: row.active ? 12 : 0, paddingRight: row.active ? 12 : 0, borderRadius: row.active ? 8 : 0 }}>
                  <div style={{ fontFamily:T.mono, fontSize:11, color: row.active ? T.brand : T.ink4, fontWeight:700, flexShrink:0, paddingTop:2 }}>{row.t}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, color:T.ink, lineHeight:1.5 }}>{row.es}</div>
                    <div style={{ fontSize:12, color:T.ink4, marginTop:2, lineHeight:1.5 }}>{row.en}</div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Right rail — chapters + key vocab */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <Card padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:12 }}>Chapters</div>
              {[
                { t:'00:00', l:'Intro & overview', a:false },
                { t:'01:24', l:'When to use Pretérito', a:true },
                { t:'03:48', l:'When to use Imperfecto', a:false },
                { t:'05:32', l:'Side-by-side examples', a:false },
              ].map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
                  <div style={{ fontFamily:T.mono, fontSize:11, color: c.a ? T.brand : T.ink4, fontWeight:700, width:36 }}>{c.t}</div>
                  <div style={{ flex:1, fontSize:13, color: c.a ? T.brand : T.ink, fontWeight: c.a ? 700 : 500 }}>{c.l}</div>
                </div>
              ))}
            </Card>

            <Card padding={18}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:12 }}>Key vocabulary</div>
              {[
                { es:'comí', en:'I ate', kind:'pretérito' },
                { es:'comía', en:'I used to eat', kind:'imperfecto' },
                { es:'fui', en:'I went', kind:'pretérito' },
                { es:'iba', en:'I was going / used to go', kind:'imperfecto' },
              ].map((v, i) => (
                <div key={i} style={{ padding:'10px 0', borderTop: i ? `1px solid ${T.hairline}` : 'none', display:'flex', alignItems:'center', gap:10 }}>
                  <button style={{ width:28, height:28, borderRadius:8, background:T.bg2, color:T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon.play({ width:11, height:11 })}</button>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{v.es}</div>
                    <div style={{ fontSize:11, color:T.ink4 }}>{v.en} · {v.kind}</div>
                  </div>
                </div>
              ))}
              <Btn label="Add all to deck" nav="vocab" variant="outline" accent={T.ink} fullWidth icon={Icon.plus()} style={{ marginTop:12 }}/>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArticleReaderPage() {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto' }}>
        <div style={{ maxWidth:780, margin:'0 auto', padding:'40px 40px 80px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11.5, color:T.ink4, marginBottom:18 }}>
            <span data-nav="library" style={{ cursor:'pointer' }}>Library</span>
            <span>›</span>
            <span style={{ color:T.ink, fontWeight:700 }}>Article</span>
          </div>

          <Chip label="B1 · 6 min · Spanish" accent={T.brand} bg={T.brandLight} style={{ fontSize:10.5, padding:'4px 10px', marginBottom:14 }}/>
          <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:1.1, color:T.ink, marginBottom:14 }}>El silencio de los pueblos abandonados</div>
          <div style={{ fontSize:15, color:T.ink3, lineHeight:1.6, marginBottom:24, fontStyle:'italic' }}>How three families are bringing a Pyrenean village back from the brink — one stone wall at a time.</div>

          <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:24, marginBottom:32, borderBottom:`1px solid ${T.hairline}` }}>
            <Avatar initials="EM" size={36} bg="#A06940"/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>Elena Marín</div>
              <div style={{ fontSize:11, color:T.ink4 }}>Mar 18, 2025 · El País Semanal</div>
            </div>
            <button style={{ padding:'7px 12px', fontSize:11, fontWeight:700, color:T.ink2, border:`1px solid ${T.border}`, borderRadius:8, background:T.card, display:'flex', alignItems:'center', gap:6 }}>{Icon.play({ width:11, height:11 })}Listen</button>
            <button style={{ padding:'7px 12px', fontSize:11, fontWeight:700, color:T.ink2, border:`1px solid ${T.border}`, borderRadius:8, background:T.card }}>Aa</button>
          </div>

          <div style={{ fontFamily:T.serif, fontSize:19, lineHeight:1.7, color:T.ink, marginBottom:20 }}>
            En lo alto del valle de Hecho, donde los <span style={{ background:'#FFF1A8', padding:'1px 3px', borderRadius:3, cursor:'pointer' }}>caminos de herradura</span> se confunden con los pastos, un puñado de familias ha decidido <span style={{ background:'#FFF1A8', padding:'1px 3px', borderRadius:3, cursor:'pointer' }}>devolver la vida</span> a un pueblo que llevaba cuarenta años en silencio.
          </div>
          <div style={{ fontSize:16, lineHeight:1.7, color:T.ink, marginBottom:20 }}>
            "Cuando llegamos en 2019, no había <span style={{ background:'#FFF1A8', padding:'1px 3px', borderRadius:3, cursor:'pointer' }}>tejados enteros</span>", recuerda Marta Iguácel, una de las primeras en mudarse. "Las casas estaban abiertas al cielo, las ventanas habían cedido. Tuvimos que aprender a poner piedra sobre piedra como lo hacían nuestros abuelos."
          </div>

          {/* Annotation popover */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:18, margin:'24px 0', boxShadow:T.shadow }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
              <div>
                <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink }}>devolver la vida</div>
                <div style={{ fontSize:11, color:T.ink4, marginTop:2 }}>verb phrase · "to bring back to life"</div>
              </div>
              <Btn label="Save to deck" accent={T.brand} icon={Icon.plus()} style={{ fontSize:11, padding:'6px 12px' }}/>
            </div>
            <div style={{ fontSize:13, color:T.ink2, lineHeight:1.5, paddingTop:10, borderTop:`1px solid ${T.hairline}` }}>Literally "to give back life." Common in articles about restoration, recovery, or revival of places, traditions, or relationships.</div>
          </div>

          <div style={{ fontSize:16, lineHeight:1.7, color:T.ink, marginBottom:20 }}>
            Hoy, cinco años después, el pueblo cuenta con once habitantes permanentes, un horno comunal y una pequeña escuela donde dos niños reciben clases de un maestro que viene del valle dos veces por semana.
          </div>

          {/* End-of-article actions */}
          <div style={{ marginTop:32, paddingTop:24, borderTop:`1px solid ${T.hairline}`, display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontSize:12, color:T.ink4 }}>You saved <b style={{ color:T.ink }}>3 words</b> from this article.</div>
              <div style={{ display:'flex', gap:8 }}>
                <Btn label="Practice these" nav="practice" variant="outline" accent={T.ink} icon={Icon.play()}/>
                <Btn label="Next article" nav="library" accent={T.brand} iconRight={Icon.arrow()}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { LessonDetailPage, ArticleReaderPage });
