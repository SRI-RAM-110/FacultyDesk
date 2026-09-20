package com.facultydesk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "transport_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String requestedBy;

    private String department;

    private String purpose;

    private String tripType;

    private String source;

    private String pickupPoint;

    private String destination;

    private LocalDate departureDate;

    private LocalTime departureTime;

    private LocalDate returnDate;

    private LocalTime returnTime;

    private Integer students;

    private Integer facultyCount;

    private Integer totalPassengers;

    private String vehiclePreference;

    private Long busId;

    private String busNumber;

    private String vehicleType;

    private String driverName;

    private String driverPhone;

    @Column(columnDefinition = "TEXT")
    private String additionalInfo;

    private String status;
}