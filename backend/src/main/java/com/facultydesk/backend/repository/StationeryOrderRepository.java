package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.entity.StationeryOrder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StationeryOrderRepository
        extends JpaRepository<StationeryOrder, Long> {

    List<StationeryOrder>
    findByFacultyOrderByCreatedAtDesc(
            Faculty faculty
    );

    Optional<StationeryOrder>
    findByIdAndFaculty(
            Long id,
            Faculty faculty
    );

    boolean existsByOrderNumber(
            String orderNumber
    );
}