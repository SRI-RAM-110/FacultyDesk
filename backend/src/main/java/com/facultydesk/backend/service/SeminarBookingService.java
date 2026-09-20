package com.facultydesk.backend.service;

import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.entity.SeminarBooking;
import com.facultydesk.backend.entity.SeminarHall;
import com.facultydesk.backend.repository.FacultyRepository;
import com.facultydesk.backend.repository.SeminarBookingRepository;
import com.facultydesk.backend.repository.SeminarHallRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class SeminarBookingService {

    private final SeminarBookingRepository bookingRepository;
    private final SeminarHallRepository hallRepository;
    private final FacultyRepository facultyRepository;

    public SeminarBookingService(
            SeminarBookingRepository bookingRepository,
            SeminarHallRepository hallRepository,
            FacultyRepository facultyRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.hallRepository = hallRepository;
        this.facultyRepository = facultyRepository;
    }

    public SeminarBooking createBooking(
            Long facultyId,
            Long hallId,
            LocalDate bookingDate,
            LocalTime startTime,
            LocalTime endTime,
            String purpose
    ) {

        if (bookingDate == null ||
                startTime == null ||
                endTime == null ||
                purpose == null ||
                purpose.trim().isEmpty()) {
            throw new RuntimeException("All booking details are required");
        }

        if (!startTime.isBefore(endTime)) {
            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() ->
                        new RuntimeException("Faculty not found")
                );

        SeminarHall hall = hallRepository.findById(hallId)
                .orElseThrow(() ->
                        new RuntimeException("Seminar hall not found")
                );

        if (!Boolean.TRUE.equals(hall.getActive())) {
            throw new RuntimeException(
                    "This seminar hall is not available"
            );
        }

        boolean overlap =
                bookingRepository
                        .existsByHallIdAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                hallId,
                                bookingDate,
                                endTime,
                                startTime
                        );

        if (overlap) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This seminar hall is already booked for the selected time"
            );
        }

        SeminarBooking booking = new SeminarBooking(
                faculty,
                hall,
                bookingDate,
                startTime,
                endTime,
                purpose.trim()
        );

        booking.setStatus(SeminarBooking.STATUS_PENDING);

        return bookingRepository.save(booking);
    }

    public List<SeminarBooking> getFacultyBookings(Long facultyId) {
        return bookingRepository
                .findByFacultyIdOrderByBookingDateDesc(facultyId);
    }

    public List<SeminarHall> getActiveHalls() {
        return hallRepository.findByActiveTrue();
    }

    public List<SeminarBooking> getBookingsForHall(
            Long hallId,
            LocalDate bookingDate
    ) {
        return bookingRepository
                .findByBookingDateAndHallId(
                        bookingDate,
                        hallId
                );
    }
}