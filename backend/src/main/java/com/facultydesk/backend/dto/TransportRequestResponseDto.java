package com.facultydesk.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportRequestResponseDto {

    private Long id;

    private String requestedBy;

    private String department;

    private String purpose;

    private String tripType;

    private String source;

    private String pickupPoint;

    private String destination;

    private String departureDate;

    private String departureTime;

    private String returnDate;

    private String returnTime;

    private Integer students;

    // IMPORTANT:
    // Frontend expects "faculty"
    private Integer faculty;

    private Integer totalPassengers;

    private String vehiclePreference;

    private Long busId;

    private String busNumber;

    private String vehicleType;

    private String driverName;

    private String driverPhone;

    private String additionalInfo;

    private String status;
}