/**
 * GET /api/admin/revenue
 * Returns MRR breakdown, subscription counts, and exam purchases.
 * Requires x-admin-key header.
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function checkAuth(req, res) {
  if (req.headers['x-admin-key'] !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAuth(req, res)) return;

  try {
    const [
      totalRes,
      proRes,
      eliteRes,
      examRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('id, created_at').eq('subscription_tier', 'pro').order('created_at', { ascending: true }),
      supabase.from('profiles').select('id, created_at').eq('subscription_tier', 'elite').order('created_at', { ascending: true }),
      supabase.from('monthly_exam_entries').select('id, user_id, language_code, exam_type, exam_month, registered_at').order('registered_at', { ascending: false }).limit(50),
    ]);

    const total  = totalRes.count ?? 0;
    const pro    = proRes.data    ?? [];
    const elite  = eliteRes.data  ?? [];
    const exams  = examRes.data   ?? [];

    const proCount   = pro.length;
    const eliteCount = elite.length;
    const freeCount  = total - proCount - eliteCount;
    const mrr        = proCount * 24 + eliteCount * 120;

    // Build monthly cohorts for chart (last 6 months)
    const months: Record<string, { pro: number; elite: number; mrr: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      months[key] = { pro: 0, elite: 0, mrr: 0 };
    }

    // Cumulative pro/elite counts per month (simplified: users who joined that month)
    pro.forEach(u => {
      const key = u.created_at?.slice(0, 7);
      if (months[key]) months[key].pro++;
    });
    elite.forEach(u => {
      const key = u.created_at?.slice(0, 7);
      if (months[key]) months[key].elite++;
    });

    const mrrHistory = Object.entries(months).map(([month, d]) => ({
      month,
      pro:   d.pro,
      elite: d.elite,
      mrr:   d.pro * 24 + d.elite * 120,
    }));

    // Enrich exam purchases with user info
    const userIds = [...new Set(exams.map(e => e.user_id))];
    const { data: profiles } = userIds.length
      ? await supabase.from('profiles').select('id, display_name, email').in('id', userIds)
      : { data: [] };

    const profileMap = {};
    (profiles ?? []).forEach(p => { profileMap[p.id] = p; });

    const examPurchases = exams.map(e => ({
      id:           e.id,
      userId:       e.user_id,
      userName:     profileMap[e.user_id]?.display_name ?? 'Unknown',
      languageCode: e.language_code,
      examType:     e.exam_type,
      month:        e.exam_month,
      date:         e.registered_at,
    }));

    return res.json({
      subscriptions: {
        free:  freeCount,
        pro:   proCount,
        elite: eliteCount,
        total,
        mrr,
        conversionRate: total > 0
          ? (((proCount + eliteCount) / total) * 100).toFixed(1) + '%'
          : '0%',
      },
      mrrHistory,
      examPurchases,
    });
  } catch (err) {
    console.error('[admin/revenue] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
