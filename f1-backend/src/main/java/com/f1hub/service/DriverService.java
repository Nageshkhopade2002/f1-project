package com.f1hub.service;

import com.f1hub.model.Driver;
import com.f1hub.repository.DriverRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    public Driver saveDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
    }

    public List<Driver> getDriversByTeam(Long teamId) {
        return driverRepository.findByTeamId(teamId);
    }

    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }
}
