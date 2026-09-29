package com.busbooking.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class BookingRequest {

    @NotNull(message = "Schedule ID is required")
    private Long scheduleId;

    @NotEmpty(message = "At least one passenger must be specified")
    @Valid
    private List<PassengerDto> passengers;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // eSewa, Khalti, Card, Cash

    public BookingRequest() {}

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public List<PassengerDto> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<PassengerDto> passengers) {
        this.passengers = passengers;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
