package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.StationeryOrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StationeryOrderItemRepository
        extends JpaRepository<StationeryOrderItem, Long> {
}