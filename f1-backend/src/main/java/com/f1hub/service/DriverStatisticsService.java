package com.f1hub.service;

import com.f1hub.model.DriverStatistics;
import com.f1hub.repository.DriverStatisticsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverStatisticsService {

    private final DriverStatisticsRepository repository;

    public DriverStatisticsService(DriverStatisticsRepository repository) {
        this.repository = repository;
    }

    public DriverStatistics save(DriverStatistics stats) {
        return repository.save(stats);
    }

    public List<DriverStatistics> getAll() {
        return repository.findAll();
    }

    public DriverStatistics getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver stats not found"));
    }

    public List<DriverStatistics> getByDriver(Long driverId) {
        return repository.findByDriverId(driverId);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}
