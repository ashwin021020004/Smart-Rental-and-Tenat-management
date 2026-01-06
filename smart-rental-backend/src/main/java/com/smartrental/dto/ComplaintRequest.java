package com.smartrental.dto;

import lombok.Data;

@Data
public class ComplaintRequest {
    private String username;
    private String room;
    private String message;
    private String complaintDate;
}
