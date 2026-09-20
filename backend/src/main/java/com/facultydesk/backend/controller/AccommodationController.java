package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.AccommodationRequest;
import com.facultydesk.backend.entity.AccommodationRequestEntity;
import com.facultydesk.backend.entity.AccommodationRoom;
import com.facultydesk.backend.service.AccommodationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/accommodation")
@CrossOrigin(origins = "http://localhost:5173")
public class AccommodationController {

    private final AccommodationService accommodationService;

    public AccommodationController(
            AccommodationService accommodationService
    ) {
        this.accommodationService = accommodationService;
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<AccommodationRoom>> getActiveRooms() {
        return ResponseEntity.ok(
                accommodationService.getActiveRooms()
        );
    }

    @PostMapping("/requests")
    public ResponseEntity<?> createRequest(
            @RequestBody AccommodationRequest request
    ) {
        try {

            AccommodationRequestEntity saved =
                    accommodationService.createRequest(request);

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "message",
                            e.getMessage()
                    ));
        }
    }

    @GetMapping("/requests/faculty/{facultyId}")
    public ResponseEntity<List<AccommodationRequestEntity>>
    getFacultyRequests(
            @PathVariable Long facultyId
    ) {

        return ResponseEntity.ok(
                accommodationService
                        .getFacultyRequests(facultyId)
        );
    }
    @GetMapping("/rooms/{roomId}/bookings")
    public ResponseEntity<List<AccommodationRequestEntity>>
    getRoomBookings(
            @PathVariable Long roomId
    ) {
        return ResponseEntity.ok(
                accommodationService.getRoomBookings(roomId)
        );
    }
}