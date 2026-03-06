package com.f1hub.controller;

import com.f1hub.model.DriverStatistics;
import com.f1hub.service.DriverStatisticsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/driver-stats")
@CrossOrigin
public class DriverStatisticsController {

    private final DriverStatisticsService statsService;

    public DriverStatisticsController(DriverStatisticsService statsService) {
        this.statsService = statsService;
    }

    @GetMapping("/driver/{driverId}")
    public List<DriverStatistics> getByDriver(@PathVariable Long driverId) {
        return statsService.getByDriver(driverId);
    }
}
