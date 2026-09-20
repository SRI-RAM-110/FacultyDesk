package com.facultydesk.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "transport_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransportRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String requestedBy;

    private String department;

    private String purpose;

    private String tripType;

    private String source;

    private String pickupPoint;

    private String destination;

    private LocalDate departureDate;

    private LocalTime departureTime;

    private LocalDate returnDate;

    private LocalTime returnTime;

    private Integer students;

    private Integer facultyCount;

    private Integer totalPassengers;

    private String vehiclePreference;

    private Long busId;

    private String busNumber;

    private String vehicleType;

    public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRequestedBy() {
		return requestedBy;
	}

	public void setRequestedBy(String requestedBy) {
		this.requestedBy = requestedBy;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getPurpose() {
		return purpose;
	}

	public void setPurpose(String purpose) {
		this.purpose = purpose;
	}

	public String getTripType() {
		return tripType;
	}

	public void setTripType(String tripType) {
		this.tripType = tripType;
	}

	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public String getPickupPoint() {
		return pickupPoint;
	}

	public void setPickupPoint(String pickupPoint) {
		this.pickupPoint = pickupPoint;
	}

	public String getDestination() {
		return destination;
	}

	public void setDestination(String destination) {
		this.destination = destination;
	}

	public LocalDate getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(LocalDate departureDate) {
		this.departureDate = departureDate;
	}

	public LocalTime getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(LocalTime departureTime) {
		this.departureTime = departureTime;
	}

	public LocalDate getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(LocalDate returnDate) {
		this.returnDate = returnDate;
	}

	public LocalTime getReturnTime() {
		return returnTime;
	}

	public void setReturnTime(LocalTime returnTime) {
		this.returnTime = returnTime;
	}

	public Integer getStudents() {
		return students;
	}

	public void setStudents(Integer students) {
		this.students = students;
	}

	public Integer getFacultyCount() {
		return facultyCount;
	}

	public void setFacultyCount(Integer facultyCount) {
		this.facultyCount = facultyCount;
	}

	public Integer getTotalPassengers() {
		return totalPassengers;
	}

	public void setTotalPassengers(Integer totalPassengers) {
		this.totalPassengers = totalPassengers;
	}

	public String getVehiclePreference() {
		return vehiclePreference;
	}

	public void setVehiclePreference(String vehiclePreference) {
		this.vehiclePreference = vehiclePreference;
	}

	public String getBusNumber() {
		return busNumber;
	}

	public void setBusNumber(String busNumber) {
		this.busNumber = busNumber;
	}

	public String getVehicleType() {
		return vehicleType;
	}

	public void setVehicleType(String vehicleType) {
		this.vehicleType = vehicleType;
	}

	public String getDriverName() {
		return driverName;
	}

	public void setDriverName(String driverName) {
		this.driverName = driverName;
	}

	public String getDriverPhone() {
		return driverPhone;
	}

	public void setDriverPhone(String driverPhone) {
		this.driverPhone = driverPhone;
	}

	public String getAdditionalInfo() {
		return additionalInfo;
	}

	public void setAdditionalInfo(String additionalInfo) {
		this.additionalInfo = additionalInfo;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public void setBusId(Long busId) {
		this.busId = busId;
	}

	public Long getBusId() {
		return busId;
	}

	private String driverName;

    private String driverPhone;

    @Column(columnDefinition = "TEXT")
    private String additionalInfo;

    private String status;

	
}