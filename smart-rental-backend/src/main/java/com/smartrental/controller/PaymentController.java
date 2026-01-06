package com.smartrental.controller;

import com.smartrental.entity.Payment;
import com.smartrental.entity.User;
import com.smartrental.repository.PaymentRepository;
import com.smartrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> makePayment(@RequestBody Map<String, String> paymentRequest) {
        String username = paymentRequest.get("username");
        String paymentMethod = paymentRequest.get("paymentMethod");
        String paymentIdentifier = paymentRequest.get("paymentIdentifier");
        String amountStr = paymentRequest.get("amount");

        if (username == null || paymentMethod == null || paymentIdentifier == null || amountStr == null) {
            return ResponseEntity.badRequest().body("All fields are required");
        }

        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        BigDecimal amount;
        try {
            amount = new BigDecimal(amountStr);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("Invalid amount");
        }

        Payment payment = new Payment(user, amount, paymentMethod, paymentIdentifier, "Completed", LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);

        return ResponseEntity.ok(savedPayment);
    }

    @GetMapping("/user/{username}")
    public List<Payment> getPaymentsByUser(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return List.of();
        }
        return paymentRepository.findAll().stream()
                .filter(payment -> payment.getUser().getUsername().equals(username))
                .toList();
    }

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @GetMapping("/user/{username}/status")
    public ResponseEntity<?> getPaymentStatus(@PathVariable String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(payment -> payment.getUser().getUsername().equals(username) && payment.getStatus().equals("Completed"))
                .toList();

        if (payments.isEmpty()) {
            return ResponseEntity.ok(Map.of("status", "Due", "amount", "5000")); // Default rent amount
        }

        // Assuming the latest payment determines the status
        Payment latestPayment = payments.get(payments.size() - 1);
        return ResponseEntity.ok(Map.of("status", "Paid", "amount", latestPayment.getAmount().toString()));
    }
}
