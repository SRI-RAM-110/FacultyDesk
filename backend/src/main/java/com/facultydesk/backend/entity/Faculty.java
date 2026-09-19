package com.facultydesk.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty")
public class Faculty {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "faculty_id", unique = true, nullable = false)
    private String facultyId;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String branch;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role = "FACULTY";


    public Faculty() {
    }


    public Faculty(
            String facultyId,
            String name,
            String email,
            String branch,
            String phone,
            String password,
            String role
    ) {
        this.facultyId = facultyId;
        this.name = name;
        this.email = email;
        this.branch = branch;
        this.phone = phone;
        this.password = password;
        this.role = role;
    }


    public Long getId() {
        return id;
    }

    public String getFacultyId() {
        return facultyId;
    }

    public void setFacultyId(String facultyId) {
        this.facultyId = facultyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}