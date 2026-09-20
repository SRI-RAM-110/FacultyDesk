package com.facultydesk.backend.controller;

import com.facultydesk.backend.entity.SeminarHall;
import com.facultydesk.backend.service.SeminarHallService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seminar/halls")
@CrossOrigin(origins = "http://localhost:5173")
public class SeminarHallController {

    private final SeminarHallService hallService;

    public SeminarHallController(SeminarHallService hallService) {
        this.hallService = hallService;
    }

    @GetMapping
    public ResponseEntity<List<SeminarHall>> getActiveHalls() {
        return ResponseEntity.ok(
                hallService.getActiveHalls()
        );
    }
}