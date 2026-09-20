package com.facultydesk.backend.config;

import com.facultydesk.backend.entity.Bus;
import com.facultydesk.backend.repository.BusRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class BusDataInitializer {

    @Bean
    CommandLineRunner initializeBuses(
            BusRepository busRepository
    ) {

        return args -> {

            if (busRepository.count() == 0) {

                busRepository.save(
                        new Bus(
                                null,
                                "NEC-BUS-01",
                                "AC Bus",
                                50,
                                "Ramesh Kumar",
                                "9XXXXXXXXX",
                                true
                        )
                );

                busRepository.save(
                        new Bus(
                                null,
                                "NEC-BUS-03",
                                "Non-AC Bus",
                                45,
                                "Suresh Kumar",
                                "9XXXXXXXXX",
                                true
                        )
                );

                busRepository.save(
                        new Bus(
                                null,
                                "NEC-VAN-02",
                                "College Van",
                                14,
                                "Anil Kumar",
                                "9XXXXXXXXX",
                                true
                        )
                );

                System.out.println(
                        "Default transport vehicles inserted."
                );
            }
        };
    }
}