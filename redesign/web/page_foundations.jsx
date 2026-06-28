// ── Foundations track (Feature C) ────────────────────────────
// The absolute-beginner journey: Alphabet -> Phonics -> First words ->
// Sentences -> Translation. The Alphabet and First-words stages are CURATED
// static data + browser TTS (window.flSpeak), so they work with no AI/credits.
// Later stages are AI-powered and surface honestly when generation is live.

// Curated scripts. Each letter: { ch, name, ex?, gloss? } (ex = example word in
// the target language; romaji carried in `name` for non-Latin scripts).
const FOUND_ALPHABETS = {
  en: { script:'the Latin alphabet', note:'26 letters. Tap any letter to hear it, then the example word.', letters:[
    {ch:'A',name:'ay',ex:'Apple'},{ch:'B',name:'bee',ex:'Ball'},{ch:'C',name:'see',ex:'Cat'},{ch:'D',name:'dee',ex:'Dog'},{ch:'E',name:'ee',ex:'Egg'},{ch:'F',name:'ef',ex:'Fish'},{ch:'G',name:'gee',ex:'Goat'},{ch:'H',name:'aitch',ex:'Hat'},{ch:'I',name:'eye',ex:'Ink'},{ch:'J',name:'jay',ex:'Jam'},{ch:'K',name:'kay',ex:'Key'},{ch:'L',name:'el',ex:'Lion'},{ch:'M',name:'em',ex:'Moon'},{ch:'N',name:'en',ex:'Nose'},{ch:'O',name:'oh',ex:'Orange'},{ch:'P',name:'pee',ex:'Pen'},{ch:'Q',name:'cue',ex:'Queen'},{ch:'R',name:'ar',ex:'Rain'},{ch:'S',name:'ess',ex:'Sun'},{ch:'T',name:'tee',ex:'Tree'},{ch:'U',name:'you',ex:'Umbrella'},{ch:'V',name:'vee',ex:'Van'},{ch:'W',name:'double-u',ex:'Water'},{ch:'X',name:'ex',ex:'Box'},{ch:'Y',name:'why',ex:'Yellow'},{ch:'Z',name:'zee',ex:'Zebra'},
  ]},
  es: { script:'el alfabeto español', note:'27 letters including ñ. Tap a letter to hear its Spanish name, then the example word.', letters:[
    {ch:'A',name:'a',ex:'Agua',gloss:'water'},{ch:'B',name:'be',ex:'Bueno',gloss:'good'},{ch:'C',name:'ce',ex:'Casa',gloss:'house'},{ch:'D',name:'de',ex:'Día',gloss:'day'},{ch:'E',name:'e',ex:'Estrella',gloss:'star'},{ch:'F',name:'efe',ex:'Familia',gloss:'family'},{ch:'G',name:'ge',ex:'Gato',gloss:'cat'},{ch:'H',name:'hache',ex:'Hola',gloss:'hello'},{ch:'I',name:'i',ex:'Isla',gloss:'island'},{ch:'J',name:'jota',ex:'Jugar',gloss:'to play'},{ch:'K',name:'ka',ex:'Kilo',gloss:'kilo'},{ch:'L',name:'ele',ex:'Luna',gloss:'moon'},{ch:'M',name:'eme',ex:'Mano',gloss:'hand'},{ch:'N',name:'ene',ex:'Noche',gloss:'night'},{ch:'Ñ',name:'eñe',ex:'Niño',gloss:'child'},{ch:'O',name:'o',ex:'Ojo',gloss:'eye'},{ch:'P',name:'pe',ex:'Perro',gloss:'dog'},{ch:'Q',name:'cu',ex:'Queso',gloss:'cheese'},{ch:'R',name:'erre',ex:'Rojo',gloss:'red'},{ch:'S',name:'ese',ex:'Sol',gloss:'sun'},{ch:'T',name:'te',ex:'Tierra',gloss:'earth'},{ch:'U',name:'u',ex:'Uno',gloss:'one'},{ch:'V',name:'uve',ex:'Verde',gloss:'green'},{ch:'W',name:'uve doble',ex:'Web',gloss:'web'},{ch:'X',name:'equis',ex:'Éxito',gloss:'success'},{ch:'Y',name:'ye',ex:'Yo',gloss:'I'},{ch:'Z',name:'zeta',ex:'Zapato',gloss:'shoe'},
  ]},
  fr: { script:"l'alphabet français", note:'26 letters. Tap a letter to hear its French name, then the example word.', letters:[
    {ch:'A',name:'a',ex:'Ami',gloss:'friend'},{ch:'B',name:'bé',ex:'Bonjour',gloss:'hello'},{ch:'C',name:'cé',ex:'Chat',gloss:'cat'},{ch:'D',name:'dé',ex:'Deux',gloss:'two'},{ch:'E',name:'eu',ex:'Eau',gloss:'water'},{ch:'F',name:'ef',ex:'Fleur',gloss:'flower'},{ch:'G',name:'jé',ex:'Gâteau',gloss:'cake'},{ch:'H',name:'ash',ex:'Heure',gloss:'hour'},{ch:'I',name:'i',ex:'Île',gloss:'island'},{ch:'J',name:'ji',ex:'Jour',gloss:'day'},{ch:'K',name:'ka',ex:'Kiwi',gloss:'kiwi'},{ch:'L',name:'el',ex:'Lune',gloss:'moon'},{ch:'M',name:'em',ex:'Maison',gloss:'house'},{ch:'N',name:'en',ex:'Nuit',gloss:'night'},{ch:'O',name:'o',ex:'Oiseau',gloss:'bird'},{ch:'P',name:'pé',ex:'Pain',gloss:'bread'},{ch:'Q',name:'ku',ex:'Quatre',gloss:'four'},{ch:'R',name:'er',ex:'Rouge',gloss:'red'},{ch:'S',name:'es',ex:'Soleil',gloss:'sun'},{ch:'T',name:'té',ex:'Temps',gloss:'time'},{ch:'U',name:'u',ex:'Un',gloss:'one'},{ch:'V',name:'vé',ex:'Vert',gloss:'green'},{ch:'W',name:'double vé',ex:'Wagon',gloss:'wagon'},{ch:'X',name:'iks',ex:'Taxi',gloss:'taxi'},{ch:'Y',name:'i grec',ex:'Yeux',gloss:'eyes'},{ch:'Z',name:'zed',ex:'Zéro',gloss:'zero'},
  ]},
  ja: { script:'hiragana (ひらがな)', note:'The 46 base hiragana. Tap a character to hear its sound; the romaji shows how to read it.', letters:[
    {ch:'あ',name:'a'},{ch:'い',name:'i'},{ch:'う',name:'u'},{ch:'え',name:'e'},{ch:'お',name:'o'},
    {ch:'か',name:'ka'},{ch:'き',name:'ki'},{ch:'く',name:'ku'},{ch:'け',name:'ke'},{ch:'こ',name:'ko'},
    {ch:'さ',name:'sa'},{ch:'し',name:'shi'},{ch:'す',name:'su'},{ch:'せ',name:'se'},{ch:'そ',name:'so'},
    {ch:'た',name:'ta'},{ch:'ち',name:'chi'},{ch:'つ',name:'tsu'},{ch:'て',name:'te'},{ch:'と',name:'to'},
    {ch:'な',name:'na'},{ch:'に',name:'ni'},{ch:'ぬ',name:'nu'},{ch:'ね',name:'ne'},{ch:'の',name:'no'},
    {ch:'は',name:'ha'},{ch:'ひ',name:'hi'},{ch:'ふ',name:'fu'},{ch:'へ',name:'he'},{ch:'ほ',name:'ho'},
    {ch:'ま',name:'ma'},{ch:'み',name:'mi'},{ch:'む',name:'mu'},{ch:'め',name:'me'},{ch:'も',name:'mo'},
    {ch:'や',name:'ya'},{ch:'ゆ',name:'yu'},{ch:'よ',name:'yo'},
    {ch:'ら',name:'ra'},{ch:'り',name:'ri'},{ch:'る',name:'ru'},{ch:'れ',name:'re'},{ch:'ろ',name:'ro'},
    {ch:'わ',name:'wa'},{ch:'を',name:'wo'},{ch:'ん',name:'n'},
  ]},
  ko: { script:'Hangul (한글)', note:'14 consonants and 10 vowels. Korean letters stack into syllable blocks — learn the parts first. Tap to hear each.', letters:[
    {ch:'ㄱ',name:'g/k'},{ch:'ㄴ',name:'n'},{ch:'ㄷ',name:'d/t'},{ch:'ㄹ',name:'r/l'},{ch:'ㅁ',name:'m'},{ch:'ㅂ',name:'b/p'},{ch:'ㅅ',name:'s'},{ch:'ㅇ',name:'ng/—'},{ch:'ㅈ',name:'j'},{ch:'ㅊ',name:'ch'},{ch:'ㅋ',name:'k'},{ch:'ㅌ',name:'t'},{ch:'ㅍ',name:'p'},{ch:'ㅎ',name:'h'},
    {ch:'ㅏ',name:'a'},{ch:'ㅑ',name:'ya'},{ch:'ㅓ',name:'eo'},{ch:'ㅕ',name:'yeo'},{ch:'ㅗ',name:'o'},{ch:'ㅛ',name:'yo'},{ch:'ㅜ',name:'u'},{ch:'ㅠ',name:'yu'},{ch:'ㅡ',name:'eu'},{ch:'ㅣ',name:'i'},
  ]},
  ru: { script:'the Cyrillic alphabet (кириллица)', note:'33 letters. Some look like Latin letters but sound different — tap each to hear it.', letters:[
    {ch:'А',name:'a'},{ch:'Б',name:'b'},{ch:'В',name:'v'},{ch:'Г',name:'g'},{ch:'Д',name:'d'},{ch:'Е',name:'ye'},{ch:'Ё',name:'yo'},{ch:'Ж',name:'zh'},{ch:'З',name:'z'},{ch:'И',name:'i'},{ch:'Й',name:'y'},{ch:'К',name:'k'},{ch:'Л',name:'l'},{ch:'М',name:'m'},{ch:'Н',name:'n'},{ch:'О',name:'o'},{ch:'П',name:'p'},{ch:'Р',name:'r'},{ch:'С',name:'s'},{ch:'Т',name:'t'},{ch:'У',name:'u'},{ch:'Ф',name:'f'},{ch:'Х',name:'kh'},{ch:'Ц',name:'ts'},{ch:'Ч',name:'ch'},{ch:'Ш',name:'sh'},{ch:'Щ',name:'shch'},{ch:'Ъ',name:'hard'},{ch:'Ы',name:'y'},{ch:'Ь',name:'soft'},{ch:'Э',name:'e'},{ch:'Ю',name:'yu'},{ch:'Я',name:'ya'},
  ]},
  ar: { script:'the Arabic abjad (الأبجدية)', rtl:true, note:'28 letters, written right to left. These are the isolated forms — tap each to hear its sound.', letters:[
    {ch:'ا',name:'alif (a)'},{ch:'ب',name:'b'},{ch:'ت',name:'t'},{ch:'ث',name:'th'},{ch:'ج',name:'j'},{ch:'ح',name:'ḥ'},{ch:'خ',name:'kh'},{ch:'د',name:'d'},{ch:'ذ',name:'dh'},{ch:'ر',name:'r'},{ch:'ز',name:'z'},{ch:'س',name:'s'},{ch:'ش',name:'sh'},{ch:'ص',name:'ṣ'},{ch:'ض',name:'ḍ'},{ch:'ط',name:'ṭ'},{ch:'ظ',name:'ẓ'},{ch:'ع',name:'ʿayn'},{ch:'غ',name:'gh'},{ch:'ف',name:'f'},{ch:'ق',name:'q'},{ch:'ك',name:'k'},{ch:'ل',name:'l'},{ch:'م',name:'m'},{ch:'ن',name:'n'},{ch:'ه',name:'h'},{ch:'و',name:'w'},{ch:'ي',name:'y'},
  ]},
  hi: { script:'Devanagari (देवनागरी)', note:'Vowels (svar) come first, then consonants (vyanjan). Tap each to hear it.', letters:[
    {ch:'अ',name:'a'},{ch:'आ',name:'ā'},{ch:'इ',name:'i'},{ch:'ई',name:'ī'},{ch:'उ',name:'u'},{ch:'ऊ',name:'ū'},{ch:'ए',name:'e'},{ch:'ऐ',name:'ai'},{ch:'ओ',name:'o'},{ch:'औ',name:'au'},
    {ch:'क',name:'ka'},{ch:'ख',name:'kha'},{ch:'ग',name:'ga'},{ch:'घ',name:'gha'},{ch:'च',name:'cha'},{ch:'छ',name:'chha'},{ch:'ज',name:'ja'},{ch:'झ',name:'jha'},{ch:'ट',name:'ṭa'},{ch:'ठ',name:'ṭha'},{ch:'ड',name:'ḍa'},{ch:'ढ',name:'ḍha'},{ch:'ण',name:'ṇa'},{ch:'त',name:'ta'},{ch:'थ',name:'tha'},{ch:'द',name:'da'},{ch:'ध',name:'dha'},{ch:'न',name:'na'},{ch:'प',name:'pa'},{ch:'फ',name:'pha'},{ch:'ब',name:'ba'},{ch:'भ',name:'bha'},{ch:'म',name:'ma'},{ch:'य',name:'ya'},{ch:'र',name:'ra'},{ch:'ल',name:'la'},{ch:'व',name:'va'},{ch:'श',name:'sha'},{ch:'ष',name:'ṣha'},{ch:'स',name:'sa'},{ch:'ह',name:'ha'},
  ]},
};
const FOUND_LATIN_FALLBACK = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(function (c) { return { ch:c, name:c.toLowerCase() }; });

