package com.facultydesk.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.facultydesk.backend.dto.TeaSnackOrderRequest;
import com.facultydesk.backend.entity.TeaSnackOrder;
import com.facultydesk.backend.service.TeaSnackOrderService;

@RestController
@RequestMapping("/api/tea-snacks")
@CrossOrigin(origins = "http://localhost:5173")
public class TeaSnackOrderController {

    private final TeaSnackOrderService orderService;

    public TeaSnackOrderController(
            TeaSnackOrderService orderService
    ) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(
            @RequestBody TeaSnackOrderRequest request
    ) {

        try {

            TeaSnackOrder order =
                    orderService.createOrder(request);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(order);

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown backend error"
                            )
                    );
        }
    }

    @GetMapping("/orders/faculty/{facultyId}")
    public ResponseEntity<List<TeaSnackOrder>>
    getFacultyOrders(
            @PathVariable Long facultyId
    ) {

        return ResponseEntity.ok(
                orderService.getFacultyOrders(
                        facultyId
                )
        );
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getOrder(
            @PathVariable String orderId
    ) {

        try {

            return ResponseEntity.ok(
                    orderService.getOrder(
                            orderId
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage()
                            )
                    );
        }
    }
}