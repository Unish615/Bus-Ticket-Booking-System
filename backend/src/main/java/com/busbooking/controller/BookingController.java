package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BookingRequest;
import com.busbooking.dto.BookingResponse;
import com.busbooking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        BookingResponse response = bookingService.createBooking(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Booking confirmed successfully!", response));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<BookingResponse> bookings = bookingService.getMyBookings(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("User bookings retrieved", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdminOrOperator = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_OPERATOR"));

        BookingResponse booking = bookingService.getBookingById(id, userDetails.getUsername(), isAdminOrOperator);
        return ResponseEntity.ok(ApiResponse.success("Booking details retrieved", booking));
    }

    @GetMapping("/track/{code}")
    public ResponseEntity<ApiResponse<BookingResponse>> trackBookingByCode(@PathVariable String code) {
        BookingResponse booking = bookingService.getBookingByCode(code);
        return ResponseEntity.ok(ApiResponse.success("Ticket status tracked", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        BookingResponse cancelled = bookingService.cancelBooking(id, userDetails.getUsername(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully. Refund initiated.", cancelled));
    }

    @PutMapping("/{id}/tracking")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<BookingResponse>> updateTrackingStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("trackingStatus");
        BookingResponse updated = bookingService.updateTrackingStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Tracking status updated successfully", updated));
    }
}
