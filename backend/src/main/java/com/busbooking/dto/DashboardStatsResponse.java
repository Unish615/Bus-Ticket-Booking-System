package com.busbooking.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private long totalUsers;
    private long totalBuses;
    private long totalBookings;
    private long todayBookings;
    private BigDecimal totalRevenue;
    private long cancelledBookings;

    private List<Map<String, Object>> monthlyBookings;
    private List<Map<String, Object>> monthlyRevenue;
    private List<Map<String, Object>> popularRoutes;
    private List<Map<String, Object>> statusDistribution;

    public DashboardStatsResponse() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalBuses() {
        return totalBuses;
    }

    public void setTotalBuses(long totalBuses) {
        this.totalBuses = totalBuses;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getTodayBookings() {
        return todayBookings;
    }

    public void setTodayBookings(long todayBookings) {
        this.todayBookings = todayBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public List<Map<String, Object>> getMonthlyBookings() {
        return monthlyBookings;
    }

    public void setMonthlyBookings(List<Map<String, Object>> monthlyBookings) {
        this.monthlyBookings = monthlyBookings;
    }

    public List<Map<String, Object>> getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public List<Map<String, Object>> getPopularRoutes() {
        return popularRoutes;
    }

    public void setPopularRoutes(List<Map<String, Object>> popularRoutes) {
        this.popularRoutes = popularRoutes;
    }

    public List<Map<String, Object>> getStatusDistribution() {
        return statusDistribution;
    }

    public void setStatusDistribution(List<Map<String, Object>> statusDistribution) {
        this.statusDistribution = statusDistribution;
    }
}
