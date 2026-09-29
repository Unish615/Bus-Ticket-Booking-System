package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.ReviewRequest;
import com.busbooking.dto.ReviewResponse;
import com.busbooking.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/bus/{busId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getReviewsByBus(@PathVariable Long busId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByBus(busId);
        return ResponseEntity.ok(ApiResponse.success("Reviews retrieved", reviews));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ReviewRequest request) {
        ReviewResponse created = reviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully! Thank you for your feedback.", created));
    }
}
