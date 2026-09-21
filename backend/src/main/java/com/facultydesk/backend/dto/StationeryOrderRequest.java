package com.facultydesk.backend.dto;

import java.util.List;

public class StationeryOrderRequest {

    private List<StationeryOrderItemRequest> items;

    public StationeryOrderRequest() {
    }

    public List<StationeryOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<StationeryOrderItemRequest> items) {
        this.items = items;
    }
}