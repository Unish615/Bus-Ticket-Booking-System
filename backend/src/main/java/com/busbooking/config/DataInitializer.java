package com.busbooking.config;

import com.busbooking.entity.*;
import com.busbooking.repository.*;
import com.busbooking.service.BusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private BusService busService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (roleRepository.count() > 0 && userRepository.count() > 0) {
            return; // Data already initialized
        }

        // 1. Roles
        Role adminRole = roleRepository.save(new Role("ROLE_ADMIN"));
        Role operatorRole = roleRepository.save(new Role("ROLE_OPERATOR"));
        Role userRole = roleRepository.save(new Role("ROLE_USER"));

        String encodedPassword = passwordEncoder.encode("password123");

        // 2. 1 Admin Account
        User admin = userRepository.save(new User(
                "Super Admin",
                "admin@yatrabus.com",
                "9800000001",
                encodedPassword,
                adminRole
        ));

        // 3. 2 Operator Accounts
        User operator1 = userRepository.save(new User(
                "Sajha Yatayat Operations",
                "operator1@sajhayatayat.com",
                "9811111111",
                encodedPassword,
                operatorRole
        ));

        User operator2 = userRepository.save(new User(
                "Greenline Tours",
                "operator2@greenline.com",
                "9822222222",
                encodedPassword,
                operatorRole
        ));

        // 4. 5 Normal Users
        User user1 = userRepository.save(new User("Aarav Sharma", "aarav@gmail.com", "9841000001", encodedPassword, userRole));
        User user2 = userRepository.save(new User("Bipana Thapa", "bipana@gmail.com", "9841000002", encodedPassword, userRole));
        User user3 = userRepository.save(new User("Chandra Gurung", "chandra@gmail.com", "9841000003", encodedPassword, userRole));
        User user4 = userRepository.save(new User("Deepa Adhikari", "deepa@gmail.com", "9841000004", encodedPassword, userRole));
        User user5 = userRepository.save(new User("Elina Maharjan", "elina@gmail.com", "9841000005", encodedPassword, userRole));

        // 5. 8 Buses
        List<Bus> buses = new ArrayList<>();
        buses.add(createBus("Mountain Deluxe", "BA 2 KHA 1001", operator1, "AC Deluxe", 30, "WiFi, AC, Charging Port, Water Bottle, TV"));
        buses.add(createBus("Himalayan Express", "BA 3 KHA 2002", operator1, "Super Deluxe", 28, "WiFi, AC, Blanket, Water Bottle, TV"));
        buses.add(createBus("Greenline Luxury", "BA 1 KHA 3003", operator2, "AC Sleeper", 26, "WiFi, AC, Sleeper Bed, Water Bottle, Blanket, Charging Port"));
        buses.add(createBus("Pokhara Cruiser", "BA 2 KHA 4004", operator2, "Tourist AC", 30, "WiFi, AC, Music System, Water Bottle"));
        buses.add(createBus("Lumbini Express", "BA 4 KHA 5005", operator1, "AC Deluxe", 32, "WiFi, AC, Charging Port, Reading Light"));
        buses.add(createBus("Chitwan Safari King", "BA 3 KHA 6006", operator2, "Super Deluxe", 30, "WiFi, AC, Blanket, Water Bottle, Snacks"));
        buses.add(createBus("Valley Royal Bus", "BA 1 KHA 7007", operator1, "AC Deluxe", 28, "WiFi, AC, Charging Port, TV"));
        buses.add(createBus("Everest Night Cruiser", "BA 2 KHA 8008", operator2, "Luxury Sleeper", 24, "WiFi, AC, Sleeper Bed, Blanket, Charging Port, Dinner"));

        for (Bus bus : buses) {
            busService.generateSeatsForBus(bus, bus.getSeatCapacity());
        }

        // 6. 10 Routes
        Route r1 = routeRepository.save(new Route("Kathmandu", "Pokhara", "205 km", "6 hours", BigDecimal.valueOf(1200.00)));
        Route r2 = routeRepository.save(new Route("Pokhara", "Kathmandu", "205 km", "6 hours", BigDecimal.valueOf(1200.00)));
        Route r3 = routeRepository.save(new Route("Kathmandu", "Chitwan", "160 km", "5 hours", BigDecimal.valueOf(950.00)));
        Route r4 = routeRepository.save(new Route("Chitwan", "Kathmandu", "160 km", "5 hours", BigDecimal.valueOf(950.00)));
        Route r5 = routeRepository.save(new Route("Kathmandu", "Butwal", "265 km", "8 hours", BigDecimal.valueOf(1400.00)));
        Route r6 = routeRepository.save(new Route("Butwal", "Kathmandu", "265 km", "8 hours", BigDecimal.valueOf(1400.00)));
        Route r7 = routeRepository.save(new Route("Kathmandu", "Lumbini", "300 km", "9 hours", BigDecimal.valueOf(1600.00)));
        Route r8 = routeRepository.save(new Route("Lumbini", "Kathmandu", "300 km", "9 hours", BigDecimal.valueOf(1600.00)));
        Route r9 = routeRepository.save(new Route("Pokhara", "Chitwan", "145 km", "4.5 hours", BigDecimal.valueOf(850.00)));
        Route r10 = routeRepository.save(new Route("Kathmandu", "Dharan", "380 km", "11 hours", BigDecimal.valueOf(1900.00)));

        // 7. Multiple Schedules (Past for completed bookings, Today, Tomorrow, Future)
        LocalDate today = LocalDate.now();

        // Past Schedule
        Schedule pastSchedule = createSchedule(buses.get(0), r1, today.minusDays(5), LocalTime.of(7, 0), LocalTime.of(13, 0), BigDecimal.valueOf(1200.00), "COMPLETED");

        // Today Schedules
        Schedule sToday1 = createSchedule(buses.get(0), r1, today, LocalTime.of(7, 0), LocalTime.of(13, 0), BigDecimal.valueOf(1200.00), "ACTIVE");
        Schedule sToday2 = createSchedule(buses.get(1), r1, today, LocalTime.of(14, 0), LocalTime.of(20, 0), BigDecimal.valueOf(1250.00), "ACTIVE");
        Schedule sToday3 = createSchedule(buses.get(2), r3, today, LocalTime.of(8, 0), LocalTime.of(13, 0), BigDecimal.valueOf(1000.00), "ACTIVE");
        Schedule sToday4 = createSchedule(buses.get(3), r2, today, LocalTime.of(7, 30), LocalTime.of(13, 30), BigDecimal.valueOf(1200.00), "ACTIVE");

        // Tomorrow Schedules
        Schedule sTom1 = createSchedule(buses.get(0), r1, today.plusDays(1), LocalTime.of(7, 0), LocalTime.of(13, 0), BigDecimal.valueOf(1200.00), "ACTIVE");
        Schedule sTom2 = createSchedule(buses.get(1), r1, today.plusDays(1), LocalTime.of(19, 0), LocalTime.of(1, 0), BigDecimal.valueOf(1300.00), "ACTIVE");
        Schedule sTom3 = createSchedule(buses.get(4), r5, today.plusDays(1), LocalTime.of(6, 30), LocalTime.of(14, 30), BigDecimal.valueOf(1450.00), "ACTIVE");
        Schedule sTom4 = createSchedule(buses.get(5), r3, today.plusDays(1), LocalTime.of(9, 0), LocalTime.of(14, 0), BigDecimal.valueOf(950.00), "ACTIVE");
        Schedule sTom5 = createSchedule(buses.get(7), r7, today.plusDays(1), LocalTime.of(20, 0), LocalTime.of(5, 0), BigDecimal.valueOf(1700.00), "ACTIVE");

        // Day After Tomorrow Schedules
        createSchedule(buses.get(2), r1, today.plusDays(2), LocalTime.of(7, 0), LocalTime.of(13, 0), BigDecimal.valueOf(1400.00), "ACTIVE");
        createSchedule(buses.get(3), r9, today.plusDays(2), LocalTime.of(8, 0), LocalTime.of(12, 30), BigDecimal.valueOf(850.00), "ACTIVE");
        createSchedule(buses.get(6), r10, today.plusDays(2), LocalTime.of(6, 0), LocalTime.of(17, 0), BigDecimal.valueOf(1900.00), "ACTIVE");

        // Next Week / Future Schedules
        createSchedule(buses.get(0), r1, today.plusDays(5), LocalTime.of(7, 0), LocalTime.of(13, 0), BigDecimal.valueOf(1200.00), "ACTIVE");
        createSchedule(buses.get(1), r1, today.plusDays(5), LocalTime.of(15, 0), LocalTime.of(21, 0), BigDecimal.valueOf(1250.00), "ACTIVE");

        // 8. Sample Completed Booking with Review
        Booking pastBooking = new Booking();
        pastBooking.setBookingCode("BUS-2026-10291");
        pastBooking.setUser(user1);
        pastBooking.setSchedule(pastSchedule);
        pastBooking.setTotalAmount(BigDecimal.valueOf(2450.00));
        pastBooking.setServiceFee(BigDecimal.valueOf(50.00));
        pastBooking.setBookingStatus("COMPLETED");
        pastBooking.setPaymentStatus("PAID");
        pastBooking.setTrackingStatus("ARRIVED");
        pastBooking.setCreatedAt(LocalDateTime.now().minusDays(5));
        pastBooking.addPassenger(new BookingPassenger("A1", "Aarav Sharma", 28, "Male", "9841000001", "aarav@gmail.com"));
        pastBooking.addPassenger(new BookingPassenger("A2", "Pooja Sharma", 26, "Female", "9841000001", "pooja@gmail.com"));
        pastBooking = bookingRepository.save(pastBooking);

        paymentRepository.save(new Payment(pastBooking, BigDecimal.valueOf(2450.00), "eSewa", "COMPLETED", "TXN-99881122"));

        // Add Review for this completed booking
        Review review1 = new Review();
        review1.setUser(user1);
        review1.setBus(buses.get(0));
        review1.setBooking(pastBooking);
        review1.setRating(5);
        review1.setCleanlinessRating(5);
        review1.setComfortRating(5);
        review1.setServiceRating(5);
        review1.setComment("Excellent journey! The bus departed on time, seats were extremely comfortable, and free WiFi worked well throughout the trip.");
        reviewRepository.save(review1);

        // 9. Sample Confirmed Upcoming Booking (Seats A2, A3 booked on sTom1)
        Booking upcomingBooking = new Booking();
        upcomingBooking.setBookingCode("BUS-2026-10294");
        upcomingBooking.setUser(user1);
        upcomingBooking.setSchedule(sTom1);
        upcomingBooking.setTotalAmount(BigDecimal.valueOf(2450.00));
        upcomingBooking.setServiceFee(BigDecimal.valueOf(50.00));
        upcomingBooking.setBookingStatus("CONFIRMED");
        upcomingBooking.setPaymentStatus("PAID");
        upcomingBooking.setTrackingStatus("BOOKING_CONFIRMED");
        upcomingBooking.setCreatedAt(LocalDateTime.now().minusHours(2));
        upcomingBooking.addPassenger(new BookingPassenger("A2", "Aarav Sharma", 28, "Male", "9841000001", "aarav@gmail.com"));
        upcomingBooking.addPassenger(new BookingPassenger("A3", "Rohan Gurung", 29, "Male", "9841000003", "rohan@gmail.com"));
        upcomingBooking = bookingRepository.save(upcomingBooking);

        paymentRepository.save(new Payment(upcomingBooking, BigDecimal.valueOf(2450.00), "Khalti", "COMPLETED", "TXN-77334411"));

        // 10. Sample Cancelled Booking
        Booking cancelledBooking = new Booking();
        cancelledBooking.setBookingCode("BUS-2026-10280");
        cancelledBooking.setUser(user2);
        cancelledBooking.setSchedule(sTom3);
        cancelledBooking.setTotalAmount(BigDecimal.valueOf(1500.00));
        cancelledBooking.setServiceFee(BigDecimal.valueOf(50.00));
        cancelledBooking.setBookingStatus("CANCELLED");
        cancelledBooking.setPaymentStatus("REFUNDED");
        cancelledBooking.setTrackingStatus("CANCELLED");
        cancelledBooking.setCancellationFee(BigDecimal.valueOf(100.00));
        cancelledBooking.setRefundAmount(BigDecimal.valueOf(1400.00));
        cancelledBooking.setCreatedAt(LocalDateTime.now().minusDays(1));
        cancelledBooking.addPassenger(new BookingPassenger("B1", "Bipana Thapa", 24, "Female", "9841000002", "bipana@gmail.com"));
        cancelledBooking = bookingRepository.save(cancelledBooking);

        paymentRepository.save(new Payment(cancelledBooking, BigDecimal.valueOf(1500.00), "Card", "REFUNDED", "TXN-55442200"));

        // 11. Sample Notifications
        notificationRepository.save(new Notification(
                user1,
                "Booking Confirmed: BUS-2026-10294",
                "Your booking for Kathmandu → Pokhara on " + sTom1.getTravelDate() + " is confirmed. Seats: A2, A3."
        ));
        notificationRepository.save(new Notification(
                user1,
                "Welcome to YatraBus!",
                "Thank you for joining YatraBus. Enjoy safe and seamless bus bookings across Nepal."
        ));
        notificationRepository.save(new Notification(
                user2,
                "Refund Initiated: BUS-2026-10280",
                "Ticket BUS-2026-10280 has been cancelled. A refund of Rs. 1400 has been sent to your payment method."
        ));
    }

    private Bus createBus(String name, String number, User op, String type, int cap, String amen) {
        Bus bus = new Bus();
        bus.setBusName(name);
        bus.setBusNumber(number);
        bus.setOperator(op);
        bus.setBusType(type);
        bus.setSeatCapacity(cap);
        bus.setAmenities(amen);
        bus.setStatus("ACTIVE");
        return busRepository.save(bus);
    }

    private Schedule createSchedule(Bus bus, Route route, LocalDate date, LocalTime dep, LocalTime arr, BigDecimal price, String status) {
        Schedule schedule = new Schedule();
        schedule.setBus(bus);
        schedule.setRoute(route);
        schedule.setTravelDate(date);
        schedule.setDepartureTime(dep);
        schedule.setArrivalTime(arr);
        schedule.setPrice(price);
        schedule.setStatus(status);
        return scheduleRepository.save(schedule);
    }
}
