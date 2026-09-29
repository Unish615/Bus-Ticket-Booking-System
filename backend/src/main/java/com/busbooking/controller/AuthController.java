package com.busbooking.controller;

import com.busbooking.dto.ApiResponse;
import com.busbooking.dto.AuthRequest;
import com.busbooking.dto.AuthResponse;
import com.busbooking.dto.RegisterRequest;
import com.busbooking.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest loginRequest) {
        AuthResponse response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(ApiResponse.success("Login successful!", response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        AuthResponse response = authService.registerUser(registerRequest);
        return ResponseEntity.ok(ApiResponse.success("Registration successful! Welcome to YatraBus.", response));
    }
}
