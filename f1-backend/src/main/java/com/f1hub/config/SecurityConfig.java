package com.f1hub.config;

import com.f1hub.JwtAuthenticationFilter.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.*;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authorizeHttpRequests(auth -> auth

                // 🔓 ROOT URL
.requestMatchers("/").permitAll()

                // 🔓 AUTH
                .requestMatchers("/api/auth/**").permitAll()

                // 🔓 STATIC FILES
                .requestMatchers("/uploads/**").permitAll()

                // 🔓 PUBLIC DASHBOARD APIs
                .requestMatchers(
                    "/api/schedule/**",
                    "/api/teams/**",
                    "/api/drivers/**",
                    "/api/news/**",
                    "/api/team-stats/**",
                    "/api/tickets/**",  // Public ticket viewing
                    "/api/test-tickets/**"  // Test endpoint
                ).permitAll()

                // 🔐 ADMIN APIs (require authentication)
                .requestMatchers("/api/admin/**").authenticated()

                // 🔐 BOOKING APIs (require USER or ADMIN role)
                .requestMatchers("/api/bookings/**")
                .hasAnyRole("USER", "ADMIN")

                // 🔐 EVERYTHING ELSE NEEDS TOKEN
                .anyRequest().authenticated()
            )

            // 🔐 JWT FILTER
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    // ✅ CORS CONFIG
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS","PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
