package com.smartrental.controller;

import com.smartrental.dto.BookingRequest;
import com.smartrental.entity.Booking;
import com.smartrental.entity.User;
import com.smartrental.repository.BookingRepository;
import com.smartrental.repository.RoomRepository;
import com.smartrental.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getName());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        // Check if user already has an active booking (Pending or Accepted)
        boolean hasActiveBooking = bookingRepository.findAll().stream()
                .anyMatch(booking -> booking.getUser().getId().equals(user.getId()) &&
                                     ("Pending".equals(booking.getStatus()) || "Accepted".equals(booking.getStatus())));

        if (hasActiveBooking) {
            return ResponseEntity.badRequest().body("You can only have one active booking at a time");
        }

        LocalDate bookingDate = request.getBookingDate() != null ? request.getBookingDate() : LocalDate.now();
        Booking booking = new Booking(user, request.getPhone(), request.getRoom(), request.getFloor(), bookingDate, "Pending");
        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/user/{username}")
    public List<Booking> getBookingsByUser(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return List.of();
        }
        return bookingRepository.findAll().stream()
                .filter(booking -> booking.getUser().getUsername().equals(username))
                .toList();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBookingStatus(@PathVariable @NonNull Long id, @RequestBody Map<String, String> request) {
        String status = request.get("status");
        if (status == null || (!status.equals("Accepted") && !status.equals("Cancelled"))) {
            return ResponseEntity.badRequest().body("Invalid status. Must be 'Accepted' or 'Cancelled'");
        }

        return bookingRepository.findById(id)
                .map(booking -> {
                    booking.setStatus(status);

                    // Update room status based on booking status
                    if ("Accepted".equals(status)) {
                        roomRepository.findAll().stream()
                                .filter(room -> room.getRoom().equals(booking.getRoom()) &&
                                                room.getFloor().equals(booking.getFloor()))
                                .findFirst()
                                .ifPresent(room -> {
                                    room.setStatus("Occupied");
                                    roomRepository.save(room);
                                });
                    } else if ("Cancelled".equals(status)) {
                        roomRepository.findAll().stream()
                                .filter(room -> room.getRoom().equals(booking.getRoom()) &&
                                                room.getFloor().equals(booking.getFloor()))
                                .findFirst()
                                .ifPresent(room -> {
                                    room.setStatus("Available");
                                    roomRepository.save(room);
                                });
                    }

                    Booking updated = bookingRepository.save(booking);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/vacate/{username}")
    public ResponseEntity<?> vacateRoom(@PathVariable String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();

        // Find the user's accepted booking
        Optional<Booking> acceptedBooking = bookingRepository.findAll().stream()
                .filter(booking -> booking.getUser().getId().equals(user.getId()) &&
                                   "Accepted".equals(booking.getStatus()))
                .findFirst();

        if (acceptedBooking.isEmpty()) {
            return ResponseEntity.badRequest().body("No accepted booking found for user");
        }

        Booking booking = acceptedBooking.get();

        // Cancel the booking and make room available
        booking.setStatus("Cancelled");
        bookingRepository.save(booking);

        // Update room status to Available
        roomRepository.findAll().stream()
                .filter(room -> room.getRoom().equals(booking.getRoom()) &&
                                room.getFloor().equals(booking.getFloor()))
                .findFirst()
                .ifPresent(room -> {
                    room.setStatus("Available");
                    roomRepository.save(room);
                });

        return ResponseEntity.ok("Room vacated successfully");
    }
}
