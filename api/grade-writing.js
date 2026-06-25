// ── Fluentra · /api/grade-writing ───────────────────────────────────────────
// Real essay grader (text-only sibling of speaking-eval). Replaces the old
// external /grade/writing call. Claude scores the submission against the exam
// writing rubric and returns bands + corrections + a model answer.
//
// POST { text, task?, lang?, exam? }
// Env: ANTHROPIC_API_KEY
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
  if (!ANTHROPIC) return res.status(500).json({ error: 'Missing ANTHROPIC_API_KEY' });

  // Usage cap: 3 credits (fail-open if not configured)
  try {
    var allow = await require('./_usage').meter(req, 3);
    if (!allow.ok) return res.status(402).json({ error: 'limit', limit: true, plan: allow.plan, remaining: allow.remaining, cap: allow.limit });
  } catch (e) {}

  try {
    const { text, task = 'task2', lang = 'en', exam = 'IELTS' } = req.body || {};
    if (!text || !text.trim()) return res.status(400).json({ error: 'text required' });
    if (text.length > 8000) return res.status(400).json({ error: 'text too long' });

    const system =
      'You are a certified ' + exam + ' writing examiner grading a learner of language code "' + lang + '". ' +
      'Score the submission strictly against the ' + exam + ' writing band descriptors for: ' +
      'task_response, coherence_cohesion, lexical_resource, grammatical_range_accuracy. ' +
      'Bands are 0-9 in 0.5 steps. Return ONLY valid minified JSON (no markdown) of exactly this shape:\n' +
      '{"overall_band":number,"criteria":{"task_response":number,"coherence_cohesion":number,' +
      '"lexical_resource":number,"grammatical_range_accuracy":number},"strengths":[string],' +
      '"corrections":[{"original":string,"better":string,"why":string}],"model_answer":string}\n' +
      'corrections: up to 6 of the most useful fixes. model_answer: a concise band-8+ version.';

    const user = 'Task: ' + task + '\n\nCandidate submission:\n"""' + text + '"""';

    const aResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': ANTHROPIC, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        system: system,
        messages: [{ role: 'user', content: user }],
      }),
    });
    if (!aResp.ok) return res.status(502).json({ error: 'grading failed', detail: (await aResp.text()).slice(0, 300) });
    const aData = await aResp.json();
    const raw = (aData.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim().replace(/^```json\s*|\s*```$/g, '');
    let evaluation;
    try { evaluation = JSON.parse(raw); } catch { return res.status(502).json({ error: 'bad JSON from model', raw: raw.slice(0, 400) }); }

    return res.status(200).json(evaluation);
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String((e && e.message) || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 60 };
