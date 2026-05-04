const express = require('express')
const router = express.Router()
const Anthropic = require('@anthropic-ai/sdk')
const supabase = require('../lib/supabase')

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

router.post('/writing', async (req, res) => {
  try {
    const { userId, essay, taskType, examType, prompt, languageCode } = req.body

    if (!essay || !taskType) {
      return res.status(400).json({ error: 'Missing essay or taskType' })
    }

    const gradingPrompt = buildGradingPrompt(essay, taskType, examType, prompt)

    const message = await anthropic.messages.create({
      model: 'claude-opus-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: gradingPrompt }],
    })

    const responseText = message.content[0].text

    // Parse JSON response from model
    const result = JSON.parse(
      responseText.replace(/```json/g, '').replace(/```/g, '').trim()
    )

    // Save to Supabase
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
        word_count: essay.split(' ').length,
      })
    }

    return res.json(result)
  } catch (err) {
    console.error('Grade error:', err)
    return res.status(500).json({ error: 'Grading failed', details: err.message })
  }
})

function buildGradingPrompt(essay, taskType, examType, prompt) {
  if (examType === 'ielts') {
    return `You are an expert IELTS examiner. Grade this ${taskType === 'task1' ? 'Task 1' : 'Task 2'} essay strictly according to official IELTS band descriptors.

Essay prompt: ${prompt || 'General essay task'}

Student essay:
${essay}

Return ONLY a JSON object with NO markdown:
{
  "overall": 7.0,
  "task_achievement": 7.0,
  "coherence": 6.5,
  "lexical_resource": 7.0,
  "grammar": 7.0,
  "feedback": "Overall feedback in 2-3 sentences",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "corrections": [
    {
      "original": "incorrect phrase from essay",
      "correction": "corrected version",
      "explanation": "why this is wrong"
    }
  ]
}`
  }

  if (examType === 'delf') {
    return `Vous êtes un examinateur expert du DELF B2. Évaluez cette production écrite selon les critères officiels du DELF.

Texte de l'étudiant:
${essay}

Retournez UNIQUEMENT un objet JSON sans markdown:
{
  "overall": 18.5,
  "respect_consigne": 4.5,
  "correction_sociolinguistique": 4.0,
  "coherence_cohesion": 5.0,
  "competence_lexicale": 5.0,
  "feedback": "Commentaire général en 2-3 phrases",
  "points_forts": ["point 1", "point 2"],
  "ameliorations": ["amélioration 1"],
  "corrections": [
    {
      "original": "phrase incorrecte",
      "correction": "version corrigée",
      "explication": "pourquoi c'est incorrect"
    }
  ]
}`
  }

  if (examType === 'dele') {
    return `Eres un examinador experto del DELE B2. Evalúa esta producción escrita según los criterios oficiales del DELE.

Texto del estudiante:
${essay}

Devuelve SOLO un objeto JSON sin markdown:
{
  "overall": 18.0,
  "adecuacion": 4.5,
  "coherencia": 4.0,
  "cohesion": 4.5,
  "correccion": 5.0,
  "feedback": "Comentario general en 2-3 frases",
  "puntos_fuertes": ["punto 1"],
  "mejoras": ["mejora 1"],
  "correcciones": [
    {
      "original": "frase incorrecta",
      "correccion": "versión correcta",
      "explicacion": "por qué es incorrecto"
    }
  ]
}`
  }

  // Default English grading
  return `You are an expert language examiner. Grade this essay.

Essay: ${essay}

Return ONLY JSON:
{
  "overall": 7.0,
  "task_achievement": 7.0,
  "coherence": 7.0,
  "lexical_resource": 7.0,
  "grammar": 7.0,
  "feedback": "Overall feedback",
  "strengths": [],
  "improvements": [],
  "corrections": []
}`
}

module.exports = router