// Curated survival words (work with no AI). gloss = English.
const FOUND_WORDS = {
  en: [{w:'Hello',g:'greeting'},{w:'Thank you',g:'gratitude'},{w:'Yes',g:'affirm'},{w:'No',g:'deny'},{w:'Please',g:'request'},{w:'Water',g:'drink'},{w:'Food',g:'eat'},{w:'Help',g:'assistance'},{w:'Sorry',g:'apology'},{w:'Goodbye',g:'parting'}],
  es: [{w:'Hola',g:'hello'},{w:'Gracias',g:'thank you'},{w:'Sí',g:'yes'},{w:'No',g:'no'},{w:'Por favor',g:'please'},{w:'Agua',g:'water'},{w:'Comida',g:'food'},{w:'Ayuda',g:'help'},{w:'Perdón',g:'sorry'},{w:'Adiós',g:'goodbye'}],
  fr: [{w:'Bonjour',g:'hello'},{w:'Merci',g:'thank you'},{w:'Oui',g:'yes'},{w:'Non',g:'no'},{w:"S'il vous plaît",g:'please'},{w:'Eau',g:'water'},{w:'Nourriture',g:'food'},{w:'Aide',g:'help'},{w:'Pardon',g:'sorry'},{w:'Au revoir',g:'goodbye'}],
  ja: [{w:'こんにちは',g:'hello',r:'konnichiwa'},{w:'ありがとう',g:'thank you',r:'arigatō'},{w:'はい',g:'yes',r:'hai'},{w:'いいえ',g:'no',r:'iie'},{w:'お願いします',g:'please',r:'onegai shimasu'},{w:'水',g:'water',r:'mizu'},{w:'食べ物',g:'food',r:'tabemono'},{w:'助けて',g:'help',r:'tasukete'},{w:'ごめんなさい',g:'sorry',r:'gomen nasai'},{w:'さようなら',g:'goodbye',r:'sayōnara'}],
  ko: [{w:'안녕하세요',g:'hello',r:'annyeonghaseyo'},{w:'감사합니다',g:'thank you',r:'gamsahamnida'},{w:'네',g:'yes',r:'ne'},{w:'아니요',g:'no',r:'aniyo'},{w:'제발',g:'please',r:'jebal'},{w:'물',g:'water',r:'mul'},{w:'음식',g:'food',r:'eumsik'},{w:'도와주세요',g:'help',r:'dowajuseyo'},{w:'죄송합니다',g:'sorry',r:'joesonghamnida'},{w:'안녕히 가세요',g:'goodbye',r:'annyeonghi gaseyo'}],
  ru: [{w:'Здравствуйте',g:'hello',r:'zdravstvuyte'},{w:'Спасибо',g:'thank you',r:'spasibo'},{w:'Да',g:'yes',r:'da'},{w:'Нет',g:'no',r:'net'},{w:'Пожалуйста',g:'please',r:'pozhaluysta'},{w:'Вода',g:'water',r:'voda'},{w:'Еда',g:'food',r:'yeda'},{w:'Помогите',g:'help',r:'pomogite'},{w:'Извините',g:'sorry',r:'izvinite'},{w:'До свидания',g:'goodbye',r:'do svidaniya'}],
  ar: [{w:'مرحبا',g:'hello',r:'marḥaban'},{w:'شكرا',g:'thank you',r:'shukran'},{w:'نعم',g:'yes',r:'naʿam'},{w:'لا',g:'no',r:'lā'},{w:'من فضلك',g:'please',r:'min faḍlik'},{w:'ماء',g:'water',r:'māʾ'},{w:'طعام',g:'food',r:'ṭaʿām'},{w:'مساعدة',g:'help',r:'musāʿada'},{w:'آسف',g:'sorry',r:'āsif'},{w:'مع السلامة',g:'goodbye',r:'maʿa s-salāma'}],
  hi: [{w:'नमस्ते',g:'hello',r:'namaste'},{w:'धन्यवाद',g:'thank you',r:'dhanyavād'},{w:'हाँ',g:'yes',r:'hāṃ'},{w:'नहीं',g:'no',r:'nahīṃ'},{w:'कृपया',g:'please',r:'kṛpayā'},{w:'पानी',g:'water',r:'pānī'},{w:'खाना',g:'food',r:'khānā'},{w:'मदद',g:'help',r:'madad'},{w:'माफ़ करें',g:'sorry',r:'māf kareṃ'},{w:'अलविदा',g:'goodbye',r:'alvidā'}],
  zh: [{w:'你好',g:'hello',r:'nǐ hǎo'},{w:'谢谢',g:'thank you',r:'xièxie'},{w:'是',g:'yes',r:'shì'},{w:'不',g:'no',r:'bù'},{w:'请',g:'please',r:'qǐng'},{w:'水',g:'water',r:'shuǐ'},{w:'食物',g:'food',r:'shíwù'},{w:'帮助',g:'help',r:'bāngzhù'},{w:'对不起',g:'sorry',r:'duìbuqǐ'},{w:'再见',g:'goodbye',r:'zàijiàn'}],
};

