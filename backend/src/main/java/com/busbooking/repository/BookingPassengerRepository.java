package com.busbooking.repository;

import com.busbooking.entity.BookingPassenger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingPassengerRepository extends JpaRepository<BookingPassenger, Long> {

    @Query("SELECT bp.seatNumber FROM BookingPassenger bp " +
           "WHERE bp.booking.schedule.id = :scheduleId " +
           "AND bp.booking.bookingStatus IN ('CONFIRMED', 'COMPLETED')")
    List<String> findBookedSeatsByScheduleId(@Param("scheduleId") Long scheduleId);

    List<BookingPassenger> findByBookingId(Long bookingId);
}
