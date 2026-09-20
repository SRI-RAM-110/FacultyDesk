package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.SeminarBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface SeminarBookingRepository
        extends JpaRepository<SeminarBooking, Long> {

    List<SeminarBooking> findByFacultyIdOrderByBookingDateDesc(
            Long facultyId
    );

    List<SeminarBooking> findByBookingDateAndHallId(
            LocalDate bookingDate,
            Long hallId
    );

    boolean existsByHallIdAndBookingDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long hallId,
            LocalDate bookingDate,
            LocalTime endTime,
            LocalTime startTime
    );
}