package com.f1hub.controller;

import com.f1hub.model.Driver;
import com.f1hub.service.DriverService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@CrossOrigin
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // ===== USER: GET ALL DRIVERS =====
    @GetMapping
    public List<Driver> getAllDrivers() {
        return driverService.getAllDrivers();
    }

    // ===== USER: GET DRIVER BY ID =====
    @GetMapping("/{id}")
    public Driver getDriverById(@PathVariable Long id) {
        return driverService.getDriverById(id);
    }

    // ===== USER: GET DRIVERS BY TEAM =====
    @GetMapping("/team/{teamId}")
    public List<Driver> getDriversByTeam(@PathVariable Long teamId) {
        return driverService.getDriversByTeam(teamId);
    }
}
