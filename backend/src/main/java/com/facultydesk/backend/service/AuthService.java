package com.facultydesk.backend.service;

import com.facultydesk.backend.dto.LoginRequest;
import com.facultydesk.backend.dto.RegisterRequest;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.repository.FacultyRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final FacultyRepository facultyRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            FacultyRepository facultyRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.facultyRepository = facultyRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ================================
    // REGISTER
    // ================================

    public void register(RegisterRequest request) {

        if (facultyRepository.existsByFacultyId(request.getFacultyId())) {
            throw new RuntimeException("Faculty ID already exists");
        }

        if (facultyRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        Faculty faculty = new Faculty(
                request.getFacultyId(),
                request.getName(),
                request.getEmail(),
                request.getBranch(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                "FACULTY"
        );

        facultyRepository.save(faculty);
    }

    // ================================
    // LOGIN
    // ================================

    public Faculty authenticate(LoginRequest request) {

        Faculty faculty = facultyRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                faculty.getPassword()
        )) {
            throw new RuntimeException("Invalid email or password");
        }

        return faculty;
    }
}