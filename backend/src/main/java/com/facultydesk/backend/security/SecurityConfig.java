package com.facultydesk.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
            // Disable CSRF because we are using JWT authentication
            .csrf(csrf -> csrf.disable())

            // Enable CORS
            .cors(cors ->
                cors.configurationSource(corsConfigurationSource())
            )

            // JWT authentication is stateless
            .sessionManagement(session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS
                )
            )

            .authorizeHttpRequests(auth -> auth

                // ==============================
                // AUTHENTICATION
                // ==============================

                .requestMatchers(
                    "/api/auth/register",
                    "/api/auth/login"
                ).permitAll()

                // ==============================
                // CORS PREFLIGHT
                // ==============================

                .requestMatchers(
                    HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // ==============================
                // TRANSPORT
                // ==============================

                .requestMatchers(
                    "/api/transport/**"
                ).permitAll()

                // ==============================
                // SEMINAR HALL
                // ==============================

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/seminar/halls"
                ).authenticated()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/seminar/bookings/**"
                ).authenticated()

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/seminar/bookings"
                ).authenticated()

                // ==============================
                // ACCOMMODATION ROOMS
                // ==============================

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/accommodation/rooms"
                ).authenticated()

                // ==============================
                // ACCOMMODATION REQUESTS
                // ==============================

                .requestMatchers(
                    HttpMethod.POST,
                    "/api/accommodation/requests"
                ).authenticated()

                .requestMatchers(
                    HttpMethod.GET,
                    "/api/accommodation/requests/**"
                ).authenticated()

                // ==============================
                // EVERYTHING ELSE
                // ==============================

                .anyRequest().authenticated()
            )

            // JWT filter
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }
}