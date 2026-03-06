package com.f1hub.controller;

import com.f1hub.model.RaceTicket;
import com.f1hub.service.RaceTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:5173")
public class RaceTicketController {
    
    @Autowired
    private RaceTicketService raceTicketService;
    
    @GetMapping
    public ResponseEntity<List<RaceTicket>> getAllAvailableTickets() {
        return ResponseEntity.ok(raceTicketService.getAvailableTickets());
    }
    
    @GetMapping("/race/{raceEventId}")
    public ResponseEntity<List<RaceTicket>> getTicketsByRace(@PathVariable Long raceEventId) {
        return ResponseEntity.ok(raceTicketService.getTicketsByRaceEvent(raceEventId));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RaceTicket> getTicketById(@PathVariable Long id) {
        return ResponseEntity.ok(raceTicketService.getTicketById(id));
    }
}