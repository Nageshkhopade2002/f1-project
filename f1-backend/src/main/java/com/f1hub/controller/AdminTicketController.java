package com.f1hub.controller;

import com.f1hub.model.Booking;
import com.f1hub.model.RaceTicket;
import com.f1hub.service.BookingService;
import com.f1hub.service.RaceTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminTicketController {
    
    @Autowired
    private RaceTicketService raceTicketService;
    
    @Autowired
    private BookingService bookingService;
    
    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        System.out.println("Test endpoint reached successfully");
        return ResponseEntity.ok("Admin tickets endpoint is working!");
    }
    
    @GetMapping
    public ResponseEntity<List<RaceTicket>> getAllTickets() {
        return ResponseEntity.ok(raceTicketService.getAllTickets());
    }
    
    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody RaceTicket ticket) {
        try {
            RaceTicket created = raceTicketService.createTicket(ticket);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body("Error creating ticket: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RaceTicket> updateTicket(
            @PathVariable Long id, 
            @RequestBody RaceTicket ticket) {
        return ResponseEntity.ok(raceTicketService.updateTicket(id, ticket));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        raceTicketService.deleteTicket(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
}