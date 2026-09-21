package com.facultydesk.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facultydesk.backend.entity.TeaSnackOrder;

public interface TeaSnackOrderRepository
        extends JpaRepository<TeaSnackOrder, Long> {

    Optional<TeaSnackOrder> findByOrderId(String orderId);

    List<TeaSnackOrder>
    findByFacultyIdOrderByCreatedAtDesc(Long facultyId);
}