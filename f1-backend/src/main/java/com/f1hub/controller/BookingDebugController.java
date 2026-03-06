package com.f1hub.controller;

import com.f1hub.dto.BookingResponse;
import com.f1hub.model.Booking;
import com.f1hub.model.RaceEvent;
import com.f1hub.model.RaceTicket;
import com.f1hub.repository.BookingRepository;
import com.f1hub.repository.RaceEventRepository;
import com.f1hub.repository.RaceTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingDebugController {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private RaceTicketRepository raceTicketRepository;
    
    @Autowired
    private RaceEventRepository raceEventRepository;
    
    @GetMapping("/bookings/{userId}")
    public Map<String, Object> debugBookings(@PathVariable Long userId) {
        Map<String, Object> debug = new HashMap<>();
        
        List<Booking> bookings = bookingRepository.findUserBookingsOrderByDate(userId);
        debug.put("bookingsCount", bookings.size());
        debug.put("bookings", bookings);
        
        if (!bookings.isEmpty()) {
            Booking first = bookings.get(0);
            debug.put("firstBooking", first);
            
            // Check ticket
            raceTicketRepository.findById(first.getRaceTicketId()).ifPresent(ticket -> {
                debug.put("ticket", ticket);
                debug.put("ticketRaceEventId", ticket.getRaceEventId());
            });
            
            // Check race event using booking's race_event_id
            raceEventRepository.findById(first.getRaceEventId()).ifPresent(race -> {
                debug.put("raceEvent", race);
                debug.put("raceName", race.getRaceName());
                debug.put("raceDate", race.getStartDate());
                if (race.getCircuit() != null) {
                    debug.put("circuit", race.getCircuit());
                }
            });
        }
        
        return debug;
    }
}
