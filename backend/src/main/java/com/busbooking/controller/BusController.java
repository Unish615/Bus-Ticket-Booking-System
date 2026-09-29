package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.BusRequest;
import com.busbooking.dto.BusResponse;
import com.busbooking.service.BusService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    @Autowired
    private BusService busService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BusResponse>>> getAllBuses() {
        List<BusResponse> buses = busService.getAllBuses();
        return ResponseEntity.ok(ApiResponse.success("Buses retrieved successfully", buses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BusResponse>> getBusById(@PathVariable Long id) {
        BusResponse bus = busService.getBusById(id);
        return ResponseEntity.ok(ApiResponse.success("Bus retrieved successfully", bus));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<BusResponse>> createBus(@Valid @RequestBody BusRequest request) {
        BusResponse created = busService.createBus(request);
        return ResponseEntity.ok(ApiResponse.success("Bus added successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'OPERATOR')")
    public ResponseEntity<ApiResponse<BusResponse>> updateBus(
            @PathVariable Long id,
            @Valid @RequestBody BusRequest request) {
        BusResponse updated = busService.updateBus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Bus updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteBus(@PathVariable Long id) {
        busService.deleteBus(id);
        return ResponseEntity.ok(ApiResponse.success("Bus deleted successfully"));
    }
}
