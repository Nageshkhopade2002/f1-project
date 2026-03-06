package com.f1hub.service;

import com.f1hub.model.TeamStatistics;
import com.f1hub.repository.TeamStatisticsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamStatisticsService {

    private final TeamStatisticsRepository repository;

    public TeamStatisticsService(TeamStatisticsRepository repository) {
        this.repository = repository;
    }

    public TeamStatistics save(TeamStatistics stats) {
        return repository.save(stats);
    }

    public List<TeamStatistics> getAll() {
        return repository.findAll();
    }

    public TeamStatistics getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team stats not found"));
    }

    public List<TeamStatistics> getByTeam(Long teamId) {
        return repository.findByTeamId(teamId);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
