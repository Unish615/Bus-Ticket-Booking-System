package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.ScheduleRequest;
import com.busbooking.dto.ScheduleResponse;
import com.busbooking.service.ScheduleService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getAllSchedules() {
        List<ScheduleResponse> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(ApiResponse.success("Schedules retrieved successfully", schedules));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> searchSchedules(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ScheduleResponse> results = scheduleService.searchSchedules(from, to, date);
        return ResponseEntity.ok(ApiResponse.success("Schedules found", results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getScheduleById(@PathVariable Long id) {
        ScheduleResponse schedule = scheduleService.getScheduleById(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule details retrieved", schedule));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(@Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse created = scheduleService.createSchedule(request);
        return ResponseEntity.ok(ApiResponse.success("Schedule created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @PathVariable Long id,
            @Valid @RequestBody ScheduleRequest request) {
        ScheduleResponse updated = scheduleService.updateSchedule(id, request);
        return ResponseEntity.ok(ApiResponse.success("Schedule updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("Schedule deleted successfully"));
    }
}
