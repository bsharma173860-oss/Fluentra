const express = require('express')
const router = express.Router()
const supabase = require('../lib/supabase')
const redis = require('../lib/redis')

// Simple admin auth middleware
const adminAuth = (req, res, next) => {
  const key = req.headers['x-admin-key']
  if (key !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// Dashboard stats
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [
      { count: totalUsers },
      { count: totalSessions },
      { count: proUsers },
      { count: todaySessions },
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('sessions').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('subscription_tier', 'pro'),
      supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('started_at', new Date().toISOString().split('T')[0]),
    ])

    return res.json({
      totalUsers,
      totalSessions,
      proUsers,
      todaySessions,
      freeUsers: totalUsers - proUsers,
      conversionRate: totalUsers > 0
        ? ((proUsers / totalUsers) * 100).toFixed(1) + '%'
        : '0%',
    })
  } catch (err) {
    console.error('Stats error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// All users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { data: users } = await supabase
      .from('profiles')
      .select('id, name, email, subscription_tier, created_at')
      .order('created_at', { ascending: false })
      .limit(100)

    return res.json({ users })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
})

// Recent sessions
router.get('/sessions', adminAuth, async (req, res) => {
  try {
    const { data: sessions } = await supabase
      .from('sessions')
      .select('id, mode, language_code, overall_band, started_at, profiles(name, email)')
      .order('started_at', { ascending: false })
      .limit(50)

    return res.json({ sessions })
  } catch (err) {
    return res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
