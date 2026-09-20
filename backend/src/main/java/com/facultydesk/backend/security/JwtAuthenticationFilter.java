package com.facultydesk.backend.security;

import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.repository.FacultyRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final FacultyRepository facultyRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            FacultyRepository facultyRepository
    ) {
        this.jwtService = jwtService;
        this.facultyRepository = facultyRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println(
                "JWT FILTER: " +
                request.getMethod() +
                " " +
                request.getRequestURI()
        );

        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("JWT FILTER: No Bearer token");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            if (!jwtService.isTokenValid(token)) {

                System.out.println(
                        "JWT FILTER: Token is invalid"
                );

                filterChain.doFilter(request, response);
                return;
            }

            String email =
                    jwtService.extractEmail(token);

            System.out.println(
                    "JWT FILTER: Email = " + email
            );

            Faculty faculty =
                    facultyRepository
                            .findByEmail(email)
                            .orElse(null);

            if (faculty == null) {

                System.out.println(
                        "JWT FILTER: Faculty not found"
                );

                filterChain.doFilter(request, response);
                return;
            }

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() == null) {

                String role =
                        faculty.getRole();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                faculty,
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + role
                                        )
                                )
                        );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(
                                authentication
                        );

                System.out.println(
                        "JWT FILTER: Authentication successful - "
                        + faculty.getEmail()
                        + " ROLE_" + role
                );
            }

        } catch (Exception e) {

            System.out.println(
                    "JWT FILTER ERROR: "
                    + e.getMessage()
            );
        }

        filterChain.doFilter(request, response);
    }
}