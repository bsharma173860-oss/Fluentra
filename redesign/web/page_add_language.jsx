// ── Add Language — picker + onboarding ───────────────────────
function AddLanguagePage() {
  const [picked, setPicked] = useState(null);
  const [added, setAdded] = useState(false); // success state after Add
  const [adding, setAdding] = useState(false);
  const [addErr, setAddErr] = useState('');
  const owned = (typeof window !== 'undefined' && window.__userLanguages ? window.__userLanguages : []).map(l => l.code);
  // Tiered catalog:
  //  • full curriculum + exam track (already in EXAMS map): en, es, ja, fr, de, it, pt, ko, zh, ar, ru, hi, tr
  //  • CEFR-aligned (CATALOG_EXAMS-style fallback): nl, sv, pl, etc — get an auto exam config from examFor()
  //  • placeholder ("coming soon"): less-resourced languages, marked tier:'soon' — added to your dashboard but with limited content
  const fullCatalogue = [
    // Tier 1 — full curriculum + dedicated exam (top 12 most-requested)
    { code:'en', native:'English',     english:'English',    speakers:'1.5B', exam:'IELTS / TOEFL',     accent:'#1D4ED8', light:'#E5ECFB', tier:'full', region:'Europe' },
    { code:'es', native:'Español',     english:'Spanish',    speakers:'560M', exam:'DELE / SIELE',      accent:'#C04A06', light:'#FBEDE2', tier:'full', region:'Europe' },
    { code:'fr', native:'Français',    english:'French',     speakers:'310M', exam:'DELF / DALF',       accent:'#1558B0', light:'#E5EDF8', tier:'full', region:'Europe' },
    { code:'ja', native:'日本語',        english:'Japanese',   speakers:'125M', exam:'JLPT',              accent:'#B0142B', light:'#FBE8EB', tier:'full', region:'Asia' },
    { code:'de', native:'Deutsch',     english:'German',     speakers:'135M', exam:'Goethe-Zertifikat', accent:'#111111', light:'#F4F4F4', tier:'full', region:'Europe' },
    { code:'it', native:'Italiano',    english:'Italian',    speakers:'85M',  exam:'CILS / CELI',       accent:'#0F8A4D', light:'#E9F6EE', tier:'full', region:'Europe' },
    { code:'pt', native:'Português',   english:'Portuguese', speakers:'265M', exam:'CELPE-Bras',        accent:'#0E6F3F', light:'#E7F4EC', tier:'full', region:'Europe' },
    { code:'ko', native:'한국어',         english:'Korean',     speakers:'80M',  exam:'TOPIK',             accent:'#1F4F8C', light:'#E9F0FB', tier:'full', region:'Asia' },
    { code:'zh', native:'中文',           english:'Mandarin',   speakers:'1.1B', exam:'HSK',               accent:'#B0142B', light:'#FBE8EB', tier:'full', region:'Asia' },
    { code:'ar', native:'العربية',       english:'Arabic',     speakers:'310M', exam:'ALPT',              accent:'#0D6E55', light:'#E5F1ED', tier:'full', region:'Middle East' },
    { code:'ru', native:'Русский',      english:'Russian',    speakers:'258M', exam:'TORFL',             accent:'#3D52A0', light:'#ECEFF8', tier:'full', region:'Europe' },
    { code:'hi', native:'हिन्दी',          english:'Hindi',      speakers:'600M', exam:'HPT',               accent:'#C9501C', light:'#FBEDE2', tier:'full', region:'Asia' },
    { code:'tr', native:'Türkçe',      english:'Turkish',    speakers:'80M',  exam:'TYS',               accent:'#B61C2A', light:'#FBE7E9', tier:'full', region:'Europe' },

    // Tier 2 — CEFR-aligned curriculum (15+ languages — full module set, generic exam)
    { code:'nl', native:'Nederlands',  english:'Dutch',      speakers:'24M',  exam:'CNaVT / NT2',       accent:'#1B4FA3', light:'#E5ECF7', tier:'cefr', region:'Europe' },
    { code:'sv', native:'Svenska',     english:'Swedish',    speakers:'10M',  exam:'Swedex / SFI',      accent:'#3A6FA5', light:'#EAF0F7', tier:'cefr', region:'Europe' },
    { code:'no', native:'Norsk',       english:'Norwegian',  speakers:'5M',   exam:'Bergenstesten',     accent:'#BA0C2F', light:'#FBE7EB', tier:'cefr', region:'Europe' },
    { code:'da', native:'Dansk',       english:'Danish',     speakers:'6M',   exam:'Prøve i Dansk',     accent:'#C8102E', light:'#FBE5E9', tier:'cefr', region:'Europe' },
    { code:'fi', native:'Suomi',       english:'Finnish',    speakers:'5.5M', exam:'YKI',               accent:'#003580', light:'#E5EBF4', tier:'cefr', region:'Europe' },
    { code:'pl', native:'Polski',      english:'Polish',     speakers:'45M',  exam:'Państwowy',         accent:'#A6262E', light:'#FBE9EB', tier:'cefr', region:'Europe' },
    { code:'cs', native:'Čeština',     english:'Czech',      speakers:'10M',  exam:'CCE',               accent:'#11457E', light:'#E5EBF3', tier:'cefr', region:'Europe' },
    { code:'el', native:'Ελληνικά',    english:'Greek',      speakers:'13M',  exam:'Ελληνομάθεια',      accent:'#0D5EAF', light:'#E5EEF7', tier:'cefr', region:'Europe' },
    { code:'he', native:'עברית',        english:'Hebrew',     speakers:'9M',   exam:'YAEL',              accent:'#0E5BA8', light:'#E5EDF6', tier:'cefr', region:'Middle East' },
    { code:'th', native:'ภาษาไทย',     english:'Thai',       speakers:'69M',  exam:'CU-TFL',            accent:'#B71C30', light:'#FBE6EA', tier:'cefr', region:'Asia' },
    { code:'vi', native:'Tiếng Việt',  english:'Vietnamese', speakers:'85M',  exam:'VLPT',              accent:'#DA251D', light:'#FBE5E7', tier:'cefr', region:'Asia' },
    { code:'id', native:'Indonesia',   english:'Indonesian', speakers:'199M', exam:'UKBI',              accent:'#CE1126', light:'#FBE5E8', tier:'cefr', region:'Asia' },
    { code:'uk', native:'Українська',  english:'Ukrainian',  speakers:'40M',  exam:'СУМ',               accent:'#005BBB', light:'#E5EFFB', tier:'cefr', region:'Europe' },
    { code:'ro', native:'Română',      english:'Romanian',   speakers:'24M',  exam:'CCSE',              accent:'#002B7F', light:'#E5E9F1', tier:'cefr', region:'Europe' },
    { code:'hu', native:'Magyar',      english:'Hungarian',  speakers:'13M',  exam:'ECL',               accent:'#436F4D', light:'#E9F0EB', tier:'cefr', region:'Europe' },

    // Tier 3 — placeholder content (curriculum coming soon; modules + tutor available)
    { code:'sw', native:'Kiswahili',   english:'Swahili',    speakers:'200M', exam:'KCSE',              accent:'#007A33', light:'#E5F2EC', tier:'soon', region:'Africa' },
    { code:'fa', native:'فارسی',        english:'Persian',    speakers:'110M', exam:'AMFA',              accent:'#239F40', light:'#E5F2E9', tier:'soon', region:'Middle East' },
    { code:'ur', native:'اردو',         english:'Urdu',       speakers:'230M', exam:'NUML',              accent:'#01411C', light:'#E5EEE6', tier:'soon', region:'Asia' },
    { code:'bn', native:'বাংলা',         english:'Bengali',    speakers:'265M', exam:'BPT',               accent:'#006A4E', light:'#E5EFEB', tier:'soon', region:'Asia' },
    { code:'ta', native:'தமிழ்',          english:'Tamil',      speakers:'85M',  exam:'CIIL',              accent:'#C8102E', light:'#FBE5E9', tier:'soon', region:'Asia' },
    { code:'te', native:'తెలుగు',         english:'Telugu',     speakers:'95M',  exam:'CIIL',              accent:'#FF9933', light:'#FFEFD9', tier:'soon', region:'Asia' },
    { code:'mr', native:'मराठी',          english:'Marathi',    speakers:'95M',  exam:'CIIL',              accent:'#FF6B35', light:'#FBE5DA', tier:'soon', region:'Asia' },
    { code:'gu', native:'ગુજરાતી',         english:'Gujarati',   speakers:'56M',  exam:'CIIL',              accent:'#138808', light:'#E5F2E5', tier:'soon', region:'Asia' },
    { code:'ml', native:'മലയാളം',         english:'Malayalam',  speakers:'37M',  exam:'CIIL',              accent:'#1F8A6C', light:'#E5F1ED', tier:'soon', region:'Asia' },
    { code:'kn', native:'ಕನ್ನಡ',           english:'Kannada',    speakers:'45M',  exam:'CIIL',              accent:'#D62828', light:'#FBE5E5', tier:'soon', region:'Asia' },
    { code:'pa', native:'ਪੰਜਾਬੀ',           english:'Punjabi',    speakers:'125M', exam:'CIIL',              accent:'#FF6F00', light:'#FBEAD9', tier:'soon', region:'Asia' },
    { code:'tl', native:'Filipino',    english:'Filipino',   speakers:'45M',  exam:'KWF',               accent:'#0038A8', light:'#E5EBF6', tier:'soon', region:'Asia' },
    { code:'ms', native:'Bahasa Melayu',english:'Malay',     speakers:'77M',  exam:'MUET',              accent:'#CC0001', light:'#FBE5E5', tier:'soon', region:'Asia' },
    { code:'my', native:'မြန်မာ',          english:'Burmese',    speakers:'33M',  exam:'BLPI',              accent:'#FECB00', light:'#FFF8DA', tier:'soon', region:'Asia' },
    { code:'km', native:'ខ្មែរ',           english:'Khmer',      speakers:'17M',  exam:'IFL',               accent:'#032EA1', light:'#E5E9F4', tier:'soon', region:'Asia' },
    { code:'mn', native:'Монгол',      english:'Mongolian',  speakers:'5M',   exam:'MULTC',             accent:'#C4272F', light:'#FBE6E8', tier:'soon', region:'Asia' },
    { code:'ne', native:'नेपाली',          english:'Nepali',     speakers:'32M',  exam:'TU',                accent:'#DC143C', light:'#FBE5E9', tier:'soon', region:'Asia' },
    { code:'si', native:'සිංහල',         english:'Sinhala',    speakers:'17M',  exam:'NIE',               accent:'#FFB000', light:'#FFF4D9', tier:'soon', region:'Asia' },
    { code:'is', native:'Íslenska',    english:'Icelandic',  speakers:'370K', exam:'Íslenskupróf',      accent:'#02529C', light:'#E5ECF6', tier:'soon', region:'Europe' },
    { code:'ga', native:'Gaeilge',     english:'Irish',      speakers:'1.8M', exam:'TEG',               accent:'#169B62', light:'#E5F3EC', tier:'soon', region:'Europe' },
    { code:'cy', native:'Cymraeg',     english:'Welsh',      speakers:'880K', exam:'WJEC',              accent:'#D30731', light:'#FBE5E9', tier:'soon', region:'Europe' },
    { code:'gd', native:'Gàidhlig',    english:'Scottish Gaelic', speakers:'87K', exam:'SQA',           accent:'#0065BD', light:'#E5EEF6', tier:'soon', region:'Europe' },
    { code:'eu', native:'Euskara',     english:'Basque',     speakers:'750K', exam:'HABE',              accent:'#009639', light:'#E5F2E9', tier:'soon', region:'Europe' },
    { code:'ca', native:'Català',      english:'Catalan',    speakers:'10M',  exam:'CPNL',              accent:'#FCDD09', light:'#FFFBDA', tier:'soon', region:'Europe' },
    { code:'gl', native:'Galego',      english:'Galician',   speakers:'2.4M', exam:'CELGA',             accent:'#0072CE', light:'#E5EFF8', tier:'soon', region:'Europe' },
    { code:'sq', native:'Shqip',       english:'Albanian',   speakers:'7.5M', exam:'NDF',               accent:'#E41E20', light:'#FBE5E5', tier:'soon', region:'Europe' },
    { code:'sr', native:'Српски',      english:'Serbian',    speakers:'12M',  exam:'BCS',               accent:'#C6363C', light:'#FBE6E7', tier:'soon', region:'Europe' },
    { code:'hr', native:'Hrvatski',    english:'Croatian',   speakers:'5.6M', exam:'Croaticum',         accent:'#171796', light:'#E5E5F4', tier:'soon', region:'Europe' },
    { code:'sk', native:'Slovenčina',  english:'Slovak',     speakers:'5.2M', exam:'Studia Academica', accent:'#0B4EA2', light:'#E5EBF4', tier:'soon', region:'Europe' },
    { code:'sl', native:'Slovenščina', english:'Slovenian',  speakers:'2.5M', exam:'Center za Slovenščino', accent:'#005DA4', light:'#E5EEF6', tier:'soon', region:'Europe' },
    { code:'bg', native:'Български',   english:'Bulgarian',  speakers:'8M',   exam:'Sofia BG',          accent:'#00966E', light:'#E5F1EC', tier:'soon', region:'Europe' },
    { code:'lv', native:'Latviešu',    english:'Latvian',    speakers:'2M',   exam:'VISC',              accent:'#9E1C32', light:'#FBE6E9', tier:'soon', region:'Europe' },
    { code:'lt', native:'Lietuvių',    english:'Lithuanian', speakers:'3M',   exam:'NEC',               accent:'#FDB913', light:'#FFF6DA', tier:'soon', region:'Europe' },
    { code:'et', native:'Eesti',       english:'Estonian',   speakers:'1.1M', exam:'Innove',            accent:'#0072CE', light:'#E5EFF8', tier:'soon', region:'Europe' },
    { code:'mt', native:'Malti',       english:'Maltese',    speakers:'520K', exam:'Università ta\' Malta', accent:'#CF142B', light:'#FBE5E8', tier:'soon', region:'Europe' },
    { code:'af', native:'Afrikaans',   english:'Afrikaans',  speakers:'7.2M', exam:'NSC',               accent:'#007749', light:'#E5F2EB', tier:'soon', region:'Africa' },
    { code:'zu', native:'isiZulu',     english:'Zulu',       speakers:'12M',  exam:'NSC',               accent:'#000000', light:'#F0F0F0', tier:'soon', region:'Africa' },
    { code:'xh', native:'isiXhosa',    english:'Xhosa',      speakers:'8M',   exam:'NSC',               accent:'#007A4D', light:'#E5F1EC', tier:'soon', region:'Africa' },
    { code:'yo', native:'Yorùbá',      english:'Yoruba',     speakers:'45M',  exam:'WAEC',              accent:'#008751', light:'#E5F2EC', tier:'soon', region:'Africa' },
    { code:'ig', native:'Igbo',        english:'Igbo',       speakers:'27M',  exam:'WAEC',              accent:'#008751', light:'#E5F2EC', tier:'soon', region:'Africa' },
    { code:'ha', native:'Hausa',       english:'Hausa',      speakers:'77M',  exam:'WAEC',              accent:'#008751', light:'#E5F2EC', tier:'soon', region:'Africa' },
    { code:'am', native:'አማርኛ',          english:'Amharic',    speakers:'32M',  exam:'AAU',               accent:'#078930', light:'#E5F1E8', tier:'soon', region:'Africa' },
    { code:'ka', native:'ქართული',     english:'Georgian',   speakers:'3.7M', exam:'GLPT',              accent:'#FF0000', light:'#FFE5E5', tier:'soon', region:'Asia' },
    { code:'hy', native:'Հայերեն',      english:'Armenian',   speakers:'6.7M', exam:'AGBU',              accent:'#0033A0', light:'#E5EAF4', tier:'soon', region:'Asia' },
    { code:'az', native:'Azərbaycanca',english:'Azerbaijani',speakers:'23M',  exam:'TQDK',              accent:'#00B5E2', light:'#E0F4FB', tier:'soon', region:'Asia' },
    { code:'kk', native:'Қазақша',     english:'Kazakh',     speakers:'13M',  exam:'KAZTEST',           accent:'#00ABC9', light:'#E0F4F7', tier:'soon', region:'Asia' },
    { code:'uz', native:'Oʻzbek',      english:'Uzbek',      speakers:'34M',  exam:'DTS',               accent:'#1EB53A', light:'#E5F4E7', tier:'soon', region:'Asia' },
    { code:'ky', native:'Кыргызча',    english:'Kyrgyz',     speakers:'5M',   exam:'KGZ',               accent:'#E8112D', light:'#FBE5E7', tier:'soon', region:'Asia' },
    { code:'tg', native:'Тоҷикӣ',      english:'Tajik',      speakers:'8M',   exam:'TJ-FLT',            accent:'#CC0000', light:'#FBE5E5', tier:'soon', region:'Asia' },
    { code:'eo', native:'Esperanto',   english:'Esperanto',  speakers:'2M',   exam:'KER',               accent:'#089100', light:'#E5F2DF', tier:'soon', region:'Constructed' },
    { code:'la', native:'Latina',      english:'Latin',      speakers:'classical',exam:'Vatican PCL',   accent:'#7C2D12', light:'#F5E5DD', tier:'soon', region:'Classical' },
    { code:'sa', native:'संस्कृतम्',         english:'Sanskrit',   speakers:'classical',exam:'CIIL',          accent:'#FF9933', light:'#FFEFD9', tier:'soon', region:'Classical' },
    { code:'qu', native:'Runa Simi',   english:'Quechua',    speakers:'8M',   exam:'IBT',               accent:'#D90000', light:'#FBE5E5', tier:'soon', region:'Americas' },
    { code:'haw',native:'ʻŌlelo Hawaiʻi',english:'Hawaiian', speakers:'18K',  exam:'UH',                accent:'#CE1126', light:'#FBE5E8', tier:'soon', region:'Oceania' },
    { code:'mi', native:'Te Reo Māori',english:'Māori',      speakers:'186K', exam:'NCEA',              accent:'#000000', light:'#F0F0F0', tier:'soon', region:'Oceania' },
    { code:'sm', native:'Gagana Sāmoa',english:'Samoan',     speakers:'510K', exam:'NCEA',              accent:'#0033A0', light:'#E5EAF4', tier:'soon', region:'Oceania' },
    { code:'to', native:'Faka-Tonga',  english:'Tongan',     speakers:'190K', exam:'TIOE',              accent:'#C10000', light:'#FBE5E5', tier:'soon', region:'Oceania' },
    { code:'jv', native:'Basa Jawa',   english:'Javanese',   speakers:'82M',  exam:'UNJ',               accent:'#A91827', light:'#FBE6E8', tier:'soon', region:'Asia' },
    { code:'su', native:'Basa Sunda',  english:'Sundanese',  speakers:'40M',  exam:'UPI',               accent:'#FFB81C', light:'#FFF4D9', tier:'soon', region:'Asia' },
    { code:'lo', native:'ລາວ',          english:'Lao',        speakers:'30M',  exam:'NUOL',              accent:'#CE1126', light:'#FBE5E8', tier:'soon', region:'Asia' },
    { code:'ps', native:'پښتو',         english:'Pashto',     speakers:'45M',  exam:'KU',                accent:'#000000', light:'#F0F0F0', tier:'soon', region:'Asia' },
    { code:'so', native:'Soomaali',    english:'Somali',     speakers:'22M',  exam:'BMG',               accent:'#418FDE', light:'#E5EFFB', tier:'soon', region:'Africa' },
    { code:'rw', native:'Ikinyarwanda',english:'Kinyarwanda',speakers:'12M',  exam:'UR',                accent:'#00A1DE', light:'#E0F4FB', tier:'soon', region:'Africa' },
  ];

  // Only the 26 languages that actually work end-to-end (Whisper speaking + content engine)
  const LIVE = ['en','es','fr','de','it','pt','nl','ru','pl','uk','sv','no','da','fi','el','cs','ro','hu','tr','ar','hi','zh','ja','ko','id','vi'];
  const catalogue = fullCatalogue.filter(l => LIVE.includes(l.code) && !owned.includes(l.code));

  // Region filter chips
  const allRegions = ['All', 'Europe', 'Asia', 'Middle East'];
  const [region, setRegion] = useState('All');
  const [query, setQuery] = useState('');
  const visible = catalogue.filter(l => {
    if (region !== 'All' && l.region !== region) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!l.english.toLowerCase().includes(q) && !l.native.toLowerCase().includes(q) && !l.code.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const popular = catalogue.filter(l => l.tier === 'full').slice(0, 3);
  const tierLabel = {
    full: { label:'Full curriculum', color:'#0F8A4D' },
    cefr: { label:'CEFR · core modules', color:'#1558B0' },
    soon: { label:'Beta · early access', color:'#A65A00' },
  };

  const goalsList = [
    { id:'travel',  ic:'world',  label:'Travel & culture',     desc:'Conversational basics, food, directions' },
    { id:'work',    ic:'check',  label:'Work & business',      desc:'Meetings, emails, professional vocab' },
    { id:'exam',    ic:'trophy', label:'Pass an exam',         desc:'IELTS, DELE, JLPT, DELF, etc.' },
    { id:'family',  ic:'users',  label:'Family & heritage',    desc:'Reconnect with roots, talk to relatives' },
    { id:'study',   ic:'book',   label:'Academic study',       desc:'University, research, reading dense text' },
    { id:'fun',     ic:'spark',  label:'Just for fun',         desc:'Hobby, media, games, no pressure' },
  ];
  const minutesList = [5, 10, 15, 30, 60];
  const levelList = ['A0 — Brand new','A1 — A few words','A2 — Basic','B1 — Intermediate','B2 — Upper-int','C1 — Advanced'];

  const [step, setStep] = useState(0); // 0 pick / 1 onboard
  const [goal, setGoal] = useState('travel');
  const [minutes, setMinutes] = useState(15);
  const [level, setLevel] = useState(0);

  // Success state — appears after user clicks Add
  if (added && picked) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <WebTopbar/>
        <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40, background: picked.light }}>
          <div style={{ width:'100%', maxWidth:520, background:T.card, borderRadius:24, padding:'40px 36px', textAlign:'center', boxShadow:'0 20px 60px rgba(0,0,0,.08)' }}>
            <div style={{ width:96, height:60, margin:'0 auto 22px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Flag code={picked.code} w={88} h={56} radius={8}/>
            </div>
            <div style={{ fontSize:11, fontWeight:700, color:picked.accent, letterSpacing:'.16em', textTransform:'uppercase', marginBottom:10 }}>Welcome to {picked.english}</div>
            <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.1, marginBottom:14 }}>{picked.native} added</div>
            <div style={{ fontSize:14, color:T.ink3, lineHeight:1.55, marginBottom:26 }}>Your AI is generating your first {picked.english} lesson now. You can find it in the sidebar — or jump straight in.</div>

            <div style={{ background:T.bg2, borderRadius:14, padding:'14px 16px', marginBottom:22, textAlign:'left' }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Your setup</div>
              {[
                ['Daily target', `${minutes} min`],
                ['Goal', goalsList.find(g => g.id === goal)?.label || goal],
                ['Starting level', levelList[level]?.split(' — ')[0] || 'A0'],
                ['Exam track', picked.exam],
              ].map(([l,v]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', fontSize:13, borderBottom:`1px solid ${T.hairline}` }}>
                  <span style={{ color:T.ink4 }}>{l}</span><span style={{ color:T.ink, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <Btn label={`Open ${picked.english}`} accent={picked.accent} size="lg" fullWidth iconRight={Icon.arrow({ width:13, height:13 })} onClick={() => { window.__nav('lang'); }}/>
              <button onClick={() => window.__nav('dashboard')} style={{ padding:12, fontSize:13, color:T.ink3, background:'transparent', cursor:'pointer', fontWeight:600 }}>Back to dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!picked || step === 0) {
    return (
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <WebTopbar/>
        <div style={{ flex:1, overflow:'auto', padding:'40px 36px 60px' }}>
          <div style={{ maxWidth:980, margin:'0 auto' }}>
            <PageHeader eyebrow="Add a language" title={`Pick from ${catalogue.length} languages`} subtitle="Every language gets its own course, exam track, and tutor. Top 12 ship with full curriculum + dedicated exam prep — the rest run on a CEFR-aligned core, with new content packs landing weekly."/>

            <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14, padding:'10px 14px', background:T.bg2, borderRadius:11, border:`1px solid ${T.border}` }}>
              {Icon.search({ width:14, height:14, style:{ color:T.ink4 } })}
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by language, code, or country…" style={{ flex:1, background:'transparent', border:'none', outline:'none', fontSize:13.5, color:T.ink, fontFamily:T.sans }}/>
              <span style={{ fontSize:11, color:T.ink4 }}>{visible.length} match{visible.length === 1 ? '' : 'es'}</span>
            </div>

            {/* Region filter chips */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:24 }}>
              {allRegions.map(r => (
                <button key={r} onClick={() => setRegion(r)} style={{ padding:'6px 12px', borderRadius:999, fontSize:11.5, fontWeight:600, border:`1px solid ${region === r ? T.ink : T.border}`, background: region === r ? T.ink : T.card, color: region === r ? '#fff' : T.ink2, cursor:'pointer' }}>{r}</button>
              ))}
            </div>

            {/* Most popular — only when region/query is empty */}
            {region === 'All' && !query && popular.length > 0 && (
              <>
                <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:14 }}>Most popular</div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:14, marginBottom:32 }}>
                  {popular.map(l => (
                    <button key={l.code} onClick={() => { setPicked(l); setStep(1); }} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:16, padding:18, textAlign:'left', cursor:'pointer', display:'flex', flexDirection:'column', gap:14, transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = l.accent; e.currentTarget.style.boxShadow = `0 4px 16px ${l.accent}1a`; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.boxShadow = 'none'; }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <Flag code={l.code} w={42} h={28} radius={4}/>
                        <Chip label={l.exam} accent={l.accent} bg={l.light} style={{ fontSize:10 }}/>
                      </div>
                      <div>
                        <div style={{ fontFamily:T.serif, fontSize:26, color:T.ink, lineHeight:1.05, marginBottom:4 }}>{l.native}</div>
                        <div style={{ fontSize:13, color:T.ink3, fontWeight:500 }}>{l.english}</div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:T.ink4 }}>
                        {Icon.users({ width:11, height:11 })}
                        <span>{l.speakers} speakers · {l.region}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase' }}>{region === 'All' && !query ? 'All languages' : `${region === 'All' ? 'Search' : region} (${visible.length})`}</div>
              <div style={{ display:'flex', gap:14, fontSize:10.5, color:T.ink4 }}>
                {Object.entries(tierLabel).map(([k, v]) => (
                  <span key={k} style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <span style={{ width:6, height:6, borderRadius:3, background:v.color }}/>
                    {v.label}
                  </span>
                ))}
              </div>
            </div>

            {visible.length === 0 ? (
              <div style={{ background:T.card, border:`1px dashed ${T.border}`, borderRadius:13, padding:'40px 20px', textAlign:'center', color:T.ink4, fontSize:13 }}>
                No languages match. Try a different region or clear your search.
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:10 }}>
                {visible.map(l => {
                  const tl = tierLabel[l.tier] || tierLabel.cefr;
                  return (
                    <button key={l.code} onClick={() => { setPicked(l); setStep(1); }} style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:13, padding:'14px 14px', textAlign:'left', cursor:'pointer', display:'flex', flexDirection:'column', gap:10, position:'relative', transition:'all .15s' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = l.accent; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <Flag code={l.code} w={32} h={22} radius={3}/>
                        <span style={{ width:6, height:6, borderRadius:3, background:tl.color }} title={tl.label}/>
                      </div>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:T.ink, lineHeight:1.15 }}>{l.english}</div>
                        <div style={{ fontSize:11.5, color:T.ink4, marginTop:2, fontFamily:T.sans }}>{l.native}</div>
                      </div>
                      <div style={{ fontSize:10.5, color:T.ink5, marginTop:'auto', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span>{l.exam}</span>
                        <span>{l.speakers}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Onboarding
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar/>
      <div style={{ flex:1, overflow:'auto', padding:'40px 36px 60px' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          {/* Hero */}
          <div style={{ background:picked.accent, borderRadius:22, padding:'30px 32px', color:'#fff', marginBottom:24, display:'flex', alignItems:'center', gap:18, position:'relative' }}>
            {picked.tier === 'soon' && (
              <span style={{ position:'absolute', top:14, right:14, padding:'4px 10px', borderRadius:999, background:'rgba(255,255,255,.18)', border:'1px solid rgba(255,255,255,.3)', fontSize:10.5, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>Beta · Early access</span>
            )}
            <Flag code={picked.code} w={64} h={42} radius={6}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:11.5, color:'rgba(255,255,255,.75)', fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:6 }}>You picked</div>
              <div style={{ fontFamily:T.serif, fontSize:34, lineHeight:1.05 }}>{picked.native}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,.85)', marginTop:4 }}>{picked.english} · {picked.speakers} speakers · Targets {picked.exam}</div>
              {picked.tier === 'cefr' && <div style={{ fontSize:11.5, color:'rgba(255,255,255,.78)', marginTop:6, fontStyle:'italic' }}>CEFR-aligned curriculum — full module set, generic exam format.</div>}
              {picked.tier === 'soon' && <div style={{ fontSize:11.5, color:'rgba(255,255,255,.78)', marginTop:6, fontStyle:'italic' }}>Early-access content. Tutor + flashcards live; structured course rolls out monthly.</div>}
            </div>
            <button onClick={() => { setPicked(null); setStep(0); }} style={{ background:'rgba(255,255,255,.16)', border:'1px solid rgba(255,255,255,.25)', color:'#fff', fontSize:12, fontWeight:600, padding:'7px 12px', borderRadius:9, cursor:'pointer' }}>Change</button>
          </div>

          {/* Goal */}
          <Card padding={22} style={{ marginBottom:18 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>What's your goal?</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              {goalsList.map(g => (
                <button key={g.id} onClick={() => setGoal(g.id)} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 14px', borderRadius:11, border:`1.5px solid ${goal===g.id ? picked.accent : T.border}`, background: goal===g.id ? picked.light : T.card, textAlign:'left', cursor:'pointer' }}>
                  <div style={{ width:32, height:32, borderRadius:8, background: goal===g.id ? picked.accent : T.bg2, color: goal===g.id ? '#fff' : T.ink3, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{Icon[g.ic] && Icon[g.ic]({ width:14, height:14 })}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{g.label}</div>
                    <div style={{ fontSize:10.5, color:T.ink4, marginTop:1 }}>{g.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Daily target */}
          <Card padding={22} style={{ marginBottom:18 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>Daily target</div>
            <div style={{ display:'flex', gap:6 }}>
              {minutesList.map(m => (
                <button key={m} onClick={() => setMinutes(m)} style={{ flex:1, padding:'10px 0', borderRadius:10, border:`1.5px solid ${minutes===m ? picked.accent : T.border}`, background: minutes===m ? picked.light : T.card, fontSize:13, fontWeight:700, color: minutes===m ? picked.accent : T.ink2, cursor:'pointer' }}>{m} min</button>
              ))}
            </div>
            <div style={{ fontSize:11.5, color:T.ink4, marginTop:10 }}>You can change this anytime in Settings.</div>
          </Card>

          {/* Current level */}
          <Card padding={22} style={{ marginBottom:24 }}>
            <div style={{ fontSize:12.5, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:12 }}>What's your current level?</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              {levelList.map((lv, i) => (
                <button key={i} onClick={() => setLevel(i)} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderRadius:10, border:`1.5px solid ${level===i ? picked.accent : T.border}`, background: level===i ? picked.light : T.card, textAlign:'left', cursor:'pointer' }}>
                  <div style={{ width:18, height:18, borderRadius:9, border:`2px solid ${level===i ? picked.accent : T.ink5}`, background: level===i ? picked.accent : 'transparent', flexShrink:0, position:'relative' }}>
                    {level===i && <div style={{ position:'absolute', inset:3, borderRadius:6, background:'#fff' }}/>}
                  </div>
                  <span style={{ fontSize:13, color:T.ink, fontWeight: level===i ? 700 : 500 }}>{lv}</span>
                </button>
              ))}
            </div>
            <div style={{ marginTop:12, padding:'10px 12px', background:T.bg2, borderRadius:9, fontSize:12, color:T.ink3, lineHeight:1.5 }}>
              {Icon.spark({ width:11, height:11, style:{ color:picked.accent, marginRight:4 } })}
              Take a 4-minute placement test after setup for an accurate level.
            </div>
          </Card>

          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => { setPicked(null); setStep(0); }} style={{ padding:'14px 22px', borderRadius:12, border:`1px solid ${T.border}`, background:T.card, color:T.ink2, fontSize:13, fontWeight:600, cursor:'pointer' }}>Back</button>
            <Btn label={adding ? 'Adding…' : `Add ${picked.english} to my languages`} accent={picked.accent} size="lg" iconRight={Icon.arrow({ width:13, height:13 })} style={{ flex:1 }} onClick={() => {
              if (adding) return;
              setAddErr('');
              const newLang = {
                code: picked.code,
                native: picked.native,
                english: picked.english,
                level: ['A0','A1','A2','B1','B2','C1'][level] || 'A1',
                exam: picked.exam,
              };
              window.__langCode = picked.code;
              if (window.FL && window.FL.addLanguage) {
                setAdding(true);
                window.FL.addLanguage(newLang).then(function () {
                  window.__justAddedLang = picked.code;
                  setAdding(false); setAdded(true);
                }).catch(function (e) {
                  setAdding(false);
                  setAddErr((e && e.message) || 'Could not add the language — make sure you are signed in and the database schema has been run.');
                });
              } else {
                setAddErr('Backend not loaded — refresh the page. (window.FL is missing)');
              }
            }}/>
          </div>
          {addErr && <div style={{ marginTop:12, padding:'10px 14px', borderRadius:10, background:'rgba(198,40,40,.08)', border:'1px solid rgba(198,40,40,.25)', color:'#C62828', fontSize:12.5, fontWeight:600 }}>{addErr}</div>}
          <div style={{ display:'none' }}>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AddLanguagePage });
