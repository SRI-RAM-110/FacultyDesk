package com.facultydesk.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.facultydesk.backend.entity.TeaSnackOrderItem;

public interface TeaSnackOrderItemRepository
        extends JpaRepository<TeaSnackOrderItem, Long> {

    List<TeaSnackOrderItem> findByOrderId(Long orderId);
}