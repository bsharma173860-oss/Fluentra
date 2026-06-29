// ── Fluentra · /api/speaking-eval ───────────────────────────────────────────
// The first REAL piece of the engine (replaces the simulated AI exam flow).
//
// Pipeline:
//   1) audio (base64) -> OpenAI Whisper  -> transcript
//   2) transcript     -> Claude (Sonnet) -> rubric scores + corrections + reply
//   3) examiner reply -> OpenAI TTS       -> spoken audio (optional)
//
// Required env vars (set in Vercel → Project → Settings → Environment Variables):
//   OPENAI_API_KEY      (Whisper STT + TTS)
//   ANTHROPIC_API_KEY   (grading)
//
// Notes:
//   • Pronunciation can't be fully judged from a transcript; Claude gives a
//     provisional note only. True phoneme scoring is a later upgrade.
//   • Vercel Hobby body limit ~4.5MB → keep answers under ~45s of audio.
// ─────────────────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  // ── TTS branch (op:'tts') ────────────────────────────────────────────────
  // Neural voice for flSpeak, folded into this audio endpoint so we stay under
  // the Vercel Hobby 12-function cap. Provider priority: Google Cloud TTS
  // (GOOGLE_TTS_KEY, cheapest/best per-language) -> OpenAI TTS (OPENAI_API_KEY,
  // already configured) -> 503 so the client falls back to browser speech.
  if (req.body && req.body.op === 'tts') {
    const ttsText = String(req.body.text || '').slice(0, 800);
    const ttsLang = String(req.body.lang || 'en');
    if (!ttsText) return res.status(400).json({ error: 'text required' });
    const GKEY = process.env.GOOGLE_TTS_KEY;
    const OKEY = process.env.OPENAI_API_KEY;
    try {
      if (GKEY) {
        const gmap = { en:'en-US', es:'es-ES', fr:'fr-FR', de:'de-DE', it:'it-IT', pt:'pt-PT', ja:'ja-JP', zh:'cmn-CN', ko:'ko-KR', ru:'ru-RU', ar:'ar-XA', hi:'hi-IN', nl:'nl-NL', pl:'pl-PL', tr:'tr-TR', sv:'sv-SE' };
        const lc = gmap[ttsLang] || 'en-US';
        const g = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + GKEY, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: { text: ttsText }, voice: { languageCode: lc }, audioConfig: { audioEncoding: 'MP3', speakingRate: 0.95 } }),
        });
        if (g.ok) { const gj = await g.json(); if (gj && gj.audioContent) return res.status(200).json({ audioBase64: gj.audioContent, mime: 'audio/mpeg', provider: 'google' }); }
      }
      if (OKEY) {
        const o = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST', headers: { Authorization: `Bearer ${OKEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'tts-1', voice: 'alloy', input: ttsText }),
        });
        if (o.ok) { const b64 = Buffer.from(await o.arrayBuffer()).toString('base64'); return res.status(200).json({ audioBase64: b64, mime: 'audio/mpeg', provider: 'openai' }); }
      }
    } catch (e) {}
    return res.status(503).json({ error: 'tts-unavailable' });
  }

  const OPENAI = process.env.OPENAI_API_KEY;
  const ANTHROPIC = process.env.ANTHROPIC_API_KEY;
  if (!OPENAI || !ANTHROPIC) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY or ANTHROPIC_API_KEY env var' });
  }

  // Usage cap: 5 credits — Whisper + Claude + TTS makes speaking the priciest action
  try {
    var allow = await require('./_usage').meter(req, 5);
    if (!allow.ok) return res.status(402).json({ error: 'limit', limit: true, plan: allow.plan, remaining: allow.remaining, cap: allow.limit });
  } catch (e) {}

  try {
    const {
      audioBase64,
      mimeType = 'audio/webm',
      exam = 'IELTS',
      part = 'Part 1',
      question = '',
      targetLevel = 'B2',
      speak = true,
    } = req.body || {};
    if (!audioBase64) return res.status(400).json({ error: 'audioBase64 required' });
    if (audioBase64.length > 6000000) return res.status(413).json({ error: 'audio too long', detail: 'Recording is too long to evaluate — keep it under about 45 seconds.' });

    // ── 1) Whisper transcription ─────────────────────────────────────────────
    const audioBuf = Buffer.from(audioBase64, 'base64');
    const form = new FormData();
    form.append('file', new Blob([audioBuf], { type: mimeType }), 'answer.webm');
    form.append('model', 'whisper-1');
    form.append('response_format', 'json');

    const sttResp = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${OPENAI}` },
      body: form,
    });
    if (!sttResp.ok) {
      return res.status(502).json({ error: 'STT failed', detail: (await sttResp.text()).slice(0, 300) });
    }
    const transcript = (await sttResp.json()).text || '';
    if (!transcript.trim()) {
      return res.status(200).json({ transcript: '', evaluation: null, note: 'No speech detected — try again.' });
    }

    // ── 2) Claude grades against the exam rubric (returns strict JSON) ────────
    const system =
      `You are a certified ${exam} speaking examiner. Evaluate the candidate's spoken answer ` +
      `(given as a transcript). Score strictly against the ${exam} band descriptors for: ` +
      `fluency_coherence, lexical_resource, grammatical_range_accuracy. Pronunciation cannot be ` +
      `fully judged from a transcript — put a brief caveat in pronunciation_note instead of a score. ` +
      `Bands are 0–9 in 0.5 steps. Return ONLY valid minified JSON (no markdown, no prose) of exactly this shape:\n` +
      `{"overall_band":number,"criteria":{"fluency_coherence":number,"lexical_resource":number,` +
      `"grammatical_range_accuracy":number},"pronunciation_note":string,"strengths":[string],` +
      `"corrections":[{"original":string,"better":string,"why":string}],"model_answer":string,` +
      `"examiner_reply":string}\n` +
      `examiner_reply = a short, natural follow-up question continuing the interview at ${targetLevel} level.`;

    const userMsg =
      `Exam: ${exam} ${part}\nQuestion asked: ${question || '(general prompt)'}\n` +
      `Candidate transcript:\n"""${transcript}"""`;

    const aResp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: (process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6'),
        max_tokens: 1200,
        system,
        messages: [{ role: 'user', content: userMsg }],
      }),
    });
    if (!aResp.ok) {
      return res.status(502).json({ error: 'grading failed', detail: (await aResp.text()).slice(0, 300) });
    }
    const aData = await aResp.json();
    const rawText = (aData.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim()
      .replace(/^```json\s*|\s*```$/g, '');

    let evaluation;
    try {
      evaluation = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: 'could not parse grading JSON', raw: rawText.slice(0, 400) });
    }

    // ── 3) Optional: speak the examiner reply via OpenAI TTS ─────────────────
    let replyAudioBase64 = null;
    if (speak && evaluation.examiner_reply) {
      const ttsResp = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: { Authorization: `Bearer ${OPENAI}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'tts-1', voice: 'alloy', input: evaluation.examiner_reply }),
      });
      if (ttsResp.ok) {
        replyAudioBase64 = Buffer.from(await ttsResp.arrayBuffer()).toString('base64');
      }
    }

    return res.status(200).json({ transcript, evaluation, replyAudioBase64 });
  } catch (e) {
    return res.status(500).json({ error: 'server error', detail: String(e && e.message || e).slice(0, 300) });
  }
};

module.exports.config = { maxDuration: 60 };
