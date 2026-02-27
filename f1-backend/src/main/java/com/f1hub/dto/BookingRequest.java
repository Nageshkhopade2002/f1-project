package com.f1hub.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long raceTicketId;
    private Long raceEventId;
    private Integer quantity;
}