package com.f1hub.repository;

import com.f1hub.model.RaceEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RaceEventRepository extends JpaRepository<RaceEvent, Long> {
    List<RaceEvent> findBySeason_Year(int year);
}
