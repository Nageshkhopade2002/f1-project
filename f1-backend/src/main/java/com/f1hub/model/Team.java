package com.f1hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String fullName;
    private String base;
    private String teamChief;
    private String technicalChief;
    private String powerUnit;
    private Integer firstEntryYear;

    private String logoImage;
    private String carImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Team() {}

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getBase() {
        return base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public String getTeamChief() {
        return teamChief;
    }

    public void setTeamChief(String teamChief) {
        this.teamChief = teamChief;
    }

    public String getTechnicalChief() {
        return technicalChief;
    }

    public void setTechnicalChief(String technicalChief) {
        this.technicalChief = technicalChief;
    }

    public String getPowerUnit() {
        return powerUnit;
    }

    public void setPowerUnit(String powerUnit) {
        this.powerUnit = powerUnit;
    }

    public Integer getFirstEntryYear() {
        return firstEntryYear;
    }

    public void setFirstEntryYear(Integer firstEntryYear) {
        this.firstEntryYear = firstEntryYear;
    }

    public String getLogoImage() {
        return logoImage;
    }

    public void setLogoImage(String logoImage) {
        this.logoImage = logoImage;
    }

    public String getCarImage() {
        return carImage;
    }

    public void setCarImage(String carImage) {
        this.carImage = carImage;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
