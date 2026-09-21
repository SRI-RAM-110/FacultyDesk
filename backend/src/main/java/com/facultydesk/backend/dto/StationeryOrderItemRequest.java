package com.facultydesk.backend.dto;

import java.math.BigDecimal;

public class StationeryOrderItemRequest {

    private Long itemId;

    // Accepted for current frontend compatibility.
    // Backend does NOT trust this value.
    private String name;

    private Integer quantity;

    // Accepted for current frontend compatibility.
    // Backend does NOT trust this value.
    private BigDecimal price;

    public StationeryOrderItemRequest() {
    }

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }
}