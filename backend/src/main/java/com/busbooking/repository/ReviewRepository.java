package com.busbooking.repository;

import com.busbooking.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBusIdOrderByCreatedAtDesc(Long busId);
    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.bus.id = :busId")
    Double getAverageRatingForBus(@Param("busId") Long busId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.bus.id = :busId")
    Long getReviewCountForBus(@Param("busId") Long busId);
}
