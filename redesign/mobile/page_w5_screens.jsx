// ── Mobile · Wave 5b · Reader/Tutor/Exams/Social ───────────────────
// MArticleReader, MTutorCall, MTutorHistory, MExamBook, MExamHistory,
// MPublicProfile, MDMThread, MActivityFeed

// ── Article reader ─────────────────────────────────────────────────
function MBubble({ side, children }) {
  const me = side === 'me';
  return (
    <div style={{ display:'flex', justifyContent: me ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth:'82%', padding:'9px 13px', borderRadius: me ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: me ? T.brand : T.card, color: me ? '#fff' : T.ink, fontSize:13, lineHeight:1.5, border: me ? 'none' : `1px solid ${T.border}`, boxShadow: me ? 'none' : MT.shadowSm }}>
        {children}
      </div>
    </div>
  );
}

// ── Activity feed ──────────────────────────────────────────────────