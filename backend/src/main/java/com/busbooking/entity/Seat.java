package com.busbooking.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"bus_id", "seat_number"})
})
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;

    @Column(name = "seat_number", nullable = false, length = 10)
    private String seatNumber; // e.g. A1, A2, A3, B1...

    @Column(name = "seat_type", length = 30)
    private String seatType = "STANDARD"; // WINDOW, AISLE, STANDARD

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    public Seat() {}

    public Seat(Bus bus, String seatNumber, String seatType) {
        this.bus = bus;
        this.seatNumber = seatNumber;
        this.seatType = seatType;
        this.isActive = true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Bus getBus() {
        return bus;
    }

    public void setBus(Bus bus) {
        this.bus = bus;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public String getSeatType() {
        return seatType;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
