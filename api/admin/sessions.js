/**
 * GET /api/admin/sessions
 * Returns recent sessions across all modules with user info.
 *
 * Query params:
 *   module  — 'writing' | 'speaking' | 'listening' | 'reading' (optional)
 *   page    — 0-based (default 0)
 *   limit   — per page (default 50, max 100)
 *
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

async function fetchModule(table, module, limit) {
  const { data, error } = await supabase
    .from(table)
    .select('id, user_id, language_code, created_at, overall_band, band, time_taken_sec, duration_sec')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) { console.warn(`[admin/sessions] ${table} error:`, error.message); return []; }
  return (data ?? []).map(r => ({
    id:           r.id,
    userId:       r.user_id,
    module,
    languageCode: r.language_code,
    score:        r.overall_band ?? r.band ?? null,
    durationSec:  r.time_taken_sec ?? r.duration_sec ?? null,
    createdAt:    r.created_at,
  }));
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAuth(req, res)) return;

  const {
    module = '',
    page   = '0',
    limit  = '50',
  } = req.query;

  const pageNum  = Math.max(0, parseInt(page, 10) || 0);
  const limitNum = Math.min(100, parseInt(limit, 10) || 50);

  try {
    // Fetch from selected or all modules
    const modules = module
      ? [module]
      : ['writing', 'speaking', 'listening', 'reading'];

    const tableMap = {
      writing:   'writing_attempts',
      speaking:  'speaking_sessions',
      listening: 'listening_attempts',
      reading:   'reading_attempts',
    };

    const todayISO = `${new Date().toISOString().split('T')[0]}T00:00:00Z`;

    const results = await Promise.all(
      modules.map(m => fetchModule(tableMap[m], m, limitNum))
    );

    // Merge + sort by date
    let allSessions = results.flat().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Count today's sessions (before pagination)
    const sessionsToday = allSessions.filter(s => s.createdAt >= todayISO).length;

    // Paginate
    const paginated = allSessions.slice(pageNum * limitNum, (pageNum + 1) * limitNum);

    // Enrich with user email/name from profiles
    const userIds = [...new Set(paginated.map(s => s.userId))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, display_name, email')
      .in('id', userIds);

    const profileMap = {};
    (profiles ?? []).forEach(p => { profileMap[p.id] = p; });

    const sessions = paginated.map(s => ({
      ...s,
      userName:  profileMap[s.userId]?.display_name ?? 'Unknown',
      userEmail: profileMap[s.userId]?.email ?? '',
    }));

    return res.json({
      sessions,
      sessionsToday,
      total:  allSessions.length,
      page:   pageNum,
      limit:  limitNum,
    });
  } catch (err) {
    console.error('[admin/sessions] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
