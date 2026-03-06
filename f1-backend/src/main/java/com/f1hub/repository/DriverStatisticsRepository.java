package com.f1hub.repository;

import com.f1hub.model.DriverStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverStatisticsRepository extends JpaRepository<DriverStatistics, Long> {
    List<DriverStatistics> findByDriverId(Long driverId);
}
