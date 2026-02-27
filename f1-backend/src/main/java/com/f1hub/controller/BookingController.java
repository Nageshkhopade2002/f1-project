package com.f1hub.controller;

import com.f1hub.dto.BookingRequest;
import com.f1hub.dto.BookingResponse;
import com.f1hub.dto.PaymentVerificationRequest;
import com.f1hub.model.Booking;
import com.f1hub.model.User;
import com.f1hub.repository.UserRepository;
import com.f1hub.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<?> createBooking(
            @RequestBody BookingRequest request,
            Authentication authentication) {
        try {
            System.out.println("=== BOOKING DEBUG ===");
            System.out.println("AUTH = " + authentication);
            
            if (authentication == null) {
                System.out.println("Authentication is NULL!");
                return ResponseEntity.badRequest().body("BAD_REQUEST_ERROR:Authentication is null");
            }
            
            String email = authentication.getName();
            System.out.println("Booking request from user: " + email);
            System.out.println("User authorities: " + authentication.getAuthorities());
            System.out.println("Request data: " + request);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
            
            System.out.println("Found user: " + user.getEmail() + ", Role: " + user.getRole());
            
            Booking booking = bookingService.createBooking(
                user.getId(), 
                request.getRaceTicketId(),
                request.getRaceEventId(),
                request.getQuantity()
            );
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            System.out.println("Booking error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("BAD_REQUEST_ERROR:" + e.getMessage());
        }
    }
    
    @PostMapping("/verify-payment")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerificationRequest request) {
        try {
            Booking booking = bookingService.confirmPayment(
                request.getRazorpayOrderId(),
                request.getRazorpayPaymentId(),
                request.getRazorpaySignature()
            );
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(bookingService.getUserBookingsWithDetails(user.getId()));
    }
    
    @GetMapping("/admin/all")
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookingsWithDetails());
    }
    
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            bookingService.cancelBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}