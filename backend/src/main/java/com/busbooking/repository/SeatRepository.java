package com.busbooking.repository;

import com.busbooking.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByBusIdOrderBySeatNumberAsc(Long busId);
    List<Seat> findByBusIdAndIsActiveTrueOrderBySeatNumberAsc(Long busId);
    void deleteByBusId(Long busId);
}
