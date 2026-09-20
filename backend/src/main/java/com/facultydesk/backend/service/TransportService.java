package com.facultydesk.backend.service;

import com.facultydesk.backend.dto.TransportRequestDto;
import com.facultydesk.backend.dto.TransportRequestResponseDto;
import com.facultydesk.backend.entity.Bus;
import com.facultydesk.backend.entity.TransportRequest;
import com.facultydesk.backend.repository.BusRepository;
import com.facultydesk.backend.repository.TransportRequestRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class TransportService {

    private final BusRepository busRepository;
    private final TransportRequestRepository transportRequestRepository;

    public TransportService(
            BusRepository busRepository,
            TransportRequestRepository transportRequestRepository) {

        this.busRepository = busRepository;
        this.transportRequestRepository = transportRequestRepository;
    }

    // =========================================================
    // CHECK AVAILABLE VEHICLES
    // =========================================================

    public List<Bus> getAvailableBuses(
            String date,
            String time,
            Integer passengers,
            String vehiclePreference) {

        // ---------- Basic validation ----------

        if (date == null || date.isBlank()) {
            throw new IllegalArgumentException(
                    "Departure date is required"
            );
        }

        if (time == null || time.isBlank()) {
            throw new IllegalArgumentException(
                    "Departure time is required"
            );
        }

        if (passengers == null || passengers <= 0) {
            throw new IllegalArgumentException(
                    "Passenger count must be greater than zero"
            );
        }

        // ---------- Convert date/time ----------

        LocalDate departureDate;

        LocalTime departureTime;

        try {

            departureDate = LocalDate.parse(date);
            departureTime = LocalTime.parse(time);

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Invalid date or time format"
            );
        }

        LocalDateTime requestedStart =
                LocalDateTime.of(
                        departureDate,
                        departureTime
                );

        // ---------- Get all active vehicles ----------

        List<Bus> buses =
                busRepository.findByAvailableTrue();

        // ---------- Get existing bookings ----------

        List<TransportRequest> existingRequests =
                transportRequestRepository.findByStatusNotIn(
                        List.of(
                                "Rejected",
                                "Cancelled"
                        )
                );

        // ---------- Filter vehicles ----------

        return buses.stream()

                // Capacity check
                .filter(bus ->
                        bus.getCapacity() >= passengers
                )

                // Vehicle preference check
                .filter(bus ->
                        matchesVehiclePreference(
                                bus,
                                vehiclePreference
                        )
                )

                // Date/time availability check
                .filter(bus ->
                        isBusAvailable(
                                bus,
                                requestedStart,
                                existingRequests
                        )
                )

                .toList();
    }


    // =========================================================
    // VEHICLE PREFERENCE
    // =========================================================

    private boolean matchesVehiclePreference(
            Bus bus,
            String preference) {

        // Any Available
        if (preference == null ||
                preference.isBlank() ||
                preference.equalsIgnoreCase(
                        "Any Available")) {

            return true;
        }

        String vehicleType =
                bus.getVehicleType() != null
                        ? bus.getVehicleType().toLowerCase()
                        : "";

        // Bus
        if (preference.equalsIgnoreCase("Bus")) {

            return vehicleType.contains("bus");
        }

        // Electrical Kart
        if (preference.equalsIgnoreCase(
                "Electrical Kart")) {

            return vehicleType.contains("kart");
        }

        // Car
        if (preference.equalsIgnoreCase("Car")) {

            return vehicleType.contains("car");
        }

        return true;
    }


    // =========================================================
    // CHECK VEHICLE DATE/TIME AVAILABILITY
    // =========================================================

    private boolean isBusAvailable(
            Bus bus,
            LocalDateTime requestedStart,
            List<TransportRequest> requests) {

        for (TransportRequest request : requests) {

            // No vehicle assigned
            if (request.getBusId() == null) {
                continue;
            }

            // Different vehicle
            if (!request.getBusId().equals(bus.getId())) {
                continue;
            }

            // Invalid existing request
            if (request.getDepartureDate() == null ||
                    request.getDepartureTime() == null) {

                continue;
            }

            // Existing request start
            LocalDateTime existingStart =
                    LocalDateTime.of(
                            request.getDepartureDate(),
                            request.getDepartureTime()
                    );

            // Existing request end
            LocalDateTime existingEnd;

            if (request.getReturnDate() != null &&
                    request.getReturnTime() != null) {

                existingEnd =
                        LocalDateTime.of(
                                request.getReturnDate(),
                                request.getReturnTime()
                        );

            } else {

                // One-way trip:
                // assume vehicle is occupied for 4 hours

                existingEnd =
                        existingStart.plusHours(4);
            }

            // -------------------------------------------------
            // Check whether requested start falls inside
            // an existing booking
            // -------------------------------------------------

            if (!requestedStart.isAfter(existingEnd) &&
                    !requestedStart.isBefore(existingStart)) {

                return false;
            }

            // -------------------------------------------------
            // Check whether requested 4-hour window overlaps
            // an existing booking
            // -------------------------------------------------

            LocalDateTime requestedEnd =
                    requestedStart.plusHours(4);

            if (requestedStart.isBefore(existingStart) &&
                    requestedEnd.isAfter(existingStart)) {

                return false;
            }

            // -------------------------------------------------
            // Check reverse overlap
            // -------------------------------------------------

            if (requestedStart.isBefore(existingEnd) &&
                    requestedEnd.isAfter(existingStart)) {

                return false;
            }
        }

        return true;
    }


    // =========================================================
    // CREATE TRANSPORT REQUEST
    // =========================================================

    public TransportRequest createRequest(
            TransportRequestDto dto) {

        // -----------------------------------------------------
        // Validate DTO
        // -----------------------------------------------------

        if (dto == null) {

            throw new IllegalArgumentException(
                    "Transport request data is required"
            );
        }

        if (dto.getBusId() == null) {

            throw new IllegalArgumentException(
                    "Please select a vehicle"
            );
        }

        if (dto.getRequestedBy() == null ||
                dto.getRequestedBy().isBlank()) {

            throw new IllegalArgumentException(
                    "Requested by is required"
            );
        }

        if (dto.getDestination() == null ||
                dto.getDestination().isBlank()) {

            throw new IllegalArgumentException(
                    "Destination is required"
            );
        }

        if (dto.getDepartureDate() == null ||
                dto.getDepartureDate().isBlank()) {

            throw new IllegalArgumentException(
                    "Departure date is required"
            );
        }

        if (dto.getDepartureTime() == null ||
                dto.getDepartureTime().isBlank()) {

            throw new IllegalArgumentException(
                    "Departure time is required"
            );
        }


        // -----------------------------------------------------
        // Find selected vehicle
        // -----------------------------------------------------

        Bus bus =
                busRepository.findById(
                        dto.getBusId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Selected vehicle not found"
                        )
                );


        // -----------------------------------------------------
        // Check whether vehicle is active
        // -----------------------------------------------------

        if (Boolean.FALSE.equals(
                bus.getAvailable())) {

            throw new IllegalStateException(
                    "Selected vehicle is currently unavailable"
            );
        }


        // -----------------------------------------------------
        // Convert date/time
        // -----------------------------------------------------

        LocalDate departureDate;

        LocalTime departureTime;

        try {

            departureDate =
                    LocalDate.parse(
                            dto.getDepartureDate()
                    );

            departureTime =
                    LocalTime.parse(
                            dto.getDepartureTime()
                    );

        } catch (Exception e) {

            throw new IllegalArgumentException(
                    "Invalid departure date or time"
            );
        }


        // -----------------------------------------------------
        // Validate return trip
        // -----------------------------------------------------

        LocalDate returnDate = null;

        LocalTime returnTime = null;

        if ("roundTrip".equalsIgnoreCase(
                dto.getTripType())) {

            if (dto.getReturnDate() == null ||
                    dto.getReturnDate().isBlank()) {

                throw new IllegalArgumentException(
                        "Return date is required for round trip"
                );
            }

            if (dto.getReturnTime() == null ||
                    dto.getReturnTime().isBlank()) {

                throw new IllegalArgumentException(
                        "Return time is required for round trip"
                );
            }

            try {

                returnDate =
                        LocalDate.parse(
                                dto.getReturnDate()
                        );

                returnTime =
                        LocalTime.parse(
                                dto.getReturnTime()
                        );

            } catch (Exception e) {

                throw new IllegalArgumentException(
                        "Invalid return date or time"
                );
            }

            LocalDateTime departure =
                    LocalDateTime.of(
                            departureDate,
                            departureTime
                    );

            LocalDateTime returnDateTime =
                    LocalDateTime.of(
                            returnDate,
                            returnTime
                    );

            if (!returnDateTime.isAfter(
                    departure)) {

                throw new IllegalArgumentException(
                        "Return date/time must be after departure date/time"
                );
            }
        }


        // -----------------------------------------------------
        // Calculate passenger count
        // -----------------------------------------------------

        int students =
                dto.getStudents() != null
                        ? dto.getStudents()
                        : 0;

        int faculty =
                dto.getFaculty() != null
                        ? dto.getFaculty()
                        : 0;

        int totalPassengers =
                students + faculty;


        if (totalPassengers <= 0) {

            throw new IllegalArgumentException(
                    "Total passengers must be greater than zero"
            );
        }


        // -----------------------------------------------------
        // Check vehicle capacity
        // -----------------------------------------------------

        if (bus.getCapacity() < totalPassengers) {

            throw new IllegalArgumentException(
                    "Selected vehicle does not have enough capacity"
            );
        }


        // -----------------------------------------------------
        // Final availability check
        // -----------------------------------------------------

        LocalDateTime requestedStart =
                LocalDateTime.of(
                        departureDate,
                        departureTime
                );

        List<TransportRequest> existingRequests =
                transportRequestRepository.findByStatusNotIn(
                        List.of(
                                "Rejected",
                                "Cancelled"
                        )
                );

        if (!isBusAvailable(
                bus,
                requestedStart,
                existingRequests
        )) {

            throw new IllegalStateException(
                    "Selected vehicle is no longer available for the requested time"
            );
        }


        // -----------------------------------------------------
        // Create entity
        // -----------------------------------------------------

        TransportRequest request =
                new TransportRequest();


        // Faculty information
        request.setRequestedBy(
                dto.getRequestedBy()
        );

        request.setDepartment(
                dto.getDepartment()
        );


        // Trip information
        request.setPurpose(
                dto.getPurpose()
        );

        request.setTripType(
                dto.getTripType()
        );

        request.setSource(
                dto.getSource()
        );

        request.setPickupPoint(
                dto.getPickupPoint()
        );

        request.setDestination(
                dto.getDestination()
        );


        // Departure
        request.setDepartureDate(
                departureDate
        );

        request.setDepartureTime(
                departureTime
        );


        // Return
        request.setReturnDate(
                returnDate
        );

        request.setReturnTime(
                returnTime
        );


        // Passenger information
        request.setStudents(
                students
        );

        request.setFacultyCount(
                faculty
        );

        request.setTotalPassengers(
                totalPassengers
        );


        // Vehicle preference
        request.setVehiclePreference(
                dto.getVehiclePreference()
        );


        // -----------------------------------------------------
        // Vehicle information
        //
        // IMPORTANT:
        // We get these values from database instead of
        // trusting frontend values.
        // -----------------------------------------------------

        request.setBusId(
                bus.getId()
        );

        request.setBusNumber(
                bus.getBusNumber()
        );

        request.setVehicleType(
                bus.getVehicleType()
        );

        request.setDriverName(
                bus.getDriverName()
        );

        request.setDriverPhone(
                bus.getDriverPhone()
        );


        // Additional information
        request.setAdditionalInfo(
                dto.getAdditionalInfo()
        );


        // -----------------------------------------------------
        // Default status
        // -----------------------------------------------------

        request.setStatus(
                "Pending"
        );


        // -----------------------------------------------------
        // Save to database
        // -----------------------------------------------------

        return transportRequestRepository.save(
                request
        );
    }


    // =========================================================
    // GET ALL TRANSPORT REQUESTS
    // =========================================================

    public List<TransportRequestResponseDto>
    getAllRequests() {

        return transportRequestRepository
                .findAllByOrderByIdDesc()
                .stream()
                .map(this::toResponseDto)
                .toList();
    }


    // =========================================================
    // GET TRANSPORT REQUEST BY ID
    // =========================================================

    public TransportRequestResponseDto
    getRequestById(Long id) {

        TransportRequest request =
                transportRequestRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Transport request not found with id: "
                                                + id
                                )
                        );

        return toResponseDto(request);
    }


    // =========================================================
    // UPDATE REQUEST STATUS
    // =========================================================

    public TransportRequest updateStatus(
            Long id,
            String status) {

        // IMPORTANT:
        // Don't call getRequestById() here because that method
        // returns DTO.
        //
        // Directly fetch the Entity from repository.

        TransportRequest request =
                transportRequestRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Transport request not found with id: "
                                                + id
                                )
                        );


        // -----------------------------------------------------
        // Validate status
        // -----------------------------------------------------

        if (status == null ||
                status.isBlank()) {

            throw new IllegalArgumentException(
                    "Status is required"
            );
        }


        String normalizedStatus =
                status.trim();


        if (!isValidStatus(
                normalizedStatus
        )) {

            throw new IllegalArgumentException(
                    "Invalid status. Allowed values: "
                            + "Pending, Approved, Rejected, Cancelled"
            );
        }


        // -----------------------------------------------------
        // Update
        // -----------------------------------------------------

        request.setStatus(
                normalizedStatus
        );


        return transportRequestRepository.save(
                request
        );
    }


    // =========================================================
    // VALID STATUS
    // =========================================================

    private boolean isValidStatus(
            String status) {

        return status.equalsIgnoreCase(
                    "Pending"
                )
                ||
                status.equalsIgnoreCase(
                    "Approved"
                )
                ||
                status.equalsIgnoreCase(
                    "Rejected"
                )
                ||
                status.equalsIgnoreCase(
                    "Cancelled"
                );
    }


    // =========================================================
    // CONVERT ENTITY → RESPONSE DTO
    // =========================================================

    private TransportRequestResponseDto
    toResponseDto(
            TransportRequest request) {

        TransportRequestResponseDto dto =
                new TransportRequestResponseDto();


        // -----------------------------------------------------
        // Basic information
        // -----------------------------------------------------

        dto.setId(
                request.getId()
        );

        dto.setRequestedBy(
                request.getRequestedBy()
        );

        dto.setDepartment(
                request.getDepartment()
        );

        dto.setPurpose(
                request.getPurpose()
        );

        dto.setTripType(
                request.getTripType()
        );


        // -----------------------------------------------------
        // Route
        // -----------------------------------------------------

        dto.setSource(
                request.getSource()
        );

        dto.setPickupPoint(
                request.getPickupPoint()
        );

        dto.setDestination(
                request.getDestination()
        );


        // -----------------------------------------------------
        // Departure
        // -----------------------------------------------------

        dto.setDepartureDate(
                request.getDepartureDate() != null
                        ? request.getDepartureDate().toString()
                        : null
        );

        dto.setDepartureTime(
                request.getDepartureTime() != null
                        ? request.getDepartureTime().toString()
                        : null
        );


        // -----------------------------------------------------
        // Return
        // -----------------------------------------------------

        dto.setReturnDate(
                request.getReturnDate() != null
                        ? request.getReturnDate().toString()
                        : null
        );

        dto.setReturnTime(
                request.getReturnTime() != null
                        ? request.getReturnTime().toString()
                        : null
        );


        // -----------------------------------------------------
        // Passenger information
        // -----------------------------------------------------

        dto.setStudents(
                request.getStudents()
        );

        // IMPORTANT:
        //
        // Entity field:
        // facultyCount
        //
        // Frontend expects:
        // faculty

        dto.setFaculty(
                request.getFacultyCount()
        );

        dto.setTotalPassengers(
                request.getTotalPassengers()
        );


        // -----------------------------------------------------
        // Vehicle
        // -----------------------------------------------------

        dto.setVehiclePreference(
                request.getVehiclePreference()
        );

        dto.setBusId(
                request.getBusId()
        );

        dto.setBusNumber(
                request.getBusNumber()
        );

        dto.setVehicleType(
                request.getVehicleType()
        );

        dto.setDriverName(
                request.getDriverName()
        );

        dto.setDriverPhone(
                request.getDriverPhone()
        );


        // -----------------------------------------------------
        // Additional information
        // -----------------------------------------------------

        dto.setAdditionalInfo(
                request.getAdditionalInfo()
        );


        // -----------------------------------------------------
        // Status
        // -----------------------------------------------------

        dto.setStatus(
                request.getStatus()
        );


        return dto;
    }
}