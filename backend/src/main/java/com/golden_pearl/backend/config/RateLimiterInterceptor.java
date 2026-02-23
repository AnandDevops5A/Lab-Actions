package com.golden_pearl.backend.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class RateLimiterInterceptor implements HandlerInterceptor {

    private final RateLimiterService rateLimiterService;

    public RateLimiterInterceptor(RateLimiterService rateLimiterService) {
        this.rateLimiterService = rateLimiterService;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)
            throws Exception {
        String ip = request.getRemoteAddr();
        String path = request.getRequestURI();

        // Define which endpoint this limit applies to for tracking
        String endpoint = "api";
        if (path.contains("verify"))
            endpoint = "login";
        if (path.contains("register"))
            endpoint = "register";
        if (path.contains("updatePassword"))
            endpoint = "forgot_password";
        if (path.contains("confirm-reset"))
            endpoint = "reset_password";

        if (!rateLimiterService.isAllowed(ip, endpoint)) {
            response.setStatus(429); // Too Many Requests
            response.getWriter().write("Too many requests. Please try again in 5 minutes.");
            return false;
        }

        return true;
    }
}
