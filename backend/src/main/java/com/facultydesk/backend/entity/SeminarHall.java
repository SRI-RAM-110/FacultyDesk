package com.facultydesk.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seminar_halls")
public class SeminarHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hall_name", nullable = false, unique = true)
    private String hallName;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Integer capacity;

    @Column(length = 500)
    private String facilities;

    @Column(nullable = false)
    private Boolean active = true;

    public SeminarHall() {
    }

    public SeminarHall(
            String hallName,
            String location,
            Integer capacity,
            String facilities,
            Boolean active
    ) {
        this.hallName = hallName;
        this.location = location;
        this.capacity = capacity;
        this.facilities = facilities;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getHallName() {
        return hallName;
    }

    public void setHallName(String hallName) {
        this.hallName = hallName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getFacilities() {
        return facilities;
    }

    public void setFacilities(String facilities) {
        this.facilities = facilities;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}