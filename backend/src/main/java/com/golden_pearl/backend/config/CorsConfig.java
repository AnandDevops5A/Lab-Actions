package com.golden_pearl.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Value("${frontend.urls:${FRONTEND_URL:http://localhost:3000,http://127.0.0.1:3000}}")
    private String frontendUrls;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                String configuredOrigins = frontendUrls == null || frontendUrls.isBlank()
                        ? "http://localhost:3000,http://127.0.0.1:3000"
                        : frontendUrls;
                registry.addMapping("/**")
                    .allowedOrigins(Arrays.stream(configuredOrigins.split(","))
                        .map(String::trim)
                        .filter(origin -> !origin.isEmpty())
                        .toArray(String[]::new))
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true)
                        .maxAge(3600);
            }
        };
    }
}