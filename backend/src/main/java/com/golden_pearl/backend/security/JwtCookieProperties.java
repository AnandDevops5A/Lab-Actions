package com.golden_pearl.backend.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.util.Set;

/**
 * Binds all app.jwt.* properties in one place instead of scattering
 * @Value params across constructors. Spring validates this at startup
 * (fails fast with a clear message) instead of surfacing bad config as
 * a runtime NPE somewhere downstream.
 */
@Validated
@ConfigurationProperties(prefix = "app.jwt")
public class JwtCookieProperties {

    private static final Set<String> VALID_SAME_SITE = Set.of("Strict", "Lax", "None");

    @NotBlank
    private String cookieName = "authToken";

    @Positive
    private long expirationMs = 604_800_000L; // 7 days

    private boolean cookieSecure = false;

    @NotBlank
    private String cookieSameSite = "Lax";

    public String getCookieName() {
        return cookieName;
    }

    public void setCookieName(String cookieName) {
        this.cookieName = cookieName;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public boolean isCookieSecure() {
        return cookieSecure;
    }

    public void setCookieSecure(boolean cookieSecure) {
        this.cookieSecure = cookieSecure;
    }

    public String getCookieSameSite() {
        return cookieSameSite;
    }

    public void setCookieSameSite(String cookieSameSite) {
        if (!VALID_SAME_SITE.contains(cookieSameSite)) {
            throw new IllegalArgumentException(
                    "app.jwt.cookie-same-site must be one of " + VALID_SAME_SITE + " but was: " + cookieSameSite);
        }
        this.cookieSameSite = cookieSameSite;
    }
}