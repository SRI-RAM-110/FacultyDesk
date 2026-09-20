package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.MaintenanceRequestDto;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.entity.MaintenanceRequest;
import com.facultydesk.backend.service.MaintenanceService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(
            MaintenanceService maintenanceService
    ) {
        this.maintenanceService = maintenanceService;
    }


    // CREATE REQUEST

    @PostMapping("/request")
    public ResponseEntity<MaintenanceRequest> createRequest(
            @RequestBody MaintenanceRequestDto dto,
            @AuthenticationPrincipal Faculty faculty
    ) {

        if (faculty == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        MaintenanceRequest request =
                maintenanceService.createRequest(
                        dto,
                        faculty
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(request);
    }


    // GET MY REQUESTS

    @GetMapping("/requests")
    public ResponseEntity<List<MaintenanceRequest>>
    getMyRequests(
            @AuthenticationPrincipal Faculty faculty
    ) {

        if (faculty == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        return ResponseEntity.ok(
                maintenanceService.getMyRequests(
                        faculty
                )
        );
    }


    // GET REQUEST BY ID

    @GetMapping("/requests/{id}")
    public ResponseEntity<MaintenanceRequest>
    getRequestById(
            @PathVariable Long id,
            @AuthenticationPrincipal Faculty faculty
    ) {

        if (faculty == null) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        try {

            return ResponseEntity.ok(
                    maintenanceService.getRequestById(
                            id,
                            faculty
                    )
            );

        } catch (SecurityException e) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
    }


    // UPDATE STATUS
    // SecurityConfig will restrict this endpoint
    // to ADMIN / MAINTENANCE roles.

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<MaintenanceRequest>
    updateStatus(
            @PathVariable Long id,
            @RequestParam String status
    ) {

        try {

            return ResponseEntity.ok(
                    maintenanceService.updateStatus(
                            id,
                            status
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .build();
        }
    }
}