import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  const key = req.headers['x-admin-key']
  if (key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const [
      { count: totalUsers },
      { count: totalSessions },
      { count: proUsers },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('sessions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro'),
    ])

    return res.json({
      totalUsers,
      totalSessions,
      proUsers,
      freeUsers: totalUsers - proUsers,
      conversionRate: totalUsers > 0
        ? ((proUsers / totalUsers) * 100).toFixed(1) + '%'
        : '0%',
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
