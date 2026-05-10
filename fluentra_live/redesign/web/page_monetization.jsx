// ── Monetization flow — fully language-aware ────────────────────────────────────────
// 6 screens for the Day 9 unlock → exam → upgrade journey.
// Reads from examFor(lang.code) so it adapts to IELTS / Goethe / TOPIK / JLPT / DELE / HSK / etc.

const { useState: useStateMon, useEffect: useEffectMon } = React;

// Per-language helper — returns the active language + exam config + theme
function useActiveLang() {
  const code = window.__langCode || 'en';
  const lang = LANGUAGES.find(l => l.code === code) || LANGUAGES[0];
  const ex = examFor(lang.code);
  const pack = (typeof langPack === 'function') ? langPack(lang.code) : null;
  const t = langTheme(lang.code);
  // Localized "Good luck" greeting per language
  const goodLuckByCode = {
    en:'Good luck', es:'Buena suerte', ja:'がんばって', fr:'Bonne chance',
    de:'Viel Erfolg', it:'In bocca al lupo', pt:'Boa sorte', ko:'화이팅',
    zh:'加油', ar:'حظاً موفقاً', ru:'Удачи', hi:'शुभकामनाएँ', tr:'Başarılar',
  };
  // Localized "Your exam is unlocked"
  const unlockedByCode = {
    en:'Your exam is\nunlocked',
    es:'Tu examen está\ndesbloqueado',
    ja:'試験が\n解放されました',
    fr:'Ton examen est\ndébloqué',
    de:'Deine Prüfung\nist freigeschaltet',
    it:'Il tuo esame è\nsbloccato',
    pt:'Seu exame está\ndesbloqueado',
    ko:'시험이\n잠금 해제되었어요',
    zh:'考试已\n解锁',
    ar:'تم فتح\nاختبارك',
    ru:'Ваш экзамен\nразблокирован',
    hi:'आपकी परीक्षा\nअनलॉक हो गई',
    tr:'Sınavınız\nkilidi açıldı',
  };
  return {
    code, lang, ex, pack, t,
    goodLuck: goodLuckByCode[code] || 'Good luck',
    unlocked: unlockedByCode[code] || 'Your exam is\nunlocked',
  };
}

// ───────────────────── Helpers ──────────────────────

