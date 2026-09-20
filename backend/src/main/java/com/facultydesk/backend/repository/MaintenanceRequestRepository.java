package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.MaintenanceRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaintenanceRequestRepository
        extends JpaRepository<MaintenanceRequest, Long> {

    List<MaintenanceRequest> findByRequestedByOrderByIdDesc(
            String requestedBy
    );
}