package com.busbooking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "buses")
public class Bus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bus_name", nullable = false, length = 100)
    private String busName;

    @Column(name = "bus_number", nullable = false, unique = true, length = 50)
    private String busNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "operator_id", nullable = false)
    private User operator;

    @Column(name = "bus_type", nullable = false, length = 50)
    private String busType; // AC Deluxe, Super Deluxe, Tourist AC, Luxury Sleeper

    @Column(name = "seat_capacity", nullable = false)
    private Integer seatCapacity;

    @Column(columnDefinition = "TEXT")
    private String amenities; // e.g. "WiFi, AC, Charging Port, Water Bottle, TV, Blanket"

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE"; // ACTIVE, MAINTENANCE, INACTIVE

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Bus() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public User getOperator() {
        return operator;
    }

    public void setOperator(User operator) {
        this.operator = operator;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
