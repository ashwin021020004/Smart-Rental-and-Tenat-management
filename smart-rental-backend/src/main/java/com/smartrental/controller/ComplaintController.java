package com.smartrental.controller;

import com.smartrental.dto.ComplaintRequest;
import com.smartrental.entity.Complaint;
import com.smartrental.entity.User;
import com.smartrental.repository.BookingRepository;
import com.smartrental.repository.ComplaintRepository;
import com.smartrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplaintController {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    @GetMapping("/user/{username}")
    public List<Complaint> getComplaintsByUser(@PathVariable String username) {
        return complaintRepository.findAll().stream()
                .filter(complaint -> complaint.getUser() != null &&
                                    complaint.getUser().getUsername().equals(username))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> addComplaint(@RequestBody ComplaintRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        // Check if user has an accepted booking for this room
        boolean hasBooking = bookingRepository.findAll().stream()
                .anyMatch(booking -> booking.getUser().getId().equals(user.getId()) &&
                                     booking.getRoom().toString().equals(request.getRoom()) &&
                                     "Accepted".equals(booking.getStatus()));

        if (!hasBooking) {
            return ResponseEntity.badRequest().body("You can only complain about rooms you are occupying");
        }

        Complaint complaint = new Complaint(user, request.getRoom(), request.getMessage(), "Pending", request.getComplaintDate());
        Complaint savedComplaint = complaintRepository.save(complaint);
        return ResponseEntity.ok(savedComplaint);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(@PathVariable @NonNull Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null || !status.equals("Resolved")) {
            return ResponseEntity.badRequest().body("Invalid status. Must be 'Resolved'");
        }

        return complaintRepository.findById(id)
                .map(complaint -> {
                    complaint.setStatus(status);
                    Complaint updated = complaintRepository.save(complaint);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
