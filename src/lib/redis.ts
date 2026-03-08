import { Redis } from "@upstash/redis"

let redis: Redis | null = null
let redisAvailable = true

function getRedis(): Redis | null {
  if (!redisAvailable) return null

  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL
    const token = process.env.UPSTASH_REDIS_REST_TOKEN

    if (!url || !token) {
      redisAvailable = false
      return null
    }

    try {
      redis = new Redis({ url, token })
    } catch {
      redisAvailable = false
      return null
    }
  }
  return redis
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const r = getRedis()
  if (!r) return fetcher()

  try {
    const cached = await r.get<T>(key)
    if (cached !== null) return cached

    const fresh = await fetcher()
    await r.set(key, JSON.stringify(fresh), { ex: ttlSeconds })
    return fresh
  } catch {
    return fetcher()
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  const r = getRedis()
  if (!r) return

  try {
    const keys = await r.keys(pattern)
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => r.del(key)))
    }
  } catch {
    // Silently fail
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
  const r = getRedis()
  if (!r) return

  try {
    await r.set(key, JSON.stringify(value), { ex: ttlSeconds })
  } catch {
    // Silently fail
  }
}

export function isRedisConfigured(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}
