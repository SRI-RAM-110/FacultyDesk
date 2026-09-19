package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.AuthResponse;
import com.facultydesk.backend.dto.LoginRequest;
import com.facultydesk.backend.dto.RegisterRequest;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.security.JwtService;
import com.facultydesk.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request
    ) {

        authService.register(request);

        return ResponseEntity.ok(
                "Faculty registered successfully"
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request
    ) {

        Faculty faculty = authService.authenticate(request);

        String token = jwtService.generateToken(faculty);

        AuthResponse response = new AuthResponse(
                token,
                faculty.getId(),
                faculty.getFacultyId(),
                faculty.getName(),
                faculty.getEmail(),
                faculty.getBranch(),
                faculty.getRole()
        );

        return ResponseEntity.ok(response);
    }
}