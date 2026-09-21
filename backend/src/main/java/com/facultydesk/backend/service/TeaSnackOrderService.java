package com.facultydesk.backend.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.facultydesk.backend.dto.TeaSnackOrderRequest;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.entity.TeaSnackOrder;
import com.facultydesk.backend.entity.TeaSnackOrderItem;
import com.facultydesk.backend.repository.FacultyRepository;
import com.facultydesk.backend.repository.TeaSnackOrderItemRepository;
import com.facultydesk.backend.repository.TeaSnackOrderRepository;

@Service
public class TeaSnackOrderService {

    private final TeaSnackOrderRepository orderRepository;

    private final TeaSnackOrderItemRepository itemRepository;

    private final FacultyRepository facultyRepository;

    public TeaSnackOrderService(
            TeaSnackOrderRepository orderRepository,
            TeaSnackOrderItemRepository itemRepository,
            FacultyRepository facultyRepository
    ) {
        this.orderRepository = orderRepository;
        this.itemRepository = itemRepository;
        this.facultyRepository = facultyRepository;
    }

    @Transactional
    public TeaSnackOrder createOrder(
            TeaSnackOrderRequest request
    ) {

        if (request.getFacultyId() == null) {
            throw new RuntimeException(
                    "Faculty information is required"
            );
        }

        if (
            request.getItems() == null ||
            request.getItems().isEmpty()
        ) {
            throw new RuntimeException(
                    "Please add at least one item"
            );
        }

        if (
            request.getBookingDate() == null ||
            request.getBookingTime() == null
        ) {
            throw new RuntimeException(
                    "Booking date and time are required"
            );
        }

        if (
            request.getPurpose() == null ||
            request.getPurpose().trim().isEmpty()
        ) {
            throw new RuntimeException(
                    "Purpose is required"
            );
        }

        Faculty faculty =
                facultyRepository.findById(
                        request.getFacultyId()
                ).orElseThrow(() ->
                        new RuntimeException(
                                "Faculty not found"
                        )
                );

        LocalDate bookingDate;

        LocalTime bookingTime;

        try {

            bookingDate =
                    LocalDate.parse(
                            request.getBookingDate()
                    );

            bookingTime =
                    LocalTime.parse(
                            request.getBookingTime()
                    );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Invalid booking date or time"
            );
        }

        double totalPrice = 0;

        for (
                TeaSnackOrderRequest.OrderItemRequest item
                : request.getItems()
        ) {

            if (
                item.getItemId() == null ||
                item.getItemName() == null ||
                item.getQuantity() == null ||
                item.getUnitPrice() == null
            ) {

                throw new RuntimeException(
                        "Invalid order item"
                );
            }

            if (item.getQuantity() < 1) {

                throw new RuntimeException(
                        "Item quantity must be at least 1"
                );
            }

            if (item.getUnitPrice() < 0) {

                throw new RuntimeException(
                        "Invalid item price"
                );
            }

            totalPrice +=
                    item.getQuantity()
                    * item.getUnitPrice();
        }

        TeaSnackOrder order =
                new TeaSnackOrder();

        order.setOrderId(
                generateOrderId()
        );

        order.setFaculty(faculty);

        order.setBookingDate(
                bookingDate
        );

        order.setBookingTime(
                bookingTime
        );

        order.setPurpose(
                request.getPurpose().trim()
        );

        order.setInstructions(
                request.getInstructions()
        );

        order.setTotalPrice(
                totalPrice
        );

        order.setStatus(
                TeaSnackOrder.STATUS_PENDING
        );

        TeaSnackOrder savedOrder =
                orderRepository.save(order);

        List<TeaSnackOrderItem> savedItems =
                new ArrayList<>();

        for (
                TeaSnackOrderRequest.OrderItemRequest item
                : request.getItems()
        ) {

            TeaSnackOrderItem orderItem =
                    new TeaSnackOrderItem();

            orderItem.setOrder(
                    savedOrder
            );

            orderItem.setItemId(
                    item.getItemId()
            );

            orderItem.setItemName(
                    item.getItemName()
            );

            orderItem.setQuantity(
                    item.getQuantity()
            );

            orderItem.setUnitPrice(
                    item.getUnitPrice()
            );

            orderItem.setTotalPrice(
                    item.getQuantity()
                    * item.getUnitPrice()
            );

            TeaSnackOrderItem savedItem =
                    itemRepository.save(
                            orderItem
                    );

            savedItems.add(savedItem);
        }

        savedOrder.setItems(
                savedItems
        );

        return savedOrder;
    }

    public List<TeaSnackOrder>
    getFacultyOrders(Long facultyId) {

        return orderRepository
                .findByFacultyIdOrderByCreatedAtDesc(
                        facultyId
                );
    }

    public TeaSnackOrder
    getOrder(String orderId) {

        return orderRepository
                .findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tea & Snacks order not found"
                        )
                );
    }

    private String generateOrderId() {

        String orderId;

        do {

            String randomPart =
                    UUID.randomUUID()
                            .toString()
                            .substring(0, 6)
                            .toUpperCase();

            orderId =
                    "TS-" +
                    LocalDate.now()
                            .toString()
                            .replace("-", "") +
                    "-" +
                    randomPart;

        } while (
                orderRepository
                        .findByOrderId(orderId)
                        .isPresent()
        );

        return orderId;
    }
}