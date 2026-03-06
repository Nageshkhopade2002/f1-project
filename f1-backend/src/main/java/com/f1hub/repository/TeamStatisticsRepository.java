package com.f1hub.repository;

import com.f1hub.model.TeamStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamStatisticsRepository extends JpaRepository<TeamStatistics, Long> {
    List<TeamStatistics> findByTeamId(Long teamId);
}
