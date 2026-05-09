/**
 * GET /api/admin/users
 * Returns paginated user list with session counts and streaks.
 *
 * Query params:
 *   page    — 0-based (default 0)
 *   limit   — per page (default 50, max 100)
 *   search  — filter by name/email substring
 *   plan    — 'free' | 'pro' | 'elite'
 *   sort    — 'joined' | 'active' | 'sessions' (default 'joined')
 *   order   — 'asc' | 'desc' (default 'desc')
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

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAuth(req, res)) return;

  const {
    page   = '0',
    limit  = '50',
    search = '',
    plan   = '',
    sort   = 'joined',
    order  = 'desc',
  } = req.query;

  const pageNum  = Math.max(0, parseInt(page, 10)  || 0);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));
  const asc      = order === 'asc';

  try {
    // 1. Fetch profiles
    let query = supabase
      .from('profiles')
      .select('id, display_name, email, subscription_tier, created_at, updated_at')
      .range(pageNum * limitNum, pageNum * limitNum + limitNum - 1);

    if (plan) query = query.eq('subscription_tier', plan);

    const sortCol = sort === 'active' ? 'updated_at' : 'created_at';
    query = query.order(sortCol, { ascending: asc });

    const { data: profiles, error: pErr, count } = await query;
    if (pErr) return res.status(500).json({ error: pErr.message });

    if (!profiles || profiles.length === 0) {
      return res.json({ users: [], total: 0, page: pageNum, limit: limitNum });
    }

    // Filter by search after fetch (Supabase free-tier doesn't support ilike on all plans)
    const filtered = search
      ? profiles.filter(p =>
          (p.display_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (p.email ?? '').toLowerCase().includes(search.toLowerCase())
        )
      : profiles;

    const userIds = filtered.map(p => p.id);

    // 2. Fetch writing session counts per user
    const { data: writingCounts } = await supabase
      .from('writing_attempts')
      .select('user_id')
      .in('user_id', userIds);

    // 3. Fetch streak data from user_languages (max streak per user)
    const { data: streakData } = await supabase
      .from('user_languages')
      .select('user_id, streak_count, language_code')
      .in('user_id', userIds);

    // Build maps
    const sessionCountMap = {};
    (writingCounts ?? []).forEach(r => {
      sessionCountMap[r.user_id] = (sessionCountMap[r.user_id] ?? 0) + 1;
    });

    const streakMap = {};
    const languageMap = {};
    (streakData ?? []).forEach(r => {
      if ((r.streak_count ?? 0) > (streakMap[r.user_id] ?? 0)) {
        streakMap[r.user_id] = r.streak_count ?? 0;
      }
      if (!languageMap[r.user_id]) languageMap[r.user_id] = [];
      languageMap[r.user_id].push(r.language_code);
    });

    const users = filtered.map(p => ({
      id:           p.id,
      name:         p.display_name ?? 'Unknown',
      email:        p.email ?? '',
      plan:         p.subscription_tier ?? 'free',
      joinedAt:     p.created_at,
      lastActive:   p.updated_at,
      sessions:     sessionCountMap[p.id] ?? 0,
      streak:       streakMap[p.id] ?? 0,
      languages:    languageMap[p.id] ?? [],
      languageCount: (languageMap[p.id] ?? []).length,
    }));

    return res.json({ users, total: count ?? filtered.length, page: pageNum, limit: limitNum });
  } catch (err) {
    console.error('[admin/users] error:', err);
    return res.status(500).json({ error: err.message });
  }
}
