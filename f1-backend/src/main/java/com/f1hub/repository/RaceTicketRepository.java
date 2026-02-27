package com.f1hub.repository;

import com.f1hub.model.RaceTicket;
import com.f1hub.model.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RaceTicketRepository extends JpaRepository<RaceTicket, Long> {
    
    List<RaceTicket> findByRaceEventId(Long raceEventId);
    
    boolean existsByRaceEventIdAndTicketType(Long raceEventId, TicketType ticketType);
    
    @Query("SELECT rt FROM RaceTicket rt WHERE rt.availableSeats > 0")
    List<RaceTicket> findAvailableTickets();
    
    @Query("SELECT rt FROM RaceTicket rt WHERE rt.raceEventId = ?1 AND rt.availableSeats > 0")
    List<RaceTicket> findAvailableTicketsByRaceEvent(Long raceEventId);
}