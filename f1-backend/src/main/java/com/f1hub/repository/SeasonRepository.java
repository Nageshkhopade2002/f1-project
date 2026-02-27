package com.f1hub.repository;

import com.f1hub.model.Season;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeasonRepository extends JpaRepository<Season, Long> {
    Season findByYear(int year);
}
