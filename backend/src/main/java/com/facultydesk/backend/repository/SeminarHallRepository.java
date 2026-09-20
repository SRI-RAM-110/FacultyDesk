package com.facultydesk.backend.repository;

import com.facultydesk.backend.entity.SeminarHall;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SeminarHallRepository extends JpaRepository<SeminarHall, Long> {

    List<SeminarHall> findByActiveTrue();

}