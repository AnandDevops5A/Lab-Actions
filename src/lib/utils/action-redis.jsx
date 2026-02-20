/**
 * Redis cache utility (Server-only)
 * This file ONLY works on Node.js servers (API routes, server components)
 * NEVER import this in client components!
 * For client components, use client-cache.js instead
 */

'use server'

let Redis = null;
let redisClient = null;

const initRedis = async () => {
  if (redisClient) return redisClient;
  
  try {
    if (!Redis) {
      Redis = (await import("ioredis")).default;
    }
    
    const options = {
      connectTimeout: 10000,
      retryStrategy: (times) => Math.min(times * 50, 2000),
    };

    if (process.env.REDIS_URL) {
      redisClient = new Redis(process.env.REDIS_URL, options);
    } else {
      redisClient = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: process.env.REDIS_PORT || 6379,
        ...options,
      });
    }
    
    return redisClient;
  } catch (error) {
    console.error("Failed to initialize Redis:", error);
    return null;
  }
};

/**
 * Get Redis client instance (for direct access in server-only code)
 * Only use this in API routes and server actions
 */
export const getRedisClientInstance = async () => {
  return await initRedis();
};

export { initRedis };

/**
 * Set cache with TTL (Time To Live) - SERVER ONLY
 */
export const setCache = async (key, value, ttl = 3600) => {
  try {
    const client = await initRedis();
    if (!client) {
      return { status: false, error: "Redis connection unavailable" };
    }
    await client.set(key, JSON.stringify(value), "EX", ttl);
    return { status: true };
  } catch (error) {
    console.error("Error setting cache:", error.message);
    return { status: false, error: error.message };
  }
};

/**
 * Update existing cache key (only if exists)
 * @param {string} key - Cache key
 * @param {*} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 */
export const UpdateCache = async (key, value, ttl = 3600) => {
  try {
    const client = await initRedis();
    if (!client) {
      return { status: false, error: "Redis connection unavailable" };
    }
    await client.set(key, JSON.stringify(value), "EX", ttl, "XX");
    return { status: true };
  } catch (error) {
    console.error("Error updating cache:", error.message);
    return { status: false, error: error.message };
  }
};

/**
 * Get value from cache
 * @param {string} key - Cache key
 */
export const getCache = async (key) => {
  try {
    const client = await initRedis();
    if (!client) {
      return { status: false, error: "Redis connection unavailable" };
    }
    const data = await client.get(key);
    if (!data) {
      return { status: false, error: "Cache miss" };
    }
    const parsedData = JSON.parse(data);
    return { data: parsedData, status: true };
  } catch (error) {
    console.error("Error getting cache:", error.message);
    return { status: false, error: error.message };
  }
};

/**
 * Delete cache key
 * @param {string} key - Cache key
 */
export const deleteCache = async (key) => {
  try {
    const client = await initRedis();
    if (!client) {
      return { status: false, error: "Redis connection unavailable" };
    }
    await client.del(key);
    return { status: true };
  } catch (error) {
    console.error("Error deleting cache:", error.message);
    return { status: false, error: error.message };
  }
};