function ConfettiBurst({ count = 60, colors }) {
  const palette = colors || ['#D97757', '#E8B23F', '#5B7B8A', '#8E7AB5', '#1A8F4E'];
  const pieces = Array.from({ length: count }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    rot: Math.random() * 360,
    color: palette[i % palette.length],
    size: 6 + Math.random() * 8,
    duration: 2.5 + Math.random() * 1.5,
    drift: -20 + Math.random() * 40,
  }));
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translate(0,-20px) rotate(0deg); opacity:1; }
          100% { transform: translate(var(--drift), 100vh) rotate(720deg); opacity:.85; }
        }
      `}</style>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:'absolute', left: p.x + '%', top: -20,
          width: p.size, height: p.size * 0.4,
          background: p.color, borderRadius: 1,
          animation: `confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
          ['--drift']: p.drift + 'vw',
          transform: `rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}

function StreakDots({ filled = 9, total = 9, brand = '#D97757', white = false }) {
  return (
    <div style={{ display:'flex', gap:6, alignItems:'center' }}>
      {Array.from({ length: total }).map((_,i) => {
        const on = i < filled;
        const isLast = i === filled - 1;
        return (
          <div key={i} style={{
            width: isLast ? 14 : 10,
            height: isLast ? 14 : 10,
            borderRadius: 99,
            background: on ? (white ? '#fff' : brand) : (white ? 'rgba(255,255,255,.2)' : '#E8E2D6'),
            boxShadow: isLast && on ? `0 0 0 4px ${white ? 'rgba(255,255,255,.18)' : brand+'22'}` : 'none',
          }}/>
        );
      })}
    </div>
  );
}

// ───────────────────── Screen 1: Day 9 Unlock Moment ──────────────────────

function UnlockDay9Page() {
  const nav = window.__nav || (() => {});
  const { lang, ex, t, unlocked } = useActiveLang();
  const [pickedTier, setPickedTier] = useStateMon('pro');
  const examName = `${ex.name} Full Mock Exam`;
  const userName = (USER && USER.name) ? USER.name.split(' ')[0] : 'María';

  return (
    <main style={{ flex:1, position:'relative', background:`linear-gradient(180deg, ${t.brandLight || '#FFF8F0'} 0%, ${T.bg} 60%)`, overflow:'auto' }}>
      <ConfettiBurst count={80} colors={[t.brand, '#E8B23F', '#5B7B8A', '#8E7AB5', '#1A8F4E']}/>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 32px', position:'relative', zIndex:1 }}>
        <button onClick={() => nav('dashboard')} style={{ display:'flex', alignItems:'center', gap:9 }}>
          <div style={{ width:28, height:28, borderRadius:8, background:T.brandGrad, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>{Icon.brandmark({ width:16, height:16 })}</div>
          <span style={{ fontFamily:T.serif, fontSize:18, color:T.ink }}>Fluentra</span>
        </button>
        <button onClick={() => nav('dashboard')} style={{ fontSize:12, color:T.ink4, padding:'6px 12px', cursor:'pointer' }}>Maybe later →</button>
      </div>

      <div style={{ maxWidth:880, margin:'0 auto', padding:'30px 32px 80px', position:'relative', zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:99, fontSize:11.5, fontWeight:700, color:t.brand, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:24, boxShadow:`0 4px 16px ${t.brand}26` }}>
            <span style={{ fontSize:14 }}>🎉</span> Streak milestone unlocked
          </div>
          <div style={{ fontFamily:T.serif, fontSize:64, lineHeight:1.02, color:T.ink, letterSpacing:'-.02em', marginBottom:18, textWrap:'balance', whiteSpace:'pre-line' }}>
            {unlocked}, {userName}.
          </div>
          <div style={{ fontSize:17, color:T.ink3, lineHeight:1.45, maxWidth:520, margin:'0 auto', marginBottom:28 }}>
            9 days of consistent practice. You've earned access to the <strong style={{ color:T.ink }}>{examName}</strong>.
          </div>

          <div style={{ display:'inline-flex', alignItems:'center', gap:14, padding:'14px 22px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:99, boxShadow:'0 8px 24px rgba(0,0,0,.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              {Icon.flame({ width:16, height:16 })}
              <span style={{ fontFamily:T.serif, fontSize:22, color:t.brand }}>9</span>
              <span style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>days</span>
            </div>
            <div style={{ width:1, height:18, background:T.border }}/>
            <StreakDots filled={9} total={9} brand={t.brand}/>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginBottom:24 }}>
          <button onClick={() => setPickedTier('once')} style={{
            background:'#fff', border:`2px solid ${pickedTier==='once' ? T.ink : T.border}`,
            borderRadius:18, padding:'28px 26px 24px', textAlign:'left', cursor:'pointer',
            boxShadow: pickedTier==='once' ? '0 8px 24px rgba(0,0,0,.08)' : '0 2px 6px rgba(0,0,0,.03)',
            transition:'all .15s', position:'relative',
          }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:12 }}>One-time</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
              <span style={{ fontFamily:T.serif, fontSize:48, color:T.ink, lineHeight:1 }}>{ex.cost || '$5'}</span>
            </div>
            <div style={{ fontSize:14, color:T.ink2, lineHeight:1.5, marginBottom:18 }}>Take this exam once. Full report and {ex.scoreLabel || 'band'}-score included.</div>
            <ul style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:0, fontSize:13, color:T.ink2 }}>
              <li style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ color:T.ink5 }}>{Icon.check({ width:13, height:13 })}</span>One full mock exam</li>
              <li style={{ display:'flex', alignItems:'center', gap:8 }}><span style={{ color:T.ink5 }}>{Icon.check({ width:13, height:13 })}</span>Detailed {ex.scoreLabel || 'band'}-score report</li>
              <li style={{ display:'flex', alignItems:'center', gap:8, color:T.ink4 }}><span>—</span>No retakes, no Pro features</li>
            </ul>
          </button>

          <button onClick={() => setPickedTier('pro')} style={{
            background: pickedTier==='pro' ? `linear-gradient(135deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)` : '#fff',
            color: pickedTier==='pro' ? '#fff' : T.ink,
            border:`2px solid ${pickedTier==='pro' ? t.brand : T.border}`,
            borderRadius:18, padding:'28px 26px 24px', textAlign:'left', cursor:'pointer',
            boxShadow: pickedTier==='pro' ? `0 12px 32px ${t.brand}40` : '0 2px 6px rgba(0,0,0,.03)',
            transition:'all .15s', position:'relative',
          }}>
            <div style={{ position:'absolute', top:-12, right:24, background:'#1A8F4E', color:'#fff', fontSize:10.5, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', padding:'5px 11px', borderRadius:99, boxShadow:'0 4px 10px rgba(26,143,78,.3)' }}>Best value</div>
            <div style={{ fontSize:11, fontWeight:700, opacity: pickedTier==='pro'?.85:1, color: pickedTier==='pro' ? '#fff' : t.brand, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:12 }}>Fluentra Pro</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:6 }}>
              <span style={{ fontFamily:T.serif, fontSize:48, lineHeight:1 }}>$24</span>
              <span style={{ fontSize:13, opacity:.75 }}>/ month</span>
            </div>
            <div style={{ fontSize:13.5, opacity: pickedTier==='pro'?.92:1, color: pickedTier==='pro' ? '#fff' : T.ink2, lineHeight:1.5, marginBottom:18 }}>Unlimited exams across every language. Plus everything else.</div>
            <ul style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
              {[
                'Unlimited mock exams in every language',
                'AI tutor — unlimited voice & chat',
                'Adaptive practice across all skills',
                'Live exam coaching from real teachers',
                'Cancel anytime · 7-day money back',
              ].map((tx,i) => (
                <li key={i} style={{ display:'flex', alignItems:'center', gap:8, opacity: pickedTier==='pro'?.95:1 }}>
                  <span style={{ color: pickedTier==='pro' ? '#fff' : t.brand }}>{Icon.check({ width:13, height:13 })}</span>{tx}
                </li>
              ))}
            </ul>
          </button>
        </div>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 22px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:14, marginBottom:18 }}>
          <div style={{ fontSize:13.5, color:T.ink2 }}>
            {pickedTier === 'pro'
              ? <>You'll be charged <strong>$24/mo</strong>. Cancel anytime — keep all progress.</>
              : <>One-time charge of <strong>{ex.cost || '$5'}</strong>. Upgrade to Pro anytime.</>}
          </div>
          <button onClick={() => nav('exam_preview')} style={{
            padding:'13px 24px', background: T.ink, color:'#fff',
            borderRadius:11, fontSize:14, fontWeight:700, cursor:'pointer',
            display:'flex', alignItems:'center', gap:8,
          }}>
            {pickedTier === 'pro' ? 'Start Pro & take exam' : `Continue with ${ex.cost || '$5'}`}
            <span style={{ fontSize:14 }}>→</span>
          </button>
        </div>

        <div style={{ textAlign:'center', fontSize:11.5, color:T.ink5, lineHeight:1.6 }}>
          1,247 people unlocked their {ex.short} exam this month · 84% chose Pro
        </div>
      </div>
    </main>
  );
}

// ───────────────────── Screen 2: Exam Preview ──────────────────────

function ExamPreviewPage() {
  const nav = window.__nav || (() => {});
  const { lang, ex, t } = useActiveLang();
  const colorMap = { listening:'#5B7B8A', reading:'#8E7AB5', writing:t.brand, speaking:'#E8B23F' };

  // Build sections from ex.modules
  const sections = (ex.modules || []).map(m => ({
    name: m.label,
    mins: parseInt(m.time) || 30,
    qs: m.q,
    color: colorMap[m.color] || t.brand,
    isWriting: m.color === 'writing',
  }));

  // Total time + total Qs
  const totalMins = sections.reduce((s,x) => s + x.mins, 0);
  const totalQs   = sections.reduce((s,x) => s + (x.qs || 0), 0);
  const totalH = Math.floor(totalMins / 60);
  const totalM = totalMins % 60;
  const totalLabel = totalH ? `${totalH} h ${totalM} min` : `${totalM} min`;

  // Predicted score range
  const best = ex.bestScore;
  const target = (typeof best === 'number') ? Math.round(best * 1.05 * 10)/10 : best;

  return (
    <main style={{ flex:1, background:T.bg, overflow:'auto' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 48px 80px' }}>

        <button onClick={() => nav('unlock_day9')} style={{ fontSize:12, color:T.ink4, marginBottom:20, display:'inline-flex', alignItems:'center', gap:6 }}>
          <span>←</span> Back
        </button>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:40, marginBottom:48, alignItems:'center' }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, color:t.brand, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:14 }}>You unlocked</div>
            <div style={{ fontFamily:T.serif, fontSize:54, lineHeight:1.05, color:T.ink, letterSpacing:'-.015em', marginBottom:18 }}>{ex.name}<br/>Full Mock Exam</div>
            <div style={{ fontSize:15, color:T.ink3, lineHeight:1.5, maxWidth:460, marginBottom:22 }}>
              The same {sections.length}-section structure as the real test. AI-graded with detailed {ex.scoreLabel || 'band'} feedback within 60 seconds of finishing.
            </div>
            {(() => {
              const tier = (window.__userTier || 'free');
              const isPaid = tier === 'pro' || tier === 'max';
              const cost = ex.cost || '$5';
              return (
                <div style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
                  <button onClick={() => { window.__examMode='monthly'; nav('pre_exam_ready'); }} style={{
                    padding:'14px 26px', background:`linear-gradient(135deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, color:'#fff',
                    borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer',
                    display:'inline-flex', alignItems:'center', gap:10, boxShadow:`0 8px 20px ${t.brand}40`, border:'none',
                  }}>
                    Enter exam now
                    <span style={{ padding:'3px 9px', background:'rgba(255,255,255,.22)', borderRadius:7, fontSize:11.5, fontWeight:800, letterSpacing:'.04em' }}>
                      {isPaid ? 'FREE' : cost}
                    </span>
                    <span style={{ fontSize:14 }}>→</span>
                  </button>
                  <button onClick={() => nav('mock_test')} style={{ padding:'14px 22px', background:T.brandLight, color:T.brand, border:`1.5px solid ${T.brand}55`, borderRadius:12, fontSize:13.5, fontWeight:700, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:6, height:6, borderRadius:3, background:T.brand }}/>
                    Try free mock first
                  </button>
                </div>
              );
            })()}
          </div>

          <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:18, padding:'22px 24px' }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:10 }}>Predicted {ex.scoreLabel || 'score'}</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:6, marginBottom:6 }}>
              <span style={{ fontFamily:T.serif, fontSize:56, color:T.ink, lineHeight:1 }}>{best}</span>
              <span style={{ fontSize:14, color:T.ink4 }}>– {target}{ex.scoreUnit || ''}</span>
            </div>
            <div style={{ fontSize:12, color:T.ink3, lineHeight:1.45, marginBottom:14 }}>Based on your last 12 practice sessions across all skills.</div>
            <div style={{ height:6, background:T.bg2, borderRadius:99, overflow:'hidden', marginBottom:8 }}>
              <div style={{ height:'100%', width:'72%', background:t.brand, borderRadius:99 }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:10.5, color:T.ink5 }}>
              <span>0</span><span>{(ex.scoreUnit || '/100').replace('/','')}</span>
            </div>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:48 }}>
          {[
            { l:'Total time', v:totalLabel, s:'self-paced' },
            { l:'Sections', v:String(sections.length), s:sections.map(s => s.name[0]).join(' · ') },
            { l:'Questions', v:String(totalQs), s:'mostly multi-choice' },
            { l:'AI feedback', v:'< 60 s', s:'after submit' },
          ].map((s,i) => (
            <div key={i} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:'16px 18px' }}>
              <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>{s.l}</div>
              <div style={{ fontFamily:T.serif, fontSize:24, color:T.ink, lineHeight:1.05 }}>{s.v}</div>
              <div style={{ fontSize:11, color:T.ink5, marginTop:3 }}>{s.s}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom:40 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:14 }}>What's inside</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:12 }}>
            {sections.map((s,i) => (
              <div key={i} style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:13, padding:'18px 20px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:42, height:42, borderRadius:10, background:s.color+'22', color:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:18 }}>{i+1}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:14, fontWeight:600, color:T.ink, marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:12, color:T.ink4 }}>{s.mins} min · {s.qs} {s.isWriting?'tasks':'questions'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sample question — language aware */}
        {(() => {
          const samples = {
            en: { tag:'Reading · Sample', q:'According to the passage, the primary reason urban gardens have grown in popularity is…', opts:['A — increased awareness of climate change among city residents','B — falling cost of garden equipment in the last decade','C — local government incentives for community projects','D — a cultural shift toward homegrown food'] },
            es: { tag:'Lectura · Muestra', q:'Según el texto, la razón principal del aumento de los huertos urbanos es…', opts:['A — la mayor conciencia ambiental','B — el descenso del coste de los materiales','C — los incentivos del gobierno local','D — un cambio cultural hacia lo local'] },
            ja: { tag:'読解 · サンプル', q:'本文によると、都市部の家庭菜園が人気を博している主な理由は何か。', opts:['A — 気候変動への意識の高まり','B — 園芸用品の価格の低下','C — 地方自治体の助成金','D — 自家栽培への文化的シフト'] },
            fr: { tag:'Lecture · Exemple', q:"D'après le texte, la principale raison de la popularité des jardins urbains est…", opts:["A — la sensibilisation au climat","B — la baisse des prix du matériel","C — les incitations municipales","D — un changement culturel"] },
            de: { tag:'Lesen · Beispiel', q:'Laut Text ist der Hauptgrund für die wachsende Beliebtheit urbaner Gärten…', opts:['A — Klimabewusstsein','B — sinkende Materialkosten','C — kommunale Anreize','D — kultureller Wandel'] },
            it: { tag:'Lettura · Esempio', q:'Secondo il testo, il motivo principale della popolarità degli orti urbani è…', opts:['A — consapevolezza climatica','B — costi più bassi','C — incentivi locali','D — cambiamento culturale'] },
            pt: { tag:'Leitura · Exemplo', q:'Segundo o texto, a razão principal do aumento das hortas urbanas é…', opts:['A — consciência ambiental','B — custos mais baixos','C — incentivos municipais','D — mudança cultural'] },
            ko: { tag:'읽기 · 샘플', q:'지문에 따르면 도시 정원이 인기 있는 가장 큰 이유는?', opts:['A — 기후 인식','B — 장비 가격 하락','C — 지자체 인센티브','D — 문화적 변화'] },
            zh: { tag:'阅读 · 样题', q:'根据文章，城市花园日益流行的主要原因是？', opts:['A — 气候意识增强','B — 设备成本下降','C — 政府激励','D — 文化转变'] },
            ar: { tag:'القراءة · نموذج', q:'وفقاً للنص، السبب الرئيسي لشعبية الحدائق الحضرية هو…', opts:['A — الوعي المناخي','B — انخفاض التكاليف','C — حوافز حكومية','D — التحول الثقافي'] },
            ru: { tag:'Чтение · Пример', q:'Согласно тексту, главная причина популярности городских садов —', opts:['A — климатическая осведомлённость','B — снижение цен','C — муниципальные стимулы','D — культурный сдвиг'] },
            hi: { tag:'पठन · नमूना', q:'पाठ के अनुसार, शहरी बागानों की लोकप्रियता का मुख्य कारण है…', opts:['A — जलवायु जागरूकता','B — कम लागत','C — सरकारी प्रोत्साहन','D — सांस्कृतिक बदलाव'] },
            tr: { tag:'Okuma · Örnek', q:'Metne göre, kentsel bahçelerin popüler olmasının ana nedeni…', opts:['A — iklim bilinci','B — düşük maliyet','C — yerel teşvikler','D — kültürel değişim'] },
          };
          const samp = samples[lang.code] || samples.en;
          return (
            <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:18, padding:'30px 36px', marginBottom:40 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <span style={{ fontSize:10.5, fontWeight:700, color:'#8E7AB5', letterSpacing:'.12em', textTransform:'uppercase', padding:'4px 9px', background:'#8E7AB522', borderRadius:6 }}>{samp.tag}</span>
                  <span style={{ fontSize:11, color:T.ink5 }}>Question 14 of {totalQs}</span>
                </div>
                <span style={{ fontSize:11, color:T.ink5 }}>~80 sec</span>
              </div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.35, marginBottom:18 }}>{samp.q}</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {samp.opts.map((opt,i) => (
                  <div key={i} style={{ padding:'14px 18px', background:T.bg2, border:`1px solid ${T.border}`, borderRadius:11, fontSize:14, color:T.ink2 }}>{opt}</div>
                ))}
              </div>
              <div style={{ fontSize:11.5, color:T.ink5, marginTop:18, fontStyle:'italic' }}>Representative preview. Your exam will have unique passages and questions.</div>
            </div>
          );
        })()}

        <div style={{ background:`linear-gradient(135deg, ${t.brandLight || '#FFF8F0'}, ${t.brand}1A)`, border:`1px solid ${T.border}`, borderRadius:18, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:24 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <div style={{ display:'flex' }}>
                {[t.brand,'#5B7B8A','#8E7AB5','#1A8F4E','#E8B23F'].map((c,i) => (
                  <div key={i} style={{ width:24, height:24, borderRadius:99, background:c, border:'2px solid #fff', marginLeft: i?-7:0 }}/>
                ))}
              </div>
              <span style={{ fontSize:13, color:T.ink2, fontWeight:600 }}>1,247 people took this exam this month</span>
            </div>
            <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.45 }}>Average {ex.scoreLabel || 'score'}: <strong style={{ color:T.ink }}>{best}{ex.scoreUnit || ''}</strong> · 92% finish on first attempt</div>
          </div>
          {(() => {
            const tier = (window.__userTier || 'free'); // 'free' | 'pro' | 'max'
            const isPaid = tier === 'pro' || tier === 'max';
            const cost = ex.cost || '$5';
            return (
              <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                <button onClick={() => { window.__examMode='monthly'; nav('pre_exam_ready'); }} style={{
                  padding:'14px 26px', background:`linear-gradient(135deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, color:'#fff',
                  borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer',
                  display:'flex', alignItems:'center', gap:10, boxShadow:`0 8px 20px ${t.brand}40`, border:'none',
                }}>
                  Enter exam
                  <span style={{ padding:'3px 9px', background:'rgba(255,255,255,.22)', borderRadius:7, fontSize:11.5, fontWeight:800, letterSpacing:'.04em' }}>
                    {isPaid ? 'FREE' : cost}
                  </span>
                  <span style={{ fontSize:14 }}>→</span>
                </button>
                <div style={{ fontSize:11, color:T.ink4, display:'flex', alignItems:'center', gap:6 }}>
                  {isPaid ? (
                    <>
                      <span style={{ width:6, height:6, borderRadius:3, background:'#1A8F4E' }}/>
                      Included with your {tier === 'max' ? 'Max' : 'Pro'} plan
                    </>
                  ) : (
                    <>One-time charge · <button onClick={() => nav('pricing')} style={{ color:t.brand, fontWeight:700, textDecoration:'underline', cursor:'pointer' }}>Go Pro for unlimited</button></>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </main>
  );
}

// ───────────────────── Screen 3: Streak countdown ──────────────────────

function StreakCountdownPage() {
  const nav = window.__nav || (() => {});
  const { ex, t } = useActiveLang();

  const variants = [
    { day:7, eyebrow:'In 2 days', headline:'Your exam unlocks soon', body:`Stay consistent for 2 more days to unlock your ${ex.name} Full Mock Exam.`, cta:'Practice 15 min', icon:'🎯', glow:'#5B7B8A' },
    { day:8, eyebrow:'Tomorrow!', headline:"Don't break it now", body:`One more day. You're so close — your ${ex.short} exam unlocks at midnight.`, cta:'Quick session', icon:'🔥', glow:t.brand },
    { day:9, eyebrow:'Today', headline:'Your exam is ready 🎉', body:`9-day streak complete. Take your ${ex.name} Full Mock Exam any time.`, cta:'Open exam', icon:'🎓', glow:'#1A8F4E' },
  ];

  return (
    <main style={{ flex:1, background:T.bg, padding:'40px 48px 80px', overflow:'auto' }}>
      <PageHeader eyebrow="Notification screens" title="Streak countdown" subtitle="Three popup variants delivered as the user approaches the unlock — anticipation → urgency → reward."/>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24, marginBottom:32 }}>
        {variants.map(v => (
          <div key={v.day} style={{ position:'relative' }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:12 }}>Day {v.day}</div>
            <div style={{ background:'#fff', borderRadius:18, padding:'24px 22px', boxShadow:'0 16px 40px rgba(0,0,0,.12), 0 0 0 1px rgba(0,0,0,.04)', position:'relative', border: v.day===9 ? `2px solid ${v.glow}` : '1px solid '+T.border }}>
              {v.day === 9 && <div style={{ position:'absolute', top:-1, left:-1, right:-1, height:60, background:`linear-gradient(180deg, ${v.glow}26, transparent)`, borderRadius:'18px 18px 0 0' }}/>}
              <div style={{ position:'relative', display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ width:42, height:42, borderRadius:11, background:v.glow+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{v.icon}</div>
                <button style={{ width:24, height:24, borderRadius:6, color:T.ink5, fontSize:14, cursor:'pointer' }}>×</button>
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:v.glow, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>{v.eyebrow}</div>
              <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.15, marginBottom:10 }}>{v.headline}</div>
              <div style={{ fontSize:13, color:T.ink3, lineHeight:1.45, marginBottom:16 }}>{v.body}</div>
              <div style={{ marginBottom:18 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <span style={{ fontSize:11, color:T.ink4, fontWeight:600 }}>Streak</span>
                  <span style={{ fontSize:12, fontWeight:700, color:v.glow }}>{v.day} / 9</span>
                </div>
                <StreakDots filled={v.day} total={9} brand={v.glow}/>
              </div>
              <button onClick={() => nav(v.day === 9 ? 'unlock_day9' : 'practice')} style={{ width:'100%', padding:'12px 16px', background: v.day === 9 ? v.glow : T.ink, color:'#fff', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer' }}>{v.cta} →</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:'18px 22px', fontSize:12.5, color:T.ink3, lineHeight:1.55 }}>
        <strong style={{ color:T.ink }}>Delivery:</strong> Push notification at user's daily practice time + in-app modal on next open. Day 9 also triggers an email + a permanent badge in the dashboard until the exam is taken.
      </div>
    </main>
  );
}

// ───────────────────── Screen 4: Pre-exam Ready ──────────────────────

function PreExamReadyPage() {
  const nav = window.__nav || (() => {});
  const { ex, t, goodLuck } = useActiveLang();
  const [agreed, setAgreed] = useStateMon(false);
  const userName = (USER && USER.name) ? USER.name.split(' ')[0] : 'María';

  const totalMins = (ex.modules || []).reduce((s,m) => s + (parseInt(m.time)||0), 0);
  const totalH = Math.floor(totalMins/60);
  const totalM = totalMins % 60;
  const totalLabel = totalH ? `${totalH} hour${totalH>1?'s':''} ${totalM} minute${totalM!==1?'s':''}` : `${totalM} minutes`;
  const sectionList = (ex.modules || []).map(m => `${(m.label.split(' ')[0])} ${parseInt(m.time)||0}`).join(', ');

  const hasListening = (ex.modules || []).some(m => m.color === 'listening');

  return (
    <main style={{ flex:1, background:T.bg, overflow:'auto' }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'56px 32px 80px' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 13px', background:'#1A8F4E14', color:'#1A8F4E', borderRadius:99, fontSize:11.5, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:20 }}>
          {Icon.check({ width:13, height:13 })} Payment confirmed · #FL-2847
        </div>

        <div style={{ fontFamily:T.serif, fontSize:56, lineHeight:1.05, color:T.ink, letterSpacing:'-.02em', marginBottom:14 }}>{goodLuck}, {userName}.</div>
        <div style={{ fontSize:16, color:T.ink3, lineHeight:1.5, marginBottom:36, maxWidth:560 }}>
          You're about to start the {ex.name} Full Mock Exam. Once you click start, the timer begins and you can't pause.
        </div>

        <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:16, padding:'28px 32px', marginBottom:24 }}>
          <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:18 }}>Before you begin</div>
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {[
              { ic:Icon.clock(), title:`${totalLabel} total`, body:`${sectionList}. Each section's timer starts automatically when the previous one ends.` },
              { ic:Icon.bell(), title:'No pauses — no exceptions', body:'Real exam conditions. Use the bathroom now and silence your phone.' },
              { ic:Icon.spark(), title:`AI ${ex.scoreLabel || 'score'} in under a minute`, body:'Detailed feedback on every section, with examples of what would have scored higher.' },
              hasListening && { ic:Icon.brandmark(), title:'Headphones required for Listening', body:'Test your audio — speaker quality affects your score.' },
            ].filter(Boolean).map((row,i) => (
              <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:t.brandLight || T.brandLight, color:t.brand, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{row.ic}</div>
                <div>
                  <div style={{ fontSize:14, fontWeight:600, color:T.ink, marginBottom:3 }}>{row.title}</div>
                  <div style={{ fontSize:13, color:T.ink3, lineHeight:1.45 }}>{row.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <label style={{ display:'flex', alignItems:'center', gap:11, padding:'14px 4px', marginBottom:18, cursor:'pointer' }}>
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ width:18, height:18, cursor:'pointer', accentColor:T.ink }}/>
          <span style={{ fontSize:13, color:T.ink3 }}>I'm in a quiet place {hasListening && 'with headphones'} and have {totalH+1}+ hours uninterrupted.</span>
        </label>

        <div style={{ display:'flex', gap:12 }}>
          <button onClick={() => nav('dashboard')} style={{ padding:'17px 24px', background:'transparent', border:`1px solid ${T.border}`, borderRadius:12, fontSize:14, color:T.ink2, fontWeight:600, cursor:'pointer' }}>Save for later</button>
          <button onClick={() => agreed && nav('exam_runner')} style={{ flex:1, padding:'17px 24px', background: `linear-gradient(135deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, color:'#fff', borderRadius:12, fontSize:15, fontWeight:700, cursor: agreed ? 'pointer' : 'not-allowed', opacity: agreed ? 1 : .45, border:'none', boxShadow: `0 10px 26px ${t.brand}55`, display:'flex', alignItems:'center', justifyContent:'center', gap:8, letterSpacing:'.01em' }}>
            Begin exam <span>→</span>
          </button>
        </div>

        <div style={{ textAlign:'center', fontSize:11.5, color:T.ink5, marginTop:18 }}>Your seat is reserved. Come back any time within 14 days.</div>
      </div>
    </main>
  );
}

// ───────────────────── Screen 5: Post-exam Upgrade ──────────────────────

function PostExamUpsellPage() {
  const nav = window.__nav || (() => {});
  const { ex, t } = useActiveLang();

  const best = ex.bestScore;
  const target = (typeof best === 'number') ? Math.round((best * 1.15) * 10) / 10 : best;
  const target90 = (typeof best === 'number') ? Math.round((best * 1.23) * 10) / 10 : best;

  // Skill score breakdown — derive from modules
  const skillScores = (ex.modules || []).slice(0,4).map((m,i) => {
    const variation = [0.05, 0, -0.08, 0][i] || 0;
    const score = (typeof best === 'number') ? Math.round((best * (1+variation)) * 10) / 10 : best;
    return { name: m.label.split(' ')[0], score };
  });

  const max = (typeof ex.scoreUnit === 'string') ? (parseInt(ex.scoreUnit.replace('/','')) || 9) : 9;

  return (
    <main style={{ flex:1, background:T.bg, overflow:'auto' }}>
      <div style={{ maxWidth:1080, margin:'0 auto', padding:'32px 40px 56px' }}>
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:18 }}>{ex.name} · Your {ex.scoreLabel || 'result'}</div>

        {/* Two-column hero: score + pitch */}
        <div style={{ display:'grid', gridTemplateColumns:'minmax(280px, 380px) 1fr', gap:20, marginBottom:20 }}>
          {/* Score card */}
          <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:20, padding:'28px 32px', display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:10.5, fontWeight:800, color:T.ink4, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14 }}>Overall {ex.scoreUnit || ''}</div>
              <div style={{ fontFamily:T.serif, fontSize:140, lineHeight:.85, color:T.ink, letterSpacing:'-.04em', fontWeight:500 }}>{best}</div>
              <div style={{ fontSize:13, color:T.ink3, marginTop:14, lineHeight:1.5 }}>Solid B2 · ranked top 38% globally on this exam.</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:24, paddingTop:20, borderTop:`1px solid ${T.hairline}` }}>
              {skillScores.map((s,i) => (
                <div key={i} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', gap:12 }}>
                  <span style={{ fontSize:12.5, color:T.ink2, fontWeight:600 }}>{s.name}</span>
                  <span style={{ flex:1, height:1, background:T.hairline }}/>
                  <span style={{ fontFamily:T.serif, fontSize:16, color:T.ink, letterSpacing:'-.01em' }}>{s.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pitch card */}
          <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:20, padding:'32px 36px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-60, right:-60, width:240, height:240, borderRadius:'50%', background:`radial-gradient(circle, ${t.brand}14 0%, transparent 70%)` }}/>
            <div style={{ position:'relative' }}>
              <div style={{ display:'inline-block', fontSize:10.5, fontWeight:800, color:t.brand, letterSpacing:'.18em', textTransform:'uppercase', marginBottom:14, padding:'5px 11px', borderRadius:6, background: t.brandLight || T.brandLight }}>What's next</div>
              <div style={{ fontFamily:T.serif, fontSize:46, lineHeight:1.02, color:T.ink, letterSpacing:'-.025em', marginBottom:14 }}>Close the {(typeof best==='number') ? (target-best).toFixed(1) : '0.5'} gap.</div>
              <div style={{ fontSize:14.5, color:T.ink2, lineHeight:1.55, marginBottom:24, maxWidth:480 }}>Pro students hit <strong style={{ color:T.ink }}>{target}+ on average</strong> after 30 days. Unlimited tutor sessions, weekly mock exams, and AI drills targeting your weakest skill.</div>
            </div>

            <div style={{ position:'relative' }}>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14, paddingTop:18, borderTop:`1px solid ${T.hairline}` }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:4 }}>
                  <span style={{ fontFamily:T.serif, fontSize:38, color:T.ink, lineHeight:1, letterSpacing:'-.02em' }}>$19</span>
                  <span style={{ fontSize:13, color:T.ink4 }}>/mo</span>
                </div>
                <div style={{ width:1, height:32, background:T.hairline }}/>
                <div style={{ fontSize:12, color:T.ink3, lineHeight:1.4 }}>Billed yearly · 7-day free trial</div>
              </div>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <button onClick={() => nav('checkout')} style={{ padding:'15px 26px', background:`linear-gradient(135deg, ${t.brand} 0%, ${t.brand2 || t.brand} 100%)`, color:'#fff', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', border:'none', boxShadow:`0 8px 22px ${t.brand}55`, display:'flex', alignItems:'center', gap:8 }}>Start free trial<span>→</span></button>
                <button onClick={() => nav('pricing')} style={{ padding:'15px 22px', background:'transparent', color:T.ink2, borderRadius:12, fontSize:14, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}` }}>Compare plans</button>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement comparison */}
        <div style={{ background:'#fff', border:`1px solid ${T.border}`, borderRadius:20, padding:'24px 32px', marginBottom:18 }}>
          <div style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:18 }}>
            <div style={{ fontSize:11, fontWeight:800, color:T.ink4, letterSpacing:'.16em', textTransform:'uppercase' }}>How users improve</div>
            <div style={{ fontSize:11.5, color:T.ink5 }}>Based on 8,400+ users · vertical line = your score</div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {(() => {
              const rows = [
                { l:'Free users · 30 days', to: typeof best==='number' ? Math.round((best*1.03)*10)/10 : best, color:'#9AA5AE', tag:'+0.2' },
                { l:'Pro users · 30 days',  to:target,   color:t.brand,   tag:'+'+(typeof best==='number'?(target-best).toFixed(1):'0.7'), highlight:true },
                { l:'Pro users · 90 days',  to:target90, color:'#1A8F4E', tag:'+'+(typeof best==='number'?(target90-best).toFixed(1):'1.1'), highlight:true },
              ];
              return rows.map((row,i) => (
                <div key={i} style={{ display:'grid', gridTemplateColumns:'200px 1fr 80px', alignItems:'center', gap:16 }}>
                  <div style={{ fontSize:13, color: row.highlight ? T.ink : T.ink3, fontWeight: row.highlight ? 600 : 500 }}>{row.l}</div>
                  <div style={{ position:'relative', height:22, background:T.bg2, borderRadius:5 }}>
                    <div style={{ position:'absolute', left: ((best/max)*100)+'%', right: (100 - (row.to/max)*100)+'%', top:0, bottom:0, background:row.color, borderRadius:5 }}/>
                    <div style={{ position:'absolute', left: ((best/max)*100)+'%', top:-4, bottom:-4, width:2, background:T.ink, borderRadius:1 }}/>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color: row.highlight ? row.color : T.ink4, textAlign:'right', fontFamily:T.serif }}>{row.tag}</div>
                </div>
              ));
            })()}
          </div>
        </div>

        <div style={{ textAlign:'center' }}>
          <button onClick={() => nav('mod_results')} style={{ fontSize:13, fontWeight:600, color:T.ink3, padding:'10px 16px', cursor:'pointer', background:'transparent', border:'none' }}>See full report without upgrading →</button>
        </div>
      </div>
    </main>
  );
}

// ───────────────────── Screen 6: Milestones ──────────────────────

function MilestonesReelPage() {
  const nav = window.__nav || (() => {});
  const { ex, t } = useActiveLang();

  const milestones = [
    { day:3,  status:'unlocked', title:'Practice exam', body:'A short, low-stakes mock exam to warm up. Free for everyone, no streak break needed.', reward:'Free · unlimited', color:'#5B7B8A', icon:'📝', teaser:'Day 9: full mock exam' },
    { day:9,  status:'unlocked', title:`${ex.short} Full Mock Exam`, body:`The real thing. Same ${(ex.modules||[]).length}-section structure, AI-graded with detailed ${ex.scoreLabel || 'score'} feedback.`, reward:`${ex.cost || '$5'} once · or Pro`, color:t.brand, icon:'🎓', teaser:'Day 30: monthly retake', highlight:true },
    { day:30, status:'locked',   title:'Monthly retake', body:'A fresh exam every 30 days, included in Pro. Track your improvement curve.', reward:'Pro only', color:'#8E7AB5', icon:'🏆', teaser:'Day 90: Elite badge' },
    { day:90, status:'locked',   title:'Elite badge', body:'Three months of consistency. Public profile badge, leaderboard placement, and lifetime exam history.', reward:'Permanent', color:'#E8B23F', icon:'⭐', teaser:'You become rare. Less than 4% reach this.' },
  ];

  return (
    <main style={{ flex:1, background:T.bg, overflow:'auto' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 48px 80px' }}>
        <PageHeader eyebrow="Streak rewards" title="Every milestone unlocks something." subtitle="Each celebration card surfaces as a popup the day it triggers, then lives permanently in the user's profile."/>

        <div style={{ position:'relative', paddingLeft:36 }}>
          <div style={{ position:'absolute', left:13, top:36, bottom:36, width:2, background:T.border, borderRadius:1 }}/>
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {milestones.map((m,i) => (
              <div key={i} style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:-36, top:30, width:28, height:28, borderRadius:99, background: m.status === 'unlocked' ? m.color : T.bg2, border:`3px solid ${m.status === 'unlocked' ? m.color : T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:11, fontWeight:700 }}>
                  {m.status === 'unlocked' ? Icon.check({ width:13, height:13 }) : <span style={{ color:T.ink5 }}>·</span>}
                </div>
                <div style={{ background:'#fff', border: m.highlight ? `2px solid ${m.color}` : `1px solid ${T.border}`, borderRadius:18, padding:'24px 28px', boxShadow: m.highlight ? `0 12px 32px ${m.color}26` : '0 1px 3px rgba(0,0,0,.04)', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center', opacity: m.status === 'locked' ? 0.7 : 1 }}>
                  <div style={{ width:64, height:64, borderRadius:14, background:m.color+'18', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30 }}>{m.icon}</div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:m.color, letterSpacing:'.14em', textTransform:'uppercase' }}>Day {m.day}</span>
                      {m.status === 'unlocked' ? (
                        <span style={{ fontSize:10, fontWeight:700, color:'#1A8F4E', background:'#1A8F4E14', padding:'3px 8px', borderRadius:5, letterSpacing:'.08em', textTransform:'uppercase' }}>Unlocked</span>
                      ) : (
                        <span style={{ fontSize:10, fontWeight:700, color:T.ink5, background:T.bg2, padding:'3px 8px', borderRadius:5, letterSpacing:'.08em', textTransform:'uppercase' }}>Locked</span>
                      )}
                    </div>
                    <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, lineHeight:1.15, marginBottom:6 }}>{m.title}</div>
                    <div style={{ fontSize:13, color:T.ink3, lineHeight:1.45, marginBottom:8, maxWidth:520 }}>{m.body}</div>
                    <div style={{ fontSize:11, color:T.ink5, fontStyle:'italic' }}>Next → {m.teaser}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>Reward</div>
                    <div style={{ fontSize:14, fontWeight:700, color:m.color, marginBottom:10 }}>{m.reward}</div>
                    {m.status === 'unlocked' && m.day === 9 && (
                      <button onClick={() => nav('unlock_day9')} style={{ padding:'9px 16px', background:m.color, color:'#fff', borderRadius:9, fontSize:12, fontWeight:700, cursor:'pointer' }}>Open →</button>
                    )}
                    {m.status === 'unlocked' && m.day === 3 && (
                      <button onClick={() => nav('mock_test')} style={{ padding:'9px 16px', background:T.bg2, color:T.ink2, borderRadius:9, fontSize:12, fontWeight:600, cursor:'pointer', border:`1px solid ${T.border}` }}>Take it →</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:40, padding:'22px 28px', background:t.brandLight || T.brandLight, borderRadius:14, fontSize:13, color:T.ink2, lineHeight:1.55, textAlign:'center' }}>
          <strong style={{ color:t.brand, fontFamily:T.serif, fontSize:16 }}>96%</strong> of users who reach Day 9 take the exam within 48 hours · <strong style={{ color:t.brand, fontFamily:T.serif, fontSize:16 }}>3.7%</strong> reach Day 90
        </div>
      </div>
    </main>
  );
}

Object.assign(window, {
  UnlockDay9Page, ExamPreviewPage, StreakCountdownPage,
  PreExamReadyPage, PostExamUpsellPage, MilestonesReelPage,
});
