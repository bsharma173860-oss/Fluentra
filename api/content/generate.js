/**
 * POST /api/content/generate
 * Generates daily practice content for a language + module using Claude.
 *
 * Body: { userId, languageCode, module: 'writing'|'listening'|'reading'|'speaking'|'vocab'|'grammar', examType, difficulty }
 * Returns: { content, contentId, generatedAt }
 */
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const PROMPTS = {
  writing: (lang, exam, difficulty) =>
    `Generate a ${exam} writing task for a ${difficulty} ${lang} learner.
     Return ONLY valid JSON (no markdown): { title: string, taskType: "task1"|"task2", prompt: string, wordLimit: number, timeMinutes: number, difficulty: string }`,

  listening: (lang, exam, difficulty) =>
    `Generate a ${exam} listening comprehension exercise for a ${difficulty} ${lang} learner.
     Return ONLY valid JSON (no markdown): { title: string, transcript: string, questions: [{id,text,type,options?,answer}], audioDescription: string }`,

  reading: (lang, exam, difficulty) =>
    `Generate a ${exam} reading passage with questions for a ${difficulty} ${lang} learner.
     Return ONLY valid JSON (no markdown): { title: string, passage: string, questions: [{id,text,type,options?,answer}], wordCount: number }`,

  speaking: (lang, exam, difficulty) =>
    `Generate a ${exam} speaking task prompt for a ${difficulty} ${lang} learner.
     Return ONLY valid JSON (no markdown): { title: string, part: 1|2|3, prompt: string, followUpQuestions: string[], prepTimeSeconds: number }`,

  vocab: (lang, exam, difficulty) =>
    `Generate a vocabulary lesson for a ${difficulty} ${lang} learner studying for ${exam}.
     Return ONLY valid JSON (no markdown): { title: string, topic: string, words: [{word: string, translation: string, definition: string, exampleSentence: string, partOfSpeech: string}] }
     Include 10 words.`,

  grammar: (lang, exam, difficulty) =>
    `Generate a grammar lesson for a ${difficulty} ${lang} learner studying for ${exam}.
     Return ONLY valid JSON (no markdown): { title: string, topic: string, explanation: string, examples: [{sentence: string, note: string}], exercises: [{question: string, answer: string}] }
     Include 3 examples and 3 exercises.`,
};

// Maps generate.js module name → library content_type
const MODULE_TO_CONTENT_TYPE = {
  writing:   'writing_prompt',
  listening: 'listening',
  reading:   'reading',
  speaking:  'speaking',
  vocab:     'vocab',
  grammar:   'grammar',
};

/** Extract a human-readable title from generated content */
function extractTitle(content, module, languageCode, today) {
  if (content.title) return content.title;
  if (module === 'writing')   return content.prompt?.slice(0, 80) ?? 'Writing Prompt';
  if (module === 'listening') return content.audioDescription?.slice(0, 80) ?? 'Listening Exercise';
  if (module === 'reading')   return content.passage?.slice(0, 80) ?? 'Reading Passage';
  if (module === 'speaking')  return content.prompt?.slice(0, 80) ?? 'Speaking Task';
  if (module === 'vocab')     return `${languageCode.toUpperCase()} Vocabulary — ${today}`;
  if (module === 'grammar')   return content.topic ?? 'Grammar Lesson';
  return 'Content';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, languageCode, module, examType, difficulty = 'intermediate' } = req.body ?? {};
  if (!userId || !languageCode || !module) {
    return res.status(400).json({ error: 'userId, languageCode, and module are required' });
  }

  const promptFn = PROMPTS[module];
  if (!promptFn) return res.status(400).json({ error: `Unknown module: ${module}` });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: promptFn(languageCode, examType ?? 'general', difficulty),
      }],
    });

    const raw = message.content[0]?.text ?? '{}';
    // Extract JSON from response (Claude may wrap it in markdown)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    const content = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw };

    const today = new Date().toISOString().split('T')[0];

    // 1. Persist to daily_content for per-user caching
    const { data, error } = await supabase
      .from('daily_content')
      .insert({
        user_id:      userId,
        language_code: languageCode,
        module,
        exam_type:    examType,
        difficulty,
        content,
        generated_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (error) console.error('[content/generate] daily_content insert error:', error.message);

    // 2. Also save to shared library so all users can browse past content
    const contentType = MODULE_TO_CONTENT_TYPE[module];
    if (contentType) {
      const title = extractTitle(content, module, languageCode, today);
      const { error: libErr } = await supabase
        .from('library')
        .insert({
          language_code: languageCode,
          exam_type:     examType ?? 'general',
          content_type:  contentType,
          title,
          content,
          difficulty:    content.difficulty ?? difficulty ?? 'B2',
          date:          today,
        });

      if (libErr) console.error('[content/generate] library insert error:', libErr.message);
    }

    return res.json({
      content,
      contentId:   data?.id ?? null,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[content/generate] error:', err);
    return res.status(500).json({ error: 'Content generation failed' });
  }
}
