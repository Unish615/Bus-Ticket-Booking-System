package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.NotificationResponse;
import com.busbooking.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getMyNotifications(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<NotificationResponse> list = notificationService.getUserNotifications(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", list));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Object>> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAsRead(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read"));
    }

    @PutMapping("/read-all")
    public ResponseEntity<ApiResponse<Object>> markAllAsRead(
            @AuthenticationPrincipal UserDetails userDetails) {
        notificationService.markAllAsRead(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read"));
    }
}
