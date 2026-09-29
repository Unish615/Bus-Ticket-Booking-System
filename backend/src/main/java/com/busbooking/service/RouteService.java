package com.busbooking.service;

import com.busbooking.dto.RouteRequest;
import com.busbooking.dto.RouteResponse;
import com.busbooking.entity.Route;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    public List<RouteResponse> getAllRoutes() {
        return routeRepository.findAll()
                .stream()
                .map(this::toRouteResponse)
                .collect(Collectors.toList());
    }

    public RouteResponse getRouteById(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        return toRouteResponse(route);
    }

    @Transactional
    public RouteResponse createRoute(RouteRequest request) {
        Route route = new Route(
                request.getSource().trim(),
                request.getDestination().trim(),
                request.getDistance().trim(),
                request.getDuration().trim(),
                request.getBasePrice()
        );

        Route saved = routeRepository.save(route);
        return toRouteResponse(saved);
    }

    @Transactional
    public RouteResponse updateRoute(Long id, RouteRequest request) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));

        route.setSource(request.getSource().trim());
        route.setDestination(request.getDestination().trim());
        route.setDistance(request.getDistance().trim());
        route.setDuration(request.getDuration().trim());
        route.setBasePrice(request.getBasePrice());

        Route updated = routeRepository.save(route);
        return toRouteResponse(updated);
    }

    @Transactional
    public void deleteRoute(Long id) {
        Route route = routeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found with id: " + id));
        routeRepository.delete(route);
    }

    public RouteResponse toRouteResponse(Route route) {
        return new RouteResponse(
                route.getId(),
                route.getSource(),
                route.getDestination(),
                route.getDistance(),
                route.getDuration(),
                route.getBasePrice(),
                route.getCreatedAt()
        );
    }
}
