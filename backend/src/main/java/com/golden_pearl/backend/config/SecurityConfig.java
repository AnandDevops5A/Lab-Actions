package com.golden_pearl.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.golden_pearl.backend.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize("hasRole('ADMIN')") annotations on Controllers
public class SecurityConfig {

    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Modern lambda syntax for disabling CSRF
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) -> {
                            log.warn("401 Unauthorized: {} {}", request.getMethod(), request.getRequestURI());
                            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Authentication required");
                        })
                        .accessDeniedHandler((request, response, exception) -> {
                            log.warn("403 Forbidden: {} {}", request.getMethod(), request.getRequestURI());
                            response.sendError(HttpStatus.FORBIDDEN.value(), "Access denied");
                        }))

                .authorizeHttpRequests(auth -> auth
                        // 1. Always permit browser CORS preflight requests
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // 2. Strict Admin-only Endpoints FIRST (Most specific rules must come first)
                        .requestMatchers(
                                "/api/admin/**",
                                "/api/tournament/add",
                                "/api/tournament/delete/**",
                                "/api/tournament/update",
                                "/api/tournament/saveAll",
                                "/api/leaderboard/approve/**",
                                "/api/leaderboard/update/**",
                                "/api/leaderboard/updateRank",
                                "/api/leaderboard/updateScore/**",
                                "/api/review/admin-reply"
                        ).hasRole("ADMIN")

                        // 3. Public Endpoints
                        .requestMatchers(
                                "/api/actuator/health",
                                "/api/users/register",
                                "/api/users/verify",
                                "/api/users/updatePassword",
                                "/api/users/confirm-reset",
                                "/api/users/test",
                                "/api/review/all",
                                "/api/review/user/**",
                                "/api/review/test"
                        ).permitAll()

                        // 4. Public Read-Only GET Endpoints
                        .requestMatchers(HttpMethod.GET, "/api/tournament/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/leaderboard/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/leaderboard/getJoiners").permitAll()

                        // 5. Require Authentication for Everything Else
                        .anyRequest().authenticated())

                // Add JWT filter before UsernamePasswordAuthenticationFilter
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}