function _foundSpeak(text, code) { if (typeof window !== 'undefined' && window.flSpeak) window.flSpeak(text, code); }

function FoundationsPage() {
  const R = React;
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const FOUND_LABELS = { en:'English', es:'Spanish', fr:'French', ja:'Japanese', ko:'Korean', ru:'Russian', de:'German', it:'Italian', pt:'Portuguese', zh:'Chinese', ar:'Arabic', hi:'Hindi', nl:'Dutch', pl:'Polish', tr:'Turkish', sv:'Swedish' };
  const langName = FOUND_LABELS[code] || ((typeof langByCode === 'function' && langByCode(code)) ? (langByCode(code).english || langByCode(code).native || 'your language') : 'your language');
  const alpha = FOUND_ALPHABETS[code] || { script:'the alphabet', note:'Tap a letter to hear it.', letters: FOUND_LATIN_FALLBACK };
  const words = FOUND_WORDS[code] || null;
  const phon = buildPhonics(code);
  const [stage, setStage] = R.useState('alphabet');
  const [playing, setPlaying] = R.useState(-1);

  const FLAGS = { es:'\uD83C\uDDEA\uD83C\uDDF8', fr:'\uD83C\uDDEB\uD83C\uDDF7', en:'\uD83C\uDDEC\uD83C\uDDE7', ja:'\uD83C\uDDEF\uD83C\uDDF5', ko:'\uD83C\uDDF0\uD83C\uDDF7', ru:'\uD83C\uDDF7\uD83C\uDDFA', ar:'\uD83C\uDDF8\uD83C\uDDE6', hi:'\uD83C\uDDEE\uD83C\uDDF3', zh:'\uD83C\uDDE8\uD83C\uDDF3', de:'\uD83C\uDDE9\uD83C\uDDEA', it:'\uD83C\uDDEE\uD83C\uDDF9', pt:'\uD83C\uDDF5\uD83C\uDDF9', nl:'\uD83C\uDDF3\uD83C\uDDF1', pl:'\uD83C\uDDF5\uD83C\uDDF1', tr:'\uD83C\uDDF9\uD83C\uDDF7', sv:'\uD83C\uDDF8\uD83C\uDDEA' };
  const ACC = {
    alphabet:    { c:'#C04A06', bg:'#FFE5DE' },
    phonics:     { c:'#5B4EFF', bg:'#EEEDFF' },
    words:       { c:'#1A8F4E', bg:'#E2F5E9' },
    sentences:   { c:'#A65A00', bg:'#FFEAC2' },
    translation: { c:'#C84070', bg:'#FFE0EC' },
  };
  const STAGES = [
    { id:'alphabet',    glyph:'Aa', label:'Alphabet',    sub:'Sounds & script',     live:true },
    { id:'phonics',     glyph:'\u25C8', label:'Phonics',     sub:'Letters into sounds', live:!!phon },
    { id:'words',       glyph:'\u2726', label:'First words', sub:'Survival vocabulary', live:!!words },
    { id:'sentences',   glyph:'\u00B6', label:'Sentences',   sub:'Putting it together', live:false },
    { id:'translation', glyph:'\u21C4', label:'Translation', sub:'Both directions',     live:!!words },
  ];
  const HEAD = {
    alphabet:    { eyebrow:'Alphabet \u00B7 ' + alpha.letters.length + ' letters', h1:'Hear every letter.' },
    phonics:     { eyebrow:'Phonics', h1:'Build your first syllables.' },
    words:       { eyebrow:'First words', h1:'Ten words for day one.' },
    sentences:   { eyebrow:'Sentences', h1:'Put the words together.' },
    translation: { eyebrow:'Translation', h1:'Both directions.' },
  };
  var liveCount = STAGES.filter(function (s) { return s.live; }).length;
  var journeyPct = Math.round((STAGES.findIndex(function (s) { return s.id === stage; }) + 1) / STAGES.length * 100);

  function Rail() {
    return (
      <div style={{ width:248, flexShrink:0, display:'flex', flexDirection:'column' }}>
        <button onClick={function () { if (window.__nav) window.__nav('lang'); }} style={{ alignSelf:'flex-start', display:'flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.85)', cursor:'pointer', padding:'9px 14px', borderRadius:99, color:T.ink3, fontSize:12.5, fontWeight:600, marginBottom:22 }}>\u2039 Back to {langName}</button>
        <div style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.14em', textTransform:'uppercase', padding:'0 6px', marginBottom:12 }}>The beginner journey</div>
        <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
          {STAGES.map(function (s) {
            var on = stage === s.id; var ac = ACC[s.id] || ACC.alphabet;
            return (
              <button key={s.id} onClick={function () { setStage(s.id); }} style={{ display:'flex', alignItems:'center', gap:11, padding:'10px 12px', borderRadius:14, border:'1px solid transparent', background: on ? 'rgba(255,255,255,0.9)' : 'transparent', boxShadow: on ? '0 4px 14px rgba(76,46,18,0.07)' : 'none', cursor:'pointer', textAlign:'left' }}>
                <span style={{ flexShrink:0, width:34, height:34, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:T.serif, fontSize:15, background: on ? ac.bg : 'rgba(255,255,255,0.55)', color: on ? ac.c : T.ink4 }}>{s.glyph}</span>
                <span style={{ display:'flex', flexDirection:'column', gap:1, minWidth:0, flex:1 }}>
                  <span style={{ fontSize:13.5, fontWeight:600, color: on ? T.ink : T.ink2 }}>{s.label}</span>
                  <span style={{ fontSize:11, color:T.ink4, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.sub}</span>
                </span>
                {!s.live ? <span style={{ flexShrink:0, fontSize:8.5, fontWeight:800, color:T.ink5, border:'1px solid ' + T.border, borderRadius:5, padding:'2px 5px' }}>AI</span> : null}
              </button>
            );
          })}
        </div>
        <div style={{ marginTop:24, padding:16, borderRadius:16, background:'rgba(255,255,255,0.6)', border:'1px solid rgba(255,255,255,0.8)', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:9 }}>
            <span style={{ fontSize:11, fontWeight:700, color:T.ink4, letterSpacing:'.1em', textTransform:'uppercase' }}>Your journey</span>
            <span style={{ fontSize:11, fontWeight:700, color:T.brand }}>{liveCount}/{STAGES.length} live</span>
          </div>
          <div style={{ height:6, borderRadius:99, background:T.track || '#F2F2F2', overflow:'hidden', marginBottom:13 }}>
            <div style={{ height:'100%', borderRadius:99, background:'linear-gradient(135deg,#C04A06,#E8732F)', width: journeyPct + '%', transition:'width .3s ease' }}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <span style={{ fontSize:20 }}>{FLAGS[code] || '\uD83C\uDFF3\uFE0F'}</span>
            <span style={{ fontSize:13.5, fontWeight:600, color:T.ink }}>{langName}</span>
            <span style={{ marginLeft:'auto', fontSize:11, fontWeight:700, color:T.brand, padding:'3px 9px', borderRadius:99, background:T.brandLight }}>A1</span>
          </div>
        </div>
      </div>
    );
  }

  function Header() {
    var h = HEAD[stage] || HEAD.alphabet; var ac = ACC[stage] || ACC.alphabet;
    return (
      <div style={{ marginBottom:22 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', color: ac.c, marginBottom:8 }}>{h.eyebrow}</div>
        <div style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.1 }}>{h.h1}</div>
      </div>
    );
  }

  function Alphabet() {
    return (
      <div style={{ animation:'fl-rise .3s ease both' }}>
        <p style={{ fontSize:14.5, color:T.ink3, lineHeight:1.6, marginBottom:26, maxWidth:560 }}>You're learning <strong style={{ color:T.ink }}>{alpha.script}</strong>. {alpha.note}</p>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(80px, 1fr))', gap:12 }} dir={alpha.rtl ? 'rtl' : undefined}>
          {alpha.letters.map(function (l, i) {
            var on = playing === i;
            return (
              <button key={l.ch + i} onClick={function () { setPlaying(i); _foundSpeak(l.ch, code); setTimeout(function () { setPlaying(function (p) { return p === i ? -1 : p; }); }, 750); }} className="fl-lift"
                style={{ aspectRatio:'1', borderRadius:16, border:'1px solid ' + (on ? '#C04A06' : T.border), background: on ? '#FFE5DE' : T.card, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:7 }}>
                <span style={{ fontFamily:T.serif, fontSize:28, lineHeight:1, color: on ? '#C04A06' : T.ink }}>{l.ch}</span>
                {on ? (
                  <span style={{ display:'flex', alignItems:'flex-end', gap:2, height:11 }}>
                    <span style={{ width:3, height:11, borderRadius:2, background:'#C04A06', transformOrigin:'bottom', animation:'fl-wave .6s ease-in-out infinite' }}/>
                    <span style={{ width:3, height:11, borderRadius:2, background:'#C04A06', transformOrigin:'bottom', animation:'fl-wave .6s ease-in-out infinite .15s' }}/>
                    <span style={{ width:3, height:11, borderRadius:2, background:'#C04A06', transformOrigin:'bottom', animation:'fl-wave .6s ease-in-out infinite .3s' }}/>
                  </span>
                ) : (
                  <span style={{ fontSize:10.5, fontWeight:600, color:T.ink4 }}>{l.name}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function Words() {
    if (!words) return <AiStage label="First words" />;
    return (
      <div>
        <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:20, maxWidth:560 }}>Ten words that get you through your first day. Tap any word to hear it in {langName}.</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:12 }}>
          {words.map(function (it, i) {
            return (
              <button key={i} onClick={function () { _foundSpeak(it.w, code); }} style={{ textAlign:'left', padding:'16px 18px', borderRadius:14, border:'1px solid ' + T.border, background:T.card, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                <div style={{ minWidth:0 }}>
                  <div dir={code === 'ar' ? 'rtl' : undefined} style={{ fontFamily:T.serif, fontSize:19, color:T.ink, lineHeight:1.2 }}>{it.w}</div>
                  {it.r ? <div style={{ fontSize:11, color:T.ink4, marginTop:1 }}>{it.r}</div> : null}
                  <div style={{ fontSize:11.5, color:T.ink3, marginTop:3, textTransform:'capitalize' }}>{it.g}</div>
                </div>
                <span style={{ flexShrink:0, color:T.brand }}>{Icon.head ? Icon.head({ width:18, height:18 }) : '►'}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function AiStage(props) {
    return (
      <div style={{ textAlign:'center', padding:'48px 24px', maxWidth:460, margin:'0 auto' }}>
        <div style={{ width:52, height:52, borderRadius:14, background:T.brandLight, color:T.brand, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>{Icon.spark ? Icon.spark({ width:22, height:22 }) : '✦'}</div>
        <div style={{ fontFamily:T.serif, fontSize:22, color:T.ink, marginBottom:10 }}>{props.label} is AI-powered</div>
        <div style={{ fontSize:13.5, color:T.ink3, lineHeight:1.6 }}>This stage builds {props.label.toLowerCase()} live around what you've already learned and your interests. It switches on as soon as AI generation is active for your account.</div>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <WebTopbar search=""/>
      <style>{"@keyframes fl-wave{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}@keyframes fl-rise{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}"}</style>
      <div style={{ flex:1, overflow:'auto', padding:'30px 36px 56px', background:'radial-gradient(1100px 520px at 8% -12%, #FBE3D1 0%, rgba(251,227,209,0) 55%), radial-gradient(950px 480px at 96% -8%, #E9E4F4 0%, rgba(233,228,244,0) 52%), ' + (T.bg || '#F9F8F5') }}>
        <div style={{ maxWidth:1060, margin:'0 auto', display:'flex', gap:30, alignItems:'flex-start' }}>
          <Rail/>
          <div style={{ flex:1, minWidth:0, background:'rgba(255,255,255,0.6)', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,0.7)', borderRadius:22, boxShadow:'0 16px 48px rgba(76,46,18,0.08)', padding:'30px 34px 38px' }}>
            <Header/>
            {stage === 'alphabet' && (code === 'zh' ? <FoundationsPinyin/> : <Alphabet/>)}
            {stage === 'phonics' && (phon ? <FoundationsPhonics code={code} langName={langName}/> : <AiStage label="Phonics" />)}
            {stage === 'words' && <Words/>}
            {stage === 'sentences' && <AiStage label="Sentences" />}
            {stage === 'translation' && (words ? <FoundationsTranslationDrill words={words} code={code} langName={langName}/> : <AiStage label="Translation" />)}
          </div>
        </div>
      </div>
    </div>
  );
}
if (typeof window !== 'undefined') { window.FoundationsPage = FoundationsPage; }

// ── Translation drill (credits-free) ─────────────────────────
// A both-directions multiple-choice drill over the curated first words. Pure
// client + TTS, so it works with no AI. Serves the "translation on every part" goal.
function _foundShuffle(a) { var r = a.slice(); for (var i = r.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = r[i]; r[i] = r[j]; r[j] = t; } return r; }

function FoundationsTranslationDrill(props) {
  const R = React;
  const words = props.words, code = props.code, langName = props.langName;
  const idxs = function () { return words.map(function (_, i) { return i; }); };
  const [order, setOrder] = R.useState(function () { return _foundShuffle(idxs()); });
  const [dir, setDir] = R.useState('toEn');   // toEn: target->English, toTarget: English->target
  const [qi, setQi] = R.useState(0);
  const [score, setScore] = R.useState(0);
  const [picked, setPicked] = R.useState(null);
  const [done, setDone] = R.useState(false);

  const cur = words[order[qi]] || words[0];
  const correctAns = (dir === 'toEn') ? cur.g : cur.w;
  const promptText = (dir === 'toEn') ? cur.w : cur.g;

  const opts = R.useMemo(function () {
    var w = words[order[qi]] || words[0];
    var correct = (dir === 'toEn') ? w.g : w.w;
    var pool = words.filter(function (x) { return ((dir === 'toEn') ? x.g : x.w) !== correct; });
    pool = _foundShuffle(pool).slice(0, 3).map(function (x) { return (dir === 'toEn') ? x.g : x.w; });
    return _foundShuffle([correct].concat(pool));
  }, [qi, dir, order, words]);

  function restart(d) { setOrder(_foundShuffle(idxs())); setDir(d || dir); setQi(0); setScore(0); setPicked(null); setDone(false); }

  function pick(opt) {
    if (picked) return;
    var ok = opt === correctAns;
    setPicked({ opt: opt, ok: ok });
    if (ok) setScore(function (s) { return s + 1; });
    setTimeout(function () {
      if (qi + 1 >= order.length) setDone(true);
      else { setQi(function (q) { return q + 1; }); setPicked(null); }
    }, 750);
  }

  if (done) {
    var pct = Math.round((score / order.length) * 100);
    return (
      <div style={{ textAlign:'center', padding:'40px 24px', maxWidth:460, margin:'0 auto' }}>
        <div style={{ fontFamily:T.serif, fontSize:48, color:T.brand, lineHeight:1 }}>{score}<span style={{ fontSize:24, color:T.ink4 }}>/{order.length}</span></div>
        <div style={{ fontSize:14, color:T.ink3, marginTop:10, marginBottom:24 }}>{pct >= 80 ? 'Strong — your first words are sticking.' : pct >= 50 ? 'Getting there — run it again to lock them in.' : 'Early days — replay and listen to each word.'}</div>
        <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
          <button onClick={function () { restart('toEn'); }} style={{ padding:'11px 18px', borderRadius:11, border:'none', background:T.brand, color:'#fff', fontSize:13, fontWeight:700, cursor:'pointer' }}>{langName} → English</button>
          <button onClick={function () { restart('toTarget'); }} style={{ padding:'11px 18px', borderRadius:11, border:'1.5px solid ' + T.brand, background:T.card, color:T.brand, fontSize:13, fontWeight:700, cursor:'pointer' }}>English → {langName}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:14, marginBottom:20, flexWrap:'wrap' }}>
        <div style={{ fontSize:13, color:T.ink3 }}>{dir === 'toEn' ? langName + ' → English' : 'English → ' + langName} · <span style={{ color:T.ink4 }}>Q{qi + 1}/{order.length}</span> · <span style={{ color:T.brand, fontWeight:700 }}>{score} right</span></div>
        <button onClick={function () { restart(dir === 'toEn' ? 'toTarget' : 'toEn'); }} style={{ padding:'7px 13px', borderRadius:9, border:'1.5px solid ' + T.border, background:T.card, fontSize:12, fontWeight:600, color:T.ink2, cursor:'pointer' }}>Switch direction</button>
      </div>
      {/* progress */}
      <div style={{ height:4, borderRadius:2, background:T.bg2, marginBottom:24, overflow:'hidden' }}><div style={{ width:((qi / order.length) * 100) + '%', height:'100%', background:T.brand, transition:'width .3s' }}/></div>
      {/* prompt */}
      <div style={{ textAlign:'center', marginBottom:26 }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:12 }}>{dir === 'toEn' ? 'What does this mean?' : 'How do you say this?'}</div>
        <div style={{ display:'inline-flex', alignItems:'center', gap:12 }}>
          <span dir={(dir === 'toEn' && code === 'ar') ? 'rtl' : undefined} style={{ fontFamily:T.serif, fontSize:34, color:T.ink, lineHeight:1.1 }}>{promptText}</span>
          {dir === 'toEn' ? <button onClick={function () { if (window.flSpeak) window.flSpeak(cur.w, code); }} aria-label="Hear" style={{ border:'none', background:T.brandLight, color:T.brand, width:38, height:38, borderRadius:10, cursor:'pointer', fontSize:16 }}>{Icon.head ? Icon.head({ width:18, height:18 }) : '►'}</button> : null}
        </div>
        {dir === 'toEn' && cur.r ? <div style={{ fontSize:12.5, color:T.ink4, marginTop:6 }}>{cur.r}</div> : null}
      </div>
      {/* options */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, maxWidth:520, margin:'0 auto' }}>
        {opts.map(function (o, i) {
          var state = 'idle';
          if (picked) { if (o === correctAns) state = 'right'; else if (o === picked.opt) state = 'wrong'; }
          var bg = state === 'right' ? '#E8F5E9' : state === 'wrong' ? '#FDECEA' : T.card;
          var bd = state === 'right' ? '#34A853' : state === 'wrong' ? '#D93025' : T.border;
          var col = state === 'right' ? '#1E7E34' : state === 'wrong' ? '#B3261E' : T.ink;
          return (
            <button key={o + i} onClick={function () { pick(o); }} disabled={!!picked} style={{ padding:'15px 16px', borderRadius:13, border:'1.5px solid ' + bd, background:bg, color:col, fontSize:15, fontWeight:600, cursor: picked ? 'default' : 'pointer', textAlign:'center', fontFamily: (dir === 'toTarget') ? T.serif : 'inherit' }}>{o}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── Phonics (credits-free): build syllables from letters ─────
// Latin/Cyrillic: consonant+vowel concatenation. Korean: real Unicode hangul
// block composition. Japanese: the gojūon grouped by consonant row. All + TTS.
const KO_INIT = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const KO_MED  = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const KO_ROM  = { 'ㄱ':'g','ㄴ':'n','ㄷ':'d','ㄹ':'r','ㅁ':'m','ㅂ':'b','ㅅ':'s','ㅈ':'j','ㅎ':'h' };
const KO_VROM = { 'ㅏ':'a','ㅓ':'eo','ㅗ':'o','ㅜ':'u','ㅣ':'i' };
function _koCompose(ini, med) { var L = KO_INIT.indexOf(ini), V = KO_MED.indexOf(med); if (L < 0 || V < 0) return ini + med; return String.fromCharCode(0xAC00 + (L * 21 + V) * 28); }

const PHON_CONFIG = {
  en: { cons:'b c d f g h j k l m n p r s t v w z'.split(' '), vows:['a','e','i','o','u'] },
  es: { cons:'b c d f g l m n p r s t'.split(' '), vows:['a','e','i','o','u'] },
  fr: { cons:'b c d f g l m n p r s t'.split(' '), vows:['a','e','i','o','u'] },
  ru: { cons:'б в г д к л м н п р с т'.split(' '), vows:['а','е','и','о','у'] },
  ko: { compose:true, cons:['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅈ','ㅎ'], vows:['ㅏ','ㅓ','ㅗ','ㅜ','ㅣ'] },
  ja: { syllabary:true },
};

function buildPhonics(code) {
  var cfg = PHON_CONFIG[code];
  if (!cfg) return null;
  if (cfg.syllabary) {
    var alpha = FOUND_ALPHABETS.ja; if (!alpha) return null;
    var map = {}, order = [];
    alpha.letters.forEach(function (l) {
      var rom = l.name, key;
      if (rom.length <= 1 || 'aiueo'.indexOf(rom[0]) >= 0) key = '(vowels)';
      else if (rom === 'shi') key = 's';
      else if (rom === 'chi' || rom === 'tsu') key = 't';
      else if (rom === 'fu') key = 'h';
      else key = rom[0];
      if (!map[key]) { map[key] = []; order.push(key); }
      map[key].push({ ch: l.ch, romaji: l.name });
    });
    return { mode:'syllabary', groups: order.map(function (k) { return { label: k === '(vowels)' ? 'vowels' : k.toUpperCase() + '-row', syllables: map[k] }; }) };
  }
  if (cfg.compose) {
    return { mode:'compose', groups: cfg.cons.map(function (ci) {
      return { label: (KO_ROM[ci] || ci), syllables: cfg.vows.map(function (v) { return { ch: _koCompose(ci, v), romaji: (KO_ROM[ci] || '') + (KO_VROM[v] || '') }; }) };
    }) };
  }
  return { mode:'cv', groups: cfg.cons.map(function (ci) {
    return { label: ci.toUpperCase(), syllables: cfg.vows.map(function (v) { return { ch: ci + v, romaji: ci + v }; }) };
  }) };
}

function FoundationsPhonics(props) {
  const R = React;
  const code = props.code;
  const phon = buildPhonics(code);
  const [gi, setGi] = R.useState(0);
  if (!phon) return null;
  const g = phon.groups[gi] || phon.groups[0];
  const note = phon.mode === 'syllabary'
    ? 'Japanese is read in syllables. Pick a row, then tap each syllable to hear it.'
    : phon.mode === 'compose'
      ? 'Korean letters stack into a single block. Pick a consonant, then tap each block to hear the consonant join a vowel.'
      : 'Sounds are built by joining a consonant to a vowel. Pick a consonant, then tap each syllable to hear it.';
  return (
    <div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:18, maxWidth:560 }}>{note}</div>
      <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>{phon.mode === 'syllabary' ? 'Pick a row' : 'Pick a consonant'}</div>
      <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:24 }}>
        {phon.groups.map(function (grp, i) {
          var on = i === gi;
          return <button key={grp.label + i} onClick={function () { setGi(i); }} style={{ padding:'8px 14px', borderRadius:99, border:'1.5px solid ' + (on ? T.brand : T.border), background: on ? T.brandLight : T.card, fontSize:13, fontWeight: on ? 700 : 600, color: on ? T.brand : T.ink2, cursor:'pointer', minWidth:42 }}>{grp.label}</button>;
        })}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(84px, 1fr))', gap:11 }}>
        {g.syllables.map(function (s, i) {
          return (
            <button key={s.ch + i} onClick={function () { if (window.flSpeak) window.flSpeak(s.ch, code); }} style={{ padding:'18px 8px', borderRadius:14, border:'1px solid ' + T.border, background:T.card, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
              <span style={{ fontFamily:T.serif, fontSize:28, lineHeight:1, color:T.ink }}>{s.ch}</span>
              <span style={{ fontSize:11, color:T.ink4 }}>{s.romaji}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Chinese: Pinyin & tones (credits-free) ───────────────────
// Chinese has no alphabet — Pinyin is how you learn to pronounce characters,
// and tone changes meaning. Tones are taught on real characters (妈麻马骂) so
// TTS is reliable; initials/finals are a visual reference chart.
const ZH_TONES = [
  { ch:'\u5988', py:'m\u0101', tone:'1st \u2014 high & level', g:'mother' },
  { ch:'\u9ebb', py:'m\u00e1', tone:'2nd \u2014 rising', g:'hemp' },
  { ch:'\u9a6c', py:'m\u01ce', tone:'3rd \u2014 dip, then rise', g:'horse' },
  { ch:'\u9a82', py:'m\u00e0', tone:'4th \u2014 sharp fall', g:'to scold' },
];
const ZH_INITIALS = 'b p m f d t n l g k h j q x zh ch sh r z c s y w'.split(' ');
const ZH_FINALS = 'a o e i u \u00fc ai ei ao ou an en ang eng ong'.split(' ');

function FoundationsPinyin() {
  return (
    <div>
      <div style={{ fontSize:13, color:T.ink3, lineHeight:1.6, marginBottom:22, maxWidth:580 }}>Chinese isn\u2019t written with an alphabet \u2014 each character is a whole syllable. <strong style={{ color:T.ink }}>Pinyin</strong> spells out how to say it, and the <strong style={{ color:T.ink }}>tone</strong> changes the meaning. Same sound \u201cma\u201d, four tones, four words:</div>
      {/* Tones — interactive, real characters */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:12, marginBottom:30 }}>
        {ZH_TONES.map(function (t, i) {
          return (
            <button key={i} onClick={function () { if (window.flSpeak) window.flSpeak(t.ch, 'zh'); }} style={{ textAlign:'center', padding:'20px 14px', borderRadius:16, border:'1px solid ' + T.border, background:T.card, cursor:'pointer' }}>
              <div style={{ fontFamily:T.serif, fontSize:40, color:T.ink, lineHeight:1 }}>{t.ch}</div>
              <div style={{ fontSize:16, color:T.brand, fontWeight:700, marginTop:8 }}>{t.py}</div>
              <div style={{ fontSize:11, color:T.ink4, marginTop:6 }}>{t.tone}</div>
              <div style={{ fontSize:11.5, color:T.ink3, marginTop:2, fontStyle:'italic' }}>\u201c{t.g}\u201d</div>
            </button>
          );
        })}
      </div>
      {/* Initials reference */}
      <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Initials \u2014 the starting sounds</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:24 }}>
        {ZH_INITIALS.map(function (x, i) { return <span key={i} style={{ padding:'7px 12px', borderRadius:9, background:T.bg2, border:'1px solid ' + T.hairline, fontSize:13, color:T.ink2, fontWeight:600 }}>{x}</span>; })}
      </div>
      {/* Finals reference */}
      <div style={{ fontSize:10.5, fontWeight:700, color:T.ink4, letterSpacing:'.12em', textTransform:'uppercase', marginBottom:10 }}>Finals \u2014 the ending sounds</div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
        {ZH_FINALS.map(function (x, i) { return <span key={i} style={{ padding:'7px 12px', borderRadius:9, background:T.bg2, border:'1px solid ' + T.hairline, fontSize:13, color:T.ink2, fontWeight:600 }}>{x}</span>; })}
      </div>
      <div style={{ fontSize:12, color:T.ink4, marginTop:18, lineHeight:1.5 }}>An initial + a final + a tone makes a syllable. Tap a tone card above to hear it; head to First words to hear whole words.</div>
    </div>
  );
}
