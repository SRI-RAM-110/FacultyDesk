package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.TransportRequestDto;
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


    // =====================================================
    // CHECK AVAILABLE VEHICLES
    // =====================================================

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

        List<Bus> buses =
                transportService.getAvailableBuses(
                        date,
                        time,
                        passengers,
                        vehiclePreference
                );

        return ResponseEntity.ok(buses);
    }


    // =====================================================
    // CREATE TRANSPORT REQUEST
    // =====================================================

    @PostMapping("/request")
    public ResponseEntity<TransportRequest> createRequest(

            @RequestBody TransportRequestDto dto

    ) {

        TransportRequest request =
                transportService.createRequest(dto);

        return ResponseEntity.ok(request);
    }


    // =====================================================
    // GET ALL REQUESTS
    // =====================================================

    @GetMapping("/requests")
    public ResponseEntity<List<TransportRequest>>
    getAllRequests() {

        return ResponseEntity.ok(
                transportService.getAllRequests()
        );
    }


    // =====================================================
    // GET REQUEST BY ID
    // =====================================================

    @GetMapping("/requests/{id}")
    public ResponseEntity<TransportRequest>
    getRequestById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                transportService.getRequestById(id)
        );
    }


    // =====================================================
    // UPDATE STATUS
    // =====================================================

    @PutMapping("/requests/{id}/status")
    public ResponseEntity<TransportRequest>
    updateStatus(

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