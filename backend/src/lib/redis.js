const { Redis } = require('@upstash/redis')

let _redis = null

function getRedis() {
  if (!_redis) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error('UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN must be set')
    }
    _redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return _redis
}

// Proxy so callers can still do `redis.get(...)` without changing call sites
module.exports = new Proxy({}, {
  get(_, prop) {
    return (...args) => getRedis()[prop](...args)
  },
})
