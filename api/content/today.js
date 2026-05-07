/**
 * GET /api/content/today?userId=&languageCode=&module=
 * Returns today's pre-generated content for a user/language/module.
 * Falls back to generating fresh content if none exists for today.
 *
 * Returns: { content, contentId, generatedAt, cached: boolean }
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { userId, languageCode, module } = req.query ?? {};
  if (!userId || !languageCode || !module) {
    return res.status(400).json({ error: 'userId, languageCode, and module are required' });
  }

  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  try {
    // Check for content already generated today
    const { data, error } = await supabase
      .from('daily_content')
      .select('*')
      .eq('user_id', userId)
      .eq('language_code', languageCode)
      .eq('module', module)
      .gte('generated_at', `${today}T00:00:00Z`)
      .order('generated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found, that's expected
      console.error('[content/today] query error:', error.message);
    }

    if (data) {
      return res.json({
        content:     data.content,
        contentId:   data.id,
        generatedAt: data.generated_at,
        cached:      true,
      });
    }

    // No content yet for today — caller should POST /api/content/generate
    return res.status(404).json({
      error:  'No content for today',
      cached: false,
    });
  } catch (err) {
    console.error('[content/today] error:', err);
    return res.status(500).json({ error: 'Failed to fetch content' });
  }
}
