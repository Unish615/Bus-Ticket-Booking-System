package com.busbooking.service;

import com.busbooking.dto.BookingRequest;
import com.busbooking.dto.BookingResponse;
import com.busbooking.dto.PassengerDto;
import com.busbooking.entity.*;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingPassengerRepository bookingPassengerRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private NotificationService notificationService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public BookingResponse createBooking(BookingRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // 1. Verify schedule exists
        Schedule schedule = scheduleRepository.findById(request.getScheduleId())
                .orElseThrow(() -> new ResourceNotFoundException("Schedule not found with id: " + request.getScheduleId()));

        if (!"ACTIVE".equalsIgnoreCase(schedule.getStatus())) {
            throw new BadRequestException("This bus schedule is no longer active for booking.");
        }

        // 2. Verify travel date is valid (cannot book past departures)
        if (schedule.getTravelDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book tickets for past travel dates.");
        }

        // 3 & 4. Check requested seats and availability
        List<PassengerDto> passengerDtos = request.getPassengers();
        if (passengerDtos == null || passengerDtos.isEmpty()) {
            throw new BadRequestException("At least one passenger/seat must be selected.");
        }

        List<String> requestedSeats = new ArrayList<>();
        for (PassengerDto p : passengerDtos) {
            String seat = p.getSeatNumber().trim().toUpperCase();
            if (requestedSeats.contains(seat)) {
                throw new BadRequestException("Duplicate seat " + seat + " selected in passenger list.");
            }
            requestedSeats.add(seat);
        }

        // 5. Prevent duplicate booking of the same seat (Concurrency safe with SERIALIZABLE transaction)
        List<String> alreadyBookedSeats = bookingPassengerRepository.findBookedSeatsByScheduleId(schedule.getId());
        for (String seat : requestedSeats) {
            if (alreadyBookedSeats.contains(seat)) {
                throw new BadRequestException("Seat " + seat + " is already booked. Please choose another seat.");
            }
        }

        // Calculate pricing
        BigDecimal ticketPricePerSeat = schedule.getPrice();
        BigDecimal seatsTotal = ticketPricePerSeat.multiply(BigDecimal.valueOf(passengerDtos.size()));
        BigDecimal serviceFee = BigDecimal.valueOf(50.00);
        BigDecimal totalAmount = seatsTotal.add(serviceFee);

        // Generate unique Booking Code: BUS-YYYY-XXXXX
        String bookingCode = "BUS-" + LocalDate.now().getYear() + "-" + (10000 + new Random().nextInt(90000));
        while (bookingRepository.findByBookingCode(bookingCode).isPresent()) {
            bookingCode = "BUS-" + LocalDate.now().getYear() + "-" + (10000 + new Random().nextInt(90000));
        }

        // 6. Create booking
        Booking booking = new Booking();
        booking.setBookingCode(bookingCode);
        booking.setUser(user);
        booking.setSchedule(schedule);
        booking.setTotalAmount(totalAmount);
        booking.setServiceFee(serviceFee);
        booking.setBookingStatus("CONFIRMED");
        booking.setPaymentStatus("PAID");
        booking.setTrackingStatus("BOOKING_CONFIRMED");
        booking.setCreatedAt(LocalDateTime.now());

        // 7. Create passenger records
        for (PassengerDto pDto : passengerDtos) {
            BookingPassenger passenger = new BookingPassenger(
                    pDto.getSeatNumber().trim().toUpperCase(),
                    pDto.getPassengerName().trim(),
                    pDto.getAge(),
                    pDto.getGender().trim(),
                    pDto.getPhone() != null ? pDto.getPhone().trim() : user.getPhone(),
                    pDto.getEmail() != null ? pDto.getEmail().trim() : user.getEmail()
            );
            booking.addPassenger(passenger);
        }

        Booking savedBooking = bookingRepository.save(booking);

        // 8. Create simulated payment record
        String txnRef = "TXN-" + System.currentTimeMillis() + "-" + (100 + new Random().nextInt(900));
        Payment payment = new Payment(
                savedBooking,
                totalAmount,
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "eSewa",
                "COMPLETED",
                txnRef
        );
        paymentRepository.save(payment);

        // Send notifications
        notificationService.createNotification(
                user,
                "Booking Confirmed: " + bookingCode,
                String.format("Your journey from %s to %s on %s is confirmed! Seats: %s. Total: Rs. %s",
                        schedule.getRoute().getSource(),
                        schedule.getRoute().getDestination(),
                        schedule.getTravelDate().format(DateTimeFormatter.ofPattern("dd MMM yyyy")),
                        String.join(", ", requestedSeats),
                        totalAmount)
        );

        return toBookingResponse(savedBooking, payment);
    }

    public List<BookingResponse> getMyBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return bookingRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse getBookingById(Long id, String userEmail, boolean isAdminOrOperator) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdminOrOperator && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("Unauthorized to view this booking.");
        }

        return toBookingResponse(booking);
    }

    public BookingResponse getBookingByCode(String code) {
        Booking booking = bookingRepository.findByBookingCode(code.trim().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("No ticket found with Booking Code: " + code));

        return toBookingResponse(booking);
    }

    @Transactional
    public BookingResponse cancelBooking(Long id, String userEmail, boolean isAdmin) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (!isAdmin && !booking.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new BadRequestException("Unauthorized to cancel this booking.");
        }

        if ("CANCELLED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("This booking has already been cancelled.");
        }

        if ("COMPLETED".equalsIgnoreCase(booking.getBookingStatus())) {
            throw new BadRequestException("Cannot cancel a completed trip.");
        }

        // Check if travel date is in the past
        if (booking.getSchedule().getTravelDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot cancel past journey.");
        }

        // Cancellation Fee & Refund calculation (Standard 10% fee or Rs 100 per ticket)
        BigDecimal cancellationFee = BigDecimal.valueOf(100.00).multiply(BigDecimal.valueOf(booking.getPassengers().size()));
        if (cancellationFee.compareTo(booking.getTotalAmount()) > 0) {
            cancellationFee = BigDecimal.valueOf(50.00);
        }
        BigDecimal refundAmount = booking.getTotalAmount().subtract(cancellationFee);

        booking.setBookingStatus("CANCELLED");
        booking.setPaymentStatus("REFUNDED");
        booking.setTrackingStatus("CANCELLED");
        booking.setCancellationFee(cancellationFee);
        booking.setRefundAmount(refundAmount);

        Booking updated = bookingRepository.save(booking);

        // Update payment status
        paymentRepository.findByBookingId(booking.getId()).ifPresent(payment -> {
            payment.setPaymentStatus("REFUNDED");
            paymentRepository.save(payment);
        });

        // Notify user
        notificationService.createNotification(
                booking.getUser(),
                "Booking Cancelled: " + booking.getBookingCode(),
                String.format("Ticket %s has been cancelled. Cancellation fee: Rs. %s. Refund amount of Rs. %s has been initiated.",
                        booking.getBookingCode(), cancellationFee, refundAmount)
        );

        return toBookingResponse(updated);
    }

    @Transactional
    public BookingResponse updateTrackingStatus(Long id, String newTrackingStatus) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        booking.setTrackingStatus(newTrackingStatus.toUpperCase());
        if ("ARRIVED".equalsIgnoreCase(newTrackingStatus)) {
            booking.setBookingStatus("COMPLETED");
        }

        Booking updated = bookingRepository.save(booking);

        notificationService.createNotification(
                booking.getUser(),
                "Trip Status Update",
                "Your journey status for ticket " + booking.getBookingCode() + " is now: " + newTrackingStatus.replace('_', ' ')
        );

        return toBookingResponse(updated);
    }

    public List<BookingResponse> filterBookings(String status, Long busId, Long routeId) {
        return bookingRepository.filterBookings(
                (status != null && !status.isEmpty()) ? status : null,
                busId,
                routeId
        ).stream().map(this::toBookingResponse).collect(Collectors.toList());
    }

    public List<BookingResponse> getOperatorBookings(Long operatorId) {
        return bookingRepository.findByScheduleBusOperatorIdOrderByCreatedAtDesc(operatorId)
                .stream()
                .map(this::toBookingResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse toBookingResponse(Booking booking) {
        Payment payment = paymentRepository.findByBookingId(booking.getId()).orElse(null);
        return toBookingResponse(booking, payment);
    }

    public BookingResponse toBookingResponse(Booking booking, Payment payment) {
        BookingResponse resp = new BookingResponse();
        resp.setId(booking.getId());
        resp.setBookingCode(booking.getBookingCode());
        resp.setUserId(booking.getUser().getId());
        resp.setUserName(booking.getUser().getName());
        resp.setUserEmail(booking.getUser().getEmail());
        resp.setUserPhone(booking.getUser().getPhone());

        Schedule sched = booking.getSchedule();
        resp.setScheduleId(sched.getId());
        resp.setBusId(sched.getBus().getId());
        resp.setBusName(sched.getBus().getBusName());
        resp.setBusNumber(sched.getBus().getBusNumber());
        resp.setBusType(sched.getBus().getBusType());
        resp.setOperatorName(sched.getBus().getOperator().getName());

        resp.setRouteSource(sched.getRoute().getSource());
        resp.setRouteDestination(sched.getRoute().getDestination());
        resp.setTravelDate(sched.getTravelDate());
        resp.setDepartureTime(sched.getDepartureTime());
        resp.setArrivalTime(sched.getArrivalTime());

        resp.setTotalAmount(booking.getTotalAmount());
        resp.setServiceFee(booking.getServiceFee());
        resp.setBookingStatus(booking.getBookingStatus());
        resp.setPaymentStatus(booking.getPaymentStatus());
        resp.setTrackingStatus(booking.getTrackingStatus());
        resp.setCancellationFee(booking.getCancellationFee());
        resp.setRefundAmount(booking.getRefundAmount());
        resp.setCreatedAt(booking.getCreatedAt());

        if (payment != null) {
            resp.setPaymentMethod(payment.getPaymentMethod());
            resp.setTransactionReference(payment.getTransactionReference());
        }

        // Map passenger list
        List<PassengerDto> pList = booking.getPassengers().stream()
                .map(p -> new PassengerDto(
                        p.getSeatNumber(),
                        p.getPassengerName(),
                        p.getAge(),
                        p.getGender(),
                        p.getPhone(),
                        p.getEmail()
                ))
                .collect(Collectors.toList());
        resp.setPassengers(pList);

        // QR Code Payload (Structured Ticket Validation String)
        String seats = pList.stream().map(PassengerDto::getSeatNumber).collect(Collectors.joining(","));
        String qrPayload = String.format("TICKET:%s|BUS:%s|ROUTE:%s-%s|DATE:%s|SEATS:%s|STATUS:%s",
                booking.getBookingCode(),
                sched.getBus().getBusNumber(),
                sched.getRoute().getSource(),
                sched.getRoute().getDestination(),
                sched.getTravelDate(),
                seats,
                booking.getBookingStatus()
        );
        resp.setQrData(qrPayload);

        return resp;
    }
}
