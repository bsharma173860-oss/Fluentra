// ──────────────────────────────────────────────────────────────
// Fluentra — First-run Welcome
// Shown once to a freshly-signed-in account with zero languages,
// just before the Add-Language picker. Editorial brand language:
// warm off-white, DM Serif Display headline, brand-orange CTA,
// the four module accents as a skill strip. Responsive (clamp) so
// the same component reads well in both web and mobile page maps.
// CTA → add_language (which persists). Secondary → dashboard.
// ──────────────────────────────────────────────────────────────
function WelcomePage() {
  const go = (id) => { if (window.__nav) window.__nav(id); };

  const skills = [
    { label: 'Reading',   c: T.reading.c,   bg: T.reading.bg },
    { label: 'Listening', c: T.listening.c, bg: T.listening.bg },
    { label: 'Speaking',  c: T.speaking.c,  bg: T.speaking.bg },
    { label: 'Writing',   c: T.writing.c,   bg: T.writing.bg },
  ];

  const arrow = (Icon && Icon.arrow) ? Icon.arrow({ width: 13, height: 13 }) : '→';

  return (
    <div style={{
      minHeight: '100%', width: '100%', background: T.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', boxSizing: 'border-box', fontFamily: T.sans, overflowY: 'auto',
    }}>
      <div style={{ width: '100%', maxWidth: 560, textAlign: 'center' }}>

        {/* Wordmark */}
        <div style={{ fontFamily: T.serif, fontSize: 22, color: T.ink, letterSpacing: '-0.01em', marginBottom: 40 }}>
          Fluentra
        </div>

        {/* Eyebrow */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px',
          borderRadius: 99, background: T.brandLight, color: T.brand,
          fontSize: 12.5, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 24,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: T.brand, display: 'inline-block' }} />
          Welcome to Fluentra
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: T.serif, fontSize: 'clamp(34px, 8vw, 46px)', lineHeight: 1.08,
          color: T.ink, margin: '0 0 18px', letterSpacing: '-0.02em',
        }}>
          Speak sooner.<br />
          <span style={{ background: T.brandGrad, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            Pass with proof.
          </span>
        </h1>

        {/* Subhead */}
        <p style={{ fontSize: 'clamp(15px, 4vw, 16.5px)', lineHeight: 1.6, color: T.ink3, margin: '0 auto 32px', maxWidth: 460 }}>
          AI-powered lessons, real exam practice, and a tutor that talks back — across 26 languages.
          Pick one to begin; you can add more anytime.
        </p>

        {/* Four-skill strip */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 16 }}>
          {skills.map(s => (
            <div key={s.label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px',
              borderRadius: 99, background: s.bg, color: s.c, fontSize: 13.5, fontWeight: 600,
            }}>
              <span style={{ width: 7, height: 7, borderRadius: 99, background: s.c, display: 'inline-block' }} />
              {s.label}
            </div>
          ))}
        </div>

        {/* Exam trust line */}
        <div style={{ fontSize: 12.5, color: T.ink4, fontWeight: 600, letterSpacing: '0.04em', marginBottom: 36 }}>
          IELTS · JLPT · DELE · DELF · HSK · TOPIK · Goethe &amp; more
        </div>

        {/* CTAs */}
        <div style={{ maxWidth: 340, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Btn label="Choose your language" accent={T.brand} size="lg" fullWidth iconRight={arrow} onClick={() => go('add_language')} />
          <button
            onClick={() => go('dashboard')}
            style={{ padding: 12, fontSize: 13.5, color: T.ink3, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
            Look around first
          </button>
        </div>

      </div>
    </div>
  );
}
Object.assign(window, { WelcomePage });
