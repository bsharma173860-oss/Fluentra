import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { userId, module } = req.body

  if (!userId || !module) {
    return res.status(400).json({ error: 'Missing params' })
  }

  try {
    const today = new Date().toISOString().split('T')[0]
    const key = `usage:${userId}:${module}:${today}`

    await redis.incr(key)
    await redis.expire(key, 86400)

    return res.json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
