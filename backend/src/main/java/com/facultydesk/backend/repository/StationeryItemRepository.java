package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.StationeryItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StationeryItemRepository
        extends JpaRepository<StationeryItem, Long> {

    List<StationeryItem>
    findByActiveTrueOrderByIdAsc();

    List<StationeryItem>
    findByCategoryAndActiveTrueOrderByIdAsc(
            String category
    );

    List<StationeryItem>
    findByActiveTrueAndNameContainingIgnoreCaseOrderByIdAsc(
            String name
    );

    boolean existsByNameIgnoreCase(
            String name
    );

    Optional<StationeryItem>
    findByNameIgnoreCase(
            String name
    );
}