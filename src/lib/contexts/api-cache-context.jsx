'use client';
import React, { createContext, useState, useCallback, useMemo, useEffect } from "react";

// Create Context
export const APICacheContext = createContext();

const CACHE_STORAGE_KEY = "api_cache";

/**
 * APICacheProvider - Manages API response caching
 * Uses React Context for caching (in-memory) and localStorage for persistence
 * Rate limiting is handled separately by rate-limiter.js utility
 */
export const APICacheProvider = ({ children }) => {
  const [apiCache, setApiCache] = useState(new Map());
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize cache from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedCache = localStorage.getItem(CACHE_STORAGE_KEY);
        if (storedCache) {
          const parsedCache = JSON.parse(storedCache);
          setApiCache(new Map(Object.entries(parsedCache)));
        }
      } catch (error) {
        console.error("Failed to initialize cache from localStorage:", error);
      }
      setIsInitialized(true);
    }
  }, []);

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      try {
        const cacheObj = Object.fromEntries(apiCache);
        localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheObj));
      } catch (error) {
        console.error("Failed to save cache to localStorage:", error);
      }
    }
  }, [apiCache, isInitialized]);

  /**
   * Get cached value by key
   */
  const getCache = useCallback((cacheKey) => {
    const cached = apiCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }
    // Remove expired cache
    if (cached) {
      setApiCache((prev) => {
        const updated = new Map(prev);
        updated.delete(cacheKey);
        return updated;
      });
    }
    return null;
  }, [apiCache]);

  /**
   * Set cache value with TTL
   */
  const setCache = useCallback((cacheKey, data, ttl = 300000) => {
    // 5 minutes default TTL
    setApiCache((prev) => {
      const updated = new Map(prev);
      updated.set(cacheKey, {
        data,
        expiresAt: Date.now() + ttl,
      });
      return updated;
    });
  }, []);

  /**
   * Clear specific cache or all cache
   */
  const clearCache = useCallback((cacheKey = null) => {
    if (cacheKey) {
      setApiCache((prev) => {
        const updated = new Map(prev);
        updated.delete(cacheKey);
        return updated;
      });
    } else {
      setApiCache(new Map());
    }
  }, []);

  /**
   * Clear all cache (useful on logout)
   */
  const clearAll = useCallback(() => {
    clearCache();
  }, [clearCache]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    getCache,
    setCache,
    clearCache,
    clearAll,
    isInitialized,
  }), [getCache, setCache, clearCache, clearAll, isInitialized]);

  return (
    <APICacheContext.Provider value={contextValue}>
      {children}
    </APICacheContext.Provider>
  );
};
