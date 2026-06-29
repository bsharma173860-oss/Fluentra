// ── Module Sessions ─────────────────────────────────────────
// Reading · Listening · Speaking · Writing — in-session UI
// All 4 share the same chrome: header, progress, timer, content area


// CEFR level -> content difficulty, so practice matches the learner's placement.
function _levelFor(lang) { try { var L = window.langByCode && window.langByCode(lang); return (L && L.level) || 'A2'; } catch (e) { return 'A2'; } }
function _diffForLevel(lvl) { var v = String(lvl || '').toUpperCase(); if (v === 'A1' || v === 'A2') return 'easy'; if (v === 'C1' || v === 'C2') return 'hard'; return 'medium'; }

function _modPrefix(){
  const c=window.__langCode||'en';
  // Prefer the language's own exam short code (Goethe, CILS, TOPIK, HSK, …).
  if (typeof langPack === 'function') {
    const pk = langPack(c);
    return pk?.exam?.short || (typeof EXAMS!=='undefined'&&EXAMS[c]?.short) || 'CEFR';
  }
  const m={en:'IELTS',es:'DELE',ja:'JLPT',fr:'DELF',de:'Goethe',it:'CILS',pt:'CELPE',ko:'TOPIK',zh:'HSK',ar:'ALPT',ru:'TORFL',hi:'HPT',tr:'TYS'};
  return m[c]||'CEFR';
}
// ── Localized session content packs ───────────────────────────
const SESSION_CONTENT = {
  en: {
    reading: {
      title: 'Sleep & Memory — Academic Reading Passage 2',
      passage: `Sleep and memory have a complex, bidirectional relationship that researchers have only begun to fully understand in recent decades. During sleep, the brain does not simply rest — it actively processes and consolidates the information gathered during waking hours, transferring memories from short-term storage in the hippocampus to long-term storage in the cortex.\n\nA landmark 2003 study by Walker et al. demonstrated that students who learned a complex motor task and then slept showed a 20.5% improvement in performance the following day, compared to those who remained awake. This finding was replicated across verbal learning tasks, suggesting that sleep plays a domain-general role in memory consolidation rather than a task-specific one.\n\nThe precise mechanism appears to involve slow-wave sleep (SWS) and rapid eye movement (REM) sleep in different but complementary ways. SWS, characterised by large, slow brain oscillations, seems particularly important for declarative memory — facts and events. REM sleep, by contrast, appears critical for procedural and emotional memories.`,
      passageLabel: 'Passage',
      qLabel: 'Questions 1–5',
      questions: [
        { n:1, type:'True/False/NG', stem:'The researcher claims that sleep deprivation directly causes memory loss.', options:['True','False','Not Given'] },
        { n:2, type:'Multiple Choice', stem:'According to the passage, which factor most significantly affects cognitive performance?', options:['Duration of sleep','Quality of sleep','Time of sleep onset','Sleep environment'] },
        { n:3, type:'True/False/NG', stem:'Students who studied before sleeping retained more information than those who studied in the morning.', options:['True','False','Not Given'] },
        { n:4, type:'Gap Fill', stem:'The study found that ________ hours of sleep was optimal for memory consolidation.', options:null },
        { n:5, type:'Multiple Choice', stem:'The word "consolidation" in paragraph 3 is closest in meaning to:', options:['strengthening','reduction','transfer','activation'] },
      ],
      typeLabel: t => t,
      placeholder: 'Type your answer…',
      submit: 'Submit & get feedback',
    },
    listening: {
      title: 'Section 2 — Museum Audio Guide',
      cardTitle: 'Section 2 — Museum Guide',
      audioLabel: 'Audio',
      qLabel: 'Questions 1–5',
      notesTitle: 'Your notes',
      notesPlaceholder: 'Take notes as you listen…',
      questions: [
        { n:1, stem:'What is the name of the museum the speaker recommends?', options:['Natural History Museum','Science Museum','Victoria & Albert Museum','British Museum'] },
        { n:2, stem:'What time does the special exhibition open on Sundays?', options:['9:00 AM','10:00 AM','11:00 AM','12:00 PM'] },
        { n:3, stem:'How much is the student discount?', options:['£2','£3','£5','£8'] },
        { n:4, stem:'The tour guide suggests visitors should book ________ in advance.', options:null },
        { n:5, stem:'What does the speaker say about the café?', options:['It is expensive','It offers a student menu','It closes at 4 PM','It requires a reservation'] },
      ],
      placeholder: 'Write your answer…',
      submit: 'Submit answers',
    },
    speaking: {
      examiner: 'AI Examiner',
      sectionsLabel: 'Sections',
      questionLabel: 'Question',
      prepHint: 'Take a moment to prepare your answer, then press Record.',
      startRec: 'Start recording', recording: 'Recording…', stop: 'Stop & submit',
      feedbackTitle: 'AI Feedback',
      feedbackBody: 'Good fluency and natural pacing. You used a good range of vocabulary ("invaluable," "mutual"). Consider adding a personal example to make Part 3 answers more vivid — examiners respond well to specific stories.',
      next: 'Next part', finish: 'Finish session',
      parts: [
        { n:1, label:'Part 1 — Introduction', desc:'Answer questions about familiar topics.', prompt:'Tell me about your hometown. What do you like most about it?' },
        { n:2, label:'Part 2 — Long Turn', desc:'Speak for 1–2 minutes on the cue card.', prompt:'Describe a time when you helped someone. You should say:\n• who you helped\n• what the situation was\n• how you helped them\nAnd explain how you felt afterwards.' },
        { n:3, label:'Part 3 — Discussion', desc:'Discuss abstract topics with the AI examiner.', prompt:'Do you think people today are less willing to help strangers than in the past? Why or why not?' },
      ],
      scoreLabels: { f:'Fluency', v:'Vocabulary', g:'Grammar', p:'Pronunciation', soFar:'Your score so far' },
    },
    writing: {
      task1Title: 'Task 1 — Graph Description',
      task2Title: 'Task 2 — Opinion Essay',
      task1Meta: 'Task 1 · Minimum 150 words · 20 min',
      task2Meta: 'Task 2 · Minimum 250 words · 40 min',
      task1Prompt: 'The graph below shows the number of international students studying in the UK between 2005 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
      task2Intro: 'You should spend about 40 minutes on this task.',
      task2Topic: 'Some people believe that technology has made it harder for people to maintain meaningful relationships. To what extent do you agree or disagree?',
      task2Outro: 'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
      tipsLabel: 'Band 7+ tips',
      task1Tips: ['Identify the overall trend first.','Include specific data points with numbers.','Compare and contrast different periods.','Avoid giving opinions — only describe.'],
      task2Tips: ['State your position clearly in the intro.','Use one main idea per body paragraph.','Include specific examples to support claims.','Write a clear conclusion restating your view.'],
      chartLabel: 'Bar chart — UK International Students (thousands)',
    },
  },
  es: {
    reading: {
      title: 'El sueño y la memoria — Lectura B2 Texto 2',
      passage: `El sueño y la memoria mantienen una relación compleja y bidireccional que los investigadores han comenzado a comprender plenamente solo en las últimas décadas. Durante el sueño, el cerebro no simplemente descansa — procesa y consolida activamente la información recogida durante las horas de vigilia, transfiriendo recuerdos desde el almacenamiento a corto plazo en el hipocampo hacia el almacenamiento a largo plazo en la corteza.\n\nUn estudio de referencia de 2003 realizado por Walker et al. demostró que los estudiantes que aprendían una tarea motora compleja y luego dormían mostraban una mejora del 20,5% en el rendimiento al día siguiente, en comparación con quienes permanecían despiertos. Este hallazgo se replicó en tareas de aprendizaje verbal, lo que sugiere que el sueño desempeña un papel general en la consolidación de la memoria.\n\nEl mecanismo preciso parece involucrar el sueño de ondas lentas (SWS) y el sueño REM de maneras diferentes pero complementarias. El SWS, caracterizado por oscilaciones cerebrales lentas y amplias, parece especialmente importante para la memoria declarativa — hechos y eventos.`,
      passageLabel: 'Texto',
      qLabel: 'Preguntas 1–5',
      questions: [
        { n:1, type:'Verdadero/Falso/NS', stem:'El investigador afirma que la privación del sueño causa directamente la pérdida de memoria.', options:['Verdadero','Falso','No se sabe'] },
        { n:2, type:'Opción múltiple', stem:'Según el texto, ¿qué factor afecta más significativamente al rendimiento cognitivo?', options:['Duración del sueño','Calidad del sueño','Hora de inicio del sueño','Entorno del sueño'] },
        { n:3, type:'Verdadero/Falso/NS', stem:'Los estudiantes que estudiaron antes de dormir retuvieron más información que los que estudiaron por la mañana.', options:['Verdadero','Falso','No se sabe'] },
        { n:4, type:'Rellenar el hueco', stem:'El estudio descubrió que ________ horas de sueño eran óptimas para la consolidación de la memoria.', options:null },
        { n:5, type:'Opción múltiple', stem:'La palabra "consolidación" en el párrafo 3 significa principalmente:', options:['fortalecimiento','reducción','transferencia','activación'] },
      ],
      placeholder: 'Escribe tu respuesta…',
      submit: 'Enviar y recibir comentarios',
    },
    listening: {
      title: 'Sección 2 — Audioguía del museo',
      cardTitle: 'Sección 2 — Guía del museo',
      audioLabel: 'Audio',
      qLabel: 'Preguntas 1–5',
      notesTitle: 'Tus notas',
      notesPlaceholder: 'Toma notas mientras escuchas…',
      questions: [
        { n:1, stem:'¿Cómo se llama el museo que recomienda el hablante?', options:['Museo del Prado','Museo Reina Sofía','Museo Thyssen','Museo Arqueológico'] },
        { n:2, stem:'¿A qué hora abre la exposición especial los domingos?', options:['9:00','10:00','11:00','12:00'] },
        { n:3, stem:'¿Cuánto cuesta el descuento para estudiantes?', options:['2€','3€','5€','8€'] },
        { n:4, stem:'El guía sugiere que los visitantes reserven ________ con antelación.', options:null },
        { n:5, stem:'¿Qué dice el hablante sobre la cafetería?', options:['Es cara','Tiene menú estudiantil','Cierra a las 16:00','Requiere reserva'] },
      ],
      placeholder: 'Escribe tu respuesta…',
      submit: 'Enviar respuestas',
    },
    speaking: {
      examiner: 'Examinador IA',
      sectionsLabel: 'Secciones',
      questionLabel: 'Pregunta',
      prepHint: 'Tómate un momento para preparar tu respuesta, luego pulsa Grabar.',
      startRec: 'Empezar a grabar', recording: 'Grabando…', stop: 'Detener y enviar',
      feedbackTitle: 'Comentarios de la IA',
      feedbackBody: 'Buena fluidez y ritmo natural. Usaste un buen rango de vocabulario ("imprescindible", "mutuo"). Considera añadir un ejemplo personal para hacer las respuestas de la Parte 3 más vívidas.',
      next: 'Siguiente parte', finish: 'Terminar sesión',
      parts: [
        { n:1, label:'Parte 1 — Presentación', desc:'Responde preguntas sobre temas familiares.', prompt:'Háblame de tu ciudad natal. ¿Qué es lo que más te gusta de ella?' },
        { n:2, label:'Parte 2 — Monólogo', desc:'Habla durante 1–2 minutos sobre la tarjeta.', prompt:'Describe una vez que ayudaste a alguien. Deberías decir:\n• a quién ayudaste\n• cuál era la situación\n• cómo lo ayudaste\nY explica cómo te sentiste después.' },
        { n:3, label:'Parte 3 — Debate', desc:'Discute temas abstractos con el examinador.', prompt:'¿Crees que la gente hoy en día está menos dispuesta a ayudar a desconocidos que en el pasado? ¿Por qué?' },
      ],
      scoreLabels: { f:'Fluidez', v:'Vocabulario', g:'Gramática', p:'Pronunciación', soFar:'Tu puntuación hasta ahora' },
    },
    writing: {
      task1Title: 'Tarea 1 — Descripción de gráfico',
      task2Title: 'Tarea 2 — Ensayo de opinión',
      task1Meta: 'Tarea 1 · Mínimo 150 palabras · 20 min',
      task2Meta: 'Tarea 2 · Mínimo 250 palabras · 40 min',
      task1Prompt: 'El gráfico siguiente muestra el número de estudiantes internacionales en España entre 2005 y 2020.\n\nResume la información seleccionando e informando sobre las características principales, y haz comparaciones cuando sea relevante.',
      task2Intro: 'Deberías dedicar unos 40 minutos a esta tarea.',
      task2Topic: 'Algunas personas creen que la tecnología ha hecho más difícil mantener relaciones significativas. ¿Hasta qué punto estás de acuerdo o en desacuerdo?',
      task2Outro: 'Justifica tu respuesta e incluye ejemplos relevantes de tu experiencia. Escribe al menos 250 palabras.',
      tipsLabel: 'Consejos para apto+',
      task1Tips: ['Identifica primero la tendencia general.','Incluye datos específicos con números.','Compara y contrasta diferentes períodos.','Evita opiniones — solo describe.'],
      task2Tips: ['Establece tu postura claramente en la introducción.','Una idea principal por cada párrafo.','Incluye ejemplos específicos.','Escribe una conclusión clara reafirmando tu postura.'],
      chartLabel: 'Gráfico — Estudiantes internacionales en España (miles)',
    },
  },
  ja: {
    reading: {
      title: '睡眠と記憶 — N4読解 第2課題',
      passage: `睡眠と記憶には、研究者が近年ようやく完全に理解し始めた、複雑で双方向の関係があります。睡眠中、脳は単に休んでいるのではなく、起きている間に集めた情報を積極的に処理し、定着させています。短期記憶を司る海馬から、長期記憶を司る大脳皮質へと記憶を移しているのです。\n\n2003年のウォーカーらによる画期的な研究では、複雑な運動課題を学習してから眠った学生は、眠らなかった学生に比べて翌日のパフォーマンスが20.5%向上したことが示されました。この結果は言語学習の課題でも再現され、睡眠は記憶の定着に一般的な役割を果たしていることが示唆されています。\n\n具体的なメカニズムは、徐波睡眠(SWS)とレム睡眠が異なるが補完的な形で関わっているようです。SWSは、大きく遅い脳波が特徴で、特に事実や出来事といった宣言的記憶にとって重要だと考えられています。`,
      passageLabel: '本文',
      qLabel: '問題 1–5',
      questions: [
        { n:1, type:'正誤判断', stem:'研究者は睡眠不足が直接記憶喪失を引き起こすと主張している。', options:['正しい','間違い','本文にない'] },
        { n:2, type:'選択問題', stem:'本文によれば、認知能力に最も影響を与える要素はどれか。', options:['睡眠時間','睡眠の質','寝始める時間','睡眠環境'] },
        { n:3, type:'正誤判断', stem:'寝る前に勉強した学生は、朝勉強した学生より多く覚えた。', options:['正しい','間違い','本文にない'] },
        { n:4, type:'空欄補充', stem:'研究では、________時間の睡眠が記憶定着に最適であると分かった。', options:null },
        { n:5, type:'選択問題', stem:'第3段落の「定着」に最も近い意味はどれか。', options:['強化','減少','移動','活性化'] },
      ],
      placeholder: '答えを入力してください…',
      submit: '提出してフィードバックを受ける',
    },
    listening: {
      title: 'セクション2 — 美術館の音声ガイド',
      cardTitle: 'セクション2 — 美術館ガイド',
      audioLabel: '音声',
      qLabel: '問題 1–5',
      notesTitle: 'メモ',
      notesPlaceholder: '聞きながらメモを取ってください…',
      questions: [
        { n:1, stem:'話し手が薦めている美術館はどれですか。', options:['国立科学博物館','東京国立博物館','森美術館','江戸東京博物館'] },
        { n:2, stem:'特別展は日曜日の何時に開きますか。', options:['9時','10時','11時','12時'] },
        { n:3, stem:'学生割引はいくらですか。', options:['200円','300円','500円','800円'] },
        { n:4, stem:'ガイドは訪問者に________に予約することを勧めている。', options:null },
        { n:5, stem:'話し手はカフェについて何と言っていますか。', options:['高い','学生メニューがある','16時に閉まる','予約が必要'] },
      ],
      placeholder: '答えを書いてください…',
      submit: '答えを提出',
    },
    speaking: {
      examiner: 'AI試験官',
      sectionsLabel: 'セクション',
      questionLabel: '質問',
      prepHint: '少し準備してから録音ボタンを押してください。',
      startRec: '録音開始', recording: '録音中…', stop: '停止して提出',
      feedbackTitle: 'AIフィードバック',
      feedbackBody: '流暢さと自然なペースが良かったです。語彙の幅も適切で、「貴重」「相互」など良い表現を使えていました。第3部では具体例を加えるとより印象的な答えになります。',
      next: '次のパート', finish: 'セッション終了',
      parts: [
        { n:1, label:'パート1 — 自己紹介', desc:'身近な話題について答えてください。', prompt:'あなたの故郷について教えてください。一番好きなところは何ですか。' },
        { n:2, label:'パート2 — スピーチ', desc:'カードの内容について1〜2分話してください。', prompt:'誰かを助けた時のことを話してください:\n• 誰を助けたか\n• どんな状況だったか\n• どう助けたか\nそしてその後どう感じたかを説明してください。' },
        { n:3, label:'パート3 — ディスカッション', desc:'抽象的な話題を試験官と議論します。', prompt:'今日の人々は昔より知らない人を助けたがらないと思いますか。なぜですか。' },
      ],
      scoreLabels: { f:'流暢さ', v:'語彙', g:'文法', p:'発音', soFar:'これまでの点数' },
    },
    writing: {
      task1Title: '課題1 — グラフ説明',
      task2Title: '課題2 — 意見作文',
      task1Meta: '課題1 · 最低150字 · 20分',
      task2Meta: '課題2 · 最低250字 · 40分',
      task1Prompt: '下のグラフは2005年から2020年の日本における留学生数を示しています。\n\n主な特徴を選んでまとめ、必要に応じて比較してください。',
      task2Intro: 'この課題には約40分かけてください。',
      task2Topic: 'テクノロジーが意味のある人間関係を維持することを難しくしたと考える人がいます。あなたはどの程度同意しますか。',
      task2Outro: '理由を述べ、自分の経験から関連する例を挙げてください。最低250字書いてください。',
      tipsLabel: '高得点のコツ',
      task1Tips: ['まず全体の傾向を示す。','具体的な数値を入れる。','異なる時期を比較する。','意見は書かず、描写のみ。'],
      task2Tips: ['導入で立場を明確に示す。','一段落につき一つの主張。','具体例を入れて主張を支える。','結論で立場を再確認する。'],
      chartLabel: 'グラフ — 日本の留学生数(千人)',
    },
  },
  fr: {
    reading: {
      title: 'Sommeil et mémoire — Compréhension écrite, texte 2',
      passage: `Le sommeil et la mémoire entretiennent une relation complexe et bidirectionnelle que les chercheurs n'ont commencé à pleinement comprendre que depuis quelques décennies. Pendant le sommeil, le cerveau ne se repose pas simplement — il traite et consolide activement les informations recueillies pendant les heures d'éveil, transférant les souvenirs du stockage à court terme dans l'hippocampe vers le stockage à long terme dans le cortex.\n\nUne étude de référence menée par Walker et ses collègues en 2003 a démontré que les étudiants qui apprenaient une tâche motrice complexe puis dormaient présentaient une amélioration de 20,5 % de leurs performances le lendemain, par rapport à ceux qui restaient éveillés. Ce résultat a été reproduit pour des tâches d'apprentissage verbal, suggérant que le sommeil joue un rôle général dans la consolidation de la mémoire.\n\nLe mécanisme précis semble impliquer le sommeil à ondes lentes (SOL) et le sommeil paradoxal de manières différentes mais complémentaires. Le SOL, caractérisé par de grandes oscillations cérébrales lentes, semble particulièrement important pour la mémoire déclarative — les faits et les événements.`,
      passageLabel: 'Texte',
      qLabel: 'Questions 1–5',
      questions: [
        { n:1, type:'Vrai/Faux/NM', stem:'Le chercheur affirme que le manque de sommeil cause directement la perte de mémoire.', options:['Vrai','Faux','Non mentionné'] },
        { n:2, type:'Choix multiple', stem:'Selon le texte, quel facteur affecte le plus les performances cognitives ?', options:['Durée du sommeil','Qualité du sommeil','Heure de l\'endormissement','Environnement de sommeil'] },
        { n:3, type:'Vrai/Faux/NM', stem:'Les étudiants qui ont étudié avant de dormir ont retenu plus que ceux qui ont étudié le matin.', options:['Vrai','Faux','Non mentionné'] },
        { n:4, type:'Texte à trous', stem:'L\'étude a montré que ________ heures de sommeil étaient optimales pour la consolidation de la mémoire.', options:null },
        { n:5, type:'Choix multiple', stem:'Le mot « consolidation » au paragraphe 3 signifie principalement :', options:['renforcement','réduction','transfert','activation'] },
      ],
      placeholder: 'Tapez votre réponse…',
      submit: 'Soumettre et recevoir des commentaires',
    },
    listening: {
      title: 'Section 2 — Audioguide du musée',
      cardTitle: 'Section 2 — Guide du musée',
      audioLabel: 'Audio',
      qLabel: 'Questions 1–5',
      notesTitle: 'Vos notes',
      notesPlaceholder: 'Prenez des notes pendant l\'écoute…',
      questions: [
        { n:1, stem:'Quel est le nom du musée que recommande l\'intervenant ?', options:['Musée du Louvre','Musée d\'Orsay','Centre Pompidou','Musée Rodin'] },
        { n:2, stem:'À quelle heure ouvre l\'exposition spéciale le dimanche ?', options:['9h','10h','11h','12h'] },
        { n:3, stem:'Combien coûte la réduction étudiante ?', options:['2€','3€','5€','8€'] },
        { n:4, stem:'Le guide suggère aux visiteurs de réserver ________ à l\'avance.', options:null },
        { n:5, stem:'Que dit l\'intervenant à propos du café ?', options:['Il est cher','Il propose un menu étudiant','Il ferme à 16h','Il faut réserver'] },
      ],
      placeholder: 'Écrivez votre réponse…',
      submit: 'Soumettre les réponses',
    },
    speaking: {
      examiner: 'Examinateur IA',
      sectionsLabel: 'Sections',
      questionLabel: 'Question',
      prepHint: 'Prenez un moment pour préparer votre réponse, puis appuyez sur Enregistrer.',
      startRec: 'Démarrer l\'enregistrement', recording: 'Enregistrement…', stop: 'Arrêter et soumettre',
      feedbackTitle: 'Commentaires IA',
      feedbackBody: 'Bonne fluidité et rythme naturel. Vous avez utilisé une bonne gamme de vocabulaire (« inestimable », « mutuel »). Pensez à ajouter un exemple personnel pour rendre les réponses de la partie 3 plus vivantes.',
      next: 'Partie suivante', finish: 'Terminer la session',
      parts: [
        { n:1, label:'Partie 1 — Présentation', desc:'Répondez à des questions sur des sujets familiers.', prompt:'Parlez-moi de votre ville natale. Qu\'est-ce que vous y aimez le plus ?' },
        { n:2, label:'Partie 2 — Monologue', desc:'Parlez 1 à 2 minutes sur le sujet.', prompt:'Décrivez une fois où vous avez aidé quelqu\'un. Vous devriez dire :\n• qui vous avez aidé\n• quelle était la situation\n• comment vous l\'avez aidé\nEt expliquez ce que vous avez ressenti ensuite.' },
        { n:3, label:'Partie 3 — Discussion', desc:'Discutez de sujets abstraits avec l\'examinateur.', prompt:'Pensez-vous que les gens d\'aujourd\'hui sont moins prêts à aider des inconnus qu\'autrefois ? Pourquoi ?' },
      ],
      scoreLabels: { f:'Fluidité', v:'Vocabulaire', g:'Grammaire', p:'Prononciation', soFar:'Votre score actuel' },
    },
    writing: {
      task1Title: 'Tâche 1 — Description de graphique',
      task2Title: 'Tâche 2 — Essai d\'opinion',
      task1Meta: 'Tâche 1 · Minimum 150 mots · 20 min',
      task2Meta: 'Tâche 2 · Minimum 250 mots · 40 min',
      task1Prompt: 'Le graphique ci-dessous montre le nombre d\'étudiants internationaux en France entre 2005 et 2020.\n\nRésumez les informations en sélectionnant les caractéristiques principales et faites des comparaisons pertinentes.',
      task2Intro: 'Vous devriez consacrer environ 40 minutes à cette tâche.',
      task2Topic: 'Certains pensent que la technologie a rendu plus difficile le maintien de relations significatives. Dans quelle mesure êtes-vous d\'accord ou en désaccord ?',
      task2Outro: 'Justifiez votre réponse et incluez des exemples pertinents tirés de votre expérience. Écrivez au moins 250 mots.',
      tipsLabel: 'Conseils pour bien noter',
      task1Tips: ['Identifiez d\'abord la tendance générale.','Incluez des données chiffrées précises.','Comparez différentes périodes.','Évitez de donner des opinions — décrivez seulement.'],
      task2Tips: ['Énoncez clairement votre position en intro.','Une idée principale par paragraphe.','Incluez des exemples concrets.','Concluez en réaffirmant votre position.'],
      chartLabel: 'Graphique — Étudiants internationaux en France (milliers)',
    },
  },
};
function _sc(skill){
  const c=window.__langCode||'en';
  if (SESSION_CONTENT[c]) return SESSION_CONTENT[c][skill];
  // For any language without curated content, return English content but with titles relabelled to the right exam.
  const en = SESSION_CONTENT.en[skill] || {};
  const prefix = _modPrefix();
  return { ...en, title: (en.title || '').replace(/IELTS|DELE|JLPT|DELF/g, prefix) };
}
function _modLabel(skill){
  const c=window.__langCode||'en';
  const M={
    en:{Reading:'Reading',Listening:'Listening',Speaking:'Speaking',Writing:'Writing'},
    es:{Reading:'Comprensión de Lectura',Listening:'Comprensión Auditiva',Speaking:'Expresión Oral',Writing:'Expresión Escrita'},
    ja:{Reading:'読解',Listening:'聴解',Speaking:'会話',Writing:'作文'},
    fr:{Reading:'Compréhension écrite',Listening:'Compréhension orale',Speaking:'Production orale',Writing:'Production écrite'},
    de:{Reading:'Lesen',Listening:'Hören',Speaking:'Sprechen',Writing:'Schreiben'},
    it:{Reading:'Comprensione scritta',Listening:'Comprensione orale',Speaking:'Produzione orale',Writing:'Produzione scritta'},
    pt:{Reading:'Compreensão de leitura',Listening:'Compreensão oral',Speaking:'Expressão oral',Writing:'Produção escrita'},
    ko:{Reading:'읽기',Listening:'듣기',Speaking:'말하기',Writing:'쓰기'},
    zh:{Reading:'阅读',Listening:'听力',Speaking:'口语',Writing:'写作'},
    ar:{Reading:'قراءة',Listening:'استماع',Speaking:'محادثة',Writing:'كتابة'},
    ru:{Reading:'Чтение',Listening:'Аудирование',Speaking:'Говорение',Writing:'Письмо'},
    hi:{Reading:'पठन',Listening:'सुनना',Speaking:'बोलना',Writing:'लेखन'},
    tr:{Reading:'Okuma',Listening:'Dinleme',Speaking:'Konuşma',Writing:'Yazma'},
  };
  return (M[c]||M.en)[skill]||skill;
}
// ── Shared session chrome ─────────────────────────────────────
function SessionHeader({ title, module, progress, timeLeft, onExit, color }) {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isWarning = timeLeft < 300;
  return (
    <div style={{ height:64, borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:16, padding:'0 28px', flexShrink:0, background:T.card }}>
      <button onClick={onExit} style={{ width:36, height:36, borderRadius:10, background:T.bg2, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, flexShrink:0 }}>
        {Icon.x({ width:14, height:14 })}
      </button>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:2 }}>{module}</div>
        <div style={{ fontSize:13.5, fontWeight:700, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
          <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase' }}>Progress</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:160, height:5, background:T.bg3, borderRadius:99, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${progress}%`, background:color, borderRadius:99, transition:'width .4s' }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:T.ink4 }}>{Math.round(progress)}%</span>
          </div>
        </div>
        <div style={{ padding:'7px 14px', borderRadius:10, background:isWarning?'#FEF2F2':'#F4F4F0', border:`1px solid ${isWarning?'#EF4444':'transparent'}` }}>
          <div style={{ fontSize:11, color:isWarning?'#EF4444':T.ink4, fontWeight:700, letterSpacing:'.05em', fontFamily:'monospace' }}>
            {String(mins).padStart(2,'0')}:{String(secs).padStart(2,'0')}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// READING SESSION
// ═══════════════════════════════════════════════════════════
function ReadingSession() {
  const [loading, setLoading]   = React.useState(true);
  const [data, setData]         = React.useState(null);
  const [contentId, setContentId] = React.useState(null);
  const [answered, setAnswered] = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [scorePct, setScorePct] = React.useState(0);
  const [err, setErr]           = React.useState('');
  const [tick, setTick]         = React.useState(0);
  const lang = window.__langCode || 'en';

  React.useEffect(function () {
    var cancelled = false;
    (async function () {
      try {
        var _diff = (window.__adaptiveDifficulty && window.__adaptiveDifficulty(lang, 'reading')) || _diffForLevel(_levelFor(lang));
        var lr = await fetch('/api/content-list?lang=' + encodeURIComponent(lang) + '&type=reading&full=1&limit=8&difficulty=' + _diff);
        var list = await lr.json();
        var item = (list.items && list.items.length) ? list.items[Math.floor(Math.random() * list.items.length)] : null;
        if (!item) {
          var gr = await fetch('/api/generate-content', {
            method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
            body: JSON.stringify({ lang: lang, type: 'reading', difficulty: _diff, exam: (typeof examFor === 'function' ? (examFor(lang).short || null) : null), focus: (window.__focusArea ? window.__focusArea(lang) : null), interests: (window.__interests ? window.__interests() : null) }),
          });
          var gen = await gr.json();
          if (gen.error) throw new Error(gen.error);
          item = gen.content;
        }
        if (cancelled) return;
        setData(item.payload); setContentId(item.id); setLoading(false);
      } catch (e) {
        if (!cancelled) { setErr('Could not load a reading: ' + (e.message || e)); setLoading(false); }
      }
    })();
    return function () { cancelled = true; };
  }, [tick]);

  function choose(qi, oi) {
    if (submitted) return;
    setAnswered(function (a) { var n = Object.assign({}, a); n[qi] = oi; return n; });
  }

  function submit() {
    var qs = (data && data.questions) || [];
    var correct = 0;
    qs.forEach(function (q, i) { if (answered[i] === q.answer) correct++; });
    var pct = qs.length ? Math.round((correct / qs.length) * 100) : 0;
    setScorePct(pct); setSubmitted(true);
    window.__lastReadingResult = { module: 'reading', lang: lang, scorePct: pct, correct: correct, total: qs.length };
    window.__lastResult = { module:'reading', lang:lang, kind:'count', correct:correct, total:qs.length, pct:pct };
    try {
      var token = window.__authToken ? window.__authToken() : null;
      if (token) {
        window.__saveResult({ lang: lang, content_id: contentId, score: pct, detail: { module: 'reading', correct: correct, total: qs.length, answered: answered, unit: '%', items: qs.map(function(q,i){ return { c: String((q && q.concept) || '').trim().slice(0,40).toLowerCase(), ok: answered[i] === q.answer }; }).filter(function(x){ return x.c; }) } });
      }
    } catch (e) {}
  }

  if (loading) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14, background:T.bg }}>
        <div style={{ display:'flex', gap:6 }}>{[0,1,2].map(function(i){ return <span key={i} style={{ width:9, height:9, borderRadius:5, background:T.reading.c, animation:'rdb 1s '+(i*0.15)+'s infinite' }}/>; })}</div>
        <div style={{ fontSize:14, color:T.ink3 }}>Preparing a {lang.toUpperCase()} reading\u2026</div>
        <style>{`@keyframes rdb{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }
  if (err || !data) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:T.bg }}>
        <div style={{ textAlign:'center', maxWidth:340 }}>
          <div style={{ width:54, height:54, borderRadius:27, background:T.reading.bg, color:T.reading.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26 }}>↻</div>
          <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:8 }}>We couldn't load this lesson</div>
          <div style={{ fontSize:13.5, color:T.ink4, lineHeight:1.6, marginBottom:22 }}>Something went wrong preparing your {lang.toUpperCase()} reading. Let's try again.</div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button onClick={function () { setErr(''); setLoading(true); setTick(function (t) { return t + 1; }); }} style={{ padding:'11px 22px', borderRadius:11, background:T.reading.c, color:'#fff', fontSize:13.5, fontWeight:700, border:'none', cursor:'pointer' }}>Try again</button>
            <button onClick={function () { window.__nav && window.__nav('dashboard'); }} style={{ padding:'11px 20px', borderRadius:11, background:'transparent', border:`1px solid ${T.border}`, color:T.ink2, fontSize:13.5, fontWeight:700, cursor:'pointer' }}>Back to dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  var questions = data.questions || [];
  var answeredCount = Object.keys(answered).length;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <SessionHeader title={data.title || _modLabel("Reading")} module={`${_modPrefix()} ${_modLabel("Reading")}`} progress={submitted ? 100 : Math.round((answeredCount/Math.max(1,questions.length))*100)} timeLeft={2180} color={T.reading.c} onExit={() => window.__nav && window.__nav('dashboard')}/>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden' }}>
        <div style={{ overflow:'auto', padding:'28px 32px', borderRight:`1px solid ${T.border}`, background:T.bg }}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:14 }}>Passage</div>
          <div style={{ fontSize:14.5, lineHeight:1.85, color:T.ink2, fontFamily:"Georgia,'DM Serif Display',serif", textWrap:'pretty' }}>
            {String(data.passage||'').split('\n\n').map(function(para,i){ return <p key={i} style={{ marginBottom:20 }}>{para}</p>; })}
          </div>
        </div>
        <div style={{ overflow:'auto', padding:'28px 32px', background:T.card }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>Questions</div>
            <Chip label={`${answeredCount}/${questions.length}`} accent={T.reading.c} bg={T.reading.bg} style={{ fontSize:10 }}/>
          </div>
          {submitted && (
            <div style={{ marginBottom:18, padding:16, borderRadius:14, background:T.reading.bg, border:`1px solid ${T.reading.c}44`, textAlign:'center' }}>
              <div style={{ fontSize:30, fontWeight:800, color:T.reading.c }}>{scorePct}%</div>
              <div style={{ fontSize:12.5, color:T.ink2 }}>Graded automatically \u00b7 {questions.filter(function(q,i){return answered[i]===q.answer;}).length}/{questions.length} correct</div>
            </div>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            {questions.map(function(q, qi){
              return (
                <div key={qi} style={{ padding:18, borderRadius:14, border:`1px solid ${answered[qi]!==undefined ? '#16a34a44' : T.border}`, background:answered[qi]!==undefined?'#16a34a14':T.card }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:12 }}>
                    <div style={{ width:24, height:24, borderRadius:12, background:answered[qi]!==undefined?'#16a34a':T.bg3, color:answered[qi]!==undefined?'#fff':T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, flexShrink:0 }}>{qi+1}</div>
                    <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.5 }}>{q.q}</div>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:7, paddingLeft:34 }}>
                    {(q.options||[]).map(function(opt, oi){
                      var chosen = answered[qi] === oi;
                      var isCorrect = submitted && oi === q.answer;
                      var isWrong = submitted && chosen && oi !== q.answer;
                      var border = isCorrect ? '#16a34a' : isWrong ? '#dc2626' : chosen ? '#16a34a' : T.border;
                      var bg = isCorrect ? '#16a34a18' : isWrong ? '#dc262618' : chosen ? '#16a34a18' : 'transparent';
                      return (
                        <button key={oi} onClick={function(){ choose(qi, oi); }}
                          style={{ padding:'9px 14px', borderRadius:9, border:`1.5px solid ${border}`, background:bg, fontSize:13, fontWeight:chosen?700:400, color:T.ink, textAlign:'left', cursor:submitted?'default':'pointer' }}>
                          {opt}{isCorrect ? '  \u2713' : ''}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:24 }}>
            {!submitted
              ? <Btn label="Submit & grade" accent={T.reading.c} fullWidth size="lg" iconRight={Icon.arrow({ width:13, height:13 })} onClick={submit}/>
              : <Btn label={window.__exam && window.__exam.active ? "Finish section →" : "See full results"} accent={T.reading.c} fullWidth size="lg" iconRight={Icon.arrow({ width:13, height:13 })} onClick={() => { if (window.__exam && window.__exam.active) { window.dispatchEvent(new CustomEvent('fl-exam-section-done', { detail: { module:'reading', score: scorePct } })); } else { window.__nav && window.__nav('mod_results'); } }}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// LISTENING SESSION
// ═══════════════════════════════════════════════════════════
function ListeningSession() {
  const lang = window.__langCode || 'en';
  const _l = _sc('listening');
  const [loading, setLoading]     = React.useState(true);
  const [data, setData]           = React.useState(null);   // { title, passage, questions }
  const [contentId, setContentId] = React.useState(null);
  const [playing, setPlaying]     = React.useState(false);
  const [started, setStarted]     = React.useState(false);
  const [answered, setAnswered]   = React.useState({});
  const [submitted, setSubmitted] = React.useState(false);
  const [scorePct, setScorePct]   = React.useState(0);
  const [err, setErr]             = React.useState('');
  const [tick, setTick]           = React.useState(0);

  // BCP-47 voice hint for the speech synthesizer
  const VOICE = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-PT', nl:'nl-NL', ru:'ru-RU', pl:'pl-PL', uk:'uk-UA', sv:'sv-SE', no:'nb-NO', da:'da-DK', fi:'fi-FI', el:'el-GR', cs:'cs-CZ', ro:'ro-RO', hu:'hu-HU', tr:'tr-TR', ar:'ar-SA', hi:'hi-IN', zh:'zh-CN', ja:'ja-JP', ko:'ko-KR', id:'id-ID', vi:'vi-VN' };

  React.useEffect(function () {
    var cancelled = false;
    (async function () {
      try {
        var _diff = (window.__adaptiveDifficulty && window.__adaptiveDifficulty(lang, 'listening')) || _diffForLevel(_levelFor(lang));
        var lr = await fetch('/api/content-list?lang=' + encodeURIComponent(lang) + '&type=listening&full=1&limit=8&difficulty=' + _diff);
        var list = await lr.json();
        var item = (list.items && list.items.length) ? list.items[Math.floor(Math.random() * list.items.length)] : null;
        if (!item) {
          var gr = await fetch('/api/generate-content', {
            method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, window.__authHeaders ? window.__authHeaders() : {}),
            body: JSON.stringify({ lang: lang, type: 'listening', difficulty: _diff, exam: (typeof examFor === 'function' ? (examFor(lang).short || null) : null), focus: (window.__focusArea ? window.__focusArea(lang) : null), interests: (window.__interests ? window.__interests() : null) }),
          });
          var gen = await gr.json();
          if (gen.error) throw new Error(gen.error);
          item = gen.content;
        }
        if (cancelled) return;
        setData(item.payload); setContentId(item.id); setLoading(false);
      } catch (e) {
        if (!cancelled) { setErr('Could not load a listening clip: ' + (e.message || e)); setLoading(false); }
      }
    })();
    return function () { cancelled = true; try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} };
  }, [tick]);

  function speak() {
    if (!data || !data.passage || !window.speechSynthesis) { setErr('Audio playback is not supported in this browser.'); return; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(data.passage);
      u.lang = VOICE[lang] || lang;
      u.rate = 0.95;
      u.onend = function () { setPlaying(false); };
      u.onerror = function () { setPlaying(false); };
      window.speechSynthesis.speak(u);
      setPlaying(true); setStarted(true);
    } catch (e) { setErr('Audio playback is not supported in this browser.'); }
  }
  function toggle() {
    if (!window.speechSynthesis) { setErr('Audio playback is not supported in this browser.'); return; }
    if (!started) { speak(); return; }
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) { window.speechSynthesis.pause(); setPlaying(false); }
    else if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); setPlaying(true); }
    else { speak(); }
  }

  function choose(qi, val) { if (submitted) return; setAnswered(function (a) { var n = Object.assign({}, a); n[qi] = val; return n; }); }
  function submit() {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    var qs = (data && data.questions) || [];
    var correct = 0;
    qs.forEach(function (q, i) { if (q.answer != null && answered[i] === q.answer) correct++; });
    var pct = qs.length ? Math.round((correct / qs.length) * 100) : 0;
    setScorePct(pct); setSubmitted(true);
    window.__lastReadingResult = { module: 'listening', lang: lang, scorePct: pct, correct: correct, total: qs.length };
    window.__lastResult = { module:'listening', lang:lang, kind:'count', correct:correct, total:qs.length, pct:pct };
    try {
      var token = window.__authToken ? window.__authToken() : null;
      if (token) {
        window.__saveResult({ lang: lang, content_id: contentId, score: pct, detail: { module:'listening', correct: correct, total: qs.length, unit: '%', items: qs.map(function(q,i){ return { c: String((q && q.concept) || '').trim().slice(0,40).toLowerCase(), ok: answered[i] === q.answer }; }).filter(function(x){ return x.c; }) } });
      }
    } catch (e) {}
    if (window.__exam && window.__exam.active) {
      setTimeout(function () { window.dispatchEvent(new CustomEvent('fl-exam-section-done', { detail: { module:'listening', score: pct } })); }, 700);
    } else {
      setTimeout(function () { window.__nav && window.__nav('mod_results'); }, 700);
    }
  }

  if (loading) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:14, background:T.bg }}>
        <div style={{ display:'flex', gap:6 }}>{[0,1,2].map(function(i){ return <span key={i} style={{ width:9, height:9, borderRadius:5, background:T.listening.c, animation:'rdb 1s '+(i*0.15)+'s infinite' }}/>; })}</div>
        <div style={{ fontSize:14, color:T.ink3 }}>Preparing a {lang.toUpperCase()} listening clip…</div>
        <style>{`@keyframes rdb{0%,80%,100%{transform:scale(.6);opacity:.4}40%{transform:scale(1);opacity:1}}`}</style>
      </div>
    );
  }
  if (err || !data) {
    return (
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:40, background:T.bg }}>
        <div style={{ textAlign:'center', maxWidth:340 }}>
          <div style={{ width:54, height:54, borderRadius:27, background:T.listening.bg, color:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:26 }}>↻</div>
          <div style={{ fontFamily:T.serif, fontSize:20, color:T.ink, marginBottom:8 }}>We couldn't load this lesson</div>
          <div style={{ fontSize:13.5, color:T.ink4, lineHeight:1.6, marginBottom:22 }}>Something went wrong preparing your {lang.toUpperCase()} listening clip. Let's try again.</div>
          <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
            <button onClick={function () { setErr(''); setLoading(true); setTick(function (t) { return t + 1; }); }} style={{ padding:'11px 22px', borderRadius:11, background:T.listening.c, color:'#fff', fontSize:13.5, fontWeight:700, border:'none', cursor:'pointer' }}>Try again</button>
            <button onClick={function () { window.__nav && window.__nav('dashboard'); }} style={{ padding:'11px 20px', borderRadius:11, background:'transparent', border:`1px solid ${T.border}`, color:T.ink2, fontSize:13.5, fontWeight:700, cursor:'pointer' }}>Back to dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  var questions = data.questions || [];

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <SessionHeader title={_l.title} module={`${_modPrefix()} ${_modLabel("Listening")}`} progress={40} timeLeft={1640} color={T.listening.c} onExit={() => { try{window.speechSynthesis&&window.speechSynthesis.cancel();}catch(e){} window.__nav && window.__nav('dashboard'); }}/>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden' }}>
        {/* Audio player */}
        <div style={{ overflow:'auto', padding:'28px 32px', borderRight:`1px solid ${T.border}`, background:T.bg, display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>{_l.audioLabel}</div>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:18, padding:24 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20 }}>
              <div style={{ width:52, height:52, borderRadius:14, background:T.listening.bg, color:T.listening.c, display:'flex', alignItems:'center', justifyContent:'center' }}>
                {Icon.head({ width:22, height:22 })}
              </div>
              <div>
                <div style={{ fontSize:15, fontWeight:700, color:T.ink }}>{data.title || _l.cardTitle}</div>
                <div style={{ fontSize:12, color:T.ink4, marginTop:2 }}>Spoken in {lang.toUpperCase()} · listen and answer</div>
              </div>
            </div>
            <div style={{ height:52, display:'flex', alignItems:'center', gap:1.5, marginBottom:14, overflow:'hidden' }}>
              {Array.from({length:80}).map((_,i) => {
                const h = 20 + Math.abs(Math.sin(i*0.7+1)*Math.cos(i*0.4)*28);
                return <div key={i} style={{ width:4, borderRadius:2, height:h, background: playing ? T.listening.c : T.bg3, flexShrink:0, transition:'background .2s' }}/>;
              })}
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:16 }}>
              <button onClick={speak} title="Restart" style={{ width:36, height:36, borderRadius:18, background:T.bg2, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.ink2, cursor:'pointer' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
              </button>
              <button onClick={toggle} style={{ width:52, height:52, borderRadius:26, background:T.listening.c, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 6px 16px ${T.listening.c}44`, cursor:'pointer' }}>
                {playing ? Icon.pause({ width:18, height:18 }) : Icon.play({ width:18, height:18 })}
              </button>
              <div style={{ width:36 }}/>
            </div>
            <div style={{ marginTop:14, fontSize:11, color:T.ink4, textAlign:'center' }}>
              {playing ? 'Playing…' : started ? 'Paused — tap play to resume' : 'Tap play to hear the clip'}
            </div>
          </div>
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:18, flex:1 }}>
            <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:10 }}>{_l.notesTitle}</div>
            <textarea placeholder={_l.notesPlaceholder} style={{ width:'100%', minHeight:160, border:'none', outline:'none', resize:'none', fontSize:13, color:T.ink2, fontFamily:"'Inter',sans-serif", lineHeight:1.6, background:'transparent' }}/>
          </div>
        </div>
        {/* Questions */}
        <div style={{ overflow:'auto', padding:'28px 32px', background:T.card }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>{_l.qLabel}</div>
            <Chip label={`${Object.keys(answered).length}/${questions.length}`} accent={T.listening.c} bg={T.listening.bg} style={{ fontSize:10 }}/>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {questions.map((q, qi) => {
              const isAns = answered[qi] != null;
              const opts = q.options || [];
              return (
                <div key={qi} style={{ padding:16, borderRadius:14, border:`1px solid ${isAns?T.listening.c+'44':T.border}`, background:isAns?T.listening.bg:T.bg }}>
                  <div style={{ display:'flex', gap:10, marginBottom:10 }}>
                    <div style={{ width:22, height:22, borderRadius:11, background:isAns?T.listening.c:T.bg3, color:isAns?'#fff':T.ink4, display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, flexShrink:0 }}>{qi+1}</div>
                    <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{q.stem || q.q}</div>
                  </div>
                  {opts.length ? (
                    <div style={{ display:'flex', flexDirection:'column', gap:6, paddingLeft:32 }}>
                      {opts.map((opt, oi) => {
                        const sel = answered[qi] === opt;
                        const showCorrect = submitted && q.answer === opt;
                        const showWrong = submitted && sel && q.answer !== opt;
                        return (
                          <button key={oi} onClick={() => choose(qi, opt)} disabled={submitted}
                            style={{ padding:'8px 12px', borderRadius:8, border:`1.5px solid ${showCorrect?'#2E7D32':showWrong?'#C62828':sel?T.listening.c:T.border}`, background:showCorrect?'rgba(46,125,50,.08)':showWrong?'rgba(198,40,40,.08)':sel?T.listening.bg:'transparent', fontSize:12.5, fontWeight:sel?700:400, color:showCorrect?'#2E7D32':showWrong?'#C62828':sel?T.listening.c:T.ink, textAlign:'left', cursor:submitted?'default':'pointer', transition:'all .15s' }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ paddingLeft:32 }}>
                      <input placeholder={_l.placeholder} disabled={submitted} onChange={(e) => choose(qi, e.target.value)}
                        style={{ width:'100%', padding:'9px 12px', borderRadius:8, border:`1.5px solid ${T.border}`, fontSize:13, color:T.ink, fontFamily:"'Inter',sans-serif", outline:'none' }}/>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ marginTop:20 }}>
            {submitted
              ? <div style={{ textAlign:'center', fontSize:14, fontWeight:700, color:T.listening.c }}>Score: {scorePct}% — opening results…</div>
              : <Btn label={_l.submit} onClick={submit} accent={T.listening.c} fullWidth size="lg" iconRight={Icon.arrow({ width:13, height:13 })}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SPEAKING SESSION
// ═══════════════════════════════════════════════════════════
function SpeakingSession() {
  const [phase, setPhase] = useState('prep'); // prep | recording | done
  const [partIdx, setPartIdx] = useState(1);
  const [gen, setGen] = useState(null);
  useEffect(function () {
    var lang = window.__langCode || 'en';
    if (SESSION_CONTENT[lang]) return; // curated languages are already in-language
    window.__flSpeakingGen = window.__flSpeakingGen || {};
    if (window.__flSpeakingGen[lang]) { setGen(window.__flSpeakingGen[lang]); return; }
    var alive = true;
    fetch('/api/generate-content', { method:'POST', headers:Object.assign({ 'Content-Type':'application/json' }, window.__authHeaders ? window.__authHeaders() : {}), body: JSON.stringify({ lang: lang, type:'speaking', difficulty: (window.__adaptiveDifficulty && window.__adaptiveDifficulty(lang, 'speaking')) || 'medium', exam: (typeof examFor === 'function' ? (examFor(lang).short || null) : null), focus: (window.__focusArea ? window.__focusArea(lang) : null), interests: (window.__interests ? window.__interests() : null) }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var p = d && d.content && d.content.payload;
        if (alive && p && p.parts && p.parts.length) { window.__flSpeakingGen[lang] = p; setGen(p); }
      })
      .catch(function () {});
    return function () { alive = false; };
  }, []);
  const _s = _sc('speaking');
  const parts = (gen && gen.parts && gen.parts.length) ? gen.parts : _s.parts;
  const part = parts[partIdx - 1] || parts[0] || _s.parts[0];

  const recRef = React.useRef(null);
  const chunksRef = React.useRef([]);
  const streamRef = React.useRef(null);
  const savedRef = React.useRef(false);
  const [evalResult, setEvalResult] = useState(null);
  const [evalErr, setEvalErr] = useState('');

  function _tok(){ return window.__authToken ? window.__authToken() : null; }
  function _stopTracks(){ if (streamRef.current){ streamRef.current.getTracks().forEach(function(t){ t.stop(); }); streamRef.current=null; } }

  // Free the mic on unmount/abandon: if the user navigates away mid-recording, stop the
  // recorder and release the stream so the browser's mic indicator turns off.
  React.useEffect(function () {
    return function () {
      try { if (recRef.current && recRef.current.state === 'recording') recRef.current.stop(); } catch (e) {}
      _stopTracks();
    };
  }, []);

  async function startRecording(){
    setEvalErr(''); setEvalResult(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined'){ setEvalErr('Recording is not supported in this browser.'); return; }
    try {
      var stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      streamRef.current = stream;
      var mr = new MediaRecorder(stream, _recorderOpts());
      chunksRef.current = [];
      mr.ondataavailable = function(e){ if (e.data && e.data.size) chunksRef.current.push(e.data); };
      mr.onstop = function(){ handleEvaluate(new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })); };
      recRef.current = mr; mr.start(); setPhase('recording');
      setTimeout(function(){ if (recRef.current && recRef.current.state === 'recording') recRef.current.stop(); }, 45000);
    } catch(e){ setEvalErr('Microphone access was blocked. Allow mic access in your browser and try again.'); setPhase('prep'); }
  }
  function stopRecording(){ if (recRef.current && recRef.current.state === 'recording') recRef.current.stop(); setPhase('evaluating'); }

  async function handleEvaluate(blob){
    _stopTracks();
    try {
      var b64 = await new Promise(function(resolve,reject){ var fr=new FileReader(); fr.onload=function(){ resolve(String(fr.result).split(',')[1]); }; fr.onerror=reject; fr.readAsDataURL(blob); });
      if (b64 && b64.length > 5000000) { setEvalErr('That recording is too long to evaluate \u2014 please keep it under ~40 seconds and try again.'); setPhase('prep'); return; }
      var lang = window.__langCode || 'en';
      var ex = (typeof examFor === 'function') ? examFor(lang) : { short:'IELTS' };
      var token = _tok();
      var resp = await fetch('/api/speaking-eval', {
        method:'POST',
        headers: Object.assign({ 'Content-Type':'application/json' }, token ? { Authorization:'Bearer '+token } : {}),
        body: JSON.stringify({ audioBase64:b64, mimeType: blob.type || 'audio/webm', exam: ex.short || 'IELTS', part:'Part '+partIdx, question: part.prompt, speak:false }),
      });
      var data = await resp.json();
      if (data && data.evaluation){ setEvalResult(data.evaluation); _maybeSave(data.evaluation); }
      else setEvalErr((data && (data.note || data.error)) || 'Could not evaluate the recording — please try again.');
    } catch(e){ setEvalErr('Could not evaluate the recording — please try again.'); }
    setPhase('done');
  }

  function _maybeSave(ev){
    if (window.__exam && window.__exam.active) return; // exam scoring handled on finish
    if (savedRef.current) return; savedRef.current = true;
    var band = Number(ev.overall_band || 0);
    var token = _tok(); if (!token) return;
    window.__saveResult({ lang: window.__langCode||'en', score: Math.round(band/9*100), detail:{ module:'speaking', part: partIdx, band: band, unit: '/9', criteria: (ev && ev.criteria) || null }, status:'completed' });
  }
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <SessionHeader title={`${_modPrefix()} ${_modLabel("Speaking")} — ${_s.examiner}`} module={`${_modPrefix()} ${_modLabel("Speaking")}`} progress={(partIdx-1)/3*100+20} timeLeft={820} color={T.speaking.c} onExit={() => window.__nav && window.__nav('dashboard')}/>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'280px 1fr', overflow:'hidden' }}>
        {/* Part selector sidebar */}
        <div style={{ borderRight:`1px solid ${T.border}`, padding:'24px 20px', background:T.bg, display:'flex', flexDirection:'column', gap:8 }}>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>{_s.sectionsLabel}</div>
          {parts.map(p => (
            <button key={p.n} onClick={() => { setPartIdx(p.n); setPhase('prep'); }}
              style={{ padding:'12px 14px', borderRadius:12, border:`1px solid ${partIdx===p.n?T.speaking.c+'44':T.border}`, background:partIdx===p.n?T.speaking.bg:T.card, textAlign:'left', cursor:'pointer' }}>
              <div style={{ fontSize:11, color:partIdx===p.n?T.speaking.c:T.ink4, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:3 }}>{p.label}</div>
              <div style={{ fontSize:11.5, color:partIdx===p.n?T.speaking.c:T.ink3 }}>{p.desc}</div>
            </button>
          ))}
          <div style={{ height:1, background:T.border, margin:'10px 0' }}/>
          <div style={{ fontSize:12, color:T.ink4, fontWeight:600, marginBottom:6 }}>{_s.scoreLabels.soFar}</div>
          {(function(){ var c=(evalResult&&evalResult.criteria)||{}; return [{l:_s.scoreLabels.f,v:c.fluency_coherence!=null?c.fluency_coherence:'—'},{l:_s.scoreLabels.v,v:c.lexical_resource!=null?c.lexical_resource:'—'},{l:_s.scoreLabels.g,v:c.grammatical_range!=null?c.grammatical_range:'—'},{l:_s.scoreLabels.p,v:evalResult&&evalResult.overall_band!=null?evalResult.overall_band:'—'}]; })().map(r => (
            <div key={r.l} style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
              <span style={{ color:T.ink3 }}>{r.l}</span>
              <span style={{ fontFamily:T.serif, fontSize:14, color:T.speaking.c }}>{r.v}</span>
            </div>
          ))}
        </div>
        {/* Main area */}
        <div style={{ overflow:'auto', padding:'32px 40px', background:T.card, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ width:'100%', maxWidth:560 }}>
            <Chip label={part.label} accent={T.speaking.c} bg={T.speaking.bg} style={{ marginBottom:20 }}/>
            {/* Prompt card */}
            <div style={{ background:T.bg, border:`1px solid ${T.border}`, borderRadius:18, padding:28, marginBottom:28 }}>
              <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>{_s.questionLabel}</div>
              <div style={{ fontSize:16, color:T.ink, lineHeight:1.65, whiteSpace:'pre-line', fontFamily:"Georgia, serif" }}>{part.prompt}</div>
            </div>
            {/* Recording UI */}
            {phase === 'prep' && (
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:13, color:T.ink3, marginBottom:20 }}>{_s.prepHint}</div>
                {evalErr ? <div style={{ fontSize:12.5, color:'#B91C1C', marginBottom:14 }}>{evalErr}</div> : null}
                <Btn label={_s.startRec} icon={Icon.mic({ width:14, height:14 })} accent={T.speaking.c} size="lg" onClick={startRecording}/>
              </div>
            )}
            {phase === 'recording' && (
              <div style={{ textAlign:'center' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16, color:T.brand }}>
                  <span style={{ width:8, height:8, borderRadius:4, background:T.brand, display:'inline-block' }}/>
                  <span style={{ fontSize:13, fontWeight:700 }}>{_s.recording}</span>
                </div>
                {/* Animated bars */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:3, height:48, marginBottom:20 }}>
                  {Array.from({length:24}).map((_,i) => (
                    <div key={i} style={{ width:5, borderRadius:3, background:T.speaking.c, height:8+Math.abs(Math.sin(i*0.8)*28), opacity:.7+Math.sin(i*.5)*.3 }}/>
                  ))}
                </div>
                <Btn label={_s.stop} icon={Icon.x({ width:12, height:12 })} accent={T.speaking.c} size="lg" variant="outline" onClick={stopRecording}/>
              </div>
            )}
            {phase === 'evaluating' && (
              <div style={{ textAlign:'center', padding:'24px 0' }}>
                <div style={{ fontSize:13.5, color:T.ink3 }}>Evaluating your answer…</div>
              </div>
            )}
            {phase === 'done' && (
              <div style={{ background:T.speaking.bg, border:`1px solid ${T.speaking.c}33`, borderRadius:16, padding:24 }}>
                {evalErr ? (
                  <div>
                    <div style={{ fontSize:13.5, color:T.ink, lineHeight:1.6, marginBottom:16 }}>{evalErr}</div>
                    <Btn label="Try again" accent={T.speaking.c} fullWidth onClick={() => { setEvalErr(''); setPhase('prep'); }}/>
                  </div>
                ) : (
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                      <div style={{ width:56, height:56, borderRadius:14, background:T.card, color:T.speaking.c, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <div style={{ fontFamily:T.serif, fontSize:22, lineHeight:1 }}>{evalResult ? evalResult.overall_band : '—'}</div>
                        <div style={{ fontSize:9, color:T.ink4, marginTop:1 }}>band</div>
                      </div>
                      <div>
                        <div style={{ fontSize:13, fontWeight:700, color:T.speaking.c }}>{_s.feedbackTitle}</div>
                        <div style={{ fontSize:11.5, color:T.ink3 }}>Scored from your spoken answer</div>
                      </div>
                    </div>
                    {evalResult && evalResult.criteria && (
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
                        {Object.keys(evalResult.criteria).filter(function(k){ return typeof evalResult.criteria[k] === 'number'; }).map(function(k){
                          return (
                            <div key={k} style={{ background:T.card, borderRadius:10, padding:'10px 14px' }}>
                              <div style={{ fontSize:10, color:T.ink4, fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:4 }}>{k.replace(/_/g,' ')}</div>
                              <div style={{ fontFamily:T.serif, fontSize:22, color:T.speaking.c }}>{evalResult.criteria[k]}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    {evalResult && (evalResult.pronunciation_note || (evalResult.criteria && evalResult.criteria.pronunciation_note)) && (
                      <div style={{ fontSize:12, color:T.ink3, lineHeight:1.5, marginBottom:14 }}>{evalResult.pronunciation_note || evalResult.criteria.pronunciation_note}</div>
                    )}
                    <Btn label={partIdx < 3 ? _s.next : _s.finish} accent={T.speaking.c} fullWidth iconRight={Icon.arrow({ width:13, height:13 })} onClick={() => { if (partIdx < 3) { setPartIdx(p=>p+1); setPhase('prep'); setEvalResult(null); } else { if (window.__exam && window.__exam.active) window.dispatchEvent(new CustomEvent('fl-exam-section-done', { detail:{ module:'speaking', score: Math.round((evalResult && evalResult.overall_band || 0)/9*100) } })); else { window.__lastResult = { module:'speaking', lang: window.__langCode||'en', kind:'band', band: Number((evalResult && evalResult.overall_band) || 0), criteria: (evalResult && evalResult.criteria) || {} }; window.__nav && window.__nav('mod_results'); } } }}/>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact SVG chart for writing Task 1 — renders a bar or line chart from a spec.
function WritingChart({ spec }) {
  if (!spec || !Array.isArray(spec.categories) || !Array.isArray(spec.series)) return null;
  const cats = spec.categories, series = spec.series;
  const W = 520, H = 200, padL = 38, padB = 26, padT = 10, padR = 10;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const allVals = series.reduce(function (a, s) { return a.concat(s.values || []); }, []);
  const maxV = Math.max(1, Math.max.apply(null, allVals.length ? allVals : [1]));
  const colors = [T.writing.c, T.listening.c, T.reading.c];
  const cx = function (i) { return padL + (plotW / cats.length) * (i + 0.5); };
  const cy = function (v) { return padT + plotH - (v / maxV) * plotH; };
  return (
    <svg viewBox={'0 0 ' + W + ' ' + H} style={{ width:'100%', height:'auto', display:'block' }}>
      <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke={T.border}/>
      <line x1={padL} y1={padT + plotH} x2={W - padR} y2={padT + plotH} stroke={T.border}/>
      {spec.type === 'line'
        ? series.map(function (s, si) {
            return <polyline key={si} fill="none" stroke={colors[si % 3]} strokeWidth="2"
              points={(s.values || []).map(function (v, i) { return cx(i) + ',' + cy(v); }).join(' ')}/>;
          })
        : series.map(function (s, si) {
            return (s.values || []).map(function (v, i) {
              const slot = plotW / cats.length, bw = slot / (series.length + 1);
              const bx = padL + slot * i + bw * si + bw * 0.5;
              return <rect key={si + '-' + i} x={bx} y={cy(v)} width={bw} height={padT + plotH - cy(v)} fill={colors[si % 3]} opacity="0.85" rx="2"/>;
            });
          })}
      {cats.map(function (c, i) { return <text key={i} x={cx(i)} y={H - 8} fontSize="9" fill={T.ink4} textAnchor="middle">{String(c).slice(0, 8)}</text>; })}
      {series.length > 1 && series.map(function (s, si) {
        return <g key={'lg' + si}><rect x={padL + si * 90} y={0} width={9} height={9} fill={colors[si % 3]} rx="2"/><text x={padL + si * 90 + 13} y={8} fontSize="9" fill={T.ink3}>{s.name || ('Series ' + (si + 1))}</text></g>;
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// WRITING SESSION
// ═══════════════════════════════════════════════════════════
function WritingSession() {
  const [task, setTask] = useState('task2');
  const [wordCount, setWordCount] = useState(0);
  const [text, setText] = useState('');
  const [grading, setGrading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [gen, setGen] = useState(null);
  useEffect(function () {
    var lang = window.__langCode || 'en';
    window.__flWritingGen = window.__flWritingGen || {};
    if (window.__flWritingGen[lang]) { setGen(window.__flWritingGen[lang]); return; }
    var alive = true;
    fetch('/api/generate-content', { method:'POST', headers:Object.assign({ 'Content-Type':'application/json' }, window.__authHeaders ? window.__authHeaders() : {}), body: JSON.stringify({ lang: lang, type:'writing', difficulty: (window.__adaptiveDifficulty && window.__adaptiveDifficulty(lang, 'writing')) || 'medium', exam: (typeof examFor === 'function' ? (examFor(lang).short || null) : null), focus: (window.__focusArea ? window.__focusArea(lang) : null), interests: (window.__interests ? window.__interests() : null) }) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var p = d && d.content && d.content.payload;
        if (alive && p && (p.task1 || p.task2)) { window.__flWritingGen[lang] = p; setGen(p); }
      })
      .catch(function () {});
    return function () { alive = false; };
  }, []);
  const TARGET = task === 'task1' ? 150 : 250;
  const handleChange = (e) => {
    const val = e.target.value;
    setText(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
  };
  const pct = Math.min(100, (wordCount / TARGET) * 100);

  const handleGrade = async (thenNav) => {
    if (!text.trim() || wordCount < 10) return;
    const examActive = window.__exam && window.__exam.active;
    if (!window.FL) {
      if (examActive) window.dispatchEvent(new CustomEvent('fl-exam-section-done', { detail: { module:'writing', score: 0 } }));
      else if (thenNav) window.__nav && window.__nav('mod_results');
      return;
    }
    setGrading(true);
    let res = null;
    try {
      const lang = window.__langCode || (window.__userLanguages && window.__userLanguages[0] && window.__userLanguages[0].code) || 'en';
      res = await window.FL.gradeWriting(task, text, lang);
      if (res && (res.locked || res.limit)) { setGrading(false); if (window.__upgrade) window.__upgrade(res.limit ? 'usage' : 'writing'); return; }
      if (res && !res.error) setFeedback(res);
    } catch(e) { /* non-blocking */ }
    setGrading(false);
    if (examActive) {
      var band = Number((res && (res.overall_band || (res.evaluation && res.evaluation.overall_band))) || 0);
      window.dispatchEvent(new CustomEvent('fl-exam-section-done', { detail: { module:'writing', score: Math.round(band / 9 * 100) } }));
      return;
    }
    var _ev = (res && res.evaluation) ? res.evaluation : res;
    if (_ev && !_ev.error && _ev.overall_band != null) {
      window.__lastResult = { module:'writing', lang: window.__langCode||'en', kind:'band', band: Number(_ev.overall_band||0), criteria: _ev.criteria||{}, corrections: _ev.corrections||[] };
      try {
        var _tok = window.__authToken ? window.__authToken() : null;
        window.__saveResult({ lang: window.__langCode||'en', score: Math.round(Number(_ev.overall_band||0)/9*100), detail:{ module:'writing', task: task, band: Number(_ev.overall_band||0), unit: '/9', criteria: _ev.criteria || null } });
      } catch(e){}
    }
    if (thenNav) window.__nav && window.__nav('mod_results');
  };
  const _w = _sc('writing');
  const _isIelts = (typeof examFor === 'function' ? ((examFor(lang).short || '').toUpperCase().indexOf('IELTS') !== -1) : true);
  const _aiChart = (gen && gen.task1Chart) || null;
  const _showChart = _aiChart ? true : (_isIelts && !(gen && gen.__real));
  const _chart = _aiChart || { type:'bar', title:_w.chartLabel, unit:'thousands', categories:['2005','2008','2011','2014','2017','2020'], series:[{ name:'Students', values:[120,145,185,210,240,195] }] };
  const _task1Prompt = (gen && gen.task1Prompt) || _w.task1Prompt;
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <SessionHeader title={task==='task1'? _w.task1Title : _w.task2Title} module={`${_modPrefix()} ${_modLabel("Writing")}`} progress={pct} timeLeft={task==='task1'?1180:2380} color={T.writing.c} onExit={() => window.__nav && window.__nav('dashboard')}/>
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'1fr 1fr', overflow:'hidden' }}>
        {/* Prompt */}
        <div style={{ overflow:'auto', padding:'28px 32px', borderRight:`1px solid ${T.border}`, background:T.bg, display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ display:'flex', gap:8 }}>
            {[{id:'task1',label:'Task 1'},{id:'task2',label:'Task 2'}].map(t => (
              <button key={t.id} onClick={() => { setTask(t.id); setText(''); setWordCount(0); }}
                style={{ padding:'7px 16px', borderRadius:9, border:`1.5px solid ${task===t.id?T.writing.c:T.border}`, background:task===t.id?T.writing.bg:T.card, fontSize:12.5, fontWeight:700, color:task===t.id?T.writing.c:T.ink2, cursor:'pointer' }}>
                {t.label}
              </button>
            ))}
          </div>
          <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase' }}>
            {task==='task1' ? _w.task1Meta : _w.task2Meta}
          </div>
          {task === 'task1' ? (
            (gen && gen.task1Kind === 'order' && Array.isArray(gen.task1Items) && gen.task1Items.length) ? (
              <WordOrderTask items={gen.task1Items} color={T.writing.c} onText={(t)=>{ setText(t); setWordCount(t.trim()?t.trim().split(/\s+/).length:0); }}/>
            ) : (gen && gen.task1Kind === 'blanks' && Array.isArray(gen.task1Blanks) && gen.task1Blanks.length) ? (
              <BlankFillTask passage={gen.task1Passage} blanks={gen.task1Blanks} color={T.writing.c} onText={(t)=>{ setText(t); setWordCount(t.trim()?t.trim().split(/\s+/).length:0); }}/>
            ) : (
            <>
              <div style={{ fontSize:14, color:T.ink, lineHeight:1.65, fontFamily:"Georgia,serif", whiteSpace:'pre-line' }}>
                {_task1Prompt}
              </div>
              {/* Chart — IELTS Task 1 only; other exams have text writing tasks */}
              {_showChart && (
              <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:20 }}>
                <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14 }}>{_chart.title || _w.chartLabel}</div>
                <WritingChart spec={_chart}/>
              </div>
              )}
            </>
            )
          ) : (
            <div style={{ fontSize:14, color:T.ink, lineHeight:1.65, fontFamily:"Georgia,serif" }}>
              {(gen && gen.task2Topic)
                ? <span style={{ whiteSpace:'pre-line' }}>{gen.task2Topic}</span>
                : <><strong>{_w.task2Intro}</strong><br/><br/><em>{_w.task2Topic}</em><br/><br/>{_w.task2Outro}</>}
            </div>
          )}
          {/* AI tips */}
          <div style={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:14, padding:16 }}>
            <div style={{ fontSize:11, fontWeight:700, color:T.writing.c, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10 }}>{_w.tipsLabel}</div>
            {((task==='task1' ? _w.task1Tips : _w.task2Tips) || []).map(t => (
              <div key={t} style={{ display:'flex', gap:8, marginBottom:7, fontSize:12.5, color:T.ink2 }}>
                <span style={{ color:T.writing.c, flexShrink:0 }}>→</span> {t}
              </div>
            ))}
          </div>
        </div>
        {/* Writing area */}
        <div style={{ display:'flex', flexDirection:'column', overflow:'hidden', background:T.card }}>
          <div style={{ flex:1, position:'relative' }}>
            <textarea value={text} onChange={handleChange} placeholder={task==='task1'
              ? 'The bar chart illustrates the trend in international students studying in the UK from 2005 to 2020…'
              : 'In today\'s increasingly connected world, technology has transformed the way people communicate and maintain relationships…'}
              style={{ width:'100%', height:'100%', border:'none', outline:'none', resize:'none', padding:'28px 32px', fontSize:14.5, lineHeight:1.8, color:T.ink, fontFamily:"Georgia,'DM Serif Display',serif", background:'transparent' }}/>
          </div>
          {feedback && !feedback.error && (
            <div style={{ borderTop:`1px solid ${T.border}`, background:T.bg, padding:'16px 24px', maxHeight:'44%', overflow:'auto', flexShrink:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <div style={{ width:54, height:54, borderRadius:14, background:T.writing.bg, color:T.writing.c, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <div style={{ fontFamily:T.serif, fontSize:21, lineHeight:1 }}>{feedback.overall_band}</div>
                  <div style={{ fontSize:9, color:T.ink4, marginTop:1 }}>band</div>
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:T.ink }}>AI feedback</div>
                  <div style={{ fontSize:11.5, color:T.ink3 }}>Scored against the writing band descriptors</div>
                </div>
              </div>
              {feedback.criteria && (
                <div style={{ display:'flex', flexDirection:'column', gap:7, marginBottom:14 }}>
                  {Object.keys(feedback.criteria).map(function (k) {
                    var v = feedback.criteria[k];
                    return (
                      <div key={k} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:160, fontSize:11.5, color:T.ink2, textTransform:'capitalize' }}>{k.replace(/_/g, ' ')}</div>
                        <div style={{ flex:1, height:6, background:T.bg3, borderRadius:99, overflow:'hidden' }}>
                          <div style={{ height:'100%', width:(Number(v) / 9 * 100) + '%', background:T.writing.c, borderRadius:99 }}/>
                        </div>
                        <div style={{ width:28, textAlign:'right', fontSize:12, fontWeight:700, color:T.ink }}>{v}</div>
                      </div>
                    );
                  })}
                </div>
              )}
              {Array.isArray(feedback.corrections) && feedback.corrections.length > 0 && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Corrections</div>
                  {feedback.corrections.map(function (c, i) {
                    return (
                      <div key={i} style={{ padding:'8px 12px', borderRadius:9, background:T.card, border:`1px solid ${T.border}`, marginBottom:6, fontSize:12.5, lineHeight:1.5 }}>
                        <span style={{ color:'#dc2626', textDecoration:'line-through' }}>{c.original}</span>{' \u2192 '}<span style={{ color:'#16a34a', fontWeight:600 }}>{c.better}</span>
                        {c.why && <div style={{ fontSize:11, color:T.ink3, marginTop:3 }}>{c.why}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
              {feedback.model_answer && (
                <div>
                  <div style={{ fontSize:11, color:T.ink4, fontWeight:700, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Model answer</div>
                  <div style={{ fontSize:13, color:T.ink2, lineHeight:1.65, fontFamily:"Georgia,serif", whiteSpace:'pre-line' }}>{feedback.model_answer}</div>
                </div>
              )}
            </div>
          )}
          {feedback && feedback.error && (
            <div style={{ borderTop:`1px solid ${T.border}`, padding:'12px 24px', fontSize:12.5, color:'#dc2626', flexShrink:0 }}>We couldn't grade this just now — your writing is saved. Try submitting again in a moment.</div>
          )}
          {/* Bottom bar */}
          <div style={{ height:56, borderTop:`1px solid ${T.border}`, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexShrink:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:13, fontWeight:600, color: wordCount >= TARGET ? T.listening.c : T.ink }}>
                {wordCount} / {TARGET} words
              </div>
              <div style={{ width:100, height:5, background:T.bg3, borderRadius:99, overflow:'hidden' }}>
                <div style={{ height:'100%', width:pct+'%', background:wordCount>=TARGET?T.listening.c:T.writing.c, borderRadius:99, transition:'width .3s' }}/>
              </div>
              {wordCount < TARGET && <div style={{ fontSize:11, color:T.ink4 }}>{TARGET - wordCount} more to go</div>}
              {wordCount >= TARGET && <Chip label="Min. reached ✓" accent={T.listening.c} bg={T.listening.bg} style={{ fontSize:10 }}/>}
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <Btn label={grading ? 'Grading…' : 'Get AI feedback'} variant="outline" accent={T.writing.c} size="sm" icon={Icon.spark({ width:12, height:12 })} onClick={() => handleGrade(false)}/>
              <Btn label="Submit essay" accent={T.writing.c} size="sm" iconRight={Icon.arrow({ width:11, height:11 })} onClick={() => handleGrade(true)}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ReadingSession, ListeningSession, SpeakingSession, WritingSession });
