export interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 300 = 5 minutes)
}

/**
 * Get a cached value or fetch and set it if not present.
 */
export async function getOrSetCache<T>(key: string, fetcher: () => Promise<T>, options: CacheOptions = {}): Promise<T> {
  const storage = useStorage<any>();
  const { ttl = 300 } = options;

  // Try to get from storage
  const cached = await storage.getItem<T>(key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store with TTL
  await storage.setItem(key, data, {
    ttl: ttl * 1000, // unstorage expects milliseconds
  });

  return data;
}

/**
 * Invalidate a specific cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  const storage = useStorage();
  await storage.removeItem(key);
}

/**
 * Invalidate keys matching a pattern
 * Works only with storages that support `getKeys()`
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const storage = useStorage();
  const keys = await storage.getKeys();

  const regex = new RegExp(pattern.replace(/\*/g, ".*"));

  for (const key of keys) {
    if (regex.test(key)) {
      await storage.removeItem(key);
    }
  }
}

/**
 * Clear the entire cache
 */
export async function clearCache(): Promise<void> {
  const storage = useStorage();
  await storage.clear();
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  properties: (filters: any) => `properties:${JSON.stringify(filters)}`,
  property: (id: string) => `property:${id}`,
  user: (id: string) => `user:${id}`,
  userProperties: (userId: string) => `user:${userId}:properties`,
  dashboardStats: () => "dashboard:stats",
  recentProperties: () => "properties:recent",
} as const;
