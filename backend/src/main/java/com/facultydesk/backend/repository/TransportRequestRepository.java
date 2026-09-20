package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.TransportRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransportRequestRepository
        extends JpaRepository<TransportRequest, Long> {

    List<TransportRequest> findAllByOrderByIdDesc();

    List<TransportRequest> findByStatusNotIn(
            List<String> statuses
    );
}