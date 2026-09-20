package com.facultydesk.backend.service;

import com.facultydesk.backend.dto.MaintenanceRequestDto;
import com.facultydesk.backend.entity.Faculty;
import com.facultydesk.backend.entity.MaintenanceRequest;
import com.facultydesk.backend.repository.MaintenanceRequestRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaintenanceService {

    private final MaintenanceRequestRepository maintenanceRequestRepository;

    public MaintenanceService(
            MaintenanceRequestRepository maintenanceRequestRepository
    ) {
        this.maintenanceRequestRepository =
                maintenanceRequestRepository;
    }


    // CREATE MAINTENANCE REQUEST

    public MaintenanceRequest createRequest(
            MaintenanceRequestDto dto,
            Faculty faculty
    ) {

        validateRequest(dto);

        MaintenanceRequest request =
                new MaintenanceRequest();

        // IMPORTANT:
        // Do not trust frontend requestedBy / department.
        request.setRequestedBy(faculty.getName());
        request.setDepartment(faculty.getBranch());

        request.setBlock(dto.getBlock());
        request.setFloor(dto.getFloor());
        request.setRoomArea(dto.getRoomArea());
        request.setSpecificLocation(dto.getSpecificLocation());

        request.setCategory(dto.getCategory());
        request.setIssueType(dto.getIssueType());
        request.setQuantity(dto.getQuantity());

        request.setPriority(dto.getPriority());
        request.setDescription(dto.getDescription());
        request.setAdditionalInfo(dto.getAdditionalInfo());

        // Backend controlled status
        request.setStatus("Pending");

        return maintenanceRequestRepository.save(request);
    }


    // GET LOGGED-IN USER REQUESTS

    public List<MaintenanceRequest> getMyRequests(
            Faculty faculty
    ) {

        return maintenanceRequestRepository
                .findByRequestedByOrderByIdDesc(
                        faculty.getName()
                );
    }


    // GET REQUEST BY ID

    public MaintenanceRequest getRequestById(
            Long id,
            Faculty faculty
    ) {

        MaintenanceRequest request =
                maintenanceRequestRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Maintenance request not found"
                                )
                        );

        // Ownership check
        if (!request.getRequestedBy()
                .equals(faculty.getName())) {

            throw new SecurityException(
                    "You are not authorized to access this request"
            );
        }

        return request;
    }


    // UPDATE STATUS

    public MaintenanceRequest updateStatus(
            Long id,
            String status
    ) {

        MaintenanceRequest request =
                maintenanceRequestRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Maintenance request not found"
                                )
                        );

        if (status == null || status.isBlank()) {
            throw new IllegalArgumentException(
                    "Status is required"
            );
        }

        String normalizedStatus =
                status.trim();

        if (!isValidStatus(normalizedStatus)) {
            throw new IllegalArgumentException(
                    "Invalid maintenance status"
            );
        }

        request.setStatus(normalizedStatus);

        return maintenanceRequestRepository.save(request);
    }


    // VALIDATE REQUEST

    private void validateRequest(
            MaintenanceRequestDto dto
    ) {

        if (dto == null) {
            throw new IllegalArgumentException(
                    "Maintenance request data is required"
            );
        }

        if (isBlank(dto.getBlock())) {
            throw new IllegalArgumentException(
                    "Block is required"
            );
        }

        if (isBlank(dto.getFloor())) {
            throw new IllegalArgumentException(
                    "Floor is required"
            );
        }

        if (isBlank(dto.getRoomArea())) {
            throw new IllegalArgumentException(
                    "Room / Area is required"
            );
        }

        if (isBlank(dto.getCategory())) {
            throw new IllegalArgumentException(
                    "Category is required"
            );
        }

        if (isBlank(dto.getIssueType())) {
            throw new IllegalArgumentException(
                    "Issue type is required"
            );
        }

        if (dto.getQuantity() == null ||
                dto.getQuantity() <= 0) {

            throw new IllegalArgumentException(
                    "Quantity must be greater than zero"
            );
        }

        if (isBlank(dto.getPriority())) {
            throw new IllegalArgumentException(
                    "Priority is required"
            );
        }

        if (isBlank(dto.getDescription())) {
            throw new IllegalArgumentException(
                    "Description is required"
            );
        }

        validateCategoryAndIssueType(
                dto.getCategory(),
                dto.getIssueType()
        );

        validatePriority(
                dto.getPriority()
        );
    }


    private boolean isBlank(String value) {
        return value == null ||
                value.trim().isEmpty();
    }


    // VALID PRIORITY

    private void validatePriority(
            String priority
    ) {

        if (!priority.equalsIgnoreCase("Low") &&
                !priority.equalsIgnoreCase("Medium") &&
                !priority.equalsIgnoreCase("High") &&
                !priority.equalsIgnoreCase("Urgent")) {

            throw new IllegalArgumentException(
                    "Invalid priority"
            );
        }
    }


    // VALID CATEGORY + ISSUE TYPE

    private void validateCategoryAndIssueType(
            String category,
            String issueType
    ) {

        boolean valid = false;

        switch (category) {

            case "Electrical":
                valid =
                        List.of(
                                "Fan",
                                "Light",
                                "Switch",
                                "Socket",
                                "Electrical Wiring",
                                "Other"
                        ).contains(issueType);
                break;

            case "Carpentry":
                valid =
                        List.of(
                                "Table",
                                "Chair",
                                "Bench",
                                "Door",
                                "Window",
                                "Cupboard",
                                "Other"
                        ).contains(issueType);
                break;

            case "Furniture":
                valid =
                        List.of(
                                "Table",
                                "Chair",
                                "Desk",
                                "Bench",
                                "Cupboard",
                                "Other"
                        ).contains(issueType);
                break;

            case "Plumbing":
                valid =
                        List.of(
                                "Tap",
                                "Wash Basin",
                                "Pipeline",
                                "Water Leakage",
                                "Toilet",
                                "Other"
                        ).contains(issueType);
                break;

            case "Civil":
                valid =
                        List.of(
                                "Wall",
                                "Floor",
                                "Ceiling",
                                "Roof",
                                "Door",
                                "Window",
                                "Other"
                        ).contains(issueType);
                break;

            case "IT / Networking":
                valid =
                        List.of(
                                "Computer",
                                "Projector",
                                "Network Point",
                                "Wi-Fi",
                                "LAN Cable",
                                "Other"
                        ).contains(issueType);
                break;

            case "Cleaning":
                valid =
                        List.of(
                                "Room Cleaning",
                                "Dustbin",
                                "Washroom Cleaning",
                                "Other"
                        ).contains(issueType);
                break;

            case "Other":
                valid =
                        "Other".equals(issueType);
                break;

            default:
                throw new IllegalArgumentException(
                        "Invalid maintenance category"
                );
        }

        if (!valid) {
            throw new IllegalArgumentException(
                    "Invalid issue type for selected category"
            );
        }
    }


    // VALID STATUS

    private boolean isValidStatus(
            String status
    ) {

        return status.equalsIgnoreCase("Pending")
                || status.equalsIgnoreCase("In Progress")
                || status.equalsIgnoreCase("Resolved")
                || status.equalsIgnoreCase("Rejected")
                || status.equalsIgnoreCase("Cancelled");
    }
}