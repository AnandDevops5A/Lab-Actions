package com.golden_pearl.backend.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey signingKey;
    private final String issuer;
    private final Duration ttl;

    public JwtService(
            @Value("${JWT_SECRET:}") String jwtSecret,
            @Value("${JWT_ISSUER:golden-pearl}") String issuer,
            @Value("${JWT_TTL_SECONDS:86400}") long ttlSeconds
    ) {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be set (env var).");
        }
        // JJWT HMAC requires sufficiently long keys (32+ bytes is a safe baseline).
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
            throw new IllegalStateException("JWT_SECRET is too short. Use at least 32+ characters (recommended: 64).");
        }
        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
        this.ttl = Duration.ofSeconds(ttlSeconds);
    }

    public String createToken(User user, boolean isAdmin) {
        Instant now = Instant.now();
        Instant exp = now.plus(ttl);

        return Jwts.builder()
                .issuer(issuer)
                .subject(user.getId())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claims(Map.of(
                        "contact", user.getContact(),
                        "admin", isAdmin
                ))
                .signWith(signingKey)
                .compact();
    }

    public Claims parseAndValidate(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .requireIssuer(issuer)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}

