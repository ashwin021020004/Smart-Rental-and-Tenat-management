package com.smartrental.controller;

import com.smartrental.dto.BookingRequest;
import com.smartrental.dto.RoomRequest;
import com.smartrental.entity.Booking;
import com.smartrental.entity.Room;
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

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> addRoom(@RequestBody RoomRequest request) {
        // Check if room already exists
        boolean roomExists = roomRepository.findAll().stream()
                .anyMatch(r -> r.getRoom().equals(request.getRoom()));

        if (roomExists) {
            return ResponseEntity.badRequest()
                    .body("Room " + request.getRoom() + " already exists");
        }

        Room room = new Room(request.getRoom(), request.getFloor(),
                           request.getStatus() != null ? request.getStatus() : "Available");
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.ok(savedRoom);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable @NonNull Long id) {
        if (!roomRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        roomRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookRoom(@RequestBody BookingRequest request) {
        // Find user by username
        User user = userRepository.findByUsername(request.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        // Check if user already has an active booking (Pending or Accepted)
        boolean hasActiveBooking = bookingRepository.findAll().stream()
                .anyMatch(b -> b.getUser().getId().equals(user.getId()) &&
                             ("Pending".equals(b.getStatus()) || "Accepted".equals(b.getStatus())));

        if (hasActiveBooking) {
            return ResponseEntity.badRequest()
                    .body("You can only have one active booking at a time");
        }

        LocalDate bookingDate = request.getBookingDate() != null ? request.getBookingDate() : LocalDate.now();
        Booking booking = new Booking(user, request.getPhone(),
                                    request.getRoom(), request.getFloor(), bookingDate, "Pending");
        Booking savedBooking = bookingRepository.save(booking);
        return ResponseEntity.ok(savedBooking);
    }
}
