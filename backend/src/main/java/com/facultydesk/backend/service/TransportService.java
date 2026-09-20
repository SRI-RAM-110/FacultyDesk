package com.facultydesk.backend.service;

import com.facultydesk.backend.dto.TransportRequestDto;
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
            TransportRequestRepository transportRequestRepository
    ) {
        this.busRepository = busRepository;
        this.transportRequestRepository = transportRequestRepository;
    }


    // =====================================================
    // CHECK AVAILABLE BUSES
    // =====================================================

    public List<Bus> getAvailableBuses(
            String date,
            String time,
            Integer passengers,
            String vehiclePreference
    ) {

        LocalDate departureDate = LocalDate.parse(date);
        LocalTime departureTime = LocalTime.parse(time);

        LocalDateTime requestedStart =
                LocalDateTime.of(departureDate, departureTime);

        List<Bus> buses = busRepository.findByAvailableTrue();

        List<TransportRequest> existingRequests =
                transportRequestRepository.findByStatusNotIn(
                        List.of("Rejected", "Cancelled")
                );

        return buses.stream()
                .filter(bus -> bus.getCapacity() >= passengers)
                .filter(bus -> matchesVehiclePreference(
                        bus,
                        vehiclePreference
                ))
                .filter(bus -> isBusAvailable(
                        bus,
                        requestedStart,
                        existingRequests
                ))
                .toList();
    }


    // =====================================================
    // VEHICLE PREFERENCE
    // =====================================================

    private boolean matchesVehiclePreference(
            Bus bus,
            String preference
    ) {

        if (preference == null ||
                preference.equalsIgnoreCase("Any Available")) {

            return true;
        }

        if (preference.equalsIgnoreCase("Bus")) {

            return bus.getVehicleType()
                    .toLowerCase()
                    .contains("bus");
        }

        if (preference.equalsIgnoreCase("Electrical Kart")) {

            return bus.getVehicleType()
                    .toLowerCase()
                    .contains("kart");
        }

        if (preference.equalsIgnoreCase("Car")) {

            return bus.getVehicleType()
                    .toLowerCase()
                    .contains("car");
        }

        return true;
    }


    // =====================================================
    // BUS AVAILABILITY
    // =====================================================

    private boolean isBusAvailable(
            Bus bus,
            LocalDateTime requestedStart,
            List<TransportRequest> requests
    ) {

        for (TransportRequest request : requests) {

            if (request.getBusId() == null) {
                continue;
            }

            if (!request.getBusId().equals(bus.getId())) {
                continue;
            }

            if (request.getDepartureDate() == null ||
                    request.getDepartureTime() == null) {
                continue;
            }

            LocalDateTime existingStart =
                    LocalDateTime.of(
                            request.getDepartureDate(),
                            request.getDepartureTime()
                    );

            LocalDateTime existingEnd = existingStart.plusHours(4);

            if (request.getReturnDate() != null &&
                    request.getReturnTime() != null) {

                existingEnd =
                        LocalDateTime.of(
                                request.getReturnDate(),
                                request.getReturnTime()
                        );
            }

            if (!requestedStart.isBefore(existingStart) &&
                    !requestedStart.isAfter(existingEnd)) {

                return false;
            }

            if (requestedStart.isBefore(existingStart) &&
                    requestedStart.plusHours(4)
                            .isAfter(existingStart)) {

                return false;
            }
        }

        return true;
    }


    // =====================================================
    // CREATE TRANSPORT REQUEST
    // =====================================================

    public TransportRequest createRequest(
            TransportRequestDto dto
    ) {

        Bus bus = busRepository.findById(dto.getBusId())
                .orElseThrow(() ->
                        new RuntimeException("Selected bus not found")
                );

        TransportRequest request =
                new TransportRequest();

        request.setRequestedBy(dto.getRequestedBy());
        request.setDepartment(dto.getDepartment());
        request.setPurpose(dto.getPurpose());
        request.setTripType(dto.getTripType());
        request.setSource(dto.getSource());
        request.setPickupPoint(dto.getPickupPoint());
        request.setDestination(dto.getDestination());

        request.setDepartureDate(
                LocalDate.parse(dto.getDepartureDate())
        );

        request.setDepartureTime(
                LocalTime.parse(dto.getDepartureTime())
        );

        if (dto.getReturnDate() != null &&
                !dto.getReturnDate().isBlank()) {

            request.setReturnDate(
                    LocalDate.parse(dto.getReturnDate())
            );
        }

        if (dto.getReturnTime() != null &&
                !dto.getReturnTime().isBlank()) {

            request.setReturnTime(
                    LocalTime.parse(dto.getReturnTime())
            );
        }

        request.setStudents(dto.getStudents());
        request.setFacultyCount(dto.getFaculty());
        request.setTotalPassengers(dto.getTotalPassengers());

        request.setVehiclePreference(
                dto.getVehiclePreference()
        );

        request.setBusId(bus.getId());
        request.setBusNumber(bus.getBusNumber());
        request.setVehicleType(bus.getVehicleType());
        request.setDriverName(bus.getDriverName());
        request.setDriverPhone(bus.getDriverPhone());

        request.setAdditionalInfo(
                dto.getAdditionalInfo()
        );

        request.setStatus("Pending");

        return transportRequestRepository.save(request);
    }


    // =====================================================
    // GET ALL REQUESTS
    // =====================================================

    public List<TransportRequest> getAllRequests() {

        return transportRequestRepository
                .findAllByOrderByIdDesc();
    }


    // =====================================================
    // GET REQUEST BY ID
    // =====================================================

    public TransportRequest getRequestById(Long id) {

        return transportRequestRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Transport request not found"
                        )
                );
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    public TransportRequest updateStatus(
            Long id,
            String status
    ) {

        TransportRequest request =
                getRequestById(id);

        request.setStatus(status);

        return transportRequestRepository.save(request);
    }
}