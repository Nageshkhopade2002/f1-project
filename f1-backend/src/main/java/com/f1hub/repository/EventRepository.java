package com.f1hub.repository;

import com.f1hub.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Query("SELECT e FROM Event e WHERE e.eventDate > :currentDate ORDER BY e.eventDate ASC")
    List<Event> findUpcomingEvents(LocalDateTime currentDate);
    
    @Query("SELECT e FROM Event e WHERE e.availableSeats > 0 ORDER BY e.eventDate ASC")
    List<Event> findEventsWithAvailableSeats();
    
    List<Event> findByVenueContainingIgnoreCase(String venue);
}