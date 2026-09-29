package com.busbooking.service;

import com.busbooking.dto.ReviewRequest;
import com.busbooking.dto.ReviewResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Review;
import com.busbooking.entity.User;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BookingRepository;
import com.busbooking.repository.ReviewRepository;
import com.busbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    public List<ReviewResponse> getReviewsByBus(Long busId) {
        return reviewRepository.findByBusIdOrderByCreatedAtDesc(busId)
                .stream()
                .map(this::toReviewResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + request.getBookingId()));

        if (!booking.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("You can only review bookings made by your own account.");
        }

        if (!"COMPLETED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Reviews can only be submitted after your trip is completed.");
        }

        if (reviewRepository.existsByBookingId(booking.getId())) {
            throw new BadRequestException("You have already submitted a review for this booking.");
        }

        Bus bus = booking.getSchedule().getBus();

        Review review = new Review();
        review.setUser(user);
        review.setBus(bus);
        review.setBooking(booking);
        review.setRating(request.getRating());
        review.setCleanlinessRating(request.getCleanlinessRating() != null ? request.getCleanlinessRating() : request.getRating());
        review.setComfortRating(request.getComfortRating() != null ? request.getComfortRating() : request.getRating());
        review.setServiceRating(request.getServiceRating() != null ? request.getServiceRating() : request.getRating());
        review.setComment(request.getComment().trim());

        Review saved = reviewRepository.save(review);
        return toReviewResponse(saved);
    }

    public ReviewResponse toReviewResponse(Review review) {
        ReviewResponse resp = new ReviewResponse();
        resp.setId(review.getId());
        resp.setUserId(review.getUser().getId());
        resp.setUserName(review.getUser().getName());
        resp.setBusId(review.getBus().getId());
        resp.setBusName(review.getBus().getBusName());
        resp.setBookingId(review.getBooking().getId());
        resp.setRating(review.getRating());
        resp.setCleanlinessRating(review.getCleanlinessRating());
        resp.setComfortRating(review.getComfortRating());
        resp.setServiceRating(review.getServiceRating());
        resp.setComment(review.getComment());
        resp.setCreatedAt(review.getCreatedAt());
        return resp;
    }
}
