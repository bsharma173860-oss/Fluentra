import { Redis } from '@upstash/redis'
import { createClient } from '@supabase/supabase-js'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const LIMITS = {
  free: {
    writing: 1,
    listening: 1,
    reading: 1,
    speaking: 1,
    tutor_messages: 10,
  },
  pro: {
    writing: 5,
    listening: 5,
    reading: 5,
    speaking: 5,
    tutor_messages: 999,
  },
  elite: {
    writing: 999,
    listening: 999,
    reading: 999,
    speaking: 999,
    tutor_messages: 999,
  },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, module } = req.body

  if (!userId || !module) {
    return res.status(400).json({ error: 'Missing userId or module' })
  }

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', userId)
      .single()

    const plan = profile?.subscription_tier || 'free'
    const limits = LIMITS[plan] || LIMITS.free
    const limit = limits[module] || 1

    const today = new Date().toISOString().split('T')[0]
    const key = `usage:${userId}:${module}:${today}`
    const usage = await redis.get(key) || 0

    const allowed = Number(usage) < limit
    const remaining = Math.max(0, limit - Number(usage))

    return res.json({
      allowed,
      usage: Number(usage),
      limit,
      remaining,
      plan,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
