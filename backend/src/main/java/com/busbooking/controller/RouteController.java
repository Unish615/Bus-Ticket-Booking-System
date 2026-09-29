package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.RouteRequest;
import com.busbooking.dto.RouteResponse;
import com.busbooking.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAllRoutes() {
        List<RouteResponse> routes = routeService.getAllRoutes();
        return ResponseEntity.ok(ApiResponse.success("Routes retrieved successfully", routes));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> getRouteById(@PathVariable Long id) {
        RouteResponse route = routeService.getRouteById(id);
        return ResponseEntity.ok(ApiResponse.success("Route retrieved successfully", route));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteResponse>> createRoute(@Valid @RequestBody RouteRequest request) {
        RouteResponse created = routeService.createRoute(request);
        return ResponseEntity.ok(ApiResponse.success("Route created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RouteResponse>> updateRoute(
            @PathVariable Long id,
            @Valid @RequestBody RouteRequest request) {
        RouteResponse updated = routeService.updateRoute(id, request);
        return ResponseEntity.ok(ApiResponse.success("Route updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return ResponseEntity.ok(ApiResponse.success("Route deleted successfully"));
    }
}
