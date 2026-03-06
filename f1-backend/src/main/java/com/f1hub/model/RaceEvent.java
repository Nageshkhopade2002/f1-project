package com.f1hub.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "race_event")
public class RaceEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "season_id")
    private Season season;

    @ManyToOne
    @JoinColumn(name = "circuit_id")
    private Circuit circuit;

    private Integer roundNumber;
    private String raceName;
    private String eventType; // TESTING / RACE

    private LocalDate startDate;
    private LocalDate endDate;

    private String status = "UPCOMING";

    // getters & setters
}
