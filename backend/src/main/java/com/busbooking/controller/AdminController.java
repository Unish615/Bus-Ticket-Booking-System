package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BookingResponse;
import com.busbooking.dto.DashboardStatsResponse;
import com.busbooking.dto.UserResponse;
import com.busbooking.service.AdminDashboardService;
import com.busbooking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = adminDashboardService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics loaded", stats));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getAllBookings(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long busId,
            @RequestParam(required = false) Long routeId) {
        List<BookingResponse> bookings = bookingService.filterBookings(status, busId, routeId);
        return ResponseEntity.ok(ApiResponse.success("Bookings list retrieved", bookings));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = adminDashboardService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<UserResponse>> toggleUserStatus(@PathVariable Long id) {
        UserResponse updated = adminDashboardService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("User status toggled successfully", updated));
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String role = body.get("role");
        UserResponse updated = adminDashboardService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updated));
    }
}
