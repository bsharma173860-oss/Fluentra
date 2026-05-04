const express = require('express')
const router = express.Router()
const redis = require('../lib/redis')
const supabase = require('../lib/supabase')

const LIMITS = {
  free: {
    writing: 1,
    listening: 1,
    reading: 1,
    speaking_minutes: 10,
    tutor_messages: 10,
  },
  pro: {
    writing: 5,
    listening: 5,
    reading: 5,
    speaking_minutes: 60,
    tutor_messages: 999,
  },
  elite: {
    writing: 999,
    listening: 999,
    reading: 999,
    speaking_minutes: 999,
    tutor_messages: 999,
  },
}

// Check if user can use a module
router.post('/check', async (req, res) => {
  try {
    const { userId, module } = req.body

    if (!userId || !module) {
      return res.status(400).json({ error: 'Missing userId or module' })
    }

    // Get user plan from Supabase
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    const plan = profile?.subscription_tier || 'free'
    const limits = LIMITS[plan] || LIMITS.free
    const limit = limits[module] || 1

    // Get today's usage from Redis
    const today = new Date().toISOString().split('T')[0]
    const key = `usage:${userId}:${module}:${today}`
    const usage = await redis.get(key) || 0

    const allowed = usage < limit
    const remaining = Math.max(0, limit - usage)

    return res.json({
      allowed,
      usage: Number(usage),
      limit,
      remaining,
      plan,
      resetAt: 'midnight UTC',
    })
  } catch (err) {
    console.error('Rate check error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Increment usage after session
router.post('/increment', async (req, res) => {
  try {
    const { userId, module } = req.body

    if (!userId || !module) {
      return res.status(400).json({ error: 'Missing params' })
    }

    const today = new Date().toISOString().split('T')[0]
    const key = `usage:${userId}:${module}:${today}`

    await redis.incr(key)
    // Expire at end of day (86400 seconds)
    await redis.expire(key, 86400)

    return res.json({ success: true })
  } catch (err) {
    console.error('Increment error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

// Get all usage for a user today
router.get('/usage/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const today = new Date().toISOString().split('T')[0]

    const modules = [
      'writing',
      'listening',
      'reading',
      'speaking_minutes',
      'tutor_messages',
    ]

    const usage = {}
    for (const mod of modules) {
      const key = `usage:${userId}:${mod}:${today}`
      usage[mod] = Number(await redis.get(key) || 0)
    }

    // Get user plan
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    const plan = profile?.subscription_tier || 'free'
    const limits = LIMITS[plan]

    return res.json({ usage, limits, plan })
  } catch (err) {
    console.error('Usage error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
