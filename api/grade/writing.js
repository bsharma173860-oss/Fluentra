import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, essay, taskType, examType, prompt, languageCode } = req.body

  if (!essay) {
    return res.status(400).json({ error: 'Missing essay' })
  }

  try {
    const gradingPrompt = buildPrompt(essay, taskType, examType, prompt)

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: gradingPrompt }],
    })

    const text = message.content[0].text
    const result = JSON.parse(
      text.replace(/```json/g, '').replace(/```/g, '').trim()
    )

    if (userId) {
      await supabase.from('writing_attempts').insert({
        user_id: userId,
        task_type: taskType,
        exam_type: examType,
        language_code: languageCode,
        essay_text: essay,
        overall_band: result.overall,
        task_achievement: result.task_achievement,
        coherence: result.coherence,
        lexical_resource: result.lexical_resource,
        grammar: result.grammar,
        feedback: result.feedback,
        word_count: essay.trim().split(/\s+/).length,
      })
    }

    return res.json(result)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

function buildPrompt(essay, taskType, examType, prompt) {
  const examPrompts = {
    ielts: `You are an expert IELTS examiner. Grade this ${taskType === 'task1' ? 'Task 1' : 'Task 2'} essay strictly.

Prompt: ${prompt || 'General task'}
Essay: ${essay}

Return ONLY JSON no markdown:
{
  "overall": 7.0,
  "task_achievement": 7.0,
  "coherence": 6.5,
  "lexical_resource": 7.0,
  "grammar": 7.0,
  "feedback": "2-3 sentence feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1"],
  "corrections": [{"original":"text","correction":"fixed","explanation":"why"}]
}`,

    delf: `Vous êtes examinateur DELF B2. Évaluez cette production écrite.

Texte: ${essay}

Retournez UNIQUEMENT du JSON:
{
  "overall": 18.5,
  "respect_consigne": 4.5,
  "coherence_cohesion": 5.0,
  "competence_lexicale": 4.5,
  "competence_grammaticale": 4.5,
  "feedback": "Commentaire en 2-3 phrases",
  "strengths": [],
  "improvements": [],
  "corrections": []
}`,

    dele: `Eres examinador DELE B2. Evalúa esta producción escrita.

Texto: ${essay}

Devuelve SOLO JSON:
{
  "overall": 18.0,
  "adecuacion": 4.5,
  "coherencia": 4.0,
  "cohesion": 4.5,
  "correccion": 5.0,
  "feedback": "Comentario en 2-3 frases",
  "strengths": [],
  "improvements": [],
  "corrections": []
}`,
  }

  return examPrompts[examType] || examPrompts.ielts
}
