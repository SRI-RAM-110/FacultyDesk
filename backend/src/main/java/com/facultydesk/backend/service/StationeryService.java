package com.facultydesk.backend.service;

import com.facultydesk.backend.dto.*;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.entity.StationeryItem;
import com.facultydesk.backend.entity.StationeryOrder;
import com.facultydesk.backend.entity.StationeryOrderItem;
import com.facultydesk.backend.repository.StationeryItemRepository;
import com.facultydesk.backend.repository.StationeryOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class StationeryService {

    private static final String PAYMENT_NOT_REQUIRED = "NOT_REQUIRED";
    private static final List<String> ALLOWED_STATUSES = List.of(
            "PENDING", "APPROVED", "REJECTED", "CANCELLED", "COMPLETED"
    );

    private final StationeryItemRepository itemRepository;
    private final StationeryOrderRepository orderRepository;

    public StationeryService(StationeryItemRepository itemRepository,
                             StationeryOrderRepository orderRepository) {
        this.itemRepository = itemRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<StationeryItemResponse> getActiveItems(String category, String search) {
        boolean hasCategory = category != null && !category.isBlank();
        boolean hasSearch = search != null && !search.isBlank();
        List<StationeryItem> items;

        if (hasCategory) {
            items = itemRepository.findByCategoryAndActiveTrueOrderByIdAsc(category.trim());
        } else if (hasSearch) {
            items = itemRepository.findByActiveTrueAndNameContainingIgnoreCaseOrderByIdAsc(search.trim());
        } else {
            items = itemRepository.findByActiveTrueOrderByIdAsc();
        }

        if (hasCategory && hasSearch) {
            String query = search.trim().toLowerCase(Locale.ROOT);
            items = items.stream()
                    .filter(item -> item.getName().toLowerCase(Locale.ROOT).contains(query))
                    .toList();
        }
        return items.stream().map(this::toItemResponse).toList();
    }

    @Transactional(readOnly = true)
    public StationeryItemResponse getActiveItem(Long id) {
        StationeryItem item = itemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stationery item not found: " + id));
        if (!Boolean.TRUE.equals(item.getActive())) {
            throw new IllegalArgumentException("Stationery item is not active: " + id);
        }
        return toItemResponse(item);
    }

    @Transactional
    public StationeryOrderResponse createOrder(StationeryOrderRequest request, Faculty faculty) {
        if (faculty == null) {
            throw new IllegalStateException("Authenticated faculty not found");
        }
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one stationery item");
        }

        StationeryOrder order = new StationeryOrder();
        order.setFaculty(faculty);
        order.setOrderNumber(generateOrderNumber());
        order.setPaymentStatus(PAYMENT_NOT_REQUIRED);
        order.setStatus("PENDING");
        BigDecimal total = BigDecimal.ZERO;

        for (StationeryOrderItemRequest itemRequest : request.getItems()) {
            if (itemRequest == null || itemRequest.getItemId() == null) {
                throw new IllegalArgumentException("Each order item must contain a valid itemId");
            }
            if (itemRequest.getQuantity() == null || itemRequest.getQuantity() < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }

            StationeryItem item = itemRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Stationery item not found: " + itemRequest.getItemId()));
            if (!Boolean.TRUE.equals(item.getActive())) {
                throw new IllegalArgumentException("Stationery item is inactive: " + item.getName());
            }
            BigDecimal databasePrice = item.getPrice();
            if (databasePrice == null || databasePrice.compareTo(BigDecimal.ZERO) <= 0) {
                throw new IllegalStateException("Invalid database price for stationery item: " + item.getId());
            }

            BigDecimal subtotal = databasePrice.multiply(BigDecimal.valueOf(itemRequest.getQuantity()));
            StationeryOrderItem orderItem = new StationeryOrderItem();
            orderItem.setStationeryItem(item);
            orderItem.setItemName(item.getName());
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setUnitPrice(databasePrice);
            orderItem.setSubtotal(subtotal);
            order.addItem(orderItem);
            total = total.add(subtotal);
        }

        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Order total must be greater than zero");
        }
        order.setTotalAmount(total);
        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<StationeryOrderResponse> getMyOrders(Faculty faculty) {
        requireFaculty(faculty);
        return orderRepository.findByFacultyOrderByCreatedAtDesc(faculty)
                .stream().map(this::toOrderResponse).toList();
    }

    @Transactional(readOnly = true)
    public StationeryOrderResponse getMyOrderById(Long id, Faculty faculty) {
        requireFaculty(faculty);
        StationeryOrder order = orderRepository.findByIdAndFaculty(id, faculty)
                .orElseThrow(() -> new IllegalArgumentException("Stationery order not found"));
        return toOrderResponse(order);
    }

    @Transactional
    public StationeryOrderResponse updateOrderStatus(Long id, String status) {
        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException("Status is required");
        }
        String normalizedStatus = status.trim().toUpperCase(Locale.ROOT);
        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException("Invalid status. Allowed values: " + ALLOWED_STATUSES);
        }
        StationeryOrder order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stationery order not found"));
        order.setStatus(normalizedStatus);
        return toOrderResponse(orderRepository.save(order));
    }

    @Transactional
    public StationeryOrderResponse cancelOrder(Long id, Faculty faculty) {
        requireFaculty(faculty);
        StationeryOrder order = orderRepository.findByIdAndFaculty(id, faculty)
                .orElseThrow(() -> new IllegalArgumentException("Stationery order not found"));
        if (!"PENDING".equals(order.getStatus())) {
            throw new IllegalStateException("Only PENDING stationery orders can be cancelled");
        }
        order.setStatus("CANCELLED");
        return toOrderResponse(orderRepository.save(order));
    }

    private void requireFaculty(Faculty faculty) {
        if (faculty == null) {
            throw new IllegalStateException("Authenticated faculty not found");
        }
    }

    private String generateOrderNumber() {
        String date = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE);
        String orderNumber;
        do {
            orderNumber = "STN-" + date + "-" + UUID.randomUUID().toString()
                    .substring(0, 6).toUpperCase(Locale.ROOT);
        } while (orderRepository.existsByOrderNumber(orderNumber));
        return orderNumber;
    }

    private StationeryItemResponse toItemResponse(StationeryItem item) {
        return new StationeryItemResponse(item.getId(), item.getName(), item.getCategory(),
                item.getDescription(), item.getPrice(), item.getActive());
    }

    private StationeryOrderResponse toOrderResponse(StationeryOrder order) {
        StationeryOrderResponse response = new StationeryOrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        Faculty faculty = order.getFaculty();
        response.setFacultyId(faculty.getId());
        response.setFacultyName(faculty.getName());
        response.setDepartment(faculty.getBranch());
        response.setTotalAmount(order.getTotalAmount());
        response.setPaymentStatus(order.getPaymentStatus());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        List<StationeryOrderItemResponse> itemResponses = new ArrayList<>();
        for (StationeryOrderItem item : order.getItems()) {
            itemResponses.add(new StationeryOrderItemResponse(item.getStationeryItem().getId(),
                    item.getItemName(), item.getQuantity(), item.getUnitPrice(), item.getSubtotal()));
        }
        response.setItems(itemResponses);
        return response;
    }
}