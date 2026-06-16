// ──────────────────────────────────────────────────────────────────────────
// Fluentra — Language Registry (40 languages)
// Single source of truth for language metadata, real exam tracks, and which
// modules each language actually supports.
//
//   modules:
//     text  = vocab, reading, writing   → available for ALL 40 (Claude is
//             broadly multilingual for text).
//     audio = listening, speaking        → only where Whisper (STT) + TTS are
//             genuinely good (≈26 high-resource languages). The rest omit the
//             audio modules — their cards simply don't render speaking/listening.
//
//   status: 'available'  → real content engine will generate for this language
//           'coming_soon' → listed in the picker but not yet enabled
//
// Per-user progress/history is NOT stored here (a new learner starts empty).
// Dynamic practice content (readings, essays, mock tests) is produced by the
// content engine at runtime and cached per language in the DB.
// ──────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  var TEXT  = ['vocab', 'reading', 'writing'];
  var FULL  = ['vocab', 'reading', 'writing', 'listening', 'speaking'];

  var L = [
    // ── Full (text + audio: speaking & listening supported) ───────────────
    { code:'en', name:'English',    native:'English',          script:'Latin',      region:'Global',   exams:['IELTS','TOEFL iBT','Cambridge C1','PTE'], modules:FULL },
    { code:'es', name:'Spanish',    native:'Español',          script:'Latin',      region:'Europe',   exams:['DELE','SIELE'],                          modules:FULL },
    { code:'fr', name:'French',     native:'Français',         script:'Latin',      region:'Europe',   exams:['DELF','DALF','TCF'],                     modules:FULL },
    { code:'de', name:'German',     native:'Deutsch',          script:'Latin',      region:'Europe',   exams:['Goethe-Zertifikat','TestDaF','telc'],    modules:FULL },
    { code:'it', name:'Italian',    native:'Italiano',         script:'Latin',      region:'Europe',   exams:['CILS','CELI','PLIDA'],                   modules:FULL },
    { code:'pt', name:'Portuguese', native:'Português',        script:'Latin',      region:'Europe',   exams:['CELPE-Bras','CAPLE','CIPLE'],            modules:FULL },
    { code:'nl', name:'Dutch',      native:'Nederlands',       script:'Latin',      region:'Europe',   exams:['CNaVT','NT2 (Inburgering)'],             modules:FULL },
    { code:'ru', name:'Russian',    native:'Русский',          script:'Cyrillic',   region:'Europe',   exams:['TORFL (ТРКИ)'],                          modules:FULL },
    { code:'pl', name:'Polish',     native:'Polski',           script:'Latin',      region:'Europe',   exams:['Certyfikat j. polskiego'],               modules:FULL },
    { code:'uk', name:'Ukrainian',  native:'Українська',       script:'Cyrillic',   region:'Europe',   exams:['State Ukrainian exam'],                  modules:FULL },
    { code:'sv', name:'Swedish',    native:'Svenska',          script:'Latin',      region:'Europe',   exams:['SWEDEX','Tisus'],                        modules:FULL },
    { code:'no', name:'Norwegian',  native:'Norsk',            script:'Latin',      region:'Europe',   exams:['Norskprøven','Bergenstesten'],           modules:FULL },
    { code:'da', name:'Danish',     native:'Dansk',            script:'Latin',      region:'Europe',   exams:['Prøve i Dansk'],                         modules:FULL },
    { code:'fi', name:'Finnish',    native:'Suomi',            script:'Latin',      region:'Europe',   exams:['YKI'],                                   modules:FULL },
    { code:'el', name:'Greek',      native:'Ελληνικά',         script:'Greek',      region:'Europe',   exams:['Ellinomatheia'],                         modules:FULL },
    { code:'cs', name:'Czech',      native:'Čeština',          script:'Latin',      region:'Europe',   exams:['CCE'],                                   modules:FULL },
    { code:'ro', name:'Romanian',   native:'Română',           script:'Latin',      region:'Europe',   exams:['LCR'],                                   modules:FULL },
    { code:'hu', name:'Hungarian',  native:'Magyar',           script:'Latin',      region:'Europe',   exams:['ECL'],                                   modules:FULL },
    { code:'tr', name:'Turkish',    native:'Türkçe',           script:'Latin',      region:'Asia',     exams:['TYS'],                                   modules:FULL },
    { code:'ar', name:'Arabic',     native:'العربية',          script:'Arabic',     region:'Mideast',  exams:['ALPT','CIMA'],                           modules:FULL },
    { code:'hi', name:'Hindi',      native:'हिन्दी',            script:'Devanagari', region:'Asia',     exams:['CIIL'],                                  modules:FULL },
    { code:'zh', name:'Chinese',    native:'中文 (普通话)',      script:'Hanzi',      region:'Asia',     exams:['HSK','HSKK'],                            modules:FULL },
    { code:'ja', name:'Japanese',   native:'日本語',            script:'Kanji/Kana', region:'Asia',     exams:['JLPT','BJT'],                            modules:FULL },
    { code:'ko', name:'Korean',     native:'한국어',            script:'Hangul',     region:'Asia',     exams:['TOPIK'],                                 modules:FULL },
    { code:'id', name:'Indonesian', native:'Bahasa Indonesia', script:'Latin',      region:'Asia',     exams:['UKBI'],                                  modules:FULL },
    { code:'vi', name:'Vietnamese', native:'Tiếng Việt',       script:'Latin',      region:'Asia',     exams:['Vietnamese proficiency'],                modules:FULL },

    // ── Text only (audio omitted: STT/TTS not reliable enough yet) ────────
    { code:'th', name:'Thai',       native:'ไทย',              script:'Thai',       region:'Asia',     exams:['CU-TFL'],                                modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'he', name:'Hebrew',     native:'עברית',            script:'Hebrew',     region:'Mideast',  exams:['Bar-Ilan proficiency'],                  modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'fa', name:'Persian',    native:'فارسی',            script:'Arabic',     region:'Mideast',  exams:['AMFA'],                                  modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'ur', name:'Urdu',       native:'اردو',             script:'Arabic',     region:'Asia',     exams:['CIIL'],                                  modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'bn', name:'Bengali',    native:'বাংলা',            script:'Bengali',    region:'Asia',     exams:['CIIL'],                                  modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'ta', name:'Tamil',      native:'தமிழ்',            script:'Tamil',      region:'Asia',     exams:['CIIL'],                                  modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'ca', name:'Catalan',    native:'Català',           script:'Latin',      region:'Europe',   exams:['CPNL','CCSE'],                           modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'eu', name:'Basque',     native:'Euskara',          script:'Latin',      region:'Europe',   exams:['EGA'],                                   modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'cy', name:'Welsh',      native:'Cymraeg',          script:'Latin',      region:'Europe',   exams:['WJEC'],                                  modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'ga', name:'Irish',      native:'Gaeilge',          script:'Latin',      region:'Europe',   exams:['TEG'],                                   modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'is', name:'Icelandic',  native:'Íslenska',         script:'Latin',      region:'Europe',   exams:['Íslenskupróf'],                          modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'et', name:'Estonian',   native:'Eesti',            script:'Latin',      region:'Europe',   exams:['Tasemeeksam'],                           modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'hr', name:'Croatian',   native:'Hrvatski',         script:'Latin',      region:'Europe',   exams:['Croaticum'],                             modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
    { code:'bg', name:'Bulgarian',  native:'Български',         script:'Cyrillic',   region:'Europe',   exams:['ECL Bulgarian'],                         modules:TEXT, audioNote:'Audio modules coming once speech quality is verified.' },
  ];

  // mark status + index by code
  var byCode = {};
  L.forEach(function (l) { l.status = 'available'; byCode[l.code] = l; });

  window.FL_LANGS = L;
  window.FL_LANG = byCode;
  window.FL_langModules = function (code) { return (byCode[code] && byCode[code].modules) || TEXT; };
  window.FL_hasModule  = function (code, m) { return window.FL_langModules(code).indexOf(m) !== -1; };
  window.FL_langExams  = function (code) { return (byCode[code] && byCode[code].exams) || []; };
})();
