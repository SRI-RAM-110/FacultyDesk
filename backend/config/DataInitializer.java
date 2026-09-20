package com.facultydesk.backend.config;

import com.facultydesk.backend.entity.SeminarHall;
import com.facultydesk.backend.repository.SeminarHallRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initializeSeminarHalls(
            SeminarHallRepository hallRepository
    ) {
        return args -> {

            if (hallRepository.findByActiveTrue().isEmpty()) {

                hallRepository.save(
                        new SeminarHall(
                                "Main Seminar Hall",
                                "Block A",
                                300,
                                "Projector, AC, Audio System, Wi-Fi",
                                true
                        )
                );

                hallRepository.save(
                        new SeminarHall(
                                "Mini Seminar Hall",
                                "Block B",
                                150,
                                "Projector, AC, Audio System",
                                true
                        )
                );

                hallRepository.save(
                        new SeminarHall(
                                "Conference Hall",
                                "Administrative Block",
                                100,
                                "Projector, AC, Video Conferencing, Wi-Fi",
                                true
                        )
                );
            }
        };
    }
}