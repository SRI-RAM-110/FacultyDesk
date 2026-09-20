package com.facultydesk.backend.service;

import com.facultydesk.backend.dto.AccommodationRequest;
import com.facultydesk.backend.entity.AccommodationRequestEntity;
import com.facultydesk.backend.entity.AccommodationRoom;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.repository.AccommodationRequestRepository;
import com.facultydesk.backend.repository.AccommodationRoomRepository;
import com.facultydesk.backend.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AccommodationService {

    private final AccommodationRequestRepository requestRepository;
    private final FacultyRepository facultyRepository;
    private final AccommodationRoomRepository roomRepository;

    public AccommodationService(
            AccommodationRequestRepository requestRepository,
            FacultyRepository facultyRepository,
            AccommodationRoomRepository roomRepository
    ) {
        this.requestRepository = requestRepository;
        this.facultyRepository = facultyRepository;
        this.roomRepository = roomRepository;
    }

    public AccommodationRequestEntity createRequest(
            AccommodationRequest request
    ) {

        // Validate required fields
        if (request.getFacultyId() == null ||
                request.getRoomId() == null ||
                request.getAccommodationType() == null ||
                request.getCheckIn() == null ||
                request.getCheckOut() == null ||
                request.getGuests() == null ||
                request.getPurpose() == null ||
                request.getPurpose().trim().isEmpty()) {

            throw new RuntimeException(
                    "All accommodation details are required"
            );
        }

        // Parse dates
        LocalDate checkIn =
                LocalDate.parse(request.getCheckIn());

        LocalDate checkOut =
                LocalDate.parse(request.getCheckOut());

        // Validate date range
        if (!checkIn.isBefore(checkOut)) {
            throw new RuntimeException(
                    "Check-out date must be after check-in date"
            );
        }

        // Validate guests
        if (request.getGuests() < 1) {
            throw new RuntimeException(
                    "At least one guest is required"
            );
        }

        // Find faculty
        Faculty faculty =
                facultyRepository.findById(
                        request.getFacultyId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found"
                        )
                );

        // Find accommodation room
        AccommodationRoom room =
                roomRepository.findById(
                        request.getRoomId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Accommodation room not found"
                        )
                );

        // Check whether room is active
        if (!Boolean.TRUE.equals(room.getActive())) {
            throw new RuntimeException(
                    "This accommodation room is not available"
            );
        }

        // Check room capacity
        if (request.getGuests() > room.getCapacity()) {
            throw new RuntimeException(
                    "Number of guests exceeds room capacity"
            );
        }

        // Check room availability for selected dates
        boolean alreadyBooked =
                requestRepository.existsOverlappingBooking(
                        room.getId(),
                        checkIn,
                        checkOut
                );

        if (alreadyBooked) {
            throw new RuntimeException(
                    "This room is already booked for the selected dates"
            );
        }

        // Create accommodation request
        AccommodationRequestEntity entity =
                new AccommodationRequestEntity();

        entity.setFaculty(faculty);

        entity.setRoom(room);

        entity.setAccommodationType(
                request.getAccommodationType()
        );

        entity.setCheckIn(checkIn);

        entity.setCheckOut(checkOut);

        entity.setGuests(
                request.getGuests()
        );

        entity.setPurpose(
                request.getPurpose().trim()
        );

        entity.setStatus(
                AccommodationRequestEntity.STATUS_PENDING
        );

        // Save request
        return requestRepository.save(entity);
    }

    public List<AccommodationRequestEntity>
    getFacultyRequests(Long facultyId) {

        return requestRepository
                .findByFacultyIdOrderByCheckInDesc(facultyId);
    }
    public List<AccommodationRoom> getActiveRooms() {
        return roomRepository.findByActiveTrue();
    }
    public List<AccommodationRequestEntity> getRoomBookings(
            Long roomId
    ) {
        return requestRepository.findByRoomIdAndStatusNot(
                roomId,
                AccommodationRequestEntity.STATUS_CANCELLED
        );
    }
}