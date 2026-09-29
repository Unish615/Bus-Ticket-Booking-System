package com.busbooking.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_code", nullable = false, unique = true, length = 50)
    private String bookingCode;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "schedule_id", nullable = false)
    private Schedule schedule;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "service_fee", precision = 10, scale = 2)
    private BigDecimal serviceFee = BigDecimal.valueOf(50.00);

    @Column(name = "booking_status", nullable = false, length = 30)
    private String bookingStatus = "CONFIRMED"; // CONFIRMED, CANCELLED, COMPLETED

    @Column(name = "payment_status", nullable = false, length = 30)
    private String paymentStatus = "PAID"; // PAID, REFUNDED, PENDING

    @Column(name = "tracking_status", nullable = false, length = 30)
    private String trackingStatus = "BOOKING_CONFIRMED"; // BOOKING_CONFIRMED, BUS_ASSIGNED, BOARDING, ON_THE_WAY, ARRIVED

    @Column(name = "cancellation_fee", precision = 10, scale = 2)
    private BigDecimal cancellationFee = BigDecimal.ZERO;

    @Column(name = "refund_amount", precision = 10, scale = 2)
    private BigDecimal refundAmount = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<BookingPassenger> passengers = new ArrayList<>();

    public Booking() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public void setBookingCode(String bookingCode) {
        this.bookingCode = bookingCode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Schedule getSchedule() {
        return schedule;
    }

    public void setSchedule(Schedule schedule) {
        this.schedule = schedule;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getServiceFee() {
        return serviceFee;
    }

    public void setServiceFee(BigDecimal serviceFee) {
        this.serviceFee = serviceFee;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTrackingStatus() {
        return trackingStatus;
    }

    public void setTrackingStatus(String trackingStatus) {
        this.trackingStatus = trackingStatus;
    }

    public BigDecimal getCancellationFee() {
        return cancellationFee;
    }

    public void setCancellationFee(BigDecimal cancellationFee) {
        this.cancellationFee = cancellationFee;
    }

    public BigDecimal getRefundAmount() {
        return refundAmount;
    }

    public void setRefundAmount(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<BookingPassenger> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<BookingPassenger> passengers) {
        this.passengers = passengers;
    }

    public void addPassenger(BookingPassenger passenger) {
        passengers.add(passenger);
        passenger.setBooking(this);
    }
}
