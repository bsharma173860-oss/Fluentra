// ── Mobile · v5 redesigns · Batch 5 ───────────────────────────────
// Exam Unlock · Streak Calendar · Day 9 Unlock · Exam Preview · Streak Countdown

const useStV5B5 = React.useState;
const V5b5Pre = ({ eyebrow, title, lede, c }) => (
  <div style={{ padding:'4px 6px 14px' }}>
    {eyebrow && <div style={{ fontSize:10.5, fontWeight:700, color:c||T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{eyebrow}</div>}
    <div style={{ fontFamily:T.serif, fontSize:30, color:T.ink, lineHeight:1.02, letterSpacing:'-.02em' }}>{title}</div>
    {lede && <div style={{ fontSize:13, color:T.ink3, marginTop:8, lineHeight:1.55 }}>{lede}</div>}
  </div>
);
const V5b5Lbl = (text) => (
  <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 6px', marginBottom:8 }}>{text}</div>
);
const V5b5Dot = () => (
  <div style={{ position:'absolute', inset:0, display:'grid', gridTemplateColumns:'repeat(14,1fr)', gap:9, opacity:.05, pointerEvents:'none' }}>
    {Array.from({length:84}).map((_,i)=><div key={i} style={{ width:3, height:3, borderRadius:1.5, background:'#fff' }}/>)}
  </div>
);

// EXAM UNLOCK ─── full-page paywall
function MExamUnlockPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back title="Unlock the exam"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:T.ink, borderRadius:18, padding:'32px 22px', color:'#fff', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:14, marginTop:6 }}>
          <V5b5Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ width:84, height:84, borderRadius:42, background:`radial-gradient(circle, ${T.brand}80 0%, ${T.brand}30 60%, transparent 80%)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', border:`1.5px solid ${T.brand}`, boxShadow:`0 12px 32px ${T.brand}55` }}>
              <span style={{ fontSize:34 }}>🔒</span>
            </div>
            <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.18em', marginBottom:9 }}>UNLOCK · DELE B2</div>
            <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:9 }}>Take the real exam.</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.75)', lineHeight:1.55, padding:'0 8px' }}>£5 unlocks one full official-format exam, AI-graded with band scores you can show employers.</div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:14 }}>
          {[{ic:'lock', l:'Real format', s:'Same as £190 exam'},{ic:'check', l:'AI graded', s:'90s turnaround'},{ic:'star', l:'Cert ready', s:'Band 1–9 scores'},{ic:'spark', l:'Free retake', s:'If score drops'}].map((b, i) => (
            <div key={i} style={{ background:T.card, border:`1px solid ${T.hairline}`, borderRadius:12, padding:'12px 11px', boxShadow:MT.shadowSm }}>
              <div style={{ width:28, height:28, borderRadius:8, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:7 }}>{Icon[b.ic] ? Icon[b.ic]({width:12,height:12}) : '★'}</div>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{b.l}</div>
              <div style={{ fontSize:10, color:T.ink4, marginTop:2 }}>{b.s}</div>
            </div>
          ))}
        </div>

        <button onClick={()=>{ window.__checkoutItem='exam_official'; nav('checkout'); }} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Unlock for £5</button>
        <button onClick={()=>nav('exams')} style={{ width:'100%', padding:'12px', marginTop:9, fontSize:12, fontWeight:700, color:T.ink3, background:'transparent', border:'none' }}>Take a free mock instead</button>
      </MobileBody>
    </>
  );
}

// STREAK CALENDAR
function MStreakCalendarPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  const _langs = (typeof userLanguages === 'function') ? userLanguages() : [];
  const streak = _langs.length ? Math.max.apply(null, _langs.map(function (l) { return l.streak || 0; })) : 0;
  const _now = new Date();
  const _y = _now.getFullYear(), _m = _now.getMonth();
  const _firstDow = (new Date(_y, _m, 1).getDay() + 6) % 7;
  const _dim = new Date(_y, _m + 1, 0).getDate();
  const _today = _now.getDate();
  const days = [];
  for (var _i = 0; _i < _firstDow; _i++) days.push({ d: 0, on: false });
  for (var _dn = 1; _dn <= _dim; _dn++) days.push({ d: _dn, on: (_dn <= _today && _dn > _today - streak), today: _dn === _today });
  const _sessions = ((typeof window !== 'undefined' && window.__results) || []).length;
  return (
    <>
      <MobileHeader back title="Streak"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:T.brandGrad, borderRadius:18, padding:'24px 18px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14 }}>
          <V5b5Dot/>
          <div style={{ position:'relative', textAlign:'center' }}>
            <div style={{ fontSize:64, marginBottom:6 }}>🔥</div>
            <div style={{ fontFamily:T.serif, fontSize:64, lineHeight:.9, letterSpacing:'-.04em', fontWeight:600 }}>{streak}</div>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.85)', letterSpacing:'.18em', marginTop:9 }}>DAY STREAK</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginTop:8 }}>{streak > 0 ? 'Keep it going — practice today to extend it.' : 'Practice today to start a streak.'}</div>
          </div>
        </div>

        {V5b5Lbl('THIS MONTH')}
        <MCard style={{ padding:14, marginBottom:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5, marginBottom:9 }}>
            {['M','T','W','T','F','S','S'].map((d, i) => <div key={i} style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.06em', textAlign:'center' }}>{d}</div>)}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:5 }}>
            {days.map((dy, i) => (
              <div key={i} style={{ aspectRatio:'1', borderRadius:8, background: dy.d > 0 ? (dy.on ? T.brand : T.bg2) : 'transparent', color: dy.on ? '#fff' : T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight: dy.on ? 700 : 500, border: dy.today ? `2px solid ${T.ink}` : 'none' }}>
                {dy.d > 0 ? dy.d : ''}
              </div>
            ))}
          </div>
        </MCard>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom:14 }}>
          {[{l:'CURRENT',v:streak+'d'},{l:'LANGUAGES',v:_langs.length},{l:'SESSIONS',v:_sessions}].map(s => (
            <MCard key={s.l} style={{ padding:'12px 10px', textAlign:'center' }}><div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>{s.v}</div><div style={{ fontSize:9, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginTop:5 }}>{s.l}</div></MCard>
          ))}
        </div>

        <div style={{ padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink, lineHeight:1.5 }}>"Streak shields kick in after 30 days — miss one day a month and you won't lose your streak."</div>
        </div>
      </MobileBody>
    </>
  );
}

// DAY 9 UNLOCK
function MUnlockDay9PageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back title="Day 9 unlocked"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:T.ink, borderRadius:18, padding:'32px 22px', color:'#fff', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:14, marginTop:6 }}>
          <V5b5Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:74, marginBottom:6, animation:'v5b5pop 1.2s cubic-bezier(.2,1,.4,1)' }}>🎉</div>
            <style>{`@keyframes v5b5pop{0%{transform:scale(.4);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}`}</style>
            <div style={{ fontSize:10.5, fontWeight:800, color:T.brand, letterSpacing:'.18em', marginBottom:9 }}>YOU DID IT · 9 DAYS</div>
            <div style={{ fontFamily:T.serif, fontSize:34, lineHeight:1.02, letterSpacing:'-.02em', marginBottom:11 }}>Exam access unlocked.</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,.75)', lineHeight:1.55, padding:'0 8px' }}>You showed up 9 days in a row. The certified exam is now available — and your streak says you're ready.</div>
          </div>
        </div>

        {V5b5Lbl("WHAT'S NEW")}
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {[
            { ic:'star',  l:'Certified DELE B2 exam', s:'Take it for £5 · band-scored' },
            { ic:'spark', l:'Speaking with AI tutor',  s:'Sofía · 30-min sessions' },
            { ic:'book',  l:'Advanced reading library',s:'12 long-form articles unlocked' },
          ].map((it, i, all) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:34, height:34, borderRadius:9, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[it.ic] ? Icon[it.ic]({width:13,height:13}) : '★'}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{it.l}</div>
                <div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{it.s}</div>
              </div>
            </div>
          ))}
        </MCard>

        <button onClick={()=>nav('exam_preview')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Preview the exam</button>
        <button onClick={()=>nav('dashboard')} style={{ width:'100%', padding:'12px', marginTop:9, fontSize:12, fontWeight:700, color:T.ink3, background:'transparent', border:'none' }}>Maybe later</button>
      </MobileBody>
    </>
  );
}

// EXAM PREVIEW (build desire pre-paywall)
function MExamPreviewPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back title="DELE B2 preview"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <V5b5Pre eyebrow="OFFICIAL FORMAT · UNLOCKED FOR YOU" title="A real DELE B2 exam, for £5." lede="Same structure as the £190 official test — without the cost. Take it on your schedule, get AI-graded results in 90 seconds."/>

        <div style={{ background:T.brandGrad, borderRadius:18, padding:'20px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:14 }}>
          <V5b5Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:13 }}>
              <div>
                <div style={{ fontSize:10.5, fontWeight:800, color:'rgba(255,255,255,.7)', letterSpacing:'.14em' }}>YOUR EXAM</div>
                <div style={{ fontFamily:T.serif, fontSize:24, lineHeight:1.05, letterSpacing:'-.02em', marginTop:4 }}>DELE B2 · Spanish</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1, letterSpacing:'-.02em' }}>£5</div>
                <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,.65)', letterSpacing:'.1em', marginTop:3 }}>OFFICIAL: £190</div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:7 }}>
              {['Listening · 40m','Reading · 70m','Writing · 80m','Speaking · 15m'].map((s, i) => (
                <div key={i} style={{ padding:'7px 10px', borderRadius:8, background:'rgba(255,255,255,.12)', backdropFilter:'blur(8px)', fontSize:10.5, fontWeight:700 }}>{s}</div>
              ))}
            </div>
          </div>
        </div>

        {V5b5Lbl('WHAT YOU GET')}
        <MCard style={{ padding:0, overflow:'hidden', marginBottom:14 }}>
          {[
            { l:'Band-mapped score',  s:'1–9 scoring same as the official test' },
            { l:'Full written feedback',s:'Sentence-level corrections + reasoning' },
            { l:'Speaking analysis',  s:'Pronunciation, fluency, range scored' },
            { l:'Certificate of attempt', s:'Shareable PDF with band scores' },
          ].map((it, i, all) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:11, padding:'12px 14px', borderTop: i ? `1px solid ${T.hairline}` : 'none' }}>
              <div style={{ width:22, height:22, borderRadius:11, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:11 }}>✓</div>
              <div style={{ flex:1, minWidth:0 }}><div style={{ fontSize:12.5, fontWeight:700, color:T.ink }}>{it.l}</div><div style={{ fontSize:10.5, color:T.ink4, marginTop:2 }}>{it.s}</div></div>
            </div>
          ))}
        </MCard>

        <div style={{ padding:'12px 14px', background:T.brandLight, border:`1px dashed ${T.brand}55`, borderRadius:11, marginBottom:14 }}>
          <div style={{ fontFamily:T.serif, fontStyle:'italic', fontSize:12, color:T.ink, lineHeight:1.5 }}>"Reach a 9-day streak and the real exam unlocks — practice a little every day."</div>
        </div>

        <button onClick={()=>{ window.__checkoutItem='exam_official'; nav('checkout'); }} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Unlock exam · £5</button>
      </MobileBody>
    </>
  );
}

// STREAK COUNTDOWN — popup-style
function MStreakCountdownPageV5() {
  const nav = (id) => window.__nav && window.__nav(id);
  return (
    <>
      <MobileHeader back title="Streak in danger"/>
      <MobileBody padding={[0,16,30]} tabBarPad={false}>
        <div style={{ background:'linear-gradient(135deg,#D63E3E 0%,#A32626 100%)', borderRadius:18, padding:'28px 22px', color:'#fff', textAlign:'center', position:'relative', overflow:'hidden', marginBottom:14, marginTop:6 }}>
          <V5b5Dot/>
          <div style={{ position:'relative' }}>
            <div style={{ fontSize:54, marginBottom:6 }}>⚠️</div>
            <div style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,.8)', letterSpacing:'.18em', marginBottom:9 }}>STREAK · ENDS IN</div>
            <div style={{ fontFamily:T.serif, fontSize:48, lineHeight:.95, letterSpacing:'-.03em', marginBottom:12 }}>3h 22m</div>
            <div style={{ fontSize:13.5, color:'rgba(255,255,255,.85)', lineHeight:1.55, padding:'0 8px' }}>Day 8 of 9. Lose today and your streak resets — you'll need to start over to unlock the certified exam.</div>
          </div>
        </div>

        <MCard style={{ padding:14, marginBottom:14 }}>
          <div style={{ fontSize:9.5, fontWeight:800, color:T.ink4, letterSpacing:'.12em', marginBottom:9 }}>QUICK FIXES · 5 MINUTES OR LESS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {[
              { ic:'pen',  l:'Vocab review',     s:'10 cards · 3 min' },
              { ic:'head', l:'Daily listening',  s:'1 clip · 4 min' },
              { ic:'spark',l:'Speaking warm-up', s:'3 prompts · 5 min' },
            ].map((q, i) => (
              <button key={i} onClick={()=>nav(q.ic === 'mic' ? 'speaking' : q.ic === 'head' ? 'listening' : 'vocabulary')} style={{ display:'flex', alignItems:'center', gap:11, padding:'11px 13px', borderRadius:11, background:T.bg2, border:`1px solid ${T.hairline}`, textAlign:'left' }}>
                <div style={{ width:30, height:30, borderRadius:8, background:T.brand, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>{Icon[q.ic] ? Icon[q.ic]({width:12,height:12}) : '★'}</div>
                <div style={{ flex:1 }}><div style={{ fontSize:12, fontWeight:700, color:T.ink }}>{q.l}</div><div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{q.s}</div></div>
                <span style={{ color:T.ink5 }}>›</span>
              </button>
            ))}
          </div>
        </MCard>

        <button onClick={()=>nav('practice')} style={{ width:'100%', padding:'14px', borderRadius:13, background:T.brandGrad, color:'#fff', fontSize:13.5, fontWeight:700, boxShadow:`0 6px 16px ${T.brand}40` }}>Save my streak · 5 min</button>
      </MobileBody>
    </>
  );
}

Object.assign(window, {
  MExamUnlockPageV5, MStreakCalendarPageV5, MUnlockDay9PageV5, MExamPreviewPageV5, MStreakCountdownPageV5,
});
