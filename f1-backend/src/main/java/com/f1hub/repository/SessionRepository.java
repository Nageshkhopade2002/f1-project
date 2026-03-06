package com.f1hub.repository;

import com.f1hub.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SessionRepository extends JpaRepository<Session, Long> {
    List<Session> findByRaceEvent_Id(Long raceEventId);
}
