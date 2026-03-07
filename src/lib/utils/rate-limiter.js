/**
 * Rate Limiter using localStorage
 * Works independently of React Context
 */

const RATE_LIMIT_STORAGE_KEY = "api_rate_limits";

const DEFAULT_RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000, // 1 minute
};

const ENDPOINT_RATE_LIMITS = {
  "users/all": { maxRequests: 5, windowMs: 60000 },
  "tournament/all": { maxRequests: 5, windowMs: 60000 },
  "leaderboard/all": { maxRequests: 5, windowMs: 60000 },
};

// Authentication endpoints that should NOT be rate limited
const AUTH_ENDPOINTS = [
  "users/verify",      // Login
  "users/register",    // Registration
  "users/resetPassword", // Password reset
  "users/confirm-reset" // Confirm password reset
];

/**
 * Check if a request is rate limited
 * Returns { allowed: boolean, remaining: number, resetTime: number, retryAfter: number }
 */
export const checkRateLimit = (endpoint, customLimit = null) => {
  if (typeof window === "undefined") {
    return { allowed: true, remaining: Infinity, resetTime: 0, retryAfter: 0 };
  }

  // Skip rate limiting for authentication endpoints
  if (AUTH_ENDPOINTS.includes(endpoint)) {
    return { allowed: true, remaining: Infinity, resetTime: 0, retryAfter: 0 };
  }

  const limit = customLimit || ENDPOINT_RATE_LIMITS[endpoint] || DEFAULT_RATE_LIMIT;
  const now = Date.now();
  const key = `${RATE_LIMIT_STORAGE_KEY}:${endpoint}`;

  try {
    let rateLimitData = JSON.parse(localStorage.getItem(key)) || {
      timestamps: [],
      windowStart: now,
    };

    // Reset window if expired
    if (now - rateLimitData.windowStart > limit.windowMs) {
      rateLimitData = {
        timestamps: [],
        windowStart: now,
      };
    }

    // Remove old timestamps outside the window
    rateLimitData.timestamps = rateLimitData.timestamps.filter(
      (timestamp) => now - timestamp < limit.windowMs
    );

    const isAllowed = rateLimitData.timestamps.length < limit.maxRequests;
    const remaining = Math.max(0, limit.maxRequests - rateLimitData.timestamps.length);

    if (isAllowed) {
      rateLimitData.timestamps.push(now);
      localStorage.setItem(key, JSON.stringify(rateLimitData));
    }

    const resetTime = rateLimitData.windowStart + limit.windowMs;

    return {
      allowed: isAllowed,
      remaining,
      resetTime,
      retryAfter: isAllowed ? 0 : resetTime - now,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    return { allowed: true, remaining: Infinity, resetTime: 0, retryAfter: 0 };
  }
};

/**
 * Clear rate limit data for an endpoint
 */
export const clearRateLimit = (endpoint = null) => {
  if (typeof window === "undefined") return;

  try {
    if (endpoint) {
      const key = `${RATE_LIMIT_STORAGE_KEY}:${endpoint}`;
      localStorage.removeItem(key);
    } else {
      // Clear all rate limit keys
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(RATE_LIMIT_STORAGE_KEY)) {
          localStorage.removeItem(key);
        }
      });
    }
  } catch (error) {
    console.error("Failed to clear rate limit:", error);
  }
};

/**
 * Get rate limit config for an endpoint
 */
export const getRateLimitConfig = (endpoint) => {
  return ENDPOINT_RATE_LIMITS[endpoint] || DEFAULT_RATE_LIMIT;
};

export { ENDPOINT_RATE_LIMITS, DEFAULT_RATE_LIMIT };
