export type ExamLabels = {
  wordCount: string;
  submit: string;
  placeholder: string;
  writeAtLeast: string;
  minutes: string;
};

const DEFAULT: ExamLabels = {
  wordCount:    'words',
  submit:       'Submit →',
  placeholder:  'Begin your essay here…',
  writeAtLeast: 'Write at least',
  minutes:      'minutes',
};

const FRENCH: ExamLabels = {
  wordCount:    'mots',
  submit:       'Soumettre →',
  placeholder:  'Commencez votre rédaction ici…',
  writeAtLeast: 'Écrivez au moins',
  minutes:      'minutes',
};

const SPANISH: ExamLabels = {
  wordCount:    'palabras',
  submit:       'Enviar →',
  placeholder:  'Comience su redacción aquí…',
  writeAtLeast: 'Escriba al menos',
  minutes:      'minutos',
};

const GERMAN: ExamLabels = {
  wordCount:    'Wörter',
  submit:       'Einreichen →',
  placeholder:  'Beginnen Sie hier…',
  writeAtLeast: 'Schreiben Sie mindestens',
  minutes:      'Minuten',
};

const ITALIAN: ExamLabels = {
  wordCount:    'parole',
  submit:       'Invia →',
  placeholder:  'Inizia qui la tua risposta…',
  writeAtLeast: 'Scrivi almeno',
  minutes:      'minuti',
};

const PORTUGUESE: ExamLabels = {
  wordCount:    'palavras',
  submit:       'Enviar →',
  placeholder:  'Comece sua redação aqui…',
  writeAtLeast: 'Escreva pelo menos',
  minutes:      'minutos',
};

const CHINESE: ExamLabels = {
  wordCount:    '字',
  submit:       '提交 →',
  placeholder:  '在此开始写作…',
  writeAtLeast: '至少写',
  minutes:      '分钟',
};

const JAPANESE: ExamLabels = {
  wordCount:    '語',
  submit:       '提出する →',
  placeholder:  'ここに書き始めてください…',
  writeAtLeast: '少なくとも',
  minutes:      '分',
};

const KOREAN: ExamLabels = {
  wordCount:    '자',
  submit:       '제출 →',
  placeholder:  '여기에 작성을 시작하세요…',
  writeAtLeast: '최소',
  minutes:      '분',
};

const ARABIC: ExamLabels = {
  wordCount:    'كلمة',
  submit:       'إرسال →',
  placeholder:  'ابدأ كتابتك هنا…',
  writeAtLeast: 'اكتب على الأقل',
  minutes:      'دقيقة',
};

const RUSSIAN: ExamLabels = {
  wordCount:    'слов',
  submit:       'Отправить →',
  placeholder:  'Начните здесь…',
  writeAtLeast: 'Напишите не менее',
  minutes:      'минут',
};

const TURKISH: ExamLabels = {
  wordCount:    'kelime',
  submit:       'Gönder →',
  placeholder:  'Yazınıza buradan başlayın…',
  writeAtLeast: 'En az',
  minutes:      'dakika',
};

const DUTCH: ExamLabels = {
  wordCount:    'woorden',
  submit:       'Insturen →',
  placeholder:  'Begin hier uw tekst…',
  writeAtLeast: 'Schrijf minimaal',
  minutes:      'minuten',
};

const HINDI: ExamLabels = {
  wordCount:    'शब्द',
  submit:       'जमा करें →',
  placeholder:  'यहाँ लिखना शुरू करें…',
  writeAtLeast: 'कम से कम',
  minutes:      'मिनट',
};

const PERSIAN: ExamLabels = {
  wordCount:    'کلمه',
  submit:       'ارسال →',
  placeholder:  'نوشتن را از اینجا شروع کنید…',
  writeAtLeast: 'حداقل',
  minutes:      'دقیقه',
};

const EXAM_LANGUAGE_MAP: Record<string, ExamLabels> = {
  delf: FRENCH,  dalf: FRENCH,
  dele: SPANISH, siele: SPANISH,
  goethe: GERMAN, testdaf: GERMAN,
  cils: ITALIAN,  celi: ITALIAN,
  celpe: PORTUGUESE, caple: PORTUGUESE,
  hsk: CHINESE,  hskk: CHINESE,
  jlpt: JAPANESE, jft: JAPANESE,
  topik: KOREAN,
  alpt: ARABIC,  actfl: ARABIC,
  torfl: RUSSIAN,
  tys: TURKISH,
  cnavt: DUTCH, nt2: DUTCH,
  praveen: HINDI, hindi_cefr: HINDI,
  persian_cefr: PERSIAN,
};

export function getLabels(examId: string): ExamLabels {
  return EXAM_LANGUAGE_MAP[examId] ?? DEFAULT;
}
