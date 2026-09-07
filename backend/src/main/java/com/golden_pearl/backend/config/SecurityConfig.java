package com.golden_pearl.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.golden_pearl.backend.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
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
                .csrf(csrf -> csrf.disable())
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
                        // Public endpoints
                        .requestMatchers(
                                "/api/actuator/health",
                                "/api/users/register",
                                "/api/users/verify",
                                "/api/users/updatePassword",
                                "/api/users/confirm-reset",
                                "/api/review/all",
                                "/api/review/user/**",
                                "/api/tournament/next",
                                "/api/review/test",
                                "/api/users/test",
                                "/api/tournament/upcoming")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/tournament/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/leaderboard/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/leaderboard/getJoiners").permitAll()

                        // Admin-only endpoints
                        .requestMatchers(
                                "/api/admin/data",
                                "/api/admin/data/stream",
                                "/api/tournament/add",
                                "/api/tournament/delete/**",
                                "/api/tournament/update",
                                "/api/tournament/saveAll",
                                "/api/leaderboard/approve/**",
                                "/api/leaderboard/update/**",
                                "/api/leaderboard/updateRank",
                                "/api/leaderboard/updateScore/**",
                                "/api/review/admin-reply")
                        .hasRole("ADMIN")

                        // Everything else requires a valid token
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
