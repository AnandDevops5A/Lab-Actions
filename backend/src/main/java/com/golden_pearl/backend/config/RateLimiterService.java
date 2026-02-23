package com.golden_pearl.backend.config;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RateLimiterService {

    private final StringRedisTemplate redisTemplate;

    // Configurable limits
    private static final int MAX_ATTEMPTS = 5;
    private static final int BLOCK_DURATION_MINUTES = 5;

    public RateLimiterService(StringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    /**
     * Checks if the request from a specific IP to an endpoint is allowed.
     * 
     * @param ip       The user's IP address
     * @param endpoint The targeted endpoint (e.g., "login", "register")
     * @return true if allowed, false if rate-limited
     */
    public boolean isAllowed(String ip, String endpoint) {
        String key = "rate_limit:" + endpoint + ":" + ip;

        String countStr = redisTemplate.opsForValue().get(key);
        int count = countStr == null ? 0 : Integer.parseInt(countStr);

        if (count >= MAX_ATTEMPTS) {
            return false;
        }

        // Increment count
        redisTemplate.opsForValue().increment(key);

        // If it's the first attempt, set expiration
        if (count == 0) {
            redisTemplate.expire(key, BLOCK_DURATION_MINUTES, TimeUnit.MINUTES);
        }

        return true;
    }
}
