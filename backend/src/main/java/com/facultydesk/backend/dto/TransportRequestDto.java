package com.facultydesk.backend.dto;

import lombok.Data;

@Data
public class TransportRequestDto {

    private String requestedBy;

    private String department;

    private String purpose;

    private String tripType;

    private String source;

    private String pickupPoint;

    private String destination;

    private String departureDate;

    private String departureTime;

    private String returnDate;

    private String returnTime;

    private Integer students;

    private Integer faculty;

    private Integer totalPassengers;

    private String vehiclePreference;

    private Long busId;

    private String busNumber;

    private String vehicleType;

    private String driverName;
    
    private String driverPhone;
    
    private String additionalInfo;

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

	public String getDepartureDate() {
		return departureDate;
	}

	public void setDepartureDate(String departureDate) {
		this.departureDate = departureDate;
	}

	public String getDepartureTime() {
		return departureTime;
	}

	public void setDepartureTime(String departureTime) {
		this.departureTime = departureTime;
	}

	public String getReturnDate() {
		return returnDate;
	}

	public void setReturnDate(String returnDate) {
		this.returnDate = returnDate;
	}

	public String getReturnTime() {
		return returnTime;
	}

	public void setReturnTime(String returnTime) {
		this.returnTime = returnTime;
	}

	public Integer getStudents() {
		return students;
	}

	public void setStudents(Integer students) {
		this.students = students;
	}

	public Integer getFaculty() {
		return faculty;
	}

	public void setFaculty(Integer faculty) {
		this.faculty = faculty;
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

	public Long getBusId() {
		return busId;
	}

	public void setBusId(Long busId) {
		this.busId = busId;
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

}