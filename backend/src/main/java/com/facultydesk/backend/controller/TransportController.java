package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.TransportRequestDto;
import com.facultydesk.backend.dto.TransportRequestResponseDto;
import com.facultydesk.backend.entity.Bus;
import com.facultydesk.backend.entity.TransportRequest;
import com.facultydesk.backend.service.TransportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transport")
@CrossOrigin(origins = "http://localhost:5173")
public class TransportController {

    private final TransportService transportService;

    public TransportController(
            TransportService transportService
    ) {
        this.transportService = transportService;
    }


    // ==========================================
    // AVAILABLE VEHICLES
    // ==========================================

    @GetMapping("/available")
    public ResponseEntity<List<Bus>> getAvailableBuses(

            @RequestParam String date,

            @RequestParam String time,

            @RequestParam Integer passengers,

            @RequestParam(
                    defaultValue = "Any Available"
            )
            String vehiclePreference

    ) {

        return ResponseEntity.ok(
                transportService.getAvailableBuses(
                        date,
                        time,
                        passengers,
                        vehiclePreference
                )
        );
    }


    // ==========================================
    // CREATE REQUEST
    // ==========================================

    @PostMapping("/request")
    public ResponseEntity<TransportRequest> createRequest(

            @RequestBody TransportRequestDto dto

    ) {

        return ResponseEntity.ok(
                transportService.createRequest(dto)
        );
    }


    // ==========================================
    // GET ALL TRANSPORT REQUESTS
    // ==========================================

    @GetMapping("/requests")
    public ResponseEntity<
            List<TransportRequestResponseDto>
            > getAllRequests() {

        return ResponseEntity.ok(
                transportService.getAllRequests()
        );
    }


    // ==========================================
    // GET REQUEST BY ID
    // ==========================================

    @GetMapping("/requests/{id}")
    public ResponseEntity<
            TransportRequestResponseDto
            > getRequestById(

            @PathVariable Long id

    ) {

        return ResponseEntity.ok(
                transportService.getRequestById(id)
        );
    }


    // ==========================================
    // UPDATE STATUS
    // ==========================================

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<
            TransportRequest
            > updateStatus(

            @PathVariable Long id,

            @RequestParam String status

    ) {

        return ResponseEntity.ok(
                transportService.updateStatus(
                        id,
                        status
                )
        );
    }
}