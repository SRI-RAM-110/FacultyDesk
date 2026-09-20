package com.facultydesk.backend.dto;

import lombok.Data;

@Data
public class TransportRequestDto {

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

    private Integer faculty;

    private Integer totalPassengers;

    private String vehiclePreference;

    private Long busId;

    private String busNumber;

    private String vehicleType;

    private String driverName;

    private String driverPhone;

    private String additionalInfo;
}