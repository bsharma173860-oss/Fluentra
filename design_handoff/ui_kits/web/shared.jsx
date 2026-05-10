// Shared data, icons, flags for the Fluentra prototype.

const LANGUAGES = [
  {
    code: 'es', native: 'Español', english: 'Spanish',
    streak: 14, badges: ['DELE'],
    theme: { bg:'#FFF0EE', accent:'#C04A06', accentLight:'#FFE5DE' },
    nextSession: {
      title: 'Ordering at a café',
      time: '12 min',
      focus: 'Speaking + Listening',
      steps: [
        { ic:'mic',  label:'Pronunciation warm-up', meta:'3 min', done:true },
        { ic:'head', label:'Listen & repeat',       meta:'5 min', done:false },
        { ic:'book', label:'New vocabulary',        meta:'4 min', done:false },
      ],
    },
  },
  {
    code: 'ja', native: '日本語', english: 'Japanese',
    streak: 7, badges: ['JLPT N4'],
    theme: { bg:'#FFF0F5', accent:'#C84070', accentLight:'#FFE0EC' },
    nextSession: {
      title: 'Train station announcements',
      time: '15 min',
      focus: 'Listening',
      steps: [
        { ic:'head', label:'Listen & repeat',   meta:'6 min', done:false },
        { ic:'book', label:'Kanji review · 12', meta:'5 min', done:false },
        { ic:'mic',  label:'Shadowing',         meta:'4 min', done:false },
      ],
    },
  },
  {
    code: 'fr', native: 'Français', english: 'French',
    streak: 21, badges: ['DELF'],
    theme: { bg:'#EEF4FF', accent:'#1558B0', accentLight:'#DDEEFF' },
    nextSession: {
      title: 'Past tense — passé composé',
      time: '10 min',
      focus: 'Grammar',
      steps: [
        { ic:'book', label:'Review rules',        meta:'3 min', done:true },
        { ic:'book', label:'Fill-in-the-blanks',  meta:'4 min', done:false },
        { ic:'mic',  label:'Speak in past tense', meta:'3 min', done:false },
      ],
    },
  },
  {
    code: 'de', native: 'Deutsch', english: 'German',
    streak: 3, badges: ['Goethe A2'],
    theme: { bg:'#FFF7E8', accent:'#A65A00', accentLight:'#FFEAC2' },
    nextSession: {
      title: 'At the bakery',
      time: '8 min',
      focus: 'Vocabulary',
      steps: [
        { ic:'book', label:'New words · 8',    meta:'3 min', done:false },
        { ic:'mic',  label:'Pronounce 5 words', meta:'3 min', done:false },
        { ic:'head', label:'Mini dialogue',    meta:'2 min', done:false },
      ],
    },
  },
];

function levelFor(streak) {
  if (streak < 8)  return { short:'B1', long:'B1 — Intermediate' };
  if (streak < 21) return { short:'B2', long:'B2 — Upper Intermediate' };
  if (streak < 36) return { short:'C1', long:'C1 — Advanced' };
  return { short:'C2', long:'C2 — Mastery' };
}

// SVG flags — hand-drawn, lightweight
function Flag({ code, w=100, h=67, radius=0 }) {
  const wrap = (children) => (
    <div style={{ width:w, height:h, borderRadius:radius, overflow:'hidden', flexShrink:0 }}>
      <svg viewBox="0 0 3 2" width={w} height={h} preserveAspectRatio="none">{children}</svg>
    </div>
  );
  switch (code) {
    case 'es': return wrap(<><rect width="3" height="2" fill="#AA151B"/><rect y=".5" width="3" height="1" fill="#F1BF00"/></>);
    case 'ja': return wrap(<><rect width="3" height="2" fill="#fff"/><circle cx="1.5" cy="1" r=".6" fill="#BC002D"/></>);
    case 'fr': return wrap(<><rect width="1" height="2" fill="#002395"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ED2939"/></>);
    case 'de': return wrap(<><rect width="3" height=".667" fill="#000"/><rect y=".667" width="3" height=".667" fill="#DD0000"/><rect y="1.334" width="3" height=".666" fill="#FFCE00"/></>);
    case 'en': return (
      <div style={{ width:w, height:h, borderRadius:radius, overflow:'hidden', flexShrink:0 }}>
        <svg viewBox="0 0 60 30" width={w} height={h} preserveAspectRatio="none">
          <clipPath id={`s-${code}`}><rect width="60" height="30"/></clipPath>
          <rect width="60" height="30" fill="#012169"/>
          <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" clipPath={`url(#s-${code})`}/>
          <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" clipPath={`url(#s-${code})`}/>
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" clipPath={`url(#s-${code})`}/>
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" clipPath={`url(#s-${code})`}/>
        </svg>
      </div>
    );
    default: return wrap(<rect width="3" height="2" fill="#ccc"/>);
  }
}

// Icon set — inline SVG, currentColor fills
const Icon = {
  flame: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M12 2c0 0-4 4-4 8a4 4 0 008 0c0-4-4-8-4-8z"/><path d="M12 10c0 0-2 2-2 4a2 2 0 004 0c0-2-2-4-2-4z"/></svg>,
  arrow: (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  mic:   (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>,
  book:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  head:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>,
  check: (p={}) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="20 6 9 17 4 12"/></svg>,
  chev:  (p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><polyline points="9 18 15 12 9 6"/></svg>,
  plus:  (p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  bell:  (p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  search:(p={}) => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  home:  (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  bars:  (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  user:  (p={}) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  sparkle:(p={}) => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2L13.5 8.5 20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5L12 2z"/></svg>,
};

// Circular ring — reused on web
function Ring({ pct, size=140, stroke=10, color='#C04A06', trackColor='#F2F2F2', children }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const offset = C - (Math.min(pct,100)/100) * C;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={offset} style={{ transition:'stroke-dashoffset .8s cubic-bezier(.2,.8,.2,1)' }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { LANGUAGES, levelFor, Flag, Icon, Ring });
