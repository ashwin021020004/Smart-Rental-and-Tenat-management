package com.smartrental.entity;

import jakarta.persistence.*;
import lombok.Data;
// Updated entity with user association

import java.time.LocalDate;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private Integer room;

    @Column(nullable = false)
    private Integer floor;

    @Column(nullable = false)
    private LocalDate bookingDate;

    @Column(nullable = false)
    private String status; // Pending, Accepted, Cancelled

    public Booking() {}

    public Booking(User user, String phone, Integer room, Integer floor, LocalDate bookingDate, String status) {
        this.user = user;
        this.phone = phone;
        this.room = room;
        this.floor = floor;
        this.bookingDate = bookingDate;
        this.status = status;
    }
}
