package com.facultydesk.backend.controller;

import com.facultydesk.backend.dto.*;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.service.StationeryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stationery")
@CrossOrigin(origins = "http://localhost:5173")
public class StationeryController {

    private final StationeryService stationeryService;

    public StationeryController(StationeryService stationeryService) {
        this.stationeryService = stationeryService;
    }

    @GetMapping("/items")
    public ResponseEntity<List<StationeryItemResponse>> getItems(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(stationeryService.getActiveItems(category, search));
    }

    @GetMapping("/items/{id}")
    public ResponseEntity<StationeryItemResponse> getItem(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(stationeryService.getActiveItem(id));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PostMapping("/orders")
    public ResponseEntity<StationeryOrderResponse> createOrder(
            @RequestBody StationeryOrderRequest request,
            @AuthenticationPrincipal Faculty faculty) {
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(stationeryService.createOrder(request, faculty));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<StationeryOrderResponse>> getMyOrders(
            @AuthenticationPrincipal Faculty faculty) {
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(stationeryService.getMyOrders(faculty));
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<StationeryOrderResponse> getMyOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal Faculty faculty) {
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(stationeryService.getMyOrderById(id, faculty));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<StationeryOrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            return ResponseEntity.ok(stationeryService.updateOrderStatus(id, status));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/orders/{id}/cancel")
    public ResponseEntity<StationeryOrderResponse> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal Faculty faculty) {
        if (faculty == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(stationeryService.cancelOrder(id, faculty));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException exception) {
            return ResponseEntity.badRequest().build();
        }
    }
}