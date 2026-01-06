package com.smartrental.controller;

import com.smartrental.entity.User;
import com.smartrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(password, user.getPassword())) {
                Map<String, Object> response = new HashMap<>();
                response.put("username", user.getUsername());
                response.put("role", user.getRole());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {
        String username = registerRequest.get("username");
        String password = registerRequest.get("password");

        if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username and password are required");
        }

        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        User newUser = new User(username, encoder.encode(password), "USER");
        userRepository.save(newUser);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");

        if (username == null || username.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Username is required");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        // Generate a simple 6-digit reset code
        Random random = new Random();
        String resetCode = String.format("%06d", random.nextInt(999999));

        // Set expiry to 15 minutes from now
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(15);

        user.setResetCode(resetCode);
        user.setResetCodeExpiry(expiry);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Reset code sent to your registered email. Code: " + resetCode +
                                " (Note: In production, this would be emailed)");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String resetCode = request.get("resetCode");
        String newPassword = request.get("newPassword");

        if (username == null || username.trim().isEmpty() ||
            resetCode == null || resetCode.trim().isEmpty() ||
            newPassword == null || newPassword.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (!userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        // Check if reset code matches and hasn't expired
        if (user.getResetCode() == null ||
            !user.getResetCode().equals(resetCode) ||
            user.getResetCodeExpiry() == null ||
            LocalDateTime.now().isAfter(user.getResetCodeExpiry())) {
            return ResponseEntity.badRequest().body("Invalid or expired reset code");
        }

        // Update password and clear reset code
        user.setPassword(encoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Password reset successfully");
        return ResponseEntity.ok(response);
    }
}
