package com.f1hub.controller;

import com.f1hub.model.Team;
import com.f1hub.model.TeamStatistics;
import com.f1hub.service.TeamService;
import com.f1hub.service.TeamStatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/team-stats")
@CrossOrigin
public class AdminTeamStatisticsController {

    private final TeamStatisticsService statsService;
    private final TeamService teamService;

    public AdminTeamStatisticsController(TeamStatisticsService statsService, TeamService teamService) {
        this.statsService = statsService;
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<?> createStats(@RequestBody TeamStatistics stats, @RequestParam Long teamId) {
        Team team = teamService.getTeamById(teamId);
        stats.setTeam(team);
        return ResponseEntity.ok(statsService.save(stats));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStats(@PathVariable Long id, @RequestBody TeamStatistics updated) {
        TeamStatistics stats = statsService.getById(id);

        stats.setSeasonYear(updated.getSeasonYear());
        stats.setSeasonPosition(updated.getSeasonPosition());
        stats.setSeasonPoints(updated.getSeasonPoints());
        stats.setGrandPrixRaces(updated.getGrandPrixRaces());
        stats.setWins(updated.getWins());
        stats.setPodiums(updated.getPodiums());
        stats.setPoles(updated.getPoles());
        stats.setFastestLaps(updated.getFastestLaps());
        stats.setDnfs(updated.getDnfs());
        stats.setSprintRaces(updated.getSprintRaces());
        stats.setSprintWins(updated.getSprintWins());
        stats.setSprintPodiums(updated.getSprintPodiums());
        stats.setSprintPoles(updated.getSprintPoles());

        return ResponseEntity.ok(statsService.save(stats));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStats(@PathVariable Long id) {
        statsService.delete(id);
        return ResponseEntity.ok("Team stats deleted");
    }

    @GetMapping
    public List<TeamStatistics> getAll() {
        return statsService.getAll();
    }
}
