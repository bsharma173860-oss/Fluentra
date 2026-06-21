// ── Mobile Monetization Flow ────────────────────────────────
// Bold native phone designs for the 6 monetization screens.
// Each is dramatic, full-bleed, and uses motion/scale phones do well.

const { useState: useMonStateM, useEffect: useMonEffectM } = React;

function useActiveLangM() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const t = langTheme(lang.code);
  const goodLuckByCode = { en:'Good luck', es:'Buena suerte', ja:'がんばって', fr:'Bonne chance', de:'Viel Erfolg', it:'In bocca al lupo', pt:'Boa sorte', ko:'화이팅', zh:'加油', ar:'حظاً موفقاً', ru:'Удачи', hi:'शुभकामनाएँ', tr:'Başarılar' };
  const unlockedByCode = { en:"You're in.", es:'Lo lograste.', ja:'達成！', fr:"C'est fait.", de:'Geschafft!', it:'Ce l\'hai fatta.', pt:'Você conseguiu!', ko:'해냈어요!', zh:'你做到了！', ar:'لقد نجحت!', ru:'Получилось!', hi:'आप कर गए!', tr:'Başardın!' };
  return { code, lang, ex, t, goodLuck: goodLuckByCode[code] || 'Good luck', unlocked: unlockedByCode[code] || "You're in." };
}

// Mini confetti for mobile (smaller, fewer pieces)
function MobileConfetti({ count = 35, colors }) {
  const palette = colors || ['#D97757','#E8B23F','#5B7B8A','#8E7AB5','#1A8F4E'];
  const pieces = Array.from({ length: count }).map((_, i) => ({
    id:i, x: Math.random()*100, delay: Math.random()*0.6,
    color: palette[i % palette.length], size: 5 + Math.random()*7,
    duration: 2.5 + Math.random()*1.5, drift: -15 + Math.random()*30,
  }));
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:1 }}>
      <style>{`@keyframes mobConf { 0%{transform:translate(0,-20px) rotate(0);opacity:1} 100%{transform:translate(var(--d),120vh) rotate(720deg);opacity:.7} }`}</style>
      {pieces.map(p => (
        <div key={p.id} style={{ position:'absolute', left:p.x+'%', top:-20, width:p.size, height:p.size*0.4, background:p.color, animation:`mobConf ${p.duration}s ${p.delay}s ease-in forwards`, ['--d']: p.drift+'vw' }}/>
      ))}
    </div>
  );
}

// ───────── Screen 1 mobile: Day 9 Unlock ─────────
// Full-bleed gradient, big number, single bold CTA.

