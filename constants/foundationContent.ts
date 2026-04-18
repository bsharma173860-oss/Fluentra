// Foundation layer content — scripts, vocabulary, and grammar basics per language.
// Each language has sections; each section has lessons of one of four types.

export type LessonType = 'chars' | 'vocab' | 'tones' | 'grammar';

export type CharItem = {
  char:    string;   // native script character
  roman:   string;   // romanization / pronunciation
  meaning: string;   // English meaning or label
};

export type VocabItem = {
  word:    string;   // native script word
  roman:   string;
  meaning: string;
};

export type GrammarItem = {
  rule:     string;  // short rule headline
  detail:   string;  // explanation
  examples: { native: string; roman: string; en: string }[];
};

export type Lesson = {
  id:          string;
  title:       string;
  subtitle:    string;
  type:        LessonType;
  items:       CharItem[] | VocabItem[] | GrammarItem[];
};

export type FoundationSection = {
  id:          string;
  title:       string;
  description: string;
  icon:        string;   // emoji
  lessons:     Lesson[];
};

export type FoundationData = {
  langCode:  string;
  sections:  FoundationSection[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Japanese
// ─────────────────────────────────────────────────────────────────────────────
const ja: FoundationData = {
  langCode: 'ja',
  sections: [
    {
      id: 'hiragana',
      title: 'Hiragana',
      description: 'The basic phonetic alphabet used for native Japanese words',
      icon: 'あ',
      lessons: [
        {
          id: 'hiragana-vowels',
          title: 'Vowels',
          subtitle: 'The 5 core vowel sounds',
          type: 'chars',
          items: [
            { char: 'あ', roman: 'a',  meaning: 'as in "ah"' },
            { char: 'い', roman: 'i',  meaning: 'as in "ee"' },
            { char: 'う', roman: 'u',  meaning: 'as in "oo"' },
            { char: 'え', roman: 'e',  meaning: 'as in "eh"' },
            { char: 'お', roman: 'o',  meaning: 'as in "oh"' },
          ] as CharItem[],
        },
        {
          id: 'hiragana-k',
          title: 'K-row',
          subtitle: 'か き く け こ',
          type: 'chars',
          items: [
            { char: 'か', roman: 'ka', meaning: 'ka' },
            { char: 'き', roman: 'ki', meaning: 'ki' },
            { char: 'く', roman: 'ku', meaning: 'ku' },
            { char: 'け', roman: 'ke', meaning: 'ke' },
            { char: 'こ', roman: 'ko', meaning: 'ko' },
          ] as CharItem[],
        },
        {
          id: 'hiragana-s',
          title: 'S-row',
          subtitle: 'さ し す せ そ',
          type: 'chars',
          items: [
            { char: 'さ', roman: 'sa',  meaning: 'sa' },
            { char: 'し', roman: 'shi', meaning: 'shi' },
            { char: 'す', roman: 'su',  meaning: 'su' },
            { char: 'せ', roman: 'se',  meaning: 'se' },
            { char: 'そ', roman: 'so',  meaning: 'so' },
          ] as CharItem[],
        },
        {
          id: 'hiragana-t',
          title: 'T-row',
          subtitle: 'た ち つ て と',
          type: 'chars',
          items: [
            { char: 'た', roman: 'ta',  meaning: 'ta' },
            { char: 'ち', roman: 'chi', meaning: 'chi' },
            { char: 'つ', roman: 'tsu', meaning: 'tsu' },
            { char: 'て', roman: 'te',  meaning: 'te' },
            { char: 'と', roman: 'to',  meaning: 'to' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'katakana',
      title: 'Katakana',
      description: 'Used for foreign loan words and emphasis',
      icon: 'ア',
      lessons: [
        {
          id: 'katakana-vowels',
          title: 'Vowels',
          subtitle: 'ア イ ウ エ オ',
          type: 'chars',
          items: [
            { char: 'ア', roman: 'a',  meaning: 'same sound as あ' },
            { char: 'イ', roman: 'i',  meaning: 'same sound as い' },
            { char: 'ウ', roman: 'u',  meaning: 'same sound as う' },
            { char: 'エ', roman: 'e',  meaning: 'same sound as え' },
            { char: 'オ', roman: 'o',  meaning: 'same sound as お' },
          ] as CharItem[],
        },
        {
          id: 'katakana-k',
          title: 'K-row',
          subtitle: 'カ キ ク ケ コ',
          type: 'chars',
          items: [
            { char: 'カ', roman: 'ka', meaning: 'ka' },
            { char: 'キ', roman: 'ki', meaning: 'ki' },
            { char: 'ク', roman: 'ku', meaning: 'ku' },
            { char: 'ケ', roman: 'ke', meaning: 'ke' },
            { char: 'コ', roman: 'ko', meaning: 'ko' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'ja-vocab',
      title: 'Essential Vocabulary',
      description: 'High-frequency words for everyday conversation',
      icon: '言',
      lessons: [
        {
          id: 'ja-greetings',
          title: 'Greetings',
          subtitle: 'Common greetings and farewells',
          type: 'vocab',
          items: [
            { word: 'こんにちは', roman: 'Konnichiwa',  meaning: 'Hello / Good afternoon' },
            { word: 'おはよう',   roman: 'Ohayou',      meaning: 'Good morning' },
            { word: 'こんばんは', roman: 'Konbanwa',    meaning: 'Good evening' },
            { word: 'さようなら', roman: 'Sayounara',   meaning: 'Goodbye' },
            { word: 'ありがとう', roman: 'Arigatou',    meaning: 'Thank you' },
            { word: 'すみません', roman: 'Sumimasen',   meaning: 'Excuse me / Sorry' },
          ] as VocabItem[],
        },
        {
          id: 'ja-numbers',
          title: 'Numbers 1–10',
          subtitle: 'Counting basics',
          type: 'vocab',
          items: [
            { word: '一', roman: 'ichi', meaning: '1' },
            { word: '二', roman: 'ni',   meaning: '2' },
            { word: '三', roman: 'san',  meaning: '3' },
            { word: '四', roman: 'shi / yon', meaning: '4' },
            { word: '五', roman: 'go',   meaning: '5' },
            { word: '六', roman: 'roku', meaning: '6' },
            { word: '七', roman: 'nana / shichi', meaning: '7' },
            { word: '八', roman: 'hachi', meaning: '8' },
            { word: '九', roman: 'ku / kyuu', meaning: '9' },
            { word: '十', roman: 'juu',  meaning: '10' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'ja-grammar',
      title: 'Grammar Basics',
      description: 'Core sentence patterns and particles',
      icon: '文',
      lessons: [
        {
          id: 'ja-particles',
          title: 'Particles',
          subtitle: 'は、が、を、に',
          type: 'grammar',
          items: [
            {
              rule: 'Topic particle は (wa)',
              detail: 'Marks the topic of the sentence. What you\'re talking about.',
              examples: [
                { native: '私は学生です。', roman: 'Watashi wa gakusei desu.', en: 'I am a student.' },
                { native: '猫はかわいいです。', roman: 'Neko wa kawaii desu.', en: 'The cat is cute.' },
              ],
            },
            {
              rule: 'Object particle を (wo)',
              detail: 'Marks the direct object — what the action is done to.',
              examples: [
                { native: '本を読む。', roman: 'Hon wo yomu.', en: 'I read a book.' },
                { native: '水を飲む。', roman: 'Mizu wo nomu.', en: 'I drink water.' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Chinese (Mandarin)
// ─────────────────────────────────────────────────────────────────────────────
const zh: FoundationData = {
  langCode: 'zh',
  sections: [
    {
      id: 'tones',
      title: 'Tones',
      description: 'Mandarin has four tones — meaning changes with pitch',
      icon: '声',
      lessons: [
        {
          id: 'zh-four-tones',
          title: 'The Four Tones',
          subtitle: 'mā má mǎ mà',
          type: 'tones',
          items: [
            { char: '妈 (mā)', roman: '1st tone — high and flat', meaning: 'mother' },
            { char: '麻 (má)', roman: '2nd tone — rising',        meaning: 'hemp / numb' },
            { char: '马 (mǎ)', roman: '3rd tone — dip then rise', meaning: 'horse' },
            { char: '骂 (mà)', roman: '4th tone — sharp falling', meaning: 'to scold' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'pinyin',
      title: 'Pinyin',
      description: 'The official romanization system for Mandarin',
      icon: 'pīn',
      lessons: [
        {
          id: 'zh-initials',
          title: 'Initials (consonants)',
          subtitle: 'b p m f d t n l …',
          type: 'chars',
          items: [
            { char: 'b', roman: 'b',  meaning: 'as in "boy"' },
            { char: 'p', roman: 'p',  meaning: 'aspirated p' },
            { char: 'm', roman: 'm',  meaning: 'as in "man"' },
            { char: 'f', roman: 'f',  meaning: 'as in "fan"' },
            { char: 'd', roman: 'd',  meaning: 'as in "day"' },
            { char: 't', roman: 't',  meaning: 'aspirated t' },
            { char: 'n', roman: 'n',  meaning: 'as in "now"' },
            { char: 'l', roman: 'l',  meaning: 'as in "law"' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'zh-vocab',
      title: 'Essential Vocabulary',
      description: 'Common words to get started immediately',
      icon: '词',
      lessons: [
        {
          id: 'zh-greetings',
          title: 'Greetings',
          subtitle: 'Everyday hellos',
          type: 'vocab',
          items: [
            { word: '你好',   roman: 'Nǐ hǎo',    meaning: 'Hello' },
            { word: '早上好', roman: 'Zǎoshang hǎo', meaning: 'Good morning' },
            { word: '谢谢',   roman: 'Xièxiè',    meaning: 'Thank you' },
            { word: '不客气', roman: 'Bù kèqì',   meaning: 'You\'re welcome' },
            { word: '对不起', roman: 'Duìbuqǐ',   meaning: 'Sorry' },
            { word: '再见',   roman: 'Zàijiàn',   meaning: 'Goodbye' },
          ] as VocabItem[],
        },
        {
          id: 'zh-numbers',
          title: 'Numbers 1–10',
          subtitle: '一 to 十',
          type: 'vocab',
          items: [
            { word: '一', roman: 'yī',  meaning: '1' },
            { word: '二', roman: 'èr',  meaning: '2' },
            { word: '三', roman: 'sān', meaning: '3' },
            { word: '四', roman: 'sì',  meaning: '4' },
            { word: '五', roman: 'wǔ',  meaning: '5' },
            { word: '六', roman: 'liù', meaning: '6' },
            { word: '七', roman: 'qī',  meaning: '7' },
            { word: '八', roman: 'bā',  meaning: '8' },
            { word: '九', roman: 'jiǔ', meaning: '9' },
            { word: '十', roman: 'shí', meaning: '10' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'zh-grammar',
      title: 'Grammar Basics',
      description: 'How Mandarin sentences are structured',
      icon: '法',
      lessons: [
        {
          id: 'zh-sentence-order',
          title: 'Sentence Order',
          subtitle: 'Subject–Verb–Object',
          type: 'grammar',
          items: [
            {
              rule: 'SVO Order',
              detail: 'Mandarin follows Subject–Verb–Object order, similar to English.',
              examples: [
                { native: '我吃饭。', roman: 'Wǒ chī fàn.', en: 'I eat rice.' },
                { native: '他喝水。', roman: 'Tā hē shuǐ.', en: 'He drinks water.' },
              ],
            },
            {
              rule: 'No verb conjugation',
              detail: 'Verbs never change form for person, number, or tense in Mandarin.',
              examples: [
                { native: '我去。/ 你去。/ 他去。', roman: 'Wǒ qù. / Nǐ qù. / Tā qù.', en: 'I go. / You go. / He goes.' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Arabic
// ─────────────────────────────────────────────────────────────────────────────
const ar: FoundationData = {
  langCode: 'ar',
  sections: [
    {
      id: 'alphabet',
      title: 'The Arabic Alphabet',
      description: '28 letters — written right to left',
      icon: 'أ',
      lessons: [
        {
          id: 'ar-alef-group',
          title: 'Alef Group',
          subtitle: 'ا ب ت ث',
          type: 'chars',
          items: [
            { char: 'ا', roman: 'alef', meaning: 'glottal stop / long "a"' },
            { char: 'ب', roman: 'ba',   meaning: 'b sound' },
            { char: 'ت', roman: 'ta',   meaning: 't sound' },
            { char: 'ث', roman: 'tha',  meaning: 'th (as in "think")' },
          ] as CharItem[],
        },
        {
          id: 'ar-jim-group',
          title: 'Jim Group',
          subtitle: 'ج ح خ',
          type: 'chars',
          items: [
            { char: 'ج', roman: 'jim',  meaning: 'j sound' },
            { char: 'ح', roman: 'ha',   meaning: 'breathy h' },
            { char: 'خ', roman: 'kha',  meaning: 'kh (as in "loch")' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'ar-vocab',
      title: 'Essential Vocabulary',
      description: 'High-frequency Arabic words',
      icon: 'كلم',
      lessons: [
        {
          id: 'ar-greetings',
          title: 'Greetings',
          subtitle: 'Everyday hellos',
          type: 'vocab',
          items: [
            { word: 'مرحبا',       roman: 'Marhaba',         meaning: 'Hello' },
            { word: 'السلام عليكم', roman: 'As-salāmu alaykum', meaning: 'Peace be upon you' },
            { word: 'شكراً',       roman: 'Shukran',         meaning: 'Thank you' },
            { word: 'عفواً',       roman: 'Afwan',           meaning: 'You\'re welcome / Excuse me' },
            { word: 'مع السلامة',  roman: 'Maʿa s-salāma',  meaning: 'Goodbye' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'ar-grammar',
      title: 'Grammar Basics',
      description: 'Roots, gender, and sentence patterns',
      icon: 'نحو',
      lessons: [
        {
          id: 'ar-gender',
          title: 'Grammatical Gender',
          subtitle: 'Masculine and Feminine',
          type: 'grammar',
          items: [
            {
              rule: 'Feminine marker ة (ta marbuta)',
              detail: 'Most feminine nouns end in ة. Masculine nouns typically do not carry a special ending.',
              examples: [
                { native: 'طالب / طالبة', roman: 'ṭālib / ṭāliba', en: 'male student / female student' },
                { native: 'معلم / معلمة', roman: 'muʿallim / muʿallima', en: 'male teacher / female teacher' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Korean
// ─────────────────────────────────────────────────────────────────────────────
const ko: FoundationData = {
  langCode: 'ko',
  sections: [
    {
      id: 'hangul',
      title: 'Hangul',
      description: 'The Korean alphabet — 14 consonants, 10 vowels',
      icon: '한',
      lessons: [
        {
          id: 'ko-vowels',
          title: 'Basic Vowels',
          subtitle: 'ㅏ ㅑ ㅓ ㅕ ㅗ …',
          type: 'chars',
          items: [
            { char: 'ㅏ', roman: 'a',  meaning: 'as in "ah"' },
            { char: 'ㅓ', roman: 'eo', meaning: 'as in "uhh"' },
            { char: 'ㅗ', roman: 'o',  meaning: 'as in "oh"' },
            { char: 'ㅜ', roman: 'u',  meaning: 'as in "oo"' },
            { char: 'ㅡ', roman: 'eu', meaning: 'no English equiv.' },
            { char: 'ㅣ', roman: 'i',  meaning: 'as in "ee"' },
          ] as CharItem[],
        },
        {
          id: 'ko-consonants',
          title: 'Basic Consonants',
          subtitle: 'ㄱ ㄴ ㄷ ㄹ ㅁ …',
          type: 'chars',
          items: [
            { char: 'ㄱ', roman: 'g / k', meaning: 'unaspirated g/k' },
            { char: 'ㄴ', roman: 'n',     meaning: 'n sound' },
            { char: 'ㄷ', roman: 'd / t', meaning: 'unaspirated d/t' },
            { char: 'ㄹ', roman: 'r / l', meaning: 'between r and l' },
            { char: 'ㅁ', roman: 'm',     meaning: 'm sound' },
            { char: 'ㅂ', roman: 'b / p', meaning: 'unaspirated b/p' },
            { char: 'ㅅ', roman: 's',     meaning: 's sound' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'ko-vocab',
      title: 'Essential Vocabulary',
      description: 'Everyday Korean words',
      icon: '말',
      lessons: [
        {
          id: 'ko-greetings',
          title: 'Greetings',
          subtitle: 'Hellos and goodbyes',
          type: 'vocab',
          items: [
            { word: '안녕하세요', roman: 'Annyeonghaseyo', meaning: 'Hello (formal)' },
            { word: '감사합니다', roman: 'Gamsahamnida',   meaning: 'Thank you (formal)' },
            { word: '죄송합니다', roman: 'Joesonghamnida', meaning: 'I\'m sorry (formal)' },
            { word: '안녕히 가세요', roman: 'Annyeonghi gaseyo', meaning: 'Goodbye (to someone leaving)' },
            { word: '네',       roman: 'Ne',             meaning: 'Yes' },
            { word: '아니요',   roman: 'Aniyo',          meaning: 'No' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'ko-grammar',
      title: 'Grammar Basics',
      description: 'Particles and SOV sentence structure',
      icon: '문법',
      lessons: [
        {
          id: 'ko-sov',
          title: 'Subject–Object–Verb',
          subtitle: 'Korean puts the verb last',
          type: 'grammar',
          items: [
            {
              rule: 'SOV word order',
              detail: 'The verb always comes at the end of the sentence in Korean.',
              examples: [
                { native: '저는 밥을 먹어요.', roman: 'Jeoneun babeul meogeoyo.', en: 'I eat rice.' },
                { native: '그는 물을 마셔요.', roman: 'Geuneun mureul masyeoyo.', en: 'He drinks water.' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Hindi
// ─────────────────────────────────────────────────────────────────────────────
const hi: FoundationData = {
  langCode: 'hi',
  sections: [
    {
      id: 'devanagari',
      title: 'Devanagari Script',
      description: 'The alphabet used for Hindi — 13 vowels, 36 consonants',
      icon: 'अ',
      lessons: [
        {
          id: 'hi-vowels',
          title: 'Vowels (स्वर)',
          subtitle: 'अ आ इ ई उ ऊ …',
          type: 'chars',
          items: [
            { char: 'अ', roman: 'a',  meaning: 'as in "but"' },
            { char: 'आ', roman: 'aa', meaning: 'as in "father"' },
            { char: 'इ', roman: 'i',  meaning: 'as in "pin"' },
            { char: 'ई', roman: 'ee', meaning: 'as in "feet"' },
            { char: 'उ', roman: 'u',  meaning: 'as in "put"' },
            { char: 'ऊ', roman: 'oo', meaning: 'as in "boot"' },
          ] as CharItem[],
        },
        {
          id: 'hi-consonants',
          title: 'Consonants (व्यंजन)',
          subtitle: 'क ख ग घ …',
          type: 'chars',
          items: [
            { char: 'क', roman: 'ka', meaning: 'unaspirated k' },
            { char: 'ख', roman: 'kha', meaning: 'aspirated k' },
            { char: 'ग', roman: 'ga', meaning: 'unaspirated g' },
            { char: 'घ', roman: 'gha', meaning: 'aspirated g' },
            { char: 'च', roman: 'cha', meaning: 'unaspirated ch' },
            { char: 'ज', roman: 'ja', meaning: 'j sound' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'hi-vocab',
      title: 'Essential Vocabulary',
      description: 'Most-used Hindi words',
      icon: 'शब्द',
      lessons: [
        {
          id: 'hi-greetings',
          title: 'Greetings',
          subtitle: 'Common hellos',
          type: 'vocab',
          items: [
            { word: 'नमस्ते',       roman: 'Namaste',      meaning: 'Hello / Greetings' },
            { word: 'धन्यवाद',     roman: 'Dhanyavaad',   meaning: 'Thank you' },
            { word: 'माफ़ कीजिए',  roman: 'Maaf kijiye',  meaning: 'Excuse me / Sorry' },
            { word: 'हाँ',          roman: 'Haan',         meaning: 'Yes' },
            { word: 'नहीं',         roman: 'Nahin',        meaning: 'No' },
            { word: 'अलविदा',      roman: 'Alvida',       meaning: 'Goodbye' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'hi-grammar',
      title: 'Grammar Basics',
      description: 'Gender, postpositions, and SOV structure',
      icon: 'व्याकरण',
      lessons: [
        {
          id: 'hi-gender',
          title: 'Grammatical Gender',
          subtitle: 'Every noun is masculine or feminine',
          type: 'grammar',
          items: [
            {
              rule: 'Noun gender affects verbs and adjectives',
              detail: 'Hindi nouns have grammatical gender. Adjectives and verb endings agree with the noun\'s gender.',
              examples: [
                { native: 'लड़का अच्छा है।', roman: 'Laṛkā acchā hai.', en: 'The boy is good. (masculine)' },
                { native: 'लड़की अच्छी है।', roman: 'Laṛkī acchī hai.', en: 'The girl is good. (feminine)' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Russian
// ─────────────────────────────────────────────────────────────────────────────
const ru: FoundationData = {
  langCode: 'ru',
  sections: [
    {
      id: 'cyrillic',
      title: 'Cyrillic Alphabet',
      description: '33 letters — many familiar, some deceptive',
      icon: 'А',
      lessons: [
        {
          id: 'ru-familiar',
          title: 'Familiar Letters',
          subtitle: 'Letters similar to Latin',
          type: 'chars',
          items: [
            { char: 'А', roman: 'a',  meaning: 'as in "father"' },
            { char: 'Е', roman: 'ye', meaning: 'as in "yet"' },
            { char: 'М', roman: 'm',  meaning: 'm sound' },
            { char: 'О', roman: 'o',  meaning: 'as in "more"' },
            { char: 'Т', roman: 't',  meaning: 't sound' },
          ] as CharItem[],
        },
        {
          id: 'ru-deceptive',
          title: 'Deceptive Letters',
          subtitle: 'Look like Latin but sound different',
          type: 'chars',
          items: [
            { char: 'В', roman: 'v',  meaning: 'looks like B, sounds like V' },
            { char: 'Н', roman: 'n',  meaning: 'looks like H, sounds like N' },
            { char: 'Р', roman: 'r',  meaning: 'looks like P, sounds like R' },
            { char: 'С', roman: 's',  meaning: 'looks like C, sounds like S' },
            { char: 'У', roman: 'u',  meaning: 'looks like Y, sounds like OO' },
            { char: 'Х', roman: 'kh', meaning: 'looks like X, sounds like KH' },
          ] as CharItem[],
        },
        {
          id: 'ru-new',
          title: 'New Letters',
          subtitle: 'Unique to Cyrillic',
          type: 'chars',
          items: [
            { char: 'Б', roman: 'b',  meaning: 'b sound' },
            { char: 'Г', roman: 'g',  meaning: 'g sound' },
            { char: 'Д', roman: 'd',  meaning: 'd sound' },
            { char: 'Ж', roman: 'zh', meaning: 'as in "measure"' },
            { char: 'З', roman: 'z',  meaning: 'z sound' },
            { char: 'И', roman: 'i',  meaning: 'as in "bee"' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'ru-vocab',
      title: 'Essential Vocabulary',
      description: 'Core Russian words',
      icon: 'слово',
      lessons: [
        {
          id: 'ru-greetings',
          title: 'Greetings',
          subtitle: 'Hellos and farewells',
          type: 'vocab',
          items: [
            { word: 'Привет',    roman: 'Privet',        meaning: 'Hi (informal)' },
            { word: 'Здравствуйте', roman: 'Zdravstvuyte', meaning: 'Hello (formal)' },
            { word: 'Спасибо',  roman: 'Spasibo',       meaning: 'Thank you' },
            { word: 'Пожалуйста', roman: 'Pozhaluysta', meaning: 'Please / You\'re welcome' },
            { word: 'Извините', roman: 'Izvinite',      meaning: 'Excuse me / Sorry' },
            { word: 'До свидания', roman: 'Do svidaniya', meaning: 'Goodbye' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'ru-grammar',
      title: 'Grammar Basics',
      description: 'Cases, gender, and verb aspect',
      icon: 'грамм',
      lessons: [
        {
          id: 'ru-gender',
          title: 'Noun Gender',
          subtitle: 'Masculine, feminine, neuter',
          type: 'grammar',
          items: [
            {
              rule: 'Gender from endings',
              detail: 'Masculine nouns often end in a consonant, feminine in -а/-я, neuter in -о/-е.',
              examples: [
                { native: 'стол (m.) / книга (f.) / окно (n.)', roman: 'stol / kniga / okno', en: 'table / book / window' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Persian / Farsi
// ─────────────────────────────────────────────────────────────────────────────
const fa: FoundationData = {
  langCode: 'fa',
  sections: [
    {
      id: 'perso-arabic',
      title: 'Perso-Arabic Script',
      description: '32 letters — written right to left, based on Arabic script',
      icon: 'ا',
      lessons: [
        {
          id: 'fa-alef-group',
          title: 'Alef Group',
          subtitle: 'ا ب پ ت ث',
          type: 'chars',
          items: [
            { char: 'ا', roman: 'alef', meaning: 'long "a" or glottal stop' },
            { char: 'ب', roman: 'be',   meaning: 'b sound' },
            { char: 'پ', roman: 'pe',   meaning: 'p sound (unique to Farsi)' },
            { char: 'ت', roman: 'te',   meaning: 't sound' },
            { char: 'ث', roman: 'se',   meaning: 's sound' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'fa-vocab',
      title: 'Essential Vocabulary',
      description: 'Most common Farsi words',
      icon: 'واژه',
      lessons: [
        {
          id: 'fa-greetings',
          title: 'Greetings',
          subtitle: 'Hellos and polite phrases',
          type: 'vocab',
          items: [
            { word: 'سلام',         roman: 'Salâm',          meaning: 'Hello' },
            { word: 'ممنون',        roman: 'Mamnun',         meaning: 'Thank you' },
            { word: 'خواهش می‌کنم', roman: 'Khâhesh mikonam', meaning: 'Please / You\'re welcome' },
            { word: 'ببخشید',       roman: 'Bebakhshid',     meaning: 'Excuse me / Sorry' },
            { word: 'خداحافظ',     roman: 'Khodâhâfez',    meaning: 'Goodbye' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'fa-grammar',
      title: 'Grammar Basics',
      description: 'SOV order and ezafe construction',
      icon: 'دستور',
      lessons: [
        {
          id: 'fa-sov',
          title: 'SOV Word Order',
          subtitle: 'Verb comes last',
          type: 'grammar',
          items: [
            {
              rule: 'Subject–Object–Verb',
              detail: 'Like many Iranian languages, Farsi places the verb at the end.',
              examples: [
                { native: 'من آب می‌خورم.', roman: 'Man âb mikhuram.', en: 'I drink water.' },
                { native: 'او کتاب می‌خواند.', roman: 'U ketâb mikhânad.', en: 'He/She reads a book.' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// English
// ─────────────────────────────────────────────────────────────────────────────
const en: FoundationData = {
  langCode: 'en',
  sections: [
    {
      id: 'en-phonics',
      title: 'Phonics & Pronunciation',
      description: 'Silent letters, vowel teams, and tricky sounds',
      icon: 'Aa',
      lessons: [
        {
          id: 'en-silent',
          title: 'Silent Letters',
          subtitle: 'Letters that hide in words',
          type: 'vocab',
          items: [
            { word: 'knife',   roman: 'naɪf',   meaning: 'The "k" is silent' },
            { word: 'write',   roman: 'raɪt',   meaning: 'The "w" is silent' },
            { word: 'island',  roman: 'aɪlənd', meaning: 'The "s" is silent' },
            { word: 'honest',  roman: 'ɒnɪst',  meaning: 'The "h" is silent' },
            { word: 'could',   roman: 'kʊd',    meaning: 'The "l" is silent' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'en-vocab',
      title: 'Essential Vocabulary',
      description: 'High-frequency English words',
      icon: 'ABC',
      lessons: [
        {
          id: 'en-greetings',
          title: 'Greetings & Small Talk',
          subtitle: 'Everyday openers',
          type: 'vocab',
          items: [
            { word: 'Hello / Hi',    roman: 'hɛˈloʊ / haɪ', meaning: 'Casual or formal greeting' },
            { word: 'How are you?',  roman: 'haʊ ɑːr juː',  meaning: 'Asking about wellbeing' },
            { word: 'Thank you',     roman: 'θæŋk juː',     meaning: 'Expressing gratitude' },
            { word: 'Excuse me',     roman: 'ɪkˈskjuːz miː', meaning: 'Getting attention / apologising' },
            { word: 'Nice to meet you', roman: 'naɪs tə miːt juː', meaning: 'First meeting greeting' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'en-grammar',
      title: 'Grammar Basics',
      description: 'Tenses, articles, and sentence structure',
      icon: 'G',
      lessons: [
        {
          id: 'en-articles',
          title: 'Articles: a, an, the',
          subtitle: 'When to use each',
          type: 'grammar',
          items: [
            {
              rule: '"a" and "an" (indefinite)',
              detail: 'Use "a" before consonant sounds, "an" before vowel sounds. For non-specific nouns.',
              examples: [
                { native: 'a cat / an apple', roman: 'eɪ kæt / æn ˈæpəl', en: 'any cat / any apple (first mention or non-specific)' },
              ],
            },
            {
              rule: '"the" (definite)',
              detail: 'Use "the" when both speaker and listener know which specific thing is meant.',
              examples: [
                { native: 'the cat / the apple', roman: 'ðə kæt / ðiː ˈæpəl', en: 'the specific cat or apple already established' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Spanish
// ─────────────────────────────────────────────────────────────────────────────
const es: FoundationData = {
  langCode: 'es',
  sections: [
    {
      id: 'es-pronunciation',
      title: 'Pronunciation',
      description: 'Spanish is mostly phonetic — what you see is what you say',
      icon: 'ñ',
      lessons: [
        {
          id: 'es-special-chars',
          title: 'Special Characters',
          subtitle: 'ñ, ll, rr, ch',
          type: 'chars',
          items: [
            { char: 'ñ',  roman: 'ny',  meaning: 'as in "canyon"' },
            { char: 'll', roman: 'y/j', meaning: 'like "y" in most regions' },
            { char: 'rr', roman: 'rr',  meaning: 'trilled r' },
            { char: 'ch', roman: 'ch',  meaning: 'as in "church"' },
            { char: 'h',  roman: '(silent)', meaning: 'h is always silent in Spanish' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'es-vocab',
      title: 'Essential Vocabulary',
      description: 'Most-used Spanish words',
      icon: 'ES',
      lessons: [
        {
          id: 'es-greetings',
          title: 'Greetings',
          subtitle: 'Hellos and polite phrases',
          type: 'vocab',
          items: [
            { word: 'Hola',           roman: 'OH-lah',          meaning: 'Hello' },
            { word: 'Buenos días',    roman: 'BWEH-nos DEE-as', meaning: 'Good morning' },
            { word: 'Gracias',        roman: 'GRAH-thyahs',     meaning: 'Thank you' },
            { word: 'De nada',        roman: 'deh NAH-dah',     meaning: 'You\'re welcome' },
            { word: 'Por favor',      roman: 'por fah-VOR',     meaning: 'Please' },
            { word: 'Perdón',         roman: 'pehr-DON',        meaning: 'Sorry / Excuse me' },
            { word: 'Hasta luego',    roman: 'AHS-tah LWEH-go', meaning: 'Goodbye' },
          ] as VocabItem[],
        },
        {
          id: 'es-numbers',
          title: 'Numbers 1–10',
          subtitle: 'Uno a diez',
          type: 'vocab',
          items: [
            { word: 'uno',   roman: 'OO-noh',  meaning: '1' },
            { word: 'dos',   roman: 'dohs',    meaning: '2' },
            { word: 'tres',  roman: 'trehs',   meaning: '3' },
            { word: 'cuatro', roman: 'KWAH-troh', meaning: '4' },
            { word: 'cinco', roman: 'SEEN-koh', meaning: '5' },
            { word: 'seis',  roman: 'sehs',    meaning: '6' },
            { word: 'siete', roman: 'SYEH-teh', meaning: '7' },
            { word: 'ocho',  roman: 'OH-choh',  meaning: '8' },
            { word: 'nueve', roman: 'NWEH-beh', meaning: '9' },
            { word: 'diez',  roman: 'dyehs',   meaning: '10' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'es-grammar',
      title: 'Grammar Basics',
      description: 'Verb conjugation, gender, and ser vs estar',
      icon: 'G',
      lessons: [
        {
          id: 'es-ser-estar',
          title: 'Ser vs Estar',
          subtitle: 'Two ways to say "to be"',
          type: 'grammar',
          items: [
            {
              rule: 'Ser — permanent or inherent qualities',
              detail: 'Use ser for identity, origin, profession, and lasting characteristics.',
              examples: [
                { native: 'Soy médico.', roman: 'Soy MED-ee-koh.', en: 'I am a doctor.' },
                { native: 'Ella es española.', roman: 'Eh-yah es es-pan-YO-lah.', en: 'She is Spanish.' },
              ],
            },
            {
              rule: 'Estar — temporary states and locations',
              detail: 'Use estar for feelings, health, location, and temporary conditions.',
              examples: [
                { native: 'Estoy cansado.', roman: 'Es-TOY kan-SAH-doh.', en: 'I am tired.' },
                { native: 'El libro está en la mesa.', roman: '...es-TAH en lah ME-sah.', en: 'The book is on the table.' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// French
// ─────────────────────────────────────────────────────────────────────────────
const fr: FoundationData = {
  langCode: 'fr',
  sections: [
    {
      id: 'fr-pronunciation',
      title: 'Pronunciation',
      description: 'Nasal vowels, liaisons, and silent endings',
      icon: 'FR',
      lessons: [
        {
          id: 'fr-nasal',
          title: 'Nasal Vowels',
          subtitle: 'an, en, in, on, un',
          type: 'chars',
          items: [
            { char: 'an / en', roman: 'ɑ̃',  meaning: 'as in "ensemble"' },
            { char: 'in / ain', roman: 'ɛ̃', meaning: 'nasal "eh"' },
            { char: 'on',       roman: 'ɔ̃', meaning: 'nasal "oh"' },
            { char: 'un',       roman: 'œ̃', meaning: 'nasal "uh"' },
          ] as CharItem[],
        },
      ],
    },
    {
      id: 'fr-vocab',
      title: 'Essential Vocabulary',
      description: 'Most-used French words',
      icon: 'FR',
      lessons: [
        {
          id: 'fr-greetings',
          title: 'Greetings',
          subtitle: 'Hellos and farewells',
          type: 'vocab',
          items: [
            { word: 'Bonjour',    roman: 'bon-ZHOOR',    meaning: 'Hello / Good day' },
            { word: 'Bonsoir',    roman: 'bon-SWAHR',    meaning: 'Good evening' },
            { word: 'Merci',      roman: 'mehr-SEE',     meaning: 'Thank you' },
            { word: 'De rien',    roman: 'duh RYEHN',    meaning: 'You\'re welcome' },
            { word: 'Excusez-moi', roman: 'ex-kyoo-ZAY mwah', meaning: 'Excuse me' },
            { word: 'Au revoir',  roman: 'oh ruh-VWAHR', meaning: 'Goodbye' },
          ] as VocabItem[],
        },
      ],
    },
    {
      id: 'fr-grammar',
      title: 'Grammar Basics',
      description: 'Gender, liaison, and verb patterns',
      icon: 'G',
      lessons: [
        {
          id: 'fr-gender',
          title: 'Noun Gender',
          subtitle: 'Le vs La',
          type: 'grammar',
          items: [
            {
              rule: 'Every French noun has gender',
              detail: 'There is no natural rule that always works — gender must be learned with the word. Definite article: le (m.) / la (f.) / les (pl.)',
              examples: [
                { native: 'le livre / la table', roman: 'luh LEE-vruh / lah TAH-bluh', en: 'the book (m.) / the table (f.)' },
                { native: 'l\'ami / l\'amie', roman: 'lah-MEE / lah-MEE', en: 'the male friend / the female friend' },
              ],
            },
          ] as GrammarItem[],
        },
      ],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry
// ─────────────────────────────────────────────────────────────────────────────
const FOUNDATION_MAP: Record<string, FoundationData> = { ja, zh, ar, ko, hi, ru, fa, en, es, fr };

export function getFoundation(langCode: string): FoundationData | null {
  return FOUNDATION_MAP[langCode] ?? null;
}

export const FOUNDATION_LANG_CODES = Object.keys(FOUNDATION_MAP);
