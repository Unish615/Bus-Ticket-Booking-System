package com.busbooking.service;

import com.busbooking.dto.*;
import com.busbooking.entity.Role;
import com.busbooking.entity.User;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.ResourceNotFoundException;
import com.busbooking.repository.RoleRepository;
import com.busbooking.repository.UserRepository;
import com.busbooking.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private NotificationService notificationService;

    @Transactional
    public AuthResponse authenticateUser(AuthRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail().trim(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        User user = userRepository.findByEmail(loginRequest.getEmail().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + loginRequest.getEmail()));

        if ("INACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Your account is deactivated. Please contact support.");
        }

        return new AuthResponse(
                jwt,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName(),
                user.getStatus()
        );
    }

    @Transactional
    public AuthResponse registerUser(RegisterRequest signUpRequest) {
        String email = signUpRequest.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email is already registered! Please log in.");
        }

        String roleStr = (signUpRequest.getRole() != null && !signUpRequest.getRole().trim().isEmpty())
                ? signUpRequest.getRole().trim()
                : "ROLE_USER";

        if (!roleStr.startsWith("ROLE_")) {
            roleStr = "ROLE_" + roleStr.toUpperCase();
        }

        final String finalRoleName = roleStr;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> roleRepository.save(new Role(finalRoleName)));

        User user = new User(
                signUpRequest.getName().trim(),
                email,
                signUpRequest.getPhone().trim(),
                encoder.encode(signUpRequest.getPassword()),
                role
        );

        User savedUser = userRepository.save(user);

        // Send welcome notification
        notificationService.createNotification(
                savedUser,
                "Welcome to YatraBus!",
                "Thank you for registering. You can now search schedules and book your bus tickets effortlessly."
        );

        // Authenticate immediately
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, signUpRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        return new AuthResponse(
                jwt,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole().getName(),
                savedUser.getStatus()
        );
    }

    public UserResponse getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateProfile(String currentEmail, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + currentEmail));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!newEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(newEmail)) {
            throw new BadRequestException("Email already taken by another account.");
        }

        user.setName(request.getName().trim());
        user.setPhone(request.getPhone().trim());
        user.setEmail(newEmail);
        if (request.getProfileImage() != null) {
            user.setProfileImage(request.getProfileImage());
        }

        User updatedUser = userRepository.save(user);
        return toUserResponse(updatedUser);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password does not match.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);

        notificationService.createNotification(
                user,
                "Security Alert",
                "Your account password was updated successfully."
        );
    }

    public UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole().getName(),
                user.getStatus(),
                user.getProfileImage(),
                user.getCreatedAt()
        );
    }
}
