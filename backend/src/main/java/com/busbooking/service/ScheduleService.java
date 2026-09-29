package com.busbooking.service;

import com.busbooking.dto.ScheduleRequest;
import com.busbooking.dto.ScheduleResponse;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Route;
import com.busbooking.entity.Schedule;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BookingPassengerRepository bookingPassengerRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<ScheduleResponse> getAllSchedules() {
        return scheduleRepository.findAll()
                .stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> getSchedulesByOperator(Long operatorId) {
        return scheduleRepository.findByBusOperatorId(operatorId)
                .stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> searchSchedules(String from, String to, LocalDate travelDate) {
        List<Schedule> schedules;
        if (from != null && to != null && travelDate != null) {
            schedules = scheduleRepository.searchSchedules(from.trim(), to.trim(), travelDate);
        } else if (travelDate != null) {
            schedules = scheduleRepository.findByTravelDate(travelDate);
        } else {
            schedules = scheduleRepository.findByStatus("ACTIVE");
        }

        return schedules.stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public ScheduleResponse getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        return toScheduleResponse(schedule);
    }

    @Transactional
    public ScheduleResponse createSchedule(ScheduleRequest request) {
        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + request.getBusId()));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + request.getRouteId()));

        Schedule schedule = new Schedule();
        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setTravelDate(request.getTravelDate());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setPrice(request.getPrice());
        schedule.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        Schedule saved = scheduleRepository.save(schedule);
        return toScheduleResponse(saved);
    }

    @Transactional
    public ScheduleResponse updateSchedule(Long id, ScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + request.getBusId()));

        Route route = routeRepository.findById(request.getRouteId())
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + request.getRouteId()));

        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setTravelDate(request.getTravelDate());
        schedule.setDepartureTime(request.getDepartureTime());
        schedule.setArrivalTime(request.getArrivalTime());
        schedule.setPrice(request.getPrice());
        schedule.setStatus(request.getStatus());

        Schedule updated = scheduleRepository.save(schedule);
        return toScheduleResponse(updated);
    }

    @Transactional
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + id));
        scheduleRepository.delete(schedule);
    }

    public ScheduleResponse toScheduleResponse(Schedule schedule) {
        ScheduleResponse resp = new ScheduleResponse();
        resp.setId(schedule.getId());
        resp.setBusId(schedule.getBus().getId());
        resp.setBusName(schedule.getBus().getBusName());
        resp.setBusNumber(schedule.getBus().getBusNumber());
        resp.setBusType(schedule.getBus().getBusType());
        resp.setOperatorName(schedule.getBus().getOperator().getName());
        resp.setOperatorId(schedule.getBus().getOperator().getId());
        resp.setAmenities(schedule.getBus().getAmenities());
        resp.setSeatCapacity(schedule.getBus().getSeatCapacity());

        resp.setRouteId(schedule.getRoute().getId());
        resp.setSource(schedule.getRoute().getSource());
        resp.setDestination(schedule.getRoute().getDestination());
        resp.setDistance(schedule.getRoute().getDistance());
        resp.setDuration(schedule.getRoute().getDuration());

        resp.setTravelDate(schedule.getTravelDate());
        resp.setDepartureTime(schedule.getDepartureTime());
        resp.setArrivalTime(schedule.getArrivalTime());
        resp.setPrice(schedule.getPrice());
        resp.setStatus(schedule.getStatus());

        // Booked seats and available seats
        List<String> booked = bookingPassengerRepository.findBookedSeatsByScheduleId(schedule.getId());
        resp.setBookedSeats(booked);
        int available = Math.max(0, schedule.getBus().getSeatCapacity() - booked.size());
        resp.setAvailableSeats(available);

        // Rating
        Double avg = reviewRepository.getAverageRatingForBus(schedule.getBus().getId());
        resp.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 4.5);
        Long count = reviewRepository.getReviewCountForBus(schedule.getBus().getId());
        resp.setReviewCount(count != null ? count : 0L);

        return resp;
    }
}
