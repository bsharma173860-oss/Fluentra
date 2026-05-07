/**
 * POST /api/content/generate
 * Generates daily practice content for a language + module using Claude.
 *
 * Body: { userId, languageCode, module: 'writing'|'listening'|'reading'|'speaking', examType, difficulty }
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
     Return JSON: { taskType: "task1"|"task2", prompt: string, wordLimit: number, timeMinutes: number }`,

  listening: (lang, exam, difficulty) =>
    `Generate a ${exam} listening comprehension exercise for a ${difficulty} ${lang} learner.
     Return JSON: { transcript: string, questions: [{id,text,type,options?,answer}], audioDescription: string }`,

  reading: (lang, exam, difficulty) =>
    `Generate a ${exam} reading passage with questions for a ${difficulty} ${lang} learner.
     Return JSON: { passage: string, questions: [{id,text,type,options?,answer}], wordCount: number }`,

  speaking: (lang, exam, difficulty) =>
    `Generate a ${exam} speaking task prompt for a ${difficulty} ${lang} learner.
     Return JSON: { part: 1|2|3, prompt: string, followUpQuestions: string[], prepTimeSeconds: number }`,
};

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

    // Persist to daily_content for caching
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

    if (error) console.error('[content/generate] insert error:', error.message);

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
