package com.busbooking.repository;

import com.busbooking.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Query("SELECT s FROM Schedule s " +
           "WHERE LOWER(s.route.source) = LOWER(:from) " +
           "AND LOWER(s.route.destination) = LOWER(:to) " +
           "AND s.travelDate = :travelDate " +
           "AND s.status = 'ACTIVE'")
    List<Schedule> searchSchedules(
            @Param("from") String from,
            @Param("to") String to,
            @Param("travelDate") LocalDate travelDate
    );

    List<Schedule> findByBusId(Long busId);

    List<Schedule> findByBusOperatorId(Long operatorId);

    List<Schedule> findByTravelDate(LocalDate travelDate);

    List<Schedule> findByStatus(String status);
}
