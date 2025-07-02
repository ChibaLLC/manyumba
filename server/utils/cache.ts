import Redis from 'ioredis';

// Redis client setup with fallback to in-memory cache
let redis: Redis | null = null;
const memoryCache = new Map<string, { data: any; expiry: number }>();

// Initialize Redis connection
try {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0'),
    retryDelayOnFailover: 100,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });

  // Test connection
  redis.on('error', (err) => {
    console.warn('Redis connection failed, falling back to memory cache:', err.message);
    redis = null;
  });
} catch (error) {
  console.warn('Redis initialization failed, using memory cache:', error);
  redis = null;
}

export interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 300 = 5 minutes)
}

export async function getOrSetCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 300 } = options;
  
  try {
    if (redis) {
      // Try Redis first
      const cached = await redis.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
      
      // Fetch fresh data
      const data = await fetcher();
      
      // Cache in Redis with TTL
      await redis.setex(key, ttl, JSON.stringify(data));
      
      return data;
    }
  } catch (error) {
    console.warn('Redis operation failed, falling back to memory cache:', error);
  }
  
  // Fallback to memory cache
  const now = Date.now();
  const cached = memoryCache.get(key);
  if (cached && cached.expiry > now) {
    return cached.data;
  }
  
  // Fetch fresh data
  const data = await fetcher();
  
  // Cache in memory with expiry
  memoryCache.set(key, {
    data,
    expiry: now + (ttl * 1000)
  });
  
  return data;
}

export async function invalidateCache(key: string): Promise<void> {
  try {
    if (redis) {
      await redis.del(key);
    }
  } catch (error) {
    console.warn('Redis delete failed:', error);
  }
  
  // Also clear from memory cache
  memoryCache.delete(key);
}

export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    if (redis) {
      const keys = await redis.keys(pattern);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    }
  } catch (error) {
    console.warn('Redis pattern delete failed:', error);
  }
  
  // Also clear from memory cache
  const regex = new RegExp(pattern.replace(/\*/g, '.*'));
  for (const [key] of memoryCache) {
    if (regex.test(key)) {
      memoryCache.delete(key);
    }
  }
}

export async function clearCache(): Promise<void> {
  try {
    if (redis) {
      await redis.flushdb();
    }
  } catch (error) {
    console.warn('Redis flush failed:', error);
  }
  
  // Also clear memory cache
  memoryCache.clear();
}

// Cache key generators
export const cacheKeys = {
  properties: (filters: any) => `properties:${JSON.stringify(filters)}`,
  property: (id: string) => `property:${id}`,
  user: (id: string) => `user:${id}`,
  userProperties: (userId: string) => `user:${userId}:properties`,
  dashboardStats: () => 'dashboard:stats',
  recentProperties: () => 'properties:recent',
} as const;
