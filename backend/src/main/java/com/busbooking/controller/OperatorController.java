package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BookingResponse;
import com.busbooking.dto.BusResponse;
import com.busbooking.dto.ScheduleResponse;
import com.busbooking.entity.User;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.UserRepository;
import com.busbooking.service.BookingService;
import com.busbooking.service.BusService;
import com.busbooking.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/operator")
@PreAuthorize("hasAnyRole('OPERATOR', 'ADMIN')")
public class OperatorController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusService busService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/buses")
    public ResponseEntity<ApiResponse<List<BusResponse>>> getOperatorBuses(@AuthenticationPrincipal UserDetails userDetails) {
        User operator = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        List<BusResponse> buses = busService.getBusesByOperator(operator.getId());
        return ResponseEntity.ok(ApiResponse.success("Operator buses loaded", buses));
    }

    @GetMapping("/schedules")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getOperatorSchedules(@AuthenticationPrincipal UserDetails userDetails) {
        User operator = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        List<ScheduleResponse> schedules = scheduleService.getSchedulesByOperator(operator.getId());
        return ResponseEntity.ok(ApiResponse.success("Operator schedules loaded", schedules));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getOperatorBookings(@AuthenticationPrincipal UserDetails userDetails) {
        User operator = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        List<BookingResponse> bookings = bookingService.getOperatorBookings(operator.getId());
        return ResponseEntity.ok(ApiResponse.success("Operator bookings loaded", bookings));
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getOperatorStats(@AuthenticationPrincipal UserDetails userDetails) {
        User operator = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found"));

        List<BusResponse> buses = busService.getBusesByOperator(operator.getId());
        List<BookingResponse> bookings = bookingService.getOperatorBookings(operator.getId());
        BigDecimal earnings = bookingRepository.calculateOperatorRevenue(operator.getId());

        long completedCount = bookings.stream()
                .filter(b -> "COMPLETED".equalsIgnoreCase(b.getBookingStatus()))
                .count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBuses", buses.size());
        stats.put("totalBookings", bookings.size());
        stats.put("completedTrips", completedCount);
        stats.put("totalEarnings", earnings != null ? earnings : BigDecimal.ZERO);

        return ResponseEntity.ok(ApiResponse.success("Operator stats loaded", stats));
    }
}
