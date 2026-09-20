package com.facultydesk.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String busNumber;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private Integer capacity;

    private String driverName;

    private String driverPhone;

    @Column(nullable = false)
    private Boolean available = true;

    // Required by JPA
    public Bus() {
    }

    // Constructor for creating buses
    public Bus(
            Long id,
            String busNumber,
            String vehicleType,
            Integer capacity,
            String driverName,
            String driverPhone,
            Boolean available
    ) {
        this.id = id;
        this.busNumber = busNumber;
        this.vehicleType = vehicleType;
        this.capacity = capacity;
        this.driverName = driverName;
        this.driverPhone = driverPhone;
        this.available = available;
    }

    // Getters

    public Long getId() {
        return id;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getDriverName() {
        return driverName;
    }

    public String getDriverPhone() {
        return driverPhone;
    }

    public Boolean getAvailable() {
        return available;
    }

    // Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public void setDriverPhone(String driverPhone) {
        this.driverPhone = driverPhone;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }
}