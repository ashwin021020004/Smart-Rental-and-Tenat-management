package com.smartrental.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String room;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false)
    private String status; // Pending, Resolved

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private String complaintDate;

    public Complaint() {}

    public Complaint(User user, String room, String message, String status, String complaintDate) {
        this.user = user;
        this.room = room;
        this.message = message;
        this.status = status;
        this.createdAt = LocalDateTime.now();
        this.complaintDate = complaintDate;
    }
}
