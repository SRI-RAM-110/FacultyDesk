package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.SeminarBookingRequest;
import com.facultydesk.backend.entity.SeminarBooking;
import com.facultydesk.backend.service.SeminarBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/seminar")
@CrossOrigin(origins = "http://localhost:5173")
public class SeminarBookingController {

    private final SeminarBookingService bookingService;

    public SeminarBookingController(
            SeminarBookingService bookingService
    ) {
        this.bookingService = bookingService;
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> createBooking(
            @RequestBody SeminarBookingRequest request
    ) {

        try {

            Long facultyId = request.getFacultyId();

            Long hallId = request.getHallId();

            LocalDate bookingDate =
                    LocalDate.parse(request.getBookingDate());

            LocalTime startTime =
                    LocalTime.parse(request.getStartTime());

            LocalTime endTime =
                    LocalTime.parse(request.getEndTime());

            String purpose = request.getPurpose();

            SeminarBooking booking =
                    bookingService.createBooking(
                            facultyId,
                            hallId,
                            bookingDate,
                            startTime,
                            endTime,
                            purpose
                    );

            return ResponseEntity.ok(booking);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/bookings/faculty/{facultyId}")
    public ResponseEntity<List<SeminarBooking>> getFacultyBookings(
            @PathVariable Long facultyId
    ) {

        return ResponseEntity.ok(
                bookingService.getFacultyBookings(facultyId)
        );
    }

    @GetMapping("/bookings/hall/{hallId}")
    public ResponseEntity<List<SeminarBooking>> getHallBookings(
            @PathVariable Long hallId,
            @RequestParam LocalDate bookingDate
    ) {

        return ResponseEntity.ok(
                bookingService.getBookingsForHall(
                        hallId,
                        bookingDate
                )
        );
    }
}