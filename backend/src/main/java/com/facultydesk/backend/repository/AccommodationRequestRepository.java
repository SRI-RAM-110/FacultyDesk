package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.AccommodationRequestEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AccommodationRequestRepository
        extends JpaRepository<AccommodationRequestEntity, Long> {

    List<AccommodationRequestEntity>
    findByFacultyIdOrderByCheckInDesc(Long facultyId);

    List<AccommodationRequestEntity>
    findByRoomIdAndStatusNot(
            Long roomId,
            String status
    );
    @Query("""
        SELECT COUNT(a) > 0
        FROM AccommodationRequestEntity a
        WHERE a.room.id = :roomId
        AND a.status <> 'CANCELLED'
        AND a.checkIn < :checkOut
        AND a.checkOut > :checkIn
    """)
    boolean existsOverlappingBooking(
            @Param("roomId") Long roomId,
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut
    );
}