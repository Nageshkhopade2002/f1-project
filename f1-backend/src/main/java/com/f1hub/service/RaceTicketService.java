package com.f1hub.service;

import com.f1hub.model.RaceTicket;
import com.f1hub.repository.RaceTicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class RaceTicketService {
    
    @Autowired
    private RaceTicketRepository raceTicketRepository;
    
    public List<RaceTicket> getAllTickets() {
        return raceTicketRepository.findAll();
    }
    
    public List<RaceTicket> getAvailableTickets() {
        return raceTicketRepository.findAvailableTickets();
    }
    
    public List<RaceTicket> getTicketsByRaceEvent(Long raceEventId) {
        return raceTicketRepository.findAvailableTicketsByRaceEvent(raceEventId);
    }
    
    public RaceTicket getTicketById(Long id) {
        return raceTicketRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Ticket not found"));
    }
    
    @Transactional
    public RaceTicket createTicket(RaceTicket ticket) {
        // Check if ticket already exists for this race and ticket type
        if (raceTicketRepository.existsByRaceEventIdAndTicketType(
                ticket.getRaceEventId(), 
                ticket.getTicketType())) {
            throw new RuntimeException(
                "Ticket already exists for this race and ticket type"
            );
        }
        
        return raceTicketRepository.save(ticket);
    }
    
    @Transactional
    public RaceTicket updateTicket(Long id, RaceTicket ticketDetails) {
        RaceTicket ticket = getTicketById(id);
        ticket.setTicketType(ticketDetails.getTicketType());
        ticket.setPrice(ticketDetails.getPrice());
        ticket.setTotalSeats(ticketDetails.getTotalSeats());
        ticket.setAvailableSeats(ticketDetails.getAvailableSeats());
        return raceTicketRepository.save(ticket);
    }
    
    @Transactional
    public void deleteTicket(Long id) {
        raceTicketRepository.deleteById(id);
    }
    
    @Transactional
    public boolean reserveSeats(Long ticketId, Integer quantity) {
        RaceTicket ticket = getTicketById(ticketId);
        if (ticket.getAvailableSeats() >= quantity) {
            ticket.setAvailableSeats(ticket.getAvailableSeats() - quantity);
            raceTicketRepository.save(ticket);
            return true;
        }
        return false;
    }
}