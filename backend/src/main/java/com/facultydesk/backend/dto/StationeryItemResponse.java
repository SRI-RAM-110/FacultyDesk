package com.facultydesk.backend.dto;

import java.math.BigDecimal;

public class StationeryItemResponse {

    private Long id;
    private String name;
    private String category;
    private String description;
    private BigDecimal price;
    private Boolean active;

    public StationeryItemResponse() {
    }

    public StationeryItemResponse(
            Long id,
            String name,
            String category,
            String description,
            BigDecimal price,
            Boolean active
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.price = price;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Boolean getActive() {
        return active;
    }
}