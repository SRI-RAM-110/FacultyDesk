package com.facultydesk.backend.dto;

public class AuthResponse {

    private String token;
    private Long id;
    private String facultyId;
    private String name;
    private String email;
    private String branch;
    private String role;

    public AuthResponse(
            String token,
            Long id,
            String facultyId,
            String name,
            String email,
            String branch,
            String role
    ) {
        this.token = token;
        this.id = id;
        this.facultyId = facultyId;
        this.name = name;
        this.email = email;
        this.branch = branch;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getFacultyId() {
        return facultyId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getBranch() {
        return branch;
    }

    public String getRole() {
        return role;
    }
}