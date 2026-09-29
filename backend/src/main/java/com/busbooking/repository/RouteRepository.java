package com.busbooking.repository;

import com.busbooking.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findBySourceIgnoreCaseAndDestinationIgnoreCase(String source, String destination);
    List<Route> findBySourceContainingIgnoreCase(String source);
    List<Route> findByDestinationContainingIgnoreCase(String destination);
}
