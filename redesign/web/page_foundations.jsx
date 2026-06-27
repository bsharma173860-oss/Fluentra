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
};

function _foundSpeak(text, code) { if (typeof window !== 'undefined' && window.flSpeak) window.flSpeak(text, code); }

function FoundationsPage() {
  const R = React;
  const code = (typeof window !== 'undefined' && window.__langCode) || 'en';
  const FOUND_LABELS = { en:'English', es:'Spanish', fr:'French', ja:'Japanese', ko:'Korean', ru:'Russian', de:'German', it:'Italian', pt:'Portuguese', zh:'Chinese', ar:'Arabic', hi:'Hindi', nl:'Dutch', pl:'Polish', tr:'Turkish', sv:'Swedish' };
  const langName = FOUND_LABELS[code] || ((typeof langByCode === 'function' && langByCode(code)) ? (langByCode(code).english || langByCode(code).native || 'your language') : 'your language');
  const alpha = FOUND_ALPHABETS[code] || { script:'the alphabet', note:'Tap a letter to hear it.', letters: FOUND_LATIN_FALLBACK };
  const words = FOUND_WORDS[code] || null;
  const [stage, setStage] = R.useState('alphabet');
  const [sel, setSel] = R.useState(0);

  const STAGES = [
    { id:'alphabet',    n:'01', label:'Alphabet',    sub:'Sounds & script',     live:true },
    { id:'phonics',     n:'02', label:'Phonics',      sub:'Letters into sounds', live:false },
    { id:'words',       n:'03', label:'First words',  sub:'Survival vocabulary', live:!!words },
    { id:'sentences',   n:'04', label:'Sentences',    sub:'Putting it together', live:false },
    { id:'translation', n:'05', label:'Translation',  sub:'Both directions',     live:false },
  ];

  function StageRail() {
    return (
      <div style={{ display:'flex', gap:10, marginBottom:30, overflowX:'auto', paddingBottom:4 }}>
        {STAGES.map(function (s) {
          var on = stage === s.id;
          return (
            <button key={s.id} onClick={function () { setStage(s.id); }} style={{ flex:'1 0 auto', minWidth:130, textAlign:'left', padding:'14px 16px', borderRadius:14, border:'1.5px solid ' + (on ? T.brand : T.border), background: on ? T.brandLight : T.card, cursor:'pointer', position:'relative' }}>
              <div style={{ fontFamily:T.serif, fontSize:13, fontStyle:'italic', color: on ? T.brand : T.ink4, marginBottom:6 }}>{s.n}</div>
              <div style={{ fontSize:13.5, fontWeight:700, color: on ? T.brand : T.ink }}>{s.label}</div>
              <div style={{ fontSize:10.5, color: on ? T.brand : T.ink4, marginTop:2 }}>{s.sub}</div>
              {!s.live ? <div style={{ position:'absolute', top:12, right:12, fontSize:8.5, fontWeight:800, letterSpacing:'.08em', color:T.ink5, border:'1px solid ' + T.border, borderRadius:5, padding:'2px 5px' }}>AI</div> : null}
            </button>
          );
        })}
      </div>
    );
  }

  function Alphabet() {
    var letter = alpha.letters[sel] || alpha.letters[0];
    return (
      <div>
        <div style={{ fontSize:13, color:T.ink3, lineHeight:1.55, marginBottom:20, maxWidth:560 }}>You're learning <strong style={{ color:T.ink }}>{alpha.script}</strong>. {alpha.note}</div>
        {/* Selected letter detail */}
        <div style={{ display:'flex', gap:20, alignItems:'center', background:T.ink, color:'#fff', borderRadius:18, padding:'24px 28px', marginBottom:24, position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, opacity:.05, background:'radial-gradient(circle at 90% 10%, #fff 0%, transparent 55%)' }}/>
          <button onClick={function () { _foundSpeak(letter.ch, code); }} style={{ position:'relative', flexShrink:0, width:96, height:96, borderRadius:20, background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.15)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:T.serif, fontSize:52, lineHeight:1, color:'#fff' }}>{letter.ch}</span>
          </button>
          <div style={{ position:'relative', minWidth:0 }}>
            <div style={{ fontSize:10.5, fontWeight:700, color:T.brandLight, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:6 }}>Reads as “{letter.name}”</div>
            <button onClick={function () { _foundSpeak(letter.ch, code); }} style={{ display:'inline-flex', alignItems:'center', gap:7, padding:'9px 15px', borderRadius:10, background:'#fff', color:T.ink, border:'none', fontSize:13, fontWeight:700, cursor:'pointer', marginBottom: letter.ex ? 12 : 0 }}>
              {Icon.head ? Icon.head({ width:14, height:14 }) : null} Hear the sound
            </button>
            {letter.ex ? (
              <div style={{ fontSize:13, color:'rgba(255,255,255,.75)' }}>
                e.g. <button onClick={function () { _foundSpeak(letter.ex, code); }} style={{ background:'none', border:'none', color:'#fff', fontWeight:700, cursor:'pointer', padding:0, fontSize:13, textDecoration:'underline', textDecorationColor:'rgba(255,255,255,.3)' }}>{letter.ex}</button>{letter.gloss ? ' — ' + letter.gloss : ''}
              </div>
            ) : null}
          </div>
        </div>
        {/* Letter grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(58px, 1fr))', gap:9 }}>
          {alpha.letters.map(function (l, i) {
            var on = i === sel;
            return (
              <button key={l.ch + i} onClick={function () { setSel(i); _foundSpeak(l.ch, code); }} style={{ aspectRatio:'1', borderRadius:12, border:'1.5px solid ' + (on ? T.brand : T.border), background: on ? T.brandLight : T.card, cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2 }}>
                <span style={{ fontFamily:T.serif, fontSize:22, lineHeight:1, color: on ? T.brand : T.ink }}>{l.ch}</span>
                <span style={{ fontSize:9, color: on ? T.brand : T.ink4 }}>{l.name}</span>
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
                  <div style={{ fontFamily:T.serif, fontSize:19, color:T.ink, lineHeight:1.2 }}>{it.w}</div>
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
      <div style={{ flex:1, overflow:'auto', padding:'30px 36px 44px' }}>
        <div style={{ maxWidth:820, margin:'0 auto' }}>
          <div style={{ marginBottom:26 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.14em', textTransform:'uppercase', marginBottom:8 }}>Foundations</div>
            <div style={{ fontFamily:T.serif, fontSize:36, color:T.ink, lineHeight:1.08 }}>Start {langName} from zero.</div>
            <div style={{ fontSize:14, color:T.ink3, marginTop:10, lineHeight:1.6, maxWidth:540 }}>Before exams and essays: learn how the language sounds and reads. Master the script, then build up to words, sentences, and translation.</div>
          </div>
          <StageRail/>
          {stage === 'alphabet' && <Alphabet/>}
          {stage === 'phonics' && <AiStage label="Phonics" />}
          {stage === 'words' && <Words/>}
          {stage === 'sentences' && <AiStage label="Sentences" />}
          {stage === 'translation' && <AiStage label="Translation" />}
        </div>
      </div>
    </div>
  );
}
if (typeof window !== 'undefined') { window.FoundationsPage = FoundationsPage; }
