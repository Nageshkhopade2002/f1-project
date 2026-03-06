package com.f1hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "driver_statistics")
public class DriverStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer seasonYear;
    private Integer points;
    private Integer wins;
    private Integer podiums;
    private Integer poles;
    private Integer fastestLaps;
    private Integer dnfs;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    public DriverStatistics() {}

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getSeasonYear() {
        return seasonYear;
    }

    public void setSeasonYear(Integer seasonYear) {
        this.seasonYear = seasonYear;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

    public Integer getWins() {
        return wins;
    }

    public void setWins(Integer wins) {
        this.wins = wins;
    }

    public Integer getPodiums() {
        return podiums;
    }

    public void setPodiums(Integer podiums) {
        this.podiums = podiums;
    }

    public Integer getPoles() {
        return poles;
    }

    public void setPoles(Integer poles) {
        this.poles = poles;
    }

    public Integer getFastestLaps() {
        return fastestLaps;
    }

    public void setFastestLaps(Integer fastestLaps) {
        this.fastestLaps = fastestLaps;
    }

    public Integer getDnfs() {
        return dnfs;
    }

    public void setDnfs(Integer dnfs) {
        this.dnfs = dnfs;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }
}
