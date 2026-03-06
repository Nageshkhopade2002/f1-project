package com.f1hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "team_statistics")
public class TeamStatistics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer seasonYear;
    private Integer seasonPosition;
    private Integer seasonPoints;

    private Integer grandPrixRaces;
    private Integer wins;
    private Integer podiums;
    private Integer poles;
    private Integer fastestLaps;
    private Integer dnfs;

    private Integer sprintRaces;
    private Integer sprintWins;
    private Integer sprintPodiums;
    private Integer sprintPoles;

    @ManyToOne
    @JoinColumn(name = "team_id")
    private Team team;

    public TeamStatistics() {}

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

    public Integer getSeasonPosition() {
        return seasonPosition;
    }

    public void setSeasonPosition(Integer seasonPosition) {
        this.seasonPosition = seasonPosition;
    }

    public Integer getSeasonPoints() {
        return seasonPoints;
    }

    public void setSeasonPoints(Integer seasonPoints) {
        this.seasonPoints = seasonPoints;
    }

    public Integer getGrandPrixRaces() {
        return grandPrixRaces;
    }

    public void setGrandPrixRaces(Integer grandPrixRaces) {
        this.grandPrixRaces = grandPrixRaces;
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

    public Integer getSprintRaces() {
        return sprintRaces;
    }

    public void setSprintRaces(Integer sprintRaces) {
        this.sprintRaces = sprintRaces;
    }

    public Integer getSprintWins() {
        return sprintWins;
    }

    public void setSprintWins(Integer sprintWins) {
        this.sprintWins = sprintWins;
    }

    public Integer getSprintPodiums() {
        return sprintPodiums;
    }

    public void setSprintPodiums(Integer sprintPodiums) {
        this.sprintPodiums = sprintPodiums;
    }

    public Integer getSprintPoles() {
        return sprintPoles;
    }

    public void setSprintPoles(Integer sprintPoles) {
        this.sprintPoles = sprintPoles;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}
