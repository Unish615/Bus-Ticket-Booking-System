package com.busbooking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PassengerDto {

    @NotBlank(message = "Seat number is required")
    private String seatNumber;

    @NotBlank(message = "Passenger name is required")
    private String passengerName;

    @NotNull(message = "Age is required")
    @Min(value = 1, message = "Age must be at least 1")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    public PassengerDto() {}

    public PassengerDto(String seatNumber, String passengerName, Integer age, String gender, String phone, String email) {
        this.seatNumber = seatNumber;
        this.passengerName = passengerName;
        this.age = age;
        this.gender = gender;
        this.phone = phone;
        this.email = email;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
