"use server";

import Redis from "ioredis";

/**
 * Redis Cache Implementation
 * Combined file: Connection + Actions + Utility
 */

// Singleton pattern to prevent multiple Redis connections in development
const globalForRedis = global;

if (!globalForRedis.redis) {
  globalForRedis.redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379");
}

const redis = globalForRedis.redis;

/**
 * Get value from Redis cache
 */
export const getCache = async (key) => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Redis Get Error (${key}):`, error);
    return null;
  }
};

/**
 * Set value in Redis cache with TTL
 */
export const setCache = async (key, value, ttl = 3600) => {
  try {
    const stringValue = JSON.stringify(value);
    if (ttl) {
      await redis.set(key, stringValue, "EX", ttl);
    } else {
      await redis.set(key, stringValue);
    }
    return { status: true };
  } catch (error) {
    console.error(`Redis Set Error (${key}):`, error);
    return { status: false };
  }
};

/**
 * Update value in Redis cache with TTL
 */
export const updateCache = async (key, value, options = {}) => {
  const { 
    ttl = null, 
    keepExistingTTL = false, 
    onlyIfExists = false 
  } = options;

  try {
    const serialized = JSON.stringify(value);
    
    let args = [key, serialized];

    // logic: Update only if it exists?
    if (onlyIfExists) args.push("XX");

    // logic: Handle TTL strategy
    if (keepExistingTTL) {
      args.push("KEEPTTL");
    } else if (ttl) {
      args.push("EX", ttl);
    }

    const result = await redis.set(...args);
    
    // Redis returns "OK" if successful, or null if "XX" condition failed
    return { status: result === "OK" };
  } catch (error) {
    console.error(`[Cache Update Failed] ${key}:`, error);
    return { status: false };
  }
};

/**
 * Delete value from Redis cache
 */
export const deleteCache = async (key) => {
  try {
    await redis.del(key);
    return { status: true };
  } catch (error) {
    console.error(`Redis Delete Error (${key}):`, error);
    return { status: false };
  }
};
