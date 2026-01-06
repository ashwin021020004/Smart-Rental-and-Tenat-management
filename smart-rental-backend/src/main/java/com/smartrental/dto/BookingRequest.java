package com.smartrental.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class BookingRequest {
    private String name; // username
    private String phone;
    private Integer room;
    private Integer floor;
    private LocalDate bookingDate;
}
