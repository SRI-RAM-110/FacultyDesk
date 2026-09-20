package com.facultydesk.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "accommodation_rooms")
public class AccommodationRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String hostel;

    @Column(nullable = false)
    private String roomName;

    @Column(nullable = false)
    private String roomType;

    @Column(nullable = false)
    private Integer capacity;

    @Column(length = 500)
    private String facilities;

    @Column(nullable = false)
    private Boolean active = true;

    public AccommodationRoom() {
    }

    public AccommodationRoom(
            String hostel,
            String roomName,
            String roomType,
            Integer capacity,
            String facilities,
            Boolean active
    ) {
        this.hostel = hostel;
        this.roomName = roomName;
        this.roomType = roomType;
        this.capacity = capacity;
        this.facilities = facilities;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getHostel() {
        return hostel;
    }

    public void setHostel(String hostel) {
        this.hostel = hostel;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getFacilities() {
        return facilities;
    }

    public void setFacilities(String facilities) {
        this.facilities = facilities;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}