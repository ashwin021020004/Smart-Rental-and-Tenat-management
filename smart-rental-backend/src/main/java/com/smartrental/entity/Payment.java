package com.smartrental.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String paymentMethod; // UPI or Bank Account

    @Column(nullable = false)
    private String paymentIdentifier; // UPI ID or Account Number

    @Column(nullable = false)
    private String status; // Pending, Completed

    @Column(nullable = false)
    private LocalDateTime paymentDate;

    public Payment() {}

    public Payment(User user, BigDecimal amount, String paymentMethod, String paymentIdentifier, String status, LocalDateTime paymentDate) {
        this.user = user;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentIdentifier = paymentIdentifier;
        this.status = status;
        this.paymentDate = paymentDate;
    }
}
