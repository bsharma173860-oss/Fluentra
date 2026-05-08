/**
 * GET /api/library
 * Fetch library content with optional filters and pagination.
 *
 * Query params:
 *   code   — language_code filter (optional)
 *   type   — content_type filter: writing_prompt|reading|listening|vocab|grammar|speaking (optional)
 *   page   — 0-based page number (default 0)
 *   limit  — items per page (default 20, max 50)
 *
 * Returns: { items: LibraryRow[], page: number, limit: number }
 */
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const VALID_TYPES = new Set([
  'writing_prompt', 'reading', 'listening', 'vocab', 'grammar', 'speaking',
]);

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const {
    code,
    type,
    page  = '0',
    limit = '20',
  } = req.query;

  const pageNum  = Math.max(0, parseInt(page, 10)  || 0);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));

  if (type && !VALID_TYPES.has(type)) {
    return res.status(400).json({ error: `Invalid type. Must be one of: ${[...VALID_TYPES].join(', ')}` });
  }

  let query = supabase
    .from('library')
    .select('id, language_code, exam_type, content_type, title, difficulty, date, created_at')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })
    .range(pageNum * limitNum, pageNum * limitNum + limitNum - 1);

  if (code) query = query.eq('language_code', code);
  if (type) query = query.eq('content_type', type);

  const { data, error } = await query;

  if (error) {
    console.error('[library] query error:', error.message);
    return res.status(500).json({ error: error.message });
  }

  return res.json({
    items: data ?? [],
    page:  pageNum,
    limit: limitNum,
  });
}
