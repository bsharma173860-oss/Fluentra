/**
 * GET /api/admin/stats
 * Returns platform-wide stats for the admin dashboard.
 * Requires x-admin-key header matching ADMIN_SECRET env var.
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

function checkAuth(req, res) {
  const key = req.headers['x-admin-key'];
  if (key !== process.env.ADMIN_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAuth(req, res)) return;

  try {
    const today      = new Date().toISOString().split('T')[0];
    const todayISO   = `${today}T00:00:00Z`;
    const weekAgoISO = new Date(Date.now() - 7 * 86400000).toISOString();

    const [
      usersTotal,
      usersToday,
      usersWeek,
      proUsers,
      eliteUsers,
      writingToday,
      speakingToday,
      listeningToday,
      readingToday,
      libraryTotal,
      libraryToday,
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgoISO),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'elite'),
      supabase.from('writing_attempts').select('*',   { count: 'exact', head: true }).gte('created_at', todayISO),
      supabase.from('speaking_sessions').select('*',  { count: 'exact', head: true }).gte('created_at', todayISO),
      supabase.from('listening_attempts').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
      supabase.from('reading_attempts').select('*',   { count: 'exact', head: true }).gte('created_at', todayISO),
      supabase.from('library').select('*',            { count: 'exact', head: true }),
      supabase.from('library').select('*',            { count: 'exact', head: true }).gte('created_at', todayISO),
    ]);

    const total     = usersTotal.count ?? 0;
    const pro       = proUsers.count   ?? 0;
    const elite     = eliteUsers.count ?? 0;
    const paid      = pro + elite;
    const sessToday = (writingToday.count ?? 0) + (speakingToday.count ?? 0)
                    + (listeningToday.count ?? 0) + (readingToday.count ?? 0);

    return res.json({
      users: {
        total,
        newToday:    usersToday.count  ?? 0,
        newThisWeek: usersWeek.count   ?? 0,
        activeToday: sessToday,
      },
      revenue: {
        proUsers:       pro,
        eliteUsers:     elite,
        mrr:            pro * 24 + elite * 120,
        conversionRate: total > 0 ? ((paid / total) * 100).toFixed(1) + '%' : '0%',
      },
      sessions: {
        today:     sessToday,
        writing:   writingToday.count   ?? 0,
        speaking:  speakingToday.count  ?? 0,
        listening: listeningToday.count ?? 0,
        reading:   readingToday.count   ?? 0,
      },
      content: {
        libraryTotal:  libraryTotal.count ?? 0,
        generatedToday: (libraryToday.count ?? 0) > 0,
        libraryToday:  libraryToday.count ?? 0,
      },
    });
  } catch (err) {
    console.error('[admin/stats] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
