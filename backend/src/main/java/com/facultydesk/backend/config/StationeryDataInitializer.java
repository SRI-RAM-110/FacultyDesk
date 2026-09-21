package com.facultydesk.backend.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.facultydesk.backend.entity.StationeryItem;
import com.facultydesk.backend.repository.StationeryItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.math.BigDecimal;
import java.util.List;

@Configuration
public class StationeryDataInitializer {

    @Bean
    ObjectMapper objectMapper() {
        return new ObjectMapper();
    }

    @Bean
    CommandLineRunner initializeStationeryItems(
            StationeryItemRepository repository,
            ObjectMapper objectMapper) {
        return args -> {
            List<SeedItem> seedItems;
            try (InputStream inputStream = new ClassPathResource(
                    "stationery-items.json").getInputStream()) {
                seedItems = objectMapper.readValue(inputStream,
                        new TypeReference<List<SeedItem>>() {
                        });
            }

            int inserted = 0;
            int corrected = 0;
            for (SeedItem seed : seedItems) {
                if (seed.price == null || seed.price.compareTo(BigDecimal.ZERO) <= 0) {
                    throw new IllegalStateException("Invalid seed price for item " + seed.id);
                }

                StationeryItem item = repository.findById(seed.id)
                        .orElseGet(() -> repository.findByNameIgnoreCase(seed.name).orElse(null));

                if (item == null) {
                    repository.save(new StationeryItem(seed.name, seed.category,
                            seed.description, seed.price, Boolean.TRUE.equals(seed.active)));
                    inserted++;
                    continue;
                }

                boolean changed = false;
                if (item.getPrice() == null || item.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
                    item.setPrice(seed.price);
                    changed = true;
                }
                if (item.getName() == null || item.getName().isBlank()) {
                    item.setName(seed.name);
                    changed = true;
                }
                if (item.getCategory() == null || item.getCategory().isBlank()) {
                    item.setCategory(seed.category);
                    changed = true;
                }
                if (item.getDescription() == null) {
                    item.setDescription(seed.description);
                    changed = true;
                }
                if (item.getActive() == null) {
                    item.setActive(Boolean.TRUE.equals(seed.active));
                    changed = true;
                }
                if (changed) {
                    repository.save(item);
                    corrected++;
                }
            }

            long count = repository.count();
            if (count < seedItems.size()) {
                throw new IllegalStateException("Stationery seed verification failed. Expected at least "
                        + seedItems.size() + " records but found " + count);
            }
            System.out.println("Stationery initialization complete. Inserted: " + inserted
                    + ", corrected: " + corrected + ", total records: " + count);
        };
    }

    private static class SeedItem {
        public Long id;
        public String name;
        public String category;
        public String description;
        public BigDecimal price;
        public Boolean active;
    }
}