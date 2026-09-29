package com.busbooking.service;

import com.busbooking.dto.BusRequest;
import com.busbooking.dto.BusResponse;
import com.busbooking.entity.Bus;
import com.busbooking.entity.Seat;
import com.busbooking.entity.User;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.BusRepository;
import com.busbooking.repository.ReviewRepository;
import com.busbooking.repository.SeatRepository;
import com.busbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BusService {

    @Autowired
    private BusRepository busRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SeatRepository seatRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    public List<BusResponse> getAllBuses() {
        return busRepository.findAll()
                .stream()
                .map(this::toBusResponse)
                .collect(Collectors.toList());
    }

    public List<BusResponse> getBusesByOperator(Long operatorId) {
        return busRepository.findByOperatorId(operatorId)
                .stream()
                .map(this::toBusResponse)
                .collect(Collectors.toList());
    }

    public BusResponse getBusById(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));
        return toBusResponse(bus);
    }

    @Transactional
    public BusResponse createBus(BusRequest request) {
        if (busRepository.existsByBusNumber(request.getBusNumber().trim())) {
            throw new BadRequestException("Bus number " + request.getBusNumber() + " already exists.");
        }

        User operator = userRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with id: " + request.getOperatorId()));

        Bus bus = new Bus();
        bus.setBusName(request.getBusName().trim());
        bus.setBusNumber(request.getBusNumber().trim());
        bus.setOperator(operator);
        bus.setBusType(request.getBusType().trim());
        bus.setSeatCapacity(request.getSeatCapacity());
        bus.setAmenities(request.getAmenities());
        bus.setStatus(request.getStatus() != null ? request.getStatus() : "ACTIVE");

        Bus savedBus = busRepository.save(bus);

        // Generate seats automatically for the bus
        generateSeatsForBus(savedBus, savedBus.getSeatCapacity());

        return toBusResponse(savedBus);
    }

    @Transactional
    public BusResponse updateBus(Long id, BusRequest request) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));

        if (!bus.getBusNumber().equalsIgnoreCase(request.getBusNumber().trim()) &&
                busRepository.existsByBusNumber(request.getBusNumber().trim())) {
            throw new BadRequestException("Bus number " + request.getBusNumber() + " is already taken.");
        }

        User operator = userRepository.findById(request.getOperatorId())
                .orElseThrow(() -> new ResourceNotFoundException("Operator not found with id: " + request.getOperatorId()));

        bus.setBusName(request.getBusName().trim());
        bus.setBusNumber(request.getBusNumber().trim());
        bus.setOperator(operator);
        bus.setBusType(request.getBusType().trim());
        bus.setAmenities(request.getAmenities());
        bus.setStatus(request.getStatus());

        if (!bus.getSeatCapacity().equals(request.getSeatCapacity())) {
            bus.setSeatCapacity(request.getSeatCapacity());
            seatRepository.deleteByBusId(bus.getId());
            generateSeatsForBus(bus, request.getSeatCapacity());
        }

        Bus updatedBus = busRepository.save(bus);
        return toBusResponse(updatedBus);
    }

    @Transactional
    public void deleteBus(Long id) {
        Bus bus = busRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bus not found with id: " + id));

        seatRepository.deleteByBusId(bus.getId());
        busRepository.delete(bus);
    }

    public void generateSeatsForBus(Bus bus, int capacity) {
        List<Seat> seats = new ArrayList<>();
        char rowChar = 'A';
        int seatCount = 0;

        while (seatCount < capacity) {
            for (int col = 1; col <= 4; col++) {
                if (seatCount >= capacity) break;
                String seatNumber = String.valueOf(rowChar) + col;
                String seatType = (col == 1 || col == 4) ? "WINDOW" : "AISLE";
                seats.add(new Seat(bus, seatNumber, seatType));
                seatCount++;
            }
            rowChar++;
        }

        seatRepository.saveAll(seats);
    }

    public BusResponse toBusResponse(Bus bus) {
        BusResponse resp = new BusResponse();
        resp.setId(bus.getId());
        resp.setBusName(bus.getBusName());
        resp.setBusNumber(bus.getBusNumber());
        resp.setOperatorId(bus.getOperator().getId());
        resp.setOperatorName(bus.getOperator().getName());
        resp.setBusType(bus.getBusType());
        resp.setSeatCapacity(bus.getSeatCapacity());
        resp.setAmenities(bus.getAmenities());
        resp.setStatus(bus.getStatus());
        resp.setCreatedAt(bus.getCreatedAt());

        Double avg = reviewRepository.getAverageRatingForBus(bus.getId());
        resp.setAverageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 4.5);

        Long count = reviewRepository.getReviewCountForBus(bus.getId());
        resp.setReviewCount(count != null ? count : 0L);

        return resp;
    }
}
