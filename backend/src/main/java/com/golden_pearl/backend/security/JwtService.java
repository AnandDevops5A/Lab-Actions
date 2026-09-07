package com.golden_pearl.backend.security;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.golden_pearl.backend.Models.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
@EnableConfigurationProperties(JwtCookieProperties.class)
public class JwtService {

    private static final Logger log = LoggerFactory.getLogger(JwtService.class);
    private static final int MIN_SECRET_BYTES = 32;

    private final SecretKey signingKey;
    private final String issuer;
    private final Duration ttl;
    private final JwtCookieProperties cookieProps;

    public JwtService(
            @Value("${jwt.secret}") String jwtSecret,
            @Value("${jwt.issuer:golden-pearl}") String issuer,
            @Value("${jwt.ttl.seconds:86400}") long ttlSeconds,
            JwtCookieProperties cookieProps) {

        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("JWT_SECRET must be set (properties/env).");
        }
        // JJWT HMAC requires sufficiently long keys (32+ bytes is a safe baseline).
        if (jwtSecret.getBytes(StandardCharsets.UTF_8).length < MIN_SECRET_BYTES) {
            throw new IllegalStateException(
                    "JWT_SECRET is too short. Use at least " + MIN_SECRET_BYTES + "+ characters (recommended: 64).");
        }

        this.signingKey = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        this.issuer = issuer;
        this.ttl = Duration.ofSeconds(ttlSeconds);
        this.cookieProps = cookieProps;

        // Token TTL and cookie maxAge are two separate config values that can
        // silently drift apart (cookie outlives token, or vice versa). Warn
        // loudly at startup instead of debugging it later via a support ticket.
        long cookieMaxAgeSeconds = cookieProps.getExpirationMs() / 1000;
        if (cookieMaxAgeSeconds != ttlSeconds) {
            log.warn("JWT ttl ({}s) and cookie maxAge ({}s) differ. This is usually unintentional — "
                    + "if the cookie outlives the token, the browser will keep sending an expired token; "
                    + "if it expires first, a still-valid token gets dropped early.",
                    ttlSeconds, cookieMaxAgeSeconds);
        }

        log.info("JwtService initialized: issuer={}, ttl={}s, cookieName={}, cookieSecure={}, sameSite={}",
                issuer, ttlSeconds, cookieProps.getCookieName(), cookieProps.isCookieSecure(),
                cookieProps.getCookieSameSite());
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
        return buildCookie(token, cookieProps.getExpirationMs() / 1000);
    }

    /** Cookie used to clear the JWT on logout — same name/flags, maxAge 0. */
    public ResponseCookie clearJwtCookie() {
        return buildCookie("", 0);
    }

    private ResponseCookie buildCookie(String value, long maxAgeSeconds) {
        return ResponseCookie.from(getCookieName(), value)
                .path("/")
                .maxAge(maxAgeSeconds)
                .httpOnly(true)
                .secure(cookieProps.isCookieSecure())
                .sameSite(cookieProps.getCookieSameSite())
                .build();
    }

    public String getCookieName() {
        if (cookieProps.getCookieName() == null || cookieProps.getCookieName().isBlank()) {
            return "authToken"; // default value if not set
        }
        return cookieProps.getCookieName();
    }
}