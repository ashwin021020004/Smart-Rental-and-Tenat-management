package com.smartrental.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "rooms")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer room;

    @Column(nullable = false)
    private Integer floor;

    @Column(nullable = false)
    private String status; // Available, Occupied

    public Room() {}

    public Room(Integer room, Integer floor, String status) {
        this.room = room;
        this.floor = floor;
        this.status = status;
    }
}
