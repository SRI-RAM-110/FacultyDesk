package com.facultydesk.backend.service;

import com.facultydesk.backend.entity.SeminarHall;
import com.facultydesk.backend.repository.SeminarHallRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SeminarHallService {

    private final SeminarHallRepository hallRepository;

    public SeminarHallService(SeminarHallRepository hallRepository) {
        this.hallRepository = hallRepository;
    }

    public List<SeminarHall> getActiveHalls() {
        return hallRepository.findByActiveTrue();
    }
}