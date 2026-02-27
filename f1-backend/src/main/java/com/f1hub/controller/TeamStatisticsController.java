package com.f1hub.controller;

import com.f1hub.model.TeamStatistics;
import com.f1hub.service.TeamStatisticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/team-stats")
@CrossOrigin
public class TeamStatisticsController {

    private final TeamStatisticsService statsService;

    public TeamStatisticsController(TeamStatisticsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/team/{teamId}")
    public List<TeamStatistics> getByTeam(@PathVariable Long teamId) {
        return statsService.getByTeam(teamId);
    }
}
