package com.busbooking.service;

import com.busbooking.dto.DashboardStatsResponse;
import com.busbooking.dto.UserResponse;
import com.busbooking.entity.Booking;
import com.busbooking.entity.Role;
import com.busbooking.entity.User;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoleRepository roleRepository;

    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        stats.setTotalUsers(userRepository.count());
        stats.setTotalBuses(busRepository.count());
        stats.setTotalBookings(bookingRepository.count());

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
        stats.setTodayBookings(bookingRepository.countTodayBookings(startOfDay, endOfDay));

        BigDecimal revenue = bookingRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        stats.setCancelledBookings(bookingRepository.countByBookingStatus("CANCELLED"));

        // Build Monthly Bookings & Monthly Revenue chart data from real records
        List<Booking> allBookings = bookingRepository.findAll();

        Map<String, Long> monthlyBookingsMap = new LinkedHashMap<>();
        Map<String, BigDecimal> monthlyRevenueMap = new LinkedHashMap<>();

        // Initialize past 6 months
        LocalDate now = LocalDate.now();
        for (int i = 5; i >= 0; i--) {
            LocalDate monthDate = now.minusMonths(i);
            String monthKey = monthDate.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            monthlyBookingsMap.put(monthKey, 0L);
            monthlyRevenueMap.put(monthKey, BigDecimal.ZERO);
        }

        Map<String, Long> routeCountMap = new HashMap<>();
        Map<String, Long> statusMap = new HashMap<>();

        for (Booking b : allBookings) {
            String mKey = b.getCreatedAt().format(DateTimeFormatter.ofPattern("MMM yyyy"));
            if (monthlyBookingsMap.containsKey(mKey)) {
                monthlyBookingsMap.put(mKey, monthlyBookingsMap.get(mKey) + 1);
                if (!"CANCELLED".equalsIgnoreCase(b.getBookingStatus())) {
                    monthlyRevenueMap.put(mKey, monthlyRevenueMap.get(mKey).add(b.getTotalAmount()));
                }
            }

            // Route popularity
            String rName = b.getSchedule().getRoute().getSource() + " → " + b.getSchedule().getRoute().getDestination();
            routeCountMap.put(rName, routeCountMap.getOrDefault(rName, 0L) + 1);

            // Status distribution
            String st = b.getBookingStatus();
            statusMap.put(st, statusMap.getOrDefault(st, 0L) + 1);
        }

        List<Map<String, Object>> monthlyBookingsList = new ArrayList<>();
        monthlyBookingsMap.forEach((month, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", month);
            map.put("bookings", count);
            monthlyBookingsList.add(map);
        });
        stats.setMonthlyBookings(monthlyBookingsList);

        List<Map<String, Object>> monthlyRevenueList = new ArrayList<>();
        monthlyRevenueMap.forEach((month, rev) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("month", month);
            map.put("revenue", rev);
            monthlyRevenueList.add(map);
        });
        stats.setMonthlyRevenue(monthlyRevenueList);

        List<Map<String, Object>> popularRoutesList = routeCountMap.entrySet().stream()
                .sorted((e1, e2) -> Long.compare(e2.getValue(), e1.getValue()))
                .limit(5)
                .map(e -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("route", e.getKey());
                    map.put("bookings", e.getValue());
                    return map;
                })
                .collect(Collectors.toList());
        stats.setPopularRoutes(popularRoutesList);

        List<Map<String, Object>> statusList = new ArrayList<>();
        statusMap.forEach((status, count) -> {
            Map<String, Object> map = new HashMap<>();
            map.put("name", status);
            map.put("value", count);
            statusList.add(map);
        });
        stats.setStatusDistribution(statusList);

        return stats;
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getPhone(),
                        u.getRole().getName(),
                        u.getStatus(),
                        u.getProfileImage(),
                        u.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if ("ROLE_ADMIN".equalsIgnoreCase(user.getRole().getName())) {
            throw new BadRequestException("Admin accounts cannot be deactivated.");
        }

        user.setStatus("ACTIVE".equalsIgnoreCase(user.getStatus()) ? "INACTIVE" : "ACTIVE");
        User updated = userRepository.save(user);

        return new UserResponse(
                updated.getId(),
                updated.getName(),
                updated.getEmail(),
                updated.getPhone(),
                updated.getRole().getName(),
                updated.getStatus(),
                updated.getProfileImage(),
                updated.getCreatedAt()
        );
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, String newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String roleName = newRole.startsWith("ROLE_") ? newRole : "ROLE_" + newRole.toUpperCase();
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.save(new Role(roleName)));

        user.setRole(role);
        User updated = userRepository.save(user);

        return new UserResponse(
                updated.getId(),
                updated.getName(),
                updated.getEmail(),
                updated.getPhone(),
                updated.getRole().getName(),
                updated.getStatus(),
                updated.getProfileImage(),
                updated.getCreatedAt()
        );
    }
}
