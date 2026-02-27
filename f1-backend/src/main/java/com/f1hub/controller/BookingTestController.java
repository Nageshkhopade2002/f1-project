package com.f1hub.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingTestController {

    @GetMapping("/booking-system")
    public ResponseEntity<Map<String, String>> testBookingSystem() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Booking system is working");
        response.put("timestamp", String.valueOf(System.currentTimeMillis()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/booking-request")
    public ResponseEntity<Map<String, Object>> testBookingRequest(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        response.put("received", request);
        response.put("status", "Request received successfully");
        return ResponseEntity.ok(response);
    }
}