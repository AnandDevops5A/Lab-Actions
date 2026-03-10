package com.golden_pearl.backend.Controller;

import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;

import java.time.Duration;

@Configuration
@EnableCaching
public class RedisConfig {
    @Bean
    public RedisCacheConfiguration cacheConfiguration() {
        return RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofMinutes(60))
                .serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(new GenericJackson2JsonRedisSerializer()));
    }

    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        int defaultTtlMinutes = 10; // Default TTL for all caches in minutes
        return (builder) -> builder
                .withCacheConfiguration("user",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("users",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("leaderboard",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("topNLeaderboard",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("tournaments",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("tournamentsIds", // This line was a duplicate of "tournaments"
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("upcomingTournaments",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(20)))
                .withCacheConfiguration("tournament",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("completedTournaments",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("lastTournament",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("tournamentsByIds",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("nextTournament",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("reviews",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("userReviews",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("adminData",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("userTournaments",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("userTournamentsDetails",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("allLeaderboards",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("leaderboardByIds",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)))
                .withCacheConfiguration("usersByIds",
                        cacheConfiguration().entryTtl(Duration.ofMinutes(defaultTtlMinutes)));
    }
}