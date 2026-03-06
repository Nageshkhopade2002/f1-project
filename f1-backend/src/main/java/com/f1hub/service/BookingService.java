package com.f1hub.service;

import com.f1hub.dto.BookingResponse;
import com.f1hub.model.*;
import com.f1hub.repository.BookingRepository;
import com.f1hub.repository.RaceEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RaceTicketService raceTicketService;
    
    @Autowired
    private RazorpayService razorpayService;
    
    @Autowired
    private RaceEventRepository raceEventRepository;
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
    
    public List<BookingResponse> getAllBookingsWithDetails() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream()
            .map(this::convertToBookingResponse)
            .collect(Collectors.toList());
    }
    
    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findUserBookingsOrderByDate(userId);
    }
    
    public List<BookingResponse> getUserBookingsWithDetails(Long userId) {
        List<Booking> bookings = bookingRepository.findUserBookingsOrderByDate(userId);
        return bookings.stream()
            .map(this::convertToBookingResponse)
            .collect(Collectors.toList());
    }
    
    private BookingResponse convertToBookingResponse(Booking booking) {
        System.out.println("=== Converting Booking #" + booking.getId() + " ===");
        System.out.println("RaceTicketId: " + booking.getRaceTicketId());
        System.out.println("RaceEventId: " + booking.getRaceEventId());
        
        try {
            RaceTicket ticket = raceTicketService.getTicketById(booking.getRaceTicketId());
            System.out.println("Ticket found: " + ticket.getTicketType());
            
            RaceEvent race = raceEventRepository.findById(booking.getRaceEventId())
                .orElse(null);
            
            if (race == null) {
                System.out.println("ERROR: Race not found for ID: " + booking.getRaceEventId());
            } else {
                System.out.println("Race found: " + race.getRaceName());
                System.out.println("Circuit: " + (race.getCircuit() != null ? race.getCircuit().getName() : "NULL"));
            }
            
            return new BookingResponse(
                booking.getId(),
                race != null ? race.getRaceName() : "TBD",
                race != null ? race.getStartDate() : null,
                race != null && race.getCircuit() != null ? race.getCircuit().getName() : "TBD",
                race != null && race.getCircuit() != null ? race.getCircuit().getCountry() : "TBD",
                ticket.getTicketType(),
                booking.getQuantity(),
                booking.getTotalAmount(),
                booking.getBookingStatus(),
                booking.getPaymentStatus(),
                booking.getRazorpayPaymentId(),
                booking.getRazorpayOrderId(),
                booking.getBookingDate()
            );
        } catch (Exception e) {
            System.out.println("ERROR converting booking: " + e.getMessage());
            e.printStackTrace();
            return new BookingResponse(
                booking.getId(),
                "Error Loading",
                null,
                "N/A",
                "N/A",
                null,
                booking.getQuantity(),
                booking.getTotalAmount(),
                booking.getBookingStatus(),
                booking.getPaymentStatus(),
                booking.getRazorpayPaymentId(),
                booking.getRazorpayOrderId(),
                booking.getBookingDate()
            );
        }
    }
    
    @Transactional
    public Booking createBooking(Long userId, Long raceTicketId, Long raceEventId, Integer quantity) throws Exception {
        RaceTicket ticket = raceTicketService.getTicketById(raceTicketId);
        
        if (ticket.getAvailableSeats() < quantity) {
            throw new RuntimeException("Not enough seats available");
        }
        
        BigDecimal totalAmount = ticket.getPrice().multiply(new BigDecimal(quantity));
        
        // Create Razorpay order
        String orderId = razorpayService.createOrder(totalAmount);
        
        // Create booking
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setRaceTicketId(raceTicketId);
        booking.setRaceEventId(raceEventId);
        booking.setQuantity(quantity);
        booking.setTotalAmount(totalAmount);
        booking.setRazorpayOrderId(orderId);
        booking.setBookingStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setBookingDate(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    @Transactional
    public Booking confirmPayment(String orderId, String paymentId, String signature) {
        Booking booking = bookingRepository.findByRazorpayOrderId(orderId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (razorpayService.verifyPayment(orderId, paymentId, signature)) {
            booking.setRazorpayPaymentId(paymentId);
            booking.setPaymentStatus(PaymentStatus.SUCCESS);
            booking.setBookingStatus(BookingStatus.CONFIRMED);
            
            // Reserve seats
            raceTicketService.reserveSeats(booking.getRaceTicketId(), booking.getQuantity());
            
            return bookingRepository.save(booking);
        } else {
            booking.setPaymentStatus(PaymentStatus.FAILED);
            return bookingRepository.save(booking);
        }
    }
    
    @Transactional
    public void cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (booking.getBookingStatus() == BookingStatus.CONFIRMED) {
            // Release seats back to available pool
            RaceTicket ticket = raceTicketService.getTicketById(booking.getRaceTicketId());
            ticket.setAvailableSeats(ticket.getAvailableSeats() + booking.getQuantity());
        }
        
        booking.setBookingStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }
}