/**
 * POST /api/exam/purchase
 * Records an exam entry purchase (token deduction + entry creation).
 *
 * Body: { userId, languageCode, examType, month: 'YYYY-MM' }
 * Returns: { entryId, examDate, tokensRemaining }
 *
 * Business rules:
 *  - Free plan: 0 exam entries/month
 *  - Pro plan: unlimited exam entries
 *  - One entry per language per month
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, languageCode, examType, month } = req.body ?? {};
  if (!userId || !languageCode || !examType || !month) {
    return res.status(400).json({ error: 'userId, languageCode, examType, and month are required' });
  }

  // Validate month format YYYY-MM
  if (!/^\d{4}-\d{2}$/.test(month)) {
    return res.status(400).json({ error: 'month must be YYYY-MM format' });
  }

  try {
    // 1. Check user plan
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single();

    if (profileErr) return res.status(404).json({ error: 'User not found' });

    if (profile.subscription_tier === 'free') {
      return res.status(403).json({
        error: 'Exam entries require a Pro subscription',
        upgradeRequired: true,
      });
    }

    // 2. Check for duplicate entry this month
    const { data: existing } = await supabase
      .from('monthly_exam_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('language_code', languageCode)
      .eq('exam_month', month)
      .single();

    if (existing) {
      return res.status(409).json({
        error: 'Already registered for this exam this month',
        entryId: existing.id,
      });
    }

    // 3. Create the entry
    const examDate = new Date(`${month}-01`);
    examDate.setDate(examDate.getDate() + 27); // ~last Saturday of month
    const examDateStr = examDate.toISOString().split('T')[0];

    const { data: entry, error: insertErr } = await supabase
      .from('monthly_exam_entries')
      .insert({
        user_id:       userId,
        language_code: languageCode,
        exam_type:     examType,
        exam_month:    month,
        exam_date:     examDateStr,
        status:        'registered',
        registered_at: new Date().toISOString(),
      })
      .select('id')
      .single();

    if (insertErr) {
      console.error('[exam/purchase] insert error:', insertErr.message);
      return res.status(500).json({ error: 'Failed to register for exam' });
    }

    return res.json({
      entryId:  entry.id,
      examDate: examDateStr,
    });
  } catch (err) {
    console.error('[exam/purchase] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
