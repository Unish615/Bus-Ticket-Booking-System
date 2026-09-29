package com.busbooking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BusRequest {

    @NotBlank(message = "Bus name is required")
    private String busName;

    @NotBlank(message = "Bus number is required")
    private String busNumber;

    @NotNull(message = "Operator ID is required")
    private Long operatorId;

    @NotBlank(message = "Bus type is required")
    private String busType;

    @NotNull(message = "Seat capacity is required")
    @Min(value = 10, message = "Seat capacity must be at least 10")
    private Integer seatCapacity;

    private String amenities;

    private String status = "ACTIVE";

    public BusRequest() {}

    public String getBusName() {
        return busName;
    }

    public void setBusName(String busName) {
        this.busName = busName;
    }

    public String getBusNumber() {
        return busNumber;
    }

    public void setBusNumber(String busNumber) {
        this.busNumber = busNumber;
    }

    public Long getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(Long operatorId) {
        this.operatorId = operatorId;
    }

    public String getBusType() {
        return busType;
    }

    public void setBusType(String busType) {
        this.busType = busType;
    }

    public Integer getSeatCapacity() {
        return seatCapacity;
    }

    public void setSeatCapacity(Integer seatCapacity) {
        this.seatCapacity = seatCapacity;
    }

    public String getAmenities() {
        return amenities;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
