package com.f1hub.controller;

import com.f1hub.model.Driver;
import com.f1hub.model.DriverStatistics;
import com.f1hub.service.DriverService;
import com.f1hub.service.DriverStatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/driver-stats")
@CrossOrigin
public class AdminDriverStatisticsController {

    private final DriverStatisticsService statsService;
    private final DriverService driverService;

    public AdminDriverStatisticsController(DriverStatisticsService statsService, DriverService driverService) {
        this.statsService = statsService;
        this.driverService = driverService;
    }

    @PostMapping
    public ResponseEntity<?> createStats(@RequestBody DriverStatistics stats, @RequestParam Long driverId) {
        Driver driver = driverService.getDriverById(driverId);
        stats.setDriver(driver);
        return ResponseEntity.ok(statsService.save(stats));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStats(@PathVariable Long id, @RequestBody DriverStatistics updated) {
        DriverStatistics stats = statsService.getById(id);

        stats.setSeasonYear(updated.getSeasonYear());
        stats.setPoints(updated.getPoints());
        stats.setWins(updated.getWins());
        stats.setPodiums(updated.getPodiums());
        stats.setPoles(updated.getPoles());
        stats.setFastestLaps(updated.getFastestLaps());
        stats.setDnfs(updated.getDnfs());

        return ResponseEntity.ok(statsService.save(stats));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStats(@PathVariable Long id) {
        statsService.delete(id);
        return ResponseEntity.ok("Driver stats deleted");
    }

    @GetMapping
    public List<DriverStatistics> getAll() {
        return statsService.getAll();
    }
}