function MUnlockDay9Page() {
  const nav = window.__nav || (() => {});
  const { lang, ex, t, unlocked } = useActiveLangM();
  const userName = (USER && USER.name) ? USER.name.split(' ')[0] : 'there';
  const [pickedTier, setPickedTier] = useMonStateM('pro');

  return (
    <MobileFrame statusBarStyle="light">
      <div style={{ position:'absolute', inset:0, background:`linear-gradient(165deg, ${t.brand} 0%, ${t.brand2 || t.brand} 55%, #1a0e0a 100%)`, zIndex:0 }}/>
      <MobileConfetti count={45} colors={['#fff', '#FFE7B5', t.brand2 || '#FFB58A', '#FFF8F0']}/>

      {/* Background giant 9 */}
      <div style={{ position:'absolute', right:-30, top:80, fontFamily:T.serif, fontSize:340, fontWeight:400, color:'rgba(255,255,255,.08)', lineHeight:.9, zIndex:1, letterSpacing:'-.05em' }}>9</div>

      <div style={{ position:'relative', zIndex:2, flex:1, display:'flex', flexDirection:'column', padding:'68px 24px 24px', color:'#fff' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:36 }}>
          <button onClick={() => nav('dashboard')} style={{ width:38, height:38, borderRadius:'50%', background:'rgba(255,255,255,.14)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', cursor:'pointer' }}>×</button>
          <button onClick={() => nav('dashboard')} style={{ fontSize:13, color:'rgba(255,255,255,.75)', cursor:'pointer' }}>Later</button>
        </div>

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', maxWidth:300 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'5px 12px', background:'rgba(255,255,255,.18)', borderRadius:99, fontSize:10.5, fontWeight:700, letterSpacing:'.16em', textTransform:'uppercase', alignSelf:'flex-start', marginBottom:18, backdropFilter:'blur(8px)' }}>
            <span>🔥</span> Day 9
          </div>
          <div style={{ fontFamily:T.serif, fontSize:56, lineHeight:.98, letterSpacing:'-.025em', marginBottom:14 }}>{unlocked}</div>
          <div style={{ fontSize:16, lineHeight:1.45, opacity:.92, marginBottom:30 }}>
            Your <strong>{ex.name}</strong> exam is unlocked, {userName}.
          </div>

          {/* Streak ring marker */}
          <div style={{ display:'flex', gap:5, marginBottom:38 }}>
            {Array.from({length:9}).map((_,i) => (
              <div key={i} style={{ flex:1, height:6, borderRadius:3, background: i===8 ? '#fff' : 'rgba(255,255,255,.5)', boxShadow: i===8 ? '0 0 0 3px rgba(255,255,255,.25)' : 'none' }}/>
            ))}
          </div>

          {/* Pricing toggle */}
          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
            <button onClick={() => setPickedTier('pro')} style={{ position:'relative', textAlign:'left', padding:'16px 18px', borderRadius:14, background: pickedTier==='pro' ? '#fff' : 'rgba(255,255,255,.1)', color: pickedTier==='pro' ? T.ink : '#fff', border: pickedTier==='pro' ? 'none' : '1px solid rgba(255,255,255,.25)', cursor:'pointer' }}>
              <div style={{ position:'absolute', top:-10, right:14, background:'#1A8F4E', color:'#fff', fontSize:9, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 9px', borderRadius:99 }}>Best value</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.7 }}>Pro</span>
                <span style={{ fontFamily:T.serif, fontSize:24 }}>$24<span style={{ fontSize:11, opacity:.6 }}>/mo</span></span>
              </div>
              <div style={{ fontSize:13, marginTop:4, opacity: pickedTier==='pro'?.85:.92 }}>Unlimited exams · all languages · cancel anytime</div>
            </button>
            <button onClick={() => setPickedTier('once')} style={{ textAlign:'left', padding:'14px 18px', borderRadius:14, background: pickedTier==='once' ? '#fff' : 'rgba(255,255,255,.1)', color: pickedTier==='once' ? T.ink : '#fff', border: pickedTier==='once' ? 'none' : '1px solid rgba(255,255,255,.25)', cursor:'pointer' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.7 }}>One time</span>
                <span style={{ fontFamily:T.serif, fontSize:24 }}>{ex.cost || '$5'}</span>
              </div>
              <div style={{ fontSize:13, marginTop:4, opacity: pickedTier==='once'?.85:.92 }}>Take this exam once · keep the report</div>
            </button>
          </div>
        </div>

        <button onClick={() => nav('exam_preview')} style={{ width:'100%', padding:'17px', borderRadius:14, background:'#fff', color:T.ink, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:'0 12px 30px rgba(0,0,0,.18)' }}>
          {pickedTier === 'pro' ? 'Start Pro & take exam' : `Continue · ${ex.cost || '$5'}`}
          <span>→</span>
        </button>
        <div style={{ textAlign:'center', fontSize:11, color:'rgba(255,255,255,.65)', marginTop:14 }}>1,247 unlocked this month · 84% chose Pro</div>
      </div>
    </MobileFrame>
  );
}

// ───────── Screen 2 mobile: Exam Preview ─────────
// Big predicted score hero, scrollable section list, sticky CTA at bottom

function MExamPreviewPage() {
  const nav = window.__nav || (() => {});
  const { lang, ex, t } = useActiveLangM();
  const colorMap = { listening:'#5B7B8A', reading:'#8E7AB5', writing:t.brand, speaking:'#E8B23F' };
  const sections = (ex.modules || []).map(m => ({ name:m.label, mins:parseInt(m.time)||30, qs:m.q, color:colorMap[m.color]||t.brand, isWriting: m.color==='writing' }));
  const totalMins = sections.reduce((s,x) => s+x.mins, 0);
  const totalH = Math.floor(totalMins/60), totalM = totalMins % 60;
  const totalQs = sections.reduce((s,x) => s+(x.qs||0), 0);
  const best = ex.bestScore;
  const target = (typeof best === 'number') ? Math.round(best * 1.05 * 10)/10 : best;

  return (
    <MobileFrame>
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
        <div style={{ padding:'24px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={() => nav('unlock_day9')} style={{ width:38, height:38, borderRadius:'50%', background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.ink2 }}>←</button>
          <span style={{ fontSize:11, fontWeight:700, color:t.brand, letterSpacing:'.16em', textTransform:'uppercase' }}>You unlocked</span>
          <div style={{ width:38 }}/>
        </div>

        {/* Hero score card */}
        <div style={{ padding:'24px 20px' }}>
          <div style={{ fontFamily:T.serif, fontSize:36, lineHeight:1.05, color:T.ink, letterSpacing:'-.015em', marginBottom:22 }}>{ex.name}<br/>Full Mock Exam</div>

          <div style={{ background:`linear-gradient(155deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, borderRadius:22, padding:'28px 24px', color:'#fff', position:'relative', overflow:'hidden', boxShadow:`0 18px 40px ${t.brand}40` }}>
            <div style={{ position:'absolute', right:-30, bottom:-30, width:140, height:140, borderRadius:'50%', background:'rgba(255,255,255,.1)' }}/>
            <div style={{ position:'absolute', right:10, top:-10, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85, marginBottom:8 }}>Predicted {ex.scoreLabel || 'score'}</div>
              <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
                <span style={{ fontFamily:T.serif, fontSize:64, lineHeight:1 }}>{best}</span>
                <span style={{ fontSize:20, opacity:.85 }}>– {target}</span>
                <span style={{ fontSize:13, opacity:.7 }}>{ex.scoreUnit || ''}</span>
              </div>
              <div style={{ height:6, background:'rgba(0,0,0,.2)', borderRadius:99, overflow:'hidden', marginTop:14 }}>
                <div style={{ height:'100%', width:'72%', background:'#fff', borderRadius:99 }}/>
              </div>
              <div style={{ fontSize:11.5, opacity:.85, marginTop:10 }}>Based on your last 12 sessions</div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ padding:'0 20px 20px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8 }}>
          {[
            { l:'Time', v: totalH ? `${totalH}h ${totalM}m` : `${totalM}m` },
            { l:'Sections', v:String(sections.length) },
            { l:'Questions', v:String(totalQs) },
          ].map((s,i) => (
            <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:11, padding:'12px 10px', textAlign:'center' }}>
              <div style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>{s.v}</div>
              <div style={{ fontSize:9.5, fontWeight:700, color:T.ink5, letterSpacing:'.1em', textTransform:'uppercase', marginTop:2 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Sections list */}
        <div style={{ padding:'4px 20px 20px' }}>
          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:12 }}>What's inside</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {sections.map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 14px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:s.color+'22', color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:15 }}>{i+1}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:T.ink, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
                  <div style={{ fontSize:11, color:T.ink5, marginTop:2 }}>{s.mins} min · {s.qs} {s.isWriting?'tasks':'qs'}</div>
                </div>
                <div style={{ fontSize:13, color:T.ink5 }}>›</div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div style={{ padding:'0 20px 24px' }}>
          <div style={{ background:t.brandLight || T.brandLight, border:`1px solid ${t.brand}30`, borderRadius:14, padding:'18px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <div style={{ display:'flex' }}>
                {['#D97757','#5B7B8A','#1A8F4E','#E8B23F'].map((c,i) => (
                  <div key={i} style={{ width:22, height:22, borderRadius:99, background:c, border:'2px solid #fff', marginLeft:i?-7:0 }}/>
                ))}
              </div>
              <span style={{ fontSize:12, color:T.ink2, fontWeight:600 }}>1,247 took this this month</span>
            </div>
            <div style={{ fontSize:12.5, color:T.ink3, lineHeight:1.4 }}>Average: <strong style={{ color:T.ink }}>{best}{ex.scoreUnit || ''}</strong> · 92% finish on first try</div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div style={{ padding:'14px 20px 28px', background:'#fff', borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
        <button onClick={() => nav('pre_exam_ready')} style={{ width:'100%', padding:'15px', borderRadius:13, background:`linear-gradient(135deg, ${t.brand}, ${t.brand2 || t.brand})`, color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, boxShadow:`0 8px 20px ${t.brand}40` }}>
          Start exam now <span>→</span>
        </button>
      </div>
    </MobileFrame>
  );
}

// ───────── Screen 3 mobile: Streak Countdown (single popup view) ─────────
// Show day 9 variant (the live "ready" state) — full screen modal style

function MStreakCountdownPage() {
  const nav = window.__nav || (() => {});
  const { ex, t } = useActiveLangM();
  const [day, setDay] = useMonStateM(9);

  const variants = {
    7: { eyebrow:'In 2 days', headline:'Your exam unlocks soon', body:`Stay consistent for 2 more days to unlock your ${ex.short} Full Mock Exam.`, cta:'Practice 15 min', icon:'🎯', glow:'#5B7B8A' },
    8: { eyebrow:'Tomorrow!', headline:"Don't break it now", body:`One more day. You're so close — your ${ex.short} exam unlocks at midnight.`, cta:'Quick session', icon:'🔥', glow:t.brand },
    9: { eyebrow:'Today', headline:'Your exam is ready 🎉', body:`9-day streak complete. Take your ${ex.name} Full Mock Exam any time.`, cta:'Open exam', icon:'🎓', glow:'#1A8F4E' },
  };
  const v = variants[day];

  return (
    <MobileFrame>
      <div style={{ position:'absolute', inset:0, background:`radial-gradient(circle at 50% 30%, ${v.glow}26, transparent 60%), ${T.bg}`, zIndex:0 }}/>

      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex', flexDirection:'column', padding:'56px 20px 20px' }}>
        {/* Day toggle */}
        <div style={{ display:'flex', gap:6, padding:4, background:T.bg2, borderRadius:99, marginBottom:36, alignSelf:'center' }}>
          {[7,8,9].map(d => (
            <button key={d} onClick={() => setDay(d)} style={{ padding:'8px 16px', borderRadius:99, background: d===day ? '#fff' : 'transparent', color: d===day ? T.ink : T.ink5, fontSize:11, fontWeight:700, cursor:'pointer', boxShadow: d===day ? '0 2px 6px rgba(0,0,0,.06)' : 'none' }}>
              Day {d}
            </button>
          ))}
        </div>

        {/* Big notification card */}
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ background:'#fff', borderRadius:24, padding:'32px 26px', boxShadow:'0 24px 60px rgba(0,0,0,.15), 0 0 0 1px rgba(0,0,0,.04)', border: day===9 ? `2px solid ${v.glow}` : 'none', position:'relative', maxWidth:340, width:'100%' }}>
            {day === 9 && <div style={{ position:'absolute', top:-1, left:-1, right:-1, height:80, background:`linear-gradient(180deg, ${v.glow}26, transparent)`, borderRadius:'24px 24px 0 0' }}/>}
            <div style={{ position:'relative' }}>
              <div style={{ width:64, height:64, borderRadius:18, background:v.glow+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, marginBottom:18 }}>{v.icon}</div>
              <div style={{ fontSize:11, fontWeight:700, color:v.glow, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>{v.eyebrow}</div>
              <div style={{ fontFamily:T.serif, fontSize:28, color:T.ink, lineHeight:1.1, marginBottom:12, letterSpacing:'-.01em' }}>{v.headline}</div>
              <div style={{ fontSize:14, color:T.ink3, lineHeight:1.45, marginBottom:22 }}>{v.body}</div>
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:10.5, color:T.ink4, fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase' }}>Streak</span>
                  <span style={{ fontSize:13, fontWeight:700, color:v.glow }}>{day} / 9</span>
                </div>
                <div style={{ display:'flex', gap:4 }}>
                  {Array.from({length:9}).map((_,i) => (
                    <div key={i} style={{ flex:1, height:6, borderRadius:3, background: i<day ? v.glow : T.bg2 }}/>
                  ))}
                </div>
              </div>
              <button onClick={() => nav(day===9 ? 'm_unlock_day9' : 'm_practice')} style={{ width:'100%', padding:'14px', background: day===9 ? v.glow : T.ink, color:'#fff', borderRadius:11, fontSize:14, fontWeight:700, cursor:'pointer' }}>{v.cta} →</button>
            </div>
          </div>
        </div>

        <div style={{ textAlign:'center', fontSize:11, color:T.ink5, lineHeight:1.5 }}>Push notification + in-app modal · day 9 also fires email</div>
      </div>
    </MobileFrame>
  );
}

// ───────── Screen 4 mobile: Pre-exam Ready ─────────

function MPreExamReadyPage() {
  const nav = window.__nav || (() => {});
  const { ex, t, goodLuck } = useActiveLangM();
  const [agreed, setAgreed] = useMonStateM(false);
  const userName = (USER && USER.name) ? USER.name.split(' ')[0] : 'there';

  const totalMins = (ex.modules || []).reduce((s,m) => s + (parseInt(m.time)||0), 0);
  const totalH = Math.floor(totalMins/60), totalM = totalMins % 60;
  const totalLabel = totalH ? `${totalH}h ${totalM}m` : `${totalM}m`;
  const hasListening = (ex.modules || []).some(m => m.color === 'listening');

  return (
    <MobileFrame>
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
        <div style={{ padding:'24px 20px' }}>
          <button onClick={() => nav('dashboard')} style={{ width:38, height:38, borderRadius:'50%', background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.ink2, marginBottom:18 }}>←</button>

          <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'5px 11px', background:'#1A8F4E14', color:'#1A8F4E', borderRadius:99, fontSize:10, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:18 }}>
            ✓ Payment confirmed
          </div>

          <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:1, color:T.ink, letterSpacing:'-.025em', marginBottom:10 }}>{goodLuck},<br/>{userName}.</div>
          <div style={{ fontSize:14, color:T.ink3, lineHeight:1.5, marginBottom:24 }}>
            You're about to start the {ex.name} Full Mock Exam. Once you tap Start, the timer begins — no pauses.
          </div>

          {/* Time hero */}
          <div style={{ background:`linear-gradient(135deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, color:'#fff', borderRadius:18, padding:'22px 22px', marginBottom:18, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', right:-30, bottom:-20, fontSize:140, opacity:.1, fontFamily:T.serif, lineHeight:1 }}>⏱</div>
            <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85, marginBottom:6 }}>Total time</div>
            <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:1 }}>{totalLabel}</div>
            <div style={{ fontSize:12, opacity:.85, marginTop:8 }}>{(ex.modules || []).length} sections · self-paced flow</div>
          </div>

          {/* Checklist */}
          <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:16, padding:'18px 18px', marginBottom:16 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:14 }}>Before you begin</div>
            {[
              { ic:'⏱', title:'No pauses', body:'Real exam conditions' },
              { ic:'🎧', title:'Headphones ready', body: hasListening ? 'For the listening section' : 'Optional but recommended' },
              { ic:'🔕', title:'Phone silenced', body:'Notifications off' },
              { ic:'⚡', title:'AI feedback in 60s', body:`Detailed ${ex.scoreLabel || 'score'} report` },
            ].map((row,i) => (
              <div key={i} style={{ display:'flex', gap:12, alignItems:'center', padding:'10px 0', borderBottom: i<3 ? `1px solid ${T.hairline}` : 'none' }}>
                <div style={{ width:34, height:34, borderRadius:9, background:t.brandLight || T.brandLight, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>{row.ic}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:T.ink }}>{row.title}</div>
                  <div style={{ fontSize:12, color:T.ink4, marginTop:1 }}>{row.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Agreement */}
          <button onClick={() => setAgreed(!agreed)} style={{ display:'flex', alignItems:'center', gap:11, width:'100%', padding:'14px 16px', background:T.card, border:`1.5px solid ${agreed ? t.brand : T.border}`, borderRadius:12, marginBottom:60, cursor:'pointer', textAlign:'left' }}>
            <div style={{ width:22, height:22, borderRadius:6, background: agreed ? t.brand : T.bg2, border: agreed ? 'none' : `1.5px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#fff', fontSize:13, fontWeight:700 }}>{agreed && '✓'}</div>
            <span style={{ fontSize:13, color:T.ink2, lineHeight:1.4 }}>I'm in a quiet place and have {totalH+1}+ hours uninterrupted.</span>
          </button>
        </div>
      </div>

      {/* Sticky bottom action */}
      <div style={{ padding:'14px 20px 28px', background:'#fff', borderTop:`1px solid ${T.border}`, flexShrink:0, display:'flex', gap:10 }}>
        <button onClick={() => nav('dashboard')} style={{ padding:'15px 20px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:12, fontSize:13, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Save</button>
        <button disabled={!agreed} onClick={() => nav('exam_runner')} style={{ flex:1, padding:'15px 20px', background: agreed ? `linear-gradient(135deg, ${t.brand}, ${t.brand2 || t.brand})` : T.bg2, color: agreed ? '#fff' : T.ink5, borderRadius:12, fontSize:14, fontWeight:700, cursor: agreed ? 'pointer' : 'not-allowed', boxShadow: agreed ? `0 8px 20px ${t.brand}40` : 'none', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          Start exam {agreed && <span>→</span>}
        </button>
      </div>
    </MobileFrame>
  );
}

// ───────── Screen 5 mobile: Post-exam Upgrade ─────────

function MPostExamUpsellPage() {
  const nav = window.__nav || (() => {});
  const { ex, t } = useActiveLangM();
  const best = ex.bestScore;
  const target = (typeof best === 'number') ? Math.round((best * 1.15) * 10) / 10 : best;

  const skillScores = (ex.modules || []).slice(0,4).map((m,i) => {
    const variation = [0.05, 0, -0.08, 0][i] || 0;
    const score = (typeof best === 'number') ? Math.round((best * (1+variation)) * 10) / 10 : best;
    return { name: m.label.split(' ')[0], score, color: ['#5B7B8A','#8E7AB5','#D97757','#E8B23F'][i] };
  });

  return (
    <MobileFrame>
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
        <div style={{ padding:'24px 20px 20px' }}>
          <button onClick={() => nav('dashboard')} style={{ width:38, height:38, borderRadius:'50%', background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.ink2, marginBottom:24 }}>×</button>

          {/* Score reveal — dramatic centered */}
          <div style={{ textAlign:'center', marginBottom:30 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>Your {ex.scoreLabel || 'score'}</div>
            <div style={{ display:'inline-block', position:'relative' }}>
              <div style={{ position:'absolute', inset:-30, background:`radial-gradient(circle, ${t.brand}26, transparent 70%)`, borderRadius:'50%' }}/>
              <div style={{ position:'relative', fontFamily:T.serif, fontSize:120, lineHeight:1, color:t.brand, letterSpacing:'-.03em', fontWeight:400 }}>{best}</div>
            </div>
            <div style={{ fontSize:13, color:T.ink3, marginTop:8 }}>{ex.name}{ex.scoreUnit ? ` · ${ex.scoreUnit}` : ''}</div>
          </div>

          {/* Skill grid */}
          <div style={{ display:'grid', gridTemplateColumns: skillScores.length === 3 ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap:8, marginBottom:24 }}>
            {skillScores.map((s,i) => (
              <div key={i} style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:12, padding:'12px 12px', textAlign:'center' }}>
                <div style={{ fontFamily:T.serif, fontSize:22, color:s.color }}>{s.score}</div>
                <div style={{ fontSize:10, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginTop:2 }}>{s.name}</div>
              </div>
            ))}
          </div>

          {/* Pro upsell hero */}
          <div style={{ background:`linear-gradient(155deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, borderRadius:20, padding:'26px 22px', color:'#fff', position:'relative', overflow:'hidden', marginBottom:20, boxShadow:`0 14px 30px ${t.brand}50` }}>
            <div style={{ position:'absolute', right:-50, top:-50, width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,.08)' }}/>
            <div style={{ position:'absolute', right:-20, bottom:-30, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,.06)' }}/>
            <div style={{ position:'relative' }}>
              <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', opacity:.85, marginBottom:10 }}>Want to improve?</div>
              <div style={{ fontFamily:T.serif, fontSize:30, lineHeight:1.1, marginBottom:14, letterSpacing:'-.015em' }}>Pro users average <strong>{target}</strong> after 30 days.</div>
              <div style={{ fontSize:13, lineHeight:1.5, opacity:.92, marginBottom:18 }}>Unlimited mock exams, AI grading, adaptive practice on your weak skills.</div>
              <button onClick={() => nav('pricing')} style={{ width:'100%', padding:'14px', background:'#fff', color:t.brand, borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                Start Pro · $24/mo<span>→</span>
              </button>
              <div style={{ fontSize:11, opacity:.85, marginTop:10, textAlign:'center' }}>7-day money back · cancel anytime</div>
            </div>
          </div>

          {/* Improvement chart compact */}
          <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:14, padding:'18px', marginBottom:18 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:14 }}>How users improve</div>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {(() => {
                const max = (typeof ex.scoreUnit === 'string') ? (parseInt(ex.scoreUnit.replace('/','')) || 9) : 9;
                const target90 = (typeof best === 'number') ? Math.round((best*1.23)*10)/10 : best;
                const rows = [
                  { l:'Free · 30d', from:best, to: typeof best==='number' ? Math.round((best*1.03)*10)/10 : best, color:'#5B7B8A' },
                  { l:'Pro · 30d',  from:best, to:target,   color:'#1A8F4E', highlight:true },
                  { l:'Pro · 90d',  from:best, to:target90, color:t.brand,   highlight:true },
                ];
                return rows.map((row,i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:60, fontSize:11, color: row.highlight ? T.ink : T.ink3, fontWeight: row.highlight ? 600 : 500 }}>{row.l}</div>
                    <div style={{ flex:1, position:'relative', height:18, background:T.bg2, borderRadius:5 }}>
                      <div style={{ position:'absolute', left: ((row.from/max)*100)+'%', right: (100 - (row.to/max)*100)+'%', top:0, bottom:0, background:row.color, borderRadius:5 }}/>
                      <div style={{ position:'absolute', left: ((row.from/max)*100)+'%', top:-3, bottom:-3, width:2, background:T.ink, borderRadius:1 }}/>
                    </div>
                    <div style={{ width:40, fontSize:11, fontWeight:700, color: row.highlight ? row.color : T.ink4, textAlign:'right' }}>{row.to}</div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <button onClick={() => nav('progress')} style={{ width:'100%', padding:'12px', background:'transparent', fontSize:13, color:T.ink4, cursor:'pointer' }}>See full report without upgrading →</button>
        </div>
      </div>
    </MobileFrame>
  );
}

// ───────── Screen 6 mobile: Milestones Reel ─────────

function MMilestonesReelPage() {
  const nav = window.__nav || (() => {});
  const { ex, t } = useActiveLangM();

  const milestones = [
    { day:3,  status:'unlocked', title:'Practice exam', body:'Short, low-stakes warm-up.', reward:'Free', color:'#5B7B8A', icon:'📝' },
    { day:9,  status:'unlocked', title:`${ex.short} Mock Exam`, body:'The real thing. AI-graded.', reward:`${ex.cost || '$5'} · Pro`, color:t.brand, icon:'🎓', highlight:true },
    { day:30, status:'locked',   title:'Monthly retake', body:'Fresh exam every 30 days.', reward:'Pro only', color:'#8E7AB5', icon:'🏆' },
    { day:90, status:'locked',   title:'Elite badge', body:'<4% reach this milestone.', reward:'Permanent', color:'#E8B23F', icon:'⭐' },
  ];

  return (
    <MobileFrame>
      <div style={{ flex:1, overflowY:'auto', overflowX:'hidden' }}>
        <div style={{ padding:'24px 20px' }}>
          <button onClick={() => nav('dashboard')} style={{ width:38, height:38, borderRadius:'50%', background:T.bg2, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:T.ink2, marginBottom:18 }}>←</button>

          <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:8 }}>Streak rewards</div>
          <div style={{ fontFamily:T.serif, fontSize:32, lineHeight:1.05, color:T.ink, letterSpacing:'-.02em', marginBottom:8 }}>Every milestone<br/>unlocks something.</div>
          <div style={{ fontSize:13, color:T.ink3, lineHeight:1.5, marginBottom:24 }}>Cards surface as popups on the day they trigger.</div>

          {/* Vertical timeline */}
          <div style={{ position:'relative', paddingLeft:28 }}>
            <div style={{ position:'absolute', left:11, top:30, bottom:30, width:2, background:T.border }}/>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {milestones.map((m,i) => (
                <div key={i} style={{ position:'relative' }}>
                  <div style={{ position:'absolute', left:-28, top:18, width:24, height:24, borderRadius:99, background: m.status==='unlocked' ? m.color : T.bg2, border:`3px solid ${m.status==='unlocked' ? m.color : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:10 }}>
                    {m.status==='unlocked' && '✓'}
                  </div>
                  <div style={{ background:'#fff', border: m.highlight ? `2px solid ${m.color}` : `1px solid ${T.border}`, borderRadius:14, padding:'14px 14px', boxShadow: m.highlight ? `0 8px 20px ${m.color}26` : 'none', opacity: m.status==='locked' ? 0.65 : 1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                      <div style={{ width:42, height:42, borderRadius:11, background:m.color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{m.icon}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:2 }}>
                          <span style={{ fontSize:9.5, fontWeight:700, color:m.color, letterSpacing:'.12em', textTransform:'uppercase' }}>Day {m.day}</span>
                          <span style={{ fontSize:9, fontWeight:700, color: m.status==='unlocked' ? '#1A8F4E' : T.ink5, background: m.status==='unlocked' ? '#1A8F4E14' : T.bg2, padding:'2px 6px', borderRadius:4, letterSpacing:'.06em', textTransform:'uppercase' }}>{m.status==='unlocked' ? 'Unlocked' : 'Locked'}</span>
                        </div>
                        <div style={{ fontFamily:T.serif, fontSize:16, color:T.ink, lineHeight:1.15 }}>{m.title}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:12, color:T.ink3, lineHeight:1.45, marginBottom:8 }}>{m.body}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontSize:11, fontWeight:700, color:m.color }}>{m.reward}</span>
                      {m.status==='unlocked' && m.day===9 && (
                        <button onClick={() => nav('unlock_day9')} style={{ padding:'6px 13px', background:m.color, color:'#fff', borderRadius:7, fontSize:11, fontWeight:700, cursor:'pointer' }}>Open →</button>
                      )}
                      {m.status==='unlocked' && m.day===3 && (
                        <button onClick={() => nav('practice')} style={{ padding:'6px 13px', background:T.bg2, color:T.ink2, borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}` }}>Take it →</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop:22, padding:'14px 16px', background:t.brandLight || T.brandLight, borderRadius:12, fontSize:11.5, color:T.ink2, lineHeight:1.5, textAlign:'center' }}>
            <strong style={{ color:t.brand, fontFamily:T.serif, fontSize:14 }}>96%</strong> who reach Day 9 take the exam in 48h
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}

Object.assign(window, {
  MUnlockDay9Page, MExamPreviewPage, MStreakCountdownPage,
  MPreExamReadyPage, MPostExamUpsellPage, MMilestonesReelPage,
});
