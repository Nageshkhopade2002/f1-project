package com.f1hub.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "circuit")
public class Circuit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String city;

    @Column(name = "track_image")
    private String trackImage;

    @Column(name = "track_outline")
    private String trackOutline;

    // ✅ FIXED (WRAPPER TYPES)
    @Column(name = "circuit_length_km")
    private Double circuitLengthKm;

    @Column(name = "number_of_laps")
    private Integer numberOfLaps;

    @Column(name = "race_distance_km")
    private Double raceDistanceKm;

    @Column(name = "first_grand_prix")
    private Integer firstGrandPrix;

    private String fastestLap;
    private String fastestLapDriver;

    private String timezone;
}
