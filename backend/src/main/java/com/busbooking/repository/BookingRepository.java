package com.busbooking.repository;

import com.busbooking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingCode(String bookingCode);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Booking> findByScheduleBusOperatorIdOrderByCreatedAtDesc(Long operatorId);

    List<Booking> findByScheduleId(Long scheduleId);

    long countByBookingStatus(String bookingStatus);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt >= :startOfDay AND b.createdAt <= :endOfDay")
    long countTodayBookings(@Param("startOfDay") LocalDateTime startOfDay, @Param("endOfDay") LocalDateTime endOfDay);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.bookingStatus IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal calculateTotalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.schedule.bus.operator.id = :operatorId AND b.bookingStatus IN ('CONFIRMED', 'COMPLETED')")
    BigDecimal calculateOperatorRevenue(@Param("operatorId") Long operatorId);

    @Query("SELECT b FROM Booking b WHERE " +
           "(:status IS NULL OR b.bookingStatus = :status) AND " +
           "(:busId IS NULL OR b.schedule.bus.id = :busId) AND " +
           "(:routeId IS NULL OR b.schedule.route.id = :routeId) " +
           "ORDER BY b.createdAt DESC")
    List<Booking> filterBookings(
            @Param("status") String status,
            @Param("busId") Long busId,
            @Param("routeId") Long routeId
    );
}
