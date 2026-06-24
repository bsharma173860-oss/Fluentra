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
