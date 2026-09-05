package com.golden_pearl.backend.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
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
    private String cookieName;
    private long jwtExpirationMs;
    private boolean cookieSecure;
    private String cookieSameSite;

    public JwtService(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.issuer:golden-pearl}") String issuer,
            @Value("${jwt.ttl.seconds:86400}") long ttlSeconds,
            @Value("${app.jwt.cookie-name:authToken}") String cookieName,
            @Value("${app.jwt.expiration-ms:604800000}") long jwtExpirationMs,
            @Value("${app.jwt.cookie-secure:false}") boolean cookieSecure,
            @Value("${app.jwt.cookie-same-site:Lax}") String cookieSameSite) {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be set (properties/env).");
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
                        "contact", user.getPhoneNumber(),
                        "admin", isAdmin))
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

    public ResponseCookie generateJwtCookie(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("Token cannot be null or empty");
        }
        return ResponseCookie.from(cookieName, token)
                .path("/")
                .maxAge(jwtExpirationMs / 1000)
                .httpOnly(true)
                .secure(cookieSecure)
                .sameSite(cookieSameSite)
                .build();
    }
}
