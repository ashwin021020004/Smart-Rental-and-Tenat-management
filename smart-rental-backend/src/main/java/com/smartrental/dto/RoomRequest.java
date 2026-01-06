package com.smartrental.dto;

import lombok.Data;

@Data
public class RoomRequest {
    private Integer room;
    private Integer floor;
    private String status;
}
