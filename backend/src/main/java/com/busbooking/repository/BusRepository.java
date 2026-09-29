package com.busbooking.repository;

import com.busbooking.entity.Bus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BusRepository extends JpaRepository<Bus, Long> {
    List<Bus> findByOperatorId(Long operatorId);
    List<Bus> findByStatus(String status);
    Optional<Bus> findByBusNumber(String busNumber);
    boolean existsByBusNumber(String busNumber);
}
