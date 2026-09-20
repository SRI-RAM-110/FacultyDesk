package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.AccommodationRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccommodationRoomRepository
        extends JpaRepository<AccommodationRoom, Long> {

    List<AccommodationRoom> findByActiveTrue();

    List<AccommodationRoom> findByHostelAndActiveTrue(
            String hostel
    );
}