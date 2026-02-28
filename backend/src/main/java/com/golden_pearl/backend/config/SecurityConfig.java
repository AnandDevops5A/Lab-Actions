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

import com.golden_pearl.backend.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

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
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers(
                                "/actuator/health",
                                "/users/register",
                                "/users/verify",
                                "/users/updatePassword",
                                "/users/confirm-reset",
                                "/review/all",
                                "/review/user/**",
                                "/review/test",
                                "/users/test"
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/tournament/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/leaderboard/**").permitAll()

                        // Admin-only endpoints
                        .requestMatchers(
                                "/admin/**",
                                "/tournament/add",
                                "/tournament/delete/**",
                                "/tournament/update",
                                "/tournament/saveAll",
                                "/leaderboard/approve/**",
                                "/leaderboard/update/**",
                                "/leaderboard/updateRank",
                                "/leaderboard/updateScore/**",
                                "/review/admin-reply"
                        ).hasRole("ADMIN")

                        // Everything else requires a valid token
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
